/**
 * Tests for prompt-component-utils (component index plan)
 */
import { describe, it, expect } from 'vitest';

import { buildComponentSelectionPlan } from '../prompt-component-utils';
import { COMPONENT_INDEX, type ComponentIndexEntry } from '../prompt-data/component-index';

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
  });

  it('returns empty plan when prompt or sections are missing', () => {
    const plan = buildComponentSelectionPlan('', [], [], 12345);

    expect(plan.eligibleSections).toBe(0);
    expect(plan.matchedSections).toBe(0);
    expect(plan.selections.length).toBe(0);
    expect(plan.planText).toBe('');
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
      expect(plan.planText).toContain('fallback');
      expect(plan.selections[0]?.componentId).toBe('test-fallback-unknown');
    } finally {
      COMPONENT_INDEX.pop();
    }
  });
});
