import type { SelectionResult } from './smartComponentSelector.ts';

export class StructuredPromptBuilder {
  build(selection: SelectionResult, userRequest: string): string {
    const comps = selection.components;
    const effects = selection.effects;

    // Simple prompt without complex code examples that cause syntax issues
    return `
You are a senior front-end engineer. Build exactly what the user asks.

## USER REQUEST
${userRequest}

## COMPONENTS TO USE
${comps
  .map(
    (c, i) => `
${i + 1}. ${c.name} [${c.source}]
Description: ${c.description}
Category: ${c.category}
`,
  )
  .join('\n')}

## EFFECTS (OPTIONAL)
${effects
  .map(
    (c, i) => `
Effect ${i + 1}: ${c.name} [${c.source}]
Description: ${c.description}
`,
  )
  .join('\n')}

## RULES
- Use plain Tailwind CSS for styling
- Do NOT use framer-motion (use CSS animations instead)
- Do NOT import from @/components/ui/* (create inline with Tailwind)
- Do NOT use cn() function (use template literals for conditional classes)
- Icons: import from 'lucide-react' (named imports). NEVER import from 'lucide-react/dist'.
- Do NOT use next/image (use plain <img src=\"...\" alt=\"...\" loading=\"lazy\" />)
- Do NOT use react-router-dom (no <Link>), use simple <a href=\"#\"> or <button> instead
- Do NOT default-import \"Lucide\"; import specific icons via named imports from 'lucide-react'
- Keep code simple and self-contained
`;
  }
}
