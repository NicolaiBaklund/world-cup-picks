# World Cup 2026 Picks — State & Roadmap

> Last updated: 2026-05-27. Tournament starts **2026-06-11** (~2 weeks out).

A web app where friends create private leagues and bet on World Cup 2026 match outcomes. Points are scored automatically when matches complete; leaderboards rank members.

> **Where we are (2026-05-27):** Frontend feature-complete, build green. Bet model locked (exact-score tiered) **and live** — tiered scoring (00016) + score-stepper betting shipped and verified end-to-end against all tiers incl. penalty-decided draws. **Real data live:** 48 nations + all 104 fixtures synced from WC2026 API (sync-teams + sync-matches deployed). Knockout matches show TBD vs TBD until groups finish.
> **Next:** hosting & deploy (Phase 3).

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Vite 8, React 19, TypeScript 5.9 |
| Styling | Tailwind v4, shadcn/ui, lucide icons, Geist font |
| Data | TanStack Query 5, React Router 7 |
| Backend | Supabase (Postgres + Auth + Realtime) — **live cloud project** |
| Data source | [WC2026 API](https://api.wc2026api.com) — fixtures, live scores, standings, teams (Free tier, key acquired) |
| Validation | Zod 4 |

---

## Current state

### Working (built across 13 commits)

- **Auth** — email/password login + register, session handling ([useAuth.ts](src/hooks/useAuth.ts)), protected routes
- **Dashboard** — upcoming / live / recent matches
- **Matches** — list, detail page, betting form
- **Calendar** — match schedule view
- **Groups** — standings tables (12 groups)
- **Nations** — detail pages
- **Leagues** — browse, create, join via 6-char code, leaderboard
- **Profile** — own profile + public user profiles, stats page
- **Notifications** — page + Supabase Realtime subscription ([useRealtime.ts](src/hooks/useRealtime.ts))
- **Resilience** — error boundary, 404 page, global error handling
- **DB** — 9 migrations: nations, profiles, leagues, league_members, matches, bets, match_events, scoring functions, views. RLS enabled on all tables.

### Production build

Passes (`npm run build`). One warning: JS bundle is 766 KB (226 KB gzip), no code-splitting. Acceptable for launch; optimize later.

### Known gaps / risks

| # | Issue | Impact |
|---|-------|--------|
| 1 | **No real fixture data** — seed has 48 nations but most are `TBD`, no matches seeded. WC2026 API now solves this (`/teams`, `/matches`) | Blocker: nothing to bet on |
| 2 | ~~**Scoring is winner-only**~~ — [00016](supabase/migrations/00016_tiered_exact_score_scoring.sql) rewrites `evaluate_match_bets` with tiered points (exact/result/wrong); `points_for_exact_score` now awarded | ✅ resolved |
| 8 | **WC2026 API Free tier = 100 req/day** — auto-suspends on overage; can't sustain live polling from many clients | Blocker for live scores at scale |
| 3 | ~~BetForm UI has no score inputs~~ — score steppers added to BetForm + inline auto-saving steppers on matches list | ✅ resolved |
| 4 | README is still default Vite template | Cosmetic |
| 5 | ~~Uncommitted work / stray files~~ — committed; `.temp` + `combined_setup.sql` gitignored | ✅ resolved |
| 6 | Hosting not set up | Blocker for launch |
| 7 | ~~Scoring trigger never tested end-to-end~~ — verified via SQL harness: all 3 tiers + penalty-decided draw award correct points; `league_members`/`profiles` aggregates consistent. RLS/deadline still unverified in-app | Partially resolved |

---

## Bet model — LOCKED: exact-score tiered (Kicktipp/Toto style)

Predict the scoreline of each match. Points awarded by accuracy tier:

| Outcome | Points | Source field |
|---------|--------|--------------|
| Exact scoreline | 3 | `points_for_exact_score` |
| Correct result, wrong score | 1 | `points_for_correct` |
| Wrong | 0 | `points_for_wrong` |

Winner (home/draw/away) is derived from the predicted score, so the existing `predicted_winner` column still feeds tendency scoring.

**Schema is ~80% ready** — no migration to add columns:
- `bets.predicted_home_score` / `predicted_away_score` columns exist (currently unused)
- `leagues.points_for_exact_score` defaults to `3` (never awarded yet)
- `matches.home_score` / `away_score` are stored

**Gap to close:** rewrite `evaluate_match_bets` ([00008](supabase/migrations/00008_create_scoring_functions.sql)) for tiered logic, and add two score inputs to [BetForm.tsx](src/components/match/BetForm.tsx) (deriving `predicted_winner` from them).

---

## Data ingestion architecture

**Never call the WC2026 API from the browser** — Free tier is 100 req/day total (not per user) and the key must stay secret. Pull-based REST, no push.

```
WC2026 API ──poll──► Supabase Edge Function (cron) ──upsert──► matches/nations tables
                                                                      │
                                                       existing Realtime + scoring trigger
                                                                      ▼
                                                              clients (no API key)
```

- **Edge Function** (Deno) holds `WC2026_API_KEY` in Supabase secrets, polls on a schedule (pg_cron / Supabase scheduled function), upserts fixtures + scores.
- Setting `status = 'completed'` (mapped from API `finished`) fires the existing `auto_evaluate_bets` trigger → scoring + leaderboards update automatically.
- Clients keep using existing Supabase Realtime on `matches` — no API key client-side.

**Field mapping (API → schema):**

| API | Schema |
|-----|--------|
| `round`: `round_of_32`/`round_of_16`/`quarter`/`semi`/`final` | `stage`: `round-of-32`/`round-of-16`/`quarter-final`/`semi-final`/`final` |
| `status`: `finished` | `status`: `completed` |
| `home_team`/`away_team` (names) | `home_team_id`/`away_team_id` (UUID lookup by name/code) |
| `kickoff_utc` | `date` (+ default `betting_deadline`) |
| `stadium` | `venue` |

**Request budget (Free = 100/day):** with server-side polling there is exactly **one** poller regardless of user count. Idle ~ every 10 min; match-day live ~ every 60s. A single match day at 60s for ~6h burns ~360 calls — **exceeds Free.** Either widen the live interval or upgrade.

**Recommendation:** buy **Pro Unlimited ($4.99 one-time, valid through 2026-07-19)** before launch. Removes the suspension risk entirely. Until then, develop against `/test/match`.

---

## Roadmap

### Phase 0 — Decide & clean (now)
- [x] Lock bet model → exact-score tiered
- [x] Commit pending migration edits; gitignore `.temp/` + `combined_setup.sql` (`.docx` removed)
- [x] Add `WC2026_API_KEY` to Supabase secrets (NOT client `.env`)
- [ ] Replace default README

### Phase 1 — Real data via WC2026 API (BLOCKER, do first)
- [x] Nation profile schema (migration 00010): editorial fields + `external_id` + `nation_heroes`
- [x] Write `sync-teams` Edge Function: fetch `/teams`, upsert 48 nations by `external_id` *(written, not deployed/run)*
- [x] Migration 00011: TBD placeholder nation, drop `different_teams`, add `matches.external_id`
- [x] Write `sync-matches` Edge Function *(written, not deployed/run)*
- [x] Deploy both functions (`--no-verify-jwt`); run once → **48 real nations + 104 fixtures live in DB** (72/16/8/4/2/1/1 by stage)
- [ ] Migration 00011: add one "To Be Decided" placeholder nation (code `TBD`); DROP `matches.different_teams` CHECK (knockout starts TBD vs TBD → same id)
- [ ] Write `sync-matches`: fetch `/matches`, upsert fixtures by `external_id`; undecided slot (API `home_team_id` null) → TBD nation; real `home_team_id` → map via `nations.external_id`
- [ ] **Daily sync (after kickoff):** API adds knockout matches over time AND resolves teams as groups finish — not just a one-time seed
- [ ] Betting opens per-match once both real teams known (skip bets on TBD slots)

> API notes: undecided teams come back as `null` (no "Winner Group A" label). `round_of_32` currently empty — knockout fixtures appear incrementally. Match objects carry `home_team_id` (= `external_id`), inline code/flag, `stadium`, `home_pen`/`away_pen`.
- [ ] Verify flags/codes render; backfill flags not in API (`flag_url` is null from API)
- [x] Daily cron (00012): `pg_cron` + `pg_net` invoke `sync-matches` at 05:00 UTC — handles scores, knockout resolution, new fixtures
- [ ] Add tighter in-match polling schedule near kickoff (needs Pro API key for Free-tier 100/day headroom)

### Phase 2 — Exact-score scoring (LOCKED model)
- [x] Rewrite `evaluate_match_bets` with tiered points (exact 3 / result 1 / wrong 0) — [00016](supabase/migrations/00016_tiered_exact_score_scoring.sql); regulation score drives the exact tier, `winner` (incl. penalties) drives the result tier
- [x] Add home/away score inputs to BetForm; derive `predicted_winner`; update `usePlaceBet` — plus inline auto-saving score steppers on the matches list (default 0-0, +/- per team)
- [x] Test scoring end-to-end via SQL harness: all 3 tiers + penalty-decided draw → trigger awards correct tier → `league_members`/`profiles` aggregates update
- [ ] Verify RLS (can't see others' bets before deadline) and deadline enforcement in-app

### Phase 3 — Hosting & deploy (BLOCKER for launch)
- [ ] Pick host (recommend **Vercel** or **Netlify** for static Vite + env vars)
- [ ] Wire Supabase env vars in host
- [ ] Confirm Supabase Auth redirect URLs / allowed origins for prod domain
- [ ] Deploy Edge Function + cron schedule
- [ ] Smoke-test signup → join league → bet on live URL

### Phase 4 — Polish (before/after launch)
- [ ] Decide WC2026 API tier (upgrade to Pro Unlimited recommended)
- [ ] Tune live poll interval vs request budget
- [ ] Mobile responsiveness pass
- [ ] Empty/loading/error states everywhere
- [ ] Live score updates visible via Realtime (fed by ingestion)
- [ ] Leaderboard tiebreakers clear

### Phase 2b — Nations browse + profiles (non-blocking, parallel)
Schema ready (migration 00010). Content is editorial — fill manually over time.
- [x] DB schema: nation profile fields + `nation_heroes`
- [x] `/nations` index page — scrollable grid of all 48 (flag, name, group) + nav item
- [x] Enrich [NationDetailPage](src/features/nations/NationDetailPage.tsx): bio, nickname, home stadium, WC appearances/titles, FIFA rank
- [x] Heroes (Legends) section from `nation_heroes`
- [x] Flag emoji set for all 48 + `flag_url` image support with emoji fallback
- [x] Seed editorial content (bio, stadium, WC stats) + 1–2 heroes each ([seed_nation_profiles.sql](supabase/seed_nation_profiles.sql))
- [ ] Add hero photos (`photo_url`) + flag images (`flag_url`) — optional polish

### Phase 5 — Post-launch / nice-to-have
- [ ] Code-splitting to shrink bundle
- [ ] Knockout-stage fixtures as they resolve
- [ ] Bracket/champion picks (separate mechanic)
- [ ] Push/email notifications

---

## Critical path to launch

```
API ingestion fn (P1) ──► Exact-score scoring (P2) ──► Deploy + cron (P3) ──► friends bet
         │
   (dev against /test/match — no waiting for June 11)
```

P1 and P3 are hard blockers. Given ~2 weeks, prioritize: **ingestion → scoring → deploy.** Buy Pro Unlimited key ($4.99) before live matches to avoid Free-tier suspension.
