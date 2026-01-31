import type { ProviderInfo } from '~/types/model';
import type { ScreenshotAnalysis } from './enhancedPromptGenerator';

export interface ScreenshotAnalyzerInput {
  images: string[];
  model?: string;
  provider?: ProviderInfo;
}

export interface ScreenshotAnalysisResult {
  analysis: ScreenshotAnalysis | null;
  fallbackProvider?: string;
  fallbackModel?: string;
}

const MAX_IMAGES = 3;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const toStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter(isNonEmptyString).map((item) => item.trim()) : [];

const normalizeColors = (colors: string[]): string[] =>
  colors.filter((color) => /^#[0-9A-Fa-f]{6}$/.test(color));

const normalizeAnalysis = (raw: any): ScreenshotAnalysis | null => {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const layout = toStringArray(raw.layout);
  const colors = normalizeColors(toStringArray(raw.colors));
  const typography = isNonEmptyString(raw.typography) ? raw.typography.trim() : '';
  const components = toStringArray(raw.components);
  const animations = isNonEmptyString(raw.animations) ? raw.animations.trim() : '';
  const style = isNonEmptyString(raw.style) ? raw.style.trim() : '';

  if (!layout.length && !colors.length && !components.length && !typography && !style && !animations) {
    return null;
  }

  return {
    layout,
    colors,
    typography,
    components,
    animations,
    style,
  };
};

export async function analyzeScreenshots({
  images,
  model,
  provider,
}: ScreenshotAnalyzerInput): Promise<ScreenshotAnalysisResult> {
  const sanitizedImages = Array.isArray(images)
    ? images.filter(isNonEmptyString).slice(0, MAX_IMAGES)
    : [];

  if (sanitizedImages.length === 0) {
    return { analysis: null };
  }

  try {
    const response = await fetch('/api/screenshot-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        images: sanitizedImages,
        model,
        provider,
      }),
    });

    if (!response.ok) {
      return { analysis: null };
    }

    const payload = await response.json().catch(() => null);
    if (!payload) {
      return { analysis: null };
    }

    return {
      analysis: normalizeAnalysis(payload.analysis ?? payload),
      fallbackProvider: isNonEmptyString(payload.fallbackProvider) ? payload.fallbackProvider : undefined,
      fallbackModel: isNonEmptyString(payload.fallbackModel) ? payload.fallbackModel : undefined,
    };
  } catch (error) {
    console.warn('Screenshot analysis failed:', error);
    return { analysis: null };
  }
}
