-- Matches with team details
CREATE OR REPLACE VIEW matches_with_teams AS
SELECT
  m.*,
  ht.name as home_team_name,
  ht.code as home_team_code,
  ht.flag as home_team_flag,
  at.name as away_team_name,
  at.code as away_team_code,
  at.flag as away_team_flag
FROM matches m
JOIN nations ht ON m.home_team_id = ht.id
JOIN nations at ON m.away_team_id = at.id;

-- User bets with full details
CREATE OR REPLACE VIEW user_bets_detailed AS
SELECT
  b.id as bet_id,
  b.user_id,
  b.league_id,
  b.predicted_winner,
  b.is_correct,
  b.points_earned,
  b.created_at as bet_created_at,
  b.evaluated_at,
  m.id as match_id,
  m.date as match_date,
  m.stage,
  m.status as match_status,
  m.home_score,
  m.away_score,
  m.winner as actual_winner,
  m.betting_deadline,
  ht.name as home_team_name,
  ht.code as home_team_code,
  ht.flag as home_team_flag,
  at.name as away_team_name,
  at.code as away_team_code,
  at.flag as away_team_flag,
  l.name as league_name
FROM bets b
JOIN matches m ON b.match_id = m.id
JOIN nations ht ON m.home_team_id = ht.id
JOIN nations at ON m.away_team_id = at.id
JOIN leagues l ON b.league_id = l.id;

-- Group standings
CREATE OR REPLACE VIEW group_standings AS
SELECT
  group_name,
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
    PARTITION BY group_name
    ORDER BY points DESC, (goals_for - goals_against) DESC, goals_for DESC
  ) as position
FROM nations
WHERE group_name IS NOT NULL
ORDER BY group_name, position;

-- Upcoming matches (next 7 days)
CREATE OR REPLACE VIEW upcoming_matches AS
SELECT * FROM matches_with_teams
WHERE date > NOW() AND date < NOW() + INTERVAL '7 days' AND status = 'scheduled'
ORDER BY date;

-- Live matches
CREATE OR REPLACE VIEW live_matches AS
SELECT * FROM matches_with_teams
WHERE status = 'live'
ORDER BY date;

-- Recent results (last 7 days)
CREATE OR REPLACE VIEW recent_results AS
SELECT * FROM matches_with_teams
WHERE status = 'completed' AND date > NOW() - INTERVAL '7 days'
ORDER BY date DESC;
