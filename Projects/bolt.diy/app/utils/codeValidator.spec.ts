import { describe, expect, it } from 'vitest';
import { validateCode, validateFile, validateCss, validateJson, isValidSyntax } from './codeValidator';

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
      expect(result.errors.some(e => e.message.toLowerCase().includes('unterminated'))).toBe(true);
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
      expect(result.errors.some(e => e.code === 17003 || e.message.includes('brace'))).toBe(true);
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
      expect(result.errors.some(e => e.code === 17005)).toBe(true);
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
      expect(result.errors.some(e => e.code === 17006)).toBe(true);
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
      expect(result.errors.some(e => e.code === 18001)).toBe(true);
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
      expect(result.errors.some(e => e.code === 18002)).toBe(true);
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
});
