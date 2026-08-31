import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  trendDescription?: string
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  trendDescription,
}: StatCardProps) {
  return (
    <Card className="border-slate-100 shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
          {(trendValue || trendDescription) && (
            <div className="mt-2 flex items-center text-sm">
              {trendValue && (
                <span
                  className={cn(
                    'font-medium mr-2',
                    trend === 'up' && 'text-green-600',
                    trend === 'down' && 'text-red-600',
                    trend === 'neutral' && 'text-slate-600'
                  )}
                >
                  {trendValue}
                </span>
              )}
              {trendDescription && (
                <span className="text-slate-500">{trendDescription}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
