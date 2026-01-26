/**
 * Prompt Variant Utilities
 * Functions for managing section variants and effects
 */

import {
  THEME_EFFECT_IDS,
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
} from './prompt-data';
import { pickRandomUnique } from './prompt-random-utils';

// Recent component tracking
const RECENT_COMPONENT_LIMIT = 10;
const recentComponentSet = new Set<string>();
const recentComponentQueue: string[] = [];
const recentSectionVariants = new Map<string, string>();

/**
 * Pick effect IDs for a theme
 */
export function pickEffectIds(theme: string, count: number, rng?: () => number): string[] {
  const list = THEME_EFFECT_IDS[theme] ?? THEME_EFFECT_IDS.default;
  return pickRandomUnique(list, count, rng);
}

/**
 * Build effect directive block for enhanced prompt
 */
export function buildEffectDirectiveBlock(theme: string, rng?: () => number): string {
  const picks = pickEffectIds(theme, 2, rng);
  if (picks.length === 0) {
    return '';
  }
  return `\nEFFECTS (apply in UI): ${picks.join(', ')}`;
}

/**
 * Remember a recently used component to avoid repetition
 */
export function rememberRecentComponent(name: string) {
  const key = (name || '').trim().toLowerCase();
  if (!key || recentComponentSet.has(key)) {
    return;
  }

  recentComponentSet.add(key);
  recentComponentQueue.push(key);

  if (recentComponentQueue.length > RECENT_COMPONENT_LIMIT) {
    const removed = recentComponentQueue.shift();
    if (removed) {
      recentComponentSet.delete(removed);
    }
  }
}

/**
 * Pick a non-repeating variant for a section
 */
export function pickNonRepeatingVariant(section: string, options: string[], rng?: () => number): string {
  if (!options || options.length === 0) {
    return '';
  }

  const last = recentSectionVariants.get(section);
  const filtered = last ? options.filter((option) => option !== last) : options;
  const choice = pickRandomUnique(filtered.length > 0 ? filtered : options, 1, rng)[0] ?? options[0];

  if (choice) {
    recentSectionVariants.set(section, choice);
  }

  return choice;
}

/**
 * Resolve section variant options based on prompt cues
 */
export function resolveSectionVariantOptions(section: string, lowerPrompt: string): string[] {
  if (section === 'hero') {
    if (/full[-\s]?width|full[-\s]?screen|full[-\s]?bleed/.test(lowerPrompt)) {
      return HERO_FULL_WIDTH_VARIANTS;
    }
    if (/split|two[-\s]?column|two column/.test(lowerPrompt)) {
      return HERO_SPLIT_VARIANTS;
    }
    if (/grid|masonry|bento/.test(lowerPrompt)) {
      return HERO_GRID_VARIANTS;
    }
    if (/typography|type-heavy|typographic/.test(lowerPrompt)) {
      return HERO_TYPO_VARIANTS;
    }
    return HERO_DEFAULT_VARIANTS;
  }

  if (section === 'categories') return CATEGORY_VARIANTS;
  if (section === 'products') return PRODUCT_VARIANTS;
  if (section === 'footer') return FOOTER_VARIANTS;
  if (section === 'navigation') return NAV_VARIANTS;
  if (section === 'features') return FEATURE_VARIANTS;

  return [];
}

/**
 * Build section variant block for enhanced prompt
 */
export function buildSectionVariantBlock(
  mentionedSections: string[],
  lowerPrompt: string,
  sectionLabels: Record<string, string>,
  rng?: () => number,
): string {
  if (mentionedSections.length === 0) {
    return '';
  }

  const lines = mentionedSections
    .map((section) => {
      const options = resolveSectionVariantOptions(section, lowerPrompt);
      if (!options || options.length === 0) {
        return '';
      }

      const pick = pickNonRepeatingVariant(section, options, rng);
      if (!pick) {
        return '';
      }

      const label = sectionLabels[section] ?? section;
      return `- ${label}: ${pick}`;
    })
    .filter(Boolean);

  return lines.length > 0 ? `\nSECTION VARIANTS (must apply, keep user requirements):\n${lines.join('\n')}` : '';
}

/**
 * Reset variant tracking (for testing)
 */
export function resetVariantTracking() {
  recentComponentSet.clear();
  recentComponentQueue.length = 0;
  recentSectionVariants.clear();
}
