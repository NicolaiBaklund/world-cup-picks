import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MatchList } from '@/components/match/MatchList'
import { useAllMatches } from '@/hooks/useMatches'
import { useMyLeagues } from '@/hooks/useLeagues'

const STAGES = [
  { value: 'all', label: 'All Stages' },
  { value: 'group', label: 'Group Stage' },
  { value: 'round-of-32', label: 'Round of 32' },
  { value: 'round-of-16', label: 'Round of 16' },
  { value: 'quarter-final', label: 'Quarter Final' },
  { value: 'semi-final', label: 'Semi Final' },
  { value: 'third-place', label: 'Third Place' },
  { value: 'final', label: 'Final' },
]

const GROUPS = [
  { value: 'all', label: 'All Groups' },
  ...Array.from({ length: 12 }, (_, i) => {
    const letter = String.fromCharCode(65 + i)
    return { value: letter, label: `Group ${letter}` }
  }),
]

const STATUSES = [
  { value: 'all', label: 'All Status' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'live', label: 'Live' },
  { value: 'completed', label: 'Completed' },
  { value: 'postponed', label: 'Postponed' },
]

export function MatchesPage() {
  const [stage, setStage] = useState('all')
  const [group, setGroup] = useState('all')
  const [status, setStatus] = useState('all')

  const { data: leagues } = useMyLeagues()
  const hasLeagues = !!leagues?.length

  const { data: matches, isLoading } = useAllMatches({
    stage: stage !== 'all' ? stage : undefined,
    group: group !== 'all' ? group : undefined,
    status: status !== 'all' ? status : undefined,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Matches</h1>
        <p className="text-muted-foreground mt-1">All World Cup 2026 matches</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={stage} onValueChange={(v) => v != null && setStage(v)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STAGES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {stage === 'group' && (
          <Select value={group} onValueChange={(v) => v != null && setGroup(v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GROUPS.map((g) => (
                <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={status} onValueChange={(v) => v != null && setStatus(v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!hasLeagues && (
        <p className="text-sm text-muted-foreground">
          Join a league to place predictions directly from this list.
        </p>
      )}

      {/* Match list */}
      <MatchList
        matches={matches}
        isLoading={isLoading}
        emptyMessage="No matches found with the selected filters"
        enableBetting={hasLeagues}
      />
    </div>
  )
}
