import type { SectionType } from './section-definitions';

export type ComponentSource = 'shadcn' | 'magicui';

export type ComponentIndexEntry = {
  id: string;
  sectionType: SectionType;
  source: ComponentSource;
  propsContract: string[];
  visualTags: string[];
  styleTags: string[];
  layoutArchetype: string;
  dependencies: string[];
};

export const COMPONENT_INDEX: ComponentIndexEntry[] = [
  {
    id: 'shadcn-hero-01',
    sectionType: 'hero',
    source: 'shadcn',
    propsContract: ['title', 'subtitle', 'ctaText', 'ctaLink?', 'badgeText?'],
    visualTags: ['centered', 'full-height', 'badge'],
    styleTags: ['modern', 'minimal'],
    layoutArchetype: 'hero-centered',
    dependencies: ['lucide-react'],
  },
  {
    id: 'magicui-hero-video-dialog',
    sectionType: 'hero',
    source: 'magicui',
    propsContract: ['title', 'subtitle', 'ctaText', 'videoUrl'],
    visualTags: ['centered', 'video', 'overlay'],
    styleTags: ['modern', 'bold'],
    layoutArchetype: 'hero-video',
    dependencies: ['framer-motion'],
  },
  {
    id: 'shadcn-features-01',
    sectionType: 'features',
    source: 'shadcn',
    propsContract: ['features', 'title?', 'subtitle?'],
    visualTags: ['grid', 'icon-cards'],
    styleTags: ['clean', 'product'],
    layoutArchetype: 'features-grid',
    dependencies: ['lucide-react'],
  },
  {
    id: 'magicui-bento-grid',
    sectionType: 'features',
    source: 'magicui',
    propsContract: ['features', 'title?', 'subtitle?'],
    visualTags: ['bento', 'grid', 'cards'],
    styleTags: ['modern', 'playful'],
    layoutArchetype: 'features-bento',
    dependencies: ['@radix-ui/react-icons'],
  },
  {
    id: 'shadcn-pricing-01',
    sectionType: 'pricing',
    source: 'shadcn',
    propsContract: ['plans', 'title?', 'subtitle?', 'currency?', 'highlightedPlanId?'],
    visualTags: ['cards', 'tiered', 'comparison'],
    styleTags: ['clean', 'product'],
    layoutArchetype: 'pricing-cards',
    dependencies: ['lucide-react'],
  },
  {
    id: 'magicui-pricing-spotlight',
    sectionType: 'pricing',
    source: 'magicui',
    propsContract: ['plans', 'title?', 'subtitle?', 'highlightedPlanId?'],
    visualTags: ['cards', 'spotlight', 'glow'],
    styleTags: ['modern', 'bold'],
    layoutArchetype: 'pricing-spotlight',
    dependencies: ['framer-motion'],
  },
  {
    id: 'shadcn-testimonials-01',
    sectionType: 'testimonials',
    source: 'shadcn',
    propsContract: ['testimonials', 'title?', 'subtitle?', 'layout?'],
    visualTags: ['grid', 'quotes'],
    styleTags: ['minimal', 'editorial'],
    layoutArchetype: 'testimonials-grid',
    dependencies: ['lucide-react'],
  },
  {
    id: 'magicui-testimonials-marquee',
    sectionType: 'testimonials',
    source: 'magicui',
    propsContract: ['testimonials', 'title?', 'subtitle?'],
    visualTags: ['marquee', 'cards'],
    styleTags: ['playful', 'modern'],
    layoutArchetype: 'testimonials-marquee',
    dependencies: ['framer-motion'],
  },
  {
    id: 'shadcn-faq-accordion',
    sectionType: 'faq',
    source: 'shadcn',
    propsContract: ['questions', 'title?', 'subtitle?'],
    visualTags: ['accordion', 'stacked'],
    styleTags: ['clean', 'support'],
    layoutArchetype: 'faq-accordion',
    dependencies: ['@radix-ui/react-collapsible'],
  },
  {
    id: 'magicui-faq-glow',
    sectionType: 'faq',
    source: 'magicui',
    propsContract: ['questions', 'title?', 'subtitle?'],
    visualTags: ['accordion', 'cards', 'glow'],
    styleTags: ['modern', 'bold'],
    layoutArchetype: 'faq-glow',
    dependencies: ['framer-motion'],
  },
  {
    id: 'shadcn-footer-01',
    sectionType: 'footer',
    source: 'shadcn',
    propsContract: ['logo?', 'links?', 'social?', 'copyright?'],
    visualTags: ['multi-column', 'link-groups'],
    styleTags: ['minimal', 'corporate'],
    layoutArchetype: 'footer-columns',
    dependencies: ['lucide-react'],
  },
  {
    id: 'magicui-footer-gradient',
    sectionType: 'footer',
    source: 'magicui',
    propsContract: ['logo?', 'links?', 'social?', 'copyright?', 'newsletterCta?'],
    visualTags: ['gradient', 'split'],
    styleTags: ['modern', 'bold'],
    layoutArchetype: 'footer-gradient',
    dependencies: ['framer-motion'],
  },
];
