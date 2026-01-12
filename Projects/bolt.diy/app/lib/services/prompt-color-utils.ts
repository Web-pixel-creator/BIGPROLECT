/**
 * Prompt Color Utilities
 * Functions for detecting and extracting colors from user prompts
 */

import { getMergedColors } from './prompt-data';

// Merged colors (EN + RU)
const COLOR_WORDS_TO_HEX = getMergedColors();

/**
 * Check if user already specified colors in prompt (hex format)
 */
export function hasUserSpecifiedColors(prompt: string): boolean {
  const hexPattern = /#[0-9A-Fa-f]{6}/g;
  const matches = prompt.match(hexPattern);
  return matches !== null && matches.length >= 1;
}

/**
 * Extract user-specified hex colors from prompt
 */
export function extractUserColors(prompt: string): Record<string, string> | null {
  const hexPattern = /#[0-9A-Fa-f]{6}/g;
  const matches = prompt.match(hexPattern);

  if (!matches || matches.length < 1) {
    return null;
  }

  const colors: Record<string, string> = {};
  const lowerPrompt = prompt.toLowerCase();

  matches.forEach((color) => {
    const colorIndex = lowerPrompt.indexOf(color.toLowerCase());
    const contextBefore = lowerPrompt.substring(Math.max(0, colorIndex - 50), colorIndex);

    if (contextBefore.includes('dark') || contextBefore.includes('charcoal') || contextBefore.includes('black')) {
      colors.dark = color;
    } else if (
      contextBefore.includes('light') ||
      contextBefore.includes('cream') ||
      contextBefore.includes('ivory') ||
      contextBefore.includes('white')
    ) {
      colors.light = color;
    } else if (contextBefore.includes('accent') || contextBefore.includes('gold') || contextBefore.includes('button')) {
      colors.accent = color;
    }
  });

  // If we couldn't identify by context, assign by order
  if (matches.length === 1) {
    if (!colors.dark && !colors.light && matches[0]) {
      colors.light = matches[0];
    }
  } else {
    if (!colors.dark && matches[0]) colors.dark = matches[0];
    if (!colors.light && matches[1]) colors.light = matches[1];
    if (!colors.accent && matches[2]) colors.accent = matches[2];
  }

  return Object.keys(colors).length ? colors : null;
}

/**
 * Match a word with Unicode-aware word boundaries
 */
export function matchesWord(haystack: string, needle: string): boolean {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}($|[^\\p{L}\\p{N}])`, 'iu');
  return pattern.test(haystack);
}

/**
 * Match a keyword (handles multi-word phrases)
 */
export function matchesKeyword(haystack: string, needle: string): boolean {
  const hasSpace = needle.includes(' ');
  return hasSpace ? haystack.includes(needle) : matchesWord(haystack, needle);
}

/**
 * Extract colors from color words in prompt (e.g., "cream", "black", "gold")
 */
export function extractColorsFromWords(prompt: string): Record<string, string> {
  const lowerPrompt = prompt.toLowerCase();
  const foundColors: Record<string, string> = {};

  // Sort color words by length (longer first) to match "light cream" before "cream"
  const sortedColorWords = Object.keys(COLOR_WORDS_TO_HEX).sort((a, b) => b.length - a.length);

  for (const colorWord of sortedColorWords) {
    if (matchesKeyword(lowerPrompt, colorWord)) {
      const colorInfo = COLOR_WORDS_TO_HEX[colorWord];
      if (colorInfo.type === 'dark' && !foundColors.dark) {
        foundColors.dark = colorInfo.hex;
      } else if (colorInfo.type === 'light' && !foundColors.light) {
        foundColors.light = colorInfo.hex;
      } else if (colorInfo.type === 'accent' && !foundColors.accent) {
        foundColors.accent = colorInfo.hex;
      }
    }
  }

  return foundColors;
}

/**
 * Check if prompt mentions color words
 */
export function hasColorWords(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();
  return Object.keys(COLOR_WORDS_TO_HEX).some((colorWord) => matchesKeyword(lowerPrompt, colorWord));
}

/**
 * Build color directive block for enhanced prompt
 */
export function buildColorDirectiveBlock(colors: { dark: string; light: string; accent: string }): string {
  if (!colors || (!colors.dark && !colors.light && !colors.accent)) {
    return '';
  }

  const lines: string[] = ['COLOR PALETTE (Use these exact HEX values):'];
  if (colors.dark) lines.push(`  Dark/Background: ${colors.dark}`);
  if (colors.light) lines.push(`  Light/Surface: ${colors.light}`);
  if (colors.accent) lines.push(`  Accent/CTA: ${colors.accent}`);

  return lines.join('\n');
}
