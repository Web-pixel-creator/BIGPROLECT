/**
 * Section definitions with metadata for generation.
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
  | 'logos'
  | 'marquee'
  | 'how-it-works'
  | 'comparison'
  | 'integration'
  | 'newsletter'
  | 'services';

export interface SectionDefinition {
  type: SectionType;
  name: string;
  description: string;
  requiredProps: string[];
  optionalProps: string[];
  defaultExport: boolean;
}

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
  logos: {
    type: 'logos',
    name: 'LogoCloudSection',
    description: 'Logo cloud of partners or clients',
    requiredProps: ['logos'],
    optionalProps: ['title', 'subtitle'],
    defaultExport: false,
  },
  marquee: {
    type: 'marquee',
    name: 'MarqueeSection',
    description: 'Scrolling marquee text or logos',
    requiredProps: ['items'],
    optionalProps: ['speed', 'direction'],
    defaultExport: false,
  },
  'how-it-works': {
    type: 'how-it-works',
    name: 'HowItWorksSection',
    description: 'Step-by-step process timeline',
    requiredProps: ['steps'],
    optionalProps: ['title', 'subtitle'],
    defaultExport: false,
  },
  comparison: {
    type: 'comparison',
    name: 'ComparisonSection',
    description: 'Side-by-side comparison table or before/after',
    requiredProps: ['rows'],
    optionalProps: ['title', 'highlights'],
    defaultExport: false,
  },
  integration: {
    type: 'integration',
    name: 'IntegrationSection',
    description: 'Integration logos with short descriptions',
    requiredProps: ['integrations'],
    optionalProps: ['title', 'subtitle'],
    defaultExport: false,
  },
  newsletter: {
    type: 'newsletter',
    name: 'NewsletterSection',
    description: 'Email signup form with CTA',
    requiredProps: ['ctaText'],
    optionalProps: ['title', 'subtitle', 'placeholder'],
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
