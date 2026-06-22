# Cupla V2 — User Flows

**Date:** May 2026
**Status:** Design Document — Step-by-Step User Journeys

---

## Mode A — "Cook Now" — Full User Journey

### Scenario: Tuesday 6pm, both partners are home, hungry, don't want to shop

**Step 1:** Alex opens Cupla on phone
**Step 2:** Taps "Meal Plan" tab at bottom
**Step 3:** Default view is "Cook Now" mode
**Step 4:** AI has already scanned pantry (3 items: chicken, rice, spinach)
**Step 5:** Shows 3 meal cards:
- "Chicken & Spinach Stir-Fry" — 20 min — ✅ 100% match
- "Chicken Rice Bowl" — 15 min — ✅ 100% match
- "Spinach & Chicken Salad" — 10 min — ✅ 100% match
**Step 6:** Alex taps "Chicken & Spinach Stir-Fry"
**Step 7:** Goes to adaptive cooking view
**Step 8:** Shows step-by-step workflow (5 steps)
**Step 9:** Shows dual plating cards:
- Alex (lose weight): 4oz chicken, ½ cup rice, extra spinach — 450 cal
- Jordan (gain muscle): 6oz chicken, 1 cup rice, normal spinach — 700 cal
**Step 10:** They cook together, follow the steps
**Step 11:** Tap "We Dinner Cleaned!" when done
**Step 12:** Meal is logged. Loop continues.

---

## Mode B — "I Want This" — Full User Journey

### Scenario: Sunday afternoon, planning for the week, willing to shop

**Step 1:** Jordan opens Cupla on phone
**Step 2:** Taps "Meal Plan" tab
**Step 3:** Toggles to "I Want This"
**Step 4:** Sees visual grid of meal cards (AI-generated + curated database)
**Step 5:** Applies filter: "Under 30 min" + "Asian"
**Step 6:** Grid updates to show 8 Asian meals under 30 min
**Step 7:** Taps "Thai Green Curry"
**Step 8:** Sees details:
- ✅ You have: chicken, coconut milk, green beans
- 🔴 You need: green curry paste, fish sauce, Thai basil
**Step 9:** Taps "Add 3 Missing to Shopping List"
**Step 10:** Alex's phone instantly shows the 3 new items on the shopping list
**Step 11:** Alex is at the store, sees the items, buys them
**Step 12:** Alex checks them off, taps "Move to Pantry"
**Step 13:** Pantry now has curry paste, fish sauce, Thai basil
**Step 14:** Jordan switches to "Cook Now" — Thai Green Curry now shows as 100% match
**Step 15:** They cook together with adaptive plating

---

## Edge Case: One Partner Dieting, One Not

### Scenario: Alex is vegetarian (no diet goal), Jordan is omnivore (gain muscle)

**Mode A — "Cook Now":**
- AI generates meals that work for both diets
- Vegetarian meals that can be adapted for Jordan's muscle gain
- Plating cards:
  - Alex: normal vegetarian portion (no calorie target)
  - Jordan: larger portion with extra protein (calorie target applied)

**Mode B — "I Want This":**
- All meals shown, but dietary fit badge shows compatibility
- "Works for both" = meal can be adapted for both diets
- "Works for Alex only" = vegetarian meal, Jordan would need to add protein
- Jordan can still pick any meal — the app will suggest how to adapt it

---

## Edge Case: Neither Partner Dieting

### Scenario: Both partners just want dinner, no specific goals

**Mode A — "Cook Now":**
- AI generates meals based on pantry only (no dietary constraints)
- Plating cards show "Same for both" with equal portions
- No calorie targets, no macro breakdown needed
- Still shows cook time, cuisine type, difficulty

**Mode B — "I Want This":**
- All meals shown, no dietary filtering needed
- "Works for both" badge on everything
- Pantry check still works the same
- Shopping list still works the same

---

## Edge Case: Both Partners Dieting Differently

### Scenario: Alex is keto (lose weight), Jordan is vegan (maintain)

**Mode A — "Cook Now":**
- AI generates meals that can be adapted for BOTH diets
- This is the hardest scenario — AI must find meals with:
  - Low-carb options for Alex (keto)
  - No animal products for Jordan (vegan)
- Example: "Cauliflower & Avocado Bowl" — works for both
- Plating cards:
  - Alex: cauliflower base, extra avocado, olive oil — 500 cal, 5g carbs
  - Jordan: cauliflower base, avocado, chickpeas, tahini — 600 cal, vegan

**Mode B — "I Want This":**
- Dietary fit badge is critical here
- "Works for both" = rare but possible
- "Works for Alex only" = keto-friendly, not vegan
- "Works for Jordan only" = vegan, not keto
- User can still pick any meal — app suggests adaptations

---

## The "I Don't Want to Shop" Flow

1. Open Meal Plan → "Cook Now"
2. See meals with 100% pantry match
3. Tap one → cook immediately
4. No shopping list, no waiting
5. Done in 20-30 minutes

## The "I'm Craving Something" Flow

1. Open Meal Plan → "I Want This"
2. Browse, filter, pick what appeals
3. See what's missing
4. Add to shopping list (or skip)
5. Shop when ready
6. Move to pantry when home
7. Switch to "Cook Now" — now it's 100% match
8. Cook with adaptive plating

---

## The Loop Continues

After every meal (from either mode):
1. Ingredients used are removed from pantry (optional — user can manually delete)
2. New items from shopping list move to pantry
3. AI generates new meal suggestions based on updated pantry
4. The cycle repeats
