export type TemplateFile = {
  name: string;
  path: string;
  content: string;
};

export const WEB_BASELINE_FILES: TemplateFile[] = [
  {
    name: 'package.json',
    path: 'package.json',
    content: `{
  "name": "bolt-project",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.6.3",
    "vite": "^5.4.10"
  }
}
`,
  },
  {
    name: 'vite.config.ts',
    path: 'vite.config.ts',
    content: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
});
`,
  },
  {
    name: 'tailwind.config.js',
    path: 'tailwind.config.js',
    content: `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
`,
  },
  {
    name: 'postcss.config.js',
    path: 'postcss.config.js',
    content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`,
  },
  {
    name: 'index.html',
    path: 'index.html',
    content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bolt Project</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
  },
  {
    name: 'tsconfig.json',
    path: 'tsconfig.json',
    content: `{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
`,
  },
  {
    name: 'tsconfig.app.json',
    path: 'tsconfig.app.json',
    content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
`,
  },
  {
    name: 'tsconfig.node.json',
    path: 'tsconfig.node.json',
    content: `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
`,
  },
  {
    name: 'vite-env.d.ts',
    path: 'vite-env.d.ts',
    content: `/// <reference types="vite/client" />
`,
  },
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
    name: 'index.css',
    path: 'src/index.css',
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

body {
  margin: 0;
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f8fafc;
  color: #0f172a;
  min-height: 100vh;
}

#root {
  min-height: 100vh;
}
`,
  },
  {
    name: 'main.tsx',
    path: 'src/main.tsx',
    content: `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`,
  },
  {
    name: 'App.tsx',
    path: 'src/App.tsx',
    content: `import React from "react";

// Minimal neutral shell so LLM fills real sections instead of preset SaaS UI.
// Add your sections inside the main tag below.
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <main className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        {/* Navigation */}
        {/* Hero */}
        {/* Content sections go here */}
      </main>
    </div>
  );
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
  default: "bg-neutral-900 text-white shadow hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200",
  secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700",
  outline: "border border-neutral-300 bg-transparent shadow-sm hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-800",
  ghost: "hover:bg-neutral-100 dark:hover:bg-neutral-800",
  link: "text-neutral-900 underline-offset-4 hover:underline dark:text-white",
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
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50",
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
        "flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500",
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
  default: "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900",
  secondary: "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white",
  destructive: "bg-red-500 text-white",
  outline: "border border-neutral-300 text-neutral-900 dark:border-neutral-600 dark:text-white",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
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
    <div ref={ref} className={cn("rounded-xl border border-neutral-200 bg-white shadow dark:border-neutral-700 dark:bg-neutral-900", className)} {...props} />
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
    <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight text-neutral-900 dark:text-white", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-neutral-500 dark:text-neutral-400", className)} {...props} />
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
  ({ className, ...props }, ref) => <div ref={ref} className={cn("h-px w-full bg-neutral-200 dark:bg-neutral-700", className)} {...props} />,
);
Separator.displayName = "Separator";

export { Separator };
`,
  },
  {
    name: 'hero.svg',
    path: 'public/images/hero.svg',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="600" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#111113"/>
      <stop offset="1" stop-color="#2b2b34"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="#C9A66B" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#C9A66B" stop-opacity="0.15"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    </pattern>
    <filter id="blur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="56" />
    </filter>
  </defs>

  <rect width="1200" height="600" fill="url(#bg)"/>
  <rect width="1200" height="600" fill="url(#grid)"/>

  <circle cx="220" cy="170" r="190" fill="url(#accent)" filter="url(#blur)"/>
  <circle cx="980" cy="430" r="250" fill="url(#accent)" filter="url(#blur)" opacity="0.75"/>

  <rect x="88" y="410" width="560" height="116" rx="22" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.10)"/>
  <path d="M120 466h312" stroke="rgba(255,255,255,0.22)" stroke-width="6" stroke-linecap="round"/>
  <path d="M120 496h228" stroke="rgba(255,255,255,0.16)" stroke-width="6" stroke-linecap="round"/>
  <path d="M120 526h168" stroke="rgba(255,255,255,0.12)" stroke-width="6" stroke-linecap="round"/>
</svg>
`,
  },
  {
    name: 'placeholder.svg',
    path: 'public/images/placeholder.svg',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f1014"/>
      <stop offset="1" stop-color="#161925"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" rx="24" fill="url(#pbg)"/>
  <path d="M40 40L760 560" stroke="rgba(255,255,255,0.10)" stroke-width="2"/>
  <path d="M760 40L40 560" stroke="rgba(255,255,255,0.10)" stroke-width="2"/>
  <rect x="56" y="56" width="688" height="488" rx="22" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)"/>
</svg>
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
  ensureViteConfigImageProxyPlugin(nextFiles);

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
  const viteConfigIndex = files.findIndex((file) => /^vite\.config\.(ts|mts|js|mjs)$/.test(file.path));
  if (viteConfigIndex === -1) return;

  const original = files[viteConfigIndex].content;
  if (original.includes('vite-tsconfig-paths')) {
    return;
  }

  let next = original;

  const isCommonJs = /\bmodule\.exports\b/.test(next) || (/\brequire\(/.test(next) && !/\bexport\s+default\b/.test(next));

  if (isCommonJs) {
    if (!next.includes('vite-tsconfig-paths')) {
      // Insert after the last require line (or at the top if no requires found).
      const requireMatches = [...next.matchAll(/^const .*require\(.*\).*$/gm)];
      if (requireMatches.length > 0) {
        const last = requireMatches[requireMatches.length - 1];
        const insertAt = (last.index ?? 0) + last[0].length;
        next = `${next.slice(0, insertAt)}\nconst tsconfigPaths = require(\"vite-tsconfig-paths\").default;${next.slice(insertAt)}`;
      } else {
        next = `const tsconfigPaths = require(\"vite-tsconfig-paths\").default;\n${next}`;
      }
    }
  } else {
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
  }

  if (next.includes('plugins: [') && !next.includes('tsconfigPaths()')) {
    next = next.replace(/plugins\s*:\s*\[/, (match) => `${match}tsconfigPaths(), `);
  }

  if (next !== original) {
    files[viteConfigIndex] = { ...files[viteConfigIndex], content: next };
  }
}

function ensureViteConfigImageProxyPlugin(files: TemplateFile[]) {
  const viteConfigIndex = files.findIndex((file) => /^vite\.config\.(ts|mts|js|mjs)$/.test(file.path));
  if (viteConfigIndex === -1) return;

  const original = files[viteConfigIndex].content;
  if (original.includes('__image_proxy__') || original.includes('imageProxyPlugin')) {
    return;
  }

  let next = original;

  const pluginImpl = `

function imageProxyPlugin() {
  const fallbackSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>';
  const sendFallback = (res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-store');
    res.end(fallbackSvg);
  };

  return {
    name: 'image-proxy',
    configureServer(server) {
      server.middlewares.use('/__image_proxy__', async (req, res) => {
        try {
          const url = new URL(req.url ?? '', 'http://localhost');
          const target = url.searchParams.get('url');
          if (!target) {
            sendFallback(res);
            return;
          }

          const response = await fetch(target);
          if (!response.ok) {
            sendFallback(res);
            return;
          }

          const buffer = new Uint8Array(await response.arrayBuffer());
          res.setHeader('Content-Type', response.headers.get('content-type') ?? 'image/jpeg');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.end(buffer);
        } catch {
          sendFallback(res);
        }
      });
    },
  };
}
`;

  if (!next.includes('imageProxyPlugin')) {
    next = `${next}\n${pluginImpl}`;
  }

  if (next.includes('plugins: [') && !next.includes('imageProxyPlugin()')) {
    next = next.replace(/plugins\s*:\s*\[/, (match) => `${match}imageProxyPlugin(), `);
  } else if (!next.includes('plugins: [') && next.includes('defineConfig')) {
    next = next.replace(/defineConfig\s*\(\s*\{/g, (match) => `${match}\n  plugins: [imageProxyPlugin()],`);
  } else if (!next.includes('plugins: [') && /export\s+default\s*\{/.test(next)) {
    next = next.replace(/export\s+default\s*\{/, (match) => `${match}\n  plugins: [imageProxyPlugin()],`);
  } else if (!next.includes('plugins: [') && /module\.exports\s*=\s*\{/.test(next)) {
    next = next.replace(/module\.exports\s*=\s*\{/, (match) => `${match}\n  plugins: [imageProxyPlugin()],`);
  }

  if (next !== original) {
    files[viteConfigIndex] = { ...files[viteConfigIndex], content: next };
  }
}
