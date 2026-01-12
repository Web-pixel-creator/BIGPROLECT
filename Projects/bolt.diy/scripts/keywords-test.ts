/**
 * Keywords Validation Test
 * Validates consistency between prompt-data modules and component-aliases.json
 * 
 * Checks:
 * 1. All themes in THEME_KEYWORDS exist in THEME_PALETTES
 * 2. All themes in THEME_KEYWORDS exist in THEME_IMAGE_QUERIES
 * 3. component-aliases.json themes match THEME_KEYWORDS themes
 * 4. No duplicate keywords within a theme
 * 5. No empty keyword arrays
 */
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVICES_PATH = path.join(__dirname, '..', 'app', 'lib', 'services');

type AliasesJson = {
  componentKeywords?: Record<string, string[]>;
  themeKeywords?: Record<string, string[]>;
};

const errors: string[] = [];
const warnings: string[] = [];

// Dynamic import of prompt-data
const {
  THEME_KEYWORDS,
  THEME_KEYWORDS_RU,
  getMergedKeywords,
  THEME_PALETTES,
  THEME_IMAGE_QUERIES,
} = await import('../app/lib/services/prompt-data/index.js');

// Load component-aliases.json
const aliasesPath = path.join(SERVICES_PATH, 'component-aliases.json');
let aliases: AliasesJson = {};

if (existsSync(aliasesPath)) {
  const raw = await readFile(aliasesPath, 'utf-8');
  aliases = JSON.parse(raw) as AliasesJson;
} else {
  warnings.push('component-aliases.json not found');
}

// Check 1: All themes in THEME_KEYWORDS exist in THEME_PALETTES
console.log('Checking THEME_KEYWORDS vs THEME_PALETTES...');

for (const theme of Object.keys(THEME_KEYWORDS)) {
  if (!(theme in THEME_PALETTES)) {
    errors.push(`Theme "${theme}" in THEME_KEYWORDS but not in THEME_PALETTES`);
  }
}

for (const theme of Object.keys(THEME_PALETTES)) {
  if (!(theme in THEME_KEYWORDS)) {
    warnings.push(`Theme "${theme}" in THEME_PALETTES but not in THEME_KEYWORDS`);
  }
}

// Check 2: All themes in THEME_KEYWORDS exist in THEME_IMAGE_QUERIES
console.log('Checking THEME_KEYWORDS vs THEME_IMAGE_QUERIES...');

for (const theme of Object.keys(THEME_KEYWORDS)) {
  if (!(theme in THEME_IMAGE_QUERIES)) {
    warnings.push(`Theme "${theme}" in THEME_KEYWORDS but not in THEME_IMAGE_QUERIES`);
  }
}

// Check 3: component-aliases.json themes match
console.log('Checking component-aliases.json consistency...');

if (aliases.themeKeywords) {
  for (const theme of Object.keys(aliases.themeKeywords)) {
    if (!(theme in THEME_KEYWORDS)) {
      warnings.push(`Theme "${theme}" in component-aliases.json but not in THEME_KEYWORDS`);
    }
  }
}

// Check 4: No duplicate keywords within a theme
console.log('Checking for duplicate keywords...');
const merged = getMergedKeywords();

for (const [theme, keywords] of Object.entries(merged)) {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const keyword of keywords) {
    const lower = keyword.toLowerCase();

    if (seen.has(lower)) {
      duplicates.push(keyword);
    }

    seen.add(lower);
  }

  if (duplicates.length > 0) {
    warnings.push(`Theme "${theme}" has duplicate keywords: ${duplicates.join(', ')}`);
  }
}

// Check 5: No empty keyword arrays
console.log('Checking for empty keyword arrays...');

for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
  if (!Array.isArray(keywords) || keywords.length === 0) {
    errors.push(`Theme "${theme}" has empty or invalid keywords array`);
  }
}

for (const [theme, keywords] of Object.entries(THEME_KEYWORDS_RU)) {
  if (!Array.isArray(keywords) || keywords.length === 0) {
    errors.push(`RU Theme "${theme}" has empty or invalid keywords array`);
  }
}

// Check 6: Keywords are non-empty strings
console.log('Checking keyword validity...');

for (const [theme, keywords] of Object.entries(merged)) {
  for (const keyword of keywords) {
    if (typeof keyword !== 'string' || keyword.trim().length === 0) {
      errors.push(`Theme "${theme}" has invalid keyword: ${JSON.stringify(keyword)}`);
    }
  }
}

// Report results
console.log('');

if (errors.length > 0) {
  console.error(`ERRORS (${errors.length}):`);

  for (const error of errors) {
    console.error(`  - ${error}`);
  }
}

if (warnings.length > 0) {
  console.warn(`\nWARNINGS (${warnings.length}):`);

  for (const warning of warnings) {
    console.warn(`  - ${warning}`);
  }
}

if (errors.length > 0) {
  console.error(`\nKeywords test FAILED (${errors.length} errors, ${warnings.length} warnings)`);
  process.exitCode = 1;
} else if (warnings.length > 0) {
  console.log(`\nKeywords test PASSED with warnings (${warnings.length} warnings)`);
} else {
  console.log('\nKeywords test PASSED');
}
