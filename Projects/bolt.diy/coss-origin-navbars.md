# COSS Origin — Navbars

Собрано из origin registry (coss.com). Формат совместим с парсером bolt.diy `app/lib/services/component-index.ts`.

## Navigation

### COSS Origin navbar (saas): account (comp-577)

#### registry/default/components/comp-577.tsx

```tsx
import Logo from "@/registry/default/components/navbar-components/logo";
import { Button } from "@/registry/default/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/registry/default/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { active: true, href: "#", label: "Home" },
  { href: "#", label: "Features" },
  { href: "#", label: "Pricing" },
  { href: "#", label: "About" },
];

export default function Component() {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                size="icon"
                variant="ghost"
              >
                <svg
                  className="pointer-events-none"
                  fill="none"
                  height={16}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="-translate-y-[7px] origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
                    d="M4 12L20 12"
                  />
                  <path
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    d="M4 12H20"
                  />
                  <path
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
                    d="M4 12H20"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, _index) => (
                    <NavigationMenuItem className="w-full" key={link.label}>
                      <NavigationMenuLink
                        active={link.active}
                        className="py-1.5"
                        href={link.href}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <a className="text-primary hover:text-primary/90" href="#">
              <Logo />
            </a>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, _index) => (
                  <NavigationMenuItem key={link.label}>
                    <NavigationMenuLink
                      active={link.active}
                      className="py-1.5 font-medium text-muted-foreground hover:text-primary"
                      href={link.href}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button asChild className="text-sm" size="sm" variant="ghost">
            <a href="#">Sign In</a>
          </Button>
          <Button asChild className="text-sm" size="sm">
            <a href="#">Get Started</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
```

### COSS Origin navbar (ecommerce): account (comp-578)

#### registry/default/components/comp-578.tsx

```tsx
import { BookOpenIcon, InfoIcon, LifeBuoyIcon } from "lucide-react";

import Logo from "@/registry/default/components/navbar-components/logo";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/registry/default/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "#", label: "Home" },
  {
    items: [
      {
        description: "Browse all components in the library.",
        href: "#",
        label: "Components",
      },
      {
        description: "Learn how to use the library.",
        href: "#",
        label: "Documentation",
      },
      {
        description: "Pre-built layouts for common use cases.",
        href: "#",
        label: "Templates",
      },
    ],
    label: "Features",
    submenu: true,
    type: "description",
  },
  {
    items: [
      { href: "#", label: "Product A" },
      { href: "#", label: "Product B" },
      { href: "#", label: "Product C" },
      { href: "#", label: "Product D" },
    ],
    label: "Pricing",
    submenu: true,
    type: "simple",
  },
  {
    items: [
      { href: "#", icon: "BookOpenIcon", label: "Getting Started" },
      { href: "#", icon: "LifeBuoyIcon", label: "Tutorials" },
      { href: "#", icon: "InfoIcon", label: "About Us" },
    ],
    label: "About",
    submenu: true,
    type: "icon",
  },
];

export default function Component() {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                size="icon"
                variant="ghost"
              >
                <svg
                  className="pointer-events-none"
                  fill="none"
                  height={16}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="-translate-y-[7px] origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
                    d="M4 12L20 12"
                  />
                  <path
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    d="M4 12H20"
                  />
                  <path
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
                    d="M4 12H20"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem className="w-full" key={link.label}>
                      {link.submenu ? (
                        <>
                          <div className="px-2 py-1.5 font-medium text-muted-foreground text-xs">
                            {link.label}
                          </div>
                          <ul>
                            {link.items.map((item, _itemIndex) => (
                              <li key={item.label}>
                                <NavigationMenuLink
                                  className="py-1.5"
                                  href={item.href}
                                >
                                  {item.label}
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <NavigationMenuLink className="py-1.5" href={link.href}>
                          {link.label}
                        </NavigationMenuLink>
                      )}
                      {/* Add separator between different types of items */}
                      {index < navigationLinks.length - 1 &&
                        // Show separator if:
                        // 1. One is submenu and one is simple link OR
                        // 2. Both are submenus but with different types
                        ((!link.submenu &&
                          navigationLinks[index + 1].submenu) ||
                          (link.submenu &&
                            !navigationLinks[index + 1].submenu) ||
                          (link.submenu &&
                            navigationLinks[index + 1].submenu &&
                            link.type !== navigationLinks[index + 1].type)) && (
                          <div
                            aria-orientation="horizontal"
                            className="-mx-1 my-1 h-px w-full bg-border"
                            role="separator"
                            tabIndex={-1}
                          />
                        )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <a className="text-primary hover:text-primary/90" href="#">
              <Logo />
            </a>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden" viewport={false}>
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link) => (
                  <NavigationMenuItem key={link.label}>
                    {link.submenu ? (
                      <>
                        <NavigationMenuTrigger className="*:[svg]:-me-0.5 bg-transparent px-2 py-1.5 font-medium text-muted-foreground hover:text-primary *:[svg]:size-3.5">
                          {link.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="data-[motion=from-end]:slide-in-from-right-16! data-[motion=from-start]:slide-in-from-left-16! data-[motion=to-end]:slide-out-to-right-16! data-[motion=to-start]:slide-out-to-left-16! z-50 p-1">
                          <ul
                            className={cn(
                              link.type === "description"
                                ? "min-w-64"
                                : "min-w-48",
                            )}
                          >
                            {link.items.map((item) => (
                              <li key={item.label}>
                                <NavigationMenuLink
                                  className="py-1.5"
                                  href={item.href}
                                >
                                  {/* Display icon if present */}
                                  {link.type === "icon" && "icon" in item && (
                                    <div className="flex items-center gap-2">
                                      {item.icon === "BookOpenIcon" && (
                                        <BookOpenIcon
                                          aria-hidden="true"
                                          className="text-foreground opacity-60"
                                          size={16}
                                        />
                                      )}
                                      {item.icon === "LifeBuoyIcon" && (
                                        <LifeBuoyIcon
                                          aria-hidden="true"
                                          className="text-foreground opacity-60"
                                          size={16}
                                        />
                                      )}
                                      {item.icon === "InfoIcon" && (
                                        <InfoIcon
                                          aria-hidden="true"
                                          className="text-foreground opacity-60"
                                          size={16}
                                        />
                                      )}
                                      <span>{item.label}</span>
                                    </div>
                                  )}

                                  {/* Display label with description if present */}
                                  {link.type === "description" &&
                                  "description" in item ? (
                                    <div className="space-y-1">
                                      <div className="font-medium">
                                        {item.label}
                                      </div>
                                      <p className="line-clamp-2 text-muted-foreground text-xs">
                                        {item.description}
                                      </p>
                                    </div>
                                  ) : (
                                    // Display simple label if not icon or description type
                                    !link.type ||
                                    (link.type !== "icon" &&
                                      link.type !== "description" && (
                                        <span>{item.label}</span>
                                      ))
                                  )}
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink
                        className="py-1.5 font-medium text-muted-foreground hover:text-primary"
                        href={link.href}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button asChild className="text-sm" size="sm" variant="ghost">
            <a href="#">Sign In</a>
          </Button>
          <Button asChild className="text-sm" size="sm">
            <a href="#">Get Started</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
```

#### registry/default/components/navbar-components/logo.tsx

```tsx
export default function Logo() {
  return (
    <svg
      fill="currentColor"
      height="33"
      width="33"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.46 1.766 17.303.923l-2.66 9.896-2.403-8.934-3.157.843 2.595 9.652-6.464-6.442-2.311 2.304 7.09 7.066-8.83-2.358-.846 3.146 9.648 2.577a6.516 6.516 0 0 1-.169-1.478c0-3.598 2.927-6.515 6.537-6.515s6.537 2.917 6.537 6.515c0 .505-.057.997-.167 1.468l8.768 2.342.846-3.147-9.686-2.586 8.83-2.358-.845-3.147-9.686 2.587 6.464-6.442-2.311-2.304-6.992 6.969 2.369-8.81Z" />
      <path d="M22.695 18.7a6.495 6.495 0 0 1-1.626 2.986l6.352 6.33 2.31-2.303-7.036-7.013ZM21.005 21.752a6.538 6.538 0 0 1-2.922 1.722l2.312 8.596 3.157-.843-2.547-9.475ZM17.965 23.505a6.569 6.569 0 0 1-1.632.205 6.566 6.566 0 0 1-1.743-.235l-2.314 8.605 3.157.843 2.532-9.418ZM14.478 23.444a6.54 6.54 0 0 1-2.87-1.747l-6.367 6.346 2.31 2.303 6.927-6.902ZM11.555 21.64a6.492 6.492 0 0 1-1.585-2.948L1.173 21.04l.846 3.146 9.536-2.546Z" />
    </svg>
  );
}
```

### COSS Origin navbar (saas): account (comp-579)

#### registry/default/components/comp-579.tsx

```tsx
import Logo from "@/registry/default/components/navbar-components/logo";
import { Button } from "@/registry/default/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/registry/default/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { active: true, href: "#", label: "Home" },
  { href: "#", label: "Features" },
  { href: "#", label: "Pricing" },
  { href: "#", label: "About" },
];

export default function Component() {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 justify-between gap-4">
        {/* Left side */}
        <div className="flex gap-2">
          <div className="flex items-center md:hidden">
            {/* Mobile menu trigger */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="group size-8" size="icon" variant="ghost">
                  <svg
                    className="pointer-events-none"
                    fill="none"
                    height={16}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width={16}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="-translate-y-[7px] origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
                      d="M4 12L20 12"
                    />
                    <path
                      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                      d="M4 12H20"
                    />
                    <path
                      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
                      d="M4 12H20"
                    />
                  </svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-36 p-1 md:hidden">
                <NavigationMenu className="max-w-none *:w-full">
                  <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                    {navigationLinks.map((link, index) => (
                      <NavigationMenuItem
                        className="w-full"
                        key={String(index)}
                      >
                        <NavigationMenuLink
                          data-active={link.active ? "" : undefined}
                          className="py-1.5"
                          href={link.href}
                        >
                          {link.label}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>
          </div>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <a className="text-primary hover:text-primary/90" href="#">
              <Logo />
            </a>
            {/* Navigation menu */}
            <NavigationMenu className="h-full *:h-full max-md:hidden">
              <NavigationMenuList className="h-full gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem className="h-full" key={String(index)}>
                    <NavigationMenuLink
                      data-active={link.active ? "" : undefined}
                      className="h-full justify-center rounded-none border-transparent border-y-2 py-1.5 font-medium text-muted-foreground hover:border-b-primary hover:bg-transparent hover:text-primary data-[active]:border-b-primary data-[active]:bg-transparent!"
                      href={link.href}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button asChild className="text-sm" size="sm" variant="ghost">
            <a href="#">Sign In</a>
          </Button>
          <Button asChild className="text-sm" size="sm">
            <a href="#">Get Started</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
```

#### registry/default/components/navbar-components/logo.tsx

```tsx
export default function Logo() {
  return (
    <svg
      fill="currentColor"
      height="33"
      width="33"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.46 1.766 17.303.923l-2.66 9.896-2.403-8.934-3.157.843 2.595 9.652-6.464-6.442-2.311 2.304 7.09 7.066-8.83-2.358-.846 3.146 9.648 2.577a6.516 6.516 0 0 1-.169-1.478c0-3.598 2.927-6.515 6.537-6.515s6.537 2.917 6.537 6.515c0 .505-.057.997-.167 1.468l8.768 2.342.846-3.147-9.686-2.586 8.83-2.358-.845-3.147-9.686 2.587 6.464-6.442-2.311-2.304-6.992 6.969 2.369-8.81Z" />
      <path d="M22.695 18.7a6.495 6.495 0 0 1-1.626 2.986l6.352 6.33 2.31-2.303-7.036-7.013ZM21.005 21.752a6.538 6.538 0 0 1-2.922 1.722l2.312 8.596 3.157-.843-2.547-9.475ZM17.965 23.505a6.569 6.569 0 0 1-1.632.205 6.566 6.566 0 0 1-1.743-.235l-2.314 8.605 3.157.843 2.532-9.418ZM14.478 23.444a6.54 6.54 0 0 1-2.87-1.747l-6.367 6.346 2.31 2.303 6.927-6.902ZM11.555 21.64a6.492 6.492 0 0 1-1.585-2.948L1.173 21.04l.846 3.146 9.536-2.546Z" />
    </svg>
  );
}
```

### COSS Origin navbar (ecommerce): cart, search, account (comp-580)

#### registry/default/components/comp-580.tsx

```tsx
import { SearchIcon } from "lucide-react";
import { useId } from "react";

import Logo from "@/registry/default/components/navbar-components/logo";
import { Button } from "@/registry/default/ui/button";
import { Input } from "@/registry/default/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/registry/default/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "#", label: "Products" },
  { href: "#", label: "Categories" },
  { href: "#", label: "Deals" },
];

export default function Component() {
  const id = useId();

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                size="icon"
                variant="ghost"
              >
                <svg
                  className="pointer-events-none"
                  fill="none"
                  height={16}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="-translate-y-[7px] origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
                    d="M4 12L20 12"
                  />
                  <path
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    d="M4 12H20"
                  />
                  <path
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
                    d="M4 12H20"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link) => (
                    <NavigationMenuItem className="w-full" key={link.label}>
                      <NavigationMenuLink className="py-1.5" href={link.href}>
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                  <NavigationMenuItem
                    aria-hidden="true"
                    className="w-full"
                    role="presentation"
                  >
                    <div
                      aria-orientation="horizontal"
                      className="-mx-1 my-1 h-px bg-border"
                      role="separator"
                      tabIndex={-1}
                    />
                  </NavigationMenuItem>
                  <NavigationMenuItem className="w-full">
                    <NavigationMenuLink className="py-1.5" href="#">
                      Sign In
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem className="w-full">
                    <Button
                      asChild
                      className="mt-0.5 w-full text-left text-sm"
                      size="sm"
                    >
                      <span className="flex items-baseline gap-2">
                        Cart
                        <span className="text-primary-foreground/60 text-xs">
                          2
                        </span>
                      </span>
                    </Button>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Main nav */}
          <div className="flex flex-1 items-center gap-6 max-md:justify-between">
            <a className="text-primary hover:text-primary/90" href="#">
              <Logo />
            </a>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link) => (
                  <NavigationMenuItem key={link.label}>
                    <NavigationMenuLink
                      className="py-1.5 font-medium text-muted-foreground hover:text-primary"
                      href={link.href}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            {/* Search form */}
            <div className="relative">
              <Input
                className="peer h-8 ps-8 pe-2"
                id={id}
                placeholder="Search..."
                type="search"
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/80 peer-disabled:opacity-50">
                <SearchIcon size={16} />
              </div>
            </div>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2 max-md:hidden">
          <Button asChild className="text-sm" size="sm" variant="ghost">
            <a href="#">Sign In</a>
          </Button>
          <Button asChild className="text-sm" size="sm">
            <a href="#">
              <span className="flex items-baseline gap-2">
                Cart
                <span className="text-primary-foreground/60 text-xs">2</span>
              </span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
```

#### registry/default/components/navbar-components/logo.tsx

```tsx
export default function Logo() {
  return (
    <svg
      fill="currentColor"
      height="33"
      width="33"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.46 1.766 17.303.923l-2.66 9.896-2.403-8.934-3.157.843 2.595 9.652-6.464-6.442-2.311 2.304 7.09 7.066-8.83-2.358-.846 3.146 9.648 2.577a6.516 6.516 0 0 1-.169-1.478c0-3.598 2.927-6.515 6.537-6.515s6.537 2.917 6.537 6.515c0 .505-.057.997-.167 1.468l8.768 2.342.846-3.147-9.686-2.586 8.83-2.358-.845-3.147-9.686 2.587 6.464-6.442-2.311-2.304-6.992 6.969 2.369-8.81Z" />
      <path d="M22.695 18.7a6.495 6.495 0 0 1-1.626 2.986l6.352 6.33 2.31-2.303-7.036-7.013ZM21.005 21.752a6.538 6.538 0 0 1-2.922 1.722l2.312 8.596 3.157-.843-2.547-9.475ZM17.965 23.505a6.569 6.569 0 0 1-1.632.205 6.566 6.566 0 0 1-1.743-.235l-2.314 8.605 3.157.843 2.532-9.418ZM14.478 23.444a6.54 6.54 0 0 1-2.87-1.747l-6.367 6.346 2.31 2.303 6.927-6.902ZM11.555 21.64a6.492 6.492 0 0 1-1.585-2.948L1.173 21.04l.846 3.146 9.536-2.546Z" />
    </svg>
  );
}
```

### COSS Origin navbar (saas): account (comp-581)

#### registry/default/components/comp-581.tsx

```tsx
import InfoMenu from "@/registry/default/components/navbar-components/info-menu";
import Logo from "@/registry/default/components/navbar-components/logo";
import NotificationMenu from "@/registry/default/components/navbar-components/notification-menu";
import UserMenu from "@/registry/default/components/navbar-components/user-menu";
import { Button } from "@/registry/default/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/registry/default/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "#", label: "Home" },
  { href: "#", label: "Features" },
  { href: "#", label: "Pricing" },
  { href: "#", label: "About" },
];

export default function Component() {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                size="icon"
                variant="ghost"
              >
                <svg
                  className="pointer-events-none"
                  fill="none"
                  height={16}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="-translate-y-[7px] origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
                    d="M4 12L20 12"
                  />
                  <path
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    d="M4 12H20"
                  />
                  <path
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
                    d="M4 12H20"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem className="w-full" key={String(index)}>
                      <NavigationMenuLink className="py-1.5" href={link.href}>
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <a className="text-primary hover:text-primary/90" href="#">
              <Logo />
            </a>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={String(index)}>
                    <NavigationMenuLink
                      className="py-1.5 font-medium text-muted-foreground hover:text-primary"
                      href={link.href}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* Info menu */}
            <InfoMenu />
            {/* Notification */}
            <NotificationMenu />
          </div>
          {/* User menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
```

#### registry/default/components/navbar-components/info-menu.tsx

```tsx
import {
  BookIcon,
  InfoIcon,
  LifeBuoyIcon,
  MessageCircleMoreIcon,
} from "lucide-react";

import { Button } from "@/registry/default/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/registry/default/ui/dropdown-menu";

export default function InfoMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open edit menu"
          className="size-8 rounded-full shadow-none"
          size="icon"
          variant="ghost"
        >
          <InfoIcon
            aria-hidden="true"
            className="text-muted-foreground"
            size={16}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="pb-2">
        <DropdownMenuLabel>Need help?</DropdownMenuLabel>
        <DropdownMenuItem
          asChild
          className="cursor-pointer py-1 focus:bg-transparent focus:underline"
        >
          <a href="#">
            <BookIcon aria-hidden="true" className="opacity-60" size={16} />
            Documentation
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer py-1 focus:bg-transparent focus:underline"
        >
          <a href="#">
            <LifeBuoyIcon aria-hidden="true" className="opacity-60" size={16} />
            Support
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer py-1 focus:bg-transparent focus:underline"
        >
          <a href="#">
            <MessageCircleMoreIcon
              aria-hidden="true"
              className="opacity-60"
              size={16}
            />
            Contact us
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

#### registry/default/components/navbar-components/logo.tsx

```tsx
export default function Logo() {
  return (
    <svg
      fill="currentColor"
      height="33"
      width="33"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.46 1.766 17.303.923l-2.66 9.896-2.403-8.934-3.157.843 2.595 9.652-6.464-6.442-2.311 2.304 7.09 7.066-8.83-2.358-.846 3.146 9.648 2.577a6.516 6.516 0 0 1-.169-1.478c0-3.598 2.927-6.515 6.537-6.515s6.537 2.917 6.537 6.515c0 .505-.057.997-.167 1.468l8.768 2.342.846-3.147-9.686-2.586 8.83-2.358-.845-3.147-9.686 2.587 6.464-6.442-2.311-2.304-6.992 6.969 2.369-8.81Z" />
      <path d="M22.695 18.7a6.495 6.495 0 0 1-1.626 2.986l6.352 6.33 2.31-2.303-7.036-7.013ZM21.005 21.752a6.538 6.538 0 0 1-2.922 1.722l2.312 8.596 3.157-.843-2.547-9.475ZM17.965 23.505a6.569 6.569 0 0 1-1.632.205 6.566 6.566 0 0 1-1.743-.235l-2.314 8.605 3.157.843 2.532-9.418ZM14.478 23.444a6.54 6.54 0 0 1-2.87-1.747l-6.367 6.346 2.31 2.303 6.927-6.902ZM11.555 21.64a6.492 6.492 0 0 1-1.585-2.948L1.173 21.04l.846 3.146 9.536-2.546Z" />
    </svg>
  );
}
```

#### registry/default/components/navbar-components/notification-menu.tsx

```tsx
"use client";

import { BellIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/registry/default/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

const initialNotifications = [
  {
    action: "requested review on",
    id: 1,
    target: "PR #42: Feature implementation",
    timestamp: "15 minutes ago",
    unread: true,
    user: "Chris Tompson",
  },
  {
    action: "shared",
    id: 2,
    target: "New component library",
    timestamp: "45 minutes ago",
    unread: true,
    user: "Emma Davis",
  },
  {
    action: "assigned you to",
    id: 3,
    target: "API integration task",
    timestamp: "4 hours ago",
    unread: false,
    user: "James Wilson",
  },
  {
    action: "replied to your comment in",
    id: 4,
    target: "Authentication flow",
    timestamp: "12 hours ago",
    unread: false,
    user: "Alex Morgan",
  },
  {
    action: "commented on",
    id: 5,
    target: "Dashboard redesign",
    timestamp: "2 days ago",
    unread: false,
    user: "Sarah Chen",
  },
  {
    action: "mentioned you in",
    id: 6,
    target: "coss.com open graph image",
    timestamp: "2 weeks ago",
    unread: false,
    user: "Miky Derya",
  },
];

function Dot({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      height="6"
      viewBox="0 0 6 6"
      width="6"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export default function NotificationMenu() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification,
      ),
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Open notifications"
          className="relative size-8 rounded-full text-muted-foreground shadow-none"
          size="icon"
          variant="ghost"
        >
          <BellIcon aria-hidden="true" size={16} />
          {unreadCount > 0 && (
            <div
              aria-hidden="true"
              className="absolute top-0.5 right-0.5 size-1 rounded-full bg-primary"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-1">
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="font-semibold text-sm">Notifications</div>
          {unreadCount > 0 && (
            <button
              className="font-medium text-xs hover:underline"
              onClick={handleMarkAllAsRead}
              type="button"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div
          aria-orientation="horizontal"
          className="-mx-1 my-1 h-px bg-border"
          role="separator"
          tabIndex={-1}
        />
        {notifications.map((notification) => (
          <div
            className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            key={notification.id}
          >
            <div className="relative flex items-start pe-3">
              <div className="flex-1 space-y-1">
                <button
                  className="text-left text-foreground/80 after:absolute after:inset-0"
                  onClick={() => handleNotificationClick(notification.id)}
                  type="button"
                >
                  <span className="font-medium text-foreground hover:underline">
                    {notification.user}
                  </span>{" "}
                  {notification.action}{" "}
                  <span className="font-medium text-foreground hover:underline">
                    {notification.target}
                  </span>
                  .
                </button>
                <div className="text-muted-foreground text-xs">
                  {notification.timestamp}
                </div>
              </div>
              {notification.unread && (
                <div className="absolute end-0 self-center">
                  <span className="sr-only">Unread</span>
                  <Dot />
                </div>
              )}
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
```

#### registry/default/components/navbar-components/user-menu.tsx

```tsx
import {
  BoltIcon,
  BookOpenIcon,
  Layers2Icon,
  LogOutIcon,
  PinIcon,
  UserPenIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import { Button } from "@/registry/default/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/default/ui/dropdown-menu";

export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-auto p-0 hover:bg-transparent" variant="ghost">
          <Avatar>
            <AvatarImage alt="Profile image" src="/origin/avatar.jpg" />
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-foreground text-sm">
            Keith Kennedy
          </span>
          <span className="truncate font-normal text-muted-foreground text-xs">
            k.kennedy@coss.com
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BoltIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Layers2Icon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 2</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BookOpenIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 3</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PinIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 4</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserPenIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 5</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon aria-hidden="true" className="opacity-60" size={16} />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### COSS Origin navbar (saas): account (comp-582)

#### registry/default/components/comp-582.tsx

```tsx
import {
  FileTextIcon,
  GlobeIcon,
  HomeIcon,
  LayersIcon,
  UsersIcon,
} from "lucide-react";
import { useId } from "react";

import Logo from "@/registry/default/components/navbar-components/logo";
import ThemeToggle from "@/registry/default/components/navbar-components/theme-toggle";
import UserMenu from "@/registry/default/components/navbar-components/user-menu";
import { Button } from "@/registry/default/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/registry/default/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";

// Navigation links with icons for desktop icon-only navigation
const navigationLinks = [
  { active: true, href: "#", icon: HomeIcon, label: "Dashboard" },
  { href: "#", icon: LayersIcon, label: "Projects" },
  { href: "#", icon: FileTextIcon, label: "Documentation" },
  { href: "#", icon: UsersIcon, label: "Team" },
];

// Language options
const languages = [
  { label: "En", value: "en" },
  { label: "Es", value: "es" },
  { label: "Fr", value: "fr" },
  { label: "De", value: "de" },
  { label: "Ja", value: "ja" },
];

export default function Component() {
  const id = useId();

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                size="icon"
                variant="ghost"
              >
                <svg
                  className="pointer-events-none"
                  fill="none"
                  height={16}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="-translate-y-[7px] origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
                    d="M4 12L20 12"
                  />
                  <path
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    d="M4 12H20"
                  />
                  <path
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
                    d="M4 12H20"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, _index) => {
                    const Icon = link.icon;
                    return (
                      <NavigationMenuItem className="w-full" key={link.label}>
                        <NavigationMenuLink
                          active={link.active}
                          className="flex-row items-center gap-2 py-1.5"
                          href={link.href}
                        >
                          <Icon
                            aria-hidden="true"
                            className="text-muted-foreground"
                            size={16}
                          />
                          <span>{link.label}</span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a className="text-primary hover:text-primary/90" href="#">
              <Logo />
            </a>
            {/* Desktop navigation - icon only */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-2">
                <TooltipProvider>
                  {navigationLinks.map((link) => (
                    <NavigationMenuItem key={link.label}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <NavigationMenuLink
                            className="flex size-8 items-center justify-center p-1.5"
                            href={link.href}
                          >
                            <link.icon aria-hidden="true" size={20} />
                            <span className="sr-only">{link.label}</span>
                          </NavigationMenuLink>
                        </TooltipTrigger>
                        <TooltipContent
                          className="px-2 py-1 text-xs"
                          side="bottom"
                        >
                          <p>{link.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </NavigationMenuItem>
                  ))}
                </TooltipProvider>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <ThemeToggle />
          {/* Language selector */}
          <Select defaultValue="en">
            <SelectTrigger
              aria-label="Select language"
              className="h-8 border-none px-2 shadow-none hover:bg-accent hover:text-accent-foreground [&>svg]:shrink-0 [&>svg]:text-muted-foreground/80"
              id={`language-${id}`}
            >
              <GlobeIcon aria-hidden="true" size={16} />
              <SelectValue className="hidden sm:inline-flex" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  <span className="flex items-center gap-2">
                    <span className="truncate">{lang.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* User menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
```

#### registry/default/components/navbar-components/logo.tsx

```tsx
export default function Logo() {
  return (
    <svg
      fill="currentColor"
      height="33"
      width="33"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.46 1.766 17.303.923l-2.66 9.896-2.403-8.934-3.157.843 2.595 9.652-6.464-6.442-2.311 2.304 7.09 7.066-8.83-2.358-.846 3.146 9.648 2.577a6.516 6.516 0 0 1-.169-1.478c0-3.598 2.927-6.515 6.537-6.515s6.537 2.917 6.537 6.515c0 .505-.057.997-.167 1.468l8.768 2.342.846-3.147-9.686-2.586 8.83-2.358-.845-3.147-9.686 2.587 6.464-6.442-2.311-2.304-6.992 6.969 2.369-8.81Z" />
      <path d="M22.695 18.7a6.495 6.495 0 0 1-1.626 2.986l6.352 6.33 2.31-2.303-7.036-7.013ZM21.005 21.752a6.538 6.538 0 0 1-2.922 1.722l2.312 8.596 3.157-.843-2.547-9.475ZM17.965 23.505a6.569 6.569 0 0 1-1.632.205 6.566 6.566 0 0 1-1.743-.235l-2.314 8.605 3.157.843 2.532-9.418ZM14.478 23.444a6.54 6.54 0 0 1-2.87-1.747l-6.367 6.346 2.31 2.303 6.927-6.902ZM11.555 21.64a6.492 6.492 0 0 1-1.585-2.948L1.173 21.04l.846 3.146 9.536-2.546Z" />
    </svg>
  );
}
```

#### registry/default/components/navbar-components/theme-toggle.tsx

```tsx
"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useState } from "react";

import { Toggle } from "@/registry/default/ui/toggle";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>("light");

  return (
    <div>
      <Toggle
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="group size-8 rounded-full border-none text-muted-foreground shadow-none data-[state=on]:bg-transparent data-[state=on]:text-muted-foreground data-[state=on]:hover:bg-muted data-[state=on]:hover:text-foreground"
        onPressedChange={() =>
          setTheme((prev) => (prev === "dark" ? "light" : "dark"))
        }
        pressed={theme === "dark"}
        variant="outline"
      >
        {/* Note: After dark mode implementation, rely on dark: prefix rather than group-data-[state=on]: */}
        <MoonIcon
          aria-hidden="true"
          className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
          size={16}
        />
        <SunIcon
          aria-hidden="true"
          className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
          size={16}
        />
      </Toggle>
    </div>
  );
}
```

#### registry/default/components/navbar-components/user-menu.tsx

```tsx
import {
  BoltIcon,
  BookOpenIcon,
  Layers2Icon,
  LogOutIcon,
  PinIcon,
  UserPenIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import { Button } from "@/registry/default/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/default/ui/dropdown-menu";

export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-auto p-0 hover:bg-transparent" variant="ghost">
          <Avatar>
            <AvatarImage alt="Profile image" src="/origin/avatar.jpg" />
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-foreground text-sm">
            Keith Kennedy
          </span>
          <span className="truncate font-normal text-muted-foreground text-xs">
            k.kennedy@coss.com
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BoltIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Layers2Icon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 2</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BookOpenIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 3</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PinIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 4</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserPenIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 5</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon aria-hidden="true" className="opacity-60" size={16} />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### COSS Origin navbar (general): account (comp-583)

#### registry/default/components/comp-583.tsx

```tsx
import { ChevronsUpDown } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";

import Logo from "@/registry/default/components/navbar-components/logo";
import NotificationMenu from "@/registry/default/components/navbar-components/notification-menu";
import UserMenu from "@/registry/default/components/navbar-components/user-menu";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/registry/default/ui/breadcrumb";
import { Button } from "@/registry/default/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/default/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/registry/default/ui/select";

export default function Component() {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink className="text-foreground" href="#">
                  <Logo />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator> / </BreadcrumbSeparator>
              <BreadcrumbItem className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger className="hover:text-foreground">
                    <BreadcrumbEllipsis />
                    <span className="sr-only">Toggle menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem asChild>
                      <a href="#">Personal Account</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="#">Projects</a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbItem className="max-md:hidden">
                <BreadcrumbLink href="#">Personal Account</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="max-md:hidden">
                {" "}
                /{" "}
              </BreadcrumbSeparator>
              <BreadcrumbItem className="max-md:hidden">
                <BreadcrumbLink href="#">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator> / </BreadcrumbSeparator>
              <BreadcrumbItem>
                <Select defaultValue="1">
                  <SelectPrimitive.SelectTrigger
                    aria-label="Select project"
                    asChild
                  >
                    <Button
                      className="h-8 px-1.5 text-foreground focus-visible:bg-accent focus-visible:ring-0"
                      variant="ghost"
                    >
                      <SelectValue placeholder="Select project" />
                      <ChevronsUpDown
                        className="text-muted-foreground/80"
                        size={14}
                      />
                    </Button>
                  </SelectPrimitive.SelectTrigger>
                  <SelectContent className="[&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
                    <SelectItem value="1">Main project</SelectItem>
                    <SelectItem value="2">Origin project</SelectItem>
                  </SelectContent>
                </Select>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <NotificationMenu />
          {/* User menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
```

#### registry/default/components/navbar-components/logo.tsx

```tsx
export default function Logo() {
  return (
    <svg
      fill="currentColor"
      height="33"
      width="33"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.46 1.766 17.303.923l-2.66 9.896-2.403-8.934-3.157.843 2.595 9.652-6.464-6.442-2.311 2.304 7.09 7.066-8.83-2.358-.846 3.146 9.648 2.577a6.516 6.516 0 0 1-.169-1.478c0-3.598 2.927-6.515 6.537-6.515s6.537 2.917 6.537 6.515c0 .505-.057.997-.167 1.468l8.768 2.342.846-3.147-9.686-2.586 8.83-2.358-.845-3.147-9.686 2.587 6.464-6.442-2.311-2.304-6.992 6.969 2.369-8.81Z" />
      <path d="M22.695 18.7a6.495 6.495 0 0 1-1.626 2.986l6.352 6.33 2.31-2.303-7.036-7.013ZM21.005 21.752a6.538 6.538 0 0 1-2.922 1.722l2.312 8.596 3.157-.843-2.547-9.475ZM17.965 23.505a6.569 6.569 0 0 1-1.632.205 6.566 6.566 0 0 1-1.743-.235l-2.314 8.605 3.157.843 2.532-9.418ZM14.478 23.444a6.54 6.54 0 0 1-2.87-1.747l-6.367 6.346 2.31 2.303 6.927-6.902ZM11.555 21.64a6.492 6.492 0 0 1-1.585-2.948L1.173 21.04l.846 3.146 9.536-2.546Z" />
    </svg>
  );
}
```

#### registry/default/components/navbar-components/notification-menu.tsx

```tsx
"use client";

import { BellIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/registry/default/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

const initialNotifications = [
  {
    action: "requested review on",
    id: 1,
    target: "PR #42: Feature implementation",
    timestamp: "15 minutes ago",
    unread: true,
    user: "Chris Tompson",
  },
  {
    action: "shared",
    id: 2,
    target: "New component library",
    timestamp: "45 minutes ago",
    unread: true,
    user: "Emma Davis",
  },
  {
    action: "assigned you to",
    id: 3,
    target: "API integration task",
    timestamp: "4 hours ago",
    unread: false,
    user: "James Wilson",
  },
  {
    action: "replied to your comment in",
    id: 4,
    target: "Authentication flow",
    timestamp: "12 hours ago",
    unread: false,
    user: "Alex Morgan",
  },
  {
    action: "commented on",
    id: 5,
    target: "Dashboard redesign",
    timestamp: "2 days ago",
    unread: false,
    user: "Sarah Chen",
  },
  {
    action: "mentioned you in",
    id: 6,
    target: "coss.com open graph image",
    timestamp: "2 weeks ago",
    unread: false,
    user: "Miky Derya",
  },
];

function Dot({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      height="6"
      viewBox="0 0 6 6"
      width="6"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export default function NotificationMenu() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification,
      ),
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Open notifications"
          className="relative size-8 rounded-full text-muted-foreground shadow-none"
          size="icon"
          variant="ghost"
        >
          <BellIcon aria-hidden="true" size={16} />
          {unreadCount > 0 && (
            <div
              aria-hidden="true"
              className="absolute top-0.5 right-0.5 size-1 rounded-full bg-primary"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-1">
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="font-semibold text-sm">Notifications</div>
          {unreadCount > 0 && (
            <button
              className="font-medium text-xs hover:underline"
              onClick={handleMarkAllAsRead}
              type="button"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div
          aria-orientation="horizontal"
          className="-mx-1 my-1 h-px bg-border"
          role="separator"
          tabIndex={-1}
        />
        {notifications.map((notification) => (
          <div
            className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            key={notification.id}
          >
            <div className="relative flex items-start pe-3">
              <div className="flex-1 space-y-1">
                <button
                  className="text-left text-foreground/80 after:absolute after:inset-0"
                  onClick={() => handleNotificationClick(notification.id)}
                  type="button"
                >
                  <span className="font-medium text-foreground hover:underline">
                    {notification.user}
                  </span>{" "}
                  {notification.action}{" "}
                  <span className="font-medium text-foreground hover:underline">
                    {notification.target}
                  </span>
                  .
                </button>
                <div className="text-muted-foreground text-xs">
                  {notification.timestamp}
                </div>
              </div>
              {notification.unread && (
                <div className="absolute end-0 self-center">
                  <span className="sr-only">Unread</span>
                  <Dot />
                </div>
              )}
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
```

#### registry/default/components/navbar-components/user-menu.tsx

```tsx
import {
  BoltIcon,
  BookOpenIcon,
  Layers2Icon,
  LogOutIcon,
  PinIcon,
  UserPenIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import { Button } from "@/registry/default/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/default/ui/dropdown-menu";

export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-auto p-0 hover:bg-transparent" variant="ghost">
          <Avatar>
            <AvatarImage alt="Profile image" src="/origin/avatar.jpg" />
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-foreground text-sm">
            Keith Kennedy
          </span>
          <span className="truncate font-normal text-muted-foreground text-xs">
            k.kennedy@coss.com
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BoltIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Layers2Icon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 2</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BookOpenIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 3</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PinIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 4</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserPenIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 5</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon aria-hidden="true" className="opacity-60" size={16} />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### COSS Origin navbar (general): search, account (comp-585)

#### registry/default/components/comp-585.tsx

```tsx
import {
  HashIcon,
  HouseIcon,
  MailIcon,
  SearchIcon,
  UsersRound,
} from "lucide-react";
import { useId } from "react";

import Logo from "@/registry/default/components/navbar-components/logo";
import NotificationMenu from "@/registry/default/components/navbar-components/notification-menu";
import UserMenu from "@/registry/default/components/navbar-components/user-menu";
import { Button } from "@/registry/default/ui/button";
import { Input } from "@/registry/default/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/registry/default/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

const _teams = ["Acme Inc.", "coss.com", "Junon"];

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "#", icon: HouseIcon, label: "Home" },
  { href: "#", icon: HashIcon, label: "Hash" },
  { href: "#", icon: UsersRound, label: "Groups" },
];

export default function Component() {
  const id = useId();

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                size="icon"
                variant="ghost"
              >
                <svg
                  className="pointer-events-none"
                  fill="none"
                  height={16}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="-translate-y-[7px] origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
                    d="M4 12L20 12"
                  />
                  <path
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    d="M4 12H20"
                  />
                  <path
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
                    d="M4 12H20"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-48 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, _index) => {
                    const Icon = link.icon;
                    return (
                      <NavigationMenuItem className="w-full" key={link.label}>
                        <NavigationMenuLink
                          className="flex-row items-center gap-2 py-1.5"
                          href={link.href}
                        >
                          <Icon
                            aria-hidden="true"
                            className="text-muted-foreground"
                            size={16}
                          />
                          <span>{link.label}</span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-6">
            <a className="text-primary hover:text-primary/90" href="#">
              <Logo />
            </a>
            {/* Search form */}
            <div className="relative">
              <Input
                className="peer h-8 ps-8 pe-2"
                id={id}
                placeholder="Search..."
                type="search"
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/80 peer-disabled:opacity-50">
                <SearchIcon size={16} />
              </div>
            </div>
          </div>
        </div>
        {/* Middle area */}
        <NavigationMenu className="max-md:hidden">
          <NavigationMenuList className="gap-2">
            {navigationLinks.map((link, _index) => {
              const Icon = link.icon;
              return (
                <NavigationMenuItem key={link.label}>
                  <NavigationMenuLink
                    className="flex size-8 items-center justify-center p-1.5"
                    href={link.href}
                    title={link.label}
                  >
                    <Icon aria-hidden="true" />
                    <span className="sr-only">{link.label}</span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="flex items-center gap-2">
            {/* Messages */}
            <Button
              aria-label="Open notifications"
              className="relative size-8 rounded-full text-muted-foreground shadow-none"
              size="icon"
              variant="ghost"
            >
              <MailIcon aria-hidden="true" size={16} />
              <div
                aria-hidden="true"
                className="absolute top-0.5 right-0.5 size-1 rounded-full bg-primary"
              />
            </Button>
            {/* Notification menu */}
            <NotificationMenu />
          </div>
          {/* User menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
```

#### registry/default/components/navbar-components/logo.tsx

```tsx
export default function Logo() {
  return (
    <svg
      fill="currentColor"
      height="33"
      width="33"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.46 1.766 17.303.923l-2.66 9.896-2.403-8.934-3.157.843 2.595 9.652-6.464-6.442-2.311 2.304 7.09 7.066-8.83-2.358-.846 3.146 9.648 2.577a6.516 6.516 0 0 1-.169-1.478c0-3.598 2.927-6.515 6.537-6.515s6.537 2.917 6.537 6.515c0 .505-.057.997-.167 1.468l8.768 2.342.846-3.147-9.686-2.586 8.83-2.358-.845-3.147-9.686 2.587 6.464-6.442-2.311-2.304-6.992 6.969 2.369-8.81Z" />
      <path d="M22.695 18.7a6.495 6.495 0 0 1-1.626 2.986l6.352 6.33 2.31-2.303-7.036-7.013ZM21.005 21.752a6.538 6.538 0 0 1-2.922 1.722l2.312 8.596 3.157-.843-2.547-9.475ZM17.965 23.505a6.569 6.569 0 0 1-1.632.205 6.566 6.566 0 0 1-1.743-.235l-2.314 8.605 3.157.843 2.532-9.418ZM14.478 23.444a6.54 6.54 0 0 1-2.87-1.747l-6.367 6.346 2.31 2.303 6.927-6.902ZM11.555 21.64a6.492 6.492 0 0 1-1.585-2.948L1.173 21.04l.846 3.146 9.536-2.546Z" />
    </svg>
  );
}
```

#### registry/default/components/navbar-components/notification-menu.tsx

```tsx
"use client";

import { BellIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/registry/default/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

const initialNotifications = [
  {
    action: "requested review on",
    id: 1,
    target: "PR #42: Feature implementation",
    timestamp: "15 minutes ago",
    unread: true,
    user: "Chris Tompson",
  },
  {
    action: "shared",
    id: 2,
    target: "New component library",
    timestamp: "45 minutes ago",
    unread: true,
    user: "Emma Davis",
  },
  {
    action: "assigned you to",
    id: 3,
    target: "API integration task",
    timestamp: "4 hours ago",
    unread: false,
    user: "James Wilson",
  },
  {
    action: "replied to your comment in",
    id: 4,
    target: "Authentication flow",
    timestamp: "12 hours ago",
    unread: false,
    user: "Alex Morgan",
  },
  {
    action: "commented on",
    id: 5,
    target: "Dashboard redesign",
    timestamp: "2 days ago",
    unread: false,
    user: "Sarah Chen",
  },
  {
    action: "mentioned you in",
    id: 6,
    target: "coss.com open graph image",
    timestamp: "2 weeks ago",
    unread: false,
    user: "Miky Derya",
  },
];

function Dot({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      height="6"
      viewBox="0 0 6 6"
      width="6"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export default function NotificationMenu() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification,
      ),
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Open notifications"
          className="relative size-8 rounded-full text-muted-foreground shadow-none"
          size="icon"
          variant="ghost"
        >
          <BellIcon aria-hidden="true" size={16} />
          {unreadCount > 0 && (
            <div
              aria-hidden="true"
              className="absolute top-0.5 right-0.5 size-1 rounded-full bg-primary"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-1">
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="font-semibold text-sm">Notifications</div>
          {unreadCount > 0 && (
            <button
              className="font-medium text-xs hover:underline"
              onClick={handleMarkAllAsRead}
              type="button"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div
          aria-orientation="horizontal"
          className="-mx-1 my-1 h-px bg-border"
          role="separator"
          tabIndex={-1}
        />
        {notifications.map((notification) => (
          <div
            className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            key={notification.id}
          >
            <div className="relative flex items-start pe-3">
              <div className="flex-1 space-y-1">
                <button
                  className="text-left text-foreground/80 after:absolute after:inset-0"
                  onClick={() => handleNotificationClick(notification.id)}
                  type="button"
                >
                  <span className="font-medium text-foreground hover:underline">
                    {notification.user}
                  </span>{" "}
                  {notification.action}{" "}
                  <span className="font-medium text-foreground hover:underline">
                    {notification.target}
                  </span>
                  .
                </button>
                <div className="text-muted-foreground text-xs">
                  {notification.timestamp}
                </div>
              </div>
              {notification.unread && (
                <div className="absolute end-0 self-center">
                  <span className="sr-only">Unread</span>
                  <Dot />
                </div>
              )}
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
```

#### registry/default/components/navbar-components/user-menu.tsx

```tsx
import {
  BoltIcon,
  BookOpenIcon,
  Layers2Icon,
  LogOutIcon,
  PinIcon,
  UserPenIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import { Button } from "@/registry/default/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/default/ui/dropdown-menu";

export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-auto p-0 hover:bg-transparent" variant="ghost">
          <Avatar>
            <AvatarImage alt="Profile image" src="/origin/avatar.jpg" />
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-foreground text-sm">
            Keith Kennedy
          </span>
          <span className="truncate font-normal text-muted-foreground text-xs">
            k.kennedy@coss.com
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BoltIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Layers2Icon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 2</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BookOpenIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 3</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PinIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 4</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserPenIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 5</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon aria-hidden="true" className="opacity-60" size={16} />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### COSS Origin navbar (general): search (comp-586)

#### registry/default/components/comp-586.tsx

```tsx
import { MicIcon, SearchIcon } from "lucide-react";
import { useId } from "react";

import Logo from "@/registry/default/components/navbar-components/logo";
import ThemeToggle from "@/registry/default/components/navbar-components/theme-toggle";
import { Button } from "@/registry/default/ui/button";
import { Input } from "@/registry/default/ui/input";

export default function Component() {
  const id = useId();

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex-1">
          <a className="text-primary hover:text-primary/90" href="#">
            <Logo />
          </a>
        </div>
        {/* Middle area */}
        <div className="grow max-sm:hidden">
          {/* Search form */}
          <div className="relative mx-auto w-full max-w-xs">
            <Input
              className="peer h-8 px-8"
              id={id}
              placeholder="Search..."
              type="search"
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/80 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
            <button
              aria-label="Press to speak"
              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
            >
              <MicIcon aria-hidden="true" size={16} />
            </button>
          </div>
        </div>
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button asChild className="text-sm" size="sm" variant="ghost">
            <a href="#">Community</a>
          </Button>
          <Button asChild className="text-sm" size="sm">
            <a href="#">Get Started</a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
```

#### registry/default/components/navbar-components/logo.tsx

```tsx
export default function Logo() {
  return (
    <svg
      fill="currentColor"
      height="33"
      width="33"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.46 1.766 17.303.923l-2.66 9.896-2.403-8.934-3.157.843 2.595 9.652-6.464-6.442-2.311 2.304 7.09 7.066-8.83-2.358-.846 3.146 9.648 2.577a6.516 6.516 0 0 1-.169-1.478c0-3.598 2.927-6.515 6.537-6.515s6.537 2.917 6.537 6.515c0 .505-.057.997-.167 1.468l8.768 2.342.846-3.147-9.686-2.586 8.83-2.358-.845-3.147-9.686 2.587 6.464-6.442-2.311-2.304-6.992 6.969 2.369-8.81Z" />
      <path d="M22.695 18.7a6.495 6.495 0 0 1-1.626 2.986l6.352 6.33 2.31-2.303-7.036-7.013ZM21.005 21.752a6.538 6.538 0 0 1-2.922 1.722l2.312 8.596 3.157-.843-2.547-9.475ZM17.965 23.505a6.569 6.569 0 0 1-1.632.205 6.566 6.566 0 0 1-1.743-.235l-2.314 8.605 3.157.843 2.532-9.418ZM14.478 23.444a6.54 6.54 0 0 1-2.87-1.747l-6.367 6.346 2.31 2.303 6.927-6.902ZM11.555 21.64a6.492 6.492 0 0 1-1.585-2.948L1.173 21.04l.846 3.146 9.536-2.546Z" />
    </svg>
  );
}
```

#### registry/default/components/navbar-components/theme-toggle.tsx

```tsx
"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useState } from "react";

import { Toggle } from "@/registry/default/ui/toggle";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>("light");

  return (
    <div>
      <Toggle
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="group size-8 rounded-full border-none text-muted-foreground shadow-none data-[state=on]:bg-transparent data-[state=on]:text-muted-foreground data-[state=on]:hover:bg-muted data-[state=on]:hover:text-foreground"
        onPressedChange={() =>
          setTheme((prev) => (prev === "dark" ? "light" : "dark"))
        }
        pressed={theme === "dark"}
        variant="outline"
      >
        {/* Note: After dark mode implementation, rely on dark: prefix rather than group-data-[state=on]: */}
        <MoonIcon
          aria-hidden="true"
          className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
          size={16}
        />
        <SunIcon
          aria-hidden="true"
          className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
          size={16}
        />
      </Toggle>
    </div>
  );
}
```

### COSS Origin navbar (general): search (comp-587)

#### registry/default/components/comp-587.tsx

```tsx
import { HouseIcon, InboxIcon, SearchIcon, ZapIcon } from "lucide-react";
import { useId } from "react";

import Logo from "@/registry/default/components/navbar-components/logo";
import { Button } from "@/registry/default/ui/button";
import { Input } from "@/registry/default/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/registry/default/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { active: true, href: "#", icon: HouseIcon, label: "Home" },
  { href: "#", icon: InboxIcon, label: "Inbox" },
  { href: "#", icon: ZapIcon, label: "Insights" },
];

export default function Component() {
  const id = useId();

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                size="icon"
                variant="ghost"
              >
                <svg
                  className="pointer-events-none"
                  fill="none"
                  height={16}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="-translate-y-[7px] origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
                    d="M4 12L20 12"
                  />
                  <path
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    d="M4 12H20"
                  />
                  <path
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
                    d="M4 12H20"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, _index) => {
                    const Icon = link.icon;
                    return (
                      <NavigationMenuItem className="w-full" key={link.label}>
                        <NavigationMenuLink
                          active={link.active}
                          className="flex-row items-center gap-2 py-1.5"
                          href={link.href}
                        >
                          <Icon
                            aria-hidden="true"
                            className="text-muted-foreground/80"
                            size={16}
                          />
                          <span>{link.label}</span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Logo */}
          <div className="flex items-center">
            <a className="text-primary hover:text-primary/90" href="#">
              <Logo />
            </a>
          </div>
        </div>
        {/* Middle area */}
        <NavigationMenu className="max-md:hidden">
          <NavigationMenuList className="gap-2">
            {navigationLinks.map((link, _index) => {
              const Icon = link.icon;
              return (
                <NavigationMenuItem key={link.label}>
                  <NavigationMenuLink
                    active={link.active}
                    className="flex-row items-center gap-2 py-1.5 font-medium text-foreground hover:text-primary"
                    href={link.href}
                  >
                    <Icon
                      aria-hidden="true"
                      className="text-muted-foreground/80"
                      size={16}
                    />
                    <span>{link.label}</span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="relative">
            <Input
              className="peer h-8 ps-8 pe-2"
              id={id}
              placeholder="Search..."
              type="search"
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/80 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
```

#### registry/default/components/navbar-components/logo.tsx

```tsx
export default function Logo() {
  return (
    <svg
      fill="currentColor"
      height="33"
      width="33"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.46 1.766 17.303.923l-2.66 9.896-2.403-8.934-3.157.843 2.595 9.652-6.464-6.442-2.311 2.304 7.09 7.066-8.83-2.358-.846 3.146 9.648 2.577a6.516 6.516 0 0 1-.169-1.478c0-3.598 2.927-6.515 6.537-6.515s6.537 2.917 6.537 6.515c0 .505-.057.997-.167 1.468l8.768 2.342.846-3.147-9.686-2.586 8.83-2.358-.845-3.147-9.686 2.587 6.464-6.442-2.311-2.304-6.992 6.969 2.369-8.81Z" />
      <path d="M22.695 18.7a6.495 6.495 0 0 1-1.626 2.986l6.352 6.33 2.31-2.303-7.036-7.013ZM21.005 21.752a6.538 6.538 0 0 1-2.922 1.722l2.312 8.596 3.157-.843-2.547-9.475ZM17.965 23.505a6.569 6.569 0 0 1-1.632.205 6.566 6.566 0 0 1-1.743-.235l-2.314 8.605 3.157.843 2.532-9.418ZM14.478 23.444a6.54 6.54 0 0 1-2.87-1.747l-6.367 6.346 2.31 2.303 6.927-6.902ZM11.555 21.64a6.492 6.492 0 0 1-1.585-2.948L1.173 21.04l.846 3.146 9.536-2.546Z" />
    </svg>
  );
}
```

### COSS Origin navbar (general): account (comp-588)

#### registry/default/components/comp-588.tsx

```tsx
import { HouseIcon, InboxIcon, SparklesIcon, ZapIcon } from "lucide-react";

import Logo from "@/registry/default/components/navbar-components/logo";
import UserMenu from "@/registry/default/components/navbar-components/user-menu";
import { Button } from "@/registry/default/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/registry/default/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

// Navigation links array
const navigationLinks = [
  { active: true, href: "#", icon: HouseIcon, label: "Home" },
  { href: "#", icon: InboxIcon, label: "Inbox" },
  { href: "#", icon: ZapIcon, label: "Insights" },
];

export default function Component() {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                size="icon"
                variant="ghost"
              >
                <svg
                  className="pointer-events-none"
                  fill="none"
                  height={16}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="-translate-y-[7px] origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
                    d="M4 12L20 12"
                  />
                  <path
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    d="M4 12H20"
                  />
                  <path
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
                    d="M4 12H20"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <NavigationMenuItem className="w-full" key={link.label}>
                        <NavigationMenuLink
                          active={link.active}
                          className="flex-row items-center gap-2 py-1.5"
                          href={link.href}
                        >
                          <Icon
                            aria-hidden="true"
                            className="text-muted-foreground/80"
                            size={16}
                          />
                          <span>{link.label}</span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>

          <NavigationMenu className="max-md:hidden">
            <NavigationMenuList className="gap-2">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavigationMenuItem key={link.label}>
                    <NavigationMenuLink
                      active={link.active}
                      className="flex-row items-center gap-2 py-1.5 font-medium text-foreground hover:text-primary"
                      href={link.href}
                    >
                      <Icon
                        aria-hidden="true"
                        className="text-muted-foreground/80"
                        size={16}
                      />
                      <span>{link.label}</span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Middle side: Logo */}
        <div className="flex items-center">
          <a className="text-primary hover:text-primary/90" href="#">
            <Logo />
          </a>
        </div>

        {/* Right side: Actions */}
        <div className="flex flex-1 items-center justify-end gap-4">
          {/* User menu */}
          <UserMenu />
          {/* Upgrade button */}
          <Button className="text-sm sm:aspect-square" size="sm">
            <SparklesIcon
              aria-hidden="true"
              className="sm:-ms-1 opacity-60"
              size={16}
            />
            <span className="sm:sr-only">Upgrade</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
```

#### registry/default/components/navbar-components/logo.tsx

```tsx
export default function Logo() {
  return (
    <svg
      fill="currentColor"
      height="33"
      width="33"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.46 1.766 17.303.923l-2.66 9.896-2.403-8.934-3.157.843 2.595 9.652-6.464-6.442-2.311 2.304 7.09 7.066-8.83-2.358-.846 3.146 9.648 2.577a6.516 6.516 0 0 1-.169-1.478c0-3.598 2.927-6.515 6.537-6.515s6.537 2.917 6.537 6.515c0 .505-.057.997-.167 1.468l8.768 2.342.846-3.147-9.686-2.586 8.83-2.358-.845-3.147-9.686 2.587 6.464-6.442-2.311-2.304-6.992 6.969 2.369-8.81Z" />
      <path d="M22.695 18.7a6.495 6.495 0 0 1-1.626 2.986l6.352 6.33 2.31-2.303-7.036-7.013ZM21.005 21.752a6.538 6.538 0 0 1-2.922 1.722l2.312 8.596 3.157-.843-2.547-9.475ZM17.965 23.505a6.569 6.569 0 0 1-1.632.205 6.566 6.566 0 0 1-1.743-.235l-2.314 8.605 3.157.843 2.532-9.418ZM14.478 23.444a6.54 6.54 0 0 1-2.87-1.747l-6.367 6.346 2.31 2.303 6.927-6.902ZM11.555 21.64a6.492 6.492 0 0 1-1.585-2.948L1.173 21.04l.846 3.146 9.536-2.546Z" />
    </svg>
  );
}
```

#### registry/default/components/navbar-components/user-menu.tsx

```tsx
import {
  BoltIcon,
  BookOpenIcon,
  Layers2Icon,
  LogOutIcon,
  PinIcon,
  UserPenIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import { Button } from "@/registry/default/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/default/ui/dropdown-menu";

export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-auto p-0 hover:bg-transparent" variant="ghost">
          <Avatar>
            <AvatarImage alt="Profile image" src="/origin/avatar.jpg" />
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-foreground text-sm">
            Keith Kennedy
          </span>
          <span className="truncate font-normal text-muted-foreground text-xs">
            k.kennedy@coss.com
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BoltIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Layers2Icon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 2</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BookOpenIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 3</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PinIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 4</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserPenIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 5</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon aria-hidden="true" className="opacity-60" size={16} />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### COSS Origin navbar (general): search, account (comp-590)

#### registry/default/components/comp-590.tsx

```tsx
import {
  CompassIcon,
  FeatherIcon,
  HouseIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";

import NotificationMenu from "@/registry/default/components/navbar-components/notification-menu";
import TeamSwitcher from "@/registry/default/components/navbar-components/team-switcher";
import UserMenu from "@/registry/default/components/navbar-components/user-menu";
import { Button } from "@/registry/default/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/registry/default/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

const teams = ["Acme Inc.", "coss.com", "Junon"];

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "#", icon: HouseIcon, label: "Dashboard" },
  { href: "#", icon: CompassIcon, label: "Explore" },
  { href: "#", icon: FeatherIcon, label: "Write" },
  { href: "#", icon: SearchIcon, label: "Search" },
];

export default function Component() {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                size="icon"
                variant="ghost"
              >
                <svg
                  className="pointer-events-none"
                  fill="none"
                  height={16}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="-translate-y-[7px] origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
                    d="M4 12L20 12"
                  />
                  <path
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    d="M4 12H20"
                  />
                  <path
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
                    d="M4 12H20"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-48 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, _index) => {
                    const Icon = link.icon;
                    return (
                      <NavigationMenuItem className="w-full" key={link.label}>
                        <NavigationMenuLink
                          className="flex-row items-center gap-2 py-1.5"
                          href={link.href}
                        >
                          <Icon
                            aria-hidden="true"
                            className="text-muted-foreground"
                            size={16}
                          />
                          <span>{link.label}</span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          <TeamSwitcher defaultTeam={teams[0]} teams={teams} />
        </div>
        {/* Middle area */}
        <NavigationMenu className="max-md:hidden">
          <NavigationMenuList className="gap-2">
            {navigationLinks.map((link, _index) => {
              const Icon = link.icon;
              return (
                <NavigationMenuItem key={link.label}>
                  <NavigationMenuLink
                    className="flex size-8 items-center justify-center p-1.5"
                    href={link.href}
                    title={link.label}
                  >
                    <Icon aria-hidden="true" />
                    <span className="sr-only">{link.label}</span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <Button className="text-sm max-sm:aspect-square max-sm:p-0" size="sm">
            <PlusIcon
              aria-hidden="true"
              className="sm:-ms-1 opacity-60"
              size={16}
            />
            <span className="max-sm:sr-only">Post</span>
          </Button>
          <NotificationMenu />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
```

#### registry/default/components/navbar-components/notification-menu.tsx

```tsx
"use client";

import { BellIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/registry/default/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

const initialNotifications = [
  {
    action: "requested review on",
    id: 1,
    target: "PR #42: Feature implementation",
    timestamp: "15 minutes ago",
    unread: true,
    user: "Chris Tompson",
  },
  {
    action: "shared",
    id: 2,
    target: "New component library",
    timestamp: "45 minutes ago",
    unread: true,
    user: "Emma Davis",
  },
  {
    action: "assigned you to",
    id: 3,
    target: "API integration task",
    timestamp: "4 hours ago",
    unread: false,
    user: "James Wilson",
  },
  {
    action: "replied to your comment in",
    id: 4,
    target: "Authentication flow",
    timestamp: "12 hours ago",
    unread: false,
    user: "Alex Morgan",
  },
  {
    action: "commented on",
    id: 5,
    target: "Dashboard redesign",
    timestamp: "2 days ago",
    unread: false,
    user: "Sarah Chen",
  },
  {
    action: "mentioned you in",
    id: 6,
    target: "coss.com open graph image",
    timestamp: "2 weeks ago",
    unread: false,
    user: "Miky Derya",
  },
];

function Dot({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      height="6"
      viewBox="0 0 6 6"
      width="6"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export default function NotificationMenu() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification,
      ),
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Open notifications"
          className="relative size-8 rounded-full text-muted-foreground shadow-none"
          size="icon"
          variant="ghost"
        >
          <BellIcon aria-hidden="true" size={16} />
          {unreadCount > 0 && (
            <div
              aria-hidden="true"
              className="absolute top-0.5 right-0.5 size-1 rounded-full bg-primary"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-1">
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="font-semibold text-sm">Notifications</div>
          {unreadCount > 0 && (
            <button
              className="font-medium text-xs hover:underline"
              onClick={handleMarkAllAsRead}
              type="button"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div
          aria-orientation="horizontal"
          className="-mx-1 my-1 h-px bg-border"
          role="separator"
          tabIndex={-1}
        />
        {notifications.map((notification) => (
          <div
            className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            key={notification.id}
          >
            <div className="relative flex items-start pe-3">
              <div className="flex-1 space-y-1">
                <button
                  className="text-left text-foreground/80 after:absolute after:inset-0"
                  onClick={() => handleNotificationClick(notification.id)}
                  type="button"
                >
                  <span className="font-medium text-foreground hover:underline">
                    {notification.user}
                  </span>{" "}
                  {notification.action}{" "}
                  <span className="font-medium text-foreground hover:underline">
                    {notification.target}
                  </span>
                  .
                </button>
                <div className="text-muted-foreground text-xs">
                  {notification.timestamp}
                </div>
              </div>
              {notification.unread && (
                <div className="absolute end-0 self-center">
                  <span className="sr-only">Unread</span>
                  <Dot />
                </div>
              )}
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
```

#### registry/default/components/navbar-components/team-switcher.tsx

```tsx
"use client";

import { ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/registry/default/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/default/ui/dropdown-menu";

export default function TeamSwitcher({
  teams,
  defaultTeam,
}: {
  teams: string[];
  defaultTeam: string;
}) {
  const [selectedProject, setSelectedProject] = React.useState(defaultTeam);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="p-0 hover:bg-transparent" variant="ghost">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {selectedProject.charAt(0).toUpperCase()}
          </span>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="">{selectedProject}</span>
          </div>
          <ChevronsUpDown className="text-muted-foreground/80" size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {teams.map((project) => (
          <DropdownMenuItem
            key={project}
            onSelect={() => setSelectedProject(project)}
          >
            {project}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

#### registry/default/components/navbar-components/user-menu.tsx

```tsx
import {
  BoltIcon,
  BookOpenIcon,
  Layers2Icon,
  LogOutIcon,
  PinIcon,
  UserPenIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import { Button } from "@/registry/default/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/default/ui/dropdown-menu";

export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-auto p-0 hover:bg-transparent" variant="ghost">
          <Avatar>
            <AvatarImage alt="Profile image" src="/origin/avatar.jpg" />
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-foreground text-sm">
            Keith Kennedy
          </span>
          <span className="truncate font-normal text-muted-foreground text-xs">
            k.kennedy@coss.com
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BoltIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Layers2Icon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 2</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BookOpenIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 3</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PinIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 4</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserPenIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 5</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon aria-hidden="true" className="opacity-60" size={16} />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### COSS Origin navbar (general): account (comp-591)

#### registry/default/components/comp-591.tsx

```tsx
import { BotMessageSquareIcon, MessageCircleDashedIcon } from "lucide-react";

import UserMenu from "@/registry/default/components/navbar-components/user-menu";
import { Button } from "@/registry/default/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select";

export default function Component() {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div>
          <Select aria-label="Select AI model" defaultValue="orion-alpha-45">
            <SelectTrigger className="**:data-desc:hidden [&>svg]:shrink-0 [&>svg]:text-muted-foreground/80">
              <BotMessageSquareIcon aria-hidden="true" size={16} />
              <SelectValue placeholder="Choose an AI model" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
              <SelectGroup>
                <SelectLabel className="ps-2">Models</SelectLabel>
                <SelectItem value="orion-alpha-45">
                  Orion-Alpha 4.5
                  <span
                    className="mt-1 block text-muted-foreground text-xs"
                    data-desc
                  >
                    Balanced performance and creativity
                  </span>
                </SelectItem>
                <SelectItem value="orion-code-4">
                  Orion-Code 4
                  <span
                    className="mt-1 block text-muted-foreground text-xs"
                    data-desc
                  >
                    Optimized for code generation and understanding
                  </span>
                </SelectItem>
                <SelectItem value="nova-chat-4">
                  Nova-Chat 4
                  <span
                    className="mt-1 block text-muted-foreground text-xs"
                    data-desc
                  >
                    Excels at natural, engaging conversations
                  </span>
                </SelectItem>
                <SelectItem value="galaxy-max-4">
                  Galaxy-Max 4
                  <span
                    className="mt-1 block text-muted-foreground text-xs"
                    data-desc
                  >
                    Most powerful model for complex tasks
                  </span>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center justify-end gap-2">
          {/* Layout button */}
          <Button
            aria-label="Temporary chat"
            className="size-8 rounded-full text-muted-foreground shadow-none"
            size="icon"
            variant="ghost"
          >
            <MessageCircleDashedIcon aria-hidden="true" size={16} />
          </Button>
          {/* User menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
```

#### registry/default/components/navbar-components/user-menu.tsx

```tsx
import {
  BoltIcon,
  BookOpenIcon,
  Layers2Icon,
  LogOutIcon,
  PinIcon,
  UserPenIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import { Button } from "@/registry/default/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/default/ui/dropdown-menu";

export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-auto p-0 hover:bg-transparent" variant="ghost">
          <Avatar>
            <AvatarImage alt="Profile image" src="/origin/avatar.jpg" />
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-foreground text-sm">
            Keith Kennedy
          </span>
          <span className="truncate font-normal text-muted-foreground text-xs">
            k.kennedy@coss.com
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BoltIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Layers2Icon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 2</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BookOpenIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 3</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PinIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 4</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserPenIcon aria-hidden="true" className="opacity-60" size={16} />
            <span>Option 5</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon aria-hidden="true" className="opacity-60" size={16} />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### COSS Origin navbar (saas): search, account (comp-592)

#### registry/default/components/comp-592.tsx

```tsx
"use client";

import { LayoutGridIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useId, useState } from "react";

import InfoMenu from "@/registry/default/components/navbar-components/info-menu";
import NotificationMenu from "@/registry/default/components/navbar-components/notification-menu";
import SettingsMenu from "@/registry/default/components/navbar-components/settings-menu";
import { Button } from "@/registry/default/ui/button";
import { Input } from "@/registry/default/ui/input";
import { Label } from "@/registry/default/ui/label";
import { Switch } from "@/registry/default/ui/switch";

export default function Component() {
  const id = useId();
  const [checked, setChecked] = useState<boolean>(true);

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="relative flex-1">
          <Input
            className="peer h-8 w-full max-w-xs ps-8 pe-2"
            id={`input-${id}`}
            placeholder="Search..."
            type="search"
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/80 peer-disabled:opacity-50">
            <SearchIcon size={16} />
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Test mode */}
          <div className="inline-flex items-center gap-2 max-md:hidden">
            <Label className="font-medium text-sm" htmlFor={`switch-${id}`}>
              Test mode
            </Label>
            <Switch
              aria-label="Toggle switch"
              checked={checked}
              className="data-[state=checked]:[&_span]:rtl:-translate-x-3 h-5 w-8 [&_span]:size-4 data-[state=checked]:[&_span]:translate-x-3"
              id={`switch-${id}`}
              onCheckedChange={setChecked}
            />
          </div>
          <div className="flex items-center gap-2">
            {/* Layout button */}
            <Button
              aria-label="Open layout menu"
              className="size-8 rounded-full text-muted-foreground shadow-none"
              size="icon"
              variant="ghost"
            >
              <LayoutGridIcon aria-hidden="true" size={16} />
            </Button>
            {/* Info menu */}
            <InfoMenu />
            {/* Notification */}
            <NotificationMenu />
            {/* Settings */}
            <SettingsMenu />
          </div>
          {/* Add button */}
          <Button
            aria-label="Add new item"
            className="size-8 rounded-full"
            size="icon"
          >
            <PlusIcon aria-hidden="true" size={16} />
          </Button>
        </div>
      </div>
    </header>
  );
}
```

#### registry/default/components/navbar-components/info-menu.tsx

```tsx
import {
  BookIcon,
  InfoIcon,
  LifeBuoyIcon,
  MessageCircleMoreIcon,
} from "lucide-react";

import { Button } from "@/registry/default/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/registry/default/ui/dropdown-menu";

export default function InfoMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open edit menu"
          className="size-8 rounded-full shadow-none"
          size="icon"
          variant="ghost"
        >
          <InfoIcon
            aria-hidden="true"
            className="text-muted-foreground"
            size={16}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="pb-2">
        <DropdownMenuLabel>Need help?</DropdownMenuLabel>
        <DropdownMenuItem
          asChild
          className="cursor-pointer py-1 focus:bg-transparent focus:underline"
        >
          <a href="#">
            <BookIcon aria-hidden="true" className="opacity-60" size={16} />
            Documentation
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer py-1 focus:bg-transparent focus:underline"
        >
          <a href="#">
            <LifeBuoyIcon aria-hidden="true" className="opacity-60" size={16} />
            Support
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer py-1 focus:bg-transparent focus:underline"
        >
          <a href="#">
            <MessageCircleMoreIcon
              aria-hidden="true"
              className="opacity-60"
              size={16}
            />
            Contact us
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

#### registry/default/components/navbar-components/notification-menu.tsx

```tsx
"use client";

import { BellIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/registry/default/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

const initialNotifications = [
  {
    action: "requested review on",
    id: 1,
    target: "PR #42: Feature implementation",
    timestamp: "15 minutes ago",
    unread: true,
    user: "Chris Tompson",
  },
  {
    action: "shared",
    id: 2,
    target: "New component library",
    timestamp: "45 minutes ago",
    unread: true,
    user: "Emma Davis",
  },
  {
    action: "assigned you to",
    id: 3,
    target: "API integration task",
    timestamp: "4 hours ago",
    unread: false,
    user: "James Wilson",
  },
  {
    action: "replied to your comment in",
    id: 4,
    target: "Authentication flow",
    timestamp: "12 hours ago",
    unread: false,
    user: "Alex Morgan",
  },
  {
    action: "commented on",
    id: 5,
    target: "Dashboard redesign",
    timestamp: "2 days ago",
    unread: false,
    user: "Sarah Chen",
  },
  {
    action: "mentioned you in",
    id: 6,
    target: "coss.com open graph image",
    timestamp: "2 weeks ago",
    unread: false,
    user: "Miky Derya",
  },
];

function Dot({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      height="6"
      viewBox="0 0 6 6"
      width="6"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export default function NotificationMenu() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification,
      ),
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Open notifications"
          className="relative size-8 rounded-full text-muted-foreground shadow-none"
          size="icon"
          variant="ghost"
        >
          <BellIcon aria-hidden="true" size={16} />
          {unreadCount > 0 && (
            <div
              aria-hidden="true"
              className="absolute top-0.5 right-0.5 size-1 rounded-full bg-primary"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-1">
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="font-semibold text-sm">Notifications</div>
          {unreadCount > 0 && (
            <button
              className="font-medium text-xs hover:underline"
              onClick={handleMarkAllAsRead}
              type="button"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div
          aria-orientation="horizontal"
          className="-mx-1 my-1 h-px bg-border"
          role="separator"
          tabIndex={-1}
        />
        {notifications.map((notification) => (
          <div
            className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            key={notification.id}
          >
            <div className="relative flex items-start pe-3">
              <div className="flex-1 space-y-1">
                <button
                  className="text-left text-foreground/80 after:absolute after:inset-0"
                  onClick={() => handleNotificationClick(notification.id)}
                  type="button"
                >
                  <span className="font-medium text-foreground hover:underline">
                    {notification.user}
                  </span>{" "}
                  {notification.action}{" "}
                  <span className="font-medium text-foreground hover:underline">
                    {notification.target}
                  </span>
                  .
                </button>
                <div className="text-muted-foreground text-xs">
                  {notification.timestamp}
                </div>
              </div>
              {notification.unread && (
                <div className="absolute end-0 self-center">
                  <span className="sr-only">Unread</span>
                  <Dot />
                </div>
              )}
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
```

#### registry/default/components/navbar-components/settings-menu.tsx

```tsx
import { SettingsIcon } from "lucide-react";

import { Button } from "@/registry/default/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/default/ui/dropdown-menu";

export default function SettingsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open edit menu"
          className="rounded-full shadow-none"
          size="icon"
          variant="ghost"
        >
          <SettingsIcon
            aria-hidden="true"
            className="text-muted-foreground"
            size={16}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64">
        <DropdownMenuItem>Appearance</DropdownMenuItem>
        <DropdownMenuItem>Preferences</DropdownMenuItem>
        <DropdownMenuItem>API Settings</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### COSS Origin navbar (general) (comp-593)

#### registry/default/components/comp-593.tsx

```tsx
import { BookmarkIcon, HomeIcon } from "lucide-react";

import DatePicker from "@/registry/default/components/navbar-components/date-picker";
import Filters from "@/registry/default/components/navbar-components/filters";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/default/ui/breadcrumb";
import { Button } from "@/registry/default/ui/button";

export default function Component() {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                <HomeIcon aria-hidden="true" size={16} />
                <span className="sr-only">Home</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Reports</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Date picker */}
          <DatePicker />
          {/* Filters */}
          <Filters />
          {/* Saved button */}
          <Button
            className="text-sm max-sm:aspect-square max-sm:p-0"
            size="sm"
            variant="outline"
          >
            <BookmarkIcon
              aria-hidden="true"
              className="sm:-ms-1 text-muted-foreground/80"
              size={16}
            />
            <span className="max-sm:sr-only">Saved</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
```

#### registry/default/components/navbar-components/date-picker.tsx

```tsx
"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import { Calendar } from "@/registry/default/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

export default function DatePicker() {
  const [date, setDate] = useState<DateRange | undefined>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="group w-full justify-between border-input bg-background px-3 font-normal text-sm outline-none outline-offset-0 focus-visible:outline-[3px]"
          size="sm"
          variant="outline"
        >
          <CalendarIcon
            aria-hidden="true"
            className="-ms-1 shrink-0 text-muted-foreground/80 transition-colors"
            size={16}
          />
          <span className={cn("truncate", !date && "font-medium")}>
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              "Date"
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-2">
        <Calendar mode="range" onSelect={setDate} selected={date} />
      </PopoverContent>
    </Popover>
  );
}
```

#### registry/default/components/navbar-components/filters.tsx

```tsx
import { ListFilterIcon } from "lucide-react";
import { useId } from "react";

import { Button } from "@/registry/default/ui/button";
import { Checkbox } from "@/registry/default/ui/checkbox";
import { Label } from "@/registry/default/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover";

export default function Component() {
  const id = useId();
  return (
    <div className="flex flex-col gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button className="text-sm" size="sm" variant="outline">
            <ListFilterIcon
              aria-hidden="true"
              className="-ms-1 text-muted-foreground/80"
              size={16}
            />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-36 p-3">
          <div className="space-y-3">
            <div className="font-medium text-xs">Filters</div>
            <form>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox id={`${id}-1`} />
                  <Label className="font-normal" htmlFor={`${id}-1`}>
                    Real Time
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id={`${id}-2`} />
                  <Label className="font-normal" htmlFor={`${id}-2`}>
                    Top Channels
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id={`${id}-3`} />
                  <Label className="font-normal" htmlFor={`${id}-3`}>
                    Last Orders
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id={`${id}-4`} />
                  <Label className="font-normal" htmlFor={`${id}-4`}>
                    Total Spent
                  </Label>
                </div>
              </div>
              <div
                aria-orientation="horizontal"
                className="-mx-3 my-3 h-px bg-border"
                role="separator"
                tabIndex={-1}
              />
              <div className="flex justify-between gap-2">
                <Button className="h-7 px-2" size="sm" variant="outline">
                  Clear
                </Button>
                <Button className="h-7 px-2" size="sm">
                  Apply
                </Button>
              </div>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
```

### COSS Origin navbar (general): account (comp-595)

#### registry/default/components/comp-595.tsx

```tsx
import {
  ChevronLeftIcon,
  HistoryIcon,
  MessageSquareText,
  UserRoundPlus,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar";
import { Button } from "@/registry/default/ui/button";

export default function Component() {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          <Button
            aria-label="Go back"
            asChild
            className="size-8"
            size="icon"
            variant="ghost"
          >
            <a href="#">
              <ChevronLeftIcon />
            </a>
          </Button>
          <h1 className="font-medium text-sm">Basic UI</h1>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* History button */}
          <Button
            aria-label="History"
            className="size-8 rounded-full text-muted-foreground shadow-none"
            size="icon"
            variant="ghost"
          >
            <HistoryIcon aria-hidden="true" size={16} />
          </Button>
          {/* Comments button */}
          <Button
            aria-label="Save"
            className="size-8 rounded-full text-muted-foreground shadow-none"
            size="icon"
            variant="ghost"
          >
            <MessageSquareText aria-hidden="true" size={16} />
          </Button>
          {/* Add user */}
          <Button
            aria-label="Add user"
            className="size-8 rounded-full text-muted-foreground shadow-none"
            size="icon"
            variant="ghost"
          >
            <UserRoundPlus aria-hidden="true" size={16} />
          </Button>
          {/* Online users */}
          <div className="ml-2 flex items-center gap-2">
            <div className="relative">
              <Avatar>
                <AvatarImage alt="Kelly King" src="/origin/avatar-80-07.jpg" />
                <AvatarFallback>KK</AvatarFallback>
              </Avatar>
              <span className="-end-0.5 -bottom-0.5 absolute size-3 rounded-full border-2 border-background bg-emerald-500">
                <span className="sr-only">Online</span>
              </span>
            </div>
            <div className="relative">
              <Avatar>
                <AvatarImage
                  alt="Martha Johnson"
                  src="/origin/avatar-80-06.jpg"
                />
                <AvatarFallback>KK</AvatarFallback>
              </Avatar>
              <span className="-end-0.5 -bottom-0.5 absolute size-3 rounded-full border-2 border-background bg-muted-foreground">
                <span className="sr-only">Online</span>
              </span>
            </div>
            <div className="relative">
              <Avatar>
                <AvatarImage alt="Linda Green" src="/origin/avatar-80-05.jpg" />
                <AvatarFallback>KK</AvatarFallback>
              </Avatar>
              <span className="-end-0.5 -bottom-0.5 absolute size-3 rounded-full border-2 border-background bg-muted-foreground">
                <span className="sr-only">Online</span>
              </span>
            </div>
            <Button
              className="flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground text-xs ring-background hover:bg-secondary hover:text-foreground"
              size="icon"
              variant="secondary"
            >
              +3
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
```

### COSS Origin navbar (general) (comp-596)

#### registry/default/components/comp-596.tsx

```tsx
"use client";

import { ClockIcon, PowerIcon, PowerOffIcon, ZapIcon } from "lucide-react";
import { useId, useState } from "react";

import { Badge } from "@/registry/default/ui/badge";
import { Button } from "@/registry/default/ui/button";
import { Label } from "@/registry/default/ui/label";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/registry/default/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/default/ui/popover";
import { Switch } from "@/registry/default/ui/switch";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { active: true, href: "#", label: "Overview" },
  { href: "#", label: "Graphs" },
  { href: "#", label: "Backups" },
];

export default function Component() {
  const id = useId();
  const [checked, setChecked] = useState<boolean>(true);

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 justify-between gap-4">
        {/* Left side */}
        <div className="flex gap-2">
          <div className="flex items-center md:hidden">
            {/* Mobile menu trigger */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="group size-8" size="icon" variant="ghost">
                  <svg
                    className="pointer-events-none"
                    fill="none"
                    height={16}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width={16}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="-translate-y-[7px] origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
                      d="M4 12L20 12"
                    />
                    <path
                      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                      d="M4 12H20"
                    />
                    <path
                      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
                      d="M4 12H20"
                    />
                  </svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-36 p-1 md:hidden">
                <NavigationMenu className="max-w-none *:w-full">
                  <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                    {navigationLinks.map((link, _index) => (
                      <NavigationMenuItem className="w-full" key={link.label}>
                        <NavigationMenuLink className="py-1.5" href={link.href}>
                          {link.label}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>
          </div>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            {/* Navigation menu */}
            <NavigationMenu className="h-full *:h-full max-md:hidden">
              <NavigationMenuList className="h-full gap-2">
                {navigationLinks.map((link, _index) => (
                  <NavigationMenuItem className="h-full" key={link.label}>
                    <NavigationMenuLink
                      data-active={link.active ? "" : undefined}
                      className="h-full justify-center rounded-none border-transparent border-y-2 py-1.5 font-medium text-muted-foreground hover:border-b-primary hover:bg-transparent hover:text-primary data-[active]:border-b-primary data-[active]:bg-transparent!"
                      href={link.href}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge className="gap-1.5 text-emerald-600" variant="outline">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-emerald-500"
              />
              Online
            </Badge>
            <Badge className="gap-1.5" variant="outline">
              <ZapIcon
                aria-hidden="true"
                className="-ms-0.5 opacity-60"
                size={12}
              />
              99.9%
            </Badge>
            <Badge className="gap-1.5" variant="outline">
              <ClockIcon
                aria-hidden="true"
                className="-ms-0.5 opacity-60"
                size={12}
              />
              45ms
            </Badge>
          </div>
          {/* Switch */}
          <div>
            <div className="relative inline-grid h-7 grid-cols-[1fr_1fr] items-center font-medium text-sm">
              <Switch
                checked={checked}
                className="peer [&_span]:data-[state=checked]:rtl:-translate-x-full absolute inset-0 h-[inherit] w-auto data-[state=unchecked]:bg-input/50 [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full"
                id={id}
                onCheckedChange={setChecked}
              />
              <span className="peer-data-[state=unchecked]:rtl:-translate-x-full pointer-events-none relative ms-0.5 flex w-6 items-center justify-center text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full">
                <PowerOffIcon aria-hidden="true" size={12} />
              </span>
              <span className="peer-data-[state=checked]:-translate-x-full pointer-events-none relative me-0.5 flex w-6 items-center justify-center text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=unchecked]:invisible peer-data-[state=checked]:text-background peer-data-[state=checked]:rtl:translate-x-full">
                <PowerIcon aria-hidden="true" size={12} />
              </span>
            </div>
            <Label className="sr-only" htmlFor={id}>
              Power
            </Label>
          </div>
        </div>
      </div>
    </header>
  );
}
```

