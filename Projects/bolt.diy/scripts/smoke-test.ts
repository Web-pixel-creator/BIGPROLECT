import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';

import {
  DEFAULT_NOW,
  DEFAULT_SEED,
  loadPrompts,
  normalizeRun,
  summarizeRuns,
  withDeterminism,
} from './baseline-utils';

type SmokePayload = {
  meta: {
    generatedAt: string;
    seed: number;
    promptsPath: string;
  };
  summary: ReturnType<typeof summarizeRuns>;
  runs: Array<ReturnType<typeof normalizeRun>>;
};

const args = new Map<string, string>();
const flags = new Set<string>();

for (let i = 2; i < process.argv.length; i += 1) {
  const key = process.argv[i];
  const value = process.argv[i + 1];

  if (!key?.startsWith('--')) {
    continue;
  }

  if (value && !value.startsWith('--')) {
    args.set(key, value);
    i += 1;
  } else {
    flags.add(key);
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const promptsPath = args.get('--prompts') ?? path.join(__dirname, 'smoke-prompts.json');
const outPath = args.get('--out') ?? path.join(__dirname, 'smoke-results.json');
const baselinePath = args.get('--baseline');

const seedEnv = Number.parseInt(process.env.SMOKE_SEED ?? '', 10);
const nowEnv = Number.parseInt(process.env.SMOKE_NOW ?? '', 10);
const seed = Number.isFinite(seedEnv) ? seedEnv : DEFAULT_SEED;
const fixedNow = Number.isFinite(nowEnv) ? nowEnv : DEFAULT_NOW;

const lengthRatioEnv = Number.parseFloat(process.env.SMOKE_LENGTH_RATIO ?? '');
const lengthAbsEnv = Number.parseFloat(process.env.SMOKE_LENGTH_ABS ?? '');
const lengthRatio = Number.isFinite(lengthRatioEnv) ? lengthRatioEnv : 0.3;
const lengthAbs = Number.isFinite(lengthAbsEnv) ? lengthAbsEnv : 200;

const strict = flags.has('--strict');

const restoreDeterminism = withDeterminism(seed, fixedNow);
const originalFetch = globalThis.fetch;

globalThis.fetch = async () => {
  throw new Error('smoke test fetch disabled');
};

const { enhancePromptWithDesignSystem } = await import('../app/lib/services/promptEnhancer.js');
const prompts = await loadPrompts(promptsPath);

const runs: Array<ReturnType<typeof normalizeRun>> = [];

for (const entry of prompts) {
  const start = performance.now();
  const result = await enhancePromptWithDesignSystem(entry.prompt);
  const durationMs = performance.now() - start;

  runs.push(normalizeRun(entry, result, durationMs));
}

if (originalFetch) {
  globalThis.fetch = originalFetch;
} else {
  delete (globalThis as { fetch?: typeof fetch }).fetch;
}

restoreDeterminism();

const payload: SmokePayload = {
  meta: {
    generatedAt: new Date(fixedNow).toISOString(),
    seed,
    promptsPath: path.relative(process.cwd(), promptsPath),
  },
  summary: summarizeRuns(runs),
  runs,
};

let baseline: SmokePayload | null = null;
const baselineSource = baselinePath ?? (existsSync(outPath) ? outPath : null);

if (baselineSource) {
  try {
    const raw = await readFile(baselineSource, 'utf-8');
    baseline = JSON.parse(raw) as SmokePayload;
  } catch {
    baseline = null;
  }
}

const diffs: string[] = [];

const arraysEqual = (a: string[] = [], b: string[] = []) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

const shallowEqual = (a?: Record<string, unknown>, b?: Record<string, unknown>) => {
  if (!a || !b) {
    return a === b;
  }

  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();

  if (!arraysEqual(aKeys, bKeys)) {
    return false;
  }

  return aKeys.every((key) => a[key] === b[key]);
};

const compareLengths = (label: string, current: number, prev: number, id: string) => {
  if (prev === 0) {
    return;
  }

  const allowed = Math.max(lengthAbs, prev * lengthRatio);

  if (Math.abs(current - prev) > allowed) {
    diffs.push(`[${id}] ${label} length drifted from ${prev} to ${current} (allowed ${Math.round(allowed)})`);
  }
};

if (baseline?.runs?.length) {
  const baselineMap = new Map(baseline.runs.map((run) => [run.id, run]));

  for (const run of runs) {
    const prev = baselineMap.get(run.id);

    if (!prev) {
      diffs.push(`[${run.id}] missing baseline entry`);
      continue;
    }

    if (run.detectedTheme !== prev.detectedTheme) {
      diffs.push(`[${run.id}] theme changed: ${prev.detectedTheme} -> ${run.detectedTheme}`);
    }

    if (!arraysEqual(run.sectionOrder, prev.sectionOrder)) {
      diffs.push(`[${run.id}] section order changed: ${prev.sectionOrder.join(', ')} -> ${run.sectionOrder.join(', ')}`);
    }

    if (!shallowEqual(run.colors, prev.colors)) {
      diffs.push(`[${run.id}] colors changed`);
    }

    if (!shallowEqual(run.imageCounts as Record<string, unknown>, prev.imageCounts as Record<string, unknown>)) {
      diffs.push(`[${run.id}] image counts changed`);
    }

    const flagDiffs = Object.keys(run.blockFlags).filter(
      (key) => run.blockFlags[key as keyof typeof run.blockFlags] !== prev.blockFlags[key as keyof typeof run.blockFlags],
    );

    if (flagDiffs.length > 0) {
      diffs.push(`[${run.id}] block flags changed: ${flagDiffs.join(', ')}`);
    }

    compareLengths('enhancedPrompt', run.lengths.enhancedPrompt, prev.lengths.enhancedPrompt, run.id);
    compareLengths('displayPrompt', run.lengths.displayPrompt, prev.lengths.displayPrompt, run.id);
    compareLengths('imagePrompt', run.lengths.imagePrompt, prev.lengths.imagePrompt, run.id);
  }
} else if (baselineSource) {
  diffs.push('Baseline results could not be read; diff skipped.');
}

await writeFile(outPath, JSON.stringify(payload, null, 2));

console.log(`Smoke results written: ${outPath}`);
console.log(`Prompts: ${runs.length}`);
console.log(`Duration median: ${payload.summary.durationMs.median.toFixed(2)}ms`);
console.log(`Enhanced prompt length median: ${payload.summary.enhancedPromptLength.median}`);

if (diffs.length > 0) {
  console.log('\nDiffs:');
  for (const diff of diffs) {
    console.log(`- ${diff}`);
  }

  if (strict) {
    process.exitCode = 1;
  }
} else {
  console.log('\nNo diffs detected.');
}
