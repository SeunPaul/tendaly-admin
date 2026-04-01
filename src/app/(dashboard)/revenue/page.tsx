'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { type ColumnDef, type PaginationState } from '@tanstack/react-table'
import { DollarSign, TrendingUp, CreditCard, Briefcase } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

interface RevenueSummary {
  totals: {
    total: number
    subscriptions: number
    job_payments: number
    transaction_fees: number
    other: number
  }
  subscriptions: {
    total_created: number
    active_count: number
  }
  monthly_breakdown: { month: string; amount: number }[]
}

interface RevenueEntry {
  id: string
  type: string
  status: string
  amount: number
  description?: string
  created_at: string
  subscription?: {
    id: string
    status: string
    plan?: { id: string; name: string; type: string } | null
  } | null
}

interface EntriesResponse {
  entries: RevenueEntry[]
  pagination: { total: number }
}

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  color,
}: {
  title: string
  value: string
  sub?: string
  icon: React.ElementType
  color: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  )
}

export default function RevenuePage() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const summaryParams = {
    ...(fromDate && { from: fromDate }),
    ...(toDate && { to: toDate }),
  }

  const { data: summary } = useQuery<RevenueSummary>({
    queryKey: ['revenue-summary', summaryParams],
    queryFn: async () => {
      const res = await api.get('/revenue/summary', { params: summaryParams })
      return res.data.data
    },
  })

  const { data: entries, isLoading } = useQuery<EntriesResponse>({
    queryKey: ['revenue-entries', pagination, typeFilter, statusFilter, fromDate, toDate],
    queryFn: async () => {
      const res = await api.get('/revenue', {
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          ...(typeFilter !== 'all' && { type: typeFilter }),
          ...(statusFilter !== 'all' && { status: statusFilter }),
          ...(fromDate && { from: fromDate }),
          ...(toDate && { to: toDate }),
        },
      })
      return res.data.data
    },
  })

  const columns: ColumnDef<RevenueEntry>[] = [
    {
      header: 'Type',
      cell: ({ row }) => (
        <span className="capitalize text-sm font-medium">
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
        <span className="text-sm font-semibold text-green-700">
          ${row.original.amount?.toFixed(2) ?? '0.00'}
        </span>
      ),
    },
    {
      header: 'Description',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground max-w-xs truncate block">
          {row.original.description || '—'}
        </span>
      ),
    },
    {
      header: 'Plan',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.subscription?.plan?.name ?? '—'}</span>
      ),
    },
    {
      header: 'Date',
      cell: ({ row }) => <span className="text-sm">{formatDate(row.original.created_at)}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Revenue" description="Track platform revenue from subscriptions and jobs" />

      {/* Date range filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">From</label>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-40"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">To</label>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-40"
          />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${summary?.totals.total?.toFixed(2) ?? '0.00'}`}
          icon={DollarSign}
          color="bg-[#0099FF]"
        />
        <StatCard
          title="Subscriptions"
          value={`$${summary?.totals.subscriptions?.toFixed(2) ?? '0.00'}`}
          sub={`${summary?.subscriptions.active_count ?? 0} active of ${summary?.subscriptions.total_created ?? 0} total`}
          icon={CreditCard}
          color="bg-emerald-500"
        />
        <StatCard
          title="Job Payments"
          value={`$${summary?.totals.job_payments?.toFixed(2) ?? '0.00'}`}
          icon={Briefcase}
          color="bg-violet-500"
        />
        <StatCard
          title="Transaction Fees"
          value={`$${summary?.totals.transaction_fees?.toFixed(2) ?? '0.00'}`}
          icon={TrendingUp}
          color="bg-amber-500"
        />
      </div>

      {/* Monthly breakdown */}
      {summary?.monthly_breakdown && summary.monthly_breakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Monthly Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summary.monthly_breakdown.map((row) => (
                <div key={row.month} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-muted-foreground">
                    {new Date(row.month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </span>
                  <span className="text-sm font-semibold text-green-700">${row.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="subscription">Subscription</SelectItem>
            <SelectItem value="job_payment">Job Payment</SelectItem>
            <SelectItem value="transaction_fee">Transaction Fee</SelectItem>
            <SelectItem value="other">Other</SelectItem>
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
        data={entries?.entries ?? []}
        total={entries?.pagination?.total ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />
    </div>
  )
}
