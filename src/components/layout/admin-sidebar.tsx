'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tags,
  Users,
  Settings,
  LogOut,
  Shield,
  Store,
  User,
  ChevronLeft,
  ChevronsLeft,
  UserCog,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

import { LucideIcon } from 'lucide-react'

export type SidebarItem = {
  name: string
  href: string
  icon: LucideIcon
  allowedRoles?: string[]
}

export type SidebarGroup = {
  title: string
  items: SidebarItem[]
}

export const sidebarGroups: SidebarGroup[] = [
  {
    title: 'نظرة عامة',
    items: [
      { name: 'الرئيسية', href: '/admin', icon: LayoutDashboard },
    ]
  },
  {
    title: 'التجارة',
    items: [
      { name: 'الطلبات', href: '/admin/orders', icon: ShoppingCart, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SALES'] },
      { name: 'المنتجات', href: '/admin/products', icon: Package, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EDITOR'] },
      { name: 'التصنيفات', href: '/admin/categories', icon: Tags, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
      { name: 'المستخدمين', href: '/admin/users', icon: UserCog, allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
    ]
  },
  {
    title: 'النظام',
    items: [
      { name: 'إعدادات المتجر', href: '/admin/settings', icon: Settings, allowedRoles: ['SUPER_ADMIN'] },
      { name: 'الملف الشخصي', href: '/admin/profile', icon: User },
    ]
  }
]

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: 'مدير النظام',
  ADMIN: 'مدير',
  MANAGER: 'مشرف',
  SALES: 'مبيعات',
  WAREHOUSE: 'مخازن',
  SUPPORT: 'دعم فني',
  EDITOR: 'محرر',
  CUSTOMER: 'عميل',
}

export function AdminSidebar({ storeName = 'گفتي بلس', logoUrl, user }: { storeName?: string, logoUrl?: string | null, user?: any }) {
  const pathname = usePathname()
  const userRole = user?.role || 'CUSTOMER'
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'fixed inset-y-0 start-0 z-50 bg-slate-900 text-slate-300 hidden lg:flex flex-col transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Logo Header */}
      <div className={cn(
        'h-16 flex items-center bg-slate-950/50 border-b border-slate-800/50 transition-all duration-300',
        isCollapsed ? 'px-0 justify-center' : 'px-5 justify-between'
      )}>
        {isCollapsed ? (
          <Link href="/admin" className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0 hover:bg-indigo-400 transition-colors">
            <Store className="w-5 h-5" />
          </Link>
        ) : (
          <>
            <Link href="/admin" className="flex items-center gap-3 min-w-0">
              {logoUrl ? (
                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-white">
                  <img src={logoUrl} alt={storeName} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-indigo-500/20">
                  <Store className="w-4 h-4" />
                </div>
              )}
              <span className="text-base font-bold text-white truncate tracking-wide">{storeName}</span>
            </Link>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-none py-4 px-3 space-y-6">
        {sidebarGroups.map((group, groupIdx) => {
          const visibleItems = group.items.filter(item =>
            !item.allowedRoles || item.allowedRoles.includes(userRole)
          )

          if (visibleItems.length === 0) return null

          return (
            <div key={groupIdx}>
              {!isCollapsed && (
                <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  {group.title}
                </h3>
              )}
              {isCollapsed && groupIdx > 0 && (
                <div className="border-t border-slate-800/50 mb-3 mx-1" />
              )}
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))
                  return (
                    <div key={item.name} className="relative group/item">
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-xl transition-all duration-150',
                          isCollapsed ? 'px-0 py-3 justify-center' : 'px-3 py-2.5',
                          isActive
                            ? 'bg-indigo-500/15 text-indigo-400 font-semibold'
                            : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                        )}
                      >
                        {isActive && (
                          <span className="absolute end-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-indigo-400 rounded-full" />
                        )}
                        <item.icon className={cn(
                          'shrink-0 transition-colors duration-150',
                          isCollapsed ? 'w-5 h-5' : 'w-4.5 h-4.5',
                          isActive ? 'text-indigo-400' : 'text-slate-500 group-hover/item:text-slate-300'
                        )} />
                        {!isCollapsed && <span className="text-sm truncate">{item.name}</span>}
                      </Link>
                      {/* Tooltip when collapsed */}
                      {isCollapsed && (
                        <div className="absolute end-full top-1/2 -translate-y-1/2 me-3 px-2.5 py-1.5 bg-slate-800 text-slate-200 text-xs font-bold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none z-50">
                          {item.name}
                          <span className="absolute top-1/2 -translate-y-1/2 start-full border-4 border-transparent border-s-slate-800" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Collapse Toggle */}
      <div className={cn('px-3 pb-2', isCollapsed && 'flex justify-center px-0')}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'flex items-center gap-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-xl transition-all duration-150 text-xs font-bold',
            isCollapsed ? 'w-10 h-10 justify-center' : 'w-full px-3 py-2.5'
          )}
          title={isCollapsed ? 'توسيع القائمة' : 'تصغير القائمة'}
        >
          <ChevronsLeft className={cn('w-4 h-4 transition-transform duration-300 shrink-0', isCollapsed && 'rotate-180')} />
          {!isCollapsed && <span>تصغير القائمة</span>}
        </button>
      </div>

      {/* User Profile */}
      <div className={cn('p-3 bg-slate-950/30 border-t border-slate-800/50', isCollapsed && 'px-2')}>
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <div className={cn(
              'flex items-center gap-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 cursor-pointer hover:bg-slate-800 transition-colors group',
              isCollapsed ? 'p-2 justify-center' : 'p-3'
            )}>
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold shrink-0 border border-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors text-sm">
                {user?.name ? user.name[0] : 'أ'}
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{user?.name || 'المدير'}</p>
                    <p className="text-xs text-slate-400 truncate">{roleLabels[userRole] || userRole}</p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0" />
                </>
              )}
            </div>
          } />
          <DropdownMenuContent align="end" side="top" className="w-64 rounded-2xl shadow-xl border-slate-700 bg-slate-900 p-2 text-slate-300 mb-2" sideOffset={10}>
            <DropdownMenuLabel className="text-xs text-slate-500 font-bold px-2 py-1.5 uppercase tracking-wider">حسابي</DropdownMenuLabel>
            <div className="px-2 py-2 mb-1">
              <p className="text-sm font-bold text-white">{user?.name || 'المدير'}</p>
              <p className="text-xs text-slate-400 mt-0.5 font-mono" dir="rtl">{user?.email || ''}</p>
            </div>
            <DropdownMenuSeparator className="my-1 bg-slate-800" />
            <Link href="/admin/profile">
              <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 hover:bg-slate-800 hover:text-white font-medium focus:bg-slate-800 focus:text-white">
                <User className="me-3 h-4 w-4 text-indigo-400" />
                الملف الشخصي
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator className="my-2 bg-slate-800" />
            <DropdownMenuItem
              className="rounded-xl cursor-pointer py-2.5 font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 focus:bg-rose-500/10 focus:text-rose-300"
              onClick={(e) => {
                e.preventDefault();
                signOut({ callbackUrl: '/auth/login' })
              }}
            >
              <LogOut className="me-3 h-4 w-4" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
