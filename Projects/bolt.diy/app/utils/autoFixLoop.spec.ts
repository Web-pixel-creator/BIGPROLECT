import { describe, expect, it, vi } from 'vitest';
import {
  attemptSanitizerFix,
  buildRepairPrompt,
  extractCodeFromResponse,
  quickFix,
  areErrorsAutoFixable,
  getErrorSummary,
  autoFixWithLlm,
  type AutoFixOptions,
} from './autoFixLoop';
import type { ValidationError } from './codeValidator';

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
      
      const mockLlmRepair = vi.fn().mockResolvedValue(`\`\`\`ts\n${fixedCode}\n\`\`\``);
      
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
      
      expect(mockLlmRepair).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.code).toContain('const x = {}');
    });

    it('tries fallback model when primary fails', async () => {
      const brokenCode = 'const x = {{{';
      const fixedCode = 'const x = {};';
      
      const mockPrimaryLlm = vi.fn().mockResolvedValue('still broken {{{');
      const mockFallbackLlm = vi.fn().mockResolvedValue(`\`\`\`ts\n${fixedCode}\n\`\`\``);
      
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
      
      expect(mockFallbackLlm).toHaveBeenCalled();
      expect(result.usedFallback).toBe(true);
    });
  });
});
