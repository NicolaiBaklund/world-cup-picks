import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Nation, NationHero, GroupStanding } from '@/types'

const NATIONS_KEY = 'nations'

export function useAllNations() {
  return useQuery({
    queryKey: [NATIONS_KEY, 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nations')
        .select('*')
        .order('group_name')
        .order('name')
      if (error) throw error
      return data as Nation[]
    },
  })
}

export function useGroupStandings() {
  return useQuery({
    queryKey: [NATIONS_KEY, 'standings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_standings')
        .select('*')
      if (error) throw error
      return data as GroupStanding[]
    },
  })
}

export function useNation(id: string) {
  return useQuery({
    queryKey: [NATIONS_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nations')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Nation
    },
    enabled: !!id,
  })
}

export function useNationHeroes(nationId: string) {
  return useQuery({
    queryKey: [NATIONS_KEY, nationId, 'heroes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nation_heroes')
        .select('*')
        .eq('nation_id', nationId)
        .order('sort_order')
      if (error) throw error
      return data as NationHero[]
    },
    enabled: !!nationId,
  })
}
