export type DesignPreset = {
  id: string;
  title: string;
  source: 'shadcn' | 'aceternity' | 'magicui' | 'cult' | 'nextui' | 'daisy' | 'radix';
  description: string;
  code: string;
};

// Curated UI snippets that can be dropped into projects built on Tailwind + Radix.
// They are inspired by the referenced libraries but adapted to the current stack
// to avoid pulling heavy dependencies.
export const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: 'shadcn-hero',
    title: 'Shadcn Hero with CTA',
    source: 'shadcn',
    description: 'Hero section with balanced typography, CTA pair, and subtle gradient background.',
    code: `<section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(120,119,198,0.45),_transparent_45%)]" />
  <div className="container mx-auto px-6 py-20 relative z-10">
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs backdrop-blur">
      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      New: Cosmic theme presets
    </div>
    <h1 className="mt-6 text-4xl md:text-6xl font-semibold leading-tight tracking-tight">
      Unlock your <span className="text-purple-300">Cosmic</span> potential
    </h1>
    <p className="mt-4 max-w-2xl text-lg text-slate-200/80">
      Build, launch, and scale with a modern component toolkit powered by shadcn/ui patterns.
    </p>
    <div className="mt-8 flex flex-wrap gap-3">
      <button className="rounded-lg bg-purple-500 px-5 py-3 text-white font-medium shadow-lg shadow-purple-500/30 hover:bg-purple-400 transition">
        Get started for free
      </button>
      <button className="rounded-lg border border-white/20 px-5 py-3 text-white/90 hover:bg-white/10 transition">
        View documentation
      </button>
    </div>
  </div>
</section>`,
  },
  {
    id: 'aceternity-spotlight',
    title: 'Aceternity Spotlight Hero',
    source: 'aceternity',
    description: 'Spotlight beams with glassmorphism card and floating nav.',
    code: `<section className="relative min-h-[80vh] overflow-hidden bg-black text-white">
  <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_20%,_rgba(99,102,241,0.25),_transparent)]" />
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute -left-24 top-[-20%] h-[120%] w-[320px] rotate-[-35deg] bg-gradient-to-b from-purple-300/20 via-purple-500/10 to-transparent blur-3xl" />
    <div className="absolute -right-24 top-[-10%] h-[120%] w-[320px] rotate-[35deg] bg-gradient-to-b from-sky-300/20 via-sky-500/10 to-transparent blur-3xl" />
  </div>
  <div className="container mx-auto px-6 py-16 relative z-10">
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-white/70">
        <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">★</div>
        Nebula UI
      </div>
      <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
        <a className="hover:text-white" href="#">Features</a>
        <a className="hover:text-white" href="#">Pricing</a>
        <a className="hover:text-white" href="#">Docs</a>
        <a className="hover:text-white" href="#">About</a>
      </nav>
      <button className="rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/20 border border-white/10">Get Started</button>
    </header>
    <div className="mt-20 max-w-3xl space-y-6">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Version 2.0 live
      </span>
      <h1 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight">
        Fashion hero with <span className="text-purple-300">spotlight</span> and burger menu.
      </h1>
      <p className="text-lg text-white/70">
        Modern layout with gradient overlays, animated buttons, and a responsive burger navigation.
      </p>
      <div className="flex flex-wrap gap-3">
        <button className="rounded-lg bg-purple-500 px-5 py-3 text-white font-medium shadow-lg shadow-purple-500/30 hover:bg-purple-400 transition">
          Explore components
        </button>
        <button className="rounded-lg border border-white/20 px-5 py-3 text-white/90 hover:bg-white/10 transition">
          Watch demo
        </button>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'magicui-hero',
    title: 'MagicUI Glass Hero',
    source: 'magicui',
    description: 'Glassmorphism hero with gradient border and CTA pair.',
    code: `<section className="relative min-h-[70vh] bg-slate-950 text-slate-50 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 via-slate-900 to-slate-950" />
  <div className="container mx-auto px-6 py-16 relative z-10">
    <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-[0_20px_80px_-30px_rgba(124,58,237,0.45)]">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-white/80">
        Magic UI preset · Burger menu ready
      </div>
      <h1 className="mt-6 text-4xl md:text-6xl font-semibold leading-tight">
        Craft stunning UIs in minutes
      </h1>
      <p className="mt-4 text-lg text-white/70">
        Gradient borders, glass panels, and ready-to-use menu + hero combos.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button className="rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-5 py-3 text-white font-medium shadow-lg shadow-purple-500/30 hover:opacity-90 transition">
          Launch Project
        </button>
        <button className="rounded-xl border border-white/15 px-5 py-3 text-white/80 hover:bg-white/5 transition">
          Browse components
        </button>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'cult-navbar',
    title: 'Cult UI Navbar + Hero',
    source: 'cult',
    description: 'Minimal navbar with burger and a lean hero block.',
    code: `<section className="bg-slate-900 text-slate-50">
  <div className="container mx-auto px-6 py-4 flex items-center justify-between">
    <div className="text-lg font-semibold">Cult UI</div>
    <button className="md:hidden inline-flex items-center rounded-md border border-white/10 px-3 py-2 text-sm hover:bg-white/5">
      <span className="i-ph:list text-xl" />
    </button>
    <nav className="hidden md:flex items-center gap-5 text-sm text-white/70">
      <a className="hover:text-white" href="#">Templates</a>
      <a className="hover:text-white" href="#">Components</a>
      <a className="hover:text-white" href="#">Docs</a>
      <a className="hover:text-white" href="#">Pricing</a>
    </nav>
    <button className="hidden md:inline-flex items-center rounded-md bg-white text-slate-900 px-4 py-2 text-sm font-medium">
      Get Access
    </button>
  </div>
  <div className="container mx-auto px-6 py-16">
    <h1 className="text-4xl md:text-5xl font-semibold mb-4">Hero with burger menu</h1>
    <p className="text-lg text-white/70 max-w-2xl">
      Minimal, elegant landing hero using Cult UI styling principles.
    </p>
  </div>
</section>`,
  },
  {
    id: 'nextui-landing',
    title: 'NextUI Inspired Landing',
    source: 'nextui',
    description: 'Clean landing hero with CTA and feature bullets.',
    code: `<section className="bg-white text-slate-900">
  <div className="container mx-auto px-6 py-16">
    <div className="flex flex-col gap-6 max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-semibold">NextUI style hero</h1>
      <p className="text-lg text-slate-600">
        Simple spacing, crisp typography, and flexible layout for fast product pages.
      </p>
      <div className="flex flex-wrap gap-3">
        <button className="rounded-lg bg-slate-900 text-white px-5 py-3 text-sm font-medium">Start now</button>
        <button className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
          View components
        </button>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'daisy-hero',
    title: 'DaisyUI Inspired Hero',
    source: 'daisy',
    description: 'Colorful hero with playful buttons and gradients.',
    code: `<section className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
  <div className="container mx-auto px-6 py-16">
    <div className="max-w-3xl space-y-4">
      <h1 className="text-4xl md:text-5xl font-bold">DaisyUI playful hero</h1>
      <p className="text-lg text-white/90">Bright palette and rounded controls inspired by DaisyUI.</p>
      <div className="flex flex-wrap gap-3">
        <button className="rounded-full bg-white text-purple-600 px-6 py-3 text-sm font-semibold shadow-lg hover:scale-[1.02] transition">
          Play demo
        </button>
        <button className="rounded-full border border-white/70 px-6 py-3 text-sm font-semibold hover:bg-white/10 transition">
          View library
        </button>
      </div>
    </div>
  </div>
</section>`,
  },
];
