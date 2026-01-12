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
import {
  SECTION_KEYWORDS,
  SECTION_DEFINITIONS,
  WEBSITE_PRESETS,
  SECTION_PRIORITY,
  type SectionType,
  type SectionDefinition,
} from './prompt-data';

const logger = createScopedLogger('SectionGenerator');

// Re-export types for consumers
export type { SectionType, SectionDefinition };
export { SECTION_DEFINITIONS };

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
    // Only process known section types
    if (!(sectionType in SECTION_DEFINITIONS)) {
      continue;
    }

    for (const keyword of keywords) {
      if (promptLower.includes(keyword.toLowerCase())) {
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

    // Sort sections by priority
    finalSections = Array.from(detectedSections).sort(
      (a, b) => (SECTION_PRIORITY[a] ?? 99) - (SECTION_PRIORITY[b] ?? 99),
    );
  }

  // Detect theme
  let theme: 'light' | 'dark' | 'auto' = 'light';

  if (promptLower.includes('dark') || promptLower.includes('\u0442\u0451\u043c\u043d') || promptLower.includes('\u0442\u0435\u043c\u043d')) {
    theme = 'dark';
  }

  // Detect style
  let style: 'modern' | 'minimal' | 'corporate' | 'playful' = 'modern';

  if (promptLower.includes('minimal') || promptLower.includes('\u043c\u0438\u043d\u0438\u043c\u0430\u043b')) {
    style = 'minimal';
  } else if (promptLower.includes('corporate') || promptLower.includes('\u043a\u043e\u0440\u043f\u043e\u0440\u0430\u0442\u0438\u0432')) {
    style = 'corporate';
  } else if (promptLower.includes('playful') || promptLower.includes('\u0438\u0433\u0440\u0438\u0432') || promptLower.includes('\u0432\u0435\u0441\u0451\u043b')) {
    style = 'playful';
  }

  // Extract project name (simple heuristic)
  const nameMatch = userPrompt.match(/(?:called?|named?|\u0434\u043b\u044f|\u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435)\s+["']?([A-Za-z\u0410-\u042f\u0430-\u044f0-9\s]+)["']?/i);
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
  context?: { previousSections?: string[]; colorScheme?: string },
): string {
  const definition = SECTION_DEFINITIONS[sectionType];

  const styleGuide = {
    modern: 'Use modern design with gradients, shadows, and smooth animations. Rounded corners, clean typography.',
    minimal: 'Use minimal design with lots of whitespace, simple colors, and subtle interactions.',
    corporate:
      'Use professional corporate design with structured layouts, formal typography, and trust-building elements.',
    playful: 'Use playful design with vibrant colors, fun animations, and engaging micro-interactions.',
  };

  const themeColors =
    plan.theme === 'dark'
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

${
  context?.previousSections?.length
    ? `
PREVIOUS SECTIONS (for style consistency):
${context.previousSections.join(', ')}
`
    : ''
}

Generate ONLY the component code, no explanations.`;
}

/**
 * Compose multiple sections into a single App.tsx file.
 */
export function composeSections(sections: GeneratedSection[], plan: SectionPlan): string {
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
    .map((s) => `import { ${s.componentName} } from './components/${s.componentName}';`)
    .join('\n');

  // Build the App component
  const sectionUsage = sections.map((s) => `      <${s.componentName} />`).join('\n');

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
export function validateSection(
  code: string,
  sectionType: SectionType,
): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

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
  return [...sections].sort((a, b) => (SECTION_PRIORITY[a] ?? 99) - (SECTION_PRIORITY[b] ?? 99));
}
