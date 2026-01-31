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
};

export type SelectionOptions = {
  topK?: number;
  seed?: number;
  weights?: Partial<SelectionWeights>;
};

export type ScoredCandidate = {
  entry: ComponentIndexEntry;
  score: number;
};

const DEFAULT_WEIGHTS: SelectionWeights = {
  keywordMatch: 0.4,
  tagMatch: 0.3,
  styleCompatibility: 0.2,
  sectionAffinity: 0.1,
  recencyPenalty: 0.15,
};

const MAX_SECTION_PRIORITY = Math.max(...Object.values(SECTION_SCORING_PRIORITY));

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

export function scoreComponentCandidate(
  entry: ComponentIndexEntry,
  context: SelectionContext,
  weights: SelectionWeights = DEFAULT_WEIGHTS,
): number {
  if (entry.sectionType !== context.sectionType) {
    return 0;
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

  if (isRecent(entry.id, context.recentComponentIds)) {
    score -= weights.recencyPenalty;
  }

  return Math.max(0, score);
}

export function rankComponentCandidates(
  entries: ComponentIndexEntry[],
  context: SelectionContext,
  weights: SelectionWeights = DEFAULT_WEIGHTS,
): ScoredCandidate[] {
  const scored: ScoredCandidate[] = [];

  for (const entry of entries) {
    const score = scoreComponentCandidate(entry, context, weights);
    if (score > 0) {
      scored.push({ entry, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

export function selectComponentCandidate(
  entries: ComponentIndexEntry[],
  context: SelectionContext,
  options: SelectionOptions = {},
): { selected: ComponentIndexEntry | null; ranked: ScoredCandidate[]; topK: ScoredCandidate[] } {
  const weights: SelectionWeights = { ...DEFAULT_WEIGHTS, ...(options.weights ?? {}) };
  const ranked = rankComponentCandidates(entries, context, weights);

  if (ranked.length === 0) {
    return { selected: null, ranked, topK: [] };
  }

  const topKCount = Math.max(1, options.topK ?? 4);
  const topK = ranked.slice(0, topKCount);
  const seed = options.seed ?? Date.now();
  const rng = createSeededRandom(seed);
  const pickIndex = Math.floor(rng() * topK.length);
  const selected = topK[pickIndex]?.entry ?? topK[0]?.entry ?? null;

  return { selected, ranked, topK };
}
