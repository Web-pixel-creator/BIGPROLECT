import { describe, expect, it } from 'vitest';

import { buildRenderPlan, buildSectionContractFromRenderPlan } from '../render-plan';
import { COMPONENT_INDEX } from '../prompt-data/component-index';

function requiredProps(propsContract: string[]): string[] {
  return propsContract
    .map((prop) => prop.trim())
    .filter(Boolean)
    .filter((prop) => !prop.endsWith('?'))
    .map((prop) => prop.replace(/\?$/, ''));
}

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

  it('preserves required props contracts for selected sections', () => {
    const plan = buildRenderPlan({
      prompt: 'Build a modern SaaS page with hero, features, pricing and cta.',
      sections: ['hero', 'features', 'pricing', 'cta'],
      seed: 20260205,
      styleTags: ['modern', 'bold'],
      styleTokens: {
        typography: 'Modern Sans',
        spacing: 'Airy',
        radius: 'Rounded',
        colors: ['#111111', '#ffffff', '#3b82f6'],
      },
      layoutArchetype: 'hero-centered',
    });

    expect(plan.sections).toHaveLength(4);

    for (const section of plan.sections) {
      const indexEntry = COMPONENT_INDEX.find(
        (entry) => entry.id === section.componentId && entry.sectionType === section.sectionType,
      );

      expect(indexEntry).toBeDefined();
      const expectedRequiredProps = requiredProps(indexEntry?.propsContract ?? []);
      expect(expectedRequiredProps.length).toBeGreaterThan(0);

      const sectionRequiredProps = requiredProps(section.propsContract);
      expect(sectionRequiredProps).toEqual(expect.arrayContaining(expectedRequiredProps));
    }
  });
});
