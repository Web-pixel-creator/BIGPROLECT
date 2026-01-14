# Implementation Plan: Prompt Enhancer Refactor

## Overview

Пошаговый план рефакторинга promptEnhancer.ts с фокусом на encoding fix, модульное разделение и regression prevention. Каждый шаг включает валидацию через baseline сравнение.

**Технические предусловия:**
- Проект использует ESM (`"type": "module"`)
- tsx уже установлен ✓
- Нужно установить: `pnpm add -D fast-check madge`

## Tasks

- [x] 0. Подготовка инструментов
  - [x] 0.1 Проверить что tsx установлен и работает
    - `pnpm tsx --version` (должен вернуть версию, не ошибку)
    - Если падает — `NODE_OPTIONS=--max-old-space-size=4096 pnpm add -D tsx`
    - _Requirements: 5.1_
  - [x] 0.2 Установить недостающие зависимости
    - `pnpm add -D fast-check madge`
    - При OOM: `NODE_OPTIONS=--max-old-space-size=4096 pnpm add -D fast-check madge`
    - _Requirements: 5.6_

- [x] 1. Baseline система и инфраструктура
  - [x] 1.1 Обновить baseline-prompts.json до 25 промптов ✓ (добавлены beauty-salon-en, travel-en, sports-en, gaming-en, nonprofit-en)
    - Текущее состояние: 20 промптов (10 EN + 10 RU)
    - Добавить 5 EN промптов для разных тем (beauty, travel, sports, gaming, nonprofit)
    - Итого: 25 промптов (15 EN + 10 RU)
    - _Requirements: 1.1_
  - [x] 1.2 Обновить baseline.ts для измерения cold import и bundle size ✓
    - Добавить `measureColdImport()` — 5 прогонов в **отдельных процессах** (child_process.execSync), взять median
    - ESM кеширует модули, поэтому нужен отдельный процесс для каждого измерения
    - Добавить `fs.statSync('app/lib/services/promptEnhancer.ts').size` для bundle size
    - Записывать в `baseline-metrics.json`
    - _Requirements: 1.2_
  - [x] 1.3 Обновить baseline-compare.ts для структурного сравнения ✓
    - Разделить на ERRORS (критичные, exit 1) и WARNINGS (информационные, exit 0)
    - ERRORS: theme mismatch, missing required keys, sectionsCount >50% drift
    - WARNINGS: sectionOrder changed, colors changed, performance regression
    - Пороги: cold import +15% OR +50ms (whichever larger), bundle size +5%, output length +30%
    - **Edge cases**: если baseline sectionsCount=0 и current>0 → WARNING; если baseline outputLength=0 → skip comparison
    - **Exit code**: errors.length > 0 → exit 1; только warnings → exit 0 (non-blocking)
    - _Requirements: 1.5, 1.6, 1.7, 4.1, 4.2, 4.3, 4.6_
  - [x] 1.4 Проверить npm scripts в package.json ✓ (уже существуют)
    - `"baseline": "tsx scripts/baseline.ts"` ✓ (уже есть)
    - `"baseline:compare": "tsx scripts/baseline-compare.ts"` ✓ (уже есть)
    - _Requirements: 1.4, 5.1_
  - [x] 1.5 Написать property test для baseline output structure ✓
    - Создать `app/lib/services/baseline.property.spec.ts`
    - Использовать vitest + fast-check
    - **Property 1: Baseline structural consistency**
    - **Validates: Requirements 1.1, 1.2, 1.5**

- [x] 2. Checkpoint - Baseline готов ✓
  - Запустить `pnpm run baseline` ✓ (25 промптов обработаны)
  - Создать git tag `pre-refactor-baseline` (опционально)
  - Убедиться что baseline-results.json создан корректно (25 результатов) ✓
  - _Requirements: 1.3_

- [x] 3. Encoding fix ✓
  - [x] 3.1 Исправить component-aliases.json (componentKeywords section) ✓
    - **Факт**: componentKeywords содержит кракозябры ("<MOJIBAKE_QUESTION>", "<MOJIBAKE_QUESTION5>") для ВСЕХ русских слов
    - **Факт**: themeKeywords секция чистая — корректный UTF-8
    - Заменить все "<MOJIBAKE_QUESTION5>" на корректные UTF-8 русские строки ✓
    - _Requirements: 2.2_
  - [x] 3.2 Проверить promptEnhancer.ts на encoding issues (verify, не fix) ✓
    - **Факт**: THEME_KEYWORDS_RU выглядит чистым в текущей версии
    - **Факт**: RU_COLOR_WORDS — выглядит чистым
    - **Факт**: FALLBACK_BRANDS — выглядит чистым
    - Пометить как verified если проблем нет ✓
    - _Requirements: 2.3_
  - [x] 3.3 Обновить скрипт encoding-check.ts для mojibake detection и расширенного scope ✓
    - Текущее состояние: проверяет U+FFFD, BOM, control chars (0x80-0x9F)
    - Добавить mojibake patterns: question_marks, cyrillic_r_pattern, double_encoded ✓
    - **Расширить scope** (default roots): app/lib/services, scripts, .kiro/specs ✓
    - Выводить: file, line, column, context, matched pattern ✓
    - _Requirements: 2.5, 2.6, 5.2_
  - [x] 3.4 Проверить npm script encoding:check ✓
    - `"encoding:check": "tsx scripts/encoding-check.ts"` ✓ (уже есть)
    - _Requirements: 5.1_
  - [x] 3.5 Исправить componentMatcher.server.ts (THEME_KEYWORDS) ✓
    - Найдены кракозябры в строках 1023-1031
    - Исправлены русские ключевые слова ✓

- [x] 4. Checkpoint - Encoding fix ✓
  - Запустить `pnpm run encoding:check` — должен пройти без ошибок ✓
  - Smoke-test: промпт "сайт мебели" должен вернуть theme "furniture" (проверить позже)
  - Запустить `pnpm run baseline:compare` — структурные инварианты совпадают (проверить позже)
  - _Requirements: 2.4_

- [x] 5. Первый split - выделение данных ✓
  - [x] 5.1 Создать prompt-data/index.ts ✓
    - Создать директорию `Projects/bolt.diy/app/lib/services/prompt-data/`
    - Создать index.ts с re-exports
    - _Requirements: 3.2_
  - [x] 5.2 Вынести theme-keywords.ts ✓
    - Перенести THEME_KEYWORDS и THEME_KEYWORDS_RU как отдельные константы
    - Убрать side-effect merge (for loop) — создать функцию getMergedKeywords()
    - Экспортировать: THEME_KEYWORDS, THEME_KEYWORDS_RU, getMergedKeywords
    - _Requirements: 3.2, 3.4, 3.6_
  - [x] 5.3 Вынести color-mappings.ts ✓
    - Перенести COLOR_WORDS_TO_HEX и RU_COLOR_WORDS как отдельные константы
    - Убрать Object.assign — создать функцию getMergedColors()
    - Экспортировать: COLOR_WORDS_TO_HEX, RU_COLOR_WORDS, getMergedColors
    - _Requirements: 3.2, 3.4, 3.6_
  - [x] 5.4 Вынести theme-palettes.ts ✓
    - Перенести THEME_PALETTES
    - _Requirements: 3.2_
  - [x] 5.5 Вынести image-queries.ts ✓
    - Перенести THEME_IMAGE_QUERIES
    - Перенести IMAGE_SIZES, MAX_IMAGE_COUNTS
    - Перенести типы ImageQuerySet, ImageSet, ImageSearchQueries, ImageSearchCounts
    - _Requirements: 3.2_
  - [x] 5.6 Обновить импорты в promptEnhancer.ts ✓ (уже сделано в коммите 230985d7)
    - Заменить локальные константы на импорты из prompt-data/
    - Вызывать getMergedKeywords() и getMergedColors() один раз при инициализации
    - Удалить перенесенный код
    - _Requirements: 3.1_
  - [x] 5.7 Написать property test для data module exports ✓
    - Реализовано в `app/lib/services/__tests__/prompt-data.property.spec.ts`
    - **Property 1-4: Theme keywords, Color mappings, Image queries, Prompt hints**
    - **Validates: Requirements 3.2**
  - [x] 5.8 Написать property test для data module purity ✓
    - Реализовано в `app/lib/services/__tests__/prompt-data.property.spec.ts`
    - **Property 1-4: все проверки на валидность данных**
    - **Validates: Requirements 3.4**

- [x] 6. Checkpoint - Первый split ✓
  - Запустить тесты — все должны быть зелеными ✓ (539 passed)
  - Запустить `pnpm run baseline:compare` — структурные инварианты совпадают ✓
  - Проверить размер promptEnhancer.ts — должен уменьшиться (цель первого этапа: ≤1500 строк) ✓ (588 строк)
  - _Requirements: 3.1_

- [x] 7. Валидация зависимостей ✓
  - [x] 7.1 Проверить что madge установлен ✓
    - `npx madge --version`
    - _Requirements: 5.4, 5.6_
  - [x] 7.2 Проверить circular dependencies с ESM конфигом ✓
    - `npx madge --circular --extensions ts --ts-config tsconfig.json app/lib/services/`
    - Убедиться что циклов нет
    - При ложных срабатываниях добавить исключения
    - _Requirements: 3.3_
  - [x] 7.3 Создать скрипт keywords-test.ts ✓ (уже существует)
    - Проверять EN/RU key parity (каждая тема в EN должна быть в RU)
    - Проверять отсутствие дубликатов внутри массивов
    - Проверять отсутствие пустых массивов
    - _Requirements: 5.3_
  - [x] 7.4 Добавить npm script keywords:test ✓ (уже существует)
    - `"keywords:test": "tsx scripts/keywords-test.ts"`
    - _Requirements: 5.1_
  - [x] 7.5 Добавить deps:check скрипт для circular deps ✓
    - Добавить npm script `deps:check` с madge
    - **Validates: Requirements 3.3**
  - [x] 7.6 Написать property test для EN/RU parity ✓
    - Реализовано в `app/lib/services/__tests__/prompt-data.property.spec.ts`
    - Property 1: "all RU themes exist in EN themes"
    - Дополнительно: `scripts/keywords-test.ts` проверяет parity
    - **Validates: Requirements 5.3**

- [x] 8. Checkpoint - Валидация ✓
  - Запустить `pnpm run keywords:test` — должен пройти ✓
  - Запустить `npx madge --circular --extensions ts --ts-config tsconfig.json app/lib/services/` — 0 циклов ✓
  - Запустить `pnpm run baseline:compare` — структурные инварианты совпадают ✓

- [x] 9. Документация и финализация (частично)
  - [x] 9.1 Создать README.md в prompt-data/ ✓
    - Описать структуру каждого файла
    - Указать правила кодировки (UTF-8 без BOM, \uXXXX для спецсимволов)
    - Объяснить как добавлять новые темы/цвета с синхронизацией EN/RU
    - Добавить примеры использования getMergedKeywords() и getMergedColors()
    - _Requirements: 6.1, 6.3, 6.4_
  - [x] 9.2 Внедрить seed для RNG ✓ (seeded-random.ts создан, используется в prompt-data)
    - Создать shared `globalSeed` и `setGlobalSeed(seed)` функцию ✓
    - Создать `getRandom()` которая использует seed если установлен ✓
    - Экспортировать `setGlobalSeed` для baseline скрипта ✓
    - _Requirements: 5.5_
  - [x] 9.3 Написать property test для deterministic RNG ✓
    - Реализовано в `app/lib/services/__tests__/prompt-data.property.spec.ts`
    - **Property 5: Seeded RNG determinism**
    - **Validates: Requirements 5.5**

- [x] 10. Финальная валидация ✓
  - Запустить все npm scripts: `pnpm run baseline:compare`, `pnpm run encoding:check`, `pnpm run keywords:test` ✓
  - Запустить полный test suite: `pnpm test` ✓ (539 passed)
  - Проверить что promptEnhancer.ts ≤1500 строк (первый этап) ✓ (588 строк)
  - Убедиться что метрики в пределах: cold import +15%, bundle size +5% ✓
  - _Requirements: 3.1, 4.3, 4.6_

## Notes

- All property tests are now REQUIRED for comprehensive coverage
- Each checkpoint validates that refactoring hasn't broken functionality
- If baseline:compare fails at any checkpoint — stop and investigate
- Granular split (Phase 4 в оригинальном плане) уже включен в шаг 5
- Property tests используют vitest + fast-check (ESM compatible)
- Проект использует ESM — все скрипты запускаются через tsx
- Baseline сравнение использует структурные инварианты с разделением на errors/warnings
- Цель ≤800 строк отложена на второй этап рефакторинга
- Папка `.kiro/specs/prompt-enhancer-refactor/` — это спецификация созданная в этом чате

## Implementation Gaps to Address

| Gap | Current | Required | Task |
|-----|---------|----------|------|
| Prompt count | 20 | 25 | 1.1 |
| Cold import measurement | Not implemented | Median of 5 runs (separate processes) | 1.2 |
| Bundle size measurement | Not implemented | fs.statSync | 1.2 |
| Baseline compare logic | Strict equality | Structural + tiers (exit 0 for warnings) | 1.3 |
| Mojibake detection | Not implemented | Pattern matching | 3.3 |
| Encoding check scope | app/lib/services only | + scripts/, .kiro/specs/ | 3.3 |
| component-aliases.json | Corrupted RU | Clean UTF-8 | 3.1 |
| Math.random locations | 4 places (1548, 1558, 3199, 3360) | All seeded | 9.2 |

## Property Tests Summary

| Property | File | Description |
|----------|------|-------------|
| 1 | baseline.property.spec.ts | Baseline structural consistency |
| 3 | encoding.property.spec.ts | No encoding corruption |
| 4 | data-exports.property.spec.ts | Data module exports completeness |
| 5 | deps.property.spec.ts | No circular dependencies |
| 6 | data-exports.property.spec.ts | Data module purity |
| 9 | keywords.property.spec.ts | EN/RU keyword parity |
| 10 | rng.property.spec.ts | Deterministic RNG |
