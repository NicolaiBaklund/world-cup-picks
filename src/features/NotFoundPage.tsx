import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function NotFoundPage() {
  return (
    <Card className="max-w-md mx-auto mt-12">
      <CardContent className="p-8 text-center">
        <p className="text-6xl font-bold text-muted-foreground mb-4">404</p>
        <h2 className="text-xl font-semibold mb-2">Page not found</h2>
        <p className="text-sm text-muted-foreground mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button>Go home</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
