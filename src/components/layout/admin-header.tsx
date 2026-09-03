'use client'

import React, { useState } from 'react'
import { Bell, Search, Menu, ChevronLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { sidebarGroups } from './admin-sidebar'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function AdminHeader({ userRole = 'CUSTOMER', userName }: { userRole?: string; userName?: string | null }) {
  const pathname = usePathname()
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const translate = (path: string) => {
    const dict: Record<string, string> = {
      admin: 'الرئيسية',
      products: 'المنتجات',
      orders: 'الطلبات',
      categories: 'التصنيفات',
      customers: 'العملاء',
      users: 'فريق العمل',
      settings: 'الإعدادات',
      profile: 'الملف الشخصي',
      notifications: 'الإشعارات',
      new: 'إضافة جديد',
    }
    return dict[path] || path
  }

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean)
    if (paths.length <= 1) return (
      <div className="hidden lg:flex items-center text-lg font-black text-slate-800 drop-shadow-sm">
        نظرة عامة
      </div>
    )

    return (
      <div className="hidden lg:flex items-center gap-2 text-sm font-bold text-slate-400">
        {paths.map((path, index) => (
          <React.Fragment key={`${path}-${index}`}>
            <span className={index === paths.length - 1 ? 'text-slate-800 font-black text-lg drop-shadow-sm' : 'hover:text-amber-500 cursor-pointer transition-colors'}>
              {translate(path)}
            </span>
            {index < paths.length - 1 && <ChevronLeft className="w-4 h-4 text-slate-300" />}
          </React.Fragment>
        ))}
      </div>
    )
  }

  return (
    <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-white shadow-[0_4px_30px_rgba(0,0,0,0.03)] flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-4">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger render={
            <Button variant="ghost" size="icon" className="lg:hidden text-slate-600 hover:bg-slate-100 hover:text-amber-500 w-10 h-10 rounded-2xl transition-colors shadow-sm bg-white border border-slate-100">
              <Menu className="w-5 h-5" />
            </Button>
          } />
          <SheetContent side="right" className="w-72 bg-[#050B14] border-e border-white/10 p-0 text-white/70">
            <SheetHeader className="h-16 flex items-center justify-center border-b border-white/5 bg-[#010306]/50 px-6">
              <SheetTitle className="text-white text-lg font-black drop-shadow-md">القائمة الرئيسية</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto py-6 px-4 space-y-6 scrollbar-none h-[calc(100vh-64px)]">
              {sidebarGroups.map((group, groupIdx) => {
                const visibleItems = group.items.filter(item =>
                  !item.allowedRoles || item.allowedRoles.includes(userRole)
                )
                if (visibleItems.length === 0) return null

                return (
                  <div key={groupIdx}>
                    <h3 className="px-4 text-[11px] font-black text-white/40 uppercase tracking-widest mb-3">
                      {group.title}
                    </h3>
                    <div className="space-y-1.5">
                      {visibleItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              'flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-sm',
                              isActive
                                ? 'bg-gradient-to-r from-amber-500/10 to-transparent text-amber-400 font-bold border-r-4 border-amber-400'
                                : 'text-white/60 hover:bg-white/5 hover:text-white border-r-4 border-transparent'
                            )}
                          >
                            <item.icon className={cn('w-5 h-5 shrink-0 transition-all duration-300', isActive ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-white/40')} />
                            <span>{item.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </SheetContent>
        </Sheet>
        {getBreadcrumbs()}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64 group">
          <Search className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
          <Input
            type="text"
            placeholder="بحث في لوحة التحكم..."
            className="ps-4 pe-10 bg-slate-50/50 border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 rounded-xl h-10 transition-all text-sm shadow-inner"
          />
        </div>

        <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative w-10 h-10 flex items-center justify-center text-slate-500 hover:text-amber-600 bg-slate-50 hover:bg-amber-50 rounded-xl transition-all border border-slate-100 hover:border-amber-200 shadow-sm"
            aria-label="الإشعارات"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 end-2.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.8)] border-2 border-white" />
          </button>
          <SheetContent side="left" className="w-full sm:max-w-md border-e-0 shadow-2xl p-0 flex flex-col bg-[#FBFBFD]">
            <SheetHeader className="p-6 bg-white border-b border-slate-100 shadow-sm z-10">
              <div className="flex items-center justify-between flex-row">
                <button className="text-sm font-bold text-amber-500 hover:text-amber-600 transition-colors">
                  تحديد الكل كمقروء
                </button>
                <SheetTitle className="text-xl font-black text-slate-800">الإشعارات</SheetTitle>
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-slate-200/50">
                <Bell className="w-10 h-10 text-slate-300 drop-shadow-sm" />
              </div>
              <h3 className="font-black text-slate-800 text-xl mb-2">لا توجد إشعارات جديدة</h3>
              <p className="text-slate-500 text-base max-w-[250px] leading-relaxed">أنت على اطلاع دائم بجميع التحديثات والنشاطات في متجرك.</p>
            </div>
          </SheetContent>
        </Sheet>

        {/* User Avatar */}
        <Link href="/admin/profile" className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-[#050B14] font-black shadow-[0_5px_15px_rgba(251,191,36,0.3)] hover:shadow-[0_8px_20px_rgba(251,191,36,0.5)] hover:-translate-y-0.5 transition-all text-base" title="الملف الشخصي">
          {userName ? userName[0] : 'أ'}
        </Link>
      </div>
    </header>
  )
}
