'use client'

import React, { useState } from 'react'
import { Bell, Search, Menu, ChevronLeft, Store, ExternalLink } from 'lucide-react'
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
      users: 'المستخدمين',
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
      <div className="hidden lg:flex items-center text-sm font-black text-[#1C1917]">
        لوحة التحكم
      </div>
    )

    return (
      <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-[#78716C]">
        <Link href="/admin" className="hover:text-[#C9A96E] transition-colors">
          الرئيسية
        </Link>
        {paths.slice(1).map((path, index) => {
          const isLast = index === paths.length - 2
          return (
            <React.Fragment key={`${path}-${index}`}>
              <ChevronLeft className="w-3.5 h-3.5 text-[#A8A29E]" />
              <span className={isLast ? 'text-[#1C1917] font-black' : 'hover:text-[#C9A96E] transition-colors'}>
                {translate(path)}
              </span>
            </React.Fragment>
          )
        })}
      </div>
    )
  }

  return (
    <header className="h-16 bg-white/95 backdrop-blur-xl border-b border-[#E8E4DF] flex items-center justify-between px-5 sm:px-8 sticky top-0 z-40 shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger render={
            <Button variant="ghost" size="icon" className="lg:hidden text-[#1C1917] hover:bg-[#FAFAF8] w-9 h-9 rounded-xl transition-colors border border-[#E8E4DF]">
              <Menu className="w-4 h-4" />
            </Button>
          } />
          <SheetContent side="right" className="w-72 bg-white border-e border-[#E8E4DF] p-0 text-[#1C1917]">
            <SheetHeader className="h-16 flex items-center justify-center border-b border-[#E8E4DF] bg-[#FAFAF8] px-5">
              <SheetTitle className="text-[#1C1917] text-base font-black">لوحة التحكم الإدارية</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto py-5 px-3 space-y-6 scrollbar-none h-[calc(100vh-64px)]">
              {sidebarGroups.map((group, groupIdx) => {
                const visibleItems = group.items.filter(item =>
                  !item.allowedRoles || item.allowedRoles.includes(userRole)
                )
                if (visibleItems.length === 0) return null
                return (
                  <div key={groupIdx}>
                    <p className="px-3 text-[10px] font-black text-[#A8A29E] uppercase tracking-wider mb-2">
                      {group.title}
                    </p>
                    <div className="space-y-1">
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
                                ? 'bg-[#FBF6EE] text-[#A07850] font-black border-[#C9A96E]/30'
                                : 'text-[#78716C] hover:bg-[#FAFAF8] hover:text-[#1C1917] border-transparent font-medium'
                            )}
                          >
                            <item.icon className={cn('w-[18px] h-[18px] shrink-0', isActive ? 'text-[#C9A96E]' : 'text-[#A8A29E]')} />
                            <span>{item.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              
              <div className="pt-4 border-t border-[#E8E4DF]">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#FAFAF8] border border-[#E8E4DF] text-xs font-bold text-[#1C1917] hover:bg-[#F5F0EA] transition-colors"
                >
                  <Store className="w-4 h-4 text-[#C9A96E]" />
                  <span>معاينة المتجر</span>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        {getBreadcrumbs()}
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Search */}
        <div className="relative hidden md:block w-60 group">
          <Search className="absolute end-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E] group-focus-within:text-[#C9A96E] transition-colors" />
          <input
            type="text"
            placeholder="بحث سريع..."
            className="w-full h-10 ps-3 pe-10 bg-[#FAFAF8] border border-[#E8E4DF] hover:border-[#D5D0C9] focus:border-[#C9A96E]/50 focus:bg-white rounded-xl transition-all text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:ring-2 focus:ring-[#C9A96E]/15"
          />
        </div>

        {/* View Store Direct Button */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-[#FAFAF8] hover:bg-[#F5F0EA] border border-[#E8E4DF] text-xs font-bold text-[#1C1917] transition-all hover:border-[#C9A96E]/40"
          title="معاينة المتجر المباشر"
        >
          <Store className="w-4 h-4 text-[#C9A96E]" />
          <span>المتجر</span>
        </Link>

        {/* Notifications */}
        <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative w-10 h-10 flex items-center justify-center text-[#78716C] hover:text-[#1C1917] bg-[#FAFAF8] hover:bg-[#F5F0EA] rounded-xl transition-all border border-[#E8E4DF] hover:border-[#C9A96E]/30 cursor-pointer"
            aria-label="الإشعارات"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 end-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>
          <SheetContent side="left" className="w-full sm:max-w-sm border-e-0 shadow-2xl p-0 flex flex-col bg-white border-s border-[#E8E4DF]">
            <SheetHeader className="p-5 bg-[#FAFAF8] border-b border-[#E8E4DF]">
              <div className="flex items-center justify-between flex-row">
                <button className="text-xs font-bold text-[#C9A96E] hover:text-[#A07850] transition-colors cursor-pointer">
                  تحديد الكل كمقروء
                </button>
                <SheetTitle className="text-[#1C1917] text-base font-black">الإشعارات</SheetTitle>
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-[#FAFAF8] rounded-2xl flex items-center justify-center mb-4 border border-[#E8E4DF]">
                <Bell className="w-8 h-8 text-[#A8A29E]" />
              </div>
              <h3 className="font-bold text-[#1C1917] text-base mb-1">لا توجد إشعارات جديدة</h3>
              <p className="text-[#78716C] text-sm max-w-[220px] leading-relaxed">أنت على اطلاع دائم بجميع مستجدات المتجر والطلبات.</p>
            </div>
          </SheetContent>
        </Sheet>

        {/* User Avatar */}
        <Link
          href="/admin/profile"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-sm hover:scale-105 transition-all text-sm shrink-0"
          style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
          title={userName || 'الملف الشخصي'}
        >
          {userName ? userName[0] : 'أ'}
        </Link>
      </div>
    </header>
  )
}
