import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BetPrediction } from '@/types'

/** Derive the predicted winner from a predicted scoreline. */
export function winnerFromScore(home: number, away: number): BetPrediction {
  if (home > away) return 'home'
  if (away > home) return 'away'
  return 'draw'
}

interface ScoreStepperProps {
  label: string
  flag?: string
  value: number
  onChange: (next: number) => void
  disabled?: boolean
  max?: number
}

export function ScoreStepper({ label, flag, value, onChange, disabled, max = 99 }: ScoreStepperProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {flag && <span className="text-base">{flag}</span>}
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={disabled || value <= 0}
          onClick={() => onChange(Math.max(0, value - 1))}
          aria-label={`Decrease ${label} score`}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center text-2xl font-bold tabular-nums">{value}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={disabled || value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`Increase ${label} score`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
