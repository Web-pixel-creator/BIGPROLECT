/**
 * Few-Shot Examples for LLM Repair
 *
 * Minimal examples showing common errors and their fixes.
 * Used by fewshot-v1 variant to improve repair accuracy.
 */

import type { ViolationCode } from '~/lib/services/sectionContracts';

export interface FewShotExample {
  violationCode: ViolationCode;
  description: string;
  broken: string;
  fixed: string;
}

/**
 * Few-shot examples registry.
 * Ordered by frequency (most common first based on typical LLM output errors).
 */
export const FEW_SHOT_EXAMPLES: FewShotExample[] = [
  // SYNTAX errors (most common)
  {
    violationCode: 'SYNTAX_JSX_UNCLOSED',
    description: 'JSX tag not properly closed',
    broken: `<div>
  <span>text
</div>`,
    fixed: `<div>
  <span>text</span>
</div>`,
  },
  {
    violationCode: 'SYNTAX_JSX_TAG_MISMATCH',
    description: 'Mismatched JSX opening/closing tags',
    broken: `<div className="container">
  <section>Content</div>
</section>`,
    fixed: `<div className="container">
  <section>Content</section>
</div>`,
  },
  {
    violationCode: 'SYNTAX_UNBALANCED_BRACES',
    description: 'Missing closing brace in JSX expression',
    broken: `<div>{items.map(i => <span>{i.name</span>)}</div>`,
    fixed: `<div>{items.map(i => <span>{i.name}</span>)}</div>`,
  },
  {
    violationCode: 'SYNTAX_BRACE_EXPECTED',
    description: 'Missing closing brace in function/object',
    broken: `function Component() {
  return (
    <div>Hello</div>
  );
`,
    fixed: `function Component() {
  return (
    <div>Hello</div>
  );
}`,
  },
  {
    violationCode: 'SYNTAX_UNTERMINATED_STRING',
    description: 'String literal not closed',
    broken: `const title = "Welcome to our site;`,
    fixed: `const title = "Welcome to our site";`,
  },
  {
    violationCode: 'SYNTAX_MULTIPLE_EXPORT_DEFAULT',
    description: 'Multiple default exports',
    broken: `export default function Hero() { }
export default function Header() { }`,
    fixed: `export default function Hero() { }
export function Header() { }`,
  },

  // CONTRACT errors (section-specific)
  {
    violationCode: 'CONTRACT_HERO_MISSING_H1',
    description: 'Hero section missing h1 heading',
    broken: `<section data-section="hero">
  <p className="text-xl">Welcome</p>
  <button>Get Started</button>
</section>`,
    fixed: `<section data-section="hero">
  <h1 className="text-4xl font-bold">Welcome</h1>
  <button>Get Started</button>
</section>`,
  },
  {
    violationCode: 'CONTRACT_HERO_MISSING_CTA',
    description: 'Hero section missing call-to-action button',
    broken: `<section data-section="hero">
  <h1>Welcome</h1>
  <p>Description</p>
</section>`,
    fixed: `<section data-section="hero">
  <h1>Welcome</h1>
  <p>Description</p>
  <button className="btn-primary">Get Started</button>
</section>`,
  },
  {
    violationCode: 'CONTRACT_MISSING_NAMED_EXPORT',
    description: 'Component missing named export',
    broken: `function HeroSection() {
  return <section>...</section>;
}`,
    fixed: `export function HeroSection() {
  return <section>...</section>;
}`,
  },
  {
    violationCode: 'CONTRACT_NAV_MISSING_NAV_ELEMENT',
    description: 'Navigation missing <nav> element',
    broken: `<header data-section="navigation">
  <div className="flex gap-4">
    <a href="/">Home</a>
  </div>
</header>`,
    fixed: `<header data-section="navigation">
  <nav className="flex gap-4">
    <a href="/">Home</a>
  </nav>
</header>`,
  },
  {
    violationCode: 'CONTRACT_FOOTER_MISSING_COPYRIGHT',
    description: 'Footer missing copyright notice',
    broken: `<footer data-section="footer">
  <a href="/privacy">Privacy</a>
</footer>`,
    fixed: `<footer data-section="footer">
  <a href="/privacy">Privacy</a>
  <p className="text-sm">© {YEAR} {COMPANY}</p>
</footer>`,
  },
];

/**
 * Get relevant few-shot examples for given violation codes.
 * Returns examples matching any of the provided codes, limited to maxExamples.
 */
export function getFewShotExamples(violationCodes: ViolationCode[], maxExamples: number = 3): FewShotExample[] {
  const codeSet = new Set<string>(violationCodes);

  const matching = FEW_SHOT_EXAMPLES.filter((ex) => codeSet.has(ex.violationCode));

  return matching.slice(0, maxExamples);
}

/**
 * Get few-shot examples by category prefix.
 */
export function getFewShotByCategory(category: 'SYNTAX' | 'CONTRACT', maxExamples: number = 3): FewShotExample[] {
  const matching = FEW_SHOT_EXAMPLES.filter((ex) => ex.violationCode.startsWith(category));

  return matching.slice(0, maxExamples);
}

/**
 * Format few-shot examples for inclusion in prompt.
 */
export function formatFewShotExamples(examples: FewShotExample[]): string {
  if (examples.length === 0) {
    return '';
  }

  const formatted = examples
    .map(
      (ex, i) =>
        `Example ${i + 1} (${ex.violationCode}): ${ex.description}
BROKEN:
\`\`\`
${ex.broken}
\`\`\`
FIXED:
\`\`\`
${ex.fixed}
\`\`\``,
    )
    .join('\n\n');

  return `
SIMILAR FIXES (learn from these examples):
${formatted}
`;
}
