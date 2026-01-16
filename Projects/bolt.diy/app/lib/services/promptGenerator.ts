/**
 * PromptGenerator - converts structured Brief into technical prompt
 * 
 * Unlike promptEnhancer (which parses free-text), this module works with
 * structured data from BriefForm, making it deterministic and testable.
 */

import { THEME_PALETTES } from './prompt-data';
import { createSeededRandom } from './prompt-data/seeded-random';

// ============================================================================
// Types
// ============================================================================

export type SiteType = 'landing' | 'corporate' | 'ecommerce' | 'portfolio' | 'blog';

export type DesignStyle = 'modern' | 'minimal' | 'creative' | 'professional';

export interface Brief {
  /** Site type */
  type: SiteType;
  /** Business theme/niche (e.g., "furniture", "medical clinic") */
  theme: string;
  /** Color preferences (hex or color names) */
  colors: string[];
  /** Design style */
  style: DesignStyle;
  /** Optional: analysis from uploaded screenshots */
  screenshotAnalysis?: ScreenshotAnalysis;
  /** Additional user wishes (free text) */
  wishes?: string;
  /** Seed for deterministic generation (optional) */
  seed?: number;
}

export interface ScreenshotAnalysis {
  /** Detected layout structure */
  layout: string[];
  /** Extracted color palette */
  colors: string[];
  /** Typography style description */
  typography: string;
  /** Detected component types */
  components: string[];
  /** Animation style (if detected) */
  animations: string;
  /** Overall design style */
  style: string;
}

export interface SectionSpec {
  name: string;
  layout: string;
  effects: string[];
}

export interface GeneratedPrompt {
  /** The full technical prompt for LLM */
  prompt: string;
  /** Detected/mapped theme key */
  themeKey: string;
  /** Generated sections */
  sections: SectionSpec[];
  /** Color palette used */
  palette: {
    dark: string;
    light: string;
    accent: string;
    background: string;
    text: string;
  };
  /** Seed used for generation */
  seed: number;
}

// ============================================================================
// Constants
// ============================================================================

const SITE_TYPE_LABELS: Record<SiteType, { en: string; ru: string }> = {
  landing: { en: 'landing page', ru: '\u043B\u0435\u043D\u0434\u0438\u043D\u0433' },
  corporate: { en: 'corporate website', ru: '\u043A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u0441\u0430\u0439\u0442' },
  ecommerce: { en: 'e-commerce website', ru: '\u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442-\u043C\u0430\u0433\u0430\u0437\u0438\u043D' },
  portfolio: { en: 'portfolio website', ru: '\u043F\u043E\u0440\u0442\u0444\u043E\u043B\u0438\u043E' },
  blog: { en: 'blog', ru: '\u0431\u043B\u043E\u0433' },
};

const STYLE_LABELS: Record<DesignStyle, { en: string; ru: string }> = {
  modern: { en: 'modern', ru: '\u0441\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0439' },
  minimal: { en: 'minimalist', ru: '\u043C\u0438\u043D\u0438\u043C\u0430\u043B\u0438\u0441\u0442\u0438\u0447\u043D\u044B\u0439' },
  creative: { en: 'creative and bold', ru: '\u044F\u0440\u043A\u0438\u0439 \u0438 \u043A\u0440\u0435\u0430\u0442\u0438\u0432\u043D\u044B\u0439' },
  professional: { en: 'professional and strict', ru: '\u0441\u0442\u0440\u043E\u0433\u0438\u0439 \u0438 \u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439' },
};

const DEFAULT_SECTIONS_BY_TYPE: Record<SiteType, string[]> = {
  landing: ['hero', 'features', 'testimonials', 'cta', 'footer'],
  corporate: ['hero', 'about', 'services', 'team', 'contact', 'footer'],
  ecommerce: ['hero', 'categories', 'products', 'reviews', 'footer'],
  portfolio: ['hero', 'gallery', 'about', 'contact', 'footer'],
  blog: ['hero', 'posts', 'categories', 'newsletter', 'footer'],
};

const SECTION_LAYOUTS: Record<string, string[]> = {
  hero: ['centered', 'split-left', 'split-right', 'fullscreen-video', 'gradient-overlay'],
  features: ['grid-3', 'grid-4', 'alternating', 'cards-horizontal'],
  testimonials: ['carousel', 'grid-2', 'single-featured', 'masonry'],
  gallery: ['masonry', 'grid-3', 'lightbox', 'carousel'],
  products: ['grid-4', 'grid-3', 'list', 'featured-row'],
  services: ['cards-grid', 'accordion', 'tabs', 'timeline'],
  team: ['grid-4', 'grid-3', 'carousel', 'cards-overlap'],
  about: ['split-image-left', 'split-image-right', 'centered', 'timeline'],
  contact: ['split-form-map', 'centered-form', 'cards-info'],
  cta: ['centered', 'split', 'banner'],
  footer: ['multi-column', 'simple', 'mega-footer'],
};

const SECTION_EFFECTS: string[] = [
  'fade-in',
  'slide-up',
  'parallax',
  'hover-lift',
  'stagger-children',
  'blur-reveal',
  'scale-on-scroll',
];

// ============================================================================
// PromptGenerator Class
// ============================================================================

export class PromptGenerator {
  private rng: () => number;

  constructor(seed?: number) {
    this.rng = createSeededRandom(seed ?? Date.now());
  }

  /**
   * Generate technical prompt from structured Brief
   */
  generate(brief: Brief): GeneratedPrompt {
    const seed = brief.seed ?? Date.now();
    this.rng = createSeededRandom(seed);

    const themeKey = this.mapTheme(brief.theme);
    const palette = this.selectPalette(brief.colors, themeKey);
    const sections = this.generateSections(brief);

    const prompt = this.buildPrompt(brief, themeKey, palette, sections);

    return {
      prompt,
      themeKey,
      sections,
      palette,
      seed,
    };
  }

  /**
   * Map user theme description to internal theme key
   */
  private mapTheme(theme: string): string {
    const lower = theme.toLowerCase();
    
    // Simple keyword matching - can be extended
    const themeMap: Record<string, string[]> = {
      furniture: ['furniture', 'mebel', '\u043C\u0435\u0431\u0435\u043B', 'interior', '\u0438\u043D\u0442\u0435\u0440\u044C\u0435\u0440'],
      medical: ['medical', 'clinic', 'health', '\u043C\u0435\u0434\u0438\u0446\u0438\u043D', '\u043A\u043B\u0438\u043D\u0438\u043A', '\u0437\u0434\u043E\u0440\u043E\u0432'],
      finance: ['finance', 'fintech', 'bank', '\u0444\u0438\u043D\u0430\u043D\u0441', '\u0431\u0430\u043D\u043A'],
      fitness: ['fitness', 'gym', 'sport', '\u0444\u0438\u0442\u043D\u0435\u0441', '\u0441\u043F\u043E\u0440\u0442', '\u0442\u0440\u0435\u043D'],
      travel: ['travel', 'tourism', '\u043F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432', '\u0442\u0443\u0440\u0438\u0437\u043C'],
      photography: ['photo', 'photography', '\u0444\u043E\u0442\u043E'],
      restaurant: ['restaurant', 'cafe', 'food', '\u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D', '\u043A\u0430\u0444\u0435', '\u0435\u0434'],
      tech: ['tech', 'saas', 'software', 'app', '\u0442\u0435\u0445\u043D\u043E\u043B\u043E\u0433'],
      education: ['education', 'school', 'course', '\u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D', '\u0448\u043A\u043E\u043B', '\u043A\u0443\u0440\u0441'],
      realestate: ['real estate', 'property', '\u043D\u0435\u0434\u0432\u0438\u0436\u0438\u043C\u043E\u0441\u0442'],
    };

    for (const [key, keywords] of Object.entries(themeMap)) {
      if (keywords.some(kw => lower.includes(kw))) {
        return key;
      }
    }

    return 'default';
  }

  /**
   * Select color palette based on user colors or theme
   */
  private selectPalette(userColors: string[], themeKey: string): GeneratedPrompt['palette'] {
    // If user specified colors, use them
    if (userColors.length >= 2) {
      return {
        dark: '#1a1a1a',
        light: '#ffffff',
        accent: userColors[0],
        background: '#ffffff',
        text: '#1a1a1a',
      };
    }

    // Otherwise use theme palette
    const themePalette = THEME_PALETTES[themeKey] ?? THEME_PALETTES.default;
    return {
      dark: themePalette.dark,
      light: themePalette.light,
      accent: themePalette.accent,
      background: themePalette.light,
      text: themePalette.textOnLight,
    };
  }

  /**
   * Generate section specifications
   */
  private generateSections(brief: Brief): SectionSpec[] {
    const baseSections = brief.screenshotAnalysis?.layout 
      ?? DEFAULT_SECTIONS_BY_TYPE[brief.type];

    return baseSections.map(name => ({
      name,
      layout: this.pickLayout(name),
      effects: this.pickEffects(2),
    }));
  }

  /**
   * Pick random layout for section
   */
  private pickLayout(sectionName: string): string {
    const layouts = SECTION_LAYOUTS[sectionName] ?? ['default'];
    const index = Math.floor(this.rng() * layouts.length);
    return layouts[index];
  }

  /**
   * Pick random effects
   */
  private pickEffects(count: number): string[] {
    const shuffled = [...SECTION_EFFECTS].sort(() => this.rng() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Build the final prompt string
   */
  private buildPrompt(
    brief: Brief,
    themeKey: string,
    palette: GeneratedPrompt['palette'],
    sections: SectionSpec[]
  ): string {
    const typeLabel = SITE_TYPE_LABELS[brief.type].en;
    const styleLabel = STYLE_LABELS[brief.style].en;

    const lines: string[] = [
      `Create a ${typeLabel} for "${brief.theme}" using Vite + React + TypeScript.`,
      '',
      'DESIGN:',
      `- Style: ${styleLabel}`,
      `- Dark color: ${palette.dark}`,
      `- Light color: ${palette.light}`,
      `- Accent color: ${palette.accent}`,
      `- Background: ${palette.background}`,
      `- Text: ${palette.text}`,
    ];

    if (brief.screenshotAnalysis) {
      lines.push(`- Typography: ${brief.screenshotAnalysis.typography}`);
      lines.push(`- Inspiration: ${brief.screenshotAnalysis.style}`);
    }

    lines.push('');
    lines.push('STRUCTURE:');

    sections.forEach((section, i) => {
      lines.push(`${i + 1}. ${section.name} Section`);
      lines.push(`   - Layout: ${section.layout}`);
      lines.push(`   - Effects: ${section.effects.join(', ')}`);
    });

    if (brief.wishes) {
      lines.push('');
      lines.push('ADDITIONAL REQUIREMENTS:');
      lines.push(brief.wishes);
    }

    lines.push('');
    lines.push('TECH STACK:');
    lines.push('- Vite + React + TypeScript');
    lines.push('- Tailwind CSS');
    lines.push('- Framer Motion (for animations)');
    lines.push('- Lucide React (for icons)');

    return lines.join('\n');
  }
}

// ============================================================================
// Singleton instance
// ============================================================================

export const promptGenerator = new PromptGenerator();
