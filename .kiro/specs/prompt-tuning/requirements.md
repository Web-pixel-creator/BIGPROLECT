# Requirements Document

## Introduction

This specification defines a prompt tuning system for the quality pipeline's auto-fix functionality. The system enables A/B testing of repair prompts, few-shot examples for common ViolationCodes, and repair boundaries based on risk levels. All experiments are tracked through telemetry for data-driven optimization.

## Glossary

- **Prompt_Variant**: Identifier for a specific prompt configuration (e.g., "baseline", "fewshot-v1")
- **Few_Shot_Pack**: Collection of example repairs for specific ViolationCodes
- **Repair_Boundary**: Constraints on how aggressively LLM can modify code based on risk level
- **Variant_Selector**: Component that deterministically assigns runs to prompt variants
- **Telemetry_Tag**: Field in telemetry events that identifies which variant was used

## Requirements

### Requirement 1: Prompt Variant System

**User Story:** As a developer, I want to define multiple prompt variants, so that I can A/B test different repair strategies.

#### Acceptance Criteria

1. THE Prompt_Variant_Registry SHALL support registering named prompt variants
2. WHEN a variant is registered THEN it SHALL include a unique identifier and prompt builder function
3. THE system SHALL support at least two variants: "baseline" (current buildRepairPromptV2) and "fewshot-v1"
4. WHEN a variant is not found THEN the system SHALL fall back to "baseline"

### Requirement 2: Deterministic Variant Selection

**User Story:** As a developer, I want variant selection to be deterministic, so that the same repair case always uses the same variant for reproducibility.

#### Acceptance Criteria

1. WHEN selecting a variant THEN the Variant_Selector SHALL use a deterministic hash of (filename + timestamp_bucket)
2. THE timestamp_bucket SHALL be configurable (default: 1 hour) to allow same file to get different variants over time
3. WHEN the same inputs are provided THEN the Variant_Selector SHALL return the same variant
4. THE Variant_Selector SHALL support forced variant override for testing

### Requirement 3: Telemetry Integration

**User Story:** As a developer, I want prompt variants tracked in telemetry, so that I can measure A/B test results.

#### Acceptance Criteria

1. WHEN a pipeline run uses auto-fix THEN the PipelineRunEvent SHALL include promptVariant field
2. WHEN a quarantine event occurs THEN the QuarantineEvent SHALL include promptVariant field
3. THE Telemetry_Service SHALL track success rate per promptVariant
4. THE Telemetry_Service SHALL expose getVariantStats() returning per-variant metrics

### Requirement 4: Few-Shot Examples

**User Story:** As a developer, I want few-shot examples for common errors, so that LLM has concrete repair patterns.

#### Acceptance Criteria

1. THE Few_Shot_Pack SHALL map ViolationCode to example (broken, fixed) pairs
2. WHEN building a prompt THEN the system SHALL include relevant few-shot examples based on detected ViolationCodes
3. THE few-shot examples SHALL be limited to top-3 most relevant for the current errors
4. THE few-shot examples SHALL NOT include full code - only minimal snippets showing the fix pattern

### Requirement 5: Repair Boundaries

**User Story:** As a developer, I want repair boundaries based on risk level, so that high-risk cases get conservative fixes.

#### Acceptance Criteria

1. WHEN riskLevel is "high" THEN the prompt SHALL include strict boundary instructions
2. WHEN riskLevel is "high" THEN the prompt SHALL instruct LLM to make minimal changes only
3. WHEN riskLevel is "low" or "medium" THEN the prompt MAY allow more aggressive fixes
4. THE boundary instructions SHALL be configurable per variant

### Requirement 6: Variant Configuration

**User Story:** As a developer, I want to configure variants without code changes, so that I can iterate quickly.

#### Acceptance Criteria

1. THE variant configuration SHALL be defined in a dedicated config module
2. WHEN adding a new variant THEN only the config module SHALL need modification
3. THE config SHALL support enabling/disabling variants without removing them
4. THE config SHALL support setting variant weights for non-50/50 splits
