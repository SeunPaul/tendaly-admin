'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef, type PaginationState } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { MoreHorizontal } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

interface Caregiver {
  id: string
  full_name: string
  email: string
  profile_photo: string | null
  is_suspended: boolean
  kyc_status: string
  account_created: string
  subscription?: {
    status: string
    is_trial: boolean
    is_voucher: boolean
    plan_name: string | null
    plan_type: string | null
    end_date: string | null
  } | null
}

interface ApiResponse {
  caregivers: Caregiver[]
  pagination: { total: number }
}

export default function CaregiversPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ['caregivers', pagination],
    queryFn: async () => {
      const res = await api.get('/users/caregivers', {
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
        },
      })
      return res.data.data
    },
  })

  const suspendMutation = useMutation({
    mutationFn: async ({ id, suspend }: { id: string; suspend: boolean }) => {
      if (suspend) {
        await api.patch(`/users/admin/${id}/suspend`, { reason: '' })
      } else {
        await api.patch(`/users/admin/${id}/unsuspend`)
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['caregivers'] }),
  })

  const columns: ColumnDef<Caregiver>[] = [
    {
      header: 'Name',
      cell: ({ row }) => {
        const initials = row.original.full_name
          ? row.original.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
          : '?'
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
              {row.original.profile_photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.original.profile_photo} alt={row.original.full_name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs font-medium text-gray-500">{initials}</span>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">{row.original.full_name || '—'}</p>
              <p className="text-xs text-muted-foreground">{row.original.email}</p>
            </div>
          </div>
        )
      },
    },
    {
      header: 'KYC Status',
      cell: ({ row }) => (
        <StatusBadge status={row.original.kyc_status ?? 'not_submitted'} />
      ),
    },
    {
      header: 'Subscription',
      cell: ({ row }) => {
        const sub = row.original.subscription
        if (!sub) return <span className="text-xs text-muted-foreground">None</span>
        const label = sub.is_trial ? 'Trial' : sub.is_voucher ? 'Voucher' : (sub.plan_name ?? sub.status)
        return <StatusBadge status={sub.status} label={label} />
      },
    },
    {
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge status={row.original.is_suspended ? 'suspended' : 'active'} />
      ),
    },
    {
      header: 'Joined',
      cell: ({ row }) => <span className="text-sm">{formatDate(row.original.account_created)}</span>,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/caregivers/${row.original.id}`) }}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                suspendMutation.mutate({ id: row.original.id, suspend: !row.original.is_suspended })
              }}
              className={row.original.is_suspended ? 'text-green-600' : 'text-red-600'}
            >
              {row.original.is_suspended ? 'Unsuspend' : 'Suspend'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Caregivers" description="Manage all caregiver accounts" />

      <DataTable
        columns={columns}
        data={data?.caregivers ?? []}
        total={data?.pagination?.total ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        onRowClick={(row) => router.push(`/caregivers/${row.id}`)}
      />
    </div>
  )
}
