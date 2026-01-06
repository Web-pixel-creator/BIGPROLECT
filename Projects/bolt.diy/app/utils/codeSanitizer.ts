import { path as nodePath } from './path';
import { WEB_BASELINE_FILES } from './templateBaseline';

type SanitizationResult = {
  content: string;
  changed: boolean;
  warnings: string[];
};

const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mts', '.cts', '.mjs', '.cjs', '.html', '.css', '.scss']);

// Conservative default versions taken from this repo's own dependencies.
const DEFAULT_WEB_DEPS: Record<string, string> = {
  'clsx': '^2.1.1',
  'framer-motion': '^11.12.0',
  'lucide-react': '^0.485.0',
  'motion': '^12.23.26',
  'tailwind-merge': '^2.6.0',
};

export function sanitizeGeneratedFile(relativePath: string, content: string): SanitizationResult {
  if (typeof content !== 'string') {
    return { content, changed: false, warnings: [] };
  }

  const normalizedPath = relativePath.replace(/\\/g, '/').replace(/^\.\//, '');
  const warnings: string[] = [];
  const baselineMain = WEB_BASELINE_FILES.find((file) => file.path === 'src/main.tsx')?.content;
  const baselineIndexCss = WEB_BASELINE_FILES.find((file) => file.path === 'src/index.css')?.content;
  const baselineIndexHtml = WEB_BASELINE_FILES.find((file) => file.path === 'index.html')?.content;
  const baselineViteConfig = WEB_BASELINE_FILES.find((file) => file.path === 'vite.config.ts')?.content;
  const baselinePostcssConfig = WEB_BASELINE_FILES.find((file) => file.path === 'postcss.config.js')?.content;
  const baselineTailwindConfig = WEB_BASELINE_FILES.find((file) => file.path === 'tailwind.config.js')?.content;
  if ((normalizedPath === 'src/main.tsx' || normalizedPath === 'src/main.jsx') && baselineMain) {
    if (content.trim() !== baselineMain.trim()) {
      warnings.push('Replaced src/main.tsx with baseline entry point');
      return { content: baselineMain, changed: true, warnings };
    }
  }
  if (normalizedPath === 'src/index.css' && baselineIndexCss) {
    const normalizedContent = content.replace(/\r\n/g, '\n').trim();
    const normalizedBaseline = baselineIndexCss.replace(/\r\n/g, '\n').trim();
    const hasBaselinePrefix = normalizedContent.startsWith(normalizedBaseline);

    if (!hasBaselinePrefix) {
      warnings.push('Replaced src/index.css with baseline styles');
      return { content: baselineIndexCss, changed: true, warnings };
    }

    const extraContent = normalizedContent.slice(normalizedBaseline.length);
    const hasHtmlLikeTokens = /<\s*(?:!doctype|html|head|body|script|style|div|section|span|meta|link|img|svg|\/)/i.test(
      extraContent,
    );
    const hasJsLikeTokens =
      /(^|\n)\s*(?:export\s+default|module\.exports|import\s+(?:\{|type|\w)|const\s|let\s|function\s)/m.test(
        extraContent,
      );
    if (hasHtmlLikeTokens || hasJsLikeTokens) {
      warnings.push('Replaced src/index.css with baseline styles');
      return { content: baselineIndexCss, changed: true, warnings };
    }
    if (extraContent.trim().length > 0 && !hasBalancedCssBraces(extraContent)) {
      warnings.push('Removed malformed custom CSS after baseline');
      return { content: baselineIndexCss, changed: true, warnings };
    }
  }
  if (normalizedPath === 'index.html' && baselineIndexHtml) {
    const sanitizedHtml = sanitizeIndexHtml(content, baselineIndexHtml, warnings);
    if (sanitizedHtml !== content) {
      return { content: sanitizedHtml, changed: true, warnings };
    }
  }

  const ext = nodePath.extname(relativePath).toLowerCase();

  if (normalizedPath.endsWith('package.json')) {
    const result = sanitizePackageJson(content);
    return { content: result.content, changed: result.content !== content, warnings: result.warnings };
  }

  if (!CODE_EXTENSIONS.has(ext)) {
    return { content, changed: false, warnings: [] };
  }

  let next = content;

  if (normalizedPath === 'src/lib/utils.ts') {
    const beforeUtils = next;
    const hasFormatPrice =
      /\bexport\s+function\s+formatPrice\b/.test(next) || /\bexport\s+const\s+formatPrice\b/.test(next);
    if (!hasFormatPrice) {
      next = `${next.trimEnd()}\n\nexport function formatPrice(value: number, currency: string = \"USD\", locale: string = \"en-US\") {\n  return new Intl.NumberFormat(locale, { style: \"currency\", currency }).format(value);\n}\n`;
      warnings.push('Added missing formatPrice export to src/lib/utils.ts');
    }

    if (next !== beforeUtils) {
      return { content: next, changed: true, warnings };
    }
  }

  if (/^vite\.config\./i.test(normalizedPath)) {
    next = deduplicateViteConfig(next, warnings);
    next = sanitizeViteConfigPlugins(next, warnings);
    next = sanitizeViteConfigSyntax(next, warnings);
    if (baselineViteConfig && !isLikelyValidViteConfig(next)) {
      warnings.push('Replaced malformed vite.config with baseline config');
      return { content: baselineViteConfig, changed: true, warnings };
    }
  }

  if (/^postcss\.config\./i.test(normalizedPath)) {
    next = sanitizePostcssConfigSyntax(next, normalizedPath, warnings);
    const isCommonJsPostcss = /\.cjs$/i.test(normalizedPath);
    if (!isCommonJsPostcss) {
      const hasEsmExport = /^\s*export\s+default\b/m.test(next);
      const hasCommonJsTokens = /\bmodule\./.test(next) || /\bexports\./.test(next) || /\brequire\(/.test(next);
      if ((!hasEsmExport || hasCommonJsTokens) && baselinePostcssConfig) {
        warnings.push('Replaced non-ESM postcss.config.js with baseline config');
        return { content: baselinePostcssConfig, changed: true, warnings };
      }
      if (baselinePostcssConfig) {
        const normalizedNext = normalizePostcssConfigForCompare(next);
        const normalizedBaseline = normalizePostcssConfigForCompare(baselinePostcssConfig);
        if (normalizedNext !== normalizedBaseline) {
          warnings.push('Replaced postcss.config.js with baseline config');
          return { content: baselinePostcssConfig, changed: true, warnings };
        }
      }
    }
    if (baselinePostcssConfig && !isLikelyValidPostcssConfig(next)) {
      warnings.push('Replaced malformed postcss.config with baseline config');
      return { content: baselinePostcssConfig, changed: true, warnings };
    }
  }

  if (/^tailwind\.config\./i.test(normalizedPath)) {
    next = sanitizeTailwindConfigSyntax(next, normalizedPath, warnings);
    const isCommonJsTailwind = /\.cjs$/i.test(normalizedPath);
    if (!isCommonJsTailwind) {
      const hasEsmExport = /^\s*export\s+default\b/m.test(next);
      const hasCommonJsTokens = /\bmodule\./.test(next) || /\bexports\./.test(next) || /\brequire\(/.test(next);
      if ((!hasEsmExport || hasCommonJsTokens) && baselineTailwindConfig) {
        warnings.push('Replaced non-ESM tailwind.config.js with baseline config');
        return { content: baselineTailwindConfig, changed: true, warnings };
      }
    }
    if (baselineTailwindConfig && !isLikelyValidTailwindConfig(next)) {
      warnings.push('Replaced malformed tailwind.config with baseline config');
      return { content: baselineTailwindConfig, changed: true, warnings };
    }
  }


  if (ext === '.tsx' || ext === '.jsx') {
    next = deduplicateTsxContent(next, warnings); // Fix LLM restart mid-generation
    next = sanitizeBoltTags(next, warnings); // Remove leaked boltAction/boltArtifact tags FIRST
    next = sanitizeJsxSyntaxErrors(next, warnings);
    next = sanitizeJsxComments(next, warnings);
  } else {
    // Also sanitize other file types in case boltAction leaks into them
    next = sanitizeBoltTags(next, warnings);
  }

  next = sanitizeImportPaths(next, relativePath, warnings);
  next = sanitizeLucide(next, warnings);
  next = sanitizeNext(next, warnings);
  next = sanitizeRouter(next, warnings);
  next = sanitizeImages(next, warnings);

  if (ext === '.css' || ext === '.scss') {
    next = sanitizeCssSyntaxErrors(next, warnings);
    next = sanitizeTailwindShadcnTokensInCss(next, warnings);
  }

  if (ext === '.tsx' || ext === '.jsx') {
    const beforeMergedAttrSafetyNet = next;
    next = next.replace(/<([A-Z][A-Za-z0-9._-]*?)ButtclassNam\s*e\s*=/gi, '<$1Button className=');
    next = next.replace(/<\/([A-Z][A-Za-z0-9._-]*?)ButtclassNam\s*>/gi, '</$1Button>');
    next = next.replace(/<([A-Z][A-Za-z0-9._-]*?)ButtonClic\s*k\s*=/gi, '<$1Button onClick=');
    next = next.replace(/<\/([A-Z][A-Za-z0-9._-]*?)ButtonClic\s*>/gi, '</$1Button>');
    next = next.replace(/<([A-Z][A-Za-z0-9._-]*?)classNam\s*e\s*=/gi, '<$1 className=');
    next = next.replace(/<\/([A-Z][A-Za-z0-9._-]*?)classNam\s*>/gi, '</$1>');
    next = next.replace(/<([A-Z][A-Za-z0-9._-]*?)Clic\s*k\s*=/gi, '<$1 onClick=');
    next = next.replace(/<\/([A-Z][A-Za-z0-9._-]*?)Clic\s*>/gi, '</$1>');
    next = next.replace(/<([A-Z][A-Za-z0-9._-]*?)siz\s*e\s*=/gi, '<$1 size=');
    next = next.replace(/<\/([A-Z][A-Za-z0-9._-]*?)siz\s*>/gi, '</$1>');
    next = next.replace(/<([A-Z][A-Za-z0-9._-]*Button)>\s*Clic\s*k\s*=/g, '<$1 onClick=');
    next = next.replace(/<([A-Z][A-Za-z0-9._-]*Button)>\s*classNam\s*e\s*=/g, '<$1 className=');
    if (next !== beforeMergedAttrSafetyNet && !warnings.includes('Repaired split JSX attributes merged into tag names')) {
      warnings.push('Repaired split JSX attributes merged into tag names');
    }

    const beforeButtSafetyNet = next;
    next = next.replace(/<\s*\/\s*butt(\s|>)/gi, '</button$1');
    next = next.replace(/<\s*butt(\s|\/|>)/gi, '<button$1');
    if (next !== beforeButtSafetyNet && !warnings.includes('Fixed truncated <butt> tag names to <button>')) {
      warnings.push('Fixed truncated <butt> tag names to <button>');
    }
  }

  return { content: next, changed: next !== content, warnings };
}

/**
 * Remove leaked boltAction/boltArtifact tags from file content.
 * AI sometimes embeds these internal control tags inside the generated code.
 * Examples:
 *   - <span<boltActi>on type="file" filePath="..."> → <span>
 *   - <boltAction type="file">...</boltAction> → (removed)
 *   - <boltArtifact>...</boltArtifact> → (removed)
 */
function sanitizeBoltTags(code: string, warnings: string[]): string {
  const before = code;
  let next = code;

  // Pattern 1: Full boltAction tags with content - remove entirely
  next = next.replace(/<boltAction[^>]*>[\s\S]*?<\/boltAction>/gi, '');

  // Pattern 2: Full boltArtifact tags with content - remove entirely
  next = next.replace(/<boltArtifact[^>]*>[\s\S]*?<\/boltArtifact>/gi, '');

  // Pattern 3: Broken boltAction tags (like <boltActi>on) - remove the fragment
  next = next.replace(/<boltActi>on[^>]*>/gi, '');
  next = next.replace(/<\/boltActi>on>/gi, '');
  next = next.replace(/<boltArti>fact[^>]*>/gi, '');
  next = next.replace(/<\/boltArti>fact>/gi, '');

  // Pattern 4: Opening boltAction/boltArtifact tags without closing (orphaned)
  next = next.replace(/<boltAction[^>]*>/gi, '');
  next = next.replace(/<\/boltAction>/gi, '');
  next = next.replace(/<boltArtifact[^>]*>/gi, '');
  next = next.replace(/<\/boltArtifact>/gi, '');

  // Pattern 5: Tag embedded inside another tag (like <span<boltActi...)
  // Remove the boltActi... part and close the parent tag properly
  next = next.replace(/(<[a-zA-Z][a-zA-Z0-9]*)<boltActi[^>]*>on[^>]*>/gi, '$1>');
  next = next.replace(/(<[a-zA-Z][a-zA-Z0-9]*)<boltAction[^>]*>/gi, '$1>');
  next = next.replace(/(<[a-zA-Z][a-zA-Z0-9]*)<boltArtifact[^>]*>/gi, '$1>');

  // Pattern 6: Any remaining fragments
  next = next.replace(/\sboltAction[^>]*>/gi, '>');
  next = next.replace(/\sboltArtifact[^>]*>/gi, '>');

  if (next !== before) {
    warnings.push('Removed leaked boltAction/boltArtifact tags from file content');
    console.log('[CodeSanitizer] Removed boltAction/boltArtifact tags from content');
  }

  return next;
}

/**
 * Fix common JSX syntax errors from AI generation, such as truncated attributes.
 * Examples:
 *   - className="flex gap-2            <a href= → className="flex gap-2"><a href=
 *   - <div className="text-sm<boltAction → <div className="text-sm">
 */
function sanitizeJsxSyntaxErrors(code: string, warnings: string[]) {
  const before = code;
  let next = code;

  const beforeButtTagFix = next;
  next = next.replace(/<\s*\/\s*butt(\s|>)/gi, '</button$1');
  next = next.replace(/<\s*butt(\s|\/|>)/gi, '<button$1');
  if (next !== beforeButtTagFix) {
    warnings.push('Fixed truncated <butt> tag names to <button>');
  }

  const beforeSplitAttrInTagNames = next;
  next = next.replace(/<([A-Z][A-Za-z0-9._-]*?)ButtclassNam\s*e\s*=/gi, '<$1Button className=');
  next = next.replace(/<\/([A-Z][A-Za-z0-9._-]*?)ButtclassNam\s*>/gi, '</$1Button>');
  next = next.replace(/<([A-Z][A-Za-z0-9._-]*?)ButtonClic\s*k\s*=/gi, '<$1Button onClick=');
  next = next.replace(/<\/([A-Z][A-Za-z0-9._-]*?)ButtonClic\s*>/gi, '</$1Button>');
  next = next.replace(/<([A-Z][A-Za-z0-9._-]*?)classNam\s*e\s*=/gi, '<$1 className=');
  next = next.replace(/<\/([A-Z][A-Za-z0-9._-]*?)classNam\s*>/gi, '</$1>');
  next = next.replace(/<([A-Z][A-Za-z0-9._-]*?)Clic\s*k\s*=/gi, '<$1 onClick=');
  next = next.replace(/<\/([A-Z][A-Za-z0-9._-]*?)Clic\s*>/gi, '</$1>');
  next = next.replace(/<([A-Z][A-Za-z0-9._-]*?)siz\s*e\s*=/gi, '<$1 size=');
  next = next.replace(/<\/([A-Z][A-Za-z0-9._-]*?)siz\s*>/gi, '</$1>');

  // Variant: the sanitizer may have inserted a premature ">" and left the tail as plain text.
  next = next.replace(/<([A-Z][A-Za-z0-9._-]*Button)>\s*Clic\s*k\s*=/g, '<$1 onClick=');
  next = next.replace(/<([A-Z][A-Za-z0-9._-]*Button)>\s*classNam\s*e\s*=/g, '<$1 className=');

  if (next !== beforeSplitAttrInTagNames) {
    warnings.push('Repaired split JSX attributes merged into tag names');
  }

  // Fix 0: Remove stray Markdown code fences that break TSX parsing.
  const beforeFenceStrip = next;
  next = next.replace(/^\s*```[a-zA-Z0-9_-]*\s*$/gm, '');
  if (next !== beforeFenceStrip) {
    warnings.push('Removed stray Markdown code fences from JSX content');
  }

  // Fix 0b: Remove inline Markdown fences that can terminate template literals.
  const beforeInlineFenceStrip = next;
  next = next.replace(/```[a-zA-Z0-9_-]*/g, '');
  if (next !== beforeInlineFenceStrip) {
    warnings.push('Removed inline Markdown code fences from JSX content');
  }

  // Fix 1: Truncated className with embedded tag (className="...  <tag)
  // Pattern: className="...whitespace...<tagName
  // This catches cases like: className="flex gap-y-2            <a href=
  const truncatedClassWithTag = /(\bclassName\s*=\s*["'])([^"']*?)(\s{2,})(<[a-zA-Z])/g;
  next = next.replace(truncatedClassWithTag, (match, start, classValue, _ws, tag) => {
    const quote = start.slice(-1);
    // Close the className properly and keep the tag
    return `${start}${classValue.trim()}${quote}>${tag}`;
  });

  // Fix 2: Detect and fix className that contains < character (invalid)
  // Pattern: className="...<anything
  const classWithBracket = /(\bclassName\s*=\s*["'])([^"']*?)(<[^"']*)(["'])/g;
  next = next.replace(classWithBracket, (match, start, validPart, invalidPart, quote) => {
    // Keep only valid part before < and close properly
    return `${start}${validPart.trim()}${quote}>${invalidPart}`;
  });

  // Fix 3: Unclosed string attributes that span to next line with a tag
  // Pattern: attr="value\n            <tag
  const unclosedAttrWithNewlineTag = /(\b(?:className|style|href|src|alt|title|id|name)\s*=\s*["'])([^"'\n]*?)(\n\s*)(<[a-zA-Z])/g;
  next = next.replace(unclosedAttrWithNewlineTag, (match, start, value, newline, tag) => {
    const quote = start.slice(-1);
    return `${start}${value.trim()}${quote}>${newline}${tag}`;
  });

  // Fix 3c: Attributes accidentally concatenated inside src/href values
  // Pattern: src="...boltSeed=xyz   loading="lazy"
  const beforeAttrSplit = next;
  next = next.replace(
    /\b(src|href)\s*=\s*"([^"]*?)\s+([a-zA-Z_:][\w:.-]*)=/g,
    (_match, attr, value, nextAttr) => `${attr}="${value.trim()}" ${nextAttr}=`,
  );
  next = next.replace(
    /\b(src|href)\s*=\s*'([^']*?)\s+([a-zA-Z_:][\w:.-]*)=/g,
    (_match, attr, value, nextAttr) => `${attr}='${value.trim()}' ${nextAttr}=`,
  );
  if (next !== beforeAttrSplit) {
    warnings.push('Split concatenated attributes inside src/href values');
  }

  // Fix 3d: Malformed data-* attribute missing "=" (e.g. data-cta")
  const beforeDataAttrFix = next;
  next = next.replace(/(\s)(data-[A-Za-z0-9_-]+)"/g, '$1$2=""');
  if (next !== beforeDataAttrFix) {
    warnings.push('Fixed malformed data-* attribute quotes');
  }

  // Fix 3e: Truncated JSX object literal in props with stray tag fragments (e.g. opacity</p>)
  const beforeTruncatedPropObject = next;
  const propLines = next.split('\n');
  let truncatedPropFixed = false;
  for (let i = 0; i < propLines.length; i += 1) {
    const line = propLines[i];
    if (!line.includes('={{')) continue;
    if (line.includes('}}')) continue;
    if (!/<\s*\/?[A-Za-z]/.test(line)) continue;

    propLines[i] = line.replace(/(\b[A-Za-z0-9_]+\s*=\s*)\{\{[^<]*<.*$/, '$1{{}}');
    truncatedPropFixed = true;
  }
  if (truncatedPropFixed) {
    next = propLines.join('\n');
    warnings.push('Repaired truncated JSX object literal with stray tag fragment');
  }

  // Fix 3b: backgroundImage: 'url('...')' (nested single quotes)
  const beforeBackgroundImageQuotes = next;
  next = next.replace(/(backgroundImage\s*:\s*)'url\('([^']+)'\)'/g, (_match, prefix, url) => {
    return `${prefix}"url('${url}')"`;
  });
  if (next !== beforeBackgroundImageQuotes) {
    warnings.push('Fixed backgroundImage url() quotes');
  }

  // Fix 4: boltAction/boltArtifact tags embedded in attributes (from previous bug)
  const boltTagsInAttr = /(\bclassName\s*=\s*["'][^"']*)(<\/?bolt(?:Action|Artifact)[^>]*>)([^"']*["'])/gi;
  next = next.replace(boltTagsInAttr, (match, before, boltTag, after) => {
    // Remove the bolt tag from inside attribute
    return before + after;
  });

  // Fix 5: Double less-than in attributes (AI generation error)
  const doubleLessThan = /(\bclassName\s*=\s*["'][^"']*)(<<)/g;
  next = next.replace(doubleLessThan, '$1<');

  // Fix 6: Missing closing > before content
  // Pattern: <div className="..." some text (missing >)
  const missingClosingBracket = /(<[a-zA-Z][a-zA-Z0-9]*(?:\s+[a-zA-Z][a-zA-Z0-9-]*\s*=\s*(?:"[^"]*"|'[^']*'|\{[^}]*\}))*\s*)((?:[A-Z][a-z]|[a-z]{2,})\s)/g;
  next = next.replace(missingClosingBracket, (match, tag, content) => {
    // Check if tag is already closed
    if (tag.trim().endsWith('>')) return match;
    return `${tag.trim()}>${content}`;
  });

  // Fix 6d: Incorrect motion.Slice tag (invalid component) -> motion.span
  const beforeMotionSlice = next;
  next = next.replace(/<\s*motion\.Slice\b/g, '<motion.span');
  next = next.replace(/<\s*\/\s*motion\.Slice\s*>/g, '</motion.span>');
  next = next.replace(/<\s*motion\.Span\b/g, '<motion.span');
  next = next.replace(/<\s*\/\s*motion\.Span\s*>/g, '</motion.span>');
  if (next !== beforeMotionSlice) {
    warnings.push('Rewrote invalid motion.Slice/motion.Span tags to motion.span');
  }

  // Fix 6d2: Fallback for non-standard Timeline component (prevents JSX mismatch crashes)
  const beforeTimelineFallback = next;
  next = next.replace(/<\s*Timeline\b/g, '<div');
  next = next.replace(/<\s*\/\s*Timeline\s*>/g, '</div>');
  if (next !== beforeTimelineFallback) {
    warnings.push('Replaced Timeline component tags with div fallback');
  }

  // Fix 6d3: Fallback for TimelineItem component (avoid JSX closing tag errors)
  const beforeTimelineItemFallback = next;
  next = next.replace(/<\s*TimelineItem\b/g, '<div');
  next = next.replace(/<\s*\/\s*TimelineItem\s*>/g, '</div>');
  if (next !== beforeTimelineItemFallback) {
    warnings.push('Replaced TimelineItem component tags with div fallback');
  }

  // Fix 6c0: Stray "required" text after input/textarea tags (/>required or >required)
  const beforeRequiredAttr = next;
  next = next.replace(/<(input|textarea)\b([^>]*?)\/>\s*required\b/gi, '<$1$2 required />');
  next = next.replace(/<(input|textarea)\b([^>]*?)>\s*required\b/gi, '<$1$2 required>');
  if (next !== beforeRequiredAttr) {
    warnings.push('Moved stray required attribute text into input/textarea tags');
  }

  // Fix 6c0a: Misplaced ">" before attributes in self-closing component tags
  // Example: <AnimatedSubscribeButton>on text="Subscribe" className="..." />
  const beforeMisplacedTagClose = next;
  next = next.replace(/<([A-Z][A-Za-z0-9._-]*)([^>]*)>(?=[^<]*\/>)/g, '<$1$2 ');
  next = next.replace(/<([a-z][A-Za-z0-9._-]*\.[A-Za-z0-9._-]+)([^>]*)>(?=[^<]*\/>)/g, '<$1$2 ');
  if (next !== beforeMisplacedTagClose) {
    warnings.push('Fixed misplaced ">" before JSX attributes in self-closing tags');
  }

  // Fix 6c0a1: Misplaced ">on" before attributes in component tags (e.g., <RippleButton>on className="...">)
  const beforeMisplacedOnToken = next;
  next = next.replace(
    /<([A-Za-z][A-Za-z0-9._-]*)([^>]*)>\s*on\s+(?=(?:className|class|style|id|href|src|alt|title|role|type|value|name|text|placeholder|target|rel|tabIndex|aria-[A-Za-z0-9-]+|data-[A-Za-z0-9-]+|on[A-Z][A-Za-z]+)=)/g,
    '<$1$2 ',
  );
  if (next !== beforeMisplacedOnToken) {
    warnings.push('Fixed misplaced "on" token before JSX attributes');
  }

  // Fix 6c0a2: Stray "on" suffix appended to component tags (e.g. <RippleButtonon ...> ... </RippleButton>)
  const beforeOnSuffixTagFix = next;
  next = next.replace(/<([A-Z][A-Za-z0-9._-]*)on(\s[^>]*?)?>/g, (match, base, attrs) => {
    const hasBaseClose = new RegExp(`</${escapeRegExp(base)}\\b`).test(next);
    const hasOnClose = new RegExp(`</${escapeRegExp(base)}on\\b`).test(next);
    if (hasBaseClose && !hasOnClose) {
      return `<${base}${attrs ?? ''}>`;
    }
    return match;
  });
  next = next.replace(/<\/([A-Z][A-Za-z0-9._-]*)on\s*>/g, (match, base) => {
    const hasBaseOpen = new RegExp(`<${escapeRegExp(base)}\\b`).test(next);
    const hasOnOpen = new RegExp(`<${escapeRegExp(base)}on\\b`).test(next);
    if (hasBaseOpen && !hasOnOpen) {
      return `</${base}>`;
    }
    return match;
  });
  if (next !== beforeOnSuffixTagFix) {
    warnings.push('Removed stray "on" suffix from JSX component tag names');
  }

  // Fix 6c0a3: Malformed blockquote tags (e.g., <blockquo>te ...)
  const beforeBlockquoteFix = next;
  next = next.replace(/<\s*blockquo>\s*te\b/gi, '<blockquote');
  next = next.replace(/<\s*blockquo\s+te\b/gi, '<blockquote');
  next = next.replace(/<\/\s*blockquo\s*te\s*>/gi, '</blockquote>');
  if (next !== beforeBlockquoteFix) {
    warnings.push('Fixed malformed blockquote tag names');
  }

  // Fix 6c0a6: Truncated <section> tag names (e.g., <secti ...> or </secti>)
  const beforeSectionTagFix = next;
  next = next.replace(/<\s*secti\b/gi, '<section');
  next = next.replace(/<\/\s*secti\b/gi, '</section');
  if (next !== beforeSectionTagFix) {
    warnings.push('Fixed truncated <section> tag names');
  }

  // Fix 6c0a4: Component tag names split by spaces (e.g., <St ar ...> -> <Star ...>)
  const beforeSplitComponentTags = next;
  let mergedComponentTags = next;
  const splitComponentTag = /<([A-Z][A-Za-z0-9]*)\s+([A-Za-z0-9]+)(?!\s*=)/g;
  const splitClosingComponentTag = /<\/([A-Z][A-Za-z0-9]*)\s+([A-Za-z0-9]+)\s*>/g;
  for (let pass = 0; pass < 3; pass += 1) {
    const prev = mergedComponentTags;
    mergedComponentTags = mergedComponentTags.replace(splitComponentTag, '<$1$2');
    mergedComponentTags = mergedComponentTags.replace(splitClosingComponentTag, '</$1$2>');
    if (mergedComponentTags === prev) break;
  }
  if (mergedComponentTags !== beforeSplitComponentTags) {
    next = mergedComponentTags;
    warnings.push('Merged split JSX component tag names');
  }

  // Fix 6c0a5: Missing space between component name and attribute (e.g., <AuroraTexttext="...">)
  const beforeMissingComponentSpace = next;
  next = next.replace(/<([A-Z][A-Za-z0-9._-]*)([a-z][A-Za-z0-9_-]*=)/g, '<$1 $2');
  if (next !== beforeMissingComponentSpace) {
    warnings.push('Inserted missing space between component name and attribute');
  }

  // Fix 6c0a: Stray boolean text before a self-closing tag (e.g. >last />)
  const beforeTrailingBoolean = next;
  next = next.replace(
    /<([A-Za-z][A-Za-z0-9._-]*)([^>]*?)>\s*([A-Za-z0-9_-]+)\s*(\/>)/g,
    '<$1$2 $3 $4',
  );
  if (next !== beforeTrailingBoolean) {
    warnings.push('Moved stray boolean text into JSX attributes');
  }

  // Fix 6c0b: Duplicate self-closing sequences (e.g. "/> />")
  const beforeDuplicateSelfClose = next;
  next = next.replace(/\/>\s*\/>/g, '/>');
  if (next !== beforeDuplicateSelfClose) {
    warnings.push('Removed duplicate self-closing JSX tokens');
  }

  // Fix 6c0c: Stray "/>" inserted into arrow functions (e.g., "(e) = /> setState(...)")
  const beforeBrokenArrowToken = next;
  next = next.replace(/\)\s*=\s*\/>\s*/g, ') => ');
  if (next !== beforeBrokenArrowToken) {
    warnings.push('Fixed broken arrow function token in JSX attributes');
  }

  // Fix 6c0c1: Missing ">" in arrow functions (e.g., "(e) = handle..." -> "(e) => handle...")
  const beforeMissingArrowToken = next;
  next = next.replace(/\)\s*=\s*(?=[A-Za-z_(])/g, ') => ');
  if (next !== beforeMissingArrowToken) {
    warnings.push('Fixed missing arrow token in JSX attributes');
  }

  // Fix 6c: Ensure <input> is self-closed (void element in JSX)
  const beforeInputSelfClose = next;
  next = next.replace(/<input\b([^>]*?)>/gi, (match, attrs) => {
    if (/\/\s*>$/.test(match)) return match;
    return `<input${attrs} />`;
  });
  next = next.replace(/<\/input>/gi, '');
  if (next !== beforeInputSelfClose) {
    warnings.push('Self-closed <input> tags');
  }

  // Fix 6e: Merge or remove orphaned declarations (e.g. "const" on its own line)
  const beforeLonelyDecl = next;
  next = next.replace(/(^\s*(?:export\s+)?(?:const|let|var)\s*)\n\s*([A-Za-z_$][\w$]*)/gm, '$1 $2');
  next = next.replace(/^\s*(?:export\s+)?(?:const|let|var|function|class)\s*$/gm, '');
  if (next !== beforeLonelyDecl) {
    warnings.push('Fixed orphaned declarations (const/let/var/function/class)');
  }

  // Fix 6e1: Orphaned assignment line before an import (e.g., "const Foo =" then "import ...")
  const beforeOrphanedAssign = next;
  next = next.replace(
    /^\s*(?:export\s+)?(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*\n(\s*import\b)/gm,
    '$1',
  );
  if (next !== beforeOrphanedAssign) {
    warnings.push('Removed orphaned assignment lines before import statements');
  }

  // Fix 6e2: Stray "};" after destructured params before an arrow function.
  const beforeArrowParamSemicolon = next;
  const arrowLines = next.split('\n');
  for (let i = 0; i < arrowLines.length; i += 1) {
    if (!/^\s*}\s*;\s*$/.test(arrowLines[i])) continue;

    let j = i + 1;
    while (j < arrowLines.length && arrowLines[j].trim() === '') {
      j += 1;
    }

    if (j >= arrowLines.length) continue;
    if (/^\s*\}\)\s*=>/.test(arrowLines[j])) {
      arrowLines.splice(i, 1);
      i -= 1;
      continue;
    }
    if (/^\s*\)\s*=>/.test(arrowLines[j])) {
      arrowLines[i] = arrowLines[i].replace(/;\s*$/, '');
    }
  }
  if (arrowLines.join('\n') !== next) {
    next = arrowLines.join('\n');
    warnings.push('Removed stray semicolons before arrow function params');
  }

  // Fix 6e3: Remove duplicate arrow line "}) => (" after an arrow block.
  const beforeDuplicateArrow = next;
  const duplicateArrowLines = next.split('\n');
  let duplicateArrowFixed = false;
  for (let i = 0; i < duplicateArrowLines.length; i += 1) {
    if (!/^\s*\}\)\s*=>\s*\(\s*$/.test(duplicateArrowLines[i])) {
      continue;
    }

    let adjusted = false;
    for (let j = i - 1; j >= 0; j -= 1) {
      const prev = duplicateArrowLines[j];
      if (prev.trim() === '') continue;

      if (/=>\s*\{\s*$/.test(prev)) {
        duplicateArrowLines[j] = prev.replace(/=>\s*\{\s*$/, '=> (');
        adjusted = true;
      } else if (/=>\s*\(\s*$/.test(prev)) {
        adjusted = true;
      }
      break;
    }

    if (!adjusted) {
      duplicateArrowLines[i] = duplicateArrowLines[i].replace(/\}\)\s*=>\s*\(/, 'return (');
    } else {
      duplicateArrowLines[i] = '';
    }

    duplicateArrowFixed = true;
  }
  if (duplicateArrowFixed) {
    next = duplicateArrowLines.join('\n');
    warnings.push('Fixed duplicate arrow function line after props destructuring');
  }

  // Fix 6e4: Stray "}) => (" after statements - replace with "return (".
  const beforeStrayArrowReturn = next;
  const strayArrowLines = next.split('\n');
  let strayArrowFixed = false;
  for (let i = 0; i < strayArrowLines.length; i += 1) {
    if (!/^\s*\}\)\s*=>\s*\(\s*$/.test(strayArrowLines[i])) continue;

    let j = i - 1;
    while (j >= 0 && strayArrowLines[j].trim() === '') {
      j -= 1;
    }

    if (j < 0) continue;
    const prev = strayArrowLines[j].trim();
    if (!/[;}]$/.test(prev)) continue;

    const indent = strayArrowLines[i].match(/^\s*/)?.[0] ?? '';
    strayArrowLines[i] = `${indent}return (`;
    strayArrowFixed = true;
  }
  if (strayArrowFixed) {
    next = strayArrowLines.join('\n');
    warnings.push('Replaced stray arrow line with return statement');
  }

  // Fix 6f: Missing closing brace in import list before "from"
  const beforeImportBraceFix = next;
  next = next.replace(
    /(^\s*import\s*\{[^}\n]*?)\s+from\s+(['"][^'"]+['"]\s*;?)/gm,
    (_match, importList, fromPart) => `${importList} } from ${fromPart}`,
  );
  next = next.replace(
    /(^\s*import\s*\{[^}\n]*?)\s*\n(\s*from\s+['"][^'"]+['"]\s*;?)/gm,
    (_match, importList, fromLine) => `${importList} }\n${fromLine}`,
  );
  if (next !== beforeImportBraceFix) {
    warnings.push('Closed missing } in import list before from');
  }

  // Fix 6b: Missing arrow after props destructuring
  // Pattern: const Component = ({ ... return (
  const missingArrowAfterProps =
    /((?:export\s+)?const)\s+([A-Za-z0-9_]+)\s*=\s*\(\s*\{((?:(?!\}\)\s*=>)[\s\S])*)\n\s*return\s*\(/g;
  const beforeMissingArrow = next;
  next = next.replace(missingArrowAfterProps, (match, decl, name, props) => {
    const cleanedProps = props.replace(/\}\s*$/, '');
    return `${decl} ${name} = ({${cleanedProps}\n}) => (`;
  });
  if (next !== beforeMissingArrow) {
    warnings.push('Fixed missing arrow function after props destructuring');
  }

  // Fix 7: Broken component names where AI splits the name
  // Pattern: <A>pp /> or <R>eactDOM - AI truncates component name after first letter
  // Fix common broken patterns
  const brokenComponentPatterns: Array<[RegExp, string]> = [
    // React components
    [/<A>pp\s*\/>/g, '<App />'],
    [/<A>pp>/g, '<App>'],
    [/<\/A>pp>/g, '</App>'],
    [/<R>eact\./g, '<React.'],
    [/<R>eactDOM/g, '<ReactDOM'],

    // Common HTML tags broken in middle
    [/<secti>on/gi, '<section'],
    [/<\/secti>on>/gi, '</section>'],
    [/<head>er/gi, '<header'],
    [/<\/head>er>/gi, '</header>'],
    [/<foot>er/gi, '<footer'],
    [/<\/foot>er>/gi, '</footer>'],
    [/<nav>igation/gi, '<navigation'],
    [/<art>icle/gi, '<article'],
    [/<\/art>icle>/gi, '</article>'],
    [/<mai>n/gi, '<main'],
    [/<\/mai>n>/gi, '</main>'],
    [/<asi>de/gi, '<aside'],
    [/<\/asi>de>/gi, '</aside>'],
    [/<for>m/gi, '<form'],
    [/<\/for>m>/gi, '</form>'],
    [/<tab>le/gi, '<table'],
    [/<\/tab>le>/gi, '</table>'],
    [/<tex>tarea/gi, '<textarea'],
    [/<\/tex>tarea>/gi, '</textarea>'],

    // Single letter breaks
    [/<d>iv/g, '<div'],
    [/<\/d>iv>/g, '</div>'],
    [/<s>pan/g, '<span'],
    [/<\/s>pan>/g, '</span>'],
    [/<b>utton/g, '<button'],
    [/<\/b>utton>/g, '</button>'],
    [/<i>nput/g, '<input'],
    [/<i>mg/g, '<img'],
    [/<a>\s+href/g, '<a href'],
    [/<h>1/g, '<h1'],
    [/<h>2/g, '<h2'],
    [/<h>3/g, '<h3'],
    [/<h>4/g, '<h4'],
    [/<h>5/g, '<h5'],
    [/<h>6/g, '<h6'],
    [/<p>aragraph/gi, '<paragraph'],
    [/<l>i/g, '<li'],
    [/<\/l>i>/g, '</li>'],
    [/<u>l/g, '<ul'],
    [/<\/u>l>/g, '</ul>'],
    [/<o>l/g, '<ol'],
    [/<\/o>l>/g, '</ol>'],

    // motion components (framer-motion)
    [/<moti>on\./gi, '<motion.'],
    [/<\/moti>on\./gi, '</motion.'],

    // Common lucide-react icons broken in middle
    [/<ShoppingCa>rt/g, '<ShoppingCart'],
    [/<Searc>h/g, '<Search'],
    [/<Hea>rt/g, '<Heart'],
    [/<Use>r/g, '<User'],
    [/<Men>u/g, '<Menu'],
    [/<Arro>w/g, '<Arrow'],
    [/<ArrowRig>ht/g, '<ArrowRight'],
    [/<ArrowLef>t/g, '<ArrowLeft'],
    [/<ArrowU>p/g, '<ArrowUp'],
    [/<ArrowDow>n/g, '<ArrowDown'],
    [/<ChevronRig>ht/g, '<ChevronRight'],
    [/<ChevronLef>t/g, '<ChevronLeft'],
    [/<ChevronU>p/g, '<ChevronUp'],
    [/<ChevronDow>n/g, '<ChevronDown'],
    [/<Chec>k/g, '<Check'],
    [/<Clos>e/g, '<Close'],
    [/<Sta>r/g, '<Star'],
    [/<Plu>s/g, '<Plus'],
    [/<Minu>s/g, '<Minus'],
    [/<Phon>e/g, '<Phone'],
    [/<Mai>l/g, '<Mail'],
    [/<Faceboo>k/g, '<Facebook'],
    [/<Instagra>m/g, '<Instagram'],
    [/<Twitte>r/g, '<Twitter'],
    [/<YouTub>e/g, '<YouTube'],
    [/<LinkedI>n/g, '<LinkedIn'],
    [/<GitHu>b/g, '<GitHub'],
  ];

  for (const [pattern, replacement] of brokenComponentPatterns) {
    next = next.replace(pattern, replacement);
  }

  // Fix 7b: Truncated *Button component names (e.g. AnimatedSubscribeButt -> AnimatedSubscribeButton)
  const beforeButtonTruncation = next;
  next = next.replace(/<([A-Z][A-Za-z0-9_]*)Butt(?!on)(\b[^>]*)/g, '<$1Button$2');
  next = next.replace(/<\/([A-Z][A-Za-z0-9_]*)Butt(?!on)\s*>/g, '</$1Button>');
  if (next !== beforeButtonTruncation) {
    warnings.push('Expanded truncated *Butt component names to *Button');
  }

  // Fix 8: Generic pattern for single uppercase letter followed by >lowercase
  // Catches: <A>ny, <B>utton, <C>omponent, etc.
  const genericBrokenTag = /<([A-Z])>([a-z]+)(\s|>|\/)/g;
  next = next.replace(genericBrokenTag, (match, firstLetter, rest, ending) => {
    return `<${firstLetter}${rest}${ending}`;
  });

  // Fix 8b: PascalCase components broken in middle (e.g., <ShoppingCa>rt -> <ShoppingCart)
  // Pattern: <UppercaseLowercase...>lowercase followed by space, >, / or attributes
  const pascalCaseBrokenTag = /<([A-Z][a-zA-Z]{1,20})>([a-z][a-zA-Z]{0,15})(\s|>|\/)/g;
  next = next.replace(pascalCaseBrokenTag, (match, prefix, suffix, ending) => {
    return `<${prefix}${suffix}${ending}`;
  });

  // Fix 9: Same for closing tags </A>pp> -> </App>
  const genericBrokenClosingTag = /<\/([A-Z])>([a-z]+)>/g;
  next = next.replace(genericBrokenClosingTag, (match, firstLetter, rest) => {
    return `</${firstLetter}${rest}>`;
  });

  // Fix 9b: Closing PascalCase tags broken in middle (</ShoppingCa>rt> -> </ShoppingCart>)
  const pascalCaseBrokenClosingTag = /<\/([A-Z][a-zA-Z]{1,20})>([a-z][a-zA-Z]{0,15})>/g;
  next = next.replace(pascalCaseBrokenClosingTag, (match, prefix, suffix) => {
    return `</${prefix}${suffix}>`;
  });

  // Fix 10: Universal pattern for any lowercase tag broken in middle
  // Catches: <secti>on, <head>er, <foot>er, <arti>cle, etc.
  // Pattern: <lowercase letters>any lowercase letters followed by space, >, / or attribute
  // Changed {2,6} to {1,6} to also catch single-letter breaks like <n>av
  const genericBrokenLowercaseTag = /<([a-z]{1,6})>([a-z]{1,10})(\s|>|\/|$)/gi;
  next = next.replace(genericBrokenLowercaseTag, (match, prefix, suffix, ending) => {
    // Reconstruct the tag name
    return `<${prefix}${suffix}${ending}`;
  });

  // Fix 11: Same for closing lowercase tags </secti>on> -> </section>
  const genericBrokenLowercaseClosingTag = /<\/([a-z]{1,6})>([a-z]{1,10})>/gi;
  next = next.replace(genericBrokenLowercaseClosingTag, (match, prefix, suffix) => {
    return `</${prefix}${suffix}>`;
  });

  // Fix 12: Specific single-letter broken tags that are very common
  const singleLetterBrokenTags: Array<[RegExp, string]> = [
    [/<n>av/gi, '<nav'],
    [/<\/n>av>/gi, '</nav>'],
    [/<a>rticle/gi, '<article'],
    [/<\/a>rticle>/gi, '</article>'],
    [/<s>ection/gi, '<section'],
    [/<\/s>ection>/gi, '</section>'],
    [/<h>eader/gi, '<header'],
    [/<\/h>eader>/gi, '</header>'],
    [/<f>ooter/gi, '<footer'],
    [/<\/f>ooter>/gi, '</footer>'],
    [/<m>ain/gi, '<main'],
    [/<\/m>ain>/gi, '</main>'],
    [/<a>side/gi, '<aside'],
    [/<\/a>side>/gi, '</aside>'],
    [/<f>orm/gi, '<form'],
    [/<\/f>orm>/gi, '</form>'],
    [/<t>able/gi, '<table'],
    [/<\/t>able>/gi, '</table>'],
  ];

  for (const [pattern, replacement] of singleLetterBrokenTags) {
    next = next.replace(pattern, replacement);
  }

  // Fix 13: Orphaned opening tags - AI starts a tag but doesn't finish it
  // Pattern: <span followed by newline and another <tag (missing >)
  // Example: <span\n<span className=... → <span />\n<span className=...
  const orphanedOpeningTag = /(<[a-zA-Z][a-zA-Z0-9]*)(\s*\n\s*)(<[a-zA-Z])/g;
  next = next.replace(orphanedOpeningTag, (match, orphan, whitespace, nextTag) => {
    // Check if the orphan tag has any attributes started
    if (orphan.includes(' ') || orphan.includes('=')) {
      // Has attributes but incomplete - close with >
      return `${orphan}>${whitespace}${nextTag}`;
    }
    // Just the tag name - make it self-closing
    return `${orphan} />${whitespace}${nextTag}`;
  });

  // Fix 14: Tag with space but no closing - <span followed by whitespace then <
  // Pattern: <span       <div  (multiple spaces instead of >)
  const tagWithTrailingSpaces = /(<[a-zA-Z][a-zA-Z0-9]*)\s{2,}(<[a-zA-Z])/g;
  next = next.replace(tagWithTrailingSpaces, '$1 />$2');

  // Fix 15: Mismatched closing tags - often caused by "stuttering" or merging lines
  // Example: <h4 className="..."></div>><div>  -->  <h4 className="..."></h4><div>
  // We'll replace the immediate mismatch with a self-closing of the first tag, or just close it correctly if we can guess.
  // For safety, let's turn <tag ...></div> into <tag ... /></div>
  const mismatchedClosingDiv = /(<([a-zA-Z][a-zA-Z0-9]*)[^>]*>)<\/div>/g;
  next = next.replace(mismatchedClosingDiv, (match, openTag, tagName) => {
    if (tagName.toLowerCase() === 'div') return match; // Normal div closing
    return `${openTag.replace(/>$/, ' />')}</div>`; // Close the original tag, keep the div close
  });

  // Fix 16: The specific garbage pattern reported: "></div>><div>"
  // This often appears when the AI gets confused between closing a div and starting a new section
  next = next.replace(/"> <\/div>><div>/g, '"></div><div>');
  next = next.replace(/"> <\/div>>/g, '"></div>');
  next = next.replace(/"> <\/div>>/g, '"></div>'); // Handle potential variations

  // Fix 17: "Stuttered" lines where a tag starts but is interrupted by a div close
  // Pattern: <h4 ...></div>><div>
  next = next.replace(/(<[a-zA-Z0-9]+[^>]+)> <\/div>>/g, '$1 />');
  next = next.replace(/(<[a-zA-Z0-9]+[^>]+)> <\/div>/g, '$1 />');

  // Fix 18: Missing space between tag name and first attribute
  // Pattern: <spanclassName="..." -> <span className="..."
  const missingSpaceBetweenTagAndAttr =
    /<([A-Za-z][A-Za-z0-9._-]*)(className|class|style|id|href|src|alt|title|role|type|value|name|text|placeholder|target|rel|tabIndex|aria-[A-Za-z0-9-]+|data-[A-Za-z0-9-]+|on[A-Z][A-Za-z]+)=/g;
  next = next.replace(missingSpaceBetweenTagAndAttr, '<$1 $2=');

  // Fix 16: Tag duplicated after a missing attribute assignment
  // Pattern: <Disc className<Disc ... -> <Disc ...
  const duplicatedTagAfterAttr =
    /<([A-Za-z][A-Za-z0-9._-]*)\s+(className|class|style|id|href|src|alt|title|role|type|value|name|placeholder|target|rel|tabIndex|aria-[A-Za-z0-9-]+|data-[A-Za-z0-9-]+)\s*<\1\b/g;
  next = next.replace(duplicatedTagAfterAttr, '<$1');

  // Fix 17: Duplicate "<" before a tag (e.g., <<motion.a ...)
  const doubleOpenAngle = /<\s*<\s*([A-Za-z][A-Za-z0-9._-]*)/g;
  next = next.replace(doubleOpenAngle, '<$1');

  // Fix 18: Missing ">" right after tag name (e.g., <spanLive Chat</span>)
  const missingTagCloseBeforeText = /<([A-Za-z][A-Za-z0-9._-]*)([A-Za-z0-9][^<]*?)<\/\1>/g;
  next = next.replace(missingTagCloseBeforeText, (_match, tag, text) => `<${tag}>${text}</${tag}>`);

  // Fix 19: Auto-close span before closing anchor/button when missing </span>
  const spanCloseTargets = /<\/(motion\.[A-Za-z0-9_]+|a|button)>/;
  const spanLines = next.split('\n');
  let spanClosed = false;
  for (let i = 0; i < spanLines.length; i += 1) {
    const line = spanLines[i];
    if (!line.includes('<span') || line.includes('</span>')) continue;
    if (/<span\b[^>]*\/>/.test(line)) continue;
    if (!spanCloseTargets.test(line)) continue;

    spanLines[i] = line.replace(spanCloseTargets, '</span>$&');
    spanClosed = true;
  }

  if (spanClosed) {
    next = spanLines.join('\n');
  }

  // Fix 20: Unterminated image proxy string literals (common in long URLs).
  const urlMarkers = ['__image_proxy__?url=', 'image_proxy?url='];
  const lines = next.split('\n');
  let lineChanged = false;
  const continuationPattern = /^[A-Za-z0-9%&=?.:_-]+/;
  const MAX_LOOKAHEAD = 3;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const markerInfo = urlMarkers
      .map((marker) => ({ marker, index: line.indexOf(marker) }))
      .filter((entry) => entry.index !== -1)
      .sort((a, b) => a.index - b.index)[0];
    if (!markerInfo) continue;
    const { marker, index: markerIndex } = markerInfo;

    const singleIndex = line.lastIndexOf("'", markerIndex);
    const doubleIndex = line.lastIndexOf('"', markerIndex);
    const quoteIndex = Math.max(singleIndex, doubleIndex);
    if (quoteIndex === -1) continue;

    const quoteChar = quoteIndex === singleIndex ? "'" : '"';
    const closingIndex = line.indexOf(quoteChar, markerIndex + marker.length);
    if (closingIndex !== -1) continue;

    let merged = line;
    let endIndex = i;
    let foundClosing = false;

    for (let j = i + 1; j < lines.length && j <= i + MAX_LOOKAHEAD; j += 1) {
      const nextLine = lines[j];
      const trimmed = nextLine.trimStart();
      const closePos = trimmed.indexOf(quoteChar);

      if (closePos !== -1) {
        merged += trimmed;
        endIndex = j;
        foundClosing = true;
        break;
      }

      if (!continuationPattern.test(trimmed)) {
        break;
      }

      merged += trimmed;
      endIndex = j;
    }

    if (endIndex > i) {
      lines.splice(i + 1, endIndex - i);
    }

    if (!foundClosing) {
      merged = merged.replace(/(\s*,\s*)?$/, (match) => `${quoteChar}${match ?? ''}`);
    }

    lines[i] = merged;
    lineChanged = true;
  }

  if (lineChanged) {
    next = lines.join('\n');
  }

  if (next !== before) {
    warnings.push('Fixed truncated or malformed JSX attributes (AI generation error)');
    console.log('[CodeSanitizer] JSX FIXED! Changes were made to the code.');
    // Log a snippet of what was changed
    console.log('[CodeSanitizer] Before length:', before.length, 'After length:', next.length);
  }

  return next;
}

function sanitizeJsxComments(code: string, warnings: string[]) {
  const before = code;
  const next = code.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

  if (next !== before) {
    warnings.push('Removed JSX comment blocks');
  }

  return next;
}

function sanitizeImportPaths(code: string, relativePath: string, warnings: string[]) {
  let next = code;

  // Some registries/snippets use "@/registry/ui/*" paths. Our baseline uses "@/components/ui/*".
  const beforeRegistry = next;
  next = next.replace(/(['"])@\/registry\/ui\//g, '$1@/components/ui/');
  if (next !== beforeRegistry) {
    warnings.push('Rewrote @/registry/ui import path to @/components/ui');
  }

  // Fix common alias usage in generated Vite projects:
  // - "@/..." assumes Next/shadcn-style alias; convert to relative path against src/.
  const fileDir = nodePath.dirname(relativePath);

  return next.replace(/from\s+(['"])@\/([^'"]+)\1/g, (_match, quote: string, aliasPath: string) => {
    const targetPath = nodePath.join('src', aliasPath);
    let relativeImport = nodePath.relative(fileDir, targetPath).replace(/\\/g, '/');

    if (!relativeImport.startsWith('.')) {
      relativeImport = `./${relativeImport}`;
    }

    warnings.push(`Rewrote @/ import to relative: ${aliasPath} -> ${relativeImport}`);
    return `from ${quote}${relativeImport}${quote}`;
  });
}

function sanitizeLucide(code: string, warnings: string[]) {
  let next = code;

  // Normalize any lucide-react/dist* imports to lucide-react.
  const beforePath = next;
  next = next.replace(/(['"])lucide-react\/dist(?:\/[^'"]*)?\1/g, '$1lucide-react$1');
  if (next !== beforePath) {
    warnings.push('Rewrote lucide-react/dist import to lucide-react');
  }

  // Map of hallucinated/non-existent lucide icons to their valid replacements
  // AI often generates imports for icons that don't exist in lucide-react
  const invalidIconReplacements: Record<string, string> = {
    'House': 'Home',
    'CirclePlay': 'PlayCircle',
    'Discord': 'MessageCircle',      // Discord icon doesn't exist, use MessageCircle
    'PayPal': 'CreditCard',           // PayPal doesn't exist
    'Visa': 'CreditCard',             // Visa doesn't exist  
    'Mastercard': 'CreditCard',       // Mastercard doesn't exist
    'Paypal': 'CreditCard',           // Various capitalizations
    'Telegram': 'Send',               // Telegram doesn't exist
    'WhatsApp': 'MessageCircle',      // WhatsApp doesn't exist
    'Whatsapp': 'MessageCircle',
    'TikTok': 'Music',                // TikTok doesn't exist
    'Tiktok': 'Music',
    'Pinterest': 'Pin',               // Pinterest doesn't exist
    'Spotify': 'Music',               // Spotify doesn't exist
    'Apple': 'Smartphone',            // Apple doesn't exist
    'Google': 'Globe',                // Google doesn't exist
    'Amazon': 'Package',              // Amazon doesn't exist
    'Stripe': 'CreditCard',           // Stripe doesn't exist
    'Venmo': 'Wallet',                // Venmo doesn't exist
    'Amex': 'CreditCard',             // Amex doesn't exist
    'ApplePay': 'Wallet',             // ApplePay doesn't exist
    'GooglePay': 'Wallet',            // GooglePay doesn't exist
    'Audiophile': 'Headphones',       // Audiophile doesn't exist (from Vinyl Vault prompt)
    'Vinyl': 'Disc',                  // Vinyl doesn't exist
    'Record': 'Disc',                 // Record doesn't exist
    'Album': 'Disc',                  // Album doesn't exist
  };

  const replacedIcons: string[] = [];

  next = next.replace(
    /import\s+\{([\s\S]*?)\}\s+from\s+['"]lucide-react['"]\s*;?/g,
    (full, specifiers: string) => {
      const parts = specifiers
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);

      let hasReplacement = false;
      const mapped = parts.map((part) => {
        // Extract the icon name (handle "IconName" or "IconName as alias")
        const match = part.match(/^(\w+)(\s+as\s+.+)?$/);
        if (!match) return part;

        const iconName = match[1];
        const alias = match[2] || '';

        if (invalidIconReplacements[iconName]) {
          hasReplacement = true;
          const replacement = invalidIconReplacements[iconName];
          replacedIcons.push(`${iconName} → ${replacement}`);
          return replacement + alias;
        }
        return part;
      });

      if (!hasReplacement) return full;

      // De-duplicate
      const deduped: string[] = [];
      const seen = new Set<string>();
      for (const part of mapped) {
        const key = part.replace(/\s+/g, ' ').trim();
        if (seen.has(key)) continue;
        seen.add(key);
        deduped.push(part);
      }

      return `import { ${deduped.join(', ')} } from "lucide-react";`;
    },
  );

  // Also replace usages in JSX
  for (const [invalid, valid] of Object.entries(invalidIconReplacements)) {
    if (next.includes(`<${invalid}`)) {
      next = next.replace(new RegExp(`<${invalid}\\b`, 'g'), `<${valid}`);
      next = next.replace(new RegExp(`</${invalid}>`, 'g'), `</${valid}>`);
      if (!replacedIcons.includes(`${invalid} → ${valid}`)) {
        replacedIcons.push(`${invalid} → ${valid} (JSX usage)`);
      }
    }
  }

  if (replacedIcons.length > 0) {
    warnings.push(`Replaced non-existent lucide icons: ${replacedIcons.join(', ')}`);
    console.log(`[CodeSanitizer] Replaced lucide icons: ${replacedIcons.join(', ')}`);
  }

  // Some LLMs hallucinate `import { Lucide } from "lucide-react"`, but `Lucide` is not a valid export.
  // Remove it to prevent runtime/import errors.
  const beforeLucide = next;
  next = next.replace(
    /import\s+\{([\s\S]*?)\}\s+from\s+['"]lucide-react['"]\s*;?/g,
    (full, specifiers: string) => {
      if (!/\bLucide\b/.test(specifiers)) return full;
      const parts = specifiers
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
        .filter((part) => !/^Lucide(\s+as\s+.+)?$/.test(part));

      warnings.push('Removed invalid lucide-react named import: Lucide');
      if (parts.length === 0) return '';
      return `import { ${parts.join(', ')} } from "lucide-react";`;
    },
  );
  if (next !== beforeLucide) {
    // no-op
  }

  return next;
}

function sanitizeNext(code: string, warnings: string[]) {
  let next = code;

  // next/image is not available in Vite projects; convert to <img>.
  const beforeNextImage = next;
  next = removeModuleImports(next, 'next/image');
  if (next !== beforeNextImage) {
    warnings.push('Removed next/image import (use <img>)');
    next = next.replace(/<\s*Image\b/g, '<img');
    next = next.replace(/<\/\s*Image\b/g, '</img');
  }

  // next/link is not available; convert to <a>.
  const beforeNextLink = next;
  next = removeModuleImports(next, 'next/link');
  if (next !== beforeNextLink) {
    warnings.push('Removed next/link import (use <a>)');
    next = next.replace(/<\s*Link\b/g, '<a');
    next = next.replace(/<\/\s*Link\b/g, '</a');
  }

  return next;
}

function sanitizeRouter(code: string, warnings: string[]) {
  let next = code;

  // react-router-dom isn't part of the default Vite template in this context.
  const before = next;
  next = removeModuleImports(next, 'react-router-dom');
  if (next !== before) {
    warnings.push('Removed react-router-dom import (use <a href>)');
    next = next.replace(/<\s*NavLink\b/g, '<a');
    next = next.replace(/<\/\s*NavLink\b/g, '</a');
    next = next.replace(/<\s*Link\b/g, '<a');
    next = next.replace(/<\/\s*Link\b/g, '</a');
    next = next.replace(/\bto=/g, 'href=');
  }

  return next;
}

function sanitizeImages(code: string, warnings: string[]) {
  let next = code;
  const proxyPrefix = '/__image_proxy__?url=';
  const proxyMarker = '/__image_proxy__?url=';

  const beforeProxyNormalize = next;
  next = next.replace(/\/image_proxy\?url=/g, '/__image_proxy__?url=');
  next = next.replace(/(^|[^/])__image_proxy__\?url=/g, '$1/__image_proxy__?url=');
  if (next !== beforeProxyNormalize) {
    warnings.push('Normalized image proxy URLs to /__image_proxy__?url=');
  }

  // Some generated projects reference non-existent local assets like /images/hero.jpg.
  const beforeLocalHero = next;
  next = next.replace(/(['"`])\/images\/hero\.(?:jpg|jpeg|png)\1/g, '$1/images/hero.svg$1');
  next = next.replace(/(['"`])\/images\/hero\.(?:jpg|jpeg|png)\?\S*?\1/g, '$1/images/hero.svg$1');
  next = next.replace(/url\((['"]?)\/images\/hero\.(?:jpg|jpeg|png)(?:\?[^'")]+)?\1\)/g, "url('/images/hero.svg')");

  if (next !== beforeLocalHero) {
    warnings.push('Rewrote /images/hero.(jpg|png) to /images/hero.svg');
  }

  const beforeExternal = next;
  const toProxy = (url: string) => `${proxyPrefix}${encodeURIComponent(url)}`;
  const shouldProxy = (url: string) =>
    url &&
    !url.includes(proxyMarker) &&
    !url.startsWith('data:') &&
    !url.startsWith('blob:');

  const proxySrcSet = (value: string) => {
    const entries = value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const [url, ...rest] = entry.split(/\s+/);
        if (!url || !shouldProxy(url)) return entry;
        return [toProxy(url), ...rest].join(' ');
      });

    return entries.join(', ');
  };

  // JSX/HTML src="https://..."
  next = next.replace(/(\bsrc\s*=\s*["'])(https?:\/\/[^"'`}\s]+)(["'])/gi, (full, start, url, end) => {
    if (!shouldProxy(url)) return full;
    return `${start}${toProxy(url)}${end}`;
  });

  // JSX/HTML src={'https://...'}
  next = next.replace(/(\bsrc\s*=\s*\{\s*["'])(https?:\/\/[^"'`}\s]+)(["']\s*\})/gi, (full, start, url, end) => {
    if (!shouldProxy(url)) return full;
    return `${start}${toProxy(url)}${end}`;
  });

  // srcset / srcSet attributes
  next = next.replace(/(\bsrcset\s*=\s*["'])([^"']+)(["'])/gi, (full, start, value, end) => {
    const proxied = proxySrcSet(value);
    return proxied ? `${start}${proxied}${end}` : full;
  });

  next = next.replace(/(\bsrcSet\s*=\s*\{\s*["'])([^"']+)(["']\s*\})/gi, (full, start, value, end) => {
    const proxied = proxySrcSet(value);
    return proxied ? `${start}${proxied}${end}` : full;
  });

  // data-src / data-srcset / poster (often used by lazy loaders)
  next = next.replace(/(\bdata-src\s*=\s*["'])(https?:\/\/[^"'`}\s]+)(["'])/gi, (full, start, url, end) => {
    if (!shouldProxy(url)) return full;
    return `${start}${toProxy(url)}${end}`;
  });

  next = next.replace(/(\bdata-srcset\s*=\s*["'])([^"']+)(["'])/gi, (full, start, value, end) => {
    const proxied = proxySrcSet(value);
    return proxied ? `${start}${proxied}${end}` : full;
  });

  next = next.replace(/(\bposter\s*=\s*["'])(https?:\/\/[^"'`}\s]+)(["'])/gi, (full, start, url, end) => {
    if (!shouldProxy(url)) return full;
    return `${start}${toProxy(url)}${end}`;
  });

  // CSS url("https://...")
  next = next.replace(/url\(\s*(['"]?)(https?:\/\/[^'")\s]+)\1\s*\)/gi, (full, quote, url) => {
    if (!shouldProxy(url)) return full;
    return `url('${toProxy(url)}')`;
  });

  const beforeLiteralUrls = next;
  const knownImageHosts =
    /^(https?:\/\/(?:images\.unsplash\.com|source\.unsplash\.com|images\.pexels\.com|picsum\.photos|placehold\.co|via\.placeholder\.com|cdn\.pixabay\.com))/i;
  const imageExtension = /\.(?:png|jpe?g|webp|gif|avif|svg)(?:\?.*)?$/i;

  // String literals holding image URLs (arrays/config objects/etc).
  next = next.replace(/(['"`])((?:https?:\/\/)[^'"`\s]+)(\1)/gi, (full, quote, url, end) => {
    if (!shouldProxy(url)) return full;
    if (!knownImageHosts.test(url) && !imageExtension.test(url)) return full;
    return `${quote}${toProxy(url)}${end}`;
  });

  if (next !== beforeLiteralUrls) {
    warnings.push('Rewrote external image URL string literals to /__image_proxy__');
  }

  if (next !== beforeExternal) {
    warnings.push('Rewrote external image URLs to /__image_proxy__ for WebContainer');
  }

  return next;
}

function sanitizeTailwindShadcnTokensInCss(code: string, warnings: string[]) {
  const before = code;
  let next = code;

  // Tailwind throws on `@apply` for unknown utilities. Many shadcn templates rely on tokens like
  // `border-border`/`bg-background` which may not exist in generated configs.
  // Map the most common ones to safe Tailwind defaults so the preview doesn't white-screen.
  const replacements: Array<[RegExp, string]> = [
    [/\bborder-border\b/g, 'border-neutral-200 dark:border-neutral-800'],
    [/\bborder-input\b/g, 'border-neutral-300 dark:border-neutral-700'],
    [/\bbg-background\b/g, 'bg-white dark:bg-neutral-950'],
    [/\btext-foreground\b/g, 'text-neutral-900 dark:text-neutral-50'],
    [/\bbg-card\b/g, 'bg-white dark:bg-neutral-900'],
    [/\btext-card-foreground\b/g, 'text-neutral-900 dark:text-neutral-50'],
    [/\bbg-popover\b/g, 'bg-white dark:bg-neutral-900'],
    [/\btext-popover-foreground\b/g, 'text-neutral-900 dark:text-neutral-50'],
    [/\btext-muted-foreground\b/g, 'text-neutral-500 dark:text-neutral-400'],
    [/\bring-ring\b/g, 'ring-neutral-400 dark:ring-neutral-500'],
  ];

  for (const [pattern, replacement] of replacements) {
    next = next.replace(pattern, replacement);
  }

  if (next !== before) {
    warnings.push('Rewrote shadcn Tailwind tokens in CSS to stable neutral defaults');
  }

  return next;
}

/**
 * Fix common CSS syntax errors from AI generation, such as truncated property values.
 * Examples: "margin;" → "margin: 0;", "padding;" → "padding: 0;"
 */
function sanitizeCssSyntaxErrors(code: string, warnings: string[]) {
  const before = code;
  let next = code;

  // Strip accidental JS/TS exports or imports injected into CSS files.
  const cssLines = next.split(/\r?\n/);
  let jsStartIndex = -1;

  for (let i = 0; i < cssLines.length; i += 1) {
    const line = cssLines[i];
    if (/^\s*export\s+/.test(line) || /^\s*import\s+/.test(line) || /module\.exports/.test(line) || /\brequire\s*\(/.test(line)) {
      jsStartIndex = i;
      break;
    }
  }

  if (jsStartIndex !== -1) {
    next = cssLines.slice(0, jsStartIndex).join('\n');
    warnings.push('Removed JS export/import block from CSS');
  }

  // Fix truncated CSS properties (property name followed by ; without value)
  // Common cases: margin;, padding;, width;, height;, etc.
  const truncatedPropertyFixes: Array<[RegExp, string]> = [
    // Spacing properties - default to 0
    [/\bmargin\s*;/gi, 'margin: 0;'],
    [/\bpadding\s*;/gi, 'padding: 0;'],
    [/\bgap\s*;/gi, 'gap: 0;'],

    // Sizing properties - default to auto
    [/\bwidth\s*;/gi, 'width: auto;'],
    [/\bheight\s*;/gi, 'height: auto;'],
    [/\bmin-width\s*;/gi, 'min-width: 0;'],
    [/\bmin-height\s*;/gi, 'min-height: 0;'],
    [/\bmax-width\s*;/gi, 'max-width: none;'],
    [/\bmax-height\s*;/gi, 'max-height: none;'],

    // Color properties - default to inherit
    [/\bcolor\s*;/gi, 'color: inherit;'],
    [/\bbackground-color\s*;/gi, 'background-color: transparent;'],
    [/\bbackground\s*;/gi, 'background: transparent;'],
    [/\bborder-color\s*;/gi, 'border-color: currentColor;'],

    // Border properties - default to none
    [/\bborder\s*;/gi, 'border: none;'],
    [/\bborder-width\s*;/gi, 'border-width: 0;'],
    [/\bborder-radius\s*;/gi, 'border-radius: 0;'],
    [/\boutline\s*;/gi, 'outline: none;'],

    // Font properties - default to inherit
    [/\bfont-size\s*;/gi, 'font-size: inherit;'],
    [/\bfont-weight\s*;/gi, 'font-weight: inherit;'],
    [/\bfont-family\s*;/gi, 'font-family: inherit;'],
    [/\bline-height\s*;/gi, 'line-height: inherit;'],

    // Display/layout - default to block/initial
    [/\bdisplay\s*;/gi, 'display: block;'],
    [/\bposition\s*;/gi, 'position: static;'],
    [/\boverflow\s*;/gi, 'overflow: visible;'],
    [/\bz-index\s*;/gi, 'z-index: auto;'],

    // Flex properties
    [/\bflex\s*;/gi, 'flex: 0 1 auto;'],
    [/\bflex-direction\s*;/gi, 'flex-direction: row;'],
    [/\bjustify-content\s*;/gi, 'justify-content: flex-start;'],
    [/\balign-items\s*;/gi, 'align-items: stretch;'],

    // Other common properties
    [/\btop\s*;/gi, 'top: auto;'],
    [/\bright\s*;/gi, 'right: auto;'],
    [/\bbottom\s*;/gi, 'bottom: auto;'],
    [/\bleft\s*;/gi, 'left: auto;'],
    [/\bopacity\s*;/gi, 'opacity: 1;'],
    [/\btransform\s*;/gi, 'transform: none;'],
    [/\btransition\s*;/gi, 'transition: none;'],
    [/\bbox-shadow\s*;/gi, 'box-shadow: none;'],
    [/\btext-align\s*;/gi, 'text-align: left;'],
    [/\btext-decoration\s*;/gi, 'text-decoration: none;'],
    [/\bcursor\s*;/gi, 'cursor: auto;'],
  ];

  for (const [pattern, replacement] of truncatedPropertyFixes) {
    next = next.replace(pattern, replacement);
  }

  // Fix double semicolons
  next = next.replace(/;;+/g, ';');

  // Fix empty rule blocks (common when AI truncates)
  next = next.replace(/\{\s*\}/g, '{ }');

  const propertyFixApplied = next !== before;

  // Strip JS-style single line comments that break PostCSS (keep protocol URLs)
  const lines = next.split(/\r?\n/);
  let cleanedLines = lines;
  let removedLineComments = false;

  cleanedLines = lines.map((line) => {
    const commentIndex = line.indexOf('//');

    if (commentIndex === -1) {
      return line;
    }

    const beforeComment = line.slice(0, commentIndex);
    const trimmed = beforeComment.trimEnd();

    if (/(http:|https:|data:)$/.test(trimmed)) {
      return line;
    }

    if (/url\([^)]*$/.test(trimmed)) {
      return line;
    }

    removedLineComments = true;
    return beforeComment.replace(/\s+$/, '');
  });

  if (removedLineComments) {
    next = cleanedLines.join('\n');
    warnings.push('Removed JS-style // comments from CSS');
  }

  // Close unbalanced block comments to avoid PostCSS parse errors
  const openBlockComments = (next.match(/\/\*/g) ?? []).length;
  const closeBlockComments = (next.match(/\*\//g) ?? []).length;

  if (openBlockComments > closeBlockComments) {
    next += '\n*/';
    warnings.push('Closed unterminated CSS block comment');
  }

  const beforeBraceBalance = next;
  const braceFix = closeUnbalancedCssBraces(next);
  next = braceFix.content;
  if (next !== beforeBraceBalance) {
    warnings.push(...braceFix.warnings);
  }

  if (propertyFixApplied) {
    warnings.push('Fixed truncated or malformed CSS properties (AI generation error)');
  }

  return next;
}

function hasBalancedCssBraces(css: string): boolean {
  let depth = 0;
  let inString: string | null = null;
  let inComment = false;

  for (let i = 0; i < css.length; i += 1) {
    const ch = css[i];
    const next = css[i + 1];

    if (inComment) {
      if (ch === '*' && next === '/') {
        inComment = false;
        i += 1;
      }
      continue;
    }

    if (inString) {
      if (ch === '\\') {
        i += 1;
        continue;
      }
      if (ch === inString) {
        inString = null;
      }
      continue;
    }

    if (ch === '/' && next === '*') {
      inComment = true;
      i += 1;
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = ch;
      continue;
    }

    if (ch === '{') {
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
      if (depth < 0) {
        return false;
      }
    }
  }

  return depth === 0 && !inComment && !inString;
}

function closeUnbalancedCssBraces(css: string): { content: string; warnings: string[] } {
  let depth = 0;
  let inString: string | null = null;
  let inComment = false;
  const warnings: string[] = [];

  for (let i = 0; i < css.length; i += 1) {
    const ch = css[i];
    const next = css[i + 1];

    if (inComment) {
      if (ch === '*' && next === '/') {
        inComment = false;
        i += 1;
      }
      continue;
    }

    if (inString) {
      if (ch === '\\') {
        i += 1;
        continue;
      }
      if (ch === inString) {
        inString = null;
      }
      continue;
    }

    if (ch === '/' && next === '*') {
      inComment = true;
      i += 1;
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = ch;
      continue;
    }

    if (ch === '{') {
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
      if (depth < 0) {
        return { content: css, warnings: [] };
      }
    }
  }

  if (depth > 0) {
    warnings.push('Closed unbalanced CSS braces');
    return { content: `${css}\n${'}'.repeat(depth)}`, warnings };
  }

  return { content: css, warnings: [] };
}

function isLikelyValidViteConfig(code: string): boolean {
  const trimmed = code.trim();
  if (!trimmed) return false;

  const hasExport =
    /\bexport\s+default\b/.test(trimmed) ||
    /\bmodule\.exports\s*=/.test(trimmed);

  if (!hasExport) {
    return false;
  }

  if (/(?:\]|\}|\))\s*\n\s*[A-Za-z_][A-Za-z0-9_-]*\s*:/.test(trimmed)) {
    return false;
  }

  return hasBalancedJsDelimiters(trimmed);
}

function isLikelyValidPostcssConfig(code: string): boolean {
  const trimmed = code.trim();
  if (!trimmed) return false;

  const withoutLeadingComments = trimmed.replace(
    /^\s*(?:\/\*[\s\S]*?\*\/\s*|\/\/[^\n]*\n\s*)+/,
    '',
  ).trimStart();
  const exportMatch = withoutLeadingComments.match(/^(?:export\s+default\b|module\.exports\s*=)/);

  if (!exportMatch) {
    return false;
  }

  const exportEndIndex = exportMatch[0].length;
  const braceStart = withoutLeadingComments.indexOf('{', exportEndIndex);
  if (braceStart === -1) {
    return false;
  }

  const braceEnd = findMatchingBrace(withoutLeadingComments, braceStart);
  if (braceEnd === -1) {
    return false;
  }

  const configBlock = withoutLeadingComments.slice(0, braceEnd + 1);
  if (!/\bplugins\s*:\s*\{/.test(configBlock)) {
    return false;
  }

  if (/(^|\n)\s*@(?:tailwind|apply|layer|import)\b/.test(configBlock)) {
    return false;
  }

  const trailing = stripJsComments(withoutLeadingComments.slice(braceEnd + 1));
  if (trailing.replace(/[;\s]/g, '').length > 0) {
    return false;
  }

  return hasBalancedJsDelimiters(withoutLeadingComments);
}

function normalizePostcssConfigForCompare(code: string): string {
  return stripJsComments(code).replace(/\s+/g, '').replace(/;+/g, '');
}

function isLikelyValidTailwindConfig(code: string): boolean {
  const trimmed = code.trim();
  if (!trimmed) return false;

  const withoutLeadingComments = trimmed.replace(
    /^\s*(?:\/\*[\s\S]*?\*\/\s*|\/\/[^\n]*\n\s*)+/, 
    '',
  ).trimStart();

  const exportMatch = withoutLeadingComments.match(/^(?:export\s+default\b|module\.exports\s*=)/);
  if (!exportMatch) {
    return false;
  }

  const exportEndIndex = exportMatch[0].length;
  const braceStart = withoutLeadingComments.indexOf('{', exportEndIndex);
  if (braceStart === -1) {
    return false;
  }

  const braceEnd = findMatchingBrace(withoutLeadingComments, braceStart);
  if (braceEnd === -1) {
    return false;
  }

  const configBlock = withoutLeadingComments.slice(0, braceEnd + 1);
  if (!/\bcontent\s*:/.test(configBlock)) {
    return false;
  }

  if (/(^|\n)\s*@(?:tailwind|apply|layer|import)\b/.test(configBlock)) {
    return false;
  }

  return hasBalancedJsDelimiters(withoutLeadingComments);
}

function sanitizeTailwindConfigSyntax(code: string, normalizedPath: string, warnings: string[]): string {
  const isCommonJs = /\.cjs$/i.test(normalizedPath);
  let next = code.replace(/^\uFEFF/, '');

  next = next.replace(/^\s*```[a-zA-Z]*\s*/gm, '').replace(/\s*```\s*$/gm, '');

  const exportStartMatch = next.match(/^\s*(?:export\s+default\b|module\.exports\s*=)/m);
  if (exportStartMatch && exportStartMatch.index !== undefined && exportStartMatch.index > 0) {
    const leading = next.slice(0, exportStartMatch.index);
    if (leading.trim().length > 0) {
      warnings.push('Removed junk before tailwind.config export');
    }
    next = next.slice(exportStartMatch.index);
  }

  if (!isCommonJs && /^\s*module\.exports\s*=/m.test(next)) {
    next = next.replace(/^\s*module\.exports\s*=\s*/gm, 'export default ');
    warnings.push('Rewrote tailwind.config export to match module type');
  } else if (isCommonJs && /^\s*export\s+default\b/m.test(next)) {
    next = next.replace(/^\s*export\s+default\b/gm, 'module.exports =');
    warnings.push('Rewrote tailwind.config export to match module type');
  }

  const exportMatches = [...next.matchAll(/^\s*(?:module\.exports\s*=|export\s+default\b)/gm)];
  if (exportMatches.length > 1) {
    const lastMatch = exportMatches[exportMatches.length - 1];
    next = next.slice(lastMatch.index ?? 0).trimStart();
    warnings.push('Removed duplicated tailwind.config content (LLM restart detected)');
  }

  const exportMatch = next.match(/^\s*(?:export\s+default\b|module\.exports\s*=)/m);
  if (exportMatch && exportMatch.index !== undefined) {
    const braceStart = next.indexOf('{', exportMatch.index + exportMatch[0].length);
    if (braceStart !== -1) {
      const braceEnd = findMatchingBrace(next, braceStart);
      if (braceEnd !== -1) {
        const trailing = stripJsComments(next.slice(braceEnd + 1));
        if (trailing.replace(/[;\s]/g, '').length > 0) {
          next = next.slice(0, braceEnd + 1).trimEnd();
          warnings.push('Removed trailing junk after tailwind.config export');
        }
      }
    }
  }

  const trimmed = next.trim();
  return trimmed.length > 0 ? `${trimmed}\n` : next;
}

function sanitizePostcssConfigSyntax(code: string, normalizedPath: string, warnings: string[]): string {
  const before = code;
  let next = code.replace(/^\uFEFF/, '');
  const isCommonJs = /\.cjs$/i.test(normalizedPath);
  let rewroteExport = false;

  next = next.replace(/^\s*```[a-zA-Z]*\s*/gm, '').replace(/\s*```\s*$/gm, '');

  const exportStartMatch = next.match(/^\s*(?:export\s+default\b|module\.exports\s*=)/m);
  if (exportStartMatch && exportStartMatch.index !== undefined && exportStartMatch.index > 0) {
    const leading = next.slice(0, exportStartMatch.index);
    if (leading.trim().length > 0) {
      warnings.push('Removed junk before postcss.config export');
    }
    next = next.slice(exportStartMatch.index);
  }

  if (!isCommonJs && /^\s*module\.exports\s*=/m.test(next)) {
    next = next.replace(/^\s*module\.exports\s*=\s*/gm, 'export default ');
    rewroteExport = true;
  } else if (isCommonJs && /^\s*export\s+default\b/m.test(next)) {
    next = next.replace(/^\s*export\s+default\b/gm, 'module.exports =');
    rewroteExport = true;
  }

  if (!isCommonJs && /\bmodule\./.test(next)) {
    next = next.replace(/^\s*module\.[^\n]*\n?/gm, '');
    warnings.push('Removed CommonJS module usage from postcss.config');
  }

  const postcssExportMatches = [...next.matchAll(/^\s*(?:module\.exports\s*=|export\s+default\b)/gm)];
  if (postcssExportMatches.length > 1) {
    const lastMatch = postcssExportMatches[postcssExportMatches.length - 1];
    next = next.slice(lastMatch.index ?? 0).trimStart();
    warnings.push('Removed duplicated postcss.config content (LLM restart detected)');
  }

  if (rewroteExport) {
    warnings.push('Rewrote postcss.config export to match module type');
  }

  const postcssExportMatch = next.match(/^\s*(?:export\s+default\b|module\.exports\s*=)/m);
  if (postcssExportMatch && postcssExportMatch.index !== undefined) {
    const braceStart = next.indexOf('{', postcssExportMatch.index + postcssExportMatch[0].length);
    if (braceStart !== -1) {
      const braceEnd = findMatchingBrace(next, braceStart);
      if (braceEnd !== -1) {
        const trailing = stripJsComments(next.slice(braceEnd + 1));
        if (trailing.replace(/[;\s]/g, '').length > 0) {
          next = next.slice(0, braceEnd + 1).trimEnd();
          warnings.push('Removed trailing junk after postcss.config export');
        }
      }
    }
  }

  const trimmed = next.trim();
  return trimmed.length > 0 ? `${trimmed}\n` : next;
}

function sanitizeIndexHtml(code: string, baseline: string, warnings: string[]): string {
  if (!isLikelyValidIndexHtml(code)) {
    warnings.push('Replaced malformed index.html with baseline');
    return baseline;
  }

  const before = code;
  let next = code;
  next = next.replace(
    /\n?\s*<script\b[^>]*\bsrc=["']https?:\/\/(?:cdn\.tailwindcss\.com|unpkg\.com\/tailwindcss(?:@[^"']+)?|cdnjs\.cloudflare\.com\/ajax\/libs\/tailwindcss\/[^"']+|cdn\.jsdelivr\.net\/npm\/tailwindcss(?:@[^"']+)?)\/[^"']*["'][^>]*>\s*<\/script>\s*/gi,
    '\n',
  );
  next = next.replace(
    /\n?\s*<link\b[^>]*\bhref=["']https?:\/\/(?:cdn\.tailwindcss\.com|unpkg\.com\/tailwindcss(?:@[^"']+)?|cdnjs\.cloudflare\.com\/ajax\/libs\/tailwindcss\/[^"']+|cdn\.jsdelivr\.net\/npm\/tailwindcss(?:@[^"']+)?)\/[^"']*["'][^>]*>\s*/gi,
    '\n',
  );

  if (next !== before) {
    warnings.push('Removed Tailwind CDN tags from index.html');
  }

  return next;
}

function isLikelyValidIndexHtml(code: string): boolean {
  const trimmed = code.trim();
  if (!/^\s*<!doctype\s+html\b/i.test(trimmed)) {
    return false;
  }

  const lower = trimmed.toLowerCase();
  const doctypeIndex = lower.indexOf('<!doctype');
  const htmlIndex = lower.indexOf('<html');
  const bodyIndex = lower.indexOf('<body');

  if (doctypeIndex !== 0 || htmlIndex === -1 || bodyIndex === -1) {
    return false;
  }

  if (htmlIndex < doctypeIndex || bodyIndex < htmlIndex) {
    return false;
  }

  if (lower.indexOf('<!doctype', bodyIndex) !== -1) {
    return false;
  }

  if (lower.indexOf('<html', bodyIndex + 1) !== -1) {
    return false;
  }

  const htmlOpenTags = trimmed.match(/<html\b[^>]*>/gi) ?? [];
  const bodyOpenTags = trimmed.match(/<body\b[^>]*>/gi) ?? [];
  if (htmlOpenTags.length !== 1 || bodyOpenTags.length !== 1) {
    return false;
  }

  const htmlOpen = htmlOpenTags[0];
  const bodyOpen = bodyOpenTags[0];
  const htmlOpenInner = htmlOpen.slice(1);
  const bodyOpenInner = bodyOpen.slice(1);
  if (htmlOpen.length > 512 || bodyOpen.length > 1024) {
    return false;
  }

  if (htmlOpenInner.includes('<') || bodyOpenInner.includes('<')) {
    return false;
  }

  if (!hasBalancedAttributeQuotes(htmlOpen) || !hasBalancedAttributeQuotes(bodyOpen)) {
    return false;
  }

  if (!lower.includes('</head>') || !lower.includes('</body>') || !lower.includes('</html>')) {
    return false;
  }

  return true;
}

function hasBalancedAttributeQuotes(tag: string): boolean {
  const doubleQuotes = (tag.match(/"/g) ?? []).length;
  const singleQuotes = (tag.match(/'/g) ?? []).length;
  return doubleQuotes % 2 === 0 && singleQuotes % 2 === 0;
}

function hasBalancedJsDelimiters(code: string): boolean {
  let braceDepth = 0;
  let bracketDepth = 0;
  let parenDepth = 0;
  let inString: string | null = null;
  let inBlockComment = false;
  let inLineComment = false;
  let escaping = false;

  for (let i = 0; i < code.length; i += 1) {
    const ch = code[i];
    const next = code[i + 1];

    if (inLineComment) {
      if (ch === '\n') {
        inLineComment = false;
      }
      continue;
    }

    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }

    if (inString) {
      if (escaping) {
        escaping = false;
        continue;
      }
      if (ch === '\\') {
        escaping = true;
        continue;
      }
      if (ch === inString) {
        inString = null;
      }
      continue;
    }

    if (ch === '/' && next === '/') {
      inLineComment = true;
      i += 1;
      continue;
    }

    if (ch === '/' && next === '*') {
      inBlockComment = true;
      i += 1;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inString = ch;
      continue;
    }

    if (ch === '{') braceDepth += 1;
    if (ch === '}') braceDepth -= 1;
    if (ch === '[') bracketDepth += 1;
    if (ch === ']') bracketDepth -= 1;
    if (ch === '(') parenDepth += 1;
    if (ch === ')') parenDepth -= 1;

    if (braceDepth < 0 || bracketDepth < 0 || parenDepth < 0) {
      return false;
    }
  }

  return (
    braceDepth === 0 &&
    bracketDepth === 0 &&
    parenDepth === 0 &&
    !inString &&
    !inBlockComment &&
    !inLineComment
  );
}

function stripJsComments(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*\n/g, '\n');
}

function findMatchingBrace(code: string, startIndex: number): number {
  let depth = 0;
  let inString: string | null = null;
  let inBlockComment = false;
  let inLineComment = false;
  let escaping = false;

  for (let i = startIndex; i < code.length; i += 1) {
    const ch = code[i];
    const next = code[i + 1];

    if (inLineComment) {
      if (ch === '\n') {
        inLineComment = false;
      }
      continue;
    }

    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }

    if (inString) {
      if (escaping) {
        escaping = false;
        continue;
      }
      if (ch === '\\') {
        escaping = true;
        continue;
      }
      if (ch === inString) {
        inString = null;
      }
      continue;
    }

    if (ch === '/' && next === '/') {
      inLineComment = true;
      i += 1;
      continue;
    }

    if (ch === '/' && next === '*') {
      inBlockComment = true;
      i += 1;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inString = ch;
      continue;
    }

    if (ch === '{') {
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        return i;
      }
      if (depth < 0) {
        return -1;
      }
    }
  }

  return -1;
}

/**
 * Deduplicate TSX/JSX content when LLM restarts generation mid-stream.
 * This happens when Mistral or other LLMs generate part of a component,
 * then restart and generate from imports again.
 * 
 * Pattern detected:
 * - File has JSX closing tags (</Component>, </div>, etc.)
 * - After that, import statements appear (which should be at the top)
 * - We keep only the content from the last set of imports
 * 
 * Example broken content:
 *   import React from 'react';
 *   ... component code ...
 *   </AuroraBackground>      <- first incomplete version ends
 *   
 *   import { useState } from 'react';  <- LLM restarted here!
 *   ... complete component code ...
 */
function deduplicateTsxContent(code: string, warnings: string[]): string {
  const before = code;

  // Pattern 1: Import statement appears after a JSX closing tag
  // This is a strong indicator that LLM restarted generation
  // Match: </TagName> followed by whitespace and then import statement
  const jsxCloseFollowedByImport = /<\/[A-Za-z][A-Za-z0-9._-]*>\s*\n[\s\n]*import\s+/g;
  const matches = [...code.matchAll(jsxCloseFollowedByImport)];

  if (matches.length > 0) {
    // Find the last such pattern - this is where the final restart happened
    const lastMatch = matches[matches.length - 1];
    const matchEndIndex = lastMatch.index! + lastMatch[0].length;

    // Find where the import statement starts (after the JSX close tag)
    const afterJsxClose = code.substring(lastMatch.index!);
    const importStart = afterJsxClose.search(/import\s+/);

    if (importStart >= 0) {
      const cutPoint = lastMatch.index! + importStart;
      const result = code.substring(cutPoint).trimStart();

      if (result !== before) {
        warnings.push('Removed duplicated TSX content before imports (LLM restart detected)');
        return result;
      }
    }
  }

  // Pattern 2: Multiple "import React" or "import { useState" at different positions
  // This indicates the file was concatenated from multiple generation attempts
  const reactImportPattern = /^import\s+(?:React|\{[^}]*(?:useState|useEffect|useRef)[^}]*\})\s+from\s+['"]react['"]/gm;
  const reactImports = [...code.matchAll(reactImportPattern)];

  if (reactImports.length > 1) {
    // Multiple React imports found - keep from the last one
    const lastImport = reactImports[reactImports.length - 1];
    const result = code.substring(lastImport.index!);

    if (result !== before) {
      warnings.push('Removed duplicated React imports (LLM restart detected)');
      return result;
    }
  }

  // Pattern 3: "export default" or "export function" appearing twice
  const exportPattern = /^export\s+(?:default|function\s+[A-Z])/gm;
  const exports = [...code.matchAll(exportPattern)];

  if (exports.length > 1) {
    // Multiple exports - need to find where the second "file" starts
    // Look for import statements before the last export
    const lastExportIndex = exports[exports.length - 1].index!;
    const beforeLastExport = code.substring(0, lastExportIndex);

    // Find the last import block before this export
    const importLines = beforeLastExport.split('\n');
    let lastImportLineIndex = -1;

    for (let i = importLines.length - 1; i >= 0; i--) {
      if (importLines[i].trim().startsWith('import ')) {
        // Found an import line - now find where this import block starts
        for (let j = i; j >= 0; j--) {
          const line = importLines[j].trim();
          if (line.startsWith('import ') || line === '' || line.startsWith('//')) {
            lastImportLineIndex = j;
          } else {
            break;
          }
        }
        break;
      }
    }

    if (lastImportLineIndex >= 0) {
      // Skip empty lines at the start
      while (lastImportLineIndex > 0 && importLines[lastImportLineIndex - 1].trim() === '') {
        lastImportLineIndex--;
      }

      const cutPoint = importLines.slice(0, lastImportLineIndex).join('\n').length;
      const result = code.substring(cutPoint).trimStart();

      if (result !== before && result.startsWith('import')) {
        warnings.push('Removed duplicated TSX export (LLM restart detected)');
        return result;
      }
    }
  }

  return before;
}

/**
 * Deduplicate file content when LLM restarts generation mid-stream.
 * This happens when Mistral or other LLMs generate an incomplete first version,
 * then restart and generate the complete version. We keep the last complete version.
 * 
 * Pattern detected:
 * - File starts with `import ...` or `define...`
 * - Mid-generation, same pattern appears again (restart)
 * - Keep only the last occurrence of the complete file
 */
function deduplicateViteConfig(code: string, warnings: string[]): string {
  const before = code;

  // Pattern 1: Multiple "import { defineConfig" statements - keep last complete block
  const defineConfigImport = /import\s*\{\s*defineConfig\s*\}/g;
  const matches = [...code.matchAll(defineConfigImport)];

  if (matches.length > 1) {
    // Multiple defineConfig imports detected - LLM restarted generation
    // Find the last occurrence and keep everything from there
    const lastMatch = matches[matches.length - 1];
    const lastIndex = lastMatch.index!;

    // Look backwards to find the start of this complete file version
    // Usually starts with 'import' at start of line
    const beforeLast = code.substring(0, lastIndex);
    const lines = beforeLast.split('\n');

    // Find where the last complete version starts
    // It should start with "import" on its own line
    let cutPoint = lastIndex;
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (line === '' || line.startsWith('//')) {
        continue;
      }
      // Found non-empty line before the duplicate import - cut here
      cutPoint = lines.slice(0, i + 1).join('\n').length + 1; // +1 for newline
      break;
    }

    // Keep only from the last complete version
    const result = code.substring(cutPoint).trimStart();
    if (result !== before) {
      warnings.push('Removed duplicated vite.config content (LLM restart detected)');
      return result;
    }
  }

  // Pattern 2: Multiple "export default defineConfig" - keep last
  const exportDefineConfig = /export\s+default\s+defineConfig\s*\(/g;
  const exportMatches = [...code.matchAll(exportDefineConfig)];

  if (exportMatches.length > 1) {
    // Multiple exports - find last complete version
    const lastExport = exportMatches[exportMatches.length - 1];
    const lastExportIndex = lastExport.index!;

    // Look for the corresponding import before this export
    const sectionBeforeExport = code.substring(0, lastExportIndex);
    const importMatches = [...sectionBeforeExport.matchAll(/import\s+/g)];

    if (importMatches.length > 0) {
      const lastImportBeforeExport = importMatches[importMatches.length - 1];

      // Find start of line with this import
      const beforeImport = code.substring(0, lastImportBeforeExport.index!);
      const lastNewline = beforeImport.lastIndexOf('\n');
      const cutPoint = lastNewline >= 0 ? lastNewline + 1 : 0;

      const result = code.substring(cutPoint);
      if (result !== before) {
        warnings.push('Removed duplicated vite.config export (LLM restart detected)');
        console.log('[CodeSanitizer] Removed duplicated vite.config export');
        return result;
      }
    }
  }

  // Pattern 3: Generic duplicate detection - file contains same import line twice
  const lines = code.split('\n');
  const importLines = lines
    .map((line, idx) => ({ line: line.trim(), idx }))
    .filter(({ line }) => line.startsWith('import ') && line.includes('from'));

  // Check for duplicate import lines
  const seen = new Map<string, number>();
  for (const { line, idx } of importLines) {
    if (seen.has(line)) {
      // Duplicate import found! Keep from the second occurrence
      const prevIdx = seen.get(line)!;
      // Find where the new "file" starts (likely a few lines before this duplicate)
      let startIdx = idx;
      for (let i = idx - 1; i > prevIdx; i--) {
        const l = lines[i].trim();
        if (l === '' || l.startsWith('//')) {
          startIdx = i;
        } else {
          break;
        }
      }

      const result = lines.slice(startIdx).join('\n').trimStart();
      if (result !== before) {
        warnings.push('Removed duplicated imports (LLM restart detected)');
        console.log('[CodeSanitizer] Removed duplicated imports in vite.config');
        return result;
      }
    }
    seen.set(line, idx);
  }

  return before;
}

function sanitizeViteConfigPlugins(code: string, warnings: string[]) {
  const pluginRegex = /plugins\s*:\s*\[[^\]]*\]\s*,?/g;
  const matches = [...code.matchAll(pluginRegex)];

  if (matches.length <= 1) return code;

  const extractPlugins = (block: string) => {
    const innerMatch = block.match(/plugins\s*:\s*\[([\s\S]*?)\]/);
    const inner = innerMatch ? innerMatch[1] : '';
    return inner
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
  };

  const combined = Array.from(new Set(matches.flatMap((match) => extractPlugins(match[0]))));
  if (combined.length === 0) return code;

  const combinedBlock = `plugins: [${combined.join(', ')}]`;
  let first = true;
  const next = code.replace(pluginRegex, () => {
    if (first) {
      first = false;
      return combinedBlock;
    }
    return '';
  });

  warnings.push('Merged duplicate Vite plugins arrays');
  return next;
}

function sanitizeViteConfigSyntax(code: string, warnings: string[]) {
  const before = code;
  let next = code;

  const beforePluginsComma = next;
  next = next.replace(
    /(plugins\s*:\s*\[[\s\S]*?\])(\s*\n\s*[A-Za-z_][A-Za-z0-9_-]*\s*:)/g,
    (_match, pluginsBlock, nextProp) => {
      if (pluginsBlock.trim().endsWith(',')) {
        return `${pluginsBlock}${nextProp}`;
      }

      return `${pluginsBlock},${nextProp}`;
    },
  );
  if (next !== beforePluginsComma) {
    warnings.push('Added missing comma after Vite plugins array');
  }

  const lines = next.split('\n');
  let changed = false;

  for (let i = 0; i < lines.length - 1; i += 1) {
    const line = lines[i];
    if (!/^\s*[A-Za-z_][A-Za-z0-9_-]*\s*:/.test(line)) {
      continue;
    }

    const trimmed = line.trim();
    if (trimmed.endsWith(',') || trimmed.endsWith('{') || trimmed.endsWith('[')) {
      continue;
    }

    let j = i + 1;
    while (j < lines.length) {
      const candidate = lines[j].trim();
      if (candidate === '' || candidate.startsWith('//')) {
        j += 1;
        continue;
      }
      break;
    }

    if (j >= lines.length) {
      continue;
    }

    if (/^\s*[A-Za-z_][A-Za-z0-9_-]*\s*:/.test(lines[j])) {
      lines[i] = `${line},`;
      changed = true;
    }
  }

  if (changed) {
    next = lines.join('\n');
    warnings.push('Inserted missing commas between Vite config properties');
  }

  return next === before ? code : next;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function removeModuleImports(code: string, moduleName: string): string {
  const escaped = escapeRegExp(moduleName);
  const before = code;

  // Remove `import ... from "module"` (supports multi-line import blocks).
  // The tempered pattern prevents accidentally spanning across multiple import statements.
  const fromRe = new RegExp(
    String.raw`^\\s*import(?:(?!^\\s*import)[\\s\\S])*?\\bfrom\\s+['"]${escaped}['"]\\s*;?\\s*$`,
    'gm',
  );

  let next = code.replace(fromRe, '');

  // Remove side-effect imports: `import "module"`.
  const sideEffectRe = new RegExp(String.raw`^\\s*import\\s+['"]${escaped}['"]\\s*;?\\s*$`, 'gm');
  next = next.replace(sideEffectRe, '');

  return next === before ? code : next;
}

const PACKAGE_NAME_RE = /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidPackageName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  if (name.length > 214) return false;
  if (name.startsWith('.') || name.startsWith('_')) return false;
  return PACKAGE_NAME_RE.test(name);
}

function sanitizePackageJson(content: string): { content: string; warnings: string[] } {
  const warnings: string[] = [];

  // Remove bad control characters that LLM sometimes generates
  // eslint-disable-next-line no-control-regex
  let cleanedContent = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  const recoveredJson = extractLastValidJsonBlock(cleanedContent);
  if (recoveredJson && recoveredJson !== cleanedContent) {
    cleanedContent = recoveredJson;
    warnings.push('Recovered valid package.json from concatenated output');
  }

  try {
    const json = JSON.parse(cleanedContent) as any;
    const rawDeps = json.dependencies;
    const rawDevDeps = json.devDependencies;
    const deps = (isPlainObject(rawDeps) ? { ...rawDeps } : {}) as Record<string, unknown>;
    const devDeps = (isPlainObject(rawDevDeps) ? { ...rawDevDeps } : {}) as Record<string, unknown>;

    let changed = cleanedContent !== content;

    if (!isPlainObject(rawDeps)) {
      if (rawDeps !== undefined) {
        warnings.push('Reset dependencies in package.json (expected an object)');
      }
      changed = true;
    }

    if (!isPlainObject(rawDevDeps)) {
      if (rawDevDeps !== undefined) {
        warnings.push('Reset devDependencies in package.json (expected an object)');
      }
      changed = true;
    }

    for (const [dep, version] of Object.entries(deps)) {
      if (!isValidPackageName(dep) || typeof version !== 'string' || /[\r\n]/.test(version)) {
        delete deps[dep];
        changed = true;
        warnings.push(`Removed invalid dependency entry from package.json: ${dep}`);
      }
    }

    for (const [dep, version] of Object.entries(devDeps)) {
      if (!isValidPackageName(dep) || typeof version !== 'string' || /[\r\n]/.test(version)) {
        delete devDeps[dep];
        changed = true;
        warnings.push(`Removed invalid devDependency entry from package.json: ${dep}`);
      }
    }

    for (const [dep, version] of Object.entries(DEFAULT_WEB_DEPS)) {
      const current = deps[dep];
      if (!current) {
        deps[dep] = version;
        changed = true;
        warnings.push(`Added dependency to package.json: ${dep}@${version}`);
        continue;
      }

      const currentSemver = typeof current === 'string' ? extractSemver(current) : null;
      const baselineSemver = extractSemver(version);
      if (!currentSemver || !baselineSemver) continue;

      if (isSemverLess(currentSemver, baselineSemver)) {
        deps[dep] = version;
        changed = true;
        warnings.push(`Upgraded dependency in package.json: ${dep} ${current} -> ${version}`);
      }
    }

    if (changed) {
      json.dependencies = deps;
      json.devDependencies = devDeps;
      return { content: JSON.stringify(json, null, 2) + '\n', warnings };
    }

    return { content: cleanedContent, warnings };
  } catch (_error) {
    const baselinePackageJson = WEB_BASELINE_FILES.find((file) => file.path === 'package.json')?.content;
    if (baselinePackageJson) {
      warnings.push('Replaced invalid package.json with baseline content');
      return { content: baselinePackageJson, warnings };
    }

    warnings.push('Skipped package.json sanitization (invalid JSON after cleanup)');
    return { content: cleanedContent, warnings };
  }
}

function extractLastValidJsonBlock(text: string): string | null {
  const candidates: number[] = [];
  const namePattern = /\{\s*"name"\s*:\s*"/g;
  let match: RegExpExecArray | null;

  while ((match = namePattern.exec(text)) !== null) {
    candidates.push(match.index);
  }

  if (candidates.length === 0) {
    const firstBrace = text.indexOf('{');
    if (firstBrace === -1) return null;
    candidates.push(firstBrace);
  }

  for (let i = candidates.length - 1; i >= 0; i -= 1) {
    const startIndex = candidates[i];
    const block = sliceBalancedJsonObject(text, startIndex);
    if (!block) continue;

    try {
      JSON.parse(block);
      return block;
    } catch {
      continue;
    }
  }

  return null;
}

function sliceBalancedJsonObject(text: string, startIndex: number): string | null {
  let depth = 0;
  let inString = false;
  let escaping = false;

  for (let i = startIndex; i < text.length; i += 1) {
    const ch = text[i];

    if (inString) {
      if (escaping) {
        escaping = false;
        continue;
      }
      if (ch === '\\') {
        escaping = true;
        continue;
      }
      if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === '{') {
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        return text.slice(startIndex, i + 1);
      }
      if (depth < 0) {
        return null;
      }
    }
  }

  return null;
}


type Semver = { major: number; minor: number; patch: number };

function extractSemver(version: string): Semver | null {
  const match = version.match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) };
}

function isSemverLess(left: Semver, right: Semver): boolean {
  if (left.major !== right.major) return left.major < right.major;
  if (left.minor !== right.minor) return left.minor < right.minor;
  return left.patch < right.patch;
}
