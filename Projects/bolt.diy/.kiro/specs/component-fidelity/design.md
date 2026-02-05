# Design Document: Component Fidelity Pipeline

## Overview

The pipeline is component-first. It selects approved components from a curated
index (Shadcn + MagicUI), builds a shared `RenderPlan`, and feeds that plan into:

- `promptEnhancer`
- `enhancedPromptGenerator`

Design quality telemetry is emitted for every variant.

## Architecture

1. Parse prompt or brief (theme, sections, style cues).
2. Build candidate pool from ComponentIndex.
3. Select per-section candidates via selector policy.
4. Build shared RenderPlan with style tokens and layout hash.
5. Generate prompt text from RenderPlan.
6. Emit design telemetry for ranking and monitoring.

## Core Data Models

```ts
export type ComponentIndexEntry = {
  id: string;
  sectionType: string;
  source: 'shadcn' | 'magicui';
  propsContract: string[];
  visualTags: string[];
  styleTags: string[];
  layoutArchetype: string;
  dependencies: string[];
  tokenCompatibility?: {
    typography?: boolean;
    spacing?: boolean;
    radius?: boolean;
    colors?: boolean;
  };
};
```

```ts
export type RenderPlanSection = {
  sectionType: string;
  componentId: string;
  propsContract: string[];
  layoutArchetype: string;
  styleTokens: {
    typography: string;
    spacing: string;
    radius: string;
    colors: string[];
  };
};

export type RenderPlan = {
  seed: number;
  layoutArchetype?: string;
  layoutUniquenessHash: string;
  sections: RenderPlanSection[];
};
```

```ts
export type ComponentSelectionPlan = {
  eligibleSections: number;
  matchedSections: number;
  fallbackCount: number;
  matchRate: number;
  fallbackRate: number;
  repeatPenaltyTriggered: boolean;
  avgCandidatesPerSection: number;
  selections: Array<{
    sectionType: string;
    componentId: string;
    source: string;
    layoutArchetype: string;
    propsContract: string[];
  }>;
};
```

## Selection Policy

Per section:

1. Filter by `sectionType`.
2. Filter by allowlisted dependencies.
3. Filter by token compatibility validator.
4. Score candidates:

```ts
score =
  0.4 * keywordMatch +
  0.3 * tagMatch +
  0.2 * styleCompatibility +
  0.1 * sectionAffinity -
  recencyPenalty;
```

5. Keep ranked candidates, select from Top-K using seeded RNG.
6. Fallback to curated pool when no scored candidate exists.

## Diversity Strategy

- New seed per run by default.
- `layoutUniquenessHash` computed from seed + layout archetype + section/component mapping.
- On duplicate hash, reroll up to 2 retries.

## Style Normalization

RenderPlan assigns normalized style tokens and exports CSS variable map:

```ts
{
  '--ds-typography': string,
  '--ds-spacing': string,
  '--ds-radius': string,
  '--ds-color-1': string,
  '--ds-color-2': string,
  '--ds-color-3': string,
}
```

Components failing required token compatibility are excluded before selection.

## Telemetry

Per design variant event:

- quality/ranking fields
- component metrics (`componentMatchRate`, `componentFallbackRate`)
- repetition signal (`repeatPenaltyTriggered`)
- selector breadth (`avgCandidatesPerSection`)

Summary API exposes aggregate rates and averages.

## Guardrails

- Frontend-only guardrail in generated prompts.
- Forbidden dependencies excluded by selector.
- Token-incompatible components excluded by validator.
- Backend artifact warning detection remains a tracked follow-up.
