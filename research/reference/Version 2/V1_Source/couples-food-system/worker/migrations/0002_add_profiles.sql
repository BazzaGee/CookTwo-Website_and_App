-- Add profile fields to partners table

ALTER TABLE partners ADD COLUMN diet TEXT DEFAULT 'omnivore';
ALTER TABLE partners ADD COLUMN allergies TEXT DEFAULT '';
ALTER TABLE partners ADD COLUMN updated_at INTEGER;
