# Requirements Document: Component Fidelity Pipeline

## Introduction

This specification defines a component-first fidelity pipeline for design generation.
The goal is to maximize reuse of approved UI components (Shadcn + MagicUI in v1),
while preserving per-run diversity with deterministic controls and telemetry.

## Glossary

- `ComponentIndex`: catalog of approved components with metadata.
- `ComponentSelector`: policy that filters, scores, and selects component candidates.
- `RenderPlan`: shared structured plan used by both prompt generation paths.
- `ComponentMatchRate`: percent of eligible sections resolved to indexed components.
- `LayoutUniquenessHash`: fingerprint of layout structure + selected components.
- `Allowlist`: allowed component sources and dependencies in v1.

## Requirements

### Requirement 1: ComponentIndex

1. The ComponentIndex SHALL include `sectionType`, `propsContract`, `visualTags`,
   `styleTags`, `dependencies`, `source`, and `layoutArchetype` for each entry.
2. The ComponentIndex SHALL include only Shadcn and MagicUI components in v1.
3. The ComponentIndex SHALL be stored under `app/lib/services/prompt-data/`.

### Requirement 2: Allowlist and Dependencies

1. The allowlist SHALL include only Shadcn + MagicUI as component sources in v1.
2. The allowlist SHALL include only approved dependencies and local imports.
3. Components requiring forbidden dependencies SHALL be excluded by selector policy.

### Requirement 3: Shared RenderPlan

1. The RenderPlan SHALL include section order, selected component IDs,
   and per-section props contracts.
2. The RenderPlan SHALL include normalized style token assignments
   (`typography`, `spacing`, `radius`, `colors`).
3. `promptEnhancer` SHALL consume RenderPlan for prompt construction.
4. `enhancedPromptGenerator` SHALL consume the same RenderPlan model.

### Requirement 4: Component Selection Policy

1. Selector SHALL filter by section type and required token compatibility.
2. Selector SHALL score by keyword match, tag match, style compatibility,
   and section affinity.
3. Selector SHALL select from Top-K candidates (`K >= 3`) with seeded choice.
4. Selector SHALL apply recency penalty to recently used component IDs.

### Requirement 5: Diversity by Default

1. Each run SHALL use a new seed by default.
2. System SHALL compute `LayoutUniquenessHash` per result.
3. Duplicate layout hash detection SHALL trigger reroll up to 2 retries.

### Requirement 6: Style Normalization

1. Selected components SHALL receive normalized style tokens.
2. Components incompatible with required tokens SHALL be excluded or replaced.
3. Token compatibility validator SHALL cover typography, spacing, radius, and colors.

### Requirement 7: Frontend-Only Guardrail

1. Prompts SHALL include frontend-only guardrails
   (no backend/API/database modification instructions).
2. Forbidden backend artifacts detected in output SHALL trigger pipeline warnings.

### Requirement 8: Telemetry

1. Telemetry SHALL record `componentMatchRate` and `fallbackRate` per run.
2. Telemetry SHALL record `repeatPenaltyTriggered` and `avgCandidatesPerSection`.
3. Telemetry SHALL expose summary API for design telemetry metrics.

### Requirement 9: Testing

1. Unit tests SHALL cover selector filters/scoring/allowlist.
2. Property tests SHALL verify generation invariants and diversity behavior.
3. Contract tests SHALL verify required props coverage for selected sections.
4. E2E tests SHALL verify RenderPlan integration in both prompt paths.

### Requirement 10: Golden Set Regression

1. Golden set SHALL include at least 10 reference prompts.
2. Pipeline SHALL maintain `componentMatchRate >= 0.85` on the golden set.
3. CI SHALL fail when golden thresholds are violated.
