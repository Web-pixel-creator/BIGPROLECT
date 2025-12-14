#!/usr/bin/env node
/**
 * Extract shadcn.io registry components into a single MD file that our component index can parse.
 *
 * - Reads https://raw.githubusercontent.com/shadcnio/react-shadcn-components/main/README.md
 * - Collects all page URLs (https://www.shadcn.io/*)
 * - For each page, extracts registry URLs (https://www.shadcn.io/registry/*.json)
 * - Downloads registry JSON + registryDependencies recursively
 * - Writes Projects/bolt.diy/shadcn-io-components.md
 */

import fs from 'node:fs';
import path from 'node:path';

const README_URL =
  'https://raw.githubusercontent.com/shadcnio/react-shadcn-components/main/README.md';

const OUT_MD = path.resolve(process.cwd(), 'shadcn-io-components.md');

const FETCH_TIMEOUT_MS = 25_000;
const CONCURRENCY = 6;

function withTimeout(promise, ms, label) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return promise(controller.signal)
    .finally(() => clearTimeout(id))
    .catch((error) => {
      const message = error?.name === 'AbortError' ? `Timeout (${ms}ms)` : String(error?.message || error);
      throw new Error(`${label}: ${message}`);
    });
}

async function fetchText(url) {
  return withTimeout(
    async (signal) => {
      const res = await fetch(url, { signal, headers: { 'user-agent': 'bolt.diy-registry-extractor' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    },
    FETCH_TIMEOUT_MS,
    `GET ${url}`,
  );
}

async function fetchJson(url) {
  const text = await fetchText(url);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON from ${url}`);
  }
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function titleFromSlug(slug) {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function groupFromPageUrl(pageUrl) {
  try {
    const u = new URL(pageUrl);
    const parts = u.pathname.split('/').filter(Boolean);
    return parts[0] || 'misc';
  } catch {
    return 'misc';
  }
}

function extractPageUrls(readme) {
  const urls = [];
  const re = /https:\/\/www\.shadcn\.io\/[a-z0-9\-\/]+/gi;
  for (const m of readme.matchAll(re)) urls.push(m[0]);
  // Drop registry links if any sneaked in
  return uniq(urls.filter((u) => !u.includes('/registry/')));
}

function extractRegistryUrlsFromHtml(html) {
  const urls = [];
  const re = /https:\/\/www\.shadcn\.io\/registry\/[a-z0-9\-\/]+\.json/gi;
  for (const m of html.matchAll(re)) urls.push(m[0]);
  return uniq(urls);
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const i = nextIndex++;
      if (i >= items.length) return;
      results[i] = await fn(items[i], i);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  console.log(`[shadcn.io] Fetching README: ${README_URL}`);
  const readme = await fetchText(README_URL);
  const pages = extractPageUrls(readme);
  console.log(`[shadcn.io] Pages found: ${pages.length}`);

  // page -> registry urls
  const pageRegistryPairs = await mapLimit(pages, CONCURRENCY, async (pageUrl) => {
    const html = await fetchText(pageUrl);
    const registries = extractRegistryUrlsFromHtml(html);
    return { pageUrl, group: groupFromPageUrl(pageUrl), registries };
  });

  const registryToMeta = new Map(); // url -> { group, pages[] }
  for (const pair of pageRegistryPairs) {
    for (const reg of pair.registries) {
      const existing = registryToMeta.get(reg) || { group: pair.group, pages: [] };
      existing.pages.push(pair.pageUrl);
      registryToMeta.set(reg, existing);
    }
  }

  const initialRegistryUrls = Array.from(registryToMeta.keys());
  console.log(`[shadcn.io] Registry URLs discovered: ${initialRegistryUrls.length}`);

  // Recursively fetch registryDependencies
  const allRegistryUrls = new Set(initialRegistryUrls);
  const registryJsonByUrl = new Map();

  async function loadRegistry(url) {
    if (registryJsonByUrl.has(url)) return;
    const json = await fetchJson(url);
    registryJsonByUrl.set(url, json);
    const deps = Array.isArray(json.registryDependencies) ? json.registryDependencies : [];
    for (const dep of deps) {
      if (typeof dep !== 'string') continue;
      // shadcn registryDependencies can be either full URLs or plain names like "button".
      // For extraction we only follow absolute URLs to avoid pulling the entire shadcn/ui registry.
      if (!/^https?:\/\//i.test(dep)) continue;
      if (!allRegistryUrls.has(dep)) allRegistryUrls.add(dep);
    }
  }

  // BFS: keep iterating until no new deps
  let pending = Array.from(allRegistryUrls);
  let processedCount = 0;
  while (pending.length) {
    console.log(`[shadcn.io] Fetching registries... (${processedCount}/${allRegistryUrls.size})`);
    await mapLimit(pending, CONCURRENCY, async (url) => loadRegistry(url));
    processedCount = registryJsonByUrl.size;
    pending = Array.from(allRegistryUrls).filter((u) => !registryJsonByUrl.has(u));
  }

  console.log(`[shadcn.io] Total registries fetched (incl deps): ${registryJsonByUrl.size}`);

  // Build MD
  const byGroup = new Map(); // group -> ComponentEntry[]

  for (const [url, json] of registryJsonByUrl.entries()) {
    const meta = registryToMeta.get(url);
    const group = meta?.group || 'deps';
    const pagesForThis = meta?.pages || [];

    const files = Array.isArray(json.files) ? json.files : [];

    // If a registry bundles multiple components (e.g. ai.json), split by file target basename.
    if (files.length > 1) {
      for (const f of files) {
        const target = f?.target || f?.path || '';
        const base = path.basename(target).replace(/\.(t|j)sx?$/i, '');
        const name = `${json.name}-${base}`.toLowerCase();
        const entry = {
          group,
          name,
          title: titleFromSlug(base),
          registryUrl: url,
          pages: pagesForThis,
          dependencies: Array.isArray(json.dependencies) ? json.dependencies : [],
          codeBlocks: [
            {
              header: `// File: ${target}`,
              content: String(f?.content || ''),
            },
          ],
        };
        if (!byGroup.has(group)) byGroup.set(group, []);
        byGroup.get(group).push(entry);
      }
      continue;
    }

    const name = String(json.name || '').trim();
    if (!name) continue;
    const entry = {
      group,
      name,
      title: titleFromSlug(name),
      registryUrl: url,
      pages: pagesForThis,
      dependencies: Array.isArray(json.dependencies) ? json.dependencies : [],
      codeBlocks: files.map((f) => ({
        header: `// File: ${f?.target || f?.path || ''}`,
        content: String(f?.content || ''),
      })),
    };

    if (!byGroup.has(group)) byGroup.set(group, []);
    byGroup.get(group).push(entry);
  }

  const groups = Array.from(byGroup.keys()).sort();
  const lines = [];
  lines.push('# shadcn.io Registry Components');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('Source: https://github.com/shadcnio/react-shadcn-components');
  lines.push('');

  for (const group of groups) {
    const entries = byGroup.get(group) || [];
    // deterministic order
    entries.sort((a, b) => a.name.localeCompare(b.name));
    lines.push(`## ${group}`);
    lines.push('');

    for (const c of entries) {
      lines.push(`### ${c.title} (${c.name})`);
      if (c.pages.length) {
        lines.push(`**Docs:** ${c.pages[0]}`);
      }
      lines.push(`**Registry:** ${c.registryUrl}`);
      if (c.dependencies.length) {
        lines.push(`**Dependencies:** ${c.dependencies.join(', ')}`);
      }
      lines.push('');
      for (const block of c.codeBlocks) {
        lines.push('```tsx');
        if (block.header && block.header !== '// File: ') lines.push(block.header);
        lines.push(block.content.trimEnd());
        lines.push('```');
        lines.push('');
      }
      lines.push('---');
      lines.push('');
    }
  }

  fs.writeFileSync(OUT_MD, lines.join('\n'), 'utf8');
  console.log(`[shadcn.io] Wrote ${OUT_MD} (groups=${groups.length})`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
