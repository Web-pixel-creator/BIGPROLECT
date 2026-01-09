import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('~/utils/codeSanitizer', () => ({
  sanitizeGeneratedFile: vi.fn(),
}));

vi.mock('~/utils/codeValidator', () => ({
  validateFile: vi.fn(),
}));

import { sanitizeGeneratedFile } from '~/utils/codeSanitizer';
import { validateFile } from '~/utils/codeValidator';
import { ActionRunner } from './action-runner';

describe('ActionRunner quarantine sidecars', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('writes .invalid plus .errors.json/.sanitizer.json/.metrics.json on hard gate', async () => {
    (sanitizeGeneratedFile as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      content: 'export const Broken = () = > { return <div>broken</div>; }',
      changed: true,
      warnings: ['Fixed truncated <butt> tag names to <button>'],
      structuredWarnings: [
        {
          code: 'SANITIZER_FIX_TRUNCATED_BUTTON',
          message: 'Fixed truncated <butt> tag names to <button>',
          risk: 'low',
        },
      ],
      metrics: {
        changedLinesPercent: 10,
        charsAdded: 0,
        charsRemoved: 0,
        highRiskFixes: 0,
        riskLevel: 'low',
      },
    });

    (validateFile as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      valid: false,
      errors: [
        {
          line: 1,
          column: 1,
          message: 'Mock validation failure',
          code: 9999,
          severity: 'error',
        },
      ],
      unifiedViolations: [
        {
          code: 'SYNTAX_PARSER_CRASH',
          severity: 'error',
          message: 'Mock validation failure',
          autoFixable: false,
          context: { file: 'src/App.tsx', line: 1, column: 1, tsCode: 9999 },
        },
      ],
      fixable: false,
    });

    const writeFile = vi.fn().mockResolvedValue(undefined);
    const mkdir = vi.fn().mockResolvedValue(undefined);

    const webcontainer = {
      workdir: '/',
      fs: {
        mkdir,
        writeFile,
      },
    } as any;

    const alerts: any[] = [];
    const runner = new ActionRunner(
      Promise.resolve(webcontainer),
      () => ({}) as any,
      (alert) => alerts.push(alert),
    );

    const data = {
      artifactId: 'artifact_1',
      messageId: 'message_1',
      actionId: 'action_1',
      action: {
        type: 'file',
        filePath: '/src/App.tsx',
        content: 'export const x = {{{',
      },
    } as any;

    runner.addAction(data);
    await runner.runAction(data);

    const paths = writeFile.mock.calls.map((call) => call[0]);

    expect(paths).toContain('.history/src/App.tsx.invalid');
    expect(paths).toContain('.history/src/App.tsx.invalid.errors.json');
    expect(paths).toContain('.history/src/App.tsx.invalid.sanitizer.json');
    expect(paths).toContain('.history/src/App.tsx.invalid.metrics.json');

    const errorsSidecarCall = writeFile.mock.calls.find(
      (call) => call[0] === '.history/src/App.tsx.invalid.errors.json',
    );
    expect(errorsSidecarCall).toBeTruthy();

    const errorsSidecar = JSON.parse(errorsSidecarCall![1]);
    expect(errorsSidecar).toMatchObject({
      count: 1,
      violations: [
        {
          code: 'SYNTAX_PARSER_CRASH',
          severity: 'error',
          message: 'Mock validation failure',
          autoFixable: false,
        },
      ],
    });
    expect(typeof errorsSidecar.timestamp).toBe('string');
    expect(Number.isNaN(Date.parse(errorsSidecar.timestamp))).toBe(false);

    const sanitizerSidecarCall = writeFile.mock.calls.find(
      (call) => call[0] === '.history/src/App.tsx.invalid.sanitizer.json',
    );
    expect(sanitizerSidecarCall).toBeTruthy();

    const sanitizerSidecar = JSON.parse(sanitizerSidecarCall![1]);
    expect(sanitizerSidecar).toMatchObject({
      count: 1,
      warnings: [
        {
          code: 'SANITIZER_FIX_TRUNCATED_BUTTON',
          risk: 'low',
        },
      ],
    });
    expect(typeof sanitizerSidecar.timestamp).toBe('string');

    const metricsSidecarCall = writeFile.mock.calls.find(
      (call) => call[0] === '.history/src/App.tsx.invalid.metrics.json',
    );
    expect(metricsSidecarCall).toBeTruthy();

    const metricsSidecar = JSON.parse(metricsSidecarCall![1]);
    expect(metricsSidecar).toMatchObject({
      changedLinesPercent: 10,
      charsAdded: 0,
      charsRemoved: 0,
      highRiskFixes: 0,
      riskLevel: 'low',
    });
    expect(typeof metricsSidecar.timestamp).toBe('string');

    expect(alerts.length).toBe(1);
    expect(alerts[0]).toMatchObject({
      type: 'validation',
      title: 'Invalid Code Blocked',
      quarantinePath: '.history/src/App.tsx.invalid',
      filePath: 'src/App.tsx',
    });
    expect(Array.isArray(alerts[0].unifiedViolations)).toBe(true);
  });
});
