/**
 * Prompt Enhancer Service
 * Analyzes user prompt and automatically adds design system (colors, images, structure)
 * before sending to LLM
 */

// Theme detection keywords (EN + RU)
const THEME_KEYWORDS = {
  furniture: [
    'furniture',
    'sofa',
    'chair',
    'table',
    'storage',
    'seating',
    'decor',
    'cabinet',
    'furnishing',
    'home decor',
    '??????',
    '?????',
    '??????',
    '????',
    '????',
    '????',
    '?????',
    '?????',
    '????????',
    '????????',
    '???????',
    '???????',
  ],
  fashion: [
    'fashion',
    'clothing',
    'apparel',
    'shoes',
    'accessories',
    'lookbook',
    '????',
    '??????',
    '?????',
    '??????????',
    '??????',
    '?????',
  ],
  beauty: [
    'beauty',
    'cosmetics',
    'makeup',
    'skincare',
    'fragrance',
    '?????????',
    '??????',
    '????',
    '??????',
  ],
  electronics: [
    'electronics',
    'gadget',
    'phone',
    'laptop',
    'smart home',
    'camera',
    '???????????',
    '??????',
    '????????',
    '???????',
    '???????',
    '????? ???',
    '??????',
  ],
  food: [
    'food',
    'grocery',
    'beverage',
    'coffee',
    'tea',
    'snack',
    'bakery',
    '???',
    '????????',
    '???????',
    '????',
    '???',
    '???????? ???',
    '???????',
  ],
  ecommerce: [
    'e-commerce',
    'ecommerce',
    'shop',
    'store',
    'product',
    'cart',
    'checkout',
    '???????',
    '???????? ???????',
    '?????',
    '??????',
    '???????',
    '??????????',
    '???????',
    '???????',
    '?????',
  ],
  photography: [
    'photography',
    'photographer',
    'photo shoot',
    'portfolio',
    'gallery',
    'freelance',
    'creative',
    'visual',
    'squarespace',
    '??????????',
    '????????',
    '??????????',
    '??????????',
    '?????????',
    '???????',
    '??????',
    '??????',
    '??????????',
  ],
  industrial: [
    'industrial',
    'energy',
    'oil',
    'gas',
    'power',
    'refinery',
    'pipeline',
    'manufacturing',
    'factory',
    '????????????',
    '??????????????',
    '??????????',
    '?????',
    '???',
    '?????',
    '????????????',
    '???????????',
    '??????????????',
    '???????',
  ],
  hotel: [
    'hotel',
    'hospitality',
    'resort',
    'boutique',
    'spa',
    'accommodation',
    'booking',
    '?????',
    '?????????',
    '??????',
    '???',
    '?????',
    '????????????',
    '??????????',
  ],
  tech: [
    'tech',
    'saas',
    'startup',
    'software',
    'app',
    'platform',
    'dashboard',
    'analytics',
    '???',
    '??????????',
    '????',
    '???????',
    '??????????',
    '?????????',
    '???????',
    '?????????',
  ],
  medical: [
    'medical',
    'healthcare',
    'hospital',
    'clinic',
    'health',
    'doctor',
    'patient',
    '????????',
    '???????????',
    '???????',
    '????????',
    '???????????????',
    '???????',
    '????',
  ],
  restaurant: [
    'restaurant',
    'food',
    'cafe',
    'dining',
    'menu',
    'culinary',
    'chef',
    '????????',
    '????',
    '????',
    '?????',
    '???',
    '???',
  ],
  realestate: [
    'real estate',
    'property',
    'apartment',
    'house',
    'home',
    'realty',
    'housing',
    '????????????',
    '???????',
    '???????',
    '????????',
    '???',
    '??????',
    '???????',
  ],
  finance: [
    'finance',
    'bank',
    'investment',
    'trading',
    'crypto',
    'fintech',
    'money',
    '???????',
    '????',
    '??????????',
    '??????',
    '??????',
    '?????',
  ],
  education: [
    'education',
    'school',
    'university',
    'learning',
    'course',
    'academy',
    'training',
    '???????????',
    '?????',
    '???????????',
    '????????',
    '????',
    '????????',
    '?????? ????',
    '??????-????',
  ],
};

// Color word to HEX mapping - comprehensive dictionary
const COLOR_WORDS_TO_HEX: Record<string, { hex: string; type: 'dark' | 'light' | 'accent' }> = {
  // Dark colors
  black: { hex: '#000000', type: 'dark' },
  'deep black': { hex: '#0a0a0a', type: 'dark' },
  charcoal: { hex: '#111113', type: 'dark' },
  'deep charcoal': { hex: '#111113', type: 'dark' },
  'dark gray': { hex: '#1a1a1a', type: 'dark' },
  'dark grey': { hex: '#1a1a1a', type: 'dark' },
  navy: { hex: '#0f172a', type: 'dark' },
  'dark blue': { hex: '#1e3a5f', type: 'dark' },
  midnight: { hex: '#0a0a0a', type: 'dark' },
  onyx: { hex: '#0f0f0f', type: 'dark' },
  ebony: { hex: '#111111', type: 'dark' },
  slate: { hex: '#1e293b', type: 'dark' },
  '??????': { hex: '#000000', type: 'dark' },
  '??????': { hex: '#000000', type: 'dark' },
  '???????? ??????': { hex: '#0a0a0a', type: 'dark' },
  '???????? ??????': { hex: '#0a0a0a', type: 'dark' },
  '??????': { hex: '#1a1a1a', type: 'dark' },
  '??????': { hex: '#1a1a1a', type: 'dark' },
  '?????-?????': { hex: '#1a1a1a', type: 'dark' },
  '?????-?????': { hex: '#1a1a1a', type: 'dark' },
  '????????': { hex: '#111113', type: 'dark' },
  '??????????': { hex: '#111113', type: 'dark' },
  'тёмный': { hex: '#0a0a0a', type: 'dark' },
  'темный': { hex: '#0a0a0a', type: 'dark' },
  'чёрный': { hex: '#000000', type: 'dark' },
  'черный': { hex: '#000000', type: 'dark' },
  'темно-серый': { hex: '#1a1a1a', type: 'dark' },
  'тёмно-серый': { hex: '#1a1a1a', type: 'dark' },
  'угольный': { hex: '#111113', type: 'dark' },
  'графит': { hex: '#111113', type: 'dark' },

  // Light colors
  white: { hex: '#ffffff', type: 'light' },
  cream: { hex: '#FDF5E6', type: 'light' },
  'light cream': { hex: '#FDF5E6', type: 'light' },
  ivory: { hex: '#FAF9F6', type: 'light' },
  'ivory cream': { hex: '#F4F3EF', type: 'light' },
  beige: { hex: '#F5F5DC', type: 'light' },
  'off-white': { hex: '#FAF9F6', type: 'light' },
  'off white': { hex: '#FAF9F6', type: 'light' },
  pearl: { hex: '#FAFAFA', type: 'light' },
  snow: { hex: '#FFFAFA', type: 'light' },
  'light gray': { hex: '#f8fafc', type: 'light' },
  'light grey': { hex: '#f8fafc', type: 'light' },
  'warm white': { hex: '#FDF8F5', type: 'light' },
  linen: { hex: '#FAF0E6', type: 'light' },
  seashell: { hex: '#FFF5EE', type: 'light' },
  alabaster: { hex: '#F2F0EB', type: 'light' },
  '?????': { hex: '#ffffff', type: 'light' },
  '????????': { hex: '#FDF5E6', type: 'light' },
  '??????': { hex: '#F4F3EF', type: 'light' },
  '???????? ?????': { hex: '#F4F3EF', type: 'light' },
  '????????': { hex: '#FDF8F5', type: 'light' },
  '???????': { hex: '#F5F5DC', type: 'light' },
  '?????? ?????': { hex: '#FDF8F5', type: 'light' },
  '?????? ?????': { hex: '#FDF8F5', type: 'light' },
  '???????': { hex: '#ffffff', type: 'light' },
  '??????-?????': { hex: '#f8fafc', type: 'light' },
  '?????? ?????': { hex: '#f8fafc', type: 'light' },
  'белый': { hex: '#ffffff', type: 'light' },
  'кремовый': { hex: '#FDF5E6', type: 'light' },
  'молочный': { hex: '#FDF8F5', type: 'light' },
  'слоновая кость': { hex: '#F4F3EF', type: 'light' },
  'айвори': { hex: '#F4F3EF', type: 'light' },
  'бежевый': { hex: '#F5F5DC', type: 'light' },
  'светлый': { hex: '#ffffff', type: 'light' },

  // Accent colors - Gold/Yellow family
  gold: { hex: '#C9A66B', type: 'accent' },
  'elegant gold': { hex: '#C9A66B', type: 'accent' },
  'golden': { hex: '#D4AF37', type: 'accent' },
  amber: { hex: '#F59E0B', type: 'accent' },
  bronze: { hex: '#CD7F32', type: 'accent' },
  brass: { hex: '#B5A642', type: 'accent' },
  champagne: { hex: '#F7E7CE', type: 'accent' },
  mustard: { hex: '#FFDB58', type: 'accent' },
  honey: { hex: '#EB9605', type: 'accent' },
  copper: { hex: '#B87333', type: 'accent' },
  '??????': { hex: '#C9A66B', type: 'accent' },
  '???????': { hex: '#C9A66B', type: 'accent' },
  '????????': { hex: '#F59E0B', type: 'accent' },
  '?????????': { hex: '#CD7F32', type: 'accent' },
  '??????': { hex: '#B87333', type: 'accent' },
  'золото': { hex: '#C9A66B', type: 'accent' },
  'золотой': { hex: '#C9A66B', type: 'accent' },
  'янтарный': { hex: '#F59E0B', type: 'accent' },
  'бронзовый': { hex: '#CD7F32', type: 'accent' },
  'медный': { hex: '#B87333', type: 'accent' },

  // Accent colors - Blue family
  blue: { hex: '#3b82f6', type: 'accent' },
  'royal blue': { hex: '#4169E1', type: 'accent' },
  cyan: { hex: '#0ea5e9', type: 'accent' },
  teal: { hex: '#14b8a6', type: 'accent' },
  turquoise: { hex: '#40E0D0', type: 'accent' },
  'sky blue': { hex: '#0ea5e9', type: 'accent' },
  azure: { hex: '#007FFF', type: 'accent' },
  cobalt: { hex: '#0047AB', type: 'accent' },
  '?????': { hex: '#3b82f6', type: 'accent' },
  '???????': { hex: '#0ea5e9', type: 'accent' },
  '?????????': { hex: '#14b8a6', type: 'accent' },

  // Accent colors - Green family
  green: { hex: '#22c55e', type: 'accent' },
  emerald: { hex: '#059669', type: 'accent' },
  mint: { hex: '#98FF98', type: 'accent' },
  sage: { hex: '#9DC183', type: 'accent' },
  olive: { hex: '#808000', type: 'accent' },
  forest: { hex: '#228B22', type: 'accent' },
  '???????': { hex: '#22c55e', type: 'accent' },
  '???????': { hex: '#22c55e', type: 'accent' },
  '??????????': { hex: '#059669', type: 'accent' },
  '?????????': { hex: '#808000', type: 'accent' },

  // Accent colors - Red/Orange family
  red: { hex: '#dc2626', type: 'accent' },
  crimson: { hex: '#DC143C', type: 'accent' },
  burgundy: { hex: '#800020', type: 'accent' },
  maroon: { hex: '#800000', type: 'accent' },
  coral: { hex: '#FF7F50', type: 'accent' },
  orange: { hex: '#f97316', type: 'accent' },
  tangerine: { hex: '#FF9966', type: 'accent' },
  rust: { hex: '#B7410E', type: 'accent' },
  '???????': { hex: '#dc2626', type: 'accent' },
  '?????????': { hex: '#f97316', type: 'accent' },
  '????????': { hex: '#800020', type: 'accent' },
  '??????????': { hex: '#FF7F50', type: 'accent' },

  // Accent colors - Purple/Pink family
  purple: { hex: '#8b5cf6', type: 'accent' },
  violet: { hex: '#8b5cf6', type: 'accent' },
  indigo: { hex: '#6366f1', type: 'accent' },
  lavender: { hex: '#E6E6FA', type: 'accent' },
  magenta: { hex: '#FF00FF', type: 'accent' },
  pink: { hex: '#ec4899', type: 'accent' },
  rose: { hex: '#f43f5e', type: 'accent' },
  fuchsia: { hex: '#d946ef', type: 'accent' },
  plum: { hex: '#DDA0DD', type: 'accent' },
  '??????????': { hex: '#8b5cf6', type: 'accent' },
  '?????????': { hex: '#d946ef', type: 'accent' },
  '???????': { hex: '#ec4899', type: 'accent' },
  '??????????': { hex: '#E6E6FA', type: 'accent' },
};

// Color palettes for each theme
const THEME_PALETTES = {
  photography: {
    dark: '#0a0a0a',
    light: '#ffffff',
    accent: '#C9A66B',
    accentName: 'gold',
    textOnDark: '#ffffff',
    textOnLight: '#111113',
  },
  industrial: {
    dark: '#0a0a0a',
    light: '#F4F3EF',
    accent: '#C9A66B',
    accentName: 'gold',
    textOnDark: '#ffffff',
    textOnLight: '#111113',
  },
  hotel: {
    dark: '#111113',
    light: '#FAF9F6',
    accent: '#C9A66B',
    accentName: 'gold',
    textOnDark: '#ffffff',
    textOnLight: '#1a1a1a',
  },
  tech: {
    dark: '#0f172a',
    light: '#f8fafc',
    accent: '#3b82f6',
    accentName: 'blue',
    textOnDark: '#ffffff',
    textOnLight: '#1e293b',
  },
  medical: {
    dark: '#1e3a5f',
    light: '#f0f9ff',
    accent: '#0ea5e9',
    accentName: 'cyan',
    textOnDark: '#ffffff',
    textOnLight: '#0c4a6e',
  },
  restaurant: {
    dark: '#1a1a1a',
    light: '#faf7f2',
    accent: '#dc2626',
    accentName: 'red',
    textOnDark: '#ffffff',
    textOnLight: '#292524',
  },
  realestate: {
    dark: '#1e293b',
    light: '#f8fafc',
    accent: '#059669',
    accentName: 'emerald',
    textOnDark: '#ffffff',
    textOnLight: '#1e293b',
  },
  finance: {
    dark: '#0f172a',
    light: '#f8fafc',
    accent: '#6366f1',
    accentName: 'indigo',
    textOnDark: '#ffffff',
    textOnLight: '#1e293b',
  },
  education: {
    dark: '#1e1b4b',
    light: '#faf5ff',
    accent: '#8b5cf6',
    accentName: 'purple',
    textOnDark: '#ffffff',
    textOnLight: '#3b0764',
  },
  furniture: {
    dark: '#1a1a1a',
    light: '#ffffff',
    accent: '#000000',
    accentName: 'black',
    textOnDark: '#ffffff',
    textOnLight: '#1a1a1a',
  },
  fashion: {
    dark: '#0f0f10',
    light: '#ffffff',
    accent: '#111827',
    accentName: 'charcoal',
    textOnDark: '#ffffff',
    textOnLight: '#111827',
  },
  beauty: {
    dark: '#111113',
    light: '#fdf7f2',
    accent: '#c084fc',
    accentName: 'lavender',
    textOnDark: '#ffffff',
    textOnLight: '#1f1f1f',
  },
  electronics: {
    dark: '#0b1220',
    light: '#f8fafc',
    accent: '#111827',
    accentName: 'slate',
    textOnDark: '#ffffff',
    textOnLight: '#111827',
  },
  food: {
    dark: '#1c1a17',
    light: '#fffdf7',
    accent: '#d97706',
    accentName: 'amber',
    textOnDark: '#fef3c7',
    textOnLight: '#1f1f1f',
  },
  ecommerce: {
    dark: '#1a1a1a',
    light: '#ffffff',
    accent: '#000000',
    accentName: 'black',
    textOnDark: '#ffffff',
    textOnLight: '#1a1a1a',
  },
  default: {
    dark: '#111113',
    light: '#ffffff',
    accent: '#C9A66B',
    accentName: 'gold',
    textOnDark: '#ffffff',
    textOnLight: '#111113',
  },
};

// Verified working image URLs for each theme
const THEME_IMAGES = {
  photography: {
    hero: [
    ],
    gallery: [
    ],
  },
  industrial: {
    hero: [
    ],
    gallery: [
    ],
  },
  hotel: {
    hero: [
    ],
    gallery: [
    ],
  },
  tech: {
    hero: [
    ],
    gallery: [
    ],
  },
  medical: {
    hero: [
    ],
    gallery: [
    ],
  },
  restaurant: {
    hero: [
    ],
    gallery: [
    ],
  },
  realestate: {
    hero: [
    ],
    gallery: [
    ],
  },
  finance: {
    hero: [
    ],
    gallery: [
    ],
  },
  education: {
    hero: [
    ],
    gallery: [
    ],
  },
  furniture: {
    hero: [
    ],
    gallery: [
    ],
    categories: {
      seating: [
      ],
      tables: [
      ],
      storage: [
      ],
    },
    products: [
    ],
  },
  fashion: {
    hero: [
    ],
    gallery: [
    ],
    products: [
    ],
  },
  beauty: {
    hero: [
    ],
    gallery: [
    ],
    products: [
    ],
  },
  electronics: {
    hero: [
    ],
    gallery: [
    ],
    products: [
    ],
  },
  food: {
    hero: [
    ],
    gallery: [
    ],
    products: [
    ],
  },
  ecommerce: {
    hero: [
    ],
    gallery: [
    ],
    // Furniture category images (seating, tables, storage)
    categories: {
      seating: [
      ],
      tables: [
      ],
      storage: [
      ],
    },
    products: [
    ],
  },
  default: {
    hero: [
    ],
    gallery: [
    ],
  },
};

/**
 * Detect theme from user prompt
 */
function detectTheme(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    for (const keyword of keywords) {
      if (matchesKeyword(lowerPrompt, keyword)) {
        return theme;
      }
    }
  }

  return 'default';
}

function extractBrandName(prompt: string): string | null {
  const patterns = [
    /(?:called|named|brand(?: website)?|website called)\s+["“”'«»]?([\p{L}\p{N}&\-\s]{2,60})["“”'»]?/iu,
    /(?:названи[её]|бренд|под названием|называется)\s+["“”'«»]?([\p{L}\p{N}&\-\s]{2,60})["“”'»]?/iu,
  ];

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
 * Check if user already specified colors in prompt
 */
function hasUserSpecifiedColors(prompt: string): boolean {
  // Check for hex colors like #111113, #F4F3EF
  const hexPattern = /#[0-9A-Fa-f]{6}/g;
  const matches = prompt.match(hexPattern);

  return matches !== null && matches.length >= 1;
}

/**
 * Extract user-specified colors from prompt
 */
function extractUserColors(prompt: string): Record<string, string> | null {
  const hexPattern = /#[0-9A-Fa-f]{6}/g;
  const matches = prompt.match(hexPattern);

  if (!matches || matches.length < 1) {
    return null;
  }

  // Try to identify colors by context
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
    } else if (
      contextBefore.includes('accent') ||
      contextBefore.includes('gold') ||
      contextBefore.includes('button')
    ) {
      colors.accent = color;
    }
  });

  // If we couldn't identify by context, assign by order (or assume single HEX is the light background).
  if (matches.length === 1) {
    if (!colors.dark && !colors.light && matches[0]) {
      colors.light = matches[0];
    }
  } else {
    if (!colors.dark && matches[0]) {
      colors.dark = matches[0];
    }

    if (!colors.light && matches[1]) {
      colors.light = matches[1];
    }

    if (!colors.accent && matches[2]) {
      colors.accent = matches[2];
    }
  }

  return Object.keys(colors).length ? colors : null;
}

function matchesWord(haystack: string, needle: string): boolean {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}($|[^\\p{L}\\p{N}])`, 'iu');
  return pattern.test(haystack);
}

function matchesKeyword(haystack: string, needle: string): boolean {
  return needle.includes(' ') ? haystack.includes(needle) : matchesWord(haystack, needle);
}

/**
 * Extract colors from color words in prompt (e.g., "cream", "black", "gold")
 */
function extractColorsFromWords(prompt: string): Record<string, string> {
  const lowerPrompt = prompt.toLowerCase();
  const foundColors: Record<string, string> = {};

  // Sort color words by length (longer first) to match "light cream" before "cream"
  const sortedColorWords = Object.keys(COLOR_WORDS_TO_HEX).sort((a, b) => b.length - a.length);

  for (const colorWord of sortedColorWords) {
    if (matchesKeyword(lowerPrompt, colorWord)) {
      const colorInfo = COLOR_WORDS_TO_HEX[colorWord];

      // Only set if not already found (longer matches take priority)
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
function hasColorWords(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();

  return Object.keys(COLOR_WORDS_TO_HEX).some((colorWord) => matchesKeyword(lowerPrompt, colorWord));
}

export interface EnhancedPrompt {
  originalPrompt: string;
  enhancedPrompt: string;
  detectedTheme: string;
  colors: typeof THEME_PALETTES.default;
  images: typeof THEME_IMAGES.default;
}

/**
 * Main function to enhance user prompt with design system
 */
export function enhancePromptWithDesignSystem(userPrompt: string): EnhancedPrompt {
  const detectedTheme = detectTheme(userPrompt);
  const palette = THEME_PALETTES[detectedTheme as keyof typeof THEME_PALETTES] || THEME_PALETTES.default;
  const images = THEME_IMAGES[detectedTheme as keyof typeof THEME_IMAGES] || THEME_IMAGES.default;
  const brandName = extractBrandName(userPrompt);

  // Check if user already specified colors (priority: HEX codes > color words > theme defaults)
  let finalColors = { ...palette };

  // First, try to extract HEX codes from prompt
  if (hasUserSpecifiedColors(userPrompt)) {
    const userColors = extractUserColors(userPrompt);

    if (userColors) {
      finalColors = {
        ...finalColors,
        ...userColors,
      };
    }
  }

  // Then, extract colors from color words (e.g., "cream", "black", "gold")
  if (hasColorWords(userPrompt)) {
    const wordColors = extractColorsFromWords(userPrompt);

    // Only override dark/light if not already set by HEX codes
    if (wordColors.dark && !hasUserSpecifiedColors(userPrompt)) {
      finalColors.dark = wordColors.dark;
    }

    if (wordColors.light && !hasUserSpecifiedColors(userPrompt)) {
      finalColors.light = wordColors.light;
    }

    // For accent, only override if user explicitly mentioned an accent color word
    // (gold, amber, blue, etc.) - don't override theme accent with random color matches
    const accentKeywords = [
      'gold',
      'amber',
      'bronze',
      'copper',
      'blue',
      'cyan',
      'teal',
      'green',
      'emerald',
      'red',
      'orange',
      'purple',
      'violet',
      'pink',
      '??????',
      '???????',
      '????????',
      '?????????',
      '??????',
      '?????',
      '???????',
      '?????????',
      '???????',
      '???????',
      '??????????',
      '???????',
      '?????????',
      '??????????',
      '?????????',
      '???????',
    ];
    const lowerPrompt = userPrompt.toLowerCase();
    const hasExplicitAccent = accentKeywords.some((keyword) => matchesKeyword(lowerPrompt, keyword));
    
    if (wordColors.accent && hasExplicitAccent && !hasUserSpecifiedColors(userPrompt)) {
      finalColors.accent = wordColors.accent;
    }
  }

  // Check if user specified specific layouts
  const lowerPrompt = userPrompt.toLowerCase();
  const layoutKeywords = [
    'слева',
    'справа',
    'лево',
    'право',
    'две колонки',
    '2 колонки',
    '2-колонки',
    'двухколоноч',
    'двухколон',
    'split',
    'left',
    'right',
    'two column',
    'two-column',
    'image on',
    'text on',
    'grid',
    'сетка',
    'carousel',
    'карусел',
    'slider',
    'слайдер',
    'full-width',
    'full width',
  ];
  const hasSpecificLayout = layoutKeywords.some((keyword) => matchesKeyword(lowerPrompt, keyword));


  // Helper to pick random item
  const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  // Detect which sections user mentioned in prompt
  const sectionKeywords: Record<string, string[]> = {
    navigation: [
      'navigation',
      'navbar',
      'menu',
      'top nav',
      'top navigation',
      'header menu',
      '?????????',
      '????',
      '??????? ????',
      '????????????? ??????',
      '?????',
      '????? ????',
    ],
    hero: [
      'hero',
      'header',
      'banner',
      'intro',
      'landing',
      '????',
      '?????',
      '?????',
      '??????',
      '?????? ?????',
    ],
    features: [
      'feature',
      'services',
      'offerings',
      'benefits',
      '????',
      '????????????',
      '???????????',
      '??????',
      '??????',
      '???????',
    ],
    gallery: [
      'gallery',
      'portfolio',
      'photos',
      'images',
      'work',
      'projects',
      '???????',
      '?????????',
      '????',
      '????????',
      '??????',
      '???????',
    ],
    testimonials: [
      'testimonial',
      'review',
      'client',
      'feedback',
      'quote',
      '??????',
      '????????????',
      '???????',
      '?????',
      '???????',
    ],
    pricing: [
      'pricing',
      'cost',
      'subscription',
      'billing',
      'plans',
      '????',
      '??????',
      '?????',
      '?????????',
      '????????',
    ],
    cta: [
      'cta',
      'call to action',
      'inquiry',
      'contact',
      'book',
      'get started',
      'sign up',
      '??????',
      '??????',
      '?????????',
      '?????????????',
      '????????????',
    ],
    faq: [
      'faq',
      'question',
      'answer',
      'help',
      '?????? ???????',
      '???????',
      '??????-?????',
    ],
    footer: [
      'footer',
      'bottom',
      'copyright',
      '?????',
      '??????',
      '??? ????????',
    ],
    about: [
      'about',
      'story',
      'mission',
      '? ???',
      '? ????????',
      '???????',
      '??????',
    ],
    team: [
      'team',
      'staff',
      'people',
      '???????',
      '??????????',
      '????????',
    ],
    contact: [
      'contact',
      'form',
      'reach',
      'address',
      '????????',
      '?????',
      '?????',
    ],
    blog: [
      'blog',
      'news',
      'article',
      'post',
      '????',
      '???????',
      '??????',
      '?????',
    ],
    logo: [
      'logo',
      'client',
      'partner',
      'brand',
      '????????',
      '???????',
      '????????',
      '??????',
    ],
    products: [
      'product',
      'bestseller',
      'item',
      'catalog',
      'shop',
      '??????',
      '???????????',
      '???????',
      '???????',
      '???????????',
    ],
    categories: [
      'category',
      'collection',
      'seating',
      'tables',
      'storage',
      '?????????',
      '?????????',
      '???????',
    ],
  };

  // Find which sections are mentioned
  const mentionedSections: string[] = [];
  for (const [section, keywords] of Object.entries(sectionKeywords)) {
    if (keywords.some((kw) => matchesKeyword(lowerPrompt, kw))) {
      mentionedSections.push(section);
    }
  }

  // Section layout variants
  const sectionLayouts: Record<string, string[]> = {
    navigation: [
      'Top nav: logo left, links center, icons (search/cart/profile) right; sticky with blur',
      'Top nav: logo left, links right, cart/profile icons; clean minimal',
      'Top nav: logo + burger menu on mobile; dropdown/mega menu on desktop',
    ],
    hero: [
      'Full-width hero with centered text overlay and dark gradient',
      'Split hero: large image on left (60%), text content on right (40%)',
      'Split hero: text content on left (40%), large image on right (60%)',
      'Full-screen background with minimal centered headline',
      'Hero with floating card overlay on the right side',
    ],
    features: [
      '3-column grid with icons above text',
      '2-column alternating: image left/text right, then text left/image right',
      '4-column grid with hover effects',
      'Bento grid layout with mixed sizes',
    ],
    gallery: [
      'Masonry grid layout',
      '3-column uniform grid with hover zoom',
      'Horizontal scroll carousel',
      '2-row staggered grid',
    ],
    testimonials: [
      'Carousel with large quote and avatar',
      '3-column cards with ratings',
      'Single featured testimonial with background image',
    ],
    pricing: [
      '3-column cards with highlighted middle option',
      '2-column comparison table',
      'Toggle between monthly/yearly with animated cards',
    ],
    cta: [
      'Full-width banner with gradient background',
      'Split: image left, form right',
      'Centered card with glow effect',
      'Minimal text with single button',
    ],
    faq: [
      'Accordion with smooth animations',
      '2-column grid of questions',
      'Single column with expandable cards',
    ],
    footer: [
      '4-column layout with newsletter',
      'Minimal centered with social icons',
      '3-column with large logo',
    ],
    about: [
      'Split: large image left, story text right',
      'Full-width with timeline',
      'Centered text with background image',
    ],
    team: [
      '4-column grid with hover effects',
      '3-column cards with social links',
      'Horizontal scroll carousel',
    ],
    contact: [
      'Split: form left, map/info right',
      'Centered form with floating card',
      '2-column: info left, form right',
    ],
    blog: [
      '3-column card grid',
      'Featured post + 2-column grid',
      'List view with thumbnails',
    ],
    logo: [
      'Horizontal scroll with grayscale hover',
      'Grid with fade animation',
      'Marquee auto-scroll',
    ],
    products: [
      '4-column grid with hover Quick View button',
      '3-column grid with add to cart button',
      '2-row featured products carousel',
      'Masonry grid with varying card sizes',
    ],
    categories: [
      '3-column cards with subtle product photo and category name',
      'Large image cards with overlay text',
      'Horizontal scroll with category thumbnails',
      '2x2 grid with hover effects',
    ],
  };

  const sectionLabels: Record<string, string> = {
    navigation: 'Navigation',
    hero: 'Hero',
    features: 'Features',
    gallery: 'Gallery',
    testimonials: 'Testimonials',
    pricing: 'Pricing',
    cta: 'CTA',
    faq: 'FAQ',
    footer: 'Footer',
    about: 'About',
    team: 'Team',
    contact: 'Contact',
    blog: 'Blog',
    logo: 'Logo',
    products: 'Products',
    categories: 'Categories',
  };

  // Generate layouts only for mentioned sections
  let layoutSuggestions = '';
  if (!hasSpecificLayout && mentionedSections.length > 0) {
    const layouts = mentionedSections
      .filter((section) => sectionLayouts[section])
      .map(
        (section) => `- ${section.charAt(0).toUpperCase() + section.slice(1)}: ${pickRandom(sectionLayouts[section])}`,
      )
      .join('\n');

    if (layouts) {
      layoutSuggestions = `\nSECTION LAYOUTS (use these styles):\n${layouts}`;
    }
  }

  const sectionChecklist =
    mentionedSections.length > 0
      ? `\nSECTIONS (must include all): ${mentionedSections
          .map((section) => sectionLabels[section] ?? section)
          .join(', ')}`
      : '';

  // Don't inline big image URL lists into the prompt. It's noisy for users and WebContainer may block
  // external images anyway (and our sanitizer will enforce safe placeholders/proxies).
  const imageSuggestions = '';
  const brandLine = brandName ? `\nBRAND NAME (use exactly): ${brandName}` : '';
  const templateGuard = '\nIMPORTANT: Do not use any generic/default template. Follow the prompt exactly.';

  const enhancedPrompt = `${userPrompt}
${brandLine}${sectionChecklist}${layoutSuggestions ? `\n${layoutSuggestions}` : ''}${templateGuard}
[Style: ${detectedTheme} | Colors: ${finalColors.dark}, ${finalColors.light}, ${finalColors.accent}]${imageSuggestions ? `\n${imageSuggestions}` : ''}`;

  return {
    originalPrompt: userPrompt,
    enhancedPrompt,
    detectedTheme,
    colors: finalColors,
    images,
  };
}

/**
 * Check if prompt is a design/website request that needs enhancement
 */
export function shouldEnhancePrompt(prompt: string): boolean {
  const designKeywords = [
    'website',
    'landing',
    'page',
    'layout',
    'design',
    'ui',
    'interface',
    'hero',
    'section',
    'create',
    'build',
    'make',
    'generate',
    '????',
    '???????',
    '????????',
    '?????',
    '??????',
    '?????????',
    '?????',
    '?????',
    '??????',
    '??????',
    '??????',
    '??????????',
    '???????',
  ];

  const lowerPrompt = prompt.toLowerCase();

  return designKeywords.some((keyword) => matchesKeyword(lowerPrompt, keyword));
}
