/**
 * Smoke tests for prompt enhancer stability
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { enhancePromptWithDesignSystem, shouldEnhancePrompt } from '../promptEnhancer';
import { resetGlobalRng, setGlobalSeed } from '../prompt-data';

const originalFetch = (globalThis as { fetch?: typeof fetch }).fetch;

beforeEach(() => {
  setGlobalSeed(12345);
  (globalThis as { fetch?: typeof fetch }).fetch = async () => {
    throw new Error('test_fetch_disabled');
  };
});

afterEach(() => {
  resetGlobalRng();

  if (originalFetch) {
    (globalThis as { fetch?: typeof fetch }).fetch = originalFetch;
  } else {
    delete (globalThis as { fetch?: typeof fetch }).fetch;
  }
});

describe('Prompt Enhancer Stability', () => {
  it('detects theme and section order for a basic prompt', async () => {
    const prompt = [
      'Landing page for a furniture brand.',
      'Hero: bold headline and short subhead.',
      'Features: list the top 3 benefits.',
      'Pricing: three tiers with CTAs.',
    ].join('\n');

    const result = await enhancePromptWithDesignSystem(prompt);

    expect(result.detectedTheme).toBe('furniture');
    expect(result.sectionContract?.order).toEqual(['hero', 'features', 'pricing']);
    expect(result.enhancedPrompt).toContain('SECTION ORDER');
    expect(result.enhancedPrompt).toContain('SECTION COUNT: 3');
  });

  it('recognizes Russian design intent and theme keywords', async () => {
    const prompt = '\u0441\u0430\u0439\u0442 \u043c\u0435\u0431\u0435\u043b\u044c';

    expect(shouldEnhancePrompt(prompt)).toBe(true);

    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('furniture');
  });

  it('does not treat generic text as a design request', () => {
    expect(shouldEnhancePrompt('hello there')).toBe(false);
  });

  it('adds requirements block when prompt provides a list', async () => {
    const prompt = [
      'Landing page for a coffee shop.',
      '- Add a pricing section.',
      '- Include testimonials with short quotes.',
    ].join('\n');

    const result = await enhancePromptWithDesignSystem(prompt);

    expect(result.enhancedPrompt).toContain('REQUIREMENTS (must implement):');
    expect(result.enhancedPrompt).toContain('Add a pricing section.');
    expect(result.enhancedPrompt).toContain('Include testimonials with short quotes.');
  });

  it('builds image contract when image sections are requested', async () => {
    const prompt = [
      'Landing page for a furniture brand with rich photography.',
      'Hero: large image and headline.',
      'Gallery: product photos.',
      'Products: grid of featured items.',
    ].join('\n');

    const result = await enhancePromptWithDesignSystem(prompt);
    const contract = result.sectionContract;

    expect(contract).toBeDefined();

    const imageSections = contract?.imageSections ?? [];
    expect(imageSections).toEqual(expect.arrayContaining(['hero', 'gallery', 'products']));

    for (const section of imageSections) {
      const images = contract?.imageMap?.[section] ?? [];
      expect(images.length).toBeGreaterThan(0);
    }
  });
});
