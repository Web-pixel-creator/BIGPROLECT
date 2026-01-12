/**
 * Color Mappings Data Module
 * Contains color word to HEX mappings for EN and RU
 */

export type ColorDefinition = {
  hex: string;
  type: 'dark' | 'light' | 'accent';
};

// Color word to HEX mapping (EN)
export const COLOR_WORDS_TO_HEX: Record<string, ColorDefinition> = {
  'black': { hex: '#111113', type: 'dark' },
  'deep black': { hex: '#0a0a0a', type: 'dark' },
  'charcoal': { hex: '#111113', type: 'dark' },
  'graphite': { hex: '#111113', type: 'dark' },
  'dark gray': { hex: '#1f2937', type: 'dark' },
  'dark grey': { hex: '#1f2937', type: 'dark' },
  'night': { hex: '#0a0a0a', type: 'dark' },
  'white': { hex: '#ffffff', type: 'light' },
  'ivory': { hex: '#f4f3ef', type: 'light' },
  'cream': { hex: '#fdf5e6', type: 'light' },
  'off-white': { hex: '#f8f6f3', type: 'light' },
  'light gray': { hex: '#f3f4f6', type: 'light' },
  'light grey': { hex: '#f3f4f6', type: 'light' },
  'beige': { hex: '#f5f5f0', type: 'light' },
  'gold': { hex: '#C9A66B', type: 'accent' },
  'amber': { hex: '#d97706', type: 'accent' },
  'orange': { hex: '#f97316', type: 'accent' },
  'red': { hex: '#dc2626', type: 'accent' },
  'blue': { hex: '#3b82f6', type: 'accent' },
  'sky': { hex: '#0ea5e9', type: 'accent' },
  'teal': { hex: '#14b8a6', type: 'accent' },
  'green': { hex: '#22c55e', type: 'accent' },
  'emerald': { hex: '#059669', type: 'accent' },
  'purple': { hex: '#8b5cf6', type: 'accent' },
  'pink': { hex: '#ec4899', type: 'accent' },
};

// Color word to HEX mapping (RU)
export const RU_COLOR_WORDS: Record<string, ColorDefinition> = {
  'черный': { hex: '#111113', type: 'dark' },
  'чёрный': { hex: '#111113', type: 'dark' },
  'глубокий черный': { hex: '#0a0a0a', type: 'dark' },
  'темный': { hex: '#111113', type: 'dark' },
  'тёмный': { hex: '#111113', type: 'dark' },
  'белый': { hex: '#ffffff', type: 'light' },
  'кремовый': { hex: '#fdf5e6', type: 'light' },
  'слоновая кость': { hex: '#f4f3ef', type: 'light' },
  'молочный': { hex: '#f8f6f3', type: 'light' },
  'светлый': { hex: '#f8f6f3', type: 'light' },
  'бежевый': { hex: '#f5f5f0', type: 'light' },
  'серый': { hex: '#f3f4f6', type: 'light' },
  'темно-серый': { hex: '#1f2937', type: 'dark' },
  'тёмно-серый': { hex: '#1f2937', type: 'dark' },
  'светло-серый': { hex: '#f3f4f6', type: 'light' },
  'золотой': { hex: '#C9A66B', type: 'accent' },
  'золото': { hex: '#C9A66B', type: 'accent' },
  'янтарный': { hex: '#d97706', type: 'accent' },
  'красный': { hex: '#dc2626', type: 'accent' },
  'синий': { hex: '#3b82f6', type: 'accent' },
  'голубой': { hex: '#0ea5e9', type: 'accent' },
  'бирюзовый': { hex: '#14b8a6', type: 'accent' },
  'зеленый': { hex: '#22c55e', type: 'accent' },
  'зелёный': { hex: '#22c55e', type: 'accent' },
  'изумрудный': { hex: '#059669', type: 'accent' },
  'фиолетовый': { hex: '#8b5cf6', type: 'accent' },
  'розовый': { hex: '#ec4899', type: 'accent' },
};

/**
 * Get merged colors (EN + RU)
 * Call this once at initialization instead of mutating at import time
 */
export function getMergedColors(): Record<string, ColorDefinition> {
  return {
    ...COLOR_WORDS_TO_HEX,
    ...RU_COLOR_WORDS,
  };
}
