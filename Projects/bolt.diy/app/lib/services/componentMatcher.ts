import { createScopedLogger } from '~/utils/logger';
import * as fs from 'fs';
import * as path from 'path';
import { buildIndex, type ComponentMeta } from './component-index';

const logger = createScopedLogger('component-matcher');
const MAX_CODE_LENGTH = 3200;

function shuffleArray<T>(arr: T[]): T[] {
  return arr
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface ComponentMatch {
  name: string;
  category: string;
  description: string;
  code: string;
  relevance: number;
}

// Keywords mapping for component matching (EN + RU)
const COMPONENT_KEYWORDS: Record<string, string[]> = {
  // ═══════════════════════════════════════════════════════════════
  // HEADERS & NAVIGATION
  // ═══════════════════════════════════════════════════════════════
  header: [
    'header', 'head', 'top bar', 'top section', 'site header', 'page header',
    'шапка', 'шапку', 'верхняя часть', 'верх сайта', 'хедер',
  ],
  hero: [
    'hero', 'hero section', 'hero banner', 'main banner', 'landing section', 'above fold', 'first screen', 'splash',
    'герой', 'главная секция', 'баннер', 'лендинг', 'первый экран', 'главный блок', 'заглавная секция',
  ],
  navbar: [
    'navbar', 'navigation', 'nav', 'nav bar', 'navigation bar', 'top menu', 'main menu', 'site menu',
    'навигация', 'навбар', 'меню', 'главное меню', 'верхнее меню', 'панель навигации',
  ],

  // ═══════════════════════════════════════════════════════════════
  // CONTENT SECTIONS
  // ═══════════════════════════════════════════════════════════════
  features: [
    'features', 'feature', 'benefits', 'advantages', 'services', 'what we offer', 'capabilities',
    'функции', 'возможности', 'преимущества', 'услуги', 'сервисы', 'что мы предлагаем', 'фичи',
  ],
  pricing: [
    'pricing', 'price', 'prices', 'plans', 'subscription', 'packages', 'tiers', 'cost',
    'цены', 'прайс', 'тарифы', 'планы', 'подписка', 'пакеты', 'стоимость', 'расценки',
  ],
  testimonials: [
    'testimonials', 'testimonial', 'reviews', 'feedback', 'customers say', 'client reviews', 'social proof',
    'отзывы', 'отзыв', 'мнения', 'клиенты говорят', 'обратная связь', 'рекомендации',
  ],
  team: [
    'team', 'our team', 'staff', 'employees', 'people', 'about us', 'who we are', 'founders',
    'команда', 'наша команда', 'сотрудники', 'персонал', 'о нас', 'кто мы', 'основатели',
  ],
  contact: [
    'contact', 'contact us', 'get in touch', 'reach us', 'contact form', 'inquiry',
    'контакты', 'связаться', 'напишите нам', 'обратная связь', 'форма связи', 'контактная форма',
  ],
  footer: [
    'footer', 'site footer', 'page footer', 'bottom', 'bottom section',
    'футер', 'подвал', 'нижняя часть', 'низ сайта',
  ],
  cta: [
    'cta', 'call to action', 'action section', 'signup section', 'get started',
    'призыв к действию', 'секция действия', 'регистрация', 'начать',
  ],
  faq: [
    'faq', 'frequently asked', 'questions', 'q&a', 'help section',
    'чаво', 'вопросы и ответы', 'частые вопросы', 'помощь',
  ],
  stats: [
    'stats', 'statistics', 'numbers', 'metrics', 'achievements', 'counters',
    'статистика', 'цифры', 'метрики', 'достижения', 'счётчики', 'показатели',
  ],
  logo: [
    'logo', 'logos', 'partners', 'clients', 'brands', 'trusted by', 'as seen on',
    'логотипы', 'партнёры', 'клиенты', 'бренды', 'нам доверяют',
  ],

  // ═══════════════════════════════════════════════════════════════
  // CARDS & CONTAINERS
  // ═══════════════════════════════════════════════════════════════
  card: [
    'card', 'cards', 'tile', 'tiles', 'box', 'boxes', 'item', 'block',
    'карточка', 'карточки', 'плитка', 'блок', 'блоки', 'элемент',
  ],
  gallery: [
    'gallery', 'image gallery', 'photo gallery', 'portfolio', 'showcase', 'lightbox', 'masonry',
    'галерея', 'фотогалерея', 'портфолио', 'витрина', 'выставка', 'фото',
  ],
  grid: [
    'grid', 'grid layout', 'columns', 'layout', 'bento', 'bento grid', 'mosaic',
    'сетка', 'грид', 'колонки', 'раскладка', 'бенто', 'мозаика',
  ],
  list: [
    'list', 'listing', 'items', 'bullet points',
    'список', 'перечень', 'пункты',
  ],

  // ═══════════════════════════════════════════════════════════════
  // INTERACTIVE COMPONENTS
  // ═══════════════════════════════════════════════════════════════
  carousel: [
    'carousel', 'slider', 'slideshow', 'swiper', 'image slider', 'content slider',
    'карусель', 'слайдер', 'слайдшоу', 'свайпер', 'прокрутка изображений',
  ],
  tabs: [
    'tabs', 'tab', 'tabbed', 'tab panel', 'tab navigation',
    'вкладки', 'табы', 'переключатели',
  ],
  accordion: [
    'accordion', 'collapsible', 'expandable', 'toggle', 'dropdown content',
    'аккордеон', 'раскрывающийся', 'сворачиваемый',
  ],
  modal: [
    'modal', 'popup', 'dialog', 'overlay', 'lightbox', 'drawer',
    'модальное окно', 'модалка', 'попап', 'диалог', 'оверлей',
  ],
  tooltip: [
    'tooltip', 'hint', 'popover', 'info bubble',
    'подсказка', 'тултип', 'всплывающая подсказка',
  ],
  dropdown: [
    'dropdown', 'select', 'menu dropdown', 'combobox',
    'выпадающий список', 'дропдаун', 'селект',
  ],

  // ═══════════════════════════════════════════════════════════════
  // FORMS & INPUTS
  // ═══════════════════════════════════════════════════════════════
  form: [
    'form', 'input form', 'contact form', 'signup form', 'login form', 'registration',
    'форма', 'форма ввода', 'форма регистрации', 'форма входа', 'анкета',
  ],
  button: [
    'button', 'btn', 'cta button', 'action button', 'submit',
    'кнопка', 'кнопки', 'батон',
  ],
  input: [
    'input', 'text field', 'text input', 'search box', 'search bar',
    'поле ввода', 'инпут', 'текстовое поле', 'строка поиска',
  ],
  checkbox: [
    'checkbox', 'check', 'toggle', 'switch',
    'чекбокс', 'галочка', 'переключатель', 'свитч',
  ],

  // ═══════════════════════════════════════════════════════════════
  // EFFECTS & ANIMATIONS (General)
  // ═══════════════════════════════════════════════════════════════
  animation: [
    'animation', 'animated', 'motion', 'transition', 'effect', 'dynamic',
    'анимация', 'анимированный', 'движение', 'переход', 'эффект', 'динамичный',
  ],
  gradient: [
    'gradient', 'color gradient', 'gradient background', 'fade', 'blend',
    'градиент', 'градиентный', 'переход цвета', 'плавный переход',
  ],
  parallax: [
    'parallax', 'parallax scroll', 'depth effect', 'layered scroll',
    'параллакс', 'эффект глубины', 'многослойная прокрутка',
  ],
  hover: [
    'hover', 'hover effect', 'on hover', 'mouse over', 'interactive',
    'ховер', 'при наведении', 'эффект наведения', 'интерактивный',
  ],
  scroll: [
    'scroll', 'scroll animation', 'on scroll', 'scroll reveal', 'scroll trigger',
    'скролл', 'при прокрутке', 'анимация прокрутки',
  ],
  loading: [
    'loading', 'loader', 'spinner', 'skeleton', 'placeholder',
    'загрузка', 'лоадер', 'спиннер', 'скелетон', 'заглушка',
  ],

  // ═══════════════════════════════════════════════════════════════
  // ACETERNITY EFFECTS (Premium animations)
  // ═══════════════════════════════════════════════════════════════
  sparkles: [
    'sparkles', 'sparkle', 'glitter', 'shimmer', 'twinkle', 'shine', 'glint',
    'искры', 'искорки', 'блёстки', 'блестки', 'сияние', 'мерцание', 'звёздочки', 'звездочки', 'блеск',
  ],
  spotlight: [
    'spotlight', 'spot light', 'highlight', 'focus light', 'beam', 'torch',
    'прожектор', 'свет', 'подсветка', 'луч', 'фокус', 'выделение светом',
  ],
  lamp: [
    'lamp', 'lamp effect', 'glow', 'glowing', 'neon', 'light source',
    'лампа', 'свечение', 'светящийся', 'неон', 'источник света',
  ],
  beams: [
    'beams', 'light beams', 'rays', 'light rays', 'background beams', 'laser',
    'лучи', 'световые лучи', 'линии', 'полосы', 'лазер',
  ],
  stars: [
    'stars', 'glowing stars', 'starfield', 'night sky', 'constellation',
    'звёзды', 'звезды', 'светящиеся звёзды', 'ночное небо', 'созвездие',
  ],
  particles: [
    'particles', 'particle', 'dots', 'floating dots', 'dust', 'confetti',
    'частицы', 'точки', 'плавающие точки', 'пыль', 'конфетти',
  ],
  meteor: [
    'meteor', 'meteors', 'shooting star', 'falling star', 'comet',
    'метеор', 'метеорит', 'падающие звёзды', 'падающая звезда', 'комета',
  ],
  tracing: [
    'tracing', 'tracing beam', 'line trace', 'path animation', 'draw line',
    'трассировка', 'след', 'линия', 'рисование линии', 'путь',
  ],
  reveal: [
    'reveal', 'text reveal', 'unveil', 'uncover', 'show on hover',
    'появление', 'раскрытие', 'показать', 'открыть',
  ],
  generate: [
    'generate', 'text generate', 'typewriter', 'typing', 'type effect',
    'генерация', 'печатание', 'эффект печати', 'набор текста',
  ],
  moving: [
    'moving', 'infinite moving', 'auto scroll', 'marquee', 'ticker', 'endless scroll',
    'движущийся', 'бегущий', 'автопрокрутка', 'бегущая строка', 'бесконечная прокрутка',
  ],
  sticky: [
    'sticky', 'sticky scroll', 'fixed on scroll', 'pinned',
    'липкий', 'фиксированный', 'закреплённый при прокрутке',
  ],
  pin: [
    'pin', '3d pin', 'map pin', 'marker', 'location pin', 'pointer',
    'пин', 'маркер', 'указатель', 'точка на карте', 'метка',
  ],
  mask: [
    'mask', 'svg mask', 'clip', 'cutout', 'shape mask',
    'маска', 'вырез', 'контур', 'обрезка',
  ],
  evervault: [
    'evervault', 'matrix', 'encryption', 'code rain', 'hacker', 'cyber',
    'матрица', 'шифрование', 'код', 'хакер', 'кибер',
  ],
  container: [
    'container', 'container scroll', 'scroll container', 'iphone mockup', 'device frame',
    'контейнер', 'прокрутка в контейнере', 'мокап телефона', 'рамка устройства',
  ],
  following: [
    'following', 'following pointer', 'cursor follow', 'mouse follow', 'cursor effect',
    'следящий', 'следование за курсором', 'эффект курсора',
  ],
  dot: [
    'dot', 'dot pattern', 'dot background', 'polka dots', 'dotted',
    'точки', 'точечный фон', 'узор из точек',
  ],
  wave: [
    'wave', 'wavy', 'wave animation', 'ocean', 'ripple',
    'волна', 'волнистый', 'рябь', 'волновой эффект',
  ],
  blur: [
    'blur', 'blur effect', 'glassmorphism', 'frosted glass', 'backdrop blur',
    'размытие', 'блюр', 'стекло', 'матовое стекло',
  ],
  border: [
    'border', 'border animation', 'animated border', 'glowing border', 'neon border',
    'рамка', 'анимированная рамка', 'светящаяся рамка', 'неоновая рамка',
  ],
  background: [
    'background', 'bg', 'backdrop', 'animated background', 'dynamic background',
    'фон', 'задний план', 'анимированный фон', 'динамический фон',
  ],

  // ═══════════════════════════════════════════════════════════════
  // REACT BITS EFFECTS (Animations, Backgrounds, Text)
  // ═══════════════════════════════════════════════════════════════
  cursor: [
    'cursor', 'cursor effect', 'mouse cursor', 'custom cursor', 'blob cursor', 'ghost cursor', 'splash cursor',
    'курсор', 'эффект курсора', 'кастомный курсор', 'следящий курсор',
  ],
  glitch: [
    'glitch', 'glitch effect', 'glitch text', 'distortion', 'noise', 'broken',
    'глитч', 'помехи', 'искажение', 'шум', 'сломанный эффект',
  ],
  aurora: [
    'aurora', 'northern lights', 'aurora borealis', 'color waves',
    'аврора', 'северное сияние', 'цветовые волны',
  ],
  galaxy: [
    'galaxy', 'space', 'cosmos', 'universe', 'stars background',
    'галактика', 'космос', 'вселенная', 'звёздный фон',
  ],
  plasma: [
    'plasma', 'liquid', 'fluid', 'organic', 'morphing',
    'плазма', 'жидкость', 'органический', 'морфинг',
  ],
  hyperspeed: [
    'hyperspeed', 'warp', 'speed lines', 'motion blur', 'fast',
    'гиперскорость', 'варп', 'линии скорости', 'быстрый',
  ],
  lightning: [
    'lightning', 'thunder', 'electric', 'bolt', 'storm',
    'молния', 'гром', 'электричество', 'шторм',
  ],
  magnet: [
    'magnet', 'magnetic', 'attract', 'pull', 'magnet effect',
    'магнит', 'магнитный', 'притяжение',
  ],
  pixel: [
    'pixel', 'pixelated', 'pixel art', 'retro', '8bit', 'pixel trail', 'pixel transition',
    'пиксель', 'пиксельный', 'ретро', '8бит',
  ],
  ribbon: [
    'ribbon', 'ribbons', 'flowing', 'silk', 'fabric',
    'лента', 'ленты', 'шёлк', 'ткань',
  ],
  metaball: [
    'metaball', 'metaballs', 'blob', 'organic shapes', 'lava lamp',
    'метаболы', 'блоб', 'органические формы', 'лава лампа',
  ],
  scramble: [
    'scramble', 'scrambled', 'shuffle', 'random text', 'decrypt',
    'перемешивание', 'случайный текст', 'расшифровка',
  ],
  counter: [
    'counter', 'count up', 'count down', 'number animation', 'odometer',
    'счётчик', 'отсчёт', 'анимация чисел',
  ],
  dock: [
    'dock', 'macos dock', 'taskbar', 'app dock', 'icon bar',
    'док', 'панель приложений', 'док-панель',
  ],
  masonry: [
    'masonry', 'pinterest', 'grid layout', 'waterfall', 'columns',
    'мэсонри', 'пинтерест', 'водопад', 'колонки',
  ],
  stack: [
    'stack', 'card stack', 'stacked', 'layered', 'pile',
    'стопка', 'стек карточек', 'слои',
  ],
  tilt: [
    'tilt', 'tilt effect', '3d tilt', 'perspective', 'rotate on hover',
    'наклон', '3д наклон', 'перспектива', 'поворот при наведении',
  ],
  fluid: [
    'fluid', 'liquid', 'water', 'flow', 'smooth',
    'жидкий', 'вода', 'поток', 'плавный',
  ],
  lanyard: [
    'lanyard', 'badge', 'id card', 'hanging', 'swing',
    'бейдж', 'карточка', 'висящий', 'качающийся',
  ],
  stepper: [
    'stepper', 'steps', 'wizard', 'progress steps', 'multi step',
    'степпер', 'шаги', 'мастер', 'пошаговый',
  ],

  // ═══════════════════════════════════════════════════════════════
  // THEMES & STYLES
  // ═══════════════════════════════════════════════════════════════
  dark: [
    'dark', 'dark mode', 'dark theme', 'night mode', 'black',
    'тёмный', 'темный', 'тёмная тема', 'ночной режим', 'чёрный',
  ],
  light: [
    'light', 'light mode', 'light theme', 'white', 'bright',
    'светлый', 'светлая тема', 'белый', 'яркий',
  ],
  modern: [
    'modern', 'contemporary', 'trendy', 'fresh', 'new',
    'современный', 'модерн', 'трендовый', 'свежий',
  ],
  minimal: [
    'minimal', 'minimalist', 'simple', 'clean', 'basic',
    'минимал', 'минималистичный', 'простой', 'чистый',
  ],
  elegant: [
    'elegant', 'luxury', 'premium', 'sophisticated', 'classy',
    'элегантный', 'люкс', 'премиум', 'изысканный', 'стильный',
  ],
  playful: [
    'playful', 'fun', 'colorful', 'vibrant', 'creative',
    'игривый', 'весёлый', 'красочный', 'яркий', 'креативный',
  ],
  corporate: [
    'corporate', 'business', 'professional', 'formal', 'enterprise',
    'корпоративный', 'бизнес', 'профессиональный', 'деловой',
  ],
};

// Extra aliases (simple EN/RU) for casual prompts
const EXTRA_KEYWORDS: Record<string, string[]> = {
  cursor: ['cursor', 'курсор', 'blob cursor', 'ghost cursor', 'splash cursor'],
  glitch: ['glitch', 'глитч', 'помехи', 'искажение', 'шум'],
  aurora: ['aurora', 'аврора', 'северное сияние'],
  galaxy: ['galaxy', 'космос', 'галактика', 'звёзды'],
  plasma: ['plasma', 'плазма', 'жидкость', 'морфинг'],
  hyperspeed: ['hyperspeed', 'гиперскорость', 'warp', 'скоростные линии'],
  lightning: ['lightning', 'молния', 'электричество', 'гром'],
  magnet: ['magnet', 'магнит', 'притяжение'],
  pixel: ['pixel', 'пиксель', 'ретро', '8bit', '8-бит'],
  ribbon: ['ribbon', 'лента', 'шелк', 'полоса'],
  metaball: ['metaball', 'метабол', 'blob', 'лава лампа'],
  scramble: ['scramble', 'перемешивание', 'расшифровка'],
  counter: ['counter', 'счётчик', 'таймер'],
  dock: ['dock', 'док', 'панель приложений'],
  masonry: ['masonry', 'пинтерест', 'водопад', 'водопадная сетка'],
  stack: ['stack', 'стопка', 'стек', 'колода'],
  tilt: ['tilt', 'наклон', 'перспектива'],
  fluid: ['fluid', 'жидкий', 'поток'],
  lanyard: ['lanyard', 'бейдж', 'карточка'],
  stepper: ['stepper', 'шаги', 'мастер'],
};

for (const [key, aliases] of Object.entries(EXTRA_KEYWORDS)) {
  if (!COMPONENT_KEYWORDS[key]) {
    COMPONENT_KEYWORDS[key] = [];
  }
  COMPONENT_KEYWORDS[key] = Array.from(new Set([...(COMPONENT_KEYWORDS[key] || []), ...aliases]));
}

// Industry/theme keywords
const THEME_KEYWORDS: Record<string, string[]> = {
  auto: ['авто', 'auto', 'car', 'машина', 'автомобиль', 'automotive', 'vehicle', 'транспорт'],
  tech: ['tech', 'технологии', 'it', 'software', 'софт', 'приложение', 'app', 'saas'],
  food: ['food', 'еда', 'ресторан', 'restaurant', 'cafe', 'кафе', 'доставка', 'delivery'],
  fashion: ['fashion', 'мода', 'одежда', 'clothes', 'style', 'стиль', 'магазин', 'shop'],
  health: ['health', 'здоровье', 'медицина', 'medical', 'fitness', 'фитнес', 'спорт', 'sport'],
  finance: ['finance', 'финансы', 'банк', 'bank', 'crypto', 'крипто', 'деньги', 'money'],
  education: ['education', 'образование', 'курсы', 'courses', 'обучение', 'learning'],
  photo: ['photo', 'фото', 'фотосессия', 'photography', 'photographer', 'фотограф', 'портфолио'],
};

// Aliases override when external file is present
let ALIAS_COMPONENT_KEYWORDS = COMPONENT_KEYWORDS;
let ALIAS_THEME_KEYWORDS = THEME_KEYWORDS;
try {
  const aliasPath = path.resolve(process.cwd(), 'Projects/bolt.diy/app/lib/services/component-aliases.json');
  if (fs.existsSync(aliasPath)) {
    const raw = fs.readFileSync(aliasPath, 'utf8');
    const parsed = JSON.parse(raw) as {
      componentKeywords?: Record<string, string[]>;
      themeKeywords?: Record<string, string[]>;
    };
    if (parsed.componentKeywords) {
      ALIAS_COMPONENT_KEYWORDS = parsed.componentKeywords;
    }
    if (parsed.themeKeywords) {
      ALIAS_THEME_KEYWORDS = parsed.themeKeywords;
    }
  }
} catch (error) {
  logger.warn('Failed to load component-aliases.json, using built-in keywords');
}

export class ComponentMatcher {
  private static _instance: ComponentMatcher;
  private _componentsIndex: Map<string, ComponentMatch[]> = new Map();
  private _loadedFiles: Set<string> = new Set();
  private _prebuilt: ComponentMeta[] | null = null;

  static getInstance(): ComponentMatcher {
    if (!ComponentMatcher._instance) {
      ComponentMatcher._instance = new ComponentMatcher();
    }
    return ComponentMatcher._instance;
  }

  async loadComponentsFromMD(mdFilePath: string): Promise<void> {
    // Skip if already loaded this file
    if (this._loadedFiles.has(mdFilePath)) return;

    try {
      // In server context, read the file
      if (typeof window === 'undefined') {
        const fullPath = path.resolve(process.cwd(), mdFilePath);
        const content = fs.readFileSync(fullPath, 'utf-8');
        this._parseComponents(content, mdFilePath);
        this._loadedFiles.add(mdFilePath);
        logger.info(`Loaded components from ${mdFilePath}`);
      }
    } catch (error) {
      logger.error(`Failed to load components from ${mdFilePath}:`, error);
    }
  }

  async loadAllComponentFiles(): Promise<void> {
    // Try prebuilt index first
    if (!this._prebuilt) {
      try {
        const idx = buildIndex(process.cwd(), true);
        this._prebuilt = idx.components;
        this._componentsIndex.clear();
        for (const meta of idx.components) {
          const cat = meta.category || 'other';
          if (!this._componentsIndex.has(cat)) this._componentsIndex.set(cat, []);
          this._componentsIndex.get(cat)!.push({
            name: meta.name,
            category: cat,
            description: meta.description,
            code: meta.code,
            relevance: 0,
          });
        }
        logger.info(`Loaded prebuilt component index: ${idx.total} items`);
        return;
      } catch (e) {
        logger.warn('Failed to load prebuilt index, fallback to MD parsing');
      }
    }

    // Load all component MD files
    const mdFiles = [
      'shadcnui-blocks.md',
      'aceternity-components.md',
      'kokonutui-components.md',
      'magicui-components.md',
      'reactbits-components.md',
    ];

    for (const file of mdFiles) {
      await this.loadComponentsFromMD(file);
    }

    const stats = this.getStats();
    logger.info(`Total loaded: ${stats.totalComponents} components in ${stats.categories} categories`);
  }

  private _parseComponents(content: string, source: string): void {
    const lines = content.split('\n');
    let currentCategory = source.replace('.md', '').toLowerCase(); // Default category from filename
    let currentComponent: Partial<ComponentMatch> | null = null;
    let codeBuffer: string[] = [];
    let inCodeBlock = false;

    for (const line of lines) {
      // Category header (## UI, ## Blocks, ## Components, ## sparkles-demo, etc.)
      if (line.startsWith('## ')) {
        currentCategory = line.replace('## ', '').split(' ')[0].toLowerCase();
        continue;
      }

      // Component header (### Component Name)
      if (line.startsWith('### ')) {
        // Save previous component
        if (currentComponent && currentComponent.name) {
          this._addComponent(currentComponent as ComponentMatch);
        }

        const match = line.match(/### (.+?) \((.+?)\)/);
        if (match) {
          currentComponent = {
            name: match[2],
            category: currentCategory,
            description: match[1],
            code: '',
            relevance: 0,
          };
        }
        codeBuffer = [];
        continue;
      }

      // Code block
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          if (currentComponent) {
            currentComponent.code = (currentComponent.code || '') + codeBuffer.join('\n') + '\n\n';
          }
          codeBuffer = [];
        }
        inCodeBlock = !inCodeBlock;
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
      }
    }

    // Save last component
    if (currentComponent && currentComponent.name) {
      this._addComponent(currentComponent as ComponentMatch);
    }
  }

  private _addComponent(component: ComponentMatch): void {
    const category = component.category || 'other';
    if (!this._componentsIndex.has(category)) {
      this._componentsIndex.set(category, []);
    }
    this._componentsIndex.get(category)!.push(component);
  }

  analyzeUserRequest(request: string): { components: string[]; theme: string | null } {
    const requestLower = request.toLowerCase();
    const matchedComponents: string[] = [];
    let matchedTheme: string | null = null;

    // Find matching component types
    for (const [componentType, keywords] of Object.entries(ALIAS_COMPONENT_KEYWORDS)) {
      for (const keyword of keywords) {
        if (requestLower.includes(keyword)) {
          if (!matchedComponents.includes(componentType)) {
            matchedComponents.push(componentType);
          }
          break;
        }
      }
    }

    // Find theme
    for (const [theme, keywords] of Object.entries(ALIAS_THEME_KEYWORDS)) {
      for (const keyword of keywords) {
        if (requestLower.includes(keyword)) {
          matchedTheme = theme;
          break;
        }
      }
      if (matchedTheme) break;
    }

    // Default components for landing page requests
    if (matchedComponents.length === 0 && 
        (requestLower.includes('сайт') || requestLower.includes('лендинг') || 
         requestLower.includes('landing') || requestLower.includes('страниц'))) {
      matchedComponents.push('hero', 'header', 'features', 'footer');
    }

    return { components: matchedComponents, theme: matchedTheme };
  }

  findMatchingComponents(componentTypes: string[], limit: number = 3): ComponentMatch[] {
    const results: ComponentMatch[] = [];

    for (const [category, components] of this._componentsIndex) {
      for (const component of components) {
        const nameLower = component.name.toLowerCase();
        const descLower = component.description.toLowerCase();

        for (const type of componentTypes) {
          const keywords = ALIAS_COMPONENT_KEYWORDS[type] || [type];

          for (const keyword of keywords) {
            if (nameLower.includes(keyword) || descLower.includes(keyword)) {
              component.relevance = 10;
              if (!results.find(r => r.name === component.name)) {
                results.push({ ...component });
              }
              break;
            }
          }
        }
      }
    }

    // Sort by relevance and limit
    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit * componentTypes.length);
  }

  generateContextForPrompt(request: string, maxComponents: number = 8): string {
    const { components: componentTypes, theme } = this.analyzeUserRequest(request);
    
    if (componentTypes.length === 0) {
      return '';
    }

    const matchedComponents = shuffleArray(this.findMatchingComponents(componentTypes, maxComponents));

    if (matchedComponents.length === 0) {
      return '';
    }

    const palette = randomChoice([
      'Light: white/gray with accent #6B4DFF',
      'Light: beige/stone with accent #FF7F50',
      'Dark: near-black with neon accent #7C3AED',
      'Dark: charcoal with accent #00E0FF',
    ]);
    const layout = randomChoice([
      'Grid 3x2 for services/cards',
      'Bento asymmetric layout',
      'Wide hero + two-column content',
    ]);

    let context = `
<matched_ui_components>
  ⚠️ IMPORTANT: Use these components as DIRECT REFERENCE for your implementation!
  
  User request analysis:
  - Theme: ${theme || 'general'}
  - Components needed: ${componentTypes.join(', ')}
  - Found ${matchedComponents.length} matching components
  - Palette suggestion: ${palette}
  - Layout suggestion: ${layout}
  
  INSTRUCTIONS:
  1. Study the code patterns below
  2. Adapt them to user's specific request
  3. Combine multiple components if needed
  4. Keep the animation/styling approach
  
`;

    for (const comp of matchedComponents.slice(0, maxComponents)) {
      const code =
        comp.code.length > MAX_CODE_LENGTH
          ? comp.code.substring(0, MAX_CODE_LENGTH) + '\n// ... code continues ...'
          : comp.code;

      context += `
  ═══════════════════════════════════════════════════════════════
  ${comp.description.toUpperCase()} (${comp.name})
  Category: ${comp.category}
  ═══════════════════════════════════════════════════════════════
  
${code}
  
`;
    }

    context += `</matched_ui_components>`;

    return context;
  }

  getStats(): { categories: number; totalComponents: number } {
    let total = 0;
    for (const components of this._componentsIndex.values()) {
      total += components.length;
    }
    return {
      categories: this._componentsIndex.size,
      totalComponents: total,
    };
  }
}

export const componentMatcher = ComponentMatcher.getInstance();
