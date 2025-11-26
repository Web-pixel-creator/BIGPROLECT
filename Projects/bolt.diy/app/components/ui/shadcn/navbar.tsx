import * as React from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { classNames } from '~/utils/classNames';
import { Button } from './button';

export type NavItem = { label: string; href: string };

interface NavbarProps {
  brand?: string;
  items?: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

export function Navbar({ brand = 'Shadcn UI', items = [], ctaLabel = 'Get Started', ctaHref = '#' }: NavbarProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="w-full border-b border-white/10 bg-slate-950/70 backdrop-blur z-30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-white font-semibold">
          <div className="h-8 w-8 rounded-full bg-purple-600/80 flex items-center justify-center text-sm">★</div>
          {brand}
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-white/70">
          {items.map((item) => (
            <a key={item.href} className="hover:text-white transition-colors" href={item.href}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <Button size="sm" variant="default" onClick={() => (window.location.href = ctaHref)}>
            {ctaLabel}
          </Button>
        </div>

        <Collapsible.Root open={open} onOpenChange={setOpen} className="md:hidden">
          <Collapsible.Trigger
            aria-label="Toggle menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white hover:bg-white/5 transition"
          >
            <span className="i-ph:list text-xl" />
          </Collapsible.Trigger>
          <Collapsible.Content forceMount>
            <div
              className={classNames(
                'mt-3 rounded-lg border border-white/10 bg-slate-900/90 backdrop-blur',
                'data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out',
              )}
            >
              <nav className="flex flex-col divide-y divide-white/10 text-sm text-white/80">
                {items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="px-4 py-3 hover:bg-white/5 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="p-3">
                <Button size="sm" variant="secondary" className="w-full" onClick={() => (window.location.href = ctaHref)}>
                  {ctaLabel}
                </Button>
              </div>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    </header>
  );
}
