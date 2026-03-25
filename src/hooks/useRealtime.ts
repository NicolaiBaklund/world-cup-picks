import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Match } from '@/types'

export function useMatchRealtime() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('matches-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
        },
        (payload) => {
          const updated = payload.new as Match

          // Invalidate all match-related queries so they refetch
          queryClient.invalidateQueries({ queryKey: ['matches'] })

          // Also update the specific match cache if it exists
          queryClient.setQueryData(['matches', updated.id], (old: Match | undefined) => {
            if (!old) return old
            return { ...old, ...updated }
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'match_events',
        },
        () => {
          // Invalidate match queries to pick up new events
          queryClient.invalidateQueries({ queryKey: ['matches'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])
}
