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
  await ensureTsconfigAlias(webcontainer);
  await ensureViteConfigAlias(webcontainer);
  await ensureViteImageProxy(webcontainer);
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

async function ensureTsconfigAlias(webcontainer: WebContainer): Promise<boolean> {
  const tsconfigText = await readTextFile(webcontainer, 'tsconfig.json');
  if (!tsconfigText) return false;

  const config = safeParseJson<Record<string, any>>(tsconfigText);
  if (!config) return false;

  const compilerOptions = { ...(config.compilerOptions ?? {}) } as Record<string, any>;
  const paths = { ...(compilerOptions.paths ?? {}) } as Record<string, any>;

  let changed = false;

  if (!compilerOptions.baseUrl) {
    compilerOptions.baseUrl = '.';
    changed = true;
  }

  if (!paths['@/*']) {
    paths['@/*'] = ['./src/*'];
    changed = true;
  }

  if (!changed) return false;

  compilerOptions.paths = paths;
  config.compilerOptions = compilerOptions;

  const nextContent = JSON.stringify(config, null, 2) + '\n';
  const sanitized = sanitizeGeneratedFile('tsconfig.json', nextContent);
  await webcontainer.fs.writeFile('tsconfig.json', sanitized.content);
  return true;
}

async function ensureViteConfigAlias(webcontainer: WebContainer): Promise<boolean> {
  const viteConfigPath = await findFirstExistingFile(webcontainer, [
    'vite.config.ts',
    'vite.config.mts',
    'vite.config.js',
    'vite.config.mjs',
  ]);
  if (!viteConfigPath) return false;

  const original = await readTextFile(webcontainer, viteConfigPath);
  if (!original) return false;
  if (original.includes('vite-tsconfig-paths')) return false;

  let next = original;
  const isCommonJs = /\bmodule\.exports\b/.test(next) || (/\brequire\(/.test(next) && !/\bexport\s+default\b/.test(next));

  if (isCommonJs) {
    const requireMatches = [...next.matchAll(/^const .*require\(.*\).*$/gm)];
    if (requireMatches.length > 0) {
      const last = requireMatches[requireMatches.length - 1];
      const insertAt = (last.index ?? 0) + last[0].length;
      next = `${next.slice(0, insertAt)}\nconst tsconfigPaths = require(\"vite-tsconfig-paths\").default;${next.slice(insertAt)}`;
    } else {
      next = `const tsconfigPaths = require(\"vite-tsconfig-paths\").default;\n${next}`;
    }
  } else {
    const importMatches = [...next.matchAll(/^import .*$/gm)];
    if (importMatches.length > 0) {
      const last = importMatches[importMatches.length - 1];
      const insertAt = (last.index ?? 0) + last[0].length;
      next = `${next.slice(0, insertAt)}\nimport tsconfigPaths from \"vite-tsconfig-paths\";${next.slice(insertAt)}`;
    } else {
      next = `import tsconfigPaths from \"vite-tsconfig-paths\";\n${next}`;
    }
  }

  if (next.includes('plugins: [') && !next.includes('tsconfigPaths()')) {
    next = next.replace(/plugins\s*:\s*\[/, (match) => `${match}tsconfigPaths(), `);
  }

  if (next === original) return false;

  const sanitized = sanitizeGeneratedFile(viteConfigPath, next);
  await webcontainer.fs.writeFile(viteConfigPath, sanitized.content);
  return true;
}

async function ensureViteImageProxy(webcontainer: WebContainer): Promise<boolean> {
  const viteConfigPath = await findFirstExistingFile(webcontainer, [
    'vite.config.ts',
    'vite.config.mts',
    'vite.config.js',
    'vite.config.mjs',
  ]);
  if (!viteConfigPath) return false;

  const original = await readTextFile(webcontainer, viteConfigPath);
  if (!original) return false;
  if (original.includes('__image_proxy__') || original.includes('imageProxyPlugin')) {
    return false;
  }

  let next = original;
  const isCommonJs = /\bmodule\.exports\b/.test(next) || (/\brequire\(/.test(next) && !/\bexport\s+default\b/.test(next));

  const pluginMarker = 'imageProxyPlugin';
  const pluginImpl = `

function imageProxyPlugin() {
  const fallbackSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>';
  const sendFallback = (res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-store');
    res.end(fallbackSvg);
  };

  return {
    name: 'image-proxy',
    configureServer(server) {
      server.middlewares.use('/__image_proxy__', async (req, res) => {
        try {
          const url = new URL(req.url ?? '', 'http://localhost');
          const target = url.searchParams.get('url');
          if (!target) {
            sendFallback(res);
            return;
          }

          const response = await fetch(target);
          if (!response.ok) {
            sendFallback(res);
            return;
          }

          const buffer = new Uint8Array(await response.arrayBuffer());
          res.setHeader('Content-Type', response.headers.get('content-type') ?? 'image/jpeg');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.end(buffer);
        } catch {
          sendFallback(res);
        }
      });
    },
  };
}
`;

  if (isCommonJs) {
    if (!next.includes(pluginMarker)) {
      next = `${next}\n${pluginImpl}`;
    }
  } else {
    if (!next.includes(pluginMarker)) {
      next = `${next}\n${pluginImpl}`;
    }
  }

  const hasPluginsArray = /plugins\s*:\s*\[/.test(next);

  if (hasPluginsArray && !next.includes('imageProxyPlugin()')) {
    next = next.replace(/plugins\s*:\s*\[/, (match) => `${match}imageProxyPlugin(), `);
  } else if (/defineConfig\s*\(\s*\{/.test(next)) {
    next = next.replace(/defineConfig\s*\(\s*\{/g, (match) => `${match}\n  plugins: [imageProxyPlugin()],`);
  } else if (/export\s+default\s*\{/.test(next)) {
    next = next.replace(/export\s+default\s*\{/g, (match) => `${match}\n  plugins: [imageProxyPlugin()],`);
  } else if (/module\.exports\s*=\s*\{/.test(next)) {
    next = next.replace(/module\.exports\s*=\s*\{/g, (match) => `${match}\n  plugins: [imageProxyPlugin()],`);
  }

  if (next === original) return false;

  const sanitized = sanitizeGeneratedFile(viteConfigPath, next);
  await webcontainer.fs.writeFile(viteConfigPath, sanitized.content);
  return true;
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

async function findFirstExistingFile(webcontainer: WebContainer, candidates: string[]): Promise<string | null> {
  for (const filePath of candidates) {
    if (await fileExists(webcontainer, filePath)) {
      return filePath;
    }
  }
  return null;
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

  // Scan source directories (src, components, pages, app)
  const sourceDirs = ['src', 'components', 'pages', 'app', 'lib'];

  const walk = async (dirPath: string): Promise<void> => {
    let entries: Array<{ name: string; isFile: () => boolean; isDirectory: () => boolean }> = [];


    try {
      entries = (await webcontainer.fs.readdir(dirPath, { withFileTypes: true })) as any;
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = dirPath === '.' ? entry.name : `${dirPath}/${entry.name}`;
      if (entry.isDirectory()) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'build' || entry.name === 'public') {
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

  // Walk each source directory that exists
  for (const dir of sourceDirs) {
    await walk(dir);
  }
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
