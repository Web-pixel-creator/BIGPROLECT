/**
 * Tests for prompt-component-utils (component index plan)
 */
import { describe, it, expect } from 'vitest';

import { buildComponentSelectionPlan } from '../prompt-component-utils';

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
});
