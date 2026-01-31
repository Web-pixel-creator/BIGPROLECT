export const COMPONENT_SECTION_KEYWORDS: Record<string, string[]> = {
  navigation: ['navbar', 'nav', 'menu', 'header'],
  hero: ['hero', 'headline', 'banner', 'spotlight', 'aurora', 'beams', 'particles', 'text'],
  logos: ['logo', 'logos', 'clients', 'partners', 'brands', 'marquee'],
  marquee: ['marquee', 'ticker', 'scrolling', 'running line'],
  'how-it-works': ['steps', 'timeline', 'process', 'workflow'],
  comparison: ['comparison', 'compare', 'versus', 'before', 'after', 'table'],
  integration: ['integration', 'integrations', 'connectors', 'apps'],
  newsletter: ['newsletter', 'subscribe', 'signup', 'email'],
  categories: ['carousel', 'tag', 'pill', 'chip', 'filter', 'tabs'],
  products: ['product', 'card', 'grid', 'bento', 'gallery'],
  features: ['feature', 'bento', 'grid', 'timeline', 'list'],
  footer: ['footer', 'newsletter', 'subscribe'],
};

export const HERO_FULL_WIDTH_VARIANTS = [
  'Full-width hero with cinematic overlay and floating CTA card',
  'Full-width hero with layered glass panel and angled media strip',
  'Full-screen hero with minimal headline and ambient light haze',
  'Full-width hero with split headline + tag rail overlay',
];

export const HERO_SPLIT_VARIANTS = [
  'Split hero: text left (40%), image right (60%) with vertical divider',
  'Split hero: image left (60%), text right (40%) + stacked badges',
  'Split hero with diagonal cut and floating stat card',
];

export const HERO_GRID_VARIANTS = [
  'Grid hero with 2x2 media mosaic and centered headline',
  'Bento hero with large media tile + two supporting cards',
  'Asymmetric grid hero with text tile and image tiles',
];

export const HERO_TYPO_VARIANTS = [
  'Typography hero with oversized serif headline and subtle background texture',
  'Type-led hero with stacked lines and accent underline',
  'Minimal typography hero with offset CTA bar',
];

export const HERO_DEFAULT_VARIANTS = [
  ...HERO_FULL_WIDTH_VARIANTS,
  ...HERO_SPLIT_VARIANTS,
  ...HERO_GRID_VARIANTS,
  ...HERO_TYPO_VARIANTS,
];

export const CATEGORY_VARIANTS = [
  'Horizontal genre tag belt with scroll + gold outline',
  'Rounded pill carousel with snap scrolling and hover glow',
  'Compact tag grid with staggered sizes and overflow fade',
];

export const PRODUCT_VARIANTS = [
  'Crate-style product grid with overlapping covers',
  'Angled album sleeves in a staggered grid with hover actions',
  'Grid with spotlight featured card and secondary cards',
  'Two-row masonry product grid with alternating sizes',
];

export const FOOTER_VARIANTS = [
  'Newsletter band on top, 4 columns center, bottom bar with payments and badge',
  'Newsletter card inset + 4 columns + bottom bar with inline icons',
  'Newsletter split row with graphic + 4 columns + bottom bar divider',
];

export const NAV_VARIANTS = [
  'Split nav: logo left, links center, utility icons right',
  'Centered nav with logo above links + icon rail',
  'Compact top bar with search expand + icons cluster',
];

export const FEATURE_VARIANTS = [
  'Bento feature grid with 4 tiles and micro-icons',
  'Zigzag feature rows with alternating text/media',
  'Card row with icon highlights and hover lift',
  'Timeline-style feature steps with connecting line',
];
