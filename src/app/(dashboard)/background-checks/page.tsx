'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { type ColumnDef, type PaginationState } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

interface BackgroundCheck {
  id: string
  status: string
  result?: string
  amount?: number
  created_at: string
  caregiver?: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  careseeker?: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
}

interface ApiResponse {
  requests: BackgroundCheck[]
  pagination: { total: number }
}

export default function BackgroundChecksPage() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ['background-checks', pagination, statusFilter],
    queryFn: async () => {
      const res = await api.get('/kyc/admin/background-check-requests', {
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          ...(statusFilter !== 'all' && { status: statusFilter }),
        },
      })
      return res.data.data
    },
  })

  const columns: ColumnDef<BackgroundCheck>[] = [
    {
      header: 'Caregiver',
      cell: ({ row }) => {
        const c = row.original.caregiver
        return (
          <div>
            <p className="font-medium text-gray-900">
              {c ? `${c.first_name || ''} ${c.last_name || ''}`.trim() || '—' : '—'}
            </p>
            <p className="text-xs text-muted-foreground">{c?.email}</p>
          </div>
        )
      },
    },
    {
      header: 'Requested By',
      cell: ({ row }) => {
        const cs = row.original.careseeker
        return (
          <div>
            <p className="text-sm text-gray-700">
              {cs ? `${cs.first_name || ''} ${cs.last_name || ''}`.trim() || '—' : '—'}
            </p>
            <p className="text-xs text-muted-foreground">{cs?.email}</p>
          </div>
        )
      },
    },
    {
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      header: 'Result',
      cell: ({ row }) =>
        row.original.result ? <StatusBadge status={row.original.result} /> : <span className="text-muted-foreground text-sm">—</span>,
    },
    {
      header: 'Amount',
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.amount ? `$${row.original.amount.toFixed(2)}` : '—'}
        </span>
      ),
    },
    {
      header: 'Date',
      cell: ({ row }) => <span className="text-sm">{formatDate(row.original.created_at)}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Background Checks" description="Monitor background check requests and results" />

      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.requests ?? []}
        total={data?.pagination?.total ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />
    </div>
  )
}
