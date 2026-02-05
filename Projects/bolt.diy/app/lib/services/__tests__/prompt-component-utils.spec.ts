/**
 * Tests for prompt-component-utils (component index plan)
 */
import { describe, it, expect } from 'vitest';

import { buildComponentSelectionPlan } from '../prompt-component-utils';
import { COMPONENT_INDEX, type ComponentIndexEntry } from '../prompt-data/component-index';

function requiredProps(propsContract: string[]): string[] {
  return propsContract
    .map((prop) => prop.trim())
    .filter(Boolean)
    .filter((prop) => !prop.endsWith('?'))
    .map((prop) => prop.replace(/\?$/, ''));
}

describe('prompt-component-utils', () => {
  it('builds a component selection plan from the curated index', () => {
    const plan = buildComponentSelectionPlan(
      'modern saas landing page with hero and features',
      ['hero', 'features'],
      ['modern'],
      12345,
    );

    expect(plan.eligibleSections).toBe(2);
    expect(plan.matchedSections).toBeGreaterThan(0);
    expect(plan.selections.length).toBeGreaterThan(0);
    expect(plan.planText).toContain('COMPONENT PLAN');
    expect(plan.avgCandidatesPerSection).toBeGreaterThanOrEqual(0);
    expect(typeof plan.repeatPenaltyTriggered).toBe('boolean');
  });

  it('returns empty plan when prompt or sections are missing', () => {
    const plan = buildComponentSelectionPlan('', [], [], 12345);

    expect(plan.eligibleSections).toBe(0);
    expect(plan.matchedSections).toBe(0);
    expect(plan.selections.length).toBe(0);
    expect(plan.planText).toBe('');
    expect(plan.avgCandidatesPerSection).toBe(0);
    expect(plan.repeatPenaltyTriggered).toBe(false);
  });

  it('uses fallback when no scored candidates exist', () => {
    const fallbackEntry: ComponentIndexEntry = {
      id: 'test-fallback-unknown',
      sectionType: 'unknown' as unknown as ComponentIndexEntry['sectionType'],
      source: 'shadcn',
      propsContract: [],
      visualTags: ['zzzz'],
      styleTags: ['zzzz'],
      layoutArchetype: 'zzzz',
      dependencies: [],
    };

    COMPONENT_INDEX.push(fallbackEntry);
    try {
      const plan = buildComponentSelectionPlan(
        'alpha beta gamma',
        ['unknown' as unknown as ComponentIndexEntry['sectionType']],
        [],
        4242,
      );

      expect(plan.eligibleSections).toBe(1);
      expect(plan.matchedSections).toBe(1);
      expect(plan.fallbackCount).toBe(1);
      expect(plan.fallbackRate).toBe(1);
      expect(plan.avgCandidatesPerSection).toBeGreaterThanOrEqual(0);
      expect(plan.planText).toContain('fallback');
      expect(plan.selections[0]?.componentId).toBe('test-fallback-unknown');
    } finally {
      COMPONENT_INDEX.pop();
    }
  });

  it('keeps required props coverage for each selected section', () => {
    const plan = buildComponentSelectionPlan(
      'modern product page with hero, features, pricing and cta',
      ['hero', 'features', 'pricing', 'cta'],
      ['modern', 'product'],
      20260205,
    );

    expect(plan.eligibleSections).toBe(4);
    expect(plan.matchedSections).toBe(4);
    expect(plan.selections).toHaveLength(4);

    for (const selection of plan.selections) {
      const entry = COMPONENT_INDEX.find(
        (item) => item.id === selection.componentId && item.sectionType === selection.sectionType,
      );

      expect(entry).toBeDefined();
      const expectedRequiredProps = requiredProps(entry?.propsContract ?? []);
      expect(expectedRequiredProps.length).toBeGreaterThan(0);

      const selectedRequiredProps = requiredProps(selection.propsContract);
      expect(selectedRequiredProps).toEqual(expect.arrayContaining(expectedRequiredProps));
    }
  });
});
