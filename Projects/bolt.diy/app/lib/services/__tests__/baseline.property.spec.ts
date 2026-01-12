/**
 * Property tests for baseline system
 * Validates: Requirements 1.1, 1.2, 1.5
 *
 * Property 1: Baseline structural consistency
 * For any set of test prompts, running the baseline script SHALL produce
 * a valid JSON file where each result contains required fields with appropriate types.
 */
import { describe, expect, it } from 'vitest';
import * as fc from 'fast-check';

import {
  type BaselineRun,
  type BlockFlags,
  type ImageCounts,
  type PromptEntry,
  type RunLengths,
  extractBlockFlags,
  extractImageCounts,
  normalizeRun,
} from '../../../../scripts/baseline-utils';

// Arbitrary generators for property tests
const promptEntryArb = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }),
  prompt: fc.string({ minLength: 1, maxLength: 1000 }),
});

const colorsArb = fc.dictionary(
  fc.string({ minLength: 1, maxLength: 20 }),
  fc.stringMatching(/^#[0-9a-fA-F]{6}$/),
) as fc.Arbitrary<Record<string, string>>;

const imagesArb = fc.record({
  hero: fc.array(fc.webUrl(), { maxLength: 5 }),
  gallery: fc.array(fc.webUrl(), { maxLength: 10 }),
  products: fc.array(fc.webUrl(), { maxLength: 10 }),
  editorial: fc.array(fc.webUrl(), { maxLength: 5 }),
});

const sectionContractArb = fc.record({
  order: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 10 }),
  labels: fc.dictionary(
    fc.string({ minLength: 1, maxLength: 20 }),
    fc.string({ minLength: 1, maxLength: 50 }),
  ),
});

const enhanceResultArb = fc.record({
  enhancedPrompt: fc.string({ minLength: 10, maxLength: 5000 }),
  displayPrompt: fc.option(fc.string({ maxLength: 1000 }), { nil: undefined }),
  imagePrompt: fc.option(fc.string({ maxLength: 1000 }), { nil: undefined }),
  detectedTheme: fc.string({ minLength: 1, maxLength: 30 }),
  colors: colorsArb,
  images: fc.option(imagesArb, { nil: undefined }),
  sectionContract: fc.option(sectionContractArb, { nil: undefined }),
});

describe('Baseline Property Tests', () => {
  describe('Property 1: Baseline structural consistency', () => {
    it('normalizeRun produces valid BaselineRun structure', () => {
      fc.assert(
        fc.property(
          promptEntryArb,
          enhanceResultArb,
          fc.float({ min: 0, max: 10000, noNaN: true }),
          (entry, result, durationMs) => {
            const run = normalizeRun(entry, result, durationMs);

            // Required fields exist
            expect(run).toHaveProperty('id');
            expect(run).toHaveProperty('prompt');
            expect(run).toHaveProperty('detectedTheme');
            expect(run).toHaveProperty('colors');
            expect(run).toHaveProperty('imageCounts');
            expect(run).toHaveProperty('sectionOrder');
            expect(run).toHaveProperty('sectionCount');
            expect(run).toHaveProperty('blockFlags');
            expect(run).toHaveProperty('lengths');
            expect(run).toHaveProperty('durationMs');
            expect(run).toHaveProperty('enhancedPrompt');

            // Type checks
            expect(typeof run.id).toBe('string');
            expect(typeof run.prompt).toBe('string');
            expect(typeof run.detectedTheme).toBe('string');
            expect(typeof run.colors).toBe('object');
            expect(typeof run.imageCounts).toBe('object');
            expect(Array.isArray(run.sectionOrder)).toBe(true);
            expect(typeof run.sectionCount).toBe('number');
            expect(typeof run.blockFlags).toBe('object');
            expect(typeof run.lengths).toBe('object');
            expect(typeof run.durationMs).toBe('number');
            expect(typeof run.enhancedPrompt).toBe('string');

            // Consistency checks
            expect(run.id).toBe(entry.id);
            expect(run.prompt).toBe(entry.prompt);
            expect(run.detectedTheme).toBe(result.detectedTheme);
            expect(run.sectionCount).toBe(run.sectionOrder.length);
            expect(run.durationMs).toBeGreaterThanOrEqual(0);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('extractBlockFlags returns valid BlockFlags structure', () => {
      fc.assert(
        fc.property(fc.string({ maxLength: 10000 }), (enhancedPrompt) => {
          const flags = extractBlockFlags(enhancedPrompt);

          // All required boolean fields exist
          expect(typeof flags.hasCreativeDirection).toBe('boolean');
          expect(typeof flags.hasSectionBlueprint).toBe('boolean');
          expect(typeof flags.hasSectionDetails).toBe('boolean');
          expect(typeof flags.hasSectionGuardrails).toBe('boolean');
          expect(typeof flags.hasSectionContract).toBe('boolean');
          expect(typeof flags.hasSectionOrder).toBe('boolean');
          expect(typeof flags.hasSectionCount).toBe('boolean');
          expect(typeof flags.hasImageSuggestions).toBe('boolean');
          expect(typeof flags.hasRequirements).toBe('boolean');

          // Flags are consistent with content
          if (enhancedPrompt.includes('CREATIVE DIRECTION')) {
            expect(flags.hasCreativeDirection).toBe(true);
          }

          if (enhancedPrompt.includes('SECTION CONTRACT')) {
            expect(flags.hasSectionContract).toBe(true);
          }
        }),
        { numRuns: 100 },
      );
    });

    it('extractImageCounts returns valid ImageCounts structure', () => {
      fc.assert(
        fc.property(fc.option(imagesArb, { nil: undefined }), (images) => {
          const counts = extractImageCounts(images);

          // All required numeric fields exist
          expect(typeof counts.hero).toBe('number');
          expect(typeof counts.gallery).toBe('number');
          expect(typeof counts.products).toBe('number');
          expect(typeof counts.editorial).toBe('number');

          // Non-negative counts
          expect(counts.hero).toBeGreaterThanOrEqual(0);
          expect(counts.gallery).toBeGreaterThanOrEqual(0);
          expect(counts.products).toBeGreaterThanOrEqual(0);
          expect(counts.editorial).toBeGreaterThanOrEqual(0);

          // Counts match input arrays
          if (images) {
            expect(counts.hero).toBe(images.hero?.length ?? 0);
            expect(counts.gallery).toBe(images.gallery?.length ?? 0);
            expect(counts.products).toBe(images.products?.length ?? 0);
            expect(counts.editorial).toBe(images.editorial?.length ?? 0);
          } else {
            expect(counts.hero).toBe(0);
            expect(counts.gallery).toBe(0);
            expect(counts.products).toBe(0);
            expect(counts.editorial).toBe(0);
          }
        }),
        { numRuns: 100 },
      );
    });

    it('lengths are correctly calculated', () => {
      fc.assert(
        fc.property(
          promptEntryArb,
          enhanceResultArb,
          fc.float({ min: 0, max: 10000, noNaN: true }),
          (entry, result, durationMs) => {
            const run = normalizeRun(entry, result, durationMs);

            // Lengths match actual string lengths
            expect(run.lengths.enhancedPrompt).toBe(result.enhancedPrompt.length);
            expect(run.lengths.displayPrompt).toBe(result.displayPrompt?.length ?? 0);
            expect(run.lengths.imagePrompt).toBe(result.imagePrompt?.length ?? 0);
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
