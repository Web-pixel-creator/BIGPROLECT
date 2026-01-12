/**
 * Prompt pipeline logger (disabled by default).
 * Enable with BOLT_PROMPT_DEBUG=1.
 */

const PROMPT_DEBUG_ENABLED =
  typeof process !== 'undefined' &&
  typeof process.env !== 'undefined' &&
  process.env.BOLT_PROMPT_DEBUG === '1';

export const promptLog = (...args: unknown[]) => {
  if (!PROMPT_DEBUG_ENABLED) {
    return;
  }

  console.log(...args);
};

export const promptWarn = (...args: unknown[]) => {
  if (!PROMPT_DEBUG_ENABLED) {
    return;
  }

  console.warn(...args);
};

export const promptError = (...args: unknown[]) => {
  if (!PROMPT_DEBUG_ENABLED) {
    return;
  }

  console.error(...args);
};
