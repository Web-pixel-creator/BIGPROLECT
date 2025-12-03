# Улучшенная версия твоего промпта

## Твой оригинальный промпт:
```
Сделай мне красивый лендинг по строительсту домов. 
Шапку сделай с эффектом Plasma. 
Для блока сервисы добавь: Добавь Border Beam эффект (светящийся луч вдоль обводки) на карточки Features. 
Используй технику из Aceternity UI с offset-path. 
Цвета: orange → purple, скорость 12s.
```

## Проблема:
Модель пыталась импортировать `BorderBeam` компонент, который не существует.

---

## ✅ УЛУЧШЕННАЯ ВЕРСИЯ:

```
Создай лендинг для строительной компании с Vite + React + TypeScript:

ТЕХНОЛОГИИ:
- Vite + React + TypeScript
- Tailwind CSS
- Framer Motion (для анимаций)

ДИЗАЙН:
- Цвета: earth tones (коричневый, бежевый, зелёный)
- Стиль: modern, professional, trustworthy
- Типографика: clean sans-serif

СТРУКТУРА:

1. NAVIGATION
   - Logo слева
   - Меню: Услуги, Проекты, О нас, Контакты
   - Кнопка "Получить консультацию"
   - Fixed position, backdrop-blur

2. HERO SECTION
   - Plasma background эффект
   - Заголовок: "Строим дома вашей мечты"
   - Подзаголовок: "Более 15 лет опыта в строительстве"
   - 2 кнопки: "Наши проекты" и "Рассчитать стоимость"
   - Gradient text на заголовке

3. SERVICES SECTION (Наши услуги)
   - Заголовок: "Наши услуги"
   - 6 карточек услуг в grid (3x2)
   - Каждая карточка:
     * Иконка (lucide-react)
     * Название услуги
     * Краткое описание
     * Border Beam эффект (светящийся луч вдоль обводки)
   
   ⚠️ ВАЖНО ДЛЯ BORDER BEAM:
   - Используй УПРОЩЁННУЮ inline версию (без отдельного компонента)
   - Структура карточки:
     <div className="relative rounded-lg border border-gray-800 bg-black p-6 overflow-hidden">
       {/* Traveling beam */}
       <div className="absolute inset-0 rounded-[inherit] pointer-events-none">
         <div 
           className="absolute h-full w-[3px] animate-border-beam-travel"
           style={{
             background: 'linear-gradient(to bottom, transparent, #ff8800, #9c40ff, transparent)',
             boxShadow: '0 0 20px rgba(255, 136, 0, 0.8)',
           }}
         />
       </div>
       <div className="relative z-10">
         {/* Content */}
       </div>
     </div>
   
   - Добавь в tailwind.config.ts keyframes для border-beam-travel
   - Скорость: 12s
   - Цвета: orange (#ff8800) → purple (#9c40ff)

4. PROJECTS SECTION (Наши проекты)
   - Заголовок: "Реализованные проекты"
   - 3 проекта в grid
   - Каждый проект: фото, название, описание, кнопка "Подробнее"

5. ABOUT SECTION (О компании)
   - История компании
   - Ключевые цифры: 15+ лет, 200+ домов, 98% довольных клиентов
   - Animated counters

6. CTA SECTION
   - Заголовок: "Готовы начать строительство?"
   - Форма: имя, телефон, email
   - Кнопка "Получить консультацию"

7. FOOTER
   - Контакты
   - Социальные сети
   - Copyright

ОПТИМИЗАЦИЯ:
- requestAnimationFrame для анимаций
- Intersection Observer для lazy animations
- Debounce для scroll events

ЗАВИСИМОСТИ:
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

---

## Ключевые улучшения:

1. ✅ **Чёткая структура** - все секции описаны подробно
2. ✅ **Технологии указаны** - Vite, React, TypeScript
3. ✅ **Дизайн описан** - цвета, стиль, типографика
4. ✅ **Border Beam с инструкциями** - упрощённая inline версия без отдельного компонента
5. ✅ **Tailwind config упомянут** - keyframes для анимации
6. ✅ **Зависимости перечислены** - все нужные пакеты
7. ✅ **Оптимизация указана** - requestAnimationFrame, Intersection Observer

---

## Альтернативная короткая версия:

```
Создай лендинг для строительной компании:

HERO:
- Plasma background
- Заголовок с gradient text
- 2 CTA кнопки

SERVICES (6 карточек):
- Border Beam эффект (упрощённая inline версия)
- Луч света движется по обводке
- Цвета: orange → purple, 12s
- Используй inline div с animate-border-beam-travel
- Добавь keyframes в tailwind.config.ts

ДРУГИЕ СЕКЦИИ:
- Projects (3 проекта)
- About (история + статистика)
- CTA (форма)
- Footer

ТЕХНОЛОГИИ:
Vite + React + TypeScript + Tailwind + Framer Motion
```

---

**Дата:** 2 декабря 2024
