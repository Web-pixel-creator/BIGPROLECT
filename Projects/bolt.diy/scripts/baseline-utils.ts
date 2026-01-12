import { readFile } from 'node:fs/promises';

export type PromptEntry = {
  id: string;
  prompt: string;
};

export type BlockFlags = {
  hasCreativeDirection: boolean;
  hasSectionBlueprint: boolean;
  hasSectionDetails: boolean;
  hasSectionGuardrails: boolean;
  hasSectionContract: boolean;
  hasSectionOrder: boolean;
  hasSectionCount: boolean;
  hasImageSuggestions: boolean;
  hasRequirements: boolean;
};

export type ImageCounts = {
  hero: number;
  gallery: number;
  products: number;
  editorial: number;
  categories?: {
    seating: number;
    tables: number;
    storage: number;
  };
};

export type RunLengths = {
  enhancedPrompt: number;
  displayPrompt: number;
  imagePrompt: number;
};

export type BaselineRun = {
  id: string;
  prompt: string;
  detectedTheme: string;
  colors: Record<string, string>;
  imageCounts: ImageCounts;
  sectionOrder: string[];
  sectionCount: number;
  blockFlags: BlockFlags;
  lengths: RunLengths;
  durationMs: number;
  enhancedPrompt: string;
  displayPrompt?: string;
  imagePrompt?: string;
  sectionContract?: {
    order: string[];
    labels: Record<string, string>;
    imageSections?: string[];
    imageMap?: Record<string, string[]>;
    imageMinCounts?: Record<string, number>;
  };
};

export const DEFAULT_SEED = 1337;
export const DEFAULT_NOW = Date.parse('2024-01-01T00:00:00Z');

export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export function withDeterminism(seed: number, fixedNow: number): () => void {
  const originalRandom = Math.random;
  const originalNow = Date.now;

  Math.random = createSeededRandom(seed);
  Date.now = () => fixedNow;

  return () => {
    Math.random = originalRandom;
    Date.now = originalNow;
  };
}

export async function loadPrompts(filePath: string): Promise<PromptEntry[]> {
  const raw = await readFile(filePath, 'utf-8');
  const parsed = JSON.parse(raw) as PromptEntry[];

  if (!Array.isArray(parsed)) {
    throw new Error(`Expected prompt list array in ${filePath}`);
  }

  for (const entry of parsed) {
    if (!entry?.id || !entry?.prompt) {
      throw new Error(`Invalid prompt entry in ${filePath}`);
    }
  }

  return parsed;
}

export function extractBlockFlags(enhancedPrompt: string): BlockFlags {
  return {
    hasCreativeDirection: enhancedPrompt.includes('CREATIVE DIRECTION'),
    hasSectionBlueprint: enhancedPrompt.includes('SECTION BLUEPRINT'),
    hasSectionDetails: enhancedPrompt.includes('SECTION DETAILS'),
    hasSectionGuardrails: enhancedPrompt.includes('SECTION GUARDRAILS'),
    hasSectionContract: enhancedPrompt.includes('SECTION CONTRACT'),
    hasSectionOrder: enhancedPrompt.includes('SECTION ORDER'),
    hasSectionCount: enhancedPrompt.includes('SECTION COUNT'),
    hasImageSuggestions: enhancedPrompt.includes('IMAGE SUGGESTIONS'),
    hasRequirements: enhancedPrompt.includes('REQUIREMENTS'),
  };
}

export function extractImageCounts(images?: {
  hero?: string[];
  gallery?: string[];
  products?: string[];
  editorial?: string[];
  categories?: {
    seating?: string[];
    tables?: string[];
    storage?: string[];
  };
}): ImageCounts {
  const categories = images?.categories;

  return {
    hero: images?.hero?.length ?? 0,
    gallery: images?.gallery?.length ?? 0,
    products: images?.products?.length ?? 0,
    editorial: images?.editorial?.length ?? 0,
    categories: categories
      ? {
          seating: categories.seating?.length ?? 0,
          tables: categories.tables?.length ?? 0,
          storage: categories.storage?.length ?? 0,
        }
      : undefined,
  };
}

export function normalizeRun(
  entry: PromptEntry,
  result: {
    enhancedPrompt: string;
    displayPrompt?: string;
    imagePrompt?: string;
    detectedTheme: string;
    colors: Record<string, string>;
    images?: {
      hero?: string[];
      gallery?: string[];
      products?: string[];
      editorial?: string[];
      categories?: {
        seating?: string[];
        tables?: string[];
        storage?: string[];
      };
    };
    sectionContract?: {
      order: string[];
      labels: Record<string, string>;
      imageSections?: string[];
      imageMap?: Record<string, string[]>;
      imageMinCounts?: Record<string, number>;
    };
  },
  durationMs: number,
): BaselineRun {
  const sectionOrder = result.sectionContract?.order ?? [];

  return {
    id: entry.id,
    prompt: entry.prompt,
    detectedTheme: result.detectedTheme,
    colors: result.colors,
    imageCounts: extractImageCounts(result.images),
    sectionOrder,
    sectionCount: sectionOrder.length,
    blockFlags: extractBlockFlags(result.enhancedPrompt),
    lengths: {
      enhancedPrompt: result.enhancedPrompt.length,
      displayPrompt: result.displayPrompt?.length ?? 0,
      imagePrompt: result.imagePrompt?.length ?? 0,
    },
    durationMs,
    enhancedPrompt: result.enhancedPrompt,
    displayPrompt: result.displayPrompt,
    imagePrompt: result.imagePrompt,
    sectionContract: result.sectionContract,
  };
}

export function median(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function summarizeRuns(runs: BaselineRun[]) {
  const durations = runs.map((run) => run.durationMs);
  const lengths = runs.map((run) => run.lengths.enhancedPrompt);
  const themes = runs.reduce<Record<string, number>>((acc, run) => {
    acc[run.detectedTheme] = (acc[run.detectedTheme] ?? 0) + 1;
    return acc;
  }, {});

  return {
    promptCount: runs.length,
    durationMs: {
      median: median(durations),
      min: Math.min(...durations),
      max: Math.max(...durations),
    },
    enhancedPromptLength: {
      median: median(lengths),
      min: Math.min(...lengths),
      max: Math.max(...lengths),
    },
    themeCounts: themes,
  };
}
