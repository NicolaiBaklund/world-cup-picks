import { useParams, Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MatchList } from '@/components/match/MatchList'
import { useNation } from '@/hooks/useNations'
import { useAllMatches } from '@/hooks/useMatches'
import type { MatchWithTeams } from '@/types'

export function NationDetailPage() {
  const { id } = useParams()
  const { data: nation, isLoading } = useNation(id!)
  const { data: allMatches, isLoading: matchesLoading } = useAllMatches()

  // Filter matches for this nation
  const nationMatches = allMatches?.filter(
    (m: MatchWithTeams) => m.home_team_id === id || m.away_team_id === id
  )
  const upcomingMatches = nationMatches?.filter((m: MatchWithTeams) => m.status === 'scheduled')
  const completedMatches = nationMatches?.filter((m: MatchWithTeams) => m.status === 'completed')

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (!nation) {
    return <p className="text-muted-foreground">Nation not found</p>
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Link to="/groups">
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to groups
        </Button>
      </Link>

      {/* Nation header */}
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-6xl mb-4">{nation.flag}</div>
          <h1 className="text-3xl font-bold">{nation.name}</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="outline">{nation.code}</Badge>
            {nation.group_name && <Badge variant="secondary">Group {nation.group_name}</Badge>}
            {nation.confederation && <Badge variant="secondary">{nation.confederation}</Badge>}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tournament Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{nation.played}</p>
              <p className="text-xs text-muted-foreground">Played</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{nation.won}</p>
              <p className="text-xs text-muted-foreground">Won</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{nation.drawn}</p>
              <p className="text-xs text-muted-foreground">Drawn</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">{nation.lost}</p>
              <p className="text-xs text-muted-foreground">Lost</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center mt-4 pt-4 border-t">
            <div>
              <p className="text-xl font-bold">{nation.goals_for}</p>
              <p className="text-xs text-muted-foreground">Goals For</p>
            </div>
            <div>
              <p className="text-xl font-bold">{nation.goals_against}</p>
              <p className="text-xs text-muted-foreground">Goals Against</p>
            </div>
            <div>
              <p className="text-xl font-bold">{nation.points}</p>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming matches */}
      {(upcomingMatches?.length ?? 0) > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Upcoming Matches</h2>
          <MatchList matches={upcomingMatches} isLoading={matchesLoading} />
        </section>
      )}

      {/* Completed matches */}
      {(completedMatches?.length ?? 0) > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Results</h2>
          <MatchList matches={completedMatches} isLoading={matchesLoading} />
        </section>
      )}
    </div>
  )
}
