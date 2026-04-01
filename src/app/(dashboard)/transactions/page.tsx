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

interface Transaction {
  id: string
  type: string
  status: string
  amount: number
  reference_id?: string
  created_at: string
  user?: {
    id: string
    email: string
  }
}

interface ApiResponse {
  transactions: Transaction[]
  pagination: { total: number }
}

export default function TransactionsPage() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ['transactions', pagination, typeFilter, statusFilter],
    queryFn: async () => {
      const res = await api.get('/wallet/admin/transactions', {
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          ...(typeFilter !== 'all' && { type: typeFilter }),
          ...(statusFilter !== 'all' && { status: statusFilter }),
        },
      })
      return res.data.data
    },
  })

  const columns: ColumnDef<Transaction>[] = [
    {
      header: 'User',
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">{row.original.user?.email || '—'}</span>
      ),
    },
    {
      header: 'Type',
      cell: ({ row }) => (
        <span className="capitalize text-sm font-medium text-gray-700">
          {row.original.type?.replace(/_/g, ' ')}
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
        <span className="text-sm font-semibold">
          ${row.original.amount?.toFixed(2) ?? '0.00'}
        </span>
      ),
    },
    {
      header: 'Reference',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-mono">
          {row.original.reference_id ? row.original.reference_id.slice(0, 24) + '...' : '—'}
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
      <PageHeader title="Transactions" description="View all wallet transactions" />

      <div className="flex items-center gap-3 flex-wrap">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="top_up">Top Up</SelectItem>
            <SelectItem value="withdrawal">Withdrawal</SelectItem>
            <SelectItem value="payment">Payment</SelectItem>
            <SelectItem value="refund">Refund</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.transactions ?? []}
        total={data?.pagination?.total ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />
    </div>
  )
}
