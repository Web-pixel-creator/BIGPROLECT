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
import { detectTheme, extractBrandName, generateBrandName } from './prompt-theme-utils';
import {
  extractRequirementLines,
  extractSectionOrder,
  extractSectionSpecs,
  buildSectionDetailsBlock,
  buildSectionGuardrails,
  buildSectionBlueprint,
} from './prompt-section-utils';
import { buildEffectDirectiveBlock, buildSectionVariantBlock } from './prompt-variant-utils';
import { buildComponentDirectives, SAFE_COMPONENT_REGISTRY } from './prompt-component-utils';

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

function buildArtDirectionLine(theme: string): string {
  const directions = THEME_ART_DIRECTIONS[theme] ?? THEME_ART_DIRECTIONS.default;
  const pick = pickRandomUnique(directions, 1)[0];

  return pick ? `\nART DIRECTION: ${pick}` : '';
}

function buildLayoutArchetypeLine(theme: string): string {
  const archetypes = THEME_LAYOUT_ARCHETYPES[theme] ?? THEME_LAYOUT_ARCHETYPES.default;
  const pick = pickRandomUnique(archetypes, 1)[0];

  return pick ? `\nLAYOUT ARCHETYPE: ${pick}` : '';
}

function buildSignatureMovesBlock(theme: string): string {
  const themeMoves = THEME_SIGNATURE_MOVES[theme] ?? THEME_SIGNATURE_MOVES.default;
  const picks = pickRandomUnique([...themeMoves, ...GLOBAL_SIGNATURE_MOVES], 3);

  return picks.length > 0 ? `\nSIGNATURE MOVES (must apply):\n- ${picks.join('\n- ')}` : '';
}

export interface EnhancedPrompt {
  originalPrompt: string;

  enhancedPrompt: string;

  displayPrompt?: string;

  imagePrompt?: string;

  detectedTheme: string;

  colors: typeof THEME_PALETTES.default;

  images: ImageSet;

  sectionContract?: SectionContract;
}

const LAYOUT_MARKER = 'CREATIVE DIRECTION (Unique Layout Strategy):';

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

export async function enhancePromptWithDesignSystem(userPrompt: string): Promise<EnhancedPrompt> {
  const { basePrompt, layoutBlock } = splitPromptForEnhancer(userPrompt);
  const analysisPrompt = basePrompt;
  const promptWithLayout = layoutBlock ? `${analysisPrompt}\n\n${layoutBlock}` : analysisPrompt;

  const detectedTheme = detectTheme(analysisPrompt);
  const variationSeed = randomSeedString(6);

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

  const pickRandom = <T>(arr: T[]): T => pickRandomFromData(arr);

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
  const artDirectionLine = buildArtDirectionLine(detectedTheme);
  const layoutArchetypeLine = buildLayoutArchetypeLine(detectedTheme);
  const signatureMovesBlock = buildSignatureMovesBlock(detectedTheme);
  const sectionBlueprint = buildSectionBlueprint(mentionedSections, sectionSpecs.details, SECTION_LABELS);
  let effectDirectiveBlock = '';

  try {
    effectDirectiveBlock = buildEffectDirectiveBlock(detectedTheme);
  } catch (error) {
    promptWarn('[promptEnhancer] Failed to build effect directive block', error);
  }

  const requirements = extractRequirementLines(analysisPrompt).slice(0, 20);
  const requirementsBlock =
    requirements.length > 0 ? `\nREQUIREMENTS (must implement):\n- ${requirements.join('\n- ')}` : '';

  promptLog('[promptEnhancer] Before buildImageSuggestions:', {
    mentionedSections,
    wantsImagesResult: wantsImages(analysisPrompt, mentionedSections),
    imagesHero: images.hero?.slice(0, 1),
    imagesProducts: images.products?.slice(0, 1),
    imagesGallery: images.gallery?.slice(0, 1),
  });

  const imageSuggestions = wantsImages(analysisPrompt, mentionedSections)
    ? buildImageSuggestions(mentionedSections, images)
    : '';
  promptLog('[promptEnhancer] imageSuggestions result:', imageSuggestions?.substring(0, 200));

  const imagePrompt = imageSuggestions ? `\n${imageSuggestions}` : '';
  const colorDirectiveBlock = buildColorDirectiveBlock(finalColors);

  const sectionVariantBlock = buildSectionVariantBlock(mentionedSections, lowerPrompt, SECTION_LABELS);
  const componentDirectivesBlock = buildComponentDirectives(mentionedSections, detectedTheme, SECTION_LABELS);
  const brandLine = `\nBRAND NAME (use exactly): ${brandName}`;
  const templateGuard =
    '\nIMPORTANT: Do not use any generic/default template. Do not use BoltApp/ModernApp/ProjectName. Invent a brand name if none was given. Follow the prompt exactly.';
  const variationLine = `\nVARIATION SEED: ${variationSeed} (must vary layout, imagery, and composition from prior runs).`;

  const enhancedPrompt = `${promptWithLayout}
${brandLine}${colorDirectiveBlock}${imagePrompt}${sectionBlueprint}${sectionChecklist}${sectionContract}${sectionOrderLine}${sectionCountLine}${sectionDetailsBlock}${sectionGuardrails}${artDirectionLine}${layoutArchetypeLine}${signatureMovesBlock}${sectionVariantBlock}${requirementsBlock}${
    layoutSuggestions
      ? `
${layoutSuggestions}`
      : ''
  }${effectDirectiveBlock}${componentDirectivesBlock}${templateGuard}${variationLine}
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

  const imageSectionKeys = wantsImages(analysisPrompt, mentionedSections)
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

    sectionContract: sectionContractData,
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
