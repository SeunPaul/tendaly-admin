'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef, type PaginationState } from '@tanstack/react-table'
import { Plus, MoreHorizontal, BarChart2 } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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

interface Voucher {
  id: string
  code: string
  access_duration_months: number
  max_redemptions: number | null
  redeemed_count: number
  expires_at: string | null
  is_active: boolean
  description: string | null
  created_at: string
}

interface VoucherStats {
  voucher: Voucher
  redemptions: {
    id: string
    redeemed_at: string
    user: { id: string; email: string; first_name: string; last_name: string }
  }[]
  total_redemptions: number
}

interface ApiResponse {
  vouchers: Voucher[]
  pagination: { total: number }
}

const defaultForm = {
  code: '',
  access_duration_months: 1,
  max_redemptions: '',
  expires_at: '',
  description: '',
}

export default function VouchersPage() {
  const queryClient = useQueryClient()
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [statsVoucherId, setStatsVoucherId] = useState<string | null>(null)

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ['vouchers', pagination],
    queryFn: async () => {
      const res = await api.get('/vouchers', {
        params: { page: pagination.pageIndex + 1, limit: pagination.pageSize },
      })
      return res.data.data
    },
  })

  const { data: stats } = useQuery<VoucherStats>({
    queryKey: ['voucher-stats', statsVoucherId],
    queryFn: async () => {
      const res = await api.get(`/vouchers/${statsVoucherId}/stats`)
      return res.data.data
    },
    enabled: !!statsVoucherId,
  })

  const createMutation = useMutation({
    mutationFn: async (body: typeof defaultForm) => {
      await api.post('/vouchers', {
        code: body.code.toUpperCase(),
        access_duration_months: Number(body.access_duration_months),
        ...(body.max_redemptions && { max_redemptions: Number(body.max_redemptions) }),
        ...(body.expires_at && { expires_at: body.expires_at }),
        ...(body.description && { description: body.description }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] })
      setCreateOpen(false)
      setForm(defaultForm)
    },
  })

  const deactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/vouchers/${id}/deactivate`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vouchers'] }),
  })

  const columns: ColumnDef<Voucher>[] = [
    {
      header: 'Code',
      cell: ({ row }) => (
        <span className="font-mono font-semibold text-sm">{row.original.code}</span>
      ),
    },
    {
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge status={row.original.is_active ? 'active' : 'inactive'} />
      ),
    },
    {
      header: 'Duration',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.access_duration_months} month{row.original.access_duration_months !== 1 ? 's' : ''}</span>
      ),
    },
    {
      header: 'Redemptions',
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.redeemed_count}
          {row.original.max_redemptions !== null ? ` / ${row.original.max_redemptions}` : ''}
        </span>
      ),
    },
    {
      header: 'Expires',
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.expires_at ? formatDate(row.original.expires_at) : 'Never'}
        </span>
      ),
    },
    {
      header: 'Created',
      cell: ({ row }) => <span className="text-sm">{formatDate(row.original.created_at)}</span>,
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
            <DropdownMenuItem onClick={() => setStatsVoucherId(row.original.id)}>
              <BarChart2 className="h-4 w-4 mr-2" />
              View Redemptions
            </DropdownMenuItem>
            {row.original.is_active && (
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => deactivateMutation.mutate(row.original.id)}
              >
                Deactivate
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Vouchers" description="Create and manage caregiver access vouchers" />
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Voucher
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.vouchers ?? []}
        total={data?.pagination?.total ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />

      {/* Create Voucher Dialog */}
      <Dialog open={createOpen} onOpenChange={(open) => { if (!open) { setCreateOpen(false); setForm(defaultForm) } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Voucher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Code *</label>
              <Input
                placeholder="e.g. WELCOME2024"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Access Duration (months) *</label>
              <Input
                type="number"
                min={1}
                value={form.access_duration_months}
                onChange={(e) => setForm({ ...form, access_duration_months: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Max Redemptions (leave blank for unlimited)</label>
              <Input
                type="number"
                min={1}
                placeholder="Unlimited"
                value={form.max_redemptions}
                onChange={(e) => setForm({ ...form, max_redemptions: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Expiry Date (optional)</label>
              <Input
                type="date"
                value={form.expires_at}
                onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description (optional)</label>
              <Input
                placeholder="e.g. Launch promo for early caregivers"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateOpen(false); setForm(defaultForm) }}>
              Cancel
            </Button>
            <Button
              onClick={() => createMutation.mutate(form)}
              disabled={!form.code || !form.access_duration_months || createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Voucher'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats / Redemptions Dialog */}
      <Dialog open={!!statsVoucherId} onOpenChange={(open) => !open && setStatsVoucherId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Redemptions — <span className="font-mono">{stats?.voucher.code}</span>
            </DialogTitle>
          </DialogHeader>
          {stats ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <Card className="shadow-none border">
                  <CardHeader className="pb-1 pt-3 px-3">
                    <CardTitle className="text-xs text-muted-foreground">Duration</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <p className="text-lg font-bold">{stats.voucher.access_duration_months}mo</p>
                  </CardContent>
                </Card>
                <Card className="shadow-none border">
                  <CardHeader className="pb-1 pt-3 px-3">
                    <CardTitle className="text-xs text-muted-foreground">Redeemed</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <p className="text-lg font-bold">{stats.total_redemptions}</p>
                  </CardContent>
                </Card>
                <Card className="shadow-none border">
                  <CardHeader className="pb-1 pt-3 px-3">
                    <CardTitle className="text-xs text-muted-foreground">Status</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <StatusBadge status={stats.voucher.is_active ? 'active' : 'inactive'} />
                  </CardContent>
                </Card>
              </div>
              {stats.redemptions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No redemptions yet.</p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {stats.redemptions.map((r) => (
                    <div key={r.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                      <div>
                        <p className="text-sm font-medium">
                          {r.user.first_name} {r.user.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{r.user.email}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(r.redeemed_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">Loading...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
