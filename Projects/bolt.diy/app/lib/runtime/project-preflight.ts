import type { WebContainer } from '@webcontainer/api';
import { WEB_BASELINE_DEPS, WEB_BASELINE_DEV_DEPS, WEB_BASELINE_FILES } from '~/utils/templateBaseline';
import { sanitizeGeneratedFile } from '~/utils/codeSanitizer';

export type PreflightViteReactResult = {
  isViteReact: boolean;
  baselineFilesAdded: number;
  sanitizedFiles: number;
  packageJsonChanged: boolean;
  addedDependencies: string[];
};

export async function preflightViteReactBaseline(webcontainer: WebContainer): Promise<PreflightViteReactResult> {
  const pkgText = await readTextFile(webcontainer, 'package.json');
  if (!pkgText) {
    return {
      isViteReact: false,
      baselineFilesAdded: 0,
      sanitizedFiles: 0,
      packageJsonChanged: false,
      addedDependencies: [],
    };
  }

  const pkg = safeParseJson<Record<string, any>>(pkgText);
  if (!pkg) {
    return {
      isViteReact: false,
      baselineFilesAdded: 0,
      sanitizedFiles: 0,
      packageJsonChanged: false,
      addedDependencies: [],
    };
  }

  const deps = { ...((pkg.dependencies ?? {}) as Record<string, string>), ...((pkg.devDependencies ?? {}) as Record<string, string>) };
  const isViteReact = Boolean(deps.vite && deps.react);
  if (!isViteReact) {
    return {
      isViteReact: false,
      baselineFilesAdded: 0,
      sanitizedFiles: 0,
      packageJsonChanged: false,
      addedDependencies: [],
    };
  }

  const baselineFilesAdded = await ensureBaselineFiles(webcontainer);
  const { packageJsonChanged: baselinePkgChanged, addedDependencies: baselineDepsAdded } = await ensureBaselinePackageJson(
    webcontainer,
    pkgText,
    pkg,
  );

  const sanitizeResult = await sanitizeSourceTree(webcontainer);
  const { packageJsonChanged: importPkgChanged, addedDependencies: importDepsAdded } = await ensureImportsInPackageJson(
    webcontainer,
    sanitizeResult.importedPackages,
  );

  const packageJsonChanged = baselinePkgChanged || importPkgChanged;

  return {
    isViteReact: true,
    baselineFilesAdded,
    sanitizedFiles: sanitizeResult.sanitizedFiles,
    packageJsonChanged,
    addedDependencies: [...baselineDepsAdded, ...importDepsAdded],
  };
}

async function ensureBaselineFiles(webcontainer: WebContainer): Promise<number> {
  let added = 0;

  for (const file of WEB_BASELINE_FILES) {
    const exists = await fileExists(webcontainer, file.path);
    if (exists) continue;

    const sanitized = sanitizeGeneratedFile(file.path, file.content);
    await ensureParentDir(webcontainer, file.path);
    await webcontainer.fs.writeFile(file.path, sanitized.content);
    added += 1;
  }

  return added;
}

async function ensureBaselinePackageJson(
  webcontainer: WebContainer,
  originalText: string,
  parsed: Record<string, any>,
): Promise<{ packageJsonChanged: boolean; addedDependencies: string[] }> {
  const next = { ...parsed };
  next.dependencies = { ...((parsed.dependencies ?? {}) as Record<string, string>) };
  next.devDependencies = { ...((parsed.devDependencies ?? {}) as Record<string, string>) };

  let changed = false;
  const added: string[] = [];

  for (const [dep, version] of Object.entries(WEB_BASELINE_DEPS)) {
    const current = next.dependencies[dep];
    if (!current) {
      next.dependencies[dep] = version;
      changed = true;
      added.push(dep);
      continue;
    }

    if (shouldUpgradeDep(current, version)) {
      next.dependencies[dep] = version;
      changed = true;
      added.push(dep);
    }
  }

  for (const [dep, version] of Object.entries(WEB_BASELINE_DEV_DEPS)) {
    const current = next.devDependencies[dep];
    if (!current) {
      next.devDependencies[dep] = version;
      changed = true;
      added.push(dep);
      continue;
    }

    if (shouldUpgradeDep(current, version)) {
      next.devDependencies[dep] = version;
      changed = true;
      added.push(dep);
    }
  }

  if (!changed) return { packageJsonChanged: false, addedDependencies: [] };

  const content = JSON.stringify(next, null, 2) + '\n';
  if (content === originalText) return { packageJsonChanged: false, addedDependencies: [] };

  const sanitized = sanitizeGeneratedFile('package.json', content);
  await webcontainer.fs.writeFile('package.json', sanitized.content);

  return { packageJsonChanged: true, addedDependencies: added };
}

type Semver = { major: number; minor: number; patch: number };

function shouldUpgradeDep(current: string, baseline: string): boolean {
  const currentSemver = extractSemver(current);
  const baselineSemver = extractSemver(baseline);
  if (!currentSemver || !baselineSemver) return false;
  return isSemverLess(currentSemver, baselineSemver);
}

function extractSemver(version: string): Semver | null {
  const match = version.match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) };
}

function isSemverLess(left: Semver, right: Semver): boolean {
  if (left.major !== right.major) return left.major < right.major;
  if (left.minor !== right.minor) return left.minor < right.minor;
  return left.patch < right.patch;
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

async function sanitizeSourceTree(webcontainer: WebContainer): Promise<{ sanitizedFiles: number; importedPackages: Set<string> }> {
  const importedPackages = new Set<string>();
  let sanitizedFiles = 0;

  const root = 'src';

  const walk = async (dirPath: string): Promise<void> => {
    let entries: Array<{ name: string; isFile: () => boolean; isDirectory: () => boolean }> = [];

    try {
      entries = (await webcontainer.fs.readdir(dirPath, { withFileTypes: true })) as any;
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = `${dirPath}/${entry.name}`;
      if (entry.isDirectory()) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'build') {
          continue;
        }
        await walk(fullPath);
        continue;
      }

      if (!entry.isFile()) continue;

      let content: string;
      try {
        content = await webcontainer.fs.readFile(fullPath, 'utf-8');
      } catch {
        continue;
      }

      const relativePath = fullPath.startsWith('./') ? fullPath.slice(2) : fullPath;
      const sanitized = sanitizeGeneratedFile(relativePath, content);
      const nextContent = sanitized.content;

      for (const pkg of extractExternalPackages(nextContent)) {
        importedPackages.add(pkg);
      }

      if (nextContent !== content) {
        try {
          await webcontainer.fs.writeFile(fullPath, nextContent);
          sanitizedFiles += 1;
        } catch {
          // ignore
        }
      }
    }
  };

  await walk(root);
  return { sanitizedFiles, importedPackages };
}

function extractExternalPackages(code: string): string[] {
  const pkgs = new Set<string>();

  const record = (specifier: string) => {
    const spec = specifier.trim();
    if (!spec) return;

    if (
      spec.startsWith('.') ||
      spec.startsWith('/') ||
      spec.startsWith('@/') ||
      spec.startsWith('http://') ||
      spec.startsWith('https://')
    ) {
      return;
    }

    const normalized = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];

    if (!normalized) return;

    // These are incompatible with Vite in this context; sanitizer should remove them.
    if (normalized === 'next' || normalized === 'react-router-dom') return;

    pkgs.add(normalized);
  };

  const patterns = [
    /\bfrom\s+['"]([^'"]+)['"]/g,
    /\bimport\s+['"]([^'"]+)['"]/g,
    /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g,
    /\brequire\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];

  for (const pattern of patterns) {
    for (const match of code.matchAll(pattern)) {
      if (!match[1]) continue;
      record(match[1]);
    }
  }

  return Array.from(pkgs);
}

async function ensureImportsInPackageJson(
  webcontainer: WebContainer,
  importedPackages: Set<string>,
): Promise<{ packageJsonChanged: boolean; addedDependencies: string[] }> {
  if (!importedPackages.size) return { packageJsonChanged: false, addedDependencies: [] };

  const pkgText = await readTextFile(webcontainer, 'package.json');
  if (!pkgText) return { packageJsonChanged: false, addedDependencies: [] };

  const pkg = safeParseJson<Record<string, any>>(pkgText);
  if (!pkg) return { packageJsonChanged: false, addedDependencies: [] };

  const deps = { ...((pkg.dependencies ?? {}) as Record<string, string>) };
  const devDeps = { ...((pkg.devDependencies ?? {}) as Record<string, string>) };

  let changed = false;
  const added: string[] = [];

  for (const dep of importedPackages) {
    if (deps[dep] || devDeps[dep]) continue;
    deps[dep] = 'latest';
    changed = true;
    added.push(dep);
  }

  if (!changed) return { packageJsonChanged: false, addedDependencies: [] };

  const next = { ...pkg, dependencies: deps, devDependencies: devDeps };
  const content = JSON.stringify(next, null, 2) + '\n';
  const sanitized = sanitizeGeneratedFile('package.json', content);
  await webcontainer.fs.writeFile('package.json', sanitized.content);

  return { packageJsonChanged: true, addedDependencies: added };
}
