import { useEffect, useRef, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { usePlaceBet, useMyBetsForMatch } from '@/hooks/useBets'
import { useMyLeagues } from '@/hooks/useLeagues'
import { ScoreStepper, winnerFromScore } from './ScoreStepper'
import { toast } from 'sonner'
import type { MatchWithTeams } from '@/types'

interface InlineBetControlProps {
  match: MatchWithTeams
}

const SAVE_DELAY = 600 // debounce stepper clicks before auto-saving

/**
 * Compact bet control rendered directly on the matches list — default 0-0 with
 * +/- steppers per team. Auto-saves the same prediction to every league the
 * user is in (no per-league betting in this app).
 */
export function InlineBetControl({ match }: InlineBetControlProps) {
  const { data: leagues } = useMyLeagues()
  const { data: myBets } = useMyBetsForMatch(match.id)
  const placeBet = usePlaceBet()

  // Bets are mirrored across leagues, so the first row is the source of truth.
  const existingBet = myBets?.[0]

  const [homeScore, setHomeScore] = useState(existingBet?.predicted_home_score ?? 0)
  const [awayScore, setAwayScore] = useState(existingBet?.predicted_away_score ?? 0)
  const [justSaved, setJustSaved] = useState(false)

  const saved = useRef<{ h: number; a: number } | null>(null)
  const touched = useRef(false)

  const seeded = useRef(false)
  useEffect(() => {
    if (!seeded.current && existingBet) {
      setHomeScore(existingBet.predicted_home_score ?? 0)
      setAwayScore(existingBet.predicted_away_score ?? 0)
      saved.current = {
        h: existingBet.predicted_home_score ?? 0,
        a: existingBet.predicted_away_score ?? 0,
      }
      seeded.current = true
    }
  }, [existingBet])

  const deadline = match.betting_deadline ? new Date(match.betting_deadline) : null
  const isPastDeadline = deadline ? new Date() > deadline : false
  const isBettable = match.status === 'scheduled' && !isPastDeadline && !!leagues?.length

  useEffect(() => {
    if (!isBettable || !touched.current || !leagues?.length) return
    if (saved.current && saved.current.h === homeScore && saved.current.a === awayScore) return

    const t = setTimeout(async () => {
      try {
        await placeBet.mutateAsync({
          matchId: match.id,
          leagueIds: leagues.map((l) => l.id),
          predictedWinner: winnerFromScore(homeScore, awayScore),
          predictedHomeScore: homeScore,
          predictedAwayScore: awayScore,
        })
        saved.current = { h: homeScore, a: awayScore }
        setJustSaved(true)
        setTimeout(() => setJustSaved(false), 1500)
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to save prediction'
        toast.error(msg)
      }
    }, SAVE_DELAY)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeScore, awayScore, isBettable])

  if (!isBettable) {
    if (!existingBet) return null
    return (
      <div className="flex items-center justify-between border-t pt-2 text-sm">
        <span className="text-muted-foreground">Your pick</span>
        <span className="font-medium tabular-nums">
          {existingBet.predicted_home_score ?? '–'}–{existingBet.predicted_away_score ?? '–'}
          {existingBet.is_correct !== null && (
            <span className={existingBet.is_correct ? 'text-green-600 ml-2' : 'text-red-500 ml-2'}>
              {existingBet.is_correct ? `+${existingBet.points_earned}` : '0'}
            </span>
          )}
        </span>
      </div>
    )
  }

  const onHome = (v: number) => { touched.current = true; setHomeScore(v) }
  const onAway = (v: number) => { touched.current = true; setAwayScore(v) }

  return (
    <div className="relative border-t pt-3">
      <div className="flex items-center justify-center gap-4">
        <ScoreStepper
          label={match.home_team_name}
          flag={match.home_team_flag}
          flagUrl={match.home_team_flag_url}
          value={homeScore}
          onChange={onHome}
        />
        <span className="text-xl font-bold text-muted-foreground">–</span>
        <ScoreStepper
          label={match.away_team_name}
          flag={match.away_team_flag}
          flagUrl={match.away_team_flag_url}
          value={awayScore}
          onChange={onAway}
        />
      </div>
      <span className="absolute right-0 top-3 flex h-full items-center text-xs text-muted-foreground">
        {placeBet.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : justSaved ? (
          <span className="flex items-center gap-1 text-green-600"><Check className="h-3.5 w-3.5" /> Saved</span>
        ) : null}
      </span>
    </div>
  )
}
