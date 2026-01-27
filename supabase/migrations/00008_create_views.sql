-- ============================================
-- VIEWS
-- Useful views for common queries
-- ============================================

-- View: Matches with team names (denormalized for easy querying)
CREATE OR REPLACE VIEW matches_with_teams AS
SELECT 
  m.id,
  m.match_number,
  m.date,
  m.stage,
  m.group_name,
  m.venue,
  m.city,
  m.status,
  m.home_score,
  m.away_score,
  m.home_penalties,
  m.away_penalties,
  m.winner,
  m.betting_deadline,
  m.created_at,
  m.updated_at,
  -- Home team
  m.home_team_id,
  ht.name as home_team_name,
  ht.code as home_team_code,
  ht.flag as home_team_flag,
  -- Away team
  m.away_team_id,
  at.name as away_team_name,
  at.code as away_team_code,
  at.flag as away_team_flag
FROM matches m
JOIN nations ht ON m.home_team_id = ht.id
JOIN nations at ON m.away_team_id = at.id;

-- View: User's bets with match and team details
CREATE OR REPLACE VIEW user_bets_detailed AS
SELECT 
  b.id as bet_id,
  b.user_id,
  b.league_id,
  b.predicted_winner,
  b.predicted_home_score,
  b.predicted_away_score,
  b.is_correct,
  b.points_earned,
  b.created_at as bet_created_at,
  b.evaluated_at,
  -- Match details
  m.id as match_id,
  m.date as match_date,
  m.stage,
  m.status as match_status,
  m.home_score as actual_home_score,
  m.away_score as actual_away_score,
  m.winner as actual_winner,
  m.betting_deadline,
  -- Teams
  ht.name as home_team_name,
  ht.code as home_team_code,
  ht.flag as home_team_flag,
  at.name as away_team_name,
  at.code as away_team_code,
  at.flag as away_team_flag,
  -- League
  l.name as league_name
FROM bets b
JOIN matches m ON b.match_id = m.id
JOIN nations ht ON m.home_team_id = ht.id
JOIN nations at ON m.away_team_id = at.id
JOIN leagues l ON b.league_id = l.id;

-- View: Group standings
CREATE OR REPLACE VIEW group_standings AS
SELECT 
  "group",
  id,
  name,
  code,
  flag,
  played,
  won,
  drawn,
  lost,
  goals_for,
  goals_against,
  (goals_for - goals_against) as goal_difference,
  points,
  ROW_NUMBER() OVER (
    PARTITION BY "group" 
    ORDER BY points DESC, (goals_for - goals_against) DESC, goals_for DESC
  ) as position
FROM nations
WHERE "group" IS NOT NULL
ORDER BY "group", position;

-- View: Upcoming matches (next 7 days)
CREATE OR REPLACE VIEW upcoming_matches AS
SELECT *
FROM matches_with_teams
WHERE date > NOW() 
  AND date < NOW() + INTERVAL '7 days'
  AND status = 'scheduled'
ORDER BY date;

-- View: Live matches
CREATE OR REPLACE VIEW live_matches AS
SELECT *
FROM matches_with_teams
WHERE status = 'live'
ORDER BY date;

-- View: Recent results (last 7 days)
CREATE OR REPLACE VIEW recent_results AS
SELECT *
FROM matches_with_teams
WHERE status = 'completed'
  AND date > NOW() - INTERVAL '7 days'
ORDER BY date DESC;

COMMENT ON VIEW matches_with_teams IS 'Matches with home and away team details joined';
COMMENT ON VIEW user_bets_detailed IS 'User bets with full match and team details';
COMMENT ON VIEW group_standings IS 'World Cup group stage standings';
