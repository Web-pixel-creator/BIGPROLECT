import { describe, expect, it } from 'vitest';

import { buildRenderPlan, buildSectionContractFromRenderPlan } from '../render-plan';

describe('render plan builder', () => {
  it('builds a render plan with component selections', () => {
    const plan = buildRenderPlan({
      prompt: 'Hero and features for a modern SaaS landing page.',
      sections: ['hero', 'features', 'pricing'],
      seed: 12345,
      styleTags: ['modern', 'bold'],
      styleTokens: {
        typography: 'Modern Sans',
        spacing: 'Airy',
        radius: 'Rounded',
        colors: ['#111111', '#ffffff', '#3b82f6'],
      },
      layoutArchetype: 'hero-centered',
    });

    expect(plan.seed).toBe(12345);
    expect(plan.layoutUniquenessHash.length).toBeGreaterThan(0);
    expect(plan.sections.length).toBeGreaterThan(0);
    expect(plan.componentPlan.matchRate).toBeGreaterThan(0);
    expect(Object.keys(plan.sections[0]?.styleVariables ?? {})).toContain('--ds-typography');
  });

  it('derives a section contract from the render plan', () => {
    const plan = buildRenderPlan({
      prompt: 'Hero and features for a modern SaaS landing page.',
      sections: ['hero', 'features', 'pricing'],
      seed: 54321,
      styleTags: ['modern', 'bold'],
      styleTokens: {
        typography: 'Modern Sans',
        spacing: 'Airy',
        radius: 'Rounded',
        colors: ['#111111', '#ffffff', '#3b82f6'],
      },
      layoutArchetype: 'hero-centered',
    });

    const contract = buildSectionContractFromRenderPlan(plan);

    expect(contract?.order).toEqual(plan.sections.map((section) => section.sectionType));
    expect(Object.keys(contract?.labels ?? {}).length).toBeGreaterThan(0);
  });
});
