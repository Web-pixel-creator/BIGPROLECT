/**
 * Design System Index
 * 
 * Central export point for all design system modules.
 */

// Design Tokens
export {
  type DesignTokens,
  type ColorPalette,
  type TypographyScale,
  type SpacingScale,
  type AnimationTokens,
  type BorderRadius,
  type Shadows,
  generateDesignTokens,
  tokensToCSS,
  tokensToTailwindConfig,
} from './tokens';

// Style Mixer
export {
  type StyleProfile,
  type BaseStyle,
  type StyleFeature,
  type StyleOverrides,
  StyleMixer,
  createStyleMixer,
  mixStyles,
  getAllBaseStyles,
  getAllStyleFeatures,
  BASE_STYLES,
  STYLE_FEATURES,
} from './styleMixer';

// Layout Patterns
export {
  type LayoutPattern,
  type LayoutSection,
  type SectionType,
  type GeneratedLayout,
  LayoutGenerator,
  createLayoutGenerator,
  generateLayout,
  getAllLayoutPatterns,
  getPatternsByCategory,
  LAYOUT_PATTERNS,
  PATTERN_MODIFIERS,
} from './layoutPatterns';

// Component Variants
export {
  type ComponentVariant,
  type LayoutConfig,
  type StylingConfig,
  type AnimationConfig,
  VariantSelector,
  createVariantSelector,
  selectVariant,
  getVariantsByType,
  getAllVariants,
  HERO_VARIANTS,
  NAVIGATION_VARIANTS,
  FEATURES_VARIANTS,
  TESTIMONIALS_VARIANTS,
  CTA_VARIANTS,
  ABOUT_VARIANTS,
  TEAM_VARIANTS,
  STATS_VARIANTS,
  LOGOS_VARIANTS,
  MARQUEE_VARIANTS,
  HOW_IT_WORKS_VARIANTS,
  COMPARISON_VARIANTS,
  INTEGRATION_VARIANTS,
  PRICING_VARIANTS,
  FAQ_VARIANTS,
  GALLERY_VARIANTS,
  BLOG_VARIANTS,
  FOOTER_VARIANTS,
  SERVICES_VARIANTS,
  CONTACT_VARIANTS,
  PRODUCTS_VARIANTS,
  CATEGORIES_VARIANTS,
  REVIEWS_VARIANTS,
  POSTS_VARIANTS,
  NEWSLETTER_VARIANTS,
  ALL_VARIANTS,
} from './componentVariants';

// Animations
export {
  type AnimationPreset,
  type AnimationProperties,
  type AnimationGroup,
  AnimationSelector,
  createAnimationSelector,
  selectAnimation,
  getAnimationsByCategory,
  getAllAnimations,
  ENTRANCE_ANIMATIONS,
  SCROLL_ANIMATIONS,
  HOVER_ANIMATIONS,
  MICRO_INTERACTIONS,
  BACKGROUND_ANIMATIONS,
  ALL_ANIMATIONS,
} from './animations';

// Random utilities
export {
  type SeededRandom,
  seededRandom,
  generateSeed,
  stringToSeed,
} from './random';

// Extended Component Library (500+ components from 21st.dev, Aceternity, React Bits, etc.)
export {
  BUTTON_VARIANTS,
  BACKGROUND_VARIANTS,
  TEXT_ANIMATION_VARIANTS,
  CARD_VARIANTS,
  HERO_EXTENDED_VARIANTS,
  CURSOR_VARIANTS,
  SCROLL_ANIMATION_VARIANTS,
  getAllExtendedVariants,
  getVariantsByCategory,
  getVariantsByComplexity,
} from './extendedLibrary';

// ============================================================================
// INTEGRATION HELPER
// ============================================================================

import { generateDesignTokens } from './tokens';
import { mixStyles } from './styleMixer';
import { generateLayout } from './layoutPatterns';
import { selectVariant } from './componentVariants';
import { createAnimationSelector } from './animations';
import { seededRandom } from './random';

export interface CompleteDesignSystem {
  seed: number;
  tokens: ReturnType<typeof generateDesignTokens>;
  styleProfile: ReturnType<typeof mixStyles>;
  layout: ReturnType<typeof generateLayout>;
  variants: Record<string, ReturnType<typeof selectVariant>>;
  animations: ReturnType<typeof createAnimationSelector>;
  css: string;
}

/**
 * Generate a complete design system for a project
 */
export function generateCompleteDesignSystem(seed?: number): CompleteDesignSystem {
  const finalSeed = seed ?? Date.now();
  const random = seededRandom(finalSeed);
  
  // Generate all components
  const tokens = generateDesignTokens(finalSeed);
  const styleProfile = mixStyles(finalSeed, 3);
  const layout = generateLayout(finalSeed);
  
  // Select variants for key components
  const variants = {
    hero: selectVariant('hero', finalSeed),
    navigation: selectVariant('navigation', finalSeed + 1),
    features: selectVariant('features', finalSeed + 2),
    testimonials: selectVariant('testimonials', finalSeed + 3),
    cta: selectVariant('cta', finalSeed + 4),
    about: selectVariant('about', finalSeed + 5),
    stats: selectVariant('stats', finalSeed + 6),
    logos: selectVariant('logos', finalSeed + 7),
    marquee: selectVariant('marquee', finalSeed + 8),
    howItWorks: selectVariant('how-it-works', finalSeed + 9),
    comparison: selectVariant('comparison', finalSeed + 10),
    integration: selectVariant('integration', finalSeed + 11),
    pricing: selectVariant('pricing', finalSeed + 12),
    faq: selectVariant('faq', finalSeed + 13),
    blog: selectVariant('blog', finalSeed + 14),
    team: selectVariant('team', finalSeed + 15),
    gallery: selectVariant('gallery', finalSeed + 16),
    footer: selectVariant('footer', finalSeed + 17),
    services: selectVariant('services', finalSeed + 18),
    contact: selectVariant('contact', finalSeed + 19),
    products: selectVariant('products', finalSeed + 20),
    categories: selectVariant('categories', finalSeed + 21),
    reviews: selectVariant('reviews', finalSeed + 22),
    posts: selectVariant('posts', finalSeed + 23),
    newsletter: selectVariant('newsletter', finalSeed + 24),
  };
  
  // Create animation selector
  const animations = createAnimationSelector(finalSeed);
  
  // Generate combined CSS
  const css = generateCombinedCSS(tokens, styleProfile, layout);
  
  return {
    seed: finalSeed,
    tokens,
    styleProfile,
    layout,
    variants,
    animations,
    css,
  };
}

function generateCombinedCSS(
  tokens: ReturnType<typeof generateDesignTokens>,
  styleProfile: ReturnType<typeof mixStyles>,
  layout: ReturnType<typeof generateLayout>
): string {
  const lines: string[] = [
    '/* Generated Design System CSS */',
    `/* Seed: ${Date.now()} */`,
    '',
  ];
  
  // Add design tokens CSS
  lines.push('/* Design Tokens */');
  lines.push(tokensToCSS(tokens));
  lines.push('');
  
  // Add style profile CSS
  lines.push('/* Style Profile */');
  lines.push(styleProfile.tokens ? tokensToCSS(styleProfile.tokens) : '');
  lines.push('');
  
  // Add layout CSS variables
  lines.push('/* Layout Variables */');
  lines.push(':root {');
  Object.entries(layout.cssVariables).forEach(([key, value]) => {
    lines.push(`  ${key}: ${value};`);
  });
  lines.push('}');
  
  return lines.join('\n');
}

import { tokensToCSS } from './tokens';
