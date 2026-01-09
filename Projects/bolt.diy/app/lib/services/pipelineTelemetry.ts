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
}

const RECENT_EVENTS_LIMIT = 100;

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

export interface EmitQuarantineOptions {
  filename: string;
  violations: UnifiedViolation[];
  sanitizerWarnings: SanitizerWarning[];
  metrics?: ChangeMetrics;
  autoFixAttempts?: number;
  promptVariant?: PromptVariant;
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
