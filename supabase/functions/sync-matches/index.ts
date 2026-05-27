// Edge Function: sync-matches
// Pulls fixtures from the WC2026 API and upserts them into `matches`.
//
// Run DAILY (and during match days for live scores): the API adds knockout
// fixtures incrementally AND resolves teams as the group stage finishes.
//
// Undecided teams come back as null -> point at the "To Be Decided" placeholder
// nation (migration 00011). Real teams map via nations.external_id.
//
// Setting status='completed' on an existing row fires the DB triggers
// (calculate_match_winner -> auto_evaluate_bets), which score bets automatically.
//
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, WC2026_API_KEY

import { createClient } from 'jsr:@supabase/supabase-js@2'

const WC_BASE = 'https://api.wc2026api.com'

interface ApiMatch {
  id: number
  match_number: number | null
  round: string
  group_name: string | null
  home_team_id: number | null
  away_team_id: number | null
  stadium: string | null
  stadium_city: string | null
  kickoff_utc: string
  status: string
  home_score: number | null
  away_score: number | null
  home_pen: number | null
  away_pen: number | null
}

// API round -> schema stage. NOTE: live API uses R32/R16/QF/SF/3rd, NOT the
// round_of_32/quarter/... values shown in the published docs.
const STAGE: Record<string, string> = {
  group: 'group',
  R32: 'round-of-32',
  R16: 'round-of-16',
  QF: 'quarter-final',
  SF: 'semi-final',
  '3rd': 'third-place',
  final: 'final',
}

// API status -> schema status
const STATUS: Record<string, string> = {
  scheduled: 'scheduled',
  live: 'live',
  finished: 'completed',
}

Deno.serve(async (req) => {
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

  const supabase = createClient(supabaseUrl, serviceKey)

  // 1. Build external_id -> nation UUID map (+ the TBD placeholder).
  const { data: nations, error: nErr } = await supabase
    .from('nations')
    .select('id, external_id, code')
  if (nErr) {
    return new Response(JSON.stringify({ error: `nations: ${nErr.message}` }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }

  const byExternal = new Map<number, string>()
  let tbdId: string | undefined
  for (const n of nations ?? []) {
    if (n.external_id != null) byExternal.set(n.external_id, n.id)
    if (n.code === 'TBD') tbdId = n.id
  }
  if (!tbdId) {
    return new Response(
      JSON.stringify({ error: 'TBD placeholder nation missing — run migration 00011 + sync-teams first' }),
      { status: 412, headers: { 'Content-Type': 'application/json' } },
    )
  }

  // 2. Fetch all matches from the API.
  const res = await fetch(`${WC_BASE}/matches`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: `WC2026 API ${res.status}`, body: await res.text() }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    )
  }
  const matches: ApiMatch[] = await res.json()

  // 3. Map to schema rows. Undecided team -> TBD placeholder.
  const teamId = (ext: number | null) => (ext != null ? byExternal.get(ext) ?? tbdId : tbdId)

  const rows = matches.map((m) => ({
    external_id: m.id,
    match_number: m.match_number,
    stage: STAGE[m.round] ?? 'group',
    group_name: m.group_name,
    home_team_id: teamId(m.home_team_id),
    away_team_id: teamId(m.away_team_id),
    date: m.kickoff_utc,
    venue: m.stadium,
    city: m.stadium_city,
    status: STATUS[m.status] ?? 'scheduled',
    home_score: m.home_score,
    away_score: m.away_score,
    home_penalties: m.home_pen,
    away_penalties: m.away_pen,
  }))

  // 4. Upsert on external_id. Triggers handle winner calc + bet scoring on status change.
  const { error, count } = await supabase
    .from('matches')
    .upsert(rows, { onConflict: 'external_id', count: 'exact' })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(
    JSON.stringify({ ok: true, fetched: matches.length, upserted: count }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
