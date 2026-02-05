/**
 * Tests for Pipeline Telemetry Service
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  emitComponentContextEvent,
  emitDesignQualityEvent,
  emitPipelineRun,
  emitQuarantineWritten,
  getComponentContextSummary,
  getDesignTelemetrySummary,
  getTelemetrySummary,
  getTopViolations,
  getQuarantineStats,
  getRecentComponentContextEvents,
  getRecentDesignEvents,
  getVariantStats,
  resetTelemetry,
  getRecentEvents,
  extractFileExt,
  extractViolationCodes,
  extractSanitizerCodes,
  buildViolationCounts,
} from './pipelineTelemetry';
import type { PipelineResult } from './generationRouter';
import type { UnifiedViolation, ViolationCode } from './sectionContracts';
import type { SanitizerWarning, SanitizerWarningCode } from '~/utils/codeSanitizer';

/*
 * ============================================================================
 * Test Helpers
 * ============================================================================
 */

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

function createMockViolation(code: ViolationCode, severity: 'error' | 'warning' = 'error'): UnifiedViolation {
  return {
    code,
    severity,
    message: `Test message for ${code}`,
    autoFixable: true,
  };
}

function createMockSanitizerWarning(code: SanitizerWarningCode): SanitizerWarning {
  return {
    code,
    message: `Sanitizer warning: ${code}`,
    risk: 'low',
  };
}

/*
 * ============================================================================
 * Privacy Filter Tests
 * ============================================================================
 */

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
        createMockViolation('SYNTAX_JSX_UNCLOSED'),
        createMockViolation('CONTRACT_HERO_MISSING_H1'),
      ];

      const codes = extractViolationCodes(violations);

      expect(codes).toEqual(['SYNTAX_JSX_UNCLOSED', 'CONTRACT_HERO_MISSING_H1']);
    });

    it('returns empty array for no violations', () => {
      expect(extractViolationCodes([])).toEqual([]);
    });
  });

  describe('extractSanitizerCodes', () => {
    it('extracts only codes from sanitizer warnings', () => {
      const warnings: SanitizerWarning[] = [
        createMockSanitizerWarning('SANITIZER_FIX_IMPORTS_MALFORMED'),
        createMockSanitizerWarning('SANITIZER_FIX_UNTERMINATED_STRING'),
      ];

      const codes = extractSanitizerCodes(warnings);

      expect(codes).toEqual(['SANITIZER_FIX_IMPORTS_MALFORMED', 'SANITIZER_FIX_UNTERMINATED_STRING']);
    });
  });

  describe('buildViolationCounts', () => {
    it('counts errors and warnings separately', () => {
      const violations: UnifiedViolation[] = [
        createMockViolation('SYNTAX_BRACE_EXPECTED', 'error'),
        createMockViolation('SYNTAX_PAREN_EXPECTED', 'error'),
        createMockViolation('CONTRACT_OTHER', 'warning'),
      ];

      const counts = buildViolationCounts(violations);

      expect(counts.errors).toBe(2);
      expect(counts.warnings).toBe(1);
    });

    it('groups by code', () => {
      const violations: UnifiedViolation[] = [
        createMockViolation('SYNTAX_JSX_UNCLOSED'),
        createMockViolation('SYNTAX_JSX_UNCLOSED'),
        createMockViolation('CONTRACT_HERO_MISSING_H1'),
      ];

      const counts = buildViolationCounts(violations);

      expect(counts.byCode).toEqual({
        SYNTAX_JSX_UNCLOSED: 2,
        CONTRACT_HERO_MISSING_H1: 1,
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
          errors: [
            {
              message: 'Sensitive error with code snippet: const x = 1',
              line: 1,
              column: 1,
              code: 1001,
              severity: 'error',
            },
          ],
          fixable: true,
          unifiedViolations: [createMockViolation('SYNTAX_OTHER')],
        },
      });

      const event = emitPipelineRun({ result });

      expect(JSON.stringify(event)).not.toContain('Sensitive error');
      expect(JSON.stringify(event)).not.toContain('const x = 1');
    });

    it('quarantine event does not contain code content', () => {
      const event = emitQuarantineWritten({
        filename: '/path/to/secret/file.tsx',
        violations: [createMockViolation('SYNTAX_OTHER')],
        sanitizerWarnings: [],
        metrics: { riskLevel: 'high', changedLinesPercent: 10, charsAdded: 100, charsRemoved: 50, highRiskFixes: 1 },
      });

      expect(event.fileExt).toBe('.tsx');
      expect(JSON.stringify(event)).not.toContain('/path/to/secret');
    });
  });

});

/*
 * ============================================================================
 * Event Emitter Tests
 * ============================================================================
 */

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

    it('includes promptVariant when provided', () => {
      const result = createMockPipelineResult();
      const event = emitPipelineRun({ result, promptVariant: 'baseline' });
      expect(event.promptVariant).toBe('baseline');
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
        violations: [createMockViolation('SYNTAX_OTHER')],
        sanitizerWarnings: [createMockSanitizerWarning('SANITIZER_FIX_OTHER')],
        metrics: { riskLevel: 'high', changedLinesPercent: 10, charsAdded: 100, charsRemoved: 50, highRiskFixes: 1 },
        autoFixAttempts: 3,
      });

      expect(event).toHaveProperty('timestamp');
      expect(event.fileExt).toBe('.tsx');
      expect(event.violationCodes).toEqual(['SYNTAX_OTHER']);
      expect(event.sanitizerWarningCodes).toEqual(['SANITIZER_FIX_OTHER']);
      expect(event.riskLevel).toBe('high');
      expect(event.autoFixAttempts).toBe(3);
    });

    it('includes promptVariant when provided', () => {
      const event = emitQuarantineWritten({
        filename: 'test.tsx',
        violations: [],
        sanitizerWarnings: [],
        promptVariant: 'fewshot-v1',
      });
      expect(event.promptVariant).toBe('fewshot-v1');
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

  describe('emitDesignQualityEvent', () => {
    it('tracks design quality metrics', () => {
      emitDesignQualityEvent({
        variantIndex: 0,
        variantCount: 3,
        selected: true,
        designQualityScore: 72,
        rankingScore: 78,
        designCueCoverage: {
          typography: true,
          layout: true,
          visualHierarchy: false,
          motion: false,
        },
        stylePackId: 'pack-a',
        layoutArchetype: 'stacked-grid',
        duplicateLayout: false,
        signatureMoveCount: 2,
        effectCount: 1,
        componentMemoryCount: 1,
        sectionCount: 5,
        componentMatchRate: 0.8,
        componentFallbackRate: 0.2,
        repeatPenaltyTriggered: true,
        avgCandidatesPerSection: 4,
      });

      emitDesignQualityEvent({
        variantIndex: 1,
        variantCount: 3,
        selected: false,
        designQualityScore: 60,
        rankingScore: 55,
        designCueCoverage: {
          typography: true,
          layout: false,
          visualHierarchy: true,
          motion: true,
        },
        stylePackId: 'pack-b',
        layoutArchetype: 'split-hero',
        duplicateLayout: true,
        signatureMoveCount: 1,
        effectCount: 0,
        componentMemoryCount: 0,
        sectionCount: 4,
        componentMatchRate: 0.5,
        componentFallbackRate: 0.5,
        repeatPenaltyTriggered: false,
        avgCandidatesPerSection: 2,
      });

      const summary = getDesignTelemetrySummary();
      expect(summary.totalVariants).toBe(2);
      expect(summary.selectedVariantRate).toBeCloseTo(0.5);
      expect(summary.avgDesignQualityScore).toBeCloseTo(66);
      expect(summary.minDesignQualityScore).toBe(60);
      expect(summary.maxDesignQualityScore).toBe(72);
      expect(summary.avgSelectedQualityScore).toBeCloseTo(72);
      expect(summary.duplicateLayoutRate).toBeCloseTo(0.5);
      expect(summary.coverageRate.typography).toBeCloseTo(1);
      expect(summary.coverageRate.layout).toBeCloseTo(0.5);
      expect(summary.coverageRate.visualHierarchy).toBeCloseTo(0.5);
      expect(summary.coverageRate.motion).toBeCloseTo(0.5);
      expect(summary.avgComponentMatchRate).toBeCloseTo(0.65);
      expect(summary.avgComponentFallbackRate).toBeCloseTo(0.35);
      expect(summary.repeatPenaltyRate).toBeCloseTo(0.5);
      expect(summary.avgCandidatesPerSection).toBeCloseTo(3);
      expect(summary.topStylePacks).toEqual(
        expect.arrayContaining([
          { id: 'pack-a', count: 1 },
          { id: 'pack-b', count: 1 },
        ]),
      );

      const recent = getRecentDesignEvents();
      expect(recent).toHaveLength(2);
      expect(recent[0]).toHaveProperty('designQualityScore', 72);
    });
  });

  describe('emitComponentContextEvent', () => {
    it('tracks usage and truncation metrics', () => {
      emitComponentContextEvent({
        used: true,
        truncated: false,
        componentCount: 3,
        charCount: 900,
      });
      emitComponentContextEvent({
        used: true,
        truncated: true,
        componentCount: 2,
        charCount: 12000,
      });
      emitComponentContextEvent({
        used: false,
        truncated: false,
        componentCount: 0,
        charCount: 0,
      });

      const summary = getComponentContextSummary();
      expect(summary.totalRuns).toBe(3);
      expect(summary.usageRate).toBeCloseTo(2 / 3);
      expect(summary.truncationRate).toBeCloseTo(1 / 2);
      expect(summary.avgComponents).toBeCloseTo(2.5);
      expect(summary.avgChars).toBeCloseTo((900 + 12000) / 2);

      const recent = getRecentComponentContextEvents();
      expect(recent).toHaveLength(3);
      expect(recent[0]).toHaveProperty('used', true);
    });
  });
});

/*
 * ============================================================================
 * Aggregator Tests
 * ============================================================================
 */

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
      expect(summary.successRate).toBeCloseTo(2 / 3);
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
      expect(summary.quarantineRate).toBeCloseTo(2 / 3);
    });
  });

  describe('ViolationCode Tracking', () => {
    it('tracks violation frequency', () => {
      const result1 = createMockPipelineResult({
        finalValidation: {
          valid: false,
          errors: [],
          fixable: true,
          unifiedViolations: [createMockViolation('SYNTAX_JSX_UNCLOSED'), createMockViolation('SYNTAX_JSX_UNCLOSED')],
        },
      });

      const result2 = createMockPipelineResult({
        finalValidation: {
          valid: false,
          errors: [],
          fixable: true,
          unifiedViolations: [
            createMockViolation('SYNTAX_JSX_UNCLOSED'),
            createMockViolation('CONTRACT_HERO_MISSING_H1'),
          ],
        },
      });

      emitPipelineRun({ result: result1 });
      emitPipelineRun({ result: result2 });

      const top = getTopViolations(10);
      const syntaxViolation = top.find((v) => v.code === 'SYNTAX_JSX_UNCLOSED');
      const contractViolation = top.find((v) => v.code === 'CONTRACT_HERO_MISSING_H1');

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
            createMockViolation('SYNTAX_OTHER'),
            createMockViolation('SYNTAX_OTHER'),
            createMockViolation('SYNTAX_OTHER'),
            createMockViolation('CONTRACT_OTHER'),
          ],
        },
      });

      emitPipelineRun({ result });

      const top = getTopViolations(10);
      const codeA = top.find((v) => v.code === 'SYNTAX_OTHER');

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

/*
 * ============================================================================
 * Telemetry API Tests
 * ============================================================================
 */

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
      expect(summary.successRate).toBeCloseTo(2 / 3);
      expect(summary.quarantineRate).toBeCloseTo(1 / 3);
      expect(summary.fallbackRate).toBeCloseTo(1 / 3);
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
            createMockViolation('CONTRACT_OTHER'),
            createMockViolation('SYNTAX_OTHER'),
            createMockViolation('SYNTAX_OTHER'),
            createMockViolation('SYNTAX_OTHER'),
          ],
        },
      });

      emitPipelineRun({ result });

      const top = getTopViolations(10);

      expect(top[0].code).toBe('SYNTAX_OTHER');
      expect(top[0].count).toBe(3);
      expect(top[1].code).toBe('CONTRACT_OTHER');
      expect(top[1].count).toBe(1);
    });

    it('limits to N results', () => {
      const pool: ViolationCode[] = [
        'SYNTAX_OTHER',
        'SYNTAX_BRACE_EXPECTED',
        'SYNTAX_PAREN_EXPECTED',
        'SYNTAX_BRACKET_EXPECTED',
        'SYNTAX_IDENTIFIER_EXPECTED',
        'SYNTAX_EXPRESSION_EXPECTED',
        'SYNTAX_DECLARATION_EXPECTED',
        'SYNTAX_JSX_TAG_MISMATCH',
        'SYNTAX_JSX_UNCLOSED',
        'SYNTAX_UNBALANCED_BRACES',
        'SYNTAX_UNBALANCED_PARENS',
        'SYNTAX_DUPLICATE_IMPORT',
        'SYNTAX_MULTIPLE_EXPORT_DEFAULT',
        'CONTRACT_OTHER',
        'CONTRACT_HERO_MISSING_H1',
        'CONTRACT_HERO_MISSING_CTA',
        'CONTRACT_HERO_MISSING_VISUAL',
        'CONTRACT_MISSING_TAILWIND',
        'CONTRACT_MISSING_RESPONSIVE',
        'CONTRACT_MISSING_NAMED_EXPORT',
      ];

      const violations = pool.map((code) => createMockViolation(code));

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
        violations: [createMockViolation('SYNTAX_OTHER')],
        sanitizerWarnings: [],
        metrics: { riskLevel: 'high', changedLinesPercent: 10, charsAdded: 100, charsRemoved: 50, highRiskFixes: 1 },
      });
      emitQuarantineWritten({
        filename: 'test2.tsx',
        violations: [createMockViolation('SYNTAX_BRACE_EXPECTED')],
        sanitizerWarnings: [],
        metrics: { riskLevel: 'high', changedLinesPercent: 12, charsAdded: 90, charsRemoved: 40, highRiskFixes: 1 },
      });
      emitQuarantineWritten({
        filename: 'test3.tsx',
        violations: [createMockViolation('CONTRACT_OTHER')],
        sanitizerWarnings: [],
        metrics: { riskLevel: 'low', changedLinesPercent: 5, charsAdded: 20, charsRemoved: 10, highRiskFixes: 0 },
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

  describe('getVariantStats', () => {
    it('returns empty array when no variant-tagged events exist', () => {
      emitPipelineRun({ result: createMockPipelineResult() });
      expect(getVariantStats()).toEqual([]);
    });

    it('aggregates stats per promptVariant', () => {
      emitPipelineRun({
        result: createMockPipelineResult({
          success: true,
          stages: {
            sanitizer: { ran: true, changed: false },
            validator: { ran: true, valid: false, errors: 1 },
            contract: { ran: false, valid: false, score: 0 },
            autoFix: { ran: true, success: true, attempts: 2 },
          },
        }),
        promptVariant: 'baseline',
        quarantined: false,
        timings: { autoFix: 100 },
      });

      emitPipelineRun({
        result: createMockPipelineResult({
          success: false,
          stages: {
            sanitizer: { ran: true, changed: false },
            validator: { ran: true, valid: false, errors: 1 },
            contract: { ran: false, valid: false, score: 0 },
            autoFix: { ran: true, success: false, attempts: 3 },
          },
        }),
        promptVariant: 'baseline',
        quarantined: true,
        timings: { autoFix: 200 },
      });

      emitPipelineRun({
        result: createMockPipelineResult({
          success: true,
          stages: {
            sanitizer: { ran: true, changed: false },
            validator: { ran: true, valid: false, errors: 1 },
            contract: { ran: false, valid: false, score: 0 },
            autoFix: { ran: true, success: true, attempts: 1 },
          },
        }),
        promptVariant: 'fewshot-v1',
        quarantined: false,
        timings: { autoFix: 50 },
      });

      emitQuarantineWritten({
        filename: 'test.tsx',
        violations: [createMockViolation('SYNTAX_OTHER')],
        sanitizerWarnings: [],
        promptVariant: 'fewshot-v1',
      });

      const stats = getVariantStats();
      const baseline = stats.find((s) => s.variant === 'baseline');
      const fewshot = stats.find((s) => s.variant === 'fewshot-v1');

      expect(baseline).toBeTruthy();
      expect(baseline!.totalRuns).toBe(2);
      expect(baseline!.successRate).toBeCloseTo(0.5);
      expect(baseline!.quarantineRate).toBeCloseTo(0.5);
      expect(baseline!.avgAttempts).toBeCloseTo((2 + 3) / 2);
      expect(baseline!.avgRepairLatencyMs).toBeCloseTo((100 + 200) / 2);

      expect(fewshot).toBeTruthy();
      expect(fewshot!.totalRuns).toBe(1);
      expect(fewshot!.successRate).toBeCloseTo(1);
      expect(fewshot!.quarantineRate).toBeCloseTo(1);
      expect(fewshot!.avgAttempts).toBeCloseTo(1);
      expect(fewshot!.avgRepairLatencyMs).toBeCloseTo(50);
    });
  });

  describe('resetTelemetry', () => {
    it('clears all data', () => {
      emitPipelineRun({ result: createMockPipelineResult() });
      emitQuarantineWritten({
        filename: 'test.tsx',
        violations: [createMockViolation('SYNTAX_OTHER')],
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

/*
 * ============================================================================
 * Integration Tests
 * ============================================================================
 */

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
          createMockViolation('SYNTAX_JSX_UNCLOSED'),
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
      violations: [createMockViolation('SYNTAX_JSX_UNCLOSED'), createMockViolation('CONTRACT_HERO_MISSING_H1')],
      sanitizerWarnings: [createMockSanitizerWarning('SANITIZER_FIX_IMPORTS_MALFORMED')],
      metrics: { riskLevel: 'high', changedLinesPercent: 50, charsAdded: 500, charsRemoved: 100, highRiskFixes: 2 },
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
    expect(top.some((v) => v.code === 'SYNTAX_JSX_UNCLOSED')).toBe(true);

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
    expect(summary.successRate).toBeCloseTo(2 / 3);
    expect(summary.quarantineRate).toBeCloseTo(1 / 3);
    expect(summary.fallbackRate).toBeCloseTo(1 / 3);
    expect(summary.avgTimings.total).toBeCloseTo((50 + 200 + 150) / 3);
  });
});
