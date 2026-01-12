import { execSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  DEFAULT_NOW,
  DEFAULT_SEED,
  loadPrompts,
  median,
  normalizeRun,
  summarizeRuns,
  withDeterminism,
} from './baseline-utils';

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
const promptsPath = args.get('--prompts') ?? path.join(__dirname, 'baseline-prompts.json');
const resultsPath = args.get('--out') ?? path.join(__dirname, 'baseline-results.json');
const metricsPath = args.get('--metrics') ?? path.join(__dirname, 'baseline-metrics.json');

const PROMPT_ENHANCER_PATH = path.join(__dirname, '..', 'app', 'lib', 'services', 'promptEnhancer.ts');
const COLD_IMPORT_RUNS = 5;

/**
 * Measure cold import time by running separate Node processes.
 * ESM caches modules, so we need fresh processes for accurate measurement.
 */
function measureColdImport(runs: number = COLD_IMPORT_RUNS): number {
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

  for (let i = 0; i < runs; i++) {
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
}

/**
 * Get bundle size of promptEnhancer.ts in bytes.
 */
function getBundleSize(): number {
  try {
    return statSync(PROMPT_ENHANCER_PATH).size;
  } catch {
    return 0;
  }
}

const seedEnv = Number.parseInt(process.env.BASELINE_SEED ?? '', 10);
const nowEnv = Number.parseInt(process.env.BASELINE_NOW ?? '', 10);
const seed = Number.isFinite(seedEnv) ? seedEnv : DEFAULT_SEED;
const fixedNow = Number.isFinite(nowEnv) ? nowEnv : DEFAULT_NOW;

const restoreDeterminism = withDeterminism(seed, fixedNow);
const originalFetch = globalThis.fetch;

globalThis.fetch = async () => {
  throw new Error('baseline fetch disabled');
};

const { enhancePromptWithDesignSystem } = await import('../app/lib/services/promptEnhancer.ts');
const prompts = await loadPrompts(promptsPath);

const runs = [];

for (const entry of prompts) {
  const start = performance.now();
  const result = await enhancePromptWithDesignSystem(entry.prompt);
  const durationMs = performance.now() - start;

  runs.push(normalizeRun(entry, result, durationMs));
}

if (originalFetch) {
  globalThis.fetch = originalFetch;
}

restoreDeterminism();

// Measure cold import time and bundle size
console.log('Measuring cold import time...');
const coldImportTimeMs = measureColdImport();
const bundleSizeBytes = getBundleSize();

const meta = {
  generatedAt: new Date(fixedNow).toISOString(),
  seed,
  promptsPath: path.relative(process.cwd(), promptsPath),
};

const resultsPayload = {
  meta,
  runs,
};

const metricsPayload = {
  meta,
  summary: summarizeRuns(runs),
  coldImportTimeMs,
  bundleSizeBytes,
};

await writeFile(resultsPath, JSON.stringify(resultsPayload, null, 2));
await writeFile(metricsPath, JSON.stringify(metricsPayload, null, 2));

console.log(`Baseline written: ${resultsPath}`);
console.log(`Metrics written: ${metricsPath}`);
console.log(`Cold import time: ${coldImportTimeMs.toFixed(2)}ms (median of ${COLD_IMPORT_RUNS} runs)`);
console.log(`Bundle size: ${bundleSizeBytes} bytes`);
