/**
 * Pipeline Telemetry Service
 *
 * Collects anonymized metrics from the quality pipeline.
 * Privacy by design: no code, prompts, or messages - only codes, counts, timings.
 */

import type { PipelineResult } from './generationRouter';
import type { UnifiedViolation } from './sectionContracts';
import type { SanitizerWarning, ChangeMetrics } from '~/utils/codeSanitizer';
import type { PromptVariant } from '~/utils/promptVariants';
import type { DesignCueCoverage } from './prompt-data';

/*
 * ============================================================================
 * Event Types
 * ============================================================================
 */

/**
 * Event emitted after each pipeline run.
 */
export interface PipelineRunEvent {
  timestamp: string; // ISO 8601
  promptVariant?: PromptVariant;

  // File context (anonymized - extension only)
  fileExt: string;
  sectionType?: string;

  // Outcome
  success: boolean;
  usedFallback: boolean;
  quarantined: boolean;

  // Violation breakdown (codes only, no messages)
  violationCounts: {
    errors: number;
    warnings: number;
    byCode: Record<string, number>;
  };

  // Auto-fix stats
  autoFix: {
    ran: boolean;
    success: boolean;
    attempts: number;
  };

  // Timing breakdown (ms)
  timings: {
    sanitizer: number;
    validator: number;
    contract: number;
    autoFix: number;
    total: number;
  };
}

/**
 * Event emitted when a file is quarantined.
 */
export interface QuarantineEvent {
  timestamp: string;
  promptVariant?: PromptVariant;
  fileExt: string;
  violationCodes: string[];
  sanitizerWarningCodes: string[];
  riskLevel: 'low' | 'medium' | 'high';
  autoFixAttempts: number;
}

/**
 * Event emitted after each design-variant evaluation.
 */
export interface DesignQualityEvent {
  timestamp: string;
  variantIndex: number;
  variantCount: number;
  selected: boolean;
  designQualityScore: number;
  rankingScore: number;
  designCueCoverage: DesignCueCoverage;
  stylePackId: string;
  layoutArchetype: string;
  duplicateLayout: boolean;
  signatureMoveCount: number;
  effectCount: number;
  componentMemoryCount: number;
  sectionCount: number;
  componentMatchRate: number;
  componentFallbackRate: number;
}

/**
 * Event emitted after each screenshot analysis attempt.
 */
export interface ScreenshotAnalysisEvent {
  timestamp: string;
  success: boolean;
  usedFallback: boolean;
  imageCount: number;
  provider: string;
  model: string;
  fallbackProvider?: string;
  fallbackModel?: string;
}

/*
 * ============================================================================
 * Telemetry Store
 * ============================================================================
 */

interface TelemetryStore {
  // Counters
  totalRuns: number;
  successCount: number;
  failureCount: number;
  quarantineCount: number;
  fallbackUsedCount: number;

  variantStats: Map<
    string,
    {
      totalRuns: number;
      successRuns: number;
      quarantineRuns: number;
      totalAttempts: number;
      totalRepairLatencyMs: number;
      repairRunsWithTiming: number;
    }
  >;

  // ViolationCode tracking
  violationFrequency: Map<string, number>;
  violationQuarantineRate: Map<string, { total: number; quarantined: number }>;

  // Auto-fix tracking
  autoFixByCode: Map<string, { attempts: number; successes: number }>;

  // Timing aggregates
  timingTotals: {
    sanitizer: number;
    validator: number;
    contract: number;
    autoFix: number;
    total: number;
  };

  // Recent events (ring buffer, last 100)
  recentEvents: PipelineRunEvent[];

  // Design quality telemetry
  designQuality: {
    totalVariants: number;
    selectedVariants: number;
    totalDesignQualityScore: number;
    minDesignQualityScore: number;
    maxDesignQualityScore: number;
    totalRankingScore: number;
    minRankingScore: number;
    maxRankingScore: number;
    totalSelectedScore: number;
    minSelectedScore: number;
    maxSelectedScore: number;
    coverageCounts: DesignCueCoverageCounts;
    stylePackCounts: Map<string, number>;
    layoutArchetypeCounts: Map<string, number>;
    duplicateLayoutCount: number;
    totalSignatureMoves: number;
    totalEffects: number;
    totalComponentMemory: number;
    totalSectionCount: number;
    totalVariantCount: number;
    totalComponentMatchRate: number;
    totalComponentFallbackRate: number;
    recentDesignEvents: DesignQualityEvent[];
  };

  screenshotAnalysis: {
    totalRuns: number;
    successCount: number;
    fallbackCount: number;
    totalImages: number;
    fallbackProviderCounts: Map<string, number>;
    fallbackModelCounts: Map<string, number>;
    recentScreenshotEvents: ScreenshotAnalysisEvent[];
  };
}

const RECENT_EVENTS_LIMIT = 100;
const RECENT_DESIGN_EVENTS_LIMIT = 100;
const RECENT_SCREENSHOT_EVENTS_LIMIT = 100;

type DesignCueCoverageCounts = {
  typography: number;
  layout: number;
  visualHierarchy: number;
  motion: number;
};

type DesignCueCoverageRate = {
  typography: number;
  layout: number;
  visualHierarchy: number;
  motion: number;
};

let store: TelemetryStore = createEmptyStore();

function createEmptyStore(): TelemetryStore {
  return {
    totalRuns: 0,
    successCount: 0,
    failureCount: 0,
    quarantineCount: 0,
    fallbackUsedCount: 0,
    variantStats: new Map(),
    violationFrequency: new Map(),
    violationQuarantineRate: new Map(),
    autoFixByCode: new Map(),
    timingTotals: {
      sanitizer: 0,
      validator: 0,
      contract: 0,
      autoFix: 0,
      total: 0,
    },
    recentEvents: [],
    designQuality: {
      totalVariants: 0,
      selectedVariants: 0,
      totalDesignQualityScore: 0,
      minDesignQualityScore: Number.POSITIVE_INFINITY,
      maxDesignQualityScore: 0,
      totalRankingScore: 0,
      minRankingScore: Number.POSITIVE_INFINITY,
      maxRankingScore: 0,
      totalSelectedScore: 0,
      minSelectedScore: Number.POSITIVE_INFINITY,
      maxSelectedScore: 0,
      coverageCounts: createEmptyCoverageCounts(),
      stylePackCounts: new Map(),
      layoutArchetypeCounts: new Map(),
      duplicateLayoutCount: 0,
      totalSignatureMoves: 0,
      totalEffects: 0,
      totalComponentMemory: 0,
      totalSectionCount: 0,
      totalVariantCount: 0,
      totalComponentMatchRate: 0,
      totalComponentFallbackRate: 0,
      recentDesignEvents: [],
    },
    screenshotAnalysis: {
      totalRuns: 0,
      successCount: 0,
      fallbackCount: 0,
      totalImages: 0,
      fallbackProviderCounts: new Map(),
      fallbackModelCounts: new Map(),
      recentScreenshotEvents: [],
    },
  };
}

function createEmptyCoverageCounts(): DesignCueCoverageCounts {
  return {
    typography: 0,
    layout: 0,
    visualHierarchy: 0,
    motion: 0,
  };
}

/*
 * ============================================================================
 * Privacy Filter
 * ============================================================================
 */

/**
 * Extract file extension from filename (privacy-safe).
 */
export function extractFileExt(filename: string): string {
  const lastDot = filename.lastIndexOf('.');

  if (lastDot === -1) {
    return '';
  }

  return filename.slice(lastDot);
}

/**
 * Extract violation codes from unified violations (no messages).
 */
export function extractViolationCodes(violations: UnifiedViolation[]): string[] {
  return violations.map((v) => v.code);
}

/**
 * Extract sanitizer warning codes (no messages).
 */
export function extractSanitizerCodes(warnings: SanitizerWarning[]): string[] {
  return warnings.map((w) => w.code);
}

/**
 * Build violation counts from unified violations.
 */
export function buildViolationCounts(violations: UnifiedViolation[]): PipelineRunEvent['violationCounts'] {
  const byCode: Record<string, number> = {};
  let errors = 0;
  let warnings = 0;

  for (const v of violations) {
    if (v.severity === 'error') {
      errors++;
    } else if (v.severity === 'warning') {
      warnings++;
    }

    byCode[v.code] = (byCode[v.code] || 0) + 1;
  }

  return { errors, warnings, byCode };
}

/*
 * ============================================================================
 * Event Emitters
 * ============================================================================
 */

export interface EmitPipelineRunOptions {
  result: PipelineResult;
  sectionType?: string;
  usedFallback?: boolean;
  quarantined?: boolean;
  promptVariant?: PromptVariant;
  timings?: {
    sanitizer?: number;
    validator?: number;
    contract?: number;
    autoFix?: number;
  };
}

/**
 * Emit a pipeline run event.
 */
export function emitPipelineRun(options: EmitPipelineRunOptions): PipelineRunEvent {
  const { result, sectionType, usedFallback = false, quarantined = false, promptVariant, timings = {} } = options;

  // Extract violations from final validation
  const violations = result.finalValidation.unifiedViolations ?? [];

  const event: PipelineRunEvent = {
    timestamp: new Date().toISOString(),
    ...(promptVariant ? { promptVariant } : {}),
    fileExt: extractFileExt(result.filename),
    sectionType,
    success: result.success,
    usedFallback,
    quarantined,
    violationCounts: buildViolationCounts(violations),
    autoFix: {
      ran: result.stages.autoFix.ran,
      success: result.stages.autoFix.success,
      attempts: result.stages.autoFix.attempts,
    },
    timings: {
      sanitizer: timings.sanitizer ?? 0,
      validator: timings.validator ?? 0,
      contract: timings.contract ?? 0,
      autoFix: timings.autoFix ?? 0,
      total: result.processingTimeMs,
    },
  };

  // Update store
  aggregatePipelineEvent(event, violations);

  return event;
}

/**
 * Emit a design-quality telemetry event.
 */
export function emitDesignQualityEvent(options: EmitDesignQualityOptions): DesignQualityEvent {
  const event: DesignQualityEvent = {
    timestamp: new Date().toISOString(),
    ...options,
  };

  aggregateDesignQualityEvent(event);

  return event;
}

export interface EmitQuarantineOptions {
  filename: string;
  violations: UnifiedViolation[];
  sanitizerWarnings: SanitizerWarning[];
  metrics?: ChangeMetrics;
  autoFixAttempts?: number;
  promptVariant?: PromptVariant;
}

export interface EmitDesignQualityOptions {
  variantIndex: number;
  variantCount: number;
  selected: boolean;
  designQualityScore: number;
  rankingScore: number;
  designCueCoverage: DesignCueCoverage;
  stylePackId: string;
  layoutArchetype: string;
  duplicateLayout: boolean;
  signatureMoveCount: number;
  effectCount: number;
  componentMemoryCount: number;
  sectionCount: number;
  componentMatchRate: number;
  componentFallbackRate: number;
}

export interface EmitScreenshotAnalysisOptions {
  success: boolean;
  usedFallback: boolean;
  imageCount: number;
  provider: string;
  model: string;
  fallbackProvider?: string;
  fallbackModel?: string;
}

/**
 * Emit a quarantine event.
 */
export function emitQuarantineWritten(options: EmitQuarantineOptions): QuarantineEvent {
  const { filename, violations, sanitizerWarnings, metrics, autoFixAttempts = 0, promptVariant } = options;

  const event: QuarantineEvent = {
    timestamp: new Date().toISOString(),
    ...(promptVariant ? { promptVariant } : {}),
    fileExt: extractFileExt(filename),
    violationCodes: extractViolationCodes(violations),
    sanitizerWarningCodes: extractSanitizerCodes(sanitizerWarnings),
    riskLevel: metrics?.riskLevel ?? 'low',
    autoFixAttempts,
  };

  // Update store
  aggregateQuarantineEvent(event);

  // Track quarantine-specific details
  trackQuarantineDetailsInternal(event);

  return event;
}

/**
 * Emit a screenshot-analysis telemetry event.
 */
export function emitScreenshotAnalysisEvent(options: EmitScreenshotAnalysisOptions): ScreenshotAnalysisEvent {
  const event: ScreenshotAnalysisEvent = {
    timestamp: new Date().toISOString(),
    ...options,
  };

  aggregateScreenshotAnalysisEvent(event);

  return event;
}

/*
 * ============================================================================
 * Aggregator
 * ============================================================================
 */

function aggregatePipelineEvent(event: PipelineRunEvent, violations: UnifiedViolation[]): void {
  // Update counters
  store.totalRuns++;

  if (event.success) {
    store.successCount++;
  } else {
    store.failureCount++;
  }

  if (event.usedFallback) {
    store.fallbackUsedCount++;
  }

  if (event.quarantined) {
    store.quarantineCount++;
  }

  if (event.promptVariant) {
    const current = store.variantStats.get(event.promptVariant) ?? {
      totalRuns: 0,
      successRuns: 0,
      quarantineRuns: 0,
      totalAttempts: 0,
      totalRepairLatencyMs: 0,
      repairRunsWithTiming: 0,
    };

    current.totalRuns++;

    if (event.success) {
      current.successRuns++;
    }

    if (event.quarantined) {
      current.quarantineRuns++;
    }

    current.totalAttempts += event.autoFix.attempts;

    if (event.timings.autoFix > 0) {
      current.totalRepairLatencyMs += event.timings.autoFix;
      current.repairRunsWithTiming++;
    }

    store.variantStats.set(event.promptVariant, current);
  }

  // Update violation frequency
  for (const [code, count] of Object.entries(event.violationCounts.byCode)) {
    store.violationFrequency.set(code, (store.violationFrequency.get(code) || 0) + count);

    // Track quarantine rate per code
    const rateData = store.violationQuarantineRate.get(code) || { total: 0, quarantined: 0 };
    rateData.total += count;

    if (event.quarantined) {
      rateData.quarantined += count;
    }

    store.violationQuarantineRate.set(code, rateData);
  }

  // Update auto-fix stats by code
  if (event.autoFix.ran) {
    for (const v of violations) {
      if (v.autoFixable) {
        const fixData = store.autoFixByCode.get(v.code) || { attempts: 0, successes: 0 };
        fixData.attempts++;

        if (event.autoFix.success) {
          fixData.successes++;
        }

        store.autoFixByCode.set(v.code, fixData);
      }
    }
  }

  // Update timing totals
  store.timingTotals.sanitizer += event.timings.sanitizer;
  store.timingTotals.validator += event.timings.validator;
  store.timingTotals.contract += event.timings.contract;
  store.timingTotals.autoFix += event.timings.autoFix;
  store.timingTotals.total += event.timings.total;

  // Add to recent events (ring buffer)
  store.recentEvents.push(event);

  if (store.recentEvents.length > RECENT_EVENTS_LIMIT) {
    store.recentEvents.shift();
  }
}

function aggregateDesignQualityEvent(event: DesignQualityEvent): void {
  const design = store.designQuality;
  design.totalVariants++;
  design.totalDesignQualityScore += event.designQualityScore;
  design.totalRankingScore += event.rankingScore;
  design.totalSignatureMoves += event.signatureMoveCount;
  design.totalEffects += event.effectCount;
  design.totalComponentMemory += event.componentMemoryCount;
  design.totalSectionCount += event.sectionCount;
  design.totalVariantCount += event.variantCount;
  design.totalComponentMatchRate += event.componentMatchRate;
  design.totalComponentFallbackRate += event.componentFallbackRate;

  if (event.selected) {
    design.selectedVariants++;
    design.totalSelectedScore += event.designQualityScore;
    design.minSelectedScore = Math.min(design.minSelectedScore, event.designQualityScore);
    design.maxSelectedScore = Math.max(design.maxSelectedScore, event.designQualityScore);
  }

  design.minDesignQualityScore = Math.min(design.minDesignQualityScore, event.designQualityScore);
  design.maxDesignQualityScore = Math.max(design.maxDesignQualityScore, event.designQualityScore);
  design.minRankingScore = Math.min(design.minRankingScore, event.rankingScore);
  design.maxRankingScore = Math.max(design.maxRankingScore, event.rankingScore);

  if (event.designCueCoverage.typography) {
    design.coverageCounts.typography += 1;
  }
  if (event.designCueCoverage.layout) {
    design.coverageCounts.layout += 1;
  }
  if (event.designCueCoverage.visualHierarchy) {
    design.coverageCounts.visualHierarchy += 1;
  }
  if (event.designCueCoverage.motion) {
    design.coverageCounts.motion += 1;
  }

  design.stylePackCounts.set(event.stylePackId, (design.stylePackCounts.get(event.stylePackId) || 0) + 1);
  design.layoutArchetypeCounts.set(
    event.layoutArchetype,
    (design.layoutArchetypeCounts.get(event.layoutArchetype) || 0) + 1,
  );

  if (event.duplicateLayout) {
    design.duplicateLayoutCount += 1;
  }

  design.recentDesignEvents.push(event);
  if (design.recentDesignEvents.length > RECENT_DESIGN_EVENTS_LIMIT) {
    design.recentDesignEvents.shift();
  }
}

function aggregateScreenshotAnalysisEvent(event: ScreenshotAnalysisEvent): void {
  const screenshots = store.screenshotAnalysis;
  screenshots.totalRuns += 1;
  screenshots.totalImages += event.imageCount;

  if (event.success) {
    screenshots.successCount += 1;
  }

  if (event.usedFallback) {
    screenshots.fallbackCount += 1;
  }

  if (event.fallbackProvider) {
    screenshots.fallbackProviderCounts.set(
      event.fallbackProvider,
      (screenshots.fallbackProviderCounts.get(event.fallbackProvider) || 0) + 1,
    );
  }

  if (event.fallbackModel) {
    screenshots.fallbackModelCounts.set(
      event.fallbackModel,
      (screenshots.fallbackModelCounts.get(event.fallbackModel) || 0) + 1,
    );
  }

  screenshots.recentScreenshotEvents.push(event);
  if (screenshots.recentScreenshotEvents.length > RECENT_SCREENSHOT_EVENTS_LIMIT) {
    screenshots.recentScreenshotEvents.shift();
  }
}

function aggregateQuarantineEvent(event: QuarantineEvent): void {
  /*
   * Quarantine count already updated in pipeline event
   * Here we just track additional quarantine-specific data
   */

  if (event.promptVariant) {
    const current = store.variantStats.get(event.promptVariant) ?? {
      totalRuns: 0,
      successRuns: 0,
      quarantineRuns: 0,
      totalAttempts: 0,
      totalRepairLatencyMs: 0,
      repairRunsWithTiming: 0,
    };

    current.quarantineRuns++;
    store.variantStats.set(event.promptVariant, current);
  }

  for (const code of event.violationCodes) {
    const rateData = store.violationQuarantineRate.get(code) || { total: 0, quarantined: 0 };

    /*
     * Don't double-count if already counted in pipeline event
     * This is for standalone quarantine tracking
     */
    store.violationQuarantineRate.set(code, rateData);
  }
}

/*
 * ============================================================================
 * Telemetry API
 * ============================================================================
 */

export interface TelemetrySummary {
  totalRuns: number;
  successRate: number;
  quarantineRate: number;
  fallbackRate: number;
  avgTimings: {
    sanitizer: number;
    validator: number;
    contract: number;
    autoFix: number;
    total: number;
  };
  autoFixSuccessRate: number;
}

export interface DesignTelemetrySummary {
  totalVariants: number;
  selectedVariantRate: number;
  avgDesignQualityScore: number;
  minDesignQualityScore: number;
  maxDesignQualityScore: number;
  avgRankingScore: number;
  minRankingScore: number;
  maxRankingScore: number;
  avgSelectedQualityScore: number;
  minSelectedQualityScore: number;
  maxSelectedQualityScore: number;
  avgVariantCount: number;
  duplicateLayoutRate: number;
  coverageRate: DesignCueCoverageRate;
  avgSignatureMoves: number;
  avgEffects: number;
  avgComponentMemory: number;
  avgSectionCount: number;
  avgComponentMatchRate: number;
  avgComponentFallbackRate: number;
  topStylePacks: Array<{ id: string; count: number }>;
  topLayoutArchetypes: Array<{ id: string; count: number }>;
}

export interface ScreenshotTelemetrySummary {
  totalRuns: number;
  successRate: number;
  fallbackRate: number;
  avgImageCount: number;
  topFallbackProviders: Array<{ id: string; count: number }>;
  topFallbackModels: Array<{ id: string; count: number }>;
}

/**
 * Get aggregated telemetry summary.
 */
export function getTelemetrySummary(): TelemetrySummary {
  const { totalRuns, successCount, quarantineCount, fallbackUsedCount, timingTotals, autoFixByCode } = store;

  // Calculate auto-fix success rate
  let totalAttempts = 0;
  let totalSuccesses = 0;

  for (const { attempts, successes } of autoFixByCode.values()) {
    totalAttempts += attempts;
    totalSuccesses += successes;
  }

  return {
    totalRuns,
    successRate: totalRuns > 0 ? successCount / totalRuns : 0,
    quarantineRate: totalRuns > 0 ? quarantineCount / totalRuns : 0,
    fallbackRate: totalRuns > 0 ? fallbackUsedCount / totalRuns : 0,
    avgTimings: {
      sanitizer: totalRuns > 0 ? timingTotals.sanitizer / totalRuns : 0,
      validator: totalRuns > 0 ? timingTotals.validator / totalRuns : 0,
      contract: totalRuns > 0 ? timingTotals.contract / totalRuns : 0,
      autoFix: totalRuns > 0 ? timingTotals.autoFix / totalRuns : 0,
      total: totalRuns > 0 ? timingTotals.total / totalRuns : 0,
    },
    autoFixSuccessRate: totalAttempts > 0 ? totalSuccesses / totalAttempts : 0,
  };
}

export function getDesignTelemetrySummary(): DesignTelemetrySummary {
  const design = store.designQuality;
  const totalVariants = design.totalVariants;
  const selectedVariants = design.selectedVariants;

  return {
    totalVariants,
    selectedVariantRate: totalVariants > 0 ? selectedVariants / totalVariants : 0,
    avgDesignQualityScore: totalVariants > 0 ? design.totalDesignQualityScore / totalVariants : 0,
    minDesignQualityScore: totalVariants > 0 ? design.minDesignQualityScore : 0,
    maxDesignQualityScore: totalVariants > 0 ? design.maxDesignQualityScore : 0,
    avgRankingScore: totalVariants > 0 ? design.totalRankingScore / totalVariants : 0,
    minRankingScore: totalVariants > 0 ? design.minRankingScore : 0,
    maxRankingScore: totalVariants > 0 ? design.maxRankingScore : 0,
    avgSelectedQualityScore: selectedVariants > 0 ? design.totalSelectedScore / selectedVariants : 0,
    minSelectedQualityScore: selectedVariants > 0 ? design.minSelectedScore : 0,
    maxSelectedQualityScore: selectedVariants > 0 ? design.maxSelectedScore : 0,
    avgVariantCount: totalVariants > 0 ? design.totalVariantCount / totalVariants : 0,
    duplicateLayoutRate: totalVariants > 0 ? design.duplicateLayoutCount / totalVariants : 0,
    coverageRate: {
      typography: totalVariants > 0 ? design.coverageCounts.typography / totalVariants : 0,
      layout: totalVariants > 0 ? design.coverageCounts.layout / totalVariants : 0,
      visualHierarchy: totalVariants > 0 ? design.coverageCounts.visualHierarchy / totalVariants : 0,
      motion: totalVariants > 0 ? design.coverageCounts.motion / totalVariants : 0,
    },
    avgSignatureMoves: totalVariants > 0 ? design.totalSignatureMoves / totalVariants : 0,
    avgEffects: totalVariants > 0 ? design.totalEffects / totalVariants : 0,
    avgComponentMemory: totalVariants > 0 ? design.totalComponentMemory / totalVariants : 0,
    avgSectionCount: totalVariants > 0 ? design.totalSectionCount / totalVariants : 0,
    avgComponentMatchRate: totalVariants > 0 ? design.totalComponentMatchRate / totalVariants : 0,
    avgComponentFallbackRate: totalVariants > 0 ? design.totalComponentFallbackRate / totalVariants : 0,
    topStylePacks: summarizeCountMap(design.stylePackCounts, 5),
    topLayoutArchetypes: summarizeCountMap(design.layoutArchetypeCounts, 5),
  };
}

export function getScreenshotTelemetrySummary(): ScreenshotTelemetrySummary {
  const screenshots = store.screenshotAnalysis;
  const totalRuns = screenshots.totalRuns;

  return {
    totalRuns,
    successRate: totalRuns > 0 ? screenshots.successCount / totalRuns : 0,
    fallbackRate: totalRuns > 0 ? screenshots.fallbackCount / totalRuns : 0,
    avgImageCount: totalRuns > 0 ? screenshots.totalImages / totalRuns : 0,
    topFallbackProviders: summarizeCountMap(screenshots.fallbackProviderCounts, 5),
    topFallbackModels: summarizeCountMap(screenshots.fallbackModelCounts, 5),
  };
}

export interface ViolationStats {
  code: string;
  count: number;
  percentage: number;
  quarantineRate: number;
  autoFixSuccessRate: number;
}

/**
 * Get top N violations by frequency.
 */
export function getTopViolations(n: number): ViolationStats[] {
  const totalViolations = Array.from(store.violationFrequency.values()).reduce((a, b) => a + b, 0);

  const sorted = Array.from(store.violationFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);

  return sorted.map(([code, count]) => {
    const rateData = store.violationQuarantineRate.get(code);
    const fixData = store.autoFixByCode.get(code);

    return {
      code,
      count,
      percentage: totalViolations > 0 ? count / totalViolations : 0,
      quarantineRate: rateData && rateData.total > 0 ? rateData.quarantined / rateData.total : 0,
      autoFixSuccessRate: fixData && fixData.attempts > 0 ? fixData.successes / fixData.attempts : 0,
    };
  });
}

export interface QuarantineStats {
  total: number;
  byRiskLevel: Record<string, number>;
  topViolationCodes: string[];
  avgAutoFixAttempts: number;
}

export interface VariantStats {
  variant: string;
  totalRuns: number;
  successRate: number;
  avgAttempts: number;
  quarantineRate: number;
  avgRepairLatencyMs: number;
}

// Track quarantine-specific data
let quarantineData = {
  byRiskLevel: { low: 0, medium: 0, high: 0 } as Record<string, number>,
  totalAutoFixAttempts: 0,
  quarantineCount: 0,
};

/**
 * Get quarantine analysis.
 */
export function getQuarantineStats(): QuarantineStats {
  // Get top codes by quarantine rate
  const topCodes = Array.from(store.violationQuarantineRate.entries())
    .filter(([_, data]) => data.quarantined > 0)
    .sort((a, b) => b[1].quarantined - a[1].quarantined)
    .slice(0, 10)
    .map(([code]) => code);

  return {
    total: store.quarantineCount,
    byRiskLevel: { ...quarantineData.byRiskLevel },
    topViolationCodes: topCodes,
    avgAutoFixAttempts:
      quarantineData.quarantineCount > 0 ? quarantineData.totalAutoFixAttempts / quarantineData.quarantineCount : 0,
  };
}

export function getVariantStats(): VariantStats[] {
  return Array.from(store.variantStats.entries())
    .map(([variant, data]) => {
      return {
        variant,
        totalRuns: data.totalRuns,
        successRate: data.totalRuns > 0 ? data.successRuns / data.totalRuns : 0,
        avgAttempts: data.totalRuns > 0 ? data.totalAttempts / data.totalRuns : 0,
        quarantineRate: data.totalRuns > 0 ? data.quarantineRuns / data.totalRuns : 0,
        avgRepairLatencyMs: data.repairRunsWithTiming > 0 ? data.totalRepairLatencyMs / data.repairRunsWithTiming : 0,
      };
    })
    .sort((a, b) => b.totalRuns - a.totalRuns);
}

export function getRecentDesignEvents(): DesignQualityEvent[] {
  return [...store.designQuality.recentDesignEvents];
}

export function getRecentScreenshotEvents(): ScreenshotAnalysisEvent[] {
  return [...store.screenshotAnalysis.recentScreenshotEvents];
}

/**
 * Reset telemetry (for testing).
 */
export function resetTelemetry(): void {
  store = createEmptyStore();
  quarantineData = {
    byRiskLevel: { low: 0, medium: 0, high: 0 },
    totalAutoFixAttempts: 0,
    quarantineCount: 0,
  };
}

/**
 * Track quarantine event details internally.
 */
function trackQuarantineDetailsInternal(event: QuarantineEvent): void {
  quarantineData.byRiskLevel[event.riskLevel] = (quarantineData.byRiskLevel[event.riskLevel] || 0) + 1;
  quarantineData.totalAutoFixAttempts += event.autoFixAttempts;
  quarantineData.quarantineCount++;
}

/**
 * Get recent events (for debugging).
 */
export function getRecentEvents(): PipelineRunEvent[] {
  return [...store.recentEvents];
}

function summarizeCountMap(map: Map<string, number>, limit: number): Array<{ id: string; count: number }> {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id, count]) => ({ id, count }));
}
