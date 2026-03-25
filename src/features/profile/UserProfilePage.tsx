import { useParams, Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserProfile } from '@/hooks/useProfile'

export function UserProfilePage() {
  const { id } = useParams()
  const { data: profile, isLoading } = useUserProfile(id!)

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (!profile) return <p className="text-muted-foreground">User not found</p>

  const accuracy = profile.total_bets > 0
    ? Math.round((profile.correct_bets / profile.total_bets) * 100)
    : 0

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Link to="/leagues">
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </Link>

      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl">
              {(profile.display_name ?? profile.username).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{profile.display_name ?? profile.username}</h1>
            <p className="text-muted-foreground">@{profile.username}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{profile.total_points}</p>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{profile.total_bets}</p>
              <p className="text-xs text-muted-foreground">Total Bets</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{profile.correct_bets}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{accuracy}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
