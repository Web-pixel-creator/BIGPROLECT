# 🎯 План действий: Превращение Bolt.diy в AI Website Builder

## Текущее состояние ✅

Что уже сделано:
- ✅ 582 компонента загружены (Aceternity, Magic UI, Kokonut, shadcn, React Bits)
- ✅ Component Matcher работает (находит компоненты по ключевым словам)
- ✅ Системный промпт улучшен (инструкции по использованию компонентов)
- ✅ Bolt.diy генерирует сайты

**Проблема:** Требует технических знаний от пользователя

---

## Что нужно добавить 🚀

### ПРИОРИТЕТ 1: Простой интерфейс для клиентов

#### 1.1 Форма брифа (вместо технического промпта)

**Файл:** `app/components/BriefForm.tsx`

```tsx
export function BriefForm() {
  const [brief, setBrief] = useState({
    type: '',
    theme: '',
    colors: [],
    style: '',
    screenshots: [],
    wishes: ''
  });

  const handleSubmit = async () => {
    // Отправляем бриф на обработку
    const technicalPrompt = await generatePromptFromBrief(brief);
    // Передаём в Bolt.diy
    startGeneration(technicalPrompt);
  };

  return (
    <div className="brief-form">
      <h2>Создайте свой сайт за 5 минут</h2>
      
      {/* Тип сайта */}
      <select onChange={e => setBrief({...brief, type: e.target.value})}>
        <option value="">Выберите тип сайта</option>
        <option value="landing">Лендинг</option>
        <option value="corporate">Корпоративный сайт</option>
        <option value="ecommerce">Интернет-магазин</option>
        <option value="portfolio">Портфолио</option>
        <option value="blog">Блог</option>
      </select>

      {/* Тематика */}
      <input
        placeholder="Тематика (например: строительство домов)"
        onChange={e => setBrief({...brief, theme: e.target.value})}
      />

      {/* Цвета */}
      <ColorPicker
        onChange={colors => setBrief({...brief, colors})}
      />

      {/* Стиль */}
      <div className="style-selector">
        <button onClick={() => setBrief({...brief, style: 'modern'})}>
          Современный
        </button>
        <button onClick={() => setBrief({...brief, style: 'minimal'})}>
          Минималистичный
        </button>
        <button onClick={() => setBrief({...brief, style: 'creative'})}>
          Яркий и креативный
        </button>
        <button onClick={() => setBrief({...brief, style: 'professional'})}>
          Строгий и профессиональный
        </button>
      </div>

      {/* Загрузка скриншотов */}
      <ImageUpload
        multiple
        onChange={screenshots => setBrief({...brief, screenshots})}
      />

      {/* Дополнительные пожелания */}
      <textarea
        placeholder="Дополнительные пожелания (необязательно)"
        onChange={e => setBrief({...brief, wishes: e.target.value})}
      />

      <button onClick={handleSubmit}>
        🚀 Создать сайт
      </button>
    </div>
  );
}
```

**Где добавить:** В `app/routes/_index.tsx` - показывать форму вместо чата

---

#### 1.2 Анализ скриншотов (Vision API)

**Файл:** `app/lib/services/screenshotAnalyzer.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

export class ScreenshotAnalyzer {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async analyze(images: File[]): Promise<ScreenshotAnalysis> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    // Конвертируем изображения в base64
    const imageParts = await Promise.all(
      images.map(async (img) => ({
        inlineData: {
          data: await this.fileToBase64(img),
          mimeType: img.type
        }
      }))
    );

    const prompt = `Analyze these website screenshots and extract:
    1. Layout structure (what sections are there, how are they arranged)
    2. Color palette (main colors used)
    3. Typography style (font style, sizes)
    4. Component types (hero, cards, forms, navigation, etc)
    5. Animation style (if visible)
    6. Overall design style (modern, minimal, creative, professional)
    
    Return as JSON with keys: layout, colors, typography, components, animations, style`;

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    // Парсим JSON ответ
    return JSON.parse(text);
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
```

**API:** Используй Gemini Pro Vision (Google) - бесплатно до 60 запросов/минуту

---

#### 1.3 Генератор технического промпта

**Файл:** `app/lib/services/promptGenerator.ts`

```typescript
export class PromptGenerator {
  generate(brief: Brief, screenshotAnalysis: ScreenshotAnalysis): string {
    // Генерируем seed для уникальности
    const seed = Date.now() + Math.random();
    
    // Подбираем компоненты
    const layout = this.generateLayout(brief, screenshotAnalysis, seed);
    const components = this.selectComponents(layout, seed);
    
    // Создаём технический промпт
    return `
Создай ${this.translateType(brief.type)} для ${brief.theme} с Vite + React + TypeScript:

ДИЗАЙН:
- Цвета: ${brief.colors.join(', ')}
- Стиль: ${brief.style}
- Типографика: ${screenshotAnalysis.typography}
- Вдохновение: ${screenshotAnalysis.style}

СТРУКТУРА (на основе загруженных примеров):
${layout.map((section, i) => `
${i + 1}. ${section.name} Section
   - Layout: ${section.layout}
   - Эффекты: ${section.effects.join(', ')}
   - Компонент: ${components[i].name}
   
   ${this.includeComponentCode(components[i])}
`).join('\n')}

ДОПОЛНИТЕЛЬНО:
${brief.wishes}

ТЕХНОЛОГИИ:
- Vite + React + TypeScript
- Tailwind CSS
- Framer Motion (для анимаций)
- Lucide React (для иконок)

ОПТИМИЗАЦИЯ:
- requestAnimationFrame для анимаций
- Intersection Observer для lazy loading
- Responsive design (mobile-first)

УНИКАЛЬНОСТЬ (seed: ${seed}):
Используй вариации компонентов для создания уникального дизайна.
`;
  }

  private translateType(type: string): string {
    const translations = {
      'landing': 'лендинг',
      'corporate': 'корпоративный сайт',
      'ecommerce': 'интернет-магазин',
      'portfolio': 'портфолио',
      'blog': 'блог'
    };
    return translations[type] || type;
  }

  private generateLayout(brief: Brief, analysis: ScreenshotAnalysis, seed: number) {
    // Генерируем уникальный layout на основе seed
    const random = seededRandom(seed);
    
    // Базовые секции
    const sections = ['hero', 'services', 'about', 'projects', 'testimonials', 'contact', 'footer'];
    
    // Перемешиваем (кроме hero и footer - они всегда первый и последний)
    const middle = sections.slice(1, -1);
    const shuffled = random.shuffle(middle);
    
    return [
      sections[0], // hero
      ...shuffled,
      sections[sections.length - 1] // footer
    ].map(name => ({
      name,
      layout: this.selectLayout(name, analysis, seed),
      effects: this.selectEffects(seed)
    }));
  }

  private selectComponents(layout, seed: number) {
    // Подбираем компоненты из 582 доступных
    return layout.map(section => {
      const matches = componentMatcher.findMatchingComponents([section.name], 5);
      const random = seededRandom(seed + section.name.length);
      return random.choice(matches);
    });
  }
}
```

---

### ПРИОРИТЕТ 2: Вариативность компонентов

#### 2.1 Добавить варианты для каждого компонента

**Текущая проблема:** Один компонент = один вариант

**Решение:** Создать систему вариантов

**Файл:** `app/lib/services/componentVariants.ts`

```typescript
export const COMPONENT_VARIANTS = {
  'hero': [
    {
      id: 'hero-centered',
      name: 'Hero Centered',
      description: 'Текст по центру, фон изображение',
      code: `...`
    },
    {
      id: 'hero-split',
      name: 'Hero Split',
      description: 'Разделённый экран 50/50',
      code: `...`
    },
    {
      id: 'hero-video',
      name: 'Hero Video Background',
      description: 'Фон видео, текст слева',
      code: `...`
    },
    // ... ещё 17 вариантов
  ],
  'service-cards': [
    {
      id: 'cards-grid-3',
      name: 'Grid 3 Columns',
      description: '3 колонки, hover lift',
      code: `...`
    },
    {
      id: 'cards-staggered',
      name: 'Staggered Layout',
      description: 'Смещённые карточки',
      code: `...`
    },
    // ... ещё 13 вариантов
  ],
  // ... для всех типов компонентов
};
```

#### 2.2 Seeded Random для воспроизводимости

```typescript
// app/lib/utils/seededRandom.ts
export function seededRandom(seed: number) {
  let state = seed;
  
  const next = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };

  return {
    random: () => next(),
    choice: <T>(arr: T[]): T => arr[Math.floor(next() * arr.length)],
    shuffle: <T>(arr: T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    },
    sample: <T>(arr: T[], n: number): T[] => {
      const shuffled = this.shuffle(arr);
      return shuffled.slice(0, n);
    }
  };
}
```

---

### ПРИОРИТЕТ 3: Интеграция всего вместе

#### 3.1 Обновить главную страницу

**Файл:** `app/routes/_index.tsx`

```tsx
export default function Index() {
  const [mode, setMode] = useState<'brief' | 'chat'>('brief');

  return (
    <div>
      {/* Переключатель режимов */}
      <div className="mode-switcher">
        <button onClick={() => setMode('brief')}>
          Простой режим (для клиентов)
        </button>
        <button onClick={() => setMode('chat')}>
          Продвинутый режим (для разработчиков)
        </button>
      </div>

      {/* Показываем нужный интерфейс */}
      {mode === 'brief' ? (
        <BriefForm onSubmit={handleBriefSubmit} />
      ) : (
        <BaseChat /> // Существующий чат
      )}
    </div>
  );
}

async function handleBriefSubmit(brief: Brief) {
  // 1. Анализируем скриншоты
  const screenshotAnalysis = await screenshotAnalyzer.analyze(brief.screenshots);
  
  // 2. Генерируем технический промпт
  const technicalPrompt = promptGenerator.generate(brief, screenshotAnalysis);
  
  // 3. Отправляем в Bolt.diy для генерации
  await startGeneration(technicalPrompt);
}
```

---

## 📊 Roadmap

### Неделя 1: MVP
- [ ] Создать BriefForm компонент
- [ ] Добавить ScreenshotAnalyzer (Gemini Vision)
- [ ] Создать PromptGenerator
- [ ] Интегрировать с Bolt.diy
- [ ] Тестирование на 10 разных брифах

### Неделя 2: Вариативность
- [ ] Добавить 20+ вариантов Hero
- [ ] Добавить 15+ вариантов Service Cards
- [ ] Добавить 10+ вариантов для других секций
- [ ] Реализовать seeded random
- [ ] Тестирование: 100 брифов = 100 разных сайтов

### Неделя 3: Улучшения
- [ ] Улучшить анализ скриншотов (детальнее)
- [ ] Добавить предпросмотр вариантов
- [ ] Добавить возможность редактирования
- [ ] Оптимизация производительности

### Неделя 4: Запуск
- [ ] Beta тестирование с реальными клиентами
- [ ] Сбор feedback
- [ ] Исправление багов
- [ ] Публичный запуск

---

## 💰 Монетизация

### Бесплатный план:
- 3 сайта в месяц
- Базовые компоненты
- Watermark "Made with [YourProduct]"

### Pro план ($29/месяц):
- Unlimited сайты
- Все 582 компонента
- Без watermark
- Экспорт кода
- Приоритетная поддержка

### Enterprise ($299/месяц):
- Всё из Pro
- White-label
- Custom компоненты
- API доступ
- Dedicated support

---

## 🎯 Метрики успеха

### Через 1 месяц:
- 100 пользователей
- 500 сгенерированных сайтов
- 80% уникальность (не похожи друг на друга)
- 4.5+ рейтинг

### Через 3 месяца:
- 1000 пользователей
- 10,000 сайтов
- 50 платных подписок
- $1,500 MRR

### Через 6 месяцев:
- 10,000 пользователей
- 100,000 сайтов
- 500 платных подписок
- $15,000 MRR

---

**Следующий шаг:** Начни с создания BriefForm компонента!

**Дата:** 2 декабря 2024
