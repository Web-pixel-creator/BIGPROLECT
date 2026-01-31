import type { SectionType } from './section-definitions';

/**
 * Default section sets for common website types.
 */
export const WEBSITE_PRESETS: Record<string, SectionType[]> = {
  landing: ['navigation', 'hero', 'features', 'cta', 'footer'],
  saas: ['navigation', 'hero', 'features', 'pricing', 'testimonials', 'faq', 'cta', 'footer'],
  portfolio: ['navigation', 'hero', 'gallery', 'about', 'contact', 'footer'],
  business: ['navigation', 'hero', 'services', 'about', 'team', 'contact', 'footer'],
  ecommerce: ['navigation', 'hero', 'features', 'gallery', 'testimonials', 'cta', 'footer'],
  blog: ['navigation', 'hero', 'blog', 'about', 'contact', 'footer'],
  startup: ['navigation', 'hero', 'features', 'stats', 'pricing', 'testimonials', 'cta', 'footer'],
};

/**
 * Section generation order (some sections depend on others for style consistency).
 */
export const SECTION_ORDER: SectionType[] = [
  'navigation',
  'hero',
  'logos',
  'marquee',
  'features',
  'services',
  'about',
  'how-it-works',
  'stats',
  'gallery',
  'team',
  'comparison',
  'integration',
  'pricing',
  'testimonials',
  'blog',
  'faq',
  'newsletter',
  'cta',
  'contact',
  'footer',
];

/**
 * Section priority for ordering.
 */
export const SECTION_PRIORITY: Record<SectionType, number> = {
  navigation: 0,
  hero: 1,
  features: 2,
  services: 2,
  about: 3,
  stats: 3,
  gallery: 4,
  team: 4,
  pricing: 5,
  testimonials: 5,
  blog: 6,
  logos: 6,
  marquee: 6,
  'how-it-works': 6,
  comparison: 6,
  integration: 6,
  faq: 6,
  cta: 7,
  contact: 7,
  newsletter: 7,
  footer: 8,
};
