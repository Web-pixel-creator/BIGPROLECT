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

  it('closes unbalanced CSS braces to prevent PostCSS scope depth errors', () => {
    const input = [
      '.foo {',
      '  color: red;',
      '',
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
});
