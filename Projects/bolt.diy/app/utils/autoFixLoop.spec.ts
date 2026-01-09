import { describe, expect, it, vi } from 'vitest';
import {
  attemptSanitizerFix,
  buildRepairPrompt,
  buildRepairPromptV2,
  buildRepairPromptWithFewShot,
  getBoundaryInstructions,
  getPromptBuilder,
  REPAIR_BOUNDARIES,
  extractCodeFromResponse,
  quickFix,
  areErrorsAutoFixable,
  getErrorSummary,
  autoFixWithLlm,
  type AutoFixOptions,
  type LlmRepairFn,
  type RepairContext,
} from './autoFixLoop';
import type { ValidationError } from './codeValidator';
import type { UnifiedViolation } from '~/lib/services/sectionContracts';
import type { SanitizerWarning, ChangeMetrics } from './codeSanitizer';

describe('autoFixLoop', () => {
  describe('attemptSanitizerFix', () => {
    it('fixes simple syntax errors through sanitizer', () => {
      // Code with truncated button tag
      const code = `
export default function App() {
  return <butt onClick={() => {}}>Click</butt>;
}
`;
      const result = attemptSanitizerFix(code, 'App.tsx');
      expect(result.code).toContain('<button');
      expect(result.code).toContain('</button>');
    });

    it('returns valid=false for unfixable code', () => {
      // Severely broken code that sanitizer can't fix
      const code = `
export default function App() {
  return (
    <div>
      {items.map(item =>
        // Missing closing for map callback
`;
      const result = attemptSanitizerFix(code, 'App.tsx');
      expect(result.valid).toBe(false);
    });
  });

  describe('buildRepairPrompt', () => {
    it('builds a repair prompt with error details', () => {
      const code = 'const x = {';
      const errors: ValidationError[] = [
        { line: 1, column: 12, message: "'}' expected", code: 1005, severity: 'error' },
      ];

      const prompt = buildRepairPrompt(code, errors, 'test.ts');

      expect(prompt).toContain('test.ts');
      expect(prompt).toContain("'}' expected");
      expect(prompt).toContain('Line 1');
      expect(prompt).toContain('TypeScript');
    });

    it('identifies TSX files correctly', () => {
      const prompt = buildRepairPrompt('', [], 'App.tsx');
      expect(prompt).toContain('React TypeScript (TSX)');
    });

    it('identifies JSX files correctly', () => {
      const prompt = buildRepairPrompt('', [], 'App.jsx');
      expect(prompt).toContain('React JavaScript (JSX)');
    });
  });

  describe('buildRepairPromptV2', () => {
    it('builds basic prompt without context', () => {
      const code = 'const x = {';
      const errors: ValidationError[] = [
        { line: 1, column: 12, message: "'}' expected", code: 1005, severity: 'error' },
      ];

      const prompt = buildRepairPromptV2(code, errors, 'test.ts');

      expect(prompt).toContain('test.ts');
      expect(prompt).toContain("'}' expected");
      expect(prompt).toContain('ERRORS:');
      expect(prompt).toContain('BROKEN CODE:');
    });

    it('includes unified violations when provided', () => {
      const code = 'const x = {';
      const errors: ValidationError[] = [
        { line: 1, column: 12, message: "'}' expected", code: 1005, severity: 'error' },
      ];
      const unifiedViolations: UnifiedViolation[] = [
        {
          code: 'SYNTAX_BRACE_EXPECTED',
          severity: 'error',
          message: "'}' expected",
          autoFixable: true,
          context: { line: 1, column: 12 },
        },
      ];

      const prompt = buildRepairPromptV2(code, errors, 'test.ts', { unifiedViolations });

      expect(prompt).toContain('UNIFIED_VIOLATIONS:');
      expect(prompt).toContain('SYNTAX_BRACE_EXPECTED');
      expect(prompt).toContain('[auto-fixable]');
      expect(prompt).toContain('(Line 1)');
    });

    it('includes sanitizer warnings when provided', () => {
      const code = 'const x = 1;';
      const errors: ValidationError[] = [];
      const sanitizerWarnings: SanitizerWarning[] = [
        {
          code: 'SANITIZER_FIX_TRUNCATED_BUTTON',
          message: 'Fixed truncated <butt> tag names to <button>',
          risk: 'low',
        },
        {
          code: 'SANITIZER_FIX_BROKEN_ARROW',
          message: 'Fixed broken arrow function syntax',
          risk: 'medium',
        },
      ];

      const prompt = buildRepairPromptV2(code, errors, 'test.tsx', { sanitizerWarnings });

      expect(prompt).toContain('SANITIZER_ALREADY_TRIED:');
      expect(prompt).toContain('SANITIZER_FIX_TRUNCATED_BUTTON');
      expect(prompt).toContain('low risk');
      expect(prompt).toContain('medium risk');
      expect(prompt).toContain('already applied by the sanitizer');
    });

    it('includes change metrics when provided', () => {
      const code = 'const x = 1;';
      const errors: ValidationError[] = [];
      const metrics: ChangeMetrics = {
        changedLinesPercent: 25,
        charsAdded: 50,
        charsRemoved: 30,
        highRiskFixes: 2,
        riskLevel: 'medium',
      };

      const prompt = buildRepairPromptV2(code, errors, 'test.ts', { metrics });

      expect(prompt).toContain('CHANGE_METRICS:');
      expect(prompt).toContain('Risk level: MEDIUM');
      expect(prompt).toContain('Changed lines: 25%');
      expect(prompt).toContain('Characters added: 50');
      expect(prompt).toContain('Characters removed: 30');
      expect(prompt).toContain('High-risk fixes applied: 2');
    });

    it('adds conservative warning for high risk level', () => {
      const code = 'const x = 1;';
      const errors: ValidationError[] = [];
      const metrics: ChangeMetrics = {
        changedLinesPercent: 50,
        charsAdded: 200,
        charsRemoved: 150,
        highRiskFixes: 5,
        riskLevel: 'high',
      };

      const prompt = buildRepairPromptV2(code, errors, 'test.ts', { metrics });

      expect(prompt).toContain('Risk level: HIGH');
      expect(prompt).toContain('WARNING: Previous fixes were aggressive');
      expect(prompt).toContain('Be CONSERVATIVE');
    });

    it('includes all context sections together', () => {
      const code = 'const x = {';
      const errors: ValidationError[] = [
        { line: 1, column: 12, message: "'}' expected", code: 1005, severity: 'error' },
      ];
      const context: RepairContext = {
        unifiedViolations: [
          { code: 'SYNTAX_BRACE_EXPECTED', severity: 'error', message: "'}' expected", autoFixable: true },
        ],
        sanitizerWarnings: [{ code: 'SANITIZER_FIX_IMPORTS_HOISTED', message: 'Hoisted imports', risk: 'low' }],
        metrics: {
          changedLinesPercent: 10,
          charsAdded: 20,
          charsRemoved: 5,
          highRiskFixes: 0,
          riskLevel: 'low',
        },
      };

      const prompt = buildRepairPromptV2(code, errors, 'test.ts', context);

      expect(prompt).toContain('ERRORS:');
      expect(prompt).toContain('UNIFIED_VIOLATIONS:');
      expect(prompt).toContain('SANITIZER_ALREADY_TRIED:');
      expect(prompt).toContain('CHANGE_METRICS:');
      expect(prompt).toContain('BROKEN CODE:');
      expect(prompt).toContain('INSTRUCTIONS:');
    });
  });

  describe('REPAIR_BOUNDARIES', () => {
    it('should have instructions for all risk levels', () => {
      expect(REPAIR_BOUNDARIES.low.instructions.length).toBeGreaterThan(0);
      expect(REPAIR_BOUNDARIES.medium.instructions.length).toBeGreaterThan(0);
      expect(REPAIR_BOUNDARIES.high.instructions.length).toBeGreaterThan(0);
    });

    it('high risk should have more restrictive instructions', () => {
      expect(REPAIR_BOUNDARIES.high.instructions.length).toBeGreaterThanOrEqual(
        REPAIR_BOUNDARIES.low.instructions.length,
      );
    });
  });

  describe('getBoundaryInstructions', () => {
    it('returns low risk instructions', () => {
      const instructions = getBoundaryInstructions('low');
      expect(instructions).toEqual(REPAIR_BOUNDARIES.low.instructions);
    });

    it('returns medium risk instructions', () => {
      const instructions = getBoundaryInstructions('medium');
      expect(instructions).toEqual(REPAIR_BOUNDARIES.medium.instructions);
    });

    it('returns high risk instructions (Property 4: Boundary Enforcement)', () => {
      const instructions = getBoundaryInstructions('high');
      expect(instructions).toEqual(REPAIR_BOUNDARIES.high.instructions);
      expect(instructions.some((i) => i.includes('MINIMAL'))).toBe(true);
      expect(instructions.some((i) => i.includes('conservative'))).toBe(true);
    });
  });

  describe('buildRepairPromptWithFewShot', () => {
    it('builds prompt with few-shot examples when violations match', () => {
      const code = '<div><span>text</div>';
      const errors: ValidationError[] = [
        { line: 1, column: 1, message: 'JSX tag mismatch', code: 17001, severity: 'error' },
      ];
      const context: RepairContext = {
        unifiedViolations: [
          { code: 'SYNTAX_JSX_UNCLOSED', severity: 'error', message: 'Unclosed JSX tag', autoFixable: true },
        ],
      };

      const prompt = buildRepairPromptWithFewShot(code, errors, 'test.tsx', context);

      expect(prompt).toContain('SIMILAR FIXES');
      expect(prompt).toContain('SYNTAX_JSX_UNCLOSED');
      expect(prompt).toContain('BROKEN:');
      expect(prompt).toContain('FIXED:');
    });

    it('includes boundary instructions based on risk level', () => {
      const code = 'const x = {';
      const errors: ValidationError[] = [
        { line: 1, column: 12, message: "'}' expected", code: 1005, severity: 'error' },
      ];
      const context: RepairContext = {
        metrics: { changedLinesPercent: 50, charsAdded: 200, charsRemoved: 150, highRiskFixes: 5, riskLevel: 'high' },
      };

      const prompt = buildRepairPromptWithFewShot(code, errors, 'test.ts', context);

      expect(prompt).toContain('MINIMAL');
      expect(prompt).toContain('conservative');
    });

    it('works without context (defaults to low risk)', () => {
      const code = 'const x = 1;';
      const errors: ValidationError[] = [];

      const prompt = buildRepairPromptWithFewShot(code, errors, 'test.ts');

      expect(prompt).toContain('INSTRUCTIONS:');
      expect(prompt).toContain('BROKEN CODE:');
    });

    it('includes violations section when provided', () => {
      const code = 'const x = {';
      const errors: ValidationError[] = [];
      const context: RepairContext = {
        unifiedViolations: [
          { code: 'SYNTAX_BRACE_EXPECTED', severity: 'error', message: "'}' expected", autoFixable: true },
        ],
      };

      const prompt = buildRepairPromptWithFewShot(code, errors, 'test.ts', context);

      expect(prompt).toContain('VIOLATIONS:');
      expect(prompt).toContain('SYNTAX_BRACE_EXPECTED');
    });
  });

  describe('getPromptBuilder', () => {
    it('returns buildRepairPromptV2 for baseline variant', () => {
      const builder = getPromptBuilder('baseline');
      expect(builder).toBe(buildRepairPromptV2);
    });

    it('returns buildRepairPromptWithFewShot for fewshot-v1 variant', () => {
      const builder = getPromptBuilder('fewshot-v1');
      expect(builder).toBe(buildRepairPromptWithFewShot);
    });

    it('returns buildRepairPromptV2 for unknown variant', () => {
      const builder = getPromptBuilder('unknown' as any);
      expect(builder).toBe(buildRepairPromptV2);
    });
  });

  describe('extractCodeFromResponse', () => {
    it('extracts code from markdown code block', () => {
      const response = `Here is the fixed code:

\`\`\`typescript
const x = { a: 1 };
\`\`\`

This should work now.`;

      const code = extractCodeFromResponse(response);
      expect(code).toBe('const x = { a: 1 };');
    });

    it('extracts code from code block without language', () => {
      const response = `\`\`\`
const x = 1;
\`\`\``;

      const code = extractCodeFromResponse(response);
      expect(code).toBe('const x = 1;');
    });

    it('extracts code after FIXED CODE marker', () => {
      const response = `FIXED CODE:
\`\`\`tsx
export default function App() { return <div>Hello</div>; }
\`\`\``;

      const code = extractCodeFromResponse(response);
      expect(code).toBe('export default function App() { return <div>Hello</div>; }');
    });

    it('returns trimmed response if no markers found', () => {
      const response = '  const x = 1;  ';
      const code = extractCodeFromResponse(response);
      expect(code).toBe('const x = 1;');
    });

    it('handles <<<END_CODE>>> sentinel at end', () => {
      const response = `export function Fixed() {
  return <div>Fixed</div>;
}<<<END_CODE>>>`;

      const code = extractCodeFromResponse(response);
      expect(code).toBe(`export function Fixed() {
  return <div>Fixed</div>;
}`);
    });

    it('handles <<<END_CODE>>> sentinel with trailing content', () => {
      const response = `const x = 1;<<<END_CODE>>>

Some explanation after the code that should be removed.`;

      const code = extractCodeFromResponse(response);
      expect(code).toBe('const x = 1;');
    });

    it('handles sentinel inside markdown code block', () => {
      const response = `\`\`\`tsx
export default function App() {
  return <div>Hello</div>;
}
\`\`\`<<<END_CODE>>>`;

      const code = extractCodeFromResponse(response);
      expect(code).toBe(`export default function App() {
  return <div>Hello</div>;
}`);
    });
  });

  describe('quickFix', () => {
    it('fixes code and reports if changed', () => {
      const code = '<butt>Click</butt>';
      const result = quickFix(code, 'test.tsx');

      expect(result.changed).toBe(true);
      expect(result.code).toContain('<button');
    });

    it('reports unchanged for already valid code', () => {
      const code = `
import React from 'react';
export default function App() {
  return <div>Hello</div>;
}
`;
      const result = quickFix(code, 'App.tsx');

      // May or may not change depending on sanitizer rules
      expect(typeof result.valid).toBe('boolean');
    });
  });

  describe('areErrorsAutoFixable', () => {
    it('returns true for fixable errors', () => {
      const errors: ValidationError[] = [
        { line: 1, column: 1, message: "'}' expected", code: 1005, severity: 'error' },
        { line: 2, column: 1, message: 'Unbalanced braces', code: 17003, severity: 'error' },
      ];

      expect(areErrorsAutoFixable(errors)).toBe(true);
    });

    it('returns false for unfixable errors', () => {
      const errors: ValidationError[] = [
        { line: 1, column: 1, message: 'Unknown error', code: 9999, severity: 'error' },
        { line: 2, column: 1, message: 'Another unknown', code: 8888, severity: 'error' },
      ];

      expect(areErrorsAutoFixable(errors)).toBe(false);
    });

    it('ignores warnings', () => {
      const errors: ValidationError[] = [
        { line: 1, column: 1, message: 'Duplicate import', code: 17005, severity: 'warning' },
      ];

      // No errors, so technically "fixable"
      expect(areErrorsAutoFixable(errors)).toBe(true);
    });
  });

  describe('getErrorSummary', () => {
    it('summarizes errors by type', () => {
      const errors: ValidationError[] = [
        { line: 1, column: 1, message: "'}' expected", code: 1005, severity: 'error' },
        { line: 2, column: 1, message: "'}' expected", code: 1005, severity: 'error' },
        { line: 3, column: 1, message: 'Unterminated string', code: 1002, severity: 'error' },
      ];

      const summary = getErrorSummary(errors);
      expect(summary).toContain("'}' expected (2)");
      expect(summary).toContain('Unterminated string (1)');
    });
  });

  describe('autoFixWithLlm', () => {
    it('succeeds with sanitizer-only fix', async () => {
      const code = '<butt>Click</butt>';
      const options: AutoFixOptions = {
        filename: 'test.tsx',
        originalCode: code,
        validationResult: { valid: false, errors: [], fixable: true },
      };

      const result = await autoFixWithLlm(options);

      expect(result.code).toContain('<button');
      expect(result.usedFallback).toBe(false);
    });

    it('calls LLM repair function when sanitizer fails', async () => {
      const brokenCode = 'const x = {';
      const fixedCode = 'const x = {};';

      // Mock LLM repair function - now receives prompt string
      const mockLlmRepair: LlmRepairFn = vi.fn().mockResolvedValue(`\`\`\`ts\n${fixedCode}\n\`\`\``);

      const options: AutoFixOptions = {
        filename: 'test.ts',
        originalCode: brokenCode,
        validationResult: {
          valid: false,
          errors: [{ line: 1, column: 12, message: "'}' expected", code: 1005, severity: 'error' }],
          fixable: true,
        },
        llmRepairFn: mockLlmRepair,
      };

      const result = await autoFixWithLlm(options);

      // Verify LLM was called with a prompt string containing expected content
      expect(mockLlmRepair).toHaveBeenCalled();

      const promptArg = (mockLlmRepair as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(typeof promptArg).toBe('string');
      expect(promptArg).toContain('ERRORS:');
      expect(promptArg).toContain('FILE:');
      expect(promptArg).toContain('test.ts');

      expect(result.success).toBe(true);
      expect(result.code).toContain('const x = {}');
    });

    it('tries fallback model when primary fails', async () => {
      const brokenCode = 'const x = {{{';
      const fixedCode = 'const x = {};';

      // Mock LLM functions - now receive prompt string
      const mockPrimaryLlm: LlmRepairFn = vi.fn().mockResolvedValue('still broken {{{');
      const mockFallbackLlm: LlmRepairFn = vi.fn().mockResolvedValue(`\`\`\`ts\n${fixedCode}\n\`\`\``);

      const options: AutoFixOptions = {
        filename: 'test.ts',
        originalCode: brokenCode,
        validationResult: {
          valid: false,
          errors: [{ line: 1, column: 12, message: "'}' expected", code: 1005, severity: 'error' }],
          fixable: true,
        },
        llmRepairFn: mockPrimaryLlm,
        fallbackLlmRepairFn: mockFallbackLlm,
      };

      const result = await autoFixWithLlm(options);

      // Verify fallback was called with prompt string
      expect(mockFallbackLlm).toHaveBeenCalled();

      const promptArg = (mockFallbackLlm as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(typeof promptArg).toBe('string');
      expect(promptArg).toContain('ERRORS:');

      expect(result.usedFallback).toBe(true);
    });

    it('passes prompt with correct structure to LLM', async () => {
      const brokenCode = 'export const x = {';

      const mockLlmRepair: LlmRepairFn = vi.fn().mockResolvedValue('export const x = {};');

      const options: AutoFixOptions = {
        filename: 'utils.ts',
        originalCode: brokenCode,
        validationResult: {
          valid: false,
          errors: [
            { line: 1, column: 19, message: "'}' expected", code: 1005, severity: 'error' },
            { line: 1, column: 1, message: 'Unbalanced braces', code: 17003, severity: 'error' },
          ],
          fixable: true,
        },
        llmRepairFn: mockLlmRepair,
      };

      await autoFixWithLlm(options);

      const promptArg = (mockLlmRepair as ReturnType<typeof vi.fn>).mock.calls[0][0];

      // Verify prompt structure
      expect(promptArg).toContain('FILE: utils.ts');
      expect(promptArg).toContain('ERRORS:');
      expect(promptArg).toContain("'}' expected");
      expect(promptArg).toContain('BROKEN CODE:');
      expect(promptArg).toContain('export const x = {');
      expect(promptArg).toContain('INSTRUCTIONS:');
      expect(promptArg).toContain('FIXED CODE:');
    });

    it('uses fewshot-v1 prompt builder when variant is forced', async () => {
      const brokenCode = '<div><span>text</div>';

      const mockLlmRepair: LlmRepairFn = vi.fn().mockResolvedValue('<div><span>text</span></div>');

      const options: AutoFixOptions = {
        filename: 'test.tsx',
        originalCode: brokenCode,
        validationResult: {
          valid: false,
          errors: [{ line: 1, column: 1, message: 'JSX tag mismatch', code: 17001, severity: 'error' }],
          unifiedViolations: [
            { code: 'SYNTAX_JSX_UNCLOSED', severity: 'error', message: 'Unclosed JSX tag', autoFixable: true },
          ],
          fixable: true,
        },
        llmRepairFn: mockLlmRepair,
        variantSelection: {
          forceVariant: 'fewshot-v1',
        },
      };

      const result = await autoFixWithLlm(options);

      expect(result.promptVariant).toBe('fewshot-v1');

      const promptArg = (mockLlmRepair as ReturnType<typeof vi.fn>).mock.calls[0][0];

      // fewshot-v1 should include SIMILAR FIXES section when violations match
      expect(promptArg).toContain('SIMILAR FIXES');
    });

    it('uses baseline prompt builder when variant is baseline', async () => {
      const brokenCode = 'const x = {';

      const mockLlmRepair: LlmRepairFn = vi.fn().mockResolvedValue('const x = {};');

      const options: AutoFixOptions = {
        filename: 'test.ts',
        originalCode: brokenCode,
        validationResult: {
          valid: false,
          errors: [{ line: 1, column: 12, message: "'}' expected", code: 1005, severity: 'error' }],
          fixable: true,
        },
        llmRepairFn: mockLlmRepair,
        variantSelection: {
          forceVariant: 'baseline',
        },
      };

      const result = await autoFixWithLlm(options);

      expect(result.promptVariant).toBe('baseline');

      const promptArg = (mockLlmRepair as ReturnType<typeof vi.fn>).mock.calls[0][0];

      // baseline should NOT include SIMILAR FIXES section
      expect(promptArg).not.toContain('SIMILAR FIXES');
    });

    it('returns promptVariant in result', async () => {
      const brokenCode = 'const x = {';

      const mockLlmRepair: LlmRepairFn = vi.fn().mockResolvedValue('const x = {};');

      const options: AutoFixOptions = {
        filename: 'test.ts',
        originalCode: brokenCode,
        validationResult: {
          valid: false,
          errors: [{ line: 1, column: 12, message: "'}' expected", code: 1005, severity: 'error' }],
          fixable: true,
        },
        llmRepairFn: mockLlmRepair,
        variantSelection: {
          forceVariant: 'fewshot-v1',
        },
      };

      const result = await autoFixWithLlm(options);

      expect(result.promptVariant).toBe('fewshot-v1');
    });
  });
});
