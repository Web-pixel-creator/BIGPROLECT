import { execSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  DEFAULT_NOW,
  DEFAULT_SEED,
  loadPrompts,
  median,
  normalizeRun,
  withDeterminism,
} from './baseline-utils';

type BaselinePayload = {
  meta?: Record<string, unknown>;
  runs?: Array<ReturnType<typeof normalizeRun>>;
};

type MetricsPayload = {
  meta?: Record<string, unknown>;
  summary?: Record<string, unknown>;
  coldImportTimeMs?: number;
  bundleSizeBytes?: number;
};

// Thresholds for warnings
const COLD_IMPORT_RELATIVE_THRESHOLD = 0.15; // +15%
const coldImportAbsEnv = Number.parseFloat(process.env.BASELINE_COLD_IMPORT_ABS ?? '');
const COLD_IMPORT_ABSOLUTE_THRESHOLD = Number.isFinite(coldImportAbsEnv) ? coldImportAbsEnv : 250; // +250ms
const BUNDLE_SIZE_THRESHOLD = 0.05; // +5%
const SECTIONS_COUNT_ERROR_THRESHOLD = 0.5; // >50% drift is ERROR
const OUTPUT_LENGTH_WARNING_THRESHOLD = 0.3; // >30% drift is WARNING
const COLD_IMPORT_RUNS = 5;

const args = new Map<string, string>();

for (let i = 2; i < process.argv.length; i += 1) {
  const key = process.argv[i];
  const value = process.argv[i + 1];

  if (key?.startsWith('--') && value && !value.startsWith('--')) {
    args.set(key, value);
    i += 1;
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROMPT_ENHANCER_PATH = path.join(__dirname, '..', 'app', 'lib', 'services', 'promptEnhancer.ts');
const promptsPath = args.get('--prompts') ?? path.join(__dirname, 'baseline-prompts.json');
const baselinePath = args.get('--baseline') ?? path.join(__dirname, 'baseline-results.json');
const metricsPath = args.get('--metrics') ?? path.join(__dirname, 'baseline-metrics.json');

const seedEnv = Number.parseInt(process.env.BASELINE_SEED ?? '', 10);
const nowEnv = Number.parseInt(process.env.BASELINE_NOW ?? '', 10);
const seed = Number.isFinite(seedEnv) ? seedEnv : DEFAULT_SEED;
const fixedNow = Number.isFinite(nowEnv) ? nowEnv : DEFAULT_NOW;

const lengthRatioEnv = Number.parseFloat(process.env.BASELINE_LENGTH_RATIO ?? '');
const lengthAbsEnv = Number.parseFloat(process.env.BASELINE_LENGTH_ABS ?? '');
const lengthRatio = Number.isFinite(lengthRatioEnv) ? lengthRatioEnv : OUTPUT_LENGTH_WARNING_THRESHOLD;
const lengthAbs = Number.isFinite(lengthAbsEnv) ? lengthAbsEnv : 0;

const baselineRaw = await readFile(baselinePath, 'utf-8');
const baselineParsed = JSON.parse(baselineRaw) as BaselinePayload | Array<ReturnType<typeof normalizeRun>>;
const baselineRuns = Array.isArray(baselineParsed) ? baselineParsed : (baselineParsed.runs ?? []);

// Load baseline metrics if available
let baselineMetrics: MetricsPayload | null = null;

try {
  const metricsRaw = await readFile(metricsPath, 'utf-8');
  baselineMetrics = JSON.parse(metricsRaw) as MetricsPayload;
} catch {
  // Metrics file may not exist for older baselines
}

const baselineMap = new Map(baselineRuns.map((run) => [run.id, run]));
const prompts = await loadPrompts(promptsPath);

const restoreDeterminism = withDeterminism(seed, fixedNow);
const originalFetch = globalThis.fetch;

globalThis.fetch = async () => {
  throw new Error('baseline fetch disabled');
};

const { enhancePromptWithDesignSystem } = await import('../app/lib/services/promptEnhancer.js');

// Separate errors (exit 1) from warnings (exit 0)
const errors: string[] = [];
const warnings: string[] = [];

const arraysEqual = (a: string[], b: string[]) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

const shallowEqual = (a: Record<string, unknown>, b: Record<string, unknown>) => {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();

  if (!arraysEqual(aKeys, bKeys)) {
    return false;
  }

  return aKeys.every((key) => a[key] === b[key]);
};

const imageCountsEqual = (
  current: { hero: number; gallery: number; products: number; editorial: number; categories?: Record<string, number> },
  baseline: { hero: number; gallery: number; products: number; editorial: number; categories?: Record<string, number> },
) => {
  if (
    current.hero !== baseline.hero ||
    current.gallery !== baseline.gallery ||
    current.products !== baseline.products ||
    current.editorial !== baseline.editorial
  ) {
    return false;
  }

  if (!current.categories && !baseline.categories) {
    return true;
  }

  if (!current.categories || !baseline.categories) {
    return false;
  }

  return shallowEqual(current.categories, baseline.categories);
};

const compareLengths = (label: string, current: number, baseline: number, id: string) => {
  // Skip comparison if baseline is 0
  if (baseline === 0) {
    return;
  }

  const allowed = Math.max(lengthAbs, baseline * lengthRatio);

  if (Math.abs(current - baseline) > allowed) {
    warnings.push(
      `[${id}] ${label} length drifted from ${baseline} to ${current} (allowed ${Math.round(allowed)})`,
    );
  }
};

const compareSectionsCount = (current: number, baseline: number, id: string) => {
  // Edge case: if baseline=0 and current>0, it's a warning (new sections added)
  if (baseline === 0 && current > 0) {
    warnings.push(`[${id}] sections count changed from 0 to ${current} (new sections added)`);
    return;
  }

  // Skip if both are 0
  if (baseline === 0 && current === 0) {
    return;
  }

  const drift = Math.abs(current - baseline) / baseline;

  if (drift > SECTIONS_COUNT_ERROR_THRESHOLD) {
    errors.push(
      `[${id}] sections count drifted >50% from ${baseline} to ${current} (${(drift * 100).toFixed(1)}%)`,
    );
  }
};

const checkRequiredKeys = (result: { colors?: Record<string, string>; images?: unknown }, id: string) => {
  // Check for palette (colors object with at least one key)
  const hasPalette = !!result.colors && Object.keys(result.colors).length > 0;

  if (!hasPalette) {
    errors.push(`[${id}] missing required key: palette (colors)`);
  }

  // Check for images object presence
  const hasImages = typeof result.images === 'object' && result.images !== null;

  if (!hasImages) {
    errors.push(`[${id}] missing required key: images`);
  }
};

const measureColdImport = (runs: number = COLD_IMPORT_RUNS): number => {
  const times: number[] = [];
  const promptEnhancerUrl = pathToFileURL(PROMPT_ENHANCER_PATH).href;
  const measureScript = [
    'const start = performance.now();',
    `import('${promptEnhancerUrl}')`,
    '.then(() => {',
    '  const end = performance.now();',
    '  console.log(end - start);',
    '})',
    '.catch((err) => {',
    '  console.error(err);',
    '  process.exit(1);',
    '});',
  ].join(' ');
  const nodePath = process.execPath.includes(' ') ? `"${process.execPath}"` : process.execPath;

  for (let i = 0; i < runs; i += 1) {
    try {
      const result = execSync(`${nodePath} --import tsx --input-type=module -e "${measureScript}"`, {
        encoding: 'utf-8',
        cwd: path.join(__dirname, '..'),
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 30000,
      });
      const lines = result.trim().split('\n');
      const lastLine = lines[lines.length - 1];
      const time = parseFloat(lastLine);

      if (Number.isFinite(time) && time > 0) {
        times.push(time);
      }
    } catch {
      // Skip failed runs
    }
  }

  return times.length > 0 ? median(times) : 0;
};

const getBundleSize = (): number => {
  try {
    return statSync(PROMPT_ENHANCER_PATH).size;
  } catch {
    return 0;
  }
};

for (const entry of prompts) {
  const baselineRun = baselineMap.get(entry.id);

  if (!baselineRun) {
    errors.push(`[${entry.id}] missing baseline entry`);
    continue;
  }

  const start = performance.now();
  const result = await enhancePromptWithDesignSystem(entry.prompt);
  const durationMs = performance.now() - start;
  const currentRun = normalizeRun(entry, result, durationMs);

  // ERROR: theme mismatch
  if (currentRun.detectedTheme !== baselineRun.detectedTheme) {
    errors.push(
      `[${entry.id}] detectedTheme changed from ${baselineRun.detectedTheme} to ${currentRun.detectedTheme}`,
    );
  }

  // Check required keys
  checkRequiredKeys(result, entry.id);

  // ERROR: sections count drift >50%
  compareSectionsCount(currentRun.sectionCount, baselineRun.sectionCount, entry.id);

  // WARNING: section order changed
  if (!arraysEqual(currentRun.sectionOrder, baselineRun.sectionOrder)) {
    warnings.push(`[${entry.id}] section order changed`);
  }

  // WARNING: block flags changed
  if (!shallowEqual(currentRun.blockFlags, baselineRun.blockFlags)) {
    warnings.push(`[${entry.id}] block presence changed`);
  }

  // WARNING: colors changed
  if (!shallowEqual(currentRun.colors, baselineRun.colors)) {
    warnings.push(`[${entry.id}] palette changed`);
  }

  // WARNING: image counts changed
  if (!imageCountsEqual(currentRun.imageCounts, baselineRun.imageCounts)) {
    warnings.push(`[${entry.id}] image counts changed`);
  }

  // WARNING: output length drift
  compareLengths('enhancedPrompt', currentRun.lengths.enhancedPrompt, baselineRun.lengths.enhancedPrompt, entry.id);

  if (baselineRun.lengths.displayPrompt > 0 || currentRun.lengths.displayPrompt > 0) {
    compareLengths('displayPrompt', currentRun.lengths.displayPrompt, baselineRun.lengths.displayPrompt, entry.id);
  }

  if (baselineRun.lengths.imagePrompt > 0 || currentRun.lengths.imagePrompt > 0) {
    compareLengths('imagePrompt', currentRun.lengths.imagePrompt, baselineRun.lengths.imagePrompt, entry.id);
  }
}

if (originalFetch) {
  globalThis.fetch = originalFetch;
}

restoreDeterminism();

// Compare performance metrics if baseline metrics exist
if (!baselineMetrics) {
  warnings.push('Baseline metrics missing; skipping performance comparison');
} else {
  const baselineColdImport = baselineMetrics.coldImportTimeMs ?? 0;
  const baselineBundleSize = baselineMetrics.bundleSizeBytes ?? 0;

  if (baselineColdImport > 0) {
    const currentColdImport = measureColdImport();

    if (currentColdImport > 0) {
      const allowedDelta = Math.max(
        baselineColdImport * COLD_IMPORT_RELATIVE_THRESHOLD,
        COLD_IMPORT_ABSOLUTE_THRESHOLD,
      );

      if (currentColdImport - baselineColdImport > allowedDelta) {
        warnings.push(
          `Cold import time increased from ${baselineColdImport.toFixed(2)}ms to ${currentColdImport.toFixed(2)}ms (allowed +${allowedDelta.toFixed(2)}ms)`,
        );
      }
    } else {
      warnings.push('Cold import measurement failed; skipping comparison');
    }
  } else {
    warnings.push('Baseline cold import time missing; skipping comparison');
  }

  if (baselineBundleSize > 0) {
    const currentBundleSize = getBundleSize();
    const bundleDrift = (currentBundleSize - baselineBundleSize) / baselineBundleSize;

    if (bundleDrift > BUNDLE_SIZE_THRESHOLD) {
      warnings.push(
        `Bundle size increased from ${baselineBundleSize} to ${currentBundleSize} bytes (+${(bundleDrift * 100).toFixed(1)}%)`,
      );
    }
  } else {
    warnings.push('Baseline bundle size missing; skipping comparison');
  }
}

// Report results
const hasErrors = errors.length > 0;
const hasWarnings = warnings.length > 0;

if (hasErrors) {
  console.error(`\nBASELINE ERRORS (${errors.length}):`);

  for (const error of errors) {
    console.error(`  - ${error}`);
  }
}

if (hasWarnings) {
  console.warn(`\nBASELINE WARNINGS (${warnings.length}):`);

  for (const warning of warnings) {
    console.warn(`  - ${warning}`);
  }
}

if (hasErrors) {
  console.error(`\nBaseline compare FAILED (${errors.length} errors, ${warnings.length} warnings)`);
  process.exitCode = 1;
} else if (hasWarnings) {
  console.log(`\nBaseline compare PASSED with warnings (${warnings.length} warnings, ${prompts.length} prompts)`);
  // Exit 0 - warnings are non-blocking
} else {
  console.log(`\nBaseline compare PASSED (${prompts.length} prompts)`);
}
