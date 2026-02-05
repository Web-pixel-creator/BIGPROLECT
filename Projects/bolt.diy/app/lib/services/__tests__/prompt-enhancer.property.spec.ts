/**
 * Property tests for prompt enhancer invariants
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as fc from 'fast-check';

import { enhancePromptWithDesignSystem, selectUniqueVariantsWithRetries } from '../promptEnhancer';
import { resetGlobalRng, setGlobalSeed } from '../prompt-data';

const originalFetch = (globalThis as { fetch?: typeof fetch }).fetch;

const fetchStub = async () =>
  ({
    ok: false,
    status: 503,
    statusText: 'test',
    json: async () => ({}),
  } as unknown as Response);

beforeEach(() => {
  (globalThis as { fetch?: typeof fetch }).fetch = fetchStub;
});

afterEach(() => {
  resetGlobalRng();

  if (originalFetch) {
    (globalThis as { fetch?: typeof fetch }).fetch = originalFetch;
  } else {
    delete (globalThis as { fetch?: typeof fetch }).fetch;
  }
});

const themeLines = [
  'Landing page for a furniture brand.',
  'Landing page for a restaurant brand.',
  'Landing page for a finance brand.',
];

const sectionLines = [
  'Hero: bold headline and subhead.',
  'Features: list the top 3 benefits.',
  'Pricing: three tiers with CTAs.',
  'Gallery: product photos.',
  'Products: grid of featured items.',
  'Testimonials: short quotes and names.',
  'Contact: address and form.',
  'Team: highlight key staff.',
];

describe('Prompt Enhancer Property Tests', () => {
  it('keeps section contract invariants for generated prompts', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...themeLines),
        fc.subarray(sectionLines, { minLength: 1, maxLength: 5 }),
        async (themeLine, sections) => {
          setGlobalSeed(12345);

          const prompt = [themeLine, ...sections].join('\n');
          const result = await enhancePromptWithDesignSystem(prompt);
          const contract = result.sectionContract;

          expect(contract).toBeDefined();

          if (!contract) {
            return;
          }

          const order = contract.order ?? [];
          expect(order.length).toBeGreaterThan(0);
          expect(new Set(order).size).toBe(order.length);

          for (const section of order) {
            expect(contract.labels?.[section]).toBeDefined();
          }

          const imageSections = contract.imageSections ?? [];
          for (const section of imageSections) {
            expect(order).toContain(section);
          }

          const imageMap = contract.imageMap ?? {};
          for (const [section, images] of Object.entries(imageMap)) {
            expect(images.length).toBeGreaterThan(0);
            const minCount = contract.imageMinCounts?.[section];
            if (typeof minCount === 'number') {
              expect(minCount).toBeGreaterThan(0);
              expect(minCount).toBeLessThanOrEqual(images.length);
            }
          }
        },
      ),
      { numRuns: 30 },
    );
  });

  it('rerolls duplicate layout hashes until unique or retry cap', async () => {
    const maxRetries = 2;
    const attemptsPerVariant = maxRetries + 1;

    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.array(fc.string({ minLength: 1, maxLength: 8 }), {
            minLength: attemptsPerVariant,
            maxLength: attemptsPerVariant,
          }),
          { minLength: 1, maxLength: 5 },
        ),
        async (hashAttempts) => {
          const selected = await selectUniqueVariantsWithRetries({
            variantCount: hashAttempts.length,
            baseVariantSalt: 'property-reroll-seed',
            maxRetries,
            buildCandidate: async (variantIndex, attempt, variantSalt) => ({
              layoutUniquenessHash: hashAttempts[variantIndex]?.[attempt] ?? 'unknown',
              variantIndex,
              attempt,
              variantSalt,
            }),
          });

          const expectedAttempts: number[] = [];
          const seen = new Set<string>();

          for (let variantIndex = 0; variantIndex < hashAttempts.length; variantIndex += 1) {
            const attempts = hashAttempts[variantIndex] ?? [];
            let chosenAttempt = maxRetries;

            for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
              const hash = attempts[attempt] ?? 'unknown';

              if (!seen.has(hash) || attempt === maxRetries) {
                chosenAttempt = attempt;
                seen.add(hash);
                break;
              }
            }

            expectedAttempts.push(chosenAttempt);
          }

          expect(selected).toHaveLength(hashAttempts.length);

          selected.forEach((variant, variantIndex) => {
            const expectedAttempt = expectedAttempts[variantIndex];
            const expectedHash = hashAttempts[variantIndex]?.[expectedAttempt] ?? 'unknown';

            expect(variant.variantIndex).toBe(variantIndex);
            expect(variant.attempt).toBe(expectedAttempt);
            expect(variant.layoutUniquenessHash).toBe(expectedHash);
            expect(variant.attempt).toBeLessThanOrEqual(maxRetries);
          });
        },
      ),
      { numRuns: 60 },
    );
  });
});
