-- Knockout support: undecided slots + idempotent match sync.
--
-- The WC2026 API returns undecided knockout teams as NULL (no "Winner Group A"
-- label) and adds knockout fixtures incrementally. We point both slots of an
-- undecided match at a single permanent "To Be Decided" placeholder nation, and
-- sync-matches swaps in real teams as groups finish.

-- 1. Permanent placeholder nation for undecided knockout slots.
INSERT INTO nations (name, code, flag, confederation)
VALUES ('To Be Decided', 'TBD', '🏳️', 'TBD')
ON CONFLICT (code) DO NOTHING;

-- 2. Knockout matches start as TBD vs TBD — both slots reference the same
--    placeholder, which the original guard forbids. Drop it; real API data
--    always carries two distinct real teams.
ALTER TABLE matches DROP CONSTRAINT IF EXISTS different_teams;

-- 3. Stable sync key: WC2026 API match id. Enables idempotent upserts.
ALTER TABLE matches ADD COLUMN external_id INT UNIQUE;
