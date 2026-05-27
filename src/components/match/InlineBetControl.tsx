import { useEffect, useRef, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { usePlaceBet, useMyBetsForMatch } from '@/hooks/useBets'
import { ScoreStepper, winnerFromScore } from './ScoreStepper'
import { toast } from 'sonner'
import type { MatchWithTeams } from '@/types'

interface InlineBetControlProps {
  match: MatchWithTeams
  leagueId: string
}

const SAVE_DELAY = 600 // debounce stepper clicks before auto-saving

/**
 * Compact bet control rendered directly on the matches list — default 0-0 with
 * +/- steppers per team, no need to open the match. The bet auto-saves shortly
 * after each change (no submit button); the winner is derived from the scoreline.
 */
export function InlineBetControl({ match, leagueId }: InlineBetControlProps) {
  const { data: myBets } = useMyBetsForMatch(match.id)
  const placeBet = usePlaceBet()
  const existingBet = myBets?.find((b) => b.league_id === leagueId)

  const [homeScore, setHomeScore] = useState(existingBet?.predicted_home_score ?? 0)
  const [awayScore, setAwayScore] = useState(existingBet?.predicted_away_score ?? 0)
  const [justSaved, setJustSaved] = useState(false)

  // Last scoreline known to be persisted; null until we've seen the server state.
  const saved = useRef<{ h: number; a: number } | null>(null)
  const touched = useRef(false)

  // Seed from the existing bet once it loads (without clobbering in-flight edits).
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
  const isBettable = match.status === 'scheduled' && !isPastDeadline

  // Debounced auto-save: fire only after the user has interacted and the scoreline
  // differs from what's persisted.
  useEffect(() => {
    if (!isBettable || !touched.current) return
    if (saved.current && saved.current.h === homeScore && saved.current.a === awayScore) return

    const t = setTimeout(async () => {
      try {
        await placeBet.mutateAsync({
          matchId: match.id,
          leagueId,
          predictedWinner: winnerFromScore(homeScore, awayScore),
          predictedHomeScore: homeScore,
          predictedAwayScore: awayScore,
        })
        saved.current = { h: homeScore, a: awayScore }
        setJustSaved(true)
        setTimeout(() => setJustSaved(false), 1500)
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to save bet'
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
    <div className="flex items-center justify-center gap-4 border-t pt-3">
      <ScoreStepper
        label={match.home_team_code}
        flag={match.home_team_flag}
        value={homeScore}
        onChange={onHome}
      />
      <span className="text-xl font-bold text-muted-foreground">–</span>
      <ScoreStepper
        label={match.away_team_code}
        flag={match.away_team_flag}
        value={awayScore}
        onChange={onAway}
      />
      <span className="flex h-5 w-12 items-center justify-center text-xs text-muted-foreground">
        {placeBet.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : justSaved ? (
          <span className="flex items-center gap-1 text-green-600"><Check className="h-3.5 w-3.5" /> Saved</span>
        ) : null}
      </span>
    </div>
  )
}
