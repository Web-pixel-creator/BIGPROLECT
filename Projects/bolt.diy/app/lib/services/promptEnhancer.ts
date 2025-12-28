/**

 * Prompt Enhancer Service

 * Analyzes user prompt and automatically adds design system (colors, images, structure)

 * before sending to LLM

 */



// Theme detection keywords (EN)

const THEME_KEYWORDS: Record<string, string[]> = {
  furniture: [
    'furniture',
    'sofa',
    'chair',
    'table',
    'storage',
    'seating',
    'decor',
    'cabinet',
    'interior',
    'scandinavian',
    'mid-century',
    'furniture brand',
  ],
  vinyl: [
    'vinyl',
    'record',
    'records',
    'turntable',
    'record player',
    'lp',
    'record store',
    'music store',
    'hi-fi',
    'music',
    'vinyl shop',
  ],
  ecommerce: [
    'e-commerce',
    'ecommerce',
    'shop',
    'store',
    'product',
    'cart',
    'checkout',
    'marketplace',
    'retail',
    'catalog',
    'catalogue',
    'ecommerce site',
  ],
  fashion: [
    'fashion',
    'clothing',
    'apparel',
    'shoes',
    'accessories',
    'lookbook',
    'boutique',
    'streetwear',
    'luxury fashion',
  ],
  beauty: [
    'beauty',
    'cosmetics',
    'makeup',
    'skincare',
    'fragrance',
    'perfume',
    'wellness',
    'spa',
  ],
  electronics: [
    'electronics',
    'gadget',
    'phone',
    'smartphone',
    'laptop',
    'smart home',
    'camera',
    'device',
    'tech hardware',
    'wearable',
  ],
  food: [
    'food',
    'grocery',
    'beverage',
    'coffee',
    'tea',
    'snack',
    'bakery',
    'restaurant',
    'cafe',
    'menu',
    'delivery',
    'takeaway',
  ],
  photography: [
    'photography',
    'photographer',
    'photo shoot',
    'photoshoot',
    'portfolio',
    'gallery',
    'freelance',
    'creative',
    'visual',
    'squarespace',
    'photo',
  ],
  industrial: [
    'industrial',
    'energy',
    'oil',
    'gas',
    'power',
    'refinery',
    'pipeline',
    'manufacturing',
    'factory',
    'engineering',
    'industry',
    'utilities',
    'infrastructure',
  ],
  hotel: [
    'hotel',
    'hospitality',
    'resort',
    'boutique hotel',
    'spa',
    'accommodation',
    'booking',
    'travel',
    'stay',
  ],
  tech: [
    'tech',
    'saas',
    'startup',
    'software',
    'app',
    'platform',
    'dashboard',
    'analytics',
    'ai',
    'cloud',
    'devtools',
    'web3',
    'blockchain',
    'crypto',
  ],
  medical: [
    'medical',
    'health',
    'clinic',
    'hospital',
    'doctor',
    'wellness',
    'healthcare',
    'pharmacy',
  ],
  restaurant: [
    'restaurant',
    'cafe',
    'bistro',
    'bar',
    'menu',
    'dining',
  ],
  realestate: [
    'real estate',
    'property',
    'realty',
    'apartments',
    'housing',
    'rent',
  ],
  finance: [
    'finance',
    'fintech',
    'bank',
    'banking',
    'investment',
    'insurance',
  ],
  education: [
    'education',
    'course',
    'academy',
    'school',
    'learning',
    'online course',
    'e-learning',
  ],
  default: [
    'website',
    'landing',
    'page',
    'design',
    'site',
  ],
};

const THEME_KEYWORDS_RU: Record<string, string[]> = {
  furniture: ["мебель", "мебельный", "интерьер", "скандинавский", "сканди", "декор", "дизайн интерьера"],
  vinyl: ["винил", "пластинка", "пластинки", "проигрыватель", "виниловый", "магазин пластинок", "музыка"],
  ecommerce: ["интернет-магазин", "магазин", "витрина", "каталог", "корзина", "товары", "e-commerce", "ecommerce"],
  fashion: ["одежда", "мода", "обувь", "аксессуары", "бутик", "лукбук"],
  beauty: ["косметика", "уход", "красота", "парфюм", "макияж", "спа"],
  electronics: ["электроника", "гаджеты", "смартфон", "ноутбук", "техника", "умный дом"],
  food: ["еда", "доставка", "ресторан", "кафе", "меню", "еда на вынос"],
  photography: ["фотограф", "фотосессия", "портфолио", "фотография", "галерея", "съёмка", "съемка"],
  industrial: ["промышленный", "энергетика", "нефть", "газ", "завод", "производство", "трубопровод", "электростанция"],
  hotel: ["отель", "гостиница", "курорт", "бутик-отель", "бронирование", "размещение"],
  tech: ["саас", "стартап", "технологии", "платформа", "софт", "айти", "web3", "блокчейн", "крипто"],
  medical: ["медицинский", "клиника", "здоровье", "медицина", "больница"],
  restaurant: ["ресторан", "кафе", "бар", "бистро"],
  realestate: ["недвижимость", "квартиры", "риэлтор", "жилье", "аренда"],
  finance: ["финансы", "банк", "страхование", "инвестиции", "финтех"],
  education: ["образование", "курс", "онлайн-курс", "обучение", "школа", "академия"],
};

for (const [theme, keywords] of Object.entries(THEME_KEYWORDS_RU)) {
  if (!THEME_KEYWORDS[theme]) {
    THEME_KEYWORDS[theme] = [];
  }
  THEME_KEYWORDS[theme].push(...keywords);
}










// Color word to HEX mapping - concise dictionary

const COLOR_WORDS_TO_HEX: Record<
  string,
  {
    hex: string;
    type: 'dark' | 'light' | 'accent';
  }
> = {
  'black': { hex: '#111113', type: 'dark' },
  'deep black': { hex: '#0a0a0a', type: 'dark' },
  'charcoal': { hex: '#111113', type: 'dark' },
  'graphite': { hex: '#111113', type: 'dark' },
  'dark gray': { hex: '#1f2937', type: 'dark' },
  'dark grey': { hex: '#1f2937', type: 'dark' },
  'night': { hex: '#0a0a0a', type: 'dark' },
  'white': { hex: '#ffffff', type: 'light' },
  'ivory': { hex: '#f4f3ef', type: 'light' },
  'cream': { hex: '#fdf5e6', type: 'light' },
  'off-white': { hex: '#f8f6f3', type: 'light' },
  'light gray': { hex: '#f3f4f6', type: 'light' },
  'light grey': { hex: '#f3f4f6', type: 'light' },
  'beige': { hex: '#f5f5f0', type: 'light' },
  'gold': { hex: '#C9A66B', type: 'accent' },
  'amber': { hex: '#d97706', type: 'accent' },
  'orange': { hex: '#f97316', type: 'accent' },
  'red': { hex: '#dc2626', type: 'accent' },
  'blue': { hex: '#3b82f6', type: 'accent' },
  'sky': { hex: '#0ea5e9', type: 'accent' },
  'teal': { hex: '#14b8a6', type: 'accent' },
  'green': { hex: '#22c55e', type: 'accent' },
  'emerald': { hex: '#059669', type: 'accent' },
  'purple': { hex: '#8b5cf6', type: 'accent' },
  'pink': { hex: '#ec4899', type: 'accent' },
};

const RU_COLOR_WORDS: Record<string, { hex: string; type: 'dark' | 'light' | 'accent' }> = {
  'черный': { hex: '#111113', type: 'dark' },
  'чёрный': { hex: '#111113', type: 'dark' },
  'глубокий черный': { hex: '#0a0a0a', type: 'dark' },
  'темный': { hex: '#111113', type: 'dark' },
  'тёмный': { hex: '#111113', type: 'dark' },
  'белый': { hex: '#ffffff', type: 'light' },
  'кремовый': { hex: '#fdf5e6', type: 'light' },
  'слоновая кость': { hex: '#f4f3ef', type: 'light' },
  'молочный': { hex: '#f8f6f3', type: 'light' },
  'светлый': { hex: '#f8f6f3', type: 'light' },
  'бежевый': { hex: '#f5f5f0', type: 'light' },
  'серый': { hex: '#f3f4f6', type: 'light' },
  'темно-серый': { hex: '#1f2937', type: 'dark' },
  'тёмно-серый': { hex: '#1f2937', type: 'dark' },
  'светло-серый': { hex: '#f3f4f6', type: 'light' },
  'золотой': { hex: '#C9A66B', type: 'accent' },
  'золото': { hex: '#C9A66B', type: 'accent' },
  'янтарный': { hex: '#d97706', type: 'accent' },
  'красный': { hex: '#dc2626', type: 'accent' },
  'синий': { hex: '#3b82f6', type: 'accent' },
  'голубой': { hex: '#0ea5e9', type: 'accent' },
  'бирюзовый': { hex: '#14b8a6', type: 'accent' },
  'зеленый': { hex: '#22c55e', type: 'accent' },
  'зелёный': { hex: '#22c55e', type: 'accent' },
  'изумрудный': { hex: '#059669', type: 'accent' },
  'фиолетовый': { hex: '#8b5cf6', type: 'accent' },
  'розовый': { hex: '#ec4899', type: 'accent' },
};

Object.assign(COLOR_WORDS_TO_HEX, RU_COLOR_WORDS);








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

  vinyl: {

    dark: '#0b0b0b',

    light: '#f7f2ea',

    accent: '#C9A66B',

    accentName: 'gold',

    textOnDark: '#ffffff',

    textOnLight: '#111113',

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



// Image query sets per theme (used to build safe proxied URLs)

type ImageQuerySet = {

  hero: string[];

  gallery: string[];

  products?: string[];

  categories?: {

    seating: string[];

    tables: string[];

    storage: string[];

  };

  editorial?: string[];

};



type ImageSet = {

  hero: string[];

  gallery: string[];

  products?: string[];

  categories?: {

    seating: string[];

    tables: string[];

    storage: string[];

  };

  editorial?: string[];

};

type ImageSearchQueries = {

  hero?: string[];

  gallery?: string[];

  products?: string[];

  editorial?: string[];

  categories?: {

    seating?: string[];

    tables?: string[];

    storage?: string[];

  };

};

type ImageSearchCounts = {

  hero?: number;

  gallery?: number;

  products?: number;

  editorial?: number;

  categories?: {

    seating?: number;

    tables?: number;

    storage?: number;

  };

};



const IMAGE_PROXY_PREFIX = '/__image_proxy__?url=';
const IMAGE_SEARCH_ENDPOINT = '/api/image-search';
const imageCache = new Map<string, { expiresAt: number; data: ImageSet }>();
const IMAGE_CACHE_TTL_MS = 0; // Disabled - always get fresh images for each prompt

const IMAGE_SIZES = {

  hero: '1600x900',

  gallery: '900x900',

  product: '800x800',

  category: '900x900',

  editorial: '1600x900',

} as const;



const MAX_IMAGE_COUNTS = {
  hero: 1,
  gallery: 3,
  product: 4,
  category: 1,
  editorial: 1,
} as const;



const THEME_IMAGE_QUERIES: Record<string, ImageQuerySet> = {

  furniture: {

    hero: ['scandinavian living room', 'minimal oak dining table', 'neutral interior natural light'],

    gallery: ['scandinavian interior', 'wood furniture', 'minimalist sofa', 'linen chair', 'oak table', 'wooden sideboard'],

    products: [

      'chair white background',

      'wood table white background',

      'sideboard white background',

      'stool white background',

      'lamp white background',

      'shelf white background',

    ],

    categories: {

      seating: ['armchair white background', 'chair white background', 'sofa white background'],

      tables: ['dining table white background', 'coffee table white background', 'oak table white background'],

      storage: ['sideboard white background', 'cabinet white background', 'shelf white background'],

    },

    editorial: ['craftsman woodworking chair', 'woodworking workshop craftsman'],

  },

  vinyl: {

    hero: ['vintage record player', 'vinyl record collection', 'turntable close up'],

    gallery: ['vinyl records', 'record store', 'album covers', 'analog audio', 'dj turntable'],

    products: ['vinyl record album', 'record sleeve mockup', 'vinyl record stack', 'album cover art', 'turntable accessory'],

    categories: {

      seating: ['jazz vinyl record', 'jazz album cover'],

      tables: ['rock vinyl record', 'rock album cover'],

      storage: ['classical vinyl record', 'electronic album cover'],

    },

    editorial: ['record store interior', 'vinyl collector'],

  },

  ecommerce: {

    hero: ['minimal product photography', 'modern retail interior', 'shopping bags flat lay'],

    gallery: ['product flat lay', 'clean studio product', 'minimal lifestyle product', 'product display shelf'],

    products: ['product on white background', 'minimal product shot', 'studio product photography', 'packaging mockup'],

    categories: {

      seating: ['product category seating', 'chair product', 'minimal chair'],

      tables: ['product category tables', 'table product', 'minimal table'],

      storage: ['product category storage', 'cabinet product', 'minimal storage'],

    },

    editorial: ['artisan workshop product', 'product craftsmanship'],

  },

  fashion: {

    hero: ['fashion model studio', 'minimal lookbook', 'streetwear editorial'],

    gallery: ['fashion flat lay', 'apparel rack', 'accessories flat lay', 'boutique interior'],

    products: ['fashion product white background', 'sneakers white background', 'handbag white background', 'jacket white background'],

  },

  beauty: {

    hero: ['cosmetics flat lay', 'skincare bottles', 'perfume bottle'],

    gallery: ['beauty product flat lay', 'makeup palette', 'skincare routine', 'perfume close up'],

    products: ['skincare bottle white background', 'makeup product white background', 'perfume white background', 'lipstick white background'],

  },

  electronics: {

    hero: ['minimal tech desk', 'smartphone close up', 'laptop on desk'],

    gallery: ['gadgets flat lay', 'headphones close up', 'smartwatch close up', 'modern workspace'],

    products: ['smartphone white background', 'laptop white background', 'headphones white background', 'camera white background'],

  },

  food: {

    hero: ['restaurant interior', 'food photography', 'coffee bar'],

    gallery: ['food flat lay', 'coffee cup', 'bakery pastry', 'fresh ingredients'],

    products: ['coffee beans packaging', 'tea packaging', 'snack packaging', 'bottle mockup'],

  },

  photography: {

    hero: ['photographer studio', 'camera on tripod', 'creative photoshoot'],

    gallery: ['portfolio photography', 'studio portrait', 'landscape photography', 'editorial shoot'],

    editorial: ['photographer at work', 'retouching desk'],

  },

  industrial: {

    hero: ['oil refinery', 'industrial plant', 'wind turbines'],

    gallery: ['factory interior', 'pipeline', 'solar panels', 'industrial machinery'],

    editorial: ['engineer at plant', 'industrial maintenance worker'],

  },

  hotel: {

    hero: ['luxury hotel lobby', 'boutique hotel room', 'resort pool'],

    gallery: ['hotel suite', 'spa resort', 'hotel breakfast', 'ocean view hotel'],

    editorial: ['hotel concierge', 'spa treatment'],

  },

  tech: {

    hero: ['saas dashboard', 'modern office team', 'cloud server'],

    gallery: ['tech workspace', 'app ui mockup', 'developer setup', 'data center'],

    editorial: ['team collaboration', 'design sprint'],

  },

  medical: {

    hero: ['medical clinic interior', 'doctor consultation', 'modern hospital'],

    gallery: ['healthcare technology', 'medical team', 'clinic reception'],

    editorial: ['doctor portrait', 'nurse care'],

  },

  restaurant: {

    hero: ['restaurant dining room', 'chef plating', 'cozy cafe'],

    gallery: ['signature dish', 'barista', 'wine glass', 'restaurant ambience'],

    editorial: ['chef at work', 'kitchen prep'],

  },

  realestate: {

    hero: ['modern house exterior', 'luxury apartment interior', 'real estate aerial'],

    gallery: ['living room interior', 'kitchen interior', 'modern architecture', 'interior staging'],

    editorial: ['agent showing home', 'open house'],

  },

  finance: {

    hero: ['finance office', 'stock market screen', 'city skyline'],

    gallery: ['business meeting', 'investment charts', 'banking app'],

    editorial: ['advisor meeting', 'finance team'],

  },

  education: {

    hero: ['modern classroom', 'online learning desk', 'campus library'],

    gallery: ['students studying', 'lecture hall', 'books', 'study group'],

    editorial: ['teacher mentoring', 'student collaboration'],

  },

  default: {

    hero: ['minimal hero background', 'modern abstract interior'],

    gallery: ['clean minimal interior', 'neutral texture background', 'studio backdrop'],

    products: ['product white background', 'minimal product shot'],

    editorial: ['studio workspace'],

  },

};



function normalizeQuery(query: string): string {

  return query

    .split(',')

    .map((part) => part.trim().replace(/\s+/g, '-'))

    .filter(Boolean)

    .join(',');

}



function buildImageUrl(query: string, size: keyof typeof IMAGE_SIZES): string {
  const sizeStr = IMAGE_SIZES[size];
  const [width, height] = sizeStr.split('x').map(Number);

  // Use Unsplash Source as a fallback when API keys are missing.
  // Add random seed to get different images each time (not cached)
  const safeQuery = encodeURIComponent(query);
  const randomSeed = Math.random().toString(36).substring(2, 10) + Date.now();
  const url = `https://source.unsplash.com/${width}x${height}/?${safeQuery}&sig=${randomSeed}`;

  return `${IMAGE_PROXY_PREFIX}${encodeURIComponent(url)}`;
}



function limitList(list: string[], max: number): string[] {

  return list.slice(0, max);

}



function buildImageUrls(queries: string[] | undefined, size: keyof typeof IMAGE_SIZES): string[] {

  if (!queries || queries.length === 0) return [];

  const urls = queries.map((query) => buildImageUrl(query, size));

  const max = MAX_IMAGE_COUNTS[size as keyof typeof MAX_IMAGE_COUNTS] ?? urls.length;

  return limitList(urls, max);

}



function buildImageSet(theme: string): ImageSet {

  const queries = THEME_IMAGE_QUERIES[theme] || THEME_IMAGE_QUERIES.default;
  console.log('[buildImageSet] Using theme:', theme, 'Has queries:', !!queries);
  console.log('[buildImageSet] Hero queries:', queries.hero);
  console.log('[buildImageSet] Products queries:', queries.products);

  const images: ImageSet = {

    hero: buildImageUrls(queries.hero, 'hero'),

    gallery: buildImageUrls(queries.gallery, 'gallery'),

  };



  if (queries.products) {

    images.products = buildImageUrls(queries.products, 'product');

  }



  if (queries.editorial) {

    images.editorial = buildImageUrls(queries.editorial, 'editorial');

  }



  if (queries.categories) {

    images.categories = {

      seating: buildImageUrls(queries.categories.seating, 'category'),

      tables: buildImageUrls(queries.categories.tables, 'category'),

      storage: buildImageUrls(queries.categories.storage, 'category'),

    };

  }



  return images;

}



function pickQuery(queries?: string[]): string {

  if (!queries || queries.length === 0) return '';

  return queries.find((value) => value.trim().length > 0) ?? '';

}



function buildImageSearchQueries(theme: string, sections: string[]): ImageSearchQueries {

  const queries = THEME_IMAGE_QUERIES[theme] || THEME_IMAGE_QUERIES.default;

  const include = (section: string) => sections.includes(section);

  const pickList = (values: string[] | undefined, max: number) => values?.slice(0, max);

  const result: ImageSearchQueries = {};



  if (include('hero')) {
    result.hero = pickList(queries.hero, MAX_IMAGE_COUNTS.hero);
  }

  if (include('gallery')) {
    result.gallery = pickList(queries.gallery, MAX_IMAGE_COUNTS.gallery);
  }

  if (include('products')) {
    result.products = pickList(queries.products, MAX_IMAGE_COUNTS.product);
  }

  if (include('editorial')) {
    result.editorial = pickList(queries.editorial, MAX_IMAGE_COUNTS.editorial);
  }

  if (include('categories') && queries.categories) {
    result.categories = {
      seating: pickList(queries.categories.seating, MAX_IMAGE_COUNTS.category),
      tables: pickList(queries.categories.tables, MAX_IMAGE_COUNTS.category),
      storage: pickList(queries.categories.storage, MAX_IMAGE_COUNTS.category),
    };
  }



  return result;

}



function buildImageSearchCounts(sections: string[]): ImageSearchCounts {

  const include = (section: string) => sections.includes(section);

  const counts: ImageSearchCounts = {};



  if (include('hero')) counts.hero = MAX_IMAGE_COUNTS.hero;

  if (include('gallery')) counts.gallery = MAX_IMAGE_COUNTS.gallery;

  if (include('products')) counts.products = MAX_IMAGE_COUNTS.product;

  if (include('editorial')) counts.editorial = MAX_IMAGE_COUNTS.editorial;

  if (include('categories')) {

    counts.categories = {

      seating: MAX_IMAGE_COUNTS.category,

      tables: MAX_IMAGE_COUNTS.category,

      storage: MAX_IMAGE_COUNTS.category,

    };

  }



  return counts;

}



function normalizeImageSet(images?: Partial<ImageSet>): ImageSet {

  return {

    hero: images?.hero ?? [],

    gallery: images?.gallery ?? [],

    products: images?.products ?? [],

    editorial: images?.editorial ?? [],

    categories: images?.categories
      ? {

        seating: images.categories.seating ?? [],

        tables: images.categories.tables ?? [],

        storage: images.categories.storage ?? [],

      }
      : undefined,

  };

}



function proxyImageUrl(url: string): string {

  if (!url) return url;

  if (url.startsWith(IMAGE_PROXY_PREFIX)) return url;

  return `${IMAGE_PROXY_PREFIX}${encodeURIComponent(url)}`;

}



function proxyImageList(list?: string[]): string[] {

  if (!list) return [];

  return list.map((url) => proxyImageUrl(url));

}



function proxyImageSet(images: ImageSet): ImageSet {

  const proxied: ImageSet = {

    hero: proxyImageList(images.hero),

    gallery: proxyImageList(images.gallery),

    products: proxyImageList(images.products),

    editorial: proxyImageList(images.editorial),

  };



  if (images.categories) {

    proxied.categories = {

      seating: proxyImageList(images.categories.seating),

      tables: proxyImageList(images.categories.tables),

      storage: proxyImageList(images.categories.storage),

    };

  }



  return proxied;

}



async function fetchImageSetFromApi(
  theme: string,
  queries: ImageSearchQueries,
  counts: ImageSearchCounts,
): Promise<ImageSet | null> {
  // Clear cache to ensure fresh images for every prompt
  imageCache.clear();

  const cacheKey = JSON.stringify({ theme, queries, counts });
  const cached = imageCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    console.log('[fetchImageSetFromApi] Using cached images');
    return cached.data;
  }

  console.log('[fetchImageSetFromApi] Fetching images from API:', { theme, queries, counts });

  // Add timeout to prevent infinite hanging
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

  try {
    const response = await fetch(IMAGE_SEARCH_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme, queries, counts }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log('[fetchImageSetFromApi] Response status:', response.status);

    if (!response.ok) {
      console.error('[fetchImageSetFromApi] API returned error:', response.status, response.statusText);
      return null;
    }

    const data = (await response.json()) as ImageSet;
    console.log('[fetchImageSetFromApi] Got images:', data);
    const normalized = normalizeImageSet(data);
    const proxied = proxyImageSet(normalized);

    imageCache.set(cacheKey, { expiresAt: Date.now() + IMAGE_CACHE_TTL_MS, data: proxied });
    return proxied;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('[fetchImageSetFromApi] Error fetching images:', error);
    return null;
  }
}



/**

 * Detect theme from user prompt

 */

function detectTheme(prompt: string): string {
  console.log('[detectTheme] Input prompt:', prompt.substring(0, 300));
  const lowerPrompt = prompt.toLowerCase();
  console.log('[detectTheme] Lower prompt:', lowerPrompt.substring(0, 200));

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    for (const keyword of keywords) {
      if (matchesKeyword(lowerPrompt, keyword)) {
        console.log('[detectTheme] MATCHED theme:', theme, 'keyword:', keyword);
        return theme;
      }
    }
  }

  console.log('[detectTheme] NO THEME MATCHED - returning default');
  return 'default';
}



function extractBrandName(prompt: string): string | null {

  const patterns = [
    /(?:called|named|brand(?: website)?|website called|brand name|project name)\s+["'«»]?([\p{L}\p{N}&\-\s]{2,60})["'«»]?/iu,
    /(?:название|бренд|название бренда|сайт\s*под\s*названием|сайт\s*назван|магазин\s*под\s*названием|проект\s*под\s*названием)\s+["'«»]?([\p{L}\p{N}&\-\s]{2,60})["'«»]?/iu,
  ];





  for (const pattern of patterns) {

    const match = prompt.match(pattern);

    if (match?.[1]) {

      const trimmed = match[1].trim();

      const cleaned = trimmed.split(/[\n,.]/)[0].trim();

      if (cleaned.length >= 2) {

        return cleaned.replace(/\s{2,}/g, ' ');

      }

    }

  }



  return null;

}

const FALLBACK_BRANDS: Record<string, string[]> = {

  furniture: ['Nordic Lane', 'Oakline Studio', 'Linen & Oak', 'Scandi House', 'Timber & Form'],

  vinyl: ['Groove Vault', 'Needle & Tone', 'Vinyl Ritual', 'Analog Room', 'Record & Reel'],

  ecommerce: ['Mercado', 'Cart & Co', 'Storeline', 'Marketly', 'Shelf Studio'],

  fashion: ['Studio Vale', 'Threadline', 'Atelier North', 'Ward & Co', 'Modecraft'],

  beauty: ['Luma Skin', 'Glowroom', 'Aura Botanica', 'Velvet Lab', 'Pureform'],

  electronics: ['Nova Tech', 'Circuit Lane', 'Signal Works', 'Atomix', 'Core Devices'],

  food: ['Harvest Co', 'Bistroline', 'Nourish Lab', 'Table & Co', 'Daily Pantry'],

  photography: ['Frame Stories', 'Northlight', 'Aperture Lane', 'Mono Studio', 'Lumen Studio'],

  industrial: ['Forge Works', 'Fieldline', 'Atlas Energy', 'Iron Ridge', 'Core Industrial'],

  hotel: ['Aurum House', 'Crestline', 'Velvet Suites', 'Noir Retreat', 'Luxe Haven'],

  default: ['Studio North', 'Horizon Works', 'Vista & Co', 'Form & Field', 'Baseline Labs'],

};

function hashString(value: string): number {

  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {

    hash = (hash << 5) - hash + value.charCodeAt(i);

    hash |= 0;

  }

  return Math.abs(hash);

}

function generateBrandName(theme: string, prompt: string): string {

  const pool = FALLBACK_BRANDS[theme] ?? FALLBACK_BRANDS.default;

  const seed = hashString(`${theme}:${prompt}`);

  return pool[seed % pool.length] ?? FALLBACK_BRANDS.default[0];

}



/**

 * Check if user already specified colors in prompt

 */

function hasUserSpecifiedColors(prompt: string): boolean {

  // Check for hex colors like #111113, #F4F3EF

  const hexPattern = /#[0-9A-Fa-f]{6}/g;

  const matches = prompt.match(hexPattern);



  return matches !== null && matches.length >= 1;

}



/**

 * Extract user-specified colors from prompt

 */

function extractUserColors(prompt: string): Record<string, string> | null {

  const hexPattern = /#[0-9A-Fa-f]{6}/g;

  const matches = prompt.match(hexPattern);



  if (!matches || matches.length < 1) {

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



  // If we couldn't identify by context, assign by order (or assume single HEX is the light background).

  if (matches.length === 1) {

    if (!colors.dark && !colors.light && matches[0]) {

      colors.light = matches[0];

    }

  } else {

    if (!colors.dark && matches[0]) {

      colors.dark = matches[0];

    }



    if (!colors.light && matches[1]) {

      colors.light = matches[1];

    }



    if (!colors.accent && matches[2]) {

      colors.accent = matches[2];

    }

  }



  return Object.keys(colors).length ? colors : null;

}



function matchesWord(haystack: string, needle: string): boolean {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}($|[^\\p{L}\\p{N}])`, 'iu');
  const result = pattern.test(haystack);
  // Debug for hero keyword
  if (needle === 'hero' || needle === 'full-width') {
    console.log('[matchesWord] DEBUG:', { haystack: haystack.substring(0, 50), needle, pattern: pattern.source, result });
  }
  return result;
}

function matchesKeyword(haystack: string, needle: string): boolean {
  const hasSpace = needle.includes(' ');
  const result = hasSpace ? haystack.includes(needle) : matchesWord(haystack, needle);
  // Debug for products and categories keywords
  if (needle === 'products' || needle === 'carousel' || needle === 'grid' || needle === 'shop') {
    console.log('[matchesKeyword] DEBUG:', {
      haystack: haystack.substring(0, 80),
      needle,
      hasSpace,
      result
    });
  }
  return result;
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

    if (matchesKeyword(lowerPrompt, colorWord)) {

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



  return Object.keys(COLOR_WORDS_TO_HEX).some((colorWord) => matchesKeyword(lowerPrompt, colorWord));

}



function extractRequirementLines(prompt: string): string[] {

  const lines = prompt

    .split(/\r?\n/)

    .map((line) => line.trim())

    .filter(Boolean);



  const requirements: string[] = [];



  for (const line of lines) {

    if (/^[-*]\s+/.test(line)) {

      requirements.push(line.replace(/^[-*]\s+/, ''));

      continue;

    }



    if (/^\d+\.\s+/.test(line)) {

      requirements.push(line.replace(/^\d+\.\s+/, ''));

      continue;

    }



    if (line.endsWith(':')) {

      requirements.push(line.replace(/:$/, '').trim());

    }

  }



  return Array.from(new Set(requirements));

}



function extractSectionOrder(
  prompt: string,
  sectionKeywords: Record<string, string[]>,
): string[] {
  const lines = prompt
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const order: string[] = [];
  const pushUnique = (section: string) => {
    if (!order.includes(section)) {
      order.push(section);
    }
  };

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    for (const [section, keywords] of Object.entries(sectionKeywords)) {
      if (keywords.some((keyword) => matchesKeyword(lowerLine, keyword))) {
        pushUnique(section);
      }
    }
  }

  return order;
}

type SectionSpecs = {
  order: string[];
  details: Record<string, string[]>;
};

function inferSectionKey(text: string, sectionKeywords: Record<string, string[]>): string | null {
  const lower = text.toLowerCase();
  console.log('[inferSectionKey] Checking text:', { original: text, lower, keywordSectionsCount: Object.keys(sectionKeywords).length });

  // Check hero specifically for debugging
  const heroKeywords = sectionKeywords['hero'];
  if (heroKeywords) {
    console.log('[inferSectionKey] Hero keywords sample:', heroKeywords.slice(0, 5));
    for (const kw of heroKeywords.slice(0, 5)) {
      const matches = matchesKeyword(lower, kw);
      console.log('[inferSectionKey] Testing hero keyword:', { kw, matches });
      if (matches) break;
    }
  }

  for (const [section, keywords] of Object.entries(sectionKeywords)) {
    if (keywords.some((keyword) => matchesKeyword(lower, keyword))) {
      console.log('[inferSectionKey] MATCHED:', { text, section, lower });
      return section;
    }
  }
  console.log('[inferSectionKey] NO MATCH:', { text, lower });
  return null;
}

// NEW: Find ALL sections matching in a text, not just the first one
function inferAllSections(text: string, sectionKeywords: Record<string, string[]>): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];

  for (const [section, keywords] of Object.entries(sectionKeywords)) {
    if (keywords.some((keyword) => matchesKeyword(lower, keyword))) {
      console.log('[inferAllSections] MATCHED:', { section, text: text.substring(0, 50) });
      found.push(section);
    }
  }

  console.log('[inferAllSections] Found sections:', found);
  return found;
}

function extractSectionSpecs(prompt: string, sectionKeywords: Record<string, string[]>): SectionSpecs {
  console.log('[extractSectionSpecs] Parsing prompt:', prompt.substring(0, 200));

  const lines = prompt
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  console.log('[extractSectionSpecs] Found lines:', lines.length, lines);

  const order: string[] = [];
  const details: Record<string, string[]> = {};
  let currentSection: string | null = null;

  const pushSection = (section: string) => {
    console.log('[extractSectionSpecs] Pushing section:', section);
    if (!order.includes(section)) {
      order.push(section);
    }
    if (!details[section]) {
      details[section] = [];
    }
  };

  const parseHeading = (rawText: string) => {
    const trimmed = rawText.replace(/:$/, '').trim();
    const parts = trimmed.split(/:\s+/);
    const headingText = parts[0]?.trim() ?? trimmed;
    const detailText = parts.length > 1 ? parts.slice(1).join(': ').trim() : '';
    const key = inferSectionKey(headingText, sectionKeywords);
    console.log('[extractSectionSpecs] parseHeading:', { rawText, headingText, key });
    return key ? { key, detail: detailText } : null;
  };

  for (const line of lines) {
    const bulletMatch = line.match(/^[-*]\s+(.*)$/) || line.match(/^\d+\.\s+(.*)$/);
    const rawLine = bulletMatch ? bulletMatch[1].trim() : line;

    const hasColon = rawLine.includes(':');
    const headingCandidate =
      (!bulletMatch && (rawLine.endsWith(':') || hasColon)) ||
      (bulletMatch && hasColon);

    console.log('[extractSectionSpecs] LINE:', {
      line: line.substring(0, 60),
      bulletMatch: !!bulletMatch,
      rawLine: rawLine.substring(0, 60),
      hasColon,
      headingCandidate
    });

    if (headingCandidate) {
      const parsed = parseHeading(rawLine);
      console.log('[extractSectionSpecs] parseHeading result:', parsed);
      if (parsed) {
        currentSection = parsed.key;
        pushSection(parsed.key);
        if (parsed.detail) {
          details[parsed.key].push(parsed.detail);
        }
        continue;
      }
    }

    // If not a heading, try to infer ALL sections from the whole line
    console.log('[extractSectionSpecs] Trying inferAllSections for:', rawLine.substring(0, 60));
    const inferredSections = inferAllSections(rawLine, sectionKeywords);
    console.log('[extractSectionSpecs] inferAllSections result:', inferredSections);
    if (inferredSections.length > 0) {
      // Push ALL found sections
      for (const inferredSection of inferredSections) {
        pushSection(inferredSection);
      }
      currentSection = inferredSections[inferredSections.length - 1];
      if (bulletMatch) {
        details[inferredSections[0]].push(rawLine);
      } else if (rawLine !== rawLine.replace(/:$/, '').trim()) {
        const detailText = rawLine.replace(/^[^:]+:\s*/, '').trim();
        if (detailText) {
          details[inferredSections[0]].push(detailText);
        }
      }
      continue;
    }

    if (bulletMatch && currentSection) {
      details[currentSection].push(rawLine);
    }
  }

  return { order, details };
}
function wantsImages(prompt: string, mentionedSections: string[]): boolean {

  const lowerPrompt = prompt.toLowerCase();

  const imageKeywords = [
    'image',
    'photo',
    'photography',
    'gallery',
    'picture',
    'background image',
    'hero image',
    'cover',
    'banner',
    'lifestyle',
    'product photo',
    'album cover',
    'cover art',
    'photo shoot',
    'изображение',
    'картинка',
    'фото',
    'фотография',
    'галерея',
    'фон',
    'обложка',
    'баннер',
    'лайфстайл',
    'товарное фото',
    'обложка альбома',
    'съёмка',
    'съемка',
    'фотосессия',
  ];





  if (mentionedSections.some((section) => ['hero', 'gallery', 'products', 'categories', 'editorial'].includes(section))) {

    return true;

  }



  return imageKeywords.some((keyword) => matchesKeyword(lowerPrompt, keyword));

}



function buildImageSuggestions(mentionedSections: string[], images: ImageSet): string {
  console.log('[buildImageSuggestions] Called with:', {
    mentionedSections,
    hasHero: !!images.hero?.length,
    hasProducts: !!images.products?.length,
    hasCategories: !!images.categories,
    heroUrls: images.hero?.slice(0, 2),
  });

  const lines: string[] = [];

  const include = (section: string) => mentionedSections.includes(section);

  const pushLine = (label: string, urls?: string[]) => {
    if (!urls || urls.length === 0) return;
    const proxied = urls.filter(Boolean).map((url) => proxyImageUrl(url));
    if (proxied.length === 0) return;
    console.log(`[buildImageSuggestions] Adding ${label}:`, proxied.length, 'images');
    lines.push(`${label}: ${proxied.join(' | ')}`);
  };

  if (include('hero')) {
    pushLine('HERO', limitList(images.hero, MAX_IMAGE_COUNTS.hero));
  }

  if (include('gallery')) {
    pushLine('GALLERY', limitList(images.gallery, MAX_IMAGE_COUNTS.gallery));
  }

  if (include('products')) {
    pushLine('PRODUCTS', limitList(images.products ?? [], MAX_IMAGE_COUNTS.product));
  }

  if (include('categories') && images.categories) {
    pushLine('CATEGORIES (Seating)', limitList(images.categories.seating, MAX_IMAGE_COUNTS.category));
    pushLine('CATEGORIES (Tables)', limitList(images.categories.tables, MAX_IMAGE_COUNTS.category));
    pushLine('CATEGORIES (Storage)', limitList(images.categories.storage, MAX_IMAGE_COUNTS.category));
  }

  if (include('editorial')) {
    pushLine('EDITORIAL', limitList(images.editorial ?? [], MAX_IMAGE_COUNTS.editorial));
  }



  if (lines.length === 0) {

    return '';

  }



  return [
    'IMAGES:',
    '(Use these exact proxied URLs. Do NOT invent URLs.)',
    ...lines,
    'IMAGES REQUIRED: If a section mentions images, it MUST include at least one <img> using the URLs above.',
    'Do NOT replace image sections with gradients/placeholders when IMAGES block exists.',
    'Add loading="lazy" to all <img> tags.',
  ].join('\n');

}

function buildSectionDetailsBlock(
  details: Record<string, string[]>,
  sectionLabels: Record<string, string>,
): string {
  const entries = Object.entries(details).filter(([, items]) => items.length > 0);
  if (entries.length === 0) return '';

  const lines = entries.map(([section, items]) => {
    const label = sectionLabels[section] ?? section;
    const uniqueItems = Array.from(new Set(items)).slice(0, 8);
    return `- ${label}: ${uniqueItems.join('; ')}`;
  });

  return `\nSECTION DETAILS (follow exactly):\n${lines.join('\n')}`;
}

function buildSectionBlueprint(
  order: string[],
  details: Record<string, string[]>,
  sectionLabels: Record<string, string>,
): string {
  if (order.length === 0) return '';
  const lines = order.map((section, index) => {
    const label = sectionLabels[section] ?? section;
    const uniqueItems = Array.from(new Set(details[section] ?? [])).slice(0, 3);
    const detailText = uniqueItems.length > 0 ? ` - ${uniqueItems.join('; ')}` : '';
    return `${index + 1}. ${label}${detailText}`;
  });

  return `\nSECTION BLUEPRINT (follow exactly):\n${lines.join('\n')}`;
}



export interface EnhancedPrompt {

  originalPrompt: string;

  enhancedPrompt: string;

  displayPrompt?: string;

  imagePrompt?: string;

  detectedTheme: string;

  colors: typeof THEME_PALETTES.default;

  images: ImageSet;

}



/**

 * Main function to enhance user prompt with design system

 */

export async function enhancePromptWithDesignSystem(userPrompt: string): Promise<EnhancedPrompt> {

  const detectedTheme = detectTheme(userPrompt);

  const palette = THEME_PALETTES[detectedTheme as keyof typeof THEME_PALETTES] || THEME_PALETTES.default;

  let images = buildImageSet(detectedTheme);
  console.log('[promptEnhancer] Initial buildImageSet result:', {
    theme: detectedTheme,
    heroCount: images.hero?.length,
    galleryCount: images.gallery?.length,
    productsCount: images.products?.length,
  });

  const brandName = extractBrandName(userPrompt) ?? generateBrandName(detectedTheme, userPrompt);



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

    const accentKeywords = Object.keys(COLOR_WORDS_TO_HEX).filter(

      (word) => COLOR_WORDS_TO_HEX[word].type === 'accent',

    );

    const accentMetaKeywords = [
      'accent',
      'primary',
      'highlight',
      'primary color',
      'main color',
      'accent color',
      'акцент',
      'акцентный цвет',
      'основной цвет',
      'главный цвет',
    ];






    const lowerPrompt = userPrompt.toLowerCase();

    const hasExplicitAccent = [...accentKeywords, ...accentMetaKeywords].some((keyword) =>

      matchesKeyword(lowerPrompt, keyword),

    );



    if (wordColors.accent && hasExplicitAccent && !hasUserSpecifiedColors(userPrompt)) {

      finalColors.accent = wordColors.accent;

    }

  }



  // Check if user specified specific layouts

  const lowerPrompt = userPrompt.toLowerCase();

  const layoutKeywords = [
    'split',
    'left',
    'right',
    'two column',
    'two-column',
    'two columns',
    '2 column',
    '2-column',
    'image on left',
    'image on right',
    'text on left',
    'text on right',
    'grid',
    'masonry',
    'carousel',
    'slider',
    'horizontal scroll',
    'full-width',
    'full width',
    'full screen',
    'fullscreen',
    'слева',
    'справа',
    'две колонки',
    '2 колонки',
    'двухколоночный',
    'сетка',
    'мозаика',
    'мейсонри',
    'карусель',
    'слайдер',
    'горизонтальный скролл',
    'на всю ширину',
    'на весь экран',
    'полноэкранный',
  ];






  const hasSpecificLayout = layoutKeywords.some((keyword) => matchesKeyword(lowerPrompt, keyword));





  // Helper to pick random item

  const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];



  // Detect which sections user mentioned in prompt

  const sectionKeywords: Record<string, string[]> = {
    navigation: [
      'navigation',
      'navbar',
      'menu',
      'top nav',
      'top navigation',
      'header menu',
      'nav',
      'navigation bar',
      'top bar',
      'menu bar',
      'навигация',
      'навигационное меню',
      'верхнее меню',
      'хедер',
      'шапка',
      'меню',
    ],
    hero: [
      'hero',
      'hero section',
      'hero banner',
      'hero area',
      'hero image',
      'full-width',
      'overlaid text',
      'vintage record player',
      'record player',
      'banner',
      'intro',
      'landing hero',
      'header section',
      'hero header',
      'герой',
      'хиро',
      'баннер',
      'первый экран',
      'шапка',
      'заголовок',
    ],
    features: [
      'feature',
      'features',
      'services',
      'offerings',
      'benefits',
      'advantages',
      'highlights',
      'key features',
      'преимущества',
      'особенности',
      'услуги',
      'предложения',
      'выгоды',
      'фичи',
      'ключевые фичи',
    ],
    gallery: [
      'gallery',
      'portfolio',
      'photos',
      'images',
      'work',
      'showcase',
      'media',
      'галерея',
      'портфолио',
      'фото',
      'изображения',
      'работы',
      'витрина',
    ],
    testimonials: [
      'testimonials',
      'reviews',
      'quotes',
      'feedback',
      'client stories',
      'отзывы',
      'мнения',
      'рекомендации',
      'истории клиентов',
    ],
    pricing: [
      'pricing',
      'plans',
      'packages',
      'tiers',
      'subscription',
      'цены',
      'тарифы',
      'прайс',
      'пакеты',
    ],
    cta: [
      'cta',
      'call to action',
      'signup',
      'join',
      'get started',
      'book now',
      'призыв к действию',
      'записаться',
      'оставить заявку',
      'получить консультацию',
      'заказать',
    ],
    faq: [
      'faq',
      'questions',
      'q&a',
      'help',
      'support',
      'вопросы',
      'вопросы и ответы',
      'частые вопросы',
      'помощь',
    ],
    footer: [
      'footer',
      'bottom',
      'site footer',
      'футер',
      'подвал',
    ],
    about: [
      'about',
      'story',
      'our story',
      'mission',
      'values',
      'about us',
      'о нас',
      'история',
      'миссия',
      'ценности',
    ],
    team: [
      'team',
      'people',
      'staff',
      'leaders',
      'команда',
      'сотрудники',
      'персонал',
    ],
    contact: [
      'contact',
      'get in touch',
      'reach out',
      'form',
      'контакты',
      'связаться',
      'обратная связь',
      'форма',
    ],
    blog: [
      'blog',
      'news',
      'articles',
      'updates',
      'блог',
      'новости',
      'статьи',
    ],
    logo: [
      'logo',
      'clients',
      'partners',
      'brands',
      'логотипы',
      'клиенты',
      'партнеры',
      'бренды',
    ],
    products: [
      'products',
      'product grid',
      'product listing',
      'product cards',
      'vinyl cards',
      'album cards',
      'record cards',
      'bestsellers',
      'catalog',
      'items',
      'shop',
      'store items',
      'records',
      'grid',
      'listing',
      'товары',
      'продукты',
      'каталог',
      'витрина',
      'карточки товаров',
      'пластинки',
    ],
    categories: [
      'categories',
      'category cards',
      'category carousel',
      'collections',
      'genres',
      'genre',
      'genre carousel',
      'music genres',
      'carousel',
      'slider',
      'horizontal scroll',
      'filter buttons',
      'filter tags',
      'tags',
      'pills',
      'chips',
      'rounded tags',
      'категории',
      'категории товаров',
      'коллекции',
      'жанры',
      'теги',
      'плашки',
      'фильтры',
    ],
    editorial: [
      'editorial',
      'story section',
      'magazine',
      'article',
      'редакционный',
      'история бренда',
      'журнал',
    ],
    newsletter: [
      'newsletter',
      'subscribe',
      'email signup',
      'mailing list',
      'рассылка',
      'подписка',
      'подписаться',
    ],
  };




  // Find which sections are mentioned
  const sectionSpecs = extractSectionSpecs(userPrompt, sectionKeywords);
  console.log('[promptEnhancer] sectionSpecs result:', JSON.stringify(sectionSpecs, null, 2));
  const orderedSections =
    sectionSpecs.order.length > 0 ? sectionSpecs.order : extractSectionOrder(userPrompt, sectionKeywords);
  console.log('[promptEnhancer] orderedSections:', orderedSections);
  const mentionedSections: string[] = orderedSections.length > 0 ? [...orderedSections] : [];

  // ALWAYS scan for additional sections that weren't found by extractSectionSpecs
  // This ensures keywords like "carousel" and "products" are caught even in simple prompts
  for (const [section, keywords] of Object.entries(sectionKeywords)) {
    if (!mentionedSections.includes(section)) {
      if (keywords.some((kw) => matchesKeyword(lowerPrompt, kw))) {
        console.log('[promptEnhancer] Fallback found section:', section);
        mentionedSections.push(section);
      }
    }
  }

  console.log('[promptEnhancer] Detected theme:', detectedTheme);
  console.log('[promptEnhancer] Mentioned sections:', mentionedSections);
  console.log('[promptEnhancer] Wants images:', wantsImages(userPrompt, mentionedSections));

  if (wantsImages(userPrompt, mentionedSections)) {
    const queries = buildImageSearchQueries(detectedTheme, mentionedSections);
    const counts = buildImageSearchCounts(mentionedSections);
    console.log('[promptEnhancer] Image queries:', JSON.stringify(queries));
    console.log('[promptEnhancer] Image counts:', JSON.stringify(counts));

    const apiImages = await fetchImageSetFromApi(detectedTheme, queries, counts);
    console.log('[promptEnhancer] API returned images:', apiImages ? 'yes' : 'no');

    if (apiImages) {
      images = apiImages;
      console.log('[promptEnhancer] Using API images, hero count:', images.hero?.length);
    }
  }

  images = proxyImageSet(normalizeImageSet(images));



  // Section layout variants

  const sectionLayouts: Record<string, string[]> = {

    navigation: [

      'Minimal top nav: logo left, links center, icons right',

      'Centered nav with logo above links',

    ],

    hero: [

      'Full-width hero with centered text and background image',

      'Split hero: text left (40%), large image right (60%)',

      'Split hero: image left (60%), text right (40%)',

      'Full-screen hero with minimal headline',

      'Hero with floating card on the right',

      'Asymmetric diagonal split hero',

    ],

    features: [

      '3-column icon cards',

      '4-column compact feature grid',

      'Alternating image/text rows',

      'Bento-style grid',

      'Single column with large icons',

    ],

    gallery: [

      'Masonry grid layout',

      '3-column image grid',

      'Carousel slider',

      'Staggered cards grid',

      'Horizontal scroll gallery',

    ],

    testimonials: [

      'Carousel of testimonial cards',

      '3-column testimonial cards',

      'Featured quote with side cards',

      'Alternating quote/author layout',

      'Stacked cards with ratings',

    ],

    pricing: [

      '3-column pricing cards',

      '2-column comparison table',

      'Toggle monthly/annual with cards',

      'Expandable pricing tiers',

    ],

    cta: [

      'Centered card with glow effect',

      'Split: text left, form right',

      'Full-width banner with button',

      'Minimal text with button',

      'Two-column CTA with image',

    ],

    faq: [

      'Accordion list',

      '2-column FAQ grid',

      'Card-based FAQ',

      'Tabbed FAQ sections',

    ],

    footer: [

      '4-column footer with links',

      'Minimal centered footer',

      '3-column footer with newsletter',

      'Dark gradient footer',

    ],

    about: [

      'Split: text left, image right',

      'Story with stats row',

      'Timeline-style story',

      'Centered story with highlights',

    ],

    team: [

      '3-column team cards',

      'Horizontal scroll team slider',

      'Split: portrait + bio',

      'Stacked list with avatars',

    ],

    contact: [

      'Form left, contact info right',

      'Centered form with map below',

      'Split: map left, form right',

      'Minimal contact cards',

    ],

    blog: [

      'Featured post + 3 cards',

      '3-column blog grid',

      'Masonry cards',

      'List with thumbnails',

    ],

    logo: [

      'Logo bar row',

      'Marquee logo strip',

      'Grid of partner logos',

    ],

    products: [

      '4-column product grid with hover actions',

      'Product cards with image + price row',

      'Compact product grid with quick view',

      'Grid with filters sidebar',

    ],

    categories: [

      '3-category cards in a row',

      'Image tiles with labels',

      'Icon grid with category labels',

    ],

    editorial: [

      'Full-width image with text overlay',

      'Split: image left, story text right',

      'Story card with quote and author',

    ],

    newsletter: [

      'Centered form with input + button',

      'Split: text left, form right',

      'Compact bar with inline input',

    ],

  };





  const sectionLabels: Record<string, string> = {

    navigation: 'Navigation',

    hero: 'Hero',

    features: 'Features',

    gallery: 'Gallery',

    testimonials: 'Testimonials',

    pricing: 'Pricing',

    cta: 'CTA',

    faq: 'FAQ',

    footer: 'Footer',

    about: 'About',

    team: 'Team',

    contact: 'Contact',

    blog: 'Blog',

    logo: 'Logo',

    products: 'Products',

    categories: 'Categories',

    editorial: 'Editorial',

    newsletter: 'Newsletter',

  };





  // Generate layouts only for mentioned sections

  let layoutSuggestions = '';

  if (!hasSpecificLayout && mentionedSections.length > 0) {

    const layouts = mentionedSections

      .filter((section) => sectionLayouts[section])

      .map(

        (section) => `- ${section.charAt(0).toUpperCase() + section.slice(1)}: ${pickRandom(sectionLayouts[section])}`,

      )

      .join('\n');



    if (layouts) {

      layoutSuggestions = `\nSECTION LAYOUTS (use these styles):\n${layouts}`;

    }

  }



  const sectionChecklist =
    mentionedSections.length > 0
      ? `\nSECTIONS (must include all): ${mentionedSections
        .map((section) => sectionLabels[section] ?? section)
        .join(', ')}`
      : '';

  const sectionContract =
    mentionedSections.length > 0
      ? `\nSECTION CONTRACT:\n- Render exactly ${mentionedSections.length} sections.\n- Add a comment {/** SECTION: <label> */} before each section.\n- If output length is a concern, shorten sections but DO NOT omit any.`
      : '';

  const sectionOrderLine =
    mentionedSections.length > 0
      ? `\nSECTION ORDER (render in this order): ${mentionedSections
        .map((section) => sectionLabels[section] ?? section)
        .join(' -> ')}`
      : '';

  const sectionCountLine =
    mentionedSections.length > 0 ? `\nSECTION COUNT: ${mentionedSections.length}` : '';

  const sectionDetailsBlock = buildSectionDetailsBlock(sectionSpecs.details, sectionLabels);
  const sectionBlueprint = buildSectionBlueprint(mentionedSections, sectionSpecs.details, sectionLabels);

  const requirements = extractRequirementLines(userPrompt).slice(0, 20);
  const requirementsBlock =
    requirements.length > 0 ? `\nREQUIREMENTS (must implement):\n- ${requirements.join('\n- ')}` : '';

  console.log('[promptEnhancer] Before buildImageSuggestions:', {
    mentionedSections,
    wantsImagesResult: wantsImages(userPrompt, mentionedSections),
    imagesHero: images.hero?.slice(0, 1),
    imagesProducts: images.products?.slice(0, 1),
    imagesGallery: images.gallery?.slice(0, 1),
  });

  const imageSuggestions = wantsImages(userPrompt, mentionedSections)
    ? buildImageSuggestions(mentionedSections, images)
    : '';
  console.log('[promptEnhancer] imageSuggestions result:', imageSuggestions?.substring(0, 200));
  const imagePrompt = imageSuggestions ? `\n${imageSuggestions}` : '';
  const brandLine = `\nBRAND NAME (use exactly): ${brandName}`;
  const templateGuard =
    '\nIMPORTANT: Do not use any generic/default template. Do not use BoltApp/ModernApp/ProjectName. Invent a brand name if none was given. Follow the prompt exactly.';

  const enhancedPrompt = `${userPrompt}
${brandLine}${sectionBlueprint}${sectionChecklist}${sectionContract}${sectionOrderLine}${sectionCountLine}${sectionDetailsBlock}${requirementsBlock}${layoutSuggestions ? `\n${layoutSuggestions}` : ''}${templateGuard}
[Style: ${detectedTheme} | Colors: ${finalColors.dark}, ${finalColors.light}, ${finalColors.accent}]${imagePrompt}`;

  console.log('[promptEnhancer] BEFORE shortSectionsLine, mentionedSections:', JSON.stringify(mentionedSections));
  console.log('[promptEnhancer] sectionSpecs.order was:', JSON.stringify(sectionSpecs.order));
  console.log('[promptEnhancer] orderedSections was:', JSON.stringify(orderedSections));
  const shortSectionsLine =
    mentionedSections.length > 0
      ? `\nSections: ${mentionedSections.map((section) => sectionLabels[section] ?? section).join(', ')}`
      : '';
  console.log('[promptEnhancer] shortSectionsLine result:', shortSectionsLine);
  const displayPrompt = `${userPrompt}${shortSectionsLine}
[Style: ${detectedTheme} | Colors: ${finalColors.dark}, ${finalColors.light}, ${finalColors.accent}]`;


  console.log('[promptEnhancer] FINAL RESULT:', {
    hasImagePrompt: !!imagePrompt,
    imagePromptLength: imagePrompt?.length,
    imagePromptPreview: imagePrompt?.substring(0, 200),
    mentionedSections: mentionedSections,
  });

  return {

    originalPrompt: userPrompt,

    enhancedPrompt,

    displayPrompt,

    imagePrompt,
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
    'site',
    'landing',
    'landing page',
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
    'mockup',
    'prototype',
    'web page',
    'homepage',
    'app',
    'screen',
    'wireframe',
    'сайт',
    'лендинг',
    'главная',
    'страница',
    'дизайн',
    'интерфейс',
    'шапка',
    'секция',
    'экран',
    'макет',
    'прототип',
    'создай',
    'сделай',
    'сверстай',
  ];




  const lowerPrompt = prompt.toLowerCase();

  if (designKeywords.some((keyword) => matchesKeyword(lowerPrompt, keyword))) {
    return true;
  }

  return extractRequirementLines(prompt).length > 0;
}













