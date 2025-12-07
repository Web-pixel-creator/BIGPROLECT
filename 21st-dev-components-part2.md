# 21st.dev UI Components - Part 2 (Community)

This is the second part of the component library, containing community-contributed components from 21st.dev.

**Part 1:** `21st-dev-components.md` (~298 components from MagicUI, motion-primitives, Aceternity UI)
**Part 2:** This file (Community components)

---

## 🎯 Error Pages & Empty States

### glitchy-404 (isaiahbjork)
**Source:** https://21st.dev/r/isaiahbjork/glitchy-404-1

Glitchy animated 404 page with SVG distortion effect.

```tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const shakeVariants1 = {
  shake: {
    x: [0, -2, 2, -1, 1, 0],
    transition: { duration: 0.8, repeat: Infinity, repeatType: "loop" as const, ease: "easeInOut" },
  },
};

const FuzzyWrapper = ({ children, baseIntensity = 0.3, className }: { children: React.ReactNode; baseIntensity?: number; className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement & { cleanupFuzzy?: () => void }>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let isCancelled = false;
    const canvas = canvasRef.current;
    const svgContainer = svgContainerRef.current;
    if (!canvas || !svgContainer) return;
    // ... fuzzy effect implementation
    return () => { isCancelled = true; window.cancelAnimationFrame(animationFrameId); };
  }, [baseIntensity]);

  return (
    <div className="relative">
      <div ref={svgContainerRef} className="absolute inset-0 opacity-0 pointer-events-none" style={{ zIndex: -1 }}>{children}</div>
      <canvas ref={canvasRef} className={className} style={{ display: "block" }} />
    </div>
  );
};

interface Glitchy404Props { width?: number; height?: number; color?: string }

export function Glitchy404({ width = 860, height = 232, color = "#fff" }: Glitchy404Props) {
  return (
    <FuzzyWrapper baseIntensity={0.4} className="cursor-pointer">
      <svg width={width} height={height} viewBox="0 0 100 29" fill="white" xmlns="http://www.w3.org/2000/svg">
        {/* SVG paths with motion animations for glitchy 404 effect */}
      </svg>
    </FuzzyWrapper>
  );
}
```

**Dependencies:** `framer-motion`

---

### empty-state (j1zuz)
**Source:** https://21st.dev/r/j1zuz/empty

Modular empty state component with variants.

```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="empty" className={cn("flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-xl border-dashed p-6 text-center text-balance md:p-12", className)} {...props} />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-header" className={cn("flex max-w-sm flex-col items-center text-center", className)} {...props} />
}

const emptyMediaVariants = cva("flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0", {
  variants: {
    variant: {
      default: "bg-transparent",
      icon: "relative flex size-9 shrink-0 items-center justify-center rounded-md border bg-card text-foreground shadow-sm",
    },
  },
  defaultVariants: { variant: "default" },
})

function EmptyMedia({ className, variant = "default", ...props }: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return <div data-slot="empty-media" data-variant={variant} className={cn("relative mb-6", className)} {...props} />
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="empty-title" className={cn("font-heading text-xl leading-none", className)} {...props} />
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <div data-slot="empty-description" className={cn("text-sm/relaxed text-muted-foreground", className)} {...props} />
}

export { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia }
```

**Dependencies:** `class-variance-authority`, `@/lib/utils`

---

## 🔗 Links & Navigation

### flip-links (vaib215)
**Source:** https://21st.dev/r/vaib215/flip-links

Giant flip animation links on hover.

```tsx
import React from "react";

const FlipLink = ({ children, href }: { children: string; href: string }) => {
  return (
    <a href={href} className="group text-primary relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase sm:text-7xl md:text-8xl lg:text-9xl" style={{ lineHeight: 0.75 }}>
      <div className="flex">
        {children.split("").map((letter, i) => (
          <span key={i} className="inline-block transition-transform duration-300 ease-in-out group-hover:-translate-y-[110%]" style={{ transitionDelay: `${i * 25}ms` }}>
            {letter}
          </span>
        ))}
      </div>
      <div className="absolute inset-0 flex">
        {children.split("").map((letter, i) => (
          <span key={i} className="inline-block translate-y-[110%] transition-transform duration-300 ease-in-out group-hover:translate-y-0" style={{ transitionDelay: `${i * 25}ms` }}>
            {letter}
          </span>
        ))}
      </div>
    </a>
  );
};

export const Component = () => {
  return (
    <section className="grid place-content-center gap-2 bg-background w-full h-screen text-black">
      <FlipLink href="https://x.com/thisis_vaib">Twitter</FlipLink>
      <FlipLink href="https://linkedin.com/in/vaib215">Linkedin</FlipLink>
    </section>
  );
};
```

**Dependencies:** None (pure CSS animations)

---

## 🎛️ Buttons

### button (reui)
**Source:** https://21st.dev/r/reui/button

Advanced button component with many variants.

```tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown, LucideIcon } from 'lucide-react';

const buttonVariants = cva(
  'cursor-pointer group whitespace-nowrap focus-visible:outline-hidden inline-flex items-center justify-center text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        mono: 'bg-zinc-950 text-white dark:bg-zinc-300 dark:text-black hover:bg-zinc-950/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        outline: 'bg-background text-accent-foreground border border-input hover:bg-accent',
        ghost: 'text-accent-foreground hover:bg-accent hover:text-accent-foreground',
        dim: 'text-muted-foreground hover:text-foreground',
      },
      size: {
        lg: 'h-10 rounded-md px-4 text-sm gap-1.5',
        md: 'h-8.5 rounded-md px-3 gap-1.5 text-[0.8125rem]',
        sm: 'h-7 rounded-md px-2.5 gap-1.25 text-xs',
      },
      mode: {
        default: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        icon: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        link: 'text-primary h-auto p-0 bg-transparent rounded-none hover:bg-transparent',
      },
    },
    defaultVariants: { variant: 'primary', mode: 'default', size: 'md' },
  },
);

function Button({ className, variant, mode, size, asChild = false, ...props }: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button';
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, mode, className }))} {...props} />;
}

export { Button, buttonVariants };
```

**Dependencies:** `@radix-ui/react-slot`, `class-variance-authority`, `lucide-react`

---

## 💬 Popovers

### morphing-popover (motion-primitives)
**Source:** https://21st.dev/r/motion-primitives/morphing-popover

Popover with morphing animation between trigger and content.

```tsx
'use client';

import { useState, useId, useRef, useEffect, createContext, useContext } from 'react';
import { AnimatePresence, MotionConfig, motion, Transition } from 'motion/react';
import { useClickOutside } from '@/hooks/use-click-outside';
import { cn } from '@/lib/utils';

const TRANSITION = { type: 'spring', bounce: 0.1, duration: 0.4 };

type MorphingPopoverContextValue = { isOpen: boolean; open: () => void; close: () => void; uniqueId: string };
const MorphingPopoverContext = createContext<MorphingPopoverContextValue | null>(null);

function MorphingPopover({ children, transition = TRANSITION, className, ...props }: { children: React.ReactNode; transition?: Transition; className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();
  return (
    <MorphingPopoverContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false), uniqueId }}>
      <MotionConfig transition={transition}>
        <div className={cn('relative flex items-center justify-center', className)} key={uniqueId} {...props}>{children}</div>
      </MotionConfig>
    </MorphingPopoverContext.Provider>
  );
}

function MorphingPopoverTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  const context = useContext(MorphingPopoverContext);
  if (!context) throw new Error('MorphingPopoverTrigger must be used within MorphingPopover');
  return (
    <motion.div key={context.uniqueId} layoutId={`popover-trigger-${context.uniqueId}`} onClick={context.open}>
      <motion.button layoutId={`popover-label-${context.uniqueId}`} className={className}>{children}</motion.button>
    </motion.div>
  );
}

function MorphingPopoverContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const context = useContext(MorphingPopoverContext);
  if (!context) throw new Error('MorphingPopoverContent must be used within MorphingPopover');
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, context.close);
  return (
    <AnimatePresence>
      {context.isOpen && (
        <motion.div ref={ref} layoutId={`popover-trigger-${context.uniqueId}`} role='dialog'
          className={cn('absolute overflow-hidden rounded-md border bg-white p-2 shadow-md dark:bg-zinc-700', className)}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { MorphingPopover, MorphingPopoverTrigger, MorphingPopoverContent };
```

**Dependencies:** `motion`, `@/hooks/use-click-outside`, `@/lib/utils`

---

### base-ui-popover (base-ui)
**Source:** https://21st.dev/r/base-ui/popover-1

Simple popover using Base UI components.

```tsx
import * as React from 'react';
import { Popover } from '@base-ui-components/react/popover';

export default function ExamplePopover() {
  return (
    <Popover.Root>
      <Popover.Trigger className="flex size-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100">
        <BellIcon aria-label="Notifications" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup className="rounded-lg bg-[canvas] px-6 py-4 shadow-lg">
            <Popover.Arrow />
            <Popover.Title className="text-base font-medium">Notifications</Popover.Title>
            <Popover.Description className="text-base text-gray-600">You are all caught up!</Popover.Description>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
```

**Dependencies:** `@base-ui-components/react`

---

## 📱 Menus

### fluid-menu (deepaksslibra)
**Source:** https://21st.dev/r/deepaksslibra/fluid-menu

Expandable fluid menu with smooth animations.

```tsx
"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"

interface MenuProps { trigger: React.ReactNode; children: React.ReactNode; align?: "left" | "right"; showChevron?: boolean }

export function Menu({ trigger, children, align = "left", showChevron = true }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="relative inline-block text-left">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer inline-flex items-center" role="button">
        {trigger}
        {showChevron && <ChevronDown className="ml-2 -mr-1 h-4 w-4 text-gray-500" />}
      </div>
      {isOpen && (
        <div className={`absolute ${align === "right" ? "right-0" : "left-0"} mt-2 w-56 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black dark:ring-gray-700 z-50`}>
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  )
}

export function MenuItem({ children, onClick, disabled = false, icon, isActive = false }: { children?: React.ReactNode; onClick?: () => void; disabled?: boolean; icon?: React.ReactNode; isActive?: boolean }) {
  return (
    <button className={`relative block w-full h-16 text-center group ${disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-600 dark:text-gray-300"}`} onClick={onClick} disabled={disabled}>
      <span className="flex items-center justify-center h-full">{icon && <span className="h-6 w-6">{icon}</span>}{children}</span>
    </button>
  )
}
```

**Dependencies:** `lucide-react`

---

### floating-action-menu (chetanverma16)
**Source:** https://21st.dev/r/chetanverma16/floating-action-menu

Floating action button with expandable menu.

```tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type FloatingActionMenuProps = { options: { label: string; onClick: () => void; Icon?: React.ReactNode }[]; className?: string };

const FloatingActionMenu = ({ options, className }: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("fixed bottom-8 right-8", className)}>
      <Button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 rounded-full bg-[#11111198] hover:bg-[#111111d1] shadow-lg">
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }}>
          <Plus className="w-6 h-6" />
        </motion.div>
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, x: 10, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: 10, y: 10 }}
            className="absolute bottom-10 right-0 mb-2">
            <div className="flex flex-col items-end gap-2">
              {options.map((option, index) => (
                <motion.div key={index} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                  <Button onClick={option.onClick} size="sm" className="flex items-center gap-2 rounded-xl backdrop-blur-sm">
                    {option.Icon}<span>{option.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionMenu;
```

**Dependencies:** `framer-motion`, `lucide-react`, `@radix-ui/react-slot`, `class-variance-authority`

---

### animated-menu (serafim)
**Source:** https://21st.dev/r/serafim/animated-menu

Menu with Rive animated icons.

```tsx
"use client"

import * as React from "react"
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas'
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MenuItem { riveIcon: { src: string; stateMachine: string }; label: string; hotkey: string; onClick?: () => void }

export function AnimatedMenu({ items, className }: { items: MenuItem[]; className?: string }) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  return (
    <div className={cn("relative w-[210px] bg-[#2A2A27] shadow-lg rounded-lg p-0.5", className)}>
      <menu className="relative">
        {items.map((item, index) => (
          <li key={index}>
            <button className={cn("h-[34px] rounded-md flex gap-2 w-full items-center px-2.5 py-1.5 text-sm font-medium text-[#DFDFDC] relative z-10")}
              onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} onClick={item.onClick}>
              <span>{item.label}</span>
              <span className="ml-auto text-[#5E5E55]">{item.hotkey}</span>
            </button>
          </li>
        ))}
        <motion.div className="absolute inset-x-0 h-[34px] bg-[#353531] rounded-md"
          animate={{ opacity: hoveredIndex !== null ? 1 : 0, top: hoveredIndex !== null ? hoveredIndex * 34 : 0 }} />
      </menu>
    </div>
  )
}
```

**Dependencies:** `framer-motion`, `@rive-app/react-canvas`, `@/lib/utils`

---

### dock (motion-primitives)
**Source:** https://21st.dev/r/motion-primitives/dock

macOS-style dock with magnification effect.

```tsx
'use client';

import { motion, MotionValue, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Children, cloneElement, createContext, useContext, useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const DOCK_HEIGHT = 128;
const DEFAULT_MAGNIFICATION = 80;

type DockContextType = { mouseX: MotionValue; spring: object; magnification: number; distance: number };
const DockContext = createContext<DockContextType | undefined>(undefined);

function Dock({ children, className, magnification = DEFAULT_MAGNIFICATION, distance = 150, panelHeight = 64 }: { children: React.ReactNode; className?: string; magnification?: number; distance?: number; panelHeight?: number }) {
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div className='mx-2 flex max-w-full items-end overflow-x-auto'>
      <motion.div onMouseMove={({ pageX }) => mouseX.set(pageX)} onMouseLeave={() => mouseX.set(Infinity)}
        className={cn("mx-auto flex w-fit gap-4 rounded-2xl bg-gray-50 px-4 dark:bg-neutral-900", className)} style={{ height: panelHeight }}>
        <DockContext.Provider value={{ mouseX, spring: { mass: 0.1, stiffness: 150, damping: 12 }, distance, magnification }}>
          {children}
        </DockContext.Provider>
      </motion.div>
    </motion.div>
  );
}

function DockItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { distance, magnification, mouseX, spring } = useContext(DockContext)!;
  const mouseDistance = useTransform(mouseX, (val) => val - (ref.current?.getBoundingClientRect().x ?? 0) - (ref.current?.getBoundingClientRect().width ?? 0) / 2);
  const widthTransform = useTransform(mouseDistance, [-distance, 0, distance], [40, magnification, 40]);
  const width = useSpring(widthTransform, spring);
  return (
    <motion.div ref={ref} style={{ width }} className={cn('relative inline-flex items-center justify-center', className)}>
      {Children.map(children, (child) => cloneElement(child as React.ReactElement, { width }))}
    </motion.div>
  );
}

function DockIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  return <motion.div className={cn('flex items-center justify-center', className)}>{children}</motion.div>;
}

export { Dock, DockIcon, DockItem };
```

**Dependencies:** `framer-motion`, `@/lib/utils`

---

### glow-menu (spoonyvu)
**Source:** https://21st.dev/r/spoonyvu/glow-menu

Menu bar with glow effects on hover.

```tsx
"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface MenuItem { icon: LucideIcon; label: string; href: string; gradient: string; iconColor: string }

const glowVariants = { initial: { opacity: 0, scale: 0.8 }, hover: { opacity: 1, scale: 2 } };

export const MenuBar = React.forwardRef<HTMLDivElement, { items: MenuItem[]; activeItem?: string; onItemClick?: (label: string) => void }>(
  ({ className, items, activeItem, onItemClick }, ref) => {
    const { theme } = useTheme()
    return (
      <motion.nav ref={ref} className={cn("p-2 rounded-2xl bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-lg border", className)} initial="initial" whileHover="hover">
        <ul className="flex items-center gap-2 relative z-10">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <motion.li key={item.label}>
                <button onClick={() => onItemClick?.(item.label)} className="block w-full">
                  <motion.div className="block rounded-xl overflow-visible group relative" style={{ perspective: "600px" }} whileHover="hover">
                    <motion.div className="absolute inset-0 z-0 pointer-events-none" variants={glowVariants} style={{ background: item.gradient, borderRadius: "16px" }} />
                    <motion.div className="flex items-center gap-2 px-4 py-2 relative z-10">
                      <Icon className="h-5 w-5" /><span>{item.label}</span>
                    </motion.div>
                  </motion.div>
                </button>
              </motion.li>
            )
          })}
        </ul>
      </motion.nav>
    )
  }
)
```

**Dependencies:** `lucide-react`, `framer-motion`, `next-themes`, `@/lib/utils`

---

### modern-mobile-menu (easemize)
**Source:** https://21st.dev/r/easemize/modern-mobile-menu

Interactive mobile menu with animated icons and highlighting.

```tsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Home, Briefcase, Calendar, Shield, Settings } from 'lucide-react';

type IconComponentType = React.ElementType<{ className?: string }>;
export interface InteractiveMenuItem { label: string; icon: IconComponentType }

const defaultItems: InteractiveMenuItem[] = [
  { label: 'home', icon: Home },
  { label: 'strategy', icon: Briefcase },
  { label: 'period', icon: Calendar },
  { label: 'security', icon: Shield },
  { label: 'settings', icon: Settings },
];

const InteractiveMenu: React.FC<{ items?: InteractiveMenuItem[]; accentColor?: string }> = ({ items, accentColor }) => {
  const finalItems = useMemo(() => items && items.length >= 2 && items.length <= 5 ? items : defaultItems, [items]);
  const [activeIndex, setActiveIndex] = useState(0);
  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeItemElement = itemRefs.current[activeIndex];
    const activeTextElement = textRefs.current[activeIndex];
    if (activeItemElement && activeTextElement) {
      activeItemElement.style.setProperty('--lineWidth', `${activeTextElement.offsetWidth}px`);
    }
  }, [activeIndex, finalItems]);

  return (
    <nav className="menu" style={{ '--component-active-color': accentColor || 'var(--accent-foreground)' } as React.CSSProperties}>
      {finalItems.map((item, index) => {
        const isActive = index === activeIndex;
        const IconComponent = item.icon;
        return (
          <button key={item.label} className={`menu__item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)} ref={(el) => (itemRefs.current[index] = el)}>
            <div className="menu__icon"><IconComponent className="icon" /></div>
            <strong className={`menu__text ${isActive ? 'active' : ''}`} ref={(el) => (textRefs.current[index] = el)}>
              {item.label}
            </strong>
          </button>
        );
      })}
    </nav>
  );
};

export { InteractiveMenu }
```

**Dependencies:** `lucide-react`

---

### menu-vertical (berlix)
**Source:** https://21st.dev/r/berlix/menu-vertical

Vertical menu with arrow animation and skew effect.

```tsx
"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type MenuItem = { label: string; href: string };

const MotionLink = motion.create(Link);

export const MenuVertical = ({ menuItems = [], color = "#ff6900", skew = 0 }: { menuItems: MenuItem[]; color?: string; skew?: number }) => {
  return (
    <div className="flex w-fit flex-col gap-4 px-10">
      {menuItems.map((item, index) => (
        <motion.div key={`${item.href}-${index}`} className="group/nav flex items-center gap-2 cursor-pointer text-zinc-900 dark:text-zinc-50" initial="initial" whileHover="hover">
          <motion.div variants={{ initial: { x: "-100%", color: "inherit", opacity: 0 }, hover: { x: 0, color, opacity: 1 } }} transition={{ duration: 0.3, ease: "easeOut" }} className="z-0">
            <ArrowRight strokeWidth={3} className="size-10" />
          </motion.div>
          <MotionLink href={item.href}
            variants={{ initial: { x: -40, color: "inherit" }, hover: { x: 0, color, skewX: skew } }}
            transition={{ duration: 0.3, ease: "easeOut" }} className="font-semibold text-4xl no-underline">
            {item.label}
          </MotionLink>
        </motion.div>
      ))}
    </div>
  );
};
```

**Dependencies:** `motion`, `lucide-react`, `next`

---

### omni-command-palette (Scottclayton3d)
**Source:** https://21st.dev/r/Scottclayton3d/omni-command-palette

Full-featured command palette with fuzzy search, recents, pinned items.

```tsx
"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Command, Search, ArrowDown, ArrowUp, CornerDownLeft, X, Pin, History, ExternalLink, ChevronRight, Loader2 } from "lucide-react";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export type OmniItem = {
  id: string; label: string; groupId: string; subtitle?: string; href?: string;
  icon?: React.ReactNode; shortcut?: string[]; pinned?: boolean; disabled?: boolean;
  keywords?: string[]; onAction?: () => void;
};

export type OmniSource = {
  id: string; label: string;
  fetch: (query: string) => Promise<OmniItem[]> | OmniItem[];
  emptyHint?: React.ReactNode; minQuery?: number;
};

export function OmniCommandPalette({ open, onOpenChange, sources, placeholder = "Search commands...", storageKey = "omni:recents", showRecents = true, maxRecents = 8, className, onItemExecuted, portalContainer }: {
  open?: boolean; onOpenChange?: (v: boolean) => void; sources: OmniSource[];
  placeholder?: string; storageKey?: string; showRecents?: boolean; maxRecents?: number;
  className?: string; onItemExecuted?: (item: OmniItem) => void; portalContainer?: HTMLElement | null;
}) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Record<string, OmniItem[]>>({});
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [loadingIds, setLoadingIds] = React.useState<Set<string>>(new Set());
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Fetch and render logic...
  // Full implementation includes fuzzy search, keyboard navigation, recents persistence

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal container={portalContainer ?? undefined}>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/50" />
        <Dialog.Content className={cn("fixed z-[101] inset-x-2 top-16 mx-auto w-[min(720px,100%-16px)] rounded-xl border bg-popover shadow-lg", className)}>
          <div className="border-b flex items-center gap-2 px-3 py-2">
            <Search className="size-4 text-muted-foreground" />
            <input ref={inputRef} placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm" />
            <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd>
          </div>
          <div className="max-h-[60vh] overflow-auto p-1">
            {/* Render groups and items with fuzzy highlighting */}
          </div>
          <div className="border-t px-3 py-2 text-xs text-muted-foreground flex items-center gap-4">
            <span className="flex items-center gap-1"><CornerDownLeft className="size-3" />select</span>
            <span className="flex items-center gap-1"><ArrowUp className="size-3" /><ArrowDown className="size-3" />navigate</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

**Dependencies:** `@radix-ui/react-dialog`, `lucide-react`

---

## 📊 Statistics

## 🎨 Origin UI Components

### glass-radio-group (ravikatiyar)
**Source:** https://21st.dev/r/ravikatiyar/glass-radio-group

Glassmorphism radio group with sliding glider effect.

```tsx
import React from 'react';
import styled from 'styled-components';

const Radio = () => {
  return (
    <StyledWrapper>
      <div className="glass-radio-group">
        <input type="radio" name="plan" id="glass-silver" defaultChecked />
        <label htmlFor="glass-silver">Silver</label>
        <input type="radio" name="plan" id="glass-gold" />
        <label htmlFor="glass-gold">Gold</label>
        <input type="radio" name="plan" id="glass-platinum" />
        <label htmlFor="glass-platinum">Platinum</label>
        <div className="glass-glider" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .glass-radio-group {
    --bg: rgba(255, 255, 255, 0.06);
    display: flex; position: relative; background: var(--bg);
    border-radius: 1rem; backdrop-filter: blur(12px);
    box-shadow: inset 1px 1px 4px rgba(255, 255, 255, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .glass-radio-group input { display: none; }
  .glass-radio-group label {
    flex: 1; display: flex; align-items: center; justify-content: center;
    padding: 0.8rem 1.6rem; cursor: pointer; font-weight: 600; color: #e5e5e5;
    position: relative; z-index: 2; transition: color 0.3s;
  }
  .glass-glider {
    position: absolute; top: 0; bottom: 0; width: calc(100% / 3);
    border-radius: 1rem; z-index: 1;
    transition: transform 0.5s cubic-bezier(0.37, 1.95, 0.66, 0.56);
  }
  #glass-silver:checked ~ .glass-glider { transform: translateX(0%); background: linear-gradient(135deg, #c0c0c055, #e0e0e0); }
  #glass-gold:checked ~ .glass-glider { transform: translateX(100%); background: linear-gradient(135deg, #ffd70055, #ffcc00); }
  #glass-platinum:checked ~ .glass-glider { transform: translateX(200%); background: linear-gradient(135deg, #d0e7ff55, #a0d8ff); }
`;

export default Radio;
```

**Dependencies:** `styled-components`

---

### review-filter-bars (ruixenui)
**Source:** https://21st.dev/r/ruixenui/review-filter-bars

Star rating filter with progress bars.

```tsx
"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";
import { RiStarFill } from "@remixicon/react";
import { cn } from "@/lib/utils";

const ReviewFilterGroup = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Root>, React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>>(
  ({ className, ...props }, ref) => (
    <RadioGroupPrimitive.Root ref={ref} className={cn("flex flex-col gap-2 w-full max-w-md", className)} {...props} />
  )
);

const ReviewFilterItem = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & { stars: number; count: number; total: number }
>(({ className, stars, count, total, ...props }, ref) => {
  const percentage = Math.round((count / total) * 100);
  return (
    <RadioGroupPrimitive.Item ref={ref} className={cn("relative flex items-center gap-3 rounded-md border p-2 hover:border-primary/60", className)} {...props}>
      <div className="flex items-center gap-0.5 min-w-[72px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <RiStarFill key={i} size={16} className={i < stars ? "text-amber-500" : "text-muted-foreground/30"} />
        ))}
      </div>
      <div className="flex-1 h-2 rounded-full bg-muted">
        <div className="h-2 rounded-full bg-primary" style={{ width: `${percentage}%` }} />
      </div>
      <span className="text-xs font-medium text-muted-foreground">{count.toLocaleString()}</span>
    </RadioGroupPrimitive.Item>
  );
});

export { ReviewFilterGroup, ReviewFilterItem };
```

**Dependencies:** `@radix-ui/react-radio-group`, `@remixicon/react`, `@/lib/utils`

---

### button (originui)
**Source:** https://21st.dev/r/originui/button

Clean button component with variants.

```tsx
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-10 rounded-lg px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean }>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);

export { Button, buttonVariants };
```

**Dependencies:** `@radix-ui/react-slot`, `class-variance-authority`

---

### input (originui)
**Source:** https://21st.dev/r/originui/input

Styled input with focus ring.

```tsx
import { cn } from "@/lib/utils";
import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
          type === "file" && "p-0 pr-3 italic file:me-3 file:h-full file:border-0 file:bg-transparent file:px-3 file:text-sm file:font-medium",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

export { Input };
```

**Dependencies:** `@/lib/utils`

---

### textarea (originui)
**Source:** https://21st.dev/r/originui/textarea

Styled textarea with focus ring.

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

export { Textarea };
```

**Dependencies:** `@/lib/utils`

---

### badge (originui)
**Source:** https://21st.dev/r/originui/badge

Badge component with variants.

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-1.5 text-xs font-medium leading-normal transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
```

**Dependencies:** `class-variance-authority`

---

### avatar (originui)
**Source:** https://21st.dev/r/originui/avatar

Avatar component with fallback.

```tsx
"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Root ref={ref} className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props} />
  )
);

const AvatarImage = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Image>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
  )
);

const AvatarFallback = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Fallback>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback ref={ref} className={cn("flex h-full w-full items-center justify-center rounded-[inherit] bg-secondary text-xs", className)} {...props} />
  )
);

export { Avatar, AvatarFallback, AvatarImage };
```

**Dependencies:** `@radix-ui/react-avatar`

---

### select (originui)
**Source:** https://21st.dev/r/originui/select

Full select component with scroll buttons.

```tsx
"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>>(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger ref={ref} className={cn("flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm", className)} {...props}>
      {children}
      <SelectPrimitive.Icon asChild><ChevronDownIcon className="shrink-0 text-muted-foreground/80" /></SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
);

const SelectContent = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Content>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>>(
  ({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content ref={ref} className={cn("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border bg-popover shadow-lg", className)} position={position} {...props}>
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);

const SelectItem = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Item>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>>(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item ref={ref} className={cn("relative flex w-full cursor-default select-none items-center rounded-md py-1.5 pe-2 ps-8 text-sm outline-none focus:bg-accent", className)} {...props}>
      <span className="absolute start-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator><CheckIcon /></SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
);

export { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue };
```

**Dependencies:** `@radix-ui/react-select`, `@radix-ui/react-icons`

---

### dialog (originui)
**Source:** https://21st.dev/r/originui/dialog

Dialog/Modal component.

```tsx
"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Cross2Icon } from "@radix-ui/react-icons";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-[101] bg-black/80 data-[state=open]:animate-in data-[state=closed]:fade-out-0", className)} {...props} />
  )
);

const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>>(
  ({ className, children, ...props }, ref) => (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content ref={ref} className={cn("fixed left-1/2 top-1/2 z-[101] w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 border bg-background p-6 shadow-lg rounded-xl", className)} {...props}>
        {children}
        <DialogPrimitive.Close className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-lg">
          <Cross2Icon className="opacity-60 hover:opacity-100" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
);

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />;
const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
const DialogTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
  ({ className, ...props }, ref) => <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
);

export { Dialog, DialogClose, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger };
```

**Dependencies:** `@radix-ui/react-dialog`, `@radix-ui/react-icons`

---

### accordion (originui)
**Source:** https://21st.dev/r/originui/accordion

Accordion component with animations.

```tsx
"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@radix-ui/react-icons";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Item>, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>>(
  ({ className, ...props }, ref) => <AccordionPrimitive.Item ref={ref} className={cn("border-b border-border", className)} {...props} />
);

const AccordionTrigger = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>>(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger ref={ref} className={cn("flex flex-1 items-center justify-between py-4 text-left font-semibold hover:underline [&[data-state=open]>svg]:rotate-180", className)} {...props}>
        {children}
        <ChevronDownIcon className="shrink-0 opacity-60 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
);

const AccordionContent = React.forwardRef<React.ElementRef<typeof AccordionPrimitive.Content>, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>>(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content ref={ref} className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down" {...props}>
      <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
);

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
```

**Dependencies:** `@radix-ui/react-accordion`, `@radix-ui/react-icons`

---

### tabs (originui)
**Source:** https://21st.dev/r/originui/tabs

Tabs component.

```tsx
"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.List ref={ref} className={cn("inline-flex items-center justify-center rounded-lg bg-muted p-0.5 text-muted-foreground/70", className)} {...props} />
  )
);

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger ref={ref} className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all hover:text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm", className)} {...props} />
  )
);

const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(
  ({ className, ...props }, ref) => <TabsPrimitive.Content ref={ref} className={cn("mt-2", className)} {...props} />
);

export { Tabs, TabsContent, TabsList, TabsTrigger };
```

**Dependencies:** `@radix-ui/react-tabs`

---

### checkbox (originui)
**Source:** https://21st.dev/r/originui/checkbox

Checkbox with indeterminate state.

```tsx
"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as React from "react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>>(
  ({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn("peer size-4 shrink-0 rounded border border-input shadow-sm data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <svg width="9" height="9" viewBox="0 0 9 9" fill="currentcolor">
          <path fillRule="evenodd" clipRule="evenodd" d="M8.53547 0.62293C8.88226 0.849446 8.97976 1.3142 8.75325 1.66099L4.5083 8.1599C4.38833 8.34356 4.19397 8.4655 3.9764 8.49358C3.75883 8.52167 3.53987 8.45309 3.3772 8.30591L0.616113 5.80777C0.308959 5.52987 0.285246 5.05559 0.563148 4.74844C0.84105 4.44128 1.31533 4.41757 1.62249 4.69547L3.73256 6.60459L7.49741 0.840706C7.72393 0.493916 8.18868 0.396414 8.53547 0.62293Z"/>
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
);

export { Checkbox };
```

**Dependencies:** `@radix-ui/react-checkbox`

---

## 📊 Statistics

### label (originui)
**Source:** https://21st.dev/r/originui/label

Label component for form fields.

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn("text-sm font-medium leading-4 text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
  ),
);

export { Label };
```

**Dependencies:** `@/lib/utils`

---

### tooltip (originui)
**Source:** https://21st.dev/r/originui/tooltip

Tooltip component with optional arrow.

```tsx
"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";
import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & { showArrow?: boolean }
>(({ className, sideOffset = 4, showArrow = false, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content ref={ref} sideOffset={sideOffset}
      className={cn("relative z-50 max-w-[280px] rounded-lg border bg-popover px-3 py-1.5 text-sm animate-in fade-in-0 zoom-in-95", className)} {...props}>
      {props.children}
      {showArrow && <TooltipPrimitive.Arrow className="-my-px fill-popover" />}
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
```

**Dependencies:** `@radix-ui/react-tooltip`

---

### popover (originui)
**Source:** https://21st.dev/r/originui/popover

Popover component with optional arrow.

```tsx
"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";
import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & { showArrow?: boolean }
>(({ className, align = "center", sideOffset = 4, showArrow = false, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content ref={ref} align={align} sideOffset={sideOffset}
      className={cn("z-50 max-h-[var(--radix-popover-content-available-height)] min-w-[8rem] overflow-y-auto rounded-lg border bg-popover p-4 shadow-lg data-[state=open]:animate-in", className)} {...props}>
      {props.children}
      {showArrow && <PopoverPrimitive.Arrow className="-my-px fill-popover" />}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
```

**Dependencies:** `@radix-ui/react-popover`

---

### radio-group (originui)
**Source:** https://21st.dev/r/originui/radio-group

Radio group component.

```tsx
"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";
import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Root>, React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>>(
  ({ className, ...props }, ref) => <RadioGroupPrimitive.Root className={cn("grid gap-3", className)} {...props} ref={ref} />
);

const RadioGroupItem = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Item>, React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>>(
  ({ className, ...props }, ref) => (
    <RadioGroupPrimitive.Item ref={ref}
      className={cn("aspect-square size-4 rounded-full border border-input shadow-sm data-[state=checked]:border-primary data-[state=checked]:bg-primary", className)} {...props}>
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center text-current">
        <svg width="6" height="6" viewBox="0 0 6 6" fill="currentcolor"><circle cx="3" cy="3" r="3" /></svg>
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
);

export { RadioGroup, RadioGroupItem };
```

**Dependencies:** `@radix-ui/react-radio-group`

---

### dropdown-menu (originui)
**Source:** https://21st.dev/r/originui/dropdown-menu

Full-featured dropdown menu component.

```tsx
"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronRightIcon, DotFilledIcon } from "@radix-ui/react-icons";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuContent = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>>(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content ref={ref} sideOffset={sideOffset}
        className={cn("z-50 min-w-40 overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg", className)} {...props} />
    </DropdownMenuPrimitive.Portal>
  )
);

const DropdownMenuItem = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.Item>, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>>(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Item ref={ref}
      className={cn("relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none focus:bg-accent data-[disabled]:opacity-50", className)} {...props} />
  )
);

const DropdownMenuSeparator = React.forwardRef<React.ElementRef<typeof DropdownMenuPrimitive.Separator>, React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>>(
  ({ className, ...props }, ref) => <DropdownMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
);

export { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuTrigger };
```

**Dependencies:** `@radix-ui/react-dropdown-menu`, `@radix-ui/react-icons`

---

### command (originui)
**Source:** https://21st.dev/r/originui/command

Command palette (cmdk) component.

```tsx
"use client";

import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const Command = React.forwardRef<React.ElementRef<typeof CommandPrimitive>, React.ComponentPropsWithoutRef<typeof CommandPrimitive>>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive ref={ref} className={cn("flex h-full w-full flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground", className)} {...props} />
  )
);

const CommandDialog = ({ children, ...props }: DialogProps) => (
  <Dialog {...props}>
    <DialogContent className="overflow-hidden p-0 sm:max-w-lg">
      <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
        {children}
      </Command>
    </DialogContent>
  </Dialog>
);

const CommandInput = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Input>, React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>>(
  ({ className, ...props }, ref) => (
    <div className="flex items-center border-b border-input px-5">
      <MagnifyingGlassIcon className="me-3 text-muted-foreground/80" />
      <CommandPrimitive.Input ref={ref} className={cn("flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground/70", className)} {...props} />
    </div>
  )
);

const CommandList = React.forwardRef<React.ElementRef<typeof CommandPrimitive.List>, React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>>(
  ({ className, ...props }, ref) => <CommandPrimitive.List ref={ref} className={cn("max-h-80 overflow-y-auto overflow-x-hidden", className)} {...props} />
);

const CommandItem = React.forwardRef<React.ElementRef<typeof CommandPrimitive.Item>, React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Item ref={ref} className={cn("relative flex cursor-default select-none items-center gap-3 rounded-md px-2 py-1.5 text-sm outline-none data-[selected=true]:bg-accent", className)} {...props} />
  )
);

export { Command, CommandDialog, CommandInput, CommandItem, CommandList };
```

**Dependencies:** `cmdk`, `@radix-ui/react-dialog`, `@radix-ui/react-icons`

---

### table (originui)
**Source:** https://21st.dev/r/originui/table

Full table component set.

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  ),
);

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn(className)} {...props} />
);

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => <tr ref={ref} className={cn("border-b border-border transition-colors hover:bg-muted/50", className)} {...props} />
);

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => <th ref={ref} className={cn("h-12 px-3 text-left align-middle font-medium text-muted-foreground", className)} {...props} />
);

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => <td ref={ref} className={cn("p-3 align-middle", className)} {...props} />
);

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
```

**Dependencies:** `@/lib/utils`

---

## 📊 Statistics

**Community Components Added:** 34
**Total in Part 2:** 34 components
**Combined Total (Part 1 + Part 2):** ~332 components

---
