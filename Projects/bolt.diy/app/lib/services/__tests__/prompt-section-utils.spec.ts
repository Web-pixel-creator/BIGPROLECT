import { describe, expect, it } from 'vitest';

import { SECTION_KEYWORDS } from '../prompt-data';
import { inferAllSections, inferSectionKey } from '../prompt-section-utils';

describe('prompt-section-utils', () => {
  it('prefers higher-scoring section when multiple keywords match', () => {
    const text = 'hero benefits services advantages highlights';

    const result = inferSectionKey(text, SECTION_KEYWORDS);

    expect(result).toBe('features');
  });

  it('orders inferred sections by score', () => {
    const text = 'hero benefits services advantages highlights';

    const result = inferAllSections(text, SECTION_KEYWORDS);

    expect(result[0]).toBe('features');
    expect(result).toContain('hero');
  });

  it('boosts multiword section matches', () => {
    const text = 'hero section with features and cards';

    const result = inferSectionKey(text, SECTION_KEYWORDS);

    expect(result).toBe('hero');
  });
});
