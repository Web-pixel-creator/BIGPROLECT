/**
 * Theme Keywords Data Module
 * Contains theme detection keywords for EN and RU languages
 */

// Theme detection keywords (EN)
export const THEME_KEYWORDS: Record<string, string[]> = {
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

// Theme detection keywords (RU)
export const THEME_KEYWORDS_RU: Record<string, string[]> = {
  furniture: ['мебель', 'мебельный', 'интерьер', 'скандинавский', 'сканди', 'декор', 'дизайн интерьера'],
  vinyl: ['винил', 'пластинка', 'пластинки', 'проигрыватель', 'виниловый', 'магазин пластинок', 'музыка'],
  ecommerce: ['интернет-магазин', 'магазин', 'витрина', 'каталог', 'корзина', 'товары'],
  fashion: ['одежда', 'мода', 'обувь', 'аксессуары', 'бутик', 'лукбук'],
  beauty: ['косметика', 'уход', 'красота', 'парфюм', 'макияж', 'спа'],
  electronics: ['электроника', 'гаджеты', 'смартфон', 'ноутбук', 'техника', 'умный дом'],
  food: ['еда', 'доставка', 'ресторан', 'кафе', 'меню', 'еда на вынос'],
  photography: ['фотограф', 'фотосессия', 'портфолио', 'фотография', 'галерея', 'съёмка', 'съемка'],
  industrial: ['промышленный', 'энергетика', 'нефть', 'газ', 'завод', 'производство', 'трубопровод', 'электростанция'],
  hotel: ['отель', 'гостиница', 'курорт', 'бутик-отель', 'бронирование', 'размещение'],
  tech: ['саас', 'стартап', 'технологии', 'платформа', 'софт', 'айти', 'блокчейн', 'крипто'],
  medical: ['медицинский', 'клиника', 'здоровье', 'медицина', 'больница'],
  restaurant: ['ресторан', 'кафе', 'бар', 'бистро'],
  realestate: ['недвижимость', 'квартиры', 'риэлтор', 'жилье', 'аренда'],
  finance: ['финансы', 'банк', 'страхование', 'инвестиции', 'финтех'],
  education: ['образование', 'курс', 'онлайн-курс', 'обучение', 'школа', 'академия'],
};

/**
 * Get merged keywords (EN + RU) for all themes
 * Call this once at initialization instead of mutating at import time
 */
export function getMergedKeywords(): Record<string, string[]> {
  const merged: Record<string, string[]> = {};

  // Copy EN keywords
  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    merged[theme] = [...keywords];
  }

  // Add RU keywords
  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS_RU)) {
    if (!merged[theme]) {
      merged[theme] = [];
    }
    merged[theme].push(...keywords);
  }

  return merged;
}
