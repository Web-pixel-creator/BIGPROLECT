// Presets for quick prompts, effects, sections and themes (UTF-8)

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

export const EFFECT_PRESETS: EffectPreset[] = [
  { label: 'Blob cursor', hint: 'Мягкий курсор-капля, тянется за мышью.' },
  { label: 'Stagger fade-in on scroll', hint: 'Плавное поочередное появление элементов при скролле.' },
  { label: 'Gradient border glow', hint: 'Светящаяся градиентная обводка при наведении.' },
  { label: 'Aurora background + parallax', hint: 'Живой фон-«аврора» с мягким параллаксом.' },
  { label: 'Plasma / mesh background', hint: 'Динамический плазменный/mesh фон.' },
  { label: 'Glassmorphism cards', hint: 'Прозрачные карточки с блюром (glassmorphism).' },
  { label: 'Magnetic buttons', hint: 'Кнопки, притягивающиеся к курсору.' },
  { label: 'Hover spotlight', hint: 'Спотлайт/луч света под курсором на hover.' },
  { label: 'Tilt-on-hover cards', hint: '3D-наклон карточек при наведении.' },
  { label: 'Ripple effect', hint: 'Рябь от клика или наведения.' },
  { label: 'Shiny button', hint: 'Блик, прокатывающийся по поверхности кнопки.' },
  { label: 'Parallax hero layers', hint: 'Слои hero двигаются с параллаксом.' },
  { label: 'Noise / grain overlay', hint: 'Лёгкая плёнка шума/зерна.' },
  { label: 'Hover gradient beam', hint: 'Градиентный луч по бордеру при наведении.' },
] as const;

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
