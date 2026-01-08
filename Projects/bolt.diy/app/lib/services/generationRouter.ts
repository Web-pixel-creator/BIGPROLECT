/**
 * Generation Router - Orchestrates the quality pipeline
 * 
 * Routes code through:
 * 1. Sanitizer (quick fixes)
 * 2. Validator (syntax check)
 * 3. Contract validation (structure check)
 * 4. Auto-fix loop (LLM repair if needed)
 * 
 * Decides which path to take based on file type and error severity.
 */

import { sanitizeGeneratedFile } from '~/utils/codeSanitizer';
import { validateFile, type ValidationResult } from '~/utils/codeValidator';
import { quickFix, autoFixWithLlm, areErrorsAutoFixable, type LlmRepairFn } from '~/utils/autoFixLoop';
import { validateAgainstContract, getContractHints, type ContractValidationResult } from './sectionContracts';
import { planSections, type SectionPlan, type SectionType } from './sectionGenerator';
import { emitPipelineRun, type EmitPipelineRunOptions } from './pipelineTelemetry';
import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('GenerationRouter');

/**
 * Pipeline result with detailed information about each stage.
 */
export interface PipelineResult {
  success: boolean;
  code: string;
  filename: string;
  stages: {
    sanitizer: { ran: boolean; changed: boolean };
    validator: { ran: boolean; valid: boolean; errors: number };
    contract: { ran: boolean; valid: boolean; score: number };
    autoFix: { ran: boolean; success: boolean; attempts: number };
  };
  finalValidation: ValidationResult;
  contractValidation?: ContractValidationResult;
  warnings: string[];
  processingTimeMs: number;
}

/**
 * Options for the generation pipeline.
 */
export interface PipelineOptions {
  /** Skip contract validation */
  skipContractValidation?: boolean;
  /** Skip auto-fix loop */
  skipAutoFix?: boolean;
  /** Section type for contract validation */
  sectionType?: SectionType;
  /** LLM repair function - receives prompt string, returns raw LLM response */
  llmRepairFn?: LlmRepairFn;
  /** Fallback LLM repair function */
  fallbackLlmRepairFn?: LlmRepairFn;
}

/**
 * Route code through the quality pipeline.
 */
export async function routeThroughPipeline(
  code: string,
  filename: string,
  options: PipelineOptions = {}
): Promise<PipelineResult> {
  const startTime = Date.now();
  const warnings: string[] = [];
  
  // Timing tracking for telemetry
  const timings = {
    sanitizer: 0,
    validator: 0,
    contract: 0,
    autoFix: 0,
  };
  let usedFallback = false;
  
  const result: PipelineResult = {
    success: false,
    code,
    filename,
    stages: {
      sanitizer: { ran: false, changed: false },
      validator: { ran: false, valid: false, errors: 0 },
      contract: { ran: false, valid: false, score: 0 },
      autoFix: { ran: false, success: false, attempts: 0 },
    },
    finalValidation: { valid: false, errors: [], fixable: false },
    warnings,
    processingTimeMs: 0,
  };

  let currentCode = code;

  // Stage 1: Sanitizer
  const sanitizerStart = Date.now();
  logger.debug(`Stage 1: Running sanitizer for ${filename}`);
  const sanitized = sanitizeGeneratedFile(filename, currentCode);
  result.stages.sanitizer.ran = true;
  result.stages.sanitizer.changed = sanitized.changed;
  currentCode = sanitized.content;
  timings.sanitizer = Date.now() - sanitizerStart;

  if (sanitized.changed) {
    logger.debug('Sanitizer made changes to the code');
  }

  // Stage 2: Validator
  const validatorStart = Date.now();
  logger.debug(`Stage 2: Running validator for ${filename}`);
  const validation = validateFile(currentCode, filename);
  result.stages.validator.ran = true;
  result.stages.validator.valid = validation.valid;
  result.stages.validator.errors = validation.errors.filter(e => e.severity === 'error').length;
  timings.validator = Date.now() - validatorStart;

  const unifiedErrors = (validation.unifiedViolations ?? []).filter((v) => v.severity === 'error');
  const isAutoFixable =
    unifiedErrors.length > 0
      ? unifiedErrors.filter((v) => v.autoFixable).length >= unifiedErrors.length / 2
      : areErrorsAutoFixable(validation.errors);

  if (validation.valid) {
    logger.debug('Code passed validation');
  } else {
    logger.debug(`Validation found ${result.stages.validator.errors} error(s)`);
  }

  // Stage 3: Contract validation (if applicable)
  if (!options.skipContractValidation && options.sectionType) {
    const contractStart = Date.now();
    logger.debug(`Stage 3: Running contract validation for ${options.sectionType}`);
    const contractResult = validateAgainstContract(currentCode, options.sectionType);
    result.stages.contract.ran = true;
    result.stages.contract.valid = contractResult.valid;
    result.stages.contract.score = contractResult.score;
    result.contractValidation = contractResult;
    timings.contract = Date.now() - contractStart;

    // Add contract warnings from unified violations (primary) or legacy violations (fallback)
    const violationsToCheck = contractResult.unifiedViolations ?? contractResult.violations;
    for (const violation of violationsToCheck) {
      if (violation.severity === 'warning') {
        warnings.push(`Contract: ${violation.message}`);
      }
    }

    if (!contractResult.valid) {
      logger.debug(`Contract validation failed with score ${contractResult.score}`);
    }
  }

  // Stage 4: Auto-fix loop (if validation failed)
  if (!validation.valid && !options.skipAutoFix) {
    const autoFixStart = Date.now();
    logger.debug('Stage 4: Running auto-fix loop');
    
    // First try quick fix (sanitizer only)
    const quickFixResult = quickFix(currentCode, filename);
    
    if (quickFixResult.valid) {
      currentCode = quickFixResult.code;
      result.stages.autoFix.ran = true;
      result.stages.autoFix.success = true;
      result.stages.autoFix.attempts = 1;
      logger.debug('Quick fix succeeded');
    } else if (options.llmRepairFn && isAutoFixable) {
      // Try LLM repair
      const autoFixResult = await autoFixWithLlm({
        filename,
        originalCode: currentCode,
        validationResult: validation,
        llmRepairFn: options.llmRepairFn,
        fallbackLlmRepairFn: options.fallbackLlmRepairFn,
        repairContext: {
          sanitizerWarnings: sanitized.structuredWarnings,
          metrics: sanitized.metrics,
        },
      });

      result.stages.autoFix.ran = true;
      result.stages.autoFix.success = autoFixResult.success;
      result.stages.autoFix.attempts = autoFixResult.attempts;

      if (autoFixResult.success) {
        currentCode = autoFixResult.code;
        logger.info(`Auto-fix succeeded after ${autoFixResult.attempts} attempt(s)`);
        if (autoFixResult.usedFallback) {
          warnings.push('Used fallback model for repair');
          usedFallback = true;
        }
      } else {
        logger.warn(`Auto-fix failed after ${autoFixResult.attempts} attempt(s)`);
        warnings.push(`Auto-fix failed after ${autoFixResult.attempts} attempts`);
      }
    } else {
      logger.debug('Skipping LLM repair - errors not auto-fixable or no repair function');
      warnings.push('Some errors are not auto-fixable');
    }
    timings.autoFix = Date.now() - autoFixStart;
  }

  // Final validation
  result.finalValidation = validateFile(currentCode, filename);
  result.code = currentCode;
  result.success = result.finalValidation.valid;
  result.processingTimeMs = Date.now() - startTime;

  // Emit telemetry event
  try {
    emitPipelineRun({
      result,
      sectionType: options.sectionType,
      usedFallback,
      quarantined: false, // Quarantine is handled by ActionRunner
      timings,
    });
  } catch (telemetryError) {
    // Telemetry errors should not affect pipeline execution
    logger.debug('Telemetry emission failed:', telemetryError);
  }

  logger.info(`Pipeline completed in ${result.processingTimeMs}ms - ${result.success ? 'SUCCESS' : 'FAILED'}`);

  return result;
}

/**
 * Determine the best generation strategy based on prompt analysis.
 */
export function determineStrategy(userPrompt: string): {
  strategy: 'single' | 'modular';
  plan?: SectionPlan;
  reason: string;
} {
  const promptLower = userPrompt.toLowerCase();
  
  // Keywords that suggest a full website/landing page
  const websiteKeywords = [
    'website', 'landing', 'page', 'site', 'saas', 'portfolio',
    'сайт', 'страница', 'лендинг', 'портфолио'
  ];
  
  // Keywords that suggest a single component
  const componentKeywords = [
    'component', 'button', 'card', 'modal', 'form', 'input',
    'компонент', 'кнопка', 'карточка', 'модал', 'форма'
  ];

  const isWebsite = websiteKeywords.some(k => promptLower.includes(k));
  const isComponent = componentKeywords.some(k => promptLower.includes(k));

  if (isComponent && !isWebsite) {
    return {
      strategy: 'single',
      reason: 'Detected single component request',
    };
  }

  if (isWebsite) {
    const plan = planSections(userPrompt);
    return {
      strategy: 'modular',
      plan,
      reason: `Detected website request with ${plan.sections.length} sections`,
    };
  }

  // Default to single for ambiguous requests
  return {
    strategy: 'single',
    reason: 'Default strategy for ambiguous request',
  };
}

/**
 * Generate enhanced prompt with contract hints.
 */
export function enhancePromptWithContract(
  basePrompt: string,
  sectionType: SectionType
): string {
  const hints = getContractHints(sectionType);
  
  return `${basePrompt}

QUALITY REQUIREMENTS:
${hints}

IMPORTANT: Follow these requirements to ensure the component passes quality validation.`;
}

/**
 * Get pipeline statistics for monitoring.
 */
export interface PipelineStats {
  totalRuns: number;
  successRate: number;
  avgProcessingTimeMs: number;
  sanitizerFixRate: number;
  autoFixSuccessRate: number;
  contractPassRate: number;
}

// In-memory stats (would be persisted in production)
const stats = {
  runs: 0,
  successes: 0,
  totalTimeMs: 0,
  sanitizerFixes: 0,
  autoFixAttempts: 0,
  autoFixSuccesses: 0,
  contractRuns: 0,
  contractPasses: 0,
};

/**
 * Record pipeline result for statistics.
 */
export function recordPipelineResult(result: PipelineResult): void {
  stats.runs++;
  if (result.success) stats.successes++;
  stats.totalTimeMs += result.processingTimeMs;
  if (result.stages.sanitizer.changed) stats.sanitizerFixes++;
  if (result.stages.autoFix.ran) {
    stats.autoFixAttempts++;
    if (result.stages.autoFix.success) stats.autoFixSuccesses++;
  }
  if (result.stages.contract.ran) {
    stats.contractRuns++;
    if (result.stages.contract.valid) stats.contractPasses++;
  }
}

/**
 * Get current pipeline statistics.
 */
export function getPipelineStats(): PipelineStats {
  return {
    totalRuns: stats.runs,
    successRate: stats.runs > 0 ? stats.successes / stats.runs : 0,
    avgProcessingTimeMs: stats.runs > 0 ? stats.totalTimeMs / stats.runs : 0,
    sanitizerFixRate: stats.runs > 0 ? stats.sanitizerFixes / stats.runs : 0,
    autoFixSuccessRate: stats.autoFixAttempts > 0 ? stats.autoFixSuccesses / stats.autoFixAttempts : 0,
    contractPassRate: stats.contractRuns > 0 ? stats.contractPasses / stats.contractRuns : 0,
  };
}

/**
 * Reset pipeline statistics.
 */
export function resetPipelineStats(): void {
  stats.runs = 0;
  stats.successes = 0;
  stats.totalTimeMs = 0;
  stats.sanitizerFixes = 0;
  stats.autoFixAttempts = 0;
  stats.autoFixSuccesses = 0;
  stats.contractRuns = 0;
  stats.contractPasses = 0;
}
