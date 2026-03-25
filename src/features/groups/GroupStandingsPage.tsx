import { useMemo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { GroupTable } from '@/components/nation/GroupTable'
import { useGroupStandings } from '@/hooks/useNations'
import type { GroupStanding } from '@/types'

export function GroupStandingsPage() {
  const { data: standings, isLoading } = useGroupStandings()

  // Group standings by group_name
  const groups = useMemo(() => {
    if (!standings) return new Map<string, GroupStanding[]>()
    const map = new Map<string, GroupStanding[]>()
    for (const s of standings) {
      const key = s.group_name
      const existing = map.get(key) ?? []
      existing.push(s)
      map.set(key, existing)
    }
    return map
  }, [standings])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Group Standings</h1>
        <p className="text-muted-foreground mt-1">World Cup 2026 group stage tables</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from(groups.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([groupName, groupStandings]) => (
              <GroupTable key={groupName} groupName={groupName} standings={groupStandings} />
            ))}
        </div>
      )}
    </div>
  )
}
