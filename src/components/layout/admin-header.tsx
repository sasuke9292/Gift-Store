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
      <div className="hidden lg:flex items-center text-base font-bold text-slate-800">
        نظرة عامة
      </div>
    )

    return (
      <div className="hidden lg:flex items-center gap-1.5 text-sm font-medium text-slate-500">
        {paths.map((path, index) => (
          <React.Fragment key={`${path}-${index}`}>
            <span className={index === paths.length - 1 ? 'text-slate-900 font-bold text-base' : 'hover:text-slate-700 cursor-pointer transition-colors text-slate-400'}>
              {translate(path)}
            </span>
            {index < paths.length - 1 && <ChevronLeft className="w-3.5 h-3.5 text-slate-300" />}
          </React.Fragment>
        ))}
      </div>
    )
  }

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger render={
            <Button variant="ghost" size="icon" className="lg:hidden text-slate-500 hover:bg-slate-100 w-9 h-9 rounded-xl">
              <Menu className="w-5 h-5" />
            </Button>
          } />
          <SheetContent side="right" className="w-72 bg-slate-900 border-s border-slate-800 p-0 text-slate-300">
            <SheetHeader className="h-16 flex items-center justify-center border-b border-slate-800 bg-slate-950/50 px-4">
              <SheetTitle className="text-white text-lg font-bold">القائمة الرئيسية</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto py-4 px-3 space-y-5 scrollbar-none h-[calc(100vh-64px)]">
              {sidebarGroups.map((group, groupIdx) => {
                const visibleItems = group.items.filter(item =>
                  !item.allowedRoles || item.allowedRoles.includes(userRole)
                )
                if (visibleItems.length === 0) return null

                return (
                  <div key={groupIdx}>
                    <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                      {group.title}
                    </h3>
                    <div className="space-y-1">
                      {visibleItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm',
                              isActive
                                ? 'bg-indigo-500/15 text-indigo-400 font-semibold'
                                : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                            )}
                          >
                            <item.icon className={cn('w-4.5 h-4.5 shrink-0', isActive ? 'text-indigo-400' : 'text-slate-500')} />
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

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block w-56">
          <Search className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="بحث سريع..."
            className="ps-4 pe-10 bg-slate-100/60 border-transparent hover:bg-slate-100 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded-xl h-9 transition-all text-sm"
          />
        </div>

        <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            aria-label="الإشعارات"
          >
            <Bell className="w-5 h-5" />
          </button>
          <SheetContent side="left" className="w-full sm:max-w-md border-s-0 shadow-2xl p-0 flex flex-col bg-slate-50">
            <SheetHeader className="p-5 bg-white border-b border-slate-100">
              <div className="flex items-center justify-between flex-row-reverse">
                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                  تحديد الكل كمقروء
                </button>
                <SheetTitle className="text-xl font-bold text-slate-800">الإشعارات</SheetTitle>
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <Bell className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-700 text-lg mb-1">لا توجد إشعارات جديدة</h3>
              <p className="text-slate-500 text-sm max-w-[200px]">أنت على اطلاع دائم بجميع التحديثات في متجرك.</p>
            </div>
          </SheetContent>
        </Sheet>

        {/* User Avatar */}
        <Link href="/admin/profile" className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 font-bold text-sm hover:bg-indigo-500/20 transition-colors" title="الملف الشخصي">
          {userName ? userName[0] : 'أ'}
        </Link>
      </div>
    </header>
  )
}
