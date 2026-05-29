import { useParams, Link } from 'react-router'
import { ArrowLeft, Copy, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Leaderboard } from '@/components/league/Leaderboard'
import { useLeague, useLeagueLeaderboard } from '@/hooks/useLeagues'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

export function LeagueDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { data: league, isLoading } = useLeague(id!)
  const { data: leaderboard, isLoading: lbLoading } = useLeagueLeaderboard(id!)

  const copyCode = () => {
    if (league) {
      navigator.clipboard.writeText(league.code)
      toast.success('Invite code copied!')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!league) {
    return <p className="text-muted-foreground">League not found</p>
  }

  const isCreator = user?.id === league.creator_id

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Link to="/leagues">
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to leagues
        </Button>
      </Link>

      {/* League header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{league.name}</CardTitle>
              {league.description && (
                <p className="text-muted-foreground mt-1">{league.description}</p>
              )}
            </div>
            {isCreator && (
              <Link to={`/leagues/${id}/settings`}>
                <Button variant="ghost" size="icon" aria-label="League settings">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Invite code:</span>
              <code className="font-mono bg-muted px-2 py-1 rounded text-sm font-bold">{league.code}</code>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyCode}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <Badge variant="outline">{league.is_public ? 'Public' : 'Private'}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
        <Leaderboard entries={leaderboard} isLoading={lbLoading} currentUserId={user?.id} />
      </div>
    </div>
  )
}
