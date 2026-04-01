'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef, type PaginationState } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

interface Subscription {
  id: string
  status: string
  is_trial: boolean
  start_date: string
  end_date?: string
  amount_paid: number
  user?: {
    id: string
    email: string
    first_name: string
    last_name: string
  }
  plan?: {
    id: string
    name: string
    type: string
  }
}

interface ApiResponse {
  subscriptions: Subscription[]
  pagination: { total: number }
}

export default function SubscriptionsPage() {
  const queryClient = useQueryClient()
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [cancelUserId, setCancelUserId] = useState<string | null>(null)

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ['subscriptions', pagination, statusFilter],
    queryFn: async () => {
      const res = await api.get('/subscriptions/admin/all', {
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          ...(statusFilter !== 'all' && { status: statusFilter }),
        },
      })
      return res.data.data
    },
  })

  const cancelMutation = useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/subscriptions/admin/${userId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      setCancelUserId(null)
    },
  })

  const columns: ColumnDef<Subscription>[] = [
    {
      header: 'User',
      cell: ({ row }) => {
        const u = row.original.user
        return (
          <div>
            <p className="font-medium text-gray-900">
              {u ? `${u.first_name || ''} ${u.last_name || ''}`.trim() || '—' : '—'}
            </p>
            <p className="text-xs text-muted-foreground">{u?.email}</p>
          </div>
        )
      },
    },
    {
      header: 'Plan',
      cell: ({ row }) => (
        <span className="capitalize text-sm font-medium">
          {row.original.plan?.name ?? '—'}
          {row.original.is_trial && <span className="ml-1 text-xs text-muted-foreground">(Trial)</span>}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      header: 'Amount',
      cell: ({ row }) => (
        <span className="text-sm">${row.original.amount_paid?.toFixed(2) ?? '0.00'}/mo</span>
      ),
    },
    {
      header: 'Start',
      cell: ({ row }) => <span className="text-sm">{formatDate(row.original.start_date)}</span>,
    },
    {
      header: 'End',
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.end_date ? formatDate(row.original.end_date) : '—'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {row.original.status === 'active' && row.original.user && (
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setCancelUserId(row.original.user!.id)}
              >
                Cancel Subscription
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Subscriptions" description="Manage user subscriptions" />

      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.subscriptions ?? []}
        total={data?.pagination?.total ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />

      <Dialog open={!!cancelUserId} onOpenChange={(open) => !open && setCancelUserId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to cancel this subscription? The user will lose access at the end of
            the current billing period.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelUserId(null)}>
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={() => cancelUserId && cancelMutation.mutate(cancelUserId)}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? 'Cancelling...' : 'Yes, Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
