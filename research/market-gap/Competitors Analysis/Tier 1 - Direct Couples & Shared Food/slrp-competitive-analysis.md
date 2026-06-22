# Competitive Analysis: slrp

**URL:** https://slrp.com.au (primary), https://slrp.app (redirects/unclear)  
**Threat Level:** LOW  
**Analysis Date:** May 2026  
**Status:** ACTIVE (web + iOS, free, actively developed)

---

## 1. Executive Summary

slrp is a free meal planning app built specifically for couples who cook together. Developed in Melbourne, Australia, it offers a shared kitchen model where both partners see the same recipe library, meal plan, and grocery list in real-time. Available on web and iOS, it imports recipes from any URL via structured data extraction, generates smart grocery lists with unit conversion and aisle sorting, and includes a basic pantry feature. It is currently free with no paid tier and actively maintained with a blog and status page. slrp is the most direct positional competitor to Cupla in this analysis.

---

## 2. Product Overview

| Attribute | Detail |
|---|---|
| **Product Name** | slrp |
| **URL** | slrp.com.au |
| **Platform** | Web + iOS |
| **App Store ID** | 6766123227 |
| **Category** | Meal Planning for Couples |
| **Founded** | 2025-2026 (estimated) |
| **Status** | Active, actively developed |
| **Developer** | Small team (Melbourne, Australia) |
| **Pricing** | Free (no paid tier in 2026) |
| **Tech Stack** | Next.js (web), iOS native |

---

## 3. Core Features Analysis

### 3.1 Recipe Import (URL Parsing)
- Paste any recipe URL — slrp extracts title, ingredients, cook time, method, image
- Reads JSON-LD, microdata, RDFa structured data
- Works with BBC Good Food, NYT Cooking, Bon Appétit, RecipeTin Eats, and thousands of food blogs
- iOS Share Extension for importing from Safari, Mail, Messages
- Raw ingredient parsing: "2 cloves of garlic, finely chopped" → quantity 2, unit cloves, name garlic, prep finely chopped

### 3.2 Shared Kitchen Model
- Both partners share one "kitchen" — not one owner + one guest
- Same recipe library, same plan, same grocery list
- Real-time sync — when one partner ticks off items, the other sees it instantly
- The kitchen is the unit, not the user

### 3.3 Weekly Meal Planner
- Flexible grid (not rigid 7-day)
- Plan breakfast, lunch, dinner, snacks
- Placeholder slots: "eat out," "leftovers"
- Drag-and-drop recipe placement
- Recipes can be moved, repeated, or replaced

### 3.4 Smart Grocery Lists
- Ingredients merge across recipes
- Unit conversion (½ cup + 4 tbsp → ¾ cup)
- Duplicates collapse
- Aisle-sorted organization
- Real-time sync between partners

### 3.5 Pantry Tracking
- Set staples you always have (olive oil, salt, etc.)
- slrp removes pantry items from grocery list
- Basic staple tracking only — not full inventory

### 3.6 Cook Mode
- Big text, step-by-step instructions
- Screen-stays-awake
- No ads

---

## 4. User Experience Assessment

- **Onboarding:** Sign in with Google/Apple, start in under 60 seconds
- **Design:** Clean, warm, copywriting is witty and relationship-aware ("Whether garlic goes in everything (it does)")
- **Usability:** Strong — clear workflow from URL → plan → list → cook
- **Relationship-First UX:** YES — genuinely designed for two-cook households, not bolted on. The shared kitchen model is the product's core architecture.
- **Depth:** Good for planning and grocery — limited on AI, pantry depth, and nutritional intelligence

---

## 5. Technology Stack

- **Frontend:** Next.js (web) — evidenced by `/_next/image` URLs
- **Backend:** Not disclosed
- **Mobile:** iOS native app + responsive web
- **PWA/Offline:** Not advertised
- **AI Integration:** Minimal — structured data extraction, not generative AI
- **Real-time Sync:** Yes — core architecture
- **Status Page:** status.slrp.com.au (indicates operational seriousness)
- **Analytics:** PostHog + Microsoft Clarity (anonymous usage)

---

## 6. Business Model

| Revenue Stream | Details |
|---|---|
| Free | No credit card, no trial, no paid tier |
| Premium | Not yet available — "Free in 2026 with no paid tier" |

**Assessment:** Currently zero revenue. The FAQ explicitly states "Free in 2026 with no paid tier." This suggests a land-grab strategy — build user base first, monetize later. The risk is that free users become accustomed to free and resist future pricing.

---

## 7. Target Audience

- Couples who cook together (2-person households)
- Users who want to import recipes from the web (not use a built-in recipe database)
- People who want shared grocery lists
- Australians (primary market — .com.au domain, references to NSW Love Food Hate Waste program)

---

## 8. Market Position

- **Niche:** Meal planning for couples (the most direct Cupla competitor)
- **Differentiation:** Shared kitchen model, URL recipe import, free
- **Brand Recognition:** Low but growing — active blog, SEO content
- **Market Share:** Small but targeted
- **SEO/Marketing:** Active blog with meal planning content, "Best Meal Planning Apps for Couples 2026" comparison article (positions slrp as #1 for couples)

---

## 9. Strengths

| Strength | Impact |
|---|---|
| Shared kitchen architecture | Genuinely built for two people — not an afterthought |
| Real-time grocery sync | Both partners see updates instantly |
| Recipe URL import | Works with thousands of sites |
| Smart grocery list (unit conversion, aisle sort) | Best-in-class grocery list generation |
| Free | Zero friction to adoption |
| Active development | Blog, status page, regular updates |
| Witty, relationship-aware copy | Brand voice aligns with target audience |
| Cook mode | Practical kitchen feature |

---

## 10. Weaknesses

| Weakness | Impact |
|---|---|
| No revenue model | Unsustainable long-term; land-grab with unclear monetization |
| No AI features | Structured data extraction only — no generative AI, no smart suggestions |
| No pantry-first AI | Pantry is basic staple tracking, not intelligent inventory |
| No adaptive portions | Recipes are fixed for "two" |
| No Android app | Only iOS + web |
| No PWA/offline | Must be online |
- **No nutritional intelligence** | No calorie/macro tracking |
- **Australian focus** | May limit global appeal |
- **No meal suggestions** | Only imports user-pasted recipes — doesn't suggest new ones |
- **Solo/small team** | Limited development bandwidth |

---

## 11. Feature Comparison: slrp vs Cupla

| Feature | slrp | Cupla |
|---|:---:|:---:|
| Couples / shared kitchen | Yes (core architecture) | Yes (relationship-first UX) |
| Real-time sync | Yes (grocery list) | Yes (full system) |
| Recipe import (URL) | Yes (strong) | Potential |
| Recipe library | Yes (imported) | Yes |
| Meal planning | Yes (flexible weekly) | Yes |
| Smart grocery list | Yes (unit conversion, aisle sort) | Yes |
| Pantry management | Basic (staples only) | Yes (pantry-first AI) |
| AI recipe suggestions | No | Yes |
| AI pantry intelligence | No | Yes |
| Adaptive portions | No | Yes |
| PWA | No | Yes |
| Offline support | No | Yes |
| Web platform | Yes | Yes |
| Mobile app | iOS only | Yes (PWA) |
| Android | No | Yes (PWA) |
| Cook mode | Yes | Potential |
| Nutritional info | No | Potential |
| Price | Free | TBD |

---

## 12. SWOT Analysis

### Strengths
- Most direct positional competitor to Cupla
- Genuine shared kitchen model
- Excellent grocery list intelligence
- Free with strong UX
- Active development and content

### Weaknesses
- No AI features — no generative intelligence
- No revenue model
- No adaptive portions
- Basic pantry only
- iOS-only mobile
- Australian-centric

### Opportunities
- AI integration would make it significantly stronger
- Paid tier introduction could fund growth
- Android/PWA would expand reach
- Pantry expansion into full inventory

### Threats
- Cupla's pantry-first AI is a generation ahead
- Free model may train users to expect free
- Larger meal planning apps could add shared kitchen features
- No moat beyond the shared kitchen concept

---

## 13. Pricing Analysis

| Plan | Price | Features |
|---|---|---|
| Free | $0 | Full feature set — everything is free in 2026 |

**Assessment:** Completely free with no paid tier. This is a deliberate land-grab strategy. The FAQ says "Free in 2026 with no paid tier" — implying pricing may come later. The risk is significant: free users resist conversion, and the cost of running the service (infrastructure, development) must eventually be covered.

---

## 14. User Reviews & Sentiment

- **App Store:** Listed but review data not visible in research
- **Website testimonials:** None displayed
- **Blog:** Active — "Best Meal Planning Apps for Couples 2026" positions slrp favorably
- **User sentiment:** Cannot be quantified but blog content suggests engaged early adopters
- **Social proof:** Referenced in their own comparison article as top pick for couples

---

## 15. Competitive Positioning Matrix

| Dimension | slrp | Cupla |
|---|---|---|
| Primary focus | Couples meal planning | Couples food system |
| Couples differentiation | Shared kitchen model | Relationship-first UX + real-time sync |
| AI capability | None | Core (pantry-first AI) |
| Platform breadth | Web + iOS | PWA (all platforms) |
| Offline | No | Yes |
| Grocery list quality | Excellent (unit conversion) | Strong |
| Pantry approach | Basic staples | Full AI-powered inventory |
| Recipe source | URL import only | Import + AI suggestions |
| Price | Free | TBD |

---

## 16. Strategic Threat Assessment

| Factor | Score (1-10) | Notes |
|---|:---:|---|
| Feature overlap with Cupla | 6/10 | Shared kitchen, meal planning, grocery — most overlap |
| User base overlap | 5/10 | Same target audience (couples who cook) |
| Brand awareness | 3/10 | Low but growing via content |
| Technical capability | 5/10 | Well-built, structured data extraction is solid |
| Growth trajectory | 4/10 | Active but free model limits resources |
| Innovation pace | 3/10 | Incremental, no AI integration |
| **Overall threat** | **4/10** | **LOW-MEDIUM** (highest in this batch) |

---

## 17. Key Takeaways & Recommendations for Cupla

1. **Most direct competitor.** slrp is the only product in this analysis that directly targets the same user (couples who cook together) with a similar feature set. Cupla must clearly differentiate.

2. **Shared kitchen model is good — but Cupla goes further.** slrp's "kitchen as the unit" is the right architecture. Cupla should match this but layer on pantry-first AI and relationship intelligence.

3. **AI is the gap slrp cannot easily close.** slrp has no generative AI — no smart recipe suggestions, no pantry intelligence, no adaptive portions. Cupla's AI layer is a fundamental architectural advantage.

4. **Free model is a temporary advantage.** slrp being free drives adoption but cannot sustain indefinitely. When slrp introduces pricing, Cupla must have enough differentiated value to justify its price.

5. **Pantry-first AI is Cupla's killer differentiator.** slrp's pantry is basic staple tracking. Cupla's AI-powered pantry that suggests recipes, tracks inventory, and adapts portions is a generation ahead.

6. **Adaptive portions matter.** slrp assumes "for two" always. Couples have different appetites, schedules, and preferences. Cupla's adaptive portions address a real need slrp ignores.

7. **PWA + offline is a platform advantage.** slrp requires internet and iOS. Cupla's PWA works everywhere, including offline in the kitchen and at the grocery store.

8. **Lesson for Cupla:** slrp proves the shared kitchen model works and resonates with couples. Cupla should adopt the "kitchen as the unit" architecture but build AI intelligence and relationship UX on top. The grocery list unit conversion feature is worth replicating.
