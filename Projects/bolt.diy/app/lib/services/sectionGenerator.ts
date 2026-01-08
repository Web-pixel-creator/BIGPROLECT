/**
 * Section Generator - Modular code generation for website sections
 * 
 * Instead of generating entire App.tsx at once, this module:
 * 1. Plans which sections are needed
 * 2. Generates each section independently
 * 3. Composes them into final App.tsx
 * 
 * Benefits:
 * - Smaller LLM context per generation
 * - Easier to validate and fix individual sections
 * - Better code quality through focused prompts
 */

import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('SectionGenerator');

/**
 * Standard website sections that can be generated independently.
 */
export type SectionType =
  | 'hero'
  | 'navigation'
  | 'features'
  | 'pricing'
  | 'testimonials'
  | 'gallery'
  | 'cta'
  | 'faq'
  | 'contact'
  | 'footer'
  | 'about'
  | 'team'
  | 'stats'
  | 'blog'
  | 'services';

export interface SectionDefinition {
  type: SectionType;
  name: string;
  description: string;
  requiredProps: string[];
  optionalProps: string[];
  defaultExport: boolean;
}

/**
 * Section definitions with metadata for generation.
 */
export const SECTION_DEFINITIONS: Record<SectionType, SectionDefinition> = {
  hero: {
    type: 'hero',
    name: 'HeroSection',
    description: 'Main hero banner with headline, subheadline, and CTA buttons',
    requiredProps: ['title', 'subtitle'],
    optionalProps: ['ctaText', 'ctaLink', 'backgroundImage'],
    defaultExport: false,
  },
  navigation: {
    type: 'navigation',
    name: 'Navigation',
    description: 'Top navigation bar with logo and menu items',
    requiredProps: ['logo'],
    optionalProps: ['menuItems', 'ctaButton'],
    defaultExport: false,
  },
  features: {
    type: 'features',
    name: 'FeaturesSection',
    description: 'Grid of feature cards highlighting key benefits',
    requiredProps: ['features'],
    optionalProps: ['title', 'subtitle', 'columns'],
    defaultExport: false,
  },
  pricing: {
    type: 'pricing',
    name: 'PricingSection',
    description: 'Pricing plans comparison with tiers',
    requiredProps: ['plans'],
    optionalProps: ['title', 'subtitle', 'currency'],
    defaultExport: false,
  },
  testimonials: {
    type: 'testimonials',
    name: 'TestimonialsSection',
    description: 'Customer testimonials and reviews',
    requiredProps: ['testimonials'],
    optionalProps: ['title', 'layout'],
    defaultExport: false,
  },
  gallery: {
    type: 'gallery',
    name: 'GallerySection',
    description: 'Image gallery or portfolio showcase',
    requiredProps: ['images'],
    optionalProps: ['title', 'columns', 'lightbox'],
    defaultExport: false,
  },
  cta: {
    type: 'cta',
    name: 'CTASection',
    description: 'Call-to-action section with prominent button',
    requiredProps: ['title', 'buttonText'],
    optionalProps: ['subtitle', 'buttonLink', 'background'],
    defaultExport: false,
  },
  faq: {
    type: 'faq',
    name: 'FAQSection',
    description: 'Frequently asked questions with accordion',
    requiredProps: ['questions'],
    optionalProps: ['title', 'subtitle'],
    defaultExport: false,
  },
  contact: {
    type: 'contact',
    name: 'ContactSection',
    description: 'Contact form with fields',
    requiredProps: [],
    optionalProps: ['title', 'subtitle', 'email', 'phone', 'address'],
    defaultExport: false,
  },
  footer: {
    type: 'footer',
    name: 'Footer',
    description: 'Site footer with links and copyright',
    requiredProps: [],
    optionalProps: ['logo', 'links', 'social', 'copyright'],
    defaultExport: false,
  },
  about: {
    type: 'about',
    name: 'AboutSection',
    description: 'About us section with company story',
    requiredProps: ['content'],
    optionalProps: ['title', 'image', 'stats'],
    defaultExport: false,
  },
  team: {
    type: 'team',
    name: 'TeamSection',
    description: 'Team members grid with photos and bios',
    requiredProps: ['members'],
    optionalProps: ['title', 'subtitle'],
    defaultExport: false,
  },
  stats: {
    type: 'stats',
    name: 'StatsSection',
    description: 'Statistics and metrics display',
    requiredProps: ['stats'],
    optionalProps: ['title', 'animated'],
    defaultExport: false,
  },
  blog: {
    type: 'blog',
    name: 'BlogSection',
    description: 'Blog posts preview grid',
    requiredProps: ['posts'],
    optionalProps: ['title', 'showMore'],
    defaultExport: false,
  },
  services: {
    type: 'services',
    name: 'ServicesSection',
    description: 'Services offered with descriptions',
    requiredProps: ['services'],
    optionalProps: ['title', 'subtitle', 'layout'],
    defaultExport: false,
  },
};


/**
 * Section plan - result of analyzing user prompt.
 */
export interface SectionPlan {
  sections: SectionType[];
  theme: 'light' | 'dark' | 'auto';
  style: 'modern' | 'minimal' | 'corporate' | 'playful';
  colorScheme?: string;
  projectName: string;
  projectDescription: string;
}

/**
 * Generated section with code and metadata.
 */
export interface GeneratedSection {
  type: SectionType;
  componentName: string;
  code: string;
  imports: string[];
  valid: boolean;
}

/**
 * Keywords that indicate specific sections should be included.
 */
const SECTION_KEYWORDS: Record<SectionType, string[]> = {
  hero: ['hero', 'banner', 'landing', 'главная', 'баннер', 'заголовок'],
  navigation: ['nav', 'menu', 'header', 'навигация', 'меню', 'шапка'],
  features: ['features', 'benefits', 'функции', 'преимущества', 'возможности'],
  pricing: ['pricing', 'plans', 'subscription', 'цены', 'тарифы', 'подписка', 'ценами'],
  testimonials: ['testimonials', 'reviews', 'отзыв', 'рекомендации'],
  gallery: ['gallery', 'portfolio', 'images', 'галерея', 'портфолио'],
  cta: ['cta', 'call to action', 'signup', 'призыв', 'регистрация'],
  faq: ['faq', 'questions', 'вопросы', 'чаво'],
  contact: ['contact', 'form', 'контакты', 'форма', 'связь'],
  footer: ['footer', 'подвал', 'футер'],
  about: ['about', 'story', 'о нас', 'история', 'компания'],
  team: ['team', 'members', 'команда', 'сотрудники'],
  stats: ['stats', 'numbers', 'metrics', 'статистика', 'цифры'],
  blog: ['blog', 'articles', 'news', 'блог', 'статьи', 'новости'],
  services: ['services', 'offerings', 'услуги', 'сервисы'],
};

/**
 * Default section sets for common website types.
 */
const WEBSITE_PRESETS: Record<string, SectionType[]> = {
  landing: ['navigation', 'hero', 'features', 'cta', 'footer'],
  saas: ['navigation', 'hero', 'features', 'pricing', 'testimonials', 'faq', 'cta', 'footer'],
  portfolio: ['navigation', 'hero', 'gallery', 'about', 'contact', 'footer'],
  business: ['navigation', 'hero', 'services', 'about', 'team', 'contact', 'footer'],
  ecommerce: ['navigation', 'hero', 'features', 'gallery', 'testimonials', 'cta', 'footer'],
  blog: ['navigation', 'hero', 'blog', 'about', 'contact', 'footer'],
  startup: ['navigation', 'hero', 'features', 'stats', 'pricing', 'testimonials', 'cta', 'footer'],
};

/**
 * Analyze user prompt and determine which sections are needed.
 */
export function planSections(userPrompt: string): SectionPlan {
  const promptLower = userPrompt.toLowerCase();
  const detectedSections = new Set<SectionType>();

  // Detect website type preset
  let preset: SectionType[] | null = null;
  for (const [type, sections] of Object.entries(WEBSITE_PRESETS)) {
    if (promptLower.includes(type)) {
      preset = sections;
      break;
    }
  }

  // Detect individual sections from keywords
  for (const [sectionType, keywords] of Object.entries(SECTION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (promptLower.includes(keyword)) {
        detectedSections.add(sectionType as SectionType);
        break;
      }
    }
  }

  // Use preset if no specific sections detected, or merge with detected
  let finalSections: SectionType[];
  if (detectedSections.size === 0 && preset) {
    finalSections = preset;
  } else if (detectedSections.size === 0) {
    // Default minimal landing page
    finalSections = ['navigation', 'hero', 'features', 'footer'];
  } else {
    // Ensure navigation and footer are always included
    detectedSections.add('navigation');
    detectedSections.add('footer');
    
    // Sort sections in logical order
    const sectionOrder: SectionType[] = [
      'navigation', 'hero', 'features', 'services', 'about', 'stats',
      'gallery', 'team', 'pricing', 'testimonials', 'blog', 'faq',
      'cta', 'contact', 'footer'
    ];
    finalSections = sectionOrder.filter(s => detectedSections.has(s));
  }

  // Detect theme
  let theme: 'light' | 'dark' | 'auto' = 'light';
  if (promptLower.includes('dark') || promptLower.includes('тёмн') || promptLower.includes('темн')) {
    theme = 'dark';
  }

  // Detect style
  let style: 'modern' | 'minimal' | 'corporate' | 'playful' = 'modern';
  if (promptLower.includes('minimal') || promptLower.includes('минимал')) {
    style = 'minimal';
  } else if (promptLower.includes('corporate') || promptLower.includes('корпоратив')) {
    style = 'corporate';
  } else if (promptLower.includes('playful') || promptLower.includes('игрив') || promptLower.includes('весёл')) {
    style = 'playful';
  }

  // Extract project name (simple heuristic)
  const nameMatch = userPrompt.match(/(?:called?|named?|для|название)\s+["']?([A-Za-zА-Яа-я0-9\s]+)["']?/i);
  const projectName = nameMatch ? nameMatch[1].trim() : 'MyApp';

  logger.debug(`Planned sections: ${finalSections.join(', ')}`);

  return {
    sections: finalSections,
    theme,
    style,
    projectName,
    projectDescription: userPrompt.slice(0, 200),
  };
}

/**
 * Generate a focused prompt for a single section.
 */
export function generateSectionPrompt(
  sectionType: SectionType,
  plan: SectionPlan,
  context?: { previousSections?: string[]; colorScheme?: string }
): string {
  const definition = SECTION_DEFINITIONS[sectionType];
  
  const styleGuide = {
    modern: 'Use modern design with gradients, shadows, and smooth animations. Rounded corners, clean typography.',
    minimal: 'Use minimal design with lots of whitespace, simple colors, and subtle interactions.',
    corporate: 'Use professional corporate design with structured layouts, formal typography, and trust-building elements.',
    playful: 'Use playful design with vibrant colors, fun animations, and engaging micro-interactions.',
  };

  const themeColors = plan.theme === 'dark' 
    ? 'Use dark background (slate-900/950) with light text. Accent colors should be vibrant.'
    : 'Use light background (white/gray-50) with dark text. Accent colors should be professional.';

  return `Generate a React ${definition.name} component for "${plan.projectName}".

SECTION TYPE: ${sectionType}
DESCRIPTION: ${definition.description}

STYLE REQUIREMENTS:
- Theme: ${plan.theme}
- Style: ${plan.style}
- ${styleGuide[plan.style]}
- ${themeColors}

TECHNICAL REQUIREMENTS:
- Use TypeScript with proper types
- Use Tailwind CSS for styling
- Component should be self-contained
- Export as named export: export function ${definition.name}()
- Use Lucide React icons if needed
- Make it responsive (mobile-first)
- Include hover states and transitions

PROJECT CONTEXT:
${plan.projectDescription}

${context?.previousSections?.length ? `
PREVIOUS SECTIONS (for style consistency):
${context.previousSections.join(', ')}
` : ''}

Generate ONLY the component code, no explanations.`;
}

/**
 * Compose multiple sections into a single App.tsx file.
 */
export function composeSections(
  sections: GeneratedSection[],
  plan: SectionPlan
): string {
  // Collect all unique imports
  const allImports = new Set<string>();
  allImports.add("import React from 'react';");

  for (const section of sections) {
    for (const imp of section.imports) {
      allImports.add(imp);
    }
  }

  // Build component imports (internal)
  const componentImports = sections
    .map(s => `import { ${s.componentName} } from './components/${s.componentName}';`)
    .join('\n');

  // Build the App component
  const sectionUsage = sections
    .map(s => `      <${s.componentName} />`)
    .join('\n');

  const appCode = `${Array.from(allImports).join('\n')}
${componentImports}

export default function App() {
  return (
    <div className="min-h-screen ${plan.theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-gray-900'}">
${sectionUsage}
    </div>
  );
}
`;

  return appCode;
}

/**
 * Extract imports from generated section code.
 */
export function extractImports(code: string): string[] {
  const imports: string[] = [];
  const lines = code.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('import ')) {
      // Skip React import (will be added in compose)
      if (!trimmed.includes("from 'react'") && !trimmed.includes('from "react"')) {
        imports.push(trimmed);
      }
    }
  }

  return imports;
}

/**
 * Extract component name from generated code.
 */
export function extractComponentName(code: string, fallback: string): string {
  // Try to find export function Name
  const exportMatch = code.match(/export\s+(?:function|const)\s+([A-Z][A-Za-z0-9]*)/);
  if (exportMatch) {
    return exportMatch[1];
  }

  // Try to find function Name
  const funcMatch = code.match(/function\s+([A-Z][A-Za-z0-9]*)\s*\(/);
  if (funcMatch) {
    return funcMatch[1];
  }

  return fallback;
}

/**
 * Remove imports from code (for section files that will be composed).
 */
export function stripImports(code: string): string {
  const lines = code.split('\n');
  const nonImportLines: string[] = [];
  let pastImports = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!pastImports && trimmed.startsWith('import ')) {
      continue;
    }
    if (!pastImports && trimmed === '') {
      continue;
    }
    pastImports = true;
    nonImportLines.push(line);
  }

  return nonImportLines.join('\n');
}

/**
 * Validate that a section has required structure.
 */
export function validateSection(code: string, sectionType: SectionType): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const definition = SECTION_DEFINITIONS[sectionType];

  // Check for export
  if (!code.includes('export ')) {
    issues.push('Missing export statement');
  }

  // Check for function/const component
  if (!code.match(/(?:function|const)\s+[A-Z]/)) {
    issues.push('No React component found (should start with capital letter)');
  }

  // Check for return with JSX
  if (!code.includes('return') || !code.includes('<')) {
    issues.push('Component does not return JSX');
  }

  // Check for Tailwind classes (basic check)
  if (!code.includes('className=')) {
    issues.push('No Tailwind CSS classes found');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Get section generation order (some sections depend on others for style consistency).
 */
export function getSectionOrder(sections: SectionType[]): SectionType[] {
  // Navigation first (sets the tone), then hero, then others, footer last
  const priority: Record<SectionType, number> = {
    navigation: 0,
    hero: 1,
    features: 2,
    services: 2,
    about: 3,
    stats: 3,
    gallery: 4,
    team: 4,
    pricing: 5,
    testimonials: 5,
    blog: 6,
    faq: 6,
    cta: 7,
    contact: 7,
    footer: 8,
  };

  return [...sections].sort((a, b) => priority[a] - priority[b]);
}
