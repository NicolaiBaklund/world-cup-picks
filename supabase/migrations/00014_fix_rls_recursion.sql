-- Fix: league creation (and any league_members read) failed with
--   42P17 "infinite recursion detected in policy for relation league_members".
--
-- The league_members SELECT policy queried league_members inside its own USING
-- clause; the leagues and bets SELECT policies also cross-query league_members.
-- Evaluating those policies re-evaluated the league_members policy → recursion.
--
-- Break the loop with a SECURITY DEFINER helper that checks membership without
-- invoking RLS. Policies call the helper instead of querying the table directly.

CREATE OR REPLACE FUNCTION public.is_league_member(_league_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM league_members
    WHERE league_id = _league_id AND user_id = _user_id
  );
$$;

-- league_members: see own rows, all rows of leagues you belong to, or public leagues.
DROP POLICY IF EXISTS "League members can view membership" ON league_members;
CREATE POLICY "League members can view membership"
  ON league_members FOR SELECT
  USING (
    user_id = auth.uid()
    OR public.is_league_member(league_id, auth.uid())
    OR EXISTS (SELECT 1 FROM leagues WHERE id = league_members.league_id AND is_public = true)
  );

-- leagues: public, your own, or leagues you belong to.
DROP POLICY IF EXISTS "Public leagues are viewable by everyone" ON leagues;
CREATE POLICY "Public leagues are viewable by everyone"
  ON leagues FOR SELECT
  USING (
    is_public = true
    OR creator_id = auth.uid()
    OR public.is_league_member(id, auth.uid())
  );

-- bets: your own, or league members after the match deadline.
DROP POLICY IF EXISTS "Users can view bets in their leagues after deadline" ON bets;
CREATE POLICY "Users can view bets in their leagues after deadline"
  ON bets FOR SELECT
  USING (
    user_id = auth.uid()
    OR (
      public.is_league_member(league_id, auth.uid())
      AND EXISTS (SELECT 1 FROM matches WHERE id = bets.match_id AND betting_deadline < NOW())
    )
  );

-- Harden the creator-membership trigger against the same definer/search_path class.
CREATE OR REPLACE FUNCTION add_creator_to_league()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.league_members (league_id, user_id, role)
  VALUES (NEW.id, NEW.creator_id, 'admin');
  RETURN NEW;
END;
$$;
