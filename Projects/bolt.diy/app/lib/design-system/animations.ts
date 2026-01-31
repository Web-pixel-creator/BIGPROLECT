/**
 * Animation System
 * 
 * Advanced animations for unique, non-template designs.
 * Includes entrance, scroll, hover, and micro-interactions.
 */

import { seededRandom } from './random';

// ============================================================================
// TYPES
// ============================================================================

export interface AnimationPreset {
  id: string;
  name: string;
  category: 'entrance' | 'scroll' | 'hover' | 'micro' | 'background';
  properties: AnimationProperties;
  css: string;
  duration: number;
  easing: string;
  stagger?: number;
}

export interface AnimationProperties {
  initial?: Record<string, string | number | string[] | number[]>;
  animate?: Record<string, string | number | string[] | number[]>;
  exit?: Record<string, string | number | string[] | number[]>;
  hover?: Record<string, string | number | string[] | number[]>;
  scroll?: Record<string, string | number | string[] | number[]>;
}

export interface AnimationGroup {
  id: string;
  name: string;
  animations: AnimationPreset[];
  timing: 'sequential' | 'staggered' | 'parallel';
}

// ============================================================================
// ENTRANCE ANIMATIONS
// ============================================================================

const ENTRANCE_ANIMATIONS: AnimationPreset[] = [
  {
    id: 'fade-in',
    name: 'Fade In',
    category: 'entrance',
    properties: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    css: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }',
    duration: 500,
    easing: 'ease-out',
  },
  {
    id: 'fade-in-up',
    name: 'Fade In Up',
    category: 'entrance',
    properties: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
    },
    css: '@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }',
    duration: 600,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  {
    id: 'fade-in-down',
    name: 'Fade In Down',
    category: 'entrance',
    properties: {
      initial: { opacity: 0, y: -30 },
      animate: { opacity: 1, y: 0 },
    },
    css: '@keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }',
    duration: 600,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  {
    id: 'fade-in-left',
    name: 'Fade In Left',
    category: 'entrance',
    properties: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
    },
    css: '@keyframes fadeInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }',
    duration: 600,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  {
    id: 'fade-in-right',
    name: 'Fade In Right',
    category: 'entrance',
    properties: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
    },
    css: '@keyframes fadeInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }',
    duration: 600,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  {
    id: 'scale-in',
    name: 'Scale In',
    category: 'entrance',
    properties: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
    },
    css: '@keyframes scaleIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }',
    duration: 500,
    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  {
    id: 'scale-in-fade',
    name: 'Scale In with Fade',
    category: 'entrance',
    properties: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
    },
    css: '@keyframes scaleInFade { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }',
    duration: 400,
    easing: 'ease-out',
  },
  {
    id: 'slide-in-up',
    name: 'Slide In Up',
    category: 'entrance',
    properties: {
      initial: { y: '100%' },
      animate: { y: 0 },
    },
    css: '@keyframes slideInUp { from { transform: translateY(100%); } to { transform: translateY(0); } }',
    duration: 700,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  {
    id: 'text-reveal',
    name: 'Text Reveal',
    category: 'entrance',
    properties: {
      initial: { clipPath: 'inset(0 100% 0 0)' },
      animate: { clipPath: 'inset(0 0% 0 0)' },
    },
    css: '@keyframes textReveal { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0% 0 0); } }',
    duration: 800,
    easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
  },
  {
    id: 'blur-in',
    name: 'Blur In',
    category: 'entrance',
    properties: {
      initial: { opacity: 0, filter: 'blur(10px)' },
      animate: { opacity: 1, filter: 'blur(0px)' },
    },
    css: '@keyframes blurIn { from { opacity: 0; filter: blur(10px); } to { opacity: 1; filter: blur(0); } }',
    duration: 800,
    easing: 'ease-out',
  },
  {
    id: 'rotate-in-3d',
    name: '3D Rotate In',
    category: 'entrance',
    properties: {
      initial: { opacity: 0, rotateY: 90 },
      animate: { opacity: 1, rotateY: 0 },
    },
    css: '@keyframes rotateIn3D { from { opacity: 0; transform: perspective(1000px) rotateY(90deg); } to { opacity: 1; transform: perspective(1000px) rotateY(0); } }',
    duration: 800,
    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  {
    id: 'flip-in-x',
    name: 'Flip In X',
    category: 'entrance',
    properties: {
      initial: { opacity: 0, rotateX: -90 },
      animate: { opacity: 1, rotateX: 0 },
    },
    css: '@keyframes flipInX { from { opacity: 0; transform: perspective(400px) rotateX(-90deg); } to { opacity: 1; transform: perspective(400px) rotateX(0); } }',
    duration: 600,
    easing: 'ease-out',
  },
  {
    id: 'zoom-in',
    name: 'Zoom In',
    category: 'entrance',
    properties: {
      initial: { opacity: 0, scale: 1.5 },
      animate: { opacity: 1, scale: 1 },
    },
    css: '@keyframes zoomIn { from { opacity: 0; transform: scale(1.5); } to { opacity: 1; transform: scale(1); } }',
    duration: 600,
    easing: 'ease-out',
  },
  {
    id: 'character-reveal',
    name: 'Character by Character',
    category: 'entrance',
    properties: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    css: '@keyframes charReveal { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }',
    duration: 400,
    easing: 'ease-out',
    stagger: 30,
  },
  {
    id: 'line-draw',
    name: 'Line Draw',
    category: 'entrance',
    properties: {
      initial: { strokeDashoffset: '100%' },
      animate: { strokeDashoffset: 0 },
    },
    css: '@keyframes lineDraw { to { stroke-dashoffset: 0; } }',
    duration: 1200,
    easing: 'ease-in-out',
  },
];

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================

const SCROLL_ANIMATIONS: AnimationPreset[] = [
  {
    id: 'scroll-fade',
    name: 'Scroll Fade',
    category: 'scroll',
    properties: {
      scroll: { opacity: [0, 1], y: [50, 0] },
    },
    css: '@keyframes scrollFade { 0% { opacity: 0; transform: translateY(50px); } 100% { opacity: 1; transform: translateY(0); } }',
    duration: 600,
    easing: 'ease-out',
  },
  {
    id: 'parallax-slow',
    name: 'Slow Parallax',
    category: 'scroll',
    properties: {
      scroll: { y: ['0%', '20%'] },
    },
    css: '',
    duration: 0,
    easing: 'linear',
  },
  {
    id: 'parallax-fast',
    name: 'Fast Parallax',
    category: 'scroll',
    properties: {
      scroll: { y: ['0%', '50%'] },
    },
    css: '',
    duration: 0,
    easing: 'linear',
  },
  {
    id: 'scale-on-scroll',
    name: 'Scale on Scroll',
    category: 'scroll',
    properties: {
      scroll: { scale: [0.8, 1] },
    },
    css: '',
    duration: 0,
    easing: 'ease-out',
  },
  {
    id: 'rotate-on-scroll',
    name: 'Rotate on Scroll',
    category: 'scroll',
    properties: {
      scroll: { rotate: [0, 360] },
    },
    css: '',
    duration: 0,
    easing: 'linear',
  },
  {
    id: 'pin-and-reveal',
    name: 'Pin and Reveal',
    category: 'scroll',
    properties: {
      scroll: { clipPath: ['inset(100% 0 0 0)', 'inset(0 0 0 0)'] },
    },
    css: '',
    duration: 0,
    easing: 'ease-out',
  },
  {
    id: 'horizontal-scroll',
    name: 'Horizontal Scroll Transform',
    category: 'scroll',
    properties: {
      scroll: { x: ['0%', '-100%'] },
    },
    css: '',
    duration: 0,
    easing: 'linear',
  },
  {
    id: 'progress-reveal',
    name: 'Progressive Reveal',
    category: 'scroll',
    properties: {
      scroll: { opacity: [0.3, 1], scale: [0.95, 1] },
    },
    css: '',
    duration: 0,
    easing: 'ease-out',
  },
];

// ============================================================================
// HOVER ANIMATIONS
// ============================================================================

const HOVER_ANIMATIONS: AnimationPreset[] = [
  {
    id: 'hover-lift',
    name: 'Lift on Hover',
    category: 'hover',
    properties: {
      hover: { y: -8, shadow: '0 20px 40px rgba(0,0,0,0.15)' },
    },
    css: 'transition: transform 0.3s ease, box-shadow 0.3s ease; &:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }',
    duration: 300,
    easing: 'ease-out',
  },
  {
    id: 'hover-scale',
    name: 'Scale on Hover',
    category: 'hover',
    properties: {
      hover: { scale: 1.05 },
    },
    css: 'transition: transform 0.3s ease; &:hover { transform: scale(1.05); }',
    duration: 300,
    easing: 'ease-out',
  },
  {
    id: 'hover-glow',
    name: 'Glow on Hover',
    category: 'hover',
    properties: {
      hover: { boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' },
    },
    css: 'transition: box-shadow 0.3s ease; &:hover { box-shadow: 0 0 30px rgba(59, 130, 246, 0.5); }',
    duration: 300,
    easing: 'ease-out',
  },
  {
    id: 'hover-3d-tilt',
    name: '3D Tilt on Hover',
    category: 'hover',
    properties: {
      hover: { rotateX: 'var(--rotateX)', rotateY: 'var(--rotateY)' },
    },
    css: 'transition: transform 0.1s ease; transform-style: preserve-3d;',
    duration: 100,
    easing: 'ease-out',
  },
  {
    id: 'hover-gradient-shift',
    name: 'Gradient Shift on Hover',
    category: 'hover',
    properties: {
      hover: { backgroundPosition: '100% 0' },
    },
    css: 'background-size: 200% 100%; transition: background-position 0.5s ease; &:hover { background-position: 100% 0; }',
    duration: 500,
    easing: 'ease-out',
  },
  {
    id: 'hover-underline',
    name: 'Underline Animation',
    category: 'hover',
    properties: {
      hover: { '--underline-width': '100%' },
    },
    css: 'position: relative; &::after { content: ""; position: absolute; bottom: 0; left: 0; width: var(--underline-width, 0); height: 2px; background: currentColor; transition: width 0.3s ease; }',
    duration: 300,
    easing: 'ease-out',
  },
  {
    id: 'hover-image-zoom',
    name: 'Image Zoom on Hover',
    category: 'hover',
    properties: {
      hover: { scale: 1.1 },
    },
    css: 'overflow: hidden; img { transition: transform 0.5s ease; } &:hover img { transform: scale(1.1); }',
    duration: 500,
    easing: 'ease-out',
  },
  {
    id: 'hover-icon-bounce',
    name: 'Icon Bounce on Hover',
    category: 'hover',
    properties: {
      hover: { y: -4 },
    },
    css: 'transition: transform 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55); &:hover { transform: translateY(-4px); }',
    duration: 200,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
];

// ============================================================================
// MICRO-INTERACTIONS
// ============================================================================

const MICRO_INTERACTIONS: AnimationPreset[] = [
  {
    id: 'micro-pulse',
    name: 'Pulse',
    category: 'micro',
    properties: {
      animate: { scale: [1, 1.05, 1] },
    },
    css: '@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }',
    duration: 2000,
    easing: 'ease-in-out',
  },
  {
    id: 'micro-shake',
    name: 'Shake',
    category: 'micro',
    properties: {
      animate: { x: [0, -5, 5, -5, 5, 0] },
    },
    css: '@keyframes shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-5px); } 40% { transform: translateX(5px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(5px); } }',
    duration: 500,
    easing: 'ease-in-out',
  },
  {
    id: 'micro-bounce',
    name: 'Bounce',
    category: 'micro',
    properties: {
      animate: { y: [0, -10, 0] },
    },
    css: '@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }',
    duration: 1000,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  {
    id: 'micro-spin',
    name: 'Spin',
    category: 'micro',
    properties: {
      animate: { rotate: 360 },
    },
    css: '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }',
    duration: 1000,
    easing: 'linear',
  },
  {
    id: 'micro-ripple',
    name: 'Ripple Effect',
    category: 'micro',
    properties: {
      initial: { scale: 0, opacity: 0.5 },
      animate: { scale: 2, opacity: 0 },
    },
    css: '@keyframes ripple { to { transform: scale(2); opacity: 0; } }',
    duration: 600,
    easing: 'ease-out',
  },
];

// ============================================================================
// BACKGROUND ANIMATIONS
// ============================================================================

const BACKGROUND_ANIMATIONS: AnimationPreset[] = [
  {
    id: 'bg-gradient-flow',
    name: 'Gradient Flow',
    category: 'background',
    properties: {},
    css: '@keyframes gradientFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }',
    duration: 8000,
    easing: 'linear',
  },
  {
    id: 'bg-mesh-move',
    name: 'Mesh Gradient Move',
    category: 'background',
    properties: {},
    css: '@keyframes meshMove { 0%, 100% { background-position: 0% 0%; } 50% { background-position: 100% 100%; } }',
    duration: 15000,
    easing: 'linear',
  },
  {
    id: 'bg-particles-float',
    name: 'Floating Particles',
    category: 'background',
    properties: {},
    css: '@keyframes float { 0%, 100% { transform: translateY(0) translateX(0); } 25% { transform: translateY(-20px) translateX(10px); } 50% { transform: translateY(-10px) translateX(-10px); } 75% { transform: translateY(-30px) translateX(5px); } }',
    duration: 10000,
    easing: 'ease-in-out',
  },
  {
    id: 'bg-noise',
    name: 'Animated Noise',
    category: 'background',
    properties: {},
    css: '@keyframes noise { 0%, 100% { background-position: 0 0; } 10% { background-position: -5% -10%; } 20% { background-position: -15% 5%; } 30% { background-position: 7% -25%; } 40% { background-position: 20% 25%; } 50% { background-position: -25% 10%; } 60% { background-position: 15% 5%; } 70% { background-position: 0% 15%; } 80% { background-position: 25% 35%; } 90% { background-position: -10% 10%; } }',
    duration: 800,
    easing: 'steps(10)',
  },
];

// ============================================================================
// ALL ANIMATIONS
// ============================================================================

const ALL_ANIMATIONS: AnimationPreset[] = [
  ...ENTRANCE_ANIMATIONS,
  ...SCROLL_ANIMATIONS,
  ...HOVER_ANIMATIONS,
  ...MICRO_INTERACTIONS,
  ...BACKGROUND_ANIMATIONS,
];

// ============================================================================
// ANIMATION SELECTOR
// ============================================================================

export class AnimationSelector {
  private seed: number;
  private random: ReturnType<typeof seededRandom>;
  
  constructor(seed: number) {
    this.seed = seed;
    this.random = seededRandom(seed);
  }
  
  /**
   * Select a random animation from a category
   */
  selectAnimation(category: AnimationPreset['category']): AnimationPreset {
    const animations = ALL_ANIMATIONS.filter(a => a.category === category);
    return this.random.choice(animations);
  }
  
  /**
   * Select multiple animations for different purposes
   */
  selectAnimationSet(): {
    entrance: AnimationPreset;
    scroll?: AnimationPreset;
    hover?: AnimationPreset;
    background?: AnimationPreset;
  } {
    return {
      entrance: this.selectAnimation('entrance'),
      scroll: this.random.random() > 0.5 ? this.selectAnimation('scroll') : undefined,
      hover: this.random.random() > 0.3 ? this.selectAnimation('hover') : undefined,
      background: this.random.random() > 0.7 ? this.selectAnimation('background') : undefined,
    };
  }
  
  /**
   * Generate CSS for selected animations
   */
  generateCSS(animations: AnimationPreset[]): string {
    const lines: string[] = [];
    
    animations.forEach(anim => {
      if (anim.css) {
        lines.push(anim.css);
      }
    });
    
    return lines.join('\n\n');
  }
  
  /**
   * Generate animation classes
   */
  generateClasses(animations: AnimationPreset[]): Record<string, string> {
    const classes: Record<string, string> = {};
    
    animations.forEach(anim => {
      classes[anim.id] = `animate-${anim.id}`;
    });
    
    return classes;
  }
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

export function createAnimationSelector(seed: number): AnimationSelector {
  return new AnimationSelector(seed);
}

export function selectAnimation(category: AnimationPreset['category'], seed: number): AnimationPreset {
  const selector = new AnimationSelector(seed);
  return selector.selectAnimation(category);
}

export function getAnimationsByCategory(category: AnimationPreset['category']): AnimationPreset[] {
  return ALL_ANIMATIONS.filter(a => a.category === category);
}

export function getAllAnimations(): AnimationPreset[] {
  return [...ALL_ANIMATIONS];
}

export {
  ENTRANCE_ANIMATIONS,
  SCROLL_ANIMATIONS,
  HOVER_ANIMATIONS,
  MICRO_INTERACTIONS,
  BACKGROUND_ANIMATIONS,
  ALL_ANIMATIONS,
};
