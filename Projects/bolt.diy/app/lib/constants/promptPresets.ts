// Centralized prompt/effect presets (clean UTF-8)

export const PROMPT_PRESETS = [
  'IT-стартап (светлый): hero + CTA, преимущества, 3 тарифа, FAQ.',
  'SaaS (тёмный): hero с CTA, фичи, тарифы, отзывы, футер.',
  'Лендинг доставки еды: hero с поиском, сетка блюд, отзывы, CTA.',
  'Автосалон: hero + 2 CTA, услуги (6), отзывы, контакты.',
  'Портфолио дизайнера: hero, проекты (6), кейс в фокусе, контакты.',
  'Электронная коммерция: hero, категории, карточки товаров (8), отзывы, CTA.',
  'Блог/медиа: hero, подборка статей (6), подписка, футер.',
] as const;

export type EffectPreset = {
  label: string;
  hint: string;
};

export const EFFECT_PRESETS: EffectPreset[] = [
  { label: 'Blob cursor', hint: 'Пятно-курсор, плавно следующее за мышью' },
  { label: 'Stagger fade-in on scroll', hint: 'Поочередное появление блоков при скролле' },
  { label: 'Gradient border glow', hint: 'Градиентная обводка с подсветкой при hover' },
  { label: 'Aurora background + parallax', hint: 'Переливы “северное сияние” + плавный параллакс' },
  { label: 'Plasma / mesh background', hint: 'Пластичный градиентный фон (mesh/plasma)' },
  { label: 'Glassmorphism cards', hint: 'Полупрозрачные карточки с блюром и свечением' },
  { label: 'Magnetic buttons', hint: 'Кнопки тянутся к курсору при наведении' },
  { label: 'Hover spotlight', hint: 'Эффект прожектора при наведении' },
  { label: 'Tilt-on-hover cards', hint: 'Наклон карточек при hover (3D tilt)' },
  { label: 'Ripple effect', hint: 'Кольцевая рябь при клике/hover' },
  { label: 'Shiny button', hint: 'Блик/пробегающий свет по кнопке' },
  { label: 'Parallax hero layers', hint: 'Слои hero двигаются с разной скоростью' },
  { label: 'Noise / grain overlay', hint: 'Лёгкий шум поверх фона' },
  { label: 'Hover gradient beam', hint: 'Лучи/beam вдоль бордера при наведении' },
] as const;

export const SECTION_PRESETS = [
  'Hero + CTA + преимущества',
  'Hero + услуги (6) + CTA',
  'Hero + тарифы (3) + FAQ',
  'Hero + галерея работ + CTA',
  'Hero + отзывы (3) + CTA',
] as const;

export const THEME_PRESETS = [
  'Тема: светлая / airy',
  'Тема: тёмная / neo brutalism',
  'Тема: tech / SaaS',
  'Тема: food / delivery',
  'Тема: creative / portfolio',
] as const;
