// Centralized prompt/effect presets to avoid encoding issues in components.
export const PROMPT_PRESETS = [
  'Сделай лендинг автосалона: тёмный, hero + 2 CTA, 6 услуг, отзывы, футер.',
  'IT-стартап (светлый): hero + CTA, преимущества, 3 тарифа, FAQ.',
  'Доставка еды: тёплый hero с поиском, сетка блюд, отзывы, CTA «Заказать».',
  'Строительная компания: hero с фото, 6 услуг, 3 проекта, блок «О нас», CTA консультация.',
  'Портфолио фотографа: hero + галерея, отзывы, прайс, CTA «Связаться».',
  'Dark auto dealership landing: hero + 2 CTAs, services grid (6), testimonials, footer.',
  'Modern SaaS (light): hero with CTA, features, pricing (3 tiers), FAQ.',
] as const;

export const EFFECT_PRESETS = [
  'Добавь аурору на hero и плавный параллакс при скролле.',
  'Градиентная обводка на карточках услуг, лёгкий glow на hover.',
  'Бегущая строка брендов (marquee) + sparkles в фоне.',
  'Plasma/mesh фон в CTA и shiny кнопки.',
  'Blob cursor + плавные появления (stagger fade-in) при скролле.',
  'Gradient border on cards, glow on hover.',
  'Aurora background + smooth parallax scroll.',
] as const;
