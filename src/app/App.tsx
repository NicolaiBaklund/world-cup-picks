import { BrowserRouter, useRoutes } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '@/lib/queryClient'
import { useMatchRealtime } from '@/hooks/useRealtime'
import { routes } from './routes'

function RealtimeProvider({ children }: { children: React.ReactNode }) {
  useMatchRealtime()
  return <>{children}</>
}

function AppRoutes() {
  return useRoutes(routes)
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RealtimeProvider>
          <AppRoutes />
        </RealtimeProvider>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
