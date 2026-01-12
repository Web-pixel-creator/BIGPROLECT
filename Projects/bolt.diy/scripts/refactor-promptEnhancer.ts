/**
 * Script to refactor promptEnhancer.ts by removing duplicated functions
 * and adding imports from new utility modules
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../app/lib/services/promptEnhancer.ts');
const lines = fs.readFileSync(filePath, 'utf-8').split('\n');

// Ranges to remove (0-indexed, inclusive)
const rangesToRemove = [
  { start: 66, end: 83 },    // type RegistryComponent, ComponentIndex, COMPONENT_REGISTRY, SAFE_COMPONENT_IMPORTS, IMPORT_RE
  { start: 85, end: 99 },    // extractComponentImports
  { start: 101, end: 127 },  // isSafeComponent
  { start: 129, end: 136 },  // SAFE_COMPONENT_REGISTRY, RECENT_COMPONENT_LIMIT, recentComponentQueue, recentComponentSet, recentSectionVariants
  { start: 138, end: 141 },  // pickEffectIds
  { start: 143, end: 152 },  // buildEffectDirectiveBlock
  { start: 154, end: 171 },  // rememberRecentComponent
  { start: 173, end: 187 },  // pickNonRepeatingVariant
  { start: 189, end: 231 },  // resolveSectionVariantOptions
  { start: 233, end: 263 },  // buildSectionVariantBlock
  { start: 265, end: 270 },  // componentText
  { start: 272, end: 314 },  // componentScore
  { start: 316, end: 345 },  // pickComponentForSection
  { start: 347, end: 392 },  // buildComponentDirectives
  { start: 394, end: 412 },  // detectTheme
  { start: 414, end: 435 },  // extractBrandName
  { start: 437, end: 447 },  // hashString
  { start: 449, end: 455 },  // generateBrandName
  { start: 463, end: 471 },  // hasUserSpecifiedColors
  { start: 479, end: 534 },  // extractUserColors
  { start: 536, end: 552 },  // matchesWord
  { start: 554, end: 569 },  // matchesKeyword
  { start: 577, end: 603 },  // extractColorsFromWords
  { start: 611, end: 615 },  // hasColorWords
  { start: 617, end: 647 },  // extractRequirementLines
  { start: 649, end: 673 },  // extractSectionOrder
  { start: 680, end: 713 },  // inferSectionKey
  { start: 716, end: 730 },  // inferAllSections
  { start: 732, end: 861 },  // extractSectionSpecs
  { start: 1004, end: 1021 }, // buildColorDirectiveBlock
  { start: 1023, end: 1038 }, // buildSectionDetailsBlock
  { start: 1061, end: 1126 }, // buildSectionGuardrails
  { start: 1128, end: 1146 }, // buildSectionBlueprint
];

// Create set of lines to skip
const skipLines = new Set<number>();
for (const range of rangesToRemove) {
  for (let i = range.start; i <= range.end; i++) {
    skipLines.add(i);
  }
}

// New imports to add
const newImports = `import {
  hasUserSpecifiedColors,
  extractUserColors,
  matchesKeyword,
  extractColorsFromWords,
  hasColorWords,
  buildColorDirectiveBlock,
} from './prompt-color-utils';
import { detectTheme, extractBrandName, generateBrandName } from './prompt-theme-utils';
import {
  extractRequirementLines,
  extractSectionOrder,
  extractSectionSpecs,
  buildSectionDetailsBlock,
  buildSectionGuardrails,
  buildSectionBlueprint,
} from './prompt-section-utils';
import { buildEffectDirectiveBlock, buildSectionVariantBlock } from './prompt-variant-utils';
import { buildComponentDirectives, SAFE_COMPONENT_REGISTRY } from './prompt-component-utils';
`;

// Build new file
const newLines: string[] = [];
let importsAdded = false;

for (let i = 0; i < lines.length; i++) {
  if (skipLines.has(i)) continue;
  
  // Add new imports after existing imports
  if (!importsAdded && lines[i].startsWith("import { pickRandomUnique }")) {
    newLines.push(lines[i]);
    newLines.push(newImports);
    importsAdded = true;
    continue;
  }
  
  // Skip componentIndex import
  if (lines[i].includes("import componentIndex from")) continue;
  
  newLines.push(lines[i]);
}

// Remove consecutive empty lines
const cleanedLines: string[] = [];
let prevEmpty = false;
for (const line of newLines) {
  const isEmpty = line.trim() === '';
  if (isEmpty && prevEmpty) continue;
  cleanedLines.push(line);
  prevEmpty = isEmpty;
}

console.log(`Original: ${lines.length} lines`);
console.log(`After refactor: ${cleanedLines.length} lines`);
console.log(`Removed: ${lines.length - cleanedLines.length} lines`);

// Write new file
fs.writeFileSync(filePath, cleanedLines.join('\n'), 'utf-8');
console.log('File updated successfully');
