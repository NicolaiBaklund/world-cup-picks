import { MatchCard } from './MatchCard'
import { Skeleton } from '@/components/ui/skeleton'
import type { MatchWithTeams } from '@/types'

interface MatchListProps {
  matches: MatchWithTeams[] | undefined
  isLoading: boolean
  emptyMessage?: string
  compact?: boolean
  /** When set, each card shows an inline bet stepper for this league. */
  betLeagueId?: string
}

export function MatchList({ matches, isLoading, emptyMessage = 'No matches found', compact, betLeagueId }: MatchListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (!matches?.length) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} compact={compact} betLeagueId={betLeagueId} />
      ))}
    </div>
  )
}
