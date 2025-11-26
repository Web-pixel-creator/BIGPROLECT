## Почему берем Bolt.diy за основу

- **Полный продуктовый каркас**: веб (Next) + Electron, готовые Workers/Cloudflare, CI, документация. Уже есть multi‑LLM, Supabase, Git‑панель, мониторинг, шаблоны, DevOps.
- **Богатые интеграции**: 20+ LLM‑провайдеров (OpenAI, Anthropic, Groq, Mistral, OpenRouter, Ollama и др.), BYO keys, Supabase storage, Git‑панель, Monitoring.
- **Сборки и окружение**: pnpm + Vite/Next + electron-builder, .env.example/.production, docker-compose, wrangler, тестовые workflow’ы.
- **Документация и комьюнити**: README/PROJECT/FAQ, changelog, гайды, активная OSS‑база.

## Сильные стороны других репозиториев

- **Dyad**: офлайн/локальные workers, усиленный sandbox, Forge/Vite конфиги для desktop, понятные security/agents доки. Хорошо для режима “local-first” и строгих ограничений.
- **Open-lovable**: аккуратная дизайн‑система (Tailwind токены, atoms/hooks/components), сильный UX — полезно для полировки интерфейса.
- **Vercel examples**: боевые паттерны деплоя/edge/CI (edge middleware, build-output API, готовые workflows), которые можно взять как шаблоны для деплоя и обучающие примеры.

## Итог

Используем Bolt.diy как базу (скелет + инфраструктура), а из остальных переносим только сильные части: локальные workers/sandbox из Dyad, дизайн‑систему из open-lovable, edge/CI шаблоны из Vercel examples. Это минимизирует конфликты зависимостей и даёт максимально функциональный продукт.
