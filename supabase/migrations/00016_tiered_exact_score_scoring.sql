-- Rewrite evaluate_match_bets for the LOCKED exact-score tiered model.
--
-- Tiers (all points sourced per-league from the leagues table):
--   1. Exact scoreline  -> points_for_exact_score, is_correct = true
--   2. Correct result   -> points_for_correct,     is_correct = true
--   3. Wrong result      -> points_for_wrong,        is_correct = false
--
-- Knockout / penalty nuance:
--   matches.home_score / away_score hold the REGULATION (full-time) score. When a
--   knockout is decided on penalties the regulation score is a draw, but
--   matches.winner is set from the shootout ('home' | 'away'). We therefore:
--     * compare the EXACT tier against regulation home_score / away_score, and
--     * compare the RESULT tier against match.winner.
--   A user who predicted the regulation draw scoreline exactly still gets the
--   exact-score points even though the match "winner" came from penalties.

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
BEGIN
  SELECT * INTO match_record FROM matches WHERE id = match_uuid;

  IF match_record.status != 'completed' THEN
    RAISE EXCEPTION 'Match is not completed yet';
  END IF;

  FOR bet_record IN
    SELECT b.*, l.points_for_exact_score, l.points_for_correct, l.points_for_wrong
    FROM bets b
    JOIN leagues l ON b.league_id = l.id
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
      -- Tier 2: correct result (winner derived from penalties for shootouts)
      pts := bet_record.points_for_correct;
      correct := true;
    ELSE
      -- Tier 3: wrong
      pts := bet_record.points_for_wrong;
      correct := false;
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
