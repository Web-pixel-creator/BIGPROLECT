import { createScopedLogger } from '../../utils/logger';
import * as fs from 'fs';
import * as path from 'path';
import { BOLT_ROOT, buildIndex, type ComponentMeta } from './component-index.server';
import { matchesKeyword } from './prompt-color-utils';
import { COMPONENT_KEYWORDS } from './prompt-data';
import { detectTheme } from './prompt-theme-utils';

const logger = createScopedLogger('component-matcher');
const MAX_CODE_LENGTH = 3200;

function hashString(str: string): number {
  let h = 0;

  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }

  return h >>> 0;
}

function makeRng(seed: number) {
  let s = seed || 1;

  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function shuffleArraySeeded<T>(arr: T[], rng: () => number): T[] {
  const copy = [...arr];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function randomChoiceSeeded<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function choosePalette(requestLower: string, theme: string | null): string[] {
  const lightPalettes = [
    'Light: white/gray with accent #6B4DFF',
    'Light: beige/stone with accent #FF7F50',
    'Light: off-white with slate text and accent #2563EB',
  ];
  const darkPalettes = [
    'Dark: near-black with neon accent #7C3AED',
    'Dark: charcoal with accent #00E0FF',
    'Dark: graphite with warm accent #F97316',
  ];

  const isLight =
    requestLower.includes('light') ||
    requestLower.includes('white') ||
    requestLower.includes('bright') ||
    theme === 'construction';
  const isDark = requestLower.includes('dark') || requestLower.includes('black');

  if (isLight) {
    return lightPalettes;
  }

  if (isDark) {
    return darkPalettes;
  }

  // If no strong hint, mix both sets
  return [...lightPalettes, ...darkPalettes];
}

function chooseLayout(): string[] {
  return [
    'Grid 3x2 for services/cards',
    'Bento asymmetric layout',
    'Wide hero + two-column content',
    'Masonry-like staggered cards',
    'Split hero (media left, text right) + 3-column services',
  ];
}

const THEME_PRESETS: Record<string, string[]> = {
  construction: ['hero', 'features', 'cta', 'projects', 'footer'],
  auto: ['hero', 'features', 'cta', 'projects', 'footer'],
  tech: ['hero', 'features', 'stats', 'cta', 'footer'],
  finance: ['hero', 'features', 'pricing', 'cta', 'footer'],
  education: ['hero', 'features', 'faq', 'cta', 'footer'],
  photo: ['hero', 'gallery', 'cta', 'footer'],
};

function buildPresetHint(theme: string | null): string {
  if (!theme) {
    return '';
  }

  const preset = THEME_PRESETS[theme];

  if (!preset) {
    return '';
  }

  return `Preset suggestion for ${theme}: ${preset.join(' ? ')}`;
}

export interface ComponentMatch {
  name: string;
  category: string;
  description: string;
  code: string;
  relevance: number;
  source?: string;
  tags?: string[];
}

type ComponentIndexCache = {
  components: ComponentMeta[];
  generatedAt: number | null;
  byCategory: Map<string, ComponentMatch[]>;
};

// Default keywords for component matching (imported from prompt-data)
const DEFAULT_COMPONENT_KEYWORDS = COMPONENT_KEYWORDS;

// Effects map for optional component hints
const EFFECT_KEYWORDS_MAP: Record<string, string[]> = {
  'blob cursor': ['cursor', 'blob'],
  'stagger fade-in on scroll': ['animation', 'scroll', 'reveal'],
  'gradient border glow': ['gradient', 'border', 'glow'],
  'aurora background + parallax': ['aurora', 'parallax', 'background'],
  'plasma / mesh background': ['plasma', 'mesh', 'background'],
  'glassmorphism cards': ['glassmorphism', 'card', 'glass'],
  'magnetic buttons': ['magnetic', 'button', 'magnet'],
  'hover spotlight': ['spotlight', 'hover'],
  'tilt-on-hover cards': ['tilt', 'card', 'hover'],
  'ripple effect': ['ripple'],
  'shiny button': ['shiny', 'button'],
  'parallax hero layers': ['parallax', 'hero'],
  'noise / grain overlay': ['noise', 'grain'],
  'hover gradient beam': ['beam', 'gradient', 'hover'],
};

// If user requests a single image, avoid gallery components
const SINGLE_IMAGE_HINTS = ['one image', 'single image', 'no gallery'];
const GALLERY_TYPES = ['gallery', 'grid', 'list', 'carousel'];

// Aliases override when external file is present
let ALIAS_COMPONENT_KEYWORDS = DEFAULT_COMPONENT_KEYWORDS;
let SHARED_COMPONENT_INDEX: ComponentIndexCache | null = null;

function buildComponentIndexCache(components: ComponentMeta[], generatedAt: number | null): ComponentIndexCache {
  const byCategory = new Map<string, ComponentMatch[]>();

  for (const meta of components) {
    const cat = meta.category || 'other';

    if (!byCategory.has(cat)) {
      byCategory.set(cat, []);
    }

    byCategory.get(cat)!.push({
      name: meta.name,
      category: cat,
      description: meta.description,
      code: meta.code,
      relevance: 0,
      source: meta.source,
      tags: meta.tags,
    });
  }

  return {
    components,
    generatedAt,
    byCategory,
  };
}

function cloneComponentIndexMap(source: Map<string, ComponentMatch[]>): Map<string, ComponentMatch[]> {
  const clone = new Map<string, ComponentMatch[]>();

  for (const [category, list] of source.entries()) {
    clone.set(category, list.slice());
  }

  return clone;
}

const COMPONENT_SECTION_PRIORITY: Record<string, number> = {
  hero: 10,
  navigation: 9,
  navbar: 9,
  header: 8,
  features: 7,
  products: 7,
  categories: 6,
  pricing: 6,
  testimonials: 5,
  gallery: 5,
  team: 4,
  contact: 4,
  faq: 4,
  footer: 3,
  cta: 3,
  about: 2,
  stats: 2,
  services: 2,
  projects: 2,
  blog: 2,
  logos: 1,
  newsletter: 1,
};

const NOISY_COMPONENT_KEYWORDS = new Set([
  'card',
  'grid',
  'list',
  'text',
  'button',
  'icon',
  'image',
  'link',
  'container',
  'wrapper',
  'section',
  'block',
  'item',
  'box',
]);

const STRONG_SECTION_KEYWORDS: Record<string, string[]> = {
  hero: ['hero', 'banner', 'spotlight', 'landing', 'splash', 'above-fold'],
  navigation: ['navbar', 'navigation', 'nav-bar', 'site-nav', 'main-nav'],
  navbar: ['navbar', 'navigation', 'nav-bar', 'site-nav', 'main-nav'],
  header: ['header', 'page-header', 'site-header', 'top-bar'],
  features: ['feature', 'benefit', 'advantage', 'capability'],
  products: ['product', 'catalog', 'shop', 'store', 'merchandise'],
  pricing: ['pricing', 'price', 'plan', 'tier', 'subscription'],
  testimonials: ['testimonial', 'review', 'feedback', 'quote', 'customer-story'],
  footer: ['footer', 'site-footer', 'page-footer'],
};

function addTypeScore(scores: Map<string, number>, type: string, score: number): void {
  const current = scores.get(type) ?? 0;
  scores.set(type, current + score);
}

function getTypePriority(type: string): number {
  return COMPONENT_SECTION_PRIORITY[type] ?? 0;
}

function scoreComponentTypeRequest(requestLower: string, componentType: string, keywords: string[]): number {
  let score = 0;
  const strongKeywords = STRONG_SECTION_KEYWORDS[componentType] ?? [];

  for (const keyword of strongKeywords) {
    if (matchesKeyword(requestLower, keyword)) {
      score += 5;
    }
  }

  for (const keyword of keywords) {
    if (matchesKeyword(requestLower, keyword)) {
      const keywordScore = NOISY_COMPONENT_KEYWORDS.has(keyword) ? 1 : 3;
      score += keywordScore;
    }
  }

  if (score > 0) {
    score += getTypePriority(componentType) * 0.3;
  }

  return score;
}

function buildComponentSearchText(component: ComponentMatch): string {
  const parts = [
    component.name,
    component.description,
    component.category,
    component.source,
    ...(component.tags ?? []),
  ];

  return parts.filter(Boolean).join(' ').toLowerCase();
}

function scoreComponentForType(component: ComponentMatch, componentType: string, theme: string | null): number {
  const text = buildComponentSearchText(component);
  const keywords = ALIAS_COMPONENT_KEYWORDS[componentType] || [componentType];
  const strongKeywords = STRONG_SECTION_KEYWORDS[componentType] ?? [];
  let score = 0;

  for (const keyword of strongKeywords) {
    if (text.includes(keyword)) {
      score += 5;
    }
  }

  for (const keyword of keywords) {
    if (text.includes(keyword)) {
      const keywordScore = NOISY_COMPONENT_KEYWORDS.has(keyword) ? 1 : 3;
      score += keywordScore;
    }
  }

  if (score === 0) {
    return 0;
  }

  if (theme && text.includes(theme.toLowerCase())) {
    score += 2;
  }

  const priority = getTypePriority(componentType);
  score += priority * 0.5;

  const source = (component.source || '').toLowerCase();
  if (source.includes('magicui')) score += 2;
  if (source.includes('aceternity')) score += 2;
  if (source.includes('reactbits')) score += 1;
  if (source.includes('shadcn')) score += 1;

  if (text.includes('install') || text.includes('cli')) {
    score -= 2;
  }

  if (text.includes('utility') || text.includes('helper')) {
    score -= 1;
  }

  return Math.max(0, score);
}

function sortComponentTypes(scores: Map<string, number>): string[] {
  return [...scores.entries()]
    .sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1];
      }

      return getTypePriority(b[0]) - getTypePriority(a[0]);
    })
    .map(([type]) => type);
}

try {
  const aliasPath = path.resolve(BOLT_ROOT, 'app/lib/services/component-aliases.json');

  if (fs.existsSync(aliasPath)) {
    const raw = fs.readFileSync(aliasPath, 'utf8');
    const parsed = JSON.parse(raw) as {
      componentKeywords?: Record<string, string[]>;
    };

    if (parsed.componentKeywords) {
      ALIAS_COMPONENT_KEYWORDS = parsed.componentKeywords;
    }

  }
} catch (error) {
  logger.warn('Failed to load component-aliases.json, using built-in keywords');
}

export class ComponentMatcher {
  private static _instance: ComponentMatcher;
  private _componentsIndex: Map<string, ComponentMatch[]> = new Map();
  private _loadedFiles: Set<string> = new Set();
  private _prebuilt: ComponentMeta[] | null = null;
  private _prebuiltGeneratedAt: number | null = null;

  static getInstance(): ComponentMatcher {
    if (!ComponentMatcher._instance) {
      ComponentMatcher._instance = new ComponentMatcher();
    }

    return ComponentMatcher._instance;
  }

  async loadComponentsFromMD(mdFilePath: string): Promise<void> {
    // Skip if already loaded this file
    if (this._loadedFiles.has(mdFilePath)) {
      return;
    }

    try {
      // In server context, read the file
      if (typeof window === 'undefined') {
        const fullPath = path.resolve(BOLT_ROOT, mdFilePath);
        const content = fs.readFileSync(fullPath, 'utf-8');
        this._parseComponents(content, mdFilePath);
        this._loadedFiles.add(mdFilePath);
        logger.info(`Loaded components from ${mdFilePath}`);
      }
    } catch (error) {
      logger.error(`Failed to load components from ${mdFilePath}:`, error);
    }
  }

  async loadAllComponentFiles(): Promise<void> {
    // Try prebuilt index first
    if (!this._prebuilt) {
      try {
        if (SHARED_COMPONENT_INDEX) {
          this._prebuilt = SHARED_COMPONENT_INDEX.components;
          this._prebuiltGeneratedAt = SHARED_COMPONENT_INDEX.generatedAt;
          this._componentsIndex = cloneComponentIndexMap(SHARED_COMPONENT_INDEX.byCategory);
          logger.info(`Loaded cached component index: ${SHARED_COMPONENT_INDEX.components.length} items`);
          return;
        }

        const idx = buildIndex(BOLT_ROOT, true);
        SHARED_COMPONENT_INDEX = buildComponentIndexCache(idx.components, idx.generatedAt || null);
        this._prebuilt = SHARED_COMPONENT_INDEX.components;
        this._prebuiltGeneratedAt = SHARED_COMPONENT_INDEX.generatedAt;
        this._componentsIndex = cloneComponentIndexMap(SHARED_COMPONENT_INDEX.byCategory);
        logger.info(`Loaded prebuilt component index: ${idx.total} items`);

        return;
      } catch (e) {
        logger.warn('Failed to load prebuilt index, fallback to MD parsing');
      }
    }

    /*
     * Load all component MD files
     * load from registry/index instead of raw MD (already deduped and cached)
     */
    const index = buildIndex(BOLT_ROOT, true);
    const fallbackCache = SHARED_COMPONENT_INDEX ?? buildComponentIndexCache(index.components, index.generatedAt || null);
    SHARED_COMPONENT_INDEX = fallbackCache;
    this._prebuilt = fallbackCache.components;
    this._prebuiltGeneratedAt = fallbackCache.generatedAt;
    this._componentsIndex = cloneComponentIndexMap(fallbackCache.byCategory);

    const stats = this.getStats();
    logger.info(`Total loaded: ${stats.totalComponents} components in ${stats.categories} categories (registry)`);
  }

  private _parseComponents(content: string, source: string): void {
    const lines = content.split('\n');
    let currentCategory = source.replace('.md', '').toLowerCase(); // Default category from filename
    let currentComponent: Partial<ComponentMatch> | null = null;
    let codeBuffer: string[] = [];
    let inCodeBlock = false;

    for (const line of lines) {
      // Category header (## UI, ## Blocks, ## Components, ## sparkles-demo, etc.)
      if (line.startsWith('## ')) {
        currentCategory = line.replace('## ', '').split(' ')[0].toLowerCase();
        continue;
      }

      // Component header (### Component Name)
      if (line.startsWith('### ')) {
        // Save previous component
        if (currentComponent && currentComponent.name) {
          this._addComponent(currentComponent as ComponentMatch);
        }

        const match = line.match(/### (.+?) \((.+?)\)/);

        if (match) {
          currentComponent = {
            name: match[2],
            category: currentCategory,
            description: match[1],
            code: '',
            relevance: 0,
          };
        }

        codeBuffer = [];
        continue;
      }

      // Code block
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          if (currentComponent) {
            currentComponent.code = (currentComponent.code || '') + codeBuffer.join('\n') + '\n\n';
          }

          codeBuffer = [];
        }

        inCodeBlock = !inCodeBlock;
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
      }
    }

    // Save last component
    if (currentComponent && currentComponent.name) {
      this._addComponent(currentComponent as ComponentMatch);
    }
  }

  private _addComponent(component: ComponentMatch): void {
    const category = component.category || 'other';

    if (!this._componentsIndex.has(category)) {
      this._componentsIndex.set(category, []);
    }

    this._componentsIndex.get(category)!.push(component);
  }

  analyzeUserRequest(request: string): { components: string[]; theme: string | null } {
    const requestLower = request.toLowerCase();
    const typeScores = new Map<string, number>();
    const detectedTheme = detectTheme(request);
    const matchedTheme = detectedTheme === 'default' ? null : detectedTheme;

    const wantsSingleImageHero = SINGLE_IMAGE_HINTS.some((h) => requestLower.includes(h));

    // Find matching component types
    for (const [componentType, keywords] of Object.entries(ALIAS_COMPONENT_KEYWORDS)) {
      const score = scoreComponentTypeRequest(requestLower, componentType, keywords);
      if (score > 0) {
        addTypeScore(typeScores, componentType, score);
      }
    }

    for (const [effectLabel, types] of Object.entries(EFFECT_KEYWORDS_MAP)) {
      if (requestLower.includes(effectLabel)) {
        for (const t of types) {
          addTypeScore(typeScores, t, 2);
        }
      }
    }

    if (wantsSingleImageHero) {
      for (const g of GALLERY_TYPES) {
        typeScores.delete(g);
      }

      if (!typeScores.has('hero')) {
        addTypeScore(typeScores, 'hero', 2);
      }
    }

    // Default components for landing page requests
    if (
      typeScores.size === 0 &&
      (requestLower.includes('landing') ||
        requestLower.includes('\u043b\u0435\u043d\u0434\u0438\u043d\u0433') ||
        requestLower.includes('\u0433\u043b\u0430\u0432\u043d\u0430\u044f') ||
        requestLower.includes('\u0441\u0430\u0439\u0442'))
    ) {
      addTypeScore(typeScores, 'hero', 3);
      addTypeScore(typeScores, 'header', 2);
      addTypeScore(typeScores, 'features', 2);
      addTypeScore(typeScores, 'footer', 1);
    }

    const matchedComponents = sortComponentTypes(typeScores);
    return { components: matchedComponents, theme: matchedTheme };
  }

  findMatchingComponents(componentTypes: string[], theme: string | null, limit: number = 3): ComponentMatch[] {
    const results: ComponentMatch[] = [];
    const byName = new Map<string, ComponentMatch>();

    for (const [category, components] of this._componentsIndex) {
      for (const component of components) {
        let bestScore = 0;

        for (const type of componentTypes) {
          const score = scoreComponentForType(component, type, theme);
          if (score > bestScore) {
            bestScore = score;
          }
        }

        if (bestScore > 0) {
          const existing = byName.get(component.name);
          if (!existing || bestScore > existing.relevance) {
            byName.set(component.name, { ...component, relevance: bestScore });
          }
        }
      }
    }

    results.push(...byName.values());

    return results.sort((a, b) => b.relevance - a.relevance).slice(0, limit * componentTypes.length);
  }

  generateContextForPrompt(request: string, maxComponents: number = 5): string {
    const { components: componentTypes, theme } = this.analyzeUserRequest(request);

    if (componentTypes.length === 0) {
      return '';
    }

    const seed = hashString(request.toLowerCase());
    const rng = makeRng(seed);
    const matchedComponents = shuffleArraySeeded(this.findMatchingComponents(componentTypes, theme, maxComponents), rng);

    if (matchedComponents.length === 0) {
      return '';
    }

    const requestLower = request.toLowerCase();
    const palette = randomChoiceSeeded(choosePalette(requestLower, theme), rng);
    const layout = randomChoiceSeeded(chooseLayout(), rng);
    const presetHint = buildPresetHint(theme);
    let freshnessHint = '';

    if (this._prebuiltGeneratedAt) {
      const ageHours = Math.round((Date.now() - this._prebuiltGeneratedAt) / (1000 * 60 * 60));

      if (ageHours > 72) {
        freshnessHint = `Index age: ~${ageHours}h (consider refreshing components).`;
      }
    }

    let context = `
<matched_ui_components>
  IMPORTANT: Use these components as DIRECT REFERENCE for your implementation.

  User request analysis:
  - Theme: ${theme || 'general'}
  - Components needed: ${componentTypes.join(', ')}
  - Found ${matchedComponents.length} matching components
  - Palette suggestion: ${palette}
  - Layout suggestion: ${layout}
  ${presetHint ? `- ${presetHint}` : ''}

  INSTRUCTIONS:
  1. Study the code patterns below
  2. Adapt them to user's specific request
  3. Combine multiple components if needed
  4. Keep the animation/styling approach
`;

    for (const comp of matchedComponents.slice(0, maxComponents)) {
      const code =
        comp.code.length > MAX_CODE_LENGTH
          ? comp.code.substring(0, MAX_CODE_LENGTH) + '\n// ... code continues ...'
          : comp.code;
      context += `
  ---
  ${comp.description.toUpperCase()} (${comp.name})
  Category: ${comp.category}
  ---

${code}

`;
    }

    context += `</matched_ui_components>`;

    return context;
  }

  getStats(): { categories: number; totalComponents: number } {
    let total = 0;

    for (const components of this._componentsIndex.values()) {
      total += components.length;
    }

    return {
      categories: this._componentsIndex.size,
      totalComponents: total,
    };
  }
}

export const componentMatcher = ComponentMatcher.getInstance();
