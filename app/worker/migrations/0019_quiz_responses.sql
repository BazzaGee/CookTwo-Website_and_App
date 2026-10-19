-- Quiz funnel responses (the "yes responders" questionnaire)
--
-- Captured on cooktwo.com/quiz. This is the bridge between the win-back
-- emails and the VSL finales: an answer set lands here, the angle is derived,
-- and the reader is sent to /video/couples or /video/solo.
--
-- Kept separate from `lead_magnets` because the funnel is different: the
-- calculator is an opt-in (double opt-in, email required to re-serve results),
-- while the quiz already knows the respondent (they replied "yes" to an email)
-- so there is no verification flow — just capture, tag, redirect.

CREATE TABLE IF NOT EXISTS quiz_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,

  -- What the reader answered
  goal TEXT,                -- 'lose' | 'keep' | 'fitness' | 'not-sure'
  blocker TEXT,             -- 'time' | 'willpower' | 'mixed-house' | 'takeaway' | 'no-ideas'
  situation TEXT,           -- 'solo' | 'same-goal' | 'different-goals'
  angle TEXT NOT NULL,      -- 'couples' | 'solo' (derived from situation)

  -- First-touch attribution (same scheme as the PDFs: PDFs and emails carry
  -- utm_campaign=winback-2026-q4; utm_content = which email carried the link)
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  via TEXT,

  -- Resend mirror bookkeeping
  resend_synced INTEGER DEFAULT 0,

  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_quiz_responses_angle ON quiz_responses(angle);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_campaign ON quiz_responses(utm_campaign);
