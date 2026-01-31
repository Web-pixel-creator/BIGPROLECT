/**
 * Component Keywords
 * Keywords for matching UI components in user prompts (EN + RU)
 * RU keywords use \uXXXX encoding to avoid encoding issues
 */

// English keywords for component matching
export const COMPONENT_KEYWORDS_EN: Record<string, string[]> = {
  header: ['header', 'head', 'top bar', 'top section', 'site header', 'page header'],
  hero: ['hero', 'hero section', 'hero banner', 'main banner', 'landing section', 'above the fold', 'first screen', 'splash'],
  navbar: ['navbar', 'navigation', 'nav', 'nav bar', 'navigation bar', 'top menu', 'main menu', 'site menu'],
  navigation: ['navigation', 'navbar', 'nav', 'nav bar', 'navigation bar', 'menu', 'site menu'],
  features: ['features', 'feature', 'benefits', 'advantages', 'services', 'what we offer', 'capabilities'],
  pricing: ['pricing', 'plans', 'prices', 'tiers', 'subscription'],
  testimonials: ['testimonials', 'reviews', 'feedback', 'quotes'],
  team: ['team', 'about us', 'our team', 'leadership', 'staff'],
  contact: ['contact', 'contact form', 'get in touch', 'reach out'],
  footer: ['footer', 'site footer', 'bottom section'],
  cta: ['cta', 'call to action', 'call-to-action', 'signup', 'sign up', 'get started'],
  faq: ['faq', 'questions', 'q&a', 'accordion'],
  about: ['about', 'our story', 'mission', 'vision'],
  stats: ['stats', 'metrics', 'numbers', 'kpis'],
  services: ['services', 'offerings', 'what we do'],
  projects: ['projects', 'case studies', 'work', 'portfolio'],
  gallery: ['gallery', 'grid', 'masonry', 'carousel', 'slider'],
  blog: ['blog', 'articles', 'news', 'posts'],
  logos: ['logos', 'logo cloud', 'partners', 'clients'],
  marquee: ['marquee', 'ticker', 'scrolling text', 'running line'],
  'how-it-works': ['how it works', 'steps', 'process', 'workflow'],
  comparison: ['comparison', 'compare', 'versus', 'vs', 'comparison table'],
  integration: ['integration', 'integrations', 'connectors', 'connect'],
  products: ['products', 'catalog', 'shop', 'store'],
  categories: ['categories', 'collections', 'filters'],
  newsletter: ['newsletter', 'subscribe', 'email signup'],
};

// Russian keywords for component matching (using \uXXXX encoding)
export const COMPONENT_KEYWORDS_RU: Record<string, string[]> = {
  header: [
    '\u0448\u0430\u043f\u043a\u0430',                    // шапка
    '\u0432\u0435\u0440\u0445\u043d\u044f\u044f \u0447\u0430\u0441\u0442\u044c', // верхняя часть
    '\u0437\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a \u0441\u0430\u0439\u0442\u0430', // заголовок сайта
  ],
  hero: [
    '\u0433\u0435\u0440\u043e\u0439',                    // герой
    '\u0433\u043b\u0430\u0432\u043d\u044b\u0439 \u0431\u0430\u043d\u043d\u0435\u0440', // главный баннер
    '\u043f\u0435\u0440\u0432\u044b\u0439 \u044d\u043a\u0440\u0430\u043d', // первый экран
    '\u0433\u043b\u0430\u0432\u043d\u044b\u0439 \u044d\u043a\u0440\u0430\u043d', // главный экран
  ],
  navbar: [
    '\u043d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044f', // навигация
    '\u043c\u0435\u043d\u044e',                          // меню
    '\u0433\u043b\u0430\u0432\u043d\u043e\u0435 \u043c\u0435\u043d\u044e', // главное меню
    '\u0432\u0435\u0440\u0445\u043d\u0435\u0435 \u043c\u0435\u043d\u044e', // верхнее меню
  ],
  navigation: [
    '\u043d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044f', // навигация
    '\u043c\u0435\u043d\u044e',                          // меню
    '\u0432\u0435\u0440\u0445\u043d\u0435\u0435 \u043c\u0435\u043d\u044e', // верхнее меню
    '\u043d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u043e\u043d\u043d\u0430\u044f \u043f\u0430\u043d\u0435\u043b\u044c', // навигационная панель
  ],
  features: [
    '\u0444\u0438\u0447\u0438',                          // фичи
    '\u043f\u0440\u0435\u0438\u043c\u0443\u0449\u0435\u0441\u0442\u0432\u0430', // преимущества
    '\u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e\u0441\u0442\u0438', // возможности
    '\u0443\u0441\u043b\u0443\u0433\u0438',              // услуги
  ],
  pricing: [
    '\u0446\u0435\u043d\u044b',                          // цены
    '\u0442\u0430\u0440\u0438\u0444\u044b',              // тарифы
    '\u043f\u043b\u0430\u043d\u044b',                    // планы
    '\u043f\u043e\u0434\u043f\u0438\u0441\u043a\u0430',  // подписка
  ],
  testimonials: [
    '\u043e\u0442\u0437\u044b\u0432\u044b',              // отзывы
    '\u0440\u0435\u0446\u0435\u043d\u0437\u0438\u0438',  // рецензии
    '\u043c\u043d\u0435\u043d\u0438\u044f \u043a\u043b\u0438\u0435\u043d\u0442\u043e\u0432', // мнения клиентов
  ],
  team: [
    '\u043a\u043e\u043c\u0430\u043d\u0434\u0430',        // команда
    '\u043d\u0430\u0448\u0430 \u043a\u043e\u043c\u0430\u043d\u0434\u0430', // наша команда
    '\u0441\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u043a\u0438', // сотрудники
    '\u043e \u043d\u0430\u0441',                         // о нас
  ],
  contact: [
    '\u043a\u043e\u043d\u0442\u0430\u043a\u0442\u044b',  // контакты
    '\u0441\u0432\u044f\u0437\u044c',                    // связь
    '\u043e\u0431\u0440\u0430\u0442\u043d\u0430\u044f \u0441\u0432\u044f\u0437\u044c', // обратная связь
    '\u043d\u0430\u043f\u0438\u0448\u0438\u0442\u0435 \u043d\u0430\u043c', // напишите нам
  ],
  footer: [
    '\u0444\u0443\u0442\u0435\u0440',                    // футер
    '\u043f\u043e\u0434\u0432\u0430\u043b',              // подвал
    '\u043d\u0438\u0436\u043d\u044f\u044f \u0447\u0430\u0441\u0442\u044c', // нижняя часть
  ],
  cta: [
    '\u043f\u0440\u0438\u0437\u044b\u0432 \u043a \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044e', // призыв к действию
    '\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044f', // регистрация
    '\u043d\u0430\u0447\u0430\u0442\u044c',              // начать
  ],
  faq: [
    '\u0447\u0430\u0432\u043e',                          // чаво
    '\u0432\u043e\u043f\u0440\u043e\u0441\u044b',        // вопросы
    '\u0447\u0430\u0441\u0442\u044b\u0435 \u0432\u043e\u043f\u0440\u043e\u0441\u044b', // частые вопросы
    '\u0432\u043e\u043f\u0440\u043e\u0441-\u043e\u0442\u0432\u0435\u0442', // вопрос-ответ
  ],
  about: [
    '\u043e \u043d\u0430\u0441',                         // о нас
    '\u043d\u0430\u0448\u0430 \u0438\u0441\u0442\u043e\u0440\u0438\u044f', // наша история
    '\u043c\u0438\u0441\u0441\u0438\u044f',              // миссия
    '\u043e \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0438', // о компании
  ],
  stats: [
    '\u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430', // статистика
    '\u043c\u0435\u0442\u0440\u0438\u043a\u0438',        // метрики
    '\u0446\u0438\u0444\u0440\u044b',                    // цифры
    '\u043f\u043e\u043a\u0430\u0437\u0430\u0442\u0435\u043b\u0438', // показатели
  ],
  services: [
    '\u0443\u0441\u043b\u0443\u0433\u0438',              // услуги
    '\u0447\u0442\u043e \u043c\u044b \u0434\u0435\u043b\u0430\u0435\u043c', // что мы делаем
    '\u043d\u0430\u0448\u0438 \u0443\u0441\u043b\u0443\u0433\u0438', // наши услуги
  ],
  projects: [
    '\u043f\u0440\u043e\u0435\u043a\u0442\u044b',        // проекты
    '\u043a\u0435\u0439\u0441\u044b',                    // кейсы
    '\u0440\u0430\u0431\u043e\u0442\u044b',              // работы
    '\u043f\u043e\u0440\u0442\u0444\u043e\u043b\u0438\u043e', // портфолио
  ],
  gallery: [
    '\u0433\u0430\u043b\u0435\u0440\u0435\u044f',        // галерея
    '\u0441\u0435\u0442\u043a\u0430',                    // сетка
    '\u043a\u0430\u0440\u0443\u0441\u0435\u043b\u044c',  // карусель
    '\u0441\u043b\u0430\u0439\u0434\u0435\u0440',        // слайдер
  ],
  blog: [
    '\u0431\u043b\u043e\u0433',                          // блог
    '\u0441\u0442\u0430\u0442\u044c\u0438',              // статьи
    '\u043d\u043e\u0432\u043e\u0441\u0442\u0438',        // новости
    '\u043f\u043e\u0441\u0442\u044b',                    // посты
  ],
  logos: [
    '\u043b\u043e\u0433\u043e\u0442\u0438\u043f\u044b',  // логотипы
    '\u043f\u0430\u0440\u0442\u043d\u0435\u0440\u044b',  // партнеры
    '\u043a\u043b\u0438\u0435\u043d\u0442\u044b',        // клиенты
  ],
  marquee: [
    '\u0431\u0435\u0433\u0443\u0449\u0430\u044f \u0441\u0442\u0440\u043e\u043a\u0430', // бегущая строка
    '\u0442\u0438\u043a\u0435\u0440',                    // тикер
  ],
  'how-it-works': [
    '\u043a\u0430\u043a \u044d\u0442\u043e \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442', // как это работает
    '\u044d\u0442\u0430\u043f\u044b',                    // этапы
    '\u043f\u0440\u043e\u0446\u0435\u0441\u0441',       // процесс
  ],
  comparison: [
    '\u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u0435', // сравнение
    '\u0441\u0440\u0430\u0432\u043d\u0438\u0442\u044c',       // сравнить
  ],
  integration: [
    '\u0438\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044f', // интеграция
    '\u0438\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438', // интеграции
    '\u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435', // подключение
  ],
  products: [
    '\u0442\u043e\u0432\u0430\u0440\u044b',              // товары
    '\u043a\u0430\u0442\u0430\u043b\u043e\u0433',        // каталог
    '\u043c\u0430\u0433\u0430\u0437\u0438\u043d',        // магазин
    '\u043f\u0440\u043e\u0434\u0443\u043a\u0442\u044b',  // продукты
  ],
  categories: [
    '\u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0438', // категории
    '\u043a\u043e\u043b\u043b\u0435\u043a\u0446\u0438\u0438', // коллекции
    '\u0444\u0438\u043b\u044c\u0442\u0440\u044b',        // фильтры
  ],
  newsletter: [
    '\u0440\u0430\u0441\u0441\u044b\u043b\u043a\u0430',  // рассылка
    '\u043f\u043e\u0434\u043f\u0438\u0441\u043a\u0430',  // подписка
    '\u043f\u043e\u0434\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f', // подписаться
  ],
};

/**
 * Get merged component keywords (EN + RU)
 */
export function getMergedComponentKeywords(): Record<string, string[]> {
  const merged: Record<string, string[]> = {};
  
  for (const [key, enKeywords] of Object.entries(COMPONENT_KEYWORDS_EN)) {
    const ruKeywords = COMPONENT_KEYWORDS_RU[key] ?? [];
    merged[key] = [...enKeywords, ...ruKeywords];
  }
  
  return merged;
}

// Pre-merged for direct use
export const COMPONENT_KEYWORDS = getMergedComponentKeywords();
