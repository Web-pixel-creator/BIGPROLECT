/**
 * Design Token System
 * 
 * Centralized design tokens for generating unique, non-template designs.
 * Inspired by Kombai's design-to-code approach and Webflow's design patterns.
 */

import { seededRandom } from './random';

// ============================================================================
// TYPES
// ============================================================================

export interface ColorPalette {
  primary: string[];
  secondary: string[];
  accent: string[];
  neutral: string[];
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  gradients: string[];
}

export interface TypographyScale {
  fontFamily: {
    heading: string;
    body: string;
    mono: string;
    display?: string;
  };
  sizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
    '7xl': string;
    '8xl': string;
    '9xl': string;
  };
  weights: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    black: number;
  };
  lineHeights: {
    tight: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };
}

export interface SpacingScale {
  base: number;
  scale: number[];
  tokens: Record<string, string>;
}

export interface AnimationTokens {
  duration: {
    instant: number;
    fast: number;
    normal: number;
    slow: number;
    dramatic: number;
  };
  easing: {
    linear: string;
    smooth: string;
    smoothOut: string;
    smoothIn: string;
    bounce: string;
    elastic: string;
    dramatic: string;
    spring: string;
  };
  stagger: {
    fast: number;
    normal: number;
    slow: number;
  };
}

export interface BorderRadius {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export interface Shadows {
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
  glow: string[];
}

export interface DesignTokens {
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  animation: AnimationTokens;
  borderRadius: BorderRadius;
  shadows: Shadows;
  breakpoints: Record<string, string>;
  zIndex: Record<string, number>;
}

// ============================================================================
// COLOR PALETTE GENERATOR
// ============================================================================

const BASE_PALETTES: ColorPalette[] = [
  // Modern Professional
  {
    primary: ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'],
    secondary: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'],
    accent: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'],
    neutral: ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1'],
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    gradients: [
      'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
      'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    ],
  },
  // Warm Earthy
  {
    primary: ['#451a03', '#78350f', '#92400e', '#b45309', '#d97706'],
    secondary: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
    accent: ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca'],
    neutral: ['#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24'],
    semantic: {
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#0891b2',
    },
    gradients: [
      'linear-gradient(135deg, #451a03 0%, #92400e 100%)',
      'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
    ],
  },
  // Cool Minimal
  {
    primary: ['#18181b', '#27272a', '#3f3f46', '#52525b', '#71717a'],
    secondary: ['#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc', '#cffafe'],
    accent: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'],
    neutral: ['#fafafa', '#f4f4f5', '#e4e4e7', '#d4d4d8', '#a1a1aa'],
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#06b6d4',
    },
    gradients: [
      'linear-gradient(135deg, #18181b 0%, #3f3f46 100%)',
      'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
      'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
    ],
  },
  // Vibrant Creative
  {
    primary: ['#4c1d95', '#5b21b6', '#7c3aed', '#8b5cf6', '#a78bfa'],
    secondary: ['#db2777', '#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8'],
    accent: ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa'],
    neutral: ['#ffffff', '#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe'],
    semantic: {
      success: '#22c55e',
      warning: '#f97316',
      error: '#ef4444',
      info: '#3b82f6',
    },
    gradients: [
      'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #db2777 100%)',
      'linear-gradient(135deg, #db2777 0%, #ec4899 100%)',
      'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
    ],
  },
  // Dark Luxury
  {
    primary: ['#000000', '#0a0a0a', '#171717', '#262626', '#404040'],
    secondary: ['#ca8a04', '#eab308', '#facc15', '#fde047', '#fef08a'],
    accent: ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca'],
    neutral: ['#fafafa', '#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3'],
    semantic: {
      success: '#22c55e',
      warning: '#eab308',
      error: '#dc2626',
      info: '#3b82f6',
    },
    gradients: [
      'linear-gradient(135deg, #000000 0%, #171717 100%)',
      'linear-gradient(135deg, #ca8a04 0%, #eab308 100%)',
      'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
    ],
  },
  // Soft Pastel
  {
    primary: ['#831843', '#9d174d', '#be185d', '#db2777', '#ec4899'],
    secondary: ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'],
    accent: ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'],
    neutral: ['#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185'],
    semantic: {
      success: '#14b8a6',
      warning: '#f59e0b',
      error: '#f43f5e',
      info: '#6366f1',
    },
    gradients: [
      'linear-gradient(135deg, #831843 0%, #db2777 100%)',
      'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
      'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
    ],
  },
  // Forest Nature
  {
    primary: ['#14532d', '#166534', '#15803d', '#16a34a', '#22c55e'],
    secondary: ['#a16207', '#ca8a04', '#eab308', '#facc15', '#fde047'],
    accent: ['#9a3412', '#c2410c', '#ea580c', '#f97316', '#fb923c'],
    neutral: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80'],
    semantic: {
      success: '#16a34a',
      warning: '#ca8a04',
      error: '#dc2626',
      info: '#0ea5e9',
    },
    gradients: [
      'linear-gradient(135deg, #14532d 0%, #16a34a 100%)',
      'linear-gradient(135deg, #a16207 0%, #eab308 100%)',
      'linear-gradient(135deg, #9a3412 0%, #ea580c 100%)',
    ],
  },
  // Ocean Deep
  {
    primary: ['#0c4a6e', '#075985', '#0369a1', '#0284c7', '#0ea5e9'],
    secondary: ['#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'],
    accent: ['#c026d3', '#d946ef', '#e879f9', '#f0abfc', '#f5d0fe'],
    neutral: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8'],
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#0ea5e9',
    },
    gradients: [
      'linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%)',
      'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      'linear-gradient(135deg, #c026d3 0%, #e879f9 100%)',
    ],
  },
];

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

const FONT_COMBINATIONS = [
  { heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono', display: 'Inter' },
  { heading: 'Playfair Display', body: 'Inter', mono: 'JetBrains Mono', display: 'Playfair Display' },
  { heading: 'Space Grotesk', body: 'Inter', mono: 'JetBrains Mono', display: 'Space Grotesk' },
  { heading: 'Outfit', body: 'Inter', mono: 'JetBrains Mono', display: 'Outfit' },
  { heading: 'Plus Jakarta Sans', body: 'Inter', mono: 'JetBrains Mono', display: 'Plus Jakarta Sans' },
  { heading: 'DM Sans', body: 'Inter', mono: 'JetBrains Mono', display: 'DM Sans' },
  { heading: 'Manrope', body: 'Inter', mono: 'JetBrains Mono', display: 'Manrope' },
  { heading: 'Syne', body: 'Inter', mono: 'JetBrains Mono', display: 'Syne' },
  { heading: 'Clashdisplay', body: 'Inter', mono: 'JetBrains Mono', display: 'Clashdisplay' },
  { heading: 'Cabinet Grotesk', body: 'Inter', mono: 'JetBrains Mono', display: 'Cabinet Grotesk' },
];

const createTypographyScale = (fontFamily: typeof FONT_COMBINATIONS[0]): TypographyScale => ({
  fontFamily,
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
  },
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
  lineHeights: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
});

// ============================================================================
// SPACING SYSTEM
// ============================================================================

const createSpacingScale = (base: number): SpacingScale => {
  const scale = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96];
  const tokens: Record<string, string> = {};
  
  scale.forEach((multiplier, index) => {
    const value = multiplier * base;
    const key = index === 0 ? '0.5' : multiplier.toString();
    tokens[key] = `${value}px`;
  });
  
  return { base, scale: scale.map(m => m * base), tokens };
};

// ============================================================================
// ANIMATION TOKENS
// ============================================================================

const ANIMATION_TOKENS: AnimationTokens = {
  duration: {
    instant: 0,
    fast: 150,
    normal: 300,
    slow: 500,
    dramatic: 800,
  },
  easing: {
    linear: 'linear',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    smoothOut: 'cubic-bezier(0, 0, 0.2, 1)',
    smoothIn: 'cubic-bezier(0.4, 0, 1, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
    dramatic: 'cubic-bezier(0.87, 0, 0.13, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.15,
  },
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

const BORDER_RADIUS_VARIANTS: BorderRadius[] = [
  // Sharp
  { none: '0', sm: '2px', base: '4px', md: '6px', lg: '8px', xl: '12px', '2xl': '16px', '3xl': '24px', full: '9999px' },
  // Rounded
  { none: '0', sm: '4px', base: '6px', md: '8px', lg: '12px', xl: '16px', '2xl': '24px', '3xl': '32px', full: '9999px' },
  // Soft
  { none: '0', sm: '6px', base: '8px', md: '12px', lg: '16px', xl: '20px', '2xl': '28px', '3xl': '40px', full: '9999px' },
  // Pill
  { none: '0', sm: '9999px', base: '9999px', md: '9999px', lg: '9999px', xl: '9999px', '2xl': '9999px', '3xl': '9999px', full: '9999px' },
];

// ============================================================================
// SHADOWS
// ============================================================================

const SHADOW_VARIANTS: Shadows[] = [
  // Minimal
  {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: '0 0 #0000',
    glow: [
      '0 0 20px rgba(59, 130, 246, 0.5)',
      '0 0 40px rgba(59, 130, 246, 0.3)',
    ],
  },
  // Colored
  {
    sm: '0 1px 2px 0 rgb(99 102 241 / 0.1)',
    base: '0 1px 3px 0 rgb(99 102 241 / 0.15), 0 1px 2px -1px rgb(99 102 241 / 0.1)',
    md: '0 4px 6px -1px rgb(99 102 241 / 0.15), 0 2px 4px -2px rgb(99 102 241 / 0.1)',
    lg: '0 10px 15px -3px rgb(99 102 241 / 0.15), 0 4px 6px -4px rgb(99 102 241 / 0.1)',
    xl: '0 20px 25px -5px rgb(99 102 241 / 0.15), 0 8px 10px -6px rgb(99 102 241 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(99 102 241 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(99 102 241 / 0.05)',
    none: '0 0 #0000',
    glow: [
      '0 0 20px rgba(99, 102, 241, 0.5)',
      '0 0 40px rgba(99, 102, 241, 0.3)',
    ],
  },
  // Deep
  {
    sm: '0 2px 4px 0 rgb(0 0 0 / 0.2)',
    base: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.2)',
    md: '0 8px 12px -2px rgb(0 0 0 / 0.3), 0 4px 8px -4px rgb(0 0 0 / 0.2)',
    lg: '0 16px 24px -4px rgb(0 0 0 / 0.3), 0 8px 12px -6px rgb(0 0 0 / 0.2)',
    xl: '0 32px 48px -8px rgb(0 0 0 / 0.3), 0 16px 24px -8px rgb(0 0 0 / 0.2)',
    '2xl': '0 40px 80px -16px rgb(0 0 0 / 0.4)',
    inner: 'inset 0 4px 8px 0 rgb(0 0 0 / 0.1)',
    none: '0 0 #0000',
    glow: [
      '0 0 30px rgba(255, 255, 255, 0.2)',
      '0 0 60px rgba(255, 255, 255, 0.1)',
    ],
  },
];

// ============================================================================
// BREAKPOINTS
// ============================================================================

const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================================================
// Z-INDEX
// ============================================================================

const Z_INDEX = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// ============================================================================
// GENERATOR FUNCTIONS
// ============================================================================

/**
 * Generate unique design tokens based on seed
 */
export function generateDesignTokens(seed: number): DesignTokens {
  const random = seededRandom(seed);
  
  // Select color palette
  const colorPalette = random.choice(BASE_PALETTES);
  
  // Modify palette for uniqueness
  const modifiedPalette: ColorPalette = {
    primary: random.shuffle([...colorPalette.primary]),
    secondary: random.shuffle([...colorPalette.secondary]),
    accent: random.shuffle([...colorPalette.accent]),
    neutral: [...colorPalette.neutral],
    semantic: { ...colorPalette.semantic },
    gradients: random.shuffle([...colorPalette.gradients]),
  };
  
  // Select font combination
  const fontCombo = random.choice(FONT_COMBINATIONS);
  const typography = createTypographyScale(fontCombo);
  
  // Generate spacing (4px or 8px base)
  const spacingBase = random.choice([4, 8]);
  const spacing = createSpacingScale(spacingBase);
  
  // Select border radius style
  const borderRadius = random.choice(BORDER_RADIUS_VARIANTS);
  
  // Select shadow style
  const shadows = random.choice(SHADOW_VARIANTS);
  
  return {
    colors: modifiedPalette,
    typography,
    spacing,
    animation: ANIMATION_TOKENS,
    borderRadius,
    shadows,
    breakpoints: BREAKPOINTS,
    zIndex: Z_INDEX,
  };
}

/**
 * Convert design tokens to CSS custom properties
 */
export function tokensToCSS(tokens: DesignTokens): string {
  const lines: string[] = [':root {'];
  
  // Colors
  tokens.colors.primary.forEach((color, i) => {
    lines.push(`  --color-primary-${(i + 1) * 100}: ${color};`);
  });
  tokens.colors.secondary.forEach((color, i) => {
    lines.push(`  --color-secondary-${(i + 1) * 100}: ${color};`);
  });
  
  // Typography
  lines.push(`  --font-heading: '${tokens.typography.fontFamily.heading}';`);
  lines.push(`  --font-body: '${tokens.typography.fontFamily.body}';`);
  lines.push(`  --font-mono: '${tokens.typography.fontFamily.mono}';`);
  
  // Spacing base
  lines.push(`  --spacing-base: ${tokens.spacing.base}px;`);
  
  // Animation
  Object.entries(tokens.animation.duration).forEach(([key, value]) => {
    lines.push(`  --duration-${key}: ${value}ms;`);
  });
  Object.entries(tokens.animation.easing).forEach(([key, value]) => {
    lines.push(`  --easing-${key}: ${value};`);
  });
  
  lines.push('}');
  
  return lines.join('\n');
}

/**
 * Convert design tokens to Tailwind config
 */
export function tokensToTailwindConfig(tokens: DesignTokens): object {
  return {
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: tokens.colors.primary[2],
            50: tokens.colors.primary[0],
            100: tokens.colors.primary[0],
            200: tokens.colors.primary[1],
            300: tokens.colors.primary[1],
            400: tokens.colors.primary[2],
            500: tokens.colors.primary[2],
            600: tokens.colors.primary[3],
            700: tokens.colors.primary[3],
            800: tokens.colors.primary[4],
            900: tokens.colors.primary[4],
          },
          secondary: {
            DEFAULT: tokens.colors.secondary[2],
            50: tokens.colors.secondary[0],
            100: tokens.colors.secondary[0],
            500: tokens.colors.secondary[2],
            600: tokens.colors.secondary[3],
            900: tokens.colors.secondary[4],
          },
          accent: {
            DEFAULT: tokens.colors.accent[2],
            500: tokens.colors.accent[2],
          },
        },
        fontFamily: {
          heading: [tokens.typography.fontFamily.heading, 'sans-serif'],
          body: [tokens.typography.fontFamily.body, 'sans-serif'],
          mono: [tokens.typography.fontFamily.mono, 'monospace'],
        },
        animation: {
          'fade-in': `fadeIn ${tokens.animation.duration.normal}ms ${tokens.animation.easing.smooth}`,
          'slide-up': `slideUp ${tokens.animation.duration.normal}ms ${tokens.animation.easing.smooth}`,
        },
      },
    },
  };
}
