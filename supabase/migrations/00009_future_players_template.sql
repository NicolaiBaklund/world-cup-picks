-- ============================================
-- PLAYERS TABLE (TEMPLATE FOR FUTURE USE)
-- Uncomment and run when ready to add players
-- ============================================

-- This file is a template for when you want to add players.
-- To activate: Remove the block comments and run as a migration.

/*

-- Players table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic info
  name TEXT NOT NULL,
  short_name TEXT,                    -- Display name (e.g., "Messi", "CR7")
  
  -- Team
  nation_id UUID NOT NULL REFERENCES nations(id),
  
  -- Details
  position TEXT CHECK (position IN ('goalkeeper', 'defender', 'midfielder', 'forward')),
  jersey_number INT,
  date_of_birth DATE,
  height_cm INT,
  
  -- Club info (optional)
  club_name TEXT,
  club_country TEXT,
  
  -- Tournament stats
  goals INT DEFAULT 0,
  assists INT DEFAULT 0,
  yellow_cards INT DEFAULT 0,
  red_cards INT DEFAULT 0,
  minutes_played INT DEFAULT 0,
  matches_played INT DEFAULT 0,
  
  -- Status
  is_captain BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,     -- Injured/suspended = false
  
  -- Metadata
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_players_nation ON players(nation_id);
CREATE INDEX idx_players_position ON players(position);
CREATE INDEX idx_players_name ON players(name);

-- Trigger for updated_at
CREATE TRIGGER players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players are viewable by everyone"
  ON players FOR SELECT
  USING (true);

COMMENT ON TABLE players IS 'World Cup players/squad members';

-- ============================================
-- PLAYER BETS (bet on top scorer, etc.)
-- ============================================

CREATE TABLE player_bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  
  -- Bet type
  bet_type TEXT NOT NULL CHECK (bet_type IN (
    'golden_boot',      -- Top scorer
    'golden_ball',      -- Best player
    'golden_glove',     -- Best goalkeeper
    'young_player',     -- Best young player
    'first_goal',       -- First goal of tournament
    'most_assists'      -- Most assists
  )),
  
  -- Prediction
  player_id UUID NOT NULL REFERENCES players(id),
  
  -- Results
  is_correct BOOLEAN,
  points_earned INT DEFAULT 0,
  evaluated_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- One bet per type per user per league
  UNIQUE (user_id, league_id, bet_type)
);

CREATE INDEX idx_player_bets_user ON player_bets(user_id);
CREATE INDEX idx_player_bets_league ON player_bets(league_id);

ALTER TABLE player_bets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own player bets"
  ON player_bets FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own player bets"
  ON player_bets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- MATCH EVENTS (goals, cards, etc.)
-- ============================================

CREATE TABLE match_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  
  -- Event details
  event_type TEXT NOT NULL CHECK (event_type IN (
    'goal', 'own_goal', 'penalty_goal', 'penalty_miss',
    'yellow_card', 'red_card', 'second_yellow',
    'substitution_in', 'substitution_out',
    'var_decision'
  )),
  
  minute INT NOT NULL,
  added_time INT DEFAULT 0,
  
  -- Players involved
  player_id UUID REFERENCES players(id),
  secondary_player_id UUID REFERENCES players(id),  -- Assist, replaced player, etc.
  
  -- Which team
  team TEXT CHECK (team IN ('home', 'away')),
  
  -- Metadata
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_match_events_match ON match_events(match_id);
CREATE INDEX idx_match_events_player ON match_events(player_id);
CREATE INDEX idx_match_events_type ON match_events(event_type);

ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Match events are viewable by everyone"
  ON match_events FOR SELECT
  USING (true);

COMMENT ON TABLE match_events IS 'In-match events: goals, cards, substitutions';

*/

-- Placeholder to make this a valid SQL file
SELECT 'Players template ready for future use' as status;
