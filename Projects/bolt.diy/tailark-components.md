# Tailark Components (extracted)

## Hero Section 1 (hero-section-1)
- Source: https://tailark.com/r/hero-section-1.json
- Description: Shadcn/ui website Hero Section
- Registry dependencies: button, https://motion-primitives.com/c/text-effect.json, https://motion-primitives.com/c/animated-group.json

### ../../packages/dusk-kit/blocks/hero-section/one/index.tsx
```tsx
import React from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { TextEffect } from '@/components/motion-primitives/text-effect'
import { AnimatedGroup } from '@/components/motion-primitives/animated-group'
import { HeroHeader } from './header'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <div
                    aria-hidden
                    className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block">
                    <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <section>
                    <div className="relative pt-24 md:pt-36">
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            delayChildren: 1,
                                        },
                                    },
                                },
                                item: {
                                    hidden: {
                                        opacity: 0,
                                        y: 20,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            type: 'spring',
                                            bounce: 0.3,
                                            duration: 2,
                                        },
                                    },
                                },
                            }}
                            className="mask-b-from-35% mask-b-to-90% absolute inset-0 top-56 -z-20 lg:top-32">
                            <Image
                                src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
                                alt="background"
                                className="hidden size-full dark:block"
                                width="3276"
                                height="4095"
                            />
                        </AnimatedGroup>

                        <div
                            aria-hidden
                            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
                        />

                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <Link
                                        href="#link"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-foreground text-sm">Introducing Support for AI Models</span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </AnimatedGroup>

                                <TextEffect
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    as="h1"
                                    className="mx-auto mt-8 max-w-4xl text-balance text-5xl max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                                    Modern Solutions for Customer Engagement
                                </TextEffect>
                                <TextEffect
                                    per="line"
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={0.5}
                                    as="p"
                                    className="mx-auto mt-8 max-w-2xl text-balance text-lg">
                                    Highly customizable components for building modern websites and applications that look and feel the way you mean it.
                                </TextEffect>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <div
                                        key={1}
                                        className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-5 text-base">
                                            <Link href="#link">
                                                <span className="text-nowrap">Start Building</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-10.5 rounded-xl px-5">
                                        <Link href="#link">
                                            <span className="text-nowrap">Request a demo</span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
                            <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                                    <Image
                                        className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                                        src="/mail2.png"
                                        alt="app screen"
                                        width="2700"
                                        height="1440"
                                    />
                                    <Image
                                        className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                                        src="/mail2-light.png"
                                        alt="app screen"
                                        width="2700"
                                        height="1440"
                                    />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
                <section className="bg-background pb-16 pt-16 md:pb-32">
                    <div className="group relative m-auto max-w-5xl px-6">
                        <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                            <Link
                                href="/"
                                className="block text-sm duration-150 hover:opacity-75">
                                <span> Meet Our Customers</span>

                                <ChevronRight className="ml-1 inline-block size-3" />
                            </Link>
                        </div>
                        <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                    alt="Nvidia Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/column.svg"
                                    alt="Column Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/github.svg"
                                    alt="GitHub Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/nike.svg"
                                    alt="Nike Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                    alt="Lemon Squeezy Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/laravel.svg"
                                    alt="Laravel Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-7 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/lilly.svg"
                                    alt="Lilly Logo"
                                    height="28"
                                    width="auto"
                                />
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-6 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/openai.svg"
                                    alt="OpenAI Logo"
                                    height="24"
                                    width="auto"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
```

### ../../packages/core/src/components/logo.tsx
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}
```

## Hero Section 2 (hero-section-2)
- Source: https://tailark.com/r/hero-section-2.json
- Description: Shadcn/ui website Hero Section
- Registry dependencies: button, https://motion-primitives.com/c/text-effect.json, https://motion-primitives.com/c/animated-group.json
```tsx
import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { TextEffect } from '@/components/motion-primitives/text-effect'
import { AnimatedGroup } from '@/components/motion-primitives/animated-group'
import { HeroHeader } from './header'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <div
                    aria-hidden
                    className="absolute inset-0 isolate hidden contain-strict lg:block">
                    <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <section>
                    <div className="relative pt-24">
                        <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
                        <div className="mx-auto max-w-5xl px-6">
                            <div className="sm:mx-auto lg:mr-auto lg:mt-0">
                                <TextEffect
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    as="h1"
                                    className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16">
                                    Build and Ship 10x faster with NS
                                </TextEffect>
                                <TextEffect
                                    per="line"
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={0.5}
                                    as="p"
                                    className="mt-8 max-w-2xl text-pretty text-lg">
                                    Tailwindcss highly customizable components for building modern websites and applications that look and feel the way you mean it.
                                </TextEffect>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex items-center gap-2">
                                    <div
                                        key={1}
                                        className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-5 text-base">
                                            <Link href="#link">
                                                <span className="text-nowrap">Start Building</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-10.5 rounded-xl px-5 text-base">
                                        <Link href="#link">
                                            <span className="text-nowrap">Request a demo</span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
                            <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-5xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                                    <Image
                                        className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                                        src="/mail2.png"
                                        alt="app screen"
                                        width="2700"
                                        height="1440"
                                    />
                                    <Image
                                        className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                                        src="/mail2-light.png"
                                        alt="app screen"
                                        width="2700"
                                        height="1440"
                                    />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
                <section className="bg-background pb-16 pt-16 md:pb-32">
                    <div className="group relative m-auto max-w-5xl px-6">
                        <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                            <Link
                                href="/"
                                className="block text-sm duration-150 hover:opacity-75">
                                <span> Meet Our Customers</span>

                                <ChevronRight className="ml-1 inline-block size-3" />
                            </Link>
                        </div>
                        <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                    alt="Nvidia Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/column.svg"
                                    alt="Column Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/github.svg"
                                    alt="GitHub Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/nike.svg"
                                    alt="Nike Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                    alt="Lemon Squeezy Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/laravel.svg"
                                    alt="Laravel Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-7 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/lilly.svg"
                                    alt="Lilly Logo"
                                    height="28"
                                    width="auto"
                                />
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-6 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/openai.svg"
                                    alt="OpenAI Logo"
                                    height="24"
                                    width="auto"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

```
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}

```
```tsx
'use client'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import { useScroll } from 'motion/react'

const menuItems = [
    { name: 'Features', href: '#link' },
    { name: 'Solution', href: '#link' },
    { name: 'Pricing', href: '#link' },
    { name: 'About', href: '#link' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)

    const { scrollYProgress } = useScroll()

    React.useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            setScrolled(latest > 0.05)
        })
        return () => unsubscribe()
    }, [scrollYProgress])

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className={cn('fixed z-20 w-full border-b transition-colors duration-150', scrolled && 'bg-background/50 backdrop-blur-3xl')}>
                <div className="mx-auto max-w-5xl px-6 transition-all duration-300">
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>

                            <div className="hidden lg:block">
                                <ul className="flex gap-8 text-sm">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm">
                                    <Link href="#">
                                        <span>Login</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm">
                                    <Link href="#">
                                        <span>Sign Up</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

```

## Hero Section 7 (hero-section-7)
- Source: https://tailark.com/r/hero-section-7.json
- Description: Shadcn/ui website Hero Section
- Registry dependencies: button
```tsx
'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { ArrowRight, Menu, Rocket, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const menuItems = [
    { name: 'Features', href: '#' },
    { name: 'Solution', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'About', href: '#' },
]

export default function HeroSection() {
    const [menuState, setMenuState] = React.useState(false)

    return (
        <>
            <header>
                <nav
                    data-state={menuState && 'active'}
                    className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent">
                    <div className="m-auto max-w-5xl px-6">
                        <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                            <div className="flex w-full justify-between lg:w-auto">
                                <Link
                                    href="/"
                                    aria-label="home"
                                    className="flex items-center space-x-2">
                                    <Logo />
                                </Link>

                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                    className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                    <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                    <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                                </button>
                            </div>

                            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                                <div className="lg:pr-4">
                                    <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                                        {menuItems.map((item, index) => (
                                            <li key={index}>
                                                <Link
                                                    href={item.href}
                                                    className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                    <span>{item.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm">
                                        <Link href="#">
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm">
                                        <Link href="#">
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <main className="overflow-hidden">
                <section className="relative">
                    <div className="relative py-24 lg:py-28">
                        <div className="mx-auto max-w-7xl px-6 md:px-12">
                            <div className="text-center sm:mx-auto sm:w-10/12 lg:mr-auto lg:mt-0 lg:w-4/5">
                                <Link
                                    href="/"
                                    className="rounded-(--radius) mx-auto flex w-fit items-center gap-2 border p-1 pr-3">
                                    <span className="bg-muted rounded-[calc(var(--radius)-0.25rem)] px-2 py-1 text-xs">New</span>
                                    <span className="text-sm">Introduction Tailark Html</span>
                                    <span className="bg-(--color-border) block h-4 w-px"></span>

                                    <ArrowRight className="size-4" />
                                </Link>

                                <h1 className="mt-8 text-4xl font-semibold md:text-5xl xl:text-5xl xl:[line-height:1.125]">
                                    Tame the Wild West <br /> of Frontend Development
                                </h1>
                                <p className="mx-auto mt-8 hidden max-w-2xl text-wrap text-lg sm:block">Tailwindcss highly customizable components for building modern websites and applications that look and feel the way you mean it.</p>
                                <p className="mx-auto mt-6 max-w-2xl text-wrap sm:hidden">Highly customizable components for building modern websites and applications, with your personal spark.</p>

                                <div className="mt-8">
                                    <Button
                                        size="lg"
                                        asChild>
                                        <Link href="#">
                                            <Rocket className="relative size-4" />
                                            <span className="text-nowrap">Start Building</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="x-auto relative mx-auto mt-8 max-w-lg sm:mt-12">
                                <div className="absolute inset-0 -top-8 left-1/2 -z-20 h-56 w-full -translate-x-1/2 [background-image:linear-gradient(to_bottom,transparent_98%,theme(colors.gray.200/75%)_98%),linear-gradient(to_right,transparent_94%,_theme(colors.gray.200/75%)_94%)] [background-size:16px_35px] [mask:radial-gradient(black,transparent_95%)] dark:opacity-10"></div>
                                <div className="absolute inset-x-0 top-12 -z-[1] mx-auto h-1/3 w-2/3 rounded-full bg-blue-300 blur-3xl dark:bg-white/20"></div>

                                <Swiper
                                    slidesPerView={1}
                                    pagination={{ clickable: true }}
                                    loop
                                    autoplay={{ delay: 5000 }}
                                    modules={[Autoplay, EffectCoverflow]}>
                                    <SwiperSlide className="px-2">
                                        <div className="bg-background rounded-(--radius) h-44 max-w-lg border p-9">
                                            <div className="mx-auto h-fit w-full">
                                                <NetlifyLogo />
                                            </div>
                                            <p className="mt-6 text-center text-lg font-medium">30% Increase in revenue</p>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide className="px-2">
                                        <div className="bg-background rounded-(--radius) h-44 max-w-lg border p-9">
                                            <div className="mx-auto h-fit w-full">
                                                <AstroLogo />
                                            </div>
                                            <p className="mt-6 text-center text-lg font-medium">45% Increase in revenue</p>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide className="px-2">
                                        <div className="bg-background rounded-(--radius) h-44 max-w-lg border p-9">
                                            <div className="mx-auto h-fit w-full">
                                                <WorkOsLogo />
                                            </div>
                                            <p className="mt-6 text-center text-lg font-medium">60% Increase in revenue</p>
                                        </div>
                                    </SwiperSlide>
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

const WorkOsLogo = () => {
    return (
        <svg
            className="m-auto h-8"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 251.8 48">
            <g>
                <path
                    fill="currentColor"
                    className="text-[#29363D] dark:text-white"
                    d="M73,7.2h7l5,20.6c0.9,3.9,1.1,6.2,1.1,6.2h0.1c0,0,0.3-2.3,1.3-6.2l4.8-20.6h7.9l5.1,20.6   c1,4,1.2,6.2,1.2,6.2h0.1c0,0,0.1-2.2,1-6.2l4.8-20.6h7l-8.8,33.9h-7.7l-5.3-20.5c-1.1-4.5-1.2-6.4-1.2-6.4h-0.1c0,0-0.1,2-1.1,6.4   l-5,20.5h-8C82,41.1,73,7.2,73,7.2z M118.2,28.8c0-7.7,5-12.8,12.6-12.8c7.5,0,12.5,5,12.5,12.8c0,7.8-5,12.8-12.5,12.8   C123.2,41.6,118.2,36.6,118.2,28.8L118.2,28.8z M136.8,28.8c0-5-2.4-7.8-6-7.8c-3.9,0-6.1,3.2-6.1,7.8c0,5.1,2.4,7.9,6.1,7.9   C134.6,36.7,136.8,33.6,136.8,28.8L136.8,28.8z M146.4,16.4h6.2V21h0.1c1.1-2.4,3.6-4.7,8-4.7c0.7,0,1.2,0.1,1.5,0.2v6.2H162   c0,0-0.6-0.2-2.1-0.2c-4.8,0-7.4,2.8-7.4,8.1v10.6h-6.2V16.4z M165.1,7.2h6.2v10.9c0,6.4-0.1,7.6-0.1,7.6h0.1l9.2-9.2h7.7   l-10.8,10.7l12.5,14h-7.3l-9-10.2l-2.3,2.3v7.9H165L165.1,7.2L165.1,7.2z M189.9,24.3c0-10.4,6.5-17.4,16.2-17.4s16.2,7,16.2,17.4   s-6.5,17.4-16.2,17.4C196.4,41.7,189.9,34.7,189.9,24.3z M215.7,24.3c0-7.1-3.8-11.9-9.5-11.9c-5.7,0-9.5,4.8-9.5,11.9   s3.8,11.9,9.5,11.9C211.8,36.2,215.7,31.4,215.7,24.3z M224.7,29.8h7.1c0,4,2.7,6.2,6.9,6.2c3.5,0,5.9-1.8,5.9-4.3   c0-2.8-1.9-3.6-7.7-4.7c-5.4-1.1-11.1-2.9-11.1-9.9c0-5.9,5-10.3,12.7-10.3c8,0,12.9,4.2,12.9,10.5h-7.1c0-3.1-2.4-5-5.8-5   c-3.5,0-5.7,1.7-5.7,4.2c0,2.6,1.5,3.7,6.3,4.6c7,1.5,12.8,2.3,12.8,10.1c0,6.2-5.4,10.3-13.3,10.3   C230.4,41.5,224.7,36.9,224.7,29.8z"></path>
                <path
                    fill="#6363F1"
                    d="M0,24c0,1.1,0.3,2.1,0.8,3l9.7,16.8c1,1.7,2.5,3.1,4.4,3.7c3.6,1.2,7.5-0.3,9.4-3.5l2.3-4.1   l-9.2-16l9.8-16.9L29.5,3c0.7-1.2,1.6-2.2,2.7-3H17.2c-2.6,0-5.1,1.4-6.4,3.7L0.8,21C0.3,21.9,0,22.9,0,24z"></path>
                <path
                    fill="#6363F1"
                    d="M55.4,24c0-1.1-0.3-2.1-0.8-3l-9.8-17c-1.9-3.3-5.8-4.7-9.4-3.5c-1.9,0.6-3.4,2-4.4,3.7   L28.7,8L38,24l-9.8,16.9L25.9,45c-0.7,1.2-1.6,2.2-2.7,3h15.1c2.6,0,5.1-1.4,6.4-3.7l10-17.3C55.1,26.1,55.4,25.1,55.4,24z"></path>
            </g>
        </svg>
    )
}

const AstroLogo = () => {
    return (
        <svg
            className="mx-auto h-12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 460 160"
            fill="none">
            <path
                d="M65.7846 121.175C61.2669 117.045 59.9481 108.368 61.8303 102.082C65.0939 106.045 69.6158 107.301 74.2997 108.009C81.5305 109.103 88.6318 108.694 95.349 105.389C96.1174 105.011 96.8275 104.507 97.6672 103.998C98.2974 105.826 98.4615 107.672 98.2413 109.551C97.706 114.127 95.4288 117.662 91.8069 120.341C90.3586 121.413 88.8261 122.371 87.3303 123.382C82.7349 126.487 81.4917 130.129 83.2184 135.427C83.2594 135.556 83.2961 135.685 83.389 136C81.0427 134.95 79.3289 133.421 78.023 131.411C76.6438 129.289 75.9876 126.942 75.9531 124.403C75.9358 123.167 75.9358 121.92 75.7696 120.702C75.3638 117.732 73.9694 116.402 71.3426 116.325C68.6467 116.247 66.5141 117.913 65.9486 120.538C65.9054 120.739 65.8428 120.938 65.7803 121.172L65.7846 121.175Z"
                fill="currentColor"
            />
            <path
                d="M65.7846 121.175C61.2669 117.045 59.9481 108.368 61.8303 102.082C65.0939 106.045 69.6158 107.301 74.2997 108.009C81.5305 109.103 88.6318 108.694 95.349 105.389C96.1174 105.011 96.8275 104.507 97.6672 103.998C98.2974 105.826 98.4615 107.672 98.2413 109.551C97.706 114.127 95.4288 117.662 91.8069 120.341C90.3586 121.413 88.8261 122.371 87.3303 123.382C82.7349 126.487 81.4917 130.129 83.2184 135.427C83.2594 135.556 83.2961 135.685 83.389 136C81.0427 134.95 79.3289 133.421 78.023 131.411C76.6438 129.289 75.9876 126.942 75.9531 124.403C75.9358 123.167 75.9358 121.92 75.7696 120.702C75.3638 117.732 73.9694 116.402 71.3426 116.325C68.6467 116.247 66.5141 117.913 65.9486 120.538C65.9054 120.739 65.8428 120.938 65.7803 121.172L65.7846 121.175Z"
                fill="url(#paint0_linear_1_33)"
            />
            <path
                d="M40 101.034C40 101.034 53.3775 94.5177 66.7924 94.5177L76.9068 63.2155C77.2855 61.7017 78.3911 60.6729 79.6393 60.6729C80.8875 60.6729 81.9932 61.7017 82.3719 63.2155L92.4862 94.5177C108.374 94.5177 119.279 101.034 119.279 101.034C119.279 101.034 96.5558 39.133 96.5114 39.0088C95.8592 37.1787 94.7583 36 93.274 36H66.007C64.5227 36 63.4662 37.1787 62.7696 39.0088C62.7205 39.1307 40 101.034 40 101.034Z"
                fill="currentColor"
            />
            <path
                d="M181.043 81.1227C181.043 86.6079 174.22 89.8838 164.773 89.8838C158.624 89.8838 156.45 88.3601 156.45 85.1604C156.45 81.8083 159.149 80.2085 165.297 80.2085C170.846 80.2085 175.569 80.2846 181.043 80.9703V81.1227ZM181.118 74.3423C177.744 73.5805 172.645 73.1234 166.572 73.1234C148.877 73.1234 140.555 77.3135 140.555 87.065C140.555 97.1975 146.253 101.083 159.449 101.083C170.621 101.083 178.193 98.2641 180.968 91.3313H181.417C181.342 93.0074 181.268 94.6834 181.268 95.9785C181.268 99.5592 181.867 99.8639 184.791 99.8639H198.587C197.837 97.7308 197.388 91.7122 197.388 86.5317C197.388 80.9703 197.612 76.7802 197.612 71.1426C197.612 59.6388 190.715 52.3251 169.121 52.3251C159.824 52.3251 149.477 53.925 141.605 56.2867C142.354 59.4102 143.404 65.7335 143.929 69.8474C150.752 66.6477 160.424 65.2764 167.922 65.2764C178.268 65.2764 181.118 67.6381 181.118 72.4377V74.3423Z"
                fill="currentColor"
            />
            <path
                d="M218.971 84.3224C217.097 84.5509 214.547 84.5509 211.923 84.5509C209.149 84.5509 206.6 84.4748 204.875 84.2462C204.875 84.8557 204.8 85.5413 204.8 86.1508C204.8 95.6738 211.024 101.235 232.917 101.235C253.535 101.235 260.208 95.75 260.208 86.0746C260.208 76.9325 255.785 72.4377 236.216 71.4473C220.995 70.7616 219.646 69.0856 219.646 67.181C219.646 64.9717 221.595 63.8289 231.792 63.8289C242.364 63.8289 245.213 65.2764 245.213 68.3238V69.0094C246.713 68.9332 249.412 68.8571 252.186 68.8571C254.81 68.8571 257.659 68.9332 259.309 69.0856C259.309 68.3999 259.384 67.7905 259.384 67.2572C259.384 56.0581 250.086 52.4013 232.092 52.4013C211.848 52.4013 205.025 57.3533 205.025 67.0286C205.025 75.7136 210.499 81.1227 229.918 81.9607C244.238 82.4178 245.813 84.0177 245.813 86.227C245.813 88.5887 243.489 89.6553 233.442 89.6553C221.895 89.6553 218.971 88.0554 218.971 84.7795V84.3224Z"
                fill="currentColor"
            />
            <path
                d="M284.955 44.1734C279.482 49.2778 269.66 54.3821 264.187 55.7534C264.262 58.5722 264.262 63.7527 264.262 66.5715L269.285 66.6477C269.21 72.0568 269.135 78.6086 269.135 82.9511C269.135 93.0835 274.458 100.702 291.028 100.702C298.001 100.702 302.65 99.9401 308.423 98.7212C307.823 94.9881 307.148 89.2743 306.923 84.9319C303.475 86.0746 299.126 86.6841 294.327 86.6841C287.654 86.6841 284.955 84.8557 284.955 79.599C284.955 75.028 284.955 70.7616 285.03 66.8001C293.578 66.8763 302.125 67.0286 307.148 67.181C307.073 63.2194 307.223 57.5056 307.448 53.6964C300.176 53.8488 292.003 53.925 285.255 53.925C285.33 50.5729 285.405 47.3732 285.48 44.1734H284.955Z"
                fill="currentColor"
            />
            <path
                d="M329.736 64.286C329.811 60.3244 329.886 56.9724 329.961 53.6964H314.89C315.115 60.2483 315.115 66.9525 315.115 76.7802C315.115 86.6079 315.04 93.3883 314.89 99.8639H332.135C331.835 95.2929 331.76 87.5983 331.76 81.0465C331.76 70.6855 335.959 67.7143 345.481 67.7143C349.905 67.7143 353.054 68.2476 355.828 69.238C355.903 65.3526 356.653 57.8104 357.102 54.4583C354.253 53.6203 351.104 53.087 347.28 53.087C339.108 53.0108 333.11 56.3629 330.336 64.3622L329.736 64.286Z"
                fill="currentColor"
            />
            <path
                d="M404.808 76.4754C404.808 84.7795 398.81 88.6649 389.363 88.6649C379.991 88.6649 373.993 85.008 373.993 76.4754C373.993 67.9428 380.066 64.7431 389.363 64.7431C398.735 64.7431 404.808 68.1714 404.808 76.4754ZM420.478 76.0945C420.478 59.5626 407.582 52.1728 389.363 52.1728C371.069 52.1728 358.623 59.5626 358.623 76.0945C358.623 92.5503 370.244 101.388 389.288 101.388C408.482 101.388 420.478 92.5503 420.478 76.0945Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_1_33"
                    x1="61.0003"
                    y1="136"
                    x2="104.622"
                    y2="115.39"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#D83333" />
                    <stop
                        offset="1"
                        stopColor="#F041FF"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

const NetlifyLogo = () => {
    return (
        <>
            <svg
                className="mx-auto h-12 dark:hidden"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 209"
                fill="none">
                <g clipPath="url(#clip0_235_8)">
                    <path
                        d="M117.436 207.036V154.604L118.529 153.51H129.452L130.545 154.604V207.036L129.452 208.13H118.529L117.436 207.036Z"
                        fill="#05BDBA"
                    />
                    <path
                        d="M117.436 53.5225V1.09339L118.529 0H129.452L130.545 1.09339V53.5225L129.452 54.6159H118.529L117.436 53.5225Z"
                        fill="#05BDBA"
                    />
                    <path
                        d="M69.9539 169.238H68.4094L60.6869 161.512V159.967L78.7201 141.938L86.8976 141.942L87.9948 143.031V151.209L69.9539 169.238Z"
                        fill="#05BDBA"
                    />
                    <path
                        d="M69.9462 38.8917H68.4017L60.6792 46.6181V48.1626L78.7124 66.192L86.8899 66.1882L87.9871 65.0986V56.9212L69.9462 38.8917Z"
                        fill="#05BDBA"
                    />
                    <path
                        d="M1.09339 97.5104H75.3711L76.4645 98.6038V109.526L75.3711 110.62H1.09339L0 109.526V98.6038L1.09339 97.5104Z"
                        fill="#05BDBA"
                    />
                    <path
                        d="M440.999 97.5104H510.91L512.004 98.6038V109.526L510.91 110.62H436.633L435.539 109.526L439.905 98.6038L440.999 97.5104Z"
                        fill="#05BDBA"
                    />
                    <path
                        d="M212.056 108.727L210.963 109.821H177.079L175.986 110.914C175.986 113.101 178.173 119.657 186.916 119.657C190.196 119.657 193.472 118.564 194.566 116.377L195.659 115.284H208.776L209.869 116.377C208.776 122.934 203.313 132.774 186.916 132.774C168.336 132.774 159.589 119.657 159.589 104.357C159.589 89.0576 168.332 75.9408 185.822 75.9408C203.313 75.9408 212.056 89.0576 212.056 104.357V108.731V108.727ZM195.659 97.7971C195.659 96.7037 194.566 89.0538 185.822 89.0538C177.079 89.0538 175.986 96.7037 175.986 97.7971L177.079 98.8905H194.566L195.659 97.7971Z"
                        fill="#014847"
                    />
                    <path
                        d="M242.66 115.284C242.66 117.47 243.753 118.564 245.94 118.564H255.776L256.87 119.657V130.587L255.776 131.681H245.94C236.103 131.681 227.36 127.307 227.36 115.284V91.2368L226.266 90.1434H218.617L217.523 89.05V78.1199L218.617 77.0265H226.266L227.36 75.9332V66.0965L228.453 65.0031H241.57L242.663 66.0965V75.9332L243.757 77.0265H255.78L256.874 78.1199V89.05L255.78 90.1434H243.757L242.663 91.2368V115.284H242.66Z"
                        fill="#014847"
                    />
                    <path
                        d="M283.1 131.681H269.983L268.889 130.587V56.2636L269.983 55.1702H283.1L284.193 56.2636V130.587L283.1 131.681Z"
                        fill="#014847"
                    />
                    <path
                        d="M312.61 68.2871H299.493L298.399 67.1937V56.2636L299.493 55.1702H312.61L313.703 56.2636V67.1937L312.61 68.2871ZM312.61 131.681H299.493L298.399 130.587V78.1237L299.493 77.0304H312.61L313.703 78.1237V130.587L312.61 131.681Z"
                        fill="#014847"
                    />
                    <path
                        d="M363.98 56.2636V67.1937L362.886 68.2871H353.05C350.863 68.2871 349.769 69.3805 349.769 71.5672V75.9408L350.863 77.0342H361.793L362.886 78.1276V89.0576L361.793 90.151H350.863L349.769 91.2444V130.591L348.676 131.684H335.559L334.466 130.591V91.2444L333.372 90.151H325.723L324.629 89.0576V78.1276L325.723 77.0342H333.372L334.466 75.9408V71.5672C334.466 59.5438 343.209 55.1702 353.046 55.1702H362.882L363.976 56.2636H363.98Z"
                        fill="#014847"
                    />
                    <path
                        d="M404.42 132.774C400.046 143.704 395.677 150.261 380.373 150.261H374.906L373.813 149.167V138.237L374.906 137.144H380.373C385.836 137.144 386.929 136.05 388.023 132.77V131.677L370.536 89.05V78.1199L371.63 77.0265H381.466L382.56 78.1199L395.677 115.284H396.77L409.887 78.1199L410.98 77.0265H420.817L421.91 78.1199V89.05L404.424 132.77L404.42 132.774Z"
                        fill="#014847"
                    />
                    <path
                        d="M135.454 131.681L134.361 130.587L134.368 98.9172C134.368 93.4541 132.22 89.2182 125.625 89.0806C122.234 88.9926 118.354 89.0729 114.209 89.2488L113.59 89.8834L113.598 130.587L112.504 131.681H99.3913L98.2979 130.587V77.5388L99.3913 76.4454L128.901 76.1778C143.685 76.1778 149.668 86.3356 149.668 97.8009V130.587L148.575 131.681H135.454Z"
                        fill="#014847"
                    />
                </g>
                <defs>
                    <clipPath id="clip0_235_8">
                        <rect
                            width="512"
                            height="208.126"
                            fill="white"
                        />
                    </clipPath>
                </defs>
            </svg>
            <svg
                className="mx-auto hidden h-12 dark:block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 209"
                fill="none">
                <g clipPath="url(#clip0_235_26)">
                    <path
                        d="M117.436 207.036V154.604L118.529 153.51H129.452L130.545 154.604V207.036L129.452 208.13H118.529L117.436 207.036Z"
                        fill="#32E6E2"
                    />
                    <path
                        d="M117.436 53.5225V1.09339L118.529 0H129.452L130.545 1.09339V53.5225L129.452 54.6159H118.529L117.436 53.5225Z"
                        fill="#32E6E2"
                    />
                    <path
                        d="M69.9539 169.238H68.4094L60.6869 161.512V159.967L78.7201 141.938L86.8976 141.942L87.9948 143.031V151.209L69.9539 169.238Z"
                        fill="#32E6E2"
                    />
                    <path
                        d="M69.9462 38.8917H68.4017L60.6792 46.6181V48.1626L78.7124 66.192L86.8899 66.1882L87.9871 65.0986V56.9212L69.9462 38.8917Z"
                        fill="#32E6E2"
                    />
                    <path
                        d="M1.09339 97.5104H75.3711L76.4645 98.6038V109.526L75.3711 110.62H1.09339L0 109.526V98.6038L1.09339 97.5104Z"
                        fill="#32E6E2"
                    />
                    <path
                        d="M440.999 97.5104H510.91L512.004 98.6038V109.526L510.91 110.62H436.633L435.539 109.526L439.905 98.6038L440.999 97.5104Z"
                        fill="#32E6E2"
                    />
                    <path
                        d="M212.056 108.727L210.963 109.821H177.079L175.986 110.914C175.986 113.101 178.173 119.657 186.916 119.657C190.196 119.657 193.472 118.564 194.566 116.377L195.659 115.284H208.776L209.869 116.377C208.776 122.934 203.313 132.774 186.916 132.774C168.336 132.774 159.589 119.657 159.589 104.357C159.589 89.0576 168.332 75.9408 185.822 75.9408C203.313 75.9408 212.056 89.0576 212.056 104.357V108.731V108.727ZM195.659 97.7971C195.659 96.7037 194.566 89.0538 185.822 89.0538C177.079 89.0538 175.986 96.7037 175.986 97.7971L177.079 98.8905H194.566L195.659 97.7971Z"
                        fill="white"
                    />
                    <path
                        d="M242.66 115.284C242.66 117.47 243.753 118.564 245.94 118.564H255.776L256.87 119.657V130.587L255.776 131.681H245.94C236.103 131.681 227.36 127.307 227.36 115.284V91.2368L226.266 90.1434H218.617L217.523 89.05V78.1199L218.617 77.0265H226.266L227.36 75.9332V66.0965L228.453 65.0031H241.57L242.663 66.0965V75.9332L243.757 77.0265H255.78L256.874 78.1199V89.05L255.78 90.1434H243.757L242.663 91.2368V115.284H242.66Z"
                        fill="white"
                    />
                    <path
                        d="M283.1 131.681H269.983L268.889 130.587V56.2636L269.983 55.1702H283.1L284.193 56.2636V130.587L283.1 131.681Z"
                        fill="white"
                    />
                    <path
                        d="M312.61 68.2871H299.493L298.399 67.1937V56.2636L299.493 55.1702H312.61L313.703 56.2636V67.1937L312.61 68.2871ZM312.61 131.681H299.493L298.399 130.587V78.1237L299.493 77.0304H312.61L313.703 78.1237V130.587L312.61 131.681Z"
                        fill="white"
                    />
                    <path
                        d="M363.98 56.2636V67.1937L362.886 68.2871H353.05C350.863 68.2871 349.769 69.3805 349.769 71.5672V75.9408L350.863 77.0342H361.793L362.886 78.1276V89.0576L361.793 90.151H350.863L349.769 91.2444V130.591L348.676 131.684H335.559L334.466 130.591V91.2444L333.372 90.151H325.723L324.629 89.0576V78.1276L325.723 77.0342H333.372L334.466 75.9408V71.5672C334.466 59.5438 343.209 55.1702 353.046 55.1702H362.882L363.976 56.2636H363.98Z"
                        fill="white"
                    />
                    <path
                        d="M404.42 132.774C400.046 143.704 395.677 150.261 380.373 150.261H374.906L373.813 149.167V138.237L374.906 137.144H380.373C385.836 137.144 386.929 136.05 388.023 132.77V131.677L370.536 89.05V78.1199L371.63 77.0265H381.466L382.56 78.1199L395.677 115.284H396.77L409.887 78.1199L410.98 77.0265H420.817L421.91 78.1199V89.05L404.424 132.77L404.42 132.774Z"
                        fill="white"
                    />
                    <path
                        d="M135.454 131.681L134.361 130.587L134.368 98.9172C134.368 93.4541 132.22 89.2182 125.625 89.0806C122.234 88.9926 118.354 89.0729 114.209 89.2488L113.59 89.8834L113.598 130.587L112.504 131.681H99.3913L98.2979 130.587V77.5388L99.3913 76.4454L128.901 76.1778C143.685 76.1778 149.668 86.3356 149.668 97.8009V130.587L148.575 131.681H135.454Z"
                        fill="white"
                    />
                </g>
                <defs>
                    <clipPath id="clip0_235_26">
                        <rect
                            width="512"
                            height="208.126"
                            fill="white"
                        />
                    </clipPath>
                </defs>
            </svg>
        </>
    )
}

```
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}

```

## Hero Section 8 (hero-section-8)
- Source: https://tailark.com/r/hero-section-8.json
- Description: Shadcn/ui website Hero Section
- Registry dependencies: button
```tsx
'use client'
import React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { ArrowRight, Menu, Rocket, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const menuItems = [
    { name: 'Features', href: '#' },
    { name: 'Solution', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'About', href: '#' },
]

export default function HeroSection() {
    const [menuState, setMenuState] = React.useState(false)

    return (
        <>
            <header>
                <nav
                    data-state={menuState && 'active'}
                    className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent">
                    <div className="m-auto max-w-5xl px-6">
                        <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                            <div className="flex w-full justify-between lg:w-auto">
                                <Link
                                    href="/"
                                    aria-label="home"
                                    className="flex items-center space-x-2">
                                    <Logo />
                                </Link>

                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                    className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                    <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                    <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                                </button>
                            </div>

                            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                                <div className="lg:pr-4">
                                    <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                                        {menuItems.map((item, index) => (
                                            <li key={index}>
                                                <Link
                                                    href={item.href}
                                                    className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                    <span>{item.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm">
                                        <Link href="#">
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm">
                                        <Link href="#">
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <main className="overflow-hidden">
                <section>
                    <div className="relative pt-24">
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="max-w-3xl text-center sm:mx-auto lg:mr-auto lg:mt-0 lg:w-4/5">
                                <Link
                                    href="/"
                                    className="rounded-(--radius) mx-auto flex w-fit items-center gap-2 border p-1 pr-3">
                                    <span className="bg-muted rounded-[calc(var(--radius)-0.25rem)] px-2 py-1 text-xs">New</span>
                                    <span className="text-sm">Introduction Tailark Html</span>
                                    <span className="bg-(--color-border) block h-4 w-px"></span>

                                    <ArrowRight className="size-4" />
                                </Link>

                                <h1 className="mt-8 text-balance text-4xl font-semibold md:text-5xl xl:text-6xl xl:[line-height:1.125]">Modern Software testing reimagined</h1>
                                <p className="mx-auto mt-8 hidden max-w-2xl text-wrap text-lg sm:block">Tailwindcss highly customizable components for building modern websites and applications that look and feel the way you mean it.</p>
                                <p className="mx-auto mt-6 max-w-2xl text-wrap sm:hidden">Highly customizable components for building modern websites and applications, with your personal spark.</p>

                                <div className="mt-8">
                                    <Button
                                        size="lg"
                                        asChild>
                                        <Link href="#">
                                            <Rocket className="relative size-4" />
                                            <span className="text-nowrap">Start Building</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="mask-b-from-55% relative mx-auto mt-16 max-w-6xl overflow-hidden px-4">
                            <Image
                                className="z-2 border-border/25 relative hidden rounded-2xl border dark:block"
                                src="/music.png"
                                alt="app screen"
                                width={2796}
                                height={2008}
                            />
                            <Image
                                className="z-2 border-border/25 relative rounded-2xl border dark:hidden"
                                src="/music-light.png"
                                alt="app screen"
                                width={2796}
                                height={2008}
                            />
                        </div>
                    </div>
                </section>
                <section className="bg-background relative z-10 pb-16">
                    <div className="m-auto max-w-5xl px-6">
                        <h2 className="text-center text-lg font-medium">Your favorite companies are our partners.</h2>
                        <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                alt="Nvidia Logo"
                                height="20"
                                width="auto"
                            />
                            <img
                                className="h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/column.svg"
                                alt="Column Logo"
                                height="16"
                                width="auto"
                            />
                            <img
                                className="h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/github.svg"
                                alt="GitHub Logo"
                                height="16"
                                width="auto"
                            />
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/nike.svg"
                                alt="Nike Logo"
                                height="20"
                                width="auto"
                            />
                            <img
                                className="h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/laravel.svg"
                                alt="Laravel Logo"
                                height="16"
                                width="auto"
                            />
                            <img
                                className="h-7 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/lilly.svg"
                                alt="Lilly Logo"
                                height="28"
                                width="auto"
                            />
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                alt="Lemon Squeezy Logo"
                                height="20"
                                width="auto"
                            />
                            <img
                                className="h-6 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/openai.svg"
                                alt="OpenAI Logo"
                                height="24"
                                width="auto"
                            />
                            <img
                                className="h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/tailwindcss.svg"
                                alt="Tailwind CSS Logo"
                                height="16"
                                width="auto"
                            />
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/vercel.svg"
                                alt="Vercel Logo"
                                height="20"
                                width="auto"
                            />
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/zapier.svg"
                                alt="Zapier Logo"
                                height="20"
                                width="auto"
                            />
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

```
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}

```

## Hero Section 9 (hero-section-9)
- Source: https://tailark.com/r/hero-section-9.json
- Description: Shadcn/ui website Hero Section
- Registry dependencies: button
```tsx
'use client'
import { Logo } from '@/components/logo'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

const menuItems = [
    { name: 'Features', href: '#' },
    { name: 'Solution', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'About', href: '#' },
]

export default function HeroSection() {
    const [menuState, setMenuState] = useState(false)
    return (
        <>
            <header>
                <nav
                    data-state={menuState && 'active'}
                    className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent">
                    <div className="m-auto max-w-5xl px-6">
                        <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                            <div className="flex w-full justify-between lg:w-auto">
                                <Link
                                    href="/"
                                    aria-label="home"
                                    className="flex items-center space-x-2">
                                    <Logo />
                                </Link>

                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                    className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                    <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                    <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                                </button>
                            </div>

                            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                                <div className="lg:pr-4">
                                    <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                                        {menuItems.map((item, index) => (
                                            <li key={index}>
                                                <Link
                                                    href={item.href}
                                                    className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                    <span>{item.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm">
                                        <Link href="#">
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm">
                                        <Link href="#">
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <main>
                <div
                    aria-hidden
                    className="z-2 absolute inset-0 isolate hidden opacity-50 contain-strict lg:block">
                    <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>

                <section className="bg-muted/50 dark:bg-background overflow-hidden">
                    <div className="relative mx-auto max-w-5xl px-6 pt-28 lg:pt-24">
                        <div className="relative z-10 mx-auto max-w-2xl text-center">
                            <h1 className="text-balance text-4xl font-semibold md:text-5xl lg:text-6xl">Modern Software testing reimagined</h1>
                            <p className="text-muted-foreground mx-auto my-8 max-w-2xl text-xl">Officiis laudantium excepturi ducimus rerum dignissimos, and tempora nam vitae, excepturi ducimus iste provident dolores.</p>

                            <Button
                                asChild
                                size="lg">
                                <Link href="#">
                                    <span className="btn-label">Start Building</span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="mx-auto 2xl:max-w-7xl">
                        <div className="perspective-distant pl-8 lg:pl-44">
                            <div className="lg:h-176 rotate-x-20 mask-b-from-55% mask-b-to-100% mask-r-from-75% skew-x-12 pl-6 pt-6">
                                <Image
                                    className="rounded-(--radius) border shadow-xl dark:hidden"
                                    src="/card.png"
                                    alt="Tailark hero section"
                                    width={2880}
                                    height={2074}
                                />
                                <Image
                                    className="rounded-(--radius) hidden border shadow-xl dark:block"
                                    src="/dark-card.webp"
                                    alt="Tailark hero section"
                                    width={2880}
                                    height={2074}
                                />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="dark:bg-background bg-muted/50 relative z-10 py-16">
                    <div className="m-auto max-w-5xl px-6">
                        <h2 className="text-center text-lg font-medium">Your favorite companies are our partners.</h2>
                        <div className="mx-auto mt-20 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                alt="Nvidia Logo"
                                height="20"
                                width="auto"
                            />
                            <img
                                className="h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/column.svg"
                                alt="Column Logo"
                                height="16"
                                width="auto"
                            />
                            <img
                                className="h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/github.svg"
                                alt="GitHub Logo"
                                height="16"
                                width="auto"
                            />
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/nike.svg"
                                alt="Nike Logo"
                                height="20"
                                width="auto"
                            />
                            <img
                                className="h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/laravel.svg"
                                alt="Laravel Logo"
                                height="16"
                                width="auto"
                            />
                            <img
                                className="h-7 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/lilly.svg"
                                alt="Lilly Logo"
                                height="28"
                                width="auto"
                            />
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                alt="Lemon Squeezy Logo"
                                height="20"
                                width="auto"
                            />
                            <img
                                className="h-6 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/openai.svg"
                                alt="OpenAI Logo"
                                height="24"
                                width="auto"
                            />
                            <img
                                className="h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/tailwindcss.svg"
                                alt="Tailwind CSS Logo"
                                height="16"
                                width="auto"
                            />
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/vercel.svg"
                                alt="Vercel Logo"
                                height="20"
                                width="auto"
                            />
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/zapier.svg"
                                alt="Zapier Logo"
                                height="20"
                                width="auto"
                            />
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

```
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}

```

## Features Block 1 (features-1)
- Source: https://tailark.com/r/features-1.json
- Description: Shadcn/ui website features block
- Registry dependencies: card
```tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Settings2, Sparkles, Zap } from 'lucide-react'
import { ReactNode } from 'react'

export default function Features() {
    return (
        <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Built to cover your needs</h2>
                    <p className="mt-4">Libero sapiente aliquam quibusdam aspernatur, praesentium iusto repellendus.</p>
                </div>
                <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16">
                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Zap
                                    className="size-6"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">Customizable</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">Extensive customization options, allowing you to tailor every aspect to meet your specific needs.</p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Settings2
                                    className="size-6"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">You have full control</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm">From design elements to functionality, you have complete control to create a unique and personalized experience.</p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Sparkles
                                    className="size-6"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">Powered By AI</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm">Elements to functionality, you have complete control to create a unique experience.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
        />

        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
    </div>
)

```

## Features Block 3 (features-3)
- Source: https://tailark.com/r/features-3.json
- Description: Shadcn/ui website features block
- Registry dependencies: card
```tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Settings2, Sparkles, Zap } from 'lucide-react'
import { ReactNode } from 'react'

export default function Features() {
    return (
        <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Built to cover your needs</h2>
                    <p className="mt-4">Libero sapiente aliquam quibusdam aspernatur, praesentium iusto repellendus.</p>
                </div>
                <Card className="@min-4xl:max-w-full @min-4xl:grid-cols-3 @min-4xl:divide-x @min-4xl:divide-y-0 mx-auto mt-8 grid max-w-sm divide-y overflow-hidden shadow-zinc-950/5 *:text-center md:mt-16">
                    <div className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Zap
                                    className="size-6"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">Customizable</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">Extensive customization options, allowing you to tailor every aspect to meet your specific needs.</p>
                        </CardContent>
                    </div>

                    <div className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Settings2
                                    className="size-6"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">You have full control</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm">From design elements to functionality, you have complete control to create a unique and personalized experience.</p>
                        </CardContent>
                    </div>

                    <div className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Sparkles
                                    className="size-6"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">Powered By AI</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm">Elements to functionality, you have complete control to create a unique experience.</p>
                        </CardContent>
                    </div>
                </Card>
            </div>
        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
        />

        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
    </div>
)

```

## Features Block 4 (features-4)
- Source: https://tailark.com/r/features-4.json
- Description: Shadcn/ui website features block
```tsx
import { Cpu, Fingerprint, Pencil, Settings2, Sparkles, Zap } from 'lucide-react'

export default function Features() {
    return (
        <section className="py-12 md:py-20">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-balance text-4xl font-medium lg:text-5xl">The foundation for creative teams management</h2>
                    <p>Lyra is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</p>
                </div>

                <div className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4" />
                            <h3 className="text-sm font-medium">Faaast</h3>
                        </div>
                        <p className="text-sm">It supports an entire helping developers and innovate.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4" />
                            <h3 className="text-sm font-medium">Powerful</h3>
                        </div>
                        <p className="text-sm">It supports an entire helping developers and businesses.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Fingerprint className="size-4" />

                            <h3 className="text-sm font-medium">Security</h3>
                        </div>
                        <p className="text-sm">It supports an helping developers businesses.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Pencil className="size-4" />

                            <h3 className="text-sm font-medium">Customization</h3>
                        </div>
                        <p className="text-sm">It supports helping developers and businesses innovate.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Settings2 className="size-4" />

                            <h3 className="text-sm font-medium">Control</h3>
                        </div>
                        <p className="text-sm">It supports helping developers and businesses innovate.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4" />

                            <h3 className="text-sm font-medium">Built for AI</h3>
                        </div>
                        <p className="text-sm">It supports helping developers and businesses innovate.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## Features Block 5 (features-5)
- Source: https://tailark.com/r/features-5.json
- Description: Shadcn/ui website features block
```tsx
import { Activity, DraftingCompass, Mail, Zap } from 'lucide-react'
import Image from 'next/image'

export default function FeaturesSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid items-center gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-5 lg:gap-24">
                    <div className="lg:col-span-2">
                        <div className="md:pr-6 lg:pr-0">
                            <h2 className="text-4xl font-semibold lg:text-5xl">Built for Scaling teams</h2>
                            <p className="mt-6">Orrupti aut temporibus assumenda atque ab, accusamus sit, molestiae veniam laboriosam pariatur.</p>
                        </div>
                        <ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-3">
                            <li>
                                <Mail className="size-5" />
                                Email and web support
                            </li>
                            <li>
                                <Zap className="size-5" />
                                Fast response time
                            </li>
                            <li>
                                <Activity className="size-5" />
                                Menitoring and analytics
                            </li>
                            <li>
                                <DraftingCompass className="size-5" />
                                Architectural review
                            </li>
                        </ul>
                    </div>
                    <div className="border-border/50 relative rounded-3xl border p-3 lg:col-span-3">
                        <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                            <Image src="/payments.png" className="hidden rounded-[15px] dark:block" alt="payments illustration dark" width={1207} height={929} />
                            <Image src="/payments-light.png" className="rounded-[15px] shadow dark:hidden" alt="payments illustration light" width={1207} height={929} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## Features Block 6 (features-6)
- Source: https://tailark.com/r/features-6.json
- Description: Shadcn/ui website features block
```tsx
import { Cpu, Lock, Sparkles, Zap } from 'lucide-react'
import Image from 'next/image'

export default function FeaturesSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-12 px-6">
                <div className="relative z-10 grid items-center gap-4 md:grid-cols-2 md:gap-12">
                    <h2 className="text-4xl font-semibold">The Lyra ecosystem brings together our models</h2>
                    <p className="max-w-sm sm:ml-auto">Empower your team with workflows that adapt to your needs, whether you prefer git synchronization or a AI Agents interface.</p>
                </div>
                <div className="px-3 pt-3 md:-mx-8">
                    <div className="aspect-88/36 mask-b-from-75% mask-b-to-95% relative">
                        <Image
                            src="/mail-upper.png"
                            className="absolute inset-0 z-10"
                            alt="payments illustration dark"
                            width={2797}
                            height={1137}
                        />
                        <Image
                            src="/mail-back.png"
                            className="hidden dark:block"
                            alt="payments illustration dark"
                            width={2797}
                            height={1137}
                        />
                        <Image
                            src="/mail-back-light.png"
                            className="dark:hidden"
                            alt="payments illustration light"
                            width={2797}
                            height={1137}
                        />
                    </div>
                </div>
                <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4" />
                            <h3 className="text-sm font-medium">Faaast</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">It supports an entire helping developers and innovate.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4" />
                            <h3 className="text-sm font-medium">Powerful</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">It supports an entire helping developers and businesses.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Lock className="size-4" />
                            <h3 className="text-sm font-medium">Security</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">It supports an helping developers businesses innovate.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4" />

                            <h3 className="text-sm font-medium">AI Powered</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">It supports an helping developers businesses innovate.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## Features Block 7 (features-7)
- Source: https://tailark.com/r/features-7.json
- Description: Shadcn/ui website features block
```tsx
import { Cpu, Lock, Sparkles, Zap } from 'lucide-react'
import Image from 'next/image'

export default function FeaturesSection() {
    return (
        <section className="overflow-hidden py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl font-semibold lg:text-5xl">Built for Scaling teams</h2>
                    <p className="mt-6 text-lg">Empower your team with workflows that adapt to your needs, whether you prefer git synchronization or a AI Agents interface.</p>
                </div>
                <div className="mask-b-from-75% mask-l-from-75% mask-b-to-95% mask-l-to-95% relative -mx-4 pr-3 pt-3 md:-mx-12">
                    <div className="perspective-midrange">
                        <div className="rotate-x-6 -skew-2">
                            <div className="aspect-88/36 relative">
                                <Image
                                    src="/mail-upper.png"
                                    className="absolute inset-0 z-10"
                                    alt="payments illustration dark"
                                    width={2797}
                                    height={1137}
                                />
                                <Image
                                    src="/mail-back.png"
                                    className="hidden dark:block"
                                    alt="payments illustration dark"
                                    width={2797}
                                    height={1137}
                                />
                                <Image
                                    src="/mail-back-light.png"
                                    className="dark:hidden"
                                    alt="payments illustration light"
                                    width={2797}
                                    height={1137}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4" />
                            <h3 className="text-sm font-medium">Faaast</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">It supports an entire helping developers and innovate.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4" />
                            <h3 className="text-sm font-medium">Powerful</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">It supports an entire helping developers and businesses.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Lock className="size-4" />
                            <h3 className="text-sm font-medium">Security</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">It supports an helping developers businesses innovate.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4" />

                            <h3 className="text-sm font-medium">AI Powered</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">It supports an helping developers businesses innovate.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## Features Block 8 (features-8)
- Source: https://tailark.com/r/features-8.json
- Description: Shadcn/ui website features block
- Registry dependencies: card
```tsx
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Users } from 'lucide-react'

export default function FeaturesSection() {
    return (
        <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
            <div className="mx-auto max-w-5xl px-6">
                <div className="relative">
                    <div className="relative z-10 grid grid-cols-6 gap-3">
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-2">
                            <CardContent className="relative m-auto size-fit pt-6">
                                <div className="relative flex h-24 w-56 items-center">
                                    <svg
                                        className="text-muted absolute inset-0 size-full"
                                        viewBox="0 0 254 104"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span className="mx-auto block w-fit text-5xl font-semibold">100%</span>
                                </div>
                                <h2 className="mt-6 text-center text-3xl font-semibold">Customizable</h2>
                            </CardContent>
                        </Card>
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
                            <CardContent className="pt-6">
                                <div className="relative mx-auto flex aspect-square size-32 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                    <svg
                                        className="m-auto h-fit w-24"
                                        viewBox="0 0 212 143"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            className="text-zinc-400 dark:text-zinc-600"
                                            d="M44.0209 55.3542C43.1945 54.7639 42.6916 54.0272 42.5121 53.1442C42.3327 52.2611 42.5995 51.345 43.3125 50.3958C50.632 40.3611 59.812 32.5694 70.8525 27.0208C81.8931 21.4722 93.668 18.6979 106.177 18.6979C118.691 18.6979 130.497 21.3849 141.594 26.7587C152.691 32.1326 161.958 39.8936 169.396 50.0417C170.222 51.1042 170.489 52.0486 170.196 52.875C169.904 53.7014 169.401 54.4097 168.688 55C167.979 55.5903 167.153 55.8571 166.208 55.8004C165.264 55.7437 164.438 55.2408 163.729 54.2917C157.236 45.0833 148.885 38.0307 138.675 33.1337C128.466 28.2368 117.633 25.786 106.177 25.7812C94.7257 25.7812 83.9827 28.2321 73.948 33.1337C63.9132 38.0354 55.5903 45.0881 48.9792 54.2917C48.2709 55.3542 47.4445 55.9444 46.5 56.0625C45.5556 56.1806 44.7292 55.9444 44.0209 55.3542ZM126.188 142.656C113.91 139.587 103.875 133.476 96.0834 124.325C88.2917 115.173 84.3959 103.988 84.3959 90.7708C84.3959 84.8681 86.5209 79.9097 90.7709 75.8958C95.0209 71.8819 100.156 69.875 106.177 69.875C112.198 69.875 117.333 71.8819 121.583 75.8958C125.833 79.9097 127.958 84.8681 127.958 90.7708C127.958 94.6667 129.434 97.9439 132.385 100.602C135.337 103.261 138.819 104.588 142.833 104.583C146.847 104.583 150.271 103.256 153.104 100.602C155.938 97.9486 157.354 94.6714 157.354 90.7708C157.354 77.0764 152.337 65.566 142.302 56.2396C132.267 46.9132 120.285 42.25 106.354 42.25C92.4237 42.25 80.441 46.9132 70.4063 56.2396C60.3716 65.566 55.3542 77.0174 55.3542 90.5937C55.3542 93.4271 55.621 96.9687 56.1546 101.219C56.6882 105.469 57.9562 110.427 59.9584 116.094C60.3125 117.156 60.2842 118.101 59.8734 118.927C59.4625 119.753 58.7825 120.344 57.8334 120.698C56.8889 121.052 55.9752 121.024 55.0921 120.613C54.2091 120.202 53.5881 119.522 53.2292 118.573C51.4584 113.969 50.1905 109.395 49.4255 104.853C48.6605 100.31 48.2756 95.6158 48.2709 90.7708C48.2709 75.0694 53.9682 61.9062 65.363 51.2812C76.7577 40.6562 90.3624 35.3437 106.177 35.3437C122.115 35.3437 135.809 40.6562 147.26 51.2812C158.712 61.9062 164.438 75.0694 164.438 90.7708C164.438 96.6736 162.343 101.601 158.155 105.554C153.966 109.506 148.859 111.485 142.833 111.49C136.813 111.49 131.649 109.513 127.342 105.561C123.035 101.608 120.88 96.6783 120.875 90.7708C120.875 86.875 119.43 83.5978 116.54 80.9392C113.65 78.2805 110.196 76.9536 106.177 76.9583C102.163 76.9583 98.7089 78.2876 95.8142 80.9462C92.9195 83.6049 91.4745 86.8797 91.4792 90.7708C91.4792 102.222 94.8745 111.785 101.665 119.458C108.456 127.132 117.22 132.503 127.958 135.573C129.021 135.927 129.729 136.517 130.083 137.344C130.438 138.17 130.497 139.056 130.26 140C130.024 140.826 129.552 141.535 128.844 142.125C128.135 142.715 127.25 142.892 126.188 142.656ZM67.0417 18.3437C66.0973 18.934 65.1528 19.0828 64.2084 18.79C63.2639 18.4972 62.5556 17.8762 62.0834 16.9271C61.6112 15.9826 61.4931 15.1279 61.7292 14.3629C61.9653 13.5979 62.5556 12.9179 63.5 12.3229C70.1112 8.78125 77.0174 6.06597 84.2188 4.17708C91.4202 2.28819 98.7396 1.34375 106.177 1.34375C113.733 1.34375 121.111 2.25986 128.313 4.09208C135.514 5.92431 142.479 8.54986 149.208 11.9687C150.271 12.559 150.892 13.2674 151.071 14.0937C151.251 14.9201 151.161 15.7465 150.802 16.5729C150.448 17.3993 149.858 18.0486 149.031 18.5208C148.205 18.9931 147.201 18.934 146.021 18.3437C139.764 15.1563 133.299 12.7078 126.627 10.9983C119.954 9.28889 113.138 8.43181 106.177 8.42708C99.3299 8.42708 92.6007 9.22514 85.9896 10.8212C79.3785 12.4174 73.0625 14.9249 67.0417 18.3437ZM87.9375 140.177C80.9723 132.858 75.6314 125.392 71.915 117.78C68.1987 110.167 66.3381 101.164 66.3334 90.7708C66.3334 80.0278 70.2292 70.9658 78.0209 63.585C85.8125 56.2042 95.198 52.5161 106.177 52.5208C117.156 52.5208 126.601 56.2112 134.51 63.5921C142.42 70.9729 146.375 80.0325 146.375 90.7708C146.375 91.8333 146.052 92.6904 145.405 93.3421C144.758 93.9937 143.901 94.3172 142.833 94.3125C141.889 94.3125 141.063 93.989 140.354 93.3421C139.646 92.6951 139.292 91.8381 139.292 90.7708C139.292 81.9167 136.014 74.5099 129.46 68.5504C122.906 62.591 115.145 59.6089 106.177 59.6042C97.2049 59.6042 89.503 62.5862 83.0713 68.5504C76.6396 74.5146 73.4214 81.9214 73.4167 90.7708C73.4167 100.333 75.0695 108.451 78.375 115.123C81.6806 121.796 86.5209 128.494 92.8959 135.219C93.6042 135.927 93.9584 136.753 93.9584 137.698C93.9584 138.642 93.6042 139.469 92.8959 140.177C92.1875 140.885 91.3612 141.24 90.4167 141.24C89.4723 141.24 88.6459 140.885 87.9375 140.177ZM141.417 128.135C130.91 128.135 121.789 124.594 114.054 117.51C106.319 110.427 102.454 101.514 102.458 90.7708C102.458 89.8264 102.784 89 103.436 88.2917C104.088 87.5833 104.942 87.2292 106 87.2292C107.063 87.2292 107.92 87.5833 108.571 88.2917C109.223 89 109.546 89.8264 109.542 90.7708C109.542 99.625 112.729 106.885 119.104 112.552C125.479 118.219 132.917 121.052 141.417 121.052C142.125 121.052 143.129 120.993 144.427 120.875C145.726 120.757 147.083 120.58 148.5 120.344C149.563 120.108 150.479 120.256 151.248 120.79C152.018 121.324 152.519 122.119 152.75 123.177C152.986 124.122 152.809 124.948 152.219 125.656C151.629 126.365 150.861 126.837 149.917 127.073C147.792 127.663 145.934 127.989 144.342 128.05C142.751 128.112 141.776 128.14 141.417 128.135Z"
                                            fill="currentColor"
                                        />
                                        <g clipPath="url(#clip0_0_1)">
                                            <path
                                                d="M44.0209 55.3542C43.1945 54.7639 42.6916 54.0272 42.5121 53.1442C42.3327 52.2611 42.5995 51.345 43.3125 50.3958C50.632 40.3611 59.812 32.5694 70.8525 27.0208C81.8931 21.4722 93.668 18.6979 106.177 18.6979C118.691 18.6979 130.497 21.3849 141.594 26.7587C152.691 32.1326 161.958 39.8936 169.396 50.0417C170.222 51.1042 170.489 52.0486 170.196 52.875C169.904 53.7014 169.401 54.4097 168.688 55C167.979 55.5903 167.153 55.8571 166.208 55.8004C165.264 55.7437 164.438 55.2408 163.729 54.2917C157.236 45.0833 148.885 38.0307 138.675 33.1337C128.466 28.2368 117.633 25.786 106.177 25.7812C94.7257 25.7812 83.9827 28.2321 73.948 33.1337C63.9132 38.0354 55.5903 45.0881 48.9792 54.2917C48.2709 55.3542 47.4445 55.9444 46.5 56.0625C45.5556 56.1806 44.7292 55.9444 44.0209 55.3542ZM126.188 142.656C113.91 139.587 103.875 133.476 96.0834 124.325C88.2917 115.173 84.3959 103.988 84.3959 90.7708C84.3959 84.8681 86.5209 79.9097 90.7709 75.8958C95.0209 71.8819 100.156 69.875 106.177 69.875C112.198 69.875 117.333 71.8819 121.583 75.8958C125.833 79.9097 127.958 84.8681 127.958 90.7708C127.958 94.6667 129.434 97.9439 132.385 100.602C135.337 103.261 138.819 104.588 142.833 104.583C146.847 104.583 150.271 103.256 153.104 100.602C155.938 97.9486 157.354 94.6714 157.354 90.7708C157.354 77.0764 152.337 65.566 142.302 56.2396C132.267 46.9132 120.285 42.25 106.354 42.25C92.4237 42.25 80.441 46.9132 70.4063 56.2396C60.3716 65.566 55.3542 77.0174 55.3542 90.5937C55.3542 93.4271 55.621 96.9687 56.1546 101.219C56.6882 105.469 57.9562 110.427 59.9584 116.094C60.3125 117.156 60.2842 118.101 59.8734 118.927C59.4625 119.753 58.7825 120.344 57.8334 120.698C56.8889 121.052 55.9752 121.024 55.0921 120.613C54.2091 120.202 53.5881 119.522 53.2292 118.573C51.4584 113.969 50.1905 109.395 49.4255 104.853C48.6605 100.31 48.2756 95.6158 48.2709 90.7708C48.2709 75.0694 53.9682 61.9062 65.363 51.2812C76.7577 40.6562 90.3624 35.3437 106.177 35.3437C122.115 35.3437 135.809 40.6562 147.26 51.2812C158.712 61.9062 164.438 75.0694 164.438 90.7708C164.438 96.6736 162.343 101.601 158.155 105.554C153.966 109.506 148.859 111.485 142.833 111.49C136.813 111.49 131.649 109.513 127.342 105.561C123.035 101.608 120.88 96.6783 120.875 90.7708C120.875 86.875 119.43 83.5978 116.54 80.9392C113.65 78.2805 110.196 76.9536 106.177 76.9583C102.163 76.9583 98.7089 78.2876 95.8142 80.9462C92.9195 83.6049 91.4745 86.8797 91.4792 90.7708C91.4792 102.222 94.8745 111.785 101.665 119.458C108.456 127.132 117.22 132.503 127.958 135.573C129.021 135.927 129.729 136.517 130.083 137.344C130.438 138.17 130.497 139.056 130.26 140C130.024 140.826 129.552 141.535 128.844 142.125C128.135 142.715 127.25 142.892 126.188 142.656ZM67.0417 18.3437C66.0973 18.934 65.1528 19.0828 64.2084 18.79C63.2639 18.4972 62.5556 17.8762 62.0834 16.9271C61.6112 15.9826 61.4931 15.1279 61.7292 14.3629C61.9653 13.5979 62.5556 12.9179 63.5 12.3229C70.1112 8.78125 77.0174 6.06597 84.2188 4.17708C91.4202 2.28819 98.7396 1.34375 106.177 1.34375C113.733 1.34375 121.111 2.25986 128.313 4.09208C135.514 5.92431 142.479 8.54986 149.208 11.9687C150.271 12.559 150.892 13.2674 151.071 14.0937C151.251 14.9201 151.161 15.7465 150.802 16.5729C150.448 17.3993 149.858 18.0486 149.031 18.5208C148.205 18.9931 147.201 18.934 146.021 18.3437C139.764 15.1563 133.299 12.7078 126.627 10.9983C119.954 9.28889 113.138 8.43181 106.177 8.42708C99.3299 8.42708 92.6007 9.22514 85.9896 10.8212C79.3785 12.4174 73.0625 14.9249 67.0417 18.3437ZM87.9375 140.177C80.9723 132.858 75.6314 125.392 71.915 117.78C68.1987 110.167 66.3381 101.164 66.3334 90.7708C66.3334 80.0278 70.2292 70.9658 78.0209 63.585C85.8125 56.2042 95.198 52.5161 106.177 52.5208C117.156 52.5208 126.601 56.2112 134.51 63.5921C142.42 70.9729 146.375 80.0325 146.375 90.7708C146.375 91.8333 146.052 92.6904 145.405 93.3421C144.758 93.9937 143.901 94.3172 142.833 94.3125C141.889 94.3125 141.063 93.989 140.354 93.3421C139.646 92.6951 139.292 91.8381 139.292 90.7708C139.292 81.9167 136.014 74.5099 129.46 68.5504C122.906 62.591 115.145 59.6089 106.177 59.6042C97.2049 59.6042 89.503 62.5862 83.0713 68.5504C76.6396 74.5146 73.4214 81.9214 73.4167 90.7708C73.4167 100.333 75.0695 108.451 78.375 115.123C81.6806 121.796 86.5209 128.494 92.8959 135.219C93.6042 135.927 93.9584 136.753 93.9584 137.698C93.9584 138.642 93.6042 139.469 92.8959 140.177C92.1875 140.885 91.3612 141.24 90.4167 141.24C89.4723 141.24 88.6459 140.885 87.9375 140.177ZM141.417 128.135C130.91 128.135 121.789 124.594 114.054 117.51C106.319 110.427 102.454 101.514 102.458 90.7708C102.458 89.8264 102.784 89 103.436 88.2917C104.088 87.5833 104.942 87.2292 106 87.2292C107.063 87.2292 107.92 87.5833 108.571 88.2917C109.223 89 109.546 89.8264 109.542 90.7708C109.542 99.625 112.729 106.885 119.104 112.552C125.479 118.219 132.917 121.052 141.417 121.052C142.125 121.052 143.129 120.993 144.427 120.875C145.726 120.757 147.083 120.58 148.5 120.344C149.563 120.108 150.479 120.256 151.248 120.79C152.018 121.324 152.519 122.119 152.75 123.177C152.986 124.122 152.809 124.948 152.219 125.656C151.629 126.365 150.861 126.837 149.917 127.073C147.792 127.663 145.934 127.989 144.342 128.05C142.751 128.112 141.776 128.14 141.417 128.135Z"
                                                fill="url(#paint0_linear_0_1)"
                                            />
                                        </g>
                                        <path
                                            className="text-primary-600 dark:text-primary-500"
                                            d="M3 72H209"
                                            stroke="currentColor"
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="paint0_linear_0_1"
                                                x1="106.385"
                                                y1="1.34375"
                                                x2="106"
                                                y2="72"
                                                gradientUnits="userSpaceOnUse">
                                                <stop
                                                    stopColor="white"
                                                    stopOpacity="0"
                                                />
                                                <stop
                                                    className="text-primary-600 dark:text-primary-500"
                                                    offset="1"
                                                    stopColor="currentColor"
                                                />
                                            </linearGradient>
                                            <clipPath id="clip0_0_1">
                                                <rect
                                                    width="129"
                                                    height="72"
                                                    fill="white"
                                                    transform="translate(41)"
                                                />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="relative z-10 mt-6 space-y-2 text-center">
                                    <h2 className="group-hover:text-secondary-950 text-lg font-medium transition dark:text-white">Secure by default</h2>
                                    <p className="text-foreground">Provident fugit and vero voluptate. magnam magni doloribus dolores voluptates a sapiente nisi.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
                            <CardContent className="pt-6">
                                <div className="pt-6 lg:px-6">
                                    <svg
                                        className="dark:text-muted-foreground w-full"
                                        viewBox="0 0 386 123"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <rect
                                            width="386"
                                            height="123"
                                            rx="10"
                                        />
                                        <g clipPath="url(#clip0_0_106)">
                                            <circle
                                                className="text-muted-foreground dark:text-muted"
                                                cx="29"
                                                cy="29"
                                                r="15"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M29 23V35"
                                                stroke="white"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M35 29L29 35L23 29"
                                                stroke="white"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M55.2373 32H58.7988C61.7383 32 63.4404 30.1816 63.4404 27.0508V27.0371C63.4404 23.9404 61.7246 22.1357 58.7988 22.1357H55.2373V32ZM56.7686 30.6807V23.4551H58.6279C60.6719 23.4551 61.8818 24.7881 61.8818 27.0576V27.0713C61.8818 29.3613 60.6924 30.6807 58.6279 30.6807H56.7686ZM69.4922 32.1436C71.666 32.1436 72.999 30.6875 72.999 28.2949V28.2812C72.999 25.8887 71.6592 24.4326 69.4922 24.4326C67.3184 24.4326 65.9785 25.8955 65.9785 28.2812V28.2949C65.9785 30.6875 67.3115 32.1436 69.4922 32.1436ZM69.4922 30.9062C68.2139 30.9062 67.4961 29.9424 67.4961 28.2949V28.2812C67.4961 26.6338 68.2139 25.6699 69.4922 25.6699C70.7637 25.6699 71.4883 26.6338 71.4883 28.2812V28.2949C71.4883 29.9355 70.7637 30.9062 69.4922 30.9062ZM76.9111 32H78.4219L79.9531 26.4629H80.0693L81.6074 32H83.1318L85.1758 24.5762H83.7061L82.3799 30.3047H82.2637L80.7324 24.5762H79.3242L77.793 30.3047H77.6836L76.3506 24.5762H74.8604L76.9111 32ZM87.6934 32H89.1768V27.6455C89.1768 26.4492 89.8535 25.7041 90.9404 25.7041C92.0273 25.7041 92.54 26.3125 92.54 27.543V32H94.0166V27.1943C94.0166 25.4238 93.1006 24.4326 91.4395 24.4326C90.3594 24.4326 89.6484 24.9111 89.2861 25.7041H89.1768V24.5762H87.6934V32ZM97.1562 32H98.6396V21.6641H97.1562V32ZM104.992 32.1436C107.166 32.1436 108.499 30.6875 108.499 28.2949V28.2812C108.499 25.8887 107.159 24.4326 104.992 24.4326C102.818 24.4326 101.479 25.8955 101.479 28.2812V28.2949C101.479 30.6875 102.812 32.1436 104.992 32.1436ZM104.992 30.9062C103.714 30.9062 102.996 29.9424 102.996 28.2949V28.2812C102.996 26.6338 103.714 25.6699 104.992 25.6699C106.264 25.6699 106.988 26.6338 106.988 28.2812V28.2949C106.988 29.9355 106.264 30.9062 104.992 30.9062ZM113.307 32.123C114.291 32.123 115.07 31.6992 115.508 30.9473H115.624V32H117.094V26.9209C117.094 25.3623 116.041 24.4326 114.175 24.4326C112.486 24.4326 111.317 25.2461 111.14 26.4629L111.133 26.5107H112.562L112.568 26.4834C112.746 25.957 113.286 25.6562 114.106 25.6562C115.111 25.6562 115.624 26.1074 115.624 26.9209V27.5771L113.614 27.6934C111.844 27.8027 110.846 28.5752 110.846 29.9014V29.915C110.846 31.2617 111.892 32.123 113.307 32.123ZM112.322 29.8535V29.8398C112.322 29.1699 112.787 28.8008 113.812 28.7393L115.624 28.623V29.2588C115.624 30.2158 114.811 30.9404 113.703 30.9404C112.903 30.9404 112.322 30.5371 112.322 29.8535ZM122.893 32.123C123.932 32.123 124.745 31.6445 125.176 30.8311H125.292V32H126.769V21.6641H125.292V25.752H125.176C124.779 24.9521 123.911 24.4463 122.893 24.4463C121.006 24.4463 119.816 25.9297 119.816 28.2812V28.2949C119.816 30.626 121.026 32.123 122.893 32.123ZM123.316 30.8584C122.072 30.8584 121.327 29.8877 121.327 28.2949V28.2812C121.327 26.6885 122.072 25.7178 123.316 25.7178C124.547 25.7178 125.312 26.6953 125.312 28.2812V28.2949C125.312 29.8809 124.554 30.8584 123.316 30.8584Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M268.324 34H269.906V21.3174H268.333L264.958 23.7432V25.4131L268.184 23.0752H268.324V34ZM280.363 34H281.91V31.3721H283.712V29.957H281.91V21.3174H279.616C277.841 23.9629 275.898 27.0566 274.185 29.9307V31.3721H280.363V34ZM275.802 29.9658V29.8604C277.182 27.5312 278.843 24.9121 280.267 22.7852H280.372V29.9658H275.802ZM286.162 37.2256H287.296L288.676 32.2246H286.927L286.162 37.2256ZM296.672 34.2109C299.212 34.2109 301.075 32.6465 301.075 30.5283V30.5107C301.075 28.709 299.818 27.5576 297.973 27.3994V27.3643C299.555 27.0303 300.662 25.958 300.662 24.3936V24.376C300.662 22.4512 299.071 21.1064 296.654 21.1064C294.281 21.1064 292.646 22.4863 292.444 24.5518L292.436 24.6396H293.956L293.965 24.5518C294.097 23.2686 295.16 22.4775 296.654 22.4775C298.201 22.4775 299.071 23.2422 299.071 24.5693V24.5869C299.071 25.8525 298.017 26.7842 296.505 26.7842H294.984V28.1201H296.575C298.351 28.1201 299.467 28.9902 299.467 30.5459V30.5635C299.467 31.9082 298.333 32.8398 296.672 32.8398C294.984 32.8398 293.833 31.9785 293.71 30.7305L293.701 30.6426H292.181L292.189 30.748C292.356 32.752 294.053 34.2109 296.672 34.2109ZM310.434 34H311.98V31.3721H313.782V29.957H311.98V21.3174H309.687C307.911 23.9629 305.969 27.0566 304.255 29.9307V31.3721H310.434V34ZM305.872 29.9658V29.8604C307.252 27.5312 308.913 24.9121 310.337 22.7852H310.442V29.9658H305.872ZM323.297 34H324.826V28.1289C324.826 26.793 325.767 25.7119 327.006 25.7119C328.201 25.7119 328.975 26.4414 328.975 27.5664V34H330.504V27.9092C330.504 26.7051 331.374 25.7119 332.692 25.7119C334.028 25.7119 334.67 26.4062 334.67 27.8037V34H336.199V27.4521C336.199 25.4658 335.118 24.3584 333.185 24.3584C331.875 24.3584 330.794 25.0176 330.284 26.0195H330.144C329.704 25.0352 328.808 24.3584 327.524 24.3584C326.285 24.3584 325.389 24.9473 324.967 25.9668H324.826V24.5254H323.297V34ZM344.67 34.167C347.069 34.167 348.643 32.2246 348.643 29.2715V29.2539C348.643 26.2832 347.078 24.3584 344.67 24.3584C343.369 24.3584 342.235 25.0088 341.717 26.0195H341.576V20.7637H340.047V34H341.576V32.4883H341.717C342.297 33.543 343.352 34.167 344.67 34.167ZM344.318 32.8135C342.596 32.8135 341.541 31.46 341.541 29.2715V29.2539C341.541 27.0654 342.596 25.7119 344.318 25.7119C346.05 25.7119 347.078 27.0479 347.078 29.2539V29.2715C347.078 31.4775 346.05 32.8135 344.318 32.8135ZM352.016 37.1641H353.545V32.5059H353.686C354.204 33.5166 355.338 34.167 356.639 34.167C359.047 34.167 360.611 32.2422 360.611 29.2715V29.2539C360.611 26.3008 359.038 24.3584 356.639 24.3584C355.32 24.3584 354.266 24.9824 353.686 26.0371H353.545V24.5254H352.016V37.1641ZM356.287 32.8135C354.564 32.8135 353.51 31.46 353.51 29.2715V29.2539C353.51 27.0654 354.564 25.7119 356.287 25.7119C358.019 25.7119 359.047 27.0479 359.047 29.2539V29.2715C359.047 31.4775 358.019 32.8135 356.287 32.8135ZM367.254 34.167C369.407 34.167 371.051 32.998 371.051 31.3105V31.293C371.051 29.9395 370.189 29.166 368.405 28.7354L366.946 28.3838C365.83 28.1113 365.355 27.707 365.355 27.0654V27.0479C365.355 26.2129 366.182 25.6328 367.307 25.6328C368.449 25.6328 369.188 26.1514 369.39 26.8984H370.893C370.682 25.3516 369.302 24.3584 367.315 24.3584C365.303 24.3584 363.791 25.5449 363.791 27.1182V27.127C363.791 28.4893 364.591 29.2627 366.366 29.6846L367.834 30.0361C369.003 30.3174 369.486 30.7656 369.486 31.4072V31.4248C369.486 32.2861 368.581 32.8926 367.307 32.8926C366.094 32.8926 365.338 32.374 365.083 31.583H363.519C363.694 33.1475 365.145 34.167 367.254 34.167Z"
                                                fill="currentColor"
                                            />
                                        </g>
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M3 123C3 123 14.3298 94.153 35.1282 88.0957C55.9266 82.0384 65.9333 80.5508 65.9333 80.5508C65.9333 80.5508 80.699 80.5508 92.1777 80.5508C103.656 80.5508 100.887 63.5348 109.06 63.5348C117.233 63.5348 117.217 91.9728 124.78 91.9728C132.343 91.9728 142.264 78.03 153.831 80.5508C165.398 83.0716 186.825 91.9728 193.761 91.9728C200.697 91.9728 206.296 63.5348 214.07 63.5348C221.844 63.5348 238.653 93.7771 244.234 91.9728C249.814 90.1684 258.8 60 266.19 60C272.075 60 284.1 88.057 286.678 88.0957C294.762 88.2171 300.192 72.9284 305.423 72.9284C312.323 72.9284 323.377 65.2437 335.553 63.5348C347.729 61.8259 348.218 82.07 363.639 80.5508C367.875 80.1335 372.949 82.2017 376.437 87.1008C379.446 91.3274 381.054 97.4325 382.521 104.647C383.479 109.364 382.521 123 382.521 123"
                                            fill="url(#paint0_linear_0_106)"
                                        />
                                        <path
                                            className="text-primary-600 dark:text-primary-500"
                                            d="M3 121.077C3 121.077 15.3041 93.6691 36.0195 87.756C56.7349 81.8429 66.6632 80.9723 66.6632 80.9723C66.6632 80.9723 80.0327 80.9723 91.4656 80.9723C102.898 80.9723 100.415 64.2824 108.556 64.2824C116.696 64.2824 117.693 92.1332 125.226 92.1332C132.759 92.1332 142.07 78.5115 153.591 80.9723C165.113 83.433 186.092 92.1332 193 92.1332C199.908 92.1332 205.274 64.2824 213.017 64.2824C220.76 64.2824 237.832 93.8946 243.39 92.1332C248.948 90.3718 257.923 60.5 265.284 60.5C271.145 60.5 283.204 87.7182 285.772 87.756C293.823 87.8746 299.2 73.0802 304.411 73.0802C311.283 73.0802 321.425 65.9506 333.552 64.2824C345.68 62.6141 346.91 82.4553 362.27 80.9723C377.629 79.4892 383 106.605 383 106.605"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="paint0_linear_0_106"
                                                x1="3"
                                                y1="60"
                                                x2="3"
                                                y2="123"
                                                gradientUnits="userSpaceOnUse">
                                                <stop
                                                    className="text-primary/15 dark:text-primary/35"
                                                    stopColor="currentColor"
                                                />
                                                <stop
                                                    className="text-transparent"
                                                    offset="1"
                                                    stopColor="currentColor"
                                                    stopOpacity="0.103775"
                                                />
                                            </linearGradient>
                                            <clipPath id="clip0_0_106">
                                                <rect
                                                    width="358"
                                                    height="30"
                                                    fill="white"
                                                    transform="translate(14 14)"
                                                />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="relative z-10 mt-14 space-y-2 text-center">
                                    <h2 className="text-lg font-medium transition">Faster than light</h2>
                                    <p className="text-foreground">Provident fugit vero voluptate. magnam magni doloribus dolores voluptates inventore nisi.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="card variant-outlined relative col-span-full overflow-hidden lg:col-span-3">
                            <CardContent className="grid pt-6 sm:grid-cols-2">
                                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                                    <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                        <Shield
                                            className="m-auto size-5"
                                            strokeWidth={1}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="group-hover:text-secondary-950 text-lg font-medium text-zinc-800 transition dark:text-white">Faster than light</h2>
                                        <p className="text-foreground">Provident fugit vero voluptate. Voluptates a sapiente inventore nisi.</p>
                                    </div>
                                </div>
                                <div className="rounded-tl-(--radius) relative -mb-6 -mr-6 mt-6 h-fit border-l border-t p-6 py-6 sm:ml-6">
                                    <div className="absolute left-3 top-2 flex gap-1">
                                        <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                                        <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                                        <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                                    </div>
                                    <svg
                                        className="w-full sm:w-[150%]"
                                        viewBox="0 0 366 231"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M0.148438 231V179.394L1.92188 180.322L2.94482 177.73L4.05663 183.933L6.77197 178.991L7.42505 184.284L9.42944 187.985L11.1128 191.306V155.455L13.6438 153.03V145.122L14.2197 142.829V150.454V154.842L15.5923 160.829L17.0793 172.215H19.2031V158.182L20.7441 153.03L22.426 148.111V142.407L24.7471 146.86V128.414L26.7725 129.918V120.916L28.1492 118.521L28.4653 127.438L29.1801 123.822L31.0426 120.525V130.26L32.3559 134.71L34.406 145.122V137.548L35.8982 130.26L37.1871 126.049L38.6578 134.71L40.659 138.977V130.26V126.049L43.7557 130.26V123.822L45.972 112.407L47.3391 103.407V92.4726L49.2133 98.4651V106.053L52.5797 89.7556L54.4559 82.7747L56.1181 87.9656L58.9383 89.7556V98.4651L60.7617 103.407L62.0545 123.822L63.8789 118.066L65.631 122.082L68.5479 114.229L70.299 109.729L71.8899 118.066L73.5785 123.822V130.26L74.9446 134.861L76.9243 127.87L78.352 134.71V138.977L80.0787 142.407V152.613L83.0415 142.407V130.26L86.791 123.822L89.0121 116.645V122.082L90.6059 127.87L92.3541 131.77L93.7104 123.822L95.4635 118.066L96.7553 122.082V137.548L99.7094 140.988V131.77L101.711 120.525L103.036 116.645V133.348L104.893 136.218L106.951 140.988L108.933 134.71L110.797 130.26L112.856 140.988V148.111L115.711 152.613L117.941 145.122L119.999 140.988V148.111L123.4 152.613L125.401 158.182L130.547 150.454V156.566L131.578 155.455L134.143 158.182L135.594 168.136L138.329 158.182L140.612 160.829L144.681 169.5L147.011 155.455L148.478 151.787L151.02 152.613L154.886 145.122L158 143.412L159.406 140.637L159.496 133.348L162.295 127.87V122.082L163.855 116.645V109.729L164.83 104.407L166.894 109.729L176.249 98.4651L178.254 106.169L180.77 98.4651V81.045L182.906 69.1641L184.8 56.8669L186.477 62.8428L187.848 79.7483L188.849 106.169L191.351 79.7483L193.485 75.645V98.4651L196.622 94.4523L198.623 87.4228V79.7483L200.717 75.645L202.276 81.045V89.3966L203.638 113.023L205.334 99.8037L207.164 94.4523L208.982 98.4651V102.176L211.267 107.64L212.788 81.045L214.437 66.0083L216.19 62.8428L217.941 56.8669V73.676V79.7483L220.28 75.645L222.516 66.0083V73.676H226.174V84.8662L228.566 98.4651L230.316 75.645L233.61 94.4523V104.25L236.882 102.176L239.543 113.023L241.057 98.4651L243.604 94.4523L244.975 106.169L245.975 87.4228L247.272 89.3966L250.732 84.8662L251.733 96.7549L254.644 94.4523L257.452 99.8037L259.853 91.3111L261.193 84.8662L264.162 75.645L265.808 87.4228L267.247 58.4895L269.757 66.0083L276.625 13.5146L273.33 58.4895L276.25 67.6563L282.377 20.1968L281.37 58.4895V66.0083L283.579 75.645L286.033 56.8669L287.436 73.676L290.628 77.6636L292.414 84.8662L294.214 61.3904L296.215 18.9623L300.826 0.947876L297.531 56.8669L299.973 62.8428L305.548 22.0598L299.755 114.956L301.907 105.378L304.192 112.688V94.9932L308.009 80.0829L310.003 94.9932L311.004 102.127L312.386 105.378L315.007 112.688L316.853 98.004L318.895 105.378L321.257 94.9932L324.349 100.81L325.032 80.0829L327.604 61.5733L329.308 82.3223L333.525 52.7986L334.097 52.145L334.735 55.6812L337.369 59.8108V73.676L340.743 87.9656L343.843 96.3728L348.594 82.7747L349.607 81.045L351 89.7556L352.611 96.3728L355.149 94.9932L356.688 102.176L359.396 108.784L360.684 111.757L365 95.7607V231H148.478H0.148438Z"
                                            fill="url(#paint0_linear_0_705)"
                                        />
                                        <path
                                            className="text-primary-600 dark:text-primary-500"
                                            d="M1 179.796L4.05663 172.195V183.933L7.20122 174.398L8.45592 183.933L10.0546 186.948V155.455L12.6353 152.613V145.122L15.3021 134.71V149.804V155.455L16.6916 160.829L18.1222 172.195V158.182L19.8001 152.613L21.4105 148.111V137.548L23.6863 142.407V126.049L25.7658 127.87V120.525L27.2755 118.066L29.1801 112.407V123.822L31.0426 120.525V130.26L32.3559 134.71L34.406 145.122V137.548L35.8982 130.26L37.1871 126.049L38.6578 134.71L40.659 138.977V130.26V126.049L43.7557 130.26V123.822L45.972 112.407L47.3391 103.407V92.4726L49.2133 98.4651V106.053L52.5797 89.7556L54.4559 82.7747L56.1181 87.9656L58.9383 89.7556V98.4651L60.7617 103.407L62.0545 123.822L63.8789 118.066L65.631 122.082L68.5479 114.229L70.299 109.729L71.8899 118.066L73.5785 123.822V130.26L74.9446 134.861L76.9243 127.87L78.352 134.71V138.977L80.0787 142.407V152.613L83.0415 142.407V130.26L86.791 123.822L89.0121 116.645V122.082L90.6059 127.87L92.3541 131.77L93.7104 123.822L95.4635 118.066L96.7553 122.082V137.548L99.7094 140.988V131.77L101.711 120.525L103.036 116.645V133.348L104.893 136.218L106.951 140.988L108.933 134.71L110.797 130.26L112.856 140.988V148.111L115.711 152.613L117.941 145.122L119.999 140.988L121.501 148.111L123.4 152.613L125.401 158.182L127.992 152.613L131.578 146.76V155.455L134.143 158.182L135.818 164.629L138.329 158.182L140.612 160.829L144.117 166.757L146.118 155.455L147.823 149.804L151.02 152.613L154.886 145.122L158.496 140.988V133.348L161.295 127.87V122.082L162.855 116.645V109.729L164.83 103.407L166.894 109.729L176.249 98.4651L178.254 106.169L180.77 98.4651V81.045L182.906 69.1641L184.8 56.8669L186.477 62.8428L187.848 79.7483L188.849 106.169L191.351 79.7483L193.485 75.645V98.4651L196.622 94.4523L198.623 87.4228V79.7483L200.717 75.645L202.276 81.045V89.3966L203.638 113.023L205.334 99.8037L207.164 94.4523L208.982 98.4651V102.176L211.267 107.64L212.788 81.045L214.437 66.0083L216.19 62.8428L217.941 56.8669V73.676V79.7483L220.28 75.645L222.516 66.0083V73.676H226.174V84.8662L228.566 98.4651L230.316 75.645L233.61 94.4523V104.25L236.882 102.176L239.543 113.023L241.057 98.4651L243.604 94.4523L244.975 106.169L245.975 87.4228L247.272 89.3966L250.732 84.8662L251.733 96.7549L254.644 94.4523L257.452 99.8037L259.853 91.3111L261.193 84.8662L264.162 75.645L265.808 87.4228L267.247 58.4895L269.757 66.0083L276.625 13.5146L273.33 58.4895L276.25 67.6563L282.377 20.1968L281.37 58.4895V66.0083L283.579 75.645L286.033 56.8669L287.436 73.676L290.628 77.6636L292.414 84.8662L294.214 61.3904L296.215 18.9623L300.826 0.947876L297.531 56.8669L299.973 62.8428L305.548 22.0598L299.755 114.956L301.907 105.378L304.192 112.688V94.9932L308.009 80.0829L310.003 94.9932L311.004 102.127L312.386 105.378L315.007 112.688L316.853 98.004L318.895 105.378L321.257 94.9932L324.349 100.81L325.032 80.0829L327.604 61.5733L329.357 74.9864L332.611 52.6565L334.352 48.5552L335.785 55.2637L338.377 59.5888V73.426L341.699 87.5181L343.843 93.4347L347.714 82.1171L350.229 78.6821L351.974 89.7556L353.323 94.9932L355.821 93.4347L357.799 102.127L360.684 108.794L363.219 98.004L365 89.7556"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="paint0_linear_0_705"
                                                x1="0.85108"
                                                y1="0.947876"
                                                x2="0.85108"
                                                y2="230.114"
                                                gradientUnits="userSpaceOnUse">
                                                <stop
                                                    className="text-primary/15 dark:text-primary/35"
                                                    stopColor="currentColor"
                                                />
                                                <stop
                                                    className="text-transparent"
                                                    offset="1"
                                                    stopColor="currentColor"
                                                    stopOpacity="0.01"
                                                />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="card variant-outlined relative col-span-full overflow-hidden lg:col-span-3">
                            <CardContent className="grid h-full pt-6 sm:grid-cols-2">
                                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                                    <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                        <Users
                                            className="m-auto size-6"
                                            strokeWidth={1}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-lg font-medium transition">Keep your loved ones safe</h2>
                                        <p className="text-foreground">Voluptate. magnam magni doloribus dolores voluptates a sapiente inventore nisi.</p>
                                    </div>
                                </div>
                                <div className="before:bg-(--color-border) relative mt-6 before:absolute before:inset-0 before:mx-auto before:w-px sm:-my-6 sm:-mr-6">
                                    <div className="relative flex h-full flex-col justify-center space-y-6 py-6">
                                        <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                                            <span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm">Likeur</span>
                                            <div className="ring-background size-7 ring-4">
                                                <img
                                                    className="size-full rounded-full"
                                                    src="https://avatars.githubusercontent.com/u/102558960?v=4"
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="relative ml-[calc(50%-1rem)] flex items-center gap-2">
                                            <div className="ring-background size-8 ring-4">
                                                <img
                                                    className="size-full rounded-full"
                                                    src="https://avatars.githubusercontent.com/u/47919550?v=4"
                                                    alt=""
                                                />
                                            </div>
                                            <span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm">M. Irung</span>
                                        </div>
                                        <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                                            <span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm">B. Ng</span>
                                            <div className="ring-background size-7 ring-4">
                                                <img
                                                    className="size-full rounded-full"
                                                    src="https://avatars.githubusercontent.com/u/31113941?v=4"
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## Features Block 10 (features-10)
- Source: https://tailark.com/r/features-10.json
- Description: Shadcn/ui website features block with cards and circular UI elements
- Registry dependencies: card
```tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Calendar, LucideIcon, MapIcon } from 'lucide-react'
import Image from 'next/image'
import { ReactNode } from 'react'

export default function Features() {
    return (
        <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-5xl">
                <div className="mx-auto grid gap-4 lg:grid-cols-2">
                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={MapIcon}
                                title="Real time location tracking"
                                description="Advanced tracking system, Instantly locate all your assets."
                            />
                        </CardHeader>

                        <div className="relative border-t border-dashed max-sm:mb-6">
                            <div
                                aria-hidden
                                className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,var(--color-blue-600),var(--color-white)_100%)]"
                            />
                            <div className="aspect-76/59 p-1 px-6">
                                <DualModeImage
                                    darkSrc="/payments.png"
                                    lightSrc="/payments-light.png"
                                    alt="payments illustration"
                                    width={1207}
                                    height={929}
                                />
                            </div>
                        </div>
                    </FeatureCard>

                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={Calendar}
                                title="Advanced Scheduling"
                                description="Scheduling system, Instantly locate all your assets."
                            />
                        </CardHeader>

                        <CardContent>
                            <div className="mask-radial-at-right mask-radial-from-75% mask-radial-[75%_75%] relative max-sm:mb-6">
                                <div className="aspect-76/59 overflow-hidden rounded-lg border">
                                    <DualModeImage
                                        darkSrc="/origin-cal-dark.png"
                                        lightSrc="/origin-cal.png"
                                        alt="calendar illustration"
                                        width={1207}
                                        height={929}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </FeatureCard>

                    <FeatureCard className="p-6 lg:col-span-2">
                        <p className="mx-auto my-6 max-w-md text-balance text-center text-2xl font-semibold">Smart scheduling with automated reminders for maintenance.</p>

                        <div className="flex justify-center gap-6 overflow-hidden">
                            <CircularUI
                                label="Inclusion"
                                circles={[{ pattern: 'border' }, { pattern: 'border' }]}
                            />

                            <CircularUI
                                label="Inclusion"
                                circles={[{ pattern: 'none' }, { pattern: 'primary' }]}
                            />

                            <CircularUI
                                label="Join"
                                circles={[{ pattern: 'blue' }, { pattern: 'none' }]}
                            />

                            <CircularUI
                                label="Exclusion"
                                circles={[{ pattern: 'primary' }, { pattern: 'none' }]}
                                className="hidden sm:block"
                            />
                        </div>
                    </FeatureCard>
                </div>
            </div>
        </section>
    )
}

interface FeatureCardProps {
    children: ReactNode
    className?: string
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
    <Card className={cn('group relative rounded-none shadow-zinc-950/5', className)}>
        <CardDecorator />
        {children}
    </Card>
)

const CardDecorator = () => (
    <>
        <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2"></span>
        <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2"></span>
        <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2"></span>
        <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2"></span>
    </>
)

interface CardHeadingProps {
    icon: LucideIcon
    title: string
    description: string
}

const CardHeading = ({ icon: Icon, title, description }: CardHeadingProps) => (
    <div className="p-6">
        <span className="text-muted-foreground flex items-center gap-2">
            <Icon className="size-4" />
            {title}
        </span>
        <p className="mt-8 text-2xl font-semibold">{description}</p>
    </div>
)

interface DualModeImageProps {
    darkSrc: string
    lightSrc: string
    alt: string
    width: number
    height: number
    className?: string
}

const DualModeImage = ({ darkSrc, lightSrc, alt, width, height, className }: DualModeImageProps) => (
    <>
        <Image
            src={darkSrc}
            className={cn('hidden dark:block', className)}
            alt={`${alt} dark`}
            width={width}
            height={height}
        />
        <Image
            src={lightSrc}
            className={cn('shadow dark:hidden', className)}
            alt={`${alt} light`}
            width={width}
            height={height}
        />
    </>
)

interface CircleConfig {
    pattern: 'none' | 'border' | 'primary' | 'blue'
}

interface CircularUIProps {
    label: string
    circles: CircleConfig[]
    className?: string
}

const CircularUI = ({ label, circles, className }: CircularUIProps) => (
    <div className={className}>
        <div className="bg-linear-to-b from-border size-fit rounded-2xl to-transparent p-px">
            <div className="bg-linear-to-b from-background to-muted/25 relative flex aspect-square w-fit items-center -space-x-4 rounded-[15px] p-4">
                {circles.map((circle, i) => (
                    <div
                        key={i}
                        className={cn('size-7 rounded-full border sm:size-8', {
                            'border-primary': circle.pattern === 'none',
                            'border-primary bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'border',
                            'border-primary bg-background bg-[repeating-linear-gradient(-45deg,var(--color-primary),var(--color-primary)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'primary',
                            'bg-background z-1 border-blue-500 bg-[repeating-linear-gradient(-45deg,var(--color-blue-500),var(--color-blue-500)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'blue',
                        })}></div>
                ))}
            </div>
        </div>
        <span className="text-muted-foreground mt-1.5 block text-center text-sm">{label}</span>
    </div>
)

```

## Features Block 11 (features-11)
- Source: https://tailark.com/r/features-11.json
- Description: Shadcn/ui website features block with grid layout and images
- Registry dependencies: card
```tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Globe } from 'lucide-react'
import Image from 'next/image'

export default function Features() {
    return (
        <section className="dark:bg-muted/25 bg-zinc-50 py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto grid gap-2 sm:grid-cols-5">
                    <Card className="group overflow-hidden shadow-zinc-950/5 sm:col-span-3 sm:rounded-none sm:rounded-tl-xl">
                        <CardHeader>
                            <div className="md:p-6">
                                <p className="font-medium">Advanced tracking system</p>
                                <p className="text-muted-foreground mt-3 max-w-sm text-sm">Quick AI lives a single hotkey away - ready to quickly appear as a floating window above your other apps..</p>
                            </div>
                        </CardHeader>

                        <div className="mask-b-from-75% mask-b-to-95% relative h-fit pl-6 md:pl-12">
                            <div className="bg-background overflow-hidden rounded-tl-lg border-l border-t pl-2 pt-2 dark:bg-zinc-950">
                                <Image
                                    src="/mail2.png"
                                    className="hidden dark:block"
                                    alt="payments illustration dark"
                                    width={1207}
                                    height={929}
                                />
                                <Image
                                    src="/mail2-light.png"
                                    className="shadow dark:hidden"
                                    alt="payments illustration light"
                                    width={1207}
                                    height={929}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="group overflow-hidden shadow-zinc-950/5 sm:col-span-2 sm:rounded-none sm:rounded-tr-xl">
                        <p className="mx-auto my-6 max-w-md text-balance px-6 text-center text-lg font-semibold sm:text-2xl md:p-6">Advanced UX, Instantly locate all your assets.</p>

                        <CardContent className="mt-auto h-fit">
                            <div className="mask-radial-at-right mask-radial-from-75% mask-radial-[75%_75%] relative max-sm:mb-6">
                                <div className="aspect-76/59 overflow-hidden rounded-r-lg border">
                                    <Image
                                        src="/origin-cal-dark.png"
                                        className="hidden dark:block"
                                        alt="payments illustration dark"
                                        width={1207}
                                        height={929}
                                    />
                                    <Image
                                        src="/origin-cal.png"
                                        className="shadow dark:hidden"
                                        alt="payments illustration light"
                                        width={1207}
                                        height={929}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="group p-6 shadow-zinc-950/5 sm:col-span-2 sm:rounded-none sm:rounded-bl-xl md:p-12">
                        <p className="mx-auto mb-12 max-w-md text-balance text-center text-lg font-semibold sm:text-2xl">Advanced UX, Instantly locate all your assets.</p>

                        <div className="flex justify-center gap-6">
                            <div className="inset-shadow-sm dark:inset-shadow-white/5 bg-muted/35 relative flex aspect-square size-16 items-center rounded-[7px] border p-3 shadow-lg ring dark:shadow-white/5 dark:ring-black">
                                <span className="absolute right-2 top-1 block text-sm">fn</span>
                                <Globe className="mt-auto size-4" />
                            </div>
                            <div className="inset-shadow-sm dark:inset-shadow-white/5 bg-muted/35 flex aspect-square size-16 items-center justify-center rounded-[7px] border p-3 shadow-lg ring dark:shadow-white/5 dark:ring-black">
                                <span>K</span>
                            </div>
                        </div>
                    </Card>
                    <Card className="group relative shadow-zinc-950/5 sm:col-span-3 sm:rounded-none sm:rounded-br-xl">
                        <CardHeader className="p-6 md:p-12">
                            <p className="font-medium">Advanced tracking system</p>
                            <p className="text-muted-foreground mt-2 max-w-sm text-sm">Quick AI lives a single hotkey away apps..</p>
                        </CardHeader>
                        <CardContent className="relative h-fit px-6 pb-6 md:px-12 md:pb-12">
                            <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
                                <div className="rounded-(--radius) aspect-square border border-dashed"></div>
                                <div className="rounded-(--radius) bg-muted/50 flex aspect-square items-center justify-center border p-4">
                                    <img
                                        className="m-auto size-8 invert dark:invert-0"
                                        src="https://oxymor-ns.tailus.io/logos/linear.svg"
                                        alt="Linear logo"
                                        width="32"
                                        height="32"
                                    />
                                </div>
                                <div className="rounded-(--radius) aspect-square border border-dashed"></div>
                                <div className="rounded-(--radius) bg-muted/50 flex aspect-square items-center justify-center border p-4">
                                    <img
                                        className="m-auto size-8 invert dark:invert-0"
                                        src="https://oxymor-ns.tailus.io/logos/netlify.svg"
                                        alt="Netlify logo"
                                        width="32"
                                        height="32"
                                    />
                                </div>
                                <div className="rounded-(--radius) aspect-square border border-dashed"></div>
                                <div className="rounded-(--radius) bg-muted/50 flex aspect-square items-center justify-center border p-4">
                                    <img
                                        className="m-auto size-8 invert dark:invert-0"
                                        src="https://oxymor-ns.tailus.io/logos/github.svg"
                                        alt="github logo"
                                        width="32"
                                        height="32"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

```

## Features Block 12 (features-12)
- Source: https://tailark.com/r/features-12.json
- Description: Shadcn/ui website features block with accordion and animated images
- Registry dependencies: accordion, https://magicui.design/r/border-beam
```tsx
'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ChartBarIncreasingIcon, Database, Fingerprint, IdCard } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BorderBeam } from '@tailark/core/magicui/border-beam'

export default function Features() {
    type ImageKey = 'item-1' | 'item-2' | 'item-3' | 'item-4'
    const [activeItem, setActiveItem] = useState<ImageKey>('item-1')

    const images = {
        'item-1': {
            image: '/charts.png',
            alt: 'Database visualization',
        },
        'item-2': {
            image: '/music.png',
            alt: 'Security authentication',
        },
        'item-3': {
            image: '/mail2.png',
            alt: 'Identity management',
        },
        'item-4': {
            image: '/payments.png',
            alt: 'Analytics dashboard',
        },
    }

    return (
        <section className="py-12 md:py-20 lg:py-32">
            <div className="bg-linear-to-b absolute inset-0 -z-10 sm:inset-6 sm:rounded-b-3xl dark:block dark:to-[color-mix(in_oklab,var(--color-zinc-900)_75%,var(--color-background))]"></div>
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 lg:space-y-20 dark:[--color-border:color-mix(in_oklab,var(--color-white)_10%,transparent)]">
                <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-6xl">The foundation for AI</h2>
                    <p>Lyra is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</p>
                </div>

                <div className="grid gap-12 sm:px-12 md:grid-cols-2 lg:gap-20 lg:px-0">
                    <Accordion
                        type="single"
                        value={activeItem}
                        onValueChange={(value) => setActiveItem(value as ImageKey)}
                        className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <Database className="size-4" />
                                    Database Visualization
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Lyra is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <Fingerprint className="size-4" />
                                    Advanced Authentication
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Lyra is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <IdCard className="size-4" />
                                    Identity Management
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Lyra is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <ChartBarIncreasingIcon className="size-4" />
                                    Analytics Dashboard
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Lyra is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <div className="bg-background relative flex overflow-hidden rounded-3xl border p-2">
                        <div className="w-15 absolute inset-0 right-0 ml-auto border-l bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_8px)]"></div>
                        <div className="aspect-76/59 bg-background relative w-[calc(3/4*100%+3rem)] rounded-2xl">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${activeItem}-id`}
                                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                    className="size-full overflow-hidden rounded-2xl border bg-zinc-900 shadow-md">
                                    <Image
                                        src={images[activeItem].image}
                                        className="size-full object-cover object-left-top dark:mix-blend-lighten"
                                        alt={images[activeItem].alt}
                                        width={1207}
                                        height={929}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <BorderBeam
                            duration={6}
                            size={200}
                            className="from-transparent via-yellow-700 to-transparent dark:via-white/50"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## Hero Section 2 (hero-section-2)
- Source: https://tailark.com/r/hero-section-2.json
- Description: Shadcn/ui website Hero Section
- Registry dependencies: button, https://motion-primitives.com/c/text-effect.json, https://motion-primitives.com/c/animated-group.json
### ../../packages/dusk-kit/blocks/hero-section/two/index.tsx (registry:component) -> components/hero-section.tsx
```tsx
import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { TextEffect } from '@/components/motion-primitives/text-effect'
import { AnimatedGroup } from '@/components/motion-primitives/animated-group'
import { HeroHeader } from './header'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <div
                    aria-hidden
                    className="absolute inset-0 isolate hidden contain-strict lg:block">
                    <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <section>
                    <div className="relative pt-24">
                        <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
                        <div className="mx-auto max-w-5xl px-6">
                            <div className="sm:mx-auto lg:mr-auto lg:mt-0">
                                <TextEffect
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    as="h1"
                                    className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16">
                                    Build and Ship 10x faster with NS
                                </TextEffect>
                                <TextEffect
                                    per="line"
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={0.5}
                                    as="p"
                                    className="mt-8 max-w-2xl text-pretty text-lg">
                                    Tailwindcss highly customizable components for building modern websites and applications that look and feel the way you mean it.
                                </TextEffect>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex items-center gap-2">
                                    <div
                                        key={1}
                                        className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-5 text-base">
                                            <Link href="#link">
                                                <span className="text-nowrap">Start Building</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-10.5 rounded-xl px-5 text-base">
                                        <Link href="#link">
                                            <span className="text-nowrap">Request a demo</span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
                            <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-5xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                                    <Image
                                        className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                                        src="/mail2.png"
                                        alt="app screen"
                                        width="2700"
                                        height="1440"
                                    />
                                    <Image
                                        className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                                        src="/mail2-light.png"
                                        alt="app screen"
                                        width="2700"
                                        height="1440"
                                    />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
                <section className="bg-background pb-16 pt-16 md:pb-32">
                    <div className="group relative m-auto max-w-5xl px-6">
                        <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                            <Link
                                href="/"
                                className="block text-sm duration-150 hover:opacity-75">
                                <span> Meet Our Customers</span>

                                <ChevronRight className="ml-1 inline-block size-3" />
                            </Link>
                        </div>
                        <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                    alt="Nvidia Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/column.svg"
                                    alt="Column Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/github.svg"
                                    alt="GitHub Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/nike.svg"
                                    alt="Nike Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                    alt="Lemon Squeezy Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/laravel.svg"
                                    alt="Laravel Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-7 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/lilly.svg"
                                    alt="Lilly Logo"
                                    height="28"
                                    width="auto"
                                />
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-6 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/openai.svg"
                                    alt="OpenAI Logo"
                                    height="24"
                                    width="auto"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

```
### ../../packages/core/src/components/logo.tsx (registry:component)
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}

```
### ../../packages/dusk-kit/blocks/hero-section/two/header.tsx (registry:component) -> components/header.tsx
```tsx
'use client'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import { useScroll } from 'motion/react'

const menuItems = [
    { name: 'Features', href: '#link' },
    { name: 'Solution', href: '#link' },
    { name: 'Pricing', href: '#link' },
    { name: 'About', href: '#link' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)

    const { scrollYProgress } = useScroll()

    React.useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            setScrolled(latest > 0.05)
        })
        return () => unsubscribe()
    }, [scrollYProgress])

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className={cn('fixed z-20 w-full border-b transition-colors duration-150', scrolled && 'bg-background/50 backdrop-blur-3xl')}>
                <div className="mx-auto max-w-5xl px-6 transition-all duration-300">
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>

                            <div className="hidden lg:block">
                                <ul className="flex gap-8 text-sm">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm">
                                    <Link href="#">
                                        <span>Login</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm">
                                    <Link href="#">
                                        <span>Sign Up</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

```

## Hero Section 7 (hero-section-7)
- Source: https://tailark.com/r/hero-section-7.json
- Description: Shadcn/ui website Hero Section
- Registry dependencies: button
### ../../packages/dusk-kit/blocks/hero-section/seven/index.tsx (registry:component) -> components/hero-section.tsx
```tsx
'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { ArrowRight, Menu, Rocket, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const menuItems = [
    { name: 'Features', href: '#' },
    { name: 'Solution', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'About', href: '#' },
]

export default function HeroSection() {
    const [menuState, setMenuState] = React.useState(false)

    return (
        <>
            <header>
                <nav
                    data-state={menuState && 'active'}
                    className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent">
                    <div className="m-auto max-w-5xl px-6">
                        <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                            <div className="flex w-full justify-between lg:w-auto">
                                <Link
                                    href="/"
                                    aria-label="home"
                                    className="flex items-center space-x-2">
                                    <Logo />
                                </Link>

                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                    className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                    <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                    <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                                </button>
                            </div>

                            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                                <div className="lg:pr-4">
                                    <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                                        {menuItems.map((item, index) => (
                                            <li key={index}>
                                                <Link
                                                    href={item.href}
                                                    className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                    <span>{item.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm">
                                        <Link href="#">
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm">
                                        <Link href="#">
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <main className="overflow-hidden">
                <section className="relative">
                    <div className="relative py-24 lg:py-28">
                        <div className="mx-auto max-w-7xl px-6 md:px-12">
                            <div className="text-center sm:mx-auto sm:w-10/12 lg:mr-auto lg:mt-0 lg:w-4/5">
                                <Link
                                    href="/"
                                    className="rounded-(--radius) mx-auto flex w-fit items-center gap-2 border p-1 pr-3">
                                    <span className="bg-muted rounded-[calc(var(--radius)-0.25rem)] px-2 py-1 text-xs">New</span>
                                    <span className="text-sm">Introduction Tailark Html</span>
                                    <span className="bg-(--color-border) block h-4 w-px"></span>

                                    <ArrowRight className="size-4" />
                                </Link>

                                <h1 className="mt-8 text-4xl font-semibold md:text-5xl xl:text-5xl xl:[line-height:1.125]">
                                    Tame the Wild West <br /> of Frontend Development
                                </h1>
                                <p className="mx-auto mt-8 hidden max-w-2xl text-wrap text-lg sm:block">Tailwindcss highly customizable components for building modern websites and applications that look and feel the way you mean it.</p>
                                <p className="mx-auto mt-6 max-w-2xl text-wrap sm:hidden">Highly customizable components for building modern websites and applications, with your personal spark.</p>

                                <div className="mt-8">
                                    <Button
                                        size="lg"
                                        asChild>
                                        <Link href="#">
                                            <Rocket className="relative size-4" />
                                            <span className="text-nowrap">Start Building</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="x-auto relative mx-auto mt-8 max-w-lg sm:mt-12">
                                <div className="absolute inset-0 -top-8 left-1/2 -z-20 h-56 w-full -translate-x-1/2 [background-image:linear-gradient(to_bottom,transparent_98%,theme(colors.gray.200/75%)_98%),linear-gradient(to_right,transparent_94%,_theme(colors.gray.200/75%)_94%)] [background-size:16px_35px] [mask:radial-gradient(black,transparent_95%)] dark:opacity-10"></div>
                                <div className="absolute inset-x-0 top-12 -z-[1] mx-auto h-1/3 w-2/3 rounded-full bg-blue-300 blur-3xl dark:bg-white/20"></div>

                                <Swiper
                                    slidesPerView={1}
                                    pagination={{ clickable: true }}
                                    loop
                                    autoplay={{ delay: 5000 }}
                                    modules={[Autoplay, EffectCoverflow]}>
                                    <SwiperSlide className="px-2">
                                        <div className="bg-background rounded-(--radius) h-44 max-w-lg border p-9">
                                            <div className="mx-auto h-fit w-full">
                                                <NetlifyLogo />
                                            </div>
                                            <p className="mt-6 text-center text-lg font-medium">30% Increase in revenue</p>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide className="px-2">
                                        <div className="bg-background rounded-(--radius) h-44 max-w-lg border p-9">
                                            <div className="mx-auto h-fit w-full">
                                                <AstroLogo />
                                            </div>
                                            <p className="mt-6 text-center text-lg font-medium">45% Increase in revenue</p>
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide className="px-2">
                                        <div className="bg-background rounded-(--radius) h-44 max-w-lg border p-9">
                                            <div className="mx-auto h-fit w-full">
                                                <WorkOsLogo />
                                            </div>
                                            <p className="mt-6 text-center text-lg font-medium">60% Increase in revenue</p>
                                        </div>
                                    </SwiperSlide>
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

const WorkOsLogo = () => {
    return (
        <svg
            className="m-auto h-8"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 251.8 48">
            <g>
                <path
                    fill="currentColor"
                    className="text-[#29363D] dark:text-white"
                    d="M73,7.2h7l5,20.6c0.9,3.9,1.1,6.2,1.1,6.2h0.1c0,0,0.3-2.3,1.3-6.2l4.8-20.6h7.9l5.1,20.6   c1,4,1.2,6.2,1.2,6.2h0.1c0,0,0.1-2.2,1-6.2l4.8-20.6h7l-8.8,33.9h-7.7l-5.3-20.5c-1.1-4.5-1.2-6.4-1.2-6.4h-0.1c0,0-0.1,2-1.1,6.4   l-5,20.5h-8C82,41.1,73,7.2,73,7.2z M118.2,28.8c0-7.7,5-12.8,12.6-12.8c7.5,0,12.5,5,12.5,12.8c0,7.8-5,12.8-12.5,12.8   C123.2,41.6,118.2,36.6,118.2,28.8L118.2,28.8z M136.8,28.8c0-5-2.4-7.8-6-7.8c-3.9,0-6.1,3.2-6.1,7.8c0,5.1,2.4,7.9,6.1,7.9   C134.6,36.7,136.8,33.6,136.8,28.8L136.8,28.8z M146.4,16.4h6.2V21h0.1c1.1-2.4,3.6-4.7,8-4.7c0.7,0,1.2,0.1,1.5,0.2v6.2H162   c0,0-0.6-0.2-2.1-0.2c-4.8,0-7.4,2.8-7.4,8.1v10.6h-6.2V16.4z M165.1,7.2h6.2v10.9c0,6.4-0.1,7.6-0.1,7.6h0.1l9.2-9.2h7.7   l-10.8,10.7l12.5,14h-7.3l-9-10.2l-2.3,2.3v7.9H165L165.1,7.2L165.1,7.2z M189.9,24.3c0-10.4,6.5-17.4,16.2-17.4s16.2,7,16.2,17.4   s-6.5,17.4-16.2,17.4C196.4,41.7,189.9,34.7,189.9,24.3z M215.7,24.3c0-7.1-3.8-11.9-9.5-11.9c-5.7,0-9.5,4.8-9.5,11.9   s3.8,11.9,9.5,11.9C211.8,36.2,215.7,31.4,215.7,24.3z M224.7,29.8h7.1c0,4,2.7,6.2,6.9,6.2c3.5,0,5.9-1.8,5.9-4.3   c0-2.8-1.9-3.6-7.7-4.7c-5.4-1.1-11.1-2.9-11.1-9.9c0-5.9,5-10.3,12.7-10.3c8,0,12.9,4.2,12.9,10.5h-7.1c0-3.1-2.4-5-5.8-5   c-3.5,0-5.7,1.7-5.7,4.2c0,2.6,1.5,3.7,6.3,4.6c7,1.5,12.8,2.3,12.8,10.1c0,6.2-5.4,10.3-13.3,10.3   C230.4,41.5,224.7,36.9,224.7,29.8z"></path>
                <path
                    fill="#6363F1"
                    d="M0,24c0,1.1,0.3,2.1,0.8,3l9.7,16.8c1,1.7,2.5,3.1,4.4,3.7c3.6,1.2,7.5-0.3,9.4-3.5l2.3-4.1   l-9.2-16l9.8-16.9L29.5,3c0.7-1.2,1.6-2.2,2.7-3H17.2c-2.6,0-5.1,1.4-6.4,3.7L0.8,21C0.3,21.9,0,22.9,0,24z"></path>
                <path
                    fill="#6363F1"
                    d="M55.4,24c0-1.1-0.3-2.1-0.8-3l-9.8-17c-1.9-3.3-5.8-4.7-9.4-3.5c-1.9,0.6-3.4,2-4.4,3.7   L28.7,8L38,24l-9.8,16.9L25.9,45c-0.7,1.2-1.6,2.2-2.7,3h15.1c2.6,0,5.1-1.4,6.4-3.7l10-17.3C55.1,26.1,55.4,25.1,55.4,24z"></path>
            </g>
        </svg>
    )
}

const AstroLogo = () => {
    return (
        <svg
            className="mx-auto h-12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 460 160"
            fill="none">
            <path
                d="M65.7846 121.175C61.2669 117.045 59.9481 108.368 61.8303 102.082C65.0939 106.045 69.6158 107.301 74.2997 108.009C81.5305 109.103 88.6318 108.694 95.349 105.389C96.1174 105.011 96.8275 104.507 97.6672 103.998C98.2974 105.826 98.4615 107.672 98.2413 109.551C97.706 114.127 95.4288 117.662 91.8069 120.341C90.3586 121.413 88.8261 122.371 87.3303 123.382C82.7349 126.487 81.4917 130.129 83.2184 135.427C83.2594 135.556 83.2961 135.685 83.389 136C81.0427 134.95 79.3289 133.421 78.023 131.411C76.6438 129.289 75.9876 126.942 75.9531 124.403C75.9358 123.167 75.9358 121.92 75.7696 120.702C75.3638 117.732 73.9694 116.402 71.3426 116.325C68.6467 116.247 66.5141 117.913 65.9486 120.538C65.9054 120.739 65.8428 120.938 65.7803 121.172L65.7846 121.175Z"
                fill="currentColor"
            />
            <path
                d="M65.7846 121.175C61.2669 117.045 59.9481 108.368 61.8303 102.082C65.0939 106.045 69.6158 107.301 74.2997 108.009C81.5305 109.103 88.6318 108.694 95.349 105.389C96.1174 105.011 96.8275 104.507 97.6672 103.998C98.2974 105.826 98.4615 107.672 98.2413 109.551C97.706 114.127 95.4288 117.662 91.8069 120.341C90.3586 121.413 88.8261 122.371 87.3303 123.382C82.7349 126.487 81.4917 130.129 83.2184 135.427C83.2594 135.556 83.2961 135.685 83.389 136C81.0427 134.95 79.3289 133.421 78.023 131.411C76.6438 129.289 75.9876 126.942 75.9531 124.403C75.9358 123.167 75.9358 121.92 75.7696 120.702C75.3638 117.732 73.9694 116.402 71.3426 116.325C68.6467 116.247 66.5141 117.913 65.9486 120.538C65.9054 120.739 65.8428 120.938 65.7803 121.172L65.7846 121.175Z"
                fill="url(#paint0_linear_1_33)"
            />
            <path
                d="M40 101.034C40 101.034 53.3775 94.5177 66.7924 94.5177L76.9068 63.2155C77.2855 61.7017 78.3911 60.6729 79.6393 60.6729C80.8875 60.6729 81.9932 61.7017 82.3719 63.2155L92.4862 94.5177C108.374 94.5177 119.279 101.034 119.279 101.034C119.279 101.034 96.5558 39.133 96.5114 39.0088C95.8592 37.1787 94.7583 36 93.274 36H66.007C64.5227 36 63.4662 37.1787 62.7696 39.0088C62.7205 39.1307 40 101.034 40 101.034Z"
                fill="currentColor"
            />
            <path
                d="M181.043 81.1227C181.043 86.6079 174.22 89.8838 164.773 89.8838C158.624 89.8838 156.45 88.3601 156.45 85.1604C156.45 81.8083 159.149 80.2085 165.297 80.2085C170.846 80.2085 175.569 80.2846 181.043 80.9703V81.1227ZM181.118 74.3423C177.744 73.5805 172.645 73.1234 166.572 73.1234C148.877 73.1234 140.555 77.3135 140.555 87.065C140.555 97.1975 146.253 101.083 159.449 101.083C170.621 101.083 178.193 98.2641 180.968 91.3313H181.417C181.342 93.0074 181.268 94.6834 181.268 95.9785C181.268 99.5592 181.867 99.8639 184.791 99.8639H198.587C197.837 97.7308 197.388 91.7122 197.388 86.5317C197.388 80.9703 197.612 76.7802 197.612 71.1426C197.612 59.6388 190.715 52.3251 169.121 52.3251C159.824 52.3251 149.477 53.925 141.605 56.2867C142.354 59.4102 143.404 65.7335 143.929 69.8474C150.752 66.6477 160.424 65.2764 167.922 65.2764C178.268 65.2764 181.118 67.6381 181.118 72.4377V74.3423Z"
                fill="currentColor"
            />
            <path
                d="M218.971 84.3224C217.097 84.5509 214.547 84.5509 211.923 84.5509C209.149 84.5509 206.6 84.4748 204.875 84.2462C204.875 84.8557 204.8 85.5413 204.8 86.1508C204.8 95.6738 211.024 101.235 232.917 101.235C253.535 101.235 260.208 95.75 260.208 86.0746C260.208 76.9325 255.785 72.4377 236.216 71.4473C220.995 70.7616 219.646 69.0856 219.646 67.181C219.646 64.9717 221.595 63.8289 231.792 63.8289C242.364 63.8289 245.213 65.2764 245.213 68.3238V69.0094C246.713 68.9332 249.412 68.8571 252.186 68.8571C254.81 68.8571 257.659 68.9332 259.309 69.0856C259.309 68.3999 259.384 67.7905 259.384 67.2572C259.384 56.0581 250.086 52.4013 232.092 52.4013C211.848 52.4013 205.025 57.3533 205.025 67.0286C205.025 75.7136 210.499 81.1227 229.918 81.9607C244.238 82.4178 245.813 84.0177 245.813 86.227C245.813 88.5887 243.489 89.6553 233.442 89.6553C221.895 89.6553 218.971 88.0554 218.971 84.7795V84.3224Z"
                fill="currentColor"
            />
            <path
                d="M284.955 44.1734C279.482 49.2778 269.66 54.3821 264.187 55.7534C264.262 58.5722 264.262 63.7527 264.262 66.5715L269.285 66.6477C269.21 72.0568 269.135 78.6086 269.135 82.9511C269.135 93.0835 274.458 100.702 291.028 100.702C298.001 100.702 302.65 99.9401 308.423 98.7212C307.823 94.9881 307.148 89.2743 306.923 84.9319C303.475 86.0746 299.126 86.6841 294.327 86.6841C287.654 86.6841 284.955 84.8557 284.955 79.599C284.955 75.028 284.955 70.7616 285.03 66.8001C293.578 66.8763 302.125 67.0286 307.148 67.181C307.073 63.2194 307.223 57.5056 307.448 53.6964C300.176 53.8488 292.003 53.925 285.255 53.925C285.33 50.5729 285.405 47.3732 285.48 44.1734H284.955Z"
                fill="currentColor"
            />
            <path
                d="M329.736 64.286C329.811 60.3244 329.886 56.9724 329.961 53.6964H314.89C315.115 60.2483 315.115 66.9525 315.115 76.7802C315.115 86.6079 315.04 93.3883 314.89 99.8639H332.135C331.835 95.2929 331.76 87.5983 331.76 81.0465C331.76 70.6855 335.959 67.7143 345.481 67.7143C349.905 67.7143 353.054 68.2476 355.828 69.238C355.903 65.3526 356.653 57.8104 357.102 54.4583C354.253 53.6203 351.104 53.087 347.28 53.087C339.108 53.0108 333.11 56.3629 330.336 64.3622L329.736 64.286Z"
                fill="currentColor"
            />
            <path
                d="M404.808 76.4754C404.808 84.7795 398.81 88.6649 389.363 88.6649C379.991 88.6649 373.993 85.008 373.993 76.4754C373.993 67.9428 380.066 64.7431 389.363 64.7431C398.735 64.7431 404.808 68.1714 404.808 76.4754ZM420.478 76.0945C420.478 59.5626 407.582 52.1728 389.363 52.1728C371.069 52.1728 358.623 59.5626 358.623 76.0945C358.623 92.5503 370.244 101.388 389.288 101.388C408.482 101.388 420.478 92.5503 420.478 76.0945Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_1_33"
                    x1="61.0003"
                    y1="136"
                    x2="104.622"
                    y2="115.39"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#D83333" />
                    <stop
                        offset="1"
                        stopColor="#F041FF"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

const NetlifyLogo = () => {
    return (
        <>
            <svg
                className="mx-auto h-12 dark:hidden"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 209"
                fill="none">
                <g clipPath="url(#clip0_235_8)">
                    <path
                        d="M117.436 207.036V154.604L118.529 153.51H129.452L130.545 154.604V207.036L129.452 208.13H118.529L117.436 207.036Z"
                        fill="#05BDBA"
                    />
                    <path
                        d="M117.436 53.5225V1.09339L118.529 0H129.452L130.545 1.09339V53.5225L129.452 54.6159H118.529L117.436 53.5225Z"
                        fill="#05BDBA"
                    />
                    <path
                        d="M69.9539 169.238H68.4094L60.6869 161.512V159.967L78.7201 141.938L86.8976 141.942L87.9948 143.031V151.209L69.9539 169.238Z"
                        fill="#05BDBA"
                    />
                    <path
                        d="M69.9462 38.8917H68.4017L60.6792 46.6181V48.1626L78.7124 66.192L86.8899 66.1882L87.9871 65.0986V56.9212L69.9462 38.8917Z"
                        fill="#05BDBA"
                    />
                    <path
                        d="M1.09339 97.5104H75.3711L76.4645 98.6038V109.526L75.3711 110.62H1.09339L0 109.526V98.6038L1.09339 97.5104Z"
                        fill="#05BDBA"
                    />
                    <path
                        d="M440.999 97.5104H510.91L512.004 98.6038V109.526L510.91 110.62H436.633L435.539 109.526L439.905 98.6038L440.999 97.5104Z"
                        fill="#05BDBA"
                    />
                    <path
                        d="M212.056 108.727L210.963 109.821H177.079L175.986 110.914C175.986 113.101 178.173 119.657 186.916 119.657C190.196 119.657 193.472 118.564 194.566 116.377L195.659 115.284H208.776L209.869 116.377C208.776 122.934 203.313 132.774 186.916 132.774C168.336 132.774 159.589 119.657 159.589 104.357C159.589 89.0576 168.332 75.9408 185.822 75.9408C203.313 75.9408 212.056 89.0576 212.056 104.357V108.731V108.727ZM195.659 97.7971C195.659 96.7037 194.566 89.0538 185.822 89.0538C177.079 89.0538 175.986 96.7037 175.986 97.7971L177.079 98.8905H194.566L195.659 97.7971Z"
                        fill="#014847"
                    />
                    <path
                        d="M242.66 115.284C242.66 117.47 243.753 118.564 245.94 118.564H255.776L256.87 119.657V130.587L255.776 131.681H245.94C236.103 131.681 227.36 127.307 227.36 115.284V91.2368L226.266 90.1434H218.617L217.523 89.05V78.1199L218.617 77.0265H226.266L227.36 75.9332V66.0965L228.453 65.0031H241.57L242.663 66.0965V75.9332L243.757 77.0265H255.78L256.874 78.1199V89.05L255.78 90.1434H243.757L242.663 91.2368V115.284H242.66Z"
                        fill="#014847"
                    />
                    <path
                        d="M283.1 131.681H269.983L268.889 130.587V56.2636L269.983 55.1702H283.1L284.193 56.2636V130.587L283.1 131.681Z"
                        fill="#014847"
                    />
                    <path
                        d="M312.61 68.2871H299.493L298.399 67.1937V56.2636L299.493 55.1702H312.61L313.703 56.2636V67.1937L312.61 68.2871ZM312.61 131.681H299.493L298.399 130.587V78.1237L299.493 77.0304H312.61L313.703 78.1237V130.587L312.61 131.681Z"
                        fill="#014847"
                    />
                    <path
                        d="M363.98 56.2636V67.1937L362.886 68.2871H353.05C350.863 68.2871 349.769 69.3805 349.769 71.5672V75.9408L350.863 77.0342H361.793L362.886 78.1276V89.0576L361.793 90.151H350.863L349.769 91.2444V130.591L348.676 131.684H335.559L334.466 130.591V91.2444L333.372 90.151H325.723L324.629 89.0576V78.1276L325.723 77.0342H333.372L334.466 75.9408V71.5672C334.466 59.5438 343.209 55.1702 353.046 55.1702H362.882L363.976 56.2636H363.98Z"
                        fill="#014847"
                    />
                    <path
                        d="M404.42 132.774C400.046 143.704 395.677 150.261 380.373 150.261H374.906L373.813 149.167V138.237L374.906 137.144H380.373C385.836 137.144 386.929 136.05 388.023 132.77V131.677L370.536 89.05V78.1199L371.63 77.0265H381.466L382.56 78.1199L395.677 115.284H396.77L409.887 78.1199L410.98 77.0265H420.817L421.91 78.1199V89.05L404.424 132.77L404.42 132.774Z"
                        fill="#014847"
                    />
                    <path
                        d="M135.454 131.681L134.361 130.587L134.368 98.9172C134.368 93.4541 132.22 89.2182 125.625 89.0806C122.234 88.9926 118.354 89.0729 114.209 89.2488L113.59 89.8834L113.598 130.587L112.504 131.681H99.3913L98.2979 130.587V77.5388L99.3913 76.4454L128.901 76.1778C143.685 76.1778 149.668 86.3356 149.668 97.8009V130.587L148.575 131.681H135.454Z"
                        fill="#014847"
                    />
                </g>
                <defs>
                    <clipPath id="clip0_235_8">
                        <rect
                            width="512"
                            height="208.126"
                            fill="white"
                        />
                    </clipPath>
                </defs>
            </svg>
            <svg
                className="mx-auto hidden h-12 dark:block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 209"
                fill="none">
                <g clipPath="url(#clip0_235_26)">
                    <path
                        d="M117.436 207.036V154.604L118.529 153.51H129.452L130.545 154.604V207.036L129.452 208.13H118.529L117.436 207.036Z"
                        fill="#32E6E2"
                    />
                    <path
                        d="M117.436 53.5225V1.09339L118.529 0H129.452L130.545 1.09339V53.5225L129.452 54.6159H118.529L117.436 53.5225Z"
                        fill="#32E6E2"
                    />
                    <path
                        d="M69.9539 169.238H68.4094L60.6869 161.512V159.967L78.7201 141.938L86.8976 141.942L87.9948 143.031V151.209L69.9539 169.238Z"
                        fill="#32E6E2"
                    />
                    <path
                        d="M69.9462 38.8917H68.4017L60.6792 46.6181V48.1626L78.7124 66.192L86.8899 66.1882L87.9871 65.0986V56.9212L69.9462 38.8917Z"
                        fill="#32E6E2"
                    />
                    <path
                        d="M1.09339 97.5104H75.3711L76.4645 98.6038V109.526L75.3711 110.62H1.09339L0 109.526V98.6038L1.09339 97.5104Z"
                        fill="#32E6E2"
                    />
                    <path
                        d="M440.999 97.5104H510.91L512.004 98.6038V109.526L510.91 110.62H436.633L435.539 109.526L439.905 98.6038L440.999 97.5104Z"
                        fill="#32E6E2"
                    />
                    <path
                        d="M212.056 108.727L210.963 109.821H177.079L175.986 110.914C175.986 113.101 178.173 119.657 186.916 119.657C190.196 119.657 193.472 118.564 194.566 116.377L195.659 115.284H208.776L209.869 116.377C208.776 122.934 203.313 132.774 186.916 132.774C168.336 132.774 159.589 119.657 159.589 104.357C159.589 89.0576 168.332 75.9408 185.822 75.9408C203.313 75.9408 212.056 89.0576 212.056 104.357V108.731V108.727ZM195.659 97.7971C195.659 96.7037 194.566 89.0538 185.822 89.0538C177.079 89.0538 175.986 96.7037 175.986 97.7971L177.079 98.8905H194.566L195.659 97.7971Z"
                        fill="white"
                    />
                    <path
                        d="M242.66 115.284C242.66 117.47 243.753 118.564 245.94 118.564H255.776L256.87 119.657V130.587L255.776 131.681H245.94C236.103 131.681 227.36 127.307 227.36 115.284V91.2368L226.266 90.1434H218.617L217.523 89.05V78.1199L218.617 77.0265H226.266L227.36 75.9332V66.0965L228.453 65.0031H241.57L242.663 66.0965V75.9332L243.757 77.0265H255.78L256.874 78.1199V89.05L255.78 90.1434H243.757L242.663 91.2368V115.284H242.66Z"
                        fill="white"
                    />
                    <path
                        d="M283.1 131.681H269.983L268.889 130.587V56.2636L269.983 55.1702H283.1L284.193 56.2636V130.587L283.1 131.681Z"
                        fill="white"
                    />
                    <path
                        d="M312.61 68.2871H299.493L298.399 67.1937V56.2636L299.493 55.1702H312.61L313.703 56.2636V67.1937L312.61 68.2871ZM312.61 131.681H299.493L298.399 130.587V78.1237L299.493 77.0304H312.61L313.703 78.1237V130.587L312.61 131.681Z"
                        fill="white"
                    />
                    <path
                        d="M363.98 56.2636V67.1937L362.886 68.2871H353.05C350.863 68.2871 349.769 69.3805 349.769 71.5672V75.9408L350.863 77.0342H361.793L362.886 78.1276V89.0576L361.793 90.151H350.863L349.769 91.2444V130.591L348.676 131.684H335.559L334.466 130.591V91.2444L333.372 90.151H325.723L324.629 89.0576V78.1276L325.723 77.0342H333.372L334.466 75.9408V71.5672C334.466 59.5438 343.209 55.1702 353.046 55.1702H362.882L363.976 56.2636H363.98Z"
                        fill="white"
                    />
                    <path
                        d="M404.42 132.774C400.046 143.704 395.677 150.261 380.373 150.261H374.906L373.813 149.167V138.237L374.906 137.144H380.373C385.836 137.144 386.929 136.05 388.023 132.77V131.677L370.536 89.05V78.1199L371.63 77.0265H381.466L382.56 78.1199L395.677 115.284H396.77L409.887 78.1199L410.98 77.0265H420.817L421.91 78.1199V89.05L404.424 132.77L404.42 132.774Z"
                        fill="white"
                    />
                    <path
                        d="M135.454 131.681L134.361 130.587L134.368 98.9172C134.368 93.4541 132.22 89.2182 125.625 89.0806C122.234 88.9926 118.354 89.0729 114.209 89.2488L113.59 89.8834L113.598 130.587L112.504 131.681H99.3913L98.2979 130.587V77.5388L99.3913 76.4454L128.901 76.1778C143.685 76.1778 149.668 86.3356 149.668 97.8009V130.587L148.575 131.681H135.454Z"
                        fill="white"
                    />
                </g>
                <defs>
                    <clipPath id="clip0_235_26">
                        <rect
                            width="512"
                            height="208.126"
                            fill="white"
                        />
                    </clipPath>
                </defs>
            </svg>
        </>
    )
}

```
### ../../packages/core/src/components/logo.tsx (registry:component)
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}

```

## Hero Section 8 (hero-section-8)
- Source: https://tailark.com/r/hero-section-8.json
- Description: Shadcn/ui website Hero Section
- Registry dependencies: button
### ../../packages/dusk-kit/blocks/hero-section/eight/index.tsx (registry:component) -> components/hero-section.tsx
```tsx
'use client'
import React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { ArrowRight, Menu, Rocket, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const menuItems = [
    { name: 'Features', href: '#' },
    { name: 'Solution', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'About', href: '#' },
]

export default function HeroSection() {
    const [menuState, setMenuState] = React.useState(false)

    return (
        <>
            <header>
                <nav
                    data-state={menuState && 'active'}
                    className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent">
                    <div className="m-auto max-w-5xl px-6">
                        <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                            <div className="flex w-full justify-between lg:w-auto">
                                <Link
                                    href="/"
                                    aria-label="home"
                                    className="flex items-center space-x-2">
                                    <Logo />
                                </Link>

                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                    className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                    <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                    <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                                </button>
                            </div>

                            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                                <div className="lg:pr-4">
                                    <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                                        {menuItems.map((item, index) => (
                                            <li key={index}>
                                                <Link
                                                    href={item.href}
                                                    className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                    <span>{item.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm">
                                        <Link href="#">
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm">
                                        <Link href="#">
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <main className="overflow-hidden">
                <section>
                    <div className="relative pt-24">
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="max-w-3xl text-center sm:mx-auto lg:mr-auto lg:mt-0 lg:w-4/5">
                                <Link
                                    href="/"
                                    className="rounded-(--radius) mx-auto flex w-fit items-center gap-2 border p-1 pr-3">
                                    <span className="bg-muted rounded-[calc(var(--radius)-0.25rem)] px-2 py-1 text-xs">New</span>
                                    <span className="text-sm">Introduction Tailark Html</span>
                                    <span className="bg-(--color-border) block h-4 w-px"></span>

                                    <ArrowRight className="size-4" />
                                </Link>

                                <h1 className="mt-8 text-balance text-4xl font-semibold md:text-5xl xl:text-6xl xl:[line-height:1.125]">Modern Software testing reimagined</h1>
                                <p className="mx-auto mt-8 hidden max-w-2xl text-wrap text-lg sm:block">Tailwindcss highly customizable components for building modern websites and applications that look and feel the way you mean it.</p>
                                <p className="mx-auto mt-6 max-w-2xl text-wrap sm:hidden">Highly customizable components for building modern websites and applications, with your personal spark.</p>

                                <div className="mt-8">
                                    <Button
                                        size="lg"
                                        asChild>
                                        <Link href="#">
                                            <Rocket className="relative size-4" />
                                            <span className="text-nowrap">Start Building</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="mask-b-from-55% relative mx-auto mt-16 max-w-6xl overflow-hidden px-4">
                            <Image
                                className="z-2 border-border/25 relative hidden rounded-2xl border dark:block"
                                src="/music.png"
                                alt="app screen"
                                width={2796}
                                height={2008}
                            />
                            <Image
                                className="z-2 border-border/25 relative rounded-2xl border dark:hidden"
                                src="/music-light.png"
                                alt="app screen"
                                width={2796}
                                height={2008}
                            />
                        </div>
                    </div>
                </section>
                <section className="bg-background relative z-10 pb-16">
                    <div className="m-auto max-w-5xl px-6">
                        <h2 className="text-center text-lg font-medium">Your favorite companies are our partners.</h2>
                        <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                alt="Nvidia Logo"
                                height="20"
                                width="auto"
                            />
                            <img
                                className="h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/column.svg"
                                alt="Column Logo"
                                height="16"
                                width="auto"
                            />
                            <img
                                className="h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/github.svg"
                                alt="GitHub Logo"
                                height="16"
                                width="auto"
                            />
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/nike.svg"
                                alt="Nike Logo"
                                height="20"
                                width="auto"
                            />
                            <img
                                className="h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/laravel.svg"
                                alt="Laravel Logo"
                                height="16"
                                width="auto"
                            />
                            <img
                                className="h-7 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/lilly.svg"
                                alt="Lilly Logo"
                                height="28"
                                width="auto"
                            />
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                alt="Lemon Squeezy Logo"
                                height="20"
                                width="auto"
                            />
                            <img
                                className="h-6 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/openai.svg"
                                alt="OpenAI Logo"
                                height="24"
                                width="auto"
                            />
                            <img
                                className="h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/tailwindcss.svg"
                                alt="Tailwind CSS Logo"
                                height="16"
                                width="auto"
                            />
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/vercel.svg"
                                alt="Vercel Logo"
                                height="20"
                                width="auto"
                            />
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/zapier.svg"
                                alt="Zapier Logo"
                                height="20"
                                width="auto"
                            />
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

```
### ../../packages/core/src/components/logo.tsx (registry:component)
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}

```

## Hero Section 9 (hero-section-9)
- Source: https://tailark.com/r/hero-section-9.json
- Description: Shadcn/ui website Hero Section
- Registry dependencies: button
### ../../packages/dusk-kit/blocks/hero-section/nine/index.tsx (registry:component) -> components/hero-section.tsx
```tsx
'use client'
import { Logo } from '@/components/logo'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

const menuItems = [
    { name: 'Features', href: '#' },
    { name: 'Solution', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'About', href: '#' },
]

export default function HeroSection() {
    const [menuState, setMenuState] = useState(false)
    return (
        <>
            <header>
                <nav
                    data-state={menuState && 'active'}
                    className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent">
                    <div className="m-auto max-w-5xl px-6">
                        <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                            <div className="flex w-full justify-between lg:w-auto">
                                <Link
                                    href="/"
                                    aria-label="home"
                                    className="flex items-center space-x-2">
                                    <Logo />
                                </Link>

                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                    className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                    <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                    <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                                </button>
                            </div>

                            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                                <div className="lg:pr-4">
                                    <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                                        {menuItems.map((item, index) => (
                                            <li key={index}>
                                                <Link
                                                    href={item.href}
                                                    className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                    <span>{item.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm">
                                        <Link href="#">
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm">
                                        <Link href="#">
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <main>
                <div
                    aria-hidden
                    className="z-2 absolute inset-0 isolate hidden opacity-50 contain-strict lg:block">
                    <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>

                <section className="bg-muted/50 dark:bg-background overflow-hidden">
                    <div className="relative mx-auto max-w-5xl px-6 pt-28 lg:pt-24">
                        <div className="relative z-10 mx-auto max-w-2xl text-center">
                            <h1 className="text-balance text-4xl font-semibold md:text-5xl lg:text-6xl">Modern Software testing reimagined</h1>
                            <p className="text-muted-foreground mx-auto my-8 max-w-2xl text-xl">Officiis laudantium excepturi ducimus rerum dignissimos, and tempora nam vitae, excepturi ducimus iste provident dolores.</p>

                            <Button
                                asChild
                                size="lg">
                                <Link href="#">
                                    <span className="btn-label">Start Building</span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="mx-auto 2xl:max-w-7xl">
                        <div className="perspective-distant pl-8 lg:pl-44">
                            <div className="lg:h-176 rotate-x-20 mask-b-from-55% mask-b-to-100% mask-r-from-75% skew-x-12 pl-6 pt-6">
                                <Image
                                    className="rounded-(--radius) border shadow-xl dark:hidden"
                                    src="/card.png"
                                    alt="Tailark hero section"
                                    width={2880}
                                    height={2074}
                                />
                                <Image
                                    className="rounded-(--radius) hidden border shadow-xl dark:block"
                                    src="/dark-card.webp"
                                    alt="Tailark hero section"
                                    width={2880}
                                    height={2074}
                                />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="dark:bg-background bg-muted/50 relative z-10 py-16">
                    <div className="m-auto max-w-5xl px-6">
                        <h2 className="text-center text-lg font-medium">Your favorite companies are our partners.</h2>
                        <div className="mx-auto mt-20 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                alt="Nvidia Logo"
                                height="20"
                                width="auto"
                            />
                            <img
                                className="h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/column.svg"
                                alt="Column Logo"
                                height="16"
                                width="auto"
                            />
                            <img
                                className="h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/github.svg"
                                alt="GitHub Logo"
                                height="16"
                                width="auto"
                            />
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/nike.svg"
                                alt="Nike Logo"
                                height="20"
                                width="auto"
                            />
                            <img
                                className="h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/laravel.svg"
                                alt="Laravel Logo"
                                height="16"
                                width="auto"
                            />
                            <img
                                className="h-7 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/lilly.svg"
                                alt="Lilly Logo"
                                height="28"
                                width="auto"
                            />
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                alt="Lemon Squeezy Logo"
                                height="20"
                                width="auto"
                            />
                            <img
                                className="h-6 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/openai.svg"
                                alt="OpenAI Logo"
                                height="24"
                                width="auto"
                            />
                            <img
                                className="h-4 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/tailwindcss.svg"
                                alt="Tailwind CSS Logo"
                                height="16"
                                width="auto"
                            />
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/vercel.svg"
                                alt="Vercel Logo"
                                height="20"
                                width="auto"
                            />
                            <img
                                className="h-5 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/zapier.svg"
                                alt="Zapier Logo"
                                height="20"
                                width="auto"
                            />
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

```
### ../../packages/core/src/components/logo.tsx (registry:component)
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}

```

## Features Block 1 (features-1)
- Source: https://tailark.com/r/features-1.json
- Description: Shadcn/ui website features block
- Registry dependencies: card
### ../../packages/dusk-kit/blocks/features/one/index.tsx (registry:component) -> components/features-1.tsx
```tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Settings2, Sparkles, Zap } from 'lucide-react'
import { ReactNode } from 'react'

export default function Features() {
    return (
        <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Built to cover your needs</h2>
                    <p className="mt-4">Libero sapiente aliquam quibusdam aspernatur, praesentium iusto repellendus.</p>
                </div>
                <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16">
                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Zap
                                    className="size-6"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">Customizable</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">Extensive customization options, allowing you to tailor every aspect to meet your specific needs.</p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Settings2
                                    className="size-6"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">You have full control</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm">From design elements to functionality, you have complete control to create a unique and personalized experience.</p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Sparkles
                                    className="size-6"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">Powered By AI</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm">Elements to functionality, you have complete control to create a unique experience.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
        />

        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
    </div>
)

```

## Features Block 3 (features-3)
- Source: https://tailark.com/r/features-3.json
- Description: Shadcn/ui website features block
- Registry dependencies: card
### ../../packages/dusk-kit/blocks/features/three/index.tsx (registry:component) -> components/features-3.tsx
```tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Settings2, Sparkles, Zap } from 'lucide-react'
import { ReactNode } from 'react'

export default function Features() {
    return (
        <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Built to cover your needs</h2>
                    <p className="mt-4">Libero sapiente aliquam quibusdam aspernatur, praesentium iusto repellendus.</p>
                </div>
                <Card className="@min-4xl:max-w-full @min-4xl:grid-cols-3 @min-4xl:divide-x @min-4xl:divide-y-0 mx-auto mt-8 grid max-w-sm divide-y overflow-hidden shadow-zinc-950/5 *:text-center md:mt-16">
                    <div className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Zap
                                    className="size-6"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">Customizable</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">Extensive customization options, allowing you to tailor every aspect to meet your specific needs.</p>
                        </CardContent>
                    </div>

                    <div className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Settings2
                                    className="size-6"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">You have full control</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm">From design elements to functionality, you have complete control to create a unique and personalized experience.</p>
                        </CardContent>
                    </div>

                    <div className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Sparkles
                                    className="size-6"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">Powered By AI</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm">Elements to functionality, you have complete control to create a unique experience.</p>
                        </CardContent>
                    </div>
                </Card>
            </div>
        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
        />

        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
    </div>
)

```

## Features Block 4 (features-4)
- Source: https://tailark.com/r/features-4.json
- Description: Shadcn/ui website features block
### ../../packages/dusk-kit/blocks/features/four/index.tsx (registry:component) -> components/features-4.tsx
```tsx
import { Cpu, Fingerprint, Pencil, Settings2, Sparkles, Zap } from 'lucide-react'

export default function Features() {
    return (
        <section className="py-12 md:py-20">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-balance text-4xl font-medium lg:text-5xl">The foundation for creative teams management</h2>
                    <p>Lyra is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</p>
                </div>

                <div className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4" />
                            <h3 className="text-sm font-medium">Faaast</h3>
                        </div>
                        <p className="text-sm">It supports an entire helping developers and innovate.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4" />
                            <h3 className="text-sm font-medium">Powerful</h3>
                        </div>
                        <p className="text-sm">It supports an entire helping developers and businesses.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Fingerprint className="size-4" />

                            <h3 className="text-sm font-medium">Security</h3>
                        </div>
                        <p className="text-sm">It supports an helping developers businesses.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Pencil className="size-4" />

                            <h3 className="text-sm font-medium">Customization</h3>
                        </div>
                        <p className="text-sm">It supports helping developers and businesses innovate.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Settings2 className="size-4" />

                            <h3 className="text-sm font-medium">Control</h3>
                        </div>
                        <p className="text-sm">It supports helping developers and businesses innovate.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4" />

                            <h3 className="text-sm font-medium">Built for AI</h3>
                        </div>
                        <p className="text-sm">It supports helping developers and businesses innovate.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## Features Block 5 (features-5)
- Source: https://tailark.com/r/features-5.json
- Description: Shadcn/ui website features block
### ../../packages/dusk-kit/blocks/features/five/index.tsx (registry:component) -> components/features-5.tsx
```tsx
import { Activity, DraftingCompass, Mail, Zap } from 'lucide-react'
import Image from 'next/image'

export default function FeaturesSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid items-center gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-5 lg:gap-24">
                    <div className="lg:col-span-2">
                        <div className="md:pr-6 lg:pr-0">
                            <h2 className="text-4xl font-semibold lg:text-5xl">Built for Scaling teams</h2>
                            <p className="mt-6">Orrupti aut temporibus assumenda atque ab, accusamus sit, molestiae veniam laboriosam pariatur.</p>
                        </div>
                        <ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-3">
                            <li>
                                <Mail className="size-5" />
                                Email and web support
                            </li>
                            <li>
                                <Zap className="size-5" />
                                Fast response time
                            </li>
                            <li>
                                <Activity className="size-5" />
                                Menitoring and analytics
                            </li>
                            <li>
                                <DraftingCompass className="size-5" />
                                Architectural review
                            </li>
                        </ul>
                    </div>
                    <div className="border-border/50 relative rounded-3xl border p-3 lg:col-span-3">
                        <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                            <Image src="/payments.png" className="hidden rounded-[15px] dark:block" alt="payments illustration dark" width={1207} height={929} />
                            <Image src="/payments-light.png" className="rounded-[15px] shadow dark:hidden" alt="payments illustration light" width={1207} height={929} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## Features Block 6 (features-6)
- Source: https://tailark.com/r/features-6.json
- Description: Shadcn/ui website features block
### ../../packages/dusk-kit/blocks/features/six/index.tsx (registry:component) -> components/features-6.tsx
```tsx
import { Cpu, Lock, Sparkles, Zap } from 'lucide-react'
import Image from 'next/image'

export default function FeaturesSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-12 px-6">
                <div className="relative z-10 grid items-center gap-4 md:grid-cols-2 md:gap-12">
                    <h2 className="text-4xl font-semibold">The Lyra ecosystem brings together our models</h2>
                    <p className="max-w-sm sm:ml-auto">Empower your team with workflows that adapt to your needs, whether you prefer git synchronization or a AI Agents interface.</p>
                </div>
                <div className="px-3 pt-3 md:-mx-8">
                    <div className="aspect-88/36 mask-b-from-75% mask-b-to-95% relative">
                        <Image
                            src="/mail-upper.png"
                            className="absolute inset-0 z-10"
                            alt="payments illustration dark"
                            width={2797}
                            height={1137}
                        />
                        <Image
                            src="/mail-back.png"
                            className="hidden dark:block"
                            alt="payments illustration dark"
                            width={2797}
                            height={1137}
                        />
                        <Image
                            src="/mail-back-light.png"
                            className="dark:hidden"
                            alt="payments illustration light"
                            width={2797}
                            height={1137}
                        />
                    </div>
                </div>
                <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4" />
                            <h3 className="text-sm font-medium">Faaast</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">It supports an entire helping developers and innovate.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4" />
                            <h3 className="text-sm font-medium">Powerful</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">It supports an entire helping developers and businesses.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Lock className="size-4" />
                            <h3 className="text-sm font-medium">Security</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">It supports an helping developers businesses innovate.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4" />

                            <h3 className="text-sm font-medium">AI Powered</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">It supports an helping developers businesses innovate.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## Features Block 7 (features-7)
- Source: https://tailark.com/r/features-7.json
- Description: Shadcn/ui website features block
### ../../packages/dusk-kit/blocks/features/seven/index.tsx (registry:component) -> components/features-7.tsx
```tsx
import { Cpu, Lock, Sparkles, Zap } from 'lucide-react'
import Image from 'next/image'

export default function FeaturesSection() {
    return (
        <section className="overflow-hidden py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl font-semibold lg:text-5xl">Built for Scaling teams</h2>
                    <p className="mt-6 text-lg">Empower your team with workflows that adapt to your needs, whether you prefer git synchronization or a AI Agents interface.</p>
                </div>
                <div className="mask-b-from-75% mask-l-from-75% mask-b-to-95% mask-l-to-95% relative -mx-4 pr-3 pt-3 md:-mx-12">
                    <div className="perspective-midrange">
                        <div className="rotate-x-6 -skew-2">
                            <div className="aspect-88/36 relative">
                                <Image
                                    src="/mail-upper.png"
                                    className="absolute inset-0 z-10"
                                    alt="payments illustration dark"
                                    width={2797}
                                    height={1137}
                                />
                                <Image
                                    src="/mail-back.png"
                                    className="hidden dark:block"
                                    alt="payments illustration dark"
                                    width={2797}
                                    height={1137}
                                />
                                <Image
                                    src="/mail-back-light.png"
                                    className="dark:hidden"
                                    alt="payments illustration light"
                                    width={2797}
                                    height={1137}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4" />
                            <h3 className="text-sm font-medium">Faaast</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">It supports an entire helping developers and innovate.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4" />
                            <h3 className="text-sm font-medium">Powerful</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">It supports an entire helping developers and businesses.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Lock className="size-4" />
                            <h3 className="text-sm font-medium">Security</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">It supports an helping developers businesses innovate.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4" />

                            <h3 className="text-sm font-medium">AI Powered</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">It supports an helping developers businesses innovate.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## Features Block 8 (features-8)
- Source: https://tailark.com/r/features-8.json
- Description: Shadcn/ui website features block
- Registry dependencies: card
### ../../packages/dusk-kit/blocks/features/eight/index.tsx (registry:component) -> components/features-8.tsx
```tsx
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Users } from 'lucide-react'

export default function FeaturesSection() {
    return (
        <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
            <div className="mx-auto max-w-5xl px-6">
                <div className="relative">
                    <div className="relative z-10 grid grid-cols-6 gap-3">
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-2">
                            <CardContent className="relative m-auto size-fit pt-6">
                                <div className="relative flex h-24 w-56 items-center">
                                    <svg
                                        className="text-muted absolute inset-0 size-full"
                                        viewBox="0 0 254 104"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span className="mx-auto block w-fit text-5xl font-semibold">100%</span>
                                </div>
                                <h2 className="mt-6 text-center text-3xl font-semibold">Customizable</h2>
                            </CardContent>
                        </Card>
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
                            <CardContent className="pt-6">
                                <div className="relative mx-auto flex aspect-square size-32 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                    <svg
                                        className="m-auto h-fit w-24"
                                        viewBox="0 0 212 143"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            className="text-zinc-400 dark:text-zinc-600"
                                            d="M44.0209 55.3542C43.1945 54.7639 42.6916 54.0272 42.5121 53.1442C42.3327 52.2611 42.5995 51.345 43.3125 50.3958C50.632 40.3611 59.812 32.5694 70.8525 27.0208C81.8931 21.4722 93.668 18.6979 106.177 18.6979C118.691 18.6979 130.497 21.3849 141.594 26.7587C152.691 32.1326 161.958 39.8936 169.396 50.0417C170.222 51.1042 170.489 52.0486 170.196 52.875C169.904 53.7014 169.401 54.4097 168.688 55C167.979 55.5903 167.153 55.8571 166.208 55.8004C165.264 55.7437 164.438 55.2408 163.729 54.2917C157.236 45.0833 148.885 38.0307 138.675 33.1337C128.466 28.2368 117.633 25.786 106.177 25.7812C94.7257 25.7812 83.9827 28.2321 73.948 33.1337C63.9132 38.0354 55.5903 45.0881 48.9792 54.2917C48.2709 55.3542 47.4445 55.9444 46.5 56.0625C45.5556 56.1806 44.7292 55.9444 44.0209 55.3542ZM126.188 142.656C113.91 139.587 103.875 133.476 96.0834 124.325C88.2917 115.173 84.3959 103.988 84.3959 90.7708C84.3959 84.8681 86.5209 79.9097 90.7709 75.8958C95.0209 71.8819 100.156 69.875 106.177 69.875C112.198 69.875 117.333 71.8819 121.583 75.8958C125.833 79.9097 127.958 84.8681 127.958 90.7708C127.958 94.6667 129.434 97.9439 132.385 100.602C135.337 103.261 138.819 104.588 142.833 104.583C146.847 104.583 150.271 103.256 153.104 100.602C155.938 97.9486 157.354 94.6714 157.354 90.7708C157.354 77.0764 152.337 65.566 142.302 56.2396C132.267 46.9132 120.285 42.25 106.354 42.25C92.4237 42.25 80.441 46.9132 70.4063 56.2396C60.3716 65.566 55.3542 77.0174 55.3542 90.5937C55.3542 93.4271 55.621 96.9687 56.1546 101.219C56.6882 105.469 57.9562 110.427 59.9584 116.094C60.3125 117.156 60.2842 118.101 59.8734 118.927C59.4625 119.753 58.7825 120.344 57.8334 120.698C56.8889 121.052 55.9752 121.024 55.0921 120.613C54.2091 120.202 53.5881 119.522 53.2292 118.573C51.4584 113.969 50.1905 109.395 49.4255 104.853C48.6605 100.31 48.2756 95.6158 48.2709 90.7708C48.2709 75.0694 53.9682 61.9062 65.363 51.2812C76.7577 40.6562 90.3624 35.3437 106.177 35.3437C122.115 35.3437 135.809 40.6562 147.26 51.2812C158.712 61.9062 164.438 75.0694 164.438 90.7708C164.438 96.6736 162.343 101.601 158.155 105.554C153.966 109.506 148.859 111.485 142.833 111.49C136.813 111.49 131.649 109.513 127.342 105.561C123.035 101.608 120.88 96.6783 120.875 90.7708C120.875 86.875 119.43 83.5978 116.54 80.9392C113.65 78.2805 110.196 76.9536 106.177 76.9583C102.163 76.9583 98.7089 78.2876 95.8142 80.9462C92.9195 83.6049 91.4745 86.8797 91.4792 90.7708C91.4792 102.222 94.8745 111.785 101.665 119.458C108.456 127.132 117.22 132.503 127.958 135.573C129.021 135.927 129.729 136.517 130.083 137.344C130.438 138.17 130.497 139.056 130.26 140C130.024 140.826 129.552 141.535 128.844 142.125C128.135 142.715 127.25 142.892 126.188 142.656ZM67.0417 18.3437C66.0973 18.934 65.1528 19.0828 64.2084 18.79C63.2639 18.4972 62.5556 17.8762 62.0834 16.9271C61.6112 15.9826 61.4931 15.1279 61.7292 14.3629C61.9653 13.5979 62.5556 12.9179 63.5 12.3229C70.1112 8.78125 77.0174 6.06597 84.2188 4.17708C91.4202 2.28819 98.7396 1.34375 106.177 1.34375C113.733 1.34375 121.111 2.25986 128.313 4.09208C135.514 5.92431 142.479 8.54986 149.208 11.9687C150.271 12.559 150.892 13.2674 151.071 14.0937C151.251 14.9201 151.161 15.7465 150.802 16.5729C150.448 17.3993 149.858 18.0486 149.031 18.5208C148.205 18.9931 147.201 18.934 146.021 18.3437C139.764 15.1563 133.299 12.7078 126.627 10.9983C119.954 9.28889 113.138 8.43181 106.177 8.42708C99.3299 8.42708 92.6007 9.22514 85.9896 10.8212C79.3785 12.4174 73.0625 14.9249 67.0417 18.3437ZM87.9375 140.177C80.9723 132.858 75.6314 125.392 71.915 117.78C68.1987 110.167 66.3381 101.164 66.3334 90.7708C66.3334 80.0278 70.2292 70.9658 78.0209 63.585C85.8125 56.2042 95.198 52.5161 106.177 52.5208C117.156 52.5208 126.601 56.2112 134.51 63.5921C142.42 70.9729 146.375 80.0325 146.375 90.7708C146.375 91.8333 146.052 92.6904 145.405 93.3421C144.758 93.9937 143.901 94.3172 142.833 94.3125C141.889 94.3125 141.063 93.989 140.354 93.3421C139.646 92.6951 139.292 91.8381 139.292 90.7708C139.292 81.9167 136.014 74.5099 129.46 68.5504C122.906 62.591 115.145 59.6089 106.177 59.6042C97.2049 59.6042 89.503 62.5862 83.0713 68.5504C76.6396 74.5146 73.4214 81.9214 73.4167 90.7708C73.4167 100.333 75.0695 108.451 78.375 115.123C81.6806 121.796 86.5209 128.494 92.8959 135.219C93.6042 135.927 93.9584 136.753 93.9584 137.698C93.9584 138.642 93.6042 139.469 92.8959 140.177C92.1875 140.885 91.3612 141.24 90.4167 141.24C89.4723 141.24 88.6459 140.885 87.9375 140.177ZM141.417 128.135C130.91 128.135 121.789 124.594 114.054 117.51C106.319 110.427 102.454 101.514 102.458 90.7708C102.458 89.8264 102.784 89 103.436 88.2917C104.088 87.5833 104.942 87.2292 106 87.2292C107.063 87.2292 107.92 87.5833 108.571 88.2917C109.223 89 109.546 89.8264 109.542 90.7708C109.542 99.625 112.729 106.885 119.104 112.552C125.479 118.219 132.917 121.052 141.417 121.052C142.125 121.052 143.129 120.993 144.427 120.875C145.726 120.757 147.083 120.58 148.5 120.344C149.563 120.108 150.479 120.256 151.248 120.79C152.018 121.324 152.519 122.119 152.75 123.177C152.986 124.122 152.809 124.948 152.219 125.656C151.629 126.365 150.861 126.837 149.917 127.073C147.792 127.663 145.934 127.989 144.342 128.05C142.751 128.112 141.776 128.14 141.417 128.135Z"
                                            fill="currentColor"
                                        />
                                        <g clipPath="url(#clip0_0_1)">
                                            <path
                                                d="M44.0209 55.3542C43.1945 54.7639 42.6916 54.0272 42.5121 53.1442C42.3327 52.2611 42.5995 51.345 43.3125 50.3958C50.632 40.3611 59.812 32.5694 70.8525 27.0208C81.8931 21.4722 93.668 18.6979 106.177 18.6979C118.691 18.6979 130.497 21.3849 141.594 26.7587C152.691 32.1326 161.958 39.8936 169.396 50.0417C170.222 51.1042 170.489 52.0486 170.196 52.875C169.904 53.7014 169.401 54.4097 168.688 55C167.979 55.5903 167.153 55.8571 166.208 55.8004C165.264 55.7437 164.438 55.2408 163.729 54.2917C157.236 45.0833 148.885 38.0307 138.675 33.1337C128.466 28.2368 117.633 25.786 106.177 25.7812C94.7257 25.7812 83.9827 28.2321 73.948 33.1337C63.9132 38.0354 55.5903 45.0881 48.9792 54.2917C48.2709 55.3542 47.4445 55.9444 46.5 56.0625C45.5556 56.1806 44.7292 55.9444 44.0209 55.3542ZM126.188 142.656C113.91 139.587 103.875 133.476 96.0834 124.325C88.2917 115.173 84.3959 103.988 84.3959 90.7708C84.3959 84.8681 86.5209 79.9097 90.7709 75.8958C95.0209 71.8819 100.156 69.875 106.177 69.875C112.198 69.875 117.333 71.8819 121.583 75.8958C125.833 79.9097 127.958 84.8681 127.958 90.7708C127.958 94.6667 129.434 97.9439 132.385 100.602C135.337 103.261 138.819 104.588 142.833 104.583C146.847 104.583 150.271 103.256 153.104 100.602C155.938 97.9486 157.354 94.6714 157.354 90.7708C157.354 77.0764 152.337 65.566 142.302 56.2396C132.267 46.9132 120.285 42.25 106.354 42.25C92.4237 42.25 80.441 46.9132 70.4063 56.2396C60.3716 65.566 55.3542 77.0174 55.3542 90.5937C55.3542 93.4271 55.621 96.9687 56.1546 101.219C56.6882 105.469 57.9562 110.427 59.9584 116.094C60.3125 117.156 60.2842 118.101 59.8734 118.927C59.4625 119.753 58.7825 120.344 57.8334 120.698C56.8889 121.052 55.9752 121.024 55.0921 120.613C54.2091 120.202 53.5881 119.522 53.2292 118.573C51.4584 113.969 50.1905 109.395 49.4255 104.853C48.6605 100.31 48.2756 95.6158 48.2709 90.7708C48.2709 75.0694 53.9682 61.9062 65.363 51.2812C76.7577 40.6562 90.3624 35.3437 106.177 35.3437C122.115 35.3437 135.809 40.6562 147.26 51.2812C158.712 61.9062 164.438 75.0694 164.438 90.7708C164.438 96.6736 162.343 101.601 158.155 105.554C153.966 109.506 148.859 111.485 142.833 111.49C136.813 111.49 131.649 109.513 127.342 105.561C123.035 101.608 120.88 96.6783 120.875 90.7708C120.875 86.875 119.43 83.5978 116.54 80.9392C113.65 78.2805 110.196 76.9536 106.177 76.9583C102.163 76.9583 98.7089 78.2876 95.8142 80.9462C92.9195 83.6049 91.4745 86.8797 91.4792 90.7708C91.4792 102.222 94.8745 111.785 101.665 119.458C108.456 127.132 117.22 132.503 127.958 135.573C129.021 135.927 129.729 136.517 130.083 137.344C130.438 138.17 130.497 139.056 130.26 140C130.024 140.826 129.552 141.535 128.844 142.125C128.135 142.715 127.25 142.892 126.188 142.656ZM67.0417 18.3437C66.0973 18.934 65.1528 19.0828 64.2084 18.79C63.2639 18.4972 62.5556 17.8762 62.0834 16.9271C61.6112 15.9826 61.4931 15.1279 61.7292 14.3629C61.9653 13.5979 62.5556 12.9179 63.5 12.3229C70.1112 8.78125 77.0174 6.06597 84.2188 4.17708C91.4202 2.28819 98.7396 1.34375 106.177 1.34375C113.733 1.34375 121.111 2.25986 128.313 4.09208C135.514 5.92431 142.479 8.54986 149.208 11.9687C150.271 12.559 150.892 13.2674 151.071 14.0937C151.251 14.9201 151.161 15.7465 150.802 16.5729C150.448 17.3993 149.858 18.0486 149.031 18.5208C148.205 18.9931 147.201 18.934 146.021 18.3437C139.764 15.1563 133.299 12.7078 126.627 10.9983C119.954 9.28889 113.138 8.43181 106.177 8.42708C99.3299 8.42708 92.6007 9.22514 85.9896 10.8212C79.3785 12.4174 73.0625 14.9249 67.0417 18.3437ZM87.9375 140.177C80.9723 132.858 75.6314 125.392 71.915 117.78C68.1987 110.167 66.3381 101.164 66.3334 90.7708C66.3334 80.0278 70.2292 70.9658 78.0209 63.585C85.8125 56.2042 95.198 52.5161 106.177 52.5208C117.156 52.5208 126.601 56.2112 134.51 63.5921C142.42 70.9729 146.375 80.0325 146.375 90.7708C146.375 91.8333 146.052 92.6904 145.405 93.3421C144.758 93.9937 143.901 94.3172 142.833 94.3125C141.889 94.3125 141.063 93.989 140.354 93.3421C139.646 92.6951 139.292 91.8381 139.292 90.7708C139.292 81.9167 136.014 74.5099 129.46 68.5504C122.906 62.591 115.145 59.6089 106.177 59.6042C97.2049 59.6042 89.503 62.5862 83.0713 68.5504C76.6396 74.5146 73.4214 81.9214 73.4167 90.7708C73.4167 100.333 75.0695 108.451 78.375 115.123C81.6806 121.796 86.5209 128.494 92.8959 135.219C93.6042 135.927 93.9584 136.753 93.9584 137.698C93.9584 138.642 93.6042 139.469 92.8959 140.177C92.1875 140.885 91.3612 141.24 90.4167 141.24C89.4723 141.24 88.6459 140.885 87.9375 140.177ZM141.417 128.135C130.91 128.135 121.789 124.594 114.054 117.51C106.319 110.427 102.454 101.514 102.458 90.7708C102.458 89.8264 102.784 89 103.436 88.2917C104.088 87.5833 104.942 87.2292 106 87.2292C107.063 87.2292 107.92 87.5833 108.571 88.2917C109.223 89 109.546 89.8264 109.542 90.7708C109.542 99.625 112.729 106.885 119.104 112.552C125.479 118.219 132.917 121.052 141.417 121.052C142.125 121.052 143.129 120.993 144.427 120.875C145.726 120.757 147.083 120.58 148.5 120.344C149.563 120.108 150.479 120.256 151.248 120.79C152.018 121.324 152.519 122.119 152.75 123.177C152.986 124.122 152.809 124.948 152.219 125.656C151.629 126.365 150.861 126.837 149.917 127.073C147.792 127.663 145.934 127.989 144.342 128.05C142.751 128.112 141.776 128.14 141.417 128.135Z"
                                                fill="url(#paint0_linear_0_1)"
                                            />
                                        </g>
                                        <path
                                            className="text-primary-600 dark:text-primary-500"
                                            d="M3 72H209"
                                            stroke="currentColor"
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="paint0_linear_0_1"
                                                x1="106.385"
                                                y1="1.34375"
                                                x2="106"
                                                y2="72"
                                                gradientUnits="userSpaceOnUse">
                                                <stop
                                                    stopColor="white"
                                                    stopOpacity="0"
                                                />
                                                <stop
                                                    className="text-primary-600 dark:text-primary-500"
                                                    offset="1"
                                                    stopColor="currentColor"
                                                />
                                            </linearGradient>
                                            <clipPath id="clip0_0_1">
                                                <rect
                                                    width="129"
                                                    height="72"
                                                    fill="white"
                                                    transform="translate(41)"
                                                />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="relative z-10 mt-6 space-y-2 text-center">
                                    <h2 className="group-hover:text-secondary-950 text-lg font-medium transition dark:text-white">Secure by default</h2>
                                    <p className="text-foreground">Provident fugit and vero voluptate. magnam magni doloribus dolores voluptates a sapiente nisi.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
                            <CardContent className="pt-6">
                                <div className="pt-6 lg:px-6">
                                    <svg
                                        className="dark:text-muted-foreground w-full"
                                        viewBox="0 0 386 123"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <rect
                                            width="386"
                                            height="123"
                                            rx="10"
                                        />
                                        <g clipPath="url(#clip0_0_106)">
                                            <circle
                                                className="text-muted-foreground dark:text-muted"
                                                cx="29"
                                                cy="29"
                                                r="15"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M29 23V35"
                                                stroke="white"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M35 29L29 35L23 29"
                                                stroke="white"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M55.2373 32H58.7988C61.7383 32 63.4404 30.1816 63.4404 27.0508V27.0371C63.4404 23.9404 61.7246 22.1357 58.7988 22.1357H55.2373V32ZM56.7686 30.6807V23.4551H58.6279C60.6719 23.4551 61.8818 24.7881 61.8818 27.0576V27.0713C61.8818 29.3613 60.6924 30.6807 58.6279 30.6807H56.7686ZM69.4922 32.1436C71.666 32.1436 72.999 30.6875 72.999 28.2949V28.2812C72.999 25.8887 71.6592 24.4326 69.4922 24.4326C67.3184 24.4326 65.9785 25.8955 65.9785 28.2812V28.2949C65.9785 30.6875 67.3115 32.1436 69.4922 32.1436ZM69.4922 30.9062C68.2139 30.9062 67.4961 29.9424 67.4961 28.2949V28.2812C67.4961 26.6338 68.2139 25.6699 69.4922 25.6699C70.7637 25.6699 71.4883 26.6338 71.4883 28.2812V28.2949C71.4883 29.9355 70.7637 30.9062 69.4922 30.9062ZM76.9111 32H78.4219L79.9531 26.4629H80.0693L81.6074 32H83.1318L85.1758 24.5762H83.7061L82.3799 30.3047H82.2637L80.7324 24.5762H79.3242L77.793 30.3047H77.6836L76.3506 24.5762H74.8604L76.9111 32ZM87.6934 32H89.1768V27.6455C89.1768 26.4492 89.8535 25.7041 90.9404 25.7041C92.0273 25.7041 92.54 26.3125 92.54 27.543V32H94.0166V27.1943C94.0166 25.4238 93.1006 24.4326 91.4395 24.4326C90.3594 24.4326 89.6484 24.9111 89.2861 25.7041H89.1768V24.5762H87.6934V32ZM97.1562 32H98.6396V21.6641H97.1562V32ZM104.992 32.1436C107.166 32.1436 108.499 30.6875 108.499 28.2949V28.2812C108.499 25.8887 107.159 24.4326 104.992 24.4326C102.818 24.4326 101.479 25.8955 101.479 28.2812V28.2949C101.479 30.6875 102.812 32.1436 104.992 32.1436ZM104.992 30.9062C103.714 30.9062 102.996 29.9424 102.996 28.2949V28.2812C102.996 26.6338 103.714 25.6699 104.992 25.6699C106.264 25.6699 106.988 26.6338 106.988 28.2812V28.2949C106.988 29.9355 106.264 30.9062 104.992 30.9062ZM113.307 32.123C114.291 32.123 115.07 31.6992 115.508 30.9473H115.624V32H117.094V26.9209C117.094 25.3623 116.041 24.4326 114.175 24.4326C112.486 24.4326 111.317 25.2461 111.14 26.4629L111.133 26.5107H112.562L112.568 26.4834C112.746 25.957 113.286 25.6562 114.106 25.6562C115.111 25.6562 115.624 26.1074 115.624 26.9209V27.5771L113.614 27.6934C111.844 27.8027 110.846 28.5752 110.846 29.9014V29.915C110.846 31.2617 111.892 32.123 113.307 32.123ZM112.322 29.8535V29.8398C112.322 29.1699 112.787 28.8008 113.812 28.7393L115.624 28.623V29.2588C115.624 30.2158 114.811 30.9404 113.703 30.9404C112.903 30.9404 112.322 30.5371 112.322 29.8535ZM122.893 32.123C123.932 32.123 124.745 31.6445 125.176 30.8311H125.292V32H126.769V21.6641H125.292V25.752H125.176C124.779 24.9521 123.911 24.4463 122.893 24.4463C121.006 24.4463 119.816 25.9297 119.816 28.2812V28.2949C119.816 30.626 121.026 32.123 122.893 32.123ZM123.316 30.8584C122.072 30.8584 121.327 29.8877 121.327 28.2949V28.2812C121.327 26.6885 122.072 25.7178 123.316 25.7178C124.547 25.7178 125.312 26.6953 125.312 28.2812V28.2949C125.312 29.8809 124.554 30.8584 123.316 30.8584Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M268.324 34H269.906V21.3174H268.333L264.958 23.7432V25.4131L268.184 23.0752H268.324V34ZM280.363 34H281.91V31.3721H283.712V29.957H281.91V21.3174H279.616C277.841 23.9629 275.898 27.0566 274.185 29.9307V31.3721H280.363V34ZM275.802 29.9658V29.8604C277.182 27.5312 278.843 24.9121 280.267 22.7852H280.372V29.9658H275.802ZM286.162 37.2256H287.296L288.676 32.2246H286.927L286.162 37.2256ZM296.672 34.2109C299.212 34.2109 301.075 32.6465 301.075 30.5283V30.5107C301.075 28.709 299.818 27.5576 297.973 27.3994V27.3643C299.555 27.0303 300.662 25.958 300.662 24.3936V24.376C300.662 22.4512 299.071 21.1064 296.654 21.1064C294.281 21.1064 292.646 22.4863 292.444 24.5518L292.436 24.6396H293.956L293.965 24.5518C294.097 23.2686 295.16 22.4775 296.654 22.4775C298.201 22.4775 299.071 23.2422 299.071 24.5693V24.5869C299.071 25.8525 298.017 26.7842 296.505 26.7842H294.984V28.1201H296.575C298.351 28.1201 299.467 28.9902 299.467 30.5459V30.5635C299.467 31.9082 298.333 32.8398 296.672 32.8398C294.984 32.8398 293.833 31.9785 293.71 30.7305L293.701 30.6426H292.181L292.189 30.748C292.356 32.752 294.053 34.2109 296.672 34.2109ZM310.434 34H311.98V31.3721H313.782V29.957H311.98V21.3174H309.687C307.911 23.9629 305.969 27.0566 304.255 29.9307V31.3721H310.434V34ZM305.872 29.9658V29.8604C307.252 27.5312 308.913 24.9121 310.337 22.7852H310.442V29.9658H305.872ZM323.297 34H324.826V28.1289C324.826 26.793 325.767 25.7119 327.006 25.7119C328.201 25.7119 328.975 26.4414 328.975 27.5664V34H330.504V27.9092C330.504 26.7051 331.374 25.7119 332.692 25.7119C334.028 25.7119 334.67 26.4062 334.67 27.8037V34H336.199V27.4521C336.199 25.4658 335.118 24.3584 333.185 24.3584C331.875 24.3584 330.794 25.0176 330.284 26.0195H330.144C329.704 25.0352 328.808 24.3584 327.524 24.3584C326.285 24.3584 325.389 24.9473 324.967 25.9668H324.826V24.5254H323.297V34ZM344.67 34.167C347.069 34.167 348.643 32.2246 348.643 29.2715V29.2539C348.643 26.2832 347.078 24.3584 344.67 24.3584C343.369 24.3584 342.235 25.0088 341.717 26.0195H341.576V20.7637H340.047V34H341.576V32.4883H341.717C342.297 33.543 343.352 34.167 344.67 34.167ZM344.318 32.8135C342.596 32.8135 341.541 31.46 341.541 29.2715V29.2539C341.541 27.0654 342.596 25.7119 344.318 25.7119C346.05 25.7119 347.078 27.0479 347.078 29.2539V29.2715C347.078 31.4775 346.05 32.8135 344.318 32.8135ZM352.016 37.1641H353.545V32.5059H353.686C354.204 33.5166 355.338 34.167 356.639 34.167C359.047 34.167 360.611 32.2422 360.611 29.2715V29.2539C360.611 26.3008 359.038 24.3584 356.639 24.3584C355.32 24.3584 354.266 24.9824 353.686 26.0371H353.545V24.5254H352.016V37.1641ZM356.287 32.8135C354.564 32.8135 353.51 31.46 353.51 29.2715V29.2539C353.51 27.0654 354.564 25.7119 356.287 25.7119C358.019 25.7119 359.047 27.0479 359.047 29.2539V29.2715C359.047 31.4775 358.019 32.8135 356.287 32.8135ZM367.254 34.167C369.407 34.167 371.051 32.998 371.051 31.3105V31.293C371.051 29.9395 370.189 29.166 368.405 28.7354L366.946 28.3838C365.83 28.1113 365.355 27.707 365.355 27.0654V27.0479C365.355 26.2129 366.182 25.6328 367.307 25.6328C368.449 25.6328 369.188 26.1514 369.39 26.8984H370.893C370.682 25.3516 369.302 24.3584 367.315 24.3584C365.303 24.3584 363.791 25.5449 363.791 27.1182V27.127C363.791 28.4893 364.591 29.2627 366.366 29.6846L367.834 30.0361C369.003 30.3174 369.486 30.7656 369.486 31.4072V31.4248C369.486 32.2861 368.581 32.8926 367.307 32.8926C366.094 32.8926 365.338 32.374 365.083 31.583H363.519C363.694 33.1475 365.145 34.167 367.254 34.167Z"
                                                fill="currentColor"
                                            />
                                        </g>
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M3 123C3 123 14.3298 94.153 35.1282 88.0957C55.9266 82.0384 65.9333 80.5508 65.9333 80.5508C65.9333 80.5508 80.699 80.5508 92.1777 80.5508C103.656 80.5508 100.887 63.5348 109.06 63.5348C117.233 63.5348 117.217 91.9728 124.78 91.9728C132.343 91.9728 142.264 78.03 153.831 80.5508C165.398 83.0716 186.825 91.9728 193.761 91.9728C200.697 91.9728 206.296 63.5348 214.07 63.5348C221.844 63.5348 238.653 93.7771 244.234 91.9728C249.814 90.1684 258.8 60 266.19 60C272.075 60 284.1 88.057 286.678 88.0957C294.762 88.2171 300.192 72.9284 305.423 72.9284C312.323 72.9284 323.377 65.2437 335.553 63.5348C347.729 61.8259 348.218 82.07 363.639 80.5508C367.875 80.1335 372.949 82.2017 376.437 87.1008C379.446 91.3274 381.054 97.4325 382.521 104.647C383.479 109.364 382.521 123 382.521 123"
                                            fill="url(#paint0_linear_0_106)"
                                        />
                                        <path
                                            className="text-primary-600 dark:text-primary-500"
                                            d="M3 121.077C3 121.077 15.3041 93.6691 36.0195 87.756C56.7349 81.8429 66.6632 80.9723 66.6632 80.9723C66.6632 80.9723 80.0327 80.9723 91.4656 80.9723C102.898 80.9723 100.415 64.2824 108.556 64.2824C116.696 64.2824 117.693 92.1332 125.226 92.1332C132.759 92.1332 142.07 78.5115 153.591 80.9723C165.113 83.433 186.092 92.1332 193 92.1332C199.908 92.1332 205.274 64.2824 213.017 64.2824C220.76 64.2824 237.832 93.8946 243.39 92.1332C248.948 90.3718 257.923 60.5 265.284 60.5C271.145 60.5 283.204 87.7182 285.772 87.756C293.823 87.8746 299.2 73.0802 304.411 73.0802C311.283 73.0802 321.425 65.9506 333.552 64.2824C345.68 62.6141 346.91 82.4553 362.27 80.9723C377.629 79.4892 383 106.605 383 106.605"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="paint0_linear_0_106"
                                                x1="3"
                                                y1="60"
                                                x2="3"
                                                y2="123"
                                                gradientUnits="userSpaceOnUse">
                                                <stop
                                                    className="text-primary/15 dark:text-primary/35"
                                                    stopColor="currentColor"
                                                />
                                                <stop
                                                    className="text-transparent"
                                                    offset="1"
                                                    stopColor="currentColor"
                                                    stopOpacity="0.103775"
                                                />
                                            </linearGradient>
                                            <clipPath id="clip0_0_106">
                                                <rect
                                                    width="358"
                                                    height="30"
                                                    fill="white"
                                                    transform="translate(14 14)"
                                                />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="relative z-10 mt-14 space-y-2 text-center">
                                    <h2 className="text-lg font-medium transition">Faster than light</h2>
                                    <p className="text-foreground">Provident fugit vero voluptate. magnam magni doloribus dolores voluptates inventore nisi.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="card variant-outlined relative col-span-full overflow-hidden lg:col-span-3">
                            <CardContent className="grid pt-6 sm:grid-cols-2">
                                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                                    <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                        <Shield
                                            className="m-auto size-5"
                                            strokeWidth={1}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="group-hover:text-secondary-950 text-lg font-medium text-zinc-800 transition dark:text-white">Faster than light</h2>
                                        <p className="text-foreground">Provident fugit vero voluptate. Voluptates a sapiente inventore nisi.</p>
                                    </div>
                                </div>
                                <div className="rounded-tl-(--radius) relative -mb-6 -mr-6 mt-6 h-fit border-l border-t p-6 py-6 sm:ml-6">
                                    <div className="absolute left-3 top-2 flex gap-1">
                                        <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                                        <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                                        <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                                    </div>
                                    <svg
                                        className="w-full sm:w-[150%]"
                                        viewBox="0 0 366 231"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M0.148438 231V179.394L1.92188 180.322L2.94482 177.73L4.05663 183.933L6.77197 178.991L7.42505 184.284L9.42944 187.985L11.1128 191.306V155.455L13.6438 153.03V145.122L14.2197 142.829V150.454V154.842L15.5923 160.829L17.0793 172.215H19.2031V158.182L20.7441 153.03L22.426 148.111V142.407L24.7471 146.86V128.414L26.7725 129.918V120.916L28.1492 118.521L28.4653 127.438L29.1801 123.822L31.0426 120.525V130.26L32.3559 134.71L34.406 145.122V137.548L35.8982 130.26L37.1871 126.049L38.6578 134.71L40.659 138.977V130.26V126.049L43.7557 130.26V123.822L45.972 112.407L47.3391 103.407V92.4726L49.2133 98.4651V106.053L52.5797 89.7556L54.4559 82.7747L56.1181 87.9656L58.9383 89.7556V98.4651L60.7617 103.407L62.0545 123.822L63.8789 118.066L65.631 122.082L68.5479 114.229L70.299 109.729L71.8899 118.066L73.5785 123.822V130.26L74.9446 134.861L76.9243 127.87L78.352 134.71V138.977L80.0787 142.407V152.613L83.0415 142.407V130.26L86.791 123.822L89.0121 116.645V122.082L90.6059 127.87L92.3541 131.77L93.7104 123.822L95.4635 118.066L96.7553 122.082V137.548L99.7094 140.988V131.77L101.711 120.525L103.036 116.645V133.348L104.893 136.218L106.951 140.988L108.933 134.71L110.797 130.26L112.856 140.988V148.111L115.711 152.613L117.941 145.122L119.999 140.988V148.111L123.4 152.613L125.401 158.182L130.547 150.454V156.566L131.578 155.455L134.143 158.182L135.594 168.136L138.329 158.182L140.612 160.829L144.681 169.5L147.011 155.455L148.478 151.787L151.02 152.613L154.886 145.122L158 143.412L159.406 140.637L159.496 133.348L162.295 127.87V122.082L163.855 116.645V109.729L164.83 104.407L166.894 109.729L176.249 98.4651L178.254 106.169L180.77 98.4651V81.045L182.906 69.1641L184.8 56.8669L186.477 62.8428L187.848 79.7483L188.849 106.169L191.351 79.7483L193.485 75.645V98.4651L196.622 94.4523L198.623 87.4228V79.7483L200.717 75.645L202.276 81.045V89.3966L203.638 113.023L205.334 99.8037L207.164 94.4523L208.982 98.4651V102.176L211.267 107.64L212.788 81.045L214.437 66.0083L216.19 62.8428L217.941 56.8669V73.676V79.7483L220.28 75.645L222.516 66.0083V73.676H226.174V84.8662L228.566 98.4651L230.316 75.645L233.61 94.4523V104.25L236.882 102.176L239.543 113.023L241.057 98.4651L243.604 94.4523L244.975 106.169L245.975 87.4228L247.272 89.3966L250.732 84.8662L251.733 96.7549L254.644 94.4523L257.452 99.8037L259.853 91.3111L261.193 84.8662L264.162 75.645L265.808 87.4228L267.247 58.4895L269.757 66.0083L276.625 13.5146L273.33 58.4895L276.25 67.6563L282.377 20.1968L281.37 58.4895V66.0083L283.579 75.645L286.033 56.8669L287.436 73.676L290.628 77.6636L292.414 84.8662L294.214 61.3904L296.215 18.9623L300.826 0.947876L297.531 56.8669L299.973 62.8428L305.548 22.0598L299.755 114.956L301.907 105.378L304.192 112.688V94.9932L308.009 80.0829L310.003 94.9932L311.004 102.127L312.386 105.378L315.007 112.688L316.853 98.004L318.895 105.378L321.257 94.9932L324.349 100.81L325.032 80.0829L327.604 61.5733L329.308 82.3223L333.525 52.7986L334.097 52.145L334.735 55.6812L337.369 59.8108V73.676L340.743 87.9656L343.843 96.3728L348.594 82.7747L349.607 81.045L351 89.7556L352.611 96.3728L355.149 94.9932L356.688 102.176L359.396 108.784L360.684 111.757L365 95.7607V231H148.478H0.148438Z"
                                            fill="url(#paint0_linear_0_705)"
                                        />
                                        <path
                                            className="text-primary-600 dark:text-primary-500"
                                            d="M1 179.796L4.05663 172.195V183.933L7.20122 174.398L8.45592 183.933L10.0546 186.948V155.455L12.6353 152.613V145.122L15.3021 134.71V149.804V155.455L16.6916 160.829L18.1222 172.195V158.182L19.8001 152.613L21.4105 148.111V137.548L23.6863 142.407V126.049L25.7658 127.87V120.525L27.2755 118.066L29.1801 112.407V123.822L31.0426 120.525V130.26L32.3559 134.71L34.406 145.122V137.548L35.8982 130.26L37.1871 126.049L38.6578 134.71L40.659 138.977V130.26V126.049L43.7557 130.26V123.822L45.972 112.407L47.3391 103.407V92.4726L49.2133 98.4651V106.053L52.5797 89.7556L54.4559 82.7747L56.1181 87.9656L58.9383 89.7556V98.4651L60.7617 103.407L62.0545 123.822L63.8789 118.066L65.631 122.082L68.5479 114.229L70.299 109.729L71.8899 118.066L73.5785 123.822V130.26L74.9446 134.861L76.9243 127.87L78.352 134.71V138.977L80.0787 142.407V152.613L83.0415 142.407V130.26L86.791 123.822L89.0121 116.645V122.082L90.6059 127.87L92.3541 131.77L93.7104 123.822L95.4635 118.066L96.7553 122.082V137.548L99.7094 140.988V131.77L101.711 120.525L103.036 116.645V133.348L104.893 136.218L106.951 140.988L108.933 134.71L110.797 130.26L112.856 140.988V148.111L115.711 152.613L117.941 145.122L119.999 140.988L121.501 148.111L123.4 152.613L125.401 158.182L127.992 152.613L131.578 146.76V155.455L134.143 158.182L135.818 164.629L138.329 158.182L140.612 160.829L144.117 166.757L146.118 155.455L147.823 149.804L151.02 152.613L154.886 145.122L158.496 140.988V133.348L161.295 127.87V122.082L162.855 116.645V109.729L164.83 103.407L166.894 109.729L176.249 98.4651L178.254 106.169L180.77 98.4651V81.045L182.906 69.1641L184.8 56.8669L186.477 62.8428L187.848 79.7483L188.849 106.169L191.351 79.7483L193.485 75.645V98.4651L196.622 94.4523L198.623 87.4228V79.7483L200.717 75.645L202.276 81.045V89.3966L203.638 113.023L205.334 99.8037L207.164 94.4523L208.982 98.4651V102.176L211.267 107.64L212.788 81.045L214.437 66.0083L216.19 62.8428L217.941 56.8669V73.676V79.7483L220.28 75.645L222.516 66.0083V73.676H226.174V84.8662L228.566 98.4651L230.316 75.645L233.61 94.4523V104.25L236.882 102.176L239.543 113.023L241.057 98.4651L243.604 94.4523L244.975 106.169L245.975 87.4228L247.272 89.3966L250.732 84.8662L251.733 96.7549L254.644 94.4523L257.452 99.8037L259.853 91.3111L261.193 84.8662L264.162 75.645L265.808 87.4228L267.247 58.4895L269.757 66.0083L276.625 13.5146L273.33 58.4895L276.25 67.6563L282.377 20.1968L281.37 58.4895V66.0083L283.579 75.645L286.033 56.8669L287.436 73.676L290.628 77.6636L292.414 84.8662L294.214 61.3904L296.215 18.9623L300.826 0.947876L297.531 56.8669L299.973 62.8428L305.548 22.0598L299.755 114.956L301.907 105.378L304.192 112.688V94.9932L308.009 80.0829L310.003 94.9932L311.004 102.127L312.386 105.378L315.007 112.688L316.853 98.004L318.895 105.378L321.257 94.9932L324.349 100.81L325.032 80.0829L327.604 61.5733L329.357 74.9864L332.611 52.6565L334.352 48.5552L335.785 55.2637L338.377 59.5888V73.426L341.699 87.5181L343.843 93.4347L347.714 82.1171L350.229 78.6821L351.974 89.7556L353.323 94.9932L355.821 93.4347L357.799 102.127L360.684 108.794L363.219 98.004L365 89.7556"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="paint0_linear_0_705"
                                                x1="0.85108"
                                                y1="0.947876"
                                                x2="0.85108"
                                                y2="230.114"
                                                gradientUnits="userSpaceOnUse">
                                                <stop
                                                    className="text-primary/15 dark:text-primary/35"
                                                    stopColor="currentColor"
                                                />
                                                <stop
                                                    className="text-transparent"
                                                    offset="1"
                                                    stopColor="currentColor"
                                                    stopOpacity="0.01"
                                                />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="card variant-outlined relative col-span-full overflow-hidden lg:col-span-3">
                            <CardContent className="grid h-full pt-6 sm:grid-cols-2">
                                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                                    <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                        <Users
                                            className="m-auto size-6"
                                            strokeWidth={1}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-lg font-medium transition">Keep your loved ones safe</h2>
                                        <p className="text-foreground">Voluptate. magnam magni doloribus dolores voluptates a sapiente inventore nisi.</p>
                                    </div>
                                </div>
                                <div className="before:bg-(--color-border) relative mt-6 before:absolute before:inset-0 before:mx-auto before:w-px sm:-my-6 sm:-mr-6">
                                    <div className="relative flex h-full flex-col justify-center space-y-6 py-6">
                                        <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                                            <span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm">Likeur</span>
                                            <div className="ring-background size-7 ring-4">
                                                <img
                                                    className="size-full rounded-full"
                                                    src="https://avatars.githubusercontent.com/u/102558960?v=4"
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="relative ml-[calc(50%-1rem)] flex items-center gap-2">
                                            <div className="ring-background size-8 ring-4">
                                                <img
                                                    className="size-full rounded-full"
                                                    src="https://avatars.githubusercontent.com/u/47919550?v=4"
                                                    alt=""
                                                />
                                            </div>
                                            <span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm">M. Irung</span>
                                        </div>
                                        <div className="relative flex w-[calc(50%+0.875rem)] items-center justify-end gap-2">
                                            <span className="block h-fit rounded border px-2 py-1 text-xs shadow-sm">B. Ng</span>
                                            <div className="ring-background size-7 ring-4">
                                                <img
                                                    className="size-full rounded-full"
                                                    src="https://avatars.githubusercontent.com/u/31113941?v=4"
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## Features Block 10 (features-10)
- Source: https://tailark.com/r/features-10.json
- Description: Shadcn/ui website features block with cards and circular UI elements
- Registry dependencies: card
### ../../packages/dusk-kit/blocks/features/ten/index.tsx (registry:component) -> components/features-10.tsx
```tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Calendar, LucideIcon, MapIcon } from 'lucide-react'
import Image from 'next/image'
import { ReactNode } from 'react'

export default function Features() {
    return (
        <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-5xl">
                <div className="mx-auto grid gap-4 lg:grid-cols-2">
                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={MapIcon}
                                title="Real time location tracking"
                                description="Advanced tracking system, Instantly locate all your assets."
                            />
                        </CardHeader>

                        <div className="relative border-t border-dashed max-sm:mb-6">
                            <div
                                aria-hidden
                                className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,var(--color-blue-600),var(--color-white)_100%)]"
                            />
                            <div className="aspect-76/59 p-1 px-6">
                                <DualModeImage
                                    darkSrc="/payments.png"
                                    lightSrc="/payments-light.png"
                                    alt="payments illustration"
                                    width={1207}
                                    height={929}
                                />
                            </div>
                        </div>
                    </FeatureCard>

                    <FeatureCard>
                        <CardHeader className="pb-3">
                            <CardHeading
                                icon={Calendar}
                                title="Advanced Scheduling"
                                description="Scheduling system, Instantly locate all your assets."
                            />
                        </CardHeader>

                        <CardContent>
                            <div className="mask-radial-at-right mask-radial-from-75% mask-radial-[75%_75%] relative max-sm:mb-6">
                                <div className="aspect-76/59 overflow-hidden rounded-lg border">
                                    <DualModeImage
                                        darkSrc="/origin-cal-dark.png"
                                        lightSrc="/origin-cal.png"
                                        alt="calendar illustration"
                                        width={1207}
                                        height={929}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </FeatureCard>

                    <FeatureCard className="p-6 lg:col-span-2">
                        <p className="mx-auto my-6 max-w-md text-balance text-center text-2xl font-semibold">Smart scheduling with automated reminders for maintenance.</p>

                        <div className="flex justify-center gap-6 overflow-hidden">
                            <CircularUI
                                label="Inclusion"
                                circles={[{ pattern: 'border' }, { pattern: 'border' }]}
                            />

                            <CircularUI
                                label="Inclusion"
                                circles={[{ pattern: 'none' }, { pattern: 'primary' }]}
                            />

                            <CircularUI
                                label="Join"
                                circles={[{ pattern: 'blue' }, { pattern: 'none' }]}
                            />

                            <CircularUI
                                label="Exclusion"
                                circles={[{ pattern: 'primary' }, { pattern: 'none' }]}
                                className="hidden sm:block"
                            />
                        </div>
                    </FeatureCard>
                </div>
            </div>
        </section>
    )
}

interface FeatureCardProps {
    children: ReactNode
    className?: string
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
    <Card className={cn('group relative rounded-none shadow-zinc-950/5', className)}>
        <CardDecorator />
        {children}
    </Card>
)

const CardDecorator = () => (
    <>
        <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2"></span>
        <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2"></span>
        <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2"></span>
        <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2"></span>
    </>
)

interface CardHeadingProps {
    icon: LucideIcon
    title: string
    description: string
}

const CardHeading = ({ icon: Icon, title, description }: CardHeadingProps) => (
    <div className="p-6">
        <span className="text-muted-foreground flex items-center gap-2">
            <Icon className="size-4" />
            {title}
        </span>
        <p className="mt-8 text-2xl font-semibold">{description}</p>
    </div>
)

interface DualModeImageProps {
    darkSrc: string
    lightSrc: string
    alt: string
    width: number
    height: number
    className?: string
}

const DualModeImage = ({ darkSrc, lightSrc, alt, width, height, className }: DualModeImageProps) => (
    <>
        <Image
            src={darkSrc}
            className={cn('hidden dark:block', className)}
            alt={`${alt} dark`}
            width={width}
            height={height}
        />
        <Image
            src={lightSrc}
            className={cn('shadow dark:hidden', className)}
            alt={`${alt} light`}
            width={width}
            height={height}
        />
    </>
)

interface CircleConfig {
    pattern: 'none' | 'border' | 'primary' | 'blue'
}

interface CircularUIProps {
    label: string
    circles: CircleConfig[]
    className?: string
}

const CircularUI = ({ label, circles, className }: CircularUIProps) => (
    <div className={className}>
        <div className="bg-linear-to-b from-border size-fit rounded-2xl to-transparent p-px">
            <div className="bg-linear-to-b from-background to-muted/25 relative flex aspect-square w-fit items-center -space-x-4 rounded-[15px] p-4">
                {circles.map((circle, i) => (
                    <div
                        key={i}
                        className={cn('size-7 rounded-full border sm:size-8', {
                            'border-primary': circle.pattern === 'none',
                            'border-primary bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'border',
                            'border-primary bg-background bg-[repeating-linear-gradient(-45deg,var(--color-primary),var(--color-primary)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'primary',
                            'bg-background z-1 border-blue-500 bg-[repeating-linear-gradient(-45deg,var(--color-blue-500),var(--color-blue-500)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'blue',
                        })}></div>
                ))}
            </div>
        </div>
        <span className="text-muted-foreground mt-1.5 block text-center text-sm">{label}</span>
    </div>
)

```

## Features Block 11 (features-11)
- Source: https://tailark.com/r/features-11.json
- Description: Shadcn/ui website features block with grid layout and images
- Registry dependencies: card
### ../../packages/dusk-kit/blocks/features/eleven/index.tsx (registry:component) -> components/features-11.tsx
```tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Globe } from 'lucide-react'
import Image from 'next/image'

export default function Features() {
    return (
        <section className="dark:bg-muted/25 bg-zinc-50 py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto grid gap-2 sm:grid-cols-5">
                    <Card className="group overflow-hidden shadow-zinc-950/5 sm:col-span-3 sm:rounded-none sm:rounded-tl-xl">
                        <CardHeader>
                            <div className="md:p-6">
                                <p className="font-medium">Advanced tracking system</p>
                                <p className="text-muted-foreground mt-3 max-w-sm text-sm">Quick AI lives a single hotkey away - ready to quickly appear as a floating window above your other apps..</p>
                            </div>
                        </CardHeader>

                        <div className="mask-b-from-75% mask-b-to-95% relative h-fit pl-6 md:pl-12">
                            <div className="bg-background overflow-hidden rounded-tl-lg border-l border-t pl-2 pt-2 dark:bg-zinc-950">
                                <Image
                                    src="/mail2.png"
                                    className="hidden dark:block"
                                    alt="payments illustration dark"
                                    width={1207}
                                    height={929}
                                />
                                <Image
                                    src="/mail2-light.png"
                                    className="shadow dark:hidden"
                                    alt="payments illustration light"
                                    width={1207}
                                    height={929}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="group overflow-hidden shadow-zinc-950/5 sm:col-span-2 sm:rounded-none sm:rounded-tr-xl">
                        <p className="mx-auto my-6 max-w-md text-balance px-6 text-center text-lg font-semibold sm:text-2xl md:p-6">Advanced UX, Instantly locate all your assets.</p>

                        <CardContent className="mt-auto h-fit">
                            <div className="mask-radial-at-right mask-radial-from-75% mask-radial-[75%_75%] relative max-sm:mb-6">
                                <div className="aspect-76/59 overflow-hidden rounded-r-lg border">
                                    <Image
                                        src="/origin-cal-dark.png"
                                        className="hidden dark:block"
                                        alt="payments illustration dark"
                                        width={1207}
                                        height={929}
                                    />
                                    <Image
                                        src="/origin-cal.png"
                                        className="shadow dark:hidden"
                                        alt="payments illustration light"
                                        width={1207}
                                        height={929}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="group p-6 shadow-zinc-950/5 sm:col-span-2 sm:rounded-none sm:rounded-bl-xl md:p-12">
                        <p className="mx-auto mb-12 max-w-md text-balance text-center text-lg font-semibold sm:text-2xl">Advanced UX, Instantly locate all your assets.</p>

                        <div className="flex justify-center gap-6">
                            <div className="inset-shadow-sm dark:inset-shadow-white/5 bg-muted/35 relative flex aspect-square size-16 items-center rounded-[7px] border p-3 shadow-lg ring dark:shadow-white/5 dark:ring-black">
                                <span className="absolute right-2 top-1 block text-sm">fn</span>
                                <Globe className="mt-auto size-4" />
                            </div>
                            <div className="inset-shadow-sm dark:inset-shadow-white/5 bg-muted/35 flex aspect-square size-16 items-center justify-center rounded-[7px] border p-3 shadow-lg ring dark:shadow-white/5 dark:ring-black">
                                <span>K</span>
                            </div>
                        </div>
                    </Card>
                    <Card className="group relative shadow-zinc-950/5 sm:col-span-3 sm:rounded-none sm:rounded-br-xl">
                        <CardHeader className="p-6 md:p-12">
                            <p className="font-medium">Advanced tracking system</p>
                            <p className="text-muted-foreground mt-2 max-w-sm text-sm">Quick AI lives a single hotkey away apps..</p>
                        </CardHeader>
                        <CardContent className="relative h-fit px-6 pb-6 md:px-12 md:pb-12">
                            <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
                                <div className="rounded-(--radius) aspect-square border border-dashed"></div>
                                <div className="rounded-(--radius) bg-muted/50 flex aspect-square items-center justify-center border p-4">
                                    <img
                                        className="m-auto size-8 invert dark:invert-0"
                                        src="https://oxymor-ns.tailus.io/logos/linear.svg"
                                        alt="Linear logo"
                                        width="32"
                                        height="32"
                                    />
                                </div>
                                <div className="rounded-(--radius) aspect-square border border-dashed"></div>
                                <div className="rounded-(--radius) bg-muted/50 flex aspect-square items-center justify-center border p-4">
                                    <img
                                        className="m-auto size-8 invert dark:invert-0"
                                        src="https://oxymor-ns.tailus.io/logos/netlify.svg"
                                        alt="Netlify logo"
                                        width="32"
                                        height="32"
                                    />
                                </div>
                                <div className="rounded-(--radius) aspect-square border border-dashed"></div>
                                <div className="rounded-(--radius) bg-muted/50 flex aspect-square items-center justify-center border p-4">
                                    <img
                                        className="m-auto size-8 invert dark:invert-0"
                                        src="https://oxymor-ns.tailus.io/logos/github.svg"
                                        alt="github logo"
                                        width="32"
                                        height="32"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

```

## Features Block 12 (features-12)
- Source: https://tailark.com/r/features-12.json
- Description: Shadcn/ui website features block with accordion and animated images
- Registry dependencies: accordion, https://magicui.design/r/border-beam
### ../../packages/dusk-kit/blocks/features/twelve/index.tsx (registry:component) -> components/features-12.tsx
```tsx
'use client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ChartBarIncreasingIcon, Database, Fingerprint, IdCard } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BorderBeam } from '@tailark/core/magicui/border-beam'

export default function Features() {
    type ImageKey = 'item-1' | 'item-2' | 'item-3' | 'item-4'
    const [activeItem, setActiveItem] = useState<ImageKey>('item-1')

    const images = {
        'item-1': {
            image: '/charts.png',
            alt: 'Database visualization',
        },
        'item-2': {
            image: '/music.png',
            alt: 'Security authentication',
        },
        'item-3': {
            image: '/mail2.png',
            alt: 'Identity management',
        },
        'item-4': {
            image: '/payments.png',
            alt: 'Analytics dashboard',
        },
    }

    return (
        <section className="py-12 md:py-20 lg:py-32">
            <div className="bg-linear-to-b absolute inset-0 -z-10 sm:inset-6 sm:rounded-b-3xl dark:block dark:to-[color-mix(in_oklab,var(--color-zinc-900)_75%,var(--color-background))]"></div>
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 lg:space-y-20 dark:[--color-border:color-mix(in_oklab,var(--color-white)_10%,transparent)]">
                <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-6xl">The foundation for AI</h2>
                    <p>Lyra is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</p>
                </div>

                <div className="grid gap-12 sm:px-12 md:grid-cols-2 lg:gap-20 lg:px-0">
                    <Accordion
                        type="single"
                        value={activeItem}
                        onValueChange={(value) => setActiveItem(value as ImageKey)}
                        className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <Database className="size-4" />
                                    Database Visualization
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Lyra is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <Fingerprint className="size-4" />
                                    Advanced Authentication
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Lyra is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <IdCard className="size-4" />
                                    Identity Management
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Lyra is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2 text-base">
                                    <ChartBarIncreasingIcon className="size-4" />
                                    Analytics Dashboard
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>Lyra is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <div className="bg-background relative flex overflow-hidden rounded-3xl border p-2">
                        <div className="w-15 absolute inset-0 right-0 ml-auto border-l bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_8px)]"></div>
                        <div className="aspect-76/59 bg-background relative w-[calc(3/4*100%+3rem)] rounded-2xl">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${activeItem}-id`}
                                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                    className="size-full overflow-hidden rounded-2xl border bg-zinc-900 shadow-md">
                                    <Image
                                        src={images[activeItem].image}
                                        className="size-full object-cover object-left-top dark:mix-blend-lighten"
                                        alt={images[activeItem].alt}
                                        width={1207}
                                        height={929}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <BorderBeam
                            duration={6}
                            size={200}
                            className="from-transparent via-yellow-700 to-transparent dark:via-white/50"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## Integrations Block 1 (integrations-1)
- Source: https://tailark.com/r/integrations-1.json
- Description: Shadcn/ui website integrations section
- Registry dependencies: card, button
### ../../packages/dusk-kit/blocks/integrations/one/index.tsx (registry:component) -> components/integrations-1.tsx
```tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import { Gemini, Replit, MagicUI, VSCodium, MediaWiki, GooglePaLM } from '@/components/logos'

export default function IntegrationsSection() {
    return (
        <section>
            <div className="py-32">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="text-center">
                        <h2 className="text-balance text-3xl font-semibold md:text-4xl">Integrate with your favorite tools</h2>
                        <p className="text-muted-foreground mt-6">Connect seamlessly with popular platforms and services to enhance your workflow.</p>
                    </div>

                    <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <IntegrationCard
                            title="Google Gemini"
                            description="Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.">
                            <Gemini />
                        </IntegrationCard>

                        <IntegrationCard
                            title="Replit"
                            description="Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.">
                            <Replit />
                        </IntegrationCard>

                        <IntegrationCard
                            title="Magic UI"
                            description="Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.">
                            <MagicUI />
                        </IntegrationCard>

                        <IntegrationCard
                            title="VSCodium"
                            description="Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.">
                            <VSCodium />
                        </IntegrationCard>

                        <IntegrationCard
                            title="MediaWiki"
                            description="Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.">
                            <MediaWiki />
                        </IntegrationCard>

                        <IntegrationCard
                            title="Google PaLM"
                            description="Amet praesentium deserunt ex commodi tempore fuga voluptatem. Sit, sapiente.">
                            <GooglePaLM />
                        </IntegrationCard>
                    </div>
                </div>
            </div>
        </section>
    )
}

const IntegrationCard = ({ title, description, children, link = 'https://github.com/meschacirung/cnblocks' }: { title: string; description: string; children: React.ReactNode; link?: string }) => {
    return (
        <Card className="p-6">
            <div className="relative">
                <div className="*:size-10">{children}</div>

                <div className="space-y-2 py-6">
                    <h3 className="text-base font-medium">{title}</h3>
                    <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
                </div>

                <div className="flex gap-3 border-t border-dashed pt-6">
                    <Button
                        asChild
                        variant="secondary"
                        size="sm"
                        className="gap-1 pr-2 shadow-none">
                        <Link href={link}>
                            Learn More
                            <ChevronRight className="ml-0 !size-3.5 opacity-50" />
                        </Link>
                    </Button>
                </div>
            </div>
        </Card>
    )
}

```
### ../../packages/core/src/components/logos/index.ts (registry:component) -> components/logos/index.ts
```tsx
export { default as Gemini } from './Gemini'
export { default as Replit } from './Replit'
export { default as MagicUI } from './MagicUI'
export { default as VSCodium } from './VSCodium'
export { default as MediaWiki } from './MediaWiki'
export { default as GooglePaLM } from './GooglePaLM'

```
### ../../packages/core/src/components/logos/Gemini.tsx (registry:component) -> components/logos/Gemini.tsx
```tsx
import { type SVGProps } from 'react'

export default function Gemini(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            height="1em"
            style={{
                flex: 'none',
                lineHeight: 1,
            }}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            {...props}>
            <title>{'Gemini'}</title>
            <defs>
                <linearGradient
                    id="lobe-icons-gemini-fill"
                    x1="0%"
                    x2="68.73%"
                    y1="100%"
                    y2="30.395%">
                    <stop
                        offset="0%"
                        stopColor="#1C7DFF"
                    />
                    <stop
                        offset="52.021%"
                        stopColor="#1C69FF"
                    />
                    <stop
                        offset="100%"
                        stopColor="#F0DCD6"
                    />
                </linearGradient>
            </defs>
            <path
                d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
                fill="url(#lobe-icons-gemini-fill)"
                fillRule="nonzero"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/GooglePaLM.tsx (registry:component) -> components/logos/GooglePaLM.tsx
```tsx
import type { SVGProps } from 'react'

export default function GooglePaLM(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 229"
            {...props}>
            <path
                fill="#F9AB00"
                d="M128 228.542c9.895 0 17.91-8.015 17.91-17.91V55.413h-35.82v155.219c0 9.895 8.015 17.91 17.91 17.91Z"
            />
            <path
                fill="#5BB974"
                d="M199.356 112.053C180.043 92.755 151.193 88.845 128 100.307l76.669 76.67c3.164 3.163 8.612 1.91 9.955-2.344 6.746-21.357 1.657-45.64-15.268-62.58Z"
            />
            <path
                fill="#129EAF"
                d="M56.644 112.053C75.957 92.755 104.807 88.845 128 100.307l-76.669 76.67c-3.164 3.163-8.612 1.91-9.955-2.344-6.746-21.357-1.657-45.64 15.268-62.58Z"
            />
            <path
                fill="#AF5CF7"
                d="M193.67 52.548c-30.507 0-56.402 20-65.67 47.76h121.25c4.97 0 8.283-5.254 6.03-9.687-11.523-22.611-34.776-38.073-61.61-38.073Z"
            />
            <path
                fill="#FF8BCB"
                d="M140.671 20.101C119.09 41.682 114.926 74.114 128 100.307l85.743-85.743c3.523-3.522 2.15-9.582-2.582-11.119-24.148-7.836-51.52-2.313-70.49 16.656Z"
            />
            <path
                fill="#FA7B17"
                d="M115.329 20.101C136.91 41.682 141.074 74.114 128 100.307L42.257 14.564c-3.523-3.522-2.15-9.582 2.582-11.119 24.148-7.836 51.52-2.313 70.49 16.656Z"
            />
            <path
                fill="#4285F4"
                d="M62.33 52.548c30.507 0 56.402 20 65.67 47.76H6.75c-4.97 0-8.283-5.254-6.03-9.687C12.244 68.01 35.497 52.548 62.33 52.548Z"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/MagicUI.tsx (registry:component) -> components/logos/MagicUI.tsx
```tsx
import type { SVGProps } from 'react'

export default function MagicUI(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 256 256"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-6"
            {...props}>
            <rect
                width={256}
                height={256}
                rx={128}
                fill="url(#paint0_linear_601_4643)"
            />
            <rect
                width={256}
                height={256}
                rx={128}
                fill="url(#paint1_linear_601_4643)"
            />
            <path
                d="M124.157 193.675C123.939 193.783 123.722 193.837 123.505 193.837C123.287 193.837 122.852 193.837 122.2 193.837C120.678 193.837 118.884 193.567 116.818 193.025C114.862 192.591 112.905 191.995 110.948 191.236C109.099 190.586 107.469 189.828 106.055 188.961C104.751 188.094 103.935 187.335 103.609 186.685C103.501 185.167 103.446 183.596 103.446 181.97C103.446 180.345 103.446 178.773 103.446 177.256C103.446 165.118 104.316 152.438 106.055 139.217C107.904 125.995 110.893 111.69 115.025 96.3005C115.459 94.7833 115.894 92.8867 116.329 90.6108C116.873 88.2266 117.416 85.6798 117.96 82.9704C115.351 85.0296 112.252 88.335 108.665 92.8867C105.077 97.3301 101.272 102.64 97.2492 108.818C93.3354 114.887 89.3672 121.606 85.3446 128.975C81.4308 136.236 77.8431 143.66 74.5815 151.246C71.32 158.724 68.4933 166.148 66.1015 173.517C63.8185 180.887 62.4051 187.714 61.8615 194C56.6431 192.483 53.001 190.966 50.9354 189.448C48.9785 187.931 48 186.089 48 183.921C48 181.97 48.5979 179.207 49.7938 175.631C50.9897 172.054 52.6749 167.828 54.8492 162.951C57.0236 158.074 59.6872 152.655 62.84 146.695C65.9928 140.626 69.4718 134.123 73.2769 127.187C77.6256 119.276 81.8656 111.852 85.9969 104.916C90.2369 97.9803 94.3682 91.6946 98.3908 86.0591C102.413 80.4236 106.327 75.5468 110.132 71.4286C114.046 67.3104 117.906 64.1675 121.711 62C123.233 62 125.244 62.3793 127.745 63.1379C130.354 63.8966 132.854 64.8177 135.246 65.9015C137.747 66.9852 139.921 68.1232 141.769 69.3153C143.726 70.399 144.813 71.3202 145.031 72.0788C143.509 75.1133 141.715 79.665 139.649 85.734C137.584 91.803 135.464 98.6847 133.289 106.379C131.224 114.074 129.212 122.256 127.255 130.926C125.407 139.488 123.939 147.724 122.852 155.635C125.353 149.675 128.234 143.498 131.495 137.103C134.866 130.601 138.399 124.207 142.095 117.921C145.792 111.527 149.543 105.35 153.348 99.3892C157.262 93.4286 161.067 88.0099 164.763 83.133C168.459 78.1478 171.884 73.8128 175.037 70.1281C178.298 66.4434 181.179 63.734 183.68 62C185.202 62 187.213 62.3793 189.714 63.1379C192.323 63.8966 194.824 64.8177 197.215 65.9015C199.716 66.9852 201.89 68.1232 203.738 69.3153C205.695 70.399 206.783 71.3202 207 72.0788C203.521 78.2562 200.477 85.7882 197.868 94.6749C195.258 103.562 193.03 112.882 191.182 122.635C189.442 132.389 188.083 142.089 187.105 151.734C186.235 161.271 185.8 169.833 185.8 177.419C185.8 179.911 185.8 182.512 185.8 185.222C185.8 187.931 185.909 190.749 186.126 193.675C184.604 193.675 182.756 193.458 180.582 193.025C178.516 192.7 176.45 192.212 174.385 191.562C172.428 190.911 170.634 190.153 169.003 189.286C167.372 188.527 166.231 187.66 165.578 186.685C165.47 185.167 165.415 183.596 165.415 181.97C165.415 180.345 165.415 178.773 165.415 177.256C165.415 165.118 166.285 152.438 168.025 139.217C169.873 125.995 172.863 111.69 176.994 96.3005C177.429 94.7833 177.918 92.7241 178.462 90.1232C179.005 87.5222 179.549 84.8128 180.092 81.9951C177.048 83.5123 173.569 86.4384 169.655 90.7734C165.85 95 161.936 100.202 157.914 106.379C154 112.448 150.086 119.222 146.172 126.7C142.367 134.177 138.888 141.818 135.735 149.621C132.691 157.315 130.082 165.01 127.908 172.704C125.842 180.291 124.592 187.281 124.157 193.675Z"
                fill="white"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_601_4643"
                    x1={128}
                    y1={0}
                    x2={128}
                    y2={256}
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#EF786F" />
                    <stop
                        offset={1}
                        stopColor="#D8595E"
                    />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_601_4643"
                    x1={78}
                    y1={0.0000037012}
                    x2={236}
                    y2={256}
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9E7AFF" />
                    <stop
                        offset={0.333333}
                        stopColor="#FE8BBB"
                    />
                    <stop
                        offset={0.666667}
                        stopColor="#FFBD7A"
                    />
                    <stop
                        offset={1}
                        stopColor="#F8EAC3"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/MediaWiki.tsx (registry:component) -> components/logos/MediaWiki.tsx
```tsx
import { type SVGProps } from 'react'

export default function MediaWiki(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            id="svg62"
            viewBox="0 0 50 50"
            width="1em"
            height="1em"
            {...props}>
            <defs id="defs11">
                <linearGradient
                    id="gradient"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse">
                    <stop
                        id="stop2"
                        offset="0%"
                        stopColor="#0a00b2"
                    />
                    <stop
                        id="stop4"
                        offset="50%"
                        stopColor="red"
                    />
                    <stop
                        id="stop6"
                        offset="100%"
                        stopColor="#fffc00"
                    />
                </linearGradient>
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient873"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient875"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient877"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient879"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient881"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient883"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient885"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient887"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient889"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient891"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient893"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient895"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient897"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient899"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient901"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient903"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient905"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient907"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient909"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient911"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient913"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient915"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient917"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient919"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient921"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <style id="style9">{'.petal{opacity:.65}'}</style>
            </defs>
            <g
                id="petals"
                fill="url(#linearGradient921)"
                transform="matrix(.5 0 0 .5 0 .026)">
                <path
                    id="path13"
                    fill="url(#linearGradient873)"
                    d="M33.6 14.8a16.938 16.938 0 0 0 3.116 11.142 11.457 11.457 0 0 0 6.858 4.3 3.033 3.033 0 0 0 2.385-.713 11.924 11.924 0 0 0 3.634-10.837c-1.257-7.54-6.19-12.43-12.4-17A32.468 32.468 0 0 0 33.6 14.8z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path15"
                    fill="url(#linearGradient875)"
                    d="M25.117 20.232a16.938 16.938 0 0 0 5.893 9.956 11.457 11.457 0 0 0 7.738 2.381 3.033 3.033 0 0 0 2.119-1.306 11.924 11.924 0 0 0 .705-11.409C38.406 12.9 32.376 9.449 25.2 6.642a32.468 32.468 0 0 0-.083 13.59z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path17"
                    fill="url(#linearGradient877)"
                    d="M18.329 27.677a16.937 16.937 0 0 0 8.271 8.092 11.457 11.457 0 0 0 8.09.3 3.033 3.033 0 0 0 1.709-1.81 11.924 11.924 0 0 0-2.271-11.2c-4.859-5.9-11.576-7.67-19.237-8.523a32.466 32.466 0 0 0 3.438 13.141z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path19"
                    fill="url(#linearGradient879)"
                    d="M13.7 36.626A16.938 16.938 0 0 0 23.781 42.3a11.457 11.457 0 0 0 7.891-1.807 3.033 3.033 0 0 0 1.182-2.193 11.924 11.924 0 0 0-5.093-10.233c-6.221-4.443-13.167-4.412-20.787-3.254A32.468 32.468 0 0 0 13.7 36.626z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path21"
                    fill="url(#linearGradient881)"
                    d="M11.543 46.468a16.938 16.938 0 0 0 11.208 2.873 11.457 11.457 0 0 0 7.155-3.788 3.034 3.034 0 0 0 .575-2.422 11.924 11.924 0 0 0-7.568-8.566c-7.16-2.681-13.861-.854-20.923 2.235a32.468 32.468 0 0 0 9.553 9.668z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path23"
                    fill="url(#linearGradient883)"
                    d="M12.008 56.532a16.938 16.938 0 0 0 11.569-.126 11.457 11.457 0 0 0 5.931-5.51 3.033 3.033 0 0 0-.072-2.488 11.924 11.924 0 0 0-9.527-6.315C12.3 41.356 6.3 44.855.279 49.669a32.467 32.467 0 0 0 11.729 6.863z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path25"
                    fill="url(#linearGradient885)"
                    d="M15.062 66.134A16.938 16.938 0 0 0 26.2 63.018a11.457 11.457 0 0 0 4.3-6.858 3.033 3.033 0 0 0-.713-2.385 11.924 11.924 0 0 0-10.837-3.634c-7.54 1.257-12.43 6.19-17 12.4a32.468 32.468 0 0 0 13.112 3.593z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path27"
                    fill="url(#linearGradient887)"
                    d="M20.5 74.618a16.938 16.938 0 0 0 9.956-5.893 11.457 11.457 0 0 0 2.381-7.738 3.033 3.033 0 0 0-1.306-2.119 11.925 11.925 0 0 0-11.409-.705c-6.958 3.166-10.4 9.2-13.212 16.376a32.466 32.466 0 0 0 13.59.079z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path29"
                    fill="url(#linearGradient889)"
                    d="M27.943 81.406a16.938 16.938 0 0 0 8.092-8.269 11.457 11.457 0 0 0 .3-8.09 3.033 3.033 0 0 0-1.81-1.709 11.924 11.924 0 0 0-11.2 2.271c-5.9 4.859-7.67 11.576-8.523 19.237a32.467 32.467 0 0 0 13.141-3.44z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path31"
                    fill="url(#linearGradient891)"
                    d="M36.891 86.035a16.938 16.938 0 0 0 5.676-10.082 11.457 11.457 0 0 0-1.807-7.891 3.033 3.033 0 0 0-2.191-1.182 11.924 11.924 0 0 0-10.233 5.094c-4.443 6.221-4.412 13.167-3.254 20.787a32.467 32.467 0 0 0 11.809-6.726z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path33"
                    fill="url(#linearGradient893)"
                    d="M46.733 88.191a16.937 16.937 0 0 0 2.873-11.207 11.457 11.457 0 0 0-3.788-7.155 3.033 3.033 0 0 0-2.422-.575 11.924 11.924 0 0 0-8.566 7.568c-2.681 7.159-.854 13.86 2.237 20.921a32.465 32.465 0 0 0 9.666-9.552z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path35"
                    fill="url(#linearGradient895)"
                    d="M56.8 87.726a16.937 16.937 0 0 0-.125-11.569 11.457 11.457 0 0 0-5.511-5.931 3.033 3.033 0 0 0-2.488.072 11.924 11.924 0 0 0-6.315 9.528c-.737 7.609 2.762 13.609 7.576 19.629A32.466 32.466 0 0 0 56.8 87.726z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path37"
                    fill="url(#linearGradient897)"
                    d="M66.4 84.672a16.938 16.938 0 0 0-3.116-11.142 11.457 11.457 0 0 0-6.858-4.3 3.033 3.033 0 0 0-2.385.713 11.924 11.924 0 0 0-3.634 10.837c1.257 7.54 6.19 12.43 12.4 17A32.468 32.468 0 0 0 66.4 84.672z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path39"
                    fill="url(#linearGradient899)"
                    d="M74.883 79.237a16.937 16.937 0 0 0-5.893-9.956 11.456 11.456 0 0 0-7.738-2.381 3.033 3.033 0 0 0-2.119 1.306 11.924 11.924 0 0 0-.705 11.409c3.166 6.958 9.2 10.4 16.375 13.212a32.468 32.468 0 0 0 .08-13.59z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path41"
                    fill="url(#linearGradient901)"
                    d="M81.671 71.792A16.938 16.938 0 0 0 73.4 63.7a11.457 11.457 0 0 0-8.09-.3 3.033 3.033 0 0 0-1.708 1.81 11.924 11.924 0 0 0 2.271 11.2c4.859 5.9 11.576 7.67 19.237 8.523a32.466 32.466 0 0 0-3.439-13.141z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path43"
                    fill="url(#linearGradient903)"
                    d="M86.3 62.843a16.938 16.938 0 0 0-10.082-5.676 11.457 11.457 0 0 0-7.891 1.807 3.033 3.033 0 0 0-1.182 2.191A11.924 11.924 0 0 0 72.239 71.4c6.221 4.443 13.167 4.412 20.787 3.254A32.467 32.467 0 0 0 86.3 62.843z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path45"
                    fill="url(#linearGradient905)"
                    d="M88.457 53a16.938 16.938 0 0 0-11.207-2.873 11.457 11.457 0 0 0-7.155 3.788 3.033 3.033 0 0 0-.574 2.422 11.925 11.925 0 0 0 7.567 8.563c7.158 2.681 13.86.854 20.921-2.237A32.467 32.467 0 0 0 88.457 53z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path47"
                    fill="url(#linearGradient907)"
                    d="M87.992 42.936a16.938 16.938 0 0 0-11.569.126 11.457 11.457 0 0 0-5.931 5.511 3.033 3.033 0 0 0 .072 2.488 11.924 11.924 0 0 0 9.527 6.315c7.609.737 13.609-2.762 19.63-7.576a32.468 32.468 0 0 0-11.729-6.864z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path49"
                    fill="url(#linearGradient909)"
                    d="M84.938 33.335A16.938 16.938 0 0 0 73.8 36.451a11.457 11.457 0 0 0-4.3 6.858 3.033 3.033 0 0 0 .714 2.385 11.924 11.924 0 0 0 10.837 3.634c7.54-1.257 12.43-6.19 17-12.4a32.466 32.466 0 0 0-13.113-3.593z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path51"
                    fill="url(#linearGradient911)"
                    d="M79.5 24.851a16.938 16.938 0 0 0-9.956 5.893 11.457 11.457 0 0 0-2.381 7.738 3.033 3.033 0 0 0 1.309 2.118 11.924 11.924 0 0 0 11.409.705c6.958-3.166 10.4-9.2 13.212-16.375a32.468 32.468 0 0 0-13.593-.079z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path53"
                    fill="url(#linearGradient913)"
                    d="M72.057 18.063a16.938 16.938 0 0 0-8.092 8.269 11.457 11.457 0 0 0-.3 8.09 3.033 3.033 0 0 0 1.81 1.709 11.924 11.924 0 0 0 11.2-2.271c5.9-4.859 7.67-11.576 8.523-19.237a32.467 32.467 0 0 0-13.141 3.44z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path55"
                    fill="url(#linearGradient915)"
                    d="M63.109 13.434a16.937 16.937 0 0 0-5.676 10.082 11.457 11.457 0 0 0 1.807 7.891 3.033 3.033 0 0 0 2.191 1.182A11.924 11.924 0 0 0 71.664 27.5c4.443-6.221 4.412-13.167 3.254-20.787a32.466 32.466 0 0 0-11.809 6.721z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path57"
                    fill="url(#linearGradient917)"
                    d="M53.267 11.278a16.937 16.937 0 0 0-2.873 11.207 11.456 11.456 0 0 0 3.788 7.155 3.033 3.033 0 0 0 2.422.575 11.924 11.924 0 0 0 8.566-7.568c2.681-7.159.854-13.86-2.237-20.921a32.466 32.466 0 0 0-9.666 9.552z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path59"
                    fill="url(#linearGradient919)"
                    d="M43.2 11.743a16.938 16.938 0 0 0 .126 11.569 11.457 11.457 0 0 0 5.511 5.931 3.033 3.033 0 0 0 2.488-.072 11.924 11.924 0 0 0 6.315-9.528c.739-7.609-2.76-13.609-7.574-19.629A32.468 32.468 0 0 0 43.2 11.743z"
                    className="petal"
                    opacity={0.65}
                />
            </g>
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/Replit.tsx (registry:component) -> components/logos/Replit.tsx
```tsx
import { type SVGProps } from 'react'

export default function Replit(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 20 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <path
                d="M0 1.5C0 0.671573 0.671573 0 1.5 0H8.5C9.32843 0 10 0.671573 10 1.5V8H1.5C0.671573 8 0 7.32843 0 6.5V1.5Z"
                fill="#F26207"
            />
            <path
                d="M10 8H18.5C19.3284 8 20 8.67157 20 9.5V14.5C20 15.3284 19.3284 16 18.5 16H10V8Z"
                fill="#F26207"
            />
            <path
                d="M0 17.5C0 16.6716 0.671573 16 1.5 16H10V22.5C10 23.3284 9.32843 24 8.5 24H1.5C0.671573 24 0 23.3284 0 22.5V17.5Z"
                fill="#F26207"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/VSCodium.tsx (registry:component) -> components/logos/VSCodium.tsx
```tsx
import { type SVGProps } from 'react'

export default function VSCodium(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width="1em"
            height="1em"
            {...props}>
            <defs>
                <linearGradient
                    id="a"
                    x1={199.997}
                    x2={296.665}
                    y1={214.302}
                    y2={307.573}
                    gradientTransform="translate(-200 -213)"
                    gradientUnits="userSpaceOnUse">
                    <stop
                        offset={0}
                        stopColor="#62A0EA"
                    />
                    <stop
                        offset={1}
                        stopColor="#1A5FB4"
                    />
                </linearGradient>
            </defs>
            <path
                fill="url(#a)"
                d="M48.26 2.274a6.113 6.113 0 0 0-1.838 8.468c10.109 15.655 12.495 27.463 11.46 37.811-4.184 19.816-13.279 23.836-21.227 23.836-7.76 0-5.682-12.771.151-16.509 3.482-2.174 7.942-3.587 11.365-3.587 3.392 0 6.142-2.741 6.142-6.123 0-3.383-2.75-6.124-6.142-6.124-3.998 0-7.92.84-11.581 2.27.748-3.529 1.024-7.343.057-11.397-1.468-6.156-5.694-12.036-13.032-17.736a6.15 6.15 0 0 0-8.621 1.065 6.114 6.114 0 0 0 1.078 8.595c5.978 4.643 7.952 8.08 8.627 10.909.675 2.829.132 5.864-1.224 10.034-1.733 5.62-3.745 10.637-4.627 15.448-.434 2.368-.471 4.945-.583 7.004-4.305-4.196-5.99-9.736-5.99-17.831-.001-3.382-2.751-6.124-6.142-6.123-3.389.003-6.135 2.743-6.136 6.123 0 11.056 3.233 21.576 11.898 28.594 7.844 7.473 27.791 4.711 27.791 16.708 0 3.386 4.956 5.034 8.347 5.034 3.478 0 7.855-2.325 7.855-5.034 0-13.612 14.345-21.885 37.96-21.849 3.392.005 6.144-2.734 6.149-6.116.006-3.383-2.738-6.13-6.13-6.136a78.226 78.226 0 0 0-4.741.145c2.64-6.209 3.811-13.045 3.569-20.429-.112-3.381-2.95-6.031-6.339-5.921-3.393.11-6.051 2.943-5.94 6.326.32 9.668-.042 18.301-7.245 22.852-2.048 1.293-4.429 2.415-6.687 2.415 1.753-4.768 3.077-9.801 3.619-15.226.346-3.462.383-7.575-.012-10.77-.613-4.95-1.353-10.564.526-14.793 1.688-3.642 5.47-5.167 11.023-5.167 3.389-.003 6.135-2.744 6.136-6.123.002-3.383-2.745-6.127-6.136-6.13-8.252 0-14.507 4.343-18.053 9.59-1.854-3.96-4.112-8.041-6.84-12.265a6.14 6.14 0 0 0-3.86-2.669 6.159 6.159 0 0 0-4.627.831z"
            />
        </svg>
    )
}

```

## Integrations Block 2 (integrations-2)
- Source: https://tailark.com/r/integrations-2.json
- Description: Shadcn/ui website integrations
- Registry dependencies: button
### ../../packages/dusk-kit/blocks/integrations/two/index.tsx (registry:component) -> components/integrations-2.tsx

## Integrations Block 3 (integrations-3)
- Source: https://tailark.com/r/integrations-3.json
- Description: Shadcn/ui website integrations
- Registry dependencies: button
### ../../packages/dusk-kit/blocks/integrations/three/index.tsx (registry:component) -> components/integrations-3.tsx
```tsx
import { Gemini, Replit, MagicUI, VSCodium, MediaWiki, GooglePaLM } from '@/components/logos'
import { LogoIcon } from '@/components/logo'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function IntegrationsSection() {
    return (
        <section>
            <div className="bg-muted dark:bg-background py-24 md:py-32">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="grid items-center sm:grid-cols-2">
                        <div className="dark:bg-muted/50 relative mx-auto w-fit">
                            <div
                                aria-hidden
                                className="bg-radial to-muted dark:to-background absolute inset-0 z-10 from-transparent to-75%"
                            />
                            <div className="mx-auto mb-2 flex w-fit justify-center gap-2">
                                <IntegrationCard>
                                    <Gemini />
                                </IntegrationCard>
                                <IntegrationCard>
                                    <Replit />
                                </IntegrationCard>
                            </div>
                            <div className="mx-auto my-2 flex w-fit justify-center gap-2">
                                <IntegrationCard>
                                    <MagicUI />
                                </IntegrationCard>
                                <IntegrationCard
                                    borderClassName="shadow-black-950/10 shadow-xl border-black/25 dark:border-white/25"
                                    className="dark:bg-white/10">
                                    <LogoIcon />
                                </IntegrationCard>
                                <IntegrationCard>
                                    <VSCodium />
                                </IntegrationCard>
                            </div>

                            <div className="mx-auto flex w-fit justify-center gap-2">
                                <IntegrationCard>
                                    <MediaWiki />
                                </IntegrationCard>

                                <IntegrationCard>
                                    <GooglePaLM />
                                </IntegrationCard>
                            </div>
                        </div>
                        <div className="mx-auto mt-6 max-w-lg space-y-6 text-center sm:mt-0 sm:text-left">
                            <h2 className="text-balance text-3xl font-semibold md:text-4xl">Integrate with your favorite tools</h2>
                            <p className="text-muted-foreground">Connect seamlessly with popular platforms and services to enhance your workflow.</p>

                            <Button
                                variant="outline"
                                size="sm"
                                asChild>
                                <Link href="#">Get Started</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const IntegrationCard = ({ children, className, borderClassName }: { children: React.ReactNode; className?: string; borderClassName?: string }) => {
    return (
        <div className={cn('bg-background relative flex size-20 rounded-xl dark:bg-transparent', className)}>
            <div
                role="presentation"
                className={cn('absolute inset-0 rounded-xl border border-black/20 dark:border-white/25', borderClassName)}
            />
            <div className="relative z-20 m-auto size-fit *:size-8">{children}</div>
        </div>
    )
}

```
### ../../packages/core/src/components/logo.tsx (registry:component)
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/index.ts (registry:component) -> components/logos/index.ts
```tsx
export { default as Gemini } from './Gemini'
export { default as Replit } from './Replit'
export { default as MagicUI } from './MagicUI'
export { default as VSCodium } from './VSCodium'
export { default as MediaWiki } from './MediaWiki'
export { default as GooglePaLM } from './GooglePaLM'

```
### ../../packages/core/src/components/logos/Gemini.tsx (registry:component) -> components/logos/Gemini.tsx
```tsx
import { type SVGProps } from 'react'

export default function Gemini(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            height="1em"
            style={{
                flex: 'none',
                lineHeight: 1,
            }}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            {...props}>
            <title>{'Gemini'}</title>
            <defs>
                <linearGradient
                    id="lobe-icons-gemini-fill"
                    x1="0%"
                    x2="68.73%"
                    y1="100%"
                    y2="30.395%">
                    <stop
                        offset="0%"
                        stopColor="#1C7DFF"
                    />
                    <stop
                        offset="52.021%"
                        stopColor="#1C69FF"
                    />
                    <stop
                        offset="100%"
                        stopColor="#F0DCD6"
                    />
                </linearGradient>
            </defs>
            <path
                d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
                fill="url(#lobe-icons-gemini-fill)"
                fillRule="nonzero"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/GooglePaLM.tsx (registry:component) -> components/logos/GooglePaLM.tsx
```tsx
import type { SVGProps } from 'react'

export default function GooglePaLM(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 229"
            {...props}>
            <path
                fill="#F9AB00"
                d="M128 228.542c9.895 0 17.91-8.015 17.91-17.91V55.413h-35.82v155.219c0 9.895 8.015 17.91 17.91 17.91Z"
            />
            <path
                fill="#5BB974"
                d="M199.356 112.053C180.043 92.755 151.193 88.845 128 100.307l76.669 76.67c3.164 3.163 8.612 1.91 9.955-2.344 6.746-21.357 1.657-45.64-15.268-62.58Z"
            />
            <path
                fill="#129EAF"
                d="M56.644 112.053C75.957 92.755 104.807 88.845 128 100.307l-76.669 76.67c-3.164 3.163-8.612 1.91-9.955-2.344-6.746-21.357-1.657-45.64 15.268-62.58Z"
            />
            <path
                fill="#AF5CF7"
                d="M193.67 52.548c-30.507 0-56.402 20-65.67 47.76h121.25c4.97 0 8.283-5.254 6.03-9.687-11.523-22.611-34.776-38.073-61.61-38.073Z"
            />
            <path
                fill="#FF8BCB"
                d="M140.671 20.101C119.09 41.682 114.926 74.114 128 100.307l85.743-85.743c3.523-3.522 2.15-9.582-2.582-11.119-24.148-7.836-51.52-2.313-70.49 16.656Z"
            />
            <path
                fill="#FA7B17"
                d="M115.329 20.101C136.91 41.682 141.074 74.114 128 100.307L42.257 14.564c-3.523-3.522-2.15-9.582 2.582-11.119 24.148-7.836 51.52-2.313 70.49 16.656Z"
            />
            <path
                fill="#4285F4"
                d="M62.33 52.548c30.507 0 56.402 20 65.67 47.76H6.75c-4.97 0-8.283-5.254-6.03-9.687C12.244 68.01 35.497 52.548 62.33 52.548Z"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/MagicUI.tsx (registry:component) -> components/logos/MagicUI.tsx
```tsx
import type { SVGProps } from 'react'

export default function MagicUI(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 256 256"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-6"
            {...props}>
            <rect
                width={256}
                height={256}
                rx={128}
                fill="url(#paint0_linear_601_4643)"
            />
            <rect
                width={256}
                height={256}
                rx={128}
                fill="url(#paint1_linear_601_4643)"
            />
            <path
                d="M124.157 193.675C123.939 193.783 123.722 193.837 123.505 193.837C123.287 193.837 122.852 193.837 122.2 193.837C120.678 193.837 118.884 193.567 116.818 193.025C114.862 192.591 112.905 191.995 110.948 191.236C109.099 190.586 107.469 189.828 106.055 188.961C104.751 188.094 103.935 187.335 103.609 186.685C103.501 185.167 103.446 183.596 103.446 181.97C103.446 180.345 103.446 178.773 103.446 177.256C103.446 165.118 104.316 152.438 106.055 139.217C107.904 125.995 110.893 111.69 115.025 96.3005C115.459 94.7833 115.894 92.8867 116.329 90.6108C116.873 88.2266 117.416 85.6798 117.96 82.9704C115.351 85.0296 112.252 88.335 108.665 92.8867C105.077 97.3301 101.272 102.64 97.2492 108.818C93.3354 114.887 89.3672 121.606 85.3446 128.975C81.4308 136.236 77.8431 143.66 74.5815 151.246C71.32 158.724 68.4933 166.148 66.1015 173.517C63.8185 180.887 62.4051 187.714 61.8615 194C56.6431 192.483 53.001 190.966 50.9354 189.448C48.9785 187.931 48 186.089 48 183.921C48 181.97 48.5979 179.207 49.7938 175.631C50.9897 172.054 52.6749 167.828 54.8492 162.951C57.0236 158.074 59.6872 152.655 62.84 146.695C65.9928 140.626 69.4718 134.123 73.2769 127.187C77.6256 119.276 81.8656 111.852 85.9969 104.916C90.2369 97.9803 94.3682 91.6946 98.3908 86.0591C102.413 80.4236 106.327 75.5468 110.132 71.4286C114.046 67.3104 117.906 64.1675 121.711 62C123.233 62 125.244 62.3793 127.745 63.1379C130.354 63.8966 132.854 64.8177 135.246 65.9015C137.747 66.9852 139.921 68.1232 141.769 69.3153C143.726 70.399 144.813 71.3202 145.031 72.0788C143.509 75.1133 141.715 79.665 139.649 85.734C137.584 91.803 135.464 98.6847 133.289 106.379C131.224 114.074 129.212 122.256 127.255 130.926C125.407 139.488 123.939 147.724 122.852 155.635C125.353 149.675 128.234 143.498 131.495 137.103C134.866 130.601 138.399 124.207 142.095 117.921C145.792 111.527 149.543 105.35 153.348 99.3892C157.262 93.4286 161.067 88.0099 164.763 83.133C168.459 78.1478 171.884 73.8128 175.037 70.1281C178.298 66.4434 181.179 63.734 183.68 62C185.202 62 187.213 62.3793 189.714 63.1379C192.323 63.8966 194.824 64.8177 197.215 65.9015C199.716 66.9852 201.89 68.1232 203.738 69.3153C205.695 70.399 206.783 71.3202 207 72.0788C203.521 78.2562 200.477 85.7882 197.868 94.6749C195.258 103.562 193.03 112.882 191.182 122.635C189.442 132.389 188.083 142.089 187.105 151.734C186.235 161.271 185.8 169.833 185.8 177.419C185.8 179.911 185.8 182.512 185.8 185.222C185.8 187.931 185.909 190.749 186.126 193.675C184.604 193.675 182.756 193.458 180.582 193.025C178.516 192.7 176.45 192.212 174.385 191.562C172.428 190.911 170.634 190.153 169.003 189.286C167.372 188.527 166.231 187.66 165.578 186.685C165.47 185.167 165.415 183.596 165.415 181.97C165.415 180.345 165.415 178.773 165.415 177.256C165.415 165.118 166.285 152.438 168.025 139.217C169.873 125.995 172.863 111.69 176.994 96.3005C177.429 94.7833 177.918 92.7241 178.462 90.1232C179.005 87.5222 179.549 84.8128 180.092 81.9951C177.048 83.5123 173.569 86.4384 169.655 90.7734C165.85 95 161.936 100.202 157.914 106.379C154 112.448 150.086 119.222 146.172 126.7C142.367 134.177 138.888 141.818 135.735 149.621C132.691 157.315 130.082 165.01 127.908 172.704C125.842 180.291 124.592 187.281 124.157 193.675Z"
                fill="white"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_601_4643"
                    x1={128}
                    y1={0}
                    x2={128}
                    y2={256}
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#EF786F" />
                    <stop
                        offset={1}
                        stopColor="#D8595E"
                    />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_601_4643"
                    x1={78}
                    y1={0.0000037012}
                    x2={236}
                    y2={256}
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9E7AFF" />
                    <stop
                        offset={0.333333}
                        stopColor="#FE8BBB"
                    />
                    <stop
                        offset={0.666667}
                        stopColor="#FFBD7A"
                    />
                    <stop
                        offset={1}
                        stopColor="#F8EAC3"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/MediaWiki.tsx (registry:component) -> components/logos/MediaWiki.tsx
```tsx
import { type SVGProps } from 'react'

export default function MediaWiki(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            id="svg62"
            viewBox="0 0 50 50"
            width="1em"
            height="1em"
            {...props}>
            <defs id="defs11">
                <linearGradient
                    id="gradient"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse">
                    <stop
                        id="stop2"
                        offset="0%"
                        stopColor="#0a00b2"
                    />
                    <stop
                        id="stop4"
                        offset="50%"
                        stopColor="red"
                    />
                    <stop
                        id="stop6"
                        offset="100%"
                        stopColor="#fffc00"
                    />
                </linearGradient>
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient873"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient875"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient877"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient879"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient881"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient883"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient885"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient887"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient889"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient891"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient893"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient895"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient897"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient899"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient901"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient903"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient905"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient907"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient909"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient911"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient913"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient915"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient917"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient919"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient921"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <style id="style9">{'.petal{opacity:.65}'}</style>
            </defs>
            <g
                id="petals"
                fill="url(#linearGradient921)"
                transform="matrix(.5 0 0 .5 0 .026)">
                <path
                    id="path13"
                    fill="url(#linearGradient873)"
                    d="M33.6 14.8a16.938 16.938 0 0 0 3.116 11.142 11.457 11.457 0 0 0 6.858 4.3 3.033 3.033 0 0 0 2.385-.713 11.924 11.924 0 0 0 3.634-10.837c-1.257-7.54-6.19-12.43-12.4-17A32.468 32.468 0 0 0 33.6 14.8z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path15"
                    fill="url(#linearGradient875)"
                    d="M25.117 20.232a16.938 16.938 0 0 0 5.893 9.956 11.457 11.457 0 0 0 7.738 2.381 3.033 3.033 0 0 0 2.119-1.306 11.924 11.924 0 0 0 .705-11.409C38.406 12.9 32.376 9.449 25.2 6.642a32.468 32.468 0 0 0-.083 13.59z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path17"
                    fill="url(#linearGradient877)"
                    d="M18.329 27.677a16.937 16.937 0 0 0 8.271 8.092 11.457 11.457 0 0 0 8.09.3 3.033 3.033 0 0 0 1.709-1.81 11.924 11.924 0 0 0-2.271-11.2c-4.859-5.9-11.576-7.67-19.237-8.523a32.466 32.466 0 0 0 3.438 13.141z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path19"
                    fill="url(#linearGradient879)"
                    d="M13.7 36.626A16.938 16.938 0 0 0 23.781 42.3a11.457 11.457 0 0 0 7.891-1.807 3.033 3.033 0 0 0 1.182-2.193 11.924 11.924 0 0 0-5.093-10.233c-6.221-4.443-13.167-4.412-20.787-3.254A32.468 32.468 0 0 0 13.7 36.626z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path21"
                    fill="url(#linearGradient881)"
                    d="M11.543 46.468a16.938 16.938 0 0 0 11.208 2.873 11.457 11.457 0 0 0 7.155-3.788 3.034 3.034 0 0 0 .575-2.422 11.924 11.924 0 0 0-7.568-8.566c-7.16-2.681-13.861-.854-20.923 2.235a32.468 32.468 0 0 0 9.553 9.668z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path23"
                    fill="url(#linearGradient883)"
                    d="M12.008 56.532a16.938 16.938 0 0 0 11.569-.126 11.457 11.457 0 0 0 5.931-5.51 3.033 3.033 0 0 0-.072-2.488 11.924 11.924 0 0 0-9.527-6.315C12.3 41.356 6.3 44.855.279 49.669a32.467 32.467 0 0 0 11.729 6.863z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path25"
                    fill="url(#linearGradient885)"
                    d="M15.062 66.134A16.938 16.938 0 0 0 26.2 63.018a11.457 11.457 0 0 0 4.3-6.858 3.033 3.033 0 0 0-.713-2.385 11.924 11.924 0 0 0-10.837-3.634c-7.54 1.257-12.43 6.19-17 12.4a32.468 32.468 0 0 0 13.112 3.593z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path27"
                    fill="url(#linearGradient887)"
                    d="M20.5 74.618a16.938 16.938 0 0 0 9.956-5.893 11.457 11.457 0 0 0 2.381-7.738 3.033 3.033 0 0 0-1.306-2.119 11.925 11.925 0 0 0-11.409-.705c-6.958 3.166-10.4 9.2-13.212 16.376a32.466 32.466 0 0 0 13.59.079z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path29"
                    fill="url(#linearGradient889)"
                    d="M27.943 81.406a16.938 16.938 0 0 0 8.092-8.269 11.457 11.457 0 0 0 .3-8.09 3.033 3.033 0 0 0-1.81-1.709 11.924 11.924 0 0 0-11.2 2.271c-5.9 4.859-7.67 11.576-8.523 19.237a32.467 32.467 0 0 0 13.141-3.44z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path31"
                    fill="url(#linearGradient891)"
                    d="M36.891 86.035a16.938 16.938 0 0 0 5.676-10.082 11.457 11.457 0 0 0-1.807-7.891 3.033 3.033 0 0 0-2.191-1.182 11.924 11.924 0 0 0-10.233 5.094c-4.443 6.221-4.412 13.167-3.254 20.787a32.467 32.467 0 0 0 11.809-6.726z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path33"
                    fill="url(#linearGradient893)"
                    d="M46.733 88.191a16.937 16.937 0 0 0 2.873-11.207 11.457 11.457 0 0 0-3.788-7.155 3.033 3.033 0 0 0-2.422-.575 11.924 11.924 0 0 0-8.566 7.568c-2.681 7.159-.854 13.86 2.237 20.921a32.465 32.465 0 0 0 9.666-9.552z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path35"
                    fill="url(#linearGradient895)"
                    d="M56.8 87.726a16.937 16.937 0 0 0-.125-11.569 11.457 11.457 0 0 0-5.511-5.931 3.033 3.033 0 0 0-2.488.072 11.924 11.924 0 0 0-6.315 9.528c-.737 7.609 2.762 13.609 7.576 19.629A32.466 32.466 0 0 0 56.8 87.726z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path37"
                    fill="url(#linearGradient897)"
                    d="M66.4 84.672a16.938 16.938 0 0 0-3.116-11.142 11.457 11.457 0 0 0-6.858-4.3 3.033 3.033 0 0 0-2.385.713 11.924 11.924 0 0 0-3.634 10.837c1.257 7.54 6.19 12.43 12.4 17A32.468 32.468 0 0 0 66.4 84.672z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path39"
                    fill="url(#linearGradient899)"
                    d="M74.883 79.237a16.937 16.937 0 0 0-5.893-9.956 11.456 11.456 0 0 0-7.738-2.381 3.033 3.033 0 0 0-2.119 1.306 11.924 11.924 0 0 0-.705 11.409c3.166 6.958 9.2 10.4 16.375 13.212a32.468 32.468 0 0 0 .08-13.59z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path41"
                    fill="url(#linearGradient901)"
                    d="M81.671 71.792A16.938 16.938 0 0 0 73.4 63.7a11.457 11.457 0 0 0-8.09-.3 3.033 3.033 0 0 0-1.708 1.81 11.924 11.924 0 0 0 2.271 11.2c4.859 5.9 11.576 7.67 19.237 8.523a32.466 32.466 0 0 0-3.439-13.141z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path43"
                    fill="url(#linearGradient903)"
                    d="M86.3 62.843a16.938 16.938 0 0 0-10.082-5.676 11.457 11.457 0 0 0-7.891 1.807 3.033 3.033 0 0 0-1.182 2.191A11.924 11.924 0 0 0 72.239 71.4c6.221 4.443 13.167 4.412 20.787 3.254A32.467 32.467 0 0 0 86.3 62.843z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path45"
                    fill="url(#linearGradient905)"
                    d="M88.457 53a16.938 16.938 0 0 0-11.207-2.873 11.457 11.457 0 0 0-7.155 3.788 3.033 3.033 0 0 0-.574 2.422 11.925 11.925 0 0 0 7.567 8.563c7.158 2.681 13.86.854 20.921-2.237A32.467 32.467 0 0 0 88.457 53z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path47"
                    fill="url(#linearGradient907)"
                    d="M87.992 42.936a16.938 16.938 0 0 0-11.569.126 11.457 11.457 0 0 0-5.931 5.511 3.033 3.033 0 0 0 .072 2.488 11.924 11.924 0 0 0 9.527 6.315c7.609.737 13.609-2.762 19.63-7.576a32.468 32.468 0 0 0-11.729-6.864z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path49"
                    fill="url(#linearGradient909)"
                    d="M84.938 33.335A16.938 16.938 0 0 0 73.8 36.451a11.457 11.457 0 0 0-4.3 6.858 3.033 3.033 0 0 0 .714 2.385 11.924 11.924 0 0 0 10.837 3.634c7.54-1.257 12.43-6.19 17-12.4a32.466 32.466 0 0 0-13.113-3.593z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path51"
                    fill="url(#linearGradient911)"
                    d="M79.5 24.851a16.938 16.938 0 0 0-9.956 5.893 11.457 11.457 0 0 0-2.381 7.738 3.033 3.033 0 0 0 1.309 2.118 11.924 11.924 0 0 0 11.409.705c6.958-3.166 10.4-9.2 13.212-16.375a32.468 32.468 0 0 0-13.593-.079z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path53"
                    fill="url(#linearGradient913)"
                    d="M72.057 18.063a16.938 16.938 0 0 0-8.092 8.269 11.457 11.457 0 0 0-.3 8.09 3.033 3.033 0 0 0 1.81 1.709 11.924 11.924 0 0 0 11.2-2.271c5.9-4.859 7.67-11.576 8.523-19.237a32.467 32.467 0 0 0-13.141 3.44z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path55"
                    fill="url(#linearGradient915)"
                    d="M63.109 13.434a16.937 16.937 0 0 0-5.676 10.082 11.457 11.457 0 0 0 1.807 7.891 3.033 3.033 0 0 0 2.191 1.182A11.924 11.924 0 0 0 71.664 27.5c4.443-6.221 4.412-13.167 3.254-20.787a32.466 32.466 0 0 0-11.809 6.721z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path57"
                    fill="url(#linearGradient917)"
                    d="M53.267 11.278a16.937 16.937 0 0 0-2.873 11.207 11.456 11.456 0 0 0 3.788 7.155 3.033 3.033 0 0 0 2.422.575 11.924 11.924 0 0 0 8.566-7.568c2.681-7.159.854-13.86-2.237-20.921a32.466 32.466 0 0 0-9.666 9.552z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path59"
                    fill="url(#linearGradient919)"
                    d="M43.2 11.743a16.938 16.938 0 0 0 .126 11.569 11.457 11.457 0 0 0 5.511 5.931 3.033 3.033 0 0 0 2.488-.072 11.924 11.924 0 0 0 6.315-9.528c.739-7.609-2.76-13.609-7.574-19.629A32.468 32.468 0 0 0 43.2 11.743z"
                    className="petal"
                    opacity={0.65}
                />
            </g>
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/Replit.tsx (registry:component) -> components/logos/Replit.tsx
```tsx
import { type SVGProps } from 'react'

export default function Replit(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 20 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <path
                d="M0 1.5C0 0.671573 0.671573 0 1.5 0H8.5C9.32843 0 10 0.671573 10 1.5V8H1.5C0.671573 8 0 7.32843 0 6.5V1.5Z"
                fill="#F26207"
            />
            <path
                d="M10 8H18.5C19.3284 8 20 8.67157 20 9.5V14.5C20 15.3284 19.3284 16 18.5 16H10V8Z"
                fill="#F26207"
            />
            <path
                d="M0 17.5C0 16.6716 0.671573 16 1.5 16H10V22.5C10 23.3284 9.32843 24 8.5 24H1.5C0.671573 24 0 23.3284 0 22.5V17.5Z"
                fill="#F26207"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/VSCodium.tsx (registry:component) -> components/logos/VSCodium.tsx
```tsx
import { type SVGProps } from 'react'

export default function VSCodium(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width="1em"
            height="1em"
            {...props}>
            <defs>
                <linearGradient
                    id="a"
                    x1={199.997}
                    x2={296.665}
                    y1={214.302}
                    y2={307.573}
                    gradientTransform="translate(-200 -213)"
                    gradientUnits="userSpaceOnUse">
                    <stop
                        offset={0}
                        stopColor="#62A0EA"
                    />
                    <stop
                        offset={1}
                        stopColor="#1A5FB4"
                    />
                </linearGradient>
            </defs>
            <path
                fill="url(#a)"
                d="M48.26 2.274a6.113 6.113 0 0 0-1.838 8.468c10.109 15.655 12.495 27.463 11.46 37.811-4.184 19.816-13.279 23.836-21.227 23.836-7.76 0-5.682-12.771.151-16.509 3.482-2.174 7.942-3.587 11.365-3.587 3.392 0 6.142-2.741 6.142-6.123 0-3.383-2.75-6.124-6.142-6.124-3.998 0-7.92.84-11.581 2.27.748-3.529 1.024-7.343.057-11.397-1.468-6.156-5.694-12.036-13.032-17.736a6.15 6.15 0 0 0-8.621 1.065 6.114 6.114 0 0 0 1.078 8.595c5.978 4.643 7.952 8.08 8.627 10.909.675 2.829.132 5.864-1.224 10.034-1.733 5.62-3.745 10.637-4.627 15.448-.434 2.368-.471 4.945-.583 7.004-4.305-4.196-5.99-9.736-5.99-17.831-.001-3.382-2.751-6.124-6.142-6.123-3.389.003-6.135 2.743-6.136 6.123 0 11.056 3.233 21.576 11.898 28.594 7.844 7.473 27.791 4.711 27.791 16.708 0 3.386 4.956 5.034 8.347 5.034 3.478 0 7.855-2.325 7.855-5.034 0-13.612 14.345-21.885 37.96-21.849 3.392.005 6.144-2.734 6.149-6.116.006-3.383-2.738-6.13-6.13-6.136a78.226 78.226 0 0 0-4.741.145c2.64-6.209 3.811-13.045 3.569-20.429-.112-3.381-2.95-6.031-6.339-5.921-3.393.11-6.051 2.943-5.94 6.326.32 9.668-.042 18.301-7.245 22.852-2.048 1.293-4.429 2.415-6.687 2.415 1.753-4.768 3.077-9.801 3.619-15.226.346-3.462.383-7.575-.012-10.77-.613-4.95-1.353-10.564.526-14.793 1.688-3.642 5.47-5.167 11.023-5.167 3.389-.003 6.135-2.744 6.136-6.123.002-3.383-2.745-6.127-6.136-6.13-8.252 0-14.507 4.343-18.053 9.59-1.854-3.96-4.112-8.041-6.84-12.265a6.14 6.14 0 0 0-3.86-2.669 6.159 6.159 0 0 0-4.627.831z"
            />
        </svg>
    )
}

```

## Integrations Block 4 (integrations-4)
- Source: https://tailark.com/r/integrations-4.json
- Description: Shadcn/ui website integrations
- Registry dependencies: button
### ../../packages/dusk-kit/blocks/integrations/four/index.tsx (registry:component) -> components/integrations-4.tsx
```tsx
import { Gemini, Replit, MagicUI, VSCodium, MediaWiki, GooglePaLM } from '@/components/logos'
import { cn } from '@/lib/utils'
import { LogoIcon } from '@/components/logo'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function IntegrationsSection() {
    return (
        <section>
            <div className="bg-muted dark:bg-background py-24 md:py-32">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="relative mx-auto flex max-w-sm items-center justify-between">
                        <div className="space-y-6">
                            <IntegrationCard position="left-top">
                                <Gemini />
                            </IntegrationCard>
                            <IntegrationCard position="left-middle">
                                <Replit />
                            </IntegrationCard>
                            <IntegrationCard position="left-bottom">
                                <MagicUI />
                            </IntegrationCard>
                        </div>
                        <div className="mx-auto my-2 flex w-fit justify-center gap-2">
                            <div className="bg-muted relative z-20 rounded-2xl border p-1">
                                <IntegrationCard
                                    className="shadow-black-950/10 dark:bg-background size-16 border-black/25 shadow-xl dark:border-white/25 dark:shadow-white/10"
                                    isCenter={true}>
                                    <LogoIcon />
                                </IntegrationCard>
                            </div>
                        </div>
                        <div
                            role="presentation"
                            className="absolute inset-1/3 bg-[radial-gradient(var(--dots-color)_1px,transparent_1px)] opacity-50 [--dots-color:black] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:[--dots-color:white]"></div>

                        <div className="space-y-6">
                            <IntegrationCard position="right-top">
                                <VSCodium />
                            </IntegrationCard>
                            <IntegrationCard position="right-middle">
                                <MediaWiki />
                            </IntegrationCard>
                            <IntegrationCard position="right-bottom">
                                <GooglePaLM />
                            </IntegrationCard>
                        </div>
                    </div>
                    <div className="mx-auto mt-12 max-w-lg space-y-6 text-center">
                        <h2 className="text-balance text-3xl font-semibold md:text-4xl">Integrate with your favorite tools</h2>
                        <p className="text-muted-foreground">Connect seamlessly with popular platforms and services to enhance your workflow.</p>

                        <Button
                            variant="outline"
                            size="sm"
                            asChild>
                            <Link href="#">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

const IntegrationCard = ({ children, className, position, isCenter = false }: { children: React.ReactNode; className?: string; position?: 'left-top' | 'left-middle' | 'left-bottom' | 'right-top' | 'right-middle' | 'right-bottom'; isCenter?: boolean }) => {
    return (
        <div className={cn('bg-background relative flex size-12 rounded-xl border dark:bg-transparent', className)}>
            <div className={cn('relative z-20 m-auto size-fit *:size-6', isCenter && '*:size-8')}>{children}</div>
            {position && !isCenter && (
                <div
                    className={cn(
                        'bg-linear-to-r to-muted-foreground/25 absolute z-10 h-px',
                        position === 'left-top' && 'left-full top-1/2 w-[130px] origin-left rotate-[25deg]',
                        position === 'left-middle' && 'left-full top-1/2 w-[120px] origin-left',
                        position === 'left-bottom' && 'left-full top-1/2 w-[130px] origin-left rotate-[-25deg]',
                        position === 'right-top' && 'bg-linear-to-l right-full top-1/2 w-[130px] origin-right rotate-[-25deg]',
                        position === 'right-middle' && 'bg-linear-to-l right-full top-1/2 w-[120px] origin-right',
                        position === 'right-bottom' && 'bg-linear-to-l right-full top-1/2 w-[130px] origin-right rotate-[25deg]'
                    )}
                />
            )}
        </div>
    )
}

```
### ../../packages/core/src/components/logo.tsx (registry:component)
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/index.ts (registry:component) -> components/logos/index.ts
```tsx
export { default as Gemini } from './Gemini'
export { default as Replit } from './Replit'
export { default as MagicUI } from './MagicUI'
export { default as VSCodium } from './VSCodium'
export { default as MediaWiki } from './MediaWiki'
export { default as GooglePaLM } from './GooglePaLM'

```
### ../../packages/core/src/components/logos/Gemini.tsx (registry:component) -> components/logos/Gemini.tsx
```tsx
import { type SVGProps } from 'react'

export default function Gemini(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            height="1em"
            style={{
                flex: 'none',
                lineHeight: 1,
            }}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            {...props}>
            <title>{'Gemini'}</title>
            <defs>
                <linearGradient
                    id="lobe-icons-gemini-fill"
                    x1="0%"
                    x2="68.73%"
                    y1="100%"
                    y2="30.395%">
                    <stop
                        offset="0%"
                        stopColor="#1C7DFF"
                    />
                    <stop
                        offset="52.021%"
                        stopColor="#1C69FF"
                    />
                    <stop
                        offset="100%"
                        stopColor="#F0DCD6"
                    />
                </linearGradient>
            </defs>
            <path
                d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
                fill="url(#lobe-icons-gemini-fill)"
                fillRule="nonzero"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/GooglePaLM.tsx (registry:component) -> components/logos/GooglePaLM.tsx
```tsx
import type { SVGProps } from 'react'

export default function GooglePaLM(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 229"
            {...props}>
            <path
                fill="#F9AB00"
                d="M128 228.542c9.895 0 17.91-8.015 17.91-17.91V55.413h-35.82v155.219c0 9.895 8.015 17.91 17.91 17.91Z"
            />
            <path
                fill="#5BB974"
                d="M199.356 112.053C180.043 92.755 151.193 88.845 128 100.307l76.669 76.67c3.164 3.163 8.612 1.91 9.955-2.344 6.746-21.357 1.657-45.64-15.268-62.58Z"
            />
            <path
                fill="#129EAF"
                d="M56.644 112.053C75.957 92.755 104.807 88.845 128 100.307l-76.669 76.67c-3.164 3.163-8.612 1.91-9.955-2.344-6.746-21.357-1.657-45.64 15.268-62.58Z"
            />
            <path
                fill="#AF5CF7"
                d="M193.67 52.548c-30.507 0-56.402 20-65.67 47.76h121.25c4.97 0 8.283-5.254 6.03-9.687-11.523-22.611-34.776-38.073-61.61-38.073Z"
            />
            <path
                fill="#FF8BCB"
                d="M140.671 20.101C119.09 41.682 114.926 74.114 128 100.307l85.743-85.743c3.523-3.522 2.15-9.582-2.582-11.119-24.148-7.836-51.52-2.313-70.49 16.656Z"
            />
            <path
                fill="#FA7B17"
                d="M115.329 20.101C136.91 41.682 141.074 74.114 128 100.307L42.257 14.564c-3.523-3.522-2.15-9.582 2.582-11.119 24.148-7.836 51.52-2.313 70.49 16.656Z"
            />
            <path
                fill="#4285F4"
                d="M62.33 52.548c30.507 0 56.402 20 65.67 47.76H6.75c-4.97 0-8.283-5.254-6.03-9.687C12.244 68.01 35.497 52.548 62.33 52.548Z"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/MagicUI.tsx (registry:component) -> components/logos/MagicUI.tsx
```tsx
import type { SVGProps } from 'react'

export default function MagicUI(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 256 256"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-6"
            {...props}>
            <rect
                width={256}
                height={256}
                rx={128}
                fill="url(#paint0_linear_601_4643)"
            />
            <rect
                width={256}
                height={256}
                rx={128}
                fill="url(#paint1_linear_601_4643)"
            />
            <path
                d="M124.157 193.675C123.939 193.783 123.722 193.837 123.505 193.837C123.287 193.837 122.852 193.837 122.2 193.837C120.678 193.837 118.884 193.567 116.818 193.025C114.862 192.591 112.905 191.995 110.948 191.236C109.099 190.586 107.469 189.828 106.055 188.961C104.751 188.094 103.935 187.335 103.609 186.685C103.501 185.167 103.446 183.596 103.446 181.97C103.446 180.345 103.446 178.773 103.446 177.256C103.446 165.118 104.316 152.438 106.055 139.217C107.904 125.995 110.893 111.69 115.025 96.3005C115.459 94.7833 115.894 92.8867 116.329 90.6108C116.873 88.2266 117.416 85.6798 117.96 82.9704C115.351 85.0296 112.252 88.335 108.665 92.8867C105.077 97.3301 101.272 102.64 97.2492 108.818C93.3354 114.887 89.3672 121.606 85.3446 128.975C81.4308 136.236 77.8431 143.66 74.5815 151.246C71.32 158.724 68.4933 166.148 66.1015 173.517C63.8185 180.887 62.4051 187.714 61.8615 194C56.6431 192.483 53.001 190.966 50.9354 189.448C48.9785 187.931 48 186.089 48 183.921C48 181.97 48.5979 179.207 49.7938 175.631C50.9897 172.054 52.6749 167.828 54.8492 162.951C57.0236 158.074 59.6872 152.655 62.84 146.695C65.9928 140.626 69.4718 134.123 73.2769 127.187C77.6256 119.276 81.8656 111.852 85.9969 104.916C90.2369 97.9803 94.3682 91.6946 98.3908 86.0591C102.413 80.4236 106.327 75.5468 110.132 71.4286C114.046 67.3104 117.906 64.1675 121.711 62C123.233 62 125.244 62.3793 127.745 63.1379C130.354 63.8966 132.854 64.8177 135.246 65.9015C137.747 66.9852 139.921 68.1232 141.769 69.3153C143.726 70.399 144.813 71.3202 145.031 72.0788C143.509 75.1133 141.715 79.665 139.649 85.734C137.584 91.803 135.464 98.6847 133.289 106.379C131.224 114.074 129.212 122.256 127.255 130.926C125.407 139.488 123.939 147.724 122.852 155.635C125.353 149.675 128.234 143.498 131.495 137.103C134.866 130.601 138.399 124.207 142.095 117.921C145.792 111.527 149.543 105.35 153.348 99.3892C157.262 93.4286 161.067 88.0099 164.763 83.133C168.459 78.1478 171.884 73.8128 175.037 70.1281C178.298 66.4434 181.179 63.734 183.68 62C185.202 62 187.213 62.3793 189.714 63.1379C192.323 63.8966 194.824 64.8177 197.215 65.9015C199.716 66.9852 201.89 68.1232 203.738 69.3153C205.695 70.399 206.783 71.3202 207 72.0788C203.521 78.2562 200.477 85.7882 197.868 94.6749C195.258 103.562 193.03 112.882 191.182 122.635C189.442 132.389 188.083 142.089 187.105 151.734C186.235 161.271 185.8 169.833 185.8 177.419C185.8 179.911 185.8 182.512 185.8 185.222C185.8 187.931 185.909 190.749 186.126 193.675C184.604 193.675 182.756 193.458 180.582 193.025C178.516 192.7 176.45 192.212 174.385 191.562C172.428 190.911 170.634 190.153 169.003 189.286C167.372 188.527 166.231 187.66 165.578 186.685C165.47 185.167 165.415 183.596 165.415 181.97C165.415 180.345 165.415 178.773 165.415 177.256C165.415 165.118 166.285 152.438 168.025 139.217C169.873 125.995 172.863 111.69 176.994 96.3005C177.429 94.7833 177.918 92.7241 178.462 90.1232C179.005 87.5222 179.549 84.8128 180.092 81.9951C177.048 83.5123 173.569 86.4384 169.655 90.7734C165.85 95 161.936 100.202 157.914 106.379C154 112.448 150.086 119.222 146.172 126.7C142.367 134.177 138.888 141.818 135.735 149.621C132.691 157.315 130.082 165.01 127.908 172.704C125.842 180.291 124.592 187.281 124.157 193.675Z"
                fill="white"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_601_4643"
                    x1={128}
                    y1={0}
                    x2={128}
                    y2={256}
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#EF786F" />
                    <stop
                        offset={1}
                        stopColor="#D8595E"
                    />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_601_4643"
                    x1={78}
                    y1={0.0000037012}
                    x2={236}
                    y2={256}
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9E7AFF" />
                    <stop
                        offset={0.333333}
                        stopColor="#FE8BBB"
                    />
                    <stop
                        offset={0.666667}
                        stopColor="#FFBD7A"
                    />
                    <stop
                        offset={1}
                        stopColor="#F8EAC3"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/MediaWiki.tsx (registry:component) -> components/logos/MediaWiki.tsx
```tsx
import { type SVGProps } from 'react'

export default function MediaWiki(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            id="svg62"
            viewBox="0 0 50 50"
            width="1em"
            height="1em"
            {...props}>
            <defs id="defs11">
                <linearGradient
                    id="gradient"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse">
                    <stop
                        id="stop2"
                        offset="0%"
                        stopColor="#0a00b2"
                    />
                    <stop
                        id="stop4"
                        offset="50%"
                        stopColor="red"
                    />
                    <stop
                        id="stop6"
                        offset="100%"
                        stopColor="#fffc00"
                    />
                </linearGradient>
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient873"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient875"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient877"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient879"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient881"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient883"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient885"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient887"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient889"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient891"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient893"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient895"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient897"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient899"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient901"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient903"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient905"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient907"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient909"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient911"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient913"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient915"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient917"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient919"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient921"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <style id="style9">{'.petal{opacity:.65}'}</style>
            </defs>
            <g
                id="petals"
                fill="url(#linearGradient921)"
                transform="matrix(.5 0 0 .5 0 .026)">
                <path
                    id="path13"
                    fill="url(#linearGradient873)"
                    d="M33.6 14.8a16.938 16.938 0 0 0 3.116 11.142 11.457 11.457 0 0 0 6.858 4.3 3.033 3.033 0 0 0 2.385-.713 11.924 11.924 0 0 0 3.634-10.837c-1.257-7.54-6.19-12.43-12.4-17A32.468 32.468 0 0 0 33.6 14.8z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path15"
                    fill="url(#linearGradient875)"
                    d="M25.117 20.232a16.938 16.938 0 0 0 5.893 9.956 11.457 11.457 0 0 0 7.738 2.381 3.033 3.033 0 0 0 2.119-1.306 11.924 11.924 0 0 0 .705-11.409C38.406 12.9 32.376 9.449 25.2 6.642a32.468 32.468 0 0 0-.083 13.59z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path17"
                    fill="url(#linearGradient877)"
                    d="M18.329 27.677a16.937 16.937 0 0 0 8.271 8.092 11.457 11.457 0 0 0 8.09.3 3.033 3.033 0 0 0 1.709-1.81 11.924 11.924 0 0 0-2.271-11.2c-4.859-5.9-11.576-7.67-19.237-8.523a32.466 32.466 0 0 0 3.438 13.141z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path19"
                    fill="url(#linearGradient879)"
                    d="M13.7 36.626A16.938 16.938 0 0 0 23.781 42.3a11.457 11.457 0 0 0 7.891-1.807 3.033 3.033 0 0 0 1.182-2.193 11.924 11.924 0 0 0-5.093-10.233c-6.221-4.443-13.167-4.412-20.787-3.254A32.468 32.468 0 0 0 13.7 36.626z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path21"
                    fill="url(#linearGradient881)"
                    d="M11.543 46.468a16.938 16.938 0 0 0 11.208 2.873 11.457 11.457 0 0 0 7.155-3.788 3.034 3.034 0 0 0 .575-2.422 11.924 11.924 0 0 0-7.568-8.566c-7.16-2.681-13.861-.854-20.923 2.235a32.468 32.468 0 0 0 9.553 9.668z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path23"
                    fill="url(#linearGradient883)"
                    d="M12.008 56.532a16.938 16.938 0 0 0 11.569-.126 11.457 11.457 0 0 0 5.931-5.51 3.033 3.033 0 0 0-.072-2.488 11.924 11.924 0 0 0-9.527-6.315C12.3 41.356 6.3 44.855.279 49.669a32.467 32.467 0 0 0 11.729 6.863z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path25"
                    fill="url(#linearGradient885)"
                    d="M15.062 66.134A16.938 16.938 0 0 0 26.2 63.018a11.457 11.457 0 0 0 4.3-6.858 3.033 3.033 0 0 0-.713-2.385 11.924 11.924 0 0 0-10.837-3.634c-7.54 1.257-12.43 6.19-17 12.4a32.468 32.468 0 0 0 13.112 3.593z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path27"
                    fill="url(#linearGradient887)"
                    d="M20.5 74.618a16.938 16.938 0 0 0 9.956-5.893 11.457 11.457 0 0 0 2.381-7.738 3.033 3.033 0 0 0-1.306-2.119 11.925 11.925 0 0 0-11.409-.705c-6.958 3.166-10.4 9.2-13.212 16.376a32.466 32.466 0 0 0 13.59.079z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path29"
                    fill="url(#linearGradient889)"
                    d="M27.943 81.406a16.938 16.938 0 0 0 8.092-8.269 11.457 11.457 0 0 0 .3-8.09 3.033 3.033 0 0 0-1.81-1.709 11.924 11.924 0 0 0-11.2 2.271c-5.9 4.859-7.67 11.576-8.523 19.237a32.467 32.467 0 0 0 13.141-3.44z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path31"
                    fill="url(#linearGradient891)"
                    d="M36.891 86.035a16.938 16.938 0 0 0 5.676-10.082 11.457 11.457 0 0 0-1.807-7.891 3.033 3.033 0 0 0-2.191-1.182 11.924 11.924 0 0 0-10.233 5.094c-4.443 6.221-4.412 13.167-3.254 20.787a32.467 32.467 0 0 0 11.809-6.726z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path33"
                    fill="url(#linearGradient893)"
                    d="M46.733 88.191a16.937 16.937 0 0 0 2.873-11.207 11.457 11.457 0 0 0-3.788-7.155 3.033 3.033 0 0 0-2.422-.575 11.924 11.924 0 0 0-8.566 7.568c-2.681 7.159-.854 13.86 2.237 20.921a32.465 32.465 0 0 0 9.666-9.552z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path35"
                    fill="url(#linearGradient895)"
                    d="M56.8 87.726a16.937 16.937 0 0 0-.125-11.569 11.457 11.457 0 0 0-5.511-5.931 3.033 3.033 0 0 0-2.488.072 11.924 11.924 0 0 0-6.315 9.528c-.737 7.609 2.762 13.609 7.576 19.629A32.466 32.466 0 0 0 56.8 87.726z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path37"
                    fill="url(#linearGradient897)"
                    d="M66.4 84.672a16.938 16.938 0 0 0-3.116-11.142 11.457 11.457 0 0 0-6.858-4.3 3.033 3.033 0 0 0-2.385.713 11.924 11.924 0 0 0-3.634 10.837c1.257 7.54 6.19 12.43 12.4 17A32.468 32.468 0 0 0 66.4 84.672z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path39"
                    fill="url(#linearGradient899)"
                    d="M74.883 79.237a16.937 16.937 0 0 0-5.893-9.956 11.456 11.456 0 0 0-7.738-2.381 3.033 3.033 0 0 0-2.119 1.306 11.924 11.924 0 0 0-.705 11.409c3.166 6.958 9.2 10.4 16.375 13.212a32.468 32.468 0 0 0 .08-13.59z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path41"
                    fill="url(#linearGradient901)"
                    d="M81.671 71.792A16.938 16.938 0 0 0 73.4 63.7a11.457 11.457 0 0 0-8.09-.3 3.033 3.033 0 0 0-1.708 1.81 11.924 11.924 0 0 0 2.271 11.2c4.859 5.9 11.576 7.67 19.237 8.523a32.466 32.466 0 0 0-3.439-13.141z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path43"
                    fill="url(#linearGradient903)"
                    d="M86.3 62.843a16.938 16.938 0 0 0-10.082-5.676 11.457 11.457 0 0 0-7.891 1.807 3.033 3.033 0 0 0-1.182 2.191A11.924 11.924 0 0 0 72.239 71.4c6.221 4.443 13.167 4.412 20.787 3.254A32.467 32.467 0 0 0 86.3 62.843z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path45"
                    fill="url(#linearGradient905)"
                    d="M88.457 53a16.938 16.938 0 0 0-11.207-2.873 11.457 11.457 0 0 0-7.155 3.788 3.033 3.033 0 0 0-.574 2.422 11.925 11.925 0 0 0 7.567 8.563c7.158 2.681 13.86.854 20.921-2.237A32.467 32.467 0 0 0 88.457 53z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path47"
                    fill="url(#linearGradient907)"
                    d="M87.992 42.936a16.938 16.938 0 0 0-11.569.126 11.457 11.457 0 0 0-5.931 5.511 3.033 3.033 0 0 0 .072 2.488 11.924 11.924 0 0 0 9.527 6.315c7.609.737 13.609-2.762 19.63-7.576a32.468 32.468 0 0 0-11.729-6.864z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path49"
                    fill="url(#linearGradient909)"
                    d="M84.938 33.335A16.938 16.938 0 0 0 73.8 36.451a11.457 11.457 0 0 0-4.3 6.858 3.033 3.033 0 0 0 .714 2.385 11.924 11.924 0 0 0 10.837 3.634c7.54-1.257 12.43-6.19 17-12.4a32.466 32.466 0 0 0-13.113-3.593z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path51"
                    fill="url(#linearGradient911)"
                    d="M79.5 24.851a16.938 16.938 0 0 0-9.956 5.893 11.457 11.457 0 0 0-2.381 7.738 3.033 3.033 0 0 0 1.309 2.118 11.924 11.924 0 0 0 11.409.705c6.958-3.166 10.4-9.2 13.212-16.375a32.468 32.468 0 0 0-13.593-.079z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path53"
                    fill="url(#linearGradient913)"
                    d="M72.057 18.063a16.938 16.938 0 0 0-8.092 8.269 11.457 11.457 0 0 0-.3 8.09 3.033 3.033 0 0 0 1.81 1.709 11.924 11.924 0 0 0 11.2-2.271c5.9-4.859 7.67-11.576 8.523-19.237a32.467 32.467 0 0 0-13.141 3.44z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path55"
                    fill="url(#linearGradient915)"
                    d="M63.109 13.434a16.937 16.937 0 0 0-5.676 10.082 11.457 11.457 0 0 0 1.807 7.891 3.033 3.033 0 0 0 2.191 1.182A11.924 11.924 0 0 0 71.664 27.5c4.443-6.221 4.412-13.167 3.254-20.787a32.466 32.466 0 0 0-11.809 6.721z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path57"
                    fill="url(#linearGradient917)"
                    d="M53.267 11.278a16.937 16.937 0 0 0-2.873 11.207 11.456 11.456 0 0 0 3.788 7.155 3.033 3.033 0 0 0 2.422.575 11.924 11.924 0 0 0 8.566-7.568c2.681-7.159.854-13.86-2.237-20.921a32.466 32.466 0 0 0-9.666 9.552z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path59"
                    fill="url(#linearGradient919)"
                    d="M43.2 11.743a16.938 16.938 0 0 0 .126 11.569 11.457 11.457 0 0 0 5.511 5.931 3.033 3.033 0 0 0 2.488-.072 11.924 11.924 0 0 0 6.315-9.528c.739-7.609-2.76-13.609-7.574-19.629A32.468 32.468 0 0 0 43.2 11.743z"
                    className="petal"
                    opacity={0.65}
                />
            </g>
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/Replit.tsx (registry:component) -> components/logos/Replit.tsx
```tsx
import { type SVGProps } from 'react'

export default function Replit(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 20 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <path
                d="M0 1.5C0 0.671573 0.671573 0 1.5 0H8.5C9.32843 0 10 0.671573 10 1.5V8H1.5C0.671573 8 0 7.32843 0 6.5V1.5Z"
                fill="#F26207"
            />
            <path
                d="M10 8H18.5C19.3284 8 20 8.67157 20 9.5V14.5C20 15.3284 19.3284 16 18.5 16H10V8Z"
                fill="#F26207"
            />
            <path
                d="M0 17.5C0 16.6716 0.671573 16 1.5 16H10V22.5C10 23.3284 9.32843 24 8.5 24H1.5C0.671573 24 0 23.3284 0 22.5V17.5Z"
                fill="#F26207"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/VSCodium.tsx (registry:component) -> components/logos/VSCodium.tsx
```tsx
import { type SVGProps } from 'react'

export default function VSCodium(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width="1em"
            height="1em"
            {...props}>
            <defs>
                <linearGradient
                    id="a"
                    x1={199.997}
                    x2={296.665}
                    y1={214.302}
                    y2={307.573}
                    gradientTransform="translate(-200 -213)"
                    gradientUnits="userSpaceOnUse">
                    <stop
                        offset={0}
                        stopColor="#62A0EA"
                    />
                    <stop
                        offset={1}
                        stopColor="#1A5FB4"
                    />
                </linearGradient>
            </defs>
            <path
                fill="url(#a)"
                d="M48.26 2.274a6.113 6.113 0 0 0-1.838 8.468c10.109 15.655 12.495 27.463 11.46 37.811-4.184 19.816-13.279 23.836-21.227 23.836-7.76 0-5.682-12.771.151-16.509 3.482-2.174 7.942-3.587 11.365-3.587 3.392 0 6.142-2.741 6.142-6.123 0-3.383-2.75-6.124-6.142-6.124-3.998 0-7.92.84-11.581 2.27.748-3.529 1.024-7.343.057-11.397-1.468-6.156-5.694-12.036-13.032-17.736a6.15 6.15 0 0 0-8.621 1.065 6.114 6.114 0 0 0 1.078 8.595c5.978 4.643 7.952 8.08 8.627 10.909.675 2.829.132 5.864-1.224 10.034-1.733 5.62-3.745 10.637-4.627 15.448-.434 2.368-.471 4.945-.583 7.004-4.305-4.196-5.99-9.736-5.99-17.831-.001-3.382-2.751-6.124-6.142-6.123-3.389.003-6.135 2.743-6.136 6.123 0 11.056 3.233 21.576 11.898 28.594 7.844 7.473 27.791 4.711 27.791 16.708 0 3.386 4.956 5.034 8.347 5.034 3.478 0 7.855-2.325 7.855-5.034 0-13.612 14.345-21.885 37.96-21.849 3.392.005 6.144-2.734 6.149-6.116.006-3.383-2.738-6.13-6.13-6.136a78.226 78.226 0 0 0-4.741.145c2.64-6.209 3.811-13.045 3.569-20.429-.112-3.381-2.95-6.031-6.339-5.921-3.393.11-6.051 2.943-5.94 6.326.32 9.668-.042 18.301-7.245 22.852-2.048 1.293-4.429 2.415-6.687 2.415 1.753-4.768 3.077-9.801 3.619-15.226.346-3.462.383-7.575-.012-10.77-.613-4.95-1.353-10.564.526-14.793 1.688-3.642 5.47-5.167 11.023-5.167 3.389-.003 6.135-2.744 6.136-6.123.002-3.383-2.745-6.127-6.136-6.13-8.252 0-14.507 4.343-18.053 9.59-1.854-3.96-4.112-8.041-6.84-12.265a6.14 6.14 0 0 0-3.86-2.669 6.159 6.159 0 0 0-4.627.831z"
            />
        </svg>
    )
}

```

## Integrations Block 5 (integrations-5)
- Source: https://tailark.com/r/integrations-5.json
- Description: Shadcn/ui website integrations
- Registry dependencies: button
### ../../packages/dusk-kit/blocks/integrations/five/index.tsx (registry:component) -> components/integrations-5.tsx
```tsx
import { Gemini, Replit, MagicUI, VSCodium, MediaWiki, GooglePaLM } from '@/components/logos'
import { LogoIcon } from '@/components/logo'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function IntegrationsSection() {
    return (
        <section>
            <div className="py-24 md:py-32">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="aspect-16/10 group relative mx-auto flex max-w-[22rem] items-center justify-between sm:max-w-sm">
                        <div
                            role="presentation"
                            className="bg-linear-to-b border-foreground/5 absolute inset-0 z-10 aspect-square animate-spin items-center justify-center rounded-full border-t from-lime-500/15 to-transparent to-25% opacity-0 duration-[3.5s] group-hover:opacity-100 dark:from-white/5"></div>
                        <div
                            role="presentation"
                            className="bg-linear-to-b border-foreground/5 absolute inset-16 z-10 aspect-square scale-90 animate-spin items-center justify-center rounded-full border-t from-blue-500/15 to-transparent to-25% opacity-0 duration-[3.5s] group-hover:opacity-100"></div>
                        <div className="bg-linear-to-b from-muted-foreground/15 absolute inset-0 flex aspect-square items-center justify-center rounded-full border-t to-transparent to-25%">
                            <IntegrationCard className="-translate-x-1/6 absolute left-0 top-1/4 -translate-y-1/4">
                                <Gemini />
                            </IntegrationCard>
                            <IntegrationCard className="absolute top-0 -translate-y-1/2">
                                <Replit />
                            </IntegrationCard>
                            <IntegrationCard className="translate-x-1/6 absolute right-0 top-1/4 -translate-y-1/4">
                                <MagicUI />
                            </IntegrationCard>
                        </div>
                        <div className="bg-linear-to-b from-muted-foreground/15 absolute inset-16 flex aspect-square scale-90 items-center justify-center rounded-full border-t to-transparent to-25%">
                            <IntegrationCard className="absolute top-0 -translate-y-1/2">
                                <VSCodium />
                            </IntegrationCard>
                            <IntegrationCard className="absolute left-0 top-1/4 -translate-x-1/4 -translate-y-1/4">
                                <MediaWiki />
                            </IntegrationCard>
                            <IntegrationCard className="absolute right-0 top-1/4 -translate-y-1/4 translate-x-1/4">
                                <GooglePaLM />
                            </IntegrationCard>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 mx-auto my-2 flex w-fit justify-center gap-2">
                            <div className="bg-muted relative z-20 rounded-full border p-1">
                                <IntegrationCard
                                    className="shadow-black-950/10 dark:bg-background size-16 border-black/20 shadow-xl dark:border-white/25 dark:shadow-white/15"
                                    isCenter={true}>
                                    <LogoIcon className="text-blue-500" />
                                </IntegrationCard>
                            </div>
                        </div>
                    </div>
                    <div className="bg-linear-to-t from-background relative z-20 mx-auto mt-12 max-w-lg space-y-6 from-55% text-center">
                        <h2 className="text-balance text-3xl font-semibold md:text-4xl">Integrate with your favorite tools</h2>
                        <p className="text-muted-foreground">Connect seamlessly with popular platforms and services to enhance your workflow.</p>

                        <Button
                            variant="outline"
                            size="sm"
                            asChild>
                            <Link href="#">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

const IntegrationCard = ({ children, className, isCenter = false }: { children: React.ReactNode; className?: string; position?: 'left-top' | 'left-middle' | 'left-bottom' | 'right-top' | 'right-middle' | 'right-bottom'; isCenter?: boolean }) => {
    return (
        <div className={cn('relative z-30 flex size-12 rounded-full border bg-white shadow-sm shadow-black/5 dark:bg-white/5 dark:backdrop-blur-md', className)}>
            <div className={cn('m-auto size-fit *:size-5', isCenter && '*:size-8')}>{children}</div>
        </div>
    )
}

```
### ../../packages/core/src/components/logo.tsx (registry:component)
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/index.ts (registry:component) -> components/logos/index.ts
```tsx
export { default as Gemini } from './Gemini'
export { default as Replit } from './Replit'
export { default as MagicUI } from './MagicUI'
export { default as VSCodium } from './VSCodium'
export { default as MediaWiki } from './MediaWiki'
export { default as GooglePaLM } from './GooglePaLM'

```
### ../../packages/core/src/components/logos/Gemini.tsx (registry:component) -> components/logos/Gemini.tsx
```tsx
import { type SVGProps } from 'react'

export default function Gemini(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            height="1em"
            style={{
                flex: 'none',
                lineHeight: 1,
            }}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            {...props}>
            <title>{'Gemini'}</title>
            <defs>
                <linearGradient
                    id="lobe-icons-gemini-fill"
                    x1="0%"
                    x2="68.73%"
                    y1="100%"
                    y2="30.395%">
                    <stop
                        offset="0%"
                        stopColor="#1C7DFF"
                    />
                    <stop
                        offset="52.021%"
                        stopColor="#1C69FF"
                    />
                    <stop
                        offset="100%"
                        stopColor="#F0DCD6"
                    />
                </linearGradient>
            </defs>
            <path
                d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
                fill="url(#lobe-icons-gemini-fill)"
                fillRule="nonzero"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/GooglePaLM.tsx (registry:component) -> components/logos/GooglePaLM.tsx
```tsx
import type { SVGProps } from 'react'

export default function GooglePaLM(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 229"
            {...props}>
            <path
                fill="#F9AB00"
                d="M128 228.542c9.895 0 17.91-8.015 17.91-17.91V55.413h-35.82v155.219c0 9.895 8.015 17.91 17.91 17.91Z"
            />
            <path
                fill="#5BB974"
                d="M199.356 112.053C180.043 92.755 151.193 88.845 128 100.307l76.669 76.67c3.164 3.163 8.612 1.91 9.955-2.344 6.746-21.357 1.657-45.64-15.268-62.58Z"
            />
            <path
                fill="#129EAF"
                d="M56.644 112.053C75.957 92.755 104.807 88.845 128 100.307l-76.669 76.67c-3.164 3.163-8.612 1.91-9.955-2.344-6.746-21.357-1.657-45.64 15.268-62.58Z"
            />
            <path
                fill="#AF5CF7"
                d="M193.67 52.548c-30.507 0-56.402 20-65.67 47.76h121.25c4.97 0 8.283-5.254 6.03-9.687-11.523-22.611-34.776-38.073-61.61-38.073Z"
            />
            <path
                fill="#FF8BCB"
                d="M140.671 20.101C119.09 41.682 114.926 74.114 128 100.307l85.743-85.743c3.523-3.522 2.15-9.582-2.582-11.119-24.148-7.836-51.52-2.313-70.49 16.656Z"
            />
            <path
                fill="#FA7B17"
                d="M115.329 20.101C136.91 41.682 141.074 74.114 128 100.307L42.257 14.564c-3.523-3.522-2.15-9.582 2.582-11.119 24.148-7.836 51.52-2.313 70.49 16.656Z"
            />
            <path
                fill="#4285F4"
                d="M62.33 52.548c30.507 0 56.402 20 65.67 47.76H6.75c-4.97 0-8.283-5.254-6.03-9.687C12.244 68.01 35.497 52.548 62.33 52.548Z"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/MagicUI.tsx (registry:component) -> components/logos/MagicUI.tsx
```tsx
import type { SVGProps } from 'react'

export default function MagicUI(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 256 256"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-6"
            {...props}>
            <rect
                width={256}
                height={256}
                rx={128}
                fill="url(#paint0_linear_601_4643)"
            />
            <rect
                width={256}
                height={256}
                rx={128}
                fill="url(#paint1_linear_601_4643)"
            />
            <path
                d="M124.157 193.675C123.939 193.783 123.722 193.837 123.505 193.837C123.287 193.837 122.852 193.837 122.2 193.837C120.678 193.837 118.884 193.567 116.818 193.025C114.862 192.591 112.905 191.995 110.948 191.236C109.099 190.586 107.469 189.828 106.055 188.961C104.751 188.094 103.935 187.335 103.609 186.685C103.501 185.167 103.446 183.596 103.446 181.97C103.446 180.345 103.446 178.773 103.446 177.256C103.446 165.118 104.316 152.438 106.055 139.217C107.904 125.995 110.893 111.69 115.025 96.3005C115.459 94.7833 115.894 92.8867 116.329 90.6108C116.873 88.2266 117.416 85.6798 117.96 82.9704C115.351 85.0296 112.252 88.335 108.665 92.8867C105.077 97.3301 101.272 102.64 97.2492 108.818C93.3354 114.887 89.3672 121.606 85.3446 128.975C81.4308 136.236 77.8431 143.66 74.5815 151.246C71.32 158.724 68.4933 166.148 66.1015 173.517C63.8185 180.887 62.4051 187.714 61.8615 194C56.6431 192.483 53.001 190.966 50.9354 189.448C48.9785 187.931 48 186.089 48 183.921C48 181.97 48.5979 179.207 49.7938 175.631C50.9897 172.054 52.6749 167.828 54.8492 162.951C57.0236 158.074 59.6872 152.655 62.84 146.695C65.9928 140.626 69.4718 134.123 73.2769 127.187C77.6256 119.276 81.8656 111.852 85.9969 104.916C90.2369 97.9803 94.3682 91.6946 98.3908 86.0591C102.413 80.4236 106.327 75.5468 110.132 71.4286C114.046 67.3104 117.906 64.1675 121.711 62C123.233 62 125.244 62.3793 127.745 63.1379C130.354 63.8966 132.854 64.8177 135.246 65.9015C137.747 66.9852 139.921 68.1232 141.769 69.3153C143.726 70.399 144.813 71.3202 145.031 72.0788C143.509 75.1133 141.715 79.665 139.649 85.734C137.584 91.803 135.464 98.6847 133.289 106.379C131.224 114.074 129.212 122.256 127.255 130.926C125.407 139.488 123.939 147.724 122.852 155.635C125.353 149.675 128.234 143.498 131.495 137.103C134.866 130.601 138.399 124.207 142.095 117.921C145.792 111.527 149.543 105.35 153.348 99.3892C157.262 93.4286 161.067 88.0099 164.763 83.133C168.459 78.1478 171.884 73.8128 175.037 70.1281C178.298 66.4434 181.179 63.734 183.68 62C185.202 62 187.213 62.3793 189.714 63.1379C192.323 63.8966 194.824 64.8177 197.215 65.9015C199.716 66.9852 201.89 68.1232 203.738 69.3153C205.695 70.399 206.783 71.3202 207 72.0788C203.521 78.2562 200.477 85.7882 197.868 94.6749C195.258 103.562 193.03 112.882 191.182 122.635C189.442 132.389 188.083 142.089 187.105 151.734C186.235 161.271 185.8 169.833 185.8 177.419C185.8 179.911 185.8 182.512 185.8 185.222C185.8 187.931 185.909 190.749 186.126 193.675C184.604 193.675 182.756 193.458 180.582 193.025C178.516 192.7 176.45 192.212 174.385 191.562C172.428 190.911 170.634 190.153 169.003 189.286C167.372 188.527 166.231 187.66 165.578 186.685C165.47 185.167 165.415 183.596 165.415 181.97C165.415 180.345 165.415 178.773 165.415 177.256C165.415 165.118 166.285 152.438 168.025 139.217C169.873 125.995 172.863 111.69 176.994 96.3005C177.429 94.7833 177.918 92.7241 178.462 90.1232C179.005 87.5222 179.549 84.8128 180.092 81.9951C177.048 83.5123 173.569 86.4384 169.655 90.7734C165.85 95 161.936 100.202 157.914 106.379C154 112.448 150.086 119.222 146.172 126.7C142.367 134.177 138.888 141.818 135.735 149.621C132.691 157.315 130.082 165.01 127.908 172.704C125.842 180.291 124.592 187.281 124.157 193.675Z"
                fill="white"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_601_4643"
                    x1={128}
                    y1={0}
                    x2={128}
                    y2={256}
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#EF786F" />
                    <stop
                        offset={1}
                        stopColor="#D8595E"
                    />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_601_4643"
                    x1={78}
                    y1={0.0000037012}
                    x2={236}
                    y2={256}
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9E7AFF" />
                    <stop
                        offset={0.333333}
                        stopColor="#FE8BBB"
                    />
                    <stop
                        offset={0.666667}
                        stopColor="#FFBD7A"
                    />
                    <stop
                        offset={1}
                        stopColor="#F8EAC3"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/MediaWiki.tsx (registry:component) -> components/logos/MediaWiki.tsx
```tsx
import { type SVGProps } from 'react'

export default function MediaWiki(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            id="svg62"
            viewBox="0 0 50 50"
            width="1em"
            height="1em"
            {...props}>
            <defs id="defs11">
                <linearGradient
                    id="gradient"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse">
                    <stop
                        id="stop2"
                        offset="0%"
                        stopColor="#0a00b2"
                    />
                    <stop
                        id="stop4"
                        offset="50%"
                        stopColor="red"
                    />
                    <stop
                        id="stop6"
                        offset="100%"
                        stopColor="#fffc00"
                    />
                </linearGradient>
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient873"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient875"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient877"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient879"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient881"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient883"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient885"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient887"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient889"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient891"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient893"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient895"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient897"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient899"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient901"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient903"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient905"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient907"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient909"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient911"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient913"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient915"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient917"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient919"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient921"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <style id="style9">{'.petal{opacity:.65}'}</style>
            </defs>
            <g
                id="petals"
                fill="url(#linearGradient921)"
                transform="matrix(.5 0 0 .5 0 .026)">
                <path
                    id="path13"
                    fill="url(#linearGradient873)"
                    d="M33.6 14.8a16.938 16.938 0 0 0 3.116 11.142 11.457 11.457 0 0 0 6.858 4.3 3.033 3.033 0 0 0 2.385-.713 11.924 11.924 0 0 0 3.634-10.837c-1.257-7.54-6.19-12.43-12.4-17A32.468 32.468 0 0 0 33.6 14.8z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path15"
                    fill="url(#linearGradient875)"
                    d="M25.117 20.232a16.938 16.938 0 0 0 5.893 9.956 11.457 11.457 0 0 0 7.738 2.381 3.033 3.033 0 0 0 2.119-1.306 11.924 11.924 0 0 0 .705-11.409C38.406 12.9 32.376 9.449 25.2 6.642a32.468 32.468 0 0 0-.083 13.59z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path17"
                    fill="url(#linearGradient877)"
                    d="M18.329 27.677a16.937 16.937 0 0 0 8.271 8.092 11.457 11.457 0 0 0 8.09.3 3.033 3.033 0 0 0 1.709-1.81 11.924 11.924 0 0 0-2.271-11.2c-4.859-5.9-11.576-7.67-19.237-8.523a32.466 32.466 0 0 0 3.438 13.141z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path19"
                    fill="url(#linearGradient879)"
                    d="M13.7 36.626A16.938 16.938 0 0 0 23.781 42.3a11.457 11.457 0 0 0 7.891-1.807 3.033 3.033 0 0 0 1.182-2.193 11.924 11.924 0 0 0-5.093-10.233c-6.221-4.443-13.167-4.412-20.787-3.254A32.468 32.468 0 0 0 13.7 36.626z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path21"
                    fill="url(#linearGradient881)"
                    d="M11.543 46.468a16.938 16.938 0 0 0 11.208 2.873 11.457 11.457 0 0 0 7.155-3.788 3.034 3.034 0 0 0 .575-2.422 11.924 11.924 0 0 0-7.568-8.566c-7.16-2.681-13.861-.854-20.923 2.235a32.468 32.468 0 0 0 9.553 9.668z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path23"
                    fill="url(#linearGradient883)"
                    d="M12.008 56.532a16.938 16.938 0 0 0 11.569-.126 11.457 11.457 0 0 0 5.931-5.51 3.033 3.033 0 0 0-.072-2.488 11.924 11.924 0 0 0-9.527-6.315C12.3 41.356 6.3 44.855.279 49.669a32.467 32.467 0 0 0 11.729 6.863z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path25"
                    fill="url(#linearGradient885)"
                    d="M15.062 66.134A16.938 16.938 0 0 0 26.2 63.018a11.457 11.457 0 0 0 4.3-6.858 3.033 3.033 0 0 0-.713-2.385 11.924 11.924 0 0 0-10.837-3.634c-7.54 1.257-12.43 6.19-17 12.4a32.468 32.468 0 0 0 13.112 3.593z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path27"
                    fill="url(#linearGradient887)"
                    d="M20.5 74.618a16.938 16.938 0 0 0 9.956-5.893 11.457 11.457 0 0 0 2.381-7.738 3.033 3.033 0 0 0-1.306-2.119 11.925 11.925 0 0 0-11.409-.705c-6.958 3.166-10.4 9.2-13.212 16.376a32.466 32.466 0 0 0 13.59.079z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path29"
                    fill="url(#linearGradient889)"
                    d="M27.943 81.406a16.938 16.938 0 0 0 8.092-8.269 11.457 11.457 0 0 0 .3-8.09 3.033 3.033 0 0 0-1.81-1.709 11.924 11.924 0 0 0-11.2 2.271c-5.9 4.859-7.67 11.576-8.523 19.237a32.467 32.467 0 0 0 13.141-3.44z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path31"
                    fill="url(#linearGradient891)"
                    d="M36.891 86.035a16.938 16.938 0 0 0 5.676-10.082 11.457 11.457 0 0 0-1.807-7.891 3.033 3.033 0 0 0-2.191-1.182 11.924 11.924 0 0 0-10.233 5.094c-4.443 6.221-4.412 13.167-3.254 20.787a32.467 32.467 0 0 0 11.809-6.726z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path33"
                    fill="url(#linearGradient893)"
                    d="M46.733 88.191a16.937 16.937 0 0 0 2.873-11.207 11.457 11.457 0 0 0-3.788-7.155 3.033 3.033 0 0 0-2.422-.575 11.924 11.924 0 0 0-8.566 7.568c-2.681 7.159-.854 13.86 2.237 20.921a32.465 32.465 0 0 0 9.666-9.552z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path35"
                    fill="url(#linearGradient895)"
                    d="M56.8 87.726a16.937 16.937 0 0 0-.125-11.569 11.457 11.457 0 0 0-5.511-5.931 3.033 3.033 0 0 0-2.488.072 11.924 11.924 0 0 0-6.315 9.528c-.737 7.609 2.762 13.609 7.576 19.629A32.466 32.466 0 0 0 56.8 87.726z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path37"
                    fill="url(#linearGradient897)"
                    d="M66.4 84.672a16.938 16.938 0 0 0-3.116-11.142 11.457 11.457 0 0 0-6.858-4.3 3.033 3.033 0 0 0-2.385.713 11.924 11.924 0 0 0-3.634 10.837c1.257 7.54 6.19 12.43 12.4 17A32.468 32.468 0 0 0 66.4 84.672z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path39"
                    fill="url(#linearGradient899)"
                    d="M74.883 79.237a16.937 16.937 0 0 0-5.893-9.956 11.456 11.456 0 0 0-7.738-2.381 3.033 3.033 0 0 0-2.119 1.306 11.924 11.924 0 0 0-.705 11.409c3.166 6.958 9.2 10.4 16.375 13.212a32.468 32.468 0 0 0 .08-13.59z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path41"
                    fill="url(#linearGradient901)"
                    d="M81.671 71.792A16.938 16.938 0 0 0 73.4 63.7a11.457 11.457 0 0 0-8.09-.3 3.033 3.033 0 0 0-1.708 1.81 11.924 11.924 0 0 0 2.271 11.2c4.859 5.9 11.576 7.67 19.237 8.523a32.466 32.466 0 0 0-3.439-13.141z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path43"
                    fill="url(#linearGradient903)"
                    d="M86.3 62.843a16.938 16.938 0 0 0-10.082-5.676 11.457 11.457 0 0 0-7.891 1.807 3.033 3.033 0 0 0-1.182 2.191A11.924 11.924 0 0 0 72.239 71.4c6.221 4.443 13.167 4.412 20.787 3.254A32.467 32.467 0 0 0 86.3 62.843z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path45"
                    fill="url(#linearGradient905)"
                    d="M88.457 53a16.938 16.938 0 0 0-11.207-2.873 11.457 11.457 0 0 0-7.155 3.788 3.033 3.033 0 0 0-.574 2.422 11.925 11.925 0 0 0 7.567 8.563c7.158 2.681 13.86.854 20.921-2.237A32.467 32.467 0 0 0 88.457 53z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path47"
                    fill="url(#linearGradient907)"
                    d="M87.992 42.936a16.938 16.938 0 0 0-11.569.126 11.457 11.457 0 0 0-5.931 5.511 3.033 3.033 0 0 0 .072 2.488 11.924 11.924 0 0 0 9.527 6.315c7.609.737 13.609-2.762 19.63-7.576a32.468 32.468 0 0 0-11.729-6.864z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path49"
                    fill="url(#linearGradient909)"
                    d="M84.938 33.335A16.938 16.938 0 0 0 73.8 36.451a11.457 11.457 0 0 0-4.3 6.858 3.033 3.033 0 0 0 .714 2.385 11.924 11.924 0 0 0 10.837 3.634c7.54-1.257 12.43-6.19 17-12.4a32.466 32.466 0 0 0-13.113-3.593z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path51"
                    fill="url(#linearGradient911)"
                    d="M79.5 24.851a16.938 16.938 0 0 0-9.956 5.893 11.457 11.457 0 0 0-2.381 7.738 3.033 3.033 0 0 0 1.309 2.118 11.924 11.924 0 0 0 11.409.705c6.958-3.166 10.4-9.2 13.212-16.375a32.468 32.468 0 0 0-13.593-.079z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path53"
                    fill="url(#linearGradient913)"
                    d="M72.057 18.063a16.938 16.938 0 0 0-8.092 8.269 11.457 11.457 0 0 0-.3 8.09 3.033 3.033 0 0 0 1.81 1.709 11.924 11.924 0 0 0 11.2-2.271c5.9-4.859 7.67-11.576 8.523-19.237a32.467 32.467 0 0 0-13.141 3.44z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path55"
                    fill="url(#linearGradient915)"
                    d="M63.109 13.434a16.937 16.937 0 0 0-5.676 10.082 11.457 11.457 0 0 0 1.807 7.891 3.033 3.033 0 0 0 2.191 1.182A11.924 11.924 0 0 0 71.664 27.5c4.443-6.221 4.412-13.167 3.254-20.787a32.466 32.466 0 0 0-11.809 6.721z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path57"
                    fill="url(#linearGradient917)"
                    d="M53.267 11.278a16.937 16.937 0 0 0-2.873 11.207 11.456 11.456 0 0 0 3.788 7.155 3.033 3.033 0 0 0 2.422.575 11.924 11.924 0 0 0 8.566-7.568c2.681-7.159.854-13.86-2.237-20.921a32.466 32.466 0 0 0-9.666 9.552z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path59"
                    fill="url(#linearGradient919)"
                    d="M43.2 11.743a16.938 16.938 0 0 0 .126 11.569 11.457 11.457 0 0 0 5.511 5.931 3.033 3.033 0 0 0 2.488-.072 11.924 11.924 0 0 0 6.315-9.528c.739-7.609-2.76-13.609-7.574-19.629A32.468 32.468 0 0 0 43.2 11.743z"
                    className="petal"
                    opacity={0.65}
                />
            </g>
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/Replit.tsx (registry:component) -> components/logos/Replit.tsx
```tsx
import { type SVGProps } from 'react'

export default function Replit(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 20 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <path
                d="M0 1.5C0 0.671573 0.671573 0 1.5 0H8.5C9.32843 0 10 0.671573 10 1.5V8H1.5C0.671573 8 0 7.32843 0 6.5V1.5Z"
                fill="#F26207"
            />
            <path
                d="M10 8H18.5C19.3284 8 20 8.67157 20 9.5V14.5C20 15.3284 19.3284 16 18.5 16H10V8Z"
                fill="#F26207"
            />
            <path
                d="M0 17.5C0 16.6716 0.671573 16 1.5 16H10V22.5C10 23.3284 9.32843 24 8.5 24H1.5C0.671573 24 0 23.3284 0 22.5V17.5Z"
                fill="#F26207"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/VSCodium.tsx (registry:component) -> components/logos/VSCodium.tsx
```tsx
import { type SVGProps } from 'react'

export default function VSCodium(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width="1em"
            height="1em"
            {...props}>
            <defs>
                <linearGradient
                    id="a"
                    x1={199.997}
                    x2={296.665}
                    y1={214.302}
                    y2={307.573}
                    gradientTransform="translate(-200 -213)"
                    gradientUnits="userSpaceOnUse">
                    <stop
                        offset={0}
                        stopColor="#62A0EA"
                    />
                    <stop
                        offset={1}
                        stopColor="#1A5FB4"
                    />
                </linearGradient>
            </defs>
            <path
                fill="url(#a)"
                d="M48.26 2.274a6.113 6.113 0 0 0-1.838 8.468c10.109 15.655 12.495 27.463 11.46 37.811-4.184 19.816-13.279 23.836-21.227 23.836-7.76 0-5.682-12.771.151-16.509 3.482-2.174 7.942-3.587 11.365-3.587 3.392 0 6.142-2.741 6.142-6.123 0-3.383-2.75-6.124-6.142-6.124-3.998 0-7.92.84-11.581 2.27.748-3.529 1.024-7.343.057-11.397-1.468-6.156-5.694-12.036-13.032-17.736a6.15 6.15 0 0 0-8.621 1.065 6.114 6.114 0 0 0 1.078 8.595c5.978 4.643 7.952 8.08 8.627 10.909.675 2.829.132 5.864-1.224 10.034-1.733 5.62-3.745 10.637-4.627 15.448-.434 2.368-.471 4.945-.583 7.004-4.305-4.196-5.99-9.736-5.99-17.831-.001-3.382-2.751-6.124-6.142-6.123-3.389.003-6.135 2.743-6.136 6.123 0 11.056 3.233 21.576 11.898 28.594 7.844 7.473 27.791 4.711 27.791 16.708 0 3.386 4.956 5.034 8.347 5.034 3.478 0 7.855-2.325 7.855-5.034 0-13.612 14.345-21.885 37.96-21.849 3.392.005 6.144-2.734 6.149-6.116.006-3.383-2.738-6.13-6.13-6.136a78.226 78.226 0 0 0-4.741.145c2.64-6.209 3.811-13.045 3.569-20.429-.112-3.381-2.95-6.031-6.339-5.921-3.393.11-6.051 2.943-5.94 6.326.32 9.668-.042 18.301-7.245 22.852-2.048 1.293-4.429 2.415-6.687 2.415 1.753-4.768 3.077-9.801 3.619-15.226.346-3.462.383-7.575-.012-10.77-.613-4.95-1.353-10.564.526-14.793 1.688-3.642 5.47-5.167 11.023-5.167 3.389-.003 6.135-2.744 6.136-6.123.002-3.383-2.745-6.127-6.136-6.13-8.252 0-14.507 4.343-18.053 9.59-1.854-3.96-4.112-8.041-6.84-12.265a6.14 6.14 0 0 0-3.86-2.669 6.159 6.159 0 0 0-4.627.831z"
            />
        </svg>
    )
}

```

## Integrations Block 6 (integrations-6)
- Source: https://tailark.com/r/integrations-6.json
- Description: Shadcn/ui website integrations
- Registry dependencies: button
### ../../packages/dusk-kit/blocks/integrations/six/index.tsx (registry:component) -> components/integrations-6.tsx
```tsx
import { Gemini, Replit, GooglePaLM } from '@/components/logos'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function IntegrationsSection() {
    return (
        <section>
            <div className="bg-muted dark:bg-background py-24 md:py-32">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="mx-auto max-w-md px-6 [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_70%,transparent_100%)]">
                        <div className="bg-background dark:bg-muted/50 rounded-xl border px-6 pb-12 pt-3 shadow-xl">
                            <Integration
                                icon={<Gemini />}
                                name="Gemini"
                                description="The AI model that powers Google's search engine."
                            />
                            <Integration
                                icon={<Replit />}
                                name="Replit"
                                description="The AI model that powers Google's search engine."
                            />
                            <Integration
                                icon={<GooglePaLM />}
                                name="GooglePaLM"
                                description="The AI model that powers Google's search engine."
                            />
                        </div>
                    </div>
                    <div className="mx-auto mt-6 max-w-lg space-y-6 text-center">
                        <h2 className="text-balance text-3xl font-semibold md:text-4xl lg:text-5xl">Integrate with your favorite LLMs</h2>
                        <p className="text-muted-foreground">Connect seamlessly with popular platforms and services to enhance your workflow.</p>

                        <Button
                            variant="outline"
                            size="sm"
                            asChild>
                            <Link href="#">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

const Integration = ({ icon, name, description }: { icon: React.ReactNode; name: string; description: string }) => {
    return (
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-dashed py-3 last:border-b-0">
            <div className="bg-muted border-foreground/5 flex size-12 items-center justify-center rounded-lg border">{icon}</div>
            <div className="space-y-0.5">
                <h3 className="text-sm font-medium">{name}</h3>
                <p className="text-muted-foreground line-clamp-1 text-sm">{description}</p>
            </div>
            <Button
                variant="outline"
                size="icon"
                aria-label="Add integration">
                <Plus className="size-4" />
            </Button>
        </div>
    )
}

```
### ../../packages/core/src/components/logos/index.ts (registry:component) -> components/logos/index.ts
```tsx
export { default as Gemini } from './Gemini'
export { default as Replit } from './Replit'
export { default as MagicUI } from './MagicUI'
export { default as VSCodium } from './VSCodium'
export { default as MediaWiki } from './MediaWiki'
export { default as GooglePaLM } from './GooglePaLM'

```
### ../../packages/core/src/components/logos/Gemini.tsx (registry:component) -> components/logos/Gemini.tsx
```tsx
import { type SVGProps } from 'react'

export default function Gemini(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            height="1em"
            style={{
                flex: 'none',
                lineHeight: 1,
            }}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            {...props}>
            <title>{'Gemini'}</title>
            <defs>
                <linearGradient
                    id="lobe-icons-gemini-fill"
                    x1="0%"
                    x2="68.73%"
                    y1="100%"
                    y2="30.395%">
                    <stop
                        offset="0%"
                        stopColor="#1C7DFF"
                    />
                    <stop
                        offset="52.021%"
                        stopColor="#1C69FF"
                    />
                    <stop
                        offset="100%"
                        stopColor="#F0DCD6"
                    />
                </linearGradient>
            </defs>
            <path
                d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
                fill="url(#lobe-icons-gemini-fill)"
                fillRule="nonzero"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/GooglePaLM.tsx (registry:component) -> components/logos/GooglePaLM.tsx
```tsx
import type { SVGProps } from 'react'

export default function GooglePaLM(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 229"
            {...props}>
            <path
                fill="#F9AB00"
                d="M128 228.542c9.895 0 17.91-8.015 17.91-17.91V55.413h-35.82v155.219c0 9.895 8.015 17.91 17.91 17.91Z"
            />
            <path
                fill="#5BB974"
                d="M199.356 112.053C180.043 92.755 151.193 88.845 128 100.307l76.669 76.67c3.164 3.163 8.612 1.91 9.955-2.344 6.746-21.357 1.657-45.64-15.268-62.58Z"
            />
            <path
                fill="#129EAF"
                d="M56.644 112.053C75.957 92.755 104.807 88.845 128 100.307l-76.669 76.67c-3.164 3.163-8.612 1.91-9.955-2.344-6.746-21.357-1.657-45.64 15.268-62.58Z"
            />
            <path
                fill="#AF5CF7"
                d="M193.67 52.548c-30.507 0-56.402 20-65.67 47.76h121.25c4.97 0 8.283-5.254 6.03-9.687-11.523-22.611-34.776-38.073-61.61-38.073Z"
            />
            <path
                fill="#FF8BCB"
                d="M140.671 20.101C119.09 41.682 114.926 74.114 128 100.307l85.743-85.743c3.523-3.522 2.15-9.582-2.582-11.119-24.148-7.836-51.52-2.313-70.49 16.656Z"
            />
            <path
                fill="#FA7B17"
                d="M115.329 20.101C136.91 41.682 141.074 74.114 128 100.307L42.257 14.564c-3.523-3.522-2.15-9.582 2.582-11.119 24.148-7.836 51.52-2.313 70.49 16.656Z"
            />
            <path
                fill="#4285F4"
                d="M62.33 52.548c30.507 0 56.402 20 65.67 47.76H6.75c-4.97 0-8.283-5.254-6.03-9.687C12.244 68.01 35.497 52.548 62.33 52.548Z"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/MagicUI.tsx (registry:component) -> components/logos/MagicUI.tsx
```tsx
import type { SVGProps } from 'react'

export default function MagicUI(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 256 256"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-6"
            {...props}>
            <rect
                width={256}
                height={256}
                rx={128}
                fill="url(#paint0_linear_601_4643)"
            />
            <rect
                width={256}
                height={256}
                rx={128}
                fill="url(#paint1_linear_601_4643)"
            />
            <path
                d="M124.157 193.675C123.939 193.783 123.722 193.837 123.505 193.837C123.287 193.837 122.852 193.837 122.2 193.837C120.678 193.837 118.884 193.567 116.818 193.025C114.862 192.591 112.905 191.995 110.948 191.236C109.099 190.586 107.469 189.828 106.055 188.961C104.751 188.094 103.935 187.335 103.609 186.685C103.501 185.167 103.446 183.596 103.446 181.97C103.446 180.345 103.446 178.773 103.446 177.256C103.446 165.118 104.316 152.438 106.055 139.217C107.904 125.995 110.893 111.69 115.025 96.3005C115.459 94.7833 115.894 92.8867 116.329 90.6108C116.873 88.2266 117.416 85.6798 117.96 82.9704C115.351 85.0296 112.252 88.335 108.665 92.8867C105.077 97.3301 101.272 102.64 97.2492 108.818C93.3354 114.887 89.3672 121.606 85.3446 128.975C81.4308 136.236 77.8431 143.66 74.5815 151.246C71.32 158.724 68.4933 166.148 66.1015 173.517C63.8185 180.887 62.4051 187.714 61.8615 194C56.6431 192.483 53.001 190.966 50.9354 189.448C48.9785 187.931 48 186.089 48 183.921C48 181.97 48.5979 179.207 49.7938 175.631C50.9897 172.054 52.6749 167.828 54.8492 162.951C57.0236 158.074 59.6872 152.655 62.84 146.695C65.9928 140.626 69.4718 134.123 73.2769 127.187C77.6256 119.276 81.8656 111.852 85.9969 104.916C90.2369 97.9803 94.3682 91.6946 98.3908 86.0591C102.413 80.4236 106.327 75.5468 110.132 71.4286C114.046 67.3104 117.906 64.1675 121.711 62C123.233 62 125.244 62.3793 127.745 63.1379C130.354 63.8966 132.854 64.8177 135.246 65.9015C137.747 66.9852 139.921 68.1232 141.769 69.3153C143.726 70.399 144.813 71.3202 145.031 72.0788C143.509 75.1133 141.715 79.665 139.649 85.734C137.584 91.803 135.464 98.6847 133.289 106.379C131.224 114.074 129.212 122.256 127.255 130.926C125.407 139.488 123.939 147.724 122.852 155.635C125.353 149.675 128.234 143.498 131.495 137.103C134.866 130.601 138.399 124.207 142.095 117.921C145.792 111.527 149.543 105.35 153.348 99.3892C157.262 93.4286 161.067 88.0099 164.763 83.133C168.459 78.1478 171.884 73.8128 175.037 70.1281C178.298 66.4434 181.179 63.734 183.68 62C185.202 62 187.213 62.3793 189.714 63.1379C192.323 63.8966 194.824 64.8177 197.215 65.9015C199.716 66.9852 201.89 68.1232 203.738 69.3153C205.695 70.399 206.783 71.3202 207 72.0788C203.521 78.2562 200.477 85.7882 197.868 94.6749C195.258 103.562 193.03 112.882 191.182 122.635C189.442 132.389 188.083 142.089 187.105 151.734C186.235 161.271 185.8 169.833 185.8 177.419C185.8 179.911 185.8 182.512 185.8 185.222C185.8 187.931 185.909 190.749 186.126 193.675C184.604 193.675 182.756 193.458 180.582 193.025C178.516 192.7 176.45 192.212 174.385 191.562C172.428 190.911 170.634 190.153 169.003 189.286C167.372 188.527 166.231 187.66 165.578 186.685C165.47 185.167 165.415 183.596 165.415 181.97C165.415 180.345 165.415 178.773 165.415 177.256C165.415 165.118 166.285 152.438 168.025 139.217C169.873 125.995 172.863 111.69 176.994 96.3005C177.429 94.7833 177.918 92.7241 178.462 90.1232C179.005 87.5222 179.549 84.8128 180.092 81.9951C177.048 83.5123 173.569 86.4384 169.655 90.7734C165.85 95 161.936 100.202 157.914 106.379C154 112.448 150.086 119.222 146.172 126.7C142.367 134.177 138.888 141.818 135.735 149.621C132.691 157.315 130.082 165.01 127.908 172.704C125.842 180.291 124.592 187.281 124.157 193.675Z"
                fill="white"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_601_4643"
                    x1={128}
                    y1={0}
                    x2={128}
                    y2={256}
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#EF786F" />
                    <stop
                        offset={1}
                        stopColor="#D8595E"
                    />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_601_4643"
                    x1={78}
                    y1={0.0000037012}
                    x2={236}
                    y2={256}
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9E7AFF" />
                    <stop
                        offset={0.333333}
                        stopColor="#FE8BBB"
                    />
                    <stop
                        offset={0.666667}
                        stopColor="#FFBD7A"
                    />
                    <stop
                        offset={1}
                        stopColor="#F8EAC3"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/MediaWiki.tsx (registry:component) -> components/logos/MediaWiki.tsx
```tsx
import { type SVGProps } from 'react'

export default function MediaWiki(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            id="svg62"
            viewBox="0 0 50 50"
            width="1em"
            height="1em"
            {...props}>
            <defs id="defs11">
                <linearGradient
                    id="gradient"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse">
                    <stop
                        id="stop2"
                        offset="0%"
                        stopColor="#0a00b2"
                    />
                    <stop
                        id="stop4"
                        offset="50%"
                        stopColor="red"
                    />
                    <stop
                        id="stop6"
                        offset="100%"
                        stopColor="#fffc00"
                    />
                </linearGradient>
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient873"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient875"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient877"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient879"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient881"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient883"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient885"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient887"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient889"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient891"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient893"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient895"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient897"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient899"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient901"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient903"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient905"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient907"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient909"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient911"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient913"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient915"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient917"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient919"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient921"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <style id="style9">{'.petal{opacity:.65}'}</style>
            </defs>
            <g
                id="petals"
                fill="url(#linearGradient921)"
                transform="matrix(.5 0 0 .5 0 .026)">
                <path
                    id="path13"
                    fill="url(#linearGradient873)"
                    d="M33.6 14.8a16.938 16.938 0 0 0 3.116 11.142 11.457 11.457 0 0 0 6.858 4.3 3.033 3.033 0 0 0 2.385-.713 11.924 11.924 0 0 0 3.634-10.837c-1.257-7.54-6.19-12.43-12.4-17A32.468 32.468 0 0 0 33.6 14.8z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path15"
                    fill="url(#linearGradient875)"
                    d="M25.117 20.232a16.938 16.938 0 0 0 5.893 9.956 11.457 11.457 0 0 0 7.738 2.381 3.033 3.033 0 0 0 2.119-1.306 11.924 11.924 0 0 0 .705-11.409C38.406 12.9 32.376 9.449 25.2 6.642a32.468 32.468 0 0 0-.083 13.59z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path17"
                    fill="url(#linearGradient877)"
                    d="M18.329 27.677a16.937 16.937 0 0 0 8.271 8.092 11.457 11.457 0 0 0 8.09.3 3.033 3.033 0 0 0 1.709-1.81 11.924 11.924 0 0 0-2.271-11.2c-4.859-5.9-11.576-7.67-19.237-8.523a32.466 32.466 0 0 0 3.438 13.141z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path19"
                    fill="url(#linearGradient879)"
                    d="M13.7 36.626A16.938 16.938 0 0 0 23.781 42.3a11.457 11.457 0 0 0 7.891-1.807 3.033 3.033 0 0 0 1.182-2.193 11.924 11.924 0 0 0-5.093-10.233c-6.221-4.443-13.167-4.412-20.787-3.254A32.468 32.468 0 0 0 13.7 36.626z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path21"
                    fill="url(#linearGradient881)"
                    d="M11.543 46.468a16.938 16.938 0 0 0 11.208 2.873 11.457 11.457 0 0 0 7.155-3.788 3.034 3.034 0 0 0 .575-2.422 11.924 11.924 0 0 0-7.568-8.566c-7.16-2.681-13.861-.854-20.923 2.235a32.468 32.468 0 0 0 9.553 9.668z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path23"
                    fill="url(#linearGradient883)"
                    d="M12.008 56.532a16.938 16.938 0 0 0 11.569-.126 11.457 11.457 0 0 0 5.931-5.51 3.033 3.033 0 0 0-.072-2.488 11.924 11.924 0 0 0-9.527-6.315C12.3 41.356 6.3 44.855.279 49.669a32.467 32.467 0 0 0 11.729 6.863z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path25"
                    fill="url(#linearGradient885)"
                    d="M15.062 66.134A16.938 16.938 0 0 0 26.2 63.018a11.457 11.457 0 0 0 4.3-6.858 3.033 3.033 0 0 0-.713-2.385 11.924 11.924 0 0 0-10.837-3.634c-7.54 1.257-12.43 6.19-17 12.4a32.468 32.468 0 0 0 13.112 3.593z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path27"
                    fill="url(#linearGradient887)"
                    d="M20.5 74.618a16.938 16.938 0 0 0 9.956-5.893 11.457 11.457 0 0 0 2.381-7.738 3.033 3.033 0 0 0-1.306-2.119 11.925 11.925 0 0 0-11.409-.705c-6.958 3.166-10.4 9.2-13.212 16.376a32.466 32.466 0 0 0 13.59.079z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path29"
                    fill="url(#linearGradient889)"
                    d="M27.943 81.406a16.938 16.938 0 0 0 8.092-8.269 11.457 11.457 0 0 0 .3-8.09 3.033 3.033 0 0 0-1.81-1.709 11.924 11.924 0 0 0-11.2 2.271c-5.9 4.859-7.67 11.576-8.523 19.237a32.467 32.467 0 0 0 13.141-3.44z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path31"
                    fill="url(#linearGradient891)"
                    d="M36.891 86.035a16.938 16.938 0 0 0 5.676-10.082 11.457 11.457 0 0 0-1.807-7.891 3.033 3.033 0 0 0-2.191-1.182 11.924 11.924 0 0 0-10.233 5.094c-4.443 6.221-4.412 13.167-3.254 20.787a32.467 32.467 0 0 0 11.809-6.726z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path33"
                    fill="url(#linearGradient893)"
                    d="M46.733 88.191a16.937 16.937 0 0 0 2.873-11.207 11.457 11.457 0 0 0-3.788-7.155 3.033 3.033 0 0 0-2.422-.575 11.924 11.924 0 0 0-8.566 7.568c-2.681 7.159-.854 13.86 2.237 20.921a32.465 32.465 0 0 0 9.666-9.552z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path35"
                    fill="url(#linearGradient895)"
                    d="M56.8 87.726a16.937 16.937 0 0 0-.125-11.569 11.457 11.457 0 0 0-5.511-5.931 3.033 3.033 0 0 0-2.488.072 11.924 11.924 0 0 0-6.315 9.528c-.737 7.609 2.762 13.609 7.576 19.629A32.466 32.466 0 0 0 56.8 87.726z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path37"
                    fill="url(#linearGradient897)"
                    d="M66.4 84.672a16.938 16.938 0 0 0-3.116-11.142 11.457 11.457 0 0 0-6.858-4.3 3.033 3.033 0 0 0-2.385.713 11.924 11.924 0 0 0-3.634 10.837c1.257 7.54 6.19 12.43 12.4 17A32.468 32.468 0 0 0 66.4 84.672z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path39"
                    fill="url(#linearGradient899)"
                    d="M74.883 79.237a16.937 16.937 0 0 0-5.893-9.956 11.456 11.456 0 0 0-7.738-2.381 3.033 3.033 0 0 0-2.119 1.306 11.924 11.924 0 0 0-.705 11.409c3.166 6.958 9.2 10.4 16.375 13.212a32.468 32.468 0 0 0 .08-13.59z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path41"
                    fill="url(#linearGradient901)"
                    d="M81.671 71.792A16.938 16.938 0 0 0 73.4 63.7a11.457 11.457 0 0 0-8.09-.3 3.033 3.033 0 0 0-1.708 1.81 11.924 11.924 0 0 0 2.271 11.2c4.859 5.9 11.576 7.67 19.237 8.523a32.466 32.466 0 0 0-3.439-13.141z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path43"
                    fill="url(#linearGradient903)"
                    d="M86.3 62.843a16.938 16.938 0 0 0-10.082-5.676 11.457 11.457 0 0 0-7.891 1.807 3.033 3.033 0 0 0-1.182 2.191A11.924 11.924 0 0 0 72.239 71.4c6.221 4.443 13.167 4.412 20.787 3.254A32.467 32.467 0 0 0 86.3 62.843z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path45"
                    fill="url(#linearGradient905)"
                    d="M88.457 53a16.938 16.938 0 0 0-11.207-2.873 11.457 11.457 0 0 0-7.155 3.788 3.033 3.033 0 0 0-.574 2.422 11.925 11.925 0 0 0 7.567 8.563c7.158 2.681 13.86.854 20.921-2.237A32.467 32.467 0 0 0 88.457 53z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path47"
                    fill="url(#linearGradient907)"
                    d="M87.992 42.936a16.938 16.938 0 0 0-11.569.126 11.457 11.457 0 0 0-5.931 5.511 3.033 3.033 0 0 0 .072 2.488 11.924 11.924 0 0 0 9.527 6.315c7.609.737 13.609-2.762 19.63-7.576a32.468 32.468 0 0 0-11.729-6.864z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path49"
                    fill="url(#linearGradient909)"
                    d="M84.938 33.335A16.938 16.938 0 0 0 73.8 36.451a11.457 11.457 0 0 0-4.3 6.858 3.033 3.033 0 0 0 .714 2.385 11.924 11.924 0 0 0 10.837 3.634c7.54-1.257 12.43-6.19 17-12.4a32.466 32.466 0 0 0-13.113-3.593z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path51"
                    fill="url(#linearGradient911)"
                    d="M79.5 24.851a16.938 16.938 0 0 0-9.956 5.893 11.457 11.457 0 0 0-2.381 7.738 3.033 3.033 0 0 0 1.309 2.118 11.924 11.924 0 0 0 11.409.705c6.958-3.166 10.4-9.2 13.212-16.375a32.468 32.468 0 0 0-13.593-.079z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path53"
                    fill="url(#linearGradient913)"
                    d="M72.057 18.063a16.938 16.938 0 0 0-8.092 8.269 11.457 11.457 0 0 0-.3 8.09 3.033 3.033 0 0 0 1.81 1.709 11.924 11.924 0 0 0 11.2-2.271c5.9-4.859 7.67-11.576 8.523-19.237a32.467 32.467 0 0 0-13.141 3.44z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path55"
                    fill="url(#linearGradient915)"
                    d="M63.109 13.434a16.937 16.937 0 0 0-5.676 10.082 11.457 11.457 0 0 0 1.807 7.891 3.033 3.033 0 0 0 2.191 1.182A11.924 11.924 0 0 0 71.664 27.5c4.443-6.221 4.412-13.167 3.254-20.787a32.466 32.466 0 0 0-11.809 6.721z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path57"
                    fill="url(#linearGradient917)"
                    d="M53.267 11.278a16.937 16.937 0 0 0-2.873 11.207 11.456 11.456 0 0 0 3.788 7.155 3.033 3.033 0 0 0 2.422.575 11.924 11.924 0 0 0 8.566-7.568c2.681-7.159.854-13.86-2.237-20.921a32.466 32.466 0 0 0-9.666 9.552z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path59"
                    fill="url(#linearGradient919)"
                    d="M43.2 11.743a16.938 16.938 0 0 0 .126 11.569 11.457 11.457 0 0 0 5.511 5.931 3.033 3.033 0 0 0 2.488-.072 11.924 11.924 0 0 0 6.315-9.528c.739-7.609-2.76-13.609-7.574-19.629A32.468 32.468 0 0 0 43.2 11.743z"
                    className="petal"
                    opacity={0.65}
                />
            </g>
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/Replit.tsx (registry:component) -> components/logos/Replit.tsx
```tsx
import { type SVGProps } from 'react'

export default function Replit(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 20 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <path
                d="M0 1.5C0 0.671573 0.671573 0 1.5 0H8.5C9.32843 0 10 0.671573 10 1.5V8H1.5C0.671573 8 0 7.32843 0 6.5V1.5Z"
                fill="#F26207"
            />
            <path
                d="M10 8H18.5C19.3284 8 20 8.67157 20 9.5V14.5C20 15.3284 19.3284 16 18.5 16H10V8Z"
                fill="#F26207"
            />
            <path
                d="M0 17.5C0 16.6716 0.671573 16 1.5 16H10V22.5C10 23.3284 9.32843 24 8.5 24H1.5C0.671573 24 0 23.3284 0 22.5V17.5Z"
                fill="#F26207"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/VSCodium.tsx (registry:component) -> components/logos/VSCodium.tsx
```tsx
import { type SVGProps } from 'react'

export default function VSCodium(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width="1em"
            height="1em"
            {...props}>
            <defs>
                <linearGradient
                    id="a"
                    x1={199.997}
                    x2={296.665}
                    y1={214.302}
                    y2={307.573}
                    gradientTransform="translate(-200 -213)"
                    gradientUnits="userSpaceOnUse">
                    <stop
                        offset={0}
                        stopColor="#62A0EA"
                    />
                    <stop
                        offset={1}
                        stopColor="#1A5FB4"
                    />
                </linearGradient>
            </defs>
            <path
                fill="url(#a)"
                d="M48.26 2.274a6.113 6.113 0 0 0-1.838 8.468c10.109 15.655 12.495 27.463 11.46 37.811-4.184 19.816-13.279 23.836-21.227 23.836-7.76 0-5.682-12.771.151-16.509 3.482-2.174 7.942-3.587 11.365-3.587 3.392 0 6.142-2.741 6.142-6.123 0-3.383-2.75-6.124-6.142-6.124-3.998 0-7.92.84-11.581 2.27.748-3.529 1.024-7.343.057-11.397-1.468-6.156-5.694-12.036-13.032-17.736a6.15 6.15 0 0 0-8.621 1.065 6.114 6.114 0 0 0 1.078 8.595c5.978 4.643 7.952 8.08 8.627 10.909.675 2.829.132 5.864-1.224 10.034-1.733 5.62-3.745 10.637-4.627 15.448-.434 2.368-.471 4.945-.583 7.004-4.305-4.196-5.99-9.736-5.99-17.831-.001-3.382-2.751-6.124-6.142-6.123-3.389.003-6.135 2.743-6.136 6.123 0 11.056 3.233 21.576 11.898 28.594 7.844 7.473 27.791 4.711 27.791 16.708 0 3.386 4.956 5.034 8.347 5.034 3.478 0 7.855-2.325 7.855-5.034 0-13.612 14.345-21.885 37.96-21.849 3.392.005 6.144-2.734 6.149-6.116.006-3.383-2.738-6.13-6.13-6.136a78.226 78.226 0 0 0-4.741.145c2.64-6.209 3.811-13.045 3.569-20.429-.112-3.381-2.95-6.031-6.339-5.921-3.393.11-6.051 2.943-5.94 6.326.32 9.668-.042 18.301-7.245 22.852-2.048 1.293-4.429 2.415-6.687 2.415 1.753-4.768 3.077-9.801 3.619-15.226.346-3.462.383-7.575-.012-10.77-.613-4.95-1.353-10.564.526-14.793 1.688-3.642 5.47-5.167 11.023-5.167 3.389-.003 6.135-2.744 6.136-6.123.002-3.383-2.745-6.127-6.136-6.13-8.252 0-14.507 4.343-18.053 9.59-1.854-3.96-4.112-8.041-6.84-12.265a6.14 6.14 0 0 0-3.86-2.669 6.159 6.159 0 0 0-4.627.831z"
            />
        </svg>
    )
}

```

## Integrations Block 7 (integrations-7)
- Source: https://tailark.com/r/integrations-7.json
- Description: Shadcn/ui website integrations block
- Registry dependencies: button, https://motion-primitives.com/c/infinite-slider.json
### ../../packages/dusk-kit/blocks/integrations/seven/index.tsx (registry:component) -> components/integrations-7.tsx
```tsx
import { Gemini, Replit, MagicUI, VSCodium, MediaWiki, GooglePaLM } from '@/components/logos'
import { LogoIcon } from '@/components/logo'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider'

export default function IntegrationsSection() {
    return (
        <section>
            <div className="bg-muted dark:bg-background py-24 md:py-32">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="bg-muted/25 group relative mx-auto max-w-[22rem] items-center justify-between space-y-6 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] sm:max-w-md">
                        <div
                            role="presentation"
                            className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:32px_32px] opacity-50"></div>
                        <div>
                            <InfiniteSlider
                                gap={24}
                                speed={20}
                                speedOnHover={10}>
                                <IntegrationCard>
                                    <VSCodium />
                                </IntegrationCard>
                                <IntegrationCard>
                                    <MediaWiki />
                                </IntegrationCard>
                                <IntegrationCard>
                                    <GooglePaLM />
                                </IntegrationCard>
                                <IntegrationCard>
                                    <Gemini />
                                </IntegrationCard>
                                <IntegrationCard>
                                    <Replit />
                                </IntegrationCard>
                                <IntegrationCard>
                                    <MagicUI />
                                </IntegrationCard>
                            </InfiniteSlider>
                        </div>

                        <div>
                            <InfiniteSlider
                                gap={24}
                                speed={20}
                                speedOnHover={10}
                                reverse>
                                <IntegrationCard>
                                    <Gemini />
                                </IntegrationCard>
                                <IntegrationCard>
                                    <Replit />
                                </IntegrationCard>
                                <IntegrationCard>
                                    <MediaWiki />
                                </IntegrationCard>
                                <IntegrationCard>
                                    <MagicUI />
                                </IntegrationCard>
                                <IntegrationCard>
                                    <VSCodium />
                                </IntegrationCard>
                                <IntegrationCard>
                                    <GooglePaLM />
                                </IntegrationCard>
                            </InfiniteSlider>
                        </div>
                        <div>
                            <InfiniteSlider
                                gap={24}
                                speed={20}
                                speedOnHover={10}>
                                <IntegrationCard>
                                    <Replit />
                                </IntegrationCard>
                                <IntegrationCard>
                                    <MagicUI />
                                </IntegrationCard>
                                <IntegrationCard>
                                    <Gemini />
                                </IntegrationCard>
                                <IntegrationCard>
                                    <VSCodium />
                                </IntegrationCard>
                                <IntegrationCard>
                                    <MediaWiki />
                                </IntegrationCard>
                                <IntegrationCard>
                                    <GooglePaLM />
                                </IntegrationCard>
                            </InfiniteSlider>
                        </div>
                        <div className="absolute inset-0 m-auto flex size-fit justify-center gap-2">
                            <IntegrationCard
                                className="shadow-black-950/10 size-16 bg-white/25 shadow-xl backdrop-blur-md backdrop-grayscale dark:border-white/10 dark:shadow-white/15"
                                isCenter={true}>
                                <LogoIcon />
                            </IntegrationCard>
                        </div>
                    </div>
                    <div className="mx-auto mt-12 max-w-lg space-y-6 text-center">
                        <h2 className="text-balance text-3xl font-semibold md:text-4xl">Integrate with your favorite tools</h2>
                        <p className="text-muted-foreground">Connect seamlessly with popular platforms and services to enhance your workflow.</p>

                        <Button
                            variant="outline"
                            size="sm"
                            asChild>
                            <Link href="#">Get Started</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

const IntegrationCard = ({ children, className, isCenter = false }: { children: React.ReactNode; className?: string; position?: 'left-top' | 'left-middle' | 'left-bottom' | 'right-top' | 'right-middle' | 'right-bottom'; isCenter?: boolean }) => {
    return (
        <div className={cn('bg-background relative z-20 flex size-12 rounded-full border', className)}>
            <div className={cn('m-auto size-fit *:size-5', isCenter && '*:size-8')}>{children}</div>
        </div>
    )
}

```
### ../../packages/core/src/components/logo.tsx (registry:component)
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/index.ts (registry:component) -> components/logos/index.ts
```tsx
export { default as Gemini } from './Gemini'
export { default as Replit } from './Replit'
export { default as MagicUI } from './MagicUI'
export { default as VSCodium } from './VSCodium'
export { default as MediaWiki } from './MediaWiki'
export { default as GooglePaLM } from './GooglePaLM'

```
### ../../packages/core/src/components/logos/Gemini.tsx (registry:component) -> components/logos/Gemini.tsx
```tsx
import { type SVGProps } from 'react'

export default function Gemini(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            height="1em"
            style={{
                flex: 'none',
                lineHeight: 1,
            }}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            {...props}>
            <title>{'Gemini'}</title>
            <defs>
                <linearGradient
                    id="lobe-icons-gemini-fill"
                    x1="0%"
                    x2="68.73%"
                    y1="100%"
                    y2="30.395%">
                    <stop
                        offset="0%"
                        stopColor="#1C7DFF"
                    />
                    <stop
                        offset="52.021%"
                        stopColor="#1C69FF"
                    />
                    <stop
                        offset="100%"
                        stopColor="#F0DCD6"
                    />
                </linearGradient>
            </defs>
            <path
                d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
                fill="url(#lobe-icons-gemini-fill)"
                fillRule="nonzero"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/GooglePaLM.tsx (registry:component) -> components/logos/GooglePaLM.tsx
```tsx
import type { SVGProps } from 'react'

export default function GooglePaLM(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 229"
            {...props}>
            <path
                fill="#F9AB00"
                d="M128 228.542c9.895 0 17.91-8.015 17.91-17.91V55.413h-35.82v155.219c0 9.895 8.015 17.91 17.91 17.91Z"
            />
            <path
                fill="#5BB974"
                d="M199.356 112.053C180.043 92.755 151.193 88.845 128 100.307l76.669 76.67c3.164 3.163 8.612 1.91 9.955-2.344 6.746-21.357 1.657-45.64-15.268-62.58Z"
            />
            <path
                fill="#129EAF"
                d="M56.644 112.053C75.957 92.755 104.807 88.845 128 100.307l-76.669 76.67c-3.164 3.163-8.612 1.91-9.955-2.344-6.746-21.357-1.657-45.64 15.268-62.58Z"
            />
            <path
                fill="#AF5CF7"
                d="M193.67 52.548c-30.507 0-56.402 20-65.67 47.76h121.25c4.97 0 8.283-5.254 6.03-9.687-11.523-22.611-34.776-38.073-61.61-38.073Z"
            />
            <path
                fill="#FF8BCB"
                d="M140.671 20.101C119.09 41.682 114.926 74.114 128 100.307l85.743-85.743c3.523-3.522 2.15-9.582-2.582-11.119-24.148-7.836-51.52-2.313-70.49 16.656Z"
            />
            <path
                fill="#FA7B17"
                d="M115.329 20.101C136.91 41.682 141.074 74.114 128 100.307L42.257 14.564c-3.523-3.522-2.15-9.582 2.582-11.119 24.148-7.836 51.52-2.313 70.49 16.656Z"
            />
            <path
                fill="#4285F4"
                d="M62.33 52.548c30.507 0 56.402 20 65.67 47.76H6.75c-4.97 0-8.283-5.254-6.03-9.687C12.244 68.01 35.497 52.548 62.33 52.548Z"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/MagicUI.tsx (registry:component) -> components/logos/MagicUI.tsx
```tsx
import type { SVGProps } from 'react'

export default function MagicUI(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 256 256"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-6"
            {...props}>
            <rect
                width={256}
                height={256}
                rx={128}
                fill="url(#paint0_linear_601_4643)"
            />
            <rect
                width={256}
                height={256}
                rx={128}
                fill="url(#paint1_linear_601_4643)"
            />
            <path
                d="M124.157 193.675C123.939 193.783 123.722 193.837 123.505 193.837C123.287 193.837 122.852 193.837 122.2 193.837C120.678 193.837 118.884 193.567 116.818 193.025C114.862 192.591 112.905 191.995 110.948 191.236C109.099 190.586 107.469 189.828 106.055 188.961C104.751 188.094 103.935 187.335 103.609 186.685C103.501 185.167 103.446 183.596 103.446 181.97C103.446 180.345 103.446 178.773 103.446 177.256C103.446 165.118 104.316 152.438 106.055 139.217C107.904 125.995 110.893 111.69 115.025 96.3005C115.459 94.7833 115.894 92.8867 116.329 90.6108C116.873 88.2266 117.416 85.6798 117.96 82.9704C115.351 85.0296 112.252 88.335 108.665 92.8867C105.077 97.3301 101.272 102.64 97.2492 108.818C93.3354 114.887 89.3672 121.606 85.3446 128.975C81.4308 136.236 77.8431 143.66 74.5815 151.246C71.32 158.724 68.4933 166.148 66.1015 173.517C63.8185 180.887 62.4051 187.714 61.8615 194C56.6431 192.483 53.001 190.966 50.9354 189.448C48.9785 187.931 48 186.089 48 183.921C48 181.97 48.5979 179.207 49.7938 175.631C50.9897 172.054 52.6749 167.828 54.8492 162.951C57.0236 158.074 59.6872 152.655 62.84 146.695C65.9928 140.626 69.4718 134.123 73.2769 127.187C77.6256 119.276 81.8656 111.852 85.9969 104.916C90.2369 97.9803 94.3682 91.6946 98.3908 86.0591C102.413 80.4236 106.327 75.5468 110.132 71.4286C114.046 67.3104 117.906 64.1675 121.711 62C123.233 62 125.244 62.3793 127.745 63.1379C130.354 63.8966 132.854 64.8177 135.246 65.9015C137.747 66.9852 139.921 68.1232 141.769 69.3153C143.726 70.399 144.813 71.3202 145.031 72.0788C143.509 75.1133 141.715 79.665 139.649 85.734C137.584 91.803 135.464 98.6847 133.289 106.379C131.224 114.074 129.212 122.256 127.255 130.926C125.407 139.488 123.939 147.724 122.852 155.635C125.353 149.675 128.234 143.498 131.495 137.103C134.866 130.601 138.399 124.207 142.095 117.921C145.792 111.527 149.543 105.35 153.348 99.3892C157.262 93.4286 161.067 88.0099 164.763 83.133C168.459 78.1478 171.884 73.8128 175.037 70.1281C178.298 66.4434 181.179 63.734 183.68 62C185.202 62 187.213 62.3793 189.714 63.1379C192.323 63.8966 194.824 64.8177 197.215 65.9015C199.716 66.9852 201.89 68.1232 203.738 69.3153C205.695 70.399 206.783 71.3202 207 72.0788C203.521 78.2562 200.477 85.7882 197.868 94.6749C195.258 103.562 193.03 112.882 191.182 122.635C189.442 132.389 188.083 142.089 187.105 151.734C186.235 161.271 185.8 169.833 185.8 177.419C185.8 179.911 185.8 182.512 185.8 185.222C185.8 187.931 185.909 190.749 186.126 193.675C184.604 193.675 182.756 193.458 180.582 193.025C178.516 192.7 176.45 192.212 174.385 191.562C172.428 190.911 170.634 190.153 169.003 189.286C167.372 188.527 166.231 187.66 165.578 186.685C165.47 185.167 165.415 183.596 165.415 181.97C165.415 180.345 165.415 178.773 165.415 177.256C165.415 165.118 166.285 152.438 168.025 139.217C169.873 125.995 172.863 111.69 176.994 96.3005C177.429 94.7833 177.918 92.7241 178.462 90.1232C179.005 87.5222 179.549 84.8128 180.092 81.9951C177.048 83.5123 173.569 86.4384 169.655 90.7734C165.85 95 161.936 100.202 157.914 106.379C154 112.448 150.086 119.222 146.172 126.7C142.367 134.177 138.888 141.818 135.735 149.621C132.691 157.315 130.082 165.01 127.908 172.704C125.842 180.291 124.592 187.281 124.157 193.675Z"
                fill="white"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_601_4643"
                    x1={128}
                    y1={0}
                    x2={128}
                    y2={256}
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#EF786F" />
                    <stop
                        offset={1}
                        stopColor="#D8595E"
                    />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_601_4643"
                    x1={78}
                    y1={0.0000037012}
                    x2={236}
                    y2={256}
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9E7AFF" />
                    <stop
                        offset={0.333333}
                        stopColor="#FE8BBB"
                    />
                    <stop
                        offset={0.666667}
                        stopColor="#FFBD7A"
                    />
                    <stop
                        offset={1}
                        stopColor="#F8EAC3"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/MediaWiki.tsx (registry:component) -> components/logos/MediaWiki.tsx
```tsx
import { type SVGProps } from 'react'

export default function MediaWiki(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            id="svg62"
            viewBox="0 0 50 50"
            width="1em"
            height="1em"
            {...props}>
            <defs id="defs11">
                <linearGradient
                    id="gradient"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse">
                    <stop
                        id="stop2"
                        offset="0%"
                        stopColor="#0a00b2"
                    />
                    <stop
                        id="stop4"
                        offset="50%"
                        stopColor="red"
                    />
                    <stop
                        id="stop6"
                        offset="100%"
                        stopColor="#fffc00"
                    />
                </linearGradient>
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient873"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient875"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient877"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient879"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient881"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient883"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient885"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient887"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient889"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient891"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient893"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient895"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient897"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient899"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient901"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient903"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient905"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient907"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient909"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient911"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient913"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient915"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient917"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient919"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient921"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <style id="style9">{'.petal{opacity:.65}'}</style>
            </defs>
            <g
                id="petals"
                fill="url(#linearGradient921)"
                transform="matrix(.5 0 0 .5 0 .026)">
                <path
                    id="path13"
                    fill="url(#linearGradient873)"
                    d="M33.6 14.8a16.938 16.938 0 0 0 3.116 11.142 11.457 11.457 0 0 0 6.858 4.3 3.033 3.033 0 0 0 2.385-.713 11.924 11.924 0 0 0 3.634-10.837c-1.257-7.54-6.19-12.43-12.4-17A32.468 32.468 0 0 0 33.6 14.8z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path15"
                    fill="url(#linearGradient875)"
                    d="M25.117 20.232a16.938 16.938 0 0 0 5.893 9.956 11.457 11.457 0 0 0 7.738 2.381 3.033 3.033 0 0 0 2.119-1.306 11.924 11.924 0 0 0 .705-11.409C38.406 12.9 32.376 9.449 25.2 6.642a32.468 32.468 0 0 0-.083 13.59z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path17"
                    fill="url(#linearGradient877)"
                    d="M18.329 27.677a16.937 16.937 0 0 0 8.271 8.092 11.457 11.457 0 0 0 8.09.3 3.033 3.033 0 0 0 1.709-1.81 11.924 11.924 0 0 0-2.271-11.2c-4.859-5.9-11.576-7.67-19.237-8.523a32.466 32.466 0 0 0 3.438 13.141z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path19"
                    fill="url(#linearGradient879)"
                    d="M13.7 36.626A16.938 16.938 0 0 0 23.781 42.3a11.457 11.457 0 0 0 7.891-1.807 3.033 3.033 0 0 0 1.182-2.193 11.924 11.924 0 0 0-5.093-10.233c-6.221-4.443-13.167-4.412-20.787-3.254A32.468 32.468 0 0 0 13.7 36.626z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path21"
                    fill="url(#linearGradient881)"
                    d="M11.543 46.468a16.938 16.938 0 0 0 11.208 2.873 11.457 11.457 0 0 0 7.155-3.788 3.034 3.034 0 0 0 .575-2.422 11.924 11.924 0 0 0-7.568-8.566c-7.16-2.681-13.861-.854-20.923 2.235a32.468 32.468 0 0 0 9.553 9.668z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path23"
                    fill="url(#linearGradient883)"
                    d="M12.008 56.532a16.938 16.938 0 0 0 11.569-.126 11.457 11.457 0 0 0 5.931-5.51 3.033 3.033 0 0 0-.072-2.488 11.924 11.924 0 0 0-9.527-6.315C12.3 41.356 6.3 44.855.279 49.669a32.467 32.467 0 0 0 11.729 6.863z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path25"
                    fill="url(#linearGradient885)"
                    d="M15.062 66.134A16.938 16.938 0 0 0 26.2 63.018a11.457 11.457 0 0 0 4.3-6.858 3.033 3.033 0 0 0-.713-2.385 11.924 11.924 0 0 0-10.837-3.634c-7.54 1.257-12.43 6.19-17 12.4a32.468 32.468 0 0 0 13.112 3.593z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path27"
                    fill="url(#linearGradient887)"
                    d="M20.5 74.618a16.938 16.938 0 0 0 9.956-5.893 11.457 11.457 0 0 0 2.381-7.738 3.033 3.033 0 0 0-1.306-2.119 11.925 11.925 0 0 0-11.409-.705c-6.958 3.166-10.4 9.2-13.212 16.376a32.466 32.466 0 0 0 13.59.079z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path29"
                    fill="url(#linearGradient889)"
                    d="M27.943 81.406a16.938 16.938 0 0 0 8.092-8.269 11.457 11.457 0 0 0 .3-8.09 3.033 3.033 0 0 0-1.81-1.709 11.924 11.924 0 0 0-11.2 2.271c-5.9 4.859-7.67 11.576-8.523 19.237a32.467 32.467 0 0 0 13.141-3.44z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path31"
                    fill="url(#linearGradient891)"
                    d="M36.891 86.035a16.938 16.938 0 0 0 5.676-10.082 11.457 11.457 0 0 0-1.807-7.891 3.033 3.033 0 0 0-2.191-1.182 11.924 11.924 0 0 0-10.233 5.094c-4.443 6.221-4.412 13.167-3.254 20.787a32.467 32.467 0 0 0 11.809-6.726z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path33"
                    fill="url(#linearGradient893)"
                    d="M46.733 88.191a16.937 16.937 0 0 0 2.873-11.207 11.457 11.457 0 0 0-3.788-7.155 3.033 3.033 0 0 0-2.422-.575 11.924 11.924 0 0 0-8.566 7.568c-2.681 7.159-.854 13.86 2.237 20.921a32.465 32.465 0 0 0 9.666-9.552z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path35"
                    fill="url(#linearGradient895)"
                    d="M56.8 87.726a16.937 16.937 0 0 0-.125-11.569 11.457 11.457 0 0 0-5.511-5.931 3.033 3.033 0 0 0-2.488.072 11.924 11.924 0 0 0-6.315 9.528c-.737 7.609 2.762 13.609 7.576 19.629A32.466 32.466 0 0 0 56.8 87.726z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path37"
                    fill="url(#linearGradient897)"
                    d="M66.4 84.672a16.938 16.938 0 0 0-3.116-11.142 11.457 11.457 0 0 0-6.858-4.3 3.033 3.033 0 0 0-2.385.713 11.924 11.924 0 0 0-3.634 10.837c1.257 7.54 6.19 12.43 12.4 17A32.468 32.468 0 0 0 66.4 84.672z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path39"
                    fill="url(#linearGradient899)"
                    d="M74.883 79.237a16.937 16.937 0 0 0-5.893-9.956 11.456 11.456 0 0 0-7.738-2.381 3.033 3.033 0 0 0-2.119 1.306 11.924 11.924 0 0 0-.705 11.409c3.166 6.958 9.2 10.4 16.375 13.212a32.468 32.468 0 0 0 .08-13.59z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path41"
                    fill="url(#linearGradient901)"
                    d="M81.671 71.792A16.938 16.938 0 0 0 73.4 63.7a11.457 11.457 0 0 0-8.09-.3 3.033 3.033 0 0 0-1.708 1.81 11.924 11.924 0 0 0 2.271 11.2c4.859 5.9 11.576 7.67 19.237 8.523a32.466 32.466 0 0 0-3.439-13.141z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path43"
                    fill="url(#linearGradient903)"
                    d="M86.3 62.843a16.938 16.938 0 0 0-10.082-5.676 11.457 11.457 0 0 0-7.891 1.807 3.033 3.033 0 0 0-1.182 2.191A11.924 11.924 0 0 0 72.239 71.4c6.221 4.443 13.167 4.412 20.787 3.254A32.467 32.467 0 0 0 86.3 62.843z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path45"
                    fill="url(#linearGradient905)"
                    d="M88.457 53a16.938 16.938 0 0 0-11.207-2.873 11.457 11.457 0 0 0-7.155 3.788 3.033 3.033 0 0 0-.574 2.422 11.925 11.925 0 0 0 7.567 8.563c7.158 2.681 13.86.854 20.921-2.237A32.467 32.467 0 0 0 88.457 53z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path47"
                    fill="url(#linearGradient907)"
                    d="M87.992 42.936a16.938 16.938 0 0 0-11.569.126 11.457 11.457 0 0 0-5.931 5.511 3.033 3.033 0 0 0 .072 2.488 11.924 11.924 0 0 0 9.527 6.315c7.609.737 13.609-2.762 19.63-7.576a32.468 32.468 0 0 0-11.729-6.864z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path49"
                    fill="url(#linearGradient909)"
                    d="M84.938 33.335A16.938 16.938 0 0 0 73.8 36.451a11.457 11.457 0 0 0-4.3 6.858 3.033 3.033 0 0 0 .714 2.385 11.924 11.924 0 0 0 10.837 3.634c7.54-1.257 12.43-6.19 17-12.4a32.466 32.466 0 0 0-13.113-3.593z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path51"
                    fill="url(#linearGradient911)"
                    d="M79.5 24.851a16.938 16.938 0 0 0-9.956 5.893 11.457 11.457 0 0 0-2.381 7.738 3.033 3.033 0 0 0 1.309 2.118 11.924 11.924 0 0 0 11.409.705c6.958-3.166 10.4-9.2 13.212-16.375a32.468 32.468 0 0 0-13.593-.079z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path53"
                    fill="url(#linearGradient913)"
                    d="M72.057 18.063a16.938 16.938 0 0 0-8.092 8.269 11.457 11.457 0 0 0-.3 8.09 3.033 3.033 0 0 0 1.81 1.709 11.924 11.924 0 0 0 11.2-2.271c5.9-4.859 7.67-11.576 8.523-19.237a32.467 32.467 0 0 0-13.141 3.44z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path55"
                    fill="url(#linearGradient915)"
                    d="M63.109 13.434a16.937 16.937 0 0 0-5.676 10.082 11.457 11.457 0 0 0 1.807 7.891 3.033 3.033 0 0 0 2.191 1.182A11.924 11.924 0 0 0 71.664 27.5c4.443-6.221 4.412-13.167 3.254-20.787a32.466 32.466 0 0 0-11.809 6.721z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path57"
                    fill="url(#linearGradient917)"
                    d="M53.267 11.278a16.937 16.937 0 0 0-2.873 11.207 11.456 11.456 0 0 0 3.788 7.155 3.033 3.033 0 0 0 2.422.575 11.924 11.924 0 0 0 8.566-7.568c2.681-7.159.854-13.86-2.237-20.921a32.466 32.466 0 0 0-9.666 9.552z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path59"
                    fill="url(#linearGradient919)"
                    d="M43.2 11.743a16.938 16.938 0 0 0 .126 11.569 11.457 11.457 0 0 0 5.511 5.931 3.033 3.033 0 0 0 2.488-.072 11.924 11.924 0 0 0 6.315-9.528c.739-7.609-2.76-13.609-7.574-19.629A32.468 32.468 0 0 0 43.2 11.743z"
                    className="petal"
                    opacity={0.65}
                />
            </g>
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/Replit.tsx (registry:component) -> components/logos/Replit.tsx
```tsx
import { type SVGProps } from 'react'

export default function Replit(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 20 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <path
                d="M0 1.5C0 0.671573 0.671573 0 1.5 0H8.5C9.32843 0 10 0.671573 10 1.5V8H1.5C0.671573 8 0 7.32843 0 6.5V1.5Z"
                fill="#F26207"
            />
            <path
                d="M10 8H18.5C19.3284 8 20 8.67157 20 9.5V14.5C20 15.3284 19.3284 16 18.5 16H10V8Z"
                fill="#F26207"
            />
            <path
                d="M0 17.5C0 16.6716 0.671573 16 1.5 16H10V22.5C10 23.3284 9.32843 24 8.5 24H1.5C0.671573 24 0 23.3284 0 22.5V17.5Z"
                fill="#F26207"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/VSCodium.tsx (registry:component) -> components/logos/VSCodium.tsx
```tsx
import { type SVGProps } from 'react'

export default function VSCodium(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width="1em"
            height="1em"
            {...props}>
            <defs>
                <linearGradient
                    id="a"
                    x1={199.997}
                    x2={296.665}
                    y1={214.302}
                    y2={307.573}
                    gradientTransform="translate(-200 -213)"
                    gradientUnits="userSpaceOnUse">
                    <stop
                        offset={0}
                        stopColor="#62A0EA"
                    />
                    <stop
                        offset={1}
                        stopColor="#1A5FB4"
                    />
                </linearGradient>
            </defs>
            <path
                fill="url(#a)"
                d="M48.26 2.274a6.113 6.113 0 0 0-1.838 8.468c10.109 15.655 12.495 27.463 11.46 37.811-4.184 19.816-13.279 23.836-21.227 23.836-7.76 0-5.682-12.771.151-16.509 3.482-2.174 7.942-3.587 11.365-3.587 3.392 0 6.142-2.741 6.142-6.123 0-3.383-2.75-6.124-6.142-6.124-3.998 0-7.92.84-11.581 2.27.748-3.529 1.024-7.343.057-11.397-1.468-6.156-5.694-12.036-13.032-17.736a6.15 6.15 0 0 0-8.621 1.065 6.114 6.114 0 0 0 1.078 8.595c5.978 4.643 7.952 8.08 8.627 10.909.675 2.829.132 5.864-1.224 10.034-1.733 5.62-3.745 10.637-4.627 15.448-.434 2.368-.471 4.945-.583 7.004-4.305-4.196-5.99-9.736-5.99-17.831-.001-3.382-2.751-6.124-6.142-6.123-3.389.003-6.135 2.743-6.136 6.123 0 11.056 3.233 21.576 11.898 28.594 7.844 7.473 27.791 4.711 27.791 16.708 0 3.386 4.956 5.034 8.347 5.034 3.478 0 7.855-2.325 7.855-5.034 0-13.612 14.345-21.885 37.96-21.849 3.392.005 6.144-2.734 6.149-6.116.006-3.383-2.738-6.13-6.13-6.136a78.226 78.226 0 0 0-4.741.145c2.64-6.209 3.811-13.045 3.569-20.429-.112-3.381-2.95-6.031-6.339-5.921-3.393.11-6.051 2.943-5.94 6.326.32 9.668-.042 18.301-7.245 22.852-2.048 1.293-4.429 2.415-6.687 2.415 1.753-4.768 3.077-9.801 3.619-15.226.346-3.462.383-7.575-.012-10.77-.613-4.95-1.353-10.564.526-14.793 1.688-3.642 5.47-5.167 11.023-5.167 3.389-.003 6.135-2.744 6.136-6.123.002-3.383-2.745-6.127-6.136-6.13-8.252 0-14.507 4.343-18.053 9.59-1.854-3.96-4.112-8.041-6.84-12.265a6.14 6.14 0 0 0-3.86-2.669 6.159 6.159 0 0 0-4.627.831z"
            />
        </svg>
    )
}

```
### ../../packages/core/src/motion-primitives/infinite-slider.tsx (registry:component)
```tsx
'use client'
import { cn } from '@/lib/utils'
import { useMotionValue, animate, motion } from 'motion/react'
import { useState, useEffect } from 'react'
import useMeasure from 'react-use-measure'

export type InfiniteSliderProps = {
    children: React.ReactNode
    gap?: number
    speed?: number
    speedOnHover?: number
    direction?: 'horizontal' | 'vertical'
    reverse?: boolean
    className?: string
}

export function InfiniteSlider({ children, gap = 16, speed = 100, speedOnHover, direction = 'horizontal', reverse = false, className }: InfiniteSliderProps) {
    const [currentSpeed, setCurrentSpeed] = useState(speed)
    const [ref, { width, height }] = useMeasure()
    const translation = useMotionValue(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [key, setKey] = useState(0)

    useEffect(() => {
        let controls
        const size = direction === 'horizontal' ? width : height
        const contentSize = size + gap
        const from = reverse ? -contentSize / 2 : 0
        const to = reverse ? 0 : -contentSize / 2

        const distanceToTravel = Math.abs(to - from)
        const duration = distanceToTravel / currentSpeed

        if (isTransitioning) {
            const remainingDistance = Math.abs(translation.get() - to)
            const transitionDuration = remainingDistance / currentSpeed

            controls = animate(translation, [translation.get(), to], {
                ease: 'linear',
                duration: transitionDuration,
                onComplete: () => {
                    setIsTransitioning(false)
                    setKey((prevKey) => prevKey + 1)
                },
            })
        } else {
            controls = animate(translation, [from, to], {
                ease: 'linear',
                duration: duration,
                repeat: Infinity,
                repeatType: 'loop',
                repeatDelay: 0,
                onRepeat: () => {
                    translation.set(from)
                },
            })
        }

        return controls?.stop
    }, [key, translation, currentSpeed, width, height, gap, isTransitioning, direction, reverse])

    const hoverProps = speedOnHover
        ? {
              onHoverStart: () => {
                  setIsTransitioning(true)
                  setCurrentSpeed(speedOnHover)
              },
              onHoverEnd: () => {
                  setIsTransitioning(true)
                  setCurrentSpeed(speed)
              },
          }
        : {}

    return (
        <div className={cn('overflow-hidden', className)}>
            <motion.div
                className="flex w-max"
                style={{
                    ...(direction === 'horizontal' ? { x: translation } : { y: translation }),
                    gap: `${gap}px`,
                    flexDirection: direction === 'horizontal' ? 'row' : 'column',
                }}
                ref={ref}
                {...hoverProps}>
                {children}
                {children}
            </motion.div>
        </div>
    )
}

```

## Integrations Block 8 (integrations-8)
- Source: https://tailark.com/r/integrations-8.json
- Description: Shadcn/ui website integrations
- Registry dependencies: hover-card, button
### ../../packages/dusk-kit/blocks/integrations/eight/index.tsx (registry:component) -> components/integrations-8.tsx
```tsx
import { Gemini, Replit, GooglePaLM, MagicUI, VSCodium, MediaWiki } from '@/components/logos'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function IntegrationsSection() {
    return (
        <section>
            <div className="bg-muted dark:bg-background py-24 md:py-32">
                <div className="mx-auto flex flex-col px-6 md:grid md:max-w-5xl md:grid-cols-2 md:gap-12">
                    <div className="order-last mt-6 flex flex-col gap-12 md:order-first">
                        <div className="space-y-6">
                            <h2 className="text-balance text-3xl font-semibold md:text-4xl lg:text-5xl">Integrate with your favorite LLMs</h2>
                            <p className="text-muted-foreground">Connect seamlessly with popular platforms and services to enhance your workflow.</p>
                            <Button
                                variant="outline"
                                size="sm"
                                asChild>
                                <Link href="#">Get Started</Link>
                            </Button>
                        </div>

                        <div className="mt-auto grid grid-cols-[auto_1fr] gap-3">
                            <div className="bg-background flex aspect-square items-center justify-center border">
                                <MediaWiki className="size-9" />
                            </div>
                            <blockquote>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
                                <div className="mt-2 flex gap-2 text-sm">
                                    <cite>John Doe</cite>
                                    <p className="text-muted-foreground">Founder, MediaWiki</p>
                                </div>
                            </blockquote>
                        </div>
                    </div>

                    <div className="-mx-6 px-6 [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_70%,transparent_100%)] sm:mx-auto sm:max-w-md md:-mx-6 md:ml-auto md:mr-0">
                        <div className="bg-background dark:bg-muted/50 rounded-2xl border p-3 shadow-lg md:pb-12">
                            <div className="grid grid-cols-2 gap-2">
                                <Integration
                                    icon={<Gemini />}
                                    name="Gemini"
                                    description="The AI model that powers Google's search engine."
                                />
                                <Integration
                                    icon={<Replit />}
                                    name="Replit"
                                    description="The AI model that powers Google's search engine."
                                />
                                <Integration
                                    icon={<GooglePaLM />}
                                    name="GooglePaLM"
                                    description="The AI model that powers Google's search engine."
                                />
                                <Integration
                                    icon={<MagicUI />}
                                    name="MagicUI"
                                    description="The AI model that powers Google's search engine."
                                />
                                <Integration
                                    icon={<VSCodium />}
                                    name="VSCodium"
                                    description="The AI model that powers Google's search engine."
                                />
                                <Integration
                                    icon={<MediaWiki />}
                                    name="MediaWiki"
                                    description="The AI model that powers Google's search engine."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const Integration = ({ icon, name, description }: { icon: React.ReactNode; name: string; description: string }) => {
    return (
        <div className="hover:bg-muted dark:hover:bg-muted/50 space-y-4 rounded-lg border p-4 transition-colors">
            <div className="flex size-fit items-center justify-center">{icon}</div>
            <div className="space-y-1">
                <h3 className="text-sm font-medium">{name}</h3>
                <p className="text-muted-foreground line-clamp-1 text-sm md:line-clamp-2">{description}</p>
            </div>
        </div>
    )
}

```
### ../../packages/core/src/components/logos/index.ts (registry:component) -> components/logos/index.ts
```tsx
export { default as Gemini } from './Gemini'
export { default as Replit } from './Replit'
export { default as MagicUI } from './MagicUI'
export { default as VSCodium } from './VSCodium'
export { default as MediaWiki } from './MediaWiki'
export { default as GooglePaLM } from './GooglePaLM'

```
### ../../packages/core/src/components/logos/Gemini.tsx (registry:component) -> components/logos/Gemini.tsx
```tsx
import { type SVGProps } from 'react'

export default function Gemini(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            height="1em"
            style={{
                flex: 'none',
                lineHeight: 1,
            }}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            {...props}>
            <title>{'Gemini'}</title>
            <defs>
                <linearGradient
                    id="lobe-icons-gemini-fill"
                    x1="0%"
                    x2="68.73%"
                    y1="100%"
                    y2="30.395%">
                    <stop
                        offset="0%"
                        stopColor="#1C7DFF"
                    />
                    <stop
                        offset="52.021%"
                        stopColor="#1C69FF"
                    />
                    <stop
                        offset="100%"
                        stopColor="#F0DCD6"
                    />
                </linearGradient>
            </defs>
            <path
                d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
                fill="url(#lobe-icons-gemini-fill)"
                fillRule="nonzero"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/GooglePaLM.tsx (registry:component) -> components/logos/GooglePaLM.tsx
```tsx
import type { SVGProps } from 'react'

export default function GooglePaLM(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 229"
            {...props}>
            <path
                fill="#F9AB00"
                d="M128 228.542c9.895 0 17.91-8.015 17.91-17.91V55.413h-35.82v155.219c0 9.895 8.015 17.91 17.91 17.91Z"
            />
            <path
                fill="#5BB974"
                d="M199.356 112.053C180.043 92.755 151.193 88.845 128 100.307l76.669 76.67c3.164 3.163 8.612 1.91 9.955-2.344 6.746-21.357 1.657-45.64-15.268-62.58Z"
            />
            <path
                fill="#129EAF"
                d="M56.644 112.053C75.957 92.755 104.807 88.845 128 100.307l-76.669 76.67c-3.164 3.163-8.612 1.91-9.955-2.344-6.746-21.357-1.657-45.64 15.268-62.58Z"
            />
            <path
                fill="#AF5CF7"
                d="M193.67 52.548c-30.507 0-56.402 20-65.67 47.76h121.25c4.97 0 8.283-5.254 6.03-9.687-11.523-22.611-34.776-38.073-61.61-38.073Z"
            />
            <path
                fill="#FF8BCB"
                d="M140.671 20.101C119.09 41.682 114.926 74.114 128 100.307l85.743-85.743c3.523-3.522 2.15-9.582-2.582-11.119-24.148-7.836-51.52-2.313-70.49 16.656Z"
            />
            <path
                fill="#FA7B17"
                d="M115.329 20.101C136.91 41.682 141.074 74.114 128 100.307L42.257 14.564c-3.523-3.522-2.15-9.582 2.582-11.119 24.148-7.836 51.52-2.313 70.49 16.656Z"
            />
            <path
                fill="#4285F4"
                d="M62.33 52.548c30.507 0 56.402 20 65.67 47.76H6.75c-4.97 0-8.283-5.254-6.03-9.687C12.244 68.01 35.497 52.548 62.33 52.548Z"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/MagicUI.tsx (registry:component) -> components/logos/MagicUI.tsx
```tsx
import type { SVGProps } from 'react'

export default function MagicUI(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 256 256"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-6"
            {...props}>
            <rect
                width={256}
                height={256}
                rx={128}
                fill="url(#paint0_linear_601_4643)"
            />
            <rect
                width={256}
                height={256}
                rx={128}
                fill="url(#paint1_linear_601_4643)"
            />
            <path
                d="M124.157 193.675C123.939 193.783 123.722 193.837 123.505 193.837C123.287 193.837 122.852 193.837 122.2 193.837C120.678 193.837 118.884 193.567 116.818 193.025C114.862 192.591 112.905 191.995 110.948 191.236C109.099 190.586 107.469 189.828 106.055 188.961C104.751 188.094 103.935 187.335 103.609 186.685C103.501 185.167 103.446 183.596 103.446 181.97C103.446 180.345 103.446 178.773 103.446 177.256C103.446 165.118 104.316 152.438 106.055 139.217C107.904 125.995 110.893 111.69 115.025 96.3005C115.459 94.7833 115.894 92.8867 116.329 90.6108C116.873 88.2266 117.416 85.6798 117.96 82.9704C115.351 85.0296 112.252 88.335 108.665 92.8867C105.077 97.3301 101.272 102.64 97.2492 108.818C93.3354 114.887 89.3672 121.606 85.3446 128.975C81.4308 136.236 77.8431 143.66 74.5815 151.246C71.32 158.724 68.4933 166.148 66.1015 173.517C63.8185 180.887 62.4051 187.714 61.8615 194C56.6431 192.483 53.001 190.966 50.9354 189.448C48.9785 187.931 48 186.089 48 183.921C48 181.97 48.5979 179.207 49.7938 175.631C50.9897 172.054 52.6749 167.828 54.8492 162.951C57.0236 158.074 59.6872 152.655 62.84 146.695C65.9928 140.626 69.4718 134.123 73.2769 127.187C77.6256 119.276 81.8656 111.852 85.9969 104.916C90.2369 97.9803 94.3682 91.6946 98.3908 86.0591C102.413 80.4236 106.327 75.5468 110.132 71.4286C114.046 67.3104 117.906 64.1675 121.711 62C123.233 62 125.244 62.3793 127.745 63.1379C130.354 63.8966 132.854 64.8177 135.246 65.9015C137.747 66.9852 139.921 68.1232 141.769 69.3153C143.726 70.399 144.813 71.3202 145.031 72.0788C143.509 75.1133 141.715 79.665 139.649 85.734C137.584 91.803 135.464 98.6847 133.289 106.379C131.224 114.074 129.212 122.256 127.255 130.926C125.407 139.488 123.939 147.724 122.852 155.635C125.353 149.675 128.234 143.498 131.495 137.103C134.866 130.601 138.399 124.207 142.095 117.921C145.792 111.527 149.543 105.35 153.348 99.3892C157.262 93.4286 161.067 88.0099 164.763 83.133C168.459 78.1478 171.884 73.8128 175.037 70.1281C178.298 66.4434 181.179 63.734 183.68 62C185.202 62 187.213 62.3793 189.714 63.1379C192.323 63.8966 194.824 64.8177 197.215 65.9015C199.716 66.9852 201.89 68.1232 203.738 69.3153C205.695 70.399 206.783 71.3202 207 72.0788C203.521 78.2562 200.477 85.7882 197.868 94.6749C195.258 103.562 193.03 112.882 191.182 122.635C189.442 132.389 188.083 142.089 187.105 151.734C186.235 161.271 185.8 169.833 185.8 177.419C185.8 179.911 185.8 182.512 185.8 185.222C185.8 187.931 185.909 190.749 186.126 193.675C184.604 193.675 182.756 193.458 180.582 193.025C178.516 192.7 176.45 192.212 174.385 191.562C172.428 190.911 170.634 190.153 169.003 189.286C167.372 188.527 166.231 187.66 165.578 186.685C165.47 185.167 165.415 183.596 165.415 181.97C165.415 180.345 165.415 178.773 165.415 177.256C165.415 165.118 166.285 152.438 168.025 139.217C169.873 125.995 172.863 111.69 176.994 96.3005C177.429 94.7833 177.918 92.7241 178.462 90.1232C179.005 87.5222 179.549 84.8128 180.092 81.9951C177.048 83.5123 173.569 86.4384 169.655 90.7734C165.85 95 161.936 100.202 157.914 106.379C154 112.448 150.086 119.222 146.172 126.7C142.367 134.177 138.888 141.818 135.735 149.621C132.691 157.315 130.082 165.01 127.908 172.704C125.842 180.291 124.592 187.281 124.157 193.675Z"
                fill="white"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_601_4643"
                    x1={128}
                    y1={0}
                    x2={128}
                    y2={256}
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#EF786F" />
                    <stop
                        offset={1}
                        stopColor="#D8595E"
                    />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_601_4643"
                    x1={78}
                    y1={0.0000037012}
                    x2={236}
                    y2={256}
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9E7AFF" />
                    <stop
                        offset={0.333333}
                        stopColor="#FE8BBB"
                    />
                    <stop
                        offset={0.666667}
                        stopColor="#FFBD7A"
                    />
                    <stop
                        offset={1}
                        stopColor="#F8EAC3"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/MediaWiki.tsx (registry:component) -> components/logos/MediaWiki.tsx
```tsx
import { type SVGProps } from 'react'

export default function MediaWiki(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            id="svg62"
            viewBox="0 0 50 50"
            width="1em"
            height="1em"
            {...props}>
            <defs id="defs11">
                <linearGradient
                    id="gradient"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse">
                    <stop
                        id="stop2"
                        offset="0%"
                        stopColor="#0a00b2"
                    />
                    <stop
                        id="stop4"
                        offset="50%"
                        stopColor="red"
                    />
                    <stop
                        id="stop6"
                        offset="100%"
                        stopColor="#fffc00"
                    />
                </linearGradient>
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient873"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient875"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient877"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient879"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient881"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient883"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient885"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient887"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient889"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient891"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient893"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient895"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient897"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient899"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient901"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient903"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient905"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient907"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient909"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient911"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient913"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient915"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient917"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient919"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <linearGradient
                    xlinkHref="#gradient"
                    id="linearGradient921"
                    x1={0}
                    x2={100}
                    y1={100}
                    y2={0}
                    gradientUnits="userSpaceOnUse"
                />
                <style id="style9">{'.petal{opacity:.65}'}</style>
            </defs>
            <g
                id="petals"
                fill="url(#linearGradient921)"
                transform="matrix(.5 0 0 .5 0 .026)">
                <path
                    id="path13"
                    fill="url(#linearGradient873)"
                    d="M33.6 14.8a16.938 16.938 0 0 0 3.116 11.142 11.457 11.457 0 0 0 6.858 4.3 3.033 3.033 0 0 0 2.385-.713 11.924 11.924 0 0 0 3.634-10.837c-1.257-7.54-6.19-12.43-12.4-17A32.468 32.468 0 0 0 33.6 14.8z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path15"
                    fill="url(#linearGradient875)"
                    d="M25.117 20.232a16.938 16.938 0 0 0 5.893 9.956 11.457 11.457 0 0 0 7.738 2.381 3.033 3.033 0 0 0 2.119-1.306 11.924 11.924 0 0 0 .705-11.409C38.406 12.9 32.376 9.449 25.2 6.642a32.468 32.468 0 0 0-.083 13.59z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path17"
                    fill="url(#linearGradient877)"
                    d="M18.329 27.677a16.937 16.937 0 0 0 8.271 8.092 11.457 11.457 0 0 0 8.09.3 3.033 3.033 0 0 0 1.709-1.81 11.924 11.924 0 0 0-2.271-11.2c-4.859-5.9-11.576-7.67-19.237-8.523a32.466 32.466 0 0 0 3.438 13.141z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path19"
                    fill="url(#linearGradient879)"
                    d="M13.7 36.626A16.938 16.938 0 0 0 23.781 42.3a11.457 11.457 0 0 0 7.891-1.807 3.033 3.033 0 0 0 1.182-2.193 11.924 11.924 0 0 0-5.093-10.233c-6.221-4.443-13.167-4.412-20.787-3.254A32.468 32.468 0 0 0 13.7 36.626z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path21"
                    fill="url(#linearGradient881)"
                    d="M11.543 46.468a16.938 16.938 0 0 0 11.208 2.873 11.457 11.457 0 0 0 7.155-3.788 3.034 3.034 0 0 0 .575-2.422 11.924 11.924 0 0 0-7.568-8.566c-7.16-2.681-13.861-.854-20.923 2.235a32.468 32.468 0 0 0 9.553 9.668z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path23"
                    fill="url(#linearGradient883)"
                    d="M12.008 56.532a16.938 16.938 0 0 0 11.569-.126 11.457 11.457 0 0 0 5.931-5.51 3.033 3.033 0 0 0-.072-2.488 11.924 11.924 0 0 0-9.527-6.315C12.3 41.356 6.3 44.855.279 49.669a32.467 32.467 0 0 0 11.729 6.863z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path25"
                    fill="url(#linearGradient885)"
                    d="M15.062 66.134A16.938 16.938 0 0 0 26.2 63.018a11.457 11.457 0 0 0 4.3-6.858 3.033 3.033 0 0 0-.713-2.385 11.924 11.924 0 0 0-10.837-3.634c-7.54 1.257-12.43 6.19-17 12.4a32.468 32.468 0 0 0 13.112 3.593z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path27"
                    fill="url(#linearGradient887)"
                    d="M20.5 74.618a16.938 16.938 0 0 0 9.956-5.893 11.457 11.457 0 0 0 2.381-7.738 3.033 3.033 0 0 0-1.306-2.119 11.925 11.925 0 0 0-11.409-.705c-6.958 3.166-10.4 9.2-13.212 16.376a32.466 32.466 0 0 0 13.59.079z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path29"
                    fill="url(#linearGradient889)"
                    d="M27.943 81.406a16.938 16.938 0 0 0 8.092-8.269 11.457 11.457 0 0 0 .3-8.09 3.033 3.033 0 0 0-1.81-1.709 11.924 11.924 0 0 0-11.2 2.271c-5.9 4.859-7.67 11.576-8.523 19.237a32.467 32.467 0 0 0 13.141-3.44z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path31"
                    fill="url(#linearGradient891)"
                    d="M36.891 86.035a16.938 16.938 0 0 0 5.676-10.082 11.457 11.457 0 0 0-1.807-7.891 3.033 3.033 0 0 0-2.191-1.182 11.924 11.924 0 0 0-10.233 5.094c-4.443 6.221-4.412 13.167-3.254 20.787a32.467 32.467 0 0 0 11.809-6.726z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path33"
                    fill="url(#linearGradient893)"
                    d="M46.733 88.191a16.937 16.937 0 0 0 2.873-11.207 11.457 11.457 0 0 0-3.788-7.155 3.033 3.033 0 0 0-2.422-.575 11.924 11.924 0 0 0-8.566 7.568c-2.681 7.159-.854 13.86 2.237 20.921a32.465 32.465 0 0 0 9.666-9.552z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path35"
                    fill="url(#linearGradient895)"
                    d="M56.8 87.726a16.937 16.937 0 0 0-.125-11.569 11.457 11.457 0 0 0-5.511-5.931 3.033 3.033 0 0 0-2.488.072 11.924 11.924 0 0 0-6.315 9.528c-.737 7.609 2.762 13.609 7.576 19.629A32.466 32.466 0 0 0 56.8 87.726z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path37"
                    fill="url(#linearGradient897)"
                    d="M66.4 84.672a16.938 16.938 0 0 0-3.116-11.142 11.457 11.457 0 0 0-6.858-4.3 3.033 3.033 0 0 0-2.385.713 11.924 11.924 0 0 0-3.634 10.837c1.257 7.54 6.19 12.43 12.4 17A32.468 32.468 0 0 0 66.4 84.672z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path39"
                    fill="url(#linearGradient899)"
                    d="M74.883 79.237a16.937 16.937 0 0 0-5.893-9.956 11.456 11.456 0 0 0-7.738-2.381 3.033 3.033 0 0 0-2.119 1.306 11.924 11.924 0 0 0-.705 11.409c3.166 6.958 9.2 10.4 16.375 13.212a32.468 32.468 0 0 0 .08-13.59z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path41"
                    fill="url(#linearGradient901)"
                    d="M81.671 71.792A16.938 16.938 0 0 0 73.4 63.7a11.457 11.457 0 0 0-8.09-.3 3.033 3.033 0 0 0-1.708 1.81 11.924 11.924 0 0 0 2.271 11.2c4.859 5.9 11.576 7.67 19.237 8.523a32.466 32.466 0 0 0-3.439-13.141z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path43"
                    fill="url(#linearGradient903)"
                    d="M86.3 62.843a16.938 16.938 0 0 0-10.082-5.676 11.457 11.457 0 0 0-7.891 1.807 3.033 3.033 0 0 0-1.182 2.191A11.924 11.924 0 0 0 72.239 71.4c6.221 4.443 13.167 4.412 20.787 3.254A32.467 32.467 0 0 0 86.3 62.843z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path45"
                    fill="url(#linearGradient905)"
                    d="M88.457 53a16.938 16.938 0 0 0-11.207-2.873 11.457 11.457 0 0 0-7.155 3.788 3.033 3.033 0 0 0-.574 2.422 11.925 11.925 0 0 0 7.567 8.563c7.158 2.681 13.86.854 20.921-2.237A32.467 32.467 0 0 0 88.457 53z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path47"
                    fill="url(#linearGradient907)"
                    d="M87.992 42.936a16.938 16.938 0 0 0-11.569.126 11.457 11.457 0 0 0-5.931 5.511 3.033 3.033 0 0 0 .072 2.488 11.924 11.924 0 0 0 9.527 6.315c7.609.737 13.609-2.762 19.63-7.576a32.468 32.468 0 0 0-11.729-6.864z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path49"
                    fill="url(#linearGradient909)"
                    d="M84.938 33.335A16.938 16.938 0 0 0 73.8 36.451a11.457 11.457 0 0 0-4.3 6.858 3.033 3.033 0 0 0 .714 2.385 11.924 11.924 0 0 0 10.837 3.634c7.54-1.257 12.43-6.19 17-12.4a32.466 32.466 0 0 0-13.113-3.593z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path51"
                    fill="url(#linearGradient911)"
                    d="M79.5 24.851a16.938 16.938 0 0 0-9.956 5.893 11.457 11.457 0 0 0-2.381 7.738 3.033 3.033 0 0 0 1.309 2.118 11.924 11.924 0 0 0 11.409.705c6.958-3.166 10.4-9.2 13.212-16.375a32.468 32.468 0 0 0-13.593-.079z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path53"
                    fill="url(#linearGradient913)"
                    d="M72.057 18.063a16.938 16.938 0 0 0-8.092 8.269 11.457 11.457 0 0 0-.3 8.09 3.033 3.033 0 0 0 1.81 1.709 11.924 11.924 0 0 0 11.2-2.271c5.9-4.859 7.67-11.576 8.523-19.237a32.467 32.467 0 0 0-13.141 3.44z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path55"
                    fill="url(#linearGradient915)"
                    d="M63.109 13.434a16.937 16.937 0 0 0-5.676 10.082 11.457 11.457 0 0 0 1.807 7.891 3.033 3.033 0 0 0 2.191 1.182A11.924 11.924 0 0 0 71.664 27.5c4.443-6.221 4.412-13.167 3.254-20.787a32.466 32.466 0 0 0-11.809 6.721z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path57"
                    fill="url(#linearGradient917)"
                    d="M53.267 11.278a16.937 16.937 0 0 0-2.873 11.207 11.456 11.456 0 0 0 3.788 7.155 3.033 3.033 0 0 0 2.422.575 11.924 11.924 0 0 0 8.566-7.568c2.681-7.159.854-13.86-2.237-20.921a32.466 32.466 0 0 0-9.666 9.552z"
                    className="petal"
                    opacity={0.65}
                />
                <path
                    id="path59"
                    fill="url(#linearGradient919)"
                    d="M43.2 11.743a16.938 16.938 0 0 0 .126 11.569 11.457 11.457 0 0 0 5.511 5.931 3.033 3.033 0 0 0 2.488-.072 11.924 11.924 0 0 0 6.315-9.528c.739-7.609-2.76-13.609-7.574-19.629A32.468 32.468 0 0 0 43.2 11.743z"
                    className="petal"
                    opacity={0.65}
                />
            </g>
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/Replit.tsx (registry:component) -> components/logos/Replit.tsx
```tsx
import { type SVGProps } from 'react'

export default function Replit(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 20 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <path
                d="M0 1.5C0 0.671573 0.671573 0 1.5 0H8.5C9.32843 0 10 0.671573 10 1.5V8H1.5C0.671573 8 0 7.32843 0 6.5V1.5Z"
                fill="#F26207"
            />
            <path
                d="M10 8H18.5C19.3284 8 20 8.67157 20 9.5V14.5C20 15.3284 19.3284 16 18.5 16H10V8Z"
                fill="#F26207"
            />
            <path
                d="M0 17.5C0 16.6716 0.671573 16 1.5 16H10V22.5C10 23.3284 9.32843 24 8.5 24H1.5C0.671573 24 0 23.3284 0 22.5V17.5Z"
                fill="#F26207"
            />
        </svg>
    )
}

```
### ../../packages/core/src/components/logos/VSCodium.tsx (registry:component) -> components/logos/VSCodium.tsx
```tsx
import { type SVGProps } from 'react'

export default function VSCodium(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width="1em"
            height="1em"
            {...props}>
            <defs>
                <linearGradient
                    id="a"
                    x1={199.997}
                    x2={296.665}
                    y1={214.302}
                    y2={307.573}
                    gradientTransform="translate(-200 -213)"
                    gradientUnits="userSpaceOnUse">
                    <stop
                        offset={0}
                        stopColor="#62A0EA"
                    />
                    <stop
                        offset={1}
                        stopColor="#1A5FB4"
                    />
                </linearGradient>
            </defs>
            <path
                fill="url(#a)"
                d="M48.26 2.274a6.113 6.113 0 0 0-1.838 8.468c10.109 15.655 12.495 27.463 11.46 37.811-4.184 19.816-13.279 23.836-21.227 23.836-7.76 0-5.682-12.771.151-16.509 3.482-2.174 7.942-3.587 11.365-3.587 3.392 0 6.142-2.741 6.142-6.123 0-3.383-2.75-6.124-6.142-6.124-3.998 0-7.92.84-11.581 2.27.748-3.529 1.024-7.343.057-11.397-1.468-6.156-5.694-12.036-13.032-17.736a6.15 6.15 0 0 0-8.621 1.065 6.114 6.114 0 0 0 1.078 8.595c5.978 4.643 7.952 8.08 8.627 10.909.675 2.829.132 5.864-1.224 10.034-1.733 5.62-3.745 10.637-4.627 15.448-.434 2.368-.471 4.945-.583 7.004-4.305-4.196-5.99-9.736-5.99-17.831-.001-3.382-2.751-6.124-6.142-6.123-3.389.003-6.135 2.743-6.136 6.123 0 11.056 3.233 21.576 11.898 28.594 7.844 7.473 27.791 4.711 27.791 16.708 0 3.386 4.956 5.034 8.347 5.034 3.478 0 7.855-2.325 7.855-5.034 0-13.612 14.345-21.885 37.96-21.849 3.392.005 6.144-2.734 6.149-6.116.006-3.383-2.738-6.13-6.13-6.136a78.226 78.226 0 0 0-4.741.145c2.64-6.209 3.811-13.045 3.569-20.429-.112-3.381-2.95-6.031-6.339-5.921-3.393.11-6.051 2.943-5.94 6.326.32 9.668-.042 18.301-7.245 22.852-2.048 1.293-4.429 2.415-6.687 2.415 1.753-4.768 3.077-9.801 3.619-15.226.346-3.462.383-7.575-.012-10.77-.613-4.95-1.353-10.564.526-14.793 1.688-3.642 5.47-5.167 11.023-5.167 3.389-.003 6.135-2.744 6.136-6.123.002-3.383-2.745-6.127-6.136-6.13-8.252 0-14.507 4.343-18.053 9.59-1.854-3.96-4.112-8.041-6.84-12.265a6.14 6.14 0 0 0-3.86-2.669 6.159 6.159 0 0 0-4.627.831z"
            />
        </svg>
    )
}

```

## Content Block 1 (content-1)
- Source: https://tailark.com/r/content-1.json
- Description: Shadcn/ui website content block
### ../../packages/dusk-kit/blocks/content/one/index.tsx (registry:component) -> components/content-1.tsx
```tsx
import Image from 'next/image'

export default function ContentSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">The Lyra ecosystem brings together our models.</h2>
                <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
                    <div className="relative mb-6 sm:mb-0">
                        <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                            <Image src="/payments.png" className="hidden rounded-[15px] dark:block" alt="payments illustration dark" width={1207} height={929} />
                            <Image src="/payments-light.png" className="rounded-[15px] shadow dark:hidden" alt="payments illustration light" width={1207} height={929} />
                        </div>
                    </div>

                    <div className="relative space-y-4">
                        <p className="text-muted-foreground">
                            Gemini is evolving to be more than just the models. <span className="text-accent-foreground font-bold">It supports an entire ecosystem</span> — from products innovate.
                        </p>
                        <p className="text-muted-foreground">It supports an entire ecosystem — from products to the APIs and platforms helping developers and businesses innovate</p>

                        <div className="pt-6">
                            <blockquote className="border-l-4 pl-4">
                                <p>Using TailsUI has been like unlocking a secret design superpower. It's the perfect fusion of simplicity and versatility, enabling us to create UIs that are as stunning as they are user-friendly.</p>

                                <div className="mt-6 space-y-3">
                                    <cite className="block font-medium">John Doe, CEO</cite>
                                    <img className="h-5 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/nvidia.svg" alt="Nvidia Logo" height="20" width="auto" />
                                </div>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## Content Block 3 (content-3)
- Source: https://tailark.com/r/content-3.json
- Description: Shadcn/ui website content block
### ../../packages/dusk-kit/blocks/content/three/index.tsx (registry:component) -> components/content-3.tsx
```tsx
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function ContentSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
                <img
                    className="rounded-(--radius) grayscale"
                    src="https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=2747&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="team image"
                    height=""
                    width=""
                    loading="lazy"
                />

                <div className="grid gap-6 md:grid-cols-2 md:gap-12">
                    <h2 className="text-4xl font-medium">The Lyra ecosystem brings together our models, products and platforms.</h2>
                    <div className="space-y-6">
                        <p>Lyra is evolving to be more than just the models. It supports an entire ecosystem — from products to the APIs and platforms helping developers and businesses innovate.</p>

                        <Button
                            asChild
                            variant="secondary"
                            size="sm"
                            className="gap-1 pr-1.5">
                            <Link href="#">
                                <span>Learn More</span>
                                <ChevronRight className="size-2" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## Content Block 4 (content-4)
- Source: https://tailark.com/r/content-4.json
- Description: Shadcn/ui website content block
- Registry dependencies: button
### ../../packages/dusk-kit/blocks/content/four/index.tsx (registry:component) -> components/content-4.tsx
```tsx
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function ContentSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-6 md:grid-cols-2 md:gap-12">
                    <h2 className="text-4xl font-medium">The Lyra ecosystem brings together our models, products and platforms.</h2>
                    <div className="space-y-6">
                        <p>Lyra is evolving to be more than just the models. It supports an entire ecosystem — from products to the APIs and platforms helping developers and businesses innovate.</p>
                        <p>
                            Tailark. <span className="font-bold">It supports an entire ecosystem</span> — from products innovate. Sit minus, quod debitis autem quia aspernatur delectus impedit modi, neque non id ad dignissimos? Saepe deleniti perferendis beatae.
                        </p>
                        <Button
                            asChild
                            variant="secondary"
                            size="sm"
                            className="gap-1 pr-1.5">
                            <Link href="#">
                                <span>Learn More</span>
                                <ChevronRight className="size-2" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## Content Block 5 (content-5)
- Source: https://tailark.com/r/content-5.json
- Description: Shadcn/ui website content block
### ../../packages/dusk-kit/blocks/content/five/index.tsx (registry:component) -> components/content-5.tsx
```tsx
import { Cpu, Lock, Sparkles, Zap } from 'lucide-react'

export default function ContentSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
                <div className="mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-balance text-4xl font-medium lg:text-5xl">The Lyra ecosystem brings together our models, products and platforms.</h2>
                    <p>Lyra is evolving to be more than just the models. It supports an entire ecosystem — from products to the APIs and platforms helping developers and businesses innovate.</p>
                </div>
                <img className="rounded-(--radius) grayscale" src="https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="team image" height="" width="" loading="lazy" />

                <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4" />
                            <h3 className="text-sm font-medium">Faaast</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">It supports an entire helping developers and innovate.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4" />
                            <h3 className="text-sm font-medium">Powerful</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">It supports an entire helping developers and businesses.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Lock className="size-4" />
                            <h3 className="text-sm font-medium">Security</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">It supports an helping developers businesses innovate.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4" />

                            <h3 className="text-sm font-medium">AI Powered</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">It supports an helping developers businesses innovate.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## Content Block 6 (content-6)
- Source: https://tailark.com/r/content-6.json
- Description: Shadcn/ui website content block
### ../../packages/dusk-kit/blocks/content/six/index.tsx (registry:component) -> components/content-6.tsx
```tsx
import Link from 'next/link'

export default function CommunitySection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-3xl font-semibold">
                        Built by the Community <br /> for the Community
                    </h2>
                    <p className="mt-6">Harum quae dolore orrupti aut temporibus ariatur.</p>
                </div>
                <div className="mx-auto mt-12 flex max-w-lg flex-wrap justify-center gap-3">
                    <Link href="https://github.com/meschacirung" target="_blank" title="Meschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                        <img alt="John Doe" src="https://randomuser.me/api/portraits/men/1.jpg" loading="lazy" width={120} height={120} />
                    </Link>
                    <Link href="https://github.com/meschacirung" target="_blank" title="Meschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                        <img alt="John Doe" src="https://randomuser.me/api/portraits/men/2.jpg" loading="lazy" width={120} height={120} />
                    </Link>
                    <Link href="https://github.com/meschacirung" target="_blank" title="Meschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                        <img alt="John Doe" src="https://randomuser.me/api/portraits/men/3.jpg" loading="lazy" width={120} height={120} />
                    </Link>
                    <Link href="https://github.com/meschacirung" target="_blank" title="Meschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                        <img alt="John Doe" src="https://randomuser.me/api/portraits/men/4.jpg" loading="lazy" width={120} height={120} />
                    </Link>
                    <Link href="https://github.com/meschacirung" target="_blank" title="Meschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                        <img alt="John Doe" src="https://randomuser.me/api/portraits/men/5.jpg" loading="lazy" width={120} height={120} />
                    </Link>
                    <Link href="https://github.com/meschacirung" target="_blank" title="Meschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                        <img alt="John Doe" src="https://randomuser.me/api/portraits/men/6.jpg" loading="lazy" width={120} height={120} />
                    </Link>
                    <Link href="https://github.com/meschacirung" target="_blank" title="Meschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                        <img alt="John Doe" src="https://randomuser.me/api/portraits/men/7.jpg" loading="lazy" width={120} height={120} />
                    </Link>
                    <Link href="https://github.com/meschacirung" target="_blank" title="Meschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                        <img alt="John Doe" src="https://randomuser.me/api/portraits/men/1.jpg" loading="lazy" width={120} height={120} />
                    </Link>
                    <Link href="https://github.com/meschacirung" target="_blank" title="Meschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                        <img alt="John Doe" src="https://randomuser.me/api/portraits/men/8.jpg" loading="lazy" width={120} height={120} />
                    </Link>
                    <Link href="https://github.com/meschacirung" target="_blank" title="Meschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                        <img alt="John Doe" src="https://randomuser.me/api/portraits/men/9.jpg" loading="lazy" width={120} height={120} />
                    </Link>
                    <Link href="https://github.com/meschacirung" target="_blank" title="Meschac Irung" className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover">
                        <img alt="John Doe" src="https://randomuser.me/api/portraits/men/10.jpg" loading="lazy" width={120} height={120} />
                    </Link>
                </div>
            </div>
        </section>
    )
}

```

## Stats Block 4 (stats-4)
- Source: https://tailark.com/r/stats-4.json
- Description: Shadcn/ui website stats block
### ../../packages/dusk-kit/blocks/stats/four/index.tsx (registry:component) -> components/stats-4.tsx
```tsx
export default function StatsSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
                <div className="relative z-10 max-w-xl space-y-6">
                    <h2 className="text-4xl font-medium lg:text-5xl">The Gemini ecosystem brings together our models.</h2>
                    <p>
                        Gemini is evolving to be more than just the models. <span className="font-medium">It supports an entire ecosystem</span> — from products innovate.
                    </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
                    <div>
                        <p>It supports an entire ecosystem — from products to the APIs and platforms helping developers and businesses innovate</p>
                        <div className="mb-12 mt-12 grid grid-cols-2 gap-2 md:mb-0">
                            <div className="space-y-4">
                                <div className="bg-linear-to-r from-zinc-950 to-zinc-600 bg-clip-text text-5xl font-bold text-transparent dark:from-white dark:to-zinc-800">+1200</div>
                                <p>Stars on GitHub</p>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-linear-to-r from-zinc-950 to-zinc-600 bg-clip-text text-5xl font-bold text-transparent dark:from-white dark:to-zinc-800">+500</div>
                                <p>Powered Apps</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <blockquote className="border-l-4 pl-4">
                            <p>Using TailsUI has been like unlocking a secret design superpower. It's the perfect fusion of simplicity and versatility, enabling us to create UIs that are as stunning as they are user-friendly.</p>

                            <div className="mt-6 space-y-3">
                                <cite className="block font-medium">John Doe, CEO</cite>
                                <img className="h-5 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/nvidia.svg" alt="Nvidia Logo" height="20" width="auto" />
                            </div>
                        </blockquote>
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## Stats Block 1 (stats-1)
- Source: https://tailark.com/r/stats-1.json
- Description: Shadcn/ui website stats block
### ../../packages/dusk-kit/blocks/stats/one/index.tsx (registry:component) -> components/stats.tsx
```tsx
export default function StatsSection() {
    return (
        <section className="py-12 md:py-20">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
                    <h2 className="text-4xl font-medium lg:text-5xl">Tailark in numbers</h2>
                    <p>Gemini is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</p>
                </div>

                <div className="grid gap-12 divide-y *:text-center md:grid-cols-3 md:gap-2 md:divide-x md:divide-y-0">
                    <div className="space-y-4">
                        <div className="text-5xl font-bold">+1200</div>
                        <p>Stars on GitHub</p>
                    </div>
                    <div className="space-y-4">
                        <div className="text-5xl font-bold">22 Million</div>
                        <p>Active Users</p>
                    </div>
                    <div className="space-y-4">
                        <div className="text-5xl font-bold">+500</div>
                        <p>Powered Apps</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## Team Section 2 (team-2)
- Source: https://tailark.com/r/team-2.json
- Description: Shadcn/ui website team section
### ../../packages/dusk-kit/blocks/team/two/index.tsx (registry:component) -> components/team.tsx
```tsx
import Link from 'next/link'

const members = [
    {
        name: 'Liam Brown',
        role: 'Founder - CEO',
        avatar: 'https://alt.tailus.io/images/team/member-one.webp',
        link: '#',
    },
    {
        name: 'Elijah Jones',
        role: 'Co-Founder - CTO',
        avatar: 'https://alt.tailus.io/images/team/member-two.webp',
        link: '#',
    },
    {
        name: 'Isabella Garcia',
        role: 'Sales Manager',
        avatar: 'https://alt.tailus.io/images/team/member-three.webp',
        link: '#',
    },
    {
        name: 'Henry Lee',
        role: 'UX Engeneer',
        avatar: 'https://alt.tailus.io/images/team/member-four.webp',
        link: '#',
    },
    {
        name: 'Ava Williams',
        role: 'Interaction Designer',
        avatar: 'https://alt.tailus.io/images/team/member-five.webp',
        link: '#',
    },
    {
        name: 'Olivia Miller',
        role: 'Visual Designer',
        avatar: 'https://alt.tailus.io/images/team/member-six.webp',
        link: '#',
    },
]

export default function TeamSection() {
    return (
        <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
            <div className="mx-auto max-w-5xl border-t px-6">
                <span className="text-caption -ml-6 -mt-3.5 block w-max bg-gray-50 px-6 dark:bg-gray-950">Team</span>
                <div className="mt-12 gap-4 sm:grid sm:grid-cols-2 md:mt-24">
                    <div className="sm:w-2/5">
                        <h2 className="text-3xl font-bold sm:text-4xl">Our dream team</h2>
                    </div>
                    <div className="mt-6 sm:mt-0">
                        <p>During the working process, we perform regular fitting with the client because he is the only person who can feel whether a new suit fits or not.</p>
                    </div>
                </div>
                <div className="mt-12 md:mt-24">
                    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                        {members.map((member, index) => (
                            <div
                                key={index}
                                className="group overflow-hidden">
                                <img
                                    className="h-96 w-full rounded-md object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl"
                                    src={member.avatar}
                                    alt="team member"
                                    width="826"
                                    height="1239"
                                />
                                <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                                    <div className="flex justify-between">
                                        <h3 className="text-base font-medium transition-all duration-500 group-hover:tracking-wider">{member.name}</h3>
                                        <span className="text-xs">_0{index + 1}</span>
                                    </div>
                                    <div className="mt-1 flex items-center justify-between">
                                        <span className="text-muted-foreground inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">{member.role}</span>
                                        <Link
                                            href={member.link}
                                            className="group-hover:text-primary-600 dark:group-hover:text-primary-400 inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 hover:underline group-hover:translate-y-0 group-hover:opacity-100">
                                            {' '}
                                            Linktree
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## Testimonials Section 1 (testimonials-1)
- Source: https://tailark.com/r/testimonials-1.json
- Description: Shadcn/ui website testimonials section
- Registry dependencies: card, avatar
### ../../packages/dusk-kit/blocks/testimonials/one/index.tsx (registry:component) -> components/testimonials.tsx
```tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Testimonials() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-4xl font-medium lg:text-5xl">Build by makers, loved by thousand developers</h2>
                    <p>Gemini is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">
                    <Card className="grid grid-rows-[auto_1fr] gap-8 sm:col-span-2 sm:p-6 lg:row-span-2">
                        <CardHeader>
                            <img
                                className="h-6 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/nike.svg"
                                alt="Nike Logo"
                                height="24"
                                width="auto"
                            />
                        </CardHeader>
                        <CardContent>
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p className="text-xl font-medium">Tailus has transformed the way I develop web applications. Their extensive collection of UI components, blocks, and templates has significantly accelerated my workflow. The flexibility to customize every aspect allows me to create unique user experiences. Tailus is a game-changer for modern web development</p>

                                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://tailus.io/images/reviews/shekinah.webp"
                                            alt="Shekinah Tshiokufila"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>ST</AvatarFallback>
                                    </Avatar>

                                    <div>
                                        <cite className="text-sm font-medium">Shekinah Tshiokufila</cite>
                                        <span className="text-muted-foreground block text-sm">Software Ingineer</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-2">
                        <CardContent className="h-full pt-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p className="text-xl font-medium">Tailus is really extraordinary and very practical, no need to break your head. A real gold mine.</p>

                                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://tailus.io/images/reviews/jonathan.webp"
                                            alt="Jonathan Yombo"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>JY</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <cite className="text-sm font-medium">Jonathan Yombo</cite>
                                        <span className="text-muted-foreground block text-sm">Software Ingineer</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="h-full pt-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p>Great work on tailfolio template. This is one of the best personal website that I have seen so far!</p>

                                <div className="grid items-center gap-3 [grid-template-columns:auto_1fr]">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://tailus.io/images/reviews/yucel.webp"
                                            alt="Yucel Faruksahan"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>YF</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <cite className="text-sm font-medium">Yucel Faruksahan</cite>
                                        <span className="text-muted-foreground block text-sm">Creator, Tailkits</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>
                    <Card className="card variant-mixed">
                        <CardContent className="h-full pt-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p>Great work on tailfolio template. This is one of the best personal website that I have seen so far!</p>

                                <div className="grid grid-cols-[auto_1fr] gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://tailus.io/images/reviews/rodrigo.webp"
                                            alt="Rodrigo Aguilar"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>YF</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">Rodrigo Aguilar</p>
                                        <span className="text-muted-foreground block text-sm">Creator, TailwindAwesome</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

```

## Testimonials Section 2 (testimonials-2)
- Source: https://tailark.com/r/testimonials-2.json
- Description: Shadcn/ui website testimonials section
- Registry dependencies: card, avatar
### ../../packages/dusk-kit/blocks/testimonials/two/index.tsx (registry:component) -> components/testimonials.tsx
```tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Testimonials() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-4xl font-medium lg:text-5xl">Build by makers, loved by thousand developers</h2>
                    <p>Gemini is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</p>
                </div>

                <div className="grid gap-4 [--color-card:var(--color-muted)] *:border-none *:shadow-none sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2 dark:[--color-muted:var(--color-zinc-900)]">
                    <Card className="grid grid-rows-[auto_1fr] gap-8 sm:col-span-2 sm:p-6 lg:row-span-2">
                        <CardHeader>
                            <img
                                className="h-6 w-fit dark:invert"
                                src="https://html.tailus.io/blocks/customers/nike.svg"
                                alt="Nike Logo"
                                height="24"
                                width="auto"
                            />
                        </CardHeader>
                        <CardContent>
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p className="text-xl font-medium">Tailus has transformed the way I develop web applications. Their extensive collection of UI components, blocks, and templates has significantly accelerated my workflow. The flexibility to customize every aspect allows me to create unique user experiences. Tailus is a game-changer for modern web development</p>

                                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://tailus.io/images/reviews/shekinah.webp"
                                            alt="Shekinah Tshiokufila"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>ST</AvatarFallback>
                                    </Avatar>

                                    <div>
                                        <cite className="text-sm font-medium">Shekinah Tshiokufila</cite>
                                        <span className="text-muted-foreground block text-sm">Software Ingineer</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-2">
                        <CardContent className="h-full pt-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p className="text-xl font-medium">Tailus is really extraordinary and very practical, no need to break your head. A real gold mine.</p>

                                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://tailus.io/images/reviews/jonathan.webp"
                                            alt="Jonathan Yombo"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>JY</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <cite className="text-sm font-medium">Jonathan Yombo</cite>
                                        <span className="text-muted-foreground block text-sm">Software Ingineer</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="h-full pt-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p>Great work on tailfolio template. This is one of the best personal website that I have seen so far!</p>

                                <div className="grid items-center gap-3 [grid-template-columns:auto_1fr]">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://tailus.io/images/reviews/yucel.webp"
                                            alt="Yucel Faruksahan"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>YF</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <cite className="text-sm font-medium">Yucel Faruksahan</cite>
                                        <span className="text-muted-foreground block text-sm">Creator, Tailkits</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>
                    <Card className="card variant-mixed">
                        <CardContent className="h-full pt-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p>Great work on tailfolio template. This is one of the best personal website that I have seen so far!</p>

                                <div className="grid grid-cols-[auto_1fr] gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://tailus.io/images/reviews/rodrigo.webp"
                                            alt="Rodrigo Aguilar"
                                            height="400"
                                            width="400"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>YF</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">Rodrigo Aguilar</p>
                                        <span className="text-muted-foreground block text-sm">Creator, TailwindAwesome</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

```

## Testimonials Section 3 (testimonials-3)
- Source: https://tailark.com/r/testimonials-3.json
- Description: Shadcn/ui website testimonials section
### ../../packages/dusk-kit/blocks/testimonials/three/index.tsx (registry:component) -> components/testimonials.tsx
```tsx
export default function TestimonialsSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl">
                    <blockquote>
                        <p className="text-lg font-semibold sm:text-xl md:text-3xl">Using TailsUI has been like unlocking a secret design superpower. It's the perfect fusion of simplicity and versatility, enabling us to create UIs that are as stunning as they are user-friendly.</p>

                        <div className="mt-12 flex items-center gap-6">
                            <img className="h-7 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/nvidia.svg" alt="Nvidia Logo" height="20" width="auto" />
                            <div className="space-y-1 border-l pl-6">
                                <cite className="font-medium">John Doe</cite>
                                <span className="text-muted-foreground block text-sm">CEO, Nvidia</span>
                            </div>
                        </div>
                    </blockquote>
                </div>
            </div>
        </section>
    )
}

```

## Testimonials Section 4 (testimonials-4)
- Source: https://tailark.com/r/testimonials-4.json
- Description: Shadcn/ui website testimonials section
- Registry dependencies: avatar
### ../../packages/dusk-kit/blocks/testimonials/four/index.tsx (registry:component) -> components/testimonials.tsx
```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function TestimonialsSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <blockquote>
                        <p className="text-lg font-medium sm:text-xl md:text-3xl">Using TailsUI has been like unlocking a secret design superpower. It's the perfect fusion of simplicity and versatility, enabling us to create UIs that are as stunning as they are user-friendly.</p>

                        <div className="mt-12 flex items-center justify-center gap-6">
                            <Avatar className="size-12">
                                <AvatarImage
                                    src="https://tailus.io/images/reviews/shekinah.webp"
                                    alt="Shekinah Tshiokufila"
                                    height="400"
                                    width="400"
                                    loading="lazy"
                                />
                                <AvatarFallback>ST</AvatarFallback>
                            </Avatar>

                            <div className="space-y-1 border-l pl-6">
                                <cite className="font-medium">John Doe</cite>
                                <span className="text-muted-foreground block text-sm">CEO, Nvidia</span>
                            </div>
                        </div>
                    </blockquote>
                </div>
            </div>
        </section>
    )
}

```

## Testimonials Section 5 (testimonials-5)
- Source: https://tailark.com/r/testimonials-5.json
- Description: Shadcn/ui website testimonials section
- Registry dependencies: avatar, card
### ../../packages/dusk-kit/blocks/testimonials/five/index.tsx (registry:component) -> components/testimonials.tsx
```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

type Testimonial = {
    name: string
    role: string
    image: string
    quote: string
}

const testimonials: Testimonial[] = [
    {
        name: 'Jonathan Yombo',
        role: 'Software Engineer',
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
        quote: 'Tailus is really extraordinary and very practical, no need to break your head. A real gold mine.',
    },
    {
        name: 'Yves Kalume',
        role: 'GDE - Android',
        image: 'https://randomuser.me/api/portraits/men/6.jpg',
        quote: 'With no experience in webdesign I just redesigned my entire website in a few minutes with tailwindcss thanks to Tailus.',
    },
    {
        name: 'Yucel Faruksahan',
        role: 'Tailkits Creator',
        image: 'https://randomuser.me/api/portraits/men/7.jpg',
        quote: 'Great work on tailfolio template. This is one of the best personal website that I have seen so far :)',
    },
    {
        name: 'Anonymous author',
        role: 'Doing something',
        image: 'https://randomuser.me/api/portraits/men/8.jpg',
        quote: 'I am really new to Tailwind and I want to give a go to make some page on my own. I searched a lot of hero pages and blocks online. However, most of them are not giving me a clear view or needed some HTML/CSS coding background to make some changes from the original or too expensive to have. I downloaded the one of Tailus template which is very clear to understand at the start and you could modify the codes/blocks to fit perfectly on your purpose of the page.',
    },
    {
        name: 'Shekinah Tshiokufila',
        role: 'Senior Software Engineer',
        image: 'https://randomuser.me/api/portraits/men/4.jpg',
        quote: 'Tailus is redefining the standard of web design, with these blocks it provides an easy and efficient way for those who love beauty but may lack the time to implement it. I can only recommend this incredible wonder.',
    },
    {
        name: 'Oketa Fred',
        role: 'Fullstack Developer',
        image: 'https://randomuser.me/api/portraits/men/2.jpg',
        quote: 'I absolutely love Tailus! The component blocks are beautifully designed and easy to use, which makes creating a great-looking website a breeze.',
    },
    {
        name: 'Zeki',
        role: 'Founder of ChatExtend',
        image: 'https://randomuser.me/api/portraits/men/5.jpg',
        quote: "Using TailsUI has been like unlocking a secret design superpower. It's the perfect fusion of simplicity and versatility, enabling us to create UIs that are as stunning as they are user-friendly.",
    },
    {
        name: 'Joseph Kitheka',
        role: 'Fullstack Developer',
        image: 'https://randomuser.me/api/portraits/men/9.jpg',
        quote: 'Tailus has transformed the way I develop web applications. Their extensive collection of UI components, blocks, and templates has significantly accelerated my workflow. The flexibility to customize every aspect allows me to create unique user experiences. Tailus is a game-changer for modern web development!',
    },
    {
        name: 'Khatab Wedaa',
        role: 'MerakiUI Creator',
        image: 'https://randomuser.me/api/portraits/men/10.jpg',
        quote: "Tailus is an elegant, clean, and responsive tailwind css components it's very helpful to start fast with your project.",
    },
    {
        name: 'Rodrigo Aguilar',
        role: 'TailwindAwesome Creator',
        image: 'https://randomuser.me/api/portraits/men/11.jpg',
        quote: 'I love Tailus ??. The component blocks are well-structured, simple to use, and beautifully designed. It makes it really easy to have a good-looking website in no time.',
    },
    {
        name: 'Eric Ampire',
        role: 'Mobile Engineer at @BRPNews • @GoogleDevExpert for Android',
        image: 'https://randomuser.me/api/portraits/men/12.jpg',
        quote: 'Tailus templates are the perfect solution for anyone who wants to create a beautiful and functional website without any web design experience. The templates are easy to use, customizable, and responsive, and the support team is always available to help. I highly recommend Tailus templates to anyone who is looking to create a website.',
    },
    {
        name: 'Roland Tubonge',
        role: 'Software Engineer',
        image: 'https://randomuser.me/api/portraits/men/13.jpg',
        quote: 'Tailus is so well designed that even with a very poor knowledge of web design you can do miracles. Let yourself be seduced!',
    },
]

const chunkArray = (array: Testimonial[], chunkSize: number): Testimonial[][] => {
    const result: Testimonial[][] = []
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize))
    }
    return result
}

const testimonialChunks = chunkArray(testimonials, Math.ceil(testimonials.length / 3))

export default function WallOfLoveSection() {
    return (
        <section>
            <div className="py-16 md:py-32">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="text-center">
                        <h2 className="text-3xl font-semibold">Loved by the Community</h2>
                        <p className="mt-6">Harum quae dolore orrupti aut temporibus ariatur.</p>
                    </div>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
                        {testimonialChunks.map((chunk, chunkIndex) => (
                            <div
                                key={chunkIndex}
                                className="space-y-3">
                                {chunk.map(({ name, role, quote, image }, index) => (
                                    <Card key={index}>
                                        <CardContent className="grid grid-cols-[auto_1fr] gap-3 pt-6">
                                            <Avatar className="size-9">
                                                <AvatarImage
                                                    alt={name}
                                                    src={image}
                                                    loading="lazy"
                                                    width="120"
                                                    height="120"
                                                />
                                                <AvatarFallback>ST</AvatarFallback>
                                            </Avatar>

                                            <div>
                                                <h3 className="font-medium">{name}</h3>

                                                <span className="text-muted-foreground block text-sm tracking-wide">{role}</span>

                                                <blockquote className="mt-3">
                                                    <p className="text-gray-700 dark:text-gray-300">{quote}</p>
                                                </blockquote>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## Footer Block 2 (footer-2)
- Source: https://tailark.com/r/footer-2.json
- Description: Shadcn/ui website footer block
### ../../packages/dusk-kit/blocks/footer/two/index.tsx (registry:component) -> components/footer.tsx
```tsx
import { Logo } from '@/components/logo'
import Link from 'next/link'

const links = [
    {
        group: 'Product',
        items: [
            {
                title: 'Features',
                href: '#',
            },
            {
                title: 'Solution',
                href: '#',
            },
            {
                title: 'Customers',
                href: '#',
            },
            {
                title: 'Pricing',
                href: '#',
            },
            {
                title: 'Help',
                href: '#',
            },
            {
                title: 'About',
                href: '#',
            },
        ],
    },
    {
        group: 'Solution',
        items: [
            {
                title: 'Startup',
                href: '#',
            },
            {
                title: 'Freelancers',
                href: '#',
            },
            {
                title: 'Organizations',
                href: '#',
            },
            {
                title: 'Students',
                href: '#',
            },
            {
                title: 'Collaboration',
                href: '#',
            },
            {
                title: 'Design',
                href: '#',
            },
            {
                title: 'Management',
                href: '#',
            },
        ],
    },
    {
        group: 'Company',
        items: [
            {
                title: 'About',
                href: '#',
            },
            {
                title: 'Careers',
                href: '#',
            },
            {
                title: 'Blog',
                href: '#',
            },
            {
                title: 'Press',
                href: '#',
            },
            {
                title: 'Contact',
                href: '#',
            },
            {
                title: 'Help',
                href: '#',
            },
        ],
    },
    {
        group: 'Legal',
        items: [
            {
                title: 'Licence',
                href: '#',
            },
            {
                title: 'Privacy',
                href: '#',
            },
            {
                title: 'Cookies',
                href: '#',
            },
            {
                title: 'Security',
                href: '#',
            },
        ],
    },
]

export default function FooterSection() {
    return (
        <footer className="border-b bg-white pt-20 dark:bg-transparent">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-12 md:grid-cols-5">
                    <div className="md:col-span-2">
                        <Link
                            href="/"
                            aria-label="go home"
                            className="block size-fit">
                            <Logo />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:col-span-3">
                        {links.map((link, index) => (
                            <div
                                key={index}
                                className="space-y-4 text-sm">
                                <span className="block font-medium">{link.group}</span>
                                {link.items.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className="text-muted-foreground hover:text-primary block duration-150">
                                        <span>{item.title}</span>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t py-6">
                    <span className="text-muted-foreground order-last block text-center text-sm md:order-first">© {new Date().getFullYear()} Tailark, All rights reserved</span>
                    <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
                        <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="X/Twitter"
                            className="text-muted-foreground hover:text-primary block">
                            <svg
                                className="size-6"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"></path>
                            </svg>
                        </Link>
                        <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="text-muted-foreground hover:text-primary block">
                            <svg
                                className="size-6"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"></path>
                            </svg>
                        </Link>
                        <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="text-muted-foreground hover:text-primary block">
                            <svg
                                className="size-6"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"></path>
                            </svg>
                        </Link>
                        <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Threads"
                            className="text-muted-foreground hover:text-primary block">
                            <svg
                                className="size-6"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24">
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M19.25 8.505c-1.577-5.867-7-5.5-7-5.5s-7.5-.5-7.5 8.995s7.5 8.996 7.5 8.996s4.458.296 6.5-3.918c.667-1.858.5-5.573-6-5.573c0 0-3 0-3 2.5c0 .976 1 2 2.5 2s3.171-1.027 3.5-3c1-6-4.5-6.5-6-4"
                                    color="currentColor"></path>
                            </svg>
                        </Link>
                        <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="text-muted-foreground hover:text-primary block">
                            <svg
                                className="size-6"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"></path>
                            </svg>
                        </Link>
                        <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="TikTok"
                            className="text-muted-foreground hover:text-primary block">
                            <svg
                                className="size-6"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48"></path>
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

```
### ../../packages/core/src/components/logo.tsx (registry:component)
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}

```

## Footer Block 3 (footer-3)
- Source: https://tailark.com/r/footer-3.json
- Description: Shadcn/ui website footer block
- Registry dependencies: button, input, label
### ../../packages/dusk-kit/blocks/footer/three/index.tsx (registry:component) -> components/footer.tsx
```tsx
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { ChevronsUpDown } from 'lucide-react'
import Link from 'next/link'

const links = [
    {
        group: 'Product',
        items: [
            {
                title: 'Features',
                href: '#',
            },
            {
                title: 'Solution',
                href: '#',
            },
            {
                title: 'Customers',
                href: '#',
            },
            {
                title: 'Pricing',
                href: '#',
            },
            {
                title: 'Help',
                href: '#',
            },
            {
                title: 'About',
                href: '#',
            },
        ],
    },
    {
        group: 'Solution',
        items: [
            {
                title: 'Startup',
                href: '#',
            },
            {
                title: 'Freelancers',
                href: '#',
            },
            {
                title: 'Organizations',
                href: '#',
            },
            {
                title: 'Students',
                href: '#',
            },
            {
                title: 'Collaboration',
                href: '#',
            },
            {
                title: 'Design',
                href: '#',
            },
            {
                title: 'Management',
                href: '#',
            },
        ],
    },
    {
        group: 'Company',
        items: [
            {
                title: 'About',
                href: '#',
            },
            {
                title: 'Careers',
                href: '#',
            },
            {
                title: 'Blog',
                href: '#',
            },
            {
                title: 'Press',
                href: '#',
            },
            {
                title: 'Contact',
                href: '#',
            },
            {
                title: 'Help',
                href: '#',
            },
        ],
    },
    {
        group: 'Legal',
        items: [
            {
                title: 'Licence',
                href: '#',
            },
            {
                title: 'Privacy',
                href: '#',
            },
            {
                title: 'Cookies',
                href: '#',
            },
            {
                title: 'Security',
                href: '#',
            },
        ],
    },
]

export default function FooterSection() {
    return (
        <footer className="border-b bg-white pt-20 dark:bg-transparent">
            <div className="mb-8 border-b md:mb-12">
                <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-6 px-6 pb-6">
                    <Link
                        href="/"
                        aria-label="go home"
                        className="block size-fit">
                        <Logo />
                    </Link>
                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                        <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="X/Twitter"
                            className="text-muted-foreground hover:text-primary block">
                            <svg
                                className="size-6"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"></path>
                            </svg>
                        </Link>
                        <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="text-muted-foreground hover:text-primary block">
                            <svg
                                className="size-6"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"></path>
                            </svg>
                        </Link>
                        <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="text-muted-foreground hover:text-primary block">
                            <svg
                                className="size-6"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"></path>
                            </svg>
                        </Link>
                        <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Threads"
                            className="text-muted-foreground hover:text-primary block">
                            <svg
                                className="size-6"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24">
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M19.25 8.505c-1.577-5.867-7-5.5-7-5.5s-7.5-.5-7.5 8.995s7.5 8.996 7.5 8.996s4.458.296 6.5-3.918c.667-1.858.5-5.573-6-5.573c0 0-3 0-3 2.5c0 .976 1 2 2.5 2s3.171-1.027 3.5-3c1-6-4.5-6.5-6-4"
                                    color="currentColor"></path>
                            </svg>
                        </Link>
                        <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="text-muted-foreground hover:text-primary block">
                            <svg
                                className="size-6"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"></path>
                            </svg>
                        </Link>
                        <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="TikTok"
                            className="text-muted-foreground hover:text-primary block">
                            <svg
                                className="size-6"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48"></path>
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-12 md:grid-cols-5 md:gap-0 lg:grid-cols-4">
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:col-span-5 md:row-start-1 lg:col-span-3">
                        {links.map((link, index) => (
                            <div
                                key={index}
                                className="space-y-4 text-sm">
                                <span className="block font-medium">{link.group}</span>
                                {link.items.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className="text-muted-foreground hover:text-primary block duration-150">
                                        <span>{item.title}</span>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                    <form className="row-start-1 border-b pb-8 text-sm md:col-span-2 md:border-none lg:col-span-1">
                        <div className="space-y-4">
                            <Label
                                htmlFor="mail"
                                className="block font-medium">
                                Newsletter
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    id="mail"
                                    name="mail"
                                    placeholder="Your email"
                                    className="h-8 text-sm"
                                />
                                <Button size="sm">Submit</Button>
                            </div>
                            <span className="text-muted-foreground block text-sm">Don't miss any update!</span>
                        </div>
                    </form>
                </div>
                <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t py-6">
                    <small className="text-muted-foreground order-last block text-center text-sm md:order-first">© {new Date().getFullYear()} Tailark, All rights reserved</small>
                    <form action="">
                        <div className="relative">
                            <ChevronsUpDown
                                className="pointer-events-none absolute inset-y-0 right-2 my-auto opacity-75"
                                size="0.75rem"
                            />
                            <select
                                className={cn(
                                    'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground shadow-xs flex h-9 w-full min-w-32 appearance-none rounded-md border bg-transparent px-3 py-1 text-base outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                                    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
                                )}
                                name="language">
                                <option value="1">English</option>
                                <option value="2">Espanol</option>
                                <option value="3">Francais</option>
                                <option value="4">Swahili</option>
                                <option value="5">Lingala</option>
                            </select>
                        </div>
                    </form>
                </div>
            </div>
        </footer>
    )
}

```
### ../../packages/core/src/components/logo.tsx (registry:component)
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}

```

## Footer Block 4 (footer-4)
- Source: https://tailark.com/r/footer-4.json
- Description: Shadcn/ui website footer block
### ../../packages/dusk-kit/blocks/footer/four/index.tsx (registry:component) -> components/footer.tsx
```tsx
import Link from 'next/link'

const links = [
    {
        title: 'Features',
        href: '#',
    },
    {
        title: 'Solution',
        href: '#',
    },
    {
        title: 'Customers',
        href: '#',
    },
    {
        title: 'Pricing',
        href: '#',
    },
    {
        title: 'Help',
        href: '#',
    },
    {
        title: 'About',
        href: '#',
    },
]

export default function FooterSection() {
    return (
        <footer className="border-b bg-white py-12 dark:bg-transparent">
            <div className="mx-auto max-w-5xl px-6">
                <div className="flex flex-wrap justify-between gap-6">
                    <span className="text-muted-foreground order-last block text-center text-sm md:order-first">© {new Date().getFullYear()} Tailark, All rights reserved</span>
                    <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className="text-muted-foreground hover:text-primary block duration-150">
                                <span>{link.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

```
### ../../packages/core/src/components/logo.tsx (registry:component)
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}

```

## Footer Block 5 (footer-5)
- Source: https://tailark.com/r/footer-5.json
- Description: Shadcn/ui website footer block
- Registry dependencies: button, input, label
### ../../packages/dusk-kit/blocks/footer/five/index.tsx (registry:component) -> components/footer.tsx
```tsx
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/logo'

const enterpriseLinks = [
    { href: '#', label: 'About' },
    { href: '#', label: 'Customers' },
    { href: '#', label: 'Enterprise' },
    { href: '#', label: 'Partners' },
    { href: '#', label: 'Jobs' },
]

const productLinks = [
    { href: '#', label: 'Security' },
    { href: '#', label: 'Customization' },
    { href: '#', label: 'Enterprise' },
    { href: '#', label: 'Partners' },
]

const docsLinks = [
    { href: '#', label: 'Introduction' },
    { href: '#', label: 'Installation' },
    { href: '#', label: 'Utils' },
    { href: '#', label: 'Principles' },
    { href: '#', label: 'Jargon' },
    { href: '#', label: 'Plugin' },
    { href: '#', label: 'Customizer' },
    { href: '#', label: 'Boilerplates' },
]

const communityLinks = [
    { href: '#', label: 'GitHub' },
    { href: '#', label: 'Discord' },
    { href: '#', label: 'Slack' },
    { href: '#', label: 'X / Twitter' },
]

const footerLinks = [
    {
        name: 'Enterprise',
        links: enterpriseLinks,
    },
    {
        name: 'Product',
        links: productLinks,
    },
    {
        name: 'Docs',
        links: docsLinks,
    },
]

export default function Footer() {
    return (
        <footer className="m-1 rounded-3xl border">
            <div className="mx-auto max-w-5xl space-y-16 px-5 py-16">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-8">
                    <Link
                        href="/"
                        aria-label="go home">
                        <Logo />
                    </Link>
                    <div className="flex gap-3">
                        <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Threads"
                            className="text-muted-foreground hover:text-primary block">
                            <svg
                                className="size-6"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24">
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M19.25 8.505c-1.577-5.867-7-5.5-7-5.5s-7.5-.5-7.5 8.995s7.5 8.996 7.5 8.996s4.458.296 6.5-3.918c.667-1.858.5-5.573-6-5.573c0 0-3 0-3 2.5c0 .976 1 2 2.5 2s3.171-1.027 3.5-3c1-6-4.5-6.5-6-4"
                                    color="currentColor"></path>
                            </svg>
                        </Link>
                        <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="text-muted-foreground hover:text-primary block">
                            <svg
                                className="size-6"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"></path>
                            </svg>
                        </Link>
                        <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="TikTok"
                            className="text-muted-foreground hover:text-primary block">
                            <svg
                                className="size-6"
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48"></path>
                            </svg>
                        </Link>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                    {footerLinks.map((linksGroup, index) => (
                        <div key={index}>
                            <span className="font-medium">{linksGroup.name}</span>
                            <ul className="mt-4 list-inside space-y-4">
                                {linksGroup.links.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            href={link.href}
                                            className="hover:text-primary text-muted-foreground text-sm duration-150">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <div>
                        <span className="text-sm font-medium">Community</span>
                        <ul className="mt-4 list-inside space-y-4">
                            {communityLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-primary text-muted-foreground text-sm duration-150">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <form className="mt-12 w-full max-w-xs">
                            <div className="space-y-2.5">
                                <Label
                                    className="block text-sm font-medium"
                                    htmlFor="email">
                                    Subscribe to our newsletter
                                </Label>
                                <Input
                                    className="input variant-mixed sz-md"
                                    placeholder="Your email"
                                    type="email"
                                    id="email"
                                    required
                                    name="email"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="mt-3">
                                <span>Subscribe</span>
                            </Button>
                        </form>
                    </div>
                </div>
                <div className="bg-muted mt-16 flex items-center justify-between rounded-md p-4 px-6 py-3">
                    <span>&copy; tailus 2021 - Present</span>
                    <Link
                        href="#"
                        className="text-muted-foreground hover:text-primary text-sm">
                        Licence
                    </Link>
                </div>
            </div>
        </footer>
    )
}

```
### ../../packages/core/src/components/logo.tsx (registry:component)
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}

```

## Pricing Block 3 (pricing-3)
- Source: https://tailark.com/r/pricing-3.json
- Description: Shadcn/ui website pricing section
- Registry dependencies: button, card
### ../../packages/dusk-kit/blocks/pricing/three/index.tsx (registry:component) -> components/pricing.tsx
```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

export default function Pricing() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto max-w-2xl space-y-6 text-center">
                    <h1 className="text-center text-4xl font-semibold lg:text-5xl">Pricing that Scales with You</h1>
                    <p>Gemini is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.</p>
                </div>

                <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-medium">Free</CardTitle>

                            <span className="my-3 block text-2xl font-semibold">$0 / mo</span>

                            <CardDescription className="text-sm">Per editor</CardDescription>
                            <Button
                                asChild
                                variant="outline"
                                className="mt-4 w-full">
                                <Link href="">Get Started</Link>
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <hr className="border-dashed" />

                            <ul className="list-outside space-y-3 text-sm">
                                {['Basic Analytics Dashboard', '5GB Cloud Storage', 'Email and Chat Support'].map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="relative">
                        <span className="bg-linear-to-br/increasing absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">Popular</span>

                        <CardHeader>
                            <CardTitle className="font-medium">Pro</CardTitle>

                            <span className="my-3 block text-2xl font-semibold">$19 / mo</span>

                            <CardDescription className="text-sm">Per editor</CardDescription>

                            <Button
                                asChild
                                className="mt-4 w-full">
                                <Link href="">Get Started</Link>
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <hr className="border-dashed" />

                            <ul className="list-outside space-y-3 text-sm">
                                {['Everything in Free Plan', '5GB Cloud Storage', 'Email and Chat Support', 'Access to Community Forum', 'Single User Access', 'Access to Basic Templates', 'Mobile App Access', '1 Custom Report Per Month', 'Monthly Product Updates', 'Standard Security Features'].map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="font-medium">Startup</CardTitle>

                            <span className="my-3 block text-2xl font-semibold">$29 / mo</span>

                            <CardDescription className="text-sm">Per editor</CardDescription>

                            <Button
                                asChild
                                variant="outline"
                                className="mt-4 w-full">
                                <Link href="">Get Started</Link>
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <hr className="border-dashed" />

                            <ul className="list-outside space-y-3 text-sm">
                                {['Everything in Pro Plan', '5GB Cloud Storage', 'Email and Chat Support'].map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

```

## Pricing Block 5 (pricing-5)
- Source: https://tailark.com/r/pricing-5.json
- Description: Shadcn/ui website pricing section
- Registry dependencies: button
### ../../packages/dusk-kit/blocks/pricing/five/index.tsx (registry:component) -> components/pricing.tsx
```tsx
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'

export default function Pricing() {
    return (
        <div className="relative py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Start managing your company smarter today</h2>
                </div>
                <div className="mt-8 md:mt-20">
                    <div className="bg-card relative rounded-3xl border shadow-2xl shadow-zinc-950/5">
                        <div className="grid items-center gap-12 divide-y p-12 md:grid-cols-2 md:divide-x md:divide-y-0">
                            <div className="pb-12 text-center md:pb-0 md:pr-12">
                                <h3 className="text-2xl font-semibold">Suite Enterprise</h3>
                                <p className="mt-2 text-lg">For your company of any size</p>
                                <span className="mb-6 mt-12 inline-block text-6xl font-bold">
                                    <span className="text-4xl">$</span>234
                                </span>

                                <div className="flex justify-center">
                                    <Button
                                        asChild
                                        size="lg">
                                        <Link href="#">Get started</Link>
                                    </Button>
                                </div>

                                <p className="text-muted-foreground mt-12 text-sm">Includes : Security, Unlimited Storage, Payment, Search engine, and all features</p>
                            </div>
                            <div className="relative">
                                <ul
                                    role="list"
                                    className="space-y-4">
                                    {['First premium advantage', 'Second advantage weekly', 'Third advantage donate to project', 'Fourth, access to all components weekly'].map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2">
                                            <Check className="size-3" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-muted-foreground mt-6 text-sm">Team can be any size, and you can add or switch members as needed. Companies using our platform include:</p>
                                <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
                                    <img
                                        className="h-5 w-fit dark:invert"
                                        src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                        alt="Nvidia Logo"
                                        height="20"
                                        width="auto"
                                    />
                                    <img
                                        className="h-4 w-fit dark:invert"
                                        src="https://html.tailus.io/blocks/customers/column.svg"
                                        alt="Column Logo"
                                        height="16"
                                        width="auto"
                                    />
                                    <img
                                        className="h-4 w-fit dark:invert"
                                        src="https://html.tailus.io/blocks/customers/github.svg"
                                        alt="GitHub Logo"
                                        height="16"
                                        width="auto"
                                    />
                                    <img
                                        className="h-5 w-fit dark:invert"
                                        src="https://html.tailus.io/blocks/customers/nike.svg"
                                        alt="Nike Logo"
                                        height="20"
                                        width="auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

```

## Pricing Comparator 1 (comparator-1)
- Source: https://tailark.com/r/comparator-1.json
- Description: Shadcn/ui pricing comparator table block
- Registry dependencies: button
### ../../packages/dusk-kit/blocks/comparator/one/index.tsx (registry:component) -> components/pricing-comparator.tsx
```tsx
import { Button } from '@/components/ui/button'
import { Cpu, Sparkles } from 'lucide-react'
import Link from 'next/link'

const tableData = [
    {
        feature: 'Feature 1',
        free: true,
        pro: true,
        startup: true,
    },
    {
        feature: 'Feature 2',
        free: true,
        pro: true,
        startup: true,
    },
    {
        feature: 'Feature 3',
        free: false,
        pro: true,
        startup: true,
    },
    {
        feature: 'Tokens',
        free: '',
        pro: '20 Users',
        startup: 'Unlimited',
    },
    {
        feature: 'Video calls',
        free: '',
        pro: '12 Weeks',
        startup: '56',
    },
    {
        feature: 'Support',
        free: '',
        pro: 'Secondes',
        startup: 'Unlimited',
    },
    {
        feature: 'Security',
        free: '',
        pro: '20 Users',
        startup: 'Unlimited',
    },
]

export default function PricingComparator() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="w-full overflow-auto lg:overflow-visible">
                    <table className="w-[200vw] border-separate border-spacing-x-3 md:w-full dark:[--color-muted:var(--color-zinc-900)]">
                        <thead className="bg-background sticky top-0">
                            <tr className="*:py-4 *:text-left *:font-medium">
                                <th className="lg:w-2/5"></th>
                                <th className="space-y-3">
                                    <span className="block">Free</span>

                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm">
                                        <Link href="#">Get Started</Link>
                                    </Button>
                                </th>
                                <th className="bg-muted rounded-t-(--radius) space-y-3 px-4">
                                    <span className="block">Pro</span>
                                    <Button
                                        asChild
                                        size="sm">
                                        <Link href="#">Get Started</Link>
                                    </Button>
                                </th>
                                <th className="space-y-3">
                                    <span className="block">Startup</span>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm">
                                        <Link href="#">Get Started</Link>
                                    </Button>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-caption text-sm">
                            <tr className="*:py-3">
                                <td className="flex items-center gap-2 font-medium">
                                    <Cpu className="size-4" />
                                    <span>Features</span>
                                </td>
                                <td></td>
                                <td className="bg-muted border-none px-4"></td>
                                <td></td>
                            </tr>
                            {tableData.slice(-4).map((row, index) => (
                                <tr
                                    key={index}
                                    className="*:border-b *:py-3">
                                    <td className="text-muted-foreground">{row.feature}</td>
                                    <td>
                                        {row.free === true ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="size-4">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ) : (
                                            row.free
                                        )}
                                    </td>
                                    <td className="bg-muted border-none px-4">
                                        <div className="-mb-3 border-b py-3">
                                            {row.pro === true ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="size-4">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            ) : (
                                                row.pro
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        {row.startup === true ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="size-4">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ) : (
                                            row.startup
                                        )}
                                    </td>
                                </tr>
                            ))}
                            <tr className="*:pb-3 *:pt-8">
                                <td className="flex items-center gap-2 font-medium">
                                    <Sparkles className="size-4" />
                                    <span>AI Models</span>
                                </td>
                                <td></td>
                                <td className="bg-muted border-none px-4"></td>
                                <td></td>
                            </tr>
                            {tableData.map((row, index) => (
                                <tr
                                    key={index}
                                    className="*:border-b *:py-3">
                                    <td className="text-muted-foreground">{row.feature}</td>
                                    <td>
                                        {row.free === true ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="size-4">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ) : (
                                            row.free
                                        )}
                                    </td>
                                    <td className="bg-muted border-none px-4">
                                        <div className="-mb-3 border-b py-3">
                                            {row.pro === true ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="size-4">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            ) : (
                                                row.pro
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        {row.startup === true ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="size-4">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ) : (
                                            row.startup
                                        )}
                                    </td>
                                </tr>
                            ))}
                            <tr className="*:py-6">
                                <td></td>
                                <td></td>
                                <td className="bg-muted rounded-b-(--radius) border-none px-4"></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

```

## FAQs Block 1 (faqs-1)
- Source: https://tailark.com/r/faqs-1.json
- Description: Shadcn/ui Frequently Asqued Questions block
### ../../packages/dusk-kit/blocks/faqs/one/index.tsx (registry:component) -> components/faqs.tsx
```tsx
export default function FAQs() {
    return (
        <section className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-y-12 px-2 lg:[grid-template-columns:1fr_auto]">
                    <div className="text-center lg:text-left">
                        <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
                            Frequently <br className="hidden lg:block" /> Asked <br className="hidden lg:block" />
                            Questions
                        </h2>
                        <p>Accusantium quisquam. Illo, omnis?</p>
                    </div>

                    <div className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0">
                        <div className="pb-6">
                            <h3 className="font-medium">What is the refund policy?</h3>
                            <p className="text-muted-foreground mt-4">We offer a 30-day money back guarantee. If you are not satisfied with our product, you can request a refund within 30 days of your purchase.</p>

                            <ol className="list-outside list-decimal space-y-2 pl-4">
                                <li className="text-muted-foreground mt-4">To request a refund, please contact our support team with your order number and reason for the refund.</li>
                                <li className="text-muted-foreground mt-4">Refunds will be processed within 3-5 business days.</li>
                                <li className="text-muted-foreground mt-4">Please note that refunds are only available for new customers and are limited to one per customer.</li>
                            </ol>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">How do I cancel my subscription?</h3>
                            <p className="text-muted-foreground mt-4">You can cancel your subscription at any time by logging into your account and clicking on the cancel button.</p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">Can I upgrade my plan?</h3>
                            <p className="text-muted-foreground my-4">Yes, you can upgrade your plan at any time by logging into your account and selecting the plan you want to upgrade to.</p>
                            <ul className="list-outside list-disc space-y-2 pl-4">
                                <li className="text-muted-foreground">You will be charged the difference in price between your current plan and the plan you are upgrading to.</li>
                                <li className="text-muted-foreground">Your new plan will take effect immediately and you will be billed at the new rate on your next billing cycle.</li>
                            </ul>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">Do you offer phone support?</h3>
                            <p className="text-muted-foreground mt-4">We do not offer phone support at this time. However, you can contact us via email or live chat for any questions or concerns you may have.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## FAQs Block 3 (faqs-3)
- Source: https://tailark.com/r/faqs-3.json
- Description: Shadcn/ui FAQs block with accordion component and icons
- Registry dependencies: accordion
### ../../packages/dusk-kit/blocks/faqs/three/index.tsx (registry:component) -> components/faqs-3.tsx
```tsx
'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import Link from 'next/link'

type FAQItem = {
    id: string
    icon: IconName
    question: string
    answer: string
}

export default function FAQsThree() {
    const faqItems: FAQItem[] = [
        {
            id: 'item-1',
            icon: 'clock',
            question: 'What are your business hours?',
            answer: 'Our customer service team is available Monday through Friday from 9:00 AM to 8:00 PM EST, and weekends from 10:00 AM to 6:00 PM EST. During holidays, hours may vary and will be posted on our website.',
        },
        {
            id: 'item-2',
            icon: 'credit-card',
            question: 'How do subscription payments work?',
            answer: 'Subscription payments are automatically charged to your default payment method on the same day each month or year, depending on your billing cycle. You can update your payment information and view billing history in your account dashboard.',
        },
        {
            id: 'item-3',
            icon: 'truck',
            question: 'Can I expedite my shipping?',
            answer: 'Yes, we offer several expedited shipping options at checkout. Next-day and 2-day shipping are available for most U.S. addresses if orders are placed before 2:00 PM EST. International expedited shipping options vary by destination.',
        },
        {
            id: 'item-4',
            icon: 'globe',
            question: 'Do you offer localized support?',
            answer: 'We offer multilingual support in English, Spanish, French, German, and Japanese. Our support team can assist customers in these languages via email, chat, and phone during standard business hours for each respective region.',
        },
        {
            id: 'item-5',
            icon: 'package',
            question: 'How do I track my order?',
            answer: 'Once your order ships, you\'ll receive a confirmation email with a tracking number. You can use this number on our website or the carrier\'s website to track your package. You can also view order status and tracking information in your account dashboard under "Order History".',
        },
    ]

    return (
        <section className="bg-muted dark:bg-background py-20">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="flex flex-col gap-10 md:flex-row md:gap-16">
                    <div className="md:w-1/3">
                        <div className="sticky top-20">
                            <h2 className="mt-4 text-3xl font-bold">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground mt-4">
                                Can't find what you're looking for? Contact our{' '}
                                <Link
                                    href="#"
                                    className="text-primary font-medium hover:underline">
                                    customer support team
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="md:w-2/3">
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full space-y-2">
                            {faqItems.map((item) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}
                                    className="bg-background shadow-xs rounded-lg border px-4 last:border-b">
                                    <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-6">
                                                <DynamicIcon
                                                    name={item.icon}
                                                    className="m-auto size-4"
                                                />
                                            </div>
                                            <span className="text-base">{item.question}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-5">
                                        <div className="px-9">
                                            <p className="text-base">{item.answer}</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    )
}

```

## FAQs Block 2 (faqs-2)
- Source: https://tailark.com/r/faqs-2.json
- Description: Shadcn/ui FAQs block with accordion component
- Registry dependencies: accordion
### ../../packages/dusk-kit/blocks/faqs/two/index.tsx (registry:component) -> components/faqs-2.tsx
```tsx
'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function FAQsTwo() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'How long does shipping take?',
            answer: 'Standard shipping takes 3-5 business days, depending on your location. Express shipping options are available at checkout for 1-2 business day delivery.',
        },
        {
            id: 'item-2',
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. For enterprise customers, we also offer invoicing options.',
        },
        {
            id: 'item-3',
            question: 'Can I change or cancel my order?',
            answer: 'You can modify or cancel your order within 1 hour of placing it. After this window, please contact our customer support team who will assist you with any changes.',
        },
        {
            id: 'item-4',
            question: 'Do you ship internationally?',
            answer: "Yes, we ship to over 50 countries worldwide. International shipping typically takes 7-14 business days. Additional customs fees may apply depending on your country's import regulations.",
        },
        {
            id: 'item-5',
            question: 'What is your return policy?',
            answer: 'We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Some specialty items may have different return terms, which will be noted on the product page.',
        },
    ]

    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground mt-4 text-balance">Discover quick and comprehensive answers to common questions about our platform, services, and features.</p>
                </div>

                <div className="mx-auto mt-12 max-w-xl">
                    <Accordion
                        type="single"
                        collapsible
                        className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0">
                        {faqItems.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={item.id}
                                className="border-dashed">
                                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-base">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <p className="text-muted-foreground mt-6 px-8">
                        Can't find what you're looking for? Contact our{' '}
                        <Link
                            href="#"
                            className="text-primary font-medium hover:underline">
                            customer support team
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}

```

## Hero Section One (mist-hero-section-1)
- Source: https://tailark.com/r/mist-hero-section-1.json
- Description: Mist Kit Hero Section block, variant one
- Registry dependencies: button
### ../../packages/mist-kit/blocks/hero-section/one/index.tsx (registry:component) -> components/hero-section-one.tsx
```tsx
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroHeader } from './header'
import { ChevronRight, CirclePlay } from 'lucide-react'
import Image from 'next/image'

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <section className="bg-linear-to-b to-muted from-background">
                    <div className="relative py-36">
                        <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
                            <div className="md:w-1/2">
                                <div>
                                    <h1 className="max-w-md text-balance text-5xl font-medium md:text-6xl">Simple payments for startups</h1>
                                    <p className="text-muted-foreground my-8 max-w-2xl text-balance text-xl">One tool that does it all. Search, generate, analyze, and chat—right inside Tailark.</p>

                                    <div className="flex items-center gap-3">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="pr-4.5">
                                            <Link href="#link">
                                                <span className="text-nowrap">Get Started</span>
                                                <ChevronRight className="opacity-50" />
                                            </Link>
                                        </Button>
                                        <Button
                                            key={2}
                                            asChild
                                            size="lg"
                                            variant="outline"
                                            className="pl-5">
                                            <Link href="#link">
                                                <CirclePlay className="fill-primary/25 stroke-primary" />
                                                <span className="text-nowrap">Watch video</span>
                                            </Link>
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <p className="text-muted-foreground">Trusted by teams at :</p>
                                    <div className="mt-6 grid max-w-sm grid-cols-3 gap-6">
                                        <div className="flex">
                                            <img
                                                className="h-4 w-fit"
                                                src="https://html.tailus.io/blocks/customers/column.svg"
                                                alt="Column Logo"
                                                height="16"
                                                width="auto"
                                            />
                                        </div>
                                        <div className="flex">
                                            <img
                                                className="h-5 w-fit"
                                                src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                                alt="Nvidia Logo"
                                                height="20"
                                                width="auto"
                                            />
                                        </div>
                                        <div className="flex">
                                            <img
                                                className="h-4 w-fit"
                                                src="https://html.tailus.io/blocks/customers/github.svg"
                                                alt="GitHub Logo"
                                                height="16"
                                                width="auto"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="perspective-near mt-24 translate-x-12 md:absolute md:-right-6 md:bottom-16 md:left-1/2 md:top-40 md:mt-0 md:translate-x-0">
                            <div className="before:border-foreground/5 before:bg-foreground/5 relative h-full before:absolute before:-inset-x-4 before:bottom-7 before:top-0 before:skew-x-6 before:rounded-[calc(var(--radius)+1rem)] before:border">
                                <div className="bg-background rounded-(--radius) shadow-foreground/10 ring-foreground/5 relative h-full -translate-y-12 skew-x-6 overflow-hidden border border-transparent shadow-md ring-1">
                                    <Image
                                        src="/mist/tailark.png"
                                        alt="app screen"
                                        width="2880"
                                        height="1842"
                                        className="object-top-left size-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

```
### ../../packages/mist-kit/blocks/hero-section/one/header.tsx (registry:component) -> components/header.tsx
```tsx
'use client'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'

const menuItems = [
    { name: 'Features', href: '#link' },
    { name: 'Pricing', href: '#link' },
    { name: 'About', href: '#link' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className={cn('fixed z-20 w-full transition-all duration-300', isScrolled && 'bg-background/75 border-b border-black/5 backdrop-blur-lg')}>
                <div className="mx-auto max-w-5xl px-6">
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0">
                        <div className="flex w-full justify-between gap-6 lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>

                            <div className="m-auto hidden size-fit lg:block">
                                <ul className="flex gap-1">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm">
                                                <Link
                                                    href={item.href}
                                                    className="text-base">
                                                    <span>{item.name}</span>
                                                </Link>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <Link href="#">
                                        <span>Login</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <Link href="#">
                                        <span>Sign Up</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                    <Link href="#">
                                        <span>Get Started</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

```
### ../../packages/core/src/components/logo.tsx (registry:component) -> components/logo.tsx
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}

```

## Hero Section Two (mist-hero-section-2)
- Source: https://tailark.com/r/mist-hero-section-2.json
- Description: Mist Kit Hero Section block, variant two
- Registry dependencies: button
### ../../packages/mist-kit/blocks/hero-section/two/index.tsx (registry:component) -> components/hero-section-two.tsx
```tsx
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { HeroHeader } from './header'
import { Sparkle } from 'lucide-react'

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main>
                <section className="before:bg-muted border-e-foreground relative overflow-hidden before:absolute before:inset-1 before:h-[calc(100%-8rem)] before:rounded-2xl sm:before:inset-2 md:before:rounded-[2rem] lg:before:h-[calc(100%-14rem)]">
                    <div className="py-20 md:py-36">
                        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
                            <div>
                                <Link
                                    href="#"
                                    className="hover:bg-foreground/5 mx-auto flex w-fit items-center justify-center gap-2 rounded-md py-0.5 pl-1 pr-3 transition-colors duration-150">
                                    <div
                                        aria-hidden
                                        className="border-background bg-linear-to-b dark:inset-shadow-2xs to-foreground from-primary relative flex size-5 items-center justify-center rounded border shadow-md shadow-black/20 ring-1 ring-black/10">
                                        <div className="absolute inset-x-0 inset-y-1.5 border-y border-dotted border-white/25"></div>
                                        <div className="absolute inset-x-1.5 inset-y-0 border-x border-dotted border-white/25"></div>
                                        <Sparkle className="size-3 fill-white stroke-white drop-shadow" />
                                    </div>
                                    <span className="font-medium">Introducing Mist Agents</span>
                                </Link>
                                <h1 className="mx-auto mt-8 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">Build 10x Faster with Mist</h1>
                                <p className="text-muted-foreground mx-auto my-6 max-w-xl text-balance text-xl">Craft. Build. Ship Modern Websites With AI Support.</p>

                                <div className="flex items-center justify-center gap-3">
                                    <Button
                                        asChild
                                        size="lg">
                                        <Link href="#link">
                                            <span className="text-nowrap">Start Building</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="outline">
                                        <Link href="#link">
                                            <span className="text-nowrap">Watch Video</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative z-10 mx-auto max-w-5xl px-6">
                                <div className="mt-12 md:mt-16">
                                    <div className="bg-background rounded-(--radius) relative mx-auto overflow-hidden border border-transparent shadow-lg shadow-black/10 ring-1 ring-black/10">
                                        <Image
                                            src="/mist/tailark-2.png"
                                            alt="app screen"
                                            width="2880"
                                            height="1842"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

```
### ../../packages/mist-kit/blocks/hero-section/two/header.tsx (registry:component) -> components/header.tsx
```tsx
'use client'
import Link from 'next/link'
import { Logo, LogoIcon } from '@/components/logo'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'

const menuItems = [
    { name: 'Features', href: '#link' },
    { name: 'Pricing', href: '#link' },
    { name: 'About', href: '#link' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className={cn('fixed z-20 w-full transition-all duration-300', isScrolled && 'bg-background/75 border-b border-black/5 backdrop-blur-lg')}>
                <div className="mx-auto max-w-5xl px-6">
                    <div className={cn('relative flex flex-wrap items-center justify-between gap-6 py-6 transition-all duration-200 lg:gap-0', isScrolled && 'py-3')}>
                        <div className="flex w-full justify-between gap-6 lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <LogoIcon />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>

                            <div className="m-auto hidden size-fit lg:block">
                                <ul className="flex gap-1">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm">
                                                <Link
                                                    href={item.href}
                                                    className="text-base">
                                                    <span>{item.name}</span>
                                                </Link>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <Link href="#">
                                        <span>Login</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <Link href="#">
                                        <span>Sign Up</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                    <Link href="#">
                                        <span>Get Started</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

```
### ../../packages/core/src/components/logo.tsx (registry:component) -> components/logo.tsx
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}

```

## Hero Section Three (mist-hero-section-3)
- Source: https://tailark.com/r/mist-hero-section-3.json
- Description: Mist Kit Hero Section block, variant three
- Registry dependencies: button
### ../../packages/mist-kit/blocks/hero-section/three/index.tsx (registry:component) -> components/hero-section-three.tsx
```tsx
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroHeader } from './header'
import Image from 'next/image'

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="bg-muted/50 overflow-hidden">
                <section>
                    <div className="relative py-24">
                        <div className="mx-auto max-w-5xl px-6">
                            <div>
                                <h1 className="mt-8 max-w-2xl text-balance text-5xl font-bold lg:text-6xl">Build 10x Faster with Mist</h1>
                                <p className="text-foreground my-6 max-w-2xl text-balance text-2xl">Craft. Build. Ship Modern Websites With AI Support.</p>

                                <div className="flex flex-col items-center gap-3 *:w-full sm:flex-row sm:*:w-fit">
                                    <Button
                                        asChild
                                        size="lg">
                                        <Link href="#link">
                                            <span className="text-nowrap">Start Building</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="outline">
                                        <Link href="#link">
                                            <span className="text-nowrap">Request a demo</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-8">
                                <p className="text-muted-foreground font-medium">Trusted by teams at :</p>
                                <div className="mt-4 flex items-center gap-12">
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit"
                                            src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                            alt="Nvidia Logo"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>

                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit"
                                            src="https://html.tailus.io/blocks/customers/column.svg"
                                            alt="Column Logo"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit"
                                            src="https://html.tailus.io/blocks/customers/github.svg"
                                            alt="GitHub Logo"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit"
                                            src="https://html.tailus.io/blocks/customers/nike.svg"
                                            alt="Nike Logo"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="relative -mr-56 mt-16 sm:mr-0">
                                <div className="bg-background rounded-(--radius) relative mx-auto overflow-hidden border border-transparent shadow-lg shadow-black/10 ring-1 ring-black/10">
                                    <Image
                                        src="/mist/tailark-2.png"
                                        alt="app screen"
                                        width="2880"
                                        height="1842"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

```
### ../../packages/mist-kit/blocks/hero-section/three/header.tsx (registry:component) -> components/header.tsx
```tsx
'use client'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'

const menuItems = [
    { name: 'Features', href: '#link' },
    { name: 'Pricing', href: '#link' },
    { name: 'About', href: '#link' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className={cn('fixed z-20 w-full transition-all duration-300', isScrolled && 'bg-background/75 border-b border-black/5 backdrop-blur-lg')}>
                <div className="mx-auto max-w-5xl px-6">
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-4 lg:gap-0 lg:py-3">
                        <div className="flex w-full justify-between gap-6 lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>

                            <div className="m-auto hidden size-fit lg:block">
                                <ul className="flex gap-1">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm">
                                                <Link
                                                    href={item.href}
                                                    className="text-base">
                                                    <span>{item.name}</span>
                                                </Link>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <Link href="#">
                                        <span>Login</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <Link href="#">
                                        <span>Sign Up</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                    <Link href="#">
                                        <span>Get Started</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

```
### ../../packages/core/src/components/logo.tsx (registry:component) -> components/logo.tsx
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}

```

## Hero Section Four (mist-hero-section-4)
- Source: https://tailark.com/r/mist-hero-section-4.json
- Description: Mist Kit Hero Section block, variant four
- Registry dependencies: button
### ../../packages/mist-kit/blocks/hero-section/four/index.tsx (registry:component) -> components/hero-section-four.tsx
```tsx
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroHeader } from './header'
import { ArrowUp, Globe, Plus, Sparkle } from 'lucide-react'
import Image from 'next/image'

export default function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="[--color-primary:var(--color-indigo-500)]">
                <section className="overflow-hidden">
                    <div className="py-20 md:py-36">
                        <div className="relative z-10 mx-auto max-w-5xl px-6">
                            <div className="relative text-center">
                                <h1 className="mx-auto max-w-2xl text-balance text-4xl font-bold md:text-5xl">Build Stunning Websites That Drive Results</h1>

                                <p className="text-muted-foreground mx-auto my-6 max-w-2xl text-balance text-xl">Craft. Build. Ship Modern Websites With AI Support.</p>

                                <div className="flex flex-col items-center justify-center gap-3 *:w-full sm:flex-row sm:*:w-auto">
                                    <Button
                                        asChild
                                        size="lg">
                                        <Link href="#link">
                                            <span className="text-nowrap">Get Started</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="outline">
                                        <Link href="#link">
                                            <span className="text-nowrap">View Demo</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-3xl bg-black/10 md:mt-20">
                                <img
                                    src="https://images.unsplash.com/photo-1637055972140-64608c1abe53?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    alt=""
                                    className="absolute inset-0 size-full object-cover"
                                />

                                <div className="bg-background rounded-(--radius) relative m-4 overflow-hidden border border-transparent shadow-xl shadow-black/15 ring-1 ring-black/10 sm:m-8 md:m-12">
                                    <Image
                                        src="/mist/tailark-2.png"
                                        alt="app screen"
                                        width="2880"
                                        height="1842"
                                        className="object-top-left size-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="mt-8">
                                <p className="text-muted-foreground text-center">Trusted by teams at :</p>
                                <div className="mt-4 flex items-center justify-center gap-12">
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit"
                                            src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                            alt="Nvidia Logo"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>

                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit"
                                            src="https://html.tailus.io/blocks/customers/column.svg"
                                            alt="Column Logo"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit"
                                            src="https://html.tailus.io/blocks/customers/github.svg"
                                            alt="GitHub Logo"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit"
                                            src="https://html.tailus.io/blocks/customers/nike.svg"
                                            alt="Nike Logo"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

```
### ../../packages/mist-kit/blocks/hero-section/four/header.tsx (registry:component) -> components/header.tsx
```tsx
'use client'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'

const menuItems = [
    { name: 'Features', href: '#link' },
    { name: 'Pricing', href: '#link' },
    { name: 'About', href: '#link' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className={cn('fixed z-20 w-full transition-all duration-300', isScrolled && 'bg-background/75 border-b border-black/5 backdrop-blur-lg')}>
                <div className="mx-auto max-w-5xl px-6">
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0">
                        <div className="flex w-full justify-between gap-6 lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>

                            <div className="m-auto hidden size-fit lg:block">
                                <ul className="flex gap-1">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm">
                                                <Link
                                                    href={item.href}
                                                    className="text-base">
                                                    <span>{item.name}</span>
                                                </Link>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <Link href="#">
                                        <span>Login</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <Link href="#">
                                        <span>Sign Up</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                    <Link href="#">
                                        <span>Get Started</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

```
### ../../packages/core/src/components/logo.tsx (registry:component) -> components/logo.tsx
```tsx
import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-5', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('size-7 w-7', className)}
            viewBox="0 0 71 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M61.25 1.625L70.75 1.5625C70.75 4.77083 70.25 7.79167 69.25 10.625C68.2917 13.4583 66.8958 15.9583 65.0625 18.125C63.2708 20.25 61.125 21.9375 58.625 23.1875C56.1667 24.3958 53.4583 25 50.5 25C46.875 25 43.6667 24.2708 40.875 22.8125C38.125 21.3542 35.125 19.2083 31.875 16.375C29.75 14.4167 27.7917 12.8958 26 11.8125C24.2083 10.7292 22.2708 10.1875 20.1875 10.1875C18.0625 10.1875 16.25 10.7083 14.75 11.75C13.25 12.75 12.0833 14.1875 11.25 16.0625C10.4583 17.9375 10.0625 20.1875 10.0625 22.8125L0 22.9375C0 19.6875 0.479167 16.6667 1.4375 13.875C2.4375 11.0833 3.83333 8.64583 5.625 6.5625C7.41667 4.47917 9.54167 2.875 12 1.75C14.5 0.583333 17.2292 0 20.1875 0C23.8542 0 27.1042 0.770833 29.9375 2.3125C32.8125 3.85417 35.7708 5.97917 38.8125 8.6875C41.1042 10.7708 43.1042 12.3333 44.8125 13.375C46.5625 14.375 48.4583 14.875 50.5 14.875C52.6667 14.875 54.5417 14.3125 56.125 13.1875C57.75 12.0625 59 10.5 59.875 8.5C60.7917 6.5 61.25 4.20833 61.25 1.625Z"
                fill="none"
                strokeWidth={0.5}
                stroke="currentColor"
            />
        </svg>
    )
}

```

## Hero Section Five (mist-hero-section-5)
- Source: https://tailark.com/r/mist-hero-section-5.json
- Description: Mist Kit Hero Section block, variant five
- Registry dependencies: button
### ../../packages/mist-kit/blocks/hero-section/five/index.tsx (registry:component) -> components/hero-section-five.tsx
```tsx
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HeroSection() {
    return (
        <section className="py-20">
            <div className="relative z-10 mx-auto w-full max-w-2xl px-6 lg:px-0">
                <div className="relative text-center">
                    <MistKitLogo className="mx-auto" />
                    <h1 className="mx-auto mt-16 max-w-xl text-balance text-5xl font-medium">The Note App</h1>

                    <p className="text-muted-foreground mx-auto mb-6 mt-4 text-balance text-xl">The Note App is a simple note app that allows you to create and manage your notes.</p>

                    <div className="flex flex-col items-center gap-2 *:w-full sm:flex-row sm:justify-center sm:*:w-auto">
                        <Button
                            asChild
                            variant="neutral">
                            <Link href="#link">
                                <span className="text-nowrap">Get Started</span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="ghost">
                            <Link href="#link">
                                <span className="text-nowrap">View Demo</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="relative mt-12 overflow-hidden rounded-3xl bg-black/10 md:mt-16">
                    <img
                        src="https://images.unsplash.com/photo-1547623641-d2c56c03e2a7?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt=""
                        className="absolute inset-0 size-full object-cover"
                    />

                    <div className="bg-background rounded-(--radius) relative m-4 overflow-hidden border border-transparent shadow-xl shadow-black/15 ring-1 ring-black/10 sm:m-8 md:m-12">
                        <Image
                            src="/mist/tailark-2.png"
                            alt="app screen"
                            width="2880"
                            height="1842"
                            className="object-top-left size-full object-cover"
                        />
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                    <p className="text-muted-foreground text-center">Trusted by teams at :</p>
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        <div className="flex">
                            <img
                                className="mx-auto h-4 w-fit"
                                src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                alt="Nvidia Logo"
                                height="20"
                                width="auto"
                            />
                        </div>

                        <div className="flex">
                            <img
                                className="mx-auto h-3 w-fit"
                                src="https://html.tailus.io/blocks/customers/column.svg"
                                alt="Column Logo"
                                height="16"
                                width="auto"
                            />
                        </div>
                        <div className="flex">
                            <img
                                className="mx-auto h-3 w-fit"
                                src="https://html.tailus.io/blocks/customers/github.svg"
                                alt="GitHub Logo"
                                height="16"
                                width="auto"
                            />
                        </div>
                        <div className="flex">
                            <img
                                className="mx-auto h-4 w-fit"
                                src="https://html.tailus.io/blocks/customers/nike.svg"
                                alt="Nike Logo"
                                height="20"
                                width="auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const MistKitLogo = ({ className }: { className?: string }) => (
    <div
        aria-hidden
        className={cn('border-background bg-linear-to-b rounded-(--radius) relative flex size-9 translate-y-0.5 items-center justify-center border from-yellow-300 to-orange-600 shadow-lg shadow-black/20 ring-1 ring-black/10', className)}>
        <BookOpen className="mask-b-from-25% size-6 fill-white stroke-white drop-shadow-sm" />
        <BookOpen className="absolute inset-0 m-auto size-6 fill-white stroke-white opacity-65 drop-shadow-sm" />
        <div className="z-1 h-4.5 absolute inset-2 m-auto w-px translate-y-px rounded-full bg-black/10"></div>
    </div>
)

```
