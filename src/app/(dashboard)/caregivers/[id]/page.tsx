'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Mail, Calendar, Phone, MapPin, Shield,
  CheckCircle, XCircle, Clock, ExternalLink, Star,
  Globe, Award, Briefcase, Heart, Video, X, ZoomIn, FileText, CreditCard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

interface Certificate {
  id: string
  issuing_organization: string
  license_number?: string
  issue_date?: string
  expiration_date?: string
  certificate_url: string
  certificate_type?: { id: string; name: string }
}

interface CaregiverProfile {
  about?: string
  video_intro?: string
  years_of_experience?: number
  summary_of_experience?: string
  service_address?: string
  service_radius?: number
  can_travel?: boolean
  can_provide_live_in_care?: boolean
  hourly_rate?: number
  accept_booking?: boolean
  average_rating?: number
  total_reviews?: number
  care_types?: { id: string; name: string }[]
  service_types?: { id: string; name: string }[]
  languages?: { id: string; name: string }[]
  certificates?: Certificate[]
}

interface CaregiverDetail {
  user: {
    id: string
    email: string
    first_name: string
    last_name: string
    gender?: string
    dob?: string
    phone_number?: string
    address?: string
    zip_code?: string
    profile_photo?: string
    is_suspended: boolean
    country?: { name: string; flag?: string }
    created_at: string
  }
  caregiver_profile?: CaregiverProfile | null
  kyc_profile?: {
    id: string
    overall_status: string
    identity_status: string
    work_authorization_status: string
    background_check_status: string
    modified_at: string
  } | null
  subscription?: SubscriptionRecord | null
  subscription_history?: SubscriptionRecord[]
}

interface SubscriptionRecord {
  id: string
  status: string
  is_trial: boolean
  is_voucher: boolean
  voucher_code?: string | null
  start_date: string
  end_date?: string | null
  auto_renew: boolean
  amount_paid: number
  cancelled_at?: string | null
  created_at: string
  plan?: {
    id: string
    name: string
    type: string
    duration_months: number
    price: number
  } | null
}

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
      {label}
    </span>
  )
}

function isPdf(url: string) {
  return /\.pdf($|\?)/i.test(url)
}

function CertificateFile({ url, label }: { url: string; label: string }) {
  const [lightbox, setLightbox] = useState(false)
  const pdf = isPdf(url)

  if (pdf) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors text-muted-foreground hover:text-gray-700 h-20 w-full"
      >
        <FileText className="h-6 w-6" />
        <span className="text-xs font-medium">View PDF</span>
      </a>
    )
  }

  return (
    <>
      <div
        className="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200 bg-gray-50 h-32 w-full"
        onClick={() => setLightbox(true)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={label} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setLightbox(false)}
          >
            <X className="h-7 w-7" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={label}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}

export default function CaregiverDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: caregiver, isLoading } = useQuery<CaregiverDetail>({
    queryKey: ['caregiver', id],
    queryFn: async () => {
      const res = await api.get(`/users/caregivers/${id}`)
      return res.data.data
    },
  })

  const suspendMutation = useMutation({
    mutationFn: async (suspend: boolean) => {
      if (suspend) {
        await api.patch(`/users/admin/${id}/suspend`, { reason: '' })
      } else {
        await api.patch(`/users/admin/${id}/unsuspend`)
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['caregiver', id] }),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0099FF] border-t-transparent" />
      </div>
    )
  }

  if (!caregiver) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Caregiver not found.</p>
      </div>
    )
  }

  const { user, caregiver_profile: cp, kyc_profile, subscription, subscription_history } = caregiver
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim()
  const initials = fullName
    ? fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Header Card */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
              {user.profile_photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.profile_photo} alt={fullName} className="h-full w-full object-cover" />
              ) : (
                <span className="text-lg font-semibold text-gray-500">{initials}</span>
              )}
            </div>
            <div>
              <CardTitle className="text-xl">{fullName || '(No name)'}</CardTitle>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <StatusBadge status={user.is_suspended ? 'suspended' : 'active'} />
                {cp?.accept_booking !== undefined && (
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    cp.accept_booking
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {cp.accept_booking ? 'Accepting Bookings' : 'Not Accepting Bookings'}
                  </span>
                )}
                {cp?.average_rating !== undefined && cp.average_rating > 0 && (
                  <span className="flex items-center gap-1 text-sm text-amber-600">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {cp.average_rating.toFixed(1)}
                    <span className="text-muted-foreground">({cp.total_reviews ?? 0} reviews)</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button
            variant={user.is_suspended ? 'outline' : 'destructive'}
            size="sm"
            onClick={() => suspendMutation.mutate(!user.is_suspended)}
            disabled={suspendMutation.isPending}
          >
            {user.is_suspended ? 'Unsuspend Account' : 'Suspend Account'}
          </Button>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div>
                <dt className="text-xs text-muted-foreground">Email</dt>
                <dd className="text-sm font-medium">{user.email}</dd>
              </div>
            </div>
            {user.phone_number && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <dt className="text-xs text-muted-foreground">Phone</dt>
                  <dd className="text-sm font-medium">{user.phone_number}</dd>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div>
                <dt className="text-xs text-muted-foreground">Joined</dt>
                <dd className="text-sm font-medium">{formatDate(user.created_at)}</dd>
              </div>
            </div>
            {user.dob && (
              <div>
                <dt className="text-xs text-muted-foreground">Date of Birth</dt>
                <dd className="text-sm font-medium">{formatDate(user.dob)}</dd>
              </div>
            )}
            {user.gender && (
              <div>
                <dt className="text-xs text-muted-foreground">Gender</dt>
                <dd className="text-sm font-medium capitalize">{user.gender}</dd>
              </div>
            )}
            {user.address && (
              <div className="flex items-start gap-2 sm:col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <dt className="text-xs text-muted-foreground">Address</dt>
                  <dd className="text-sm font-medium">
                    {user.address}{user.zip_code ? `, ${user.zip_code}` : ''}
                    {user.country ? ` · ${user.country.flag ?? ''} ${user.country.name}` : ''}
                  </dd>
                </div>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Caregiver Profile Card */}
      {cp && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-[#0099FF]" />
              Caregiver Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cp.years_of_experience !== undefined && (
                <div>
                  <dt className="text-xs text-muted-foreground">Experience</dt>
                  <dd className="text-sm font-medium">{cp.years_of_experience} years</dd>
                </div>
              )}
              {cp.hourly_rate !== undefined && (
                <div>
                  <dt className="text-xs text-muted-foreground">Hourly Rate</dt>
                  <dd className="text-sm font-medium">${parseFloat(String(cp.hourly_rate)).toFixed(2)}/hr</dd>
                </div>
              )}
              {cp.can_travel !== undefined && (
                <div>
                  <dt className="text-xs text-muted-foreground">Can Travel</dt>
                  <dd className="text-sm font-medium">{cp.can_travel ? 'Yes' : 'No'}</dd>
                </div>
              )}
              {cp.can_provide_live_in_care !== undefined && (
                <div>
                  <dt className="text-xs text-muted-foreground">Live-in Care</dt>
                  <dd className="text-sm font-medium">{cp.can_provide_live_in_care ? 'Yes' : 'No'}</dd>
                </div>
              )}
              {cp.service_radius !== undefined && (
                <div>
                  <dt className="text-xs text-muted-foreground">Service Radius</dt>
                  <dd className="text-sm font-medium">{cp.service_radius} miles</dd>
                </div>
              )}
              {cp.service_address && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-muted-foreground">Service Area</dt>
                  <dd className="text-sm font-medium">{cp.service_address}</dd>
                </div>
              )}
            </dl>

            {cp.about && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">About</p>
                <p className="text-sm text-gray-700">{cp.about}</p>
              </div>
            )}

            {cp.summary_of_experience && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Experience Summary</p>
                <p className="text-sm text-gray-700">{cp.summary_of_experience}</p>
              </div>
            )}

            {/* Video Intro */}
            {cp.video_intro && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Video className="h-3.5 w-3.5" /> Video Introduction
                </p>
                <video
                  src={cp.video_intro}
                  controls
                  className="w-full rounded-lg border border-gray-200 max-h-72 bg-black"
                />
              </div>
            )}

            {/* Care Types */}
            {cp.care_types && cp.care_types.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" /> Care Types
                </p>
                <div className="flex flex-wrap gap-2">
                  {cp.care_types.map((t) => <Tag key={t.id} label={t.name} />)}
                </div>
              </div>
            )}

            {/* Service Types */}
            {cp.service_types && cp.service_types.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" /> Service Types
                </p>
                <div className="flex flex-wrap gap-2">
                  {cp.service_types.map((t) => <Tag key={t.id} label={t.name} />)}
                </div>
              </div>
            )}

            {/* Languages */}
            {cp.languages && cp.languages.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" /> Languages
                </p>
                <div className="flex flex-wrap gap-2">
                  {cp.languages.map((l) => <Tag key={l.id} label={l.name} />)}
                </div>
              </div>
            )}

            {/* Certificates */}
            {cp.certificates && cp.certificates.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Award className="h-3.5 w-3.5" /> Certificates
                </p>
                <div className="space-y-3">
                  {cp.certificates.map((cert) => (
                    <div key={cert.id} className="rounded-lg border border-gray-100 p-3 space-y-2">
                      <div>
                        <p className="text-sm font-medium">
                          {cert.certificate_type?.name ?? '—'}
                        </p>
                        <p className="text-xs text-muted-foreground">{cert.issuing_organization}</p>
                        {cert.license_number && (
                          <p className="text-xs text-muted-foreground">License: {cert.license_number}</p>
                        )}
                        {(cert.issue_date || cert.expiration_date) && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {cert.issue_date ? formatDate(cert.issue_date) : ''}
                            {cert.issue_date && cert.expiration_date ? ' – ' : ''}
                            {cert.expiration_date ? formatDate(cert.expiration_date) : ''}
                          </p>
                        )}
                      </div>
                      <CertificateFile
                        url={cert.certificate_url}
                        label={cert.certificate_type?.name ?? 'Certificate'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* KYC Card */}
      {kyc_profile && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#0099FF]" />
                KYC Verification
              </CardTitle>
              <StatusBadge status={kyc_profile.overall_status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-medium">Identity Verification</p>
              </div>
              <StatusBadge status={kyc_profile.identity_status} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-medium">Work Authorization</p>
              </div>
              <StatusBadge status={kyc_profile.work_authorization_status} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
              <div className="flex items-center gap-3">
                <XCircle className="h-4 w-4 text-gray-400" />
                <p className="text-sm font-medium">Background Check</p>
              </div>
              <StatusBadge status={kyc_profile.background_check_status} />
            </div>
            <div className="pt-1">
              <Button variant="outline" size="sm" onClick={() => router.push(`/kyc/${id}`)}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View KYC Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscription Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#0099FF]" />
              Subscription
            </CardTitle>
            {subscription ? (
              <StatusBadge
                status={subscription.status}
                label={subscription.is_trial ? 'Trial' : subscription.is_voucher ? 'Voucher' : subscription.status}
              />
            ) : (
              <StatusBadge status="not_submitted" label="No Subscription" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-3">
              {subscription.plan && (
                <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <p className="text-sm font-medium text-muted-foreground">Plan</p>
                  <p className="text-sm font-semibold">{subscription.plan.name}</p>
                </div>
              )}
              {subscription.is_voucher && subscription.voucher_code && (
                <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <p className="text-sm font-medium text-muted-foreground">Voucher Code</p>
                  <p className="text-sm font-mono font-semibold">{subscription.voucher_code}</p>
                </div>
              )}
              <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                <p className="text-sm">{formatDate(subscription.start_date)}</p>
              </div>
              {subscription.end_date && (
                <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <p className="text-sm font-medium text-muted-foreground">Expires</p>
                  <p className="text-sm">{formatDate(subscription.end_date)}</p>
                </div>
              )}
              {!subscription.is_trial && !subscription.is_voucher && (
                <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <p className="text-sm font-medium text-muted-foreground">Amount Paid</p>
                  <p className="text-sm font-semibold">${subscription.amount_paid.toFixed(2)}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">This caregiver has no subscription history.</p>
          )}
        </CardContent>
      </Card>

      {/* Subscription History */}
      {subscription_history && subscription_history.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#0099FF]" />
              Subscription History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {subscription_history.slice(1).map((s) => (
              <div key={s.id} className="rounded-lg border border-gray-100 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {s.is_trial ? 'Trial' : s.is_voucher ? `Voucher${s.voucher_code ? ` (${s.voucher_code})` : ''}` : (s.plan?.name ?? 'Subscription')}
                    </span>
                    {!s.is_trial && !s.is_voucher && s.amount_paid > 0 && (
                      <span className="text-xs text-muted-foreground">${s.amount_paid.toFixed(2)}</span>
                    )}
                  </div>
                  <StatusBadge status={s.status} />
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Start: {formatDate(s.start_date)}</span>
                  {s.end_date && <span>End: {formatDate(s.end_date)}</span>}
                  {s.cancelled_at && <span>Cancelled: {formatDate(s.cancelled_at)}</span>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
