import type { StyleTokens } from './render-plan';

export type StyleTokenVariables = Record<string, string>;

export function normalizeStyleTokens(tokens: StyleTokens): StyleTokens {
  const colors = Array.isArray(tokens.colors) ? tokens.colors.filter(Boolean) : [];

  return {
    typography: tokens.typography ?? '',
    spacing: tokens.spacing ?? '',
    radius: tokens.radius ?? '',
    colors,
  };
}

export function applyStyleTokens(componentId: string, tokens: StyleTokens): StyleTokenVariables {
  const normalized = normalizeStyleTokens(tokens);
  const colors = normalized.colors;

  return {
    '--ds-component': componentId || '',
    '--ds-typography': normalized.typography,
    '--ds-spacing': normalized.spacing,
    '--ds-radius': normalized.radius,
    '--ds-color-1': colors[0] ?? '',
    '--ds-color-2': colors[1] ?? '',
    '--ds-color-3': colors[2] ?? '',
  };
}
