/**
 * Tests for Section Contracts module
 */

import { describe, it, expect } from 'vitest';
import {
  getContractForSection,
  validateAgainstContract,
  getContractHints,
  type SectionContract,
} from './sectionContracts';

describe('sectionContracts', () => {
  describe('getContractForSection', () => {
    it('returns hero contract with correct properties', () => {
      const contract = getContractForSection('hero');
      expect(contract.type).toBe('hero');
      expect(contract.hasNamedExport).toBe(true);
      expect(contract.returnsJsx).toBe(true);
      expect((contract as any).hasMainHeading).toBe(true);
      expect((contract as any).hasCtaButton).toBe(true);
    });

    it('returns navigation contract with correct properties', () => {
      const contract = getContractForSection('navigation');
      expect(contract.type).toBe('navigation');
      expect((contract as any).hasLogo).toBe(true);
      expect((contract as any).hasNavLinks).toBe(true);
      expect((contract as any).hasMobileMenu).toBe(true);
    });

    it('returns features contract with minFeatureCount', () => {
      const contract = getContractForSection('features');
      expect(contract.type).toBe('features');
      expect((contract as any).minFeatureCount).toBe(3);
    });

    it('returns pricing contract with minTierCount', () => {
      const contract = getContractForSection('pricing');
      expect(contract.type).toBe('pricing');
      expect((contract as any).minTierCount).toBe(2);
    });

    it('returns base contract for unknown section types', () => {
      const contract = getContractForSection('gallery');
      expect(contract.hasNamedExport).toBe(true);
      expect(contract.usesTailwind).toBe(true);
    });
  });

  describe('validateAgainstContract', () => {
    describe('base contract validation', () => {
      it('validates correct component structure', () => {
        const code = `
export function HeroSection() {
  return (
    <section className="py-20 md:py-32">
      <h1 className="text-4xl">Welcome</h1>
      <button className="bg-blue-500">Get Started</button>
    </section>
  );
}`;
        const result = validateAgainstContract(code, 'hero');
        expect(result.valid).toBe(true);
        expect(result.score).toBeGreaterThan(80);
      });

      it('detects missing named export', () => {
        const code = `
function HeroSection() {
  return <div className="py-20">Hello</div>;
}`;
        const result = validateAgainstContract(code, 'hero');
        expect(result.violations.some(v => v.rule === 'hasNamedExport')).toBe(true);
      });

      it('detects missing Tailwind classes', () => {
        const code = `
export function HeroSection() {
  return <div style={{ padding: '20px' }}>Hello</div>;
}`;
        const result = validateAgainstContract(code, 'hero');
        expect(result.violations.some(v => v.rule === 'usesTailwind')).toBe(true);
      });

      it('warns about missing responsive classes', () => {
        const code = `
export function HeroSection() {
  return <div className="py-20">Hello</div>;
}`;
        const result = validateAgainstContract(code, 'hero');
        expect(result.violations.some(v => v.rule === 'isResponsive')).toBe(true);
      });

      it('passes responsive check with breakpoint classes', () => {
        const code = `
export function HeroSection() {
  return <div className="py-10 md:py-20 lg:py-32">Hello</div>;
}`;
        const result = validateAgainstContract(code, 'hero');
        expect(result.violations.some(v => v.rule === 'isResponsive')).toBe(false);
      });
    });

    describe('hero section validation', () => {
      it('warns about missing h1 heading', () => {
        const code = `
export function HeroSection() {
  return (
    <section className="py-20 md:py-32">
      <p>Welcome to our site</p>
    </section>
  );
}`;
        const result = validateAgainstContract(code, 'hero');
        expect(result.violations.some(v => v.rule === 'hasMainHeading')).toBe(true);
      });

      it('warns about missing CTA button', () => {
        const code = `
export function HeroSection() {
  return (
    <section className="py-20 md:py-32">
      <h1>Welcome</h1>
    </section>
  );
}`;
        const result = validateAgainstContract(code, 'hero');
        expect(result.violations.some(v => v.rule === 'hasCtaButton')).toBe(true);
      });

      it('passes with proper hero structure', () => {
        const code = `
export function HeroSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-r from-blue-500 to-purple-600">
      <h1 className="text-4xl">Welcome</h1>
      <p>Subheading text</p>
      <button className="bg-white">Get Started</button>
    </section>
  );
}`;
        const result = validateAgainstContract(code, 'hero');
        expect(result.violations.filter(v => v.severity === 'error')).toHaveLength(0);
      });
    });

    describe('navigation section validation', () => {
      it('warns about missing nav element', () => {
        const code = `
export function Navigation() {
  return (
    <div className="py-4 md:py-6">
      <a href="/">Home</a>
    </div>
  );
}`;
        const result = validateAgainstContract(code, 'navigation');
        expect(result.violations.some(v => v.rule === 'hasNavElement')).toBe(true);
      });

      it('warns about missing navigation links', () => {
        const code = `
export function Navigation() {
  return (
    <nav className="py-4 md:py-6">
      <span>Logo</span>
    </nav>
  );
}`;
        const result = validateAgainstContract(code, 'navigation');
        expect(result.violations.some(v => v.rule === 'hasNavLinks')).toBe(true);
      });

      it('passes with proper navigation structure', () => {
        const code = `
export function Navigation() {
  return (
    <nav className="py-4 md:py-6 fixed top-0">
      <a href="/">Logo</a>
      <a href="/about">About</a>
      <button className="md:hidden">Menu</button>
    </nav>
  );
}`;
        const result = validateAgainstContract(code, 'navigation');
        expect(result.violations.filter(v => v.severity === 'error')).toHaveLength(0);
      });
    });

    describe('footer section validation', () => {
      it('warns about missing footer element', () => {
        const code = `
export function Footer() {
  return (
    <div className="py-8 md:py-12">
      <p>© 2024 Company</p>
    </div>
  );
}`;
        const result = validateAgainstContract(code, 'footer');
        expect(result.violations.some(v => v.rule === 'hasFooterElement')).toBe(true);
      });

      it('warns about missing copyright', () => {
        const code = `
export function Footer() {
  return (
    <footer className="py-8 md:py-12">
      <a href="/about">About</a>
    </footer>
  );
}`;
        const result = validateAgainstContract(code, 'footer');
        expect(result.violations.some(v => v.rule === 'hasCopyright')).toBe(true);
      });

      it('passes with proper footer structure', () => {
        const code = `
export function Footer() {
  return (
    <footer className="py-8 md:py-12">
      <a href="/about">About</a>
      <p>© 2024 Company Name</p>
    </footer>
  );
}`;
        const result = validateAgainstContract(code, 'footer');
        expect(result.violations.filter(v => v.severity === 'error')).toHaveLength(0);
      });
    });

    describe('contact section validation', () => {
      it('warns about missing form', () => {
        const code = `
export function ContactSection() {
  return (
    <section className="py-20 md:py-32">
      <h2>Contact Us</h2>
      <p>Email: test@example.com</p>
    </section>
  );
}`;
        const result = validateAgainstContract(code, 'contact');
        expect(result.violations.some(v => v.rule === 'hasForm')).toBe(true);
      });

      it('passes with proper contact form', () => {
        const code = `
export function ContactSection() {
  return (
    <section className="py-20 md:py-32">
      <form>
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <textarea placeholder="Message"></textarea>
        <button type="submit">Send</button>
      </form>
    </section>
  );
}`;
        const result = validateAgainstContract(code, 'contact');
        expect(result.violations.filter(v => v.severity === 'error')).toHaveLength(0);
      });
    });

    describe('CTA section validation', () => {
      it('fails without action button', () => {
        const code = `
export function CTASection() {
  return (
    <section className="py-20 md:py-32 bg-blue-500">
      <h2>Ready to get started?</h2>
    </section>
  );
}`;
        const result = validateAgainstContract(code, 'cta');
        expect(result.valid).toBe(false);
        expect(result.violations.some(v => v.rule === 'hasActionButton' && v.severity === 'error')).toBe(true);
      });

      it('passes with proper CTA structure', () => {
        const code = `
export function CTASection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-r from-blue-500 to-purple-600">
      <h2 className="text-3xl">Ready to get started?</h2>
      <button className="bg-white">Sign Up Now</button>
    </section>
  );
}`;
        const result = validateAgainstContract(code, 'cta');
        expect(result.valid).toBe(true);
      });
    });

    describe('score calculation', () => {
      it('returns 100 for perfect code', () => {
        const code = `
export function HeroSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-r">
      <h1>Welcome</h1>
      <p>Subheading</p>
      <button>CTA</button>
    </section>
  );
}`;
        const result = validateAgainstContract(code, 'hero');
        expect(result.score).toBe(100);
      });

      it('reduces score for errors', () => {
        const code = `
function HeroSection() {
  return <div>Hello</div>;
}`;
        const result = validateAgainstContract(code, 'hero');
        expect(result.score).toBeLessThan(80);
      });

      it('reduces score less for warnings', () => {
        const code = `
export function HeroSection() {
  return <div className="py-20">Hello</div>;
}`;
        const result = validateAgainstContract(code, 'hero');
        expect(result.score).toBeGreaterThan(50);
        expect(result.score).toBeLessThan(100);
      });
    });
  });

  describe('getContractHints', () => {
    it('returns hints for hero section', () => {
      const hints = getContractHints('hero');
      expect(hints).toContain('h1');
      expect(hints).toContain('CTA button');
      expect(hints).toContain('responsive');
    });

    it('returns hints for navigation section', () => {
      const hints = getContractHints('navigation');
      expect(hints).toContain('<nav>');
      expect(hints).toContain('logo');
      expect(hints).toContain('mobile menu');
    });

    it('returns hints for features section', () => {
      const hints = getContractHints('features');
      expect(hints).toContain('3 feature');
      expect(hints).toContain('icon');
    });

    it('returns hints for pricing section', () => {
      const hints = getContractHints('pricing');
      expect(hints).toContain('tier');
      expect(hints).toContain('price');
      expect(hints).toContain('recommended');
    });

    it('returns hints for footer section', () => {
      const hints = getContractHints('footer');
      expect(hints).toContain('<footer>');
      expect(hints).toContain('copyright');
      expect(hints).toContain('social');
    });

    it('returns hints for contact section', () => {
      const hints = getContractHints('contact');
      expect(hints).toContain('form');
      expect(hints).toContain('email');
      expect(hints).toContain('submit');
    });

    it('always includes responsive hints', () => {
      const sections = ['hero', 'navigation', 'features', 'pricing', 'footer', 'contact', 'cta', 'faq'];
      for (const section of sections) {
        const hints = getContractHints(section as any);
        expect(hints).toContain('responsive');
        expect(hints).toContain('mobile-first');
      }
    });
  });

  describe('unifiedViolations', () => {
    it('returns unifiedViolations array alongside violations', () => {
      const code = `
function HeroSection() {
  return <div>Hello</div>;
}`;
      const result = validateAgainstContract(code, 'hero');
      expect(result.unifiedViolations).toBeDefined();
      expect(Array.isArray(result.unifiedViolations)).toBe(true);
    });

    it('maps missing named export to CONTRACT_MISSING_NAMED_EXPORT code', () => {
      const code = `
function HeroSection() {
  return <div className="py-20">Hello</div>;
}`;
      const result = validateAgainstContract(code, 'hero');
      const unified = result.unifiedViolations?.find(v => v.code === 'CONTRACT_MISSING_NAMED_EXPORT');
      expect(unified).toBeDefined();
      expect(unified?.severity).toBe('error');
      expect(unified?.autoFixable).toBe(false);
    });

    it('maps missing Tailwind to CONTRACT_MISSING_TAILWIND code', () => {
      const code = `
export function HeroSection() {
  return <div style={{ padding: '20px' }}>Hello</div>;
}`;
      const result = validateAgainstContract(code, 'hero');
      const unified = result.unifiedViolations?.find(v => v.code === 'CONTRACT_MISSING_TAILWIND');
      expect(unified).toBeDefined();
      expect(unified?.severity).toBe('warning');
    });

    it('maps missing responsive to CONTRACT_MISSING_RESPONSIVE code', () => {
      const code = `
export function HeroSection() {
  return <div className="py-20">Hello</div>;
}`;
      const result = validateAgainstContract(code, 'hero');
      const unified = result.unifiedViolations?.find(v => v.code === 'CONTRACT_MISSING_RESPONSIVE');
      expect(unified).toBeDefined();
      expect(unified?.severity).toBe('warning');
    });

    it('maps hero-specific violations to correct codes', () => {
      const code = `
export function HeroSection() {
  return <div className="py-20 md:py-32">Hello</div>;
}`;
      const result = validateAgainstContract(code, 'hero');
      
      // Should have hero-specific violations
      const h1Violation = result.unifiedViolations?.find(v => v.code === 'CONTRACT_HERO_MISSING_H1');
      const ctaViolation = result.unifiedViolations?.find(v => v.code === 'CONTRACT_HERO_MISSING_CTA');
      
      expect(h1Violation).toBeDefined();
      expect(ctaViolation).toBeDefined();
    });

    it('maps CTA button error to CONTRACT_CTA_MISSING_BUTTON with error severity', () => {
      const code = `
export function CTASection() {
  return <div className="py-20 md:py-32">No button here</div>;
}`;
      const result = validateAgainstContract(code, 'cta');
      const unified = result.unifiedViolations?.find(v => v.code === 'CONTRACT_CTA_MISSING_BUTTON');
      expect(unified).toBeDefined();
      expect(unified?.severity).toBe('error');
    });

    it('includes context with sectionType for base violations', () => {
      const code = `
function HeroSection() {
  return <div>Hello</div>;
}`;
      const result = validateAgainstContract(code, 'hero');
      const unified = result.unifiedViolations?.find(v => v.code === 'CONTRACT_MISSING_NAMED_EXPORT');
      expect(unified?.context).toBeDefined();
      expect(unified?.context?.sectionType).toBe('hero');
    });

    it('returns empty unifiedViolations for valid code', () => {
      const code = `
export function HeroSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-r">
      <h1>Welcome</h1>
      <p>Subheading</p>
      <button>CTA</button>
    </section>
  );
}`;
      const result = validateAgainstContract(code, 'hero');
      expect(result.unifiedViolations).toHaveLength(0);
    });
  });
});
