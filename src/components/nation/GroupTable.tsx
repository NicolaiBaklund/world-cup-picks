import { Link } from 'react-router'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { GroupStanding } from '@/types'

interface GroupTableProps {
  groupName: string
  standings: GroupStanding[]
}

export function GroupTable({ groupName, standings }: GroupTableProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Group {groupName}</h3>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">#</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-center w-10">P</TableHead>
              <TableHead className="text-center w-10">W</TableHead>
              <TableHead className="text-center w-10">D</TableHead>
              <TableHead className="text-center w-10">L</TableHead>
              <TableHead className="text-center w-12 hidden sm:table-cell">GF</TableHead>
              <TableHead className="text-center w-12 hidden sm:table-cell">GA</TableHead>
              <TableHead className="text-center w-12">GD</TableHead>
              <TableHead className="text-center w-10 font-bold">Pts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((nation) => (
              <TableRow key={nation.id} className={nation.position <= 2 ? 'bg-accent/30' : ''}>
                <TableCell className="font-medium">{nation.position}</TableCell>
                <TableCell>
                  <Link
                    to={`/nations/${nation.id}`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <span>{nation.flag}</span>
                    <span className="hidden sm:inline">{nation.name}</span>
                    <span className="sm:hidden">{nation.code}</span>
                  </Link>
                </TableCell>
                <TableCell className="text-center">{nation.played}</TableCell>
                <TableCell className="text-center">{nation.won}</TableCell>
                <TableCell className="text-center">{nation.drawn}</TableCell>
                <TableCell className="text-center">{nation.lost}</TableCell>
                <TableCell className="text-center hidden sm:table-cell">{nation.goals_for}</TableCell>
                <TableCell className="text-center hidden sm:table-cell">{nation.goals_against}</TableCell>
                <TableCell className="text-center">{nation.goal_difference}</TableCell>
                <TableCell className="text-center font-bold">{nation.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
