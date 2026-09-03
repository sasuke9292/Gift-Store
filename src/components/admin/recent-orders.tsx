import React from 'react'
import { Order } from '@prisma/client'
import { ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'

const statusMap: Record<string, { label: string; color: string }> = {
  DELIVERED: { label: 'مكتمل', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  CONFIRMED: { label: 'مؤكد', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  SHIPPED: { label: 'مشحون', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  PROCESSING: { label: 'تجهيز', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  PENDING: { label: 'قيد التنفيذ', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  CANCELLED: { label: 'ملغى', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
}

export function RecentOrders({ orders = [] }: { orders?: Order[] }) {
  return (
    <div className="w-full flex flex-col h-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-white/80 mb-0.5">أحدث الطلبات</h2>
          <p className="text-xs text-white/30 font-medium">متابعة النشاط الأخير</p>
        </div>
        <Link
          href="/admin/orders"
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.04] text-white/30 hover:text-amber-400 hover:bg-amber-500/10 transition-all border border-white/[0.06] hover:border-amber-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="space-y-2 flex-1">
        {orders.map((order) => {
          const status = statusMap[order.status] || { label: order.status, color: 'bg-white/5 text-white/40 border-white/10' }
          return (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 rounded-xl border border-white/[0.05] hover:bg-white/[0.03] hover:border-white/[0.09] transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.06] flex items-center justify-center text-amber-400 font-black shrink-0 text-sm group-hover:bg-amber-500/10 group-hover:border-amber-500/20 transition-all">
                  {order.customerName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white/70 group-hover:text-white/90 transition-colors leading-none mb-1">{order.customerName}</p>
                  <span className="text-[10px] text-white/25 font-mono bg-white/[0.04] px-1.5 py-0.5 rounded">
                    #{order.orderNumber}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <p className="text-sm font-black text-white/75">{order.total.toLocaleString('en-US')} <span className="text-[10px] text-white/25 font-bold">د.ع</span></p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </div>
          )
        })}
        {orders.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center py-10">
            <div className="w-12 h-12 bg-white/[0.04] rounded-xl flex items-center justify-center mb-3 border border-white/[0.05]">
              <Clock className="w-6 h-6 text-white/20" />
            </div>
            <p className="text-white/30 font-bold text-sm">لا توجد طلبات حديثة</p>
          </div>
        )}
      </div>
    </div>
  )
}
