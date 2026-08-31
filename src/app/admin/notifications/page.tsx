'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function AdminNotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: 'طلب جديد #ORD-9872',
      description: 'قام محمد علي بإنشاء طلب جديد بقيمة 125,000 د.ع',
      time: 'منذ 10 دقائق',
      icon: Package,
      type: 'info',
      read: false
    },
    {
      id: 2,
      title: 'عميل جديد مسجل',
      description: 'تم تسجيل حساب جديد بواسطة سارة حسين',
      time: 'منذ ساعتين',
      icon: UserPlus,
      type: 'success',
      read: false
    },
    {
      id: 3,
      title: 'انخفاض المخزون',
      description: 'باقة الورد الحمراء على وشك النفاذ (المتبقي: 2)',
      time: 'أمس',
      icon: AlertCircle,
      type: 'warning',
      read: true
    },
    {
      id: 4,
      title: 'تم تحديث حالة الطلب #ORD-9860',
      description: 'تم تغيير حالة الطلب إلى "تم التوصيل"',
      time: 'منذ يومين',
      icon: CheckCircle2,
      type: 'success',
      read: true
    }
  ]

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">سجل الإشعارات</h1>
          <p className="text-slate-500 mt-1">تتبع كافة الإشعارات والأنشطة الخاصة بمتجرك.</p>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <Card key={notif.id} className={`border-slate-100 shadow-sm rounded-2xl overflow-hidden transition-all ${notif.read ? 'bg-white opacity-80' : 'bg-primary/5 border-primary/20'}`}>
            <CardContent className="p-4 sm:p-6 flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                notif.type === 'info' ? 'bg-blue-100 text-blue-600' :
                notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                'bg-amber-100 text-amber-600'
              }`}>
                <notif.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-bold text-slate-800 text-lg">{notif.title}</h3>
                  <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">{notif.time}</span>
                </div>
                <p className="text-slate-600 mt-1">{notif.description}</p>
              </div>
              {!notif.read && (
                <div className="w-3 h-3 bg-primary rounded-full mt-2 shrink-0 shadow-sm shadow-primary/50"></div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
