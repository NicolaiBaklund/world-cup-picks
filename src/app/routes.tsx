import { type RouteObject } from 'react-router'
import { RootLayout } from './layouts/RootLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { ProtectedLayout } from './layouts/ProtectedLayout'

import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { MatchesPage } from '@/features/matches/MatchesPage'
import { MatchDetailPage } from '@/features/matches/MatchDetailPage'
import { GroupStandingsPage } from '@/features/groups/GroupStandingsPage'
import { NationsPage } from '@/features/nations/NationsPage'
import { NationDetailPage } from '@/features/nations/NationDetailPage'
import { LeaguesPage } from '@/features/leagues/LeaguesPage'
import { CreateLeaguePage } from '@/features/leagues/CreateLeaguePage'
import { JoinLeaguePage } from '@/features/leagues/JoinLeaguePage'
import { LeagueDetailPage } from '@/features/leagues/LeagueDetailPage'
import { ProfilePage } from '@/features/profile/ProfilePage'
import { UserProfilePage } from '@/features/profile/UserProfilePage'
import { StatsPage } from '@/features/stats/StatsPage'
import { NotificationsPage } from '@/features/notifications/NotificationsPage'
import { NotFoundPage } from '@/features/NotFoundPage'

export const routes: RouteObject[] = [
  // Auth routes (no navbar, centered layout)
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },

  // Protected app routes (with navbar)
  {
    element: <RootLayout />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/matches', element: <MatchesPage /> },
          { path: '/matches/:id', element: <MatchDetailPage /> },
          { path: '/groups', element: <GroupStandingsPage /> },
          { path: '/nations', element: <NationsPage /> },
          { path: '/nations/:id', element: <NationDetailPage /> },
          { path: '/leagues', element: <LeaguesPage /> },
          { path: '/leagues/create', element: <CreateLeaguePage /> },
          { path: '/leagues/join/:code?', element: <JoinLeaguePage /> },
          { path: '/leagues/:id', element: <LeagueDetailPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/profile/:id', element: <UserProfilePage /> },
          { path: '/stats', element: <StatsPage /> },
          { path: '/notifications', element: <NotificationsPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]
