// Edge Function: sync-teams
// Pulls the 48 nations from the WC2026 API and upserts them into `nations`.
// Teams are STATIC — run this once (or rarely), never on a poll loop.
//
// Env (Edge Function runtime injects SUPABASE_* automatically; WC2026_API_KEY is a project secret):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, WC2026_API_KEY
//
// Upsert key: nations.external_id (unique). Editorial columns (bio, heroes,
// home_stadium, wc_*) are NOT touched here — they are filled manually later.
//
// NOTE: the existing placeholder seed rows ("TBD A3" etc.) have external_id = NULL
// and may collide on the `code` UNIQUE constraint (e.g. 'MEX'). Clear the placeholder
// seed before the first real run:  DELETE FROM nations;  (safe while no matches/bets seeded)

import { createClient } from 'jsr:@supabase/supabase-js@2'

const WC_BASE = 'https://api.wc2026api.com'

interface ApiTeam {
  id: number
  name: string
  code: string
  flag_url: string | null
  group_name: string
}

Deno.serve(async (req) => {
  // Guard: only allow POST (manual invoke / scheduled trigger)
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const apiKey = Deno.env.get('WC2026_API_KEY')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!apiKey || !supabaseUrl || !serviceKey) {
    return new Response(
      JSON.stringify({ error: 'Missing env: WC2026_API_KEY / SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  // 1. Fetch teams from WC2026 API
  const res = await fetch(`${WC_BASE}/teams`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: `WC2026 API ${res.status}`, body: await res.text() }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const teams: ApiTeam[] = await res.json()

  // 2. Map API shape -> nations columns (only API-sourced fields; editorial left alone)
  const rows = teams.map((t) => ({
    external_id: t.id,
    name: t.name,
    code: t.code,
    group_name: t.group_name,
    flag_url: t.flag_url,
  }))

  // 3. Upsert on external_id
  const supabase = createClient(supabaseUrl, serviceKey)
  const { error, count } = await supabase
    .from('nations')
    .upsert(rows, { onConflict: 'external_id', count: 'exact' })

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  return new Response(
    JSON.stringify({ ok: true, fetched: teams.length, upserted: count }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
