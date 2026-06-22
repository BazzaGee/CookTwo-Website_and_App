# Cupla V2 — Build Order

**Date:** May 2026
**Status:** Design Document — Updated Build Steps for V2 Dual-Mode Meal Picker

---

## V1 Build Order (Reference)

| Step | Feature | Duration | Status |
|------|---------|----------|--------|
| 1 | Shared Grocery List | 2 weeks | ✅ Built |
| 2 | PWA Install + Mobile Polish | 1 week | ⚠️ Partial |
| 3 | Partner Profiles + D1 Database | 1 week | ⚠️ Skeleton |
| 4 | Pantry Tracking | 1 week | ⚠️ UI Built |
| 5 | AI Meal Generation | 2 weeks | ❌ Not Built |
| 6 | Meal Calendar + Smart Grocery | 2 weeks | ❌ Not Built |
| 7 | Adaptive Shared Cooking | 3 weeks | ❌ Not Built |

---

## V2 Build Order (Updated)

### Phase 1: Foundation (Unchanged from V1)

| Step | Feature | Duration | Notes |
|------|---------|----------|-------|
| 1 | Shared Grocery List | 2 weeks | Already built on web app |
| 2 | PWA Install + Mobile Polish | 1 week | Partial — complete service worker |
| 3 | Partner Profiles + D1 Database | 1 week | Skeleton exists — complete body profiles |
| 4 | Pantry Tracking | 1 week | UI built — connect to real-time sync |

### Phase 2: V2 Meal Picker (NEW — replaces V1 Steps 5-6)

| Step | Feature | Duration | Notes |
|------|---------|----------|-------|
| 5 | Recipe Database (50-100 meals) | 1.5 weeks | AI-generate + curate + stock photo mapping |
| 6 | Mode A: "Cook Now" — AI Meal List | 2 weeks | New AI prompt, meal card grid, prioritisation logic |
| 7 | Mode B: "I Want This" — Browse & Pick | 2 weeks | Visual grid, filters, pantry check view, "Add Missing" |
| 8 | Mode Toggle UI | 0.5 weeks | Simple toggle at top of Meal Plan tab |
| 9 | Pantry Matching Algorithm | 1 week | Scoring, tiering, dietary compatibility check |

### Phase 3: Adaptive Cooking (Unchanged from V1)

| Step | Feature | Duration | Notes |
|------|---------|----------|-------|
| 10 | Adaptive Shared Cooking | 3 weeks | Dual plating cards, step-by-step workflow, per-person macros |

### Phase 4: Polish (NEW)

| Step | Feature | Duration | Notes |
|------|---------|----------|-------|
| 11 | Stock Photo Integration | 0.5 weeks | Map photos to recipes, fallback handling |
| 12 | Offline Support for Mode B | 0.5 weeks | Cache recipe database, offline browsing |
| 13 | Non-Diet User Handling | 0.5 weeks | Equal portions, graceful UX |
| 14 | End-to-End Testing | 1 week | Test both modes, all edge cases, both partners |

---

## Total Timeline

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Phase 1: Foundation | 5 weeks | Week 5 |
| Phase 2: V2 Meal Picker | 7 weeks | Week 12 |
| Phase 3: Adaptive Cooking | 3 weeks | Week 15 |
| Phase 4: Polish | 2.5 weeks | Week 17.5 |

**Total: ~17-18 weeks to full V2 MVP**

---

## Dependencies

```
Step 1 (Grocery List)
    ↓
Step 2 (PWA Polish)
    ↓
Step 3 (Profiles + D1)
    ↓
Step 4 (Pantry Tracking)
    ↓
Step 5 (Recipe Database) ────┐
    ↓                         │
Step 6 (Cook Now) ────────────┤
    ↓                         │
Step 7 (I Want This) ◄────────┘
    ↓
Step 8 (Mode Toggle)
    ↓
Step 9 (Pantry Matching)
    ↓
Step 10 (Adaptive Cooking)
    ↓
Step 11-14 (Polish + Testing)
```

---

## What's Different from V1

| V1 | V2 | Impact |
|----|----|--------|
| Step 5: Single AI meal generation | Step 5-7: Recipe DB + Mode A + Mode B | +5 weeks |
| Step 6: Meal calendar | Removed (deferred to post-V2) | -2 weeks |
| No stock photos | Step 11: Stock photo integration | +0.5 weeks |
| No offline recipe browsing | Step 12: Offline support for Mode B | +0.5 weeks |
| No non-diet handling | Step 13: Non-diet user handling | +0.5 weeks |
| **Total** | | **+4.5 weeks** |

---

## Parallel Work Opportunities

| Can Run in Parallel | With |
|---------------------|------|
| Step 5 (Recipe Database) | Step 4 (Pantry Tracking) |
| Step 11 (Stock Photos) | Step 10 (Adaptive Cooking) |
| Step 12 (Offline Support) | Step 10 (Adaptive Cooking) |
| Step 13 (Non-Diet Handling) | Step 10 (Adaptive Cooking) |

**With parallel work: ~15-16 weeks**

---

## Post-V2 (Deferred Features)

| Feature | When to Revisit |
|---------|----------------|
| Meal calendar (weekly planning) | After V2 launch, based on user feedback |
| Couple's Meal Picker (swipe to agree) | After V2 launch |
| Push notifications | After V2 launch |
| Recipe importing from URLs | Year 2+ |
| Barcode scanning | Never (natural language is faster) |

---

## V2 Success Metrics

| Metric | Target |
|--------|--------|
| Mode A usage (Cook Now) | >40% of meal selections |
| Mode B usage (I Want This) | >60% of meal selections |
| Recipe database engagement | >50% of Mode B sessions browse curated recipes |
| Filter usage in Mode B | >30% of Mode B sessions use at least one filter |
| Non-diet user satisfaction | >80% report "easy to use" |
| Adaptive cooking usage | >50% of all meal selections use adaptive plating |
| Loop completion rate | >60% of meal selections result in completed cooking |
