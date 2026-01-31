import { describe, expect, it } from 'vitest';

import { COMPONENT_INDEX } from '../prompt-data/component-index';

describe('component index', () => {
  it('provides required metadata for each entry', () => {
    for (const entry of COMPONENT_INDEX) {
      expect(entry.id).toBeTruthy();
      expect(entry.sectionType).toBeTruthy();
      expect(entry.source).toBeTruthy();
      expect(Array.isArray(entry.propsContract)).toBe(true);
      expect(Array.isArray(entry.visualTags)).toBe(true);
      expect(Array.isArray(entry.styleTags)).toBe(true);
      expect(entry.layoutArchetype).toBeTruthy();
      expect(Array.isArray(entry.dependencies)).toBe(true);
    }
  });

  it('includes core sections for shadcn and magicui', () => {
    const sources = ['shadcn', 'magicui'] as const;
    const sections = ['hero', 'features', 'pricing', 'testimonials', 'faq', 'footer'] as const;

    for (const source of sources) {
      for (const sectionType of sections) {
        const matches = COMPONENT_INDEX.filter(
          (entry) => entry.source === source && entry.sectionType === sectionType,
        );

        expect(matches.length).toBeGreaterThan(0);
      }
    }
  });
});
