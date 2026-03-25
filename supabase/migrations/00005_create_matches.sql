-- Matches: World Cup matches between two nations
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team_id UUID NOT NULL REFERENCES nations(id),
  away_team_id UUID NOT NULL REFERENCES nations(id),
  match_number INT,
  date TIMESTAMPTZ NOT NULL,
  stage TEXT NOT NULL DEFAULT 'group'
    CHECK (stage IN ('group', 'round-of-32', 'round-of-16', 'quarter-final', 'semi-final', 'third-place', 'final')),
  group_name CHAR(1),
  venue TEXT,
  city TEXT,

  status TEXT DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'live', 'completed', 'postponed', 'cancelled')),

  home_score INT,
  away_score INT,
  home_penalties INT,
  away_penalties INT,
  winner TEXT CHECK (winner IN ('home', 'away', 'draw')),

  betting_deadline TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT different_teams CHECK (home_team_id != away_team_id)
);

CREATE INDEX idx_matches_date ON matches(date);
CREATE INDEX idx_matches_stage ON matches(stage);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_home_team ON matches(home_team_id);
CREATE INDEX idx_matches_away_team ON matches(away_team_id);

CREATE TRIGGER matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Default betting deadline to match kickoff
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
  FOR EACH ROW EXECUTE FUNCTION set_betting_deadline();

-- Auto-calculate winner from scores
CREATE OR REPLACE FUNCTION calculate_match_winner()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.home_score IS NOT NULL AND NEW.away_score IS NOT NULL THEN
    IF NEW.home_score > NEW.away_score THEN
      NEW.winner := 'home';
    ELSIF NEW.away_score > NEW.home_score THEN
      NEW.winner := 'away';
    ELSE
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
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_match_winner_trigger
  BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION calculate_match_winner();

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Matches are viewable by everyone"
  ON matches FOR SELECT USING (true);

-- Enable realtime for live score updates
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
