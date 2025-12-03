# Руководство по анимированным градиентным бордерам

## Проблема
Когда просишь "добавь градиент анимацию вокруг бордеров", модель просто меняет цвет фона вместо создания анимированной обводки.

## Решение
Используй более конкретные промпты с техническими деталями.

---

## 🎨 ДВА ТИПА АНИМИРОВАННЫХ БОРДЕРОВ

### ⚠️ ВАЖНО: Есть ДВА разных эффекта!

### Тип 1: ROTATING GRADIENT (Вращающийся градиент)
Градиент вращается вокруг всей обводки.

**Примеры:**
- Stripe pricing cards
- Linear feature cards
- Vercel dashboard cards

### Тип 2: BORDER BEAM (Светящийся луч)
Луч света путешествует по периметру обводки.

**Примеры:**
- Aceternity UI glowing effect
- Magic UI border beam
- 21st.dev components

**На твоём скриншоте - это Тип 2 (Border Beam)!**

---

## ✅ ПРАВИЛЬНЫЕ ПРОМПТЫ

### ДЛЯ ТИПА 1 (Rotating Gradient):

```
Добавь анимированную градиентную обводку на карточки в Features секции:
- Обводка: gradient от purple через pink к cyan
- Анимация: градиент вращается вокруг карточки
- Trigger: появляется на hover
- Скорость: 3 секунды на полный оборот
- Используй технику с pseudo-element
```

### ДЛЯ ТИПА 2 (Border Beam - как на скриншоте):

```
Добавь Border Beam эффект на карточки в Features секции:
- Светящийся луч путешествует по периметру обводки
- Цвета: от orange (#ffaa40) к purple (#9c40ff)
- Скорость: 12 секунд на полный круг
- Используй BorderBeam компонент из Aceternity UI
- Добавь keyframes для border-beam анимации
```

```
Добавь glowing effect как в Aceternity UI на feature cards:
- Луч света движется вдоль border
- Gradient: gold → purple → transparent
- Duration: 15 секунд
- Delay: разный для каждой карточки (0s, 3s, 6s)
- Используй CSS offset-path для движения по периметру
```

### Вариант 2: С техническими деталями

```
Добавь rotating gradient border на feature cards:

ТЕХНИКА:
- Используй relative wrapper с padding
- Внутри: absolute pseudo-element с gradient background
- Анимация: background-position меняется от 0% до 100%
- Content: relative с black background

ГРАДИЕНТ:
- from-purple-600 via-pink-600 to-cyan-600
- bg-[length:200%_200%]

АНИМАЦИЯ:
- Keyframes: gradient-rotate
- Duration: 3s
- Timing: linear infinite
- Hover: ускоряется до 1s
```

### Вариант 3: Максимально подробный

```
Обнови Features секцию - добавь анимированные градиентные бордеры:

СТРУКТУРА КАРТОЧКИ:
<div className="relative group">
  {/* Animated gradient border */}
  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-gradient-rotate"></div>
  
  {/* Content */}
  <div className="relative bg-black rounded-lg p-6">
    {/* Existing content */}
  </div>
</div>

TAILWIND CONFIG:
Добавь в tailwind.config.js:
- animation: 'gradient-rotate': 'gradient-rotate 3s linear infinite'
- keyframes: gradient-rotate с background-position от 0% до 100%

ЭФФЕКТ:
- По умолчанию: opacity 75%, blur
- На hover: opacity 100%, без blur
- Smooth transition
```

---

## ❌ НЕПРАВИЛЬНЫЕ ПРОМПТЫ

### Плохой #1: Слишком общий
```
Добавь градиент на бордеры
```
**Проблема:** Непонятно что именно - статичный или анимированный

### Плохой #2: Неточная формулировка
```
Сделай бордеры красивыми с градиентом
```
**Проблема:** "Красивыми" - субъективно, нет деталей

### Плохой #3: Без технических деталей
```
Добавь анимацию на бордеры
```
**Проблема:** Какую анимацию? Градиент? Glow? Pulse?

---

## 🛠️ ТЕХНИКИ РЕАЛИЗАЦИИ

## ТИП 1: ROTATING GRADIENT

### Техника 1: Pseudo-element с blur (Рекомендуется)

```jsx
<div className="relative group">
  {/* Gradient border with blur */}
  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-gradient-rotate"></div>
  
  {/* Content */}
  <div className="relative bg-black rounded-lg p-6">
    <h3>Feature Title</h3>
    <p>Description</p>
  </div>
</div>
```

**Плюсы:**
- Красивый glow эффект
- Smooth transitions
- Работает на всех браузерах

**Минусы:**
- Требует blur (может быть медленным на слабых устройствах)

---

### Техника 2: Padding wrapper (Более производительная)

```jsx
<div className="relative p-[2px] rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-[length:200%_200%] animate-gradient-xy">
  <div className="bg-black rounded-lg p-6">
    <h3>Feature Title</h3>
    <p>Description</p>
  </div>
</div>
```

**Плюсы:**
- Более производительная (нет blur)
- Чёткая обводка
- Проще в реализации

**Минусы:**
- Нет glow эффекта
- Менее "wow" фактор

---

### Техника 3: Только на hover (Самая простая)

```jsx
<div className="relative p-[1px] rounded-lg bg-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 transition-all duration-300">
  <div className="bg-black rounded-lg p-6">
    <h3>Feature Title</h3>
    <p>Description</p>
  </div>
</div>
```

**Плюсы:**
- Очень простая
- Быстрая
- Не требует keyframes

**Минусы:**
- Нет анимации вращения
- Только статичный градиент на hover

---

## ТИП 2: BORDER BEAM (Traveling Light)

### Техника 1: Border Beam Component (Как в Aceternity UI)

```tsx
// BorderBeam.tsx
interface BorderBeamProps {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
}

export function BorderBeam({
  size = 200,
  duration = 15,
  delay = 0,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
}: BorderBeamProps) {
  return (
    <div
      style={{
        "--size": size,
        "--duration": duration,
        "--delay": delay,
        "--color-from": colorFrom,
        "--color-to": colorTo,
      } as React.CSSProperties}
      className="absolute inset-0 rounded-[inherit] [border:calc(var(--size)*1px)_solid_transparent] ![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)] after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--size)*-1px)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]"
    />
  );
}
```

**Использование:**
```tsx
<div className="relative rounded-lg border border-gray-800 bg-black p-6">
  <BorderBeam size={250} duration={12} delay={9} />
  <h3>Your Content</h3>
  <p>The beam travels around the border</p>
</div>
```

**Плюсы:**
- Точно как в Aceternity UI
- Настраиваемые цвета и скорость
- Smooth animation
- Можно добавить delay

**Минусы:**
- Сложная реализация
- Требует CSS custom properties
- Может не работать в старых браузерах

---

### Техника 2: Simplified Border Beam (CSS-only)

```tsx
<div className="relative rounded-lg border border-gray-800 bg-black p-6 overflow-hidden">
  {/* Border beam */}
  <div className="absolute inset-0 rounded-[inherit] pointer-events-none">
    <div className="absolute h-full w-[2px] bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-border-beam-travel" />
  </div>
  
  <h3 className="relative z-10">Your Content</h3>
</div>
```

**Tailwind config:**
```js
animation: {
  'border-beam-travel': 'border-beam-travel 4s linear infinite',
},
keyframes: {
  'border-beam-travel': {
    '0%': { 
      transform: 'translateX(0) translateY(0)',
      opacity: '0'
    },
    '5%': { opacity: '1' },
    '25%': { 
      transform: 'translateX(calc(100% - 2px)) translateY(0)',
      opacity: '1'
    },
    '30%': { opacity: '0' },
    '45%': { opacity: '0' },
    '50%': { 
      transform: 'translateX(calc(100% - 2px)) translateY(100%)',
      opacity: '1'
    },
    '55%': { opacity: '0' },
    '70%': { opacity: '0' },
    '75%': { 
      transform: 'translateX(0) translateY(100%)',
      opacity: '1'
    },
    '80%': { opacity: '0' },
    '95%': { opacity: '0' },
    '100%': { 
      transform: 'translateX(0) translateY(0)',
      opacity: '0'
    },
  },
},
```

**Плюсы:**
- Проще в реализации
- Понятный код
- Легко настроить

**Минусы:**
- Менее плавная анимация
- Видны "углы" где луч поворачивает

---

## ⚙️ TAILWIND CONFIG

Добавь в `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      animation: {
        'gradient-rotate': 'gradient-rotate 3s linear infinite',
        'gradient-xy': 'gradient-xy 3s ease infinite',
        'gradient-xy-fast': 'gradient-xy 1s ease infinite',
      },
      keyframes: {
        'gradient-rotate': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
      },
    },
  },
}
```

---

## 🎯 ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ

### Пример 1: Feature Cards

```
Обнови Features секцию:

КАЖДАЯ КАРТОЧКА:
- Добавь анимированный gradient border
- Gradient: purple → pink → cyan
- Анимация: вращается 3 секунды
- На hover: ускоряется до 1 секунды + opacity 100%
- Используй технику с pseudo-element и blur

СТРУКТУРА:
- Wrapper: relative group
- Border: absolute -inset-0.5 с gradient и blur
- Content: relative с black background
```

### Пример 2: Pricing Cards

```
Добавь gradient borders на pricing cards:

ТОЛЬКО НА "PRO" ТАРИФ:
- Animated gradient border (всегда видимый)
- Gradient: gold → orange → red
- Rotation: 4 секунды
- Glow effect с blur
- Badge "Most Popular" сверху

ДРУГИЕ ТАРИФЫ:
- Статичный gray border
- На hover: появляется gradient border
```

### Пример 3: CTA Button

```
Обнови CTA кнопку:

ЭФФЕКТ:
- Animated gradient border вокруг кнопки
- Gradient: cyan → blue → purple
- Fast rotation: 2 секунды
- Pulse effect на hover
- Glow увеличивается

СТРУКТУРА:
- Wrapper с gradient border
- Button внутри с black background
- Text с gradient
```

---

## 🔍 ОТЛАДКА

### Проблема: Градиент не анимируется

**Причина:** Не добавлены keyframes в tailwind.config.js

**Решение:**
```
Добавь в tailwind.config.js keyframes для gradient-rotate анимации
```

### Проблема: Обводка слишком толстая

**Причина:** Неправильный padding

**Решение:**
```
Измени padding с p-[2px] на p-[1px] для более тонкой обводки
```

### Проблема: Градиент не виден

**Причина:** Content перекрывает border

**Решение:**
```
Убедись что content имеет relative position и background-color
```

### Проблема: Анимация лагает

**Причина:** Blur слишком сильный

**Решение:**
```
Уменьши blur или используй технику без blur (padding wrapper)
```

---

## 📝 ШАБЛОН ПРОМПТА

```
Добавь анимированные градиентные бордеры на [элементы]:

ТЕХНИКА:
- [Выбери: pseudo-element / padding wrapper / hover only]

ГРАДИЕНТ:
- Цвета: [from] → [via] → [to]
- Направление: [to-r / to-br / etc]

АНИМАЦИЯ:
- Тип: [rotate / pulse / glow]
- Скорость: [X секунд]
- Trigger: [always / hover / focus]

ЭФФЕКТЫ:
- Blur: [да/нет]
- Opacity: [значение]
- Transition: [duration]
```

---

## ✅ ЧЕКЛИСТ

Перед отправкой промпта проверь:

- [ ] Указано на какие элементы добавить (cards, buttons, etc)
- [ ] Описана техника реализации (pseudo-element / padding)
- [ ] Указаны цвета градиента
- [ ] Описана анимация (скорость, тип)
- [ ] Указан trigger (hover / always)
- [ ] Упомянуты дополнительные эффекты (blur, glow)

---

**Дата:** 2 декабря 2024  
**Версия:** 1.0.0
