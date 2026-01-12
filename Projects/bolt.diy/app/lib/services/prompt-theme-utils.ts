/**
 * Prompt Theme Utilities
 * Functions for detecting themes and generating brand names
 */

import { getMergedKeywords, FALLBACK_BRANDS } from './prompt-data';
import { matchesKeyword } from './prompt-color-utils';
import { promptLog } from './prompt-logger';

// Merged keywords (EN + RU)
const THEME_KEYWORDS = getMergedKeywords();

/**
 * Detect theme from user prompt
 */
export function detectTheme(prompt: string): string {
  promptLog('[detectTheme] Input prompt:', prompt.substring(0, 300));
  const lowerPrompt = prompt.toLowerCase();
  promptLog('[detectTheme] Lower prompt:', lowerPrompt.substring(0, 200));

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    for (const keyword of keywords) {
      if (matchesKeyword(lowerPrompt, keyword)) {
        promptLog('[detectTheme] MATCHED theme:', theme, 'keyword:', keyword);
        return theme;
      }
    }
  }

  promptLog('[detectTheme] NO THEME MATCHED - returning default');
  return 'default';
}

/**
 * Extract brand name from prompt if explicitly mentioned
 */
export function extractBrandName(prompt: string): string | null {
  // Patterns for brand name extraction (EN and RU)
  const enPattern = /(?:called|named|brand(?: website)?|website called|brand name|project name)\s+["']?([\w\s&-]{2,60})["']?/i;
  const ruPattern =
    /(?:\u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435|\u0431\u0440\u0435\u043D\u0434|\u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0431\u0440\u0435\u043D\u0434\u0430|\u0441\u0430\u0439\u0442\s*\u043F\u043E\u0434\s*\u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435\u043C|\u0441\u0430\u0439\u0442\s*\u043D\u0430\u0437\u0432\u0430\u043D|\u043C\u0430\u0433\u0430\u0437\u0438\u043D\s*\u043F\u043E\u0434\s*\u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435\u043C|\u043F\u0440\u043E\u0435\u043A\u0442\s*\u043F\u043E\u0434\s*\u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435\u043C)\s+["']?([\p{L}\p{N}&\-\s]{2,60})["']?/iu;

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
