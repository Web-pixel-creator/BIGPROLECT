import { describe, expect, it } from 'vitest';
import {
  validateCode,
  validateFile,
  validateCss,
  validateJson,
  isValidSyntax,
  mapErrorToUnifiedViolation,
  mapErrorsToUnifiedViolations,
} from './codeValidator';
import type { ValidationError } from './codeValidator';

describe('codeValidator', () => {
  describe('validateCode', () => {
    it('returns valid for correct TypeScript code', () => {
      const code = `
import React from 'react';

export default function App() {
  return <div>Hello</div>;
}
`;
      const result = validateCode(code, 'App.tsx');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('detects syntax errors in TypeScript', () => {
      const code = `
const x = {
  a: 1,
  b: 2
// missing closing brace
`;
      const result = validateCode(code, 'test.ts');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('detects unterminated string literal', () => {
      const code = `
const message = "Hello world
const x = 1;
`;
      const result = validateCode(code, 'test.ts');
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.toLowerCase().includes('unterminated'))).toBe(true);
    });

    it('detects unbalanced braces', () => {
      const code = `
function test() {
  if (true) {
    console.log('test');
  // missing closing brace for if
}
`;
      const result = validateCode(code, 'test.ts');
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === 17003 || e.message.includes('brace'))).toBe(true);
    });

    it('detects duplicate imports', () => {
      const code = `
import React from 'react';
import { useState } from 'react';
import React from 'react';

export default function App() {
  return <div>Hello</div>;
}
`;
      const result = validateCode(code, 'App.tsx');
      expect(result.errors.some((e) => e.code === 17005)).toBe(true);
    });

    it('detects multiple export default', () => {
      const code = `
export default function App() {
  return <div>Hello</div>;
}

export default function App2() {
  return <div>World</div>;
}
`;
      const result = validateCode(code, 'App.tsx');
      expect(result.errors.some((e) => e.code === 17006)).toBe(true);
    });

    it('skips validation for non-JS/TS files', () => {
      const code = 'This is not code at all!!!';
      const result = validateCode(code, 'readme.md');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateCss', () => {
    it('returns valid for correct CSS', () => {
      const code = `
.container {
  display: flex;
  justify-content: center;
}

.button {
  background: blue;
}
`;
      const result = validateCss(code, 'styles.css');
      expect(result.valid).toBe(true);
    });

    it('detects unbalanced braces in CSS', () => {
      const code = `
.container {
  display: flex;
/* missing closing brace */
`;
      const result = validateCss(code, 'styles.css');
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === 18001)).toBe(true);
    });

    it('detects unclosed comments', () => {
      const code = `
.container {
  display: flex;
}
/* This comment is never closed
`;
      const result = validateCss(code, 'styles.css');
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === 18002)).toBe(true);
    });
  });

  describe('validateJson', () => {
    it('returns valid for correct JSON', () => {
      const code = `{
  "name": "test",
  "version": "1.0.0"
}`;
      const result = validateJson(code, 'package.json');
      expect(result.valid).toBe(true);
    });

    it('detects invalid JSON', () => {
      const code = `{
  "name": "test",
  "version": "1.0.0"
  // comments not allowed in JSON
}`;
      const result = validateJson(code, 'package.json');
      expect(result.valid).toBe(false);
    });

    it('detects trailing comma', () => {
      const code = `{
  "name": "test",
  "version": "1.0.0",
}`;
      const result = validateJson(code, 'package.json');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateFile', () => {
    it('routes to correct validator based on extension', () => {
      // TypeScript
      const tsResult = validateFile('const x: number = 1;', 'test.ts');
      expect(tsResult.valid).toBe(true);

      // CSS
      const cssResult = validateFile('.foo { color: red; }', 'test.css');
      expect(cssResult.valid).toBe(true);

      // JSON
      const jsonResult = validateFile('{"a": 1}', 'test.json');
      expect(jsonResult.valid).toBe(true);

      // Unknown - should pass
      const mdResult = validateFile('# Hello', 'test.md');
      expect(mdResult.valid).toBe(true);
    });
  });

  describe('isValidSyntax', () => {
    it('returns true for valid code', () => {
      expect(isValidSyntax('const x = 1;', 'test.ts')).toBe(true);
    });

    it('returns false for invalid code', () => {
      expect(isValidSyntax('const x = {', 'test.ts')).toBe(false);
    });
  });

  describe('unifiedViolations mapping', () => {
    describe('mapErrorToUnifiedViolation', () => {
      it('maps brace expected error to SYNTAX_BRACE_EXPECTED', () => {
        const error: ValidationError = {
          line: 5,
          column: 10,
          message: "'}' expected",
          code: 1005,
          severity: 'error',
        };

        const unified = mapErrorToUnifiedViolation(error, 'test.ts');

        expect(unified.code).toBe('SYNTAX_BRACE_EXPECTED');
        expect(unified.severity).toBe('error');
        expect(unified.autoFixable).toBe(true);
        expect(unified.context?.file).toBe('test.ts');
        expect(unified.context?.line).toBe(5);
        expect(unified.context?.column).toBe(10);
        expect(unified.context?.tsCode).toBe(1005);
      });

      it('maps unterminated string error to SYNTAX_UNTERMINATED_STRING', () => {
        const error: ValidationError = {
          line: 1,
          column: 15,
          message: 'Unterminated string literal',
          code: 1002,
          severity: 'error',
        };

        const unified = mapErrorToUnifiedViolation(error, 'test.ts');

        expect(unified.code).toBe('SYNTAX_UNTERMINATED_STRING');
        expect(unified.autoFixable).toBe(true);
      });

      it('maps JSX tag mismatch to SYNTAX_JSX_TAG_MISMATCH', () => {
        const error: ValidationError = {
          line: 10,
          column: 5,
          message: 'Mismatched JSX tags: expected </div> but found </span>',
          code: 17001,
          severity: 'error',
        };

        const unified = mapErrorToUnifiedViolation(error, 'App.tsx');

        expect(unified.code).toBe('SYNTAX_JSX_TAG_MISMATCH');
        expect(unified.autoFixable).toBe(true);
      });

      it('maps parser crash to SYNTAX_PARSER_CRASH', () => {
        const error: ValidationError = {
          line: 1,
          column: 1,
          message: 'Parser crashed: Unknown error',
          code: 9999,
          severity: 'error',
        };

        const unified = mapErrorToUnifiedViolation(error, 'test.ts');

        expect(unified.code).toBe('SYNTAX_PARSER_CRASH');
        expect(unified.autoFixable).toBe(false);
      });

      it('maps unknown error to SYNTAX_OTHER', () => {
        const error: ValidationError = {
          line: 1,
          column: 1,
          message: 'Some unknown error',
          code: 12345,
          severity: 'error',
        };

        const unified = mapErrorToUnifiedViolation(error, 'test.ts');

        expect(unified.code).toBe('SYNTAX_OTHER');
        expect(unified.autoFixable).toBe(false);
      });

      it('infers brace expected from message when code unknown', () => {
        const error: ValidationError = {
          line: 1,
          column: 1,
          message: "Expected '}' at end of block",
          code: 99999,
          severity: 'error',
        };

        const unified = mapErrorToUnifiedViolation(error, 'test.ts');

        expect(unified.code).toBe('SYNTAX_BRACE_EXPECTED');
      });
    });

    describe('mapErrorsToUnifiedViolations', () => {
      it('maps array of errors to unified violations', () => {
        const errors: ValidationError[] = [
          { line: 1, column: 1, message: "'}' expected", code: 1005, severity: 'error' },
          { line: 2, column: 5, message: 'Unterminated string literal', code: 1002, severity: 'error' },
        ];

        const unified = mapErrorsToUnifiedViolations(errors, 'test.ts');

        expect(unified).toHaveLength(2);
        expect(unified[0].code).toBe('SYNTAX_BRACE_EXPECTED');
        expect(unified[1].code).toBe('SYNTAX_UNTERMINATED_STRING');
      });

      it('returns empty array for empty errors', () => {
        const unified = mapErrorsToUnifiedViolations([], 'test.ts');
        expect(unified).toHaveLength(0);
      });
    });

    describe('validateFile with unifiedViolations', () => {
      it('includes unifiedViolations in result for valid code', () => {
        const result = validateFile('const x = 1;', 'test.ts');

        expect(result.unifiedViolations).toBeDefined();
        expect(result.unifiedViolations).toHaveLength(0);
      });

      it('includes unifiedViolations in result for invalid code', () => {
        const result = validateFile('const x = {', 'test.ts');

        expect(result.unifiedViolations).toBeDefined();
        expect(result.unifiedViolations!.length).toBeGreaterThan(0);
        expect(result.unifiedViolations![0].code).toBe('SYNTAX_BRACE_EXPECTED');
      });

      it('includes unifiedViolations for CSS errors', () => {
        const result = validateFile('.foo { color: red;', 'test.css');

        expect(result.unifiedViolations).toBeDefined();

        if (!result.valid) {
          expect(result.unifiedViolations!.length).toBeGreaterThan(0);
        }
      });

      it('includes unifiedViolations for JSON errors', () => {
        const result = validateFile('{ "a": 1', 'test.json');

        expect(result.unifiedViolations).toBeDefined();

        if (!result.valid) {
          expect(result.unifiedViolations!.length).toBeGreaterThan(0);
        }
      });

      it('includes empty unifiedViolations for unknown file types', () => {
        const result = validateFile('# Hello', 'test.md');

        expect(result.unifiedViolations).toBeDefined();
        expect(result.unifiedViolations).toHaveLength(0);
      });
    });
  });
});
