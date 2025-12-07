#!/usr/bin/env node
/**
 * Build a structured component registry JSON from markdown sources.
 *
 * Reads the same MD files used by component matcher/index and produces
 * Projects/bolt.diy/component-registry.json with normalized entries:
 * {
 *   components: [
 *     { name, description, category, source, code, rawCategory, tags }
 *   ],
 *   total,
 *   generatedAt
 * }
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT_PATH = path.join(ROOT, 'Projects/bolt.diy/component-registry.json');

// Keep in sync with matcher/index sources
// Priority: earlier wins on duplicate names
const MD_FILES = [
  'shadcnui-blocks.md',          // highest priority (core shadcn blocks)
  'magicui-components.md',       // premium UI/effects
  'aceternity-components.md',
  'kokonutui-components.md',
  'reactbits-components.md',
  '21st-dev-components.md',
  '21st-dev-components-part2.md',
  'tailark-components.md',       // lowest priority (many variants)
];

function parseMd(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let currentCategory = path.basename(filePath, '.md').toLowerCase();
  let currentRawCategory = currentCategory;
  let current = null;
  let inCode = false;
  let codeBuf = [];
  const components = [];

  const pushCurrent = () => {
    if (!current?.name) return;
    components.push({
      name: current.name.trim(),
      description: current.description || '',
      category: currentCategory,
      source: path.basename(filePath),
      code: (current.code || '').trim(),
      rawCategory: currentRawCategory,
      tags: Array.from(
        new Set([
          currentCategory,
          ...(currentRawCategory ? currentRawCategory.toLowerCase().split(/\s+/) : []),
        ])
      ),
    });
  };

  for (const line of lines) {
    if (line.startsWith('## ')) {
      currentRawCategory = line.replace('## ', '').trim();
      currentCategory = currentRawCategory.split(' ')[0].toLowerCase();
      continue;
    }
    if (line.startsWith('### ')) {
      pushCurrent();
      const match = line.match(/### (.+?) \((.+?)\)/);
      if (match) {
        current = {
          description: match[1],
          name: match[2],
          code: '',
        };
      } else {
        current = null;
      }
      codeBuf = [];
      continue;
    }
    if (line.startsWith('```')) {
      if (inCode && current) {
        current.code = (current.code || '') + codeBuf.join('\n') + '\n';
        codeBuf = [];
      }
      inCode = !inCode;
      continue;
    }
    if (inCode) codeBuf.push(line);
  }
  pushCurrent();
  return components;
}

function buildRegistry() {
  const merged = new Map(); // name -> component (respecting priority order)

  for (const file of MD_FILES) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) continue;
    const items = parseMd(full);
    for (const comp of items) {
      const key = comp.name.toLowerCase();
      // First occurrence wins because MD_FILES is ordered by priority
      if (merged.has(key)) continue;
      merged.set(key, comp);
    }
  }

  const deduped = Array.from(merged.values());

  const payload = {
    components: deduped,
    total: deduped.length,
    generatedAt: Date.now(),
    sources: MD_FILES,
  };
  const outDir = path.dirname(OUT_PATH);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`Registry built: ${OUT_PATH} (components: ${payload.total})`);
}

buildRegistry();
