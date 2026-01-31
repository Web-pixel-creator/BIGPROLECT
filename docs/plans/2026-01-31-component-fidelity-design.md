# Component Fidelity Design

## Goal

Deliver maximum component-level fidelity by reusing approved UI components (Shadcn + MagicUI in v1) while generating diverse layouts on every run. The system outputs a shared RenderPlan consumed by both promptEnhancer and enhancedPromptGenerator.

## Architecture Summary

Inputs (prompt or Brief) flow through theme detection and layout strategy, then into a ComponentSelector that picks from a single ComponentIndex. The selector produces a RenderPlan containing selected component ids, props contracts, and normalized style tokens. The plan is injected into both prompt generation paths and validated by the existing quality pipeline.

## Key Components

- ComponentIndex: catalog of approved components with sectionType, tags, dependencies, and props contracts.
- ComponentSelector: scoring + top-K selection with recency penalties.
- RenderPlan: structured mapping of sections to components and tokens.
- Style normalization: enforces consistent typography, spacing, radius, and colors.
- Guardrails: frontend-only constraints and dependency allowlist.

## Diversity Strategy

Each run uses a new seed by default. A layoutUniquenessHash is computed from section order, layout archetype, and component ids. If a recent hash repeats, the system regenerates with a new seed (up to 2 retries).

## Error Handling

If no candidates match or dependencies conflict, the system falls back to a curated component pool and emits warnings. Best-effort RenderPlans are always produced so the pipeline remains resilient.

## Telemetry

Record componentMatchRate, fallbackRate, repeatPenaltyTriggered, and avgCandidatesPerSection. These metrics govern when a third library is safe to add.

## Testing

- Unit tests for selector filters and scoring
- Property tests for diversity under repeated prompts
- Contract tests for required props coverage
- E2E tests to verify RenderPlan integration in both prompt paths
