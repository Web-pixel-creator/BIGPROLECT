# Regression Prompts (Manual QA)

Use these prompts to verify section generation, ordering, and images. Expect each section to be wrapped with `data-section="<key>"` in the order listed.

## 1) Vinyl Marketplace (Large Prompt)
Prompt:
A Homepage for the vinyl records marketplace called VINYL VAULT.

Background: deep charcoal (#1A1A1A) with subtle texture like vinyl grooves

Center menu: Browse, New Arrivals, Genres, Rarities, Sell in cream white (#F5F5DC)

Active state: "Browse" has gold underline (3px) and slightly larger font weight

Hover state: menu items get gold color tint and subtle slide-up animation

Right: Search icon with expandable search bar, Wishlist (heart icon with red badge showing "3"), Cart icon, Profile avatar

Search bar expands smoothly left when clicked, gold border on focus

Subtle vinyl record spinning animation on logo on hover

Hero Section:

Full-width vintage record player hero image with warm analog photography

Overlaid text: "Discover Vinyl History" in large display serif

Genre carousel: Jazz, Rock, Classical, Electronic as rounded tags with gold borders

Product Grid with Vinyl Cards:

Each card shows album cover at angle like displayed in crate

Album name in condensed font, artist in italic

Condition badge: "Mint", "Very Good" in gold outlined pills

Price in gold color, "Add to Cart" button black with gold hover

Selected/Active card: gold glowing border (4px) and slight lift shadow

Footer (dark charcoal matching header):

Top section: "Join the Collector's Circle" newsletter with vinyl record graphic, email input with gold submit button

Middle: 4 columns layout

Shop: Browse by Genre, New Arrivals, Rare Finds, Sell Your Vinyl

About: Our Story, Authentication, Grading Guide, Blog

Support: Shipping Info, Returns, FAQ, Contact

Connect: Instagram, YouTube, Discord Community links with hover gold tint

Bottom bar: Copyright text, Payment methods icons (Visa, Mastercard, PayPal in gold), "Audiophile Approved" badge

All footer links have gold underline on hover

Social icons are cream color, turn gold on hover with rotation animation

Vintage aesthetic with gold (#D4AF37) and cream accents on dark background.

Expected sections order:
- navigation
- hero
- categories
- products
- footer

Image checks:
- hero: >=1 img
- products: >=3 imgs

## 2) Photographer Portfolio
Prompt:
Modern photographer portfolio landing page with a full-width hero image, a 3-column gallery grid, testimonials, and a contact form CTA. Use a minimal black/white theme.

Expected sections order:
- hero
- gallery
- testimonials
- cta

Image checks:
- hero: >=1 img
- gallery: >=2 imgs

## 3) SaaS Landing (Pricing + FAQ)
Prompt:
Build a clean SaaS landing page with hero, features, pricing (3 tiers), FAQ, and footer. Light theme with blue accent.

Expected sections order:
- hero
- features
- pricing
- faq
- footer

Image checks:
- hero: >=1 img (only if IMAGES block present)

## 4) Restaurant Homepage
Prompt:
Create a restaurant homepage with a hero image, a menu grid, testimonials, and footer. Warm colors and cozy atmosphere.

Expected sections order:
- hero
- products
- testimonials
- footer

Image checks:
- hero: >=1 img
- products: >=3 imgs
