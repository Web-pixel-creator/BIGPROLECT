/**
 * Tests for Generation Router module
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  routeThroughPipeline,
  determineStrategy,
  enhancePromptWithContract,
  recordPipelineResult,
  getPipelineStats,
  resetPipelineStats,
  type PipelineResult,
} from './generationRouter';

describe('generationRouter', () => {
  beforeEach(() => {
    resetPipelineStats();
  });

  describe('routeThroughPipeline', () => {
    it('processes valid code successfully', async () => {
      const code = `
export function HeroSection() {
  return (
    <section className="py-20 md:py-32">
      <h1>Welcome</h1>
    </section>
  );
}`;
      const result = await routeThroughPipeline(code, 'HeroSection.tsx');

      expect(result.success).toBe(true);
      expect(result.stages.sanitizer.ran).toBe(true);
      expect(result.stages.validator.ran).toBe(true);
      expect(result.stages.validator.valid).toBe(true);
    });

    it('runs sanitizer and reports changes', async () => {
      // Code with truncated button tag that sanitizer can fix
      const code = `
export const Button = () => {
  return <butt className="px-4">Click</butt>;
};`;
      const result = await routeThroughPipeline(code, 'Button.tsx');

      expect(result.stages.sanitizer.ran).toBe(true);
      expect(result.stages.sanitizer.changed).toBe(true);
    });

    it('validates code after sanitization', async () => {
      const code = `
export function Component() {
  return <div className="p-4">Hello</div>;
}`;
      const result = await routeThroughPipeline(code, 'Component.tsx');

      expect(result.stages.validator.ran).toBe(true);
      expect(result.finalValidation.valid).toBe(true);
    });

    it('runs contract validation when sectionType provided', async () => {
      const code = `
export function HeroSection() {
  return (
    <section className="py-20 md:py-32">
      <h1>Welcome</h1>
      <button>CTA</button>
    </section>
  );
}`;
      const result = await routeThroughPipeline(code, 'HeroSection.tsx', {
        sectionType: 'hero',
      });

      expect(result.stages.contract.ran).toBe(true);
      expect(result.contractValidation).toBeDefined();
    });

    it('skips contract validation when skipContractValidation is true', async () => {
      const code = `
export function HeroSection() {
  return <div className="p-4">Hello</div>;
}`;
      const result = await routeThroughPipeline(code, 'HeroSection.tsx', {
        sectionType: 'hero',
        skipContractValidation: true,
      });

      expect(result.stages.contract.ran).toBe(false);
    });

    it('attempts quick fix for invalid code', async () => {
      // Code with issue that quick fix might help
      const code = `
export const Button = () = > {
  return <butt className="px-4">Click</butt>;
};`;
      const result = await routeThroughPipeline(code, 'Button.tsx');

      expect(result.stages.sanitizer.ran).toBe(true);
    });

    it('skips auto-fix when skipAutoFix is true', async () => {
      const code = `
export function Component() {
  return <div className="p-4">Hello</div>
}`;
      const result = await routeThroughPipeline(code, 'Component.tsx', {
        skipAutoFix: true,
      });

      // Auto-fix should not run even if validation fails
      expect(result.stages.autoFix.ran).toBe(false);
    });

    it('records processing time', async () => {
      const code = `
export function Component() {
  return <div className="p-4">Hello</div>;
}`;
      const result = await routeThroughPipeline(code, 'Component.tsx');

      expect(result.processingTimeMs).toBeGreaterThanOrEqual(0);
    });

    it('collects warnings from contract validation', async () => {
      const code = `
export function HeroSection() {
  return <div className="p-4">Hello</div>;
}`;
      const result = await routeThroughPipeline(code, 'HeroSection.tsx', {
        sectionType: 'hero',
      });

      // Should have warnings about missing h1, button, etc.
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('handles CSS files', async () => {
      const code = `.button { color: red; }`;
      const result = await routeThroughPipeline(code, 'styles.css');

      expect(result.success).toBe(true);
      expect(result.stages.validator.ran).toBe(true);
    });

    it('handles JSON files', async () => {
      const code = `{"name": "test", "version": "1.0.0"}`;
      const result = await routeThroughPipeline(code, 'package.json');

      expect(result.success).toBe(true);
    });
  });

  describe('determineStrategy', () => {
    it('returns modular strategy for website requests', () => {
      const result = determineStrategy('Create a landing page for my startup');
      expect(result.strategy).toBe('modular');
      expect(result.plan).toBeDefined();
    });

    it('returns modular strategy for SaaS requests', () => {
      const result = determineStrategy('Build a SaaS website with pricing');
      expect(result.strategy).toBe('modular');
      expect(result.plan?.sections).toContain('pricing');
    });

    it('returns single strategy for component requests', () => {
      const result = determineStrategy('Create a button component');
      expect(result.strategy).toBe('single');
    });

    it('returns single strategy for card requests', () => {
      const result = determineStrategy('Make a product card component');
      expect(result.strategy).toBe('single');
    });

    it('returns single strategy for ambiguous requests', () => {
      const result = determineStrategy('Make something cool');
      expect(result.strategy).toBe('single');
    });

    it('handles Russian website requests', () => {
      const result = determineStrategy('Создай лендинг для стартапа');
      expect(result.strategy).toBe('modular');
    });

    it('handles Russian component requests', () => {
      const result = determineStrategy('Сделай компонент кнопки');
      expect(result.strategy).toBe('single');
    });

    it('prefers website over component when both mentioned', () => {
      const result = determineStrategy('Create a website with button components');
      expect(result.strategy).toBe('modular');
    });

    it('includes reason in result', () => {
      const result = determineStrategy('Create a landing page');
      expect(result.reason).toBeTruthy();
      expect(result.reason.length).toBeGreaterThan(0);
    });
  });

  describe('enhancePromptWithContract', () => {
    it('adds contract hints to prompt', () => {
      const basePrompt = 'Create a hero section';
      const enhanced = enhancePromptWithContract(basePrompt, 'hero');

      expect(enhanced).toContain(basePrompt);
      expect(enhanced).toContain('QUALITY REQUIREMENTS');
      expect(enhanced).toContain('h1');
    });

    it('includes responsive hints', () => {
      const enhanced = enhancePromptWithContract('Create navigation', 'navigation');
      expect(enhanced).toContain('responsive');
    });

    it('includes section-specific hints', () => {
      const enhanced = enhancePromptWithContract('Create pricing', 'pricing');
      expect(enhanced).toContain('tier');
      expect(enhanced).toContain('price');
    });
  });

  describe('pipeline statistics', () => {
    it('starts with zero stats', () => {
      const stats = getPipelineStats();
      expect(stats.totalRuns).toBe(0);
      expect(stats.successRate).toBe(0);
    });

    it('records successful pipeline result', async () => {
      const code = `export function Test() { return <div className="p-4">Hi</div>; }`;
      const result = await routeThroughPipeline(code, 'Test.tsx');
      recordPipelineResult(result);

      const stats = getPipelineStats();
      expect(stats.totalRuns).toBe(1);
      expect(stats.successRate).toBe(1);
    });

    it('calculates success rate correctly', () => {
      const successResult: PipelineResult = {
        success: true,
        code: '',
        filename: 'test.tsx',
        stages: {
          sanitizer: { ran: true, changed: false },
          validator: { ran: true, valid: true, errors: 0 },
          contract: { ran: false, valid: false, score: 0 },
          autoFix: { ran: false, success: false, attempts: 0 },
        },
        finalValidation: { valid: true, errors: [], fixable: false },
        warnings: [],
        processingTimeMs: 10,
      };

      const failResult: PipelineResult = {
        ...successResult,
        success: false,
        finalValidation: { valid: false, errors: [], fixable: false },
      };

      recordPipelineResult(successResult);
      recordPipelineResult(successResult);
      recordPipelineResult(failResult);

      const stats = getPipelineStats();
      expect(stats.totalRuns).toBe(3);
      expect(stats.successRate).toBeCloseTo(0.667, 2);
    });

    it('tracks sanitizer fix rate', () => {
      const withFix: PipelineResult = {
        success: true,
        code: '',
        filename: 'test.tsx',
        stages: {
          sanitizer: { ran: true, changed: true },
          validator: { ran: true, valid: true, errors: 0 },
          contract: { ran: false, valid: false, score: 0 },
          autoFix: { ran: false, success: false, attempts: 0 },
        },
        finalValidation: { valid: true, errors: [], fixable: false },
        warnings: [],
        processingTimeMs: 10,
      };

      const withoutFix: PipelineResult = {
        ...withFix,
        stages: { ...withFix.stages, sanitizer: { ran: true, changed: false } },
      };

      recordPipelineResult(withFix);
      recordPipelineResult(withoutFix);

      const stats = getPipelineStats();
      expect(stats.sanitizerFixRate).toBe(0.5);
    });

    it('tracks auto-fix success rate', () => {
      const autoFixSuccess: PipelineResult = {
        success: true,
        code: '',
        filename: 'test.tsx',
        stages: {
          sanitizer: { ran: true, changed: false },
          validator: { ran: true, valid: true, errors: 0 },
          contract: { ran: false, valid: false, score: 0 },
          autoFix: { ran: true, success: true, attempts: 2 },
        },
        finalValidation: { valid: true, errors: [], fixable: false },
        warnings: [],
        processingTimeMs: 100,
      };

      const autoFixFail: PipelineResult = {
        ...autoFixSuccess,
        success: false,
        stages: { ...autoFixSuccess.stages, autoFix: { ran: true, success: false, attempts: 3 } },
      };

      recordPipelineResult(autoFixSuccess);
      recordPipelineResult(autoFixFail);

      const stats = getPipelineStats();
      expect(stats.autoFixSuccessRate).toBe(0.5);
    });

    it('tracks contract pass rate', () => {
      const contractPass: PipelineResult = {
        success: true,
        code: '',
        filename: 'test.tsx',
        stages: {
          sanitizer: { ran: true, changed: false },
          validator: { ran: true, valid: true, errors: 0 },
          contract: { ran: true, valid: true, score: 100 },
          autoFix: { ran: false, success: false, attempts: 0 },
        },
        finalValidation: { valid: true, errors: [], fixable: false },
        warnings: [],
        processingTimeMs: 10,
      };

      const contractFail: PipelineResult = {
        ...contractPass,
        stages: { ...contractPass.stages, contract: { ran: true, valid: false, score: 60 } },
      };

      recordPipelineResult(contractPass);
      recordPipelineResult(contractFail);

      const stats = getPipelineStats();
      expect(stats.contractPassRate).toBe(0.5);
    });

    it('calculates average processing time', () => {
      const result1: PipelineResult = {
        success: true,
        code: '',
        filename: 'test.tsx',
        stages: {
          sanitizer: { ran: true, changed: false },
          validator: { ran: true, valid: true, errors: 0 },
          contract: { ran: false, valid: false, score: 0 },
          autoFix: { ran: false, success: false, attempts: 0 },
        },
        finalValidation: { valid: true, errors: [], fixable: false },
        warnings: [],
        processingTimeMs: 100,
      };

      const result2: PipelineResult = { ...result1, processingTimeMs: 200 };

      recordPipelineResult(result1);
      recordPipelineResult(result2);

      const stats = getPipelineStats();
      expect(stats.avgProcessingTimeMs).toBe(150);
    });

    it('resets stats correctly', () => {
      const result: PipelineResult = {
        success: true,
        code: '',
        filename: 'test.tsx',
        stages: {
          sanitizer: { ran: true, changed: true },
          validator: { ran: true, valid: true, errors: 0 },
          contract: { ran: true, valid: true, score: 100 },
          autoFix: { ran: true, success: true, attempts: 1 },
        },
        finalValidation: { valid: true, errors: [], fixable: false },
        warnings: [],
        processingTimeMs: 50,
      };

      recordPipelineResult(result);
      resetPipelineStats();

      const stats = getPipelineStats();
      expect(stats.totalRuns).toBe(0);
      expect(stats.successRate).toBe(0);
      expect(stats.avgProcessingTimeMs).toBe(0);
    });
  });
});
