/**
 * Tests for Section Generator module
 */

import { describe, it, expect } from 'vitest';
import {
  planSections,
  generateSectionPrompt,
  composeSections,
  extractImports,
  extractComponentName,
  stripImports,
  validateSection,
  getSectionOrder,
  SECTION_DEFINITIONS,
  type SectionPlan,
  type GeneratedSection,
  type SectionType,
} from './sectionGenerator';

describe('sectionGenerator', () => {
  describe('planSections', () => {
    it('detects landing page preset', () => {
      const plan = planSections('Create a landing page for my startup');
      expect(plan.sections).toContain('navigation');
      expect(plan.sections).toContain('hero');
      expect(plan.sections).toContain('footer');
    });

    it('detects SaaS preset', () => {
      const plan = planSections('Build a SaaS website');
      expect(plan.sections).toContain('pricing');
      expect(plan.sections).toContain('features');
      expect(plan.sections).toContain('testimonials');
    });

    it('detects individual sections from keywords', () => {
      const plan = planSections('I need a page with testimonials and FAQ');
      expect(plan.sections).toContain('testimonials');
      expect(plan.sections).toContain('faq');
    });

    it('detects Russian keywords', () => {
      const plan = planSections('Сделай страницу с отзывами клиентов');
      expect(plan.sections).toContain('testimonials');
    });

    it('always includes navigation and footer', () => {
      const plan = planSections('Just a simple page with features');
      expect(plan.sections).toContain('navigation');
      expect(plan.sections).toContain('footer');
    });

    it('detects dark theme', () => {
      const plan = planSections('Create a dark themed landing page');
      expect(plan.theme).toBe('dark');
    });

    it('detects dark theme in Russian', () => {
      const plan = planSections('Сделай тёмную тему для сайта');
      expect(plan.theme).toBe('dark');
    });

    it('detects minimal style', () => {
      const plan = planSections('Create a minimal portfolio site');
      expect(plan.style).toBe('minimal');
    });

    it('detects corporate style', () => {
      const plan = planSections('Build a corporate business website');
      expect(plan.style).toBe('corporate');
    });

    it('extracts project name', () => {
      const plan = planSections('Create a landing page called "TechFlow"');
      expect(plan.projectName).toBe('TechFlow');
    });

    it('uses default sections when no keywords match', () => {
      const plan = planSections('Make something cool');
      expect(plan.sections.length).toBeGreaterThan(0);
      expect(plan.sections).toContain('navigation');
    });

    it('returns default project name when not specified', () => {
      const plan = planSections('Create a website');
      expect(plan.projectName).toBe('MyApp');
    });
  });

  describe('generateSectionPrompt', () => {
    const basePlan: SectionPlan = {
      sections: ['hero', 'features'],
      theme: 'light',
      style: 'modern',
      projectName: 'TestApp',
      projectDescription: 'A test application',
    };

    it('generates prompt for hero section', () => {
      const prompt = generateSectionPrompt('hero', basePlan);
      expect(prompt).toContain('HeroSection');
      expect(prompt).toContain('TestApp');
      expect(prompt).toContain('light');
    });

    it('includes style guide for modern style', () => {
      const prompt = generateSectionPrompt('features', basePlan);
      expect(prompt).toContain('modern design');
      expect(prompt).toContain('gradients');
    });

    it('includes dark theme colors', () => {
      const darkPlan = { ...basePlan, theme: 'dark' as const };
      const prompt = generateSectionPrompt('hero', darkPlan);
      expect(prompt).toContain('dark background');
      expect(prompt).toContain('slate-900');
    });

    it('includes previous sections context', () => {
      const prompt = generateSectionPrompt('features', basePlan, {
        previousSections: ['Navigation', 'HeroSection'],
      });
      expect(prompt).toContain('Navigation');
      expect(prompt).toContain('HeroSection');
    });

    it('includes technical requirements', () => {
      const prompt = generateSectionPrompt('pricing', basePlan);
      expect(prompt).toContain('TypeScript');
      expect(prompt).toContain('Tailwind CSS');
      expect(prompt).toContain('responsive');
    });
  });

  describe('composeSections', () => {
    const mockSections: GeneratedSection[] = [
      {
        type: 'navigation',
        componentName: 'Navigation',
        code: 'export function Navigation() { return <nav>Nav</nav>; }',
        imports: ["import { Menu } from 'lucide-react';"],
        valid: true,
      },
      {
        type: 'hero',
        componentName: 'HeroSection',
        code: 'export function HeroSection() { return <section>Hero</section>; }',
        imports: ["import { ArrowRight } from 'lucide-react';"],
        valid: true,
      },
    ];

    const plan: SectionPlan = {
      sections: ['navigation', 'hero'],
      theme: 'light',
      style: 'modern',
      projectName: 'TestApp',
      projectDescription: 'Test',
    };

    it('composes sections into App.tsx', () => {
      const result = composeSections(mockSections, plan);
      expect(result).toContain('export default function App()');
      expect(result).toContain('<Navigation />');
      expect(result).toContain('<HeroSection />');
    });

    it('includes React import', () => {
      const result = composeSections(mockSections, plan);
      expect(result).toContain("import React from 'react'");
    });

    it('includes component imports', () => {
      const result = composeSections(mockSections, plan);
      expect(result).toContain("import { Navigation } from './components/Navigation'");
      expect(result).toContain("import { HeroSection } from './components/HeroSection'");
    });

    it('deduplicates imports', () => {
      const sectionsWithDupeImports: GeneratedSection[] = [
        {
          type: 'navigation',
          componentName: 'Navigation',
          code: '',
          imports: ["import { Menu } from 'lucide-react';"],
          valid: true,
        },
        {
          type: 'hero',
          componentName: 'HeroSection',
          code: '',
          imports: ["import { Menu } from 'lucide-react';"],
          valid: true,
        },
      ];
      const result = composeSections(sectionsWithDupeImports, plan);
      const menuImportCount = (result.match(/import { Menu }/g) || []).length;
      expect(menuImportCount).toBe(1);
    });

    it('applies dark theme class', () => {
      const darkPlan = { ...plan, theme: 'dark' as const };
      const result = composeSections(mockSections, darkPlan);
      expect(result).toContain('bg-slate-950');
      expect(result).toContain('text-white');
    });

    it('applies light theme class', () => {
      const result = composeSections(mockSections, plan);
      expect(result).toContain('bg-white');
      expect(result).toContain('text-gray-900');
    });
  });

  describe('extractImports', () => {
    it('extracts import statements', () => {
      const code = `import { useState } from 'react';
import { Menu } from 'lucide-react';

export function Component() {}`;
      const imports = extractImports(code);
      expect(imports).toContain("import { Menu } from 'lucide-react';");
    });

    it('skips React imports', () => {
      const code = `import React from 'react';
import { useState } from 'react';
import { Menu } from 'lucide-react';`;
      const imports = extractImports(code);
      expect(imports).not.toContain("import React from 'react';");
      expect(imports).not.toContain("import { useState } from 'react';");
    });

    it('returns empty array for code without imports', () => {
      const code = 'export function Component() { return <div>Hello</div>; }';
      const imports = extractImports(code);
      expect(imports).toEqual([]);
    });
  });

  describe('extractComponentName', () => {
    it('extracts name from export function', () => {
      const code = 'export function HeroSection() { return <div />; }';
      expect(extractComponentName(code, 'Fallback')).toBe('HeroSection');
    });

    it('extracts name from export const', () => {
      const code = 'export const Navigation = () => { return <nav />; }';
      expect(extractComponentName(code, 'Fallback')).toBe('Navigation');
    });

    it('extracts name from function declaration', () => {
      const code = 'function MyComponent() { return <div />; }';
      expect(extractComponentName(code, 'Fallback')).toBe('MyComponent');
    });

    it('returns fallback when no component found', () => {
      const code = 'const x = 5;';
      expect(extractComponentName(code, 'DefaultName')).toBe('DefaultName');
    });
  });

  describe('stripImports', () => {
    it('removes import statements', () => {
      const code = `import React from 'react';
import { Menu } from 'lucide-react';

export function Component() {
  return <div>Hello</div>;
}`;
      const stripped = stripImports(code);
      expect(stripped).not.toContain('import');
      expect(stripped).toContain('export function Component');
    });

    it('preserves component code', () => {
      const code = `import { X } from 'y';

export function Test() {
  return <div className="test">Content</div>;
}`;
      const stripped = stripImports(code);
      expect(stripped).toContain('className="test"');
      expect(stripped).toContain('Content');
    });

    it('handles code without imports', () => {
      const code = 'export function Test() { return <div />; }';
      const stripped = stripImports(code);
      expect(stripped).toBe(code);
    });
  });

  describe('validateSection', () => {
    it('validates correct section code', () => {
      const code = `export function HeroSection() {
  return (
    <section className="py-20">
      <h1>Hello</h1>
    </section>
  );
}`;
      const result = validateSection(code, 'hero');
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('detects missing export', () => {
      const code = `function HeroSection() {
  return <div className="test">Hello</div>;
}`;
      const result = validateSection(code, 'hero');
      expect(result.valid).toBe(false);
      expect(result.issues).toContain('Missing export statement');
    });

    it('detects missing component', () => {
      const code = 'export const data = { name: "test" };';
      const result = validateSection(code, 'hero');
      expect(result.valid).toBe(false);
      expect(result.issues).toContain('No React component found (should start with capital letter)');
    });

    it('detects missing JSX return', () => {
      const code = 'export function HeroSection() { console.log("hi"); }';
      const result = validateSection(code, 'hero');
      expect(result.valid).toBe(false);
      expect(result.issues).toContain('Component does not return JSX');
    });

    it('detects missing Tailwind classes', () => {
      const code = `export function HeroSection() {
  return <div style={{ color: 'red' }}>Hello</div>;
}`;
      const result = validateSection(code, 'hero');
      expect(result.valid).toBe(false);
      expect(result.issues).toContain('No Tailwind CSS classes found');
    });
  });

  describe('getSectionOrder', () => {
    it('puts navigation first', () => {
      const sections: SectionType[] = ['hero', 'navigation', 'footer'];
      const ordered = getSectionOrder(sections);
      expect(ordered[0]).toBe('navigation');
    });

    it('puts footer last', () => {
      const sections: SectionType[] = ['footer', 'hero', 'navigation'];
      const ordered = getSectionOrder(sections);
      expect(ordered[ordered.length - 1]).toBe('footer');
    });

    it('maintains logical order', () => {
      const sections: SectionType[] = ['footer', 'pricing', 'hero', 'navigation', 'features'];
      const ordered = getSectionOrder(sections);
      expect(ordered).toEqual(['navigation', 'hero', 'features', 'pricing', 'footer']);
    });

    it('handles single section', () => {
      const sections: SectionType[] = ['hero'];
      const ordered = getSectionOrder(sections);
      expect(ordered).toEqual(['hero']);
    });
  });

  describe('SECTION_DEFINITIONS', () => {
    it('has all section types defined', () => {
      const expectedTypes: SectionType[] = [
        'hero',
        'navigation',
        'features',
        'pricing',
        'testimonials',
        'gallery',
        'cta',
        'faq',
        'contact',
        'footer',
        'about',
        'team',
        'stats',
        'blog',
        'logos',
        'marquee',
        'how-it-works',
        'comparison',
        'integration',
        'newsletter',
        'services',
      ];

      for (const type of expectedTypes) {
        expect(SECTION_DEFINITIONS[type]).toBeDefined();
        expect(SECTION_DEFINITIONS[type].name).toBeTruthy();
        expect(SECTION_DEFINITIONS[type].description).toBeTruthy();
      }
    });

    it('has unique component names', () => {
      const names = Object.values(SECTION_DEFINITIONS).map((d) => d.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });
  });
});
