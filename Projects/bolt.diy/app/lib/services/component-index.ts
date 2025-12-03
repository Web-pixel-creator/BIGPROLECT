import * as fs from 'fs';
import * as path from 'path';

export type ComponentMeta = {
  name: string;
  description: string;
  category: string;
  source: string;
  code: string;
  rawCategory?: string;
  tags?: string[];
};

export type ComponentIndex = {
  components: ComponentMeta[];
  total: number;
};

const MD_FILES = [
  'shadcnui-blocks.md',
  'aceternity-components.md',
  'kokonutui-components.md',
  'magicui-components.md',
  'reactbits-components.md',
];

export function buildIndex(mdDir: string = process.cwd()): ComponentIndex {
  const components: ComponentMeta[] = [];

  for (const file of MD_FILES) {
    const fullPath = path.resolve(mdDir, file);
    if (!fs.existsSync(fullPath)) continue;
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    let currentCategory = file.replace('.md', '').toLowerCase();
    let currentRawCategory = currentCategory;
    let currentComponent: Partial<ComponentMeta> | null = null;
    let codeBuffer: string[] = [];
    let inCode = false;

    for (const line of lines) {
      if (line.startsWith('## ')) {
        currentRawCategory = line.replace('## ', '').trim();
        currentCategory = currentRawCategory.split(' ')[0].toLowerCase();
        continue;
      }
      if (line.startsWith('### ')) {
        if (currentComponent?.name) {
          components.push({
            name: currentComponent.name,
            description: currentComponent.description || '',
            category: currentCategory,
            source: file,
            code: (currentComponent.code || '').trim(),
            rawCategory: currentRawCategory,
            tags: [...new Set([currentCategory, ...(currentRawCategory ? currentRawCategory.toLowerCase().split(/\s+/) : [])])],
          });
        }
        const match = line.match(/### (.+?) \((.+?)\)/);
        if (match) {
          currentComponent = {
            description: match[1],
            name: match[2],
            category: currentCategory,
            source: file,
            code: '',
          };
        }
        codeBuffer = [];
        continue;
      }
      if (line.startsWith('```')) {
        if (inCode && currentComponent) {
          currentComponent.code = (currentComponent.code || '') + codeBuffer.join('\n') + '\n\n';
          codeBuffer = [];
        }
        inCode = !inCode;
        continue;
      }
      if (inCode) codeBuffer.push(line);
    }

    if (currentComponent?.name) {
          components.push({
            name: currentComponent.name,
            description: currentComponent.description || '',
            category: currentCategory,
            source: file,
            code: (currentComponent.code || '').trim(),
            rawCategory: currentRawCategory,
            tags: [...new Set([currentCategory, ...(currentRawCategory ? currentRawCategory.toLowerCase().split(/\s+/) : [])])],
          });
        }
      }

  return { components, total: components.length };
}
