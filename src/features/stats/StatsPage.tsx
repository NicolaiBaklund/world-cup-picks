import { Link } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useTopPredictors } from '@/hooks/useProfile'

export function StatsPage() {
  const { data: topPredictors, isLoading } = useTopPredictors(20)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stats</h1>
        <p className="text-muted-foreground mt-1">Global leaderboard and statistics</p>
      </div>

      {/* Global leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Top Predictors</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : topPredictors?.length ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-center">Bets</TableHead>
                    <TableHead className="text-center hidden sm:table-cell">Correct</TableHead>
                    <TableHead className="text-center hidden sm:table-cell">Accuracy</TableHead>
                    <TableHead className="text-center font-bold">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPredictors.map((p, i) => {
                    const accuracy = p.total_bets > 0
                      ? Math.round((p.correct_bets / p.total_bets) * 100)
                      : 0
                    return (
                      <TableRow key={p.id}>
                        <TableCell className={`font-bold ${i < 3 ? 'text-primary' : ''}`}>{i + 1}</TableCell>
                        <TableCell>
                          <Link to={`/profile/${p.id}`} className="flex items-center gap-2 hover:underline">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {(p.display_name ?? p.username).charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {p.display_name ?? p.username}
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">{p.total_bets}</TableCell>
                        <TableCell className="text-center hidden sm:table-cell">{p.correct_bets}</TableCell>
                        <TableCell className="text-center hidden sm:table-cell">{accuracy}%</TableCell>
                        <TableCell className="text-center font-bold">{p.total_points}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No stats yet — place some bets to get started!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
