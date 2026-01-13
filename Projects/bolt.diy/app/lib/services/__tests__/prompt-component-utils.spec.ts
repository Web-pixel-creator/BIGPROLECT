/**
 * Tests for prompt-component-utils
 */
import { describe, it, expect } from 'vitest';
import {
  componentScore,
  componentText,
  isSafeComponent,
  extractComponentImports,
  type RegistryComponent,
} from '../prompt-component-utils';

describe('prompt-component-utils', () => {
  describe('componentText', () => {
    it('combines all component fields into searchable text', () => {
      const component: RegistryComponent = {
        name: 'HeroSection',
        description: 'A beautiful hero banner',
        category: 'sections',
        source: 'magicui',
        tags: ['hero', 'landing'],
      };
      const text = componentText(component);
      expect(text).toContain('herosection');
      expect(text).toContain('hero banner');
      expect(text).toContain('sections');
      expect(text).toContain('magicui');
      expect(text).toContain('landing');
    });

    it('handles missing fields gracefully', () => {
      const component: RegistryComponent = {
        name: 'Button',
        description: '',
        category: '',
        source: '',
      };
      const text = componentText(component);
      expect(text).toContain('button');
    });
  });

  describe('componentScore', () => {
    it('scores hero component higher for hero section', () => {
      const heroComponent: RegistryComponent = {
        name: 'HeroBanner',
        description: 'Hero section with spotlight effect',
        category: 'hero',
        source: 'magicui',
        tags: ['hero', 'banner'],
      };
      const genericComponent: RegistryComponent = {
        name: 'Card',
        description: 'A simple card component',
        category: 'ui',
        source: 'shadcn',
        tags: ['card'],
      };

      const heroScore = componentScore(heroComponent, 'hero', 'default');
      const genericScore = componentScore(genericComponent, 'hero', 'default');

      expect(heroScore).toBeGreaterThan(genericScore);
    });

    it('gives bonus for theme match', () => {
      const component: RegistryComponent = {
        name: 'VinylHero',
        description: 'Hero for vinyl record stores',
        category: 'hero',
        source: 'custom',
        tags: ['hero', 'vinyl'],
      };

      const scoreWithTheme = componentScore(component, 'hero', 'vinyl');
      const scoreWithoutTheme = componentScore(component, 'hero', 'default');

      expect(scoreWithTheme).toBeGreaterThan(scoreWithoutTheme);
    });

    it('gives bonus for quality sources (magicui, aceternity)', () => {
      const magicuiComponent: RegistryComponent = {
        name: 'HeroBeams',
        description: 'Hero with beam effects',
        category: 'hero',
        source: 'magicui',
        tags: ['hero'],
      };
      const unknownComponent: RegistryComponent = {
        name: 'HeroBasic',
        description: 'Hero with beam effects',
        category: 'hero',
        source: 'unknown',
        tags: ['hero'],
      };

      const magicuiScore = componentScore(magicuiComponent, 'hero', 'default');
      const unknownScore = componentScore(unknownComponent, 'hero', 'default');

      expect(magicuiScore).toBeGreaterThan(unknownScore);
    });

    it('penalizes CLI/install components', () => {
      const normalComponent: RegistryComponent = {
        name: 'NavBar',
        description: 'Navigation bar component',
        category: 'navigation',
        source: 'magicui',
        tags: ['nav', 'menu'],
      };
      const cliComponent: RegistryComponent = {
        name: 'NavBarCLI',
        description: 'Navigation bar with CLI install',
        category: 'navigation',
        source: 'magicui',
        tags: ['nav', 'menu', 'cli'],
      };

      const normalScore = componentScore(normalComponent, 'navigation', 'default');
      const cliScore = componentScore(cliComponent, 'navigation', 'default');

      expect(normalScore).toBeGreaterThan(cliScore);
    });

    it('returns 0 for components with no matching keywords', () => {
      const component: RegistryComponent = {
        name: 'RandomWidget',
        description: 'Some random widget',
        category: 'misc',
        source: 'unknown',
        tags: [],
      };

      const score = componentScore(component, 'hero', 'default');
      expect(score).toBe(0);
    });

    it('scores strong keywords higher than regular keywords', () => {
      const strongComponent: RegistryComponent = {
        name: 'HeroSpotlight',
        description: 'Hero with spotlight effect',
        category: 'hero',
        source: 'custom',
        tags: ['hero', 'spotlight'],
      };
      const weakComponent: RegistryComponent = {
        name: 'TextBlock',
        description: 'Text block component',
        category: 'hero',
        source: 'custom',
        tags: ['text'],
      };

      const strongScore = componentScore(strongComponent, 'hero', 'default');
      const weakScore = componentScore(weakComponent, 'hero', 'default');

      expect(strongScore).toBeGreaterThan(weakScore);
    });

    it('gives lower score for noisy keywords like card, grid', () => {
      const specificComponent: RegistryComponent = {
        name: 'ProductCatalog',
        description: 'Product catalog with shop features',
        category: 'products',
        source: 'custom',
        tags: ['product', 'catalog'],
      };
      const genericComponent: RegistryComponent = {
        name: 'GridLayout',
        description: 'Generic grid layout',
        category: 'products',
        source: 'custom',
        tags: ['grid'],
      };

      const specificScore = componentScore(specificComponent, 'products', 'default');
      const genericScore = componentScore(genericComponent, 'products', 'default');

      expect(specificScore).toBeGreaterThan(genericScore);
    });
  });

  describe('extractComponentImports', () => {
    it('extracts import paths from code', () => {
      const code = `
        import React from 'react';
        import { motion } from 'framer-motion';
        import { Button } from './components/Button';
      `;
      const imports = extractComponentImports(code);
      expect(imports).toContain('react');
      expect(imports).toContain('framer-motion');
      expect(imports).toContain('./components/Button');
    });

    it('returns empty array for empty code', () => {
      expect(extractComponentImports('')).toEqual([]);
    });
  });

  describe('isSafeComponent', () => {
    it('returns true for component with safe imports', () => {
      const component: RegistryComponent = {
        name: 'SafeButton',
        description: 'Safe button',
        category: 'ui',
        source: 'custom',
        code: `
          import React from 'react';
          import { motion } from 'framer-motion';
          export const SafeButton = () => <button>Click</button>;
        `,
      };
      expect(isSafeComponent(component)).toBe(true);
    });

    it('returns false for component with external dependencies', () => {
      const component: RegistryComponent = {
        name: 'UnsafeButton',
        description: 'Unsafe button',
        category: 'ui',
        source: 'custom',
        code: `
          import React from 'react';
          import { someLib } from 'external-library';
          export const UnsafeButton = () => <button>Click</button>;
        `,
      };
      expect(isSafeComponent(component)).toBe(false);
    });

    it('returns true for component without code', () => {
      const component: RegistryComponent = {
        name: 'NoCode',
        description: 'No code',
        category: 'ui',
        source: 'custom',
      };
      expect(isSafeComponent(component)).toBe(true);
    });

    it('allows relative imports', () => {
      const component: RegistryComponent = {
        name: 'RelativeImport',
        description: 'Relative import',
        category: 'ui',
        source: 'custom',
        code: `
          import { helper } from './utils';
          import { cn } from '@/lib/utils';
        `,
      };
      expect(isSafeComponent(component)).toBe(true);
    });
  });
});
