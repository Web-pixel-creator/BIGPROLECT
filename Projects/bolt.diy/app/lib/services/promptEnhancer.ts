/**
 *
 * Prompt Enhancer Service
 *
 * Analyzes user prompt and automatically adds design system (colors, images, structure)
 *
 * before sending to LLM
 *
 */

import type { SectionContract } from '~/types/section-contract';
import componentIndex from './component-index-cache.json';
import {
  randomSeedString,
  pickRandom as pickRandomFromData,
  getMergedKeywords,
  getMergedColors,
  THEME_PALETTES,
  THEME_IMAGE_QUERIES,
  MAX_IMAGE_COUNTS,
  SECTION_IMAGE_MIN_COUNTS,
  SECTION_KEYWORDS,
  COMPONENT_SECTION_KEYWORDS,
  HERO_FULL_WIDTH_VARIANTS,
  HERO_SPLIT_VARIANTS,
  HERO_GRID_VARIANTS,
  HERO_TYPO_VARIANTS,
  HERO_DEFAULT_VARIANTS,
  CATEGORY_VARIANTS,
  PRODUCT_VARIANTS,
  FOOTER_VARIANTS,
  NAV_VARIANTS,
  FEATURE_VARIANTS,
  THEME_ART_DIRECTIONS,
  THEME_SIGNATURE_MOVES,
  GLOBAL_SIGNATURE_MOVES,
  THEME_EFFECT_IDS,
  THEME_LAYOUT_ARCHETYPES,
  FALLBACK_BRANDS,
  STYLE_CUE_TOKENS,
  type ImageSet,
} from './prompt-data';
import { pickRandomUnique } from './prompt-random-utils';
import {
  limitList,
  mergeImageSets,
  recordRecentImages,
  filterRecentImages,
  buildImageSet,
  buildImageSearchQueries,
  buildImageSearchCounts,
  normalizeImageSet,
  proxyImageUrl,
  proxyImageSet,
  applyImageSeed,
  fetchImageSetFromApi,
} from './prompt-image-utils';

// Merged keywords (EN + RU)
const THEME_KEYWORDS = getMergedKeywords();

// Merged colors (EN + RU)
const COLOR_WORDS_TO_HEX = getMergedColors();


// buildIndex removed - server-only
type RegistryComponent = {
  name: string;
  description: string;
  category: string;
  source: string;
  tags?: string[];
  code?: string;
};

type ComponentIndex = {
  components?: RegistryComponent[];
};

const COMPONENT_REGISTRY: RegistryComponent[] = ((componentIndex as ComponentIndex).components ?? []).filter(Boolean);

const SAFE_COMPONENT_IMPORTS = new Set(['react', 'framer-motion', 'lucide-react', 'clsx', 'tailwind-merge']);

const IMPORT_RE = /import\s+[^;]*?from\s+['"]([^'"]+)['"]/g;

function extractComponentImports(code: string): string[] {
  if (!code) {
    return [];
  }

  const imports: string[] = [];
  let match: RegExpExecArray | null = null;
  IMPORT_RE.lastIndex = 0;

  while ((match = IMPORT_RE.exec(code))) {
    imports.push(match[1]);
  }

  return imports;
}

function isSafeComponent(component: RegistryComponent): boolean {
  const code = component.code || '';

  if (!code) {
    return false;
  }

  if (code.includes('next/') || code.includes('react-router-dom')) {
    return false;
  }

  const imports = extractComponentImports(code);

  for (const imp of imports) {
    if (imp.startsWith('./') || imp.startsWith('../') || imp.startsWith('@/') || imp.startsWith('~/')) {
      return false;
    }

    if (SAFE_COMPONENT_IMPORTS.has(imp) || imp.startsWith('react/')) {
      continue;
    }

    return false;
  }

  return true;
}

const SAFE_COMPONENT_REGISTRY: RegistryComponent[] = COMPONENT_REGISTRY.filter((component) =>
  isSafeComponent(component),
);

const RECENT_COMPONENT_LIMIT = 16;
const recentComponentQueue: string[] = [];
const recentComponentSet = new Set<string>();
const recentSectionVariants = new Map<string, string>();

function pickEffectIds(theme: string, count: number): string[] {
  const list = THEME_EFFECT_IDS[theme] ?? THEME_EFFECT_IDS.default;
  return pickRandomUnique(list, count);
}

function buildEffectDirectiveBlock(theme: string): string {
  const picks = pickEffectIds(theme, 2);

  if (picks.length === 0) {
    return '';
  }

  return `
EFFECTS (apply in UI): ${picks.join(', ')}`;
}

function rememberRecentComponent(name: string) {
  const key = (name || '').trim().toLowerCase();

  if (!key || recentComponentSet.has(key)) {
    return;
  }

  recentComponentSet.add(key);
  recentComponentQueue.push(key);

  if (recentComponentQueue.length > RECENT_COMPONENT_LIMIT) {
    const removed = recentComponentQueue.shift();

    if (removed) {
      recentComponentSet.delete(removed);
    }
  }
}

function pickNonRepeatingVariant(section: string, options: string[]): string {
  if (!options || options.length === 0) {
    return '';
  }

  const last = recentSectionVariants.get(section);
  const filtered = last ? options.filter((option) => option !== last) : options;
  const choice = pickRandomUnique(filtered.length > 0 ? filtered : options, 1)[0] ?? options[0];

  if (choice) {
    recentSectionVariants.set(section, choice);
  }

  return choice;
}

function resolveSectionVariantOptions(section: string, lowerPrompt: string): string[] {
  if (section === 'hero') {
    if (/full[-\s]?width|full[-\s]?screen|full[-\s]?bleed/.test(lowerPrompt)) {
      return HERO_FULL_WIDTH_VARIANTS;
    }

    if (/split|two[-\s]?column|two column/.test(lowerPrompt)) {
      return HERO_SPLIT_VARIANTS;
    }

    if (/grid|masonry|bento/.test(lowerPrompt)) {
      return HERO_GRID_VARIANTS;
    }

    if (/typography|type-heavy|typographic/.test(lowerPrompt)) {
      return HERO_TYPO_VARIANTS;
    }

    return HERO_DEFAULT_VARIANTS;
  }

  if (section === 'categories') {
    return CATEGORY_VARIANTS;
  }

  if (section === 'products') {
    return PRODUCT_VARIANTS;
  }

  if (section === 'footer') {
    return FOOTER_VARIANTS;
  }

  if (section === 'navigation') {
    return NAV_VARIANTS;
  }

  if (section === 'features') {
    return FEATURE_VARIANTS;
  }

  return [];
}

function buildSectionVariantBlock(
  mentionedSections: string[],
  lowerPrompt: string,
  sectionLabels: Record<string, string>,
): string {
  if (mentionedSections.length === 0) {
    return '';
  }

  const lines = mentionedSections
    .map((section) => {
      const options = resolveSectionVariantOptions(section, lowerPrompt);

      if (!options || options.length === 0) {
        return '';
      }

      const pick = pickNonRepeatingVariant(section, options);

      if (!pick) {
        return '';
      }

      const label = sectionLabels[section] ?? section;

      return `- ${label}: ${pick}`;
    })
    .filter(Boolean);

  return lines.length > 0 ? `\nSECTION VARIANTS (must apply, keep user requirements):\n${lines.join('\n')}` : '';
}

function componentText(component: RegistryComponent): string {
  return [component.name, component.description, component.category, component.source, ...(component.tags ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function componentScore(component: RegistryComponent, section: string, theme: string): number {
  const text = componentText(component);
  const keywords = COMPONENT_SECTION_KEYWORDS[section] ?? [];
  let score = 0;

  for (const keyword of keywords) {
    if (text.includes(keyword)) {
      score += 3;
    }
  }

  if (score === 0) {
    return 0;
  }

  if (theme && text.includes(theme.toLowerCase())) {
    score += 2;
  }

  const source = (component.source || '').toLowerCase();

  if (source.includes('magicui')) {
    score += 2;
  }

  if (source.includes('aceternity')) {
    score += 2;
  }

  if (source.includes('reactbits')) {
    score += 1;
  }

  if (source.includes('shadcn')) {
    score += 1;
  }

  if (text.includes('install') || text.includes('cli')) {
    score -= 2;
  }

  return score;
}

function pickComponentForSection(section: string, theme: string): RegistryComponent | null {
  if (SAFE_COMPONENT_REGISTRY.length === 0) {
    return null;
  }

  const scored = SAFE_COMPONENT_REGISTRY.map((component) => ({
    component,
    score: componentScore(component, section, theme),
  })).filter((entry) => entry.score > 0);

  if (scored.length === 0) {
    return null;
  }

  const fresh = scored.filter((entry) => !recentComponentSet.has((entry.component.name || '').toLowerCase()));
  const pool = fresh.length > 0 ? fresh : scored;

  pool.sort((a, b) => b.score - a.score);

  const shortlist = pool.slice(0, 8).map((entry) => entry.component);
  const pick = pickRandomUnique(shortlist, 1)[0] ?? shortlist[0];

  if (!pick) {
    return null;
  }

  rememberRecentComponent(pick.name);

  return pick;
}

function buildComponentDirectives(
  mentionedSections: string[],
  theme: string,
  sectionLabels: Record<string, string>,
): string {
  if (SAFE_COMPONENT_REGISTRY.length === 0) {
    return '';
  }

  const targetSections = mentionedSections.filter((section) => COMPONENT_SECTION_KEYWORDS[section]);

  if (targetSections.length === 0) {
    return '';
  }

  const max = Math.min(3, targetSections.length);
  const chosenSections = pickRandomUnique(targetSections, max);
  const lines: string[] = [];

  for (const section of chosenSections) {
    const component = pickComponentForSection(section, theme);

    if (!component) {
      continue;
    }

    const label = sectionLabels[section] ?? section;
    const desc = (component.description || '').replace(/\s+/g, ' ').trim();
    const brief = desc.length > 100 ? `${desc.slice(0, 97)}...` : desc;
    const source = component.source ? ` (${component.source})` : '';
    const detail = brief ? ` \u2014 ${brief}` : '';
    lines.push(`- ${label}: Use "${component.name}"${source}${detail}.`);
  }

  if (lines.length === 0) {
    return '';
  }

  return [
    '\nCOMPONENT DIRECTIVES (required):',
    '- Implement 2-3 advanced components inspired by the registry below.',
    '- At least one component must add a distinctive background or motion effect (grid, aurora, beams, dots).',
    '- Do NOT import new dependencies; recreate with React + Tailwind + framer-motion.',
    ...lines,
  ].join('\n');
}

function detectTheme(prompt: string): string {
  console.log('[detectTheme] Input prompt:', prompt.substring(0, 300));

  const lowerPrompt = prompt.toLowerCase();
  console.log('[detectTheme] Lower prompt:', lowerPrompt.substring(0, 200));

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    for (const keyword of keywords) {
      if (matchesKeyword(lowerPrompt, keyword)) {
        console.log('[detectTheme] MATCHED theme:', theme, 'keyword:', keyword);
        return theme;
      }
    }
  }

  console.log('[detectTheme] NO THEME MATCHED - returning default');

  return 'default';
}

function extractBrandName(prompt: string): string | null {
  const patterns = [
    /(?:called|named|brand(?: website)?|website called|brand name|project name)\s+["'«»]?([\p{L}\p{N}&\-\s]{2,60})["'«»]?/iu,
    /(?:название|бренд|название бренда|сайт\s*под\s*названием|сайт\s*назван|магазин\s*под\s*названием|проект\s*под\s*названием)\s+["'«»]?([\p{L}\p{N}&\-\s]{2,60})["'«»]?/iu,
  ];

  for (const pattern of patterns) {
    const match = prompt.match(pattern);

    if (match?.[1]) {
      const trimmed = match[1].trim();

      const cleaned = trimmed.split(/[\n,.]/)[0].trim();

      if (cleaned.length >= 2) {
        return cleaned.replace(/\s{2,}/g, ' ');
      }
    }
  }

  return null;
}

function hashString(value: string): number {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);

    hash |= 0;
  }

  return Math.abs(hash);
}

function generateBrandName(theme: string, prompt: string): string {
  const pool = FALLBACK_BRANDS[theme] ?? FALLBACK_BRANDS.default;

  const seed = hashString(`${theme}:${prompt}`);

  return pool[seed % pool.length] ?? FALLBACK_BRANDS.default[0];
}

/**
 *
 * Check if user already specified colors in prompt
 *
 */

function hasUserSpecifiedColors(prompt: string): boolean {
  // Check for hex colors like #111113, #F4F3EF

  const hexPattern = /#[0-9A-Fa-f]{6}/g;

  const matches = prompt.match(hexPattern);

  return matches !== null && matches.length >= 1;
}

/**
 *
 * Extract user-specified colors from prompt
 *
 */

function extractUserColors(prompt: string): Record<string, string> | null {
  const hexPattern = /#[0-9A-Fa-f]{6}/g;

  const matches = prompt.match(hexPattern);

  if (!matches || matches.length < 1) {
    return null;
  }

  // Try to identify colors by context

  const colors: Record<string, string> = {};

  const lowerPrompt = prompt.toLowerCase();

  matches.forEach((color) => {
    const colorIndex = lowerPrompt.indexOf(color.toLowerCase());

    const contextBefore = lowerPrompt.substring(Math.max(0, colorIndex - 50), colorIndex);

    if (contextBefore.includes('dark') || contextBefore.includes('charcoal') || contextBefore.includes('black')) {
      colors.dark = color;
    } else if (
      contextBefore.includes('light') ||
      contextBefore.includes('cream') ||
      contextBefore.includes('ivory') ||
      contextBefore.includes('white')
    ) {
      colors.light = color;
    } else if (contextBefore.includes('accent') || contextBefore.includes('gold') || contextBefore.includes('button')) {
      colors.accent = color;
    }
  });

  // If we couldn't identify by context, assign by order (or assume single HEX is the light background).

  if (matches.length === 1) {
    if (!colors.dark && !colors.light && matches[0]) {
      colors.light = matches[0];
    }
  } else {
    if (!colors.dark && matches[0]) {
      colors.dark = matches[0];
    }

    if (!colors.light && matches[1]) {
      colors.light = matches[1];
    }

    if (!colors.accent && matches[2]) {
      colors.accent = matches[2];
    }
  }

  return Object.keys(colors).length ? colors : null;
}

function matchesWord(haystack: string, needle: string): boolean {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}($|[^\\p{L}\\p{N}])`, 'iu');
  const result = pattern.test(haystack);

  // Debug for hero keyword
  if (needle === 'hero' || needle === 'full-width') {
    console.log('[matchesWord] DEBUG:', {
      haystack: haystack.substring(0, 50),
      needle,
      pattern: pattern.source,
      result,
    });
  }

  return result;
}

function matchesKeyword(haystack: string, needle: string): boolean {
  const hasSpace = needle.includes(' ');
  const result = hasSpace ? haystack.includes(needle) : matchesWord(haystack, needle);

  // Debug for products and categories keywords
  if (needle === 'products' || needle === 'carousel' || needle === 'grid' || needle === 'shop') {
    console.log('[matchesKeyword] DEBUG:', {
      haystack: haystack.substring(0, 80),
      needle,
      hasSpace,
      result,
    });
  }

  return result;
}

/**
 *
 * Extract colors from color words in prompt (e.g., "cream", "black", "gold")
 *
 */

function extractColorsFromWords(prompt: string): Record<string, string> {
  const lowerPrompt = prompt.toLowerCase();

  const foundColors: Record<string, string> = {};

  // Sort color words by length (longer first) to match "light cream" before "cream"

  const sortedColorWords = Object.keys(COLOR_WORDS_TO_HEX).sort((a, b) => b.length - a.length);

  for (const colorWord of sortedColorWords) {
    if (matchesKeyword(lowerPrompt, colorWord)) {
      const colorInfo = COLOR_WORDS_TO_HEX[colorWord];

      // Only set if not already found (longer matches take priority)

      if (colorInfo.type === 'dark' && !foundColors.dark) {
        foundColors.dark = colorInfo.hex;
      } else if (colorInfo.type === 'light' && !foundColors.light) {
        foundColors.light = colorInfo.hex;
      } else if (colorInfo.type === 'accent' && !foundColors.accent) {
        foundColors.accent = colorInfo.hex;
      }
    }
  }

  return foundColors;
}

/**
 *
 * Check if prompt mentions color words
 *
 */

function hasColorWords(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();

  return Object.keys(COLOR_WORDS_TO_HEX).some((colorWord) => matchesKeyword(lowerPrompt, colorWord));
}

function extractRequirementLines(prompt: string): string[] {
  const lines = prompt

    .split(/\r?\n/)

    .map((line) => line.trim())

    .filter(Boolean);

  const requirements: string[] = [];

  for (const line of lines) {
    if (/^[-*]\s+/.test(line)) {
      requirements.push(line.replace(/^[-*]\s+/, ''));

      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      requirements.push(line.replace(/^\d+\.\s+/, ''));

      continue;
    }

    if (line.endsWith(':')) {
      requirements.push(line.replace(/:$/, '').trim());
    }
  }

  return Array.from(new Set(requirements));
}

function extractSectionOrder(prompt: string, sectionKeywords: Record<string, string[]>): string[] {
  const lines = prompt
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const order: string[] = [];
  const pushUnique = (section: string) => {
    if (!order.includes(section)) {
      order.push(section);
    }
  };

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    for (const [section, keywords] of Object.entries(sectionKeywords)) {
      if (keywords.some((keyword) => matchesKeyword(lowerLine, keyword))) {
        pushUnique(section);
      }
    }
  }

  return order;
}

type SectionSpecs = {
  order: string[];
  details: Record<string, string[]>;
};

function inferSectionKey(text: string, sectionKeywords: Record<string, string[]>): string | null {
  const lower = text.toLowerCase();
  console.log('[inferSectionKey] Checking text:', {
    original: text,
    lower,
    keywordSectionsCount: Object.keys(sectionKeywords).length,
  });

  // Check hero specifically for debugging
  const heroKeywords = sectionKeywords.hero;

  if (heroKeywords) {
    console.log('[inferSectionKey] Hero keywords sample:', heroKeywords.slice(0, 5));

    for (const kw of heroKeywords.slice(0, 5)) {
      const matches = matchesKeyword(lower, kw);
      console.log('[inferSectionKey] Testing hero keyword:', { kw, matches });

      if (matches) {
        break;
      }
    }
  }

  for (const [section, keywords] of Object.entries(sectionKeywords)) {
    if (keywords.some((keyword) => matchesKeyword(lower, keyword))) {
      console.log('[inferSectionKey] MATCHED:', { text, section, lower });
      return section;
    }
  }
  console.log('[inferSectionKey] NO MATCH:', { text, lower });

  return null;
}

// NEW: Find ALL sections matching in a text, not just the first one
function inferAllSections(text: string, sectionKeywords: Record<string, string[]>): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];

  for (const [section, keywords] of Object.entries(sectionKeywords)) {
    if (keywords.some((keyword) => matchesKeyword(lower, keyword))) {
      console.log('[inferAllSections] MATCHED:', { section, text: text.substring(0, 50) });
      found.push(section);
    }
  }

  console.log('[inferAllSections] Found sections:', found);

  return found;
}

function extractSectionSpecs(prompt: string, sectionKeywords: Record<string, string[]>): SectionSpecs {
  console.log('[extractSectionSpecs] Parsing prompt:', prompt.substring(0, 200));

  const lines = prompt
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  console.log('[extractSectionSpecs] Found lines:', lines.length, lines);

  const order: string[] = [];
  const details: Record<string, string[]> = {};
  let currentSection: string | null = null;
  let footerLocked = false;
  const explicitSectionCue =
    /\b(section|block|area|раздел|секция|блок)\b/i;

  const pushSection = (section: string) => {
    console.log('[extractSectionSpecs] Pushing section:', section);

    if (!order.includes(section)) {
      order.push(section);
    }

    if (!details[section]) {
      details[section] = [];
    }
  };

  const parseHeading = (rawText: string) => {
    const trimmed = rawText.replace(/:$/, '').trim();
    const parts = trimmed.split(/:\s+/);
    const headingText = parts[0]?.trim() ?? trimmed;
    const detailText = parts.length > 1 ? parts.slice(1).join(': ').trim() : '';
    const key = inferSectionKey(headingText, sectionKeywords);
    console.log('[extractSectionSpecs] parseHeading:', { rawText, headingText, key });

    return key ? { key, detail: detailText } : null;
  };

  for (const line of lines) {
    const bulletMatch = line.match(/^[-*]\s+(.*)$/) || line.match(/^\d+\.\s+(.*)$/);
    const rawLine = bulletMatch ? bulletMatch[1].trim() : line;

    const hasColon = rawLine.includes(':');
    const headingCandidate = (!bulletMatch && (rawLine.endsWith(':') || hasColon)) || (bulletMatch && hasColon);

    console.log('[extractSectionSpecs] LINE:', {
      line: line.substring(0, 60),
      bulletMatch: !!bulletMatch,
      rawLine: rawLine.substring(0, 60),
      hasColon,
      headingCandidate,
    });

    if (headingCandidate) {
      const parsed = parseHeading(rawLine);
      console.log('[extractSectionSpecs] parseHeading result:', parsed);

      if (parsed) {
        if (footerLocked && parsed.key !== 'footer' && !explicitSectionCue.test(rawLine)) {
          pushSection('footer');

          if (parsed.detail) {
            details.footer.push(parsed.detail);
          } else {
            details.footer.push(rawLine);
          }

          continue;
        }

        if (footerLocked && parsed.key !== 'footer' && explicitSectionCue.test(rawLine)) {
          footerLocked = false;
        }

        currentSection = parsed.key;
        pushSection(parsed.key);

        if (parsed.key === 'footer') {
          footerLocked = true;
        }

        if (parsed.detail) {
          details[parsed.key].push(parsed.detail);
        }

        continue;
      }
    }

    if (footerLocked) {
      pushSection('footer');
      details.footer.push(rawLine);
      continue;
    }

    // If not a heading, try to infer ALL sections from the whole line
    console.log('[extractSectionSpecs] Trying inferAllSections for:', rawLine.substring(0, 60));

    const inferredSections = inferAllSections(rawLine, sectionKeywords);
    console.log('[extractSectionSpecs] inferAllSections result:', inferredSections);

    if (inferredSections.length > 0) {
      // Push ALL found sections
      for (const inferredSection of inferredSections) {
        pushSection(inferredSection);
      }
      currentSection = inferredSections[inferredSections.length - 1];

      if (bulletMatch) {
        details[inferredSections[0]].push(rawLine);
      } else if (rawLine !== rawLine.replace(/:$/, '').trim()) {
        const detailText = rawLine.replace(/^[^:]+:\s*/, '').trim();

        if (detailText) {
          details[inferredSections[0]].push(detailText);
        }
      }

      continue;
    }

    if (bulletMatch && currentSection) {
      details[currentSection].push(rawLine);
    }
  }

  return { order, details };
}

function wantsImages(prompt: string, mentionedSections: string[]): boolean {
  const lowerPrompt = prompt.toLowerCase();

  const imageKeywords = [
    'image',
    'photo',
    'photography',
    'gallery',
    'picture',
    'background image',
    'hero image',
    'cover',
    'banner',
    'lifestyle',
    'product photo',
    'album cover',
    'cover art',
    'photo shoot',
    'изображение',
    'картинка',
    'фото',
    'фотография',
    'галерея',
    'фон',
    'обложка',
    'баннер',
    'лайфстайл',
    'товарное фото',
    'обложка альбома',
    'съёмка',
    'съемка',
    'фотосессия',
  ];

  if (
    mentionedSections.some((section) => ['hero', 'gallery', 'products', 'categories', 'editorial'].includes(section))
  ) {
    return true;
  }

  return imageKeywords.some((keyword) => matchesKeyword(lowerPrompt, keyword));
}

function buildImageSuggestions(mentionedSections: string[], images: ImageSet): string {
  console.log('[buildImageSuggestions] Called with:', {
    mentionedSections,
    hasHero: !!images.hero?.length,
    hasProducts: !!images.products?.length,
    hasCategories: !!images.categories,
    heroUrls: images.hero?.slice(0, 2),
  });

  const lines: string[] = [];

  const include = (section: string) => mentionedSections.includes(section);

  const pushLine = (label: string, urls?: string[]) => {
    if (!urls || urls.length === 0) {
      return;
    }

    const proxied = urls.filter(Boolean).map((url) => proxyImageUrl(url));

    if (proxied.length === 0) {
      return;
    }

    console.log(`[buildImageSuggestions] Adding ${label}:`, proxied.length, 'images');
    lines.push(`${label}: ${proxied.join(' | ')}`);
  };

  if (include('hero')) {
    pushLine('HERO', limitList(images.hero, MAX_IMAGE_COUNTS.hero));
  }

  if (include('gallery')) {
    pushLine('GALLERY', limitList(images.gallery, MAX_IMAGE_COUNTS.gallery));
  }

  if (include('products')) {
    pushLine('PRODUCTS', limitList(images.products ?? [], MAX_IMAGE_COUNTS.product));
  }

  if (include('categories') && images.categories) {
    pushLine('CATEGORIES (Seating)', limitList(images.categories.seating, MAX_IMAGE_COUNTS.category));
    pushLine('CATEGORIES (Tables)', limitList(images.categories.tables, MAX_IMAGE_COUNTS.category));
    pushLine('CATEGORIES (Storage)', limitList(images.categories.storage, MAX_IMAGE_COUNTS.category));
  }

  if (include('editorial')) {
    pushLine('EDITORIAL', limitList(images.editorial ?? [], MAX_IMAGE_COUNTS.editorial));
  }

  if (lines.length === 0) {
    pushLine('HERO', limitList(images.hero, MAX_IMAGE_COUNTS.hero));
    pushLine('GALLERY', limitList(images.gallery, MAX_IMAGE_COUNTS.gallery));
    pushLine('PRODUCTS', limitList(images.products ?? [], MAX_IMAGE_COUNTS.product));

    if (images.categories) {
      pushLine('CATEGORIES (Seating)', limitList(images.categories.seating, MAX_IMAGE_COUNTS.category));
      pushLine('CATEGORIES (Tables)', limitList(images.categories.tables, MAX_IMAGE_COUNTS.category));
      pushLine('CATEGORIES (Storage)', limitList(images.categories.storage, MAX_IMAGE_COUNTS.category));
    }

    pushLine('EDITORIAL', limitList(images.editorial ?? [], MAX_IMAGE_COUNTS.editorial));
  }

  const countHints: string[] = [];

  if (include('hero')) {
    countHints.push(`HERO>=${SECTION_IMAGE_MIN_COUNTS.hero ?? 1}`);
  }

  if (include('gallery')) {
    countHints.push(`GALLERY>=${SECTION_IMAGE_MIN_COUNTS.gallery ?? 1}`);
  }

  if (include('products')) {
    countHints.push(`PRODUCTS>=${SECTION_IMAGE_MIN_COUNTS.products ?? 1}`);
  }

  if (include('editorial')) {
    countHints.push(`EDITORIAL>=${SECTION_IMAGE_MIN_COUNTS.editorial ?? 1}`);
  }

  if (lines.length === 0) {
    return '';
  }

  return [
    'IMAGES:',
    '(Use these exact proxied URLs. Do NOT invent URLs.)',
    ...lines,
    ...(countHints.length > 0 ? [`IMAGE COUNTS (minimum): ${countHints.join(', ')}`] : []),
    'IMAGES REQUIRED: If a section mentions images, it MUST include at least one <img> using the URLs above.',
    'Do NOT replace image sections with gradients/placeholders when IMAGES block exists.',
    'Do NOT use data:image placeholders or icon-only cards for image slots.',
    'Add loading="lazy" to all <img> tags.',
  ].join('\n');
}

function buildColorDirectiveBlock(colors: { dark: string; light: string; accent: string }): string {
  if (!colors || (!colors.dark && !colors.light && !colors.accent)) {
    return '';
  }

  return [
    '\nCOLOR PALETTE (must use exact hex values):',
    `- Dark: ${colors.dark}`,
    `- Light: ${colors.light}`,
    `- Accent: ${colors.accent}`,
    'COLOR USAGE (strict):',
    'Use Tailwind arbitrary values, e.g. bg-[#1A1A1A], text-[#F5F5DC], border-[#D4AF37].',
    `- Backgrounds use ${colors.dark}.`,
    `- Primary text uses ${colors.light}.`,
    `- Accents/underlines/badges/prices/buttons use ${colors.accent}.`,
    '- Do not introduce new dominant colors.',
  ].join('\n');
}

function buildSectionDetailsBlock(details: Record<string, string[]>, sectionLabels: Record<string, string>): string {
  const entries = Object.entries(details).filter(([, items]) => items.length > 0);

  if (entries.length === 0) {
    return '';
  }

  const lines = entries.map(([section, items]) => {
    const label = sectionLabels[section] ?? section;
    const uniqueItems = Array.from(new Set(items)).slice(0, 8);

    return `- ${label}: ${uniqueItems.join('; ')}`;
  });

  return `\nSECTION DETAILS (follow exactly):\n${lines.join('\n')}`;
}

function buildArtDirectionLine(theme: string): string {
  const directions = THEME_ART_DIRECTIONS[theme] ?? THEME_ART_DIRECTIONS.default;
  const pick = pickRandomUnique(directions, 1)[0];

  return pick ? `\nART DIRECTION: ${pick}` : '';
}

function buildLayoutArchetypeLine(theme: string): string {
  const archetypes = THEME_LAYOUT_ARCHETYPES[theme] ?? THEME_LAYOUT_ARCHETYPES.default;
  const pick = pickRandomUnique(archetypes, 1)[0];

  return pick ? `\nLAYOUT ARCHETYPE: ${pick}` : '';
}

function buildSignatureMovesBlock(theme: string): string {
  const themeMoves = THEME_SIGNATURE_MOVES[theme] ?? THEME_SIGNATURE_MOVES.default;
  const picks = pickRandomUnique([...themeMoves, ...GLOBAL_SIGNATURE_MOVES], 3);

  return picks.length > 0 ? `\nSIGNATURE MOVES (must apply):\n- ${picks.join('\n- ')}` : '';
}

function buildSectionGuardrails(order: string[], details: Record<string, string[]>): string {
  if (order.length === 0) {
    return '';
  }

  const lines: string[] = [];

  if (order.includes('navigation')) {
    lines.push('- Navigation: Menu links use text-sm or text-base (14-16px). Avoid oversized headline typography.');
  }

  if (order.includes('hero')) {
    lines.push('- Hero: Include a real <img> from the IMAGES block (no gradient-only hero).');
  }

  if (order.includes('products')) {
    lines.push('- Products: Render at least 4 product cards using distinct images.');
    lines.push(
      '- Products: Each card must include a real <img> using URLs from the IMAGES block (no icons/placeholders).',
    );

    const items = Array.from(new Set(details.products ?? [])).filter(Boolean);

    if (items.length > 0) {
      lines.push(`- Products: Each product card must include ALL of: ${items.join('; ')}`);
    } else {
      lines.push('- Products: Each card includes image, title, secondary text, price, and a clear CTA button.');
    }
  }

  if (order.includes('footer')) {
    const footerDetails = details.footer ?? [];
    const footerText = footerDetails.join(' ').toLowerCase();
    const wantsNewsletter = /newsletter|subscribe|collector|email|join the/.test(footerText);
    const wantsColumns = /columns?|shop|about|support|connect/.test(footerText);
    const wantsBottomBar = /bottom bar|copyright|payment|visa|mastercard|paypal|badge/.test(footerText);
    const wantsUnderline = /underline|hover gold|gold underline/.test(footerText);
    const wantsSocial = /social|instagram|youtube|discord|icons?/.test(footerText);

    if (wantsNewsletter) {
      lines.push(
        '- Footer: Include a top newsletter row with headline, email input, submit button, and vinyl graphic.',
      );
    }

    if (wantsColumns) {
      lines.push('- Footer: Include a middle 4-column links grid (Shop/About/Support/Connect).');
    }

    if (wantsBottomBar) {
      lines.push(
        '- Footer: Include a bottom bar with copyright, payment method badges (text or lucide icons), and a badge.',
      );
    }

    if (wantsUnderline) {
      lines.push('- Footer: Links show gold underline on hover.');
    }

    if (wantsSocial) {
      lines.push('- Footer: Social icons are cream, turn gold on hover with subtle rotation.');
    }
  }

  return lines.length > 0 ? `\nSECTION GUARDRAILS (must follow):\n${lines.join('\n')}` : '';
}

function buildSectionBlueprint(
  order: string[],
  details: Record<string, string[]>,
  sectionLabels: Record<string, string>,
): string {
  if (order.length === 0) {
    return '';
  }

  const lines = order.map((section, index) => {
    const label = sectionLabels[section] ?? section;
    const uniqueItems = Array.from(new Set(details[section] ?? [])).slice(0, 3);
    const detailText = uniqueItems.length > 0 ? ` - ${uniqueItems.join('; ')}` : '';

    return `${index + 1}. ${label}${detailText}`;
  });

  return `\nSECTION BLUEPRINT (follow exactly):\n${lines.join('\n')}`;
}

export interface EnhancedPrompt {
  originalPrompt: string;

  enhancedPrompt: string;

  displayPrompt?: string;

  imagePrompt?: string;

  detectedTheme: string;

  colors: typeof THEME_PALETTES.default;

  images: ImageSet;

  sectionContract?: SectionContract;
}

const LAYOUT_MARKER = 'CREATIVE DIRECTION (Unique Layout Strategy):';

function buildStyleCueRegex(): RegExp {
  const escaped = STYLE_CUE_TOKENS.map((token) => token.trim())
    .filter(Boolean)
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = `(${escaped.join('|')})`;

  try {
    return new RegExp(pattern, 'i');
  } catch (error) {
    console.warn('[promptEnhancer] Failed to build style cue regex', error);
    return /style:/i;
  }
}

function splitPromptForEnhancer(prompt: string) {
  let basePrompt = prompt;
  let layoutBlock = '';

  const markerIndex = prompt.indexOf(LAYOUT_MARKER);

  if (markerIndex >= 0) {
    basePrompt = prompt.slice(0, markerIndex);
    layoutBlock = prompt.slice(markerIndex);
  }

  basePrompt = basePrompt
    .replace(/\n?Sections:\s*[^\n]+/gi, '')
    .replace(/\n?\[Style:[^\]]+\]\s*/gi, '')
    .trim();

  const styleCueRe = buildStyleCueRegex();
  const hasStyleCue = styleCueRe.test(basePrompt);

  if (hasStyleCue && layoutBlock) {
    layoutBlock = layoutBlock.replace(/1\. AESTHETIC STYLE:[\s\S]*?2\. STRUCTURE:/, '2. STRUCTURE:');
  }

  return {
    basePrompt: basePrompt || prompt.trim(),
    layoutBlock: layoutBlock.trim(),
  };
}

/**
 *
 * Main function to enhance user prompt with design system
 *
 */

export async function enhancePromptWithDesignSystem(userPrompt: string): Promise<EnhancedPrompt> {
  const { basePrompt, layoutBlock } = splitPromptForEnhancer(userPrompt);
  const analysisPrompt = basePrompt;
  const promptWithLayout = layoutBlock ? `${analysisPrompt}\n\n${layoutBlock}` : analysisPrompt;

  const detectedTheme = detectTheme(analysisPrompt);
  const variationSeed = randomSeedString(6);

  const palette = THEME_PALETTES[detectedTheme as keyof typeof THEME_PALETTES] || THEME_PALETTES.default;

  const fallbackImages = buildImageSet(detectedTheme);
  let images = fallbackImages;

  // Try to fetch real images from Unsplash/Pexels API
  const themeQueries = THEME_IMAGE_QUERIES[detectedTheme] || THEME_IMAGE_QUERIES.default;

  if (themeQueries) {
    try {
      const apiImages = await fetchImageSetFromApi(
        detectedTheme,
        {
          hero: themeQueries.hero,
          gallery: themeQueries.gallery,
          products: themeQueries.products,
          editorial: themeQueries.editorial,
          categories: themeQueries.categories,
        },
        {
          hero: 2,
          gallery: 4,
          products: 6,
          editorial: 2,
          categories: { seating: 2, tables: 2, storage: 2 },
        },
      );

      if (apiImages) {
        console.log('[promptEnhancer] Got images from API:', {
          heroCount: apiImages.hero?.length,
          galleryCount: apiImages.gallery?.length,
          productsCount: apiImages.products?.length,
        });
        images = mergeImageSets(apiImages, fallbackImages);
      }
    } catch (error) {
      console.warn('[promptEnhancer] Failed to fetch images from API, using fallback:', error);
    }
  }

  console.log('[promptEnhancer] Final images result:', {
    theme: detectedTheme,
    heroCount: images.hero?.length,
    galleryCount: images.gallery?.length,
    productsCount: images.products?.length,
  });

  const brandName = extractBrandName(analysisPrompt) ?? generateBrandName(detectedTheme, analysisPrompt);

  // Check if user already specified colors (priority: HEX codes > color words > theme defaults)

  let finalColors = { ...palette };

  // First, try to extract HEX codes from prompt

  if (hasUserSpecifiedColors(analysisPrompt)) {
    const userColors = extractUserColors(analysisPrompt);

    if (userColors) {
      finalColors = {
        ...finalColors,

        ...userColors,
      };
    }
  }

  // Then, extract colors from color words (e.g., "cream", "black", "gold")

  if (hasColorWords(analysisPrompt)) {
    const wordColors = extractColorsFromWords(analysisPrompt);

    // Only override dark/light if not already set by HEX codes

    if (wordColors.dark && !hasUserSpecifiedColors(analysisPrompt)) {
      finalColors.dark = wordColors.dark;
    }

    if (wordColors.light && !hasUserSpecifiedColors(analysisPrompt)) {
      finalColors.light = wordColors.light;
    }

    // For accent, only override if user explicitly mentioned an accent color word

    // (gold, amber, blue, etc.) - don't override theme accent with random color matches

    const accentKeywords = Object.keys(COLOR_WORDS_TO_HEX).filter((word) => COLOR_WORDS_TO_HEX[word].type === 'accent');

    const accentMetaKeywords = [
      'accent',
      'primary',
      'highlight',
      'primary color',
      'main color',
      'accent color',
      'акцент',
      'акцентный цвет',
      'основной цвет',
      'главный цвет',
    ];

    const lowerPrompt = analysisPrompt.toLowerCase();

    const hasExplicitAccent = [...accentKeywords, ...accentMetaKeywords].some((keyword) =>
      matchesKeyword(lowerPrompt, keyword),
    );

    if (wordColors.accent && hasExplicitAccent && !hasUserSpecifiedColors(analysisPrompt)) {
      finalColors.accent = wordColors.accent;
    }
  }

  // Check if user specified specific layouts

  const lowerPrompt = analysisPrompt.toLowerCase();

  const layoutKeywords = [
    'split',
    'left',
    'right',
    'two column',
    'two-column',
    'two columns',
    '2 column',
    '2-column',
    'image on left',
    'image on right',
    'text on left',
    'text on right',
    'grid',
    'masonry',
    'carousel',
    'slider',
    'horizontal scroll',
    'full-width',
    'full width',
    'full screen',
    'fullscreen',
    'слева',
    'справа',
    'две колонки',
    '2 колонки',
    'двухколоночный',
    'сетка',
    'мозаика',
    'мейсонри',
    'карусель',
    'слайдер',
    'горизонтальный скролл',
    'на всю ширину',
    'на весь экран',
    'полноэкранный',
  ];

  const hasSpecificLayout = layoutKeywords.some((keyword) => matchesKeyword(lowerPrompt, keyword));

  // Helper to pick random item

  const pickRandom = <T>(arr: T[]): T => pickRandomFromData(arr);

  // Detect which sections user mentioned in prompt

  const sectionKeywords = SECTION_KEYWORDS;

  // Find which sections are mentioned
  const sectionSpecs = extractSectionSpecs(analysisPrompt, sectionKeywords);
  console.log('[promptEnhancer] sectionSpecs result:', JSON.stringify(sectionSpecs, null, 2));

  const orderedSections =
    sectionSpecs.order.length > 0 ? sectionSpecs.order : extractSectionOrder(analysisPrompt, sectionKeywords);
  console.log('[promptEnhancer] orderedSections:', orderedSections);

  const mentionedSections: string[] = orderedSections.length > 0 ? [...orderedSections] : [];

  if (mentionedSections.length === 0) {
    // Fallback scan when section extraction found nothing.
    for (const [section, keywords] of Object.entries(sectionKeywords)) {
      if (!mentionedSections.includes(section)) {
        if (keywords.some((kw) => matchesKeyword(lowerPrompt, kw))) {
          console.log('[promptEnhancer] Fallback found section:', section);
          mentionedSections.push(section);
        }
      }
    }
  }

  const navigationSignals = [
    'menu',
    'navigation',
    'navbar',
    'top bar',
    'header',
    'search icon',
    'wishlist',
    'cart',
    'profile',
  ];
  const wantsNavigation = navigationSignals.some((signal) => matchesKeyword(lowerPrompt, signal));

  if (wantsNavigation && !mentionedSections.includes('navigation')) {
    mentionedSections.unshift('navigation');
  }

  console.log('[promptEnhancer] Detected theme:', detectedTheme);
  console.log('[promptEnhancer] Mentioned sections:', mentionedSections);
  console.log('[promptEnhancer] Wants images:', wantsImages(analysisPrompt, mentionedSections));

  if (wantsImages(analysisPrompt, mentionedSections)) {
    const queries = buildImageSearchQueries(detectedTheme, mentionedSections);
    const counts = buildImageSearchCounts(mentionedSections);
    console.log('[promptEnhancer] Image queries:', JSON.stringify(queries));
    console.log('[promptEnhancer] Image counts:', JSON.stringify(counts));

    const apiImages = await fetchImageSetFromApi(detectedTheme, queries, counts);
    console.log('[promptEnhancer] API returned images:', apiImages ? 'yes' : 'no');

    if (apiImages) {
      images = mergeImageSets(apiImages, fallbackImages);
      console.log('[promptEnhancer] Using API images, hero count:', images.hero?.length);
    }
  }

  images = normalizeImageSet(images);
  images = filterRecentImages(images);
  recordRecentImages(images);
  images = proxyImageSet(images);
  images = applyImageSeed(images, variationSeed);

  // Section layout variants

  const sectionLayouts: Record<string, string[]> = {
    navigation: ['Minimal top nav: logo left, links center, icons right', 'Centered nav with logo above links'],

    hero: [
      'Full-width hero with centered text and background image',

      'Split hero: text left (40%), large image right (60%)',

      'Split hero: image left (60%), text right (40%)',

      'Full-screen hero with minimal headline',

      'Hero with floating card on the right',

      'Asymmetric diagonal split hero',
    ],

    features: [
      '3-column icon cards',

      '4-column compact feature grid',

      'Alternating image/text rows',

      'Bento-style grid',

      'Single column with large icons',
    ],

    gallery: [
      'gallery',
      'portfolio',
      'photos',
      'images',
      'work',
      'showcase',
      'media',
      'unboxing',
      'meal kit',
      'meal kit unboxing',
      'recipe box',
      'unbox',
      'галерея',
      'портфолио',
      'фото',
      'фотографии',
      'изображения',
      'распаковка',
      'витрина',
    ],

    testimonials: [
      'Carousel of testimonial cards',

      '3-column testimonial cards',

      'Featured quote with side cards',

      'Alternating quote/author layout',

      'Stacked cards with ratings',
    ],

    pricing: [
      '3-column pricing cards',

      '2-column comparison table',

      'Toggle monthly/annual with cards',

      'Expandable pricing tiers',
    ],

    cta: [
      'Centered card with glow effect',

      'Split: text left, form right',

      'Full-width banner with button',

      'Minimal text with button',

      'Two-column CTA with image',
    ],

    faq: ['Accordion list', '2-column FAQ grid', 'Card-based FAQ', 'Tabbed FAQ sections'],

    footer: [
      '4-column footer with links',

      'Minimal centered footer',

      '3-column footer with newsletter',

      'Dark gradient footer',
    ],

    about: [
      'Split: text left, image right',

      'Story with stats row',

      'Timeline-style story',

      'Centered story with highlights',
    ],

    team: [
      '3-column team cards',

      'Horizontal scroll team slider',

      'Split: portrait + bio',

      'Stacked list with avatars',
    ],

    contact: [
      'Form left, contact info right',

      'Centered form with map below',

      'Split: map left, form right',

      'Minimal contact cards',
    ],

    blog: ['Featured post + 3 cards', '3-column blog grid', 'Masonry cards', 'List with thumbnails'],

    logo: ['Logo bar row', 'Marquee logo strip', 'Grid of partner logos'],

    products: [
      'Angled album sleeves in a staggered grid with hover actions',

      'Product cards with tilted cover + price row + condition badge',

      'Crate-style product grid with overlapping covers',

      'Grid with filters sidebar and spotlight card',
    ],

    categories: [
      'Horizontal genre tag belt with scroll',

      'Rounded pill carousel with gold outlines',

      'Compact tag grid with hover glow',
    ],

    editorial: [
      'Full-width image with text overlay',

      'Split: image left, story text right',

      'Story card with quote and author',
    ],

    newsletter: ['Centered form with input + button', 'Split: text left, form right', 'Compact bar with inline input'],
  };

  const sectionLabels: Record<string, string> = {
    navigation: 'Navigation',

    hero: 'Hero',

    features: 'Features',

    gallery: 'Gallery',

    testimonials: 'Testimonials',

    pricing: 'Pricing',

    cta: 'CTA',

    faq: 'FAQ',

    footer: 'Footer',

    about: 'About',

    team: 'Team',

    contact: 'Contact',

    blog: 'Blog',

    logo: 'Logo',

    products: 'Products',

    categories: 'Categories',

    editorial: 'Editorial',

    newsletter: 'Newsletter',
  };

  // Generate layouts only for mentioned sections

  let layoutSuggestions = '';

  if (!hasSpecificLayout && mentionedSections.length > 0) {
    const layouts = mentionedSections

      .filter((section) => sectionLayouts[section])

      .map(
        (section) => `- ${section.charAt(0).toUpperCase() + section.slice(1)}: ${pickRandom(sectionLayouts[section])}`,
      )

      .join('\n');

    if (layouts) {
      layoutSuggestions = `\nSECTION LAYOUTS (use these styles):\n${layouts}`;
    }
  }

  const sectionChecklist =
    mentionedSections.length > 0
      ? `\nSECTIONS (must include all): ${mentionedSections
          .map((section) => sectionLabels[section] ?? section)
          .join(', ')}`
      : '';

  const sectionContract =
    mentionedSections.length > 0
      ? `\nSECTION CONTRACT:\n- Render exactly ${mentionedSections.length} sections.\n- Add a comment {/** SECTION: <label> */} before each section.\n- If output length is a concern, shorten sections but DO NOT omit any.`
      : '';

  const sectionOrderLine =
    mentionedSections.length > 0
      ? `\nSECTION ORDER (render in this order): ${mentionedSections
          .map((section) => sectionLabels[section] ?? section)
          .join(' -> ')}`
      : '';

  const sectionCountLine = mentionedSections.length > 0 ? `\nSECTION COUNT: ${mentionedSections.length}` : '';

  const sectionDetailsBlock = buildSectionDetailsBlock(sectionSpecs.details, sectionLabels);
  const sectionGuardrails = buildSectionGuardrails(mentionedSections, sectionSpecs.details);
  const artDirectionLine = buildArtDirectionLine(detectedTheme);
  const layoutArchetypeLine = buildLayoutArchetypeLine(detectedTheme);
  const signatureMovesBlock = buildSignatureMovesBlock(detectedTheme);
  const sectionBlueprint = buildSectionBlueprint(mentionedSections, sectionSpecs.details, sectionLabels);
  let effectDirectiveBlock = '';

  try {
    effectDirectiveBlock = buildEffectDirectiveBlock(detectedTheme);
  } catch (error) {
    console.warn('[promptEnhancer] Failed to build effect directive block', error);
  }

  const requirements = extractRequirementLines(analysisPrompt).slice(0, 20);
  const requirementsBlock =
    requirements.length > 0 ? `\nREQUIREMENTS (must implement):\n- ${requirements.join('\n- ')}` : '';

  console.log('[promptEnhancer] Before buildImageSuggestions:', {
    mentionedSections,
    wantsImagesResult: wantsImages(analysisPrompt, mentionedSections),
    imagesHero: images.hero?.slice(0, 1),
    imagesProducts: images.products?.slice(0, 1),
    imagesGallery: images.gallery?.slice(0, 1),
  });

  const imageSuggestions = wantsImages(analysisPrompt, mentionedSections)
    ? buildImageSuggestions(mentionedSections, images)
    : '';
  console.log('[promptEnhancer] imageSuggestions result:', imageSuggestions?.substring(0, 200));

  const imagePrompt = imageSuggestions ? `\n${imageSuggestions}` : '';
  const colorDirectiveBlock = buildColorDirectiveBlock(finalColors);

  const sectionVariantBlock = buildSectionVariantBlock(mentionedSections, lowerPrompt, sectionLabels);
  const componentDirectivesBlock = buildComponentDirectives(mentionedSections, detectedTheme, sectionLabels);
  const brandLine = `\nBRAND NAME (use exactly): ${brandName}`;
  const templateGuard =
    '\nIMPORTANT: Do not use any generic/default template. Do not use BoltApp/ModernApp/ProjectName. Invent a brand name if none was given. Follow the prompt exactly.';
  const variationLine = `\nVARIATION SEED: ${variationSeed} (must vary layout, imagery, and composition from prior runs).`;

  const enhancedPrompt = `${promptWithLayout}
${brandLine}${colorDirectiveBlock}${imagePrompt}${sectionBlueprint}${sectionChecklist}${sectionContract}${sectionOrderLine}${sectionCountLine}${sectionDetailsBlock}${sectionGuardrails}${artDirectionLine}${layoutArchetypeLine}${signatureMovesBlock}${sectionVariantBlock}${requirementsBlock}${
    layoutSuggestions
      ? `
${layoutSuggestions}`
      : ''
  }${effectDirectiveBlock}${componentDirectivesBlock}${templateGuard}${variationLine}
[Style: ${detectedTheme} | Colors: ${finalColors.dark}, ${finalColors.light}, ${finalColors.accent}]`;

  console.log('[promptEnhancer] BEFORE shortSectionsLine, mentionedSections:', JSON.stringify(mentionedSections));
  console.log('[promptEnhancer] sectionSpecs.order was:', JSON.stringify(sectionSpecs.order));
  console.log('[promptEnhancer] orderedSections was:', JSON.stringify(orderedSections));

  const shortSectionsLine =
    mentionedSections.length > 0
      ? `\nSections: ${mentionedSections.map((section) => sectionLabels[section] ?? section).join(', ')}`
      : '';
  console.log('[promptEnhancer] shortSectionsLine result:', shortSectionsLine);

  const displayPrompt = analysisPrompt;

  console.log('[promptEnhancer] FINAL RESULT:', {
    hasImagePrompt: !!imagePrompt,
    imagePromptLength: imagePrompt?.length,
    imagePromptPreview: imagePrompt?.substring(0, 200),
    mentionedSections,
  });

  const imageSectionKeys = wantsImages(analysisPrompt, mentionedSections)
    ? mentionedSections.filter((section) => ['hero', 'gallery', 'products', 'editorial'].includes(section))
    : [];

  const imageMap: Record<string, string[]> = {};

  if (images.hero?.length && imageSectionKeys.includes('hero')) {
    imageMap.hero = limitList(images.hero, MAX_IMAGE_COUNTS.hero);
  }

  if (images.gallery?.length && imageSectionKeys.includes('gallery')) {
    imageMap.gallery = limitList(images.gallery, MAX_IMAGE_COUNTS.gallery);
  }

  if (images.products?.length && imageSectionKeys.includes('products')) {
    imageMap.products = limitList(images.products, MAX_IMAGE_COUNTS.product);
  }

  if (images.editorial?.length && imageSectionKeys.includes('editorial')) {
    imageMap.editorial = limitList(images.editorial, MAX_IMAGE_COUNTS.editorial);
  }

  const imageMinCounts: Record<string, number> = {};

  for (const section of imageSectionKeys) {
    const desired = SECTION_IMAGE_MIN_COUNTS[section] ?? 1;
    const available = imageMap[section]?.length ?? 0;

    if (available > 0) {
      imageMinCounts[section] = Math.min(desired, available);
    }
  }

  const sectionContractData: SectionContract | undefined =
    mentionedSections.length > 0
      ? {
          order: mentionedSections,
          labels: sectionLabels,
          imageSections: imageSectionKeys,
          imageMap,
          imageMinCounts,
        }
      : undefined;

  return {
    originalPrompt: analysisPrompt,

    enhancedPrompt,

    displayPrompt,

    imagePrompt,
    detectedTheme,

    colors: finalColors,

    images,

    sectionContract: sectionContractData,
  };
}

/**
 *
 * Check if prompt is a design/website request that needs enhancement
 *
 */

export function shouldEnhancePrompt(prompt: string): boolean {
  const designKeywords = [
    'website',
    'site',
    'landing',
    'landing page',
    'page',
    'layout',
    'design',
    'ui',
    'interface',
    'hero',
    'section',
    'create',
    'build',
    'make',
    'generate',
    'mockup',
    'prototype',
    'web page',
    'homepage',
    'app',
    'screen',
    'wireframe',
    'сайт',
    'лендинг',
    'главная',
    'страница',
    'дизайн',
    'интерфейс',
    'шапка',
    'секция',
    'экран',
    'макет',
    'прототип',
    'создай',
    'сделай',
    'сверстай',
  ];

  const lowerPrompt = prompt.toLowerCase();

  if (designKeywords.some((keyword) => matchesKeyword(lowerPrompt, keyword))) {
    return true;
  }

  return extractRequirementLines(prompt).length > 0;
}
