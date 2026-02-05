import { describe, expect, it } from 'vitest';

import { EnhancedPromptGenerator } from '../enhancedPromptGenerator';
import { getDesignTelemetrySummary, resetTelemetry } from '../pipelineTelemetry';

describe('EnhancedPromptGenerator', () => {
  it('includes a component plan in the generated prompt', () => {
    const generator = new EnhancedPromptGenerator(12345);
    const result = generator.generate({
      type: 'landing',
      theme: 'Modern SaaS',
      colors: [],
      style: 'modern',
      seed: 12345,
    });

    expect(result.prompt).toContain('COMPONENT PLAN');
  });

  it('emits design telemetry for brief generation', () => {
    resetTelemetry();

    const generator = new EnhancedPromptGenerator(12345);
    const result = generator.generate({
      type: 'landing',
      theme: 'Modern SaaS',
      colors: [],
      style: 'modern',
      seed: 12345,
    });

    const summary = getDesignTelemetrySummary();

    expect(summary.totalVariants).toBe(1);
    expect(summary.avgComponentMatchRate).toBeCloseTo(result.renderPlan.componentPlan.matchRate, 5);
  });
});
