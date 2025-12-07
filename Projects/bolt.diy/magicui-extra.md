
### border-beam
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "border-beam",
  "type": "registry:ui",
  "title": "Border Beam",
  "description": "An animated beam of light which travels along the border of its container.",
  "dependencies": [
    "motion"
  ],
  "files": [
    {
      "path": "registry/magicui/border-beam.tsx",
      "content": "\"use client\"\n\nimport { motion, MotionStyle, Transition } from \"motion/react\"\n\nimport { cn } from \"@/lib/utils\"\n\ninterface BorderBeamProps {\n  /**\n   * The size of the border beam.\n   */\n  size?: number\n  /**\n   * The duration of the border beam.\n   */\n  duration?: number\n  /**\n   * The delay of the border beam.\n   */\n  delay?: number\n  /**\n   * The color of the border beam from.\n   */\n  colorFrom?: string\n  /**\n   * The color of the border beam to.\n   */\n  colorTo?: string\n  /**\n   * The motion transition of the border beam.\n   */\n  transition?: Transition\n  /**\n   * The class name of the border beam.\n   */\n  className?: string\n  /**\n   * The style of the border beam.\n   */\n  style?: React.CSSProperties\n  /**\n   * Whether to reverse the animation direction.\n   */\n  reverse?: boolean\n  /**\n   * The initial offset position (0-100).\n   */\n  initialOffset?: number\n  /**\n   * The border width of the beam.\n   */\n  borderWidth?: number\n}\n\nexport const BorderBeam = ({\n  className,\n  size = 50,\n  delay = 0,\n  duration = 6,\n  colorFrom = \"#ffaa40\",\n  colorTo = \"#9c40ff\",\n  transition,\n  style,\n  reverse = false,\n  initialOffset = 0,\n  borderWidth = 1,\n}: BorderBeamProps) => {\n  return (\n    <div\n      className=\"pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] [mask-composite:intersect] [mask-clip:padding-box,border-box]\"\n      style={\n        {\n          \"--border-beam-width\": `${borderWidth}px`,\n        } as React.CSSProperties\n      }\n    >\n      <motion.div\n        className={cn(\n          \"absolute aspect-square\",\n          \"bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent\",\n          className\n        )}\n        style={\n          {\n            width: size,\n            offsetPath: `rect(0 auto auto 0 round ${size}px)`,\n            \"--color-from\": colorFrom,\n            \"--color-to\": colorTo,\n            ...style,\n          } as MotionStyle\n        }\n        initial={{ offsetDistance: `${initialOffset}%` }}\n        animate={{\n          offsetDistance: reverse\n            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]\n            : [`${initialOffset}%`, `${100 + initialOffset}%`],\n        }}\n        transition={{\n          repeat: Infinity,\n          ease: \"linear\",\n          duration,\n          delay: -delay,\n          ...transition,\n        }}\n      />\n    </div>\n  )\n}\n",
      "type": "registry:ui"
    }
  ]
}
```

### shine-border
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "shine-border",
  "type": "registry:ui",
  "title": "Shine Border",
  "description": "Shine border is an animated background border effect.",
  "files": [
    {
      "path": "registry/magicui/shine-border.tsx",
      "content": "\"use client\"\n\nimport * as React from \"react\"\n\nimport { cn } from \"@/lib/utils\"\n\ninterface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {\n  /**\n   * Width of the border in pixels\n   * @default 1\n   */\n  borderWidth?: number\n  /**\n   * Duration of the animation in seconds\n   * @default 14\n   */\n  duration?: number\n  /**\n   * Color of the border, can be a single color or an array of colors\n   * @default \"#000000\"\n   */\n  shineColor?: string | string[]\n}\n\n/**\n * Shine Border\n *\n * An animated background border effect component with configurable properties.\n */\nexport function ShineBorder({\n  borderWidth = 1,\n  duration = 14,\n  shineColor = \"#000000\",\n  className,\n  style,\n  ...props\n}: ShineBorderProps) {\n  return (\n    <div\n      style={\n        {\n          \"--border-width\": `${borderWidth}px`,\n          \"--duration\": `${duration}s`,\n          backgroundImage: `radial-gradient(transparent,transparent, ${\n            Array.isArray(shineColor) ? shineColor.join(\",\") : shineColor\n          },transparent,transparent)`,\n          backgroundSize: \"300% 300%\",\n          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,\n          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,\n          WebkitMaskComposite: \"xor\",\n          maskComposite: \"exclude\",\n          padding: \"var(--border-width)\",\n          ...style,\n        } as React.CSSProperties\n      }\n      className={cn(\n        \"motion-safe:animate-shine pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position]\",\n        className\n      )}\n      {...props}\n    />\n  )\n}\n",
      "type": "registry:ui"
    }
  ],
  "cssVars": {
    "theme": {
      "animate-shine": "shine var(--duration) infinite linear"
    }
  },
  "css": {
    "@keyframes shine": {
      "0%": {
        "background-position": "0% 0%"
      },
      "50%": {
        "background-position": "100% 100%"
      },
      "to": {
        "background-position": "0% 0%"
      }
    }
  }
}
```

### magic-card
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "magic-card",
  "type": "registry:ui",
  "title": "Magic Card",
  "description": "A spotlight effect that follows your mouse cursor and highlights borders on hover.",
  "dependencies": [
    "motion"
  ],
  "files": [
    {
      "path": "registry/magicui/magic-card.tsx",
      "content": "\"use client\"\n\nimport React, { useCallback, useEffect } from \"react\"\nimport { motion, useMotionTemplate, useMotionValue } from \"motion/react\"\n\nimport { cn } from \"@/lib/utils\"\n\ninterface MagicCardProps {\n  children?: React.ReactNode\n  className?: string\n  gradientSize?: number\n  gradientColor?: string\n  gradientOpacity?: number\n  gradientFrom?: string\n  gradientTo?: string\n}\n\nexport function MagicCard({\n  children,\n  className,\n  gradientSize = 200,\n  gradientColor = \"#262626\",\n  gradientOpacity = 0.8,\n  gradientFrom = \"#9E7AFF\",\n  gradientTo = \"#FE8BBB\",\n}: MagicCardProps) {\n  const mouseX = useMotionValue(-gradientSize)\n  const mouseY = useMotionValue(-gradientSize)\n  const reset = useCallback(() => {\n    mouseX.set(-gradientSize)\n    mouseY.set(-gradientSize)\n  }, [gradientSize, mouseX, mouseY])\n\n  const handlePointerMove = useCallback(\n    (e: React.PointerEvent<HTMLDivElement>) => {\n      const rect = e.currentTarget.getBoundingClientRect()\n      mouseX.set(e.clientX - rect.left)\n      mouseY.set(e.clientY - rect.top)\n    },\n    [mouseX, mouseY]\n  )\n\n  useEffect(() => {\n    reset()\n  }, [reset])\n\n  useEffect(() => {\n    const handleGlobalPointerOut = (e: PointerEvent) => {\n      if (!e.relatedTarget) {\n        reset()\n      }\n    }\n\n    const handleVisibility = () => {\n      if (document.visibilityState !== \"visible\") {\n        reset()\n      }\n    }\n\n    window.addEventListener(\"pointerout\", handleGlobalPointerOut)\n    window.addEventListener(\"blur\", reset)\n    document.addEventListener(\"visibilitychange\", handleVisibility)\n\n    return () => {\n      window.removeEventListener(\"pointerout\", handleGlobalPointerOut)\n      window.removeEventListener(\"blur\", reset)\n      document.removeEventListener(\"visibilitychange\", handleVisibility)\n    }\n  }, [reset])\n\n  return (\n    <div\n      className={cn(\"group relative rounded-[inherit]\", className)}\n      onPointerMove={handlePointerMove}\n      onPointerLeave={reset}\n      onPointerEnter={reset}\n    >\n      <motion.div\n        className=\"bg-border pointer-events-none absolute inset-0 rounded-[inherit] duration-300 group-hover:opacity-100\"\n        style={{\n          background: useMotionTemplate`\n          radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,\n          ${gradientFrom}, \n          ${gradientTo}, \n          var(--border) 100%\n          )\n          `,\n        }}\n      />\n      <div className=\"bg-background absolute inset-px rounded-[inherit]\" />\n      <motion.div\n        className=\"pointer-events-none absolute inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100\"\n        style={{\n          background: useMotionTemplate`\n            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)\n          `,\n          opacity: gradientOpacity,\n        }}\n      />\n      <div className=\"relative\">{children}</div>\n    </div>\n  )\n}\n",
      "type": "registry:ui"
    }
  ]
}
```

### aurora-text
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "aurora-text",
  "type": "registry:ui",
  "title": "Aurora Text",
  "description": "A beautiful aurora text effect",
  "files": [
    {
      "path": "registry/magicui/aurora-text.tsx",
      "content": "\"use client\"\n\nimport React, { memo } from \"react\"\n\ninterface AuroraTextProps {\n  children: React.ReactNode\n  className?: string\n  colors?: string[]\n  speed?: number\n}\n\nexport const AuroraText = memo(\n  ({\n    children,\n    className = \"\",\n    colors = [\"#FF0080\", \"#7928CA\", \"#0070F3\", \"#38bdf8\"],\n    speed = 1,\n  }: AuroraTextProps) => {\n    const gradientStyle = {\n      backgroundImage: `linear-gradient(135deg, ${colors.join(\", \")}, ${\n        colors[0]\n      })`,\n      WebkitBackgroundClip: \"text\",\n      WebkitTextFillColor: \"transparent\",\n      animationDuration: `${10 / speed}s`,\n    }\n\n    return (\n      <span className={`relative inline-block ${className}`}>\n        <span className=\"sr-only\">{children}</span>\n        <span\n          className=\"animate-aurora relative bg-[length:200%_auto] bg-clip-text text-transparent\"\n          style={gradientStyle}\n          aria-hidden=\"true\"\n        >\n          {children}\n        </span>\n      </span>\n    )\n  }\n)\n\nAuroraText.displayName = \"AuroraText\"\n",
      "type": "registry:ui"
    }
  ],
  "cssVars": {
    "theme": {
      "animate-aurora": "aurora 8s ease-in-out infinite alternate"
    }
  },
  "css": {
    "@keyframes aurora": {
      "0%": {
        "background-position": "0% 50%",
        "transform": "rotate(-5deg) scale(0.9)"
      },
      "25%": {
        "background-position": "50% 100%",
        "transform": "rotate(5deg) scale(1.1)"
      },
      "50%": {
        "background-position": "100% 50%",
        "transform": "rotate(-3deg) scale(0.95)"
      },
      "75%": {
        "background-position": "50% 0%",
        "transform": "rotate(3deg) scale(1.05)"
      },
      "100%": {
        "background-position": "0% 50%",
        "transform": "rotate(-5deg) scale(0.9)"
      }
    }
  }
}
```

### video-text
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "video-text",
  "type": "registry:ui",
  "title": "Video Text",
  "description": "A component that displays text with a video playing in the background.",
  "files": [
    {
      "path": "registry/magicui/video-text.tsx",
      "content": "\"use client\"\n\nimport React, { ElementType, ReactNode, useEffect, useState } from \"react\"\n\nimport { cn } from \"@/lib/utils\"\n\nexport interface VideoTextProps {\n  /**\n   * The video source URL\n   */\n  src: string\n  /**\n   * Additional className for the container\n   */\n  className?: string\n  /**\n   * Whether to autoplay the video\n   */\n  autoPlay?: boolean\n  /**\n   * Whether to mute the video\n   */\n  muted?: boolean\n  /**\n   * Whether to loop the video\n   */\n  loop?: boolean\n  /**\n   * Whether to preload the video\n   */\n  preload?: \"auto\" | \"metadata\" | \"none\"\n  /**\n   * The content to display (will have the video \"inside\" it)\n   */\n  children: ReactNode\n  /**\n   * Font size for the text mask (in viewport width units)\n   * @default 10\n   */\n  fontSize?: string | number\n  /**\n   * Font weight for the text mask\n   * @default \"bold\"\n   */\n  fontWeight?: string | number\n  /**\n   * Text anchor for the text mask\n   * @default \"middle\"\n   */\n  textAnchor?: string\n  /**\n   * Dominant baseline for the text mask\n   * @default \"middle\"\n   */\n  dominantBaseline?: string\n  /**\n   * Font family for the text mask\n   * @default \"sans-serif\"\n   */\n  fontFamily?: string\n  /**\n   * The element type to render for the text\n   * @default \"div\"\n   */\n  as?: ElementType\n}\n\nexport function VideoText({\n  src,\n  children,\n  className = \"\",\n  autoPlay = true,\n  muted = true,\n  loop = true,\n  preload = \"auto\",\n  fontSize = 20,\n  fontWeight = \"bold\",\n  textAnchor = \"middle\",\n  dominantBaseline = \"middle\",\n  fontFamily = \"sans-serif\",\n  as: Component = \"div\",\n}: VideoTextProps) {\n  const [svgMask, setSvgMask] = useState(\"\")\n  const content = React.Children.toArray(children).join(\"\")\n\n  useEffect(() => {\n    const updateSvgMask = () => {\n      const responsiveFontSize =\n        typeof fontSize === \"number\" ? `${fontSize}vw` : fontSize\n      const newSvgMask = `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><text x='50%' y='50%' font-size='${responsiveFontSize}' font-weight='${fontWeight}' text-anchor='${textAnchor}' dominant-baseline='${dominantBaseline}' font-family='${fontFamily}'>${content}</text></svg>`\n      setSvgMask(newSvgMask)\n    }\n\n    updateSvgMask()\n    window.addEventListener(\"resize\", updateSvgMask)\n    return () => window.removeEventListener(\"resize\", updateSvgMask)\n  }, [content, fontSize, fontWeight, textAnchor, dominantBaseline, fontFamily])\n\n  const dataUrlMask = `url(\"data:image/svg+xml,${encodeURIComponent(svgMask)}\")`\n\n  return (\n    <Component className={cn(`relative size-full`, className)}>\n      {/* Create a container that masks the video to only show within text */}\n      <div\n        className=\"absolute inset-0 flex items-center justify-center\"\n        style={{\n          maskImage: dataUrlMask,\n          WebkitMaskImage: dataUrlMask,\n          maskSize: \"contain\",\n          WebkitMaskSize: \"contain\",\n          maskRepeat: \"no-repeat\",\n          WebkitMaskRepeat: \"no-repeat\",\n          maskPosition: \"center\",\n          WebkitMaskPosition: \"center\",\n        }}\n      >\n        <video\n          className=\"h-full w-full object-cover\"\n          autoPlay={autoPlay}\n          muted={muted}\n          loop={loop}\n          preload={preload}\n          playsInline\n        >\n          <source src={src} />\n          Your browser does not support the video tag.\n        </video>\n      </div>\n\n      {/* Add a backup text element for SEO/accessibility */}\n      <span className=\"sr-only\">{content}</span>\n    </Component>\n  )\n}\n",
      "type": "registry:ui"
    }
  ]
}
```

### animated-shiny-text
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "animated-shiny-text",
  "type": "registry:ui",
  "title": "Animated Shiny Text",
  "description": "A light glare effect which pans across text making it appear as if it is shimmering.",
  "files": [
    {
      "path": "registry/magicui/animated-shiny-text.tsx",
      "content": "import { ComponentPropsWithoutRef, CSSProperties, FC } from \"react\"\n\nimport { cn } from \"@/lib/utils\"\n\nexport interface AnimatedShinyTextProps\n  extends ComponentPropsWithoutRef<\"span\"> {\n  shimmerWidth?: number\n}\n\nexport const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({\n  children,\n  className,\n  shimmerWidth = 100,\n  ...props\n}) => {\n  return (\n    <span\n      style={\n        {\n          \"--shiny-width\": `${shimmerWidth}px`,\n        } as CSSProperties\n      }\n      className={cn(\n        \"mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70\",\n\n        // Shine effect\n        \"animate-shiny-text [background-size:var(--shiny-width)_100%] bg-clip-text [background-position:0_0] bg-no-repeat [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]\",\n\n        // Shine gradient\n        \"bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent dark:via-white/80\",\n\n        className\n      )}\n      {...props}\n    >\n      {children}\n    </span>\n  )\n}\n",
      "type": "registry:ui"
    }
  ],
  "cssVars": {
    "theme": {
      "animate-shiny-text": "shiny-text 8s infinite"
    }
  },
  "css": {
    "@keyframes shiny-text": {
      "0%, 90%, 100%": {
        "background-position": "calc(-100% - var(--shiny-width)) 0"
      },
      "30%, 60%": {
        "background-position": "calc(100% + var(--shiny-width)) 0"
      }
    }
  }
}
```

### animated-gradient-text
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "animated-gradient-text",
  "type": "registry:ui",
  "title": "Animated Gradient Text",
  "description": "An animated gradient background which transitions between colors for text.",
  "files": [
    {
      "path": "registry/magicui/animated-gradient-text.tsx",
      "content": "import { ComponentPropsWithoutRef } from \"react\"\n\nimport { cn } from \"@/lib/utils\"\n\nexport interface AnimatedGradientTextProps\n  extends ComponentPropsWithoutRef<\"div\"> {\n  speed?: number\n  colorFrom?: string\n  colorTo?: string\n}\n\nexport function AnimatedGradientText({\n  children,\n  className,\n  speed = 1,\n  colorFrom = \"#ffaa40\",\n  colorTo = \"#9c40ff\",\n  ...props\n}: AnimatedGradientTextProps) {\n  return (\n    <span\n      style={\n        {\n          \"--bg-size\": `${speed * 300}%`,\n          \"--color-from\": colorFrom,\n          \"--color-to\": colorTo,\n        } as React.CSSProperties\n      }\n      className={cn(\n        `animate-gradient inline bg-gradient-to-r from-[var(--color-from)] via-[var(--color-to)] to-[var(--color-from)] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,\n        className\n      )}\n      {...props}\n    >\n      {children}\n    </span>\n  )\n}\n",
      "type": "registry:ui"
    }
  ],
  "cssVars": {
    "theme": {
      "animate-gradient": "gradient 8s linear infinite"
    }
  },
  "css": {
    "@keyframes gradient": {
      "to": {
        "background-position": "var(--bg-size, 300%) 0"
      }
    }
  }
}
```

### safari
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "safari",
  "type": "registry:ui",
  "title": "Safari",
  "description": "A safari browser mockup to showcase your website.",
  "files": [
    {
      "path": "registry/magicui/safari.tsx",
      "content": "import type { HTMLAttributes } from \"react\"\n\nconst SAFARI_WIDTH = 1203\nconst SAFARI_HEIGHT = 753\nconst SCREEN_X = 1\nconst SCREEN_Y = 52\nconst SCREEN_WIDTH = 1200\nconst SCREEN_HEIGHT = 700\n\n// Calculated percentages\nconst LEFT_PCT = (SCREEN_X / SAFARI_WIDTH) * 100\nconst TOP_PCT = (SCREEN_Y / SAFARI_HEIGHT) * 100\nconst WIDTH_PCT = (SCREEN_WIDTH / SAFARI_WIDTH) * 100\nconst HEIGHT_PCT = (SCREEN_HEIGHT / SAFARI_HEIGHT) * 100\n\ntype SafariMode = \"default\" | \"simple\"\n\nexport interface SafariProps extends HTMLAttributes<HTMLDivElement> {\n  url?: string\n  imageSrc?: string\n  videoSrc?: string\n  mode?: SafariMode\n}\n\nexport function Safari({\n  imageSrc,\n  videoSrc,\n  url,\n  mode = \"default\",\n  className,\n  style,\n  ...props\n}: SafariProps) {\n  const hasVideo = !!videoSrc\n  const hasMedia = hasVideo || !!imageSrc\n\n  return (\n    <div\n      className={`relative inline-block w-full align-middle leading-none ${className ?? \"\"}`}\n      style={{\n        aspectRatio: `${SAFARI_WIDTH}/${SAFARI_HEIGHT}`,\n        ...style,\n      }}\n      {...props}\n    >\n      {hasVideo && (\n        <div\n          className=\"pointer-events-none absolute z-0 overflow-hidden\"\n          style={{\n            left: `${LEFT_PCT}%`,\n            top: `${TOP_PCT}%`,\n            width: `${WIDTH_PCT}%`,\n            height: `${HEIGHT_PCT}%`,\n          }}\n        >\n          <video\n            className=\"block size-full object-cover\"\n            src={videoSrc}\n            autoPlay\n            loop\n            muted\n            playsInline\n            preload=\"metadata\"\n          />\n        </div>\n      )}\n\n      {!hasVideo && imageSrc && (\n        <div\n          className=\"pointer-events-none absolute z-0 overflow-hidden\"\n          style={{\n            left: `${LEFT_PCT}%`,\n            top: `${TOP_PCT}%`,\n            width: `${WIDTH_PCT}%`,\n            height: `${HEIGHT_PCT}%`,\n            borderRadius: \"0 0 11px 11px\",\n          }}\n        >\n          <img\n            src={imageSrc}\n            alt=\"\"\n            className=\"block size-full object-cover object-top\"\n          />\n        </div>\n      )}\n\n      <svg\n        viewBox={`0 0 ${SAFARI_WIDTH} ${SAFARI_HEIGHT}`}\n        fill=\"none\"\n        xmlns=\"http://www.w3.org/2000/svg\"\n        className=\"absolute inset-0 z-10 size-full\"\n        style={{ transform: \"translateZ(0)\" }}\n      >\n        <defs>\n          <mask id=\"safariPunch\" maskUnits=\"userSpaceOnUse\">\n            <rect\n              x=\"0\"\n              y=\"0\"\n              width={SAFARI_WIDTH}\n              height={SAFARI_HEIGHT}\n              fill=\"white\"\n            />\n            <path\n              d=\"M1 52H1201V741C1201 747.075 1196.08 752 1190 752H12C5.92486 752 1 747.075 1 741V52Z\"\n              fill=\"black\"\n            />\n          </mask>\n\n          <clipPath id=\"path0\">\n            <rect width={SAFARI_WIDTH} height={SAFARI_HEIGHT} fill=\"white\" />\n          </clipPath>\n\n          <clipPath id=\"roundedBottom\">\n            <path\n              d=\"M1 52H1201V741C1201 747.075 1196.08 752 1190 752H12C5.92486 752 1 747.075 1 741V52Z\"\n              fill=\"white\"\n            />\n          </clipPath>\n        </defs>\n\n        <g\n          clipPath=\"url(#path0)\"\n          mask={hasMedia ? \"url(#safariPunch)\" : undefined}\n        >\n          <path\n            d=\"M0 52H1202V741C1202 747.627 1196.63 753 1190 753H12C5.37258 753 0 747.627 0 741V52Z\"\n            className=\"fill-[#E5E5E5] dark:fill-[#404040]\"\n          />\n          <path\n            fillRule=\"evenodd\"\n            clipRule=\"evenodd\"\n            d=\"M0 12C0 5.37258 5.37258 0 12 0H1190C1196.63 0 1202 5.37258 1202 12V52H0L0 12Z\"\n            className=\"fill-[#E5E5E5] dark:fill-[#404040]\"\n          />\n          <path\n            fillRule=\"evenodd\"\n            clipRule=\"evenodd\"\n            d=\"M1.06738 12C1.06738 5.92487 5.99225 1 12.0674 1H1189.93C1196.01 1 1200.93 5.92487 1200.93 12V51H1.06738V12Z\"\n            className=\"fill-white dark:fill-[#262626]\"\n          />\n          <circle\n            cx=\"27\"\n            cy=\"25\"\n            r=\"6\"\n            className=\"fill-[#E5E5E5] dark:fill-[#404040]\"\n          />\n          <circle\n            cx=\"47\"\n            cy=\"25\"\n            r=\"6\"\n            className=\"fill-[#E5E5E5] dark:fill-[#404040]\"\n          />\n          <circle\n            cx=\"67\"\n            cy=\"25\"\n            r=\"6\"\n            className=\"fill-[#E5E5E5] dark:fill-[#404040]\"\n          />\n          <path\n            d=\"M286 17C286 13.6863 288.686 11 292 11H946C949.314 11 952 13.6863 952 17V35C952 38.3137 949.314 41 946 41H292C288.686 41 286 38.3137 286 35V17Z\"\n            className=\"fill-[#E5E5E5] dark:fill-[#404040]\"\n          />\n          <g className=\"mix-blend-luminosity\">\n            <path\n              d=\"M566.269 32.0852H572.426C573.277 32.0852 573.696 31.6663 573.696 30.7395V25.9851C573.696 25.1472 573.353 24.7219 572.642 24.6521V23.0842C572.642 20.6721 571.036 19.5105 569.348 19.5105C567.659 19.5105 566.053 20.6721 566.053 23.0842V24.6711C565.393 24.7727 565 25.1917 565 25.9851V30.7395C565 31.6663 565.418 32.0852 566.269 32.0852ZM567.272 22.97C567.272 21.491 568.211 20.6785 569.348 20.6785C570.478 20.6785 571.423 21.491 571.423 22.97V24.6394L567.272 24.6458V22.97Z\"\n              fill=\"#A3A3A3\"\n            />\n          </g>\n\n          <g className=\"mix-blend-luminosity\">\n            <text\n              x=\"580\"\n              y=\"30\"\n              fill=\"#A3A3A3\"\n              fontSize=\"12\"\n              fontFamily=\"Arial, sans-serif\"\n            >\n              {url}\n            </text>\n          </g>\n\n          {mode === \"default\" ? (\n            <>\n              <g className=\"mix-blend-luminosity\">\n                <path\n                  d=\"M265.5 33.8984C265.641 33.8984 265.852 33.8516 266.047 33.7422C270.547 31.2969 272.109 30.1641 272.109 27.3203V21.4219C272.109 20.4844 271.742 20.1484 270.961 19.8125C270.094 19.4453 267.18 18.4297 266.328 18.1406C266.07 18.0547 265.766 18 265.5 18C265.234 18 264.93 18.0703 264.672 18.1406C263.82 18.3828 260.906 19.4531 260.039 19.8125C259.258 20.1406 258.891 20.4844 258.891 21.4219V27.3203C258.891 30.1641 260.461 31.2812 264.945 33.7422C265.148 33.8516 265.359 33.8984 265.5 33.8984ZM265.922 19.5781C266.945 19.9766 269.172 20.7656 270.344 21.1875C270.562 21.2656 270.617 21.3828 270.617 21.6641V27.0234C270.617 29.3125 269.469 29.9375 265.945 32.0625C265.727 32.1875 265.617 32.2344 265.508 32.2344V19.4844C265.617 19.4844 265.734 19.5156 265.922 19.5781Z\"\n                  fill=\"#A3A3A3\"\n                />\n              </g>\n              <g className=\"mix-blend-luminosity\">\n                <path\n                  d=\"M936.273 24.9766C936.5 24.9766 936.68 24.9062 936.82 24.7578L940.023 21.5312C940.195 21.3594 940.273 21.1719 940.273 20.9531C940.273 20.7422 940.188 20.5391 940.023 20.3828L936.82 17.125C936.68 16.9688 936.5 16.8906 936.273 16.8906C935.852 16.8906 935.516 17.2422 935.516 17.6719C935.516 17.8828 935.594 18.0547 935.727 18.2031L937.594 20.0312C937.227 19.9766 936.852 19.9453 936.477 19.9453C932.609 19.9453 929.516 23.0391 929.516 26.9141C929.516 30.7891 932.633 33.9062 936.5 33.9062C940.375 33.9062 943.484 30.7891 943.484 26.9141C943.484 26.4453 943.156 26.1094 942.688 26.1094C942.234 26.1094 941.93 26.4453 941.93 26.9141C941.93 29.9297 939.516 32.3516 936.5 32.3516C933.492 32.3516 931.07 29.9297 931.07 26.9141C931.07 23.875 933.469 21.4688 936.477 21.4688C936.984 21.4688 937.453 21.5078 937.867 21.5781L935.734 23.6875C935.594 23.8281 935.516 24 935.516 24.2109C935.516 24.6406 935.852 24.9766 936.273 24.9766Z\"\n                  fill=\"#A3A3A3\"\n                />\n              </g>\n              <g className=\"mix-blend-luminosity\">\n                <path\n                  d=\"M1134 33.0156C1134.49 33.0156 1134.89 32.6094 1134.89 32.1484V27.2578H1139.66C1140.13 27.2578 1140.54 26.8594 1140.54 26.3672C1140.54 25.8828 1140.13 25.4766 1139.66 25.4766H1134.89V20.5859C1134.89 20.1172 1134.49 19.7188 1134 19.7188C1133.52 19.7188 1133.11 20.1172 1133.11 20.5859V25.4766H1128.34C1127.88 25.4766 1127.46 25.8828 1127.46 26.3672C1127.46 26.8594 1127.88 27.2578 1128.34 27.2578H1133.11V32.1484C1133.11 32.6094 1133.52 33.0156 1134 33.0156Z\"\n                  fill=\"#A3A3A3\"\n                />\n              </g>\n              <g className=\"mix-blend-luminosity\">\n                <path\n                  d=\"M1161.8 31.0703H1163.23V32.375C1163.23 34.0547 1164.12 34.9219 1165.81 34.9219H1174.2C1175.89 34.9219 1176.77 34.0547 1176.77 32.3828V24.0469C1176.77 22.375 1175.89 21.5 1174.2 21.5H1172.77V20.2578C1172.77 18.5859 1171.88 17.7109 1170.19 17.7109H1161.8C1160.1 17.7109 1159.23 18.5781 1159.23 20.2578V28.5234C1159.23 30.1953 1160.1 31.0703 1161.8 31.0703ZM1161.9 29.5078C1161.18 29.5078 1160.78 29.1328 1160.78 28.3828V20.3984C1160.78 19.6406 1161.18 19.2656 1161.9 19.2656H1170.09C1170.8 19.2656 1171.2 19.6406 1171.2 20.3984V21.5H1165.81C1164.12 21.5 1163.23 22.375 1163.23 24.0469V29.5078H1161.9ZM1165.91 33.3672C1165.19 33.3672 1164.8 32.9922 1164.8 32.2422V24.1875C1164.8 23.4297 1165.19 23.0625 1165.91 23.0625H1174.1C1174.81 23.0625 1175.21 23.4297 1175.21 24.1875V32.2422C1175.21 32.9922 1174.81 33.3672 1174.1 33.3672H1165.91Z\"\n                  fill=\"#A3A3A3\"\n                />\n              </g>\n              <g className=\"mix-blend-luminosity\">\n                <path\n                  d=\"M1099.51 28.4141C1099.91 28.4141 1100.24 28.0859 1100.24 27.6953V19.8359L1100.18 18.6797L1100.66 19.25L1101.75 20.4141C1101.88 20.5547 1102.06 20.625 1102.24 20.625C1102.6 20.625 1102.9 20.3672 1102.9 20C1102.9 19.8047 1102.82 19.6641 1102.69 19.5312L1100.06 17.0078C1099.88 16.8203 1099.7 16.7578 1099.51 16.7578C1099.32 16.7578 1099.14 16.8203 1098.95 17.0078L1096.33 19.5312C1096.2 19.6641 1096.12 19.8047 1096.12 20C1096.12 20.3672 1096.41 20.625 1096.77 20.625C1096.95 20.625 1097.14 20.5547 1097.27 20.4141L1098.35 19.25L1098.84 18.6719L1098.78 19.8359V27.6953C1098.78 28.0859 1099.11 28.4141 1099.51 28.4141ZM1095 34.6562H1104C1105.7 34.6562 1106.57 33.7812 1106.57 32.1094V24.4297C1106.57 22.7578 1105.7 21.8828 1104 21.8828H1101.89V23.4375H1103.9C1104.61 23.4375 1105.02 23.8125 1105.02 24.5625V31.9688C1105.02 32.7188 1104.61 33.0938 1103.9 33.0938H1095.1C1094.38 33.0938 1093.98 32.7188 1093.98 31.9688V24.5625C1093.98 23.8125 1094.38 23.4375 1095.1 23.4375H1097.13V21.8828H1095C1093.31 21.8828 1092.43 22.75 1092.43 24.4297V32.1094C1092.43 33.7812 1093.31 34.6562 1095 34.6562Z\"\n                  fill=\"#A3A3A3\"\n                />\n              </g>\n              <g className=\"mix-blend-luminosity\">\n                <path\n                  d=\"M99.5703 33.6016H112.938C114.633 33.6016 115.516 32.7266 115.516 31.0547V21.5469C115.516 19.875 114.633 19 112.938 19H99.5703C97.8828 19 97 19.8672 97 21.5469V31.0547C97 32.7266 97.8828 33.6016 99.5703 33.6016ZM99.6719 32.0469C98.9531 32.0469 98.5547 31.6719 98.5547 30.9141V21.6875C98.5547 20.9297 98.9531 20.5547 99.6719 20.5547H103.234V32.0469H99.6719ZM112.836 20.5547C113.555 20.5547 113.953 20.9297 113.953 21.6875V30.9141C113.953 31.6719 113.555 32.0469 112.836 32.0469H104.711V20.5547H112.836ZM101.703 23.4141C101.984 23.4141 102.219 23.1719 102.219 22.9062C102.219 22.6406 101.984 22.4062 101.703 22.4062H100.102C99.8203 22.4062 99.5859 22.6406 99.5859 22.9062C99.5859 23.1719 99.8203 23.4141 100.102 23.4141H101.703ZM101.703 25.5156C101.984 25.5156 102.219 25.2812 102.219 25.0078C102.219 24.7422 101.984 24.5078 101.703 24.5078H100.102C99.8203 24.5078 99.5859 24.7422 99.5859 25.0078C99.5859 25.2812 99.8203 25.5156 100.102 25.5156H101.703ZM101.703 27.6094C101.984 27.6094 102.219 27.3828 102.219 27.1094C102.219 26.8438 101.984 26.6172 101.703 26.6172H100.102C99.8203 26.6172 99.5859 26.8438 99.5859 27.1094C99.5859 27.3828 99.8203 27.6094 100.102 27.6094H101.703Z\"\n                  fill=\"#A3A3A3\"\n                />\n              </g>\n              <g className=\"mix-blend-luminosity\">\n                <path\n                  d=\"M143.914 32.5938C144.094 32.7656 144.312 32.8594 144.562 32.8594C145.086 32.8594 145.492 32.4531 145.492 31.9375C145.492 31.6797 145.391 31.4453 145.211 31.2656L139.742 25.9219L145.211 20.5938C145.391 20.4141 145.492 20.1719 145.492 19.9219C145.492 19.4062 145.086 19 144.562 19C144.312 19 144.094 19.0938 143.922 19.2656L137.844 25.2031C137.625 25.4062 137.516 25.6562 137.516 25.9297C137.516 26.2031 137.625 26.4375 137.836 26.6484L143.914 32.5938Z\"\n                  fill=\"#A3A3A3\"\n                />\n              </g>\n              <g className=\"mix-blend-luminosity\">\n                <path\n                  d=\"M168.422 32.8594C168.68 32.8594 168.891 32.7656 169.07 32.5938L175.148 26.6562C175.359 26.4375 175.469 26.2109 175.469 25.9297C175.469 25.6562 175.367 25.4141 175.148 25.2109L169.07 19.2656C168.891 19.0938 168.68 19 168.422 19C167.898 19 167.492 19.4062 167.492 19.9219C167.492 20.1719 167.602 20.4141 167.773 20.5938L173.25 25.9375L167.773 31.2656C167.594 31.4531 167.492 31.6797 167.492 31.9375C167.492 32.4531 167.898 32.8594 168.422 32.8594Z\"\n                  fill=\"#A3A3A3\"\n                />\n              </g>\n            </>\n          ) : null}\n        </g>\n      </svg>\n    </div>\n  )\n}\n",
      "type": "registry:ui"
    }
  ]
}
```

### iphone
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "iphone",
  "type": "registry:ui",
  "title": "iPhone",
  "description": "A mockup of the iPhone",
  "files": [
    {
      "path": "registry/magicui/iphone.tsx",
      "content": "import type { HTMLAttributes } from \"react\"\n\nconst PHONE_WIDTH = 433\nconst PHONE_HEIGHT = 882\nconst SCREEN_X = 21.25\nconst SCREEN_Y = 19.25\nconst SCREEN_WIDTH = 389.5\nconst SCREEN_HEIGHT = 843.5\nconst SCREEN_RADIUS = 55.75\n\n// Calculated percentages\nconst LEFT_PCT = (SCREEN_X / PHONE_WIDTH) * 100\nconst TOP_PCT = (SCREEN_Y / PHONE_HEIGHT) * 100\nconst WIDTH_PCT = (SCREEN_WIDTH / PHONE_WIDTH) * 100\nconst HEIGHT_PCT = (SCREEN_HEIGHT / PHONE_HEIGHT) * 100\nconst RADIUS_H = (SCREEN_RADIUS / SCREEN_WIDTH) * 100\nconst RADIUS_V = (SCREEN_RADIUS / SCREEN_HEIGHT) * 100\n\nexport interface IphoneProps extends HTMLAttributes<HTMLDivElement> {\n  src?: string\n  videoSrc?: string\n}\n\nexport function Iphone({\n  src,\n  videoSrc,\n  className,\n  style,\n  ...props\n}: IphoneProps) {\n  const hasVideo = !!videoSrc\n  const hasMedia = hasVideo || !!src\n\n  return (\n    <div\n      className={`relative inline-block w-full align-middle leading-none ${className}`}\n      style={{\n        aspectRatio: `${PHONE_WIDTH}/${PHONE_HEIGHT}`,\n        ...style,\n      }}\n      {...props}\n    >\n      {hasVideo && (\n        <div\n          className=\"pointer-events-none absolute z-0 overflow-hidden\"\n          style={{\n            left: `${LEFT_PCT}%`,\n            top: `${TOP_PCT}%`,\n            width: `${WIDTH_PCT}%`,\n            height: `${HEIGHT_PCT}%`,\n            borderRadius: `${RADIUS_H}% / ${RADIUS_V}%`,\n          }}\n        >\n          <video\n            className=\"block size-full object-cover\"\n            src={videoSrc}\n            autoPlay\n            loop\n            muted\n            playsInline\n            preload=\"metadata\"\n          />\n        </div>\n      )}\n\n      {!hasVideo && src && (\n        <div\n          className=\"pointer-events-none absolute z-0 overflow-hidden\"\n          style={{\n            left: `${LEFT_PCT}%`,\n            top: `${TOP_PCT}%`,\n            width: `${WIDTH_PCT}%`,\n            height: `${HEIGHT_PCT}%`,\n            borderRadius: `${RADIUS_H}% / ${RADIUS_V}%`,\n          }}\n        >\n          <img\n            src={src}\n            alt=\"\"\n            className=\"block size-full object-cover object-top\"\n          />\n        </div>\n      )}\n\n      <svg\n        viewBox={`0 0 ${PHONE_WIDTH} ${PHONE_HEIGHT}`}\n        fill=\"none\"\n        xmlns=\"http://www.w3.org/2000/svg\"\n        className=\"absolute inset-0 size-full\"\n        style={{ transform: \"translateZ(0)\" }}\n      >\n        <g mask={hasMedia ? \"url(#screenPunch)\" : undefined}>\n          <path\n            d=\"M2 73C2 32.6832 34.6832 0 75 0H357C397.317 0 430 32.6832 430 73V809C430 849.317 397.317 882 357 882H75C34.6832 882 2 849.317 2 809V73Z\"\n            className=\"fill-[#E5E5E5] dark:fill-[#404040]\"\n          />\n          <path\n            d=\"M0 171C0 170.448 0.447715 170 1 170H3V204H1C0.447715 204 0 203.552 0 203V171Z\"\n            className=\"fill-[#E5E5E5] dark:fill-[#404040]\"\n          />\n          <path\n            d=\"M1 234C1 233.448 1.44772 233 2 233H3.5V300H2C1.44772 300 1 299.552 1 299V234Z\"\n            className=\"fill-[#E5E5E5] dark:fill-[#404040]\"\n          />\n          <path\n            d=\"M1 319C1 318.448 1.44772 318 2 318H3.5V385H2C1.44772 385 1 384.552 1 384V319Z\"\n            className=\"fill-[#E5E5E5] dark:fill-[#404040]\"\n          />\n          <path\n            d=\"M430 279H432C432.552 279 433 279.448 433 280V384C433 384.552 432.552 385 432 385H430V279Z\"\n            className=\"fill-[#E5E5E5] dark:fill-[#404040]\"\n          />\n          <path\n            d=\"M6 74C6 35.3401 37.3401 4 76 4H356C394.66 4 426 35.3401 426 74V808C426 846.66 394.66 878 356 878H76C37.3401 878 6 846.66 6 808V74Z\"\n            className=\"fill-white dark:fill-[#262626]\"\n          />\n        </g>\n\n        <path\n          opacity=\"0.5\"\n          d=\"M174 5H258V5.5C258 6.60457 257.105 7.5 256 7.5H176C174.895 7.5 174 6.60457 174 5.5V5Z\"\n          className=\"fill-[#E5E5E5] dark:fill-[#404040]\"\n        />\n\n        <path\n          d={`M${SCREEN_X} 75C${SCREEN_X} 44.2101 46.2101 ${SCREEN_Y} 77 ${SCREEN_Y}H355C385.79 ${SCREEN_Y} 410.75 44.2101 410.75 75V807C410.75 837.79 385.79 862.75 355 862.75H77C46.2101 862.75 ${SCREEN_X} 837.79 ${SCREEN_X} 807V75Z`}\n          className=\"fill-[#E5E5E5] stroke-[#E5E5E5] stroke-[0.5] dark:fill-[#404040] dark:stroke-[#404040]\"\n          mask={hasMedia ? \"url(#screenPunch)\" : undefined}\n        />\n\n        <path\n          d=\"M154 48.5C154 38.2827 162.283 30 172.5 30H259.5C269.717 30 278 38.2827 278 48.5C278 58.7173 269.717 67 259.5 67H172.5C162.283 67 154 58.7173 154 48.5Z\"\n          className=\"fill-[#F5F5F5] dark:fill-[#262626]\"\n        />\n        <path\n          d=\"M249 48.5C249 42.701 253.701 38 259.5 38C265.299 38 270 42.701 270 48.5C270 54.299 265.299 59 259.5 59C253.701 59 249 54.299 249 48.5Z\"\n          className=\"fill-[#F5F5F5] dark:fill-[#262626]\"\n        />\n        <path\n          d=\"M254 48.5C254 45.4624 256.462 43 259.5 43C262.538 43 265 45.4624 265 48.5C265 51.5376 262.538 54 259.5 54C256.462 54 254 51.5376 254 48.5Z\"\n          className=\"fill-[#E5E5E5] dark:fill-[#404040]\"\n        />\n\n        <defs>\n          <mask id=\"screenPunch\" maskUnits=\"userSpaceOnUse\">\n            <rect\n              x=\"0\"\n              y=\"0\"\n              width={PHONE_WIDTH}\n              height={PHONE_HEIGHT}\n              fill=\"white\"\n            />\n            <rect\n              x={SCREEN_X}\n              y={SCREEN_Y}\n              width={SCREEN_WIDTH}\n              height={SCREEN_HEIGHT}\n              rx={SCREEN_RADIUS}\n              ry={SCREEN_RADIUS}\n              fill=\"black\"\n            />\n          </mask>\n          <clipPath id=\"roundedCorners\">\n            <rect\n              x={SCREEN_X}\n              y={SCREEN_Y}\n              width={SCREEN_WIDTH}\n              height={SCREEN_HEIGHT}\n              rx={SCREEN_RADIUS}\n              ry={SCREEN_RADIUS}\n            />\n          </clipPath>\n        </defs>\n      </svg>\n    </div>\n  )\n}\n",
      "type": "registry:ui"
    }
  ]
}
```

### android
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "android",
  "type": "registry:ui",
  "title": "Android",
  "description": "A mockup of an Android device.",
  "files": [
    {
      "path": "registry/magicui/android.tsx",
      "content": "import { SVGProps } from \"react\"\n\nexport interface AndroidProps extends SVGProps<SVGSVGElement> {\n  width?: number\n  height?: number\n  src?: string\n  videoSrc?: string\n}\n\nexport function Android({\n  width = 433,\n  height = 882,\n  src,\n  videoSrc,\n  ...props\n}: AndroidProps) {\n  return (\n    <svg\n      width={width}\n      height={height}\n      viewBox={`0 0 ${width} ${height}`}\n      fill=\"none\"\n      xmlns=\"http://www.w3.org/2000/svg\"\n      {...props}\n    >\n      <path\n        d=\"M376 153H378C379.105 153 380 153.895 380 155V249C380 250.105 379.105 251 378 251H376V153Z\"\n        className=\"fill-[#E5E5E5] dark:fill-[#404040]\"\n      />\n      <path\n        d=\"M376 301H378C379.105 301 380 301.895 380 303V351C380 352.105 379.105 353 378 353H376V301Z\"\n        className=\"fill-[#E5E5E5] dark:fill-[#404040]\"\n      />\n      <path\n        d=\"M0 42C0 18.8041 18.804 0 42 0H336C359.196 0 378 18.804 378 42V788C378 811.196 359.196 830 336 830H42C18.804 830 0 811.196 0 788V42Z\"\n        className=\"fill-[#E5E5E5] dark:fill-[#404040]\"\n      />\n      <path\n        d=\"M2 43C2 22.0132 19.0132 5 40 5H338C358.987 5 376 22.0132 376 43V787C376 807.987 358.987 825 338 825H40C19.0132 825 2 807.987 2 787V43Z\"\n        className=\"fill-white dark:fill-[#262626]\"\n      />\n\n      <g clipPath=\"url(#clip0_514_20855)\">\n        <path\n          d=\"M9.25 48C9.25 29.3604 24.3604 14.25 43 14.25H335C353.64 14.25 368.75 29.3604 368.75 48V780C368.75 798.64 353.64 813.75 335 813.75H43C24.3604 813.75 9.25 798.64 9.25 780V48Z\"\n          className=\"fill-[#E5E5E5] stroke-[#E5E5E5] stroke-[0.5] dark:fill-[#404040] dark:stroke-[#404040]\"\n        />\n      </g>\n      <circle\n        cx=\"189\"\n        cy=\"28\"\n        r=\"9\"\n        className=\"fill-white dark:fill-[#262626]\"\n      />\n      <circle\n        cx=\"189\"\n        cy=\"28\"\n        r=\"4\"\n        className=\"fill-[#E5E5E5] dark:fill-[#404040]\"\n      />\n      {src && (\n        <image\n          href={src}\n          width=\"360\"\n          height=\"800\"\n          className=\"size-full object-cover\"\n          preserveAspectRatio=\"xMidYMid slice\"\n          clipPath=\"url(#clip0_514_20855)\"\n        />\n      )}\n      {videoSrc && (\n        <foreignObject\n          width=\"380\"\n          height=\"820\"\n          clipPath=\"url(#clip0_514_20855)\"\n          preserveAspectRatio=\"xMidYMid slice\"\n        >\n          <video\n            className=\"size-full object-cover\"\n            src={videoSrc}\n            autoPlay\n            loop\n            muted\n            playsInline\n          />\n        </foreignObject>\n      )}\n      <defs>\n        <clipPath id=\"clip0_514_20855\">\n          <rect\n            width=\"360\"\n            height=\"800\"\n            rx=\"33\"\n            ry=\"25\"\n            className=\"fill-white dark:fill-[#262626]\"\n            transform=\"translate(9 14)\"\n          />\n        </clipPath>\n      </defs>\n    </svg>\n  )\n}\n",
      "type": "registry:ui"
    }
  ]
}
```

### rainbow-button
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "rainbow-button",
  "type": "registry:ui",
  "title": "Rainbow Button",
  "description": "An animated button with a rainbow effect.",
  "files": [
    {
      "path": "registry/magicui/rainbow-button.tsx",
      "content": "import React from \"react\"\nimport { Slot } from \"@radix-ui/react-slot\"\nimport { cva, VariantProps } from \"class-variance-authority\"\n\nimport { cn } from \"@/lib/utils\"\n\nconst rainbowButtonVariants = cva(\n  cn(\n    \"relative cursor-pointer group transition-all animate-rainbow\",\n    \"inline-flex items-center justify-center gap-2 shrink-0\",\n    \"rounded-sm outline-none focus-visible:ring-[3px] aria-invalid:border-destructive\",\n    \"text-sm font-medium whitespace-nowrap\",\n    \"disabled:pointer-events-none disabled:opacity-50\",\n    \"[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0\"\n  ),\n  {\n    variants: {\n      variant: {\n        default:\n          \"border-0 bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] bg-[length:200%] text-primary-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.125rem)_solid_transparent] before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] before:[filter:blur(0.75rem)] dark:bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))]\",\n        outline:\n          \"border border-input border-b-transparent bg-[linear-gradient(#ffffff,#ffffff),linear-gradient(#ffffff_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] bg-[length:200%] text-accent-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] before:[filter:blur(0.75rem)] dark:bg-[linear-gradient(#0a0a0a,#0a0a0a),linear-gradient(#0a0a0a_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))]\",\n      },\n      size: {\n        default: \"h-9 px-4 py-2\",\n        sm: \"h-8 rounded-xl px-3 text-xs\",\n        lg: \"h-11 rounded-xl px-8\",\n        icon: \"size-9\",\n      },\n    },\n    defaultVariants: {\n      variant: \"default\",\n      size: \"default\",\n    },\n  }\n)\n\ninterface RainbowButtonProps\n  extends React.ButtonHTMLAttributes<HTMLButtonElement>,\n    VariantProps<typeof rainbowButtonVariants> {\n  asChild?: boolean\n}\n\nconst RainbowButton = React.forwardRef<HTMLButtonElement, RainbowButtonProps>(\n  ({ className, variant, size, asChild = false, ...props }, ref) => {\n    const Comp = asChild ? Slot : \"button\"\n    return (\n      <Comp\n        data-slot=\"button\"\n        className={cn(rainbowButtonVariants({ variant, size, className }))}\n        ref={ref}\n        {...props}\n      />\n    )\n  }\n)\n\nRainbowButton.displayName = \"RainbowButton\"\n\nexport { RainbowButton, rainbowButtonVariants, type RainbowButtonProps }\n",
      "type": "registry:ui"
    }
  ],
  "cssVars": {
    "theme": {
      "animate-rainbow": "rainbow var(--speed, 2s) infinite linear"
    },
    "light": {
      "color-1": "oklch(66.2% 0.225 25.9)",
      "color-2": "oklch(60.4% 0.26 302)",
      "color-3": "oklch(69.6% 0.165 251)",
      "color-4": "oklch(80.2% 0.134 225)",
      "color-5": "oklch(90.7% 0.231 133)"
    },
    "dark": {
      "color-1": "oklch(66.2% 0.225 25.9)",
      "color-2": "oklch(60.4% 0.26 302)",
      "color-3": "oklch(69.6% 0.165 251)",
      "color-4": "oklch(80.2% 0.134 225)",
      "color-5": "oklch(90.7% 0.231 133)"
    }
  },
  "css": {
    "@keyframes rainbow": {
      "0%": {
        "background-position": "0%"
      },
      "100%": {
        "background-position": "200%"
      }
    }
  }
}
```

### ripple-button
```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "ripple-button",
  "type": "registry:ui",
  "title": "Ripple Button",
  "description": "An animated button with ripple useful for user engagement.",
  "files": [
    {
      "path": "registry/magicui/ripple-button.tsx",
      "content": "\"use client\"\n\nimport React, { MouseEvent, useEffect, useState } from \"react\"\n\nimport { cn } from \"@/lib/utils\"\n\ninterface RippleButtonProps\n  extends React.ButtonHTMLAttributes<HTMLButtonElement> {\n  rippleColor?: string\n  duration?: string\n}\n\nexport const RippleButton = React.forwardRef<\n  HTMLButtonElement,\n  RippleButtonProps\n>(\n  (\n    {\n      className,\n      children,\n      rippleColor = \"#ffffff\",\n      duration = \"600ms\",\n      onClick,\n      ...props\n    },\n    ref\n  ) => {\n    const [buttonRipples, setButtonRipples] = useState<\n      Array<{ x: number; y: number; size: number; key: number }>\n    >([])\n\n    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {\n      createRipple(event)\n      onClick?.(event)\n    }\n\n    const createRipple = (event: MouseEvent<HTMLButtonElement>) => {\n      const button = event.currentTarget\n      const rect = button.getBoundingClientRect()\n      const size = Math.max(rect.width, rect.height)\n      const x = event.clientX - rect.left - size / 2\n      const y = event.clientY - rect.top - size / 2\n\n      const newRipple = { x, y, size, key: Date.now() }\n      setButtonRipples((prevRipples) => [...prevRipples, newRipple])\n    }\n\n    useEffect(() => {\n      if (buttonRipples.length > 0) {\n        const lastRipple = buttonRipples[buttonRipples.length - 1]\n        const timeout = setTimeout(() => {\n          setButtonRipples((prevRipples) =>\n            prevRipples.filter((ripple) => ripple.key !== lastRipple.key)\n          )\n        }, parseInt(duration))\n        return () => clearTimeout(timeout)\n      }\n    }, [buttonRipples, duration])\n\n    return (\n      <button\n        className={cn(\n          \"bg-background text-primary relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 px-4 py-2 text-center\",\n          className\n        )}\n        onClick={handleClick}\n        ref={ref}\n        {...props}\n      >\n        <div className=\"relative z-10\">{children}</div>\n        <span className=\"pointer-events-none absolute inset-0\">\n          {buttonRipples.map((ripple) => (\n            <span\n              className=\"animate-rippling bg-background absolute rounded-full opacity-30\"\n              key={ripple.key}\n              style={{\n                width: `${ripple.size}px`,\n                height: `${ripple.size}px`,\n                top: `${ripple.y}px`,\n                left: `${ripple.x}px`,\n                backgroundColor: rippleColor,\n                transform: `scale(0)`,\n              }}\n            />\n          ))}\n        </span>\n      </button>\n    )\n  }\n)\n\nRippleButton.displayName = \"RippleButton\"\n",
      "type": "registry:ui"
    }
  ],
  "cssVars": {
    "theme": {
      "animate-rippling": "rippling var(--duration) ease-out"
    }
  },
  "css": {
    "@keyframes rippling": {
      "0%": {
        "opacity": "1"
      },
      "100%": {
        "transform": "scale(2)",
        "opacity": "0"
      }
    }
  }
}
```

