# Requirements Document

## Introduction

This specification defines E2E (end-to-end) integration tests for the Production-Grade Quality Pipeline in bolt.diy. The pipeline consists of 5 stages: Sanitizer, Validation Gate, Auto-Fix Loop, Modular Generation, and Contracts + Router. These tests ensure the entire pipeline works correctly as an integrated system, catching regressions and validating the flow from raw LLM output to validated code.

## Glossary

- **Pipeline**: The complete code quality processing flow from raw input to validated output
- **Sanitizer**: Stage 1 - Quick fixes for common LLM output issues (truncated tags, malformed syntax)
- **Validator**: Stage 2 - Syntax and structure validation using TypeScript/CSS parsers
- **Auto_Fix_Loop**: Stage 3 - LLM-based repair for code that fails validation
- **Contract_Validator**: Stage 4 - Section-specific structure validation (hero needs h1, pricing needs tiers)
- **Router**: Stage 5 - Orchestrates all stages and determines processing strategy
- **LlmRepairFn**: Function type that receives a prompt string and returns raw LLM response
- **Quarantine**: Failed code storage with sidecar metadata files for debugging
- **UnifiedViolation**: Structured error format with code, severity, message, autoFixable flag
- **Design_Cues**: Design directives (typography, layout, visualHierarchy, motion) emitted by prompt enhancer
- **Layout_Uniqueness_Hash**: Hash of layout structure used to validate variant uniqueness

## Requirements

### Requirement 1: Valid Code Passthrough

**User Story:** As a developer, I want valid code to pass through the pipeline without modification, so that correct LLM output is not unnecessarily altered.

#### Acceptance Criteria

1. WHEN valid TSX code is passed to routeThroughPipeline THEN the Router SHALL return success=true with unchanged code
2. WHEN valid code passes validation THEN the Router SHALL NOT invoke the Auto_Fix_Loop
3. WHEN valid code is processed THEN the Router SHALL record sanitizer.ran=true and validator.ran=true in stages
4. WHEN valid code completes processing THEN the Router SHALL return processingTimeMs > 0

### Requirement 2: Sanitizer-Only Fix Path

**User Story:** As a developer, I want minor issues to be fixed by the sanitizer without LLM calls, so that simple fixes are fast and don't consume API quota.

#### Acceptance Criteria

1. WHEN code has truncated JSX tags (e.g., `<butt>` instead of `<button>`) THEN the Sanitizer SHALL fix them without LLM
2. WHEN sanitizer fixes code successfully THEN the Router SHALL return success=true with sanitizer.changed=true
3. WHEN sanitizer fixes code THEN the Router SHALL NOT invoke llmRepairFn
4. WHEN sanitizer makes changes THEN the Router SHALL preserve the original code semantics

### Requirement 3: LLM Repair Path

**User Story:** As a developer, I want code that can't be fixed by sanitizer to be repaired by LLM, so that more complex syntax errors can be resolved.

#### Acceptance Criteria

1. WHEN code fails validation after sanitizer THEN the Router SHALL invoke llmRepairFn with a repair prompt
2. WHEN llmRepairFn returns fixed code THEN the Router SHALL validate the repaired code
3. WHEN LLM repair succeeds THEN the Router SHALL return success=true with autoFix.success=true
4. WHEN LLM repair succeeds THEN the Router SHALL return autoFix.attempts with the number of attempts made
5. WHEN LLM repair prompt is built THEN the Auto_Fix_Loop SHALL include UNIFIED_VIOLATIONS section if available

### Requirement 4: Fallback LLM Path

**User Story:** As a developer, I want a fallback LLM to be used when the primary fails, so that repair has higher success rate.

#### Acceptance Criteria

1. WHEN primary llmRepairFn fails after MAX_FIX_ATTEMPTS THEN the Router SHALL invoke fallbackLlmRepairFn
2. WHEN fallback LLM succeeds THEN the Router SHALL return success=true with usedFallback=true
3. WHEN fallback LLM is used THEN the Router SHALL add warning "Used fallback model for repair"
4. IF both primary and fallback fail THEN the Router SHALL return success=false with all attempts recorded

### Requirement 5: Unfixable Code Handling

**User Story:** As a developer, I want unfixable code to fail gracefully with detailed error information, so that I can debug and manually fix issues.

#### Acceptance Criteria

1. WHEN code cannot be fixed after all attempts THEN the Router SHALL return success=false
2. WHEN code fails THEN the Router SHALL return finalValidation with errors array populated
3. WHEN code fails THEN the Router SHALL return unifiedViolations with structured error codes
4. WHEN code fails THEN the Router SHALL include warnings explaining why auto-fix failed

### Requirement 6: Contract Validation Integration

**User Story:** As a developer, I want section-specific contracts to be validated, so that generated sections meet structural requirements.

#### Acceptance Criteria

1. WHEN sectionType is provided THEN the Router SHALL run contract validation
2. WHEN contract validation fails THEN the Router SHALL add warnings for missing elements
3. WHEN skipContractValidation=true THEN the Router SHALL NOT run contract validation
4. WHEN contract validation runs THEN the Router SHALL return contractValidation with score and violations

### Requirement 7: Pipeline Statistics

**User Story:** As a developer, I want pipeline statistics to be recorded, so that I can monitor success rates and identify issues.

#### Acceptance Criteria

1. WHEN recordPipelineResult is called THEN the Router SHALL update totalRuns counter
2. WHEN successful result is recorded THEN the Router SHALL update successRate
3. WHEN sanitizer makes changes THEN the Router SHALL update sanitizerFixRate
4. WHEN auto-fix runs THEN the Router SHALL update autoFixSuccessRate
5. WHEN contract validation runs THEN the Router SHALL update contractPassRate

### Requirement 8: Mock LLM Integration

**User Story:** As a test author, I want to use mock LLM functions in tests, so that E2E tests are fast and deterministic.

#### Acceptance Criteria

1. WHEN mock llmRepairFn is provided THEN the Router SHALL call it with the repair prompt string
2. WHEN mock returns code in markdown block THEN the Auto_Fix_Loop SHALL extract the code correctly
3. WHEN mock returns plain code THEN the Auto_Fix_Loop SHALL use it directly
4. WHEN mock throws error THEN the Router SHALL handle it gracefully and try next attempt

### Requirement 9: Prompt-to-Design Integrity

**User Story:** As a product owner, I want design cues preserved across the pipeline, so that enhanced prompts result in WOW-quality output.

#### Acceptance Criteria

1. WHEN a prompt includes explicit sections THEN the enhanced prompt SHALL include matching section order and section contract
2. WHEN enhanced prompt includes Design_Cues THEN the downstream pipeline SHALL preserve these directives in the generation request
3. WHEN Design_Cues are missing THEN the test SHALL fail with a descriptive message

### Requirement 10: Layout Uniqueness Across Variants

**User Story:** As a product owner, I want multiple variants to have distinct layouts, so that outputs avoid template repetition.

#### Acceptance Criteria

1. WHEN generating 3 variants for the same prompt THEN at least 2 distinct Layout_Uniqueness_Hash values SHALL be recorded
2. WHEN Layout_Uniqueness_Hash values are identical THEN the system SHALL retry with a new seed (up to 2 retries)
