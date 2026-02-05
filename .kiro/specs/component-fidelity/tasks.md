# Implementation Plan: Component Fidelity Pipeline

## Overview

Implement a component-first fidelity pipeline using a shared RenderPlan and a strict allowlist (Shadcn + MagicUI). Diversity is enabled by default.

## Tasks

- [ ] 0.5 Seed ComponentIndex examples
  - [ ] 0.5.1 Add 2 hero entries (Shadcn + MagicUI)
  - [ ] 0.5.2 Add 2 features entries (Shadcn + MagicUI)
  - [ ] 0.5.3 Document metadata format in component-index.ts

- [ ] 1. Create ComponentIndex data
  - [ ] 1.1 Add `app/lib/services/prompt-data/component-index.ts`
    - Include Shadcn + MagicUI entries for hero, features, testimonials, pricing, cta, faq, footer
    - Store propsContract, tags, dependencies
  - [ ] 1.2 Add validation for required metadata

- [ ] 2. Implement ComponentSelector
  - [ ] 2.1 Add selector module (filter + score + top-K selection)
  - [ ] 2.2 Add recency penalty and allowlist checks
  - [ ] 2.3 Unit tests for filtering and scoring
  - [ ] 2.4 Add scoring weights config

- [ ] 3. Build RenderPlan
  - [ ] 3.1 Add RenderPlan builder module (seed, layout, selection)
  - [ ] 3.2 Compute layoutUniquenessHash
  - [ ] 3.3 Property test for diversity across repeated runs

- [ ] 4. Integrate RenderPlan into prompt generation
  - [ ] 4.1 Update promptEnhancer to consume RenderPlan
  - [ ] 4.2 Update enhancedPromptGenerator to consume RenderPlan
  - [ ] 4.3 E2E tests for shared plan usage

- [ ] 5. Add style normalization
  - [ ] 5.1 Token normalization layer for typography, spacing, radius, colors
  - [ ] 5.2 Guardrail to reject components that cannot accept tokens
  - [ ] 5.2.1 Implement token compatibility validator
  - [ ] 5.3 Contract tests for required props coverage

- [ ] 6. Extend telemetry
  - [ ] 6.1 Record componentMatchRate and fallbackRate per run
  - [ ] 6.2 Record repeatPenaltyTriggered and avgCandidatesPerSection
  - [ ] 6.3 Add summary API in pipelineTelemetry

- [ ] 7. Quality gate and validation
  - [ ] 7.1 Add curated fallback pool for missing candidates
  - [ ] 7.2 Update existing design quality tests to include match metrics
  - [ ] 7.3 Add golden set regression tests (>= 10 prompts)

- [ ] 8. Run checks
  - [ ] 8.1 pnpm test
  - [ ] 8.2 pnpm run encoding:check
  - [ ] 8.3 pnpm run keywords:test
  - [ ] 8.4 pnpm run baseline:compare

## Notes

- Diversity is default: a new seed is generated for each run.
- Add a third library only after componentMatchRate > 85% and fallbackRate < 10% across stable runs.
