-- Favorite team: each user can pick one nation. Bets on matches that nation
-- plays in score DOUBLE points (all tiers alike).
--
-- ON DELETE SET NULL so dropping a nation never orphans a profile row.
-- Built on the 00019 baseline (correct result hardcoded to 1 point).

ALTER TABLE profiles
  ADD COLUMN favorite_nation_id UUID REFERENCES nations(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION evaluate_match_bets(match_uuid UUID)
RETURNS TABLE (
  bet_id UUID,
  user_id UUID,
  is_correct BOOLEAN,
  points_earned INT
) AS $$
DECLARE
  match_record RECORD;
  bet_record RECORD;
  pts INT;
  correct BOOLEAN;
  is_favorite BOOLEAN;
BEGIN
  SELECT * INTO match_record FROM matches WHERE id = match_uuid;

  IF match_record.status != 'completed' THEN
    RAISE EXCEPTION 'Match is not completed yet';
  END IF;

  FOR bet_record IN
    SELECT b.*, l.points_for_exact_score, l.points_for_wrong,
           p.favorite_nation_id
    FROM bets b
    JOIN leagues l ON b.league_id = l.id
    JOIN profiles p ON b.user_id = p.id
    WHERE b.match_id = match_uuid AND b.evaluated_at IS NULL
  LOOP
    IF bet_record.predicted_home_score IS NOT NULL
       AND bet_record.predicted_away_score IS NOT NULL
       AND bet_record.predicted_home_score = match_record.home_score
       AND bet_record.predicted_away_score = match_record.away_score THEN
      -- Tier 1: exact regulation scoreline
      pts := bet_record.points_for_exact_score;
      correct := true;
    ELSIF bet_record.predicted_winner = match_record.winner THEN
      -- Tier 2: correct result (always 1 point)
      pts := 1;
      correct := true;
    ELSE
      -- Tier 3: wrong
      pts := bet_record.points_for_wrong;
      correct := false;
    END IF;

    -- Favorite-team bonus: double points if the user's favorite nation plays.
    is_favorite := bet_record.favorite_nation_id IS NOT NULL
      AND (bet_record.favorite_nation_id = match_record.home_team_id
           OR bet_record.favorite_nation_id = match_record.away_team_id);
    IF is_favorite THEN
      pts := pts * 2;
    END IF;

    UPDATE bets SET
      is_correct = correct,
      points_earned = pts,
      evaluated_at = NOW()
    WHERE id = bet_record.id;

    UPDATE league_members SET
      league_points = league_points + pts,
      league_correct_bets = league_correct_bets + CASE WHEN correct THEN 1 ELSE 0 END,
      league_total_bets = league_total_bets + 1
    WHERE league_members.league_id = bet_record.league_id
      AND league_members.user_id = bet_record.user_id;

    UPDATE profiles SET
      total_points = total_points + pts,
      correct_bets = correct_bets + CASE WHEN correct THEN 1 ELSE 0 END,
      total_bets = total_bets + 1
    WHERE id = bet_record.user_id;

    bet_id := bet_record.id;
    user_id := bet_record.user_id;
    is_correct := correct;
    points_earned := pts;
    RETURN NEXT;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
