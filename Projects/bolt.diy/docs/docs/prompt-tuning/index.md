# Prompt Tuning

A/B testing system for repair prompts.

## Variants

| Variant | Few-Shot | Boundaries | Description |
|---------|----------|------------|-------------|
| `baseline` | ❌ | ❌ | Basic repair prompt |
| `fewshot-v1` | ✅ | ✅ | Examples + risk-based instructions |

## Selection Logic

Deterministic selection based on filename + timestamp:
```typescript
const bucket = hash(filename + timestampBucket) % 100;
return bucket < 50 ? 'baseline' : 'fewshot-v1';
```

## Force Variant

For debugging:
```bash
BOLT_PROMPT_VARIANT_FORCE=fewshot-v1 npm run dev
```

## Telemetry

Metrics tracked per variant:
- `successRate` - Fix success %
- `quarantineRate` - Failed repair %
- `fallbackRate` - Primary → fallback %
- `avgAttempts` - Mean retry count

## Key Files

| File | Purpose |
|------|---------|
| `promptVariants.ts` | Variant selection |
| `fewShotExamples.ts` | Example library |
| `autoFixLoop.ts` | Prompt builders |
