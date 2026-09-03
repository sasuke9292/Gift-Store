'use client'

import React from 'react'
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
        'fixed inset-y-0 start-0 z-50 bg-[#030810] border-e border-white/[0.04] text-white/60 hidden lg:flex flex-col transition-all duration-300 ease-in-out relative overflow-hidden',
        isCollapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-32 h-32 bg-amber-600/[0.03] rounded-full blur-2xl pointer-events-none" />

      {/* Logo Header */}
      <div className={cn(
        'h-16 flex items-center border-b border-white/[0.04] transition-all duration-300 shrink-0',
        isCollapsed ? 'px-0 justify-center' : 'px-5 justify-between'
      )}>
        {isCollapsed ? (
          <Link href="/admin" className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-base shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-105 bg-gradient-to-br from-amber-400 to-amber-600 text-[#030810] shrink-0">
            G
          </Link>
        ) : (
          <Link href="/admin" className="flex items-center gap-3 min-w-0 group">
            {logoUrl ? (
              <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-white/5 p-1 border border-white/10 group-hover:border-amber-400/40 transition-colors">
                <img src={logoUrl} alt={storeName} className="w-full h-full object-cover rounded-lg" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-base shadow-[0_0_20px_rgba(245,158,11,0.25)] bg-gradient-to-br from-amber-400 to-amber-600 text-[#030810] shrink-0 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all">
                G
              </div>
            )}
            <span className="text-base font-black text-white/90 truncate tracking-wide">{storeName}</span>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-none py-5 px-3 space-y-6">
        {sidebarGroups.map((group, groupIdx) => {
          const visibleItems = group.items.filter(item =>
            !item.allowedRoles || item.allowedRoles.includes(userRole)
          )
          if (visibleItems.length === 0) return null

          return (
            <div key={groupIdx}>
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-black text-white/25 uppercase tracking-[0.15em] mb-2">
                  {group.title}
                </p>
              )}
              {isCollapsed && groupIdx > 0 && (
                <div className="border-t border-white/[0.04] mb-4 mx-1" />
              )}
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))
                  return (
                    <div key={item.name} className="relative group/item">
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-xl transition-all duration-200',
                          isCollapsed ? 'px-0 py-3 justify-center w-full' : 'px-3 py-2.5',
                          isActive
                            ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20 shadow-[inset_0_1px_0_rgba(245,158,11,0.1)]'
                            : 'text-white/40 hover:bg-white/[0.04] hover:text-white/70 border border-transparent'
                        )}
                      >
                        <item.icon className={cn(
                          'shrink-0 transition-all duration-200',
                          isCollapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]',
                          isActive ? 'text-amber-400' : 'text-white/30 group-hover/item:text-white/60'
                        )} />
                        {!isCollapsed && (
                          <span className="text-sm truncate">{item.name}</span>
                        )}
                        {isActive && !isCollapsed && (
                          <div className="ms-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                        )}
                      </Link>
                      {/* Tooltip when collapsed */}
                      {isCollapsed && (
                        <div className="absolute end-full top-1/2 -translate-y-1/2 me-3 px-2.5 py-1.5 bg-[#0A1628] text-white text-xs font-bold rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.5)] whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none z-50 border border-white/10">
                          {item.name}
                          <span className="absolute top-1/2 -translate-y-1/2 start-full border-[5px] border-transparent border-s-[#0A1628]" />
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
      <div className={cn('px-3 pb-3', isCollapsed && 'flex justify-center px-0')}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'flex items-center gap-3 text-white/25 hover:text-white/60 hover:bg-white/[0.04] rounded-xl transition-all duration-200 text-xs font-bold border border-transparent hover:border-white/[0.06]',
            isCollapsed ? 'w-10 h-10 justify-center' : 'w-full px-3 py-2.5'
          )}
          title={isCollapsed ? 'توسيع القائمة' : 'تصغير القائمة'}
        >
          <ChevronsLeft className={cn('w-4 h-4 transition-transform duration-500 shrink-0', isCollapsed && 'rotate-180')} />
          {!isCollapsed && <span>تصغير</span>}
        </button>
      </div>

      {/* User Profile */}
      <div className={cn(
        'border-t border-white/[0.04] bg-black/20',
        isCollapsed ? 'p-3 flex justify-center' : 'p-3'
      )}>
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <div className={cn(
              'flex items-center gap-3 rounded-xl cursor-pointer transition-all duration-200 group',
              isCollapsed
                ? 'p-0 justify-center hover:scale-105'
                : 'p-2.5 hover:bg-white/[0.05] border border-white/[0.04] hover:border-amber-500/20'
            )}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[#030810] font-black shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all text-sm">
                {user?.name ? user.name[0] : 'أ'}
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white/80 truncate leading-none mb-0.5">{user?.name || 'المدير'}</p>
                    <p className="text-[11px] text-white/30 truncate font-medium">{roleLabels[userRole] || userRole}</p>
                  </div>
                  <ChevronLeft className="w-3.5 h-3.5 text-white/25 group-hover:text-amber-400 transition-colors shrink-0" />
                </>
              )}
            </div>
          } />
          <DropdownMenuContent align={isCollapsed ? "center" : "end"} side="top" className="w-52 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border-white/10 bg-[#0A1628] backdrop-blur-xl p-1.5 text-white mb-2" sideOffset={8}>
            <div className="px-2.5 py-2 mb-1 bg-white/5 rounded-lg border border-white/5">
              <p className="text-sm font-bold text-white/90 mb-0.5">{user?.name || 'المدير'}</p>
              <p className="text-xs text-white/40 font-mono truncate" dir="rtl">{user?.email || ''}</p>
            </div>
            <DropdownMenuSeparator className="my-1 bg-white/[0.06]" />
            <Link href="/admin/profile">
              <DropdownMenuItem className="rounded-lg cursor-pointer py-2 px-2.5 hover:bg-white/[0.08] hover:text-white font-bold focus:bg-white/[0.08] focus:text-white transition-colors text-white/60 text-sm">
                <User className="me-2 h-4 w-4 text-amber-400" />
                الملف الشخصي
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator className="my-1 bg-white/[0.06]" />
            <DropdownMenuItem
              className="rounded-lg cursor-pointer py-2 px-2.5 font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 focus:bg-rose-500/10 focus:text-rose-300 transition-colors text-sm"
              onClick={(e) => {
                e.preventDefault();
                signOut({ callbackUrl: '/auth/login' })
              }}
            >
              <LogOut className="me-2.5 h-4 w-4" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
