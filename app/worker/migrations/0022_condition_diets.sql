-- 0022_condition_diets.sql
-- Adds the stackable health-condition layer.
--
-- A partner keeps ONE lifestyle diet (partners.diet) and may additionally
-- select zero or more health conditions (partner_conditions). Condition rows
-- live in diet_catalog flagged with is_condition = 1 so the existing rules
-- pipeline (diet-rules.ts, assertMealCompliesWithDiet, pantry-conflict) can
-- merge them without a parallel system.

ALTER TABLE diet_catalog ADD COLUMN is_condition INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS partner_conditions (
  id            TEXT PRIMARY KEY,
  partner_id    TEXT NOT NULL,
  condition_key TEXT NOT NULL,
  created_at    INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE (partner_id, condition_key),
  FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE,
  FOREIGN KEY (condition_key) REFERENCES diet_catalog(diet_key)
);

CREATE INDEX IF NOT EXISTS idx_partner_conditions_partner
  ON partner_conditions (partner_id);
