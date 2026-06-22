# Listonic Competitive Analysis

**Competitor:** Listonic (Listonic Sp. z o.o.)
**URL:** https://listonic.com
**Threat Level:** LOW (high scale but generic grocery list tool with limited AI)
**Analysis Date:** May 2026
**Analyst:** Cupla Strategy Team

---

## 1. Executive Summary

Listonic is a Poland-based smart grocery list app with over 20 million downloads and availability in 40+ languages. Founded in ~2008 by three computer science graduates from the University of Lodz, Listonic has grown into one of the most successful Polish tech startups, winning multiple awards including App of the Year (T3 Magazine Poland) and Best Polish Mobile App (TNW Polish Startups Awards). The app offers a free tier with ads and a premium ad-free tier. Listonic recently introduced an AI shopping assistant for list generation and recipe suggestions, making it the only competitor among the three analyzed with any form of AI. However, the AI is list-focused (not pantry-first), there is no relationship UX, no pantry management, no adaptive portioning, and no offline-first architecture. Listonic's scale (20M+ downloads) and international reach are impressive, but its generic "shopping list for everyone" positioning leaves significant white space for Cupla's couples-focused food system. Threat level is LOW due to fundamentally different value propositions and no overlap in Cupla's core differentiators.

---

## 2. Company Profile

| Attribute | Detail |
|---|---|
| **Legal Name** | Listonic Sp. z o.o. (Polish Limited Liability Company) |
| **Founded** | ~2008-2009 |
| **Headquarters** | Lodz, Poland (Jaracza 56/1, 90-249 Lodz) |
| **Founders** | Three friends who met at University of Lodz studying computer science; lived together in Coventry, UK |
| **Founders' Background** | Computer science graduates; original app was a university project that won a prize |
| **Team Size** | Not disclosed; founders still actively involved in running the company |
| **Funding** | Bootstrapped / self-funded (no external funding disclosed) |
| **Revenue Model** | Freemium: free with ads + premium subscription (ad-free + themes) |
| **Target Market** | Global (40+ languages); broad appeal to anyone who shops for groceries |
| **User Scale** | 20M+ downloads, 350K+ reviews, #1 in 20+ countries |
| **Status** | Active, actively developed |

---

## 3. Product Overview

Listonic is a multi-platform smart grocery list app with three core product pillars:

1. **Smart Shopping Lists** - Create unlimited lists, share in real-time, auto-sort by store aisles, add items with voice, attach photos/prices/notes.
2. **Budget Control** - Total cost calculator, per-item pricing, spending tracking.
3. **AI Shopping Assistant (NEW)** - AI-powered list generation, recipe suggestions, meal ideas, seasonal recommendations, and shopping advice based on purchase history.

The app is available on iOS, Android, web, and tablet/desktop browsers. Listonic can be used without creating an account, though an account is recommended for cross-device sync and backup.

---

## 4. Pricing

| Plan | Price | Key Inclusions |
|---|---|
| **Free** | $0 | All core features (20+), unlimited lists, sharing, auto-sort, voice input, suggestions, AI assistant |
| **Premium** | Subscription (exact price varies by platform/region) | Ad-free experience, premium themes/customization |

**Pricing Notes:**
- The free tier includes the AI assistant (notable - most competitors gate AI behind premium).
- Premium primarily removes ads and adds visual customization.
- Exact pricing not displayed on website; varies by App Store / Google Play region.
- Payment processed through respective app stores (Apple, Google).

**Revenue Model Assessment:** Ad-supported freemium with subscription upgrade. The ad-based model combined with 20M+ downloads suggests meaningful revenue, though per-user revenue is likely low. The inclusion of AI in the free tier suggests Listonic uses AI as a retention/acquisition tool rather than a monetization lever.

---

## 5. User Flow

1. **Onboarding:** Download app -> start immediately without account (optional sign-up for sync) -> create first list.
2. **List Creation:** Tap "New list" -> name list or accept default -> tap "Add" -> type item (autocomplete from catalog + personal history) -> item auto-categorizes.
3. **Sharing:** Invite family/friends -> lists update in real-time -> notifications on changes.
4. **Shopping:** Open list -> items sorted by store aisles (or A-Z, custom) -> tap to check off -> checked items drop to bottom.
5. **AI Assistant:** Open AI prompt -> type/say/snap photo -> receive generated shopping list, recipe suggestions, or product recommendations based on purchase history and preferences.
6. **Budget:** Enter prices on items -> see total cost estimate -> track spending over time.
7. **History-Based Suggestions:** App suggests items based on frequently purchased products.

---

## 6. Feature Deep-Dive

### Core List Features
- **Unlimited Lists:** Create any number of lists (weekly shopping, parties, trips).
- **Real-time Sharing & Sync:** Share with family/friends; instant updates with notifications.
- **Smart Sorting:** Auto-sort by store aisles, alphabetical, or custom order.
- **Custom Categories:** Create and modify categories to match store layout.
- **Autocomplete:** Suggestions from personal shopping history and a product catalog.
- **Shopping History:** One-tap add from frequently purchased items.
- **Product Catalog:** Visual catalog of popular products for quick browsing.
- **Voice Input:** Add items hands-free.
- **Quantities, Units, Notes & Photos:** Rich per-item details.
- **Prices & Budget:** Per-item pricing with automatic total calculation; prices multiply by quantity.
- **Bulk Actions:** Edit multiple items at once.
- **Copy/Duplicate Lists:** Reuse past lists.
- **Archive Lists:** Save lists for future reuse (e.g., annual events).
- **Check-off Behavior:** Checked items drop to bottom; option to check off all at once.
- **Screen Stay On:** Keeps screen active while shopping.
- **Open Last List:** Resumes where user left off.

### AI Shopping Assistant (NEW)
- **List Generation:** "Make a weekly grocery list" generates a complete list.
- **Recipe Suggestions:** "Give 3 quick dinner ideas" provides meal inspiration.
- **Shopping History Integration:** "Suggest items I usually buy" leverages personal data.
- **Seasonal Recommendations:** "What's in season now?" for fresh produce guidance.
- **Dietary Filters:** "What high-protein foods to buy?" and similar queries.
- **Pantry Restock:** "Help me restock my pantry" for replenishment lists.
- **Photo Input:** Snap a photo to trigger AI list generation.
- **Multi-turn Conversations:** Contextual follow-up questions.

### Platform & UX
- **iOS App** (iPhone, iPad)
- **Android App**
- **Web App** (app.listonic.com)
- **Tablet & Desktop** (via web)
- **Home Screen Widgets**
- **Dark Mode**
- **40+ Languages**
- **Quick Actions/Gestures:** Swipe shortcuts for common actions.
- **Notifications:** Alerts when shared lists change.

### What's NOT Included
- No dedicated pantry/inventory tracking
- No meal planning calendar
- No recipe management/collection
- No recipe web import
- No cooking mode
- No online shopping integration
- No relationship/partner profiles
- No adaptive portioning
- No consumption tracking
- No waste tracking
- No barcode scanning

---

## 7. Core Mechanism

Listonic's core mechanism is **history-aware list generation with AI augmentation.** The system maintains a per-user (or per-device) record of shopping history, which powers two key capabilities:

1. **Autocomplete & Suggestions:** When adding items, the system prioritizes items from the user's personal shopping history, supplemented by a product catalog of popular items. This creates a "the more you use it, the smarter it gets" experience without true machine learning.

2. **AI Shopping Assistant:** The newer AI layer provides natural language interaction for list generation, recipe suggestions, and product recommendations. It integrates with the user's shopping history to personalize responses.

The sync mechanism operates on a standard client-server model with real-time push notifications for shared list changes. Unlike AnyList and OurGroceries, Listonic allows anonymous use without account creation, with sync being an opt-in feature enabled by account registration.

There is no pantry model (no tracking of what you own vs. what you need to buy), no consumption logging, and no portion adaptation. The AI is list-generation focused rather than household-intelligence focused.

---

## 8. Profile & Data Model

### User Model
- **Anonymous Mode:** App usable without registration.
- **Account:** Email/password or social login (Facebook, Google) for sync and backup.
- **No multi-profile support:** No individual user profiles within an account.
- **No household model:** Sharing is peer-to-peer without formal household structure.

### Data Model
- **List:** Name, category configuration, shared users, archived state.
- **List Item:** Name, category, quantity, unit, price, photo, notes, checked state, sort position.
- **Shopping History:** Cumulative record of purchased items per user/device.
- **Product Catalog:** Global database of popular grocery products.
- **AI Context:** User preferences, shopping patterns, seasonal data.

### Data Sync
- Server-based sync for registered users.
- Real-time push for shared list updates.
- Anonymous users have local-only data (no sync, no backup).

---

## 9. Tech Stack

| Layer | Technology (Inferred) |
|---|---|
| **Website** | Next.js (evidenced by `/_next/` image URLs and framework patterns) |
| **iOS App** | Native (Swift/SwiftUI, inferred) |
| **Android App** | Native (Kotlin, inferred; package: com.l) |
| **Web App** | SPA at app.listonic.com |
| **Backend/API** | Custom API (api.ts.listonic.com - likely TypeScript/Node.js) |
| **CMS** | Directus (evidenced by listonicdirectusapi.ts.listonic.com) |
| **Cloud Infrastructure** | Likely AWS or Google Cloud (GDPR-compliant, EU-based) |
| **AI Integration** | Third-party LLM API (not disclosed; likely OpenAI or similar for the AI assistant) |
| **Analytics** | Google Analytics, Microsoft Clarity, Equativ (referenced in privacy policy) |
| **Ad Platform** | Custom ad serving with Equativ integration |
| **CDN** | Cloudflare (evidenced by /cdn-cgi/ in email protection) |
| **I18n** | Custom internationalization system supporting 40+ languages |

**Note:** Tech stack inferences are based on observable URL patterns, HTML structure, and privacy policy disclosures.

---

## 10. AI Architecture

Listonic has the most advanced AI implementation among the three competitors analyzed, though it remains relatively basic compared to purpose-built food AI systems.

### Current AI Capabilities

**AI Shopping Assistant:**
- **Natural Language Interface:** Users type, speak, or snap photos to interact.
- **List Generation:** Creates shopping lists from natural language requests ("Make a weekly grocery list for a family of 4").
- **Recipe Suggestions:** Suggests meals based on queries ("Quick dinner ideas," "What to cook with chicken").
- **Personalized Recommendations:** Integrates with shopping history for "items I usually buy" suggestions.
- **Seasonal Intelligence:** Knows what produce is in season.
- **Dietary Awareness:** Can filter by dietary preferences in queries (high-protein, low-carb, budget).
- **Pantry Restock Queries:** "Help me restock my pantry" generates replenishment lists.
- **Photo-to-List:** Image input triggers AI interpretation and list generation.

### Architecture (Inferred)
- **LLM Backend:** Likely uses a third-party API (OpenAI GPT, Anthropic Claude, or similar) rather than fine-tuned models.
- **Context Layer:** Shopping history and user preferences injected as context for personalization.
- **No Fine-Tuning:** No evidence of custom-trained models on grocery-specific data.
- **No Pantry Intelligence:** AI does not track current pantry inventory or consumption patterns.
- **No Adaptive Portions:** AI does not learn household size or adjust quantities accordingly.
- **No Predictive Purchasing:** AI does not predict when items will run out.

### Limitations
- AI is query-driven (user must ask), not proactive (no "you're running low on milk" notifications).
- No persistent learning model; personalization comes from history lookup, not trained weights.
- No pantry-aware AI; cannot reason about what you already own.
- No multi-user AI awareness; cannot distinguish between partners' preferences.

---

## 11. Legal

| Area | Detail |
|---|---|
| **Entity** | Listonic Sp. z o.o. (Polish Limited Liability Company) |
| **Registered Address** | Jaracza 56/1, 90-249 Lodz, Poland |
| **Privacy Policy** | Available at listonic.com/privacy (effective May 6, 2024) |
| **Data Controller** | Listonic Sp. z o.o. |
| **DPO** | Tomasz Wekwart (named Data Protection Officer) |
| **DPO Contact** | [email protected] |
| **GDPR Compliance** | Full GDPR compliance; EU-based data controller with named DPO |
| **Data Storage** | EU-based with possible transfers outside EEA via Standard Contractual Clauses |
| **Cloud Partners** | Amazon, Google, Microsoft (as service providers) |
| **Data Processing Legal Basis** | Article 6(1)(b) contract performance, 6(1)(c) legal obligation, 6(1)(f) legitimate interests |
| **Consent Management** | CMP (Consent Management Platform) for marketing consents |
| **Advertising** | Ad-supported free tier; ads served via Equativ and partners; non-sensitive data used for ad targeting |
| **Payment Data** | Processed by marketplace (App Store/Google Play); Listonic does not directly handle payment data |
| **Data Portability** | Right to data portability under GDPR |
| **Data Deletion** | Right to erasure under GDPR |
| **Supervisory Authority** | Prezes Urzadu Ochrony Danych Osobowych (President of the Polish Data Protection Office) |
| **Terms of Service** | Available at listonic.com/terms-of-service |
| **Archive** | Previous versions of ToS and Privacy Policy available at listonic.com/archive |

---

## 12. Content & Marketing Strategy

### Brand Voice
Friendly, accessible, slightly playful. Uses emoji in marketing copy. Positions as helpful assistant rather than premium tool.

### Channels
- **Website:** listonic.com - modern Next.js site with feature showcases and blog content
- **App Store/Google Play:** 350K+ reviews; avg 4.7 rating; #1 in 20+ countries
- **Blog/Guides:** "Guides" and "Resources" sections on website
- **Social Media:** Active across multiple platforms
- **Translation Community:** Crowdsourced translations for 40+ languages (community.listonic.com)
- **Advertising Platform:** Operates own ad network (ads.listonic.com) for brand advertising opportunities
- **SEO:** Strong organic presence in multiple languages

### Messaging Themes
- "Save time and money"
- "The smart shopping list app"
- "Made to solve everyday shopping problems"
- Family organization and budget control
- AI as a helpful companion, not a replacement

### Content Types
- Feature showcase pages with phone mockups
- "Guides" section (shopping tips, meal planning advice)
- FAQ / Help Center (helpcenter.listonic.com)
- AI prompt examples displayed on homepage
- Awards and social proof prominently featured

### International Strategy
- **40+ languages:** Most localized grocery list app in the market.
- **Translation Community:** Users contribute translations, creating ownership and distribution.
- **Multi-market presence:** #1 in 20+ countries; strong in Central/Eastern Europe.

### Awards & Recognition
- App of the Year - T3 Magazine (Polish edition)
- Best Polish Mobile App - TNW Polish Startups Awards
- Best m-Commerce App - Mobile Trends Awards
- Appaward for Best Utility App (Android and iOS)
- One of The Most Creative Businesses - Brief magazine
- 2nd Place - MasterCard Mobile Shopping Application Awards (Poland)

---

## 13. Gap Analysis vs Cupla

| Capability | Listonic | Cupla | Gap Direction |
|---|---|---|---|
| **Relationship-First UX** | No (anonymous or single-user model) | Yes (couple profiles) | Cupla advantage |
| **Real-Time Sync** | Yes | Planned | Parity target |
| **Pantry Management** | No | Yes (pantry-first) | Cupla advantage |
| **AI Suggestions** | Yes (list-generation AI) | Yes (pantry-first AI) | Different approaches |
| **AI Depth** | Basic (LLM wrapper) | Deeper (pantry-aware, adaptive) | Cupla advantage |
| **Adaptive Portions** | No | Yes (auto for 2 people) | Cupla advantage |
| **Recipe Management** | No (AI suggestions only) | Not core | N/A |
| **Meal Planning** | No (AI suggestions only) | Planned | Cupla advantage |
| **Budget Tracking** | Yes (total cost calculator) | Not core | Listonic advantage |
| **Voice Input** | Yes (basic) | Not mentioned | Listonic advantage |
| **Online Shopping** | No | No | Parity |
| **PWA** | No (native + web app) | Yes | Cupla advantage |
| **Offline Support** | Limited (anonymous = local only) | Yes (offline-first) | Cupla advantage |
| **Internationalization** | 40+ languages | Not specified | Listonic advantage |
| **Scale** | 20M+ downloads | Pre-launch | Listonic advantage |
| **Dietary Preferences** | Query-based (AI) | System-level (AI-driven) | Cupla advantage |
| **Consumption Tracking** | No | Yes | Cupla advantage |
| **Waste Tracking** | No | Yes | Cupla advantage |
| **Account Required** | No | TBD | Listonic advantage |

---

## 14. What They Do Well

1. **Scale and distribution:** 20M+ downloads and #1 in 20+ countries is unmatched in the grocery list category.
2. **Internationalization:** 40+ languages with a community translation system; no competitor comes close.
3. **AI early adoption:** First among grocery list apps to ship an AI assistant (even if basic).
4. **Frictionless onboarding:** No account required; users can start immediately.
5. **Budget consciousness:** Total cost calculator and per-item pricing for budget-aware shoppers.
6. **Modern tech stack:** Next.js, TypeScript, Directus CMS suggests engineering competence.
7. **Ad network as revenue:** Operating their own ad platform (ads.listonic.com) provides additional revenue beyond app store subscriptions.
8. **Shopping history intelligence:** Leverages purchase history for personalized suggestions without requiring explicit user configuration.
9. **Awards and credibility:** Multiple industry awards build trust with new users.
10. **SEO and content marketing:** Strong organic presence across multiple language markets.
11. **Free AI inclusion:** Making the AI assistant available in the free tier is a smart acquisition and retention strategy.
12. **GDPR excellence:** Named DPO, full GDPR compliance, EU-based data handling.

---

## 15. What They Lack

1. **No pantry/inventory tracking:** The most critical gap for a food system. No concept of current household inventory.
2. **No relationship context:** Anonymous or single-user model; no couple/partner profiles or shared preferences.
3. **No adaptive portioning:** AI generates generic lists; no awareness of household size or consumption patterns.
4. **No meal planning system:** AI can suggest meals but there is no calendar, no recurring plans, no structured meal workflow.
5. **No recipe management:** Cannot save, organize, or import recipes. AI suggestions are ephemeral.
6. **No consumption tracking:** No logging of what was actually eaten or used.
7. **No waste tracking:** No visibility into food waste patterns.
8. **No proactive intelligence:** AI is query-driven only; no "you're running low" push notifications.
9. **No pantry-aware AI:** AI cannot reason about current inventory to generate contextual shopping lists.
10. **No offline-first architecture:** Requires connectivity for sync and AI features.
11. **No PWA:** Native apps and web app, but no Progressive Web App.
12. **No online shopping integration:** Cannot order groceries directly.
13. **No barcode scanning:** No physical product identification.
14. **AI depth limitations:** LLM wrapper approach without fine-tuned grocery models or persistent learning.
15. **Ad-dependent UX:** Free tier shows ads, which degrades the shopping experience.

---

## 16. Threat Assessment

### Overall Threat: LOW

**Rationale:**

- **Fundamentally different product:** Listonic is a shopping list app with an AI bolt-on. Cupla is a couples' food system with pantry intelligence. The core value propositions do not overlap.
- **No pantry model:** This is Listonic's most significant gap and Cupla's most significant advantage. Listonic cannot compete where they have no data model.
- **No relationship architecture:** Listonic's anonymous/single-user model cannot support Cupla's dual-profile relationship UX without a fundamental redesign.
- **AI is shallow:** Listonic's AI is a list-generation tool, not a household intelligence system. It does not learn, predict, or adapt.
- **Different user psychographics:** Listonic targets "anyone who shops for groceries." Cupla targets couples who eat together. These are different value propositions.
- **No competitive incentive:** Listonic has 20M downloads and strong revenue. They have no reason to pivot toward a niche (couples) when they have mass-market success.

**Risk Factors:**
- **Scale advantage:** 20M users means significant resources and data for potential feature expansion.
- **AI momentum:** Listonic has demonstrated willingness to ship AI features. If they deepen their AI (e.g., add pantry tracking), they could encroach on Cupla's space.
- **International reach:** Cupla will likely launch in fewer markets initially, giving Listonic a geographic advantage.
- **Free AI access:** If Listonic's AI becomes genuinely useful, it could satisfy users who might otherwise seek Cupla's AI features.

**Mitigation:**
- Cupla must ship before Listonic adds pantry tracking or relationship features.
- Pantry-first AI is a fundamentally different architecture from list-generation AI; it cannot be easily retrofitted.
- Cupla's relationship-first positioning is a category creation play that Listonic cannot pursue without abandoning their mass-market strategy.

---

## 17. Strategic Recommendations for Cupla

### Differentiate on depth over breadth.
Listonic has breadth (40+ languages, 20M users). Cupla should compete on depth (deep pantry intelligence, relationship-aware features).

### Own the pantry space exclusively.
Listonic has no pantry model and no public roadmap for one. Cupla should establish "pantry-first" as its unassailable position before competitors respond.

### Study Listonic's AI as a baseline.
Their AI assistant is the closest existing implementation to what Cupla offers. Cupla's AI must be demonstrably smarter (pantry-aware, consumption-predictive, portion-adaptive).

### Don't compete on internationalization (initially).
40+ languages is an insurmountable lead. Focus on 1-2 markets initially and win deeply before expanding.

### Consider the "Listonic graduate" user.
Users who use Listonic's AI and realize they want deeper food intelligence (pantry, portions, couple coordination) are Cupla's natural conversion targets.

### Monitor their AI evolution closely.
Listonic is the most likely of the three competitors to add features that overlap with Cupla. Track their AI roadmap and shipping cadence.

### Learn from their content marketing.
Their Guides and Resources section, combined with SEO across 40+ languages, is a distribution playbook worth studying.

### Emulate their GDPR compliance.
Named DPO, full transparency, EU-based data handling. Cupla should match this standard from launch.

### Position against Listonic explicitly.
"Listonic is a smart list. Cupla is a smart kitchen." This framing clarifies the depth difference.

---

## Feature Comparison Table: Listonic vs Cupla

| Feature | Listonic | Cupla |
|---|---|---|
| Shared grocery lists | Yes | Yes |
| Real-time sync | Yes | Planned |
| Individual profiles | No | Yes (couple profiles) |
| Relationship-first UX | No | Yes (core) |
| Pantry/inventory tracking | No | Yes (pantry-first) |
| AI suggestions | Yes (list-generation AI) | Yes (pantry-first AI) |
| AI depth | Basic (LLM wrapper) | Deep (pantry-aware, adaptive) |
| Adaptive portions | No | Yes (auto for 2) |
| Recipe management | No | Not core |
| Recipe web import | No | Not core |
| Meal planning | No (AI suggestions only) | Planned |
| Voice input | Yes (basic) | Not mentioned |
| Voice assistants | No (Siri/Alexa) | Not mentioned |
| Online shopping | No | No |
| PWA | No | Yes |
| Offline support | Limited | Yes (offline-first) |
| Budget/price tracking | Yes (total cost calculator) | Not core |
| Dietary preferences | Query-based (AI) | System-level |
| Consumption tracking | No | Yes |
| Waste tracking | No | Yes |
| Barcode scanning | No | Not mentioned |
| Item photos | Yes | Not mentioned |
| Internationalization | 40+ languages | Not specified |
| Account required | No | TBD |
| Widgets | Yes | Not mentioned |
| Dark mode | Yes | Not mentioned |
| Cross-platform | iOS, Android, Web, Tablet, Desktop | PWA (any browser) |
| Pricing | Free + premium subscription | TBD |
| AI assistant | Yes (free tier) | Yes (core) |
| Shopping history | Yes (powers suggestions) | Yes (powers pantry AI) |

---

## Appendix: Three-Competitor Comparison Matrix

| Dimension | AnyList | OurGroceries | Listonic | Cupla |
|---|---|---|---|---|
| **Founded** | ~2012 | 2009 | ~2008 | 2026 |
| **Team Size** | 2+ | 2 | Small (founders active) | TBD |
| **Downloads** | Not disclosed | Not disclosed | 20M+ | Pre-launch |
| **Markets** | Primarily English | Primarily English | 40+ languages | TBD |
| **AI** | None | None | Basic LLM wrapper | Pantry-first AI |
| **Pantry** | No | No | No | Yes |
| **Relationship UX** | No | No | No | Yes |
| **Adaptive Portions** | No | No | No | Yes |
| **Recipes** | Extensive | Basic | None | Not core |
| **Meal Planning** | Yes (calendar) | No | No (AI suggestions) | Planned |
| **Voice** | Siri + Alexa | Alexa + Siri + Wear OS | Basic voice input | Not mentioned |
| **Online Shopping** | Yes (3 retailers) | No | No | No |
| **PWA** | No | No | No | Yes |
| **Offline-First** | No | No | No | Yes |
| **Pricing** | $9.99-$14.99/yr | Free + one-time IAP | Free + subscription | TBD |
| **Ads** | No | Yes (removable) | Yes (removable) | TBD |
| **Threat Level** | LOW | LOW | LOW | N/A |

---

*This analysis is based on publicly available information from listonic.com, App Store listings, and industry sources as of May 2026.*
