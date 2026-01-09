import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { createScopedLogger } from '~/utils/logger';

type ImageSet = {
  hero: string[];
  gallery: string[];
  products?: string[];
  editorial?: string[];
  categories?: {
    seating: string[];
    tables: string[];
    storage: string[];
  };
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

type ImageSearchPayload = {
  theme?: string;
  queries?: ImageSearchQueries;
  counts?: ImageSearchCounts;
};

const logger = createScopedLogger('api.image-search');
const CACHE_TTL_MS = 0;
const cache = new Map<string, { expiresAt: number; data: ImageSet }>();
const shouldCache = CACHE_TTL_MS > 0;

const MAX_COUNTS = {
  hero: 2,
  gallery: 4,
  products: 6,
  editorial: 2,
  category: 2,
};

const FALLBACK_WIDTHS: Record<keyof typeof MAX_COUNTS, number> = {
  hero: 1920,
  gallery: 1200,
  products: 900,
  editorial: 1600,
  category: 900,
};

const DEFAULT_COUNTS: Required<ImageSearchCounts> = {
  hero: MAX_COUNTS.hero,
  gallery: MAX_COUNTS.gallery,
  products: MAX_COUNTS.products,
  editorial: MAX_COUNTS.editorial,
  categories: {
    seating: MAX_COUNTS.category,
    tables: MAX_COUNTS.category,
    storage: MAX_COUNTS.category,
  },
};

const pickQuery = (queries?: string[]): string => {
  const list = (queries ?? []).map((value) => value.trim()).filter(Boolean);

  if (list.length === 0) {
    return '';
  }

  return list[Math.floor(Math.random() * list.length)];
};

const clampCount = (value: number | undefined, max: number): number => {
  if (!value || Number.isNaN(value)) {
    return max;
  }

  return Math.max(1, Math.min(max, value));
};

const getEnvVar = (context: ActionFunctionArgs['context'], name: string): string | undefined => {
  const env = (context?.cloudflare?.env as Record<string, string | undefined>) ?? {};
  return env[name] || process.env[name];
};

const buildSourceFallback = (query: string, count: number, width: number) => {
  if (!query) {
    return [];
  }

  const height = Math.round(width * 0.6);

  return Array.from({ length: count }, (_value, index) => {
    const seed = Date.now() + Math.floor(Math.random() * 10000) + index;
    const encodedQuery = encodeURIComponent(query).replace(/%2C/g, ',');

    return `https://source.unsplash.com/${width}x${height}/?${encodedQuery}&sig=${seed}`;
  });
};

const pickRandomPage = (max: number = 5) => Math.floor(Math.random() * max) + 1;

async function fetchUnsplashRandom(query: string, count: number, orientation: string, accessKey?: string) {
  if (!accessKey) {
    return [];
  }

  const url = new URL('https://api.unsplash.com/photos/random');
  url.searchParams.set('query', query);
  url.searchParams.set('count', String(count));
  url.searchParams.set('orientation', orientation);
  url.searchParams.set('content_filter', 'high');

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      'Accept-Version': 'v1',
    },
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as { urls?: Record<string, string> } | Array<{ urls?: Record<string, string> }>;
  const items = Array.isArray(data) ? data : [data];

  return items.map((item) => item.urls?.regular).filter((value): value is string => Boolean(value));
}

async function fetchUnsplashSearch(
  query: string,
  count: number,
  orientation: string,
  page: number,
  accessKey?: string,
) {
  if (!accessKey) {
    return [];
  }

  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', String(count));
  url.searchParams.set('orientation', orientation);
  url.searchParams.set('content_filter', 'high');
  url.searchParams.set('page', String(page));

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      'Accept-Version': 'v1',
    },
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as { results?: Array<{ urls?: Record<string, string> }> };

  return (data.results ?? []).map((item) => item.urls?.regular).filter((value): value is string => Boolean(value));
}

async function fetchPexels(query: string, count: number, orientation: string, page: number, apiKey?: string) {
  if (!apiKey) {
    return [];
  }

  const url = new URL('https://api.pexels.com/v1/search');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', String(count));
  url.searchParams.set('orientation', orientation);
  url.searchParams.set('page', String(page));

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: apiKey,
    },
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as { photos?: Array<{ src?: Record<string, string> }> };

  return (data.photos ?? []).map((item) => item.src?.large).filter((value): value is string => Boolean(value));
}

async function searchImages(
  context: ActionFunctionArgs['context'],
  query: string,
  count: number,
  orientation: string,
  fallbackWidth: number,
) {
  if (!query) {
    return [];
  }

  const page = pickRandomPage();
  const unsplashKey = getEnvVar(context, 'UNSPLASH_ACCESS_KEY');
  const pexelsKey = getEnvVar(context, 'PEXELS_API_KEY');

  const unsplashRandom = await fetchUnsplashRandom(query, count, orientation, unsplashKey).catch((error) => {
    logger.warn('Unsplash fetch failed', error);
    return [];
  });

  let combined = [...unsplashRandom];

  if (combined.length < count) {
    const remaining = count - combined.length;
    const unsplashSearch = await fetchUnsplashSearch(query, remaining, orientation, page, unsplashKey).catch(
      (error) => {
        logger.warn('Unsplash search failed', error);
        return [];
      },
    );
    combined = [...combined, ...unsplashSearch];
  }

  if (combined.length >= count) {
    return combined.slice(0, count);
  }

  const remaining = count - combined.length;
  const pexelsResults = await fetchPexels(query, remaining, orientation, page, pexelsKey).catch((error) => {
    logger.warn('Pexels fetch failed', error);
    return [];
  });

  const withPexels = [...combined, ...pexelsResults];

  if (withPexels.length > 0) {
    return withPexels.slice(0, count);
  }

  return buildSourceFallback(query, count, fallbackWidth);
}

function buildCacheKey(payload: ImageSearchPayload) {
  return JSON.stringify(payload);
}

function normalizeList(values?: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const value of values ?? []) {
    const trimmed = value?.trim();

    if (!trimmed || seen.has(trimmed)) {
      continue;
    }

    seen.add(trimmed);
    out.push(trimmed);
  }

  return out;
}

export async function action({ context, request }: ActionFunctionArgs) {
  logger.info('=== IMAGE SEARCH API CALLED ===');

  let payload: ImageSearchPayload;

  try {
    payload = (await request.json()) as ImageSearchPayload;
    logger.info('Payload received:', JSON.stringify(payload, null, 2));
  } catch {
    logger.error('Invalid JSON body');
    return json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const unsplashKey = getEnvVar(context, 'UNSPLASH_ACCESS_KEY');
  logger.info('UNSPLASH_ACCESS_KEY present:', !!unsplashKey);
  logger.info('process.env.UNSPLASH_ACCESS_KEY present:', !!process.env.UNSPLASH_ACCESS_KEY);

  const queries = payload.queries ?? {};
  const counts = payload.counts ?? {};
  const cacheKey = buildCacheKey({ theme: payload.theme, queries, counts });
  const cached = shouldCache ? cache.get(cacheKey) : undefined;

  if (cached && cached.expiresAt > Date.now()) {
    logger.info('Returning cached images');
    return json(cached.data);
  }

  const heroCount = clampCount(counts.hero, MAX_COUNTS.hero);
  const galleryCount = clampCount(counts.gallery, MAX_COUNTS.gallery);
  const productsCount = clampCount(counts.products, MAX_COUNTS.products);
  const editorialCount = clampCount(counts.editorial, MAX_COUNTS.editorial);
  const seatingCount = clampCount(counts.categories?.seating, MAX_COUNTS.category);
  const tablesCount = clampCount(counts.categories?.tables, MAX_COUNTS.category);
  const storageCount = clampCount(counts.categories?.storage, MAX_COUNTS.category);

  const heroQuery = pickQuery(queries.hero);
  const galleryQuery = pickQuery(queries.gallery);
  const productsQuery = pickQuery(queries.products);
  const editorialQuery = pickQuery(queries.editorial);
  const seatingQuery = pickQuery(queries.categories?.seating);
  const tablesQuery = pickQuery(queries.categories?.tables);
  const storageQuery = pickQuery(queries.categories?.storage);

  const [hero, gallery, products, editorial, seating, tables, storage] = await Promise.all([
    searchImages(context, heroQuery, heroCount, 'landscape', FALLBACK_WIDTHS.hero),
    searchImages(context, galleryQuery, galleryCount, 'landscape', FALLBACK_WIDTHS.gallery),
    searchImages(context, productsQuery, productsCount, 'squarish', FALLBACK_WIDTHS.products),
    searchImages(context, editorialQuery, editorialCount, 'landscape', FALLBACK_WIDTHS.editorial),
    searchImages(context, seatingQuery, seatingCount, 'squarish', FALLBACK_WIDTHS.category),
    searchImages(context, tablesQuery, tablesCount, 'squarish', FALLBACK_WIDTHS.category),
    searchImages(context, storageQuery, storageCount, 'squarish', FALLBACK_WIDTHS.category),
  ]);

  logger.info('Search results - hero:', hero.length, 'gallery:', gallery.length, 'products:', products.length);

  const data: ImageSet = {
    hero: normalizeList(hero),
    gallery: normalizeList(gallery),
    products: normalizeList(products),
    editorial: normalizeList(editorial),
    categories: {
      seating: normalizeList(seating),
      tables: normalizeList(tables),
      storage: normalizeList(storage),
    },
  };

  if (shouldCache) {
    cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, data });
  }

  return json(data);
}
