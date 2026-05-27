import { Link } from 'react-router'
import { Trophy, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MatchList } from '@/components/match/MatchList'
import { useLiveMatches, useUpcomingMatches, useRecentResults } from '@/hooks/useMatches'
import { useAuth } from '@/hooks/useAuth'

export function DashboardPage() {
  const { user } = useAuth()
  const liveMatches = useLiveMatches()
  const upcomingMatches = useUpcomingMatches()
  const recentResults = useRecentResults()

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          World Cup 2026
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/matches">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
            <CardContent className="flex items-center gap-3 p-4">
              <Trophy className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Matches</p>
                <p className="text-sm text-muted-foreground">View all matches</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/leagues">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
            <CardContent className="flex items-center gap-3 p-4">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Leagues</p>
                <p className="text-sm text-muted-foreground">Join or create</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Live matches */}
      {(liveMatches.data?.length ?? 0) > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Live Now
            </h2>
          </div>
          <MatchList matches={liveMatches.data} isLoading={liveMatches.isLoading} />
        </section>
      )}

      {/* Upcoming matches */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upcoming Matches</h2>
          <Link to="/matches">
            <Button variant="ghost" size="sm" className="gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <MatchList
          matches={upcomingMatches.data?.slice(0, 5)}
          isLoading={upcomingMatches.isLoading}
          emptyMessage="No upcoming matches in the next 7 days"
        />
      </section>

      {/* Recent results */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Results</h2>
          <Link to="/matches">
            <Button variant="ghost" size="sm" className="gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <MatchList
          matches={recentResults.data?.slice(0, 5)}
          isLoading={recentResults.isLoading}
          emptyMessage="No recent results"
        />
      </section>
    </div>
  )
}
