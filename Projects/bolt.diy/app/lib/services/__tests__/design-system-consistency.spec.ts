/**
 * Design system consistency tests
 */
import { describe, expect, it } from 'vitest';

import { getVariantsByType } from '../../design-system/componentVariants';
import { getAllLayoutPatterns } from '../../design-system/layoutPatterns';
import {
  COMPONENT_KEYWORDS,
  SECTION_DEFINITIONS,
  SECTION_KEYWORDS,
  SECTION_ORDER,
  SECTION_PRIORITY,
  SECTION_SCORING_PRIORITY,
} from '../prompt-data';

// @ts-ignore - JSON import
import componentAliases from '../component-aliases.json';

const COMPONENT_ALIASES = (componentAliases as { componentKeywords?: Record<string, string[]> })
  .componentKeywords ?? {};

const SECTION_TYPES = Object.keys(SECTION_DEFINITIONS).sort();
const LAYOUT_SECTION_TYPES = Array.from(
  new Set(getAllLayoutPatterns().flatMap((pattern) => pattern.sections.map((section) => section.type))),
).sort();

describe('design-system consistency', () => {
  it('layout pattern section types exist in prompt-data', () => {
    for (const sectionType of LAYOUT_SECTION_TYPES) {
      expect(SECTION_DEFINITIONS).toHaveProperty(sectionType);
    }
  });

  it('section types have component variants', () => {
    for (const sectionType of SECTION_TYPES) {
      const variants = getVariantsByType(sectionType);
      expect(
        variants.length,
        `Expected component variants for section type: ${sectionType}`,
      ).toBeGreaterThan(0);
    }
  });

  it('section types are included in section ordering and priorities', () => {
    for (const sectionType of SECTION_TYPES) {
      expect(SECTION_ORDER).toContain(sectionType);
      expect(SECTION_PRIORITY).toHaveProperty(sectionType);
      expect(SECTION_SCORING_PRIORITY).toHaveProperty(sectionType);
    }
  });

  it('section order covers all section types exactly once', () => {
    const orderSet = new Set(SECTION_ORDER);
    expect(orderSet.size).toBe(SECTION_ORDER.length);
    expect(Array.from(orderSet).sort()).toEqual(SECTION_TYPES);
  });

  it('section types have keyword mappings', () => {
    for (const sectionType of SECTION_TYPES) {
      expect(SECTION_KEYWORDS).toHaveProperty(sectionType);
      expect(COMPONENT_KEYWORDS).toHaveProperty(sectionType);
    }
  });

  it('section types have component alias keywords', () => {
    for (const sectionType of SECTION_TYPES) {
      expect(COMPONENT_ALIASES).toHaveProperty(sectionType);
      expect((COMPONENT_ALIASES[sectionType] ?? []).length).toBeGreaterThan(0);
    }
  });
});
