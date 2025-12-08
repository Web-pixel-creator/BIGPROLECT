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

## DEPENDENCIES (MUST ADD TO package.json FIRST!)
\`\`\`json
{
  "dependencies": {
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "class-variance-authority": "^0.7.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.300.0",
    ${deps.map((d) => `"${d}": "latest"`).join(',\n    ')}
  }
}
\`\`\`

## FILE CREATION ORDER (CRITICAL - FOLLOW EXACTLY!)
1. package.json (MUST include ALL dependencies above - clsx, tailwind-merge, framer-motion!)
2. src/lib/utils.ts (REQUIRED - create cn helper):
   \`\`\`typescript
   import { clsx, type ClassValue } from "clsx";
   import { twMerge } from "tailwind-merge";
   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   \`\`\`
3. src/components/ui/* (base UI if required)
4. src/components/sections/* (place components here)
5. src/App.tsx (compose the page)
6. src/index.css or globals (styles)

## RULES (CRITICAL!)
- ALWAYS create package.json FIRST with ALL dependencies (clsx, tailwind-merge, framer-motion)
- ALWAYS create src/lib/utils.ts with cn() function BEFORE any component
- Do NOT invent new components. Use ONLY the ones provided above.
- Keep structure: import components, place them in App, adjust text/images to match the request.
- If component uses twMerge or cn - the dependencies MUST be in package.json!
- If multiple components serve same section, choose the best fit from the provided list.
`;
  }
}
