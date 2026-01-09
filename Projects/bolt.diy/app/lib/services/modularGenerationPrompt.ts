import { determineStrategy } from './generationRouter';
import { SECTION_DEFINITIONS, type SectionPlan } from './sectionGenerator';

export type ModularGenerationAddon = {
  enabled: boolean;
  strategy: 'single' | 'modular';
  reason: string;
  plan?: SectionPlan;
  addon: string;
};

export function buildModularGenerationAddon(userPrompt: string): ModularGenerationAddon {
  const decision = determineStrategy(userPrompt);

  if (decision.strategy !== 'modular' || !decision.plan) {
    return {
      enabled: false,
      strategy: decision.strategy,
      reason: decision.reason,
      addon: '',
    };
  }

  const plan = decision.plan;

  const sectionFiles = plan.sections
    .map((sectionType) => {
      const def = SECTION_DEFINITIONS[sectionType];
      return {
        sectionType,
        componentName: def.name,
        filePath: `src/components/${def.name}.tsx`,
      };
    })
    .filter(Boolean);

  const fileList = sectionFiles
    .map((s) => `- ${s.filePath} (export function ${s.componentName}(), data-section: "${s.sectionType}")`)
    .join('\n');

  const usageList = sectionFiles.map((s) => `      <${s.componentName} />`).join('\n');
  const importList = sectionFiles
    .map((s) => `import { ${s.componentName} } from "./components/${s.componentName}";`)
    .join('\n');

  const addon = `
<modular_generation>
MODULAR WEBSITE MODE (override for this request)

- OVERRIDE: The earlier rule “Отдельные файлы компонентов (все класть в src/App.tsx)” does NOT apply here.
- For a full website/landing page, create separate section component files under src/components/.
- Each section component MUST:
  - export a named component (no default export)
  - return a single root <section data-section="..."> ... </section>
  - keep all section markup inside that file (App.tsx only composes)

CRITICAL OUTPUT ORDER (still required): package.json must be the FIRST file.
You may insert additional section component files after src/App.tsx and before src/index.css.

RECOMMENDED SECTION FILES FOR THIS REQUEST:
${fileList}

src/App.tsx composition pattern (adapt styling as needed):
${importList}

export default function App() {
  return (
    <div className="min-h-screen">
${usageList}
    </div>
  );
}
</modular_generation>
`;

  return {
    enabled: true,
    strategy: decision.strategy,
    reason: decision.reason,
    plan,
    addon,
  };
}
