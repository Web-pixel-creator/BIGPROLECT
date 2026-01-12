# Requirements Document

## Introduction

\u0420\u0435\u0444\u0430\u043a\u0442\u043e\u0440\u0438\u043d\u0433 \u043c\u043e\u0434\u0443\u043b\u044f promptEnhancer.ts \u2014 \u043a\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043a\u0438 \u0432\u0430\u0436\u043d\u0430\u044f \u0437\u0430\u0434\u0430\u0447\u0430 \u0434\u043b\u044f \u0432\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u044f \u0440\u0430\u0431\u043e\u0442\u043e\u0441\u043f\u043e\u0441\u043e\u0431\u043d\u043e\u0441\u0442\u0438 \u0440\u0443\u0441\u0441\u043a\u043e\u044f\u0437\u044b\u0447\u043d\u044b\u0445 \u043f\u0440\u043e\u043c\u043f\u0442\u043e\u0432 \u0438 \u0443\u043b\u0443\u0447\u0448\u0435\u043d\u0438\u044f maintainability \u043a\u043e\u0434\u043e\u0432\u043e\u0439 \u0431\u0430\u0437\u044b. \u0422\u0435\u043a\u0443\u0449\u0438\u0439 \u043c\u043e\u043d\u043e\u043b\u0438\u0442 \u0432 ~2900 \u0441\u0442\u0440\u043e\u043a \u0441\u043e\u0434\u0435\u0440\u0436\u0438\u0442 \u0431\u0438\u0442\u0443\u044e \u043a\u043e\u0434\u0438\u0440\u043e\u0432\u043a\u0443 RU keywords \u0432 component-aliases.json \u0438 \u0441\u043c\u0435\u0448\u0438\u0432\u0430\u0435\u0442 \u0434\u0430\u043d\u043d\u044b\u0435 \u0441 \u043b\u043e\u0433\u0438\u043a\u043e\u0439, \u0447\u0442\u043e \u0437\u0430\u0442\u0440\u0443\u0434\u043d\u044f\u0435\u0442 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0443 \u0438 \u0442\u0435\u0441\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435.

## Glossary

- **Prompt_Enhancer**: \u0421\u0435\u0440\u0432\u0438\u0441 \u043e\u0431\u043e\u0433\u0430\u0449\u0435\u043d\u0438\u044f \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u0441\u043a\u0438\u0445 \u043f\u0440\u043e\u043c\u043f\u0442\u043e\u0432 \u0442\u0435\u043c\u0430\u043c\u0438, \u0446\u0432\u0435\u0442\u0430\u043c\u0438 \u0438 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f\u043c\u0438
- **Theme_Keywords**: \u0421\u043b\u043e\u0432\u0430\u0440\u0438 \u043a\u043b\u044e\u0447\u0435\u0432\u044b\u0445 \u0441\u043b\u043e\u0432 \u0434\u043b\u044f \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u0438\u044f \u0442\u0435\u043c\u0430\u0442\u0438\u043a\u0438 \u043f\u0440\u043e\u043c\u043f\u0442\u0430 (EN/RU)
- **Baseline**: \u042d\u0442\u0430\u043b\u043e\u043d\u043d\u044b\u0435 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u0440\u0430\u0431\u043e\u0442\u044b \u0441\u0438\u0441\u0442\u0435\u043c\u044b \u0434\u043e \u0440\u0435\u0444\u0430\u043a\u0442\u043e\u0440\u0438\u043d\u0433\u0430
- **Encoding_Fix**: \u0412\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435 \u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u043e\u0439 UTF-8 \u043a\u043e\u0434\u0438\u0440\u043e\u0432\u043a\u0438 \u0440\u0443\u0441\u0441\u043a\u0438\u0445 \u0441\u0442\u0440\u043e\u043a
- **Data_Split**: \u0420\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u0435 \u0434\u0430\u043d\u043d\u044b\u0445 (\u0441\u043b\u043e\u0432\u0430\u0440\u0435\u0439) \u0438 \u043b\u043e\u0433\u0438\u043a\u0438 (\u0444\u0443\u043d\u043a\u0446\u0438\u0439) \u043d\u0430 \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u044b\u0435 \u043c\u043e\u0434\u0443\u043b\u0438
- **Circular_Dependency**: \u0426\u0438\u043a\u043b\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0437\u0430\u0432\u0438\u0441\u0438\u043c\u043e\u0441\u0442\u044c \u043c\u0435\u0436\u0434\u0443 \u043c\u043e\u0434\u0443\u043b\u044f\u043c\u0438
- **Structural_Invariants**: \u041f\u0440\u043e\u0432\u0435\u0440\u044f\u0435\u043c\u044b\u0435 \u0441\u0432\u043e\u0439\u0441\u0442\u0432\u0430 \u0432\u044b\u0432\u043e\u0434\u0430: theme, sectionsCount, hasRequiredKeys (palette, images)
- **Cold_Import_Time**: \u0412\u0440\u0435\u043c\u044f \u043f\u0435\u0440\u0432\u043e\u0433\u043e \u0438\u043c\u043f\u043e\u0440\u0442\u0430 \u043c\u043e\u0434\u0443\u043b\u044f (median \u0438\u0437 5 \u043f\u0440\u043e\u0433\u043e\u043d\u043e\u0432)
- **Bundle_Size**: \u0420\u0430\u0437\u043c\u0435\u0440 \u0444\u0430\u0439\u043b\u0430 promptEnhancer.ts \u0432 \u0431\u0430\u0439\u0442\u0430\u0445

## Requirements

### Requirement 1: Baseline \u0444\u0438\u043a\u0441\u0430\u0446\u0438\u044f

**User Story:** As a developer, I want to capture current system behavior before refactoring, so that I can verify no regressions occur.

#### Acceptance Criteria

1. WHEN the baseline script is executed, THE Baseline_System SHALL run 25 test prompts (15 EN + 10 RU, \u0440\u0430\u0437\u043d\u044b\u0435 \u0442\u0435\u043c\u044b \u0438 edge-cases) and save outputs to scripts/baseline-results.json
2. WHEN baseline is captured, THE Baseline_System SHALL record cold import time (median \u0438\u0437 5 \u043f\u0440\u043e\u0433\u043e\u043d\u043e\u0432 \u0432 \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u044b\u0445 \u043f\u0440\u043e\u0446\u0435\u0441\u0441\u0430\u0445 \u0447\u0435\u0440\u0435\u0437 child_process), bundle size (fs.statSync \u043d\u0430 promptEnhancer.ts), output length, \u0438 sections count
3. WHEN baseline script completes, THE Baseline_System SHALL create git tag "pre-refactor-baseline"
4. THE Baseline_System SHALL provide npm scripts "baseline" and "baseline:compare" for automation
5. THE Baseline_System SHALL use structural comparison with error/warning tiers instead of strict equality for LLM outputs
6. WHEN structural comparison is performed, THE Baseline_System SHALL classify theme mismatch and missing required keys as ERRORS (exit 1), and sectionOrder/colors/performance changes as WARNINGS (exit 0)
7. WHEN baseline comparison has only WARNINGS and no ERRORS, THE Baseline_System SHALL exit with code 0 (non-blocking for CI)

### Requirement 2: Encoding \u0432\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435

**User Story:** As a user, I want Russian prompts to work correctly, so that I can generate UI components in Russian language.

#### Acceptance Criteria

1. WHEN a Russian prompt is submitted, THE Prompt_Enhancer SHALL correctly identify theme keywords without encoding errors
2. WHEN component-aliases.json contains corrupted characters ("<MOJIBAKE_QUESTION>", "<MOJIBAKE_QUESTION5>"), THE Encoding_Fix SHALL restore valid UTF-8 strings (componentKeywords section has mojibake for ALL Russian words, themeKeywords is clean)
3. WHEN promptEnhancer.ts is verified, THE Encoding_Validator SHALL confirm THEME_KEYWORDS_RU, RU_COLOR_WORDS, and FALLBACK_BRANDS contain valid UTF-8 (currently clean)
4. WHEN Russian prompt "\u0441\u0430\u0439\u0442 \u043c\u0435\u0431\u0435\u043b\u0438" is processed, THE Prompt_Enhancer SHALL return theme "furniture"
5. IF encoding corruption is detected in any data file, THEN THE Encoding_Validator SHALL fail the build with descriptive error (file, line, column, context)
6. WHEN encoding:check is executed, THE Encoding_Validator SHALL detect mojibake patterns ("<MOJIBAKE_QUESTION>", "\u0420<REPLACEMENT_CHAR>", "\xd0\xba\xd1\u20ac\xd0\xb0\xd1") in addition to U+FFFD and BOM

### Requirement 3: \u041c\u043e\u0434\u0443\u043b\u044c\u043d\u043e\u0435 \u0440\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u0435 \u0434\u0430\u043d\u043d\u044b\u0445

**User Story:** As a developer, I want data dictionaries separated from logic, so that I can maintain and test them independently.

#### Acceptance Criteria

1. WHEN refactoring is complete, THE Prompt_Enhancer logic file SHALL contain \u22641500 lines of code (\u043f\u0435\u0440\u0432\u044b\u0439 \u044d\u0442\u0430\u043f), \u0441 \u0446\u0435\u043b\u044c\u044e \u2264800 \u0441\u0442\u0440\u043e\u043a \u0432 \u043f\u043e\u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0445 \u0438\u0442\u0435\u0440\u0430\u0446\u0438\u044f\u0445
2. WHEN data is extracted, THE Data_Module SHALL export all theme keywords, color mappings, palettes, and image queries
3. WHEN modules are split, THE Import_System SHALL have no circular dependencies (verified by madge with ESM config)
4. WHEN data module is imported, THE Import_System SHALL not execute side effects (no Object.assign at module level)
5. WHILE granular split is performed, THE Data_Module SHALL be organized into theme-keywords.ts, color-mappings.ts, theme-palettes.ts, image-queries.ts
6. THE Data_Module SHALL export merge functions (getMergedKeywords, getMergedColors) instead of mutating objects at import time

### Requirement 4: Regression prevention

**User Story:** As a developer, I want automated checks to prevent regressions, so that refactoring doesn't break existing functionality.

#### Acceptance Criteria

1. WHEN baseline:compare is executed, THE Validation_System SHALL compare structural invariants (sections count, required keys, theme detection) with baseline-results.json
2. WHEN structural invariants differ from baseline, THE Validation_System SHALL report specific differences
3. WHEN cold import time exceeds baseline +15% OR bundle size exceeds baseline +5%, THE Validation_System SHALL warn about regression
4. WHEN circular dependencies are detected, THE Dependency_Checker SHALL fail with list of cycles
5. IF any test fails after refactoring, THEN THE Validation_System SHALL block merge
6. THE Validation_System SHALL use absolute thresholds for latency (\xb150ms) and relative for size (\xb15%)

### Requirement 5: Tooling \u0438 \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0437\u0430\u0446\u0438\u044f

**User Story:** As a developer, I want automated tools for validation, so that I can quickly verify changes are safe.

#### Acceptance Criteria

1. THE npm_scripts SHALL include "baseline", "baseline:compare", "keywords:test", "encoding:check"
2. WHEN encoding:check is executed, THE Encoding_Validator SHALL scan prompt-data/, component-aliases.json, scripts/baseline-prompts.json, and .kiro/specs/ for \\uFFFD, BOM, and mojibake patterns (e.g., "\u0420<REPLACEMENT_CHAR>", "<MOJIBAKE_QUESTION>")
3. WHEN keywords:test is executed, THE Keywords_Validator SHALL verify EN/RU key parity, no duplicates, no empty arrays
4. WHEN madge is executed after split, THE Dependency_Checker SHALL report circular dependencies (with --extensions ts --ts-config tsconfig.json flags for ESM support)
5. WHEN random selection is used (palettes/images), THE RNG SHALL use global seed for deterministic test results (all 4 Math.random locations: lines 1548, 1558, 3199, 3360)
6. THE dev dependencies SHALL include fast-check and madge (pnpm add -D fast-check madge)

### Requirement 6: \u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430\u0446\u0438\u044f

**User Story:** As a future maintainer, I want clear documentation, so that I understand the data structure and encoding rules.

#### Acceptance Criteria

1. WHEN data split is complete, THE Documentation SHALL include README.md in prompt-data/ directory
2. THE Documentation SHALL describe structure of each data file
3. THE Documentation SHALL specify encoding rules (UTF-8, no BOM, \\uXXXX for special chars)
4. THE Documentation SHALL explain how to add new themes/colors with RU/EN synchronization