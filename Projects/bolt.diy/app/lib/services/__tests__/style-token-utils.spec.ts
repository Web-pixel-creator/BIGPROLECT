import { describe, expect, it } from 'vitest';

import { applyStyleTokens, normalizeStyleTokens } from '../style-token-utils';

describe('style token utils', () => {
  it('normalizes empty token fields', () => {
    const normalized = normalizeStyleTokens({
      typography: '',
      spacing: '',
      radius: '',
      colors: [],
    });

    expect(normalized.typography).toBe('');
    expect(normalized.colors).toEqual([]);
  });

  it('applies style tokens to CSS variables', () => {
    const vars = applyStyleTokens('component-1', {
      typography: 'Modern Sans',
      spacing: 'Relaxed',
      radius: 'Rounded',
      colors: ['#111111', '#ffffff', '#3b82f6'],
    });

    expect(vars['--ds-component']).toBe('component-1');
    expect(vars['--ds-typography']).toBe('Modern Sans');
    expect(vars['--ds-color-1']).toBe('#111111');
  });
});
