/**
 * Prompt Enhancer Service
 * Analyzes user prompt and automatically adds design system (colors, images, structure)
 * before sending to LLM
 */

// Theme detection keywords
// Порядок важен: сначала узкие темы, затем общий ecommerce
const THEME_KEYWORDS = {
  furniture: ['furniture', 'sofa', 'chair', 'table', 'storage', 'seating', 'decor', 'cabinet', 'мебель', 'стул', 'стол', 'хранение'],
  fashion: ['fashion', 'clothing', 'apparel', 'shoes', 'accessories', 'lookbook', 'одежда', 'обувь'],
  beauty: ['beauty', 'cosmetics', 'makeup', 'skincare', 'fragrance', 'косметика', 'макияж'],
  electronics: ['electronics', 'gadget', 'phone', 'laptop', 'smart home', 'camera', 'электроника', 'гаджет'],
  food: ['food', 'grocery', 'beverage', 'coffee', 'tea', 'snack', 'bakery', 'еда', 'кофе', 'чай'],
  ecommerce: ['e-commerce', 'ecommerce', 'shop', 'store', 'product', 'cart', 'магазин', 'товар', 'корзин'],
  photography: ['photography', 'photographer', 'photo shoot', 'portfolio', 'gallery', 'freelance', 'creative', 'visual', 'squarespace'],
  industrial: ['industrial', 'energy', 'oil', 'gas', 'power', 'refinery', 'pipeline', 'manufacturing', 'factory'],
  hotel: ['hotel', 'hospitality', 'resort', 'boutique', 'spa', 'accommodation', 'booking'],
  tech: ['tech', 'saas', 'startup', 'software', 'app', 'platform', 'dashboard', 'analytics'],
  medical: ['medical', 'healthcare', 'hospital', 'clinic', 'health', 'doctor', 'patient'],
  restaurant: ['restaurant', 'food', 'cafe', 'dining', 'menu', 'culinary', 'chef'],
  realestate: ['real estate', 'property', 'apartment', 'house', 'home', 'realty', 'housing'],
  finance: ['finance', 'bank', 'investment', 'trading', 'crypto', 'fintech', 'money'],
  education: ['education', 'school', 'university', 'learning', 'course', 'academy', 'training'],
};

// Color word to HEX mapping - comprehensive dictionary
const COLOR_WORDS_TO_HEX: Record<string, { hex: string; type: 'dark' | 'light' | 'accent' }> = {
  // Dark colors
  black: { hex: '#000000', type: 'dark' },
  'deep black': { hex: '#0a0a0a', type: 'dark' },
  charcoal: { hex: '#111113', type: 'dark' },
  'deep charcoal': { hex: '#111113', type: 'dark' },
  'dark gray': { hex: '#1a1a1a', type: 'dark' },
  'dark grey': { hex: '#1a1a1a', type: 'dark' },
  navy: { hex: '#0f172a', type: 'dark' },
  'dark blue': { hex: '#1e3a5f', type: 'dark' },
  midnight: { hex: '#0a0a0a', type: 'dark' },
  onyx: { hex: '#0f0f0f', type: 'dark' },
  ebony: { hex: '#111111', type: 'dark' },
  slate: { hex: '#1e293b', type: 'dark' },

  // Light colors
  white: { hex: '#ffffff', type: 'light' },
  cream: { hex: '#FDF5E6', type: 'light' },
  'light cream': { hex: '#FDF5E6', type: 'light' },
  ivory: { hex: '#FAF9F6', type: 'light' },
  'ivory cream': { hex: '#F4F3EF', type: 'light' },
  beige: { hex: '#F5F5DC', type: 'light' },
  'off-white': { hex: '#FAF9F6', type: 'light' },
  'off white': { hex: '#FAF9F6', type: 'light' },
  pearl: { hex: '#FAFAFA', type: 'light' },
  snow: { hex: '#FFFAFA', type: 'light' },
  'light gray': { hex: '#f8fafc', type: 'light' },
  'light grey': { hex: '#f8fafc', type: 'light' },
  'warm white': { hex: '#FDF8F5', type: 'light' },
  linen: { hex: '#FAF0E6', type: 'light' },
  seashell: { hex: '#FFF5EE', type: 'light' },
  alabaster: { hex: '#F2F0EB', type: 'light' },

  // Accent colors - Gold/Yellow family
  gold: { hex: '#C9A66B', type: 'accent' },
  'elegant gold': { hex: '#C9A66B', type: 'accent' },
  'golden': { hex: '#D4AF37', type: 'accent' },
  amber: { hex: '#F59E0B', type: 'accent' },
  bronze: { hex: '#CD7F32', type: 'accent' },
  brass: { hex: '#B5A642', type: 'accent' },
  champagne: { hex: '#F7E7CE', type: 'accent' },
  mustard: { hex: '#FFDB58', type: 'accent' },
  honey: { hex: '#EB9605', type: 'accent' },
  copper: { hex: '#B87333', type: 'accent' },

  // Accent colors - Blue family
  blue: { hex: '#3b82f6', type: 'accent' },
  'royal blue': { hex: '#4169E1', type: 'accent' },
  cyan: { hex: '#0ea5e9', type: 'accent' },
  teal: { hex: '#14b8a6', type: 'accent' },
  turquoise: { hex: '#40E0D0', type: 'accent' },
  'sky blue': { hex: '#0ea5e9', type: 'accent' },
  azure: { hex: '#007FFF', type: 'accent' },
  cobalt: { hex: '#0047AB', type: 'accent' },

  // Accent colors - Green family
  green: { hex: '#22c55e', type: 'accent' },
  emerald: { hex: '#059669', type: 'accent' },
  mint: { hex: '#98FF98', type: 'accent' },
  sage: { hex: '#9DC183', type: 'accent' },
  olive: { hex: '#808000', type: 'accent' },
  forest: { hex: '#228B22', type: 'accent' },

  // Accent colors - Red/Orange family
  red: { hex: '#dc2626', type: 'accent' },
  crimson: { hex: '#DC143C', type: 'accent' },
  burgundy: { hex: '#800020', type: 'accent' },
  maroon: { hex: '#800000', type: 'accent' },
  coral: { hex: '#FF7F50', type: 'accent' },
  orange: { hex: '#f97316', type: 'accent' },
  tangerine: { hex: '#FF9966', type: 'accent' },
  rust: { hex: '#B7410E', type: 'accent' },

  // Accent colors - Purple/Pink family
  purple: { hex: '#8b5cf6', type: 'accent' },
  violet: { hex: '#8b5cf6', type: 'accent' },
  indigo: { hex: '#6366f1', type: 'accent' },
  lavender: { hex: '#E6E6FA', type: 'accent' },
  magenta: { hex: '#FF00FF', type: 'accent' },
  pink: { hex: '#ec4899', type: 'accent' },
  rose: { hex: '#f43f5e', type: 'accent' },
  fuchsia: { hex: '#d946ef', type: 'accent' },
  plum: { hex: '#DDA0DD', type: 'accent' },
};

// Color palettes for each theme
const THEME_PALETTES = {
  photography: {
    dark: '#0a0a0a',
    light: '#ffffff',
    accent: '#C9A66B',
    accentName: 'gold',
    textOnDark: '#ffffff',
    textOnLight: '#111113',
  },
  industrial: {
    dark: '#0a0a0a',
    light: '#F4F3EF',
    accent: '#C9A66B',
    accentName: 'gold',
    textOnDark: '#ffffff',
    textOnLight: '#111113',
  },
  hotel: {
    dark: '#111113',
    light: '#FAF9F6',
    accent: '#C9A66B',
    accentName: 'gold',
    textOnDark: '#ffffff',
    textOnLight: '#1a1a1a',
  },
  tech: {
    dark: '#0f172a',
    light: '#f8fafc',
    accent: '#3b82f6',
    accentName: 'blue',
    textOnDark: '#ffffff',
    textOnLight: '#1e293b',
  },
  medical: {
    dark: '#1e3a5f',
    light: '#f0f9ff',
    accent: '#0ea5e9',
    accentName: 'cyan',
    textOnDark: '#ffffff',
    textOnLight: '#0c4a6e',
  },
  restaurant: {
    dark: '#1a1a1a',
    light: '#faf7f2',
    accent: '#dc2626',
    accentName: 'red',
    textOnDark: '#ffffff',
    textOnLight: '#292524',
  },
  realestate: {
    dark: '#1e293b',
    light: '#f8fafc',
    accent: '#059669',
    accentName: 'emerald',
    textOnDark: '#ffffff',
    textOnLight: '#1e293b',
  },
  finance: {
    dark: '#0f172a',
    light: '#f8fafc',
    accent: '#6366f1',
    accentName: 'indigo',
    textOnDark: '#ffffff',
    textOnLight: '#1e293b',
  },
  education: {
    dark: '#1e1b4b',
    light: '#faf5ff',
    accent: '#8b5cf6',
    accentName: 'purple',
    textOnDark: '#ffffff',
    textOnLight: '#3b0764',
  },
  furniture: {
    dark: '#1a1a1a',
    light: '#ffffff',
    accent: '#000000',
    accentName: 'black',
    textOnDark: '#ffffff',
    textOnLight: '#1a1a1a',
  },
  fashion: {
    dark: '#0f0f10',
    light: '#ffffff',
    accent: '#111827',
    accentName: 'charcoal',
    textOnDark: '#ffffff',
    textOnLight: '#111827',
  },
  beauty: {
    dark: '#111113',
    light: '#fdf7f2',
    accent: '#c084fc',
    accentName: 'lavender',
    textOnDark: '#ffffff',
    textOnLight: '#1f1f1f',
  },
  electronics: {
    dark: '#0b1220',
    light: '#f8fafc',
    accent: '#111827',
    accentName: 'slate',
    textOnDark: '#ffffff',
    textOnLight: '#111827',
  },
  food: {
    dark: '#1c1a17',
    light: '#fffdf7',
    accent: '#d97706',
    accentName: 'amber',
    textOnDark: '#fef3c7',
    textOnLight: '#1f1f1f',
  },
  ecommerce: {
    dark: '#1a1a1a',
    light: '#ffffff',
    accent: '#000000',
    accentName: 'black',
    textOnDark: '#ffffff',
    textOnLight: '#1a1a1a',
  },
  default: {
    dark: '#111113',
    light: '#ffffff',
    accent: '#C9A66B',
    accentName: 'gold',
    textOnDark: '#ffffff',
    textOnLight: '#111113',
  },
};

// Verified working image URLs for each theme
const THEME_IMAGES = {
  photography: {
    hero: [
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1920&q=80',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    ],
  },
  industrial: {
    hero: [
      'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1920&q=80',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80',
    ],
  },
  hotel: {
    hero: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1920&q=80',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    ],
  },
  tech: {
    hero: [
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=80',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    ],
  },
  medical: {
    hero: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=1920&q=80',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=800&q=80',
    ],
  },
  restaurant: {
    hero: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    ],
  },
  realestate: {
    hero: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=800&q=80',
    ],
  },
  finance: {
    hero: [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1920&q=80',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    ],
  },
  education: {
    hero: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1920&q=80',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    ],
  },
  furniture: {
    hero: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1920&q=80',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523419400524-f66163c0c519?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519710169767-0f7f0c63cfbe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616628182501-8f67e6f13e0a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80',
    ],
    categories: {
      seating: [
        'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1616628182501-8f67e6f13e0a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1523419400524-f66163c0c519?auto=format&fit=crop&w=800&q=80',
      ],
      tables: [
        'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519710169767-0f7f0c63cfbe?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      ],
      storage: [
        'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
      ],
    },
    products: [
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1523419400524-f66163c0c519?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519710169767-0f7f0c63cfbe?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1616628182501-8f67e6f13e0a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80',
    ],
  },
  fashion: {
    hero: [
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1920&q=80',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    ],
    products: [
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
    ],
  },
  beauty: {
    hero: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1920&q=80',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80',
    ],
    products: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    ],
  },
  electronics: {
    hero: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1555617980-94f6c9f4fd79?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555617980-94f6c9f4fd79?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555617980-94f6c9f4fd79?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    ],
    products: [
      'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1510557880182-3eec1bc61b39?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1555617980-94f6c9f4fd79?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    ],
  },
  food: {
    hero: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
    ],
    products: [
      'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=600&q=80',
    ],
  },
  ecommerce: {
    hero: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1920&q=80',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523419400524-f66163c0c519?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519710169767-0f7f0c63cfbe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616628182501-8f67e6f13e0a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80',
    ],
    // Furniture category images (seating, tables, storage)
    categories: {
      seating: [
        'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1616628182501-8f67e6f13e0a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1523419400524-f66163c0c519?auto=format&fit=crop&w=800&q=80',
      ],
      tables: [
        'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519710169767-0f7f0c63cfbe?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      ],
      storage: [
        'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
      ],
    },
    products: [
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1523419400524-f66163c0c519?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519710169767-0f7f0c63cfbe?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1616628182501-8f67e6f13e0a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80',
    ],
  },
  default: {
    hero: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1920&q=80',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    ],
  },
};

/**
 * Detect theme from user prompt
 */
function detectTheme(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerPrompt.includes(keyword)) {
        return theme;
      }
    }
  }

  return 'default';
}

/**
 * Check if user already specified colors in prompt
 */
function hasUserSpecifiedColors(prompt: string): boolean {
  // Check for hex colors like #111113, #F4F3EF
  const hexPattern = /#[0-9A-Fa-f]{6}/g;
  const matches = prompt.match(hexPattern);

  return matches !== null && matches.length >= 2;
}

/**
 * Extract user-specified colors from prompt
 */
function extractUserColors(prompt: string): Record<string, string> | null {
  const hexPattern = /#[0-9A-Fa-f]{6}/g;
  const matches = prompt.match(hexPattern);

  if (!matches || matches.length < 2) {
    return null;
  }

  // Try to identify colors by context
  const colors: Record<string, string> = {};
  const lowerPrompt = prompt.toLowerCase();

  matches.forEach((color) => {
    const colorIndex = lowerPrompt.indexOf(color.toLowerCase());
    const contextBefore = lowerPrompt.substring(Math.max(0, colorIndex - 50), colorIndex);

    if (contextBefore.includes('dark') || contextBefore.includes('charcoal') || contextBefore.includes('black')) {
      colors.dark = color;
    } else if (
      contextBefore.includes('light') ||
      contextBefore.includes('cream') ||
      contextBefore.includes('ivory') ||
      contextBefore.includes('white')
    ) {
      colors.light = color;
    } else if (
      contextBefore.includes('accent') ||
      contextBefore.includes('gold') ||
      contextBefore.includes('button')
    ) {
      colors.accent = color;
    }
  });

  // If we couldn't identify by context, assign by order
  if (!colors.dark && matches[0]) {
    colors.dark = matches[0];
  }

  if (!colors.light && matches[1]) {
    colors.light = matches[1];
  }

  if (!colors.accent && matches[2]) {
    colors.accent = matches[2];
  }

  return Object.keys(colors).length > 0 ? colors : null;
}

/**
 * Extract colors from color words in prompt (e.g., "cream", "black", "gold")
 */
function extractColorsFromWords(prompt: string): Record<string, string> {
  const lowerPrompt = prompt.toLowerCase();
  const foundColors: Record<string, string> = {};

  // Sort color words by length (longer first) to match "light cream" before "cream"
  const sortedColorWords = Object.keys(COLOR_WORDS_TO_HEX).sort((a, b) => b.length - a.length);

  for (const colorWord of sortedColorWords) {
    if (lowerPrompt.includes(colorWord)) {
      const colorInfo = COLOR_WORDS_TO_HEX[colorWord];

      // Only set if not already found (longer matches take priority)
      if (colorInfo.type === 'dark' && !foundColors.dark) {
        foundColors.dark = colorInfo.hex;
      } else if (colorInfo.type === 'light' && !foundColors.light) {
        foundColors.light = colorInfo.hex;
      } else if (colorInfo.type === 'accent' && !foundColors.accent) {
        foundColors.accent = colorInfo.hex;
      }
    }
  }

  return foundColors;
}

/**
 * Check if prompt mentions color words
 */
function hasColorWords(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();

  return Object.keys(COLOR_WORDS_TO_HEX).some((colorWord) => lowerPrompt.includes(colorWord));
}

export interface EnhancedPrompt {
  originalPrompt: string;
  enhancedPrompt: string;
  detectedTheme: string;
  colors: typeof THEME_PALETTES.default;
  images: typeof THEME_IMAGES.default;
}

/**
 * Main function to enhance user prompt with design system
 */
export function enhancePromptWithDesignSystem(userPrompt: string): EnhancedPrompt {
  const detectedTheme = detectTheme(userPrompt);
  const palette = THEME_PALETTES[detectedTheme as keyof typeof THEME_PALETTES] || THEME_PALETTES.default;
  const images = THEME_IMAGES[detectedTheme as keyof typeof THEME_IMAGES] || THEME_IMAGES.default;

  // Check if user already specified colors (priority: HEX codes > color words > theme defaults)
  let finalColors = { ...palette };

  // First, try to extract HEX codes from prompt
  if (hasUserSpecifiedColors(userPrompt)) {
    const userColors = extractUserColors(userPrompt);

    if (userColors) {
      finalColors = {
        ...finalColors,
        ...userColors,
      };
    }
  }

  // Then, extract colors from color words (e.g., "cream", "black", "gold")
  if (hasColorWords(userPrompt)) {
    const wordColors = extractColorsFromWords(userPrompt);

    // Only override dark/light if not already set by HEX codes
    if (wordColors.dark && !hasUserSpecifiedColors(userPrompt)) {
      finalColors.dark = wordColors.dark;
    }

    if (wordColors.light && !hasUserSpecifiedColors(userPrompt)) {
      finalColors.light = wordColors.light;
    }

    // For accent, only override if user explicitly mentioned an accent color word
    // (gold, amber, blue, etc.) - don't override theme accent with random color matches
    const accentKeywords = ['gold', 'amber', 'bronze', 'copper', 'blue', 'cyan', 'teal', 'green', 'emerald', 'red', 'orange', 'purple', 'violet', 'pink'];
    const lowerPrompt = userPrompt.toLowerCase();
    const hasExplicitAccent = accentKeywords.some(keyword => lowerPrompt.includes(keyword));
    
    if (wordColors.accent && hasExplicitAccent && !hasUserSpecifiedColors(userPrompt)) {
      finalColors.accent = wordColors.accent;
    }
  }

  // Check if user specified specific layouts
  const lowerPrompt = userPrompt.toLowerCase();
  const hasSpecificLayout = 
    lowerPrompt.includes('слева') || 
    lowerPrompt.includes('справа') || 
    lowerPrompt.includes('left') || 
    lowerPrompt.includes('right') ||
    lowerPrompt.includes('split') ||
    lowerPrompt.includes('two column') ||
    lowerPrompt.includes('image on') ||
    lowerPrompt.includes('text on') ||
    lowerPrompt.includes('шапка с') ||
    lowerPrompt.includes('grid') ||
    lowerPrompt.includes('carousel') ||
    lowerPrompt.includes('slider');

  // Helper to pick random item
  const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  // Detect which sections user mentioned in prompt
  const sectionKeywords: Record<string, string[]> = {
    hero: ['hero', 'шапка', 'header', 'banner', 'главный', 'intro', 'landing'],
    features: ['feature', 'функци', 'services', 'услуг', 'offerings', 'benefits', 'преимущества'],
    gallery: ['gallery', 'галерея', 'portfolio', 'портфолио', 'photos', 'фото', 'images', 'work', 'projects'],
    testimonials: ['testimonial', 'отзыв', 'review', 'client', 'клиент', 'feedback', 'quote'],
    pricing: ['pricing', 'price', 'цен', 'тариф', 'план', 'cost', 'subscription'],
    cta: ['cta', 'call to action', 'inquiry', 'contact', 'связ', 'заявк', 'book', 'get started', 'sign up'],
    faq: ['faq', 'вопрос', 'question', 'answer', 'help'],
    footer: ['footer', 'подвал', 'bottom', 'copyright'],
    about: ['about', 'о нас', 'о компании', 'story', 'история', 'mission'],
    team: ['team', 'команд', 'staff', 'people', 'сотрудник'],
    contact: ['contact', 'контакт', 'form', 'форма', 'reach', 'address', 'адрес'],
    blog: ['blog', 'блог', 'news', 'новост', 'article', 'статья', 'post'],
    logo: ['logo', 'лого', 'client', 'partner', 'партнер', 'brand'],
    products: ['product', 'продукт', 'товар', 'bestseller', 'item', 'catalog', 'каталог', 'shop', 'магазин'],
    categories: ['category', 'категори', 'collection', 'коллекци', 'seating', 'tables', 'storage'],
  };

  // Find which sections are mentioned
  const mentionedSections: string[] = [];
  for (const [section, keywords] of Object.entries(sectionKeywords)) {
    if (keywords.some(kw => lowerPrompt.includes(kw))) {
      mentionedSections.push(section);
    }
  }

  // Section layout variants
  const sectionLayouts: Record<string, string[]> = {
    hero: [
      'Full-width hero with centered text overlay and dark gradient',
      'Split hero: large image on left (60%), text content on right (40%)',
      'Split hero: text content on left (40%), large image on right (60%)',
      'Full-screen background with minimal centered headline',
      'Hero with floating card overlay on the right side',
    ],
    features: [
      '3-column grid with icons above text',
      '2-column alternating: image left/text right, then text left/image right',
      '4-column grid with hover effects',
      'Bento grid layout with mixed sizes',
    ],
    gallery: [
      'Masonry grid layout',
      '3-column uniform grid with hover zoom',
      'Horizontal scroll carousel',
      '2-row staggered grid',
    ],
    testimonials: [
      'Carousel with large quote and avatar',
      '3-column cards with ratings',
      'Single featured testimonial with background image',
    ],
    pricing: [
      '3-column cards with highlighted middle option',
      '2-column comparison table',
      'Toggle between monthly/yearly with animated cards',
    ],
    cta: [
      'Full-width banner with gradient background',
      'Split: image left, form right',
      'Centered card with glow effect',
      'Minimal text with single button',
    ],
    faq: [
      'Accordion with smooth animations',
      '2-column grid of questions',
      'Single column with expandable cards',
    ],
    footer: [
      '4-column layout with newsletter',
      'Minimal centered with social icons',
      '3-column with large logo',
    ],
    about: [
      'Split: large image left, story text right',
      'Full-width with timeline',
      'Centered text with background image',
    ],
    team: [
      '4-column grid with hover effects',
      '3-column cards with social links',
      'Horizontal scroll carousel',
    ],
    contact: [
      'Split: form left, map/info right',
      'Centered form with floating card',
      '2-column: info left, form right',
    ],
    blog: [
      '3-column card grid',
      'Featured post + 2-column grid',
      'List view with thumbnails',
    ],
    logo: [
      'Horizontal scroll with grayscale hover',
      'Grid with fade animation',
      'Marquee auto-scroll',
    ],
    products: [
      '4-column grid with hover Quick View button',
      '3-column grid with add to cart button',
      '2-row featured products carousel',
      'Masonry grid with varying card sizes',
    ],
    categories: [
      '3-column cards with subtle product photo and category name',
      'Large image cards with overlay text',
      'Horizontal scroll with category thumbnails',
      '2x2 grid with hover effects',
    ],
  };

  // Generate layouts only for mentioned sections
  let layoutSuggestions = '';
  if (!hasSpecificLayout && mentionedSections.length > 0) {
    const layouts = mentionedSections
      .filter(section => sectionLayouts[section])
      .map(section => `- ${section.charAt(0).toUpperCase() + section.slice(1)}: ${pickRandom(sectionLayouts[section])}`)
      .join('\n');
    
    if (layouts) {
      layoutSuggestions = `\nSECTION LAYOUTS (use these styles):\n${layouts}`;
    }
  }

  // Build MINIMAL enhanced prompt - NO image URLs
  const enhancedPrompt = `${userPrompt}
${layoutSuggestions ? `\n${layoutSuggestions}` : ''}
[Style: ${detectedTheme} | Colors: ${finalColors.dark}, ${finalColors.light}, ${finalColors.accent}]`;

  return {
    originalPrompt: userPrompt,
    enhancedPrompt,
    detectedTheme,
    colors: finalColors,
    images,
  };
}

/**
 * Check if prompt is a design/website request that needs enhancement
 */
export function shouldEnhancePrompt(prompt: string): boolean {
  const designKeywords = [
    'website',
    'landing',
    'page',
    'layout',
    'design',
    'ui',
    'interface',
    'hero',
    'section',
    'create',
    'build',
    'make',
    'generate',
    'сайт',
    'страница',
    'дизайн',
    'создай',
    'сделай',
    'сгенерируй',
  ];

  const lowerPrompt = prompt.toLowerCase();

  return designKeywords.some((keyword) => lowerPrompt.includes(keyword));
}
