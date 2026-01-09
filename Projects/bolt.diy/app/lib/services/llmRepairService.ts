/**
 * LLM Repair Service - Creates repair functions for auto-fix loop
 *
 * This module provides the bridge between autoFixLoop and the LLM API.
 * It creates llmRepairFn that can be passed to autoFixWithLlm.
 *
 * STRICT CONTRACT: The repair function receives a fully-formed prompt string
 * and returns the raw LLM response. Prompt building and response parsing
 * are handled by autoFixLoop.ts (single source of truth).
 */

import type { LlmRepairFn } from '~/utils/autoFixLoop';
import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('LLMRepairService');

/**
 * Configuration for LLM repair.
 */
export interface LlmRepairConfig {
  /** API endpoint for LLM calls */
  apiEndpoint?: string;

  /** Model to use for repair */
  model?: string;

  /** Provider name */
  provider?: string;

  /** Maximum tokens for response */
  maxTokens?: number;

  /** Timeout in milliseconds */
  timeout?: number;
}

const DEFAULT_CONFIG: Required<LlmRepairConfig> = {
  apiEndpoint: '/api/llmcall',
  model: 'gemini-2.0-flash-exp',
  provider: 'Google',
  maxTokens: 8192,
  timeout: 30000,
};

/**
 * Create an LLM repair function for use with autoFixWithLlm.
 *
 * STRICT CONTRACT: Returns a function that takes a prompt string
 * and returns the raw LLM response. The caller (autoFixLoop) is
 * responsible for building the prompt and parsing the response.
 *
 * @param config - Configuration options
 * @returns A function that takes a prompt and returns LLM response
 */
export function createLlmRepairFn(config: LlmRepairConfig = {}): LlmRepairFn {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  return async (prompt: string): Promise<string> => {
    logger.info(`Requesting LLM repair`);
    logger.debug(`Using model: ${finalConfig.model}`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), finalConfig.timeout);

      const response = await fetch(finalConfig.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Strict response contract with sentinel
          system: `You are a code repair assistant. Fix syntax errors in code.

STRICT RESPONSE CONTRACT:
1. Return ONLY the fixed code, no explanations.
2. Do NOT wrap the code in markdown fences.
3. Start your response with the FIRST line of code.
4. End your response with the LAST line of code, then write: <<<END_CODE>>>
5. Do NOT include any text after <<<END_CODE>>>`,
          message: prompt,
          model: finalConfig.model,
          provider: { name: finalConfig.provider },
          streamOutput: false,

          // Purpose: repair needs larger token cap (8192) vs template selection (1024)
          purpose: 'repair',

          // Stop sequence: only the sentinel to avoid false positives
          stopSequences: ['<<<END_CODE>>>'],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(`LLM repair request failed: ${response.status} ${errorText}`);
        throw new Error(`LLM repair failed: ${response.status}`);
      }

      const result = (await response.json()) as { text?: string; content?: string };

      // Extract the text from the response
      const responseText = result.text || result.content || '';

      if (!responseText) {
        logger.warn('LLM returned empty response');
        throw new Error('LLM returned empty response');
      }

      logger.info(`LLM repair completed`);
      logger.debug(`Response length: ${responseText.length} chars`);

      // Return raw response - caller will parse it
      return responseText;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        logger.error(`LLM repair timed out`);
        throw new Error('LLM repair timed out');
      }

      logger.error(`LLM repair error:`, error);
      throw error;
    }
  };
}

/**
 * Create a fallback LLM repair function using a different model.
 * Used when primary model fails.
 */
export function createFallbackLlmRepairFn(config: LlmRepairConfig = {}): LlmRepairFn {
  // Use a more stable/reliable model as fallback
  const fallbackConfig: LlmRepairConfig = {
    ...config,
    model: config.model || 'llama-3.3-70b-versatile',
    provider: config.provider || 'Groq',
  };

  return createLlmRepairFn(fallbackConfig);
}

/**
 * Check if LLM repair is available (API endpoint exists).
 */
export async function isLlmRepairAvailable(): Promise<boolean> {
  try {
    // Simple check - just verify the endpoint responds
    const response = await fetch('/api/llmcall', {
      method: 'OPTIONS',
    });
    return response.ok || response.status === 405; // 405 = method not allowed but endpoint exists
  } catch {
    return false;
  }
}
