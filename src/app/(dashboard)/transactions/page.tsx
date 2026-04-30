'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { type ColumnDef, type PaginationState } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import api from '@/lib/api'
import { formatDateTime } from '@/lib/utils'

interface Transaction {
  id: string
  type: string
  status: string
  amount: number
  fee: number
  net_amount: number
  reference_id?: string | null
  payment_method?: string | null
  description?: string | null
  created_at: string
  user?: {
    id: string
    email: string
  } | null
}

interface ApiResponse {
  transactions: Transaction[]
  pagination: { total: number }
}

function fmt(n: number | null | undefined): string {
  if (n == null) return '—'
  return `$${Math.abs(n).toFixed(2)}`
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b last:border-0">
      <span className="text-xs text-muted-foreground shrink-0 w-28">{label}</span>
      <span className="text-sm font-medium text-right break-all">{value ?? '—'}</span>
    </div>
  )
}

export default function TransactionsPage() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selected, setSelected] = useState<Transaction | null>(null)

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
        <span className="text-sm font-semibold">{fmt(row.original.amount)}</span>
      ),
    },
    {
      header: 'Fee',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{fmt(row.original.fee)}</span>
      ),
    },
    {
      header: 'Net',
      cell: ({ row }) => (
        <span className="text-sm font-semibold">{fmt(row.original.net_amount)}</span>
      ),
    },
    {
      header: 'Date',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{formatDateTime(row.original.created_at)}</span>
      ),
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
            <SelectItem value="withdrawal">Withdrawal</SelectItem>
            <SelectItem value="fee">Fee</SelectItem>
            <SelectItem value="payment">Payment</SelectItem>
            <SelectItem value="escrow_hold">Escrow Hold</SelectItem>
            <SelectItem value="escrow_refund">Escrow Refund</SelectItem>
            <SelectItem value="subscription">Subscription</SelectItem>
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
        onRowClick={(row) => setSelected(row)}
      />

      {/* Transaction Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null) }}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Transaction Details</SheetTitle>
            <SheetDescription>
              {selected?.type?.replace(/_/g, ' ')} · {selected?.created_at ? formatDateTime(selected.created_at) : ''}
            </SheetDescription>
          </SheetHeader>

          {selected && (
            <div className="p-6 space-y-1">
              <DetailRow label="ID" value={<span className="font-mono text-xs">{selected.id}</span>} />
              <DetailRow label="User" value={selected.user?.email} />
              <DetailRow
                label="Type"
                value={<span className="capitalize">{selected.type?.replace(/_/g, ' ')}</span>}
              />
              <DetailRow label="Status" value={<StatusBadge status={selected.status} />} />
              <DetailRow label="Amount" value={fmt(selected.amount)} />
              <DetailRow label="Fee" value={fmt(selected.fee)} />
              <DetailRow label="Net Amount" value={fmt(selected.net_amount)} />
              {selected.payment_method && (
                <DetailRow
                  label="Payment Method"
                  value={<span className="capitalize">{selected.payment_method.replace(/_/g, ' ')}</span>}
                />
              )}
              {selected.description && (
                <DetailRow label="Description" value={selected.description} />
              )}
              {selected.reference_id && (
                <DetailRow
                  label="Reference"
                  value={<span className="font-mono text-xs">{selected.reference_id}</span>}
                />
              )}
              <DetailRow label="Date" value={formatDateTime(selected.created_at)} />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
