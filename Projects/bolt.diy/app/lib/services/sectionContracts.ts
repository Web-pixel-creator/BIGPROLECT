/**
 * Section Contracts - Type-safe contracts for section generation
 *
 * Defines the expected structure and validation rules for each section type.
 * Used to:
 * 1. Validate LLM output matches expected structure
 * 2. Provide type hints to LLM for better generation
 * 3. Enable automatic repair when structure is wrong
 */

import type { SectionType } from './prompt-data';

/**
 * Base contract that all sections must satisfy.
 */
export interface BaseSectionContract {
  /** Component must have a named export */
  hasNamedExport: boolean;

  /** Component must return JSX */
  returnsJsx: boolean;

  /** Component must use Tailwind classes */
  usesTailwind: boolean;

  /** Component must be responsive */
  isResponsive: boolean;
}

/**
 * Hero section contract.
 */
export interface HeroContract extends BaseSectionContract {
  type: 'hero';

  /** Must have a main heading (h1) */
  hasMainHeading: boolean;

  /** Must have a subheading or description */
  hasSubheading: boolean;

  /** Should have at least one CTA button */
  hasCtaButton: boolean;

  /** Should have visual interest (gradient, image, or animation) */
  hasVisualInterest: boolean;
}

/**
 * Navigation contract.
 */
export interface NavigationContract extends BaseSectionContract {
  type: 'navigation';

  /** Must have logo or brand name */
  hasLogo: boolean;

  /** Must have navigation links */
  hasNavLinks: boolean;

  /** Should have mobile menu toggle */
  hasMobileMenu: boolean;

  /** Should be sticky or fixed */
  isSticky: boolean;
}

/**
 * Features section contract.
 */
export interface FeaturesContract extends BaseSectionContract {
  type: 'features';

  /** Must have section title */
  hasSectionTitle: boolean;

  /** Must have feature items (minimum 3) */
  hasFeatureItems: boolean;
  minFeatureCount: number;

  /** Each feature should have icon */
  featuresHaveIcons: boolean;

  /** Each feature should have title and description */
  featuresHaveContent: boolean;
}

/**
 * Pricing section contract.
 */
export interface PricingContract extends BaseSectionContract {
  type: 'pricing';

  /** Must have pricing tiers */
  hasPricingTiers: boolean;
  minTierCount: number;

  /** Each tier should have price */
  tiersHavePrice: boolean;

  /** Each tier should have features list */
  tiersHaveFeatures: boolean;

  /** Should highlight recommended tier */
  hasHighlightedTier: boolean;
}

/**
 * Testimonials section contract.
 */
export interface TestimonialsContract extends BaseSectionContract {
  type: 'testimonials';

  /** Must have testimonial items */
  hasTestimonials: boolean;
  minTestimonialCount: number;

  /** Each testimonial should have quote */
  testimonialsHaveQuote: boolean;

  /** Each testimonial should have author */
  testimonialsHaveAuthor: boolean;
}

/**
 * Footer section contract.
 */
export interface FooterContract extends BaseSectionContract {
  type: 'footer';

  /** Should have copyright notice */
  hasCopyright: boolean;

  /** Should have navigation links */
  hasLinks: boolean;

  /** Should have social media links */
  hasSocialLinks: boolean;
}

/**
 * Contact section contract.
 */
export interface ContactContract extends BaseSectionContract {
  type: 'contact';

  /** Must have contact form or info */
  hasContactMethod: boolean;

  /** Form should have name field */
  hasNameField: boolean;

  /** Form should have email field */
  hasEmailField: boolean;

  /** Form should have message field */
  hasMessageField: boolean;

  /** Form should have submit button */
  hasSubmitButton: boolean;
}

/**
 * CTA section contract.
 */
export interface CtaContract extends BaseSectionContract {
  type: 'cta';

  /** Must have compelling headline */
  hasHeadline: boolean;

  /** Must have action button */
  hasActionButton: boolean;

  /** Should have visual distinction (background color/gradient) */
  hasVisualDistinction: boolean;
}

/**
 * FAQ section contract.
 */
export interface FaqContract extends BaseSectionContract {
  type: 'faq';

  /** Must have FAQ items */
  hasFaqItems: boolean;
  minFaqCount: number;

  /** Each FAQ should have question */
  faqsHaveQuestion: boolean;

  /** Each FAQ should have answer */
  faqsHaveAnswer: boolean;

  /** Should be expandable/accordion */
  isExpandable: boolean;
}

/**
 * Union type of all section contracts.
 */
export type SectionContract =
  | HeroContract
  | NavigationContract
  | FeaturesContract
  | PricingContract
  | TestimonialsContract
  | FooterContract
  | ContactContract
  | CtaContract
  | FaqContract;

/**
 * Unified violation code for all contract types.
 * Enables consistent analytics, monitoring, and auto-fix routing.
 */
export type ViolationCode =
  | 'CONTRACT_MISSING_NAMED_EXPORT'
  | 'CONTRACT_MISSING_JSX_RETURN'
  | 'CONTRACT_MISSING_TAILWIND'
  | 'CONTRACT_MISSING_RESPONSIVE'

  // Hero violations
  | 'CONTRACT_HERO_MISSING_H1'
  | 'CONTRACT_HERO_MISSING_CTA'
  | 'CONTRACT_HERO_MISSING_VISUAL'

  // Navigation violations
  | 'CONTRACT_NAV_MISSING_NAV_ELEMENT'
  | 'CONTRACT_NAV_MISSING_LINKS'
  | 'CONTRACT_NAV_MISSING_MOBILE_MENU'

  // Features violations
  | 'CONTRACT_FEATURES_MISSING_ITEMS'

  // Pricing violations
  | 'CONTRACT_PRICING_MISSING_PRICE'
  | 'CONTRACT_PRICING_MISSING_HIGHLIGHT'

  // Footer violations
  | 'CONTRACT_FOOTER_MISSING_FOOTER_ELEMENT'
  | 'CONTRACT_FOOTER_MISSING_COPYRIGHT'

  // Contact violations
  | 'CONTRACT_CONTACT_MISSING_FORM'
  | 'CONTRACT_CONTACT_MISSING_EMAIL'
  | 'CONTRACT_CONTACT_MISSING_SUBMIT'

  // CTA violations
  | 'CONTRACT_CTA_MISSING_HEADLINE'
  | 'CONTRACT_CTA_MISSING_BUTTON'

  // Page structure violations (from ActionRunner)
  | 'CONTRACT_PAGE_MISSING_SECTION'
  | 'CONTRACT_PAGE_WRONG_ORDER'
  | 'CONTRACT_PAGE_UNKNOWN_SECTION'
  | 'CONTRACT_PAGE_IMAGE_COUNT'
  | 'CONTRACT_PAGE_IMAGE_DUPLICATE'
  | 'CONTRACT_PAGE_IMAGE_INVALID'

  // Syntax/validation errors (from codeValidator)
  | 'SYNTAX_BRACE_EXPECTED'
  | 'SYNTAX_PAREN_EXPECTED'
  | 'SYNTAX_BRACKET_EXPECTED'
  | 'SYNTAX_UNTERMINATED_STRING'
  | 'SYNTAX_IDENTIFIER_EXPECTED'
  | 'SYNTAX_EXPRESSION_EXPECTED'
  | 'SYNTAX_DECLARATION_EXPECTED'
  | 'SYNTAX_JSX_TAG_MISMATCH'
  | 'SYNTAX_JSX_UNCLOSED'
  | 'SYNTAX_UNBALANCED_BRACES'
  | 'SYNTAX_UNBALANCED_PARENS'
  | 'SYNTAX_DUPLICATE_IMPORT'
  | 'SYNTAX_MULTIPLE_EXPORT_DEFAULT'
  | 'SYNTAX_CSS_UNBALANCED'
  | 'SYNTAX_CSS_UNCLOSED_COMMENT'
  | 'SYNTAX_PARSER_CRASH'
  | 'SYNTAX_OTHER'

  // Generic
  | 'CONTRACT_OTHER';

/**
 * Unified violation format for all contract types.
 * Used by both sectionContracts (content validation) and ActionRunner (page structure validation).
 */
export interface UnifiedViolation {
  /** Structured code for analytics and routing */
  code: ViolationCode;

  /** Severity level */
  severity: 'error' | 'warning';

  /** Human-readable message */
  message: string;

  /** Whether this can be auto-fixed */
  autoFixable: boolean;

  /** Additional context for debugging/fixing */
  context?: Record<string, unknown>;
}

/**
 * Contract validation result.
 */
export interface ContractValidationResult {
  valid: boolean;
  violations: ContractViolation[];

  /** Unified violations with structured codes (for analytics) */
  unifiedViolations?: UnifiedViolation[];
  score: number; // 0-100
}

export interface ContractViolation {
  rule: string;
  message: string;
  severity: 'error' | 'warning';
  autoFixable: boolean;
}

/**
 * Get the contract definition for a section type.
 */
export function getContractForSection(sectionType: SectionType): Partial<SectionContract> {
  const baseContract: BaseSectionContract = {
    hasNamedExport: true,
    returnsJsx: true,
    usesTailwind: true,
    isResponsive: true,
  };

  switch (sectionType) {
    case 'hero':
      return {
        ...baseContract,
        type: 'hero',
        hasMainHeading: true,
        hasSubheading: true,
        hasCtaButton: true,
        hasVisualInterest: true,
      } as HeroContract;

    case 'navigation':
      return {
        ...baseContract,
        type: 'navigation',
        hasLogo: true,
        hasNavLinks: true,
        hasMobileMenu: true,
        isSticky: true,
      } as NavigationContract;

    case 'features':
      return {
        ...baseContract,
        type: 'features',
        hasSectionTitle: true,
        hasFeatureItems: true,
        minFeatureCount: 3,
        featuresHaveIcons: true,
        featuresHaveContent: true,
      } as FeaturesContract;

    case 'pricing':
      return {
        ...baseContract,
        type: 'pricing',
        hasPricingTiers: true,
        minTierCount: 2,
        tiersHavePrice: true,
        tiersHaveFeatures: true,
        hasHighlightedTier: true,
      } as PricingContract;

    case 'testimonials':
      return {
        ...baseContract,
        type: 'testimonials',
        hasTestimonials: true,
        minTestimonialCount: 2,
        testimonialsHaveQuote: true,
        testimonialsHaveAuthor: true,
      } as TestimonialsContract;

    case 'footer':
      return {
        ...baseContract,
        type: 'footer',
        hasCopyright: true,
        hasLinks: true,
        hasSocialLinks: true,
      } as FooterContract;

    case 'contact':
      return {
        ...baseContract,
        type: 'contact',
        hasContactMethod: true,
        hasNameField: true,
        hasEmailField: true,
        hasMessageField: true,
        hasSubmitButton: true,
      } as ContactContract;

    case 'cta':
      return {
        ...baseContract,
        type: 'cta',
        hasHeadline: true,
        hasActionButton: true,
        hasVisualDistinction: true,
      } as CtaContract;

    case 'faq':
      return {
        ...baseContract,
        type: 'faq',
        hasFaqItems: true,
        minFaqCount: 3,
        faqsHaveQuestion: true,
        faqsHaveAnswer: true,
        isExpandable: true,
      } as FaqContract;

    default:
      return baseContract;
  }
}

/**
 * Validate generated code against section contract.
 */
export function validateAgainstContract(code: string, sectionType: SectionType): ContractValidationResult {
  const violations: ContractViolation[] = [];
  const unifiedViolations: UnifiedViolation[] = [];
  const contract = getContractForSection(sectionType);

  // Base contract checks
  if (contract.hasNamedExport && !code.match(/export\s+(function|const)\s+[A-Z]/)) {
    violations.push({
      rule: 'hasNamedExport',
      message: 'Component must have a named export (export function ComponentName)',
      severity: 'error',
      autoFixable: false,
    });
    unifiedViolations.push({
      code: 'CONTRACT_MISSING_NAMED_EXPORT',
      severity: 'error',
      message: 'Component must have a named export (export function ComponentName)',
      autoFixable: false,
      context: { sectionType },
    });
  }

  if (contract.returnsJsx && !code.includes('return') && !code.includes('<')) {
    violations.push({
      rule: 'returnsJsx',
      message: 'Component must return JSX',
      severity: 'error',
      autoFixable: false,
    });
    unifiedViolations.push({
      code: 'CONTRACT_MISSING_JSX_RETURN',
      severity: 'error',
      message: 'Component must return JSX',
      autoFixable: false,
      context: { sectionType },
    });
  }

  if (contract.usesTailwind && !code.includes('className=')) {
    violations.push({
      rule: 'usesTailwind',
      message: 'Component should use Tailwind CSS classes',
      severity: 'warning',
      autoFixable: false,
    });
    unifiedViolations.push({
      code: 'CONTRACT_MISSING_TAILWIND',
      severity: 'warning',
      message: 'Component should use Tailwind CSS classes',
      autoFixable: false,
      context: { sectionType },
    });
  }

  if (contract.isResponsive) {
    const hasResponsiveClasses = /\b(sm:|md:|lg:|xl:|2xl:)/.test(code);

    if (!hasResponsiveClasses) {
      violations.push({
        rule: 'isResponsive',
        message: 'Component should have responsive breakpoint classes (sm:, md:, lg:)',
        severity: 'warning',
        autoFixable: false,
      });
      unifiedViolations.push({
        code: 'CONTRACT_MISSING_RESPONSIVE',
        severity: 'warning',
        message: 'Component should have responsive breakpoint classes (sm:, md:, lg:)',
        autoFixable: false,
        context: { sectionType },
      });
    }
  }

  // Section-specific checks
  switch (sectionType) {
    case 'hero':
      validateHeroContract(code, violations, unifiedViolations);
      break;
    case 'navigation':
      validateNavigationContract(code, violations, unifiedViolations);
      break;
    case 'features':
      validateFeaturesContract(code, violations, unifiedViolations);
      break;
    case 'pricing':
      validatePricingContract(code, violations, unifiedViolations);
      break;
    case 'footer':
      validateFooterContract(code, violations, unifiedViolations);
      break;
    case 'contact':
      validateContactContract(code, violations, unifiedViolations);
      break;
    case 'cta':
      validateCtaContract(code, violations, unifiedViolations);
      break;
  }

  // Calculate score
  const errorCount = violations.filter((v) => v.severity === 'error').length;
  const warningCount = violations.filter((v) => v.severity === 'warning').length;
  const score = Math.max(0, 100 - errorCount * 20 - warningCount * 5);

  return {
    valid: errorCount === 0,
    violations,
    unifiedViolations,
    score,
  };
}

function validateHeroContract(
  code: string,
  violations: ContractViolation[],
  unifiedViolations: UnifiedViolation[],
): void {
  if (!/<h1[\s>]/.test(code)) {
    violations.push({
      rule: 'hasMainHeading',
      message: 'Hero section should have an h1 heading',
      severity: 'warning',
      autoFixable: false,
    });
    unifiedViolations.push({
      code: 'CONTRACT_HERO_MISSING_H1',
      severity: 'warning',
      message: 'Hero section should have an h1 heading',
      autoFixable: false,
    });
  }

  if (!/<button[\s>]/.test(code) && !/<Button[\s>]/.test(code)) {
    violations.push({
      rule: 'hasCtaButton',
      message: 'Hero section should have a CTA button',
      severity: 'warning',
      autoFixable: false,
    });
    unifiedViolations.push({
      code: 'CONTRACT_HERO_MISSING_CTA',
      severity: 'warning',
      message: 'Hero section should have a CTA button',
      autoFixable: false,
    });
  }

  const hasVisualInterest = /gradient|bg-\w+-\d+|background|animate-/.test(code);

  if (!hasVisualInterest) {
    violations.push({
      rule: 'hasVisualInterest',
      message: 'Hero section should have visual interest (gradient, background, or animation)',
      severity: 'warning',
      autoFixable: false,
    });
    unifiedViolations.push({
      code: 'CONTRACT_HERO_MISSING_VISUAL',
      severity: 'warning',
      message: 'Hero section should have visual interest (gradient, background, or animation)',
      autoFixable: false,
    });
  }
}

function validateNavigationContract(
  code: string,
  violations: ContractViolation[],
  unifiedViolations: UnifiedViolation[],
): void {
  if (!/<nav[\s>]/.test(code)) {
    violations.push({
      rule: 'hasNavElement',
      message: 'Navigation should use semantic <nav> element',
      severity: 'warning',
      autoFixable: false,
    });
    unifiedViolations.push({
      code: 'CONTRACT_NAV_MISSING_NAV_ELEMENT',
      severity: 'warning',
      message: 'Navigation should use semantic <nav> element',
      autoFixable: false,
    });
  }

  const hasLinks = /<a[\s>]/.test(code) || /href=/.test(code);

  if (!hasLinks) {
    violations.push({
      rule: 'hasNavLinks',
      message: 'Navigation should have navigation links',
      severity: 'warning',
      autoFixable: false,
    });
    unifiedViolations.push({
      code: 'CONTRACT_NAV_MISSING_LINKS',
      severity: 'warning',
      message: 'Navigation should have navigation links',
      autoFixable: false,
    });
  }

  const hasMobileMenu = /Menu|hamburger|mobile|toggle/i.test(code);

  if (!hasMobileMenu) {
    violations.push({
      rule: 'hasMobileMenu',
      message: 'Navigation should have mobile menu support',
      severity: 'warning',
      autoFixable: false,
    });
    unifiedViolations.push({
      code: 'CONTRACT_NAV_MISSING_MOBILE_MENU',
      severity: 'warning',
      message: 'Navigation should have mobile menu support',
      autoFixable: false,
    });
  }
}

function validateFeaturesContract(
  code: string,
  violations: ContractViolation[],
  unifiedViolations: UnifiedViolation[],
): void {
  // Check for feature items (look for arrays or repeated patterns)
  const hasFeatureArray = /features|items|cards/i.test(code) && /\.map\(/.test(code);
  const hasMultipleFeatures = (code.match(/<div[^>]*className[^>]*>/g) || []).length >= 3;

  if (!hasFeatureArray && !hasMultipleFeatures) {
    violations.push({
      rule: 'hasFeatureItems',
      message: 'Features section should have multiple feature items',
      severity: 'warning',
      autoFixable: false,
    });
    unifiedViolations.push({
      code: 'CONTRACT_FEATURES_MISSING_ITEMS',
      severity: 'warning',
      message: 'Features section should have multiple feature items',
      autoFixable: false,
    });
  }
}

function validatePricingContract(
  code: string,
  violations: ContractViolation[],
  unifiedViolations: UnifiedViolation[],
): void {
  const hasPriceIndicator = /\$|\€|price|cost|month|year|free/i.test(code);

  if (!hasPriceIndicator) {
    violations.push({
      rule: 'tiersHavePrice',
      message: 'Pricing section should display prices',
      severity: 'warning',
      autoFixable: false,
    });
    unifiedViolations.push({
      code: 'CONTRACT_PRICING_MISSING_PRICE',
      severity: 'warning',
      message: 'Pricing section should display prices',
      autoFixable: false,
    });
  }

  const hasHighlight = /popular|recommended|best|featured/i.test(code);

  if (!hasHighlight) {
    violations.push({
      rule: 'hasHighlightedTier',
      message: 'Pricing section should highlight a recommended tier',
      severity: 'warning',
      autoFixable: false,
    });
    unifiedViolations.push({
      code: 'CONTRACT_PRICING_MISSING_HIGHLIGHT',
      severity: 'warning',
      message: 'Pricing section should highlight a recommended tier',
      autoFixable: false,
    });
  }
}

function validateFooterContract(
  code: string,
  violations: ContractViolation[],
  unifiedViolations: UnifiedViolation[],
): void {
  if (!/<footer[\s>]/.test(code)) {
    violations.push({
      rule: 'hasFooterElement',
      message: 'Footer should use semantic <footer> element',
      severity: 'warning',
      autoFixable: false,
    });
    unifiedViolations.push({
      code: 'CONTRACT_FOOTER_MISSING_FOOTER_ELEMENT',
      severity: 'warning',
      message: 'Footer should use semantic <footer> element',
      autoFixable: false,
    });
  }

  const hasCopyright = /©|copyright|\d{4}/i.test(code);

  if (!hasCopyright) {
    violations.push({
      rule: 'hasCopyright',
      message: 'Footer should have copyright notice',
      severity: 'warning',
      autoFixable: false,
    });
    unifiedViolations.push({
      code: 'CONTRACT_FOOTER_MISSING_COPYRIGHT',
      severity: 'warning',
      message: 'Footer should have copyright notice',
      autoFixable: false,
    });
  }
}

function validateContactContract(
  code: string,
  violations: ContractViolation[],
  unifiedViolations: UnifiedViolation[],
): void {
  if (!/<form[\s>]/.test(code)) {
    violations.push({
      rule: 'hasForm',
      message: 'Contact section should have a form element',
      severity: 'warning',
      autoFixable: false,
    });
    unifiedViolations.push({
      code: 'CONTRACT_CONTACT_MISSING_FORM',
      severity: 'warning',
      message: 'Contact section should have a form element',
      autoFixable: false,
    });
  }

  const hasEmailInput = /type=["']email["']|email/i.test(code);

  if (!hasEmailInput) {
    violations.push({
      rule: 'hasEmailField',
      message: 'Contact form should have an email field',
      severity: 'warning',
      autoFixable: false,
    });
    unifiedViolations.push({
      code: 'CONTRACT_CONTACT_MISSING_EMAIL',
      severity: 'warning',
      message: 'Contact form should have an email field',
      autoFixable: false,
    });
  }

  const hasSubmit = /type=["']submit["']|<button/.test(code);

  if (!hasSubmit) {
    violations.push({
      rule: 'hasSubmitButton',
      message: 'Contact form should have a submit button',
      severity: 'warning',
      autoFixable: false,
    });
    unifiedViolations.push({
      code: 'CONTRACT_CONTACT_MISSING_SUBMIT',
      severity: 'warning',
      message: 'Contact form should have a submit button',
      autoFixable: false,
    });
  }
}

function validateCtaContract(
  code: string,
  violations: ContractViolation[],
  unifiedViolations: UnifiedViolation[],
): void {
  const hasHeadline = /<h[1-3][\s>]/.test(code);

  if (!hasHeadline) {
    violations.push({
      rule: 'hasHeadline',
      message: 'CTA section should have a compelling headline',
      severity: 'warning',
      autoFixable: false,
    });
    unifiedViolations.push({
      code: 'CONTRACT_CTA_MISSING_HEADLINE',
      severity: 'warning',
      message: 'CTA section should have a compelling headline',
      autoFixable: false,
    });
  }

  const hasButton = /<button[\s>]|<Button[\s>]/.test(code);

  if (!hasButton) {
    violations.push({
      rule: 'hasActionButton',
      message: 'CTA section must have an action button',
      severity: 'error',
      autoFixable: false,
    });
    unifiedViolations.push({
      code: 'CONTRACT_CTA_MISSING_BUTTON',
      severity: 'error',
      message: 'CTA section must have an action button',
      autoFixable: false,
    });
  }
}

/**
 * Generate contract hints for LLM prompt.
 */
export function getContractHints(sectionType: SectionType): string {
  // Contract is retrieved but hints are hardcoded per section type
  getContractForSection(sectionType);

  const hints: string[] = [];

  switch (sectionType) {
    case 'hero':
      hints.push('- Include an h1 heading for the main title');
      hints.push('- Add a subheading or description paragraph');
      hints.push('- Include at least one CTA button');
      hints.push('- Add visual interest with gradients, images, or animations');
      break;

    case 'navigation':
      hints.push('- Use semantic <nav> element');
      hints.push('- Include logo or brand name');
      hints.push('- Add navigation links');
      hints.push('- Include mobile menu toggle for responsive design');
      hints.push('- Consider making it sticky (fixed position)');
      break;

    case 'features':
      hints.push('- Include a section title');
      hints.push('- Add at least 3 feature items');
      hints.push('- Each feature should have an icon, title, and description');
      hints.push('- Use a grid layout for features');
      break;

    case 'pricing':
      hints.push('- Include at least 2-3 pricing tiers');
      hints.push('- Each tier should show price clearly');
      hints.push('- List features for each tier');
      hints.push('- Highlight the recommended/popular tier');
      hints.push('- Include CTA buttons for each tier');
      break;

    case 'testimonials':
      hints.push('- Include at least 2-3 testimonials');
      hints.push('- Each testimonial needs a quote');
      hints.push('- Include author name and optionally role/company');
      hints.push('- Consider adding author photos');
      break;

    case 'footer':
      hints.push('- Use semantic <footer> element');
      hints.push('- Include copyright notice with year');
      hints.push('- Add navigation links organized in columns');
      hints.push('- Include social media links');
      break;

    case 'contact':
      hints.push('- Include a contact form');
      hints.push('- Form should have name, email, and message fields');
      hints.push('- Add a submit button');
      hints.push('- Consider adding contact info (email, phone, address)');
      break;

    case 'cta':
      hints.push('- Include a compelling headline (h2 or h3)');
      hints.push('- Add a clear action button');
      hints.push('- Use contrasting background color or gradient');
      hints.push('- Keep the message focused and urgent');
      break;

    case 'faq':
      hints.push('- Include at least 3-5 FAQ items');
      hints.push('- Each FAQ needs a question and answer');
      hints.push('- Make it expandable/accordion style');
      hints.push('- Use clear, concise answers');
      break;
  }

  // Add responsive hints
  hints.push('- Use responsive classes (sm:, md:, lg:) for different screen sizes');
  hints.push('- Ensure mobile-first design');

  return hints.join('\n');
}
