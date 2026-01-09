import type { WebContainer } from '@webcontainer/api';
import { sanitizeGeneratedFile } from '~/utils/codeSanitizer';
import { createScopedLogger } from '~/utils/logger';
import { toast } from 'react-toastify';

const logger = createScopedLogger('SelfHealer');

export interface HealResult {
  healed: boolean;
  file?: string;
  error?: string;
}

/**
 * Analyzes a log line to see if it contains a fixable build error.
 */
export function analyzeError(logLine: string): { file: string; type: string } | null {
  /*
   * Fix 15-18 in codeSanitizer.ts specifically address this "Expected corresponding JSX closing tag" error.
   * Pattern example: [plugin:vite:react-babel] /home/project/src/App.tsx: Expected corresponding JSX closing tag for <h4>.
   */
  if (logLine.includes('Expected corresponding JSX closing tag')) {
    // Regex to extract filename. It usually starts with /home/project/
    const match = logLine.match(/(\/home\/project\/[\w\-\/]+\.(?:tsx|jsx))/);

    if (match) {
      return { file: match[1], type: 'jsx-closing-tag' };
    }
  }

  // Pattern: Unclosed string or general syntax error that usually points to a file
  if (logLine.includes('SyntaxError') || logLine.includes('Parse error') || logLine.includes('Unexpected token')) {
    const match = logLine.match(/(\/home\/project\/[\w\-\/]+\.(?:tsx|jsx|ts|js))/);

    if (match) {
      return { file: match[1], type: 'syntax-error' };
    }
  }

  // Pattern: build tool parse errors with explicit file path (e.g., Expected "}" but found)
  if (logLine.includes('Expected') && logLine.includes('/home/project/')) {
    const match = logLine.match(/(\/home\/project\/[\w\-\/]+\.(?:tsx|jsx|ts|js|mjs|cjs|mts))/);

    if (match) {
      return { file: match[1], type: 'syntax-error' };
    }
  }

  // Pattern: PostCSS/Vite CSS errors (e.g., unclosed block)
  if (logLine.includes('postcss') || logLine.includes('[postcss]')) {
    const match = logLine.match(/(\/home\/project\/[\w\-\/]+\.(?:css|scss))/);

    if (match) {
      return { file: match[1], type: 'css-error' };
    }
  }

  // Pattern: HTML parse errors (parse5)
  if (logLine.includes('Unable to parse HTML') || logLine.includes('parse5')) {
    const match = logLine.match(/(\/home\/project\/[\w\-\/]+\.html)/);

    if (match) {
      return { file: match[1], type: 'html-error' };
    }

    return { file: '/home/project/index.html', type: 'html-error' };
  }

  // Pattern: PostCSS config parse errors (no file path in log)
  if (logLine.includes('PostCSS config') || logLine.includes('postcss config')) {
    return { file: '/home/project/postcss.config.js', type: 'postcss-config' };
  }

  // Pattern: module.exports used in ESM (common in postcss.config.js when type=module)
  if (logLine.includes('module is not defined in ES module scope')) {
    return { file: '/home/project/postcss.config.js', type: 'postcss-config' };
  }

  return null;
}

/**
 * Attempts to fix the file using codeSanitizer.
 */
export async function healFile(webcontainer: WebContainer, filePath: string, errorType: string): Promise<HealResult> {
  logger.info(`🏥 Self-Healer triggered for ${filePath} (${errorType})`);

  try {
    // Normalize path: remove /home/project/ prefix if present, as WebContainer fs is relative to root
    const relativePath = filePath.replace(/^\/home\/project\//, '');

    // Read file
    let content: string;

    try {
      content = await webcontainer.fs.readFile(relativePath, 'utf-8');
    } catch (e) {
      logger.error(`Failed to read file ${relativePath}`, e);
      return { healed: false, error: 'Read failed' };
    }

    /*
     * Attempt fix
     * We rely on sanitizeGeneratedFile because we've already added robust regexes there
     */
    const result = sanitizeGeneratedFile(relativePath, content);

    if (result.changed) {
      await webcontainer.fs.writeFile(relativePath, result.content);
      logger.info(`✅ Healed ${relativePath} successfully.`);

      // Notify user via toast if possible (this runs in client context)
      if (typeof window !== 'undefined') {
        // using console as a safe notification fallback
        console.log(
          `%c✨ Bolt Self-Healer fixed ${relativePath}`,
          'background: #22c55e; color: black; padding: 4px; border-radius: 4px;',
        );
      }

      return { healed: true, file: relativePath };
    } else {
      logger.warn(`🩹 Sanitizer found no clean-up for ${relativePath}. The error might be complex.`);
      return { healed: false, error: 'No changes made' };
    }
  } catch (err) {
    logger.error('Healing failed:', err);
    return { healed: false, error: String(err) };
  }
}
