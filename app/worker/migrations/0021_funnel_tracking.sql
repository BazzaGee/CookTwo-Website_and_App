-- Funnel tracking — one session spine, an event stream, and quiz answers
-- that are stored even when no email was present.
--
-- Three new tables and five additive columns. Everything is additive so this
-- migration can be applied BEFORE the new worker code ships: the old routes
-- keep working against the old columns (their ON CONFLICT(email) upsert on
-- quiz_responses is untouched), and the new routes degrade gracefully if a
-- table is missing.
--
--   funnel_sessions  one row per browser journey (quiz landing -> VSL -> CTA
--                    -> verify). Holds identity, attribution, the rollup
--                    metrics the dashboard reads, and the stage timestamps.
--   funnel_events    raw event stream. `id` is a client-generated UUID so a
--                    retried beacon can never double-insert (INSERT OR IGNORE).
--   quiz_attempts    every quiz completion, anonymous allowed. quiz_responses
--                    stays what it always was: the email-keyed latest record
--                    that feeds the Resend contact mirror.

CREATE TABLE IF NOT EXISTS funnel_sessions (
  id TEXT PRIMARY KEY,              -- ct_sid, sessionStorage UUID
  visitor_id TEXT,                  -- ct_vid, localStorage UUID (1 year)

  -- Which funnel entry created the row and where it went afterwards
  entry TEXT NOT NULL DEFAULT 'quiz',   -- 'quiz' | 'vsl'
  vsl_mode TEXT,                    -- 'couples' | 'solo'
  vsl_video TEXT,                   -- 'couples-finale' | 'solo-finale'
  quiz_attempt_id TEXT,             -- latest quiz_attempts.id for this session

  -- Two email identities, never conflated:
  --   source_email  campaign recipient from ?e= on the quiz/VSL link
  --   capture_email what they typed into the VSL capture box
  source_email TEXT,
  capture_email TEXT,

  -- First-touch attribution
  landing_path TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  via TEXT,

  -- Context (never IP)
  timezone TEXT,
  country TEXT,
  device TEXT,                      -- 'desktop' | 'mobile' | 'tablet'
  user_agent TEXT,
  is_internal INTEGER NOT NULL DEFAULT 0,

  -- Time: started, last heartbeat, final exit (epoch ms)
  started_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  ended_at INTEGER,
  wall_ms INTEGER,

  -- Watch behaviour
  watch_ms INTEGER NOT NULL DEFAULT 0,   -- accumulated playing time
  max_position_s REAL NOT NULL DEFAULT 0, -- furthest video position reached
  video_duration_s REAL,
  played INTEGER NOT NULL DEFAULT 0,
  completed INTEGER NOT NULL DEFAULT 0,

  -- Quiz progress
  quiz_completed_at INTEGER,

  -- Offer + CTA
  offer_revealed_at INTEGER,
  offer_reveal_position_s REAL,
  cta_success_at INTEGER,
  cta_verified_at INTEGER,

  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_funnel_sessions_started ON funnel_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_funnel_sessions_visitor ON funnel_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_funnel_sessions_source ON funnel_sessions(source_email);
CREATE INDEX IF NOT EXISTS idx_funnel_sessions_capture ON funnel_sessions(capture_email);
CREATE INDEX IF NOT EXISTS idx_funnel_sessions_quiz ON funnel_sessions(quiz_attempt_id);
CREATE INDEX IF NOT EXISTS idx_funnel_sessions_campaign ON funnel_sessions(utm_campaign);

CREATE TABLE IF NOT EXISTS funnel_events (
  id TEXT PRIMARY KEY,              -- client UUID; idempotency key
  session_id TEXT NOT NULL,
  event TEXT NOT NULL,              -- allowlisted, see routes/funnel.ts
  position_s REAL,                  -- video position at the moment of event
  watch_ms INTEGER,                 -- watch accumulator at the moment of event
  value TEXT,                       -- small scalar (answer value, method, ...)
  meta TEXT,                        -- JSON, capped by the route
  client_ts INTEGER,                -- client epoch ms, clamped on ingest
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_funnel_events_session ON funnel_events(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_funnel_events_name ON funnel_events(event, created_at);
CREATE INDEX IF NOT EXISTS idx_funnel_events_created ON funnel_events(created_at);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  visitor_id TEXT,
  email TEXT,                       -- source campaign email (?e=), nullable
  goal TEXT,                        -- 'lose' | 'keep' | 'fitness' | 'not-sure'
  blocker TEXT,                     -- 'time' | 'willpower' | 'mixed-house' | 'takeaway' | 'no-ideas'
  situation TEXT,                   -- 'solo' | 'same-goal' | 'different-goals'
  angle TEXT NOT NULL,              -- 'couples' | 'solo' (derived)
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  via TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_session ON quiz_attempts(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_email ON quiz_attempts(email);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_created ON quiz_attempts(created_at);

-- Link the existing tables to the spine (nullable; old rows stay NULL)
ALTER TABLE quiz_responses ADD COLUMN session_id TEXT;
ALTER TABLE quiz_responses ADD COLUMN visitor_id TEXT;

ALTER TABLE lead_magnets ADD COLUMN session_id TEXT;
ALTER TABLE lead_magnets ADD COLUMN quiz_attempt_id TEXT;
ALTER TABLE lead_magnets ADD COLUMN source_email TEXT;

CREATE INDEX IF NOT EXISTS idx_lead_magnets_session ON lead_magnets(session_id);
