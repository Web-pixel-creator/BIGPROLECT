/**
 * Prompt Component Utilities
 * Functions for component matching and directives
 */

import { COMPONENT_SECTION_KEYWORDS, createSeededRandom } from './prompt-data';
import { rememberRecentComponent, getRecentComponentIds } from './prompt-variant-utils';
import { COMPONENT_INDEX, type ComponentIndexEntry } from './prompt-data/component-index';
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

type RequiredTokens = {
  typography?: boolean;
  spacing?: boolean;
  radius?: boolean;
  colors?: boolean;
};

const ALLOWED_DEPENDENCIES = new Set(['react', 'framer-motion', 'lucide-react', 'clsx', 'tailwind-merge']);
const ALLOWED_DEP_PREFIXES = ['@radix-ui/'];

function isDependencyAllowed(dep: string): boolean {
  if (!dep) {
    return true;
  }

  if (dep.startsWith('.') || dep.startsWith('@/')) {
    return true;
  }

  if (ALLOWED_DEPENDENCIES.has(dep)) {
    return true;
  }

  for (const prefix of ALLOWED_DEP_PREFIXES) {
    if (dep.startsWith(prefix)) {
      return true;
    }
  }

  return false;
}

function hasAllowedDependencies(entry: ComponentIndexEntry): boolean {
  if (!entry.dependencies || entry.dependencies.length === 0) {
    return true;
  }

  return entry.dependencies.every((dep) => isDependencyAllowed(dep));
}

function isTokenCompatible(entry: ComponentIndexEntry, required: RequiredTokens | undefined): boolean {
  if (!required) {
    return true;
  }

  const compatibility = entry.tokenCompatibility;
  if (!compatibility) {
    return true;
  }

  if (required.typography && compatibility.typography === false) {
    return false;
  }
  if (required.spacing && compatibility.spacing === false) {
    return false;
  }
  if (required.radius && compatibility.radius === false) {
    return false;
  }
  if (required.colors && compatibility.colors === false) {
    return false;
  }

  return true;
}

function pickFallbackComponent(
  sectionType: SectionType,
  requiredTokens: RequiredTokens | undefined,
  recentIds: string[],
  seed: number,
): ComponentIndexEntry | null {
  const candidates = COMPONENT_INDEX.filter((entry) => {
    if (entry.sectionType !== sectionType) {
      return false;
    }
    if (!hasAllowedDependencies(entry)) {
      return false;
    }
    if (!isTokenCompatible(entry, requiredTokens)) {
      return false;
    }
    return true;
  });

  if (candidates.length === 0) {
    return null;
  }

  const recentSet = new Set(recentIds.map((id) => id.toLowerCase()));
  const nonRecent = candidates.filter((entry) => !recentSet.has(entry.id.toLowerCase()));
  const pool = nonRecent.length > 0 ? nonRecent : candidates;
  const rng = createSeededRandom(seed);
  const pickIndex = Math.floor(rng() * pool.length);
  return pool[pickIndex] ?? pool[0] ?? null;
}

export type ComponentSelectionPlan = {
  planText: string;
  eligibleSections: number;
  matchedSections: number;
  fallbackCount: number;
  matchRate: number;
  fallbackRate: number;
  repeatPenaltyTriggered: boolean;
  avgCandidatesPerSection: number;
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
      repeatPenaltyTriggered: false,
      avgCandidatesPerSection: 0,
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
  let fallbackCount = 0;
  let totalCandidates = 0;
  let repeatPenaltyTriggered = false;
  const selections: ComponentSelectionPlan['selections'] = [];

  for (const section of eligibleSections) {
    const requiredTokens: RequiredTokens = {
      typography: true,
      spacing: true,
      radius: true,
      colors: true,
    };
    const context = {
      sectionType: section as SectionType,
      promptKeywords: tokens,
      layoutTags: COMPONENT_SECTION_KEYWORDS[section] ?? [],
      styleTags,
      recentComponentIds: recentIds,
      requiredTokens,
    };
    const sectionSeed = hashString(`${seed}:${section}:${prompt}`);
    const {
      selected,
      candidateCount,
      repeatPenaltyTriggered: sectionRepeatPenaltyTriggered,
    } = selectComponentCandidate(COMPONENT_INDEX, context, { topK: 4, seed: sectionSeed });
    totalCandidates += candidateCount;
    if (sectionRepeatPenaltyTriggered) {
      repeatPenaltyTriggered = true;
    }

    if (!selected) {
      const fallbackSeed = hashString(`${sectionSeed}:fallback`);
      const fallback = pickFallbackComponent(section as SectionType, requiredTokens, recentIds, fallbackSeed);
      if (!fallback) {
        continue;
      }

      fallbackCount += 1;
      matchedSections += 1;
      selections.push({
        sectionType: fallback.sectionType,
        componentId: fallback.id,
        source: fallback.source,
        layoutArchetype: fallback.layoutArchetype,
        propsContract: fallback.propsContract,
      });
      planLines.push(`- ${section}: ${fallback.id} (${fallback.source}, ${fallback.layoutArchetype}, fallback)`);
      rememberRecentComponent(fallback.id);
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

  const matchRate = eligibleSections.length > 0 ? matchedSections / eligibleSections.length : 0;
  const fallbackRate = eligibleSections.length > 0 ? fallbackCount / eligibleSections.length : 0;
  const avgCandidatesPerSection = eligibleSections.length > 0 ? totalCandidates / eligibleSections.length : 0;
  const planText =
    planLines.length > 0 ? `\nCOMPONENT PLAN (use these component archetypes):\n${planLines.join('\n')}` : '';

  return {
    planText,
    eligibleSections: eligibleSections.length,
    matchedSections,
    fallbackCount,
    matchRate,
    fallbackRate,
    repeatPenaltyTriggered,
    avgCandidatesPerSection,
    selections,
  };
}
