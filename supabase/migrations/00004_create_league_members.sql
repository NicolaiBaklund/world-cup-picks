-- League members: junction table linking users to leagues
CREATE TABLE league_members (
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),

  league_points INT DEFAULT 0,
  league_correct_bets INT DEFAULT 0,
  league_total_bets INT DEFAULT 0,

  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (league_id, user_id)
);

CREATE INDEX idx_league_members_user ON league_members(user_id);
CREATE INDEX idx_league_members_leaderboard ON league_members(league_id, league_points DESC);

-- Auto-add creator as admin
CREATE OR REPLACE FUNCTION add_creator_to_league()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO league_members (league_id, user_id, role)
  VALUES (NEW.id, NEW.creator_id, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER add_creator_to_league_trigger
  AFTER INSERT ON leagues
  FOR EACH ROW EXECUTE FUNCTION add_creator_to_league();

ALTER TABLE league_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "League members can view membership"
  ON league_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM league_members lm
      WHERE lm.league_id = league_members.league_id AND lm.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM leagues WHERE id = league_members.league_id AND is_public = true
    )
  );

CREATE POLICY "Users can join leagues"
  ON league_members FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave or admins can remove"
  ON league_members FOR DELETE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM leagues WHERE id = league_members.league_id AND creator_id = auth.uid()
    )
  );
