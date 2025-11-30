import type { PlanningData } from '~/components/chat/PlanningCard';

/**
 * Parses planning blocks from AI responses
 * Supports both XML-style tags and markdown-style planning sections
 */
export function parsePlanningBlock(content: string): { planning: PlanningData | null; cleanContent: string } {
  let planning: PlanningData | null = null;
  let cleanContent = content;

  // Try XML-style planning tags first
  const xmlMatch = content.match(/<boltPlanning>([\s\S]*?)<\/boltPlanning>/);
  if (xmlMatch) {
    planning = parseXMLPlanning(xmlMatch[1]);
    cleanContent = content.replace(/<boltPlanning>[\s\S]*?<\/boltPlanning>/, '').trim();
    return { planning, cleanContent };
  }

  // Try markdown-style planning section (before artifacts/code fences)
  const mdMatch = content.match(/^([\s\S]*?)(?=\n\n(?:<boltArtifact|```|##\s|Let me|I'll start|Now I'll))/);
  if (mdMatch && mdMatch[1]) {
    const potentialPlan = mdMatch[1].trim();
    if (looksLikePlanningSection(potentialPlan)) {
      planning = parseMarkdownPlanning(potentialPlan);
      cleanContent = content.slice(mdMatch[0].length).trim();
      return { planning, cleanContent };
    }
  }

  return { planning: null, cleanContent: content };
}

function parseXMLPlanning(xml: string): PlanningData {
  const getTag = (tag: string): string | undefined => {
    const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
    return match ? match[1].trim() : undefined;
  };

  const getListTag = (tag: string): string[] => {
    const content = getTag(tag);
    if (!content) return [];
    return content
      .split('\n')
      .map((line) => line.replace(/^[-*•]\s*/, '').trim())
      .filter(Boolean);
  };

  const title = getTag('title') || 'Project Plan';
  const inspiration = getListTag('inspiration');
  const features = getListTag('features');
  const techStack = getListTag('techStack');
  const steps = getListTag('steps');

  const designConcept: PlanningData['designConcept'] = {};
  const designSection = getTag('design');
  if (designSection) {
    const colorMatch = designSection.match(/colors?:?\s*([^\n]+)/i);
    const effectsMatch = designSection.match(/effects?:?\s*([^\n]+)/i);
    const typographyMatch = designSection.match(/typography:?\s*([^\n]+)/i);
    const animationsMatch = designSection.match(/animations?:?\s*([^\n]+)/i);

    if (colorMatch) designConcept.colors = colorMatch[1].trim();
    if (effectsMatch) designConcept.effects = effectsMatch[1].trim();
    if (typographyMatch) designConcept.typography = typographyMatch[1].trim();
    if (animationsMatch) designConcept.animations = animationsMatch[1].trim();
  }

  return {
    title,
    inspiration: inspiration.length > 0 ? inspiration : undefined,
    designConcept: Object.keys(designConcept).length > 0 ? designConcept : undefined,
    features: features.length > 0 ? features : undefined,
    techStack: techStack.length > 0 ? techStack : undefined,
    steps: steps.length > 0 ? steps : undefined,
    status: 'planning',
  };
}

function parseMarkdownPlanning(text: string): PlanningData {
  const lines = text.split('\n');
  let title = 'Project Plan';
  const inspiration: string[] = [];
  const features: string[] = [];
  const techStack: string[] = [];
  const steps: string[] = [];
  const designConcept: PlanningData['designConcept'] = {};
  let currentSection = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detect section headers
    if (/^#+\s/.test(trimmed) || /^[A-ZА-ЯЁ][\w\s-]+:/.test(trimmed)) {
      const headerText = trimmed.replace(/^#+\s*/, '').replace(/:$/, '').toLowerCase();

      if (headerText.includes('inspir') || headerText.includes('вдохнов')) {
        currentSection = 'inspiration';
      } else if (
        headerText.includes('design') ||
        headerText.includes('concept') ||
        headerText.includes('дизайн') ||
        headerText.includes('концеп')
      ) {
        currentSection = 'design';
      } else if (headerText.includes('feature') || headerText.includes('функц') || headerText.includes('задач')) {
        currentSection = 'features';
      } else if (headerText.includes('tech') || headerText.includes('stack') || headerText.includes('техн') || headerText.includes('стек')) {
        currentSection = 'techStack';
      } else if (headerText.includes('step') || headerText.includes('шаг') || headerText.includes('план') || headerText.includes('этап')) {
        currentSection = 'steps';
      } else if (!title || title === 'Project Plan') {
        title = trimmed.replace(/^#+\s*/, '').replace(/:$/, '');
        currentSection = '';
      }
      continue;
    }

    // Parse list items
    if (/^[-*•]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
      const item = trimmed.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim();
      switch (currentSection) {
        case 'inspiration':
          inspiration.push(item);
          break;
        case 'features':
          features.push(item);
          break;
        case 'techStack':
          techStack.push(item);
          break;
        case 'steps':
          steps.push(item);
          break;
      }
      continue;
    }

    // Parse design concept inline
    const lower = trimmed.toLowerCase();
    const isDesignLine =
      currentSection === 'design' ||
      lower.includes('design') ||
      lower.includes('concept') ||
      lower.includes('дизайн') ||
      lower.includes('концеп');

    if (isDesignLine) {
      const colorMatch = trimmed.match(/(?:colors?|palette|цвет[аы]?|палитр[аы]):?\s*(.+)/i);
      if (colorMatch) designConcept.colors = colorMatch[1].trim();

      const effectsMatch = trimmed.match(/(?:effects?|эффект[аы]?|градиент|glow|shadow|блик|тени?):?\s*(.+)/i);
      if (effectsMatch) designConcept.effects = effectsMatch[1].trim();

      const typographyMatch = trimmed.match(/(?:typography|fonts?|шрифт[аы]?):?\s*(.+)/i);
      if (typographyMatch) designConcept.typography = typographyMatch[1].trim();

      const animationsMatch = trimmed.match(/(?:animations?|motion|анимац):?\s*(.+)/i);
      if (animationsMatch) designConcept.animations = animationsMatch[1].trim();
    }
  }

  // Extract tech stack from text if not found in sections
  if (techStack.length === 0) {
    const techMatches = text.match(/(?:using|with|built with|на|используя|с)\s+([^.!?\n]+)/gi);
    if (techMatches) {
      for (const match of techMatches) {
        const techs = match
          .replace(/(?:using|with|built with|на|используя|с)\s+/i, '')
          .split(/[,/&]| и | and /i)
          .map((t) => t.trim())
          .filter((t) => t.length > 1 && t.length < 50);
        techStack.push(...techs);
      }
    }
  }

  return {
    title,
    inspiration: inspiration.length > 0 ? inspiration : undefined,
    designConcept: Object.keys(designConcept).length > 0 ? designConcept : undefined,
    features: features.length > 0 ? features : undefined,
    techStack: techStack.length > 0 ? techStack : undefined,
    steps: steps.length > 0 ? steps : undefined,
    status: 'planning',
  };
}

function looksLikePlanningSection(text: string): boolean {
  const planningIndicators = [
    /i'll create|i will create|let me create|let's plan|we should plan/i,
    /inspiration|вдохнов/i,
    /design concept|дизайн|концеп/i,
    /feature|функц|требован/i,
    /tech stack|technology|техн|стек/i,
    /step|шаг|этап|plan/i,
    /color|цвет|palette/i,
    /animation|анимац/i,
  ];

  const matchCount = planningIndicators.filter((pattern) => pattern.test(text)).length;
  return matchCount >= 2;
}

/**
 * Updates planning status based on content
 */
export function updatePlanningStatus(
  planning: PlanningData,
  hasArtifacts: boolean,
  isComplete: boolean,
): PlanningData {
  if (isComplete) {
    return { ...planning, status: 'complete' };
  }
  if (hasArtifacts) {
    return { ...planning, status: 'implementing' };
  }
  return planning;
}
