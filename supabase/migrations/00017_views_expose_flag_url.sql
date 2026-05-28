-- Expose nations.flag_url through the team / standings / bet views so the
-- frontend can render proper flag images (Scotland etc. don't render as the
-- subdivision flag emoji on most fonts).
--
-- Done as DROP + recreate (in dependency order) because Postgres'
-- CREATE OR REPLACE VIEW won't reshape columns picked up via SELECT * in
-- dependent views.

DROP VIEW IF EXISTS public.recent_results;
DROP VIEW IF EXISTS public.live_matches;
DROP VIEW IF EXISTS public.upcoming_matches;
DROP VIEW IF EXISTS public.user_bets_detailed;
DROP VIEW IF EXISTS public.matches_with_teams;
DROP VIEW IF EXISTS public.group_standings;

-- Matches with team details (+ flag_url)
CREATE VIEW public.matches_with_teams AS
SELECT
  m.*,
  ht.name     AS home_team_name,
  ht.code     AS home_team_code,
  ht.flag     AS home_team_flag,
  ht.flag_url AS home_team_flag_url,
  at.name     AS away_team_name,
  at.code     AS away_team_code,
  at.flag     AS away_team_flag,
  at.flag_url AS away_team_flag_url
FROM matches m
JOIN nations ht ON m.home_team_id = ht.id
JOIN nations at ON m.away_team_id = at.id;
ALTER VIEW public.matches_with_teams SET (security_invoker = on);

-- User bets with full details (+ flag_url)
CREATE VIEW public.user_bets_detailed AS
SELECT
  b.id          AS bet_id,
  b.user_id,
  b.league_id,
  b.predicted_winner,
  b.is_correct,
  b.points_earned,
  b.created_at  AS bet_created_at,
  b.evaluated_at,
  m.id          AS match_id,
  m.date        AS match_date,
  m.stage,
  m.status      AS match_status,
  m.home_score,
  m.away_score,
  m.winner      AS actual_winner,
  m.betting_deadline,
  ht.name       AS home_team_name,
  ht.code       AS home_team_code,
  ht.flag       AS home_team_flag,
  ht.flag_url   AS home_team_flag_url,
  at.name       AS away_team_name,
  at.code       AS away_team_code,
  at.flag       AS away_team_flag,
  at.flag_url   AS away_team_flag_url,
  l.name        AS league_name
FROM bets b
JOIN matches m ON b.match_id = m.id
JOIN nations ht ON m.home_team_id = ht.id
JOIN nations at ON m.away_team_id = at.id
JOIN leagues l ON b.league_id = l.id;
ALTER VIEW public.user_bets_detailed SET (security_invoker = on);

-- Group standings (+ flag_url)
CREATE VIEW public.group_standings AS
SELECT
  group_name,
  id,
  name,
  code,
  flag,
  flag_url,
  played,
  won,
  drawn,
  lost,
  goals_for,
  goals_against,
  (goals_for - goals_against) AS goal_difference,
  points,
  ROW_NUMBER() OVER (
    PARTITION BY group_name
    ORDER BY points DESC, (goals_for - goals_against) DESC, goals_for DESC
  ) AS position
FROM nations
WHERE group_name IS NOT NULL
ORDER BY group_name, position;
ALTER VIEW public.group_standings SET (security_invoker = on);

-- Dependent slice views over matches_with_teams
CREATE VIEW public.upcoming_matches AS
SELECT * FROM public.matches_with_teams
WHERE date > NOW() AND date < NOW() + INTERVAL '7 days' AND status = 'scheduled'
ORDER BY date;
ALTER VIEW public.upcoming_matches SET (security_invoker = on);

CREATE VIEW public.live_matches AS
SELECT * FROM public.matches_with_teams
WHERE status = 'live'
ORDER BY date;
ALTER VIEW public.live_matches SET (security_invoker = on);

CREATE VIEW public.recent_results AS
SELECT * FROM public.matches_with_teams
WHERE status = 'completed' AND date > NOW() - INTERVAL '7 days'
ORDER BY date DESC;
ALTER VIEW public.recent_results SET (security_invoker = on);
