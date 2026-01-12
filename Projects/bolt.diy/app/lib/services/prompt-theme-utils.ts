/**
 * Prompt Theme Utilities
 * Functions for detecting themes and generating brand names
 */

import { getMergedKeywords, FALLBACK_BRANDS } from './prompt-data';
import { matchesKeyword } from './prompt-color-utils';

// Merged keywords (EN + RU)
const THEME_KEYWORDS = getMergedKeywords();

/**
 * Detect theme from user prompt
 */
export function detectTheme(prompt: string): string {
  console.log('[detectTheme] Input prompt:', prompt.substring(0, 300));
  const lowerPrompt = prompt.toLowerCase();
  console.log('[detectTheme] Lower prompt:', lowerPrompt.substring(0, 200));

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    for (const keyword of keywords) {
      if (matchesKeyword(lowerPrompt, keyword)) {
        console.log('[detectTheme] MATCHED theme:', theme, 'keyword:', keyword);
        return theme;
      }
    }
  }

  console.log('[detectTheme] NO THEME MATCHED - returning default');
  return 'default';
}

/**
 * Extract brand name from prompt if explicitly mentioned
 */
export function extractBrandName(prompt: string): string | null {
  // Patterns for brand name extraction (EN and RU)
  const enPattern = /(?:called|named|brand(?: website)?|website called|brand name|project name)\s+["']?([\w\s&-]{2,60})["']?/i;
  const ruPattern = /(?:название|бренд|название бренда|сайт\s*под\s*названием|сайт\s*назван|магазин\s*под\s*названием|проект\s*под\s*названием)\s+["']?([\w\s&-]{2,60})["']?/iu;

  const patterns = [enPattern, ruPattern];

  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match?.[1]) {
      const trimmed = match[1].trim();
      const cleaned = trimmed.split(/[\n,.]/)[0].trim();
      if (cleaned.length >= 2) {
        return cleaned.replace(/\s{2,}/g, ' ');
      }
    }
  }

  return null;
}

/**
 * Simple string hash function
 */
export function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Generate a brand name based on theme and prompt
 */
export function generateBrandName(theme: string, prompt: string): string {
  const pool = FALLBACK_BRANDS[theme] ?? FALLBACK_BRANDS.default;
  const seed = hashString(`${theme}:${prompt}`);
  return pool[seed % pool.length] ?? FALLBACK_BRANDS.default[0];
}
