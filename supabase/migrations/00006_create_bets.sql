-- Bets: user predictions for match outcomes
CREATE TABLE bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,

  predicted_winner TEXT NOT NULL CHECK (predicted_winner IN ('home', 'away', 'draw')),
  predicted_home_score INT,
  predicted_away_score INT,

  is_correct BOOLEAN,
  points_earned INT DEFAULT 0,
  evaluated_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (user_id, match_id, league_id)
);

CREATE INDEX idx_bets_user ON bets(user_id);
CREATE INDEX idx_bets_match ON bets(match_id);
CREATE INDEX idx_bets_league ON bets(league_id);
CREATE INDEX idx_bets_user_league ON bets(user_id, league_id);

CREATE TRIGGER bets_updated_at
  BEFORE UPDATE ON bets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Validate bet before deadline
CREATE OR REPLACE FUNCTION validate_bet_deadline()
RETURNS TRIGGER AS $$
DECLARE
  match_deadline TIMESTAMPTZ;
BEGIN
  SELECT betting_deadline INTO match_deadline FROM matches WHERE id = NEW.match_id;
  IF match_deadline IS NOT NULL AND NOW() > match_deadline THEN
    RAISE EXCEPTION 'Betting deadline has passed for this match';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_bet_deadline_trigger
  BEFORE INSERT OR UPDATE ON bets
  FOR EACH ROW EXECUTE FUNCTION validate_bet_deadline();

-- Validate league membership
CREATE OR REPLACE FUNCTION validate_league_membership()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM league_members
    WHERE league_id = NEW.league_id AND user_id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'User is not a member of this league';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_league_membership_trigger
  BEFORE INSERT ON bets
  FOR EACH ROW EXECUTE FUNCTION validate_league_membership();

ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view bets in their leagues after deadline"
  ON bets FOR SELECT
  USING (
    user_id = auth.uid()
    OR (
      EXISTS (SELECT 1 FROM league_members WHERE league_id = bets.league_id AND user_id = auth.uid())
      AND EXISTS (SELECT 1 FROM matches WHERE id = bets.match_id AND betting_deadline < NOW())
    )
  );

CREATE POLICY "Users can create own bets"
  ON bets FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bets"
  ON bets FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bets"
  ON bets FOR DELETE USING (auth.uid() = user_id);
