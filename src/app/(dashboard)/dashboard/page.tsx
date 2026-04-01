'use client'

import { useQuery } from '@tanstack/react-query'
import { Users, UserCheck, Briefcase, DollarSign, Activity, UserX } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import api from '@/lib/api'

interface MetricItem {
  value: number
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
}

interface DashboardStats {
  totalCaregivers: MetricItem
  totalUsers: MetricItem
  activeUsers: MetricItem
  deactivatedAccounts: MetricItem
  bookings: MetricItem
  totalRevenue: MetricItem
  userTypeDistribution: {
    totalUsers: number
    caregivers: number
    careseekers: number
  }
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/dashboard')
      return res.data.data
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={(stats?.totalUsers?.value ?? 0).toLocaleString()}
          icon={Users}
          change={stats?.totalUsers?.change}
          changeType={stats?.totalUsers?.changeType}
        />
        <StatCard
          title="Caregivers"
          value={(stats?.totalCaregivers?.value ?? 0).toLocaleString()}
          icon={UserCheck}
          change={stats?.totalCaregivers?.change}
          changeType={stats?.totalCaregivers?.changeType}
        />
        <StatCard
          title="Care Seekers"
          value={(stats?.userTypeDistribution?.careseekers ?? 0).toLocaleString()}
          icon={Users}
        />
        <StatCard
          title="Active Users"
          value={(stats?.activeUsers?.value ?? 0).toLocaleString()}
          icon={Activity}
          change={stats?.activeUsers?.change}
          changeType={stats?.activeUsers?.changeType}
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats?.totalRevenue?.value ?? 0).toFixed(2)}`}
          icon={DollarSign}
          change={stats?.totalRevenue?.change}
          changeType={stats?.totalRevenue?.changeType}
        />
        <StatCard
          title="Bookings"
          value={(stats?.bookings?.value ?? 0).toLocaleString()}
          icon={Briefcase}
          change={stats?.bookings?.change}
          changeType={stats?.bookings?.changeType}
        />
        <StatCard
          title="Deactivated Accounts"
          value={(stats?.deactivatedAccounts?.value ?? 0).toLocaleString()}
          icon={UserX}
          change={stats?.deactivatedAccounts?.change}
          changeType={stats?.deactivatedAccounts?.changeType}
        />
      </div>
    </div>
  )
}
