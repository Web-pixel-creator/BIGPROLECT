# 21st.dev Community Components Collection

Extracted from https://21st.dev/

---

## Buttons & CTA

### button-colorful (kokonutd)
**Source:** https://21st.dev/community/components/kokonutd/button-colorful/default

```tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function ButtonColorful({
  className,
  label = "Explore Components",
  ...props
}: ButtonColorfulProps) {
  return (
    <Button
      className={cn(
        "relative h-10 px-4 overflow-hidden",
        "bg-zinc-900 dark:bg-zinc-100",
        "transition-all duration-200",
        "group",
        className
      )}
      {...props}
    >
      {/* Gradient background effect */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
          "opacity-40 group-hover:opacity-80",
          "blur transition-opacity duration-500"
        )}
      />
      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        <span className="text-white dark:text-zinc-900">{label}</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-white/90 dark:text-zinc-900/90" />
      </div>
    </Button>
  );
}
```

**Dependencies:** `@/components/ui/button`, `@/lib/utils`, `lucide-react`

---

### particle-button (kokonutd)
**Source:** https://21st.dev/community/components/kokonutd/particle-button/default

```tsx
"use client"

import * as React from "react"
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
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
            y: [0, (i < 3 ? 1 : -1) * (Math.random() * 50 + 20)],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </AnimatePresence>
  );
}

const ParticleButton = React.forwardRef<
  HTMLButtonElement,
  ParticleButtonProps
>(
  (
    {
      className,
      children,
      onClick,
      onSuccess,
      successDuration = 1000,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleClick = async (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      setIsLoading(true);
      if (onClick) {
        await onClick(event);
      }
      setIsLoading(false);
      setIsSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
      setTimeout(() => {
        setIsSuccess(false);
      }, successDuration);
    };

    return (
      <>
        <Button
          ref={buttonRef}
          className={cn("relative overflow-hidden", className)}
          onClick={handleClick}
          disabled={isLoading || isSuccess}
          {...props}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading...
            </div>
          ) : isSuccess ? (
            <div className="flex items-center justify-center">
              <svg
                className="h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Success!
            </div>
          ) : (
            children
          )}
        </Button>
        {isSuccess && <SuccessParticles buttonRef={buttonRef} />}
      </>
    );
  }
);

ParticleButton.displayName = "ParticleButton";

export { ParticleButton };
```

**Dependencies:** `@/components/ui/button`, `@/lib/utils`, `framer-motion`, `lucide-react`

---

### shimmer-button (magicui)
**Source:** https://21st.dev/community/components/magicui/shimmer-button/default

```tsx
import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(0, 0, 0, 1)",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)] dark:text-black",
          "transform-gpu transition-transform duration-300 ease-in-out hover:scale-105",
          className,
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            "absolute inset-0 z-0 overflow-hidden [border-radius:var(--radius)]",
            "transform-gpu transition-transform duration-300 ease-in-out hover:scale-105",
            "before:absolute before:inset-0 before:-z-10 before:translate-x-[100%] before:translate-y-[100%] before:rotate-[-45deg] before:bg-[conic-gradient(from_var(--spread)_at_50%_50%,#0000_0deg,var(--shimmer-color)_180deg,#0000_360deg)] before:p-[var(--cut)] before:content-['']",
            "before:animate-[shimmer_var(--speed)_infinite]",
            "after:absolute after:inset-0 after:-z-10 after:translate-x-[-100%] after:translate-y-[-100%] after:rotate-[-45deg] after:bg-[conic-gradient(from_var(--spread)_at_50%_50%,#0000_0deg,var(--shimmer-color)_180deg,#0000_360deg)] after:p-[var(--cut)] after:content-['']",
            "after:animate-[shimmer_var(--speed)_infinite]",
          )}
        ></div>
        <span className="relative z-20">{children}</span>
      </button>
    );
  },
);

ShimmerButton.displayName = "ShimmerButton";

export default ShimmerButton;
```

**Dependencies:** `@/lib/utils`
**CSS Required:** Add shimmer animation keyframe

---

### shiny-button (magicui)
**Source:** https://21st.dev/community/components/magicui/shiny-button/default

```tsx
"use client";
import React from "react";
import { motion, type AnimationProps } from "framer-motion";
import { cn } from "@/lib/utils";

const animationProps: AnimationProps = {
  initial: { "--x": "100%", scale: 0.8 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
};

interface ShinyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const ShinyButton: React.FC<ShinyButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <motion.button
      {...animationProps}
      {...props}
      className={cn(
        "relative rounded-lg px-6 py-2 font-medium backdrop-blur-xl transition-[box-shadow] duration-300 ease-in-out hover:shadow dark:bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/10%)_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_hsl(var(--primary)/10%)]",
        className,
      )}
    >
      <span
        className="relative block h-full w-full text-sm uppercase tracking-wide text-[rgb(0,0,0,65%)] dark:font-light dark:text-[rgb(255,255,255,90%)]"
        style={{
          maskImage:
            "linear-gradient(-75deg,hsl(var(--primary)) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),hsl(var(--primary)) calc(var(--x) + 100%))",
        }}
      >
        {children}
      </span>
      <span
        style={{
          mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
          maskComposite: "exclude",
        }}
        className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,hsl(var(--primary)/10%)_calc(var(--x)+20%),hsl(var(--primary)/50%)_calc(var(--x)+25%),hsl(var(--primary)/10%)_calc(var(--x)+100%))] p-px"
      ></span>
    </motion.button>
  );
};
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### magnetic-button (bundui)
**Source:** https://21st.dev/community/components/bundui/magnetic-button/default

```tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const SPRING_CONFIG = { damping: 100, stiffness: 400 };

type MagneticButtonType = {
  children: React.ReactNode;
  distance?: number;
};

function MagneticButton({
  children,
  distance = 0.6,
}: MagneticButtonType) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_CONFIG);
  const springY = useSpring(y, SPRING_CONFIG);

  useEffect(() => {
    const calculateDistance = (e: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        if (isHovered) {
          x.set(distanceX * distance);
          y.set(distanceY * distance);
        } else {
          x.set(0);
          y.set(0);
        }
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      x.set(0);
      y.set(0);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    if (ref.current) {
      ref.current.addEventListener('mousemove', calculateDistance);
      ref.current.addEventListener('mouseleave', handleMouseLeave);
      ref.current.addEventListener('mouseenter', handleMouseEnter);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('mousemove', calculateDistance);
        ref.current.removeEventListener('mouseleave', handleMouseLeave);
        ref.current.removeEventListener('mouseenter', handleMouseEnter);
      }
    };
  }, [isHovered, x, y, distance]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

export { MagneticButton };
```

**Dependencies:** `framer-motion`

---

## Backgrounds

### aurora-background (aceternity)
**Source:** https://21st.dev/community/components/aceternity/aurora-background/default

```tsx
"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-slate-950 transition-bg",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(
              `
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)]
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%]
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform`,
              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
            )}
          ></div>
        </div>
        {children}
      </div>
    </main>
  );
};
```

**Dependencies:** `@/lib/utils`
**CSS Required:** Aurora animation keyframe, CSS color variables

---

### background-beams (aceternity)
**Source:** https://21st.dev/community/components/aceternity/background-beams/default

```tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = React.memo(
  ({ className }: { className?: string }) => {
    const paths = [
      "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
      "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867",
      "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
      "M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851",
      "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
      "M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835",
      "M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827",
      "M-331 -245C-331 -245 -263 160 201 287C665 414 733 819 733 819",
      "M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811",
      "M-317 -261C-317 -261 -249 144 215 271C679 398 747 803 747 803",
      "M-310 -269C-310 -269 -242 136 222 263C686 390 754 795 754 795",
      "M-303 -277C-303 -277 -235 128 229 255C693 382 761 787 761 787",
      "M-296 -285C-296 -285 -228 120 236 247C700 374 768 779 768 779",
      "M-289 -293C-289 -293 -221 112 243 239C707 366 775 771 775 771",
      "M-282 -301C-282 -301 -214 104 250 231C714 358 782 763 782 763",
      "M-275 -309C-275 -309 -207 96 257 223C721 350 789 755 789 755",
      "M-268 -317C-268 -317 -200 88 264 215C728 342 796 747 796 747",
      "M-261 -325C-261 -325 -193 80 271 207C735 334 803 739 803 739",
      "M-254 -333C-254 -333 -186 72 278 199C742 326 810 731 810 731",
      "M-247 -341C-247 -341 -179 64 285 191C749 318 817 723 817 723",
      "M-240 -349C-240 -349 -172 56 292 183C756 310 824 715 824 715",
      "M-233 -357C-233 -357 -165 48 299 175C763 302 831 707 831 707",
      "M-226 -365C-226 -365 -158 40 306 167C770 294 838 699 838 699",
      "M-219 -373C-219 -373 -151 32 313 159C777 286 845 691 845 691",
      "M-212 -381C-212 -381 -144 24 320 151C784 278 852 683 852 683",
      "M-205 -389C-205 -389 -137 16 327 143C791 270 859 675 859 675",
      "M-198 -397C-198 -397 -130 8 334 135C798 262 866 667 866 667",
      "M-191 -405C-191 -405 -123 0 341 127C805 254 873 659 873 659",
      "M-184 -413C-184 -413 -116 -8 348 119C812 246 880 651 880 651",
      "M-177 -421C-177 -421 -109 -16 355 111C819 238 887 643 887 643",
      "M-170 -429C-170 -429 -102 -24 362 103C826 230 894 635 894 635",
      "M-163 -437C-163 -437 -95 -32 369 95C833 222 901 627 901 627",
      "M-156 -445C-156 -445 -88 -40 376 87C840 214 908 619 908 619",
    ];

    const randomDuration = () => Math.random() * 20 + 20;

    return (
      <div
        className={cn(
          "absolute left-1/2 top-1/2 h-[800px] w-[1500px] -translate-x-1/2 -translate-y-1/2 overflow-hidden",
          className
        )}
      >
        <svg
          className="absolute h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient
              id="beams-gradient"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop stopColor="rgba(120, 120, 120, 0)" offset="0%" />
              <stop stopColor="rgba(120, 120, 120, 0.3)" offset="100%" />
            </radialGradient>
          </defs>
          {paths.map((d, i) => (
            <motion.path
              key={`path-${i}`}
              d={d}
              stroke="url(#beams-gradient)"
              strokeWidth="2"
              fill="none"
              initial={{
                pathLength: 0,
                opacity: 0,
              }}
              animate={{
                pathLength: 1,
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: randomDuration(),
                ease: "linear",
                repeat: Infinity,
                delay: Math.random() * 10,
              }}
            />
          ))}
        </svg>
      </div>
    );
  }
);

BackgroundBeams.displayName = "BackgroundBeams";
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### interactive-hover-button (magicui)
**Source:** https://21st.dev/community/components/magicui/interactive-hover-button/default

```tsx
import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-32 cursor-pointer overflow-hidden rounded-full border bg-background p-2 text-center font-semibold",
        className,
      )}
      {...props}
    >
      <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
        <span>{text}</span>
        <ArrowRight />
      </div>
      <div className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg bg-primary transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-primary" />
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
```

**Dependencies:** `@/lib/utils`, `lucide-react`

---

### vortex (aceternity)  
**Source:** https://21st.dev/community/components/aceternity/vortex/default

```tsx
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { motion } from "framer-motion";

interface VortexProps {
  children?: any;
  className?: string;
  containerClassName?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  backgroundColor?: string;
}

export const Vortex = (props: VortexProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef(null);
  const particleCount = props.particleCount || 700;
  const particlePropCount = 9;
  const particlePropsLength = particleCount * particlePropCount;
  const rangeY = props.rangeY || 100;
  const baseTTL = 50;
  const rangeTTL = 150;
  const baseSpeed = props.baseSpeed || 0.0;
  const rangeSpeed = props.rangeSpeed || 1.5;
  const baseRadius = props.baseRadius || 1;
  const rangeRadius = props.rangeRadius || 2;
  const baseHue = props.baseHue || 220;
  const rangeHue = 100;
  const noiseSteps = 3;
  const xOff = 0.00125;
  const yOff = 0.00125;
  const zOff = 0.0005;
  const backgroundColor = props.backgroundColor || "#000000";
  let tick = 0;
  const noise3D = createNoise3D();
  let particleProps = new Float32Array(particlePropsLength);
  let center: [number, number] = [0, 0];

  const TAU: number = 2 * Math.PI;
  const rand = (n: number): number => n * Math.random();
  const randRange = (n: number): number => n - rand(2 * n);
  const fadeInOut = (t: number, m: number): number => {
    let hm = 0.5 * m;
    return Math.abs(((t + hm) % m) - hm) / hm;
  };
  const lerp = (n1: number, n2: number, speed: number): number =>
    (1 - speed) * n1 + speed * n2;

  // ... (full implementation available in source)

  return (
    <div className={cn("relative h-full w-full", props.containerClassName)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        ref={containerRef}
        className="absolute h-full w-full inset-0 z-0 bg-transparent flex items-center justify-center"
      >
        <canvas ref={canvasRef}></canvas>
      </motion.div>
      <div className={cn("relative z-10", props.className)}>
        {props.children}
      </div>
    </div>
  );
};
```

**Dependencies:** `@/lib/utils`, `framer-motion`, `simplex-noise`

---

### shooting-stars (aceternity)
**Source:** https://21st.dev/community/components/aceternity/shooting-stars/default

```tsx
"use client";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef } from "react";

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
  speed: number;
  distance: number;
}

interface ShootingStarsProps {
  minSpeed?: number;
  maxSpeed?: number;
  minDelay?: number;
  maxDelay?: number;
  starColor?: string;
  trailColor?: string;
  starWidth?: number;
  starHeight?: number;
  className?: string;
}

const getRandomStartPoint = () => {
  const side = Math.floor(Math.random() * 4);
  const offset = Math.random() * window.innerWidth;
  switch (side) {
    case 0: return { x: offset, y: 0, angle: 45 };
    case 1: return { x: window.innerWidth, y: offset, angle: 135 };
    case 2: return { x: offset, y: window.innerHeight, angle: 225 };
    case 3: return { x: 0, y: offset, angle: 315 };
    default: return { x: 0, y: 0, angle: 45 };
  }
};

export const ShootingStars = ({
  minSpeed = 10,
  maxSpeed = 20,
  minDelay = 500,
  maxDelay = 2000,
  starColor = "#FFFFFF",
  trailColor = "rgba(255, 255, 255, 0.3)",
  starWidth = 2,
  starHeight = 100,
  className,
}: ShootingStarsProps) => {
  const [stars, setStars] = useState<ShootingStar[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createStar = () => {
      const { x, y, angle } = getRandomStartPoint();
      const newStar: ShootingStar = {
        id: Date.now(),
        x, y, angle,
        scale: Math.random() * 0.5 + 0.5,
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
        distance: 0,
      };
      setStars((prevStars) => [...prevStars, newStar]);
      const delay = Math.random() * (maxDelay - minDelay) + minDelay;
      setTimeout(createStar, delay);
    };

    const initialDelay = Math.random() * (maxDelay - minDelay) + minDelay;
    const timeoutId = setTimeout(createStar, initialDelay);
    return () => clearTimeout(timeoutId);
  }, [minSpeed, maxSpeed, minDelay, maxDelay]);

  return (
    <div ref={containerRef} className={cn("absolute inset-0 overflow-hidden", className)}>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            transform: `rotate(${star.angle}deg) scale(${star.scale})`,
            transformOrigin: "0 0",
          }}
        >
          <div
            className="absolute h-1 w-1 rounded-full"
            style={{ backgroundColor: starColor, width: `${starWidth}px`, height: `${starWidth}px` }}
          />
          <div
            className="absolute h-1 w-40 origin-left"
            style={{
              background: `linear-gradient(to right, ${trailColor}, transparent)`,
              width: `${starHeight}px`,
              height: `${starWidth}px`,
            }}
          />
        </div>
      ))}
    </div>
  );
};
```

**Dependencies:** `@/lib/utils`

---

### stars-background (aceternity)
**Source:** https://21st.dev/community/components/aceternity/stars-background/default

```tsx
"use client";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef, useCallback } from "react";

interface StarProps {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number | null;
}

interface StarBackgroundProps {
  starDensity?: number;
  allStarsTwinkle?: boolean;
  twinkleProbability?: number;
  minTwinkleSpeed?: number;
  maxTwinkleSpeed?: number;
  className?: string;
}

export const StarsBackground: React.FC<StarBackgroundProps> = ({
  starDensity = 0.00015,
  allStarsTwinkle = true,
  twinkleProbability = 0.7,
  minTwinkleSpeed = 0.5,
  maxTwinkleSpeed = 1,
  className,
}) => {
  const [stars, setStars] = useState<StarProps[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateStars = useCallback(
    (width: number, height: number): StarProps[] => {
      const numStars = Math.floor(width * height * starDensity);
      return Array.from({ length: numStars }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 0.8 + 0.5,
        opacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed:
          allStarsTwinkle || Math.random() < twinkleProbability
            ? minTwinkleSpeed + Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)
            : null,
      }));
    },
    [starDensity, allStarsTwinkle, twinkleProbability, minTwinkleSpeed, maxTwinkleSpeed]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
        setStars(generateStars(width, height));
      }
    }
  }, [generateStars]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          stars.forEach((star, index) => {
            let currentOpacity = star.opacity;
            if (star.twinkleSpeed) {
              const time = Date.now() / 1000;
              currentOpacity = star.opacity + (Math.sin(time * star.twinkleSpeed + index) * 0.3 + 0.3);
            }
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
            ctx.fill();
          });
          requestAnimationFrame(animate);
        };
        animate();
      }
    }
  }, [stars]);

  return (
    <canvas ref={canvasRef} className={cn("fixed top-0 left-0 w-full h-full -z-10", className)} />
  );
};
```

**Dependencies:** `@/lib/utils`

---

## Borders

### hover-border-gradient (aceternity)
**Source:** https://21st.dev/community/components/aceternity/hover-border-gradient/default

```tsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<{
  as?: React.ElementType;
  containerClassName?: string;
  className?: string;
  duration?: number;
  clockwise?: boolean;
} & React.HTMLAttributes<HTMLElement>>) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = (currentDirection: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM: "radial-gradient(20.7% 50% at 50% 100%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    RIGHT: "radial-gradient(16.2% 41.2% at 100% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
  };

  const highlight = "radial-gradient(75% 181.15% at 50% 50%, #3275F8 0%, rgba(255, 255, 255, 0) 100%)";

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered]);

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-full border content-center bg-black/20 hover:bg-black/10 transition duration-500 dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit",
        containerClassName
      )}
      {...props}
    >
      <div className={cn("w-auto text-white z-10 bg-black px-4 py-2 rounded-[inherit]", className)}>
        {children}
      </div>
      <motion.div
        className={cn("flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]")}
        style={{ filter: "blur(2px)", position: "absolute", width: "100%", height: "100%" }}
        initial={{ background: movingMap[direction] }}
        animate={{ background: hovered ? [movingMap[direction], highlight] : movingMap[direction] }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
    </Tag>
  );
}
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### background-boxes (aceternity)
**Source:** https://21st.dev/community/components/aceternity/background-boxes/default

```tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BoxesCore = ({
  className,
  ...rest
}: {
  className?: string;
}) => {
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);

  const colors = [
    "rgb(125 211 252)", // sky-300
    "rgb(249 168 212)", // pink-300
    "rgb(134 239 172)", // green-300
    "rgb(253 224 71)",  // yellow-300
    "rgb(252 165 165)", // red-300
    "rgb(216 180 254)", // purple-300
    "rgb(147 197 253)", // blue-300
    "rgb(165 180 252)", // indigo-300
    "rgb(196 181 253)", // violet-300
  ];
  
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="w-16 h-8 border-l border-slate-700 relative"
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: getRandomColor(),
                transition: { duration: 0 },
              }}
              animate={{ transition: { duration: 2 } }}
              key={`col` + j}
              className="w-16 h-8 border-r border-t border-slate-700 relative"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-slate-700 stroke-[1px] pointer-events-none"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

## Tooltips & Popups

### animated-tooltip (aceternity)
**Source:** https://21st.dev/community/components/aceternity/animated-tooltip/default

```tsx
"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

export const AnimatedTooltip = ({
  items,
  className,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    image: string;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);
  
  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <>
      {items.map((item, idx) => (
        <div
          className={cn("-mr-4 relative group", className)}
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: "spring", stiffness: 260, damping: 10 },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{ translateX: translateX, rotate: rotate, whiteSpace: "nowrap" }}
                className="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2"
              >
                <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px" />
                <div className="absolute left-1/2 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px" />
                <div className="font-bold text-white relative z-30 text-base">{item.name}</div>
                <div className="text-white text-xs">{item.designation}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <Image
            onMouseMove={handleMouseMove}
            height={100}
            width={100}
            src={item.image}
            alt={item.name}
            className="object-cover !m-0 !p-0 object-top rounded-full h-14 w-14 border-2 group-hover:scale-105 group-hover:z-30 border-white relative transition duration-500"
          />
        </div>
      ))}
    </>
  );
};
```

**Dependencies:** `@/lib/utils`, `framer-motion`, `next/image`

---

## Comparison

### compare (aceternity)
**Source:** https://21st.dev/community/components/aceternity/compare/default

```tsx
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { IconDotsVertical } from "@tabler/icons-react";

interface CompareProps {
  firstImage?: string;
  secondImage?: string;
  className?: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  initialSliderPercentage?: number;
  slideMode?: "hover" | "drag";
  showHandlebar?: boolean;
  autoplay?: boolean;
  autoplayDuration?: number;
}

export const Compare = ({
  firstImage = "",
  secondImage = "",
  className,
  firstImageClassName,
  secondImageClassname,
  initialSliderPercentage = 50,
  slideMode = "hover",
  showHandlebar = true,
  autoplay = false,
  autoplayDuration = 5000,
}: CompareProps) => {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = useCallback(() => {
    if (autoplay && !isDragging && !isMouseOver) {
      autoplayRef.current = setInterval(() => {
        setSliderXPercent((prev) => (prev < 99 ? prev + 1 : 1));
      }, autoplayDuration / 100);
    }
  }, [autoplay, autoplayDuration, isDragging, isMouseOver]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (slideMode === "drag" && !isDragging) return;
    if (slideMode === "hover" && isDragging) return;
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;
    setSliderXPercent(Math.max(0, Math.min(100, percent)));
    stopAutoplay();
  };

  return (
    <div
      ref={sliderRef}
      className={cn("relative w-full h-full overflow-hidden select-none cursor-ew-resize", className)}
      onMouseMove={handleMouseMove}
      onMouseDown={() => slideMode === "drag" && setIsDragging(true)}
      onMouseUp={() => slideMode === "drag" && setIsDragging(false)}
      onMouseLeave={() => setIsMouseOver(false)}
      onMouseEnter={() => setIsMouseOver(true)}
    >
      <img
        src={firstImage}
        alt="First Image"
        className={cn("absolute inset-0 w-full h-full object-cover object-left", firstImageClassName)}
        draggable={false}
      />
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)` }}
      >
        <img
          src={secondImage}
          alt="Second Image"
          className={cn("absolute inset-0 w-full h-full object-cover object-left", secondImageClassname)}
          draggable={false}
        />
      </div>
      {showHandlebar && (
        <div
          className="absolute top-0 bottom-0 bg-white/50 w-1 -translate-x-1/2 cursor-ew-resize"
          style={{ left: `${sliderXPercent}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1 cursor-ew-resize">
            <IconDotsVertical className="h-4 w-4 text-black" />
          </div>
        </div>
      )}
    </div>
  );
};
```

**Dependencies:** `@/lib/utils`, `framer-motion`, `@/components/ui/sparkles`, `@tabler/icons-react`

---

### border-beam (magicui)
**Source:** https://21st.dev/community/components/magicui/border-beam/default

```tsx
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export const BorderBeam = ({
  className,
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  delay = 0,
}: BorderBeamProps) => {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--anchor": anchor,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
        "![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        "after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]",
        className,
      )}
    />
  );
};
```

**Dependencies:** `@/lib/utils`
**CSS Required:** Add `border-beam` animation keyframe to tailwind.config

---

### lamp (aceternity)
**Source:** https://21st.dev/community/components/aceternity/lamp/default

```tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 w-full rounded-md z-0",
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_50%_50%]"
        >
          <div className="absolute w-[100%] left-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-[100%] left-0 bg-slate-950 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_50%_50%]"
        >
          <div className="absolute w-40 h-[100%] right-0 bg-slate-950 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-[100%] right-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-slate-950 blur-2xl"></div>
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl"></div>
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-cyan-400 blur-2xl"
        ></motion.div>
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-cyan-400"
        ></motion.div>
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-slate-950"></div>
      </div>
      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
};
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

## Cards

### 3d-card-effect (aceternity)
**Source:** https://21st.dev/community/components/aceternity/3d-card-effect/default

```tsx
"use client";
import { cn } from "@/lib/utils";
import React, { createContext, useState, useContext, useRef, useEffect } from "react";

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseEnter = () => setIsMouseEntered(true);
  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div className={cn("py-20 flex items-center justify-center", containerClassName)} style={{ perspective: "1000px" }}>
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn("flex items-center justify-center relative transition-all duration-200 ease-linear", className)}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("h-96 w-96 [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]", className)}>
      {children}
    </div>
  );
};

export const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMouseEntered] = useMouseEnter();

  useEffect(() => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    }
  }, [isMouseEntered]);

  return (
    <Tag ref={ref} className={cn("w-fit transition duration-200 ease-linear", className)} {...rest}>
      {children}
    </Tag>
  );
};

export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  }
  return context;
};
```

**Dependencies:** `@/lib/utils`

---

### spotlight (aceternity)
**Source:** https://21st.dev/community/components/aceternity/spotlight/default

```tsx
import React from "react";
import { cn } from "@/lib/utils";

type SpotlightProps = {
  className?: string;
  fill?: string;
};

export const Spotlight = ({ className, fill }: SpotlightProps) => {
  return (
    <svg
      className={cn(
        "animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill || "white"}
          fillOpacity="0.21"
        ></ellipse>
      </g>
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur_1065_8"></feGaussianBlur>
        </filter>
      </defs>
    </svg>
  );
};
```

**Dependencies:** `@/lib/utils`
**CSS Required:** Add `spotlight` animation keyframe

---

## Particles & Effects

### sparkles (aceternity)
**Source:** https://21st.dev/community/components/aceternity/sparkles/default

```tsx
"use client";
import React, { useId, useMemo, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = (props: ParticlesProps) => {
  const { id, className, background, minSize, maxSize, speed, particleColor, particleDensity } = props;
  const [init, setInit] = useState(false);
  
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);
  
  const controls = useAnimation();

  useEffect(() => {
    if (init) {
      controls.start({ opacity: 1, transition: { delay: 0, duration: 1, ease: "linear" } });
    }
  }, [init, controls]);

  const particlesLoaded = async (container?: Container) => {};

  const particleOptions = useMemo(
    () => ({
      background: { color: { value: background || "transparent" } },
      fullScreen: { enable: false },
      fpsLimit: 120,
      interactivity: {
        events: { onClick: { enable: false, mode: "push" }, onHover: { enable: false, mode: "repulse" }, resize: true },
        modes: { push: { quantity: 4 }, repulse: { distance: 200, duration: 0.4 } },
      },
      particles: {
        color: { value: particleColor || "#FFFFFF" },
        move: { direction: "none", enable: true, outModes: { default: "out" }, random: false, speed: speed || 1, straight: false },
        number: { density: { enable: true, value_area: particleDensity || 800 }, value: particleDensity || 100 },
        opacity: { value: 1 },
        shape: { type: "circle" },
        size: { value: { min: minSize || 1, max: maxSize || 3 } },
      },
      detectRetina: true,
    }),
    [background, minSize, maxSize, speed, particleColor, particleDensity]
  );

  return (
    <motion.div animate={controls} className={cn(className)}>
      {init && <Particles id={id || useId()} init={particlesLoaded} options={particleOptions as any} />}
    </motion.div>
  );
};
```

**Dependencies:** `@/lib/utils`, `framer-motion`, `@tsparticles/react`, `@tsparticles/slim`

---

### text-generate-effect (aceternity)
**Source:** https://21st.dev/community/components/aceternity/text-generate-effect/default

```tsx
"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split(" ");
  
  useEffect(() => {
    animate(
      "span",
      { opacity: 1, filter: filter ? "blur(0px)" : "none" },
      { duration: duration ? duration : 1, delay: stagger(0.2) }
    );
  }, [scope.current]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="dark:text-white text-black opacity-0"
            style={{ filter: filter ? "blur(10px)" : "none" }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="dark:text-white text-black text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

## Scrolling & Animation

### marquee (magicui)
**Source:** https://21st.dev/community/components/magicui/marquee/default

```tsx
import { cn } from "@/lib/utils";

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  [key: string]: any;
}

export function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        { "flex-row": !vertical, "flex-col": vertical },
        className,
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
              "[animation-direction:reverse]": reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
```

**Dependencies:** `@/lib/utils`
**CSS Required:** Add `marquee` and `marquee-vertical` animation keyframes

---

### wavy-background (aceternity)
**Source:** https://21st.dev/community/components/aceternity/wavy-background/default

```tsx
"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: any;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}) => {
  const noise = createNoise3D();
  let w: number, h: number, nt: number, i: number, x: number, ctx: any, canvas: any;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const getSpeed = () => speed === "slow" ? 0.001 : 0.002;

  const init = () => {
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    w = ctx.canvas.width = window.innerWidth;
    h = ctx.canvas.height = window.innerHeight / 2;
    ctx.filter = `blur(${blur}px)`;
    nt = 0;
    window.onresize = () => {
      w = ctx.canvas.width = window.innerWidth;
      h = ctx.canvas.height = window.innerHeight / 2;
      ctx.filter = `blur(${blur}px)`;
    };
    render();
  };

  const waveColors = colors || ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"];
  
  const drawWave = (n: number) => {
    nt += getSpeed();
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];
      for (x = 0; x < w; x += 5) {
        var y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + h * 0.5);
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

  let animationId: number;
  const render = () => {
    ctx.fillStyle = backgroundFill || "black";
    ctx.globalAlpha = waveOpacity || 0.5;
    ctx.fillRect(0, 0, w, h);
    drawWave(5);
    animationId = requestAnimationFrame(render);
  };

  useEffect(() => {
    init();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div className={cn("h-screen flex flex-col items-center justify-center", containerClassName)}>
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{ ...(isSafari ? { filter: `blur(${blur}px)` } : {}) }}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
```

**Dependencies:** `@/lib/utils`, `simplex-noise`

---

### flip-words (aceternity)
**Source:** https://21st.dev/community/components/aceternity/flip-words/default

```tsx
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const FlipWords = ({
  words,
  duration = 3000,
  className,
}: {
  words: string[];
  duration?: number;
  className?: string;
}) => {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const startAnimation = useCallback(() => {
    const word = words[words.indexOf(currentWord) + 1] || words[0];
    setCurrentWord(word);
    setIsAnimating(true);
  }, [currentWord, words]);

  useEffect(() => {
    if (!isAnimating) setTimeout(() => startAnimation(), duration);
  }, [isAnimating, duration, startAnimation]);

  return (
    <AnimatePresence onExitComplete={() => setIsAnimating(false)}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut", type: "spring", stiffness: 100, damping: 10 }}
        exit={{ opacity: 0, y: -40, x: 40, filter: "blur(8px)", scale: 2, position: "absolute" }}
        className={cn("z-10 inline-block relative text-left text-neutral-900 dark:text-neutral-100 px-2", className)}
        key={currentWord}
      >
        {currentWord.split("").map((letter, index) => (
          <motion.span
            key={currentWord + index}
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="inline-block"
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### infinite-moving-cards (aceternity)
**Source:** https://21st.dev/community/components/aceternity/infinite-moving-cards/default

```tsx
"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: { quote: string; name: string; title: string }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) scrollerRef.current.appendChild(duplicatedItem);
      });
      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty("--animation-direction", direction === "left" ? "forwards" : "reverse");
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      const durations = { fast: "20s", normal: "40s", slow: "80s" };
      containerRef.current.style.setProperty("--animation-duration", durations[speed]);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]", className)}
    >
      <ul
        ref={scrollerRef}
        className={cn("flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap", start && "animate-scroll", pauseOnHover && "hover:[animation-play-state:paused]")}
      >
        {items.map((item) => (
          <li
            className="w-[350px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 px-8 py-6 md:w-[450px]"
            style={{ background: "linear-gradient(180deg, var(--slate-800), var(--slate-900)" }}
            key={item.name}
          >
            <blockquote>
              <span className="relative z-20 text-sm leading-[1.6] text-gray-100 font-normal">{item.quote}</span>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                <span className="flex flex-col gap-1">
                  <span className="text-sm leading-[1.6] text-gray-400 font-normal">{item.name}</span>
                  <span className="text-sm leading-[1.6] text-gray-400 font-normal">{item.title}</span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

**Dependencies:** `@/lib/utils`
**CSS Required:** Add `scroll` animation keyframe

---

## Heroes

### hero-parallax (aceternity)
**Source:** https://21st.dev/community/components/aceternity/hero-parallax/default

```tsx
"use client";
import React from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export const HeroParallax = ({ products }: { products: { title: string; link: string; thumbnail: string }[] }) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };
  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig);

  return (
    <div ref={ref} className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px]">
      <Header />
      <motion.div style={{ rotateX, rotateZ, translateY, opacity }}>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => <ProductCard product={product} translate={translateX} key={product.title} />)}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => <ProductCard product={product} translate={translateXReverse} key={product.title} />)}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => <ProductCard product={product} translate={translateX} key={product.title} />)}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => (
  <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
    <h1 className="text-2xl md:text-7xl font-bold text-white">The Ultimate <br />development studio</h1>
    <p className="max-w-2xl text-base md:text-xl mt-8 text-neutral-200">We build beautiful products with the latest technologies.</p>
  </div>
);

export const ProductCard = ({ product, translate }: { product: { title: string; link: string; thumbnail: string }; translate: MotionValue<number> }) => (
  <motion.div style={{ x: translate }} whileHover={{ y: -20 }} className="group/product h-96 w-[30rem] relative flex-shrink-0">
    <Link href={product.link} className="block group-hover/product:shadow-2xl">
      <Image src={product.thumbnail} height="600" width="600" className="object-cover object-left-top absolute h-full w-full inset-0" alt={product.title} />
    </Link>
    <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
    <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">{product.title}</h2>
  </motion.div>
);
```

**Dependencies:** `@/lib/utils`, `framer-motion`, `next/image`, `next/link`

---

### background-gradient (aceternity)
**Source:** https://21st.dev/community/components/aceternity/background-gradient/default

```tsx
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  const variants = {
    initial: { backgroundPosition: "0 50%" },
    animate: { backgroundPosition: ["0, 50%", "100% 50%", "0 50%"] },
  };
  
  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={animate ? { duration: 5, repeat: Infinity, repeatType: "reverse" } : undefined}
        style={{ backgroundSize: animate ? "400% 400%" : undefined }}
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] opacity-60 group-hover:opacity-100 blur-xl transition duration-500 will-change-transform",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={animate ? { duration: 5, repeat: Infinity, repeatType: "reverse" } : undefined}
        style={{ backgroundSize: animate ? "400% 400%" : undefined }}
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] will-change-transform",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
        )}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### tracing-beam (aceternity)
**Source:** https://21st.dev/community/components/aceternity/tracing-beam/default

```tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useTransform, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export const TracingBeam = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) setSvgHeight(contentRef.current.offsetHeight);
  }, []);

  const y1 = useSpring(useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]), { stiffness: 500, damping: 90 });
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]), { stiffness: 500, damping: 90 });

  return (
    <motion.div ref={ref} className={cn("relative w-full max-w-4xl mx-auto h-full", className)}>
      <div className="absolute -left-4 md:-left-20 top-3">
        <motion.div className="ml-[27px] h-4 w-4 rounded-full border border-neutral-200 shadow-sm flex items-center justify-center">
          <motion.div className="h-2 w-2 rounded-full border border-neutral-300 bg-white" />
        </motion.div>
        <svg viewBox={`0 0 20 ${svgHeight}`} width="20" height={svgHeight} className="ml-4 block" aria-hidden="true">
          <motion.path d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`} fill="none" stroke="#9091A0" strokeOpacity="0.16"></motion.path>
          <motion.path d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`} fill="none" stroke="url(#gradient)" strokeWidth="1"></motion.path>
          <defs>
            <motion.linearGradient id="gradient" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={y1} y2={y2}>
              <stop stopColor="#18CCFC" stopOpacity="0"></stop>
              <stop stopColor="#18CCFC"></stop>
              <stop offset="0.325" stopColor="#6344F5"></stop>
              <stop offset="1" stopColor="#AE48FF" stopOpacity="0"></stop>
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </motion.div>
  );
};
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### text-reveal-card (aceternity)
**Source:** https://21st.dev/community/components/aceternity/text-reveal-card/default

```tsx
"use client";
import React, { useEffect, useRef, useState, memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { twMerge } from "tailwind-merge";

export const TextRevealCard = ({
  text,
  revealText,
  children,
  className,
}: {
  text: string;
  revealText: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  const [widthPercentage, setWidthPercentage] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(0);
  const [localWidth, setLocalWidth] = useState(0);
  const [isMouseOver, setIsMouseOver] = useState(false);

  useEffect(() => {
    if (cardRef.current) {
      const { left, width: localWidth } = cardRef.current.getBoundingClientRect();
      setLeft(left);
      setLocalWidth(localWidth);
    }
  }, []);

  const mouseMoveHandler = (event: any) => {
    event.preventDefault();
    const { clientX } = event;
    if (cardRef.current) {
      const relativeX = clientX - left;
      setWidthPercentage((relativeX / localWidth) * 100);
    }
  };

  const rotateDeg = (widthPercentage - 50) / 15;

  return (
    <div
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => { setIsMouseOver(false); setWidthPercentage(0); }}
      onMouseMove={mouseMoveHandler}
      ref={cardRef}
      className={cn("bg-[#1d1c20] border border-white/[0.08] w-[40rem] rounded-lg p-8 relative overflow-hidden", className)}
    >
      {children}
      <div className="h-40 relative flex items-center overflow-hidden">
        <motion.div
          style={{ width: "100%" }}
          animate={isMouseOver ? { opacity: widthPercentage > 0 ? 1 : 0, clipPath: `inset(0 ${100 - widthPercentage}% 0 0)` } : { clipPath: `inset(0 ${100 - widthPercentage}% 0 0)` }}
          transition={isMouseOver ? { duration: 0.1, ease: "linear" } : { duration: 0.4, ease: "linear" }}
          className="absolute bg-[#1d1c20] z-20 will-change-transform"
        >
          <p style={{ textShadow: "0 0 4px rgba(255, 255, 255, 0.5)" }} className="text-base sm:text-lg md:text-xl lg:text-3xl py-10 font-bold text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-300">
            {revealText}
          </p>
        </motion.div>
        <motion.div animate={{ left: `${widthPercentage}%`, rotate: `${rotateDeg}deg`, opacity: widthPercentage > 0 ? 1 : 0 }} className="h-40 w-[8px] bg-gradient-to-b from-transparent via-neutral-800 to-transparent absolute z-50 will-change-transform"></motion.div>
        <div className="overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white,transparent)]">
          <p className="text-base sm:text-lg md:text-xl lg:text-3xl py-10 font-bold bg-clip-text text-transparent bg-[#323238]">{text}</p>
          <MemoizedStars />
        </div>
      </div>
    </div>
  );
};

export const TextRevealCardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={twMerge("text-white text-lg mb-2", className)}>{children}</h2>
);

export const TextRevealCardDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={twMerge("text-[#a9a9a9] text-sm", className)}>{children}</p>
);

const Stars = () => {
  const randomMove = () => Math.random() * 4 - 2;
  const randomOpacity = () => Math.random();
  const random = () => Math.random();
  return (
    <div className="absolute inset-0">
      {[...Array(80)].map((_, i) => (
        <motion.span
          key={`star-${i}`}
          animate={{ top: `calc(${random() * 100}% + ${randomMove()}px)`, left: `calc(${random() * 100}% + ${randomMove()}px)`, opacity: randomOpacity(), scale: [1, 1.2, 0] }}
          transition={{ duration: random() * 2 + 4, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", top: `${random() * 100}%`, left: `${random() * 100}%`, width: "2px", height: "2px", backgroundColor: "white", borderRadius: "50%", zIndex: 1 }}
          className="inline-block"
        ></motion.span>
      ))}
    </div>
  );
};

export const MemoizedStars = memo(Stars);
```

**Dependencies:** `@/lib/utils`, `framer-motion`, `tailwind-merge`

---

### glowing-stars (aceternity)
**Source:** https://21st.dev/community/components/aceternity/glowing-stars/default

```tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const GlowingStarsBackgroundCard = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  const [mouseEnter, setMouseEnter] = useState(false);

  return (
    <div
      onMouseEnter={() => setMouseEnter(true)}
      onMouseLeave={() => setMouseEnter(false)}
      className={cn("bg-[linear-gradient(110deg,#333_0.6%,#222)] p-4 max-w-md max-h-[20rem] h-full w-full rounded-xl border border-[#eaeaea] dark:border-neutral-600", className)}
    >
      <div className="flex justify-center items-center">
        <Illustration mouseEnter={mouseEnter} />
      </div>
      <div className="px-2 pb-6">{children}</div>
    </div>
  );
};

export const GlowingStarsDescription = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <p className={cn("text-base text-white max-w-[16rem]", className)}>{children}</p>
);

export const GlowingStarsTitle = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <h2 className={cn("font-bold text-2xl text-[#eaeaea] mb-4", className)}>{children}</h2>
);

export const Illustration = ({ mouseEnter }: { mouseEnter: boolean }) => {
  const stars = 108, columns = 18;
  const [glowingStars, setGlowingStars] = useState<number[]>([]);
  const highlightedStars = useRef<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      highlightedStars.current = Array.from({ length: 5 }, () => Math.floor(Math.random() * stars));
      setGlowingStars([...highlightedStars.current]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-48 p-1 w-full" style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: "1px" }}>
      {[...Array(stars)].map((_, starIdx) => {
        const isGlowing = glowingStars.includes(starIdx);
        const delay = (starIdx % 10) * 0.1;
        const staticDelay = starIdx * 0.01;
        return (
          <div key={`matrix-col-${starIdx}`} className="relative flex items-center justify-center">
            <Star isGlowing={mouseEnter ? true : isGlowing} delay={mouseEnter ? staticDelay : delay} />
            {mouseEnter && <Glow delay={staticDelay} />}
            <AnimatePresence mode="wait">{isGlowing && <Glow delay={delay} />}</AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

const Star = ({ isGlowing, delay }: { isGlowing: boolean; delay: number }) => (
  <motion.div
    initial={{ scale: 1 }}
    animate={{ scale: isGlowing ? [1, 1.2, 2.5, 2.2, 1.5] : 1, background: isGlowing ? "#fff" : "#666" }}
    transition={{ duration: 2, delay, ease: "easeInOut" }}
    className={cn("bg-[#666] h-[1px] w-[1px] rounded-full relative z-20")}
  ></motion.div>
);

const Glow = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 2, delay, ease: "easeInOut" }}
    exit={{ opacity: 0 }}
    className="absolute left-1/2 -translate-x-1/2 z-10 h-[4px] w-[4px] rounded-full bg-blue-500 blur-[1px] shadow-2xl shadow-blue-400"
  />
);
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### meteors (aceternity)
**Source:** https://21st.dev/community/components/aceternity/meteors/default

```tsx
import { cn } from "@/lib/utils";
import React from "react";

export const Meteors = ({ number, className }: { number?: number; className?: string }) => {
  const meteors = new Array(number || 20).fill(true);
  return (
    <>
      {meteors.map((_, idx) => (
        <span
          key={"meteor" + idx}
          className={cn(
            "animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent",
            className
          )}
          style={{
            top: 0,
            left: Math.floor(Math.random() * (400 - -400) + -400) + "px",
            animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
            animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
          }}
        ></span>
      ))}
    </>
  );
};
```

**Dependencies:** `@/lib/utils`
**CSS Required:** Add `meteor-effect` animation keyframe

---

### moving-border (aceternity)
**Source:** https://21st.dev/community/components/aceternity/moving-border/default

```tsx
"use client";
import React, { useRef } from "react";
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component className={cn("bg-transparent relative text-xl h-16 w-40 p-[1px] overflow-hidden", containerClassName)} style={{ borderRadius }} {...otherProps}>
      <div className="absolute inset-0" style={{ borderRadius: `calc(${borderRadius} + 2px)` }}>
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div className={cn("h-20 w-20 opacity-[0.8] bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)]", borderClassName)} />
        </MovingBorder>
      </div>
      <div className={cn("relative bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased", className)} style={{ borderRadius }}>
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({ children, duration = 2000, rx, ry, ...otherProps }: { children: React.ReactNode; duration?: number; rx?: string; ry?: string; [key: string]: any }) => {
  const pathRef = useRef<any>();
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).x);
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).y);
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="absolute h-full w-full" width="100%" height="100%" {...otherProps}>
        <rect fill="none" width="100%" height="100%" rx={rx} ry={ry} ref={pathRef} />
      </svg>
      <motion.div style={{ position: "absolute", top: 0, left: 0, display: "inline-block", transform }}>{children}</motion.div>
    </>
  );
};
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### evervault-card (aceternity)
**Source:** https://21st.dev/community/components/aceternity/evervault-card/default

```tsx
"use client";
import { useMotionValue, useMotionTemplate, motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const EvervaultCard = ({ text, className }: { text?: string; className?: string }) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);
  const [randomString, setRandomString] = useState("");

  useEffect(() => {
    setRandomString(generateRandomString(1500));
  }, []);

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
    setRandomString(generateRandomString(1500));
  }

  return (
    <div className={cn("p-0.5 bg-transparent aspect-square flex items-center justify-center w-full h-full relative", className)}>
      <div onMouseMove={onMouseMove} className="group/card rounded-3xl w-full relative overflow-hidden bg-transparent flex items-center justify-center h-full">
        <CardPattern mouseX={mouseX} mouseY={mouseY} randomString={randomString} />
        <div className="relative z-10 flex items-center justify-center">
          <div className="relative h-44 w-44 rounded-full flex items-center justify-center text-white font-bold text-4xl">
            <div className="absolute w-full h-full bg-white/[0.8] dark:bg-black/[0.8] blur-sm rounded-full" />
            <span className="dark:text-white text-black z-20">{text}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export function CardPattern({ mouseX, mouseY, randomString }: { mouseX: any; mouseY: any; randomString: string }) {
  let maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };
  
  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-2xl [mask-image:linear-gradient(white,transparent)] group-hover/card:opacity-50"></div>
      <motion.div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500 to-blue-700 opacity-0 group-hover/card:opacity-100 backdrop-blur-xl transition duration-500" style={style} />
      <motion.div className="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay group-hover/card:opacity-100" style={style}>
        <p className="absolute inset-x-0 text-xs h-full break-words whitespace-pre-wrap text-white font-mono font-bold transition duration-500">{randomString}</p>
      </motion.div>
    </div>
  );
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const generateRandomString = (length: number) => {
  let result = "";
  for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
  return result;
};
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### globe (magicui)
**Source:** https://21st.dev/community/components/magicui/globe/default

```tsx
"use client";
import createGlobe, { COBEOptions } from "cobe";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
};

export function Globe({ className, config = GLOBE_CONFIG }: { className?: string; config?: COBEOptions }) {
  let phi = 0;
  let width = 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [r, setR] = useState(0);

  const onResize = useCallback(() => {
    if (!canvasRef.current) return;
    width = canvasRef.current.offsetWidth;
  }, [canvasRef]);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();
    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: width * 2,
      height: width * 2,
      onRender: (state) => {
        if (!state.isDragging) phi += 0.005;
        state.phi = phi + r;
        state.width = width * 2;
        state.height = width * 2;
      },
    });
    setTimeout(() => (canvasRef.current!.style.opacity = "1"));
    return () => globe.destroy();
  }, [canvasRef, config, onResize]);

  return (
    <div className={cn("absolute inset-x-0 bottom-0 mx-auto aspect-[1/1] w-full max-w-[600px] md:-bottom-20 md:max-w-[800px]", className)}>
      <canvas
        className={cn("h-full w-full opacity-0 transition-opacity duration-500 [contain:layout_paint_strict]")}
        ref={canvasRef}
        onMouseMove={(e) => { if (e.buttons !== 1) return; setR((r) => r + e.movementX * 0.005); }}
      />
    </div>
  );
}
```

**Dependencies:** `@/lib/utils`, `cobe`

---

### tabs (aceternity)
**Source:** https://21st.dev/community/components/aceternity/tabs/default

```tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tab = { title: string; value: string; content?: string | React.ReactNode };

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}) => {
  const [active, setActive] = useState<Tab>(propTabs[0]);
  const [tabs, setTabs] = useState<Tab[]>(propTabs);
  const [hovering, setHovering] = useState(false);

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setTabs(newTabs);
    setActive(newTabs[0]);
  };

  return (
    <>
      <div className={cn("flex flex-row items-center justify-start [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full", containerClassName)}>
        {propTabs.map((tab, idx) => (
          <button
            key={tab.title}
            onClick={() => moveSelectedTabToTop(idx)}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={cn("relative px-4 py-2 rounded-full", tabClassName)}
            style={{ transformStyle: "preserve-3d" }}
          >
            {active.value === tab.value && (
              <motion.div layoutId="clickedbutton" transition={{ type: "spring", bounce: 0.3, duration: 0.6 }} className={cn("absolute inset-0 bg-gray-200 dark:bg-zinc-800 rounded-full", activeTabClassName)} />
            )}
            <span className="relative block text-black dark:text-white">{tab.title}</span>
          </button>
        ))}
      </div>
      <FadeInDiv tabs={tabs} active={active} hovering={hovering} className={cn("mt-32", contentClassName)} />
    </>
  );
};

export const FadeInDiv = ({ className, tabs, hovering }: { className?: string; tabs: Tab[]; active: Tab; hovering?: boolean }) => {
  const isActive = (tab: Tab) => tab.value === tabs[0].value;
  return (
    <div className="relative w-full h-full">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          style={{ scale: 1 - idx * 0.1, top: hovering ? idx * -50 : 0, zIndex: -idx, opacity: idx < 3 ? 1 - idx * 0.1 : 0 }}
          animate={{ y: isActive(tab) ? [0, 40, 0] : 0 }}
          className={cn("w-full h-full absolute top-0 left-0", className)}
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  );
};
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### hero-highlight (aceternity)
**Source:** https://21st.dev/community/components/aceternity/hero-highlight/default

```tsx
"use client";
import { cn } from "@/lib/utils";
import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import React from "react";

export const HeroHighlight = ({ children, className, containerClassName }: { children: React.ReactNode; className?: string; containerClassName?: string }) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
    if (!currentTarget) return;
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div className={cn("relative h-[40rem] flex items-center bg-white dark:bg-black justify-center w-full group", containerClassName)} onMouseMove={handleMouseMove}>
      <div className="absolute inset-0 bg-dot-thick-neutral-300 dark:bg-dot-thick-neutral-800 pointer-events-none" />
      <motion.div
        className="pointer-events-none bg-dot-thick-indigo-500 dark:bg-dot-thick-indigo-500 absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          WebkitMaskImage: useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`,
          maskImage: useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`,
        }}
      />
      <div className={cn("relative z-20", className)}>{children}</div>
    </div>
  );
};

export const Highlight = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.span
    initial={{ backgroundSize: "0% 100%" }}
    animate={{ backgroundSize: "100% 100%" }}
    transition={{ duration: 2, ease: "linear", delay: 0.5 }}
    style={{ backgroundRepeat: "no-repeat", backgroundPosition: "left center", display: "inline" }}
    className={cn("relative inline-block pb-1 px-1 rounded-lg bg-gradient-to-r from-indigo-300 to-purple-300 dark:from-indigo-500 dark:to-purple-500", className)}
  >
    {children}
  </motion.span>
);
```

**Dependencies:** `@/lib/utils`, `framer-motion`
**CSS Required:** Add `bg-dot-thick-neutral-300/800` and `bg-dot-thick-indigo-500` backgrounds

---

### focus-cards (aceternity)
**Source:** https://21st.dev/community/components/aceternity/focus-cards/default

```tsx
"use client";
import Image from "next/image";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export const Card = React.memo(({ card, index, hovered, setHovered }: { card: any; index: number; hovered: number | null; setHovered: React.Dispatch<React.SetStateAction<number | null>> }) => (
  <div
    onMouseEnter={() => setHovered(index)}
    onMouseLeave={() => setHovered(null)}
    className={cn("rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out", hovered !== null && hovered !== index && "blur-sm scale-[0.98]")}
  >
    <Image src={card.src} alt={card.title} fill className="object-cover absolute inset-0" />
    <div className={cn("absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300", hovered === index ? "opacity-100" : "opacity-0")}>
      <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">{card.title}</div>
    </div>
  </div>
));

export const FocusCards = ({ cards }: { cards: any[] }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {cards.map((card, index) => <Card card={card} index={index} key={card.title} hovered={hovered} setHovered={setHovered} />)}
    </div>
  );
};
```

**Dependencies:** `@/lib/utils`, `next/image`

---

### card-spotlight (aceternity)
**Source:** https://21st.dev/community/components/aceternity/card-spotlight/default

```tsx
"use client";
import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import React, { MouseEvent as ReactMouseEvent, useState } from "react";
import { cn } from "@/lib/utils";

export const CardSpotlight = ({
  children,
  radius = 350,
  color = "#262626",
  className,
  ...props
}: {
  radius?: number;
  color?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  function handleMouseMove({ currentTarget, clientX, clientY }: ReactMouseEvent<HTMLDivElement>) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn("group/spotlight p-10 rounded-md relative border border-neutral-800 bg-black dark:border-neutral-800", className)}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover/spotlight:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, ${color}, transparent 80%)`,
        }}
      />
      <div>{children}</div>
    </div>
  );
};
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### parallax-scroll (aceternity)
**Source:** https://21st.dev/community/components/aceternity/parallax-scroll/default

```tsx
"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const ParallaxScrollSecond = ({ images, className }: { images: string[]; className?: string }) => {
  const gridRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({ container: gridRef, offset: ["start start", "end start"] });

  const translateYFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateXFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const rotateXFirst = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const translateYThird = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateXThird = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const rotateXThird = useTransform(scrollYProgress, [0, 1], [0, 20]);

  const third = Math.ceil(images.length / 3);
  const firstPart = images.slice(0, third);
  const secondPart = images.slice(third, 2 * third);
  const thirdPart = images.slice(2 * third);

  return (
    <div className={cn("h-[40rem] items-start overflow-y-auto w-full", className)} ref={gridRef}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-5xl mx-auto gap-10 py-40 px-10">
        <div className="grid gap-10">
          {firstPart.map((el, idx) => (
            <motion.div style={{ y: translateYFirst, x: translateXFirst, rotateX: rotateXFirst }} key={"grid-1" + idx}>
              <Image src={el} className="h-80 w-full object-cover object-left-top rounded-lg" height="400" width="400" alt="thumbnail" />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {secondPart.map((el, idx) => (
            <motion.div key={"grid-2" + idx}>
              <Image src={el} className="h-80 w-full object-cover object-left-top rounded-lg" height="400" width="400" alt="thumbnail" />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {thirdPart.map((el, idx) => (
            <motion.div style={{ y: translateYThird, x: translateXThird, rotateZ: rotateXThird }} key={"grid-3" + idx}>
              <Image src={el} className="h-80 w-full object-cover object-left-top rounded-lg" height="400" width="400" alt="thumbnail" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

**Dependencies:** `@/lib/utils`, `framer-motion`, `next/image`

---

### animated-gradient-text (magicui)
**Source:** https://21st.dev/community/components/magicui/animated-gradient-text/default

```tsx
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AnimatedGradientText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("group relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl bg-white/40 px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#8fdfff1f] backdrop-blur-sm transition-shadow duration-500 ease-out [--bg-size:300%] hover:shadow-[inset_0_-5px_10px_#8fdfff3f] dark:bg-black/40", className)}>
      <div className="absolute inset-0 block h-full w-full animate-gradient bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:var(--bg-size)_100%] p-[1px] ![mask-composite:subtract] [border-radius:inherit] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]" />
      {children}
    </div>
  );
}
```

**Dependencies:** `@/lib/utils`
**CSS Required:** Add `animate-gradient` animation keyframe

---

### text-hover-effect (aceternity)
**Source:** https://21st.dev/community/components/aceternity/text-hover-effect/default

```tsx
"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export const TextHoverEffect = ({ text, duration }: { text: string; duration?: number }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({ cx: `${cxPercentage}%`, cy: `${cyPercentage}%` });
    }
  }, [cursor]);

  return (
    <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })} className="select-none">
      <defs>
        <motion.mask id="circleMask">
          <motion.circle cx={maskPosition.cx} cy={maskPosition.cy} r={hovered ? 50 : 0} fill="white" animate={{ r: hovered ? 50 : 0 }} transition={{ duration: duration || 0.3, ease: "easeOut" }} />
        </motion.mask>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "rgb(59,130,246)", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "rgb(168,85,247)", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="54" fontWeight="bold" fill="rgba(156, 163, 175, 0.4)">{text}</text>
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="54" fontWeight="bold" fill="url(#gradient)" mask="url(#circleMask)">{text}</text>
    </svg>
  );
};
```

**Dependencies:** `framer-motion`

---

### timeline (aceternity)
**Source:** https://21st.dev/community/components/aceternity/timeline/default

```tsx
"use client";
import { useMotionValueEvent, useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry { title: string; content: React.ReactNode }

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) setHeight(ref.current.getBoundingClientRect().height);
  }, [ref]);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 10%", "end 50%"] });
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full bg-white dark:bg-neutral-950 font-sans md:px-10" ref={containerRef}>
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">Timeline</h2>
        <div className="flex">
          <div className="relative">
            <motion.div style={{ height: heightTransform, opacity: opacityTransform }} className="absolute top-0 left-0 w-0.5 bg-neutral-300 dark:bg-neutral-800" />
            <div className="space-y-16" ref={ref}>
              {data.map((item, index) => (
                <div key={index} className="flex space-x-4 ml-6">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-semibold text-black dark:text-white mb-4">{item.title}</h3>
                    <div className="text-base text-neutral-800 dark:text-neutral-200">{item.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

**Dependencies:** `framer-motion`

---

### number-ticker (magicui)
**Source:** https://21st.dev/community/components/magicui/number-ticker/default

```tsx
"use client";
import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export function NumberTicker({ value, direction = "up", delay = 0, className, decimalPlaces = 0 }: { value: number; direction?: "up" | "down"; className?: string; delay?: number; decimalPlaces?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 100 });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    isInView && setTimeout(() => motionValue.set(direction === "down" ? 0 : value), delay * 1000);
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(() => springValue.on("change", (latest) => {
    if (ref.current) ref.current.textContent = Intl.NumberFormat("en-US", { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces }).format(latest);
  }), [springValue, decimalPlaces]);

  return <span className={cn("inline-block tabular-nums text-black dark:text-white", className)} ref={ref} />;
}
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### word-rotate (magicui)
**Source:** https://21st.dev/community/components/magicui/word-rotate/default

```tsx
"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WordRotateProps { words: string[]; duration?: number; framerProps?: HTMLMotionProps<"h1">; className?: string }

export function WordRotate({ words, duration = 2500, framerProps = { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 50 }, transition: { duration: 0.25, ease: "easeOut" } }, className }: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % words.length), duration);
    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <div className="overflow-hidden py-2">
      <AnimatePresence mode="wait">
        <motion.h1 key={words[index]} className={cn(className)} {...framerProps}>{words[index]}</motion.h1>
      </AnimatePresence>
    </div>
  );
}
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### typing-animation (magicui)
**Source:** https://21st.dev/community/components/magicui/typing-animation/default

```tsx
"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypingAnimationProps { text: string; duration?: number; className?: string }

export function TypingAnimation({ text, duration = 200, className }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [i, setI] = useState<number>(0);

  useEffect(() => {
    const typingEffect = setInterval(() => {
      if (i < text.length) { setDisplayedText(text.substring(0, i + 1)); setI(i + 1); }
      else clearInterval(typingEffect);
    }, duration);
    return () => clearInterval(typingEffect);
  }, [duration, i]);

  return <h1 className={cn("font-display text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm", className)}>{displayedText}</h1>;
}
```

**Dependencies:** `@/lib/utils`

---

### blur-fade (magicui)
**Source:** https://21st.dev/community/components/magicui/blur-fade/default

```tsx
"use client";
import { useRef } from "react";
import { AnimatePresence, motion, useInView, UseInViewOptions, Variants } from "framer-motion";

type MarginType = UseInViewOptions["margin"];
interface BlurFadeProps { children: React.ReactNode; className?: string; variant?: { hidden: { y: number }; visible: { y: number } }; duration?: number; delay?: number; yOffset?: number; inView?: boolean; inViewMargin?: MarginType; blur?: string }

export function BlurFade({ children, className, variant, duration = 0.4, delay = 0, yOffset = 6, inView = false, inViewMargin = "-50px", blur = "6px" }: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const FADE_VARIANTS: Variants = variant || { hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` }, visible: { y: -yOffset, opacity: 1, filter: `blur(0px)` } };

  return (
    <AnimatePresence>
      <motion.div ref={ref} className={className} initial="hidden" animate={inView || inViewResult ? "visible" : "hidden"} exit="hidden" variants={FADE_VARIANTS} transition={{ duration, delay }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

**Dependencies:** `framer-motion`

---

### ripple (magicui)
**Source:** https://21st.dev/community/components/magicui/ripple/default

```tsx
import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface RippleProps { mainCircleSize?: number; mainCircleOpacity?: number; numCircles?: number; className?: string }

const Ripple = React.memo(function Ripple({ mainCircleSize = 210, mainCircleOpacity = 0.24, numCircles = 8, className }: RippleProps) {
  return (
    <div className={cn("pointer-events-none select-none absolute inset-0 [mask-image:linear-gradient(to_bottom,white,transparent)]", className)}>
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;
        const borderStyle = i === numCircles - 1 ? "dashed" : "solid";
        const borderOpacity = 5 + i * 5;
        return <div key={i} className={`absolute animate-ripple rounded-full bg-foreground/25 shadow-xl border [--i:${i}]`} style={{ width: `${size}px`, height: `${size}px`, opacity, animationDelay, borderStyle, borderColor: `rgba(var(--foreground-rgb), ${borderOpacity / 100})` } as CSSProperties} />;
      })}
    </div>
  );
});

Ripple.displayName = "Ripple";
export { Ripple };
```

**Dependencies:** `@/lib/utils`
**CSS Required:** Add `animate-ripple` animation keyframe

---

### dock (magicui)
**Source:** https://21st.dev/community/components/magicui/dock/default

```tsx
"use client";
import React, { PropsWithChildren, useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DockProps extends VariantProps<typeof dockVariants> { className?: string; magnification?: number; distance?: number; direction?: "top" | "middle" | "bottom"; children: React.ReactNode }
const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;
const dockVariants = cva("supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 mx-auto mt-8 flex h-[58px] w-max gap-2 rounded-2xl border p-2 backdrop-blur-md");

const Dock = React.forwardRef<HTMLDivElement, DockProps>(({ className, children, magnification = DEFAULT_MAGNIFICATION, distance = DEFAULT_DISTANCE, direction = "bottom", ...props }, ref) => {
  const mouseX = useMotionValue(Infinity);
  const renderChildren = () => React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === DockIcon) return React.cloneElement(child, { mouseX, magnification, distance } as DockIconProps);
    return child;
  });
  return <motion.div ref={ref} onMouseMove={(e) => mouseX.set(e.pageX)} onMouseLeave={() => mouseX.set(Infinity)} {...props} className={cn(dockVariants(), className)}>{renderChildren()}</motion.div>;
});
Dock.displayName = "Dock";

export interface DockIconProps { size?: number; magnification?: number; distance?: number; mouseX?: any; className?: string; children?: React.ReactNode; props?: PropsWithChildren }

const DockIcon = ({ size, magnification = DEFAULT_MAGNIFICATION, distance = DEFAULT_DISTANCE, mouseX, className, children, ...props }: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { width } = useSpring(useTransform(mouseX, (newMouseX) => { const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }; return newMouseX - bounds.x - bounds.width / 2; }), { damping: 15, stiffness: 250, mass: 0.5 });
  return <motion.div ref={ref} style={{ width }} className={cn("flex aspect-square cursor-pointer items-center justify-center rounded-full bg-neutral-400/40", className)} {...props}>{children}</motion.div>;
};
DockIcon.displayName = "DockIcon";

export { Dock, DockIcon, dockVariants };
```

**Dependencies:** `@/lib/utils`, `framer-motion`, `class-variance-authority`

---

### retro-grid (magicui)
**Source:** https://21st.dev/community/components/magicui/retro-grid/default

```tsx
import { cn } from "@/lib/utils";

export function RetroGrid({ className, angle = 65 }: { className?: string; angle?: number }) {
  return (
    <div className={cn("pointer-events-none absolute size-full overflow-hidden opacity-50 [perspective:200px]", className)} style={{ "--grid-angle": `${angle}deg` } as React.CSSProperties}>
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div className={cn("animate-grid", "[background-repeat:repeat] [background-size:60px_60px] [height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:600vw]", "[background-image:linear-gradient(to_right,rgba(0,0,0,0.3)_1px,transparent_0),linear-gradient(to_bottom,rgba(0,0,0,0.3)_1px,transparent_0)]", "dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.2)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_0)]")} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90% dark:from-black" />
    </div>
  );
}
```

**Dependencies:** `@/lib/utils`
**CSS Required:** Add `animate-grid` animation keyframe

---

### particles (magicui)
**Source:** https://21st.dev/community/components/magicui/particles/default

```tsx
"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface MousePosition { x: number; y: number }

function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => setMousePosition({ x: event.clientX, y: event.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  return mousePosition;
}

interface ParticlesProps { className?: string; quantity?: number; staticity?: number; ease?: number; size?: number; refresh?: boolean; color?: string; vx?: number; vy?: number }

export function Particles({ className, quantity = 30, staticity = 50, ease = 50, size = 0.4, refresh = false, color = "#ffffff", vx = 0, vy = 0 }: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<any[]>([]);
  const mousePosition = useMousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  useEffect(() => { if (canvasRef.current) context.current = canvasRef.current.getContext("2d"); initCanvas(); animate(); window.addEventListener("resize", initCanvas); return () => window.removeEventListener("resize", initCanvas); }, []);
  useEffect(() => { onMouseMove(); }, [mousePosition.x, mousePosition.y]);
  useEffect(() => { initCanvas(); }, [refresh]);

  const initCanvas = () => { resizeCanvas(); drawParticles(); };
  const onMouseMove = () => { if (canvasRef.current) { const rect = canvasRef.current.getBoundingClientRect(); const { w, h } = canvasSize.current; const x = mousePosition.x - rect.left - w / 2; const y = mousePosition.y - rect.top - h / 2; const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2; if (inside) { mouse.current.x = x; mouse.current.y = y; } } };

  type Circle = { x: number; y: number; translateX: number; translateY: number; size: number; alpha: number; targetAlpha: number; dx: number; dy: number; magnetism: number };
  const resizeCanvas = () => { if (canvasContainerRef.current && canvasRef.current && context.current) { circles.current.length = 0; canvasSize.current.w = canvasContainerRef.current.offsetWidth; canvasSize.current.h = canvasContainerRef.current.offsetHeight; canvasRef.current.width = canvasSize.current.w * dpr; canvasRef.current.height = canvasSize.current.h * dpr; canvasRef.current.style.width = `${canvasSize.current.w}px`; canvasRef.current.style.height = `${canvasSize.current.h}px`; context.current.scale(dpr, dpr); } };
  const circleParams = (): Circle => ({ x: Math.floor(Math.random() * canvasSize.current.w), y: Math.floor(Math.random() * canvasSize.current.h), translateX: 0, translateY: 0, size: Math.floor(Math.random() * 2) + size, alpha: 0, targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)), dx: (Math.random() - 0.5) * 0.1, dy: (Math.random() - 0.5) * 0.1, magnetism: 0.1 + Math.random() * 4 });
  const drawCircle = (circle: Circle, update = false) => { if (context.current) { const { x, y, translateX, translateY, size, alpha } = circle; context.current.translate(translateX, translateY); context.current.beginPath(); context.current.arc(x, y, size, 0, 2 * Math.PI); context.current.fillStyle = `rgba(${color}, ${alpha})`; context.current.fill(); context.current.setTransform(dpr, 0, 0, dpr, 0, 0); if (!update) circles.current.push(circle); } };
  const clearContext = () => { if (context.current) context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h); };
  const drawParticles = () => { clearContext(); for (let i = 0; i < quantity; i++) drawCircle(circleParams()); };
  const remapValue = (value: number, start1: number, end1: number, start2: number, end2: number): number => { const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2; return remapped > 0 ? remapped : 0; };
  const animate = () => { clearContext(); circles.current.forEach((circle: Circle, i: number) => { const edge = [circle.x + circle.translateX - circle.size, canvasSize.current.w - circle.x - circle.translateX - circle.size, circle.y + circle.translateY - circle.size, canvasSize.current.h - circle.y - circle.translateY - circle.size]; const closestEdge = edge.reduce((a, b) => Math.min(a, b)); const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)); if (remapClosestEdge > 1) { circle.alpha += 0.02; if (circle.alpha > circle.targetAlpha) circle.alpha = circle.targetAlpha; } else circle.alpha = circle.targetAlpha * remapClosestEdge; circle.x += circle.dx + vx; circle.y += circle.dy + vy; circle.translateX += (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) / ease; circle.translateY += (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) / ease; if (circle.x < -circle.size || circle.x > canvasSize.current.w + circle.size || circle.y < -circle.size || circle.y > canvasSize.current.h + circle.size) { circles.current.splice(i, 1); drawCircle(circleParams()); } else drawCircle({ ...circle }, true); }); window.requestAnimationFrame(animate); };

  return <div className={className} ref={canvasContainerRef} aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
```

**Dependencies:** `@/lib/utils`

---

### grid-pattern (magicui)
**Source:** https://21st.dev/community/components/magicui/grid-pattern/default

```tsx
import { useId } from "react";
import { cn } from "@/lib/utils";

interface GridPatternProps { width?: number; height?: number; x?: number; y?: number; squares?: Array<[x: number, y: number]>; strokeDasharray?: string; className?: string; [key: string]: unknown }

function GridPattern({ width = 40, height = 40, x = -1, y = -1, strokeDasharray = "0", squares, className, ...props }: GridPatternProps) {
  const id = useId();
  return (
    <svg aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30", className)} {...props}>
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" strokeDasharray={strokeDasharray} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]) => <rect strokeWidth="0" key={`${x}-${y}`} width={width - 1} height={height - 1} x={x * width + 1} y={y * height + 1} />)}
        </svg>
      )}
    </svg>
  );
}

export { GridPattern };
```

**Dependencies:** `@/lib/utils`

---

### fade-text (magicui)
**Source:** https://21st.dev/community/components/magicui/fade-text/default

```tsx
"use client";
import { useMemo } from "react";
import { motion, Variants } from "framer-motion";

type FadeTextProps = { className?: string; direction?: "up" | "down" | "left" | "right"; framerProps?: Variants; text: string };

function FadeText({ direction = "up", className, framerProps = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { type: "spring" } } }, text }: FadeTextProps) {
  const directionOffset = useMemo(() => ({ up: 10, down: -10, left: -10, right: 10 }[direction]), [direction]);
  const axis = direction === "up" || direction === "down" ? "y" : "x";

  const FADE_ANIMATION_VARIANTS = useMemo(() => {
    const { hidden, show, ...rest } = framerProps as { [name: string]: { [name: string]: number; opacity: number } };
    return { ...rest, hidden: { ...(hidden ?? {}), opacity: hidden?.opacity ?? 0, [axis]: hidden?.[axis] ?? directionOffset }, show: { ...(show ?? {}), opacity: show?.opacity ?? 1, [axis]: show?.[axis] ?? 0 } };
  }, [directionOffset, axis, framerProps]);

  return <motion.div initial="hidden" animate="show" viewport={{ once: true }} variants={FADE_ANIMATION_VARIANTS}><motion.span className={className}>{text}</motion.span></motion.div>;
}

export { FadeText };
```

**Dependencies:** `framer-motion`

---

### shine-border (magicui)
**Source:** https://21st.dev/community/components/magicui/shine-border/default

```tsx
"use client"
import { cn } from "@/lib/utils"

type TColorProp = string | string[]
interface ShineBorderProps { borderRadius?: number; borderWidth?: number; duration?: number; color?: TColorProp; className?: string; children: React.ReactNode }

export function ShineBorder({ borderRadius = 8, borderWidth = 1, duration = 14, color = "#000000", className, children }: ShineBorderProps) {
  return (
    <div style={{ "--border-radius": `${borderRadius}px` } as React.CSSProperties} className={cn("min-h-[60px] w-fit min-w-[300px] place-items-center rounded-[--border-radius] bg-white p-3 text-black dark:bg-black dark:text-white", className)}>
      <div style={{ "--border-width": `${borderWidth}px`, "--border-radius": `${borderRadius}px`, "--duration": `${duration}s`, "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`, "--background-radial-gradient": `radial-gradient(transparent,transparent, ${color instanceof Array ? color.join(",") : color},transparent,transparent)` } as React.CSSProperties} className="before:bg-shine-size before:absolute before:inset-0 before:aspect-square before:size-full before:rounded-[--border-radius] before:p-[--border-width] before:will-change-[background-position] before:content-[''] before:![-webkit-mask-composite:xor] before:![mask-composite:exclude] before:[background-image:--background-radial-gradient] before:[background-size:300%_300%] before:[mask:--mask-linear-gradient] motion-safe:before:animate-shine" />
      {children}
    </div>
  )
}
```

**Dependencies:** `@/lib/utils`
**CSS Required:** Add `animate-shine` keyframe animation

---

### gradual-spacing (magicui)
**Source:** https://21st.dev/community/components/magicui/gradual-spacing/default

```tsx
"use client";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradualSpacingProps { text: string; duration?: number; delayMultiple?: number; framerProps?: Variants; className?: string }

function GradualSpacing({ text, duration = 0.5, delayMultiple = 0.04, framerProps = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }, className }: GradualSpacingProps) {
  return (
    <div className="flex justify-center space-x-1">
      <AnimatePresence>
        {text.split("").map((char, i) => (
          <motion.h1 key={i} initial="hidden" animate="visible" exit="hidden" variants={framerProps} transition={{ duration, delay: i * delayMultiple }} className={cn("drop-shadow-sm", className)}>
            {char === " " ? <span>&nbsp;</span> : char}
          </motion.h1>
        ))}
      </AnimatePresence>
    </div>
  );
}

export { GradualSpacing };
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### dot-pattern (magicui)
**Source:** https://21st.dev/community/components/magicui/dot-pattern/default

```tsx
import { useId } from "react";
import { cn } from "@/lib/utils";

interface DotPatternProps { width?: any; height?: any; x?: any; y?: any; cx?: any; cy?: any; cr?: any; className?: string; [key: string]: any }

function DotPattern({ width = 16, height = 16, x = 0, y = 0, cx = 1, cy = 1, cr = 1, className, ...props }: DotPatternProps) {
  const id = useId();
  return (
    <svg aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full fill-neutral-400/80", className)} {...props}>
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse" x={x} y={y}>
          <circle id="pattern-circle" cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}

export { DotPattern };
```

**Dependencies:** `@/lib/utils`

---

### confetti (magicui)
**Source:** https://21st.dev/community/components/magicui/confetti/default

```tsx
import type { ReactNode } from "react"
import React, { createContext, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react"
import type { GlobalOptions as ConfettiGlobalOptions, CreateTypes as ConfettiInstance, Options as ConfettiOptions } from "canvas-confetti"
import confetti from "canvas-confetti"
import { Button, ButtonProps } from "@/components/ui/button"

type Api = { fire: (options?: ConfettiOptions) => void }
type Props = React.ComponentPropsWithRef<"canvas"> & { options?: ConfettiOptions; globalOptions?: ConfettiGlobalOptions; manualstart?: boolean; children?: ReactNode }
export type ConfettiRef = Api | null

const ConfettiContext = createContext<Api>({} as Api)

const Confetti = forwardRef<ConfettiRef, Props>((props, ref) => {
  const { options, globalOptions = { resize: true, useWorker: true }, manualstart = false, children, ...rest } = props
  const instanceRef = useRef<ConfettiInstance | null>(null)
  const canvasRef = useCallback((node: HTMLCanvasElement) => {
    if (node !== null) { if (instanceRef.current) return; instanceRef.current = confetti.create(node, { ...globalOptions, resize: true }) }
    else { if (instanceRef.current) { instanceRef.current.reset(); instanceRef.current = null } }
  }, [globalOptions])

  const fire = useCallback((opts = {}) => instanceRef.current?.({ ...options, ...opts }), [options])
  const api = useMemo(() => ({ fire }), [fire])
  useImperativeHandle(ref, () => api, [api])
  useEffect(() => { if (!manualstart) fire() }, [manualstart, fire])

  return <ConfettiContext.Provider value={api}><canvas ref={canvasRef} {...rest} />{children}</ConfettiContext.Provider>
})

interface ConfettiButtonProps extends ButtonProps { options?: ConfettiOptions & ConfettiGlobalOptions & { canvas?: HTMLCanvasElement }; children?: React.ReactNode }
function ConfettiButton({ options, children, ...props }: ConfettiButtonProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => { const rect = event.currentTarget.getBoundingClientRect(); confetti({ ...options, origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight } }) }
  return <Button onClick={handleClick} {...props}>{children}</Button>
}

Confetti.displayName = "Confetti"
export { Confetti, ConfettiButton }
```

**Dependencies:** `canvas-confetti`, `@/components/ui/button`

---

### cool-mode (magicui)
**Source:** https://21st.dev/community/components/magicui/cool-mode/default

```tsx
import React, { ReactNode, useEffect, useRef } from "react"

export interface CoolParticleOptions { particle?: string; size?: number; particleCount?: number; speedHorz?: number; speedUp?: number }

const getContainer = () => {
  const id = "_coolMode_effect"; let existingContainer = document.getElementById(id);
  if (existingContainer) return existingContainer;
  const container = document.createElement("div"); container.setAttribute("id", id);
  container.setAttribute("style", "overflow:hidden; position:fixed; height:100%; top:0; left:0; right:0; bottom:0; pointer-events:none; z-index:2147483647");
  document.body.appendChild(container); return container;
}

let instanceCounter = 0;
const applyParticleEffect = (element: HTMLElement, options?: CoolParticleOptions): (() => void) => {
  instanceCounter++; const sizes = [15, 20, 25, 35, 45]; const limit = 45; let particles: any[] = []; let autoAddParticle = false; let mouseX = 0; let mouseY = 0;
  const container = getContainer();
  function generateParticle() { /* particle generation logic */ }
  function refreshParticles() { /* refresh logic */ }
  let animationFrame: number | undefined; let lastParticleTimestamp = 0;
  function loop() { /* animation loop */ animationFrame = requestAnimationFrame(loop); } loop();
  const isTouchInteraction = "ontouchstart" in window;
  const tap = isTouchInteraction ? "touchstart" : "mousedown"; const tapEnd = isTouchInteraction ? "touchend" : "mouseup"; const move = isTouchInteraction ? "touchmove" : "mousemove";
  const updateMousePosition = (e: MouseEvent | TouchEvent) => { mouseX = "touches" in e ? e.touches?.[0].clientX : e.clientX; mouseY = "touches" in e ? e.touches?.[0].clientY : e.clientY; };
  const tapHandler = (e: MouseEvent | TouchEvent) => { updateMousePosition(e); autoAddParticle = true; };
  const disableAutoAddParticle = () => { autoAddParticle = false; };
  element.addEventListener(move, updateMousePosition, { passive: true }); element.addEventListener(tap, tapHandler, { passive: true }); element.addEventListener(tapEnd, disableAutoAddParticle, { passive: true }); element.addEventListener("mouseleave", disableAutoAddParticle, { passive: true });
  return () => { /* cleanup */ };
}

interface CoolModeProps { children: ReactNode; options?: CoolParticleOptions }
export const CoolMode: React.FC<CoolModeProps> = ({ children, options }) => {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { if (ref.current) return applyParticleEffect(ref.current, options) }, [options]);
  return React.cloneElement(children as React.ReactElement, { ref });
}
```

**Dependencies:** none (vanilla React)
**Note:** Full implementation available from 21st.dev registry

---

### avatar-circles (magicui)
**Source:** https://21st.dev/community/components/magicui/avatar-circles/default

```tsx
"use client"
import React from "react"
import { cn } from "@/lib/utils"

interface AvatarCirclesProps { className?: string; numPeople?: number; avatarUrls: string[] }

const AvatarCircles = ({ numPeople, className, avatarUrls }: AvatarCirclesProps) => {
  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {avatarUrls.map((url, index) => (
        <img key={index} className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800" src={url} width={40} height={40} alt={`Avatar ${index + 1}`} />
      ))}
      <a className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-white dark:text-black" href="">+{numPeople}</a>
    </div>
  )
}

export { AvatarCircles }
```

**Dependencies:** `@/lib/utils`

---

### hyper-text (magicui)
**Source:** https://21st.dev/community/components/magicui/hyper-text/default

```tsx
"use client";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface HyperTextProps { text: string; duration?: number; framerProps?: Variants; className?: string; animateOnLoad?: boolean }
const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const getRandomInt = (max: number) => Math.floor(Math.random() * max);

export function HyperText({ text, duration = 800, framerProps = { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 3 } }, className, animateOnLoad = true }: HyperTextProps) {
  const [displayText, setDisplayText] = useState(text.split(""));
  const [trigger, setTrigger] = useState(false);
  const interations = useRef(0);
  const isFirstRender = useRef(true);
  const triggerAnimation = () => { interations.current = 0; setTrigger(true); };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!animateOnLoad && isFirstRender.current) { clearInterval(interval); isFirstRender.current = false; return; }
      if (interations.current < text.length) { setDisplayText((t) => t.map((l, i) => l === " " ? l : i <= interations.current ? text[i] : alphabets[getRandomInt(26)])); interations.current += 0.1; }
      else { setTrigger(false); clearInterval(interval); }
    }, duration / (text.length * 10));
    return () => clearInterval(interval);
  }, [text, duration, trigger, animateOnLoad]);

  return (
    <div className="flex scale-100 cursor-default overflow-hidden py-2" onMouseEnter={triggerAnimation}>
      <AnimatePresence mode="wait">{displayText.map((letter, i) => <motion.span key={i} className={cn("font-mono", letter === " " ? "w-3" : "", className)} {...framerProps}>{letter.toUpperCase()}</motion.span>)}</AnimatePresence>
    </div>
  );
}
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### scratch-to-reveal (magicui)
**Source:** https://21st.dev/community/components/magicui/scratch-to-reveal/default

```tsx
import { cn } from "@/lib/utils";
import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

interface ScratchToRevealProps { children: React.ReactNode; width: number; height: number; minScratchPercentage?: number; className?: string; onComplete?: () => void; gradientColors?: [string, string, string] }

const ScratchToReveal: React.FC<ScratchToRevealProps> = ({ width, height, minScratchPercentage = 50, onComplete, children, className, gradientColors = ["#A97CF8", "#F38CB8", "#FDCC92"] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const canvas = canvasRef.current; const ctx = canvas?.getContext("2d");
    if (canvas && ctx) { const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height); gradient.addColorStop(0, gradientColors[0]); gradient.addColorStop(0.5, gradientColors[1]); gradient.addColorStop(1, gradientColors[2]); ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height); }
  }, [gradientColors]);

  const scratch = (clientX: number, clientY: number) => { const canvas = canvasRef.current; const ctx = canvas?.getContext("2d"); if (canvas && ctx) { const rect = canvas.getBoundingClientRect(); ctx.globalCompositeOperation = "destination-out"; ctx.beginPath(); ctx.arc(clientX - rect.left + 16, clientY - rect.top + 16, 30, 0, Math.PI * 2); ctx.fill(); } };
  const checkCompletion = () => { /* completion check logic */ };

  return (
    <motion.div className={cn("relative select-none", className)} style={{ width, height }} animate={controls}>
      <canvas ref={canvasRef} width={width} height={height} className="absolute left-0 top-0" onMouseDown={() => setIsScratching(true)} onTouchStart={() => setIsScratching(true)} />
      {children}
    </motion.div>
  );
};

export { ScratchToReveal };
```

**Dependencies:** `@/lib/utils`, `framer-motion`
**Note:** Full implementation available from 21st.dev registry

---

### orbiting-circles (magicui)
**Source:** https://21st.dev/community/components/magicui/orbiting-circles/default

```tsx
import { cn } from "@/lib/utils"

export interface OrbitingCirclesProps { className?: string; children?: React.ReactNode; reverse?: boolean; duration?: number; delay?: number; radius?: number; path?: boolean }

export function OrbitingCircles({ className, children, reverse, duration = 20, delay = 10, radius = 50, path = true }: OrbitingCirclesProps) {
  return (
    <>
      {path && (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="pointer-events-none absolute inset-0 size-full">
          <circle className="stroke-black/10 stroke-1 dark:stroke-white/10" cx="50%" cy="50%" r={radius} fill="none" />
        </svg>
      )}
      <div style={{ "--duration": duration, "--radius": radius, "--delay": -delay } as React.CSSProperties} className={cn("absolute flex transform-gpu animate-orbit items-center justify-center rounded-full border bg-black/10 [animation-delay:calc(var(--delay)*1000ms)] dark:bg-white/10", { "[animation-direction:reverse]": reverse }, className)}>
        {children}
      </div>
    </>
  )
}
```

**Dependencies:** `@/lib/utils`
**CSS Required:** Add `animate-orbit` animation keyframe

---

### rainbow-button (magicui)
**Source:** https://21st.dev/community/components/magicui/rainbow-button/default

```tsx
import React from "react";
import { cn } from "@/lib/utils";

interface RainbowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function RainbowButton({ children, className, ...props }: RainbowButtonProps) {
  return (
    <button className={cn(
      "group relative inline-flex h-11 animate-rainbow cursor-pointer items-center justify-center rounded-xl border-0 bg-[length:200%] px-8 py-2 font-medium text-primary-foreground transition-colors [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
      "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] before:bg-[length:200%] before:[filter:blur(calc(0.8*1rem))]",
      "bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
      "dark:bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
      className
    )} {...props}>{children}</button>
  );
}
```

**Dependencies:** `@/lib/utils`
**CSS Required:** Add `animate-rainbow` keyframe and CSS color variables

---

### animated-beam (magicui)
**Source:** https://21st.dev/community/components/magicui/animated-beam/default

```tsx
"use client";
import { RefObject, useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AnimatedBeamProps { className?: string; containerRef: RefObject<HTMLElement>; fromRef: RefObject<HTMLElement>; toRef: RefObject<HTMLElement>; curvature?: number; reverse?: boolean; pathColor?: string; pathWidth?: number; pathOpacity?: number; gradientStartColor?: string; gradientStopColor?: string; delay?: number; duration?: number; startXOffset?: number; startYOffset?: number; endXOffset?: number; endYOffset?: number }

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({ className, containerRef, fromRef, toRef, curvature = 0, reverse = false, duration = Math.random() * 3 + 4, delay = 0, pathColor = "gray", pathWidth = 2, pathOpacity = 0.2, gradientStartColor = "#ffaa40", gradientStopColor = "#9c40ff", startXOffset = 0, startYOffset = 0, endXOffset = 0, endYOffset = 0 }) => {
  const id = useId();
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const gradientCoordinates = reverse ? { x1: ["90%", "-10%"], x2: ["100%", "0%"], y1: ["0%", "0%"], y2: ["0%", "0%"] } : { x1: ["10%", "110%"], x2: ["0%", "100%"], y1: ["0%", "0%"], y2: ["0%", "0%"] };

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const rectA = fromRef.current.getBoundingClientRect(); const rectB = toRef.current.getBoundingClientRect();
        setSvgDimensions({ width: containerRect.width, height: containerRect.height });
        const startX = rectA.left - containerRect.left + rectA.width / 2 + startXOffset; const startY = rectA.top - containerRect.top + rectA.height / 2 + startYOffset;
        const endX = rectB.left - containerRect.left + rectB.width / 2 + endXOffset; const endY = rectB.top - containerRect.top + rectB.height / 2 + endYOffset;
        setPathD(`M ${startX},${startY} Q ${(startX + endX) / 2},${startY - curvature} ${endX},${endY}`);
      }
    };
    const resizeObserver = new ResizeObserver(() => updatePath()); if (containerRef.current) resizeObserver.observe(containerRef.current); updatePath();
    return () => resizeObserver.disconnect();
  }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset]);

  return (
    <svg fill="none" width={svgDimensions.width} height={svgDimensions.height} xmlns="http://www.w3.org/2000/svg" className={cn("pointer-events-none absolute left-0 top-0 transform-gpu stroke-2", className)} viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}>
      <path d={pathD} stroke={pathColor} strokeWidth={pathWidth} strokeOpacity={pathOpacity} strokeLinecap="round" />
      <path d={pathD} strokeWidth={pathWidth} stroke={`url(#${id})`} strokeOpacity="1" strokeLinecap="round" />
      <defs>
        <motion.linearGradient className="transform-gpu" id={id} gradientUnits="userSpaceOnUse" initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }} animate={{ x1: gradientCoordinates.x1, x2: gradientCoordinates.x2, y1: gradientCoordinates.y1, y2: gradientCoordinates.y2 }} transition={{ delay, duration, ease: [0.16, 1, 0.3, 1], repeat: Infinity, repeatDelay: 0 }}>
          <stop stopColor={gradientStartColor} stopOpacity="0" /><stop stopColor={gradientStartColor} /><stop offset="32.5%" stopColor={gradientStopColor} /><stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
};
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### morphing-text (magicui)
**Source:** https://21st.dev/community/components/magicui/morphing-text/default

```tsx
"use client";
import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const morphTime = 1.5; const cooldownTime = 0.5;

const useMorphingText = (texts: string[]) => {
  const textIndexRef = useRef(0); const morphRef = useRef(0); const cooldownRef = useRef(0); const timeRef = useRef(new Date());
  const text1Ref = useRef<HTMLSpanElement>(null); const text2Ref = useRef<HTMLSpanElement>(null);

  const setStyles = useCallback((fraction: number) => {
    const [current1, current2] = [text1Ref.current, text2Ref.current]; if (!current1 || !current2) return;
    current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`; current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
    const invertedFraction = 1 - fraction;
    current1.style.filter = `blur(${Math.min(8 / invertedFraction - 8, 100)}px)`; current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;
    current1.textContent = texts[textIndexRef.current % texts.length]; current2.textContent = texts[(textIndexRef.current + 1) % texts.length];
  }, [texts]);

  const doMorph = useCallback(() => { morphRef.current -= cooldownRef.current; cooldownRef.current = 0; let fraction = morphRef.current / morphTime; if (fraction > 1) { cooldownRef.current = cooldownTime; fraction = 1; } setStyles(fraction); if (fraction === 1) textIndexRef.current++; }, [setStyles]);
  const doCooldown = useCallback(() => { morphRef.current = 0; const [current1, current2] = [text1Ref.current, text2Ref.current]; if (current1 && current2) { current2.style.filter = "none"; current2.style.opacity = "100%"; current1.style.filter = "none"; current1.style.opacity = "0%"; } }, []);

  useEffect(() => { let animationFrameId: number; const animate = () => { animationFrameId = requestAnimationFrame(animate); const newTime = new Date(); const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000; timeRef.current = newTime; cooldownRef.current -= dt; if (cooldownRef.current <= 0) doMorph(); else doCooldown(); }; animate(); return () => cancelAnimationFrame(animationFrameId); }, [doMorph, doCooldown]);
  return { text1Ref, text2Ref };
};

interface MorphingTextProps { className?: string; texts: string[] }
const MorphingText: React.FC<MorphingTextProps> = ({ texts, className }) => {
  const { text1Ref, text2Ref } = useMorphingText(texts);
  return (
    <div className={cn("relative mx-auto h-16 w-full max-w-screen-md text-center font-sans text-[40pt] font-bold leading-none [filter:url(#threshold)_blur(0.6px)] md:h-24 lg:text-[6rem]", className)}>
      <span className="absolute inset-x-0 top-0 m-auto inline-block w-full" ref={text1Ref} />
      <span className="absolute inset-x-0 top-0 m-auto inline-block w-full" ref={text2Ref} />
      <svg id="filters" className="hidden" preserveAspectRatio="xMidYMid slice"><defs><filter id="threshold"><feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 255 -140" /></filter></defs></svg>
    </div>
  );
};

export { MorphingText };
```

**Dependencies:** `@/lib/utils`

---

### animated-shiny-text (magicui)
**Source:** https://21st.dev/community/components/magicui/animated-shiny-text/default

```tsx
import { CSSProperties, FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedShinyTextProps { children: ReactNode; className?: string; shimmerWidth?: number }

const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({ children, className, shimmerWidth = 100 }) => (
  <p style={{ "--shiny-width": `${shimmerWidth}px` } as CSSProperties} className={cn("mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70", "animate-shiny-text bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shiny-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]", "bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent dark:via-white/80", className)}>
    {children}
  </p>
);

export { AnimatedShinyText };
```

**Dependencies:** `@/lib/utils`
**CSS Required:** Add `animate-shiny-text` keyframe animation

---

### meteors-magicui (magicui)
**Source:** https://21st.dev/community/components/magicui/meteors/default

```tsx
import { cn } from "@/lib/utils";
import React from "react";

export const Meteors = ({ number, className }: { number?: number; className?: string }) => {
  const meteors = new Array(number || 20).fill(true);
  return (
    <>
      {meteors.map((el, idx) => (
        <span key={"meteor" + idx} className={cn("animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]", "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent", className)} style={{ top: 0, left: Math.floor(Math.random() * 800 - 400) + "px", animationDelay: Math.random() * 0.6 + 0.2 + "s", animationDuration: Math.floor(Math.random() * 8 + 2) + "s" }} />
      ))}
    </>
  );
};
```

**Dependencies:** `@/lib/utils`
**CSS Required:** Add `animate-meteor` keyframe animation

---

### flickering-grid (magicui)
**Source:** https://21st.dev/community/components/magicui/flickering-grid/default

```tsx
"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface FlickeringGridProps { squareSize?: number; gridGap?: number; flickerChance?: number; color?: string; width?: number; height?: number; className?: string; maxOpacity?: number }

const FlickeringGrid: React.FC<FlickeringGridProps> = ({ squareSize = 4, gridGap = 6, flickerChance = 0.3, color = "rgb(0, 0, 0)", width, height, className, maxOpacity = 0.3 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const memoizedColor = useMemo(() => {
    if (typeof window === "undefined") return `rgba(0, 0, 0,`;
    const canvas = document.createElement("canvas"); canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d"); if (!ctx) return "rgba(255, 0, 0,";
    ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
    return `rgba(${r}, ${g}, ${b},`;
  }, [color]);

  const setupCanvas = useCallback((canvas: HTMLCanvasElement, width: number, height: number) => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr; canvas.height = height * dpr; canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    const cols = Math.floor(width / (squareSize + gridGap)); const rows = Math.floor(height / (squareSize + gridGap));
    const squares = new Float32Array(cols * rows); for (let i = 0; i < squares.length; i++) squares[i] = Math.random() * maxOpacity;
    return { cols, rows, squares, dpr };
  }, [squareSize, gridGap, maxOpacity]);

  // Animation logic - see full implementation on 21st.dev
  return <div ref={containerRef} className={`w-full h-full ${className}`}><canvas ref={canvasRef} className="pointer-events-none" style={{ width: canvasSize.width, height: canvasSize.height }} /></div>;
};

export { FlickeringGrid };
```

**Dependencies:** none
**Note:** Full animation implementation available on 21st.dev

---

### text-reveal (magicui)
**Source:** https://21st.dev/community/components/magicui/text-reveal/default

```tsx
"use client";
import { FC, ReactNode, useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealByWordProps { text: string; className?: string }

const TextRevealByWord: FC<TextRevealByWordProps> = ({ text, className }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const words = text.split(" ");

  return (
    <div ref={targetRef} className={cn("relative z-0 h-[200vh]", className)}>
      <div className="sticky top-0 mx-auto flex h-[50%] max-w-4xl items-center bg-transparent px-[1rem] py-[5rem]">
        <p className="flex flex-wrap p-5 text-2xl font-bold text-black/20 dark:text-white/20 md:p-8 md:text-3xl lg:p-10 lg:text-4xl xl:text-5xl">
          {words.map((word, i) => {
            const start = i / words.length; const end = start + 1 / words.length;
            return <Word key={i} progress={scrollYProgress} range={[start, end]}>{word}</Word>;
          })}
        </p>
      </div>
    </div>
  );
};

interface WordProps { children: ReactNode; progress: MotionValue<number>; range: [number, number] }
const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return <span className="xl:lg-3 relative mx-1 lg:mx-2.5"><span className="absolute opacity-30">{children}</span><motion.span style={{ opacity }} className="text-black dark:text-white">{children}</motion.span></span>;
};

export { TextRevealByWord };
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### magic-card (magicui)
**Source:** https://21st.dev/community/components/magicui/magic-card/default

```tsx
"use client"
import React, { useCallback, useEffect } from "react"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { cn } from "@/lib/utils"

export interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> { gradientSize?: number; gradientColor?: string; gradientOpacity?: number }

export function MagicCard({ children, className, gradientSize = 200, gradientColor = "#262626", gradientOpacity = 0.8 }: MagicCardProps) {
  const mouseX = useMotionValue(-gradientSize); const mouseY = useMotionValue(-gradientSize);
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => { const { left, top } = e.currentTarget.getBoundingClientRect(); mouseX.set(e.clientX - left); mouseY.set(e.clientY - top); }, [mouseX, mouseY]);
  const handleMouseLeave = useCallback(() => { mouseX.set(-gradientSize); mouseY.set(-gradientSize); }, [mouseX, mouseY, gradientSize]);
  useEffect(() => { mouseX.set(-gradientSize); mouseY.set(-gradientSize); }, [mouseX, mouseY, gradientSize]);

  return (
    <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className={cn("group relative flex size-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 border text-black dark:text-white", className)}>
      <div className="relative z-10">{children}</div>
      <motion.div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: useMotionTemplate`radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)`, opacity: gradientOpacity }} />
    </div>
  )
}
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### neon-gradient-card (magicui)
**Source:** https://21st.dev/community/components/magicui/neon-gradient-card/default

```tsx
"use client"
import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface NeonColorsProps { firstColor: string; secondColor: string }
interface NeonGradientCardProps { className?: string; children?: ReactNode; borderSize?: number; borderRadius?: number; neonColors?: NeonColorsProps; [key: string]: any }

const NeonGradientCard: React.FC<NeonGradientCardProps> = ({ className, children, borderSize = 2, borderRadius = 20, neonColors = { firstColor: "#ff00aa", secondColor: "#00FFF1" }, ...props }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => { const updateDimensions = () => { if (containerRef.current) setDimensions({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight }); }; updateDimensions(); window.addEventListener("resize", updateDimensions); return () => window.removeEventListener("resize", updateDimensions); }, []);

  return (
    <div ref={containerRef} style={{ "--border-size": `${borderSize}px`, "--border-radius": `${borderRadius}px`, "--neon-first-color": neonColors.firstColor, "--neon-second-color": neonColors.secondColor, "--card-width": `${dimensions.width}px`, "--card-height": `${dimensions.height}px` } as CSSProperties} className={cn("relative z-10 size-full rounded-[var(--border-radius)]", className)} {...props}>
      <div className={cn("relative size-full min-h-[inherit] rounded-[calc(var(--border-radius)-var(--border-size))] bg-gray-100 p-6 dark:bg-neutral-900", "before:absolute before:inset-[-var(--border-size)] before:-z-10 before:rounded-[var(--border-radius)] before:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))] before:animate-background-position-spin", "after:absolute after:inset-[-var(--border-size)] after:-z-10 after:rounded-[var(--border-radius)] after:blur-[calc(var(--card-width)/3)] after:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))] after:opacity-80 after:animate-background-position-spin")}>{children}</div>
    </div>
  )
}

export { NeonGradientCard }
```

**Dependencies:** `@/lib/utils`
**CSS Required:** Add `animate-background-position-spin` keyframe

---

### animated-list (magicui)
**Source:** https://21st.dev/community/components/magicui/animated-list/default

```tsx
"use client";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface AnimatedListProps { className?: string; children: React.ReactNode; delay?: number }

export const AnimatedList = React.memo(({ className, children, delay = 1000 }: AnimatedListProps) => {
  const [index, setIndex] = useState(0);
  const childrenArray = React.Children.toArray(children);
  useEffect(() => { const interval = setInterval(() => setIndex((prev) => (prev + 1) % childrenArray.length), delay); return () => clearInterval(interval); }, [childrenArray.length, delay]);
  const itemsToShow = useMemo(() => childrenArray.slice(0, index + 1).reverse(), [index, childrenArray]);

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <AnimatePresence>{itemsToShow.map((item) => <AnimatedListItem key={(item as ReactElement).key}>{item}</AnimatedListItem>)}</AnimatePresence>
    </div>
  );
});

AnimatedList.displayName = "AnimatedList";

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  return <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1, originY: 0 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: "spring", stiffness: 350, damping: 40 }} layout className="mx-auto w-full">{children}</motion.div>;
}
```

**Dependencies:** `framer-motion`

---

### file-tree (magicui)
**Source:** https://21st.dev/community/components/magicui/file-tree/default

```tsx
"use client"
import React, { createContext, forwardRef, useCallback, useContext, useEffect, useState } from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

type TreeViewElement = { id: string; name: string; isSelectable?: boolean; children?: TreeViewElement[] }
type TreeContextProps = { selectedId: string | undefined; expandedItems: string[] | undefined; indicator: boolean; handleExpand: (id: string) => void; selectItem: (id: string) => void; openIcon?: React.ReactNode; closeIcon?: React.ReactNode; direction: "rtl" | "ltr" }

const TreeContext = createContext<TreeContextProps | null>(null)
const useTree = () => { const context = useContext(TreeContext); if (!context) throw new Error("useTree must be used within a TreeProvider"); return context }

// Full implementation includes Tree, Folder, File, CollapseButton components
// See complete code at https://21st.dev/r/magicui/file-tree

export { Tree, Folder, File, CollapseButton, type TreeViewElement }
```

**Dependencies:** `@/lib/utils`, `@radix-ui/react-accordion`, `lucide-react`, `@/components/ui/button`, `@/components/ui/scroll-area`
**Note:** Full implementation available from 21st.dev registry

---

### animated-subscribe-button (magicui)
**Source:** https://21st.dev/community/components/magicui/animated-subscribe-button/default

```tsx
"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface AnimatedSubscribeButtonProps { buttonColor: string; buttonTextColor?: string; subscribeStatus: boolean; initialText: React.ReactElement | string; changeText: React.ReactElement | string }

export const AnimatedSubscribeButton: React.FC<AnimatedSubscribeButtonProps> = ({ buttonColor, subscribeStatus, buttonTextColor, changeText, initialText }) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(subscribeStatus);

  return (
    <AnimatePresence mode="wait">
      {isSubscribed ? (
        <motion.button className="relative flex w-[200px] items-center justify-center overflow-hidden rounded-md bg-white p-[10px] outline outline-1 outline-black" onClick={() => setIsSubscribed(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.span key="action" className="relative block h-full w-full font-semibold" initial={{ y: -50 }} animate={{ y: 0 }} style={{ color: buttonColor }}>{changeText}</motion.span>
        </motion.button>
      ) : (
        <motion.button className="relative flex w-[200px] cursor-pointer items-center justify-center rounded-md border-none p-[10px]" style={{ backgroundColor: buttonColor, color: buttonTextColor }} onClick={() => setIsSubscribed(true)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.span key="reaction" className="relative block font-semibold" initial={{ x: 0 }} exit={{ x: 50, transition: { duration: 0.1 } }}>{initialText}</motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
```

**Dependencies:** `framer-motion`

---

### safari (magicui)
**Source:** https://21st.dev/community/components/magicui/safari/default

```tsx
import { SVGProps } from "react"

export interface SafariProps extends SVGProps<SVGSVGElement> { url?: string; src?: string; width?: number; height?: number }

export function Safari({ src, url, width = 1203, height = 753, ...props }: SafariProps) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#path0)">
        <path d="M0 52H1202V741C1202 747.627 1196.63 753 1190 753H12C5.37258 753 0 747.627 0 741V52Z" className="fill-[#E5E5E5] dark:fill-[#404040]" />
        <path fillRule="evenodd" clipRule="evenodd" d="M0 12C0 5.37258 5.37258 0 12 0H1190C1196.63 0 1202 5.37258 1202 12V52H0L0 12Z" className="fill-[#E5E5E5] dark:fill-[#404040]" />
        {/* Browser header elements */}
        <image href={src} width="1200" height="700" x="1" y="52" preserveAspectRatio="xMidYMid slice" clipPath="url(#roundedBottom)" />
      </g>
      <defs><clipPath id="path0"><rect width={width} height={height} fill="white" /></clipPath></defs>
    </svg>
  )
}
```

**Dependencies:** none (SVG component)
**Note:** Full SVG implementation available from 21st.dev registry

---

### iphone-15-pro (magicui)
**Source:** https://21st.dev/community/components/magicui/iphone-15-pro/default

```tsx
import { SVGProps } from "react"

export interface Iphone15ProProps extends SVGProps<SVGSVGElement> { width?: number; height?: number; src?: string }

export function Iphone15Pro({ width = 433, height = 882, src, ...props }: Iphone15ProProps) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2 73C2 32.6832 34.6832 0 75 0H357C397.317 0 430 32.6832 430 73V809C430 849.317 397.317 882 357 882H75C34.6832 882 2 849.317 2 809V73Z" className="fill-[#E5E5E5] dark:fill-[#404040]" />
      {/* Side buttons */}
      <path d="M6 74C6 35.3401 37.3401 4 76 4H356C394.66 4 426 35.3401 426 74V808C426 846.66 394.66 878 356 878H76C37.3401 878 6 846.66 6 808V74Z" className="dark:fill-[#262626] fill-white" />
      {src && <image href={src} x="21.25" y="19.25" width="389.5" height="843.5" preserveAspectRatio="xMidYMid slice" clipPath="url(#roundedCorners)" />}
      <defs><clipPath id="roundedCorners"><rect x="21.25" y="19.25" width="389.5" height="843.5" rx="55.75" ry="55.75" /></clipPath></defs>
    </svg>
  )
}
```

**Dependencies:** none (SVG component)
**Note:** Full SVG implementation available from 21st.dev registry

---

### animated-circular-progress-bar (magicui)
**Source:** https://21st.dev/community/components/magicui/animated-circular-progress-bar/default

```tsx
import { cn } from "@/lib/utils"

interface Props { max: number; value: number; min: number; gaugePrimaryColor: string; gaugeSecondaryColor: string; className?: string }

export function AnimatedCircularProgressBar({ max = 100, min = 0, value = 0, gaugePrimaryColor, gaugeSecondaryColor, className }: Props) {
  const circumference = 2 * Math.PI * 45;
  const percentPx = circumference / 100;
  const currentPercent = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("relative size-40 text-2xl font-semibold", className)} style={{ "--circle-size": "100px", "--circumference": circumference, "--percent-to-px": `${percentPx}px`, "--transition-length": "1s", transform: "translateZ(0)" } as React.CSSProperties}>
      <svg fill="none" className="size-full" strokeWidth="2" viewBox="0 0 100 100">
        {currentPercent <= 90 && currentPercent >= 0 && <circle cx="50" cy="50" r="45" strokeWidth="10" strokeLinecap="round" style={{ stroke: gaugeSecondaryColor, "--stroke-percent": 90 - currentPercent, strokeDasharray: "calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference)" } as React.CSSProperties} />}
        <circle cx="50" cy="50" r="45" strokeWidth="10" strokeLinecap="round" style={{ stroke: gaugePrimaryColor, "--stroke-percent": currentPercent, strokeDasharray: "calc(var(--stroke-percent) * var(--percent-to-px)) var(--circumference)", transition: "var(--transition-length) ease" } as React.CSSProperties} />
      </svg>
      <span className="absolute inset-0 m-auto size-fit">{currentPercent}</span>
    </div>
  )
}
```

**Dependencies:** `@/lib/utils`

---

### interactive-icon-cloud (magicui)
**Source:** https://21st.dev/community/components/magicui/interactive-icon-cloud/default

```tsx
"use client"
import { useEffect, useMemo, useState } from "react"
import { useTheme } from "next-themes"
import { Cloud, fetchSimpleIcons, renderSimpleIcon, SimpleIcon } from "react-icon-cloud"

export const cloudProps = { containerProps: { style: { display: "flex", justifyContent: "center", alignItems: "center", width: "100%", paddingTop: 40 } }, options: { reverse: true, depth: 1, wheelZoom: false, imageScale: 2, activeCursor: "default", tooltip: "native", initial: [0.1, -0.1], clickToFront: 500, maxSpeed: 0.04, minSpeed: 0.02 } }

export const renderCustomIcon = (icon: SimpleIcon, theme: string) => renderSimpleIcon({ icon, bgHex: theme === "light" ? "#f3f2ef" : "#080510", fallbackHex: theme === "light" ? "#6e6e73" : "#ffffff", minContrastRatio: theme === "dark" ? 2 : 1.2, size: 42, aProps: { href: undefined, onClick: (e: any) => e.preventDefault() } })

export function IconCloud({ iconSlugs }: { iconSlugs: string[] }) {
  const [data, setData] = useState(null);
  const { theme } = useTheme();
  useEffect(() => { fetchSimpleIcons({ slugs: iconSlugs }).then(setData) }, [iconSlugs]);
  const renderedIcons = useMemo(() => data ? Object.values(data.simpleIcons).map((icon) => renderCustomIcon(icon, theme || "light")) : null, [data, theme]);
  return <Cloud {...cloudProps}><>{renderedIcons}</></Cloud>;
}
```

**Dependencies:** `next-themes`, `react-icon-cloud`

---

### animated-grid-pattern (magicui)
**Source:** https://21st.dev/community/components/magicui/animated-grid-pattern/default

```tsx
"use client";
import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedGridPatternProps { width?: number; height?: number; x?: number; y?: number; numSquares?: number; className?: string; maxOpacity?: number; duration?: number }

export function AnimatedGridPattern({ width = 40, height = 40, x = -1, y = -1, numSquares = 50, className, maxOpacity = 0.5, duration = 4, ...props }: AnimatedGridPatternProps) {
  const id = useId();
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [squares, setSquares] = useState(() => Array.from({ length: numSquares }, (_, i) => ({ id: i, pos: [0, 0] })));

  const getPos = () => [Math.floor((Math.random() * dimensions.width) / width), Math.floor((Math.random() * dimensions.height) / height)];
  const updateSquarePosition = (id: number) => setSquares((curr) => curr.map((sq) => sq.id === id ? { ...sq, pos: getPos() } : sq));

  useEffect(() => { if (dimensions.width && dimensions.height) setSquares(Array.from({ length: numSquares }, (_, i) => ({ id: i, pos: getPos() }))); }, [dimensions, numSquares]);
  useEffect(() => { const ro = new ResizeObserver((entries) => { for (let e of entries) setDimensions({ width: e.contentRect.width, height: e.contentRect.height }); }); if (containerRef.current) ro.observe(containerRef.current); return () => ro.disconnect(); }, []);

  return (
    <svg ref={containerRef} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30", className)} {...props}>
      <defs><pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}><path d={`M.5 ${height}V.5H${width}`} fill="none" /></pattern></defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">{squares.map(({ pos: [px, py], id }, i) => <motion.rect key={`${px}-${py}-${i}`} initial={{ opacity: 0 }} animate={{ opacity: maxOpacity }} transition={{ duration, repeat: 1, delay: i * 0.1, repeatType: "reverse" }} onAnimationComplete={() => updateSquarePosition(id)} width={width - 1} height={height - 1} x={px * width + 1} y={py * height + 1} fill="currentColor" strokeWidth="0" />)}</svg>
    </svg>
  );
}
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### globe-magicui (magicui)
**Source:** https://21st.dev/community/components/magicui/globe/default

```tsx
"use client"
import createGlobe, { COBEOptions } from "cobe"
import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const GLOBE_CONFIG: COBEOptions = { width: 800, height: 800, onRender: () => {}, devicePixelRatio: 2, phi: 0, theta: 0.3, dark: 0, diffuse: 0.4, mapSamples: 16000, mapBrightness: 1.2, baseColor: [1, 1, 1], markerColor: [251 / 255, 100 / 255, 21 / 255], glowColor: [1, 1, 1], markers: [{ location: [14.5995, 120.9842], size: 0.03 }, { location: [19.076, 72.8777], size: 0.1 }, { location: [40.7128, -74.006], size: 0.1 }] }

export function Globe({ className, config = GLOBE_CONFIG }: { className?: string; config?: COBEOptions }) {
  let phi = 0; let width = 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  const [r, setR] = useState(0);

  const updatePointerInteraction = (value: any) => { pointerInteracting.current = value; if (canvasRef.current) canvasRef.current.style.cursor = value ? "grabbing" : "grab"; };
  const updateMovement = (clientX: any) => { if (pointerInteracting.current !== null) { const delta = clientX - pointerInteracting.current; pointerInteractionMovement.current = delta; setR(delta / 200); } };
  const onRender = useCallback((state: Record<string, any>) => { if (!pointerInteracting.current) phi += 0.005; state.phi = phi + r; state.width = width * 2; state.height = width * 2; }, [r]);
  const onResize = () => { if (canvasRef.current) width = canvasRef.current.offsetWidth; };

  useEffect(() => { window.addEventListener("resize", onResize); onResize(); const globe = createGlobe(canvasRef.current!, { ...config, width: width * 2, height: width * 2, onRender }); setTimeout(() => (canvasRef.current!.style.opacity = "1")); return () => globe.destroy(); }, []);

  return <div className={cn("absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]", className)}><canvas className={cn("size-full opacity-0 transition-opacity duration-500")} ref={canvasRef} onPointerDown={(e) => updatePointerInteraction(e.clientX - pointerInteractionMovement.current)} onPointerUp={() => updatePointerInteraction(null)} onPointerOut={() => updatePointerInteraction(null)} onMouseMove={(e) => updateMovement(e.clientX)} onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)} /></div>;
}
```

**Dependencies:** `@/lib/utils`, `cobe`

---

### blur-in (magicui)
**Source:** https://21st.dev/community/components/magicui/blur-in/default

```tsx
"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurIntProps { word: string; className?: string; variant?: { hidden: { filter: string; opacity: number }; visible: { filter: string; opacity: number } }; duration?: number }

const BlurIn = ({ word, className, variant, duration = 1 }: BlurIntProps) => {
  const defaultVariants = { hidden: { filter: "blur(10px)", opacity: 0 }, visible: { filter: "blur(0px)", opacity: 1 } };
  return <motion.h1 initial="hidden" animate="visible" transition={{ duration }} variants={variant || defaultVariants} className={cn("font-display text-center text-4xl font-bold tracking-[-0.02em] drop-shadow-sm md:text-7xl md:leading-[5rem]", className)}>{word}</motion.h1>;
};

export { BlurIn };
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### warp-background (magicui)
**Source:** https://21st.dev/community/components/magicui/warp-background/default

```tsx
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React, { HTMLAttributes, useCallback, useMemo } from "react";

interface WarpBackgroundProps extends HTMLAttributes<HTMLDivElement> { children: React.ReactNode; perspective?: number; beamsPerSide?: number; beamSize?: number; beamDelayMax?: number; beamDuration?: number; gridColor?: string }

const Beam = ({ width, x, delay, duration }: { width: string | number; x: string | number; delay: number; duration: number }) => {
  const hue = Math.floor(Math.random() * 360);
  return <motion.div style={{ "--x": `${x}`, "--width": `${width}`, "--background": `linear-gradient(hsl(${hue} 80% 60%), transparent)` } as React.CSSProperties} className="absolute left-[var(--x)] top-0 [aspect-ratio:1/var(--aspect-ratio)] [background:var(--background)] [width:var(--width)]" initial={{ y: "100cqmax", x: "-50%" }} animate={{ y: "-100%", x: "-50%" }} transition={{ duration, delay, repeat: Infinity, ease: "linear" }} />;
};

export const WarpBackground: React.FC<WarpBackgroundProps> = ({ children, perspective = 100, className, beamsPerSide = 3, beamSize = 5, beamDuration = 3, gridColor = "hsl(var(--border))", ...props }) => {
  const generateBeams = useCallback(() => { const beams = []; for (let i = 0; i < beamsPerSide; i++) beams.push({ x: i * (100 / beamsPerSide / beamSize), delay: Math.random() * 3 }); return beams; }, [beamsPerSide, beamSize]);
  const topBeams = useMemo(() => generateBeams(), [generateBeams]);

  return (
    <div className={cn("relative rounded border p-20", className)} {...props}>
      <div style={{ "--perspective": `${perspective}px`, "--grid-color": gridColor, "--beam-size": `${beamSize}%` } as React.CSSProperties} className="pointer-events-none absolute left-0 top-0 size-full overflow-hidden [clip-path:inset(0)]">
        <div className="absolute [background-size:var(--beam-size)_var(--beam-size)] [height:100cqmax] [transform-origin:50%_0%] [transform:rotateX(-90deg)] [width:100cqi]">
          {topBeams.map((beam, i) => <Beam key={i} width={`${beamSize}%`} x={`${beam.x * beamSize}%`} delay={beam.delay} duration={beamDuration} />)}
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
};
```

**Dependencies:** `@/lib/utils`, `motion` (framer-motion v11+)
**Note:** Full implementation available from 21st.dev registry

---

### pointer (magicui)
**Source:** https://21st.dev/community/components/magicui/pointer/default

```tsx
"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useMotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function Pointer({ className, style, children, ...props }: any): JSX.Element {
  const x = useMotionValue(0); const y = useMotionValue(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && containerRef.current) {
      const parentElement = containerRef.current.parentElement;
      if (parentElement) {
        parentElement.style.cursor = "none";
        const handleMouseMove = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
        const handleMouseEnter = () => setIsActive(true);
        const handleMouseLeave = () => setIsActive(false);
        parentElement.addEventListener("mousemove", handleMouseMove);
        parentElement.addEventListener("mouseenter", handleMouseEnter);
        parentElement.addEventListener("mouseleave", handleMouseLeave);
        return () => { parentElement.style.cursor = ""; parentElement.removeEventListener("mousemove", handleMouseMove); parentElement.removeEventListener("mouseenter", handleMouseEnter); parentElement.removeEventListener("mouseleave", handleMouseLeave); };
      }
    }
  }, [x, y]);

  return (
    <>
      <div ref={containerRef} />
      <AnimatePresence>
        {isActive && <motion.div className="pointer-events-none fixed z-50" style={{ top: y, left: x, ...style }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} {...props}>
          {children || <svg stroke="currentColor" fill="currentColor" viewBox="0 0 16 16" height="24" width="24" className={cn("rotate-[-70deg] stroke-white text-black", className)}><path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" /></svg>}
        </motion.div>}
      </AnimatePresence>
    </>
  );
}
```

**Dependencies:** `@/lib/utils`, `motion` (framer-motion v11+)

---

### scroll-based-velocity (magicui)
**Source:** https://21st.dev/community/components/magicui/scroll-based-velocity/default

```tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { cn } from "@/lib/utils";

interface VelocityScrollProps { text: string; default_velocity?: number; className?: string }

export const wrap = (min: number, max: number, v: number) => { const rangeSize = max - min; return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min; };

export function VelocityScroll({ text, default_velocity = 5, className }: VelocityScrollProps) {
  function ParallaxText({ children, baseVelocity = 100, className }: { children: string; baseVelocity: number; className?: string }) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
    const [repetitions, setRepetitions] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => { const calculateRepetitions = () => { if (containerRef.current && textRef.current) setRepetitions(Math.ceil(containerRef.current.offsetWidth / textRef.current.offsetWidth) + 2); }; calculateRepetitions(); window.addEventListener("resize", calculateRepetitions); return () => window.removeEventListener("resize", calculateRepetitions); }, [children]);

    const x = useTransform(baseX, (v) => `${wrap(-100 / repetitions, 0, v)}%`);
    const directionFactor = React.useRef<number>(1);
    useAnimationFrame((t, delta) => { let moveBy = directionFactor.current * baseVelocity * (delta / 1000); if (velocityFactor.get() < 0) directionFactor.current = -1; else if (velocityFactor.get() > 0) directionFactor.current = 1; moveBy += directionFactor.current * moveBy * velocityFactor.get(); baseX.set(baseX.get() + moveBy); });

    return <div className="w-full overflow-hidden whitespace-nowrap" ref={containerRef}><motion.div className={cn("inline-block", className)} style={{ x }}>{Array.from({ length: repetitions }).map((_, i) => <span key={i} ref={i === 0 ? textRef : null}>{children} </span>)}</motion.div></div>;
  }

  return <section className="relative w-full"><ParallaxText baseVelocity={default_velocity} className={className}>{text}</ParallaxText><ParallaxText baseVelocity={-default_velocity} className={className}>{text}</ParallaxText></section>;
}
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### shiny-button-magicui (magicui)
**Source:** https://21st.dev/community/components/magicui/shiny-button/default

```tsx
"use client";
import React from "react";
import { motion, type AnimationProps } from "framer-motion";
import { cn } from "@/lib/utils";

const animationProps: AnimationProps = { initial: { "--x": "100%", scale: 0.8 }, animate: { "--x": "-100%", scale: 1 }, whileTap: { scale: 0.95 }, transition: { repeat: Infinity, repeatType: "loop", repeatDelay: 1, type: "spring", stiffness: 20, damping: 15, mass: 2, scale: { type: "spring", stiffness: 200, damping: 5, mass: 0.5 } } };

interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { children: React.ReactNode; className?: string }

export const ShinyButton: React.FC<ShinyButtonProps> = ({ children, className, ...props }) => (
  <motion.button {...animationProps} {...props} className={cn("relative rounded-lg px-6 py-2 font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow dark:bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/10%)_0%,transparent_60%)] dark:hover:shadow-[0_0_20px_hsl(var(--primary)/10%)]", className)}>
    <span className="relative block size-full text-sm uppercase tracking-wide text-[rgb(0,0,0,65%)] dark:font-light dark:text-[rgb(255,255,255,90%)]" style={{ maskImage: "linear-gradient(-75deg,hsl(var(--primary)) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),hsl(var(--primary)) calc(var(--x) + 100%))" }}>{children}</span>
    <span style={{ mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box,linear-gradient(rgb(0,0,0), rgb(0,0,0))", maskComposite: "exclude" }} className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,hsl(var(--primary)/10%)_calc(var(--x)+20%),hsl(var(--primary)/50%)_calc(var(--x)+25%),hsl(var(--primary)/10%)_calc(var(--x)+100%))] p-px" />
  </motion.button>
);
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---

### sparkles-text (magicui)
**Source:** https://21st.dev/community/components/magicui/sparkles-text/default

```tsx
"use client";
import { CSSProperties, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Sparkle { id: string; x: string; y: string; color: string; delay: number; scale: number; lifespan: number }
interface SparklesTextProps { className?: string; text: string; sparklesCount?: number; colors?: { first: string; second: string } }

const SparklesText: React.FC<SparklesTextProps> = ({ text, colors = { first: "#9E7AFF", second: "#FE8BBB" }, className, sparklesCount = 10, ...props }) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateStar = (): Sparkle => ({ id: `${Math.random()}`, x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, color: Math.random() > 0.5 ? colors.first : colors.second, delay: Math.random() * 2, scale: Math.random() + 0.3, lifespan: Math.random() * 10 + 5 });
    setSparkles(Array.from({ length: sparklesCount }, generateStar));
    const interval = setInterval(() => setSparkles((curr) => curr.map((s) => s.lifespan <= 0 ? generateStar() : { ...s, lifespan: s.lifespan - 0.1 })), 100);
    return () => clearInterval(interval);
  }, [colors.first, colors.second, sparklesCount]);

  return <div className={cn("text-6xl font-bold", className)} {...props} style={{ "--sparkles-first-color": colors.first, "--sparkles-second-color": colors.second } as CSSProperties}><span className="relative inline-block">{sparkles.map((s) => <motion.svg key={s.id} className="pointer-events-none absolute z-20" initial={{ opacity: 0, left: s.x, top: s.y }} animate={{ opacity: [0, 1, 0], scale: [0, s.scale, 0], rotate: [75, 120, 150] }} transition={{ duration: 0.8, repeat: Infinity, delay: s.delay }} width="21" height="21" viewBox="0 0 21 21"><path d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z" fill={s.color} /></motion.svg>)}<strong>{text}</strong></span></div>;
};

export { SparklesText };
```

**Dependencies:** `@/lib/utils`, `framer-motion`

---
