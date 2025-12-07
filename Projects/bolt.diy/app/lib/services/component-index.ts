import * as fs from 'fs';
import * as path from 'path';

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
};

const MD_FILES = [
  'shadcnui-blocks.md',
  'aceternity-components.md',
  'kokonutui-components.md',
  'magicui-components.md',
  'reactbits-components.md',
  '21st-dev-components.md',
  '21st-dev-components-part2.md',
  'tailark-components.md',
];

const REGISTRY_JSON = 'Projects/bolt.diy/component-registry.json';
const CACHE_PATH = 'Projects/bolt.diy/app/lib/services/component-index-cache.json';

export function buildIndex(mdDir: string = process.cwd(), useCache: boolean = true): ComponentIndex {
  const cacheFullPath = path.resolve(process.cwd(), CACHE_PATH);
  const registryPath = path.resolve(process.cwd(), REGISTRY_JSON);

  const mdPaths = MD_FILES.map((f) => path.resolve(mdDir, f)).filter((p) => fs.existsSync(p));
  const newestMd = mdPaths.reduce((ts, p) => Math.max(ts, fs.statSync(p).mtimeMs), 0);
  const registryMtime = fs.existsSync(registryPath) ? fs.statSync(registryPath).mtimeMs : 0;
  const newestSource = Math.max(newestMd, registryMtime);

  if (useCache && fs.existsSync(cacheFullPath)) {
    try {
      const cacheStat = fs.statSync(cacheFullPath);
      if (cacheStat.mtimeMs >= newestSource) {
        const cached = JSON.parse(fs.readFileSync(cacheFullPath, 'utf8')) as ComponentIndex;
        if (!cached.generatedAt) cached.generatedAt = cacheStat.mtimeMs;
        if (cached?.components?.length) return cached;
      }
    } catch {
      // ignore cache errors
    }
  }

  // Prefer JSON registry if present
  if (fs.existsSync(registryPath)) {
    try {
      const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8')) as ComponentIndex;
      const deduped = dedupeByName(registry.components || []);
      const indexFromRegistry: ComponentIndex = {
        components: deduped,
        total: deduped.length,
        generatedAt: Date.now(),
      };
      writeCache(cacheFullPath, indexFromRegistry);
      return indexFromRegistry;
    } catch {
      // fall back to MD parsing
    }
  }

  const components: ComponentMeta[] = [];

  for (const file of MD_FILES) {
    const fullPath = path.resolve(mdDir, file);
    if (!fs.existsSync(fullPath)) continue;
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    let currentCategory = file.replace('.md', '').toLowerCase();
    let currentRawCategory = currentCategory;
    let currentComponent: Partial<ComponentMeta> | null = null;
    let codeBuffer: string[] = [];
    let inCode = false;

    for (const line of lines) {
      if (line.startsWith('## ')) {
        currentRawCategory = line.replace('## ', '').trim();
        currentCategory = currentRawCategory.split(' ')[0].toLowerCase();
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
              ]),
            ],
          });
        }
        const match = line.match(/### (.+?) \((.+?)\)/);
        if (match) {
          currentComponent = {
            description: match[1],
            name: match[2],
            category: currentCategory,
            source: file,
            code: '',
          };
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
      if (inCode) codeBuffer.push(line);
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
          ]),
        ],
      });
    }
  }

  const deduped = dedupeByName(components);
  const index: ComponentIndex = { components: deduped, total: deduped.length, generatedAt: Date.now() };
  writeCache(cacheFullPath, index);
  return index;
}

function dedupeByName(components: ComponentMeta[]): ComponentMeta[] {
  const seenNames = new Set<string>();
  const deduped: ComponentMeta[] = [];
  for (const comp of components) {
    const key = (comp.name || '').toLowerCase();
    if (seenNames.has(key)) continue;
    seenNames.add(key);
    deduped.push(comp);
  }
  return deduped;
}

function writeCache(cacheFullPath: string, index: ComponentIndex) {
  try {
    const dir = path.dirname(cacheFullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(cacheFullPath, JSON.stringify(index, null, 2), 'utf8');
  } catch {
    // ignore cache write errors
  }
}
