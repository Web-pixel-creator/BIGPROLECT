# Implementation Plan: E2E Pipeline Tests

## Overview

Create end-to-end integration tests for the quality pipeline using mock LLM functions. Tests will be in `generationRouter.e2e.spec.ts` alongside existing unit tests.

## Tasks

- [x] 1. Create test file with mock LLM helpers
  - Create `Projects/bolt.diy/app/lib/services/generationRouter.e2e.spec.ts`
  - Implement `createSuccessfulMock()` - returns valid code
  - Implement `createRetryMock(failCount)` - fails N times then succeeds
  - Implement `createFailingMock()` - always returns invalid code
  - Implement `createThrowingMock()` - throws errors for error handling tests
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 2. Add test fixtures
  - [x] 2.1 Add valid code samples (simpleComponent, heroSection, withProps, validCSS, validJSON)
    - _Requirements: 1.1_
  - [x] 2.2 Add sanitizer-fixable code samples (truncatedTag, truncatedButton)
    - _Requirements: 2.1_
  - [x] 2.3 Add LLM-repair-needed code samples (syntaxError, unclosedTag, missingBrace, arrowFunctionError)
    - _Requirements: 3.1_
  - [x] 2.4 Add unfixable code samples (gibberish, incomplete, totallyBroken)
    - _Requirements: 5.1_

- [x] 3. Implement passthrough tests
  - [x] 3.1 Test valid TSX passes with success=true
    - _Requirements: 1.1, 1.3_
  - [x] 3.2 Test valid code doesn't invoke auto-fix
    - _Requirements: 1.2_
  - [ ]* 3.3 Write property test for valid code passthrough (optional)
    - **Property 1: Valid Code Passthrough Invariant**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**

- [x] 4. Implement sanitizer path tests
  - [x] 4.1 Test truncated tags fixed without LLM
    - _Requirements: 2.1, 2.2_
  - [x] 4.2 Test sanitizer.changed=true when fixes applied
    - _Requirements: 2.2_
  - [x] 4.3 Test llmRepairFn not called when sanitizer succeeds
    - _Requirements: 2.3_
  - [ ]* 4.4 Write property test for sanitizer-fixed code (optional)
    - **Property 2: Sanitizer-Fixed Code Success**
    - **Validates: Requirements 2.1, 2.2**

- [x] 5. Implement LLM repair tests
  - [x] 5.1 Test LLM repair invoked for syntax errors
    - _Requirements: 3.1_
  - [x] 5.2 Test successful LLM repair returns success=true
    - _Requirements: 3.3_
  - [x] 5.3 Test attempts counter matches actual calls
    - _Requirements: 3.4_
  - [x] 5.4 Test repair prompt includes UNIFIED_VIOLATIONS
    - _Requirements: 3.5_
  - [ ]* 5.5 Write property test for LLM repair validation (optional)
    - **Property 5: LLM Repair Validates Output**
    - **Validates: Requirements 3.2**

- [x] 6. Implement fallback tests
  - [x] 6.1 Test fallback invoked after primary fails MAX_FIX_ATTEMPTS
    - _Requirements: 4.1_
  - [x] 6.2 Test usedFallback=true when fallback succeeds
    - _Requirements: 4.2_
  - [x] 6.3 Test warning added when fallback used
    - _Requirements: 4.3_
  - [x] 6.4 Test both primary and fallback fail returns success=false
    - _Requirements: 4.4_

- [x] 7. Implement failure path tests
  - [x] 7.1 Test unfixable code returns success=false
    - _Requirements: 5.1_
  - [x] 7.2 Test failure includes errors array
    - _Requirements: 5.2_
  - [x] 7.3 Test failure includes warnings
    - _Requirements: 5.4_
  - [x] 7.4 Test LLM throwing errors handled gracefully
  - [ ]* 7.5 Write property test for failure error details (optional)
    - **Property 3: Failure Includes Error Details**
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 8. Implement contract validation tests
  - [x] 8.1 Test contract.ran=true when sectionType provided
    - _Requirements: 6.1_
  - [x] 8.2 Test warnings added for missing elements
    - _Requirements: 6.2_
  - [x] 8.3 Test skipContractValidation=true skips contract
    - _Requirements: 6.3_
  - [x] 8.4 Test contractValidation object populated
    - _Requirements: 6.4_
  - [ ]* 8.5 Write property test for contract validation (optional)
    - **Property 4: Contract Validation Runs When Configured**
    - **Validates: Requirements 6.1, 6.4**

- [x] 9. Implement statistics tests
  - [x] 9.1 Test totalRuns incremented
    - _Requirements: 7.1_
  - [x] 9.2 Test successRate calculated correctly
    - _Requirements: 7.2_
  - [x] 9.3 Test sanitizerFixRate updated
    - _Requirements: 7.3_
  - [x] 9.4 Test autoFixSuccessRate updated
    - _Requirements: 7.4_
  - [x] 9.5 Test contractPassRate updated
    - _Requirements: 7.5_

- [x] 10. Checkpoint - Run all E2E tests
  - All 39 E2E tests pass
  - All 205 quality pipeline tests pass (1 skipped)

- [x] 11. Add design quality E2E tests
  - [x] 11.1 Add fixtures with Design_Cues metadata
    - _Requirements: 9.1, 9.2_
  - [x] 11.2 Test design cues preserved in pipeline requests
    - **Property 6: Design cues preserved**
    - _Requirements: 9.1, 9.2_
  - [x] 11.3 Test layout uniqueness across variants
    - **Property 7: Layout uniqueness across variants**
    - _Requirements: 10.1, 10.2_

## Notes

- Tasks marked with `*` are optional property-based tests
- Each task references specific requirements for traceability
- Mock LLM functions ensure tests are fast and deterministic
- Tests should reset pipeline stats in beforeEach
