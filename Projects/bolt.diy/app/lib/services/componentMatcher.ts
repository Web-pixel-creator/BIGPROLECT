import { createScopedLogger } from '~/utils/logger';
import * as fs from 'fs';
import * as path from 'path';

const logger = createScopedLogger('component-matcher');

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

export class ComponentMatcher {
  private static _instance: ComponentMatcher;
  private _componentsIndex: Map<string, ComponentMatch[]> = new Map();
  private _loadedFiles: Set<string> = new Set();

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
    // Load all component MD files
    const mdFiles = [
      'shadcnui-blocks.md',
      'aceternity-components.md',
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
    for (const [componentType, keywords] of Object.entries(COMPONENT_KEYWORDS)) {
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
    for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
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
          const keywords = COMPONENT_KEYWORDS[type] || [type];
          
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

  generateContextForPrompt(request: string, maxComponents: number = 5): string {
    const { components: componentTypes, theme } = this.analyzeUserRequest(request);
    
    if (componentTypes.length === 0) {
      return '';
    }

    const matchedComponents = this.findMatchingComponents(componentTypes, maxComponents);

    if (matchedComponents.length === 0) {
      return '';
    }

    let context = `
<matched_ui_components>
  Based on user request, here are relevant UI components you can use as reference:
  Theme detected: ${theme || 'general'}
  Components needed: ${componentTypes.join(', ')}
  
`;

    for (const comp of matchedComponents.slice(0, maxComponents)) {
      // Truncate code if too long
      const code = comp.code.length > 2000 
        ? comp.code.substring(0, 2000) + '\n// ... truncated ...'
        : comp.code;

      context += `
  --- ${comp.description} (${comp.name}) ---
  Category: ${comp.category}
  
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
