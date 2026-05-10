'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { type ColumnDef, type PaginationState } from '@tanstack/react-table'
import { DollarSign, TrendingUp, CreditCard, Landmark, Minus } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'
import { formatDate, formatDateTime } from '@/lib/utils'

interface RevenueSummary {
  totals: {
    gross_total: number
    net_total: number
    subscriptions: number
    shift_fees: number
    net_shift_revenue: number
    withdrawal_fees: number
    stripe_fees_paid: number
    other: number
  }
  subscriptions: {
    total_created: number
    active_count: number
  }
  monthly_breakdown: { month: string; amount: number }[]
}

interface ShiftFeeMetadata {
  job_id?: string
  job_event_id?: string
  caregiver_id?: string
  careseeker_id?: string
  fee_percentage?: number
  hours_worked?: number
  scheduled_hours?: number
  caregiver_amount_cents?: number
  customer_amount_cents?: number
  stripe_fee_cents?: number
  net_revenue_cents?: number
}

interface WithdrawalFeeMetadata {
  user_id?: string
  withdrawal_amount?: number
  fee_percentage?: number
}

interface RevenueEntry {
  id: string
  type: string
  status: string
  amount: number
  description?: string | null
  transaction_reference?: string | null
  metadata?: ShiftFeeMetadata & WithdrawalFeeMetadata | null
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

function fmt(n: number | null | undefined): string {
  if (n == null) return '—'
  return `$${n.toFixed(2)}`
}

function fmtCents(n: number | null | undefined): string {
  if (n == null) return '—'
  return `$${(n / 100).toFixed(2)}`
}

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  color,
  muted,
}: {
  title: string
  value: string
  sub?: string
  icon: React.ElementType
  color: string
  muted?: boolean
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`text-sm font-medium ${muted ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
          {title}
        </CardTitle>
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold ${muted ? 'text-muted-foreground' : ''}`}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  )
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b last:border-0">
      <span className="text-xs text-muted-foreground shrink-0 w-36">{label}</span>
      <span className="text-sm font-medium text-right break-all">{value ?? '—'}</span>
    </div>
  )
}

function typeLabel(type: string): string {
  switch (type) {
    case 'transaction_fee': return 'Transaction Fee'
    case 'subscription': return 'Subscription'
    case 'background_check': return 'Background Check'
    case 'other': return 'Other'
    default: return type.replace(/_/g, ' ')
  }
}

export default function RevenuePage() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selected, setSelected] = useState<RevenueEntry | null>(null)

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
        <span className="text-sm font-medium">{typeLabel(row.original.type)}</span>
      ),
    },
    {
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      header: 'Gross',
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-green-700">{fmt(row.original.amount)}</span>
      ),
    },
    {
      header: 'Stripe Fee',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.metadata?.stripe_fee_cents != null
            ? fmtCents(row.original.metadata.stripe_fee_cents)
            : '—'}
        </span>
      ),
    },
    {
      header: 'Net',
      cell: ({ row }) => {
        const meta = row.original.metadata
        if (meta?.net_revenue_cents != null) {
          return <span className="text-sm font-semibold">{fmtCents(meta.net_revenue_cents)}</span>
        }
        // For non-shift entries (subscriptions, withdrawal fees) gross = net
        return <span className="text-sm font-semibold">{fmt(row.original.amount)}</span>
      },
    },
    {
      header: 'Description',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground max-w-[220px] truncate block">
          {row.original.description || (row.original.subscription?.plan?.name ? `Subscription: ${row.original.subscription.plan.name}` : '—')}
        </span>
      ),
    },
    {
      header: 'Date',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{formatDate(row.original.created_at)}</span>
      ),
    },
  ]

  const t = summary?.totals

  return (
    <div className="space-y-6">
      <PageHeader title="Revenue" description="Platform revenue from shift fees, withdrawal fees, and subscriptions" />

      {/* Date range filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">From</label>
          <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-40" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">To</label>
          <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-40" />
        </div>
      </div>

      {/* Primary stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Net Revenue"
          value={fmt(t?.net_total)}
          sub="After Stripe fees"
          icon={DollarSign}
          color="bg-[#0099FF]"
        />
        <StatCard
          title="Subscriptions"
          value={fmt(t?.subscriptions)}
          sub={`${t?.subscriptions != null ? summary?.subscriptions.active_count ?? 0 : 0} active · ${summary?.subscriptions.total_created ?? 0} total`}
          icon={CreditCard}
          color="bg-emerald-500"
        />
        <StatCard
          title="Shift Fees (Net)"
          value={fmt(t?.net_shift_revenue)}
          sub={t?.shift_fees != null ? `Gross ${fmt(t.shift_fees)}` : undefined}
          icon={TrendingUp}
          color="bg-violet-500"
        />
        <StatCard
          title="Withdrawal Fees"
          value={fmt(t?.withdrawal_fees)}
          sub="Instant payout charges"
          icon={Landmark}
          color="bg-amber-500"
        />
      </div>

      {/* Stripe fees deducted — secondary info */}
      {t && t.stripe_fees_paid > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-200 px-4 py-3 text-sm text-muted-foreground">
          <Minus className="h-4 w-4 text-red-400 shrink-0" />
          <span>
            <span className="font-medium text-foreground">{fmt(t.stripe_fees_paid)}</span> paid to Stripe in processing fees on shift charges
            {' '}(gross shift fees {fmt(t.shift_fees)} → net {fmt(t.net_shift_revenue)})
          </span>
        </div>
      )}

      {/* Monthly breakdown */}
      {summary?.monthly_breakdown && summary.monthly_breakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Monthly Breakdown (Gross)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summary.monthly_breakdown.map((row) => (
                <div key={row.month} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-muted-foreground">
                    {new Date(row.month + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </span>
                  <span className="text-sm font-semibold text-green-700">{fmt(row.amount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="subscription">Subscription</SelectItem>
            <SelectItem value="transaction_fee">Transaction Fee</SelectItem>
            <SelectItem value="background_check">Background Check</SelectItem>
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
            <SelectItem value="refunded">Refunded</SelectItem>
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
        onRowClick={(row) => setSelected(row)}
      />

      {/* Revenue Entry Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null) }}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Revenue Entry</SheetTitle>
            <SheetDescription>
              {selected ? typeLabel(selected.type) : ''} · {selected?.created_at ? formatDateTime(selected.created_at) : ''}
            </SheetDescription>
          </SheetHeader>

          {selected && (
            <div className="p-6 space-y-1">
              <DetailRow label="ID" value={<span className="font-mono text-xs">{selected.id}</span>} />
              <DetailRow label="Type" value={typeLabel(selected.type)} />
              <DetailRow label="Status" value={<StatusBadge status={selected.status} />} />
              <DetailRow label="Gross Amount" value={fmt(selected.amount)} />

              {/* Shift fee breakdown */}
              {selected.metadata?.stripe_fee_cents != null && (
                <>
                  <DetailRow
                    label="Stripe Fee"
                    value={<span className="text-red-500">−{fmtCents(selected.metadata.stripe_fee_cents)}</span>}
                  />
                  <DetailRow
                    label="Net Revenue"
                    value={<span className="text-green-700 font-semibold">{fmtCents(selected.metadata.net_revenue_cents)}</span>}
                  />
                </>
              )}

              {selected.description && (
                <DetailRow label="Description" value={selected.description} />
              )}

              {/* Subscription plan */}
              {selected.subscription?.plan && (
                <DetailRow label="Plan" value={selected.subscription.plan.name} />
              )}

              {/* Shift-specific metadata */}
              {selected.metadata?.job_id && (
                <>
                  <DetailRow label="Fee %" value={selected.metadata.fee_percentage != null ? `${selected.metadata.fee_percentage}%` : null} />
                  <DetailRow label="Scheduled Hours" value={selected.metadata.scheduled_hours?.toFixed(2)} />
                  <DetailRow label="Hours Worked" value={selected.metadata.hours_worked?.toFixed(2)} />
                  <DetailRow
                    label="Caregiver Paid"
                    value={fmtCents(selected.metadata.caregiver_amount_cents)}
                  />
                  <DetailRow
                    label="Customer Charged"
                    value={fmtCents(selected.metadata.customer_amount_cents)}
                  />
                </>
              )}

              {/* Withdrawal fee metadata */}
              {selected.metadata?.withdrawal_amount && (
                <>
                  <DetailRow label="Withdrawal Amt" value={fmtCents(selected.metadata.withdrawal_amount)} />
                  <DetailRow label="Fee %" value={selected.metadata.fee_percentage != null ? `${selected.metadata.fee_percentage}%` : null} />
                </>
              )}

              {selected.transaction_reference && (
                <DetailRow
                  label="Reference"
                  value={<span className="font-mono text-xs">{selected.transaction_reference}</span>}
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
