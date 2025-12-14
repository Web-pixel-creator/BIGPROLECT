import { path as nodePath } from './path';

type SanitizationResult = {
  content: string;
  changed: boolean;
  warnings: string[];
};

const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mts', '.cts', '.mjs', '.cjs']);

// Conservative default versions taken from this repo's own dependencies.
const DEFAULT_WEB_DEPS: Record<string, string> = {
  'clsx': '^2.1.1',
  'framer-motion': '^11.12.0',
  'lucide-react': '^0.485.0',
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

  next = sanitizeImportPaths(next, relativePath, warnings);
  next = sanitizeLucide(next, warnings);
  next = sanitizeNext(next, warnings);
  next = sanitizeRouter(next, warnings);

  return { content: next, changed: next !== content, warnings };
}

function sanitizeImportPaths(code: string, relativePath: string, warnings: string[]) {
  // Fix common alias usage in generated Vite projects:
  // - "@/..." assumes Next/shadcn-style alias; convert to relative path against src/.
  const fileDir = nodePath.dirname(relativePath);

  return code.replace(/from\s+(['"])@\/([^'"]+)\1/g, (_match, quote: string, aliasPath: string) => {
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
  // If the file imports House from lucide-react, replace with Home and adjust usages conservatively.
  let replacedHouseImport = false;
  next = next.replace(
    /^import\s+\{([^}]*?)\}\s+from\s+['"]lucide-react['"]\s*;?\s*$/gm,
    (full, specifiers: string) => {
      if (!/\bHouse\b/.test(specifiers)) return full;

      const parts = specifiers
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);

      const mapped = parts.map((part) => {
        if (/^House(\s+as\s+.+)?$/.test(part) || /^House\s+as\s+/.test(part)) {
          replacedHouseImport = true;
          return part.replace(/^House\b/, 'Home');
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

      warnings.push('Replaced lucide icon House -> Home');
      return `import { ${deduped.join(', ')} } from "lucide-react";`;
    },
  );

  if (replacedHouseImport) {
    next = next.replace(/<\s*House\b/g, '<Home');
    next = next.replace(/<\/\s*House\b/g, '</Home');
    next = next.replace(/\bHouse\b/g, 'Home');
  }

  // LLM иногда пишет `import { Lucide } from "lucide-react"` — такого экспорта нет.
  // Безопасный вариант: убрать Lucide из импортов; если он реально используется, TS всё равно упадёт,
  // но на практике это почти всегда ошибка импорта.
  const beforeLucide = next;
  next = next.replace(
    /^import\s+\{([^}]*?)\}\s+from\s+['"]lucide-react['"]\s*;?\s*$/gm,
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
  next = next.replace(/^import\s+.*from\s+['"]next\/image['"]\s*;?\s*$/gm, '');
  if (next !== beforeNextImage) {
    warnings.push('Removed next/image import (use <img>)');
    next = next.replace(/<\s*Image\b/g, '<img');
    next = next.replace(/<\/\s*Image\b/g, '</img');
  }

  // next/link is not available; convert to <a>.
  const beforeNextLink = next;
  next = next.replace(/^import\s+.*from\s+['"]next\/link['"]\s*;?\s*$/gm, '');
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
  next = next.replace(/^import\s+.*from\s+['"]react-router-dom['"]\s*;?\s*$/gm, '');
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

function sanitizePackageJson(content: string): { content: string; warnings: string[] } {
  const warnings: string[] = [];

  try {
    const json = JSON.parse(content) as any;
    const deps = (json.dependencies ?? {}) as Record<string, string>;

    let changed = false;

    for (const [dep, version] of Object.entries(DEFAULT_WEB_DEPS)) {
      if (!deps[dep]) {
        deps[dep] = version;
        changed = true;
        warnings.push(`Added dependency to package.json: ${dep}@${version}`);
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
