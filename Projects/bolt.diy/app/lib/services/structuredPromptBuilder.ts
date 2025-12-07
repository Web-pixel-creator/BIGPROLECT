import type { SelectionResult } from './smartComponentSelector.ts';

export class StructuredPromptBuilder {
  build(selection: SelectionResult, userRequest: string): string {
    const comps = selection.components;
    const effects = selection.effects;
    const deps = selection.dependencies;

    return `
You are a senior front-end engineer. Build exactly what the user asks, using ONLY the provided components.

## USER REQUEST
${userRequest}

## MANDATORY COMPONENTS (USE AS-IS, ONLY CHANGE CONTENT/TEXT/PROPS)
${comps
  .map(
    (c, i) => `
${i + 1}. ${c.name} [${c.source}]
Description: ${c.description}
Category: ${c.category}
Code:
\`\`\`tsx
${c.code}
\`\`\`
`
  )
  .join('\n')}

## EFFECTS (OPTIONAL IF RELEVANT)
${effects
  .map(
    (c, i) => `
Effect ${i + 1}: ${c.name} [${c.source}]
Description: ${c.description}
Code:
\`\`\`tsx
${c.code}
\`\`\`
`
  )
  .join('\n')}

## DEPENDENCIES
\`\`\`json
{
  "dependencies": {
    ${deps.map((d) => `"${d}": "latest"`).join(',\n    ')}
  }
}
\`\`\`

## FILE CREATION ORDER (CRITICAL)
1. package.json (include dependencies above)
2. src/lib/utils.ts (cn helper if needed)
3. src/components/ui/* (base UI if required)
4. src/components/sections/* (place components here)
5. src/App.tsx (compose the page)
6. src/index.css or globals (styles)

## RULES
- Do NOT invent new components. Use ONLY the ones provided above.
- Keep structure: import components, place them in App, adjust text/images to match the request.
- Keep code minimal; do not add extra dependencies beyond listed.
- If multiple components serve same section, choose the best fit from the provided list.
`;
  }
}
