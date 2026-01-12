import { createScopedLogger } from '../../utils/logger';
import * as fs from 'fs';
import * as path from 'path';
import { BOLT_ROOT, buildIndex, type ComponentMeta } from './component-index.server';
import { matchesKeyword } from './prompt-color-utils';
import { getMergedKeywords } from './prompt-data';

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
}

// Default keywords for component matching (ASCII fallback + RU via \uXXXX)
const DEFAULT_COMPONENT_KEYWORDS: Record<string, string[]> = {
  header: ['header', 'head', 'top bar', 'top section', 'site header', 'page header',
    '\u0448\u0430\u043f\u043a\u0430', '\u0432\u0435\u0440\u0445\u043d\u044f\u044f \u0447\u0430\u0441\u0442\u044c', '\u0437\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a \u0441\u0430\u0439\u0442\u0430'],
  hero: ['hero', 'hero section', 'hero banner', 'main banner', 'landing section', 'above the fold', 'first screen', 'splash',
    '\u0433\u0435\u0440\u043e\u0439', '\u0433\u043b\u0430\u0432\u043d\u044b\u0439 \u0431\u0430\u043d\u043d\u0435\u0440', '\u043f\u0435\u0440\u0432\u044b\u0439 \u044d\u043a\u0440\u0430\u043d', '\u0433\u043b\u0430\u0432\u043d\u044b\u0439 \u044d\u043a\u0440\u0430\u043d'],
  navbar: ['navbar', 'navigation', 'nav', 'nav bar', 'navigation bar', 'top menu', 'main menu', 'site menu',
    '\u043d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044f', '\u043c\u0435\u043d\u044e', '\u0433\u043b\u0430\u0432\u043d\u043e\u0435 \u043c\u0435\u043d\u044e', '\u0432\u0435\u0440\u0445\u043d\u0435\u0435 \u043c\u0435\u043d\u044e'],
  features: ['features', 'feature', 'benefits', 'advantages', 'services', 'what we offer', 'capabilities',
    '\u0444\u0438\u0447\u0438', '\u043f\u0440\u0435\u0438\u043c\u0443\u0449\u0435\u0441\u0442\u0432\u0430', '\u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e\u0441\u0442\u0438', '\u0443\u0441\u043b\u0443\u0433\u0438'],
  pricing: ['pricing', 'plans', 'prices', 'tiers', 'subscription',
    '\u0446\u0435\u043d\u044b', '\u0442\u0430\u0440\u0438\u0444\u044b', '\u043f\u043b\u0430\u043d\u044b', '\u043f\u043e\u0434\u043f\u0438\u0441\u043a\u0430'],
  testimonials: ['testimonials', 'reviews', 'feedback', 'quotes',
    '\u043e\u0442\u0437\u044b\u0432\u044b', '\u0440\u0435\u0446\u0435\u043d\u0437\u0438\u0438', '\u043c\u043d\u0435\u043d\u0438\u044f \u043a\u043b\u0438\u0435\u043d\u0442\u043e\u0432'],
  team: ['team', 'about us', 'our team', 'leadership', 'staff',
    '\u043a\u043e\u043c\u0430\u043d\u0434\u0430', '\u043d\u0430\u0448\u0430 \u043a\u043e\u043c\u0430\u043d\u0434\u0430', '\u0441\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u043a\u0438', '\u043e \u043d\u0430\u0441'],
  contact: ['contact', 'contact form', 'get in touch', 'reach out',
    '\u043a\u043e\u043d\u0442\u0430\u043a\u0442\u044b', '\u0441\u0432\u044f\u0437\u044c', '\u043e\u0431\u0440\u0430\u0442\u043d\u0430\u044f \u0441\u0432\u044f\u0437\u044c', '\u043d\u0430\u043f\u0438\u0448\u0438\u0442\u0435 \u043d\u0430\u043c'],
  footer: ['footer', 'site footer', 'bottom section',
    '\u0444\u0443\u0442\u0435\u0440', '\u043f\u043e\u0434\u0432\u0430\u043b', '\u043d\u0438\u0436\u043d\u044f\u044f \u0447\u0430\u0441\u0442\u044c'],
  cta: ['cta', 'call to action', 'call-to-action', 'signup', 'sign up', 'get started',
    '\u043f\u0440\u0438\u0437\u044b\u0432 \u043a \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044e', '\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f', '\u043d\u0430\u0447\u0430\u0442\u044c'],
  faq: ['faq', 'questions', 'q&a', 'accordion',
    '\u0447\u0430\u0432\u043e', '\u0432\u043e\u043f\u0440\u043e\u0441\u044b', '\u0447\u0430\u0441\u0442\u044b\u0435 \u0432\u043e\u043f\u0440\u043e\u0441\u044b', '\u0432\u043e\u043f\u0440\u043e\u0441-\u043e\u0442\u0432\u0435\u0442'],
  about: ['about', 'our story', 'mission', 'vision',
    '\u043e \u043d\u0430\u0441', '\u043d\u0430\u0448\u0430 \u0438\u0441\u0442\u043e\u0440\u0438\u044f', '\u043c\u0438\u0441\u0441\u0438\u044f', '\u043e \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0438'],
  stats: ['stats', 'metrics', 'numbers', 'kpis',
    '\u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430', '\u043c\u0435\u0442\u0440\u0438\u043a\u0438', '\u0446\u0438\u0444\u0440\u044b', '\u043f\u043e\u043a\u0430\u0437\u0430\u0442\u0435\u043b\u0438'],
  services: ['services', 'offerings', 'what we do',
    '\u0443\u0441\u043b\u0443\u0433\u0438', '\u0447\u0442\u043e \u043c\u044b \u0434\u0435\u043b\u0430\u0435\u043c', '\u043d\u0430\u0448\u0438 \u0443\u0441\u043b\u0443\u0433\u0438'],
  projects: ['projects', 'case studies', 'work', 'portfolio',
    '\u043f\u0440\u043e\u0435\u043a\u0442\u044b', '\u043a\u0435\u0439\u0441\u044b', '\u0440\u0430\u0431\u043e\u0442\u044b', '\u043f\u043e\u0440\u0442\u0444\u043e\u043b\u0438\u043e'],
  gallery: ['gallery', 'grid', 'masonry', 'carousel', 'slider',
    '\u0433\u0430\u043b\u0435\u0440\u0435\u044f', '\u0441\u0435\u0442\u043a\u0430', '\u043a\u0430\u0440\u0443\u0441\u0435\u043b\u044c', '\u0441\u043b\u0430\u0439\u0434\u0435\u0440'],
  blog: ['blog', 'articles', 'news', 'posts',
    '\u0431\u043b\u043e\u0433', '\u0441\u0442\u0430\u0442\u044c\u0438', '\u043d\u043e\u0432\u043e\u0441\u0442\u0438', '\u043f\u043e\u0441\u0442\u044b'],
  logos: ['logos', 'logo cloud', 'partners', 'clients',
    '\u043b\u043e\u0433\u043e\u0442\u0438\u043f\u044b', '\u043f\u0430\u0440\u0442\u043d\u0435\u0440\u044b', '\u043a\u043b\u0438\u0435\u043d\u0442\u044b'],
  products: ['products', 'catalog', 'shop', 'store',
    '\u0442\u043e\u0432\u0430\u0440\u044b', '\u043a\u0430\u0442\u0430\u043b\u043e\u0433', '\u043c\u0430\u0433\u0430\u0437\u0438\u043d', '\u043f\u0440\u043e\u0434\u0443\u043a\u0442\u044b'],
  categories: ['categories', 'collections', 'filters',
    '\u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0438', '\u043a\u043e\u043b\u043b\u0435\u043a\u0446\u0438\u0438', '\u0444\u0438\u043b\u044c\u0442\u0440\u044b'],
  newsletter: ['newsletter', 'subscribe', 'email signup',
    '\u0440\u0430\u0441\u0441\u044b\u043b\u043a\u0430', '\u043f\u043e\u0434\u043f\u0438\u0441\u043a\u0430', '\u043f\u043e\u0434\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f']
};

// Default component keywords (fallback when component-aliases.json is missing)
// Industry/theme keywords
const DEFAULT_THEME_KEYWORDS = getMergedKeywords();

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
let ALIAS_THEME_KEYWORDS = DEFAULT_THEME_KEYWORDS;

try {
  const aliasPath = path.resolve(BOLT_ROOT, 'app/lib/services/component-aliases.json');

  if (fs.existsSync(aliasPath)) {
    const raw = fs.readFileSync(aliasPath, 'utf8');
    const parsed = JSON.parse(raw) as {
      componentKeywords?: Record<string, string[]>;
      themeKeywords?: Record<string, string[]>;
    };

    if (parsed.componentKeywords) {
      ALIAS_COMPONENT_KEYWORDS = parsed.componentKeywords;
    }

    if (parsed.themeKeywords) {
      ALIAS_THEME_KEYWORDS = parsed.themeKeywords;
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
        const idx = buildIndex(BOLT_ROOT, true);
        this._prebuilt = idx.components;
        this._prebuiltGeneratedAt = idx.generatedAt || null;
        this._componentsIndex.clear();

        for (const meta of idx.components) {
          const cat = meta.category || 'other';

          if (!this._componentsIndex.has(cat)) {
            this._componentsIndex.set(cat, []);
          }

          this._componentsIndex.get(cat)!.push({
            name: meta.name,
            category: cat,
            description: meta.description,
            code: meta.code,
            relevance: 0,
          });
        }
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
    this._componentsIndex.clear();

    for (const meta of index.components) {
      const cat = meta.category || 'other';

      if (!this._componentsIndex.has(cat)) {
        this._componentsIndex.set(cat, []);
      }

      this._componentsIndex.get(cat)!.push({
        name: meta.name,
        category: cat,
        description: meta.description,
        code: meta.code,
        relevance: 0,
      });
    }

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
    const matchedComponents: string[] = [];
    let matchedTheme: string | null = null;

    const wantsSingleImageHero = SINGLE_IMAGE_HINTS.some((h) => requestLower.includes(h));

    // Find matching component types
    for (const [componentType, keywords] of Object.entries(ALIAS_COMPONENT_KEYWORDS)) {
      for (const keyword of keywords) {
        if (matchesKeyword(requestLower, keyword)) {
          if (!matchedComponents.includes(componentType)) {
            matchedComponents.push(componentType);
          }

          break;
        }
      }
    }

    // Find theme
    for (const [theme, keywords] of Object.entries(ALIAS_THEME_KEYWORDS)) {
      for (const keyword of keywords) {
        if (matchesKeyword(requestLower, keyword)) {
          matchedTheme = theme;
          break;
        }
      }

      if (matchedTheme) {
        break;
      }
    }

    for (const [effectLabel, types] of Object.entries(EFFECT_KEYWORDS_MAP)) {
      if (requestLower.includes(effectLabel)) {
        for (const t of types) {
          if (!matchedComponents.includes(t)) {
            matchedComponents.push(t);
          }
        }
      }
    }

    if (wantsSingleImageHero) {
      for (const g of GALLERY_TYPES) {
        const idx = matchedComponents.indexOf(g);

        if (idx >= 0) {
          matchedComponents.splice(idx, 1);
        }
      }

      if (!matchedComponents.includes('hero')) {
        matchedComponents.push('hero');
      }
    }

    // Default components for landing page requests
    if (
      matchedComponents.length === 0 &&
      (requestLower.includes('landing') ||
        requestLower.includes('\u043b\u0435\u043d\u0434\u0438\u043d\u0433') ||
        requestLower.includes('\u0433\u043b\u0430\u0432\u043d\u0430\u044f') ||
        requestLower.includes('\u0441\u0430\u0439\u0442'))
    ) {
      matchedComponents.push('hero', 'header', 'features', 'footer');
    }

    return { components: matchedComponents, theme: matchedTheme };
  }

  findMatchingComponents(componentTypes: string[], limit: number = 3): ComponentMatch[] {
    const results: ComponentMatch[] = [];

    for (const [category, components] of this._componentsIndex) {
      for (const component of components) {
        const nameLower = component.name.toLowerCase();
        const descLower = component.description.toLowerCase();

        for (const type of componentTypes) {
          const keywords = ALIAS_COMPONENT_KEYWORDS[type] || [type];

          for (const keyword of keywords) {
            if (nameLower.includes(keyword) || descLower.includes(keyword)) {
              component.relevance = 10;

              if (!results.find((r) => r.name === component.name)) {
                results.push({ ...component });
              }

              break;
            }
          }
        }
      }
    }

    // Sort by relevance and limit
    return results.sort((a, b) => b.relevance - a.relevance).slice(0, limit * componentTypes.length);
  }

  generateContextForPrompt(request: string, maxComponents: number = 5): string {
    const { components: componentTypes, theme } = this.analyzeUserRequest(request);

    if (componentTypes.length === 0) {
      return '';
    }

    const seed = hashString(request.toLowerCase());
    const rng = makeRng(seed);
    const matchedComponents = shuffleArraySeeded(this.findMatchingComponents(componentTypes, maxComponents), rng);

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
