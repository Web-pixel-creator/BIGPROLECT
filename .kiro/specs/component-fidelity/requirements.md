# Requirements Document

## Introduction

This specification defines a component-first fidelity pipeline for the design system. The goal is to maximize reuse of approved UI components (Shadcn + MagicUI in v1), while still generating diverse layouts on every run. The pipeline produces a structured RenderPlan that is used by both promptEnhancer and enhancedPromptGenerator.

## Glossary

- ComponentIndex: Catalog of approved components with metadata (section type, props contract, tags, dependencies).
- ComponentSelector: Policy that scores and selects candidates from ComponentIndex for each section.
- RenderPlan: Structured plan that maps sections to selected components and style tokens.
- ComponentMatchRate: Percent of sections resolved to indexed components vs fallback.
- LayoutUniquenessHash: Fingerprint of layout structure and selected components for diversity checks.
- Allowlist: The only permitted component sources and dependencies in v1.

## Requirements

### Requirement 1: ComponentIndex

**User Story:** As a developer, I want a single index of approved components, so that selection is deterministic and controlled.

#### Acceptance Criteria
1. The ComponentIndex SHALL include sectionType, propsContract, visualTags, styleTags, dependencies, source, and layoutArchetype for each component.
2. The ComponentIndex SHALL include only Shadcn and MagicUI components in v1.
3. The ComponentIndex SHALL be stored as data under app/lib/services/prompt-data/.

### Requirement 2: Allowlist and Dependencies

**User Story:** As a product owner, I want strict dependency controls, so that outputs remain consistent and safe.

#### Acceptance Criteria
1. The Allowlist SHALL include only Shadcn + MagicUI as component sources in v1.
2. The Allowlist SHALL include only approved dependencies (lucide-react, framer-motion, and existing project deps).
3. If a component requires a forbidden dependency, the selector SHALL exclude it.

### Requirement 3: RenderPlan

**User Story:** As a developer, I want a structured plan shared by both promptEnhancer and enhancedPromptGenerator, so that behavior is consistent.

#### Acceptance Criteria
1. The RenderPlan SHALL include section order, selected component ids, and per-section props contracts.
2. The RenderPlan SHALL include style token assignments (typography, spacing, radius, colors).
3. promptEnhancer SHALL consume the RenderPlan when building prompts.
4. enhancedPromptGenerator SHALL consume the same RenderPlan when building prompts.

### Requirement 4: Component Selection Policy

**User Story:** As a product owner, I want selection to prefer the best matches while still allowing diversity.

#### Acceptance Criteria
1. The ComponentSelector SHALL filter candidates by sectionType and required props coverage.
2. The ComponentSelector SHALL score candidates by keyword match, tag match, style compatibility, and section affinity.
3. The ComponentSelector SHALL select from Top-K candidates (K >= 3) using the current seed.
4. The selector SHALL apply a recency penalty to recently used component ids.

### Requirement 5: Diversity by Default

**User Story:** As a user, I want different designs on each run even with the same prompt.

#### Acceptance Criteria
1. Each run SHALL use a new seed by default.
2. The system SHALL compute LayoutUniquenessHash for each result.
3. If a new run matches a recent LayoutUniquenessHash, the system SHALL regenerate with a new seed up to 2 times.

### Requirement 6: Style Normalization

**User Story:** As a product owner, I want reused components to look consistent, so that pages feel cohesive.

#### Acceptance Criteria
1. All selected components SHALL receive a normalized style token set (typography, spacing, radius, colors).
2. If a component cannot accept required tokens, it SHALL be excluded or replaced.
3. A component SHALL be considered incompatible when token overrides cannot be applied for typography, spacing, radius, or colors via a defined compatibility validator.

### Requirement 7: Frontend-Only Guardrail

**User Story:** As a product owner, I want design generation to stay frontend-only.

#### Acceptance Criteria
1. Prompts SHALL include a frontend-only guardrail (no backend/API/database changes).
2. Any forbidden backend artifacts detected in output SHALL trigger pipeline warnings.

### Requirement 8: Telemetry

**User Story:** As a product owner, I want visibility into match quality and diversity.

#### Acceptance Criteria
1. Telemetry SHALL record componentMatchRate and fallbackRate per run.
2. Telemetry SHALL record repeatPenaltyTriggered and avgCandidatesPerSection.
3. Telemetry SHALL expose a summary API for these metrics.

### Requirement 9: Testing

**User Story:** As a developer, I want automated tests that prevent regressions.

#### Acceptance Criteria
1. Unit tests SHALL cover ComponentSelector filters and scoring.
2. Property tests SHALL verify diversity across repeated runs of the same prompt.
3. Contract tests SHALL verify required props coverage for each selected section.
4. E2E tests SHALL verify RenderPlan integration into promptEnhancer and enhancedPromptGenerator.

### Requirement 10: Golden Set Regression

**User Story:** As a developer, I want regression tests against a golden set of designs, so that fidelity does not degrade.

#### Acceptance Criteria
1. The golden set SHALL include at least 10 reference prompts with expected LayoutUniquenessHash values.
2. The pipeline SHALL maintain componentMatchRate >= 0.85 on the golden set.
3. Any change that breaks golden set thresholds SHALL be blocked by CI.
