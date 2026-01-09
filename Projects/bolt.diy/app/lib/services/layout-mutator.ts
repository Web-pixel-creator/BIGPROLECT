import { type EnhancedPrompt } from './promptEnhancer';

interface LayoutStrategy {
  name: string;
  nav: 'top-center' | 'top-left' | 'top-right' | 'sidebar-left' | 'sidebar-right' | 'split';
  hero: 'full-width' | 'split-left' | 'split-right' | 'grid' | 'typography-focused' | 'minimal';
  features: 'bento-grid' | 'cards-row' | 'zigzag' | 'list' | 'timeline';
  footer: 'simple' | 'multi-column' | 'big-text' | 'minimal';
  style: 'glassmorphism' | 'neobrutalism' | 'minimalist' | 'material' | 'flat';
}

/**
 * Helper: Weighted Random Selection
 */
function weightedPick<T>(options: { value: T; weight: number }[], randomFn: () => number): T {
  const normalized = options.map((opt) => ({
    value: opt.value,
    weight: Math.max(0, opt.weight),
  }));
  const totalWeight = normalized.reduce((sum, opt) => sum + opt.weight, 0);

  if (totalWeight <= 0) {
    return normalized[0].value;
  }

  let randomValue = randomFn() * totalWeight;

  for (const option of normalized) {
    if (randomValue < option.weight) {
      return option.value;
    }

    randomValue -= option.weight;
  }

  return normalized[0].value;
}

/**
 * Deterministic seed from prompt (+ optional salt).
 */
export function createLayoutSeed(prompt: string, salt: string = ''): number {
  const input = `${prompt}::${salt}`;
  let hash = 0;
  const modulo = 2147483647;

  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) % modulo;
  }

  return hash;
}

/**
 * Generates a consistent but random layout strategy based on a seed.
 */
export function generateLayoutStrategy(seed: number = Math.random()): LayoutStrategy {
  // seeded random
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const strategy: LayoutStrategy = {
    name: 'Dynamic Layout',

    // Navigation: top-center is common, sidebar is rare but possible
    nav: weightedPick(
      [
        { value: 'top-center', weight: 35 },
        { value: 'split', weight: 20 },
        { value: 'top-left', weight: 15 },
        { value: 'top-right', weight: 15 },
        { value: 'sidebar-left', weight: 10 },
        { value: 'sidebar-right', weight: 5 },
      ],
      random,
    ),

    // Hero: favor full/split, but allow minimal/typography
    hero: weightedPick(
      [
        { value: 'full-width', weight: 28 },
        { value: 'split-left', weight: 20 },
        { value: 'split-right', weight: 18 },
        { value: 'grid', weight: 16 },
        { value: 'typography-focused', weight: 10 },
        { value: 'minimal', weight: 8 },
      ],
      random,
    ),

    // Features: bento is common, timeline is rare but allowed
    features: weightedPick(
      [
        { value: 'bento-grid', weight: 35 },
        { value: 'cards-row', weight: 25 },
        { value: 'zigzag', weight: 18 },
        { value: 'list', weight: 12 },
        { value: 'timeline', weight: 10 },
      ],
      random,
    ),

    // Footer: multi-column is typical, minimal stays rare
    footer: weightedPick(
      [
        { value: 'multi-column', weight: 40 },
        { value: 'big-text', weight: 25 },
        { value: 'simple', weight: 20 },
        { value: 'minimal', weight: 15 },
      ],
      random,
    ),

    // Style: keep material rare but possible
    style: weightedPick(
      [
        { value: 'minimalist', weight: 28 },
        { value: 'flat', weight: 24 },
        { value: 'glassmorphism', weight: 20 },
        { value: 'neobrutalism', weight: 16 },
        { value: 'material', weight: 12 },
      ],
      random,
    ),
  };

  return strategy;
}

/**
 * Converts the strategy into specific prompt instructions.
 */
export function getLayoutInstructions(strategy: LayoutStrategy): string {
  return `
    CREATIVE DIRECTION (Unique Layout Strategy):
    The user wants a unique, high-quality design. Use the following STRATEGY as a creative baseline, but prioritize the User's specific requirements if they conflict:
    
    1. AESTHETIC STYLE: "${strategy.style}" 
       - If "glassmorphism": Use extensive backdrop-blur, translucent layers, and gradients.
       - If "neobrutalism": Use bold borders, high contrast, shadowing, and geometric shapes.
       - If "minimalist": Focus on whitespace, typography, and subtle interactions.
       - If "flat": Use solid colors, card-based layouts, and clean lines.
       - If "material": Use elevation, tonal surfaces, and soft shadows.
    
    2. STRUCTURE:
       - Navigation: Consider a "${strategy.nav}" pattern if appropriate.
       - Hero: Try a "${strategy.hero}" layout.
       - Features: Use a "${strategy.features}" arrangement.
       
    3. COMPONENT LIBRARIES (USE THESE):
       - ICONS: "lucide-react" (Use generously).
       - ANIMATION: "framer-motion" (Mandatory for key interactions).
       - ADVANCED UI: access available components from: "MagicUI", "Shadcn", "Aceternity UI", "KokonutUI", "ReactBits", "Tailark".
       
    4. SMART SUGGESTIONS (Use 1-2 of these if fitting, but don't force it):
       ${getSmartSuggestions(strategy)}

    5. INTERACTIONS & POLISH (CRITICAL):
       - HOVER EFFECTS: accurate scaling (scale-105), smooth transitions (duration-300).
       - CLICK AREAS: Ensure anchor tags (a tags) or buttons cover the ENTIRE card. Do not leave dead zones.
       - ALIGNMENT: Use Flexbox/Grid for perfect centering. No approximate margins.
       - "Featured Items": If generating a grid of cards, ensure they are equal height and aligned perfectly.
       
    GOAL: Create a design that stands out from generic templates. Be bold with your CSS variables and layout choices.
  `;
}

function getSmartSuggestions(strategy: LayoutStrategy): string {
  const suggestions = [];

  // Context-Aware Suggestions based on Style
  if (strategy.style === 'glassmorphism') {
    suggestions.push(
      '- Style: Consider "Background Beams", "Aurora Text", or "Particles" to enhance the glass effect.',
    );
  } else if (strategy.style === 'neobrutalism') {
    suggestions.push('- Style: Consider "Marquee", "Bold Borders", or high-contrast "Hover Cards".');
  } else if (strategy.style === 'minimalist') {
    suggestions.push('- Style: Focus on "Dot Pattern", clean "Bento Grid", or subtle "Fade In" animations.');
  } else if (strategy.style === 'material') {
    suggestions.push('- Style: Consider "Elevation Cards", soft "Glow Dividers", or layered "Surface" panels.');
  }

  // Structure Suggestions
  if (strategy.hero === 'grid' || strategy.features === 'bento-grid') {
    suggestions.push('- Layout: A "Bento Grid" component from MagicUI/Aceternity would be an excellent fit here.');
  }

  if (strategy.hero === 'typography-focused') {
    suggestions.push('- Hero: Consider using "Text Reveal" or "Scroll Based Velocity" for the main headline.');
  }

  if (strategy.nav === 'sidebar-left' || strategy.nav === 'sidebar-right') {
    suggestions.push('- Navigation: Consider a compact sidebar with icon rail + expandable sections.');
  }

  // Universal Quality Boosters
  suggestions.push('- General: Consider adding "Ripple" effects on buttons or "Sparkles" on key text features.');

  return suggestions.join('\n       ');
}
