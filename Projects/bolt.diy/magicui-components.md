# MagicUI Components (extracted)

## Border Beam (border-beam)
- Source: https://magicui.design/r/border-beam
- Description: An animated beam of light which travels along the border of its container.
- Dependencies: motion

### registry/magicui/border-beam.tsx

```tsx
"use client"

import { motion, MotionStyle, Transition } from "motion/react"

import { cn } from "@/lib/utils"

interface BorderBeamProps {
  /**
   * The size of the border beam.
   */
  size?: number
  /**
   * The duration of the border beam.
   */
  duration?: number
  /**
   * The delay of the border beam.
   */
  delay?: number
  /**
   * The color of the border beam from.
   */
  colorFrom?: string
  /**
   * The color of the border beam to.
   */
  colorTo?: string
  /**
   * The motion transition of the border beam.
   */
  transition?: Transition
  /**
   * The class name of the border beam.
   */
  className?: string
  /**
   * The style of the border beam.
   */
  style?: React.CSSProperties
  /**
   * Whether to reverse the animation direction.
   */
  reverse?: boolean
  /**
   * The initial offset position (0-100).
   */
  initialOffset?: number
  /**
   * The border width of the beam.
   */
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
      style={
        {
          "--border-beam-width": `${borderWidth}px`,
        } as React.CSSProperties
      }
    >
      <motion.div
        className={cn(
          "absolute aspect-square",
          "bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent",
          className
        )}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            "--color-from": colorFrom,
            "--color-to": colorTo,
            ...style,
          } as MotionStyle
        }
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
          ...transition,
        }}
      />
    </div>
  )
}

```

## Shine Border (shine-border)
- Source: https://magicui.design/r/shine-border
- Description: Shine border is an animated background border effect.
- Dependencies: none

### registry/magicui/shine-border.tsx

```tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Width of the border in pixels
   * @default 1
   */
  borderWidth?: number
  /**
   * Duration of the animation in seconds
   * @default 14
   */
  duration?: number
  /**
   * Color of the border, can be a single color or an array of colors
   * @default "#000000"
   */
  shineColor?: string | string[]
}

/**
 * Shine Border
 *
 * An animated background border effect component with configurable properties.
 */
export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = "#000000",
  className,
  style,
  ...props
}: ShineBorderProps) {
  return (
    <div
      style={
        {
          "--border-width": `${borderWidth}px`,
          "--duration": `${duration}s`,
          backgroundImage: `radial-gradient(transparent,transparent, ${
            Array.isArray(shineColor) ? shineColor.join(",") : shineColor
          },transparent,transparent)`,
          backgroundSize: "300% 300%",
          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "var(--border-width)",
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "motion-safe:animate-shine pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position]",
        className
      )}
      {...props}
    />
  )
}

```

## Magic Card (magic-card)
- Source: https://magicui.design/r/magic-card
- Description: A spotlight effect that follows your mouse cursor and highlights borders on hover.
- Dependencies: motion

### registry/magicui/magic-card.tsx

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

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#262626",
  gradientOpacity = 0.8,
  gradientFrom = "#9E7AFF",
  gradientTo = "#FE8BBB",
}: MagicCardProps) {
  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)
  const reset = useCallback(() => {
    mouseX.set(-gradientSize)
    mouseY.set(-gradientSize)
  }, [gradientSize, mouseX, mouseY])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY]
  )

  useEffect(() => {
    reset()
  }, [reset])

  useEffect(() => {
    const handleGlobalPointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) {
        reset()
      }
    }

    const handleVisibility = () => {
      if (document.visibilityState !== "visible") {
        reset()
      }
    }

    window.addEventListener("pointerout", handleGlobalPointerOut)
    window.addEventListener("blur", reset)
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      window.removeEventListener("pointerout", handleGlobalPointerOut)
      window.removeEventListener("blur", reset)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [reset])

  return (
    <div
      className={cn("group relative rounded-[inherit]", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onPointerEnter={reset}
    >
      <motion.div
        className="bg-border pointer-events-none absolute inset-0 rounded-[inherit] duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
          radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
          ${gradientFrom}, 
          ${gradientTo}, 
          var(--border) 100%
          )
          `,
        }}
      />
      <div className="bg-background absolute inset-px rounded-[inherit]" />
      <motion.div
        className="pointer-events-none absolute inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)
          `,
          opacity: gradientOpacity,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

```

## Aurora Text (aurora-text)
- Source: https://magicui.design/r/aurora-text
- Description: A beautiful aurora text effect
- Dependencies: none

### registry/magicui/aurora-text.tsx

```tsx
"use client"

import React, { memo } from "react"

interface AuroraTextProps {
  children: React.ReactNode
  className?: string
  colors?: string[]
  speed?: number
}

export const AuroraText = memo(
  ({
    children,
    className = "",
    colors = ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"],
    speed = 1,
  }: AuroraTextProps) => {
    const gradientStyle = {
      backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${
        colors[0]
      })`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animationDuration: `${10 / speed}s`,
    }

    return (
      <span className={`relative inline-block ${className}`}>
        <span className="sr-only">{children}</span>
        <span
          className="animate-aurora relative bg-[length:200%_auto] bg-clip-text text-transparent"
          style={gradientStyle}
          aria-hidden="true"
        >
          {children}
        </span>
      </span>
    )
  }
)

AuroraText.displayName = "AuroraText"

```

## Video Text (video-text)
- Source: https://magicui.design/r/video-text
- Description: A component that displays text with a video playing in the background.
- Dependencies: none

### registry/magicui/video-text.tsx

```tsx
"use client"

import React, { ElementType, ReactNode, useEffect, useState } from "react"

import { cn } from "@/lib/utils"

export interface VideoTextProps {
  /**
   * The video source URL
   */
  src: string
  /**
   * Additional className for the container
   */
  className?: string
  /**
   * Whether to autoplay the video
   */
  autoPlay?: boolean
  /**
   * Whether to mute the video
   */
  muted?: boolean
  /**
   * Whether to loop the video
   */
  loop?: boolean
  /**
   * Whether to preload the video
   */
  preload?: "auto" | "metadata" | "none"
  /**
   * The content to display (will have the video "inside" it)
   */
  children: ReactNode
  /**
   * Font size for the text mask (in viewport width units)
   * @default 10
   */
  fontSize?: string | number
  /**
   * Font weight for the text mask
   * @default "bold"
   */
  fontWeight?: string | number
  /**
   * Text anchor for the text mask
   * @default "middle"
   */
  textAnchor?: string
  /**
   * Dominant baseline for the text mask
   * @default "middle"
   */
  dominantBaseline?: string
  /**
   * Font family for the text mask
   * @default "sans-serif"
   */
  fontFamily?: string
  /**
   * The element type to render for the text
   * @default "div"
   */
  as?: ElementType
}

export function VideoText({
  src,
  children,
  className = "",
  autoPlay = true,
  muted = true,
  loop = true,
  preload = "auto",
  fontSize = 20,
  fontWeight = "bold",
  textAnchor = "middle",
  dominantBaseline = "middle",
  fontFamily = "sans-serif",
  as: Component = "div",
}: VideoTextProps) {
  const [svgMask, setSvgMask] = useState("")
  const content = React.Children.toArray(children).join("")

  useEffect(() => {
    const updateSvgMask = () => {
      const responsiveFontSize =
        typeof fontSize === "number" ? `${fontSize}vw` : fontSize
      const newSvgMask = `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><text x='50%' y='50%' font-size='${responsiveFontSize}' font-weight='${fontWeight}' text-anchor='${textAnchor}' dominant-baseline='${dominantBaseline}' font-family='${fontFamily}'>${content}</text></svg>`
      setSvgMask(newSvgMask)
    }

    updateSvgMask()
    window.addEventListener("resize", updateSvgMask)
    return () => window.removeEventListener("resize", updateSvgMask)
  }, [content, fontSize, fontWeight, textAnchor, dominantBaseline, fontFamily])

  const dataUrlMask = `url("data:image/svg+xml,${encodeURIComponent(svgMask)}")`

  return (
    <Component className={cn(`relative size-full`, className)}>
      {/* Create a container that masks the video to only show within text */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          maskImage: dataUrlMask,
          WebkitMaskImage: dataUrlMask,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      >
        <video
          className="h-full w-full object-cover"
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          preload={preload}
          playsInline
        >
          <source src={src} />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Add a backup text element for SEO/accessibility */}
      <span className="sr-only">{content}</span>
    </Component>
  )
}

```

## Animated Shiny Text (animated-shiny-text)
- Source: https://magicui.design/r/animated-shiny-text
- Description: A light glare effect which pans across text making it appear as if it is shimmering.
- Dependencies: none

### registry/magicui/animated-shiny-text.tsx

```tsx
import { ComponentPropsWithoutRef, CSSProperties, FC } from "react"

import { cn } from "@/lib/utils"

export interface AnimatedShinyTextProps
  extends ComponentPropsWithoutRef<"span"> {
  shimmerWidth?: number
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  ...props
}) => {
  return (
    <span
      style={
        {
          "--shiny-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        "mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70",

        // Shine effect
        "animate-shiny-text [background-size:var(--shiny-width)_100%] bg-clip-text [background-position:0_0] bg-no-repeat [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

        // Shine gradient
        "bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent dark:via-white/80",

        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

```

## Animated Gradient Text (animated-gradient-text)
- Source: https://magicui.design/r/animated-gradient-text
- Description: An animated gradient background which transitions between colors for text.
- Dependencies: none

### registry/magicui/animated-gradient-text.tsx

```tsx
import { ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

export interface AnimatedGradientTextProps
  extends ComponentPropsWithoutRef<"div"> {
  speed?: number
  colorFrom?: string
  colorTo?: string
}

export function AnimatedGradientText({
  children,
  className,
  speed = 1,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  ...props
}: AnimatedGradientTextProps) {
  return (
    <span
      style={
        {
          "--bg-size": `${speed * 300}%`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
        } as React.CSSProperties
      }
      className={cn(
        `animate-gradient inline bg-gradient-to-r from-[var(--color-from)] via-[var(--color-to)] to-[var(--color-from)] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

```

## Safari (safari)
- Source: https://magicui.design/r/safari
- Description: A safari browser mockup to showcase your website.
- Dependencies: none

### registry/magicui/safari.tsx

```tsx
import type { HTMLAttributes } from "react"

const SAFARI_WIDTH = 1203
const SAFARI_HEIGHT = 753
const SCREEN_X = 1
const SCREEN_Y = 52
const SCREEN_WIDTH = 1200
const SCREEN_HEIGHT = 700

// Calculated percentages
const LEFT_PCT = (SCREEN_X / SAFARI_WIDTH) * 100
const TOP_PCT = (SCREEN_Y / SAFARI_HEIGHT) * 100
const WIDTH_PCT = (SCREEN_WIDTH / SAFARI_WIDTH) * 100
const HEIGHT_PCT = (SCREEN_HEIGHT / SAFARI_HEIGHT) * 100

type SafariMode = "default" | "simple"

export interface SafariProps extends HTMLAttributes<HTMLDivElement> {
  url?: string
  imageSrc?: string
  videoSrc?: string
  mode?: SafariMode
}

export function Safari({
  imageSrc,
  videoSrc,
  url,
  mode = "default",
  className,
  style,
  ...props
}: SafariProps) {
  const hasVideo = !!videoSrc
  const hasMedia = hasVideo || !!imageSrc

  return (
    <div
      className={`relative inline-block w-full align-middle leading-none ${className ?? ""}`}
      style={{
        aspectRatio: `${SAFARI_WIDTH}/${SAFARI_HEIGHT}`,
        ...style,
      }}
      {...props}
    >
      {hasVideo && (
        <div
          className="pointer-events-none absolute z-0 overflow-hidden"
          style={{
            left: `${LEFT_PCT}%`,
            top: `${TOP_PCT}%`,
            width: `${WIDTH_PCT}%`,
            height: `${HEIGHT_PCT}%`,
          }}
        >
          <video
            className="block size-full object-cover"
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
        </div>
      )}

      {!hasVideo && imageSrc && (
        <div
          className="pointer-events-none absolute z-0 overflow-hidden"
          style={{
            left: `${LEFT_PCT}%`,
            top: `${TOP_PCT}%`,
            width: `${WIDTH_PCT}%`,
            height: `${HEIGHT_PCT}%`,
            borderRadius: "0 0 11px 11px",
          }}
        >
          <img
            src={imageSrc}
            alt=""
            className="block size-full object-cover object-top"
          />
        </div>
      )}

      <svg
        viewBox={`0 0 ${SAFARI_WIDTH} ${SAFARI_HEIGHT}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 z-10 size-full"
        style={{ transform: "translateZ(0)" }}
      >
        <defs>
          <mask id="safariPunch" maskUnits="userSpaceOnUse">
            <rect
              x="0"
              y="0"
              width={SAFARI_WIDTH}
              height={SAFARI_HEIGHT}
              fill="white"
            />
            <path
              d="M1 52H1201V741C1201 747.075 1196.08 752 1190 752H12C5.92486 752 1 747.075 1 741V52Z"
              fill="black"
            />
          </mask>

          <clipPath id="path0">
            <rect width={SAFARI_WIDTH} height={SAFARI_HEIGHT} fill="white" />
          </clipPath>

          <clipPath id="roundedBottom">
            <path
              d="M1 52H1201V741C1201 747.075 1196.08 752 1190 752H12C5.92486 752 1 747.075 1 741V52Z"
              fill="white"
            />
          </clipPath>
        </defs>

        <g
          clipPath="url(#path0)"
          mask={hasMedia ? "url(#safariPunch)" : undefined}
        >
          <path
            d="M0 52H1202V741C1202 747.627 1196.63 753 1190 753H12C5.37258 753 0 747.627 0 741V52Z"
            className="fill-[#E5E5E5] dark:fill-[#404040]"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 12C0 5.37258 5.37258 0 12 0H1190C1196.63 0 1202 5.37258 1202 12V52H0L0 12Z"
            className="fill-[#E5E5E5] dark:fill-[#404040]"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.06738 12C1.06738 5.92487 5.99225 1 12.0674 1H1189.93C1196.01 1 1200.93 5.92487 1200.93 12V51H1.06738V12Z"
            className="fill-white dark:fill-[#262626]"
          />
          <circle
            cx="27"
            cy="25"
            r="6"
            className="fill-[#E5E5E5] dark:fill-[#404040]"
          />
          <circle
            cx="47"
            cy="25"
            r="6"
            className="fill-[#E5E5E5] dark:fill-[#404040]"
          />
          <circle
            cx="67"
            cy="25"
            r="6"
            className="fill-[#E5E5E5] dark:fill-[#404040]"
          />
          <path
            d="M286 17C286 13.6863 288.686 11 292 11H946C949.314 11 952 13.6863 952 17V35C952 38.3137 949.314 41 946 41H292C288.686 41 286 38.3137 286 35V17Z"
            className="fill-[#E5E5E5] dark:fill-[#404040]"
          />
          <g className="mix-blend-luminosity">
            <path
              d="M566.269 32.0852H572.426C573.277 32.0852 573.696 31.6663 573.696 30.7395V25.9851C573.696 25.1472 573.353 24.7219 572.642 24.6521V23.0842C572.642 20.6721 571.036 19.5105 569.348 19.5105C567.659 19.5105 566.053 20.6721 566.053 23.0842V24.6711C565.393 24.7727 565 25.1917 565 25.9851V30.7395C565 31.6663 565.418 32.0852 566.269 32.0852ZM567.272 22.97C567.272 21.491 568.211 20.6785 569.348 20.6785C570.478 20.6785 571.423 21.491 571.423 22.97V24.6394L567.272 24.6458V22.97Z"
              fill="#A3A3A3"
            />
          </g>

          <g className="mix-blend-luminosity">
            <text
              x="580"
              y="30"
              fill="#A3A3A3"
              fontSize="12"
              fontFamily="Arial, sans-serif"
            >
              {url}
            </text>
          </g>

          {mode === "default" ? (
            <>
              <g className="mix-blend-luminosity">
                <path
                  d="M265.5 33.8984C265.641 33.8984 265.852 33.8516 266.047 33.7422C270.547 31.2969 272.109 30.1641 272.109 27.3203V21.4219C272.109 20.4844 271.742 20.1484 270.961 19.8125C270.094 19.4453 267.18 18.4297 266.328 18.1406C266.07 18.0547 265.766 18 265.5 18C265.234 18 264.93 18.0703 264.672 18.1406C263.82 18.3828 260.906 19.4531 260.039 19.8125C259.258 20.1406 258.891 20.4844 258.891 21.4219V27.3203C258.891 30.1641 260.461 31.2812 264.945 33.7422C265.148 33.8516 265.359 33.8984 265.5 33.8984ZM265.922 19.5781C266.945 19.9766 269.172 20.7656 270.344 21.1875C270.562 21.2656 270.617 21.3828 270.617 21.6641V27.0234C270.617 29.3125 269.469 29.9375 265.945 32.0625C265.727 32.1875 265.617 32.2344 265.508 32.2344V19.4844C265.617 19.4844 265.734 19.5156 265.922 19.5781Z"
                  fill="#A3A3A3"
                />
              </g>
              <g className="mix-blend-luminosity">
                <path
                  d="M936.273 24.9766C936.5 24.9766 936.68 24.9062 936.82 24.7578L940.023 21.5312C940.195 21.3594 940.273 21.1719 940.273 20.9531C940.273 20.7422 940.188 20.5391 940.023 20.3828L936.82 17.125C936.68 16.9688 936.5 16.8906 936.273 16.8906C935.852 16.8906 935.516 17.2422 935.516 17.6719C935.516 17.8828 935.594 18.0547 935.727 18.2031L937.594 20.0312C937.227 19.9766 936.852 19.9453 936.477 19.9453C932.609 19.9453 929.516 23.0391 929.516 26.9141C929.516 30.7891 932.633 33.9062 936.5 33.9062C940.375 33.9062 943.484 30.7891 943.484 26.9141C943.484 26.4453 943.156 26.1094 942.688 26.1094C942.234 26.1094 941.93 26.4453 941.93 26.9141C941.93 29.9297 939.516 32.3516 936.5 32.3516C933.492 32.3516 931.07 29.9297 931.07 26.9141C931.07 23.875 933.469 21.4688 936.477 21.4688C936.984 21.4688 937.453 21.5078 937.867 21.5781L935.734 23.6875C935.594 23.8281 935.516 24 935.516 24.2109C935.516 24.6406 935.852 24.9766 936.273 24.9766Z"
                  fill="#A3A3A3"
                />
              </g>
              <g className="mix-blend-luminosity">
                <path
                  d="M1134 33.0156C1134.49 33.0156 1134.89 32.6094 1134.89 32.1484V27.2578H1139.66C1140.13 27.2578 1140.54 26.8594 1140.54 26.3672C1140.54 25.8828 1140.13 25.4766 1139.66 25.4766H1134.89V20.5859C1134.89 20.1172 1134.49 19.7188 1134 19.7188C1133.52 19.7188 1133.11 20.1172 1133.11 20.5859V25.4766H1128.34C1127.88 25.4766 1127.46 25.8828 1127.46 26.3672C1127.46 26.8594 1127.88 27.2578 1128.34 27.2578H1133.11V32.1484C1133.11 32.6094 1133.52 33.0156 1134 33.0156Z"
                  fill="#A3A3A3"
                />
              </g>
              <g className="mix-blend-luminosity">
                <path
                  d="M1161.8 31.0703H1163.23V32.375C1163.23 34.0547 1164.12 34.9219 1165.81 34.9219H1174.2C1175.89 34.9219 1176.77 34.0547 1176.77 32.3828V24.0469C1176.77 22.375 1175.89 21.5 1174.2 21.5H1172.77V20.2578C1172.77 18.5859 1171.88 17.7109 1170.19 17.7109H1161.8C1160.1 17.7109 1159.23 18.5781 1159.23 20.2578V28.5234C1159.23 30.1953 1160.1 31.0703 1161.8 31.0703ZM1161.9 29.5078C1161.18 29.5078 1160.78 29.1328 1160.78 28.3828V20.3984C1160.78 19.6406 1161.18 19.2656 1161.9 19.2656H1170.09C1170.8 19.2656 1171.2 19.6406 1171.2 20.3984V21.5H1165.81C1164.12 21.5 1163.23 22.375 1163.23 24.0469V29.5078H1161.9ZM1165.91 33.3672C1165.19 33.3672 1164.8 32.9922 1164.8 32.2422V24.1875C1164.8 23.4297 1165.19 23.0625 1165.91 23.0625H1174.1C1174.81 23.0625 1175.21 23.4297 1175.21 24.1875V32.2422C1175.21 32.9922 1174.81 33.3672 1174.1 33.3672H1165.91Z"
                  fill="#A3A3A3"
                />
              </g>
              <g className="mix-blend-luminosity">
                <path
                  d="M1099.51 28.4141C1099.91 28.4141 1100.24 28.0859 1100.24 27.6953V19.8359L1100.18 18.6797L1100.66 19.25L1101.75 20.4141C1101.88 20.5547 1102.06 20.625 1102.24 20.625C1102.6 20.625 1102.9 20.3672 1102.9 20C1102.9 19.8047 1102.82 19.6641 1102.69 19.5312L1100.06 17.0078C1099.88 16.8203 1099.7 16.7578 1099.51 16.7578C1099.32 16.7578 1099.14 16.8203 1098.95 17.0078L1096.33 19.5312C1096.2 19.6641 1096.12 19.8047 1096.12 20C1096.12 20.3672 1096.41 20.625 1096.77 20.625C1096.95 20.625 1097.14 20.5547 1097.27 20.4141L1098.35 19.25L1098.84 18.6719L1098.78 19.8359V27.6953C1098.78 28.0859 1099.11 28.4141 1099.51 28.4141ZM1095 34.6562H1104C1105.7 34.6562 1106.57 33.7812 1106.57 32.1094V24.4297C1106.57 22.7578 1105.7 21.8828 1104 21.8828H1101.89V23.4375H1103.9C1104.61 23.4375 1105.02 23.8125 1105.02 24.5625V31.9688C1105.02 32.7188 1104.61 33.0938 1103.9 33.0938H1095.1C1094.38 33.0938 1093.98 32.7188 1093.98 31.9688V24.5625C1093.98 23.8125 1094.38 23.4375 1095.1 23.4375H1097.13V21.8828H1095C1093.31 21.8828 1092.43 22.75 1092.43 24.4297V32.1094C1092.43 33.7812 1093.31 34.6562 1095 34.6562Z"
                  fill="#A3A3A3"
                />
              </g>
              <g className="mix-blend-luminosity">
                <path
                  d="M99.5703 33.6016H112.938C114.633 33.6016 115.516 32.7266 115.516 31.0547V21.5469C115.516 19.875 114.633 19 112.938 19H99.5703C97.8828 19 97 19.8672 97 21.5469V31.0547C97 32.7266 97.8828 33.6016 99.5703 33.6016ZM99.6719 32.0469C98.9531 32.0469 98.5547 31.6719 98.5547 30.9141V21.6875C98.5547 20.9297 98.9531 20.5547 99.6719 20.5547H103.234V32.0469H99.6719ZM112.836 20.5547C113.555 20.5547 113.953 20.9297 113.953 21.6875V30.9141C113.953 31.6719 113.555 32.0469 112.836 32.0469H104.711V20.5547H112.836ZM101.703 23.4141C101.984 23.4141 102.219 23.1719 102.219 22.9062C102.219 22.6406 101.984 22.4062 101.703 22.4062H100.102C99.8203 22.4062 99.5859 22.6406 99.5859 22.9062C99.5859 23.1719 99.8203 23.4141 100.102 23.4141H101.703ZM101.703 25.5156C101.984 25.5156 102.219 25.2812 102.219 25.0078C102.219 24.7422 101.984 24.5078 101.703 24.5078H100.102C99.8203 24.5078 99.5859 24.7422 99.5859 25.0078C99.5859 25.2812 99.8203 25.5156 100.102 25.5156H101.703ZM101.703 27.6094C101.984 27.6094 102.219 27.3828 102.219 27.1094C102.219 26.8438 101.984 26.6172 101.703 26.6172H100.102C99.8203 26.6172 99.5859 26.8438 99.5859 27.1094C99.5859 27.3828 99.8203 27.6094 100.102 27.6094H101.703Z"
                  fill="#A3A3A3"
                />
              </g>
              <g className="mix-blend-luminosity">
                <path
                  d="M143.914 32.5938C144.094 32.7656 144.312 32.8594 144.562 32.8594C145.086 32.8594 145.492 32.4531 145.492 31.9375C145.492 31.6797 145.391 31.4453 145.211 31.2656L139.742 25.9219L145.211 20.5938C145.391 20.4141 145.492 20.1719 145.492 19.9219C145.492 19.4062 145.086 19 144.562 19C144.312 19 144.094 19.0938 143.922 19.2656L137.844 25.2031C137.625 25.4062 137.516 25.6562 137.516 25.9297C137.516 26.2031 137.625 26.4375 137.836 26.6484L143.914 32.5938Z"
                  fill="#A3A3A3"
                />
              </g>
              <g className="mix-blend-luminosity">
                <path
                  d="M168.422 32.8594C168.68 32.8594 168.891 32.7656 169.07 32.5938L175.148 26.6562C175.359 26.4375 175.469 26.2109 175.469 25.9297C175.469 25.6562 175.367 25.4141 175.148 25.2109L169.07 19.2656C168.891 19.0938 168.68 19 168.422 19C167.898 19 167.492 19.4062 167.492 19.9219C167.492 20.1719 167.602 20.4141 167.773 20.5938L173.25 25.9375L167.773 31.2656C167.594 31.4531 167.492 31.6797 167.492 31.9375C167.492 32.4531 167.898 32.8594 168.422 32.8594Z"
                  fill="#A3A3A3"
                />
              </g>
            </>
          ) : null}
        </g>
      </svg>
    </div>
  )
}

```

## iPhone (iphone)
- Source: https://magicui.design/r/iphone
- Description: A mockup of the iPhone
- Dependencies: none

### registry/magicui/iphone.tsx

```tsx
import type { HTMLAttributes } from "react"

const PHONE_WIDTH = 433
const PHONE_HEIGHT = 882
const SCREEN_X = 21.25
const SCREEN_Y = 19.25
const SCREEN_WIDTH = 389.5
const SCREEN_HEIGHT = 843.5
const SCREEN_RADIUS = 55.75

// Calculated percentages
const LEFT_PCT = (SCREEN_X / PHONE_WIDTH) * 100
const TOP_PCT = (SCREEN_Y / PHONE_HEIGHT) * 100
const WIDTH_PCT = (SCREEN_WIDTH / PHONE_WIDTH) * 100
const HEIGHT_PCT = (SCREEN_HEIGHT / PHONE_HEIGHT) * 100
const RADIUS_H = (SCREEN_RADIUS / SCREEN_WIDTH) * 100
const RADIUS_V = (SCREEN_RADIUS / SCREEN_HEIGHT) * 100

export interface IphoneProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  videoSrc?: string
}

export function Iphone({
  src,
  videoSrc,
  className,
  style,
  ...props
}: IphoneProps) {
  const hasVideo = !!videoSrc
  const hasMedia = hasVideo || !!src

  return (
    <div
      className={`relative inline-block w-full align-middle leading-none ${className}`}
      style={{
        aspectRatio: `${PHONE_WIDTH}/${PHONE_HEIGHT}`,
        ...style,
      }}
      {...props}
    >
      {hasVideo && (
        <div
          className="pointer-events-none absolute z-0 overflow-hidden"
          style={{
            left: `${LEFT_PCT}%`,
            top: `${TOP_PCT}%`,
            width: `${WIDTH_PCT}%`,
            height: `${HEIGHT_PCT}%`,
            borderRadius: `${RADIUS_H}% / ${RADIUS_V}%`,
          }}
        >
          <video
            className="block size-full object-cover"
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
        </div>
      )}

      {!hasVideo && src && (
        <div
          className="pointer-events-none absolute z-0 overflow-hidden"
          style={{
            left: `${LEFT_PCT}%`,
            top: `${TOP_PCT}%`,
            width: `${WIDTH_PCT}%`,
            height: `${HEIGHT_PCT}%`,
            borderRadius: `${RADIUS_H}% / ${RADIUS_V}%`,
          }}
        >
          <img
            src={src}
            alt=""
            className="block size-full object-cover object-top"
          />
        </div>
      )}

      <svg
        viewBox={`0 0 ${PHONE_WIDTH} ${PHONE_HEIGHT}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 size-full"
        style={{ transform: "translateZ(0)" }}
      >
        <g mask={hasMedia ? "url(#screenPunch)" : undefined}>
          <path
            d="M2 73C2 32.6832 34.6832 0 75 0H357C397.317 0 430 32.6832 430 73V809C430 849.317 397.317 882 357 882H75C34.6832 882 2 849.317 2 809V73Z"
            className="fill-[#E5E5E5] dark:fill-[#404040]"
          />
          <path
            d="M0 171C0 170.448 0.447715 170 1 170H3V204H1C0.447715 204 0 203.552 0 203V171Z"
            className="fill-[#E5E5E5] dark:fill-[#404040]"
          />
          <path
            d="M1 234C1 233.448 1.44772 233 2 233H3.5V300H2C1.44772 300 1 299.552 1 299V234Z"
            className="fill-[#E5E5E5] dark:fill-[#404040]"
          />
          <path
            d="M1 319C1 318.448 1.44772 318 2 318H3.5V385H2C1.44772 385 1 384.552 1 384V319Z"
            className="fill-[#E5E5E5] dark:fill-[#404040]"
          />
          <path
            d="M430 279H432C432.552 279 433 279.448 433 280V384C433 384.552 432.552 385 432 385H430V279Z"
            className="fill-[#E5E5E5] dark:fill-[#404040]"
          />
          <path
            d="M6 74C6 35.3401 37.3401 4 76 4H356C394.66 4 426 35.3401 426 74V808C426 846.66 394.66 878 356 878H76C37.3401 878 6 846.66 6 808V74Z"
            className="fill-white dark:fill-[#262626]"
          />
        </g>

        <path
          opacity="0.5"
          d="M174 5H258V5.5C258 6.60457 257.105 7.5 256 7.5H176C174.895 7.5 174 6.60457 174 5.5V5Z"
          className="fill-[#E5E5E5] dark:fill-[#404040]"
        />

        <path
          d={`M${SCREEN_X} 75C${SCREEN_X} 44.2101 46.2101 ${SCREEN_Y} 77 ${SCREEN_Y}H355C385.79 ${SCREEN_Y} 410.75 44.2101 410.75 75V807C410.75 837.79 385.79 862.75 355 862.75H77C46.2101 862.75 ${SCREEN_X} 837.79 ${SCREEN_X} 807V75Z`}
          className="fill-[#E5E5E5] stroke-[#E5E5E5] stroke-[0.5] dark:fill-[#404040] dark:stroke-[#404040]"
          mask={hasMedia ? "url(#screenPunch)" : undefined}
        />

        <path
          d="M154 48.5C154 38.2827 162.283 30 172.5 30H259.5C269.717 30 278 38.2827 278 48.5C278 58.7173 269.717 67 259.5 67H172.5C162.283 67 154 58.7173 154 48.5Z"
          className="fill-[#F5F5F5] dark:fill-[#262626]"
        />
        <path
          d="M249 48.5C249 42.701 253.701 38 259.5 38C265.299 38 270 42.701 270 48.5C270 54.299 265.299 59 259.5 59C253.701 59 249 54.299 249 48.5Z"
          className="fill-[#F5F5F5] dark:fill-[#262626]"
        />
        <path
          d="M254 48.5C254 45.4624 256.462 43 259.5 43C262.538 43 265 45.4624 265 48.5C265 51.5376 262.538 54 259.5 54C256.462 54 254 51.5376 254 48.5Z"
          className="fill-[#E5E5E5] dark:fill-[#404040]"
        />

        <defs>
          <mask id="screenPunch" maskUnits="userSpaceOnUse">
            <rect
              x="0"
              y="0"
              width={PHONE_WIDTH}
              height={PHONE_HEIGHT}
              fill="white"
            />
            <rect
              x={SCREEN_X}
              y={SCREEN_Y}
              width={SCREEN_WIDTH}
              height={SCREEN_HEIGHT}
              rx={SCREEN_RADIUS}
              ry={SCREEN_RADIUS}
              fill="black"
            />
          </mask>
          <clipPath id="roundedCorners">
            <rect
              x={SCREEN_X}
              y={SCREEN_Y}
              width={SCREEN_WIDTH}
              height={SCREEN_HEIGHT}
              rx={SCREEN_RADIUS}
              ry={SCREEN_RADIUS}
            />
          </clipPath>
        </defs>
      </svg>
    </div>
  )
}

```

## Android (android)
- Source: https://magicui.design/r/android
- Description: A mockup of an Android device.
- Dependencies: none

### registry/magicui/android.tsx

```tsx
import { SVGProps } from "react"

export interface AndroidProps extends SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  src?: string
  videoSrc?: string
}

export function Android({
  width = 433,
  height = 882,
  src,
  videoSrc,
  ...props
}: AndroidProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M376 153H378C379.105 153 380 153.895 380 155V249C380 250.105 379.105 251 378 251H376V153Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <path
        d="M376 301H378C379.105 301 380 301.895 380 303V351C380 352.105 379.105 353 378 353H376V301Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <path
        d="M0 42C0 18.8041 18.804 0 42 0H336C359.196 0 378 18.804 378 42V788C378 811.196 359.196 830 336 830H42C18.804 830 0 811.196 0 788V42Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <path
        d="M2 43C2 22.0132 19.0132 5 40 5H338C358.987 5 376 22.0132 376 43V787C376 807.987 358.987 825 338 825H40C19.0132 825 2 807.987 2 787V43Z"
        className="fill-white dark:fill-[#262626]"
      />

      <g clipPath="url(#clip0_514_20855)">
        <path
          d="M9.25 48C9.25 29.3604 24.3604 14.25 43 14.25H335C353.64 14.25 368.75 29.3604 368.75 48V780C368.75 798.64 353.64 813.75 335 813.75H43C24.3604 813.75 9.25 798.64 9.25 780V48Z"
          className="fill-[#E5E5E5] stroke-[#E5E5E5] stroke-[0.5] dark:fill-[#404040] dark:stroke-[#404040]"
        />
      </g>
      <circle
        cx="189"
        cy="28"
        r="9"
        className="fill-white dark:fill-[#262626]"
      />
      <circle
        cx="189"
        cy="28"
        r="4"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      {src && (
        <image
          href={src}
          width="360"
          height="800"
          className="size-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#clip0_514_20855)"
        />
      )}
      {videoSrc && (
        <foreignObject
          width="380"
          height="820"
          clipPath="url(#clip0_514_20855)"
          preserveAspectRatio="xMidYMid slice"
        >
          <video
            className="size-full object-cover"
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
          />
        </foreignObject>
      )}
      <defs>
        <clipPath id="clip0_514_20855">
          <rect
            width="360"
            height="800"
            rx="33"
            ry="25"
            className="fill-white dark:fill-[#262626]"
            transform="translate(9 14)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}

```

## Rainbow Button (rainbow-button)
- Source: https://magicui.design/r/rainbow-button
- Description: An animated button with a rainbow effect.
- Dependencies: none

### registry/magicui/rainbow-button.tsx

```tsx
import React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const rainbowButtonVariants = cva(
  cn(
    "relative cursor-pointer group transition-all animate-rainbow",
    "inline-flex items-center justify-center gap-2 shrink-0",
    "rounded-sm outline-none focus-visible:ring-[3px] aria-invalid:border-destructive",
    "text-sm font-medium whitespace-nowrap",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0"
  ),
  {
    variants: {
      variant: {
        default:
          "border-0 bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] bg-[length:200%] text-primary-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.125rem)_solid_transparent] before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] before:[filter:blur(0.75rem)] dark:bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))]",
        outline:
          "border border-input border-b-transparent bg-[linear-gradient(#ffffff,#ffffff),linear-gradient(#ffffff_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] bg-[length:200%] text-accent-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] before:[filter:blur(0.75rem)] dark:bg-[linear-gradient(#0a0a0a,#0a0a0a),linear-gradient(#0a0a0a_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-xl px-3 text-xs",
        lg: "h-11 rounded-xl px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof rainbowButtonVariants> {
  asChild?: boolean
}

const RainbowButton = React.forwardRef<HTMLButtonElement, RainbowButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        data-slot="button"
        className={cn(rainbowButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

RainbowButton.displayName = "RainbowButton"

export { RainbowButton, rainbowButtonVariants, type RainbowButtonProps }

```

## Ripple Button (ripple-button)
- Source: https://magicui.design/r/ripple-button
- Description: An animated button with ripple useful for user engagement.
- Dependencies: none

### registry/magicui/ripple-button.tsx

```tsx
"use client"

import React, { MouseEvent, useEffect, useState } from "react"

import { cn } from "@/lib/utils"

interface RippleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  rippleColor?: string
  duration?: string
}

export const RippleButton = React.forwardRef<
  HTMLButtonElement,
  RippleButtonProps
>(
  (
    {
      className,
      children,
      rippleColor = "#ffffff",
      duration = "600ms",
      onClick,
      ...props
    },
    ref
  ) => {
    const [buttonRipples, setButtonRipples] = useState<
      Array<{ x: number; y: number; size: number; key: number }>
    >([])

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      createRipple(event)
      onClick?.(event)
    }

    const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget
      const rect = button.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = event.clientX - rect.left - size / 2
      const y = event.clientY - rect.top - size / 2

      const newRipple = { x, y, size, key: Date.now() }
      setButtonRipples((prevRipples) => [...prevRipples, newRipple])
    }

    useEffect(() => {
      if (buttonRipples.length > 0) {
        const lastRipple = buttonRipples[buttonRipples.length - 1]
        const timeout = setTimeout(() => {
          setButtonRipples((prevRipples) =>
            prevRipples.filter((ripple) => ripple.key !== lastRipple.key)
          )
        }, parseInt(duration))
        return () => clearTimeout(timeout)
      }
    }, [buttonRipples, duration])

    return (
      <button
        className={cn(
          "bg-background text-primary relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 px-4 py-2 text-center",
          className
        )}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        <div className="relative z-10">{children}</div>
        <span className="pointer-events-none absolute inset-0">
          {buttonRipples.map((ripple) => (
            <span
              className="animate-rippling bg-background absolute rounded-full opacity-30"
              key={ripple.key}
              style={{
                width: `${ripple.size}px`,
                height: `${ripple.size}px`,
                top: `${ripple.y}px`,
                left: `${ripple.x}px`,
                backgroundColor: rippleColor,
                transform: `scale(0)`,
              }}
            />
          ))}
        </span>
      </button>
    )
  }
)

RippleButton.displayName = "RippleButton"

```
