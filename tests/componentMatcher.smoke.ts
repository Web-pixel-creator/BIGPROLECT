import assert from 'assert';
import { componentMatcher } from '../Projects/bolt.diy/app/lib/services/componentMatcher.ts';

async function main() {
  // Загружаем индекс из prebuild/MD
  await componentMatcher.loadAllComponentFiles();

  const request = 'Сделай лендинг автосалона с красивой шапкой и героем';

  const analysis = componentMatcher.analyzeUserRequest(request);
  assert(analysis.theme === 'auto', `Theme detection failed: ${analysis.theme}`);
  assert(
    analysis.components.includes('hero'),
    `Expected hero in components, got ${analysis.components.join(', ')}`,
  );
  assert(
    analysis.components.includes('header') || analysis.components.includes('navbar'),
    'Expected header/navbar in components',
  );

  const ctx1 = componentMatcher.generateContextForPrompt(request, 3);
  const ctx2 = componentMatcher.generateContextForPrompt(request, 3);
  assert(ctx1 && ctx1.includes('<matched_ui_components>'), 'Context should not be empty');
  assert.strictEqual(ctx1, ctx2, 'Context should be deterministic for the same request');

  console.log('componentMatcher smoke tests passed');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
