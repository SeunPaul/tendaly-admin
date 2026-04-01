import { type LucideIcon } from 'lucide-react'
import { Card, CardContent } from './card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  className?: string
}

export function StatCard({ title, value, icon: Icon, change, changeType = 'neutral', className }: StatCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {change && (
              <p
                className={cn('text-xs', {
                  'text-green-600': changeType === 'positive',
                  'text-red-600': changeType === 'negative',
                  'text-muted-foreground': changeType === 'neutral',
                })}
              >
                {change}
              </p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0099FF]/10">
            <Icon className="h-6 w-6 text-[#0099FF]" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
