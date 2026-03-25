import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { MatchWithTeams } from '@/types'

const MATCHES_KEY = 'matches'

export function useUpcomingMatches() {
  return useQuery({
    queryKey: [MATCHES_KEY, 'upcoming'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('upcoming_matches')
        .select('*')
      if (error) throw error
      return data as MatchWithTeams[]
    },
  })
}

export function useLiveMatches() {
  return useQuery({
    queryKey: [MATCHES_KEY, 'live'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('live_matches')
        .select('*')
      if (error) throw error
      return data as MatchWithTeams[]
    },
    refetchInterval: 30_000, // poll every 30s for live matches
  })
}

export function useRecentResults() {
  return useQuery({
    queryKey: [MATCHES_KEY, 'recent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recent_results')
        .select('*')
      if (error) throw error
      return data as MatchWithTeams[]
    },
  })
}

export function useAllMatches(filters?: {
  stage?: string
  group?: string
  status?: string
}) {
  return useQuery({
    queryKey: [MATCHES_KEY, 'all', filters],
    queryFn: async () => {
      let query = supabase
        .from('matches_with_teams')
        .select('*')
        .order('date', { ascending: true })

      if (filters?.stage) {
        query = query.eq('stage', filters.stage)
      }
      if (filters?.group) {
        query = query.eq('group_name', filters.group)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      const { data, error } = await query
      if (error) throw error
      return data as MatchWithTeams[]
    },
  })
}

export function useMatch(id: string) {
  return useQuery({
    queryKey: [MATCHES_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches_with_teams')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as MatchWithTeams
    },
    enabled: !!id,
  })
}

export function useMatchesByDate(startDate: string, endDate: string) {
  return useQuery({
    queryKey: [MATCHES_KEY, 'calendar', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches_with_teams')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })
      if (error) throw error
      return data as MatchWithTeams[]
    },
    enabled: !!startDate && !!endDate,
  })
}
