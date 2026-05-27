# WC2026 API — Integration Reference

> Unofficial FIFA World Cup 2026 data API. Not affiliated with FIFA.
> Tournament dates: **June 11 – July 19, 2026**
> Source: https://www.wc2026api.com | Docs: https://api.wc2026api.com/docs

---

## Overview

| Property | Value |
|---|---|
| Base URL | `https://api.wc2026api.com` |
| Auth | Bearer token (`Authorization: Bearer <key>`) |
| Format | JSON |
| Coverage | All 104 matches · 48 teams · 12 groups · 16 venues |
| Hosts | USA, Canada, Mexico |
| Latency | Sub-100ms (Supabase PostgreSQL / Railway) |
| Live scores | Yes — updates in real time as matches progress |

---

## Authentication

All endpoints require a Bearer token in the `Authorization` header. The API key you receive **is** the bearer token — there is no separate value. Store it in a single environment variable and prepend `Bearer ` when making requests.

```bash
# .env
WC2026_API_KEY=wc2026_xxxxxxxxxxxxxxxx
```

```http
Authorization: Bearer wc2026_xxxxxxxxxxxxxxxx
```

### Plans

| Plan | Requests/day | Cost |
|---|---|---|
| Free | 100 | $0 forever |
| Pro (500) | 500 | $4.99 one-time |
| Pro (3,000) | 3,000 | $4.99 one-time |
| Pro (Unlimited) | Unlimited | $4.99 one-time |

> **Note:** Keys that exceed their daily limit are **automatically suspended**. The Free tier has no available spots as of May 2026 — contact `keys@wc2026api.com` for a Pro key.
> All Pro plans are valid through **July 19, 2026** (end of tournament).

---

## Endpoints

### GET /matches

Returns fixture list with live scores. Supports filtering.

**Query parameters:**

| Parameter | Type | Description |
|---|---|---|
| `team` | string | Filter by team (e.g. `NED`, `BRA`, `Netherlands`) |
| `group` | string | Filter by group letter (e.g. `A`, `F`) |
| `round` | string | Filter by round (`group`, `round_of_32`, `round_of_16`, `quarter`, `semi`, `final`) |
| `status` | string | Filter by match status (`scheduled`, `live`, `finished`) |

**Example request:**

```bash
curl "https://api.wc2026api.com/matches?team=NED" \
  -H "Authorization: Bearer wc2026_your_key_here"
```

**Example response (single match object):**

```json
{
  "id": 11,
  "match_number": 11,
  "round": "group",
  "group_name": "F",
  "home_team": "Netherlands",
  "away_team": "Japan",
  "stadium": "AT&T Stadium",
  "kickoff_utc": "2026-06-14T21:00:00.000Z",
  "status": "scheduled"
}
```

**Response fields:**

| Field | Type | Description |
|---|---|---|
| `id` | integer | Internal match ID |
| `match_number` | integer | Official match number (1–104) |
| `round` | string | Tournament stage |
| `group_name` | string | Group letter (group stage only) |
| `home_team` | string | Home team name |
| `away_team` | string | Away team name |
| `stadium` | string | Venue name |
| `kickoff_utc` | ISO 8601 string | Kick-off time in UTC |
| `status` | string | `scheduled` / `live` / `finished` |

> During live matches, expect additional score fields (e.g. `home_score`, `away_score`, `minute`). Confirm exact field names against the interactive docs at https://api.wc2026api.com/docs.

---

### GET /standings (Group Standings)

Returns live W/D/L, GF, GA, GD, and points for all 12 groups. Updates automatically as matches complete.

**Query parameters:**

| Parameter | Type | Description |
|---|---|---|
| `group` | string | Filter to a specific group (e.g. `A`) |

**Example request:**

```bash
curl "https://api.wc2026api.com/standings?group=F" \
  -H "Authorization: Bearer wc2026_your_key_here"
```

**Expected response fields per team row:**

| Field | Description |
|---|---|
| `group` | Group letter |
| `team` | Team name |
| `played` | Matches played |
| `won` | Wins |
| `drawn` | Draws |
| `lost` | Losses |
| `goals_for` (GF) | Goals scored |
| `goals_against` (GA) | Goals conceded |
| `goal_difference` (GD) | GF minus GA |
| `points` | Total points |

---

### GET /teams

Returns all 48 national teams with codes and group assignments.

**Example request:**

```bash
curl "https://api.wc2026api.com/teams" \
  -H "Authorization: Bearer wc2026_your_key_here"
```

---

### GET /stadiums

Returns all 16 venues across USA, Canada, and Mexico.

**Example request:**

```bash
curl "https://api.wc2026api.com/stadiums" \
  -H "Authorization: Bearer wc2026_your_key_here"
```

---

### GET /test/match

**Development/testing only.** Returns a fictional Brazil vs Argentina match that cycles through all match phases in real time — no waiting for June 11. Use this to build and test your live-score integration before the tournament starts.

**Example request:**

```bash
curl "https://api.wc2026api.com/test/match" \
  -H "Authorization: Bearer wc2026_your_key_here"
```

The response mirrors the live match schema (including score updates and status transitions) so your integration code can be fully validated against it.

---

## Live Score Polling

The API is **REST (pull-based)** — there is no WebSocket or webhook push. To track live scores, poll `/matches?status=live` on an interval.

**Recommended polling strategy:**

```
Before tournament / no live matches: poll every 60–120s (or skip)
Match in progress:                   poll every 30–60s
Around kickoff (±15 min):            poll every 15–30s
```

Avoid hammering the API — with 100 req/day on Free or 500 on lower Pro tiers, budget your calls carefully during match days.

**Example: fetch all live matches**

```bash
curl "https://api.wc2026api.com/matches?status=live" \
  -H "Authorization: Bearer wc2026_your_key_here"
```

---

## Tournament Structure

| Stage | Matches | Notes |
|---|---|---|
| Group stage | 72 | 12 groups × 3 matches each; top 2 + 8 best 3rd-place qualify |
| Round of 32 | 32 | New for 2026 (48-team format) |
| Round of 16 | 16 | |
| Quarter-finals | 8 | |
| Semi-finals | 4 | |
| Third-place play-off | 1 | |
| Final | 1 | |
| **Total** | **104** | |

---

## Error Handling

| HTTP Status | Meaning |
|---|---|
| `200` | Success |
| `401` | Missing or invalid API key |
| `403` | Key suspended (daily limit exceeded) |
| `429` | Rate limit hit |
| `500` | Server error |

---

## Quick Reference: cURL Examples

```bash
# All matches
curl "https://api.wc2026api.com/matches" \
  -H "Authorization: Bearer wc2026_your_key_here"

# Matches for a specific team
curl "https://api.wc2026api.com/matches?team=BRA" \
  -H "Authorization: Bearer wc2026_your_key_here"

# All currently live matches
curl "https://api.wc2026api.com/matches?status=live" \
  -H "Authorization: Bearer wc2026_your_key_here"

# All group stage matches in group A
curl "https://api.wc2026api.com/matches?round=group&group=A" \
  -H "Authorization: Bearer wc2026_your_key_here"

# All group standings
curl "https://api.wc2026api.com/standings" \
  -H "Authorization: Bearer wc2026_your_key_here"

# Test live match (development)
curl "https://api.wc2026api.com/test/match" \
  -H "Authorization: Bearer wc2026_your_key_here"
```

---

## Notes for Agent Integration

- **Always store the API key in an environment variable** (e.g. `WC2026_API_KEY`), never hardcoded.
- The `kickoff_utc` field is ISO 8601 UTC — convert to local time as needed.
- Standings auto-update when matches complete; no manual refresh needed beyond polling `/standings`.
- The `/test/match` endpoint is the best way to develop live-score UI before the tournament begins.
- Confirm exact response schema for live/finished matches via the interactive docs: https://api.wc2026api.com/docs
- This is an **unofficial fan project** — uptime is best-effort; build in retries and graceful fallbacks.

---

*Last updated: May 2026. Cross-reference with https://api.wc2026api.com/docs for the canonical schema.*
