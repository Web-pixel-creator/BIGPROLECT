import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

// Default roots - expanded to include scripts and .kiro/specs
const DEFAULT_ROOTS = ['app/lib/services', 'scripts', '.kiro/specs'];
const args = process.argv.slice(2);
const roots = args.length > 0 ? args : DEFAULT_ROOTS;
const extensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.md']);

// Original bad character pattern (U+FFFD, control chars)
const badCharPattern = /[\uFFFD\u0080-\u009F\u00A0]/g;

// Mojibake detection patterns
const mojibakePatterns = [
  { pattern: /\?{3,}/g, name: 'question_marks' },
  { pattern: /\u0420[\u0080-\u00BF\uFFFD]/g, name: 'cyrillic_r_mojibake' },
  { pattern: /\u00D0[\u00B0-\u00FF]\u00D1[\u20AC\u00A0-\u00BF]/g, name: 'double_encoded' },
];

type FindingType = 'replacement_char' | 'bom' | 'control_char' | 'mojibake';

type Finding = {
  file: string;
  line: number;
  column: number;
  char: string;
  code: string;
  type: FindingType;
  context?: string;
  pattern?: string;
};

const findings: Finding[] = [];

const hasUtf8Bom = (buffer: Buffer) =>
  buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf;

const getContext = (line: string, column: number, contextSize: number = 10): string => {
  const start = Math.max(0, column - contextSize);
  const end = Math.min(line.length, column + contextSize);
  return line.slice(start, end);
};

const resolveRoot = (root: string): string => {
  if (path.isAbsolute(root)) {
    return root;
  }

  const candidates = [
    path.join(process.cwd(), root),
    path.join(process.cwd(), '..', root),
    path.join(process.cwd(), '..', '..', root),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return path.join(process.cwd(), root);
};

const walk = async (dir: string): Promise<string[]> => {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...(await walk(fullPath)));
      } else if (extensions.has(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }

    return files;
  } catch {
    // Directory doesn't exist, return empty
    return [];
  }
};

const recordBadChars = (filePath: string, text: string) => {
  const lines = text.split(/\r?\n/);

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    let match: RegExpExecArray | null;

    // Check for bad characters (U+FFFD, control chars)
    while ((match = badCharPattern.exec(line))) {
      const char = match[0];
      const codePoint = char.codePointAt(0);
      const type: FindingType = codePoint === 0xfffd ? 'replacement_char' : 'control_char';

      findings.push({
        file: filePath,
        line: lineIndex + 1,
        column: match.index + 1,
        char,
        code: `U+${codePoint?.toString(16).toUpperCase().padStart(4, '0')}`,
        type,
        context: getContext(line, match.index),
      });
    }

    badCharPattern.lastIndex = 0;

    // Check for mojibake patterns
    for (const { pattern, name } of mojibakePatterns) {
      while ((match = pattern.exec(line))) {
        findings.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index + 1,
          char: match[0],
          code: 'MOJIBAKE',
          type: 'mojibake',
          context: getContext(line, match.index),
          pattern: name,
        });
      }

      pattern.lastIndex = 0;
    }
  }
};

for (const root of roots) {
  const absoluteRoot = resolveRoot(root);
  const files = await walk(absoluteRoot);

  for (const filePath of files) {
    const buffer = await readFile(filePath);

    if (hasUtf8Bom(buffer)) {
      findings.push({
        file: filePath,
        line: 1,
        column: 1,
        char: '\ufeff',
        code: 'U+FEFF',
        type: 'bom',
      });
    }

    const text = buffer.toString('utf-8');
    recordBadChars(filePath, text);
  }
}

if (findings.length > 0) {
  console.error(`Encoding check failed (${findings.length} issues):`);

  for (const finding of findings.slice(0, 50)) {
    const patternInfo = finding.pattern ? ` [${finding.pattern}]` : '';
    const contextInfo = finding.context ? ` context: "${finding.context}"` : '';
    console.error(
      `${finding.file}:${finding.line}:${finding.column} ${finding.type} ${finding.code}${patternInfo} (${JSON.stringify(finding.char)})${contextInfo}`,
    );
  }

  if (findings.length > 50) {
    console.error(`...and ${findings.length - 50} more`);
  }

  process.exitCode = 1;
} else {
  console.log(`Encoding check passed (${roots.length} roots scanned).`);
}
