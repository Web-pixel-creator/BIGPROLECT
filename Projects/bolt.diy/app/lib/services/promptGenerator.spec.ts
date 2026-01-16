import { describe, it, expect } from 'vitest';
import { PromptGenerator, type Brief } from './promptGenerator';

describe('PromptGenerator', () => {
  describe('generate()', () => {
    it('generates prompt from minimal brief', () => {
      const generator = new PromptGenerator(12345);
      const brief: Brief = {
        type: 'landing',
        theme: 'furniture store',
        colors: [],
        style: 'modern',
      };

      const result = generator.generate(brief);

      expect(result.prompt).toContain('landing page');
      expect(result.prompt).toContain('furniture store');
      expect(result.prompt).toContain('modern');
      expect(result.themeKey).toBe('furniture');
      expect(result.sections.length).toBeGreaterThan(0);
    });

    it('uses user-specified colors when provided', () => {
      const generator = new PromptGenerator(12345);
      const brief: Brief = {
        type: 'corporate',
        theme: 'tech startup',
        colors: ['#FF5733', '#33FF57', '#3357FF'],
        style: 'minimal',
      };

      const result = generator.generate(brief);

      expect(result.palette.accent).toBe('#FF5733');
    });

    it('includes additional wishes in prompt', () => {
      const generator = new PromptGenerator(12345);
      const brief: Brief = {
        type: 'portfolio',
        theme: 'photography',
        colors: [],
        style: 'creative',
        wishes: 'Include dark mode toggle',
      };

      const result = generator.generate(brief);

      expect(result.prompt).toContain('Include dark mode toggle');
      expect(result.prompt).toContain('ADDITIONAL REQUIREMENTS');
    });

    it('generates deterministic output with same seed', () => {
      const brief: Brief = {
        type: 'ecommerce',
        theme: 'fitness gear',
        colors: [],
        style: 'professional',
        seed: 42,
      };

      const gen1 = new PromptGenerator();
      const gen2 = new PromptGenerator();

      const result1 = gen1.generate(brief);
      const result2 = gen2.generate(brief);

      expect(result1.prompt).toBe(result2.prompt);
      expect(result1.sections).toEqual(result2.sections);
    });

    it('maps Russian theme keywords correctly', () => {
      const generator = new PromptGenerator(12345);
      const brief: Brief = {
        type: 'landing',
        theme: '\u043C\u0435\u0431\u0435\u043B\u044C\u043D\u0430\u044F \u0444\u0430\u0431\u0440\u0438\u043A\u0430',
        colors: [],
        style: 'modern',
      };

      const result = generator.generate(brief);

      expect(result.themeKey).toBe('furniture');
    });

    it('includes screenshot analysis when provided', () => {
      const generator = new PromptGenerator(12345);
      const brief: Brief = {
        type: 'landing',
        theme: 'tech',
        colors: [],
        style: 'modern',
        screenshotAnalysis: {
          layout: ['hero', 'features', 'pricing'],
          colors: ['#000', '#fff'],
          typography: 'Sans-serif, large headings',
          components: ['hero', 'cards'],
          animations: 'subtle fade-ins',
          style: 'clean and modern',
        },
      };

      const result = generator.generate(brief);

      expect(result.prompt).toContain('Typography: Sans-serif');
      expect(result.prompt).toContain('Inspiration: clean and modern');
      expect(result.sections.map(s => s.name)).toEqual(['hero', 'features', 'pricing']);
    });

    it('generates different sections for different site types', () => {
      const generator = new PromptGenerator(12345);

      const landing = generator.generate({
        type: 'landing',
        theme: 'test',
        colors: [],
        style: 'modern',
      });

      const ecommerce = generator.generate({
        type: 'ecommerce',
        theme: 'test',
        colors: [],
        style: 'modern',
      });

      const landingSections = landing.sections.map(s => s.name);
      const ecommerceSections = ecommerce.sections.map(s => s.name);

      expect(landingSections).toContain('cta');
      expect(ecommerceSections).toContain('products');
      expect(ecommerceSections).not.toContain('cta');
    });
  });

  describe('theme mapping', () => {
    const testCases = [
      { input: 'furniture store', expected: 'furniture' },
      { input: 'medical clinic', expected: 'medical' },
      { input: 'fintech startup', expected: 'finance' },
      { input: 'gym and fitness', expected: 'fitness' },
      { input: 'travel agency', expected: 'travel' },
      { input: 'photography studio', expected: 'photography' },
      { input: 'restaurant menu', expected: 'restaurant' },
      { input: 'saas platform', expected: 'tech' },
      { input: 'online courses', expected: 'education' },
      { input: 'real estate agency', expected: 'realestate' },
      { input: 'random unknown business', expected: 'default' },
    ];

    testCases.forEach(({ input, expected }) => {
      it(`maps "${input}" to "${expected}"`, () => {
        const generator = new PromptGenerator(12345);
        const result = generator.generate({
          type: 'landing',
          theme: input,
          colors: [],
          style: 'modern',
        });
        expect(result.themeKey).toBe(expected);
      });
    });
  });
});
