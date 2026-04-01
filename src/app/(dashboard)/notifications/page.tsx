'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, CheckCircle } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import api from '@/lib/api'

const notificationSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  type: z.string().min(1, 'Type is required'),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
})

type NotificationFormData = z.infer<typeof notificationSchema>

const notificationTypes = [
  { value: 'general', label: 'General' },
  { value: 'kyc_update', label: 'KYC Update' },
  { value: 'job_update', label: 'Job Update' },
  { value: 'payment', label: 'Payment' },
  { value: 'account', label: 'Account' },
  { value: 'promotion', label: 'Promotion' },
]

export default function NotificationsPage() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
  })

  const typeValue = watch('type')

  const sendMutation = useMutation({
    mutationFn: async (data: NotificationFormData) => {
      await api.post('/notifications/send', data)
    },
    onSuccess: () => {
      setSent(true)
      reset()
      setTimeout(() => setSent(false), 4000)
    },
  })

  const onSubmit = (data: NotificationFormData) => {
    sendMutation.mutate(data)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="Send push notifications to users" />

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Send Notification</CardTitle>
          </CardHeader>
          <CardContent>
            {sent && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                Notification sent successfully!
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="user_id">User ID</Label>
                <Input
                  id="user_id"
                  placeholder="Enter user UUID"
                  {...register('user_id')}
                />
                {errors.user_id && (
                  <p className="text-xs text-red-500">{errors.user_id.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Notification Type</Label>
                <Select value={typeValue} onValueChange={(v) => setValue('type', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {notificationTypes.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-xs text-red-500">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Notification title"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Notification message body..."
                  rows={4}
                  {...register('message')}
                />
                {errors.message && (
                  <p className="text-xs text-red-500">{errors.message.message}</p>
                )}
              </div>

              {sendMutation.isError && (
                <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                  Failed to send notification. Please try again.
                </div>
              )}

              <Button type="submit" disabled={sendMutation.isPending} className="w-full sm:w-auto">
                {sendMutation.isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Notification
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
