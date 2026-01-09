import type { WebContainer } from '@webcontainer/api';
import { path as nodePath } from '~/utils/path';
import { atom, map, type MapStore } from 'nanostores';
import type { ActionAlert, BoltAction, DeployAlert, FileHistory, SupabaseAction, SupabaseAlert } from '~/types/actions';
import type { UnifiedViolation, ViolationCode } from '~/lib/services/sectionContracts';
import type { SectionContract } from '~/types/section-contract';
import { createScopedLogger } from '~/utils/logger';
import { sanitizeGeneratedFile } from '~/utils/codeSanitizer';
import { validateFile, type ValidationResult } from '~/utils/codeValidator';
import { quickFix, areErrorsAutoFixable, autoFixWithLlm } from '~/utils/autoFixLoop';
import { createLlmRepairFn, createFallbackLlmRepairFn } from '~/lib/services/llmRepairService';
import { emitQuarantineWritten } from '~/lib/services/pipelineTelemetry';
import { unreachable } from '~/utils/unreachable';
import { preflightViteReactBaseline } from './project-preflight';
import type { ActionCallbackData } from './message-parser';
import type { BoltShell } from '~/utils/shell';

const logger = createScopedLogger('ActionRunner');

const ALLOWED_SECTION_ROOTS = ['src/', 'app/', 'components/'];

const SECTION_ALIASES: Record<string, string[]> = {
  navigation: ['nav', 'navbar', 'header', 'topbar', 'top-bar'],
  hero: ['hero', 'hero-section', 'hero-banner', 'banner', 'intro'],
  features: ['features', 'feature-list', 'highlights'],
  gallery: ['gallery', 'portfolio', 'showcase'],
  testimonials: ['testimonials', 'reviews', 'quotes'],
  pricing: ['pricing', 'plans', 'tiers'],
  cta: ['cta', 'call-to-action', 'calltoaction'],
  faq: ['faq', 'questions', 'qna'],
  footer: ['footer', 'site-footer'],
  about: ['about', 'story', 'our-story'],
  team: ['team', 'people', 'staff'],
  contact: ['contact', 'contact-us', 'get-in-touch', 'form'],
  blog: ['blog', 'news', 'articles'],
  logo: ['logo', 'logos', 'partners', 'clients'],
  products: ['products', 'product', 'product-grid', 'catalog', 'shop', 'listing'],
  categories: ['categories', 'category', 'genres', 'genre', 'filters', 'tags'],
  editorial: ['editorial', 'story-section', 'magazine'],
  newsletter: ['newsletter', 'subscribe', 'email-signup'],
};

const DATA_SECTION_REGEX = /data-section\s*=\s*(?:\{\s*)?["']([^"']+)["'](?:\s*\})?/g;
const SECTION_BLOCK_REGEX =
  /<section\b[^>]*data-section\s*=\s*(?:\{\s*)?["']([^"']+)["'](?:\s*\})?[^>]*>([\s\S]*?)<\/section>/gi;
const IMG_SRC_REGEX = /<img\b[^>]*\bsrc\s*=\s*(?:\{\s*)?["']([^"']+)["'](?:\s*\})?[^>]*>/gi;

const normalizeSectionValue = (value: string) =>
  value
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const isAllowedSectionRoot = (normalizedPath: string) =>
  ALLOWED_SECTION_ROOTS.some((root) => normalizedPath.startsWith(root));

/**
 * Check if file is a modular section component file.
 * Pattern: src/components/*Section.tsx or src/components/Navigation.tsx, Footer.tsx, etc.
 */
const isModularSectionFile = (normalizedPath: string): boolean => {
  // Must be in src/components/
  if (!normalizedPath.startsWith('src/components/')) {
    return false;
  }

  // Must be a direct child (not nested)
  const relativePath = normalizedPath.replace('src/components/', '');

  if (relativePath.includes('/')) {
    return false;
  }

  // Must be .tsx or .jsx
  if (!relativePath.endsWith('.tsx') && !relativePath.endsWith('.jsx')) {
    return false;
  }

  // Check for section-like naming patterns
  const filename = relativePath.replace(/\.(tsx|jsx)$/, '');
  const sectionPatterns = [
    /Section$/i, // HeroSection, FeaturesSection
    /^(Navigation|Nav|Header|Footer|Hero|Features|Pricing|Testimonials|Gallery|FAQ|CTA|Contact|About|Team|Blog|Newsletter)$/i,
  ];

  return sectionPatterns.some((pattern) => pattern.test(filename));
};

/**
 * Check if file is the main App composition file.
 */
const isAppCompositionFile = (normalizedPath: string): boolean => {
  return normalizedPath === 'src/App.tsx' || normalizedPath === 'src/App.jsx';
};

/**
 * Detect if content is a single-section component (modular mode).
 * Returns the section type if it's a single-section file, null otherwise.
 */
const detectSingleSectionType = (content: string): string | null => {
  const dataSections = extractDataSectionValues(content);

  // Single data-section = modular section file
  if (dataSections.length === 1) {
    return dataSections[0];
  }

  return null;
};

const extractDataSectionValues = (content: string): string[] => {
  const values: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = DATA_SECTION_REGEX.exec(content)) !== null) {
    if (match[1]) {
      values.push(match[1]);
    }
  }

  return values;
};

const findExpectedSectionKey = (actualValue: string, expectedKeys: string[]): string | null => {
  const normalizedActual = normalizeSectionValue(actualValue);

  for (const expectedKey of expectedKeys) {
    const candidates = [expectedKey, ...(SECTION_ALIASES[expectedKey] ?? [])].map(normalizeSectionValue);

    if (candidates.includes(normalizedActual)) {
      return expectedKey;
    }
  }

  return null;
};

const extractSectionBlocks = (content: string, expectedKeys: string[]): Map<string, string> => {
  const blocks = new Map<string, string>();
  let match: RegExpExecArray | null;

  while ((match = SECTION_BLOCK_REGEX.exec(content)) !== null) {
    const rawValue = match[1] ?? '';
    const blockContent = match[2] ?? '';
    const matchedKey = findExpectedSectionKey(rawValue, expectedKeys) ?? normalizeSectionValue(rawValue);

    if (matchedKey && !blocks.has(matchedKey)) {
      blocks.set(matchedKey, blockContent);
    }
  }

  return blocks;
};

const extractImageSources = (content: string): string[] => {
  const sources: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = IMG_SRC_REGEX.exec(content)) !== null) {
    if (match[1]) {
      sources.push(match[1].replace(/&amp;/g, '&'));
    }
  }

  return sources;
};

const getUnifiedErrorCount = (violations: UnifiedViolation[] | undefined) =>
  (violations ?? []).filter((v) => v.severity === 'error').length;

const isValidationAutoFixable = (validation: ValidationResult) => {
  const unifiedErrors = (validation.unifiedViolations ?? []).filter((v) => v.severity === 'error');

  if (unifiedErrors.length > 0) {
    const fixable = unifiedErrors.filter((v) => v.autoFixable).length;
    return fixable >= unifiedErrors.length / 2;
  }

  return areErrorsAutoFixable(validation.errors);
};

const formatUnifiedViolationLine = (violation: UnifiedViolation) => {
  const line = typeof violation.context?.line === 'number' ? violation.context.line : undefined;
  const column = typeof violation.context?.column === 'number' ? violation.context.column : undefined;
  const location = line ? `Line ${line}${column ? `:${column}` : ''}: ` : '';

  return `${violation.code}: ${location}${violation.message}`;
};

const formatUnifiedErrorsSummary = (violations: UnifiedViolation[] | undefined, max = 5) =>
  (violations ?? [])
    .filter((v) => v.severity === 'error')
    .slice(0, max)
    .map(formatUnifiedViolationLine)
    .join('\n');

const buildPageContractViolations = (args: {
  file: string;
  expectedKeys: string[];
  actualMatched: string[];
  missing: string[];
  outOfOrder: string[];
  extras: string[];
  imageCountFailures: string[];
  imageDuplicateFailures: string[];
  invalidImageUrls: string[];
}): UnifiedViolation[] => {
  const violations: UnifiedViolation[] = [];
  const contextBase = {
    file: args.file,
    expectedSections: args.expectedKeys,
    actualSections: args.actualMatched,
  };

  if (args.missing.length > 0) {
    violations.push({
      code: 'CONTRACT_PAGE_MISSING_SECTION',
      severity: 'error',
      message: `Missing sections: ${args.missing.join(', ')}`,
      autoFixable: true,
      context: { ...contextBase, missing: args.missing },
    });
  }

  if (args.outOfOrder.length > 0) {
    violations.push({
      code: 'CONTRACT_PAGE_WRONG_ORDER',
      severity: 'error',
      message: `Out-of-order sections: ${args.outOfOrder.join(', ')}`,
      autoFixable: true,
      context: { ...contextBase, outOfOrder: args.outOfOrder },
    });
  }

  if (args.extras.length > 0) {
    violations.push({
      code: 'CONTRACT_PAGE_UNKNOWN_SECTION',
      severity: 'warning',
      message: `Unknown sections: ${args.extras.join(', ')}`,
      autoFixable: true,
      context: { ...contextBase, unknown: args.extras },
    });
  }

  if (args.imageCountFailures.length > 0) {
    violations.push({
      code: 'CONTRACT_PAGE_IMAGE_COUNT',
      severity: 'error',
      message: `Image counts below minimum: ${args.imageCountFailures.join(', ')}`,
      autoFixable: true,
      context: { ...contextBase, imageCountFailures: args.imageCountFailures },
    });
  }

  if (args.imageDuplicateFailures.length > 0) {
    violations.push({
      code: 'CONTRACT_PAGE_IMAGE_DUPLICATE',
      severity: 'warning',
      message: `Duplicate images in section: ${args.imageDuplicateFailures.join(', ')}`,
      autoFixable: true,
      context: { ...contextBase, imageDuplicateFailures: args.imageDuplicateFailures },
    });
  }

  if (args.invalidImageUrls.length > 0) {
    violations.push({
      code: 'CONTRACT_PAGE_IMAGE_INVALID',
      severity: 'error',
      message: `Images not in IMAGES list: ${args.invalidImageUrls.slice(0, 5).join(', ')}`,
      autoFixable: true,
      context: { ...contextBase, invalidImageUrls: args.invalidImageUrls },
    });
  }

  return violations;
};

export type ActionStatus = 'pending' | 'running' | 'complete' | 'aborted' | 'failed';

export type BaseActionState = BoltAction & {
  status: Exclude<ActionStatus, 'failed'>;
  abort: () => void;
  executed: boolean;
  abortSignal: AbortSignal;
};

export type FailedActionState = BoltAction &
  Omit<BaseActionState, 'status'> & {
    status: Extract<ActionStatus, 'failed'>;
    error: string;
  };

export type ActionState = BaseActionState | FailedActionState;

type BaseActionUpdate = Partial<Pick<BaseActionState, 'status' | 'abort' | 'executed'>>;

export type ActionStateUpdate =
  | BaseActionUpdate
  | (Omit<BaseActionUpdate, 'status'> & { status: 'failed'; error: string });

type ActionsMap = MapStore<Record<string, ActionState>>;

class ActionCommandError extends Error {
  readonly _output: string;
  readonly _header: string;

  constructor(message: string, output: string) {
    // Create a formatted message that includes both the error message and output
    const formattedMessage = `Failed To Execute Shell Command: ${message}\n\nOutput:\n${output}`;
    super(formattedMessage);

    // Set the output separately so it can be accessed programmatically
    this._header = message;
    this._output = output;

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, ActionCommandError.prototype);

    // Set the name of the error for better debugging
    this.name = 'ActionCommandError';
  }

  // Optional: Add a method to get just the terminal output
  get output() {
    return this._output;
  }
  get header() {
    return this._header;
  }
}

export class ActionRunner {
  #webcontainer: Promise<WebContainer>;
  #currentExecutionPromise: Promise<void> = Promise.resolve();
  #shellTerminal: () => BoltShell;
  #autoFixAttempts = new Map<string, number>();
  #autoFixSectionAttempts = new Map<string, number>();
  #sectionContract?: SectionContract;
  runnerId = atom<string>(`${Date.now()}`);
  actions: ActionsMap = map({});
  onAlert?: (alert: ActionAlert) => void;
  onSupabaseAlert?: (alert: SupabaseAlert) => void;
  onDeployAlert?: (alert: DeployAlert) => void;
  buildOutput?: { path: string; exitCode: number; output: string };

  constructor(
    webcontainerPromise: Promise<WebContainer>,
    getShellTerminal: () => BoltShell,
    onAlert?: (alert: ActionAlert) => void,
    onSupabaseAlert?: (alert: SupabaseAlert) => void,
    onDeployAlert?: (alert: DeployAlert) => void,
    sectionContract?: SectionContract,
  ) {
    this.#webcontainer = webcontainerPromise;
    this.#shellTerminal = getShellTerminal;
    this.onAlert = onAlert;
    this.onSupabaseAlert = onSupabaseAlert;
    this.onDeployAlert = onDeployAlert;
    this.#sectionContract = sectionContract;
  }

  addAction(data: ActionCallbackData) {
    const { actionId } = data;

    const actions = this.actions.get();
    const action = actions[actionId];

    if (action) {
      // action already added
      return;
    }

    const abortController = new AbortController();

    this.actions.setKey(actionId, {
      ...data.action,
      status: 'pending',
      executed: false,
      abort: () => {
        abortController.abort();
        this.#updateAction(actionId, { status: 'aborted' });
      },
      abortSignal: abortController.signal,
    });

    this.#currentExecutionPromise.then(() => {
      this.#updateAction(actionId, { status: 'running' });
    });
  }

  async runAction(data: ActionCallbackData, isStreaming: boolean = false) {
    const { actionId } = data;
    const action = this.actions.get()[actionId];

    if (!action) {
      unreachable(`Action ${actionId} not found`);
    }

    if (action.executed) {
      return; // No return value here
    }

    if (isStreaming && action.type !== 'file') {
      return; // No return value here
    }

    this.#updateAction(actionId, { ...action, ...data.action, executed: !isStreaming });

    this.#currentExecutionPromise = this.#currentExecutionPromise
      .then(() => {
        return this.#executeAction(actionId, isStreaming);
      })
      .catch((error) => {
        logger.error('Action execution promise failed:', error);
      });

    await this.#currentExecutionPromise;

    return;
  }

  async #executeAction(actionId: string, isStreaming: boolean = false) {
    const action = this.actions.get()[actionId];

    this.#updateAction(actionId, { status: 'running' });

    try {
      switch (action.type) {
        case 'shell': {
          await this.#runShellAction(action);
          break;
        }
        case 'file': {
          await this.#runFileAction(action);
          break;
        }
        case 'supabase': {
          try {
            await this.handleSupabaseAction(action as SupabaseAction);
          } catch (error: any) {
            // Update action status
            this.#updateAction(actionId, {
              status: 'failed',
              error: error instanceof Error ? error.message : 'Supabase action failed',
            });

            // Return early without re-throwing
            return;
          }
          break;
        }
        case 'build': {
          const buildOutput = await this.#runBuildAction(action);

          // Store build output for deployment
          this.buildOutput = buildOutput;
          break;
        }
        case 'start': {
          // making the start app non blocking

          this.#runStartAction(action)
            .then(() => this.#updateAction(actionId, { status: 'complete' }))
            .catch((err: Error) => {
              if (action.abortSignal.aborted) {
                return;
              }

              this.#updateAction(actionId, { status: 'failed', error: 'Action failed' });
              logger.error(`[${action.type}]:Action failed\n\n`, err);

              if (!(err instanceof ActionCommandError)) {
                return;
              }

              this.onAlert?.({
                type: 'error',
                title: 'Dev Server Failed',
                description: err.header,
                content: err.output,
              });
            });

          /*
           * adding a delay to avoid any race condition between 2 start actions
           * i am up for a better approach
           */
          await new Promise((resolve) => setTimeout(resolve, 2000));

          return;
        }
      }

      this.#updateAction(actionId, {
        status: isStreaming ? 'running' : action.abortSignal.aborted ? 'aborted' : 'complete',
      });
    } catch (error) {
      if (action.abortSignal.aborted) {
        return;
      }

      this.#updateAction(actionId, { status: 'failed', error: 'Action failed' });
      logger.error(`[${action.type}]:Action failed\n\n`, error);

      if (!(error instanceof ActionCommandError)) {
        return;
      }

      this.onAlert?.({
        type: 'error',
        title: 'Dev Server Failed',
        description: error.header,
        content: error.output,
      });

      // re-throw the error to be caught in the promise chain
      throw error;
    }
  }

  async #runShellAction(action: ActionState) {
    if (action.type !== 'shell') {
      unreachable('Expected shell action');
    }

    const shell = this.#shellTerminal();
    await shell.ready();

    if (!shell || !shell.terminal || !shell.process) {
      unreachable('Shell terminal not found');
    }

    // Pre-validate command for common issues
    const validationResult = await this.#validateShellCommand(action.content);

    if (validationResult.shouldModify && validationResult.modifiedCommand) {
      logger.debug(`Modified command: ${action.content} -> ${validationResult.modifiedCommand}`);
      action.content = validationResult.modifiedCommand;
    }

    await this.#maybePreflightProject(action.content);

    const resp = await shell.executeCommand(this.runnerId.get(), action.content, () => {
      logger.debug(`[${action.type}]:Aborting Action\n\n`, action);
      action.abort();
    });
    logger.debug(`${action.type} Shell Response: [exit code:${resp?.exitCode}]`);

    if (resp?.exitCode != 0) {
      const enhancedError = this.#createEnhancedShellError(action.content, resp?.exitCode, resp?.output);
      throw new ActionCommandError(enhancedError.title, enhancedError.details);
    }

    await this.#maybePostflightProject(action.content);
  }

  async #runStartAction(action: ActionState) {
    if (action.type !== 'start') {
      unreachable('Expected shell action');
    }

    if (!this.#shellTerminal) {
      unreachable('Shell terminal not found');
    }

    const shell = this.#shellTerminal();
    await shell.ready();

    if (!shell || !shell.terminal || !shell.process) {
      unreachable('Shell terminal not found');
    }

    await this.#maybePreflightProject(action.content);

    const resp = await shell.executeCommand(this.runnerId.get(), action.content, () => {
      logger.debug(`[${action.type}]:Aborting Action\n\n`, action);
      action.abort();
    });
    logger.debug(`${action.type} Shell Response: [exit code:${resp?.exitCode}]`);

    if (resp?.exitCode != 0) {
      throw new ActionCommandError('Failed To Start Application', resp?.output || 'No Output Available');
    }

    return resp;
  }

  async #maybePreflightProject(command: string) {
    const wantsInstall = /\b(npm|pnpm|yarn)\s+install\b/.test(command);
    const wantsDev = /\b(npm|pnpm|yarn)\s+run\s+dev\b/.test(command) || /\bpnpm\s+dev\b/.test(command);

    if (!wantsInstall && !wantsDev) {
      return;
    }

    try {
      const webcontainer = await this.#webcontainer;
      const result = await preflightViteReactBaseline(webcontainer);

      /*
       * If we're about to start dev server, ensure deps are installed when preflight mutated package.json
       * or when the project doesn't have node_modules yet. This prevents "black screen" loops where Vite
       * fails to resolve imports after registry/CLI commands wrote files directly.
       */
      if (wantsDev && result.isViteReact) {
        const hasNodeModules = await (async () => {
          try {
            await webcontainer.fs.readdir('node_modules');
            return true;
          } catch {
            return false;
          }
        })();

        const needsInstall =
          !hasNodeModules ||
          result.packageJsonChanged ||
          (result.addedDependencies && result.addedDependencies.length > 0);

        if (needsInstall) {
          const installProcess = await webcontainer.spawn('npm', ['install']);
          let output = '';
          installProcess.output.pipeTo(
            new WritableStream({
              write(data) {
                output += data;
              },
            }),
          );

          // Add timeout to prevent infinite hang (3 minutes)
          const INSTALL_TIMEOUT_MS = 180000;
          let timeoutId: ReturnType<typeof setTimeout> | undefined;

          const timeoutPromise = new Promise<number>((resolve) => {
            timeoutId = setTimeout(() => {
              logger.warn('Preflight npm install timeout - killing process');

              try {
                installProcess.kill();
              } catch {
                // Process may already be dead
              }
              resolve(-1);
            }, INSTALL_TIMEOUT_MS);
          });

          const exitCode = await Promise.race([installProcess.exit, timeoutPromise]);

          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          if (exitCode === -1) {
            logger.warn('Preflight npm install timed out after 3 minutes');
          } else if (exitCode !== 0) {
            logger.debug('Preflight npm install failed:', output);
          } else {
            logger.debug('Preflight npm install completed');
          }
        }
      }
    } catch (error) {
      logger.debug('Preflight failed:', error);
    }
  }

  async #maybePostflightProject(command: string) {
    /*
     * Commands like `pnpm dlx shadcn ...` can write files directly inside the WebContainer and bypass
     * our per-file sanitizer. Run a postflight pass to normalize imports/URLs and ensure deps.
     */
    const isShadcnCommand = /\bshadcn\b/i.test(command) || /\b@21st-dev\/cli\b/i.test(command);

    if (!isShadcnCommand) {
      return;
    }

    try {
      const webcontainer = await this.#webcontainer;
      const result = await preflightViteReactBaseline(webcontainer);

      // If deps changed, install immediately so the running preview doesn't white-screen on missing packages.
      if (result.isViteReact && (result.packageJsonChanged || result.addedDependencies.length > 0)) {
        const installProcess = await webcontainer.spawn('npm', ['install']);
        installProcess.output.pipeTo(
          new WritableStream({
            write() { },
          }),
        );

        // Add timeout to prevent infinite hang (3 minutes)
        const INSTALL_TIMEOUT_MS = 180000;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        const timeoutPromise = new Promise<number>((resolve) => {
          timeoutId = setTimeout(() => {
            logger.warn('Postflight npm install timeout - killing process');

            try {
              installProcess.kill();
            } catch {
              // Process may already be dead
            }
            resolve(-1);
          }, INSTALL_TIMEOUT_MS);
        });

        await Promise.race([installProcess.exit, timeoutPromise]);

        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    } catch (error) {
      logger.debug('Postflight failed:', error);
    }
  }

  async #runFileAction(action: ActionState) {
    if (action.type !== 'file') {
      unreachable('Expected file action');
    }

    const webcontainer = await this.#webcontainer;
    const relativePath = nodePath.relative(webcontainer.workdir, action.filePath);

    let folder = nodePath.dirname(relativePath);

    // remove trailing slashes
    folder = folder.replace(/\/+$/g, '');

    if (folder !== '.') {
      try {
        await webcontainer.fs.mkdir(folder, { recursive: true });
        logger.debug('Created folder', folder);
      } catch (error) {
        logger.error('Failed to create folder\n\n', error);
      }
    }

    try {
      let contentToWrite = action.content;

      // Don't sanitize internal history snapshots – they may store JSON under .tsx-like filenames.
      if (typeof contentToWrite === 'string' && !relativePath.startsWith('.history/')) {
        const { content, changed, warnings, structuredWarnings, metrics } = sanitizeGeneratedFile(
          relativePath,
          contentToWrite,
        );
        contentToWrite = content;

        if (changed) {
          logger.debug(`Sanitized generated file ${relativePath}`);
        }

        if (warnings.length > 0) {
          logger.debug(`Sanitizer notes for ${relativePath}:\n- ${warnings.join('\n- ')}`);
        }

        if (structuredWarnings && structuredWarnings.length > 0) {
          const structuredSummary = structuredWarnings.map((w) => `${w.code} (${w.risk}): ${w.message}`).join('\n- ');
          logger.debug(`Sanitizer structured warnings for ${relativePath}:\n- ${structuredSummary}`);
        }

        if (metrics) {
          logger.debug(
            `Sanitizer change metrics for ${relativePath}: changedLinesPercent=${metrics.changedLinesPercent.toFixed(2)} ` +
            `charsAdded=${metrics.charsAdded} charsRemoved=${metrics.charsRemoved} highRiskFixes=${metrics.highRiskFixes} ` +
            `riskLevel=${metrics.riskLevel}`,
          );
        }

        // Validation Gate: Check code validity before writing
        const validation = validateFile(contentToWrite, relativePath);
        let autoFixAttemptsCount = 0;
        let promptVariant: import('~/utils/promptVariants').PromptVariant | undefined;

        if (!validation.valid) {
          const errorCount = getUnifiedErrorCount(validation.unifiedViolations);

          // Auto-Fix Loop: Try to fix if errors are auto-fixable
          if (isValidationAutoFixable(validation)) {
            logger.info(`Attempting auto-fix for ${relativePath} (${errorCount} errors)`);
            autoFixAttemptsCount = 1; // Quick fix counts as 1 attempt

            // First try quick fix (sanitizer only - fast)
            const quickFixResult = quickFix(contentToWrite, relativePath);

            if (quickFixResult.valid) {
              logger.info(`Quick fix succeeded for ${relativePath}`);
              contentToWrite = quickFixResult.code;
            } else {
              // Quick fix failed - try LLM repair for important files
              const isImportantFile =
                relativePath.endsWith('.tsx') || relativePath.endsWith('.jsx') || relativePath.includes('App.');

              if (isImportantFile && errorCount <= 10) {
                logger.info(`Attempting LLM repair for ${relativePath}`);

                try {
                  const llmRepairFn = createLlmRepairFn();
                  const fallbackLlmRepairFn = createFallbackLlmRepairFn();

                  const autoFixResult = await autoFixWithLlm({
                    filename: relativePath,
                    originalCode: contentToWrite,
                    validationResult: validation,
                    llmRepairFn,
                    fallbackLlmRepairFn,
                    repairContext: {
                      sanitizerWarnings: structuredWarnings,
                      metrics,
                    },
                  });

                  autoFixAttemptsCount += autoFixResult.attempts;
                  promptVariant = autoFixResult.promptVariant;

                  if (autoFixResult.success) {
                    logger.info(`LLM repair succeeded for ${relativePath} after ${autoFixResult.attempts} attempt(s)`);
                    contentToWrite = autoFixResult.code;
                  } else {
                    logger.warn(`LLM repair failed for ${relativePath} after ${autoFixResult.attempts} attempt(s)`);

                    // Use best attempt from quick fix
                    contentToWrite = quickFixResult.code;
                  }
                } catch (llmError) {
                  logger.error(`LLM repair error for ${relativePath}:`, llmError);

                  // Fall back to quick fix result
                  contentToWrite = quickFixResult.code;
                }
              } else {
                // Not important file or too many errors - use quick fix result
                const errorSummary = formatUnifiedErrorsSummary(validation.unifiedViolations, 3).replace(/\n/g, '; ');
                logger.warn(`Auto-fix incomplete for ${relativePath}: ${errorSummary}`);
                contentToWrite = quickFixResult.code;
              }
            }
          } else {
            // Errors not auto-fixable, just log
            const errorSummary = formatUnifiedErrorsSummary(validation.unifiedViolations, 3).replace(/\n/g, '; ');
            logger.warn(`Validation errors in ${relativePath}: ${errorSummary}`);
          }
        }

        // Final validation before write - Hard Gate
        const finalValidation = validateFile(contentToWrite, relativePath);

        if (!finalValidation.valid) {
          const errorCount = getUnifiedErrorCount(finalValidation.unifiedViolations);

          /*
           * Hard Gate: Don't write invalid files to working directory
           * Instead, quarantine to .history/ and alert user
           */
          const quarantinePath = `.history/${relativePath}.invalid`;
          const quarantineFolder = nodePath.dirname(quarantinePath);

          try {
            await webcontainer.fs.mkdir(quarantineFolder, { recursive: true });

            // Write the invalid file
            await webcontainer.fs.writeFile(quarantinePath, contentToWrite);
            logger.warn(`Quarantined invalid file to ${quarantinePath} (${errorCount} errors)`);

            // Write sidecar artifacts for debugging and analytics
            await this.#writeQuarantineSidecars(
              webcontainer,
              quarantinePath,
              finalValidation.unifiedViolations || [],
              structuredWarnings || [],
              metrics,
            );

            // Emit telemetry event for quarantine
            try {
              emitQuarantineWritten({
                filename: relativePath,
                violations: finalValidation.unifiedViolations || [],
                sanitizerWarnings: structuredWarnings || [],
                metrics,
                autoFixAttempts: autoFixAttemptsCount,
                promptVariant,
              });
            } catch (telemetryError) {
              // Telemetry errors should not affect quarantine
              logger.debug('Telemetry emission failed:', telemetryError);
            }
          } catch (quarantineError) {
            logger.error('Failed to quarantine invalid file:', quarantineError);
          }

          // Alert user about the invalid file
          const errorSummary = formatUnifiedErrorsSummary(finalValidation.unifiedViolations, 5);

          this.onAlert?.({
            type: 'validation',
            title: 'Invalid Code Blocked',
            description: `${relativePath}: ${errorCount} syntax error(s) - file not written`,
            content: `File quarantined to ${quarantinePath}\n\nErrors:\n${errorSummary}`,
            source: 'validation',
            autoFix: {
              key: `hardgate:${relativePath}:${Date.now()}`,
              message: `Fix the syntax errors in ${relativePath}:\n\n${errorSummary}\n\nThe file was not written due to validation errors. Please regenerate or fix manually.`,
            },

            // Structured data for UI
            unifiedViolations: finalValidation.unifiedViolations,
            sanitizerWarnings: structuredWarnings,
            metrics,
            quarantinePath,
            filePath: relativePath,
          });

          return; // Don't write invalid file
        }
      }

      await webcontainer.fs.writeFile(relativePath, contentToWrite);
      logger.debug(`File written ${relativePath}`);

      if (typeof contentToWrite === 'string') {
        const jsxOk = await this.#maybeValidateGeneratedJsx(relativePath, contentToWrite);
        await this.#maybeValidateSectionContract(relativePath, contentToWrite, jsxOk);
      }
    } catch (error) {
      logger.error('Failed to write file\n\n', error);
    }
  }

  #updateAction(id: string, newState: ActionStateUpdate) {
    const actions = this.actions.get();

    this.actions.setKey(id, { ...actions[id], ...newState });
  }

  async #maybeValidateGeneratedJsx(relativePath: string, content: string): Promise<boolean> {
    const normalizedPath = relativePath.replace(/\\/g, '/');

    if (normalizedPath.startsWith('.history/')) {
      return true;
    }

    const ext = nodePath.extname(normalizedPath).toLowerCase();

    if (ext !== '.tsx' && ext !== '.jsx') {
      return true;
    }

    if (!isAllowedSectionRoot(normalizedPath)) {
      return true;
    }

    try {
      // Use unified validator (validateFile) instead of separate validateTsx
      const result = validateFile(content, normalizedPath);

      if (result.valid) {
        this.#autoFixAttempts.delete(normalizedPath);
        return true;
      }

      // Get first error for alert
      const firstUnifiedError = result.unifiedViolations?.find((v) => v.severity === 'error');
      const fallbackFirstError = result.errors.find((e) => e.severity === 'error');

      if (!firstUnifiedError && !fallbackFirstError) {
        return true; // Only warnings, consider valid
      }

      const firstErrorLine =
        (typeof firstUnifiedError?.context?.line === 'number' ? firstUnifiedError.context.line : undefined) ??
        fallbackFirstError?.line ??
        1;
      const firstErrorColumn =
        (typeof firstUnifiedError?.context?.column === 'number' ? firstUnifiedError.context.column : undefined) ??
        fallbackFirstError?.column ??
        1;
      const firstErrorMessage = firstUnifiedError?.message ?? fallbackFirstError?.message ?? 'Unknown validation error';

      const attempts = this.#autoFixAttempts.get(normalizedPath) ?? 0;
      const location = `${firstErrorLine}:${firstErrorColumn}`;

      // Build snippet from code
      const lines = content.split('\n');
      const errorLine = lines[firstErrorLine - 1] || '';
      const snippet = errorLine ? `\n\nSnippet:\n${errorLine}\n${' '.repeat(Math.max(0, firstErrorColumn - 1))}^` : '';

      const firstErrorCode = (firstUnifiedError?.code as ViolationCode | undefined) ?? 'SYNTAX_OTHER';
      const contentSummary = `File: ${normalizedPath}\nCode: ${firstErrorCode}\nError: ${firstErrorMessage}\nLocation: ${location}${snippet}`;
      const autoFixKey = `${normalizedPath}:${firstErrorCode}:${location}`;

      this.onAlert?.({
        type: 'validation',
        title: 'Invalid JSX Generated',
        description: `${normalizedPath}: ${firstErrorMessage} (line ${firstErrorLine}, column ${firstErrorColumn})`,
        content: contentSummary,
        source: 'validation',
        autoFix:
          attempts < 1
            ? {
              key: autoFixKey,
              message:
                `Fix the JSX/TSX parse error in ${normalizedPath}.\n` +
                `Code: ${firstErrorCode}\n` +
                `Error: ${firstErrorMessage}\n` +
                `Location: ${location}${snippet}\n\n` +
                `Please update the file so it compiles without JSX syntax errors.`,
            }
            : undefined,

        // Structured data for UI
        unifiedViolations: result.unifiedViolations,
        filePath: normalizedPath,
      });

      if (attempts < 1) {
        this.#autoFixAttempts.set(normalizedPath, attempts + 1);
      }

      return false;
    } catch (error) {
      logger.debug('JSX validation failed:', error);
      return true;
    }
  }

  /**
   * Write sidecar artifacts alongside quarantined file for debugging and analytics.
   * Creates:
   * - .errors.json: Unified violations with structured codes
   * - .sanitizer.json: Sanitizer warnings (what was already tried)
   * - .metrics.json: Change metrics (risk assessment)
   */
  async #writeQuarantineSidecars(
    webcontainer: WebContainer,
    quarantinePath: string,
    unifiedViolations: import('~/lib/services/sectionContracts').UnifiedViolation[],
    sanitizerWarnings: import('~/utils/codeSanitizer').SanitizerWarning[],
    metrics?: import('~/utils/codeSanitizer').ChangeMetrics,
  ): Promise<void> {
    const timestamp = new Date().toISOString();

    try {
      // Write errors.json - unified violations
      if (unifiedViolations.length > 0) {
        const errorsData = {
          timestamp,
          count: unifiedViolations.length,
          violations: unifiedViolations.map((v) => ({
            code: v.code,
            severity: v.severity,
            message: v.message,
            autoFixable: v.autoFixable,
            context: v.context,
          })),
        };
        await webcontainer.fs.writeFile(`${quarantinePath}.errors.json`, JSON.stringify(errorsData, null, 2));
        logger.debug(`Wrote ${quarantinePath}.errors.json`);
      }

      // Write sanitizer.json - what was already tried
      if (sanitizerWarnings.length > 0) {
        const sanitizerData = {
          timestamp,
          count: sanitizerWarnings.length,
          warnings: sanitizerWarnings.map((w) => ({
            code: w.code,
            message: w.message,
            risk: w.risk,
          })),
        };
        await webcontainer.fs.writeFile(`${quarantinePath}.sanitizer.json`, JSON.stringify(sanitizerData, null, 2));
        logger.debug(`Wrote ${quarantinePath}.sanitizer.json`);
      }

      // Write metrics.json - risk assessment
      if (metrics) {
        const metricsData = {
          timestamp,
          ...metrics,
        };
        await webcontainer.fs.writeFile(`${quarantinePath}.metrics.json`, JSON.stringify(metricsData, null, 2));
        logger.debug(`Wrote ${quarantinePath}.metrics.json`);
      }
    } catch (error) {
      // Non-critical - log but don't fail quarantine
      logger.debug('Failed to write quarantine sidecars:', error);
    }
  }

  async #maybeValidateSectionContract(relativePath: string, content: string, jsxOk: boolean) {
    if (!jsxOk) {
      return;
    }

    const normalizedPath = relativePath.replace(/\\/g, '/');

    if (normalizedPath.startsWith('.history/')) {
      return;
    }

    const ext = nodePath.extname(normalizedPath).toLowerCase();

    if (ext !== '.tsx' && ext !== '.jsx') {
      return;
    }

    if (!isAllowedSectionRoot(normalizedPath)) {
      return;
    }

    const sectionContract = this.#sectionContract;

    if (!sectionContract || sectionContract.order.length === 0) {
      return;
    }

    // MODULAR MODE: Skip page-contract for individual section files
    // After PR3, section components don't contain data-section (it's in App.tsx)
    // Skip based on file path pattern, not content
    if (isModularSectionFile(normalizedPath)) {
      logger.debug(`Skipping page contract for modular section file: ${normalizedPath}`);

      // TODO: Per-section contract validation can be added here
      // e.g. validateHeroSection(content) for HeroSection.tsx
      return;
    }

    // For App.tsx in modular mode, we could check composition
    // For now, we still run the full page contract check
    // This will be enhanced when we track observed sections across files

    const expectedKeys = sectionContract.order.map(normalizeSectionValue);
    const expectedLabels: Record<string, string> = sectionContract.labels ?? {};
    const labelFor = (key: string) => expectedLabels[key] ?? key;

    const dataSections = extractDataSectionValues(content);
    const actualMatched: string[] = [];
    const extras: string[] = [];

    for (const value of dataSections) {
      const matchedKey = findExpectedSectionKey(value, expectedKeys);

      if (matchedKey) {
        if (!actualMatched.includes(matchedKey)) {
          actualMatched.push(matchedKey);
        }
      } else {
        extras.push(value);
      }
    }

    const missing = expectedKeys.filter((key) => !actualMatched.includes(key));
    const outOfOrder: string[] = [];
    let lastIndex = -1;

    for (const key of expectedKeys) {
      const index = actualMatched.indexOf(key);

      if (index === -1) {
        continue;
      }

      if (index < lastIndex) {
        outOfOrder.push(key);
      } else {
        lastIndex = index;
      }
    }

    const imageRequired = (sectionContract.imageSections ?? []).map(normalizeSectionValue);
    const imageMinCounts: Record<string, number> = sectionContract.imageMinCounts ?? {};
    const imageCountFailures: string[] = [];
    const imageDuplicateFailures: string[] = [];
    const imageMap: Record<string, string[]> = sectionContract.imageMap ?? {};
    const allowedImageUrls = new Set(Object.values(imageMap).flat());
    const invalidImageUrls = new Set<string>();

    if (imageRequired.length > 0) {
      const sectionBlocks = extractSectionBlocks(content, expectedKeys);

      for (const key of imageRequired) {
        if (missing.includes(key)) {
          continue;
        }

        const block = sectionBlocks.get(key) ?? '';
        const requiredCount = imageMinCounts[key] ?? 1;
        const sources = extractImageSources(block);
        const imgCount = sources.length;

        if (imgCount < requiredCount) {
          imageCountFailures.push(`${labelFor(key)} (${imgCount}/${requiredCount})`);
        }

        if (imgCount > 1) {
          const uniqueCount = new Set(sources).size;

          if (uniqueCount < imgCount) {
            imageDuplicateFailures.push(`${labelFor(key)} (${uniqueCount}/${imgCount} unique)`);
          }
        }
      }
    }

    if (allowedImageUrls.size > 0) {
      const sources = extractImageSources(content);

      for (const source of sources) {
        if (!allowedImageUrls.has(source)) {
          invalidImageUrls.add(source);
        }
      }
    }

    if (
      missing.length === 0 &&
      outOfOrder.length === 0 &&
      imageCountFailures.length === 0 &&
      imageDuplicateFailures.length === 0 &&
      invalidImageUrls.size === 0
    ) {
      const contractKey = `${normalizedPath}:${expectedKeys.join('|')}`;
      this.#autoFixSectionAttempts.delete(contractKey);

      return;
    }

    const expectedOrderLabel = expectedKeys.map(labelFor).join(' -> ');
    const actualOrderLabel = actualMatched.length > 0 ? actualMatched.map(labelFor).join(' -> ') : 'None';
    const missingLabel = missing.length > 0 ? missing.map(labelFor).join(', ') : 'None';
    const outOfOrderLabel = outOfOrder.length > 0 ? outOfOrder.map(labelFor).join(', ') : 'None';
    const extrasLabel = extras.length > 0 ? extras.join(', ') : 'None';
    const imageCountLabel = imageCountFailures.length > 0 ? imageCountFailures.join(', ') : 'None';
    const imageDuplicateLabel = imageDuplicateFailures.length > 0 ? imageDuplicateFailures.join(', ') : 'None';
    const invalidImageList = Array.from(invalidImageUrls);
    const invalidImageLabel = invalidImageList.length > 0 ? invalidImageList.slice(0, 5).join(', ') : 'None';

    const unifiedViolations = buildPageContractViolations({
      file: normalizedPath,
      expectedKeys,
      actualMatched,
      missing,
      outOfOrder,
      extras,
      imageCountFailures,
      imageDuplicateFailures,
      invalidImageUrls: invalidImageList,
    });

    const unifiedSummary =
      unifiedViolations.length > 0
        ? `\n\nCodes:\n${unifiedViolations.map((v) => formatUnifiedViolationLine(v)).join('\n')}`
        : '';

    const contractKey = `${normalizedPath}:${expectedKeys.join('|')}`;
    const attempts = this.#autoFixSectionAttempts.get(contractKey) ?? 0;
    const autoFixKey = `${contractKey}:${missing.join('|')}:${outOfOrder.join('|')}:${imageCountFailures.join('|')}:${imageDuplicateFailures.join('|')}:${invalidImageList.join('|')}`;

    const contentSummary =
      [
        `File: ${normalizedPath}`,
        `Expected order: ${expectedOrderLabel}`,
        `Actual order: ${actualOrderLabel}`,
        `Missing sections: ${missingLabel}`,
        `Out-of-order sections: ${outOfOrderLabel}`,
        `Unknown sections: ${extrasLabel}`,
        `Image counts below minimum: ${imageCountLabel}`,
        `Duplicate images in section: ${imageDuplicateLabel}`,
        `Images not in IMAGES list: ${invalidImageLabel}`,
      ].join('\n') + unifiedSummary;

    this.onAlert?.({
      type: 'validation',
      title: 'Section Contract Mismatch',
      description: `${normalizedPath}: missing or out-of-order sections`,
      content: contentSummary,
      source: 'validation',
      autoFix:
        attempts < 1
          ? {
            key: autoFixKey,
            message:
              `Fix the section contract in ${normalizedPath}.\n` +
              `Expected order: ${expectedOrderLabel}\n` +
              `Actual order: ${actualOrderLabel}\n` +
              `Missing sections: ${missingLabel}\n` +
              `Out-of-order sections: ${outOfOrderLabel}\n` +
              `Unknown sections: ${extrasLabel}\n` +
              `Image counts below minimum: ${imageCountLabel}\n` +
              `Duplicate images in section: ${imageDuplicateLabel}\n` +
              `Images not in IMAGES list: ${invalidImageLabel}\n\n` +
              `Ensure every required section exists, appears in the expected order, and all <img> src values come from the IMAGES block.`,
          }
          : undefined,

      // Structured data for UI
      unifiedViolations,
      filePath: normalizedPath,
    });

    if (attempts < 1) {
      this.#autoFixSectionAttempts.set(contractKey, attempts + 1);
    }
  }

  async getFileHistory(filePath: string): Promise<FileHistory | null> {
    try {
      const webcontainer = await this.#webcontainer;
      const historyPath = this.#getHistoryPath(filePath);
      const content = await webcontainer.fs.readFile(historyPath, 'utf-8');

      return JSON.parse(content);
    } catch (error) {
      logger.error('Failed to get file history:', error);
      return null;
    }
  }

  async saveFileHistory(filePath: string, history: FileHistory) {
    // const webcontainer = await this.#webcontainer;
    const historyPath = this.#getHistoryPath(filePath);

    await this.#runFileAction({
      type: 'file',
      filePath: historyPath,
      content: JSON.stringify(history),
      changeSource: 'auto-save',
    } as any);
  }

  #getHistoryPath(filePath: string) {
    return nodePath.join('.history', filePath);
  }

  async #runBuildAction(action: ActionState) {
    if (action.type !== 'build') {
      unreachable('Expected build action');
    }

    // Trigger build started alert
    this.onDeployAlert?.({
      type: 'info',
      title: 'Building Application',
      description: 'Building your application...',
      stage: 'building',
      buildStatus: 'running',
      deployStatus: 'pending',
      source: 'netlify',
    });

    const webcontainer = await this.#webcontainer;

    // Create a new terminal specifically for the build
    const buildProcess = await webcontainer.spawn('npm', ['run', 'build']);

    let output = '';
    buildProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          output += data;
        },
      }),
    );

    const exitCode = await buildProcess.exit;

    if (exitCode !== 0) {
      // Trigger build failed alert
      this.onDeployAlert?.({
        type: 'error',
        title: 'Build Failed',
        description: 'Your application build failed',
        content: output || 'No build output available',
        stage: 'building',
        buildStatus: 'failed',
        deployStatus: 'pending',
        source: 'netlify',
      });

      throw new ActionCommandError('Build Failed', output || 'No Output Available');
    }

    // Trigger build success alert
    this.onDeployAlert?.({
      type: 'success',
      title: 'Build Completed',
      description: 'Your application was built successfully',
      stage: 'deploying',
      buildStatus: 'complete',
      deployStatus: 'running',
      source: 'netlify',
    });

    // Check for common build directories
    const commonBuildDirs = ['dist', 'build', 'out', 'output', '.next', 'public'];

    let buildDir = '';

    // Try to find the first existing build directory
    for (const dir of commonBuildDirs) {
      const dirPath = nodePath.join(webcontainer.workdir, dir);

      try {
        await webcontainer.fs.readdir(dirPath);
        buildDir = dirPath;
        break;
      } catch {
        continue;
      }
    }

    // If no build directory was found, use the default (dist)
    if (!buildDir) {
      buildDir = nodePath.join(webcontainer.workdir, 'dist');
    }

    return {
      path: buildDir,
      exitCode,
      output,
    };
  }
  async handleSupabaseAction(action: SupabaseAction) {
    const { operation, content, filePath } = action;
    logger.debug('[Supabase Action]:', { operation, filePath, content });

    switch (operation) {
      case 'migration':
        if (!filePath) {
          throw new Error('Migration requires a filePath');
        }

        // Show alert for migration action
        this.onSupabaseAlert?.({
          type: 'info',
          title: 'Supabase Migration',
          description: `Create migration file: ${filePath}`,
          content,
          source: 'supabase',
        });

        // Only create the migration file
        await this.#runFileAction({
          type: 'file',
          filePath,
          content,
          changeSource: 'supabase',
        } as any);
        return { success: true };

      case 'query': {
        // Always show the alert and let the SupabaseAlert component handle connection state
        this.onSupabaseAlert?.({
          type: 'info',
          title: 'Supabase Query',
          description: 'Execute database query',
          content,
          source: 'supabase',
        });

        // The actual execution will be triggered from SupabaseChatAlert
        return { pending: true };
      }

      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  // Add this method declaration to the class
  handleDeployAction(
    stage: 'building' | 'deploying' | 'complete',
    status: ActionStatus,
    details?: {
      url?: string;
      error?: string;
      source?: 'netlify' | 'vercel' | 'github' | 'gitlab';
    },
  ): void {
    if (!this.onDeployAlert) {
      logger.debug('No deploy alert handler registered');
      return;
    }

    const alertType = status === 'failed' ? 'error' : status === 'complete' ? 'success' : 'info';

    const title =
      stage === 'building'
        ? 'Building Application'
        : stage === 'deploying'
          ? 'Deploying Application'
          : 'Deployment Complete';

    const description =
      status === 'failed'
        ? `${stage === 'building' ? 'Build' : 'Deployment'} failed`
        : status === 'running'
          ? `${stage === 'building' ? 'Building' : 'Deploying'} your application...`
          : status === 'complete'
            ? `${stage === 'building' ? 'Build' : 'Deployment'} completed successfully`
            : `Preparing to ${stage === 'building' ? 'build' : 'deploy'} your application`;

    const buildStatus =
      stage === 'building' ? status : stage === 'deploying' || stage === 'complete' ? 'complete' : 'pending';

    const deployStatus = stage === 'building' ? 'pending' : status;

    this.onDeployAlert({
      type: alertType,
      title,
      description,
      content: details?.error || '',
      url: details?.url,
      stage,
      buildStatus: buildStatus as any,
      deployStatus: deployStatus as any,
      source: details?.source || 'netlify',
    });
  }

  async #validateShellCommand(command: string): Promise<{
    shouldModify: boolean;
    modifiedCommand?: string;
    warning?: string;
  }> {
    const trimmedCommand = command.trim();

    // Handle rm commands that might fail due to missing files
    if (trimmedCommand.startsWith('rm ') && !trimmedCommand.includes(' -f')) {
      const rmMatch = trimmedCommand.match(/^rm\s+(.+)$/);

      if (rmMatch) {
        const filePaths = rmMatch[1].split(/\s+/);

        // Check if any of the files exist using WebContainer
        try {
          const webcontainer = await this.#webcontainer;
          const existingFiles = [];

          for (const filePath of filePaths) {
            if (filePath.startsWith('-')) {
              continue;
            } // Skip flags

            try {
              await webcontainer.fs.readFile(filePath);
              existingFiles.push(filePath);
            } catch {
              // File doesn't exist, skip it
            }
          }

          if (existingFiles.length === 0) {
            // No files exist, modify command to use -f flag to avoid error
            return {
              shouldModify: true,
              modifiedCommand: `rm -f ${filePaths.join(' ')}`,
              warning: 'Added -f flag to rm command as target files do not exist',
            };
          } else if (existingFiles.length < filePaths.length) {
            // Some files don't exist, modify to only remove existing ones with -f for safety
            return {
              shouldModify: true,
              modifiedCommand: `rm -f ${filePaths.join(' ')}`,
              warning: 'Added -f flag to rm command as some target files do not exist',
            };
          }
        } catch (error) {
          logger.debug('Could not validate rm command files:', error);
        }
      }
    }

    // Handle cd commands to non-existent directories
    if (trimmedCommand.startsWith('cd ')) {
      const cdMatch = trimmedCommand.match(/^cd\s+(.+)$/);

      if (cdMatch) {
        const targetDir = cdMatch[1].trim();

        try {
          const webcontainer = await this.#webcontainer;
          await webcontainer.fs.readdir(targetDir);
        } catch {
          return {
            shouldModify: true,
            modifiedCommand: `mkdir -p ${targetDir} && cd ${targetDir}`,
            warning: 'Directory does not exist, created it first',
          };
        }
      }
    }

    // Handle cp/mv commands with missing source files
    if (trimmedCommand.match(/^(cp|mv)\s+/)) {
      const parts = trimmedCommand.split(/\s+/);

      if (parts.length >= 3) {
        const sourceFile = parts[1];

        try {
          const webcontainer = await this.#webcontainer;
          await webcontainer.fs.readFile(sourceFile);
        } catch {
          return {
            shouldModify: false,
            warning: `Source file '${sourceFile}' does not exist`,
          };
        }
      }
    }

    return { shouldModify: false };
  }

  #createEnhancedShellError(
    command: string,
    exitCode: number | undefined,
    output: string | undefined,
  ): {
    title: string;
    details: string;
  } {
    const trimmedCommand = command.trim();
    const firstWord = trimmedCommand.split(/\s+/)[0];

    // Common error patterns and their explanations
    const errorPatterns = [
      {
        pattern: /cannot remove.*No such file or directory/,
        title: 'File Not Found',
        getMessage: () => {
          const fileMatch = output?.match(/'([^']+)'/);
          const fileName = fileMatch ? fileMatch[1] : 'file';

          return `The file '${fileName}' does not exist and cannot be removed.\n\nSuggestion: Use 'ls' to check what files exist, or use 'rm -f' to ignore missing files.`;
        },
      },
      {
        pattern: /No such file or directory/,
        title: 'File or Directory Not Found',
        getMessage: () => {
          if (trimmedCommand.startsWith('cd ')) {
            const dirMatch = trimmedCommand.match(/cd\s+(.+)/);
            const dirName = dirMatch ? dirMatch[1] : 'directory';

            return `The directory '${dirName}' does not exist.\n\nSuggestion: Use 'mkdir -p ${dirName}' to create it first, or check available directories with 'ls'.`;
          }

          return `The specified file or directory does not exist.\n\nSuggestion: Check the path and use 'ls' to see available files.`;
        },
      },
      {
        pattern: /Permission denied/,
        title: 'Permission Denied',
        getMessage: () =>
          `Permission denied for '${firstWord}'.\n\nSuggestion: The file may not be executable. Try 'chmod +x filename' first.`,
      },
      {
        pattern: /command not found/,
        title: 'Command Not Found',
        getMessage: () =>
          `The command '${firstWord}' is not available in WebContainer.\n\nSuggestion: Check available commands or use a package manager to install it.`,
      },
      {
        pattern: /Is a directory/,
        title: 'Target is a Directory',
        getMessage: () =>
          `Cannot perform this operation - target is a directory.\n\nSuggestion: Use 'ls' to list directory contents or add appropriate flags.`,
      },
      {
        pattern: /File exists/,
        title: 'File Already Exists',
        getMessage: () => `File already exists.\n\nSuggestion: Use a different name or add '-f' flag to overwrite.`,
      },
    ];

    // Try to match known error patterns
    for (const errorPattern of errorPatterns) {
      if (output && errorPattern.pattern.test(output)) {
        return {
          title: errorPattern.title,
          details: errorPattern.getMessage(),
        };
      }
    }

    // Generic error with suggestions based on command type
    let suggestion = '';

    if (trimmedCommand.startsWith('npm ')) {
      suggestion = '\n\nSuggestion: Try running "npm install" first or check package.json.';
    } else if (trimmedCommand.startsWith('git ')) {
      suggestion = "\n\nSuggestion: Check if you're in a git repository or if remote is configured.";
    } else if (trimmedCommand.match(/^(ls|cat|rm|cp|mv)/)) {
      suggestion = '\n\nSuggestion: Check file paths and use "ls" to see available files.';
    }

    return {
      title: `Command Failed (exit code: ${exitCode})`,
      details: `Command: ${trimmedCommand}\n\nOutput: ${output || 'No output available'}${suggestion}`,
    };
  }
}
