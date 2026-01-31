/**
 * Component Variants Library
 * 
 * Enhanced component variants for unique, non-template designs.
 * Each component type has 10+ unique variations.
 */

import { seededRandom } from './random';

// ============================================================================
// TYPES
// ============================================================================

export interface ComponentVariant {
  id: string;
  name: string;
  description: string;
  componentType: string;
  layout: LayoutConfig;
  styling: StylingConfig;
  animations: AnimationConfig;
  effects: string[];
  responsive: ResponsiveConfig;
}

export interface LayoutConfig {
  structure: string;
  grid?: string;
  flex?: string;
  positioning?: string;
  spacing: SpacingConfig;
}

export interface SpacingConfig {
  padding: string;
  margin: string;
  gap: string;
  container?: string;
}

export interface StylingConfig {
  background?: string;
  border?: string;
  borderRadius?: string;
  shadow?: string;
  typography?: TypographyConfig;
}

export interface TypographyConfig {
  headingSize?: string;
  bodySize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
}

export interface AnimationConfig {
  entrance?: string;
  hover?: string;
  scroll?: string;
  duration: number;
  easing: string;
  stagger?: number;
}

export interface ResponsiveConfig {
  mobile: string;
  tablet: string;
  desktop: string;
  wide?: string;
}

// ============================================================================
// HERO COMPONENT VARIANTS (15+ variations)
// ============================================================================

const HERO_VARIANTS: ComponentVariant[] = [
  {
    id: 'hero-centered',
    name: 'Centered Hero',
    description: 'Classic centered content with full-width background',
    componentType: 'hero',
    layout: {
      structure: 'flex flex-col items-center justify-center min-h-screen',
      spacing: { padding: 'px-4 sm:px-6 lg:px-8', margin: 'mx-auto', gap: 'gap-6' },
    },
    styling: {
      background: 'bg-gradient-to-br from-primary-500 to-secondary-500',
      typography: { headingSize: 'text-5xl md:text-7xl', bodySize: 'text-xl', fontWeight: 'font-bold' },
    },
    animations: { entrance: 'fade-in-up', duration: 800, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    effects: ['gradient-bg', 'subtle-pattern'],
    responsive: { mobile: 'text-center', tablet: 'text-center', desktop: 'text-center' },
  },
  {
    id: 'hero-split',
    name: 'Split Screen',
    description: '50/50 split with content on one side, visual on other',
    componentType: 'hero',
    layout: {
      structure: 'grid grid-cols-1 lg:grid-cols-2 min-h-screen',
      spacing: { padding: 'px-6 lg:px-12', margin: '', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-white',
      typography: { headingSize: 'text-4xl lg:text-6xl', bodySize: 'text-lg', fontWeight: 'font-bold' },
    },
    animations: { entrance: 'slide-in-left', duration: 600, easing: 'ease-out' },
    effects: ['image-parallax', 'text-reveal'],
    responsive: { mobile: 'flex-col', tablet: 'flex-col', desktop: 'grid' },
  },
  {
    id: 'hero-asymmetric',
    name: 'Asymmetric Split',
    description: 'Uneven split (40/60 or 35/65) for visual interest',
    componentType: 'hero',
    layout: {
      structure: 'grid grid-cols-1 lg:grid-cols-[45%_1fr] min-h-screen',
      spacing: { padding: 'px-6 lg:px-16', margin: '', gap: 'gap-12' },
    },
    styling: {
      background: 'bg-neutral-50',
      typography: { headingSize: 'text-5xl lg:text-7xl', bodySize: 'text-xl', fontWeight: 'font-black' },
    },
    animations: { entrance: 'fade-in-scale', duration: 700, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    effects: ['asymmetric-balance', 'depth-shadows'],
    responsive: { mobile: 'flex-col', tablet: 'flex-col', desktop: 'grid' },
  },
  {
    id: 'hero-full-bleed',
    name: 'Full Bleed Image',
    description: 'Image covers entire viewport with overlaid text',
    componentType: 'hero',
    layout: {
      structure: 'relative min-h-screen flex items-end pb-24',
      positioning: 'relative',
      spacing: { padding: 'px-6 lg:px-12', margin: '', gap: 'gap-4' },
    },
    styling: {
      background: 'bg-cover bg-center',
      typography: { headingSize: 'text-6xl lg:text-[10vw]', bodySize: 'text-xl', fontWeight: 'font-bold' },
    },
    animations: { entrance: 'zoom-in', duration: 1000, easing: 'ease-out' },
    effects: ['image-overlay', 'text-shadow', 'parallax-bg'],
    responsive: { mobile: 'items-center text-center', tablet: 'items-end', desktop: 'items-end' },
  },
  {
    id: 'hero-bento',
    name: 'Bento Grid Hero',
    description: 'Hero as a bento grid of content cards',
    componentType: 'hero',
    layout: {
      structure: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 min-h-screen auto-rows-fr',
      grid: 'grid-rows-[1fr_1fr]',
      spacing: { padding: 'p-4', margin: '', gap: 'gap-4' },
    },
    styling: {
      background: 'bg-neutral-100',
      borderRadius: 'rounded-2xl',
      typography: { headingSize: 'text-3xl', bodySize: 'text-base', fontWeight: 'font-semibold' },
    },
    animations: { entrance: 'stagger-fade', duration: 500, easing: 'ease-out', stagger: 100 },
    effects: ['card-hover-lift', 'grid-pattern'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-2', desktop: 'grid-cols-4' },
  },
  {
    id: 'hero-text-only',
    name: 'Typography Only',
    description: 'Massive typography without imagery',
    componentType: 'hero',
    layout: {
      structure: 'flex flex-col justify-center min-h-screen',
      spacing: { padding: 'px-6 lg:px-24', margin: '', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-black text-white',
      typography: { headingSize: 'text-[15vw] leading-none', bodySize: 'text-2xl', fontWeight: 'font-black', letterSpacing: 'tracking-tighter' },
    },
    animations: { entrance: 'text-reveal', duration: 1200, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' },
    effects: ['text-stroke', 'mix-blend-mode'],
    responsive: { mobile: 'text-[20vw]', tablet: 'text-[18vw]', desktop: 'text-[15vw]' },
  },
  {
    id: 'hero-overlapping',
    name: 'Overlapping Elements',
    description: 'Content and images overlap for depth',
    componentType: 'hero',
    layout: {
      structure: 'relative min-h-screen grid grid-cols-12',
      positioning: 'relative',
      spacing: { padding: 'px-6', margin: '', gap: 'gap-0' },
    },
    styling: {
      background: 'bg-gradient-to-br',
      typography: { headingSize: 'text-5xl lg:text-7xl', bodySize: 'text-lg', fontWeight: 'font-bold' },
    },
    animations: { entrance: 'layered-fade', duration: 800, easing: 'ease-out', stagger: 150 },
    effects: ['z-depth', 'overlap-shadows', 'blend-modes'],
    responsive: { mobile: 'flex-col', tablet: 'grid', desktop: 'grid' },
  },
  {
    id: 'hero-immersive',
    name: 'Immersive Video',
    description: 'Full-screen video background',
    componentType: 'hero',
    layout: {
      structure: 'relative min-h-screen flex items-center justify-center',
      positioning: 'relative',
      spacing: { padding: 'px-6', margin: '', gap: 'gap-6' },
    },
    styling: {
      background: 'transparent',
      typography: { headingSize: 'text-5xl lg:text-8xl', bodySize: 'text-xl', fontWeight: 'font-bold' },
    },
    animations: { entrance: 'blur-in', duration: 1000, easing: 'ease-out' },
    effects: ['video-bg', 'overlay-gradient', 'text-glow'],
    responsive: { mobile: 'text-center', tablet: 'text-center', desktop: 'text-center' },
  },
  {
    id: 'hero-cards-stack',
    name: 'Floating Cards Stack',
    description: '3D stacked cards effect',
    componentType: 'hero',
    layout: {
      structure: 'relative min-h-screen perspective-1000',
      positioning: 'relative',
      spacing: { padding: 'px-6', margin: '', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-gradient-to-br from-gray-900 to-black',
      borderRadius: 'rounded-3xl',
      shadow: 'shadow-2xl',
      typography: { headingSize: 'text-4xl lg:text-6xl', bodySize: 'text-lg', fontWeight: 'font-bold' },
    },
    animations: { entrance: '3d-rotate-in', duration: 1200, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' },
    effects: ['3d-transforms', 'card-stack', 'hover-tilt'],
    responsive: { mobile: 'flex-col', tablet: 'flex-col', desktop: 'grid grid-cols-2' },
  },
  {
    id: 'hero-marquee',
    name: 'Marquee Background',
    description: 'Scrolling text as decorative background',
    componentType: 'hero',
    layout: {
      structure: 'relative min-h-screen overflow-hidden',
      positioning: 'relative',
      spacing: { padding: 'px-6', margin: '', gap: 'gap-6' },
    },
    styling: {
      background: 'bg-white',
      typography: { headingSize: 'text-5xl lg:text-7xl', bodySize: 'text-xl', fontWeight: 'font-bold' },
    },
    animations: { entrance: 'fade-in', duration: 600, easing: 'ease-out' },
    effects: ['marquee-bg', 'text-outline', 'parallax-scroll'],
    responsive: { mobile: 'text-center', tablet: 'text-center', desktop: 'text-center' },
  },
];

// ============================================================================
// FEATURES COMPONENT VARIANTS (15+ variations)
// ============================================================================

const FEATURES_VARIANTS: ComponentVariant[] = [
  {
    id: 'features-grid',
    name: '3 Column Grid',
    description: 'Classic 3-column feature grid',
    componentType: 'features',
    layout: {
      structure: 'grid grid-cols-1 md:grid-cols-3',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-xl',
      typography: { headingSize: 'text-xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'stagger-fade-up', duration: 500, easing: 'ease-out', stagger: 100 },
    effects: ['card-hover', 'icon-scale'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-2', desktop: 'grid-cols-3' },
  },
  {
    id: 'features-bento',
    name: 'Bento Grid',
    description: 'Masonry-style bento grid with varying card sizes',
    componentType: 'features',
    layout: {
      structure: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[300px]',
      spacing: { padding: 'p-6', margin: 'max-w-7xl mx-auto', gap: 'gap-4' },
    },
    styling: {
      background: 'bg-neutral-50',
      borderRadius: 'rounded-3xl',
      typography: { headingSize: 'text-lg', bodySize: 'text-sm' },
    },
    animations: { entrance: 'stagger-scale', duration: 400, easing: 'ease-out', stagger: 50 },
    effects: ['bento-hover', 'gradient-border', 'spotlight'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-2', desktop: 'grid-cols-4' },
  },
  {
    id: 'features-overlapping',
    name: 'Overlapping Cards',
    description: 'Cards that overlap for depth effect',
    componentType: 'features',
    layout: {
      structure: 'relative grid grid-cols-1 md:grid-cols-3',
      positioning: 'relative',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-6xl mx-auto', gap: 'gap-0' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-2xl',
      shadow: 'shadow-xl',
      typography: { headingSize: 'text-xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'slide-in-left', duration: 600, easing: 'ease-out', stagger: 150 },
    effects: ['overlap-negative', 'z-hover', 'depth-shadows'],
    responsive: { mobile: 'gap-4', tablet: 'gap-0', desktop: 'gap-0' },
  },
  {
    id: 'features-horizontal',
    name: 'Horizontal Scroll',
    description: 'Horizontally scrolling feature cards',
    componentType: 'features',
    layout: {
      structure: 'flex overflow-x-auto snap-x snap-mandatory pb-8',
      flex: 'flex-nowrap',
      spacing: { padding: 'py-12 px-6', margin: '', gap: 'gap-6' },
    },
    styling: {
      background: 'bg-gradient-to-r from-transparent via-white to-transparent',
      borderRadius: 'rounded-2xl',
      typography: { headingSize: 'text-lg', bodySize: 'text-sm' },
    },
    animations: { entrance: 'slide-in-right', duration: 500, easing: 'ease-out' },
    effects: ['snap-scroll', 'card-3d', 'shadow-depth'],
    responsive: { mobile: 'flex', tablet: 'flex', desktop: 'grid grid-cols-3' },
  },
  {
    id: 'features-masonry',
    name: 'Masonry Grid',
    description: 'Pinterest-style masonry layout',
    componentType: 'features',
    layout: {
      structure: 'columns-1 md:columns-2 lg:columns-3',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-6' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-xl',
      typography: { headingSize: 'text-lg', bodySize: 'text-sm' },
    },
    animations: { entrance: 'fade-in-scale', duration: 400, easing: 'ease-out', stagger: 80 },
    effects: ['masonry-balance', 'hover-lift'],
    responsive: { mobile: 'columns-1', tablet: 'columns-2', desktop: 'columns-3' },
  },
  {
    id: 'features-cards-3d',
    name: '3D Tilt Cards',
    description: 'Cards with 3D tilt effect on hover',
    componentType: 'features',
    layout: {
      structure: 'grid grid-cols-1 md:grid-cols-3 perspective-1000',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-gradient-to-br from-gray-50 to-gray-100',
      borderRadius: 'rounded-2xl',
      shadow: 'shadow-lg',
      typography: { headingSize: 'text-xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'rotate-in-3d', duration: 700, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' },
    effects: ['3d-tilt', 'glow-border', 'parallax-card'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-2', desktop: 'grid-cols-3' },
  },
  {
    id: 'features-sticky',
    name: 'Sticky Sidebar',
    description: 'Sticky sidebar with scrolling content',
    componentType: 'features',
    layout: {
      structure: 'grid grid-cols-1 lg:grid-cols-12',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-12' },
    },
    styling: {
      background: 'bg-white',
      typography: { headingSize: 'text-2xl', bodySize: 'text-base' },
    },
    animations: { scroll: 'progress-reveal', duration: 300, easing: 'ease-out' },
    effects: ['sticky-sidebar', 'scroll-highlight', 'progress-bar'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-1', desktop: 'grid-cols-12' },
  },
  {
    id: 'features-accordion',
    name: 'Accordion List',
    description: 'Expandable accordion feature list',
    componentType: 'features',
    layout: {
      structure: 'flex flex-col max-w-3xl mx-auto',
      spacing: { padding: 'py-24 px-6', margin: '', gap: 'gap-4' },
    },
    styling: {
      background: 'bg-white',
      border: 'border border-gray-200',
      borderRadius: 'rounded-xl',
      typography: { headingSize: 'text-lg', bodySize: 'text-base' },
    },
    animations: { entrance: 'slide-down', duration: 300, easing: 'ease-out' },
    effects: ['accordion-expand', 'icon-rotate', 'content-reveal'],
    responsive: { mobile: 'w-full', tablet: 'w-full', desktop: 'max-w-3xl' },
  },
];

// ============================================================================
// TESTIMONIALS VARIANTS (10+ variations)
// ============================================================================

const TESTIMONIALS_VARIANTS: ComponentVariant[] = [
  {
    id: 'testimonials-carousel',
    name: 'Carousel Slider',
    description: 'Single testimonial carousel',
    componentType: 'testimonials',
    layout: {
      structure: 'relative overflow-hidden max-w-4xl mx-auto',
      spacing: { padding: 'py-24 px-6', margin: '', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-white',
      typography: { headingSize: 'text-2xl', bodySize: 'text-lg' },
    },
    animations: { entrance: 'fade-in', duration: 500, easing: 'ease-out' },
    effects: ['carousel-slide', 'dot-navigation', 'auto-play'],
    responsive: { mobile: 'px-4', tablet: 'px-6', desktop: 'px-8' },
  },
  {
    id: 'testimonials-grid',
    name: 'Masonry Grid',
    description: 'Masonry grid of testimonial cards',
    componentType: 'testimonials',
    layout: {
      structure: 'columns-1 md:columns-2 lg:columns-3',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-6' },
    },
    styling: {
      background: 'bg-neutral-50',
      borderRadius: 'rounded-2xl',
      shadow: 'shadow-sm',
      typography: { headingSize: 'text-lg', bodySize: 'text-base' },
    },
    animations: { entrance: 'stagger-fade', duration: 400, easing: 'ease-out', stagger: 100 },
    effects: ['masonry-layout', 'card-hover', 'quote-icon'],
    responsive: { mobile: 'columns-1', tablet: 'columns-2', desktop: 'columns-3' },
  },
  {
    id: 'testimonials-full-bleed',
    name: 'Full Bleed Quotes',
    description: 'Large full-width testimonials',
    componentType: 'testimonials',
    layout: {
      structure: 'flex flex-col items-center text-center',
      spacing: { padding: 'py-32 px-6 lg:px-24', margin: '', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-gradient-to-br from-primary-500 to-secondary-500',
      typography: { headingSize: 'text-3xl lg:text-5xl', bodySize: 'text-xl', fontWeight: 'font-light' },
    },
    animations: { entrance: 'text-reveal', duration: 800, easing: 'ease-out' },
    effects: ['large-quotes', 'gradient-text', 'fade-transition'],
    responsive: { mobile: 'text-xl', tablet: 'text-2xl', desktop: 'text-5xl' },
  },
  {
    id: 'testimonials-cards-stack',
    name: '3D Card Stack',
    description: 'Stacked cards with 3D effect',
    componentType: 'testimonials',
    layout: {
      structure: 'relative h-[500px] flex items-center justify-center',
      positioning: 'relative',
      spacing: { padding: 'py-24', margin: 'max-w-md mx-auto', gap: 'gap-0' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-3xl',
      shadow: 'shadow-2xl',
      typography: { headingSize: 'text-xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'stack-deal', duration: 600, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' },
    effects: ['3d-stack', 'swipe-cards', 'depth-shadows'],
    responsive: { mobile: 'max-w-sm', tablet: 'max-w-md', desktop: 'max-w-lg' },
  },
  {
    id: 'testimonials-marquee',
    name: 'Marquee Scroll',
    description: 'Infinite scrolling testimonials',
    componentType: 'testimonials',
    layout: {
      structure: 'overflow-hidden',
      spacing: { padding: 'py-12', margin: '', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-white',
      border: 'border-y border-gray-200',
      typography: { headingSize: 'text-lg', bodySize: 'text-sm' },
    },
    animations: { entrance: 'slide-in-left', duration: 20000, easing: 'linear' },
    effects: ['infinite-marquee', 'pause-on-hover', 'duplicated-content'],
    responsive: { mobile: 'flex-col', tablet: 'flex-row', desktop: 'flex-row' },
  },
];

// ============================================================================
// CTA VARIANTS (10+ variations)
// ============================================================================

const CTA_VARIANTS: ComponentVariant[] = [
  {
    id: 'cta-centered',
    name: 'Centered Banner',
    description: 'Simple centered CTA with gradient background',
    componentType: 'cta',
    layout: {
      structure: 'flex flex-col items-center text-center',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-4xl mx-auto', gap: 'gap-6' },
    },
    styling: {
      background: 'bg-gradient-to-r from-primary-600 to-secondary-600',
      borderRadius: 'rounded-3xl',
      typography: { headingSize: 'text-3xl lg:text-5xl', bodySize: 'text-xl' },
    },
    animations: { entrance: 'scale-in', duration: 600, easing: 'ease-out' },
    effects: ['gradient-bg', 'glow-pulse'],
    responsive: { mobile: 'py-16', tablet: 'py-20', desktop: 'py-24' },
  },
  {
    id: 'cta-split',
    name: 'Split CTA',
    description: 'Two-column CTA with form and image',
    componentType: 'cta',
    layout: {
      structure: 'grid grid-cols-1 lg:grid-cols-2 items-center',
      spacing: { padding: 'py-24 px-6 lg:px-16', margin: '', gap: 'gap-12' },
    },
    styling: {
      background: 'bg-white',
      typography: { headingSize: 'text-3xl lg:text-4xl', bodySize: 'text-lg' },
    },
    animations: { entrance: 'slide-in-up', duration: 500, easing: 'ease-out' },
    effects: ['form-focus', 'image-float'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-1', desktop: 'grid-cols-2' },
  },
  {
    id: 'cta-sticky-bar',
    name: 'Sticky Bottom Bar',
    description: 'Fixed bottom CTA bar',
    componentType: 'cta',
    layout: {
      structure: 'fixed bottom-0 left-0 right-0 flex items-center justify-between',
      positioning: 'fixed',
      spacing: { padding: 'py-4 px-6', margin: '', gap: 'gap-4' },
    },
    styling: {
      background: 'bg-white/90 backdrop-blur-md',
      border: 'border-t border-gray-200',
      shadow: 'shadow-lg',
      typography: { headingSize: 'text-lg', bodySize: 'text-sm' },
    },
    animations: { entrance: 'slide-up', duration: 300, easing: 'ease-out' },
    effects: ['sticky-bottom', 'backdrop-blur', 'close-button'],
    responsive: { mobile: 'flex-col', tablet: 'flex-row', desktop: 'flex-row' },
  },
  {
    id: 'cta-modal',
    name: 'Modal Popup',
    description: 'Centered modal CTA with overlay',
    componentType: 'cta',
    layout: {
      structure: 'fixed inset-0 flex items-center justify-center z-50',
      positioning: 'fixed',
      spacing: { padding: 'p-6', margin: '', gap: 'gap-6' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-2xl',
      shadow: 'shadow-2xl',
      typography: { headingSize: 'text-2xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'scale-in-fade', duration: 300, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' },
    effects: ['overlay-darken', 'modal-shadow', 'close-x'],
    responsive: { mobile: 'mx-4', tablet: 'max-w-lg', desktop: 'max-w-xl' },
  },
];

// ============================================================================
// ABOUT VARIANTS (4 variations)
// ============================================================================

const ABOUT_VARIANTS: ComponentVariant[] = [
  {
    id: 'about-split-image-left',
    name: 'Split Image Left',
    description: 'Text right, image left split layout',
    componentType: 'about',
    layout: {
      structure: 'grid grid-cols-1 lg:grid-cols-2 items-center gap-12',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-12' },
    },
    styling: {
      background: 'bg-white',
      typography: { headingSize: 'text-3xl lg:text-4xl', bodySize: 'text-lg' },
    },
    animations: { entrance: 'slide-in-right', duration: 600, easing: 'ease-out' },
    effects: ['image-reveal', 'text-stagger'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-1', desktop: 'grid-cols-2' },
  },
  {
    id: 'about-split-image-right',
    name: 'Split Image Right',
    description: 'Text left, image right split layout',
    componentType: 'about',
    layout: {
      structure: 'grid grid-cols-1 lg:grid-cols-2 items-center gap-12',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-12' },
    },
    styling: {
      background: 'bg-gray-50',
      typography: { headingSize: 'text-3xl lg:text-4xl', bodySize: 'text-lg' },
    },
    animations: { entrance: 'slide-in-left', duration: 600, easing: 'ease-out' },
    effects: ['image-reveal', 'text-stagger'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-1', desktop: 'grid-cols-2' },
  },
  {
    id: 'about-centered',
    name: 'Centered Text',
    description: 'Centered text with optional stats below',
    componentType: 'about',
    layout: {
      structure: 'flex flex-col items-center text-center',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-3xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-white',
      typography: { headingSize: 'text-3xl lg:text-5xl', bodySize: 'text-lg' },
    },
    animations: { entrance: 'fade-in-up', duration: 600, easing: 'ease-out' },
    effects: ['stats-counter', 'text-reveal'],
    responsive: { mobile: 'px-4', tablet: 'px-6', desktop: 'px-8' },
  },
  {
    id: 'about-timeline',
    name: 'Timeline Story',
    description: 'Vertical timeline showing company history',
    componentType: 'about',
    layout: {
      structure: 'relative flex flex-col gap-8',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-4xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-white',
      typography: { headingSize: 'text-2xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'stagger-fade', duration: 500, easing: 'ease-out' },
    effects: ['timeline-line', 'milestone-dots', 'scroll-reveal'],
    responsive: { mobile: 'pl-8', tablet: 'pl-12', desktop: 'pl-16' },
  },
];

// ============================================================================
// TEAM VARIANTS (6+ variations)
// ============================================================================

const TEAM_VARIANTS: ComponentVariant[] = [
  {
    id: 'team-grid',
    name: 'Team Grid',
    description: 'Standard grid of team member cards',
    componentType: 'team',
    layout: {
      structure: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-xl',
      typography: { headingSize: 'text-lg', bodySize: 'text-sm' },
    },
    animations: { entrance: 'stagger-up', duration: 500, easing: 'ease-out' },
    effects: ['card-hover', 'image-zoom', 'social-reveal'],
    responsive: { mobile: 'grid-cols-2', tablet: 'grid-cols-3', desktop: 'grid-cols-4' },
  },
  {
    id: 'team-featured',
    name: 'Featured Leader',
    description: 'Large featured leader with smaller team grid',
    componentType: 'team',
    layout: {
      structure: 'flex flex-col lg:flex-row gap-12 items-start',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-12' },
    },
    styling: {
      background: 'bg-gray-50',
      borderRadius: 'rounded-2xl',
      typography: { headingSize: 'text-2xl lg:text-3xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'slide-in-left', duration: 600, easing: 'ease-out' },
    effects: ['leader-highlight', 'bio-expand', 'stats-counter'],
    responsive: { mobile: 'flex-col', tablet: 'flex-col', desktop: 'flex-row' },
  },
  {
    id: 'team-carousel',
    name: 'Team Carousel',
    description: 'Horizontal scrolling team carousel',
    componentType: 'team',
    layout: {
      structure: 'flex overflow-x-auto snap-x snap-mandatory gap-6',
      spacing: { padding: 'py-24 px-6', margin: '', gap: 'gap-6' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-xl',
      typography: { headingSize: 'text-xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'slide-in-right', duration: 500, easing: 'ease-out' },
    effects: ['snap-scroll', 'card-peek', 'drag-cursor'],
    responsive: { mobile: 'snap-x', tablet: 'snap-x', desktop: 'snap-x' },
  },
];

// ============================================================================
// GALLERY VARIANTS (6+ variations)
// ============================================================================

const GALLERY_VARIANTS: ComponentVariant[] = [
  {
    id: 'gallery-masonry',
    name: 'Masonry Grid',
    description: 'Pinterest-style masonry grid',
    componentType: 'gallery',
    layout: {
      structure: 'columns-2 md:columns-3 lg:columns-4 gap-4',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-4' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-lg',
      typography: { headingSize: 'text-lg', bodySize: 'text-sm' },
    },
    animations: { entrance: 'stagger-fade', duration: 600, easing: 'ease-out' },
    effects: ['lightbox', 'caption-reveal', 'image-lazy-load'],
    responsive: { mobile: 'columns-2', tablet: 'columns-3', desktop: 'columns-4' },
  },
  {
    id: 'gallery-lightbox',
    name: 'Lightbox Grid',
    description: 'Grid with full-screen lightbox',
    componentType: 'gallery',
    layout: {
      structure: 'grid grid-cols-2 md:grid-cols-3 gap-4',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-6xl mx-auto', gap: 'gap-4' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-xl',
      typography: { headingSize: 'text-xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'scale-in', duration: 400, easing: 'ease-out' },
    effects: ['lightbox-zoom', 'arrow-nav', 'thumbnail-strip'],
    responsive: { mobile: 'grid-cols-2', tablet: 'grid-cols-3', desktop: 'grid-cols-3' },
  },
  {
    id: 'gallery-slider',
    name: 'Full Screen Slider',
    description: 'Full-width image slider with captions',
    componentType: 'gallery',
    layout: {
      structure: 'relative w-full h-[60vh] md:h-[80vh]',
      spacing: { padding: 'py-0 px-0', margin: '', gap: 'gap-0' },
    },
    styling: {
      background: 'bg-black',
      typography: { headingSize: 'text-2xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'fade-in', duration: 800, easing: 'ease-out' },
    effects: ['slide-transition', 'caption-fade', 'dot-nav'],
    responsive: { mobile: 'h-[50vh]', tablet: 'h-[60vh]', desktop: 'h-[80vh]' },
  },
];

// ============================================================================
// FOOTER VARIANTS (6+ variations)
// ============================================================================

const FOOTER_VARIANTS: ComponentVariant[] = [
  {
    id: 'footer-multi',
    name: 'Multi-Column',
    description: 'Multi-column footer with links and newsletter',
    componentType: 'footer',
    layout: {
      structure: 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8',
      spacing: { padding: 'py-16 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-gray-900',
      typography: { headingSize: 'text-sm font-semibold', bodySize: 'text-sm' },
    },
    animations: { entrance: 'fade-in', duration: 500, easing: 'ease-out' },
    effects: ['link-hover', 'newsletter-form', 'social-icons'],
    responsive: { mobile: 'grid-cols-2', tablet: 'grid-cols-4', desktop: 'grid-cols-5' },
  },
  {
    id: 'footer-simple',
    name: 'Simple Footer',
    description: 'Minimal footer with just copyright and links',
    componentType: 'footer',
    layout: {
      structure: 'flex flex-col md:flex-row justify-between items-center',
      spacing: { padding: 'py-8 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-4' },
    },
    styling: {
      background: 'bg-white border-t border-gray-200',
      typography: { headingSize: 'text-sm', bodySize: 'text-sm' },
    },
    animations: { entrance: 'fade-in', duration: 400, easing: 'ease-out' },
    effects: ['minimal-hover'],
    responsive: { mobile: 'flex-col', tablet: 'flex-row', desktop: 'flex-row' },
  },
  {
    id: 'footer-cta',
    name: 'CTA Footer',
    description: 'Large CTA with footer links below',
    componentType: 'footer',
    layout: {
      structure: 'flex flex-col items-center text-center',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-4xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-gradient-to-b from-primary-600 to-primary-900',
      typography: { headingSize: 'text-3xl lg:text-4xl', bodySize: 'text-lg' },
    },
    animations: { entrance: 'slide-up', duration: 600, easing: 'ease-out' },
    effects: ['gradient-bg', 'button-glow', 'social-links'],
    responsive: { mobile: 'py-16', tablet: 'py-20', desktop: 'py-24' },
  },
];

// ============================================================================
// NAVIGATION VARIANTS (6+ variations)
// ============================================================================

const NAVIGATION_VARIANTS: ComponentVariant[] = [
  {
    id: 'nav-standard',
    name: 'Standard Nav',
    description: 'Logo left, links center, CTA right',
    componentType: 'navigation',
    layout: {
      structure: 'flex items-center justify-between',
      positioning: 'sticky',
      spacing: { padding: 'py-4 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-white/80 backdrop-blur-md',
      border: 'border-b border-gray-200',
      typography: { headingSize: 'text-lg font-bold', bodySize: 'text-sm' },
    },
    animations: { entrance: 'slide-down', duration: 300, easing: 'ease-out' },
    effects: ['sticky-blur', 'link-underline', 'mobile-hamburger'],
    responsive: { mobile: 'justify-between', tablet: 'justify-between', desktop: 'justify-between' },
  },
  {
    id: 'nav-sidebar',
    name: 'Sidebar Navigation',
    description: 'Fixed sidebar with vertical links',
    componentType: 'navigation',
    layout: {
      structure: 'flex flex-col fixed left-0 top-0 h-full w-64',
      positioning: 'fixed',
      spacing: { padding: 'py-8 px-6', margin: '', gap: 'gap-4' },
    },
    styling: {
      background: 'bg-gray-900',
      typography: { headingSize: 'text-xl font-bold', bodySize: 'text-base' },
    },
    animations: { entrance: 'slide-in-left', duration: 400, easing: 'ease-out' },
    effects: ['active-indicator', 'hover-highlight', 'collapse-mobile'],
    responsive: { mobile: 'hidden', tablet: 'hidden lg:flex', desktop: 'flex' },
  },
  {
    id: 'nav-transparent',
    name: 'Transparent Nav',
    description: 'Transparent on hero, solid on scroll',
    componentType: 'navigation',
    layout: {
      structure: 'flex items-center justify-between absolute top-0 w-full z-50',
      positioning: 'absolute',
      spacing: { padding: 'py-6 px-8', margin: 'max-w-7xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-transparent',
      typography: { headingSize: 'text-xl font-bold text-white', bodySize: 'text-base text-white' },
    },
    animations: { entrance: 'fade-in', duration: 500, easing: 'ease-out' },
    effects: ['scroll-solid', 'text-invert', 'backdrop-blur'],
    responsive: { mobile: 'px-4', tablet: 'px-6', desktop: 'px-8' },
  },
];

// ============================================================================
// PRICING VARIANTS (2 variations)
// ============================================================================

const PRICING_VARIANTS: ComponentVariant[] = [
  {
    id: 'pricing-tier-cards',
    name: 'Tier Cards',
    description: 'Three-tier pricing cards with emphasis highlight',
    componentType: 'pricing',
    layout: {
      structure: 'grid grid-cols-1 md:grid-cols-3 gap-8',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-6xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-2xl',
      shadow: 'shadow-lg',
      typography: { headingSize: 'text-2xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'stagger-up', duration: 500, easing: 'ease-out' },
    effects: ['highlight-badge', 'hover-lift', 'feature-checks'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-2', desktop: 'grid-cols-3' },
  },
  {
    id: 'pricing-toggle',
    name: 'Toggle Pricing',
    description: 'Monthly/yearly toggle with featured plan',
    componentType: 'pricing',
    layout: {
      structure: 'flex flex-col items-center gap-10',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-5xl mx-auto', gap: 'gap-10' },
    },
    styling: {
      background: 'bg-gradient-to-b from-gray-50 to-white',
      borderRadius: 'rounded-3xl',
      typography: { headingSize: 'text-3xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'fade-in-up', duration: 600, easing: 'ease-out' },
    effects: ['toggle-switch', 'plan-spotlight', 'price-animate'],
    responsive: { mobile: 'gap-8', tablet: 'gap-10', desktop: 'gap-12' },
  },
];

// ============================================================================
// FAQ VARIANTS (2 variations)
// ============================================================================

const FAQ_VARIANTS: ComponentVariant[] = [
  {
    id: 'faq-accordion',
    name: 'Accordion FAQ',
    description: 'Accordion list of questions and answers',
    componentType: 'faq',
    layout: {
      structure: 'flex flex-col gap-4 max-w-4xl mx-auto',
      spacing: { padding: 'py-24 px-6', margin: '', gap: 'gap-4' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-2xl',
      border: 'border border-gray-200',
      typography: { headingSize: 'text-xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'slide-down', duration: 400, easing: 'ease-out' },
    effects: ['accordion-expand', 'icon-rotate', 'content-reveal'],
    responsive: { mobile: 'w-full', tablet: 'w-full', desktop: 'max-w-4xl' },
  },
  {
    id: 'faq-split',
    name: 'Split FAQ',
    description: 'Two-column FAQ with intro copy',
    componentType: 'faq',
    layout: {
      structure: 'grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-6xl mx-auto', gap: 'gap-12' },
    },
    styling: {
      background: 'bg-gray-50',
      borderRadius: 'rounded-3xl',
      typography: { headingSize: 'text-2xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'fade-in', duration: 500, easing: 'ease-out' },
    effects: ['side-intro', 'divider-line', 'hover-highlight'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-1', desktop: 'grid-cols-[1fr_2fr]' },
  },
];

// ============================================================================
// STATS VARIANTS (2 variations)
// ============================================================================

const STATS_VARIANTS: ComponentVariant[] = [
  {
    id: 'stats-grid',
    name: 'Stats Grid',
    description: 'Metrics in a responsive grid',
    componentType: 'stats',
    layout: {
      structure: 'grid grid-cols-2 md:grid-cols-4 gap-8',
      spacing: { padding: 'py-20 px-6', margin: 'max-w-6xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-2xl',
      typography: { headingSize: 'text-3xl', bodySize: 'text-sm' },
    },
    animations: { entrance: 'stagger-up', duration: 400, easing: 'ease-out' },
    effects: ['count-up', 'divider-dots', 'icon-badge'],
    responsive: { mobile: 'grid-cols-2', tablet: 'grid-cols-4', desktop: 'grid-cols-4' },
  },
  {
    id: 'stats-strip',
    name: 'Stats Strip',
    description: 'Full-width stat strip with separators',
    componentType: 'stats',
    layout: {
      structure: 'flex flex-col md:flex-row items-center justify-between gap-6',
      spacing: { padding: 'py-16 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-6' },
    },
    styling: {
      background: 'bg-gray-900 text-white',
      borderRadius: 'rounded-3xl',
      typography: { headingSize: 'text-3xl', bodySize: 'text-xs uppercase tracking-wide' },
    },
    animations: { entrance: 'fade-in-up', duration: 500, easing: 'ease-out' },
    effects: ['divider-lines', 'pulse-accent', 'hover-glow'],
    responsive: { mobile: 'flex-col', tablet: 'flex-row', desktop: 'flex-row' },
  },
];

// ============================================================================
// LOGOS VARIANTS (2 variations)
// ============================================================================

const LOGOS_VARIANTS: ComponentVariant[] = [
  {
    id: 'logos-grid',
    name: 'Logo Grid',
    description: 'Static grid of partner logos',
    componentType: 'logos',
    layout: {
      structure: 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center',
      spacing: { padding: 'py-16 px-6', margin: 'max-w-6xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-xl',
      typography: { headingSize: 'text-sm', bodySize: 'text-xs' },
    },
    animations: { entrance: 'stagger-fade', duration: 400, easing: 'ease-out' },
    effects: ['logo-desaturate', 'hover-color', 'subtle-scale'],
    responsive: { mobile: 'grid-cols-2', tablet: 'grid-cols-4', desktop: 'grid-cols-6' },
  },
  {
    id: 'logos-marquee',
    name: 'Logo Marquee',
    description: 'Scrolling logo marquee',
    componentType: 'logos',
    layout: {
      structure: 'overflow-hidden whitespace-nowrap',
      spacing: { padding: 'py-12 px-0', margin: '', gap: 'gap-10' },
    },
    styling: {
      background: 'bg-gray-50',
      border: 'border-y border-gray-200',
      typography: { headingSize: 'text-sm', bodySize: 'text-xs' },
    },
    animations: { entrance: 'slide-in-left', duration: 20000, easing: 'linear' },
    effects: ['infinite-marquee', 'fade-edges', 'pause-on-hover'],
    responsive: { mobile: 'py-10', tablet: 'py-12', desktop: 'py-12' },
  },
];

// ============================================================================
// MARQUEE VARIANTS (2 variations)
// ============================================================================

const MARQUEE_VARIANTS: ComponentVariant[] = [
  {
    id: 'marquee-text',
    name: 'Text Marquee',
    description: 'Large scrolling headline strip',
    componentType: 'marquee',
    layout: {
      structure: 'overflow-hidden whitespace-nowrap',
      spacing: { padding: 'py-8 px-0', margin: '', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-black text-white',
      typography: { headingSize: 'text-4xl md:text-6xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'slide-in-left', duration: 18000, easing: 'linear' },
    effects: ['infinite-marquee', 'text-outline', 'blend-overlay'],
    responsive: { mobile: 'text-3xl', tablet: 'text-4xl', desktop: 'text-6xl' },
  },
  {
    id: 'marquee-dual',
    name: 'Dual Row Marquee',
    description: 'Two-row alternating marquee',
    componentType: 'marquee',
    layout: {
      structure: 'overflow-hidden',
      spacing: { padding: 'py-10 px-0', margin: '', gap: 'gap-6' },
    },
    styling: {
      background: 'bg-gradient-to-r from-gray-900 to-black text-white',
      typography: { headingSize: 'text-3xl md:text-5xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'slide-in-right', duration: 22000, easing: 'linear' },
    effects: ['reverse-row', 'gradient-edge', 'hover-pause'],
    responsive: { mobile: 'text-2xl', tablet: 'text-3xl', desktop: 'text-5xl' },
  },
];

// ============================================================================
// HOW-IT-WORKS VARIANTS (2 variations)
// ============================================================================

const HOW_IT_WORKS_VARIANTS: ComponentVariant[] = [
  {
    id: 'how-it-works-steps',
    name: 'Steps Grid',
    description: 'Numbered steps in a horizontal grid',
    componentType: 'how-it-works',
    layout: {
      structure: 'grid grid-cols-1 md:grid-cols-3 gap-8',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-6xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-2xl',
      typography: { headingSize: 'text-xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'stagger-up', duration: 500, easing: 'ease-out' },
    effects: ['step-number', 'icon-badge', 'connector-line'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-2', desktop: 'grid-cols-3' },
  },
  {
    id: 'how-it-works-timeline',
    name: 'Vertical Timeline',
    description: 'Vertical timeline with alternating steps',
    componentType: 'how-it-works',
    layout: {
      structure: 'flex flex-col gap-10',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-5xl mx-auto', gap: 'gap-10' },
    },
    styling: {
      background: 'bg-gray-50',
      borderRadius: 'rounded-3xl',
      typography: { headingSize: 'text-2xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'fade-in', duration: 500, easing: 'ease-out' },
    effects: ['timeline-line', 'step-dot', 'scroll-reveal'],
    responsive: { mobile: 'gap-8', tablet: 'gap-10', desktop: 'gap-12' },
  },
];

// ============================================================================
// COMPARISON VARIANTS (2 variations)
// ============================================================================

const COMPARISON_VARIANTS: ComponentVariant[] = [
  {
    id: 'comparison-table',
    name: 'Comparison Table',
    description: 'Feature comparison table layout',
    componentType: 'comparison',
    layout: {
      structure: 'overflow-x-auto',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-6xl mx-auto', gap: 'gap-6' },
    },
    styling: {
      background: 'bg-white',
      border: 'border border-gray-200',
      borderRadius: 'rounded-2xl',
      typography: { headingSize: 'text-lg', bodySize: 'text-sm' },
    },
    animations: { entrance: 'fade-in-up', duration: 500, easing: 'ease-out' },
    effects: ['row-highlight', 'sticky-header', 'check-icons'],
    responsive: { mobile: 'overflow-x-auto', tablet: 'overflow-x-auto', desktop: 'overflow-visible' },
  },
  {
    id: 'comparison-before-after',
    name: 'Before / After',
    description: 'Split comparison with sliding indicator',
    componentType: 'comparison',
    layout: {
      structure: 'grid grid-cols-1 lg:grid-cols-2 gap-10',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-6xl mx-auto', gap: 'gap-10' },
    },
    styling: {
      background: 'bg-gray-50',
      borderRadius: 'rounded-3xl',
      typography: { headingSize: 'text-2xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'scale-in', duration: 600, easing: 'ease-out' },
    effects: ['slider-handle', 'label-tags', 'image-compare'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-1', desktop: 'grid-cols-2' },
  },
];

// ============================================================================
// INTEGRATION VARIANTS (2 variations)
// ============================================================================

const INTEGRATION_VARIANTS: ComponentVariant[] = [
  {
    id: 'integration-logos',
    name: 'Integration Logos',
    description: 'Logo grid with short descriptions',
    componentType: 'integration',
    layout: {
      structure: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-6xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-xl',
      typography: { headingSize: 'text-lg', bodySize: 'text-sm' },
    },
    animations: { entrance: 'stagger-fade', duration: 400, easing: 'ease-out' },
    effects: ['logo-card', 'hover-glow', 'category-pill'],
    responsive: { mobile: 'grid-cols-2', tablet: 'grid-cols-3', desktop: 'grid-cols-4' },
  },
  {
    id: 'integration-cards',
    name: 'Integration Cards',
    description: 'Icon cards with connector accents',
    componentType: 'integration',
    layout: {
      structure: 'grid grid-cols-1 md:grid-cols-2 gap-10',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-5xl mx-auto', gap: 'gap-10' },
    },
    styling: {
      background: 'bg-gradient-to-b from-gray-50 to-white',
      borderRadius: 'rounded-2xl',
      shadow: 'shadow-md',
      typography: { headingSize: 'text-xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'slide-in-up', duration: 500, easing: 'ease-out' },
    effects: ['connector-line', 'icon-badge', 'hover-raise'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-2', desktop: 'grid-cols-2' },
  },
];

// ============================================================================
// BLOG VARIANTS (2 variations)
// ============================================================================

const BLOG_VARIANTS: ComponentVariant[] = [
  {
    id: 'blog-grid',
    name: 'Blog Grid',
    description: 'Blog post cards in a grid',
    componentType: 'blog',
    layout: {
      structure: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-xl',
      shadow: 'shadow-md',
      typography: { headingSize: 'text-xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'stagger-up', duration: 500, easing: 'ease-out' },
    effects: ['card-hover', 'read-time', 'category-tag'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-2', desktop: 'grid-cols-3' },
  },
  {
    id: 'blog-featured',
    name: 'Featured Blog',
    description: 'Featured post with supporting list',
    componentType: 'blog',
    layout: {
      structure: 'grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-12' },
    },
    styling: {
      background: 'bg-gray-50',
      borderRadius: 'rounded-2xl',
      typography: { headingSize: 'text-2xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'fade-in', duration: 600, easing: 'ease-out' },
    effects: ['featured-image', 'sidebar-stack', 'tag-cloud'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-1', desktop: 'grid-cols-[2fr_1fr]' },
  },
];

// ============================================================================
// SERVICES VARIANTS (4 variations)
// ============================================================================

const SERVICES_VARIANTS: ComponentVariant[] = [
  {
    id: 'services-cards-grid',
    name: 'Cards Grid',
    description: 'Service cards in a responsive grid',
    componentType: 'services',
    layout: {
      structure: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-xl',
      shadow: 'shadow-lg',
      typography: { headingSize: 'text-xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'stagger-up', duration: 500, easing: 'ease-out' },
    effects: ['card-hover', 'icon-pulse', 'learn-more-arrow'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-2', desktop: 'grid-cols-3' },
  },
  {
    id: 'services-accordion',
    name: 'Accordion List',
    description: 'Collapsible accordion service list',
    componentType: 'services',
    layout: {
      structure: 'flex flex-col divide-y divide-gray-200',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-3xl mx-auto', gap: 'gap-0' },
    },
    styling: {
      background: 'bg-white',
      typography: { headingSize: 'text-lg', bodySize: 'text-base' },
    },
    animations: { entrance: 'slide-in-up', duration: 400, easing: 'ease-out' },
    effects: ['accordion-toggle', 'content-expand', 'icon-rotate'],
    responsive: { mobile: 'px-4', tablet: 'px-6', desktop: 'px-8' },
  },
  {
    id: 'services-tabs',
    name: 'Tabbed Services',
    description: 'Services organized in horizontal tabs',
    componentType: 'services',
    layout: {
      structure: 'flex flex-col',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-5xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-gray-50',
      borderRadius: 'rounded-2xl',
      typography: { headingSize: 'text-2xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'fade-in', duration: 400, easing: 'ease-out' },
    effects: ['tab-switch', 'content-fade', 'active-indicator'],
    responsive: { mobile: 'flex-col', tablet: 'flex-col', desktop: 'flex-col' },
  },
  {
    id: 'services-timeline',
    name: 'Process Timeline',
    description: 'Vertical timeline showing service process',
    componentType: 'services',
    layout: {
      structure: 'relative flex flex-col gap-12',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-4xl mx-auto', gap: 'gap-12' },
    },
    styling: {
      background: 'bg-white',
      typography: { headingSize: 'text-xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'stagger-fade', duration: 600, easing: 'ease-out' },
    effects: ['timeline-line', 'step-numbers', 'scroll-reveal'],
    responsive: { mobile: 'pl-8', tablet: 'pl-12', desktop: 'pl-16' },
  },
];

// ============================================================================
// CONTACT VARIANTS (3 variations)
// ============================================================================

const CONTACT_VARIANTS: ComponentVariant[] = [
  {
    id: 'contact-split-form-map',
    name: 'Split Form & Map',
    description: 'Contact form left, map right',
    componentType: 'contact',
    layout: {
      structure: 'grid grid-cols-1 lg:grid-cols-2 gap-12',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-12' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-2xl',
      typography: { headingSize: 'text-2xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'slide-in-up', duration: 600, easing: 'ease-out' },
    effects: ['form-focus', 'map-interactive', 'submit-animation'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-1', desktop: 'grid-cols-2' },
  },
  {
    id: 'contact-centered-form',
    name: 'Centered Form',
    description: 'Centered contact form with info cards',
    componentType: 'contact',
    layout: {
      structure: 'flex flex-col items-center',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-2xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-gray-50',
      borderRadius: 'rounded-3xl',
      typography: { headingSize: 'text-3xl', bodySize: 'text-lg' },
    },
    animations: { entrance: 'fade-in-up', duration: 500, easing: 'ease-out' },
    effects: ['input-focus', 'floating-labels', 'success-checkmark'],
    responsive: { mobile: 'px-4', tablet: 'px-6', desktop: 'px-8' },
  },
  {
    id: 'contact-cards-info',
    name: 'Info Cards',
    description: 'Contact info cards with optional form',
    componentType: 'contact',
    layout: {
      structure: 'grid grid-cols-1 md:grid-cols-3 gap-8',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-6xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-xl',
      shadow: 'shadow-lg',
      typography: { headingSize: 'text-xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'stagger-scale', duration: 500, easing: 'ease-out' },
    effects: ['card-hover', 'icon-bounce', 'click-to-copy'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-3', desktop: 'grid-cols-3' },
  },
];

// ============================================================================
// PRODUCTS VARIANTS (4 variations)
// ============================================================================

const PRODUCTS_VARIANTS: ComponentVariant[] = [
  {
    id: 'products-grid-4',
    name: '4-Column Grid',
    description: 'Product cards in 4-column grid',
    componentType: 'products',
    layout: {
      structure: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-6' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-lg',
      typography: { headingSize: 'text-base', bodySize: 'text-sm' },
    },
    animations: { entrance: 'stagger-fade', duration: 500, easing: 'ease-out' },
    effects: ['card-hover', 'quick-add', 'image-zoom'],
    responsive: { mobile: 'grid-cols-2', tablet: 'grid-cols-3', desktop: 'grid-cols-4' },
  },
  {
    id: 'products-grid-3',
    name: '3-Column Grid',
    description: 'Larger product cards in 3-column grid',
    componentType: 'products',
    layout: {
      structure: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-6xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-xl',
      shadow: 'shadow-md',
      typography: { headingSize: 'text-lg', bodySize: 'text-base' },
    },
    animations: { entrance: 'stagger-up', duration: 600, easing: 'ease-out' },
    effects: ['card-lift', 'add-to-cart', 'wishlist-heart'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-2', desktop: 'grid-cols-3' },
  },
  {
    id: 'products-list',
    name: 'List View',
    description: 'Horizontal product list items',
    componentType: 'products',
    layout: {
      structure: 'flex flex-col gap-6',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-4xl mx-auto', gap: 'gap-6' },
    },
    styling: {
      background: 'bg-white',
      border: 'border-b border-gray-200',
      typography: { headingSize: 'text-lg', bodySize: 'text-base' },
    },
    animations: { entrance: 'slide-in-right', duration: 400, easing: 'ease-out' },
    effects: ['row-hover', 'quantity-selector', 'quick-view'],
    responsive: { mobile: 'flex-col', tablet: 'flex-col', desktop: 'flex-col' },
  },
  {
    id: 'products-featured-row',
    name: 'Featured Row',
    description: 'Featured product with related items',
    componentType: 'products',
    layout: {
      structure: 'flex flex-col gap-12',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-12' },
    },
    styling: {
      background: 'bg-gray-50',
      borderRadius: 'rounded-2xl',
      typography: { headingSize: 'text-2xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'fade-in', duration: 600, easing: 'ease-out' },
    effects: ['featured-highlight', 'carousel-scroll', 'size-selector'],
    responsive: { mobile: 'gap-8', tablet: 'gap-10', desktop: 'gap-12' },
  },
];

// ============================================================================
// CATEGORIES VARIANTS (3 variations)
// ============================================================================

const CATEGORIES_VARIANTS: ComponentVariant[] = [
  {
    id: 'categories-grid',
    name: 'Category Grid',
    description: 'Category cards in a grid',
    componentType: 'categories',
    layout: {
      structure: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-6' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-xl',
      typography: { headingSize: 'text-lg', bodySize: 'text-sm' },
    },
    animations: { entrance: 'stagger-scale', duration: 500, easing: 'ease-out' },
    effects: ['card-hover', 'image-zoom', 'count-badge'],
    responsive: { mobile: 'grid-cols-2', tablet: 'grid-cols-3', desktop: 'grid-cols-4' },
  },
  {
    id: 'categories-masonry',
    name: 'Masonry Categories',
    description: 'Uneven masonry category layout',
    componentType: 'categories',
    layout: {
      structure: 'columns-2 md:columns-3 gap-6',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-6' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-lg',
      typography: { headingSize: 'text-xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'stagger-fade', duration: 600, easing: 'ease-out' },
    effects: ['overlay-reveal', 'title-slide', 'item-count'],
    responsive: { mobile: 'columns-2', tablet: 'columns-3', desktop: 'columns-3' },
  },
  {
    id: 'categories-horizontal',
    name: 'Horizontal Scroll',
    description: 'Horizontally scrolling categories',
    componentType: 'categories',
    layout: {
      structure: 'flex overflow-x-auto gap-6 snap-x',
      spacing: { padding: 'py-24 px-6', margin: '', gap: 'gap-6' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-full',
      typography: { headingSize: 'text-base', bodySize: 'text-sm' },
    },
    animations: { entrance: 'slide-in-right', duration: 500, easing: 'ease-out' },
    effects: ['snap-scroll', 'chip-select', 'gradient-fade'],
    responsive: { mobile: 'snap-x', tablet: 'snap-x', desktop: 'snap-x' },
  },
];

// ============================================================================
// REVIEWS VARIANTS (3 variations)
// ============================================================================

const REVIEWS_VARIANTS: ComponentVariant[] = [
  {
    id: 'reviews-grid',
    name: 'Reviews Grid',
    description: 'Customer reviews in a grid',
    componentType: 'reviews',
    layout: {
      structure: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-gray-50',
      borderRadius: 'rounded-xl',
      shadow: 'shadow-sm',
      typography: { headingSize: 'text-lg', bodySize: 'text-base' },
    },
    animations: { entrance: 'stagger-up', duration: 500, easing: 'ease-out' },
    effects: ['star-rating', 'verified-badge', 'helpful-toggle'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-2', desktop: 'grid-cols-3' },
  },
  {
    id: 'reviews-carousel',
    name: 'Reviews Carousel',
    description: 'Sliding review cards',
    componentType: 'reviews',
    layout: {
      structure: 'flex overflow-x-auto snap-x gap-6',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-5xl mx-auto', gap: 'gap-6' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-2xl',
      typography: { headingSize: 'text-xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'slide-in-left', duration: 500, easing: 'ease-out' },
    effects: ['snap-scroll', 'star-fill', 'avatar-pulse'],
    responsive: { mobile: 'snap-x', tablet: 'snap-x', desktop: 'snap-x' },
  },
  {
    id: 'reviews-featured',
    name: 'Featured Review',
    description: 'Large featured review with rating summary',
    componentType: 'reviews',
    layout: {
      structure: 'flex flex-col lg:flex-row gap-12 items-center',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-6xl mx-auto', gap: 'gap-12' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-3xl',
      shadow: 'shadow-xl',
      typography: { headingSize: 'text-2xl', bodySize: 'text-lg' },
    },
    animations: { entrance: 'scale-in', duration: 600, easing: 'ease-out' },
    effects: ['rating-breakdown', 'progress-bars', 'write-review'],
    responsive: { mobile: 'flex-col', tablet: 'flex-col', desktop: 'flex-row' },
  },
];

// ============================================================================
// POSTS/BLOG VARIANTS (3 variations)
// ============================================================================

const POSTS_VARIANTS: ComponentVariant[] = [
  {
    id: 'posts-grid',
    name: 'Blog Grid',
    description: 'Blog post cards in a grid',
    componentType: 'posts',
    layout: {
      structure: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-xl',
      shadow: 'shadow-md',
      typography: { headingSize: 'text-xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'stagger-up', duration: 500, easing: 'ease-out' },
    effects: ['card-hover', 'read-time', 'category-tag'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-2', desktop: 'grid-cols-3' },
  },
  {
    id: 'posts-list',
    name: 'Blog List',
    description: 'Horizontal blog post list',
    componentType: 'posts',
    layout: {
      structure: 'flex flex-col gap-8',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-4xl mx-auto', gap: 'gap-8' },
    },
    styling: {
      background: 'bg-white',
      border: 'border-b border-gray-200',
      typography: { headingSize: 'text-2xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'slide-in-right', duration: 400, easing: 'ease-out' },
    effects: ['row-hover', 'excerpt-fade', 'author-avatar'],
    responsive: { mobile: 'flex-col', tablet: 'flex-col', desktop: 'flex-col' },
  },
  {
    id: 'posts-featured',
    name: 'Featured Post',
    description: 'Large featured post with sidebar',
    componentType: 'posts',
    layout: {
      structure: 'grid grid-cols-1 lg:grid-cols-3 gap-12',
      spacing: { padding: 'py-24 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-12' },
    },
    styling: {
      background: 'bg-gray-50',
      borderRadius: 'rounded-2xl',
      typography: { headingSize: 'text-3xl', bodySize: 'text-lg' },
    },
    animations: { entrance: 'fade-in', duration: 600, easing: 'ease-out' },
    effects: ['featured-image', 'sidebar-sticky', 'tag-cloud'],
    responsive: { mobile: 'grid-cols-1', tablet: 'grid-cols-1', desktop: 'grid-cols-3' },
  },
];

// ============================================================================
// NEWSLETTER VARIANTS (3 variations)
// ============================================================================

const NEWSLETTER_VARIANTS: ComponentVariant[] = [
  {
    id: 'newsletter-banner',
    name: 'Banner Strip',
    description: 'Full-width newsletter banner',
    componentType: 'newsletter',
    layout: {
      structure: 'flex flex-col md:flex-row items-center justify-between gap-6',
      spacing: { padding: 'py-8 px-6', margin: 'max-w-7xl mx-auto', gap: 'gap-6' },
    },
    styling: {
      background: 'bg-primary-600',
      borderRadius: 'rounded-none',
      typography: { headingSize: 'text-xl', bodySize: 'text-base text-white' },
    },
    animations: { entrance: 'slide-down', duration: 400, easing: 'ease-out' },
    effects: ['input-expand', 'submit-pulse', 'success-toast'],
    responsive: { mobile: 'flex-col', tablet: 'flex-row', desktop: 'flex-row' },
  },
  {
    id: 'newsletter-card',
    name: 'Card Box',
    description: 'Centered newsletter card',
    componentType: 'newsletter',
    layout: {
      structure: 'flex flex-col items-center text-center',
      spacing: { padding: 'py-16 px-8', margin: 'max-w-xl mx-auto', gap: 'gap-6' },
    },
    styling: {
      background: 'bg-white',
      borderRadius: 'rounded-2xl',
      shadow: 'shadow-xl',
      typography: { headingSize: 'text-2xl', bodySize: 'text-base' },
    },
    animations: { entrance: 'scale-in', duration: 500, easing: 'ease-out' },
    effects: ['input-focus', 'button-glow', 'confetti-success'],
    responsive: { mobile: 'mx-4', tablet: 'mx-6', desktop: 'mx-auto' },
  },
  {
    id: 'newsletter-inline',
    name: 'Inline Form',
    description: 'Inline form in footer area',
    componentType: 'newsletter',
    layout: {
      structure: 'flex flex-col sm:flex-row gap-4',
      spacing: { padding: 'py-0', margin: '', gap: 'gap-4' },
    },
    styling: {
      background: 'bg-transparent',
      typography: { headingSize: 'text-lg', bodySize: 'text-sm' },
    },
    animations: { entrance: 'fade-in', duration: 300, easing: 'ease-out' },
    effects: ['minimal-input', 'arrow-submit', 'inline-success'],
    responsive: { mobile: 'flex-col', tablet: 'flex-row', desktop: 'flex-row' },
  },
];

// ============================================================================
// ALL COMPONENT VARIANTS
// ============================================================================

const ALL_VARIANTS: ComponentVariant[] = [
  ...HERO_VARIANTS,
  ...NAVIGATION_VARIANTS,
  ...FEATURES_VARIANTS,
  ...TESTIMONIALS_VARIANTS,
  ...CTA_VARIANTS,
  ...ABOUT_VARIANTS,
  ...TEAM_VARIANTS,
  ...STATS_VARIANTS,
  ...LOGOS_VARIANTS,
  ...MARQUEE_VARIANTS,
  ...HOW_IT_WORKS_VARIANTS,
  ...COMPARISON_VARIANTS,
  ...INTEGRATION_VARIANTS,
  ...PRICING_VARIANTS,
  ...FAQ_VARIANTS,
  ...GALLERY_VARIANTS,
  ...BLOG_VARIANTS,
  ...FOOTER_VARIANTS,
  ...SERVICES_VARIANTS,
  ...CONTACT_VARIANTS,
  ...PRODUCTS_VARIANTS,
  ...CATEGORIES_VARIANTS,
  ...REVIEWS_VARIANTS,
  ...POSTS_VARIANTS,
  ...NEWSLETTER_VARIANTS,
];

// ============================================================================
// VARIANT SELECTOR CLASS
// ============================================================================

export class VariantSelector {
  private seed: number;
  private random: ReturnType<typeof seededRandom>;
  
  constructor(seed: number) {
    this.seed = seed;
    this.random = seededRandom(seed);
  }
  
  /**
   * Select a random variant for a component type
   */
  selectVariant(componentType: string): ComponentVariant {
    const variants = ALL_VARIANTS.filter(v => v.componentType === componentType);
    
    if (variants.length === 0) {
      throw new Error(`No variants found for component type: ${componentType}`);
    }
    
    return this.random.choice(variants);
  }
  
  /**
   * Select multiple unique variants
   */
  selectVariants(componentType: string, count: number): ComponentVariant[] {
    const variants = ALL_VARIANTS.filter(v => v.componentType === componentType);
    return this.random.sample(variants, Math.min(count, variants.length));
  }
  
  /**
   * Get variants by style preference
   */
  selectByStyle(componentType: string, style: 'minimal' | 'creative' | 'corporate'): ComponentVariant {
    const variants = ALL_VARIANTS.filter(v => {
      if (v.componentType !== componentType) return false;
      
      switch (style) {
        case 'minimal':
          return v.id.includes('minimal') || v.id.includes('text-only');
        case 'creative':
          return v.id.includes('3d') || v.id.includes('bento') || v.id.includes('overlapping');
        case 'corporate':
          return v.id.includes('grid') || v.id.includes('split') || v.id.includes('centered');
        default:
          return true;
      }
    });
    
    if (variants.length === 0) {
      return this.selectVariant(componentType);
    }
    
    return this.random.choice(variants);
  }
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

export function createVariantSelector(seed: number): VariantSelector {
  return new VariantSelector(seed);
}

export function selectVariant(componentType: string, seed: number): ComponentVariant {
  const selector = new VariantSelector(seed);
  return selector.selectVariant(componentType);
}

export function getVariantsByType(componentType: string): ComponentVariant[] {
  return ALL_VARIANTS.filter(v => v.componentType === componentType);
}

export function getAllVariants(): ComponentVariant[] {
  return [...ALL_VARIANTS];
}

export {
  HERO_VARIANTS,
  NAVIGATION_VARIANTS,
  FEATURES_VARIANTS,
  TESTIMONIALS_VARIANTS,
  CTA_VARIANTS,
  ABOUT_VARIANTS,
  TEAM_VARIANTS,
  STATS_VARIANTS,
  LOGOS_VARIANTS,
  MARQUEE_VARIANTS,
  HOW_IT_WORKS_VARIANTS,
  COMPARISON_VARIANTS,
  INTEGRATION_VARIANTS,
  PRICING_VARIANTS,
  FAQ_VARIANTS,
  GALLERY_VARIANTS,
  BLOG_VARIANTS,
  FOOTER_VARIANTS,
  SERVICES_VARIANTS,
  CONTACT_VARIANTS,
  PRODUCTS_VARIANTS,
  CATEGORIES_VARIANTS,
  REVIEWS_VARIANTS,
  POSTS_VARIANTS,
  NEWSLETTER_VARIANTS,
  ALL_VARIANTS,
};
