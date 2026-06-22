-- Add body profile fields to partners table

ALTER TABLE partners ADD COLUMN weight_kg REAL;
ALTER TABLE partners ADD COLUMN height_cm REAL;
ALTER TABLE partners ADD COLUMN age INTEGER;
ALTER TABLE partners ADD COLUMN gender TEXT;
ALTER TABLE partners ADD COLUMN activity_level TEXT DEFAULT 'moderate';
ALTER TABLE partners ADD COLUMN goal TEXT DEFAULT 'maintain';
ALTER TABLE partners ADD COLUMN tdee INTEGER;
ALTER TABLE partners ADD COLUMN target_calories INTEGER;
