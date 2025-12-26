import { path as nodePath } from './path';

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

  const ext = nodePath.extname(relativePath).toLowerCase();

  if (relativePath.endsWith('package.json')) {
    const result = sanitizePackageJson(content);
    return { content: result.content, changed: result.content !== content, warnings: result.warnings };
  }

  if (!CODE_EXTENSIONS.has(ext)) {
    return { content, changed: false, warnings: [] };
  }

  const warnings: string[] = [];
  let next = content;

  if (/^vite\.config\./i.test(relativePath)) {
    next = sanitizeViteConfigPlugins(next, warnings);
  }

  if (ext === '.tsx' || ext === '.jsx') {
    next = sanitizeJsxSyntaxErrors(next, warnings);
    next = sanitizeJsxComments(next, warnings);
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

  return { content: next, changed: next !== content, warnings };
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

  // DEBUG: Log when sanitizer runs
  console.log('[CodeSanitizer] Running JSX syntax fixer...');

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
    console.log(`[CodeSanitizer] Fixed broken PascalCase: <${prefix}>${suffix} -> <${prefix}${suffix}`);
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

  if (next !== before) {
    warnings.push('Fixed truncated or malformed CSS properties (AI generation error)');
  }

  return next;
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

function sanitizePackageJson(content: string): { content: string; warnings: string[] } {
  const warnings: string[] = [];

  try {
    const json = JSON.parse(content) as any;
    const deps = (json.dependencies ?? {}) as Record<string, string>;

    let changed = false;

    for (const [dep, version] of Object.entries(DEFAULT_WEB_DEPS)) {
      const current = deps[dep];
      if (!current) {
        deps[dep] = version;
        changed = true;
        warnings.push(`Added dependency to package.json: ${dep}@${version}`);
        continue;
      }

      const currentSemver = extractSemver(current);
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
      return { content: JSON.stringify(json, null, 2) + '\n', warnings };
    }

    return { content, warnings };
  } catch (_error) {
    // If it's not valid JSON yet, don't touch it.
    warnings.push('Skipped package.json sanitization (invalid JSON)');
    return { content, warnings };
  }
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
