'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

interface Shift {
  id: string
  event_date: string
  day_of_week?: string
  scheduled_start_time?: string
  scheduled_end_time?: string
  actual_start_time?: string
  actual_end_time?: string
  status: string
  end_reason?: string
  end_reason_description?: string
  hours_worked?: number
  notes?: string
  caregiver?: {
    id: string
    first_name: string
    last_name: string
    email: string
  } | null
}

interface JobDetail {
  id: string
  title: string
  status: string
  published: boolean
  overview?: string
  care_seeker?: string
  care_seeker_age?: number
  care_seeker_gender?: string
  location_address?: string
  start_date?: string
  duration?: number
  start_time?: string
  stop_time?: string
  preferred_days?: string[]
  hourly_rate?: number
  total_cost?: number
  created_at: string
  care_type?: { id: string; name: string } | null
  service_types?: { id: string; name: string }[]
  requirements?: { id: string; name: string }[]
  posted_by?: {
    id: string
    first_name: string
    last_name: string
    email: string
  } | null
  shifts: Shift[]
}

const CANCELLABLE_STATUSES = ['draft', 'published', 'in_progress']

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const queryClient = useQueryClient()

  const [forceEndShift, setForceEndShift] = useState<Shift | null>(null)
  const [forceEndReason, setForceEndReason] = useState('')

  const { data: job, isLoading } = useQuery<JobDetail>({
    queryKey: ['job', id],
    queryFn: async () => {
      const res = await api.get(`/jobs/admin/${id}`)
      return res.data.data
    },
  })

  const cancelJobMutation = useMutation({
    mutationFn: async () => {
      await api.patch(`/jobs/admin/${id}/cancel`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['job', id] }),
  })

  const forceEndMutation = useMutation({
    mutationFn: async ({ shiftId, reason }: { shiftId: string; reason: string }) => {
      await api.patch(`/jobs/admin/events/${shiftId}/force-end`, { reason })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] })
      setForceEndShift(null)
      setForceEndReason('')
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0099FF] border-t-transparent" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Job not found.</p>
      </div>
    )
  }

  const canCancel = CANCELLABLE_STATUSES.includes(job.status)

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Job Info Card */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={job.status} />
              {job.published && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Published</span>
              )}
            </div>
          </div>
          {canCancel && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm('Are you sure you want to cancel this job? This will release any held escrow back to the care seeker.')) {
                  cancelJobMutation.mutate()
                }
              }}
              disabled={cancelJobMutation.isPending}
            >
              Cancel Job
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {job.posted_by && (
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Posted By</p>
                  <p className="text-sm font-medium">
                    {`${job.posted_by.first_name || ''} ${job.posted_by.last_name || ''}`.trim() || '—'}
                  </p>
                  <p className="text-xs text-muted-foreground">{job.posted_by.email}</p>
                </div>
              </div>
            )}
            {job.location_address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">{job.location_address}</p>
                </div>
              </div>
            )}
            {job.start_date && (
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="text-sm font-medium">{formatDate(job.start_date)}</p>
                </div>
              </div>
            )}
            {(job.start_time || job.stop_time) && (
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Schedule</p>
                  <p className="text-sm font-medium">
                    {job.start_time} — {job.stop_time}
                    {job.duration ? ` · ${job.duration} weeks` : ''}
                  </p>
                </div>
              </div>
            )}
            {job.hourly_rate !== undefined && (
              <div className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Rate</p>
                  <p className="text-sm font-medium">
                    ${parseFloat(String(job.hourly_rate)).toFixed(2)}/hr
                    {job.total_cost !== undefined ? ` · $${parseFloat(String(job.total_cost)).toFixed(2)} total` : ''}
                  </p>
                </div>
              </div>
            )}
            {job.care_seeker && (
              <div>
                <p className="text-xs text-muted-foreground">Care Recipient</p>
                <p className="text-sm font-medium capitalize">{job.care_seeker}</p>
                {(job.care_seeker_age || job.care_seeker_gender) && (
                  <p className="text-xs text-muted-foreground">
                    {[job.care_seeker_age && `${job.care_seeker_age} yrs`, job.care_seeker_gender].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
            )}
          </div>

          {job.preferred_days && job.preferred_days.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Preferred Days</p>
              <div className="flex flex-wrap gap-1">
                {job.preferred_days.map((d) => (
                  <span key={d} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full capitalize">{d}</span>
                ))}
              </div>
            </div>
          )}

          {job.care_type && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Care Type</p>
              <span className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded-full">{job.care_type.name}</span>
            </div>
          )}

          {job.service_types && job.service_types.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Service Types</p>
              <div className="flex flex-wrap gap-1">
                {job.service_types.map((s) => (
                  <span key={s.id} className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 rounded-full">{s.name}</span>
                ))}
              </div>
            </div>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Requirements</p>
              <div className="flex flex-wrap gap-1">
                {job.requirements.map((r) => (
                  <span key={r.id} className="text-xs bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300 px-2 py-0.5 rounded-full">{r.name}</span>
                ))}
              </div>
            </div>
          )}

          {job.overview && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Overview</p>
              <p className="text-sm text-foreground">{job.overview}</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-right">Posted: {formatDate(job.created_at)}</p>
        </CardContent>
      </Card>

      {/* Shifts Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Shifts ({job.shifts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {job.shifts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No shifts recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="text-left pb-2 pr-4">Date</th>
                    <th className="text-left pb-2 pr-4">Caregiver</th>
                    <th className="text-left pb-2 pr-4">Scheduled</th>
                    <th className="text-left pb-2 pr-4">Actual</th>
                    <th className="text-left pb-2 pr-4">Status</th>
                    <th className="text-right pb-2 pr-4">Hours</th>
                    <th className="text-right pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {job.shifts.map((shift) => (
                    <tr key={shift.id} className="hover:bg-muted/50">
                      <td className="py-3 pr-4">
                        <p className="font-medium">{formatDate(shift.event_date)}</p>
                        {shift.day_of_week && (
                          <p className="text-xs text-muted-foreground capitalize">{shift.day_of_week}</p>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        {shift.caregiver ? (
                          <div>
                            <p className="font-medium">
                              {`${shift.caregiver.first_name || ''} ${shift.caregiver.last_name || ''}`.trim() || '—'}
                            </p>
                            <p className="text-xs text-muted-foreground">{shift.caregiver.email}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {shift.scheduled_start_time && shift.scheduled_end_time
                          ? `${shift.scheduled_start_time} – ${shift.scheduled_end_time}`
                          : '—'}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {shift.actual_start_time
                          ? `${shift.actual_start_time}${shift.actual_end_time ? ` – ${shift.actual_end_time}` : ''}`
                          : '—'}
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={shift.status} />
                        {shift.end_reason_description && (
                          <p className="text-xs text-muted-foreground mt-0.5 max-w-[160px] truncate" title={shift.end_reason_description}>
                            {shift.end_reason_description}
                          </p>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-right">
                        {shift.hours_worked != null ? parseFloat(String(shift.hours_worked)).toFixed(2) : '—'}
                      </td>
                      <td className="py-3 text-right">
                        {shift.status === 'in_progress' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={() => setForceEndShift(shift)}
                          >
                            Force End
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Force End Dialog */}
      <Dialog open={!!forceEndShift} onOpenChange={(open) => { if (!open) { setForceEndShift(null); setForceEndReason('') } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Force End Shift</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will immediately end the shift and refund the escrowed amount back to the care seeker. Provide a reason for the record.
          </p>
          <Textarea
            placeholder="e.g. Caregiver unresponsive for 4+ hours"
            value={forceEndReason}
            onChange={(e) => setForceEndReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setForceEndShift(null); setForceEndReason('') }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!forceEndReason.trim() || forceEndMutation.isPending}
              onClick={() => forceEndShift && forceEndMutation.mutate({ shiftId: forceEndShift.id, reason: forceEndReason })}
            >
              Force End Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
