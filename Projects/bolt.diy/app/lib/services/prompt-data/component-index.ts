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
];
