## Setup

This repo uses git submodules for external component libraries (kokonutui, magicui, react-bits).

Clone + init submodules:
```
git clone https://github.com/Web-pixel-creator/BIGPROLECT.git
cd BIGPROLECT
git submodule update --init --recursive
```

If submodules already exist, update them:
```
git submodule update --remote --merge
```

## Component sources
- MD libraries: `shadcnui-blocks.md`, `aceternity-components.md`, `kokonutui-components.md`, `magicui-components.md`, `reactbits-components.md`
- Registries: shadcn-compatible registries (aceternity, cult-ui, shadcn, etc.) подключены в registryService
- Aliases: `Projects/bolt.diy/app/lib/services/component-aliases.json` (EN+RU keywords)

## Prompt matcher
Assistent adds:
- matches from MD via aliases (componentMatcher)
- a short list from registries (registryService) with 5s timeout

Note: Ensure project paths/aliases (`@/lib/utils`, Tailwind tokens, framer-motion/lucide deps) stay consistent so inserted components compile without manual fixes.
