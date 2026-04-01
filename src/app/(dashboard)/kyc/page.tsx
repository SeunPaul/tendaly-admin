'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { type ColumnDef, type PaginationState } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

interface KycRecord {
  id: string
  user_id: string
  user_name: string
  user_email: string
  overall_status: string
  identity_status: string
  work_authorization_status: string
  background_check_status: string
  modified_at: string
}

interface ApiResponse {
  records: KycRecord[]
  total: number
}

interface ReviewModalState {
  open: boolean
  userId: string | null
  approved: boolean
}

export default function KycPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [modal, setModal] = useState<ReviewModalState>({ open: false, userId: null, approved: true })

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ['kyc', pagination, statusFilter],
    queryFn: async () => {
      const res = await api.get('/kyc/admin', {
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          ...(statusFilter !== 'all' && { status: statusFilter }),
        },
      })
      return res.data.data
    },
  })

  const reviewMutation = useMutation({
    mutationFn: async ({ userId, approved }: { userId: string; approved: boolean }) => {
      await api.post(`/kyc/admin/${userId}/review-work-auth`, { approved })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc'] })
      setModal({ open: false, userId: null, approved: true })
    },
  })

  const openModal = (userId: string, approved: boolean) => {
    setModal({ open: true, userId, approved })
  }

  const columns: ColumnDef<KycRecord>[] = [
    {
      header: 'User',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-900">{row.original.user_name || '—'}</p>
          <p className="text-xs text-muted-foreground">{row.original.user_email}</p>
        </div>
      ),
    },
    {
      header: 'Identity',
      cell: ({ row }) => <StatusBadge status={row.original.identity_status} />,
    },
    {
      header: 'Work Auth',
      cell: ({ row }) => <StatusBadge status={row.original.work_authorization_status} />,
    },
    {
      header: 'Background Check',
      cell: ({ row }) => <StatusBadge status={row.original.background_check_status} />,
    },
    {
      header: 'Overall',
      cell: ({ row }) => <StatusBadge status={row.original.overall_status} />,
    },
    {
      header: 'Last Updated',
      cell: ({ row }) => <span className="text-sm">{formatDate(row.original.modified_at)}</span>,
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
            <DropdownMenuItem onClick={() => router.push(`/kyc/${row.original.user_id}`)}>
              View Details
            </DropdownMenuItem>
            {row.original.work_authorization_status === 'pending' && (
              <>
                <DropdownMenuItem
                  className="text-green-600"
                  onClick={() => openModal(row.original.user_id, true)}
                >
                  Approve Work Auth
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => openModal(row.original.user_id, false)}
                >
                  Reject Work Auth
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="KYC" description="Review and manage KYC verifications" />

      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Filter by overall status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="incomplete">Incomplete</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.records ?? []}
        total={data?.total ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />

      {/* Confirm modal */}
      <Dialog open={modal.open} onOpenChange={(open) => !open && setModal((m) => ({ ...m, open: false }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modal.approved ? 'Approve' : 'Reject'} Work Authorization
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to {modal.approved ? 'approve' : 'reject'} this work authorization?
            This action will update the KYC status and notify the user.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModal((m) => ({ ...m, open: false }))}>
              Cancel
            </Button>
            <Button
              variant={modal.approved ? 'default' : 'destructive'}
              onClick={() =>
                modal.userId &&
                reviewMutation.mutate({ userId: modal.userId, approved: modal.approved })
              }
              disabled={reviewMutation.isPending}
            >
              {reviewMutation.isPending ? 'Processing...' : `Yes, ${modal.approved ? 'Approve' : 'Reject'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
