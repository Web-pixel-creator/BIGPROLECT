import React, { useState } from 'react';
import { Sparkles, Palette, ShoppingBag, Briefcase, Smartphone, Utensils } from 'lucide-react';

// Категории дизайнов с визуальными иконками
const DESIGN_CATEGORIES = [
  {
    icon: Sparkles,
    title: 'SaaS Landing',
    color: 'text-purple-400',
    prompts: [
      {
        name: 'Dark SaaS Pro',
        prompt: `Modern SaaS landing (Dark Theme):

HERO: H1 "Ship Products Faster" (80px gradient purple→blue) + subheading + 2 CTAs (primary + outline) + animated gradient background (#8B5CF6 to #3B82F6)

FEATURES: 6 glassmorphism cards (3x2 grid) with icons - Zap, Shield, Code, Users, BarChart, Settings

PRICING: 3 tiers with monthly/yearly toggle, middle tier highlighted with purple glow

TESTIMONIALS: Carousel with company logos + quotes

[Colors: #8B5CF6, #3B82F6, #0F172A | Font: Inter]`,
      },
    ],
  },
  {
    icon: ShoppingBag,
    title: 'E-commerce',
    color: 'text-amber-400',
    prompts: [
      {
        name: 'Vinyl Records Store',
        prompt: `Vintage Vinyl Records E-commerce (Warm/Dark):

HERO: Full-width vintage record player image with warm gradient overlay + H1 "Discover Vinyl History" (display serif, 72px) + search bar with gold accent

GENRE CAROUSEL: Horizontal scroll - Jazz, Rock, Classical, Electronic as rounded tags with gold borders (#C9A66B)

PRODUCT GRID: 12 vinyl cards - each with album cover at crate angle, album name (condensed font), artist (italic), condition badge ("Mint"/"Very Good" in gold outlined pills), price in gold, black "Add to Cart" button with gold hover

[Colors: #000000, #C9A66B, #1A1A1A | Font: Playfair Display + Inter]`,
      },
    ],
  },
  {
    icon: Briefcase,
    title: 'Agency/Portfolio',
    color: 'text-blue-400',
    prompts: [
      {
        name: 'Bold Agency',
        prompt: `Creative Agency Landing (Bold):

HERO: Split screen - left: H1 "We Create Digital Experiences" (96px bold) + CTA, right: grid of project thumbnails with parallax effect

SERVICES: 4 cards with large icons, hover state reveals full description with orange overlay (#FF6B6B)

PROJECTS: Masonry grid (Pinterest-style) - 9 projects with category filter tabs

TEAM: 6 team member cards with B&W photos, color on hover

[Colors: #FF6B6B, #000000, #FFFFFF | Font: Montserrat]`,
      },
    ],
  },
  {
    icon: Smartphone,
    title: 'Mobile App',
    color: 'text-green-400',
    prompts: [
      {
        name: 'App Landing Page',
        prompt: `Mobile App Landing (Gradient):

HERO: Center - iPhone mockup with app screenshot + H1 "Your Fitness Journey Starts Here" (64px) + 2 CTAs (Download + Learn More) + gradient background (green #10B981 to blue #3B82F6)

FEATURES: 6 alternating sections (icon left, text right, then vice versa) with fade-in animations

SCREENSHOTS: Horizontal slider with 5 app screens

APP BADGES: Apple App Store + Google Play with download stats

[Colors: #10B981, #3B82F6, #F9FAFB | Font: SF Pro Display]`,
      },
    ],
  },
  {
    icon: Utensils,
    title: 'Restaurant',
    color: 'text-red-400',
    prompts: [
      {
        name: 'Fine Dining',
        prompt: `Fine Dining Restaurant (Luxury):

HERO: Full-screen food photography with dark overlay + H1 "Culinary Excellence" (elegant serif, 88px gold) + reservation button with gold border

MENU: Tabbed sections (Appetizers, Mains, Desserts, Drinks) - each item with name, description (italic), price (gold), dietary icons

CHEF'S PICKS: 3 featured dishes with large images, chef's note popup on hover

RESERVATION: Inline form with date/time picker (gold accents) + map integration

[Colors: #000000, #C9A66B, #1A1A1A | Font: Cormorant Garamond + Lato]`,
      },
    ],
  },
  {
    icon: Palette,
    title: 'Portfolio',
    color: 'text-pink-400',
    prompts: [
      {
        name: 'Designer Portfolio',
        prompt: `Minimalist Designer Portfolio:

HERO: Centered - H1 "Creative Designer" (120px thin) + H2 "UI/UX & Branding" + 2 CTAs (View Work + Contact)

WORK GRID: 12 case study cards (4x3) - hover reveals project title overlay with gradient fade, click opens case study page

ABOUT: Split section - left: portrait photo with pink accent border, right: bio + skills with animated progress bars

CONTACT: Simple form + social links with hover animations (pink #EC4899)

[Colors: #000000, #EC4899, #F3F4F6 | Font: Outfit]`,
      },
    ],
  },
];

type ExamplePromptsProps = {
  onSelect?: (prompt: string) => void;
};

export function ExamplePrompts({ onSelect }: ExamplePromptsProps) {
  const [selectedCategory, setSelectedCategory] = useState(0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-bolt-elements-textPrimary flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          Premium Design Templates
        </h3>
        <p className="text-sm text-bolt-elements-textSecondary">
          Готовые промпты для создания дизайнов уровня Webflow
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {DESIGN_CATEGORIES.map((category, idx) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedCategory(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isSelected
                  ? 'border-bolt-elements-focus bg-bolt-elements-focus/10 text-bolt-elements-textPrimary'
                  : 'border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary hover:border-bolt-elements-focus/50'
                }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? category.color : ''}`} />
              <span className="text-sm font-medium">{category.title}</span>
            </button>
          );
        })}
      </div>

      {/* Prompt Cards */}
      <div className="grid grid-cols-1 gap-3">
        {DESIGN_CATEGORIES[selectedCategory].prompts.map((template, idx) => (
          <div
            key={idx}
            className="group border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 rounded-lg p-4 hover:border-bolt-elements-focus transition-all cursor-pointer"
            onClick={() => onSelect?.(template.prompt)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold text-bolt-elements-textPrimary group-hover:text-bolt-elements-focus transition-colors">
                  {template.name}
                </h4>
                <p className="text-xs text-bolt-elements-textSecondary line-clamp-3 font-mono leading-relaxed">
                  {template.prompt}
                </p>
              </div>
              <button
                className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-md bg-bolt-elements-focus text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(template.prompt);
                }}
              >
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pro Tip */}
      <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-4">
        <div className="flex gap-3">
          <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-bolt-elements-textPrimary">
              💡 Pro Tip: Структура идеального промпта
            </p>
            <p className="text-xs text-bolt-elements-textSecondary leading-relaxed">
              Для премиум-дизайна укажите: <strong>HERO</strong> (размер текста, CTA, фон) → <strong>СЕКЦИИ</strong> (Grid, Cards, Testimonials) → <strong>[Colors: hex, hex] | [Font: название]</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
