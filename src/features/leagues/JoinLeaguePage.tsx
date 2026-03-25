import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useJoinLeague } from '@/hooks/useLeagues'
import { toast } from 'sonner'

export function JoinLeaguePage() {
  const { code: urlCode } = useParams()
  const [code, setCode] = useState(urlCode ?? '')
  const navigate = useNavigate()
  const joinLeague = useJoinLeague()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    try {
      const leagueId = await joinLeague.mutateAsync(code.trim())
      toast.success('Joined league!')
      navigate(`/leagues/${leagueId}`)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to join league'
      toast.error(msg)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Link to="/leagues">
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to leagues
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Join League</CardTitle>
          <CardDescription>Enter the invite code shared by the league creator</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Invite Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g., AB12CD"
                maxLength={6}
                className="font-mono text-center text-lg tracking-widest uppercase"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={joinLeague.isPending}>
              {joinLeague.isPending ? 'Joining...' : 'Join League'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
