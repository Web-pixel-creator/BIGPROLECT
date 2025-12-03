import type { PlanningData } from '~/components/chat/PlanningCard';

/**
 * Parses planning blocks from AI responses
 * Supports XML-style tags, markdown-style, and free-form text planning
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

  // Try to find planning text before artifacts
  const beforeArtifact = content.split(/<boltArtifact/)[0];
  if (beforeArtifact && beforeArtifact.trim().length > 50) {
    const potentialPlan = beforeArtifact.trim();
    if (looksLikePlanningSection(potentialPlan)) {
      planning = parseFreeFormPlanning(potentialPlan);
      if (planning && hasEnoughPlanningData(planning)) {
        cleanContent = content.slice(beforeArtifact.length).trim();
        return { planning, cleanContent };
      }
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

/**
 * Parse free-form planning text (like "I'll create a stunning design with parallax effects...")
 */
function parseFreeFormPlanning(text: string): PlanningData {
  const sentences = text.split(/[.!]\s+/).filter(s => s.trim().length > 10);
  
  let title = 'Project Plan';
  const features: string[] = [];
  const designConcept: PlanningData['designConcept'] = {};

  // Extract title from first sentence or "создам/create" pattern
  const titleMatch = text.match(/(?:создам|сделаю|create|build|make)\s+(?:для вас\s+)?(?:потрясающ\w*|красив\w*|stunning|beautiful|amazing)?\s*,?\s*(?:кинематографичн\w*)?\s*([\wа-яё\s-]+?)(?:\.|!|,|\s+для|\s+with|\s+с\s)/i);
  if (titleMatch) {
    title = titleMatch[1].trim();
    if (title.length < 5) title = 'Project Plan';
  }

  // Extract design concepts from text
  // Look for effects
  const effectPatterns = [
    /параллакс[а-яё-]*/gi,
    /parallax/gi,
    /glassmorphism/gi,
    /blur|размыт/gi,
    /gradient|градиент/gi,
    /glow|свечен/gi,
    /shadow|тен[ьи]/gi,
    /hover\s*effect/gi,
    /transition/gi,
    /многослойн\w*/gi,
    /иммерсивн\w*/gi,
    /кинематографичн\w*/gi,
  ];
  
  const foundEffects: string[] = [];
  for (const pattern of effectPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      foundEffects.push(...matches.map(m => m.toLowerCase()));
    }
  }
  if (foundEffects.length > 0) {
    designConcept.effects = [...new Set(foundEffects)].slice(0, 5).join(', ');
  }

  // Look for animations
  const animationPatterns = [
    /плавн\w*\s*анимац\w*/gi,
    /smooth\s*animation/gi,
    /fade[\s-]?in/gi,
    /slide[\s-]?in/gi,
    /появ\w+\s+с\s+анимац\w*/gi,
    /элегантн\w*\s*анимац\w*/gi,
    /scroll\s*animation/gi,
  ];
  
  const foundAnimations: string[] = [];
  for (const pattern of animationPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      foundAnimations.push(...matches.map(m => m.toLowerCase().trim()));
    }
  }
  if (foundAnimations.length > 0) {
    designConcept.animations = [...new Set(foundAnimations)].slice(0, 3).join(', ');
  }

  // Look for colors/theme
  const colorPatterns = [
    /темн\w*\s*(?:тем\w*|дизайн|фон)/gi,
    /dark\s*(?:theme|design|mode)/gi,
    /светл\w*\s*(?:тем\w*|дизайн)/gi,
    /light\s*(?:theme|design)/gi,
    /акцент\w*/gi,
    /accent/gi,
    /премиум/gi,
    /premium/gi,
  ];
  
  const foundColors: string[] = [];
  for (const pattern of colorPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      foundColors.push(...matches.map(m => m.toLowerCase().trim()));
    }
  }
  if (foundColors.length > 0) {
    designConcept.colors = [...new Set(foundColors)].slice(0, 3).join(', ');
  }

  // Extract features from sentences
  const featureIndicators = [
    /hero[\s-]?секц\w*/i,
    /hero\s*section/i,
    /навигац\w*/i,
    /navigation/i,
    /галере\w*/i,
    /gallery/i,
    /портфолио/i,
    /portfolio/i,
    /контакт\w*/i,
    /contact/i,
    /footer/i,
    /header/i,
    /карточ\w*/i,
    /cards?/i,
    /слайдер/i,
    /slider/i,
    /carousel/i,
  ];

  for (const sentence of sentences) {
    for (const pattern of featureIndicators) {
      if (pattern.test(sentence)) {
        const feature = sentence.trim().replace(/^[-•*]\s*/, '');
        if (feature.length > 10 && feature.length < 150 && !features.includes(feature)) {
          features.push(feature);
        }
        break;
      }
    }
  }

  // If no specific features found, use key sentences as features
  if (features.length === 0) {
    for (const sentence of sentences.slice(0, 4)) {
      const trimmed = sentence.trim();
      if (trimmed.length > 20 && trimmed.length < 200) {
        features.push(trimmed);
      }
    }
  }

  return {
    title: title.length > 3 ? title : 'Project Plan',
    designConcept: Object.keys(designConcept).length > 0 ? designConcept : undefined,
    features: features.length > 0 ? features.slice(0, 5) : undefined,
    status: 'planning',
  };
}

function hasEnoughPlanningData(planning: PlanningData): boolean {
  let score = 0;
  if (planning.title && planning.title !== 'Project Plan') score++;
  if (planning.designConcept?.effects) score++;
  if (planning.designConcept?.animations) score++;
  if (planning.designConcept?.colors) score++;
  if (planning.features && planning.features.length > 0) score++;
  return score >= 2;
}

function looksLikePlanningSection(text: string): boolean {
  const planningIndicators = [
    // English
    /i'll create|i will create|let me create|creating|going to create/i,
    /design|concept|style/i,
    /animation|effect|transition/i,
    /feature|section|component/i,
    /beautiful|stunning|amazing|elegant|modern/i,
    // Russian
    /создам|сделаю|буду создавать/i,
    /дизайн|концеп|стиль/i,
    /анимац|эффект|переход/i,
    /секц|компонент|блок/i,
    /красив|потрясающ|элегантн|современн/i,
    /иммерсивн|кинематографичн|премиум/i,
    /параллакс|parallax/i,
    /hero/i,
  ];

  const matchCount = planningIndicators.filter((pattern) => pattern.test(text)).length;
  return matchCount >= 3;
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
