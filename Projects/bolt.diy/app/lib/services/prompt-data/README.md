# Prompt Data Module

Data constants for the Prompt Enhancer service. This module contains theme keywords, color mappings, palettes, and image queries.

## Structure

```
prompt-data/
|- index.ts              # Re-exports all modules
|- theme-keywords.ts     # Theme detection keywords (EN/RU)
|- color-mappings.ts     # Color word to HEX mappings
|- theme-palettes.ts     # Color palettes per theme
|- image-queries.ts      # Image search queries per theme
|- section-keywords.ts   # Section detection keywords (EN/RU)
|- section-variants.ts   # Section variants and component keywords
|- theme-guidance.ts     # Theme art directions and fallbacks
|- style-cues.ts         # Style cue tokens for prompt parsing
|- style-packs.ts        # Style pack definitions (Design DNA)
|- design-quality.ts     # Design quality scoring helper
|- component-memory.ts   # Component memory prompt directives
`- README.md             # This file
```

## Usage

```typescript
import {
  THEME_KEYWORDS,
  THEME_KEYWORDS_RU,
  getMergedKeywords,
  COLOR_WORDS_TO_HEX,
  getMergedColors,
  THEME_PALETTES,
  THEME_IMAGE_QUERIES,
  IMAGE_SIZES,
  MAX_IMAGE_COUNTS,
} from './prompt-data';

// Get merged EN+RU keywords (call once at init)
const allKeywords = getMergedKeywords();

// Get merged EN+RU colors (call once at init)
const allColors = getMergedColors();
```

## Encoding Rules

- All files MUST be UTF-8 without BOM
- Russian strings should be plain UTF-8 text
- Use `\uXXXX` escape sequences only for special/invisible characters
- Run `npm run encoding:check` to verify encoding

## Adding New Themes

1. Add EN keywords to `THEME_KEYWORDS` in `theme-keywords.ts`
2. Add RU keywords to `THEME_KEYWORDS_RU` in `theme-keywords.ts`
3. Add palette to `THEME_PALETTES` in `theme-palettes.ts`
4. Add image queries to `THEME_IMAGE_QUERIES` in `image-queries.ts`

### Example: Adding "automotive" theme

```typescript
// theme-keywords.ts
export const THEME_KEYWORDS = {
  // ...existing themes
  automotive: ['car', 'auto', 'vehicle', 'dealership', 'garage'],
};

export const THEME_KEYWORDS_RU = {
  // ...existing themes
  automotive: ['автомобиль', 'авто', 'машина', 'автосалон', 'гараж'],
};

// theme-palettes.ts
export const THEME_PALETTES = {
  // ...existing palettes
  automotive: {
    dark: '#1a1a1a',
    light: '#f5f5f5',
    accent: '#dc2626',
    accentName: 'red',
    textOnDark: '#ffffff',
    textOnLight: '#1a1a1a',
  },
};

// image-queries.ts
export const THEME_IMAGE_QUERIES = {
  // ...existing queries
  automotive: {
    hero: ['car showroom', 'luxury car', 'automotive interior'],
    gallery: ['car detail', 'engine close up', 'car interior'],
    products: ['car white background', 'wheel white background'],
  },
};
```

## EN/RU Parity

Every theme in `THEME_KEYWORDS` should have a corresponding entry in `THEME_KEYWORDS_RU`. Run `npm run keywords:test` to verify parity.

## Data Module Purity

These modules export only data constants and pure functions. They should NOT:
- Execute side effects on import
- Mutate global objects
- Make network calls
- Access file system
- Use `console.log` at module level

The `getMergedKeywords()` and `getMergedColors()` functions return new objects instead of mutating the original constants.
