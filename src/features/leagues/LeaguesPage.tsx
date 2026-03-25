import { Link } from 'react-router'
import { Plus, Users, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyLeagues, usePublicLeagues } from '@/hooks/useLeagues'
import type { League } from '@/types'

function LeagueCard({ league, role }: { league: League; role?: string }) {
  return (
    <Link to={`/leagues/${league.id}`}>
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold truncate">{league.name}</h3>
              {league.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{league.description}</p>
              )}
            </div>
            <div className="flex gap-1 ml-2 flex-shrink-0">
              {league.is_public && <Badge variant="outline"><Globe className="h-3 w-3" /></Badge>}
              {role === 'admin' && <Badge variant="secondary">Admin</Badge>}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span>Code: <code className="font-mono bg-muted px-1 rounded">{league.code}</code></span>
            <span>Max: {league.max_members}</span>
            <span>{league.points_for_correct}pt/correct</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function LeaguesPage() {
  const { data: myLeagues, isLoading: myLoading } = useMyLeagues()
  const { data: publicLeagues, isLoading: publicLoading } = usePublicLeagues()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leagues</h1>
          <p className="text-muted-foreground mt-1">Join or create betting leagues</p>
        </div>
        <div className="flex gap-2">
          <Link to="/leagues/join">
            <Button variant="outline" size="sm"><Users className="h-4 w-4 mr-1" /> Join</Button>
          </Link>
          <Link to="/leagues/create">
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Create</Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="my">
        <TabsList>
          <TabsTrigger value="my">My Leagues</TabsTrigger>
          <TabsTrigger value="public">Public Leagues</TabsTrigger>
        </TabsList>

        <TabsContent value="my" className="mt-4">
          {myLoading ? (
            <div className="grid gap-3">
              {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
            </div>
          ) : myLeagues?.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {myLeagues.map((league) => (
                <LeagueCard key={league.id} league={league} role={(league as League & { role: string }).role} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>You haven&apos;t joined any leagues yet.</p>
                <div className="flex gap-2 justify-center mt-4">
                  <Link to="/leagues/join"><Button variant="outline" size="sm">Join a league</Button></Link>
                  <Link to="/leagues/create"><Button size="sm">Create one</Button></Link>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="public" className="mt-4">
          {publicLoading ? (
            <div className="grid gap-3">
              {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
            </div>
          ) : publicLeagues?.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {publicLeagues.map((league) => (
                <LeagueCard key={league.id} league={league} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No public leagues yet</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
