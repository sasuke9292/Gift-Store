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
  interface NotificationData {
    id: number
    title: string
    description: string
    time: string
    iconName: string
    type: string
    read: boolean
  }
  
  const [notifications, setNotifications] = useState<NotificationData[]>([])

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#0A1628] p-8 rounded-[2rem] border border-white/[0.05] relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 end-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
            <Bell className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-white/90 tracking-tight">سجل الإشعارات</h1>
              {unreadCount > 0 && (
                <Badge className="bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-sm px-2 py-0.5 rounded-full text-xs font-bold">
                  {unreadCount} جديد
                </Badge>
              )}
            </div>
            <p className="text-white/40 font-medium">تتبع كافة الإشعارات والأنشطة الخاصة بمتجرك في مكان واحد.</p>
          </div>
        </div>

        <div className="relative z-10 flex gap-3 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white/70 rounded-xl h-12 px-6 font-bold transition-all shadow-sm flex items-center justify-center flex-1 md:flex-none">
              <Filter className="w-5 h-5 ms-2 text-amber-400" />
              خيارات متقدمة
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-white/[0.08] bg-[#0A1628] p-2">
              <DropdownMenuLabel className="text-xs text-white/30 font-bold px-2 py-1.5 uppercase tracking-widest">إدارة الإشعارات</DropdownMenuLabel>
              <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 font-medium text-white/70 hover:bg-white/[0.06] hover:text-white/90 transition-colors" onClick={handleMarkAllAsRead}>
                <CheckCheck className="ms-3 h-4 w-4 text-emerald-400" />
                <span>تحديد الكل كمقروء</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2 bg-white/[0.06]" />
              <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 font-bold text-rose-400 hover:bg-rose-500/10 transition-colors" onClick={handleDeleteAll}>
                <Trash2 className="ms-3 h-4 w-4" />
                <span>مسح جميع الإشعارات</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex bg-[#0A1628] p-1 rounded-2xl border border-white/[0.05] w-full sm:w-auto">
          <button 
            className={`flex-1 sm:w-32 py-2.5 px-4 text-sm font-bold rounded-xl transition-all ${filter === 'all' ? 'bg-amber-500 text-[#030810] shadow-[0_4px_15px_rgba(245,158,11,0.2)]' : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80'}`}
            onClick={() => setFilter('all')}
          >
            الكل
          </button>
          <button 
            className={`flex-1 sm:w-32 py-2.5 px-4 text-sm font-bold rounded-xl transition-all ${filter === 'unread' ? 'bg-amber-500 text-[#030810] shadow-[0_4px_15px_rgba(245,158,11,0.2)]' : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80'}`}
            onClick={() => setFilter('unread')}
          >
            غير مقروء
          </button>
        </div>

        <div className="relative w-full sm:max-w-xs group">
          <Search className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-amber-500 transition-colors" />
          <Input
            placeholder="ابحث في الإشعارات..."
            className="ps-4 pe-12 bg-[#0A1628] border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 focus-visible:ring-amber-500/10 h-12 rounded-2xl text-sm transition-all text-white/80 placeholder:text-white/30"
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
              <Card className={`border shadow-sm rounded-3xl overflow-hidden transition-all duration-300 ${notif.read ? 'bg-[#0A1628] border-white/[0.05]' : 'bg-amber-500/[0.02] border-amber-500/20 shadow-[0_4px_20px_rgba(245,158,11,0.05)]'}`}>
                <CardContent className="p-5 sm:p-6 flex items-start gap-4 sm:gap-6 relative group">
                  
                  {/* Read Indicator Line */}
                  {!notif.read && (
                    <div className="absolute top-0 bottom-0 end-0 w-1.5 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
                  )}

                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                    notif.type === 'info' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    notif.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {getIcon(notif.iconName)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-1.5">
                      <h3 className={`font-bold text-lg truncate ${notif.read ? 'text-white/60' : 'text-white/90'}`}>
                        {notif.title}
                      </h3>
                      <span className="text-xs font-bold text-white/40 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full w-max">
                        {notif.time}
                      </span>
                    </div>
                    <p className={`text-md leading-relaxed ${notif.read ? 'text-white/40' : 'text-white/70 font-medium'}`}>
                      {notif.description}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-10 h-10 rounded-xl bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-amber-400 border border-white/[0.06] flex items-center justify-center transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-white/[0.08] bg-[#0A1628] p-2">
                        <DropdownMenuItem 
                          className="rounded-xl cursor-pointer py-2.5 font-medium text-white/70 hover:bg-white/[0.06] hover:text-white/90 transition-colors"
                          onClick={() => toggleReadStatus(notif.id)}
                        >
                          <CheckCircle2 className={`ms-3 h-4 w-4 ${notif.read ? 'text-white/40' : 'text-amber-400'}`} />
                          <span>{notif.read ? 'تحديد كغير مقروء' : 'تحديد كمقروء'}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 bg-white/[0.06]" />
                        <DropdownMenuItem 
                          className="rounded-xl cursor-pointer py-2.5 font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
                          onClick={() => deleteNotification(notif.id)}
                        >
                          <Trash2 className="ms-3 h-4 w-4" />
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
              className="flex flex-col items-center justify-center py-20 text-center bg-[#0A1628] border border-white/[0.05] border-dashed rounded-[2rem]"
            >
              <div className="w-20 h-20 bg-white/[0.02] border border-white/[0.05] rounded-full flex items-center justify-center mb-6">
                <Bell className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white/60 mb-2">لا توجد إشعارات لعرضها</h3>
              <p className="text-white/30">يبدو أن صندوق الإشعارات الخاص بك فارغ حالياً.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
