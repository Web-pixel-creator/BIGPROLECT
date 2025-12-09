// Presets for quick prompts, effects, sections and themes (UTF-8)

import effectsList from './effects-list.json';

export const PROMPT_PRESETS = [
  'IT-стартап (светлый): hero + CTA, преимущества, 3 тарифа, FAQ.',
  'SaaS (тёмный): hero с CTA, фичи, тарифы, отзывы, футер.',
  'Лендинг недвижимости: hero с фильтром, карта + карточки, преимущества, CTA.',
  'Портфолио дизайнера: hero + 2 CTA, кейсы (6), преимущества, контакты.',
  'Онлайн-курс: hero, программа (6), блок про автора, отзывы, CTA.',
  'Эком-магазин: hero, подборки товаров, преимущества доставки, отзывы, CTA.',
  'Ресторан/доставка: hero, меню + карточки (6), подборка недели, отзывы, бронирование.',
] as const;

export type EffectPreset = {
  label: string;
  hint: string;
};

// Список эффектов берём из облегчённого JSON (без кода компонентов)
export const EFFECT_PRESETS: EffectPreset[] = effectsList.map((item) => ({
  label: item.label || item.id,
  hint: item.hint || '',
}));

export const SECTION_PRESETS = [
  'Hero + CTA + преимущества',
  'Hero + кейсы (3) + CTA',
  'Hero + тарифы (3) + FAQ',
  'Hero + список услуг + CTA',
  'Hero + отзывы (3) + CTA',
] as const;

export const THEME_PRESETS = [
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
] as const;
