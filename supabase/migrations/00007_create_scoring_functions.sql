-- ============================================
-- SCORING FUNCTIONS
-- Functions to evaluate bets and update standings
-- ============================================

-- Function to evaluate all bets for a completed match
CREATE OR REPLACE FUNCTION evaluate_match_bets(match_uuid UUID)
RETURNS TABLE (
  bet_id UUID,
  user_id UUID,
  is_correct BOOLEAN,
  points_earned INT
) AS $$
DECLARE
  match_record RECORD;
  league_settings RECORD;
  bet_record RECORD;
BEGIN
  -- Get match details
  SELECT * INTO match_record FROM matches WHERE id = match_uuid;
  
  IF match_record.status != 'completed' THEN
    RAISE EXCEPTION 'Match is not completed yet';
  END IF;
  
  -- Loop through all bets for this match
  FOR bet_record IN 
    SELECT b.*, l.points_for_correct, l.points_for_wrong, l.points_for_exact_score
    FROM bets b
    JOIN leagues l ON b.league_id = l.id
    WHERE b.match_id = match_uuid AND b.evaluated_at IS NULL
  LOOP
    -- Check if prediction is correct
    IF bet_record.predicted_winner = match_record.winner THEN
      -- Correct prediction
      UPDATE bets SET 
        is_correct = true,
        points_earned = bet_record.points_for_correct,
        evaluated_at = NOW()
      WHERE id = bet_record.id;
      
      -- Update league member stats
      UPDATE league_members SET
        league_points = league_points + bet_record.points_for_correct,
        league_correct_bets = league_correct_bets + 1,
        league_total_bets = league_total_bets + 1
      WHERE league_id = bet_record.league_id AND user_id = bet_record.user_id;
      
      -- Update profile stats
      UPDATE profiles SET
        total_points = total_points + bet_record.points_for_correct,
        correct_bets = correct_bets + 1,
        total_bets = total_bets + 1
      WHERE id = bet_record.user_id;
      
      -- Return result
      bet_id := bet_record.id;
      user_id := bet_record.user_id;
      is_correct := true;
      points_earned := bet_record.points_for_correct;
      RETURN NEXT;
    ELSE
      -- Wrong prediction
      UPDATE bets SET 
        is_correct = false,
        points_earned = bet_record.points_for_wrong,
        evaluated_at = NOW()
      WHERE id = bet_record.id;
      
      -- Update league member stats
      UPDATE league_members SET
        league_points = league_points + bet_record.points_for_wrong,
        league_total_bets = league_total_bets + 1
      WHERE league_id = bet_record.league_id AND user_id = bet_record.user_id;
      
      -- Update profile stats
      UPDATE profiles SET
        total_points = total_points + bet_record.points_for_wrong,
        total_bets = total_bets + 1
      WHERE id = bet_record.user_id;
      
      -- Return result
      bet_id := bet_record.id;
      user_id := bet_record.user_id;
      is_correct := false;
      points_earned := bet_record.points_for_wrong;
      RETURN NEXT;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get league leaderboard
CREATE OR REPLACE FUNCTION get_league_leaderboard(league_uuid UUID)
RETURNS TABLE (
  rank BIGINT,
  user_id UUID,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  points INT,
  correct_bets INT,
  total_bets INT,
  accuracy NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROW_NUMBER() OVER (ORDER BY lm.league_points DESC, lm.league_correct_bets DESC) as rank,
    p.id as user_id,
    p.username,
    p.display_name,
    p.avatar_url,
    lm.league_points as points,
    lm.league_correct_bets as correct_bets,
    lm.league_total_bets as total_bets,
    CASE 
      WHEN lm.league_total_bets > 0 
      THEN ROUND((lm.league_correct_bets::NUMERIC / lm.league_total_bets) * 100, 1)
      ELSE 0 
    END as accuracy
  FROM league_members lm
  JOIN profiles p ON lm.user_id = p.id
  WHERE lm.league_id = league_uuid
  ORDER BY lm.league_points DESC, lm.league_correct_bets DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-evaluate bets when match result is set
CREATE OR REPLACE FUNCTION auto_evaluate_bets()
RETURNS TRIGGER AS $$
BEGIN
  -- Only run when match becomes completed
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    PERFORM evaluate_match_bets(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER auto_evaluate_bets_trigger
  AFTER UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION auto_evaluate_bets();

COMMENT ON FUNCTION evaluate_match_bets IS 'Evaluates all bets for a completed match and updates points';
COMMENT ON FUNCTION get_league_leaderboard IS 'Returns ranked leaderboard for a league';
