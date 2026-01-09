export type PromptVariant = 'baseline' | 'fewshot-v1';

export interface VariantConfig {
  id: PromptVariant;
  enabled: boolean;
  weight: number;
}

export const DEFAULT_TIMESTAMP_BUCKET_MS = 60 * 60 * 1000;

export const VARIANT_REGISTRY: Record<PromptVariant, VariantConfig> = {
  baseline: {
    id: 'baseline',
    enabled: true,
    weight: 50,
  },
  'fewshot-v1': {
    id: 'fewshot-v1',
    enabled: true,
    weight: 50,
  },
};

export interface SelectVariantOptions {
  filename: string;
  nowMs: number;
  timestampBucketMs?: number;
  forceVariant?: PromptVariant;
  registry?: Record<PromptVariant, VariantConfig>;
}

export function getEnabledVariants(registry: Record<PromptVariant, VariantConfig>): VariantConfig[] {
  return Object.values(registry).filter(v => v.enabled && v.weight > 0);
}

function hashStringToUint32(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pickWeighted(variants: VariantConfig[], pick: number): PromptVariant {
  let cursor = 0;
  for (const v of variants) {
    cursor += v.weight;
    if (pick < cursor) return v.id;
  }
  return variants[0]?.id ?? 'baseline';
}

function getEnvForceVariant(): PromptVariant | undefined {
  const raw = (typeof process !== 'undefined' ? process.env?.BOLT_PROMPT_VARIANT_FORCE : undefined) ?? '';
  if (raw === 'baseline' || raw === 'fewshot-v1') return raw;
  return undefined;
}

export function selectVariant(options: SelectVariantOptions): PromptVariant {
  const registry = options.registry ?? VARIANT_REGISTRY;
  const force = options.forceVariant ?? getEnvForceVariant();
  if (force && registry[force]) {
    return force;
  }

  const enabled = getEnabledVariants(registry);
  if (enabled.length === 0) return 'baseline';
  if (enabled.length === 1) return enabled[0].id;

  const bucketMs = options.timestampBucketMs ?? DEFAULT_TIMESTAMP_BUCKET_MS;
  const bucket = Math.floor(options.nowMs / bucketMs);
  const key = `${options.filename}|${bucket}`;

  const totalWeight = enabled.reduce((sum, v) => sum + v.weight, 0);
  const pick = totalWeight > 0 ? hashStringToUint32(key) % totalWeight : 0;
  return pickWeighted(enabled, pick);
}

export function getVariantConfig(variant: PromptVariant, registry: Record<PromptVariant, VariantConfig> = VARIANT_REGISTRY): VariantConfig {
  return registry[variant] ?? registry.baseline;
}
