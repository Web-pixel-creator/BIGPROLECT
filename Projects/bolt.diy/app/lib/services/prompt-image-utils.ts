import {
  randomImageSeed,
  IMAGE_SIZES,
  MAX_IMAGE_COUNTS,
  SECTION_IMAGE_MIN_COUNTS,
  THEME_IMAGE_QUERIES,
  type ImageSet,
  type ImageSearchQueries,
  type ImageSearchCounts,
} from './prompt-data';
import { pickRandomUnique, shuffleList } from './prompt-random-utils';

const IMAGE_PROXY_PREFIX = '/__image_proxy__?url=';
const IMAGE_SEARCH_ENDPOINT = '/api/image-search';
const imageCache = new Map<string, { expiresAt: number; data: ImageSet }>();
const IMAGE_CACHE_TTL_MS = 0; // Disabled - always get fresh images for each prompt
const RECENT_IMAGE_LIMIT = 180;
const recentImageQueue: string[] = [];
const recentImageSet = new Set<string>();

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

  const safeQuery = encodeURIComponent(query).replace(/%2C/g, ',');
  const randomSeed = randomImageSeed();
  const url = `https://source.unsplash.com/${width}x${height}/?${safeQuery}&sig=${randomSeed}`;

  return `${IMAGE_PROXY_PREFIX}${encodeURIComponent(url)}`;
}

function limitList(list: string[], max: number): string[] {
  return list.slice(0, max);
}

function mergeImageLists(primary: string[] | undefined, fallback: string[] | undefined, max: number): string[] {
  const merged: string[] = [];
  const seen = new Set<string>();

  const pushUnique = (value: string) => {
    if (!value || seen.has(value)) {
      return;
    }

    seen.add(value);
    merged.push(value);
  };

  (primary ?? []).forEach(pushUnique);
  (fallback ?? []).forEach(pushUnique);

  return limitList(merged, max);
}

function mergeImageSets(primary: ImageSet, fallback: ImageSet): ImageSet {
  const normalizedPrimary = normalizeImageSet(primary);
  const normalizedFallback = normalizeImageSet(fallback);

  const merged: ImageSet = {
    hero: mergeImageLists(normalizedPrimary.hero, normalizedFallback.hero, MAX_IMAGE_COUNTS.hero),
    gallery: mergeImageLists(normalizedPrimary.gallery, normalizedFallback.gallery, MAX_IMAGE_COUNTS.gallery),
    products: mergeImageLists(normalizedPrimary.products, normalizedFallback.products, MAX_IMAGE_COUNTS.product),
    editorial: mergeImageLists(normalizedPrimary.editorial, normalizedFallback.editorial, MAX_IMAGE_COUNTS.editorial),
  };

  if (normalizedPrimary.categories || normalizedFallback.categories) {
    merged.categories = {
      seating: mergeImageLists(
        normalizedPrimary.categories?.seating,
        normalizedFallback.categories?.seating,
        MAX_IMAGE_COUNTS.category,
      ),
      tables: mergeImageLists(
        normalizedPrimary.categories?.tables,
        normalizedFallback.categories?.tables,
        MAX_IMAGE_COUNTS.category,
      ),
      storage: mergeImageLists(
        normalizedPrimary.categories?.storage,
        normalizedFallback.categories?.storage,
        MAX_IMAGE_COUNTS.category,
      ),
    };
  }

  return merged;
}

function rememberRecentImage(url: string) {
  if (!url) {
    return;
  }

  if (recentImageSet.has(url)) {
    return;
  }

  recentImageSet.add(url);
  recentImageQueue.push(url);

  if (recentImageQueue.length > RECENT_IMAGE_LIMIT) {
    const removed = recentImageQueue.shift();

    if (removed) {
      recentImageSet.delete(removed);
    }
  }
}

function recordRecentImages(images: ImageSet) {
  images.hero.forEach(rememberRecentImage);
  images.gallery.forEach(rememberRecentImage);
  images.products?.forEach(rememberRecentImage);
  images.editorial?.forEach(rememberRecentImage);

  if (images.categories) {
    images.categories.seating.forEach(rememberRecentImage);
    images.categories.tables.forEach(rememberRecentImage);
    images.categories.storage.forEach(rememberRecentImage);
  }
}

function filterRecentImageList(list: string[], minKeep: number): string[] {
  if (!list || list.length <= minKeep) {
    return list;
  }

  const filtered = list.filter((url) => !recentImageSet.has(url));

  if (filtered.length >= minKeep) {
    return filtered;
  }

  return list;
}

function filterRecentImages(images: ImageSet): ImageSet {
  const filtered: ImageSet = {
    hero: filterRecentImageList(images.hero, SECTION_IMAGE_MIN_COUNTS.hero ?? 1),
    gallery: filterRecentImageList(images.gallery, SECTION_IMAGE_MIN_COUNTS.gallery ?? 1),
  };

  if (images.products) {
    filtered.products = filterRecentImageList(images.products, SECTION_IMAGE_MIN_COUNTS.products ?? 1);
  }

  if (images.editorial) {
    filtered.editorial = filterRecentImageList(images.editorial, SECTION_IMAGE_MIN_COUNTS.editorial ?? 1);
  }

  if (images.categories) {
    filtered.categories = {
      seating: filterRecentImageList(images.categories.seating, 1),
      tables: filterRecentImageList(images.categories.tables, 1),
      storage: filterRecentImageList(images.categories.storage, 1),
    };
  }

  return filtered;
}

function buildImageUrls(queries: string[] | undefined, size: keyof typeof IMAGE_SIZES): string[] {
  if (!queries || queries.length === 0) {
    return [];
  }

  const uniqueQueries = Array.from(new Set(queries));
  const urls = shuffleList(uniqueQueries).map((query) => buildImageUrl(query, size));
  const max = MAX_IMAGE_COUNTS[size as keyof typeof MAX_IMAGE_COUNTS] ?? urls.length;

  return urls.slice(0, max);
}

function buildImageSet(theme: string): ImageSet {
  const queries = THEME_IMAGE_QUERIES[theme] || THEME_IMAGE_QUERIES.default;

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
  if (!queries || queries.length === 0) {
    return '';
  }

  return pickRandomUnique(queries, 1)[0] ?? '';
}

function buildImageSearchQueries(theme: string, sections: string[]): ImageSearchQueries {
  const queries = THEME_IMAGE_QUERIES[theme] || THEME_IMAGE_QUERIES.default;
  const result: ImageSearchQueries = {};

  const pickList = (list?: string[], max = 1) => {
    if (!list || list.length === 0) {
      return [];
    }

    const unique = Array.from(new Set(list));
    return shuffleList(unique).slice(0, max);
  };

  if (sections.includes('hero')) {
    result.hero = pickList(queries.hero, MAX_IMAGE_COUNTS.hero);
  }

  if (sections.includes('gallery')) {
    result.gallery = pickList(queries.gallery, MAX_IMAGE_COUNTS.gallery);
  }

  if (sections.includes('products') && queries.products) {
    result.products = pickList(queries.products, MAX_IMAGE_COUNTS.product);
  }

  if (sections.includes('editorial') && queries.editorial) {
    result.editorial = pickList(queries.editorial, MAX_IMAGE_COUNTS.editorial);
  }

  if (sections.includes('categories') && queries.categories) {
    result.categories = {
      seating: pickList(queries.categories.seating, MAX_IMAGE_COUNTS.category),
      tables: pickList(queries.categories.tables, MAX_IMAGE_COUNTS.category),
      storage: pickList(queries.categories.storage, MAX_IMAGE_COUNTS.category),
    };
  }

  if (Object.keys(result).length === 0) {
    result.hero = pickList(queries.hero, MAX_IMAGE_COUNTS.hero);
  }

  return result;
}

function buildImageSearchCounts(sections: string[]): ImageSearchCounts {
  const counts: ImageSearchCounts = {};

  if (sections.includes('hero')) {
    counts.hero = MAX_IMAGE_COUNTS.hero;
  }

  if (sections.includes('gallery')) {
    counts.gallery = MAX_IMAGE_COUNTS.gallery;
  }

  if (sections.includes('products')) {
    counts.products = MAX_IMAGE_COUNTS.product;
  }

  if (sections.includes('editorial')) {
    counts.editorial = MAX_IMAGE_COUNTS.editorial;
  }

  if (sections.includes('categories')) {
    counts.categories = {
      seating: MAX_IMAGE_COUNTS.category,
      tables: MAX_IMAGE_COUNTS.category,
      storage: MAX_IMAGE_COUNTS.category,
    };
  }

  if (Object.keys(counts).length === 0) {
    counts.hero = MAX_IMAGE_COUNTS.hero;
  }

  return counts;
}

function normalizeImageSet(images?: Partial<ImageSet>): ImageSet {
  const normalized: ImageSet = {
    hero: images?.hero ?? [],
    gallery: images?.gallery ?? [],
    products: images?.products ?? [],
    editorial: images?.editorial ?? [],
  };

  if (images?.categories) {
    normalized.categories = {
      seating: images.categories.seating ?? [],
      tables: images.categories.tables ?? [],
      storage: images.categories.storage ?? [],
    };
  }

  return normalized;
}

function proxyImageUrl(url: string): string {
  if (!url) {
    return '';
  }

  if (url.startsWith(IMAGE_PROXY_PREFIX)) {
    return url;
  }

  return `${IMAGE_PROXY_PREFIX}${encodeURIComponent(url)}`;
}

function proxyImageList(list?: string[]): string[] {
  if (!list || list.length === 0) {
    return [];
  }

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

function appendSeedToProxyUrl(url: string, seed: string): string {
  if (!url.startsWith(IMAGE_PROXY_PREFIX)) {
    return url;
  }

  const encodedTarget = url.slice(IMAGE_PROXY_PREFIX.length);
  const target = decodeURIComponent(encodedTarget);

  if (target.includes('boltSeed=')) {
    return url;
  }

  const joiner = target.includes('?') ? '&' : '?';
  const seededTarget = `${target}${joiner}boltSeed=${seed}`;

  return `${IMAGE_PROXY_PREFIX}${encodeURIComponent(seededTarget)}`;
}

function applyImageSeed(images: ImageSet, seed: string): ImageSet {
  if (!seed) {
    return images;
  }

  const applyList = (list?: string[]) => (list ?? []).map((url) => appendSeedToProxyUrl(url, seed));

  const seeded: ImageSet = {
    hero: applyList(images.hero),
    gallery: applyList(images.gallery),
    products: applyList(images.products),
    editorial: applyList(images.editorial),
  };

  if (images.categories) {
    seeded.categories = {
      seating: applyList(images.categories.seating),
      tables: applyList(images.categories.tables),
      storage: applyList(images.categories.storage),
    };
  }

  return seeded;
}

async function fetchImageSetFromApi(
  theme: string,
  queries: ImageSearchQueries,
  counts: ImageSearchCounts,
): Promise<ImageSet | null> {
  if (!queries || Object.keys(queries).length === 0) {
    return null;
  }

  if (IMAGE_CACHE_TTL_MS > 0) {
    const cacheKey = JSON.stringify({ theme, queries, counts });
    const cached = imageCache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      console.log('[fetchImageSetFromApi] Using cached images');
      return cached.data;
    }
  }

  console.log('[fetchImageSetFromApi] Fetching images from API:', { theme, queries, counts });

  try {
    const response = await fetch(IMAGE_SEARCH_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme, queries, counts }),
    });

    console.log('[fetchImageSetFromApi] Response status:', response.status);

    if (!response.ok) {
      console.error('[fetchImageSetFromApi] API returned error:', response.status, response.statusText);
      return null;
    }

    const data = (await response.json()) as Partial<ImageSet>;
    console.log('[fetchImageSetFromApi] Got images:', data);

    const normalized = normalizeImageSet(data);
    const proxied = proxyImageSet(normalized);

    if (IMAGE_CACHE_TTL_MS > 0) {
      const cacheKey = JSON.stringify({ theme, queries, counts });
      imageCache.set(cacheKey, { expiresAt: Date.now() + IMAGE_CACHE_TTL_MS, data: proxied });
    }

    return proxied;
  } catch (error) {
    console.error('[fetchImageSetFromApi] Error fetching images:', error);
    return null;
  }
}

export {
  limitList,
  mergeImageSets,
  recordRecentImages,
  filterRecentImages,
  buildImageSet,
  buildImageSearchQueries,
  buildImageSearchCounts,
  normalizeImageSet,
  proxyImageUrl,
  proxyImageSet,
  applyImageSeed,
  fetchImageSetFromApi,
};
