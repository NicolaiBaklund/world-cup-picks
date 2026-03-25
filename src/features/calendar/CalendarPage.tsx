import { useState, useMemo } from 'react'
import { format, addDays, startOfDay, endOfDay, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { MatchCard } from '@/components/match/MatchCard'
import { useMatchesByDate } from '@/hooks/useMatches'
import type { MatchWithTeams } from '@/types'

const DAYS_TO_SHOW = 7

export function CalendarPage() {
  const [startDate, setStartDate] = useState(() => startOfDay(new Date()))

  const endDate = endOfDay(addDays(startDate, DAYS_TO_SHOW - 1))

  const { data: matches, isLoading } = useMatchesByDate(
    startDate.toISOString(),
    endDate.toISOString()
  )

  // Group matches by date
  const matchesByDate = useMemo(() => {
    if (!matches) return new Map<string, MatchWithTeams[]>()

    const grouped = new Map<string, MatchWithTeams[]>()
    for (const match of matches) {
      const dateKey = format(new Date(match.date), 'yyyy-MM-dd')
      const existing = grouped.get(dateKey) ?? []
      existing.push(match)
      grouped.set(dateKey, existing)
    }
    return grouped
  }, [matches])

  // Generate all days in range
  const days = Array.from({ length: DAYS_TO_SHOW }, (_, i) => addDays(startDate, i))

  const goBack = () => setStartDate((d) => subDays(d, DAYS_TO_SHOW))
  const goForward = () => setStartDate((d) => addDays(d, DAYS_TO_SHOW))
  const goToday = () => setStartDate(startOfDay(new Date()))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground mt-1">Match schedule by date</p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={goBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {format(startDate, 'MMM d')} — {format(endDate, 'MMM d, yyyy')}
          </span>
          <Button variant="ghost" size="sm" onClick={goToday}>
            Today
          </Button>
        </div>
        <Button variant="outline" size="icon" onClick={goForward}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Timeline */}
      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {days.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd')
            const dayMatches = matchesByDate.get(dateKey)
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')

            return (
              <div key={dateKey}>
                {/* Date header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`text-sm font-semibold ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                    {format(day, 'EEEE, MMM d')}
                  </div>
                  {isToday && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                </div>

                {/* Matches for this day */}
                {dayMatches?.length ? (
                  <div className="space-y-2">
                    {dayMatches.map((match) => (
                      <MatchCard key={match.id} match={match} compact />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-2 pl-4 border-l-2 border-muted">
                    No matches
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
