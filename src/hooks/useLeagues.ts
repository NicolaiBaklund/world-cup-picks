import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import type { League, LeaderboardEntry } from '@/types'

const LEAGUES_KEY = 'leagues'

export function useMyLeagues() {
  const { user } = useAuth()

  return useQuery({
    queryKey: [LEAGUES_KEY, 'my', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('league_members')
        .select('league_id, role, leagues(*)')
        .eq('user_id', user!.id)
      if (error) throw error
      const rows = data as unknown as { league_id: string; role: string; leagues: League }[]
      return rows.map((m) => ({
        ...m.leagues,
        role: m.role,
      }))
    },
    enabled: !!user,
  })
}

export function usePublicLeagues() {
  return useQuery({
    queryKey: [LEAGUES_KEY, 'public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as League[]
    },
  })
}

export function useLeague(id: string) {
  return useQuery({
    queryKey: [LEAGUES_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as League
    },
    enabled: !!id,
  })
}

export function useLeagueLeaderboard(leagueId: string) {
  return useQuery({
    queryKey: [LEAGUES_KEY, leagueId, 'leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_league_leaderboard', { league_uuid: leagueId })
      if (error) throw error
      return data as LeaderboardEntry[]
    },
    enabled: !!leagueId,
  })
}

export function useCreateLeague() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (league: {
      name: string
      description?: string
      is_public: boolean
      max_members?: number
    }) => {
      const { data, error } = await supabase
        .from('leagues')
        .insert({ ...league, creator_id: user!.id })
        .select()
        .single()
      if (error) throw error
      return data as League
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEAGUES_KEY] })
    },
  })
}

export function useJoinLeague() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (code: string) => {
      // Find league by code
      const { data: league, error: findError } = await supabase
        .from('leagues')
        .select('id')
        .eq('code', code.toUpperCase())
        .single()
      if (findError) throw new Error('League not found with that code')

      // Join
      const { error: joinError } = await supabase
        .from('league_members')
        .insert({ league_id: league.id, user_id: user!.id })
      if (joinError) throw joinError

      return league.id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEAGUES_KEY] })
    },
  })
}

export function useUpdateLeague(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: {
      name?: string
      description?: string | null
      is_public?: boolean
      max_members?: number
    }) => {
      const { data, error } = await supabase
        .from('leagues')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as League
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEAGUES_KEY] })
    },
  })
}

export function useDeleteLeague() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('leagues')
        .delete()
        .eq('id', id)
      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEAGUES_KEY] })
    },
  })
}

export function useLeaveLeague() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (leagueId: string) => {
      const { error } = await supabase
        .from('league_members')
        .delete()
        .eq('league_id', leagueId)
        .eq('user_id', user!.id)
      if (error) throw error
      return leagueId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEAGUES_KEY] })
    },
  })
}
