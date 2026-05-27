-- Extend nations with editorial/profile data for the Nations browse + detail pages.
-- API (/teams) only supplies: external id, name, code, flag_url, group_name.
-- Everything below is editorial (populated manually/later) — this migration is schema-only.

ALTER TABLE nations
  -- Sync mapping: WC2026 API team id. Stable key for idempotent upserts.
  ADD COLUMN external_id INT UNIQUE,
  -- Image flag (URL). Existing `flag` column keeps the emoji fallback.
  ADD COLUMN flag_url TEXT,
  -- Editorial profile
  ADD COLUMN nickname TEXT,              -- e.g. "Seleção", "Les Bleus"
  ADD COLUMN bio TEXT,                   -- free-text blurb shown on detail page
  ADD COLUMN fifa_ranking INT,
  ADD COLUMN home_stadium TEXT,          -- nation's own home ground (NOT a WC venue)
  ADD COLUMN home_stadium_city TEXT,
  -- World Cup history
  ADD COLUMN wc_appearances INT DEFAULT 0,
  ADD COLUMN wc_titles INT DEFAULT 0,
  ADD COLUMN best_finish TEXT,           -- e.g. "Winners (2018)", "Quarter-finals"
  ADD COLUMN first_wc_year INT;

-- Football heroes: one nation -> many players, each with a photo.
CREATE TABLE nation_heroes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nation_id UUID NOT NULL REFERENCES nations(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  position TEXT,            -- e.g. "Forward", "Goalkeeper"
  years_active TEXT,        -- free-text, e.g. "1994–2006"
  description TEXT,         -- why they're a hero
  photo_url TEXT,
  sort_order INT DEFAULT 0, -- manual ordering within a nation

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_nation_heroes_nation ON nation_heroes(nation_id);
CREATE INDEX idx_nation_heroes_order ON nation_heroes(nation_id, sort_order);

CREATE TRIGGER nation_heroes_updated_at
  BEFORE UPDATE ON nation_heroes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE nation_heroes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Nation heroes are viewable by everyone"
  ON nation_heroes FOR SELECT USING (true);
