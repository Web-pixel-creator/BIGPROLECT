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

  it('includes hero and features entries for shadcn and magicui', () => {
    const shadcnHeroes = COMPONENT_INDEX.filter(
      (entry) => entry.source === 'shadcn' && entry.sectionType === 'hero',
    );
    const shadcnFeatures = COMPONENT_INDEX.filter(
      (entry) => entry.source === 'shadcn' && entry.sectionType === 'features',
    );
    const magicuiHeroes = COMPONENT_INDEX.filter(
      (entry) => entry.source === 'magicui' && entry.sectionType === 'hero',
    );
    const magicuiFeatures = COMPONENT_INDEX.filter(
      (entry) => entry.source === 'magicui' && entry.sectionType === 'features',
    );

    expect(shadcnHeroes.length).toBeGreaterThan(0);
    expect(shadcnFeatures.length).toBeGreaterThan(0);
    expect(magicuiHeroes.length).toBeGreaterThan(0);
    expect(magicuiFeatures.length).toBeGreaterThan(0);
  });
});
