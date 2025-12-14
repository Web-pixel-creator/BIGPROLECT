import type { WebContainer } from '@webcontainer/api';
import { WEB_BASELINE_DEPS, WEB_BASELINE_DEV_DEPS, WEB_BASELINE_FILES } from '~/utils/templateBaseline';
import { sanitizeGeneratedFile } from '~/utils/codeSanitizer';

export async function preflightViteReactBaseline(webcontainer: WebContainer): Promise<boolean> {
  const pkgText = await readTextFile(webcontainer, 'package.json');
  if (!pkgText) return false;

  const pkg = safeParseJson<Record<string, any>>(pkgText);
  if (!pkg) return false;

  const deps = { ...((pkg.dependencies ?? {}) as Record<string, string>), ...((pkg.devDependencies ?? {}) as Record<string, string>) };
  const isViteReact = Boolean(deps.vite && deps.react);
  if (!isViteReact) return false;

  await ensureBaselineFiles(webcontainer);
  await ensureBaselinePackageJson(webcontainer, pkgText, pkg);

  return true;
}

async function ensureBaselineFiles(webcontainer: WebContainer) {
  for (const file of WEB_BASELINE_FILES) {
    const exists = await fileExists(webcontainer, file.path);
    if (exists) continue;

    const sanitized = sanitizeGeneratedFile(file.path, file.content);
    await ensureParentDir(webcontainer, file.path);
    await webcontainer.fs.writeFile(file.path, sanitized.content);
  }
}

async function ensureBaselinePackageJson(webcontainer: WebContainer, originalText: string, parsed: Record<string, any>) {
  const next = { ...parsed };
  next.dependencies = { ...((parsed.dependencies ?? {}) as Record<string, string>) };
  next.devDependencies = { ...((parsed.devDependencies ?? {}) as Record<string, string>) };

  let changed = false;

  for (const [dep, version] of Object.entries(WEB_BASELINE_DEPS)) {
    if (!next.dependencies[dep]) {
      next.dependencies[dep] = version;
      changed = true;
    }
  }

  for (const [dep, version] of Object.entries(WEB_BASELINE_DEV_DEPS)) {
    if (!next.devDependencies[dep]) {
      next.devDependencies[dep] = version;
      changed = true;
    }
  }

  if (!changed) return;

  const content = JSON.stringify(next, null, 2) + '\n';
  if (content === originalText) return;

  const sanitized = sanitizeGeneratedFile('package.json', content);
  await webcontainer.fs.writeFile('package.json', sanitized.content);
}

async function readTextFile(webcontainer: WebContainer, filePath: string): Promise<string | null> {
  try {
    return await webcontainer.fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

async function fileExists(webcontainer: WebContainer, filePath: string): Promise<boolean> {
  try {
    await webcontainer.fs.readFile(filePath, 'utf-8');
    return true;
  } catch {
    return false;
  }
}

async function ensureParentDir(webcontainer: WebContainer, filePath: string) {
  const idx = filePath.lastIndexOf('/');
  if (idx === -1) return;
  const dir = filePath.slice(0, idx);
  if (!dir) return;
  await webcontainer.fs.mkdir(dir, { recursive: true });
}

function safeParseJson<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
