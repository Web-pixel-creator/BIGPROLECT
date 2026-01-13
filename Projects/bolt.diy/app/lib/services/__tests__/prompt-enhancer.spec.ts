/**
 * Smoke tests for prompt enhancer stability
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { enhancePromptWithDesignSystem, shouldEnhancePrompt } from '../promptEnhancer';
import { resetGlobalRng, setGlobalSeed } from '../prompt-data';

const originalFetch = (globalThis as { fetch?: typeof fetch }).fetch;

beforeEach(() => {
  setGlobalSeed(12345);
  (globalThis as { fetch?: typeof fetch }).fetch = async () => {
    throw new Error('test_fetch_disabled');
  };
});

afterEach(() => {
  resetGlobalRng();

  if (originalFetch) {
    (globalThis as { fetch?: typeof fetch }).fetch = originalFetch;
  } else {
    delete (globalThis as { fetch?: typeof fetch }).fetch;
  }
});

describe('Prompt Enhancer Stability', () => {
  it('detects theme and section order for a basic prompt', async () => {
    const prompt = [
      'Landing page for a furniture brand.',
      'Hero: bold headline and short subhead.',
      'Features: list the top 3 benefits.',
      'Pricing: three tiers with CTAs.',
    ].join('\n');

    const result = await enhancePromptWithDesignSystem(prompt);

    expect(result.detectedTheme).toBe('furniture');
    expect(result.sectionContract?.order).toEqual(['hero', 'features', 'pricing']);
    expect(result.enhancedPrompt).toContain('SECTION ORDER');
    expect(result.enhancedPrompt).toContain('SECTION COUNT: 3');
  });

  it('detects food theme from English prompt', async () => {
    const prompt = 'Landing page for a bakery and coffee brand with a small product lineup.';

    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('food');
  });

  it('recognizes Russian design intent and theme keywords', async () => {
    const prompt = '\u0441\u0430\u0439\u0442 \u043c\u0435\u0431\u0435\u043b\u044c';

    expect(shouldEnhancePrompt(prompt)).toBe(true);

    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('furniture');
  });

  it('detects medical theme from Russian prompt', async () => {
    const prompt = '\u0441\u0430\u0439\u0442 \u043a\u043b\u0438\u043d\u0438\u043a\u0438 \u0437\u0434\u043e\u0440\u043e\u0432\u044c\u044f';

    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('medical');
  });

  it('detects education theme from Russian prompt', async () => {
    const prompt = '\u043e\u043d\u043b\u0430\u0439\u043d \u043a\u0443\u0440\u0441 \u043f\u043e \u0434\u0438\u0437\u0430\u0439\u043d\u0443';

    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('education');
  });

  it('detects tech theme from Russian prompt', async () => {
    const prompt = '\u0441\u0430\u0439\u0442 \u0434\u043b\u044f \u0430\u0439\u0442\u0438 \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u044b \u0441 \u0430\u043d\u0430\u043b\u0438\u0442\u0438\u043a\u043e\u0439';

    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('tech');
  });

  it('detects finance theme from Russian prompt', async () => {
    const prompt = '\u043b\u0435\u043d\u0434\u0438\u043d\u0433 \u0434\u043b\u044f \u0431\u0430\u043d\u043a\u043e\u0432\u0441\u043a\u043e\u0433\u043e \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f';

    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('finance');
  });

  it('detects beauty theme from Russian prompt', async () => {
    const prompt = '\u043b\u0435\u043d\u0434\u0438\u043d\u0433 \u0434\u043b\u044f \u0441\u0430\u043b\u043e\u043d\u0430 \u043a\u0440\u0430\u0441\u043e\u0442\u044b \u0438 \u043a\u043e\u0441\u043c\u0435\u0442\u043e\u043b\u043e\u0433\u0438\u0438';

    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('beauty');
  });

  it('detects food theme from Russian prompt', async () => {
    const prompt = '\u0441\u0430\u0439\u0442 \u0434\u043b\u044f \u0441\u0435\u0440\u0432\u0438\u0441\u0430 \u0434\u043e\u0441\u0442\u0430\u0432\u043a\u0438 \u0435\u0434\u044b \u0438 \u043f\u0435\u043a\u0430\u0440\u043d\u0438';

    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('food');
  });

  it('detects realestate theme from Russian prompt', async () => {
    const prompt =
      '\u043b\u0435\u043d\u0434\u0438\u043d\u0433 \u0434\u043b\u044f \u0430\u0433\u0435\u043d\u0442\u0441\u0442\u0432\u0430 \u043d\u0435\u0434\u0432\u0438\u0436\u0438\u043c\u043e\u0441\u0442\u0438 \u0438 \u0436\u0438\u043b\u043e\u0433\u043e \u043a\u043e\u043c\u043f\u043b\u0435\u043a\u0441\u0430';

    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('realestate');
  });

  it('detects hotel theme from Russian prompt', async () => {
    const prompt = '\u0441\u0430\u0439\u0442 \u0431\u0443\u0442\u0438\u043a-\u043e\u0442\u0435\u043b\u044f \u0441 \u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435\u043c \u043d\u043e\u043c\u0435\u0440\u043e\u0432';

    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('hotel');
  });

  it('detects industrial theme from Russian prompt', async () => {
    const prompt = '\u043b\u0435\u043d\u0434\u0438\u043d\u0433 \u0434\u043b\u044f \u043f\u0440\u043e\u043c\u044b\u0448\u043b\u0435\u043d\u043d\u043e\u0439 \u044d\u043d\u0435\u0440\u0433\u0435\u0442\u0438\u0447\u0435\u0441\u043a\u043e\u0439 \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0438';

    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('industrial');
  });

  it('detects photography theme from Russian prompt', async () => {
    const prompt = '\u043f\u043e\u0440\u0442\u0444\u043e\u043b\u0438\u043e \u0444\u043e\u0442\u043e\u0433\u0440\u0430\u0444\u0430 \u0438 \u0444\u043e\u0442\u043e\u0441\u044a\u0451\u043c\u043a\u0430';

    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('photography');
  });

  it('detects vinyl theme from Russian prompt', async () => {
    // "магазин виниловых пластинок и проигрывателей"
    const prompt = '\u043c\u0430\u0433\u0430\u0437\u0438\u043d \u0432\u0438\u043d\u0438\u043b\u043e\u0432\u044b\u0445 \u043f\u043b\u0430\u0441\u0442\u0438\u043d\u043e\u043a \u0438 \u043f\u0440\u043e\u0438\u0433\u0440\u044b\u0432\u0430\u0442\u0435\u043b\u0435\u0439';

    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('vinyl');
  });

  it('detects restaurant theme from Russian prompt', async () => {
    // "сайт ресторана с меню и бронированием столиков"
    const prompt = '\u0441\u0430\u0439\u0442 \u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d\u0430 \u0441 \u043c\u0435\u043d\u044e \u0438 \u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435\u043c \u0441\u0442\u043e\u043b\u0438\u043a\u043e\u0432';

    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('restaurant');
  });

  it('detects ecommerce theme from Russian prompt', async () => {
    // "интернет-магазин с каталогом товаров и корзиной"
    const prompt = '\u0438\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043c\u0430\u0433\u0430\u0437\u0438\u043d \u0441 \u043a\u0430\u0442\u0430\u043b\u043e\u0433\u043e\u043c \u0442\u043e\u0432\u0430\u0440\u043e\u0432 \u0438 \u043a\u043e\u0440\u0437\u0438\u043d\u043e\u0439';

    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('ecommerce');
  });

  // New themes: automotive, travel, gaming, sports
  it('detects automotive theme from EN prompt', async () => {
    const prompt = 'car dealership website with vehicle catalog';
    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('automotive');
  });

  it('detects automotive theme from RU prompt', async () => {
    // "автосалон с каталогом автомобилей"
    const prompt = '\u0430\u0432\u0442\u043e\u0441\u0430\u043b\u043e\u043d \u0441 \u043a\u0430\u0442\u0430\u043b\u043e\u0433\u043e\u043c \u0430\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u0435\u0439';
    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('automotive');
  });

  it('detects travel theme from EN prompt', async () => {
    const prompt = 'travel agency website with tour packages and destinations';
    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('travel');
  });

  it('detects travel theme from RU prompt', async () => {
    // "турагентство с турами и направлениями"
    const prompt = '\u0442\u0443\u0440\u0430\u0433\u0435\u043d\u0442\u0441\u0442\u0432\u043e \u0441 \u0442\u0443\u0440\u0430\u043c\u0438 \u0438 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f\u043c\u0438';
    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('travel');
  });

  it('detects gaming theme from EN prompt', async () => {
    const prompt = 'esports team website with gaming tournaments';
    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('gaming');
  });

  it('detects gaming theme from RU prompt', async () => {
    // "игровая студия с видеоиграми"
    const prompt = '\u0438\u0433\u0440\u043e\u0432\u0430\u044f \u0441\u0442\u0443\u0434\u0438\u044f \u0441 \u0432\u0438\u0434\u0435\u043e\u0438\u0433\u0440\u0430\u043c\u0438';
    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('gaming');
  });

  it('detects sports theme from EN prompt', async () => {
    const prompt = 'fitness gym website with workout programs';
    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('sports');
  });

  it('detects sports theme from RU prompt', async () => {
    // "фитнес-клуб с программами тренировок"
    const prompt = '\u0444\u0438\u0442\u043d\u0435\u0441-\u043a\u043b\u0443\u0431 \u0441 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0430\u043c\u0438 \u0442\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043e\u043a';
    const result = await enhancePromptWithDesignSystem(prompt);
    expect(result.detectedTheme).toBe('sports');
  });

  // Conflict resolution tests - keywords that overlap between themes
  describe('theme conflict resolution', () => {
    it('prefers hotel over beauty when spa is in hotel context', async () => {
      // "boutique hotel with spa and wellness center"
      const prompt = 'boutique hotel with spa and wellness center';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('hotel');
    });

    it('prefers beauty over hotel when spa is in beauty context', async () => {
      // "beauty salon and spa treatments"
      const prompt = 'beauty salon and spa treatments';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('beauty');
    });

    it('prefers medical over beauty when wellness is in medical context', async () => {
      // "medical clinic with wellness programs"
      const prompt = 'medical clinic with wellness programs';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('medical');
    });

    it('prefers beauty over medical when wellness is in beauty context', async () => {
      // "beauty and wellness cosmetics brand"
      const prompt = 'beauty and wellness cosmetics brand';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('beauty');
    });

    it('resolves RU spa conflict: hotel context', async () => {
      // "бутик-отель со спа и бассейном"
      const prompt = '\u0431\u0443\u0442\u0438\u043a-\u043e\u0442\u0435\u043b\u044c \u0441\u043e \u0441\u043f\u0430 \u0438 \u0431\u0430\u0441\u0441\u0435\u0439\u043d\u043e\u043c';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('hotel');
    });

    it('resolves RU spa conflict: beauty context', async () => {
      // "салон красоты и спа процедуры"
      const prompt = '\u0441\u0430\u043b\u043e\u043d \u043a\u0440\u0430\u0441\u043e\u0442\u044b \u0438 \u0441\u043f\u0430 \u043f\u0440\u043e\u0446\u0435\u0434\u0443\u0440\u044b';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('beauty');
    });

    it('prefers vinyl over ecommerce for music store', async () => {
      // "vinyl record store with turntables"
      const prompt = 'vinyl record store with turntables';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('vinyl');
    });

    it('prefers food over restaurant for coffee/bakery', async () => {
      // "bakery and coffee brand" - food theme
      const prompt = 'bakery and coffee brand';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('food');
    });

    it('prefers restaurant over food for dining context', async () => {
      // "restaurant with menu and dining reservations"
      const prompt = 'restaurant with menu and dining reservations';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('restaurant');
    });

    it('prefers photography over electronics for camera context', async () => {
      // "photographer portfolio with photo gallery"
      const prompt = 'photographer portfolio with photo gallery';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('photography');
    });

    it('prefers electronics over photography for gadget context', async () => {
      // "electronics store with smartphones and cameras"
      const prompt = 'electronics store with smartphones and cameras';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('electronics');
    });

    it('prefers fashion over ecommerce for clothing context', async () => {
      // "fashion boutique with clothing and accessories"
      const prompt = 'fashion boutique with clothing and accessories';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('fashion');
    });

    it('resolves RU music conflict: vinyl context', async () => {
      // "магазин виниловых пластинок и музыки"
      const prompt = '\u043c\u0430\u0433\u0430\u0437\u0438\u043d \u0432\u0438\u043d\u0438\u043b\u043e\u0432\u044b\u0445 \u043f\u043b\u0430\u0441\u0442\u0438\u043d\u043e\u043a \u0438 \u043c\u0443\u0437\u044b\u043a\u0438';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('vinyl');
    });

    it('resolves RU coffee conflict: food context', async () => {
      // "пекарня и кофейня с доставкой"
      const prompt = '\u043f\u0435\u043a\u0430\u0440\u043d\u044f \u0438 \u043a\u043e\u0444\u0435\u0439\u043d\u044f \u0441 \u0434\u043e\u0441\u0442\u0430\u0432\u043a\u043e\u0439';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('food');
    });

    it('resolves RU restaurant conflict: restaurant context', async () => {
      // "ресторан с меню и бронированием столиков"
      const prompt = '\u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d \u0441 \u043c\u0435\u043d\u044e \u0438 \u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435\u043c \u0441\u0442\u043e\u043b\u0438\u043a\u043e\u0432';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('restaurant');
    });
  });

  // Noisy keywords tests - generic words should not trigger specific themes
  describe('noisy keywords handling', () => {
    it('returns default for prompt with only noisy EN words', async () => {
      // Only generic words: "website landing page design"
      const prompt = 'website landing page design';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('default');
    });

    it('returns default for prompt with only noisy RU words', async () => {
      // Only generic words: "сайт лендинг дизайн страница"
      const prompt = '\u0441\u0430\u0439\u0442 \u043b\u0435\u043d\u0434\u0438\u043d\u0433 \u0434\u0438\u0437\u0430\u0439\u043d \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('default');
    });

    it('specific keyword wins over noisy words', async () => {
      // "website landing page for furniture brand" - furniture is specific
      const prompt = 'website landing page for furniture brand';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('furniture');
    });

    it('specific RU keyword wins over noisy words', async () => {
      // "сайт лендинг для мебельного бренда" - мебельного is specific
      const prompt = '\u0441\u0430\u0439\u0442 \u043b\u0435\u043d\u0434\u0438\u043d\u0433 \u0434\u043b\u044f \u043c\u0435\u0431\u0435\u043b\u044c\u043d\u043e\u0433\u043e \u0431\u0440\u0435\u043d\u0434\u0430';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('furniture');
    });

    it('multiple noisy words do not outweigh single specific keyword', async () => {
      // "platform service product company website for restaurant"
      const prompt = 'platform service product company website for restaurant';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('restaurant');
    });
  });

  describe('fuzzy keyword matching', () => {
    it('detects theme from an English typo', async () => {
      const prompt = 'restuarant booking page with menu';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('restaurant');
    });

    it('detects theme from a Russian typo', async () => {
      // "sait restaran s menyu"
      const prompt = '\u0441\u0430\u0439\u0442 \u0440\u0435\u0441\u0442\u0430\u0440\u0430\u043d \u0441 \u043c\u0435\u043d\u044e';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('restaurant');
    });

    it('does not treat noisy typos as a theme signal', async () => {
      const prompt = 'platfrom servise websit landing';
      const result = await enhancePromptWithDesignSystem(prompt);
      expect(result.detectedTheme).toBe('default');
    });
  });

  it('does not treat generic text as a design request', () => {
    expect(shouldEnhancePrompt('hello there')).toBe(false);
  });

  it('adds requirements block when prompt provides a list', async () => {
    const prompt = [
      'Landing page for a coffee shop.',
      '- Add a pricing section.',
      '- Include testimonials with short quotes.',
    ].join('\n');

    const result = await enhancePromptWithDesignSystem(prompt);

    expect(result.enhancedPrompt).toContain('REQUIREMENTS (must implement):');
    expect(result.enhancedPrompt).toContain('Add a pricing section.');
    expect(result.enhancedPrompt).toContain('Include testimonials with short quotes.');
  });

  it('builds image contract when image sections are requested', async () => {
    const prompt = [
      'Landing page for a furniture brand with rich photography.',
      'Hero: large image and headline.',
      'Gallery: product photos.',
      'Products: grid of featured items.',
    ].join('\n');

    const result = await enhancePromptWithDesignSystem(prompt);
    const contract = result.sectionContract;

    expect(contract).toBeDefined();

    const imageSections = contract?.imageSections ?? [];
    expect(imageSections).toEqual(expect.arrayContaining(['hero', 'gallery', 'products']));

    for (const section of imageSections) {
      const images = contract?.imageMap?.[section] ?? [];
      expect(images.length).toBeGreaterThan(0);
    }
  });

  it('keeps section contract invariants consistent', async () => {
    const prompt = [
      'Landing page for a furniture brand with rich photography.',
      'Navigation: logo, links, and cart icon.',
      'Hero: full-width image and headline.',
      'Gallery: product photos.',
      'Products: grid of featured items.',
      'Pricing: three tiers with CTAs.',
    ].join('\n');

    const result = await enhancePromptWithDesignSystem(prompt);
    const contract = result.sectionContract;

    expect(contract).toBeDefined();

    const order = contract?.order ?? [];
    const uniqueOrder = new Set(order);
    expect(order.length).toBe(uniqueOrder.size);

    for (const section of order) {
      expect(contract?.labels?.[section]).toBeDefined();
    }

    const imageSections = contract?.imageSections ?? [];
    for (const section of imageSections) {
      expect(order).toContain(section);
    }

    const imageMap = contract?.imageMap ?? {};
    for (const [section, images] of Object.entries(imageMap)) {
      expect(images.length).toBeGreaterThan(0);
      const minCount = contract?.imageMinCounts?.[section];
      if (typeof minCount === 'number') {
        expect(minCount).toBeGreaterThan(0);
        expect(minCount).toBeLessThanOrEqual(images.length);
      }
    }
  });
});
