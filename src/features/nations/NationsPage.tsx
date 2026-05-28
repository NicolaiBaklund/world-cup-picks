import { Link } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAllNations } from '@/hooks/useNations'
import type { Nation } from '@/types'

export function NationsPage() {
  const { data: nations, isLoading } = useAllNations()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    )
  }

  // Real teams only (exclude the TBD placeholder), grouped by group letter.
  const real = (nations ?? []).filter((n) => n.code !== 'TBD')
  const groups = [...new Set(real.map((n) => n.group_name))].sort()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Nations</h1>
        <p className="text-muted-foreground">All 48 teams at the 2026 World Cup.</p>
      </div>

      {groups.map((group) => (
        <section key={group}>
          <h2 className="text-lg font-semibold mb-3">Group {group}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {real
              .filter((n) => n.group_name === group)
              .map((nation) => (
                <NationCard key={nation.id} nation={nation} />
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function NationCard({ nation }: { nation: Nation }) {
  return (
    <Link to={`/nations/${nation.id}`}>
      <Card className="h-full transition-colors hover:bg-accent">
        <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
          {nation.flag_url ? (
            <img
              src={nation.flag_url}
              alt={`${nation.name} flag`}
              className="h-8 w-12 rounded object-cover shadow-sm"
            />
          ) : (
            <span className="text-4xl">{nation.flag}</span>
          )}
          <div>
            <p className="font-medium leading-tight">{nation.name}</p>
            {nation.nickname && (
              <p className="text-xs text-muted-foreground">{nation.nickname}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
