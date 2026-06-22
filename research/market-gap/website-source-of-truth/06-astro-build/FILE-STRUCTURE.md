# Astro File Structure — Couples Food System

## Complete project tree for the Astro build

```
couples-food-system-website/
│
├── public/
│   ├── images/
│   │   ├── logo/
│   │   │   ├── logo-full.svg          ← Full logo with wordmark
│   │   │   ├── logo-full.png          ← Full logo PNG fallback
│   │   │   ├── logo-icon.svg          ← Icon only (plate)
│   │   │   ├── logo-white.svg         ← White version
│   │   │   └── favicon.svg            ← Browser favicon
│   │   ├── hero/
│   │   │   ├── hero-homepage.webp     ← Homepage hero
│   │   │   ├── hero-adaptive.webp     ← Adaptive cooking hero
│   │   │   ├── hero-how-it-works.webp ← How it works hero
│   │   │   └── og-homepage.png        ← Open Graph image (1200x630)
│   │   ├── screenshots/
│   │   │   ├── screenshot-shopping.webp
│   │   │   ├── screenshot-pantry.webp
│   │   │   ├── screenshot-mealplan.webp
│   │   │   └── screenshot-adaptive.webp
│   │   └── icons/
│   │       └── (Lucide icons used via package)
│   ├── manifest.json                  ← PWA manifest
│   ├── robots.txt                     ← Search engine directives
│   └── favicon.svg                    ← Browser favicon
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.astro           ← Primary, secondary, sizes
│   │   │   ├── Card.astro             ← Feature cards
│   │   │   ├── Input.astro            ← Form inputs
│   │   │   ├── Badge.astro            ← "Unique", "Signature Feature"
│   │   │   └── Select.astro           ← Dropdown select
│   │   ├── layout/
│   │   │   ├── Header.astro           ← Sticky nav, mobile menu
│   │   │   ├── Footer.astro           ← Links, branding
│   │   │   └── BaseHead.astro         ← SEO meta, fonts, scripts
│   │   ├── sections/
│   │   │   ├── Hero.astro             ← Homepage hero + waitlist
│   │   │   ├── Features.astro         ← Feature grid
│   │   │   ├── HowItWorks.astro       ← 5-step preview
│   │   │   ├── Waitlist.astro         ← Email capture form
│   │   │   ├── Comparison.astro       ← Generic comparison table
│   │   │   └── Testimonials.astro     ← Social proof (placeholder)
│   │   └── forms/
│   │       ├── WaitlistForm.astro     ← Formspree waitlist
│   │       └── ContactForm.astro      ← Formspree contact
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro           ← HTML shell + head + header + footer
│   │
│   ├── pages/
│   │   ├── index.astro                ← Homepage
│   │   ├── features/
│   │   │   ├── index.astro            ← Features overview
│   │   │   ├── adaptive-cooking.astro ← The Moat
│   │   │   ├── shared-grocery-list.astro
│   │   │   ├── pantry-ai.astro
│   │   │   └── meal-planning.astro
│   │   ├── how-it-works.astro
│   │   ├── compare.astro
│   │   ├── about.astro
│   │   ├── faq.astro
│   │   ├── contact.astro
│   │   └── 404.astro
│   │
│   ├── styles/
│   │   └── global.css                 ← Tailwind directives + custom
│   │
│   └── data/
│       ├── features.json              ← Feature card data
│       ├── faq.json                   ← FAQ Q&A pairs
│       ├── navigation.json            ← Nav structure
│       └── comparison.json            ← Compare table data
│
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## Data File Locations

All structured data is pre-built in the source of truth workspace:

| Data File | Source of Truth Location |
|-----------|------------------------|
| features.json | `04-data/features.json` |
| faq.json | `04-data/faq.json` |
| navigation.json | `04-data/navigation.json` |
| comparison.json | `04-data/comparison.json` |

Copy these into `src/data/` during the Astro build.

---

## Component Mapping

| Astro Component | Content Source |
|----------------|---------------|
| Hero.astro | `02-content/ALL-COPY.md` → Homepage → Hero |
| Features.astro | `04-data/features.json` |
| HowItWorks.astro | `04-data/features.json` → steps |
| Waitlist.astro | `SOURCE_OF_TRUTH.md` → Waitlist Configuration |
| Comparison.astro | `04-data/comparison.json` |
| FAQ page | `04-data/faq.json` |
| About page | `02-content/ALL-COPY.md` → About |
| Contact page | `02-content/ALL-COPY.md` → Contact |
