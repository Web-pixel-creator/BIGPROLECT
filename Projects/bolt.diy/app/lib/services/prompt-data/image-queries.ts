/**
 * Image Queries Data Module
 * Contains image query sets, sizes, and counts for each theme
 */

// Image query set type
export type ImageQuerySet = {
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

// Image set type (URLs)
export type ImageSet = {
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

// Image search queries type
export type ImageSearchQueries = {
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

// Image search counts type
export type ImageSearchCounts = {
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

// Image sizes for different contexts
export const IMAGE_SIZES = {
  hero: '1600x900',
  gallery: '900x900',
  product: '800x800',
  category: '900x900',
  editorial: '1600x900',
} as const;

// Maximum image counts per category
export const MAX_IMAGE_COUNTS = {
  hero: 1,
  gallery: 3,
  product: 4,
  category: 1,
  editorial: 1,
} as const;

// Minimum image counts per section
export const SECTION_IMAGE_MIN_COUNTS: Record<string, number> = {
  hero: 1,
  gallery: 2,
  products: 4,
  editorial: 1,
};

// Theme-specific image queries
export const THEME_IMAGE_QUERIES: Record<string, ImageQuerySet> = {
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
  automotive: {
    hero: ['luxury car showroom', 'sports car on road', 'car dealership interior'],
    gallery: ['car interior', 'car engine', 'car wheels', 'car dashboard'],
    products: ['car white background', 'tire white background', 'car parts white background'],
    editorial: ['mechanic at work', 'car service center'],
  },
  travel: {
    hero: ['tropical beach destination', 'mountain landscape travel', 'city skyline travel'],
    gallery: ['travel destination', 'airplane window view', 'hotel pool', 'adventure hiking'],
    editorial: ['traveler with backpack', 'travel planning map'],
  },
  gaming: {
    hero: ['gaming setup rgb', 'esports arena', 'gaming pc setup'],
    gallery: ['gaming controller', 'gaming headset', 'gaming keyboard', 'gaming monitor'],
    products: ['gaming mouse white background', 'gaming headset white background', 'gaming chair white background'],
    editorial: ['gamer streaming', 'esports team'],
  },
  sports: {
    hero: ['fitness gym interior', 'athlete training', 'sports stadium'],
    gallery: ['workout equipment', 'running track', 'sports team', 'fitness class'],
    products: ['sports shoes white background', 'fitness equipment white background', 'sportswear white background'],
    editorial: ['personal trainer', 'athlete portrait'],
  },
  default: {
    hero: ['minimal hero background', 'modern abstract interior'],
    gallery: ['clean minimal interior', 'neutral texture background', 'studio backdrop'],
    products: ['product white background', 'minimal product shot'],
    editorial: ['studio workspace'],
  },
};
