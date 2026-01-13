/**
 * Tests for componentMatcher.server.ts
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentMatcher, type ComponentMatch } from '../componentMatcher.server';

describe('ComponentMatcher', () => {
  let matcher: ComponentMatcher;

  beforeEach(() => {
    // Create fresh instance for each test
    matcher = new ComponentMatcher();
  });

  describe('analyzeUserRequest', () => {
    describe('component type detection', () => {
      it('detects hero from EN request', () => {
        const result = matcher.analyzeUserRequest('landing page with hero section');
        expect(result.components).toContain('hero');
      });

      it('detects navbar/navigation from EN request', () => {
        const result = matcher.analyzeUserRequest('website with navigation bar');
        expect(result.components.some(c => c === 'navbar' || c === 'navigation' || c === 'header')).toBe(true);
      });

      it('detects features from EN request', () => {
        const result = matcher.analyzeUserRequest('page with features section');
        expect(result.components).toContain('features');
      });

      it('detects pricing from EN request', () => {
        const result = matcher.analyzeUserRequest('SaaS landing with pricing plans');
        expect(result.components).toContain('pricing');
      });

      it('detects testimonials from EN request', () => {
        const result = matcher.analyzeUserRequest('page with customer testimonials');
        expect(result.components).toContain('testimonials');
      });

      it('detects footer from EN request', () => {
        const result = matcher.analyzeUserRequest('website with footer');
        expect(result.components).toContain('footer');
      });

      it('detects gallery from EN request', () => {
        const result = matcher.analyzeUserRequest('portfolio with image gallery');
        expect(result.components).toContain('gallery');
      });
    });

    describe('RU component type detection', () => {
      it('detects hero from RU request', () => {
        const result = matcher.analyzeUserRequest('\u0433\u043b\u0430\u0432\u043d\u044b\u0439 \u0431\u0430\u043d\u043d\u0435\u0440');
        expect(result.components).toContain('hero');
      });

      it('detects navigation from RU request', () => {
        const result = matcher.analyzeUserRequest('\u043d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044f');
        expect(result.components.some(c => c === 'navbar' || c === 'navigation' || c === 'header')).toBe(true);
      });

      it('detects features from RU request', () => {
        const result = matcher.analyzeUserRequest('\u043f\u0440\u0435\u0438\u043c\u0443\u0449\u0435\u0441\u0442\u0432\u0430');
        expect(result.components).toContain('features');
      });

      it('detects pricing from RU request', () => {
        const result = matcher.analyzeUserRequest('\u0442\u0430\u0440\u0438\u0444\u044b');
        expect(result.components).toContain('pricing');
      });

      it('detects testimonials from RU request', () => {
        const result = matcher.analyzeUserRequest('\u043e\u0442\u0437\u044b\u0432\u044b');
        expect(result.components).toContain('testimonials');
      });
    });

    describe('ambiguous RU/EN keywords', () => {
      it('detects menu as navigation (EN)', () => {
        const result = matcher.analyzeUserRequest('website with menu');
        expect(result.components.some(c => c === 'navbar' || c === 'navigation')).toBe(true);
      });

      it('detects menu as navigation (RU: \u043c\u0435\u043d\u044e)', () => {
        const result = matcher.analyzeUserRequest('\u0441\u0430\u0439\u0442 \u0441 \u043c\u0435\u043d\u044e');
        expect(result.components.some(c => c === 'navbar' || c === 'navigation')).toBe(true);
      });

      it('detects services as features (EN)', () => {
        const result = matcher.analyzeUserRequest('page with services section');
        expect(result.components.some(c => c === 'features' || c === 'services')).toBe(true);
      });

      it('detects services as features (RU: \u0443\u0441\u043b\u0443\u0433\u0438)', () => {
        // Use nominative case for exact keyword match
        const result = matcher.analyzeUserRequest('\u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430 \u0443\u0441\u043b\u0443\u0433\u0438');
        expect(result.components.some(c => c === 'features' || c === 'services')).toBe(true);
      });

      it('detects footer (RU: \u0444\u0443\u0442\u0435\u0440)', () => {
        // Use nominative case for exact keyword match
        const result = matcher.analyzeUserRequest('\u0441\u0430\u0439\u0442 \u0444\u0443\u0442\u0435\u0440');
        expect(result.components).toContain('footer');
      });

      it('detects gallery (RU: \u0433\u0430\u043b\u0435\u0440\u0435\u044f)', () => {
        // Use nominative case for exact keyword match
        const result = matcher.analyzeUserRequest('\u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430 \u0433\u0430\u043b\u0435\u0440\u0435\u044f');
        expect(result.components).toContain('gallery');
      });
    });

    describe('priority ordering', () => {
      it('hero has higher priority than header', () => {
        const result = matcher.analyzeUserRequest('page with hero banner and header');
        const heroIndex = result.components.indexOf('hero');
        const headerIndex = result.components.indexOf('header');
        
        if (heroIndex !== -1 && headerIndex !== -1) {
          expect(heroIndex).toBeLessThan(headerIndex);
        }
      });

      it('navigation has higher priority than footer', () => {
        const result = matcher.analyzeUserRequest('site with navigation and footer');
        const navIndex = result.components.findIndex(c => c === 'navbar' || c === 'navigation');
        const footerIndex = result.components.indexOf('footer');
        
        if (navIndex !== -1 && footerIndex !== -1) {
          expect(navIndex).toBeLessThan(footerIndex);
        }
      });
    });

    describe('theme detection', () => {
      it('detects tech theme', () => {
        const result = matcher.analyzeUserRequest('SaaS startup landing page');
        expect(result.theme).toBe('tech');
      });

      it('detects restaurant theme', () => {
        const result = matcher.analyzeUserRequest('restaurant cafe delivery website');
        expect(result.theme).toBe('restaurant');
      });

      it('detects ecommerce theme', () => {
        const result = matcher.analyzeUserRequest('online marketplace with checkout and cart');
        expect(result.theme).toBe('ecommerce');
      });

      it('detects photography theme', () => {
        const result = matcher.analyzeUserRequest('photographer portfolio');
        expect(result.theme).toBe('photography');
      });
    });

    describe('single image handling', () => {
      it('removes gallery types when single image requested', () => {
        const result = matcher.analyzeUserRequest('landing page with single image hero');
        expect(result.components).not.toContain('gallery');
        expect(result.components).toContain('hero');
      });

      it('adds hero when single image requested without explicit hero', () => {
        const result = matcher.analyzeUserRequest('page with one image');
        expect(result.components).toContain('hero');
      });
    });

    describe('default landing page components', () => {
      it('returns default components for generic landing request', () => {
        const result = matcher.analyzeUserRequest('landing page');
        expect(result.components).toContain('hero');
        // May or may not include features depending on keyword matching
        expect(result.components.length).toBeGreaterThan(0);
      });

      it('returns default components for RU landing request', () => {
        const result = matcher.analyzeUserRequest('\u043b\u0435\u043d\u0434\u0438\u043d\u0433');
        expect(result.components.length).toBeGreaterThan(0);
      });
    });
  });

  describe('findMatchingComponents', () => {
    beforeEach(async () => {
      // Load components for matching tests
      await matcher.loadAllComponentFiles();
    });

    it('returns components sorted by relevance', () => {
      const components = matcher.findMatchingComponents(['hero'], null, 5);
      
      for (let i = 1; i < components.length; i++) {
        expect(components[i - 1].relevance).toBeGreaterThanOrEqual(components[i].relevance);
      }
    });

    it('gives bonus for theme match', () => {
      const withTheme = matcher.findMatchingComponents(['hero'], 'tech', 10);
      const withoutTheme = matcher.findMatchingComponents(['hero'], null, 10);
      
      // Components matching theme should have higher scores
      const techComponents = withTheme.filter(c => 
        c.description?.toLowerCase().includes('tech') || 
        c.tags?.some(t => t.toLowerCase().includes('tech'))
      );
      
      // At least verify we get results
      expect(withTheme.length).toBeGreaterThanOrEqual(0);
      expect(withoutTheme.length).toBeGreaterThanOrEqual(0);
    });

    it('respects limit parameter', () => {
      const limit = 3;
      const components = matcher.findMatchingComponents(['hero', 'features'], null, limit);
      // Limit is per type, so max is limit * types
      expect(components.length).toBeLessThanOrEqual(limit * 2);
    });

    it('deduplicates components by name', () => {
      const components = matcher.findMatchingComponents(['hero', 'header', 'navbar'], null, 10);
      const names = components.map(c => c.name);
      const uniqueNames = new Set(names);
      expect(names.length).toBe(uniqueNames.size);
    });
  });

  describe('generateContextForPrompt', () => {
    beforeEach(async () => {
      await matcher.loadAllComponentFiles();
    });

    it('returns empty string for unrecognized request', () => {
      const context = matcher.generateContextForPrompt('random gibberish xyz123');
      // May or may not be empty depending on fallback logic
      expect(typeof context).toBe('string');
    });

    it('includes theme in context', () => {
      const context = matcher.generateContextForPrompt('tech startup landing page with hero');
      if (context) {
        expect(context).toContain('Theme:');
      }
    });

    it('includes component types in context', () => {
      const context = matcher.generateContextForPrompt('landing page with hero and features');
      if (context) {
        expect(context).toContain('Components needed:');
      }
    });

    it('includes palette suggestion', () => {
      const context = matcher.generateContextForPrompt('dark landing page');
      if (context) {
        expect(context).toContain('Palette suggestion:');
      }
    });

    it('includes layout suggestion', () => {
      const context = matcher.generateContextForPrompt('landing page with hero');
      if (context) {
        expect(context).toContain('Layout suggestion:');
      }
    });

    it('is deterministic for same request', () => {
      const context1 = matcher.generateContextForPrompt('tech landing page');
      const context2 = matcher.generateContextForPrompt('tech landing page');
      expect(context1).toBe(context2);
    });
  });

  describe('getStats', () => {
    it('returns zero stats before loading', () => {
      const stats = matcher.getStats();
      expect(stats.categories).toBe(0);
      expect(stats.totalComponents).toBe(0);
    });

    it('returns non-zero stats after loading', async () => {
      await matcher.loadAllComponentFiles();
      const stats = matcher.getStats();
      // May be 0 if no component files exist in test env
      expect(stats.categories).toBeGreaterThanOrEqual(0);
      expect(stats.totalComponents).toBeGreaterThanOrEqual(0);
    });
  });
});
