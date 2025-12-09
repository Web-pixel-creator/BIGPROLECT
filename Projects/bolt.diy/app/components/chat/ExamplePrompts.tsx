import React from 'react';

// Простой список быстрых промптов без i18next
const QUICK_PROMPTS: string[] = [
  'IT-стартап (светлый): hero + CTA, преимущества, 3 тарифа, FAQ.',
  'SaaS (тёмный): hero с CTA, фичи, тарифы, отзывы, футер.',
  'Лендинг недвижимости: hero с фильтром, карта + карточки, преимущества, CTA.',
  'Портфолио дизайнера: hero + 2 CTA, кейсы (6), преимущества, контакты.',
  'Онлайн-курс: hero, программа (6), блок про автора, отзывы, CTA.',
  'Эком-магазин: hero, подборки товаров, преимущества доставки, отзывы, CTA.',
  'Ресторан/доставка: hero, меню + карточки (6), подборка недели, отзывы, бронирование.',
];

type ExamplePromptsProps = {
  onSelect?: (prompt: string) => void;
};

export function ExamplePrompts({ onSelect }: ExamplePromptsProps) {
  return (
    <div className="space-y-2 text-sm text-bolt-elements-textSecondary">
      <p className="text-xs uppercase text-bolt-elements-textSecondary/70">Быстрые промпты</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelect?.(prompt)}
            className="w-full text-left rounded-md border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 px-3 py-2 hover:border-bolt-elements-focus hover:text-bolt-elements-textPrimary transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
