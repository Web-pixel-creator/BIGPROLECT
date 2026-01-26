/**
 * Style pack definitions for design DNA.
 */

export type StylePack = {
  id: string;
  label: string;
  fontPairing: string;
  typeScale: string;
  gridStyle: string;
  spacingScale: string;
  shapeLanguage: string;
  effects: string[];
  motionNotes: string[];
};

export const STYLE_PACKS: StylePack[] = [
  {
    id: 'editorial-serif',
    label: 'Editorial Serif',
    fontPairing: 'High-contrast serif headlines with neutral sans body',
    typeScale: 'Oversized H1, tight H2, generous body copy',
    gridStyle: 'Editorial grid with wide margins and asymmetric columns',
    spacingScale: 'Airy spacing with large section padding',
    shapeLanguage: 'Sharp rectangles with thin rules',
    effects: ['grid-pattern', 'sparkles-text'],
    motionNotes: ['Slow fade-in on hero imagery', 'Underline reveal on hover'],
  },
  {
    id: 'neo-brutal',
    label: 'Neo Brutal',
    fontPairing: 'Monospace accents with heavy grotesk headlines',
    typeScale: 'Blocky headings with compact body text',
    gridStyle: 'Rigid grid with hard breaks and stacked blocks',
    spacingScale: 'Dense spacing with punchy section breaks',
    shapeLanguage: 'Hard edges, thick borders, bold blocks',
    effects: ['retro-grid', 'border-beam'],
    motionNotes: ['Immediate hover lifts', 'Snappy button press states'],
  },
  {
    id: 'aura-glass',
    label: 'Aura Glass',
    fontPairing: 'Modern sans headlines with soft rounded body',
    typeScale: 'Large headlines with roomy subheads',
    gridStyle: 'Layered grid with floating panels',
    spacingScale: 'Loose spacing with layered overlaps',
    shapeLanguage: 'Rounded panels with translucent layers',
    effects: ['aurora-text', 'blur-fade'],
    motionNotes: ['Soft parallax shifts', 'Glass shimmer on hover'],
  },
  {
    id: 'swiss-minimal',
    label: 'Swiss Minimal',
    fontPairing: 'Neutral sans with strong typographic hierarchy',
    typeScale: 'Precise scale with generous leading',
    gridStyle: 'Strict column grid with balanced whitespace',
    spacingScale: 'Consistent rhythm with modest padding',
    shapeLanguage: 'Clean rectangles with subtle dividers',
    effects: ['grid-pattern'],
    motionNotes: ['Subtle fade and slide transitions'],
  },
  {
    id: 'bold-typographic',
    label: 'Bold Typographic',
    fontPairing: 'Display sans headlines with compact subheads',
    typeScale: 'Extra-large type with tight tracking',
    gridStyle: 'Type-led layout with stacked content rails',
    spacingScale: 'Focused spacing that highlights typography',
    shapeLanguage: 'Simple blocks with typographic emphasis',
    effects: ['animated-gradient-text'],
    motionNotes: ['Type reveal on scroll', 'CTA pulse on hover'],
  },
  {
    id: 'soft-organic',
    label: 'Soft Organic',
    fontPairing: 'Friendly serif headlines with warm sans body',
    typeScale: 'Comfortable scale with relaxed body sizing',
    gridStyle: 'Flowing layout with staggered cards',
    spacingScale: 'Generous spacing with soft section breaks',
    shapeLanguage: 'Rounded cards and organic shapes',
    effects: ['ripple', 'shine-border'],
    motionNotes: ['Gentle float on cards', 'Soft glow on hover'],
  },
  {
    id: 'techno-noir',
    label: 'Techno Noir',
    fontPairing: 'Condensed sans headlines with mono accents',
    typeScale: 'Tall headlines with compact body text',
    gridStyle: 'Split layout with sharp vertical cuts',
    spacingScale: 'Tight spacing with strong contrast breaks',
    shapeLanguage: 'Angular panels with sharp corners',
    effects: ['flickering-grid', 'warp-background'],
    motionNotes: ['Glitchy hover accents', 'Quick line sweeps'],
  },
  {
    id: 'playful-product',
    label: 'Playful Product',
    fontPairing: 'Rounded sans headlines with lively body',
    typeScale: 'Big friendly headers with roomy body',
    gridStyle: 'Bento grid with playful tile sizing',
    spacingScale: 'Rhythmic spacing with card clusters',
    shapeLanguage: 'Soft corners with pill badges',
    effects: ['neon-gradient-card', 'sparkles-text'],
    motionNotes: ['Card bounce on hover', 'Sticker-style pop-ins'],
  },
  {
    id: 'heritage-craft',
    label: 'Heritage Craft',
    fontPairing: 'Classic serif headlines with refined sans',
    typeScale: 'Balanced scale with elegant body text',
    gridStyle: 'Magazine grid with framed imagery',
    spacingScale: 'Measured spacing with strong margins',
    shapeLanguage: 'Framed cards and subtle borders',
    effects: ['grid-pattern', 'shine-border'],
    motionNotes: ['Slow fades with subtle zoom'],
  },
  {
    id: 'cinematic-luxe',
    label: 'Cinematic Luxe',
    fontPairing: 'Elegant serif headlines with minimal sans',
    typeScale: 'Large cinematic headlines with airy body',
    gridStyle: 'Full-bleed sections with layered overlays',
    spacingScale: 'Wide spacing with dramatic section breaks',
    shapeLanguage: 'Long rectangles with glossy accents',
    effects: ['aurora-text', 'progressive-blur'],
    motionNotes: ['Slow hero drift', 'Soft reveal on scroll'],
  },
];

export const STYLE_PACK_INDEX: Record<string, StylePack> = Object.fromEntries(
  STYLE_PACKS.map((pack) => [pack.id, pack])
);

export const DEFAULT_STYLE_PACK_ID = 'editorial-serif';

export function getStylePackById(stylePackId: string): StylePack | undefined {
  return STYLE_PACK_INDEX[stylePackId];
}
