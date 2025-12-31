import effectsList from '~/lib/constants/effects-list.json';
import effectsRegistry from '~/lib/constants/effects-registry.json';

type EffectListItem = {
  id: string;
  label: string;
  hint?: string;
};

type EffectRegistryItem = {
  id: string;
  name?: string;
  hint?: string;
  source?: string;
  category?: string;
  code?: string;
  tags?: string[];
};

type EffectsRegistryJson = {
  effects: EffectRegistryItem[];
};

export type EffectRecipesOptions = {
  maxEffects?: number;
  includeCode?: boolean;
  maxCodeChars?: number;
  maxTotalCodeChars?: number;
};

const EFFECTS: EffectListItem[] = (effectsList as EffectListItem[]) ?? [];
const EFFECT_ID_TO_META = new Map<string, EffectListItem>();
for (const effect of EFFECTS) {
  EFFECT_ID_TO_META.set(effect.id.toLowerCase(), effect);
}

const EFFECT_REGISTRY: EffectsRegistryJson = effectsRegistry as EffectsRegistryJson;
const EFFECT_ID_TO_REGISTRY = new Map<string, EffectRegistryItem>();
for (const entry of EFFECT_REGISTRY.effects ?? []) {
  EFFECT_ID_TO_REGISTRY.set(entry.id.toLowerCase(), entry);
}

function normalizeRegistryImports(code: string): string {
  // Some sources use "@/registry/ui/*" in code snippets; our baseline uses "@/components/ui/*".
  return code.replace(/(['"])@\/registry\/ui\//g, '$1@/components/ui/');
}

function classifyEffect(idLower: string): 'background' | 'cursor' | 'button' | 'card' | 'text' | 'component' {
  if (
    idLower.includes('background') ||
    idLower.includes('grid') ||
    idLower.includes('pattern') ||
    idLower.includes('aurora') ||
    idLower.includes('warp') ||
    idLower.includes('beams') ||
    idLower.includes('meteors') ||
    idLower.includes('stars') ||
    idLower.includes('spotlight') ||
    idLower.includes('plasma') ||
    idLower.includes('ripple')
  ) {
    return 'background';
  }

  if (idLower.includes('cursor') || idLower.includes('pointer')) {
    return 'cursor';
  }

  if (idLower.includes('button')) {
    return 'button';
  }

  if (
    idLower.includes('card') ||
    idLower.includes('border') ||
    idLower.includes('beam') ||
    idLower.includes('glow') ||
    idLower.includes('hover')
  ) {
    return 'card';
  }

  if (idLower.includes('text') || idLower.includes('typewriter') || idLower.includes('typing') || idLower.includes('scramble')) {
    return 'text';
  }

  return 'component';
}

function buildApplyInstructions(kind: ReturnType<typeof classifyEffect>): string {
  switch (kind) {
    case 'background':
      return [
        `- Apply as a background wrapper (App or Hero): render it behind content (use a relative parent + absolute inset-0 + negative z-index or pointer-events-none).`,
        `- Prefer applying to the Hero first; if the effect is subtle, apply to the whole page.`,
      ].join('\n');
    case 'cursor':
      return [
        `- Apply once at the root of the app (top-level overlay).`,
        `- Make sure it does not block UI interactions: use \`pointer-events-none\` for overlays unless the component explicitly needs events.`,
      ].join('\n');
    case 'button':
      return [
        `- Apply to the primary CTA button(s) (Hero + main CTA section).`,
        `- Keep the original button label; do not add extra random CTAs.`,
      ].join('\n');
    case 'card':
      return [
        `- Apply to cards (features/services/products/pricing): wrap each card or replace card container with this component.`,
        `- Keep layout the same; only enhance visuals/interaction.`,
      ].join('\n');
    case 'text':
      return [
        `- Apply to the main headline (Hero) and optionally one section title.`,
        `- Keep copy minimal; do not replace the whole page with animated text.`,
      ].join('\n');
    case 'component':
    default:
      return [
        `- Treat this as a UI building block: use it where it logically fits the requested sections.`,
        `- If it's a "demo" component, adapt its content to the current theme and keep dependencies intact.`,
      ].join('\n');
  }
}

export function extractEffectIdsFromText(text: string, options?: { maxEffects?: number }): string[] {
  if (!text) return [];

  const lower = text.toLowerCase();
  const matches: Array<{ id: string; idx: number }> = [];

  // O(n*m) but n is small and m is a few hundred; keeps correct "order of appearance".
  for (const effect of EFFECTS) {
    const idLower = effect.id.toLowerCase();
    const idx = lower.indexOf(idLower);
    if (idx === -1) continue;
    matches.push({ id: effect.id, idx });
  }

  matches.sort((a, b) => a.idx - b.idx);

  const unique: string[] = [];
  const seen = new Set<string>();
  for (const match of matches) {
    const key = match.id.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(match.id);
    if (options?.maxEffects && unique.length >= options.maxEffects) break;
  }

  return unique;
}

export function buildEffectRecipesPromptSection(userPrompt: string, opts?: EffectRecipesOptions): string | null {
  const maxEffects = opts?.maxEffects ?? 4;
  const includeCode = opts?.includeCode ?? true;
  const maxCodeChars = opts?.maxCodeChars ?? 12_000;
  const maxTotalCodeChars = opts?.maxTotalCodeChars ?? 24_000;

  const effectIds = extractEffectIdsFromText(userPrompt, { maxEffects });
  if (!effectIds.length) return null;

  const omitted = extractEffectIdsFromText(userPrompt, { maxEffects: 999 }).slice(effectIds.length);

  let remainingCodeChars = maxTotalCodeChars;

  const header = [
    `### EFFECT APPLICATION RECIPES (MANDATORY)`,
    `You MUST apply every selected effect below at least once in the generated UI.`,
    `- Do NOT just mention effects in text; integrate them in the actual UI code.`,
    `- Use React + Vite compatible code (no \`next/*\`, no \`react-router-dom\`).`,
    `- If you see imports from \`@/registry/ui/*\` in provided snippets, replace them with \`@/components/ui/*\`.`,
  ].join('\n');

  const sections: string[] = [header];

  for (const id of effectIds) {
    const meta = EFFECT_ID_TO_META.get(id.toLowerCase());
    const registry = EFFECT_ID_TO_REGISTRY.get(id.toLowerCase());
    const hint = meta?.hint || registry?.hint || id;
    const kind = classifyEffect(id.toLowerCase());

    const lines: string[] = [];
    lines.push(`\n#### ${id} - ${hint}`);
    lines.push(buildApplyInstructions(kind));

    if (includeCode && registry?.code) {
      const normalized = normalizeRegistryImports(registry.code);
      const fitsSingle = normalized.length <= maxCodeChars;
      const fitsBudget = normalized.length <= remainingCodeChars;

      if (fitsSingle && fitsBudget) {
        lines.push(`\nInline component in \`src/App.tsx\` (define a helper component above App).`);
        lines.push('```tsx');
        lines.push(normalized.trim());
        lines.push('```');
        remainingCodeChars -= normalized.length;
      } else {
        lines.push(
          `\n(Code omitted due to context budget. Implement a minimal compatible version of \`${id}\` and keep it small.)`,
        );
      }
    } else {
      lines.push(`\n(No code snippet found for \`${id}\`. Implement a minimal compatible version or skip the effect ONLY if impossible.)`);
    }

    sections.push(lines.join('\n'));
  }

  if (omitted.length) {
    sections.push(`\n(Additional selected effects omitted from recipes due to limit: ${omitted.join(', ')})`);
  }

  if (includeCode && maxTotalCodeChars > 0) {
    sections.push(`\n(Note: Effect code snippets are capped to keep prompts small.)`);
  }

  return sections.join('\n');
}
