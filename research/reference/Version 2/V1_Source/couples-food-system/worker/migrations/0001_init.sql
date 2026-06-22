-- Initial schema for Couples Food System

-- Households table
CREATE TABLE IF NOT EXISTS households (
  id TEXT PRIMARY KEY,
  invite_code TEXT UNIQUE,
  created_at INTEGER NOT NULL
);

-- Partners table (max 2 per household)
CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  slot INTEGER NOT NULL CHECK(slot IN (1, 2)),
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(household_id, slot)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_partners_household ON partners(household_id);
