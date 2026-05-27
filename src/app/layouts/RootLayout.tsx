import { Link, Outlet, useLocation } from 'react-router'
import { useState } from 'react'
import {
  Trophy,
  Calendar,
  Users,
  BarChart3,
  User,
  Bell,
  Menu,
  X,
  Home,
  Flag,
  Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/matches', label: 'Matches', icon: Trophy },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/groups', label: 'Groups', icon: Globe },
  { to: '/nations', label: 'Nations', icon: Flag },
  { to: '/leagues', label: 'Leagues', icon: Users },
  { to: '/stats', label: 'Stats', icon: BarChart3 },
]

export function RootLayout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center px-4">
          <Link to="/" className="mr-6 flex items-center gap-2 font-bold">
            <Flag className="h-5 w-5" />
            <span className="hidden sm:inline">WC Picks 2026</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to}>
                <Button
                  variant={location.pathname === item.to ? 'secondary' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {user && (
              <>
                <Link to="/notifications">
                  <Button variant="ghost" size="icon">
                    <Bell className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="hidden md:inline-flex"
                >
                  Sign out
                </Button>
              </>
            )}

            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground cursor-pointer">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <SheetTitle className="flex items-center gap-2 mb-6">
                  <Flag className="h-5 w-5" />
                  WC Picks 2026
                </SheetTitle>
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button
                        variant={location.pathname === item.to ? 'secondary' : 'ghost'}
                        className="w-full justify-start gap-2"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                  {user && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 mt-4"
                      onClick={() => {
                        signOut()
                        setMobileOpen(false)
                      }}
                    >
                      Sign out
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
