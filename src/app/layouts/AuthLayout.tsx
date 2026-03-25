import { Outlet, Link } from 'react-router'
import { Flag } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Link to="/" className="mb-8 flex items-center gap-2 text-2xl font-bold">
        <Flag className="h-7 w-7" />
        WC Picks 2026
      </Link>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}
