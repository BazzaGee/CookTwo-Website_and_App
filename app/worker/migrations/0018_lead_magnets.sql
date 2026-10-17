-- Lead magnet captures (Portion Split Calculator)
--
-- The calculator is the opt-in asset: a reader lands from a PDF, runs the
-- calculator, and submits an email to get their numbers. This table is the
-- single record of that opt-in, and it carries the UTM/via attribution so the
-- result can be joined back to a Resend contact.
--
-- Why this exists separately from `waitlist`: waitlist is the app gate
-- (double opt-in → access_token → PWA). The calculator is a marketing asset
-- that must be measurable on its own — which asset, which VSL, which angle,
-- which campaign drove the address.

CREATE TABLE IF NOT EXISTS lead_magnets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,

  -- Which lead magnet and what the reader asked for
  magnet TEXT NOT NULL DEFAULT 'portion-split',
  mode TEXT,                       -- 'couples' | 'solo'

  -- Computed target(s) the reader was shown. Stored so we can re-serve the
  -- same numbers after the confirmation click without asking twice.
  targets_json TEXT,

  -- First-touch attribution. `via` is our own key; the utm_* are what the
  -- landing page saw and what gets mirrored onto the Resend contact.
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  via TEXT,

  -- Double opt-in, same shape as waitlist so the two can share the verify flow
  verified INTEGER DEFAULT 0,
  verify_token TEXT,
  verified_at TEXT,

  -- Set once the attribution has been written to Resend, so we never re-send
  -- a contact upsert on every subsequent visit.
  resend_contact_id TEXT,

  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_lead_magnets_email ON lead_magnets(email);
CREATE INDEX IF NOT EXISTS idx_lead_magnets_token ON lead_magnets(verify_token);
CREATE INDEX IF NOT EXISTS idx_lead_magnets_via ON lead_magnets(via);
CREATE INDEX IF NOT EXISTS idx_lead_magnets_campaign ON lead_magnets(utm_campaign);
