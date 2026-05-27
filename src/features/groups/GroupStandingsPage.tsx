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

      {/* Column legend */}
      <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span><strong className="text-foreground">P</strong> Played</span>
          <span><strong className="text-foreground">W</strong> Won</span>
          <span><strong className="text-foreground">D</strong> Drawn</span>
          <span><strong className="text-foreground">L</strong> Lost</span>
          <span><strong className="text-foreground">GF</strong> Goals For</span>
          <span><strong className="text-foreground">GA</strong> Goals Against</span>
          <span><strong className="text-foreground">GD</strong> Goal Difference</span>
          <span><strong className="text-foreground">Pts</strong> Points (3 win / 1 draw)</span>
        </div>
        <p className="mt-2">Highlighted rows are the top two (advance directly). The 8 best third-placed teams also reach the Round of 32.</p>
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
