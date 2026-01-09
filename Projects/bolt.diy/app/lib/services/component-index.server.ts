import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

export type ComponentMeta = {
  name: string;
  description: string;
  category: string;
  source: string;
  code: string;
  rawCategory?: string;
  tags?: string[];
};

export type ComponentIndex = {
  components: ComponentMeta[];
  total: number;
  generatedAt?: number;
  mdFiles?: string[];
  cacheVersion?: number;
};

const MD_FILES = [
  'shadcnui-blocks.md',
  'aceternity-components.md',
  'kokonutui-components.md',
  'magicui-components.md',
  'magicui-bento-grid.md',
  'magicui-tweet-card.md',
  'magicui-extra.md',
  'reactbits-components.md',
  '21st-dev-components.md',
  '21st-dev-components-part2.md',
  'shadcn-io-components.md',
  'tailark-components.md',
  'coss-origin-navbars.md',
];

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
export const BOLT_ROOT = path.resolve(MODULE_DIR, '../../..');

const REGISTRY_JSON = 'component-registry.json';
const CACHE_PATH = 'app/lib/services/component-index-cache.json';
const CACHE_VERSION = 2;

export function buildIndex(mdDir: string = BOLT_ROOT, useCache: boolean = true): ComponentIndex {
  const cacheFullPath = path.resolve(mdDir, CACHE_PATH);
  const registryPath = path.resolve(mdDir, REGISTRY_JSON);

  const mdPaths = MD_FILES.map((f) => path.resolve(mdDir, f)).filter((p) => fs.existsSync(p));
  const newestMd = mdPaths.reduce((ts, p) => Math.max(ts, fs.statSync(p).mtimeMs), 0);
  const registryMtime = fs.existsSync(registryPath) ? fs.statSync(registryPath).mtimeMs : 0;
  const newestSource = Math.max(newestMd, registryMtime);

  if (useCache && fs.existsSync(cacheFullPath)) {
    try {
      const cacheStat = fs.statSync(cacheFullPath);

      if (cacheStat.mtimeMs >= newestSource) {
        const cached = JSON.parse(fs.readFileSync(cacheFullPath, 'utf8')) as ComponentIndex;

        if (!cached.generatedAt) {
          cached.generatedAt = cacheStat.mtimeMs;
        }

        if (
          cached?.components?.length &&
          cached.cacheVersion === CACHE_VERSION &&
          Array.isArray(cached.mdFiles) &&
          cached.mdFiles.length === MD_FILES.length &&
          cached.mdFiles.every((file, index) => file === MD_FILES[index])
        ) {
          return cached;
        }
      }
    } catch {
      // ignore cache errors
    }
  }

  // Prefer JSON registry if present
  if (fs.existsSync(registryPath)) {
    try {
      const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8')) as ComponentIndex;
      const merged = mergeWithMD(registry.components || [], mdDir);
      const deduped = dedupeByName(merged);
      const indexFromRegistry: ComponentIndex = {
        components: deduped,
        total: deduped.length,
        generatedAt: Date.now(),
        mdFiles: [...MD_FILES],
        cacheVersion: CACHE_VERSION,
      };
      writeCache(cacheFullPath, indexFromRegistry);

      return indexFromRegistry;
    } catch {
      // fall back to MD parsing
    }
  }

  const parsed = mergeWithMD([], mdDir);
  const deduped = dedupeByName(parsed);
  const index: ComponentIndex = {
    components: deduped,
    total: deduped.length,
    generatedAt: Date.now(),
    mdFiles: [...MD_FILES],
    cacheVersion: CACHE_VERSION,
  };
  writeCache(cacheFullPath, index);

  return index;
}

function mergeWithMD(existing: ComponentMeta[], mdDir: string): ComponentMeta[] {
  const components: ComponentMeta[] = [...existing];

  for (const file of MD_FILES) {
    const fullPath = path.resolve(mdDir, file);

    if (!fs.existsSync(fullPath)) {
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    let currentCategory = file.replace('.md', '').toLowerCase();
    let currentRawCategory = currentCategory;
    let currentComponent: Partial<ComponentMeta> | null = null;
    let pendingAuthorTag: string | null = null;
    let codeBuffer: string[] = [];
    let inCode = false;

    for (const line of lines) {
      if (line.startsWith('## ')) {
        currentRawCategory = line.replace('## ', '').trim();

        const cleanedCategory = currentRawCategory.replace(/^[^A-Za-z0-9]+/, '').trim();
        const categoryToken = cleanedCategory.split(/\s+/)[0];
        currentCategory = (categoryToken || file.replace('.md', '')).toLowerCase();
        continue;
      }

      if (line.startsWith('### ')) {
        if (currentComponent?.name) {
          components.push({
            name: currentComponent.name,
            description: currentComponent.description || '',
            category: currentCategory,
            source: file,
            code: (currentComponent.code || '').trim(),
            rawCategory: currentRawCategory,
            tags: [
              ...new Set([
                currentCategory,
                ...(currentRawCategory ? currentRawCategory.toLowerCase().split(/\s+/) : []),
                ...(pendingAuthorTag ? [pendingAuthorTag.toLowerCase()] : []),
              ]),
            ],
          });
        }

        pendingAuthorTag = null;

        const match = line.match(/### (.+?) \((.+?)\)/);

        if (match) {
          const left = match[1].trim();
          const right = match[2].trim();

          /*
           * Support two formats:
           * 1) "Title Case Name (component-id)"  -> description=Title Case Name, name=component-id
           * 2) "component-id (author)"          -> description=Title Case from id, name=component-id, tag=author
           */
          const leftLooksSlug = /^[a-z0-9][a-z0-9-]*$/.test(left);
          const leftLooksTitle = /[A-Z]/.test(left) || left.includes(' ');

          if (leftLooksTitle) {
            currentComponent = { description: left, name: right, category: currentCategory, source: file, code: '' };
          } else if (leftLooksSlug) {
            pendingAuthorTag = right;
            currentComponent = {
              description: left.replace(/-/g, ' '),
              name: left,
              category: currentCategory,
              source: file,
              code: '',
            };
          } else {
            // Fallback to old behavior
            currentComponent = { description: left, name: right, category: currentCategory, source: file, code: '' };
          }
        }

        codeBuffer = [];
        continue;
      }

      if (line.startsWith('```')) {
        if (inCode && currentComponent) {
          currentComponent.code = (currentComponent.code || '') + codeBuffer.join('\n') + '\n\n';
          codeBuffer = [];
        }

        inCode = !inCode;
        continue;
      }

      if (inCode) {
        codeBuffer.push(line);
      }
    }

    if (currentComponent?.name) {
      components.push({
        name: currentComponent.name,
        description: currentComponent.description || '',
        category: currentCategory,
        source: file,
        code: (currentComponent.code || '').trim(),
        rawCategory: currentRawCategory,
        tags: [
          ...new Set([
            currentCategory,
            ...(currentRawCategory ? currentRawCategory.toLowerCase().split(/\s+/) : []),
            ...(pendingAuthorTag ? [pendingAuthorTag.toLowerCase()] : []),
          ]),
        ],
      });
    }
  }

  return components;
}

function dedupeByName(components: ComponentMeta[]): ComponentMeta[] {
  type Bucket = {
    best: ComponentMeta;
    tags: Set<string>;
  };

  const buckets = new Map<string, Bucket>();
  const order: string[] = [];

  for (const comp of components) {
    const key = (comp.name || '').trim().toLowerCase();

    if (!key) {
      continue;
    }

    const existing = buckets.get(key);
    const nextTags = new Set<string>([...(existing?.tags ?? []), ...((comp.tags ?? []) as string[])]);

    if (!existing) {
      buckets.set(key, { best: comp, tags: nextTags });
      order.push(key);
      continue;
    }

    existing.tags = nextTags;

    if (componentQualityScore(comp) > componentQualityScore(existing.best)) {
      existing.best = comp;
    }
  }

  return order
    .map((key): ComponentMeta | null => {
      const bucket = buckets.get(key);

      if (!bucket) {
        return null;
      }

      return { ...bucket.best, tags: Array.from(bucket.tags) };
    })
    .filter((comp): comp is ComponentMeta => comp !== null);
}

function componentQualityScore(comp: ComponentMeta): number {
  const codeLen = (comp.code || '').trim().length;
  const descLen = (comp.description || '').trim().length;
  const src = (comp.source || '').toLowerCase();

  let score = 0;

  // Prefer components that actually include code (common issue: duplicates with empty code).
  if (codeLen > 0) {
    score += 1_000_000;
  }

  // Prefer richer code (cap so huge files don't dominate too hard).
  score += Math.min(codeLen, 20_000);

  // Prefer informative descriptions.
  score += Math.min(descLen, 500);

  // Slight source bias towards our most reliable extractions.
  if (src.includes('21st-dev')) {
    score += 2_000;
  }

  if (src.includes('reactbits')) {
    score += 1_000;
  }

  if (src.includes('aceternity')) {
    score += 800;
  }

  if (src.includes('kokonut')) {
    score += 400;
  }

  if (src.includes('tailark')) {
    score += 300;
  }

  if (src.includes('shadcnui-blocks')) {
    score += 300;
  }

  // Some sources are known to contain install-only stubs for a subset of items.
  if (src.includes('magicui-components.md')) {
    score -= 300;
  }

  return score;
}

function writeCache(cacheFullPath: string, index: ComponentIndex) {
  try {
    const dir = path.dirname(cacheFullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(cacheFullPath, JSON.stringify(index, null, 2), 'utf8');
  } catch {
    // ignore cache write errors
  }
}
