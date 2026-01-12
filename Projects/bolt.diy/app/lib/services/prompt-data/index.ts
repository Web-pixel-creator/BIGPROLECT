/**
 * Prompt Data Module
 * Re-exports all data constants and utility functions
 *
 * Usage:
 *   import { THEME_KEYWORDS, getMergedKeywords } from './prompt-data';
 *
 * Encoding rules:
 * - All files must be UTF-8 without BOM
 * - Use \uXXXX for special characters if needed
 * - Russian strings should be plain UTF-8 text
 */

// Theme keywords
export {
  THEME_KEYWORDS,
  THEME_KEYWORDS_RU,
  getMergedKeywords,
} from './theme-keywords';

// Color mappings
export {
  COLOR_WORDS_TO_HEX,
  RU_COLOR_WORDS,
  getMergedColors,
  type ColorDefinition,
} from './color-mappings';

// Theme palettes
export {
  THEME_PALETTES,
  type ThemePalette,
} from './theme-palettes';

// Image queries
export {
  THEME_IMAGE_QUERIES,
  IMAGE_SIZES,
  MAX_IMAGE_COUNTS,
  SECTION_IMAGE_MIN_COUNTS,
  type ImageQuerySet,
  type ImageSet,
  type ImageSearchQueries,
  type ImageSearchCounts,
} from './image-queries';

// Section keywords
export { SECTION_KEYWORDS } from './section-keywords';

// Section definitions
export {
  SECTION_DEFINITIONS,
  type SectionType,
  type SectionDefinition,
} from './section-definitions';

// Website presets
export {
  WEBSITE_PRESETS,
  SECTION_ORDER,
  SECTION_PRIORITY,
} from './website-presets';

// Section variants and component keywords
export {
  COMPONENT_SECTION_KEYWORDS,
  HERO_FULL_WIDTH_VARIANTS,
  HERO_SPLIT_VARIANTS,
  HERO_GRID_VARIANTS,
  HERO_TYPO_VARIANTS,
  HERO_DEFAULT_VARIANTS,
  CATEGORY_VARIANTS,
  PRODUCT_VARIANTS,
  FOOTER_VARIANTS,
  NAV_VARIANTS,
  FEATURE_VARIANTS,
} from './section-variants';

// Theme guidance
export {
  THEME_ART_DIRECTIONS,
  THEME_SIGNATURE_MOVES,
  GLOBAL_SIGNATURE_MOVES,
  THEME_EFFECT_IDS,
  THEME_LAYOUT_ARCHETYPES,
  FALLBACK_BRANDS,
} from './theme-guidance';

// Style cues
export { STYLE_CUE_TOKENS } from './style-cues';

// Component keywords (for UI component matching)
export {
  COMPONENT_KEYWORDS_EN,
  COMPONENT_KEYWORDS_RU,
  COMPONENT_KEYWORDS,
  getMergedComponentKeywords,
} from './component-keywords';

// Seeded random utilities
export {
  createSeededRandom,
  setGlobalSeed,
  resetGlobalRng,
  getGlobalRng,
  randomInt,
  pickRandom,
  shuffleArray,
  randomSeedString,
  randomImageSeed,
} from './seeded-random';
