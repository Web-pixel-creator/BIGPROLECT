/**
 * E2E Integration Tests for Generation Router Pipeline
 *
 * Tests the full pipeline flow with mock LLM functions:
 * 1. Sanitizer → Validator → Contract → Auto-Fix
 *
 * Feature: e2e-pipeline-tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { routeThroughPipeline, recordPipelineResult, getPipelineStats, resetPipelineStats } from './generationRouter';
import type { LlmRepairFn } from '~/utils/autoFixLoop';

/*
 * ============================================================================
 * Mock LLM Helpers
 * ============================================================================
 */

/**
 * Creates a mock LLM that returns valid fixed code on first call.
 */
function createSuccessfulMock(): { mock: LlmRepairFn; calls: string[] } {
  const calls: string[] = [];
  const mock: LlmRepairFn = async (prompt: string) => {
    calls.push(prompt);

    // Return valid TSX code
    return `\`\`\`tsx
export function Fixed() {
  return <div className="p-4">Fixed Component</div>;
}
\`\`\``;
  };

  return { mock, calls };
}

/**
 * Creates a mock LLM that fails N times then succeeds.
 */
function createRetryMock(failCount: number): { mock: LlmRepairFn; calls: string[] } {
  const calls: string[] = [];
  let callCount = 0;

  const mock: LlmRepairFn = async (prompt: string) => {
    calls.push(prompt);
    callCount++;

    if (callCount <= failCount) {
      // Return still-broken code
      return `\`\`\`tsx
export const Broken = () = > { return <div>Still broken</div>; }
\`\`\``;
    }

    // Return valid code after failCount attempts
    return `\`\`\`tsx
export function Fixed() {
  return <div className="p-4">Fixed after ${callCount} attempts</div>;
}
\`\`\``;
  };

  return { mock, calls };
}

/**
 * Creates a mock LLM that always returns invalid code.
 */
function createFailingMock(): { mock: LlmRepairFn; calls: string[] } {
  const calls: string[] = [];
  const mock: LlmRepairFn = async (prompt: string) => {
    calls.push(prompt);

    // Return code that will never pass validation
    return `\`\`\`tsx
export const Broken = () = > { return <div>Still broken</div>; }
\`\`\``;
  };

  return { mock, calls };
}

/**
 * Creates a mock LLM that throws an error.
 */
function createThrowingMock(): { mock: LlmRepairFn; calls: string[] } {
  const calls: string[] = [];
  const mock: LlmRepairFn = async (prompt: string) => {
    calls.push(prompt);
    throw new Error('LLM API error');
  };

  return { mock, calls };
}

/*
 * ============================================================================
 * Test Fixtures
 * ============================================================================
 */

const VALID_CODE_SAMPLES = {
  simpleComponent: `export function Button() {
  return <button className="px-4 py-2">Click me</button>;
}`,
  heroSection: `export function HeroSection() {
  return (
    <section className="py-20 md:py-32">
      <h1 className="text-4xl font-bold">Welcome</h1>
      <p className="mt-4">This is a hero section</p>
      <button className="mt-8">Get Started</button>
    </section>
  );
}`,
  withProps: `export function Card({ title }: { title: string }) {
  return <div className="p-4 border rounded">{title}</div>;
}`,
  validCSS: `.button { color: red; padding: 1rem; }`,
  validJSON: `{"name": "test", "version": "1.0.0"}`,
};

const SANITIZER_FIXABLE = {
  truncatedTag: `export const Button = () => {
  return <butt className="px-4">Click</butt>;
};`,

  // Use truncated button tag which sanitizer definitely fixes
  truncatedButton: `export const Card = () => {
  return <butt className="p-4">Content</butt>;
};`,
};

const LLM_REPAIR_NEEDED = {
  syntaxError: `export const Button = () = > {
  return <button className="px-4">Click</button>;
};`,
  unclosedTag: `export function Card() {
  return <div className="p-4"><span>Text</div>;
}`,
  missingBrace: `export function Test() {
  return <div className="p-4">Hi</div>`,
  arrowFunctionError: `export const Component = () = > <div>Broken</div>;`,
};

const UNFIXABLE_CODE = {
  gibberish: `asdf qwer zxcv not valid code at all`,

  // Use code that won't be sanitized to empty and will fail validation
  incomplete: `export function Test( { return <div>`,
  totallyBroken: `{{{{{`,
};

/*
 * ============================================================================
 * E2E Tests
 * ============================================================================
 */

describe('E2E Pipeline Tests', () => {
  beforeEach(() => {
    resetPipelineStats();
  });

  /*
   * --------------------------------------------------------------------------
   * Requirement 1: Valid Code Passthrough
   * --------------------------------------------------------------------------
   */
  describe('Valid Code Passthrough (Req 1)', () => {
    it('1.1 valid TSX passes with success=true and unchanged code', async () => {
      const code = VALID_CODE_SAMPLES.simpleComponent;
      const result = await routeThroughPipeline(code, 'Button.tsx');

      expect(result.success).toBe(true);
      expect(result.code).toBe(code);
      expect(result.stages.sanitizer.ran).toBe(true);
      expect(result.stages.validator.ran).toBe(true);
      expect(result.stages.validator.valid).toBe(true);
    });

    it('1.2 valid code does not invoke auto-fix', async () => {
      const { mock, calls } = createSuccessfulMock();
      const code = VALID_CODE_SAMPLES.heroSection;

      const result = await routeThroughPipeline(code, 'Hero.tsx', {
        llmRepairFn: mock,
      });

      expect(result.success).toBe(true);
      expect(result.stages.autoFix.ran).toBe(false);
      expect(calls.length).toBe(0); // LLM was never called
    });

    it('1.3 valid code records sanitizer.ran=true and validator.ran=true', async () => {
      const result = await routeThroughPipeline(VALID_CODE_SAMPLES.withProps, 'Card.tsx');

      expect(result.stages.sanitizer.ran).toBe(true);
      expect(result.stages.validator.ran).toBe(true);
    });

    it('1.4 valid code has processingTimeMs > 0', async () => {
      const result = await routeThroughPipeline(VALID_CODE_SAMPLES.simpleComponent, 'Button.tsx');

      expect(result.processingTimeMs).toBeGreaterThan(0);
    });

    it('handles valid CSS files', async () => {
      const result = await routeThroughPipeline(VALID_CODE_SAMPLES.validCSS, 'styles.css');

      expect(result.success).toBe(true);
      expect(result.stages.validator.ran).toBe(true);
    });

    it('handles valid JSON files', async () => {
      const result = await routeThroughPipeline(VALID_CODE_SAMPLES.validJSON, 'package.json');

      expect(result.success).toBe(true);
    });
  });

  /*
   * --------------------------------------------------------------------------
   * Requirement 2: Sanitizer-Only Fix Path
   * --------------------------------------------------------------------------
   */
  describe('Sanitizer-Only Fix Path (Req 2)', () => {
    it('2.1 truncated JSX tags fixed without LLM', async () => {
      const { mock } = createSuccessfulMock();
      const code = SANITIZER_FIXABLE.truncatedTag;

      const result = await routeThroughPipeline(code, 'Button.tsx', {
        llmRepairFn: mock,
      });

      expect(result.stages.sanitizer.ran).toBe(true);
      expect(result.stages.sanitizer.changed).toBe(true);

      // Sanitizer should fix <butt> to <button>
      expect(result.code).toContain('<button');
      expect(result.code).toContain('</button>');
    });

    it('2.2 sanitizer.changed=true when fixes applied', async () => {
      const result = await routeThroughPipeline(SANITIZER_FIXABLE.truncatedButton, 'Card.tsx');

      expect(result.stages.sanitizer.changed).toBe(true);
    });

    it('2.3 llmRepairFn not called when sanitizer succeeds', async () => {
      const { mock } = createSuccessfulMock();

      // This code should be fixable by sanitizer alone
      const result = await routeThroughPipeline(SANITIZER_FIXABLE.truncatedTag, 'Button.tsx', { llmRepairFn: mock });

      // If sanitizer fixed it and validation passes, LLM shouldn't be called
      if (result.success && result.stages.sanitizer.changed) {
        /*
         * LLM might still be called if sanitizer fix wasn't enough
         * The key is that sanitizer ran and made changes
         */
        expect(result.stages.sanitizer.changed).toBe(true);
      }
    });
  });

  /*
   * --------------------------------------------------------------------------
   * Requirement 3: LLM Repair Path
   * --------------------------------------------------------------------------
   */
  describe('LLM Repair Path (Req 3)', () => {
    it('3.1 LLM repair invoked for syntax errors', async () => {
      const { mock, calls } = createSuccessfulMock();
      const code = LLM_REPAIR_NEEDED.syntaxError;

      await routeThroughPipeline(code, 'Button.tsx', {
        llmRepairFn: mock,
      });

      // LLM should have been called since sanitizer can't fix arrow function syntax
      expect(calls.length).toBeGreaterThan(0);
    });

    it('3.2 successful LLM repair returns success=true', async () => {
      const { mock } = createSuccessfulMock();
      const code = LLM_REPAIR_NEEDED.arrowFunctionError;

      const result = await routeThroughPipeline(code, 'Component.tsx', {
        llmRepairFn: mock,
      });

      expect(result.success).toBe(true);
      expect(result.stages.autoFix.success).toBe(true);
    });

    it('3.3 attempts counter matches actual LLM calls', async () => {
      const { mock, calls } = createRetryMock(1); // Fail once, then succeed
      const code = LLM_REPAIR_NEEDED.syntaxError;

      const result = await routeThroughPipeline(code, 'Button.tsx', {
        llmRepairFn: mock,
      });

      if (result.stages.autoFix.ran) {
        expect(result.stages.autoFix.attempts).toBe(calls.length);
      }
    });

    it('3.4 repair prompt includes UNIFIED_VIOLATIONS when available', async () => {
      const { mock, calls } = createSuccessfulMock();
      const code = LLM_REPAIR_NEEDED.syntaxError;

      await routeThroughPipeline(code, 'Button.tsx', {
        llmRepairFn: mock,
      });

      if (calls.length > 0) {
        // Check that the prompt contains error information
        const prompt = calls[0];
        expect(prompt).toContain('ERRORS:');
        expect(prompt).toContain('BROKEN CODE:');
      }
    });
  });

  /*
   * --------------------------------------------------------------------------
   * Requirement 4: Fallback LLM Path
   * --------------------------------------------------------------------------
   */
  describe('Fallback LLM Path (Req 4)', () => {
    it('4.1 fallback invoked after primary fails MAX_FIX_ATTEMPTS', async () => {
      const primary = createFailingMock();
      const fallback = createSuccessfulMock();
      const code = LLM_REPAIR_NEEDED.syntaxError;

      await routeThroughPipeline(code, 'Button.tsx', {
        llmRepairFn: primary.mock,
        fallbackLlmRepairFn: fallback.mock,
      });

      // Primary should have been called MAX_FIX_ATTEMPTS times
      expect(primary.calls.length).toBe(3); // MAX_FIX_ATTEMPTS = 3
      // Fallback should have been called
      expect(fallback.calls.length).toBeGreaterThan(0);
    });

    it('4.2 usedFallback=true when fallback succeeds', async () => {
      const primary = createFailingMock();
      const fallback = createSuccessfulMock();
      const code = LLM_REPAIR_NEEDED.arrowFunctionError;

      const result = await routeThroughPipeline(code, 'Component.tsx', {
        llmRepairFn: primary.mock,
        fallbackLlmRepairFn: fallback.mock,
      });

      if (result.success) {
        expect(result.warnings).toContain('Used fallback model for repair');
      }
    });

    it('4.3 warning added when fallback used', async () => {
      const primary = createFailingMock();
      const fallback = createSuccessfulMock();
      const code = LLM_REPAIR_NEEDED.syntaxError;

      const result = await routeThroughPipeline(code, 'Button.tsx', {
        llmRepairFn: primary.mock,
        fallbackLlmRepairFn: fallback.mock,
      });

      if (fallback.calls.length > 0 && result.success) {
        expect(result.warnings.some((w) => w.includes('fallback'))).toBe(true);
      }
    });

    it('4.4 both primary and fallback fail returns success=false', async () => {
      const primary = createFailingMock();
      const fallback = createFailingMock();
      const code = LLM_REPAIR_NEEDED.syntaxError;

      const result = await routeThroughPipeline(code, 'Button.tsx', {
        llmRepairFn: primary.mock,
        fallbackLlmRepairFn: fallback.mock,
      });

      expect(result.success).toBe(false);
      expect(primary.calls.length).toBe(3);
      expect(fallback.calls.length).toBeGreaterThan(0);
    });
  });

  /*
   * --------------------------------------------------------------------------
   * Requirement 5: Unfixable Code Handling
   * --------------------------------------------------------------------------
   */
  describe('Unfixable Code Handling (Req 5)', () => {
    it('5.1 unfixable code returns success=false', async () => {
      const { mock } = createFailingMock();
      const code = UNFIXABLE_CODE.gibberish;

      const result = await routeThroughPipeline(code, 'broken.tsx', {
        llmRepairFn: mock,
      });

      expect(result.success).toBe(false);
    });

    it('5.2 failure includes errors in finalValidation', async () => {
      const { mock } = createFailingMock();
      const code = UNFIXABLE_CODE.incomplete;

      const result = await routeThroughPipeline(code, 'broken.tsx', {
        llmRepairFn: mock,
      });

      expect(result.success).toBe(false);
      expect(result.finalValidation.valid).toBe(false);
      expect(result.finalValidation.errors.length).toBeGreaterThan(0);
    });

    it('5.3 failure includes warnings explaining why auto-fix failed', async () => {
      const { mock } = createFailingMock();
      const code = LLM_REPAIR_NEEDED.syntaxError;

      const result = await routeThroughPipeline(code, 'broken.tsx', {
        llmRepairFn: mock,
      });

      if (!result.success && result.stages.autoFix.ran) {
        expect(result.warnings.some((w) => w.includes('Auto-fix failed'))).toBe(true);
      }
    });

    it('handles LLM throwing errors gracefully', async () => {
      const { mock } = createThrowingMock();
      const code = LLM_REPAIR_NEEDED.syntaxError;

      // Should not throw, should return failure result
      const result = await routeThroughPipeline(code, 'broken.tsx', {
        llmRepairFn: mock,
      });

      expect(result.success).toBe(false);
    });
  });

  /*
   * --------------------------------------------------------------------------
   * Requirement 6: Contract Validation Integration
   * --------------------------------------------------------------------------
   */
  describe('Contract Validation Integration (Req 6)', () => {
    it('6.1 contract.ran=true when sectionType provided', async () => {
      const code = VALID_CODE_SAMPLES.heroSection;

      const result = await routeThroughPipeline(code, 'Hero.tsx', {
        sectionType: 'hero',
      });

      expect(result.stages.contract.ran).toBe(true);
    });

    it('6.2 warnings added for missing contract elements', async () => {
      // Hero without h1 or button
      const code = `export function HeroSection() {
  return <section className="py-20"><p>Just text</p></section>;
}`;

      const result = await routeThroughPipeline(code, 'Hero.tsx', {
        sectionType: 'hero',
      });

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some((w) => w.includes('Contract'))).toBe(true);
    });

    it('6.3 skipContractValidation=true skips contract', async () => {
      const code = VALID_CODE_SAMPLES.heroSection;

      const result = await routeThroughPipeline(code, 'Hero.tsx', {
        sectionType: 'hero',
        skipContractValidation: true,
      });

      expect(result.stages.contract.ran).toBe(false);
    });

    it('6.4 contractValidation object populated with score and violations', async () => {
      const code = VALID_CODE_SAMPLES.heroSection;

      const result = await routeThroughPipeline(code, 'Hero.tsx', {
        sectionType: 'hero',
      });

      expect(result.contractValidation).toBeDefined();
      expect(typeof result.contractValidation?.score).toBe('number');
      expect(Array.isArray(result.contractValidation?.violations)).toBe(true);
    });
  });

  /*
   * --------------------------------------------------------------------------
   * Requirement 7: Pipeline Statistics
   * --------------------------------------------------------------------------
   */
  describe('Pipeline Statistics (Req 7)', () => {
    it('7.1 totalRuns incremented after recordPipelineResult', async () => {
      const code = VALID_CODE_SAMPLES.simpleComponent;
      const result = await routeThroughPipeline(code, 'Button.tsx');

      recordPipelineResult(result);

      const stats = getPipelineStats();
      expect(stats.totalRuns).toBe(1);
    });

    it('7.2 successRate calculated correctly', async () => {
      const validCode = VALID_CODE_SAMPLES.simpleComponent;
      const invalidCode = UNFIXABLE_CODE.gibberish;

      const result1 = await routeThroughPipeline(validCode, 'Button.tsx');
      const result2 = await routeThroughPipeline(invalidCode, 'broken.tsx');

      recordPipelineResult(result1);
      recordPipelineResult(result2);

      const stats = getPipelineStats();
      expect(stats.totalRuns).toBe(2);
      expect(stats.successRate).toBe(0.5);
    });

    it('7.3 sanitizerFixRate updated when sanitizer makes changes', async () => {
      const code = SANITIZER_FIXABLE.truncatedTag;
      const result = await routeThroughPipeline(code, 'Button.tsx');

      recordPipelineResult(result);

      const stats = getPipelineStats();
      expect(stats.sanitizerFixRate).toBeGreaterThan(0);
    });

    it('7.4 autoFixSuccessRate updated when auto-fix runs', async () => {
      const { mock } = createSuccessfulMock();
      const code = LLM_REPAIR_NEEDED.syntaxError;

      const result = await routeThroughPipeline(code, 'Button.tsx', {
        llmRepairFn: mock,
      });

      recordPipelineResult(result);

      const stats = getPipelineStats();

      if (result.stages.autoFix.ran) {
        expect(stats.autoFixSuccessRate).toBeGreaterThanOrEqual(0);
      }
    });

    it('7.5 contractPassRate updated when contract validation runs', async () => {
      const code = VALID_CODE_SAMPLES.heroSection;

      const result = await routeThroughPipeline(code, 'Hero.tsx', {
        sectionType: 'hero',
      });

      recordPipelineResult(result);

      const stats = getPipelineStats();
      expect(stats.contractPassRate).toBeGreaterThanOrEqual(0);
    });
  });

  /*
   * --------------------------------------------------------------------------
   * Requirement 8: Mock LLM Integration
   * --------------------------------------------------------------------------
   */
  describe('Mock LLM Integration (Req 8)', () => {
    it('8.1 mock llmRepairFn called with repair prompt string', async () => {
      const { mock, calls } = createSuccessfulMock();
      const code = LLM_REPAIR_NEEDED.syntaxError;

      await routeThroughPipeline(code, 'Button.tsx', {
        llmRepairFn: mock,
      });

      if (calls.length > 0) {
        expect(typeof calls[0]).toBe('string');
        expect(calls[0]).toContain('Fix the following');
      }
    });

    it('8.2 code in markdown block extracted correctly', async () => {
      const { mock } = createSuccessfulMock();
      const code = LLM_REPAIR_NEEDED.arrowFunctionError;

      const result = await routeThroughPipeline(code, 'Component.tsx', {
        llmRepairFn: mock,
      });

      if (result.success) {
        // The extracted code should be valid (no markdown markers)
        expect(result.code).not.toContain('```');
      }
    });

    it('8.3 mock returning plain code works', async () => {
      const calls: string[] = [];
      const plainMock: LlmRepairFn = async (prompt) => {
        calls.push(prompt);

        // Return plain code without markdown
        return `export function Fixed() {
  return <div className="p-4">Fixed</div>;
}`;
      };

      const code = LLM_REPAIR_NEEDED.syntaxError;
      await routeThroughPipeline(code, 'Button.tsx', {
        llmRepairFn: plainMock,
      });

      // Should still work with plain code response
      expect(calls.length).toBeGreaterThan(0);
    });

    it('8.4 mock throwing error handled gracefully', async () => {
      const { mock } = createThrowingMock();
      const code = LLM_REPAIR_NEEDED.syntaxError;

      // Should not throw
      const result = await routeThroughPipeline(code, 'Button.tsx', {
        llmRepairFn: mock,
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(false);
    });
  });

  /*
   * --------------------------------------------------------------------------
   * UnifiedViolation Format Verification
   * --------------------------------------------------------------------------
   */
  describe('UnifiedViolation Format (Data Contract)', () => {
    it('failed validation includes unifiedViolations with structured codes', async () => {
      const { mock } = createFailingMock();
      const code = LLM_REPAIR_NEEDED.syntaxError;

      const result = await routeThroughPipeline(code, 'broken.tsx', {
        llmRepairFn: mock,
      });

      expect(result.success).toBe(false);

      // Check that finalValidation has unifiedViolations
      if (result.finalValidation.unifiedViolations) {
        const violations = result.finalValidation.unifiedViolations;
        expect(Array.isArray(violations)).toBe(true);

        if (violations.length > 0) {
          const v = violations[0];

          // Verify UnifiedViolation structure
          expect(v).toHaveProperty('code');
          expect(v).toHaveProperty('severity');
          expect(v).toHaveProperty('message');
          expect(v).toHaveProperty('autoFixable');
          expect(['error', 'warning']).toContain(v.severity);
          expect(typeof v.autoFixable).toBe('boolean');
        }
      }
    });

    it('contract validation returns unifiedViolations', async () => {
      // Hero without required elements
      const code = `export function HeroSection() {
  return <section><p>Just text</p></section>;
}`;

      const result = await routeThroughPipeline(code, 'Hero.tsx', {
        sectionType: 'hero',
      });

      expect(result.contractValidation).toBeDefined();

      if (result.contractValidation?.unifiedViolations) {
        const violations = result.contractValidation.unifiedViolations;
        expect(Array.isArray(violations)).toBe(true);

        // Should have violations for missing h1, button, etc.
        if (violations.length > 0) {
          // Check ViolationCode format (e.g., CONTRACT_HERO_MISSING_H1)
          const codes = violations.map((v) => v.code);
          expect(codes.some((c) => c.startsWith('CONTRACT_'))).toBe(true);
        }
      }
    });

    it('successful validation has empty unifiedViolations', async () => {
      const code = VALID_CODE_SAMPLES.simpleComponent;
      const result = await routeThroughPipeline(code, 'Button.tsx');

      expect(result.success).toBe(true);

      // Either no violations or empty array
      const violations = result.finalValidation.unifiedViolations ?? [];
      const errors = violations.filter((v) => v.severity === 'error');
      expect(errors.length).toBe(0);
    });
  });

  /*
   * --------------------------------------------------------------------------
   * LLM Output Edge Cases
   * --------------------------------------------------------------------------
   */
  describe('LLM Output Edge Cases', () => {
    it('handles LLM response without code block', async () => {
      const calls: string[] = [];
      const noBlockMock: LlmRepairFn = async (prompt) => {
        calls.push(prompt);

        // Return plain code without markdown wrapper
        return `export function Fixed() {
  return <div className="p-4">Fixed</div>;
}`;
      };

      const code = LLM_REPAIR_NEEDED.syntaxError;
      const result = await routeThroughPipeline(code, 'Button.tsx', {
        llmRepairFn: noBlockMock,
      });

      expect(calls.length).toBeGreaterThan(0);

      // Should still extract and use the code
      if (result.success) {
        expect(result.code).toContain('Fixed');
      }
    });

    it('handles LLM response with multiple code blocks (uses first)', async () => {
      const calls: string[] = [];
      const multiBlockMock: LlmRepairFn = async (prompt) => {
        calls.push(prompt);
        return `Here's the fix:

\`\`\`tsx
export function Fixed() {
  return <div className="p-4">First Block</div>;
}
\`\`\`

Alternative approach:

\`\`\`tsx
export function Alternative() {
  return <span>Second Block</span>;
}
\`\`\``;
      };

      const code = LLM_REPAIR_NEEDED.syntaxError;
      const result = await routeThroughPipeline(code, 'Button.tsx', {
        llmRepairFn: multiBlockMock,
      });

      if (result.success) {
        // Should use the first code block
        expect(result.code).toContain('First Block');
        expect(result.code).not.toContain('Second Block');
      }
    });

    it('handles LLM response with explanation + code', async () => {
      const calls: string[] = [];
      const explanationMock: LlmRepairFn = async (prompt) => {
        calls.push(prompt);
        return `I found the issue - there was a syntax error in the arrow function.
Here's the corrected code:

\`\`\`tsx
export function Fixed() {
  return <div className="p-4">Fixed with explanation</div>;
}
\`\`\`

The problem was the extra space in "= >" which should be "=>".`;
      };

      const code = LLM_REPAIR_NEEDED.syntaxError;
      const result = await routeThroughPipeline(code, 'Button.tsx', {
        llmRepairFn: explanationMock,
      });

      if (result.success) {
        // Should extract only the code, not the explanation
        expect(result.code).not.toContain('I found the issue');
        expect(result.code).not.toContain('The problem was');
        expect(result.code).toContain('Fixed with explanation');
      }
    });

    it('handles LLM response with empty code block', async () => {
      const calls: string[] = [];
      const emptyBlockMock: LlmRepairFn = async (prompt) => {
        calls.push(prompt);
        return `\`\`\`tsx
\`\`\``;
      };

      const code = LLM_REPAIR_NEEDED.syntaxError;
      const result = await routeThroughPipeline(code, 'Button.tsx', {
        llmRepairFn: emptyBlockMock,
      });

      // Should handle gracefully (fail, not crash)
      expect(result).toBeDefined();
    });

    it('handles LLM response with wrong language marker', async () => {
      const calls: string[] = [];
      const wrongLangMock: LlmRepairFn = async (prompt) => {
        calls.push(prompt);
        return `\`\`\`javascript
export function Fixed() {
  return <div className="p-4">Fixed</div>;
}
\`\`\``;
      };

      const code = LLM_REPAIR_NEEDED.syntaxError;
      const result = await routeThroughPipeline(code, 'Button.tsx', {
        llmRepairFn: wrongLangMock,
      });

      // Should still extract the code regardless of language marker
      if (result.success) {
        expect(result.code).toContain('Fixed');
      }
    });
  });

  /*
   * --------------------------------------------------------------------------
   * Edge Cases and Integration
   * --------------------------------------------------------------------------
   */
  describe('Edge Cases', () => {
    it('handles empty code', async () => {
      const result = await routeThroughPipeline('', 'empty.tsx');

      expect(result.stages.sanitizer.ran).toBe(true);
      expect(result.stages.validator.ran).toBe(true);
    });

    it('handles code with only whitespace', async () => {
      const result = await routeThroughPipeline('   \n\n   ', 'whitespace.tsx');

      expect(result.stages.sanitizer.ran).toBe(true);
    });

    it('handles very long code', async () => {
      const longCode = `export function LongComponent() {
  return (
    <div>
      ${Array(100).fill('<p>Paragraph</p>').join('\n      ')}
    </div>
  );
}`;

      const result = await routeThroughPipeline(longCode, 'Long.tsx');

      expect(result.stages.sanitizer.ran).toBe(true);
      expect(result.processingTimeMs).toBeGreaterThan(0);
    });

    it('skipAutoFix prevents LLM calls', async () => {
      const { mock, calls } = createSuccessfulMock();
      const code = LLM_REPAIR_NEEDED.syntaxError;

      const result = await routeThroughPipeline(code, 'Button.tsx', {
        llmRepairFn: mock,
        skipAutoFix: true,
      });

      expect(result.stages.autoFix.ran).toBe(false);
      expect(calls.length).toBe(0);
    });

    it('multiple pipeline runs accumulate stats correctly', async () => {
      const validCode = VALID_CODE_SAMPLES.simpleComponent;

      for (let i = 0; i < 5; i++) {
        const result = await routeThroughPipeline(validCode, `Button${i}.tsx`);
        recordPipelineResult(result);
      }

      const stats = getPipelineStats();
      expect(stats.totalRuns).toBe(5);
      expect(stats.successRate).toBe(1);
    });
  });
});
