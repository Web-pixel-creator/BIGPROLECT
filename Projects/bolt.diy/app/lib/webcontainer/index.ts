import { WebContainer } from '@webcontainer/api';
import { WORK_DIR_NAME } from '~/utils/constants';
import { sanitizeGeneratedFile } from '~/utils/codeSanitizer';
import { WEB_BASELINE_FILES } from '~/utils/templateBaseline';
import { cleanStackTrace } from '~/utils/stacktrace';

interface WebContainerContext {
  loaded: boolean;
}

export const webcontainerContext: WebContainerContext = import.meta.hot?.data.webcontainerContext ?? {
  loaded: false,
};

if (import.meta.hot) {
  import.meta.hot.data.webcontainerContext = webcontainerContext;
}

export let webcontainer: Promise<WebContainer> = new Promise(() => {
  // noop for ssr
});

const MAIN_ENTRY_PATH = 'src/main.tsx';
let mainHealInFlight = false;
let lastMainHealAt = 0;
const MAIN_HEAL_COOLDOWN_MS = 3000;

const shouldHealMainEntry = (message: any): boolean => {
  const msgText = typeof message?.message === 'string' ? message.message : '';
  const stackText = typeof message?.stack === 'string' ? message.stack : '';
  if (!msgText && !stackText) return false;

  const mentionsMain = stackText.includes('main.tsx') || msgText.includes('main.tsx');
  const isReferenceError = msgText.includes('is not defined') || msgText.includes('ReferenceError');
  return mentionsMain && isReferenceError;
};

const healMainEntry = async (webcontainer: WebContainer) => {
  if (mainHealInFlight) return;
  const now = Date.now();
  if (now - lastMainHealAt < MAIN_HEAL_COOLDOWN_MS) return;

  mainHealInFlight = true;
  lastMainHealAt = now;

  try {
    const content = await webcontainer.fs.readFile(MAIN_ENTRY_PATH, 'utf-8');
    const sanitized = sanitizeGeneratedFile(MAIN_ENTRY_PATH, content);
    if (sanitized.changed) {
      await webcontainer.fs.writeFile(MAIN_ENTRY_PATH, sanitized.content);
    }
    return;
  } catch {
    // Fall through to baseline write if read fails.
  } finally {
    mainHealInFlight = false;
  }

  const baselineMain = WEB_BASELINE_FILES.find((file) => file.path === MAIN_ENTRY_PATH)?.content;
  if (!baselineMain) return;

  try {
    await webcontainer.fs.writeFile(MAIN_ENTRY_PATH, baselineMain);
  } catch {
    // ignore
  }
};

if (!import.meta.env.SSR) {
  webcontainer =
    import.meta.hot?.data.webcontainer ??
    Promise.resolve()
      .then(() => {
        console.log('[WebContainer] Starting boot...');
        return WebContainer.boot({
          coep: 'credentialless',
          workdirName: WORK_DIR_NAME,
          forwardPreviewErrors: true, // Enable error forwarding from iframes
        });
      })
      .catch((error) => {
        console.error('[WebContainer] Boot failed:', error);
        throw error;
      })
      .then(async (webcontainer) => {
        webcontainerContext.loaded = true;

        const { workbenchStore } = await import('~/lib/stores/workbench');

        const response = await fetch('/inspector-script.js');
        const inspectorScript = await response.text();
        await webcontainer.setPreviewScript(inspectorScript);

        // Listen for preview errors
        webcontainer.on('preview-message', (message) => {
          console.log('WebContainer preview message:', message);

          // Handle both uncaught exceptions and unhandled promise rejections
          if (message.type === 'PREVIEW_UNCAUGHT_EXCEPTION' || message.type === 'PREVIEW_UNHANDLED_REJECTION') {
            const isPromise = message.type === 'PREVIEW_UNHANDLED_REJECTION';
            const title = isPromise ? 'Unhandled Promise Rejection' : 'Uncaught Exception';
            workbenchStore.actionAlert.set({
              type: 'preview',
              title,
              description: 'message' in message ? message.message : 'Unknown error',
              content: `Error occurred at ${message.pathname}${message.search}${message.hash}\nPort: ${message.port}\n\nStack trace:\n${cleanStackTrace(message.stack || '')}`,
              source: 'preview',
            });

            if (shouldHealMainEntry(message)) {
              void healMainEntry(webcontainer);
            }
          }
        });

        return webcontainer;
      });

  if (import.meta.hot) {
    import.meta.hot.data.webcontainer = webcontainer;
  }
}
