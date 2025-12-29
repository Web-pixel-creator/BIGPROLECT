import type { SelectionResult } from './smartComponentSelector.server';

export class StructuredPromptBuilder {
  build(selection: SelectionResult, userRequest: string): string {
    const deps = selection.dependencies
      .filter((dep) => dep && dep !== 'shadcn-ui-base')
      .sort((a, b) => a.localeCompare(b));

    const componentBlocks = selection.components
      .map(
        (c, i) => `
### Component ${i + 1}: ${c.name} (${c.source})
Category: ${c.category}
Description: ${c.description || '—'}

\`\`\`tsx
${c.code}
\`\`\`
`,
      )
      .join('\n');

    const effectBlocks = selection.effects
      .map(
        (c, i) => `
### Effect ${i + 1}: ${c.name} (${c.source})
Category: ${c.category}
Description: ${c.description || '—'}

\`\`\`tsx
${c.code}
\`\`\`
`,
      )
      .join('\n');

    return `
## SELECTED UI BUILDING BLOCKS (USE THESE FIRST)
The user asked:
${userRequest}

You are in a Vite + React + TypeScript project (NOT Next.js).
Path alias \`@\` points to \`src\` (already configured).
\`src/lib/utils.ts\` provides \`cn()\` (already available).
\`src/components/ui\` contains baseline primitives (button, input, card, badge, separator).

### Dependencies (add to package.json if missing)
${deps.map((d) => `- ${d}`).join('\n')}

### Components
${componentBlocks || '_No matching components found._'}

### Effects
${effectBlocks || '_No matching effects found._'}

### Rules (critical)
- Prefer the provided code blocks above; do not invent random placeholders.
- Icons: import from \`lucide-react\` via named imports. NEVER import from \`lucide-react/dist\`.
- Do NOT use \`next/*\` imports (use plain React/Vite APIs).
- Do NOT use \`react-router-dom\` unless you also add it to \`package.json\` and wire routes intentionally.
- If you need extra UI primitives under \`src/components/ui\`, create them there (do not import from non-existent paths).
`;
  }
}
