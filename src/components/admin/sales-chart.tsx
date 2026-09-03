'use client'

import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { name: 'السبت', total: 1200 },
  { name: 'الأحد', total: 2100 },
  { name: 'الإثنين', total: 1800 },
  { name: 'الثلاثاء', total: 2400 },
  { name: 'الأربعاء', total: 3200 },
  { name: 'الخميس', total: 2800 },
  { name: 'الجمعة', total: 4100 },
]

export function SalesChart() {
  return (
    <div className="w-full">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-white/80 mb-0.5">نظرة عامة على المبيعات</h2>
          <p className="text-xs text-white/30 font-medium">أداء المبيعات خلال الأيام السبعة الماضية</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-xs text-white/30 font-medium">المبيعات</span>
        </div>
      </div>
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 0, left: 20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="name"
              stroke="rgba(255,255,255,0.15)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              padding={{ left: 10, right: 10 }}
              tick={{ fill: 'rgba(255,255,255,0.3)' }}
            />
            <YAxis
              orientation="right"
              stroke="rgba(255,255,255,0.15)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              width={55}
              tick={{ fill: 'rgba(255,255,255,0.3)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F1E35',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                direction: 'rtl',
                padding: '10px 14px',
              }}
              itemStyle={{ color: '#f59e0b', fontWeight: 900, fontSize: '1rem' }}
              labelStyle={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: '2px', fontSize: '0.75rem' }}
              cursor={{ stroke: 'rgba(245,158,11,0.2)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorTotal)"
              activeDot={{ r: 5, fill: '#f59e0b', stroke: '#0A1628', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
