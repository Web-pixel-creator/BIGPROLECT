export type TemplateFile = {
  name: string;
  path: string;
  content: string;
};

export const WEB_BASELINE_FILES: TemplateFile[] = [
  {
    name: 'utils.ts',
    path: 'src/lib/utils.ts',
    content: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`,
  },
  {
    name: 'button.tsx',
    path: 'src/components/ui/button.tsx',
    content: `import * as React from "react";

import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
`,
  },
  {
    name: 'input.tsx',
    path: 'src/components/ui/input.tsx',
    content: `import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
`,
  },
  {
    name: 'badge.tsx',
    path: 'src/components/ui/badge.tsx',
    content: `import * as React from "react";

import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
  secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
  outline: "text-foreground",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
`,
  },
  {
    name: 'card.tsx',
    path: 'src/components/ui/card.tsx',
    content: `import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-xl border bg-card text-card-foreground shadow", className)} {...props} />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
`,
  },
  {
    name: 'separator.tsx',
    path: 'src/components/ui/separator.tsx',
    content: `import * as React from "react";

import { cn } from "@/lib/utils";

const Separator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("h-px w-full bg-border", className)} {...props} />,
);
Separator.displayName = "Separator";

export { Separator };
`,
  },
];

export const WEB_BASELINE_DEPS: Record<string, string> = {
  clsx: '^2.1.1',
  'tailwind-merge': '^2.6.0',
  'lucide-react': '^0.485.0',
  'framer-motion': '^11.12.0',
  motion: '^12.23.26',
};

export const WEB_BASELINE_DEV_DEPS: Record<string, string> = {
  'vite-tsconfig-paths': '^5.0.1',
};

export function applyWebTemplateBaseline(templateFiles: TemplateFile[]): TemplateFile[] {
  const existingPaths = new Set(templateFiles.map((file) => file.path.replace(/\\/g, '/')));
  const nextFiles = [...templateFiles];

  const addFileIfMissing = (file: TemplateFile) => {
    const normalizedPath = file.path.replace(/\\/g, '/');
    if (existingPaths.has(normalizedPath)) return;
    nextFiles.push(file);
    existingPaths.add(normalizedPath);
  };

  for (const file of WEB_BASELINE_FILES) {
    addFileIfMissing(file);
  }

  ensurePackageJsonDeps(nextFiles);
  ensureTsconfigPaths(nextFiles);
  ensureViteConfigPathsPlugin(nextFiles);

  return nextFiles;
}

function ensurePackageJsonDeps(files: TemplateFile[]) {
  const packageIndex = files.findIndex((file) => file.path === 'package.json');
  if (packageIndex === -1) return;

  try {
    const pkg = JSON.parse(files[packageIndex].content) as any;
    const deps = (pkg.dependencies ?? {}) as Record<string, string>;
    const devDeps = (pkg.devDependencies ?? {}) as Record<string, string>;

    let changed = false;

    for (const [dep, version] of Object.entries(WEB_BASELINE_DEPS)) {
      if (!deps[dep]) {
        deps[dep] = version;
        changed = true;
      }
    }

    for (const [dep, version] of Object.entries(WEB_BASELINE_DEV_DEPS)) {
      if (!devDeps[dep]) {
        devDeps[dep] = version;
        changed = true;
      }
    }

    if (!changed) return;

    pkg.dependencies = deps;
    pkg.devDependencies = devDeps;
    files[packageIndex] = { ...files[packageIndex], content: JSON.stringify(pkg, null, 2) + '\n' };
  } catch {
    // ignore invalid JSON; sanitizer may fix later
  }
}

function ensureTsconfigPaths(files: TemplateFile[]) {
  const tsconfigIndex = files.findIndex((file) => file.path === 'tsconfig.json');
  if (tsconfigIndex === -1) return;

  try {
    const config = JSON.parse(files[tsconfigIndex].content) as any;
    const compilerOptions = (config.compilerOptions ?? {}) as Record<string, any>;
    const paths = (compilerOptions.paths ?? {}) as Record<string, any>;

    let changed = false;

    if (!compilerOptions.baseUrl) {
      compilerOptions.baseUrl = '.';
      changed = true;
    }

    if (!paths['@/*']) {
      paths['@/*'] = ['./src/*'];
      changed = true;
    }

    if (!changed) return;

    compilerOptions.paths = paths;
    config.compilerOptions = compilerOptions;
    files[tsconfigIndex] = { ...files[tsconfigIndex], content: JSON.stringify(config, null, 2) + '\n' };
  } catch {
    // ignore invalid JSON
  }
}

function ensureViteConfigPathsPlugin(files: TemplateFile[]) {
  const viteConfigIndex = files.findIndex((file) => file.path === 'vite.config.ts');
  if (viteConfigIndex === -1) return;

  const original = files[viteConfigIndex].content;
  if (original.includes('vite-tsconfig-paths')) {
    return;
  }

  let next = original;

  if (!next.includes("from 'vite-tsconfig-paths'") && !next.includes('from \"vite-tsconfig-paths\"')) {
    // Insert after the last import line.
    const importMatches = [...next.matchAll(/^import .*$/gm)];
    if (importMatches.length > 0) {
      const last = importMatches[importMatches.length - 1];
      const insertAt = (last.index ?? 0) + last[0].length;
      next = `${next.slice(0, insertAt)}\nimport tsconfigPaths from \"vite-tsconfig-paths\";${next.slice(insertAt)}`;
    } else {
      next = `import tsconfigPaths from \"vite-tsconfig-paths\";\n${next}`;
    }
  }

  if (next.includes('plugins: [') && !next.includes('tsconfigPaths()')) {
    next = next.replace(/plugins\s*:\s*\[/, (match) => `${match}tsconfigPaths(), `);
  }

  if (next !== original) {
    files[viteConfigIndex] = { ...files[viteConfigIndex], content: next };
  }
}
