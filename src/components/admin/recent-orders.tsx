import React from 'react'
import { Order } from '@prisma/client'
import { ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'

const statusMap: Record<string, { label: string; color: string }> = {
  DELIVERED: { label: 'مكتمل', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  CONFIRMED: { label: 'مؤكد', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  SHIPPED: { label: 'تم الشحن', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  PROCESSING: { label: 'تجهيز', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  PENDING: { label: 'قيد المراجعة', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  CANCELLED: { label: 'ملغى', color: 'bg-rose-50 text-rose-700 border-rose-200' },
}

export function RecentOrders({ orders = [] }: { orders?: Order[] }) {
  return (
    <div className="w-full flex flex-col h-full">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-[#1C1917] mb-0.5">أحدث الطلبات</h2>
          <p className="text-xs text-[#78716C] font-medium">متابعة النشاط والطلبيات الواردة حديثاً</p>
        </div>
        <Link
          href="/admin/orders"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#FAFAF8] text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F0EA] transition-all border border-[#E8E4DF]"
          title="عرض جميع الطلبات"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </div>
      
      <div className="space-y-2.5 flex-1">
        {orders.map((order) => {
          const status = statusMap[order.status] || { label: order.status, color: 'bg-stone-50 text-stone-600 border-stone-200' }
          return (
            <Link
              key={order.id}
              href="/admin/orders"
              className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E8E4DF] bg-white hover:bg-[#FAFAF8] hover:border-[#13213c]/40 hover:shadow-sm transition-all group block"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #F0F4F9 0%, #E2EAF4 100%)', color: '#13213c', border: '1px solid rgba(19, 33, 60,0.2)' }}
                >
                  {order.customerName ? order.customerName.charAt(0) : 'ع'}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1C1917] group-hover:text-[#13213c] transition-colors leading-snug">
                    {order.customerName}
                  </p>
                  <span className="text-[11px] text-[#A8A29E] font-mono">
                    #{order.orderNumber}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <p className="text-sm font-black text-[#1C1917]">
                  {order.total.toLocaleString('en-US')} <span className="text-xs text-[#78716C] font-normal">د.ع</span>
                </p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </Link>
          )
        })}
        {orders.length === 0 && (
          <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-8 bg-[#FAFAF8] rounded-2xl border border-dashed border-[#E8E4DF]">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-3 border border-[#E8E4DF] shadow-sm">
              <Clock className="w-6 h-6 text-[#A8A29E]" />
            </div>
            <p className="text-[#1C1917] font-bold text-sm mb-1">لا توجد طلبات بعد</p>
            <p className="text-[#78716C] text-xs">ستظهر هنا أحدث طلبات الزبائن عند ورودها.</p>
          </div>
        )}
      </div>
    </div>
  )
}
