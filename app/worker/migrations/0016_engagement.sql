-- Engagement email engine — schema
-- Mirrors the ShotCycle email-automation architecture, adapted to CookTwo's
-- household/partner/waitlist model. Drives lifecycle + inactivity emails.

-- 1. Engagement users (one row per waitlist email that we can email)
CREATE TABLE IF NOT EXISTS engagement_users (
  id            TEXT PRIMARY KEY,                 -- links to waitlist by email
  waitlist_id   INTEGER REFERENCES waitlist(id),
  household_id  TEXT REFERENCES households(id),
  email         TEXT NOT NULL UNIQUE,
  name          TEXT,
  verified      INTEGER NOT NULL DEFAULT 0,       -- 0 = pending, 1 = verified
  unsubscribed  INTEGER NOT NULL DEFAULT 0,
  unsub_token   TEXT NOT NULL,
  ga_client_id  TEXT,
  acquisition_source TEXT,
  acquisition_country TEXT,
  created_at    INTEGER NOT NULL,
  last_active_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_eu_email ON engagement_users(email);
CREATE INDEX IF NOT EXISTS idx_eu_household ON engagement_users(household_id);
CREATE INDEX IF NOT EXISTS idx_eu_unsub ON engagement_users(unsub_token);

-- 2. Raw engagement events (app activity mirrored per user)
CREATE TABLE IF NOT EXISTS engagement_events (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES engagement_users(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,   -- app_login / meal_logged / meal_planned / grocery_added / partner_joined / email_verified
  metadata    TEXT,
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ee_user ON engagement_events(user_id);
CREATE INDEX IF NOT EXISTS idx_ee_time ON engagement_events(created_at);

-- 3. Every email send/draft logged
CREATE TABLE IF NOT EXISTS engagement_emails (
  id               TEXT PRIMARY KEY,
  user_id          TEXT NOT NULL REFERENCES engagement_users(id) ON DELETE CASCADE,
  email_type       TEXT NOT NULL,  -- welcome / app_onboarding / first_meal_logged / meal_streak / inactivity_nudge / partner_invite / premium_pitch / app_tip
  subject          TEXT NOT NULL,
  preview_text     TEXT,
  html_body        TEXT NOT NULL,
  text_body        TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'draft', -- draft / sent / failed
  context_snapshot TEXT,
  provider_message_id TEXT,
  error            TEXT,
  created_at       INTEGER NOT NULL,
  sent_at          INTEGER
);
CREATE INDEX IF NOT EXISTS idx_em_user ON engagement_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_em_type ON engagement_emails(email_type);
CREATE INDEX IF NOT EXISTS idx_em_status ON engagement_emails(status);
