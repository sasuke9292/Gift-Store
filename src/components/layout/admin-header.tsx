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
export function AdminHeader({ userRole = 'CUSTOMER' }: { userRole?: string }) {
  const pathname = usePathname()
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean)
    if (paths.length <= 1) return (
      <div className="hidden lg:flex items-center text-lg font-bold text-slate-800">
        نظرة عامة
      </div>
    )

    const translate = (path: string) => {
      const dict: Record<string, string> = {
        admin: 'الرئيسية',
        products: 'المنتجات',
        orders: 'الطلبات',
        categories: 'التصنيفات',
        customers: 'العملاء',
        users: 'فريق العمل',
        settings: 'الإعدادات',
      }
      return dict[path] || path
    }

    return (
      <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-slate-500">
        {paths.map((path, index) => (
          <React.Fragment key={path}>
            <span className={index === paths.length - 1 ? 'text-slate-900 font-bold text-lg' : 'hover:text-slate-700 cursor-pointer transition-colors'}>
              {translate(path)}
            </span>
            {index < paths.length - 1 && <ChevronLeft className="w-4 h-4 text-slate-300" />}
          </React.Fragment>
        ))}
      </div>
    )
  }

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger render={
            <Button variant="ghost" size="icon" className="lg:hidden text-slate-500 hover:bg-slate-100">
              <Menu className="w-6 h-6" />
            </Button>
          } />
          <SheetContent side="right" className="w-72 bg-slate-900 border-s border-slate-800 p-0 text-slate-300">
            <SheetHeader className="h-20 flex items-center justify-center border-b border-slate-800 bg-slate-950/50 p-4">
              <SheetTitle className="text-white text-xl font-bold">القائمة الرئيسية</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-none h-[calc(100vh-80px)]">
              {sidebarGroups.map((group, groupIdx) => {
                const visibleItems = group.items.filter(item => 
                  !item.allowedRoles || item.allowedRoles.includes(userRole)
                )
                if (visibleItems.length === 0) return null

                return (
                  <div key={groupIdx}>
                    <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
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
                              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                              isActive
                                ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            )}
                          >
                            <item.icon className={cn('w-5 h-5 transition-transform duration-200 group-hover:scale-110', isActive ? 'text-indigo-400' : 'text-slate-500')} />
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

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block w-72">
          <Search className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            type="text" 
            placeholder="ابحث هنا..." 
            className="ps-4 pe-12 bg-slate-100/50 border-transparent hover:bg-slate-100 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded-full h-10 transition-all text-sm"
          />
        </div>

        <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          <SheetContent side="left" className="w-full sm:max-w-md border-s-0 shadow-2xl p-0 flex flex-col bg-slate-50">
            <SheetHeader className="p-6 bg-white border-b border-slate-100">
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
      </div>
    </header>
  )
}
