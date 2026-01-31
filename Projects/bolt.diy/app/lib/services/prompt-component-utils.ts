/**
 * Prompt Component Utilities
 * Functions for component matching and directives
 */

import {
  COMPONENT_SECTION_KEYWORDS,
} from './prompt-data';
import { rememberRecentComponent, getRecentComponentIds } from './prompt-variant-utils';
import { COMPONENT_INDEX } from './prompt-data/component-index';
import { selectComponentCandidate } from './component-selection-policy';
import { hashString } from './prompt-theme-utils';
import type { SectionType } from './prompt-data/section-definitions';

function extractPromptTokens(prompt: string): string[] {
  if (!prompt) {
    return [];
  }

  const tokens = prompt
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);

  return Array.from(new Set(tokens));
}

export type ComponentSelectionPlan = {
  planText: string;
  eligibleSections: number;
  matchedSections: number;
  fallbackCount: number;
  matchRate: number;
  fallbackRate: number;
  selections: Array<{
    sectionType: SectionType;
    componentId: string;
    source: string;
    layoutArchetype: string;
    propsContract: string[];
  }>;
};

/**
 * Build a component selection plan from the curated component index
 */
export function buildComponentSelectionPlan(
  prompt: string,
  mentionedSections: string[],
  styleTags: string[] = [],
  seed: number = Date.now(),
): ComponentSelectionPlan {
  if (!prompt || mentionedSections.length === 0) {
    return {
      planText: '',
      eligibleSections: 0,
      matchedSections: 0,
      fallbackCount: 0,
      matchRate: 0,
      fallbackRate: 0,
      selections: [],
    };
  }

  const sectionSet = new Set(COMPONENT_INDEX.map((entry) => entry.sectionType));
  const tokens = extractPromptTokens(prompt);
  const recentIds = getRecentComponentIds();
  const planLines: string[] = [];
  const uniqueSections = Array.from(new Set(mentionedSections));
  const eligibleSections = uniqueSections.filter((section) => sectionSet.has(section as SectionType));
  let matchedSections = 0;
  const selections: ComponentSelectionPlan['selections'] = [];

  for (const section of eligibleSections) {
    const context = {
      sectionType: section as SectionType,
      promptKeywords: tokens,
      layoutTags: COMPONENT_SECTION_KEYWORDS[section] ?? [],
      styleTags,
      recentComponentIds: recentIds,
      requiredTokens: {
        typography: true,
        spacing: true,
        radius: true,
        colors: true,
      },
    };
    const sectionSeed = hashString(`${seed}:${section}:${prompt}`);
    const { selected } = selectComponentCandidate(COMPONENT_INDEX, context, { topK: 4, seed: sectionSeed });

    if (!selected) {
      continue;
    }

    matchedSections += 1;
    selections.push({
      sectionType: selected.sectionType,
      componentId: selected.id,
      source: selected.source,
      layoutArchetype: selected.layoutArchetype,
      propsContract: selected.propsContract,
    });
    planLines.push(`- ${section}: ${selected.id} (${selected.source}, ${selected.layoutArchetype})`);
    rememberRecentComponent(selected.id);
  }

  const fallbackCount = eligibleSections.length - matchedSections;
  const matchRate = eligibleSections.length > 0 ? matchedSections / eligibleSections.length : 0;
  const fallbackRate = eligibleSections.length > 0 ? fallbackCount / eligibleSections.length : 0;
  const planText =
    planLines.length > 0 ? `\nCOMPONENT PLAN (use these component archetypes):\n${planLines.join('\n')}` : '';

  return {
    planText,
    eligibleSections: eligibleSections.length,
    matchedSections,
    fallbackCount,
    matchRate,
    fallbackRate,
    selections,
  };
}
