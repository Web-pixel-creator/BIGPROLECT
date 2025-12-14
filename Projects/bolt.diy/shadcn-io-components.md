# shadcn.io Registry Components

Generated: 2025-12-14T10:19:58.199Z

Source: https://github.com/shadcnio/react-shadcn-components

## ai

### Actions (ai-actions)
**Docs:** https://www.shadcn.io/ai/actions
**Registry:** https://www.shadcn.io/registry/ai.json
**Dependencies:** @radix-ui/react-use-controllable-state, ai, harden-react-markdown, katex, lucide-react, react-markdown, react-syntax-highlighter, rehype-katex, remark-gfm, remark-math, use-stick-to-bottom

```tsx
// File: components/ui/shadcn-io/ai/actions.tsx
/**
 * Copyright 2023 Vercel, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import { Button } from '@repo/shadcn-ui/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/shadcn-ui/components/ui/tooltip';
import { cn } from '@repo/shadcn-ui/lib/utils';
import type { ComponentProps } from 'react';

export type ActionsProps = ComponentProps<'div'>;

export const Actions = ({ className, children, ...props }: ActionsProps) => (
  <div className={cn('flex items-center gap-1', className)} {...(props as any)}>
    {children}
  </div>
);

export type ActionProps = ComponentProps<typeof Button> & {
  tooltip?: string;
  label?: string;
};

export const Action = ({
  tooltip,
  children,
  label,
  className,
  variant = 'ghost',
  size = 'sm',
  ...props
}: ActionProps) => {
  const button = (
    <Button
      className={cn(
        'size-9 p-1.5 text-muted-foreground hover:text-foreground',
        className
      )}
      size={size}
      type="button"
      variant={variant}
      {...(props as any)}
    >
      {children}
      <span className="sr-only">{label || tooltip}</span>
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};
```

---

### Branch (ai-branch)
**Docs:** https://www.shadcn.io/ai/actions
**Registry:** https://www.shadcn.io/registry/ai.json
**Dependencies:** @radix-ui/react-use-controllable-state, ai, harden-react-markdown, katex, lucide-react, react-markdown, react-syntax-highlighter, rehype-katex, remark-gfm, remark-math, use-stick-to-bottom

```tsx
// File: components/ui/shadcn-io/ai/branch.tsx
/**
 * Copyright 2023 Vercel, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import { Button } from '@repo/shadcn-ui/components/ui/button';
import { cn } from '@repo/shadcn-ui/lib/utils';
import type { UIMessage } from 'ai';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import type { ComponentProps, HTMLAttributes, ReactElement } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

type BranchContextType = {
  currentBranch: number;
  totalBranches: number;
  goToPrevious: () => void;
  goToNext: () => void;
  branches: ReactElement[];
  setBranches: (branches: ReactElement[]) => void;
};

const BranchContext = createContext<BranchContextType | null>(null);

const useBranch = () => {
  const context = useContext(BranchContext);

  if (!context) {
    throw new Error('Branch components must be used within Branch');
  }

  return context;
};

export type BranchProps = HTMLAttributes<HTMLDivElement> & {
  defaultBranch?: number;
  onBranchChange?: (branchIndex: number) => void;
};

export const Branch = ({
  defaultBranch = 0,
  onBranchChange,
  className,
  ...props
}: BranchProps) => {
  const [currentBranch, setCurrentBranch] = useState(defaultBranch);
  const [branches, setBranches] = useState<ReactElement[]>([]);

  const handleBranchChange = (newBranch: number) => {
    setCurrentBranch(newBranch);
    onBranchChange?.(newBranch);
  };

  const goToPrevious = () => {
    const newBranch =
      currentBranch > 0 ? currentBranch - 1 : branches.length - 1;
    handleBranchChange(newBranch);
  };

  const goToNext = () => {
    const newBranch =
      currentBranch < branches.length - 1 ? currentBranch + 1 : 0;
    handleBranchChange(newBranch);
  };

  const contextValue: BranchContextType = {
    currentBranch,
    totalBranches: branches.length,
    goToPrevious,
    goToNext,
    branches,
    setBranches,
  };

  return (
    <BranchContext.Provider value={contextValue}>
      <div
        className={cn('grid w-full gap-2 [&>div]:pb-0', className)}
        {...(props as any)}
      />
    </BranchContext.Provider>
  );
};

export type BranchMessagesProps = HTMLAttributes<HTMLDivElement>;

export const BranchMessages = ({ children, ...props }: BranchMessagesProps) => {
  const { currentBranch, setBranches, branches } = useBranch();
  const childrenArray = Array.isArray(children) ? children : [children];

  // Use useEffect to update branches when they change
  useEffect(() => {
    if (branches.length !== childrenArray.length) {
      setBranches(childrenArray);
    }
  }, [childrenArray, branches, setBranches]);

  return childrenArray.map((branch, index) => (
    <div
      className={cn(
        'grid gap-2 overflow-hidden [&>div]:pb-0',
        index === currentBranch ? 'block' : 'hidden'
      )}
      key={branch.key}
      {...(props as any)}
    >
      {branch}
    </div>
  ));
};

export type BranchSelectorProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage['role'];
};

export const BranchSelector = ({
  className,
  from,
  ...props
}: BranchSelectorProps) => {
  const { totalBranches } = useBranch();

  // Don't render if there's only one branch
  if (totalBranches <= 1) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 self-end px-10',
        from === 'assistant' ? 'justify-start' : 'justify-end',
        className
      )}
      {...(props as any)}
    />
  );
};

export type BranchPreviousProps = ComponentProps<typeof Button>;

export const BranchPrevious = ({
  className,
  children,
  ...props
}: BranchPreviousProps) => {
  const { goToPrevious, totalBranches } = useBranch();

  return (
    <Button
      aria-label="Previous branch"
      className={cn(
        'size-7 shrink-0 rounded-full text-muted-foreground transition-colors',
        'hover:bg-accent hover:text-foreground',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      disabled={totalBranches <= 1}
      onClick={goToPrevious}
      size="icon"
      type="button"
      variant="ghost"
      {...(props as any)}
    >
      {children ?? <ChevronLeftIcon size={14} />}
    </Button>
  );
};

export type BranchNextProps = ComponentProps<typeof Button>;

export const BranchNext = ({
  className,
  children,
  ...props
}: BranchNextProps) => {
  const { goToNext, totalBranches } = useBranch();

  return (
    <Button
      aria-label="Next branch"
      className={cn(
        'size-7 shrink-0 rounded-full text-muted-foreground transition-colors',
        'hover:bg-accent hover:text-foreground',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      disabled={totalBranches <= 1}
      onClick={goToNext}
      size="icon"
      type="button"
      variant="ghost"
      {...(props as any)}
    >
      {children ?? <ChevronRightIcon size={14} />}
    </Button>
  );
};

export type BranchPageProps = HTMLAttributes<HTMLSpanElement>;

export const BranchPage = ({ className, ...props }: BranchPageProps) => {
  const { currentBranch, totalBranches } = useBranch();

  return (
    <span
      className={cn(
        'font-medium text-muted-foreground text-xs tabular-nums',
        className
      )}
      {...(props as any)}
    >
      {currentBranch + 1} of {totalBranches}
    </span>
  );
};
```

---

### Code Block (ai-code-block)
**Docs:** https://www.shadcn.io/ai/actions
**Registry:** https://www.shadcn.io/registry/ai.json
**Dependencies:** @radix-ui/react-use-controllable-state, ai, harden-react-markdown, katex, lucide-react, react-markdown, react-syntax-highlighter, rehype-katex, remark-gfm, remark-math, use-stick-to-bottom

```tsx
// File: components/ui/shadcn-io/ai/code-block.tsx
/**
 * Copyright 2023 Vercel, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import { Button } from '@repo/shadcn-ui/components/ui/button';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { CheckIcon, CopyIcon } from 'lucide-react';
import type { ComponentProps, HTMLAttributes, ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

type CodeBlockContextType = {
  code: string;
};

const CodeBlockContext = createContext<CodeBlockContextType>({
  code: '',
});

export type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  children?: ReactNode;
};

export const CodeBlock = ({
  code,
  language,
  showLineNumbers = false,
  className,
  children,
  ...props
}: CodeBlockProps) => (
  <CodeBlockContext.Provider value={{ code }}>
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-md border bg-background text-foreground',
        className
      )}
      {...(props as any)}
    >
      <div className="relative">
        <SyntaxHighlighter
          className="overflow-hidden dark:hidden"
          codeTagProps={{
            className: 'font-mono text-sm',
          }}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
          }}
          language={language}
          lineNumberStyle={{
            color: 'hsl(var(--muted-foreground))',
            paddingRight: '1rem',
            minWidth: '2.5rem',
          }}
          showLineNumbers={showLineNumbers}
          style={oneLight}
        >
          {code}
        </SyntaxHighlighter>
        <SyntaxHighlighter
          className="hidden overflow-hidden dark:block"
          codeTagProps={{
            className: 'font-mono text-sm',
          }}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
          }}
          language={language}
          lineNumberStyle={{
            color: 'hsl(var(--muted-foreground))',
            paddingRight: '1rem',
            minWidth: '2.5rem',
          }}
          showLineNumbers={showLineNumbers}
          style={oneDark}
        >
          {code}
        </SyntaxHighlighter>
        {children && (
          <div className="absolute top-2 right-2 flex items-center gap-2">
            {children}
          </div>
        )}
      </div>
    </div>
  </CodeBlockContext.Provider>
);

export type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const CodeBlockCopyButton = ({
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}: CodeBlockCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { code } = useContext(CodeBlockContext);

  const copyToClipboard = async () => {
    if (typeof window === 'undefined' || !navigator.clipboard.writeText) {
      onError?.(new Error('Clipboard API not available'));
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      onCopy?.();
      setTimeout(() => setIsCopied(false), timeout);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const Icon = isCopied ? CheckIcon : CopyIcon;

  return (
    <Button
      className={cn('shrink-0', className)}
      onClick={copyToClipboard}
      size="icon"
      variant="ghost"
      {...(props as any)}
    >
      {children ?? <Icon size={14} />}
    </Button>
  );
};
```

---

### Conversation (ai-conversation)
**Docs:** https://www.shadcn.io/ai/actions
**Registry:** https://www.shadcn.io/registry/ai.json
**Dependencies:** @radix-ui/react-use-controllable-state, ai, harden-react-markdown, katex, lucide-react, react-markdown, react-syntax-highlighter, rehype-katex, remark-gfm, remark-math, use-stick-to-bottom

```tsx
// File: components/ui/shadcn-io/ai/conversation.tsx
/**
 * Copyright 2023 Vercel, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import { Button } from '@repo/shadcn-ui/components/ui/button';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { ArrowDownIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { useCallback } from 'react';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';

export type ConversationProps = ComponentProps<typeof StickToBottom>;

export const Conversation = ({ className, ...props }: ConversationProps) => (
  <StickToBottom
    className={cn('relative flex-1 overflow-y-auto', className)}
    initial="smooth"
    resize="smooth"
    role="log"
    {...(props as any)}
  />
);

export type ConversationContentProps = ComponentProps<
  typeof StickToBottom.Content
>;

export const ConversationContent = ({
  className,
  ...props
}: ConversationContentProps) => (
  <StickToBottom.Content className={cn('p-4', className)} {...(props as any)} />
);

export type ConversationScrollButtonProps = ComponentProps<typeof Button>;

export const ConversationScrollButton = ({
  className,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  return (
    !isAtBottom && (
      <Button
        className={cn(
          'absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full',
          className
        )}
        onClick={handleScrollToBottom}
        size="icon"
        type="button"
        variant="outline"
        {...(props as any)}
      >
        <ArrowDownIcon className="size-4" />
      </Button>
    )
  );
};
```

---

### Image (ai-image)
**Docs:** https://www.shadcn.io/ai/actions
**Registry:** https://www.shadcn.io/registry/ai.json
**Dependencies:** @radix-ui/react-use-controllable-state, ai, harden-react-markdown, katex, lucide-react, react-markdown, react-syntax-highlighter, rehype-katex, remark-gfm, remark-math, use-stick-to-bottom

```tsx
// File: components/ui/shadcn-io/ai/image.tsx
/**
 * Copyright 2023 Vercel, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { cn } from '@repo/shadcn-ui/lib/utils';
import type { Experimental_GeneratedImage } from 'ai';

export type ImageProps = Experimental_GeneratedImage & {
  className?: string;
  alt?: string;
};

export const Image = ({
  base64,
  uint8Array,
  mediaType,
  ...props
}: ImageProps) => (
  <img
    {...(props as any)}
    alt={props.alt}
    className={cn(
      'h-auto max-w-full overflow-hidden rounded-md',
      props.className
    )}
    src={`data:${mediaType};base64,${base64}`}
  />
);
```

---

### Inline Citation (ai-inline-citation)
**Docs:** https://www.shadcn.io/ai/actions
**Registry:** https://www.shadcn.io/registry/ai.json
**Dependencies:** @radix-ui/react-use-controllable-state, ai, harden-react-markdown, katex, lucide-react, react-markdown, react-syntax-highlighter, rehype-katex, remark-gfm, remark-math, use-stick-to-bottom

```tsx
// File: components/ui/shadcn-io/ai/inline-citation.tsx
/**
 * Copyright 2023 Vercel, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import { Badge } from '@repo/shadcn-ui/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@repo/shadcn-ui/components/ui/carousel';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@repo/shadcn-ui/components/ui/hover-card';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { type ComponentProps, useCallback, useEffect, useState, useRef, createContext, useContext } from 'react';

// Context to share carousel API with child components
const CarouselApiContext = createContext<CarouselApi | undefined>(undefined);

// Hook to access carousel API from the nearest InlineCitationCarousel parent
const useCarouselApi = () => {
  const api = useContext(CarouselApiContext);
  return api;
};

export type InlineCitationProps = ComponentProps<'span'>;

export const InlineCitation = ({
  className,
  ...props
}: InlineCitationProps) => (
  <span
    className={cn('group inline items-center gap-1', className)}
    {...(props as any)}
  />
);

export type InlineCitationTextProps = ComponentProps<'span'>;

export const InlineCitationText = ({
  className,
  ...props
}: InlineCitationTextProps) => (
  <span
    className={cn('transition-colors group-hover:bg-accent', className)}
    {...(props as any)}
  />
);

export type InlineCitationCardProps = ComponentProps<typeof HoverCard>;

export const InlineCitationCard = (props: InlineCitationCardProps) => (
  <HoverCard closeDelay={0} openDelay={0} {...(props as any)} />
);

export type InlineCitationCardTriggerProps = ComponentProps<typeof Badge> & {
  sources: string[];
};

export const InlineCitationCardTrigger = ({
  sources,
  className,
  ...props
}: InlineCitationCardTriggerProps) => (
  <HoverCardTrigger asChild>
    <Badge
      className={cn('ml-1 rounded-full', className)}
      variant="secondary"
      {...(props as any)}
    >
      {sources.length ? (
        <>
          {new URL(sources[0]).hostname}{' '}
          {sources.length > 1 && `+${sources.length - 1}`}
        </>
      ) : (
        'unknown'
      )}
    </Badge>
  </HoverCardTrigger>
);

export type InlineCitationCardBodyProps = ComponentProps<'div'>;

export const InlineCitationCardBody = ({
  className,
  ...props
}: InlineCitationCardBodyProps) => (
  <HoverCardContent className={cn('relative w-80 p-0', className)} {...(props as any)} />
);

export type InlineCitationCarouselProps = ComponentProps<typeof Carousel>;

export const InlineCitationCarousel = ({
  className,
  children,
  ...props
}: InlineCitationCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  
  return (
    <CarouselApiContext.Provider value={api}>
      <Carousel 
        className={cn('w-full', className)} 
        setApi={setApi}
        {...(props as any)} 
      >
        {children}
      </Carousel>
    </CarouselApiContext.Provider>
  );
};

export type InlineCitationCarouselContentProps = ComponentProps<'div'>;

export const InlineCitationCarouselContent = (
  props: InlineCitationCarouselContentProps
) => <CarouselContent {...(props as any)} />;

export type InlineCitationCarouselItemProps = ComponentProps<'div'>;

export const InlineCitationCarouselItem = ({
  className,
  ...props
}: InlineCitationCarouselItemProps) => (
  <CarouselItem className={cn('w-full space-y-2 p-4', className)} {...(props as any)} />
);

export type InlineCitationCarouselHeaderProps = ComponentProps<'div'>;

export const InlineCitationCarouselHeader = ({
  className,
  ...props
}: InlineCitationCarouselHeaderProps) => (
  <div
    className={cn(
      'flex items-center justify-between gap-2 rounded-t-md bg-secondary p-2',
      className
    )}
    {...(props as any)}
  />
);

export type InlineCitationCarouselIndexProps = ComponentProps<'div'>;

export const InlineCitationCarouselIndex = ({
  children,
  className,
  ...props
}: InlineCitationCarouselIndexProps) => {
  const api = useCarouselApi();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div
      className={cn(
        'flex flex-1 items-center justify-end px-3 py-1 text-muted-foreground text-xs',
        className
      )}
      {...(props as any)}
    >
      {children ?? `${current}/${count}`}
    </div>
  );
};

export type InlineCitationCarouselPrevProps = ComponentProps<'button'>;

export const InlineCitationCarouselPrev = ({
  className,
  ...props
}: InlineCitationCarouselPrevProps) => {
  const api = useCarouselApi();

  const handleClick = useCallback(() => {
    if (api) {
      api.scrollPrev();
    }
  }, [api]);

  return (
    <button
      aria-label="Previous"
      className={cn('shrink-0', className)}
      onClick={handleClick}
      type="button"
      {...(props as any)}
    >
      <ArrowLeftIcon className="size-4 text-muted-foreground" />
    </button>
  );
};

export type InlineCitationCarouselNextProps = ComponentProps<'button'>;

export const InlineCitationCarouselNext = ({
  className,
  ...props
}: InlineCitationCarouselNextProps) => {
  const api = useCarouselApi();

  const handleClick = useCallback(() => {
    if (api) {
      api.scrollNext();
    }
  }, [api]);

  return (
    <button
      aria-label="Next"
      className={cn('shrink-0', className)}
      onClick={handleClick}
      type="button"
      {...(props as any)}
    >
      <ArrowRightIcon className="size-4 text-muted-foreground" />
    </button>
  );
};

export type InlineCitationSourceProps = ComponentProps<'div'> & {
  title?: string;
  url?: string;
  description?: string;
};

export const InlineCitationSource = ({
  title,
  url,
  description,
  className,
  children,
  ...props
}: InlineCitationSourceProps) => (
  <div className={cn('space-y-1', className)} {...(props as any)}>
    {title && (
      <h4 className="truncate font-medium text-sm leading-tight">{title}</h4>
    )}
    {url && (
      <p className="truncate break-all text-muted-foreground text-xs">{url}</p>
    )}
    {description && (
      <p className="line-clamp-3 text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    )}
    {children}
  </div>
);

export type InlineCitationQuoteProps = ComponentProps<'blockquote'>;

export const InlineCitationQuote = ({
  children,
  className,
  ...props
}: InlineCitationQuoteProps) => (
  <blockquote
    className={cn(
      'border-muted border-l-2 pl-3 text-muted-foreground text-sm italic',
      className
    )}
    {...(props as any)}
  >
    {children}
  </blockquote>
);
```

---

### Loader (ai-loader)
**Docs:** https://www.shadcn.io/ai/actions
**Registry:** https://www.shadcn.io/registry/ai.json
**Dependencies:** @radix-ui/react-use-controllable-state, ai, harden-react-markdown, katex, lucide-react, react-markdown, react-syntax-highlighter, rehype-katex, remark-gfm, remark-math, use-stick-to-bottom

```tsx
// File: components/ui/shadcn-io/ai/loader.tsx
/**
 * Copyright 2023 Vercel, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { cn } from '@repo/shadcn-ui/lib/utils';
import type { HTMLAttributes } from 'react';

type LoaderIconProps = {
  size?: number;
};

const LoaderIcon = ({ size = 16 }: LoaderIconProps) => (
  <svg
    height={size}
    strokeLinejoin="round"
    style={{ color: 'currentcolor' }}
    viewBox="0 0 16 16"
    width={size}
  >
    <title>Loader</title>
    <g clipPath="url(#clip0_2393_1490)">
      <path d="M8 0V4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 16V12"
        opacity="0.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3.29773 1.52783L5.64887 4.7639"
        opacity="0.9"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12.7023 1.52783L10.3511 4.7639"
        opacity="0.1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12.7023 14.472L10.3511 11.236"
        opacity="0.4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3.29773 14.472L5.64887 11.236"
        opacity="0.6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M15.6085 5.52783L11.8043 6.7639"
        opacity="0.2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M0.391602 10.472L4.19583 9.23598"
        opacity="0.7"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M15.6085 10.4722L11.8043 9.2361"
        opacity="0.3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M0.391602 5.52783L4.19583 6.7639"
        opacity="0.8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </g>
    <defs>
      <clipPath id="clip0_2393_1490">
        <rect fill="white" height="16" width="16" />
      </clipPath>
    </defs>
  </svg>
);

export type LoaderProps = HTMLAttributes<HTMLDivElement> & {
  size?: number;
};

export const Loader = ({ className, size = 16, ...props }: LoaderProps) => (
  <div
    className={cn(
      'inline-flex animate-spin items-center justify-center',
      className
    )}
    {...(props as any)}
  >
    <LoaderIcon size={size} />
  </div>
);
```

---

### Message (ai-message)
**Docs:** https://www.shadcn.io/ai/actions
**Registry:** https://www.shadcn.io/registry/ai.json
**Dependencies:** @radix-ui/react-use-controllable-state, ai, harden-react-markdown, katex, lucide-react, react-markdown, react-syntax-highlighter, rehype-katex, remark-gfm, remark-math, use-stick-to-bottom

```tsx
// File: components/ui/shadcn-io/ai/message.tsx
/**
 * Copyright 2023 Vercel, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/shadcn-ui/components/ui/avatar';
import { cn } from '@repo/shadcn-ui/lib/utils';
import type { UIMessage } from 'ai';
import type { ComponentProps, HTMLAttributes } from 'react';

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage['role'];
};

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      'group flex w-full items-end justify-end gap-2 py-4',
      from === 'user' ? 'is-user' : 'is-assistant flex-row-reverse justify-end',
      '[&>div]:max-w-[80%]',
      className
    )}
    {...(props as any)}
  />
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

export const MessageContent = ({
  children,
  className,
  ...props
}: MessageContentProps) => (
  <div
    className={cn(
      'flex flex-col gap-2 overflow-hidden rounded-lg px-4 py-3 text-foreground text-sm',
      'group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground',
      'group-[.is-assistant]:bg-secondary group-[.is-assistant]:text-foreground',
      className
    )}
    {...(props as any)}
  >
    <div className="is-user:dark">{children}</div>
  </div>
);

export type MessageAvatarProps = ComponentProps<typeof Avatar> & {
  src: string;
  name?: string;
};

export const MessageAvatar = ({
  src,
  name,
  className,
  ...props
}: MessageAvatarProps) => (
  <Avatar
    className={cn('size-8 ring ring-1 ring-border', className)}
    {...(props as any)}
  >
    <AvatarImage alt="" className="mt-0 mb-0" src={src} />
    <AvatarFallback>{name?.slice(0, 2) || 'ME'}</AvatarFallback>
  </Avatar>
);
```

---

### Prompt Input (ai-prompt-input)
**Docs:** https://www.shadcn.io/ai/actions
**Registry:** https://www.shadcn.io/registry/ai.json
**Dependencies:** @radix-ui/react-use-controllable-state, ai, harden-react-markdown, katex, lucide-react, react-markdown, react-syntax-highlighter, rehype-katex, remark-gfm, remark-math, use-stick-to-bottom

```tsx
// File: components/ui/shadcn-io/ai/prompt-input.tsx
/**
 * Copyright 2023 Vercel, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import { Button } from '@repo/shadcn-ui/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/shadcn-ui/components/ui/select';
import { Textarea } from '@repo/shadcn-ui/components/ui/textarea';
import { cn } from '@repo/shadcn-ui/lib/utils';
import type { ChatStatus } from 'ai';
import { Loader2Icon, SendIcon, SquareIcon, XIcon } from 'lucide-react';
import type {
  ComponentProps,
  HTMLAttributes,
  KeyboardEventHandler,
} from 'react';
import { Children } from 'react';

export type PromptInputProps = HTMLAttributes<HTMLFormElement>;

export const PromptInput = ({ className, ...props }: PromptInputProps) => (
  <form
    className={cn(
      'w-full divide-y overflow-hidden rounded-xl border bg-background shadow-sm',
      className
    )}
    {...(props as any)}
  />
);

export type PromptInputTextareaProps = ComponentProps<typeof Textarea> & {
  minHeight?: number;
  maxHeight?: number;
};

export const PromptInputTextarea = ({
  onChange,
  className,
  placeholder = 'What would you like to know?',
  minHeight = 48,
  maxHeight = 164,
  ...props
}: PromptInputTextareaProps) => {
  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow newline
        return;
      }

      // Submit on Enter (without Shift)
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <Textarea
      className={cn(
        'w-full resize-none rounded-none border-none p-3 shadow-none outline-none ring-0',
        'field-sizing-content max-h-[6lh] bg-transparent dark:bg-transparent',
        'focus-visible:ring-0',
        className
      )}
      name="message"
      onChange={(e) => {
        onChange?.(e);
      }}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      {...(props as any)}
    />
  );
};

export type PromptInputToolbarProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputToolbar = ({
  className,
  ...props
}: PromptInputToolbarProps) => (
  <div
    className={cn('flex items-center justify-between p-1', className)}
    {...(props as any)}
  />
);

export type PromptInputToolsProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputTools = ({
  className,
  ...props
}: PromptInputToolsProps) => (
  <div
    className={cn(
      'flex items-center gap-1',
      '[&_button:first-child]:rounded-bl-xl',
      className
    )}
    {...(props as any)}
  />
);

export type PromptInputButtonProps = ComponentProps<typeof Button>;

export const PromptInputButton = ({
  variant = 'ghost',
  className,
  size,
  ...props
}: PromptInputButtonProps) => {
  const newSize =
    (size ?? Children.count(props.children) > 1) ? 'default' : 'icon';

  return (
    <Button
      className={cn(
        'shrink-0 gap-1.5 rounded-lg',
        variant === 'ghost' && 'text-muted-foreground',
        newSize === 'default' && 'px-3',
        className
      )}
      size={newSize}
      type="button"
      variant={variant}
      {...(props as any)}
    />
  );
};

export type PromptInputSubmitProps = ComponentProps<typeof Button> & {
  status?: ChatStatus;
};

export const PromptInputSubmit = ({
  className,
  variant = 'default',
  size = 'icon',
  status,
  children,
  ...props
}: PromptInputSubmitProps) => {
  let Icon = <SendIcon className="size-4" />;

  if (status === 'submitted') {
    Icon = <Loader2Icon className="size-4 animate-spin" />;
  } else if (status === 'streaming') {
    Icon = <SquareIcon className="size-4" />;
  } else if (status === 'error') {
    Icon = <XIcon className="size-4" />;
  }

  return (
    <Button
      className={cn('gap-1.5 rounded-lg', className)}
      size={size}
      type="submit"
      variant={variant}
      {...(props as any)}
    >
      {children ?? Icon}
    </Button>
  );
};

export type PromptInputModelSelectProps = ComponentProps<typeof Select>;

export const PromptInputModelSelect = (props: PromptInputModelSelectProps) => (
  <Select {...(props as any)} />
);

export type PromptInputModelSelectTriggerProps = ComponentProps<
  typeof SelectTrigger
>;

export const PromptInputModelSelectTrigger = ({
  className,
  ...props
}: PromptInputModelSelectTriggerProps) => (
  <SelectTrigger
    className={cn(
      'border-none bg-transparent font-medium text-muted-foreground shadow-none transition-colors',
      'hover:bg-accent hover:text-foreground [&[aria-expanded="true"]]:bg-accent [&[aria-expanded="true"]]:text-foreground',
      className
    )}
    {...(props as any)}
  />
);

export type PromptInputModelSelectContentProps = ComponentProps<
  typeof SelectContent
>;

export const PromptInputModelSelectContent = ({
  className,
  ...props
}: PromptInputModelSelectContentProps) => (
  <SelectContent className={cn(className)} {...(props as any)} />
);

export type PromptInputModelSelectItemProps = ComponentProps<typeof SelectItem>;

export const PromptInputModelSelectItem = ({
  className,
  ...props
}: PromptInputModelSelectItemProps) => (
  <SelectItem className={cn(className)} {...(props as any)} />
);

export type PromptInputModelSelectValueProps = ComponentProps<
  typeof SelectValue
>;

export const PromptInputModelSelectValue = ({
  className,
  ...props
}: PromptInputModelSelectValueProps) => (
  <SelectValue className={cn(className)} {...(props as any)} />
);
```

---

### Reasoning (ai-reasoning)
**Docs:** https://www.shadcn.io/ai/actions
**Registry:** https://www.shadcn.io/registry/ai.json
**Dependencies:** @radix-ui/react-use-controllable-state, ai, harden-react-markdown, katex, lucide-react, react-markdown, react-syntax-highlighter, rehype-katex, remark-gfm, remark-math, use-stick-to-bottom

```tsx
// File: components/ui/shadcn-io/ai/reasoning.tsx
/**
 * Copyright 2023 Vercel, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import { useControllableState } from '@radix-ui/react-use-controllable-state';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/shadcn-ui/components/ui/collapsible';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { BrainIcon, ChevronDownIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { createContext, memo, useContext, useEffect, useState } from 'react';
import { Response } from './response';

type ReasoningContextValue = {
  isStreaming: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  duration: number;
};

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

const useReasoning = () => {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error('Reasoning components must be used within Reasoning');
  }
  return context;
};

export type ReasoningProps = ComponentProps<typeof Collapsible> & {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
};

const AUTO_CLOSE_DELAY = 1000;

export const Reasoning = memo(
  ({
    className,
    isStreaming = false,
    open,
    defaultOpen = false,
    onOpenChange,
    duration: durationProp,
    children,
    ...props
  }: ReasoningProps) => {
    const [isOpen, setIsOpen] = useControllableState({
      prop: open,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    });
    const [duration, setDuration] = useControllableState({
      prop: durationProp,
      defaultProp: 0,
    });

    const [hasAutoClosedRef, setHasAutoClosedRef] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);

    // Track duration when streaming starts and ends
    useEffect(() => {
      if (isStreaming) {
        if (startTime === null) {
          setStartTime(Date.now());
        }
      } else if (startTime !== null) {
        setDuration(Math.round((Date.now() - startTime) / 1000));
        setStartTime(null);
      }
    }, [isStreaming, startTime, setDuration]);

    // Auto-open when streaming starts, auto-close when streaming ends (once only)
    useEffect(() => {
      if (isStreaming && !isOpen) {
        setIsOpen(true);
      } else if (!isStreaming && isOpen && !defaultOpen && !hasAutoClosedRef) {
        // Add a small delay before closing to allow user to see the content
        const timer = setTimeout(() => {
          setIsOpen(false);
          setHasAutoClosedRef(true);
        }, AUTO_CLOSE_DELAY);
        return () => clearTimeout(timer);
      }
    }, [isStreaming, isOpen, defaultOpen, setIsOpen, hasAutoClosedRef]);

    const handleOpenChange = (newOpen: boolean) => {
      setIsOpen(newOpen);
    };

    return (
      <ReasoningContext.Provider
        value={{ isStreaming, isOpen, setIsOpen, duration }}
      >
        <Collapsible
          className={cn('not-prose mb-4', className)}
          onOpenChange={handleOpenChange}
          open={isOpen}
          {...(props as any)}
        >
          {children}
        </Collapsible>
      </ReasoningContext.Provider>
    );
  }
);

export type ReasoningTriggerProps = ComponentProps<
  typeof CollapsibleTrigger
> & {
  title?: string;
};

export const ReasoningTrigger = memo(
  ({
    className,
    title = 'Reasoning',
    children,
    ...props
  }: ReasoningTriggerProps) => {
    const { isStreaming, isOpen, duration } = useReasoning();

    return (
      <CollapsibleTrigger
        className={cn(
          'flex items-center gap-2 text-muted-foreground text-sm',
          className
        )}
        {...(props as any)}
      >
        {children ?? (
          <>
            <BrainIcon className="size-4" />
            {isStreaming || duration === 0 ? (
              <p>Thinking...</p>
            ) : (
              <p>Thought for {duration} seconds</p>
            )}
            <ChevronDownIcon
              className={cn(
                'size-4 text-muted-foreground transition-transform',
                isOpen ? 'rotate-180' : 'rotate-0'
              )}
            />
          </>
        )}
      </CollapsibleTrigger>
    );
  }
);

export type ReasoningContentProps = ComponentProps<
  typeof CollapsibleContent
> & {
  children: string;
};

export const ReasoningContent = memo(
  ({ className, children, ...props }: ReasoningContentProps) => (
    <CollapsibleContent
      className={cn(
        'mt-4 text-sm',
        'data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in',
        className
      )}
      {...(props as any)}
    >
      <Response className="grid gap-2">{children}</Response>
    </CollapsibleContent>
  )
);

Reasoning.displayName = 'Reasoning';
ReasoningTrigger.displayName = 'ReasoningTrigger';
ReasoningContent.displayName = 'ReasoningContent';
```

---

### Response (ai-response)
**Docs:** https://www.shadcn.io/ai/actions
**Registry:** https://www.shadcn.io/registry/ai.json
**Dependencies:** @radix-ui/react-use-controllable-state, ai, harden-react-markdown, katex, lucide-react, react-markdown, react-syntax-highlighter, rehype-katex, remark-gfm, remark-math, use-stick-to-bottom

```tsx
// File: components/ui/shadcn-io/ai/response.tsx
/**
 * Copyright 2023 Vercel, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import { cn } from '@repo/shadcn-ui/lib/utils';
import type { ComponentProps, HTMLAttributes } from 'react';
import { isValidElement, memo } from 'react';
import ReactMarkdown, { type Options } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { CodeBlock, CodeBlockCopyButton } from './code-block';
import 'katex/dist/katex.min.css';
import hardenReactMarkdown from 'harden-react-markdown';


/**
 * Parses markdown text and removes incomplete tokens to prevent partial rendering
 * of links, images, bold, and italic formatting during streaming.
 */
function parseIncompleteMarkdown(text: string): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let result = text;

  // Handle incomplete links and images
  // Pattern: [...] or ![...] where the closing ] is missing
  const linkImagePattern = /(!?\[)([^\]]*?)$/;
  const linkMatch = result.match(linkImagePattern);
  if (linkMatch) {
    // If we have an unterminated [ or ![, remove it and everything after
    const startIndex = result.lastIndexOf(linkMatch[1]);
    result = result.substring(0, startIndex);
  }

  // Handle incomplete bold formatting (**)
  const boldPattern = /(\*\*)([^*]*?)$/;
  const boldMatch = result.match(boldPattern);
  if (boldMatch) {
    // Count the number of ** in the entire string
    const asteriskPairs = (result.match(/\*\*/g) || []).length;
    // If odd number of **, we have an incomplete bold - complete it
    if (asteriskPairs % 2 === 1) {
      result = `${result}**`;
    }
  }

  // Handle incomplete italic formatting (__)
  const italicPattern = /(__)([^_]*?)$/;
  const italicMatch = result.match(italicPattern);
  if (italicMatch) {
    // Count the number of __ in the entire string
    const underscorePairs = (result.match(/__/g) || []).length;
    // If odd number of __, we have an incomplete italic - complete it
    if (underscorePairs % 2 === 1) {
      result = `${result}__`;
    }
  }

  // Handle incomplete single asterisk italic (*)
  const singleAsteriskPattern = /(\*)([^*]*?)$/;
  const singleAsteriskMatch = result.match(singleAsteriskPattern);
  if (singleAsteriskMatch) {
    // Count single asterisks that aren't part of **
    const singleAsterisks = result.split('').reduce((acc, char, index) => {
      if (char === '*') {
        // Check if it's part of a ** pair
        const prevChar = result[index - 1];
        const nextChar = result[index + 1];
        if (prevChar !== '*' && nextChar !== '*') {
          return acc + 1;
        }
      }
      return acc;
    }, 0);

    // If odd number of single *, we have an incomplete italic - complete it
    if (singleAsterisks % 2 === 1) {
      result = `${result}*`;
    }
  }

  // Handle incomplete single underscore italic (_)
  const singleUnderscorePattern = /(_)([^_]*?)$/;
  const singleUnderscoreMatch = result.match(singleUnderscorePattern);
  if (singleUnderscoreMatch) {
    // Count single underscores that aren't part of __
    const singleUnderscores = result.split('').reduce((acc, char, index) => {
      if (char === '_') {
        // Check if it's part of a __ pair
        const prevChar = result[index - 1];
        const nextChar = result[index + 1];
        if (prevChar !== '_' && nextChar !== '_') {
          return acc + 1;
        }
      }
      return acc;
    }, 0);

    // If odd number of single _, we have an incomplete italic - complete it
    if (singleUnderscores % 2 === 1) {
      result = `${result}_`;
    }
  }

  // Handle incomplete inline code blocks (`) - but avoid code blocks (```)
  const inlineCodePattern = /(`)([^`]*?)$/;
  const inlineCodeMatch = result.match(inlineCodePattern);
  if (inlineCodeMatch) {
    // Check if we're dealing with a code block (triple backticks)
    const hasCodeBlockStart = result.includes('```');
    const codeBlockPattern = /```[\s\S]*?```/g;
    const completeCodeBlocks = (result.match(codeBlockPattern) || []).length;
    const allTripleBackticks = (result.match(/```/g) || []).length;

    // If we have an odd number of ``` sequences, we're inside an incomplete code block
    // In this case, don't complete inline code
    const insideIncompleteCodeBlock = allTripleBackticks % 2 === 1;

    if (!insideIncompleteCodeBlock) {
      // Count the number of single backticks that are NOT part of triple backticks
      let singleBacktickCount = 0;
      for (let i = 0; i < result.length; i++) {
        if (result[i] === '`') {
          // Check if this backtick is part of a triple backtick sequence
          const isTripleStart = result.substring(i, i + 3) === '```';
          const isTripleMiddle =
            i > 0 && result.substring(i - 1, i + 2) === '```';
          const isTripleEnd = i > 1 && result.substring(i - 2, i + 1) === '```';

          if (!(isTripleStart || isTripleMiddle || isTripleEnd)) {
            singleBacktickCount++;
          }
        }
      }

      // If odd number of single backticks, we have an incomplete inline code - complete it
      if (singleBacktickCount % 2 === 1) {
        result = `${result}\``;
      }
    }
  }

  // Handle incomplete strikethrough formatting (~~)
  const strikethroughPattern = /(~~)([^~]*?)$/;
  const strikethroughMatch = result.match(strikethroughPattern);
  if (strikethroughMatch) {
    // Count the number of ~~ in the entire string
    const tildePairs = (result.match(/~~/g) || []).length;
    // If odd number of ~~, we have an incomplete strikethrough - complete it
    if (tildePairs % 2 === 1) {
      result = `${result}~~`;
    }
  }

  return result;
}

// Create a hardened version of ReactMarkdown
const HardenedMarkdown = hardenReactMarkdown(ReactMarkdown);

export type ResponseProps = HTMLAttributes<HTMLDivElement> & {
  options?: Options;
  children: Options['children'];
  allowedImagePrefixes?: ComponentProps<
    ReturnType<typeof hardenReactMarkdown>
  >['allowedImagePrefixes'];
  allowedLinkPrefixes?: ComponentProps<
    ReturnType<typeof hardenReactMarkdown>
  >['allowedLinkPrefixes'];
  defaultOrigin?: ComponentProps<
    ReturnType<typeof hardenReactMarkdown>
  >['defaultOrigin'];
  parseIncompleteMarkdown?: boolean;
};

const components: Options['components'] = {
  ol: ({ node, children, className, ...props }) => (
    <ol className={cn('ml-4 list-outside list-decimal', className)} {...(props as any)}>
      {children}
    </ol>
  ),
  li: ({ node, children, className, ...props }) => (
    <li className={cn('py-1', className)} {...(props as any)}>
      {children}
    </li>
  ),
  ul: ({ node, children, className, ...props }) => (
    <ul className={cn('ml-4 list-outside list-disc', className)} {...(props as any)}>
      {children}
    </ul>
  ),
  hr: ({ node, className, ...props }) => (
    <hr className={cn('my-6 border-border', className)} {...(props as any)} />
  ),
  strong: ({ node, children, className, ...props }) => (
    <span className={cn('font-semibold', className)} {...(props as any)}>
      {children}
    </span>
  ),
  a: ({ node, children, className, ...props }) => (
    <a
      className={cn('font-medium text-primary underline', className)}
      rel="noreferrer"
      target="_blank"
      {...(props as any)}
    >
      {children}
    </a>
  ),
  h1: ({ node, children, className, ...props }) => (
    <h1
      className={cn('mt-6 mb-2 font-semibold text-3xl', className)}
      {...(props as any)}
    >
      {children}
    </h1>
  ),
  h2: ({ node, children, className, ...props }) => (
    <h2
      className={cn('mt-6 mb-2 font-semibold text-2xl', className)}
      {...(props as any)}
    >
      {children}
    </h2>
  ),
  h3: ({ node, children, className, ...props }) => (
    <h3 className={cn('mt-6 mb-2 font-semibold text-xl', className)} {...(props as any)}>
      {children}
    </h3>
  ),
  h4: ({ node, children, className, ...props }) => (
    <h4 className={cn('mt-6 mb-2 font-semibold text-lg', className)} {...(props as any)}>
      {children}
    </h4>
  ),
  h5: ({ node, children, className, ...props }) => (
    <h5
      className={cn('mt-6 mb-2 font-semibold text-base', className)}
      {...(props as any)}
    >
      {children}
    </h5>
  ),
  h6: ({ node, children, className, ...props }) => (
    <h6 className={cn('mt-6 mb-2 font-semibold text-sm', className)} {...(props as any)}>
      {children}
    </h6>
  ),
  table: ({ node, children, className, ...props }) => (
    <div className="my-4 overflow-x-auto">
      <table
        className={cn('w-full border-collapse border border-border', className)}
        {...(props as any)}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ node, children, className, ...props }) => (
    <thead className={cn('bg-muted/50', className)} {...(props as any)}>
      {children}
    </thead>
  ),
  tbody: ({ node, children, className, ...props }) => (
    <tbody className={cn('divide-y divide-border', className)} {...(props as any)}>
      {children}
    </tbody>
  ),
  tr: ({ node, children, className, ...props }) => (
    <tr className={cn('border-border border-b', className)} {...(props as any)}>
      {children}
    </tr>
  ),
  th: ({ node, children, className, ...props }) => (
    <th
      className={cn('px-4 py-2 text-left font-semibold text-sm', className)}
      {...(props as any)}
    >
      {children}
    </th>
  ),
  td: ({ node, children, className, ...props }) => (
    <td className={cn('px-4 py-2 text-sm', className)} {...(props as any)}>
      {children}
    </td>
  ),
  blockquote: ({ node, children, className, ...props }) => (
    <blockquote
      className={cn(
        'my-4 border-muted-foreground/30 border-l-4 pl-4 text-muted-foreground italic',
        className
      )}
      {...(props as any)}
    >
      {children}
    </blockquote>
  ),
  code: ({ node, className, ...props }) => {
    const inline = node?.position?.start.line === node?.position?.end.line;

    if (!inline) {
      return <code className={className} {...(props as any)} />;
    }

    return (
      <code
        className={cn(
          'rounded bg-muted px-1.5 py-0.5 font-mono text-sm',
          className
        )}
        {...(props as any)}
      />
    );
  },
  pre: ({ node, className, children }) => {
    let language = 'javascript';

    if (typeof node?.properties?.className === 'string') {
      language = node.properties.className.replace('language-', '');
    }

    // Extract code content from children safely
    let code = '';
    if (
      isValidElement(children) &&
      children.props &&
      typeof (children.props as any).children === 'string'
    ) {
      code = (children.props as any).children;
    } else if (typeof children === 'string') {
      code = children;
    }

    return (
      <CodeBlock
        className={cn('my-4 h-auto', className)}
        code={code}
        language={language}
      >
        <CodeBlockCopyButton
          onCopy={() => console.log('Copied code to clipboard')}
          onError={() => console.error('Failed to copy code to clipboard')}
        />
      </CodeBlock>
    );
  },
};

export const Response = memo(
  ({
    className,
    options,
    children,
    allowedImagePrefixes,
    allowedLinkPrefixes,
    defaultOrigin,
    parseIncompleteMarkdown: shouldParseIncompleteMarkdown = true,
    ...props
  }: ResponseProps) => {
    // Parse the children to remove incomplete markdown tokens if enabled
    const parsedChildren =
      typeof children === 'string' && shouldParseIncompleteMarkdown
        ? parseIncompleteMarkdown(children)
        : children;

    return (
      <div
        className={cn(
          'size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
          className
        )}
        {...(props as any)}
      >
        <HardenedMarkdown
          allowedImagePrefixes={allowedImagePrefixes ?? ['*']}
          allowedLinkPrefixes={allowedLinkPrefixes ?? ['*']}
          components={components}
          defaultOrigin={defaultOrigin}
          rehypePlugins={[rehypeKatex]}
          remarkPlugins={[remarkGfm, remarkMath]}
          {...options}
        >
          {parsedChildren}
        </HardenedMarkdown>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = 'Response';
```

---

### Source (ai-source)
**Docs:** https://www.shadcn.io/ai/actions
**Registry:** https://www.shadcn.io/registry/ai.json
**Dependencies:** @radix-ui/react-use-controllable-state, ai, harden-react-markdown, katex, lucide-react, react-markdown, react-syntax-highlighter, rehype-katex, remark-gfm, remark-math, use-stick-to-bottom

```tsx
// File: components/ui/shadcn-io/ai/source.tsx
/**
 * Copyright 2023 Vercel, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/shadcn-ui/components/ui/collapsible';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { BookIcon, ChevronDownIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

export type SourcesProps = ComponentProps<'div'>;

export const Sources = ({ className, ...props }: SourcesProps) => (
  <Collapsible
    className={cn('not-prose mb-4 text-primary text-xs', className)}
    {...(props as any)}
  />
);

export type SourcesTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  count: number;
};

export const SourcesTrigger = ({
  className,
  count,
  children,
  ...props
}: SourcesTriggerProps) => (
  <CollapsibleTrigger className="flex items-center gap-2" {...(props as any)}>
    {children ?? (
      <>
        <p className="font-medium">Used {count} sources</p>
        <ChevronDownIcon className="h-4 w-4" />
      </>
    )}
  </CollapsibleTrigger>
);

export type SourcesContentProps = ComponentProps<typeof CollapsibleContent>;

export const SourcesContent = ({
  className,
  ...props
}: SourcesContentProps) => (
  <CollapsibleContent
    className={cn(
      'mt-3 flex w-fit flex-col gap-2',
      'data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in',
      className
    )}
    {...(props as any)}
  />
);

export type SourceProps = ComponentProps<'a'>;

export const Source = ({ href, title, children, ...props }: SourceProps) => (
  <a
    className="flex items-center gap-2"
    href={href}
    rel="noreferrer"
    target="_blank"
    {...(props as any)}
  >
    {children ?? (
      <>
        <BookIcon className="h-4 w-4" />
        <span className="block font-medium">{title}</span>
      </>
    )}
  </a>
);
```

---

### Suggestion (ai-suggestion)
**Docs:** https://www.shadcn.io/ai/actions
**Registry:** https://www.shadcn.io/registry/ai.json
**Dependencies:** @radix-ui/react-use-controllable-state, ai, harden-react-markdown, katex, lucide-react, react-markdown, react-syntax-highlighter, rehype-katex, remark-gfm, remark-math, use-stick-to-bottom

```tsx
// File: components/ui/shadcn-io/ai/suggestion.tsx
/**
 * Copyright 2023 Vercel, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import { Button } from '@repo/shadcn-ui/components/ui/button';
import {
  ScrollArea,
  ScrollBar,
} from '@repo/shadcn-ui/components/ui/scroll-area';
import { cn } from '@repo/shadcn-ui/lib/utils';
import type { ComponentProps } from 'react';

export type SuggestionsProps = ComponentProps<typeof ScrollArea>;

export const Suggestions = ({
  className,
  children,
  ...props
}: SuggestionsProps) => (
  <ScrollArea className="w-full overflow-x-auto whitespace-nowrap" {...(props as any)}>
    <div className={cn('flex w-max flex-nowrap items-center gap-2', className)}>
      {children}
    </div>
    <ScrollBar className="hidden" orientation="horizontal" />
  </ScrollArea>
);

export type SuggestionProps = Omit<ComponentProps<typeof Button>, 'onClick'> & {
  suggestion: string;
  onClick?: (suggestion: string) => void;
};

export const Suggestion = ({
  suggestion,
  onClick,
  className,
  variant = 'outline',
  size = 'sm',
  children,
  ...props
}: SuggestionProps) => {
  const handleClick = () => {
    onClick?.(suggestion);
  };

  return (
    <Button
      className={cn('cursor-pointer rounded-full px-4', className)}
      onClick={handleClick}
      size={size}
      type="button"
      variant={variant}
      {...(props as any)}
    >
      {children || suggestion}
    </Button>
  );
};
```

---

### Task (ai-task)
**Docs:** https://www.shadcn.io/ai/actions
**Registry:** https://www.shadcn.io/registry/ai.json
**Dependencies:** @radix-ui/react-use-controllable-state, ai, harden-react-markdown, katex, lucide-react, react-markdown, react-syntax-highlighter, rehype-katex, remark-gfm, remark-math, use-stick-to-bottom

```tsx
// File: components/ui/shadcn-io/ai/task.tsx
/**
 * Copyright 2023 Vercel, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/shadcn-ui/components/ui/collapsible';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { ChevronDownIcon, SearchIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

export type TaskItemFileProps = ComponentProps<'div'>;

export const TaskItemFile = ({
  children,
  className,
  ...props
}: TaskItemFileProps) => (
  <div
    className={cn(
      'inline-flex items-center gap-1 rounded-md border bg-secondary px-1.5 py-0.5 text-foreground text-xs',
      className
    )}
    {...(props as any)}
  >
    {children}
  </div>
);

export type TaskItemProps = ComponentProps<'div'>;

export const TaskItem = ({ children, className, ...props }: TaskItemProps) => (
  <div className={cn('text-muted-foreground text-sm', className)} {...(props as any)}>
    {children}
  </div>
);

export type TaskProps = ComponentProps<typeof Collapsible>;

export const Task = ({
  defaultOpen = true,
  className,
  ...props
}: TaskProps) => (
  <Collapsible
    className={cn(
      'data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 data-[state=closed]:animate-out data-[state=open]:animate-in',
      className
    )}
    defaultOpen={defaultOpen}
    {...(props as any)}
  />
);

export type TaskTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  title: string;
};

export const TaskTrigger = ({
  children,
  className,
  title,
  ...props
}: TaskTriggerProps) => (
  <CollapsibleTrigger asChild className={cn('group', className)} {...(props as any)}>
    {children ?? (
      <div className="flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground">
        <SearchIcon className="size-4" />
        <p className="text-sm">{title}</p>
        <ChevronDownIcon className="size-4 transition-transform group-data-[state=open]:rotate-180" />
      </div>
    )}
  </CollapsibleTrigger>
);

export type TaskContentProps = ComponentProps<typeof CollapsibleContent>;

export const TaskContent = ({
  children,
  className,
  ...props
}: TaskContentProps) => (
  <CollapsibleContent
    className={cn(
      'data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in',
      className
    )}
    {...(props as any)}
  >
    <div className="mt-4 space-y-2 border-muted border-l-2 pl-4">
      {children}
    </div>
  </CollapsibleContent>
);
```

---

### Tool (ai-tool)
**Docs:** https://www.shadcn.io/ai/actions
**Registry:** https://www.shadcn.io/registry/ai.json
**Dependencies:** @radix-ui/react-use-controllable-state, ai, harden-react-markdown, katex, lucide-react, react-markdown, react-syntax-highlighter, rehype-katex, remark-gfm, remark-math, use-stick-to-bottom

```tsx
// File: components/ui/shadcn-io/ai/tool.tsx
/**
 * Copyright 2023 Vercel, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import { Badge } from '@repo/shadcn-ui/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/shadcn-ui/components/ui/collapsible';
import { cn } from '@repo/shadcn-ui/lib/utils';
import type { ToolUIPart } from 'ai';
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CircleIcon,
  ClockIcon,
  WrenchIcon,
  XCircleIcon,
} from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { CodeBlock } from './code-block';

export type ToolProps = ComponentProps<typeof Collapsible>;

export const Tool = ({ className, ...props }: ToolProps) => (
  <Collapsible
    className={cn('not-prose mb-4 w-full rounded-md border', className)}
    {...(props as any)}
  />
);

export type ToolHeaderProps = {
  type: ToolUIPart['type'];
  state: ToolUIPart['state'];
  className?: string;
};

const getStatusBadge = (status: ToolUIPart['state']) => {
  const labels = {
    'input-streaming': 'Pending',
    'input-available': 'Running',
    'output-available': 'Completed',
    'output-error': 'Error',
  } as const;

  const icons = {
    'input-streaming': <CircleIcon className="size-4" />,
    'input-available': <ClockIcon className="size-4 animate-pulse" />,
    'output-available': <CheckCircleIcon className="size-4 text-green-600" />,
    'output-error': <XCircleIcon className="size-4 text-red-600" />,
  } as const;

  return (
    <Badge className="rounded-full text-xs" variant="secondary">
      {icons[status]}
      {labels[status]}
    </Badge>
  );
};

export const ToolHeader = ({
  className,
  type,
  state,
  ...props
}: ToolHeaderProps) => (
  <CollapsibleTrigger
    className={cn(
      'flex w-full items-center justify-between gap-4 p-3',
      className
    )}
    {...(props as any)}
  >
    <div className="flex items-center gap-2">
      <WrenchIcon className="size-4 text-muted-foreground" />
      <span className="font-medium text-sm">{type}</span>
      {getStatusBadge(state)}
    </div>
    <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
  </CollapsibleTrigger>
);

export type ToolContentProps = ComponentProps<typeof CollapsibleContent>;

export const ToolContent = ({ className, ...props }: ToolContentProps) => (
  <CollapsibleContent
    className={cn(
      'data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in',
      className
    )}
    {...(props as any)}
  />
);

export type ToolInputProps = ComponentProps<'div'> & {
  input: ToolUIPart['input'];
};

export const ToolInput = ({ className, input, ...props }: ToolInputProps) => (
  <div className={cn('space-y-2 overflow-hidden p-4', className)} {...(props as any)}>
    <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
      Parameters
    </h4>
    <div className="rounded-md bg-muted/50">
      <CodeBlock code={JSON.stringify(input, null, 2)} language="json" />
    </div>
  </div>
);

export type ToolOutputProps = ComponentProps<'div'> & {
  output: ReactNode;
  errorText: ToolUIPart['errorText'];
};

export const ToolOutput = ({
  className,
  output,
  errorText,
  ...props
}: ToolOutputProps) => {
  if (!(output || errorText)) {
    return null;
  }

  return (
    <div className={cn('space-y-2 p-4', className)} {...(props as any)}>
      <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {errorText ? 'Error' : 'Result'}
      </h4>
      <div
        className={cn(
          'overflow-x-auto rounded-md text-xs [&_table]:w-full',
          errorText
            ? 'bg-destructive/10 text-destructive'
            : 'bg-muted/50 text-foreground'
        )}
      >
        {errorText && <div>{errorText}</div>}
        {output && <div>{output}</div>}
      </div>
    </div>
  );
};
```

---

### Web Preview (ai-web-preview)
**Docs:** https://www.shadcn.io/ai/actions
**Registry:** https://www.shadcn.io/registry/ai.json
**Dependencies:** @radix-ui/react-use-controllable-state, ai, harden-react-markdown, katex, lucide-react, react-markdown, react-syntax-highlighter, rehype-katex, remark-gfm, remark-math, use-stick-to-bottom

```tsx
// File: components/ui/shadcn-io/ai/web-preview.tsx
/**
 * Copyright 2023 Vercel, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use client';

import { Button } from '@repo/shadcn-ui/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/shadcn-ui/components/ui/collapsible';
import { Input } from '@repo/shadcn-ui/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/shadcn-ui/components/ui/tooltip';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { ChevronDownIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

export type WebPreviewContextValue = {
  url: string;
  setUrl: (url: string) => void;
  consoleOpen: boolean;
  setConsoleOpen: (open: boolean) => void;
};

const WebPreviewContext = createContext<WebPreviewContextValue | null>(null);

const useWebPreview = () => {
  const context = useContext(WebPreviewContext);
  if (!context) {
    throw new Error('WebPreview components must be used within a WebPreview');
  }
  return context;
};

export type WebPreviewProps = ComponentProps<'div'> & {
  defaultUrl?: string;
  onUrlChange?: (url: string) => void;
};

export const WebPreview = ({
  className,
  children,
  defaultUrl = '',
  onUrlChange,
  ...props
}: WebPreviewProps) => {
  const [url, setUrl] = useState(defaultUrl);
  const [consoleOpen, setConsoleOpen] = useState(false);

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    onUrlChange?.(newUrl);
  };

  const contextValue: WebPreviewContextValue = {
    url,
    setUrl: handleUrlChange,
    consoleOpen,
    setConsoleOpen,
  };

  return (
    <WebPreviewContext.Provider value={contextValue}>
      <div
        className={cn(
          'flex size-full flex-col rounded-lg border bg-card',
          className
        )}
        {...(props as any)}
      >
        {children}
      </div>
    </WebPreviewContext.Provider>
  );
};

export type WebPreviewNavigationProps = ComponentProps<'div'>;

export const WebPreviewNavigation = ({
  className,
  children,
  ...props
}: WebPreviewNavigationProps) => (
  <div
    className={cn('flex items-center gap-1 border-b p-2', className)}
    {...(props as any)}
  >
    {children}
  </div>
);

export type WebPreviewNavigationButtonProps = ComponentProps<typeof Button> & {
  tooltip?: string;
};

export const WebPreviewNavigationButton = ({
  onClick,
  disabled,
  tooltip,
  children,
  ...props
}: WebPreviewNavigationButtonProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="h-8 w-8 p-0 hover:text-foreground"
          disabled={disabled}
          onClick={onClick}
          size="sm"
          variant="ghost"
          {...(props as any)}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export type WebPreviewUrlProps = ComponentProps<typeof Input>;

export const WebPreviewUrl = ({
  value,
  onChange,
  onKeyDown,
  ...props
}: WebPreviewUrlProps) => {
  const { url, setUrl } = useWebPreview();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const target = event.target as HTMLInputElement;
      setUrl(target.value);
    }
    onKeyDown?.(event);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
  };

  // Use defaultValue for uncontrolled input when no onChange is provided
  if (!onChange && !value) {
    return (
      <Input
        className="h-8 flex-1 text-sm"
        defaultValue={url}
        onKeyDown={handleKeyDown}
        placeholder="Enter URL..."
        {...(props as any)}
      />
    );
  }

  return (
    <Input
      className="h-8 flex-1 text-sm"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Enter URL..."
      value={value ?? url}
      {...(props as any)}
    />
  );
};

export type WebPreviewBodyProps = ComponentProps<'iframe'> & {
  loading?: ReactNode;
};

export const WebPreviewBody = ({
  className,
  loading,
  src,
  ...props
}: WebPreviewBodyProps) => {
  const { url } = useWebPreview();

  return (
    <div className="flex-1">
      <iframe
        className={cn('size-full', className)}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
        src={(src ?? url) || undefined}
        title="Preview"
        {...(props as any)}
      />
      {loading}
    </div>
  );
};

export type WebPreviewConsoleProps = ComponentProps<'div'> & {
  logs?: Array<{
    level: 'log' | 'warn' | 'error';
    message: string;
    timestamp: Date;
  }>;
};

export const WebPreviewConsole = ({
  className,
  logs = [],
  children,
  ...props
}: WebPreviewConsoleProps) => {
  const { consoleOpen, setConsoleOpen } = useWebPreview();

  return (
    <Collapsible
      className={cn('border-t bg-muted/50 font-mono text-sm', className)}
      onOpenChange={setConsoleOpen}
      open={consoleOpen}
      {...(props as any)}
    >
      <CollapsibleTrigger asChild>
        <Button
          className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-muted/50"
          variant="ghost"
        >
          Console
          <ChevronDownIcon
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              consoleOpen && 'rotate-180'
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent
        className={cn(
          'px-4 pb-4',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in'
        )}
      >
        <div className="max-h-48 space-y-1 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-muted-foreground">No console output</p>
          ) : (
            logs.map((log, index) => (
              <div
                className={cn(
                  'text-xs',
                  log.level === 'error' && 'text-destructive',
                  log.level === 'warn' && 'text-yellow-600',
                  log.level === 'log' && 'text-foreground'
                )}
                key={`${log.timestamp.getTime()}-${index}`}
              >
                <span className="text-muted-foreground">
                  {log.timestamp.toLocaleTimeString()}
                </span>{' '}
                {log.message}
              </div>
            ))
          )}
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
```

---

## button

### Animated Modal (animated-modal)
**Docs:** https://www.shadcn.io/button/animated-modal
**Registry:** https://www.shadcn.io/registry/animated-modal.json
**Dependencies:** framer-motion

```tsx
// File: components/ui/shadcn-io/animated-modal/index.tsx
"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useOnClickOutside } from "@repo/use-on-click-outside";

interface ModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export function Modal({ children }: { children: ReactNode }) {
  return <ModalProvider>{children}</ModalProvider>;
}

export const ModalTrigger = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { setOpen } = useModal();
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md text-black dark:text-white text-center relative overflow-hidden",
        className
      )}
      onClick={() => setOpen(true)}
    >
      {children}
    </button>
  );
};

export const ModalBody = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { open } = useModal();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  const modalRef = useRef<HTMLDivElement>(null);
  const { setOpen } = useModal();
  useOnClickOutside(modalRef as React.RefObject<HTMLElement>, () => setOpen(false));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            backdropFilter: "blur(10px)",
          }}
          exit={{
            opacity: 0,
            backdropFilter: "blur(0px)",
          }}
          className="fixed [perspective:800px] [transform-style:preserve-3d] inset-0 h-full w-full  flex items-center justify-center z-50"
        >
          <Overlay />

          <motion.div
            ref={modalRef}
            className={cn(
              "min-h-[50%] max-h-[90%] md:max-w-[40%] bg-white dark:bg-neutral-950 border border-transparent dark:border-neutral-800 md:rounded-2xl relative z-50 flex flex-col flex-1 overflow-hidden",
              className
            )}
            initial={{
              opacity: 0,
              scale: 0.5,
              rotateX: 40,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: 0,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              rotateX: 10,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 15,
            }}
          >
            <CloseIcon />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ModalContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col flex-1 p-8 md:p-10", className)}>
      {children}
    </div>
  );
};

export const ModalFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex justify-end p-4 bg-gray-100 dark:bg-neutral-900",
        className
      )}
    >
      {children}
    </div>
  );
};

const Overlay = ({ className }: { className?: string }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        backdropFilter: "blur(10px)",
      }}
      exit={{
        opacity: 0,
        backdropFilter: "blur(0px)",
      }}
      className={`fixed inset-0 h-full w-full bg-black bg-opacity-50 z-50 ${className}`}
    ></motion.div>
  );
};

const CloseIcon = () => {
  const { setOpen } = useModal();
  return (
    <button
      onClick={() => setOpen(false)}
      className="absolute top-4 right-4 group"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-black dark:text-white h-4 w-4 group-hover:scale-125 group-hover:rotate-3 transition duration-200"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  );
};
```

---

### Copy Button (copy-button)
**Docs:** https://www.shadcn.io/button/copy
**Registry:** https://www.shadcn.io/registry/copy-button.json
**Dependencies:** class-variance-authority, lucide-react, motion

```tsx
// File: components/ui/shadcn-io/copy-button/index.tsx
'use client';

import * as React from 'react';
import { AnimatePresence, HTMLMotionProps, motion } from 'motion/react';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center cursor-pointer rounded-md transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        muted: 'bg-muted text-muted-foreground',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
      },
      size: {
        default: 'size-8 rounded-lg [&_svg]:size-4',
        sm: 'size-6 [&_svg]:size-3',
        md: 'size-10 rounded-lg [&_svg]:size-5',
        lg: 'size-12 rounded-xl [&_svg]:size-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type CopyButtonProps = Omit<HTMLMotionProps<'button'>, 'children' | 'onCopy'> &
  VariantProps<typeof buttonVariants> & {
    content?: string;
    delay?: number;
    /** Called after successful copy. Return false to prevent copy action. */
    onCopy?: (content: string) => void | boolean;
    isCopied?: boolean;
    onCopyChange?: (isCopied: boolean) => void;
  };

function CopyButton({
  content,
  className,
  size,
  variant,
  delay = 3000,
  onClick,
  onCopy,
  isCopied,
  onCopyChange,
  ...props
}: CopyButtonProps) {
  const [localIsCopied, setLocalIsCopied] = React.useState(isCopied ?? false);
  const Icon = localIsCopied ? CheckIcon : CopyIcon;

  React.useEffect(() => {
    setLocalIsCopied(isCopied ?? false);
  }, [isCopied]);

  const handleIsCopied = React.useCallback(
    (isCopied: boolean) => {
      setLocalIsCopied(isCopied);
      onCopyChange?.(isCopied);
    },
    [onCopyChange],
  );

  const handleCopy = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isCopied) return;
      if (content) {
        // Call onCopy first to allow preventing the copy action
        const shouldCopy = onCopy?.(content);
        if (shouldCopy === false) {
          onClick?.(e);
          return;
        }
        navigator.clipboard
          .writeText(content)
          .then(() => {
            handleIsCopied(true);
            setTimeout(() => handleIsCopied(false), delay);
          })
          .catch((error) => {
            console.error('Error copying command', error);
          });
      }
      onClick?.(e);
    },
    [isCopied, content, delay, onClick, onCopy, handleIsCopied],
  );

  return (
    <motion.button
      data-slot="copy-button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(buttonVariants({ variant, size }), className)}
      onClick={handleCopy}
      {...(props as any)}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={localIsCopied ? 'check' : 'copy'}
          data-slot="copy-button-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Icon />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

export { CopyButton, buttonVariants, type CopyButtonProps };
```

---

### Corner Accent Button (corner-accent-button)
**Docs:** https://www.shadcn.io/button/corner-accent-button
**Registry:** https://www.shadcn.io/registry/corner-accent-button.json

```tsx
// File: components/ui/shadcn-io/corner-accent-button/index.tsx
'use client';

import React from 'react';
import { cn } from '@repo/shadcn-ui/lib/utils';

export interface CornerAccentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const CornerAccentButton = React.forwardRef<HTMLButtonElement, CornerAccentButtonProps>(({
  className,
  children = "Get Started",
  ...props
}, ref) => {
  return (
    <button 
      ref={ref}
      className={cn(
        "relative flex items-center px-6 py-3 overflow-hidden font-medium transition-all bg-indigo-500 rounded-md group",
        className
      )}
      {...(props as any)}
    >
      {/* Top right corner accent */}
      <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-mr-4 group-hover:-mt-4">
        <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
      </span>
      
      {/* Bottom left corner accent */}
      <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-ml-4 group-hover:-mb-4">
        <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
      </span>
      
      {/* Sliding background */}
      <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-indigo-600 rounded-md group-hover:translate-x-0" />
      
      {/* Button text */}
      <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
        {children}
      </span>
    </button>
  );
});

CornerAccentButton.displayName = "CornerAccentButton";
```

---

### Counter (counter)
**Docs:** https://www.shadcn.io/button/counter
**Registry:** https://www.shadcn.io/registry/counter.json
**Dependencies:** motion

```tsx
// File: components/ui/shadcn-io/counter/index.tsx
'use client';
 
import * as React from 'react';
import { motion, type HTMLMotionProps, type Transition } from 'motion/react';
 
import {
  SlidingNumber,
  type SlidingNumberProps,
} from '@repo/sliding-number';
import { Button } from '@repo/shadcn-ui/components/ui/button';
import { cn } from '@repo/shadcn-ui/lib/utils';
 
type CounterProps = HTMLMotionProps<'div'> & {
  number: number;
  setNumber: (number: number) => void;
  slidingNumberProps?: Omit<SlidingNumberProps, 'number'>;
  buttonProps?: Omit<React.ComponentProps<typeof Button>, 'onClick'>;
  transition?: Transition;
};
 
function Counter({
  number,
  setNumber,
  className,
  slidingNumberProps,
  buttonProps,
  transition = { type: 'spring', bounce: 0, stiffness: 300, damping: 30 },
  ...props
}: CounterProps) {
  return (
    <motion.div
      data-slot="counter"
      layout
      transition={transition}
      className={cn(
        'flex items-center gap-x-2 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800',
        className,
      )}
      {...(props as any)}
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="icon"
          {...buttonProps}
          onClick={() => setNumber(number - 1)}
          className={cn(
            'bg-white dark:bg-neutral-950 hover:bg-white/70 dark:hover:bg-neutral-950/70 text-neutral-950 dark:text-white text-2xl font-light pb-[3px]',
            buttonProps?.className,
          )}
        >
          -
        </Button>
      </motion.div>
 
      <SlidingNumber
        number={number}
        {...slidingNumberProps}
        className={cn('text-lg', slidingNumberProps?.className)}
      />
 
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="icon"
          {...buttonProps}
          onClick={() => setNumber(number + 1)}
          className={cn(
            'bg-white dark:bg-neutral-950 hover:bg-white/70 dark:hover:bg-neutral-950/70 text-neutral-950 dark:text-white text-2xl font-light pb-[3px]',
            buttonProps?.className,
          )}
        >
          +
        </Button>
      </motion.div>
    </motion.div>
  );
}
 
export { Counter, type CounterProps };
```

---

### Flip Button (flip-button)
**Docs:** https://www.shadcn.io/button/flip
**Registry:** https://www.shadcn.io/registry/flip-button.json
**Dependencies:** motion

```tsx
// File: components/ui/shadcn-io/flip-button/index.tsx
'use client';

import * as React from 'react';
import {
  type HTMLMotionProps,
  type Transition,
  type Variant,
  motion,
} from 'motion/react';

import { cn } from '@repo/shadcn-ui/lib/utils';

type FlipDirection = 'top' | 'bottom' | 'left' | 'right';

type FlipButtonProps = HTMLMotionProps<'button'> & {
  frontText: string;
  backText: string;
  transition?: Transition;
  frontClassName?: string;
  backClassName?: string;
  from?: FlipDirection;
};

const DEFAULT_SPAN_CLASS_NAME =
  'absolute inset-0 flex items-center justify-center rounded-lg';

function FlipButton({
  frontText,
  backText,
  transition = { type: 'spring', stiffness: 280, damping: 20 },
  className,
  frontClassName,
  backClassName,
  from = 'top',
  ...props
}: FlipButtonProps) {
  const isVertical = from === 'top' || from === 'bottom';
  const rotateAxis = isVertical ? 'rotateX' : 'rotateY';

  const frontOffset = from === 'top' || from === 'left' ? '50%' : '-50%';
  const backOffset = from === 'top' || from === 'left' ? '-50%' : '50%';

  const buildVariant = (
    opacity: number,
    rotation: number,
    offset: string | null = null,
  ): Variant => ({
    opacity,
    [rotateAxis]: rotation,
    ...(isVertical && offset !== null ? { y: offset } : {}),
    ...(!isVertical && offset !== null ? { x: offset } : {}),
  });

  const frontVariants = {
    initial: buildVariant(1, 0, '0%'),
    hover: buildVariant(0, 90, frontOffset),
  };

  const backVariants = {
    initial: buildVariant(0, 90, backOffset),
    hover: buildVariant(1, 0, '0%'),
  };

  return (
    <motion.button
      data-slot="flip-button"
      initial="initial"
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative inline-block h-10 px-4 py-2 text-sm font-medium cursor-pointer perspective-[1000px] focus:outline-none',
        className,
      )}
      {...(props as any)}
    >
      <motion.span
        data-slot="flip-button-front"
        variants={frontVariants}
        transition={transition}
        className={cn(
          DEFAULT_SPAN_CLASS_NAME,
          'bg-muted text-black dark:text-white',
          frontClassName,
        )}
      >
        {frontText}
      </motion.span>
      <motion.span
        data-slot="flip-button-back"
        variants={backVariants}
        transition={transition}
        className={cn(
          DEFAULT_SPAN_CLASS_NAME,
          'bg-primary text-primary-foreground',
          backClassName,
        )}
      >
        {backText}
      </motion.span>
      <span className="invisible">{frontText}</span>
    </motion.button>
  );
}

export { FlipButton, type FlipButtonProps, type FlipDirection };
```

---

### Github Stars Button (github-stars-button)
**Docs:** https://www.shadcn.io/button/github-stars
**Registry:** https://www.shadcn.io/registry/github-stars-button.json
**Dependencies:** lucide-react, motion

```tsx
// File: components/ui/shadcn-io/github-stars-button/index.tsx
'use client';

import * as React from 'react';
import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';
import { SlidingNumber } from '@repo/sliding-number';

type GitHubStarsButtonProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  username: string;
  repo: string;
};

// Synchronously get cached stars (runs before first render)
function getCachedStars(username: string, repo: string): number | null {
  if (typeof window === 'undefined') return null;

  try {
    const cacheKey = `github-stars-${username}-${repo}`;
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const { stars, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;

    if (!isExpired && typeof stars === 'number') {
      return stars;
    }
  } catch {
    // Invalid cache
  }
  return null;
}

function GitHubStarsButton({
  username,
  repo,
  className,
  ...props
}: GitHubStarsButtonProps) {
  // Initialize with cached value synchronously to prevent flash
  const [stars, setStars] = React.useState<number | null>(() =>
    getCachedStars(username, repo)
  );

  const repoUrl = `https://github.com/${username}/${repo}`;

  React.useEffect(() => {
    const cacheKey = `github-stars-${username}-${repo}`;

    // If we already have stars from cache, still fetch in background to update
    const shouldFetch = stars === null || true; // Always fetch to keep fresh

    if (shouldFetch) {
      fetch(`https://api.github.com/repos/${username}/${repo}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.stargazers_count) {
            setStars(data.stargazers_count);
            localStorage.setItem(cacheKey, JSON.stringify({
              stars: data.stargazers_count,
              timestamp: Date.now(),
            }));
          }
        })
        .catch(() => {});
    }
  }, [username, repo, stars]);

  const buttonClassName = cn(
    "flex items-center gap-2 text-sm bg-primary text-primary-foreground rounded-lg px-4 py-2 h-10 has-[>svg]:px-3 cursor-pointer whitespace-nowrap font-medium transition-colors [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-[18px] shrink-0 [&_svg]:shrink-0",
    className,
  );

  // Fixed-width container for digits to prevent layout shift
  // Uses ch units to match SlidingNumber's w-[1ch] per digit
  const renderNumber = () => {
    if (stars === null) {
      // Placeholder with exact same width as 3-digit number (3ch)
      return (
        <span className="inline-flex items-center w-[3ch]">
          <span className="w-full h-[1em] bg-primary-foreground/20 rounded animate-pulse" />
        </span>
      );
    }

    const digits = stars.toString().split('');

    return (
      <span className="inline-flex items-center">
        {digits.map((digit, i) => (
          <SlidingNumber key={i} number={+digit} />
        ))}
      </span>
    );
  };

  return (
    <a
      href={repoUrl}
      rel="noopener noreferrer"
      target="_blank"
      className={buttonClassName}
      {...props}
    >
      <svg role="img" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
      <span>GitHub Stars</span>
      <Star
        className="fill-yellow-500 text-yellow-500"
        size={18}
        aria-hidden="true"
      />
      {renderNumber()}
    </a>
  );
}

export { GitHubStarsButton, type GitHubStarsButtonProps };
```

---

### Icon Button (icon-button)
**Docs:** https://www.shadcn.io/button/icon
**Registry:** https://www.shadcn.io/registry/icon-button.json
**Dependencies:** lucide-react, motion

```tsx
// File: components/ui/shadcn-io/icon-button/index.tsx
'use client';
 
import * as React from 'react';
import {
  motion,
  AnimatePresence,
  type HTMLMotionProps,
  type Transition,
} from 'motion/react';
 
import { cn } from '@/lib/utils';
 
const sizes = {
  default: 'size-8 [&_svg]:size-5',
  sm: 'size-6 [&_svg]:size-4',
  md: 'size-10 [&_svg]:size-6',
  lg: 'size-12 [&_svg]:size-7',
};
 
type IconButtonProps = Omit<HTMLMotionProps<'button'>, 'color'> & {
  icon: React.ElementType;
  active?: boolean;
  className?: string;
  animate?: boolean;
  size?: keyof typeof sizes;
  color?: [number, number, number];
  transition?: Transition;
};
 
function IconButton({
  icon: Icon,
  className,
  active = false,
  animate = true,
  size = 'default',
  color = [59, 130, 246],
  transition = { type: 'spring', stiffness: 300, damping: 15 },
  ...props
}: IconButtonProps) {
  return (
    <motion.button
      data-slot="icon-button"
      className={cn(
        `group/icon-button cursor-pointer relative inline-flex size-10 shrink-0 rounded-full hover:bg-[var(--icon-button-color)]/10 active:bg-[var(--icon-button-color)]/20 text-[var(--icon-button-color)]`,
        sizes[size],
        className,
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={
        {
          '--icon-button-color': `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
        } as React.CSSProperties
      }
      {...(props as any)}
    >
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 stroke-muted-foreground group-hover/icon-button:stroke-[var(--icon-button-color)]"
        aria-hidden="true"
      >
        {React.createElement(Icon as React.ComponentType<any>, {
          className: active ? 'fill-[var(--icon-button-color)]' : 'fill-transparent'
        })}
      </motion.div>
 
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--icon-button-color)] fill-[var(--icon-button-color)]"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={transition}
          >
            {React.createElement(Icon as React.ComponentType<any>)}
          </motion.div>
        )}
      </AnimatePresence>
 
      <AnimatePresence>
        {animate && active && (
          <>
            <motion.div
              className="absolute inset-0 z-10 rounded-full "
              style={{
                background: `radial-gradient(circle, rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.4) 0%, rgba(${color[0]}, ${color[1]}, ${color[2]}, 0) 70%)`,
              }}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: [1.2, 1.8, 1.2], opacity: [0, 0.3, 0] }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute inset-0 z-10 rounded-full"
              style={{
                boxShadow: `0 0 10px 2px rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6)`,
              }}
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[var(--icon-button-color)]"
                initial={{ x: '50%', y: '50%', scale: 0, opacity: 0 }}
                animate={{
                  x: `calc(50% + ${Math.cos((i * Math.PI) / 3) * 30}px)`,
                  y: `calc(50% + ${Math.sin((i * Math.PI) / 3) * 30}px)`,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
 
export { IconButton, sizes, type IconButtonProps };
```

---

### Input Button (input-button)
**Docs:** https://www.shadcn.io/button/input
**Registry:** https://www.shadcn.io/registry/input-button.json
**Dependencies:** lucide-react, motion

```tsx
// File: components/ui/shadcn-io/input-button/index.tsx
'use client';
 
import * as React from 'react';
import {
  AnimatePresence,
  HTMLMotionProps,
  motion,
  Transition,
} from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@repo/shadcn-ui/lib/utils';
 
type InputButtonContextType = {
  showInput: boolean;
  setShowInput: React.Dispatch<React.SetStateAction<boolean>>;
  transition: Transition;
  id: string;
};
const InputButtonContext = React.createContext<
  InputButtonContextType | undefined
>(undefined);
 
const useInputButton = (): InputButtonContextType => {
  const context = React.useContext(InputButtonContext);
  if (!context) {
    throw new Error('useInputButton must be used within a InputButton');
  }
  return context;
};
 
type InputButtonProviderProps = React.ComponentProps<'div'> &
  Partial<InputButtonContextType>;
 
function InputButtonProvider({
  className,
  transition = { type: 'spring', stiffness: 300, damping: 20 },
  showInput,
  setShowInput,
  id,
  children,
  ...props
}: InputButtonProviderProps) {
  const localId = React.useId();
  const [localShowInput, setLocalShowInput] = React.useState(false);
 
  return (
    <InputButtonContext.Provider
      value={{
        showInput: showInput ?? localShowInput,
        setShowInput: setShowInput ?? setLocalShowInput,
        transition,
        id: id ?? localId,
      }}
    >
      <div
        data-slot="input-button-provider"
        className={cn(
          'relative w-fit flex items-center justify-center h-10',
          (showInput || localShowInput) && 'w-full max-w-[400px]',
          className,
        )}
        {...(props as any)}
      >
        {children}
      </div>
    </InputButtonContext.Provider>
  );
}
 
type InputButtonProps = HTMLMotionProps<'div'>;
 
function InputButton({ className, ...props }: InputButtonProps) {
  return (
    <motion.div
      data-slot="input-button"
      className={cn('flex size-full', className)}
      {...(props as any)}
    />
  );
}
 
type InputButtonActionProps = HTMLMotionProps<'button'>;
 
function InputButtonAction({ className, ...props }: InputButtonActionProps) {
  const { transition, setShowInput, id } = useInputButton();
 
  return (
    <motion.button
      data-slot="input-button-action"
      className={cn(
        'bg-background text-sm whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive rounded-full border text-background-foreground cursor-pointer pl-4 pr-12 size-full font-medium',
        className,
      )}
      layoutId={`input-button-action-${id}`}
      transition={transition}
      onClick={() => setShowInput((prev) => !prev)}
      {...(props as any)}
    />
  );
}
 
type InputButtonSubmitProps = HTMLMotionProps<'button'> & {
  icon?: React.ElementType;
};
 
function InputButtonSubmit({
  className,
  children,
  icon: Icon = ArrowRight,
  ...props
}: InputButtonSubmitProps) {
  const { transition, showInput, setShowInput, id } = useInputButton();
 
  return (
    <motion.button
      data-slot="input-button-submit"
      layoutId={`input-button-submit-${id}`}
      transition={transition}
      className={cn(
        "z-[1] [&_svg:not([class*='size-'])]:size-4 cursor-pointer disabled:pointer-events-none  disabled:opacity-50 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap bg-primary hover:bg-primary/90 transition-colors text-primary-foreground rounded-full text-sm flex items-center justify-center font-medium absolute inset-y-1 right-1",
        showInput ? 'px-4' : 'aspect-square',
        className,
      )}
      onClick={() => setShowInput((prev) => !prev)}
      {...(props as any)}
    >
      {showInput ? (
        <motion.span
          key="show-button"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
      ) : (
        <motion.span
          key="show-icon"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {React.createElement(Icon as React.ComponentType<any>, { className: "size-4" })}
        </motion.span>
      )}
    </motion.button>
  );
}
 
type InputButtonInputProps = React.ComponentProps<'input'>;
 
function InputButtonInput({ className, ...props }: InputButtonInputProps) {
  const { transition, showInput, id } = useInputButton();
 
  return (
    <AnimatePresence>
      {showInput && (
        <div className="absolute inset-0 size-full flex items-center justify-center">
          <motion.div
            layoutId={`input-button-input-${id}`}
            className="size-full flex items-center bg-background rounded-full relative"
            transition={transition}
          >
            <input
              data-slot="input-button-input"
              className={cn(
                'size-full selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground inset-0 pl-4 focus-visible:border-ring border focus-visible:ring-ring/50 focus-visible:ring-[3px] pr-32 py-2 text-sm bg-background rounded-full focus:outline-none absolute shrink-0 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:pointer-events-none disabled:cursor-not-allowed',
                className,
              )}
              {...(props as any)}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
 
export {
  InputButton,
  InputButtonProvider,
  InputButtonAction,
  InputButtonSubmit,
  InputButtonInput,
  useInputButton,
  type InputButtonProps,
  type InputButtonProviderProps,
  type InputButtonActionProps,
  type InputButtonSubmitProps,
  type InputButtonInputProps,
};
```

---

### Liquid Button (liquid-button)
**Docs:** https://www.shadcn.io/button/liquid
**Registry:** https://www.shadcn.io/registry/liquid-button.json
**Dependencies:** class-variance-authority, motion

```tsx
// File: components/ui/shadcn-io/liquid-button/index.tsx
'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@repo/shadcn-ui/lib/utils';

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium cursor-pointer overflow-hidden disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive [background:_linear-gradient(var(--liquid-button-color)_0_0)_no-repeat_calc(200%-var(--liquid-button-fill,0%))_100%/200%_var(--liquid-button-fill,0.2em)] hover:[--liquid-button-fill:100%] hover:[--liquid-button-delay:0.3s] [transition:_background_0.3s_var(--liquid-button-delay,0s),_color_0.3s_var(--liquid-button-delay,0s),_background-position_0.3s_calc(0.3s_-_var(--liquid-button-delay,0s))] focus:outline-none",
  {
    variants: {
      variant: {
        default:
          'text-primary hover:text-primary-foreground !bg-muted [--liquid-button-color:var(--primary)]',
        outline:
          'border !bg-background dark:!bg-input/30 dark:border-input [--liquid-button-color:var(--primary)]',
        secondary:
          'text-secondary hover:text-secondary-foreground !bg-muted [--liquid-button-color:var(--secondary)]',
      },
      size: {
        default: 'h-10 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-12 rounded-xl px-8 has-[>svg]:px-6',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type LiquidButtonProps = HTMLMotionProps<'button'> &
  VariantProps<typeof buttonVariants>;

function LiquidButton({
  className,
  variant,
  size,
  ...props
}: LiquidButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      className={cn(buttonVariants({ variant, size, className }))}
      {...(props as any)}
    />
  );
}

export { LiquidButton, type LiquidButtonProps };
```

---

### Magnetic Button (magnetic-button)
**Docs:** https://www.shadcn.io/button/magnetic-button
**Registry:** https://www.shadcn.io/registry/magnetic-button.json
**Dependencies:** framer-motion, lucide-react

```tsx
// File: components/ui/shadcn-io/magnetic-button/index.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Magnet } from 'lucide-react';
import { cn } from '@repo/shadcn-ui/lib/utils';

interface Particle {
  id: number;
  x: number;
  y: number;
}

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  particleCount?: number;
  attractRadius?: number;
  children?: React.ReactNode;
}

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(({
  className,
  particleCount = 12,
  attractRadius = 50,
  children,
  ...props
}, ref) => {
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
      x: particles[i]?.x || 0,
      y: particles[i]?.y || 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    }));
  }, [particlesControl, particles]);

  return (
    <button
      ref={ref}
      className={cn(
        "min-w-40 relative touch-none",
        "bg-violet-100 dark:bg-violet-900",
        "hover:bg-violet-200 dark:hover:bg-violet-800",
        "text-violet-600 dark:text-violet-300",
        "border border-violet-300 dark:border-violet-700",
        "transition-all duration-300 rounded-md px-4 py-2",
        className,
      )}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      {...(props as any)}
    >
      {particles.map((_, index) => (
        <motion.div
          key={index}
          custom={index}
          initial={{ x: particles[index]?.x || 0, y: particles[index]?.y || 0 }}
          animate={particlesControl}
          className={cn(
            "absolute w-1.5 h-1.5 rounded-full pointer-events-none",
            "bg-violet-400 dark:bg-violet-300",
            "transition-opacity duration-300",
            isAttracting ? "opacity-100" : "opacity-40",
          )}
        />
      ))}
      <span className="relative w-full flex items-center justify-center gap-2">
        {children || (
          <>
            <Magnet className={cn("w-4 h-4 transition-transform duration-300", isAttracting && "scale-110")} />
            {isAttracting ? "Attracting" : "Hover me"}
          </>
        )}
      </span>
    </button>
  );
});

MagneticButton.displayName = "MagneticButton";
```

---

### Rating (rating)
**Docs:** https://www.shadcn.io/button/rating
**Registry:** https://www.shadcn.io/registry/rating.json
**Dependencies:** @radix-ui/react-use-controllable-state, lucide-react

```tsx
// File: components/ui/shadcn-io/rating/index.tsx
'use client';

import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { type LucideProps, StarIcon } from 'lucide-react';
import type { KeyboardEvent, MouseEvent, ReactElement, ReactNode } from 'react';
import {
  Children,
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

type RatingContextValue = {
  value: number;
  readOnly: boolean;
  hoverValue: number | null;
  focusedStar: number | null;
  handleValueChange: (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
    value: number
  ) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  setHoverValue: (value: number | null) => void;
  setFocusedStar: (value: number | null) => void;
};

const RatingContext = createContext<RatingContextValue | null>(null);

const useRating = () => {
  const context = useContext(RatingContext);
  if (!context) {
    throw new Error('useRating must be used within a Rating component');
  }
  return context;
};

export type RatingButtonProps = LucideProps & {
  index?: number;
  icon?: ReactElement<LucideProps>;
};

export const RatingButton = ({
  index: providedIndex,
  size = 20,
  className,
  icon = <StarIcon />,
}: RatingButtonProps) => {
  const {
    value,
    readOnly,
    hoverValue,
    focusedStar,
    handleValueChange,
    handleKeyDown,
    setHoverValue,
    setFocusedStar,
  } = useRating();

  const index = providedIndex ?? 0;
  const isActive = index < (hoverValue ?? focusedStar ?? value ?? 0);
  let tabIndex = -1;

  if (!readOnly) {
    tabIndex = value === index + 1 ? 0 : -1;
  }

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      handleValueChange(event, index + 1);
    },
    [handleValueChange, index]
  );

  const handleMouseEnter = useCallback(() => {
    if (!readOnly) {
      setHoverValue(index + 1);
    }
  }, [readOnly, setHoverValue, index]);

  const handleFocus = useCallback(() => {
    setFocusedStar(index + 1);
  }, [setFocusedStar, index]);

  const handleBlur = useCallback(() => {
    setFocusedStar(null);
  }, [setFocusedStar]);

  return (
    <button
      className={cn(
        'rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'p-0.5',
        readOnly && 'cursor-default',
        className
      )}
      disabled={readOnly}
      onBlur={handleBlur}
      onClick={handleClick}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      tabIndex={tabIndex}
      type="button"
    >
      {cloneElement(icon, {
        size,
        className: cn(
          'transition-colors duration-200',
          isActive && 'fill-current',
          !readOnly && 'cursor-pointer'
        ),
        'aria-hidden': 'true',
      })}
    </button>
  );
};

export type RatingProps = {
  defaultValue?: number;
  value?: number;
  onChange?: (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
    value: number
  ) => void;
  onValueChange?: (value: number) => void;
  readOnly?: boolean;
  className?: string;
  children?: ReactNode;
};

export const Rating = ({
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  defaultValue = 0,
  onChange,
  readOnly = false,
  className,
  children,
  ...props
}: RatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [focusedStar, setFocusedStar] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [value, onValueChange] = useControllableState({
    defaultProp: defaultValue,
    prop: controlledValue,
    onChange: controlledOnValueChange,
  });

  const handleValueChange = useCallback(
    (
      event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
      newValue: number
    ) => {
      if (!readOnly) {
        onChange?.(event, newValue);
        onValueChange?.(newValue);
      }
    },
    [readOnly, onChange, onValueChange]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (readOnly) {
        return;
      }

      const total = Children.count(children);
      let newValue = focusedStar !== null ? focusedStar : (value ?? 0);

      switch (event.key) {
        case 'ArrowRight':
          if (event.shiftKey || event.metaKey) {
            newValue = total;
          } else {
            newValue = Math.min(total, newValue + 1);
          }
          break;
        case 'ArrowLeft':
          if (event.shiftKey || event.metaKey) {
            newValue = 1;
          } else {
            newValue = Math.max(1, newValue - 1);
          }
          break;
        default:
          return;
      }

      event.preventDefault();
      setFocusedStar(newValue);
      handleValueChange(event, newValue);
    },
    [focusedStar, value, children, readOnly, handleValueChange]
  );

  useEffect(() => {
    if (focusedStar !== null && containerRef.current) {
      const buttons = containerRef.current.querySelectorAll('button');
      buttons[focusedStar - 1]?.focus();
    }
  }, [focusedStar]);

  const contextValue: RatingContextValue = {
    value: value ?? 0,
    readOnly,
    hoverValue,
    focusedStar,
    handleValueChange,
    handleKeyDown,
    setHoverValue,
    setFocusedStar,
  };

  return (
    <RatingContext.Provider value={contextValue}>
      <div
        aria-label="Rating"
        className={cn('inline-flex items-center gap-0.5', className)}
        onMouseLeave={() => setHoverValue(null)}
        ref={containerRef}
        role="radiogroup"
        {...(props as any)}
      >
        {Children.map(children, (child, index) => {
          if (!child) {
            return null;
          }

          return cloneElement(child as ReactElement<RatingButtonProps>, {
            index,
          });
        })}
      </div>
    </RatingContext.Provider>
  );
};
```

---

### Ripple Button (ripple-button)
**Docs:** https://www.shadcn.io/button/ripple
**Registry:** https://www.shadcn.io/registry/ripple-button.json
**Dependencies:** class-variance-authority, motion

```tsx
// File: components/ui/shadcn-io/ripple-button/index.tsx
'use client';
 
import * as React from 'react';
import { type HTMLMotionProps, motion, type Transition } from 'motion/react';
import { cva, type VariantProps } from 'class-variance-authority';
 
import { cn } from '@/lib/utils';
 
const buttonVariants = cva(
  "relative overflow-hidden cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
      },
      size: {
        default: 'h-10 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-11 px-8 has-[>svg]:px-6',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
 
const rippleVariants = cva('absolute rounded-full size-5 pointer-events-none', {
  variants: {
    variant: {
      default: 'bg-primary-foreground',
      destructive: 'bg-destructive',
      outline: 'bg-input',
      secondary: 'bg-secondary',
      ghost: 'bg-accent',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
 
type Ripple = {
  id: number;
  x: number;
  y: number;
};
 
type RippleButtonProps = HTMLMotionProps<'button'> & {
  children: React.ReactNode;
  rippleClassName?: string;
  scale?: number;
  transition?: Transition;
} & VariantProps<typeof buttonVariants>;
 
function RippleButton({
  ref,
  children,
  onClick,
  className,
  rippleClassName,
  variant,
  size,
  scale = 10,
  transition = { duration: 0.6, ease: 'easeOut' },
  ...props
}: RippleButtonProps) {
  const [ripples, setRipples] = React.useState<Ripple[]>([]);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  React.useImperativeHandle(ref as any, () => buttonRef.current as HTMLButtonElement);
 
  const createRipple = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current;
      if (!button) return;
 
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
 
      const newRipple: Ripple = {
        id: Date.now(),
        x,
        y,
      };
 
      setRipples((prev) => [...prev, newRipple]);
 
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    },
    [],
  );
 
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(event);
      if (onClick) {
        onClick(event);
      }
    },
    [createRipple, onClick],
  );
 
  return (
    <motion.button
      ref={buttonRef}
      data-slot="ripple-button"
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      className={cn(buttonVariants({ variant, size, className }))}
      {...(props as any)}
    >
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale, opacity: 0 }}
          transition={transition}
          className={cn(
            rippleVariants({ variant, className: rippleClassName }),
          )}
          style={{
            top: ripple.y - 10,
            left: ripple.x - 10,
          }}
        />
      ))}
    </motion.button>
  );
}
 
export { RippleButton, type RippleButtonProps };
```

---

### Text Reveal Button (text-reveal-button)
**Docs:** https://www.shadcn.io/button/text-reveal
**Registry:** https://www.shadcn.io/registry/text-reveal-button.json

```tsx
// File: components/ui/shadcn-io/text-reveal-button/index.tsx
'use client';

import React from 'react';
import { cn } from '@repo/shadcn-ui/lib/utils';

export interface TextRevealButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  revealColor?: string;
  strokeColor?: string;
}

export const TextRevealButton = React.forwardRef<
  HTMLButtonElement,
  TextRevealButtonProps
>(({
  text = "shadcn.io",
  revealColor = "#37FF8B",
  strokeColor = "rgba(100, 100, 100, 0.7)",
  className,
  style,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative cursor-pointer bg-transparent border-none p-0 m-0 h-auto font-['Arial'] uppercase",
        className
      )}
      style={{
        fontSize: '2em',
        letterSpacing: '3px',
        color: 'transparent',
        WebkitTextStroke: `1px ${strokeColor}`,
        ...style,
      }}
      {...(props as any)}
    >
      <span>
        &nbsp;{text}&nbsp;
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 w-0 overflow-hidden transition-all duration-500 group-hover:w-full group-hover:[filter:drop-shadow(0_0_23px_#37FF8B)]"
        style={{
          color: revealColor,
          borderRight: `6px solid ${revealColor}`,
          WebkitTextStroke: `1px ${revealColor}`,
        }}
      >
        &nbsp;{text}&nbsp;
      </span>
    </button>
  );
});

TextRevealButton.displayName = "TextRevealButton";
```

---

### Theme Switcher (theme-switcher)
**Docs:** https://www.shadcn.io/button/theme-switcher
**Registry:** https://www.shadcn.io/registry/theme-switcher.json
**Dependencies:** @radix-ui/react-use-controllable-state, lucide-react, motion

```tsx
// File: components/ui/shadcn-io/theme-switcher/index.tsx
'use client';

import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Monitor, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const themes = [
  {
    key: 'system',
    icon: Monitor,
    label: 'System theme',
  },
  {
    key: 'light',
    icon: Sun,
    label: 'Light theme',
  },
  {
    key: 'dark',
    icon: Moon,
    label: 'Dark theme',
  },
];

export type ThemeSwitcherProps = {
  value?: 'light' | 'dark' | 'system';
  onChange?: (theme: 'light' | 'dark' | 'system') => void;
  defaultValue?: 'light' | 'dark' | 'system';
  className?: string;
};

export const ThemeSwitcher = ({
  value,
  onChange,
  defaultValue = 'system',
  className,
}: ThemeSwitcherProps) => {
  const [theme, setTheme] = useControllableState({
    defaultProp: defaultValue,
    prop: value,
    onChange,
  });
  const [mounted, setMounted] = useState(false);

  const handleThemeClick = useCallback(
    (themeKey: 'light' | 'dark' | 'system') => {
      setTheme(themeKey);
    },
    [setTheme]
  );

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative isolate flex h-8 rounded-full bg-background p-1 ring-1 ring-border',
        className
      )}
    >
      {themes.map(({ key, icon: Icon, label }) => {
        const isActive = theme === key;

        return (
          <button
            aria-label={label}
            className="relative h-6 w-6 rounded-full"
            key={key}
            onClick={() => handleThemeClick(key as 'light' | 'dark' | 'system')}
            type="button"
          >
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full bg-secondary"
                layoutId="activeTheme"
                transition={{ type: 'spring', duration: 0.5 }}
              />
            )}
            <Icon
              className={cn(
                'relative z-10 m-auto h-4 w-4',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
```

---

### Theme Toggle Button (theme-toggle-button)
**Docs:** https://www.shadcn.io/button/theme-toggle
**Registry:** https://www.shadcn.io/registry/theme-toggle-button.json
**Dependencies:** lucide-react

```tsx
// File: components/ui/shadcn-io/theme-toggle-button/index.tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AnimationVariant = 
  | 'circle' 
  | 'circle-blur' 
  | 'gif'
  | 'polygon';

type StartPosition = 
  | 'center' 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right';

export interface ThemeToggleButtonProps {
  theme?: 'light' | 'dark';
  showLabel?: boolean;
  variant?: AnimationVariant;
  start?: StartPosition;
  url?: string; // For gif variant
  className?: string;
  onClick?: () => void;
}

export const ThemeToggleButton = ({
  theme = 'light',
  showLabel = false,
  variant = 'circle',
  start = 'center',
  url,
  className,
  onClick,
}: ThemeToggleButtonProps) => {
  
  const handleClick = useCallback(() => {
    // Inject animation styles for this specific transition
    const styleId = `theme-transition-${Date.now()}`;
    const style = document.createElement('style');
    style.id = styleId;
    
    // Generate animation CSS based on variant
    let css = '';
    const positions = {
      center: 'center',
      'top-left': 'top left',
      'top-right': 'top right',
      'bottom-left': 'bottom left',
      'bottom-right': 'bottom right',
    };
    
    if (variant === 'circle') {
      const cx = start === 'center' ? '50' : start.includes('left') ? '0' : '100';
      const cy = start === 'center' ? '50' : start.includes('top') ? '0' : '100';
      css = `
        @supports (view-transition-name: root) {
          ::view-transition-old(root) { 
            animation: none;
          }
          ::view-transition-new(root) {
            animation: circle-expand 0.4s ease-out;
            transform-origin: ${positions[start]};
          }
          @keyframes circle-expand {
            from {
              clip-path: circle(0% at ${cx}% ${cy}%);
            }
            to {
              clip-path: circle(150% at ${cx}% ${cy}%);
            }
          }
        }
      `;
    } else if (variant === 'circle-blur') {
      const cx = start === 'center' ? '50' : start.includes('left') ? '0' : '100';
      const cy = start === 'center' ? '50' : start.includes('top') ? '0' : '100';
      css = `
        @supports (view-transition-name: root) {
          ::view-transition-old(root) { 
            animation: none;
          }
          ::view-transition-new(root) {
            animation: circle-blur-expand 0.5s ease-out;
            transform-origin: ${positions[start]};
            filter: blur(0);
          }
          @keyframes circle-blur-expand {
            from {
              clip-path: circle(0% at ${cx}% ${cy}%);
              filter: blur(4px);
            }
            to {
              clip-path: circle(150% at ${cx}% ${cy}%);
              filter: blur(0);
            }
          }
        }
      `;
    } else if (variant === 'gif' && url) {
      css = `
        @supports (view-transition-name: root) {
          ::view-transition-old(root) {
            animation: fade-out 0.4s ease-out;
          }
          ::view-transition-new(root) {
            animation: gif-reveal 2.5s cubic-bezier(0.4, 0, 0.2, 1);
            mask-image: url('${url}');
            mask-size: 0%;
            mask-repeat: no-repeat;
            mask-position: center;
          }
          @keyframes fade-out {
            to {
              opacity: 0;
            }
          }
          @keyframes gif-reveal {
            0% {
              mask-size: 0%;
            }
            20% {
              mask-size: 35%;
            }
            60% {
              mask-size: 35%;
            }
            100% {
              mask-size: 300%;
            }
          }
        }
      `;
    } else if (variant === 'polygon') {
      css = `
        @supports (view-transition-name: root) {
          ::view-transition-old(root) {
            animation: none;
          }
          ::view-transition-new(root) {
            animation: ${theme === 'light' ? 'wipe-in-dark' : 'wipe-in-light'} 0.4s ease-out;
          }
          @keyframes wipe-in-dark {
            from {
              clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
            }
            to {
              clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            }
          }
          @keyframes wipe-in-light {
            from {
              clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%);
            }
            to {
              clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            }
          }
        }
      `;
    }
    
    if (css) {
      style.textContent = css;
      document.head.appendChild(style);
      
      // Clean up animation styles after transition
      setTimeout(() => {
        const styleEl = document.getElementById(styleId);
        if (styleEl) {
          styleEl.remove();
        }
      }, 3000);
    }
    
    // Call the onClick handler if provided
    onClick?.();
  }, [onClick, variant, start, url, theme]);

  return (
    <Button
      variant="outline"
      size={showLabel ? 'default' : 'icon'}
      onClick={handleClick}
      className={cn(
        'relative overflow-hidden transition-all',
        showLabel && 'gap-2',
        className
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      {showLabel && (
        <span className="text-sm">
          {theme === 'light' ? 'Light' : 'Dark'}
        </span>
      )}
    </Button>
  );
};

// Export a helper hook for using with View Transitions API
export const useThemeTransition = () => {
  const startTransition = useCallback((updateFn: () => void) => {
    if ('startViewTransition' in document) {
      (document as any).startViewTransition(updateFn);
    } else {
      updateFn();
    }
  }, []);

  return { startTransition };
};
```

---

## deps

### Index (code-block-index)
**Registry:** https://www.shadcn.io/registry/code-block.json
**Dependencies:** @icons-pack/react-simple-icons, @radix-ui/react-use-controllable-state, lucide-react, shiki

```tsx
// File: components/ui/shadcn-io/code-block/index.tsx
'use client';

import {
  type IconType,
  SiAstro,
  SiBiome,
  SiBower,
  SiBun,
  SiC,
  SiCircleci,
  SiCoffeescript,
  SiCplusplus,
  SiCss,
  SiCssmodules,
  SiDart,
  SiDocker,
  SiDocusaurus,
  SiDotenv,
  SiEditorconfig,
  SiEslint,
  SiGatsby,
  SiGitignoredotio,
  SiGnubash,
  SiGo,
  SiGraphql,
  SiGrunt,
  SiGulp,
  SiHandlebarsdotjs,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiJson,
  SiLess,
  SiMarkdown,
  SiMdx,
  SiMintlify,
  SiMocha,
  SiMysql,
  SiNextdotjs,
  SiPerl,
  SiPhp,
  SiPostcss,
  SiPrettier,
  SiPrisma,
  SiPug,
  SiPython,
  SiR,
  SiReact,
  SiReadme,
  SiRedis,
  SiRemix,
  SiRive,
  SiRollupdotjs,
  SiRuby,
  SiSanity,
  SiSass,
  SiScala,
  SiSentry,
  SiShadcnui,
  SiStorybook,
  SiStylelint,
  SiSublimetext,
  SiSvelte,
  SiSvg,
  SiSwift,
  SiTailwindcss,
  SiToml,
  SiTypescript,
  SiVercel,
  SiVite,
  SiVuedotjs,
  SiWebassembly,
} from '@icons-pack/react-simple-icons';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { CheckIcon, CopyIcon } from 'lucide-react';
import type {
  ComponentProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from 'react';
import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type BundledLanguage = string;

const filenameIconMap = {
  '.env': SiDotenv,
  '*.astro': SiAstro,
  'biome.json': SiBiome,
  '.bowerrc': SiBower,
  'bun.lockb': SiBun,
  '*.c': SiC,
  '*.cpp': SiCplusplus,
  '.circleci/config.yml': SiCircleci,
  '*.coffee': SiCoffeescript,
  '*.module.css': SiCssmodules,
  '*.css': SiCss,
  '*.dart': SiDart,
  Dockerfile: SiDocker,
  'docusaurus.config.js': SiDocusaurus,
  '.editorconfig': SiEditorconfig,
  '.eslintrc': SiEslint,
  'eslint.config.*': SiEslint,
  'gatsby-config.*': SiGatsby,
  '.gitignore': SiGitignoredotio,
  '*.go': SiGo,
  '*.graphql': SiGraphql,
  '*.sh': SiGnubash,
  'Gruntfile.*': SiGrunt,
  'gulpfile.*': SiGulp,
  '*.hbs': SiHandlebarsdotjs,
  '*.html': SiHtml5,
  '*.js': SiJavascript,
  '*.json': SiJson,
  '*.test.js': SiJest,
  '*.less': SiLess,
  '*.md': SiMarkdown,
  '*.mdx': SiMdx,
  'mintlify.json': SiMintlify,
  'mocha.opts': SiMocha,
  '*.mustache': SiHandlebarsdotjs,
  '*.sql': SiMysql,
  'next.config.*': SiNextdotjs,
  '*.pl': SiPerl,
  '*.php': SiPhp,
  'postcss.config.*': SiPostcss,
  'prettier.config.*': SiPrettier,
  '*.prisma': SiPrisma,
  '*.pug': SiPug,
  '*.py': SiPython,
  '*.r': SiR,
  '*.rb': SiRuby,
  '*.jsx': SiReact,
  '*.tsx': SiReact,
  'readme.md': SiReadme,
  '*.rdb': SiRedis,
  'remix.config.*': SiRemix,
  '*.riv': SiRive,
  'rollup.config.*': SiRollupdotjs,
  'sanity.config.*': SiSanity,
  '*.sass': SiSass,
  '*.scss': SiSass,
  '*.sc': SiScala,
  '*.scala': SiScala,
  'sentry.client.config.*': SiSentry,
  'components.json': SiShadcnui,
  'storybook.config.*': SiStorybook,
  'stylelint.config.*': SiStylelint,
  '.sublime-settings': SiSublimetext,
  '*.svelte': SiSvelte,
  '*.svg': SiSvg,
  '*.swift': SiSwift,
  'tailwind.config.*': SiTailwindcss,
  '*.toml': SiToml,
  '*.ts': SiTypescript,
  'vercel.json': SiVercel,
  'vite.config.*': SiVite,
  '*.vue': SiVuedotjs,
  '*.wasm': SiWebassembly,
};

const lineNumberClassNames = cn(
  '[&_code]:[counter-reset:line]',
  '[&_code]:[counter-increment:line_0]',
  '[&_.line]:before:content-[counter(line)]',
  '[&_.line]:before:inline-block',
  '[&_.line]:before:[counter-increment:line]',
  '[&_.line]:before:w-4',
  '[&_.line]:before:mr-4',
  '[&_.line]:before:text-[13px]',
  '[&_.line]:before:text-right',
  '[&_.line]:before:text-muted-foreground/50',
  '[&_.line]:before:font-mono',
  '[&_.line]:before:select-none'
);

const darkModeClassNames = cn(
  'dark:[&_.shiki]:!text-[var(--shiki-dark)]',
  'dark:[&_.shiki]:!bg-[var(--shiki-dark-bg)]',
  'dark:[&_.shiki]:![font-style:var(--shiki-dark-font-style)]',
  'dark:[&_.shiki]:![font-weight:var(--shiki-dark-font-weight)]',
  'dark:[&_.shiki]:![text-decoration:var(--shiki-dark-text-decoration)]',
  'dark:[&_.shiki_span]:!text-[var(--shiki-dark)]',
  'dark:[&_.shiki_span]:![font-style:var(--shiki-dark-font-style)]',
  'dark:[&_.shiki_span]:![font-weight:var(--shiki-dark-font-weight)]',
  'dark:[&_.shiki_span]:![text-decoration:var(--shiki-dark-text-decoration)]'
);

const lineHighlightClassNames = cn(
  '[&_.line.highlighted]:bg-blue-50',
  '[&_.line.highlighted]:after:bg-blue-500',
  '[&_.line.highlighted]:after:absolute',
  '[&_.line.highlighted]:after:left-0',
  '[&_.line.highlighted]:after:top-0',
  '[&_.line.highlighted]:after:bottom-0',
  '[&_.line.highlighted]:after:w-0.5',
  'dark:[&_.line.highlighted]:!bg-blue-500/10'
);

const lineDiffClassNames = cn(
  '[&_.line.diff]:after:absolute',
  '[&_.line.diff]:after:left-0',
  '[&_.line.diff]:after:top-0',
  '[&_.line.diff]:after:bottom-0',
  '[&_.line.diff]:after:w-0.5',
  '[&_.line.diff.add]:bg-emerald-50',
  '[&_.line.diff.add]:after:bg-emerald-500',
  '[&_.line.diff.remove]:bg-rose-50',
  '[&_.line.diff.remove]:after:bg-rose-500',
  'dark:[&_.line.diff.add]:!bg-emerald-500/10',
  'dark:[&_.line.diff.remove]:!bg-rose-500/10'
);

const lineFocusedClassNames = cn(
  '[&_code:has(.focused)_.line]:blur-[2px]',
  '[&_code:has(.focused)_.line.focused]:blur-none'
);

const wordHighlightClassNames = cn(
  '[&_.highlighted-word]:bg-blue-50',
  'dark:[&_.highlighted-word]:!bg-blue-500/10'
);

const codeBlockClassName = cn(
  'mt-0 bg-background text-sm',
  '[&_pre]:py-4',
  '[&_.shiki]:!bg-[var(--shiki-bg)]',
  '[&_code]:w-full',
  '[&_code]:grid',
  '[&_code]:overflow-x-auto',
  '[&_code]:bg-transparent',
  '[&_.line]:px-4',
  '[&_.line]:w-full',
  '[&_.line]:relative'
);


type CodeBlockData = {
  language: string;
  filename: string;
  code: string;
};

type CodeBlockContextType = {
  value: string | undefined;
  onValueChange: ((value: string) => void) | undefined;
  data: CodeBlockData[];
};

const CodeBlockContext = createContext<CodeBlockContextType>({
  value: undefined,
  onValueChange: undefined,
  data: [],
});

export type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  data: CodeBlockData[];
};

export const CodeBlock = ({
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  defaultValue,
  className,
  data,
  ...props
}: CodeBlockProps) => {
  const [value, onValueChange] = useControllableState({
    defaultProp: defaultValue ?? '',
    prop: controlledValue,
    onChange: controlledOnValueChange,
  });

  return (
    <CodeBlockContext.Provider value={{ value, onValueChange, data }}>
      <div
        className={cn('size-full overflow-hidden rounded-md border', className)}
        {...(props as any)}
      />
    </CodeBlockContext.Provider>
  );
};

export type CodeBlockHeaderProps = HTMLAttributes<HTMLDivElement>;

export const CodeBlockHeader = ({
  className,
  ...props
}: CodeBlockHeaderProps) => (
  <div
    className={cn(
      'flex flex-row items-center border-b bg-secondary p-1',
      className
    )}
    {...(props as any)}
  />
);

export type CodeBlockFilesProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  children: (item: CodeBlockData) => ReactNode;
};

export const CodeBlockFiles = ({
  className,
  children,
  ...props
}: CodeBlockFilesProps) => {
  const { data } = useContext(CodeBlockContext);

  return (
    <div
      className={cn('flex grow flex-row items-center gap-2', className)}
      {...(props as any)}
    >
      {data.map(children)}
    </div>
  );
};

export type CodeBlockFilenameProps = HTMLAttributes<HTMLDivElement> & {
  icon?: IconType;
  value?: string;
};

export const CodeBlockFilename = ({
  className,
  icon,
  value,
  children,
  ...props
}: CodeBlockFilenameProps) => {
  const { value: activeValue } = useContext(CodeBlockContext);
  const defaultIcon = Object.entries(filenameIconMap).find(([pattern]) => {
    const regex = new RegExp(
      `^${pattern.replace(/\\/g, '\\\\').replace(/\./g, '\\.').replace(/\*/g, '.*')}$`
    );
    return regex.test(children as string);
  })?.[1];
  const Icon = icon ?? defaultIcon;

  if (value !== activeValue) {
    return null;
  }

  return (
    <div
      className="flex items-center gap-2 bg-secondary px-4 py-1.5 text-muted-foreground text-xs"
      {...(props as any)}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span className="flex-1 truncate">{children}</span>
    </div>
  );
};

export type CodeBlockSelectProps = ComponentProps<typeof Select>;

export const CodeBlockSelect = (props: CodeBlockSelectProps) => {
  const { value, onValueChange } = useContext(CodeBlockContext);

  return <Select onValueChange={onValueChange} value={value} {...(props as any)} />;
};

export type CodeBlockSelectTriggerProps = ComponentProps<typeof SelectTrigger>;

export const CodeBlockSelectTrigger = ({
  className,
  ...props
}: CodeBlockSelectTriggerProps) => (
  <SelectTrigger
    className={cn(
      'w-fit border-none text-muted-foreground text-xs shadow-none',
      className
    )}
    {...(props as any)}
  />
);

export type CodeBlockSelectValueProps = ComponentProps<typeof SelectValue>;

export const CodeBlockSelectValue = (props: CodeBlockSelectValueProps) => (
  <SelectValue {...(props as any)} />
);

export type CodeBlockSelectContentProps = Omit<
  ComponentProps<typeof SelectContent>,
  'children'
> & {
  children: (item: CodeBlockData) => ReactNode;
};

export const CodeBlockSelectContent = ({
  children,
  ...props
}: CodeBlockSelectContentProps) => {
  const { data } = useContext(CodeBlockContext);

  return <SelectContent {...(props as any)}>{data.map(children)}</SelectContent>;
};

export type CodeBlockSelectItemProps = ComponentProps<typeof SelectItem>;

export const CodeBlockSelectItem = ({
  className,
  ...props
}: CodeBlockSelectItemProps) => (
  <SelectItem className={cn('text-sm', className)} {...(props as any)} />
);

export type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const CodeBlockCopyButton = ({
  asChild,
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}: CodeBlockCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { data, value } = useContext(CodeBlockContext);
  const code = data.find((item) => item.language === value)?.code;

  const copyToClipboard = () => {
    if (
      typeof window === 'undefined' ||
      !navigator.clipboard.writeText ||
      !code
    ) {
      return;
    }

    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      onCopy?.();

      setTimeout(() => setIsCopied(false), timeout);
    }, onError);
  };

  if (asChild) {
    return cloneElement(children as ReactElement, {
      // @ts-expect-error - we know this is a button
      onClick: copyToClipboard,
    });
  }

  const Icon = isCopied ? CheckIcon : CopyIcon;

  return (
    <Button
      className={cn('shrink-0', className)}
      onClick={copyToClipboard}
      size="icon"
      variant="ghost"
      {...(props as any)}
    >
      {children ?? <Icon className="text-muted-foreground" size={14} />}
    </Button>
  );
};

type CodeBlockFallbackProps = HTMLAttributes<HTMLDivElement>;

const CodeBlockFallback = ({ children, ...props }: CodeBlockFallbackProps) => (
  <div {...(props as any)}>
    <pre className="w-full">
      <code>
        {children
          ?.toString()
          .split('\n')
          .map((line, i) => (
            <span className="line" key={i}>
              {line}
            </span>
          ))}
      </code>
    </pre>
  </div>
);

export type CodeBlockBodyProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  children: (item: CodeBlockData) => ReactNode;
};

export const CodeBlockBody = ({ children, ...props }: CodeBlockBodyProps) => {
  const { data } = useContext(CodeBlockContext);

  return <div {...(props as any)}>{data.map(children)}</div>;
};

export type CodeBlockItemProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  lineNumbers?: boolean;
};

export const CodeBlockItem = ({
  children,
  lineNumbers = true,
  className,
  value,
  ...props
}: CodeBlockItemProps) => {
  const { value: activeValue } = useContext(CodeBlockContext);

  if (value !== activeValue) {
    return null;
  }

  return (
    <div
      className={cn(
        codeBlockClassName,
        lineHighlightClassNames,
        lineDiffClassNames,
        lineFocusedClassNames,
        wordHighlightClassNames,
        darkModeClassNames,
        lineNumbers && lineNumberClassNames,
        className
      )}
      {...(props as any)}
    >
      {children}
    </div>
  );
};

export type CodeBlockContentProps = HTMLAttributes<HTMLDivElement> & {
  themes?: {
    light: string;
    dark: string;
  };
  language?: BundledLanguage;
  syntaxHighlighting?: boolean;
  children: string;
};

export const CodeBlockContent = ({
  children,
  themes = {
    light: 'vitesse-light',
    dark: 'vitesse-dark',
  },
  language = 'typescript',
  syntaxHighlighting = true,
  ...props
}: CodeBlockContentProps) => {
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(syntaxHighlighting);

  useEffect(() => {
    if (!syntaxHighlighting) {
      setIsLoading(false);
      return;
    }

    const loadHighlightedCode = async () => {
      try {
        const { codeToHtml } = await import('shiki');
        
        const html = await codeToHtml(children, {
          lang: language,
          themes: {
            light: themes.light,
            dark: themes.dark,
          },
        });

        setHighlightedCode(html);
        setIsLoading(false);
      } catch (error) {
        console.error(`Failed to highlight code for language "${language}":`, error);
        setIsLoading(false);
      }
    };

    loadHighlightedCode();
  }, [children, language, themes, syntaxHighlighting]);

  if (!syntaxHighlighting || isLoading) {
    return <CodeBlockFallback {...(props as any)}>{children}</CodeBlockFallback>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
      {...(props as any)}
    />
  );
};
```

---

### Server (code-block-server)
**Registry:** https://www.shadcn.io/registry/code-block.json
**Dependencies:** @icons-pack/react-simple-icons, @radix-ui/react-use-controllable-state, lucide-react, shiki

```tsx
// File: components/ui/shadcn-io/code-block/server.tsx
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import type { HTMLAttributes } from 'react';
import {
  type BundledLanguage,
  type CodeOptionsMultipleThemes,
  codeToHtml,
} from 'shiki';

export type CodeBlockContentProps = HTMLAttributes<HTMLDivElement> & {
  themes?: CodeOptionsMultipleThemes['themes'];
  language?: BundledLanguage;
  children: string;
  syntaxHighlighting?: boolean;
};

export const CodeBlockContent = async ({
  children,
  themes,
  language,
  syntaxHighlighting = true,
  ...props
}: CodeBlockContentProps) => {
  const html = syntaxHighlighting
    ? await codeToHtml(children as string, {
        lang: language ?? 'typescript',
        themes: themes ?? {
          light: 'vitesse-light',
          dark: 'vitesse-dark',
        },
        transformers: [
          transformerNotationDiff({
            matchAlgorithm: 'v3',
          }),
          transformerNotationHighlight({
            matchAlgorithm: 'v3',
          }),
          transformerNotationWordHighlight({
            matchAlgorithm: 'v3',
          }),
          transformerNotationFocus({
            matchAlgorithm: 'v3',
          }),
          transformerNotationErrorLevel({
            matchAlgorithm: 'v3',
          }),
        ],
      })
    : children;

  return (
    <div
      // biome-ignore lint/security/noDangerouslySetInnerHtml: "Kinda how Shiki works"
      dangerouslySetInnerHTML={{ __html: html }}
      {...(props as any)}
    />
  );
};
```

---

## hooks

### Use Boolean (use-boolean)
**Docs:** https://www.shadcn.io/hooks/use-boolean
**Registry:** https://www.shadcn.io/registry/use-boolean.json

```tsx
// File: registry/hooks/use-boolean.tsx
"use client";

import * as React from "react";

type UseBooleanReturn = {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
};

export function useBoolean(defaultValue = false): UseBooleanReturn {
  if (typeof defaultValue !== "boolean") {
    throw new Error("defaultValue must be `true` or `false`");
  }
  const [value, setValue] = React.useState(defaultValue);

  const setTrue = React.useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = React.useCallback(() => {
    setValue(false);
  }, []);

  const toggle = React.useCallback(() => {
    setValue((x) => !x);
  }, []);

  return { value, setValue, setTrue, setFalse, toggle };
}

export type { UseBooleanReturn };
```

---

### Use Click Anywhere (use-click-anywhere)
**Docs:** https://www.shadcn.io/hooks/use-click-anywhere
**Registry:** https://www.shadcn.io/registry/use-click-anywhere.json

```tsx
// File: registry/hooks/use-click-anywhere.tsx
"use client";

import * as React from "react";

// Simple event listener hook for document click events
function useEventListener(eventName: string, handler: (event: MouseEvent) => void) {
  const savedHandler = React.useRef(handler);
  
  React.useEffect(() => { savedHandler.current = handler; }, [handler]);
  
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    
    const eventListener = (event: Event) => savedHandler.current(event as MouseEvent);
    document.addEventListener(eventName, eventListener);
    return () => document.removeEventListener(eventName, eventListener);
  }, [eventName]);
}

/**
 * Custom hook that handles click events anywhere on the document
 * @param handler The function to be called when a click event is detected anywhere on the document
 */
export function useClickAnyWhere(handler: (event: MouseEvent) => void): void {
  useEventListener('click', event => {
    handler(event);
  });
}
```

---

### Use Copy To Clipboard (use-copy-to-clipboard)
**Docs:** https://www.shadcn.io/hooks/use-copy-to-clipboard
**Registry:** https://www.shadcn.io/registry/use-copy-to-clipboard.json

```tsx
// File: registry/hooks/use-copy-to-clipboard.tsx
import { useCallback, useState } from "react";

export type UseCopyToClipboardReturn = [
  (text: string) => Promise<void>,
  boolean
];

export const useCopyToClipboard = (): UseCopyToClipboardReturn => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string): Promise<void> => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.warn("Copy failed", error);
      setIsCopied(false);
    }
  }, []);

  return [copy, isCopied];
};
```

---

### Use Countdown (use-countdown)
**Docs:** https://www.shadcn.io/hooks/use-countdown
**Registry:** https://www.shadcn.io/registry/use-countdown.json

```tsx
// File: registry/hooks/use-countdown.ts
"use client"

import { useCallback } from "react"

import { useBoolean } from "./use-boolean"
import { useCounter } from "./use-counter"
import { useInterval } from "./use-interval"

type CountdownOptions = {
  countStart: number
  intervalMs?: number
  isIncrement?: boolean
  countStop?: number
}

type CountdownControllers = {
  startCountdown: () => void
  stopCountdown: () => void
  resetCountdown: () => void
}

export function useCountdown({
  countStart,
  countStop = 0,
  intervalMs = 1000,
  isIncrement = false,
}: CountdownOptions): [number, CountdownControllers] {
  const {
    count,
    increment,
    decrement,
    reset: resetCounter,
  } = useCounter(countStart)

  /*
   * Note: used to control the useInterval
   * running: If true, the interval is running
   * start: Should set running true to trigger interval
   * stop: Should set running false to remove interval.
   */
  const {
    value: isCountdownRunning,
    setTrue: startCountdown,
    setFalse: stopCountdown,
  } = useBoolean(false)

  // Will set running false and reset the seconds to initial value.
  const resetCountdown = useCallback(() => {
    stopCountdown()
    resetCounter()
  }, [stopCountdown, resetCounter])

  const countdownCallback = useCallback(() => {
    if (count === countStop) {
      stopCountdown()
      return
    }

    if (isIncrement) {
      increment()
    } else {
      decrement()
    }
  }, [count, countStop, decrement, increment, isIncrement, stopCountdown])

  useInterval(countdownCallback, isCountdownRunning ? intervalMs : null)

  return [count, { startCountdown, stopCountdown, resetCountdown }]
}

export type { CountdownOptions, CountdownControllers }
```

---

### Use Counter (use-counter)
**Docs:** https://www.shadcn.io/hooks/use-counter
**Registry:** https://www.shadcn.io/registry/use-counter.json

```tsx
// File: registry/hooks/use-counter.tsx
"use client";

import * as React from "react";

type UseCounterReturn = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: React.Dispatch<React.SetStateAction<number>>;
};

/**
 * Custom hook for counter state management with common operations
 * @param initialValue The initial count value (defaults to 0)
 * @returns An object containing count state and control functions
 */
export function useCounter(initialValue?: number): UseCounterReturn {
  const [count, setCount] = React.useState(initialValue ?? 0);

  const increment = React.useCallback(() => {
    setCount((x) => x + 1);
  }, []);

  const decrement = React.useCallback(() => {
    setCount((x) => x - 1);
  }, []);

  const reset = React.useCallback(() => {
    setCount(initialValue ?? 0);
  }, [initialValue]);

  return {
    count,
    increment,
    decrement,
    reset,
    setCount,
  };
}
```

---

### Use Dark Mode (use-dark-mode)
**Docs:** https://www.shadcn.io/hooks/use-dark-mode
**Registry:** https://www.shadcn.io/registry/use-dark-mode.json

```tsx
// File: registry/hooks/use-dark-mode.tsx
"use client";

import { useEffect, useState } from 'react';

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';
const LOCAL_STORAGE_KEY = 'usehooks-ts-dark-mode';

type DarkModeOptions = {
  defaultValue?: boolean;
  localStorageKey?: string;
  initializeWithValue?: boolean;
  applyDarkClass?: boolean;
};

type DarkModeReturn = {
  isDarkMode: boolean;
  toggle: () => void;
  enable: () => void;
  disable: () => void;
  set: (value: boolean) => void;
};

export function useDarkMode(options: DarkModeOptions = {}): DarkModeReturn {
  const {
    defaultValue = false,
    localStorageKey = LOCAL_STORAGE_KEY,
    initializeWithValue = true,
    applyDarkClass = true,
  } = options;

  // Check if user prefers dark mode
  const getOSPreference = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia(COLOR_SCHEME_QUERY).matches;
    }
    return defaultValue;
  };

  // Initialize state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    if (!initializeWithValue) {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(localStorageKey);
      if (item !== null) {
        return JSON.parse(item);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${localStorageKey}":`, error);
    }

    return getOSPreference();
  });

  // Save to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(localStorageKey, JSON.stringify(isDarkMode));
    } catch (error) {
      console.error(`Error setting localStorage key "${localStorageKey}":`, error);
    }
  }, [isDarkMode, localStorageKey]);

  // Listen for OS preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY);
    
    const handleChange = (e: MediaQueryListEvent) => {
      const savedValue = window.localStorage.getItem(localStorageKey);
      if (savedValue === null) {
        setIsDarkMode(e.matches);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [localStorageKey]);

  // Apply dark mode class to document
  useEffect(() => {
    if (typeof window === 'undefined' || !applyDarkClass) return;

    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode, applyDarkClass]);

  return {
    isDarkMode,
    toggle: () => setIsDarkMode(prev => !prev),
    enable: () => setIsDarkMode(true),
    disable: () => setIsDarkMode(false),
    set: (value: boolean) => setIsDarkMode(value),
  };
}

// Export types
export type { DarkModeOptions, DarkModeReturn };
```

---

### Use Debounce Callback (use-debounce-callback)
**Docs:** https://www.shadcn.io/hooks/use-debounce-callback
**Registry:** https://www.shadcn.io/registry/use-debounce-callback.json
**Dependencies:** lodash.debounce

```tsx
// File: registry/hooks/use-debounce-callback.tsx
"use client"

import * as React from "react"
import debounce from "lodash.debounce"

import { useUnmount } from "./use-unmount"

type DebounceOptions = {
  leading?: boolean
  trailing?: boolean
  maxWait?: number
}

type ControlFunctions = {
  cancel: () => void
  flush: () => void
  isPending: () => boolean
}

export type DebouncedState<T extends (...args: any) => ReturnType<T>> = ((
  ...args: Parameters<T>
) => ReturnType<T> | undefined) &
  ControlFunctions

export function useDebounceCallback<T extends (...args: any) => ReturnType<T>>(
  func: T,
  delay = 500,
  options?: DebounceOptions
): DebouncedState<T> {
  const debouncedFunc = React.useRef<ReturnType<typeof debounce>>(null)

  useUnmount(() => {
    if (debouncedFunc.current) {
      debouncedFunc.current.cancel()
    }
  })

  const debounced = React.useMemo(() => {
    const debouncedFuncInstance = debounce(func, delay, options)

    const wrappedFunc: DebouncedState<T> = (...args: Parameters<T>) => {
      return debouncedFuncInstance(...args)
    }

    wrappedFunc.cancel = () => {
      debouncedFuncInstance.cancel()
    }

    wrappedFunc.isPending = () => {
      return !!debouncedFunc.current
    }

    wrappedFunc.flush = () => {
      return debouncedFuncInstance.flush()
    }

    return wrappedFunc
  }, [func, delay, options])

  React.useEffect(() => {
    debouncedFunc.current = debounce(func, delay, options)
  }, [func, delay, options])

  return debounced
}
```

---

### Use Debounce Value (use-debounce-value)
**Docs:** https://www.shadcn.io/hooks/use-debounce-value
**Registry:** https://www.shadcn.io/registry/use-debounce-value.json

```tsx
// File: registry/hooks/use-debounce-value.tsx
"use client";

import { useRef, useState } from "react";
import { useDebounceCallback } from "./use-debounce-callback";
import type { DebouncedState } from "./use-debounce-callback";

type UseDebounceValueOptions<T> = {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
  equalityFn?: (left: T, right: T) => boolean;
};

/**
 * Custom hook that returns a debounced version of the provided value, along with a function to update it.
 * @param initialValue The value to be debounced
 * @param delay The delay in milliseconds before the value is updated (default is 500ms)
 * @param options Optional configurations for the debouncing behavior
 * @returns An array containing the debounced value and the function to update it
 */
export function useDebounceValue<T>(
  initialValue: T | (() => T),
  delay: number,
  options?: UseDebounceValueOptions<T>
): [T, DebouncedState<(value: T) => void>] {
  const eq = options?.equalityFn ?? ((left: T, right: T) => left === right);
  const unwrappedInitialValue =
    initialValue instanceof Function ? initialValue() : initialValue;
  const [debouncedValue, setDebouncedValue] = useState<T>(unwrappedInitialValue);
  const previousValueRef = useRef<T | undefined>(unwrappedInitialValue);

  const updateDebouncedValue = useDebounceCallback(
    setDebouncedValue,
    delay,
    options
  );

  // Update the debounced value if the initial value changes
  if (!eq(previousValueRef.current as T, unwrappedInitialValue)) {
    updateDebouncedValue(unwrappedInitialValue);
    previousValueRef.current = unwrappedInitialValue;
  }

  return [debouncedValue, updateDebouncedValue];
}
```

---

### Use Document Title (use-document-title)
**Docs:** https://www.shadcn.io/hooks/use-document-title
**Registry:** https://www.shadcn.io/registry/use-document-title.json

```tsx
// File: registry/hooks/use-document-title.tsx
"use client";

import * as React from "react";

/**
 * Custom hook to update the document title dynamically
 * @param title The title to set for the document
 */
export function useDocumentTitle(title: string): void {
  React.useEffect(() => {
    document.title = title;
  }, [title]);
}
```

---

### Use Event Callback (use-event-callback)
**Docs:** https://www.shadcn.io/hooks/use-event-callback
**Registry:** https://www.shadcn.io/registry/use-event-callback.json

```tsx
// File: registry/hooks/use-event-callback.tsx
"use client";

import { useCallback, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

/**
 * Custom hook that creates a memoized event callback that's safe to call during rendering.
 * 
 * This hook ensures that the callback always has access to the latest values
 * while maintaining a stable reference, preventing unnecessary re-renders.
 */
export function useEventCallback<Args extends unknown[], R>(
  fn: (...args: Args) => R
): (...args: Args) => R;
export function useEventCallback<Args extends unknown[], R>(
  fn: ((...args: Args) => R) | undefined
): ((...args: Args) => R) | undefined;
export function useEventCallback<Args extends unknown[], R>(
  fn: ((...args: Args) => R) | undefined
): ((...args: Args) => R) | undefined {
  const ref = useRef<typeof fn>(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });

  useIsomorphicLayoutEffect(() => {
    ref.current = fn;
  }, [fn]);

  return useCallback((...args: Args) => ref.current?.(...args), [ref]) as (
    ...args: Args
  ) => R;
}
```

---

### Use Event Listener (use-event-listener)
**Docs:** https://www.shadcn.io/hooks/use-event-listener
**Registry:** https://www.shadcn.io/registry/use-event-listener.json

```tsx
// File: registry/hooks/use-event-listener.ts
"use client"

import { useEffect, useRef } from "react"

import type { RefObject } from "react"

import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect"

// MediaQueryList Event based useEventListener interface
function useEventListener<K extends keyof MediaQueryListEventMap>(
  eventName: K,
  handler: (event: MediaQueryListEventMap[K]) => void,
  element: RefObject<MediaQueryList>,
  options?: boolean | AddEventListenerOptions,
): void

// Window Event based useEventListener interface
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions,
): void

// Element Event based useEventListener interface
function useEventListener<
  K extends keyof HTMLElementEventMap & keyof SVGElementEventMap,
  T extends Element = K extends keyof HTMLElementEventMap
    ? HTMLDivElement
    : SVGElement,
>(
  eventName: K,
  handler:
    | ((event: HTMLElementEventMap[K]) => void)
    | ((event: SVGElementEventMap[K]) => void),
  element: RefObject<T>,
  options?: boolean | AddEventListenerOptions,
): void

// Document Event based useEventListener interface
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: RefObject<Document>,
  options?: boolean | AddEventListenerOptions,
): void

function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap & keyof SVGElementEventMap,
  KM extends keyof MediaQueryListEventMap,
  T extends HTMLElement | SVGAElement | MediaQueryList = HTMLElement,
>(
  eventName: KW | KH | KM,
  handler: (
    event:
      | WindowEventMap[KW]
      | HTMLElementEventMap[KH]
      | SVGElementEventMap[KH]
      | MediaQueryListEventMap[KM]
      | Event,
  ) => void,
  element?: RefObject<T>,
  options?: boolean | AddEventListenerOptions,
) {
  // Create a ref that stores handler
  const savedHandler = useRef(handler)

  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    // Define the listening target
    const targetElement: T | Window = element?.current ?? window

    if (!(targetElement && targetElement.addEventListener)) return

    // Create event listener that calls handler function stored in ref
    const listener: typeof handler = (event) => {
      savedHandler.current(event)
    }

    targetElement.addEventListener(eventName, listener, options)

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, listener, options)
    }
  }, [eventName, element, options])
}

export { useEventListener }
```

---

### Use Hover (use-hover)
**Docs:** https://www.shadcn.io/hooks/use-hover
**Registry:** https://www.shadcn.io/registry/use-hover.json

```tsx
// File: registry/hooks/use-hover.tsx
"use client";

import { useState } from 'react';
import type { RefObject } from 'react';
import { useEventListener } from './use-event-listener';

export function useHover<T extends HTMLElement = HTMLElement>(
  elementRef: RefObject<T>,
): boolean {
  const [value, setValue] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setValue(true);
  };

  const handleMouseLeave = () => {
    setValue(false);
  };

  useEventListener('mouseenter', handleMouseEnter, elementRef);
  useEventListener('mouseleave', handleMouseLeave, elementRef);

  return value;
}
```

---

### Use Intersection Observer (use-intersection-observer)
**Docs:** https://www.shadcn.io/hooks/use-intersection-observer
**Registry:** https://www.shadcn.io/registry/use-intersection-observer.json

```tsx
// File: registry/hooks/use-intersection-observer.tsx
"use client";

import { useEffect, useRef, useState } from 'react';

type State = {
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
};

type UseIntersectionObserverOptions = {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
  freezeOnceVisible?: boolean;
  onChange?: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void;
  initialIsIntersecting?: boolean;
};

type IntersectionReturn = [
  (node?: Element | null) => void,
  boolean,
  IntersectionObserverEntry | undefined,
] & {
  ref: (node?: Element | null) => void;
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
};

export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = '0%',
  freezeOnceVisible = false,
  initialIsIntersecting = false,
  onChange,
}: UseIntersectionObserverOptions = {}): IntersectionReturn {
  const [ref, setRef] = useState<Element | null>(null);

  const [state, setState] = useState<State>(() => ({
    isIntersecting: initialIsIntersecting,
    entry: undefined,
  }));

  const callbackRef = useRef<UseIntersectionObserverOptions['onChange']>(undefined);

  callbackRef.current = onChange;

  const frozen = state.entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    // Ensure we have a ref to observe
    if (!ref) return;

    // Ensure the browser supports the Intersection Observer API
    if (!('IntersectionObserver' in window)) return;

    // Skip if frozen
    if (frozen) return;

    let unobserve: (() => void) | undefined;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        const thresholds = Array.isArray(observer.thresholds)
          ? observer.thresholds
          : [observer.thresholds];

        entries.forEach(entry => {
          const isIntersecting =
            entry.isIntersecting &&
            thresholds.some(threshold => entry.intersectionRatio >= threshold);

          setState({ isIntersecting, entry });

          if (callbackRef.current) {
            callbackRef.current(isIntersecting, entry);
          }

          if (isIntersecting && freezeOnceVisible && unobserve) {
            unobserve();
            unobserve = undefined;
          }
        });
      },
      { threshold, root, rootMargin },
    );

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ref,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(threshold),
    root,
    rootMargin,
    frozen,
    freezeOnceVisible,
  ]);

  // ensures that if the observed element changes, the intersection observer is reinitialized
  const prevRef = useRef<Element | null>(null);

  useEffect(() => {
    if (
      !ref &&
      state.entry?.target &&
      !freezeOnceVisible &&
      !frozen &&
      prevRef.current !== state.entry.target
    ) {
      prevRef.current = state.entry.target;
      setState({ isIntersecting: initialIsIntersecting, entry: undefined });
    }
  }, [ref, state.entry, freezeOnceVisible, frozen, initialIsIntersecting]);

  const result = [
    setRef,
    !!state.isIntersecting,
    state.entry,
  ] as IntersectionReturn;

  // Support object destructuring, by adding the specific values.
  result.ref = result[0];
  result.isIntersecting = result[1];
  result.entry = result[2];

  return result;
}

// Export types
export type { UseIntersectionObserverOptions, IntersectionReturn };
```

---

### Use Interval (use-interval)
**Docs:** https://www.shadcn.io/hooks/use-interval
**Registry:** https://www.shadcn.io/registry/use-interval.json

```tsx
// File: registry/hooks/use-interval.tsx
import { useEffect, useRef } from "react";

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>(undefined);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
```

---

### Use Is Client (use-is-client)
**Docs:** https://www.shadcn.io/hooks/use-is-client
**Registry:** https://www.shadcn.io/registry/use-is-client.json

```tsx
// File: registry/hooks/use-is-client.ts
"use client"

import { useEffect, useState } from "react"

export function useIsClient() {
  const [isClient, setClient] = useState(false)

  useEffect(() => {
    setClient(true)
  }, [])

  return isClient
}
```

---

### Use Is Mounted (use-is-mounted)
**Docs:** https://www.shadcn.io/hooks/use-is-mounted
**Registry:** https://www.shadcn.io/registry/use-is-mounted.json

```tsx
// File: registry/hooks/use-is-mounted.tsx
"use client";

import { useCallback, useEffect, useRef } from 'react';

export function useIsMounted(): () => boolean {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
}
```

---

### Use Isomorphic Layout Effect (use-isomorphic-layout-effect)
**Docs:** https://www.shadcn.io/hooks/use-isomorphic-layout-effect
**Registry:** https://www.shadcn.io/registry/use-isomorphic-layout-effect.json

```tsx
// File: registry/hooks/use-isomorphic-layout-effect.tsx
"use client";

import * as React from "react";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;
```

---

### Use Local Storage (use-local-storage)
**Docs:** https://www.shadcn.io/hooks/use-local-storage
**Registry:** https://www.shadcn.io/registry/use-local-storage.json

```tsx
// File: registry/hooks/use-local-storage.ts
"use client"

import { useCallback, useEffect, useState } from "react"

import type { Dispatch, SetStateAction } from "react"

import { useEventCallback } from "./use-event-callback"
import { useEventListener } from "./use-event-listener"

declare global {
  interface WindowEventMap {
    "local-storage": CustomEvent
  }
}

type UseLocalStorageOptions<T> = {
  serializer?: (value: T) => string
  deserializer?: (value: string) => T
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === "undefined"

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseLocalStorageOptions<T> = {},
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const { initializeWithValue = true } = options

  const serializer = useCallback<(value: T) => string>(
    (value) => {
      if (options.serializer) {
        return options.serializer(value)
      }

      return JSON.stringify(value)
    },
    [options],
  )

  const deserializer = useCallback<(value: string) => T>(
    (value) => {
      if (options.deserializer) {
        return options.deserializer(value)
      }
      // Support 'undefined' as a value
      if (value === "undefined") {
        return undefined as unknown as T
      }

      const defaultValue =
        initialValue instanceof Function ? initialValue() : initialValue

      let parsed: unknown
      try {
        parsed = JSON.parse(value)
      } catch (error) {
        console.error("Error parsing JSON:", error)
        return defaultValue // Return initialValue if parsing fails
      }

      return parsed as T
    },
    [options, initialValue],
  )

  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = useCallback((): T => {
    const initialValueToUse =
      initialValue instanceof Function ? initialValue() : initialValue

    // Prevent build error "window is undefined" but keep working
    if (IS_SERVER) {
      return initialValueToUse
    }

    try {
      const raw = window.localStorage.getItem(key)
      return raw ? deserializer(raw) : initialValueToUse
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValueToUse
    }
  }, [initialValue, key, deserializer])

  const [storedValue, setStoredValue] = useState(() => {
    if (initializeWithValue) {
      return readValue()
    }

    return initialValue instanceof Function ? initialValue() : initialValue
  })

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue: Dispatch<SetStateAction<T>> = useEventCallback((value) => {
    // Prevent build error "window is undefined" but keeps working
    if (IS_SERVER) {
      console.warn(
        `Tried setting localStorage key "${key}" even though environment is not a client`,
      )
    }

    try {
      // Allow value to be a function so we have the same API as useState
      const newValue = value instanceof Function ? value(readValue()) : value

      // Save to local storage
      window.localStorage.setItem(key, serializer(newValue))

      // Save state
      setStoredValue(newValue)

      // We dispatch a custom event so every similar useLocalStorage hook is notified
      window.dispatchEvent(new StorageEvent("local-storage", { key }))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  })

  const removeValue = useEventCallback(() => {
    // Prevent build error "window is undefined" but keeps working
    if (IS_SERVER) {
      console.warn(
        `Tried removing localStorage key "${key}" even though environment is not a client`,
      )
    }

    const defaultValue =
      initialValue instanceof Function ? initialValue() : initialValue

    // Remove the key from local storage
    window.localStorage.removeItem(key)

    // Save state with default value
    setStoredValue(defaultValue)

    // We dispatch a custom event so every similar useLocalStorage hook is notified
    window.dispatchEvent(new StorageEvent("local-storage", { key }))
  })

  useEffect(() => {
    setStoredValue(readValue())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const handleStorageChange = useCallback(
    (event: StorageEvent | CustomEvent) => {
      if ((event as StorageEvent).key && (event as StorageEvent).key !== key) {
        return
      }
      setStoredValue(readValue())
    },
    [key, readValue],
  )

  // this only works for other documents, not the current one
  useEventListener("storage", handleStorageChange)

  // this is a custom event, triggered in writeValueToLocalStorage
  // See: useLocalStorage()
  useEventListener("local-storage", handleStorageChange)

  return [storedValue, setValue, removeValue]
}

export type { UseLocalStorageOptions }
```

---

### Use Map (use-map)
**Docs:** https://www.shadcn.io/hooks/use-map
**Registry:** https://www.shadcn.io/registry/use-map.json

```tsx
// File: registry/hooks/use-map.tsx
"use client";

import { useCallback, useState } from 'react';

type MapOrEntries<K, V> = Map<K, V> | [K, V][];

type UseMapActions<K, V> = {
  set: (key: K, value: V) => void;
  setAll: (entries: MapOrEntries<K, V>) => void;
  remove: (key: K) => void;
  reset: Map<K, V>['clear'];
};

type UseMapReturn<K, V> = [
  Omit<Map<K, V>, 'set' | 'clear' | 'delete'>,
  UseMapActions<K, V>,
];

export function useMap<K, V>(
  initialState: MapOrEntries<K, V> = new Map(),
): UseMapReturn<K, V> {
  const [map, setMap] = useState(new Map(initialState));

  const actions: UseMapActions<K, V> = {
    set: useCallback((key, value) => {
      setMap(prev => {
        const copy = new Map(prev);
        copy.set(key, value);
        return copy;
      });
    }, []),

    setAll: useCallback(entries => {
      setMap(() => new Map(entries));
    }, []),

    remove: useCallback(key => {
      setMap(prev => {
        const copy = new Map(prev);
        copy.delete(key);
        return copy;
      });
    }, []),

    reset: useCallback(() => {
      setMap(() => new Map());
    }, []),
  };

  return [map, actions];
}

// Export types
export type { MapOrEntries, UseMapActions, UseMapReturn };
```

---

### Use Media Query (use-media-query)
**Docs:** https://www.shadcn.io/hooks/use-media-query
**Registry:** https://www.shadcn.io/registry/use-media-query.json

```tsx
// File: registry/hooks/use-media-query.ts
"use client"

import { useState } from "react"

import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect"

type UseMediaQueryOptions = {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === "undefined"

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {},
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue
    }
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query)
    }
    return defaultValue
  })

  // Handles the change event of the media query.
  function handleChange() {
    setMatches(getMatches(query))
  }

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query)

    // Triggered at the first client-side load and if query changes
    handleChange()

    // Use deprecated `addListener` and `removeListener` to support Safari < 14 (#135)
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange)
    } else {
      matchMedia.addEventListener("change", handleChange)
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange)
      } else {
        matchMedia.removeEventListener("change", handleChange)
      }
    }
  }, [query])

  return matches
}

export type { UseMediaQueryOptions }
```

---

### Use Mouse Position (use-mouse-position)
**Docs:** https://www.shadcn.io/hooks/use-mouse-position
**Registry:** https://www.shadcn.io/registry/use-mouse-position.json

```tsx
// File: registry/hooks/use-mouse-position.ts
"use client"

import * as React from "react"

export type Position = {
  x: number
  y: number
  elementX?: number
  elementY?: number
  elementPositionX?: number
  elementPositionY?: number
}

export function useMousePosition<T extends HTMLElement>(): [
  Position,
  React.Ref<T>,
] {
  const [state, setState] = React.useState<Position>({
    x: 0,
    y: 0,
  })

  const ref = React.useRef<T>(null)

  React.useLayoutEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const newState: Position = {
        x: event.pageX,
        y: event.pageY,
      }

      if (ref.current?.nodeType === Node.ELEMENT_NODE) {
        const { left, top } = ref.current.getBoundingClientRect()
        const elementPositionX = left + window.scrollX
        const elementPositionY = top + window.scrollY
        const elementX = event.pageX - elementPositionX
        const elementY = event.pageY - elementPositionY

        newState.elementPositionX = elementPositionX
        newState.elementPositionY = elementPositionY
        newState.elementX = elementX
        newState.elementY = elementY
      }

      setState((s) => ({
        ...s,
        ...newState,
      }))
    }

    document.addEventListener("mousemove", handleMouseMove)

    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return [state, ref]
}
```

---

### Use On Click Outside (use-on-click-outside)
**Docs:** https://www.shadcn.io/hooks/use-on-click-outside
**Registry:** https://www.shadcn.io/registry/use-on-click-outside.json

```tsx
// File: registry/hooks/use-on-click-outside.tsx
"use client";

import type { RefObject } from 'react';
import { useEventListener } from './use-event-listener';

type EventType =
  | 'mousedown'
  | 'mouseup'
  | 'touchstart'
  | 'touchend'
  | 'focusin'
  | 'focusout';

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T> | RefObject<T>[],
  handler: (event: MouseEvent | TouchEvent | FocusEvent) => void,
  eventType: EventType = 'mousedown',
  eventListenerOptions: AddEventListenerOptions = {},
): void {
  useEventListener(
    eventType,
    event => {
      const target = event.target as Node;

      // Do nothing if the target is not connected element with document
      if (!target || !target.isConnected) {
        return;
      }

      const isOutside = Array.isArray(ref)
        ? ref
            .filter(r => Boolean(r.current))
            .every(r => r.current && !r.current.contains(target))
        : ref.current && !ref.current.contains(target);

      if (isOutside) {
        handler(event);
      }
    },
    undefined,
    eventListenerOptions,
  );
}

// Export types
export type { EventType };
```

---

### Use Read Local Storage (use-read-local-storage)
**Docs:** https://www.shadcn.io/hooks/use-read-local-storage
**Registry:** https://www.shadcn.io/registry/use-read-local-storage.json

```tsx
// File: registry/hooks/use-read-local-storage.ts
"use client"

import { useCallback, useEffect, useState } from "react"

import { useEventListener } from "./use-event-listener"

const IS_SERVER = typeof window === "undefined"

type Options<T, InitializeWithValue extends boolean | undefined> = {
  deserializer?: (value: string) => T
  initializeWithValue: InitializeWithValue
}

// SSR version
export function useReadLocalStorage<T>(
  key: string,
  options: Options<T, false>,
): T | null | undefined
// CSR version
export function useReadLocalStorage<T>(
  key: string,
  options?: Partial<Options<T, true>>,
): T | null
export function useReadLocalStorage<T>(
  key: string,
  options: Partial<Options<T, boolean>> = {},
): T | null | undefined {
  let { initializeWithValue = true } = options
  if (IS_SERVER) {
    initializeWithValue = false
  }

  const deserializer = useCallback<(value: string) => T | null>(
    (value) => {
      if (options.deserializer) {
        return options.deserializer(value)
      }
      // Support 'undefined' as a value
      if (value === "undefined") {
        return undefined as unknown as T
      }

      let parsed: unknown
      try {
        parsed = JSON.parse(value)
      } catch (error) {
        console.error("Error parsing JSON:", error)
        return null
      }

      return parsed as T
    },
    [options],
  )

  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = useCallback((): T | null => {
    // Prevent build error "window is undefined" but keep keep working
    if (IS_SERVER) {
      return null
    }

    try {
      const raw = window.localStorage.getItem(key)
      return raw ? deserializer(raw) : null
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return null
    }
  }, [key, deserializer])

  const [storedValue, setStoredValue] = useState(() => {
    if (initializeWithValue) {
      return readValue()
    }
    return undefined
  })

  // Listen if localStorage changes
  useEffect(() => {
    setStoredValue(readValue())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const handleStorageChange = useCallback(
    (event: StorageEvent | CustomEvent) => {
      if ((event as StorageEvent).key && (event as StorageEvent).key !== key) {
        return
      }
      setStoredValue(readValue())
    },
    [key, readValue],
  )

  // this only works for other documents, not the current one
  useEventListener("storage", handleStorageChange)

  // this is a custom event, triggered in writeValueToLocalStorage
  // See: useLocalStorage()
  useEventListener("local-storage", handleStorageChange)

  return storedValue
}

export type { Options }
```

---

### Use Resize Observer (use-resize-observer)
**Docs:** https://www.shadcn.io/hooks/use-resize-observer
**Registry:** https://www.shadcn.io/registry/use-resize-observer.json

```tsx
// File: registry/hooks/use-resize-observer.tsx
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { useIsMounted } from './use-is-mounted';

type Size = {
  width: number | undefined;
  height: number | undefined;
};

type UseResizeObserverOptions<T extends HTMLElement = HTMLElement> = {
  ref: RefObject<T>;
  onResize?: (size: Size) => void;
  box?: 'border-box' | 'content-box' | 'device-pixel-content-box';
};

const initialSize: Size = {
  width: undefined,
  height: undefined,
};

export function useResizeObserver<T extends HTMLElement = HTMLElement>(
  options: UseResizeObserverOptions<T>,
): Size {
  const { ref, box = 'content-box' } = options;
  const [{ width, height }, setSize] = useState<Size>(initialSize);
  const isMounted = useIsMounted();
  const previousSize = useRef<Size>({ ...initialSize });
  const onResize = useRef<((size: Size) => void) | undefined>(undefined);
  onResize.current = options.onResize;

  useEffect(() => {
    if (!ref.current) return;

    if (typeof window === 'undefined' || !('ResizeObserver' in window)) return;

    const observer = new ResizeObserver(([entry]) => {
      const boxProp =
        box === 'border-box'
          ? 'borderBoxSize'
          : box === 'device-pixel-content-box'
            ? 'devicePixelContentBoxSize'
            : 'contentBoxSize';

      const newWidth = extractSize(entry, boxProp, 'inlineSize');
      const newHeight = extractSize(entry, boxProp, 'blockSize');

      const hasChanged =
        previousSize.current.width !== newWidth ||
        previousSize.current.height !== newHeight;

      if (hasChanged) {
        const newSize: Size = { width: newWidth, height: newHeight };
        previousSize.current.width = newWidth;
        previousSize.current.height = newHeight;

        if (onResize.current) {
          onResize.current(newSize);
        } else {
          if (isMounted()) {
            setSize(newSize);
          }
        }
      }
    });

    observer.observe(ref.current, { box });

    return () => {
      observer.disconnect();
    };
  }, [box, ref, isMounted]);

  return { width, height };
}

type BoxSizesKey = keyof Pick<
  ResizeObserverEntry,
  'borderBoxSize' | 'contentBoxSize' | 'devicePixelContentBoxSize'
>;

function extractSize(
  entry: ResizeObserverEntry,
  box: BoxSizesKey,
  sizeType: keyof ResizeObserverSize,
): number | undefined {
  if (!entry[box]) {
    if (box === 'contentBoxSize') {
      return entry.contentRect[sizeType === 'inlineSize' ? 'width' : 'height'];
    }
    return undefined;
  }

  return Array.isArray(entry[box])
    ? entry[box][0][sizeType]
    : // @ts-ignore Support Firefox's non-standard behavior
      (entry[box][sizeType] as number);
}

export type { Size, UseResizeObserverOptions };
```

---

### Use Screen (use-screen)
**Docs:** https://www.shadcn.io/hooks/use-screen
**Registry:** https://www.shadcn.io/registry/use-screen.json

```tsx
// File: registry/hooks/use-screen.tsx
import { useState } from 'react';
import { useDebounceCallback } from './use-debounce-callback';
import { useEventListener } from './use-event-listener';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';

type UseScreenOptions<InitializeWithValue extends boolean | undefined> = {
  initializeWithValue: InitializeWithValue;
  debounceDelay?: number;
};

const IS_SERVER = typeof window === 'undefined';

export function useScreen(options: UseScreenOptions<false>): Screen | undefined;
export function useScreen(options?: Partial<UseScreenOptions<true>>): Screen;
export function useScreen(
  options: Partial<UseScreenOptions<boolean>> = {},
): Screen | undefined {
  let { initializeWithValue = true } = options;
  if (IS_SERVER) {
    initializeWithValue = false;
  }

  const readScreen = () => {
    if (IS_SERVER) {
      return undefined;
    }
    return window.screen;
  };

  const [screen, setScreen] = useState<Screen | undefined>(() => {
    if (initializeWithValue) {
      return readScreen();
    }
    return undefined;
  });

  const debouncedSetScreen = useDebounceCallback(
    setScreen,
    options.debounceDelay,
  );

  function handleSize() {
    const newScreen = readScreen();
    const setSize = options.debounceDelay ? debouncedSetScreen : setScreen;

    if (newScreen) {
      const {
        width,
        height,
        availHeight,
        availWidth,
        colorDepth,
        orientation,
        pixelDepth,
      } = newScreen;

      setSize({
        width,
        height,
        availHeight,
        availWidth,
        colorDepth,
        orientation,
        pixelDepth,
      });
    }
  }

  useEventListener('resize', handleSize);

  useIsomorphicLayoutEffect(() => {
    handleSize();
  }, []);

  return screen;
}

export type { UseScreenOptions };
```

---

### Use Script (use-script)
**Docs:** https://www.shadcn.io/hooks/use-script
**Registry:** https://www.shadcn.io/registry/use-script.json

```tsx
// File: registry/hooks/use-script.tsx
import { useEffect, useState } from 'react';

type UseScriptStatus = 'idle' | 'loading' | 'ready' | 'error';

type UseScriptOptions = {
  shouldPreventLoad?: boolean;
  removeOnUnmount?: boolean;
  id?: string;
};

const cachedScriptStatuses = new Map<string, UseScriptStatus | undefined>();

function getScriptNode(src: string) {
  const node: HTMLScriptElement | null = document.querySelector(
    `script[src="${src}"]`,
  );
  const status = node?.getAttribute('data-status') as
    | UseScriptStatus
    | undefined;

  return {
    node,
    status,
  };
}

export function useScript(
  src: string | null,
  options?: UseScriptOptions,
): UseScriptStatus {
  const [status, setStatus] = useState<UseScriptStatus>(() => {
    if (!src || options?.shouldPreventLoad) {
      return 'idle';
    }

    if (typeof window === 'undefined') {
      return 'loading';
    }

    return cachedScriptStatuses.get(src) ?? 'loading';
  });

  useEffect(() => {
    if (!src || options?.shouldPreventLoad) {
      return;
    }

    const cachedScriptStatus = cachedScriptStatuses.get(src);
    if (cachedScriptStatus === 'ready' || cachedScriptStatus === 'error') {
      setStatus(cachedScriptStatus);
      return;
    }

    const script = getScriptNode(src);
    let scriptNode = script.node;

    if (!scriptNode) {
      scriptNode = document.createElement('script');
      scriptNode.src = src;
      scriptNode.async = true;
      if (options?.id) {
        scriptNode.id = options.id;
      }
      scriptNode.setAttribute('data-status', 'loading');
      document.body.appendChild(scriptNode);

      const setAttributeFromEvent = (event: Event) => {
        const scriptStatus: UseScriptStatus =
          event.type === 'load' ? 'ready' : 'error';

        scriptNode?.setAttribute('data-status', scriptStatus);
      };

      scriptNode.addEventListener('load', setAttributeFromEvent);
      scriptNode.addEventListener('error', setAttributeFromEvent);
    } else {
      setStatus(script.status ?? cachedScriptStatus ?? 'loading');
    }

    const setStateFromEvent = (event: Event) => {
      const newStatus = event.type === 'load' ? 'ready' : 'error';
      setStatus(newStatus);
      cachedScriptStatuses.set(src, newStatus);
    };

    scriptNode.addEventListener('load', setStateFromEvent);
    scriptNode.addEventListener('error', setStateFromEvent);

    return () => {
      if (scriptNode) {
        scriptNode.removeEventListener('load', setStateFromEvent);
        scriptNode.removeEventListener('error', setStateFromEvent);
      }

      if (scriptNode && options?.removeOnUnmount) {
        scriptNode.remove();
        cachedScriptStatuses.delete(src);
      }
    };
  }, [src, options?.shouldPreventLoad, options?.removeOnUnmount, options?.id]);

  return status;
}

export type { UseScriptStatus, UseScriptOptions };
```

---

### Use Scroll Lock (use-scroll-lock)
**Docs:** https://www.shadcn.io/hooks/use-scroll-lock
**Registry:** https://www.shadcn.io/registry/use-scroll-lock.json

```tsx
// File: registry/hooks/use-scroll-lock.ts
"use client"

import { useRef, useState, useCallback } from "react"

import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect"

type UseScrollLockOptions = {
  autoLock?: boolean
  lockTarget?: HTMLElement | string
  widthReflow?: boolean
}

type UseScrollLockReturn = {
  isLocked: boolean
  lock: () => void
  unlock: () => void
}

type OriginalStyle = {
  overflow: CSSStyleDeclaration["overflow"]
  paddingRight: CSSStyleDeclaration["paddingRight"]
}

const IS_SERVER = typeof window === "undefined"

export function useScrollLock(
  options: UseScrollLockOptions = {},
): UseScrollLockReturn {
  const { autoLock = true, lockTarget, widthReflow = true } = options
  const [isLocked, setIsLocked] = useState(false)
  const target = useRef<HTMLElement | null>(null)
  const originalStyle = useRef<OriginalStyle | null>(null)

  const lock = useCallback(() => {
    if (target.current) {
      const { overflow, paddingRight } = target.current.style

      // Save the original styles
      originalStyle.current = { overflow, paddingRight }

      // Prevent width reflow
      if (widthReflow) {
        // Use window inner width if body is the target as global scrollbar isn't part of the document
        const offsetWidth =
          target.current === document.body
            ? window.innerWidth
            : target.current.offsetWidth
        // Get current computed padding right in pixels
        const currentPaddingRight =
          parseInt(window.getComputedStyle(target.current).paddingRight, 10) ||
          0

        const scrollbarWidth = offsetWidth - target.current.scrollWidth
        target.current.style.paddingRight = `${scrollbarWidth + currentPaddingRight}px`
      }

      // Lock the scroll
      target.current.style.overflow = "hidden"

      setIsLocked(true)
    }
  }, [widthReflow])

  const unlock = useCallback(() => {
    if (target.current && originalStyle.current) {
      target.current.style.overflow = originalStyle.current.overflow

      // Only reset padding right if we changed it
      if (widthReflow) {
        target.current.style.paddingRight = originalStyle.current.paddingRight
      }
    }

    setIsLocked(false)
  }, [widthReflow])

  useIsomorphicLayoutEffect(() => {
    if (IS_SERVER) return

    // Re-find the target element each time
    if (lockTarget) {
      target.current =
        typeof lockTarget === "string"
          ? document.querySelector(lockTarget)
          : lockTarget
    }

    if (!target.current) {
      target.current = document.body
    }

    if (autoLock) {
      lock()
    }

    return () => {
      unlock()
    }
  }, [autoLock, lockTarget, widthReflow, lock, unlock])

  return { isLocked, lock, unlock }
}

export type { UseScrollLockOptions, UseScrollLockReturn }
```

---

### Use Session Storage (use-session-storage)
**Docs:** https://www.shadcn.io/hooks/use-session-storage
**Registry:** https://www.shadcn.io/registry/use-session-storage.json

```tsx
// File: registry/hooks/use-session-storage.tsx
import { useCallback, useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useEventCallback } from './use-event-callback';
import { useEventListener } from './use-event-listener';

declare global {
  interface WindowEventMap {
    'session-storage': CustomEvent;
  }
}

type UseSessionStorageOptions<T> = {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === 'undefined';

export function useSessionStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseSessionStorageOptions<T> = {},
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const { initializeWithValue = true } = options;

  const serializer = useCallback<(value: T) => string>(
    value => {
      if (options.serializer) {
        return options.serializer(value);
      }

      return JSON.stringify(value);
    },
    [options],
  );

  const deserializer = useCallback<(value: string) => T>(
    value => {
      if (options.deserializer) {
        return options.deserializer(value);
      }
      if (value === 'undefined') {
        return undefined as unknown as T;
      }

      const defaultValue =
        initialValue instanceof Function ? initialValue() : initialValue;

      let parsed: unknown;
      try {
        parsed = JSON.parse(value);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return defaultValue;
      }

      return parsed as T;
    },
    [options, initialValue],
  );

  const readValue = useCallback((): T => {
    const initialValueToUse =
      initialValue instanceof Function ? initialValue() : initialValue;

    if (IS_SERVER) {
      return initialValueToUse;
    }

    try {
      const raw = window.sessionStorage.getItem(key);
      return raw ? deserializer(raw) : initialValueToUse;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValueToUse;
    }
  }, [initialValue, key, deserializer]);

  const [storedValue, setStoredValue] = useState(() => {
    if (initializeWithValue) {
      return readValue();
    }

    return initialValue instanceof Function ? initialValue() : initialValue;
  });

  const setValue: Dispatch<SetStateAction<T>> = useEventCallback(value => {
    if (IS_SERVER) {
      console.warn(
        `Tried setting sessionStorage key "${key}" even though environment is not a client`,
      );
    }

    try {
      const newValue = value instanceof Function ? value(readValue()) : value;

      window.sessionStorage.setItem(key, serializer(newValue));

      setStoredValue(newValue);

      window.dispatchEvent(new StorageEvent('session-storage', { key }));
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  });

  const removeValue = useEventCallback(() => {
    if (IS_SERVER) {
      console.warn(
        `Tried removing sessionStorage key "${key}" even though environment is not a client`,
      );
    }

    const defaultValue =
      initialValue instanceof Function ? initialValue() : initialValue;

    window.sessionStorage.removeItem(key);

    setStoredValue(defaultValue);

    window.dispatchEvent(new StorageEvent('session-storage', { key }));
  });

  useEffect(() => {
    setStoredValue(readValue());
  }, [key]);

  const handleStorageChange = useCallback(
    (event: StorageEvent | CustomEvent) => {
      if ((event as StorageEvent).key && (event as StorageEvent).key !== key) {
        return;
      }
      setStoredValue(readValue());
    },
    [key, readValue],
  );

  useEventListener('storage', handleStorageChange);

  useEventListener('session-storage', handleStorageChange);

  return [storedValue, setValue, removeValue];
}

export type { UseSessionStorageOptions };
```

---

### Use Step (use-step)
**Docs:** https://www.shadcn.io/hooks/use-step
**Registry:** https://www.shadcn.io/registry/use-step.json

```tsx
// File: registry/hooks/use-step.tsx
"use client";

import { useCallback, useState } from 'react'

import type { Dispatch, SetStateAction } from 'react'

type UseStepActions = {
  goToNextStep: () => void
  goToPrevStep: () => void
  reset: () => void
  canGoToNextStep: boolean
  canGoToPrevStep: boolean
  setStep: Dispatch<SetStateAction<number>>
}

type SetStepCallbackType = (step: number | ((step: number) => number)) => void

export function useStep(maxStep: number): [number, UseStepActions] {
  const [currentStep, setCurrentStep] = useState(1)

  const canGoToNextStep = currentStep + 1 <= maxStep
  const canGoToPrevStep = currentStep - 1 > 0

  const setStep = useCallback<SetStepCallbackType>(
    step => {
      const newStep = step instanceof Function ? step(currentStep) : step

      if (newStep >= 1 && newStep <= maxStep) {
        setCurrentStep(newStep)
        return
      }

      throw new Error('Step not valid')
    },
    [maxStep, currentStep],
  )

  const goToNextStep = useCallback(() => {
    if (canGoToNextStep) {
      setCurrentStep(step => step + 1)
    }
  }, [canGoToNextStep])

  const goToPrevStep = useCallback(() => {
    if (canGoToPrevStep) {
      setCurrentStep(step => step - 1)
    }
  }, [canGoToPrevStep])

  const reset = useCallback(() => {
    setCurrentStep(1)
  }, [])

  return [
    currentStep,
    {
      goToNextStep,
      goToPrevStep,
      canGoToNextStep,
      canGoToPrevStep,
      setStep,
      reset,
    },
  ]
}

export type { UseStepActions };
```

---

### Use Ternary Dark Mode (use-ternary-dark-mode)
**Docs:** https://www.shadcn.io/hooks/use-ternary-dark-mode
**Registry:** https://www.shadcn.io/registry/use-ternary-dark-mode.json

```tsx
// File: registry/hooks/use-ternary-dark-mode.ts
"use client"

import type { Dispatch, SetStateAction } from "react"

import { useLocalStorage } from "./use-local-storage"
import { useMediaQuery } from "./use-media-query"

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"
const LOCAL_STORAGE_KEY = "use-ternary-dark-mode"

export type TernaryDarkMode = "system" | "dark" | "light"

export type TernaryDarkModeOptions = {
  defaultValue?: TernaryDarkMode
  localStorageKey?: string
  initializeWithValue?: boolean
}

export type TernaryDarkModeReturn = {
  isDarkMode: boolean
  ternaryDarkMode: TernaryDarkMode
  setTernaryDarkMode: Dispatch<SetStateAction<TernaryDarkMode>>
  toggleTernaryDarkMode: () => void
}

export function useTernaryDarkMode({
  defaultValue = "system",
  localStorageKey = LOCAL_STORAGE_KEY,
  initializeWithValue = true,
}: TernaryDarkModeOptions = {}): TernaryDarkModeReturn {
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY, { initializeWithValue })
  const [mode, setMode] = useLocalStorage(localStorageKey, defaultValue, {
    initializeWithValue,
  })

  const isDarkMode = mode === "dark" || (mode === "system" && isDarkOS)

  const toggleTernaryDarkMode = () => {
    const modes: TernaryDarkMode[] = ["light", "system", "dark"]
    setMode((prevMode): TernaryDarkMode => {
      const nextIndex = (modes.indexOf(prevMode) + 1) % modes.length
      return modes[nextIndex]
    })
  }

  return {
    isDarkMode,
    ternaryDarkMode: mode,
    setTernaryDarkMode: setMode,
    toggleTernaryDarkMode,
  }
}
```

---

### Use Timeout (use-timeout)
**Docs:** https://www.shadcn.io/hooks/use-timeout
**Registry:** https://www.shadcn.io/registry/use-timeout.json

```tsx
// File: registry/hooks/use-timeout.tsx
"use client";

import * as React from "react";

export function useTimeout(callback: () => void, delay: number | null): void {
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (delay === null || typeof delay !== "number") return;

    const tick = () => savedCallback.current();

    const id = setTimeout(tick, delay);

    return () => clearTimeout(id);
  }, [delay]);
}
```

---

### Use Toggle (use-toggle)
**Docs:** https://www.shadcn.io/hooks/use-toggle
**Registry:** https://www.shadcn.io/registry/use-toggle.json

```tsx
// File: registry/hooks/use-toggle.tsx
"use client";

import * as React from "react";

type UseToggleReturn = [
  boolean,
  () => void,
  React.Dispatch<React.SetStateAction<boolean>>
];

export function useToggle(defaultValue = false): UseToggleReturn {
  if (typeof defaultValue !== "boolean") {
    throw new Error("defaultValue must be `true` or `false`");
  }
  
  const [value, setValue] = React.useState(defaultValue);

  const toggle = React.useCallback(() => {
    setValue((x) => !x);
  }, []);

  return [value, toggle, setValue];
}

export type { UseToggleReturn };
```

---

### Use Unmount (use-unmount)
**Docs:** https://www.shadcn.io/hooks/use-unmount
**Registry:** https://www.shadcn.io/registry/use-unmount.json

```tsx
// File: registry/hooks/use-unmount.tsx
"use client";

import * as React from "react";

/**
 * A React hook that runs a cleanup function when the component unmounts.
 * 
 * @param fn - The cleanup function to run on unmount
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   useUnmount(() => {
 *     // Cleanup logic here
 *     console.log('Component is unmounting');
 *   });
 * 
 *   return <div>Hello world</div>;
 * }
 * ```
 */
export function useUnmount(fn: () => void): void {
  if (typeof fn !== "function") {
    throw new Error("useUnmount expects a function as argument");
  }

  const fnRef = React.useRef(fn);
  
  // Keep the function reference up to date
  fnRef.current = fn;

  React.useEffect(() => {
    // Return the cleanup function that will be called on unmount
    return () => {
      fnRef.current();
    };
  }, []);
}
```

---

### Use Window Size (use-window-size)
**Docs:** https://www.shadcn.io/hooks/use-window-size
**Registry:** https://www.shadcn.io/registry/use-window-size.json

```tsx
// File: registry/hooks/use-window-size.tsx
"use client";

import { useState } from "react";
import { useDebounceCallback } from "./use-debounce-callback";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";
import * as React from "react";

type WindowSize<T extends number | undefined = number | undefined> = {
  width: T;
  height: T;
};

type UseWindowSizeOptions<InitializeWithValue extends boolean | undefined> = {
  initializeWithValue: InitializeWithValue;
  debounceDelay?: number;
};

const IS_SERVER = typeof window === "undefined";

// Compact event listener hook for resize events
function useEventListener(eventName: string, handler: () => void) {
  const savedHandler = React.useRef(handler);
  
  React.useEffect(() => { savedHandler.current = handler; }, [handler]);
  
  React.useEffect(() => {
    if (IS_SERVER) return;
    const eventListener = () => savedHandler.current();
    window.addEventListener(eventName, eventListener);
    return () => window.removeEventListener(eventName, eventListener);
  }, [eventName]);
}

// SSR version of useWindowSize.
export function useWindowSize(options: UseWindowSizeOptions<false>): WindowSize;
// CSR version of useWindowSize.
export function useWindowSize(
  options?: Partial<UseWindowSizeOptions<true>>
): WindowSize<number>;
export function useWindowSize(
  options: Partial<UseWindowSizeOptions<boolean>> = {}
): WindowSize | WindowSize<number> {
  let { initializeWithValue = true } = options;
  if (IS_SERVER) {
    initializeWithValue = false;
  }

  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    if (initializeWithValue) {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return {
      width: undefined,
      height: undefined,
    };
  });

  const debouncedSetWindowSize = useDebounceCallback(
    setWindowSize,
    options.debounceDelay
  );

  function handleSize() {
    const setSize = options.debounceDelay
      ? debouncedSetWindowSize
      : setWindowSize;

    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  useEventListener("resize", handleSize);

  // Set size at the first client-side load
  useIsomorphicLayoutEffect(() => {
    handleSize();
  }, []);

  return windowSize;
}
```

---

## text

### Counting Number (counting-number)
**Docs:** https://www.shadcn.io/text/counting-number
**Registry:** https://www.shadcn.io/registry/counting-number.json
**Dependencies:** motion

```tsx
// File: components/ui/shadcn-io/counting-number/index.tsx
'use client';

import * as React from 'react';
import {
  type SpringOptions,
  type UseInViewOptions,
  useInView,
  useMotionValue,
  useSpring,
} from 'motion/react';

type CountingNumberProps = React.ComponentProps<'span'> & {
  number: number;
  fromNumber?: number;
  padStart?: boolean;
  inView?: boolean;
  inViewMargin?: UseInViewOptions['margin'];
  inViewOnce?: boolean;
  decimalSeparator?: string;
  transition?: SpringOptions;
  decimalPlaces?: number;
};

function CountingNumber({
  ref,
  number,
  fromNumber = 0,
  padStart = false,
  inView = false,
  inViewMargin = '0px',
  inViewOnce = true,
  decimalSeparator = '.',
  transition = { stiffness: 90, damping: 50 },
  decimalPlaces = 0,
  className,
  ...props
}: CountingNumberProps) {
  const localRef = React.useRef<HTMLSpanElement>(null);
  React.useImperativeHandle(ref as any, () => localRef.current as HTMLSpanElement);

  const numberStr = number.toString();
  const decimals =
    typeof decimalPlaces === 'number'
      ? decimalPlaces
      : numberStr.includes('.')
        ? (numberStr.split('.')[1]?.length ?? 0)
        : 0;

  const motionVal = useMotionValue(fromNumber);
  const springVal = useSpring(motionVal, transition);
  const inViewResult = useInView(localRef, {
    once: inViewOnce,
    margin: inViewMargin,
  });
  const isInView = !inView || inViewResult;

  React.useEffect(() => {
    if (isInView) motionVal.set(number);
  }, [isInView, number, motionVal]);

  React.useEffect(() => {
    const unsubscribe = springVal.on('change', (latest) => {
      if (localRef.current) {
        let formatted =
          decimals > 0
            ? latest.toFixed(decimals)
            : Math.round(latest).toString();

        if (decimals > 0) {
          formatted = formatted.replace('.', decimalSeparator);
        }

        if (padStart) {
          const finalIntLength = Math.floor(Math.abs(number)).toString().length;
          const [intPart, fracPart] = formatted.split(decimalSeparator);
          const paddedInt = intPart?.padStart(finalIntLength, '0') ?? '';
          formatted = fracPart
            ? `${paddedInt}${decimalSeparator}${fracPart}`
            : paddedInt;
        }

        localRef.current.textContent = formatted;
      }
    });
    return () => unsubscribe();
  }, [springVal, decimals, padStart, number, decimalSeparator]);

  const finalIntLength = Math.floor(Math.abs(number)).toString().length;
  const initialText = padStart
    ? '0'.padStart(finalIntLength, '0') +
      (decimals > 0 ? decimalSeparator + '0'.repeat(decimals) : '')
    : '0' + (decimals > 0 ? decimalSeparator + '0'.repeat(decimals) : '');

  return (
    <span
      ref={localRef}
      data-slot="counting-number"
      className={className}
      {...(props as any)}
    >
      {initialText}
    </span>
  );
}

export { CountingNumber, type CountingNumberProps };
```

---

### Gradient Text (gradient-text)
**Docs:** https://www.shadcn.io/text/gradient-text
**Registry:** https://www.shadcn.io/registry/gradient-text.json
**Dependencies:** motion

```tsx
// File: components/ui/shadcn-io/gradient-text/index.tsx
'use client';
 
import * as React from 'react';
import { motion, type Transition } from 'motion/react';
 
import { cn } from '@/lib/utils';
 
type GradientTextProps = React.ComponentProps<'span'> & {
  text: string;
  gradient?: string;
  neon?: boolean;
  transition?: Transition;
};
 
function GradientText({
  text,
  className,
  gradient = 'linear-gradient(90deg, #3b82f6 0%, #a855f7 20%, #ec4899 50%, #a855f7 80%, #3b82f6 100%)',
  neon = false,
  transition = { duration: 3, repeat: Infinity, ease: 'linear' },
  ...props
}: GradientTextProps) {
  const baseStyle: React.CSSProperties = {
    backgroundImage: gradient,
  };
 
  return (
    <span
      data-slot="gradient-text"
      className={cn('relative inline-block', className)}
      {...(props as any)}
    >
      <motion.span
        className="m-0 text-transparent bg-clip-text bg-[length:200%_100%]"
        style={baseStyle}
        animate={{ backgroundPositionX: ['0%', '200%'] }}
        transition={transition}
      >
        {text}
      </motion.span>
 
      {neon && (
        <motion.span
          className="m-0 absolute top-0 left-0 text-transparent bg-clip-text blur-[8px] mix-blend-plus-lighter bg-[length:200%_100%]"
          style={baseStyle}
          animate={{ backgroundPositionX: ['0%', '200%'] }}
          transition={transition}
        >
          {text}
        </motion.span>
      )}
    </span>
  );
}
 
export { GradientText, type GradientTextProps };
```

---

### Highlight Text (highlight-text)
**Docs:** https://www.shadcn.io/text/highlight-text
**Registry:** https://www.shadcn.io/registry/highlight-text.json
**Dependencies:** motion

```tsx
// File: components/ui/shadcn-io/highlight-text/index.tsx
'use client';

import * as React from 'react';
import {
  motion,
  useInView,
  type HTMLMotionProps,
  type Transition,
  type UseInViewOptions,
} from 'motion/react';

import { cn } from '@repo/shadcn-ui/lib/utils';

type HighlightTextProps = HTMLMotionProps<'span'> & {
  text: string;
  inView?: boolean;
  inViewMargin?: UseInViewOptions['margin'];
  inViewOnce?: boolean;
  transition?: Transition;
};

function HighlightText({
  ref,
  text,
  className,
  inView = false,
  inViewMargin = '0px',
  inViewOnce = true,
  transition = { duration: 2, ease: 'easeInOut' },
  ...props
}: HighlightTextProps) {
  const localRef = React.useRef<HTMLSpanElement>(null);
  React.useImperativeHandle(ref as any, () => localRef.current as HTMLSpanElement);

  const inViewResult = useInView(localRef, {
    once: inViewOnce,
    margin: inViewMargin,
  });
  const isInView = !inView || inViewResult;

  return (
    <motion.span
      ref={localRef}
      data-slot="highlight-text"
      initial={{
        backgroundSize: '0% 100%',
      }}
      animate={isInView ? { backgroundSize: '100% 100%' } : undefined}
      transition={transition}
      style={{
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
        display: 'inline',
      }}
      className={cn(
        `relative inline-block px-2 py-1 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-500 dark:to-purple-500`,
        className,
      )}
      {...(props as any)}
    >
      {text}
    </motion.span>
  );
}

export { HighlightText, type HighlightTextProps };
```

---

### Rolling Text (rolling-text)
**Docs:** https://www.shadcn.io/text/rolling-text
**Registry:** https://www.shadcn.io/registry/rolling-text.json
**Dependencies:** motion

```tsx
// File: components/ui/shadcn-io/rolling-text/index.tsx
'use client';
 
import * as React from 'react';
import {
  motion,
  useInView,
  type UseInViewOptions,
  type Transition,
} from 'motion/react';
 
const ENTRY_ANIMATION = {
  initial: { rotateX: 0 },
  animate: { rotateX: 90 },
};
 
const EXIT_ANIMATION = {
  initial: { rotateX: 90 },
  animate: { rotateX: 0 },
};
 
const formatCharacter = (char: string) => (char === ' ' ? '\u00A0' : char);
 
type RollingTextProps = Omit<React.ComponentProps<'span'>, 'children'> & {
  transition?: Transition;
  inView?: boolean;
  inViewMargin?: UseInViewOptions['margin'];
  inViewOnce?: boolean;
  text: string;
};
 
function RollingText({
  ref,
  transition = { duration: 0.5, delay: 0.1, ease: 'easeOut' },
  inView = false,
  inViewMargin = '0px',
  inViewOnce = true,
  text,
  ...props
}: RollingTextProps) {
  const localRef = React.useRef<HTMLSpanElement>(null);
  React.useImperativeHandle(ref as any, () => localRef.current!);
 
  const inViewResult = useInView(localRef, {
    once: inViewOnce,
    margin: inViewMargin,
  });
  const isInView = !inView || inViewResult;
 
  const characters = React.useMemo(() => text.split(''), [text]);
 
  return (
    <span data-slot="rolling-text" {...(props as any)} ref={ref}>
      {characters.map((char, idx) => (
        <span
          key={idx}
          className="relative inline-block perspective-[9999999px] transform-3d w-auto"
          aria-hidden="true"
        >
          <motion.span
            className="absolute inline-block backface-hidden origin-[50%_25%]"
            initial={ENTRY_ANIMATION.initial}
            animate={isInView ? ENTRY_ANIMATION.animate : undefined}
            transition={{
              ...transition,
              delay: idx * (transition?.delay ?? 0),
            }}
          >
            {formatCharacter(char)}
          </motion.span>
          <motion.span
            className="absolute inline-block backface-hidden origin-[50%_100%]"
            initial={EXIT_ANIMATION.initial}
            animate={isInView ? EXIT_ANIMATION.animate : undefined}
            transition={{
              ...transition,
              delay: idx * (transition?.delay ?? 0) + 0.3,
            }}
          >
            {formatCharacter(char)}
          </motion.span>
          <span className="invisible">{formatCharacter(char)}</span>
        </span>
      ))}
 
      <span className="sr-only">{text}</span>
    </span>
  );
}
 
export { RollingText, type RollingTextProps };
```

---

### Rotating Text (rotating-text)
**Docs:** https://www.shadcn.io/text/rotating-text
**Registry:** https://www.shadcn.io/registry/rotating-text.json
**Dependencies:** motion

```tsx
// File: components/ui/shadcn-io/rotating-text/index.tsx
'use client';
 
import * as React from 'react';
import {
  AnimatePresence,
  motion,
  type HTMLMotionProps,
  type Transition,
} from 'motion/react';
 
import { cn } from '@repo/shadcn-ui/lib/utils';
 
type RotatingTextProps = {
  text: string | string[];
  duration?: number;
  transition?: Transition;
  y?: number;
  containerClassName?: string;
} & HTMLMotionProps<'div'>;
 
function RotatingText({
  text,
  y = -50,
  duration = 2000,
  transition = { duration: 0.3, ease: 'easeOut' },
  containerClassName,
  ...props
}: RotatingTextProps) {
  const [index, setIndex] = React.useState(0);
 
  React.useEffect(() => {
    if (!Array.isArray(text)) return;
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % text.length);
    }, duration);
    return () => clearInterval(interval);
  }, [text, duration]);
 
  const currentText = Array.isArray(text) ? text[index] : text;
 
  return (
    <div className={cn('overflow-hidden py-1', containerClassName)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentText}
          transition={transition}
          initial={{ opacity: 0, y: -y }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y }}
          {...(props as any)}
        >
          {currentText}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
 
export { RotatingText, type RotatingTextProps };
```

---

### Shimmering Text (shimmering-text)
**Docs:** https://www.shadcn.io/text/shimmering-text
**Registry:** https://www.shadcn.io/registry/shimmering-text.json
**Dependencies:** motion

```tsx
// File: components/ui/shadcn-io/shimmering-text/index.tsx
'use client';

import * as React from 'react';
import { type HTMLMotionProps, motion, type Transition } from 'motion/react';

import { cn } from '@repo/shadcn-ui/lib/utils';

type ShimmeringTextProps = {
  text: string;
  duration?: number;
  transition?: Transition;
  wave?: boolean;
  color?: string;
  shimmeringColor?: string;
} & Omit<HTMLMotionProps<'span'>, 'children'>;

function ShimmeringText({
  text,
  duration = 1,
  transition,
  wave = false,
  className,
  color = 'var(--color-neutral-500)',
  shimmeringColor = 'var(--color-neutral-300)',
  ...props
}: ShimmeringTextProps) {
  return (
    <motion.span
      className={cn('relative inline-block [perspective:500px]', className)}
      style={
        {
          '--shimmering-color': shimmeringColor,
          '--color': color,
          color: 'var(--color)',
        } as React.CSSProperties
      }
      {...(props as any)}
    >
      {text?.split('')?.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre [transform-style:preserve-3d]"
          initial={{
            ...(wave
              ? {
                  scale: 1,
                  rotateY: 0,
                }
              : {}),
            color: 'var(--color)',
          }}
          animate={{
            ...(wave
              ? {
                  x: [0, 5, 0],
                  y: [0, -5, 0],
                  scale: [1, 1.1, 1],
                  rotateY: [0, 15, 0],
                }
              : {}),
            color: ['var(--color)', 'var(--shimmering-color)', 'var(--color)'],
          }}
          transition={{
            duration,
            repeat: Infinity,
            repeatType: 'loop',
            repeatDelay: text.length * 0.05,
            delay: (i * duration) / text.length,
            ease: 'easeInOut',
            ...transition,
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export { ShimmeringText, type ShimmeringTextProps };
```

---

### Sliding Number (sliding-number)
**Docs:** https://www.shadcn.io/text/sliding-number
**Registry:** https://www.shadcn.io/registry/sliding-number.json
**Dependencies:** motion, react-use-measure

```tsx
// File: components/ui/shadcn-io/sliding-number/index.tsx
'use client';
 
import * as React from 'react';
import {
  useSpring,
  useTransform,
  motion,
  useInView,
  type MotionValue,
  type SpringOptions,
  type UseInViewOptions,
} from 'motion/react';
import useMeasure from 'react-use-measure';
 
import { cn } from '@repo/shadcn-ui/lib/utils';
 
type SlidingNumberRollerProps = {
  prevValue: number;
  value: number;
  place: number;
  transition: SpringOptions;
};
 
function SlidingNumberRoller({
  prevValue,
  value,
  place,
  transition,
}: SlidingNumberRollerProps) {
  const startNumber = Math.floor(prevValue / place) % 10;
  const targetNumber = Math.floor(value / place) % 10;
  const animatedValue = useSpring(startNumber, transition);
 
  React.useEffect(() => {
    animatedValue.set(targetNumber);
  }, [targetNumber, animatedValue]);
 
  const [measureRef, { height }] = useMeasure();
 
  return (
    <span
      ref={measureRef}
      data-slot="sliding-number-roller"
      className="relative inline-block w-[1ch] overflow-x-visible overflow-y-clip leading-none tabular-nums"
    >
      <span className="invisible">0</span>
      {Array.from({ length: 10 }, (_, i) => (
        <SlidingNumberDisplay
          key={i}
          motionValue={animatedValue}
          number={i}
          height={height}
          transition={transition}
        />
      ))}
    </span>
  );
}
 
type SlidingNumberDisplayProps = {
  motionValue: MotionValue<number>;
  number: number;
  height: number;
  transition: SpringOptions;
};
 
function SlidingNumberDisplay({
  motionValue,
  number,
  height,
  transition,
}: SlidingNumberDisplayProps) {
  const y = useTransform(motionValue, (latest) => {
    if (!height) return 0;
    const currentNumber = latest % 10;
    const offset = (10 + number - currentNumber) % 10;
    let translateY = offset * height;
    if (offset > 5) translateY -= 10 * height;
    return translateY;
  });
 
  if (!height) {
    return <span className="invisible absolute">{number}</span>;
  }
 
  return (
    <motion.span
      data-slot="sliding-number-display"
      style={{ y }}
      className="absolute inset-0 flex items-center justify-center"
      transition={{ ...transition, type: 'spring' }}
    >
      {number}
    </motion.span>
  );
}
 
type SlidingNumberProps = React.ComponentProps<'span'> & {
  number: number | string;
  inView?: boolean;
  inViewMargin?: UseInViewOptions['margin'];
  inViewOnce?: boolean;
  padStart?: boolean;
  decimalSeparator?: string;
  decimalPlaces?: number;
  transition?: SpringOptions;
};
 
function SlidingNumber({
  ref,
  number,
  className,
  inView = false,
  inViewMargin = '0px',
  inViewOnce = true,
  padStart = false,
  decimalSeparator = '.',
  decimalPlaces = 0,
  transition = {
    stiffness: 200,
    damping: 20,
    mass: 0.4,
  },
  ...props
}: SlidingNumberProps) {
  const localRef = React.useRef<HTMLSpanElement>(null);
  React.useImperativeHandle(ref as any, () => localRef.current!);
 
  const inViewResult = useInView(localRef, {
    once: inViewOnce,
    margin: inViewMargin,
  });
  const isInView = !inView || inViewResult;
 
  const prevNumberRef = React.useRef<number>(0);
 
  const effectiveNumber = React.useMemo(
    () => (!isInView ? 0 : Math.abs(Number(number))),
    [number, isInView],
  );
 
  const formatNumber = React.useCallback(
    (num: number) =>
      decimalPlaces != null ? num.toFixed(decimalPlaces) : num.toString(),
    [decimalPlaces],
  );
 
  const numberStr = formatNumber(effectiveNumber);
  const [newIntStrRaw, newDecStrRaw = ''] = numberStr.split('.');
  const newIntStr =
    padStart && newIntStrRaw?.length === 1 ? '0' + newIntStrRaw : newIntStrRaw;
 
  const prevFormatted = formatNumber(prevNumberRef.current);
  const [prevIntStrRaw = '', prevDecStrRaw = ''] = prevFormatted.split('.');
  const prevIntStr =
    padStart && prevIntStrRaw.length === 1
      ? '0' + prevIntStrRaw
      : prevIntStrRaw;
 
  const adjustedPrevInt = React.useMemo(() => {
    return prevIntStr.length > (newIntStr?.length ?? 0)
      ? prevIntStr.slice(-(newIntStr?.length ?? 0))
      : prevIntStr.padStart(newIntStr?.length ?? 0, '0');
  }, [prevIntStr, newIntStr]);
 
  const adjustedPrevDec = React.useMemo(() => {
    if (!newDecStrRaw) return '';
    return prevDecStrRaw.length > newDecStrRaw.length
      ? prevDecStrRaw.slice(0, newDecStrRaw.length)
      : prevDecStrRaw.padEnd(newDecStrRaw.length, '0');
  }, [prevDecStrRaw, newDecStrRaw]);
 
  React.useEffect(() => {
    if (isInView) prevNumberRef.current = effectiveNumber;
  }, [effectiveNumber, isInView]);
 
  const intDigitCount = newIntStr?.length ?? 0;
  const intPlaces = React.useMemo(
    () =>
      Array.from({ length: intDigitCount }, (_, i) =>
        Math.pow(10, intDigitCount - i - 1),
      ),
    [intDigitCount],
  );
  const decPlaces = React.useMemo(
    () =>
      newDecStrRaw
        ? Array.from({ length: newDecStrRaw.length }, (_, i) =>
            Math.pow(10, newDecStrRaw.length - i - 1),
          )
        : [],
    [newDecStrRaw],
  );
 
  const newDecValue = newDecStrRaw ? parseInt(newDecStrRaw, 10) : 0;
  const prevDecValue = adjustedPrevDec ? parseInt(adjustedPrevDec, 10) : 0;
 
  return (
    <span
      ref={localRef}
      data-slot="sliding-number"
      className={cn('flex items-center', className)}
      {...(props as any)}
    >
      {isInView && Number(number) < 0 && <span className="mr-1">-</span>}
 
      {intPlaces.map((place) => (
        <SlidingNumberRoller
          key={`int-${place}`}
          prevValue={parseInt(adjustedPrevInt, 10)}
          value={parseInt(newIntStr ?? '0', 10)}
          place={place}
          transition={transition}
        />
      ))}
 
      {newDecStrRaw && (
        <>
          <span>{decimalSeparator}</span>
          {decPlaces.map((place) => (
            <SlidingNumberRoller
              key={`dec-${place}`}
              prevValue={prevDecValue}
              value={newDecValue}
              place={place}
              transition={transition}
            />
          ))}
        </>
      )}
    </span>
  );
}
 
export { SlidingNumber, type SlidingNumberProps };
```

---

### Splitting Text (splitting-text)
**Docs:** https://www.shadcn.io/text/splitting-text
**Registry:** https://www.shadcn.io/registry/splitting-text.json
**Dependencies:** motion

```tsx
// File: components/ui/shadcn-io/splitting-text/index.tsx
'use client';
 
import * as React from 'react';
import {
  motion,
  type Variants,
  type TargetAndTransition,
  type HTMLMotionProps,
  useInView,
  type UseInViewOptions,
} from 'motion/react';
 
type DefaultSplittingTextProps = {
  motionVariants?: {
    initial?: Record<string, any>;
    animate?: Record<string, any>;
    transition?: Record<string, any>;
    stagger?: number;
  };
  inView?: boolean;
  inViewMargin?: UseInViewOptions['margin'];
  inViewOnce?: boolean;
  delay?: number;
} & HTMLMotionProps<'div'>;
 
type CharsOrWordsSplittingTextProps = DefaultSplittingTextProps & {
  type?: 'chars' | 'words';
  text: string;
};
 
type LinesSplittingTextProps = DefaultSplittingTextProps & {
  type: 'lines';
  text: string[];
};
 
type SplittingTextProps =
  | CharsOrWordsSplittingTextProps
  | LinesSplittingTextProps;
 
const defaultItemVariant: Variants = {
  hidden: { x: 150, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};
 
export const SplittingText: React.FC<SplittingTextProps> = ({
  ref,
  text,
  type = 'chars',
  motionVariants = {},
  inView = false,
  inViewMargin = '0px',
  inViewOnce = true,
  delay = 0,
  ...props
}) => {
  const items = React.useMemo<React.ReactNode[]>(() => {
    if (Array.isArray(text)) {
      return text.flatMap((line, i) => [
        <React.Fragment key={`line-${i}`}>{line}</React.Fragment>,
        i < text.length - 1 ? <br key={`br-${i}`} /> : null,
      ]);
    }
 
    if (type === 'words') {
      const tokens = text.match(/\S+\s*/g) || [];
      return tokens.map((token, i) => (
        <React.Fragment key={i}>{token}</React.Fragment>
      ));
    }
 
    return text
      .split('')
      .map((char, i) => <React.Fragment key={i}>{char}</React.Fragment>);
  }, [text, type]);
 
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay / 1000,
        staggerChildren:
          motionVariants.stagger ??
          (type === 'chars' ? 0.05 : type === 'words' ? 0.2 : 0.3),
      },
    },
  };
 
  const itemVariants: Variants = {
    hidden: {
      ...defaultItemVariant.hidden,
      ...(motionVariants.initial || {}),
    },
    visible: {
      ...defaultItemVariant.visible,
      ...(motionVariants.animate || {}),
      transition: {
        ...((defaultItemVariant.visible as TargetAndTransition).transition ||
          {}),
        ...(motionVariants.transition || {}),
      },
    },
  };
 
  const localRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref as any, () => localRef.current as HTMLDivElement);
 
  const inViewResult = useInView(localRef, {
    once: inViewOnce,
    margin: inViewMargin,
  });
  const isInView = !inView || inViewResult;
 
  return (
    <motion.span
      ref={localRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      {...(props as any)}
    >
      {items.map(
        (item, index) =>
          item && (
            <React.Fragment key={index}>
              <motion.span
                key={index}
                variants={itemVariants}
                style={{
                  display: 'inline-block',
                  whiteSpace:
                    type === 'chars'
                      ? 'pre'
                      : Array.isArray(text)
                        ? 'normal'
                        : 'normal',
                }}
              >
                {item}
              </motion.span>
              {type === 'words' && ' '}
            </React.Fragment>
          ),
      )}
    </motion.span>
  );
};
```

---

### Typing Text (typing-text)
**Docs:** https://www.shadcn.io/text/typing-text
**Registry:** https://www.shadcn.io/registry/typing-text.json
**Dependencies:** gsap, motion

```tsx
// File: components/ui/shadcn-io/typing-text/index.tsx
'use client';

import { ElementType, useEffect, useRef, useState, createElement, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';

interface TypingTextProps {
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string | React.ReactNode;
  cursorBlinkDuration?: number;
  cursorClassName?: string;
  text: string | string[];
  as?: ElementType;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  reverseMode?: boolean;
}

const TypingText = ({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}: TypingTextProps & React.HTMLAttributes<HTMLElement>) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return 'currentColor';
    return textColors[currentTextIndex % textColors.length];
  };

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (showCursor && cursorRef.current) {
      gsap.set(cursorRef.current, { opacity: 1 });
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    if (!isVisible) return;

    let timeout: NodeJS.Timeout;

    const currentText = textArray[currentTextIndex];
    const processedText = reverseMode ? currentText.split('').reverse().join('') : currentText;

    const executeTypingAnimation = () => {
      if (isDeleting) {
        if (displayedText === '') {
          setIsDeleting(false);
          if (currentTextIndex === textArray.length - 1 && !loop) {
            return;
          }

          if (onSentenceComplete) {
            onSentenceComplete(textArray[currentTextIndex], currentTextIndex);
          }

          setCurrentTextIndex(prev => (prev + 1) % textArray.length);
          setCurrentCharIndex(0);
          timeout = setTimeout(() => {}, pauseDuration);
        } else {
          timeout = setTimeout(() => {
            setDisplayedText(prev => prev.slice(0, -1));
          }, deletingSpeed);
        }
      } else {
        if (currentCharIndex < processedText.length) {
          timeout = setTimeout(
            () => {
              setDisplayedText(prev => prev + processedText[currentCharIndex]);
              setCurrentCharIndex(prev => prev + 1);
            },
            variableSpeed ? getRandomSpeed() : typingSpeed
          );
        } else if (textArray.length > 1) {
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        }
      }
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
      timeout = setTimeout(executeTypingAnimation, initialDelay);
    } else {
      executeTypingAnimation();
    }

    return () => clearTimeout(timeout);
  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    textArray,
    currentTextIndex,
    loop,
    initialDelay,
    isVisible,
    reverseMode,
    variableSpeed,
    onSentenceComplete,
    getRandomSpeed
  ]);

  const shouldHideCursor =
    hideCursorWhileTyping && (currentCharIndex < textArray[currentTextIndex].length || isDeleting);

  return createElement(
    Component,
    {
      ref: containerRef,
      className: `inline-block whitespace-pre-wrap tracking-tight ${className}`,
      ...props
    },
    <span className="inline" style={{ color: getCurrentTextColor() }}>
      {displayedText}
    </span>,
    showCursor && (
      <span
        ref={cursorRef}
        className={`inline-block opacity-100 ${shouldHideCursor ? 'hidden' : ''} ${
          cursorCharacter === '|' 
            ? `h-5 w-[1px] translate-y-1 bg-foreground ${cursorClassName}` 
            : `ml-1 ${cursorClassName}`
        }`}
      >
        {cursorCharacter === '|' ? '' : cursorCharacter}
      </span>
    )
  );
};

export default TypingText;
```

---

### Writing Text (writing-text)
**Docs:** https://www.shadcn.io/text/writing-text
**Registry:** https://www.shadcn.io/registry/writing-text.json
**Dependencies:** motion

```tsx
// File: components/ui/shadcn-io/writing-text/index.tsx
'use client';
 
import * as React from 'react';
import {
  motion,
  useInView,
  type Transition,
  type UseInViewOptions,
} from 'motion/react';
 
type WritingTextProps = Omit<React.ComponentProps<'span'>, 'children'> & {
  transition?: Transition;
  inView?: boolean;
  inViewMargin?: UseInViewOptions['margin'];
  inViewOnce?: boolean;
  spacing?: number | string;
  text: string;
};
 
function WritingText({
  ref,
  inView = false,
  inViewMargin = '0px',
  inViewOnce = true,
  spacing = 5,
  text,
  transition = { type: 'spring', bounce: 0, duration: 2, delay: 0.5 },
  ...props
}: WritingTextProps) {
  const localRef = React.useRef<HTMLSpanElement>(null);
  React.useImperativeHandle(ref as any, () => localRef.current as HTMLSpanElement);
 
  const inViewResult = useInView(localRef, {
    once: inViewOnce,
    margin: inViewMargin,
  });
  const isInView = !inView || inViewResult;
 
  const words = React.useMemo(() => text.split(' '), [text]);
 
  return (
    <span ref={localRef} data-slot="writing-text" {...(props as any)}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block will-change-transform will-change-opacity"
          style={{ marginRight: spacing }}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{
            ...transition,
            delay: index * (transition?.delay ?? 0),
          }}
        >
          {word}{' '}
        </motion.span>
      ))}
    </span>
  );
}
 
export { WritingText, type WritingTextProps };
```

---
