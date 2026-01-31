/**
 * Property tests for prompt-data modules
 * Validates: Requirements 5.7, 5.8
 *
 * Property 1: Theme keywords consistency
 * Property 2: Color mappings validity
 * Property 3: Image queries validity
 * Property 4: Prompt hints validity
 * Property 5: Seeded RNG determinism
 */
import { describe, expect, it } from 'vitest';
import * as fc from 'fast-check';

import {
  THEME_KEYWORDS,
  THEME_KEYWORDS_RU,
  getMergedKeywords,
  COLOR_WORDS_TO_HEX,
  RU_COLOR_WORDS,
  getMergedColors,
  THEME_PALETTES,
  THEME_IMAGE_QUERIES,
  IMAGE_SIZES,
  MAX_IMAGE_COUNTS,
  IMAGE_KEYWORDS,
  LAYOUT_KEYWORDS,
  NAVIGATION_SIGNALS,
  SECTION_LAYOUTS,
  SECTION_LABELS,
  createSeededRandom,
  setGlobalSeed,
  resetGlobalRng,
  getGlobalRng,
  randomInt,
  pickRandom,
  shuffleArray,
  randomSeedString,
  randomImageSeed,
} from '../prompt-data';

describe('Prompt Data Property Tests', () => {
  describe('Property 1: Theme keywords consistency', () => {
    it('all themes have non-empty keyword arrays', () => {
      for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
        expect(Array.isArray(keywords), `${theme} should have array`).toBe(true);
        expect(keywords.length, `${theme} should have keywords`).toBeGreaterThan(0);
      }
    });

    it('all RU themes exist in EN themes', () => {
      for (const theme of Object.keys(THEME_KEYWORDS_RU)) {
        expect(THEME_KEYWORDS).toHaveProperty(theme);
      }
    });

    it('getMergedKeywords returns combined EN+RU keywords', () => {
      const merged = getMergedKeywords();

      for (const [theme, enKeywords] of Object.entries(THEME_KEYWORDS)) {
        expect(merged).toHaveProperty(theme);
        expect(merged[theme].length).toBeGreaterThanOrEqual(enKeywords.length);
      }

      // Check RU keywords are included
      for (const [theme, ruKeywords] of Object.entries(THEME_KEYWORDS_RU)) {
        for (const keyword of ruKeywords) {
          expect(merged[theme]).toContain(keyword);
        }
      }
    });

    it('keywords are non-empty strings', () => {
      const merged = getMergedKeywords();

      for (const keywords of Object.values(merged)) {
        for (const keyword of keywords) {
          expect(typeof keyword).toBe('string');
          expect(keyword.trim().length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Property 2: Color mappings validity', () => {
    it('all colors have valid hex format', () => {
      const hexPattern = /^#[0-9a-fA-F]{6}$/;

      for (const [name, def] of Object.entries(COLOR_WORDS_TO_HEX)) {
        expect(hexPattern.test(def.hex), `${name} hex invalid: ${def.hex}`).toBe(true);
        expect(['dark', 'light', 'accent']).toContain(def.type);
      }

      for (const [name, def] of Object.entries(RU_COLOR_WORDS)) {
        expect(hexPattern.test(def.hex), `${name} hex invalid: ${def.hex}`).toBe(true);
        expect(['dark', 'light', 'accent']).toContain(def.type);
      }
    });

    it('getMergedColors includes both EN and RU colors', () => {
      const merged = getMergedColors();

      for (const key of Object.keys(COLOR_WORDS_TO_HEX)) {
        expect(merged).toHaveProperty(key);
      }

      for (const key of Object.keys(RU_COLOR_WORDS)) {
        expect(merged).toHaveProperty(key);
      }
    });

    it('theme palettes have required fields', () => {
      const requiredFields = ['dark', 'light', 'accent', 'accentName', 'textOnDark', 'textOnLight'];
      const hexPattern = /^#[0-9a-fA-F]{6}$/;

      for (const [theme, palette] of Object.entries(THEME_PALETTES)) {
        for (const field of requiredFields) {
          expect(palette, `${theme} missing ${field}`).toHaveProperty(field);
        }

        expect(hexPattern.test(palette.dark), `${theme}.dark invalid`).toBe(true);
        expect(hexPattern.test(palette.light), `${theme}.light invalid`).toBe(true);
        expect(hexPattern.test(palette.accent), `${theme}.accent invalid`).toBe(true);
      }
    });
  });

  describe('Property 3: Image queries validity', () => {
    it('all themes have hero and gallery queries', () => {
      for (const [theme, queries] of Object.entries(THEME_IMAGE_QUERIES)) {
        expect(Array.isArray(queries.hero), `${theme} missing hero`).toBe(true);
        expect(queries.hero.length, `${theme} hero empty`).toBeGreaterThan(0);
        expect(Array.isArray(queries.gallery), `${theme} missing gallery`).toBe(true);
        expect(queries.gallery.length, `${theme} gallery empty`).toBeGreaterThan(0);
      }
    });

    it('IMAGE_SIZES has valid dimensions', () => {
      const sizePattern = /^\d+x\d+$/;

      for (const [key, size] of Object.entries(IMAGE_SIZES)) {
        expect(sizePattern.test(size), `${key} size invalid: ${size}`).toBe(true);
      }
    });

    it('MAX_IMAGE_COUNTS are positive integers', () => {
      for (const [key, count] of Object.entries(MAX_IMAGE_COUNTS)) {
        expect(Number.isInteger(count), `${key} not integer`).toBe(true);
        expect(count, `${key} not positive`).toBeGreaterThan(0);
      }
    });
  });

  describe('Property 4: Prompt hints validity', () => {
    it('image keywords are non-empty strings', () => {
      for (const keyword of IMAGE_KEYWORDS) {
        expect(typeof keyword).toBe('string');
        expect(keyword.trim().length).toBeGreaterThan(0);
      }
    });

    it('layout keywords are non-empty strings', () => {
      for (const keyword of LAYOUT_KEYWORDS) {
        expect(typeof keyword).toBe('string');
        expect(keyword.trim().length).toBeGreaterThan(0);
      }
    });

    it('navigation signals are non-empty strings', () => {
      for (const keyword of NAVIGATION_SIGNALS) {
        expect(typeof keyword).toBe('string');
        expect(keyword.trim().length).toBeGreaterThan(0);
      }
    });

    it('section layouts have labels', () => {
      for (const key of Object.keys(SECTION_LAYOUTS)) {
        expect(SECTION_LABELS).toHaveProperty(key);
        expect(SECTION_LAYOUTS[key]?.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Property 5: Seeded RNG determinism', () => {
    it('same seed produces same sequence', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 0xffffffff }), (seed) => {
          const rng1 = createSeededRandom(seed);
          const rng2 = createSeededRandom(seed);

          const seq1 = Array.from({ length: 10 }, () => rng1());
          const seq2 = Array.from({ length: 10 }, () => rng2());

          expect(seq1).toEqual(seq2);
        }),
        { numRuns: 50 },
      );
    });

    it('different seeds produce different sequences', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 0xfffffffe }),
          fc.integer({ min: 1, max: 0xffffffff }),
          (seed1, offset) => {
            const seed2 = (seed1 + offset) >>> 0;
            const rng1 = createSeededRandom(seed1);
            const rng2 = createSeededRandom(seed2);

            const seq1 = Array.from({ length: 5 }, () => rng1());
            const seq2 = Array.from({ length: 5 }, () => rng2());

            // Very unlikely to be equal for different seeds
            expect(seq1).not.toEqual(seq2);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('values are in range [0, 1)', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 0xffffffff }), (seed) => {
          const rng = createSeededRandom(seed);

          for (let i = 0; i < 100; i += 1) {
            const value = rng();
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(1);
          }
        }),
        { numRuns: 20 },
      );
    });

    it('global RNG can be seeded and reset', () => {
      setGlobalSeed(12345);
      const val1 = getGlobalRng()();
      
      setGlobalSeed(12345);
      const val2 = getGlobalRng()();
      
      expect(val1).toBe(val2);
      
      resetGlobalRng();
      // After reset, should use Math.random (non-deterministic)
      expect(getGlobalRng()).toBe(Math.random);
    });

    it('randomInt returns values in range', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 1000 }),
          fc.integer({ min: 0, max: 0xffffffff }),
          (max, seed) => {
            const rng = createSeededRandom(seed);

            for (let i = 0; i < 50; i += 1) {
              const value = randomInt(max, rng);
              expect(value).toBeGreaterThanOrEqual(0);
              expect(value).toBeLessThan(max);
              expect(Number.isInteger(value)).toBe(true);
            }
          },
        ),
        { numRuns: 20 },
      );
    });

    it('pickRandom returns element from array', () => {
      fc.assert(
        fc.property(
          fc.array(fc.anything(), { minLength: 1, maxLength: 100 }),
          fc.integer({ min: 0, max: 0xffffffff }),
          (arr, seed) => {
            const rng = createSeededRandom(seed);
            const picked = pickRandom(arr, rng);
            expect(arr.some((value) => Object.is(value, picked))).toBe(true);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('shuffleArray preserves elements', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer(), { minLength: 0, maxLength: 50 }),
          fc.integer({ min: 0, max: 0xffffffff }),
          (arr, seed) => {
            const rng = createSeededRandom(seed);
            const shuffled = shuffleArray(arr, rng);

            expect(shuffled.length).toBe(arr.length);
            expect([...shuffled].sort((a, b) => a - b)).toEqual([...arr].sort((a, b) => a - b));
          },
        ),
        { numRuns: 50 },
      );
    });

    it('shuffleArray is deterministic with same seed', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer(), { minLength: 1, maxLength: 20 }),
          fc.integer({ min: 0, max: 0xffffffff }),
          (arr, seed) => {
            const rng1 = createSeededRandom(seed);
            const rng2 = createSeededRandom(seed);

            const shuffled1 = shuffleArray(arr, rng1);
            const shuffled2 = shuffleArray(arr, rng2);

            expect(shuffled1).toEqual(shuffled2);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('randomSeedString returns string of correct length', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 20 }),
          fc.integer({ min: 0, max: 0xffffffff }),
          (length, seed) => {
            const rng = createSeededRandom(seed);
            const str = randomSeedString(length, rng);

            expect(typeof str).toBe('string');
            expect(str.length).toBe(length);
            expect(/^[0-9a-z]+$/.test(str)).toBe(true);
          },
        ),
        { numRuns: 50 },
      );
    });
  });
});
