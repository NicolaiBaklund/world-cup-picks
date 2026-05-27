import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePlaceBet, useMyBetsForMatch } from '@/hooks/useBets'
import { useMyLeagues } from '@/hooks/useLeagues'
import { ScoreStepper, winnerFromScore } from './ScoreStepper'
import { toast } from 'sonner'
import type { MatchWithTeams } from '@/types'

interface BetFormProps {
  match: MatchWithTeams
}

export function BetForm({ match }: BetFormProps) {
  const [selectedLeague, setSelectedLeague] = useState<string>('')
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const { data: leagues } = useMyLeagues()
  const { data: myBets } = useMyBetsForMatch(match.id)
  const placeBet = usePlaceBet()

  const deadline = match.betting_deadline ? new Date(match.betting_deadline) : null
  const isPastDeadline = deadline ? new Date() > deadline : false

  if (isPastDeadline) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Bets</CardTitle>
        </CardHeader>
        <CardContent>
          {myBets?.length ? (
            <div className="space-y-2">
              {myBets.map((bet) => (
                <div key={bet.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{bet.leagues.name}</span>
                  <span className="font-medium tabular-nums">
                    {bet.predicted_home_score ?? '–'}–{bet.predicted_away_score ?? '–'}
                    {bet.is_correct !== null && (
                      <span className={bet.is_correct ? 'text-green-600 ml-2' : 'text-red-500 ml-2'}>
                        {bet.is_correct ? `+${bet.points_earned}` : '0'}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Betting deadline has passed</p>
          )}
        </CardContent>
      </Card>
    )
  }

  if (!leagues?.length) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            Join a league to start betting on matches.
          </p>
        </CardContent>
      </Card>
    )
  }

  const handleSubmit = async () => {
    if (!selectedLeague) return

    try {
      await placeBet.mutateAsync({
        matchId: match.id,
        leagueId: selectedLeague,
        predictedWinner: winnerFromScore(homeScore, awayScore),
        predictedHomeScore: homeScore,
        predictedAwayScore: awayScore,
      })
      toast.success('Bet placed!')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to place bet'
      toast.error(msg)
    }
  }

  // Find existing bet for selected league
  const existingBet = myBets?.find((b) => b.league_id === selectedLeague)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Place Your Bet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedLeague} onValueChange={(v) => v != null && setSelectedLeague(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select league" />
          </SelectTrigger>
          <SelectContent>
            {leagues.map((league) => (
              <SelectItem key={league.id} value={league.id}>{league.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedLeague && (
          <>
            {existingBet && (
              <p className="text-sm text-muted-foreground">
                Current bet:{' '}
                <span className="font-medium tabular-nums">
                  {existingBet.predicted_home_score ?? '–'}–{existingBet.predicted_away_score ?? '–'}
                </span>
              </p>
            )}

            <div className="flex items-center justify-center gap-6">
              <ScoreStepper
                label={match.home_team_code}
                flag={match.home_team_flag}
                value={homeScore}
                onChange={setHomeScore}
                disabled={placeBet.isPending}
              />
              <span className="text-2xl font-bold text-muted-foreground">–</span>
              <ScoreStepper
                label={match.away_team_code}
                flag={match.away_team_flag}
                value={awayScore}
                onChange={setAwayScore}
                disabled={placeBet.isPending}
              />
            </div>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={placeBet.isPending}
            >
              {placeBet.isPending ? 'Placing...' : existingBet ? 'Update Bet' : 'Place Bet'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
