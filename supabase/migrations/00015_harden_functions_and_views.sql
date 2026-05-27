-- Clear the Supabase linter warnings across the board:
--   * "Function Search Path Mutable" — every function needs a fixed search_path.
--   * "Security Definer View" — views should run with the querying user's rights
--     (security_invoker) so RLS on the base tables is respected.
--
-- Functions already pinned in earlier migrations (handle_new_user,
-- add_creator_to_league, is_league_member) are skipped.

-- 1. Pin search_path = public on the remaining functions (no body change needed).
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'auto_evaluate_bets',
        'calculate_match_winner',
        'evaluate_match_bets',
        'generate_league_code',
        'get_league_leaderboard',
        'set_betting_deadline',
        'update_updated_at',
        'validate_bet_deadline',
        'validate_league_membership'
      )
  LOOP
    EXECUTE format('ALTER FUNCTION %s SET search_path = public', r.sig);
  END LOOP;
END $$;

-- 2. Make views run as the querying user (RLS on base tables applies).
ALTER VIEW public.matches_with_teams SET (security_invoker = on);
ALTER VIEW public.user_bets_detailed SET (security_invoker = on);
ALTER VIEW public.group_standings   SET (security_invoker = on);
ALTER VIEW public.upcoming_matches  SET (security_invoker = on);
ALTER VIEW public.live_matches      SET (security_invoker = on);
ALTER VIEW public.recent_results    SET (security_invoker = on);
