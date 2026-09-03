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

export function AdminSidebar({ 
  storeName = 'گفتي بلس', 
  logoUrl, 
  user,
  isCollapsed,
  setIsCollapsed
}: { 
  storeName?: string, 
  logoUrl?: string | null, 
  user?: any,
  isCollapsed: boolean,
  setIsCollapsed: (v: boolean) => void
}) {
  const pathname = usePathname()
  const userRole = user?.role || 'CUSTOMER'

  return (
    <aside
      className={cn(
        'fixed inset-y-0 start-0 z-50 bg-[#050B14] border-e border-white/5 text-white/70 hidden lg:flex flex-col transition-all duration-300 ease-in-out shadow-[10px_0_30px_rgba(0,0,0,0.15)] relative overflow-hidden',
        isCollapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Soft Background Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Logo Header */}
      <div className={cn(
        'h-16 flex items-center bg-[#010306]/50 border-b border-white/5 transition-all duration-300',
        isCollapsed ? 'px-0 justify-center' : 'px-6 justify-between'
      )}>
        {isCollapsed ? (
          <Link href="/admin" className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-lg shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-transform hover:scale-110 bg-gradient-to-tr from-amber-400 to-amber-600 text-[#050B14] shrink-0">
            G
          </Link>
        ) : (
          <Link href="/admin" className="flex items-center gap-3 min-w-0 group">
            {logoUrl ? (
              <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-white/10 p-1 border border-white/10 group-hover:border-amber-400/50 transition-colors shadow-lg">
                <img src={logoUrl} alt={storeName} className="w-full h-full object-cover rounded-md" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-lg shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-transform group-hover:scale-105 bg-gradient-to-tr from-amber-400 to-amber-600 text-[#050B14] shrink-0">
                G
              </div>
            )}
            <span className="text-lg font-black text-white truncate tracking-wide drop-shadow-md">{storeName}</span>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-none py-6 px-4 space-y-8">
        {sidebarGroups.map((group, groupIdx) => {
          const visibleItems = group.items.filter(item =>
            !item.allowedRoles || item.allowedRoles.includes(userRole)
          )

          if (visibleItems.length === 0) return null

          return (
            <div key={groupIdx}>
              {!isCollapsed && (
                <h3 className="px-4 text-[11px] font-black text-white/40 uppercase tracking-widest mb-3">
                  {group.title}
                </h3>
              )}
              {isCollapsed && groupIdx > 0 && (
                <div className="border-t border-white/5 mb-4 mx-2" />
              )}
              <div className="space-y-1.5">
                {visibleItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))
                  return (
                    <div key={item.name} className="relative group/item">
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-xl transition-all duration-300',
                          isCollapsed ? 'px-0 py-3.5 justify-center' : 'px-3 py-2.5',
                          isActive
                            ? 'bg-gradient-to-r from-amber-500/10 to-transparent text-amber-400 font-bold border-r-4 border-amber-400 shadow-[inset_0_0_20px_rgba(251,191,36,0.05)]'
                            : 'text-white/60 hover:bg-white/5 hover:text-white border-r-4 border-transparent'
                        )}
                      >
                        <item.icon className={cn(
                          'shrink-0 transition-all duration-300',
                          isCollapsed ? 'w-6 h-6' : 'w-5 h-5',
                          isActive ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-white/40 group-hover/item:text-white/80'
                        )} />
                        {!isCollapsed && <span className="text-sm truncate">{item.name}</span>}
                      </Link>
                      {/* Tooltip when collapsed */}
                      {isCollapsed && (
                        <div className="absolute end-full top-1/2 -translate-y-1/2 me-3 px-2 py-1.5 bg-[#050B14] text-white text-xs font-bold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none z-50 border border-white/10">
                          {item.name}
                          <span className="absolute top-1/2 -translate-y-1/2 start-full border-4 border-transparent border-s-[#050B14]" />
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
      <div className={cn('px-4 pb-4', isCollapsed && 'flex justify-center px-0')}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'flex items-center gap-3 text-white/50 hover:text-white hover:bg-white/5 rounded-2xl transition-all duration-300 text-xs font-bold border border-transparent hover:border-white/5 shadow-sm',
            isCollapsed ? 'w-12 h-12 justify-center' : 'w-full px-4 py-3'
          )}
          title={isCollapsed ? 'توسيع القائمة' : 'تصغير القائمة'}
        >
          <ChevronsLeft className={cn('w-5 h-5 transition-transform duration-500 shrink-0', isCollapsed && 'rotate-180')} />
          {!isCollapsed && <span>تصغير القائمة</span>}
        </button>
      </div>

      {/* User Profile */}
      <div className={cn('p-4 bg-[#010306]/80 border-t border-white/5 backdrop-blur-md', isCollapsed && 'px-2 flex justify-center')}>
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <div className={cn(
              'flex items-center gap-3 rounded-xl cursor-pointer transition-all duration-300 group',
              isCollapsed ? 'p-0 justify-center hover:scale-110' : 'p-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-400/30'
            )}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-[#050B14] font-black shrink-0 shadow-[0_0_15px_rgba(251,191,36,0.3)] group-hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all text-base">
                {user?.name ? user.name[0] : 'أ'}
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{user?.name || 'المدير'}</p>
                    <p className="text-xs text-white/50 truncate font-medium">{roleLabels[userRole] || userRole}</p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-white/40 group-hover:text-amber-400 transition-colors shrink-0" />
                </>
              )}
            </div>
          } />
          <DropdownMenuContent align={isCollapsed ? "center" : "end"} side="top" className="w-56 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10 bg-[#050B14]/95 backdrop-blur-xl p-1.5 text-white mb-4" sideOffset={10}>
            <DropdownMenuLabel className="text-[10px] text-white/40 font-bold px-2 py-1.5 uppercase tracking-wider">حسابي</DropdownMenuLabel>
            <div className="px-2 py-1.5 mb-1 bg-white/5 rounded-lg border border-white/5">
              <p className="text-sm font-bold text-white mb-0.5">{user?.name || 'المدير'}</p>
              <p className="text-xs text-white/50 font-mono truncate" dir="rtl">{user?.email || ''}</p>
            </div>
            <DropdownMenuSeparator className="my-1.5 bg-white/10" />
            <Link href="/admin/profile">
              <DropdownMenuItem className="rounded-lg cursor-pointer py-2 px-2 hover:bg-white/10 hover:text-white font-bold focus:bg-white/10 focus:text-white transition-colors">
                <User className="me-2 h-4 w-4 text-amber-400" />
                الملف الشخصي
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator className="my-1.5 bg-white/10" />
            <DropdownMenuItem
              className="rounded-lg cursor-pointer py-2 px-2 font-bold text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 focus:bg-rose-500/20 focus:text-rose-300 transition-colors"
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
