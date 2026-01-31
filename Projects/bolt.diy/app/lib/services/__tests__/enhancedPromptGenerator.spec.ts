import { describe, expect, it } from 'vitest';

import { EnhancedPromptGenerator } from '../enhancedPromptGenerator';

describe('EnhancedPromptGenerator', () => {
  it('includes a component plan in the generated prompt', () => {
    const generator = new EnhancedPromptGenerator(12345);
    const result = generator.generate({
      type: 'landing',
      theme: 'Modern SaaS',
      colors: [],
      style: 'modern',
      seed: 12345,
    });

    expect(result.prompt).toContain('COMPONENT PLAN');
  });
});
