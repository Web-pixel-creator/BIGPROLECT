type TsxValidationError = {
  message: string;
  line: number;
  column: number;
  snippet: string;
};

export type TsxValidationResult = { ok: true } | { ok: false; error: TsxValidationError };

const MAX_SNIPPET_LENGTH = 200;

function getScriptKind(filePath: string, ts: typeof import('typescript')): import('typescript').ScriptKind {
  const lower = filePath.toLowerCase();

  if (lower.endsWith('.tsx')) {
    return ts.ScriptKind.TSX;
  }

  if (lower.endsWith('.jsx')) {
    return ts.ScriptKind.JSX;
  }

  if (lower.endsWith('.ts')) {
    return ts.ScriptKind.TS;
  }

  if (lower.endsWith('.js')) {
    return ts.ScriptKind.JS;
  }

  return ts.ScriptKind.TSX;
}

function formatSnippet(content: string, lineNumber: number, columnNumber: number): string {
  const lines = content.split(/\r?\n/);
  const lineText = lines[lineNumber - 1] ?? '';

  if (!lineText) {
    return '';
  }

  let snippetLine = lineText;
  let caretColumn = columnNumber;

  if (lineText.length > MAX_SNIPPET_LENGTH) {
    const half = Math.floor(MAX_SNIPPET_LENGTH / 2);
    const start = Math.max(0, columnNumber - 1 - half);
    const end = Math.min(lineText.length, start + MAX_SNIPPET_LENGTH);
    snippetLine = lineText.slice(start, end);
    caretColumn = columnNumber - start;
  }

  const caret = `${' '.repeat(Math.max(0, caretColumn - 1))}^`;

  return `${snippetLine}\n${caret}`;
}

export async function validateTsx(content: string, filePath: string): Promise<TsxValidationResult> {
  if (typeof content !== 'string') {
    return { ok: true };
  }

  const ts = await import('typescript');
  const scriptKind = getScriptKind(filePath, ts);
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, scriptKind);
  const diagnostics = (sourceFile as any).parseDiagnostics ?? [];

  if (diagnostics.length === 0) {
    return { ok: true };
  }

  const diagnostic = diagnostics[0];
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
  const start = diagnostic.start ?? 0;
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(start);
  const lineNumber = line + 1;
  const columnNumber = character + 1;
  const snippet = formatSnippet(content, lineNumber, columnNumber);

  return {
    ok: false,
    error: {
      message,
      line: lineNumber,
      column: columnNumber,
      snippet,
    },
  };
}
