# Supabase Database Schema

This folder contains the database schema for the World Cup Picks application.

## Structure

```
supabase/
├── migrations/           # Sequential database migrations
│   ├── 00001_create_nations.sql
│   ├── 00002_create_profiles.sql
│   ├── 00003_create_leagues.sql
│   ├── 00004_create_league_members.sql
│   ├── 00005_create_matches.sql
│   ├── 00006_create_bets.sql
│   ├── 00007_create_scoring_functions.sql
│   ├── 00008_create_views.sql
│   └── 00009_future_players_template.sql  # Ready for future expansion
├── seed.sql              # Initial data (nations, sample matches)
└── README.md             # This file
```

## Database Tables

| Table | Description |
|-------|-------------|
| `nations` | World Cup participating countries |
| `profiles` | User profiles (extends Supabase Auth) |
| `leagues` | Betting leagues/groups |
| `league_members` | Junction table: users ↔ leagues |
| `matches` | World Cup matches |
| `bets` | User predictions for matches |

## How to Apply

### Option 1: Supabase Dashboard (Easy)

1. Go to your Supabase project → **SQL Editor**
2. Run each migration file in order (00001, 00002, etc.)
3. Finally, run `seed.sql` to populate initial data

### Option 2: Supabase CLI (Professional)

```bash
# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
npx supabase db push

# Run seed data
npx supabase db reset  # This runs migrations + seed
```

## Key Features

### Row Level Security (RLS)
All tables have RLS policies:
- Users can only modify their own data
- Bets are hidden until the betting deadline passes
- League members can only see their leagues

### Automatic Triggers
- **Profiles**: Auto-created when user signs up
- **League codes**: Auto-generated 6-character codes
- **Bet evaluation**: Auto-runs when match results are set
- **Winner calculation**: Auto-determined from scores

### Useful Views
- `matches_with_teams` - Matches with team names joined
- `user_bets_detailed` - Bets with full match/team info
- `group_standings` - Live group stage table
- `upcoming_matches` - Next 7 days of matches
- `live_matches` - Currently playing matches
- `recent_results` - Last 7 days of results

### Scoring Functions
- `evaluate_match_bets(match_id)` - Score all bets for a match
- `get_league_leaderboard(league_id)` - Get ranked standings

## Extending the Schema

### Adding Players
Uncomment the code in `00009_future_players_template.sql` to add:
- `players` table
- `player_bets` table (golden boot predictions, etc.)
- `match_events` table (goals, cards, etc.)

### Adding More Features
Create new migration files with incrementing numbers:
```
00010_create_notifications.sql
00011_create_achievements.sql
00012_add_exact_score_betting.sql
```

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐
│   nations   │       │  profiles   │
│─────────────│       │─────────────│
│ id (PK)     │       │ id (PK/FK)  │──→ auth.users
│ name        │       │ username    │
│ code        │       │ stats...    │
│ group       │       └──────┬──────┘
│ stats...    │              │
└──────┬──────┘              │
       │                     │
       │              ┌──────┴──────┐
       │              │             │
       ▼              ▼             ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   matches   │  │   leagues   │  │league_members│
│─────────────│  │─────────────│  │─────────────│
│ id (PK)     │  │ id (PK)     │  │ league_id(FK)│
│ home_team_id│  │ name        │  │ user_id (FK)│
│ away_team_id│  │ creator_id  │  │ role        │
│ date        │  │ code        │  │ stats...    │
│ result...   │  │ settings... │  └─────────────┘
└──────┬──────┘  └──────┬──────┘
       │                │
       └───────┬────────┘
               │
               ▼
        ┌─────────────┐
        │    bets     │
        │─────────────│
        │ id (PK)     │
        │ user_id(FK) │
        │ match_id(FK)│
        │ league_id(FK)│
        │ prediction  │
        │ result...   │
        └─────────────┘
```

## Common Queries

### Get upcoming matches with teams
```sql
SELECT * FROM upcoming_matches;
```

### Get league leaderboard
```sql
SELECT * FROM get_league_leaderboard('your-league-uuid');
```

### Get user's bets in a league
```sql
SELECT * FROM user_bets_detailed 
WHERE user_id = 'user-uuid' AND league_id = 'league-uuid';
```

### Get group standings
```sql
SELECT * FROM group_standings WHERE "group" = 'A';
```
