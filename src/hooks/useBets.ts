import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import type { Bet, BetPrediction, UserBetDetailed } from '@/types'

const BETS_KEY = 'bets'

export function useMyBetsForMatch(matchId: string) {
  const { user } = useAuth()

  return useQuery({
    queryKey: [BETS_KEY, 'match', matchId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bets')
        .select('*, leagues(name)')
        .eq('match_id', matchId)
        .eq('user_id', user!.id)
      if (error) throw error
      return data as unknown as (Bet & { leagues: { name: string } })[]
    },
    enabled: !!user && !!matchId,
  })
}

export function usePlaceBet() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({
      matchId,
      leagueIds,
      predictedWinner,
      predictedHomeScore,
      predictedAwayScore,
    }: {
      matchId: string
      /** One bet row is upserted per league — bets aren't placed per league in the UI. */
      leagueIds: string[]
      predictedWinner: BetPrediction
      predictedHomeScore: number
      predictedAwayScore: number
    }) => {
      if (leagueIds.length === 0) throw new Error('You need to join a league before betting')

      const rows = leagueIds.map((league_id) => ({
        user_id: user!.id,
        match_id: matchId,
        league_id,
        predicted_winner: predictedWinner,
        predicted_home_score: predictedHomeScore,
        predicted_away_score: predictedAwayScore,
      }))

      const { data, error } = await supabase
        .from('bets')
        .upsert(rows, { onConflict: 'user_id,match_id,league_id' })
        .select()
      if (error) throw error
      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [BETS_KEY, 'match', variables.matchId] })
      queryClient.invalidateQueries({ queryKey: [BETS_KEY, 'all'] })
    },
  })
}

export function useMyBetsInLeague(leagueId: string) {
  const { user } = useAuth()

  return useQuery({
    queryKey: [BETS_KEY, 'league', leagueId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_bets_detailed')
        .select('*')
        .eq('league_id', leagueId)
        .eq('user_id', user!.id)
        .order('match_date', { ascending: false })
      if (error) throw error
      return data as UserBetDetailed[]
    },
    enabled: !!user && !!leagueId,
  })
}

export function useAllMyBets() {
  const { user } = useAuth()

  return useQuery({
    queryKey: [BETS_KEY, 'all', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_bets_detailed')
        .select('*')
        .eq('user_id', user!.id)
        .order('match_date', { ascending: false })
      if (error) throw error
      return data as UserBetDetailed[]
    },
    enabled: !!user,
  })
}
