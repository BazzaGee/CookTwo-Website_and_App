-- VSL lead capture — Kitchen Calculator, revealed mid-video
--
-- The VSL pages (/video/couples, /video/solo) grow an email box at the exact
-- second the video's opt-in slide appears. Two things that capture has to
-- answer, and this migration is what makes them queryable:
--
--   1. Which video produced the address. `via` is 'vsl-couples' or
--      'vsl-solo'; `vsl_video` carries the more precise R2 slug
--      ('couples-finale' / 'solo-finale') so a row can still be joined to
--      the exact asset if we re-cut a video later.
--
--   2. Whether the person has opted back out. `unsubscribe_token` is the
--      same UUID as `verify_token` — the confirmation link doubles as the
--      unsubscribe link, which keeps one token per person and one row.
--
-- `via` keeps its 0018 meaning ("our own stable key for which asset the click
-- came through"); for a VSL capture the asset IS the video. utm_content was
-- previously folded into `via`, so it now gets its own column rather than
-- being lost when `via` starts carrying the video key.

ALTER TABLE lead_magnets ADD COLUMN vsl_video TEXT;
ALTER TABLE lead_magnets ADD COLUMN utm_content TEXT;
ALTER TABLE lead_magnets ADD COLUMN unsubscribed INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_lead_magnets_vsl_video ON lead_magnets(vsl_video);
