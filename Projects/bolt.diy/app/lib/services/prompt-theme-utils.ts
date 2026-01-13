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
 * Noisy/ambiguous keywords that need additional context to avoid false positives.
 * These words are too generic on their own.
 */
const NOISY_KEYWORDS = new Set([
  // EN - too generic single words
  'app',
  'site',
  'page',
  'design',
  'store',
  'shop',
  'menu',
  'form',
  'gallery',
  'portfolio',
  'booking',
  'spa',
  'music',
  'photo',
  'creative',
  'visual',
  'platform',
  'service',
  'services',
  'product',
  'products',
  'brand',
  'company',
  'business',
  'website',
  'landing',
  // RU - too generic single words
  '\u0441\u0430\u0439\u0442', // сайт
  '\u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430', // страница
  '\u0434\u0438\u0437\u0430\u0439\u043d', // дизайн
  '\u043c\u0430\u0433\u0430\u0437\u0438\u043d', // магазин
  '\u043c\u0435\u043d\u044e', // меню
  '\u0444\u043e\u0440\u043c\u0430', // форма
  '\u0433\u0430\u043b\u0435\u0440\u0435\u044f', // галерея
  '\u043f\u043e\u0440\u0442\u0444\u043e\u043b\u0438\u043e', // портфолио
  '\u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435', // бронирование
  '\u0441\u043f\u0430', // спа
  '\u043c\u0443\u0437\u044b\u043a\u0430', // музыка
  '\u0444\u043e\u0442\u043e', // фото
  '\u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0430', // платформа
  '\u0441\u0435\u0440\u0432\u0438\u0441', // сервис
  '\u0443\u0441\u043b\u0443\u0433\u0438', // услуги
  '\u0442\u043e\u0432\u0430\u0440', // товар
  '\u0442\u043e\u0432\u0430\u0440\u044b', // товары
  '\u0431\u0440\u0435\u043d\u0434', // бренд
  '\u043a\u043e\u043c\u043f\u0430\u043d\u0438\u044f', // компания
  '\u0431\u0438\u0437\u043d\u0435\u0441', // бизнес
  '\u043b\u0435\u043d\u0434\u0438\u043d\u0433', // лендинг
]);

/**
 * Theme priority order - more specific themes should be checked first.
 * This prevents generic themes from matching before specific ones.
 */
const THEME_PRIORITY: string[] = [
  // Most specific first
  'vinyl',
  'restaurant',
  'hotel',
  'medical',
  'industrial',
  'photography',
  'beauty',
  'fashion',
  'furniture',
  'electronics',
  'realestate',
  'finance',
  'education',
  'automotive',
  'travel',
  'gaming',
  'sports',
  // More generic
  'food',
  'ecommerce',
  'tech',
  // Fallback
  'default',
];

/**
 * Check if a keyword is noisy and needs more context
 */
function isNoisyKeyword(keyword: string): boolean {
  return NOISY_KEYWORDS.has(keyword.toLowerCase());
}

/**
 * Detect theme from user prompt with noise filtering
 */
export function detectTheme(prompt: string): string {
  promptLog('[detectTheme] Input prompt:', prompt.substring(0, 300));
  const lowerPrompt = prompt.toLowerCase();
  promptLog('[detectTheme] Lower prompt:', lowerPrompt.substring(0, 200));

  // Score each theme by number of matching keywords
  const themeScores: Record<string, { score: number; firstKeyword: string }> = {};

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (theme === 'default') continue;

    for (const keyword of keywords) {
      if (matchesKeyword(lowerPrompt, keyword)) {
        // Noisy keywords get lower score
        const score = isNoisyKeyword(keyword) ? 0.5 : 1;

        if (!themeScores[theme]) {
          themeScores[theme] = { score: 0, firstKeyword: keyword };
        }
        themeScores[theme].score += score;
      }
    }
  }

  // Find best theme by priority order (for ties) and score
  let bestTheme = 'default';
  let bestScore = 0;

  for (const theme of THEME_PRIORITY) {
    const entry = themeScores[theme];
    if (entry && entry.score > bestScore) {
      bestScore = entry.score;
      bestTheme = theme;
      promptLog('[detectTheme] New best:', theme, 'score:', entry.score, 'keyword:', entry.firstKeyword);
    }
  }

  // Also check themes not in priority list
  for (const [theme, entry] of Object.entries(themeScores)) {
    if (!THEME_PRIORITY.includes(theme) && entry.score > bestScore) {
      bestScore = entry.score;
      bestTheme = theme;
      promptLog('[detectTheme] New best (unlisted):', theme, 'score:', entry.score);
    }
  }

  if (bestTheme === 'default') {
    promptLog('[detectTheme] NO THEME MATCHED - returning default');
  } else {
    promptLog('[detectTheme] FINAL theme:', bestTheme, 'score:', bestScore);
  }

  return bestTheme;
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
