# Yummo.ai — Competitive Analysis

**Last Updated:** May 2026  
**Analyst:** Cupla Competitive Intelligence  
**Classification:** Internal — Confidential

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Company Profile](#2-company-profile)
3. [Product Overview](#3-product-overview)
4. [Pricing Model](#4-pricing-model)
5. [User Flow](#5-user-flow)
6. [Feature Deep-Dive](#6-feature-deep-dive)
7. [Adaptive Portions Mechanism](#7-adaptive-portions-mechanism)
8. [Profile & Data Model](#8-profile--data-model)
9. [Tech Stack](#9-tech-stack)
10. [AI Architecture](#10-ai-architecture)
11. [Legal & Compliance](#11-legal--compliance)
12. [Content & Marketing](#12-content--marketing)
13. [Gap Analysis: Yummo vs Cupla](#13-gap-analysis-yummo-vs-cupla)
14. [What Yummo Does Well](#14-what-yummo-does-well)
15. [What Yummo Lacks](#15-what-yummo-lacks)
16. [Threat Assessment](#16-threat-assessment)
17. [Strategic Recommendations for Cupla](#17-strategic-recommendations-for-cupla)

---

## 1. Executive Summary

Yummo.ai is a Polish sole-proprietor startup that has independently arrived at nearly the same core concept as Cupla: adaptive shared cooking for couples with different calorie needs. Their tagline — "One cooking session, two plates tailored to each of you" — is functionally identical to Cupla's "one prep, two plates" moat.

**Threat Level: VERY HIGH**

Yummo proves market demand for adaptive portions. They are live, have AI meal generation, and charge $9.99/month. However, they lack real-time collaboration, relationship-first UX, pantry-first AI, shared grocery list sync, offline support, and are not a PWA. Their operation is a solo founder with no app store presence detected, an empty blog, and EU-only infrastructure focus.

**Key Takeaway:** Yummo is the single most dangerous competitor because they own the same conceptual territory. Cupla's moat now depends entirely on execution speed — shipping real-time sync, relationship UX, and pantry-first AI before Yummo can close those gaps (estimated 6-12 months).

---

## 2. Company Profile

| Attribute | Detail |
|---|---|
| **Name** | Yummo |
| **URL** | https://yummo.ai |
| **Founder** | Wiktor Strzelczyk |
| **Co-founder (named in testimonial)** | Natalia (partner) |
| **Legal Structure** | Sole proprietorship (CEIDG registered) |
| **Registered Address** | ul. Stanisławowska 47, 54-611 Wrocław, Poland |
| **Tax ID (NIP)** | 7692137634 |
| **REGON** | 385207659 |
| **Contact (General)** | contact@yummo.ai |
| **Contact (Support)** | support@yummo.ai |
| **Contact (Privacy)** | privacy@yummo.ai |
| **Funding** | Unknown — appears bootstrapped (no investor mentions in terms/privacy) |
| **Team Size** | Appears to be solo founder + partner (no team page, no job listings found) |
| **Status** | Live, actively operating |
| **Languages** | English (yummo.ai/en), Polish (yummo.ai/pl) |
| **App Store Presence** | Not found on App Store or Google Play as of May 2026 — likely web-only |

---

## 3. Product Overview

### Tagline

> "One cooking session — two plates tailored to each of you."

### The Problem They Solve

Three pain points articulated on their homepage:

1. **Manual macro counting is a nightmare** — Different portions for each partner, recalculating at every meal, every day.
2. **Meal delivery is an expensive compromise** — $600/month for two people, fixed packages, reheated food, half ends up in the bin.
3. **Couples just want to cook what they love** — Homemade food, but with portions matched to both people's calories. One cook, two plates.

### The Solution

AI generates a shared recipe with a common base (rice, sauce, vegetables) but different proteins and portion sizes for each person. The user cooks once; each person plates their own pre-calculated portion. The app "already did the math."

### Target Audience

- Couples with different calorie needs (e.g., 1600 kcal vs 2500 kcal)
- Couples with different dietary preferences (e.g., she's vegetarian, he eats meat)
- Households of 1-5 people with varying nutrition goals
- People currently using meal delivery services who want to cook at home
- People currently manually calculating macros for multiple people

### Competitor Positioning

They explicitly position against:
- Manual macro counting (spreadsheets, calculators)
- Meal delivery services (HelloFresh, Factor, etc.) — framed as $600/mo waste

---

## 4. Pricing Model

| Plan | Price | Billing | Notes |
|---|---|---|---|
| **Free** | $0 | — | Limited functionality (exact limits not disclosed) |
| **Premium (Monthly)** | $9.99/mo | Auto-renews | Full access |
| **Premium (Annual)** | Not publicly listed | Auto-renews | Presumably discounted (not shown on pricing page) |

### Pricing Details (from Terms of Service)

- Prices shown include VAT for EU users
- Auto-renews at end of each billing period
- Reminder email sent before renewal
- Cancel anytime in account settings ("as simple as purchase")
- Retain premium access until end of paid period after cancellation
- EU/UK users: 14-day right of withdrawal (expires if premium used within that period)
- No refunds for partially used subscription periods outside withdrawal window
- No credit card required to start (free plan)

### Competitive Price Framing

They benchmark against meal delivery:

| | Meal Delivery | Yummo |
|---|---|---|
| Cost (2 people) | ~$600/mo | ~$350 (groceries) + $9.99 (app) |
| Macro customization | Fixed packages | Portions tailored to each person |
| Taste | Reheated | Fresh, home-cooked |
| Flexibility | Eat what they send | Cook what you love |

---

## 5. User Flow

### Onboarding (3 Steps)

**Step 1: Set Up Profiles**
- Enter your calorie goal and preferences
- Add your partner (or household members, up to 5)
- Each person has their own independent calorie target and diet style
- No credit card required

**Step 2: Get Your Plan**
- AI generates a full weekly meal plan
- Recipes, portions, and calories — all tailored to each person
- Plan + shopping list generated in ~2 minutes (per homepage claim)

**Step 3: Cook Once, Plate Your Own**
- One person cooks a single recipe
- Each person plates their own pre-calculated portion
- Different portion sizes, different proteins if needed
- The app "already did the math"

### Ongoing Usage

- Browse/swipe through generated weekly plan
- Swap recipes or regenerate
- View shopping list (auto-generated from plan)
- Cook from recipe instructions
- Track against calorie/macro goals
- Sync with MyFitnessPal (confirmed)

### Login

- Email/password or Google OAuth (Firebase)
- "Log in" button in top nav

---

## 6. Feature Deep-Dive

### 6.1 Adaptive Portions (Core Feature)

- One recipe generates two (or more) portion variants
- Shared base ingredients (grains, sauces, vegetables) with different quantities
- Separate protein source per person (e.g., tofu for vegetarian partner, chicken for meat-eater)
- Every portion shows exact calories and macros
- Supports 1-5 people per household

### 6.2 AI Meal Generation

- Weekly meal plans auto-generated by AI
- Takes into account: calorie targets, macro distribution, diet style, allergies, excluded ingredients, health goals
- "Plan + shopping list in 2 minutes"
- Users can regenerate or swap individual meals

### 6.3 Shopping List

- Auto-generated from the weekly meal plan
- Consolidates ingredients across multiple recipes
- Cross-recipe ingredient sharing to reduce waste (e.g., buy one cabbage, use in 3 recipes)
- Not confirmed as collaboratively synced between partners

### 6.4 Diet Style Support

Supported diet styles:
- Standard
- Vegetarian
- Vegan
- Pescatarian
- Paleo
- Mediterranean

### 6.5 Allergen Filtering

- 40+ allergen/intolerance categories
- Includes all top 14 EU allergens (mandatory declaration)
- Filter applied at profile level
- Terms of Service explicitly state filtering "does NOT guarantee 100% effectiveness"
- Users must always verify product labels

### 6.6 Custom Recipes

- Users can create their own recipes
- Recipes include: name, description, ingredients, steps, variants, storage instructions
- User-created recipes remain user's property
- Yummo does not use user recipes to train AI

### 6.7 MyFitnessPal Integration

- Confirmed in FAQ: "Does it work with MyFitnessPal?" — Yes
- Likely via calorie/macro export

### 6.8 Health Goals (Beyond Calories)

Supported health goals:
- Weight loss
- Weight maintenance
- Muscle building
- Heart health
- Immune support
- Endurance
- Recovery

### 6.9 Multi-Person Household Support

- 1-5 people per account
- Each person has independent profile: calorie target, macro split, diet style, allergies, excluded ingredients
- Household member profiles use only a nickname (no email/name/identifying info required)

### 6.10 Nutritional Information

- Per-recipe: calories, macronutrients (protein, carbs, fat)
- Nutritional values based on USDA database
- Terms state: "estimates based on USDA database data. Actual values may vary depending on manufacturer, preparation method, and portion size"

---

## 7. Adaptive Portions Mechanism

### How It Works

The system takes a single recipe and creates per-person variants by:

1. **Keeping a shared base** — Common ingredients like grains, sauces, vegetables
2. **Scaling base quantities** — Larger portions for the higher-calorie person
3. **Swapping protein sources** — Different proteins per person's diet (e.g., tofu vs chicken)
4. **Calculating exact macros** — Each variant shows total kcal + protein

### Live Example from Homepage: Vegetable Curry

| Component | Natalia (1,600 kcal target) | Wiktor (2,500 kcal target) |
|---|---|---|
| Basmati rice | 120g | Larger portion |
| Curry sauce | 130g | Larger portion |
| Veggies | 100g | Larger portion |
| Tofu (protein) | 120g | Different/larger protein |
| **Total** | **500 kcal, 22g protein** | **Higher kcal + protein** |

### Key Design Decisions

- Same cooking session — one person cooks, not two separate meals
- "Shared base, separate protein — everyone plates their own portions"
- The calorie differential can be significant: 900 kcal gap (1600 vs 2500)
- Diet differences handled: "She's veggie, he eats meat — one cook, separate proteins"

---

## 8. Profile & Data Model

### 8.1 Data Collected Per Profile

**Biometric Data (Special Category — GDPR Art. 9):**
- Date of birth
- Biological sex
- Height
- Weight
- Physical activity level

**Nutrition Targets:**
- Target calories (daily)
- Macronutrient distribution (protein %, carbs %, fat %)

**Dietary Preferences:**
- Diet style (standard, vegetarian, vegan, pescatarian, paleo, Mediterranean)
- Allergies and food intolerances (40+ categories)
- Excluded ingredients (free text)
- Dietary notes (free text)

**Health Goals:**
- Weight loss / maintenance / muscle building
- Specific health goals (heart health, immune support, endurance, recovery)

### 8.2 Household Member Profiles

- Created within a single account
- No identifying data required — only a nickname (e.g., "Partner", "Mom", "Jake")
- No email, phone, or full name asked
- Dietary/biometric data processed solely for meal planning
- Data cannot be used to identify the household member

### 8.3 Account-Level Data

- Email address
- Name
- Profile picture (if Google sign-in)
- Language, country, measurement system (metric/imperial)
- Recipes created by user
- Meal plans (schedule, recipe assignments, cooking groups)
- Shopping lists

### 8.4 Data NOT Sent to AI

Critically, the following data never reaches the AI layer:
- Name, email
- Health data, allergies
- Weight, height
- Any identifying information
- Profiles identified only by anonymous UUIDs

---

## 9. Tech Stack

| Component | Technology | Details |
|---|---|---|
| **Frontend** | Next.js | Evidenced by `/_next/` URL paths |
| **Hosting** | AWS | EU region (Frankfurt, Germany) |
| **AI / Recipe Generation** | AWS Bedrock | EU region (Frankfurt), zero data retention |
| **Authentication** | Firebase (Google) | OAuth + email/password, EU-US DPF certified |
| **Payments** | Stripe | Stripe Payments Europe, Ltd. (Ireland), EU-US DPF certified |
| **Analytics (optional)** | Google Analytics | Consent-based, EU-US DPF certified |
| **Behavioral Analytics** | Microsoft Clarity | Session recordings, heatmaps, clicks, on-site behavior — consent-based |
| **Data Residency** | EU (Frankfurt) | All data stays in European Union |
| **Encryption** | HTTPS/TLS in transit, encrypted at rest |
| **Password Storage** | bcrypt hashing |
| **Session Tokens** | Limited lifetime (7 days) |
| **Measurement Systems** | Metric and Imperial supported |

### Infrastructure Notes

- All data processing within EU — no US data transfer for core functionality
- Firebase and Stripe use EU-US Data Privacy Framework certifications
- AWS Bedrock has zero data retention (prompts/responses not stored)
- Solo operation — no evidence of dev team beyond founder

---

## 10. AI Architecture

### What AI Receives

| Data Type | Sent to AI? |
|---|---|
| User's text prompts (e.g., "light chicken lunch recipe") | Yes |
| Ingredient catalog (names, categories, units) | Yes |
| User's name, email | No |
| Health data, allergies | No |
| Weight, height, biometrics | No |
| Profile identifiers | No (only anonymous UUIDs) |

### AI Processing Details

- **Provider:** AWS Bedrock
- **Region:** EU (Frankfurt, Germany)
- **Data Retention:** Zero — prompts and responses are not stored
- **Personal Data:** None sent to AI
- **Privacy note in ToS:** "AI does not account for all possible interactions between ingredients, medications, or individual bodily reactions"

### AI Limitations (Disclosed by Yummo)

- AI-generated content is "suggestions" — accuracy not guaranteed
- AI may contain errors in ingredient selection
- AI does not account for medication interactions
- Users accept limitations of AI technology
- Health disclaimer: "Yummo is NOT a medical, dietary, or therapeutic application"

---

## 11. Legal & Compliance

### 11.1 Health Disclaimer

- Explicitly NOT a medical, dietary, or therapeutic application
- Not a medical device under medical device regulations
- Recipes are "culinary suggestions" — not medical/dietary advice
- Nutritional values are estimates (USDA-based)
- Recommends consulting doctor/dietitian for health conditions

### 11.2 Allergen Liability

- Allergen filtering "does NOT guarantee 100% effectiveness"
- Processed foods may contain trace allergens not listed
- AI recipes may contain ingredient selection errors
- Users must always verify product labels
- Yummo not liable for allergic reactions

### 11.3 GDPR Compliance (EU)

- Explicit consent for health data processing (Art. 9(2)(a))
- Contract performance for account/recipe data (Art. 6(1)(b))
- Legitimate interest for security/logs (Art. 6(1)(f))
- All providers bound by DPAs (Art. 28)
- Data breach notification to UODO within 72 hours
- Full data subject rights (access, rectification, erasure, portability, restriction, objection)
- 30-day response time for data requests

### 11.4 International Compliance

| Region | Regulation | Status |
|---|---|---|
| EU | GDPR | Full compliance |
| UK | UK GDPR + DPA 2018 | Adequacy decision for EU-UK transfers |
| USA (California) | CCPA/CPRA | Right to know, delete, opt-out (no data sold) |
| Canada | PIPEDA | Consent-based collection, access/correction rights |
| Australia | Privacy Act 1988 + APPs | Health information obligations regardless of revenue |
| Other countries | GDPR standard applied | Minimum protection level regardless of location |

### 11.5 Subscription Rights (EU/UK)

- 14-day right of withdrawal from digital purchases
- Right expires if premium service used within 14 days (with consent)
- Contact: support@yummo.ai for withdrawal

### 11.6 Data Retention

| Data Type | Retention |
|---|---|
| Account data + content | Duration of service use |
| After account deletion | 30 days |
| Backups | 90 days after deletion |
| Payment data | Per Stripe's retention policy |
| Server logs (IP, user agent) | Maximum 90 days |
| Anonymized data | Indefinite (cannot identify) |

### 11.7 Governing Law

- Polish law (subject to mandatory consumer protections in user's country)
- EU users: can file via EC ODR platform
- Non-EU users: disputes in Wrocław, Poland courts

---

## 12. Content & Marketing

### 12.1 Website Structure

| Page | URL | Status |
|---|---|---|
| Homepage (EN) | yummo.ai/en | Live |
| Homepage (PL) | yummo.ai/pl | Live |
| Blog | yummo.ai/en/blog | **Empty** — "No articles found in this category" |
| Privacy Policy | yummo.ai/en/privacy | Live (comprehensive) |
| Terms of Service | yummo.ai/en/terms | Live (comprehensive) |
| Cookie Policy | yummo.ai/en/cookies | Live |
| FAQ | yummo.ai/en#faq | Live (on homepage) |
| How It Works | yummo.ai/en#how-it-works | Live (on homepage) |
| Pricing page | Not found as separate URL | Likely in-app or on homepage |

### 12.2 Blog — "Kitchen Intelligence"

- Section header exists: "Tips, strategies and inspiration from Yummo experts"
- **Zero articles published** as of May 2026
- No content marketing pipeline detected
- Missed SEO opportunity

### 12.3 Social Media

- No social media links found on website
- No detected Instagram, Twitter/X, Facebook, or TikTok presence
- No App Store or Google Play listing found

### 12.4 SEO & Discoverability

- Clean next.js site with proper meta tags
- Multilingual (EN + PL)
- Limited backlink profile likely (new/small operation)
- No detected PR coverage or press mentions

### 12.5 Homepage Copy Analysis

**Headlines:**
- "Meal plans for couples"
- "One cooking session — two plates tailored to each of you"
- "No more calculator at every meal"

**Social Proof:**
- Single founder testimonial (Wiktor + Natalia story)
- No user reviews, testimonials, or case studies

**CTAs:**
- "See how it works" (anchor link)
- "Create a free plan" (primary CTA)
- "No credit card · Works immediately" (trust signal)

**Competitor Framing:**
- Direct comparison table vs meal delivery services
- No mention of competing apps (AnyList, Mealime, etc.)

---

## 13. Gap Analysis: Yummo vs Cupla

### 13.1 Feature-by-Feature Matrix

| Capability | Yummo | Cupla | Advantage |
|---|:---:|:---:|---|
| **Couple-first UX** | No | Yes | Cupla |
| **Real-time sync** | No | Yes (DO + WebSocket) | Cupla |
| **AI meal generation** | Yes | Yes | Tie |
| **Multi-diet adaptation** | Yes | Yes | Tie |
| **Adaptive shared cooking** | Yes | Yes | Tie |
| **Body-specific portions** | Yes | Yes (AI-driven) | Tie |
| **Pantry-first AI** | No | Yes | Cupla |
| **Relationship-first UX ("we" framing)** | No | Yes | Cupla |
| **Grocery list sync** | No (basic, not collaborative) | Yes | Cupla |
| **Offline support** | No | Yes (full PWA) | Cupla |
| **PWA (no app store)** | No (likely web-only) | Yes | Cupla |
| **TDEE calculation** | No (manual calorie entry) | Yes | Cupla |
| **Household profiles** | Yes (1-5 people) | Yes | Tie |
| **Custom recipes** | Yes | Yes | Tie |
| **Allergen filtering** | Yes (40+ categories) | Yes | Tie |
| **Diet style support** | Yes (6 styles) | Yes | Tie |
| **MyFitnessPal integration** | Yes | ? | Yummo |
| **Nutritional data source** | USDA | ? | Unknown |
| **Multi-language** | Yes (EN, PL) | ? | Yummo |
| **App Store presence** | Not detected | Planned (PWA) | Different approach |
| **Blog / Content** | Empty | ? | Unknown |
| **Social media** | Not detected | ? | Unknown |
| **Pricing** | $9.99/mo | TBD | TBD |

### 13.2 Feature Overlap Score

**Shared features (ties):** 7  
**Cupla-only features:** 8  
**Yummo-only features:** 2 (MFP integration confirmed, multi-language confirmed)

**Overlap: ~47%** of catalogued features are shared. Cupla leads on collaboration/UX/pantry features. Yummo leads on integrations and localization.

---

## 14. What Yummo Does Well

### 14.1 Core Concept Execution

- The "one cook, two plates" concept is clearly communicated and well-executed
- Homepage example (vegetable curry) is compelling and immediately understandable
- The calorie differential messaging (1600 vs 2500) is a strong hook

### 14.2 Technical Foundation

- Clean, modern Next.js web app
- EU-based infrastructure with strong data residency (Frankfurt)
- AWS Bedrock with zero data retention — privacy-conscious AI
- Proper GDPR Art. 9 handling for health data
- Firebase auth with 7-day session tokens
- Stripe payments with EU entity

### 14.3 Privacy & Trust

- Extremely thorough privacy policy (covers GDPR, CCPA, PIPEDA, Australian Privacy Act, UK GDPR)
- Transparent about AI limitations and health disclaimers
- Clear that personal/health data never reaches AI
- Anonymous UUIDs for AI processing
- Explicit consent flows for health data

### 14.4 Pricing Simplicity

- $9.99/month is a compelling price point vs $600/month meal delivery
- Free plan available (no credit card)
- Simple cancellation ("as simple as purchase")
- Clear value framing

### 14.5 Solo Founder Efficiency

- Comprehensive legal docs (likely AI-assisted or templated)
- Functional product shipped with minimal resources
- Proves the concept can be built and monetized by a single person

---

## 15. What Yummo Lacks

### 15.1 Real-Time Collaboration (CRITICAL GAP)

- No real-time sync between partners
- No WebSocket or live editing
- Partners cannot collaboratively build/edit a meal plan
- This is Cupla's primary differentiator

### 15.2 Relationship-First UX

- No "we" framing or emotional design language
- Clinical/functional interface
- No relationship psychology or bonding elements
- No couples-oriented features (date night, cooking together moments)
- This is Cupla's secondary differentiator

### 15.3 Pantry-First AI

- Does not start from what users already have at home
- No ingredient inventory tracking
- No "use what you have" meal suggestions
- Shopping list exists but isn't pantry-driven
- This is Cupla's tertiary differentiator

### 15.4 Collaborative Grocery List

- Shopping list exists but isn't confirmed as collaboratively synced
- No real-time grocery list editing between partners
- No "add item" notifications

### 15.5 Offline Support

- Requires internet connection
- No offline meal plan access
- No offline recipe viewing

### 15.6 PWA / Platform Strategy

- Not a PWA (no "add to home screen" progressive web app)
- No detected App Store or Google Play listing
- Likely web-only, which limits mobile engagement

### 15.7 TDEE / Body Composition

- Users must manually enter their calorie targets
- No automatic TDEE (Total Daily Energy Expenditure) calculation
- No body composition inputs beyond height/weight

### 15.8 Content Marketing

- Blog is completely empty ("No articles found")
- No social media presence detected
- No SEO content strategy
- No email newsletter detected
- Missing organic discovery channel

### 15.9 Social Proof & Community

- Only one testimonial (the founder's own story)
- No user reviews, ratings, or case studies
- No community features
- No referral program

### 15.10 Operational Scalability

- Solo founder — single point of failure
- No team, no funding mentioned
- Limited capacity for rapid feature development
- Customer support via email only (support@yummo.ai)

---

## 16. Threat Assessment

### 16.1 Current Threat Level: VERY HIGH

| Factor | Assessment |
|---|---|
| **Conceptual overlap** | Near-identical "one cook, two plates" positioning |
| **Live product** | Shipping and monetizing ($9.99/mo) |
| **AI meal generation** | Functional — AWS Bedrock powered |
| **Adaptive portions** | Core feature working as advertised |
| **Market proof** | Validates demand for this concept |
| **Pricing** | Competitive ($9.99/mo vs meal delivery) |

### 16.2 Risk Scenarios

| Scenario | Probability | Impact | Timeline |
|---|---|---|---|
| Yummo adds real-time collaboration | Medium | **Critical** | 6-12 months |
| Yummo adds pantry tracking | Low | High | 12-18 months |
| Yummo adds relationship UX | Low | High | 12-18 months |
| Yummo gets funding and scales | Medium | High | Unknown |
| Yummo launches on app stores | High | Medium | 3-6 months |
| Yummo builds content/SEO | High | Medium | 3-6 months |
| Yummo adds MFP-style macro tracking | Medium | Medium | 6-12 months |
| Yummo expands to US market | Medium | High | 6-12 months |

### 16.3 What Happens If Yummo Adds Real-Time Sync

If Yummo closes the collaboration gap, Cupla's primary differentiator narrows to:
- Relationship-first UX (softer differentiator — easier to copy)
- Pantry-first AI (moderate differentiator — requires more engineering)
- PWA + offline (technical differentiator — moderate value)

**This is the doomsday scenario.** Cupla must ship real-time sync before Yummo does.

### 16.4 Defensive Moat Strength

```
Current Cupla Moat Components (by defensibility):

1. Real-time sync (WebSocket + Durable Objects)  ██████████ HIGH
2. Pantry-first AI                              ████████░░ HIGH  
3. Relationship-first UX ("we" framing)          ██████░░░░ MEDIUM
4. PWA + offline support                         ████░░░░░░ LOW-MED
5. Cloudflare-native architecture                ████░░░░░░ LOW-MED
```

---

## 17. Strategic Recommendations for Cupla

### 17.1 Immediate Priorities (0-3 months)

1. **Ship real-time sync as #1 feature** — This is the single most important differentiator. Yummo will add this within 6-12 months. Cupla must be first.

2. **Own the "cooking together" narrative** — Yummo's copy is functional ("one cook, two plates"). Cupla should own the emotional angle ("we cook together"). This is harder to replicate than a feature.

3. **Launch pantry-first AI before Yummo adds pantry tracking** — Pantry inventory as the starting point for meal generation is a meaningful UX differentiator that requires architectural commitment.

### 17.2 Medium-Term Actions (3-6 months)

4. **Build content moat** — Yummo's blog is empty. Cupla should publish aggressively on couples cooking, nutrition science for relationships, adaptive meal planning. Own the SEO for "couples meal planning" and related terms.

5. **Social proof acceleration** — Yummo has zero reviews/testimonials beyond the founder. Cupla should collect user stories, before/after narratives, and couple testimonials early.

6. **App store presence** — Yummo has no detected app store listing. Cupla's PWA strategy is different, but consider whether a store listing drives discovery for the target audience.

### 17.3 Long-Term Defenses (6-12 months)

7. **Build community features** — Neither app has community. Couples sharing meal plans, recipe collections, and cooking experiences creates network effects and switching costs.

8. **Referral program** — Couples who cook together talk to other couples. Built-in referral mechanics could drive organic growth that Yummo (solo founder) cannot match.

9. **Integration ecosystem** — Yummo has MyFitnessPal. Cupla should match this and add more: Apple Health, Google Fit, grocery delivery APIs, smart kitchen devices.

10. **International expansion before Yummo** — Yummo is EU-focused with EN/PL only. If Cupla targets US, UK, AUS markets first, it can establish presence before Yummo expands.

### 17.4 Monitoring Protocol

Track these Yummo signals monthly:
- New features added (especially real-time sync, pantry tracking)
- App store launches (iOS/Android)
- Blog content publication
- Social media activation
- Pricing changes
- Funding announcements
- Team growth (job listings)
- US market expansion
- New language support
- User review volume/ratings

---

## Appendix A: Source URLs

| Source | URL |
|---|---|
| Homepage (EN) | https://yummo.ai/en |
| Homepage (PL) | https://yummo.ai |
| Blog | https://yummo.ai/en/blog |
| Privacy Policy | https://yummo.ai/en/privacy |
| Terms of Service | https://yummo.ai/en/terms |
| Cookie Policy | https://yummo.ai/en/cookies |
| FAQ | https://yummo.ai/en#faq |
| How It Works | https://yummo.ai/en#how-it-works |

---

## Appendix B: Change Log

| Date | Change |
|---|---|
| May 2026 | Initial competitive analysis created |

---

*This document is confidential and intended for internal Cupla team use only.*
