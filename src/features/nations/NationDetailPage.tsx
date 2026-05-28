import { useParams, useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MatchList } from '@/components/match/MatchList'
import { useNation, useNationHeroes } from '@/hooks/useNations'
import { useAllMatches } from '@/hooks/useMatches'
import type { MatchWithTeams } from '@/types'

export function NationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: nation, isLoading } = useNation(id!)
  const { data: heroes } = useNationHeroes(id!)
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
      <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      {/* Nation header */}
      <Card>
        <CardContent className="p-6 text-center">
          {nation.flag_url ? (
            <img
              src={nation.flag_url}
              alt={`${nation.name} flag`}
              className="mx-auto mb-4 h-16 w-24 rounded object-cover shadow"
            />
          ) : (
            <div className="text-6xl mb-4">{nation.flag}</div>
          )}
          <h1 className="text-3xl font-bold">{nation.name}</h1>
          {nation.nickname && (
            <p className="text-muted-foreground italic mt-1">{nation.nickname}</p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            {nation.group_name && <Badge variant="secondary">Group {nation.group_name}</Badge>}
            {nation.confederation && <Badge variant="secondary">{nation.confederation}</Badge>}
            {nation.fifa_ranking && <Badge variant="secondary">FIFA #{nation.fifa_ranking}</Badge>}
          </div>
        </CardContent>
      </Card>

      {/* About */}
      {(nation.bio || nation.home_stadium || nation.wc_appearances > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {nation.bio && <p className="text-sm leading-relaxed">{nation.bio}</p>}
            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              {nation.wc_appearances > 0 && (
                <Stat label="WC Appearances" value={nation.wc_appearances} />
              )}
              <Stat label="WC Titles" value={nation.wc_titles} />
              {nation.best_finish && <Stat label="Best Finish" value={nation.best_finish} />}
              {nation.home_stadium && (
                <Stat
                  label="Home Stadium"
                  value={nation.home_stadium}
                  sub={nation.home_stadium_city ?? undefined}
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Heroes */}
      {(heroes?.length ?? 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Legends</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {heroes!.map((hero) => (
              <div key={hero.id} className="flex gap-3">
                {hero.photo_url && (
                  <img
                    src={hero.photo_url}
                    alt={hero.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">
                    {hero.name}
                    {hero.position && (
                      <span className="text-muted-foreground font-normal"> · {hero.position}</span>
                    )}
                    {hero.years_active && (
                      <span className="text-muted-foreground font-normal"> · {hero.years_active}</span>
                    )}
                  </p>
                  {hero.description && (
                    <p className="text-sm text-muted-foreground">{hero.description}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

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

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div>
      <p className="text-base font-semibold leading-tight">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
