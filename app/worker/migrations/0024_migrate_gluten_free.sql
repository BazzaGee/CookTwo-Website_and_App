-- 0024_migrate_gluten_free.sql
-- Back-migrates partners that used the legacy diet='gluten-free' value into
-- the stackable condition layer introduced in 0022/0023.
--
-- Runs after 0023 has seeded the gluten-free catalog row so the foreign key
-- on partner_conditions.condition_key is satisfied.

INSERT OR IGNORE INTO partner_conditions (id, partner_id, condition_key, created_at)
SELECT lower(hex(randomblob(16))), id, 'gluten-free', unixepoch()
FROM partners
WHERE diet = 'gluten-free';

UPDATE partners SET diet = 'omnivore' WHERE diet = 'gluten-free';
