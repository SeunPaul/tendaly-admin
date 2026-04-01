'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Mail, Calendar, Phone, MapPin, Shield,
  CheckCircle, XCircle, Clock, ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

interface CareSeekerDetail {
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
  kyc_profile?: {
    id: string
    overall_status: string
    identity_status: string
    work_authorization_status: string
    background_check_status: string
    modified_at: string
  } | null
}

export default function CareSeekerDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: careSeeker, isLoading } = useQuery<CareSeekerDetail>({
    queryKey: ['care-seeker', id],
    queryFn: async () => {
      const res = await api.get(`/users/careseekers/${id}`)
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['care-seeker', id] }),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0099FF] border-t-transparent" />
      </div>
    )
  }

  if (!careSeeker) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Care seeker not found.</p>
      </div>
    )
  }

  const { user, kyc_profile } = careSeeker
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
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={user.is_suspended ? 'suspended' : 'active'} />
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
    </div>
  )
}
