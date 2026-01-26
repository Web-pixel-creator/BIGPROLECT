# Requirements Document

## Introduction

This specification defines a telemetry system for the Production-Grade Quality Pipeline. The system collects anonymized metrics about pipeline execution to enable data-driven optimization of code generation quality, auto-fix success rates, and prompt tuning decisions.

## Glossary

- **Telemetry_Service**: Module that collects and aggregates pipeline execution metrics
- **Pipeline_Event**: Structured event emitted during pipeline execution
- **ViolationCode**: Structured error code (e.g., SYNTAX_UNCLOSED_TAG, CONTRACT_HERO_MISSING_H1)
- **Telemetry_Store**: In-memory storage for aggregated metrics with optional persistence
- **Privacy_Filter**: Component that strips sensitive data before logging
- **Design_Quality_Score**: Heuristic score (0-100) indicating expected visual quality
- **Layout_Uniqueness_Hash**: Hash of layout structure for uniqueness tracking
- **Design_Quality_Event**: Telemetry event for design-quality metrics (no prompts/code)

## Requirements

### Requirement 1: Pipeline Run Events

**User Story:** As a developer, I want pipeline execution metrics collected automatically, so that I can analyze success rates and identify bottlenecks.

#### Acceptance Criteria

1. WHEN routeThroughPipeline completes THEN the Telemetry_Service SHALL emit a pipeline_run event
2. WHEN pipeline_run event is emitted THEN it SHALL include fileExt, sectionType, success, usedFallback, quarantined flags
3. WHEN pipeline_run event is emitted THEN it SHALL include error/warning counts and ViolationCode breakdown
4. WHEN pipeline_run event is emitted THEN it SHALL include autoFix attempts and success status
5. WHEN pipeline_run event is emitted THEN it SHALL include timing breakdown (sanitizer, validator, contract, autoFix, total)

### Requirement 2: Quarantine Events

**User Story:** As a developer, I want quarantine events tracked separately, so that I can analyze failure patterns and improve auto-fix.

#### Acceptance Criteria

1. WHEN a file is quarantined THEN the Telemetry_Service SHALL emit a quarantine_written event
2. WHEN quarantine_written event is emitted THEN it SHALL include violationCodes array
3. WHEN quarantine_written event is emitted THEN it SHALL include sanitizerWarningCodes array
4. WHEN quarantine_written event is emitted THEN it SHALL include metrics.riskLevel

### Requirement 3: Privacy by Design

**User Story:** As a user, I want my code and prompts to remain private, so that telemetry doesn't leak sensitive information.

#### Acceptance Criteria

1. THE Telemetry_Service SHALL NOT log code content, prompts, or full file paths
2. THE Telemetry_Service SHALL only log ViolationCodes, counts, timings, and risk levels
3. WHEN file paths are needed THEN the Telemetry_Service SHALL use normalized relative paths or hashes
4. THE Telemetry_Service SHALL NOT log diagnostic messages that may contain code snippets

### Requirement 4: Aggregated Statistics

**User Story:** As a developer, I want aggregated statistics available, so that I can view trends and top issues.

#### Acceptance Criteria

1. THE Telemetry_Service SHALL maintain running totals for pipeline runs, successes, failures
2. THE Telemetry_Service SHALL track top-N ViolationCodes by frequency
3. THE Telemetry_Service SHALL track top-N ViolationCodes by quarantine rate
4. THE Telemetry_Service SHALL calculate average timings per stage
5. THE Telemetry_Service SHALL track auto-fix success rate by ViolationCode

### Requirement 5: Telemetry API

**User Story:** As a developer, I want a simple API to access telemetry data, so that I can build dashboards and reports.

#### Acceptance Criteria

1. THE Telemetry_Service SHALL expose getTelemetrySummary() returning aggregated stats
2. THE Telemetry_Service SHALL expose getTopViolations(n) returning most frequent codes
3. THE Telemetry_Service SHALL expose getQuarantineStats() returning failure analysis
4. THE Telemetry_Service SHALL expose resetTelemetry() for testing purposes

### Requirement 6: Integration Points

**User Story:** As a developer, I want telemetry integrated into existing pipeline, so that collection is automatic.

#### Acceptance Criteria

1. WHEN routeThroughPipeline completes THEN it SHALL call emitPipelineRun automatically
2. WHEN ActionRunner quarantines a file THEN it SHALL call emitQuarantineWritten automatically
3. THE integration SHALL NOT change existing function signatures or return types
4. THE integration SHALL have minimal performance impact (< 1ms overhead)

### Requirement 7: Design Quality Telemetry

**User Story:** As a product owner, I want design-quality metrics collected, so that I can track WOW-quality improvements over time.

#### Acceptance Criteria

1. WHEN a prompt is enhanced THEN the Telemetry_Service SHALL emit a design_quality event
2. WHEN design_quality event is emitted THEN it SHALL include designQualityScore, stylePackId, designCuesCoverage, and layoutUniquenessHash
3. THE Telemetry_Service SHALL aggregate average designQualityScore and uniqueness rate
4. THE Telemetry_Service SHALL expose getDesignQualityStats() returning aggregated design metrics

