# Implementation Plan: Pipeline Telemetry

## Overview

Create a telemetry service that collects anonymized metrics from the quality pipeline. The service tracks ViolationCode frequencies, auto-fix success rates, timing breakdowns, and quarantine patterns.

## Tasks

- [x] 1. Create telemetry service module
  - [x] 1.1 Create `Projects/bolt.diy/app/lib/services/pipelineTelemetry.ts`
    - Define PipelineRunEvent interface
    - Define QuarantineEvent interface
    - Define TelemetryStore interface
    - _Requirements: 1.1, 2.1_
  - [x] 1.2 Implement in-memory TelemetryStore
    - Initialize counters and maps
    - Implement ring buffer for recent events (last 100)
    - _Requirements: 4.1_

- [x] 2. Implement event emitters
  - [x] 2.1 Implement emitPipelineRun(result: PipelineResult)
    - Extract fileExt from filename
    - Build violationCounts from unifiedViolations
    - Calculate timing breakdown
    - _Requirements: 1.2, 1.3, 1.4, 1.5_
  - [x] 2.2 Implement emitQuarantineWritten(data)
    - Extract violationCodes from unifiedViolations
    - Extract sanitizerWarningCodes
    - Include riskLevel from metrics
    - _Requirements: 2.2, 2.3, 2.4_

- [x] 3. Implement privacy filter
  - [x] 3.1 Create stripSensitiveData(event) function
    - Remove code, content, prompt fields
    - Remove message fields (may contain code)
    - Normalize file paths to extensions only
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  - [x] 3.2 Write tests for privacy invariant
    - **Property 1: Privacy Invariant**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**

- [x] 4. Implement aggregator
  - [x] 4.1 Update counters on each event
    - Increment totalRuns, successCount, failureCount
    - Track quarantineCount, fallbackUsedCount
    - _Requirements: 4.1_
  - [x] 4.2 Track ViolationCode frequencies
    - Update violationFrequency map
    - Update violationQuarantineRate map
    - _Requirements: 4.2, 4.3_
  - [x] 4.3 Track auto-fix stats by ViolationCode
    - Update autoFixByCode map with attempts/successes
    - _Requirements: 4.5_
  - [x] 4.4 Aggregate timing totals
    - Sum timings for average calculation
    - _Requirements: 4.4_

- [x] 5. Implement telemetry API
  - [x] 5.1 Implement getTelemetrySummary()
    - Calculate rates from counters
    - Calculate average timings
    - _Requirements: 5.1_
  - [x] 5.2 Implement getTopViolations(n)
    - Sort by frequency
    - Include quarantine rate and auto-fix success rate
    - _Requirements: 5.2_
  - [x] 5.3 Implement getQuarantineStats()
    - Breakdown by risk level
    - Top violation codes in quarantined files
    - _Requirements: 5.3_
  - [x] 5.4 Implement resetTelemetry()
    - Clear all counters and maps
    - _Requirements: 5.4_

- [x] 6. Integrate with pipeline
  - [x] 6.1 Add telemetry call to routeThroughPipeline
    - Call emitPipelineRun after pipeline completes
    - Ensure no signature changes
    - _Requirements: 6.1, 6.3_
  - [x] 6.2 Add telemetry call to ActionRunner quarantine
    - Call emitQuarantineWritten when file quarantined
    - _Requirements: 6.2_

- [x] 7. Write tests
  - [x] 7.1 Unit tests for privacy filter
    - Test forbidden fields are stripped
    - Test allowed fields are preserved
    - _Requirements: 3.1, 3.2_
  - [x] 7.2 Unit tests for aggregator
    - Test counter increments
    - Test ViolationCode tracking
    - _Requirements: 4.1, 4.2_
  - [x] 7.3 Unit tests for API
    - Test getTelemetrySummary accuracy
    - Test getTopViolations sorting
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 7.4 Integration test for pipeline telemetry
    - Run pipeline, verify event emitted
    - Verify aggregates updated
    - _Requirements: 6.1, 6.4_

- [x] 8. Checkpoint - Run all tests
  - All 356 tests passed (1 skipped)
  - Telemetry tests: 39 passed
  - Existing pipeline tests still pass
  - Telemetry overhead < 1ms (try-catch wrapped)

- [ ] 9. Add design quality telemetry events
  - [ ] 9.1 Define DesignQualityEvent interface in pipelineTelemetry.ts
  - [ ] 9.2 Implement emitDesignQuality() for prompt enhancer outputs
  - [ ] 9.3 Add privacy filter support for designQuality fields
  - _Requirements: 7.1, 7.2_

- [ ] 10. Aggregate design quality stats
  - [ ] 10.1 Extend TelemetryStore with design quality counters
  - [ ] 10.2 Implement getDesignQualityStats() API
  - _Requirements: 7.3, 7.4_

- [ ] 11. Tests for design quality telemetry
  - [ ] 11.1 Unit test: design quality events recorded
  - [ ] 11.2 Property test: design quality aggregation accuracy
  - _Requirements: 7.1, 7.3, 7.4_

## Notes

- Privacy is critical - no code/prompts/messages in telemetry ✓
- Telemetry failures do not affect pipeline execution ✓
- In-memory storage for MVP, persistence can be added later

