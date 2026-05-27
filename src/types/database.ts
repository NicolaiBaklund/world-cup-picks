// This file will be replaced by auto-generated types from Supabase CLI:
// npx supabase gen types typescript --local > src/types/database.ts
//
// For now, we define the shape manually to unblock development.
// Using permissive Insert/Update types since we don't have generated types.

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
          // Sync + editorial profile (migration 00010)
          external_id: number | null
          flag_url: string | null
          nickname: string | null
          bio: string | null
          fifa_ranking: number | null
          home_stadium: string | null
          home_stadium_city: string | null
          wc_appearances: number
          wc_titles: number
          best_finish: string | null
          first_wc_year: number | null
          created_at: string
          updated_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
        Relationships: []
      }
      nation_heroes: {
        Row: {
          id: string
          nation_id: string
          name: string
          position: string | null
          years_active: string | null
          description: string | null
          photo_url: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
        Relationships: []
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
          created_at: string
          updated_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
        Relationships: []
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
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
        Relationships: []
      }
      league_members: {
        Row: {
          league_id: string
          user_id: string
          role: 'admin' | 'member'
          league_points: number
          league_correct_bets: number
          league_total_bets: number
          joined_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
        Relationships: []
      }
      matches: {
        Row: {
          id: string
          home_team_id: string
          away_team_id: string
          match_number: number | null
          date: string
          stage: string
          group_name: string | null
          venue: string | null
          city: string | null
          status: string
          home_score: number | null
          away_score: number | null
          home_penalties: number | null
          away_penalties: number | null
          winner: string | null
          betting_deadline: string | null
          created_at: string
          updated_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
        Relationships: []
      }
      bets: {
        Row: {
          id: string
          user_id: string
          match_id: string
          league_id: string
          predicted_winner: string
          predicted_home_score: number | null
          predicted_away_score: number | null
          is_correct: boolean | null
          points_earned: number
          evaluated_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
        Relationships: []
      }
      match_events: {
        Row: {
          id: string
          match_id: string
          event_type: string
          minute: number
          player_name: string | null
          team_id: string
          details: Record<string, unknown> | null
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
        Relationships: []
      }
    }
    Views: {
      matches_with_teams: {
        Row: {
          id: string
          home_team_id: string
          away_team_id: string
          match_number: number | null
          date: string
          stage: string
          group_name: string | null
          venue: string | null
          city: string | null
          status: string
          home_score: number | null
          away_score: number | null
          home_penalties: number | null
          away_penalties: number | null
          winner: string | null
          betting_deadline: string | null
          created_at: string
          updated_at: string
          home_team_name: string
          home_team_code: string
          home_team_flag: string
          away_team_name: string
          away_team_code: string
          away_team_flag: string
        }
        Relationships: []
      }
      user_bets_detailed: {
        Row: {
          bet_id: string
          user_id: string
          league_id: string
          predicted_winner: string
          is_correct: boolean | null
          points_earned: number
          bet_created_at: string
          evaluated_at: string | null
          match_id: string
          match_date: string
          stage: string
          match_status: string
          home_score: number | null
          away_score: number | null
          actual_winner: string | null
          betting_deadline: string | null
          home_team_name: string
          home_team_code: string
          home_team_flag: string
          away_team_name: string
          away_team_code: string
          away_team_flag: string
          league_name: string
        }
        Relationships: []
      }
      group_standings: {
        Row: {
          group_name: string
          id: string
          name: string
          code: string
          flag: string
          played: number
          won: number
          drawn: number
          lost: number
          goals_for: number
          goals_against: number
          goal_difference: number
          points: number
          position: number
        }
        Relationships: []
      }
      upcoming_matches: {
        Row: Database['public']['Views']['matches_with_teams']['Row']
        Relationships: []
      }
      live_matches: {
        Row: Database['public']['Views']['matches_with_teams']['Row']
        Relationships: []
      }
      recent_results: {
        Row: Database['public']['Views']['matches_with_teams']['Row']
        Relationships: []
      }
    }
    Functions: {
      get_league_leaderboard: {
        Args: { league_uuid: string }
        Returns: {
          rank: number
          user_id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          points: number
          correct_bets: number
          total_bets: number
          accuracy: number
        }[]
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Convenience type aliases
export type Nation = Database['public']['Tables']['nations']['Row']
export type NationHero = Database['public']['Tables']['nation_heroes']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type League = Database['public']['Tables']['leagues']['Row']
export type LeagueMember = Database['public']['Tables']['league_members']['Row']
export type Match = Database['public']['Tables']['matches']['Row']
export type Bet = Database['public']['Tables']['bets']['Row']
export type MatchEvent = Database['public']['Tables']['match_events']['Row']
export type MatchWithTeams = Database['public']['Views']['matches_with_teams']['Row']
export type UserBetDetailed = Database['public']['Views']['user_bets_detailed']['Row']
export type GroupStanding = Database['public']['Views']['group_standings']['Row']
export type LeaderboardEntry = Database['public']['Functions']['get_league_leaderboard']['Returns'][number]
