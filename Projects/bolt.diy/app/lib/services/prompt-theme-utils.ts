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
const FUZZY_MIN_LEN = 5;
const FUZZY_MAX_LEN = 18;
const FUZZY_SCORE = 0.75;

type ThemeScore = {
  score: number;
  firstKeyword: string;
};

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

function shouldFuzzyMatchKeyword(keyword: string): boolean {
  if (keyword.includes(' ')) {
    return false;
  }

  if (isNoisyKeyword(keyword)) {
    return false;
  }

  const length = keyword.length;
  return length >= FUZZY_MIN_LEN && length <= FUZZY_MAX_LEN;
}

function maxFuzzyDistance(length: number): number {
  return length <= 7 ? 1 : 2;
}

function tokenizeForFuzzy(prompt: string): string[] {
  const tokens = prompt
    .split(/[^\p{L}\p{N}]+/u)
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length >= FUZZY_MIN_LEN && token.length <= 24)
    .filter((token) => /\p{L}/u.test(token));

  return Array.from(new Set(tokens));
}

function isEditDistanceWithin(a: string, b: string, max: number): boolean {
  if (a === b) {
    return true;
  }

  const aChars = Array.from(a);
  const bChars = Array.from(b);
  const aLen = aChars.length;
  const bLen = bChars.length;

  if (Math.abs(aLen - bLen) > max) {
    return false;
  }

  let prev = new Array(bLen + 1).fill(0);
  let curr = new Array(bLen + 1).fill(0);

  for (let j = 0; j <= bLen; j += 1) {
    prev[j] = j;
  }

  for (let i = 1; i <= aLen; i += 1) {
    curr[0] = i;
    let rowMin = curr[0];

    for (let j = 1; j <= bLen; j += 1) {
      const cost = aChars[i - 1] === bChars[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);

      if (curr[j] < rowMin) {
        rowMin = curr[j];
      }
    }

    if (rowMin > max) {
      return false;
    }

    const swap = prev;
    prev = curr;
    curr = swap;
  }

  return prev[bLen] <= max;
}

function hasFuzzyMatch(keyword: string, tokens: string[]): boolean {
  if (!shouldFuzzyMatchKeyword(keyword)) {
    return false;
  }

  const target = keyword.toLowerCase();
  const maxDistance = maxFuzzyDistance(target.length);

  for (const token of tokens) {
    if (Math.abs(token.length - target.length) > maxDistance) {
      continue;
    }

    if (isEditDistanceWithin(token, target, maxDistance)) {
      return true;
    }
  }

  return false;
}

function addThemeScore(themeScores: Record<string, ThemeScore>, theme: string, keyword: string, score: number) {
  if (!themeScores[theme]) {
    themeScores[theme] = { score: 0, firstKeyword: keyword };
  }

  themeScores[theme].score += score;
}

function pickBestTheme(themeScores: Record<string, ThemeScore>): { theme: string; score: number; keyword: string } {
  let bestTheme = 'default';
  let bestScore = 0;
  let bestKeyword = '';

  for (const theme of THEME_PRIORITY) {
    const entry = themeScores[theme];
    if (entry && entry.score > bestScore) {
      bestScore = entry.score;
      bestTheme = theme;
      bestKeyword = entry.firstKeyword;
    }
  }

  for (const [theme, entry] of Object.entries(themeScores)) {
    if (!THEME_PRIORITY.includes(theme) && entry.score > bestScore) {
      bestScore = entry.score;
      bestTheme = theme;
      bestKeyword = entry.firstKeyword;
    }
  }

  return { theme: bestTheme, score: bestScore, keyword: bestKeyword };
}

/**
 * Detect theme from user prompt with noise filtering
 */
export function detectTheme(prompt: string): string {
  promptLog('[detectTheme] Input prompt:', prompt.substring(0, 300));
  const lowerPrompt = prompt.toLowerCase();
  promptLog('[detectTheme] Lower prompt:', lowerPrompt.substring(0, 200));

  // Score each theme by number of matching keywords
  const themeScores: Record<string, ThemeScore> = {};

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (theme === 'default') continue;

    for (const keyword of keywords) {
      if (matchesKeyword(lowerPrompt, keyword)) {
        // Noisy keywords get lower score
        const score = isNoisyKeyword(keyword) ? 0.5 : 1;

        addThemeScore(themeScores, theme, keyword, score);
      }
    }
  }

  let { theme: bestTheme, score: bestScore, keyword: bestKeyword } = pickBestTheme(themeScores);
  if (bestScore > 0) {
    promptLog('[detectTheme] New best:', bestTheme, 'score:', bestScore, 'keyword:', bestKeyword);
  }

  if (bestScore < 1) {
    const tokens = tokenizeForFuzzy(lowerPrompt);
    if (tokens.length > 0) {
      for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
        if (theme === 'default') continue;

        for (const keyword of keywords) {
          if (matchesKeyword(lowerPrompt, keyword)) {
            continue;
          }

          if (hasFuzzyMatch(keyword, tokens)) {
            addThemeScore(themeScores, theme, keyword, FUZZY_SCORE);
          }
        }
      }

      ({ theme: bestTheme, score: bestScore, keyword: bestKeyword } = pickBestTheme(themeScores));
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
