import { describe, expect, it } from 'vitest';

import { buildModularGenerationAddon } from './modularGenerationPrompt';

describe('modularGenerationPrompt', () => {
  it('does not enable modular mode for single-component prompts', () => {
    const result = buildModularGenerationAddon('Build a button component with variants');

    expect(result.enabled).toBe(false);
    expect(result.strategy).toBe('single');
    expect(result.addon).toBe('');
  });

  it('enables modular mode for website prompts', () => {
    const result = buildModularGenerationAddon('Create a landing page website for a SaaS called "TechFlow"');

    expect(result.enabled).toBe(true);
    expect(result.strategy).toBe('modular');
    expect(result.addon).toContain('MODULAR WEBSITE MODE');
  });

  it('includes recommended section files for planned sections', () => {
    const result = buildModularGenerationAddon('Create a landing page for a startup');

    expect(result.enabled).toBe(true);
    expect(result.addon).toContain('src/components/Navigation.tsx');
    expect(result.addon).toContain('src/components/HeroSection.tsx');
    expect(result.addon).toContain('src/components/Footer.tsx');
  });
});
