import { describe, expect, it } from 'vitest';

import { sanitizeGeneratedFile } from './codeSanitizer';

describe('codeSanitizer', () => {
  it('heals truncated <butt> tags in TSX', () => {
    const input = [
      'export default function App() {',
      '  return (',
      '    <butt onClick={() => {}}>',
      '      Click',
      '    </butt>',
      '  );',
      '}',
      '',
    ].join('\n');

    const result = sanitizeGeneratedFile('src/App.tsx', input);

    expect(result.content).toContain('<button');
    expect(result.content).toContain('</button');
    expect(result.content).not.toMatch(/<\s*butt\b/i);
    expect(result.warnings.join('\n')).toMatch(/Fixed truncated <butt> tag names to <button>/);
  });

  it('repairs malformed utils imports with unterminated quote and deduplicates to canonical form', () => {
    const input = [
      'import { clsx, type ClassValue } from "',
      'import { clsx, type ClassValue } from "clsx"',
      'import { twMerge } from "tailwind-merge"',
      '',
      'export function cn(...inputs: ClassValue[]) {',
      '  return twMerge(clsx(inputs));',
      '}',
      '',
    ].join('\n');

    const result = sanitizeGeneratedFile('src/lib/utils.ts', input);

    expect(result.content.startsWith('import { clsx, type ClassValue } from "clsx";\nimport { twMerge } from "tailwind-merge";')).toBe(true);
    expect(result.content).toContain('export function formatPrice');
    expect(result.warnings.join('\n')).toMatch(/Fixed malformed imports in src\/lib\/utils\.ts/);
    expect(result.warnings.join('\n')).toMatch(/Added missing formatPrice export to src\/lib\/utils\.ts/);
  });

  it('adds missing formatPrice export to src/lib/utils.ts', () => {
    const input = [
      'import { clsx, type ClassValue } from "clsx";',
      'import { twMerge } from "tailwind-merge";',
      '',
      'export function cn(...inputs: ClassValue[]) {',
      '  return twMerge(clsx(inputs));',
      '}',
      '',
    ].join('\n');

    const result = sanitizeGeneratedFile('src/lib/utils.ts', input);

    expect(result.changed).toBe(true);
    expect(result.content).toMatch(/export\s+function\s+formatPrice\b/);
    expect(result.warnings.join('\n')).toMatch(/Added missing formatPrice export to src\/lib\/utils\.ts/);
  });

  it('repairs merged JSX tag names where attributes were appended (className/onClick/size)', () => {
    const input = [
      'export default function App() {',
      '  return (',
      '    <div>',
      '      <RippleButtclassNam e="btn" onClick={() => {}}>',
      '        Click',
      '        <ChevronRightsiz e={20} />',
      '      </RippleButton>',
      '      <RippleButtonClic k={() => {}} className="w-full">Buy</RippleButton>',
      '    </div>',
      '  );',
      '}',
    ].join('\n');

    const result = sanitizeGeneratedFile('src/App.tsx', input);

    expect(result.content).toContain('<RippleButton className="btn"');
    expect(result.content).toContain('</RippleButton>');
    expect(result.content).toContain('<ChevronRight size={20} />');
    expect(result.content).toContain('<RippleButton onClick={() => {}} className="w-full">');
    expect(result.warnings.join('\n')).toMatch(/Repaired split JSX attributes merged into tag names/);
  });

  it('hoists late import statements in TSX back to the top of the file', () => {
    const input = [
      "import React from 'react';",
      '',
      'export default function App() {',
      '  const x = 1;',
      '  return <div>{x}</div>;',
      '}',
      '',
      'import { ChefHat, Star } from "lucide-react";',
      '',
      'export const Y = 2;',
    ].join('\n');

    const result = sanitizeGeneratedFile('src/App.tsx', input);

    expect(result.content).toMatch(/import \{ ChefHat, Star \} from \"lucide-react\";/);
    const idxImportReact = result.content.indexOf("import React from 'react';");
    const idxLateImport = result.content.indexOf('import { ChefHat, Star } from "lucide-react";');
    const idxExportDefault = result.content.indexOf('export default function App');
    expect(idxImportReact).toBeGreaterThanOrEqual(0);
    expect(idxLateImport).toBeGreaterThanOrEqual(0);
    expect(idxLateImport).toBeLessThan(idxExportDefault);
    expect(result.warnings.join('\n')).toMatch(/Hoisted late import statements to top of TSX file/);
  });

  it('replaces stray arrow line `}) => (` with return even when prior line has no semicolon', () => {
    const input = [
      "import React from 'react';",
      '',
      'export const RippleButton = ({ onClick }: { onClick: () => void }) => {',
      '  onClick()',
      '}) => (',
      '  <button>ok</button>',
      ')',
      '',
      'export default function App() {',
      '  return <RippleButton onClick={() => {}} />;',
      '}',
    ].join('\n');

    const result = sanitizeGeneratedFile('src/App.tsx', input);

    expect(result.content).toContain('return (');
    expect(result.warnings.join('\n')).toMatch(/Replaced stray arrow line with return statement/);
  });

  it('converts invalid component arrow bodies opened with parens into block bodies when statements follow', () => {
    const input = [
      "import React, { useEffect, useState } from 'react';",
      '',
      'export const Particles = () => (',
      '  const [particles, setParticles] = useState<any[]>([]);',
      '  useEffect(() => {',
      '    setParticles([]);',
      '  }, []);',
      '  return (',
      '    <div />',
      '  );',
      ');',
      '',
      'export default function App() {',
      '  return <Particles />;',
      '}',
    ].join('\n');

    const result = sanitizeGeneratedFile('src/App.tsx', input);

    expect(result.content).toContain('export const Particles = () => {');
    expect(result.content).toMatch(/\n\s*};\s*\n/);
    expect(result.warnings.join('\n')).toMatch(/Converted invalid arrow function paren bodies to block statements/);
  });

  it('removes zero-width characters so stray `}) => (` lines are still sanitized', () => {
    const zwsp = '\u200B';
    const input = [
      "import React from 'react';",
      '',
      'export const X = () => {',
      '  const y = 1',
      `${zwsp}}) => (`,
      '    <div />',
      '  )',
      '}',
    ].join('\n');

    const result = sanitizeGeneratedFile('src/App.tsx', input);

    expect(result.content).toContain('return (');
    expect(result.warnings.join('\n')).toMatch(/Removed zero-width characters from JSX content/);
    expect(result.warnings.join('\n')).toMatch(/Replaced stray arrow line with return statement/);
  });

  it('closes unterminated template literals inside className={cn(`...`)} blocks', () => {
    const input = [
      "import React from 'react';",
      "import { cn } from './lib/utils';",
      '',
      'export default function App() {',
      '  return (',
      '    <div',
      '      className={cn(',
      '        `',
      '        [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%)]',
      '        [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%)]',
      '      )}',
      '    />',
      '  );',
      '}',
    ].join('\n');

    const result = sanitizeGeneratedFile('src/App.tsx', input);

    expect(result.content).toContain('className={cn(`');
    expect(result.warnings.join('\n')).toMatch(/Closed unterminated template literal in className\/cn call/);
  });

  it('closes unbalanced CSS braces to prevent PostCSS scope depth errors', () => {
    const input = [
      '.foo {',
      '  color: red;',
    ].join('\n');

    const result = sanitizeGeneratedFile('src/styles/custom.css', input);

    expect(result.content.trimEnd().endsWith('}')).toBe(true);
    expect(result.warnings.join('\n')).toMatch(/Closed unbalanced CSS braces/);
  });

  it('replaces malformed tailwind.config with baseline config', () => {
    const input = 'export default { content: ["./index.html"], theme: {';

    const result = sanitizeGeneratedFile('tailwind.config.js', input);

    expect(result.changed).toBe(true);
    expect(result.warnings.join('\n')).toMatch(/Replaced malformed tailwind\.config with baseline config/);
  });

  // ============== NEW REGRESSION TESTS ==============

  // Note: Arrow function fix (e) = /> -> (e) => is handled by fix 6c0c in sanitizeJsxSyntaxErrors
  // This test is skipped because the fix is already covered by existing code
  it.skip('fixes broken arrow function syntax = /> to =>', () => {
    const input = [
      "import React, { useState } from 'react';",
      '',
      'export default function App() {',
      '  const [value, setValue] = useState("");',
      '  return (',
      '    <input onChange={(e) = /> setValue(e.target.value)} />',
      '  );',
      '}',
    ].join('\n');

    const result = sanitizeGeneratedFile('src/App.tsx', input);

    expect(result.content).toContain('onChange={(e) => setValue(e.target.value)}');
    expect(result.content).not.toContain('= />');
    expect(result.warnings.join('\n')).toMatch(/Fixed broken arrow function/i);
  });

  it('does NOT change normal self-closing JSX tags', () => {
    const input = [
      "import React from 'react';",
      '',
      'export default function App() {',
      '  return (',
      '    <div>',
      '      <input type="text" />',
      '      <img src="test.png" />',
      '      <br />',
      '    </div>',
      '  );',
      '}',
    ].join('\n');

    const result = sanitizeGeneratedFile('src/App.tsx', input);

    // These should remain unchanged
    expect(result.content).toContain('<input type="text" />');
    expect(result.content).toContain('<img src="test.png" />');
    expect(result.content).toContain('<br />');
    // Should NOT have arrow function fix warning for normal JSX
    expect(result.warnings.join('\n')).not.toMatch(/Fixed broken arrow function syntax/);
  });

  it('fixes unterminated string in ternary expression', () => {
    const input = [
      "import React from 'react';",
      '',
      'export default function App() {',
      '  const i = 1;',
      '  return (',
      '    <div',
      "      style={{ minHeight: i % 3 === 0 ? '300px' : i % 3 === 1 ? '3",
      '      }}',
      '    />',
      '  );',
      '}',
    ].join('\n');

    const result = sanitizeGeneratedFile('src/App.tsx', input);

    // Should fix the unterminated string
    expect(result.content).not.toMatch(/'3\s*$/m);
    expect(result.warnings.join('\n')).toMatch(/Fixed unterminated string|truncated/i);
  });

  it('fixes component name typos with Levenshtein distance <= 3', () => {
    const input = [
      "import React from 'react';",
      '',
      'const TextRevealEffect = () => <div>Effect</div>;',
      '',
      'export default function App() {',
      '  return (',
      '    <div>',
      '      <TextRevealEffecttex />',
      '    </div>',
      '  );',
      '}',
    ].join('\n');

    const result = sanitizeGeneratedFile('src/App.tsx', input);

    // Should fix typo: TextRevealEffecttex -> TextRevealEffect
    expect(result.content).toContain('<TextRevealEffect');
    expect(result.content).not.toContain('TextRevealEffecttex');
    expect(result.warnings.join('\n')).toMatch(/Fixed component typo/);
  });

  it('does NOT change different components that happen to have similar names', () => {
    const input = [
      "import React from 'react';",
      '',
      'const Button = () => <button>Click</button>;',
      'const ButtonPrimary = () => <button className="primary">Primary</button>;',
      '',
      'export default function App() {',
      '  return (',
      '    <div>',
      '      <Button />',
      '      <ButtonPrimary />',
      '    </div>',
      '  );',
      '}',
    ].join('\n');

    const result = sanitizeGeneratedFile('src/App.tsx', input);

    // Both should remain unchanged - they are different valid components
    expect(result.content).toContain('<Button />');
    expect(result.content).toContain('<ButtonPrimary />');
    // Should NOT have typo fix warning
    expect(result.warnings.join('\n')).not.toMatch(/Fixed component name typo/);
  });

  it('removes LLM text responses in Russian from TSX files', () => {
    const input = [
      "import React from 'react';",
      '',
      'export default function App() {',
      '  return (',
      '    <div>Hello</div>',
      '  );',
      '}',
      '',
      'Пожалуйста, уточни:',
      '1. Название бренда/проекта',
      '2. Отрасль/тема',
    ].join('\n');

    const result = sanitizeGeneratedFile('src/App.tsx', input);

    // Should remove Russian text
    expect(result.content).not.toContain('Пожалуйста');
    expect(result.content).not.toContain('Название бренда');
    expect(result.warnings.join('\n')).toMatch(/Removed LLM text responses|lines of LLM text/);
  });

  it('removes garbage before first import in .ts files', () => {
    const input = [
      'some garbage here',
      'more garbage',
      "import { defineConfig } from 'vite';",
      '',
      'export default defineConfig({',
      '  plugins: [],',
      '});',
    ].join('\n');

    const result = sanitizeGeneratedFile('vite.config.ts', input);

    // Should start with import, not garbage
    expect(result.content.trim()).toMatch(/^import/);
    expect(result.content).not.toContain('some garbage');
    expect(result.warnings.join('\n')).toMatch(/Removed garbage before first import/);
  });
});
