/**
 * Code Validator - Validation Gate for LLM-generated code
 *
 * Uses TypeScript Compiler API to detect syntax errors before writing files.
 * This catches errors that regex-based sanitizer cannot fix.
 */

import ts from 'typescript';
import type { ViolationCode, UnifiedViolation } from '~/lib/services/sectionContracts';

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  code: number;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];

  /** Unified violations with structured codes (for analytics and unified auto-fix) */
  unifiedViolations?: UnifiedViolation[];
  fixable: boolean; // Can sanitizer potentially fix these errors?
}

/**
 * Validate TypeScript/TSX/JavaScript code for syntax errors.
 * Returns detailed error information for potential auto-fix.
 */
export function validateCode(code: string, filename: string): ValidationResult {
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();

  // Determine script kind based on extension
  let scriptKind: ts.ScriptKind;

  switch (ext) {
    case '.tsx':
      scriptKind = ts.ScriptKind.TSX;
      break;
    case '.ts':
      scriptKind = ts.ScriptKind.TS;
      break;
    case '.jsx':
      scriptKind = ts.ScriptKind.JSX;
      break;
    case '.js':
    case '.mjs':
    case '.cjs':
      scriptKind = ts.ScriptKind.JS;
      break;
    default:
      // Not a JS/TS file, skip validation
      return { valid: true, errors: [], fixable: false };
  }

  const errors: ValidationError[] = [];

  try {
    // Create a source file for parsing
    const sourceFile = ts.createSourceFile(
      filename,
      code,
      ts.ScriptTarget.Latest,
      true, // setParentNodes
      scriptKind,
    );

    /*
     * Collect parse diagnostics (syntax errors)
     * Use type assertion since parseDiagnostics is internal but available
     */
    const diagnostics = (sourceFile as any).parseDiagnostics || [];

    for (const diagnostic of diagnostics) {
      const { line, character } = diagnostic.file
        ? ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start || 0)
        : { line: 0, character: 0 };

      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

      errors.push({
        line: line + 1, // 1-indexed
        column: character + 1,
        message,
        code: diagnostic.code,
        severity: diagnostic.category === ts.DiagnosticCategory.Error ? 'error' : 'warning',
      });
    }

    // Additional semantic checks for common LLM errors
    const additionalErrors = checkCommonLlmErrors(code, sourceFile, ext);
    errors.push(...additionalErrors);
  } catch (e) {
    // If TypeScript parser crashes, the code is severely malformed
    errors.push({
      line: 1,
      column: 1,
      message: `Parser crashed: ${e instanceof Error ? e.message : 'Unknown error'}`,
      code: 9999,
      severity: 'error',
    });
  }

  // Determine if errors are potentially fixable by sanitizer
  const fixable = errors.some((e) => isFixableError(e));

  return {
    valid: errors.filter((e) => e.severity === 'error').length === 0,
    errors,
    fixable,
  };
}

/**
 * Check for common LLM generation errors that TypeScript parser might miss.
 */
function checkCommonLlmErrors(code: string, _sourceFile: ts.SourceFile, ext: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const lines = code.split('\n');

  // Check 1: Unclosed JSX tags (common in TSX/JSX)
  if (ext === '.tsx' || ext === '.jsx') {
    const tagStack: { tag: string; line: number }[] = [];
    const selfClosingTags = new Set([
      'input',
      'img',
      'br',
      'hr',
      'meta',
      'link',
      'area',
      'base',
      'col',
      'embed',
      'source',
      'track',
      'wbr',
      'path',
      'circle',
      'rect',
      'line',
      'polygon',
      'polyline',
      'ellipse',
      'use',
      'stop',
    ]);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Find opening tags
      const openTags = line.matchAll(/<([A-Za-z][A-Za-z0-9.]*)\b(?![^>]*\/>)[^>]*>/g);

      for (const match of openTags) {
        const tagName = match[1].toLowerCase();

        if (!selfClosingTags.has(tagName)) {
          tagStack.push({ tag: match[1], line: i + 1 });
        }
      }

      // Find closing tags
      const closeTags = line.matchAll(/<\/([A-Za-z][A-Za-z0-9.]*)>/g);

      for (const match of closeTags) {
        const tagName = match[1];
        const lastOpen = tagStack.pop();

        if (lastOpen && lastOpen.tag !== tagName) {
          errors.push({
            line: i + 1,
            column: 1,
            message: `Mismatched JSX tags: expected </${lastOpen.tag}> but found </${tagName}>`,
            code: 17001,
            severity: 'error',
          });

          // Put it back for further checking
          tagStack.push(lastOpen);
        }
      }
    }

    // Check for unclosed tags at end of file
    if (tagStack.length > 0) {
      const unclosed = tagStack[tagStack.length - 1];
      errors.push({
        line: unclosed.line,
        column: 1,
        message: `Unclosed JSX tag: <${unclosed.tag}> opened but never closed`,
        code: 17002,
        severity: 'error',
      });
    }
  }

  // Check 2: Unbalanced braces
  let braceCount = 0;
  let parenCount = 0;
  let bracketCount = 0;
  let inString = false;
  let stringChar = '';
  let inTemplate = false;

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const prevChar = i > 0 ? code[i - 1] : '';

    // Track string state
    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString && !inTemplate) {
        if (char === '`') {
          inTemplate = true;
        } else {
          inString = true;
          stringChar = char;
        }
      } else if (inString && char === stringChar) {
        inString = false;
      } else if (inTemplate && char === '`') {
        inTemplate = false;
      }
    }

    // Count braces only outside strings
    if (!inString && !inTemplate) {
      if (char === '{') {
        braceCount++;
      }

      if (char === '}') {
        braceCount--;
      }

      if (char === '(') {
        parenCount++;
      }

      if (char === ')') {
        parenCount--;
      }

      if (char === '[') {
        bracketCount++;
      }

      if (char === ']') {
        bracketCount--;
      }
    }
  }

  if (braceCount !== 0) {
    errors.push({
      line: lines.length,
      column: 1,
      message: `Unbalanced braces: ${braceCount > 0 ? `${braceCount} unclosed {` : `${-braceCount} extra }`}`,
      code: 17003,
      severity: 'error',
    });
  }

  if (parenCount !== 0) {
    errors.push({
      line: lines.length,
      column: 1,
      message: `Unbalanced parentheses: ${parenCount > 0 ? `${parenCount} unclosed (` : `${-parenCount} extra )`}`,
      code: 17004,
      severity: 'error',
    });
  }

  // Check 3: Duplicate imports (LLM restart indicator)
  const importMap = new Map<string, number[]>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('import ')) {
      // Extract module name
      const moduleMatch = line.match(/from\s+['"]([^'"]+)['"]/);

      if (moduleMatch) {
        const moduleName = moduleMatch[1];

        if (!importMap.has(moduleName)) {
          importMap.set(moduleName, []);
        }

        importMap.get(moduleName)!.push(i + 1);
      }
    }
  }

  for (const [moduleName, lineNumbers] of importMap) {
    if (lineNumbers.length > 1) {
      errors.push({
        line: lineNumbers[1],
        column: 1,
        message: `Duplicate import from '${moduleName}' (first at line ${lineNumbers[0]})`,
        code: 17005,
        severity: 'warning',
      });
    }
  }

  // Check 4: Multiple export default
  const exportDefaultLines: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (/^\s*export\s+default\b/.test(lines[i])) {
      exportDefaultLines.push(i + 1);
    }
  }

  if (exportDefaultLines.length > 1) {
    errors.push({
      line: exportDefaultLines[1],
      column: 1,
      message: `Multiple 'export default' statements (first at line ${exportDefaultLines[0]})`,
      code: 17006,
      severity: 'error',
    });
  }

  return errors;
}

/**
 * Determine if an error is potentially fixable by the sanitizer.
 */
function isFixableError(error: ValidationError): boolean {
  // Errors that sanitizer can potentially fix
  const fixableCodes = [
    1005, // '}' expected
    1002, // Unterminated string literal
    1003, // Identifier expected
    1109, // Expression expected
    1128, // Declaration or statement expected
    17001, // Mismatched JSX tags
    17002, // Unclosed JSX tag
    17003, // Unbalanced braces
    17004, // Unbalanced parentheses
    17005, // Duplicate imports
    17006, // Multiple export default
  ];

  return fixableCodes.includes(error.code);
}

/**
 * Quick syntax check - returns true if code is valid, false otherwise.
 * Use this for fast validation without detailed error info.
 */
export function isValidSyntax(code: string, filename: string): boolean {
  const result = validateCode(code, filename);
  return result.valid;
}

/**
 * Validate and return a summary string for logging.
 */
export function validateWithSummary(code: string, filename: string): { valid: boolean; summary: string } {
  const result = validateCode(code, filename);

  if (result.valid) {
    return { valid: true, summary: 'Code is valid' };
  }

  const errorCount = result.errors.filter((e) => e.severity === 'error').length;
  const warningCount = result.errors.filter((e) => e.severity === 'warning').length;

  const topErrors = result.errors
    .filter((e) => e.severity === 'error')
    .slice(0, 3)
    .map((e) => `  Line ${e.line}: ${e.message}`)
    .join('\n');

  const summary = [
    `Validation failed: ${errorCount} error(s), ${warningCount} warning(s)`,
    topErrors,
    result.fixable ? '(Some errors may be auto-fixable)' : '',
  ]
    .filter(Boolean)
    .join('\n');

  return { valid: false, summary };
}

/**
 * Validate CSS code for common errors.
 */
export function validateCss(code: string, filename: string): ValidationResult {
  const errors: ValidationError[] = [];
  const lines = code.split('\n');

  // Check for unbalanced braces
  let braceCount = 0;
  let inComment = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const nextChar = line[j + 1] || '';
      const prevChar = j > 0 ? line[j - 1] : '';

      // Track comments
      if (char === '/' && nextChar === '*') {
        inComment = true;
      }

      if (char === '*' && nextChar === '/') {
        inComment = false;
        j++; // Skip next char
        continue;
      }

      if (!inComment) {
        if (char === '{') {
          braceCount++;
        }

        if (char === '}') {
          braceCount--;
        }
      }
    }
  }

  if (braceCount !== 0) {
    errors.push({
      line: lines.length,
      column: 1,
      message: `Unbalanced CSS braces: ${braceCount > 0 ? `${braceCount} unclosed {` : `${-braceCount} extra }`}`,
      code: 18001,
      severity: 'error',
    });
  }

  // Check for unclosed comments
  if (inComment) {
    errors.push({
      line: lines.length,
      column: 1,
      message: 'Unclosed CSS comment',
      code: 18002,
      severity: 'error',
    });
  }

  return {
    valid: errors.filter((e) => e.severity === 'error').length === 0,
    errors,
    fixable: errors.length > 0,
  };
}

/**
 * Validate JSON code.
 */
export function validateJson(code: string, filename: string): ValidationResult {
  const errors: ValidationError[] = [];

  try {
    JSON.parse(code);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Invalid JSON';

    // Try to extract line number from error message
    const lineMatch = message.match(/position\s+(\d+)/i);
    let line = 1;
    let column = 1;

    if (lineMatch) {
      const position = parseInt(lineMatch[1], 10);
      const beforeError = code.substring(0, position);
      line = (beforeError.match(/\n/g) || []).length + 1;
      column = position - beforeError.lastIndexOf('\n');
    }

    errors.push({
      line,
      column,
      message,
      code: 19001,
      severity: 'error',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    fixable: false,
  };
}

/**
 * Map ValidationError to UnifiedViolation with structured code.
 * This enables unified analytics, auto-fix routing, and UI across all error sources.
 */
export function mapErrorToUnifiedViolation(error: ValidationError, filename: string): UnifiedViolation {
  const code = mapErrorCodeToViolationCode(error.code, error.message);

  return {
    code,
    severity: error.severity,
    message: error.message,
    autoFixable: isErrorAutoFixable(error.code),
    context: {
      file: filename,
      line: error.line,
      column: error.column,
      tsCode: error.code,
    },
  };
}

/**
 * Map TypeScript/custom error code to ViolationCode.
 */
function mapErrorCodeToViolationCode(errorCode: number, message: string): ViolationCode {
  // TypeScript error codes
  switch (errorCode) {
    case 1005: // '}' expected
      return 'SYNTAX_BRACE_EXPECTED';
    case 1002: // Unterminated string literal
      return 'SYNTAX_UNTERMINATED_STRING';
    case 1003: // Identifier expected
      return 'SYNTAX_IDENTIFIER_EXPECTED';
    case 1109: // Expression expected
      return 'SYNTAX_EXPRESSION_EXPECTED';
    case 1128: // Declaration or statement expected
      return 'SYNTAX_DECLARATION_EXPECTED';
    case 1006: // ')' expected
    case 1011: // ')' expected
      return 'SYNTAX_PAREN_EXPECTED';
    case 1010: // ']' expected
      return 'SYNTAX_BRACKET_EXPECTED';

    // Custom error codes (17xxx for JSX, 18xxx for CSS)
    case 17001: // Mismatched JSX tags
      return 'SYNTAX_JSX_TAG_MISMATCH';
    case 17002: // Unclosed JSX tag
      return 'SYNTAX_JSX_UNCLOSED';
    case 17003: // Unbalanced braces
      return 'SYNTAX_UNBALANCED_BRACES';
    case 17004: // Unbalanced parentheses
      return 'SYNTAX_UNBALANCED_PARENS';
    case 17005: // Duplicate imports
      return 'SYNTAX_DUPLICATE_IMPORT';
    case 17006: // Multiple export default
      return 'SYNTAX_MULTIPLE_EXPORT_DEFAULT';
    case 18001: // Unbalanced CSS braces
      return 'SYNTAX_CSS_UNBALANCED';
    case 18002: // Unclosed CSS comment
      return 'SYNTAX_CSS_UNCLOSED_COMMENT';
    case 9999: // Parser crash
      return 'SYNTAX_PARSER_CRASH';

    default:
      // Try to infer from message
      if (message.includes("'}'") || message.includes("'}' expected")) {
        return 'SYNTAX_BRACE_EXPECTED';
      }

      if (message.includes("')'") || message.includes("')' expected")) {
        return 'SYNTAX_PAREN_EXPECTED';
      }

      if (message.includes("']'") || message.includes("']' expected")) {
        return 'SYNTAX_BRACKET_EXPECTED';
      }

      if (message.toLowerCase().includes('unterminated string')) {
        return 'SYNTAX_UNTERMINATED_STRING';
      }

      if (message.toLowerCase().includes('jsx') && message.toLowerCase().includes('tag')) {
        return 'SYNTAX_JSX_TAG_MISMATCH';
      }

      return 'SYNTAX_OTHER';
  }
}

/**
 * Check if error is auto-fixable based on code.
 */
function isErrorAutoFixable(errorCode: number): boolean {
  const autoFixableCodes = new Set([
    1005, // '}' expected
    1002, // Unterminated string literal
    1003, // Identifier expected
    1109, // Expression expected
    1128, // Declaration or statement expected
    17001, // Mismatched JSX tags
    17002, // Unclosed JSX tag
    17003, // Unbalanced braces
    17004, // Unbalanced parentheses
    17005, // Duplicate imports
    17006, // Multiple export default
    18001, // Unbalanced CSS braces
    18002, // Unclosed CSS comment
  ]);

  return autoFixableCodes.has(errorCode);
}

/**
 * Map array of ValidationErrors to UnifiedViolations.
 */
export function mapErrorsToUnifiedViolations(errors: ValidationError[], filename: string): UnifiedViolation[] {
  return errors.map((error) => mapErrorToUnifiedViolation(error, filename));
}

/**
 * Main validation entry point - routes to appropriate validator based on file type.
 */
export function validateFile(code: string, filename: string): ValidationResult {
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();

  let result: ValidationResult;

  switch (ext) {
    case '.ts':
    case '.tsx':
    case '.js':
    case '.jsx':
    case '.mjs':
    case '.cjs':
      result = validateCode(code, filename);
      break;

    case '.css':
    case '.scss':
    case '.sass':
    case '.less':
      result = validateCss(code, filename);
      break;

    case '.json':
      result = validateJson(code, filename);
      break;

    default:
      // No validation for other file types
      return { valid: true, errors: [], unifiedViolations: [], fixable: false };
  }

  // Add unified violations mapping
  result.unifiedViolations = mapErrorsToUnifiedViolations(result.errors, filename);

  return result;
}
