import { buildIndex, type ComponentIndex, type ComponentMeta } from './component-index.ts';
import effectsRegistry from '~/lib/constants/effects-registry.json';

export type UserIntent = {
  type?: 'landing' | 'dashboard' | 'ecommerce' | 'portfolio' | 'blog' | 'web3' | string;
  theme?:
    | 'saas'
    | 'construction'
    | 'auto'
    | 'food'
    | 'finance'
    | 'education'
    | 'web3'
    | 'fashion'
    | 'health'
    | 'photo'
    | string;
  sections?: string[];
  effects?: string[];
  style?: string;
  tokens?: number;
  allow3d?: boolean;
};

export type SelectedComponent = ComponentMeta & { score: number };

export type SelectionResult = {
  components: SelectedComponent[];
  effects: SelectedComponent[];
  dependencies: string[];
  total: number;
  totalCodeLines: number;
  debug: {
    theme?: string;
    sections?: string[];
    effects?: string[];
  };
};

// Presets of sections/effects/colors per theme/type
const INDUSTRY_PRESETS: Record<string, { sections: string[]; effects: string[] }> = {
  saas: { sections: ['hero', 'features', 'pricing', 'testimonials', 'cta'], effects: ['sparkles', 'border-beam'] },
  construction: { sections: ['hero', 'features', 'projects', 'stats', 'cta', 'contact'], effects: ['fade', 'slide'] },
  auto: { sections: ['hero', 'features', 'gallery', 'pricing', 'cta'], effects: ['spotlight', 'glow'] },
  ecommerce: { sections: ['hero', 'products', 'features', 'testimonials', 'cta'], effects: ['hover', 'spotlight'] },
  portfolio: { sections: ['hero', 'projects', 'about', 'contact'], effects: ['parallax', 'tilt'] },
  web3: { sections: ['hero', 'cases', 'cta', 'contact'], effects: ['aurora', 'grid', 'sparkles'] },
  finance: { sections: ['hero', 'features', 'stats', 'testimonials', 'cta'], effects: ['fade', 'hover'] },
  education: { sections: ['hero', 'features', 'faq', 'cta'], effects: ['slide', 'fade'] },
  fashion: { sections: ['hero', 'gallery', 'features', 'cta'], effects: ['spotlight', 'glow'] },
  health: { sections: ['hero', 'features', 'stats', 'faq', 'cta'], effects: ['fade', 'slide'] },
  photo: { sections: ['hero', 'gallery', 'projects', 'contact'], effects: ['parallax', 'tilt'] },
  agency: { sections: ['hero', 'services', 'cases', 'team', 'cta'], effects: ['sparkles', 'border-beam'] },
  realestate: { sections: ['hero', 'features', 'gallery', 'stats', 'cta'], effects: ['parallax', 'glow'] },
  travel: { sections: ['hero', 'gallery', 'features', 'cta'], effects: ['parallax', 'slide'] },
  medical: { sections: ['hero', 'features', 'stats', 'testimonials', 'cta', 'contact'], effects: ['fade', 'slide'] },
  legal: { sections: ['hero', 'features', 'cases', 'team', 'cta'], effects: ['fade', 'spotlight'] },
  hospitality: { sections: ['hero', 'gallery', 'features', 'pricing', 'cta'], effects: ['parallax', 'spotlight'] },
  events: { sections: ['hero', 'schedule', 'speakers', 'pricing', 'faq', 'cta'], effects: ['sparkles', 'slide'] },
  nonprofit: { sections: ['hero', 'mission', 'projects', 'stats', 'cta', 'contact'], effects: ['fade', 'slide'] },
  ai: { sections: ['hero', 'features', 'cases', 'cta'], effects: ['sparkles', 'glow'] },
  gaming: { sections: ['hero', 'features', 'gallery', 'cta'], effects: ['glow', 'spotlight'] },
  fitness: { sections: ['hero', 'features', 'pricing', 'cta'], effects: ['slide', 'spotlight'] },
  beauty: { sections: ['hero', 'features', 'gallery', 'cta'], effects: ['glow', 'sparkles'] },
  architecture: { sections: ['hero', 'projects', 'gallery', 'about', 'contact'], effects: ['parallax', 'spotlight'] },
  arts: { sections: ['hero', 'gallery', 'events', 'contact'], effects: ['glow', 'sparkles'] },
  blog: { sections: ['hero', 'blog', 'newsletter', 'about', 'cta'], effects: ['fade', 'slide'] },
  community: { sections: ['hero', 'mission', 'events', 'faq', 'contact'], effects: ['fade', 'slide'] },
  documentation: { sections: ['hero', 'docs', 'faq', 'changelog', 'contact'], effects: ['fade'] },
  environment: { sections: ['hero', 'mission', 'stats', 'projects', 'contact'], effects: ['fade', 'parallax'] },
  government: { sections: ['hero', 'services', 'news', 'contact'], effects: ['fade', 'slide'] },
  hr: { sections: ['hero', 'jobs', 'benefits', 'faq', 'cta'], effects: ['slide', 'fade'] },
  home: { sections: ['hero', 'services', 'gallery', 'testimonials', 'contact'], effects: ['spotlight', 'glow'] },
  launch: { sections: ['hero', 'countdown', 'roadmap', 'newsletter', 'faq', 'cta'], effects: ['glow', 'sparkles'] },
  music: { sections: ['hero', 'gallery', 'events', 'cta'], effects: ['glow', 'spotlight'] },
  personal: { sections: ['hero', 'about', 'blog', 'contact'], effects: ['fade'] },
  professional: { sections: ['hero', 'services', 'cases', 'testimonials', 'cta'], effects: ['spotlight', 'fade'] },
  retail: { sections: ['hero', 'products', 'features', 'testimonials', 'cta'], effects: ['hover', 'spotlight'] },
  technology: { sections: ['hero', 'features', 'cases', 'cta'], effects: ['sparkles', 'border-beam'] },
  transportation: {
    sections: ['hero', 'services', 'pricing', 'testimonials', 'contact'],
    effects: ['slide', 'spotlight'],
  },
  weddings: { sections: ['hero', 'gallery', 'schedule', 'pricing', 'faq', 'contact'], effects: ['glow', 'spotlight'] },
};

// Lightweight keyword map to help ranking
const KEYWORDS: Record<string, string[]> = {
  hero: ['hero', 'header', 'landing', 'splash', 'above fold'],
  features: ['feature', 'features', 'services', 'benefits'],
  pricing: ['pricing', 'price', 'plans'],
  testimonials: ['testimonial', 'testimonials', 'reviews', 'quotes'],
  stats: ['stats', 'statistics', 'numbers', 'metrics'],
  faq: ['faq', 'questions'],
  cta: ['cta', 'call to action'],
  contact: ['contact', 'form'],
  gallery: ['gallery', 'grid', 'cards'],
  products: ['product', 'shop', 'ecommerce'],
  projects: ['project', 'case', 'portfolio'],
  cases: ['case', 'case study', 'results'],
  blog: ['blog', 'article', 'post', 'news'],
  services: ['service', 'services'],
  team: ['team', 'people', 'staff', 'founders'],
  about: ['about', 'who we are'],
  schedule: ['schedule', 'agenda'],
  speakers: ['speaker', 'speakers', 'talk', 'session'],
  mission: ['mission', 'vision'],
  roadmap: ['roadmap', 'timeline', 'milestone'],
  downloads: ['download', 'resources', 'assets'],
  docs: ['docs', 'documentation', 'api', 'reference'],
  news: ['news', 'updates'],
  newsletter: ['newsletter', 'subscribe'],
  jobs: ['jobs', 'careers', 'hiring'],
  benefits: ['benefits', 'perks'],
  changelog: ['changelog', 'releases'],
  countdown: ['countdown', 'launch'],
  effects: ['sparkles', 'aurora', 'border', 'glow', 'parallax', 'hover', 'tilt', 'spotlight', 'beam'],
};

// Priority by source (higher = preferred)
const SOURCE_PRIORITY: Record<string, number> = {
  'shadcnui-blocks.md': 90,
  'magicui-components.md': 85,
  'aceternity-components.md': 80,
  'kokonutui-components.md': 70,
  'reactbits-components.md': 65,
  '21st-dev-components.md': 60,
  '21st-dev-components-part2.md': 50,
  'tailark-components.md': 40,
};

export class SmartComponentSelector {
  private index: ComponentIndex;
  private effectsPool: ComponentMeta[];

  constructor(index?: ComponentIndex) {
    this.index = index || buildIndex(process.cwd(), true);
    // Подготавливаем пул эффектов из облегчённого реестра
    this.effectsPool = (effectsRegistry.effects || []).map((e: any) => ({
      name: e.name || e.id,
      description: e.hint || '',
      category: 'effects',
      rawCategory: e.category || 'effects',
      source: e.source || 'effects-registry',
      code: e.code || '',
      tags: e.tags || [],
    }));
  }

  public refresh() {
    this.index = buildIndex(process.cwd(), false);
    this.effectsPool = (effectsRegistry.effects || []).map((e: any) => ({
      name: e.name || e.id,
      description: e.hint || '',
      category: 'effects',
      rawCategory: e.category || 'effects',
      source: e.source || 'effects-registry',
      code: e.code || '',
      tags: e.tags || [],
    }));
  }

  select(intent: UserIntent): SelectionResult {
    const preset = this.getPreset(intent);
    const needSections = preset.sections;
    const effectsWanted = intent.effects?.length ? intent.effects : preset.effects;

    const components: SelectedComponent[] = [];
    for (const section of needSections) {
      const best = this.pickForSection(section, intent);
      if (best) components.push(best);
    }

    const effects: SelectedComponent[] = [];
    for (const eff of effectsWanted) {
      const best = this.pickForEffect(eff, intent);
      if (best) effects.push(best);
    }

    const deps = this.collectDeps([...components, ...effects]);
    let totalCodeLines = [...components, ...effects].reduce((sum, c) => sum + this.countLines(c.code), 0);

    // Trim if too large (keep highest score)
    const trimmed = this.trimBySize(components, effects, 1200);
    components = trimmed.components as any;
    effects = trimmed.effects as any;
    totalCodeLines = trimmed.totalLines;

    return {
      components,
      effects,
      dependencies: deps,
      total: components.length + effects.length,
      totalCodeLines,
      debug: {
        theme: intent.theme || intent.type,
        sections: needSections,
        effects: effectsWanted,
      },
    };
  }

  private getPreset(intent: UserIntent): { sections: string[]; effects: string[] } {
    const theme = (intent.theme || intent.type || '').toLowerCase();
    return (
      INDUSTRY_PRESETS[theme] || {
        sections: intent.sections || ['hero', 'features', 'cta'],
        effects: intent.effects || [],
      }
    );
  }

  private pickForSection(section: string, intent: UserIntent): SelectedComponent | null {
    const candidates = this.index.components.filter((c) => this.matches(c, section));
    if (!candidates.length) return null;
    return this.rankAndPick(candidates, intent, section);
  }

  private pickForEffect(effect: string, intent: UserIntent): SelectedComponent | null {
    const candidates = this.index.components
      .filter((c) => this.matchesEffect(c, effect))
      .concat(this.effectsPool.filter((c) => this.matchesEffect(c as any, effect)));
    if (!candidates.length) return null;
    return this.rankAndPick(candidates, intent, effect);
  }

  private matches(comp: ComponentMeta, section: string): boolean {
    const low = (comp.rawCategory || comp.category || '').toLowerCase();
    if (low.includes(section)) return true;
    const kw = KEYWORDS[section];
    if (kw) {
      const text = `${comp.name} ${comp.description} ${comp.rawCategory || ''}`.toLowerCase();
      return kw.some((k) => text.includes(k));
    }
    return false;
  }

  private matchesEffect(comp: ComponentMeta, effect: string): boolean {
    const text = `${comp.name} ${comp.description} ${comp.rawCategory || ''}`.toLowerCase();
    const eff = effect.toLowerCase();
    return text.includes(eff) || (KEYWORDS.effects || []).some((k) => eff.includes(k) && text.includes(k));
  }

  private rankAndPick(candidates: ComponentMeta[], intent: UserIntent, section: string): SelectedComponent {
    const requestText = `${intent.type || ''} ${intent.theme || ''} ${section} ${intent.style || ''}`.toLowerCase();
    const ranked = candidates
      .map((c) => {
        let score = 0;
        const text = `${c.name} ${c.description} ${c.rawCategory || ''}`.toLowerCase();
        if (text.includes(section)) score += 5;
        const kw = KEYWORDS[section];
        if (kw) score += kw.filter((k) => text.includes(k)).length * 2;
        score += (SOURCE_PRIORITY[c.source] || 10) / 10;
        if (requestText && text.includes(intent.theme || '')) score += 1;
        // Penalize very large components (>300 lines) and heavy deps hints
        const lines = this.countLines(c.code);
        if (lines > 300) score -= 2;
        if (lines > 600) score -= 4;
        if (!intent.allow3d && (text.includes('three') || text.includes('webgl'))) score -= 3; // avoid heavy 3D unless allowed
        return { ...c, score };
      })
      .sort((a, b) => b.score - a.score);
    return { ...ranked[0] };
  }

  private collectDeps(components: SelectedComponent[]): string[] {
    const deps = new Set<string>();
    // Always add base dependencies for cn() utility
    deps.add('clsx');
    deps.add('tailwind-merge');
    deps.add('framer-motion');
    deps.add('lucide-react');

    components.forEach((c) => {
      const text = `${c.code}`.toLowerCase();
      if (text.includes('class-variance-authority') || text.includes('cva')) deps.add('class-variance-authority');
      if (text.includes('@/components/ui/')) deps.add('shadcn-ui-base'); // placeholder marker
      if (text.includes('three') || text.includes('webgl')) deps.add('three');
      if (text.includes('gsap')) deps.add('gsap');
      if (text.includes('@radix-ui')) deps.add('@radix-ui/react-slot');
    });
    return Array.from(deps);
  }

  private countLines(code?: string): number {
    if (!code) return 0;
    return code.split(/\r?\n/).length;
  }

  private trimBySize(
    components: SelectedComponent[],
    effects: SelectedComponent[],
    maxLines: number,
  ): { components: SelectedComponent[]; effects: SelectedComponent[]; totalLines: number } {
    let pool: SelectedComponent[] = [...components, ...effects];
    let total = pool.reduce((sum, c) => sum + this.countLines(c.code), 0);
    if (total <= maxLines) return { components, effects, totalLines: total };

    // Sort ascending by score (drop worst first)
    pool = pool.sort((a, b) => a.score - b.score);
    while (total > maxLines && pool.length > 0) {
      const dropped = pool.shift();
      if (!dropped) break;
      total -= this.countLines(dropped.code);
      components = components.filter((c) => c.name !== dropped.name || c.source !== dropped.source);
      effects = effects.filter((c) => c.name !== dropped.name || c.source !== dropped.source);
    }
    return { components, effects, totalLines: total };
  }
}
