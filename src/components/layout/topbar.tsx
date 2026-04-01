'use client'

import { usePathname } from 'next/navigation'
import { Menu, LogOut, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/caregivers': 'Caregivers',
  '/care-seekers': 'Care Seekers',
  '/kyc': 'KYC',
  '/background-checks': 'Background Checks',
  '/jobs': 'Jobs',
  '/subscriptions': 'Subscriptions',
  '/reviews': 'Reviews',
  '/transactions': 'Transactions',
  '/notifications': 'Notifications',
  '/admins': 'Admins',
}

function getPageTitle(pathname: string): string {
  for (const [route, title] of Object.entries(routeTitles)) {
    if (pathname === route || pathname.startsWith(route + '/')) {
      return title
    }
  }
  return 'Admin'
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname()
  const { admin, logout } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()
  const pageTitle = getPageTitle(pathname)

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Toggle dark mode"
        >
          {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {admin && (
          <>
            <div className="hidden sm:flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#0099FF]/10 text-[#0099FF] text-xs font-semibold">
                  {getInitials(`${admin.first_name} ${admin.last_name}` || admin.email)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-foreground">{admin.first_name} {admin.last_name}</p>
                <p className="text-xs text-muted-foreground capitalize">{admin.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
