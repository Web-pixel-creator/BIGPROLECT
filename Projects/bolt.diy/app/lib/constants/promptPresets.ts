// Presets for quick prompts, effects, sections and themes (UTF-8)

import effectsList from './effects-list.json';

const uniquePresets = (items: readonly string[]) => {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of items) {
    const normalized = item.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    result.push(item);
  }

  return result;
};

const PROMPT_PRESET_GROUPS = {
  saas: [
    'IT-стартап (светлый): hero + CTA, преимущества, 3 тарифа, FAQ.',
    'SaaS (тёмный): hero с CTA, фичи, тарифы, отзывы, футер.',
  ],
  realestate: ['Лендинг недвижимости: hero с фильтром, карта + карточки, преимущества, CTA.'],
  portfolio: ['Портфолио дизайнера: hero + 2 CTA, кейсы (6), преимущества, контакты.'],
  education: ['Онлайн-курс: hero, программа (6), блок про автора, отзывы, CTA.'],
  ecommerce: ['Эком-магазин: hero, подборки товаров, преимущества доставки, отзывы, CTA.'],
  food: ['Ресторан/доставка: hero, меню + карточки (6), подборка недели, отзывы, бронирование.'],
} as const;

export const PROMPT_PRESETS = uniquePresets(Object.values(PROMPT_PRESET_GROUPS).flat()) as const;

export type EffectPreset = {
  label: string;
  hint: string;
};

// Список эффектов берём из облегчённого JSON (без кода компонентов)
export const EFFECT_PRESETS: EffectPreset[] = effectsList.map((item) => ({
  label: item.label || item.id,
  hint: item.hint || '',
}));

export const SECTION_PRESETS = uniquePresets([
  'Hero + CTA + преимущества',
  'Hero + кейсы (3) + CTA',
  'Hero + тарифы (3) + FAQ',
  'Hero + список услуг + CTA',
  'Hero + отзывы (3) + CTA',
]) as const;

export const THEME_PRESETS = uniquePresets([
  'Стиль: минимал / airy',
  'Стиль: нео-брутализм',
  'Стиль: tech / SaaS',
  'Стиль: food / delivery',
  'Стиль: креатив / портфолио',
  'Стиль: web3 / футуризм',
  'Стиль: fashion / luxury',
  'Стиль: архитектура / интерьер',
  'Стиль: авто / транспорт',
  'Стиль: финансы / банк',
  'Стиль: образование / курс',
  'Стиль: медицина / клиника',
  'Стиль: блог / медиа',
  'Стиль: ивенты / конференция',
  'Стиль: отели / travel',
  'Стиль: e-commerce / retail',
]) as const;
