import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateLeague } from '@/hooks/useLeagues'
import { toast } from 'sonner'

export function CreateLeaguePage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [maxMembers, setMaxMembers] = useState('50')
  const navigate = useNavigate()
  const createLeague = useCreateLeague()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const league = await createLeague.mutateAsync({
        name,
        description: description || undefined,
        is_public: isPublic,
        max_members: parseInt(maxMembers),
      })
      toast.success(`League created! Invite code: ${league.code}`)
      navigate(`/leagues/${league.id}`)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to create league'
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
          <CardTitle>Create League</CardTitle>
          <CardDescription>Set up a new betting league for you and your friends</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">League Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Office World Cup Pool"
                required
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this league about?"
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select value={isPublic ? 'public' : 'private'} onValueChange={(v) => setIsPublic(v === 'public')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private (invite code only)</SelectItem>
                  <SelectItem value="public">Public (anyone can join)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxMembers">Max Members</Label>
              <Input
                id="maxMembers"
                type="number"
                value={maxMembers}
                onChange={(e) => setMaxMembers(e.target.value)}
                min={2}
                max={500}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Scoring: <strong>3</strong> for exact scoreline, <strong>1</strong> for correct result, <strong>0</strong> for wrong.
            </p>

            <Button type="submit" className="w-full" disabled={createLeague.isPending}>
              {createLeague.isPending ? 'Creating...' : 'Create League'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
