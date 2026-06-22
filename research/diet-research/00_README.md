# Diet Research Library — Cupla

> **Purpose:** A standalone, evidence-based research compendium covering 17 dietary patterns, built to inform the Cupla (Couples Food System) app's diet restrictions feature. Each diet is broken into five research files for maximum depth and usability.

---

## How This Library Is Organized

```
Diet Research/
├── 00_README.md                     ← You are here
├── 01_Diet_Taxonomy.md              ← How the 17 diets relate and group
├── 02_Comparison_Matrix.md          ← Side-by-side comparison table
├── 03_App_Integration_Plan.md       ← Code changes to integrate diets into Cupla
│
└── diets/
    └── [01–17]_<DietName>/
        ├── 01_Overview.md           ← Definition, history, philosophy, variations
        ├── 02_Science_and_Evidence.md  ← Peer-reviewed studies with citations & links
        ├── 03_Food_Framework.md     ← Eat/avoid/limit lists, macros, meal structure
        ├── 04_Health_Outcomes.md    ← Benefits, risks, deficiencies, guidelines
        └── 05_App_Encoding_Spec.md  ← Programmatic rules for AI meal generation
```

---

## The 17 Diets Covered

| # | Diet Key | Display Name | Category |
|---|----------|-------------|----------|
| 01 | `mediterranean` | Mediterranean Diet | Mediterranean / Balanced |
| 02 | `dash` | DASH Diet | Therapeutic / Heart Health |
| 03 | `intermittent-fasting` | Intermittent Fasting | Timing Pattern |
| 04 | `keto` | Keto / Low-Carb | Low-Carbohydrate |
| 05 | `high-protein` | High-Protein Diet | Macronutrient-Focused |
| 06 | `plant-based` | Plant-Based / Vegan / Vegetarian | Plant-Based |
| 07 | `flexitarian` | Flexitarian Diet | Plant-Based / Flexible |
| 08 | `paleo` | Paleo Diet | Evolutionary / Whole-Food |
| 09 | `whole30` | Whole30 | Elimination / Whole-Food |
| 10 | `low-fodmap` | Low FODMAP Diet | Therapeutic / Gut Health |
| 11 | `mind` | MIND Diet | Cognitive / Mediterranean Hybrid |
| 12 | `pritikin` | Pritikin Diet | Very-Low-Fat / Heart Health |
| 13 | `carnivore` | Carnivore Diet | Animal-Only / Restrictive |
| 14 | `mcdougall` | McDougall / Starch Solution | High-Starch / Plant-Based |
| 15 | `macrobiotic` | Macrobiotic Diet | Philosophical / Plant-Based |
| 16 | `volumetrics` | Volumetrics Diet | Energy Density / Weight Loss |
| 17 | `hclf-811` | 80/10/10 (HCLF) | Raw / High-Carb Vegan |

---

## Evidence Grading System

Throughout this library, evidence strength is graded using a standard adapted from GRADE and the hierarchies used in nutrition science:

| Grade | Label | Meaning |
|-------|-------|---------|
| **A** | **Strong** | Multiple high-quality RCTs and/or meta-analyses; consistent results; large effect sizes. Endorsed by major health organizations. |
| **B** | **Moderate** | Some RCTs or large prospective cohorts; generally consistent results. Moderate effect sizes. |
| **C** | **Limited** | Few/small RCTs, observational studies, or inconsistent results. Promising but not conclusive. |
| **D** | **Insufficient** | Very little data; mostly mechanistic reasoning, case studies, or anecdotal reports. No RCTs. |
| **F** | **Contradicted** | Available evidence suggests the diet's claims are unsupported or refuted by higher-quality studies. |

---

## Citation Standards

- **Study names** are given where a trial has a well-known name (e.g., PREDIMED, DASH, EPIC-Oxford).
- **Journals** are cited in standard format: *Journal Name*, Year.
- **DOI links** are provided where confidently known, formatted as `https://doi.org/...`
- **PubMed links** are provided where confidently known, formatted as `https://pubmed.ncbi.nlm.nih.gov/...`
- A clear distinction is always drawn between **consensus evidence** (widely accepted) and **emerging evidence** (promising but preliminary).
- Where evidence is **absent or weak**, this is explicitly stated rather than glossed over.

> **Disclaimer:** This research compendium is for product development and educational purposes. It is not medical advice. Citations are drawn from published, peer-reviewed literature. Always consult the primary sources for clinical decisions.

---

## Research Methodology

Each diet was researched across the following dimensions:

1. **Origins & definition** — Who created it, when, why, and what are its core tenets?
2. **Mechanism of action** — What are the proposed biological mechanisms by which the diet exerts its effects?
3. **Clinical evidence** — What do randomized controlled trials, cohort studies, and meta-analyses show?
4. **Food framework** — What do you eat, avoid, and limit? What are the macronutrient targets?
5. **Health outcomes** — What are the demonstrated benefits, risks, nutrient deficiencies, and contraindications?
6. **Practical implementation** — How does someone actually follow this diet day-to-day?
7. **App encoding** — How should this diet be represented programmatically in Cupla's AI meal generator?

---

## For Developers: Using the App Encoding Specs

Each diet's `05_App_Encoding_Spec.md` contains a machine-readable specification designed for direct implementation:

- **`diet_key`** — The string value stored in the `partners.diet` column
- **`display_label`** — The user-facing label in the UI
- **`category`** — For grouping in the UI
- **`allowed_food_groups`** / **`restricted_food_groups`** — For programmatic meal validation
- **`macro_targets`** — Macronutrient percentage ranges for AI prompting
- **`ai_prompt_instructions`** — Natural-language instructions injected into the meal-generation prompt
- **`couple_compatibility_notes`** — How to handle a couple where one partner follows this diet and the other follows a different one

See `03_App_Integration_Plan.md` for the full implementation roadmap.

---

## Last Updated

June 2026

---

## License & Attribution

This research compendium was compiled for the Cupla (Couples Food System) project. All cited studies belong to their respective authors and publishers. Links point to original sources for verification.
