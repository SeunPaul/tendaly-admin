'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Mail,
  Calendar,
  Shield,
  FileText,
  X,
  ZoomIn,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import api from '@/lib/api'
import { formatDate, formatDateTime } from '@/lib/utils'

interface KycDetail {
  id: string
  user_id: string
  user_name: string
  user_email: string
  overall_status: string
  identity: {
    status: string
    stripe_session_id: string | null
    document_type: string | null
    rejection_reason: string | null
  }
  work_authorization: {
    status: string
    type: string | null
    document_front: string | null
    document_back: string | null
    rejection_reason: string | null
    reviewed_by: string | null
    reviewed_at: string | null
  }
  background_check: {
    status: string
    allow_background_check: boolean
    checkr_candidate_id: string | null
    checkr_report_id: string | null
    checkr_report_status: string | null
  }
  created_at: string
  modified_at: string
}

function isPdf(url: string) {
  return /\.pdf($|\?)/i.test(url)
}

function DocumentFile({ url, label }: { url: string; label: string }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const pdf = isPdf(url)

  return (
    <>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        {pdf ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors text-muted-foreground hover:text-gray-700"
            style={{ width: 200, height: 130 }}
          >
            <FileText className="h-8 w-8" />
            <span className="text-xs font-medium">View PDF</span>
          </a>
        ) : (
          <div
            className="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
            style={{ width: 200, height: 130 }}
            onClick={() => setLightboxOpen(true)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        )}
      </div>

      {/* Lightbox (images only) */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={label}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}

export default function KycDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const queryClient = useQueryClient()

  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean
    approved: boolean
    rejectionReason: string
  }>({ open: false, approved: true, rejectionReason: '' })

  const { data: kyc, isLoading } = useQuery<KycDetail>({
    queryKey: ['kyc', id],
    queryFn: async () => {
      const res = await api.get(`/kyc/admin/${id}`)
      return res.data.data
    },
  })

  const workAuthMutation = useMutation({
    mutationFn: async ({ approved, rejection_reason }: { approved: boolean; rejection_reason?: string }) => {
      await api.post(`/kyc/admin/${id}/review-work-auth`, { approved, rejection_reason })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc', id] })
      queryClient.invalidateQueries({ queryKey: ['kyc'] })
      setReviewDialog({ open: false, approved: true, rejectionReason: '' })
    },
  })

  const openReviewDialog = (approved: boolean) => {
    setReviewDialog({ open: true, approved, rejectionReason: '' })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0099FF] border-t-transparent" />
      </div>
    )
  }

  if (!kyc) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">KYC record not found.</p>
      </div>
    )
  }

  const workAuth = kyc.work_authorization
  const hasDocuments = workAuth.document_front || workAuth.document_back

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-xl">{kyc.user_name || '(No name)'}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={kyc.overall_status} />
              <span className="text-xs text-muted-foreground">Overall KYC Status</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <dt className="text-xs text-muted-foreground">Email</dt>
                <dd className="text-sm font-medium">{kyc.user_email}</dd>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <dt className="text-xs text-muted-foreground">Last Updated</dt>
                <dd className="text-sm font-medium">{formatDateTime(kyc.modified_at)}</dd>
              </div>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Identity Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#0099FF]" />
            Identity Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <StatusBadge status={kyc.identity.status} />
          </div>
          {kyc.identity.document_type && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Document Type</span>
              <span className="text-sm font-medium capitalize">{kyc.identity.document_type.replace(/_/g, ' ')}</span>
            </div>
          )}
          {kyc.identity.stripe_session_id && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Stripe Session</span>
              <span className="text-xs font-mono text-muted-foreground">{kyc.identity.stripe_session_id}</span>
            </div>
          )}
          {kyc.identity.rejection_reason && (
            <div className="rounded-lg bg-red-50 border border-red-100 p-3">
              <p className="text-xs text-red-600 font-medium mb-1">Rejection Reason</p>
              <p className="text-sm text-red-700">{kyc.identity.rejection_reason}</p>
            </div>
          )}
          {kyc.identity.status === 'not_submitted' && (
            <p className="text-sm text-muted-foreground italic">No identity verification submitted yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Work Authorization */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#0099FF]" />
              Work Authorization
            </CardTitle>
            <StatusBadge status={workAuth.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {workAuth.type && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Document Type</span>
              <span className="text-sm font-medium capitalize">{workAuth.type.replace(/_/g, ' ')}</span>
            </div>
          )}

          {/* Document Images */}
          {hasDocuments && (
            <div>
              <p className="text-sm font-medium mb-3">Uploaded Documents</p>
              <div className="flex flex-wrap gap-4">
                {workAuth.document_front && (
                  <DocumentFile url={workAuth.document_front} label="Front" />
                )}
                {workAuth.document_back && (
                  <DocumentFile url={workAuth.document_back} label="Back" />
                )}
              </div>
            </div>
          )}

          {workAuth.rejection_reason && (
            <div className="rounded-lg bg-red-50 border border-red-100 p-3">
              <p className="text-xs text-red-600 font-medium mb-1">Rejection Reason</p>
              <p className="text-sm text-red-700">{workAuth.rejection_reason}</p>
            </div>
          )}

          {workAuth.reviewed_by && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Reviewed at {workAuth.reviewed_at ? formatDateTime(workAuth.reviewed_at) : '—'}</span>
            </div>
          )}

          {workAuth.status === 'not_submitted' && (
            <p className="text-sm text-muted-foreground italic">No work authorization documents submitted yet.</p>
          )}

          {/* Action Buttons */}
          {workAuth.status === 'pending' && (
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => openReviewDialog(true)}
                disabled={workAuthMutation.isPending}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => openReviewDialog(false)}
                disabled={workAuthMutation.isPending}
              >
                Reject
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Background Check */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#0099FF]" />
            Background Check
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <StatusBadge status={kyc.background_check.status} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Consent Given</span>
            <span className="text-sm font-medium">
              {kyc.background_check.allow_background_check ? 'Yes' : 'No'}
            </span>
          </div>
          {kyc.background_check.checkr_report_status && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Checkr Report</span>
              <span className="text-sm font-medium capitalize">
                {kyc.background_check.checkr_report_status.replace(/_/g, ' ')}
              </span>
            </div>
          )}
          {kyc.background_check.status === 'not_submitted' && (
            <p className="text-sm text-muted-foreground italic">No background check initiated yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Work Auth Review Dialog */}
      <Dialog
        open={reviewDialog.open}
        onOpenChange={(open) => !open && setReviewDialog((s) => ({ ...s, open: false }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewDialog.approved ? 'Approve' : 'Reject'} Work Authorization
            </DialogTitle>
          </DialogHeader>

          {reviewDialog.approved ? (
            <p className="text-sm text-muted-foreground">
              Are you sure you want to approve the work authorization for{' '}
              <span className="font-medium text-gray-900">{kyc.user_name}</span>? This will
              notify the user and update their KYC status.
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Provide a reason for rejecting the work authorization. The user will be notified.
              </p>
              <Textarea
                placeholder="e.g. Document is expired, image is too blurry..."
                value={reviewDialog.rejectionReason}
                onChange={(e) =>
                  setReviewDialog((s) => ({ ...s, rejectionReason: e.target.value }))
                }
                rows={3}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialog((s) => ({ ...s, open: false }))}
            >
              Cancel
            </Button>
            <Button
              variant={reviewDialog.approved ? 'default' : 'destructive'}
              onClick={() =>
                workAuthMutation.mutate({
                  approved: reviewDialog.approved,
                  rejection_reason: reviewDialog.approved
                    ? undefined
                    : reviewDialog.rejectionReason,
                })
              }
              disabled={
                workAuthMutation.isPending ||
                (!reviewDialog.approved && !reviewDialog.rejectionReason.trim())
              }
            >
              {workAuthMutation.isPending
                ? 'Processing...'
                : reviewDialog.approved
                  ? 'Approve'
                  : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
