import type { ComponentSelectionPlan } from './prompt-component-utils';
import { buildComponentSelectionPlan } from './prompt-component-utils';
import type { SectionType } from './prompt-data/section-definitions';
import type { ComponentSource } from './prompt-data/component-index';
import { SECTION_LABELS } from './prompt-data';
import { hashString } from './prompt-theme-utils';
import { applyStyleTokens, type StyleTokenVariables } from './style-token-utils';
import type { SectionContract } from '~/types/section-contract';

export type StyleTokens = {
  typography: string;
  spacing: string;
  radius: string;
  colors: string[];
};

export type RenderPlanSection = {
  sectionType: SectionType;
  componentId: string;
  source: ComponentSource;
  layoutArchetype: string;
  propsContract: string[];
  styleTokens: StyleTokens;
  styleVariables: StyleTokenVariables;
};

export type RenderPlan = {
  seed: number;
  layoutArchetype?: string;
  layoutUniquenessHash: string;
  sections: RenderPlanSection[];
  componentPlan: ComponentSelectionPlan;
};

export type BuildRenderPlanOptions = {
  prompt: string;
  sections: string[];
  seed?: number;
  styleTags?: string[];
  styleTokens?: StyleTokens;
  layoutArchetype?: string;
  componentPlan?: ComponentSelectionPlan;
};

export function buildRenderPlan(options: BuildRenderPlanOptions): RenderPlan {
  const seed = options.seed ?? Date.now();
  const componentPlan =
    options.componentPlan ??
    buildComponentSelectionPlan(options.prompt, options.sections, options.styleTags ?? [], seed);
  const tokens: StyleTokens = options.styleTokens ?? {
    typography: '',
    spacing: '',
    radius: '',
    colors: [],
  };

  const sections: RenderPlanSection[] = componentPlan.selections.map((selection) => {
    const styleVariables = applyStyleTokens(selection.componentId, tokens);

    return {
      sectionType: selection.sectionType,
      componentId: selection.componentId,
      source: selection.source as ComponentSource,
      layoutArchetype: selection.layoutArchetype,
      propsContract: selection.propsContract,
      styleTokens: tokens,
      styleVariables,
    };
  });

  const layoutUniquenessHash = hashString(
    JSON.stringify({
      seed,
      layoutArchetype: options.layoutArchetype ?? '',
      sections: sections.map((section) => ({
        sectionType: section.sectionType,
        componentId: section.componentId,
        layoutArchetype: section.layoutArchetype,
      })),
    }),
  ).toString(36);

  return {
    seed,
    layoutArchetype: options.layoutArchetype,
    layoutUniquenessHash,
    sections,
    componentPlan,
  };
}

export function buildSectionContractFromRenderPlan(renderPlan: RenderPlan): SectionContract | undefined {
  const order = renderPlan.sections.map((section) => section.sectionType);

  if (order.length === 0) {
    return undefined;
  }

  return {
    order,
    labels: SECTION_LABELS,
  };
}
