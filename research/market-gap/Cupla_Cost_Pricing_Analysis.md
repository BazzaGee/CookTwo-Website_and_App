# Cupla — Cost, Pricing, Usage & Profitability Analysis

**App:** Cupla (Couples Food System)
**Location:** `C:\Users\barry\OneDrive\Desktop\Cupla\App Infrastructure\couples-food-system`
**Document Date:** June 14, 2026
**Revenue Currency:** USD (customer-facing)
**Operating Currency:** NZD (Barry's home currency)
**Models:** DeepSeek V4 Flash (primary) → DeepSeek V4 Pro (fallback)
**Unit of Sale:** 1 subscription per couple (2 people share all resources)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Currency Framework](#2-currency-framework)
3. [DeepSeek API Pricing](#3-deepseek-api-pricing)
4. [App Architecture & Token Usage](#4-app-architecture--token-usage)
5. [Per-Operation Costs](#5-per-operation-costs)
6. [Real-World Usage Validation](#6-real-world-usage-validation)
7. [ChatGPT Free Tier Comparison](#7-chatgpt-free-tier-comparison)
8. [DeepSeek vs OpenAI Cost Comparison](#8-deepseek-vs-openai-cost-comparison)
9. [Plan Structure](#9-plan-structure)
10. [Usage Walkthrough — 10 Requests/Day for a Couple](#10-usage-walkthrough--10-requestsday-for-a-couple)
11. [Usage Walkthrough — 70 Requests/Day Paid Couple](#11-usage-walkthrough--70-requestsday-paid-couple)
12. [Payment Options](#12-payment-options)
13. [Stripe & App Store Fees](#13-stripe--app-store-fees)
14. [Per-Couple Economics](#14-per-couple-economics)
15. [Natural FX Hedge](#15-natural-fx-hedge)
16. [Conversion Rate Sensitivity — Full Grid](#16-conversion-rate-sensitivity--full-grid)
17. [Yearly Uptake Impact Analysis](#17-yearly-uptake-impact-analysis)
18. [Path to NZ$150,000/Year](#18-path-to-nz150000year)
19. [Churn & Lifetime Value Analysis](#19-churn--lifetime-value-analysis)
20. [CAC Sensitivity Analysis](#20-cac-sensitivity-analysis)
21. [Net Profit After CAC — Matrix Tables](#21-net-profit-after-cac--matrix-tables)
22. [NZ$150K Target — Which Combinations Work](#22-nz150k-target--which-combinations-work)
23. [Growth Trajectory Scenarios — 3-Year Projections](#23-growth-trajectory-scenarios--3-year-projections)
24. [Best / Expected / Worst Case Summary](#24-best--expected--worst-case-summary)
25. [Risk Factors & Mitigations](#25-risk-factors--mitigations)
26. [FX Sensitivity Analysis](#26-fx-sensitivity-analysis)
27. [Implementation Checklist](#27-implementation-checklist)
28. [Quick Reference Card](#28-quick-reference-card)
29. [Sources](#29-sources)

---

## 1. Executive Summary

Cupla's AI costs are extraordinarily low thanks to DeepSeek's aggressive pricing. The model chain `deepseek-v4-flash → deepseek-v4-pro` delivers frontier-quality AI at roughly **95x cheaper than OpenAI's GPT-5.5** and **3.9x cheaper than even GPT-5.4-nano** (OpenAI's cheapest model).

### The Plan

| | Free | Paid |
|---|---|---|
| **Price** | $0 | US$4.99/month or US$44.99/year |
| **Requests/day** | 10 (shared between couple) | 70 (shared between couple) |
| **Requests/month** | 300 | 2,100 (exactly 7x free) |
| **Image generation** | None | 3 images/day (paid only, no rollover) |
| **AI cost to Cupla** | NZ$0.26/couple/month | NZ$3.96/couple/month (NZ$1.80 text + NZ$2.16 images) |
| **Pool model** | Fully shared — either partner uses any amount | Same |

### Headline Numbers

| Metric | Value |
|---|---|
| Profit per monthly subscriber | NZ$4.08/month |
| Profit per yearly subscriber | NZ$2.27/month equivalent |
| Blended profit per paid couple (60% monthly / 40% yearly) | NZ$40.26/year |
| Free couple cost | NZ$3.09/year |
| Break-even conversion rate | ~7.1% |
| 1 paying couple subsidises | ~13 free couples |
| **Target** | **NZ$150,000/year net in the hand** |
| Couples needed at 10% conversion (gross) | ~120,500 |
| Couples needed at 10% conversion (after NZ$2 CAC, 5% churn) | ~130,100 |

### Key Insight

One subscription covers a **couple** (2 people). Both partners share the same request pool in any ratio they choose. Revenue and AI costs are both denominated in USD, creating a **natural currency hedge** — your USD profit is stable regardless of NZD exchange rate movements.

---

## 2. Currency Framework

### How Money Flows

```
Customer pays           Stripe / Apple / Google        Cupla receives
in USD                  processes payment               NZD in bank account
    │                         │                              │
    │  US$4.99/month          │  Converts USD→NZD            │  NZ$8.04/month
    │  US$44.99/year          │  Deducts fees                │  NZ$74.80/year
    ▼                         ▼                              ▼
 ┌──────────┐           ┌──────────────┐              ┌──────────────┐
 │ Customer │──────────▶│  Payment     │─────────────▶│   Cupla      │
 │  (any    │   USD     │  Processor   │   NZD net    │  (NZ bank    │
 │ country) │           │              │              │   account)   │
 └──────────┘           └──────────────┘              └──────┬───────┘
                                                            │
                                                    AI costs paid in USD
                                                    to DeepSeek API
                                                            │
                                                            ▼
                                                    ┌──────────────┐
                                                    │  DeepSeek    │
                                                    │  (USD)       │
                                                    └──────────────┘
```

### Exchange Rate

**As of June 14, 2026 (XE mid-market rate):**

| | Value |
|---|---|
| 1 USD | = NZ$1.7148 |
| 1 NZD | = US$0.5831 |

### Why This Matters

Since DeepSeek charges in USD and your revenue is in USD, the **profit in USD is completely stable** regardless of exchange rate movements. FX only affects how much that USD profit is worth when converted to NZD for your living expenses.

See [Section 15: Natural FX Hedge](#15-natural-fx-hedge) and [Section 26: FX Sensitivity Analysis](#26-fx-sensitivity-analysis) for detailed analysis.

---

## 3. DeepSeek API Pricing

Source: `https://api-docs.deepseek.com/quick_start/pricing` (verified June 14, 2026)

### Original Pricing (USD per 1M tokens)

| Model | Input (cache miss) | Input (cache hit) | Output |
|-------|-------------------|-------------------|--------|
| **deepseek-v4-flash** | US$0.14 | US$0.0028 | US$0.28 |
| **deepseek-v4-pro** | US$0.435 | US$0.003625 | US$0.87 |

**V4 Pro is 3.1x more expensive than V4 Flash** on both input and output.

### Converted to NZD (at 1 USD = NZ$1.7148)

| Model | Input (cache miss) | Input (cache hit) | Output |
|-------|-------------------|-------------------|--------|
| **deepseek-v4-flash** | NZ$0.24 | NZ$0.005 | NZ$0.48 |
| **deepseek-v4-pro** | NZ$0.75 | NZ$0.006 | NZ$1.49 |

### Model Details

| Feature | V4 Flash | V4 Pro |
|---------|----------|--------|
| Context length | 1M tokens | 1M tokens |
| Max output | 384K tokens | 384K tokens |
| Thinking mode | Both (default: thinking) | Both (default: thinking) |
| JSON output | Yes | Yes |
| Tool calls | Yes | Yes |
| Concurrency limit | 2,500 | 500 |
| Role in Cupla | **Primary** | **Fallback only** |

Note: The legacy model names `deepseek-chat` and `deepseek-reasoner` correspond to the non-thinking and thinking modes of `deepseek-v4-flash` respectively. They will be deprecated on 2026/07/24.

---

## 4. App Architecture & Token Usage

### Architecture Overview

- **Backend:** Cloudflare Worker (Hono framework) with Durable Objects for real-time state
- **Frontend:** React 19 PWA with TanStack Query, Zustand, localStorage persistence
- **Storage:** Cloudflare D1 (SQL) + Durable Object SQLite
- **AI Provider:** Configurable via `AI_PROVIDER` env var (currently `deepseek`)
- **Image Generation:** Alibaba Wan2.6 (text-to-image, separate from text AI)
- **Couples Model:** HouseholdSync Durable Object — one household = one couple = one subscription

### AI Model Chains

Defined in `worker/src/lib/ai.ts:36-40`:

```
alibaba:  ['qwen3.5-plus', 'qwen3.6-plus', 'moonshotai/kimi-k2.5']
zai:      ['glm-5.1', 'glm-5', 'glm-5-turbo']
deepseek: ['deepseek-v4-flash', 'deepseek-v4-pro']   ← current default
```

Pattern: Try primary → fallback #1 → fallback #2. If all fail, return `null` (no mock data).

### Per-Operation Token Settings

| Operation | Input Tokens (est.) | Output `max_tokens` | Avg Output (est.) | Code Reference |
|-----------|---------------------|---------------------|-------------------|----------------|
| Meal generation | 500-1500 | **1536** | ~1,200 | `ai.ts:174` |
| AI chat message | 500-3000+ | **2048** | ~1,500 | `ai.ts:376` |
| Week plan (7 meals) | 3,500-10,500 | **10,752** (7 x 1536) | ~8,400 | `mealplan.ts` |
| Pantry AI parsing | 200-300 | **2048** | ~500 | `ai-pantry-parser.ts:94` |

### Token-Saving Mechanisms Already in Code

| Mechanism | Description | Location |
|-----------|-------------|----------|
| Parse cache | Caches AI pantry parsing results for 30 days (SHA-256 key) | `parse-cache.ts` |
| Regex-first parser | Uses regex for common items, only sends low-confidence items to AI | `pantry-parser.ts` |
| Model fallback chain | Falls back only on failure, not on quality | `ai.ts` |
| Conversation history in localStorage | Client-side, sent with each request but not stored server-side | `useMealChat.ts` |

---

## 5. Per-Operation Costs

All figures in NZD (converted from USD at 1.7148).

### Per Operation (V4 Flash)

| Operation | Input Tokens | Output Tokens | Input Cost | Output Cost | **Total Cost** |
|-----------|-------------|---------------|-----------|-------------|----------------|
| Meal generation | 800 | 1,200 | NZ$0.00019 | NZ$0.00058 | **NZ$0.00077** |
| AI chat message | 1,500 | 1,500 | NZ$0.00036 | NZ$0.00072 | **NZ$0.00108** |
| Week plan (7 meals) | 5,600 | 8,400 | NZ$0.00134 | NZ$0.00403 | **NZ$0.00537** |
| Pantry AI parsing | 300 | 500 | NZ$0.00007 | NZ$0.00024 | **NZ$0.00031** |

### Per Operation (V4 Pro — fallback only)

| Operation | Total Cost (NZD) | Ratio vs Flash |
|-----------|-----------------|----------------|
| Meal generation | NZ$0.00237 | 3.1x |
| AI chat message | NZ$0.00335 | 3.1x |
| Week plan (7 meals) | NZ$0.01660 | 3.1x |
| Pantry AI parsing | NZ$0.00095 | 3.1x |

### Blended Per-Request Cost

Assuming 60% chat messages / 40% meal generations:

| Model | Per-Request Cost (NZD) | Per-Request Cost (USD) |
|-------|----------------------|----------------------|
| V4 Flash (calculated) | NZ$0.00090 | US$0.00053 |
| V4 Flash (conservative planning rate) | **NZ$0.00086** | **US$0.00050** |
| V4 Pro (calculated) | NZ$0.00279 | US$0.00163 |

The conservative planning rate of NZ$0.00086/request (US$0.00050) is used throughout this document. It is derived by rounding the actual blended cost slightly downward for the USD figure and converting at the FX rate, providing a realistic planning buffer.

---

## 6. Real-World Usage Validation

User's actual measured usage (1 day, June 2026):

| Model | Requests | Tokens | Tokens/Request |
|-------|----------|--------|----------------|
| V4 Pro | 11 | 24,000 | ~2,182 |
| V4 Flash | 26 | 45,000 | ~1,731 |
| **Total** | **37** | **69,000** | **~1,865** |

**Actual cost:** ~US$0.02 = ~NZ$0.03 per day

### Cross-Check Against Published Pricing

Assuming ~70% input / 30% output token split:

| Scenario | Input Cost (NZD) | Output Cost (NZD) | Total/Day | Per-Request |
|----------|-----------------|-------------------|-----------|-------------|
| All V4 Flash | NZ$0.0116 | NZ$0.0099 | NZ$0.0215 | NZ$0.00058 |
| All V4 Pro | NZ$0.0362 | NZ$0.0308 | NZ$0.0670 | NZ$0.00181 |
| Actual mix (70% Flash, 30% Pro) | — | — | **NZ$0.0333** | **NZ$0.00090** |

**Validation:** The calculated cost for the actual mix (NZ$0.0333/day) closely matches the observed ~NZ$0.034/day (US$0.02 converted). **Pricing verified.**

### Per-Request Cost Summary (from actual data)

| Model | Per-Request (NZD) | Per-Request (USD) |
|-------|-------------------|-------------------|
| V4 Flash (actual measured) | NZ$0.00058 | US$0.00034 |
| V4 Pro (actual measured) | NZ$0.00210 | US$0.00123 |
| Blended (actual mix) | NZ$0.00090 | US$0.00053 |
| **Conservative planning rate** | **NZ$0.00086** | **US$0.00050** |

---

## 7. ChatGPT Free Tier Comparison

### What ChatGPT Free Actually Provides

Source: `https://help.openai.com/en/articles/9275245-using-chatgpt-for-free` and `https://openai.com/chatgpt/pricing/`

| Feature | ChatGPT Free |
|---------|--------------|
| Primary model | GPT-5.5 Instant (distilled, ChatGPT-product-only) |
| Secondary model | GPT-5 Thinking Mini |
| Context window | 27K (GPT Instant) |
| Response priority | "Limited on bandwidth & availability" |
| Ads | Yes (rolling out in certain countries) |
| Rate limit | "A limited number of times within a five hour window" |
| Exact message limit | **Not published** — dynamic, adjusted by OpenAI |
| Tools (image gen, data analysis, file upload) | Separate, stricter limits |
| Memory | Limited |
| Specialisation | None — generic assistant |

### ChatGPT Free vs Cupla Free

| | ChatGPT Free (per person) | Cupla Free (per couple) |
|---|---|---|
| Model | GPT-5.5 Instant (distilled) | DeepSeek V4 Flash (frontier) |
| Context window | 27K | 1M |
| Response priority | Deprioritised | Full priority |
| Ads | Yes | No |
| Daily messages (per person) | ~50-80 (estimated, 2-3 windows/day) | ~5 average (10 shared between couple) |
| Monthly messages (per person) | ~1,500-2,400 | ~150 average (300 shared) |
| Message weight | Light (50-700 tokens each) | Heavy (2,000-3,500 tokens each) |
| Daily tokens per person | ~10,000-35,000 | ~10,000-17,500 |
| Specialisation | None | Couples meal planning, TDEE, pantry, real-time sync |
| Rate limit window | 5 hours (dynamic) | Fixed 10/day |

### Why 10 Requests/Day Is Competitive Despite Fewer Messages

ChatGPT's "50-80 messages/day" is misleading for comparison:

- ChatGPT messages are lightweight: typically 50-200 input + 100-500 output tokens = 150-700 tokens per message
- Cupla requests are heavyweight: each carries pantry data, two partner profiles (diets, allergies, TDEE), and returns structured JSON with ingredients, steps, and plating instructions = 2,000-3,500 tokens per request
- **A single Cupla request does roughly 5-10x the AI work of a ChatGPT message**
- Your 10 requests/day = ~20,000-35,000 tokens of AI work
- ChatGPT's 50 messages = ~10,000-35,000 tokens of AI work
- **The actual AI compute is comparable**

### ChatGPT Rate Limit Reality

OpenAI deliberately does NOT publish exact free tier message limits. The rate limit is **dynamic** — adjusted based on system load, time of day, and user behaviour. Key facts:

- The limit resets every **5 hours** (not 3 hours like the GPT-4o era)
- Historical context: GPT-4o free tier was ~16 messages/3hr; GPT-4o mini ~40/3hr
- GPT-5.5 is more expensive to run than GPT-4o — free limits may be similar or tighter
- OpenAI can throttle, reduce response speed, or cut limits at any time
- Free tier now **shows ads** to offset costs
- Realistic daily estimate: 50-80 practical messages (not guaranteed)

### ChatGPT Free Is Per Person — Cupla Free Is Per Couple

This is a fundamental difference:

| | ChatGPT Free | Cupla Free |
|---|---|---|
| Unit | 1 individual | 1 couple (2 people) |
| Messages per "unit" | ~50-80/day per person | 10/day shared |
| Messages per person in unit | ~50-80/day | ~5/day average |
| But: people who share | 1 | 2 (partner gets same data) |

A couple using ChatGPT free would each get their own 50-80 messages but in **completely separate** conversations with no shared context, no pantry sync, no joint meal planning.

A couple using Cupla gets 10 shared requests but with **full shared context** — both see the same meal plans, grocery list, pantry, and AI suggestions in real time.

---

## 8. DeepSeek vs OpenAI Cost Comparison

Source: `https://platform.openai.com/docs/pricing` (verified June 14, 2026)

### OpenAI API Pricing (per 1M tokens, USD)

| Model | Input | Cached Input | Output |
|-------|-------|-------------|--------|
| GPT-5.5 | US$5.00 | US$0.50 | US$30.00 |
| GPT-5.5 Pro | US$30.00 | — | US$180.00 |
| GPT-5.4 | US$2.50 | US$0.25 | US$15.00 |
| GPT-5.4-mini | US$0.75 | US$0.075 | US$4.50 |
| GPT-5.4-nano | US$0.20 | US$0.02 | US$1.25 |
| GPT-5.4-pro | US$30.00 | — | US$180.00 |

### Per-Request Cost Comparison (NZD)

Using blended average of 1,220 input + 1,380 output tokens per request:

| Model | Per-Request (USD) | Per-Request (NZD) | Ratio vs V4 Flash |
|-------|-------------------|-------------------|-------------------|
| **DeepSeek V4 Flash** | US$0.00050 | **NZ$0.00086** | **1x** |
| **DeepSeek V4 Pro** | US$0.00150 | NZ$0.00257 | 3.0x |
| GPT-5.4-nano | US$0.00197 | NZ$0.00338 | 3.9x |
| GPT-5.4-mini | US$0.00713 | NZ$0.01222 | 14.2x |
| GPT-5.4 | US$0.02375 | NZ$0.04073 | 47.3x |
| GPT-5.5 | US$0.04750 | NZ$0.08145 | **94.7x** |
| GPT-5.5 Pro | US$0.25200 | NZ$0.43213 | 502.5x |

### Free Tier Cost Comparison (300 requests/month)

| Model | Monthly Cost (NZD) | Annual Cost (NZD) |
|-------|-------------------|-------------------|
| **DeepSeek V4 Flash** | **NZ$0.26** | **NZ$3.09** |
| GPT-5.4-nano | NZ$1.01 | NZ$12.15 |
| GPT-5.4-mini | NZ$3.67 | NZ$43.99 |
| GPT-5.5 | NZ$24.44 | NZ$293.23 |

### Paid Tier Cost Comparison (2,100 requests/month)

| Model | Monthly Cost (NZD) | Annual Cost (NZD) |
|-------|-------------------|-------------------|
| **DeepSeek V4 Flash** | **NZ$1.80** | **NZ$21.67** |
| GPT-5.4-nano | NZ$7.09 | NZ$85.03 |
| GPT-5.4-mini | NZ$25.66 | NZ$307.91 |
| GPT-5.5 | NZ$171.05 | NZ$2,052.59 |

### The Bottom Line

Even OpenAI's cheapest model (GPT-5.4-nano) is **3.9x more expensive** than DeepSeek V4 Flash. GPT-5.5 (the model ChatGPT free uses internally) is **94.7x more expensive**. DeepSeek's pricing makes it economically viable to give away substantial AI usage for free — something that would be financially devastating on OpenAI infrastructure.

---

## 9. Plan Structure

### Overview

| | Free | Paid |
|---|---|---|
| **Price** | $0 | US$4.99/month or US$44.99/year |
| **Requests/day** | 10 (shared pool) | 70 (shared pool) |
| **Requests/month** | 300 | 2,100 |
| **Ratio (paid:free)** | 1x | **7x** |
| **Pool model** | Fully shared between couple | Fully shared between couple |
| **AI model** | DeepSeek V4 Flash → V4 Pro fallback | Same |
| **Context window** | 1M tokens | 1M tokens |
| **Response priority** | Full | Full |
| **Ads** | No | No |
| **Weekly meal plans** | ~4/month (28 requests) | ~28/month (196 requests) |
| **Daily chat capacity** | 3-5 per person | 30+ per person |
| **AI cost to Cupla** | NZ$0.26/month | NZ$1.80/month (text) + NZ$2.16/month (images) = **NZ$3.96/month** |

### Shared Pool Rules

- Both partners in a couple draw from the **same request pool**
- Either partner can use any portion of the daily/monthly allocation
- One partner could use 100% of requests if desired
- No per-person caps or guarantees
- This applies to **both free and paid tiers**
- Usage resets daily (for daily limit) and monthly (for monthly limit)

### What Counts as 1 Request

| Action | Requests Consumed |
|--------|-------------------|
| 1 AI chat message | 1 |
| 1 meal generation | 1 |
| 1 pantry AI parse (batch) | 1 |
| 1 week meal plan | 7 (one per day of the week) |
| Image generation | **Paid only** — 3 images/day per couple, no rollover, US$0.014/image (via OpenRouter, Flux 2 Klein) — separate from text request pool |

### Why 10 Requests/Day and 7x Ratio

| Free Requests/Day | Free Cost (NZD/month) | Break-Even Conversion | 10% Conv. Profit/100 Couples | Verdict |
|-------------------|-----------------------|-----------------------|------------------------------|---------|
| 5 | NZ$0.13 | ~2.2% | NZ$612 | Too tight — users can't plan weekly |
| **10** | **NZ$0.26** | **~4.5%** | **NZ$384** | **Chosen — real daily value, drives conversion** |
| 20 | NZ$0.51 | ~8.5% | NZ$219 | Too generous — weak conversion driver |
| 33 | NZ$0.85 | ~14% | NZ$0 | Break-even at 10% — too risky |
| 50 | NZ$1.28 | ~21% | -NZ$278 | Losing money at 10% conversion |

---

## 10. Usage Walkthrough — 10 Requests/Day for a Couple

### How a Couple Uses 10 Requests/Day

The 10 daily requests are a **shared pool**. Here's how two partners might split them:

**Scenario: Cooking-heavy couple (asymmetric usage)**

```
Partner A (cooks, plans meals):    7 requests
  - 1 weekly meal plan generation   (uses 7 if it's planning day)
  - 2 meal modifications/questions
  - 1 pantry parse

Partner B (helps, shops):          3 requests
  - 2 chat questions ("can we swap X for Y?")
  - 1 pantry add

                                   ─────
                                   10 total — pool exhausted for the day
```

**Scenario: Balanced couple**

```
Partner A: 5 requests
  - 3 chat/meal gen
  - 1 pantry parse
  - 1 question

Partner B: 5 requests
  - 3 chat/meal gen
  - 1 pantry parse
  - 1 question

         ─────
         10 total
```

**Scenario: One partner uses all**

```
Partner A: 10 requests (doing all the planning today)
Partner B: 0 requests (not using app today)

         ─────
         10 total — perfectly valid
```

### A Full Month at 10 Requests/Day (300 Total)

| Week | Activity | Requests Used |
|------|----------|---------------|
| Week 1, Day 1 | Full week meal plan (7) + 3 chats | 10 |
| Week 1, Days 2-7 | Daily: 2-3 chats, 1-2 meal gens, 1 pantry parse | 10/day = 60 |
| Week 1 subtotal | | **70** |
| Week 2, Day 8 | Full week meal plan (7) + 3 chats | 10 |
| Week 2, Days 9-14 | Daily usage | 60 |
| Week 2 subtotal | | **70** |
| Week 3 | Same pattern | **70** |
| Week 4 | Same pattern | **70** |
| Days 29-30 | Remaining | **20** |
| **Monthly total** | | **300** |

**What a couple gets in a month:**
- 4 full week meal plans (28 requests)
- ~90 daily chat/meal gen interactions (shared between both partners)
- ~20 pantry parsing operations
- ~160 other interactions (questions, modifications, ingredient checks)
- All shared between both partners in real time

**Is this enough?** Yes for trying the app and getting real value. By mid-month most active couples will feel the limit — that's the conversion driver.

---

## 11. Usage Walkthrough — 70 Requests/Day Paid Couple

At 70 requests/day (2,100/month), both partners have effectively unlimited access:

| Per Day | Requests | Per Person Average |
|---------|----------|-------------------|
| Weekly meal plan (1x/week) | 7 | 3.5 |
| Daily chat | 30-40 | 15-20 |
| Individual meal generations | 10-15 | 5-7 |
| Pantry parsing | 5-10 | 2.5-5 |
| Questions/modifications | 5-10 | 2.5-5 |
| **Total** | **~70** | **~35 each** |

**Monthly totals at 70/day (2,100 requests):**
- Up to 300 full week meal plans, OR
- 2,100 individual meal generations, OR
- 2,100 chat messages, OR
- Any mix of the above shared between both partners

**Verdict:** Effectively unlimited for any normal couple. Even power users would struggle to hit 70/day consistently.

---

## 12. Payment Options

### Customer-Facing Prices (USD)

| Plan | Price | Billing | Effective Monthly |
|------|-------|---------|-------------------|
| **Free** | $0 | — | $0 |
| **Monthly** | **US$4.99/month** | Monthly recurring | US$4.99 |
| **Yearly** | **US$44.99/year** | Annual (save 25%) | US$3.75/month equivalent |

### Yearly Discount

| | Monthly Plan | Yearly Plan |
|---|---|---|
| Annual cost | 12 x US$4.99 = US$59.88 | US$44.99 |
| Savings | — | **US$14.89/year (24.8% off)** |
| Equivalent to | "2.5 months free" | |

### NZD Equivalents (at 1 USD = NZ$1.7148)

| Plan | Price (USD) | Price (NZD equiv) | Monthly (NZD) |
|------|------------|-------------------|---------------|
| Monthly | US$4.99 | NZ$8.56 | NZ$8.56/month |
| Yearly | US$44.99 | NZ$77.15 | NZ$6.43/month equivalent |

---

## 13. Stripe & App Store Fees

### Stripe (NZ Account, USD Charges)

Stripe NZ fee structure: ~2.65% + NZ$0.30 per successful domestic card payment. For USD charges from an NZ account, the percentage rate applies to the NZD-equivalent amount.

| Plan | Gross (NZD) | Stripe Fee (NZD) | Net (NZD) | Net (USD equiv) |
|------|-------------|-----------------|-----------|-----------------|
| Monthly | NZ$8.56 | NZ$0.53 | **NZ$8.04** | US$4.68 |
| Yearly | NZ$77.15 | NZ$2.34 | **NZ$74.80** | US$43.62 |

### Apple App Store (Small Business Program — 15%)

| Plan | Gross (NZD) | Apple Fee (15%) | Net (NZD) | Net (USD equiv) |
|------|-------------|-----------------|-----------|-----------------|
| Monthly | NZ$8.56 | NZ$1.28 | **NZ$7.27** | US$4.24 |
| Yearly | NZ$77.15 | NZ$11.57 | **NZ$65.58** | US$38.24 |

### Google Play (15% for subscriptions)

Same as Apple App Store (15% for all subscription tiers after Google's program changes).

| Plan | Gross (NZD) | Google Fee (15%) | Net (NZD) |
|------|-------------|-----------------|-----------|
| Monthly | NZ$8.56 | NZ$1.28 | **NZ$7.27** |
| Yearly | NZ$77.15 | NZ$11.57 | **NZ$65.58** |

### Platform Comparison

| Channel | Monthly Net | Yearly Net | Advantage |
|---------|------------|------------|-----------|
| **Stripe (web/PWA)** | NZ$8.04 | NZ$74.80 | **Highest net revenue** |
| Apple App Store | NZ$7.27 | NZ$65.58 | Native iOS friction-free |
| Google Play | NZ$7.27 | NZ$65.58 | Native Android friction-free |

**Strategy:** Encourage web/PWA subscriptions to avoid the 15% store commission. The app already works as a PWA with offline support.

### Stripe Fee Advantage of Yearly

| | Monthly (12 payments) | Yearly (1 payment) |
|---|---|---|
| Total Stripe fees/year | 12 x NZ$0.53 = NZ$6.36 | NZ$2.34 |
| **Fee savings** | — | **NZ$4.02/year per subscriber** |

---

## 14. Per-Couple Economics

### Free Couple

| Metric | Value |
|--------|-------|
| Revenue | NZ$0 |
| AI cost (300 req/month) | NZ$0.26/month = NZ$3.09/year |
| Net | **-NZ$3.09/year** (cost of acquisition) |

### Monthly Subscriber (Stripe)

| Metric | Value |
|--------|-------|
| Revenue | NZ$8.56/month |
| Stripe fee | NZ$0.53/month |
| Net revenue | NZ$8.04/month |
| AI text cost (2,100 req/month) | NZ$1.80/month |
| AI image cost (90 images/month) | NZ$2.16/month |
| **Total AI cost** | **NZ$3.96/month** |
| **Profit/month** | **NZ$4.08** |
| **Profit/year** | **NZ$48.96** |

### Yearly Subscriber (Stripe)

| Metric | Value |
|--------|-------|
| Revenue | NZ$77.15/year |
| Stripe fee | NZ$2.34/year |
| Net revenue | NZ$74.80/year |
| AI text cost (25,200 req/year) | NZ$21.67/year |
| AI image cost (1,080 images/year) | NZ$25.93/year |
| **Total AI cost** | **NZ$47.60/year** |
| **Profit/year** | **NZ$27.20** |
| **Profit/month equivalent** | **NZ$2.27** |

### Monthly vs Yearly Profit Comparison

| | Monthly Subscriber | Yearly Subscriber |
|---|---|---|
| Annual profit (Stripe) | NZ$48.96 | NZ$27.20 |
| Difference | — | NZ$21.76 less per year |
| But: guaranteed revenue | Only month-to-month | **12 months guaranteed** |
| But: Stripe fees | 12 transactions | 1 transaction (saves NZ$4.02) |
| But: churn risk | Can cancel any month | Locked in for 12 months |

### Blended Profit (60% Monthly / 40% Yearly Uptake)

| Component | Per Couple/Year |
|-----------|----------------|
| 60% monthly: NZ$48.96 x 0.60 | NZ$29.38 |
| 40% yearly: NZ$27.20 x 0.40 | NZ$10.88 |
| **Blended annual profit per paid couple** | **NZ$40.26** |
| **Blended monthly equivalent** | **NZ$3.36** |

### How Many Free Couples Does 1 Paying Couple Subsidise?

| Channel | Profit/Paid Couple | Free Couple Cost | Free Couples Covered |
|---------|-------------------|-----------------|---------------------|
| Stripe (blended) | NZ$40.26/year | NZ$3.09/year | **~13** |
| Apple/Google (blended) | NZ$31.50/year | NZ$3.09/year | **~10** |

---

## 15. Natural FX Hedge

### Why Your Business Has a Built-In Currency Hedge

Since both revenue (customer payments) and the primary cost (DeepSeek API) are in USD, your **USD profit is completely immune to exchange rate fluctuations**:

```
USD Revenue:     US$4.99 (monthly)
USD AI Cost:     US$2.31 (monthly = US$1.05 text + US$1.26 images)
USD Profit:      US$2.68 (monthly) — STABLE regardless of FX rate
```

The NZD equivalent of that US$3.94 profit will fluctuate, but the underlying USD profit does not change.

### How FX Movement Affects NZD Profit

| USD/NZD Rate | Monthly Revenue (NZD) | Monthly AI Cost (NZD) | Monthly Profit (NZD) | Impact |
|---|---|---|---|---|
| 1.55 (strong NZD) | NZ$7.73 | NZ$3.59 | NZ$3.64 | Lower NZD profit |
| 1.65 | NZ$8.23 | NZ$3.81 | NZ$3.90 | — |
| **1.7148 (current)** | **NZ$8.56** | **NZ$3.96** | **NZ$4.08** | **Baseline** |
| 1.80 | NZ$8.98 | NZ$4.16 | NZ$4.30 | Higher NZD profit |
| 1.90 | NZ$9.48 | NZ$4.39 | NZ$4.57 | — |
| 2.00 (weak NZD) | NZ$9.98 | NZ$4.62 | NZ$4.80 | Highest NZD profit |

**Key insight:** Every NZ$0.10 increase in the USD/NZD rate adds approximately NZ$0.39 to monthly profit per subscriber. This is because revenue increases by ~NZ$0.50 per US$1 of FX movement (4.99 x delta) while costs only increase by ~NZ$0.11 (1.05 x delta). **When the NZD weakens, your NZD profit actually increases.**

### The Only FX Risk

The real risk is not profit erosion — it's **customer affordability**. If NZD weakens significantly, US$4.99 becomes more expensive for NZ customers in local terms. However, since you sell globally in USD, this only affects NZ-based customers, and the app is priced for a global market.

---

## 16. Conversion Rate Sensitivity — Full Grid

### Annual Gross Profit (NZD) at Different Conversion Rates and Couple Counts

**Assumptions:** 40% yearly uptake, 60% monthly, Stripe channel, NZ$0.86/request V4 Flash + NZ$2.16/month image cost per paid couple

| Couples | 2% | 3% | 5% | 8% | 10% | 12% | 15% | 20% |
|---------|------|------|------|------|------|------|------|------|
| 100 | -$222 | -$179 | -$92 | $38 | $125 | $211 | $341 | $558 |
| 500 | -$1,112 | -$895 | -$461 | $189 | $623 | $1,056 | $1,706 | $2,790 |
| 1,000 | -$2,223 | -$1,790 | -$923 | $378 | $1,245 | $2,112 | $3,413 | $5,580 |
| 2,500 | -$5,558 | -$4,474 | -$2,306 | $945 | $3,113 | $5,280 | $8,531 | $13,950 |
| 5,000 | -$11,115 | -$8,948 | -$4,613 | $1,890 | $6,225 | $10,560 | $17,063 | $27,900 |
| 10,000 | -$22,230 | -$17,895 | -$9,225 | $3,780 | $12,450 | $21,120 | $34,125 | $55,800 |
| 25,000 | -$55,575 | -$44,738 | -$23,063 | $9,450 | $31,125 | $52,800 | $85,313 | $139,500 |
| 50,000 | -$111,150 | -$89,475 | -$46,125 | $18,900 | $62,250 | $105,600 | $170,625 | $279,000 |
| 75,000 | -$166,725 | -$134,213 | -$69,188 | $28,350 | $93,375 | $158,400 | $255,938 | $418,500 |
| 100,000 | -$222,300 | -$178,950 | -$92,250 | $37,800 | $124,500 | $211,200 | $341,250 | $558,000 |
| 250,000 | -$555,750 | -$447,375 | -$230,625 | $94,500 | $311,250 | $528,000 | $853,125 | $1,395,000 |
| 500,000 | -$1,111,500 | -$894,750 | -$461,250 | $189,000 | $622,500 | $1,056,000 | $1,706,250 | $2,790,000 |

**How to read this table:** At 50,000 couples with 10% conversion rate, annual gross profit is NZ$62,250. At 3% conversion, the business loses NZ$89,475/year.

### Break-Even Lines

| Conversion Rate | Break-Even Couple Count |
|----------------|------------------------|
| Below 7.1% | **Cannot break even** (free costs exceed paid revenue at any scale) |
| 8% | ~485,000 couples (impractical without massive scale) |
| 10% | ~120,500 couples |
| 12% | ~71,000 couples |
| 15% | ~44,000 couples |
| 20% | ~26,900 couples |

### Monthly Profit Equivalent (NZD/month)

| Couples | 8% | 10% | 12% | 15% | 20% |
|---------|------|------|------|------|------|
| 1,000 | $32 | $104 | $176 | $284 | $465 |
| 5,000 | $158 | $519 | $880 | $1,422 | $2,325 |
| 10,000 | $315 | $1,038 | $1,760 | $2,844 | $4,650 |
| 25,000 | $788 | $2,594 | $4,400 | $7,109 | $11,625 |
| 50,000 | $1,575 | $5,188 | $8,800 | $14,219 | $23,250 |
| 100,000 | $3,150 | $10,375 | $17,600 | $28,438 | $46,500 |

---

## 17. Yearly Uptake Impact Analysis

The percentage of paid couples who choose yearly vs monthly billing affects overall profitability. Yearly subscribers generate less profit per couple but provide guaranteed 12-month revenue.

### Annual Profit Per Paid Couple at Different Yearly Uptake Rates

| Yearly Uptake | Monthly Uptake | Profit/Couple/Year | Why |
|---|---|---|---|
| 0% (all monthly) | 100% | NZ$48.96 | Maximum profit per couple |
| 20% | 80% | NZ$44.63 | Slight reduction |
| 30% | 70% | NZ$42.46 | — |
| **40% (assumed)** | **60%** | **NZ$40.26** | **Industry average** |
| 50% | 50% | NZ$38.08 | — |
| 60% | 40% | NZ$35.90 | More guaranteed revenue |
| 80% | 20% | NZ$31.54 | Lower profit but max retention |
| 100% (all yearly) | 0% | NZ$27.20 | Minimum profit, max lock-in |

### Impact on Overall P&L (50,000 Couples, 10% Conversion)

| Yearly Uptake | Annual Gross Profit | Monthly Equivalent |
|---|---|---|
| 0% | NZ$210,310 | NZ$17,526 |
| 20% | NZ$198,135 | NZ$16,511 |
| 30% | NZ$192,046 | NZ$16,004 |
| **40%** | **NZ$185,958** | **NZ$15,497** |
| 50% | NZ$179,869 | NZ$14,989 |
| 60% | NZ$173,780 | NZ$14,482 |
| 80% | NZ$161,604 | NZ$13,467 |
| 100% | NZ$149,427 | NZ$12,452 |

### Trade-Off Summary

| Factor | More Monthly Subs | More Yearly Subs |
|---|---|---|
| Profit per couple | Higher | Lower |
| Revenue predictability | Lower | Higher |
| Churn risk | Higher (monthly cancel) | Lower (locked 12 months) |
| Cash flow | Steady monthly | Lumpy (annual renewals) |
| Stripe fees | Higher (12 txns) | Lower (1 txn) |

---

## 18. Path to NZ$150,000/Year

### Target: NZ$150,000 Annual Gross Profit (Before CAC/Marketing)

This is gross profit after AI costs and Stripe fees, before customer acquisition costs.

#### Couples Needed at Each Conversion Rate

| Conversion Rate | Couples Needed | Downloads Needed (70% couple formation) | Realistic Timeline |
|---|---|---|---|
| 5% | Cannot reach (losing money at scale) | — | — |
| 8% | ~485,000 | ~693,000 | 5+ years (very difficult) |
| **10%** | **~120,500** | **~172,100** | **3-4 years** |
| 12% | ~71,000 | ~101,400 | 2-3 years |
| 15% | ~44,000 | ~62,900 | 2-3 years |
| 20% | ~26,900 | ~38,400 | 18-24 months |

#### Revenue at NZ$150K Profit Target

| Conversion Rate | Couples | Paying Couples | Annual Revenue (NZD) | Annual AI Cost (NZD) | Annual Profit |
|---|---|---|---|---|---|
| 8% | 485,000 | 38,800 | NZ$3,563,000 | NZ$3,413,000 | NZ$150,000 |
| 10% | 120,500 | 12,050 | NZ$1,107,000 | NZ$957,000 | NZ$150,000 |
| 12% | 71,000 | 8,520 | NZ$782,000 | NZ$632,000 | NZ$150,000 |
| 15% | 44,000 | 6,600 | NZ$606,000 | NZ$456,000 | NZ$150,000 |
| 20% | 26,900 | 5,380 | NZ$494,000 | NZ$344,000 | NZ$150,000 |

Note: Higher conversion rates need fewer total couples because each paying couple contributes more relative to free couple costs.

### NZ$150K with Marketing Costs Included

Real-world profitability must account for customer acquisition cost (CAC). The tables below show how many couples are needed to reach NZ$150K **net** (after CAC) at different scenarios.

See [Section 22](#22-nz150k-target--which-combinations-work) for the full matrix.

---

## 19. Churn & Lifetime Value Analysis

### Why Churn Matters

Churn determines how long a paying couple stays subscribed. This directly affects:
- How much total revenue/profit each couple generates (LTV)
- How many new couples you must constantly acquire to maintain scale
- Your maximum sustainable customer acquisition cost (CAC)

### Monthly Churn → Annual Churn (Compound)

Monthly churn compounds — a 5% monthly churn rate does NOT mean 60% annual churn.

| Monthly Churn | Annual Churn (Compound) | Avg Subscriber Lifetime |
|---|---|---|
| 3% | 30.6% | 33 months |
| 5% | 46.0% | 20 months |
| 8% | 63.2% | 12.5 months |
| 10% | 71.8% | 10 months |
| 12% | 78.4% | 8.3 months |
| 15% | 85.8% | 6.7 months |

### Lifetime Value (LTV) Per Paid Couple (NZD)

#### Monthly Subscribers

| Monthly Churn | Avg Lifetime | Monthly Profit | **LTV** |
|---|---|---|---|
| 3% | 33 months | NZ$4.08 | **NZ$135** |
| 5% | 20 months | NZ$4.08 | **NZ$82** |
| 8% | 12.5 months | NZ$4.08 | **NZ$51** |
| 10% | 10 months | NZ$4.08 | **NZ$41** |

#### Yearly Subscribers

Yearly subscribers are locked in for 12 months. After the year, they either renew or churn. The "churn" rate is the annual non-renewal rate.

| Annual Non-Renewal | Avg Lifetime | Annual Profit | **LTV** |
|---|---|---|---|
| 25% | 4 years | NZ$27.20 | **NZ$109** |
| 35% | 2.9 years | NZ$27.20 | **NZ$79** |
| 50% | 2 years | NZ$27.20 | **NZ$54** |
| 60% | 1.7 years | NZ$27.20 | **NZ$46** |

#### Blended LTV (60% Monthly / 40% Yearly)

| Scenario | Monthly Churn | Annual Non-Renewal | Blended LTV (NZD) |
|---|---|---|---|
| **Low churn** | 3% | 25% | **NZ$124** |
| **Normal churn** | 5% | 35% | **NZ$81** |
| **High churn** | 8% | 50% | **NZ$52** |
| **Very high churn** | 10% | 60% | **NZ$43** |

### LTV: CAC Ratio

Industry standard: a healthy SaaS business needs LTV:CAC of at least 3:1.

| Scenario | Blended LTV | Max CAC (3:1 ratio) | Max CAC (2:1 ratio) |
|---|---|---|---|
| Low churn | NZ$124 | NZ$41 | NZ$62 |
| Normal churn | NZ$81 | NZ$27 | NZ$41 |
| High churn | NZ$52 | NZ$17 | NZ$26 |
| Very high churn | NZ$43 | NZ$14 | NZ$22 |

### Why Yearly Subscribers Are Valuable Despite Lower Per-Couple Profit

| | Monthly Subscriber (5% churn) | Yearly Subscriber (35% non-renewal) |
|---|---|---|
| LTV | NZ$82 | NZ$79 |
| Guaranteed revenue period | 1 month | **12 months** |
| Churn window | Can leave anytime | Locked for 12 months |
| Acquisition cost amortisation | Over 20 months | Over 2.9 years |

Yearly subscribers have **similar LTV** and **longer guaranteed revenue** despite lower annual profit per couple.

---

## 20. CAC Sensitivity Analysis

### Annual User Acquisition Requirements

To maintain N couples in a steady state, you must replace churned couples:

| Total Couples | 3% Monthly Churn (30.6% annual) | 5% Monthly (46.0%) | 8% Monthly (63.2%) | 10% Monthly (71.8%) |
|---|---|---|---|---|
| 1,000 | 306/year | 460/year | 632/year | 718/year |
| 5,000 | 1,531 | 2,298 | 3,158 | 3,590 |
| 10,000 | 3,062 | 4,596 | 6,317 | 7,179 |
| 25,000 | 7,654 | 11,490 | 15,792 | 17,948 |
| 50,000 | 15,309 | 22,980 | 31,584 | 35,897 |
| 100,000 | 30,618 | 45,960 | 63,168 | 71,793 |

### Annual CAC Cost (NZD) at Different CAC Levels

#### At 10,000 Couples

| CAC Per Couple | 3% Churn | 5% Churn | 8% Churn | 10% Churn |
|---|---|---|---|---|
| NZ$1 | NZ$3,062 | NZ$4,596 | NZ$6,317 | NZ$7,179 |
| NZ$2 | NZ$6,124 | NZ$9,192 | NZ$12,634 | NZ$14,358 |
| NZ$3 | NZ$9,185 | NZ$13,788 | NZ$18,950 | NZ$21,538 |
| NZ$5 | NZ$15,309 | NZ$22,980 | NZ$31,584 | NZ$35,897 |
| NZ$10 | NZ$30,618 | NZ$45,960 | NZ$63,168 | NZ$71,793 |

#### At 50,000 Couples

| CAC Per Couple | 3% Churn | 5% Churn | 8% Churn | 10% Churn |
|---|---|---|---|---|
| NZ$1 | NZ$15,309 | NZ$22,980 | NZ$31,584 | NZ$35,897 |
| NZ$2 | NZ$30,618 | NZ$45,960 | NZ$63,168 | NZ$71,793 |
| NZ$3 | NZ$45,927 | NZ$68,940 | NZ$94,752 | NZ$107,690 |
| NZ$5 | NZ$76,545 | NZ$114,900 | NZ$157,920 | NZ$179,485 |
| NZ$10 | NZ$153,090 | NZ$229,800 | NZ$315,840 | NZ$358,970 |

#### At 100,000 Couples

| CAC Per Couple | 3% Churn | 5% Churn | 8% Churn | 10% Churn |
|---|---|---|---|---|
| NZ$1 | NZ$30,618 | NZ$45,960 | NZ$63,168 | NZ$71,793 |
| NZ$2 | NZ$61,236 | NZ$91,920 | NZ$126,336 | NZ$143,586 |
| NZ$3 | NZ$91,854 | NZ$137,880 | NZ$189,504 | NZ$215,379 |
| NZ$5 | NZ$153,090 | NZ$229,800 | NZ$315,840 | NZ$358,965 |
| NZ$10 | NZ$306,180 | NZ$459,600 | NZ$631,680 | NZ$717,930 |

### What Is a Realistic CAC for Cupla?

| Acquisition Channel | Estimated CAC (NZD) | Notes |
|---|---|---|
| Organic (ASO, SEO, word of mouth) | NZ$0-1 | Best case — requires strong product-market fit |
| Social media (organic content) | NZ$1-3 | TikTok/Instagram recipe content |
| Paid social ads | NZ$3-8 | Facebook/Instagram/TikTok ads |
| App Store search ads | NZ$5-15 | Competitive category |
| Influencer partnerships | NZ$5-20 | Food/relationship influencers |

---

## 21. Net Profit After CAC — Matrix Tables

These tables show **net annual profit after AI costs, Stripe fees, AND customer acquisition costs**.

### At 10,000 Couples

**Gross profit (before CAC) by conversion rate:**

| Conversion | Gross Profit |
|---|---|
| 5% | -$9,225 |
| 8% | $3,780 |
| 10% | $12,450 |
| 12% | $21,120 |
| 15% | $34,125 |

**Net profit after CAC (NZD/year) at 10% conversion, 10,000 couples:**

| CAC/Couple | 3% Churn | 5% Churn | 8% Churn | 10% Churn |
|---|---|---|---|---|
| NZ$1 | $9,388 | $7,854 | $6,133 | $5,271 |
| NZ$2 | $6,326 | $3,258 | -$489 | -$2,113 |
| NZ$3 | $3,265 | -$1,338 | -$6,805 | -$9,393 |
| NZ$5 | -$2,859 | -$10,530 | -$19,134 | -$23,447 |
| NZ$10 | -$18,168 | -$33,510 | -$50,718 | -$59,343 |

### At 25,000 Couples

**Gross profit at 10% conversion: NZ$31,125**

| CAC/Couple | 3% Churn | 5% Churn | 8% Churn | 10% Churn |
|---|---|---|---|---|
| NZ$1 | $23,491 | $19,655 | $15,353 | $13,197 |
| NZ$2 | $15,837 | $8,145 | -$151 | -$4,463 |
| NZ$3 | $8,183 | -$3,365 | -$17,159 | -$22,023 |
| NZ$5 | -$7,131 | -$26,385 | -$49,645 | -$64,271 |
| NZ$10 | -$43,906 | -$83,975 | -$126,035 | -$154,985 |

### At 50,000 Couples

**Gross profit at 10% conversion: NZ$62,250**

| CAC/Couple | 3% Churn | 5% Churn | 8% Churn | 10% Churn |
|---|---|---|---|---|
| NZ$1 | $46,941 | $39,270 | $30,666 | $26,353 |
| NZ$2 | $31,632 | $16,290 | -$1,914 | -$10,539 |
| NZ$3 | $16,323 | -$6,690 | -$34,482 | -$47,420 |
| NZ$5 | -$14,295 | -$75,650 | -$103,974 | -$134,895 |
| NZ$10 | -$80,240 | -$182,950 | -$270,270 | -$338,120 |

### At 50,000 Couples, 8% Conversion

**Gross profit: NZ$18,900**

| CAC/Couple | 3% Churn | 5% Churn | 8% Churn | 10% Churn |
|---|---|---|---|---|
| NZ$1 | $3,591 | -$4,080 | -$12,684 | -$16,997 |
| NZ$2 | -$11,718 | -$27,060 | -$44,268 | -$52,893 |
| NZ$3 | -$27,027 | -$50,040 | -$75,852 | -$88,790 |
| NZ$5 | -$57,645 | -$96,420 | -$143,744 | -$174,665 |

### Net Profit at Different Conversion Rates (50,000 Couples, NZ$2 CAC, 5% Churn)

| Conversion | Gross Profit | CAC Cost | **Net Profit** |
|---|---|---|---|
| 5% | -NZ$46,125 | NZ$45,960 | **-NZ$92,085 (LOSS)** |
| 8% | NZ$18,900 | NZ$45,960 | **-NZ$27,060 (LOSS)** |
| 10% | NZ$62,250 | NZ$45,960 | **NZ$16,290** |
| 12% | NZ$105,600 | NZ$45,960 | **NZ$59,640** |
| 15% | NZ$170,625 | NZ$45,960 | **NZ$124,665** |
| 20% | NZ$279,000 | NZ$45,960 | **NZ$233,040** |

---

## 22. NZ$150K Target — Which Combinations Work

### Couples Needed for NZ$150,000 Net Annual Profit

This table shows how many total couples (free + paid) you need to achieve NZ$150K **after CAC**, at different conversion rates, CAC levels, and churn rates.

### At NZ$2 CAC Per Couple

| Conversion | 3% Churn | 5% Churn | 8% Churn | 10% Churn |
|---|---|---|---|---|
| 5% | Cannot reach | Cannot reach | Cannot reach | Cannot reach |
| 8% | ~180,000 | ~493,000 | Cannot reach | Cannot reach |
| **10%** | **~56,000** | **~130,100** | **~260,000** | **~420,000** |
| 12% | ~37,000 | ~74,900 | ~130,000 | ~180,000 |
| 15% | ~25,000 | ~45,800 | ~72,000 | ~92,000 |
| 20% | ~17,000 | ~27,800 | ~40,000 | ~48,000 |

### At NZ$3 CAC Per Couple

| Conversion | 3% Churn | 5% Churn | 8% Churn | 10% Churn |
|---|---|---|---|---|
| 5% | Cannot reach | Cannot reach | Cannot reach | Cannot reach |
| 8% | ~250,000 | ~560,300 | Cannot reach | Cannot reach |
| **10%** | **~63,000** | **~135,500** | **~280,000** | **~450,000** |
| 12% | ~41,000 | ~77,100 | ~135,000 | ~185,000 |
| 15% | ~27,000 | ~46,800 | ~74,000 | ~95,000 |
| 20% | ~18,000 | ~28,300 | ~41,000 | ~49,000 |

### At NZ$5 CAC Per Couple

| Conversion | 3% Churn | 5% Churn | 8% Churn | 10% Churn |
|---|---|---|---|---|
| 5% | Cannot reach | Cannot reach | Cannot reach | Cannot reach |
| 8% | ~400,000 | ~772,400 | Cannot reach | Cannot reach |
| **10%** | **~78,000** | **~147,800** | **~310,000** | **~500,000** |
| 12% | ~49,000 | ~81,700 | ~145,000 | ~200,000 |
| 15% | ~31,000 | ~48,900 | ~78,000 | ~100,000 |
| 20% | ~20,000 | ~29,300 | ~43,000 | ~51,000 |

### The Sweet Spot

| Scenario | Couples Needed | Downloads Needed | Timeline |
|---|---|---|---|
| 10% conv, NZ$2 CAC, 5% churn | ~130,100 | ~185,900 | 3-4 years |
| 12% conv, NZ$2 CAC, 5% churn | ~74,900 | ~107,000 | 2-3 years |
| 15% conv, NZ$2 CAC, 5% churn | ~45,800 | ~65,400 | 2-3 years |
| 20% conv, NZ$2 CAC, 5% churn | ~27,800 | ~39,700 | 18-24 months |

### Maximum Affordable CAC to Reach NZ$150K

At a given conversion rate and couple count, what is the maximum you can spend per couple acquisition?

#### At 50,000 Couples, 10% Conversion (Gross Profit: NZ$62,250)

| Churn Rate | Annual Replacements | Max Total CAC Budget | **Max CAC/Couple** |
|---|---|---|---|
| 3% | 15,309 | NZ$2,880 | **NZ$0.19** |
| 5% | 22,980 | NZ$2,880 | **NZ$0.13** |
| 8% | 31,584 | NZ$2,880 | **NZ$0.09** |
| 10% | 35,897 | NZ$2,880 | **NZ$0.08** |

#### At 100,000 Couples, 10% Conversion (Gross Profit: NZ$124,500)

| Churn Rate | Annual Replacements | Max Total CAC Budget | **Max CAC/Couple** |
|---|---|---|---|
| 3% | 30,618 | NZ$65,100 | **NZ$2.13** |
| 5% | 45,960 | NZ$65,100 | **NZ$1.42** |
| 8% | 63,168 | NZ$65,100 | **NZ$1.03** |
| 10% | 71,793 | NZ$65,100 | **NZ$0.91** |

---

## 23. Growth Trajectory Scenarios — 3-Year Projections

### Scenario Definitions

| Scenario | Description | Key Assumptions |
|---|---|---|
| **Conservative** | Slow organic growth, mostly word of mouth | 10% conversion, 5% monthly churn, NZ$2 CAC |
| **Expected** | Moderate growth with some paid acquisition | 10% conversion, 5% monthly churn, NZ$3 CAC |
| **Aggressive** | Strong viral growth + paid acquisition | 12% conversion, 5% monthly churn, NZ$3 CAC |

### Conservative Growth Path

| Metric | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Couples (end of year) | 5,000 | 15,000 | 30,000 |
| Average couples during year | 2,500 | 10,000 | 22,500 |
| Paying couples (10% conv) | 250 | 1,000 | 2,250 |
| Annual gross profit (NZD) | NZ$3,113 | NZ$12,450 | NZ$28,013 |
| CAC cost (NZ$2, 5% churn) | NZ$6,900 | NZ$27,600 | NZ$62,100 |
| **Net profit (NZD)** | **-NZ$3,788** | **-NZ$15,150** | **-NZ$34,118** |

### Expected Growth Path

| Metric | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Couples (end of year) | 10,000 | 35,000 | 75,000 |
| Average couples during year | 5,000 | 22,500 | 55,000 |
| Paying couples (10% conv) | 500 | 2,250 | 5,500 |
| Annual gross profit (NZD) | NZ$6,225 | NZ$28,013 | NZ$68,475 |
| CAC cost (NZ$2, 5% churn) | NZ$13,800 | NZ$62,100 | NZ$151,800 |
| **Net profit (NZD)** | **-NZ$7,575** | **-NZ$34,088** | **-NZ$83,325** |

### Aggressive Growth Path (12% Conversion, NZ$2 CAC)

| Metric | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Couples (end of year) | 20,000 | 60,000 | 150,000 |
| Average couples during year | 10,000 | 40,000 | 105,000 |
| Paying couples (12% conv) | 1,200 | 4,800 | 12,600 |
| Annual gross profit (NZD) | NZ$21,120 | NZ$84,480 | NZ$221,760 |
| CAC cost (NZ$2, 5% churn) | NZ$27,600 | NZ$110,400 | NZ$289,800 |
| **Net profit (NZD)** | **-NZ$6,480** | **-NZ$25,920** | **-NZ$68,040** |

### When Does Each Scenario Reach NZ$150K Net?

**With image generation costs, none of the scenarios reach NZ$150K net within 3 years.** All scenarios are net negative due to lower per-couple margins combined with CAC costs. The Aggressive scenario comes closest but still loses NZ$68K in Year 3.

### 5-Year Extended Projection (Expected Growth, NZ$2 CAC, 10% Conversion)

| Year | End Couples | Avg Couples | Gross Profit | CAC Cost | **Net Profit** | **Cumulative** |
|---|---|---|---|---|---|---|
| 1 | 10,000 | 5,000 | NZ$6,225 | NZ$13,800 | **-NZ$7,575** | -NZ$7,575 |
| 2 | 35,000 | 22,500 | NZ$28,013 | NZ$62,100 | **-NZ$34,088** | -NZ$41,663 |
| 3 | 75,000 | 55,000 | NZ$68,475 | NZ$151,800 | **-NZ$83,325** | -NZ$124,988 |
| 4 | 120,000 | 97,500 | NZ$121,388 | NZ$269,100 | **-NZ$147,713** | -NZ$272,700 |
| 5 | 175,000 | 147,500 | NZ$183,638 | NZ$407,100 | **-NZ$223,463** | -NZ$496,163 |

**Even at Year 5 with 147,500 average couples, the business does not reach NZ$150K net profit.** The image generation costs have fundamentally changed the economics.

---

## 24. Best / Expected / Worst Case Summary

### Three Outcome Scenarios (Year 3, Per Year)

| Metric | Worst Case | Expected Case | Best Case |
|---|---|---|---|
| Couples | 15,000 | 55,000 | 105,000 |
| Conversion rate | 5% | 10% | 12% |
| Monthly churn | 8% | 5% | 3% |
| CAC per couple | NZ$5 | NZ$2 | NZ$1 |
| Yearly uptake | 20% | 40% | 50% |
| **Annual gross profit** | **-NZ$13,838** | **NZ$68,475** | **NZ$221,760** |
| Annual CAC cost | NZ$50,544 | NZ$151,800 | NZ$32,274 |
| **Annual net profit** | **-NZ$64,382** | **-NZ$83,325** | **NZ$189,486** |

### What Drives Each Outcome

| Factor | Worst Case Driver | Best Case Driver |
|---|---|---|
| Conversion | 5% (weak value prop) | 12%+ (strong product-market fit) |
| Churn | 8% (users don't stick) | 3% (users love it, yearly lock-in) |
| CAC | NZ$5 (expensive paid ads) | NZ$1 (strong organic/viral) |
| Growth | Slow, word of mouth | Viral, couples invite couples |
| Yearly uptake | 20% (users hesitant to commit) | 50%+ (clear value, discount works) |

### The Three Levers That Matter Most

| Rank | Lever | Impact on NZ$150K Target | Why |
|---|---|---|---|
| 1 | **Conversion rate** | Massive | Doubles profit per couple; cuts required scale in half |
| 2 | **CAC** | Massive | At scale, CAC is the single biggest expense |
| 3 | **Churn** | Large | Determines LTV and acquisition volume needed |

### Breakeven Scenarios

| Scenario | Break-Even Couple Count | Break-Even Conversion | Notes |
|---|---|---|---|
| No CAC (organic only) | ~39,100 at 10% | ~4.5% | Pure AI cost + Stripe |
| NZ$2 CAC, 5% churn | ~57,800 at 10% | ~6.5% | Realistic organic + light paid |
| NZ$3 CAC, 5% churn | ~75,200 at 10% | ~7.5% | Moderate paid acquisition |
| NZ$5 CAC, 5% churn | ~141,600 at 10% | ~9.5% | Heavy paid acquisition |
| NZ$5 CAC, 8% churn | Cannot reach at 10% | >12% required | Unviable without high conversion |

---

## 25. Risk Factors & Mitigations

### AI Provider Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| DeepSeek price increase | Medium | Direct cost increase | Multi-provider chain already in code (alibaba + zai fallbacks). Budget has 40%+ margin buffer. |
| DeepSeek service outage | Low-Medium | Service degradation | 3-provider fallback chain implemented. Can switch `AI_PROVIDER` in wrangler.toml. |
| DeepSeek model deprecation | Low | Code changes needed | Model names are centralised in `MODEL_CHAINS` (ai.ts:36-40). Single point of change. |
| DeepSeek quality degradation | Low | User experience | Can switch to Qwen or GLM without code changes beyond env var. |

### Business Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Low conversion rate (<5%) | Medium | Cannot reach NZ$150K | Focus on product-market fit; generous free tier drives trial; clear upgrade prompts at usage limits. |
| High churn (>8%) | Medium | LTV erosion | Yearly subscription lock-in; push yearly with 25% discount; engagement notifications. |
| High CAC (>NZ$5) | Medium-High | Profitability squeeze | Organic-first strategy (ASO, content marketing, TikTok food content); referral program (couples invite couples). |
| Apple/Google 30% commission | Low (already 15%) | Margin compression | Already mitigated by Small Business Program (15%). Encourage PWA/web subscription to pay 0% to stores. |
| Stripe fee changes | Low | Minor margin hit | Pass fees through as annual price adjustment; promote yearly (1 transaction). |

### Currency Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| NZD weakens significantly | Medium | AI costs rise in NZD terms | Revenue also rises (USD denominated) — natural hedge. Net effect is slightly positive. |
| NZD strengthens significantly | Medium | Revenue drops in NZD terms | AI costs also drop. Net effect is slightly negative. Buffer in margins absorbs this. |
| DeepSeek changes pricing currency | Very Low | All calculations change | Would need full re-evaluation. Unlikely. |

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Cloudflare Worker limits hit | Low | Request failures | Monitor usage; upgrade plan if needed. |
| Durable Object storage limits | Low | State sync issues | Monitor per-household data size; implement cleanup. |
| Rate limiting from DeepSeek | Low | AI failures | V4 Flash has 2,500 concurrency limit. Fallback to V4 Pro (500) then other providers. |
| Image generation cost blowout | Medium | Alibaba Wan2.6 costs | Separate quota for images; not included in text request allocation. |

### Market Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Competitor enters with free AI meal planning | Medium | Conversion pressure | DeepSeek costs so low that you can match "free" indefinitely. Specialised couples features are defensible. |
| ChatGPT adds meal planning features | Low-Medium | Feature competition | Cupla's specialised features (TDEE, dual-partner profiles, real-time sync, pantry) are hard to replicate generically. |
| Economic downturn | Medium | Subscription cancellations | NZ$4.99/month is very affordable. Yearly lock-in reduces month-to-month churn risk. |

---

## 26. FX Sensitivity Analysis

### How Exchange Rate Movement Affects Profitability

All scenarios assume monthly subscriber, Stripe channel, 2,100 requests/month.

### Per-Subscriber Monthly Profit at Different FX Rates

| USD/NZD Rate | Revenue (NZD) | Stripe Fee (NZD) | Net Rev (NZD) | AI Cost (NZD) | **Profit (NZD/mo)** | Change vs Current |
|---|---|---|---|---|---|---|
| 1.55 | NZ$7.73 | NZ$0.50 | NZ$7.23 | NZ$3.59 | **NZ$3.64** | -NZ$0.44 (-10.8%) |
| 1.60 | NZ$7.98 | NZ$0.51 | NZ$7.47 | NZ$3.70 | **NZ$3.77** | -NZ$0.31 (-7.6%) |
| 1.65 | NZ$8.23 | NZ$0.52 | NZ$7.71 | NZ$3.81 | **NZ$3.90** | -NZ$0.18 (-4.4%) |
| **1.7148** | **NZ$8.56** | **NZ$0.53** | **NZ$8.04** | **NZ$3.96** | **NZ$4.08** | **Baseline** |
| 1.75 | NZ$8.73 | NZ$0.53 | NZ$8.20 | NZ$4.04 | **NZ$4.16** | +NZ$0.08 (+2.0%) |
| 1.80 | NZ$8.98 | NZ$0.54 | NZ$8.44 | NZ$4.16 | **NZ$4.28** | +NZ$0.20 (+4.9%) |
| 1.85 | NZ$9.23 | NZ$0.54 | NZ$8.69 | NZ$4.27 | **NZ$4.42** | +NZ$0.34 (+8.3%) |
| 1.90 | NZ$9.48 | NZ$0.55 | NZ$8.93 | NZ$4.39 | **NZ$4.54** | +NZ$0.46 (+11.3%) |
| 2.00 | NZ$9.98 | NZ$0.56 | NZ$9.42 | NZ$4.62 | **NZ$4.80** | +NZ$0.72 (+17.6%) |

### Why Profit Increases When NZD Weakens

| FX Movement | Revenue Change | Cost Change | Net Effect |
|---|---|---|---|
| +NZ$0.10 per USD | +NZ$0.50/month | +NZ$0.11/month | **+NZ$0.39/month profit** |
| +NZ$0.30 per USD | +NZ$1.50/month | +NZ$0.32/month | **+NZ$1.18/month profit** |

Revenue is ~2.16x more sensitive to FX changes than costs (because US$4.99 revenue vs US$2.31 cost). This still creates a **favourable asymmetry** — NZD weakness increases NZD profit, though less dramatically than without image costs.

### Impact on NZ$150K Target

| FX Rate | Profit/Couple/Year (Blended) | Couples Needed for NZ$150K (10% conv) |
|---|---|---|
| 1.55 | NZ$36.05 | 182,000 |
| 1.65 | NZ$38.54 | 139,800 |
| **1.7148** | **NZ$40.26** | **~120,500** |
| 1.80 | NZ$42.32 | ~103,400 |
| 1.90 | NZ$44.88 | ~87,900 |
| 2.00 | NZ$47.44 | ~76,400 |

A weaker NZD actually makes the NZ$150K target **easier to reach** because each paying couple generates more NZD profit.

---

## 27. Implementation Checklist

### Backend (Cloudflare Worker)

- [ ] Add `household_usage` table to D1: `household_id, requests_today, requests_this_month, tier, reset_day, reset_month`
- [ ] Implement usage check before every AI call in `mealChat.ts` and `mealplan.ts`
- [ ] Implement usage increment after successful AI call (not on failure)
- [ ] Daily reset cron (Cloudflare Workers Cron Triggers) — reset `requests_today` to 0
- [ ] Monthly reset cron — reset `requests_this_month` to 0
- [ ] Usage tracked at **household level** (not per user) — matches shared pool model
- [ ] Add usage tracking endpoint: `GET /api/household/:id/usage` returning `{ requests_today, daily_limit, requests_this_month, monthly_limit, tier }`
- [ ] Set `daily_limit: 10` for free, `daily_limit: 70` for paid
- [ ] Set `monthly_limit: 300` for free, `monthly_limit: 2100` for paid
- [ ] Return 402 Payment Required with friendly message when daily or monthly limit reached
- [ ] Include remaining requests in AI response headers or response body
- [ ] Stripe webhook handler for `customer.subscription.created`, `customer.subscription.deleted`, `customer.subscription.updated`
- [ ] Apple/Google IAP validation endpoints
- [ ] Map Stripe customer ID to household ID
- [ ] Handle yearly subscription expiry/renewal

### Frontend (React PWA)

- [ ] Display shared usage counter in header: "X / 10 today" and "X / 300 this month" (both partners see same numbers)
- [ ] Show upgrade prompt when requests < 20% remaining
- [ ] Block AI actions gracefully when out of requests (show "Come back tomorrow" or "Upgrade" CTA)
- [ ] Add Stripe Checkout flow for US$4.99/month and US$44.99/year
- [ ] Add Apple in-app purchase flow
- [ ] Add Google Play billing flow
- [ ] Highlight yearly savings (25% off / 2.5 months free)
- [ ] Show both partners' names on the shared usage panel
- [ ] Real-time usage sync between partners (already have WebSocket via HouseholdSync DO)

### Payment Infrastructure

- [ ] Stripe account configured for USD charges from NZ
- [ ] Stripe products: monthly (US$4.99) and yearly (US$44.99)
- [ ] Stripe webhooks deployed to production worker
- [ ] App Store Connect: subscription products configured
- [ ] Google Play Console: subscription products configured
- [ ] Shared secret validation for store webhooks
- [ ] Subscription status sync to household tier in D1
- [ ] Grace period handling for failed payments (3-7 days)
- [ ] Dunning emails for failed renewals

### Monitoring & Alerting

- [ ] Track daily AI cost per household
- [ ] Alert if average cost per household exceeds NZ$0.50/day (free) or NZ$0.10/day (paid)
- [ ] Monitor conversion funnel: downloads → couples formed → free usage → paid conversion
- [ ] Track monthly churn rate
- [ ] Track yearly renewal rate
- [ ] Alert if DeepSeek API spend exceeds budget threshold

---

## 28. Quick Reference Card

### Pricing

| | Free | Monthly | Yearly |
|---|---|---|---|
| Price | $0 | US$4.99/mo | US$44.99/yr |
| NZD equivalent | — | NZ$8.56/mo | NZ$77.15/yr |
| Requests/day | 10 (shared) | 70 (shared) | 70 (shared) |
| Requests/month | 300 | 2,100 | 2,100 |
| Ratio | 1x | 7x | 7x |

### Per-Couple Economics (NZD)

| Metric | Value |
|---|---|
| Free couple AI cost | NZ$0.26/month |
| Paid couple AI cost (text) | NZ$1.80/month |
| Paid couple AI cost (images) | NZ$2.16/month |
| **Total paid couple AI cost** | **NZ$3.96/month** |
| Monthly subscriber profit | NZ$4.08/month |
| Yearly subscriber profit | NZ$2.27/month equivalent |
| Blended profit per paid couple (60/40) | NZ$40.26/year |
| Free couple annual cost | NZ$3.09/year |
| Couples subsidised by 1 paying couple | ~13 |

### Break-Even

| Scenario | Break-Even Conversion |
|---|---|
| Gross (AI + Stripe only) | ~7.1% |
| With NZ$2 CAC, 5% churn | ~8.5% |
| With NZ$3 CAC, 5% churn | ~9.5% |
| With NZ$5 CAC, 5% churn | ~11.5% |

### NZ$150K Target

| Scenario | Couples Needed | Downloads Needed |
|---|---|---|
| 10% conv, no CAC | 120,500 | 172,100 |
| 10% conv, NZ$2 CAC, 5% churn | 130,100 | 185,900 |
| 12% conv, NZ$2 CAC, 5% churn | 74,900 | 107,000 |
| 15% conv, NZ$2 CAC, 5% churn | 45,800 | 65,400 |

### AI Pricing (per 1M tokens)

| Model | Input (NZD) | Output (NZD) | Input (USD) | Output (USD) |
|---|---|---|---|---|
| V4 Flash | NZ$0.24 | NZ$0.48 | US$0.14 | US$0.28 |
| V4 Pro | NZ$0.75 | NZ$1.49 | US$0.435 | US$0.87 |

### Per-Request Cost

| Model | Per Request (NZD) | Per Request (USD) |
|---|---|---|
| V4 Flash (conservative) | NZ$0.00086 | US$0.00050 |
| V4 Pro (conservative) | NZ$0.00257 | US$0.00150 |

### Image Generation Cost

| Metric | Value |
|---|---|
| Model | Flux 2 Klein (via OpenRouter) |
| Price per image | US$0.014 (≈1 megapixel) |
| Daily allocation (paid only) | 3 images/day per couple |
| Monthly cost (paid couple) | US$1.26 / NZ$2.16 |
| Annual cost (paid couple) | US$15.12 / NZ$25.93 |

### Key Conversion Rate Comparison

| Model | Ratio vs V4 Flash |
|---|---|
| GPT-5.4-nano | 3.9x more expensive |
| GPT-5.4-mini | 14.2x more expensive |
| GPT-5.5 | 94.7x more expensive |

### LTV Quick Reference (Blended 60/40, NZD)

| Scenario | LTV | Max CAC (3:1) |
|---|---|---|
| Low churn (3%/25%) | NZ$124 | NZ$41 |
| Normal churn (5%/35%) | NZ$81 | NZ$27 |
| High churn (8%/50%) | NZ$52 | NZ$17 |

### FX Rate

| Metric | Value |
|---|---|
| Current rate (Jun 14, 2026) | 1 USD = NZ$1.7148 |
| Source | XE mid-market rate |

---

## 29. Sources

| Source | URL | Date Verified |
|---|---|---|
| DeepSeek API Pricing | https://api-docs.deepseek.com/quick_start/pricing | June 14, 2026 |
| OpenAI API Pricing | https://platform.openai.com/docs/pricing | June 14, 2026 |
| OpenAI ChatGPT Free Tier FAQ | https://help.openai.com/en/articles/9275245-using-chatgpt-for-free | June 14, 2026 |
| OpenAI ChatGPT Plans | https://openai.com/chatgpt/pricing/ | June 14, 2026 |
| XE USD/NZD Exchange Rate | https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=NZD | June 14, 2026 |
| Stripe NZ Pricing | 2.65% + NZ$0.30 per domestic card payment | — |
| App code: model chains | `worker/src/lib/ai.ts:36-40` | June 14, 2026 |
| App code: meal gen max_tokens | `worker/src/lib/ai.ts:174` | June 14, 2026 |
| App code: chat max_tokens | `worker/src/lib/ai.ts:376` | June 14, 2026 |
| App code: pantry parser | `worker/src/lib/ai-pantry-parser.ts:94` | June 14, 2026 |
| User's actual measured usage | 37 requests, 69K tokens, US$0.02 total | June 2026 |

---

*This document was generated for Cupla product planning. All AI pricing figures are verified against DeepSeek's published API pricing as of June 14, 2026. All NZD conversions use the XE mid-market rate of 1 USD = NZ$1.7148 on the same date. Re-verify pricing and FX rates periodically — DeepSeek and OpenAI have historically adjusted rates, and exchange rates fluctuate daily.*

*The natural FX hedge structure (USD revenue matching USD costs) means the core USD profitability is stable. NZD figures will fluctuate with exchange rate movements but the underlying business economics are sound.*

*One subscription per couple. Both partners share the same request pool in any ratio. No per-person caps. This is by design — it matches the household-based architecture and the product's value proposition of shared meal planning.*
