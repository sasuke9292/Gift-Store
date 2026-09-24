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
  { name: 'السبت', total: 1200000 },
  { name: 'الأحد', total: 2100000 },
  { name: 'الإثنين', total: 1850000 },
  { name: 'الثلاثاء', total: 2400000 },
  { name: 'الأربعاء', total: 3250000 },
  { name: 'الخميس', total: 2900000 },
  { name: 'الجمعة', total: 4150000 },
]

export function SalesChart() {
  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-black text-[#1C1917] mb-0.5">نظرة عامة على المبيعات الأسبوعية</h2>
          <p className="text-xs text-[#78716C] font-medium">أداء المبيعات وإيرادات المتجر خلال آخر 7 أيام</p>
        </div>
        <div className="flex items-center gap-2 bg-[#FAFAF8] px-3 py-1.5 rounded-xl border border-[#E8E4DF]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#13213c]" />
          <span className="text-xs text-[#78716C] font-bold">المبيعات الإجمالية</span>
        </div>
      </div>
      <div className="h-[270px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="salesGoldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#13213c" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#13213c" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0ECE7" />
            <XAxis
              dataKey="name"
              stroke="#A8A29E"
              fontSize={12}
              fontWeight={600}
              tickLine={false}
              axisLine={{ stroke: '#E8E4DF' }}
              padding={{ left: 10, right: 10 }}
              tick={{ fill: '#78716C' }}
            />
            <YAxis
              orientation="right"
              stroke="#A8A29E"
              fontSize={11}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toLocaleString('en-US')}k`}
              width={55}
              tick={{ fill: '#78716C' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #E8E4DF',
                boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                direction: 'rtl',
                padding: '12px 16px',
              }}
              itemStyle={{ color: '#13213c', fontWeight: 900, fontSize: '0.95rem' }}
              labelStyle={{ color: '#1C1917', fontWeight: 800, marginBottom: '4px', fontSize: '0.8rem' }}
              formatter={(value: any) => [`${Number(value).toLocaleString('en-US')} د.ع`, 'المبيعات']}
              cursor={{ stroke: '#13213c', strokeWidth: 1.5, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#13213c"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#salesGoldGradient)"
              activeDot={{ r: 6, fill: '#13213c', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
