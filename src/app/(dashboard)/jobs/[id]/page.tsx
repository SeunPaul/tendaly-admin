'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Calendar, DollarSign, User, Globe } from 'lucide-react'
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

// Format a date portion of an ISO timestamp in a given IANA timezone
function fmtDate(iso: string, tz: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return formatDate(iso)
  }
}

// Format the time portion of an ISO timestamp in a given IANA timezone
function fmtTime(iso: string, tz: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

interface Event {
  id: string
  scheduled_start: string
  scheduled_end: string
  actual_start?: string | null
  actual_end?: string | null
  status: string
  end_reason?: string | null
  end_reason_description?: string | null
  hours_worked?: number | null
  amount_earned?: number | null
  notes?: string | null
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
  overview?: string
  care_seeker?: string
  care_seeker_age?: number
  care_seeker_gender?: string
  location_address?: string
  hourly_rate?: number
  timezone?: string
  created_at: string
  scheduled_start?: string | null
  scheduled_end?: string | null
  care_type?: { id: string; name: string } | null
  service_types?: { id: string; name: string }[]
  requirements?: { id: string; name: string }[]
  posted_by?: {
    id: string
    first_name: string
    last_name: string
    email: string
  } | null
  events: Event[]
}

const CANCELLABLE_STATUSES = ['draft', 'published', 'in_progress']

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const queryClient = useQueryClient()

  const [forceEndEvent, setForceEndEvent] = useState<Event | null>(null)
  const [forceEndReason, setForceEndReason] = useState('')
  const [tzMode, setTzMode] = useState<'local' | 'utc'>('local')

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
    mutationFn: async ({ eventId, reason }: { eventId: string; reason: string }) => {
      await api.patch(`/jobs/admin/events/${eventId}/force-end`, { reason })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] })
      setForceEndEvent(null)
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
  const displayTz = tzMode === 'local' && job.timezone ? job.timezone : 'UTC'

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
            </div>
          </div>
          {canCancel && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm('Are you sure you want to cancel this job? This will release any held payment authorizations.')) {
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
            {(job.scheduled_start || job.scheduled_end) && (
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Schedule</p>
                  <p className="text-sm font-medium">
                    {job.scheduled_start ? fmtDate(job.scheduled_start, job.timezone ?? 'UTC') : '—'}
                    {job.scheduled_end
                      ? ` – ${fmtDate(job.scheduled_end, job.timezone ?? 'UTC')}`
                      : ''}
                  </p>
                </div>
              </div>
            )}
            {job.timezone && (
              <div className="flex items-start gap-2">
                <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Timezone</p>
                  <p className="text-sm font-medium">{job.timezone}</p>
                </div>
              </div>
            )}
            {job.hourly_rate !== undefined && (
              <div className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Rate</p>
                  <p className="text-sm font-medium">${parseFloat(String(job.hourly_rate)).toFixed(2)}/hr</p>
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

      {/* Events Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Events ({job.events.length})</CardTitle>
            {job.timezone && job.events.length > 0 && (
              <div className="flex items-center gap-1 rounded-md border p-0.5 text-xs">
                <button
                  className={`px-2 py-1 rounded transition-colors ${
                    tzMode === 'local'
                      ? 'bg-foreground text-background font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setTzMode('local')}
                >
                  Local
                </button>
                <button
                  className={`px-2 py-1 rounded transition-colors ${
                    tzMode === 'utc'
                      ? 'bg-foreground text-background font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setTzMode('utc')}
                >
                  UTC
                </button>
              </div>
            )}
          </div>
          {job.timezone && job.events.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {tzMode === 'local'
                ? `Showing times in job timezone: ${job.timezone}`
                : 'Showing times in UTC'}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {job.events.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No events recorded yet.</p>
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
                    <th className="text-right pb-2 pr-4">Earned</th>
                    <th className="text-right pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {job.events.map((event) => (
                    <tr key={event.id} className="hover:bg-muted/50">
                      <td className="py-3 pr-4">
                        <p className="font-medium">{fmtDate(event.scheduled_start, displayTz)}</p>
                      </td>
                      <td className="py-3 pr-4">
                        {event.caregiver ? (
                          <div>
                            <p className="font-medium">
                              {`${event.caregiver.first_name || ''} ${event.caregiver.last_name || ''}`.trim() || '—'}
                            </p>
                            <p className="text-xs text-muted-foreground">{event.caregiver.email}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                        {fmtTime(event.scheduled_start, displayTz)} – {fmtTime(event.scheduled_end, displayTz)}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                        {event.actual_start
                          ? `${fmtTime(event.actual_start, displayTz)}${event.actual_end ? ` – ${fmtTime(event.actual_end, displayTz)}` : ''}`
                          : '—'}
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={event.status} />
                        {event.end_reason_description && (
                          <p className="text-xs text-muted-foreground mt-0.5 max-w-[160px] truncate" title={event.end_reason_description}>
                            {event.end_reason_description}
                          </p>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-right">
                        {event.hours_worked != null ? parseFloat(String(event.hours_worked)).toFixed(2) : '—'}
                      </td>
                      <td className="py-3 pr-4 text-right">
                        {event.amount_earned != null
                          ? `$${parseFloat(String(event.amount_earned)).toFixed(2)}`
                          : '—'}
                      </td>
                      <td className="py-3 text-right">
                        {event.status === 'in_progress' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={() => setForceEndEvent(event)}
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
      <Dialog
        open={!!forceEndEvent}
        onOpenChange={(open) => {
          if (!open) {
            setForceEndEvent(null)
            setForceEndReason('')
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Force End Event</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will immediately end the shift and release the card hold back to the care seeker. Provide a reason for the record.
          </p>
          <Textarea
            placeholder="e.g. Caregiver unresponsive for 4+ hours"
            value={forceEndReason}
            onChange={(e) => setForceEndReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setForceEndEvent(null)
                setForceEndReason('')
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!forceEndReason.trim() || forceEndMutation.isPending}
              onClick={() =>
                forceEndEvent &&
                forceEndMutation.mutate({ eventId: forceEndEvent.id, reason: forceEndReason })
              }
            >
              Force End
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
