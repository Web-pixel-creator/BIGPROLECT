import { path as nodePath } from './path';

type SanitizationResult = {
  content: string;
  changed: boolean;
  warnings: string[];
};

const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mts', '.cts', '.mjs', '.cjs', '.html', '.css', '.scss']);

// Conservative default versions taken from this repo's own dependencies.
const DEFAULT_WEB_DEPS: Record<string, string> = {
  'clsx': '^2.1.1',
  'framer-motion': '^11.12.0',
  'lucide-react': '^0.485.0',
  'motion': '^12.23.26',
  'tailwind-merge': '^2.6.0',
};

export function sanitizeGeneratedFile(relativePath: string, content: string): SanitizationResult {
  if (typeof content !== 'string') {
    return { content, changed: false, warnings: [] };
  }

  const ext = nodePath.extname(relativePath).toLowerCase();

  if (relativePath.endsWith('package.json')) {
    const result = sanitizePackageJson(content);
    return { content: result.content, changed: result.content !== content, warnings: result.warnings };
  }

  if (!CODE_EXTENSIONS.has(ext)) {
    return { content, changed: false, warnings: [] };
  }

  const warnings: string[] = [];
  let next = content;

  if (ext === '.tsx' || ext === '.jsx') {
    next = sanitizeJsxComments(next, warnings);
  }

  next = sanitizeImportPaths(next, relativePath, warnings);
  next = sanitizeLucide(next, warnings);
  next = sanitizeNext(next, warnings);
  next = sanitizeRouter(next, warnings);
  next = sanitizeImages(next, warnings);

  if (ext === '.css' || ext === '.scss') {
    next = sanitizeTailwindShadcnTokensInCss(next, warnings);
  }

  return { content: next, changed: next !== content, warnings };
}

function sanitizeJsxComments(code: string, warnings: string[]) {
  const before = code;
  const next = code.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

  if (next !== before) {
    warnings.push('Removed JSX comment blocks');
  }

  return next;
}

function sanitizeImportPaths(code: string, relativePath: string, warnings: string[]) {
  let next = code;

  // Some registries/snippets use "@/registry/ui/*" paths. Our baseline uses "@/components/ui/*".
  const beforeRegistry = next;
  next = next.replace(/(['"])@\/registry\/ui\//g, '$1@/components/ui/');
  if (next !== beforeRegistry) {
    warnings.push('Rewrote @/registry/ui import path to @/components/ui');
  }

  // Fix common alias usage in generated Vite projects:
  // - "@/..." assumes Next/shadcn-style alias; convert to relative path against src/.
  const fileDir = nodePath.dirname(relativePath);

  return next.replace(/from\s+(['"])@\/([^'"]+)\1/g, (_match, quote: string, aliasPath: string) => {
    const targetPath = nodePath.join('src', aliasPath);
    let relativeImport = nodePath.relative(fileDir, targetPath).replace(/\\/g, '/');

    if (!relativeImport.startsWith('.')) {
      relativeImport = `./${relativeImport}`;
    }

    warnings.push(`Rewrote @/ import to relative: ${aliasPath} -> ${relativeImport}`);
    return `from ${quote}${relativeImport}${quote}`;
  });
}

function sanitizeLucide(code: string, warnings: string[]) {
  let next = code;

  // Normalize any lucide-react/dist* imports to lucide-react.
  const beforePath = next;
  next = next.replace(/(['"])lucide-react\/dist(?:\/[^'"]*)?\1/g, '$1lucide-react$1');
  if (next !== beforePath) {
    warnings.push('Rewrote lucide-react/dist import to lucide-react');
  }

  // House is frequently hallucinated; lucide-react uses Home.
  // CirclePlay can be missing in older lucide-react versions; PlayCircle is widely available.
  // If the file imports these from lucide-react, replace and adjust usages conservatively.
  let replacedHouseImport = false;
  let replacedCirclePlayImport = false;
  next = next.replace(
    /import\s+\{([\s\S]*?)\}\s+from\s+['"]lucide-react['"]\s*;?/g,
    (full, specifiers: string) => {
      const hasHouse = /\bHouse\b/.test(specifiers);
      const hasCirclePlay = /\bCirclePlay\b/.test(specifiers);
      if (!hasHouse && !hasCirclePlay) return full;

      const parts = specifiers
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);

      const mapped = parts.map((part) => {
        if (/^House(\s+as\s+.+)?$/.test(part) || /^House\s+as\s+/.test(part)) {
          replacedHouseImport = true;
          return part.replace(/^House\b/, 'Home');
        }
        if (/^CirclePlay(\s+as\s+.+)?$/.test(part) || /^CirclePlay\s+as\s+/.test(part)) {
          replacedCirclePlayImport = true;
          return part.replace(/^CirclePlay\b/, 'PlayCircle');
        }
        return part;
      });

      // De-duplicate (House -> Home can create duplicates)
      const deduped: string[] = [];
      const seen = new Set<string>();
      for (const part of mapped) {
        const key = part.replace(/\s+/g, ' ').trim();
        if (seen.has(key)) continue;
        seen.add(key);
        deduped.push(part);
      }

      if (hasHouse) {
        warnings.push('Replaced lucide icon House -> Home');
      }
      if (hasCirclePlay) {
        warnings.push('Replaced lucide icon CirclePlay -> PlayCircle');
      }
      return `import { ${deduped.join(', ')} } from "lucide-react";`;
    },
  );

  if (replacedHouseImport) {
    next = next.replace(/<\s*House\b/g, '<Home');
    next = next.replace(/<\/\s*House\b/g, '</Home');
    next = next.replace(/\bHouse\b/g, 'Home');
  }

  if (replacedCirclePlayImport) {
    next = next.replace(/<\s*CirclePlay\b/g, '<PlayCircle');
    next = next.replace(/<\/\s*CirclePlay\b/g, '</PlayCircle');
    next = next.replace(/\bCirclePlay\b/g, 'PlayCircle');
  }

  // Some LLMs hallucinate `import { Lucide } from "lucide-react"`, but `Lucide` is not a valid export.
  // Remove it to prevent runtime/import errors.
  const beforeLucide = next;
  next = next.replace(
    /import\s+\{([\s\S]*?)\}\s+from\s+['"]lucide-react['"]\s*;?/g,
    (full, specifiers: string) => {
      if (!/\bLucide\b/.test(specifiers)) return full;
      const parts = specifiers
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
        .filter((part) => !/^Lucide(\s+as\s+.+)?$/.test(part));

      warnings.push('Removed invalid lucide-react named import: Lucide');
      if (parts.length === 0) return '';
      return `import { ${parts.join(', ')} } from "lucide-react";`;
    },
  );
  if (next !== beforeLucide) {
    // no-op
  }

  return next;
}

function sanitizeNext(code: string, warnings: string[]) {
  let next = code;

  // next/image is not available in Vite projects; convert to <img>.
  const beforeNextImage = next;
  next = removeModuleImports(next, 'next/image');
  if (next !== beforeNextImage) {
    warnings.push('Removed next/image import (use <img>)');
    next = next.replace(/<\s*Image\b/g, '<img');
    next = next.replace(/<\/\s*Image\b/g, '</img');
  }

  // next/link is not available; convert to <a>.
  const beforeNextLink = next;
  next = removeModuleImports(next, 'next/link');
  if (next !== beforeNextLink) {
    warnings.push('Removed next/link import (use <a>)');
    next = next.replace(/<\s*Link\b/g, '<a');
    next = next.replace(/<\/\s*Link\b/g, '</a');
  }

  return next;
}

function sanitizeRouter(code: string, warnings: string[]) {
  let next = code;

  // react-router-dom isn't part of the default Vite template in this context.
  const before = next;
  next = removeModuleImports(next, 'react-router-dom');
  if (next !== before) {
    warnings.push('Removed react-router-dom import (use <a href>)');
    next = next.replace(/<\s*NavLink\b/g, '<a');
    next = next.replace(/<\/\s*NavLink\b/g, '</a');
    next = next.replace(/<\s*Link\b/g, '<a');
    next = next.replace(/<\/\s*Link\b/g, '</a');
    next = next.replace(/\bto=/g, 'href=');
  }

  return next;
}

function sanitizeImages(code: string, warnings: string[]) {
  let next = code;

  // Some generated projects reference non-existent local assets like /images/hero.jpg.
  const beforeLocalHero = next;
  next = next.replace(/(['"`])\/images\/hero\.(?:jpg|jpeg|png)\1/g, '$1/images/hero.svg$1');
  next = next.replace(/(['"`])\/images\/hero\.(?:jpg|jpeg|png)\?\S*?\1/g, '$1/images/hero.svg$1');
  next = next.replace(/url\((['"]?)\/images\/hero\.(?:jpg|jpeg|png)(?:\?[^'")]+)?\1\)/g, "url('/images/hero.svg')");

  if (next !== beforeLocalHero) {
    warnings.push('Rewrote /images/hero.(jpg|png) to /images/hero.svg');
  }

  // WebContainer preview runs with COEP/COOP which can block many cross-origin images.
  // Replace common external placeholder/image hosts with local SVG placeholders for stability.
  const beforeExternal = next;
  // Handle both absolute, protocol-relative (`//host/...`) and scheme-less (`host/...`) forms.
  next = next.replace(/(?:https?:\/\/|\/\/)?(?:www\.)?picsum\.photos\/[^\s'")`}]*/gi, '/images/placeholder.svg');
  next = next.replace(/(?:https?:\/\/|\/\/)?images\.unsplash\.com\/[^\s'")`}]*/gi, '/images/placeholder.svg');
  next = next.replace(/(?:https?:\/\/|\/\/)?placehold\.co\/[^\s'")`}]*/gi, '/images/placeholder.svg');
  next = next.replace(/(?:https?:\/\/|\/\/)?via\.placeholder\.com\/[^\s'")`}]*/gi, '/images/placeholder.svg');

  // Catch other external image URLs with common image extensions.
  next = next.replace(
    /https?:\/\/[^\s'"`)}]+?\.(?:png|jpe?g|webp|gif|svg)(?:\?[^\s'"`)}]*)?/gi,
    '/images/placeholder.svg',
  );
  next = next.replace(
    /\/\/[^\s'"`)}]+?\.(?:png|jpe?g|webp|gif|svg)(?:\?[^\s'"`)}]*)?/gi,
    '/images/placeholder.svg',
  );

  if (next !== beforeExternal) {
    warnings.push('Rewrote external image URLs to local /images/placeholder.svg for preview stability');
  }

  return next;
}

function sanitizeTailwindShadcnTokensInCss(code: string, warnings: string[]) {
  const before = code;
  let next = code;

  // Tailwind throws on `@apply` for unknown utilities. Many shadcn templates rely on tokens like
  // `border-border`/`bg-background` which may not exist in generated configs.
  // Map the most common ones to safe Tailwind defaults so the preview doesn't white-screen.
  const replacements: Array<[RegExp, string]> = [
    [/\bborder-border\b/g, 'border-neutral-200 dark:border-neutral-800'],
    [/\bborder-input\b/g, 'border-neutral-300 dark:border-neutral-700'],
    [/\bbg-background\b/g, 'bg-white dark:bg-neutral-950'],
    [/\btext-foreground\b/g, 'text-neutral-900 dark:text-neutral-50'],
    [/\bbg-card\b/g, 'bg-white dark:bg-neutral-900'],
    [/\btext-card-foreground\b/g, 'text-neutral-900 dark:text-neutral-50'],
    [/\bbg-popover\b/g, 'bg-white dark:bg-neutral-900'],
    [/\btext-popover-foreground\b/g, 'text-neutral-900 dark:text-neutral-50'],
    [/\btext-muted-foreground\b/g, 'text-neutral-500 dark:text-neutral-400'],
    [/\bring-ring\b/g, 'ring-neutral-400 dark:ring-neutral-500'],
  ];

  for (const [pattern, replacement] of replacements) {
    next = next.replace(pattern, replacement);
  }

  if (next !== before) {
    warnings.push('Rewrote shadcn Tailwind tokens in CSS to stable neutral defaults');
  }

  return next;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function removeModuleImports(code: string, moduleName: string): string {
  const escaped = escapeRegExp(moduleName);
  const before = code;

  // Remove `import ... from "module"` (supports multi-line import blocks).
  // The tempered pattern prevents accidentally spanning across multiple import statements.
  const fromRe = new RegExp(
    String.raw`^\\s*import(?:(?!^\\s*import)[\\s\\S])*?\\bfrom\\s+['"]${escaped}['"]\\s*;?\\s*$`,
    'gm',
  );

  let next = code.replace(fromRe, '');

  // Remove side-effect imports: `import "module"`.
  const sideEffectRe = new RegExp(String.raw`^\\s*import\\s+['"]${escaped}['"]\\s*;?\\s*$`, 'gm');
  next = next.replace(sideEffectRe, '');

  return next === before ? code : next;
}

function sanitizePackageJson(content: string): { content: string; warnings: string[] } {
  const warnings: string[] = [];

  try {
    const json = JSON.parse(content) as any;
    const deps = (json.dependencies ?? {}) as Record<string, string>;

    let changed = false;

    for (const [dep, version] of Object.entries(DEFAULT_WEB_DEPS)) {
      const current = deps[dep];
      if (!current) {
        deps[dep] = version;
        changed = true;
        warnings.push(`Added dependency to package.json: ${dep}@${version}`);
        continue;
      }

      const currentSemver = extractSemver(current);
      const baselineSemver = extractSemver(version);
      if (!currentSemver || !baselineSemver) continue;

      if (isSemverLess(currentSemver, baselineSemver)) {
        deps[dep] = version;
        changed = true;
        warnings.push(`Upgraded dependency in package.json: ${dep} ${current} -> ${version}`);
      }
    }

    if (changed) {
      json.dependencies = deps;
      return { content: JSON.stringify(json, null, 2) + '\n', warnings };
    }

    return { content, warnings };
  } catch (_error) {
    // If it's not valid JSON yet, don't touch it.
    warnings.push('Skipped package.json sanitization (invalid JSON)');
    return { content, warnings };
  }
}

type Semver = { major: number; minor: number; patch: number };

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
