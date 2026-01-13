/**
 * Theme Palettes Data Module
 * Contains color palettes for each theme
 */

export type ThemePalette = {
  dark: string;
  light: string;
  accent: string;
  accentName: string;
  textOnDark: string;
  textOnLight: string;
};

export const THEME_PALETTES: Record<string, ThemePalette> = {
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
  vinyl: {
    dark: '#0b0b0b',
    light: '#f7f2ea',
    accent: '#C9A66B',
    accentName: 'gold',
    textOnDark: '#ffffff',
    textOnLight: '#111113',
  },
  automotive: {
    dark: '#0f0f0f',
    light: '#f5f5f5',
    accent: '#dc2626',
    accentName: 'red',
    textOnDark: '#ffffff',
    textOnLight: '#171717',
  },
  travel: {
    dark: '#0c4a6e',
    light: '#f0f9ff',
    accent: '#0ea5e9',
    accentName: 'sky',
    textOnDark: '#ffffff',
    textOnLight: '#0c4a6e',
  },
  gaming: {
    dark: '#0a0a0a',
    light: '#fafafa',
    accent: '#a855f7',
    accentName: 'purple',
    textOnDark: '#ffffff',
    textOnLight: '#18181b',
  },
  sports: {
    dark: '#18181b',
    light: '#fafafa',
    accent: '#22c55e',
    accentName: 'green',
    textOnDark: '#ffffff',
    textOnLight: '#18181b',
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
