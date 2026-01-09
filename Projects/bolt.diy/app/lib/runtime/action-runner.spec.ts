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


describe('Modular section detection helpers', () => {
  // We need to test the helper functions, but they're not exported.
  // For now, we test the behavior through the ActionRunner integration.
  // These tests verify that modular section files don't trigger false "missing sections" alerts.

  it('should not trigger page contract alert for single-section modular file', async () => {
    // Valid single-section component
    const heroSectionContent = `
export function HeroSection() {
  return (
    <section data-section="hero" className="min-h-screen">
      <h1>Welcome</h1>
      <p>Description</p>
      <button>Get Started</button>
    </section>
  );
}
`;

    (sanitizeGeneratedFile as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      content: heroSectionContent,
      changed: false,
      warnings: [],
      structuredWarnings: [],
      metrics: { changedLinesPercent: 0, charsAdded: 0, charsRemoved: 0, highRiskFixes: 0, riskLevel: 'low' },
    });

    (validateFile as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      valid: true,
      errors: [],
      unifiedViolations: [],
      fixable: false,
    });

    const writeFile = vi.fn().mockResolvedValue(undefined);
    const mkdir = vi.fn().mockResolvedValue(undefined);

    const webcontainer = {
      workdir: '/',
      fs: { mkdir, writeFile },
    } as any;

    const alerts: any[] = [];

    // Create runner with a section contract that expects multiple sections
    const sectionContract = {
      order: ['navigation', 'hero', 'features', 'footer'],
      labels: { navigation: 'Navigation', hero: 'Hero', features: 'Features', footer: 'Footer' },
      imageSections: [],
      imageMinCounts: {},
      imageMap: {},
    };

    const runner = new ActionRunner(
      Promise.resolve(webcontainer),
      () => ({}) as any,
      (alert) => alerts.push(alert),
      undefined,
      undefined,
      sectionContract,
    );

    const data = {
      artifactId: 'artifact_1',
      messageId: 'message_1',
      actionId: 'action_1',
      action: {
        type: 'file',
        filePath: '/src/components/HeroSection.tsx',
        content: heroSectionContent,
      },
    } as any;

    runner.addAction(data);
    await runner.runAction(data);

    // Should NOT have any section contract alerts (no "missing sections" for modular file)
    const sectionAlerts = alerts.filter((a) => a.type === 'sectionContract');
    expect(sectionAlerts.length).toBe(0);
  });

  it('should still validate page contract for App.tsx with all sections', async () => {
    // App.tsx with all sections present
    const appContent = `
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div>
      <section data-section="navigation"><Navigation /></section>
      <section data-section="hero"><HeroSection /></section>
      <section data-section="features"><FeaturesSection /></section>
      <section data-section="footer"><Footer /></section>
    </div>
  );
}
`;

    (sanitizeGeneratedFile as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      content: appContent,
      changed: false,
      warnings: [],
      structuredWarnings: [],
      metrics: { changedLinesPercent: 0, charsAdded: 0, charsRemoved: 0, highRiskFixes: 0, riskLevel: 'low' },
    });

    (validateFile as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      valid: true,
      errors: [],
      unifiedViolations: [],
      fixable: false,
    });

    const writeFile = vi.fn().mockResolvedValue(undefined);
    const mkdir = vi.fn().mockResolvedValue(undefined);

    const webcontainer = {
      workdir: '/',
      fs: { mkdir, writeFile },
    } as any;

    const alerts: any[] = [];

    const sectionContract = {
      order: ['navigation', 'hero', 'features', 'footer'],
      labels: { navigation: 'Navigation', hero: 'Hero', features: 'Features', footer: 'Footer' },
      imageSections: [],
      imageMinCounts: {},
      imageMap: {},
    };

    const runner = new ActionRunner(
      Promise.resolve(webcontainer),
      () => ({}) as any,
      (alert) => alerts.push(alert),
      undefined,
      undefined,
      sectionContract,
    );

    const data = {
      artifactId: 'artifact_1',
      messageId: 'message_1',
      actionId: 'action_1',
      action: {
        type: 'file',
        filePath: '/src/App.tsx',
        content: appContent,
      },
    } as any;

    runner.addAction(data);
    await runner.runAction(data);

    // Should NOT have section contract alerts because all sections are present
    const sectionAlerts = alerts.filter((a) => a.type === 'sectionContract');
    expect(sectionAlerts.length).toBe(0);
  });
});
