/**
 * Section Priorities for Component Scoring
 *
 * These priorities are used for scoring/ranking components during matching.
 * Higher number = higher priority = more important for matching.
 *
 * NOTE: This is different from SECTION_PRIORITY in website-presets.ts
 * which defines page order (lower = earlier on page).
 */

/**
 * Section scoring priority - used for component matching
 * Higher number = higher priority in scoring
 */
export const SECTION_SCORING_PRIORITY: Record<string, number> = {
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
 * Noisy component keywords that need more context to be meaningful
 * These get lower weight in scoring
 */
export const NOISY_COMPONENT_KEYWORDS = new Set([
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
 * Strong section keywords that strongly indicate a specific section type
 * These get higher weight in scoring
 */
export const STRONG_SECTION_KEYWORDS: Record<string, string[]> = {
  hero: ['hero', 'banner', 'spotlight', 'landing', 'splash', 'above-fold'],
  navigation: ['navbar', 'navigation', 'nav-bar', 'site-nav', 'main-nav'],
  navbar: ['navbar', 'navigation', 'nav-bar', 'site-nav', 'main-nav'],
  header: ['header', 'page-header', 'site-header', 'top-bar'],
  features: ['feature', 'benefit', 'advantage', 'capability'],
  products: ['product', 'catalog', 'shop', 'store', 'merchandise'],
  pricing: ['pricing', 'price', 'plan', 'tier', 'subscription'],
  testimonials: ['testimonial', 'review', 'feedback', 'quote', 'customer-story'],
  footer: ['footer', 'site-footer', 'page-footer'],
};

/**
 * Get scoring priority for a section type
 */
export function getSectionScoringPriority(section: string): number {
  return SECTION_SCORING_PRIORITY[section] ?? 0;
}

/**
 * Check if a keyword is noisy (needs more context)
 */
export function isNoisyKeyword(keyword: string): boolean {
  return NOISY_COMPONENT_KEYWORDS.has(keyword);
}

/**
 * Get strong keywords for a section type
 */
export function getStrongKeywords(section: string): string[] {
  return STRONG_SECTION_KEYWORDS[section] ?? [];
}
