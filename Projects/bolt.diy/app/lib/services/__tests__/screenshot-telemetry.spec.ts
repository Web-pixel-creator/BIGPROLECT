import { describe, expect, it } from 'vitest';

import { emitScreenshotAnalysisEvent, getScreenshotTelemetrySummary, resetTelemetry } from '../pipelineTelemetry';

describe('screenshot telemetry', () => {
  it('tracks fallback usage and summary stats', () => {
    resetTelemetry();

    emitScreenshotAnalysisEvent({
      success: true,
      usedFallback: false,
      imageCount: 2,
      provider: 'OpenAI',
      model: 'gpt-4o',
    });

    emitScreenshotAnalysisEvent({
      success: true,
      usedFallback: true,
      imageCount: 3,
      provider: 'OpenRouter',
      model: 'anthropic/claude-3.5-sonnet',
      fallbackProvider: 'OpenAI',
      fallbackModel: 'gpt-4o',
    });

    emitScreenshotAnalysisEvent({
      success: false,
      usedFallback: false,
      imageCount: 1,
      provider: 'Google',
      model: 'gemini-2.0-flash',
    });

    const summary = getScreenshotTelemetrySummary();

    expect(summary.totalRuns).toBe(3);
    expect(summary.successRate).toBeCloseTo(2 / 3, 5);
    expect(summary.fallbackRate).toBeCloseTo(1 / 3, 5);
    expect(summary.avgImageCount).toBeCloseTo((2 + 3 + 1) / 3, 5);
    expect(summary.topFallbackProviders[0]?.id).toBe('OpenAI');
    expect(summary.topFallbackModels[0]?.id).toBe('gpt-4o');
  });
});
