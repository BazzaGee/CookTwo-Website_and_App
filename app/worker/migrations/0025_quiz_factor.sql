-- Factor quiz funnels (/quiz/weight, /quiz/keto, …).
--
-- The nine factor quizzes post { factor, answers[] } instead of the legacy
-- goal/blocker/situation vocabulary. Their answers are kept as a JSON array
-- on the same attempt row, tagged with the factor id, so every funnel stays
-- queryable in one place. Additive only: the legacy /quiz/ path is untouched.

ALTER TABLE quiz_attempts ADD COLUMN factor TEXT;
ALTER TABLE quiz_attempts ADD COLUMN answers TEXT;

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_factor ON quiz_attempts(factor);
