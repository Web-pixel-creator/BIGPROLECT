/**
 * Component memory entries used as prompt directives.
 */

import type { SectionType } from './section-definitions';

export interface ComponentMemoryEntry {
  id: string;
  section: SectionType;
  themes: string[];
  snippet: string;
  unsafe?: boolean;
  forbiddenImports?: string[];
}

export const COMPONENT_MEMORY_ENTRIES: ComponentMemoryEntry[] = [
  {
    id: 'hero-editorial-overlap',
    section: 'hero',
    themes: ['fashion', 'photography', 'default'],
    snippet: 'Hero: split layout with oversized serif headline and floating CTA card over image.',
  },
  {
    id: 'hero-techno-split',
    section: 'hero',
    themes: ['electronics', 'gaming', 'automotive'],
    snippet: 'Hero: sharp split with media tile, metric strip, and bold CTA stack.',
  },
  {
    id: 'nav-centered-utility',
    section: 'navigation',
    themes: ['travel', 'hotel', 'default'],
    snippet: 'Navigation: centered links with logo above and utility icons right aligned.',
  },
  {
    id: 'features-bento-grid',
    section: 'features',
    themes: ['electronics', 'default'],
    snippet: 'Features: bento grid with one oversized tile and three supporting tiles.',
  },
  {
    id: 'pricing-spotlight-tier',
    section: 'pricing',
    themes: ['ecommerce', 'default'],
    snippet: 'Pricing: spotlight the mid tier with elevated card and contrasting badge.',
  },
  {
    id: 'testimonials-stacked',
    section: 'testimonials',
    themes: ['beauty', 'hotel', 'default'],
    snippet: 'Testimonials: stacked cards with avatar row and bold pull quote.',
  },
  {
    id: 'gallery-masonry',
    section: 'gallery',
    themes: ['photography', 'travel', 'default'],
    snippet: 'Gallery: masonry grid with alternating sizes and soft caption overlay.',
  },
  {
    id: 'cta-band-ribbon',
    section: 'cta',
    themes: ['sports', 'gaming', 'default'],
    snippet: 'CTA: full-width ribbon band with split headline and button cluster.',
  },
  {
    id: 'stats-pill-row',
    section: 'stats',
    themes: ['industrial', 'automotive', 'default'],
    snippet: 'Stats: pill counters with icon badges and vertical separators.',
  },
  {
    id: 'footer-newsletter-lift',
    section: 'footer',
    themes: ['ecommerce', 'fashion', 'default'],
    snippet: 'Footer: newsletter card lifted above multi-column link grid.',
  },
];
