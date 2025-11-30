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

// Keywords mapping for component matching
const COMPONENT_KEYWORDS: Record<string, string[]> = {
  // Headers & Navigation
  header: ['header', 'шапка', 'шапку', 'навигация', 'navbar', 'nav', 'menu', 'меню'],
  hero: ['hero', 'герой', 'главная секция', 'баннер', 'banner', 'landing', 'лендинг', 'первый экран'],
  navbar: ['navbar', 'navigation', 'nav', 'menu', 'меню', 'навигация'],
  
  // Content sections
  features: ['features', 'функции', 'возможности', 'преимущества', 'benefits', 'услуги', 'services'],
  pricing: ['pricing', 'цены', 'тарифы', 'plans', 'планы', 'стоимость'],
  testimonials: ['testimonials', 'отзывы', 'reviews', 'клиенты', 'customers'],
  team: ['team', 'команда', 'сотрудники', 'about us', 'о нас'],
  contact: ['contact', 'контакты', 'связь', 'форма', 'form'],
  footer: ['footer', 'подвал', 'футер'],
  
  // Cards & Containers
  card: ['card', 'карточка', 'карточки', 'блок', 'block'],
  gallery: ['gallery', 'галерея', 'фото', 'photo', 'images', 'изображения', 'портфолио', 'portfolio'],
  grid: ['grid', 'сетка', 'грид', 'layout', 'раскладка'],
  
  // Interactive
  carousel: ['carousel', 'карусель', 'слайдер', 'slider', 'swiper'],
  tabs: ['tabs', 'вкладки', 'табы'],
  accordion: ['accordion', 'аккордеон', 'faq', 'вопросы'],
  modal: ['modal', 'модальное', 'popup', 'попап', 'диалог', 'dialog'],
  
  // Forms
  form: ['form', 'форма', 'input', 'ввод', 'регистрация', 'signup', 'login', 'вход'],
  button: ['button', 'кнопка', 'кнопки', 'btn'],
  
  // Effects
  animation: ['animation', 'анимация', 'animated', 'анимированный', 'эффект', 'effect'],
  gradient: ['gradient', 'градиент', 'градиентный'],
  parallax: ['parallax', 'параллакс'],
  
  // Themes
  dark: ['dark', 'темный', 'темная', 'ночной'],
  modern: ['modern', 'современный', 'современная', 'модерн'],
  minimal: ['minimal', 'минимал', 'простой', 'чистый', 'clean'],
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
