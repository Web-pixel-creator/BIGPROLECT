// Build a component index/cache from MD libraries
const fs = require('fs');
const path = require('path');

const MD_FILES = [
  'shadcnui-blocks.md',
  'aceternity-components.md',
  'kokonutui-components.md',
  'magicui-components.md',
  'reactbits-components.md',
];

const CACHE_PATH = 'Projects/bolt.diy/app/lib/services/component-index-cache.json';

function buildIndex(mdDir = process.cwd()) {
  const components = [];

  for (const file of MD_FILES) {
    const fullPath = path.resolve(mdDir, file);
    if (!fs.existsSync(fullPath)) continue;
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    let currentCategory = file.replace('.md', '').toLowerCase();
    let currentRawCategory = currentCategory;
    let currentComponent = null;
    let codeBuffer = [];
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

  const index = { components, total: components.length };
  const cacheFullPath = path.resolve(process.cwd(), CACHE_PATH);
  const dir = path.dirname(cacheFullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(cacheFullPath, JSON.stringify(index, null, 2), 'utf8');
  console.log(`Index built: ${index.total} components -> ${CACHE_PATH}`);
}

buildIndex();
