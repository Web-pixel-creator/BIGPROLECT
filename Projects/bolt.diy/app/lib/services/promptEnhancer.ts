/**
 *
 * Prompt Enhancer Service
 *
 * Analyzes user prompt and automatically adds design system (colors, images, structure)
 *
 * before sending to LLM
 *
 */

import type { SectionContract } from '~/types/section-contract';
import {
  randomSeedString,
  pickRandom as pickRandomFromData,
  getMergedKeywords,
  getMergedColors,
  THEME_PALETTES,
  THEME_IMAGE_QUERIES,
  MAX_IMAGE_COUNTS,
  SECTION_IMAGE_MIN_COUNTS,
  SECTION_KEYWORDS,
  COMPONENT_SECTION_KEYWORDS,
  HERO_FULL_WIDTH_VARIANTS,
  HERO_SPLIT_VARIANTS,
  HERO_GRID_VARIANTS,
  HERO_TYPO_VARIANTS,
  HERO_DEFAULT_VARIANTS,
  CATEGORY_VARIANTS,
  PRODUCT_VARIANTS,
  FOOTER_VARIANTS,
  NAV_VARIANTS,
  FEATURE_VARIANTS,
  THEME_ART_DIRECTIONS,
  THEME_SIGNATURE_MOVES,
  GLOBAL_SIGNATURE_MOVES,
  THEME_EFFECT_IDS,
  THEME_LAYOUT_ARCHETYPES,
  FALLBACK_BRANDS,
  STYLE_CUE_TOKENS,
  IMAGE_KEYWORDS,
  LAYOUT_KEYWORDS,
  NAVIGATION_SIGNALS,
  SECTION_LAYOUTS,
  SECTION_LABELS,
  STYLE_PACKS,
  DEFAULT_STYLE_PACK_ID,
  getStylePackById,
  buildDesignQualityScore,
  COMPONENT_MEMORY_ENTRIES,
  createSeededRandom,
  type StylePack,
  type DesignCues,
  type DesignCueCoverage,
  type ComponentMemoryEntry,
  type ImageSet,
} from './prompt-data';
import { pickRandomUnique } from './prompt-random-utils';
import {
  hasUserSpecifiedColors,
  extractUserColors,
  matchesKeyword,
  extractColorsFromWords,
  hasColorWords,
  buildColorDirectiveBlock,
} from './prompt-color-utils';
import { detectTheme, extractBrandName, generateBrandName, hashString } from './prompt-theme-utils';
import {
  extractRequirementLines,
  extractSectionOrder,
  extractSectionSpecs,
  buildSectionDetailsBlock,
  buildSectionGuardrails,
  buildSectionBlueprint,
} from './prompt-section-utils';
import { buildSectionVariantBlock, pickEffectIds } from './prompt-variant-utils';
import {
  buildComponentDirectives,
  buildComponentSelectionPlan,
  SAFE_COMPONENT_REGISTRY,
} from './prompt-component-utils';
import type { ComponentSelectionPlan } from './prompt-component-utils';
import { buildRenderPlan, type RenderPlan } from './render-plan';
import { emitDesignQualityEvent } from './pipelineTelemetry';

import {
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
} from './prompt-image-utils';
import { promptLog, promptWarn } from './prompt-logger';

// Merged keywords (EN + RU)
const THEME_KEYWORDS = getMergedKeywords();

// Merged colors (EN + RU)
const COLOR_WORDS_TO_HEX = getMergedColors();

// buildIndex removed - server-only

/**
 *
 * Check if user already specified colors in prompt
 *
 */

/**
 *
 * Extract user-specified colors from prompt
 *
 */

/**
 *
 * Extract colors from color words in prompt (e.g., "cream", "black", "gold")
 *
 */

/**
 *
 * Check if prompt mentions color words
 *
 */

type SectionSpecs = {
  order: string[];
  details: Record<string, string[]>;
};

// NEW: Find ALL sections matching in a text, not just the first one

function wantsImages(prompt: string, mentionedSections: string[]): boolean {
  const lowerPrompt = prompt.toLowerCase();

  if (
    mentionedSections.some((section) => ['hero', 'gallery', 'products', 'categories', 'editorial'].includes(section))
  ) {
    return true;
  }

  return IMAGE_KEYWORDS.some((keyword) => matchesKeyword(lowerPrompt, keyword));
}

function buildImageSuggestions(mentionedSections: string[], images: ImageSet): string {
  promptLog('[buildImageSuggestions] Called with:', {
    mentionedSections,
    hasHero: !!images.hero?.length,
    hasProducts: !!images.products?.length,
    hasCategories: !!images.categories,
    heroUrls: images.hero?.slice(0, 2),
  });

  const lines: string[] = [];

  const include = (section: string) => mentionedSections.includes(section);

  const pushLine = (label: string, urls?: string[]) => {
    if (!urls || urls.length === 0) {
      return;
    }

    const proxied = urls.filter(Boolean).map((url) => proxyImageUrl(url));

    if (proxied.length === 0) {
      return;
    }

    promptLog(`[buildImageSuggestions] Adding ${label}:`, proxied.length, 'images');
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
    pushLine('HERO', limitList(images.hero, MAX_IMAGE_COUNTS.hero));
    pushLine('GALLERY', limitList(images.gallery, MAX_IMAGE_COUNTS.gallery));
    pushLine('PRODUCTS', limitList(images.products ?? [], MAX_IMAGE_COUNTS.product));

    if (images.categories) {
      pushLine('CATEGORIES (Seating)', limitList(images.categories.seating, MAX_IMAGE_COUNTS.category));
      pushLine('CATEGORIES (Tables)', limitList(images.categories.tables, MAX_IMAGE_COUNTS.category));
      pushLine('CATEGORIES (Storage)', limitList(images.categories.storage, MAX_IMAGE_COUNTS.category));
    }

    pushLine('EDITORIAL', limitList(images.editorial ?? [], MAX_IMAGE_COUNTS.editorial));
  }

  const countHints: string[] = [];

  if (include('hero')) {
    countHints.push(`HERO>=${SECTION_IMAGE_MIN_COUNTS.hero ?? 1}`);
  }

  if (include('gallery')) {
    countHints.push(`GALLERY>=${SECTION_IMAGE_MIN_COUNTS.gallery ?? 1}`);
  }

  if (include('products')) {
    countHints.push(`PRODUCTS>=${SECTION_IMAGE_MIN_COUNTS.products ?? 1}`);
  }

  if (include('editorial')) {
    countHints.push(`EDITORIAL>=${SECTION_IMAGE_MIN_COUNTS.editorial ?? 1}`);
  }

  if (lines.length === 0) {
    return '';
  }

  return [
    'IMAGES:',
    '(Use these exact proxied URLs. Do NOT invent URLs.)',
    ...lines,
    ...(countHints.length > 0 ? [`IMAGE COUNTS (minimum): ${countHints.join(', ')}`] : []),
    'IMAGES REQUIRED: If a section mentions images, it MUST include at least one <img> using the URLs above.',
    'Do NOT replace image sections with gradients/placeholders when IMAGES block exists.',
    'Do NOT use data:image placeholders or icon-only cards for image slots.',
    'Add loading="lazy" to all <img> tags.',
  ].join('\n');
}

function pickArtDirection(theme: string, rng?: () => number): string {
  const directions = THEME_ART_DIRECTIONS[theme] ?? THEME_ART_DIRECTIONS.default;
  return pickRandomUnique(directions, 1, rng)[0] ?? '';
}

function buildArtDirectionLine(direction: string): string {
  return direction ? `\nART DIRECTION: ${direction}` : '';
}

function pickLayoutArchetype(theme: string, rng?: () => number): string {
  const archetypes = THEME_LAYOUT_ARCHETYPES[theme] ?? THEME_LAYOUT_ARCHETYPES.default;
  return pickRandomUnique(archetypes, 1, rng)[0] ?? '';
}

function buildLayoutArchetypeLine(archetype: string): string {
  return archetype ? `\nLAYOUT ARCHETYPE: ${archetype}` : '';
}

function pickSignatureMoves(theme: string, rng?: () => number): string[] {
  const themeMoves = THEME_SIGNATURE_MOVES[theme] ?? THEME_SIGNATURE_MOVES.default;
  return pickRandomUnique([...themeMoves, ...GLOBAL_SIGNATURE_MOVES], 3, rng);
}

function buildSignatureMovesBlock(moves: string[]): string {
  return moves.length > 0 ? `\nSIGNATURE MOVES (must apply):\n- ${moves.join('\n- ')}` : '';
}

function buildDesignCues(stylePack: StylePack, sectionOrder: string[]): DesignCues {
  const primarySection = sectionOrder[0] ?? 'hero';
  const primaryLabel = SECTION_LABELS[primarySection] ?? primarySection;
  const secondarySection = sectionOrder[1] ?? '';
  const secondaryLabel = secondarySection ? SECTION_LABELS[secondarySection] ?? secondarySection : '';
  const hierarchyNote = secondaryLabel
    ? `Primary focus on ${primaryLabel}; secondary emphasis on ${secondaryLabel}.`
    : `Primary focus on ${primaryLabel}.`;

  return {
    typography: `${stylePack.fontPairing}. ${stylePack.typeScale}.`,
    layout: `${stylePack.gridStyle}. ${stylePack.spacingScale}.`,
    visualHierarchy: `${hierarchyNote} CTA must be prominent. Shape language: ${stylePack.shapeLanguage}.`,
    motion: stylePack.motionNotes.join('; '),
  };
}

function buildDesignDnaBlock(stylePack: StylePack, designCues: DesignCues): string {
  return [
    '\nDESIGN DNA (must follow):',
    `STYLE PACK: ${stylePack.label} (${stylePack.id})`,
    `TYPOGRAPHY: ${designCues.typography}`,
    `LAYOUT: ${designCues.layout}`,
    `VISUAL HIERARCHY: ${designCues.visualHierarchy}`,
    `EFFECTS: ${stylePack.effects.join(', ')}`,
    `MOTION: ${designCues.motion}`,
  ].join('\n');
}

function pickComponentMemoryEntries(theme: string, sections: string[], rng?: () => number): ComponentMemoryEntry[] {
  const matches = COMPONENT_MEMORY_ENTRIES.filter((entry) => {
    const themeMatch = entry.themes.includes(theme) || entry.themes.includes('default');
    return themeMatch && sections.includes(entry.section);
  });

  if (matches.length === 0) {
    return [];
  }

  return pickRandomUnique(matches, Math.min(3, matches.length), rng);
}

function buildComponentMemoryBlock(entries: ComponentMemoryEntry[]): string {
  if (entries.length === 0) {
    return '';
  }

  const lines = entries.map((entry) => {
    const label = SECTION_LABELS[entry.section] ?? entry.section;
    return `- ${label}: ${entry.snippet}`;
  });

  return `\nCOMPONENT MEMORY (use as inspiration, adapt to the chosen style pack):\n${lines.join('\n')}`;
}

function buildLayoutUniquenessHash(payload: {
  stylePackId: string;
  layoutArchetype: string;
  sectionOrder: string[];
  sectionVariants: string;
  effectIds: string[];
  signatureMoves: string[];
}): string {
  const raw = JSON.stringify(payload);
  return hashString(raw).toString(36);
}

export interface EnhancedPrompt {
  originalPrompt: string;

  enhancedPrompt: string;

  displayPrompt?: string;

  imagePrompt?: string;

  detectedTheme: string;

  colors: typeof THEME_PALETTES.default;

  images: ImageSet;

  variantIndex?: number;

  variantSeed?: string;

  stylePackId: string;

  stylePack: StylePack;

  designCues: DesignCues;

  designCueCoverage: DesignCueCoverage;

  designQualityScore: number;

  designQualityReasons: string[];

  layoutArchetype: string;

  layoutUniquenessHash: string;

  signatureMoves: string[];

  effectIds: string[];

  componentMemory: ComponentMemoryEntry[];

  componentPlan?: ComponentSelectionPlan;

  renderPlan?: RenderPlan;

  sectionContract?: SectionContract;
}

export type EnhancePromptOptions = {
  variationSeed?: string;
  variantIndex?: number;
  variantSalt?: string;
};

export type DesignVariantRanking = {
  variantIndex: number;
  score: number;
  reasons: string[];
  designQualityScore: number;
  stylePackId: string;
  layoutUniquenessHash: string;
};

export type DesignVariantResult = {
  selected: EnhancedPrompt;
  variants: EnhancedPrompt[];
  ranking: DesignVariantRanking[];
};

export type DesignVariantOptions = {
  variantCount?: number;
  variantSalt?: string;
};

const LAYOUT_MARKER = 'CREATIVE DIRECTION (Unique Layout Strategy):';

const DEFAULT_VARIANT_COUNT = 3;
const MAX_VARIANT_COUNT = 5;

function resolveVariationSeed(prompt: string, options?: EnhancePromptOptions): string {
  if (options?.variationSeed) {
    return options.variationSeed;
  }

  const variantIndex = options?.variantIndex;
  const variantSalt = options?.variantSalt ?? '';

  if (variantIndex !== undefined || variantSalt) {
    const seedKey = `${prompt}|${variantIndex ?? 0}|${variantSalt}`;
    const rng = createSeededRandom(hashString(seedKey));
    return randomSeedString(6, rng);
  }

  return randomSeedString(6);
}

function hasFullCueCoverage(coverage?: DesignCueCoverage): boolean {
  return !!coverage && Object.values(coverage).every(Boolean);
}

function rankDesignVariants(variants: EnhancedPrompt[]): DesignVariantRanking[] {
  const hashCounts = variants.reduce<Record<string, number>>((acc, variant) => {
    const key = variant.layoutUniquenessHash || 'unknown';
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const rankings = variants.map((variant, index) => {
    const variantIndex = variant.variantIndex ?? index;
    const reasons: string[] = [];
    let score = variant.designQualityScore ?? 0;
    reasons.push(`design quality ${variant.designQualityScore ?? 0}`);

    if (hasFullCueCoverage(variant.designCueCoverage)) {
      score += 4;
      reasons.push('full design cue coverage');
    }

    if (variant.signatureMoves?.length) {
      score += Math.min(3, variant.signatureMoves.length);
      reasons.push('signature moves');
    }

    if (variant.effectIds?.length) {
      score += Math.min(2, variant.effectIds.length);
      reasons.push('effects');
    }

    if (variant.componentMemory?.length) {
      score += 1;
      reasons.push('component memory');
    }

    if (hashCounts[variant.layoutUniquenessHash] > 1) {
      score -= 5;
      reasons.push('duplicate layout hash');
    }

    return {
      variantIndex,
      score,
      reasons,
      designQualityScore: variant.designQualityScore ?? 0,
      stylePackId: variant.stylePackId,
      layoutUniquenessHash: variant.layoutUniquenessHash,
    };
  });

  return rankings.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    if (b.designQualityScore !== a.designQualityScore) {
      return b.designQualityScore - a.designQualityScore;
    }

    return a.variantIndex - b.variantIndex;
  });
}

function buildStyleCueRegex(): RegExp {
  const escaped = STYLE_CUE_TOKENS.map((token) => token.trim())
    .filter(Boolean)
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = `(${escaped.join('|')})`;

  try {
    return new RegExp(pattern, 'i');
  } catch (error) {
    promptWarn('[promptEnhancer] Failed to build style cue regex', error);
    return /style:/i;
  }
}

function splitPromptForEnhancer(prompt: string) {
  let basePrompt = prompt;
  let layoutBlock = '';

  const markerIndex = prompt.indexOf(LAYOUT_MARKER);

  if (markerIndex >= 0) {
    basePrompt = prompt.slice(0, markerIndex);
    layoutBlock = prompt.slice(markerIndex);
  }

  basePrompt = basePrompt
    .replace(/\n?Sections:\s*[^\n]+/gi, '')
    .replace(/\n?\[Style:[^\]]+\]\s*/gi, '')
    .trim();

  const styleCueRe = buildStyleCueRegex();
  const hasStyleCue = styleCueRe.test(basePrompt);

  if (hasStyleCue && layoutBlock) {
    layoutBlock = layoutBlock.replace(/1\. AESTHETIC STYLE:[\s\S]*?2\. STRUCTURE:/, '2. STRUCTURE:');
  }

  return {
    basePrompt: basePrompt || prompt.trim(),
    layoutBlock: layoutBlock.trim(),
  };
}

/**
 *
 * Main function to enhance user prompt with design system
 *
 */

export async function enhancePromptWithDesignSystem(
  userPrompt: string,
  options?: EnhancePromptOptions,
): Promise<EnhancedPrompt> {
  const { basePrompt, layoutBlock } = splitPromptForEnhancer(userPrompt);
  const analysisPrompt = basePrompt;
  const promptWithLayout = layoutBlock ? `${analysisPrompt}\n\n${layoutBlock}` : analysisPrompt;

  const detectedTheme = detectTheme(analysisPrompt);
  const variationSeed = resolveVariationSeed(analysisPrompt, options);
  const designSeed = hashString(`${analysisPrompt}:${variationSeed}`);
  const designRng = createSeededRandom(designSeed);
  const stylePackId =
    pickRandomUnique(
      STYLE_PACKS.map((pack) => pack.id),
      1,
      designRng,
    )[0] ?? DEFAULT_STYLE_PACK_ID;
  const stylePack = getStylePackById(stylePackId) ?? STYLE_PACKS[0];

  const palette = THEME_PALETTES[detectedTheme as keyof typeof THEME_PALETTES] || THEME_PALETTES.default;

  const fallbackImages = buildImageSet(detectedTheme);
  let images = fallbackImages;

  // Try to fetch real images from Unsplash/Pexels API
  const themeQueries = THEME_IMAGE_QUERIES[detectedTheme] || THEME_IMAGE_QUERIES.default;

  if (themeQueries) {
    try {
      const apiImages = await fetchImageSetFromApi(
        detectedTheme,
        {
          hero: themeQueries.hero,
          gallery: themeQueries.gallery,
          products: themeQueries.products,
          editorial: themeQueries.editorial,
          categories: themeQueries.categories,
        },
        {
          hero: 2,
          gallery: 4,
          products: 6,
          editorial: 2,
          categories: { seating: 2, tables: 2, storage: 2 },
        },
      );

      if (apiImages) {
        promptLog('[promptEnhancer] Got images from API:', {
          heroCount: apiImages.hero?.length,
          galleryCount: apiImages.gallery?.length,
          productsCount: apiImages.products?.length,
        });
        images = mergeImageSets(apiImages, fallbackImages);
      }
    } catch (error) {
      promptWarn('[promptEnhancer] Failed to fetch images from API, using fallback:', error);
    }
  }

  promptLog('[promptEnhancer] Final images result:', {
    theme: detectedTheme,
    heroCount: images.hero?.length,
    galleryCount: images.gallery?.length,
    productsCount: images.products?.length,
  });

  const brandName = extractBrandName(analysisPrompt) ?? generateBrandName(detectedTheme, analysisPrompt);
  const lowerPrompt = analysisPrompt.toLowerCase();
  const hasUserColors = hasUserSpecifiedColors(analysisPrompt);

  // Check if user already specified colors (priority: HEX codes > color words > theme defaults)

  let finalColors = { ...palette };

  // First, try to extract HEX codes from prompt

  if (hasUserColors) {
    const userColors = extractUserColors(analysisPrompt);

    if (userColors) {
      finalColors = {
        ...finalColors,

        ...userColors,
      };
    }
  }

  // Then, extract colors from color words (e.g., "cream", "black", "gold")

  if (hasColorWords(analysisPrompt)) {
    const wordColors = extractColorsFromWords(analysisPrompt);

    // Only override dark/light if not already set by HEX codes

    if (wordColors.dark && !hasUserColors) {
      finalColors.dark = wordColors.dark;
    }

    if (wordColors.light && !hasUserColors) {
      finalColors.light = wordColors.light;
    }

    // For accent, only override if user explicitly mentioned an accent color word

    // (gold, amber, blue, etc.) - don't override theme accent with random color matches

    const accentKeywords = Object.keys(COLOR_WORDS_TO_HEX).filter((word) => COLOR_WORDS_TO_HEX[word].type === 'accent');

    const accentMetaKeywords = [
      'accent',
      'primary',
      'highlight',
      'primary color',
      'main color',
      'accent color',
      '\u0430\u043a\u0446\u0435\u043d\u0442',
      '\u0430\u043a\u0446\u0435\u043d\u0442\u043d\u044b\u0439 \u0446\u0432\u0435\u0442',
      '\u043e\u0441\u043d\u043e\u0432\u043d\u043e\u0439 \u0446\u0432\u0435\u0442',
      '\u0433\u043b\u0430\u0432\u043d\u044b\u0439 \u0446\u0432\u0435\u0442',
    ];

    const hasExplicitAccent = [...accentKeywords, ...accentMetaKeywords].some((keyword) =>
      matchesKeyword(lowerPrompt, keyword),
    );

    if (wordColors.accent && hasExplicitAccent && !hasUserColors) {
      finalColors.accent = wordColors.accent;
    }
  }

  // Check if user specified specific layouts

  const hasSpecificLayout = LAYOUT_KEYWORDS.some((keyword) => matchesKeyword(lowerPrompt, keyword));

  // Helper to pick random item

  const pickRandom = <T>(arr: T[]): T => pickRandomFromData(arr, designRng);

  // Detect which sections user mentioned in prompt

  const sectionKeywords = SECTION_KEYWORDS;

  // Find which sections are mentioned
  const sectionSpecs = extractSectionSpecs(analysisPrompt, sectionKeywords);
  promptLog('[promptEnhancer] sectionSpecs result:', JSON.stringify(sectionSpecs, null, 2));

  const orderedSections =
    sectionSpecs.order.length > 0 ? sectionSpecs.order : extractSectionOrder(analysisPrompt, sectionKeywords);
  promptLog('[promptEnhancer] orderedSections:', orderedSections);

  const mentionedSections: string[] = orderedSections.length > 0 ? [...orderedSections] : [];

  if (mentionedSections.length === 0) {
    // Fallback scan when section extraction found nothing.
    for (const [section, keywords] of Object.entries(sectionKeywords)) {
      if (!mentionedSections.includes(section)) {
        if (keywords.some((kw) => matchesKeyword(lowerPrompt, kw))) {
          promptLog('[promptEnhancer] Fallback found section:', section);
          mentionedSections.push(section);
        }
      }
    }
  }

  const wantsNavigation = NAVIGATION_SIGNALS.some((signal) => matchesKeyword(lowerPrompt, signal));

  if (wantsNavigation && !mentionedSections.includes('navigation')) {
    mentionedSections.unshift('navigation');
  }

  promptLog('[promptEnhancer] Detected theme:', detectedTheme);
  promptLog('[promptEnhancer] Mentioned sections:', mentionedSections);
  const wantsImagesResult = wantsImages(analysisPrompt, mentionedSections);
  promptLog('[promptEnhancer] Wants images:', wantsImagesResult);

  if (wantsImagesResult) {
    const queries = buildImageSearchQueries(detectedTheme, mentionedSections);
    const counts = buildImageSearchCounts(mentionedSections);
    promptLog('[promptEnhancer] Image queries:', JSON.stringify(queries));
    promptLog('[promptEnhancer] Image counts:', JSON.stringify(counts));

    const apiImages = await fetchImageSetFromApi(detectedTheme, queries, counts);
    promptLog('[promptEnhancer] API returned images:', apiImages ? 'yes' : 'no');

    if (apiImages) {
      images = mergeImageSets(apiImages, fallbackImages);
      promptLog('[promptEnhancer] Using API images, hero count:', images.hero?.length);
    }
  }

  images = normalizeImageSet(images);
  images = filterRecentImages(images);
  recordRecentImages(images);
  images = proxyImageSet(images);
  images = applyImageSeed(images, variationSeed);

  // Section layout variants

  // Generate layouts only for mentioned sections

  let layoutSuggestions = '';

  if (!hasSpecificLayout && mentionedSections.length > 0) {
    const layouts = mentionedSections

      .filter((section) => SECTION_LAYOUTS[section])

      .map(
        (section) =>
          `- ${section.charAt(0).toUpperCase() + section.slice(1)}: ${pickRandom(SECTION_LAYOUTS[section])}`,
      )

      .join('\n');

    if (layouts) {
      layoutSuggestions = `\nSECTION LAYOUTS (use these styles):\n${layouts}`;
    }
  }

  const sectionChecklist =
    mentionedSections.length > 0
      ? `\nSECTIONS (must include all): ${mentionedSections
          .map((section) => SECTION_LABELS[section] ?? section)
          .join(', ')}`
      : '';

  const sectionContract =
    mentionedSections.length > 0
      ? `\nSECTION CONTRACT:\n- Render exactly ${mentionedSections.length} sections.\n- Add a comment {/** SECTION: <label> */} before each section.\n- If output length is a concern, shorten sections but DO NOT omit any.`
      : '';

  const sectionOrderLine =
    mentionedSections.length > 0
      ? `\nSECTION ORDER (render in this order): ${mentionedSections
          .map((section) => SECTION_LABELS[section] ?? section)
          .join(' -> ')}`
      : '';

  const sectionCountLine = mentionedSections.length > 0 ? `\nSECTION COUNT: ${mentionedSections.length}` : '';

  const sectionDetailsBlock = buildSectionDetailsBlock(sectionSpecs.details, SECTION_LABELS);
  const sectionGuardrails = buildSectionGuardrails(mentionedSections, sectionSpecs.details);
  const artDirection = pickArtDirection(detectedTheme, designRng);
  const layoutArchetype = pickLayoutArchetype(detectedTheme, designRng);
  const signatureMoves = pickSignatureMoves(detectedTheme, designRng);
  const effectIds = pickEffectIds(detectedTheme, 2, designRng);
  const artDirectionLine = buildArtDirectionLine(artDirection);
  const layoutArchetypeLine = buildLayoutArchetypeLine(layoutArchetype);
  const signatureMovesBlock = buildSignatureMovesBlock(signatureMoves);
  const sectionBlueprint = buildSectionBlueprint(mentionedSections, sectionSpecs.details, SECTION_LABELS);
  const effectDirectiveBlock =
    effectIds.length > 0 ? `\nEFFECTS (apply in UI): ${effectIds.join(', ')}` : '';

  const requirements = extractRequirementLines(analysisPrompt).slice(0, 20);
  const requirementsBlock =
    requirements.length > 0 ? `\nREQUIREMENTS (must implement):\n- ${requirements.join('\n- ')}` : '';

  promptLog('[promptEnhancer] Before buildImageSuggestions:', {
    mentionedSections,
    wantsImagesResult,
    imagesHero: images.hero?.slice(0, 1),
    imagesProducts: images.products?.slice(0, 1),
    imagesGallery: images.gallery?.slice(0, 1),
  });

  const imageSuggestions = wantsImagesResult
    ? buildImageSuggestions(mentionedSections, images)
    : '';
  promptLog('[promptEnhancer] imageSuggestions result:', imageSuggestions?.substring(0, 200));

  const imagePrompt = imageSuggestions ? `\n${imageSuggestions}` : '';
  const colorDirectiveBlock = buildColorDirectiveBlock(finalColors);

  const sectionVariantBlock = buildSectionVariantBlock(mentionedSections, lowerPrompt, SECTION_LABELS, designRng);
  const designCues = buildDesignCues(stylePack, mentionedSections);
  const designDnaBlock = buildDesignDnaBlock(stylePack, designCues);
  const componentMemoryEntries = pickComponentMemoryEntries(detectedTheme, mentionedSections, designRng);
  const componentMemoryBlock = buildComponentMemoryBlock(componentMemoryEntries);
  const selectionStyleTags = stylePack
    ? [stylePack.id, stylePack.label, ...(stylePack.effects ?? [])]
    : [];
  const componentPlan = buildComponentSelectionPlan(
    analysisPrompt,
    mentionedSections,
    selectionStyleTags,
    designSeed,
  );
  const componentPlanBlock = componentPlan.planText;
  const renderPlan = buildRenderPlan({
    prompt: analysisPrompt,
    sections: mentionedSections,
    seed: designSeed,
    styleTags: selectionStyleTags,
    styleTokens: {
      typography: stylePack.fontPairing,
      spacing: stylePack.spacingScale,
      radius: stylePack.shapeLanguage,
      colors: [finalColors.dark, finalColors.light, finalColors.accent],
    },
    layoutArchetype,
    componentPlan,
  });
  const layoutUniquenessHash = buildLayoutUniquenessHash({
    stylePackId,
    layoutArchetype,
    sectionOrder: mentionedSections,
    sectionVariants: sectionVariantBlock,
    effectIds,
    signatureMoves,
  });
  const designQualityResult = buildDesignQualityScore({
    designCues,
    stylePackId,
    layoutArchetype,
    layoutUniquenessHash,
    signatureMoves,
    effectIds,
    sectionOrder: mentionedSections,
  });
  const layoutUniquenessLine = `\nLAYOUT UNIQUENESS HASH: ${layoutUniquenessHash}`;
  const designQualityLine = `\nDESIGN QUALITY SCORE (informational): ${designQualityResult.score}/100`;
  const componentDirectivesBlock = buildComponentDirectives(mentionedSections, detectedTheme, SECTION_LABELS);
  const brandLine = `\nBRAND NAME (use exactly): ${brandName}`;
  const templateGuard =
    '\nIMPORTANT: Do not use any generic/default template. Do not use BoltApp/ModernApp/ProjectName. Invent a brand name if none was given. Follow the prompt exactly.';
  const variationLine = `\nVARIATION SEED: ${variationSeed} (must vary layout, imagery, and composition from prior runs).`;

  const enhancedPrompt = `${promptWithLayout}
${brandLine}${colorDirectiveBlock}${imagePrompt}${sectionBlueprint}${sectionChecklist}${sectionContract}${sectionOrderLine}${sectionCountLine}${sectionDetailsBlock}${sectionGuardrails}${artDirectionLine}${layoutArchetypeLine}${signatureMovesBlock}${designDnaBlock}${sectionVariantBlock}${requirementsBlock}${
    layoutSuggestions
      ? `
${layoutSuggestions}`
      : ''
  }${effectDirectiveBlock}${componentMemoryBlock}${componentPlanBlock}${componentDirectivesBlock}${layoutUniquenessLine}${designQualityLine}${templateGuard}${variationLine}
[Style: ${detectedTheme} | Colors: ${finalColors.dark}, ${finalColors.light}, ${finalColors.accent}]`;

  promptLog('[promptEnhancer] BEFORE shortSectionsLine, mentionedSections:', JSON.stringify(mentionedSections));
  promptLog('[promptEnhancer] sectionSpecs.order was:', JSON.stringify(sectionSpecs.order));
  promptLog('[promptEnhancer] orderedSections was:', JSON.stringify(orderedSections));

  const shortSectionsLine =
    mentionedSections.length > 0
      ? `\nSections: ${mentionedSections.map((section) => SECTION_LABELS[section] ?? section).join(', ')}`
      : '';
  promptLog('[promptEnhancer] shortSectionsLine result:', shortSectionsLine);

  const displayPrompt = analysisPrompt;

  promptLog('[promptEnhancer] FINAL RESULT:', {
    hasImagePrompt: !!imagePrompt,
    imagePromptLength: imagePrompt?.length,
    imagePromptPreview: imagePrompt?.substring(0, 200),
    mentionedSections,
  });

  const imageSectionKeys = wantsImagesResult
    ? mentionedSections.filter((section) => ['hero', 'gallery', 'products', 'editorial'].includes(section))
    : [];

  const imageMap: Record<string, string[]> = {};

  if (images.hero?.length && imageSectionKeys.includes('hero')) {
    imageMap.hero = limitList(images.hero, MAX_IMAGE_COUNTS.hero);
  }

  if (images.gallery?.length && imageSectionKeys.includes('gallery')) {
    imageMap.gallery = limitList(images.gallery, MAX_IMAGE_COUNTS.gallery);
  }

  if (images.products?.length && imageSectionKeys.includes('products')) {
    imageMap.products = limitList(images.products, MAX_IMAGE_COUNTS.product);
  }

  if (images.editorial?.length && imageSectionKeys.includes('editorial')) {
    imageMap.editorial = limitList(images.editorial, MAX_IMAGE_COUNTS.editorial);
  }

  const imageMinCounts: Record<string, number> = {};

  for (const section of imageSectionKeys) {
    const desired = SECTION_IMAGE_MIN_COUNTS[section] ?? 1;
    const available = imageMap[section]?.length ?? 0;

    if (available > 0) {
      imageMinCounts[section] = Math.min(desired, available);
    }
  }

  const sectionContractData: SectionContract | undefined =
    mentionedSections.length > 0
      ? {
          order: mentionedSections,
          labels: SECTION_LABELS,
          imageSections: imageSectionKeys,
          imageMap,
          imageMinCounts,
        }
      : undefined;

  return {
    originalPrompt: analysisPrompt,

    enhancedPrompt,

    displayPrompt,

    imagePrompt,
    detectedTheme,

    colors: finalColors,

    images,

    variantIndex: options?.variantIndex,

    variantSeed: variationSeed,

    stylePackId,

    stylePack,

    designCues,

    designCueCoverage: designQualityResult.coverage,

    designQualityScore: designQualityResult.score,

    designQualityReasons: designQualityResult.reasons,

    layoutArchetype,

    layoutUniquenessHash,

    signatureMoves,

    effectIds,

    componentMemory: componentMemoryEntries,
    componentPlan,
    renderPlan,

    sectionContract: sectionContractData,
  };
}

export async function generateAndRankDesignVariants(
  userPrompt: string,
  options?: DesignVariantOptions,
): Promise<DesignVariantResult> {
  const requestedCount = options?.variantCount ?? DEFAULT_VARIANT_COUNT;
  const variantCount = Math.min(Math.max(1, requestedCount), MAX_VARIANT_COUNT);
  const variantSalt = options?.variantSalt ?? randomSeedString(4);
  const variants: EnhancedPrompt[] = [];

  for (let i = 0; i < variantCount; i += 1) {
    const variant = await enhancePromptWithDesignSystem(userPrompt, {
      variantIndex: i,
      variantSalt,
    });
    variants.push(variant);
  }

  const ranking = rankDesignVariants(variants);
  const rankingByIndex = new Map(ranking.map((entry) => [entry.variantIndex, entry]));
  const layoutHashCounts = variants.reduce<Record<string, number>>((acc, variant) => {
    const key = variant.layoutUniquenessHash || 'unknown';
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const topVariantIndex = ranking[0]?.variantIndex ?? variants[0]?.variantIndex ?? 0;
  const selected =
    variants.find((variant) => (variant.variantIndex ?? 0) === topVariantIndex) ?? variants[0];

  try {
    for (const [index, variant] of variants.entries()) {
      const variantIndex = variant.variantIndex ?? index;
      const rankingEntry = rankingByIndex.get(variantIndex);
      const duplicateLayout = layoutHashCounts[variant.layoutUniquenessHash] > 1;
      const sectionCount = variant.sectionContract?.order?.length ?? 0;

      emitDesignQualityEvent({
        variantIndex,
        variantCount: variants.length,
        selected: variantIndex === topVariantIndex,
        designQualityScore: variant.designQualityScore ?? 0,
        rankingScore: rankingEntry?.score ?? variant.designQualityScore ?? 0,
        designCueCoverage: variant.designCueCoverage,
        stylePackId: variant.stylePackId,
        layoutArchetype: variant.layoutArchetype,
        duplicateLayout,
        signatureMoveCount: variant.signatureMoves?.length ?? 0,
        effectCount: variant.effectIds?.length ?? 0,
        componentMemoryCount: variant.componentMemory?.length ?? 0,
        sectionCount,
        componentMatchRate: variant.componentPlan?.matchRate ?? 0,
        componentFallbackRate: variant.componentPlan?.fallbackRate ?? 0,
      });
    }
  } catch (error) {
    promptWarn('[promptEnhancer] Failed to emit design telemetry', error);
  }

  return {
    selected,
    variants,
    ranking,
  };
}

/**
 *
 * Check if prompt is a design/website request that needs enhancement
 *
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
    '\u0441\u0430\u0439\u0442',
    '\u043b\u0435\u043d\u0434\u0438\u043d\u0433',
    '\u0433\u043b\u0430\u0432\u043d\u0430\u044f',
    '\u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430',
    '\u0434\u0438\u0437\u0430\u0439\u043d',
    '\u0438\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441',
    '\u0448\u0430\u043f\u043a\u0430',
    '\u0441\u0435\u043a\u0446\u0438\u044f',
    '\u044d\u043a\u0440\u0430\u043d',
    '\u043c\u0430\u043a\u0435\u0442',
    '\u043f\u0440\u043e\u0442\u043e\u0442\u0438\u043f',
    '\u0441\u043e\u0437\u0434\u0430\u0439',
    '\u0441\u0434\u0435\u043b\u0430\u0439',
    '\u0441\u0432\u0435\u0440\u0441\u0442\u0430\u0439',
  ];

  const lowerPrompt = prompt.toLowerCase();

  if (designKeywords.some((keyword) => matchesKeyword(lowerPrompt, keyword))) {
    return true;
  }

  return extractRequirementLines(prompt).length > 0;
}
