-- ============================================
-- BETS TABLE
-- User predictions for match outcomes
-- ============================================

CREATE TABLE bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  
  -- Prediction
  predicted_winner TEXT NOT NULL CHECK (predicted_winner IN ('home', 'away', 'draw')),
  
  -- Future: exact score prediction for bonus points
  predicted_home_score INT,
  predicted_away_score INT,
  
  -- Results (populated after match completes)
  is_correct BOOLEAN,
  points_earned INT DEFAULT 0,
  evaluated_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- One bet per user per match per league
  UNIQUE (user_id, match_id, league_id)
);

-- Index for user's bets
CREATE INDEX idx_bets_user ON bets(user_id);

-- Index for match bets (for bulk evaluation)
CREATE INDEX idx_bets_match ON bets(match_id);

-- Index for league bets (for leaderboards)
CREATE INDEX idx_bets_league ON bets(league_id);

-- Composite index for common queries
CREATE INDEX idx_bets_user_league ON bets(user_id, league_id);

-- Trigger to auto-update updated_at
CREATE TRIGGER bets_updated_at
  BEFORE UPDATE ON bets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Validate bet is placed before deadline
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
  FOR EACH ROW
  EXECUTE FUNCTION validate_bet_deadline();

-- Validate user is member of league
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
  FOR EACH ROW
  EXECUTE FUNCTION validate_league_membership();

-- Row Level Security
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

-- Users can view bets in their leagues (but only after match deadline)
CREATE POLICY "Users can view bets in their leagues after deadline"
  ON bets FOR SELECT
  USING (
    user_id = auth.uid()
    OR
    (
      EXISTS (
        SELECT 1 FROM league_members 
        WHERE league_id = bets.league_id AND user_id = auth.uid()
      )
      AND
      EXISTS (
        SELECT 1 FROM matches 
        WHERE id = bets.match_id AND betting_deadline < NOW()
      )
    )
  );

-- Users can create their own bets
CREATE POLICY "Users can create own bets"
  ON bets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bets (before deadline - enforced by trigger)
CREATE POLICY "Users can update own bets"
  ON bets FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own bets (before deadline)
CREATE POLICY "Users can delete own bets"
  ON bets FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON TABLE bets IS 'User predictions for match outcomes';
COMMENT ON COLUMN bets.predicted_winner IS 'Prediction: home, away, or draw';
