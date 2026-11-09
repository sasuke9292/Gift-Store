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
    <Card className="border-white/[0.05] shadow-sm overflow-hidden bg-[#0A1628] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:border-white/[0.1] transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-white/50">{title}</p>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-bold text-white/90">{value}</h3>
          {(trendValue || trendDescription) && (
            <div className="mt-2 flex items-center text-sm">
              {trendValue && (
                <span
                  className={cn(
                    'font-medium me-2',
                    trend === 'up' && 'text-emerald-400',
                    trend === 'down' && 'text-rose-400',
                    trend === 'neutral' && 'text-white/50'
                  )}
                >
                  {trendValue}
                </span>
              )}
              {trendDescription && (
                <span className="text-white/40">{trendDescription}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
