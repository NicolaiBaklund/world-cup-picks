-- Leagues: betting groups for friends to compete
CREATE TABLE leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  code CHAR(6) UNIQUE NOT NULL DEFAULT '',
  is_public BOOLEAN DEFAULT false,
  max_members INT DEFAULT 50,
  allow_late_join BOOLEAN DEFAULT true,
  points_for_correct INT DEFAULT 1,
  points_for_wrong INT DEFAULT 0,
  points_for_exact_score INT DEFAULT 3,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leagues_code ON leagues(code);
CREATE INDEX idx_leagues_creator ON leagues(creator_id);
CREATE INDEX idx_leagues_public ON leagues(is_public) WHERE is_public = true;

CREATE TRIGGER leagues_updated_at
  BEFORE UPDATE ON leagues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate unique 6-char invite code
CREATE OR REPLACE FUNCTION generate_league_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code CHAR(6);
  code_exists BOOLEAN;
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    LOOP
      new_code := upper(substr(md5(random()::text), 1, 6));
      SELECT EXISTS(SELECT 1 FROM leagues WHERE code = new_code) INTO code_exists;
      EXIT WHEN NOT code_exists;
    END LOOP;
    NEW.code := new_code;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_league_code_trigger
  BEFORE INSERT ON leagues
  FOR EACH ROW EXECUTE FUNCTION generate_league_code();

ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;

-- NOTE: SELECT policy moved to 00004 (needs league_members table)

CREATE POLICY "Authenticated users can create leagues"
  ON leagues FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creator can update league"
  ON leagues FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creator can delete league"
  ON leagues FOR DELETE USING (auth.uid() = creator_id);
