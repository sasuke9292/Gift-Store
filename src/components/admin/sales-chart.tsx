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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 drop-shadow-sm mb-1">نظرة عامة على المبيعات</h2>
          <p className="text-sm text-slate-500 font-medium">أداء المبيعات خلال الأيام السبعة الماضية</p>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 0,
              left: 30,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              orientation="right"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                direction: 'rtl',
                padding: '12px 16px',
              }}
              itemStyle={{ color: '#d97706', fontWeight: 900, fontSize: '1.1rem' }}
              labelStyle={{ color: '#64748b', fontWeight: 600, marginBottom: '4px' }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#f59e0b"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorTotal)"
              activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 3, className: 'drop-shadow-md' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
