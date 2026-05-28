import { Link } from 'react-router'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NationFlag } from '@/components/nation/NationFlag'
import { InlineBetControl } from './InlineBetControl'
import type { MatchWithTeams } from '@/types'

interface MatchCardProps {
  match: MatchWithTeams
  compact?: boolean
  /** When true, renders an inline bet stepper below the match. */
  enableBetting?: boolean
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    scheduled: 'outline',
    live: 'destructive',
    completed: 'secondary',
    postponed: 'default',
    cancelled: 'default',
  }

  return (
    <Badge variant={variants[status] ?? 'default'} className={status === 'live' ? 'animate-pulse' : ''}>
      {status === 'live' ? 'LIVE' : status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export function MatchCard({ match, compact, enableBetting }: MatchCardProps) {
  const matchDate = new Date(match.date)

  return (
    <Card className="transition-colors">
      <CardContent className={compact ? 'p-3' : 'p-4'}>
        <Link to={`/matches/${match.id}`} className="block hover:opacity-80 transition-opacity">
          {/* Header: stage + status */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground uppercase">
              {match.stage === 'group' ? `Group ${match.group_name}` : match.stage.replace(/-/g, ' ')}
            </span>
            <StatusBadge status={match.status} />
          </div>

          {/* Teams and score */}
          <div className="flex items-center justify-between gap-2">
            {/* Home team */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <NationFlag
                url={match.home_team_flag_url}
                emoji={match.home_team_flag}
                name={match.home_team_name}
                size={compact ? 'md' : 'lg'}
              />
              <span className={`truncate ${compact ? 'text-sm' : 'text-base'} font-medium`}>
                {match.home_team_name}
              </span>
            </div>

            {/* Score or time */}
            <div className="text-center px-3">
              {match.status === 'completed' || match.status === 'live' ? (
                <div className="font-bold text-lg tabular-nums">
                  {match.home_score} - {match.away_score}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {format(matchDate, 'HH:mm')}
                </div>
              )}
            </div>

            {/* Away team */}
            <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
              <span className={`truncate ${compact ? 'text-sm' : 'text-base'} font-medium text-right`}>
                {match.away_team_name}
              </span>
              <NationFlag
                url={match.away_team_flag_url}
                emoji={match.away_team_flag}
                name={match.away_team_name}
                size={compact ? 'md' : 'lg'}
              />
            </div>
          </div>

          {/* Footer: date and venue */}
          {!compact && (
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{format(matchDate, 'MMM d, yyyy')}</span>
              {match.venue && <span>{match.venue}, {match.city}</span>}
            </div>
          )}
        </Link>

        {/* Inline betting (matches page) */}
        {enableBetting && (
          <div className="mt-3">
            <InlineBetControl match={match} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
