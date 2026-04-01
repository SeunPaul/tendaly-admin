'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ShieldCheck,
  Search,
  Briefcase,
  CreditCard,
  Star,
  ArrowLeftRight,
  Bell,
  Shield,
  X,
  DollarSign,
  Ticket,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/caregivers', label: 'Caregivers', icon: Users },
  { href: '/care-seekers', label: 'Care Seekers', icon: UserCheck },
  { href: '/kyc', label: 'KYC', icon: ShieldCheck },
  { href: '/background-checks', label: 'Background Checks', icon: Search },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/reviews', label: 'Reviews', icon: Star },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/revenue', label: 'Revenue', icon: DollarSign },
  { href: '/vouchers', label: 'Vouchers', icon: Ticket },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/admins', label: 'Admins', icon: Shield },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-border bg-background transition-transform duration-300 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Tendaly"
              width={140}
              height={36}
              priority
            />
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/')
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-[#0099FF]/10 text-[#0099FF]'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                  >
                    <Icon
                      className={cn('h-5 w-5 shrink-0', isActive ? 'text-[#0099FF]' : 'text-gray-400')}
                    />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <p className="text-xs text-muted-foreground text-center">Tendaly Admin v0.1.0</p>
        </div>
      </aside>
    </>
  )
}
