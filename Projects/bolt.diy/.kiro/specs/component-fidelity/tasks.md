# Implementation Plan: Component Fidelity Pipeline

Last updated: 2026-02-05

## Status Checklist

- [x] 0.5 Seed ComponentIndex examples
  - [x] 0.5.1 Add hero entries (Shadcn + MagicUI)
  - [x] 0.5.2 Add features entries (Shadcn + MagicUI)
  - [x] 0.5.3 Document metadata format in component index types

- [x] 1. Create ComponentIndex data
  - [x] 1.1 Add `app/lib/services/prompt-data/component-index.ts`
  - [x] 1.2 Add validation for required metadata (`component-index.spec.ts`)

- [x] 2. Implement ComponentSelector
  - [x] 2.1 Selector module (filter + score + top-K selection)
  - [x] 2.2 Recency penalty and allowlist checks
  - [x] 2.3 Unit tests for filtering and scoring
  - [x] 2.4 Scoring weights config

- [x] 3. Build RenderPlan
  - [x] 3.1 RenderPlan builder module
  - [x] 3.2 `layoutUniquenessHash` computation
  - [x] 3.3 Property test focused specifically on diversity rerolls

- [x] 4. Integrate RenderPlan into prompt generation
  - [x] 4.1 Update `promptEnhancer` to consume RenderPlan
  - [x] 4.2 Update `enhancedPromptGenerator` to consume RenderPlan
  - [x] 4.3 E2E coverage for integrated flow

- [x] 5. Add style normalization
  - [x] 5.1 Token normalization layer (`style-token-utils.ts`)
  - [x] 5.2 Guardrail to reject incompatible components
  - [x] 5.2.1 Token compatibility validator in selector path
  - [x] 5.3 Contract tests for required props coverage per selected section

- [x] 6. Extend telemetry
  - [x] 6.1 Record component match/fallback rates
  - [x] 6.2 Record `repeatPenaltyTriggered` and `avgCandidatesPerSection`
  - [x] 6.3 Expose summary API in telemetry service

- [x] 7. Quality gate and validation
  - [x] 7.1 Curated fallback pool for missing candidates
  - [x] 7.2 Design quality tests include component metrics
  - [x] 7.3 Golden set regression >= 10 prompts, threshold >= 0.85

- [x] 8. Run checks
  - [x] 8.1 `pnpm test`
  - [x] 8.2 `pnpm run encoding:check`
  - [x] 8.3 `pnpm run keywords:test`
  - [x] 8.4 `pnpm run baseline:compare` (pass without warnings after baseline refresh)

## Immediate Next Execution Order

1. [x] Close frontend-only parity:
   explicit frontend-only guardrail added to `promptEnhancer` and backend artifact warnings added in `generationRouter` section flow.
2. [x] Raise golden gate:
   golden prompt set expanded to 12 prompts and threshold tightened to 0.85.
3. [x] Add missing contract tests for selected component props coverage.
4. [x] Resolve baseline warnings and confirm intentional baseline drift.
