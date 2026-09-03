'use client'

import React, { useState } from 'react'
import { Bell, Search, Menu, ChevronLeft, ChevronRight } from 'lucide-react'
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
      <div className="hidden lg:flex items-center text-base font-black text-white/80">
        نظرة عامة
      </div>
    )

    return (
      <div className="hidden lg:flex items-center gap-1.5 text-sm font-medium text-white/30">
        {paths.map((path, index) => (
          <React.Fragment key={`${path}-${index}`}>
            <span className={index === paths.length - 1 ? 'text-white/80 font-black text-base' : 'hover:text-amber-400 cursor-pointer transition-colors'}>
              {translate(path)}
            </span>
            {index < paths.length - 1 && <ChevronLeft className="w-3.5 h-3.5 text-white/15" />}
          </React.Fragment>
        ))}
      </div>
    )
  }

  return (
    <header className="h-14 bg-[#060D1A]/95 backdrop-blur-xl border-b border-white/[0.05] flex items-center justify-between px-5 sticky top-0 z-40 shrink-0">
      <div className="flex items-center gap-3">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger render={
            <Button variant="ghost" size="icon" className="lg:hidden text-white/50 hover:bg-white/[0.06] hover:text-amber-400 w-9 h-9 rounded-xl transition-colors border border-white/[0.06]">
              <Menu className="w-4 h-4" />
            </Button>
          } />
          <SheetContent side="right" className="w-64 bg-[#030810] border-e border-white/[0.04] p-0 text-white/60">
            <SheetHeader className="h-14 flex items-center justify-center border-b border-white/[0.04] bg-black/20 px-5">
              <SheetTitle className="text-white/80 text-base font-black">القائمة الرئيسية</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto py-5 px-3 space-y-6 scrollbar-none h-[calc(100vh-56px)]">
              {sidebarGroups.map((group, groupIdx) => {
                const visibleItems = group.items.filter(item =>
                  !item.allowedRoles || item.allowedRoles.includes(userRole)
                )
                if (visibleItems.length === 0) return null
                return (
                  <div key={groupIdx}>
                    <p className="px-3 text-[10px] font-black text-white/25 uppercase tracking-[0.15em] mb-2">
                      {group.title}
                    </p>
                    <div className="space-y-0.5">
                      {visibleItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm border',
                              isActive
                                ? 'bg-amber-500/10 text-amber-400 font-bold border-amber-500/20'
                                : 'text-white/40 hover:bg-white/[0.04] hover:text-white/70 border-transparent'
                            )}
                          >
                            <item.icon className={cn('w-[18px] h-[18px] shrink-0', isActive ? 'text-amber-400' : 'text-white/30')} />
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

      <div className="flex items-center gap-2.5">
        {/* Search */}
        <div className="relative hidden md:block w-56 group">
          <Search className="absolute end-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 group-focus-within:text-amber-500 transition-colors" />
          <input
            type="text"
            placeholder="بحث..."
            className="w-full h-9 ps-3 pe-9 bg-white/[0.04] border border-white/[0.07] hover:border-white/[0.12] focus:border-amber-500/50 focus:bg-white/[0.06] rounded-xl transition-all text-sm text-white/70 placeholder:text-white/25 outline-none focus:ring-2 focus:ring-amber-500/10"
          />
        </div>

        {/* Notifications */}
        <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative w-9 h-9 flex items-center justify-center text-white/40 hover:text-amber-400 bg-white/[0.04] hover:bg-white/[0.07] rounded-xl transition-all border border-white/[0.06] hover:border-amber-500/20"
            aria-label="الإشعارات"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 end-2 w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(239,68,68,0.8)] border border-[#060D1A]" />
          </button>
          <SheetContent side="left" className="w-full sm:max-w-sm border-e-0 shadow-2xl p-0 flex flex-col bg-[#060D1A] border-s border-white/[0.05]">
            <SheetHeader className="p-5 bg-[#030810] border-b border-white/[0.05]">
              <div className="flex items-center justify-between flex-row">
                <button className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors">
                  تحديد الكل كمقروء
                </button>
                <SheetTitle className="text-white/80 text-lg font-black">الإشعارات</SheetTitle>
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white/[0.04] rounded-2xl flex items-center justify-center mb-5 border border-white/[0.06]">
                <Bell className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="font-black text-white/60 text-lg mb-2">لا توجد إشعارات</h3>
              <p className="text-white/30 text-sm max-w-[220px] leading-relaxed">أنت على اطلاع دائم بجميع التحديثات.</p>
            </div>
          </SheetContent>
        </Sheet>

        {/* User Avatar */}
        <Link
          href="/admin/profile"
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[#030810] font-black shadow-[0_0_12px_rgba(245,158,11,0.3)] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:scale-105 transition-all text-sm"
          title="الملف الشخصي"
        >
          {userName ? userName[0] : 'أ'}
        </Link>
      </div>
    </header>
  )
}
