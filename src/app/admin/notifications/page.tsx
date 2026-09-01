'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, UserPlus, AlertCircle, CheckCircle2, CheckCheck, Trash2, Bell, MoreVertical, Search, Filter } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'طلب جديد #ORD-9872',
      description: 'قام محمد علي بإنشاء طلب جديد بقيمة 125,000 د.ع',
      time: 'منذ 10 دقائق',
      iconName: 'Package',
      type: 'info',
      read: false
    },
    {
      id: 2,
      title: 'عميل جديد مسجل',
      description: 'تم تسجيل حساب جديد بواسطة سارة حسين',
      time: 'منذ ساعتين',
      iconName: 'UserPlus',
      type: 'success',
      read: false
    },
    {
      id: 3,
      title: 'انخفاض المخزون',
      description: 'باقة الورد الحمراء على وشك النفاذ (المتبقي: 2)',
      time: 'أمس',
      iconName: 'AlertCircle',
      type: 'warning',
      read: true
    },
    {
      id: 4,
      title: 'تم تحديث حالة الطلب #ORD-9860',
      description: 'تم تغيير حالة الطلب إلى "تم التوصيل"',
      time: 'منذ يومين',
      iconName: 'CheckCircle2',
      type: 'success',
      read: true
    }
  ])

  const getIcon = (name: string) => {
    switch (name) {
      case 'Package': return <Package className="w-7 h-7" />
      case 'UserPlus': return <UserPlus className="w-7 h-7" />
      case 'AlertCircle': return <AlertCircle className="w-7 h-7" />
      case 'CheckCircle2': return <CheckCircle2 className="w-7 h-7" />
      default: return <Bell className="w-7 h-7" />
    }
  }

  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [search, setSearch] = useState('')

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    toast.success('تم تحديد جميع الإشعارات كمقروءة')
  }

  const handleDeleteAll = () => {
    setNotifications([])
    toast.success('تم حذف جميع الإشعارات بنجاح')
  }

  const toggleReadStatus = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n))
  }

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    toast.info('تم حذف الإشعار')
  }

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === 'all' || (filter === 'unread' && !n.read)
    const matchesSearch = n.title.includes(search) || n.description.includes(search)
    return matchesFilter && matchesSearch
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
            <Bell className="w-8 h-8 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">سجل الإشعارات</h1>
              {unreadCount > 0 && (
                <Badge className="bg-rose-500 hover:bg-rose-600 text-white border-0 shadow-sm px-2 py-0.5 rounded-full text-xs font-bold">
                  {unreadCount} جديد
                </Badge>
              )}
            </div>
            <p className="text-slate-500 font-medium">تتبع كافة الإشعارات والأنشطة الخاصة بمتجرك في مكان واحد.</p>
          </div>
        </div>

        <div className="relative z-10 flex gap-3 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl h-12 px-6 font-bold transition-all shadow-sm flex items-center justify-center flex-1 md:flex-none">
              <Filter className="w-5 h-5 ml-2 text-slate-400" />
              خيارات متقدمة
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-slate-100 p-2">
              <DropdownMenuLabel className="text-xs text-slate-400 font-bold px-2 py-1.5">إدارة الإشعارات</DropdownMenuLabel>
              <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 font-medium text-slate-700 hover:bg-slate-50" onSelect={handleMarkAllAsRead}>
                <CheckCheck className="ml-3 h-4 w-4 text-emerald-500" />
                <span>تحديد الكل كمقروء</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 font-bold text-rose-600 hover:bg-rose-50" onSelect={handleDeleteAll}>
                <Trash2 className="ml-3 h-4 w-4" />
                <span>مسح جميع الإشعارات</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100 w-full sm:w-auto">
          <button 
            className={`flex-1 sm:w-32 py-2.5 px-4 text-sm font-bold rounded-xl transition-all ${filter === 'all' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            onClick={() => setFilter('all')}
          >
            الكل
          </button>
          <button 
            className={`flex-1 sm:w-32 py-2.5 px-4 text-sm font-bold rounded-xl transition-all ${filter === 'unread' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            onClick={() => setFilter('unread')}
          >
            غير مقروء
          </button>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="ابحث في الإشعارات..."
            className="pl-4 pr-12 bg-white border-slate-200 focus:border-primary focus-visible:ring-primary/20 h-12 rounded-2xl text-sm shadow-sm transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredNotifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              layout
            >
              <Card className={`border shadow-sm rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-md ${notif.read ? 'bg-white border-slate-100' : 'bg-primary/[0.02] border-primary/20'}`}>
                <CardContent className="p-5 sm:p-6 flex items-start gap-4 sm:gap-6 relative group">
                  
                  {/* Read Indicator Line */}
                  {!notif.read && (
                    <div className="absolute top-0 bottom-0 right-0 w-1.5 bg-primary shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                  )}

                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                    notif.type === 'info' ? 'bg-blue-100 text-blue-600' :
                    notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    {getIcon(notif.iconName)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-1.5">
                      <h3 className={`font-bold text-lg truncate ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>
                        {notif.title}
                      </h3>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full w-max">
                        {notif.time}
                      </span>
                    </div>
                    <p className={`text-md leading-relaxed ${notif.read ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>
                      {notif.description}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-800 flex items-center justify-center transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-slate-100 p-2">
                        <DropdownMenuItem 
                          className="rounded-xl cursor-pointer py-2.5 font-medium text-slate-700 hover:bg-slate-50"
                          onSelect={() => toggleReadStatus(notif.id)}
                        >
                          <CheckCircle2 className={`ml-3 h-4 w-4 ${notif.read ? 'text-slate-400' : 'text-primary'}`} />
                          <span>{notif.read ? 'تحديد كغير مقروء' : 'تحديد كمقروء'}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1" />
                        <DropdownMenuItem 
                          className="rounded-xl cursor-pointer py-2.5 font-bold text-rose-600 hover:bg-rose-50"
                          onSelect={() => deleteNotification(notif.id)}
                        >
                          <Trash2 className="ml-3 h-4 w-4" />
                          <span>حذف الإشعار</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredNotifications.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-100 border-dashed rounded-[2rem]"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Bell className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">لا توجد إشعارات لعرضها</h3>
              <p className="text-slate-500">يبدو أن صندوق الإشعارات الخاص بك فارغ حالياً.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
