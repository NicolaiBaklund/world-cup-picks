import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import type { Profile } from '@/types'

const PROFILE_KEY = 'profiles'

export function useMyProfile() {
  const { user } = useAuth()

  return useQuery({
    queryKey: [PROFILE_KEY, 'me', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single()
      if (error) throw error
      return data as Profile
    },
    enabled: !!user,
  })
}

export function useUserProfile(id: string) {
  return useQuery({
    queryKey: [PROFILE_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Profile
    },
    enabled: !!id,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (updates: { display_name?: string; avatar_url?: string; favorite_nation_id?: string | null }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user!.id)
        .select()
        .single()
      if (error) throw error
      return data as Profile
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_KEY, 'me'] })
    },
  })
}

export function useTopPredictors(limit = 10) {
  return useQuery({
    queryKey: [PROFILE_KEY, 'top', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .gt('total_bets', 0)
        .order('total_points', { ascending: false })
        .limit(limit)
      if (error) throw error
      return data as Profile[]
    },
  })
}
