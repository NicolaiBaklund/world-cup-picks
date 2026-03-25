// This file will be replaced by auto-generated types from Supabase CLI:
// npx supabase gen types typescript --local > src/types/database.ts
//
// For now, we define the shape manually to unblock development.

export type Database = {
  public: {
    Tables: {
      nations: {
        Row: {
          id: string
          name: string
          code: string
          flag: string
          group_name: string
          confederation: string
          played: number
          won: number
          drawn: number
          lost: number
          goals_for: number
          goals_against: number
          points: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['nations']['Row'], 'id' | 'created_at' | 'updated_at' | 'played' | 'won' | 'drawn' | 'lost' | 'goals_for' | 'goals_against' | 'points'>
        Update: Partial<Database['public']['Tables']['nations']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          total_bets: number
          correct_bets: number
          total_points: number
          notification_preferences: Record<string, boolean> | null
          created_at: string
          updated_at: string
        }
        Insert: Pick<Database['public']['Tables']['profiles']['Row'], 'id' | 'username'>
        Update: Partial<Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at'>>
      }
      leagues: {
        Row: {
          id: string
          name: string
          description: string | null
          creator_id: string
          code: string
          is_public: boolean
          max_members: number
          allow_late_join: boolean
          points_for_correct: number
          points_for_wrong: number
          points_for_exact_score: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['leagues']['Row'], 'id' | 'code' | 'created_at' | 'updated_at' | 'points_for_correct' | 'points_for_wrong' | 'points_for_exact_score'>
        Update: Partial<Omit<Database['public']['Tables']['leagues']['Row'], 'id' | 'code' | 'creator_id' | 'created_at'>>
      }
      league_members: {
        Row: {
          id: string
          league_id: string
          user_id: string
          role: 'admin' | 'member'
          league_points: number
          league_correct_bets: number
          league_total_bets: number
          joined_at: string
        }
        Insert: Pick<Database['public']['Tables']['league_members']['Row'], 'league_id' | 'user_id'>
        Update: Partial<Omit<Database['public']['Tables']['league_members']['Row'], 'id' | 'league_id' | 'user_id' | 'joined_at'>>
      }
      matches: {
        Row: {
          id: string
          home_team_id: string
          away_team_id: string
          date: string
          stage: 'group' | 'round-of-32' | 'round-of-16' | 'quarter-final' | 'semi-final' | 'third-place' | 'final'
          group_name: string | null
          venue: string | null
          city: string | null
          status: 'scheduled' | 'live' | 'completed' | 'postponed' | 'cancelled'
          home_score: number | null
          away_score: number | null
          home_penalties: number | null
          away_penalties: number | null
          winner: 'home' | 'away' | 'draw' | null
          betting_deadline: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['matches']['Row'], 'id' | 'created_at' | 'updated_at' | 'winner' | 'home_score' | 'away_score' | 'home_penalties' | 'away_penalties'>
        Update: Partial<Database['public']['Tables']['matches']['Row']>
      }
      bets: {
        Row: {
          id: string
          user_id: string
          match_id: string
          league_id: string
          predicted_winner: 'home' | 'away' | 'draw'
          predicted_home_score: number | null
          predicted_away_score: number | null
          is_correct: boolean | null
          points_earned: number
          evaluated_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Pick<Database['public']['Tables']['bets']['Row'], 'match_id' | 'league_id' | 'predicted_winner'> & { predicted_home_score?: number | null; predicted_away_score?: number | null }
        Update: Partial<Pick<Database['public']['Tables']['bets']['Row'], 'predicted_winner' | 'predicted_home_score' | 'predicted_away_score'>>
      }
      match_events: {
        Row: {
          id: string
          match_id: string
          event_type: 'goal' | 'own_goal' | 'penalty_goal' | 'penalty_miss' | 'yellow_card' | 'red_card' | 'substitution'
          minute: number
          player_name: string | null
          team_id: string
          details: Record<string, unknown> | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['match_events']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['match_events']['Insert']>
      }
    }
    Views: {
      matches_with_teams: {
        Row: Database['public']['Tables']['matches']['Row'] & {
          home_team_name: string
          home_team_code: string
          home_team_flag: string
          away_team_name: string
          away_team_code: string
          away_team_flag: string
        }
      }
      group_standings: {
        Row: Database['public']['Tables']['nations']['Row'] & {
          goal_difference: number
          rank: number
        }
      }
    }
    Functions: {
      get_league_leaderboard: {
        Args: { league_id_input: string }
        Returns: {
          user_id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          total_points: number
          correct_bets: number
          total_bets: number
          accuracy: number
          rank: number
        }[]
      }
    }
    Enums: Record<string, never>
  }
}

// Convenience type aliases
export type Nation = Database['public']['Tables']['nations']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type League = Database['public']['Tables']['leagues']['Row']
export type LeagueMember = Database['public']['Tables']['league_members']['Row']
export type Match = Database['public']['Tables']['matches']['Row']
export type Bet = Database['public']['Tables']['bets']['Row']
export type MatchEvent = Database['public']['Tables']['match_events']['Row']
export type MatchWithTeams = Database['public']['Views']['matches_with_teams']['Row']
export type GroupStanding = Database['public']['Views']['group_standings']['Row']
export type LeaderboardEntry = Database['public']['Functions']['get_league_leaderboard']['Returns'][number]
