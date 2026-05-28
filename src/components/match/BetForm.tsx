import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePlaceBet, useMyBetsForMatch } from '@/hooks/useBets'
import { useMyLeagues } from '@/hooks/useLeagues'
import { ScoreStepper, winnerFromScore } from './ScoreStepper'
import { toast } from 'sonner'
import type { MatchWithTeams } from '@/types'

interface BetFormProps {
  match: MatchWithTeams
}

/**
 * Match-detail bet form: one predicted scoreline that is saved across every
 * league the user is in (you don't bet per league in this app).
 */
export function BetForm({ match }: BetFormProps) {
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const { data: leagues } = useMyLeagues()
  const { data: myBets } = useMyBetsForMatch(match.id)
  const placeBet = usePlaceBet()

  // Existing bets are mirrored across leagues, so use the first as the source of truth.
  const existingBet = myBets?.[0]

  // Seed from the existing bet once it loads.
  const seeded = useRef(false)
  useEffect(() => {
    if (!seeded.current && existingBet) {
      setHomeScore(existingBet.predicted_home_score ?? 0)
      setAwayScore(existingBet.predicted_away_score ?? 0)
      seeded.current = true
    }
  }, [existingBet])

  const deadline = match.betting_deadline ? new Date(match.betting_deadline) : null
  const isPastDeadline = deadline ? new Date() > deadline : false

  if (isPastDeadline) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Pick</CardTitle>
        </CardHeader>
        <CardContent>
          {existingBet ? (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Predicted</span>
              <span className="font-medium tabular-nums">
                {existingBet.predicted_home_score ?? '–'}–{existingBet.predicted_away_score ?? '–'}
                {existingBet.is_correct !== null && (
                  <span className={existingBet.is_correct ? 'text-green-600 ml-2' : 'text-red-500 ml-2'}>
                    {existingBet.is_correct ? `+${existingBet.points_earned}` : '0'}
                  </span>
                )}
              </span>
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
    try {
      await placeBet.mutateAsync({
        matchId: match.id,
        leagueIds: leagues.map((l) => l.id),
        predictedWinner: winnerFromScore(homeScore, awayScore),
        predictedHomeScore: homeScore,
        predictedAwayScore: awayScore,
      })
      toast.success('Prediction saved!')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to save prediction'
      toast.error(msg)
    }
  }

  const dirty =
    !existingBet ||
    existingBet.predicted_home_score !== homeScore ||
    existingBet.predicted_away_score !== awayScore

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Set Predicted Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {existingBet && (
          <p className="text-sm text-muted-foreground text-center">
            Current pick:{' '}
            <span className="font-medium tabular-nums">
              {existingBet.predicted_home_score ?? '–'}–{existingBet.predicted_away_score ?? '–'}
            </span>
          </p>
        )}

        <div className="flex items-center justify-center gap-6">
          <ScoreStepper
            label={match.home_team_name}
            flag={match.home_team_flag}
            flagUrl={match.home_team_flag_url}
            value={homeScore}
            onChange={setHomeScore}
            disabled={placeBet.isPending}
          />
          <span className="text-2xl font-bold text-muted-foreground">–</span>
          <ScoreStepper
            label={match.away_team_name}
            flag={match.away_team_flag}
            flagUrl={match.away_team_flag_url}
            value={awayScore}
            onChange={setAwayScore}
            disabled={placeBet.isPending}
          />
        </div>

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={!dirty || placeBet.isPending}
        >
          {placeBet.isPending ? 'Saving...' : existingBet ? 'Update Prediction' : 'Save Prediction'}
        </Button>
      </CardContent>
    </Card>
  )
}
