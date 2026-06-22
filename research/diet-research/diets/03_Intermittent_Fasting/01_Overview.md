# Intermittent Fasting — Overview

## Definition

**Intermittent fasting (IF) is a dietary timing pattern — not a food restriction.** It is defined by **when** you eat, not **what** you eat. The core principle is cycling between periods of voluntary food abstinence (fasting) and periods of eating (the feeding window).

> ⚠️ **CRITICAL DISTINCTION:** Unlike food-based diets (Mediterranean, keto, vegan, etc.), intermittent fasting does not prescribe or prohibit specific foods. It can be **combined with ANY food-based diet** — keto+IF, vegan+IF, Mediterranean+IF, paleo+IF, etc. In an app architecture, IF should be modeled as a **separate `fasting_mode` field** that stacks orthogonally on top of a food-choice diet.

During the fasting period, individuals consume only **water, black coffee, plain tea, and other zero-calorie beverages**. Some protocols allow a small number of calories during the "fast" (e.g., 5:2 allows 500–600 calories on fasting days). During the eating window, food choices are determined by whatever dietary pattern (if any) the individual follows — IF itself does not dictate food selection.

The central physiological premise is that sustained fasting (typically >12–14 hours) shifts the body from a **glucose-burning, insulin-dominant state** into a **fat-burning, low-insulin state**, triggering metabolic processes — including ketogenesis, autophagy, and improved insulin sensitivity — that are believed to underlie IF's health effects.

---

## History & Origins

### Ancient and Religious Roots

Fasting is among the **oldest health and spiritual practices** in human history. Long before it was studied scientifically, fasting was embedded in virtually every major religious tradition:

- **Islam — Ramadan:** The most widely practiced fasting ritual in the world. Observant Muslims abstain from all food and drink from dawn to sunset for an entire lunar month. This is effectively a **daily time-restricted feeding** protocol (~14–16 hours fasting depending on the season and latitude) practiced by ~1.9 billion people.
- **Christianity — Lent:** A 40-day period of fasting and dietary restriction preceding Easter, practiced since the early Church. Traditional Lenten fasting involved one main meal per day — effectively a form of time-restricted eating.
- **Judaism — Yom Kippur:** A complete 25-hour fast. Other Jewish fast days (Tisha B'Av, Fast of Esther) also involve sunrise-to-sunset or 24-hour abstention.
- **Hinduism & Buddhism:** Various fasting practices (Ekadashi in Hinduism; monks' practice of not eating after noon in Theravada Buddhism — essentially daily 16:8).
- **Greek Medicine:** Hippocrates (c. 460–370 BCE) wrote: *"To eat when you are sick, is to feed your sickness."* Paracelsus later echoed this sentiment. Plato and Aristotle also wrote approvingly of fasting.

### Early Scientific Investigation (1900s–1940s)

- **1914–1915:** Francis Gano Benedict at the Carnegie Institution published detailed metabolic studies of fasting in humans (*A Study of Prolonged Fasting*).
- **1940s:** **Anton J. Carlson** (University of Chicago) and his student **Helmut Hoelzel** conducted systematic studies on the physiological effects of fasting, including the famous study in which Hoelzel fasted for up to 40 days under observation. Carlson's work showed that the body adapted remarkably well to extended fasting without significant harm to healthy individuals.

> **Key reference:** Carlson AJ, Hoelzel F. "Apparent Prolongation of the Life Span of Rats by Intermittent Fasting." *Journal of Nutrition*. 1946;31(3):363-375.

### Caloric Restriction and Aging Research (1930s–2000s)

- **1935:** **Clive McCay** (Cornell University) discovered that caloric restriction (CR) — reducing calorie intake by 30–40% while maintaining adequate nutrition — extended lifespan in rats. This became one of the most robust findings in aging biology and stimulated decades of research into the relationship between nutrient deprivation and longevity.
- **1990s–2000s:** Researchers began exploring whether **intermittent** caloric deprivation could produce similar benefits to continuous CR — without the need for chronic calorie reduction. Studies in mice by **Mark Mattson** (National Institute on Aging) and **Rafael de Cabo** showed that intermittent fasting extended lifespan and improved metabolic health, even without overall calorie reduction.
- **Krista Varady** (University of Illinois at Chicago) began pioneering human trials of alternate-day fasting in the mid-2000s, demonstrating its feasibility and metabolic benefits in overweight adults.

### Modern Popularization (2012–Present)

- **2012:** **Michael Mosley**, a BBC science journalist, presented the documentary *"Eat Fast, Live Longer,"* which introduced intermittent fasting to the global mainstream. Mosley then published **The Fast Diet** (2013, with Mimi Spencer), which popularized the **5:2 protocol** — 5 days of normal eating and 2 non-consecutive days of 500–600 calorie restriction. The book became a #1 international bestseller.
- **2016:** **Brad Pilon** published *"Eat Stop Eat,"* which popularized the **24-hour fast** approach (1–2 complete 24-hour fasts per week).
- **2018–present:** The **16:8 method** (also called "LeanGains," popularized by Martin Berkhan) became the most widely practiced IF protocol, driven by social media, fitness influencers, and the broader wellness movement.
- **2019:** **Dr. Jason Fung** published *"The Complete Guide to Fasting"* and *"The Obesity Code,"* which positioned IF as a therapeutic tool for obesity and type 2 diabetes, particularly within the low-carb/keto community.

---

## Core Philosophy

Intermittent fasting is built on several core principles:

1. **Timing is the lever, not food restriction** — The eating schedule itself drives metabolic benefits. What you eat matters too, but IF's unique contribution is the timing dimension.
2. **Evolutionary rationale** — Humans evolved in environments where food was not constantly available. Periodic fasting is arguably more "natural" than the constant grazing/snacking pattern of modern life. Our ancestors experienced regular fasting between hunts and during seasonal scarcity.
3. **Metabolic switching** — The body is designed to switch between two primary fuel states: the **fed state** (glucose-burning, insulin-high, storage mode) and the **fasted state** (fat-burning, insulin-low, ketogenesis). Modern eating patterns (3+ meals plus snacks) keep most people perpetually in the fed state. IF restores metabolic flexibility by regularly entering the fasted state.
4. **Hormesis** — Like exercise, fasting is a beneficial stressor. It triggers adaptive cellular responses (autophagy, stress resistance pathways) that make cells more resilient — a concept known as **hormesis** ("what doesn't kill you makes you stronger").
5. **Simplicity** — IF requires no special foods, no calorie counting (in most protocols), and no complex meal planning. The single rule — "don't eat during the fasting window" — is easy to understand and implement.
6. **Stackability** — IF is agnostic to food choices. It works with keto, vegan, Mediterranean, paleo, low-carb, or no specific diet at all.

---

## Key Components

### The Fasting Window
- Periods of **zero or near-zero calorie intake**
- Allowed: water, black coffee, unsweetened plain tea, sparkling water
- Some protocols permit small caloric intake during the "fast" (e.g., 5:2)
- Fasting windows range from **12 hours** (circadian/time-restricted eating) to **several days** (prolonged fasting, which is outside the scope of typical IF)

### The Eating Window
- Periods of **normal eating** — ideally following a healthy dietary pattern
- Caloric intake during the window should meet nutritional needs (not necessarily reduced, though some protocols create a caloric deficit naturally)
- Food quality still matters: IF combined with a nutrient-dense diet will produce better outcomes than IF combined with a junk food diet

### The Transition
- The body shifts through metabolic phases during a fast:
  - **0–4 hours (fed state):** Glucose from the meal is the primary fuel. Insulin is elevated.
  - **4–12 hours (glycogen burning):** The body uses stored glycogen (liver and muscle). Insulin begins to decline.
  - **12–18 hours (glycogen depletion / early fasting):** Liver glycogen is largely depleted. The body begins burning fat. Ketone production begins. Autophagy may be upregulated.
  - **18–36+ hours (fasting state):** Significant ketone production. Autophagy is active. Growth hormone increases (to preserve lean mass). Insulin is very low.

---

## Variations & Protocols

| Protocol | Structure | Difficulty | Popularity |
|----------|-----------|:----------:|:----------:|
| **12:12 (Circadian/TRE)** | 12h fast / 12h eating window | ★☆☆☆☆ | Moderate |
| **14:10** | 14h fast / 10h eating window | ★★☆☆☆ | Moderate |
| **16:8** | 16h fast / 8h eating window | ★★★☆☆ | ★★★★★ (most popular) |
| **18:6** | 18h fast / 6h eating window | ★★★☆☆ | High |
| **20:4 (Warrior Diet)** | 20h fast / 4h eating window | ★★★★☆ | Moderate |
| **OMAD** | 23h fast / 1h eating window (One Meal A Day) | ★★★★★ | Moderate |
| **5:2** | 5 days normal + 2 non-consecutive days at 500–600 cal | ★★★☆☆ | High |
| **Eat-Stop-Eat** | 1–2 complete 24-hour fasts per week | ★★★★☆ | Moderate |
| **Alternate Day Fasting (ADF)** | Alternate feast days and fast days (0–500 cal on fast days) | ★★★★☆ | Moderate |
| **Modified ADF** | Alternate days with ~25% calories / ~125% calories | ★★★☆☆ | Moderate |
| **Ramadan-style** | Dawn-to-sunset daily fast for one month | ★★★☆☆ | Seasonal |

### Detailed Protocol Descriptions

#### 16:8 (Time-Restricted Feeding — Most Popular)
- **Structure:** Fast for 16 hours; eat all meals within an 8-hour window.
- **Common windows:** 12:00 PM – 8:00 PM (skip breakfast); 9:00 AM – 5:00 PM (skip dinner); 10:00 AM – 6:00 PM.
- **Typical pattern:** 2 meals + 1 snack, or 2 larger meals within the window.
- **Why it works:** Long enough to deplete liver glycogen and enter mild ketosis; short enough to be sustainable for most people. Typically creates a modest caloric deficit (~200–500 calories/day) without conscious restriction.
- **Who popularized it:** Martin Berkhan (LeanGains blog, 2000s).

#### 18:6
- Same as 16:8 but with a tighter 6-hour eating window (e.g., 12:00 PM – 6:00 PM or 1:00 PM – 7:00 PM).
- Slightly more metabolic benefit (longer fasting period) but harder to fit adequate nutrition into 6 hours.

#### 20:4 (The Warrior Diet)
- **Originator:** Ori Hofmekler (2002 book *"The Warrior Diet"*).
- Undereat (small amounts of raw fruits/veg, protein) during the day; eat one large meal at night.
- Very challenging to meet all nutritional needs in a 4-hour window. Best suited for experienced fasters.

#### 5:2 Diet
- **Originator:** Michael Mosley (BBC, 2012; *The Fast Diet* book, 2013).
- **Structure:** 5 days per week of normal eating. 2 non-consecutive days per week of **500 calories (women) / 600 calories (men)**.
- Fast days can be any two non-consecutive days (e.g., Monday and Thursday).
- On fast days, calories are typically consumed as one small meal or split across two very small meals.
- **Advantage:** No daily restriction — only 2 days per week require discipline. Easier for people who dislike daily restriction.

#### Eat-Stop-Eat
- **Originator:** Brad Pilon (2007 book *"Eat Stop Eat"*).
- **Structure:** 1–2 complete 24-hour fasts per week. For example, stop eating after dinner on Monday and don't eat again until dinner on Tuesday.
- Creates a significant weekly caloric deficit (~2,000+ calories per 24-hour fast).
- On non-fasting days, eat normally (not compensating by overeating).

#### OMAD (One Meal A Day)
- Eat all daily calories in a single meal (or a 1–2 hour window).
- Effectively a 23:1 protocol.
- **Risk:** Very difficult to consume adequate nutrients, fiber, and protein in one meal. Risk of binge eating. Not recommended for beginners, children, pregnant women, or those with a history of eating disorders.

#### Alternate Day Fasting (ADF)
- Alternate between "feast days" (eat normally, ~100% of maintenance calories) and "fast days" (0–500 calories).
- Studied extensively by **Krista Varady** (University of Illinois at Chicago).
- Weight loss results are comparable to daily caloric restriction, but some find alternate-day structure easier to adhere to than chronic restriction.
- **Modified ADF:** Fast days allow ~25% of maintenance calories (~500 cal); feast days allow ~125%. This version is more practical and has better adherence.

---

## Who It's For

Intermittent fasting is appropriate for **many adults** but not everyone:

- ✅ **Suitable for:** Healthy adults seeking weight management, adults with overweight/obesity, individuals with insulin resistance or prediabetes, people who naturally skip breakfast, those who prefer eating fewer but larger meals, and individuals looking to simplify their eating routine.
- ✅ **Stacks with:** Any food-based diet — keto, low-carb, Mediterranean, vegan, vegetarian, paleo, Whole30, etc.
- ⚠️ **Caution for:** Athletes with high training loads (timing fuel around training is critical), individuals who experience dizziness/hypoglycemia with fasting, shift workers (circadian disruption), people on medications requiring food (e.g., some diabetes medications), and individuals with high stress or poor sleep.
- ❌ **Not appropriate for:** Children and adolescents under 18, pregnant or breastfeeding women, people with a history of eating disorders (anorexia, bulimosa, binge eating disorder), people with type 1 diabetes, people with underweight (BMI <18.5), and anyone advised against fasting by their physician.

---

## Summary

| Attribute | Detail |
|-----------|--------|
| **Type** | **Timing pattern** (NOT a food restriction diet) |
| **Most popular protocol** | 16:8 (16 hours fasting, 8-hour eating window) |
| **First studied scientifically** | Carlson & Hoelzel, 1940s (University of Chicago) |
| **Modern popularization** | Michael Mosley BBC documentary (2012); *The Fast Diet* (2013) |
| **Evidence grade** | **B** — Good evidence for weight loss and metabolic health |
| **Restrictiveness** | Moderate (3/5) — Timing is restrictive; food choice is unrestricted |
| **Primary health focus** | Weight management, insulin sensitivity, metabolic health |
| **Sustainability** | Moderate — Adherence varies widely by individual |
| **Cost** | **None** — No special foods required |
| **Stacks with other diets?** | **YES** — IF is orthogonal to food-choice diets |
| **Safety** | Generally safe for healthy adults; contraindicated for several populations |

---

*Next: [02_Science_and_Evidence.md](./02_Science_and_Evidence.md) — Peer-reviewed studies and clinical evidence*
