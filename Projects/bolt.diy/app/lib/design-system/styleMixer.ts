/**
 * Style Mixer
 * 
 * Creates unique design styles by combining multiple base styles.
 * Inspired by Kombai's approach to design-to-code conversion.
 */

import { type DesignTokens, generateDesignTokens, tokensToCSS } from './tokens';

// ============================================================================
// TYPES
// ============================================================================

export interface StyleProfile {
  id: string;
  name: string;
  description: string;
  baseStyles: BaseStyle[];
  features: StyleFeature[];
  tokens: DesignTokens;
  overrides: StyleOverrides;
}

export interface BaseStyle {
  id: string;
  name: string;
  category: 'layout' | 'typography' | 'color' | 'effects' | 'interaction';
  features: string[];
  intensity: number; // 0-1, how strongly this style is applied
}

export interface StyleFeature {
  id: string;
  name: string;
  category: string;
  implementation: string;
  cssProperties?: Record<string, string>;
}

export interface StyleOverrides {
  borderRadius?: 'none' | 'subtle' | 'medium' | 'heavy' | 'pill';
  shadows?: 'none' | 'minimal' | 'medium' | 'heavy' | 'glow';
  animations?: 'none' | 'subtle' | 'medium' | 'dramatic';
  spacing?: 'compact' | 'normal' | 'spacious' | 'dramatic';
  typography?: 'minimal' | 'expressive' | 'dramatic';
}

// ============================================================================
// BASE STYLES LIBRARY
// ============================================================================

const BASE_STYLES: BaseStyle[] = [
  // Layout styles
  {
    id: 'brutalist',
    name: 'Neo-Brutalism',
    category: 'layout',
    features: ['sharp-corners', 'thick-borders', 'high-contrast', 'bold-shadows', 'asymmetric-grid'],
    intensity: 0.8,
  },
  {
    id: 'minimal',
    name: 'Minimalist',
    category: 'layout',
    features: ['whitespace', 'clean-lines', 'subtle-separation', 'single-column', 'airy-layout'],
    intensity: 0.6,
  },
  {
    id: 'editorial',
    name: 'Editorial',
    category: 'layout',
    features: ['asymmetric-layout', 'overlapping-elements', 'masonry-grid', 'large-typography', 'image-heavy'],
    intensity: 0.7,
  },
  {
    id: 'bento',
    name: 'Bento Grid',
    category: 'layout',
    features: ['card-based', 'variable-sizes', 'grid-system', 'contained-elements', 'organized-chaos'],
    intensity: 0.75,
  },
  {
    id: 'immersive',
    name: 'Immersive',
    category: 'layout',
    features: ['full-bleed', 'full-height-sections', 'parallax-ready', 'layered-content', 'cinematic'],
    intensity: 0.9,
  },
  {
    id: 'modular',
    name: 'Modular Blocks',
    category: 'layout',
    features: ['distinct-sections', 'color-blocking', 'geometric-shapes', 'clear-boundaries', 'stacked'],
    intensity: 0.7,
  },
  
  // Typography styles
  {
    id: 'display-typography',
    name: 'Display Typography',
    category: 'typography',
    features: ['oversized-headings', 'variable-fonts', 'text-as-image', 'creative-spacing', 'mix-blend-modes'],
    intensity: 0.85,
  },
  {
    id: 'technical',
    name: 'Technical',
    category: 'typography',
    features: ['monospace-elements', 'tabular-numbers', 'code-blocks', 'system-fonts', 'precise-spacing'],
    intensity: 0.6,
  },
  {
    id: 'elegant',
    name: 'Elegant Serif',
    category: 'typography',
    features: ['serif-headings', 'careful-kerning', 'generous-line-height', 'hierarchy-contrast', 'classic-proportions'],
    intensity: 0.7,
  },
  {
    id: 'playful',
    name: 'Playful',
    category: 'typography',
    features: ['rounded-fonts', 'bouncy-text', 'colorful-letters', 'emoji-integration', 'casual-tone'],
    intensity: 0.8,
  },
  
  // Color styles
  {
    id: 'monochrome',
    name: 'Monochrome',
    category: 'color',
    features: ['single-hue', 'gradient-accents', 'high-contrast', 'subtle-variations', 'focus-on-content'],
    intensity: 0.6,
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    category: 'color',
    features: ['bold-colors', 'gradient-overlays', 'neon-accents', 'color-blocking', 'high-saturation'],
    intensity: 0.9,
  },
  {
    id: 'earth',
    name: 'Earth Tones',
    category: 'color',
    features: ['natural-colors', 'warm-browns', 'sage-greens', 'terracotta', 'organic-feel'],
    intensity: 0.7,
  },
  {
    id: 'futuristic',
    name: 'Futuristic',
    category: 'color',
    features: ['cyberpunk', 'dark-backgrounds', 'electric-accents', 'holographic-effects', 'neon-glows'],
    intensity: 0.85,
  },
  {
    id: 'pastel',
    name: 'Pastel Dream',
    category: 'color',
    features: ['soft-colors', 'low-saturation', 'gradient-mesh', 'airy-feel', 'gentle-transitions'],
    intensity: 0.65,
  },
  
  // Effect styles
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    category: 'effects',
    features: ['backdrop-blur', 'transparency', 'subtle-borders', 'frosted-glass', 'depth-layers'],
    intensity: 0.7,
  },
  {
    id: 'neumorphism',
    name: 'Neumorphism',
    category: 'effects',
    features: ['soft-shadows', 'subtle-gradients', 'inset-elements', 'tactile-appearance', 'monochromatic'],
    intensity: 0.6,
  },
  {
    id: 'gradient-mesh',
    name: 'Gradient Mesh',
    category: 'effects',
    features: ['complex-gradients', 'color-flow', 'organic-shapes', 'animated-gradients', 'vibrant-backgrounds'],
    intensity: 0.8,
  },
  {
    id: 'noise-grain',
    name: 'Noise & Grain',
    category: 'effects',
    features: ['texture-overlay', 'film-grain', 'vintage-feel', 'analog-warmth', 'tactile-texture'],
    intensity: 0.5,
  },
  {
    id: 'aurora',
    name: 'Aurora Effects',
    category: 'effects',
    features: ['flowing-gradients', 'ethereal-glow', 'shimmer-effects', 'color-waves', 'dreamy-atmosphere'],
    intensity: 0.85,
  },
  {
    id: 'particles',
    name: 'Particle Systems',
    category: 'effects',
    features: ['floating-elements', 'interactive-particles', 'depth-parallax', 'sparkle-effects', 'dynamic-backgrounds'],
    intensity: 0.75,
  },
  
  // Interaction styles
  {
    id: 'micro-interactions',
    name: 'Micro-interactions',
    category: 'interaction',
    features: ['subtle-feedback', 'state-transitions', 'button-animations', 'hover-effects', 'delightful-details'],
    intensity: 0.8,
  },
  {
    id: 'scroll-driven',
    name: 'Scroll-driven',
    category: 'interaction',
    features: ['parallax-scrolling', 'scroll-triggered', 'progress-animations', 'sticky-elements', 'reveal-effects'],
    intensity: 0.9,
  },
  {
    id: 'cursor-effects',
    name: 'Cursor Effects',
    category: 'interaction',
    features: ['custom-cursor', 'magnetic-buttons', 'cursor-trail', 'hover-magnify', 'interactive-elements'],
    intensity: 0.7,
  },
  {
    id: 'physics',
    name: 'Physics-based',
    category: 'interaction',
    features: ['spring-animations', 'draggable-elements', 'momentum-scrolling', 'collision-effects', 'natural-motion'],
    intensity: 0.85,
  },
];

// ============================================================================
// STYLE FEATURES LIBRARY
// ============================================================================

const STYLE_FEATURES: StyleFeature[] = [
  // Border features
  {
    id: 'gradient-border',
    name: 'Gradient Border',
    category: 'borders',
    implementation: 'pseudo-element with animated gradient background',
    cssProperties: {
      position: 'relative',
      borderRadius: 'inherit',
    },
  },
  {
    id: 'clay-border',
    name: 'Clay Border',
    category: 'borders',
    implementation: 'soft rounded corners with inner shadow',
    cssProperties: {
      borderRadius: '2rem',
      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 8px rgba(0,0,0,0.1)',
    },
  },
  {
    id: 'brutalist-border',
    name: 'Brutalist Border',
    category: 'borders',
    implementation: 'thick black border with hard shadow',
    cssProperties: {
      border: '3px solid black',
      boxShadow: '4px 4px 0 0 black',
    },
  },
  
  // Animation features
  {
    id: 'reveal-up',
    name: 'Reveal Up',
    category: 'animations',
    implementation: 'translateY with opacity fade',
    cssProperties: {
      animation: 'revealUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    },
  },
  {
    id: 'text-scramble',
    name: 'Text Scramble',
    category: 'animations',
    implementation: 'character-by-character text animation',
  },
  {
    id: 'morphing',
    name: 'Shape Morphing',
    category: 'animations',
    implementation: 'SVG path morphing or border-radius animation',
  },
  {
    id: '3d-tilt',
    name: '3D Tilt',
    category: 'animations',
    implementation: 'perspective transform on hover',
    cssProperties: {
      transformStyle: 'preserve-3d',
      transform: 'perspective(1000px) rotateX(var(--rotateX)) rotateY(var(--rotateY))',
    },
  },
  
  // Effect features
  {
    id: 'spotlight',
    name: 'Spotlight Effect',
    category: 'effects',
    implementation: 'radial gradient following cursor',
  },
  {
    id: 'glow-hover',
    name: 'Glow on Hover',
    category: 'effects',
    implementation: 'box-shadow transition on hover',
    cssProperties: {
      transition: 'box-shadow 0.3s ease',
    },
  },
  {
    id: 'magnetic',
    name: 'Magnetic Effect',
    category: 'effects',
    implementation: 'element follows cursor within radius',
  },
  {
    id: 'liquid',
    name: 'Liquid Effect',
    category: 'effects',
    implementation: 'SVG filter with turbulence',
  },
  
  // Layout features
  {
    id: 'broken-grid',
    name: 'Broken Grid',
    category: 'layout',
    implementation: 'elements break out of container bounds',
    cssProperties: {
      position: 'relative',
    },
  },
  {
    id: 'overlapping',
    name: 'Overlapping Elements',
    category: 'layout',
    implementation: 'negative margins and z-index layering',
  },
  {
    id: 'sticky-stack',
    name: 'Sticky Stack',
    category: 'layout',
    implementation: 'cards stack on scroll with sticky positioning',
  },
  {
    id: 'horizontal-scroll',
    name: 'Horizontal Scroll Section',
    category: 'layout',
    implementation: 'transform vertical scroll to horizontal movement',
  },
];

// ============================================================================
// STYLE MIXER CLASS
// ============================================================================

export class StyleMixer {
  private seed: number;
  private random: ReturnType<typeof seededRandom>;
  
  constructor(seed: number) {
    this.seed = seed;
    this.random = seededRandom(seed);
  }
  
  /**
   * Mix multiple styles to create a unique style profile
   */
  mixStyles(count: number = 2): StyleProfile {
    // Select base styles from different categories
    const categories = ['layout', 'typography', 'color', 'effects', 'interaction'] as const;
    const selectedStyles: BaseStyle[] = [];
    
    categories.forEach(category => {
      const stylesInCategory = BASE_STYLES.filter(s => s.category === category);
      if (stylesInCategory.length > 0 && this.random.random() > 0.3) {
        const style = this.random.choice(stylesInCategory);
        selectedStyles.push(style);
      }
    });
    
    // Add random additional styles
    const remainingSlots = count - selectedStyles.length;
    for (let i = 0; i < remainingSlots; i++) {
      const style = this.random.choice(BASE_STYLES);
      if (!selectedStyles.find(s => s.id === style.id)) {
        selectedStyles.push(style);
      }
    }
    
    // Generate features based on selected styles
    const features = this.deriveFeatures(selectedStyles);
    
    // Generate design tokens
    const tokens = generateDesignTokens(this.seed);
    
    // Create style overrides based on selected styles
    const overrides = this.generateOverrides(selectedStyles);
    
    // Create profile ID
    const id = `style-${this.seed}-${Date.now()}`;
    
    return {
      id,
      name: this.generateProfileName(selectedStyles),
      description: this.generateDescription(selectedStyles),
      baseStyles: selectedStyles,
      features,
      tokens,
      overrides,
    };
  }
  
  /**
   * Derive specific features from selected base styles
   */
  private deriveFeatures(styles: BaseStyle[]): StyleFeature[] {
    const features: StyleFeature[] = [];
    const featurePool = [...STYLE_FEATURES];
    
    styles.forEach(style => {
      // Match features based on style characteristics
      style.features.forEach(featureId => {
        const matchingFeature = featurePool.find(f => 
          f.id.includes(featureId) || 
          f.name.toLowerCase().includes(featureId)
        );
        if (matchingFeature && !features.find(f => f.id === matchingFeature.id)) {
          features.push(matchingFeature);
        }
      });
    });
    
    // Add some random features
    const additionalCount = this.random.int(2, 4);
    const shuffled = this.random.shuffle(featurePool);
    for (let i = 0; i < additionalCount && features.length < 10; i++) {
      const feature = shuffled[i];
      if (!features.find(f => f.id === feature.id)) {
        features.push(feature);
      }
    }
    
    return features;
  }
  
  /**
   * Generate style overrides based on selected styles
   */
  private generateOverrides(styles: BaseStyle[]): StyleOverrides {
    const overrides: StyleOverrides = {};
    
    styles.forEach(style => {
      switch (style.id) {
        case 'brutalist':
          overrides.borderRadius = 'none';
          overrides.shadows = 'heavy';
          break;
        case 'minimal':
          overrides.borderRadius = 'subtle';
          overrides.shadows = 'none';
          overrides.spacing = 'spacious';
          break;
        case 'glassmorphism':
          overrides.borderRadius = 'medium';
          overrides.shadows = 'minimal';
          break;
        case 'neumorphism':
          overrides.borderRadius = 'heavy';
          overrides.shadows = 'minimal';
          break;
        case 'futuristic':
          overrides.borderRadius = 'subtle';
          overrides.shadows = 'glow';
          overrides.animations = 'dramatic';
          break;
        case 'playful':
          overrides.borderRadius = 'heavy';
          overrides.animations = 'medium';
          break;
        case 'elegant':
          overrides.typography = 'expressive';
          overrides.spacing = 'spacious';
          break;
      }
    });
    
    return overrides;
  }
  
  /**
   * Generate a name for the style profile
   */
  private generateProfileName(styles: BaseStyle[]): string {
    const primary = styles[0];
    const secondary = styles[1];
    
    if (primary && secondary) {
      return `${primary.name} ${secondary.name}`;
    }
    return primary?.name || 'Custom Style';
  }
  
  /**
   * Generate a description of the style
   */
  private generateDescription(styles: BaseStyle[]): string {
    const features = styles.flatMap(s => s.features).slice(0, 5);
    return `A unique blend featuring ${features.join(', ')}`;
  }
  
  /**
   * Generate CSS from style profile
   */
  generateCSS(profile: StyleProfile): string {
    const lines: string[] = [
      `/* Style Profile: ${profile.name} */`,
      `/* Generated with seed: ${this.seed} */`,
      '',
      ':root {',
    ];
    
    // Add token CSS variables
    lines.push(tokensToCSS(profile.tokens));
    
    lines.push('}');
    lines.push('');
    
    // Add style-specific CSS
    profile.features.forEach(feature => {
      if (feature.cssProperties) {
        lines.push(`.${feature.id} {`);
        Object.entries(feature.cssProperties).forEach(([prop, value]) => {
          lines.push(`  ${prop}: ${value};`);
        });
        lines.push('}');
        lines.push('');
      }
    });
    
    return lines.join('\n');
  }
  
  /**
   * Get Tailwind config for style
   */
  generateTailwindConfig(profile: StyleProfile): object {
    return {
      theme: {
        extend: {
          // Extend based on profile features
          borderRadius: this.getBorderRadiusConfig(profile.overrides.borderRadius),
          boxShadow: this.getShadowConfig(profile.overrides.shadows),
          transitionTimingFunction: {
            'style-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
            'style-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          },
        },
      },
    };
  }
  
  private getBorderRadiusConfig(radius?: string): Record<string, string> {
    switch (radius) {
      case 'none':
        return { 'style-sm': '0', 'style-md': '0', 'style-lg': '0' };
      case 'subtle':
        return { 'style-sm': '2px', 'style-md': '4px', 'style-lg': '8px' };
      case 'medium':
        return { 'style-sm': '4px', 'style-md': '8px', 'style-lg': '16px' };
      case 'heavy':
        return { 'style-sm': '8px', 'style-md': '16px', 'style-lg': '24px' };
      case 'pill':
        return { 'style-sm': '9999px', 'style-md': '9999px', 'style-lg': '9999px' };
      default:
        return { 'style-sm': '4px', 'style-md': '8px', 'style-lg': '16px' };
    }
  }
  
  private getShadowConfig(shadow?: string): Record<string, string> {
    switch (shadow) {
      case 'none':
        return { 'style': 'none' };
      case 'minimal':
        return { 'style': '0 1px 2px 0 rgb(0 0 0 / 0.05)' };
      case 'medium':
        return { 'style': '0 4px 6px -1px rgb(0 0 0 / 0.1)' };
      case 'heavy':
        return { 'style': '0 20px 25px -5px rgb(0 0 0 / 0.2)' };
      case 'glow':
        return { 'style': '0 0 20px rgba(var(--color-primary), 0.5)' };
      default:
        return { 'style': '0 4px 6px -1px rgb(0 0 0 / 0.1)' };
    }
  }
}

// Simple seeded random implementation
function seededRandom(seed: number) {
  let s = seed;
  
  function next(): number {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  }
  
  return {
    random: next,
    choice: <T>(arr: T[]): T => arr[Math.floor(next() * arr.length)],
    shuffle: <T>(arr: T[]): T[] => {
      const result = [...arr];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    },
    int: (min: number, max: number): number => Math.floor(next() * (max - min + 1)) + min,
    sample: <T>(arr: T[], count: number): T[] => {
      const shuffled = [...arr].sort(() => next() - 0.5);
      return shuffled.slice(0, count);
    },
  };
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

export function createStyleMixer(seed: number): StyleMixer {
  return new StyleMixer(seed);
}

export function mixStyles(seed: number, styleCount: number = 3): StyleProfile {
  const mixer = new StyleMixer(seed);
  return mixer.mixStyles(styleCount);
}

export function getAllBaseStyles(): BaseStyle[] {
  return [...BASE_STYLES];
}

export function getAllStyleFeatures(): StyleFeature[] {
  return [...STYLE_FEATURES];
}

export { BASE_STYLES, STYLE_FEATURES };
