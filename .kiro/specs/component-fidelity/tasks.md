# Implementation Plan: Component Fidelity Pipeline

## Overview

Implement a component-first fidelity pipeline using a shared RenderPlan and a strict allowlist (Shadcn + MagicUI). Diversity is enabled by default.

## Tasks

- [x] 0.5 Seed ComponentIndex examples
  - [x] 0.5.1 Add 2 hero entries (Shadcn + MagicUI)
  - [x] 0.5.2 Add 2 features entries (Shadcn + MagicUI)
  - [x] 0.5.3 Document metadata format in component-index.ts

- [x] 1. Create ComponentIndex data
  - [x] 1.1 Add `app/lib/services/prompt-data/component-index.ts`
    - Include Shadcn + MagicUI entries for hero, features, testimonials, pricing, cta, faq, footer
    - Store propsContract, tags, dependencies
  - [x] 1.2 Add validation for required metadata

- [x] 2. Implement ComponentSelector
  - [x] 2.1 Add selector module (filter + score + top-K selection)
  - [x] 2.2 Add recency penalty and allowlist checks
  - [x] 2.3 Unit tests for filtering and scoring
  - [x] 2.4 Add scoring weights config

- [x] 3. Build RenderPlan
  - [x] 3.1 Add RenderPlan builder module (seed, layout, selection)
  - [x] 3.2 Compute layoutUniquenessHash
  - [x] 3.3 Property test for diversity across repeated runs

- [x] 4. Integrate RenderPlan into prompt generation
  - [x] 4.1 Update promptEnhancer to consume RenderPlan
  - [x] 4.2 Update enhancedPromptGenerator to consume RenderPlan
  - [x] 4.3 E2E tests for shared plan usage

- [x] 5. Add style normalization
  - [x] 5.1 Token normalization layer for typography, spacing, radius, colors
  - [x] 5.2 Guardrail to reject components that cannot accept tokens
  - [x] 5.2.1 Implement token compatibility validator
  - [x] 5.3 Contract tests for required props coverage

- [x] 6. Extend telemetry
  - [x] 6.1 Record componentMatchRate and fallbackRate per run
  - [x] 6.2 Record repeatPenaltyTriggered and avgCandidatesPerSection
  - [x] 6.3 Add summary API in pipelineTelemetry

- [x] 7. Quality gate and validation
  - [x] 7.1 Add curated fallback pool for missing candidates
  - [x] 7.2 Update existing design quality tests to include match metrics
  - [x] 7.3 Add golden set regression tests (>= 10 prompts)

- [x] 8. Run checks
  - [x] 8.1 pnpm test
  - [x] 8.2 pnpm run encoding:check
  - [x] 8.3 pnpm run keywords:test
  - [x] 8.4 pnpm run baseline:compare

## Notes

- Diversity is default: a new seed is generated for each run.
- Add a third library only after componentMatchRate > 85% and fallbackRate < 10% across stable runs.
