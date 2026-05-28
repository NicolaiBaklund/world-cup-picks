-- Lock betting a short time before kickoff instead of right at kickoff.
-- Protects against clock skew, network latency, and the "I clicked at the last
-- second" race where the request lands after kickoff and gets rejected.
--
-- Buffer: 2 minutes before NEW.date (kickoff). The set_betting_deadline trigger
-- still only fires on INSERT, so existing rows aren't disturbed by future
-- upserts from sync-matches. Existing rows where betting_deadline equals
-- the kickoff (i.e. the previous default) are backfilled.

CREATE OR REPLACE FUNCTION set_betting_deadline()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.betting_deadline IS NULL THEN
    NEW.betting_deadline := NEW.date - INTERVAL '2 minutes';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Backfill existing matches that still carry the old default (= kickoff).
UPDATE matches
SET betting_deadline = date - INTERVAL '2 minutes'
WHERE betting_deadline = date;
