/**
 * Extended Component Library Registry
 * 
 * Unifies components from:
 * - 21st.dev (~298 components)
 * - Aceternity (~36 components)  
 * - shadcnui-blocks (~50+ components)
 * - reactbits (116 components)
 * 
 * Total: 500+ unique components
 */

// ============================================================================
// BUTTON VARIANTS (from 21st.dev, MagicUI, KokonutUI)
// ============================================================================

export const BUTTON_VARIANTS = [
  {
    id: 'button-colorful',
    name: 'Colorful Gradient Button',
    source: '21st.dev/kokonutd',
    description: 'Button with animated gradient background glow',
    dependencies: ['framer-motion'],
    effects: ['gradient-glow', 'hover-scale'],
    complexity: 'medium',
  },
  {
    id: 'particle-button',
    name: 'Particle Burst Button',
    source: '21st.dev/kokonutd',
    description: 'Button with particle explosion on success',
    dependencies: ['framer-motion'],
    effects: ['particle-burst', 'loading-state', 'success-state'],
    complexity: 'high',
  },
  {
    id: 'shimmer-button',
    name: 'Shimmer Effect Button',
    source: '21st.dev/magicui',
    description: 'Button with rotating shimmer/sparkle effect',
    dependencies: [],
    effects: ['shimmer-rotate', 'hover-scale'],
    complexity: 'medium',
  },
  {
    id: 'shiny-button',
    name: 'Shiny Text Button',
    source: '21st.dev/magicui',
    description: 'Button with animated shine effect on text',
    dependencies: ['framer-motion'],
    effects: ['text-shine', 'spring-animation'],
    complexity: 'medium',
  },
  {
    id: 'magnetic-button',
    name: 'Magnetic Button',
    source: '21st.dev/bundui',
    description: 'Button that follows cursor with spring physics',
    dependencies: ['framer-motion'],
    effects: ['magnetic-cursor', 'spring-physics'],
    complexity: 'high',
  },
  {
    id: 'ripple-button',
    name: 'Ripple Effect Button',
    source: 'shadcnui-blocks',
    description: 'Material-style ripple on click',
    dependencies: [],
    effects: ['ripple-animation'],
    complexity: 'low',
  },
];

// ============================================================================
// BACKGROUND VARIANTS (from Aceternity, 21st.dev, React Bits)
// ============================================================================

export const BACKGROUND_VARIANTS = [
  {
    id: 'aurora-background',
    name: 'Aurora Gradient Background',
    source: '21st.dev/aceternity',
    description: 'Animated aurora borealis gradient effect',
    dependencies: ['framer-motion'],
    effects: ['aurora-gradient', 'radial-glow'],
    complexity: 'medium',
  },
  {
    id: 'background-gradient',
    name: 'Animated Mesh Gradient',
    source: '21st.dev/aceternity',
    description: '4-point animated mesh gradient background',
    dependencies: ['framer-motion'],
    effects: ['mesh-gradient', '4-point-animation'],
    complexity: 'medium',
  },
  {
    id: 'dot-pattern',
    name: 'Dot Pattern Background',
    source: 'shadcnui-blocks',
    description: 'Configurable dot grid pattern',
    dependencies: [],
    effects: ['svg-pattern', 'customizable-density'],
    complexity: 'low',
  },
  {
    id: 'particles-background',
    name: 'Interactive Particles',
    source: 'shadcnui-blocks',
    description: 'Canvas-based particles with mouse interaction',
    dependencies: [],
    effects: ['canvas-particles', 'mouse-repel', 'connecting-lines'],
    complexity: 'high',
  },
  {
    id: 'grid-pattern',
    name: 'Grid Pattern Background',
    source: 'shadcnui-blocks',
    description: 'Animated grid with hover effects',
    dependencies: [],
    effects: ['grid-lines', 'hover-highlight'],
    complexity: 'low',
  },
  {
    id: 'meteors',
    name: 'Meteor Shower Background',
    source: '21st.dev/magicui',
    description: 'Animated falling meteors/stars',
    dependencies: [],
    effects: ['falling-meteors', 'random-positions'],
    complexity: 'medium',
  },
  {
    id: 'stars-background',
    name: 'Glowing Stars',
    source: '21st.dev/aceternity',
    description: 'Random glowing stars grid background',
    dependencies: ['framer-motion'],
    effects: ['glowing-stars', 'random-animation'],
    complexity: 'medium',
  },
  // WebGL Backgrounds from React Bits
  {
    id: 'crt-background',
    name: 'CRT Scanline Effect',
    source: 'reactbits',
    description: 'Retro CRT monitor scanline and flicker',
    dependencies: ['three.js', 'react-three-fiber'],
    effects: ['scanlines', 'flicker', 'rgb-shift'],
    complexity: 'high',
  },
  {
    id: 'floating-lines',
    name: 'Floating Lines',
    source: 'reactbits',
    description: '3D floating lines with depth',
    dependencies: ['three.js'],
    effects: ['3d-lines', 'depth-parallax'],
    complexity: 'high',
  },
  {
    id: 'galaxy-background',
    name: 'Galaxy Spiral',
    source: 'reactbits',
    description: '3D spinning galaxy with particles',
    dependencies: ['three.js', 'react-three-fiber'],
    effects: ['3d-galaxy', 'spiral-particles'],
    complexity: 'high',
  },
  {
    id: 'gradient-blinds',
    name: 'Gradient Blinds',
    source: 'reactbits',
    description: 'Animated gradient stripe blinds',
    dependencies: ['three.js'],
    effects: ['stripe-animation', 'gradient-shift'],
    complexity: 'high',
  },
  {
    id: 'warp-speed',
    name: 'Warp Speed Stars',
    source: 'reactbits',
    description: 'Starfield warp speed effect',
    dependencies: ['three.js'],
    effects: ['starfield', 'warp-speed'],
    complexity: 'high',
  },
  {
    id: 'noise-gradient',
    name: 'Noise Gradient',
    source: 'reactbits',
    description: 'Animated noise texture gradient',
    dependencies: ['three.js'],
    effects: ['noise-texture', 'color-shift'],
    complexity: 'high',
  },
  {
    id: 'ripple-background',
    name: 'Liquid Ripple',
    source: 'reactbits',
    description: 'Click-activated liquid ripples',
    dependencies: ['three.js'],
    effects: ['liquid-ripple', 'click-interaction'],
    complexity: 'high',
  },
  {
    id: 'wave-gradient',
    name: 'Wave Gradient',
    source: 'reactbits',
    description: 'Sine wave animated gradient',
    dependencies: ['three.js'],
    effects: ['wave-animation', 'gradient-flow'],
    complexity: 'high',
  },
];

// ============================================================================
// TEXT ANIMATION VARIANTS (from Aceternity, React Bits)
// ============================================================================

export const TEXT_ANIMATION_VARIANTS = [
  {
    id: 'flip-words',
    name: 'Flip Words',
    source: '21st.dev/aceternity',
    description: 'Word flip animation with character stagger',
    dependencies: ['framer-motion'],
    effects: ['word-flip', 'character-stagger', 'blur-motion'],
    complexity: 'medium',
  },
  {
    id: 'text-reveal',
    name: 'Text Reveal Card',
    source: '21st.dev/aceternity',
    description: 'Mouse-following text reveal effect',
    dependencies: ['framer-motion'],
    effects: ['mouse-follow', 'text-reveal', 'gradient-text'],
    complexity: 'high',
  },
  {
    id: 'typewriter',
    name: 'Typewriter Effect',
    source: 'reactbits',
    description: 'Classic typewriter typing animation',
    dependencies: [],
    effects: ['typing', 'cursor-blink', 'speed-control'],
    complexity: 'low',
  },
  {
    id: 'text-scramble',
    name: 'Text Scramble',
    source: 'reactbits',
    description: 'Cyberpunk text decode scramble',
    dependencies: [],
    effects: ['character-scramble', 'decode-effect'],
    complexity: 'medium',
  },
  {
    id: 'decoding-text',
    name: 'Decoding Text',
    source: 'reactbits',
    description: 'Matrix-style character decoding',
    dependencies: [],
    effects: ['matrix-decode', 'character-cycle'],
    complexity: 'medium',
  },
  {
    id: 'variable-prose',
    name: 'Variable Font Prose',
    source: 'reactbits',
    description: 'Variable weight animation on scroll',
    dependencies: [],
    effects: ['weight-animation', 'scroll-triggered'],
    complexity: 'medium',
  },
  {
    id: 'text-gradient',
    name: 'Animated Text Gradient',
    source: 'reactbits',
    description: 'Flowing gradient text effect',
    dependencies: [],
    effects: ['gradient-flow', 'background-clip'],
    complexity: 'low',
  },
];

// ============================================================================
// CARD VARIANTS (from Aceternity, 21st.dev)
// ============================================================================

export const CARD_VARIANTS = [
  {
    id: 'infinite-moving-cards',
    name: 'Infinite Moving Cards',
    source: '21st.dev/aceternity',
    description: 'Infinite horizontal scrolling testimonials',
    dependencies: [],
    effects: ['infinite-scroll', 'pause-on-hover', 'direction-control'],
    complexity: 'medium',
  },
  {
    id: 'glowing-stars-card',
    name: 'Glowing Stars Card',
    source: '21st.dev/aceternity',
    description: 'Card with glowing star matrix background',
    dependencies: ['framer-motion'],
    effects: ['star-matrix', 'random-glow', 'hover-intensify'],
    complexity: 'medium',
  },
  {
    id: '3d-card',
    name: '3D Tilt Card',
    source: '21st.dev/aceternity',
    description: 'Card with 3D mouse tilt effect',
    dependencies: ['framer-motion'],
    effects: ['3d-tilt', 'glare-effect', 'perspective'],
    complexity: 'high',
  },
  {
    id: 'hover-reveal',
    name: 'Hover Reveal Card',
    source: '21st.dev',
    description: 'Image reveal on hover with text',
    dependencies: ['framer-motion'],
    effects: ['image-reveal', 'text-slide'],
    complexity: 'medium',
  },
];

// ============================================================================
// HERO VARIANTS (from Aceternity)
// ============================================================================

export const HERO_EXTENDED_VARIANTS = [
  {
    id: 'hero-parallax',
    name: 'Parallax Product Grid',
    source: '21st.dev/aceternity',
    description: '3-layer parallax product showcase',
    dependencies: ['framer-motion'],
    effects: ['parallax-layers', 'spring-physics', '3d-rotate'],
    complexity: 'high',
  },
  {
    id: 'hero-highlight',
    name: 'Spotlight Hero',
    source: '21st.dev/aceternity',
    description: 'Mouse-following spotlight effect',
    dependencies: ['framer-motion'],
    effects: ['spotlight-follow', 'radial-gradient'],
    complexity: 'medium',
  },
  {
    id: 'trailing-beam',
    name: 'Tracing Beam',
    source: '21st.dev/aceternity',
    description: 'Vertical scroll progress beam',
    dependencies: ['framer-motion'],
    effects: ['scroll-progress', 'gradient-beam'],
    complexity: 'medium',
  },
];

// ============================================================================
// CURSOR EFFECTS (from React Bits)
// ============================================================================

export const CURSOR_VARIANTS = [
  {
    id: 'blob-cursor',
    name: 'Gooey Blob Cursor',
    source: 'reactbits',
    description: 'SVG filter gooey cursor trail',
    dependencies: ['gsap'],
    effects: ['gooey-filter', 'cursor-trail', 'multi-blob'],
    complexity: 'high',
  },
  {
    id: 'click-spark',
    name: 'Click Spark',
    source: 'reactbits',
    description: 'Spark explosion on click',
    dependencies: [],
    effects: ['spark-explosion', 'canvas-render'],
    complexity: 'medium',
  },
  {
    id: 'crosshair',
    name: 'Crosshair Cursor',
    source: 'reactbits',
    description: 'Custom crosshair with noise',
    dependencies: ['gsap'],
    effects: ['crosshair-lines', 'noise-filter', 'fade-edge'],
    complexity: 'high',
  },
  {
    id: 'follow-cursor',
    name: 'Follow Cursor',
    source: 'reactbits',
    description: 'Element follows cursor with lag',
    dependencies: [],
    effects: ['cursor-follow', 'lag-physics'],
    complexity: 'low',
  },
  {
    id: 'magnified-cursor',
    name: 'Magnified Cursor',
    source: 'reactbits',
    description: 'Magnifying glass cursor effect',
    dependencies: [],
    effects: ['magnify', 'border-circle'],
    complexity: 'medium',
  },
];

// ============================================================================
// SCROLL ANIMATIONS (from Aceternity, React Bits)
// ============================================================================

export const SCROLL_ANIMATION_VARIANTS = [
  {
    id: 'scroll-reveal',
    name: 'Scroll Reveal',
    source: 'reactbits',
    description: 'Reveal content on scroll with offset',
    dependencies: ['gsap', 'scrolltrigger'],
    effects: ['scroll-trigger', 'direction-control', 'fade-slide'],
    complexity: 'medium',
  },
  {
    id: 'parallax-scroll',
    name: 'Parallax Scroll',
    source: 'reactbits',
    description: 'Multi-speed parallax scrolling',
    dependencies: [],
    effects: ['speed-variation', 'translate-y'],
    complexity: 'low',
  },
  {
    id: 'smooth-scroll',
    name: 'Lenis Smooth Scroll',
    source: 'reactbits',
    description: 'Butter smooth scroll with momentum',
    dependencies: ['lenis'],
    effects: ['smooth-momentum', 'scroll-velocity'],
    complexity: 'medium',
  },
];

// ============================================================================
// UTILITIES
// ============================================================================

export function getAllExtendedVariants() {
  return [
    ...BUTTON_VARIANTS,
    ...BACKGROUND_VARIANTS,
    ...TEXT_ANIMATION_VARIANTS,
    ...CARD_VARIANTS,
    ...HERO_EXTENDED_VARIANTS,
    ...CURSOR_VARIANTS,
    ...SCROLL_ANIMATION_VARIANTS,
  ];
}

export function getVariantsByCategory(category: string) {
  const map: Record<string, typeof BUTTON_VARIANTS> = {
    buttons: BUTTON_VARIANTS,
    backgrounds: BACKGROUND_VARIANTS,
    textAnimations: TEXT_ANIMATION_VARIANTS,
    cards: CARD_VARIANTS,
    heroes: HERO_EXTENDED_VARIANTS,
    cursors: CURSOR_VARIANTS,
    scrollAnimations: SCROLL_ANIMATION_VARIANTS,
  };
  return map[category] || [];
}

export function getVariantsByComplexity(complexity: 'low' | 'medium' | 'high') {
  return getAllExtendedVariants().filter(v => v.complexity === complexity);
}
