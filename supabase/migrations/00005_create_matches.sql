-- ============================================
-- MATCHES TABLE
-- World Cup matches between two nations
-- ============================================

CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Teams (references to nations)
  home_team_id UUID NOT NULL REFERENCES nations(id),
  away_team_id UUID NOT NULL REFERENCES nations(id),
  
  -- Match info
  match_number INT,                    -- Official FIFA match number
  date TIMESTAMPTZ NOT NULL,
  stage TEXT NOT NULL DEFAULT 'group'  -- group, round-of-32, round-of-16, quarter-final, semi-final, third-place, final
    CHECK (stage IN ('group', 'round-of-32', 'round-of-16', 'quarter-final', 'semi-final', 'third-place', 'final')),
  group_name CHAR(1),                  -- For group stage matches
  venue TEXT,
  city TEXT,
  
  -- Status
  status TEXT DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'live', 'completed', 'postponed', 'cancelled')),
  
  -- Results (null until match is completed)
  home_score INT,
  away_score INT,
  home_penalties INT,                  -- For knockout rounds
  away_penalties INT,
  winner TEXT CHECK (winner IN ('home', 'away', 'draw', NULL)),
  
  -- Betting deadline (usually kickoff time)
  betting_deadline TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure teams are different
  CONSTRAINT different_teams CHECK (home_team_id != away_team_id)
);

-- Index for date-based queries (upcoming matches)
CREATE INDEX idx_matches_date ON matches(date);

-- Index for stage filtering
CREATE INDEX idx_matches_stage ON matches(stage);

-- Index for status filtering
CREATE INDEX idx_matches_status ON matches(status);

-- Index for team lookups
CREATE INDEX idx_matches_home_team ON matches(home_team_id);
CREATE INDEX idx_matches_away_team ON matches(away_team_id);

-- Trigger to auto-update updated_at
CREATE TRIGGER matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Set betting deadline to match date if not specified
CREATE OR REPLACE FUNCTION set_betting_deadline()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.betting_deadline IS NULL THEN
    NEW.betting_deadline := NEW.date;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_betting_deadline_trigger
  BEFORE INSERT ON matches
  FOR EACH ROW
  EXECUTE FUNCTION set_betting_deadline();

-- Function to determine winner when result is set
CREATE OR REPLACE FUNCTION calculate_match_winner()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.home_score IS NOT NULL AND NEW.away_score IS NOT NULL THEN
    IF NEW.home_score > NEW.away_score THEN
      NEW.winner := 'home';
    ELSIF NEW.away_score > NEW.home_score THEN
      NEW.winner := 'away';
    ELSE
      -- Check penalties for knockout matches
      IF NEW.home_penalties IS NOT NULL AND NEW.away_penalties IS NOT NULL THEN
        IF NEW.home_penalties > NEW.away_penalties THEN
          NEW.winner := 'home';
        ELSE
          NEW.winner := 'away';
        END IF;
      ELSE
        NEW.winner := 'draw';
      END IF;
    END IF;
    
    -- Auto-set status to completed
    IF NEW.status = 'live' OR NEW.status = 'scheduled' THEN
      NEW.status := 'completed';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_match_winner_trigger
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION calculate_match_winner();

-- Row Level Security
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Everyone can view matches
CREATE POLICY "Matches are viewable by everyone"
  ON matches FOR SELECT
  USING (true);

COMMENT ON TABLE matches IS 'World Cup matches between nations';
COMMENT ON COLUMN matches.stage IS 'Tournament stage: group, round-of-16, quarter-final, semi-final, third-place, final';
COMMENT ON COLUMN matches.winner IS 'Match winner: home, away, or draw';
