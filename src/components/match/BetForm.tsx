import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePlaceBet, useMyBetsForMatch } from '@/hooks/useBets'
import { useMyLeagues } from '@/hooks/useLeagues'
import { toast } from 'sonner'
import type { MatchWithTeams, BetPrediction } from '@/types'

interface BetFormProps {
  match: MatchWithTeams
}

export function BetForm({ match }: BetFormProps) {
  const [selectedLeague, setSelectedLeague] = useState<string>('')
  const [prediction, setPrediction] = useState<BetPrediction | ''>('')
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
                  <span className="font-medium">
                    {bet.predicted_winner === 'home' && match.home_team_name}
                    {bet.predicted_winner === 'away' && match.away_team_name}
                    {bet.predicted_winner === 'draw' && 'Draw'}
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
    if (!selectedLeague || !prediction) return

    try {
      await placeBet.mutateAsync({
        matchId: match.id,
        leagueId: selectedLeague,
        predictedWinner: prediction,
      })
      toast.success('Bet placed!')
      setPrediction('')
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
        <Select value={selectedLeague} onValueChange={setSelectedLeague}>
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
                Current bet: <span className="font-medium">
                  {existingBet.predicted_winner === 'home' && match.home_team_name}
                  {existingBet.predicted_winner === 'away' && match.away_team_name}
                  {existingBet.predicted_winner === 'draw' && 'Draw'}
                </span>
              </p>
            )}

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={prediction === 'home' ? 'default' : 'outline'}
                onClick={() => setPrediction('home')}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <span className="text-lg">{match.home_team_flag}</span>
                <span className="text-xs">{match.home_team_code}</span>
              </Button>
              <Button
                variant={prediction === 'draw' ? 'default' : 'outline'}
                onClick={() => setPrediction('draw')}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <span className="text-lg">-</span>
                <span className="text-xs">Draw</span>
              </Button>
              <Button
                variant={prediction === 'away' ? 'default' : 'outline'}
                onClick={() => setPrediction('away')}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <span className="text-lg">{match.away_team_flag}</span>
                <span className="text-xs">{match.away_team_code}</span>
              </Button>
            </div>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={!prediction || placeBet.isPending}
            >
              {placeBet.isPending ? 'Placing...' : existingBet ? 'Update Bet' : 'Place Bet'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
