import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { NationFlag } from '@/components/nation/NationFlag'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMyProfile, useUpdateProfile } from '@/hooks/useProfile'
import { useAllMyBets } from '@/hooks/useBets'
import { useAllNations } from '@/hooks/useNations'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

export function ProfilePage() {
  const { user } = useAuth()
  const { data: profile, isLoading } = useMyProfile()
  const { data: bets } = useAllMyBets()
  const { data: nations } = useAllNations()
  const updateProfile = useUpdateProfile()
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!profile) return null

  const accuracy = profile.total_bets > 0
    ? Math.round((profile.correct_bets / profile.total_bets) * 100)
    : 0

  const favoriteNation = nations?.find((n) => n.id === profile.favorite_nation_id) ?? null

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({ display_name: displayName })
      toast.success('Profile updated')
      setEditing(false)
    } catch {
      toast.error('Failed to update profile')
    }
  }

  const handleFavoriteChange = async (nationId: string) => {
    try {
      await updateProfile.mutateAsync({ favorite_nation_id: nationId === '__none__' ? null : nationId })
      toast.success('Favorite team updated')
    } catch {
      toast.error('Failed to update favorite team')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Profile header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl">
                {(profile.display_name ?? profile.username).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {editing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Display name"
                    className="max-w-xs"
                  />
                  <Button size="sm" onClick={handleSave} disabled={updateProfile.isPending}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{profile.display_name ?? profile.username}</h1>
                    {favoriteNation && (
                      <NationFlag
                        url={favoriteNation.flag_url}
                        emoji={favoriteNation.flag}
                        name={favoriteNation.name}
                        size="lg"
                      />
                    )}
                  </div>
                  <p className="text-muted-foreground">@{profile.username}</p>
                </>
              )}
              <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
            </div>
            {!editing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setDisplayName(profile.display_name ?? ''); setEditing(true) }}
              >
                Edit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Favorite team */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Favorite Team</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Pick a nation — you earn <span className="font-semibold text-foreground">double points</span> on every match they play.
          </p>
          <div className="flex items-center gap-3">
            {favoriteNation && (
              <NationFlag url={favoriteNation.flag_url} emoji={favoriteNation.flag} name={favoriteNation.name} size="lg" />
            )}
            <Select
              value={profile.favorite_nation_id ?? '__none__'}
              onValueChange={(v) => v != null && handleFavoriteChange(v)}
            >
              <SelectTrigger className="w-[240px]" disabled={updateProfile.isPending || !nations}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">No favorite</SelectItem>
                {nations?.map((n) => (
                  <SelectItem key={n.id} value={n.id}>
                    <NationFlag url={n.flag_url} emoji={n.flag} name={n.name} size="sm" />
                    {n.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Stats</CardTitle>
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

      {/* Bet history */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Bet History</h2>
        {bets?.length ? (
          <div className="space-y-2">
            {bets.map((bet) => (
              <Card key={bet.bet_id}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <NationFlag url={bet.home_team_flag_url} emoji={bet.home_team_flag} name={bet.home_team_name} size="sm" />
                    <span className="text-sm truncate">{bet.home_team_name} vs {bet.away_team_name}</span>
                    <NationFlag url={bet.away_team_flag_url} emoji={bet.away_team_flag} name={bet.away_team_name} size="sm" />
                    <Badge variant="outline" className="text-xs">{bet.league_name}</Badge>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {bet.predicted_winner === 'home' ? (
                        <NationFlag url={bet.home_team_flag_url} emoji={bet.home_team_flag} name={bet.home_team_name} size="sm" />
                      ) : bet.predicted_winner === 'away' ? (
                        <NationFlag url={bet.away_team_flag_url} emoji={bet.away_team_flag} name={bet.away_team_name} size="sm" />
                      ) : 'Draw'}
                    </span>
                    {bet.is_correct !== null && (
                      <Badge variant={bet.is_correct ? 'default' : 'secondary'}>
                        {bet.is_correct ? `+${bet.points_earned}` : '0'}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No bets placed yet</p>
        )}
      </div>
    </div>
  )
}
