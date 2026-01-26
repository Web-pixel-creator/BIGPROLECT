/**
 * E2E Integration Tests for Prompt Enhancer design quality + uniqueness
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { generateAndRankDesignVariants } from './promptEnhancer';
import { resetGlobalRng, setGlobalSeed } from './prompt-data';
import {
  getDesignTelemetrySummary,
  getRecentDesignEvents,
  resetTelemetry,
} from './pipelineTelemetry';

const originalFetch = (globalThis as { fetch?: typeof fetch }).fetch;

const fetchStub = async () =>
  ({
    ok: false,
    status: 503,
    statusText: 'test',
    json: async () => ({}),
  } as unknown as Response);

beforeEach(() => {
  setGlobalSeed(4242);
  resetTelemetry();
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

describe('Prompt Enhancer Design E2E', () => {
  it('records design quality telemetry for ranked variants', async () => {
    const prompt = 'Landing page for a boutique wellness studio with hero, benefits, testimonials, and booking.';
    const result = await generateAndRankDesignVariants(prompt, {
      variantCount: 3,
      variantSalt: 'e2e-telemetry',
    });

    expect(result.variants).toHaveLength(3);
    expect(result.selected).toBeDefined();

    const events = getRecentDesignEvents();
    expect(events).toHaveLength(3);
    expect(events.filter((event) => event.selected)).toHaveLength(1);
    for (const event of events) {
      expect(event.designQualityScore).toBeGreaterThan(0);
      expect(event.stylePackId.length).toBeGreaterThan(0);
      expect(event.layoutArchetype.length).toBeGreaterThan(0);
      expect(event.sectionCount).toBeGreaterThan(0);
    }

    const summary = getDesignTelemetrySummary();
    expect(summary.totalVariants).toBe(3);
    expect(summary.selectedVariantRate).toBeCloseTo(1 / 3);
    expect(summary.avgVariantCount).toBe(3);
  });

  it('keeps variant seeds stable for the same salt', async () => {
    const prompt = 'Landing page for an eco travel brand with immersive imagery and booking.';

    const first = await generateAndRankDesignVariants(prompt, {
      variantCount: 2,
      variantSalt: 'stable-salt',
    });
    const second = await generateAndRankDesignVariants(prompt, {
      variantCount: 2,
      variantSalt: 'stable-salt',
    });

    expect(first.variants.map((variant) => variant.variantSeed)).toEqual(
      second.variants.map((variant) => variant.variantSeed),
    );
    expect(first.variants.map((variant) => variant.layoutUniquenessHash)).toEqual(
      second.variants.map((variant) => variant.layoutUniquenessHash),
    );

    const third = await generateAndRankDesignVariants(prompt, {
      variantCount: 2,
      variantSalt: 'different-salt',
    });

    expect(third.variants[0].variantSeed).not.toBe(first.variants[0].variantSeed);
  });
});
