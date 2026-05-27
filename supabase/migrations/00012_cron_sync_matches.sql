-- Daily cron: invoke the sync-matches Edge Function so fixtures, knockout team
-- resolution, and scores stay fresh without manual runs.
--
-- pg_cron schedules the job; pg_net makes the HTTP call. The anon (publishable)
-- key is intentionally public (client-side key) and only routes the request —
-- the function authorizes its own DB writes with the service role internally.
--
-- Cadence: once daily at 05:00 UTC. Enough pre-tournament and for knockout
-- resolution. Live in-match score polling needs a tighter schedule + a Pro API
-- key (Free = 100 req/day) — add that closer to kickoff.

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Replace any prior definition so this migration is re-runnable.
SELECT cron.unschedule('sync-matches-daily')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'sync-matches-daily');

SELECT cron.schedule(
  'sync-matches-daily',
  '0 5 * * *',
  $$
  SELECT net.http_post(
    url := 'https://ymjkbbwiuagkbruziroc.supabase.co/functions/v1/sync-matches',
    headers := '{"Content-Type":"application/json","apikey":"sb_publishable_2mZMp4sw_K92koLhWwnXJQ_4fH13JSU"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
