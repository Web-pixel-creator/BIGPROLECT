# KokonutUI Components

Generated from https://github.com/kokonut-labs/kokonutui (registry.json)

## AI Input Selector (ai-prompt)
Type: registry:component
My own style of chat AI input.
**Dependencies:** deps: lucide-react, motion; registry: textarea, button, dropdown-menu

`$ components/kokonutui/ai-prompt.tsx`
```tsx
"use client";

/**
 * @author: @kokonutui
 * @description: AI Prompt Input
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { ArrowRight, Bot, Check, ChevronDown, Paperclip } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Anthropic from "@/components/icons/anthropic";
import AnthropicDark from "@/components/icons/anthropic-dark";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { cn } from "@/lib/utils";

const OPENAI_SVG = (
  <div>
    <svg
      aria-label="o3-mini icon"
      className="block dark:hidden"
      height="260"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 256 260"
      width="256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>OpenAI Icon Light</title>
      <path d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" />
    </svg>
    <svg
      aria-label="o3-mini icon"
      className="hidden dark:block"
      height="260"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 256 260"
      width="256"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>OpenAI Icon Dark</title>
      <path
        d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z"
        fill="#fff"
      />
    </svg>
  </div>
);

export default function AI_Prompt() {
  const [value, setValue] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 72,
    maxHeight: 300,
  });
  const [selectedModel, setSelectedModel] = useState("Claude 4.5 Sonnet");

  const AI_MODELS = [
    "Gemini 3",
    "GPT-5-mini",
    "Claude 4.5 Sonnet",
    "GPT-5-1 Mini",
    "GPT-5-1",
  ];

  const MODEL_ICONS: Record<string, React.ReactNode> = {
    "GPT-5-mini": OPENAI_SVG,
    "Gemini 3": (
      <svg
        height="1em"
        style={{ flex: "none", lineHeight: "1" }}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Gemini</title>
        <defs>
          <linearGradient
            id="lobe-icons-gemini-fill"
            x1="0%"
            x2="68.73%"
            y1="100%"
            y2="30.395%"
          >
            <stop offset="0%" stopColor="#1C7DFF" />
            <stop offset="52.021%" stopColor="#1C69FF" />
            <stop offset="100%" stopColor="#F0DCD6" />
          </linearGradient>
        </defs>
        <path
          d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
          fill="url(#lobe-icons-gemini-fill)"
          fillRule="nonzero"
        />
      </svg>
    ),
    "Claude 4.5 Sonnet": (
      <div>
        <svg
          className="block dark:hidden"
          fill="#000"
          fillRule="evenodd"
          style={{ flex: "none", lineHeight: "1" }}
          viewBox="0 0 24 24"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Anthropic Icon Light</title>
          <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
        </svg>
        <svg
          className="hidden dark:block"
          fill="#ffff"
          fillRule="evenodd"
          style={{ flex: "none", lineHeight: "1" }}
          viewBox="0 0 24 24"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Anthropic Icon Dark</title>
          <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
        </svg>
      </div>
    ),
    "GPT-5-1 Mini": OPENAI_SVG,
    "GPT-5-1": OPENAI_SVG,
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setValue("");
      adjustHeight(true);
    }
  };

  return (
    <div className="w-4/6 py-4">
      <div className="rounded-2xl bg-black/5 p-1.5 pt-4 dark:bg-white/5">
        <div className="mx-2 mb-2.5 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2">
            <Anthropic className="h-3.5 w-3.5 text-black dark:hidden" />
            <AnthropicDark className="hidden h-3.5 w-3.5 dark:block" />
            <h3 className="text-black text-xs tracking-tighter dark:text-white/90">
              is free this weekend!
            </h3>
          </div>
          <p className="text-black text-xs tracking-tighter dark:text-white/90">
            Ship Now!
          </p>
        </div>
        <div className="relative">
          <div className="relative flex flex-col">
            <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
              <Textarea
                className={cn(
                  "w-full resize-none rounded-xl rounded-b-none border-none bg-black/5 px-4 py-3 placeholder:text-black/70 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-white/5 dark:text-white dark:placeholder:text-white/70",
                  "min-h-[72px]"
                )}
                id="ai-input-15"
                onChange={(e) => {
                  setValue(e.target.value);
                  adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                placeholder={"What can I do for you?"}
                ref={textareaRef}
                value={value}
              />
            </div>

            <div className="flex h-14 items-center rounded-b-xl bg-black/5 dark:bg-white/5">
              <div className="absolute right-3 bottom-3 left-3 flex w-[calc(100%-24px)] items-center justify-between">
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="flex h-8 items-center gap-1 rounded-md pr-2 pl-1 text-xs hover:bg-black/10 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 dark:text-white dark:hover:bg-white/10"
                        variant="ghost"
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            className="flex items-center gap-1"
                            exit={{
                              opacity: 0,
                              y: 5,
                            }}
                            initial={{
                              opacity: 0,
                              y: -5,
                            }}
                            key={selectedModel}
                            transition={{
                              duration: 0.15,
                            }}
                          >
                            {MODEL_ICONS[selectedModel]}
                            {selectedModel}
                            <ChevronDown className="h-3 w-3 opacity-50" />
                          </motion.div>
                        </AnimatePresence>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className={cn(
                        "min-w-[10rem]",
                        "border-black/10 dark:border-white/10",
                        "bg-gradient-to-b from-white via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800"
                      )}
                    >
                      {AI_MODELS.map((model) => (
                        <DropdownMenuItem
                          className="flex items-center justify-between gap-2"
                          key={model}
                          onSelect={() => setSelectedModel(model)}
                        >
                          <div className="flex items-center gap-2">
                            {MODEL_ICONS[model] || (
                              <Bot className="h-4 w-4 opacity-50" />
                            )}{" "}
                            {/* Use mapped SVG or fallback */}
                            <span>{model}</span>
                          </div>
                          {selectedModel === model && (
                            <Check className="h-4 w-4 text-blue-500" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="mx-0.5 h-4 w-px bg-black/10 dark:bg-white/10" />
                  <label
                    aria-label="Attach file"
                    className={cn(
                      "cursor-pointer rounded-lg bg-black/5 p-2 dark:bg-white/5",
                      "hover:bg-black/10 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 dark:hover:bg-white/10",
                      "text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
                    )}
                  >
                    <input className="hidden" type="file" />
                    <Paperclip className="h-4 w-4 transition-colors" />
                  </label>
                </div>
                <button
                  aria-label="Send message"
                  className={cn(
                    "rounded-lg bg-black/5 p-2 dark:bg-white/5",
                    "hover:bg-black/10 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0 dark:hover:bg-white/10"
                  )}
                  disabled={!value.trim()}
                  type="button"
                >
                  <ArrowRight
                    className={cn(
                      "h-4 w-4 transition-opacity duration-200 dark:text-white",
                      value.trim() ? "opacity-100" : "opacity-30"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

```

`$ hooks/use-auto-resize-textarea.ts`
```tsx
import { useEffect, useRef, useCallback } from "react";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

export function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            // Temporarily shrink to get the right scrollHeight
            textarea.style.height = `${minHeight}px`;

            // Calculate new height
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        // Set initial height
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    // Adjust height on window resize
    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

```

`$ components/icons/anthropic.tsx`
```tsx
const Anthropic = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        fill="#000"
        fillRule="evenodd"
        style={{
            flex: "none",
            lineHeight: 1,
        }}
        viewBox="0 0 24 24"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        height="1em"
        {...props}
    >
        <title>{"Anthropic"}</title>
        <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
    </svg>
);
export default Anthropic;

```

`$ components/icons/anthropic-dark.tsx`
```tsx
import type { SVGProps } from "react";
const AnthropicDark = (props: SVGProps<SVGSVGElement>) => (
    <svg
        fill="#ffff"
        fillRule="evenodd"
        style={{
            flex: "none",
            lineHeight: 1,
        }}
        viewBox="0 0 24 24"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        height="1em"
        {...props}
    >
        <title>{"Anthropic"}</title>
        <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
    </svg>
);
export default AnthropicDark;

```


## Command Button (command-button)
Type: registry:component
Command button for shortcut.
**Dependencies:** deps: lucide-react; registry: button

`$ components/kokonutui/command-button.tsx`
```tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Command } from "lucide-react";

/**
 * @author: @dorian_baffier
 * @description: Command Button
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

export default function CommandButton({
    className,
    children,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
}) {
    return (
        <Button
            {...props}
            className={cn(
                "relative p-2",
                "rounded-lg overflow-hidden",
                "bg-gradient-to-b from-zinc-50 to-zinc-100",
                "dark:from-zinc-800 dark:to-zinc-900",
                "border border-zinc-200 dark:border-zinc-800",
                "hover:border-zinc-300 dark:hover:border-zinc-700",
                "transition-all duration-300 ease-out",
                "group",
                "inline-flex items-center justify-center",
                "gap-2",
                className
            )}
        >
            <Command
                className={cn(
                    "w-4 h-4",
                    "text-zinc-600 dark:text-zinc-400",
                    "transition-all duration-300",
                    "group-hover:scale-110",
                    "group-hover:rotate-[-4deg]",
                    "group-active:scale-95"
                )}
            />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {children || "CMD + K"}
            </span>
            <span
                className={cn(
                    "absolute inset-0",
                    "bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0",
                    "translate-x-[-100%]",
                    "group-hover:translate-x-[100%]",
                    "transition-transform duration-500",
                    "ease-out"
                )}
            />
        </Button>
    );
}

```


## Card Flip (card-flip)
Type: registry:component
Animated flip card with gradient button and animation.
**Dependencies:** deps: lucide-react

`$ components/kokonutui/card-flip.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Card Flip
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { cn } from "@/lib/utils";
import { ArrowRight, Repeat2 } from "lucide-react";
import { useState } from "react";

export interface CardFlipProps {
    title?: string;
    subtitle?: string;
    description?: string;
    features?: string[];
}

export default function CardFlip({
    title = "Design Systems",
    subtitle = "Explore the fundamentals",
    description = "Dive deep into the world of modern UI/UX design.",
    features = ["UI/UX", "Modern Design", "Tailwind CSS", "Kokonut UI"],
}: CardFlipProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className="relative w-full max-w-[280px] h-[320px] group [perspective:2000px]"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <div
                className={cn(
                    "relative w-full h-full",
                    "[transform-style:preserve-3d]",
                    "transition-all duration-700",
                    isFlipped
                        ? "[transform:rotateY(180deg)]"
                        : "[transform:rotateY(0deg)]"
                )}
            >
                <div
                    className={cn(
                        "absolute inset-0 w-full h-full",
                        "[backface-visibility:hidden] [transform:rotateY(0deg)]",
                        "overflow-hidden rounded-2xl",
                        "bg-zinc-50 dark:bg-zinc-900",
                        "border border-zinc-200 dark:border-zinc-800/50",
                        "shadow-xs dark:shadow-lg",
                        "transition-all duration-700",
                        "group-hover:shadow-lg dark:group-hover:shadow-xl",
                        isFlipped ? "opacity-0" : "opacity-100"
                    )}
                >
                    <div className="relative h-full overflow-hidden bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-black">
                        <div className="absolute inset-0 flex items-start justify-center pt-24">
                            <div className="relative w-[200px] h-[100px] flex items-center justify-center">
                                {[...Array(10)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "absolute w-[50px] h-[50px]",
                                            "rounded-[140px]",
                                            "animate-[scale_3s_linear_infinite]",
                                            "opacity-0",
                                            "shadow-[0_0_50px_rgba(255,165,0,0.5)]",
                                            "group-hover:animate-[scale_2s_linear_infinite]"
                                        )}
                                        style={{
                                            animationDelay: `${i * 0.3}s`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="flex items-center justify-between gap-3">
                            <div className="space-y-1.5">
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white leading-snug tracking-tighter transition-all duration-500 ease-out-expo group-hover:translate-y-[-4px]">
                                    {title}
                                </h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-200 line-clamp-2 tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-4px] delay-[50ms]">
                                    {subtitle}
                                </p>
                            </div>
                            <div className="relative group/icon">
                                <div
                                    className={cn(
                                        "absolute inset-[-8px] rounded-lg transition-opacity duration-300",
                                        "bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent"
                                    )}
                                />
                                <Repeat2 className="relative z-10 w-4 h-4 text-orange-500 transition-transform duration-300 group-hover/icon:scale-110 group-hover/icon:-rotate-12" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back of card */}
                <div
                    className={cn(
                        "absolute inset-0 w-full h-full",
                        "[backface-visibility:hidden] [transform:rotateY(180deg)]",
                        "p-6 rounded-2xl",
                        "bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-black",
                        "border border-zinc-200 dark:border-zinc-800",
                        "shadow-xs dark:shadow-lg",
                        "flex flex-col",
                        "transition-all duration-700",
                        "group-hover:shadow-lg dark:group-hover:shadow-xl",
                        !isFlipped ? "opacity-0" : "opacity-100"
                    )}
                >
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white leading-snug tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-2px]">
                                {title}
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-2px] line-clamp-2">
                                {description}
                            </p>
                        </div>

                        <div className="space-y-2">
                            {features.map((feature, index) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 transition-all duration-500"
                                    style={{
                                        transform: isFlipped
                                            ? "translateX(0)"
                                            : "translateX(-10px)",
                                        opacity: isFlipped ? 1 : 0,
                                        transitionDelay: `${
                                            index * 100 + 200
                                        }ms`,
                                    }}
                                >
                                    <ArrowRight className="w-3 h-3 text-orange-500" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-800">
                        <div
                            className={cn(
                                "group/start relative",
                                "flex items-center justify-between",
                                "p-3 -m-3 rounded-xl",
                                "transition-all duration-300",
                                "bg-gradient-to-r from-zinc-100 via-zinc-100 to-zinc-100",
                                "dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-800",
                                "hover:from-orange-500/10 hover:from-0% hover:via-orange-500/5 hover:via-100% hover:to-transparent hover:to-100%",
                                "dark:hover:from-orange-500/20 dark:hover:from-0% dark:hover:via-orange-500/10 dark:hover:via-100% dark:hover:to-transparent dark:hover:to-100%",
                                "hover:scale-[1.02] hover:cursor-pointer"
                            )}
                        >
                            <span className="text-sm font-medium text-zinc-900 dark:text-white transition-colors duration-300 group-hover/start:text-orange-600 dark:group-hover/start:text-orange-400">
                                Start today
                            </span>
                            <div className="relative group/icon">
                                <div
                                    className={cn(
                                        "absolute inset-[-6px] rounded-lg transition-all duration-300",
                                        "bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent",
                                        "opacity-0 group-hover/start:opacity-100 scale-90 group-hover/start:scale-100"
                                    )}
                                />
                                <ArrowRight className="relative z-10 w-4 h-4 text-orange-500 transition-all duration-300 group-hover/start:translate-x-0.5 group-hover/start:scale-110" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scale {
                    0% {
                        transform: scale(2);
                        opacity: 0;
                        box-shadow: 0px 0px 50px rgba(255, 165, 0, 0.5);
                    }
                    50% {
                        transform: translate(0px, -5px) scale(1);
                        opacity: 1;
                        box-shadow: 0px 8px 20px rgba(255, 165, 0, 0.5);
                    }
                    100% {
                        transform: translate(0px, 5px) scale(0.1);
                        opacity: 0;
                        box-shadow: 0px 10px 20px rgba(255, 165, 0, 0);
                    }
                }
            `}</style>
        </div>
    );
}

```


## Smooth Drawer (smooth-drawer)
Type: registry:component
Smooth slide-in drawer. (this was harder than i thought to make that one)
**Dependencies:** deps: motion; registry: drawer, button

`$ components/kokonutui/smooth-drawer.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Smooth Drawer
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Fingerprint } from "lucide-react";

interface PriceTagProps {
    price: number;
    discountedPrice: number;
}

function PriceTag({ price, discountedPrice }: PriceTagProps) {
    return (
        <div className="flex items-center justify-around gap-4 max-w-fit mx-auto">
            <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
                    ${discountedPrice}
                </span>
                <span className="text-lg line-through text-zinc-400 dark:text-zinc-500">
                    ${price}
                </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Lifetime access
                </span>
                <span className="text-xs text-zinc-700 dark:text-zinc-300">
                    One-time payment
                </span>
            </div>
        </div>
    );
}

interface DrawerDemoProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    description?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
    price?: number;
    discountedPrice?: number;
}

const drawerVariants = {
    hidden: {
        y: "100%",
        opacity: 0,
        rotateX: 5,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
        },
    },
    visible: {
        y: 0,
        opacity: 1,
        rotateX: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8,
            staggerChildren: 0.07,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: {
        y: 20,
        opacity: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
        },
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8,
        },
    },
};

export default function SmoothDrawer({
    title = "KokonutUI - Pro",
    description = "100+ collection of UI Components and templates built for React, Next.js, and Tailwind CSS. Spend no time on design and focus on shipping.",
    primaryButtonText = "Buy Now",
    secondaryButtonText = "Maybe Later",
    onSecondaryAction,
    price = 169,
    discountedPrice = 99,
}: DrawerDemoProps) {
    const handleSecondaryClick = () => {
        onSecondaryAction?.();
    };

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline">Open Drawer</Button>
            </DrawerTrigger>
            <DrawerContent className="max-w-fit mx-auto p-6 rounded-2xl shadow-xl">
                <motion.div
                    variants={drawerVariants as any}
                    initial="hidden"
                    animate="visible"
                    className="mx-auto w-full max-w-[340px] space-y-6"
                >
                    <motion.div variants={itemVariants as any}>
                        <DrawerHeader className="px-0 space-y-2.5">
                            <DrawerTitle className="text-2xl font-semibold flex items-center gap-2.5 tracking-tighter">
                                <motion.div variants={itemVariants as any}>
                                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 shadow-inner">
                                        <Image
                                            src="/logo.svg"
                                            alt="Logo"
                                            width={32}
                                            height={32}
                                        />
                                    </div>
                                </motion.div>
                                <motion.span variants={itemVariants as any}>
                                    {title}
                                </motion.span>
                            </DrawerTitle>
                            <motion.div variants={itemVariants as any}>
                                <DrawerDescription className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 tracking-tighter">
                                    {description}
                                </DrawerDescription>
                            </motion.div>
                        </DrawerHeader>
                    </motion.div>

                    <motion.div variants={itemVariants as any}>
                        <PriceTag
                            price={price}
                            discountedPrice={discountedPrice}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants as any}>
                        <DrawerFooter className="flex flex-col gap-3 px-0">
                            <div className="w-full">
                                <Link
                                    href="https://kokonutui.pro/#pricing"
                                    target="_blank"
                                    className="group w-full relative overflow-hidden inline-flex items-center justify-center h-11 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 dark:from-rose-600 dark:to-pink-600 text-white text-sm font-semibold tracking-wide shadow-lg shadow-rose-500/20 transition-all duration-500 hover:shadow-xl hover:shadow-rose-500/30 hover:from-rose-600 hover:to-pink-600 dark:hover:from-rose-500 dark:hover:to-pink-500"
                                >
                                    <motion.span
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%]"
                                        whileHover={{
                                            x: ["-200%", "200%"],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            ease: "easeInOut",
                                            repeat: 0,
                                        }}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative flex items-center gap-2 tracking-tighter"
                                    >
                                        {primaryButtonText}
                                        <motion.div
                                            animate={{
                                                rotate: [0, 15, -15, 0],
                                                y: [0, -2, 2, 0],
                                            }}
                                            transition={{
                                                duration: 2,
                                                ease: "easeInOut",
                                                repeat: Number.POSITIVE_INFINITY,
                                                repeatDelay: 1,
                                            }}
                                        >
                                            <Fingerprint className="w-4 h-4" />
                                        </motion.div>
                                    </motion.div>
                                </Link>
                            </div>
                            <DrawerClose asChild>
                                <Button
                                    variant="outline"
                                    onClick={handleSecondaryClick}
                                    className="w-full h-11 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-sm font-semibold transition-colors tracking-tighter"
                                >
                                    {secondaryButtonText}
                                </Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </motion.div>
                </motion.div>
            </DrawerContent>
        </Drawer>
    );
}

```


## Shapes Hero (shape-hero)
Type: registry:component
Shapes that fall from the top.
**Dependencies:** deps: motion

`$ components/kokonutui/shape-hero.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Shape Hero
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { motion } from "motion/react";
import { Pacifico } from "next/font/google";
import { cn } from "@/lib/utils";

const pacifico = Pacifico({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-pacifico",
});

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
    borderRadius = 16,
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
    borderRadius?: number;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    style={{ borderRadius }}
                    className={cn(
                        "absolute inset-0",
                        "bg-linear-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[1px]",
                        "ring-1 ring-white/[0.03] dark:ring-white/[0.02]",
                        "shadow-[0_2px_16px_-2px_rgba(255,255,255,0.04)]",
                        "after:absolute after:inset-0",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.12),transparent_70%)]",
                        "after:rounded-[inherit]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

export default function ShapeHero({
    title1 = "Elevate Your",
    title2 = "Digital Vision",
}: {
    title1?: string;
    title2?: string;
}) {
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
            },
        }),
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-[#030303]">
            <div className="absolute inset-0 bg-linear-to-br from-indigo-500/[0.02] via-transparent to-rose-500/[0.02] dark:from-indigo-500/[0.05] dark:via-transparent dark:to-rose-500/[0.05] blur-3xl" />

            <div className="absolute inset-0 overflow-hidden">
                {/* Tall rectangle - top left */}
                <ElegantShape
                    delay={0.3}
                    width={300}
                    height={500}
                    rotate={-8}
                    borderRadius={24}
                    gradient="from-indigo-500/[0.25] dark:from-indigo-500/[0.35]"
                    className="left-[-15%] top-[-10%]"
                />

                {/* Wide rectangle - bottom right */}
                <ElegantShape
                    delay={0.5}
                    width={600}
                    height={200}
                    rotate={15}
                    borderRadius={20}
                    gradient="from-rose-500/[0.25] dark:from-rose-500/[0.35]"
                    className="right-[-20%] bottom-[-5%]"
                />

                {/* Square - middle left */}
                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={300}
                    rotate={24}
                    borderRadius={32}
                    gradient="from-violet-500/[0.25] dark:from-violet-500/[0.35]"
                    className="left-[-5%] top-[40%]"
                />

                {/* Small rectangle - top right */}
                <ElegantShape
                    delay={0.6}
                    width={250}
                    height={100}
                    rotate={-20}
                    borderRadius={12}
                    gradient="from-amber-500/[0.25] dark:from-amber-500/[0.35]"
                    className="right-[10%] top-[5%]"
                />

                {/* New shapes */}
                {/* Medium rectangle - center right */}
                <ElegantShape
                    delay={0.7}
                    width={400}
                    height={150}
                    rotate={35}
                    borderRadius={16}
                    gradient="from-emerald-500/[0.25] dark:from-emerald-500/[0.35]"
                    className="right-[-10%] top-[45%]"
                />

                {/* Small square - bottom left */}
                <ElegantShape
                    delay={0.2}
                    width={200}
                    height={200}
                    rotate={-25}
                    borderRadius={28}
                    gradient="from-blue-500/[0.25] dark:from-blue-500/[0.35]"
                    className="left-[20%] bottom-[10%]"
                />

                {/* Tiny rectangle - top center */}
                <ElegantShape
                    delay={0.8}
                    width={150}
                    height={80}
                    rotate={45}
                    borderRadius={10}
                    gradient="from-purple-500/[0.25] dark:from-purple-500/[0.35]"
                    className="left-[40%] top-[15%]"
                />

                {/* Wide rectangle - middle */}
                <ElegantShape
                    delay={0.9}
                    width={450}
                    height={120}
                    rotate={-12}
                    borderRadius={18}
                    gradient="from-teal-500/[0.25] dark:from-teal-500/[0.35]"
                    className="left-[25%] top-[60%]"
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        custom={1}
                        variants={fadeUpVariants as any}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
                            <span className="bg-clip-text text-transparent bg-linear-to-b from-black to-black/80 dark:from-white dark:to-white/80">
                                {title1}
                            </span>
                            <br />
                            <span
                                className={cn(
                                    "bg-clip-text text-transparent bg-linear-to-r from-indigo-300 via-black/90 to-rose-300 dark:from-indigo-300 dark:via-white/90 dark:to-rose-300",
                                    pacifico.className
                                )}
                            >
                                {title2}
                            </span>
                        </h1>
                    </motion.div>
                    <motion.div
                        custom={2}
                        variants={fadeUpVariants as any}
                        initial="hidden"
                        animate="visible"
                    >
                        <p className="text-base sm:text-lg md:text-xl text-black/40 dark:text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
                            UI Components built with Tailwind CSS.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-white/80 dark:from-[#030303] dark:via-transparent dark:to-[#030303]/80 pointer-events-none" />
        </div>
    );
}

```


## AI Text Loading (ai-text-loading)
Type: registry:component
Thinking mode.
**Dependencies:** deps: motion

`$ components/kokonutui/ai-text-loading.tsx`
```tsx
"use client";

/**
 * @author: @kokonutui
 * @description: AI Text Loading
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

interface AITextLoadingProps {
    texts?: string[];
    className?: string;
    interval?: number;
}

export default function AITextLoading({
    texts = [
        "Thinking...",
        "Processing...",
        "Analyzing...",
        "Computing...",
        "Almost...",
    ],
    className,
    interval = 1500,
}: AITextLoadingProps) {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }, interval);

        return () => clearInterval(timer);
    }, [interval, texts.length]);

    return (
        <div className="flex items-center justify-center p-8">
            <motion.div
                className="relative px-4 py-2 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentTextIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            backgroundPosition: ["200% center", "-200% center"],
                        }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                            opacity: { duration: 0.3 },
                            y: { duration: 0.3 },
                            backgroundPosition: {
                                duration: 2.5,
                                ease: "linear",
                                repeat: Infinity,
                            },
                        }}
                        className={cn(
                            "flex justify-center text-3xl font-bold bg-gradient-to-r from-neutral-950 via-neutral-400 to-neutral-950 dark:from-white dark:via-neutral-600 dark:to-white bg-[length:200%_100%] bg-clip-text text-transparent whitespace-nowrap min-w-max",
                            className
                        )}
                    >
                        {texts[currentTextIndex]}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

```


## Shimmer Text (shimmer-text)
Type: registry:component
Quite fancy.
**Dependencies:** deps: motion

`$ components/kokonutui/shimmer-text.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Shimmer Text
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface Text_01Props {
    text: string;
    className?: string;
}

export default function ShimmerText({
    text = "Text Shimmer",
    className,
}: Text_01Props) {
    return (
        <div className="flex items-center justify-center p-8">
            <motion.div
                className="relative px-4 py-2 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.h1
                    className={cn(
                        "text-3xl font-bold bg-gradient-to-r from-neutral-950 via-neutral-400 to-neutral-950 dark:from-white dark:via-neutral-600 dark:to-white bg-[length:200%_100%] bg-clip-text text-transparent",
                        className
                    )}
                    animate={{
                        backgroundPosition: ["200% center", "-200% center"],
                    }}
                    transition={{
                        duration: 2.5,
                        ease: "linear",
                        repeat: Number.POSITIVE_INFINITY,
                    }}
                >
                    {text}
                </motion.h1>
            </motion.div>
        </div>
    );
}

```


## Carousel Cards (carousel-cards)
Type: registry:component
Interactive carousel with card navigation.
**Dependencies:** deps: lucide-react; registry: card, badge, button

`$ components/kokonutui/carousel-cards.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Carousel Cards
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import React from "react";
import { Heart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ExperienceItem {
    id: string;
    title: string;
    image: string;
    location: string;
    price: number;
    currency?: string;
    rating?: number;
    reviewCount?: number;
    badge?: string;
    date?: string;
}

interface ExperienceGridProps {
    title: string;
    items: ExperienceItem[];
    viewAllHref?: string;
}

const sampleExperiences: ExperienceItem[] = [
    {
        id: "1",
        title: "Become an Otaku Hottie with Megan Thee Stallion",
        image: "https://images.unsplash.com/photo-1615571022219-eb45cf7faa9d",
        location: "Los Angeles, United States",
        price: 120,
        currency: "€",
        rating: 4.97,
        reviewCount: 128,
        badge: "Original",
        date: "Closes May 21",
    },
    {
        id: "2",
        title: "Spend a Sunday Funday with Patrick Mahomes",
        image: "https://images.unsplash.com/photo-1622127922040-13cab637ee78",
        location: "Kansas City, United States",
        price: 150,
        currency: "€",
        rating: 4.92,
        reviewCount: 86,
        badge: "Original",
        date: "Closes Today",
    },
    {
        id: "3",
        title: "Celebrate with SEVENTEEN on their 10th anniversary",
        image: "https://images.unsplash.com/photo-1534430480872-3498386e7856",
        location: "Seoul, South Korea",
        price: 200,
        currency: "€",
        rating: 4.98,
        reviewCount: 254,
        badge: "Original",
        date: "Closed May 17",
    },
    {
        id: "4",
        title: "Learn the secrets of French pastry with nonnas",
        image: "https://images.unsplash.com/photo-1604999333679-b86d54738315",
        location: "Paris, France",
        price: 70,
        currency: "€",
        rating: 4.97,
        reviewCount: 112,
        badge: "Original",
    },
    {
        id: "5",
        title: "Uncover the world of cabaret with a burlesque show",
        image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b",
        location: "Paris, France",
        price: 92,
        currency: "€",
        rating: 4.9,
        reviewCount: 78,
        badge: "Original",
    },
    {
        id: "6",
        title: "The Super Powers of Art-family Game at the Louvre",
        image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0",
        location: "Paris, France",
        price: 90,
        currency: "€",
        rating: 4.98,
        reviewCount: 146,
        badge: "Original",
    },
    {
        id: "7",
        title: "Savor tasty vegan pastries with a plant-based pro",
        image: "https://images.unsplash.com/photo-1608830597604-619220679440",
        location: "Paris, France",
        price: 75,
        currency: "€",
        rating: 4.95,
        reviewCount: 92,
        badge: "Original",
    },
];

const popularExperiences: ExperienceItem[] = [
    {
        id: "p1",
        title: "Learn to bake the French Croissant",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a",
        location: "Paris, France",
        price: 95,
        currency: "€",
        rating: 4.95,
        reviewCount: 218,
        badge: "Popular",
    },
    {
        id: "p2",
        title: "Seek out hidden speakeasy bars in the city",
        image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187",
        location: "Paris, France",
        price: 74,
        currency: "€",
        rating: 4.9,
        reviewCount: 165,
        badge: "Popular",
    },
    {
        id: "p3",
        title: "Versailles Food and Palace Bike Tour",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a",
        location: "Versailles, France",
        price: 122,
        currency: "€",
        rating: 4.97,
        reviewCount: 89,
        badge: "Popular",
    },
    {
        id: "p4",
        title: "Haunted Paris Tour - Ghosts, Legends, True Crime",
        image: "https://images.unsplash.com/photo-1549144511-f099e773c147",
        location: "Paris, France",
        price: 25,
        currency: "€",
        rating: 4.98,
        reviewCount: 345,
        badge: "Popular",
    },
    {
        id: "p5",
        title: "Learn to make the French macarons with a chef",
        image: "https://images.unsplash.com/photo-1558326567-98ae2405596b",
        location: "Paris, France",
        price: 110,
        currency: "€",
        rating: 4.95,
        reviewCount: 203,
        badge: "Popular",
    },
    {
        id: "p6",
        title: "No Diet Club - Best food tour in Le Marais",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
        location: "Paris, France",
        price: 65,
        currency: "€",
        rating: 4.92,
        reviewCount: 178,
        badge: "5 spots left",
    },
    {
        id: "p7",
        title: "Soak up the nightlife of Paris",
        image: "https://images.unsplash.com/photo-1546636889-ba9fdd63583e",
        location: "Paris, France",
        price: 20,
        currency: "€",
        rating: 4.94,
        reviewCount: 112,
        badge: "Popular",
    },
];

const ExperienceCard = ({ experience }: { experience: ExperienceItem }) => {
    return (
        <Card className="group relative w-full h-[320px] rounded-xl border-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl">
                <Image
                    src={experience.image}
                    alt={experience.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 z-10 text-neutral-700 hover:text-black"
                >
                    <Heart className="w-4 h-4 stroke-[2px]" />
                    <span className="sr-only">Add to favorites</span>
                </Button>
                {experience.badge && (
                    <Badge className="absolute top-2 left-2 bg-white/90 text-black text-xs font-medium px-1.5 py-0.5 rounded-md">
                        {experience.badge}
                    </Badge>
                )}
            </div>

            <div className="flex flex-col flex-1 justify-between">
                <CardContent className="p-2 pt-3 pb-0">
                    <h3 className="font-medium text-sm tracking-tight ">
                        {experience.title}
                    </h3>
                    <p className="text-xs text-muted-foreground tracking-tight">
                        {experience.location}
                    </p>
                    {experience.date && (
                        <p className="text-xs text-muted-foreground tracking-tight">
                            {experience.date}
                        </p>
                    )}
                </CardContent>

                <CardFooter className="p-2 pt-0 flex items-center gap-0.5 text-xs mt-auto">
                    {experience.rating && (
                        <span className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-current" />
                            {experience.rating}
                        </span>
                    )}
                    {experience.reviewCount && (
                        <span className="text-muted-foreground text-xs tracking-tight">
                            {experience.rating && "·"}
                            {experience.reviewCount > 0
                                ? ` (${experience.reviewCount})`
                                : ""}
                        </span>
                    )}
                    <span className="ml-auto text-xs tracking-tight">
                        {experience.currency || "€"} {experience.price} / guest
                    </span>
                </CardFooter>
            </div>
        </Card>
    );
};

const ExperienceSection = ({
    title,
    items,
    viewAllHref = "#",
}: ExperienceGridProps) => {
    const scrollContainer = React.useRef<HTMLDivElement>(null);

    const handleScrollLeft = () => {
        if (scrollContainer.current) {
            scrollContainer.current.scrollBy({
                left: -320,
                behavior: "smooth",
            });
        }
    };

    const handleScrollRight = () => {
        if (scrollContainer.current) {
            scrollContainer.current.scrollBy({ left: 320, behavior: "smooth" });
        }
    };

    return (
        <div className="w-full py-4">
            <div className="max-w-[1760px] mx-auto px-4">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="font-medium text-lg md:text-xl tracking-tight">
                        {title}
                    </h2>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full w-7 h-7 border-neutral-200 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
                            onClick={handleScrollLeft}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="sr-only">Scroll left</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full w-7 h-7 border-neutral-200 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
                            onClick={handleScrollRight}
                        >
                            <ChevronRight className="w-4 h-4" />
                            <span className="sr-only">Scroll right</span>
                        </Button>
                        <Link
                            href="#"
                            className="hidden md:block text-xs font-medium ml-1 hover:underline"
                        >
                            Show all
                        </Link>
                    </div>
                </div>

                <div
                    ref={scrollContainer}
                    className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-1 px-1"
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                >
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex-none w-[240px] md:w-[260px] snap-start"
                        >
                            <Link
                                href="#"
                                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded-xl"
                            >
                                <ExperienceCard experience={item} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function CarouselCards() {
    return (
        <div className="w-full space-y-4 mt-4">
            <ExperienceSection
                title="Airbnb Originals ›"
                items={sampleExperiences}
                viewAllHref="#"
            />
            <ExperienceSection
                title="Popular experiences in Paris"
                items={popularExperiences}
                viewAllHref="#"
            />
        </div>
    );
}

```


## File Upload (file-upload)
Type: registry:component
File upload with special uploading animation. Make sure to try the drag and drop.
**Dependencies:** deps: lucide-react, motion

`$ components/kokonutui/file-upload.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: File Upload
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import {
    useState,
    useRef,
    useCallback,
    type DragEvent,
    useEffect,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { UploadCloud, File as FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FileStatus = "idle" | "dragging" | "uploading" | "error";

interface FileError {
    message: string;
    code: string;
}

interface FileUploadProps {
    onUploadSuccess?: (file: File) => void;
    onUploadError?: (error: FileError) => void;
    acceptedFileTypes?: string[];
    maxFileSize?: number;
    currentFile?: File | null;
    onFileRemove?: () => void;
    /** Duration in milliseconds for the upload simulation. Defaults to 2000ms (2s), 0 for no simulation */
    uploadDelay?: number;
    validateFile?: (file: File) => FileError | null;
    className?: string;
}

const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_STEP_SIZE = 5;
const FILE_SIZES = [
    "Bytes",
    "KB",
    "MB",
    "GB",
    "TB",
    "PB",
    "EB",
    "ZB",
    "YB",
] as const;

const formatBytes = (bytes: number, decimals = 2): string => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const unit = FILE_SIZES[i] || FILE_SIZES[FILE_SIZES.length - 1];
    return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${unit}`;
};

const UploadIllustration = () => (
    <div className="relative w-16 h-16">
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            aria-label="Upload illustration"
        >
            <title>Upload File Illustration</title>
            <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="2"
                strokeDasharray="4 4"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="60s"
                    repeatCount="indefinite"
                />
            </circle>

            <path
                d="M30 35H70C75 35 75 40 75 40V65C75 70 70 70 70 70H30C25 70 25 65 25 65V40C25 35 30 35 30 35Z"
                className="fill-blue-100 dark:fill-blue-900/30 stroke-blue-500 dark:stroke-blue-400"
                strokeWidth="2"
            >
                <animate
                    attributeName="d"
                    dur="2s"
                    repeatCount="indefinite"
                    values="
                        M30 35H70C75 35 75 40 75 40V65C75 70 70 70 70 70H30C25 70 25 65 25 65V40C25 35 30 35 30 35Z;
                        M30 38H70C75 38 75 43 75 43V68C75 73 70 73 70 73H30C25 73 25 68 25 68V43C25 38 30 38 30 38Z;
                        M30 35H70C75 35 75 40 75 40V65C75 70 70 70 70 70H30C25 70 25 65 25 65V40C25 35 30 35 30 35Z"
                />
            </path>

            <path
                d="M30 35C30 35 35 35 40 35C45 35 45 30 50 30C55 30 55 35 60 35C65 35 70 35 70 35"
                className="stroke-blue-500 dark:stroke-blue-400"
                strokeWidth="2"
                fill="none"
            />

            <g className="transform translate-y-2">
                <line
                    x1="50"
                    y1="45"
                    x2="50"
                    y2="60"
                    className="stroke-blue-500 dark:stroke-blue-400"
                    strokeWidth="2"
                    strokeLinecap="round"
                >
                    <animate
                        attributeName="y2"
                        values="60;55;60"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                </line>
                <polyline
                    points="42,52 50,45 58,52"
                    className="stroke-blue-500 dark:stroke-blue-400"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                >
                    <animate
                        attributeName="points"
                        values="42,52 50,45 58,52;42,47 50,40 58,47;42,52 50,45 58,52"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                </polyline>
            </g>
        </svg>
    </div>
);

const UploadingAnimation = ({ progress }: { progress: number }) => (
    <div className="relative w-16 h-16">
        <svg
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            aria-label={`Upload progress: ${Math.round(progress)}%`}
        >
            <title>Upload Progress Indicator</title>

            <defs>
                <mask id="progress-mask">
                    <rect width="240" height="240" fill="black" />
                    <circle
                        r="120"
                        cx="120"
                        cy="120"
                        fill="white"
                        strokeDasharray={`${(progress / 100) * 754}, 754`}
                        transform="rotate(-90 120 120)"
                    />
                </mask>
            </defs>

            <style>
                {`
                    @keyframes rotate-cw {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes rotate-ccw {
                        from { transform: rotate(360deg); }
                        to { transform: rotate(0deg); }
                    }
                    .g-spin circle {
                        transform-origin: 120px 120px;
                    }
                    .g-spin circle:nth-child(1) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(2) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(3) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(4) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(5) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(6) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(7) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(8) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(9) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(10) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(11) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(12) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(13) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(14) { animation: rotate-ccw 8s linear infinite; }

                    .g-spin circle:nth-child(2n) { animation-delay: 0.2s; }
                    .g-spin circle:nth-child(3n) { animation-delay: 0.3s; }
                    .g-spin circle:nth-child(5n) { animation-delay: 0.5s; }
                    .g-spin circle:nth-child(7n) { animation-delay: 0.7s; }
                `}
            </style>

            <g
                className="g-spin"
                strokeWidth="10"
                strokeDasharray="18% 40%"
                mask="url(#progress-mask)"
            >
                <circle
                    r="150"
                    cx="120"
                    cy="120"
                    stroke="#FF2E7E"
                    opacity="0.95"
                />
                <circle
                    r="140"
                    cx="120"
                    cy="120"
                    stroke="#FFD600"
                    opacity="0.95"
                />
                <circle
                    r="130"
                    cx="120"
                    cy="120"
                    stroke="#00E5FF"
                    opacity="0.95"
                />
                <circle
                    r="120"
                    cx="120"
                    cy="120"
                    stroke="#FF3D71"
                    opacity="0.95"
                />
                <circle
                    r="110"
                    cx="120"
                    cy="120"
                    stroke="#4ADE80"
                    opacity="0.95"
                />
                <circle
                    r="100"
                    cx="120"
                    cy="120"
                    stroke="#2196F3"
                    opacity="0.95"
                />
                <circle
                    r="90"
                    cx="120"
                    cy="120"
                    stroke="#FFA726"
                    opacity="0.95"
                />
                <circle
                    r="80"
                    cx="120"
                    cy="120"
                    stroke="#FF1493"
                    opacity="0.95"
                />
                <circle
                    r="70"
                    cx="120"
                    cy="120"
                    stroke="#FFEB3B"
                    opacity="0.95"
                />
                <circle
                    r="60"
                    cx="120"
                    cy="120"
                    stroke="#00BCD4"
                    opacity="0.95"
                />
                <circle
                    r="50"
                    cx="120"
                    cy="120"
                    stroke="#FF4081"
                    opacity="0.95"
                />
                <circle
                    r="40"
                    cx="120"
                    cy="120"
                    stroke="#76FF03"
                    opacity="0.95"
                />
                <circle
                    r="30"
                    cx="120"
                    cy="120"
                    stroke="#448AFF"
                    opacity="0.95"
                />
                <circle
                    r="20"
                    cx="120"
                    cy="120"
                    stroke="#FF3D00"
                    opacity="0.95"
                />
            </g>
        </svg>
    </div>
);

export default function FileUpload({
    onUploadSuccess = () => {},
    onUploadError = () => {},
    acceptedFileTypes = [],
    maxFileSize = DEFAULT_MAX_FILE_SIZE,
    currentFile: initialFile = null,
    onFileRemove = () => {},
    uploadDelay = 2000,
    validateFile = () => null,
    className,
}: FileUploadProps) {
    const [file, setFile] = useState<File | null>(initialFile);
    const [status, setStatus] = useState<FileStatus>("idle");
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<FileError | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (uploadIntervalRef.current) {
                clearInterval(uploadIntervalRef.current);
            }
        };
    }, []);

    const validateFileSize = useCallback(
        (file: File): FileError | null => {
            if (file.size > maxFileSize) {
                return {
                    message: `File size exceeds ${formatBytes(maxFileSize)}`,
                    code: "FILE_TOO_LARGE",
                };
            }
            return null;
        },
        [maxFileSize]
    );

    const validateFileType = useCallback(
        (file: File): FileError | null => {
            if (!acceptedFileTypes?.length) return null;

            const fileType = file.type.toLowerCase();
            if (
                !acceptedFileTypes.some((type) =>
                    fileType.match(type.toLowerCase())
                )
            ) {
                return {
                    message: `File type must be ${acceptedFileTypes.join(
                        ", "
                    )}`,
                    code: "INVALID_FILE_TYPE",
                };
            }
            return null;
        },
        [acceptedFileTypes]
    );

    const handleError = useCallback(
        (error: FileError) => {
            setError(error);
            setStatus("error");
            onUploadError?.(error);

            setTimeout(() => {
                setError(null);
                setStatus("idle");
            }, 3000);
        },
        [onUploadError]
    );

    const simulateUpload = useCallback(
        (uploadingFile: File) => {
            let currentProgress = 0;

            if (uploadIntervalRef.current) {
                clearInterval(uploadIntervalRef.current);
            }

            uploadIntervalRef.current = setInterval(() => {
                currentProgress += UPLOAD_STEP_SIZE;
                if (currentProgress >= 100) {
                    if (uploadIntervalRef.current) {
                        clearInterval(uploadIntervalRef.current);
                    }
                    setProgress(0);
                    setStatus("idle");
                    setFile(null);
                    onUploadSuccess?.(uploadingFile);
                } else {
                    setStatus((prevStatus) => {
                        if (prevStatus === "uploading") {
                            setProgress(currentProgress);
                            return "uploading";
                        }
                        if (uploadIntervalRef.current) {
                            clearInterval(uploadIntervalRef.current);
                        }
                        return prevStatus;
                    });
                }
            }, uploadDelay / (100 / UPLOAD_STEP_SIZE));
        },
        [onUploadSuccess, uploadDelay]
    );

    const handleFileSelect = useCallback(
        (selectedFile: File | null) => {
            if (!selectedFile) return;

            // Reset error state
            setError(null);

            // Validate file
            const sizeError = validateFileSize(selectedFile);
            if (sizeError) {
                handleError(sizeError);
                return;
            }

            const typeError = validateFileType(selectedFile);
            if (typeError) {
                handleError(typeError);
                return;
            }

            const customError = validateFile?.(selectedFile);
            if (customError) {
                handleError(customError);
                return;
            }

            setFile(selectedFile);
            setStatus("uploading");
            setProgress(0);
            simulateUpload(selectedFile);
        },
        [
            simulateUpload,
            validateFileSize,
            validateFileType,
            validateFile,
            handleError,
        ]
    );

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setStatus((prev) => (prev !== "uploading" ? "dragging" : prev));
    }, []);

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setStatus((prev) => (prev === "dragging" ? "idle" : prev));
    }, []);

    const handleDrop = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (status === "uploading") return;
            setStatus("idle");
            const droppedFile = e.dataTransfer.files?.[0];
            if (droppedFile) handleFileSelect(droppedFile);
        },
        [status, handleFileSelect]
    );

    const handleFileInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = e.target.files?.[0];
            handleFileSelect(selectedFile || null);
            if (e.target) e.target.value = "";
        },
        [handleFileSelect]
    );

    const triggerFileInput = useCallback(() => {
        if (status === "uploading") return;
        fileInputRef.current?.click();
    }, [status]);

    const resetState = useCallback(() => {
        setFile(null);
        setStatus("idle");
        setProgress(0);
        if (onFileRemove) onFileRemove();
    }, [onFileRemove]);

    return (
        <div
            className={cn("relative w-full max-w-sm mx-auto", className || "")}
            role="complementary"
            aria-label="File upload"
        >
            <div className="group relative w-full rounded-xl bg-white dark:bg-black ring-1 ring-gray-200 dark:ring-white/10 p-0.5">
                <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

                <div className="relative w-full rounded-[10px] bg-gray-50/50 dark:bg-white/[0.02] p-1.5">
                    <div
                        className={cn(
                            "relative mx-auto w-full overflow-hidden rounded-lg border border-gray-100 dark:border-white/[0.08] bg-white dark:bg-black/50",
                            error ? "border-red-500/50" : ""
                        )}
                    >
                        <div
                            className={cn(
                                "absolute inset-0 transition-opacity duration-300",
                                status === "dragging"
                                    ? "opacity-100"
                                    : "opacity-0"
                            )}
                        >
                            <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-blue-500/10 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-blue-500/10 to-transparent" />
                            <div className="absolute inset-y-0 left-0 w-[20%] bg-gradient-to-r from-blue-500/10 to-transparent" />
                            <div className="absolute inset-y-0 right-0 w-[20%] bg-gradient-to-l from-blue-500/10 to-transparent" />
                            <div className="absolute inset-[20%] bg-blue-500/5 rounded-lg transition-all duration-300 animate-pulse" />
                        </div>

                        <div className="absolute -right-4 -top-4 h-8 w-8 bg-gradient-to-br from-blue-500/20 to-transparent blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative h-[240px]">
                            <AnimatePresence mode="wait">
                                {status === "idle" || status === "dragging" ? (
                                    <motion.div
                                        key="dropzone"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{
                                            opacity:
                                                status === "dragging" ? 0.8 : 1,
                                            y: 0,
                                            scale:
                                                status === "dragging"
                                                    ? 0.98
                                                    : 1,
                                        }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute inset-0 flex flex-col items-center justify-center p-6"
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <div className="mb-4">
                                            <UploadIllustration />
                                        </div>

                                        <div className="text-center space-y-1.5 mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                                                Drag and drop or
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {acceptedFileTypes?.length
                                                    ? `${acceptedFileTypes
                                                          .map(
                                                              (t) =>
                                                                  t.split(
                                                                      "/"
                                                                  )[1]
                                                          )
                                                          .join(", ")
                                                          .toUpperCase()}`
                                                    : "SVG, PNG, JPG or GIF"}{" "}
                                                {maxFileSize &&
                                                    `up to ${formatBytes(
                                                        maxFileSize
                                                    )}`}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={triggerFileInput}
                                            className="w-4/5 flex items-center justify-center gap-2 rounded-lg bg-gray-100 dark:bg-white/10 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white transition-all duration-200 hover:bg-gray-200 dark:hover:bg-white/20 group"
                                        >
                                            <span>Upload File</span>
                                            <UploadCloud className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                        </button>

                                        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                            or drag and drop your file here
                                        </p>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="sr-only"
                                            onChange={handleFileInputChange}
                                            accept={acceptedFileTypes?.join(
                                                ","
                                            )}
                                            aria-label="File input"
                                        />
                                    </motion.div>
                                ) : status === "uploading" ? (
                                    <motion.div
                                        key="uploading"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="absolute inset-0 flex flex-col items-center justify-center p-6"
                                    >
                                        <div className="mb-4">
                                            <UploadingAnimation
                                                progress={progress}
                                            />
                                        </div>

                                        <div className="text-center space-y-1.5 mb-4">
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                {file?.name}
                                            </h3>
                                            <div className="flex items-center justify-center gap-2 text-xs">
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    {formatBytes(
                                                        file?.size || 0
                                                    )}
                                                </span>
                                                <span className="font-medium text-blue-500">
                                                    {Math.round(progress)}%
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={resetState}
                                            type="button"
                                            className="w-4/5 flex items-center justify-center gap-2 rounded-lg bg-gray-100 dark:bg-white/10 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white transition-all duration-200 hover:bg-gray-200 dark:hover:bg-white/20"
                                        >
                                            Cancel
                                        </button>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg"
                                >
                                    <p className="text-sm text-red-500 dark:text-red-400">
                                        {error.message}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

FileUpload.displayName = "FileUpload";

```


## Action Search Bar (action-search-bar)
Type: registry:component
Action Bar with shortcuts, and smooth dropdown animation.
**Dependencies:** deps: lucide-react, motion; registry: input

`$ components/kokonutui/action-search-bar.tsx`
```tsx
"use client";

/**
 * @author: @kokonutui
 * @description: A modern search bar component with action buttons and suggestions
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import {
    Search,
    Send,
    BarChart2,
    Video,
    PlaneTakeoff,
    AudioLines,
    LayoutGrid,
} from "lucide-react";
import useDebounce from "@/hooks/use-debounce";

interface Action {
    id: string;
    label: string;
    icon: React.ReactNode;
    description?: string;
    short?: string;
    end?: string;
}

interface SearchResult {
    actions: Action[];
}

const ANIMATION_VARIANTS = {
    container: {
        hidden: { opacity: 0, height: 0 },
        show: {
            opacity: 1,
            height: "auto",
            transition: {
                height: { duration: 0.4 },
                staggerChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            height: 0,
            transition: {
                height: { duration: 0.3 },
                opacity: { duration: 0.2 },
            },
        },
    },
    item: {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 },
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: { duration: 0.2 },
        },
    },
} as const;

const allActionsSample = [
    {
        id: "1",
        label: "Book tickets",
        icon: <PlaneTakeoff className="h-4 w-4 text-blue-500" />,
        description: "Operator",
        short: "⌘K",
        end: "Agent",
    },
    {
        id: "2",
        label: "Summarize",
        icon: <BarChart2 className="h-4 w-4 text-orange-500" />,
        description: "gpt-5",
        short: "⌘cmd+p",
        end: "Command",
    },
    {
        id: "3",
        label: "Screen Studio",
        icon: <Video className="h-4 w-4 text-purple-500" />,
        description: "Claude 4.1",
        short: "",
        end: "Application",
    },
    {
        id: "4",
        label: "Talk to Jarvis",
        icon: <AudioLines className="h-4 w-4 text-green-500" />,
        description: "gpt-5 voice",
        short: "",
        end: "Active",
    },
    {
        id: "5",
        label: "Kokonut UI - Pro",
        icon: <LayoutGrid className="h-4 w-4 text-blue-500" />,
        description: "Components",
        short: "",
        end: "Link",
    },
];

function ActionSearchBar({
    actions = allActionsSample,
    defaultOpen = false,
}: {
    actions?: Action[];
    defaultOpen?: boolean;
}) {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<SearchResult | null>(null);
    const [isFocused, setIsFocused] = useState(defaultOpen);
    const [isTyping, setIsTyping] = useState(false);
    const [selectedAction, setSelectedAction] = useState<Action | null>(null);
    const [activeIndex, setActiveIndex] = useState(-1);
    const debouncedQuery = useDebounce(query, 200);

    const filteredActions = useMemo(() => {
        if (!debouncedQuery) return actions;

        const normalizedQuery = debouncedQuery.toLowerCase().trim();
        return actions.filter((action) => {
            const searchableText =
                `${action.label} ${action.description || ""}`.toLowerCase();
            return searchableText.includes(normalizedQuery);
        });
    }, [debouncedQuery, actions]);

    useEffect(() => {
        if (!isFocused) {
            setResult(null);
            setActiveIndex(-1);
            return;
        }

        setResult({ actions: filteredActions });
        setActiveIndex(-1);
    }, [filteredActions, isFocused]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
            setIsTyping(true);
            setActiveIndex(-1);
        },
        []
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (!result?.actions.length) return;

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setActiveIndex((prev) =>
                        prev < result.actions.length - 1 ? prev + 1 : 0
                    );
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setActiveIndex((prev) =>
                        prev > 0 ? prev - 1 : result.actions.length - 1
                    );
                    break;
                case "Enter":
                    e.preventDefault();
                    if (activeIndex >= 0 && result.actions[activeIndex]) {
                        setSelectedAction(result.actions[activeIndex]);
                    }
                    break;
                case "Escape":
                    setIsFocused(false);
                    setActiveIndex(-1);
                    break;
            }
        },
        [result?.actions, activeIndex]
    );

    const handleActionClick = useCallback((action: Action) => {
        setSelectedAction(action);
    }, []);

    const handleFocus = useCallback(() => {
        setSelectedAction(null);
        setIsFocused(true);
        setActiveIndex(-1);
    }, []);

    const handleBlur = useCallback(() => {
        setTimeout(() => {
            setIsFocused(false);
            setActiveIndex(-1);
        }, 200);
    }, []);

    return (
        <div className="w-full max-w-xl mx-auto">
            <div className="relative flex flex-col justify-start items-center min-h-[300px]">
                <div className="w-full max-w-sm sticky top-0 bg-background z-10 pt-4 pb-1">
                    <label
                        className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block"
                        htmlFor="search"
                    >
                        Search Commands
                    </label>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="What's up?"
                            value={query}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            role="combobox"
                            aria-expanded={isFocused && !!result}
                            aria-autocomplete="list"
                            aria-activedescendant={
                                activeIndex >= 0
                                    ? `action-${result?.actions[activeIndex]?.id}`
                                    : undefined
                            }
                            id="search"
                            autoComplete="off"
                            className="pl-3 pr-9 py-1.5 h-9 text-sm rounded-lg focus-visible:ring-offset-0"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4">
                            <AnimatePresence mode="popLayout">
                                {query.length > 0 ? (
                                    <motion.div
                                        key="send"
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 20, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Send className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="search"
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 20, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-sm">
                    <AnimatePresence>
                        {isFocused && result && !selectedAction && (
                            <motion.div
                                className="w-full border rounded-md shadow-xs overflow-hidden dark:border-gray-800 bg-white dark:bg-black mt-1"
                                variants={ANIMATION_VARIANTS.container}
                                role="listbox"
                                aria-label="Search results"
                                initial="hidden"
                                animate="show"
                                exit="exit"
                            >
                                <motion.ul role="none">
                                    {result.actions.map((action) => (
                                        <motion.li
                                            key={action.id}
                                            id={`action-${action.id}`}
                                            className={`px-3 py-2 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-zinc-900 cursor-pointer rounded-md ${
                                                activeIndex ===
                                                result.actions.indexOf(action)
                                                    ? "bg-gray-100 dark:bg-zinc-800"
                                                    : ""
                                            }`}
                                            variants={ANIMATION_VARIANTS.item}
                                            layout
                                            onClick={() =>
                                                handleActionClick(action)
                                            }
                                            role="option"
                                            aria-selected={
                                                activeIndex ===
                                                result.actions.indexOf(action)
                                            }
                                        >
                                            <div className="flex items-center gap-2 justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="text-gray-500"
                                                        aria-hidden="true"
                                                    >
                                                        {action.icon}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {action.label}
                                                    </span>
                                                    {action.description && (
                                                        <span className="text-xs text-gray-400">
                                                            {action.description}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {action.short && (
                                                    <span
                                                        className="text-xs text-gray-400"
                                                        aria-label={`Keyboard shortcut: ${action.short}`}
                                                    >
                                                        {action.short}
                                                    </span>
                                                )}
                                                {action.end && (
                                                    <span className="text-xs text-gray-400 text-right">
                                                        {action.end}
                                                    </span>
                                                )}
                                            </div>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                                <div className="mt-2 px-3 py-2 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Press ⌘K to open commands</span>
                                        <span>ESC to cancel</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default ActionSearchBar;

```

`$ hooks/use-debounce.ts`
```tsx
import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;

```


## AI Input Search (ai-input-search)
Type: registry:component
AI input with search mode.
**Dependencies:** deps: motion; registry: textarea

`$ components/kokonutui/ai-input-search.tsx`
```tsx
"use client";

/**
 * @author: @kokonutui
 * @description: AI Input Search
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { Globe, Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";

export default function AI_Input_Search() {
    const [value, setValue] = useState("");
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 52,
        maxHeight: 200,
    });
    const [showSearch, setShowSearch] = useState(true);
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = () => {
        setValue("");
        adjustHeight(true); 
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleContainerClick = () => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    return (
        <div className="w-full py-4">
            <div className="relative max-w-xl w-full mx-auto">
                <div
                    role="textbox"
                    tabIndex={0}
                    aria-label="Search input container"
                    className={cn(
                        "relative flex flex-col rounded-xl transition-all duration-200 w-full text-left cursor-text",
                        "ring-1 ring-black/10 dark:ring-white/10",
                        isFocused && "ring-black/20 dark:ring-white/20"
                    )}
                    onClick={handleContainerClick}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            handleContainerClick();
                        }
                    }}
                >
                    <div className="overflow-y-auto max-h-[200px]">
                        <Textarea
                            id="ai-input-04"
                            value={value}
                            placeholder="Search the web..."
                            className="w-full rounded-xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 resize-none focus-visible:ring-0 leading-[1.2]"
                            ref={textareaRef}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                            onChange={(e) => {
                                setValue(e.target.value);
                                adjustHeight();
                            }}
                        />
                    </div>

                    <div className="h-12 bg-black/5 dark:bg-white/5 rounded-b-xl">
                        <div className="absolute left-3 bottom-3 flex items-center gap-2">
                            <label className="cursor-pointer rounded-lg p-2 bg-black/5 dark:bg-white/5">
                                <input type="file" className="hidden" />
                                <Paperclip className="w-4 h-4 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors" />
                            </label>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowSearch(!showSearch);
                                }}
                                className={cn(
                                    "rounded-full transition-all flex items-center gap-2 px-1.5 py-1 border h-8 cursor-pointer",
                                    showSearch
                                        ? "bg-sky-500/15 border-sky-400 text-sky-500"
                                        : "bg-black/5 dark:bg-white/5 border-transparent text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white "
                                )}
                            >
                                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                    <motion.div
                                        animate={{
                                            rotate: showSearch ? 180 : 0,
                                            scale: showSearch ? 1.1 : 1,
                                        }}
                                        whileHover={{
                                            rotate: showSearch ? 180 : 15,
                                            scale: 1.1,
                                            transition: {
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 10,
                                            },
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 25,
                                        }}
                                    >
                                        <Globe
                                            className={cn(
                                                "w-4 h-4",
                                                showSearch
                                                    ? "text-sky-500"
                                                    : "text-inherit"
                                            )}
                                        />
                                    </motion.div>
                                </div>
                                <AnimatePresence>
                                    {showSearch && (
                                        <motion.span
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{
                                                width: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{ width: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="text-sm overflow-hidden whitespace-nowrap text-sky-500 shrink-0"
                                        >
                                            Search
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                        <div className="absolute right-3 bottom-3">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className={cn(
                                    "rounded-lg p-2 transition-colors",
                                    value
                                        ? "bg-sky-500/15 text-sky-500"
                                        : "bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white cursor-pointer"
                                )}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

```

`$ hooks/use-auto-resize-textarea.ts`
```tsx
import { useEffect, useRef, useCallback } from "react";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

export function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            // Temporarily shrink to get the right scrollHeight
            textarea.style.height = `${minHeight}px`;

            // Calculate new height
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        // Set initial height
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    // Adjust height on window resize
    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

```


## Currency Transfer (currency-transfer)
Type: registry:component
Multiples step animation transaction inspired.
**Dependencies:** deps: lucide-react, motion; registry: card, tooltip

`$ components/kokonutui/currency-transfer.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Currency Transfer
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import {
    ArrowUpIcon,
    ArrowDownIcon,
    InfoIcon,
    ArrowUpDown,
    Check,
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CheckmarkProps {
    size?: number;
    strokeWidth?: number;
    color?: string;
    className?: string;
}

const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: {
                delay: i * 0.2,
                type: "spring",
                duration: 1.5,
                bounce: 0.2,
                ease: [0.22, 1, 0.36, 1],
            },
            opacity: { delay: i * 0.2, duration: 0.3 },
        },
    }),
};

export function Checkmark({
    size = 100,
    strokeWidth = 2,
    color = "currentColor",
    className = "",
}: CheckmarkProps) {
    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            initial="hidden"
            animate="visible"
            className={className}
        >
            <title>Animated Checkmark</title>
            <motion.circle
                cx="50"
                cy="50"
                r="42"
                stroke={color}
                variants={draw as any}
                custom={0}
                style={{
                    strokeWidth,
                    strokeLinecap: "round",
                    fill: "transparent",
                    filter: "drop-shadow(0 0 2px rgba(16, 185, 129, 0.2))",
                }}
            />
            <motion.path
                d="M32 50L45 63L68 35"
                stroke={color}
                variants={draw as any}
                custom={1}
                style={{
                    strokeWidth: strokeWidth + 0.5,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    fill: "transparent",
                    filter: "drop-shadow(0 0 1px rgba(16, 185, 129, 0.3))",
                }}
            />
        </motion.svg>
    );
}

export default function CurrencyTransfer() {
    const [isCompleted, setIsCompleted] = useState(false);
    const transactionId = "TXN-DAB3UL494";

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsCompleted(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <TooltipProvider>
            <Card className="w-full max-w-sm mx-auto p-6 h-[420px] flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-sm shadow-[0_0_0_1px_rgba(0,0,0,0.03)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)] hover:border-emerald-500/20 dark:hover:border-emerald-500/20 transition-all duration-500">
                <CardContent className="flex-1 flex flex-col justify-center space-y-4">
                    <div className="h-[80px] flex items-center justify-center">
                        <motion.div
                            className="flex justify-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            <div className="relative w-[100px] h-[100px] flex items-center justify-center">
                                <motion.div
                                    className="absolute inset-0 blur-2xl bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full"
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: [0, 1, 0.8],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        times: [0, 0.5, 1],
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                />
                                <AnimatePresence mode="wait">
                                    {!isCompleted ? (
                                        <motion.div
                                            key="progress"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{
                                                opacity: 0,
                                                rotate: 360,
                                            }}
                                            transition={{
                                                duration: 0.6,
                                                ease: "easeInOut",
                                            }}
                                            className="w-[100px] h-[100px] flex items-center justify-center"
                                        >
                                            <div className="relative z-10">
                                                <motion.div
                                                    className="absolute inset-0 rounded-full border-2 border-transparent"
                                                    style={{
                                                        borderLeftColor:
                                                            "rgb(16 185 129)",
                                                        borderTopColor:
                                                            "rgb(16 185 129 / 0.2)",
                                                        filter: "blur(0.5px)",
                                                    }}
                                                    animate={{
                                                        rotate: 360,
                                                        scale: [1, 1.02, 1],
                                                    }}
                                                    transition={{
                                                        rotate: {
                                                            duration: 3,
                                                            repeat: Infinity,
                                                            ease: "linear",
                                                        },
                                                        scale: {
                                                            duration: 2,
                                                            repeat: Infinity,
                                                            ease: "easeInOut",
                                                        },
                                                    }}
                                                />
                                                <div className="relative z-10 bg-white dark:bg-zinc-900 rounded-full p-5 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                                    <ArrowUpDown className="h-10 w-10 text-emerald-500" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="completed"
                                            initial={{
                                                opacity: 0,
                                                rotate: -180,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                rotate: 0,
                                            }}
                                            transition={{
                                                duration: 0.6,
                                                ease: "easeInOut",
                                            }}
                                            className="w-[100px] h-[100px] flex items-center justify-center"
                                        >
                                            <div className="relative z-10 bg-white dark:bg-zinc-900 rounded-full p-5 border border-emerald-500">
                                                <Check
                                                    className="h-10 w-10 text-emerald-500"
                                                    strokeWidth={3.5}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                    <div className="h-[280px] flex flex-col">
                        <motion.div
                            className="space-y-2 text-center w-full mb-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: 0.3,
                                duration: 0.8,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            <AnimatePresence mode="wait">
                                {isCompleted ? (
                                    <motion.h2
                                        key="completed-title"
                                        className="text-lg text-zinc-900 dark:text-zinc-100 tracking-tighter font-semibold uppercase"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{
                                            duration: 0.5,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                    >
                                        Transfer Completed
                                    </motion.h2>
                                ) : (
                                    <motion.h2
                                        key="progress-title"
                                        className="text-lg text-zinc-900 dark:text-zinc-100 tracking-tighter font-semibold uppercase"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{
                                            duration: 0.5,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                    >
                                        Transfer in Progress
                                    </motion.h2>
                                )}
                            </AnimatePresence>
                            <AnimatePresence mode="wait">
                                {isCompleted ? (
                                    <motion.div
                                        key="completed-id"
                                        className="text-xs text-emerald-600 dark:text-emerald-400 font-medium"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{
                                            duration: 0.4,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                    >
                                        Transaction ID: {transactionId}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="progress-status"
                                        className="text-xs text-emerald-600 dark:text-emerald-400 font-medium"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{
                                            duration: 0.4,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                    >
                                        Processing Transaction...
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="flex items-center gap-4 mt-4">
                                <motion.div
                                    className="flex-1 relative"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                >
                                    <motion.div
                                        className="flex flex-col items-start relative"
                                        initial={{ gap: "12px" }}
                                        animate={{
                                            gap: isCompleted ? "0px" : "12px",
                                        }}
                                        transition={{
                                            duration: 0.6,
                                            ease: [0.32, 0.72, 0, 1],
                                        }}
                                    >
                                        <motion.div
                                            className={cn(
                                                "w-full bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2.5 border border-zinc-200 dark:border-zinc-700/50 backdrop-blur-md transition-all duration-300",
                                                isCompleted
                                                    ? "rounded-b-none border-b-0"
                                                    : "hover:border-emerald-500/30"
                                            )}
                                            animate={{
                                                y: 0,
                                                scale: 1,
                                            }}
                                            transition={{
                                                duration: 0.6,
                                                ease: [0.32, 0.72, 0, 1],
                                            }}
                                        >
                                            <div className="space-y-1 w-full">
                                                <motion.span
                                                    className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5"
                                                    initial={{ opacity: 1 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{
                                                        duration: 0.3,
                                                        ease: [
                                                            0.22, 1, 0.36, 1,
                                                        ],
                                                    }}
                                                >
                                                    <ArrowUpIcon className="w-3 h-3" />
                                                    From
                                                </motion.span>
                                                <div className="flex flex-col gap-1.5">
                                                    <motion.div
                                                        className="flex items-center gap-2.5 group"
                                                        initial={{ opacity: 1 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{
                                                            duration: 0.3,
                                                            ease: [
                                                                0.22, 1, 0.36,
                                                                1,
                                                            ],
                                                        }}
                                                    >
                                                        <motion.span
                                                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white dark:bg-zinc-900 shadow-lg border border-zinc-300 dark:border-zinc-700 text-sm font-medium text-zinc-900 dark:text-zinc-100 transition-colors duration-300"
                                                            whileHover={{
                                                                scale: 1.05,
                                                            }}
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 400,
                                                                damping: 10,
                                                            }}
                                                        >
                                                            $
                                                        </motion.span>
                                                        <div className="flex flex-col items-start">
                                                            <AnimatePresence mode="wait">
                                                                <motion.span
                                                                    key={
                                                                        isCompleted
                                                                            ? "completed-amount"
                                                                            : "processing-amount"
                                                                    }
                                                                    className={cn(
                                                                        "font-medium text-zinc-900 dark:text-zinc-100 tracking-tight"
                                                                    )}
                                                                    initial={{
                                                                        opacity:
                                                                            isCompleted
                                                                                ? 1
                                                                                : 0.5,
                                                                    }}
                                                                    animate={{
                                                                        opacity:
                                                                            isCompleted
                                                                                ? 1
                                                                                : 0.5,
                                                                    }}
                                                                    exit={{
                                                                        opacity:
                                                                            isCompleted
                                                                                ? 1
                                                                                : 0.5,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.3,
                                                                        ease: [
                                                                            0.22,
                                                                            1,
                                                                            0.36,
                                                                            1,
                                                                        ],
                                                                    }}
                                                                >
                                                                    500.00 USD
                                                                </motion.span>
                                                            </AnimatePresence>
                                                            <motion.span
                                                                className="text-xs text-zinc-500 dark:text-zinc-400"
                                                                initial={{
                                                                    opacity: 1,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                }}
                                                                transition={{
                                                                    duration: 0.3,
                                                                    ease: [
                                                                        0.22, 1,
                                                                        0.36, 1,
                                                                    ],
                                                                }}
                                                            >
                                                                Chase Bank
                                                                ••••4589
                                                            </motion.span>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            className={cn(
                                                "w-full bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2.5 border border-zinc-200 dark:border-zinc-700/50 backdrop-blur-md transition-all duration-300",
                                                isCompleted
                                                    ? "rounded-t-none border-t-0"
                                                    : "hover:border-emerald-500/30"
                                            )}
                                            animate={{
                                                y: 0,
                                                scale: 1,
                                            }}
                                            transition={{
                                                duration: 0.6,
                                                ease: [0.32, 0.72, 0, 1],
                                            }}
                                        >
                                            <div className="space-y-1 w-full">
                                                <motion.span
                                                    className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5"
                                                    initial={{ opacity: 1 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{
                                                        duration: 0.3,
                                                        ease: [
                                                            0.22, 1, 0.36, 1,
                                                        ],
                                                    }}
                                                >
                                                    <ArrowDownIcon className="w-3 h-3" />
                                                    To
                                                </motion.span>
                                                <div className="flex flex-col gap-1.5">
                                                    <motion.div
                                                        className="flex items-center gap-2.5 group"
                                                        initial={{ opacity: 1 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{
                                                            duration: 0.3,
                                                            ease: [
                                                                0.22, 1, 0.36,
                                                                1,
                                                            ],
                                                        }}
                                                    >
                                                        <motion.span
                                                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white dark:bg-zinc-900 shadow-lg border border-zinc-300 dark:border-zinc-700 text-sm font-medium text-zinc-900 dark:text-zinc-100 transition-colors duration-300"
                                                            whileHover={{
                                                                scale: 1.05,
                                                            }}
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 400,
                                                                damping: 10,
                                                            }}
                                                        >
                                                            €
                                                        </motion.span>
                                                        <div className="flex flex-col items-start">
                                                            <AnimatePresence mode="wait">
                                                                <motion.span
                                                                    key={
                                                                        isCompleted
                                                                            ? "completed-amount-eur"
                                                                            : "processing-amount-eur"
                                                                    }
                                                                    className={cn(
                                                                        "font-medium text-zinc-900 dark:text-zinc-100 tracking-tight"
                                                                    )}
                                                                    initial={{
                                                                        opacity:
                                                                            isCompleted
                                                                                ? 1
                                                                                : 0.5,
                                                                    }}
                                                                    animate={{
                                                                        opacity:
                                                                            isCompleted
                                                                                ? 1
                                                                                : 0.5,
                                                                    }}
                                                                    exit={{
                                                                        opacity:
                                                                            isCompleted
                                                                                ? 1
                                                                                : 0.5,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.3,
                                                                        ease: [
                                                                            0.22,
                                                                            1,
                                                                            0.36,
                                                                            1,
                                                                        ],
                                                                    }}
                                                                >
                                                                    460.00 EUR
                                                                </motion.span>
                                                            </AnimatePresence>
                                                            <motion.span
                                                                className="text-xs text-zinc-500 dark:text-zinc-400"
                                                                initial={{
                                                                    opacity: 1,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                }}
                                                                transition={{
                                                                    duration: 0.3,
                                                                    ease: [
                                                                        0.22, 1,
                                                                        0.36, 1,
                                                                    ],
                                                                }}
                                                            >
                                                                Deutsche Bank
                                                                ••••7823
                                                            </motion.span>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            </div>
                            <motion.div
                                className="flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    delay: 0.5,
                                    duration: 0.6,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    {isCompleted ? (
                                        <motion.span
                                            key="completed-rate"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{
                                                duration: 0.4,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                        >
                                            Exchange Rate: 1 USD = 0.92 EUR
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            key="calculating-rate"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{
                                                duration: 0.4,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                        >
                                            Calculating exchange rate...
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <InfoIcon className="w-3 h-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="text-xs">
                                            {isCompleted
                                                ? `Rate updated at 10:45 AM`
                                                : "Please wait..."}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </motion.div>
                        </motion.div>
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    );
}

```


## Background Paths (background-paths)
Type: registry:component
Drawed line paths in the middle.
**Dependencies:** deps: motion

`$ components/kokonutui/background-paths.tsx`
```tsx
"use client";


/**
 * @author: @dorian_baffier
 * @description: Background Paths
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { memo, useMemo } from "react";
import { motion } from "motion/react";

interface Point {
    x: number;
    y: number;
}

interface PathData {
    id: string;
    d: string;
    opacity: number;
    width: number;
    duration: number;
    delay: number;
}

// Path generation function
function generateAestheticPath(
    index: number,
    position: number,
    type: "primary" | "secondary" | "accent"
): string {
    const baseAmplitude =
        type === "primary" ? 150 : type === "secondary" ? 100 : 60;
    const phase = index * 0.2;
    const points: Point[] = [];
    const segments = type === "primary" ? 10 : type === "secondary" ? 8 : 6;

    const startX = 2400;
    const startY = 800;
    const endX = -2400;
    const endY = -800 + index * 25;

    for (let i = 0; i <= segments; i++) {
        const progress = i / segments;
        const eased = 1 - (1 - progress) ** 2;

        const baseX = startX + (endX - startX) * eased;
        const baseY = startY + (endY - startY) * eased;

        const amplitudeFactor = 1 - eased * 0.3;
        const wave1 =
            Math.sin(progress * Math.PI * 3 + phase) *
            (baseAmplitude * 0.7 * amplitudeFactor);
        const wave2 =
            Math.cos(progress * Math.PI * 4 + phase) *
            (baseAmplitude * 0.3 * amplitudeFactor);
        const wave3 =
            Math.sin(progress * Math.PI * 2 + phase) *
            (baseAmplitude * 0.2 * amplitudeFactor);

        points.push({
            x: baseX * position,
            y: baseY + wave1 + wave2 + wave3,
        });
    }

    const pathCommands = points.map((point: Point, i: number) => {
        if (i === 0) return `M ${point.x} ${point.y}`;
        const prevPoint = points[i - 1];
        const tension = 0.4;
        const cp1x = prevPoint.x + (point.x - prevPoint.x) * tension;
        const cp1y = prevPoint.y;
        const cp2x = prevPoint.x + (point.x - prevPoint.x) * (1 - tension);
        const cp2y = point.y;
        return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
    });

    return pathCommands.join(" ");
}

const generateUniqueId = (prefix: string): string =>
    `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

// Memoized FloatingPaths component
const FloatingPaths = memo(function FloatingPaths({
    position,
}: {
    position: number;
}) {
    // Increased number of paths while maintaining optimization
    const primaryPaths: PathData[] = useMemo(
        () =>
            Array.from({ length: 12 }, (_, i) => ({
                id: generateUniqueId("primary"),
                d: generateAestheticPath(i, position, "primary"),
                opacity: 0.15 + i * 0.02,
                width: 4 + i * 0.3,
                duration: 25,
                delay: 0,
            })),
        [position]
    );

    const secondaryPaths: PathData[] = useMemo(
        () =>
            Array.from({ length: 15 }, (_, i) => ({
                id: generateUniqueId("secondary"),
                d: generateAestheticPath(i, position, "secondary"),
                opacity: 0.12 + i * 0.015,
                width: 3 + i * 0.25,
                duration: 20,
                delay: 0,
            })),
        [position]
    );

    const accentPaths: PathData[] = useMemo(
        () =>
            Array.from({ length: 10 }, (_, i) => ({
                id: generateUniqueId("accent"),
                d: generateAestheticPath(i, position, "accent"),
                opacity: 0.08 + i * 0.12,
                width: 2 + i * 0.2,
                duration: 15,
                delay: 0,
            })),
        [position]
    );

    // Shared animation configuration
    const sharedAnimationProps = {
        opacity: 1,
        scale: 1,
        transition: {
            opacity: { duration: 1 },
            scale: { duration: 1 },
        },
    };

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg
                className="w-full h-full text-slate-950/40 dark:text-white/40"
                viewBox="-2400 -800 4800 1600"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
            >
                <title>Background Paths</title>
                <defs>
                    <linearGradient
                        id="sharedGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop offset="0%" stopColor="rgba(147, 51, 234, 0.5)" />
                        <stop
                            offset="50%"
                            stopColor="rgba(236, 72, 153, 0.5)"
                        />
                        <stop
                            offset="100%"
                            stopColor="rgba(59, 130, 246, 0.5)"
                        />
                    </linearGradient>
                </defs>

                <g className="primary-waves">
                    {primaryPaths.map((path) => (
                        <motion.path
                            key={path.id}
                            d={path.d}
                            stroke="url(#sharedGradient)"
                            strokeWidth={path.width}
                            strokeLinecap="round"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                ...sharedAnimationProps,
                                y: [0, -15, 0],
                            }}
                            transition={{
                                ...sharedAnimationProps.transition,
                                y: {
                                    duration: 8,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeInOut",
                                    repeatType: "reverse",
                                },
                            }}
                            style={{ opacity: path.opacity }}
                        />
                    ))}
                </g>

                <g className="secondary-waves" style={{ opacity: 0.8 }}>
                    {secondaryPaths.map((path) => (
                        <motion.path
                            key={path.id}
                            d={path.d}
                            stroke="url(#sharedGradient)"
                            strokeWidth={path.width}
                            strokeLinecap="round"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{
                                ...sharedAnimationProps,
                                y: [0, -10, 0],
                            }}
                            transition={{
                                ...sharedAnimationProps.transition,
                                y: {
                                    duration: 6,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeInOut",
                                    repeatType: "reverse",
                                },
                            }}
                            style={{ opacity: path.opacity }}
                        />
                    ))}
                </g>

                <g className="accent-waves" style={{ opacity: 0.6 }}>
                    {accentPaths.map((path) => (
                        <motion.path
                            key={path.id}
                            d={path.d}
                            stroke="url(#sharedGradient)"
                            strokeWidth={path.width}
                            strokeLinecap="round"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{
                                ...sharedAnimationProps,
                                y: [0, -5, 0],
                            }}
                            transition={{
                                ...sharedAnimationProps.transition,
                                y: {
                                    duration: 4,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeInOut",
                                    repeatType: "reverse",
                                },
                            }}
                            style={{ opacity: path.opacity }}
                        />
                    ))}
                </g>
            </svg>
        </div>
    );
});

// Memoized AnimatedTitle component
const AnimatedTitle = memo(function AnimatedTitle({
    title,
}: {
    title: string;
}) {
    return (
        <motion.h1 
            className="text-3xl sm:text-5xl md:text-5xl font-bold mb-8 tracking-tighter
                text-transparent bg-clip-text bg-gradient-to-r 
                from-neutral-800/90 to-neutral-600/90
                dark:from-white/90 dark:to-white/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 1.2,
                ease: [0.2, 0.65, 0.3, 0.9],
            }}
        >
            {title}
        </motion.h1>
    );
});

export default memo(function BackgroundPaths({
    title = "Background Paths",
}: {
    title?: string;
}) {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
            <div className="absolute inset-0">
                <FloatingPaths position={1} />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="max-w-4xl mx-auto"
                >
                    <AnimatedTitle title={title} />
                </motion.div>
            </div>
        </div>
    );
});

```


## Beams Background (beams-background)
Type: registry:component
Animated Beams in the background that are customizable.
**Dependencies:** deps: motion

`$ components/kokonutui/beams-background.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Beams Background
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedGradientBackgroundProps {
    className?: string;
    children?: React.ReactNode;
    intensity?: "subtle" | "medium" | "strong";
}

interface Beam {
    x: number;
    y: number;
    width: number;
    length: number;
    angle: number;
    speed: number;
    opacity: number;
    hue: number;
    pulse: number;
    pulseSpeed: number;
}

function createBeam(width: number, height: number, isDarkMode: boolean): Beam {
    const angle = -35 + Math.random() * 10;
    const hueBase = isDarkMode ? 190 : 210;
    const hueRange = isDarkMode ? 70 : 50;

    return {
        x: Math.random() * width * 1.5 - width * 0.25,
        y: Math.random() * height * 1.5 - height * 0.25,
        width: 30 + Math.random() * 60,
        length: height * 2.5,
        angle: angle,
        speed: 0.6 + Math.random() * 1.2,
        opacity: 0.12 + Math.random() * 0.16,
        hue: hueBase + Math.random() * hueRange,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
    };
}

export default function BeamsBackground({
    className,
    intensity = "strong",
}: AnimatedGradientBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const beamsRef = useRef<Beam[]>([]);
    const animationFrameRef = useRef<number>(0);
    const MINIMUM_BEAMS = 20;
    const isDarkModeRef = useRef<boolean>(false);

    const opacityMap = {
        subtle: 0.7,
        medium: 0.85,
        strong: 1,
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Check for dark mode
        const updateDarkMode = () => {
            isDarkModeRef.current =
                document.documentElement.classList.contains("dark");
        };

        const observer = new MutationObserver(updateDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        updateDarkMode();

        const updateCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);

            const totalBeams = MINIMUM_BEAMS * 1.5;
            beamsRef.current = Array.from({ length: totalBeams }, () =>
                createBeam(canvas.width, canvas.height, isDarkModeRef.current)
            );
        };

        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);

        function resetBeam(beam: Beam, index: number, totalBeams: number) {
            if (!canvas) return beam;

            const column = index % 3;
            const spacing = canvas.width / 3;

            const hueBase = isDarkModeRef.current ? 190 : 210;
            const hueRange = isDarkModeRef.current ? 70 : 50;

            beam.y = canvas.height + 100;
            beam.x =
                column * spacing +
                spacing / 2 +
                (Math.random() - 0.5) * spacing * 0.5;
            beam.width = 100 + Math.random() * 100;
            beam.speed = 0.5 + Math.random() * 0.4;
            beam.hue = hueBase + (index * hueRange) / totalBeams;
            beam.opacity = 0.2 + Math.random() * 0.1;
            return beam;
        }

        function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
            ctx.save();
            ctx.translate(beam.x, beam.y);
            ctx.rotate((beam.angle * Math.PI) / 180);

            const pulsingOpacity =
                beam.opacity *
                (0.8 + Math.sin(beam.pulse) * 0.2) *
                opacityMap[intensity];

            const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);

            const saturation = isDarkModeRef.current ? "85%" : "75%";
            const lightness = isDarkModeRef.current ? "65%" : "45%";

            gradient.addColorStop(
                0,
                `hsla(${beam.hue}, ${saturation}, ${lightness}, 0)`
            );
            gradient.addColorStop(
                0.1,
                `hsla(${beam.hue}, ${saturation}, ${lightness}, ${
                    pulsingOpacity * 0.5
                })`
            );
            gradient.addColorStop(
                0.4,
                `hsla(${beam.hue}, ${saturation}, ${lightness}, ${pulsingOpacity})`
            );
            gradient.addColorStop(
                0.6,
                `hsla(${beam.hue}, ${saturation}, ${lightness}, ${pulsingOpacity})`
            );
            gradient.addColorStop(
                0.9,
                `hsla(${beam.hue}, ${saturation}, ${lightness}, ${
                    pulsingOpacity * 0.5
                })`
            );
            gradient.addColorStop(
                1,
                `hsla(${beam.hue}, ${saturation}, ${lightness}, 0)`
            );

            ctx.fillStyle = gradient;
            ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
            ctx.restore();
        }

        function animate() {
            if (!canvas || !ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.filter = "blur(35px)";

            const totalBeams = beamsRef.current.length;
            beamsRef.current.forEach((beam, index) => {
                beam.y -= beam.speed;
                beam.pulse += beam.pulseSpeed;

                // Reset beam when it goes off screen
                if (beam.y + beam.length < -100) {
                    resetBeam(beam, index, totalBeams);
                }

                drawBeam(ctx, beam);
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            window.removeEventListener("resize", updateCanvasSize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            observer.disconnect();
        };
    }, [intensity]);

    return (
        <div
            className={cn(
                "relative min-h-screen w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950",
                className
            )}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0"
                style={{ filter: "blur(15px)" }}
            />

            <motion.div
                className="absolute inset-0 bg-neutral-900/5 dark:bg-neutral-950/5"
                animate={{
                    opacity: [0.05, 0.15, 0.05],
                }}
                transition={{
                    duration: 10,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                }}
                style={{
                    backdropFilter: "blur(50px)",
                }}
            />

            <div className="relative z-10 flex h-screen w-full items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-6 px-4 text-center">
                    <motion.h1
                        className="text-6xl md:text-7xl lg:text-8xl font-semibold text-neutral-900 dark:text-white tracking-tighter"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Beams
                        <br />
                        Background
                    </motion.h1>
                </div>
            </div>
        </div>
    );
}

```


## Apple Activity Card (apple-activity-card)
Type: registry:component
Inspired by Apple activity app.
**Dependencies:** deps: motion

`$ components/kokonutui/apple-activity-card.tsx`
```tsx
"use client";

/**
 * @author: @kokonutui
 * @description: Apple Activity Card
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ActivityData {
    label: string;
    value: number;
    color: string;
    size: number;
    current: number;
    target: number;
    unit: string;
}

interface CircleProgressProps {
    data: ActivityData;
    index: number;
}

const activities: ActivityData[] = [
    {
        label: "MOVE",
        value: 85,
        color: "#FF2D55",
        size: 200,
        current: 479,
        target: 800,
        unit: "CAL",
    },
    {
        label: "EXERCISE",
        value: 60,
        color: "#A3F900",
        size: 160,
        current: 24,
        target: 30,
        unit: "MIN",
    },
    {
        label: "STAND",
        value: 30,
        color: "#04C7DD",
        size: 120,
        current: 6,
        target: 12,
        unit: "HR",
    },
];

const CircleProgress = ({ data, index }: CircleProgressProps) => {
    const strokeWidth = 16;
    const radius = (data.size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = ((100 - data.value) / 100) * circumference;

    const gradientId = `gradient-${data.label.toLowerCase()}`;
    const gradientUrl = `url(#${gradientId})`;

    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
        >
            <div className="relative">
                <svg
                    width={data.size}
                    height={data.size}
                    viewBox={`0 0 ${data.size} ${data.size}`}
                    className="transform -rotate-90"
                    aria-label={`${data.label} Activity Progress - ${data.value}%`}
                >
                    <title>{`${data.label} Activity Progress - ${data.value}%`}</title>

                    <defs>
                        <linearGradient
                            id={gradientId}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                        >
                            <stop
                                offset="0%"
                                style={{
                                    stopColor: data.color,
                                    stopOpacity: 1,
                                }}
                            />
                            <stop
                                offset="100%"
                                style={{
                                    stopColor:
                                        data.color === "#FF2D55"
                                            ? "#FF6B8B"
                                            : data.color === "#A3F900"
                                            ? "#C5FF4D"
                                            : "#4DDFED",
                                    stopOpacity: 1,
                                }}
                            />
                        </linearGradient>
                    </defs>

                    <circle
                        cx={data.size / 2}
                        cy={data.size / 2}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        className="text-zinc-200/50 dark:text-zinc-800/50"
                    />

                    <motion.circle
                        cx={data.size / 2}
                        cy={data.size / 2}
                        r={radius}
                        fill="none"
                        stroke={gradientUrl}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: progress }}
                        transition={{
                            duration: 1.8,
                            delay: index * 0.2,
                            ease: "easeInOut",
                        }}
                        strokeLinecap="round"
                        style={{
                            filter: "drop-shadow(0 0 6px rgba(0,0,0,0.15))",
                        }}
                    />
                </svg>
            </div>
        </motion.div>
    );
};

const DetailedActivityInfo = () => {
    return (
        <motion.div
            className="flex flex-col gap-6 ml-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            {activities.map((activity) => (
                <motion.div key={activity.label} className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        {activity.label}
                    </span>
                    <span
                        className="text-2xl font-semibold"
                        style={{ color: activity.color }}
                    >
                        {activity.current}/{activity.target}
                        <span className="text-base ml-1 text-zinc-600 dark:text-zinc-400">
                            {activity.unit}
                        </span>
                    </span>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default function AppleActivityCard({
    title = "Activity Rings",
    className,
}: {
    title?: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "relative w-full max-w-3xl mx-auto p-8 rounded-3xl",
                "text-zinc-900 dark:text-white",
                className
            )}
        >
            <div className="flex flex-col items-center gap-8">
                <motion.h2
                    className="text-2xl font-medium text-zinc-900 dark:text-white"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {title}
                </motion.h2>

                <div className="flex items-center">
                    <div className="relative w-[180px] h-[180px]">
                        {activities.map((activity, index) => (
                            <CircleProgress
                                key={activity.label}
                                data={activity}
                                index={index}
                            />
                        ))}
                    </div>
                    <DetailedActivityInfo />
                </div>
            </div>
        </div>
    );
}

```


## AI Voice (ai-voice)
Type: registry:component
Voice mode.
**Dependencies:** deps: motion, lucide-react

`$ components/kokonutui/ai-voice.tsx`
```tsx
"use client";

/**
 * @author: @kokonutui
 * @description: AI Voice
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { Mic } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function AI_Voice() {
    const [submitted, setSubmitted] = useState(false);
    const [time, setTime] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [isDemo, setIsDemo] = useState(true);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (submitted) {
            intervalId = setInterval(() => {
                setTime((t) => t + 1);
            }, 1000);
        } else {
            setTime(0);
        }

        return () => clearInterval(intervalId);
    }, [submitted]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    /**
     * Remove that, only used for demo
     */
    useEffect(() => {
        if (!isDemo) return;

        let timeoutId: NodeJS.Timeout;
        const runAnimation = () => {
            setSubmitted(true);
            timeoutId = setTimeout(() => {
                setSubmitted(false);
                timeoutId = setTimeout(runAnimation, 1000);
            }, 3000);
        };

        const initialTimeout = setTimeout(runAnimation, 100);
        return () => {
            clearTimeout(timeoutId);
            clearTimeout(initialTimeout);
        };
    }, [isDemo]);

    const handleClick = () => {
        if (isDemo) {
            setIsDemo(false);
            setSubmitted(false);
        } else {
            setSubmitted((prev) => !prev);
        }
    };

    return (
        <div className="w-full py-4">
            <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
                <button
                    className={cn(
                        "group w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
                        submitted
                            ? "bg-none"
                            : "bg-none hover:bg-black/5 dark:hover:bg-white/5"
                    )}
                    type="button"
                    onClick={handleClick}
                >
                    {submitted ? (
                        <div
                            className="w-6 h-6 rounded-sm animate-spin bg-black  dark:bg-white cursor-pointer pointer-events-auto"
                            style={{ animationDuration: "3s" }}
                        />
                    ) : (
                        <Mic className="w-6 h-6 text-black/90 dark:text-white/90" />
                    )}
                </button>

                <span
                    className={cn(
                        "font-mono text-sm transition-opacity duration-300",
                        submitted
                            ? "text-black/70 dark:text-white/70"
                            : "text-black/30 dark:text-white/30"
                    )}
                >
                    {formatTime(time)}
                </span>

                <div className="h-4 w-64 flex items-center justify-center gap-0.5">
                    {[...Array(48)].map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-0.5 rounded-full transition-all duration-300",
                                submitted
                                    ? "bg-black/50 dark:bg-white/50 animate-pulse"
                                    : "bg-black/10 dark:bg-white/10 h-1"
                            )}
                            style={
                                submitted && isClient
                                    ? {
                                          height: `${20 + Math.random() * 80}%`,
                                          animationDelay: `${i * 0.05}s`,
                                      }
                                    : undefined
                            }
                        />
                    ))}
                </div>

                <p className="h-4 text-xs text-black/70 dark:text-white/70">
                    {submitted ? "Listening..." : "Click to speak"}
                </p>
            </div>
        </div>
    );
}

```


## Smooth Tab (smooth-tab)
Type: registry:component
Animated tab switcher.
**Dependencies:** deps: motion, lucide-react

`$ components/kokonutui/smooth-tab.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Smooth Tab
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface TabItem {
    id: string;
    title: string;
    icon?: LucideIcon;
    content?: React.ReactNode;
    cardContent?: React.ReactNode;
    color: string;
}

const WaveformPath = () => (
    <motion.path
        d="M0 50 
           C 20 40, 40 30, 60 50
           C 80 70, 100 60, 120 50
           C 140 40, 160 30, 180 50
           C 200 70, 220 60, 240 50
           C 260 40, 280 30, 300 50
           C 320 70, 340 60, 360 50
           C 380 40, 400 30, 420 50
           L 420 100 L 0 100 Z"
        initial={false}
        animate={{
            x: [0, 10, 0],
            transition: {
                duration: 5,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
            },
        }}
    />
);

const DEFAULT_TABS: TabItem[] = [
    {
        id: "Models",
        title: "Models",
        color: "bg-blue-500 hover:bg-blue-600",
        cardContent: (
            <div className="relative h-full">
                <div className="absolute inset-0 overflow-hidden">
                    <svg
                        className="absolute bottom-0 w-full h-32"
                        viewBox="0 0 420 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        role="presentation"
                    >
                        <motion.g
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.15 }}
                            transition={{ duration: 0.5 }}
                            className="fill-blue-500 stroke-blue-500"
                            style={{ strokeWidth: 1 }}
                        >
                            <WaveformPath />
                        </motion.g>
                        <motion.g
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.1 }}
                            transition={{ duration: 0.5 }}
                            className="fill-blue-500 stroke-blue-500"
                            style={{
                                strokeWidth: 1,
                                transform: "translateY(10px)",
                            }}
                        >
                            <WaveformPath />
                        </motion.g>
                    </svg>
                </div>
                <div className="p-6 h-full relative flex flex-col">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 [text-shadow:_0_1px_1px_rgb(0_0_0_/_10%)]">
                            Models
                        </h3>
                        <p className="text-sm text-black/50 dark:text-white/50 leading-relaxed max-w-[90%]">
                            Choose the model you want to use
                        </p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: "MCPs",
        title: "MCPs",
        color: "bg-purple-500 hover:bg-purple-600",
        cardContent: (
            <div className="relative h-full">
                <div className="absolute inset-0 overflow-hidden">
                    <svg
                        className="absolute bottom-0 w-full h-32"
                        viewBox="0 0 420 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        role="presentation"
                    >
                        <motion.g
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.15 }}
                            transition={{ duration: 0.5 }}
                            className="fill-purple-500 stroke-purple-500"
                            style={{ strokeWidth: 1 }}
                        >
                            <WaveformPath />
                        </motion.g>
                        <motion.g
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.1 }}
                            transition={{ duration: 0.5 }}
                            className="fill-purple-500 stroke-purple-500"
                            style={{
                                strokeWidth: 1,
                                transform: "translateY(10px)",
                            }}
                        >
                            <WaveformPath />
                        </motion.g>
                    </svg>
                </div>
                <div className="p-6 h-full relative flex flex-col">
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 [text-shadow:_0_1px_1px_rgb(0_0_0_/_10%)]">
                            MCPs
                        </h3>
                        <p className="text-sm text-black/50 dark:text-white/50 leading-relaxed max-w-[90%]">
                            Choose the MCP you want to use
                        </p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: "Agents",
        title: "Agents",
        color: "bg-emerald-500 hover:bg-emerald-600",
        cardContent: (
            <div className="relative h-full">
                <div className="absolute inset-0 overflow-hidden">
                    <svg
                        className="absolute bottom-0 w-full h-32"
                        viewBox="0 0 420 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        role="presentation"
                    >
                        <motion.g
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.15 }}
                            transition={{ duration: 0.5 }}
                            className="fill-emerald-500 stroke-emerald-500"
                            style={{ strokeWidth: 1 }}
                        >
                            <WaveformPath />
                        </motion.g>
                        <motion.g
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.1 }}
                            transition={{ duration: 0.5 }}
                            className="fill-emerald-500 stroke-emerald-500"
                            style={{
                                strokeWidth: 1,
                                transform: "translateY(10px)",
                            }}
                        >
                            <WaveformPath />
                        </motion.g>
                    </svg>
                </div>
                <div className="p-6 h-full relative flex flex-col">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 [text-shadow:_0_1px_1px_rgb(0_0_0_/_10%)]">
                            Agents
                        </h3>
                        <p className="text-sm text-black/50 dark:text-white/50 leading-relaxed max-w-[90%]">
                            Choose the agent you want to use
                        </p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: "Users",
        title: "Users",
        color: "bg-amber-500 hover:bg-amber-600",
        cardContent: (
            <div className="relative h-full">
                <div className="absolute inset-0 overflow-hidden">
                    <svg
                        className="absolute bottom-0 w-full h-32"
                        viewBox="0 0 420 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        role="presentation"
                    >
                        <motion.g
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.15 }}
                            transition={{ duration: 0.5 }}
                            className="fill-amber-500 stroke-amber-500"
                            style={{ strokeWidth: 1 }}
                        >
                            <WaveformPath />
                        </motion.g>
                        <motion.g
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.1 }}
                            transition={{ duration: 0.5 }}
                            className="fill-amber-500 stroke-amber-500"
                            style={{
                                strokeWidth: 1,
                                transform: "translateY(10px)",
                            }}
                        >
                            <WaveformPath />
                        </motion.g>
                    </svg>
                </div>
                <div className="p-6 h-full relative flex flex-col">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 [text-shadow:_0_1px_1px_rgb(0_0_0_/_10%)]">
                            Users
                        </h3>
                        <p className="text-sm text-black/50 dark:text-white/50 leading-relaxed max-w-[90%]">
                            Choose the user you want to use
                        </p>
                    </div>
                </div>
            </div>
        ),
    },
];

interface SmoothTabProps {
    items?: TabItem[];
    defaultTabId?: string;
    className?: string;
    activeColor?: string;
    onChange?: (tabId: string) => void;
}

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
        filter: "blur(8px)",
        scale: 0.95,
        position: "absolute" as const,
    }),
    center: {
        x: 0,
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        position: "absolute" as const,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
        filter: "blur(8px)",
        scale: 0.95,
        position: "absolute" as const,
    }),
};

const transition = {
    duration: 0.4,
    ease: [0.32, 0.72, 0, 1],
};

export default function SmoothTab({
    items = DEFAULT_TABS,
    defaultTabId = DEFAULT_TABS[0].id,
    className,
    activeColor = "bg-[#1F9CFE]",
    onChange,
}: SmoothTabProps) {
    const [selected, setSelected] = React.useState<string>(defaultTabId);
    const [direction, setDirection] = React.useState(0);
    const [dimensions, setDimensions] = React.useState({ width: 0, left: 0 });

    // Reference for the selected button
    const buttonRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Update dimensions whenever selected tab changes or on mount
    React.useLayoutEffect(() => {
        const updateDimensions = () => {
            const selectedButton = buttonRefs.current.get(selected);
            const container = containerRef.current;

            if (selectedButton && container) {
                const rect = selectedButton.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();

                setDimensions({
                    width: rect.width,
                    left: rect.left - containerRect.left,
                });
            }
        };

        // Initial update
        requestAnimationFrame(() => {
            updateDimensions();
        });

        // Update on resize
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [selected]);

    const handleTabClick = (tabId: string) => {
        const currentIndex = items.findIndex((item) => item.id === selected);
        const newIndex = items.findIndex((item) => item.id === tabId);
        setDirection(newIndex > currentIndex ? 1 : -1);
        setSelected(tabId);
        onChange?.(tabId);
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLButtonElement>,
        tabId: string
    ) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleTabClick(tabId);
        }
    };

    const selectedItem = items.find((item) => item.id === selected);

    return (
        <div className="flex flex-col h-full">
            {/* Card Content Area */}
            <div className="flex-1 mb-4 relative">
                <div className="bg-card border rounded-lg h-[200px] w-full relative">
                    <div className="absolute inset-0 overflow-hidden rounded-lg">
                        <AnimatePresence
                            initial={false}
                            mode="popLayout"
                            custom={direction}
                        >
                            <motion.div
                                key={`card-${selected}`}
                                custom={direction}
                                variants={slideVariants as any}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={transition as any}
                                className="absolute inset-0 w-full h-full will-change-transform bg-card"
                                style={{
                                    backfaceVisibility: "hidden",
                                    WebkitBackfaceVisibility: "hidden",
                                }}
                            >
                                {selectedItem?.cardContent}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Bottom Toolbar */}
            <div
                ref={containerRef}
                role="tablist"
                aria-label="Smooth tabs"
                className={cn(
                    "flex items-center justify-between gap-1 py-1 mt-auto relative",
                    "bg-background w-[400px] mx-auto",
                    "border rounded-xl",
                    "transition-all duration-200",
                    className
                )}
            >
                {/* Sliding Background */}
                <motion.div
                    className={cn(
                        "absolute rounded-lg z-[1]",
                        selectedItem?.color || activeColor
                    )}
                    initial={false}
                    animate={{
                        width: dimensions.width - 8,
                        x: dimensions.left + 4,
                        opacity: 1,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                    }}
                    style={{ height: "calc(100% - 8px)", top: "4px" }}
                />

                <div className="grid grid-cols-4 w-full gap-1 relative z-[2]">
                    {items.map((item) => {
                        const isSelected = selected === item.id;
                        return (
                            <motion.button
                                key={item.id}
                                ref={(el) => {
                                    if (el) buttonRefs.current.set(item.id, el);
                                    else buttonRefs.current.delete(item.id);
                                }}
                                type="button"
                                role="tab"
                                aria-selected={isSelected}
                                aria-controls={`panel-${item.id}`}
                                id={`tab-${item.id}`}
                                tabIndex={isSelected ? 0 : -1}
                                onClick={() => handleTabClick(item.id)}
                                onKeyDown={(e) => handleKeyDown(e, item.id)}
                                className={cn(
                                    "relative flex items-center justify-center gap-0.5 rounded-lg px-2 py-1.5",
                                    "text-sm font-medium transition-all duration-300",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    "truncate",
                                    isSelected
                                        ? "text-white"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                )}
                            >
                                <span className="truncate">{item.title}</span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

```


## Team Selector (team-selector)
Type: registry:component
Group selector with a different style.
**Dependencies:** deps: motion

`$ components/kokonutui/team-selector.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Team Selector
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { AnimatePresence, motion, type Variants } from "motion/react";
import Image from "next/image";
import { useState } from "react";

const MAX_TEAM_SIZE = 4;

type TeamMember = {
  id: string;
  avatarUrl: string;
  name: string;
};

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "member-1",
    avatarUrl:
      "https://bykuknqwpctcjrowysyf.supabase.co/storage/v1/object/public/assets/avatar-01.png",
    name: "Team Member 1",
  },
  {
    id: "member-2",
    avatarUrl:
      "https://bykuknqwpctcjrowysyf.supabase.co/storage/v1/object/public/assets/avatar-02.png",
    name: "Team Member 2",
  },
  {
    id: "member-3",
    avatarUrl:
      "https://bykuknqwpctcjrowysyf.supabase.co/storage/v1/object/public/assets/avatar-03.png",
    name: "Team Member 3",
  },
  {
    id: "member-4",
    avatarUrl:
      "https://bykuknqwpctcjrowysyf.supabase.co/storage/v1/object/public/assets/avatar-04.png",
    name: "Team Member 4",
  },
] as const;

const animations = {
  container: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  } satisfies Variants,
  avatar: {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.15 },
    },
  } satisfies Variants,
  vibration: {
    initial: { x: 0 },
    animate: {
      x: [-5, 5, -5, 5, 0] as const,
      transition: { duration: 0.3 },
    },
  } satisfies Variants,
  number: {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  } satisfies Variants,
} as const;

interface TeamSelectorProps {
  defaultValue?: number;
  onChange?: (size: number) => void;
  className?: string;
}

export default function TeamSelector({
  defaultValue = 1,
  onChange,
  className = "",
}: TeamSelectorProps) {
  const [peopleCount, setPeopleCount] = useState(defaultValue);
  const [isVibrating, setIsVibrating] = useState(false);

  const handleIncrement = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (peopleCount < MAX_TEAM_SIZE) {
      const newCount = peopleCount + 1;
      setPeopleCount(newCount);
      onChange?.(newCount);
    } else {
      triggerVibration();
    }
  };

  const handleDecrement = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (peopleCount > 1) {
      const newCount = peopleCount - 1;
      setPeopleCount(newCount);
      onChange?.(newCount);
    } else {
      triggerVibration();
    }
  };

  const triggerVibration = () => {
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 300);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    action: "increment" | "decrement"
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action === "increment" ? handleIncrement(e) : handleDecrement(e);
    }
  };

  const renderAvatars = () =>
    TEAM_MEMBERS.slice(0, peopleCount).map((member, index) => (
      <motion.div
        animate="animate"
        className="flex items-center justify-center"
        exit="exit"
        initial="initial"
        key={member.id}
        style={{
          zIndex: peopleCount - index,
          marginLeft: index === 0 ? 0 : -24,
        }}
        variants={animations.avatar}
      >
        <Image
          alt={member.name}
          className="rounded-full border-[0.5px] border-white/10 bg-gradient-to-b from-white/5 to-white/20 object-cover shadow-[0_8px_28px_-6px/0.2] backdrop-blur-sm transition-all duration-300 ease-fluid hover:shadow-[0_12px_32px_-8px/0.3] dark:border-white/5 dark:from-white/5 dark:to-black/20 dark:shadow-[0_8px_28px_-6px/0.3] dark:hover:shadow-[0_12px_32px_-8px/0.4]"
          height={96}
          src={member.avatarUrl}
          width={96}
        />
      </motion.div>
    ));

  return (
    <motion.div
      animate="animate"
      className={`flex w-full flex-col items-center justify-center gap-8 ${className}`}
      exit="exit"
      initial="initial"
      variants={animations.container}
    >
      <fieldset className="w-full">
        <legend className="sr-only">Team size selector</legend>
        <div className="relative flex h-24 w-full justify-center">
          <AnimatePresence mode="popLayout">{renderAvatars()}</AnimatePresence>
        </div>

        <motion.div
          animate={isVibrating ? "animate" : "initial"}
          className="mt-8 flex items-center justify-center gap-8"
          initial="initial"
          variants={isVibrating ? animations.vibration : undefined}
        >
          <button
            aria-label="Decrease team size"
            className="h-12 w-12 rounded-full border border-zinc-200/80 bg-gradient-to-b from-white to-zinc-50 text-zinc-900 shadow-[0_2px_8px_-2px/0.1] transition-all duration-200 ease-fluid hover:border-zinc-300 hover:shadow-[0_4px_12px_-4px/0.2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:from-zinc-50 active:to-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:from-white disabled:active:to-zinc-50 disabled:hover:border-zinc-200/80 disabled:hover:shadow-[0_2px_8px_-2px/0.1] dark:border-zinc-700/80 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-100 dark:shadow-[0_2px_8px_-2px/0.3] dark:active:from-zinc-900 dark:active:to-zinc-800 dark:disabled:active:from-zinc-800 dark:disabled:active:to-zinc-900 dark:focus-visible:ring-zinc-400/30 dark:focus-visible:ring-offset-zinc-900 dark:hover:border-zinc-600 dark:hover:shadow-[0_4px_12px_-4px/0.4] dark:disabled:hover:border-zinc-700/80 dark:disabled:hover:shadow-[0_2px_8px_-2px/0.3]"
            disabled={peopleCount <= 1}
            onClick={handleDecrement}
            onKeyDown={(e) => handleKeyDown(e, "decrement")}
            type="button"
          >
            <span className="select-none font-medium text-2xl">-</span>
          </button>

          <motion.output
            animate="animate"
            aria-label={`Current team size: ${peopleCount}`}
            className="select-none bg-gradient-to-b from-zinc-800 to-zinc-600 bg-clip-text font-medium text-2xl text-transparent dark:from-zinc-200 dark:to-zinc-400"
            initial="initial"
            key={peopleCount}
            variants={animations.number}
          >
            {peopleCount}
          </motion.output>

          <button
            aria-label="Increase team size"
            className="h-12 w-12 rounded-full border border-zinc-200/80 bg-gradient-to-b from-white to-zinc-50 text-zinc-900 shadow-[0_2px_8px_-2px/0.1] transition-all duration-200 ease-fluid hover:border-zinc-300 hover:shadow-[0_4px_12px_-4px/0.2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:from-zinc-50 active:to-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:from-white disabled:active:to-zinc-50 disabled:hover:border-zinc-200/80 disabled:hover:shadow-[0_2px_8px_-2px/0.1] dark:border-zinc-700/80 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-100 dark:shadow-[0_2px_8px_-2px/0.3] dark:active:from-zinc-900 dark:active:to-zinc-800 dark:disabled:active:from-zinc-800 dark:disabled:active:to-zinc-900 dark:focus-visible:ring-zinc-400/30 dark:focus-visible:ring-offset-zinc-900 dark:hover:border-zinc-600 dark:hover:shadow-[0_4px_12px_-4px/0.4] dark:disabled:hover:border-zinc-700/80 dark:disabled:hover:shadow-[0_2px_8px_-2px/0.3]"
            disabled={peopleCount >= MAX_TEAM_SIZE}
            onClick={handleIncrement}
            onKeyDown={(e) => handleKeyDown(e, "increment")}
            type="button"
          >
            <span className="select-none font-medium text-2xl">+</span>
          </button>
        </motion.div>
      </fieldset>
    </motion.div>
  );
}

```


## Switch Button (switch-button)
Type: registry:component
Animated shadow theme switcher button.
**Dependencies:** deps: lucide-react; registry: button

`$ components/kokonutui/switch-button.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Switch Button
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface SwitchButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "minimal";
    size?: "sm" | "default" | "lg";
    showLabel?: boolean;
}

export default function SwitchButton({
    className,
    variant = "minimal",
    size = "default",
    showLabel = true,
    ...props
}: SwitchButtonProps) {
    const { setTheme, theme } = useTheme();

    const handleThemeToggle = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const variants = {
        minimal: [
            "rounded-lg",
            "bg-gradient-to-b from-zinc-50/95 to-zinc-100/95 dark:from-zinc-800/95 dark:to-zinc-900/95",
            "hover:from-zinc-100/95 hover:to-zinc-200/95 dark:hover:from-zinc-700/95 dark:hover:to-zinc-800/95",
            "border border-zinc-200 dark:border-zinc-700/80",
            "hover:border-zinc-300 dark:hover:border-zinc-600",
            "shadow-[0_1px_2px_-1px_rgb(0_0_0/0.1),0_1px_3px_-2px_rgb(0_0_0/0.1)] dark:shadow-[0_1px_2px_-1px_rgb(0_0_0/0.3),0_1px_3px_-2px_rgb(0_0_0/0.3)]",
            "hover:shadow-[0_2px_4px_-2px_rgb(0_0_0/0.15),0_2px_6px_-3px_rgb(0_0_0/0.15)] dark:hover:shadow-[0_2px_4px_-2px_rgb(0_0_0/0.4),0_2px_6px_-3px_rgb(0_0_0/0.4)]",
            "active:shadow-[0_0px_1px_0_rgb(0_0_0/0.1)] dark:active:shadow-[0_0px_1px_0_rgb(0_0_0/0.2)]",
            "transition-all duration-200 ease-out",
            "backdrop-blur-sm",
            "relative",
            "after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-t after:from-white/10 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity",
            "before:absolute before:inset-[1px] before:rounded-[7px] before:bg-gradient-to-b before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity dark:before:from-white/5",
        ],
    };

    const sizes = {
        sm: "h-8 px-3 text-sm",
        default: "h-10 px-4",
        lg: "h-11 px-5",
    };

    return (
        <Button
            onClick={handleThemeToggle}
            className={cn(
                "relative group",
                "transition-all duration-300 ease-out",
                "text-zinc-600 dark:text-zinc-300",
                "hover:text-zinc-800 dark:hover:text-zinc-100",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            <div
                className={cn(
                    "flex items-center gap-2",
                    "transition-all duration-300 ease-out"
                )}
            >
                <Sun
                    className={cn(
                        "transition-all duration-700 ease-in-out",
                        size === "sm" && "w-3.5 h-3.5",
                        size === "default" && "w-4 h-4",
                        size === "lg" && "w-5 h-5",
                        "group-hover:rotate-[360deg] group-hover:scale-110",
                        theme === "dark" ? "rotate-180" : "rotate-0",
                        "transform-gpu",
                        "drop-shadow-[0_0_12px_rgba(252,211,77,0.3)] dark:drop-shadow-[0_0_12px_rgba(252,211,77,0.2)]",
                        theme === "dark"
                            ? "text-zinc-300 group-hover:text-zinc-100"
                            : "text-amber-500 group-hover:text-amber-600",
                        "group-active:scale-95"
                    )}
                />
                {showLabel && (
                    <span
                        className={cn(
                            "capitalize font-medium relative",
                            "transition-opacity duration-300 ease-out"
                        )}
                    >
                        <span
                            className={cn(
                                "absolute inset-0",
                                theme === "dark" ? "opacity-0" : "opacity-100",
                                "transition-opacity duration-300 ease-out"
                            )}
                        >
                            Light
                            <span
                                className={cn(
                                    "absolute -bottom-px left-0 w-full h-px",
                                    "bg-linear-to-r from-zinc-400/0 via-zinc-400/50 to-zinc-400/0",
                                    "dark:from-zinc-600/0 dark:via-zinc-600/50 dark:to-zinc-600/0",
                                    "opacity-0 group-hover:opacity-100",
                                    "transition-opacity duration-200"
                                )}
                            />
                        </span>
                        <span
                            className={cn(
                                "absolute inset-0",
                                theme === "dark" ? "opacity-100" : "opacity-0",
                                "transition-opacity duration-300 ease-out"
                            )}
                        >
                            Dark
                            <span
                                className={cn(
                                    "absolute -bottom-px left-0 w-full h-px",
                                    "bg-linear-to-r from-zinc-400/0 via-zinc-400/50 to-zinc-400/0",
                                    "dark:from-zinc-600/0 dark:via-zinc-600/50 dark:to-zinc-600/0",
                                    "opacity-0 group-hover:opacity-100",
                                    "transition-opacity duration-200"
                                )}
                            />
                        </span>
                        <span className="opacity-0">Light</span>
                    </span>
                )}
            </div>
            <span
                className={cn(
                    "absolute inset-0",
                    "bg-gradient-to-r from-zinc-500/0 via-zinc-500/[0.12] to-zinc-500/0 dark:from-white/0 dark:via-white/[0.05]",
                    "translate-x-[-100%]",
                    "group-hover:translate-x-[100%]",
                    "transition-transform duration-500",
                    "ease-in-out",
                    "pointer-events-none",
                    "z-[1]"
                )}
            />
            <span
                className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100",
                    "bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.12),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.07),transparent_70%)]",
                    "transition-opacity duration-500",
                    "pointer-events-none",
                    "z-[2]"
                )}
            />
        </Button>
    );
}

```


## Bento Grid (bento-grid)
Type: registry:component
Grid of 4 cards with different content and animations.
**Dependencies:** deps: lucide-react, motion

`$ components/kokonutui/bento-grid.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Bento Grid
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import Anthropic from "@/components/icons/anthropic";
import AnthropicDark from "@/components/icons/anthropic-dark";
import Google from "@/components/icons/gemini";
import OpenAI from "@/components/icons/open-ai";
import OpenAIDark from "@/components/icons/open-ai-dark";
import MistralAI from "@/components/icons/mistral";
import DeepSeek from "@/components/icons/deepseek";
import { cn } from "@/lib/utils";
import {
    Mic,
    Plus,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    Sparkles,
    Zap,
} from "lucide-react";
import {
    motion,
    useMotionValue,
    useTransform,
    type Variants,
} from "motion/react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface BentoItem {
    id: string;
    title: string;
    description: string;
    icons?: boolean;
    href?: string;
    feature?:
        | "chart"
        | "counter"
        | "code"
        | "timeline"
        | "spotlight"
        | "icons"
        | "typing"
        | "metrics";
    spotlightItems?: string[];
    timeline?: Array<{ year: string; event: string }>;
    code?: string;
    codeLang?: string;
    typingText?: string;
    metrics?: Array<{
        label: string;
        value: number;
        suffix?: string;
        color?: string;
    }>;
    statistic?: {
        value: string;
        label: string;
        start?: number;
        end?: number;
        suffix?: string;
    };
    size?: "sm" | "md" | "lg";
    className?: string;
}

const bentoItems: BentoItem[] = [
    {
        id: "main",
        title: "Building tomorrow's technology",
        description:
            "We architect and develop enterprise-grade applications that scale seamlessly with cloud-native technologies and microservices.",
        href: "#",
        feature: "spotlight",
        spotlightItems: [
            "Microservices architecture",
            "Serverless computing",
            "Container orchestration",
            "API-first design",
            "Event-driven systems",
        ],
        size: "lg",
        className: "col-span-2 row-span-1 md:col-span-2 md:row-span-1",
    },
    {
        id: "stat1",
        title: "AI Agents & Automation",
        description:
            "Intelligent agents that learn, adapt, and automate complex workflows",
        href: "#",
        feature: "typing",
        typingText:
            "const createAgent = async () => {\n  const agent = new AIAgent({\n    model: 'gpt-4-turbo',\n    tools: [codeAnalysis, dataProcessing],\n    memory: new ConversationalMemory()\n  });\n\n  // Train on domain knowledge\n  await agent.learn(domainData);\n\n  return agent;\n};",
        size: "md",
        className: "col-span-2 row-span-1 col-start-1 col-end-3",
    },
    {
        id: "partners",
        title: "Trusted partners",
        description:
            "Working with the leading AI and cloud providers to deliver cutting-edge solutions",
        icons: true,
        href: "#",
        feature: "icons",
        size: "md",
        className: "col-span-1 row-span-1",
    },
    {
        id: "innovation",
        title: "Innovation timeline",
        description:
            "Pioneering the future of AI and cloud computing with breakthrough innovations",
        href: "#",
        feature: "timeline",
        timeline: [
            { year: "2020", event: "Launch of Cloud-Native Platform" },
            { year: "2021", event: "Advanced AI Integration & LLM APIs" },
            { year: "2022", event: "Multi-Agent Systems & RAG Architecture" },
            { year: "2023", event: "Autonomous AI Agents & Neural Networks" },
            {
                year: "2024",
                event: "AGI-Ready Infrastructure & Edge Computing",
            },
        ],
        size: "sm",
        className: "col-span-1 row-span-1",
    },
];

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3,
        },
    },
};

const SpotlightFeature = ({ items }: { items: string[] }) => {
    return (
        <ul className="mt-2 space-y-1.5">
            {items.map((item, index) => (
                <motion.li
                    key={`spotlight-${item.toLowerCase().replace(/\s+/g, "-")}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-2"
                >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {item}
                    </span>
                </motion.li>
            ))}
        </ul>
    );
};

const CounterAnimation = ({
    start,
    end,
    suffix = "",
}: {
    start: number;
    end: number;
    suffix?: string;
}) => {
    const [count, setCount] = useState(start);

    useEffect(() => {
        const duration = 2000;
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);

        let currentFrame = 0;
        const counter = setInterval(() => {
            currentFrame++;
            const progress = currentFrame / totalFrames;
            const easedProgress = 1 - (1 - progress) ** 3;
            const current = start + (end - start) * easedProgress;

            setCount(Math.min(current, end));

            if (currentFrame === totalFrames) {
                clearInterval(counter);
            }
        }, frameRate);

        return () => clearInterval(counter);
    }, [start, end]);

    return (
        <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                {count.toFixed(1).replace(/\.0$/, "")}
            </span>
            <span className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
                {suffix}
            </span>
        </div>
    );
};

const ChartAnimation = ({ value }: { value: number }) => {
    return (
        <div className="mt-2 w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <motion.div
                className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />
        </div>
    );
};

const IconsFeature = () => {
    return (
        <div className="grid grid-cols-3 gap-4 mt-4">
            <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
                <div className="relative w-8 h-8 flex items-center justify-center">
                    <OpenAI className="w-7 h-7 dark:hidden transition-transform " />
                    <OpenAIDark className="w-7 h-7 hidden dark:block transition-transform " />
                </div>
                <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                    OpenAI
                </span>
            </motion.div>
            <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
                <div className="relative w-8 h-8 flex items-center justify-center">
                    <Anthropic className="w-7 h-7 dark:hidden transition-transform " />
                    <AnthropicDark className="w-7 h-7 hidden dark:block transition-transform " />
                </div>
                <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                    Anthropic
                </span>
            </motion.div>
            <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
                <div className="relative w-8 h-8 flex items-center justify-center">
                    <Google className="w-7 h-7 transition-transform " />
                </div>
                <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                    Google
                </span>
            </motion.div>
            <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
                <div className="relative w-8 h-8 flex items-center justify-center">
                    <MistralAI className="w-7 h-7 transition-transform " />
                </div>
                <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                    Mistral
                </span>
            </motion.div>
            <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
                <div className="relative w-8 h-8 flex items-center justify-center">
                    <DeepSeek className="w-7 h-7 transition-transform " />
                </div>
                <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                    DeepSeek
                </span>
            </motion.div>
            <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
                <div className="relative w-8 h-8 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-neutral-600 dark:text-neutral-400 transition-transform " />
                </div>
                <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
                    More
                </span>
            </motion.div>
        </div>
    );
};

const TimelineFeature = ({
    timeline,
}: {
    timeline: Array<{ year: string; event: string }>;
}) => {
    return (
        <div className="mt-3 relative">
            <div className="absolute top-0 bottom-0 left-[9px] w-[2px] bg-neutral-200 dark:bg-neutral-700" />
            {timeline.map((item) => (
                <motion.div
                    key={`timeline-${item.year}-${item.event
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    className="flex gap-3 mb-3 relative"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                        delay: (0.15 * Number.parseInt(item.year)) % 10,
                    }}
                >
                    <div className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-600 flex-shrink-0 z-10 mt-0.5" />
                    <div>
                        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {item.year}
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            {item.event}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const TypingCodeFeature = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);

                if (terminalRef.current) {
                    terminalRef.current.scrollTop =
                        terminalRef.current.scrollHeight;
                }
            }, Math.random() * 30 + 10); // Random typing speed for realistic effect

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, text]);

    // Reset animation when component unmounts and remounts
    useEffect(() => {
        setDisplayedText("");
        setCurrentIndex(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="mt-3 relative">
            <div className="flex items-center gap-2 mb-2">
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    server.ts
                </div>
            </div>
            <div
                ref={terminalRef}
                className="bg-neutral-900 dark:bg-black text-neutral-100 p-3 rounded-md text-xs font-mono h-[150px] overflow-y-auto"
            >
                <pre className="whitespace-pre-wrap">
                    {displayedText}
                    <span className="animate-pulse">|</span>
                </pre>
            </div>
        </div>
    );
};

const MetricsFeature = ({
    metrics,
}: {
    metrics: Array<{
        label: string;
        value: number;
        suffix?: string;
        color?: string;
    }>;
}) => {
    const getColorClass = (color = "emerald") => {
        const colors = {
            emerald: "bg-emerald-500 dark:bg-emerald-400",
            blue: "bg-blue-500 dark:bg-blue-400",
            violet: "bg-violet-500 dark:bg-violet-400",
            amber: "bg-amber-500 dark:bg-amber-400",
            rose: "bg-rose-500 dark:bg-rose-400",
        };
        return colors[color as keyof typeof colors] || colors.emerald;
    };

    return (
        <div className="mt-3 space-y-3">
            {metrics.map((metric, index) => (
                <motion.div
                    key={`metric-${metric.label
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    className="space-y-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 * index }}
                >
                    <div className="flex justify-between items-center text-sm">
                        <div className="text-neutral-700 dark:text-neutral-300 font-medium flex items-center gap-1.5">
                            {metric.label === "Uptime" && (
                                <Clock className="w-3.5 h-3.5" />
                            )}
                            {metric.label === "Response time" && (
                                <Zap className="w-3.5 h-3.5" />
                            )}
                            {metric.label === "Cost reduction" && (
                                <Sparkles className="w-3.5 h-3.5" />
                            )}
                            {metric.label}
                        </div>
                        <div className="text-neutral-700 dark:text-neutral-300 font-semibold">
                            {metric.value}
                            {metric.suffix}
                        </div>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full rounded-full ${getColorClass(
                                metric.color
                            )}`}
                            initial={{ width: 0 }}
                            animate={{
                                width: `${Math.min(100, metric.value)}%`,
                            }}
                            transition={{
                                duration: 1.2,
                                ease: "easeOut",
                                delay: 0.15 * index,
                            }}
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

function AIInput_Voice() {
    const [submitted, setSubmitted] = useState(false);
    const [time, setTime] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [isDemo, setIsDemo] = useState(true);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (submitted) {
            intervalId = setInterval(() => {
                setTime((t) => t + 1);
            }, 1000);
        } else {
            setTime(0);
        }

        return () => clearInterval(intervalId);
    }, [submitted]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    useEffect(() => {
        if (!isDemo) return;

        let timeoutId: NodeJS.Timeout;
        const runAnimation = () => {
            setSubmitted(true);
            timeoutId = setTimeout(() => {
                setSubmitted(false);
                timeoutId = setTimeout(runAnimation, 1000);
            }, 3000);
        };

        const initialTimeout = setTimeout(runAnimation, 100);
        return () => {
            clearTimeout(timeoutId);
            clearTimeout(initialTimeout);
        };
    }, [isDemo]);

    const handleClick = () => {
        if (isDemo) {
            setIsDemo(false);
            setSubmitted(false);
        } else {
            setSubmitted((prev) => !prev);
        }
    };

    return (
        <div className="w-full py-4">
            <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
                <button
                    className={cn(
                        "group w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
                        submitted
                            ? "bg-none"
                            : "bg-none hover:bg-black/10 dark:hover:bg-white/10"
                    )}
                    type="button"
                    onClick={handleClick}
                >
                    {submitted ? (
                        <div
                            className="w-6 h-6 rounded-sm animate-spin bg-black  dark:bg-white cursor-pointer pointer-events-auto"
                            style={{ animationDuration: "3s" }}
                        />
                    ) : (
                        <Mic className="w-6 h-6 text-black/70 dark:text-white/70" />
                    )}
                </button>

                <span
                    className={cn(
                        "font-mono text-sm transition-opacity duration-300",
                        submitted
                            ? "text-black/70 dark:text-white/70"
                            : "text-black/30 dark:text-white/30"
                    )}
                >
                    {formatTime(time)}
                </span>

                <div className="h-4 w-64 flex items-center justify-center gap-0.5">
                    {[...Array(48)].map((_, i) => (
                        <div
                            key={`voice-bar-${i}`}
                            className={cn(
                                "w-0.5 rounded-full transition-all duration-300",
                                submitted
                                    ? "bg-black/50 dark:bg-white/50 animate-pulse"
                                    : "bg-black/10 dark:bg-white/10 h-1"
                            )}
                            style={
                                submitted && isClient
                                    ? {
                                          height: `${20 + Math.random() * 80}%`,
                                          animationDelay: `${i * 0.05}s`,
                                      }
                                    : undefined
                            }
                        />
                    ))}
                </div>

                <p className="h-4 text-xs text-black/70 dark:text-white/70">
                    {submitted ? "Listening..." : "Click to speak"}
                </p>
            </div>
        </div>
    );
}

const BentoCard = ({ item }: { item: BentoItem }) => {
    const [isHovered, setIsHovered] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [2, -2]);
    const rotateY = useTransform(x, [-100, 100], [-2, 2]);

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct * 100);
        y.set(yPct * 100);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    }

    return (
        <motion.div
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="h-full"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={handleMouseLeave}
            onMouseMove={handleMouseMove}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
        >
            <Link
                href={item.href || "#"}
                className={`
                    group relative flex flex-col gap-4 h-full rounded-xl p-5
                    bg-gradient-to-b from-neutral-50/60 via-neutral-50/40 to-neutral-50/30 
                    dark:from-neutral-900/60 dark:via-neutral-900/40 dark:to-neutral-900/30
                    border border-neutral-200/60 dark:border-neutral-800/60
                    before:absolute before:inset-0 before:rounded-xl
                    before:bg-gradient-to-b before:from-white/10 before:via-white/20 before:to-transparent 
                    dark:before:from-black/10 dark:before:via-black/20 dark:before:to-transparent
                    before:opacity-100 before:transition-opacity before:duration-500
                    after:absolute after:inset-0 after:rounded-xl after:bg-neutral-50/70 dark:after:bg-neutral-900/70 after:z-[-1]
                    backdrop-blur-[4px]
                    shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.2)]
                    hover:border-neutral-300/50 dark:hover:border-neutral-700/50
                    hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)]
                    hover:backdrop-blur-[6px]
                    hover:bg-gradient-to-b hover:from-neutral-50/60 hover:via-neutral-50/30 hover:to-neutral-50/20
                    dark:hover:from-neutral-800/60 dark:hover:via-neutral-800/30 dark:hover:to-neutral-800/20
                    transition-all duration-500 ease-out ${item.className}
                `}
                tabIndex={0}
                aria-label={`${item.title} - ${item.description}`}
            >
                <div
                    className="relative z-10 flex flex-col gap-3 h-full"
                    style={{ transform: "translateZ(20px)" }}
                >
                    <div className="space-y-2 flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors duration-300">
                                {item.title}
                            </h3>
                            <div className="text-neutral-400 dark:text-neutral-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                <ArrowUpRight className="h-5 w-5" />
                            </div>
                        </div>

                        <p className="text-sm text-neutral-600 dark:text-neutral-400 tracking-tight">
                            {item.description}
                        </p>

                        {/* Feature specific content */}
                        {item.feature === "spotlight" &&
                            item.spotlightItems && (
                                <SpotlightFeature items={item.spotlightItems} />
                            )}

                        {item.feature === "counter" && item.statistic && (
                            <div className="mt-auto pt-3">
                                <CounterAnimation
                                    start={item.statistic.start || 0}
                                    end={item.statistic.end || 100}
                                    suffix={item.statistic.suffix}
                                />
                            </div>
                        )}

                        {item.feature === "chart" && item.statistic && (
                            <div className="mt-auto pt-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        {item.statistic.label}
                                    </span>
                                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        {item.statistic.end}
                                        {item.statistic.suffix}
                                    </span>
                                </div>
                                <ChartAnimation
                                    value={item.statistic.end || 0}
                                />
                            </div>
                        )}

                        {item.feature === "timeline" && item.timeline && (
                            <TimelineFeature timeline={item.timeline} />
                        )}

                        {item.feature === "icons" && <IconsFeature />}

                        {item.feature === "typing" && item.typingText && (
                            <TypingCodeFeature text={item.typingText} />
                        )}

                        {item.feature === "metrics" && item.metrics && (
                            <MetricsFeature metrics={item.metrics} />
                        )}

                        {item.icons && !item.feature && (
                            <div className="mt-auto pt-4 flex items-center flex-wrap gap-4 border-t border-neutral-200/70 dark:border-neutral-800/70">
                                <OpenAI className="w-5 h-5 dark:hidden opacity-70 hover:opacity-100 transition-opacity" />
                                <OpenAIDark className="w-5 h-5 hidden dark:block opacity-70 hover:opacity-100 transition-opacity" />
                                <AnthropicDark className="w-5 h-5 dark:block hidden opacity-70 hover:opacity-100 transition-opacity" />
                                <Anthropic className="w-5 h-5 dark:hidden opacity-70 hover:opacity-100 transition-opacity" />
                                <Google className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
                                <MistralAI className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
                                <DeepSeek className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default function BentoGrid() {
    return (
        <section className="relative py-24 sm:py-32 bg-white dark:bg-black overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Bento Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="grid gap-6"
                >
                    <div className="grid md:grid-cols-3 gap-6">
                        <motion.div
                            variants={fadeInUp}
                            className="md:col-span-1"
                        >
                            <BentoCard item={bentoItems[0]} />
                        </motion.div>
                        <motion.div
                            variants={fadeInUp}
                            className="md:col-span-2"
                        >
                            <BentoCard item={bentoItems[1]} />
                        </motion.div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <motion.div
                            variants={fadeInUp}
                            className="md:col-span-1"
                        >
                            <BentoCard item={bentoItems[2]} />
                        </motion.div>
                        <motion.div
                            variants={fadeInUp}
                            className="md:col-span-1 rounded-xl overflow-hidden bg-gradient-to-b from-neutral-50/80 to-neutral-50 dark:from-neutral-900/80 dark:to-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 hover:border-neutral-400/30 dark:hover:border-neutral-600/30 hover:shadow-lg hover:shadow-neutral-200/20 dark:hover:shadow-neutral-900/20 transition-all duration-300"
                        >
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                                        Voice Assistant
                                    </h3>
                                </div>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 tracking-tight mb-4">
                                    Interact with our AI using natural voice
                                    commands. Experience seamless voice-driven
                                    interactions with advanced speech
                                    recognition.
                                </p>
                                <AIInput_Voice />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

```

`$ components/icons/anthropic.tsx`
```tsx
const Anthropic = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        fill="#000"
        fillRule="evenodd"
        style={{
            flex: "none",
            lineHeight: 1,
        }}
        viewBox="0 0 24 24"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        height="1em"
        {...props}
    >
        <title>{"Anthropic"}</title>
        <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
    </svg>
);
export default Anthropic;

```

`$ components/icons/anthropic-dark.tsx`
```tsx
import type { SVGProps } from "react";
const AnthropicDark = (props: SVGProps<SVGSVGElement>) => (
    <svg
        fill="#ffff"
        fillRule="evenodd"
        style={{
            flex: "none",
            lineHeight: 1,
        }}
        viewBox="0 0 24 24"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        height="1em"
        {...props}
    >
        <title>{"Anthropic"}</title>
        <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
    </svg>
);
export default AnthropicDark;

```

`$ components/icons/gemini.tsx`
```tsx
const Gemini = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        height="1em"
        style={{
            flex: "none",
            lineHeight: 1,
        }}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        {...props}
    >
        <title>{"Gemini"}</title>
        <defs>
            <linearGradient
                id="lobe-icons-gemini-fill"
                x1="0%"
                x2="68.73%"
                y1="100%"
                y2="30.395%"
            >
                <stop offset="0%" stopColor="#1C7DFF" />
                <stop offset="52.021%" stopColor="#1C69FF" />
                <stop offset="100%" stopColor="#F0DCD6" />
            </linearGradient>
        </defs>
        <path
            d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
            fill="url(#lobe-icons-gemini-fill)"
            fillRule="nonzero"
        />
    </svg>
);
export default Gemini;

```

`$ components/icons/open-ai.tsx`
```tsx
const OpenAI = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        preserveAspectRatio="xMidYMid"
        viewBox="0 0 256 260"
        {...props}
    >
        <title>OpenAI</title>
        <path d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z" />
    </svg>
);

export default OpenAI;

```

`$ components/icons/open-ai-dark.tsx`
```tsx
import type { SVGProps } from "react";

const OpenAIDark = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        preserveAspectRatio="xMidYMid"
        viewBox="0 0 256 260"
        {...props}
    >
        <title>OpenAI</title>
        <path
            fill="#fff"
            d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z"
        />
    </svg>
);
export default OpenAIDark;

```

`$ components/icons/mistral.tsx`
```tsx


const MistralAI = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
        viewBox="0 0 256 233"
        width="1em"
        height="1em"
        {...props}
    >
        <title>Mistral AI</title>
        <path d="M186.18182 0h46.54545v46.54545h-46.54545z" />
        <path fill="#F7D046" d="M209.45454 0h46.54545v46.54545h-46.54545z" />
        <path d="M0 0h46.54545v46.54545H0zM0 46.54545h46.54545V93.0909H0zM0 93.09091h46.54545v46.54545H0zM0 139.63636h46.54545v46.54545H0zM0 186.18182h46.54545v46.54545H0z" />
        <path fill="#F7D046" d="M23.27273 0h46.54545v46.54545H23.27273z" />
        <path
            fill="#F2A73B"
            d="M209.45454 46.54545h46.54545V93.0909h-46.54545zM23.27273 46.54545h46.54545V93.0909H23.27273z"
        />
        <path d="M139.63636 46.54545h46.54545V93.0909h-46.54545z" />
        <path
            fill="#F2A73B"
            d="M162.90909 46.54545h46.54545V93.0909h-46.54545zM69.81818 46.54545h46.54545V93.0909H69.81818z"
        />
        <path
            fill="#EE792F"
            d="M116.36364 93.09091h46.54545v46.54545h-46.54545zM162.90909 93.09091h46.54545v46.54545h-46.54545zM69.81818 93.09091h46.54545v46.54545H69.81818z"
        />
        <path d="M93.09091 139.63636h46.54545v46.54545H93.09091z" />
        <path
            fill="#EB5829"
            d="M116.36364 139.63636h46.54545v46.54545h-46.54545z"
        />
        <path
            fill="#EE792F"
            d="M209.45454 93.09091h46.54545v46.54545h-46.54545zM23.27273 93.09091h46.54545v46.54545H23.27273z"
        />
        <path d="M186.18182 139.63636h46.54545v46.54545h-46.54545z" />
        <path
            fill="#EB5829"
            d="M209.45454 139.63636h46.54545v46.54545h-46.54545z"
        />
        <path d="M186.18182 186.18182h46.54545v46.54545h-46.54545z" />
        <path
            fill="#EB5829"
            d="M23.27273 139.63636h46.54545v46.54545H23.27273z"
        />
        <path
            fill="#EA3326"
            d="M209.45454 186.18182h46.54545v46.54545h-46.54545zM23.27273 186.18182h46.54545v46.54545H23.27273z"
        />
    </svg>
);
export default MistralAI;

```

`$ components/icons/deepseek.tsx`
```tsx
const DeepSeek = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{
            flex: "none",
            lineHeight: 1,
        }}
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        {...props}
    >
        <title>DeepSeek</title>
        <path
            fill="#4D6BFE"
            d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 0 1-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 0 0-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 0 1-.465.137 9.597 9.597 0 0 0-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 0 0 1.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 0 1 1.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 0 1 .415-.287.302.302 0 0 1 .2.288.306.306 0 0 1-.31.307.303.303 0 0 1-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 0 1-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 0 1 .016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 0 1-.254-.078.253.253 0 0 1-.114-.358c.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z"
        />
    </svg>
);
export default DeepSeek;

```


## Social Button (social-button)
Type: registry:component
Animated Social show-up
**Dependencies:** deps: lucide-react, motion; registry: button

`$ components/kokonutui/social-button.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Social Button
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Twitter, Instagram, Linkedin, Link } from "lucide-react";
import { motion } from "motion/react";

export default function SocialButton({
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const [isVisible, setIsVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const shareButtons = [
        { icon: Twitter, label: "Share on Twitter" },
        { icon: Instagram, label: "Share on Instagram" },
        { icon: Linkedin, label: "Share on LinkedIn" },
        { icon: Link, label: "Copy link" },
    ];

    const handleShare = (index: number) => {
        setActiveIndex(index);
        setTimeout(() => setActiveIndex(null), 300);
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            <motion.div
                animate={{
                    opacity: isVisible ? 0 : 1,
                }}
                transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                }}
            >
                <Button
                    className={cn(
                        "min-w-40 relative",
                        "bg-white dark:bg-black",
                        "hover:bg-gray-50 dark:hover:bg-gray-950",
                        "text-black dark:text-white",
                        "border border-black/10 dark:border-white/10",
                        "transition-colors duration-200",
                        className
                    )}
                    {...props}
                >
                    <span className="flex items-center gap-2">
                        <Link className="w-4 h-4" />
                        Hover me
                    </span>
                </Button>
            </motion.div>

            <motion.div
                className="absolute top-0 left-0 flex h-10 overflow-hidden"
                animate={{
                    width: isVisible ? "auto" : 0,
                }}
                transition={{
                    duration: 0.3,
                    ease: [0.23, 1, 0.32, 1],
                }}
            >
                {shareButtons.map((button, i) => (
                    <motion.button
                        type="button"
                        key={`share-${button.label}`}
                        aria-label={button.label}
                        onClick={() => handleShare(i)}
                        className={cn(
                            "h-10",
                            "w-10",
                            "flex items-center justify-center",
                            "bg-black dark:bg-white",
                            "text-white dark:text-black",
                            i === 0 && "rounded-l-md",
                            i === 3 && "rounded-r-md",
                            "border-r border-white/10 dark:border-black/10 last:border-r-0",
                            "hover:bg-gray-900 dark:hover:bg-gray-100",
                            "outline-none",
                            "relative overflow-hidden",
                            "transition-colors duration-200"
                        )}
                        animate={{
                            opacity: isVisible ? 1 : 0,
                            x: isVisible ? 0 : -20,
                        }}
                        transition={{
                            duration: 0.3,
                            ease: [0.23, 1, 0.32, 1],
                            delay: isVisible ? i * 0.05 : 0,
                        }}
                    >
                        <motion.div
                            className="relative z-10"
                            animate={{
                                scale: activeIndex === i ? 0.85 : 1,
                            }}
                            transition={{
                                duration: 0.2,
                                ease: "easeInOut",
                            }}
                        >
                            <button.icon className="w-4 h-4" />
                        </motion.div>
                        <motion.div
                            className="absolute inset-0 bg-white dark:bg-black"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: activeIndex === i ? 0.15 : 0,
                            }}
                            transition={{
                                duration: 0.2,
                                ease: "easeInOut",
                            }}
                        />
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
}

```


## Hold Button (hold-button)
Type: registry:component
Hold Button with different hold duration and colors.
**Dependencies:** deps: lucide-react, motion; registry: button

`$ components/kokonutui/hold-button.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Hold Button
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "motion/react";
import {
    Trash2Icon,
    XCircleIcon,
    AlertCircleIcon,
    ArchiveXIcon,
    BanIcon,
} from "lucide-react";
import { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const holdButtonVariants = cva("min-w-40 relative overflow-hidden touch-none", {
    variants: {
        variant: {
            red: [
                "bg-red-100 dark:bg-red-200",
                "hover:bg-red-100 dark:hover:bg-red-200",
                "text-red-500 dark:text-red-600",
                "border border-red-200 dark:border-red-300",
            ],
            green: [
                "bg-green-100 dark:bg-green-200",
                "hover:bg-green-100 dark:hover:bg-green-200",
                "text-green-500 dark:text-green-600",
                "border border-green-200 dark:border-green-300",
            ],
            blue: [
                "bg-blue-100 dark:bg-blue-200",
                "hover:bg-blue-100 dark:hover:bg-blue-200",
                "text-blue-500 dark:text-blue-600",
                "border border-blue-200 dark:border-blue-300",
            ],
            orange: [
                "bg-orange-100 dark:bg-orange-200",
                "hover:bg-orange-100 dark:hover:bg-orange-200",
                "text-orange-500 dark:text-orange-600",
                "border border-orange-200 dark:border-orange-300",
            ],
            grey: [
                "bg-gray-100 dark:bg-gray-200",
                "hover:bg-gray-100 dark:hover:bg-gray-200",
                "text-gray-500 dark:text-gray-600",
                "border border-gray-200 dark:border-gray-300",
            ],
        },
    },
    defaultVariants: {
        variant: "red",
    },
});

interface HoldButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof holdButtonVariants> {
    holdDuration?: number;
}

export default function HoldButton({
    className,
    variant = "red",
    holdDuration = 3000,
    ...props
}: HoldButtonProps) {
    const [isHolding, setIsHolding] = useState(false);
    const controls = useAnimation();

    async function handleHoldStart() {
        setIsHolding(true);
        controls.set({ width: "0%" });
        await controls.start({
            width: "100%",
            transition: {
                duration: holdDuration / 1000,
                ease: "linear",
            },
        });
    }

    function handleHoldEnd() {
        setIsHolding(false);
        controls.stop();
        controls.start({
            width: "0%",
            transition: { duration: 0.1 },
        });
    }

    return (
        <Button
            className={cn(holdButtonVariants({ variant, className }))}
            onMouseDown={handleHoldStart}
            onMouseUp={handleHoldEnd}
            onMouseLeave={handleHoldEnd}
            onTouchStart={handleHoldStart}
            onTouchEnd={handleHoldEnd}
            onTouchCancel={handleHoldEnd}
            {...props}
        >
            <motion.div
                initial={{ width: "0%" }}
                animate={controls}
                className={cn("absolute left-0 top-0 h-full", {
                    "bg-red-200/30 dark:bg-red-300/30": variant === "red",
                    "bg-green-200/30 dark:bg-green-300/30": variant === "green",
                    "bg-blue-200/30 dark:bg-blue-300/30": variant === "blue",
                    "bg-orange-200/30 dark:bg-orange-300/30":
                        variant === "orange",
                    "bg-gray-200/30 dark:bg-gray-300/30": variant === "grey",
                })}
            />
            <span className="relative z-10 w-full flex items-center justify-center gap-2">
                {(variant === "red" || !variant) && (
                    <Trash2Icon className="w-4 h-4" />
                )}
                {variant === "green" && <ArchiveXIcon className="w-4 h-4" />}
                {variant === "blue" && <XCircleIcon className="w-4 h-4" />}
                {variant === "orange" && (
                    <AlertCircleIcon className="w-4 h-4" />
                )}
                {variant === "grey" && <BanIcon className="w-4 h-4" />}
                {!isHolding ? "Hold me" : "Release"}
            </span>
        </Button>
    );
}

```


## Magnet Button (attract-button)
Type: registry:component
Attract particles button!
**Dependencies:** deps: lucide-react, motion; registry: button

`$ components/kokonutui/attract-button.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Attract Button
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { cn } from "@/lib/utils";
import { motion, useAnimation } from "motion/react";
import { Magnet } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface AttractButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    particleCount?: number;
    attractRadius?: number;
}

interface Particle {
    id: number;
    x: number;
    y: number;
}

export default function AttractButton({
    className,
    particleCount = 12,
    attractRadius = 50,
    ...props
}: AttractButtonProps) {
    const [isAttracting, setIsAttracting] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);
    const particlesControl = useAnimation();

    useEffect(() => {
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: Math.random() * 360 - 180,
            y: Math.random() * 360 - 180,
        }));
        setParticles(newParticles);
    }, [particleCount]);

    const handleInteractionStart = useCallback(async () => {
        setIsAttracting(true);
        await particlesControl.start({
            x: 0,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 50,
                damping: 10,
            },
        });
    }, [particlesControl]);

    const handleInteractionEnd = useCallback(async () => {
        setIsAttracting(false);
        await particlesControl.start((i) => ({
            x: particles[i].x,
            y: particles[i].y,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        }));
    }, [particlesControl, particles]);

    return (
        <Button
            className={cn(
                "min-w-40 relative touch-none",
                "bg-violet-100 dark:bg-violet-900",
                "hover:bg-violet-200 dark:hover:bg-violet-800",
                "text-violet-600 dark:text-violet-300",
                "border border-violet-300 dark:border-violet-700",
                "transition-all duration-300",
                className
            )}
            onMouseEnter={handleInteractionStart}
            onMouseLeave={handleInteractionEnd}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            {...props}
        >
            {particles.map((_, index) => (
                <motion.div
                    key={index}
                    custom={index}
                    initial={{ x: particles[index].x, y: particles[index].y }}
                    animate={particlesControl}
                    className={cn(
                        "absolute w-1.5 h-1.5 rounded-full",
                        "bg-violet-400 dark:bg-violet-300",
                        "transition-opacity duration-300",
                        isAttracting ? "opacity-100" : "opacity-40"
                    )}
                />
            ))}
            <span className="relative w-full flex items-center justify-center gap-2">
                <Magnet
                    className={cn(
                        "w-4 h-4 transition-transform duration-300",
                        isAttracting && "scale-110"
                    )}
                />
                {isAttracting ? "Attracting" : "Hover me"}
            </span>
        </Button>
    );
}

```


## Gradient Button (gradient-button)
Type: registry:component
That was so hard to make.
**Dependencies:** registry: button

`$ components/kokonutui/gradient-button.tsx`
```tsx
/**
 * @author: @dorian_baffier
 * @description: Gradient Button
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


type ColorVariant = "emerald" | "purple" | "orange";

interface GradientColors {
    dark: {
        border: string;
        overlay: string;
        accent: string;
        text: string;
        glow: string;
        textGlow: string;
        hover: string;
    };
    light: {
        border: string;
        base: string;
        overlay: string;
        accent: string;
        text: string;
        glow: string;
        hover: string;
    };
}

interface GradientButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: string;
    label?: string;
    className?: string;
    variant?: ColorVariant;
}

const gradientColors: Record<ColorVariant, GradientColors> = {
    emerald: {
        dark: {
            border: "from-[#336C4F] via-[#0C1F21] to-[#0D6437]",
            overlay: "from-[#347B52]/40 via-[#0C1F21] to-[#0D6437]/30",
            accent: "from-[#87F6B7]/10 via-[#0C1F21] to-[#17362A]/50",
            text: "from-[#8AEECA] to-[#73F8A8]",
            glow: "rgba(135,246,183,0.1)",
            textGlow: "rgba(135,246,183,0.4)",
            hover: "from-[#17362A]/20 via-[#87F6B7]/10 to-[#17362A]/20",
        },
        light: {
            border: "from-emerald-400 via-emerald-300 to-emerald-200",
            base: "from-emerald-50 via-emerald-50/80 to-emerald-50/90",
            overlay: "from-emerald-300/30 via-emerald-200/20 to-emerald-400/20",
            accent: "from-emerald-400/20 via-emerald-300/10 to-emerald-200/30",
            text: "from-emerald-700 to-emerald-600",
            glow: "rgba(52,211,153,0.2)",
            hover: "from-emerald-300/30 via-emerald-200/20 to-emerald-300/30",
        },
    },
    purple: {
        dark: {
            border: "from-[#6B46C1] via-[#0C1F21] to-[#553C9A]",
            overlay: "from-[#7E22CE]/40 via-[#0C1F21] to-[#6B46C1]/30",
            accent: "from-[#E9D8FD]/10 via-[#0C1F21] to-[#44337A]/50",
            text: "from-[#E9D8FD] to-[#D6BCFA]",
            glow: "rgba(159,122,234,0.1)",
            textGlow: "rgba(159,122,234,0.4)",
            hover: "from-[#44337A]/20 via-[#B794F4]/10 to-[#44337A]/20",
        },
        light: {
            border: "from-purple-400 via-purple-300 to-purple-200",
            base: "from-purple-50 via-purple-50/80 to-purple-50/90",
            overlay: "from-purple-300/30 via-purple-200/20 to-purple-400/20",
            accent: "from-purple-400/20 via-purple-300/10 to-purple-200/30",
            text: "from-purple-700 to-purple-600",
            glow: "rgba(159,122,234,0.2)",
            hover: "from-purple-300/30 via-purple-200/20 to-purple-300/30",
        },
    },
    orange: {
        dark: {
            border: "from-[#C05621] via-[#0C1F21] to-[#9C4221]",
            overlay: "from-[#DD6B20]/40 via-[#0C1F21] to-[#C05621]/30",
            accent: "from-[#FED7AA]/10 via-[#0C1F21] to-[#7B341E]/50",
            text: "from-[#FED7AA] to-[#FBD38D]",
            glow: "rgba(237,137,54,0.1)",
            textGlow: "rgba(237,137,54,0.4)",
            hover: "from-[#7B341E]/20 via-[#ED8936]/10 to-[#7B341E]/20",
        },
        light: {
            border: "from-orange-400 via-orange-300 to-orange-200",
            base: "from-orange-50 via-orange-50/80 to-orange-50/90",
            overlay: "from-orange-300/30 via-orange-200/20 to-orange-400/20",
            accent: "from-orange-400/20 via-orange-300/10 to-orange-200/30",
            text: "from-orange-700 to-orange-600",
            glow: "rgba(237,137,54,0.2)",
            hover: "from-orange-300/30 via-orange-200/20 to-orange-300/30",
        },
    },
};

export default function GradientButton({
    label = "Welcome",
    className,
    variant = "emerald",
    ...props
}: GradientButtonProps) {
    const colors = gradientColors[variant];

    return (
        <Button
            variant="ghost"
            className={cn(
                "group relative h-12 px-4 rounded-lg overflow-hidden transition-all duration-500",
                className
            )}
            {...props}
        >
            <div
                className={cn(
                    "absolute inset-0 rounded-lg p-[2px] bg-linear-to-b",
                    "dark:bg-none",
                    colors.light.border,
                    colors.dark.border
                )}
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-lg opacity-90",
                        "bg-white/80",
                        "dark:bg-[#0C1F21]"
                    )}
                />
            </div>

            <div
                className={cn(
                    "absolute inset-[2px] rounded-lg opacity-95",
                    "bg-white/80",
                    "dark:bg-[#0C1F21]"
                )}
            />

            <div
                className={cn(
                    "absolute inset-[2px] bg-linear-to-r rounded-lg opacity-90",
                    colors.light.base,
                    "dark:from-[#0C1F21] dark:via-[#0C1F21] dark:to-[#0C1F21]"
                )}
            />
            <div
                className={cn(
                    "absolute inset-[2px] bg-linear-to-b rounded-lg opacity-80",
                    colors.light.overlay,
                    colors.dark.overlay
                )}
            />
            <div
                className={cn(
                    "absolute inset-[2px] bg-linear-to-br rounded-lg",
                    colors.light.accent,
                    colors.dark.accent
                )}
            />

            <div
                className={cn(
                    "absolute inset-[2px] rounded-lg",
                    `shadow-[inset_0_0_10px_${colors.light.glow}]`,
                    `dark:shadow-[inset_0_0_10px_${colors.dark.glow}]`
                )}
            />

            <div className="relative flex items-center justify-center gap-2">
                <span
                    className={cn(
                        "text-lg font-light bg-linear-to-b bg-clip-text text-transparent tracking-tighter",
                        colors.light.text,
                        colors.dark.text,
                        `dark:drop-shadow-[0_0_12px_${colors.dark.textGlow}]`
                    )}
                >
                    {label}
                </span>
            </div>

            <div
                className={cn(
                    "absolute inset-[2px] opacity-0 transition-opacity duration-300 bg-linear-to-r group-hover:opacity-100 rounded-lg",
                    colors.light.hover,
                    colors.dark.hover
                )}
            />
        </Button>
    );
}

```


## V0 Button (v0-button)
Type: registry:component
Open in V0.
**Dependencies:** registry: button

`$ components/kokonutui/v0-button.tsx`
```tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


export default function V0Button({
    className,
}: React.ComponentProps<typeof Button>) {
    return (
        <Button
            aria-label="Open in v0"
            className={cn(
                "gap-1 rounded-lg shadow-none bg-black px-3 text-xs text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors duration-200 not-prose",
                className
            )}
            asChild
        >
            <a
                // TODO: Add the correct path
                // href={`https://v0.dev/chat/api/open?url=${prePath}/r/${name}.json`}
                href="https://v0.dev/community/minimalist-card-G74jCSN5LYl"
                target="_blank"
                rel="noreferrer"
            >
                Open in{" "}
                <svg
                    viewBox="0 0 40 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-current"
                >
                    <path
                        d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z"
                        fill="currentColor"
                    ></path>
                    <path
                        d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z"
                        fill="currentColor"
                    ></path>
                </svg>
            </a>
        </Button>
    );
}

```


## Toolbar (toolbar)
Type: registry:component
Multiples actions toolbar inspired by Figma.
**Dependencies:** deps: lucide-react, motion

`$ components/kokonutui/toolbar.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Toolbar
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
    Layers,
    SlidersHorizontal,
    FileDown,
    Share2,
    Bell,
    CircleUserRound,
    Palette,
    MousePointer2,
    Move,
    Shapes,
    Frame,
    type LucideIcon,
    Edit2,
    Lock,
} from "lucide-react";

interface ToolbarItem {
    id: string;
    title: string;
    icon: LucideIcon;
    type?: never;
}

interface ToolbarProps {
    className?: string;
    activeColor?: string;
    onSearch?: (value: string) => void;
}

const buttonVariants = {
    initial: {
        gap: 0,
        paddingLeft: ".5rem",
        paddingRight: ".5rem",
    },
    animate: (isSelected: boolean) => ({
        gap: isSelected ? ".5rem" : 0,
        paddingLeft: isSelected ? "1rem" : ".5rem",
        paddingRight: isSelected ? "1rem" : ".5rem",
    }),
};

const spanVariants = {
    initial: { width: 0, opacity: 0 },
    animate: { width: "auto", opacity: 1 },
    exit: { width: 0, opacity: 0 },
};

const notificationVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: -10 },
    exit: { opacity: 0, y: -20 },
};

const lineVariants = {
    initial: { scaleX: 0, x: "-50%" },
    animate: {
        scaleX: 1,
        x: "0%",
        transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
        scaleX: 0,
        x: "50%",
        transition: { duration: 0.2, ease: "easeIn" },
    },
};

const transition = { type: "spring", bounce: 0, duration: 0.4 };

export function Toolbar({
    className,
    activeColor = "text-primary",
    onSearch,
}: ToolbarProps) {
    const [selected, setSelected] = React.useState<string | null>("select");
    const [isToggled, setIsToggled] = React.useState(false);
    const [activeNotification, setActiveNotification] = React.useState<
        string | null
    >(null);
    const outsideClickRef = React.useRef(null);

    const toolbarItems: ToolbarItem[] = [
        { id: "select", title: "Select", icon: MousePointer2 },
        { id: "move", title: "Move", icon: Move },
        { id: "shapes", title: "Shapes", icon: Shapes },
        { id: "layers", title: "Layers", icon: Layers },
        { id: "frame", title: "Frame", icon: Frame },
        { id: "properties", title: "Properties", icon: SlidersHorizontal },
        { id: "export", title: "Export", icon: FileDown },
        { id: "share", title: "Share", icon: Share2 },
        { id: "notifications", title: "Notifications", icon: Bell },
        { id: "profile", title: "Profile", icon: CircleUserRound },
        { id: "appearance", title: "Appearance", icon: Palette },
    ];

    const handleItemClick = (itemId: string) => {
        setSelected(selected === itemId ? null : itemId);
        setActiveNotification(itemId);
        setTimeout(() => setActiveNotification(null), 1500);
    };

    return (
        <div className="space-y-2">
            <div
                ref={outsideClickRef}
                className={cn(
                    "flex items-center gap-3 p-2 relative",
                    "bg-background",
                    "border rounded-xl",
                    "transition-all duration-200",
                    className
                )}
            >
                <AnimatePresence>
                    {activeNotification && (
                        <motion.div
                            variants={notificationVariants as any}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-50"
                        >
                            <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs">
                                {
                                    toolbarItems.find(
                                        (item) => item.id === activeNotification
                                    )?.title
                                }{" "}
                                clicked!
                            </div>
                            <motion.div
                                variants={lineVariants as any}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="absolute -bottom-1 left-1/2 w-full h-[2px] bg-primary origin-left"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center gap-2">
                    {toolbarItems.map((item) => (
                        <motion.button
                            key={item.id}
                            variants={buttonVariants as any}
                            initial={false}
                            animate="animate"
                            custom={selected === item.id}
                            onClick={() => handleItemClick(item.id)}
                            transition={transition as any}
                            className={cn(
                                "relative flex items-center rounded-none px-3 py-2",
                                "text-sm font-medium transition-colors duration-300",
                                selected === item.id
                                    ? "bg-[#1F9CFE] text-white rounded-lg"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon
                                size={16}
                                className={cn(
                                    selected === item.id && "text-white"
                                )}
                            />
                            <AnimatePresence initial={false}>
                                {selected === item.id && (
                                    <motion.span
                                        variants={spanVariants as any}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        transition={transition as any}
                                        className="overflow-hidden"
                                    >
                                        {item.title}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    ))}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsToggled(!isToggled)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2",
                            "rounded-xl border shadow-sm transition-all duration-200",
                            "hover:shadow-md active:border-primary/50",
                            isToggled
                                ? [
                                      "bg-[#1F9CFE] text-white",
                                      "border-[#1F9CFE]/30",
                                      "hover:bg-[#1F9CFE]/90",
                                      "hover:border-[#1F9CFE]/40",
                                  ]
                                : [
                                      "bg-background text-muted-foreground",
                                      "border-border/30",
                                      "hover:bg-muted",
                                      "hover:text-foreground",
                                      "hover:border-border/40",
                                  ]
                        )}
                    >
                        {isToggled ? (
                            <Edit2 className="w-3.5 h-3.5" />
                        ) : (
                            <Lock className="w-3.5 h-3.5" />
                        )}
                        <span className="text-sm font-medium">
                            {isToggled ? "On" : "Off"}
                        </span>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

export default Toolbar;

```


## AI State Loading (ai-loading)
Type: registry:component
Code loading pending.
**Dependencies:** deps: motion

`$ components/kokonutui/ai-loading.tsx`
```tsx
"use client";

/**
 * @author: @kokonutui
 * @description: AI Loading State
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { useEffect, useState, useRef } from "react";

const TASK_SEQUENCES = [
    {
        status: "Searching the web",
        lines: [
            "Initializing web search...",
            "Scanning web pages...",
            "Visiting 5 websites...",
            "Analyzing content...",
            "Generating summary...",
        ],
    },
    {
        status: "Analyzing results",
        lines: [
            "Analyzing search results...",
            "Generating summary...",
            "Checking for relevant information...",
            "Finalizing analysis...",
            "Setting up lazy loading...",
            "Configuring caching strategies...",
            "Running performance tests...",
            "Finalizing optimizations...",
        ],
    },
    {
        status: "Enhancing UI/UX",
        lines: [
            "Initializing UI enhancement scan...",
            "Checking accessibility compliance...",
            "Analyzing component animations...",
            "Reviewing loading states...",
            "Testing responsive layouts...",
            "Optimizing user interactions...",
            "Validating color contrast...",
            "Checking motion preferences...",
            "Finalizing UI improvements...",
        ],
    },
];

const LoadingAnimation = ({ progress }: { progress: number }) => (
    <div className="relative w-6 h-6">
        <svg
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            aria-label={`Loading progress: ${Math.round(progress)}%`}
        >
            <title>Loading Progress Indicator</title>

            <defs>
                <mask id="progress-mask">
                    <rect width="240" height="240" fill="black" />
                    <circle
                        r="120"
                        cx="120"
                        cy="120"
                        fill="white"
                        strokeDasharray={`${(progress / 100) * 754}, 754`}
                        transform="rotate(-90 120 120)"
                    />
                </mask>
            </defs>

            <style>
                {`
                    @keyframes rotate-cw {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes rotate-ccw {
                        from { transform: rotate(360deg); }
                        to { transform: rotate(0deg); }
                    }
                    .g-spin circle {
                        transform-origin: 120px 120px;
                    }
                    .g-spin circle:nth-child(1) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(2) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(3) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(4) { animation: rotate-ccw 8s linear infinite; }
                    .g-spin circle:nth-child(5) { animation: rotate-cw 8s linear infinite; }
                    .g-spin circle:nth-child(6) { animation: rotate-ccw 8s linear infinite; }

                    .g-spin circle:nth-child(2n) { animation-delay: 0.2s; }
                    .g-spin circle:nth-child(3n) { animation-delay: 0.3s; }
                `}
            </style>

            <g
                className="g-spin"
                strokeWidth="16"
                strokeDasharray="18% 40%"
                mask="url(#progress-mask)"
            >
                <circle
                    r="150"
                    cx="120"
                    cy="120"
                    stroke="#FF2E7E"
                    opacity="0.95"
                />
                <circle
                    r="130"
                    cx="120"
                    cy="120"
                    stroke="#00E5FF"
                    opacity="0.95"
                />
                <circle
                    r="110"
                    cx="120"
                    cy="120"
                    stroke="#4ADE80"
                    opacity="0.95"
                />
                <circle
                    r="90"
                    cx="120"
                    cy="120"
                    stroke="#FFA726"
                    opacity="0.95"
                />
                <circle
                    r="70"
                    cx="120"
                    cy="120"
                    stroke="#FFEB3B"
                    opacity="0.95"
                />
                <circle
                    r="50"
                    cx="120"
                    cy="120"
                    stroke="#FF4081"
                    opacity="0.95"
                />
            </g>
        </svg>
    </div>
);

export default function AILoadingState() {
    const [sequenceIndex, setSequenceIndex] = useState(0);
    const [visibleLines, setVisibleLines] = useState<
        Array<{ text: string; number: number }>
    >([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const codeContainerRef = useRef<HTMLDivElement>(null);
    const lineHeight = 28;

    const currentSequence = TASK_SEQUENCES[sequenceIndex];
    const totalLines = currentSequence.lines.length;

    useEffect(() => {
        const initialLines = [];
        for (let i = 0; i < Math.min(5, totalLines); i++) {
            initialLines.push({
                text: currentSequence.lines[i],
                number: i + 1,
            });
        }
        setVisibleLines(initialLines);
        setScrollPosition(0);
    }, [sequenceIndex, currentSequence.lines, totalLines]);

    // Handle line advancement
    useEffect(() => {
        const advanceTimer = setInterval(() => {
            // Get the current first visible line index
            const firstVisibleLineIndex = Math.floor(
                scrollPosition / lineHeight
            );
            const nextLineIndex = (firstVisibleLineIndex + 3) % totalLines;

            // If we're about to wrap around, move to next sequence
            if (nextLineIndex < firstVisibleLineIndex && nextLineIndex !== 0) {
                setSequenceIndex(
                    (prevIndex) => (prevIndex + 1) % TASK_SEQUENCES.length
                );
                return;
            }

            // Add the next line if needed
            if (
                nextLineIndex >= visibleLines.length &&
                nextLineIndex < totalLines
            ) {
                setVisibleLines((prevLines) => [
                    ...prevLines,
                    {
                        text: currentSequence.lines[nextLineIndex],
                        number: nextLineIndex + 1,
                    },
                ]);
            }

            // Scroll to the next line
            setScrollPosition((prevPosition) => prevPosition + lineHeight);
        }, 2000); // Slightly slower than the example for better readability

        return () => clearInterval(advanceTimer);
    }, [
        scrollPosition,
        visibleLines,
        totalLines,
        sequenceIndex,
        currentSequence.lines,
        lineHeight,
    ]);

    // Apply scroll position
    useEffect(() => {
        if (codeContainerRef.current) {
            codeContainerRef.current.scrollTop = scrollPosition;
        }
    }, [scrollPosition]);

    return (
        <div className="flex items-center justify-center min-h-full w-full">
            <div className="space-y-4 w-auto">
                <div className="ml-2 flex items-center space-x-2 text-gray-600 dark:text-gray-300 font-medium">
                    <LoadingAnimation
                        progress={(sequenceIndex / TASK_SEQUENCES.length) * 100}
                    />
                    <span className="text-sm">{currentSequence.status}...</span>
                </div>

                <div className="relative">
                    <div
                        ref={codeContainerRef}
                        className="font-mono text-xs overflow-hidden w-full h-[84px] relative rounded-lg"
                        style={{ scrollBehavior: "smooth" }}
                    >
                        <div>
                            {visibleLines.map((line, index) => (
                                <div
                                    key={`${line.number}-${line.text}`}
                                    className="flex h-[28px] items-center px-2"
                                >
                                    <div className="text-gray-400 dark:text-gray-500 pr-3 select-none w-6 text-right">
                                        {line.number}
                                    </div>

                                    <div className="text-gray-800 dark:text-gray-200 flex-1 ml-1">
                                        {line.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none rounded-lg from-white/90 via-white/50 to-transparent dark:from-black/90 dark:via-black/50 dark:to-transparent"
                        style={{
                            background:
                                "linear-gradient(to bottom, var(--tw-gradient-from) 0%, var(--tw-gradient-via) 30%, var(--tw-gradient-to) 100%)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

```


## Stack (card-stack)
Type: registry:component
Stack of cards that expend onclick.
**Dependencies:** deps: motion

`$ components/kokonutui/card-stack.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Card Stack
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Specification {
    label: string;
    value: string;
}

interface Product {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    specs: Specification[];
}

// Dummy Products Data
const products: Product[] = [
    {
        id: "instant-pay",
        title: "Quick Pay",
        subtitle: "Instant Transfers",
        image: "/undraw.svg",
        specs: [
            { label: "Speed", value: "Instant" },
            { label: "Security", value: "256-bit" },
            { label: "Limit", value: "$50,000" },
            { label: "Fee", value: "0.5%" },
        ],
    },
    {
        id: "crypto-pay",
        title: "Crypto Pay",
        subtitle: "Web3 Payments",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
        specs: [
            { label: "Network", value: "Multi-chain" },
            { label: "Gas", value: "Optimized" },
            { label: "Support", value: "24/7" },
            { label: "Security", value: "Top-tier" },
        ],
    },
    {
        id: "business-pay",
        title: "Business Pay",
        subtitle: "Enterprise Solutions",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
        specs: [
            { label: "Volume", value: "Unlimited" },
            { label: "API", value: "REST/SDK" },
            { label: "Support", value: "Premium" },
            { label: "Features", value: "Custom" },
        ],
    },
    {
        id: "global-pay",
        title: "Global Pay",
        subtitle: "International Transfers",
        image: "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&auto=format&fit=crop&q=80",
        specs: [
            { label: "Countries", value: "180+" },
            { label: "FX Rate", value: "Real-time" },
            { label: "Speed", value: "Same-day" },
            { label: "Support", value: "Local" },
        ],
    },
];

interface CardProps {
    product: Product;
    index: number;
    totalCards: number;
    isExpanded: boolean;
}

const Card = ({ product, index, totalCards, isExpanded }: CardProps) => {
    // Calculate center offset based on total cards
    const centerOffset = (totalCards - 1) * 5;

    // Initial stacked position - centered with slight overlap
    const defaultX = index * 10 - centerOffset;
    const defaultY = index * 2;
    const defaultRotate = index * 1.5;
    const defaultScale = 1;

    // Calculate the total width of expanded cards and center offset
    const cardWidth = 320; // Width of each card
    const cardOverlap = 240; // Amount of overlap between cards
    const totalExpandedWidth =
        cardWidth + (totalCards - 1) * (cardWidth - cardOverlap); // Total width including overlap
    const expandedCenterOffset = totalExpandedWidth / 2;

    // Fanned out position - centered spread with overlap
    const spreadX =
        index * (cardWidth - cardOverlap) -
        expandedCenterOffset +
        cardWidth / 2;
    const spreadY = 0;
    const spreadRotate = index * 5 - (totalCards - 1) * 2.5; // Increased rotation for better visual effect
    const spreadScale = 1;

    return (
        <motion.div
            initial={{
                x: defaultX,
                y: defaultY,
                rotate: defaultRotate,
                scale: defaultScale,
            }}
            animate={{
                x: isExpanded ? spreadX : defaultX,
                y: isExpanded ? spreadY : defaultY,
                rotate: isExpanded ? spreadRotate : defaultRotate,
                scale: isExpanded ? spreadScale : defaultScale,
                zIndex: totalCards - index,
            }}
            transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
                mass: 0.8,
                restDelta: 0.001,
                restSpeed: 0.001,
            }}
            className={cn(
                "absolute inset-0 rounded-2xl p-6 w-full",
                "bg-gradient-to-br from-white/40 via-neutral-50/30 to-neutral-100/20",
                "dark:from-neutral-800/40 dark:via-neutral-900/30 dark:to-black/20",
                "border border-white/20 dark:border-neutral-800/20",
                "before:absolute before:inset-0 before:rounded-2xl",
                "before:bg-gradient-to-b before:from-white/20 before:via-neutral-100/10 before:to-transparent",
                "dark:before:from-white/5 dark:before:via-neutral-500/5 dark:before:to-transparent",
                "before:opacity-100 before:transition-opacity before:duration-500",
                "after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-br",
                "after:from-white/80 after:to-neutral-100/70 dark:after:from-neutral-900/80 dark:after:to-black/70",
                "after:z-[-1] after:blur-xl",
                "backdrop-blur-xl backdrop-saturate-150",
                "shadow-[0_8px_20px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)]",
                "hover:border-white/30 dark:hover:border-neutral-700/30",
                "hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.4)]",
                "hover:backdrop-blur-2xl",
                "hover:bg-gradient-to-br hover:from-white/50 hover:via-neutral-50/40 hover:to-neutral-100/30",
                "dark:hover:from-neutral-800/50 dark:hover:via-neutral-900/40 dark:hover:to-black/30",
                "transition-all duration-500 ease-out",
                "transform-gpu overflow-hidden"
            )}
            style={{
                maxWidth: "320px",
                transformStyle: "preserve-3d",
                perspective: "2000px",
                left: "50%",
                marginLeft: "-160px",
                transform: isExpanded
                    ? ""
                    : `
                        translateY(${index * 10}px)
                        translateX(${index * 1}px)
                        rotate(${index * 3}deg)
                        scale(${1 - index * 0.02})
                    `,
                zIndex: products.length - index,
            }}
        >
            {/* Inner Card */}
            <div className="absolute inset-1 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50" />

            <div className="relative z-10">
                {/* Specs Grid moved to top */}
                <dl className="mb-4 grid grid-cols-4 gap-2 justify-center">
                    {product.specs.map((spec) => (
                        <div
                            key={spec.label}
                            className="text-[10px] backdrop-blur-sm flex flex-col items-start text-left"
                        >
                            <dd className="font-medium text-gray-500 dark:text-gray-400 w-full text-left">
                                {spec.value}
                            </dd>
                            <dt className="text-gray-900 dark:text-gray-100 mb-0.5 w-full text-left">
                                {spec.label}
                            </dt>
                        </div>
                    ))}
                </dl>

                <div
                    className={cn(
                        "aspect-[16/11] w-full overflow-hidden rounded-lg",
                        "bg-neutral-100 dark:bg-neutral-900",
                        "transition-transform duration-300 ease-out",
                        "group-hover:scale-[1.02]",
                        "border border-neutral-200/50 dark:border-neutral-700/50",
                        "shadow-inner"
                    )}
                >
                    <img
                        src={product.image}
                        alt={product.title}
                        className="object-cover w-full h-full"
                        loading="lazy"
                    />
                </div>

                <div className="mt-4">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-left">
                            {product.title}
                        </h2>
                        <span className="block text-3xl font-semibold tracking-tight bg-gradient-to-r from-gray-400 via-gray-300 to-gray-500 dark:from-gray-200 dark:via-white dark:to-gray-300 bg-clip-text text-transparent text-left">
                            {product.subtitle}
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-left">
                        Experience the iconic design that revolutionized
                        technology
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

interface CardStackProps {
    className?: string;
}

export default function CardStackExample({ className }: CardStackProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => setIsExpanded(!isExpanded);

    return (
        <button
            className={cn(
                "relative mx-auto cursor-pointer",
                "min-h-[440px] w-full max-w-[90vw]",
                "md:max-w-[1200px]",
                "appearance-none bg-transparent border-0 p-0",
                "flex items-center justify-center mb-8",
                className
            )}
            onClick={handleToggle}
            aria-label="Toggle card stack"
            type="button"
        >
            {products.map((product, index) => (
                <Card
                    key={product.id}
                    product={product}
                    index={index}
                    totalCards={products.length}
                    isExpanded={isExpanded}
                />
            ))}
        </button>
    );
}

```


## Avatar Picker (avatar-picker)
Type: registry:component
Avatar picker with rotation animation.
**Dependencies:** deps: lucide-react, motion; registry: card, button, input

`$ components/kokonutui/avatar-picker.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Avatar Picker
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Crown, ChevronRight, User2 } from "lucide-react";

interface Avatar {
    id: number;
    svg: React.ReactNode;
    alt: string;
}

const avatars: Avatar[] = [
    {
        id: 1,
        svg: (
            <svg
                viewBox="0 0 36 36"
                fill="none"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                aria-label="Avatar 1"
            >
                <title>Avatar 1</title>
                <mask
                    id=":r111:"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="36"
                    height="36"
                >
                    <rect width="36" height="36" rx="72" fill="#FFFFFF" />
                </mask>
                <g mask="url(#:r111:)">
                    <rect width="36" height="36" fill="#ff005b" />
                    <rect
                        x="0"
                        y="0"
                        width="36"
                        height="36"
                        transform="translate(9 -5) rotate(219 18 18) scale(1)"
                        fill="#ffb238"
                        rx="6"
                    />
                    <g transform="translate(4.5 -4) rotate(9 18 18)">
                        <path
                            d="M15 19c2 1 4 1 6 0"
                            stroke="#000000"
                            fill="none"
                            strokeLinecap="round"
                        />
                        <rect
                            x="10"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#000000"
                        />
                        <rect
                            x="24"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#000000"
                        />
                    </g>
                </g>
            </svg>
        ),
        alt: "Avatar 1",
    },
    {
        id: 2,
        svg: (
            <svg
                viewBox="0 0 36 36"
                fill="none"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                aria-label="Avatar 4"
            >
                <title>Avatar 4</title>
                <mask
                    id=":R4mrttb:"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="36"
                    height="36"
                >
                    <rect width="36" height="36" rx="72" fill="#FFFFFF" />
                </mask>
                <g mask="url(#:R4mrttb:)">
                    <rect width="36" height="36" fill="#ff7d10" />
                    <rect
                        x="0"
                        y="0"
                        width="36"
                        height="36"
                        transform="translate(5 -1) rotate(55 18 18) scale(1.1)"
                        fill="#0a0310"
                        rx="6"
                    />
                    <g transform="translate(7 -6) rotate(-5 18 18)">
                        <path
                            d="M15 20c2 1 4 1 6 0"
                            stroke="#FFFFFF"
                            fill="none"
                            strokeLinecap="round"
                        />
                        <rect
                            x="14"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#FFFFFF"
                        />
                        <rect
                            x="20"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#FFFFFF"
                        />
                    </g>
                </g>
            </svg>
        ),
        alt: "Avatar 4",
    },
    {
        id: 3,
        svg: (
            <svg
                viewBox="0 0 36 36"
                fill="none"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                aria-label="Avatar 2"
            >
                <title>Avatar 2</title>
                <mask
                    id=":r11c:"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="36"
                    height="36"
                >
                    <rect width="36" height="36" rx="72" fill="#FFFFFF" />
                </mask>
                <g mask="url(#:r11c:)">
                    <rect width="36" height="36" fill="#0a0310" />
                    <rect
                        x="0"
                        y="0"
                        width="36"
                        height="36"
                        transform="translate(-3 7) rotate(227 18 18) scale(1.2)"
                        fill="#ff005b"
                        rx="36"
                    />
                    <g transform="translate(-3 3.5) rotate(7 18 18)">
                        <path d="M13,21 a1,0.75 0 0,0 10,0" fill="#FFFFFF" />
                        <rect
                            x="12"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#FFFFFF"
                        />
                        <rect
                            x="22"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#FFFFFF"
                        />
                    </g>
                </g>
            </svg>
        ),
        alt: "Avatar 2",
    },
    {
        id: 4,
        svg: (
            <svg
                viewBox="0 0 36 36"
                fill="none"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                aria-label="Avatar 3"
            >
                <title>Avatar 3</title>
                <mask
                    id=":r1gg:"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="36"
                    height="36"
                >
                    <rect width="36" height="36" rx="72" fill="#FFFFFF" />
                </mask>
                <g mask="url(#:r1gg:)">
                    <rect width="36" height="36" fill="#d8fcb3" />
                    <rect
                        x="0"
                        y="0"
                        width="36"
                        height="36"
                        transform="translate(9 -5) rotate(219 18 18) scale(1)"
                        fill="#89fcb3"
                        rx="6"
                    />
                    <g transform="translate(4.5 -4) rotate(9 18 18)">
                        <path
                            d="M15 19c2 1 4 1 6 0"
                            stroke="#000000"
                            fill="none"
                            strokeLinecap="round"
                        />
                        <rect
                            x="10"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#000000"
                        />
                        <rect
                            x="24"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#000000"
                        />
                    </g>
                </g>
            </svg>
        ),
        alt: "Avatar 3",
    },
];

interface ProfileSetupProps {
    onComplete?: (data: { username: string; avatarId: number }) => void;
    className?: string;
}

const mainAvatarVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: {
        scale: 1,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: {
        scale: 0.9,
        opacity: 0,
        transition: { duration: 0.2 },
    },
};

const pickerVariants = {
    container: {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.1 },
        },
    },
    item: {
        initial: { scale: 0.8, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 400, damping: 25 },
        },
    },
};

const DetailRing = () => (
    <div className="absolute inset-0 rounded-full">
        <svg
            className="absolute inset-0 w-full h-full animate-[spin_30s_linear_infinite]"
            viewBox="0 0 100 100"
            aria-label="Decorative outer ring animation"
        >
            <title>Decorative outer spinning ring</title>
            <defs>
                <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                >
                    <stop
                        offset="0%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity="0.3"
                    />
                    <stop
                        offset="50%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity="0.1"
                    />
                    <stop
                        offset="100%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity="0.3"
                    />
                </linearGradient>
            </defs>
            <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="0.5"
                strokeDasharray="1,3"
            />
        </svg>
        <svg
            className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite_reverse]"
            viewBox="0 0 100 100"
            aria-label="Decorative inner ring animation"
        >
            <title>Decorative inner spinning ring</title>
            <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="0.25"
                strokeDasharray="1,2"
            />
        </svg>
    </div>
);

export default function ProfileSetup({
    onComplete,
    className,
}: ProfileSetupProps) {
    const [selectedAvatar, setSelectedAvatar] = useState<Avatar>(avatars[0]);
    const [username, setUsername] = useState("");
    const [rotationCount, setRotationCount] = useState(0);
    const [isHovering, setIsHovering] = useState<number | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    const handleAvatarSelect = (avatar: Avatar) => {
        if (avatar.id === selectedAvatar.id) return;
        setRotationCount((prev) => prev + 720);
        setSelectedAvatar(avatar);
    };

    const handleSubmit = () => {
        if (username.trim() && onComplete) {
            onComplete({
                username: username.trim(),
                avatarId: selectedAvatar.id,
            });
        }
    };

    const isValid = username.trim().length >= 3;
    const showError = username.trim().length > 0 && username.trim().length < 3;

    return (
        <Card
            className={cn(
                "relative w-full max-w-[400px] mx-auto overflow-hidden bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-sm border-primary/10",
                className
            )}
        >
            <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <CardContent className="p-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold bg-gradient-to-br from-primary/90 to-primary/60 bg-clip-text text-transparent">
                            Create Your Profile
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Choose an avatar and enter your username to begin
                        </p>
                    </div>

                    {/* Avatar Section */}
                    <div className="relative flex flex-col items-center">
                        {/* Main Avatar */}
                        <motion.div
                            className="relative w-28 h-28"
                            variants={mainAvatarVariants as any}
                            initial="initial"
                            animate="animate"
                        >
                            <DetailRing />

                            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-primary/10 to-transparent blur-md opacity-50" />

                            <div className="relative w-full h-full rounded-full overflow-hidden border border-primary/20 bg-gradient-to-b from-background/80 to-background shadow-lg shadow-primary/5">
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center"
                                    animate={{ rotate: rotationCount }}
                                    transition={{
                                        duration: 0.7,
                                        ease: [0.4, 0, 0.2, 1],
                                    }}
                                >
                                    <div className="transform scale-[2.8]">
                                        {selectedAvatar.svg}
                                    </div>
                                </motion.div>
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20" />
                            </div>

                            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center">
                                <Crown className="w-4 h-4 text-primary" />
                            </div>
                        </motion.div>

                        {/* Avatar Grid */}
                        <motion.div
                            className="grid grid-cols-4 gap-3 mt-6 w-full max-w-[240px]"
                            variants={pickerVariants.container}
                            initial="initial"
                            animate="animate"
                        >
                            {avatars.map((avatar) => (
                                <motion.button
                                    key={avatar.id}
                                    onClick={() => handleAvatarSelect(avatar)}
                                    onMouseEnter={() =>
                                        setIsHovering(avatar.id)
                                    }
                                    onMouseLeave={() => setIsHovering(null)}
                                    className={cn(
                                        "relative w-12 h-12 rounded-full group/avatar",
                                        "transition-all duration-300",
                                        selectedAvatar.id === avatar.id
                                            ? "ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
                                            : "hover:ring-2 hover:ring-primary/20 hover:ring-offset-2 hover:ring-offset-background"
                                    )}
                                    variants={pickerVariants.item as any}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label={`Select ${avatar.alt}`}
                                    aria-pressed={
                                        selectedAvatar.id === avatar.id
                                    }
                                >
                                    <AnimatePresence>
                                        {isHovering === avatar.id && (
                                            <motion.div
                                                className="absolute inset-0 rounded-full bg-primary/10"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            />
                                        )}
                                    </AnimatePresence>

                                    <div className="relative w-full h-full rounded-full overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="transform scale-[2.2]">
                                                {avatar.svg}
                                            </div>
                                        </div>
                                    </div>

                                    {selectedAvatar.id === avatar.id && (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center">
                                            <Check className="w-3 h-3 text-primary" />
                                        </div>
                                    )}
                                </motion.button>
                            ))}
                        </motion.div>
                    </div>

                    {/* Username Input */}
                    <div className="space-y-6">
                        <div className="relative">
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    className={cn(
                                        "pl-10 h-12 text-base transition-all duration-200",
                                        isFocused && "ring-2 ring-primary/20",
                                        showError &&
                                            "ring-2 ring-destructive/50 focus-visible:ring-destructive"
                                    )}
                                    maxLength={20}
                                />
                                <User2
                                    className={cn(
                                        "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200",
                                        isFocused
                                            ? "text-primary"
                                            : "text-muted-foreground"
                                    )}
                                />
                            </div>
                            <AnimatePresence>
                                {showError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute text-xs text-destructive mt-2 ml-1"
                                    >
                                        Username must be at least 3 characters
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        <Button
                            className="w-full relative group h-12 text-base"
                            onClick={handleSubmit}
                            disabled={!isValid}
                        >
                            <span className="relative z-10">
                                Start Adventure
                            </span>
                            <ChevronRight className="relative z-10 w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

```


## Typing Text (type-writer)
Type: registry:component
Animated TypeWritter with multiples options.
**Dependencies:** deps: motion

`$ components/kokonutui/type-writer.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Typewriter
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type TypewriterSequence = {
  text: string;
  deleteAfter?: boolean;
  pauseAfter?: number;
};

type TypewriterTitleProps = {
  sequences?: TypewriterSequence[];
  typingSpeed?: number;
  startDelay?: number;
  autoLoop?: boolean;
  loopDelay?: number;
  deleteSpeed?: number;
  pauseBeforeDelete?: number;
  naturalVariance?: boolean;
};

const DEFAULT_SEQUENCES: TypewriterSequence[] = [
  { text: "Typewriter", deleteAfter: true },
  { text: "Multiple Words", deleteAfter: true },
  { text: "Auto Loop", deleteAfter: false },
];

export default function TypewriterTitle({
  sequences = DEFAULT_SEQUENCES,
  typingSpeed = 50,
  startDelay = 200,
  autoLoop = true,
  loopDelay = 1000,
  deleteSpeed = 30,
  pauseBeforeDelete = 1000,
  naturalVariance = true,
}: TypewriterTitleProps) {
  const [displayText, setDisplayText] = useState("");
  const sequenceIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const isDeletingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize with the sequences provided
  const sequencesRef = useRef(sequences);
  useEffect(() => {
    sequencesRef.current = sequences;
  }, [sequences]);

  useEffect(() => {
    const getTypingDelay = () => {
      if (!naturalVariance) {
        return typingSpeed;
      }

      // More natural human typing pattern
      const random = Math.random();

      // 10% chance of a longer pause (thinking/hesitation)
      if (random < 0.1) {
        return typingSpeed * 2;
      }

      // 10% chance of a burst (fast typing)
      if (random > 0.9) {
        return typingSpeed * 0.5;
      }

      // Standard variance (+/- 40%)
      const variance = 0.4;
      const min = typingSpeed * (1 - variance);
      const max = typingSpeed * (1 + variance);
      return Math.random() * (max - min) + min;
    };

    const runTypewriter = () => {
      const currentSequence = sequencesRef.current[sequenceIndexRef.current];
      if (!currentSequence) {
        return;
      }

      if (isDeletingRef.current) {
        if (charIndexRef.current > 0) {
          charIndexRef.current -= 1;
          setDisplayText(currentSequence.text.slice(0, charIndexRef.current));
          timeoutRef.current = setTimeout(runTypewriter, deleteSpeed);
        } else {
          isDeletingRef.current = false;
          const isLastSequence =
            sequenceIndexRef.current === sequencesRef.current.length - 1;

          if (isLastSequence && autoLoop) {
            timeoutRef.current = setTimeout(() => {
              sequenceIndexRef.current = 0;
              runTypewriter();
            }, loopDelay);
          } else if (!isLastSequence) {
            timeoutRef.current = setTimeout(() => {
              sequenceIndexRef.current += 1;
              runTypewriter();
            }, 100); // Quick transition to next word
          }
        }
      } else if (charIndexRef.current < currentSequence.text.length) {
        charIndexRef.current += 1;
        setDisplayText(currentSequence.text.slice(0, charIndexRef.current));
        timeoutRef.current = setTimeout(runTypewriter, getTypingDelay());
      } else {
        const pauseDuration = currentSequence.pauseAfter ?? pauseBeforeDelete;

        if (currentSequence.deleteAfter) {
          timeoutRef.current = setTimeout(() => {
            isDeletingRef.current = true;
            runTypewriter();
          }, pauseDuration);
        } else {
          const isLastSequence =
            sequenceIndexRef.current === sequencesRef.current.length - 1;

          if (isLastSequence && autoLoop) {
            timeoutRef.current = setTimeout(() => {
              sequenceIndexRef.current = 0;
              charIndexRef.current = 0;
              setDisplayText("");
              runTypewriter();
            }, loopDelay);
          } else if (!isLastSequence) {
            timeoutRef.current = setTimeout(() => {
              sequenceIndexRef.current += 1;
              charIndexRef.current = 0;
              setDisplayText("");
              runTypewriter();
            }, pauseDuration);
          }
        }
      }
    };

    // Start the loop
    timeoutRef.current = setTimeout(runTypewriter, startDelay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    // Only restart effect if timing configs change.
    // We use sequencesRef for content to avoid restarting on array reference change.
    typingSpeed,
    deleteSpeed,
    pauseBeforeDelete,
    autoLoop,
    loopDelay,
    startDelay,
    naturalVariance,
  ]);

  return (
    <div className="relative mx-auto w-full max-w-4xl py-24">
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <motion.div
          animate={{ opacity: 1 }}
          className="flex items-center gap-1 font-mono text-4xl text-black tracking-tight md:text-6xl dark:text-white"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block min-h-[1.2em] min-w-[0.5em]">
            {displayText}
          </span>
          <motion.span
            animate={{
              opacity: [1, 1, 0, 0],
            }}
            className="inline-block h-[1em] w-[3px] bg-black dark:bg-white"
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "linear",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

```


## Swoosh Text (swoosh-text)
Type: registry:component
Nike inspired Text
**Dependencies:** deps: motion

`$ components/kokonutui/swoosh-text.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Swoosh Text
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface SwooshTextProps {
    text?: string;
    className?: string;
    shadowColors?: {
        first?: string;
        second?: string;
        third?: string;
        fourth?: string;
        glow?: string;
    };
}

export default function SwooshText({
    text = "Hover Me",
    className = "",
    shadowColors = {
        first: "#07bccc",
        second: "#e601c0",
        third: "#e9019a",
        fourth: "#f40468",
        glow: "#f40468",
    },
}: SwooshTextProps) {
    const textShadowStyle = {
        textShadow: `10px 10px 0px ${shadowColors.first}, 
                     15px 15px 0px ${shadowColors.second}, 
                     20px 20px 0px ${shadowColors.third}, 
                     25px 25px 0px ${shadowColors.fourth}, 
                     45px 45px 10px ${shadowColors.glow}`,
    };

    const noShadowStyle = {
        textShadow: "none",
    };

    return (
        <div className="w-full text-center">
            <motion.div
                className={cn(
                    "w-full text-center cursor-pointer text-3xl font-bold",
                    "transition-all duration-200 ease-in-out tracking-widest",
                    "text-black dark:text-white italic",
                    "stroke-[#d6f4f4]",
                    className
                )}
                style={textShadowStyle}
                whileHover={noShadowStyle}
            >
                {text}
            </motion.div>
        </div>
    );
}

```


## Sliced Text (sliced-text)
Type: registry:component
I haven't found any usage for that component, but i like it.
**Dependencies:** deps: motion

`$ components/kokonutui/sliced-text.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Sliced Text
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface SlicedTextProps {
    text: string;
    className?: string;
    containerClassName?: string;
    splitSpacing?: number;
}

const SlicedText: React.FC<SlicedTextProps> = ({
    text = "Sliced Text",
    className = "",
    containerClassName = "",
    splitSpacing = 2,
}) => {
    return (
        <motion.div
            className={cn(
                "w-full text-center relative inline-block",
                containerClassName
            )}
            whileHover="hover"
            initial="default"
        >
            <motion.div
                className={cn("absolute w-full text-4xl -ml-0.5", className)}
                variants={{
                    default: {
                        clipPath: "inset(0 0 50% 0)",
                        y: -splitSpacing / 2,
                        opacity: 1,
                    },
                    hover: {
                        clipPath: "inset(0 0 0 0)",
                        y: 0,
                        opacity: 0,
                    },
                }}
                transition={{ duration: 0.1 }}
            >
                {text}
            </motion.div>
            <motion.div
                className={cn("absolute w-full text-4xl", className)}
                variants={{
                    default: {
                        clipPath: "inset(50% 0 0 0)",
                        y: splitSpacing / 2,
                        opacity: 1,
                    },
                    hover: {
                        clipPath: "inset(0 0 0 0)",
                        y: 0,
                        opacity: 1,
                    },
                }}
                transition={{ duration: 0.1 }}
            >
                {text}
            </motion.div>

            <div className={cn("invisible text-4xl", className)}>{text}</div>
        </motion.div>
    );
};

export default SlicedText;

```


## Glitch Text (glitch-text)
Type: registry:component
Why not?
**Dependencies:** deps: motion

`$ components/kokonutui/glitch-text.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Glitch Text
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface GlitchTextProps {
    text: string;
    className?: string;
    glitchIntensity?: "light" | "medium" | "heavy" | "extreme";
    color?:
        | "rainbow"
        | "blue"
        | "purple"
        | "cyan"
        | "pink"
        | "orange"
        | "gradient-orange";
    backgroundColor?: string;
    isStatic?: boolean;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | number;
    fontWeight?: number;
    letterSpacing?: number;
}

const GlitchText = ({
    text = "Glitch Text",
    className,
    glitchIntensity = "medium",
    color = "gradient-orange",
    backgroundColor,
    isStatic = false,
    size = "md",
    fontWeight = 700,
    letterSpacing = 5,
}: GlitchTextProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Vibrant color schemes
    const colorSchemes = {
        rainbow: {
            primary: "oklch(0.85 0.2 var(--rainbow-hue, 270))",
            before: "oklch(0.9 0.15 calc(var(--rainbow-hue, 270) + 60))",
            after: "oklch(0.8 0.25 calc(var(--rainbow-hue, 270) - 60))",
        },
        blue: {
            primary: "oklch(0.65 0.2 250)", // Vibrant blue
            before: "oklch(0.75 0.15 255)", // Lighter blue
            after: "oklch(0.55 0.25 245)", // Deeper blue
        },
        purple: {
            primary: "oklch(0.6 0.22 290)", // Rich purple
            before: "oklch(0.7 0.18 295)", // Lighter purple
            after: "oklch(0.5 0.25 285)", // Deep purple
        },
        cyan: {
            primary: "oklch(0.8 0.15 200)", // Bright cyan
            before: "oklch(0.85 0.12 205)", // Light cyan
            after: "oklch(0.7 0.18 195)", // Deep cyan
        },
        pink: {
            primary: "oklch(0.7 0.25 330)", // Vibrant pink
            before: "oklch(0.8 0.2 335)", // Light pink
            after: "oklch(0.6 0.28 325)", // Deep pink
        },
        orange: {
            primary: "oklch(0.7 0.25 45)", // Vibrant tangerine orange
            before: "oklch(0.85 0.2 40)", // Warm light orange
            after: "oklch(0.6 0.28 50)", // Deep sunset orange
        },
        "gradient-orange": {
            primary:
                "linear-gradient(135deg, oklch(0.7 0.25 45) 0%, oklch(0.75 0.28 30) 50%, oklch(0.65 0.3 60) 100%)",
            before: "linear-gradient(135deg, oklch(0.85 0.2 40) 0%, oklch(0.8 0.22 25) 50%, oklch(0.75 0.25 55) 100%)",
            after: "linear-gradient(135deg, oklch(0.6 0.28 50) 0%, oklch(0.55 0.3 35) 50%, oklch(0.5 0.32 65) 100%)",
        },
    };

    const selectedScheme = colorSchemes[color];

    // Glitch intensity settings
    const intensitySettings = {
        light: {
            animationDuration: "2s",
            translateRange: 2,
            opacityRange: [0.8, 0.9],
            skewRange: 0.5,
        },
        medium: {
            animationDuration: "1s",
            translateRange: 3,
            opacityRange: [0.7, 0.85],
            skewRange: 1,
        },
        heavy: {
            animationDuration: "0.5s",
            translateRange: 5,
            opacityRange: [0.6, 0.8],
            skewRange: 2,
        },
        extreme: {
            animationDuration: "0.3s",
            translateRange: 8,
            opacityRange: [0.5, 0.75],
            skewRange: 3,
        },
    };

    const settings = intensitySettings[glitchIntensity];

    const sizeMap = {
        sm: "text-2xl",
        md: "text-4xl",
        lg: "text-5xl",
        xl: "text-6xl",
        "2xl": "text-7xl",
        "3xl": "text-8xl",
    };

    // Animation variants for the glitch effect
    const glitchAnimation = {
        initial: {
            transform: "translate(0)",
            opacity: settings.opacityRange[1],
        },
        animate: {
            transform: [
                "translate(0)",
                `translate(${
                    settings.translateRange
                }px, ${-settings.translateRange}px) skew(${
                    settings.skewRange
                }deg)`,
                `translate(${-settings.translateRange}px, ${
                    settings.translateRange
                }px) skew(${-settings.skewRange}deg)`,
                `translate(${-settings.translateRange}px, ${-settings.translateRange}px) skew(${
                    settings.skewRange
                }deg)`,
                `translate(${settings.translateRange}px, ${
                    settings.translateRange
                }px) skew(${-settings.skewRange}deg)`,
                "translate(0)",
            ],
            opacity: [
                settings.opacityRange[1],
                settings.opacityRange[0],
                settings.opacityRange[1],
                settings.opacityRange[0],
                settings.opacityRange[1],
            ],
            transition: {
                duration: Number(settings.animationDuration.replace("s", "")),
                ease: [0.25, 0.46, 0.45, 0.94],
                repeat: Number.POSITIVE_INFINITY,
            },
        },
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative flex items-center justify-center",
                "overflow-visible p-8",
                className
            )}
        >
            <motion.div
                className={cn(
                    "relative font-bold tracking-wider",
                    typeof size === "string" ? sizeMap[size] : ""
                )}
                style={{
                    fontSize:
                        typeof size === "number" ? `${size}px` : undefined,
                    fontWeight,
                    letterSpacing,
                    color: selectedScheme.primary,
                    textShadow: `0 0 5px ${selectedScheme.primary}40`,
                }}
                initial="initial"
                animate={!isStatic ? "animate" : "initial"}
                variants={glitchAnimation as any}
            >
                {text}

                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        color: selectedScheme.before,
                        textShadow: `0 0 7px ${selectedScheme.before}40`,
                    }}
                    initial="initial"
                    animate={!isStatic ? "animate" : "initial"}
                    variants={{
                        ...glitchAnimation as any,
                        animate: {
                            ...(glitchAnimation as any).animate,
                            transform: [
                                "translate(0)",
                                `translate(${-settings.translateRange}px, ${
                                    settings.translateRange
                                }px) skew(${-settings.skewRange}deg)`,
                                `translate(${
                                    settings.translateRange
                                }px, ${-settings.translateRange}px) skew(${
                                    settings.skewRange
                                }deg)`,
                                `translate(${settings.translateRange}px, ${
                                    settings.translateRange
                                }px) skew(${-settings.skewRange}deg)`,
                                `translate(${-settings.translateRange}px, ${-settings.translateRange}px) skew(${
                                    settings.skewRange
                                }deg)`,
                                "translate(0)",
                            ],
                        },
                    }}
                >
                    {text}
                </motion.div>

                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        color: selectedScheme.after,
                        textShadow: `0 0 7px ${selectedScheme.after}40`,
                    }}
                    initial="initial"
                    animate={!isStatic ? "animate" : "initial"}
                    variants={{
                        ...(glitchAnimation as any),
                        animate: {
                            ...(glitchAnimation as any).animate,
                            transform: [
                                "translate(0)",
                                `translate(${
                                    settings.translateRange
                                }px, ${-settings.translateRange}px) skew(${
                                    settings.skewRange
                                }deg)`,
                                `translate(${-settings.translateRange}px, ${
                                    settings.translateRange
                                }px) skew(${-settings.skewRange}deg)`,
                                `translate(${-settings.translateRange}px, ${
                                    settings.translateRange
                                }px) skew(${settings.skewRange}deg)`,
                                `translate(${
                                    settings.translateRange
                                }px, ${-settings.translateRange}px) skew(${-settings.skewRange}deg)`,
                                "translate(0)",
                            ],
                        },
                    }}
                >
                    {text}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default GlitchText;

```


## Matrix Text (matrix-text)
Type: registry:component
010110010110111101110101011100100010000001110111011001010110110001100011011011110110110101100101
**Dependencies:** deps: motion

`$ components/kokonutui/matrix-text.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Matrix Text
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface LetterState {
    char: string;
    isMatrix: boolean;
    isSpace: boolean;
}

interface MatrixTextProps {
    text?: string;
    className?: string;
    initialDelay?: number;
    letterAnimationDuration?: number;
    letterInterval?: number;
}

const MatrixText = ({
    text = "HelloWorld!",
    className,
    initialDelay = 200,
    letterAnimationDuration = 500,
    letterInterval = 100,
}: MatrixTextProps) => {
    const [letters, setLetters] = useState<LetterState[]>(() =>
        text.split("").map((char) => ({
            char,
            isMatrix: false,
            isSpace: char === " ",
        }))
    );
    const [isAnimating, setIsAnimating] = useState(false);

    const getRandomChar = useCallback(
        () => (Math.random() > 0.5 ? "1" : "0"),
        []
    );

    const animateLetter = useCallback(
        (index: number) => {
            if (index >= text.length) return;

            requestAnimationFrame(() => {
                setLetters((prev) => {
                    const newLetters = [...prev];
                    if (!newLetters[index].isSpace) {
                        newLetters[index] = {
                            ...newLetters[index],
                            char: getRandomChar(),
                            isMatrix: true,
                        };
                    }
                    return newLetters;
                });

                setTimeout(() => {
                    setLetters((prev) => {
                        const newLetters = [...prev];
                        newLetters[index] = {
                            ...newLetters[index],
                            char: text[index],
                            isMatrix: false,
                        };
                        return newLetters;
                    });
                }, letterAnimationDuration);
            });
        },
        [getRandomChar, text, letterAnimationDuration]
    );

    const startAnimation = useCallback(() => {
        if (isAnimating) return;

        setIsAnimating(true);
        let currentIndex = 0;

        const animate = () => {
            if (currentIndex >= text.length) {
                setIsAnimating(false);
                return;
            }

            animateLetter(currentIndex);
            currentIndex++;
            setTimeout(animate, letterInterval);
        };

        animate();
    }, [animateLetter, text, isAnimating, letterInterval]);

    useEffect(() => {
        const timer = setTimeout(startAnimation, initialDelay);
        return () => clearTimeout(timer);
    }, []);

    const motionVariants = useMemo(
        () => ({
            // initial: {
            //     color: "rgb(var(--foreground-rgb))",
            // },
            matrix: {
                color: "#00ff00",
                textShadow: "0 2px 4px rgba(0, 255, 0, 0.5)",
            },
            // normal: {
            //     color: "rgb(var(--foreground-rgb))",
            //     textShadow: "none",
            // },
        }),
        []
    );

    return (
        <div
            className={cn(
                "flex min-h-screen items-center justify-center text-black dark:text-white",
                className
            )}
            aria-label="Matrix text animation"
        >
            <div className="h-24 flex items-center justify-center">
                <div className="flex flex-wrap items-center justify-center">
                    {letters.map((letter, index) => (
                        <motion.div
                            key={`${index}-${letter.char}`}
                            className="font-mono text-4xl md:text-6xl w-[1ch] text-center overflow-hidden"
                            initial="initial"
                            animate={letter.isMatrix ? "matrix" : "normal"}
                            variants={motionVariants}
                            transition={{
                                duration: 0.1,
                                ease: "easeInOut",
                            }}
                            style={{
                                display: "inline-block",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            {letter.isSpace ? "\u00A0" : letter.char}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MatrixText;

```


## Dynamic Text (dynamic-text)
Type: registry:component
Dynamic switcher text.
**Dependencies:** deps: motion

`$ components/kokonutui/dynamic-text.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Dynamic Text
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Greeting {
    text: string;
    language: string;
}

const greetings: Greeting[] = [
    { text: "Hello", language: "English" },
    { text: "こんにちは", language: "Japanese" },
    { text: "Bonjour", language: "French" },
    { text: "Hola", language: "Spanish" },
    { text: "안녕하세요", language: "Korean" },
    { text: "Ciao", language: "Italian" },
    { text: "Hallo", language: "German" },
    { text: "こんにちは", language: "Japanese" },
];

const DynamicText = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        if (!isAnimating) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = prevIndex + 1;

                if (nextIndex >= greetings.length) {
                    clearInterval(interval);
                    setIsAnimating(false);
                    return prevIndex;
                }

                return nextIndex;
            });
        }, 300);

        return () => clearInterval(interval);
    }, [isAnimating]);

    // Animation variants for the text
    const textVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { y: -100, opacity: 0 },
    };

    return (
        <section
            className="flex min-h-[200px] items-center justify-center gap-1 p-4"
            aria-label="Rapid greetings in different languages"
        >
            <div className="relative h-16 w-60 flex items-center justify-center overflow-visible">
                {isAnimating ? (
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={currentIndex}
                            className="absolute flex items-center gap-2 text-2xl font-medium text-gray-800 dark:text-gray-200"
                            aria-live="off"
                            initial={textVariants.hidden}
                            animate={textVariants.visible}
                            exit={textVariants.exit}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            <div
                                className="h-2 w-2 rounded-full bg-black dark:bg-white"
                                aria-hidden="true"
                            />
                            {greetings[currentIndex].text}
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <div className="flex items-center gap-2 text-2xl font-medium text-gray-800 dark:text-gray-200">
                        <div
                            className="h-2 w-2 rounded-full bg-black dark:bg-white"
                            aria-hidden="true"
                        />
                        {greetings[currentIndex].text}
                    </div>
                )}
            </div>
        </section>
    );
};

export default DynamicText;

```


## Particle Button (particle-button)
Type: registry:component
Particle Button Animation on click.
**Dependencies:** deps: lucide-react, motion; registry: button

`$ components/kokonutui/particle-button.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Particle Button
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { useState, useRef, type RefObject } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import type { ButtonProps } from "@/components/ui/button";
import { MousePointerClick } from "lucide-react";

interface ParticleButtonProps extends ButtonProps {
    onSuccess?: () => void;
    successDuration?: number;
}

function SuccessParticles({
    buttonRef,
}: {
    buttonRef: React.RefObject<HTMLButtonElement>;
}) {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return null;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    return (
        <AnimatePresence>
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="fixed w-1 h-1 bg-black dark:bg-white rounded-full"
                    style={{ left: centerX, top: centerY }}
                    initial={{
                        scale: 0,
                        x: 0,
                        y: 0,
                    }}
                    animate={{
                        scale: [0, 1, 0],
                        x: [0, (i % 2 ? 1 : -1) * (Math.random() * 50 + 20)],
                        y: [0, -Math.random() * 50 - 20],
                    }}
                    transition={{
                        duration: 0.6,
                        delay: i * 0.1,
                        ease: "easeOut",
                    }}
                />
            ))}
        </AnimatePresence>
    );
}

export default function ParticleButton({
    children,
    onClick,
    onSuccess,
    successDuration = 1000,
    className,
    ...props
}: ParticleButtonProps) {
    const [showParticles, setShowParticles] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setShowParticles(true);

        setTimeout(() => {
            setShowParticles(false);
        }, successDuration);
    };

    return (
        <>
            {showParticles && (
                <SuccessParticles
                    buttonRef={buttonRef as RefObject<HTMLButtonElement>}
                />
            )}
            <Button
                ref={buttonRef}
                onClick={handleClick}
                className={cn(
                    "relative",
                    showParticles && "scale-95",
                    "transition-transform duration-100",
                    className
                )}
                {...props}
            >
                {children}
                <MousePointerClick className="h-4 w-4" />
            </Button>
        </>
    );
}

```


## X Card (tweet-card)
Type: registry:component
Gradient on hover X card. (The post is real!)
**Dependencies:** deps: lucide-react

`$ components/kokonutui/tweet-card.tsx`
```tsx
import { VerifiedIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * @author: @dorian_baffier
 * @description: Tweet Card
 * @version: 1.0.0
 * @date: 2025-10-01
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

interface ReplyProps {
    authorName: string;
    authorHandle: string;
    authorImage: string;
    content: string;
    isVerified?: boolean;
    timestamp: string;
}

interface TweetCardProps {
    authorName: string;
    authorHandle: string;
    authorImage: string;
    content: string[];
    isVerified?: boolean;
    timestamp: string;
    reply?: ReplyProps;
}

export default function TweetCard({
    authorName = "Dorian",
    authorHandle = "dorian_baffier",
    authorImage = "https://pbs.twimg.com/profile_images/1971614417809997824/Zen4oXbs_400x400.jpg",
    content = [
        "All components from KokonutUI can now be open in @v0 🎉",
        "1. Click on 'Open in V0'",
        "2. Customize with prompts",
        "3. Deploy to your app",
    ],
    isVerified = true,
    timestamp = "Jan 18, 2025",
    reply = {
        authorName: "shadcn",
        authorHandle: "shadcn",
        authorImage:
            "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
        content: "Awesome.",
        isVerified: true,
        timestamp: "Jan 18",
    },
}: TweetCardProps) {
    return (
        <Link
            href="https://x.com/dorian_baffier/status/1880291036410572934"
            target="_blank"
        >
            <div
                className={cn(
                    "w-full min-w-[400px] md:min-w-[500px] max-w-xl p-1.5 rounded-2xl relative isolate overflow-hidden",
                    "bg-white/5 dark:bg-black/90",
                    "bg-linear-to-br from-black/5 to-black/[0.02] dark:from-white/5 dark:to-white/[0.02]",
                    "backdrop-blur-xl backdrop-saturate-[180%]",
                    "border border-black/10 dark:border-white/10",
                    "shadow-[0_8px_16px_rgb(0_0_0_/_0.15)] dark:shadow-[0_8px_16px_rgb(0_0_0_/_0.25)]",
                    "will-change-transform translate-z-0"
                )}
            >
                <div
                    className={cn(
                        "w-full p-5 rounded-xl relative",
                        "bg-linear-to-br from-black/[0.05] to-transparent dark:from-white/[0.08] dark:to-transparent",
                        "backdrop-blur-md backdrop-saturate-150",
                        "border border-black/[0.05] dark:border-white/[0.08]",
                        "text-black/90 dark:text-white",
                        "shadow-xs",
                        "will-change-transform translate-z-0",
                        "before:absolute before:inset-0 before:bg-linear-to-br before:from-black/[0.02] before:to-black/[0.01] dark:before:from-white/[0.03] dark:before:to-white/[0.01] before:opacity-0 before:transition-opacity before:pointer-events-none",
                        "hover:before:opacity-100"
                    )}
                >
                    <div className="flex gap-3">
                        <div className="shrink-0">
                            <div className="h-10 w-10 rounded-full overflow-hidden">
                                <img
                                    src={authorImage}
                                    alt={authorName}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold text-black dark:text-white/90 hover:underline cursor-pointer">
                                            {authorName}
                                        </span>
                                        {isVerified && (
                                            <VerifiedIcon className="h-4 w-4 text-blue-400" />
                                        )}
                                    </div>
                                    <span className="text-black dark:text-white/60 text-sm">
                                        @{authorHandle}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="h-8 w-8 text-black dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg p-1 flex items-center justify-center"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1200"
                                        height="1227"
                                        fill="none"
                                        viewBox="0 0 1200 1227"
                                        className="w-4 h-4"
                                    >
                                        <title>X</title>
                                        <path
                                            fill="currentColor"
                                            d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-2">
                        {content.map((item, index) => (
                            <p
                                key={index}
                                className="text-black dark:text-white/90 text-base"
                            >
                                {item}
                            </p>
                        ))}
                        <span className="text-black dark:text-white/50 text-sm mt-2 block">
                            {timestamp}
                        </span>
                    </div>

                    {reply && (
                        <div className="mt-4 pt-4 border-t border-black/[0.08] dark:border-white/[0.08]">
                            <div className="flex gap-3">
                                <div className="shrink-0">
                                    <div className="h-10 w-10 rounded-full overflow-hidden">
                                        <img
                                            src={reply.authorImage}
                                            alt={reply.authorName}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold text-black dark:text-white/90 hover:underline cursor-pointer">
                                            {reply.authorName}
                                        </span>
                                        {reply.isVerified && (
                                            <VerifiedIcon className="h-4 w-4 text-blue-400" />
                                        )}
                                        <span className="text-black dark:text-white/60 text-sm">
                                            @{reply.authorHandle}
                                        </span>
                                        <span className="text-black dark:text-white/60 text-sm">
                                            ·
                                        </span>
                                        <span className="text-black dark:text-white/60 text-sm">
                                            {reply.timestamp}
                                        </span>
                                    </div>
                                    <p className="text-black dark:text-white/80 text-sm mt-1">
                                        {reply.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

```


## Scroll Text (scroll-text)
Type: registry:component
Animated on scroll texts.
**Dependencies:** deps: motion

`$ components/kokonutui/scroll-text.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Scroll Text
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { useRef, useState, useEffect } from "react";
import { motion, Variants } from "motion/react";
import { cn } from "@/lib/utils";

interface ScrollTextProps {
    texts?: string[];
    className?: string;
}

export default function ScrollText({
    texts = [
        "TailwindCSS",
        "Kokonut UI",
        "shadcn/ui",
        "Next.js",
        "Vercel",
        "Motion",
        "React",
        "Resend",
        "TypeScript",
        "Fumadocs",
        "Supabase",
        "Vercel"
    ],
    className,
}: ScrollTextProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll to top on mount
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    }, []);

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const index = itemsRef.current.findIndex(
                    (item) => item === entry.target
                );
                setActiveIndex(index);
            }
        });
    };

    // Setup intersection observer
    const setupObserver = (element: HTMLDivElement | null, index: number) => {
        if (element && !itemsRef.current[index]) {
            itemsRef.current[index] = element;

            if (!observerRef.current) {
                observerRef.current = new IntersectionObserver(
                    handleIntersection,
                    {
                        threshold: 0.7,
                        root: containerRef.current,
                        rootMargin: "-45% 0px -45% 0px",
                    }
                );
            }

            observerRef.current.observe(element);
        }
    };

    // Animation variants for the reveal effect
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: (index: number) => ({
            opacity: 0,
            x: index % 2 === 0 ? -100 : 100,
            rotate: index % 2 === 0 ? -10 : 10,
        }),
        visible: {
            opacity: 1,
            x: 0,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.5,
            },
        },
    };

    return (
        <div className={cn("w-full max-w-3xl mx-auto", className)}>
            <div
                ref={containerRef}
                className={cn(
                    "h-[300px] overflow-y-auto scrollbar-none",
                    "relative flex flex-col items-center",
                    "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                )}
            >
                <div className="h-[150px]" />
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center w-full"
                >
                    {texts.map((text, index) => (
                        <motion.div
                            key={text}
                            ref={(el) => setupObserver(el, index)}
                            custom={index}
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ 
                                once: false,
                                margin: "-20% 0px -20% 0px"
                            }}
                            className={cn(
                                "text-5xl font-bold py-8 px-4 whitespace-nowrap",
                                "transition-colors duration-300",
                                activeIndex === index
                                    ? "text-black dark:text-white"
                                    : "text-neutral-500/50 dark:text-neutral-600"
                            )}
                        >
                            {text}
                        </motion.div>
                    ))}
                </motion.div>
                <div className="h-[150px]" />
            </div>
        </div>
    );
}

```


## Liquid Glass (liquid-glass-card)
Type: registry:component
Liquid Glass inspired by @Apple
**Dependencies:** deps: lucide-react

`$ components/kokonutui/liquid-glass-card.tsx`
```tsx
"use client";

/**
 * @author: @dorian_baffier
 * @description: Liquid Glass Card - Optimized with Shadcn UI
 * @version: 2.0.0
 * @date: 2025-10-11
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { cva, type VariantProps } from "class-variance-authority";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Constants for better maintainability
const GLASS_SHADOW_LIGHT =
  "shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)]";

const GLASS_SHADOW_DARK =
  "dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]";

const GLASS_SHADOW = `${GLASS_SHADOW_LIGHT} ${GLASS_SHADOW_DARK}`;

const DEFAULT_GLASS_FILTER_SCALE = 30;
const BUTTON_GLASS_FILTER_SCALE = 70;

// Shared glass filter component
type GlassFilterProps = {
  id: string;
  scale?: number;
};

const GlassFilter = React.memo(
  ({ id, scale = DEFAULT_GLASS_FILTER_SCALE }: GlassFilterProps) => (
    <svg className="hidden">
      <title>Glass Effect Filter</title>
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          height="200%"
          id={id}
          width="200%"
          x="-50%"
          y="-50%"
        >
          <feTurbulence
            baseFrequency="0.05 0.05"
            numOctaves="1"
            result="turbulence"
            seed="1"
            type="fractalNoise"
          />
          <feGaussianBlur
            in="turbulence"
            result="blurredNoise"
            stdDeviation="2"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            result="displaced"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="B"
          />
          <feGaussianBlur in="displaced" result="finalBlur" stdDeviation="4" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  )
);
GlassFilter.displayName = "GlassFilter";

// Liquid Button - extends shadcn Button with glass effect
const liquidButtonVariants = cva("relative transition-transform duration-300", {
  variants: {
    liquidVariant: {
      default: "hover:scale-105",
      none: "",
    },
  },
  defaultVariants: {
    liquidVariant: "default",
  },
});

export type LiquidButtonProps = ButtonProps & {
  liquidVariant?: "default" | "none";
};

function LiquidButton({
  className,
  liquidVariant = "default",
  children,
  ...props
}: LiquidButtonProps) {
  const filterId = React.useId();

  return (
    <>
      <Button
        className={cn(liquidButtonVariants({ liquidVariant }), className)}
        {...props}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full transition-all",
            GLASS_SHADOW
          )}
        />
        <div
          className="-z-10 pointer-events-none absolute inset-0 isolate overflow-hidden rounded-md"
          style={{ backdropFilter: `url("#${filterId}")` }}
        />
        <span className="relative z-10">{children}</span>
      </Button>
      <GlassFilter id={filterId} scale={BUTTON_GLASS_FILTER_SCALE} />
    </>
  );
}

// Liquid Glass Card - extends shadcn Card with glass effect
const liquidGlassCardVariants = cva(
  "group relative overflow-hidden bg-background/20 backdrop-blur-[2px] transition-all duration-300",
  {
    variants: {
      glassSize: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      glassSize: "default",
    },
  }
);

export type LiquidGlassCardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof liquidGlassCardVariants> & {
    glassEffect?: boolean;
  };

function LiquidGlassCard({
  className,
  glassSize,
  glassEffect = true,
  children,
  ...props
}: LiquidGlassCardProps) {
  const filterId = React.useId();

  return (
    <Card
      className={cn(liquidGlassCardVariants({ glassSize }), className)}
      {...props}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-lg transition-all",
          GLASS_SHADOW
        )}
      />

      {glassEffect && (
        <>
          <div
            className="-z-10 pointer-events-none absolute inset-0 overflow-hidden rounded-lg"
            style={{ backdropFilter: `url("#${filterId}")` }}
          />
          <GlassFilter id={filterId} scale={DEFAULT_GLASS_FILTER_SCALE} />
        </>
      )}

      <div className="relative z-10">{children}</div>

      <div className="pointer-events-none absolute inset-0 z-20 rounded-lg bg-gradient-to-r from-transparent via-black/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:via-white/5" />
    </Card>
  );
}

// Demo: Music Player Card
const TOTAL_DURATION = 45;
const VOLUME_BAR_COUNT = 8;
const SEEK_JUMP_SECONDS = 5;
const TIMER_INTERVAL_MS = 1000;
const STATIC_BAR_HEIGHT = "6px";
const MIN_TIME = 0;
const BAR_DELAY_INCREMENT = 0.1;
const PROGRESS_PERCENTAGE_MULTIPLIER = 100;

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

type VolumeBarsProps = {
  isPlaying: boolean;
};

const VolumeBars = React.memo(({ isPlaying }: VolumeBarsProps) => {
  const bars = Array.from({ length: VOLUME_BAR_COUNT }, (_, i) => ({
    id: `bar-${i}`,
    delay: i * BAR_DELAY_INCREMENT,
  }));

  return (
    <div className="pointer-events-none flex h-8 w-10 items-end gap-0.5">
      {bars.map((bar) => (
        <div
          className={cn(
            "w-[3px] rounded-sm",
            isPlaying && "animate-bounce-music"
          )}
          key={bar.id}
          style={{
            height: isPlaying ? undefined : STATIC_BAR_HEIGHT,
            animationDelay: `${bar.delay}s`,
            background: "linear-gradient(to top, #FF2E55, #FF6B88)",
          }}
        />
      ))}
    </div>
  );
});
VolumeBars.displayName = "VolumeBars";

type ProgressBarProps = {
  currentTime: number;
  totalDuration: number;
  onSeek: (newTime: number) => void;
};

const ProgressBar = React.memo(
  ({ currentTime, totalDuration, onSeek }: ProgressBarProps) => {
    const progress =
      (currentTime / totalDuration) * PROGRESS_PERCENTAGE_MULTIPLIER;

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const bar = e.currentTarget;
      const rect = bar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = x / rect.width;
      const newTime = Math.min(
        Math.max(MIN_TIME, percent * totalDuration),
        totalDuration
      );
      onSeek(newTime);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const newTime = Math.min(
          currentTime + SEEK_JUMP_SECONDS,
          totalDuration
        );
        onSeek(newTime);
      }
    };

    return (
      <>
        <div className="flex justify-between font-medium text-xs text-zinc-500 dark:text-zinc-400">
          <span className="tabular-nums">{formatTime(currentTime)}</span>
          <span className="tabular-nums">{formatTime(totalDuration)}</span>
        </div>
        <div
          aria-label="Seek progress bar"
          aria-valuemax={totalDuration}
          aria-valuemin={MIN_TIME}
          aria-valuenow={currentTime}
          className="relative z-10 h-1 w-full cursor-pointer overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="slider"
          tabIndex={0}
        >
          <div
            className="h-full bg-gradient-to-r from-[#FF2E55] to-[#FF6B88] transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </>
    );
  }
);
ProgressBar.displayName = "ProgressBar";

export function NotificationCenter() {
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [currentTime, setCurrentTime] = React.useState(MIN_TIME);

  React.useEffect(() => {
    if (!isPlaying || currentTime >= TOTAL_DURATION) {
      return;
    }

    const intervalId = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= TOTAL_DURATION) {
          setIsPlaying(false);
          return TOTAL_DURATION;
        }
        return prev + 1;
      });
    }, TIMER_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isPlaying, currentTime]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    if (newTime < TOTAL_DURATION && !isPlaying) {
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <LiquidGlassCard className="gap-3.5 rounded-3xl border border-zinc-200/60 bg-gradient-to-br from-zinc-50 to-zinc-100 p-4 shadow-xl dark:border-zinc-700/60 dark:from-zinc-900 dark:to-black">
        <div className="flex items-center gap-3">
          <div className="relative mr-2 mb-4 h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-pink-400 via-pink-300 to-rose-200 shadow-lg ring-1 ring-black/5 dark:shadow-xl">
            <Image
              alt="Album Art for Glow by Echo"
              className="h-full w-full object-cover"
              height={64}
              src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/portrait2-x5MjJSaQ9ed0HZrewEhH7TkZwjZ66K.jpeg"
              width={64}
            />
          </div>

          <div className="flex-1 overflow-hidden">
            <h3 className="overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-lg text-zinc-900 dark:text-white">
              Glow
            </h3>
            <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
              Echo
            </p>
          </div>

          <VolumeBars isPlaying={isPlaying} />
        </div>

        <div className="flex flex-col gap-2">
          <ProgressBar
            currentTime={currentTime}
            onSeek={handleSeek}
            totalDuration={TOTAL_DURATION}
          />

          <div className="mt-1 flex items-center justify-between">
            <div className="flex items-center justify-center gap-2">
              <LiquidButton
                aria-label="Previous track"
                className="h-10 w-10 rounded-full bg-transparent text-zinc-700 transition-colors hover:bg-zinc-200/80 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
                size="icon"
                variant="ghost"
              >
                <ArrowLeft className="size-4" />
              </LiquidButton>
              <LiquidButton
                aria-label={isPlaying ? "Pause" : "Play"}
                className="h-11 w-11 rounded-full bg-transparent text-zinc-700 transition-colors hover:bg-zinc-200/80 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
                onClick={handlePlayPause}
                size="icon"
                variant="ghost"
              >
                {isPlaying ? (
                  <Pause className="size-5" />
                ) : (
                  <Play className="size-5" />
                )}
              </LiquidButton>
              <LiquidButton
                aria-label="Next track"
                className="h-10 w-10 rounded-full bg-transparent text-zinc-700 transition-colors hover:bg-zinc-200/80 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
                size="icon"
                variant="ghost"
              >
                <ArrowRight className="size-4" />
              </LiquidButton>
            </div>
            <LiquidButton
              aria-label="More options"
              className="h-10 w-10 rounded-full bg-transparent text-zinc-700 transition-colors hover:bg-zinc-200/80 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
              size="icon"
              variant="ghost"
            >
              <svg
                className="size-4"
                fill="currentColor"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Options</title>
                <path d="M6.634 1.135A7 7 0 0 1 15 8a.5.5 0 0 1-1 0 6 6 0 1 0-6.5 5.98v-1.005A5 5 0 1 1 13 8a.5.5 0 0 1-1 0 4 4 0 1 0-4.5 3.969v-1.011A2.999 2.999 0 1 1 11 8a.5.5 0 0 1-1 0 2 2 0 1 0-2.5 1.936v-1.07a1 1 0 1 1 1 0V15.5a.5.5 0 0 1-1 0v-.518a7 7 0 0 1-.866-13.847" />
              </svg>
            </LiquidButton>
          </div>
        </div>
      </LiquidGlassCard>
    </div>
  );
}

export { LiquidButton, LiquidGlassCard };
export default NotificationCenter;

```


## Profile Dropdown (profile-dropdown)
Type: registry:component
Menu dropdown with action buttons.
**Dependencies:** deps: lucide-react; registry: dropdown-menu

`$ components/kokonutui/profile-dropdown.tsx`
```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Settings, CreditCard, FileText, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Gemini from "../icons/gemini";

interface Profile {
    name: string;
    email: string;
    avatar: string;
    subscription?: string;
    model?: string;
}

interface MenuItem {
    label: string;
    value?: string;
    href: string;
    icon: React.ReactNode;
    external?: boolean;
}

const SAMPLE_PROFILE_DATA: Profile = {
    name: "Eugene An",
    email: "eugene@kokonutui.com",
    avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/profile-mjss82WnWBRO86MHHGxvJ2TVZuyrDv.jpeg",
    subscription: "PRO",
    model: "Gemini 2.0 Flash",
};

interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
    data?: Profile;
    showTopbar?: boolean;
}

export default function ProfileDropdown({
    data = SAMPLE_PROFILE_DATA,
    className,
    ...props
}: ProfileDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const menuItems: MenuItem[] = [
        {
            label: "Profile",
            href: "#",
            icon: <User className="w-4 h-4" />,
        },
        {
            label: "Model",
            value: data.model,
            href: "#",
            icon: <Gemini className="w-4 h-4" />,
        },
        {
            label: "Subscription",
            value: data.subscription,
            href: "#",
            icon: <CreditCard className="w-4 h-4" />,
        },
        {
            label: "Settings",
            href: "#",
            icon: <Settings className="w-4 h-4" />,
        },
        {
            label: "Terms & Policies",
            href: "#",
            icon: <FileText className="w-4 h-4" />,
            external: true,
        },
    ];

    return (
        <div className={cn("relative", className)} {...props}>
            <DropdownMenu onOpenChange={setIsOpen}>
                <div className="group relative">
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex items-center gap-16 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 hover:shadow-sm transition-all duration-200 focus:outline-none"
                        >
                            <div className="text-left flex-1">
                                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
                                    {data.name}
                                </div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400 tracking-tight leading-tight">
                                    {data.email}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-zinc-900">
                                        <Image
                                            src={data.avatar}
                                            alt={data.name}
                                            width={36}
                                            height={36}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </button>
                    </DropdownMenuTrigger>

                    {/* Bending line indicator on the right */}
                    <div
                        className={cn(
                            "absolute -right-3 top-1/2 -translate-y-1/2 transition-all duration-200",
                            isOpen
                                ? "opacity-100"
                                : "opacity-60 group-hover:opacity-100"
                        )}
                    >
                        <svg
                            width="12"
                            height="24"
                            viewBox="0 0 12 24"
                            fill="none"
                            className={cn(
                                "transition-all duration-200",
                                isOpen
                                    ? "text-blue-500 dark:text-blue-400 scale-110"
                                    : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                            )}
                            aria-hidden="true"
                        >
                            <path
                                d="M2 4C6 8 6 16 2 20"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                fill="none"
                            />
                        </svg>
                    </div>

                    <DropdownMenuContent
                        align="end"
                        sideOffset={4}
                        className="w-64 p-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl shadow-xl shadow-zinc-900/5 dark:shadow-zinc-950/20 
                    data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-top-right"
                    >
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <DropdownMenuItem key={item.label} asChild>
                                    <Link
                                        href={item.href}
                                        className="flex items-center p-3 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-sm border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50"
                                    >
                                        <div className="flex items-center gap-2 flex-1">
                                            {item.icon}
                                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight whitespace-nowrap group-hover:text-zinc-950 dark:group-hover:text-zinc-50 transition-colors">
                                                {item.label}
                                            </span>
                                        </div>
                                        <div className="flex-shrink-0 ml-auto">
                                            {item.value && (
                                                <span
                                                    className={cn(
                                                        "text-xs font-medium rounded-md py-1 px-2 tracking-tight",
                                                        item.label === "Model"
                                                            ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10 border border-blue-500/10"
                                                            : "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-500/10 border border-purple-500/10"
                                                    )}
                                                >
                                                    {item.value}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </div>

                        <DropdownMenuSeparator className="my-3 bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />

                        <DropdownMenuItem asChild>
                            <button
                                type="button"
                                className="w-full flex items-center gap-3 p-3 duration-200 bg-red-500/10 rounded-xl hover:bg-red-500/20 cursor-pointer border border-transparent hover:border-red-500/30 hover:shadow-sm transition-all group"
                            >
                                <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                                <span className="text-sm font-medium text-red-500 group-hover:text-red-600">
                                    Sign Out
                                </span>
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </div>
            </DropdownMenu>
        </div>
    );
}

```

`$ components/icons/gemini.tsx`
```tsx
const Gemini = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        height="1em"
        style={{
            flex: "none",
            lineHeight: 1,
        }}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        {...props}
    >
        <title>{"Gemini"}</title>
        <defs>
            <linearGradient
                id="lobe-icons-gemini-fill"
                x1="0%"
                x2="68.73%"
                y1="100%"
                y2="30.395%"
            >
                <stop offset="0%" stopColor="#1C7DFF" />
                <stop offset="52.021%" stopColor="#1C69FF" />
                <stop offset="100%" stopColor="#F0DCD6" />
            </linearGradient>
        </defs>
        <path
            d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
            fill="url(#lobe-icons-gemini-fill)"
            fillRule="nonzero"
        />
    </svg>
);
export default Gemini;

```


