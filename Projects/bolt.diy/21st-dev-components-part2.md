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

## 🎆 MagicUI Effects (Shadcn Registry)

### border-beam (magicui)
**Source:** https://magicui.design/r/border-beam
**Install:** `pnpm dlx shadcn@latest add @magicui/border-beam`

An animated beam of light which travels along the border of its container.

```tsx
"use client"

import { motion, MotionStyle, Transition } from "motion/react"
import { cn } from "@/lib/utils"

interface BorderBeamProps {
  size?: number
  duration?: number
  delay?: number
  colorFrom?: string
  colorTo?: string
  transition?: Transition
  className?: string
  style?: React.CSSProperties
  reverse?: boolean
  initialOffset?: number
  borderWidth?: number
}

export const BorderBeam = ({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
}: BorderBeamProps) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] [mask-composite:intersect] [mask-clip:padding-box,border-box]"
      style={{ "--border-beam-width": `${borderWidth}px` } as React.CSSProperties}
    >
      <motion.div
        className={cn("absolute aspect-square", "bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent", className)}
        style={{ width: size, offsetPath: `rect(0 auto auto 0 round ${size}px)`, "--color-from": colorFrom, "--color-to": colorTo, ...style } as MotionStyle}
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{ offsetDistance: reverse ? [`${100 - initialOffset}%`, `${-initialOffset}%`] : [`${initialOffset}%`, `${100 + initialOffset}%`] }}
        transition={{ repeat: Infinity, ease: "linear", duration, delay: -delay, ...transition }}
      />
    </div>
  )
}
```

**Dependencies:** `motion`

---

### shine-border (magicui)
**Source:** https://magicui.design/r/shine-border
**Install:** `pnpm dlx shadcn@latest add @magicui/shine-border`

Shine border is an animated background border effect.

```tsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  borderWidth?: number
  duration?: number
  shineColor?: string | string[]
}

export function ShineBorder({ borderWidth = 1, duration = 14, shineColor = "#000000", className, style, ...props }: ShineBorderProps) {
  return (
    <div
      style={{
        "--border-width": `${borderWidth}px`,
        "--duration": `${duration}s`,
        backgroundImage: `radial-gradient(transparent,transparent, ${Array.isArray(shineColor) ? shineColor.join(",") : shineColor},transparent,transparent)`,
        backgroundSize: "300% 300%",
        mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
        WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        padding: "var(--border-width)",
        ...style,
      } as React.CSSProperties}
      className={cn("motion-safe:animate-shine pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position]", className)}
      {...props}
    />
  )
}
```

**Dependencies:** None (CSS animation)
**CSS:** `@keyframes shine { 0% { background-position: 0% 0% } 50% { background-position: 100% 100% } to { background-position: 0% 0% } }`

---

### magic-card (magicui)
**Source:** https://magicui.design/r/magic-card
**Install:** `pnpm dlx shadcn@latest add @magicui/magic-card`

A spotlight effect that follows your mouse cursor and highlights borders on hover.

```tsx
"use client"

import React, { useCallback, useEffect } from "react"
import { motion, useMotionTemplate, useMotionValue } from "motion/react"
import { cn } from "@/lib/utils"

interface MagicCardProps {
  children?: React.ReactNode
  className?: string
  gradientSize?: number
  gradientColor?: string
  gradientOpacity?: number
  gradientFrom?: string
  gradientTo?: string
}

export function MagicCard({ children, className, gradientSize = 200, gradientColor = "#262626", gradientOpacity = 0.8, gradientFrom = "#9E7AFF", gradientTo = "#FE8BBB" }: MagicCardProps) {
  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)
  const reset = useCallback(() => { mouseX.set(-gradientSize); mouseY.set(-gradientSize) }, [gradientSize, mouseX, mouseY])

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }, [mouseX, mouseY])

  useEffect(() => { reset() }, [reset])

  return (
    <div className={cn("group relative rounded-[inherit]", className)} onPointerMove={handlePointerMove} onPointerLeave={reset}>
      <motion.div className="bg-border pointer-events-none absolute inset-0 rounded-[inherit] duration-300 group-hover:opacity-100"
        style={{ background: useMotionTemplate`radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientFrom}, ${gradientTo}, var(--border) 100%)` }} />
      <div className="bg-background absolute inset-px rounded-[inherit]" />
      <motion.div className="pointer-events-none absolute inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: useMotionTemplate`radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)`, opacity: gradientOpacity }} />
      <div className="relative">{children}</div>
    </div>
  )
}
```

**Dependencies:** `motion`

---

### aurora-text (magicui)
**Source:** https://magicui.design/r/aurora-text
**Install:** `pnpm dlx shadcn@latest add @magicui/aurora-text`

A beautiful aurora text effect with animated gradient.

```tsx
"use client"

import React, { memo } from "react"

interface AuroraTextProps {
  children: React.ReactNode
  className?: string
  colors?: string[]
  speed?: number
}

export const AuroraText = memo(({ children, className = "", colors = ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"], speed = 1 }: AuroraTextProps) => {
  const gradientStyle = {
    backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${colors[0]})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animationDuration: `${10 / speed}s`,
  }

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="sr-only">{children}</span>
      <span className="animate-aurora relative bg-[length:200%_auto] bg-clip-text text-transparent" style={gradientStyle} aria-hidden="true">{children}</span>
    </span>
  )
})

AuroraText.displayName = "AuroraText"
```

**Dependencies:** None (CSS animation)
**CSS:** `@keyframes aurora { 0% { background-position: 0% 50%; transform: rotate(-5deg) scale(0.9) } 50% { background-position: 100% 50%; transform: rotate(-3deg) scale(0.95) } 100% { background-position: 0% 50%; transform: rotate(-5deg) scale(0.9) } }`

---

### video-text (magicui)
**Source:** https://magicui.design/r/video-text
**Install:** `pnpm dlx shadcn@latest add @magicui/video-text`

A component that displays text with a video playing in the background.

```tsx
"use client"

import React, { ElementType, ReactNode, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export interface VideoTextProps {
  src: string
  className?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  preload?: "auto" | "metadata" | "none"
  children: ReactNode
  fontSize?: string | number
  fontWeight?: string | number
  fontFamily?: string
  as?: ElementType
}

export function VideoText({ src, children, className = "", autoPlay = true, muted = true, loop = true, preload = "auto", fontSize = 20, fontWeight = "bold", fontFamily = "sans-serif", as: Component = "div" }: VideoTextProps) {
  const [svgMask, setSvgMask] = useState("")
  const content = React.Children.toArray(children).join("")

  useEffect(() => {
    const responsiveFontSize = typeof fontSize === "number" ? `${fontSize}vw` : fontSize
    const newSvgMask = `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><text x='50%' y='50%' font-size='${responsiveFontSize}' font-weight='${fontWeight}' text-anchor='middle' dominant-baseline='middle' font-family='${fontFamily}'>${content}</text></svg>`
    setSvgMask(newSvgMask)
  }, [content, fontSize, fontWeight, fontFamily])

  const dataUrlMask = `url("data:image/svg+xml,${encodeURIComponent(svgMask)}")`

  return (
    <Component className={cn(`relative size-full`, className)}>
      <div className="absolute inset-0 flex items-center justify-center" style={{ maskImage: dataUrlMask, WebkitMaskImage: dataUrlMask, maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center" }}>
        <video className="h-full w-full object-cover" autoPlay={autoPlay} muted={muted} loop={loop} preload={preload} playsInline><source src={src} /></video>
      </div>
      <span className="sr-only">{content}</span>
    </Component>
  )
}
```

**Dependencies:** None

---

### animated-shiny-text (magicui)
**Source:** https://magicui.design/r/animated-shiny-text
**Install:** `pnpm dlx shadcn@latest add @magicui/animated-shiny-text`

A light glare effect which pans across text making it appear as if it is shimmering.

```tsx
import { ComponentPropsWithoutRef, CSSProperties, FC } from "react"
import { cn } from "@/lib/utils"

export interface AnimatedShinyTextProps extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({ children, className, shimmerWidth = 100, ...props }) => {
  return (
    <span
      style={{ "--shiny-width": `${shimmerWidth}px` } as CSSProperties}
      className={cn(
        "mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70",
        "animate-shiny-text [background-size:var(--shiny-width)_100%] bg-clip-text [background-position:0_0] bg-no-repeat [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",
        "bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent dark:via-white/80",
        className
      )}
      {...props}
    >{children}</span>
  )
}
```

**Dependencies:** None (CSS animation)
**CSS:** `@keyframes shiny-text { 0%, 90%, 100% { background-position: calc(-100% - var(--shiny-width)) 0 } 30%, 60% { background-position: calc(100% + var(--shiny-width)) 0 } }`

---

### animated-gradient-text (magicui)
**Source:** https://magicui.design/r/animated-gradient-text
**Install:** `pnpm dlx shadcn@latest add @magicui/animated-gradient-text`

An animated gradient background which transitions between colors for text.

```tsx
import { ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

export interface AnimatedGradientTextProps extends ComponentPropsWithoutRef<"div"> {
  speed?: number
  colorFrom?: string
  colorTo?: string
}

export function AnimatedGradientText({ children, className, speed = 1, colorFrom = "#ffaa40", colorTo = "#9c40ff", ...props }: AnimatedGradientTextProps) {
  return (
    <span
      style={{ "--bg-size": `${speed * 300}%`, "--color-from": colorFrom, "--color-to": colorTo } as React.CSSProperties}
      className={cn(`animate-gradient inline bg-gradient-to-r from-[var(--color-from)] via-[var(--color-to)] to-[var(--color-from)] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`, className)}
      {...props}
    >{children}</span>
  )
}
```

**Dependencies:** None (CSS animation)
**CSS:** `@keyframes gradient { to { background-position: var(--bg-size, 300%) 0 } }`

---

### safari (magicui)
**Source:** https://magicui.design/r/safari
**Install:** `pnpm dlx shadcn@latest add @magicui/safari`

A Safari browser mockup to showcase your website.

```tsx
import type { HTMLAttributes } from "react"

type SafariMode = "default" | "simple"

export interface SafariProps extends HTMLAttributes<HTMLDivElement> {
  url?: string
  imageSrc?: string
  videoSrc?: string
  mode?: SafariMode
}

export function Safari({ imageSrc, videoSrc, url, mode = "default", className, style, ...props }: SafariProps) {
  const hasVideo = !!videoSrc
  const hasMedia = hasVideo || !!imageSrc

  return (
    <div className={`relative inline-block w-full align-middle leading-none ${className ?? ""}`} style={{ aspectRatio: "1203/753", ...style }} {...props}>
      {hasVideo && (
        <div className="pointer-events-none absolute z-0 overflow-hidden" style={{ left: "0.08%", top: "6.9%", width: "99.75%", height: "92.96%" }}>
          <video className="block size-full object-cover" src={videoSrc} autoPlay loop muted playsInline preload="metadata" />
        </div>
      )}
      {!hasVideo && imageSrc && (
        <div className="pointer-events-none absolute z-0 overflow-hidden" style={{ left: "0.08%", top: "6.9%", width: "99.75%", height: "92.96%", borderRadius: "0 0 11px 11px" }}>
          <img src={imageSrc} alt="" className="block size-full object-cover object-top" />
        </div>
      )}
      {/* SVG frame with URL bar and controls */}
    </div>
  )
}
```

**Dependencies:** None

---

### iphone (magicui)
**Source:** https://magicui.design/r/iphone
**Install:** `pnpm dlx shadcn@latest add @magicui/iphone`

A mockup of the iPhone for showcasing mobile apps.

```tsx
import type { HTMLAttributes } from "react"

export interface IphoneProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  videoSrc?: string
}

export function Iphone({ src, videoSrc, className, style, ...props }: IphoneProps) {
  const hasVideo = !!videoSrc
  const hasMedia = hasVideo || !!src

  return (
    <div className={`relative inline-block w-full align-middle leading-none ${className}`} style={{ aspectRatio: "433/882", ...style }} {...props}>
      {hasVideo && (
        <div className="pointer-events-none absolute z-0 overflow-hidden" style={{ left: "4.9%", top: "2.18%", width: "89.95%", height: "95.63%", borderRadius: "14.3% / 6.6%" }}>
          <video className="block size-full object-cover" src={videoSrc} autoPlay loop muted playsInline preload="metadata" />
        </div>
      )}
      {!hasVideo && src && (
        <div className="pointer-events-none absolute z-0 overflow-hidden" style={{ left: "4.9%", top: "2.18%", width: "89.95%", height: "95.63%", borderRadius: "14.3% / 6.6%" }}>
          <img src={src} alt="" className="block size-full object-cover object-top" />
        </div>
      )}
      {/* SVG frame with notch and buttons */}
    </div>
  )
}
```

**Dependencies:** None

---

### android (magicui)
**Source:** https://magicui.design/r/android
**Install:** `pnpm dlx shadcn@latest add @magicui/android`

A mockup of an Android device for showcasing mobile apps.

```tsx
import { SVGProps } from "react"

export interface AndroidProps extends SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  src?: string
  videoSrc?: string
}

export function Android({ width = 433, height = 882, src, videoSrc, ...props }: AndroidProps) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Device frame paths */}
      <path d="M0 42C0 18.8041 18.804 0 42 0H336C359.196 0 378 18.804 378 42V788C378 811.196 359.196 830 336 830H42C18.804 830 0 811.196 0 788V42Z" className="fill-[#E5E5E5] dark:fill-[#404040]" />
      <path d="M2 43C2 22.0132 19.0132 5 40 5H338C358.987 5 376 22.0132 376 43V787C376 807.987 358.987 825 338 825H40C19.0132 825 2 807.987 2 787V43Z" className="fill-white dark:fill-[#262626]" />
      {src && <image href={src} width="360" height="800" className="size-full object-cover" preserveAspectRatio="xMidYMid slice" clipPath="url(#clip0_514_20855)" />}
      {videoSrc && (
        <foreignObject width="380" height="820" clipPath="url(#clip0_514_20855)">
          <video className="size-full object-cover" src={videoSrc} autoPlay loop muted playsInline />
        </foreignObject>
      )}
    </svg>
  )
}
```

**Dependencies:** None

---

### rainbow-button (magicui)
**Source:** https://magicui.design/r/rainbow-button
**Install:** `pnpm dlx shadcn@latest add @magicui/rainbow-button`

An animated button with a rainbow border effect.

```tsx
import React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const rainbowButtonVariants = cva(
  cn(
    "relative cursor-pointer group transition-all animate-rainbow",
    "inline-flex items-center justify-center gap-2 shrink-0",
    "rounded-sm outline-none focus-visible:ring-[3px]",
    "text-sm font-medium whitespace-nowrap",
    "disabled:pointer-events-none disabled:opacity-50"
  ),
  {
    variants: {
      variant: {
        default: "border-0 bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] bg-[length:200%] text-primary-foreground",
        outline: "border border-input bg-[linear-gradient(#ffffff,#ffffff),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] bg-[length:200%] text-accent-foreground",
      },
      size: { default: "h-9 px-4 py-2", sm: "h-8 rounded-xl px-3 text-xs", lg: "h-11 rounded-xl px-8", icon: "size-9" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

interface RainbowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof rainbowButtonVariants> {
  asChild?: boolean
}

const RainbowButton = React.forwardRef<HTMLButtonElement, RainbowButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return <Comp data-slot="button" className={cn(rainbowButtonVariants({ variant, size, className }))} ref={ref} {...props} />
})

RainbowButton.displayName = "RainbowButton"
export { RainbowButton, rainbowButtonVariants, type RainbowButtonProps }
```

**Dependencies:** `@radix-ui/react-slot`, `class-variance-authority`
**CSS:** `@keyframes rainbow { 0% { background-position: 0% } 100% { background-position: 200% } }`

---

### ripple-button (magicui)
**Source:** https://magicui.design/r/ripple-button
**Install:** `pnpm dlx shadcn@latest add @magicui/ripple-button`

An animated button with ripple effect useful for user engagement.

```tsx
"use client"

import React, { MouseEvent, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  rippleColor?: string
  duration?: string
}

export const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ className, children, rippleColor = "#ffffff", duration = "600ms", onClick, ...props }, ref) => {
    const [buttonRipples, setButtonRipples] = useState<Array<{ x: number; y: number; size: number; key: number }>>([])

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget
      const rect = button.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = event.clientX - rect.left - size / 2
      const y = event.clientY - rect.top - size / 2
      setButtonRipples((prev) => [...prev, { x, y, size, key: Date.now() }])
      onClick?.(event)
    }

    useEffect(() => {
      if (buttonRipples.length > 0) {
        const lastRipple = buttonRipples[buttonRipples.length - 1]
        const timeout = setTimeout(() => {
          setButtonRipples((prev) => prev.filter((ripple) => ripple.key !== lastRipple.key))
        }, parseInt(duration))
        return () => clearTimeout(timeout)
      }
    }, [buttonRipples, duration])

    return (
      <button className={cn("bg-background text-primary relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 px-4 py-2 text-center", className)} onClick={handleClick} ref={ref} {...props}>
        <div className="relative z-10">{children}</div>
        <span className="pointer-events-none absolute inset-0">
          {buttonRipples.map((ripple) => (
            <span key={ripple.key} className="animate-rippling bg-background absolute rounded-full opacity-30"
              style={{ width: `${ripple.size}px`, height: `${ripple.size}px`, top: `${ripple.y}px`, left: `${ripple.x}px`, backgroundColor: rippleColor, transform: "scale(0)" }} />
          ))}
        </span>
      </button>
    )
  }
)

RippleButton.displayName = "RippleButton"
```

**Dependencies:** None (CSS animation)
**CSS:** `@keyframes rippling { 0% { opacity: 1 } 100% { transform: scale(2); opacity: 0 } }`

---

### globe (magicui)
**Source:** https://magicui.design/r/globe
**Install:** `pnpm dlx shadcn@latest add @magicui/globe`

Интерактивный 3D глобус на WebGL с маркерами и автоматическим вращением.

```tsx
"use client"

import { useEffect, useRef } from "react"
import createGlobe, { COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "motion/react"
import { cn } from "@/lib/utils"

const GLOBE_CONFIG: COBEOptions = {
  width: 800, height: 800, devicePixelRatio: 2, phi: 0, theta: 0.3, dark: 0, diffuse: 0.4,
  mapSamples: 16000, mapBrightness: 1.2, baseColor: [1, 1, 1], markerColor: [251 / 255, 100 / 255, 21 / 255], glowColor: [1, 1, 1],
  markers: [{ location: [40.7128, -74.006], size: 0.1 }, { location: [51.5074, -0.1278], size: 0.08 }],
  onRender: () => {}
}

export function Globe({ className, config = GLOBE_CONFIG }: { className?: string; config?: COBEOptions }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const r = useMotionValue(0)
  const rs = useSpring(r, { mass: 1, damping: 30, stiffness: 100 })
  let phi = 0, width = 0

  useEffect(() => {
    const onResize = () => { if (canvasRef.current) width = canvasRef.current.offsetWidth }
    window.addEventListener("resize", onResize); onResize()
    const globe = createGlobe(canvasRef.current!, { ...config, width: width * 2, height: width * 2,
      onRender: (state) => { if (!pointerInteracting.current) phi += 0.005; state.phi = phi + rs.get(); state.width = width * 2; state.height = width * 2 }
    })
    setTimeout(() => (canvasRef.current!.style.opacity = "1"), 0)
    return () => { globe.destroy(); window.removeEventListener("resize", onResize) }
  }, [rs, config])

  return (
    <div className={cn("absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]", className)}>
      <canvas ref={canvasRef} className="size-full opacity-0 transition-opacity duration-500" style={{ cursor: "grab" }}
        onPointerDown={(e) => pointerInteracting.current = e.clientX}
        onPointerUp={() => pointerInteracting.current = null}
        onMouseMove={(e) => { if (pointerInteracting.current !== null) r.set(r.get() + (e.clientX - pointerInteracting.current) / 1400) }} />
    </div>
  )
}
```

**Dependencies:** `cobe`, `motion`

---

### marquee (magicui)
**Source:** https://magicui.design/r/marquee
**Install:** `pnpm dlx shadcn@latest add @magicui/marquee`

Бесконечная прокрутка контента (текст, изображения, видео).

```tsx
import { ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string; reverse?: boolean; pauseOnHover?: boolean; children: React.ReactNode; vertical?: boolean; repeat?: number
}

export function Marquee({ className, reverse = false, pauseOnHover = false, children, vertical = false, repeat = 4, ...props }: MarqueeProps) {
  return (
    <div {...props} className={cn("group flex [gap:var(--gap)] overflow-hidden p-2 [--duration:40s] [--gap:1rem]", { "flex-row": !vertical, "flex-col": vertical }, className)}>
      {Array(repeat).fill(0).map((_, i) => (
        <div key={i} className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
          "animate-marquee flex-row": !vertical, "animate-marquee-vertical flex-col": vertical,
          "group-hover:[animation-play-state:paused]": pauseOnHover, "[animation-direction:reverse]": reverse
        })}>{children}</div>
      ))}
    </div>
  )
}
```

**Dependencies:** None (CSS animation)
**CSS:** `@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(calc(-100% - var(--gap))) } }`

---

### dock (magicui)
**Source:** https://magicui.design/r/dock
**Install:** `pnpm dlx shadcn@latest add @magicui/dock`

Док-панель в стиле macOS с эффектом увеличения иконок.

```tsx
"use client"

import React, { useRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, MotionValue, useMotionValue, useSpring, useTransform } from "motion/react"
import { cn } from "@/lib/utils"

const dockVariants = cva("supports-backdrop-blur:bg-white/10 mx-auto flex h-[58px] w-max items-center justify-center gap-2 rounded-2xl border p-2 backdrop-blur-md")

export function Dock({ className, children, iconSize = 40, iconMagnification = 60, iconDistance = 140 }: { className?: string; children: React.ReactNode; iconSize?: number; iconMagnification?: number; iconDistance?: number }) {
  const mouseX = useMotionValue(Infinity)
  return (
    <motion.div onMouseMove={(e) => mouseX.set(e.pageX)} onMouseLeave={() => mouseX.set(Infinity)} className={cn(dockVariants({ className }))}>
      {React.Children.map(children, (child) => React.isValidElement(child) ? React.cloneElement(child, { mouseX, size: iconSize, magnification: iconMagnification, distance: iconDistance } as any) : child)}
    </motion.div>
  )
}

export function DockIcon({ size = 40, magnification = 60, distance = 140, mouseX, className, children }: { size?: number; magnification?: number; distance?: number; mouseX?: MotionValue<number>; className?: string; children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const defaultMouseX = useMotionValue(Infinity)
  const distanceCalc = useTransform(mouseX ?? defaultMouseX, (val) => { const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }; return val - bounds.x - bounds.width / 2 })
  const sizeTransform = useTransform(distanceCalc, [-distance, 0, distance], [size, magnification, size])
  const scaleSize = useSpring(sizeTransform, { mass: 0.1, stiffness: 150, damping: 12 })
  return <motion.div ref={ref} style={{ width: scaleSize, height: scaleSize }} className={cn("flex aspect-square cursor-pointer items-center justify-center rounded-full", className)}>{children}</motion.div>
}
```

**Dependencies:** `motion`, `class-variance-authority`

---

### particles (magicui)
**Source:** https://magicui.design/r/particles
**Install:** `pnpm dlx shadcn@latest add @magicui/particles`

Интерактивный фон с частицами, реагирующими на мышь.

```tsx
"use client"

import React, { useEffect, useRef, useState, ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

interface ParticlesProps extends ComponentPropsWithoutRef<"div"> {
  quantity?: number; staticity?: number; ease?: number; size?: number; color?: string; vx?: number; vy?: number
}

export const Particles: React.FC<ParticlesProps> = ({ className = "", quantity = 100, staticity = 50, ease = 50, size = 0.4, color = "#ffffff", vx = 0, vy = 0, ...props }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  // ... Canvas animation logic with mouse interaction
  return (
    <div className={cn("pointer-events-none", className)} ref={canvasContainerRef} aria-hidden="true" {...props}>
      <canvas ref={canvasRef} className="size-full" />
    </div>
  )
}
```

**Dependencies:** None (Canvas API)

---

### meteors (magicui)
**Source:** https://magicui.design/r/meteors
**Install:** `pnpm dlx shadcn@latest add @magicui/meteors`

Эффект метеорного дождя.

```tsx
"use client"

import React, { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface MeteorsProps { number?: number; minDelay?: number; maxDelay?: number; minDuration?: number; maxDuration?: number; angle?: number; className?: string }

export const Meteors = ({ number = 20, minDelay = 0.2, maxDelay = 1.2, minDuration = 2, maxDuration = 10, angle = 215, className }: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<React.CSSProperties[]>([])

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      "--angle": -angle + "deg", top: "-5%", left: `calc(0% + ${Math.floor(Math.random() * window.innerWidth)}px)`,
      animationDelay: Math.random() * (maxDelay - minDelay) + minDelay + "s",
      animationDuration: Math.floor(Math.random() * (maxDuration - minDuration) + minDuration) + "s",
    }))
    setMeteorStyles(styles)
  }, [number, minDelay, maxDelay, minDuration, maxDuration, angle])

  return <>{meteorStyles.map((style, idx) => (
    <span key={idx} style={style} className={cn("animate-meteor pointer-events-none absolute size-0.5 rotate-[var(--angle)] rounded-full bg-zinc-500", className)}>
      <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-zinc-500 to-transparent" />
    </span>
  ))}</>
}
```

**Dependencies:** None (CSS animation)
**CSS:** `@keyframes meteor { 0% { transform: rotate(var(--angle)) translateX(0); opacity: 1 } 100% { transform: rotate(var(--angle)) translateX(-500px); opacity: 0 } }`

---

### number-ticker (magicui)
**Source:** https://magicui.design/r/number-ticker
**Install:** `pnpm dlx shadcn@latest add @magicui/number-ticker`

Анимированный счетчик чисел с плавным переходом.

```tsx
"use client"

import { ComponentPropsWithoutRef, useEffect, useRef } from "react"
import { useInView, useMotionValue, useSpring } from "motion/react"
import { cn } from "@/lib/utils"

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number; startValue?: number; direction?: "up" | "down"; delay?: number; decimalPlaces?: number
}

export function NumberTicker({ value, startValue = 0, direction = "up", delay = 0, className, decimalPlaces = 0, ...props }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === "down" ? value : startValue)
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 100 })
  const isInView = useInView(ref, { once: true, margin: "0px" })

  useEffect(() => {
    if (isInView) { const timer = setTimeout(() => motionValue.set(direction === "down" ? startValue : value), delay * 1000); return () => clearTimeout(timer) }
  }, [motionValue, isInView, delay, value, direction, startValue])

  useEffect(() => springValue.on("change", (latest) => { if (ref.current) ref.current.textContent = Intl.NumberFormat("en-US", { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces }).format(Number(latest.toFixed(decimalPlaces))) }), [springValue, decimalPlaces])

  return <span ref={ref} className={cn("inline-block tracking-wider tabular-nums", className)} {...props}>{startValue}</span>
}
```

**Dependencies:** `motion`

---

### ripple (magicui)
**Source:** https://magicui.design/r/ripple
**Install:** `pnpm dlx shadcn@latest add @magicui/ripple`

Эффект расходящейся ряби для фона.

```tsx
import React, { ComponentPropsWithoutRef, CSSProperties } from "react"
import { cn } from "@/lib/utils"

interface RippleProps extends ComponentPropsWithoutRef<"div"> { mainCircleSize?: number; mainCircleOpacity?: number; numCircles?: number }

export const Ripple = React.memo(function Ripple({ mainCircleSize = 210, mainCircleOpacity = 0.24, numCircles = 8, className, ...props }: RippleProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,white,transparent)] select-none", className)} {...props}>
      {Array.from({ length: numCircles }, (_, i) => (
        <div key={i} className="animate-ripple bg-foreground/25 absolute rounded-full border shadow-xl"
          style={{ "--i": i, width: `${mainCircleSize + i * 70}px`, height: `${mainCircleSize + i * 70}px`, opacity: mainCircleOpacity - i * 0.03,
            animationDelay: `${i * 0.06}s`, borderWidth: "1px", top: "50%", left: "50%", transform: "translate(-50%, -50%) scale(1)" } as CSSProperties} />
      ))}
    </div>
  )
})
```

**Dependencies:** None (CSS animation)
**CSS:** `@keyframes ripple { 0%, 100% { transform: translate(-50%, -50%) scale(1) } 50% { transform: translate(-50%, -50%) scale(0.9) } }`

---

### retro-grid (magicui)
**Source:** https://magicui.design/r/retro-grid
**Install:** `pnpm dlx shadcn@latest add @magicui/retro-grid`

Ретро-сетка с 3D перспективой и анимацией прокрутки.

```tsx
import { cn } from "@/lib/utils"

interface RetroGridProps extends React.HTMLAttributes<HTMLDivElement> {
  angle?: number; cellSize?: number; opacity?: number; lightLineColor?: string; darkLineColor?: string
}

export function RetroGrid({ className, angle = 65, cellSize = 60, opacity = 0.5, lightLineColor = "gray", darkLineColor = "gray", ...props }: RetroGridProps) {
  return (
    <div className={cn("pointer-events-none absolute size-full overflow-hidden [perspective:200px]", `opacity-[${opacity}]`, className)}
      style={{ "--grid-angle": `${angle}deg`, "--cell-size": `${cellSize}px`, "--light-line": lightLineColor, "--dark-line": darkLineColor } as React.CSSProperties} {...props}>
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div className="animate-grid [inset:0%_0px] [margin-left:-200%] [height:300vh] [width:600vw] [background-image:linear-gradient(to_right,var(--light-line)_1px,transparent_0),linear-gradient(to_bottom,var(--light-line)_1px,transparent_0)] [background-size:var(--cell-size)_var(--cell-size)]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90% dark:from-black" />
    </div>
  )
}
```

**Dependencies:** None (CSS animation)
**CSS:** `@keyframes grid { 0% { transform: translateY(-50%) } 100% { transform: translateY(0) } }`

---

### grid-pattern (magicui)
**Source:** https://magicui.design/r/grid-pattern
**Install:** `pnpm dlx shadcn@latest add @magicui/grid-pattern`

SVG-паттерн сетки для фона.

```tsx
import { useId } from "react"
import { cn } from "@/lib/utils"

interface GridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number; height?: number; x?: number; y?: number; squares?: Array<[number, number]>; strokeDasharray?: string
}

export function GridPattern({ width = 40, height = 40, x = -1, y = -1, strokeDasharray = "0", squares, className, ...props }: GridPatternProps) {
  const id = useId()
  return (
    <svg aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30", className)} {...props}>
      <defs><pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
        <path d={`M.5 ${height}V.5H${width}`} fill="none" strokeDasharray={strokeDasharray} />
      </pattern></defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {squares && <svg x={x} y={y} className="overflow-visible">{squares.map(([sx, sy]) => <rect key={`${sx}-${sy}`} strokeWidth="0" width={width - 1} height={height - 1} x={sx * width + 1} y={sy * height + 1} />)}</svg>}
    </svg>
  )
}
```

**Dependencies:** None

---

### dot-pattern (magicui)
**Source:** https://magicui.design/r/dot-pattern
**Install:** `pnpm dlx shadcn@latest add @magicui/dot-pattern`

SVG-паттерн точек с опциональным свечением.

```tsx
"use client"

import React, { useEffect, useId, useRef, useState } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number; height?: number; x?: number; y?: number; cx?: number; cy?: number; cr?: number; glow?: boolean
}

export function DotPattern({ width = 16, height = 16, x = 0, y = 0, cx = 1, cy = 1, cr = 1, className, glow = false, ...props }: DotPatternProps) {
  const id = useId()
  const containerRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => { if (containerRef.current) { const { width, height } = containerRef.current.getBoundingClientRect(); setDimensions({ width, height }) } }
    updateDimensions(); window.addEventListener("resize", updateDimensions); return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  const dots = Array.from({ length: Math.ceil(dimensions.width / width) * Math.ceil(dimensions.height / height) }, (_, i) => ({
    x: (i % Math.ceil(dimensions.width / width)) * width + cx, y: Math.floor(i / Math.ceil(dimensions.width / width)) * height + cy,
    delay: Math.random() * 5, duration: Math.random() * 3 + 2
  }))

  return (
    <svg ref={containerRef} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full text-neutral-400/80", className)} {...props}>
      <defs><radialGradient id={`${id}-gradient`}><stop offset="0%" stopColor="currentColor" stopOpacity="1" /><stop offset="100%" stopColor="currentColor" stopOpacity="0" /></radialGradient></defs>
      {dots.map((dot) => <motion.circle key={`${dot.x}-${dot.y}`} cx={dot.x} cy={dot.y} r={cr} fill={glow ? `url(#${id}-gradient)` : "currentColor"}
        initial={glow ? { opacity: 0.4, scale: 1 } : {}} animate={glow ? { opacity: [0.4, 1, 0.4], scale: [1, 1.5, 1] } : {}}
        transition={glow ? { duration: dot.duration, repeat: Infinity, repeatType: "reverse", delay: dot.delay, ease: "easeInOut" } : {}} />)}
    </svg>
  )
}
```

**Dependencies:** `motion`

---

### confetti (magicui)
**Source:** https://magicui.design/r/confetti
**Install:** `pnpm dlx shadcn@latest add @magicui/confetti`

Эффект конфетти для празднования событий.

```tsx
"use client"

import React, { createContext, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react"
import confetti from "canvas-confetti"
import type { CreateTypes as ConfettiInstance, Options as ConfettiOptions, GlobalOptions as ConfettiGlobalOptions } from "canvas-confetti"
import { Button } from "@/components/ui/button"

type Api = { fire: (options?: ConfettiOptions) => void }
type Props = React.ComponentPropsWithRef<"canvas"> & { options?: ConfettiOptions; globalOptions?: ConfettiGlobalOptions; manualstart?: boolean; children?: React.ReactNode }
export type ConfettiRef = Api | null

export const Confetti = forwardRef<ConfettiRef, Props>((props, ref) => {
  const { options, globalOptions = { resize: true, useWorker: true }, manualstart = false, children, ...rest } = props
  const instanceRef = useRef<ConfettiInstance | null>(null)

  const canvasRef = useCallback((node: HTMLCanvasElement) => {
    if (node !== null) { if (instanceRef.current) return; instanceRef.current = confetti.create(node, { ...globalOptions, resize: true }) }
    else { if (instanceRef.current) { instanceRef.current.reset(); instanceRef.current = null } }
  }, [globalOptions])

  const fire = useCallback(async (opts = {}) => { try { await instanceRef.current?.({ ...options, ...opts }) } catch (error) { console.error("Confetti error:", error) } }, [options])
  const api = useMemo(() => ({ fire }), [fire])
  useImperativeHandle(ref, () => api, [api])
  useEffect(() => { if (!manualstart) fire() }, [manualstart, fire])

  return <canvas ref={canvasRef} {...rest}>{children}</canvas>
})
Confetti.displayName = "Confetti"

export const ConfettiButton = ({ options, children, ...props }: React.ComponentProps<"button"> & { options?: ConfettiOptions & ConfettiGlobalOptions }) => {
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    await confetti({ ...options, origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight } })
  }
  return <Button onClick={handleClick} {...props}>{children}</Button>
}
```

**Dependencies:** `canvas-confetti`, `@types/canvas-confetti`


### text-animate (magicui)
**Source:** https://magicui.design/r/text-animate
**Install:** `pnpm dlx shadcn@latest add @magicui/text-animate`

Универсальный компонент анимации текста с множеством пресетов (fadeIn, blurIn, slideUp и др.).

```tsx
"use client"

import { ElementType, memo } from "react"
import { AnimatePresence, motion, MotionProps, Variants } from "motion/react"
import { cn } from "@/lib/utils"

type AnimationType = "text" | "word" | "character" | "line"
type AnimationVariant = "fadeIn" | "blurIn" | "blurInUp" | "blurInDown" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scaleUp" | "scaleDown"

interface TextAnimateProps extends MotionProps {
  children: string; className?: string; segmentClassName?: string; delay?: number; duration?: number; variants?: Variants
  as?: ElementType; by?: AnimationType; startOnView?: boolean; once?: boolean; animation?: AnimationVariant; accessible?: boolean
}

export const TextAnimate = memo(({ children, delay = 0, duration = 0.3, className, segmentClassName, as: Component = "p", startOnView = true, once = false, by = "word", animation = "fadeIn", accessible = true, ...props }: TextAnimateProps) => {
  const MotionComponent = motion.create(Component)
  let segments: string[] = by === "word" ? children.split(/(\s+)/) : by === "character" ? children.split("") : by === "line" ? children.split("\n") : [children]

  return (
    <AnimatePresence mode="popLayout">
      <MotionComponent className={cn("whitespace-pre-wrap", className)} initial="hidden" whileInView={startOnView ? "show" : undefined} animate={startOnView ? undefined : "show"} exit="exit" viewport={{ once }} {...props}>
        {accessible && <span className="sr-only">{children}</span>}
        {segments.map((segment, i) => <motion.span key={`${by}-${segment}-${i}`} className={cn(by === "line" ? "block" : "inline-block whitespace-pre", segmentClassName)}>{segment}</motion.span>)}
      </MotionComponent>
    </AnimatePresence>
  )
})
```

**Dependencies:** `motion`

---

### blur-fade (magicui)
**Source:** https://magicui.design/r/blur-fade
**Install:** `pnpm dlx shadcn@latest add @magicui/blur-fade`

Анимация появления с размытием и затуханием.

```tsx
"use client"

import { useRef } from "react"
import { AnimatePresence, motion, MotionProps, useInView, Variants } from "motion/react"

interface BlurFadeProps extends MotionProps {
  children: React.ReactNode; className?: string; duration?: number; delay?: number; offset?: number; direction?: "up" | "down" | "left" | "right"; inView?: boolean; blur?: string
}

export function BlurFade({ children, className, duration = 0.4, delay = 0, offset = 6, direction = "down", inView = false, blur = "6px", ...props }: BlurFadeProps) {
  const ref = useRef(null)
  const inViewResult = useInView(ref, { once: true, margin: "-50px" })
  const isInView = !inView || inViewResult
  const defaultVariants: Variants = {
    hidden: { [direction === "left" || direction === "right" ? "x" : "y"]: direction === "right" || direction === "down" ? -offset : offset, opacity: 0, filter: `blur(${blur})` },
    visible: { [direction === "left" || direction === "right" ? "x" : "y"]: 0, opacity: 1, filter: `blur(0px)` }
  }
  return (
    <AnimatePresence>
      <motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} exit="hidden" variants={defaultVariants}
        transition={{ delay: 0.04 + delay, duration, ease: "easeOut" }} className={className} {...props}>{children}</motion.div>
    </AnimatePresence>
  )
}
```

**Dependencies:** `motion`

---

### scroll-progress (magicui)
**Source:** https://magicui.design/r/scroll-progress
**Install:** `pnpm dlx shadcn@latest add @magicui/scroll-progress`

Индикатор прогресса прокрутки страницы.

```tsx
"use client"

import { motion, MotionProps, useScroll } from "motion/react"
import { cn } from "@/lib/utils"

interface ScrollProgressProps extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> { ref?: React.Ref<HTMLDivElement> }

export function ScrollProgress({ className, ref, ...props }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  return <motion.div ref={ref} className={cn("fixed inset-x-0 top-0 z-50 h-px origin-left bg-gradient-to-r from-[#A97CF8] via-[#F38CB8] to-[#FDCC92]", className)} style={{ scaleX: scrollYProgress }} {...props} />
}
```

**Dependencies:** `motion`

---

### word-rotate (magicui)
**Source:** https://magicui.design/r/word-rotate
**Install:** `pnpm dlx shadcn@latest add @magicui/word-rotate`

Вертикальная ротация слов с анимацией.

```tsx
"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, MotionProps } from "motion/react"
import { cn } from "@/lib/utils"

interface WordRotateProps { words: string[]; duration?: number; motionProps?: MotionProps; className?: string }

export function WordRotate({ words, duration = 2500, motionProps = { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 50 }, transition: { duration: 0.25, ease: "easeOut" } }, className }: WordRotateProps) {
  const [index, setIndex] = useState(0)
  useEffect(() => { const interval = setInterval(() => setIndex((prev) => (prev + 1) % words.length), duration); return () => clearInterval(interval) }, [words, duration])
  return <div className="overflow-hidden py-2"><AnimatePresence mode="wait"><motion.h1 key={words[index]} className={cn(className)} {...motionProps}>{words[index]}</motion.h1></AnimatePresence></div>
}
```

**Dependencies:** `motion`

---

### typing-animation (magicui)
**Source:** https://magicui.design/r/typing-animation
**Install:** `pnpm dlx shadcn@latest add @magicui/typing-animation`

Анимация набора текста с курсором.

```tsx
"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, MotionProps, useInView } from "motion/react"
import { cn } from "@/lib/utils"

interface TypingAnimationProps extends MotionProps {
  children?: string; words?: string[]; className?: string; duration?: number; typeSpeed?: number; deleteSpeed?: number
  delay?: number; pauseDelay?: number; loop?: boolean; startOnView?: boolean; showCursor?: boolean; blinkCursor?: boolean; cursorStyle?: "line" | "block" | "underscore"
}

export function TypingAnimation({ children, words, className, duration = 100, delay = 0, pauseDelay = 1000, loop = false, startOnView = true, showCursor = true, blinkCursor = true, cursorStyle = "line", ...props }: TypingAnimationProps) {
  const MotionComponent = motion.create("span", { forwardMotionProps: true })
  const [displayedText, setDisplayedText] = useState("")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [phase, setPhase] = useState<"typing" | "pause" | "deleting">("typing")
  const elementRef = useRef<HTMLElement | null>(null)
  const isInView = useInView(elementRef as React.RefObject<Element>, { amount: 0.3, once: true })
  const wordsToAnimate = useMemo(() => words || (children ? [children] : []), [words, children])
  // ... typing/deleting logic
  const getCursorChar = () => cursorStyle === "block" ? "▌" : cursorStyle === "underscore" ? "_" : "|"
  return <MotionComponent ref={elementRef} className={cn("leading-[5rem] tracking-[-0.02em]", className)} {...props}>{displayedText}{showCursor && <span className={cn("inline-block", blinkCursor && "animate-blink-cursor")}>{getCursorChar()}</span>}</MotionComponent>
}
```

**Dependencies:** `motion`
**CSS:** `@keyframes blink-cursor { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }`

---

### sparkles-text (magicui)
**Source:** https://magicui.design/r/sparkles-text
**Install:** `pnpm dlx shadcn@latest add @magicui/sparkles-text`

Текст с анимированными искорками.

```tsx
"use client"

import { CSSProperties, useEffect, useState } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface Sparkle { id: string; x: string; y: string; color: string; delay: number; scale: number; lifespan: number }
interface SparklesTextProps { className?: string; children: React.ReactNode; sparklesCount?: number; colors?: { first: string; second: string } }

export const SparklesText: React.FC<SparklesTextProps> = ({ children, colors = { first: "#9E7AFF", second: "#FE8BBB" }, className, sparklesCount = 10 }) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    const generateStar = (): Sparkle => ({ id: `${Math.random()}-${Date.now()}`, x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, color: Math.random() > 0.5 ? colors.first : colors.second, delay: Math.random() * 2, scale: Math.random() * 1 + 0.3, lifespan: Math.random() * 10 + 5 })
    setSparkles(Array.from({ length: sparklesCount }, generateStar))
    const interval = setInterval(() => setSparkles((s) => s.map((star) => star.lifespan <= 0 ? generateStar() : { ...star, lifespan: star.lifespan - 0.1 })), 100)
    return () => clearInterval(interval)
  }, [colors, sparklesCount])

  return (
    <div className={cn("text-6xl font-bold", className)} style={{ "--sparkles-first-color": colors.first, "--sparkles-second-color": colors.second } as CSSProperties}>
      <span className="relative inline-block">
        {sparkles.map((s) => <motion.svg key={s.id} className="pointer-events-none absolute z-20" style={{ left: s.x, top: s.y }} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, s.scale, 0], rotate: [75, 120, 150] }} transition={{ duration: 0.8, repeat: Infinity, delay: s.delay }} width="21" height="21" viewBox="0 0 21 21"><path d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z" fill={s.color} /></motion.svg>)}
        <strong>{children}</strong>
      </span>
    </div>
  )
}
```

**Dependencies:** `motion`

---

### morphing-text (magicui)
**Source:** https://magicui.design/r/morphing-text
**Install:** `pnpm dlx shadcn@latest add @magicui/morphing-text`

Текст с эффектом морфинга между словами.

```tsx
"use client"

import { useCallback, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface MorphingTextProps { className?: string; texts: string[] }

export const MorphingText: React.FC<MorphingTextProps> = ({ texts, className }) => {
  const text1Ref = useRef<HTMLSpanElement>(null)
  const text2Ref = useRef<HTMLSpanElement>(null)
  const textIndexRef = useRef(0)
  const morphRef = useRef(0)
  const cooldownRef = useRef(0)
  const timeRef = useRef(new Date())

  const setStyles = useCallback((fraction: number) => {
    const [c1, c2] = [text1Ref.current, text2Ref.current]
    if (!c1 || !c2) return
    c2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`; c2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`
    const inv = 1 - fraction
    c1.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`; c1.style.opacity = `${Math.pow(inv, 0.4) * 100}%`
    c1.textContent = texts[textIndexRef.current % texts.length]
    c2.textContent = texts[(textIndexRef.current + 1) % texts.length]
  }, [texts])

  useEffect(() => {
    let id: number; const animate = () => { id = requestAnimationFrame(animate); /* morph logic */ }; animate()
    return () => cancelAnimationFrame(id)
  }, [setStyles])

  return (
    <div className={cn("relative mx-auto h-16 w-full max-w-screen-md text-center font-sans text-[40pt] leading-none font-bold [filter:url(#threshold)_blur(0.6px)]", className)}>
      <span className="absolute inset-x-0 top-0 m-auto inline-block w-full" ref={text1Ref} />
      <span className="absolute inset-x-0 top-0 m-auto inline-block w-full" ref={text2Ref} />
      <svg id="filters" className="fixed h-0 w-0"><defs><filter id="threshold"><feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 255 -140" /></filter></defs></svg>
    </div>
  )
}
```

**Dependencies:** None

---

### avatar-circles (magicui)
**Source:** https://magicui.design/r/avatar-circles
**Install:** `pnpm dlx shadcn@latest add @magicui/avatar-circles`

Перекрывающиеся круглые аватары.

```tsx
"use client"

import { cn } from "@/lib/utils"

interface Avatar { imageUrl: string; profileUrl: string }
interface AvatarCirclesProps { className?: string; numPeople?: number; avatarUrls: Avatar[] }

export const AvatarCircles = ({ numPeople, className, avatarUrls }: AvatarCirclesProps) => (
  <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
    {avatarUrls.map((url, i) => <a key={i} href={url.profileUrl} target="_blank" rel="noopener noreferrer"><img className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800" src={url.imageUrl} alt={`Avatar ${i + 1}`} /></a>)}
    {(numPeople ?? 0) > 0 && <a className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white dark:border-gray-800 dark:bg-white dark:text-black" href="">+{numPeople}</a>}
  </div>
)
```

**Dependencies:** None

---

### animated-list (magicui)
**Source:** https://magicui.design/r/animated-list
**Install:** `pnpm dlx shadcn@latest add @magicui/animated-list`

Список с последовательной анимацией появления элементов.

```tsx
"use client"

import React, { ComponentPropsWithoutRef, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, MotionProps } from "motion/react"
import { cn } from "@/lib/utils"

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations: MotionProps = { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1, originY: 0 }, exit: { scale: 0, opacity: 0 }, transition: { type: "spring", stiffness: 350, damping: 40 } }
  return <motion.div {...animations} layout className="mx-auto w-full">{children}</motion.div>
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> { children: React.ReactNode; delay?: number }

export const AnimatedList = React.memo(({ children, className, delay = 1000, ...props }: AnimatedListProps) => {
  const [index, setIndex] = useState(0)
  const childrenArray = useMemo(() => React.Children.toArray(children), [children])
  useEffect(() => { if (index < childrenArray.length - 1) { const timeout = setTimeout(() => setIndex((prev) => (prev + 1) % childrenArray.length), delay); return () => clearTimeout(timeout) } }, [index, delay, childrenArray.length])
  const itemsToShow = useMemo(() => childrenArray.slice(0, index + 1).reverse(), [index, childrenArray])
  return <div className={cn(`flex flex-col items-center gap-4`, className)} {...props}><AnimatePresence>{itemsToShow.map((item) => <AnimatedListItem key={(item as React.ReactElement).key}>{item}</AnimatedListItem>)}</AnimatePresence></div>
})
AnimatedList.displayName = "AnimatedList"
```

**Dependencies:** `motion`

---

## 🆕 Дополнительные Community Компоненты (Batch 2)

### icons (shadcn)
**Source:** https://21st.dev/r/shadcn/icons

Коллекция SVG-иконок для брендов и UI.

```tsx
type IconProps = React.HTMLAttributes<SVGElement>

export const Icons = {
  logo: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
      <rect width="256" height="256" fill="none" />
      <line x1="208" y1="128" x2="128" y2="208" stroke="currentColor" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="192" y1="40" x2="40" y2="192" stroke="currentColor" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  twitter: (props: IconProps) => (<svg {...props} viewBox="0 0 1200 1227" xmlns="http://www.w3.org/2000/svg"><path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887..." /></svg>),
  gitHub: (props: IconProps) => (<svg viewBox="0 0 438.549 438.549" {...props}><path fill="currentColor" d="M409.132 114.573c-19.608-33.596..." /></svg>),
  google: (props: IconProps) => (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12.48 10.92v3.28h7.84..." /></svg>),
  apple: (props: IconProps) => (<svg viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12.152 6.896c-.948 0..." /></svg>),
  spinner: (props: IconProps) => (<svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>),
}
```

**Dependencies:** None

---

### icons (Codehagen)
**Source:** https://21st.dev/r/Codehagen/icons

Расширенная коллекция иконок с дополнительными UI-иконками.

```tsx
export const Icons = {
  logo: (props: IconProps) => (<svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}><path d="M2.5 16.88a1 1 0 0 1-.32-1.43l9-13.02a1 1 0 0 1 1.64 0l9 13.01..." /></svg>),
  chevronRight: (props: IconProps) => (<svg viewBox="0 0 24 24" stroke="currentColor" {...props}><path d="m9 18 6-6-6-6" /></svg>),
  book: (props: IconProps) => (<svg viewBox="0 0 24 24" stroke="currentColor" {...props}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5..." /></svg>),
  component: (props: IconProps) => (<svg viewBox="0 0 24 24" stroke="currentColor" {...props}><path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z" />...</svg>),
  // ...twitter, github, npm, yarn, pnpm, react, tailwind
}
```

**Dependencies:** None

---

### icon-picker-3 (sirwhod)
**Source:** https://21st.dev/r/sirwhod/icon-picker-3

Выбор иконок Lucide с бесконечной прокруткой и поиском.

```tsx
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface IconPickerProps { icons: IconName[]; onIconSelect: (iconName: IconName) => void; selectedIcon?: IconName; heightClassName?: string }

export function IconPicker({ icons, onIconSelect, selectedIcon, heightClassName = 'h-[280px]' }: IconPickerProps) {
  const [visibleCount, setVisibleCount] = useState(100)
  // ... infinite scroll logic
  return (
    <ScrollArea className={cn('w-full', heightClassName)}>
      <div className="p-2 grid grid-cols-5 sm:grid-cols-9 gap-1">
        {icons.slice(0, visibleCount).map((iconName) => (
          <div key={iconName} className={cn("flex flex-col items-center justify-center p-2 rounded-sm hover:bg-accent cursor-pointer", selectedIcon === iconName && "ring-2 ring-primary")} onClick={() => onIconSelect(iconName)}>
            <DynamicIcon name={iconName} size={16} />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
```

**Dependencies:** `lucide-react`
**Registry Dependencies:** button, command, popover, scroll-area

---

### tree (originui)
**Source:** https://21st.dev/r/originui/tree

Tree-компонент с drag-and-drop на базе @headless-tree/core.

```tsx
"use client"

import * as React from "react"
import { ItemInstance } from "@headless-tree/core"
import { ChevronDownIcon } from "lucide-react"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

interface TreeProps extends React.HTMLAttributes<HTMLDivElement> { indent?: number; tree?: any }

function Tree({ indent = 20, tree, className, ...props }: TreeProps) {
  const containerProps = tree?.getContainerProps?.() || {}
  return (
    <TreeContext.Provider value={{ indent, tree }}>
      <div data-slot="tree" style={{ "--tree-indent": `${indent}px` } as React.CSSProperties} className={cn("flex flex-col", className)} {...containerProps} {...props} />
    </TreeContext.Provider>
  )
}

function TreeItem<T>({ item, className, children, ...props }: { item: ItemInstance<T>; className?: string; children: React.ReactNode }) {
  const { indent } = useTreeContext()
  return <button style={{ "--tree-padding": `${item.getItemMeta().level * indent}px` } as React.CSSProperties} className={cn("z-10 ps-(--tree-padding) ...", className)} {...item.getProps()} {...props}>{children}</button>
}

export { Tree, TreeItem, TreeItemLabel, TreeDragLine }
```

**Dependencies:** `@headless-tree/core`, `lucide-react`, `radix-ui`

---

### reveal-text (isaiahbjork)
**Source:** https://21st.dev/r/isaiahbjork/reveal-text

Анимация появления текста с изображениями при наведении.

```tsx
"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface RevealTextProps { text?: string; textColor?: string; overlayColor?: string; fontSize?: string; letterDelay?: number; letterImages?: string[] }

export function RevealText({ text = "STUNNING", textColor = "text-white", overlayColor = "text-red-500", fontSize = "text-[250px]", letterDelay = 0.08, letterImages = [...] }: RevealTextProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [showRedText, setShowRedText] = useState(false)

  return (
    <div className="flex items-center justify-center relative">
      <div className="flex">
        {text.split("").map((letter, index) => (
          <motion.span key={index} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * letterDelay, type: "spring", damping: 8, stiffness: 200 }}
            className={`${fontSize} font-black tracking-tight cursor-pointer relative overflow-hidden`}>
            <motion.span className={`absolute inset-0 ${textColor}`} animate={{ opacity: hoveredIndex === index ? 0 : 1 }}>{letter}</motion.span>
            <motion.span className="text-transparent bg-clip-text bg-cover" animate={{ opacity: hoveredIndex === index ? 1 : 0 }} style={{ backgroundImage: `url('${letterImages[index]}')` }}>{letter}</motion.span>
          </motion.span>
        ))}
      </div>
    </div>
  )
}
```

**Dependencies:** `framer-motion`

---

### video-player (chetanverma16)
**Source:** https://21st.dev/r/chetanverma16/video-player

Кастомный видеоплеер с анимированными контролами.

```tsx
"use client"

import React, { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const VideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(false)

  return (
    <motion.div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden bg-[#11111198] backdrop-blur-sm"
      onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
      <video ref={videoRef} className="w-full" onTimeUpdate={handleTimeUpdate} src={src} onClick={togglePlay} />
      <AnimatePresence>
        {showControls && (
          <motion.div className="absolute bottom-0 mx-auto max-w-xl left-0 right-0 p-4 m-2 bg-[#11111198] backdrop-blur-md rounded-2xl"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
            {/* Progress bar, play/pause, volume, speed controls */}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
export default VideoPlayer
```

**Dependencies:** `lucide-react`, `framer-motion`

---

### orbital-loader (molecule-ui)
**Source:** https://21st.dev/r/molecule-ui/orbital-loader

Орбитальный лоадер с концентрическими кольцами.

```tsx
"use client"

import { cva } from "class-variance-authority"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export function OrbitalLoader({ className, message, messagePlacement = "bottom" }: { className?: string; message?: string; messagePlacement?: "top" | "bottom" | "left" | "right" }) {
  return (
    <div className={cn("flex gap-2 items-center justify-center", messagePlacement === "bottom" ? "flex-col" : "flex-row")}>
      <div className={cn("relative w-16 h-16", className)}>
        <motion.div className="absolute inset-0 border-2 border-transparent border-t-foreground rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute inset-2 border-2 border-transparent border-t-foreground rounded-full" animate={{ rotate: -360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute inset-4 border-2 border-transparent border-t-foreground rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
      </div>
      {message && <div>{message}</div>}
    </div>
  )
}
```

**Dependencies:** `motion`, `class-variance-authority`

---

### bouncing-dots (molecule-ui)
**Source:** https://21st.dev/r/molecule-ui/bouncing-dots

Анимированные прыгающие точки для индикации загрузки.

```tsx
"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export function BouncingDots({ dots = 3, message, className }: { dots?: number; message?: string; className?: string }) {
  return (
    <div className="flex gap-2 items-center justify-center flex-col">
      <div className="flex gap-2 items-center justify-center">
        {Array(dots).fill(undefined).map((_, index) => (
          <motion.div key={index} className={cn("w-3 h-3 bg-foreground rounded-full", className)}
            animate={{ y: [0, -20, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: index * 0.2, ease: "easeInOut" }} />
        ))}
      </div>
      {message && <div>{message}</div>}
    </div>
  )
}
```

**Dependencies:** `motion`, `class-variance-authority`

---

### morphing-square (molecule-ui)
**Source:** https://21st.dev/r/molecule-ui/morphing-square

Квадрат,морфирующийся в круг с вращением.

```tsx
"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export function MorphingSquare({ className, message, messagePlacement = "bottom" }: { className?: string; message?: string; messagePlacement?: "top" | "bottom" | "left" | "right" }) {
  return (
    <div className="flex gap-2 items-center justify-center flex-col">
      <motion.div className={cn("w-10 h-10 bg-foreground", className)}
        animate={{ borderRadius: ["6%", "50%", "6%"], rotate: [0, 180, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
      {message && <div>{message}</div>}
    </div>
  )
}
```

**Dependencies:** `motion`, `class-variance-authority`

---

### copy-code-button (thanh)
**Source:** https://21st.dev/r/thanh/copy-code-button

Кнопка копирования кода с анимацией подтверждения.

```tsx
import { useState, useEffect } from "react"

export function CopyCode() {
  const [copied, setCopied] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [progress, setProgress] = useState(0)
  const code = "21DEV-LEO"
  const duration = 4000

  useEffect(() => {
    if (copied) {
      const showTimer = setTimeout(() => setShowConfirmation(true), 400)
      // Progress animation...
    }
  }, [copied])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
  }

  return (
    <div className="relative overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-[#1f1f1e] rounded-full px-10 py-3 min-w-80 h-16">
      <div style={{ width: `${progress}%` }} className="absolute left-0 top-0 bottom-0 bg-gray-200 dark:bg-[#2a2a29]" />
      <div style={{ opacity: copied ? 0 : 1, filter: copied ? 'blur(12px)' : 'blur(0px)' }}>
        <span className="text-2xl font-medium text-gray-400">{code}</span>
        <button onClick={handleCopy} className="bg-white dark:bg-[#2a2a29] px-8 py-3 rounded-full">Copy</button>
      </div>
      <div style={{ opacity: showConfirmation ? 1 : 0 }}>
        <svg className="w-4 h-4">...</svg>
        <span>Code Copied!</span>
      </div>
    </div>
  )
}
```


**Dependencies:** None

---

### text-marque (ui-layouts)
**Source:** https://21st.dev/r/ui-layouts/text-marque

Бесконечная прокрутка текста с реакцией на скролл.

```tsx
'use client'
import { useRef, useEffect, forwardRef } from 'react'
import { motion, useScroll, useSpring, useTransform, useVelocity, useAnimationFrame, useMotionValue } from 'motion/react'
import { wrap } from '@motionone/utils'
import { cn } from '@/lib/utils'

interface ComponentProps { children: string; baseVelocity: number; clasname?: string; scrollDependent?: boolean; delay?: number }

const Component = forwardRef<HTMLDivElement, ComponentProps>(({ children, baseVelocity = -5, clasname, scrollDependent = false, delay = 0 }, ref) => {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], { clamp: false })
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`)

  useAnimationFrame((t, delta) => {
    let moveBy = baseVelocity * (delta / 1000)
    if (scrollDependent) moveBy += moveBy * velocityFactor.get()
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div ref={ref} className='overflow-hidden whitespace-nowrap flex flex-nowrap'>
      <motion.div className='flex whitespace-nowrap gap-10 flex-nowrap' style={{ x }}>
        {[...Array(4)].map((_, i) => <span key={i} className={cn(`block text-[8vw]`, clasname)}>{children}</span>)}
      </motion.div>
    </div>
  )
})
export default Component
```

**Dependencies:** `motion`, `@motionone/utils`

---

### framer-thumbnail-carousel (ui-layouts)
**Source:** https://21st.dev/r/ui-layouts/framer-thumbnail-carousel

Карусель изображений с миниатюрами и drag-навигацией.

```tsx
'use client'
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, animate } from 'motion/react'

export function Component() {
  const [index, setIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const x = useMotionValue(0)

  useEffect(() => {
    if (!isDragging && containerRef.current) {
      const targetX = -index * containerRef.current.offsetWidth
      animate(x, targetX, { type: 'spring', stiffness: 300, damping: 30 })
    }
  }, [index, isDragging])

  return (
    <div className='max-w-3xl mx-auto'>
      <div className='relative overflow-hidden rounded-lg' ref={containerRef}>
        <motion.div className='flex' drag='x' dragElastic={0.2}
          onDragEnd={(e, info) => { /* swipe logic */ }} style={{ x }}>
          {items.map((item) => (
            <div key={item.id} className='shrink-0 w-full h-[400px]'>
              <img src={item.url} className='w-full h-full object-cover' />
            </div>
          ))}
        </motion.div>
        {/* Nav buttons */}
      </div>
      <Thumbnails index={index} setIndex={setIndex} />
    </div>
  )
}
```

**Dependencies:** `motion`

---

### checkbox-02 (avanishverma4)
**Source:** https://21st.dev/r/avanishverma4/checkbox-02

Премиум-чекбокс с анимацией и описанием.

```tsx
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'

const PremiumCheckbox = ({ id, label, description, checked, onChange, disabled = false }) => (
  <label htmlFor={id} className={`flex items-start gap-6 cursor-pointer group ${disabled ? 'opacity-50' : ''}`}>
    <div className="relative flex items-center justify-center mt-1">
      <input id={id} type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className="sr-only" />
      <motion.div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center ${checked ? 'bg-white border-white' : 'bg-black border-gray-700'}`}
        whileHover={!disabled ? { scale: 1.05 } : {}} whileTap={!disabled ? { scale: 0.95 } : {}}>
        <AnimatePresence mode="wait">
          {checked && <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}><Check className="w-5 h-5 text-black stroke-[3]" /></motion.div>}
        </AnimatePresence>
      </motion.div>
    </div>
    <div className="flex-1 space-y-2">
      <div className="text-white font-medium text-lg">{label}</div>
      {description && <div className="text-gray-400 text-sm">{description}</div>}
    </div>
  </label>
)
```

**Dependencies:** `framer-motion`, `lucide-react`

---

### inverted-cursor (arunachalam0606)
**Source:** https://21st.dev/r/arunachalam0606/inverted-cursor

Инвертированный курсор с mix-blend-difference.

```tsx
"use client"

import React, { useState, useEffect, useRef } from "react"

interface CursorProps { size?: number }

export const Cursor: React.FC<CursorProps> = ({ size = 60 }) => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>()
  const previousPos = useRef({ x: -size, y: -size })
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ x: -size, y: -size })

  const animate = () => {
    if (!cursorRef.current) return
    const targetX = position.x - size / 2, targetY = position.y - size / 2
    const newX = previousPos.current.x + (targetX - previousPos.current.x) * 0.2
    const newY = previousPos.current.y + (targetY - previousPos.current.y) * 0.2
    previousPos.current = { x: newX, y: newY }
    cursorRef.current.style.transform = `translate(${newX}px, ${newY}px)`
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => { setVisible(true); setPosition({ x: e.clientX, y: e.clientY }) }
    document.addEventListener("mousemove", handleMouseMove)
    document.body.style.cursor = "none"
    requestRef.current = requestAnimationFrame(animate)
    return () => { document.removeEventListener("mousemove", handleMouseMove); cancelAnimationFrame(requestRef.current!); document.body.style.cursor = "auto" }
  }, [])

  return <div ref={cursorRef} className="fixed pointer-events-none rounded-full bg-white mix-blend-difference z-50" style={{ width: size, height: size, opacity: visible ? 1 : 0 }} />
}
```

**Dependencies:** None

---

### image-slider (ravikatiyar)
**Source:** https://21st.dev/r/ravikatiyar/image-slider

Автоматический слайдер изображений с точками навигации.

```tsx
import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ImageSliderProps extends React.HTMLAttributes<HTMLDivElement> { images: string[]; interval?: number }

const ImageSlider = React.forwardRef<HTMLDivElement, ImageSliderProps>(({ images, interval = 5000, className, ...props }, ref) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentIndex((prev) => prev === images.length - 1 ? 0 : prev + 1), interval)
    return () => clearInterval(timer)
  }, [images, interval])

  return (
    <div ref={ref} className={cn("relative w-full h-full overflow-hidden", className)} {...props}>
      <AnimatePresence initial={false}>
        <motion.img key={currentIndex} src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`}
          initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.8 }} className="absolute inset-0 w-full h-full object-cover" />
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => <button key={i} onClick={() => setCurrentIndex(i)}
          className={cn("w-2 h-2 rounded-full", currentIndex === i ? "bg-white" : "bg-white/50")} />)}
      </div>
    </div>
  )
})
export { ImageSlider }
```

**Dependencies:** `framer-motion`

---

### blog-cards (sumonadotwork)
**Source:** https://21st.dev/r/sumonadotwork/blog-cards

Минималистичные карточки блога с hover-эффектами.

```tsx
const BlogCard = ({ title, date, description }) => (
  <div className='text-white w-full h-20 p-4 space-y-1 group hover:cursor-pointer'>
    <div className='flex justify-center gap-1 items-end relative'>
      <div className="md:text-2xl text-xl font-serif whitespace-nowrap dark:text-neutral-100 text-neutral-700 group-hover:text-[#ce624c] transition-all duration-500">{title}</div>
      <span className="w-full border-b-[0.5px] border-dashed dark:border-neutral-600 group-hover:border-[#ce624c] mb-[6px]"></span>
      <div className='dark:text-neutral-400 whitespace-nowrap uppercase group-hover:text-[#ce624c] font-mono md:text-base text-xs'>{date}</div>
    </div>
    <div className="dark:text-neutral-400 text-neutral-500 md:text-lg group-hover:text-[#ce624c]">{description}</div>
  </div>
)
export default BlogCard
```

**Dependencies:** None

---

### theme-tabs (aliimam)
**Source:** https://21st.dev/r/aliimam/theme-tabs

Переключатель темы в виде табов (light/dark/system).

```tsx
import { cn } from "@/lib/utils"
import { Theme } from "@/components/ui/theme"

export const Component = () => (
  <div className="flex items-center gap-3">
    <Theme variant="tabs" size="sm" themes={["light", "dark", "system"]} />
    <Theme variant="tabs" size="md" showLabel themes={["light", "dark", "system"]} />
  </div>
)
```


**Dependencies:** None
**Registry Dependencies:** theme

---

### animated-menu (kousthubha_sky_)
**Source:** https://21st.dev/r/kousthubha_sky_/animated-menu

Анимированное меню с roll-эффектом текста при наведении.

```tsx
"use client"

import React from "react"
import { motion } from "framer-motion"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

const STAGGER = 0.035

const Component: React.FC<{ children: string; className?: string; center?: boolean }> = ({ children, className, center = false }) => (
  <motion.span initial="initial" whileHover="hovered" className={cn("relative block overflow-hidden", className)} style={{ lineHeight: 0.85 }}>
    <div>
      {children.split("").map((l, i) => {
        const delay = center ? STAGGER * Math.abs(i - (children.length - 1) / 2) : STAGGER * i
        return <motion.span key={i} variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }} transition={{ ease: "easeInOut", delay }} className="inline-block">{l}</motion.span>
      })}
    </div>
    <div className="absolute inset-0">
      {children.split("").map((l, i) => {
        const delay = center ? STAGGER * Math.abs(i - (children.length - 1) / 2) : STAGGER * i
        return <motion.span key={i} variants={{ initial: { y: "100%" }, hovered: { y: 0 } }} transition={{ ease: "easeInOut", delay }} className="inline-block">{l}</motion.span>
      })}
    </div>
  </motion.span>
)
export { Component }
```

**Dependencies:** `framer-motion`, `clsx`, `tailwind-merge`

---

### dynamic-frame-layout (oeneco)
**Source:** https://21st.dev/r/oeneco/dynamic-frame-layout

Динамическая сетка видео-фреймов с hover-масштабированием.

```tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Frame { id: number; video: string; defaultPos: { x: number; y: number }; corner: string; edgeHorizontal: string; edgeVertical: string; mediaSize: number; isHovered: boolean }

export function DynamicFrameLayout({ frames, showFrames = false, hoverSize = 6, gapSize = 4 }: { frames: Frame[]; showFrames?: boolean; hoverSize?: number; gapSize?: number }) {
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null)

  const getRowSizes = () => {
    if (hovered === null) return "4fr 4fr 4fr"
    const nonHoveredSize = (12 - hoverSize) / 2
    return [0, 1, 2].map(r => r === hovered.row ? `${hoverSize}fr` : `${nonHoveredSize}fr`).join(" ")
  }

  return (
    <div style={{ display: "grid", gridTemplateRows: getRowSizes(), gridTemplateColumns: getRowSizes(), gap: `${gapSize}px`, transition: "all 0.4s ease" }}>
      {frames.map(frame => {
        const row = Math.floor(frame.defaultPos.y / 4), col = Math.floor(frame.defaultPos.x / 4)
        return (
          <motion.div key={frame.id} onMouseEnter={() => setHovered({ row, col })} onMouseLeave={() => setHovered(null)}>
            <FrameComponent video={frame.video} width="100%" height="100%" isHovered={hovered?.row === row && hovered?.col === col} {...frame} />
          </motion.div>
        )
      })}
    </div>
  )
}
```

**Dependencies:** `framer-motion`

---

### table-edit (ruixenui)
**Source:** https://21st.dev/r/ruixenui/table-edit

Редактируемая таблица с inline-редактированием и выбором строк.

```tsx
"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

type User = { id: string; name: string; email: string; role: string; status: "Active" | "Inactive"; balance: string }

export default function Component() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [selected, setSelected] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<User>>({})

  return (
    <div className="bg-background border rounded-md shadow-sm max-w-4xl">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            <TableHead><Checkbox checked={selected.length === users.length} onCheckedChange={(c) => setSelected(c ? users.map(u => u.id) : [])} /></TableHead>
            <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Balance</TableHead><TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => editingId === user.id ? (/* inline inputs */) : (/* display row */))}
        </TableBody>
        <TableFooter><TableRow><TableCell colSpan={5}>{selected.length} selected</TableCell><TableCell colSpan={2}>Total: $2,500.00</TableCell></TableRow></TableFooter>
      </Table>
    </div>
  )
}
```


**Dependencies:** `lucide-react`
**Registry Dependencies:** badge, table, dropdown-menu, checkbox, button, select, input

---

### interactive-text-particle (easemize)
**Source:** https://21st.dev/r/easemize/interactive-text-particle

Текст, состоящий из интерактивных частиц, реагирующих на курсор.

```tsx
import React, { useEffect, useRef, useState } from 'react'

export interface ParticleTextEffectProps {
  text?: string; colors?: string[]; className?: string; animationForce?: number; particleDensity?: number
}

const ParticleTextEffect: React.FC<ParticleTextEffectProps> = ({ text = 'HOVER!', colors = ['ffad70', 'f7d297', 'edb9a1', 'e697ac'], animationForce = 80, particleDensity = 4 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const pointerRef = useRef<{ x?: number; y?: number }>({})

  class Particle {
    ox: number; oy: number; cx: number; cy: number; or: number; cr: number; f: number; rgb: number[]
    constructor(x: number, y: number, rgb: number[]) { /* init */ }
    draw() { /* draw arc */ }
    move(interactionRadius: number, hasPointer: boolean) { /* apply force and restore */ }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    const canvas = canvasRef.current; if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    pointerRef.current = { x: (e.clientX - rect.left) * (canvas.width / rect.width), y: (e.clientY - rect.top) * (canvas.height / rect.height) }
  }

  return <canvas ref={canvasRef} className="w-full h-full cursor-none" onPointerMove={handlePointerMove} onPointerLeave={() => { pointerRef.current = {} }} />
}
export { ParticleTextEffect }
```

**Dependencies:** None (Canvas API)

---

### tree-folder-structure (shailendrakumar19999)
**Source:** https://21st.dev/r/shailendrakumar19999/tree-folder-structure

Файловое дерево на Chakra UI с индикаторами веток.

```tsx
"use client"

import { TreeView, createTreeCollection } from "@chakra-ui/react"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { LuFile, LuFolder } from "react-icons/lu"

export const TreeViewDemo = () => (
  <ChakraProvider value={defaultSystem}>
    <TreeView.Root collection={collection} maxW="sm">
      <TreeView.Label>Project</TreeView.Label>
      <TreeView.Tree>
        <TreeView.Node indentGuide={<TreeView.BranchIndentGuide />}
          render={({ node, nodeState }) => nodeState.isBranch ? (
            <TreeView.BranchControl><LuFolder /><TreeView.BranchText>{node.name}</TreeView.BranchText></TreeView.BranchControl>
          ) : (
            <TreeView.Item><LuFile /><TreeView.ItemText>{node.name}</TreeView.ItemText></TreeView.Item>
          )}
        />
      </TreeView.Tree>
    </TreeView.Root>
  </ChakraProvider>
)

const collection = createTreeCollection<Node>({
  nodeToValue: (node) => node.id, nodeToString: (node) => node.name,
  rootNode: { id: "ROOT", name: "", children: [
    { id: "node_modules", name: "node_modules", children: [{ id: "zag-js", name: "zag-js" }] },
    { id: "src", name: "src", children: [{ id: "app.tsx", name: "app.tsx" }] },
    { id: "package.json", name: "package.json" }
  ]}
})
```

**Dependencies:** `@chakra-ui/react`, `react-icons`

---

### testimonials-columns-1 (shabanhr)
**Source:** https://21st.dev/r/shabanhr/testimonials-columns-1

Колонки отзывов с бесконечной прокруткой.

```tsx
"use client"

import React from "react"
import { motion } from "motion/react"

export const TestimonialsColumn = ({ className, testimonials, duration = 10 }: { className?: string; testimonials: { text: string; image: string; name: string; role: string }[]; duration?: number }) => (
  <div className={className}>
    <motion.div animate={{ translateY: "-50%" }} transition={{ duration, repeat: Infinity, ease: "linear", repeatType: "loop" }} className="flex flex-col gap-6 pb-6 bg-background">
      {[...new Array(2)].map((_, index) => (
        <React.Fragment key={index}>
          {testimonials.map(({ text, image, name, role }, i) => (
            <div className="p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full" key={i}>
              <div>{text}</div>
              <div className="flex items-center gap-2 mt-5">
                <img width={40} height={40} src={image} alt={name} className="h-10 w-10 rounded-full" />
                <div className="flex flex-col">
                  <div className="font-medium tracking-tight leading-5">{name}</div>
                  <div className="leading-5 opacity-60 tracking-tight">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </motion.div>
  </div>
)
```

**Dependencies:** `motion`

---

## 🆕 Дополнительные MagicUI Компоненты (Batch 3)

### client-tweet-card
**Source:** https://magicui.design/r/client-tweet-card.json
**Install:** `pnpm dlx shadcn@latest add "https://magicui.design/r/client-tweet-card.json"`

Клиентская версия карточки твита с react-tweet.

```tsx
"use client"

import { TweetProps, useTweet } from "react-tweet"
import { MagicTweet, TweetNotFound, TweetSkeleton } from "@/registry/magicui/tweet-card"

export const ClientTweetCard = ({ id, apiUrl, fallback = <TweetSkeleton />, components, fetchOptions, onError, ...props }: TweetProps & { className?: string }) => {
  const { data, error, isLoading } = useTweet(id, apiUrl, fetchOptions)
  if (isLoading) return fallback
  if (error || !data) return <TweetNotFound error={onError ? onError(error) : error} />
  return <MagicTweet tweet={data} {...props} />
}
```

**Dependencies:** `react-tweet`

---

### pulsating-button
**Source:** https://magicui.design/r/pulsating-button.json
**Install:** `pnpm dlx shadcn@latest add "https://magicui.design/r/pulsating-button.json"`

Пульсирующая кнопка для привлечения внимания.

```tsx
import React from "react"
import { cn } from "@/lib/utils"

interface PulsatingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { pulseColor?: string; duration?: string }

export const PulsatingButton = React.forwardRef<HTMLButtonElement, PulsatingButtonProps>(
  ({ className, children, pulseColor = "#808080", duration = "1.5s", ...props }, ref) => (
    <button ref={ref} className={cn("bg-primary text-primary-foreground relative flex cursor-pointer items-center justify-center rounded-lg px-4 py-2", className)}
      style={{ "--pulse-color": pulseColor, "--duration": duration } as React.CSSProperties} {...props}>
      <div className="relative z-10">{children}</div>
      <div className="absolute top-1/2 left-1/2 size-full -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-lg bg-inherit" />
    </button>
  )
)
```

**Dependencies:** None
**CSS:** `@keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 var(--pulse-color) } 50% { box-shadow: 0 0 0 8px var(--pulse-color) } }`

---

### shimmer-button
**Source:** https://magicui.design/r/shimmer-button.json
**Install:** `pnpm dlx shadcn@latest add "https://magicui.design/r/shimmer-button.json"`

Кнопка с мерцающим светом по периметру.

```tsx
import React, { ComponentPropsWithoutRef, CSSProperties } from "react"
import { cn } from "@/lib/utils"

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string; shimmerSize?: string; borderRadius?: string; shimmerDuration?: string; background?: string
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ shimmerColor = "#ffffff", shimmerSize = "0.05em", shimmerDuration = "3s", borderRadius = "100px", background = "rgba(0,0,0,1)", className, children, ...props }, ref) => (
    <button style={{ "--shimmer-color": shimmerColor, "--radius": borderRadius, "--speed": shimmerDuration, "--bg": background } as CSSProperties}
      className={cn("group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border border-white/10 px-6 py-3 text-white [background:var(--bg)]", className)} ref={ref} {...props}>
      <div className="-z-30 blur-[2px] absolute inset-0 overflow-visible">
        <div className="animate-shimmer-slide absolute inset-0">
          <div className="animate-spin-around absolute -inset-full [background:conic-gradient(from_270deg,transparent_0,var(--shimmer-color)_90deg,transparent_90deg)]" />
        </div>
      </div>
      {children}
    </button>
  )
)
```

**Dependencies:** None
**CSS:** shimmer-slide, spin-around keyframes

---

### orbiting-circles
**Source:** https://magicui.design/r/orbiting-circles.json
**Install:** `pnpm dlx shadcn@latest add "https://magicui.design/r/orbiting-circles.json"`

Элементы, движущиеся по круговой орбите.

```tsx
import React from "react"
import { cn } from "@/lib/utils"

export interface OrbitingCirclesProps extends React.HTMLAttributes<HTMLDivElement> {
  reverse?: boolean; duration?: number; radius?: number; path?: boolean; iconSize?: number; speed?: number
}

export function OrbitingCircles({ className, children, reverse, duration = 20, radius = 160, path = true, iconSize = 30, speed = 1, ...props }: OrbitingCirclesProps) {
  const calculatedDuration = duration / speed
  return (
    <>
      {path && <svg className="pointer-events-none absolute inset-0 size-full"><circle className="stroke-black/10 dark:stroke-white/10" cx="50%" cy="50%" r={radius} fill="none" /></svg>}
      {React.Children.map(children, (child, index) => {
        const angle = (360 / React.Children.count(children)) * index
        return <div style={{ "--duration": calculatedDuration, "--radius": radius, "--angle": angle, "--icon-size": `${iconSize}px` } as React.CSSProperties}
          className={cn("animate-orbit absolute flex size-[var(--icon-size)] items-center justify-center rounded-full", { "[animation-direction:reverse]": reverse }, className)} {...props}>{child}</div>
      })}
    </>
  )
}
```

**Dependencies:** None
**CSS:** `@keyframes orbit { 0% { transform: rotate(var(--angle)) translateY(var(--radius)) rotate(-var(--angle)) } 100% { ... + 360deg } }`

---

### hyper-text
**Source:** https://magicui.design/r/hyper-text.json
**Install:** `pnpm dlx shadcn@latest add "https://magicui.design/r/hyper-text.json"`

Анимация текста со скремблингом букв перед раскрытием.

```tsx
"use client"

import { motion } from "motion/react"
import { useEffect, useState } from "react"

interface HyperTextProps { text: string; duration?: number; className?: string; animateOnLoad?: boolean }

export function HyperText({ text, duration = 800, className, animateOnLoad = true }: HyperTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isAnimating, setIsAnimating] = useState(false)
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  useEffect(() => {
    if (!animateOnLoad) return
    setIsAnimating(true)
    let iteration = 0
    const interval = setInterval(() => {
      setDisplayText(text.split("").map((letter, i) => i < iteration ? text[i] : alphabets[Math.floor(Math.random() * 26)]).join(""))
      if (iteration >= text.length) { clearInterval(interval); setIsAnimating(false) }
      iteration += 1/3
    }, duration / text.length)
    return () => clearInterval(interval)
  }, [text, duration, animateOnLoad])

  return <motion.span className={className}>{displayText}</motion.span>
}
```

**Dependencies:** `motion`

---

### animated-beam
**Source:** https://magicui.design/r/animated-beam.json
**Install:** `pnpm dlx shadcn@latest add "https://magicui.design/r/animated-beam.json"`

Анимированный луч света, движущийся по пути между элементами.

```tsx
"use client"

import { motion } from "motion/react"
import { RefObject, useEffect, useId, useState } from "react"

interface AnimatedBeamProps { containerRef: RefObject<HTMLElement>; fromRef: RefObject<HTMLElement>; toRef: RefObject<HTMLElement>; curvature?: number; duration?: number; gradientStartColor?: string; gradientStopColor?: string }

export function AnimatedBeam({ containerRef, fromRef, toRef, curvature = 0, duration = 2, gradientStartColor = "#ffaa40", gradientStopColor = "#9c40ff" }: AnimatedBeamProps) {
  const id = useId()
  const [pathD, setPathD] = useState("")

  useEffect(() => {
    const updatePath = () => {
      if (!containerRef.current || !fromRef.current || !toRef.current) return
      const containerRect = containerRef.current.getBoundingClientRect()
      const fromRect = fromRef.current.getBoundingClientRect()
      const toRect = toRef.current.getBoundingClientRect()
      // Calculate path between elements
      setPathD(`M ${fromX},${fromY} Q ${midX + curvature},${midY} ${toX},${toY}`)
    }
    updatePath(); window.addEventListener("resize", updatePath)
    return () => window.removeEventListener("resize", updatePath)
  }, [containerRef, fromRef, toRef, curvature])

  return (
    <svg className="pointer-events-none absolute inset-0 size-full">
      <path d={pathD} stroke={`url(#${id})`} strokeWidth="2" fill="none" />
      <defs><linearGradient id={id}><stop stopColor={gradientStartColor}><animate attributeName="offset" from="0" to="1" dur={`${duration}s`} repeatCount="indefinite" /></stop></linearGradient></defs>
    </svg>
  )
}
```

**Dependencies:** `motion`

---

### cool-mode
**Source:** https://magicui.design/r/cool-mode.json
**Install:** `pnpm dlx shadcn@latest add "https://magicui.design/r/cool-mode.json"`

Эффект конфетти/частиц при клике на элемент.

```tsx
"use client"

import React, { useRef, useCallback } from "react"

export interface CoolModeProps { children: React.ReactElement; particleImages?: string[]; particleCount?: number; distance?: number; speed?: number }

export function CoolMode({ children, particleImages, particleCount = 20, distance = 100, speed = 0.8 }: CoolModeProps) {
  const ref = useRef<HTMLElement>(null)

  const handleClick = useCallback((e: MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    // Create particles with random angles and distances
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.style.cssText = `position:fixed;pointer-events:none;z-index:9999;left:${e.clientX}px;top:${e.clientY}px`
      // Animate particle with random direction
      document.body.appendChild(particle)
      setTimeout(() => particle.remove(), 1000)
    }
  }, [particleCount, distance])

  return React.cloneElement(children, { ref, onClick: handleClick })
}
```

**Dependencies:** None

---

### neon-gradient-card
**Source:** https://magicui.design/r/neon-gradient-card.json
**Install:** `pnpm dlx shadcn@latest add "https://magicui.design/r/neon-gradient-card.json"`

Карточка с неоновым градиентным свечением.

```tsx
import { cn } from "@/lib/utils"
import React from "react"

interface NeonGradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  borderSize?: number; borderRadius?: number; neonColors?: { firstColor: string; secondColor: string }
}

export function NeonGradientCard({ className, children, borderSize = 2, borderRadius = 20, neonColors = { firstColor: "#ff00aa", secondColor: "#00FFF1" }, ...props }: NeonGradientCardProps) {
  return (
    <div className={cn("relative z-10 rounded-[var(--border-radius)] overflow-hidden", className)}
      style={{ "--border-size": `${borderSize}px`, "--border-radius": `${borderRadius}px`, "--neon-first-color": neonColors.firstColor, "--neon-second-color": neonColors.secondColor } as React.CSSProperties} {...props}>
      <div className="absolute inset-0 -z-10 animate-background-position-spin" style={{ background: `linear-gradient(90deg, var(--neon-first-color), var(--neon-second-color), var(--neon-first-color))`, backgroundSize: "200%" }} />
      <div className="rounded-[calc(var(--border-radius)-var(--border-size))] m-[var(--border-size)] bg-background">{children}</div>
    </div>
  )
}
```

**Dependencies:** None
**CSS:** `@keyframes background-position-spin { 0% { background-position: 0% } 100% { background-position: 200% } }`

---

### animated-circular-progress-bar
**Source:** https://magicui.design/r/animated-circular-progress-bar.json
**Install:** `pnpm dlx shadcn@latest add "https://magicui.design/r/animated-circular-progress-bar.json"`

Круговой прогресс-бар с анимацией.

```tsx
import { cn } from "@/lib/utils"

interface AnimatedCircularProgressBarProps { max?: number; min?: number; value: number; gaugePrimaryColor: string; gaugeSecondaryColor: string; className?: string }

export function AnimatedCircularProgressBar({ max = 100, min = 0, value = 0, gaugePrimaryColor, gaugeSecondaryColor, className }: AnimatedCircularProgressBarProps) {
  const circumference = 2 * Math.PI * 45
  const currentPercent = Math.round(((value - min) / (max - min)) * 100)

  return (
    <div className={cn("relative size-40 text-2xl font-semibold", className)} style={{ "--circumference": circumference, "--percent-to-px": `${circumference / 100}px` } as React.CSSProperties}>
      <svg fill="none" className="size-full" strokeWidth="2" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" strokeWidth="10" style={{ stroke: gaugeSecondaryColor, strokeDasharray: `calc(${90 - currentPercent} * var(--percent-to-px)) var(--circumference)` }} />
        <circle cx="50" cy="50" r="45" strokeWidth="10" style={{ stroke: gaugePrimaryColor, strokeDasharray: `calc(${currentPercent} * var(--percent-to-px)) var(--circumference)`, transition: "1s ease" }} />
      </svg>
      <span className="absolute inset-0 m-auto size-fit">{currentPercent}</span>
    </div>
  )
}
```

**Dependencies:** None

---

### file-tree
**Source:** https://magicui.design/r/file-tree.json
**Install:** `pnpm dlx shadcn@latest add "https://magicui.design/r/file-tree.json"`

Дерево файлов и папок.

```tsx
import { cn } from "@/lib/utils"
import React from "react"

interface TreeNode { name: string; children?: TreeNode[]; icon?: React.ReactNode }

export function FileTree({ data, className }: { data: TreeNode[]; className?: string }) {
  return (
    <div className={cn("font-mono text-sm", className)}>
      {data.map((node, i) => <TreeNodeComponent key={i} node={node} level={0} />)}
    </div>
  )
}

function TreeNodeComponent({ node, level }: { node: TreeNode; level: number }) {
  const [isOpen, setIsOpen] = React.useState(true)
  const hasChildren = node.children && node.children.length > 0
  return (
    <div style={{ paddingLeft: `${level * 16}px` }}>
      <div onClick={() => hasChildren && setIsOpen(!isOpen)} className={cn("flex items-center gap-2 py-1", hasChildren && "cursor-pointer")}>
        {hasChildren ? (isOpen ? "📂" : "📁") : "📄"}{node.name}
      </div>
      {isOpen && node.children?.map((child, i) => <TreeNodeComponent key={i} node={child} level={level + 1} />)}
    </div>
  )
}
```

**Dependencies:** None

---

### hero-video-dialog
**Source:** https://magicui.design/r/hero-video-dialog.json
**Install:** `pnpm dlx shadcn@latest add "https://magicui.design/r/hero-video-dialog.json"`

Диалог с видео для hero-секции.

```tsx
"use client"

import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface HeroVideoDialogProps { videoSrc: string; thumbnailSrc: string; thumbnailAlt?: string; className?: string }

export function HeroVideoDialog({ videoSrc, thumbnailSrc, thumbnailAlt = "Video thumbnail", className }: HeroVideoDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className={cn("relative cursor-pointer group", className)} onClick={() => setIsOpen(true)}>
        <img src={thumbnailSrc} alt={thumbnailAlt} className="w-full h-auto rounded-xl" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-primary/80 rounded-full p-4 group-hover:scale-110 transition-transform">▶</div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="max-w-4xl w-full mx-4">
              <video src={videoSrc} controls autoPlay className="w-full rounded-xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```


**Dependencies:** `motion`

---

### text-reveal
**Source:** https://magicui.design/r/text-reveal.json
**Install:** `pnpm dlx shadcn@latest add "https://magicui.design/r/text-reveal.json"`

Появление текста при скролле страницы.

```tsx
"use client"

import { ComponentPropsWithoutRef, FC, ReactNode, useRef } from "react"
import { motion, MotionValue, useScroll, useTransform } from "motion/react"
import { cn } from "@/lib/utils"

export interface TextRevealProps extends ComponentPropsWithoutRef<"div"> { children: string }

export const TextReveal: FC<TextRevealProps> = ({ children, className }) => {
  const targetRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: targetRef })
  const words = children.split(" ")

  return (
    <div ref={targetRef} className={cn("relative z-0 h-[200vh]", className)}>
      <div className="sticky top-0 mx-auto flex h-[50%] max-w-4xl items-center px-[1rem] py-[5rem]">
        <span className="flex flex-wrap text-2xl font-bold text-black/20 md:text-3xl lg:text-4xl dark:text-white/20">
          {words.map((word, i) => {
            const start = i / words.length, end = start + 1 / words.length
            return <Word key={i} progress={scrollYProgress} range={[start, end]}>{word}</Word>
          })}
        </span>
      </div>
    </div>
  )
}

const Word: FC<{ children: ReactNode; progress: MotionValue<number>; range: [number, number] }> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1])
  return <span className="relative mx-1"><span className="absolute opacity-30">{children}</span><motion.span style={{ opacity }} className="text-black dark:text-white">{children}</motion.span></span>
}
```

**Dependencies:** `motion`

---

### animated-grid-pattern
**Source:** https://magicui.design/r/animated-grid-pattern.json
**Install:** `pnpm dlx shadcn@latest add "https://magicui.design/r/animated-grid-pattern.json"`

Анимированный SVG-паттерн сетки с мерцающими квадратами.

```tsx
"use client"

import { ComponentPropsWithoutRef, useEffect, useId, useRef, useState } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export interface AnimatedGridPatternProps extends ComponentPropsWithoutRef<"svg"> {
  width?: number; height?: number; numSquares?: number; maxOpacity?: number; duration?: number
}

export function AnimatedGridPattern({ width = 40, height = 40, numSquares = 50, className, maxOpacity = 0.5, duration = 4, ...props }: AnimatedGridPatternProps) {
  const id = useId()
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [squares, setSquares] = useState(() => Array.from({ length: numSquares }, (_, i) => ({ id: i, pos: [0, 0] })))

  useEffect(() => { /* Generate random positions for squares */ }, [dimensions, numSquares])

  return (
    <svg ref={containerRef} className={cn("pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30", className)} {...props}>
      <defs><pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse"><path d={`M.5 ${height}V.5H${width}`} fill="none" /></pattern></defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      {squares.map(({ pos: [x, y], id }, index) => (
        <motion.rect key={index} initial={{ opacity: 0 }} animate={{ opacity: maxOpacity }}
          transition={{ duration, repeat: 1, delay: index * 0.1, repeatType: "reverse" }}
          width={width - 1} height={height - 1} x={x * width + 1} y={y * height + 1} fill="currentColor" />
      ))}
    </svg>
  )
}
```

**Dependencies:** `motion`

---

### shiny-button
**Source:** https://magicui.design/r/shiny-button.json
**Install:** `pnpm dlx shadcn@latest add "https://magicui.design/r/shiny-button.json"`

Кнопка с блестящим эффектом и маской.

```tsx
"use client"

import React from "react"
import { motion, type MotionProps } from "motion/react"
import { cn } from "@/lib/utils"

const animationProps: MotionProps = {
  initial: { "--x": "100%", scale: 0.8 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.95 },
  transition: { repeat: Infinity, repeatType: "loop", repeatDelay: 1, type: "spring", stiffness: 20, damping: 15 }
}

export const ShinyButton = React.forwardRef<HTMLButtonElement, { children: React.ReactNode; className?: string }>(
  ({ children, className, ...props }, ref) => (
    <motion.button ref={ref} className={cn("relative cursor-pointer rounded-lg border px-6 py-2 font-medium backdrop-blur-xl", className)} {...animationProps} {...props}>
      <span className="relative block text-sm tracking-wide uppercase" style={{ maskImage: "linear-gradient(-75deg,var(--primary) calc(var(--x)+20%),transparent calc(var(--x)+30%),var(--primary) calc(var(--x)+100%))" }}>{children}</span>
    </motion.button>
  )
)
```

**Dependencies:** `motion`

---

### warp-background
**Source:** https://magicui.design/r/warp-background.json
**Install:** `pnpm dlx shadcn@latest add "https://magicui.design/r/warp-background.json"`

Карточка с эффектом искажения времени на фоне.

```tsx
"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface WarpBackgroundProps { children: React.ReactNode; className?: string }

export function WarpBackground({ children, className }: WarpBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      <motion.div className="absolute inset-0 -z-10" animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ background: "radial-gradient(circle at 50% 50%, var(--primary) 0%, transparent 50%)", backgroundSize: "200% 200%" }} />
      {children}
    </div>
  )
}
```

**Dependencies:** `motion`

---

### icon-cloud
**Source:** https://magicui.design/r/icon-cloud.json
**Install:** `pnpm dlx shadcn@latest add "https://magicui.design/r/icon-cloud.json"`

Интерактивное 3D облако иконок.

```tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface IconCloudProps { icons: string[]; className?: string }

export function IconCloud({ icons, className }: IconCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientY - rect.top - rect.height / 2) / 10
      const y = (e.clientX - rect.left - rect.width / 2) / 10
      setRotation({ x, y })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div ref={containerRef} className={cn("relative w-full h-64 perspective-1000", className)}>
      <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`, transformStyle: "preserve-3d" }}>
        {icons.map((icon, i) => {
          const angle = (i / icons.length) * 2 * Math.PI, radius = 100
          return <img key={i} src={icon} className="absolute w-10 h-10" style={{ transform: `translate3d(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px, ${Math.sin(i) * 50}px)` }} />
        })}
      </div>
    </div>
  )
}
```

**Dependencies:** None

---

### spinning-text
**Source:** https://magicui.design/r/spinning-text.json
**Install:** `pnpm dlx shadcn@latest add "https://magicui.design/r/spinning-text.json"`

Текст, вращающийся по кругу.

```tsx
"use client"

import React, { ComponentPropsWithoutRef } from "react"
import { motion, Transition, Variants } from "motion/react"
import { cn } from "@/lib/utils"

interface SpinningTextProps extends ComponentPropsWithoutRef<"div"> {
  children: string | string[]; duration?: number; reverse?: boolean; radius?: number
}

export function SpinningText({ children, duration = 10, reverse = false, radius = 5, className }: SpinningTextProps) {
  const letters = (Array.isArray(children) ? children.join("") : children).split("")
  letters.push(" ")

  return (
    <motion.div className={cn("relative", className)} initial="hidden" animate="visible"
      variants={{ visible: { rotate: reverse ? -360 : 360 } }}
      transition={{ repeat: Infinity, ease: "linear", duration }}>
      {letters.map((letter, index) => (
        <motion.span key={index} className="absolute top-1/2 left-1/2 inline-block"
          style={{ "--index": index, "--total": letters.length, "--radius": radius,
            transform: `translate(-50%, -50%) rotate(calc(360deg / var(--total) * var(--index))) translateY(calc(var(--radius) * -1ch))` } as React.CSSProperties}>
          {letter}
        </motion.span>
      ))}
    </motion.div>
  )
}
```

**Dependencies:** `motion`

---

### lens
**Source:** https://magicui.design/r/lens.json
**Install:** `pnpm dlx shadcn@latest add "https://magicui.design/r/lens.json"`

Интерактивная лупа для увеличения изображений и видео.

```tsx
"use client"

import React, { useCallback, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useMotionTemplate } from "motion/react"

interface LensProps { children: React.ReactNode; zoomFactor?: number; lensSize?: number; lensColor?: string }

export function Lens({ children, zoomFactor = 1.3, lensSize = 170, lensColor = "black" }: LensProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  const maskImage = useMotionTemplate`radial-gradient(circle ${lensSize / 2}px at ${mousePosition.x}px ${mousePosition.y}px, ${lensColor} 100%, transparent 100%)`

  return (
    <div className="relative z-20 overflow-hidden rounded-xl" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} onMouseMove={handleMouseMove}>
      {children}
      <AnimatePresence>
        {isHovering && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 overflow-hidden" style={{ maskImage, WebkitMaskImage: maskImage, zIndex: 50 }}>
            <div style={{ transform: `scale(${zoomFactor})`, transformOrigin: `${mousePosition.x}px ${mousePosition.y}px` }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

**Dependencies:** `motion`

---

### scroll-based-velocity
**Source:** https://magicui.design/r/scroll-based-velocity.json
**Install:** `pnpm dlx shadcn@latest add "https://magicui.design/r/scroll-based-velocity.json"`

Прокручивающийся текст, скорость которого зависит от скорости скролла.

```tsx
"use client"

import { useRef } from "react"
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "motion/react"
import { cn } from "@/lib/utils"

interface VelocityScrollProps { children: string; defaultVelocity?: number; className?: string }

export function VelocityScroll({ children, defaultVelocity = 5, className }: VelocityScrollProps) {
  const baseVelocity = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false })

  const x = useMotionValue(0)
  const directionFactor = useRef(1)

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * defaultVelocity * (delta / 1000)
    if (velocityFactor.get() < 0) directionFactor.current = -1
    else if (velocityFactor.get() > 0) directionFactor.current = 1
    moveBy += directionFactor.current * moveBy * velocityFactor.get()
    x.set(x.get() + moveBy)
  })

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div className={cn("flex gap-4", className)} style={{ x }}>
        {[...Array(4)].map((_, i) => <span key={i}>{children}</span>)}
      </motion.div>
    </div>
  )
}
```

**Dependencies:** `motion`

---

### flickering-grid
**Source:** https://magicui.design/r/flickering-grid.json
**Install:** `pnpm dlx shadcn@latest add "https://magicui.design/r/flickering-grid.json"`

Мерцающая SVG-сетка для фона.

```tsx
"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface FlickeringGridProps { squareSize?: number; gridGap?: number; flickerChance?: number; color?: string; className?: string }

export function FlickeringGrid({ squareSize = 4, gridGap = 6, flickerChance = 0.3, color = "rgb(0, 0, 0)", className }: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isInView, setIsInView] = useState(false)

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const cols = Math.ceil(canvas.width / (squareSize + gridGap))
    const rows = Math.ceil(canvas.height / (squareSize + gridGap))
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (Math.random() > flickerChance) {
          ctx.fillStyle = color
          ctx.globalAlpha = Math.random() * 0.5 + 0.25
          ctx.fillRect(i * (squareSize + gridGap), j * (squareSize + gridGap), squareSize, squareSize)
        }
      }
    }
  }, [squareSize, gridGap, flickerChance, color])

  useEffect(() => { if (isInView) { const interval = setInterval(draw, 100); return () => clearInterval(interval) } }, [isInView, draw])

  return <canvas ref={canvasRef} className={cn("size-full pointer-events-none", className)} />
}
```

**Dependencies:** None

---

## 📊 Statistics

**Community Components Added:** 58
**MagicUI Effects Added:** 52
**Total in Part 2:** 110 components
**Combined Total (Part 1 + Part 2):** ~408 components

---

