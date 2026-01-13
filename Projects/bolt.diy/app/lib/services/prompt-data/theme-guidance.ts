export const THEME_ART_DIRECTIONS: Record<string, string[]> = {
  vinyl: [
    'Archival record shop catalog',
    'Noir lounge listening room',
    'Record label press kit',
    'Collector desk with handwritten notes',
  ],
  food: [
    'Home kitchen recipe card',
    'Meal kit unboxing experience',
    'Fresh ingredients flat lay',
    'Cozy dinner table setting',
  ],
  default: ['Editorial showcase', 'Boutique showroom', 'Modern museum gallery', 'Studio catalog spread'],
};

export const THEME_SIGNATURE_MOVES: Record<string, string[]> = {
  vinyl: [
    'Use angled album sleeves that overlap in the product grid',
    'Add thin gold pinline dividers and micro-label badges',
    'Introduce a subtle groove texture layer behind sections',
    'Use a diagonal split or stepped edge between hero and products',
    'Add circular record motifs as background shapes',
  ],
  food: [
    'Use warm, inviting photography with natural lighting',
    'Add recipe card style layouts for product descriptions',
    'Include ingredient icons and nutritional highlights',
    'Use earthy color accents and organic shapes',
  ],
  default: [
    'Use layered cards with staggered heights',
    'Break the grid with one oversized feature card',
    'Use a subtle pattern layer behind key sections',
  ],
};

export const GLOBAL_SIGNATURE_MOVES = [
  'Add an asymmetric grid or off-center alignment',
  'Use a split layout with overlapping media and text',
  'Include a distinctive callout banner or ribbon',
  'Use a bold typographic lockup with mixed weights',
];

export const THEME_EFFECT_IDS: Record<string, string[]> = {
  vinyl: ['grid-pattern', 'flickering-grid', 'aurora-text', 'warp-background', 'meteors'],
  food: [
    'еда',
    'кухня',
    'рецепт',
    'рецепты',
    'готовка',
    'готовить',
    'домашняя кухня',
    'ингредиенты',
    'набор еды',
    'наборы еды',
    'доставка еды',
    'кулинария',
    'meal kit',
  ],
  default: ['grid-pattern', 'flickering-grid', 'aurora-text', 'warp-background'],
};

export const THEME_LAYOUT_ARCHETYPES: Record<string, string[]> = {
  vinyl: [
    'Diagonal split hero + horizontal genre tag belt + staggered product grid + multi-row footer',
    'Centered hero card over image + angled product sleeves grid + newsletter bar + deep footer',
    'Split hero with floating record + sidebar filters + crate-style product gallery + stacked footer',
  ],
  food: [
    'еда',
    'кухня',
    'рецепт',
    'рецепты',
    'готовка',
    'готовить',
    'домашняя кухня',
    'ингредиенты',
    'набор еды',
    'наборы еды',
    'доставка еды',
    'кулинария',
    'meal kit',
  ],
  default: [
    'Split hero + bento feature grid + stacked cards + multi-row footer',
    'Centered hero + staggered grid + banner CTA + column footer',
    'Full-bleed hero + modular sections + layered cards + slim footer',
  ],
};

export const FALLBACK_BRANDS: Record<string, string[]> = {
  furniture: ['Nordic Lane', 'Oakline Studio', 'Linen & Oak', 'Scandi House', 'Timber & Form'],
  vinyl: ['Groove Vault', 'Needle & Tone', 'Vinyl Ritual', 'Analog Room', 'Record & Reel'],
  ecommerce: ['Mercado', 'Cart & Co', 'Storeline', 'Marketly', 'Shelf Studio'],
  fashion: ['Studio Vale', 'Threadline', 'Atelier North', 'Ward & Co', 'Modecraft'],
  beauty: ['Luma Skin', 'Glowroom', 'Aura Botanica', 'Velvet Lab', 'Pureform'],
  electronics: ['Nova Tech', 'Circuit Lane', 'Signal Works', 'Atomix', 'Core Devices'],
  food: [
    'еда',
    'кухня',
    'рецепт',
    'рецепты',
    'готовка',
    'готовить',
    'домашняя кухня',
    'ингредиенты',
    'набор еды',
    'наборы еды',
    'доставка еды',
    'кулинария',
    'meal kit',
  ],
  photography: ['Frame Stories', 'Northlight', 'Aperture Lane', 'Mono Studio', 'Lumen Studio'],
  industrial: ['Forge Works', 'Fieldline', 'Atlas Energy', 'Iron Ridge', 'Core Industrial'],
  hotel: ['Aurum House', 'Crestline', 'Velvet Suites', 'Noir Retreat', 'Luxe Haven'],
  automotive: ['Apex Motors', 'Velocity Auto', 'Ironclad Cars', 'Driveline', 'Motorcraft'],
  travel: ['Wanderlust Co', 'Horizon Travels', 'Nomad Routes', 'Vista Journeys', 'Pathfinder'],
  gaming: ['Pixel Forge', 'Neon Arena', 'Apex Gaming', 'Vortex Studios', 'Quantum Play'],
  sports: ['Peak Performance', 'Ironfit', 'Velocity Sports', 'Apex Athletics', 'Titan Fitness'],
  default: ['Studio North', 'Horizon Works', 'Vista & Co', 'Form & Field', 'Baseline Labs'],
};
