import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import path from 'node:path';

import { enhancePromptWithDesignSystem } from '../promptEnhancer';
import { resetGlobalRng, setGlobalSeed } from '../prompt-data';
import {
  DEFAULT_NOW,
  DEFAULT_SEED,
  type PromptEntry,
  loadPrompts,
  withDeterminism,
} from '../../../../scripts/baseline-utils';

const GOLDEN_IDS = [
  'beauty-salon-en',
  'electronics-ru',
  'furniture-en',
  'furniture-ru',
  'vinyl-en',
  'beauty-en',
  'photography-en',
  'restaurant-en',
  'saas-en',
  'travel-en',
  'medical-ru',
  'education-en',
  'realestate-ru',
] as const;

const MIN_GOLDEN_MATCH_RATE = 0.85;

let prompts: PromptEntry[] = [];
let restoreDeterminism: (() => void) | null = null;
const originalFetch = (globalThis as { fetch?: typeof fetch }).fetch;

beforeAll(async () => {
  const promptsPath = path.join(process.cwd(), 'scripts', 'baseline-prompts.json');
  prompts = await loadPrompts(promptsPath);
});

beforeEach(() => {
  setGlobalSeed(DEFAULT_SEED);
  restoreDeterminism = withDeterminism(DEFAULT_SEED, DEFAULT_NOW);
  (globalThis as { fetch?: typeof fetch }).fetch = async () => {
    throw new Error('test_fetch_disabled');
  };
});

afterEach(() => {
  resetGlobalRng();
  restoreDeterminism?.();
  restoreDeterminism = null;

  if (originalFetch) {
    (globalThis as { fetch?: typeof fetch }).fetch = originalFetch;
  } else {
    delete (globalThis as { fetch?: typeof fetch }).fetch;
  }
});

describe('Golden Set Regression', () => {
  it('maintains design quality and component match rates', async () => {
    expect(GOLDEN_IDS.length).toBeGreaterThanOrEqual(10);

    const targets = prompts.filter((entry) => GOLDEN_IDS.includes(entry.id as (typeof GOLDEN_IDS)[number]));
    expect(targets).toHaveLength(GOLDEN_IDS.length);

    for (const entry of targets) {
      const result = await enhancePromptWithDesignSystem(entry.prompt);

      const matchRate = result.componentPlan?.matchRate ?? 0;
      const eligibleSections = result.componentPlan?.eligibleSections ?? 0;
      const matchedSections = result.componentPlan?.matchedSections ?? 0;

      expect(result.designQualityScore).toBeGreaterThanOrEqual(70);
      if (eligibleSections === 0) {
        throw new Error(`no eligible component sections for ${entry.id}`);
      }
      if (matchRate < MIN_GOLDEN_MATCH_RATE) {
        throw new Error(
          `component match rate too low for ${entry.id}: ${matchRate.toFixed(2)} ` +
            `(threshold=${MIN_GOLDEN_MATCH_RATE.toFixed(2)}, eligible=${eligibleSections}, matched=${matchedSections})`,
        );
      }
      expect(result.renderPlan?.sections.length ?? 0).toBeGreaterThan(0);
    }
  });
});
