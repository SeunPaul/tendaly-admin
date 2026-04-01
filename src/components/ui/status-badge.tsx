import { Badge } from './badge'
import { type BadgeProps } from './badge'

type StatusBadgeProps = {
  status: string
  label?: string
  className?: string
}

const statusVariantMap: Record<string, BadgeProps['variant']> = {
  approved: 'success',
  active: 'success',
  completed: 'success',
  paid: 'success',
  passed: 'success',
  visible: 'success',
  open: 'success',
  trial: 'success',
  voucher: 'success',

  rejected: 'error',
  failed: 'error',
  suspended: 'error',
  cancelled: 'error',
  canceled: 'error',
  hidden: 'error',

  pending: 'warning',
  processing: 'warning',
  in_progress: 'warning',
  under_review: 'warning',
  consider: 'warning',

  not_submitted: 'gray',
  incomplete: 'gray',
  not_started: 'gray',
  inactive: 'gray',
  expired: 'gray',

  requires_input: 'orange',
  action_required: 'orange',
  dispute: 'orange',
  flagged: 'orange',
}

const statusLabelMap: Record<string, string> = {
  in_progress: 'In Progress',
  not_submitted: 'Not Submitted',
  under_review: 'Under Review',
  requires_input: 'Requires Input',
  action_required: 'Action Required',
  not_started: 'Not Started',
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const variant = statusVariantMap[status?.toLowerCase()] ?? 'gray'
  const displayLabel = label ?? statusLabelMap[status?.toLowerCase()] ?? status?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ?? '—'

  return (
    <Badge variant={variant} className={className}>
      {displayLabel}
    </Badge>
  )
}
