import { Link } from 'react-router'
import { format } from 'date-fns'
import { Clock, Trophy, Bell } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useUpcomingMatches } from '@/hooks/useMatches'
import { useMyLeagues } from '@/hooks/useLeagues'

export function NotificationsPage() {
  const { data: upcoming, isLoading: matchesLoading } = useUpcomingMatches()
  const { data: leagues, isLoading: leaguesLoading } = useMyLeagues()

  const isLoading = matchesLoading || leaguesLoading

  // Generate notifications from upcoming matches (deadline reminders)
  const deadlineReminders = upcoming
    ?.filter((m) => {
      const deadline = m.betting_deadline ? new Date(m.betting_deadline) : null
      if (!deadline) return false
      const now = new Date()
      const hoursUntil = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60)
      return hoursUntil > 0 && hoursUntil < 24
    })
    .map((m) => ({
      id: `deadline-${m.id}`,
      type: 'deadline' as const,
      title: 'Betting deadline approaching',
      message: `${m.home_team_name} vs ${m.away_team_name} — bet before ${format(new Date(m.betting_deadline!), 'HH:mm')}`,
      link: `/matches/${m.id}`,
      time: m.betting_deadline!,
    })) ?? []

  // Upcoming match reminders
  const matchReminders = upcoming
    ?.slice(0, 5)
    .map((m) => ({
      id: `match-${m.id}`,
      type: 'match' as const,
      title: 'Upcoming match',
      message: `${m.home_team_name} vs ${m.away_team_name}`,
      link: `/matches/${m.id}`,
      time: m.date,
    })) ?? []

  // League activity (placeholder — would be richer with a notifications table)
  const leagueNotifs = leagues
    ?.slice(0, 3)
    .map((l) => ({
      id: `league-${l.id}`,
      type: 'league' as const,
      title: l.name,
      message: 'Check the leaderboard for updates',
      link: `/leagues/${l.id}`,
      time: l.created_at,
    })) ?? []

  const allNotifications = [...deadlineReminders, ...matchReminders, ...leagueNotifs]

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground mt-1">Match reminders and league activity</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : allNotifications.length ? (
        <div className="space-y-2">
          {allNotifications.map((notif) => (
            <Link key={notif.id} to={notif.link}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="mt-0.5">
                    {notif.type === 'deadline' && <Clock className="h-5 w-5 text-orange-500" />}
                    {notif.type === 'match' && <Trophy className="h-5 w-5 text-blue-500" />}
                    {notif.type === 'league' && <Bell className="h-5 w-5 text-purple-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{notif.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{notif.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {format(new Date(notif.time), 'MMM d')}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notifications yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
