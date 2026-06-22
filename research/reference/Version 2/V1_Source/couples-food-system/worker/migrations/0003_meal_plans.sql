-- Meal plans table for caching AI-generated meals

CREATE TABLE IF NOT EXISTS meal_plans (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  mode TEXT NOT NULL DEFAULT 'single',
  plan_json TEXT NOT NULL,
  pantry_snapshot TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_meal_plans_household ON meal_plans(household_id);
