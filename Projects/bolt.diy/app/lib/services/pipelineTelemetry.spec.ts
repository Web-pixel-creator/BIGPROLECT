/**
 * Tests for Pipeline Telemetry Service
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  emitPipelineRun,
  emitQuarantineWritten,
  getTelemetrySummary,
  getTopViolations,
  getQuarantineStats,
  resetTelemetry,
  getRecentEvents,
  extractFileExt,
  extractViolationCodes,
  extractSanitizerCodes,
  buildViolationCounts,
  type PipelineRunEvent,
  type QuarantineEvent,
} from './pipelineTelemetry';
import type { PipelineResult } from './generationRouter';
import type { UnifiedViolation } from './sectionContracts';
import type { SanitizerWarning } from '~/utils/codeSanitizer';

// ============================================================================
// Test Helpers
// ============================================================================

function createMockPipelineResult(overrides: Partial<PipelineResult> = {}): PipelineResult {
  return {
    success: true,
    code: '<div>test</div>',
    filename: 'test.tsx',
    stages: {
      sanitizer: { ran: true, changed: false },
      validator: { ran: true, valid: true, errors: 0 },
      contract: { ran: false, valid: false, score: 0 },
      autoFix: { ran: false, success: false, attempts: 0 },
    },
    finalValidation: {
      valid: true,
      errors: [],
      fixable: false,
      unifiedViolations: [],
    },
    warnings: [],
    processingTimeMs: 50,
    ...overrides,
  };
}

function createMockViolation(code: string, severity: 'error' | 'warning' = 'error'): UnifiedViolation {
  return {
    code,
    severity,
    message: `Test message for ${code}`,
    autoFixable: true,
  };
}

function createMockSanitizerWarning(code: string): SanitizerWarning {
  return {
    code,
    message: `Sanitizer warning: ${code}`,
    severity: 'warning',
    autoFixable: true,
  };
}

// ============================================================================
// Privacy Filter Tests
// ============================================================================

describe('Privacy Filter', () => {
  describe('extractFileExt', () => {
    it('extracts extension from filename', () => {
      expect(extractFileExt('test.tsx')).toBe('.tsx');
      expect(extractFileExt('styles.css')).toBe('.css');
      expect(extractFileExt('config.json')).toBe('.json');
    });

    it('handles files without extension', () => {
      expect(extractFileExt('Dockerfile')).toBe('');
      expect(extractFileExt('README')).toBe('');
    });

    it('handles multiple dots in filename', () => {
      expect(extractFileExt('component.test.tsx')).toBe('.tsx');
      expect(extractFileExt('file.min.js')).toBe('.js');
    });
  });

  describe('extractViolationCodes', () => {
    it('extracts only codes from violations', () => {
      const violations: UnifiedViolation[] = [
        createMockViolation('SYNTAX_UNCLOSED_TAG'),
        createMockViolation('CONTRACT_HERO_MISSING_H1'),
      ];
      
      const codes = extractViolationCodes(violations);
      
      expect(codes).toEqual(['SYNTAX_UNCLOSED_TAG', 'CONTRACT_HERO_MISSING_H1']);
    });

    it('returns empty array for no violations', () => {
      expect(extractViolationCodes([])).toEqual([]);
    });
  });

  describe('extractSanitizerCodes', () => {
    it('extracts only codes from sanitizer warnings', () => {
      const warnings: SanitizerWarning[] = [
        createMockSanitizerWarning('SANITIZER_REMOVED_IMPORT'),
        createMockSanitizerWarning('SANITIZER_FIXED_QUOTES'),
      ];
      
      const codes = extractSanitizerCodes(warnings);
      
      expect(codes).toEqual(['SANITIZER_REMOVED_IMPORT', 'SANITIZER_FIXED_QUOTES']);
    });
  });

  describe('buildViolationCounts', () => {
    it('counts errors and warnings separately', () => {
      const violations: UnifiedViolation[] = [
        createMockViolation('SYNTAX_ERROR_1', 'error'),
        createMockViolation('SYNTAX_ERROR_2', 'error'),
        createMockViolation('STYLE_WARNING', 'warning'),
      ];
      
      const counts = buildViolationCounts(violations);
      
      expect(counts.errors).toBe(2);
      expect(counts.warnings).toBe(1);
    });

    it('groups by code', () => {
      const violations: UnifiedViolation[] = [
        createMockViolation('SYNTAX_UNCLOSED_TAG'),
        createMockViolation('SYNTAX_UNCLOSED_TAG'),
        createMockViolation('CONTRACT_MISSING_H1'),
      ];
      
      const counts = buildViolationCounts(violations);
      
      expect(counts.byCode).toEqual({
        'SYNTAX_UNCLOSED_TAG': 2,
        'CONTRACT_MISSING_H1': 1,
      });
    });
  });

  describe('Privacy Invariant', () => {
    beforeEach(() => {
      resetTelemetry();
    });

    it('pipeline event does not contain code content', () => {
      const result = createMockPipelineResult({
        code: '<div>sensitive code content</div>',
      });
      
      const event = emitPipelineRun({ result });
      
      expect(event).not.toHaveProperty('code');
      expect(JSON.stringify(event)).not.toContain('sensitive code content');
    });

    it('pipeline event does not contain full file path', () => {
      const result = createMockPipelineResult({
        filename: '/home/user/project/src/components/Button.tsx',
      });
      
      const event = emitPipelineRun({ result });
      
      expect(event.fileExt).toBe('.tsx');
      expect(JSON.stringify(event)).not.toContain('/home/user');
      expect(JSON.stringify(event)).not.toContain('Button');
    });

    it('pipeline event does not contain error messages', () => {
      const result = createMockPipelineResult({
        finalValidation: {
          valid: false,
          errors: [{ message: 'Sensitive error with code snippet: const x = 1', line: 1, column: 1, severity: 'error' }],
          fixable: true,
          unifiedViolations: [createMockViolation('SYNTAX_ERROR')],
        },
      });
      
      const event = emitPipelineRun({ result });
      
      expect(JSON.stringify(event)).not.toContain('Sensitive error');
      expect(JSON.stringify(event)).not.toContain('const x = 1');
    });

    it('quarantine event does not contain code content', () => {
      const event = emitQuarantineWritten({
        filename: '/path/to/secret/file.tsx',
        violations: [createMockViolation('SYNTAX_ERROR')],
        sanitizerWarnings: [],
        metrics: { riskLevel: 'high', linesAdded: 10, linesRemoved: 5, totalChanges: 15 },
      });
      
      expect(event.fileExt).toBe('.tsx');
      expect(JSON.stringify(event)).not.toContain('/path/to/secret');
    });
  });
});


// ============================================================================
// Event Emitter Tests
// ============================================================================

describe('Event Emitters', () => {
  beforeEach(() => {
    resetTelemetry();
  });

  describe('emitPipelineRun', () => {
    it('creates event with correct structure', () => {
      const result = createMockPipelineResult();
      
      const event = emitPipelineRun({ result });
      
      expect(event).toHaveProperty('timestamp');
      expect(event).toHaveProperty('fileExt', '.tsx');
      expect(event).toHaveProperty('success', true);
      expect(event).toHaveProperty('usedFallback', false);
      expect(event).toHaveProperty('quarantined', false);
      expect(event).toHaveProperty('violationCounts');
      expect(event).toHaveProperty('autoFix');
      expect(event).toHaveProperty('timings');
    });

    it('includes section type when provided', () => {
      const result = createMockPipelineResult();
      
      const event = emitPipelineRun({ result, sectionType: 'hero' });
      
      expect(event.sectionType).toBe('hero');
    });

    it('tracks auto-fix stats', () => {
      const result = createMockPipelineResult({
        stages: {
          sanitizer: { ran: true, changed: false },
          validator: { ran: true, valid: false, errors: 1 },
          contract: { ran: false, valid: false, score: 0 },
          autoFix: { ran: true, success: true, attempts: 2 },
        },
      });
      
      const event = emitPipelineRun({ result });
      
      expect(event.autoFix.ran).toBe(true);
      expect(event.autoFix.success).toBe(true);
      expect(event.autoFix.attempts).toBe(2);
    });

    it('includes timing breakdown', () => {
      const result = createMockPipelineResult({ processingTimeMs: 100 });
      
      const event = emitPipelineRun({
        result,
        timings: { sanitizer: 10, validator: 20, contract: 30, autoFix: 40 },
      });
      
      expect(event.timings.sanitizer).toBe(10);
      expect(event.timings.validator).toBe(20);
      expect(event.timings.contract).toBe(30);
      expect(event.timings.autoFix).toBe(40);
      expect(event.timings.total).toBe(100);
    });

    it('has valid ISO timestamp', () => {
      const result = createMockPipelineResult();
      
      const event = emitPipelineRun({ result });
      
      expect(() => new Date(event.timestamp)).not.toThrow();
      expect(event.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('emitQuarantineWritten', () => {
    it('creates event with correct structure', () => {
      const event = emitQuarantineWritten({
        filename: 'test.tsx',
        violations: [createMockViolation('SYNTAX_ERROR')],
        sanitizerWarnings: [createMockSanitizerWarning('SANITIZER_WARNING')],
        metrics: { riskLevel: 'high', linesAdded: 10, linesRemoved: 5, totalChanges: 15 },
        autoFixAttempts: 3,
      });
      
      expect(event).toHaveProperty('timestamp');
      expect(event.fileExt).toBe('.tsx');
      expect(event.violationCodes).toEqual(['SYNTAX_ERROR']);
      expect(event.sanitizerWarningCodes).toEqual(['SANITIZER_WARNING']);
      expect(event.riskLevel).toBe('high');
      expect(event.autoFixAttempts).toBe(3);
    });

    it('defaults to low risk level', () => {
      const event = emitQuarantineWritten({
        filename: 'test.tsx',
        violations: [],
        sanitizerWarnings: [],
      });
      
      expect(event.riskLevel).toBe('low');
    });
  });
});

// ============================================================================
// Aggregator Tests
// ============================================================================

describe('Aggregator', () => {
  beforeEach(() => {
    resetTelemetry();
  });

  describe('Counter Updates', () => {
    it('increments totalRuns on each event', () => {
      const result = createMockPipelineResult();
      
      emitPipelineRun({ result });
      emitPipelineRun({ result });
      emitPipelineRun({ result });
      
      const summary = getTelemetrySummary();
      expect(summary.totalRuns).toBe(3);
    });

    it('tracks success and failure counts', () => {
      emitPipelineRun({ result: createMockPipelineResult({ success: true }) });
      emitPipelineRun({ result: createMockPipelineResult({ success: true }) });
      emitPipelineRun({ result: createMockPipelineResult({ success: false }) });
      
      const summary = getTelemetrySummary();
      expect(summary.successRate).toBeCloseTo(2/3);
    });

    it('tracks fallback usage', () => {
      emitPipelineRun({ result: createMockPipelineResult(), usedFallback: true });
      emitPipelineRun({ result: createMockPipelineResult(), usedFallback: false });
      
      const summary = getTelemetrySummary();
      expect(summary.fallbackRate).toBe(0.5);
    });

    it('tracks quarantine count', () => {
      emitPipelineRun({ result: createMockPipelineResult(), quarantined: true });
      emitPipelineRun({ result: createMockPipelineResult(), quarantined: false });
      emitPipelineRun({ result: createMockPipelineResult(), quarantined: true });
      
      const summary = getTelemetrySummary();
      expect(summary.quarantineRate).toBeCloseTo(2/3);
    });
  });

  describe('ViolationCode Tracking', () => {
    it('tracks violation frequency', () => {
      const result1 = createMockPipelineResult({
        finalValidation: {
          valid: false,
          errors: [],
          fixable: true,
          unifiedViolations: [
            createMockViolation('SYNTAX_UNCLOSED_TAG'),
            createMockViolation('SYNTAX_UNCLOSED_TAG'),
          ],
        },
      });
      
      const result2 = createMockPipelineResult({
        finalValidation: {
          valid: false,
          errors: [],
          fixable: true,
          unifiedViolations: [
            createMockViolation('SYNTAX_UNCLOSED_TAG'),
            createMockViolation('CONTRACT_MISSING_H1'),
          ],
        },
      });
      
      emitPipelineRun({ result: result1 });
      emitPipelineRun({ result: result2 });
      
      const top = getTopViolations(10);
      const syntaxViolation = top.find(v => v.code === 'SYNTAX_UNCLOSED_TAG');
      const contractViolation = top.find(v => v.code === 'CONTRACT_MISSING_H1');
      
      expect(syntaxViolation?.count).toBe(3);
      expect(contractViolation?.count).toBe(1);
    });

    it('calculates violation percentage', () => {
      const result = createMockPipelineResult({
        finalValidation: {
          valid: false,
          errors: [],
          fixable: true,
          unifiedViolations: [
            createMockViolation('CODE_A'),
            createMockViolation('CODE_A'),
            createMockViolation('CODE_A'),
            createMockViolation('CODE_B'),
          ],
        },
      });
      
      emitPipelineRun({ result });
      
      const top = getTopViolations(10);
      const codeA = top.find(v => v.code === 'CODE_A');
      
      expect(codeA?.percentage).toBe(0.75);
    });
  });

  describe('Timing Aggregates', () => {
    it('calculates average timings', () => {
      emitPipelineRun({
        result: createMockPipelineResult({ processingTimeMs: 100 }),
        timings: { sanitizer: 10, validator: 20, contract: 30, autoFix: 40 },
      });
      emitPipelineRun({
        result: createMockPipelineResult({ processingTimeMs: 200 }),
        timings: { sanitizer: 20, validator: 40, contract: 60, autoFix: 80 },
      });
      
      const summary = getTelemetrySummary();
      
      expect(summary.avgTimings.sanitizer).toBe(15);
      expect(summary.avgTimings.validator).toBe(30);
      expect(summary.avgTimings.contract).toBe(45);
      expect(summary.avgTimings.autoFix).toBe(60);
      expect(summary.avgTimings.total).toBe(150);
    });
  });

  describe('Recent Events Ring Buffer', () => {
    it('stores recent events', () => {
      const result = createMockPipelineResult();
      
      emitPipelineRun({ result });
      emitPipelineRun({ result });
      
      const recent = getRecentEvents();
      expect(recent.length).toBe(2);
    });

    it('limits to 100 events', () => {
      const result = createMockPipelineResult();
      
      for (let i = 0; i < 150; i++) {
        emitPipelineRun({ result });
      }
      
      const recent = getRecentEvents();
      expect(recent.length).toBe(100);
    });
  });
});

// ============================================================================
// Telemetry API Tests
// ============================================================================

describe('Telemetry API', () => {
  beforeEach(() => {
    resetTelemetry();
  });

  describe('getTelemetrySummary', () => {
    it('returns zeros for empty store', () => {
      const summary = getTelemetrySummary();
      
      expect(summary.totalRuns).toBe(0);
      expect(summary.successRate).toBe(0);
      expect(summary.quarantineRate).toBe(0);
      expect(summary.fallbackRate).toBe(0);
      expect(summary.autoFixSuccessRate).toBe(0);
    });

    it('calculates correct rates', () => {
      // 3 runs: 2 success, 1 failure, 1 quarantine, 1 fallback
      emitPipelineRun({ result: createMockPipelineResult({ success: true }) });
      emitPipelineRun({ result: createMockPipelineResult({ success: true }), quarantined: true });
      emitPipelineRun({ result: createMockPipelineResult({ success: false }), usedFallback: true });
      
      const summary = getTelemetrySummary();
      
      expect(summary.totalRuns).toBe(3);
      expect(summary.successRate).toBeCloseTo(2/3);
      expect(summary.quarantineRate).toBeCloseTo(1/3);
      expect(summary.fallbackRate).toBeCloseTo(1/3);
    });
  });

  describe('getTopViolations', () => {
    it('returns empty array for no violations', () => {
      const top = getTopViolations(5);
      expect(top).toEqual([]);
    });

    it('sorts by frequency descending', () => {
      const result = createMockPipelineResult({
        finalValidation: {
          valid: false,
          errors: [],
          fixable: true,
          unifiedViolations: [
            createMockViolation('RARE_CODE'),
            createMockViolation('COMMON_CODE'),
            createMockViolation('COMMON_CODE'),
            createMockViolation('COMMON_CODE'),
          ],
        },
      });
      
      emitPipelineRun({ result });
      
      const top = getTopViolations(10);
      
      expect(top[0].code).toBe('COMMON_CODE');
      expect(top[0].count).toBe(3);
      expect(top[1].code).toBe('RARE_CODE');
      expect(top[1].count).toBe(1);
    });

    it('limits to N results', () => {
      const violations = Array.from({ length: 20 }, (_, i) => 
        createMockViolation(`CODE_${i}`)
      );
      
      const result = createMockPipelineResult({
        finalValidation: {
          valid: false,
          errors: [],
          fixable: true,
          unifiedViolations: violations,
        },
      });
      
      emitPipelineRun({ result });
      
      const top = getTopViolations(5);
      expect(top.length).toBe(5);
    });
  });

  describe('getQuarantineStats', () => {
    it('returns zeros for no quarantines', () => {
      const stats = getQuarantineStats();
      
      expect(stats.total).toBe(0);
      expect(stats.topViolationCodes).toEqual([]);
      expect(stats.avgAutoFixAttempts).toBe(0);
    });

    it('tracks quarantine by risk level', () => {
      emitQuarantineWritten({
        filename: 'test1.tsx',
        violations: [createMockViolation('ERROR_1')],
        sanitizerWarnings: [],
        metrics: { riskLevel: 'high', linesAdded: 10, linesRemoved: 5, totalChanges: 15 },
      });
      emitQuarantineWritten({
        filename: 'test2.tsx',
        violations: [createMockViolation('ERROR_2')],
        sanitizerWarnings: [],
        metrics: { riskLevel: 'high', linesAdded: 10, linesRemoved: 5, totalChanges: 15 },
      });
      emitQuarantineWritten({
        filename: 'test3.tsx',
        violations: [createMockViolation('ERROR_3')],
        sanitizerWarnings: [],
        metrics: { riskLevel: 'low', linesAdded: 10, linesRemoved: 5, totalChanges: 15 },
      });
      
      const stats = getQuarantineStats();
      
      expect(stats.byRiskLevel.high).toBe(2);
      expect(stats.byRiskLevel.low).toBe(1);
    });

    it('calculates average auto-fix attempts', () => {
      emitQuarantineWritten({
        filename: 'test1.tsx',
        violations: [],
        sanitizerWarnings: [],
        autoFixAttempts: 2,
      });
      emitQuarantineWritten({
        filename: 'test2.tsx',
        violations: [],
        sanitizerWarnings: [],
        autoFixAttempts: 4,
      });
      
      const stats = getQuarantineStats();
      
      expect(stats.avgAutoFixAttempts).toBe(3);
    });
  });

  describe('resetTelemetry', () => {
    it('clears all data', () => {
      emitPipelineRun({ result: createMockPipelineResult() });
      emitQuarantineWritten({
        filename: 'test.tsx',
        violations: [createMockViolation('ERROR')],
        sanitizerWarnings: [],
      });
      
      resetTelemetry();
      
      const summary = getTelemetrySummary();
      const top = getTopViolations(10);
      const quarantine = getQuarantineStats();
      const recent = getRecentEvents();
      
      expect(summary.totalRuns).toBe(0);
      expect(top).toEqual([]);
      expect(quarantine.total).toBe(0);
      expect(recent).toEqual([]);
    });
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('Integration', () => {
  beforeEach(() => {
    resetTelemetry();
  });

  it('full pipeline flow updates all stats', () => {
    // Simulate a pipeline run with violations
    const result = createMockPipelineResult({
      success: false,
      stages: {
        sanitizer: { ran: true, changed: true },
        validator: { ran: true, valid: false, errors: 2 },
        contract: { ran: true, valid: false, score: 60 },
        autoFix: { ran: true, success: false, attempts: 3 },
      },
      finalValidation: {
        valid: false,
        errors: [],
        fixable: true,
        unifiedViolations: [
          createMockViolation('SYNTAX_UNCLOSED_TAG'),
          createMockViolation('CONTRACT_HERO_MISSING_H1'),
        ],
      },
      processingTimeMs: 150,
    });
    
    emitPipelineRun({
      result,
      sectionType: 'hero',
      quarantined: true,
      timings: { sanitizer: 10, validator: 30, contract: 50, autoFix: 60 },
    });
    
    // Emit quarantine event
    emitQuarantineWritten({
      filename: 'hero.tsx',
      violations: [
        createMockViolation('SYNTAX_UNCLOSED_TAG'),
        createMockViolation('CONTRACT_HERO_MISSING_H1'),
      ],
      sanitizerWarnings: [createMockSanitizerWarning('SANITIZER_REMOVED_IMPORT')],
      metrics: { riskLevel: 'high', linesAdded: 50, linesRemoved: 10, totalChanges: 60 },
      autoFixAttempts: 3,
    });
    
    // Verify summary
    const summary = getTelemetrySummary();
    expect(summary.totalRuns).toBe(1);
    expect(summary.successRate).toBe(0);
    expect(summary.quarantineRate).toBe(1);
    
    // Verify top violations
    const top = getTopViolations(10);
    expect(top.length).toBe(2);
    expect(top.some(v => v.code === 'SYNTAX_UNCLOSED_TAG')).toBe(true);
    
    // Verify quarantine stats
    const quarantine = getQuarantineStats();
    expect(quarantine.byRiskLevel.high).toBe(1);
    expect(quarantine.avgAutoFixAttempts).toBe(3);
  });

  it('multiple runs aggregate correctly', () => {
    // Run 1: Success
    emitPipelineRun({
      result: createMockPipelineResult({ success: true, processingTimeMs: 50 }),
      timings: { sanitizer: 5, validator: 10, contract: 15, autoFix: 0 },
    });
    
    // Run 2: Failure with auto-fix
    emitPipelineRun({
      result: createMockPipelineResult({
        success: false,
        stages: {
          sanitizer: { ran: true, changed: false },
          validator: { ran: true, valid: false, errors: 1 },
          contract: { ran: false, valid: false, score: 0 },
          autoFix: { ran: true, success: false, attempts: 2 },
        },
        processingTimeMs: 200,
      }),
      quarantined: true,
      timings: { sanitizer: 10, validator: 20, contract: 0, autoFix: 150 },
    });
    
    // Run 3: Success with fallback
    emitPipelineRun({
      result: createMockPipelineResult({ success: true, processingTimeMs: 150 }),
      usedFallback: true,
      timings: { sanitizer: 15, validator: 30, contract: 45, autoFix: 0 },
    });
    
    const summary = getTelemetrySummary();
    
    expect(summary.totalRuns).toBe(3);
    expect(summary.successRate).toBeCloseTo(2/3);
    expect(summary.quarantineRate).toBeCloseTo(1/3);
    expect(summary.fallbackRate).toBeCloseTo(1/3);
    expect(summary.avgTimings.total).toBeCloseTo((50 + 200 + 150) / 3);
  });
});
