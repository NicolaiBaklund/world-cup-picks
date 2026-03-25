import { Link } from 'react-router'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import type { LeaderboardEntry } from '@/types'

interface LeaderboardProps {
  entries: LeaderboardEntry[] | undefined
  isLoading: boolean
  currentUserId?: string
}

export function Leaderboard({ entries, isLoading, currentUserId }: LeaderboardProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (!entries?.length) {
    return <p className="text-sm text-muted-foreground text-center py-4">No members yet</p>
  }

  return (
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
          {entries.map((entry) => {
            const isMe = entry.user_id === currentUserId
            return (
              <TableRow key={entry.user_id} className={isMe ? 'bg-accent/30' : ''}>
                <TableCell>
                  <span className={`font-bold ${entry.rank <= 3 ? 'text-primary' : ''}`}>
                    {entry.rank}
                  </span>
                </TableCell>
                <TableCell>
                  <Link to={`/profile/${entry.user_id}`} className="flex items-center gap-2 hover:underline">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {(entry.display_name ?? entry.username).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate font-medium">
                      {entry.display_name ?? entry.username}
                      {isMe && <span className="text-muted-foreground ml-1">(you)</span>}
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="text-center">{entry.total_bets}</TableCell>
                <TableCell className="text-center hidden sm:table-cell">{entry.correct_bets}</TableCell>
                <TableCell className="text-center hidden sm:table-cell">{entry.accuracy}%</TableCell>
                <TableCell className="text-center font-bold">{entry.points}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
