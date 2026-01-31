import { describe, expect, it } from 'vitest';

import { COMPONENT_INDEX } from '../prompt-data/component-index';
import { buildComponentSelectionPlan } from '../prompt-component-utils';

describe('component selection plan', () => {
  it('builds a component plan for core sections', () => {
    const prompt = 'Hero with bento grid features and pricing table for a modern SaaS.';
    const mentionedSections = ['hero', 'features', 'pricing'];
    const styleTags = ['modern', 'bold'];

    const plan = buildComponentSelectionPlan(prompt, mentionedSections, styleTags, 12345);

    expect(plan.planText).toContain('COMPONENT PLAN');
    expect(plan.matchRate).toBeGreaterThan(0);
    expect(plan.selections.length).toBe(plan.matchedSections);
    const lines = plan.planText.split('\n').filter((line) => line.trim().startsWith('- '));

    const ids = new Set(COMPONENT_INDEX.map((entry) => entry.id));
    const sections = new Set<string>();

    for (const line of lines) {
      const match = line.match(/-\s+([a-z0-9-]+):\s+([a-z0-9-]+)/);
      expect(match).not.toBeNull();
      if (match) {
        sections.add(match[1]);
        expect(ids.has(match[2])).toBe(true);
      }
    }

    expect(sections.has('hero')).toBe(true);
    expect(sections.has('features')).toBe(true);
  });
});
