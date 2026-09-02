import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Order } from '@prisma/client'

export function RecentOrders({ orders = [] }: { orders?: Order[] }) {
  return (
    <Card className="border-slate-100 shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">أحدث الطلبات</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
                  {order.customerName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{order.customerName}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                    <span>{order.orderNumber}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-end">
                <p className="text-sm font-bold text-slate-800">{order.total.toLocaleString('en-US')} د.ع</p>
                <Badge
                  variant="outline"
                  className={
                    order.status === 'DELIVERED' || order.status === 'CONFIRMED'
                      ? 'border-0 bg-emerald-100 text-emerald-700'
                      : order.status === 'PENDING' || order.status === 'PROCESSING'
                      ? 'border-0 bg-amber-100 text-amber-700'
                      : order.status === 'SHIPPED'
                      ? 'border-0 bg-blue-100 text-blue-700'
                      : 'border-0 bg-rose-100 text-rose-700'
                  }
                >
                  {order.status === 'DELIVERED' || order.status === 'CONFIRMED' ? 'مكتمل' : order.status === 'SHIPPED' ? 'مشحون' : order.status === 'PENDING' ? 'قيد التنفيذ' : order.status === 'PROCESSING' ? 'تجهيز' : 'ملغى'}
                </Badge>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center text-sm text-slate-500 py-4">
              لا توجد طلبات حديثة
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
