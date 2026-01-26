/**
 * Design quality scoring helpers.
 */

export type DesignCues = {
  typography: string;
  layout: string;
  visualHierarchy: string;
  motion: string;
};

export type DesignCueCoverage = {
  typography: boolean;
  layout: boolean;
  visualHierarchy: boolean;
  motion: boolean;
};

export type DesignQualityInput = {
  designCues?: Partial<DesignCues> | null;
  stylePackId?: string | null;
  layoutArchetype?: string | null;
  layoutUniquenessHash?: string | null;
  signatureMoves?: string[] | null;
  effectIds?: string[] | null;
  sectionOrder?: string[] | null;
};

export type DesignQualityScoreResult = {
  score: number;
  reasons: string[];
  coverage: DesignCueCoverage;
};

const BASE_SCORE = 25;
const CUE_SCORE = 10;
const STYLE_PACK_SCORE = 8;
const ARCHETYPE_SCORE = 7;
const UNIQUENESS_SCORE = 7;
const SIGNATURE_SCORE = 5;
const EFFECT_SCORE = 4;
const SECTION_SCORE = 4;

function hasText(value?: string | null): boolean {
  return Boolean(value && value.trim().length > 0);
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function buildDesignQualityScore(input: DesignQualityInput): DesignQualityScoreResult {
  const coverage: DesignCueCoverage = {
    typography: hasText(input.designCues?.typography),
    layout: hasText(input.designCues?.layout),
    visualHierarchy: hasText(input.designCues?.visualHierarchy),
    motion: hasText(input.designCues?.motion),
  };

  const reasons: string[] = [];
  let score = BASE_SCORE;

  if (coverage.typography) {
    score += CUE_SCORE;
  } else {
    reasons.push('Missing typography cue');
  }

  if (coverage.layout) {
    score += CUE_SCORE;
  } else {
    reasons.push('Missing layout cue');
  }

  if (coverage.visualHierarchy) {
    score += CUE_SCORE;
  } else {
    reasons.push('Missing visual hierarchy cue');
  }

  if (coverage.motion) {
    score += CUE_SCORE;
  } else {
    reasons.push('Missing motion cue');
  }

  if (hasText(input.stylePackId ?? undefined)) {
    score += STYLE_PACK_SCORE;
  } else {
    reasons.push('Missing style pack id');
  }

  if (hasText(input.layoutArchetype ?? undefined)) {
    score += ARCHETYPE_SCORE;
  } else {
    reasons.push('Missing layout archetype');
  }

  if (hasText(input.layoutUniquenessHash ?? undefined)) {
    score += UNIQUENESS_SCORE;
  } else {
    reasons.push('Missing layout uniqueness hash');
  }

  if ((input.signatureMoves ?? []).length > 0) {
    score += SIGNATURE_SCORE;
  } else {
    reasons.push('No signature moves provided');
  }

  if ((input.effectIds ?? []).length > 0) {
    score += EFFECT_SCORE;
  } else {
    reasons.push('No effects selected');
  }

  if ((input.sectionOrder ?? []).length >= 5) {
    score += SECTION_SCORE;
  } else {
    reasons.push('Low section variety');
  }

  return {
    score: clampScore(score),
    reasons,
    coverage,
  };
}
