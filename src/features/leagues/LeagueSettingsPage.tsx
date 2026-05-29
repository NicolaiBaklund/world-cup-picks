import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useLeague, useUpdateLeague, useDeleteLeague } from '@/hooks/useLeagues'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

export function LeagueSettingsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: league, isLoading } = useLeague(id!)
  const updateLeague = useUpdateLeague(id!)
  const deleteLeague = useDeleteLeague()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [maxMembers, setMaxMembers] = useState('50')

  // Seed form once league loads
  useEffect(() => {
    if (league) {
      setName(league.name)
      setDescription(league.description ?? '')
      setIsPublic(league.is_public)
      setMaxMembers(String(league.max_members ?? 50))
    }
  }, [league])

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!league) {
    return <p className="text-muted-foreground">League not found</p>
  }

  const isCreator = user?.id === league.creator_id
  if (!isCreator) {
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <Link to={`/leagues/${id}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to league
          </Button>
        </Link>
        <p className="text-muted-foreground">Only the league creator can edit settings.</p>
      </div>
    )
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateLeague.mutateAsync({
        name,
        description: description || null,
        is_public: isPublic,
        max_members: parseInt(maxMembers),
      })
      toast.success('League settings saved')
      navigate(`/leagues/${id}`)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to save settings'
      toast.error(msg)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${league.name}"? This removes the league and all its bets for every member. This cannot be undone.`)) {
      return
    }
    try {
      await deleteLeague.mutateAsync(league.id)
      toast.success('League deleted')
      navigate('/leagues')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to delete league'
      toast.error(msg)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Link to={`/leagues/${id}`}>
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to league
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>League Settings</CardTitle>
          <CardDescription>Manage this league's details and rules</CardDescription>
        </CardHeader>
        <form onSubmit={handleSave}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">League Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select
                items={[
                  { value: 'private', label: 'Private (invite code only)' },
                  { value: 'public', label: 'Public (anyone can join)' },
                ]}
                value={isPublic ? 'public' : 'private'}
                onValueChange={(v) => setIsPublic(v === 'public')}
              >
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

            <Button type="submit" className="w-full" disabled={updateLeague.isPending}>
              {updateLeague.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </CardContent>
        </form>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>Deleting a league is permanent and cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            className="gap-2"
            onClick={handleDelete}
            disabled={deleteLeague.isPending}
          >
            <Trash2 className="h-4 w-4" />
            {deleteLeague.isPending ? 'Deleting...' : 'Delete league'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
