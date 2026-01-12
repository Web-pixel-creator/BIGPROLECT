/**
 * Prompt Section Utilities
 * Functions for parsing and extracting section information from prompts
 */

import { matchesKeyword } from './prompt-color-utils';

export type SectionSpecs = {
  order: string[];
  details: Record<string, string[]>;
};

/**
 * Extract requirement lines from prompt (bullet points, numbered lists)
 */
export function extractRequirementLines(prompt: string): string[] {
  const lines = prompt
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const requirements: string[] = [];

  for (const line of lines) {
    if (/^[-*]\s+/.test(line)) {
      requirements.push(line.replace(/^[-*]\s+/, ''));
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      requirements.push(line.replace(/^\d+\.\s+/, ''));
      continue;
    }
    if (line.endsWith(':')) {
      requirements.push(line.replace(/:$/, '').trim());
    }
  }

  return Array.from(new Set(requirements));
}

/**
 * Extract section order from prompt based on keywords
 */
export function extractSectionOrder(prompt: string, sectionKeywords: Record<string, string[]>): string[] {
  const lines = prompt
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const order: string[] = [];
  const pushUnique = (section: string) => {
    if (!order.includes(section)) {
      order.push(section);
    }
  };

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    for (const [section, keywords] of Object.entries(sectionKeywords)) {
      if (keywords.some((keyword) => matchesKeyword(lowerLine, keyword))) {
        pushUnique(section);
      }
    }
  }

  return order;
}

/**
 * Infer section key from text
 */
export function inferSectionKey(text: string, sectionKeywords: Record<string, string[]>): string | null {
  const lower = text.toLowerCase();
  console.log('[inferSectionKey] Checking text:', {
    original: text,
    lower,
    keywordSectionsCount: Object.keys(sectionKeywords).length,
  });

  for (const [section, keywords] of Object.entries(sectionKeywords)) {
    if (keywords.some((keyword) => matchesKeyword(lower, keyword))) {
      console.log('[inferSectionKey] MATCHED:', { text, section, lower });
      return section;
    }
  }
  console.log('[inferSectionKey] NO MATCH:', { text, lower });
  return null;
}

/**
 * Find ALL sections matching in a text, not just the first one
 */
export function inferAllSections(text: string, sectionKeywords: Record<string, string[]>): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];

  for (const [section, keywords] of Object.entries(sectionKeywords)) {
    if (keywords.some((keyword) => matchesKeyword(lower, keyword))) {
      console.log('[inferAllSections] MATCHED:', { section, text: text.substring(0, 50) });
      found.push(section);
    }
  }

  console.log('[inferAllSections] Found sections:', found);
  return found;
}


/**
 * Extract section specs from prompt (order and details)
 */
export function extractSectionSpecs(prompt: string, sectionKeywords: Record<string, string[]>): SectionSpecs {
  console.log('[extractSectionSpecs] Parsing prompt:', prompt.substring(0, 200));

  const lines = prompt
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  console.log('[extractSectionSpecs] Found lines:', lines.length, lines);

  const order: string[] = [];
  const details: Record<string, string[]> = {};
  let currentSection: string | null = null;
  let footerLocked = false;
  const explicitSectionCue = /\b(section|block|area|раздел|секция|блок)\b/i;

  const pushSection = (section: string) => {
    console.log('[extractSectionSpecs] Pushing section:', section);
    if (!order.includes(section)) {
      order.push(section);
    }
    if (!details[section]) {
      details[section] = [];
    }
  };

  const parseHeading = (rawText: string) => {
    const trimmed = rawText.replace(/:$/, '').trim();
    const parts = trimmed.split(/:\s+/);
    const headingText = parts[0]?.trim() ?? trimmed;
    const detailText = parts.length > 1 ? parts.slice(1).join(': ').trim() : '';
    const key = inferSectionKey(headingText, sectionKeywords);
    console.log('[extractSectionSpecs] parseHeading:', { rawText, headingText, key });
    return key ? { key, detail: detailText } : null;
  };

  for (const line of lines) {
    const bulletMatch = line.match(/^[-*]\s+(.*)$/) || line.match(/^\d+\.\s+(.*)$/);
    const rawLine = bulletMatch ? bulletMatch[1].trim() : line;
    const hasColon = rawLine.includes(':');
    const headingCandidate = (!bulletMatch && (rawLine.endsWith(':') || hasColon)) || (bulletMatch && hasColon);

    console.log('[extractSectionSpecs] LINE:', {
      line: line.substring(0, 60),
      bulletMatch: !!bulletMatch,
      rawLine: rawLine.substring(0, 60),
      hasColon,
      headingCandidate,
    });

    if (headingCandidate) {
      const parsed = parseHeading(rawLine);
      console.log('[extractSectionSpecs] parseHeading result:', parsed);

      if (parsed) {
        if (footerLocked && parsed.key !== 'footer' && !explicitSectionCue.test(rawLine)) {
          pushSection('footer');
          if (parsed.detail) {
            details.footer.push(parsed.detail);
          } else {
            details.footer.push(rawLine);
          }
          continue;
        }

        if (footerLocked && parsed.key !== 'footer' && explicitSectionCue.test(rawLine)) {
          footerLocked = false;
        }

        currentSection = parsed.key;
        pushSection(parsed.key);

        if (parsed.key === 'footer') {
          footerLocked = true;
        }

        if (parsed.detail) {
          details[parsed.key].push(parsed.detail);
        }
        continue;
      }
    }

    if (footerLocked) {
      pushSection('footer');
      details.footer.push(rawLine);
      continue;
    }

    // If not a heading, try to infer ALL sections from the whole line
    console.log('[extractSectionSpecs] Trying inferAllSections for:', rawLine.substring(0, 60));
    const inferredSections = inferAllSections(rawLine, sectionKeywords);
    console.log('[extractSectionSpecs] inferAllSections result:', inferredSections);

    if (inferredSections.length > 0) {
      for (const inferredSection of inferredSections) {
        pushSection(inferredSection);
      }
      currentSection = inferredSections[inferredSections.length - 1];

      if (bulletMatch) {
        details[inferredSections[0]].push(rawLine);
      } else if (rawLine !== rawLine.replace(/:$/, '').trim()) {
        const detailText = rawLine.replace(/^[^:]+:\s*/, '').trim();
        if (detailText) {
          details[inferredSections[0]].push(detailText);
        }
      }
      continue;
    }

    if (bulletMatch && currentSection) {
      details[currentSection].push(rawLine);
    }
  }

  return { order, details };
}

/**
 * Build section details block for enhanced prompt
 */
export function buildSectionDetailsBlock(details: Record<string, string[]>, sectionLabels: Record<string, string>): string {
  const entries = Object.entries(details).filter(([, items]) => items.length > 0);
  if (entries.length === 0) return '';

  const lines: string[] = ['SECTION DETAILS:'];
  for (const [section, items] of entries) {
    const label = sectionLabels[section] ?? section.toUpperCase();
    lines.push(`  ${label}:`);
    for (const item of items) {
      lines.push(`    - ${item}`);
    }
  }

  return lines.join('\n');
}


/**
 * Build section guardrails for enhanced prompt
 */
export function buildSectionGuardrails(order: string[], details: Record<string, string[]>): string {
  if (order.length === 0) {
    return '';
  }

  const lines: string[] = [];

  if (order.includes('navigation')) {
    lines.push('- Navigation: Menu links use text-sm or text-base (14-16px). Avoid oversized headline typography.');
  }

  if (order.includes('hero')) {
    lines.push('- Hero: Include a real <img> from the IMAGES block (no gradient-only hero).');
  }

  if (order.includes('products')) {
    lines.push('- Products: Render at least 4 product cards using distinct images.');
    lines.push(
      '- Products: Each card must include a real <img> using URLs from the IMAGES block (no icons/placeholders).',
    );

    const items = Array.from(new Set(details.products ?? [])).filter(Boolean);
    if (items.length > 0) {
      lines.push(`- Products: Each product card must include ALL of: ${items.join('; ')}`);
    } else {
      lines.push('- Products: Each card includes image, title, secondary text, price, and a clear CTA button.');
    }
  }

  if (order.includes('footer')) {
    const footerDetails = details.footer ?? [];
    const footerText = footerDetails.join(' ').toLowerCase();
    const wantsNewsletter = /newsletter|subscribe|collector|email|join the/.test(footerText);
    const wantsColumns = /columns?|shop|about|support|connect/.test(footerText);
    const wantsBottomBar = /bottom bar|copyright|payment|visa|mastercard|paypal|badge/.test(footerText);
    const wantsUnderline = /underline|hover gold|gold underline/.test(footerText);
    const wantsSocial = /social|instagram|youtube|discord|icons?/.test(footerText);

    if (wantsNewsletter) {
      lines.push(
        '- Footer: Include a top newsletter row with headline, email input, submit button, and vinyl graphic.',
      );
    }
    if (wantsColumns) {
      lines.push('- Footer: Include a middle 4-column links grid (Shop/About/Support/Connect).');
    }
    if (wantsBottomBar) {
      lines.push(
        '- Footer: Include a bottom bar with copyright, payment method badges (text or lucide icons), and a badge.',
      );
    }
    if (wantsUnderline) {
      lines.push('- Footer: Links show gold underline on hover.');
    }
    if (wantsSocial) {
      lines.push('- Footer: Social icons are cream, turn gold on hover with subtle rotation.');
    }
  }

  return lines.length > 0 ? `\nSECTION GUARDRAILS (must follow):\n${lines.join('\n')}` : '';
}

/**
 * Build section blueprint for enhanced prompt
 */
export function buildSectionBlueprint(
  order: string[],
  details: Record<string, string[]>,
  sectionLabels: Record<string, string>,
): string {
  if (order.length === 0) {
    return '';
  }

  const lines = order.map((section, index) => {
    const label = sectionLabels[section] ?? section;
    const uniqueItems = Array.from(new Set(details[section] ?? [])).slice(0, 3);
    const detailText = uniqueItems.length > 0 ? ` - ${uniqueItems.join('; ')}` : '';
    return `${index + 1}. ${label}${detailText}`;
  });

  return `\nSECTION BLUEPRINT (follow exactly):\n${lines.join('\n')}`;
}
