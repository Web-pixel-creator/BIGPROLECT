/**
 * Auto-Fix Loop - Attempts to repair invalid code using LLM
 * 
 * When validation fails, this module:
 * 1. Sends the broken code + error info to LLM for repair
 * 2. Validates the repaired code
 * 3. Retries up to MAX_ATTEMPTS times
 * 4. Falls back to alternative model if primary fails
 */

import { sanitizeGeneratedFile } from './codeSanitizer';
import { validateFile, type ValidationResult, type ValidationError } from './codeValidator';
import { createScopedLogger } from './logger';
import { selectVariant, type PromptVariant } from './promptVariants';
import { getFewShotExamples, formatFewShotExamples } from './fewShotExamples';

const logger = createScopedLogger('AutoFixLoop');

export const MAX_FIX_ATTEMPTS = 3;

export interface AutoFixResult {
  success: boolean;
  code: string;
  attempts: number;
  /** @deprecated Use unifiedViolations instead */
  errors: ValidationError[];
  /** Unified violations with structured codes (preferred) */
  unifiedViolations?: import('~/lib/services/sectionContracts').UnifiedViolation[];
  usedFallback: boolean;
  promptVariant?: PromptVariant;
}

/**
 * Type for LLM repair function.
 * 
 * STRICT CONTRACT: The function receives a fully-formed prompt string
 * and returns the LLM response (which will be processed by extractCodeFromResponse).
 * 
 * This ensures determinism - the same prompt always goes to the LLM,
 * regardless of which provider/model is used.
 */
export type LlmRepairFn = (prompt: string) => Promise<string>;

export interface AutoFixOptions {
  filename: string;
  originalCode: string;
  validationResult: ValidationResult;
  llmRepairFn?: LlmRepairFn;
  fallbackLlmRepairFn?: LlmRepairFn;
  repairContext?: RepairContext;
  variantSelection?: {
    nowMs?: number;
    timestampBucketMs?: number;
    forceVariant?: PromptVariant;
  };
}

/**
 * Attempt to fix invalid code through sanitizer iterations.
 * This is a synchronous fix that doesn't require LLM.
 */
export function attemptSanitizerFix(
  code: string,
  filename: string,
  maxIterations: number = 3
): { code: string; valid: boolean; iterations: number } {
  let currentCode = code;
  let iterations = 0;

  for (let i = 0; i < maxIterations; i++) {
    iterations++;
    
    // Run sanitizer
    const sanitized = sanitizeGeneratedFile(filename, currentCode);
    currentCode = sanitized.content;

    // Validate
    const validation = validateFile(currentCode, filename);
    
    if (validation.valid) {
      logger.debug(`Sanitizer fixed code in ${iterations} iteration(s)`);
      return { code: currentCode, valid: true, iterations };
    }

    // If sanitizer didn't change anything, no point in retrying
    if (!sanitized.changed) {
      break;
    }
  }

  return { code: currentCode, valid: false, iterations };
}

/**
 * Extended repair context for buildRepairPromptV2.
 */
export interface RepairContext {
  /** Unified violations from validator (structured codes) */
  unifiedViolations?: import('~/lib/services/sectionContracts').UnifiedViolation[];
  /** Sanitizer warnings (what was already attempted) */
  sanitizerWarnings?: import('./codeSanitizer').SanitizerWarning[];
  /** Change metrics from sanitizer (risk assessment) */
  metrics?: import('./codeSanitizer').ChangeMetrics;
}

/**
 * Build a repair prompt for LLM to fix the code.
 * Basic version - uses ValidationError array.
 */
export function buildRepairPrompt(
  code: string,
  errors: ValidationError[],
  filename: string
): string {
  const errorList = errors
    .filter(e => e.severity === 'error')
    .slice(0, 5)
    .map(e => `- Line ${e.line}, Col ${e.column}: ${e.message}`)
    .join('\n');

  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  const fileType = ext === '.tsx' ? 'React TypeScript (TSX)' :
                   ext === '.jsx' ? 'React JavaScript (JSX)' :
                   ext === '.ts' ? 'TypeScript' :
                   ext === '.js' ? 'JavaScript' :
                   ext === '.css' ? 'CSS' : 'code';

  return `Fix the following ${fileType} code that has syntax errors.

FILE: ${filename}

ERRORS:
${errorList}

BROKEN CODE:
\`\`\`${ext.slice(1)}
${code}
\`\`\`

INSTRUCTIONS:
1. Fix ONLY the syntax errors listed above
2. Do NOT change the logic or functionality
3. Do NOT add new features or remove existing ones
4. Return ONLY the fixed code, no explanations
5. Ensure all brackets, braces, and tags are properly closed

FIXED CODE:`;
}

/**
 * Build an enhanced repair prompt with unified violations, sanitizer context, and risk metrics.
 * This gives LLM more context about what was already tried and why fixes are risky.
 */
export function buildRepairPromptV2(
  code: string,
  errors: ValidationError[],
  filename: string,
  context?: RepairContext
): string {
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  const fileType = ext === '.tsx' ? 'React TypeScript (TSX)' :
                   ext === '.jsx' ? 'React JavaScript (JSX)' :
                   ext === '.ts' ? 'TypeScript' :
                   ext === '.js' ? 'JavaScript' :
                   ext === '.css' ? 'CSS' : 'code';

  // Build error list from ValidationError (legacy format)
  const errorList = errors
    .filter(e => e.severity === 'error')
    .slice(0, 5)
    .map(e => `- Line ${e.line}, Col ${e.column}: ${e.message}`)
    .join('\n');

  // Build unified violations section (structured codes)
  let unifiedSection = '';
  if (context?.unifiedViolations && context.unifiedViolations.length > 0) {
    const violationList = context.unifiedViolations
      .slice(0, 8)
      .map(v => {
        const loc = v.context?.line ? ` (Line ${v.context.line})` : '';
        const fixable = v.autoFixable ? ' [auto-fixable]' : '';
        return `- ${v.code}${loc}: ${v.message}${fixable}`;
      })
      .join('\n');
    
    unifiedSection = `
UNIFIED_VIOLATIONS:
${violationList}
`;
  }

  // Build sanitizer warnings section (what was already tried)
  let sanitizerSection = '';
  if (context?.sanitizerWarnings && context.sanitizerWarnings.length > 0) {
    const warningList = context.sanitizerWarnings
      .slice(0, 5)
      .map(w => `- ${w.code} (${w.risk} risk): ${w.message}`)
      .join('\n');
    
    sanitizerSection = `
SANITIZER_ALREADY_TRIED:
${warningList}
Note: These fixes were already applied by the sanitizer. Focus on remaining errors.
`;
  }

  // Build metrics section (risk assessment)
  let metricsSection = '';
  if (context?.metrics) {
    const m = context.metrics;
    metricsSection = `
CHANGE_METRICS:
- Risk level: ${m.riskLevel.toUpperCase()}
- Changed lines: ${m.changedLinesPercent}%
- Characters added: ${m.charsAdded}
- Characters removed: ${m.charsRemoved}
- High-risk fixes applied: ${m.highRiskFixes}
${m.riskLevel === 'high' ? 'WARNING: Previous fixes were aggressive. Be conservative with changes.' : ''}
`;
  }

  return `Fix the following ${fileType} code that has syntax errors.

FILE: ${filename}

ERRORS:
${errorList}
${unifiedSection}${sanitizerSection}${metricsSection}
BROKEN CODE:
\`\`\`${ext.slice(1)}
${code}
\`\`\`

INSTRUCTIONS:
1. Fix ONLY the syntax errors listed above
2. Do NOT change the logic or functionality
3. Do NOT add new features or remove existing ones
4. Return ONLY the fixed code, no explanations
5. Ensure all brackets, braces, and tags are properly closed
${context?.metrics?.riskLevel === 'high' ? '6. Be CONSERVATIVE - previous fixes were aggressive, avoid further major changes' : ''}

FIXED CODE:`;
}

/**
 * Repair boundary instructions based on risk level.
 */
export const REPAIR_BOUNDARIES: Record<string, { instructions: string[] }> = {
  low: {
    instructions: [
      'Fix the syntax errors',
      'Prefer minimal changes',
      'Restructure only if strictly necessary for correctness',
    ],
  },
  medium: {
    instructions: [
      'Fix only the syntax errors',
      'Preserve the existing structure',
      'Avoid major refactoring',
    ],
  },
  high: {
    instructions: [
      'Make MINIMAL changes only',
      'Fix only the specific error locations',
      'Do NOT restructure or reformat',
      'Previous fixes were aggressive - be conservative',
    ],
  },
};

/**
 * Get boundary instructions based on risk level.
 */
export function getBoundaryInstructions(riskLevel: 'low' | 'medium' | 'high'): string[] {
  return REPAIR_BOUNDARIES[riskLevel]?.instructions ?? REPAIR_BOUNDARIES.low.instructions;
}

/**
 * Build repair prompt with few-shot examples (fewshot-v1 variant).
 * Includes relevant examples and risk-based boundary instructions.
 */
export function buildRepairPromptWithFewShot(
  code: string,
  errors: ValidationError[],
  filename: string,
  context?: RepairContext
): string {
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  const fileType = ext === '.tsx' ? 'React TypeScript (TSX)' :
                   ext === '.jsx' ? 'React JavaScript (JSX)' :
                   ext === '.ts' ? 'TypeScript' :
                   ext === '.js' ? 'JavaScript' :
                   ext === '.css' ? 'CSS' : 'code';

  // Build error list
  const errorList = errors
    .filter(e => e.severity === 'error')
    .slice(0, 5)
    .map(e => `- Line ${e.line}, Col ${e.column}: ${e.message}`)
    .join('\n');

  // Get violation codes for few-shot matching
  const violationCodes = (context?.unifiedViolations?.map(v => v.code) ?? []) as import('~/lib/services/sectionContracts').ViolationCode[];
  const fewShotExamples = getFewShotExamples(violationCodes, 3);
  const fewShotSection = formatFewShotExamples(fewShotExamples);

  // Build unified violations section
  let unifiedSection = '';
  if (context?.unifiedViolations && context.unifiedViolations.length > 0) {
    const violationList = context.unifiedViolations
      .slice(0, 8)
      .map(v => {
        const loc = v.context?.line ? ` (Line ${v.context.line})` : '';
        return `- ${v.code}${loc}: ${v.message}`;
      })
      .join('\n');
    
    unifiedSection = `
VIOLATIONS:
${violationList}
`;
  }

  // Get risk-based boundary instructions
  const riskLevel = context?.metrics?.riskLevel ?? 'low';
  const boundaryInstructions = getBoundaryInstructions(riskLevel);
  const instructionsList = boundaryInstructions
    .map((instr, i) => `${i + 1}. ${instr}`)
    .join('\n');

  // Add standard instructions
  const standardInstructions = `
${instructionsList}
${boundaryInstructions.length + 1}. Return ONLY the fixed code, no explanations
${boundaryInstructions.length + 2}. Ensure all brackets, braces, and tags are properly closed`;

  return `Fix the following ${fileType} code that has syntax errors.

FILE: ${filename}

ERRORS:
${errorList}
${unifiedSection}${fewShotSection}
BROKEN CODE:
\`\`\`${ext.slice(1)}
${code}
\`\`\`

INSTRUCTIONS:${standardInstructions}

FIXED CODE:`;
}

/**
 * Select prompt builder based on variant.
 */
export function getPromptBuilder(variant: PromptVariant): typeof buildRepairPromptV2 {
  switch (variant) {
    case 'fewshot-v1':
      return buildRepairPromptWithFewShot;
    case 'baseline':
    default:
      return buildRepairPromptV2;
  }
}

/**
 * Extract code from LLM response (handles markdown code blocks).
 */
export function extractCodeFromResponse(response: string): string {
  // Try to extract from markdown code block
  const codeBlockMatch = response.match(/```(?:\w+)?\s*\n([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  // Try to find code between common markers
  const startMarkers = ['FIXED CODE:', 'Here is the fixed code:', 'Fixed:'];
  for (const marker of startMarkers) {
    const idx = response.indexOf(marker);
    if (idx !== -1) {
      const afterMarker = response.substring(idx + marker.length).trim();
      // Check if there's a code block after the marker
      const blockMatch = afterMarker.match(/```(?:\w+)?\s*\n([\s\S]*?)```/);
      if (blockMatch) {
        return blockMatch[1].trim();
      }
      return afterMarker;
    }
  }

  // Return as-is if no markers found
  return response.trim();
}


/**
 * Main auto-fix loop with LLM repair.
 */
export async function autoFixWithLlm(options: AutoFixOptions): Promise<AutoFixResult> {
  const { filename, originalCode, validationResult, llmRepairFn, fallbackLlmRepairFn, repairContext } = options;
  
  let currentCode = originalCode;
  let attempts = 0;
  let usedFallback = false;
  let lastErrors = validationResult.errors;
  let lastUnifiedViolations = validationResult.unifiedViolations;
  const sanitizerWarnings = repairContext?.sanitizerWarnings;
  const metrics = repairContext?.metrics;

  // First, try sanitizer-only fix
  const sanitizerResult = attemptSanitizerFix(currentCode, filename);
  if (sanitizerResult.valid) {
    return {
      success: true,
      code: sanitizerResult.code,
      attempts: 0,
      errors: [],
      unifiedViolations: [],
      usedFallback: false,
    };
  }
  currentCode = sanitizerResult.code;

  // If no LLM repair function provided, return sanitizer result
  if (!llmRepairFn) {
    return {
      success: false,
      code: currentCode,
      attempts: 0,
      errors: lastErrors,
      unifiedViolations: lastUnifiedViolations,
      usedFallback: false,
    };
  }

  const promptVariant = selectVariant({
    filename,
    nowMs: options.variantSelection?.nowMs ?? Date.now(),
    timestampBucketMs: options.variantSelection?.timestampBucketMs,
    forceVariant: options.variantSelection?.forceVariant,
  });

  // Select prompt builder based on variant
  const buildPrompt = getPromptBuilder(promptVariant);

  // Try LLM repair with primary model
  for (let i = 0; i < MAX_FIX_ATTEMPTS; i++) {
    attempts++;
    logger.info(`Auto-fix attempt ${attempts}/${MAX_FIX_ATTEMPTS} for ${filename} (variant: ${promptVariant})`);

    try {
      // Build the repair prompt using variant-specific builder
      const repairPrompt = buildPrompt(currentCode, lastErrors, filename, {
        unifiedViolations: lastUnifiedViolations,
        sanitizerWarnings,
        metrics,
      });
      
      // Send prompt to LLM and get response
      const llmResponse = await llmRepairFn(repairPrompt);
      const repairedCode = extractCodeFromResponse(llmResponse);

      // Sanitize the repaired code
      const sanitized = sanitizeGeneratedFile(filename, repairedCode);
      currentCode = sanitized.content;

      // Validate
      const validation = validateFile(currentCode, filename);
      lastErrors = validation.errors;
      lastUnifiedViolations = validation.unifiedViolations;

      if (validation.valid) {
        logger.info(`Auto-fix succeeded after ${attempts} attempt(s)`);
        return {
          success: true,
          code: currentCode,
          attempts,
          errors: [],
          unifiedViolations: [],
          usedFallback: false,
          promptVariant,
        };
      }

      logger.debug(`Attempt ${attempts} still has ${validation.errors.length} error(s)`);
    } catch (error) {
      logger.error(`Auto-fix attempt ${attempts} failed:`, error);
    }
  }

  // Try fallback model if available
  if (fallbackLlmRepairFn) {
    logger.info(`Trying fallback model for ${filename} (variant: ${promptVariant})`);
    usedFallback = true;

    try {
      // Build prompt using variant-specific builder
      const repairPrompt = buildPrompt(currentCode, lastErrors, filename, {
        unifiedViolations: lastUnifiedViolations,
        sanitizerWarnings,
        metrics,
      });
      const llmResponse = await fallbackLlmRepairFn(repairPrompt);
      const repairedCode = extractCodeFromResponse(llmResponse);

      const sanitized = sanitizeGeneratedFile(filename, repairedCode);
      currentCode = sanitized.content;

      const validation = validateFile(currentCode, filename);
      lastErrors = validation.errors;
      lastUnifiedViolations = validation.unifiedViolations;

      if (validation.valid) {
        logger.info(`Fallback model fixed the code`);
        return {
          success: true,
          code: currentCode,
          attempts: attempts + 1,
          errors: [],
          unifiedViolations: [],
          usedFallback: true,
          promptVariant,
        };
      }
    } catch (error) {
      logger.error(`Fallback model failed:`, error);
    }
  }

  // All attempts failed
  logger.warn(`Auto-fix failed after ${attempts} attempts for ${filename}`);
  return {
    success: false,
    code: currentCode,
    attempts,
    errors: lastErrors,
    unifiedViolations: lastUnifiedViolations,
    usedFallback,
    promptVariant,
  };
}

/**
 * Quick fix attempt without LLM - just sanitizer iterations.
 * Use this for fast, synchronous fixes.
 */
export function quickFix(code: string, filename: string): {
  code: string;
  valid: boolean;
  changed: boolean;
} {
  const result = attemptSanitizerFix(code, filename, 3);
  return {
    code: result.code,
    valid: result.valid,
    changed: result.code !== code,
  };
}

/**
 * Check if errors are likely fixable by auto-fix.
 */
export function areErrorsAutoFixable(errors: ValidationError[]): boolean {
  // Errors that are typically auto-fixable
  const autoFixableCodes = new Set([
    1005, // '}' expected
    1002, // Unterminated string literal
    1003, // Identifier expected
    1109, // Expression expected
    1128, // Declaration or statement expected
    17001, // Mismatched JSX tags
    17002, // Unclosed JSX tag
    17003, // Unbalanced braces
    17004, // Unbalanced parentheses
    17005, // Duplicate imports
    17006, // Multiple export default
    18001, // Unbalanced CSS braces
    18002, // Unclosed CSS comment
  ]);

  const fixableErrors = errors.filter(e => 
    e.severity === 'error' && autoFixableCodes.has(e.code)
  );

  // Consider fixable if at least half of errors are in the fixable set
  const errorCount = errors.filter(e => e.severity === 'error').length;
  return fixableErrors.length >= errorCount / 2;
}

/**
 * Get a summary of what went wrong for logging/debugging.
 */
export function getErrorSummary(errors: ValidationError[]): string {
  const errorsByType = new Map<string, number>();
  
  for (const error of errors) {
    const key = error.message.split(':')[0].trim();
    errorsByType.set(key, (errorsByType.get(key) || 0) + 1);
  }

  return Array.from(errorsByType.entries())
    .map(([type, count]) => `${type} (${count})`)
    .join(', ');
}
