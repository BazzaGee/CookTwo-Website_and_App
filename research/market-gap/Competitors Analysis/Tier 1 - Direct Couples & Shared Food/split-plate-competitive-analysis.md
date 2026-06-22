# SplitPlate — Competitive Analysis

**Document Classification:** Internal — Strategic Intelligence
**Analyst:** Automated Competitive Intelligence Pipeline
**Date:** May 25, 2026
**Competitor Tier:** Tier 1 — Direct Overlap (Dietary Divergence)
**Threat Rating:** MEDIUM (previously rated VERY HIGH; downgraded after live-product assessment)

---

## 1. Executive Summary

SplitPlate is a live web product that solves a real and adjacent problem: adapting a single recipe into two versions for people with different dietary needs eating together. Its core innovation — "The Split Point Method" — identifies the exact moment in a cooking process where a recipe can branch into two variations. While this directly overlaps Cupla's dietary divergence feature set, SplitPlate is extremely early stage with zero distribution, no team visibility, no funding, and no mobile presence. The product works, the pricing is aggressive ($5/mo), and the concept is strong — but there is no evidence of traction, community, or growth strategy. The real risk is not SplitPlate as it exists today, but the validation it provides for a feature space Cupla must own.

---

## 2. Company Overview

| Attribute | Detail |
|---|---|
| **Product Name** | SplitPlate |
| **Tagline** | "One Meal, Two Ways" / "AI Recipe Adapter for Dietary Splits" |
| **Primary URL** | splitplate.ai (LIVE — active product) |
| **Secondary URL** | splitplate.app (503 DOWN — previously a waitlist/landing page with tagline "Cook together. Eat for your own goals.") |
| **Status** | LIVE — working AI Recipe Adapter, recipe library, meal planner, Stripe checkout |
| **Contact** | hello@splitplate.ai |
| **Copyright** | © 2026 SplitPlate |
| **Legal** | splitplate.ai/legal |
| **Founded** | Unknown — no founder, team, or location information publicly available |
| **Funding** | None found — no Crunchbase, PitchBook, SEC filings, or press mentions |
| **Headquarters** | Unknown |

---

## 3. Product Analysis

### 3.1 Core Concept: The Split Point Method

SplitPlate's central intellectual property is "The Split Point Method" — the idea that every recipe has a precise moment where a second version can branch off. Rather than cooking two entirely separate meals, the method identifies shared preparation steps and divergent finishing steps.

### 3.2 Four Adaptation Strategies

1. **Deconstructed Meals** — Separate components assembled differently per eater (e.g., a taco bar where one person loads spice and another keeps it mild).
2. **The Split Point Method** — Identify the exact step in a recipe to branch before adding certain ingredients (e.g., adding chili flakes to one portion but not the other).
3. **Parallel Prep** — Side-by-side cooking of the same base recipe with different ingredient substitutions (e.g., one pan with tofu, one with chicken).
4. **Dietary Bridges** — Shared base with divergent finishes (e.g., same curry base, one finished with coconut cream, one with a lighter broth).

### 3.3 Feature Breakdown

| Feature | Details | Gating |
|---|---|---|
| **AI Recipe Adapter** | Accepts text input, URLs, or photo upload; generates Split Point adaptations | Text: Free (unlimited), URL: 5/mo free, Photo: Premium only |
| **Recipe Library** | Pre-built recipes with pre-identified Split Points (e.g., Pesto Pasta, Spiced Chicken Tacos, Thai Green Curry) | Partially gated |
| **Weekly Meal Planner** | Plan meals for the week, likely with Split adaptations built in | Premium only (sign-in required) |
| **Servings Re-Adapt** | Adjust recipes for different calorie/macro targets per person | Premium only |
| **Saved Recipes** | Bookmark adapted recipes for future use | 5 on Free, unlimited on Premium |
| **Shopping Lists** | Auto-generated from meal plans | Likely Premium only |

### 3.4 Product Maturity Assessment

| Dimension | Rating | Notes |
|---|---|---|
| Core functionality | **Strong** | AI adapter works, recipe library is populated, meal planner exists |
| Feature completeness | **Moderate** | Has the core loop (adapt → plan → shop) but thin on social, sharing, real-time features |
| UX polish | **Unknown** | Requires hands-on testing; no screenshots, demos, or reviews available |
| Onboarding | **Unknown** | No walkthrough videos or public documentation |
| Mobile experience | **None** | Web-only, no PWA detected, no app store listings |

---

## 4. Technology Stack

| Layer | Technology | Evidence |
|---|---|---|
| **Frontend** | Client-side JavaScript web application | Source inspection |
| **CDN** | Amazon CloudFront (d2xsxph8kpxj0f.cloudfront.net) | DNS and network analysis |
| **Payments** | Stripe | Pricing page checkout flow |
| **AI/ML** | Proprietary AI for recipe parsing and Split Point identification | Product claims; specific model/provider unknown |
| **Hosting** | Unknown (CloudFront suggests AWS infrastructure) | Inferred |
| **Mobile** | None — no iOS/Android apps, no PWA | App store search and source inspection |

**Tech Assessment:** Lightweight web stack. No mobile, no real-time infrastructure, no offline capability. The AI component is proprietary but there's no indication of a defensible moat in the recipe parsing itself — this is a prompt engineering and fine-tuning problem, not a fundamental technology barrier.

---

## 5. Business Model

### 5.1 Pricing Structure

| Plan | Price | Key Limits |
|---|---|---|
| **Free** | $0/mo | Unlimited text adaptations, 5 URL adaptations/mo, no photo uploads, 5 saved recipes, no meal planner |
| **Premium** | $5/mo or $59.99/yr (~$5/mo) | Unlimited everything: adaptations, URLs, photos, saved recipes, meal planner, servings re-adapt |

### 5.2 Payment Infrastructure
- **Provider:** Stripe
- **Cancellation:** "Cancel anytime" stated on pricing page
- **Billing:** Monthly or annual

### 5.3 Revenue Model Analysis

SplitPlate uses a freemium SaaS model with an extremely low price point ($5/mo). The free tier is generous (unlimited text adaptations), which suggests the strategy is user acquisition through the AI adapter with monetization via convenience features (meal planning, photo uploads, re-adaptation). At $5/mo, the LTV per user is low, meaning high volume is required for meaningful revenue. This pricing also signals that SplitPlate is not targeting premium or relationship-oriented positioning — it's a utility play.

---

## 6. Target Audience Analysis

SplitPlate targets four primary segments:

| Segment | Use Case | Overlap with Cupla |
|---|---|---|
| **Parents & kids** | Full-flavor adult version + mild kid-friendly version | **High** — Cupla targets couples but family expansion is natural |
| **Mixed-diet couples** | One partner vegetarian/vegan, other omnivore | **Very High** — Core Cupla target audience |
| **Health/dietary goals** | Different calorie/macro targets for each eater | **Very High** — Direct overlap with Cupla's adaptive portions |
| **Spice tolerance differences** | One person wants heat, other cannot tolerate spice | **Moderate** — Cupla may address this but it's not a primary use case |

**Audience Overlap Score: 8/10** — Three of four segments directly overlap Cupla's core value proposition.

---

## 7. Market Positioning

### 7.1 Positioning Statement (Inferred)

"For households where people want to eat the same meal but need different dietary versions, SplitPlate uses AI to identify the exact point in any recipe where it can split into two variations — so you cook once but everyone gets what they need."

### 7.2 Competitive Positioning Map

| Axis | SplitPlate Position |
|---|---|
| Individual vs. Shared | **Shared** — explicitly about cooking one meal for multiple people |
| Utility vs. Relationship | **Utility** — focused on the cooking/recipe problem, not the relationship experience |
| Recipe-first vs. Pantry-first | **Recipe-first** — starts with a recipe and adapts it |
| Solo-founder vs. Funded | **Solo/Indie** — no funding, no team, no press |

### 7.3 Brand Perception

SplitPlate has zero brand presence beyond its own website. No social media accounts, no press coverage, no Product Hunt launch, no Reddit discussions, no reviews. The brand exists only within its own domain.

---

## 8. Strengths

| # | Strength | Severity to Cupla |
|---|---|---|
| S1 | **Live product with real functionality** — the AI adapter works, recipes exist, payments flow | High |
| S2 | **The Split Point Method is a strong, memorable concept** — defensible framing even if not defensible technology | Medium |
| S3 | **Extremely aggressive pricing** ($5/mo) — low barrier to trial | Medium |
| S4 | **Generous free tier** (unlimited text adaptations) — pulls users in through the core feature | Medium |
| S5 | **Direct audience overlap** — mixed-diet couples and health-goal divergences are Cupla's core segments | High |
| S6 | **Four distinct adaptation strategies** — shows depth of thinking about the dietary divergence problem | Medium |
| S7 | **Complete core loop** — adapt → save → plan → shop is functional | Medium |
| S8 | **URL domain splitplate.app already owned** — blocks easy domain acquisition by competitors | Low |

---

## 9. Weaknesses

| # | Weakness | Exploitability |
|---|---|---|
| W1 | **Zero distribution** — no social media, no press, no Product Hunt, no SEO, no reviews | Very High |
| W2 | **No mobile presence** — web-only, no apps, no PWA, no offline capability | Very High |
| W3 | **No team visibility** — no founder pages, no About page, no LinkedIn presence — trust gap | High |
| W4 | **No funding** — appears to be bootstrapped/solo, limiting runway and growth velocity | High |
| W5 | **No real-time or sync features** — utility-only, no collaborative/cooking experience | Very High |
| W6 | **No community or UGC** — recipe library is built-in only, no user-generated content | High |
| W7 | **splitplate.app is DOWN (503)** — suggests technical issues or abandoned secondary domain | Medium |
| W8 | **No search visibility** — doesn't rank for any meaningful queries beyond its own brand | Very High |
| W9 | **No reviews or social proof** — zero third-party validation anywhere on the internet | Very High |
| W10 | **Utility positioning, not relationship positioning** — solves the recipe problem but not the experience problem | High |

---

## 10. Opportunities (For SplitPlate)

| # | Opportunity | Threat to Cupla |
|---|---|---|
| O1 | Could add collaborative/cooking features to move toward relationship positioning | High |
| O2 | Could launch mobile apps and PWA for kitchen use | Medium |
| O3 | Could build user-generated recipe community | Medium |
| O4 | Could raise funding and accelerate distribution | High |
| O5 | Could integrate with grocery delivery services | Medium |
| O6 | Could partner with dietitians/nutritionists for credibility | Low |

---

## 11. Threats (To SplitPlate)

| # | Threat | Relevance to Cupla |
|---|---|---|
| T1 | **Cupla** — relationship-first positioning with real-time sync, adaptive portions, PWA/offline, pantry-first AI directly addresses every weakness | Direct |
| T2 | **Paprika 3 / AnyList** — established recipe managers could add dietary split features | Indirect |
| T3 | **General AI (ChatGPT, Gemini)** — users can ask LLMs to adapt recipes without a dedicated tool | High |
| T4 | **Meal delivery services** (Factor, Freshly) — solve dietary divergence through separate meals entirely | Indirect |
| T5 | **Low pricing limits revenue potential** — $5/mo freemium is hard to build a business on | Structural |

---

## 12. Competitive Comparison Matrix

| Dimension | SplitPlate | Cupla | Advantage |
|---|---|---|---|
| **Dietary divergence** | Core feature (Split Point Method) | Core feature (adaptive portions) | SplitPlate (deeper) |
| **Relationship positioning** | None | Relationship-first UX | Cupla |
| **Real-time sync** | None | Real-time collaborative cooking | Cupla |
| **Pantry-first AI** | No (recipe-first) | Yes | Cupla |
| **Offline / PWA** | No | Yes | Cupla |
| **Mobile apps** | No | PWA (mobile-optimized) | Cupla |
| **Meal planning** | Yes (Premium) | Yes | Tie |
| **Shopping lists** | Yes (likely Premium) | Yes | Tie |
| **Photo recipe input** | Yes (Premium) | Yes | Tie |
| **URL recipe import** | Yes (5/mo free) | Yes | Tie |
| **Social / sharing** | None | Planned | Cupla |
| **Pricing** | $0-$5/mo | TBD | SplitPlate (cheaper) |
| **Distribution** | Zero | TBD | Unknown |
| **Team / credibility** | None visible | TBD | Unknown |
| **Live product** | Yes | In development | SplitPlate |
| **Concept framing** | Strong ("Split Point Method") | TBD | SplitPlate |

---

## 13. SWOT Summary

### Strengths
- Live, functional product
- Strong conceptual framing (Split Point Method)
- Aggressive pricing with generous free tier
- Complete core feature loop
- Direct audience overlap validates market

### Weaknesses
- Zero distribution and brand awareness
- No mobile presence
- No team credibility or funding
- No real-time, sync, or collaborative features
- No search visibility or social proof
- Utility-only positioning (no relationship angle)
- splitplate.app is non-functional

### Opportunities
- Feature expansion toward relationship/cooking experiences
- Mobile app launch
- Community and UGC development
- Funding and distribution acceleration
- Grocery delivery integrations

### Threats
- Cupla's relationship-first, feature-rich approach
- General AI tools making recipe adaptation trivially easy
- Established recipe apps adding split features
- Low pricing ceiling limiting sustainability

---

## 14. Strategic Recommendations for Cupla

### 14.1 What Cupla Should Learn From SplitPlate

1. **The Split Point concept is powerful framing.** Cupla should develop its own memorable mental model for how dietary divergence works in its system. The "split point" language is intuitive and teachable.
2. **Freemium with a generous free tier works for acquisition.** Unlimited text adaptations on free is smart — it builds habit and demonstrates value before gating convenience features.
3. **Four adaptation strategies show depth.** Cupla should ensure its dietary divergence logic handles at least these four patterns: deconstructed, split point, parallel prep, and dietary bridges.

### 14.2 What Cupla Should Not Do

1. **Do not compete on price alone.** $5/mo is a race to the bottom. Cupla's value is in the relationship experience, not the utility.
2. **Do not go recipe-first.** SplitPlate starts with a recipe and adapts it. Cupla starts with the couple, their pantry, and their shared life — this is the differentiation.
3. **Do not ignore the conceptual clarity.** SplitPlate's "Split Point" is a better-named concept than anything Cupla currently has for dietary divergence. Naming matters.

### 14.3 Offensive Moves

1. **Build a superior dietary divergence engine** that goes beyond the Split Point — incorporate pantry inventory, nutritional goals, past preferences, and real-time cooking adjustments.
2. **Launch before SplitPlate gets distribution.** SplitPlate has zero visibility. Cupla has a window to establish the relationship-first food category before SplitPlate (or anyone else) claims it.
3. **Target the same keywords and use cases** in launch messaging — "cook one meal, two ways" is a powerful hook that Cupla can adopt and expand with relationship context.
4. **Engage SplitPlate's potential audience** — the mixed-diet couples searching for solutions are finding nothing. Cupla should own that search space.

### 14.4 Defensive Moves

1. **Monitor splitplate.ai for feature updates, pricing changes, and any signs of funding or distribution.**
2. **Consider acquiring splitplate.app** if it becomes available — it's currently 503 and may be abandoned.
3. **Do not let SplitPlate establish the category.** If they launch on Product Hunt or get press first, they'll own the "recipe splitting" narrative. Cupla needs to be first to market with the broader vision.

---

## 15. Risk Assessment

| Risk Factor | Level | Rationale |
|---|---|---|
| **Direct feature overlap** | **HIGH** | Split Point Method directly addresses the same dietary divergence use case |
| **Competitive response** | **LOW** | No evidence SplitPlate is aware of or responding to any competitors |
| **User acquisition race** | **LOW** | SplitPlate shows no acquisition strategy or funnel beyond organic website traffic |
| **Funding risk** | **LOW** | No funding means limited runway for aggressive moves |
| **Category ownership** | **MEDIUM** | SplitPlate has a good concept name but no brand awareness to defend it |
| **Poaching Cupla's audience** | **MEDIUM** | If Cupla is slow to launch, SplitPlate could capture early adopters in the mixed-diet couple space |
| **Technology moat** | **NONE** | AI recipe adaptation is not defensible technology; prompt engineering and fine-tuning are accessible |

**Overall Threat Level: MEDIUM**

SplitPlate validates the market need for dietary divergence in shared meals, which is valuable intelligence. But the actual competitive threat is limited by zero distribution, no mobile presence, no funding, no team visibility, and no growth strategy. The primary risk is not what SplitPlate is today, but what it could become if funded and marketed effectively.

---

## 16. Monitoring Protocol

| Signal | Frequency | Method |
|---|---|---|
| Website changes (new features, pricing, team page) | Monthly | Automated site scan and diff |
| App store listings (iOS/Android) | Monthly | App store search |
| Social media creation | Monthly | Platform search for "SplitPlate" and "splitplate" |
| Funding announcements | Monthly | Crunchbase, PitchBook, SEC EDGAR |
| Press / Product Hunt / Reddit mentions | Weekly | Google Alerts, manual search |
| SEO performance | Monthly | SERP tracking for target keywords |
| splitplate.app status | Monthly | HTTP status check |
| Domain registrations (splitplate variants) | Quarterly | WHOIS monitoring |

---

## 17. Appendix

### A. Domain Intelligence

| Domain | Status | Registrar | Notes |
|---|---|---|---|
| splitplate.ai | LIVE | Unknown | Active product |
| splitplate.app | 503 DOWN | Unknown | Previously hosted waitlist with "Cook together. Eat for your own goals." |
| splitplate.com | Unknown | — | Not checked; likely owned by different entity |
| splitplate.co | Unknown | — | Not checked |
| splitplate.io | Unknown | — | Not checked |

### B. Technology Fingerprint

| Indicator | Value |
|---|---|
| CDN | CloudFront (d2xsxph8kpxj0f.cloudfront.net) |
| JavaScript | Client-side rendering |
| Payment | Stripe |
| AI | Proprietary (model/provider unspecified) |
| Hosting | AWS (inferred from CloudFront) |
| SSL | Present |
| Mobile detection | No responsive app shell detected |
| PWA | No service worker detected |

### C. Content Intelligence

| Content Type | Status |
|---|---|
| Blog | Not detected |
| Help center / docs | Not detected |
| API / developer portal | Not detected |
| Changelog | Not detected |
| Social media (any platform) | None found |
| Press kit | None found |
| Email newsletter signup | Unknown |
| Affiliate / partner program | None found |

### D. Pre-Built Recipe Library (Detected)

1. Pesto Pasta
2. Spiced Chicken Tacos
3. Thai Green Curry

(Library likely larger; only three detected from public-facing pages)

### E. Keyword Overlap Map

| Search Intent | SplitPlate Relevance | Cupla Relevance |
|---|---|---|
| "cook one meal two diets" | High | High |
| "recipe for couples different diets" | High | High |
| "adapt recipe for dietary restrictions" | High | Medium |
| "meal planning for couples" | Medium | High |
| "cooking together app" | Low | High |
| "shared meal planner" | Medium | High |
| "AI recipe adapter" | High | Medium |

---

*This document is part of the Cupla Competitive Intelligence Archive. All assessments are based on publicly available information as of May 25, 2026. No proprietary or confidential information was accessed in the preparation of this document.*
