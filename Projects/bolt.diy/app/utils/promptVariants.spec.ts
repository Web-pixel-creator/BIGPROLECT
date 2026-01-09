import { describe, expect, it } from 'vitest';

import { selectVariant, type VariantConfig } from './promptVariants';

describe('promptVariants', () => {
  it('is deterministic for the same inputs', () => {
    const a = selectVariant({ filename: 'src/App.tsx', nowMs: 1234567890 });
    const b = selectVariant({ filename: 'src/App.tsx', nowMs: 1234567890 });
    expect(a).toBe(b);
  });

  it('supports forceVariant override', () => {
    const v = selectVariant({ filename: 'src/App.tsx', nowMs: 1234567890, forceVariant: 'fewshot-v1' });
    expect(v).toBe('fewshot-v1');
  });

  it('falls back to baseline when no variants are enabled', () => {
    const registry = {
      baseline: { id: 'baseline', enabled: false, weight: 50 },
      'fewshot-v1': { id: 'fewshot-v1', enabled: false, weight: 50 },
    } satisfies Record<'baseline' | 'fewshot-v1', VariantConfig>;

    const v = selectVariant({ filename: 'src/App.tsx', nowMs: 1234567890, registry });
    expect(v).toBe('baseline');
  });

  it('returns the only enabled variant', () => {
    const registry = {
      baseline: { id: 'baseline', enabled: false, weight: 50 },
      'fewshot-v1': { id: 'fewshot-v1', enabled: true, weight: 50 },
    } satisfies Record<'baseline' | 'fewshot-v1', VariantConfig>;

    const v = selectVariant({ filename: 'src/App.tsx', nowMs: 1234567890, registry });
    expect(v).toBe('fewshot-v1');
  });
});
