/**
 * Enhanced PromptGenerator - integrates new Design System
 * 
 * Converts structured Brief into technical prompt using:
 * - Design Token System (tokens.ts)
 * - Style Mixer (styleMixer.ts)
 * - Layout Patterns (layoutPatterns.ts)
 * - Component Variants (componentVariants.ts)
 * - Animation System (animations.ts)
 */

import {
  generateCompleteDesignSystem,
  type CompleteDesignSystem,
  generateLayout,
  selectVariant,
  mixStyles,
  createAnimationSelector,
  getVariantsByCategory,
  seededRandom,
} from '~/lib/design-system';
import { THEME_PALETTES } from './prompt-data';
import { createSeededRandom } from './prompt-data/seeded-random';
import { buildComponentSelectionPlan } from './prompt-component-utils';

// ============================================================================
// Types (Extended)
// ============================================================================

export type SiteType = 'landing' | 'corporate' | 'ecommerce' | 'portfolio' | 'blog';

export type DesignStyle = 'modern' | 'minimal' | 'creative' | 'professional';

export interface Brief {
  type: SiteType;
  theme: string;
  colors: string[];
  style: DesignStyle;
  screenshotAnalysis?: ScreenshotAnalysis;
  wishes?: string;
  seed?: number;
}

export interface ScreenshotAnalysis {
  layout: string[];
  colors: string[];
  typography: string;
  components: string[];
  animations: string;
  style: string;
}

export interface EnhancedGeneratedPrompt {
  prompt: string;
  themeKey: string;
  sections: SectionSpec[];
  palette: {
    dark: string;
    light: string;
    accent: string;
    background: string;
    text: string;
    supportingColors: string[];
  };
  seed: number;
  designSystem: CompleteDesignSystem;
  styleProfile: string;
  layoutPattern: string;
  componentVariants: Record<string, string>;
  animations: string[];
  extendedLibrary: ExtendedLibrarySelections;
}

export interface SectionSpec {
  name: string;
  layout: string;
  variant: string;
  effects: string[];
  animations: string[];
  styling: string;
}

type ExtendedLibraryVariant = {
  id: string;
  name: string;
  description: string;
  source: string;
  effects: string[];
  complexity: 'low' | 'medium' | 'high';
  dependencies: string[];
};

type ExtendedLibrarySelections = {
  buttons: ExtendedLibraryVariant[];
  backgrounds: ExtendedLibraryVariant[];
  textAnimations: ExtendedLibraryVariant[];
  cards: ExtendedLibraryVariant[];
  heroes: ExtendedLibraryVariant[];
  cursors: ExtendedLibraryVariant[];
  scrollAnimations: ExtendedLibraryVariant[];
};

// ============================================================================
// Enhanced PromptGenerator Class
// ============================================================================

export class EnhancedPromptGenerator {
  private rng: () => number;
  private designSystem: CompleteDesignSystem | null = null;

  constructor(seed?: number) {
    this.rng = createSeededRandom(seed ?? Date.now());
  }

  /**
   * Generate enhanced technical prompt from structured Brief
   * Uses the new Design System for unique, non-template designs
   */
  generate(brief: Brief): EnhancedGeneratedPrompt {
    const seed = brief.seed ?? Date.now();
    this.rng = createSeededRandom(seed);

    // Generate complete design system
    this.designSystem = generateCompleteDesignSystem(seed);

    const themeKey = this.mapTheme(brief.theme);
    const palette = this.selectPalette(brief.colors, themeKey);
    const sections = this.generateSections(brief);
    const extendedLibrary = this.selectExtendedLibraryVariants(seed);

    const prompt = this.buildEnhancedPrompt(brief, themeKey, palette, sections, extendedLibrary);

    return {
      prompt,
      themeKey,
      sections,
      palette,
      seed,
      designSystem: this.designSystem,
      styleProfile: this.designSystem.styleProfile.name,
      layoutPattern: this.designSystem.layout.pattern.name,
      componentVariants: this.extractVariantNames(this.designSystem.variants),
      animations: this.extractAnimationNames(sections),
      extendedLibrary,
    };
  }

  /**
   * Map user theme description to internal theme key
   */
  private mapTheme(theme: string): string {
    const lower = theme.toLowerCase();
    
    const themeMap: Record<string, string[]> = {
      furniture: ['furniture', 'mebel', 'мебел', 'interior', 'интерьер'],
      medical: ['medical', 'clinic', 'health', 'медицин', 'клиник', 'здоров'],
      finance: ['finance', 'fintech', 'bank', 'финанс', 'банк'],
      fitness: ['fitness', 'gym', 'sport', 'фитнес', 'спорт', 'трен'],
      travel: ['travel', 'tourism', 'путешеств', 'туризм'],
      photography: ['photo', 'photography', 'фото'],
      restaurant: ['restaurant', 'cafe', 'food', 'ресторан', 'кафе', 'ед'],
      tech: ['tech', 'saas', 'software', 'app', 'технолог'],
      education: ['education', 'school', 'course', 'образован', 'школ', 'курс'],
      realestate: ['real estate', 'property', 'недвижимост'],
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
  private selectPalette(userColors: string[], themeKey: string): EnhancedGeneratedPrompt['palette'] {
    if (userColors.length >= 1) {
      return {
        dark: '#1a1a1a',
        light: '#ffffff',
        accent: userColors[0],
        background: '#ffffff',
        text: '#1a1a1a',
        supportingColors: userColors.slice(1),
      };
    }

    const themePalette = THEME_PALETTES[themeKey] ?? THEME_PALETTES.default;
    return {
      dark: themePalette.dark,
      light: themePalette.light,
      accent: themePalette.accent,
      background: themePalette.light,
      text: themePalette.textOnLight,
      supportingColors: [],
    };
  }

  /**
   * Generate section specifications using Design System
   */
  private generateSections(brief: Brief): SectionSpec[] {
    if (!this.designSystem) {
      throw new Error('Design system not initialized');
    }

    const layout = this.designSystem.layout;
    const sections: SectionSpec[] = [];

    // Map layout sections to section specs
    layout.sections.forEach((section, index) => {
      // Select variant based on section type
      const variant = selectVariant(section.type, this.designSystem!.seed + index);
      
      // Select animations
      const animSelector = createAnimationSelector(this.designSystem!.seed + index);
      const animSet = animSelector.selectAnimationSet();
      
      sections.push({
        name: section.type,
        layout: section.variant,
        variant: variant.name,
        effects: section.effects || [],
        animations: [
          animSet.entrance?.name,
          animSet.scroll?.name,
          animSet.hover?.name,
        ].filter(Boolean) as string[],
        styling: this.generateSectionStyling(section),
      });
    });

    return sections;
  }

  /**
   * Generate styling instructions for a section
   */
  private generateSectionStyling(section: { type: string; variant: string; background?: string }): string {
    const styles: string[] = [];
    
    if (section.background) {
      styles.push(`Background: ${section.background}`);
    }
    
    // Add unique styling based on section type
    switch (section.type) {
      case 'hero':
        styles.push('Full viewport height');
        styles.push('Centered content with dramatic typography');
        break;
      case 'features':
        styles.push('Grid layout with hover effects');
        styles.push('Icon + text combination');
        break;
      case 'testimonials':
        styles.push('Card-based layout');
        styles.push('Quote styling with attribution');
        break;
      case 'cta':
        styles.push('High contrast for conversion');
        styles.push('Prominent button placement');
        break;
    }
    
    return styles.join('; ');
  }

  private buildSelectionStyleTags(brief: Brief): string[] {
    const tags: string[] = [];

    if (brief.style) {
      tags.push(brief.style);
    }

    if (this.designSystem?.styleProfile?.id) {
      tags.push(this.designSystem.styleProfile.id);
    }

    if (this.designSystem?.styleProfile?.name) {
      tags.push(this.designSystem.styleProfile.name);
    }

    if (this.designSystem?.layout?.pattern?.category) {
      tags.push(this.designSystem.layout.pattern.category);
    }

    if (this.designSystem?.layout?.pattern?.complexity) {
      tags.push(this.designSystem.layout.pattern.complexity);
    }

    if (this.designSystem?.layout?.pattern?.name) {
      tags.push(this.designSystem.layout.pattern.name);
    }

    if (this.designSystem?.layout?.pattern?.globalFeatures?.length) {
      tags.push(...this.designSystem.layout.pattern.globalFeatures);
    }

    return tags;
  }

  /**
   * Build the enhanced prompt string
   */
  private buildEnhancedPrompt(
    brief: Brief,
    themeKey: string,
    palette: EnhancedGeneratedPrompt['palette'],
    sections: SectionSpec[],
    extendedLibrary: ExtendedLibrarySelections
  ): string {
    const typeLabel = this.getSiteTypeLabel(brief.type);
    const styleLabel = this.getDesignStyleLabel(brief.style);
    const styleTags = this.buildSelectionStyleTags(brief);
    const componentPlan = buildComponentSelectionPlan(
      `${brief.theme} ${typeLabel} ${styleLabel} ${brief.wishes ?? ''}`.trim(),
      sections.map((section) => section.name),
      styleTags,
      this.designSystem?.seed ?? brief.seed ?? Date.now(),
    );

    const lines: string[] = [
      `Create a ${typeLabel} for "${brief.theme}" using Vite + React + TypeScript.`,
      '',
      '═══════════════════════════════════════════════════════════════',
      'DESIGN SYSTEM SPECIFICATION',
      '═══════════════════════════════════════════════════════════════',
      '',
      `Style Profile: ${this.designSystem?.styleProfile.name}`,
      `Layout Pattern: ${this.designSystem?.layout.pattern.name}`,
      `Unique Seed: ${this.designSystem?.seed}`,
      '',
      'DESIGN TOKENS:',
      `- Primary Colors: ${this.designSystem?.tokens.colors.primary.slice(0, 3).join(', ')}`,
      `- Typography: ${this.designSystem?.tokens.typography.fontFamily.heading} (headings), ${this.designSystem?.tokens.typography.fontFamily.body} (body)`,
      `- Border Radius: ${Object.values(this.designSystem?.tokens.borderRadius || {}).slice(0, 3).join(', ')}`,
      '',
      'COLOR PALETTE:',
      `- Dark: ${palette.dark}`,
      `- Light: ${palette.light}`,
      `- Accent: ${palette.accent}`,
      `- Background: ${palette.background}`,
      `- Text: ${palette.text}`,
    ];

    if (palette.supportingColors.length > 0) {
      lines.push(`- Supporting: ${palette.supportingColors.join(', ')}`);
    }

    lines.push('');
    lines.push('EXTENDED COMPONENT IDEAS:');
    this.appendExtendedLibrary(lines, extendedLibrary);

    if (brief.screenshotAnalysis) {
      lines.push('');
      lines.push('SCREENSHOT INSPIRATION:');
      lines.push(`- Typography: ${brief.screenshotAnalysis.typography}`);
      lines.push(`- Style: ${brief.screenshotAnalysis.style}`);
      lines.push(`- Components: ${brief.screenshotAnalysis.components.join(', ')}`);
    }

    lines.push('');
    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push('STRUCTURE & SECTIONS');
    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push('');

    sections.forEach((section, i) => {
      lines.push(`${i + 1}. ${section.name.toUpperCase()} SECTION`);
      lines.push(`   Layout: ${section.layout}`);
      lines.push(`   Variant: ${section.variant}`);
      lines.push(`   Effects: ${section.effects.join(', ')}`);
      lines.push(`   Animations: ${section.animations.join(', ')}`);
      lines.push(`   Styling: ${section.styling}`);
      lines.push('');
    });

    if (componentPlan) {
      lines.push(componentPlan.trim());
      lines.push('');
    }

    // Add style mixer features
    if (this.designSystem?.styleProfile.features) {
      lines.push('STYLE FEATURES:');
      this.designSystem.styleProfile.features.slice(0, 5).forEach(feature => {
        lines.push(`- ${feature.name}: ${feature.implementation}`);
      });
      lines.push('');
    }

    if (brief.wishes) {
      lines.push('ADDITIONAL REQUIREMENTS:');
      lines.push(brief.wishes);
      lines.push('');
    }

    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push('TECHNICAL REQUIREMENTS');
    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push('');
    lines.push('TECH STACK:');
    lines.push('- Vite + React + TypeScript');
    lines.push('- Tailwind CSS (use CSS variables from design tokens)');
    lines.push('- Framer Motion (for all animations)');
    lines.push('- Lucide React (for icons)');
    lines.push('');
    lines.push('DESIGN REQUIREMENTS:');
    lines.push('- Implement ALL specified animations');
    lines.push('- Use the exact color palette provided');
    lines.push('- Follow the layout pattern structure');
    lines.push('- Apply hover and scroll effects as specified');
    lines.push('- Ensure responsive design at all breakpoints');
    lines.push('- Use CSS custom properties for theming');
    lines.push('- Frontend-only: do not modify backend, API routes, or database logic.');
    lines.push('');
    lines.push('QUALITY REQUIREMENTS:');
    lines.push('- Professional, polished appearance');
    lines.push('- Smooth 60fps animations');
    lines.push('- Accessible (WCAG 2.1 AA compliant)');
    lines.push('- SEO-friendly markup');
    lines.push('');

    const intentTheme = themeKey !== 'default' ? themeKey : brief.type;
    const paletteTag = [palette.accent, ...palette.supportingColors].filter(Boolean).join(', ');
    lines.push(
      `[design: ${intentTheme} | type: ${brief.type} | style: ${brief.style} | profile: ${this.designSystem?.styleProfile.name} | layout: ${this.designSystem?.layout.pattern.name} | colors: ${paletteTag || 'auto'} | seed: ${this.designSystem?.seed}]`
    );

    return lines.join('\n');
  }

  private selectExtendedLibraryVariants(seed: number): ExtendedLibrarySelections {
    const pick = (category: string, count: number, offset: number): ExtendedLibraryVariant[] => {
      const variants = getVariantsByCategory(category) as ExtendedLibraryVariant[];
      if (!variants.length) return [];
      const rng = seededRandom(seed + offset);
      return rng.sample(variants, Math.min(count, variants.length));
    };

    return {
      buttons: pick('buttons', 2, 31),
      backgrounds: pick('backgrounds', 2, 32),
      textAnimations: pick('textAnimations', 2, 33),
      cards: pick('cards', 1, 34),
      heroes: pick('heroes', 1, 35),
      cursors: pick('cursors', 1, 36),
      scrollAnimations: pick('scrollAnimations', 1, 37),
    };
  }

  private appendExtendedLibrary(lines: string[], selections: ExtendedLibrarySelections): void {
    const formatVariant = (variant: ExtendedLibraryVariant) => {
      const effects = variant.effects?.slice(0, 2).join(', ');
      return `${variant.name} [${variant.source}]${effects ? ` (${effects})` : ''}`;
    };

    const pushCategory = (label: string, items: ExtendedLibraryVariant[]) => {
      if (!items.length) return;
      lines.push(`- ${label}: ${items.map(formatVariant).join(' | ')}`);
    };

    pushCategory('Buttons', selections.buttons);
    pushCategory('Backgrounds', selections.backgrounds);
    pushCategory('Text Animations', selections.textAnimations);
    pushCategory('Cards', selections.cards);
    pushCategory('Heroes', selections.heroes);
    pushCategory('Cursors', selections.cursors);
    pushCategory('Scroll Animations', selections.scrollAnimations);
  }

  /**
   * Extract variant names from variants object
   */
  private extractVariantNames(variants: Record<string, { name: string }>): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, variant] of Object.entries(variants)) {
      result[key] = variant.name;
    }
    return result;
  }

  /**
   * Extract animation names from sections
   */
  private extractAnimationNames(sections: SectionSpec[]): string[] {
    const animations = new Set<string>();
    sections.forEach(section => {
      section.animations.forEach(anim => animations.add(anim));
    });
    return Array.from(animations);
  }

  /**
   * Get site type label
   */
  private getSiteTypeLabel(type: SiteType): string {
    const labels: Record<SiteType, string> = {
      landing: 'landing page',
      corporate: 'corporate website',
      ecommerce: 'e-commerce website',
      portfolio: 'portfolio website',
      blog: 'blog',
    };
    return labels[type];
  }

  /**
   * Get design style label
   */
  private getDesignStyleLabel(style: DesignStyle): string {
    const labels: Record<DesignStyle, string> = {
      modern: 'modern',
      minimal: 'minimalist',
      creative: 'creative and bold',
      professional: 'professional and strict',
    };
    return labels[style];
  }
}

// ============================================================================
// Backward-compatible singleton
// ============================================================================

export const enhancedPromptGenerator = new EnhancedPromptGenerator();

// Also export the original for backward compatibility
export { PromptGenerator } from './promptGenerator';
export { promptGenerator } from './promptGenerator';
