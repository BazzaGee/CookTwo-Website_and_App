# Couples Food System — Source of Truth

## Master Reference Document for Website Build

**Version:** 3.0  
**Date:** May 26, 2026  
**Domain:** couples-food-system.com (to be purchased)  
**Email:** barrydgrottis@gmail.com (Formspree)  
**Build System:** Astro via /Astro-Build  
**Status:** Beta Waitlist (completely free)

### Relationship to Cupla

Couples Food System is a **complementary app** to **Cupla** (the existing collaborative adaptive nutrition platform). This app is being proposed to Cupla's owners as it complements their product and audience. The research documents in `Cupla Market_Gap` use "Cupla" framing because they were written as part of that market analysis and proposal. Couples Food System stands on its own as a PWA/website while Cupla is the native mobile app.

---

## Workspace Directory Map

```
Source of Truth/
│
├── SOURCE_OF_TRUTH.md              ← YOU ARE HERE (master reference)
│
├── 01-design-system/               ← Colors, typography, logo, UI specs
│   ├── COLORS.md                   ← Full color palette with all formats
│   ├── TYPOGRAPHY.md               ← Font sizes, weights, spacing
│   ├── LOGO-CONCEPT.md             ← Logo description and variations
│   └── UI-COMPONENTS.md            ← Button, card, form specs
│
├── 02-content/                     ← All website copy
│   ├── ALL-COPY.md                 ← All website copy in one file
│   └── TONE-OF-VOICE.md            ← Writing style guidelines
│
├── 03-images/                      ← Visual assets
│   ├── logo/                       ← Logo files (SVG, PNG, ICO)
│   ├── hero/                       ← Hero images for each page
│   ├── screenshots/                ← App UI mockups
│   ├── icons/                      ← Feature and UI icons
│   └── prompts/                    ← AI image generation prompts
│       └── IMAGE-PROMPTS.md        ← All prompts for logo, heroes, etc.
│
├── 04-data/                        ← Structured data for Astro
│   ├── features.json               ← Feature cards data
│   ├── faq.json                    ← FAQ questions and answers
│   ├── navigation.json             ← Nav links structure
│   └── comparison.json             ← Compare page data
│
├── 05-seo/                         ← SEO configuration
│   ├── SEO.md                      ← Meta tags, keywords, strategy
│   └── robots.txt                  ← Robots file for deployment
│
├── 06-astro-build/                 ← Astro project reference
│   ├── ASTRO-BUILD-NOTES.md        ← Setup instructions, config, structure
│   ├── stitch-template/            ← Stitch-generated template goes here
│   └── FILE-STRUCTURE.md           ← Complete Astro file tree
│
├── 07-competitor-analysis/         ← Competitive positioning
│   └── DIFFERENTIATION.md          ← What we do that others don't
│
├── google ai studio template/      ← Original HTML reference design
│   └── html                        ← Single-page HTML template
│
└── reference-materials/            ← Source research documents
    └── (links to Cupla Market_Gap directory)
```

---

## 1. Product Overview

**Name:** Couples Food System  
**Tagline:** "One dinner. Two plates. Zero arguments."  
**Category:** Collaborative Adaptive Nutrition  
**Status:** Beta (completely free, waitlist signups)

### What It Does

A collaborative meal planning and grocery app designed specifically for couples who share a kitchen but have different dietary goals.

### The Moat (Unique Feature)

**Adaptive Shared Cooking** — One cooking session, two different plates, perfectly portioned for each partner's unique goals.

**Example:**
- Partner A (weight loss): 450 cal — chicken over spinach, ½ cup rice
- Partner B (muscle gain): 700 cal — extra chicken, full cup of rice
- Same pan. Zero math. Eat together.

### What It Solves

1. The "What's for dinner?" argument (repeated every day)
2. One partner carrying the mental load of meal planning
3. Couples with different fitness goals cooking separate meals
4. Food waste from poor planning
5. Duplicate grocery purchases

### What People Are Actually Buying

- Less stress
- Fewer decisions
- Smoother evenings
- Shared responsibility
- Relationship harmony

**The food is just the medium.**

---

## 2. Brand Identity

### Name
**Couples Food System**

### Core Taglines

| Priority | Tagline | Best For |
|----------|---------|----------|
| 1 | "One dinner. Two plates. Zero arguments." | Homepage hero, ads |
| 2 | "The shared food system for couples." | Subtitle, meta |
| 3 | "End the 'what's for dinner' argument." | Landing pages |
| 4 | "Your shared kitchen, smarter." | Product pages |
| 5 | "Same meal. Two goals. Zero math." | Feature pages |

### Positioning

**We ARE:** Collaborative, warm, relationship-first, AI-powered, shared kitchen  
**We are NOT:** A diet app, a solo meal planner, clinical, fitness-obsessed, generic

### Language Rules

| Say This | Not This |
|----------|----------|
| "What are WE eating?" | "Track your macros" |
| "Hit your goals without the math" | "Optimize caloric intake" |
| "We've got the nutrition covered" | "Calorie deficit mode" |
| "Get started with a link" | "Download the app" |
| "Your partner's plate" | "User profile" |

---

## 3. Target Audience

### Primary: The Mental Load Bearer

- Partner (often female) who plans all meals
- Age 25-40
- Exhausted by constant decision-making
- Wants partner genuinely involved
- **Trigger:** Another "what do you want?" non-conversation

### Secondary: The Fitness-Focused Partner

- Specific body goals (muscle gain, weight loss)
- Age 22-38
- Wants to eat with partner but struggles to align meals
- **Trigger:** Realizing same dinner can hit different targets

### Tertiary: The Shared-Kitchen Couple

- Any couple wanting to reduce waste and cook efficiently
- Age 22-45
- Duplicate purchases, expired ingredients, wasted money
- **Trigger:** Finding expired food (again)

---

## 4. Website Pages

### Page List

| Page | Route | Priority | Purpose |
|------|-------|----------|---------|
| Homepage | `/` | P0 | Conversion, waitlist |
| Features Overview | `/features` | P0 | Education |
| Adaptive Cooking | `/features/adaptive-cooking` | P0 | The Moat deep-dive |
| Shared Grocery List | `/features/shared-grocery-list` | P1 | Feature page |
| Pantry AI | `/features/pantry-ai` | P1 | Feature page |
| Meal Planning | `/features/meal-planning` | P1 | Feature page |
| How It Works | `/how-it-works` | P0 | 5-step walkthrough |
| Compare | `/compare` | P0 | Generic competitor comparison |
| About | `/about` | P1 | Brand story |
| FAQ | `/faq` | P1 | Common questions |
| Contact | `/contact` | P2 | Support |
| 404 | `/404` | P2 | Error page |

### Navigation Structure

**Primary:** Features | How It Works | Compare | About | FAQ  
**CTA Button:** "Join Free Beta"  
**Footer:** All pages + Contact + Privacy (placeholder) + Terms (placeholder)

---

## 5. Key Features

### Feature 1: Adaptive Shared Cooking (THE MOAT)

- One cooking session, two different plates
- AI generates unified recipe with adapted plating per partner
- Same meal, different portions based on individual goals
- **Badge:** "Signature Feature" / "Unique"

### Feature 2: Real-Time Sync

- Shared grocery list updates in under 100ms
- Both partners see changes instantly
- No duplicate purchases
- Offline queue for supermarket use

### Feature 3: Pantry-First AI

- Tell the app what you have: "chicken, rice, spinach"
- AI suggests meals from existing ingredients
- Reduces food waste and extra trips to the store
- Natural language input (no barcode scanning)

### Feature 4: Collaborative Meal Planning

- Shared weekly calendar
- AI generates meals based on pantry + both partners' preferences
- Missing ingredients auto-populate grocery list
- "We" framing throughout

### Feature 5: Couple's Meal Picker (ON HOLD)

- **Status:** Fully spec'd but intentionally held back from current build
- Collaborative recipe voting — both partners see 3-5 AI-generated recipes, each votes, first mutual match becomes "our meal"
- Real-time vote sync via WebSocket
- Diet-constraint-aware (every suggestion works for both partners)
- Pantry ingredient matching visible on each card
- Full spec at: `Cupla Market_Gap/Feature_8_Couples_Meal_Picker.md`
- **Revisit after:** AI Meal Generation (Step 5) ships and is validated

---

## 6. Waitlist Configuration

### CTA Text
- Primary: "Join Free Beta Waitlist"
- Secondary: "Get Early Access"
- Tertiary: "Be Among the First"

### Formspree Setup

- **Endpoint:** `https://formspree.io/f/barrydgrottis@gmail.com`
- **Method:** POST

### Form Fields

| Field | Type | Required | Label |
|-------|------|----------|-------|
| email | email | Yes | "Your email address" |
| partner_email | email | No | "Partner's email (optional)" |
| primary_goal | select | Yes | "What is your shared primary goal?" |

### Goal Options

1. Stop arguing about "what's for dinner"
2. Eat the same meals but with different portion goals
3. Reduce food waste and save money

### Placement

- Hero section (prominent)
- After features section
- Bottom of every page (footer-adjacent)
- Dedicated "Be Among the First" section

### Messaging

- "Completely free during Beta"
- "No credit card required"
- "We respect your privacy. No spam, ever."

---

## 7. 5-Step "How It Works" Workflow

1. **Invite Your Partner** — Link accounts to create your shared digital kitchen. "We" replaces "You".
2. **Set Your Goals** — Partner A wants more energy; Partner B wants to build strength. Set individual preferences behind the scenes.
3. **Stock the Pantry** — Quickly log what you already have. Our AI uses this to suggest smart, waste-free meals.
4. **Generate Meals** — Hit generate. We create a weekly plan with one unified, real-time grocery list.
5. **Cook Together** — Follow one simple recipe, then plate it two ways based on your individual needs. Eat together in peace.

---

## 8. Compare Page Strategy

### CRITICAL RULE
**Never name specific competitors.** Use generic references only.

### Page Title
"Why Generic Apps Fail Couples"

### Comparison Table

| Feature | Couples Food System | Standard Diet Apps |
|---------|:------------------:|:------------------:|
| Adaptive Portions (1 Meal, 2 Goals) | Yes | No |
| Real-Time Shared Grocery List | Yes | No |
| Pantry-Aware AI Generation | Yes | No |
| Relationship "We" Centric Design | Yes | No |
| No App Store Download Required | Yes | No |

### Key Differentiators (Generic)

1. **Most popular meal planners** are designed for isolated individuals — they force you to choose between eating the same portions or cooking separate meals
2. **Standard diet tracking apps** feel clinical, isolating, and ignore that cooking together should be a bonding experience
3. **Grocery list apps** sync your list but have zero nutritional intelligence or meal awareness
4. **AI meal generators** plan for one person and don't understand couples or shared kitchens
5. **No existing app** combines real-time collaboration + AI meal generation + adaptive portions + pantry-first approach + relationship-first design

### Threat Intelligence (Internal)

Competitor analysis is maintained in `Cupla Market_Gap/Competitors Analysis/` with 33 competitors across 6 tiers. Key threats:
- **VERY HIGH:** Yummo (live, $9.99/mo)
- **HIGH:** Fitia (YC S21, 10M+ users), PlateMates (live iOS, split recipes)
- **MEDIUM-HIGH:** Leanlife (live iOS+Android, real-time sync)
- **MEDIUM:** SplitPlate, Cloche (pre-launch), OttoChef, DuoDine, Samsung Food, Ollie AI

---

## 9. Quick Reference Tables

### Color Palette (All Formats)

| Name | Hex | RGB | Tailwind Class |
|------|-----|-----|----------------|
| Cream | `#FAF6EE` | 250,246,238 | `bg-cream` |
| Cream Dark | `#F5F0E6` | 245,240,230 | `bg-cream-dark` |
| Sage | `#7A9E7E` | 122,158,126 | `bg-sage` / `text-sage` |
| Sage Dark | `#5A7E5E` | 90,126,94 | `bg-sage-dark` / `hover:bg-sage-dark` |
| Sage Light | `#9ABE9E` | 154,190,158 | `bg-sage-light` |
| Terracotta | `#E8A87C` | 232,168,124 | `bg-terracotta` / `text-terracotta` |
| Terracotta Dark | `#C88A5C` | 200,138,92 | `bg-terracotta-dark` |
| Text Primary | `#2C3E2D` | 44,62,45 | `text-text-primary` |
| Text Secondary | `#6B7B6C` | 107,123,108 | `text-text-secondary` |
| Border | `#E5E1DA` | 229,225,218 | `border-border` |
| Error | `#E07A5F` | 224,122,95 | `text-error` |

### Tailwind Config Colors

```javascript
colors: {
  cream: { DEFAULT: '#FAF6EE', dark: '#F5F0E6' },
  sage: { DEFAULT: '#7A9E7E', dark: '#5A7E5E', light: '#9ABE9E' },
  terracotta: { DEFAULT: '#E8A87C', dark: '#C88A5C' },
  text: { primary: '#2C3E2D', secondary: '#6B7B6C' },
  border: '#E5E1DA'
}
```

### Font Stack

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### PWA Manifest Colors

- Theme: `#7A9E7E` (Sage)
- Background: `#FAF6EE` (Cream)

---

## 10. Logo Concept

### Design Description

A **heart-shaped ceramic plate** sitting on a **rustic wooden table**:

- Split **vertically** down the middle
- **Left half:** Sage green (#7A9E7E)
- **Right half:** Terracotta (#E8A87C)
- **Surrounded by:** Fresh vegetables, herbs, fruits (suggesting abundance)
- **Style:** Pastel, realistic, lush, premium
- **Lighting:** Soft, natural, warm window light

### Symbolism

- Two colors = two partners
- One plate = shared meal
- Heart shape = relationship
- Fresh produce = health, abundance
- Together = unity, collaboration

### Variations Needed

| Variation | Use Case |
|-----------|----------|
| Full (plate + wordmark) | Website header, emails |
| Icon only (plate) | Favicon, app icon, social |
| White plate on dark bg | Dark backgrounds |
| Simplified (flat/outline) | Small sizes, print |

### Image Generation Prompt

```
A heart-shaped ceramic plate sitting on a rustic wooden table, split vertically 
down the middle. The left half of the plate is sage green (#7A9E7E), the right 
half is warm terracotta (#E8A87C). The plate is surrounded by fresh vegetables, 
herbs, and fruits suggesting abundance and healthy cooking. Soft, natural 
lighting from a window. Pastel color palette, realistic food photography style, 
warm and inviting atmosphere, premium quality. High resolution, centered 
composition, top-down angle slightly angled.
```

---

## 11. Source Materials

### Research Documents

All research is located at:
```
C:\Users\barry\OneDrive\Desktop\Cupla\Cupla Market_Gap
```

| Document | Purpose |
|----------|---------|
| `Cupla_Market_Analysis.md` | Full market strategy, positioning, SWOT (1,315 lines) |
| `Market_Analysis_2.md` | Competitor deep dives, market size |
| `Draft_1.md` | Product walkthrough, tab-by-tab |
| `Product_Development_Steps.md` | 7-step build order |
| `Google_AI_Studio_Prompt.md` | Detailed design system, screens |
| `Rork_Prompt.md` | Complete React Native + Expo mobile app prompt (764 lines) — screen-by-screen specs, data models, design system |
| `Feature_8_Couples_Meal_Picker.md` | Fully spec'd ON HOLD feature — collaborative recipe voting for couples |
| `Naming & Positioning/Angles_and_Slogans.md` | All marketing angles |
| `Naming & Positioning/Naming_Conventions.md` | Name research |
| `Competitors Analysis/` | 33 competitors across 6 tiers with master overview doc (`00-master-competitive-landscape.md`) and tier summaries. Each analysis follows 17-section structure |
| `Cloudflare Strategy/cupla_cloudflare_strategy.md` | Technical architecture |
| `Chat Analaysis/` | Three independent AI market validation analyses (Claude, Gemini, GPT) |

### Existing Codebase (MVP Built)

```
C:\Users\barry\OneDrive\Desktop\Cupla\Cupla Market_Gap\couples-food-system\
```

| Component | Stack | Status |
|-----------|-------|--------|
| Frontend | React 19 + Vite + TypeScript + Tailwind + Zustand + TanStack Query | Built |
| Worker | Cloudflare Workers (Hono) + Durable Objects + D1 + KV | Built |
| PWA | vite-plugin-pwa (service worker, manifest) | Built |
| Real-time | WebSocket via Durable Objects | Built |

**Step 1 Complete:** Shared Grocery List with real-time sync, invite code auth, category grouping, partner color coding, quick-add chips, offline support.

### Reference HTML Template

```
C:\Users\barry\OneDrive\Desktop\Couples Food System _ Website\google ai studio template\html
```

This is a complete single-page HTML template with all sections, Formspree integration, and brand colors. Use as design reference for Astro conversion.

---

## 12. Build Checklist

### Existing Codebase (couples-food-system/)
- [x] Step 1: Shared Grocery List with Real-Time Sync
- [ ] Step 2: PWA Install + Mobile Polish
- [ ] Step 3: Partner Profiles + D1
- [ ] Step 4: Pantry Tracking
- [ ] Step 5: AI Meal Generation
- [ ] Step 6: Meal Calendar + Smart Grocery
- [ ] Step 7: Adaptive Shared Cooking

### Website Build — Phase 1: Foundation
- [ ] Initialize Astro project
- [ ] Install dependencies (Tailwind, MDX, Sitemap)
- [ ] Configure Tailwind with brand colors
- [ ] Create file structure per `06-astro-build/FILE-STRUCTURE.md`
- [ ] Create BaseLayout component
- [ ] Configure Formspree

### Website Build — Phase 2: Components
- [ ] Button (primary, secondary, sizes)
- [ ] Card (feature, testimonial)
- [ ] Input (text, email, select)
- [ ] Header with navigation (desktop + mobile)
- [ ] Footer
- [ ] Waitlist form component

### Website Build — Phase 3: Pages
- [ ] Homepage with hero + waitlist
- [ ] Features overview
- [ ] Adaptive Cooking (the moat)
- [ ] Shared Grocery List
- [ ] Pantry AI
- [ ] Meal Planning
- [ ] How It Works (5 steps)
- [ ] Compare (generic)
- [ ] About
- [ ] FAQ
- [ ] Contact
- [ ] 404

### Website Build — Phase 4: Assets
- [ ] Generate logo
- [ ] Generate hero images
- [ ] Create app screenshots/mockups
- [ ] Implement icons (Lucide)

### Website Build — Phase 5: SEO & Polish
- [ ] Meta tags on all pages
- [ ] Open Graph tags
- [ ] Schema.org markup
- [ ] robots.txt
- [ ] Sitemap
- [ ] Responsive testing
- [ ] Accessibility check
- [ ] Performance optimization

### Website Build — Phase 6: Deploy
- [ ] Build static site
- [ ] Deploy to hosting (Cloudflare Pages recommended)
- [ ] Configure domain
- [ ] Test all forms
- [ ] Final QA

---

## Document Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 25, 2026 | Initial creation |
| 2.0 | May 25, 2026 | Final version — organized workspace, all sections complete |
| 3.0 | May 26, 2026 | Added Cupla relationship context, Feature 5 (Meal Picker ON HOLD), 4 new source docs (Rork Prompt, Feature 8, Chat Analyses, couples-food-system codebase), updated competitor analysis to 33 tiered, marked Step 1 complete, added threat intelligence to Compare section, renamed workspace folder |

---

*This document drives all website build decisions. Update it as the project evolves.*
