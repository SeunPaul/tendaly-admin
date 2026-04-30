'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { type ColumnDef, type PaginationState } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

interface Job {
  id: string
  title: string
  status: string
  hourly_rate?: number
  created_at: string
  scheduled_start?: string | null
  scheduled_end?: string | null
  care_type?: { id: string; name: string } | null
  posted_by?: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
}

interface ApiResponse {
  jobs: Job[]
  pagination: { total: number }
}

export default function JobsPage() {
  const router = useRouter()
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ['jobs', pagination, statusFilter],
    queryFn: async () => {
      const res = await api.get('/jobs/admin/all', {
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          ...(statusFilter !== 'all' && { status: statusFilter }),
        },
      })
      return res.data.data
    },
  })

  const columns: ColumnDef<Job>[] = [
    {
      header: 'Title',
      cell: ({ row }) => (
        <p className="font-medium text-foreground cursor-pointer hover:text-[#0099FF]" onClick={() => router.push(`/jobs/${row.original.id}`)}>{row.original.title}</p>
      ),
    },
    {
      header: 'Posted By',
      cell: ({ row }) => {
        const p = row.original.posted_by
        return (
          <div>
            <p className="text-sm text-gray-700">
              {p ? `${p.first_name || ''} ${p.last_name || ''}`.trim() || '—' : '—'}
            </p>
            <p className="text-xs text-muted-foreground">{p?.email}</p>
          </div>
        )
      },
    },
    {
      header: 'Care Type',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.care_type?.name ?? '—'}</span>
      ),
    },
    {
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      header: 'Rate',
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.hourly_rate ? `$${parseFloat(String(row.original.hourly_rate)).toFixed(2)}/hr` : '—'}
        </span>
      ),
    },
    {
      header: 'Posted',
      cell: ({ row }) => <span className="text-sm">{formatDate(row.original.created_at)}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Jobs" description="View all posted jobs" />

      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.jobs ?? []}
        total={data?.pagination?.total ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />
    </div>
  )
}
