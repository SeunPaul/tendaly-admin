'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef, type PaginationState } from '@tanstack/react-table'
import { Star, Eye, EyeOff } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import { formatDate, truncate } from '@/lib/utils'

interface Review {
  id: string
  rating: number
  comment?: string
  is_visible: boolean
  created_at: string
  care_seeker?: {
    id: string
    first_name: string
    last_name: string
  }
  caregiver?: {
    id: string
  }
}

interface ApiResponse {
  reviews: Review[]
  pagination: { total: number }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{rating}/5</span>
    </div>
  )
}

export default function ReviewsPage() {
  const queryClient = useQueryClient()
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 })

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ['reviews', pagination],
    queryFn: async () => {
      const res = await api.get('/reviews/admin/all', {
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
        },
      })
      return res.data.data
    },
  })

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, visible }: { id: string; visible: boolean }) => {
      if (visible) {
        await api.patch(`/reviews/admin/${id}/unhide`)
      } else {
        await api.patch(`/reviews/admin/${id}/hide`)
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews'] }),
  })

  const columns: ColumnDef<Review>[] = [
    {
      header: 'Care Seeker',
      cell: ({ row }) => {
        const cs = row.original.care_seeker
        return (
          <span className="text-sm text-gray-700">
            {cs ? `${cs.first_name || ''} ${cs.last_name || ''}`.trim() || '—' : '—'}
          </span>
        )
      },
    },
    {
      header: 'Rating',
      cell: ({ row }) => <StarRating rating={row.original.rating} />,
    },
    {
      header: 'Comment',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {row.original.comment ? truncate(row.original.comment, 60) : <span className="text-muted-foreground italic">No comment</span>}
        </span>
      ),
    },
    {
      header: 'Visibility',
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium ${row.original.is_visible ? 'text-green-600' : 'text-gray-400'}`}
        >
          {row.original.is_visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          {row.original.is_visible ? 'Visible' : 'Hidden'}
        </span>
      ),
    },
    {
      header: 'Date',
      cell: ({ row }) => <span className="text-sm">{formatDate(row.original.created_at)}</span>,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            toggleVisibilityMutation.mutate({
              id: row.original.id,
              visible: !row.original.is_visible,
            })
          }
          disabled={toggleVisibilityMutation.isPending}
          className="text-xs"
        >
          {row.original.is_visible ? (
            <>
              <EyeOff className="h-3.5 w-3.5" /> Hide
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" /> Show
            </>
          )}
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Reviews" description="Moderate caregiver reviews" />

      <DataTable
        columns={columns}
        data={data?.reviews ?? []}
        total={data?.pagination?.total ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />
    </div>
  )
}
