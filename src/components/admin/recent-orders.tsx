import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Order } from '@prisma/client'
import { ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'

export function RecentOrders({ orders = [] }: { orders?: Order[] }) {
  return (
    <div className="w-full flex flex-col h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 drop-shadow-sm mb-1">أحدث الطلبات</h2>
          <p className="text-sm text-slate-500 font-medium">متابعة النشاط الأخير</p>
        </div>
        <Link href="/admin/orders" className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-colors border border-slate-100 hover:border-amber-200">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>
      
      <div className="space-y-4 flex-1">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100/50 hover:bg-slate-50 hover:border-slate-200 transition-colors group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/50 flex items-center justify-center text-slate-600 font-black shrink-0 text-lg group-hover:scale-105 transition-transform shadow-sm">
                {order.customerName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors">{order.customerName}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-1 bg-slate-100 px-2 py-0.5 rounded-md inline-flex">
                  <span className="opacity-60">#</span>{order.orderNumber}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 text-start">
              <p className="text-sm font-black text-slate-800">{order.total.toLocaleString('en-US')} <span className="text-[10px] text-slate-400 font-bold">د.ع</span></p>
              <Badge
                variant="outline"
                className={
                  order.status === 'DELIVERED' || order.status === 'CONFIRMED'
                    ? 'border-0 bg-emerald-50 text-emerald-600 shadow-sm'
                    : order.status === 'PENDING' || order.status === 'PROCESSING'
                    ? 'border-0 bg-amber-50 text-amber-600 shadow-sm'
                    : order.status === 'SHIPPED'
                    ? 'border-0 bg-blue-50 text-blue-600 shadow-sm'
                    : 'border-0 bg-rose-50 text-rose-600 shadow-sm'
                }
              >
                {order.status === 'DELIVERED' || order.status === 'CONFIRMED' ? 'مكتمل' : order.status === 'SHIPPED' ? 'مشحون' : order.status === 'PENDING' ? 'قيد التنفيذ' : order.status === 'PROCESSING' ? 'تجهيز' : 'ملغى'}
              </Badge>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-70">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-bold">لا توجد طلبات حديثة</p>
          </div>
        )}
      </div>
    </div>
  )
}
