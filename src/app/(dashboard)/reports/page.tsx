'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { type ColumnDef, type PaginationState } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

const REASON_LABELS: Record<string, string> = {
  harassment: 'Harassment',
  hate_speech: 'Hate Speech',
  sexual_content: 'Sexual Content',
  threats: 'Threats',
  scam: 'Scam',
  sharing_private_info: 'Sharing Private Info',
  unsafe_care_behavior: 'Unsafe Care Behavior',
  other: 'Other',
}

interface Report {
  id: string
  reason: string
  status: string
  priority: string
  decision: string | null
  created_at: string
  reporter: { id: string; first_name: string; last_name: string; email: string } | null
  reported_user: { id: string; first_name: string; last_name: string; email: string } | null
}

interface ApiResponse {
  reports: Report[]
  total: number
  page: number
  limit: number
  total_pages: number
}

const ALL = 'all'

export default function ReportsPage() {
  const router = useRouter()
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const [statusFilter, setStatusFilter] = useState<string>(ALL)
  const [priorityFilter, setPriorityFilter] = useState<string>(ALL)

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ['reports', pagination, statusFilter, priorityFilter],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }
      if (statusFilter !== ALL) params.status = statusFilter
      if (priorityFilter !== ALL) params.priority = priorityFilter
      const res = await api.get('/admin/reports', { params })
      return res.data.data
    },
  })

  const columns: ColumnDef<Report>[] = [
    {
      header: 'Reporter',
      cell: ({ row }) => {
        const r = row.original.reporter
        return r ? (
          <div>
            <p className="font-medium text-sm">{r.first_name} {r.last_name}</p>
            <p className="text-xs text-muted-foreground">{r.email}</p>
          </div>
        ) : <span className="text-muted-foreground text-xs">—</span>
      },
    },
    {
      header: 'Reported User',
      cell: ({ row }) => {
        const u = row.original.reported_user
        return u ? (
          <div>
            <p className="font-medium text-sm">{u.first_name} {u.last_name}</p>
            <p className="text-xs text-muted-foreground">{u.email}</p>
          </div>
        ) : <span className="text-muted-foreground text-xs">—</span>
      },
    },
    {
      header: 'Reason',
      cell: ({ row }) => (
        <span className="text-sm">{REASON_LABELS[row.original.reason] ?? row.original.reason}</span>
      ),
    },
    {
      header: 'Priority',
      cell: ({ row }) => <StatusBadge status={row.original.priority} />,
    },
    {
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      header: 'Decision',
      cell: ({ row }) => row.original.decision
        ? <StatusBadge status={row.original.decision} />
        : <span className="text-xs text-muted-foreground">Pending</span>,
    },
    {
      header: 'Submitted',
      cell: ({ row }) => <span className="text-sm">{formatDate(row.original.created_at)}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Review and action user-submitted reports"
      />

      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.reports ?? []}
        total={data?.total ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        onRowClick={(row) => router.push(`/reports/${row.id}`)}
      />
    </div>
  )
}
