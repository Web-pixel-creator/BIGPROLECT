import { createSeededRandom } from './prompt-data/seeded-random';
import { SECTION_SCORING_PRIORITY } from './prompt-data/section-priorities';
import type { SectionType } from './prompt-data/section-definitions';
import type { ComponentIndexEntry } from './prompt-data/component-index';

export type SelectionWeights = {
  keywordMatch: number;
  tagMatch: number;
  styleCompatibility: number;
  sectionAffinity: number;
  recencyPenalty: number;
};

export type SelectionContext = {
  sectionType: SectionType;
  promptKeywords?: string[];
  layoutTags?: string[];
  styleTags?: string[];
  recentComponentIds?: string[] | Set<string>;
  requiredTokens?: {
    typography?: boolean;
    spacing?: boolean;
    radius?: boolean;
    colors?: boolean;
  };
};

export type SelectionOptions = {
  topK?: number;
  seed?: number;
  weights?: Partial<SelectionWeights>;
};

export type ScoredCandidate = {
  entry: ComponentIndexEntry;
  score: number;
  recencyPenaltyApplied: boolean;
};

type CandidateScore = {
  score: number;
  recencyPenaltyApplied: boolean;
};

const DEFAULT_WEIGHTS: SelectionWeights = {
  keywordMatch: 0.4,
  tagMatch: 0.3,
  styleCompatibility: 0.2,
  sectionAffinity: 0.1,
  recencyPenalty: 0.15,
};

const MAX_SECTION_PRIORITY = Math.max(...Object.values(SECTION_SCORING_PRIORITY));
const ALLOWED_DEPENDENCIES = new Set(['react', 'framer-motion', 'lucide-react', 'clsx', 'tailwind-merge']);
const ALLOWED_DEP_PREFIXES = ['@radix-ui/'];

function normalizeTokens(tokens: string[] | undefined): string[] {
  if (!tokens || tokens.length === 0) {
    return [];
  }

  const normalized: string[] = [];

  for (const token of tokens) {
    if (!token) {
      continue;
    }

    const parts = token
      .toLowerCase()
      .split(/[\s/_-]+/)
      .map((part) => part.trim())
      .filter(Boolean);

    normalized.push(...parts);
  }

  return Array.from(new Set(normalized));
}

function overlapScore(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) {
    return 0;
  }

  const setB = new Set(b);
  let hits = 0;

  for (const token of a) {
    if (setB.has(token)) {
      hits += 1;
    }
  }

  return hits / Math.max(a.length, b.length);
}

function layoutTokens(entry: ComponentIndexEntry): string[] {
  return normalizeTokens([...entry.visualTags, entry.layoutArchetype]);
}

function styleTokens(entry: ComponentIndexEntry): string[] {
  return normalizeTokens(entry.styleTags);
}

function isRecent(entryId: string, recent: string[] | Set<string> | undefined): boolean {
  if (!recent) {
    return false;
  }

  if (Array.isArray(recent)) {
    return recent.includes(entryId);
  }

  return recent.has(entryId);
}

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

function isTokenCompatible(
  entry: ComponentIndexEntry,
  required: SelectionContext['requiredTokens'],
): boolean {
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

function scoreComponentCandidateDetailed(
  entry: ComponentIndexEntry,
  context: SelectionContext,
  weights: SelectionWeights = DEFAULT_WEIGHTS,
): CandidateScore {
  if (entry.sectionType !== context.sectionType) {
    return { score: 0, recencyPenaltyApplied: false };
  }
  if (!hasAllowedDependencies(entry)) {
    return { score: 0, recencyPenaltyApplied: false };
  }
  if (!isTokenCompatible(entry, context.requiredTokens)) {
    return { score: 0, recencyPenaltyApplied: false };
  }

  const keywordTokens = normalizeTokens(context.promptKeywords);
  const layoutHintTokens = normalizeTokens(context.layoutTags);
  const styleHintTokens = normalizeTokens(context.styleTags);

  const layoutScore = overlapScore(keywordTokens, layoutTokens(entry));
  const tagScore = overlapScore(layoutHintTokens, layoutTokens(entry));
  const styleScore = overlapScore(styleHintTokens, styleTokens(entry));

  const sectionPriority = SECTION_SCORING_PRIORITY[entry.sectionType] ?? 0;
  const sectionScore = MAX_SECTION_PRIORITY > 0 ? sectionPriority / MAX_SECTION_PRIORITY : 0;

  let score =
    layoutScore * weights.keywordMatch +
    tagScore * weights.tagMatch +
    styleScore * weights.styleCompatibility +
    sectionScore * weights.sectionAffinity;

  const recencyPenaltyApplied = isRecent(entry.id, context.recentComponentIds);

  if (recencyPenaltyApplied) {
    score -= weights.recencyPenalty;
  }

  return {
    score: Math.max(0, score),
    recencyPenaltyApplied,
  };
}

export function scoreComponentCandidate(
  entry: ComponentIndexEntry,
  context: SelectionContext,
  weights: SelectionWeights = DEFAULT_WEIGHTS,
): number {
  return scoreComponentCandidateDetailed(entry, context, weights).score;
}

export function rankComponentCandidates(
  entries: ComponentIndexEntry[],
  context: SelectionContext,
  weights: SelectionWeights = DEFAULT_WEIGHTS,
): ScoredCandidate[] {
  const scored: ScoredCandidate[] = [];

  for (const entry of entries) {
    const { score, recencyPenaltyApplied } = scoreComponentCandidateDetailed(entry, context, weights);
    if (score > 0) {
      scored.push({ entry, score, recencyPenaltyApplied });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

export function selectComponentCandidate(
  entries: ComponentIndexEntry[],
  context: SelectionContext,
  options: SelectionOptions = {},
): {
  selected: ComponentIndexEntry | null;
  ranked: ScoredCandidate[];
  topK: ScoredCandidate[];
  candidateCount: number;
  repeatPenaltyTriggered: boolean;
} {
  const weights: SelectionWeights = { ...DEFAULT_WEIGHTS, ...(options.weights ?? {}) };
  const ranked = rankComponentCandidates(entries, context, weights);
  const repeatPenaltyTriggered = ranked.some((candidate) => candidate.recencyPenaltyApplied);
  const candidateCount = ranked.length;

  if (ranked.length === 0) {
    return { selected: null, ranked, topK: [], candidateCount: 0, repeatPenaltyTriggered: false };
  }

  const topKCount = Math.max(1, options.topK ?? 4);
  const topK = ranked.slice(0, topKCount);
  const seed = options.seed ?? Date.now();
  const rng = createSeededRandom(seed);
  const pickIndex = Math.floor(rng() * topK.length);
  const selected = topK[pickIndex]?.entry ?? topK[0]?.entry ?? null;

  return { selected, ranked, topK, candidateCount, repeatPenaltyTriggered };
}
