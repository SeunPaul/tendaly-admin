'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, User, MessageSquare, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import api from '@/lib/api'
import { formatDateTime } from '@/lib/utils'

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

const DECISION_OPTIONS = [
  { value: 'no_violation', label: 'No Violation' },
  { value: 'warning', label: 'Warning' },
  { value: 'content_removed', label: 'Content Removed' },
  { value: 'messaging_restricted', label: 'Messaging Restricted' },
  { value: 'temp_suspended', label: 'Temp Suspended' },
  { value: 'perm_deactivated', label: 'Permanently Deactivated' },
  { value: 'escalated', label: 'Escalated' },
]

interface ReportDetail {
  id: string
  reason: string
  description: string | null
  message_id: string | null
  conversation_id: string | null
  status: string
  priority: string
  decision: string | null
  decision_rationale: string | null
  reviewer_id: string | null
  reviewed_at: string | null
  created_at: string
  prior_resolved_reports: number
  reporter: { id: string; first_name: string; last_name: string; email: string } | null
  reported_user: { id: string; first_name: string; last_name: string; email: string } | null
}

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [showDialog, setShowDialog] = useState(false)
  const [decision, setDecision] = useState('')
  const [rationale, setRationale] = useState('')

  const { data, isLoading } = useQuery<{ success: boolean; data: ReportDetail }>({
    queryKey: ['report', id],
    queryFn: () => api.get(`/admin/reports/${id}`).then((r) => r.data),
  })

  const resolveMutation = useMutation({
    mutationFn: () =>
      api.patch(`/admin/reports/${id}/decision`, {
        decision,
        decision_rationale: rationale || undefined,
        status: 'resolved',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report', id] })
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      setShowDialog(false)
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0099FF] border-t-transparent" />
      </div>
    )
  }

  const report = data?.data
  if (!report) return null

  const isResolved = report.status === 'resolved' || report.status === 'dismissed'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Report Detail</h1>
          <p className="text-muted-foreground text-sm">#{report.id.slice(0, 8)}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={report.priority} />
          <StatusBadge status={report.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main report info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Report Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Reason</p>
                  <p className="font-medium">{REASON_LABELS[report.reason] ?? report.reason}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Submitted</p>
                  <p className="font-medium">{formatDateTime(report.created_at)}</p>
                </div>
              </div>

              {report.description && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Description</p>
                  <p className="text-sm bg-muted rounded-md p-3">{report.description}</p>
                </div>
              )}

              {(report.conversation_id || report.message_id) && (
                <div className="grid grid-cols-2 gap-4">
                  {report.conversation_id && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Conversation ID</p>
                      <p className="text-xs font-mono">{report.conversation_id}</p>
                    </div>
                  )}
                  {report.message_id && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Message ID</p>
                      <p className="text-xs font-mono">{report.message_id}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prior history */}
          {report.prior_resolved_reports > 0 && (
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="pt-4">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                  ⚠ The reported user has {report.prior_resolved_reports} prior resolved report(s) on record.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Decision card */}
          {isResolved ? (
            <Card>
              <CardHeader>
                <CardTitle>Moderation Decision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <StatusBadge status={report.decision ?? 'pending'} />
                  {report.reviewed_at && (
                    <span className="text-xs text-muted-foreground">
                      Reviewed {formatDateTime(report.reviewed_at)}
                    </span>
                  )}
                </div>
                {report.decision_rationale && (
                  <p className="text-sm bg-muted rounded-md p-3">{report.decision_rationale}</p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Take Action</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowDialog(true)} className="bg-[#0099FF] hover:bg-[#007acc] text-white">
                  Resolve Report
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar: reporter + reported user */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                Reporter
              </CardTitle>
            </CardHeader>
            <CardContent>
              {report.reporter ? (
                <div>
                  <p className="font-medium">{report.reporter.first_name} {report.reporter.last_name}</p>
                  <p className="text-xs text-muted-foreground">{report.reporter.email}</p>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Unknown</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4" />
                Reported User
              </CardTitle>
            </CardHeader>
            <CardContent>
              {report.reported_user ? (
                <div>
                  <p className="font-medium">{report.reported_user.first_name} {report.reported_user.last_name}</p>
                  <p className="text-xs text-muted-foreground">{report.reported_user.email}</p>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Unknown</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resolve dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Report</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Decision</label>
              <Select value={decision} onValueChange={setDecision}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a decision..." />
                </SelectTrigger>
                <SelectContent>
                  {DECISION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Rationale <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Textarea
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="Describe the reasoning behind your decision..."
                rows={4}
              />
            </div>

            {(decision === 'temp_suspended' || decision === 'perm_deactivated') && (
              <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 rounded p-2">
                ⚠ This action will immediately suspend the reported user
                {decision === 'perm_deactivated' ? ' and mark their account as deleted' : ''}.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              disabled={!decision || resolveMutation.isPending}
              onClick={() => resolveMutation.mutate()}
              className="bg-[#0099FF] hover:bg-[#007acc] text-white"
            >
              {resolveMutation.isPending ? 'Saving…' : 'Submit Decision'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
