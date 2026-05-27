-- Fix: signup failed with "Database error saving new user".
--
-- handle_new_user() is SECURITY DEFINER but had no search_path set. The trigger
-- fires inside GoTrue's session (role supabase_auth_admin, whose search_path is
-- `auth`), so the unqualified `profiles` reference could not be resolved and the
-- INSERT aborted, rolling back the whole auth.users insert.
--
-- Pin search_path = public and schema-qualify the table.

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;
