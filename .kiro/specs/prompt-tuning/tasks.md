# Implementation Plan: Prompt Tuning

## Overview

Implement a prompt tuning system with A/B testing, few-shot examples, and risk-based repair boundaries. All experiments tracked through telemetry.

## Tasks

- [x] 1. Create variant system infrastructure
  - [x] 1.1 Create `Projects/bolt.diy/app/utils/promptVariants.ts`
    - Define PromptVariant type
    - Define VariantConfig interface
    - Define VariantRegistry with baseline variant
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 1.2 Implement selectVariant() function
    - Hash-based deterministic selection
    - Support timestamp bucketing (default 1 hour)
    - Support forceVariant override
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [x] 1.3 Write tests for variant selector determinism
    - **Property 1: Deterministic Selection**
    - **Validates: Requirements 2.1, 2.3**

- [x] 2. Extend telemetry for A/B tracking
  - [x] 2.1 Add promptVariant field to PipelineRunEvent
    - Update interface in pipelineTelemetry.ts
    - Update emitPipelineRun to accept promptVariant
    - _Requirements: 3.1_
  - [x] 2.2 Add promptVariant field to QuarantineEvent
    - Update interface
    - Update emitQuarantineWritten
    - _Requirements: 3.2_
  - [x] 2.3 Implement getVariantStats() API
    - Track success rate per variant
    - Track avg attempts per variant
    - Track quarantine rate per variant
    - _Requirements: 3.3, 3.4_
  - [x] 2.4 Write tests for telemetry completeness
    - **Property 2: Telemetry Completeness**
    - **Validates: Requirements 3.1, 3.2**

- [x] 3. Implement few-shot examples system
  - [x] 3.1 Create `Projects/bolt.diy/app/utils/fewShotExamples.ts`
    - Define FewShotExample interface
    - Create initial examples for SYNTAX_* codes
    - Create initial examples for CONTRACT_* codes
    - _Requirements: 4.1_
  - [x] 3.2 Implement getFewShotExamples() function
    - Filter by matching ViolationCodes
    - Limit to maxExamples (default 3)
    - _Requirements: 4.2, 4.3_
  - [x] 3.3 Write tests for few-shot relevance
    - **Property 3: Few-Shot Relevance**
    - **Validates: Requirements 4.2**

- [x] 4. Implement repair boundaries
  - [x] 4.1 Define REPAIR_BOUNDARIES config
    - Low risk: allow structural changes
    - Medium risk: preserve structure
    - High risk: minimal changes only
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 4.2 Implement getBoundaryInstructions() function
    - Return instructions based on riskLevel
    - _Requirements: 5.4_
  - [x] 4.3 Write tests for boundary enforcement
    - **Property 4: Boundary Enforcement**
    - **Validates: Requirements 5.1, 5.2**

- [x] 5. Create fewshot-v1 variant
  - [x] 5.1 Implement buildRepairPromptWithFewShot()
    - Include few-shot examples based on ViolationCodes
    - Include boundary instructions based on riskLevel
    - _Requirements: 4.2, 5.1_
  - [x] 5.2 Register fewshot-v1 in variant registry
    - Set weight to 50 (50/50 split with baseline)
    - _Requirements: 1.3, 6.4_

- [x] 6. Integrate with auto-fix loop
  - [x] 6.1 Update autoFixWithLlm to use variant selector
    - Select variant at start of repair
    - Pass variant to prompt builder
    - _Requirements: 1.4, 2.1_
  - [x] 6.2 Update autoFixWithLlm to emit promptVariant in telemetry
    - Pass variant to emitPipelineRun
    - _Requirements: 3.1_
  - [x] 6.3 Update ActionRunner to pass promptVariant to quarantine telemetry
    - _Requirements: 3.2_

- [x] 7. Write integration tests
  - [x] 7.1 Test end-to-end A/B flow
    - Run repairs, verify variant selection
    - Verify telemetry includes promptVariant
    - _Requirements: 3.1, 3.2_
  - [x] 7.2 Test variant stats aggregation
    - Multiple runs with different variants
    - Verify getVariantStats() accuracy
    - _Requirements: 3.3, 3.4_

- [x] 8. Checkpoint - Run all tests
  - All 393 tests passed
  - Prompt tuning tests: 58 passed (fewShotExamples + autoFixLoop + promptVariants)
  - Telemetry captures promptVariant correctly

## Notes

- Start with 50/50 split between baseline and fewshot-v1
- Few-shot examples populated for common SYNTAX_* and CONTRACT_* codes
- Variant weights can be adjusted without code changes
- Privacy maintained: no code/prompts in telemetry, only variant IDs
