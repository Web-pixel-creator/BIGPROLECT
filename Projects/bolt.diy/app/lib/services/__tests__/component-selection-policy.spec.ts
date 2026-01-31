import { describe, expect, it } from 'vitest';

import type { ComponentIndexEntry } from '../prompt-data/component-index';
import { scoreComponentCandidate, selectComponentCandidate } from '../component-selection-policy';

const makeEntry = (overrides: Partial<ComponentIndexEntry>): ComponentIndexEntry => ({
  id: 'entry',
  sectionType: 'hero',
  source: 'shadcn',
  propsContract: ['title'],
  visualTags: ['grid'],
  styleTags: ['minimal'],
  layoutArchetype: 'hero-grid',
  dependencies: [],
  ...overrides,
});

describe('component selection policy', () => {
  it('scores higher when keywords and style tags match', () => {
    const target = makeEntry({
      id: 'match',
      visualTags: ['bento', 'grid'],
      styleTags: ['modern', 'bold'],
      layoutArchetype: 'hero-bento',
    });
    const other = makeEntry({
      id: 'other',
      visualTags: ['split'],
      styleTags: ['minimal'],
      layoutArchetype: 'hero-split',
    });

    const context = {
      sectionType: 'hero' as const,
      promptKeywords: ['bento', 'grid'],
      layoutTags: ['bento'],
      styleTags: ['modern'],
    };

    const matchScore = scoreComponentCandidate(target, context);
    const otherScore = scoreComponentCandidate(other, context);

    expect(matchScore).toBeGreaterThan(otherScore);
  });

  it('applies recency penalty', () => {
    const entry = makeEntry({ id: 'recent', visualTags: ['grid'] });
    const context = {
      sectionType: 'hero' as const,
      promptKeywords: ['grid'],
    };

    const freshScore = scoreComponentCandidate(entry, context, {
      keywordMatch: 0.4,
      tagMatch: 0.3,
      styleCompatibility: 0.2,
      sectionAffinity: 0.1,
      recencyPenalty: 0.2,
    });
    const recentScore = scoreComponentCandidate(
      entry,
      { ...context, recentComponentIds: ['recent'] },
      {
        keywordMatch: 0.4,
        tagMatch: 0.3,
        styleCompatibility: 0.2,
        sectionAffinity: 0.1,
        recencyPenalty: 0.2,
      },
    );

    expect(recentScore).toBeLessThan(freshScore);
  });

  it('selects deterministically from top-k with seed', () => {
    const entries = [
      makeEntry({ id: 'a', visualTags: ['grid'], styleTags: ['modern'] }),
      makeEntry({ id: 'b', visualTags: ['grid'], styleTags: ['modern'] }),
      makeEntry({ id: 'c', visualTags: ['split'], styleTags: ['minimal'] }),
    ];
    const context = {
      sectionType: 'hero' as const,
      promptKeywords: ['grid'],
      styleTags: ['modern'],
    };

    const first = selectComponentCandidate(entries, context, { topK: 2, seed: 42 });
    const second = selectComponentCandidate(entries, context, { topK: 2, seed: 42 });

    expect(first.selected?.id).toBe(second.selected?.id);
    expect(first.topK.map((item) => item.entry.id)).toContain(first.selected?.id);
  });

  it('returns null when no section matches', () => {
    const entries = [makeEntry({ id: 'a', sectionType: 'features' })];
    const context = { sectionType: 'hero' as const, promptKeywords: ['grid'] };
    const result = selectComponentCandidate(entries, context, { topK: 2, seed: 7 });

    expect(result.selected).toBeNull();
    expect(result.ranked).toHaveLength(0);
  });
});
