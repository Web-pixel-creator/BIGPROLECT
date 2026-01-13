/**
 * Prompt Component Utilities
 * Functions for component matching and directives
 */

// @ts-ignore - JSON import
import componentIndex from './component-index-cache.json';
import { COMPONENT_SECTION_KEYWORDS } from './prompt-data';
import { pickRandomUnique } from './prompt-random-utils';
import { rememberRecentComponent } from './prompt-variant-utils';

// Types
export type RegistryComponent = {
  name: string;
  description: string;
  category: string;
  source: string;
  tags?: string[];
  code?: string;
};

type ComponentIndex = {
  components?: RegistryComponent[];
};

// Safe imports whitelist
const SAFE_COMPONENT_IMPORTS = new Set(['react', 'framer-motion', 'lucide-react', 'clsx', 'tailwind-merge']);

// Component registry
const COMPONENT_REGISTRY: RegistryComponent[] = ((componentIndex as ComponentIndex).components ?? []).filter(Boolean);

// Recent component tracking
const RECENT_COMPONENT_LIMIT = 10;
const recentComponentSet = new Set<string>();
const recentComponentQueue: string[] = [];

const IMPORT_RE = /import\s+[^;]*?from\s+['"]([^'"]+)['"]/g;

/**
 * Section priority - more specific sections should be preferred
 * Higher number = higher priority
 */
const SECTION_PRIORITY: Record<string, number> = {
  hero: 10,
  navigation: 9,
  navbar: 9,
  header: 8,
  features: 7,
  products: 7,
  categories: 6,
  pricing: 6,
  testimonials: 5,
  gallery: 5,
  team: 4,
  contact: 4,
  faq: 4,
  footer: 3,
  cta: 3,
  about: 2,
  stats: 2,
  services: 2,
  projects: 2,
  blog: 2,
  logos: 1,
  newsletter: 1,
};

/**
 * Noisy component keywords that need more context
 */
const NOISY_COMPONENT_KEYWORDS = new Set([
  'card',
  'grid',
  'list',
  'text',
  'button',
  'icon',
  'image',
  'link',
  'container',
  'wrapper',
  'section',
  'block',
  'item',
  'box',
]);

/**
 * Strong keywords that indicate specific sections
 */
const STRONG_SECTION_KEYWORDS: Record<string, string[]> = {
  hero: ['hero', 'banner', 'spotlight', 'landing', 'splash', 'above-fold'],
  navigation: ['navbar', 'navigation', 'nav-bar', 'site-nav', 'main-nav'],
  header: ['header', 'page-header', 'site-header', 'top-bar'],
  features: ['feature', 'benefit', 'advantage', 'capability'],
  products: ['product', 'catalog', 'shop', 'store', 'merchandise'],
  pricing: ['pricing', 'price', 'plan', 'tier', 'subscription'],
  testimonials: ['testimonial', 'review', 'feedback', 'quote', 'customer-story'],
  footer: ['footer', 'site-footer', 'page-footer'],
};

/**
 * Extract component imports from code
 */
export function extractComponentImports(code: string): string[] {
  if (!code) {
    return [];
  }

  const imports: string[] = [];
  let match: RegExpExecArray | null = null;
  IMPORT_RE.lastIndex = 0;

  while ((match = IMPORT_RE.exec(code))) {
    imports.push(match[1]);
  }

  return imports;
}

/**
 * Check if a component is safe to use (no external dependencies)
 */
export function isSafeComponent(component: RegistryComponent): boolean {
  const code = component.code || '';

  if (!code) {
    return true;
  }

  const imports = extractComponentImports(code);

  for (const imp of imports) {
    if (imp.startsWith('.') || imp.startsWith('~') || imp.startsWith('@/')) {
      continue;
    }
    if (SAFE_COMPONENT_IMPORTS.has(imp)) {
      continue;
    }
    if (imp.startsWith('react') || imp.startsWith('next')) {
      continue;
    }
    return false;
  }

  return true;
}

// Safe component registry (filtered)
export const SAFE_COMPONENT_REGISTRY: RegistryComponent[] = COMPONENT_REGISTRY.filter((component) =>
  isSafeComponent(component),
);

/**
 * Get component text for matching
 */
export function componentText(component: RegistryComponent): string {
  return [component.name, component.description, component.category, component.source, ...(component.tags ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

/**
 * Score a component for a section with improved matching
 */
export function componentScore(component: RegistryComponent, section: string, theme: string): number {
  const text = componentText(component);
  const keywords = COMPONENT_SECTION_KEYWORDS[section] ?? [];
  const strongKeywords = STRONG_SECTION_KEYWORDS[section] ?? [];
  let score = 0;

  // Strong keyword matches get higher score
  for (const keyword of strongKeywords) {
    if (text.includes(keyword)) {
      score += 5;
    }
  }

  // Regular keyword matches
  for (const keyword of keywords) {
    if (text.includes(keyword)) {
      // Noisy keywords get lower score
      const keywordScore = NOISY_COMPONENT_KEYWORDS.has(keyword) ? 1 : 3;
      score += keywordScore;
    }
  }

  if (score === 0) {
    return 0;
  }

  // Theme bonus
  if (theme && text.includes(theme.toLowerCase())) {
    score += 2;
  }

  // Section priority bonus
  const priority = SECTION_PRIORITY[section] ?? 0;
  score += priority * 0.5;

  // Source quality bonus
  const source = (component.source || '').toLowerCase();
  if (source.includes('magicui')) score += 2;
  if (source.includes('aceternity')) score += 2;
  if (source.includes('reactbits')) score += 1;
  if (source.includes('shadcn')) score += 1;

  // Penalty for CLI/install components
  if (text.includes('install') || text.includes('cli')) {
    score -= 2;
  }

  // Penalty for generic/utility components
  if (text.includes('utility') || text.includes('helper')) {
    score -= 1;
  }

  return Math.max(0, score);
}

/**
 * Pick a component for a section
 */
export function pickComponentForSection(section: string, theme: string): RegistryComponent | null {
  if (SAFE_COMPONENT_REGISTRY.length === 0) {
    return null;
  }

  const scored = SAFE_COMPONENT_REGISTRY.map((component) => ({
    component,
    score: componentScore(component, section, theme),
  })).filter((entry) => entry.score > 0);

  if (scored.length === 0) {
    return null;
  }

  const fresh = scored.filter((entry) => !recentComponentSet.has((entry.component.name || '').toLowerCase()));
  const pool = fresh.length > 0 ? fresh : scored;

  pool.sort((a, b) => b.score - a.score);

  const shortlist = pool.slice(0, 8).map((entry) => entry.component);
  const pick = pickRandomUnique(shortlist, 1)[0] ?? shortlist[0];

  if (!pick) {
    return null;
  }

  rememberRecentComponent(pick.name);
  return pick;
}

/**
 * Build component directives for enhanced prompt
 */
export function buildComponentDirectives(
  mentionedSections: string[],
  theme: string,
  sectionLabels: Record<string, string>,
): string {
  if (SAFE_COMPONENT_REGISTRY.length === 0) {
    return '';
  }

  const targetSections = mentionedSections.filter((section) => COMPONENT_SECTION_KEYWORDS[section]);

  if (targetSections.length === 0) {
    return '';
  }

  const max = Math.min(3, targetSections.length);
  const chosenSections = pickRandomUnique(targetSections, max);
  const lines: string[] = [];

  for (const section of chosenSections) {
    const component = pickComponentForSection(section, theme);

    if (!component) {
      continue;
    }

    const label = sectionLabels[section] ?? section;
    const desc = (component.description || '').replace(/\s+/g, ' ').trim();
    const brief = desc.length > 100 ? `${desc.slice(0, 97)}...` : desc;
    const source = component.source ? ` (${component.source})` : '';
    const detail = brief ? ` \u2014 ${brief}` : '';
    lines.push(`- ${label}: Use "${component.name}"${source}${detail}.`);
  }

  if (lines.length === 0) {
    return '';
  }

  return [
    '\nCOMPONENT DIRECTIVES (required):',
    '- Implement 2-3 advanced components inspired by the registry below.',
    '- At least one component must add a distinctive background or motion effect (grid, aurora, beams, dots).',
    '- Do NOT import new dependencies; recreate with React + Tailwind + framer-motion.',
    ...lines,
  ].join('\n');
}
