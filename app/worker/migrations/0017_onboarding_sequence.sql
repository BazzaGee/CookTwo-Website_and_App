-- Onboarding email sequence — schema + backfill
-- Adds sequence tracking to engagement_users and backfills existing
-- verified waitlist emails so current users enter the onboarding series.

-- 1. Sequence state (pointer to the next onboarding step to consider,
--    and graduation timestamp once the series is complete/expired)
ALTER TABLE engagement_users ADD COLUMN onboarding_step INTEGER NOT NULL DEFAULT 0;
ALTER TABLE engagement_users ADD COLUMN onboarding_completed_at INTEGER;

-- 2. Backfill: one engagement_users row per existing waitlist email.
--    IDs/tokens are opaque random hex — format is not load-bearing.
INSERT INTO engagement_users
  (id, waitlist_id, email, verified, unsubscribed, unsub_token, created_at, last_active_at)
SELECT
  lower(hex(randomblob(16))),
  w.id,
  w.email,
  COALESCE(w.verified, 0),
  0,
  lower(hex(randomblob(16))),
  CAST(strftime('%s', w.created_at) AS INTEGER) * 1000,
  CAST(strftime('%s', COALESCE(w.verified_at, w.created_at)) AS INTEGER) * 1000
FROM waitlist w
WHERE NOT EXISTS (SELECT 1 FROM engagement_users eu WHERE eu.email = w.email);
