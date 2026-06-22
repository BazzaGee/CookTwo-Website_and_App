# Cupla V2 — Technical Considerations

**Date:** May 2026
**Status:** Design Document — Architecture, Data Flow, and AI Changes for V2

---

## AI Prompt Changes

### V1 Prompt (Single Meal Generation)
```
We have these ingredients: chicken, rice, spinach.
Partner 1 is vegetarian. Partner 2 has no restrictions.
Suggest ONE dinner. 30 minutes max.
Output: recipe name, ingredients, steps, time.
```

### V2 Prompt — Mode A (Meal List Generation)
```
We have these ingredients: chicken, rice, spinach, yogurt, olive oil.
Partner 1: Vegetarian, lose weight, 1700 cal/day.
Partner 2: Omnivore, gain muscle, 3200 cal/day.

Generate a LIST of 8-12 meals we can make with these ingredients.
Prioritise meals that use 100% of available ingredients.

For each meal, return:
- name, description, cookTime (minutes), cuisine, difficulty
- ingredients[] (full list)
- pantryMatchPercent (0-100)
- worksForBoth (boolean)
- dietaryTags[]

Return as JSON array.
```

### V2 Prompt — Mode B (Recipe Details + Pantry Check)
```
Recipe: Thai Green Curry
Ingredients needed: chicken, coconut milk, green curry paste, fish sauce, Thai basil, green beans.

Our pantry has: chicken, coconut milk, green beans.

Return:
- have[] (items in pantry)
- need[] (items not in pantry)
- pantryMatchPercent
- canCookNow (boolean)
```

---

## Recipe Database

### Structure
```json
{
  "recipes": [
    {
      "id": "thai-green-curry",
      "name": "Thai Green Curry",
      "description": "A fragrant, creamy curry with fresh vegetables",
      "cookTime": 30,
      "difficulty": "Medium",
      "cuisine": "Asian",
      "ingredients": ["chicken", "coconut milk", "green curry paste", "fish sauce", "thai basil", "green beans"],
      "steps": ["Cook rice", "Prep vegetables", "Make curry base", "Add protein", "Simmer and serve"],
      "dietaryTags": ["gluten-free", "dairy-free"],
      "stockPhoto": "asian-curry-01.jpg",
      "category": "weeknight-dinner"
    }
  ]
}
```

### Sourcing Strategy
1. **AI-generated base:** Use Gemini/Claude to generate 100 diverse recipes across cuisines, cook times, and difficulty levels
2. **Human curation:** Review for accuracy, dietary compatibility, and practical ingredient lists
3. **Stock photo mapping:** Assign stock photos by cuisine type + meal category
4. **Local storage:** Store as JSON in the app bundle — works offline

### Size: 50-100 Meals
- 15 quick meals (under 15 min)
- 35 weeknight dinners (15-30 min)
- 30 weekend cooking (30-45 min)
- 20 meal prep friendly

### Cuisines Covered
- Mediterranean, Asian, Mexican, American, Indian, Italian, Middle Eastern, African

---

## Pantry Matching Algorithm

### Scoring Logic
```
pantryMatchPercent = (ingredientsInPantry / totalIngredients) * 100

Tier 1 (Cook Now): 100% match — zero shopping needed
Tier 2: 80-99% match — needs 1-2 items
Tier 3: <80% match — needs 3+ items
```

### Filtering Logic (Mode B)
- **Cook time filter:** Compare recipe.cookTime against selected range
- **Cuisine filter:** Compare recipe.cuisine against selected cuisines
- **Difficulty filter:** Compare recipe.difficulty against selected levels
- **Dietary fit filter:** Check if recipe can be adapted for both partners' diets
- **"Can we make this now?" filter:** pantryMatchPercent === 100

### Dietary Compatibility Check
```
function worksForBoth(recipe, partnerA, partnerB):
  if partnerA.diet == "No Specific Diet" and partnerB.diet == "No Specific Diet":
    return true
  if recipe.dietaryTags.includes(partnerA.diet) and recipe.dietaryTags.includes(partnerB.diet):
    return true
  if canAdapt(recipe, partnerA.diet) and canAdapt(recipe, partnerB.diet):
    return true
  return false
```

---

## Stock Photo Handling

### Strategy
- **Stock photos** mapped by cuisine type + meal category
- **Local references** — no external API calls needed
- **Fallback:** If no exact match, use cuisine-type default photo

### Photo Mapping
```
{
  "Asian": ["asian-curry-01.jpg", "asian-stirfry-01.jpg", "asian-noodle-01.jpg"],
  "Mediterranean": ["med-bowl-01.jpg", "med-salad-01.jpg", "med-grill-01.jpg"],
  "Mexican": ["mex-taco-01.jpg", "mex-bowl-01.jpg", "mex-soup-01.jpg"],
  "Italian": ["ital-pasta-01.jpg", "ital-risotto-01.jpg", "ital-salad-01.jpg"],
  "Indian": ["ind-curry-01.jpg", "ind-biryani-01.jpg", "ind-dal-01.jpg"],
  "American": ["amer-bowl-01.jpg", "amer-salad-1.jpg", "amer-grill-01.jpg"],
  "Middle Eastern": ["me-wrap-01.jpg", "me-bowl-01.jpg", "me-soup-01.jpg"],
  "African": ["afr-stew-01.jpg", "afr-bowl-01.jpg", "afr-salad-01.jpg"]
}
```

### Photo Sources
- Stock photo libraries (Unsplash, Pexels — free)
- AI-generated food images (DALL-E, Midjourney)
- Curated by cuisine type for consistency

---

## Data Model Changes

### New Tables (D1 / Room)

```sql
-- Recipe database
CREATE TABLE recipes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cook_time INTEGER,
  difficulty TEXT,
  cuisine TEXT,
  ingredients_json TEXT,
  steps_json TEXT,
  dietary_tags_json TEXT,
  stock_photo TEXT,
  category TEXT
);

-- Meal generation history
CREATE TABLE meal_suggestions (
  id TEXT PRIMARY KEY,
  household_id TEXT REFERENCES households(id),
  mode TEXT CHECK(mode IN ('cook_now', 'i_want_this')),
  recipe_id TEXT REFERENCES recipes(id),
  pantry_snapshot_json TEXT,
  pantry_match_percent INTEGER,
  created_at INTEGER
);
```

### Updated AI Route
```
POST /meal-plan/generate-list    → Generate meal LIST (Mode A)
POST /meal-plan/check-pantry     → Check pantry against recipe (Mode B)
GET  /recipes                    → Get curated recipe database
GET  /recipes/:id                → Get single recipe details
```

---

## Offline Support

| Feature | Online | Offline |
|---------|--------|---------|
| Mode A (Cook Now) | AI generates fresh meal list | Shows cached meal list from last generation |
| Mode B (I Want This) | Full browsing + AI suggestions | Browse curated recipe database only |
| Pantry check | Real-time pantry comparison | Uses cached pantry state |
| Shopping list sync | Real-time WebSocket | Queues locally, syncs on reconnect |
| Adaptive cooking | Full experience | Full experience (no AI needed during cooking) |

---

## Architecture Impact

### What Changes from V1
- AI route now generates meal LISTS, not single meals
- New recipe database endpoint (local JSON)
- New pantry check endpoint
- Frontend needs meal card grid component
- Frontend needs filtering system
- Frontend needs pantry check view

### What Stays the Same
- Cloudflare infrastructure (Workers, D1, KV, Durable Objects)
- WebSocket real-time sync
- PWA architecture
- Auth flow (invite code pairing)
- AI Gateway → Anthropic (or Gemini for Android)
- Durable Object per household

### Estimated Additional Complexity
- AI prompt engineering: +1 week
- Recipe database curation: +1 week
- Frontend meal grid + filters: +1.5 weeks
- Pantry check view: +0.5 weeks
- Stock photo integration: +0.5 weeks
- **Total additional: ~4.5 weeks**
