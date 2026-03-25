import { useParams, Link } from 'react-router'
import { format } from 'date-fns'
import { ArrowLeft, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { BetForm } from '@/components/match/BetForm'
import { useMatch } from '@/hooks/useMatches'

export function MatchDetailPage() {
  const { id } = useParams()
  const { data: match, isLoading } = useMatch(id!)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!match) {
    return <p className="text-muted-foreground">Match not found</p>
  }

  const matchDate = new Date(match.date)

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Back button */}
      <Link to="/matches">
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to matches
        </Button>
      </Link>

      {/* Match header */}
      <Card>
        <CardContent className="p-6">
          {/* Stage */}
          <div className="text-center mb-4">
            <Badge variant="outline" className="text-xs uppercase">
              {match.stage === 'group' ? `Group ${match.group_name}` : match.stage.replace(/-/g, ' ')}
            </Badge>
            {match.status === 'live' && (
              <Badge variant="destructive" className="ml-2 animate-pulse">LIVE</Badge>
            )}
          </div>

          {/* Teams and score */}
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <Link to={`/nations/${match.home_team_id}`} className="hover:opacity-80">
                <div className="text-4xl mb-2">{match.home_team_flag}</div>
                <div className="font-semibold">{match.home_team_name}</div>
                <div className="text-sm text-muted-foreground">{match.home_team_code}</div>
              </Link>
            </div>

            <div className="px-6 text-center">
              {match.status === 'completed' || match.status === 'live' ? (
                <>
                  <div className="text-4xl font-bold tabular-nums">
                    {match.home_score} - {match.away_score}
                  </div>
                  {match.home_penalties != null && (
                    <div className="text-sm text-muted-foreground mt-1">
                      ({match.home_penalties} - {match.away_penalties} pen.)
                    </div>
                  )}
                  {match.status === 'completed' && (
                    <div className="text-sm text-muted-foreground mt-1">Full Time</div>
                  )}
                </>
              ) : (
                <div className="text-2xl font-medium text-muted-foreground">vs</div>
              )}
            </div>

            <div className="flex-1 text-center">
              <Link to={`/nations/${match.away_team_id}`} className="hover:opacity-80">
                <div className="text-4xl mb-2">{match.away_team_flag}</div>
                <div className="font-semibold">{match.away_team_name}</div>
                <div className="text-sm text-muted-foreground">{match.away_team_code}</div>
              </Link>
            </div>
          </div>

          {/* Match info */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {format(matchDate, 'MMM d, yyyy · HH:mm')}
            </div>
            {match.venue && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {match.venue}, {match.city}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Betting section */}
      <BetForm match={match} />
    </div>
  )
}
