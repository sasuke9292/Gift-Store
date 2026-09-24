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
  ExternalLink,
  Gift,
  MessageCircle,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
      { name: 'لوحة التحكم', href: '/admin', icon: LayoutDashboard },
    ]
  },
  {
    title: 'إدارة المتجر',
    items: [
      { name: 'طلبات WhatsApp', href: '/admin/orders', icon: MessageCircle, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SALES'] },
      { name: 'المنتجات', href: '/admin/products', icon: Package, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EDITOR'] },
      { name: 'التصنيفات', href: '/admin/categories', icon: Tags, allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
      { name: 'المستخدمين', href: '/admin/users', icon: UserCog, allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
    ]
  },
  {
    title: 'النظام والإعدادات',
    items: [
      { name: 'إعدادات WhatsApp', href: '/admin/settings?tab=whatsapp', icon: MessageCircle, allowedRoles: ['SUPER_ADMIN'] },
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
  storeName = 'گِفتي بلس', 
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
        'fixed inset-y-0 start-0 z-50 bg-white border-e border-[#E8E4DF] text-[#78716C] hidden lg:flex flex-col transition-all duration-300 ease-in-out shadow-[1px_0_10px_rgba(0,0,0,0.02)]',
        isCollapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Logo Header */}
      <div className={cn(
        'h-16 flex items-center border-b border-[#E8E4DF] transition-all duration-300 shrink-0 bg-white',
        isCollapsed ? 'px-0 justify-center' : 'px-5 justify-between'
      )}>
        {isCollapsed ? (
          <Link 
            href="/admin" 
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-base shadow-[0_2px_8px_rgba(19, 33, 60,0.35)] transition-all hover:scale-105 shrink-0"
            style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
            title={storeName}
          >
            <Gift className="w-5 h-5 text-white" />
          </Link>
        ) : (
          <Link href="/admin" className="flex items-center gap-3 min-w-0 group">
            {logoUrl ? (
              <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-[#FAFAF8] p-1 border border-[#E8E4DF] group-hover:border-[#13213c]/50 transition-colors">
                <img src={logoUrl} alt={storeName} className="w-full h-full object-cover rounded-lg" />
              </div>
            ) : (
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shadow-[0_2px_8px_rgba(19, 33, 60,0.35)] shrink-0 transition-transform group-hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
              >
                <Gift className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-base font-black text-[#1C1917] truncate tracking-tight block">{storeName}</span>
              <span className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-widest block">لوحة الإدارة</span>
            </div>
          </Link>
        )}
      </div>

      {/* View Live Store Button */}
      <div className={cn('p-3', isCollapsed ? 'flex justify-center' : '')}>
        <Link
          href="/"
          target="_blank"
          className={cn(
            'flex items-center gap-2 rounded-xl text-xs font-bold text-[#78716C] hover:text-[#1C1917] bg-[#FAFAF8] hover:bg-[#F5F0EA] border border-[#E8E4DF] transition-all duration-200',
            isCollapsed ? 'w-10 h-10 justify-center p-0' : 'px-3 py-2 w-full justify-between'
          )}
          title="معاينة المتجر"
        >
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[#13213c]" />
            {!isCollapsed && <span>معاينة المتجر</span>}
          </div>
          {!isCollapsed && <ExternalLink className="w-3.5 h-3.5 text-[#A8A29E]" />}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-none px-3 py-2 space-y-5">
        {sidebarGroups.map((group, groupIdx) => {
          const visibleItems = group.items.filter(item =>
            !item.allowedRoles || item.allowedRoles.includes(userRole)
          )
          if (visibleItems.length === 0) return null

          return (
            <div key={groupIdx}>
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-bold text-[#A8A29E] uppercase tracking-wider mb-2">
                  {group.title}
                </p>
              )}
              {isCollapsed && groupIdx > 0 && (
                <div className="border-t border-[#E8E4DF] my-3 mx-1" />
              )}
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))
                  return (
                    <div key={item.name} className="relative group/item">
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-xl transition-all duration-200 text-sm',
                          isCollapsed ? 'px-0 py-3 justify-center w-full' : 'px-3 py-2.5',
                          isActive
                            ? 'bg-[#F0F4F9] text-[#13213c] font-black border border-[#13213c]/30 shadow-[0_1px_4px_rgba(19, 33, 60,0.12)]'
                            : 'text-[#78716C] hover:bg-[#FAFAF8] hover:text-[#1C1917] border border-transparent font-medium'
                        )}
                      >
                        <item.icon className={cn(
                          'shrink-0 transition-colors duration-200',
                          isCollapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]',
                          isActive ? 'text-[#13213c]' : 'text-[#A8A29E] group-hover/item:text-[#1C1917]'
                        )} />
                        {!isCollapsed && (
                          <span className="truncate">{item.name}</span>
                        )}
                        {isActive && !isCollapsed && (
                          <div className="ms-auto w-1.5 h-1.5 rounded-full bg-[#13213c]" />
                        )}
                      </Link>

                      {/* Tooltip when collapsed */}
                      {isCollapsed && (
                        <div className="absolute end-full top-1/2 -translate-y-1/2 me-3 px-3 py-1.5 bg-[#1C1917] text-white text-xs font-bold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none z-50">
                          {item.name}
                          <span className="absolute top-1/2 -translate-y-1/2 start-full border-[5px] border-transparent border-s-[#1C1917]" />
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
      <div className={cn('px-3 pb-2 pt-1 border-t border-[#E8E4DF]/60', isCollapsed && 'flex justify-center px-0')}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'flex items-center gap-3 text-[#A8A29E] hover:text-[#1C1917] hover:bg-[#FAFAF8] rounded-xl transition-all duration-200 text-xs font-bold border border-transparent',
            isCollapsed ? 'w-10 h-10 justify-center' : 'w-full px-3 py-2'
          )}
          title={isCollapsed ? 'توسيع القائمة' : 'تصغير القائمة'}
        >
          <ChevronsLeft className={cn('w-4 h-4 transition-transform duration-300 shrink-0', isCollapsed && 'rotate-180')} />
          {!isCollapsed && <span>طي الشريط الجانبي</span>}
        </button>
      </div>

      {/* User Profile Footer */}
      <div className={cn(
        'border-t border-[#E8E4DF] bg-[#FAFAF8]',
        isCollapsed ? 'p-3 flex justify-center' : 'p-3'
      )}>
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <div className={cn(
              'flex items-center gap-3 rounded-xl cursor-pointer transition-all duration-200 group bg-white border border-[#E8E4DF] hover:border-[#13213c]/40 hover:shadow-sm',
              isCollapsed ? 'p-1.5 justify-center' : 'p-2.5 w-full'
            )}>
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black shrink-0 shadow-sm text-sm"
                style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
              >
                {user?.name ? user.name[0] : 'أ'}
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0 text-start">
                    <p className="text-sm font-bold text-[#1C1917] truncate leading-tight">{user?.name || 'المدير'}</p>
                    <p className="text-[11px] text-[#A8A29E] truncate font-medium">{roleLabels[userRole] || userRole}</p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#A8A29E] group-hover:text-[#13213c] transition-colors shrink-0" />
                </>
              )}
            </div>
          } />
          <DropdownMenuContent align={isCollapsed ? "center" : "end"} side="top" className="w-56 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] border-[#E8E4DF] bg-white p-2 text-[#1C1917] mb-2" sideOffset={8}>
            <div className="px-3 py-2 mb-1 bg-[#FAFAF8] rounded-xl border border-[#E8E4DF]">
              <p className="text-sm font-bold text-[#1C1917] mb-0.5">{user?.name || 'المدير'}</p>
              <p className="text-xs text-[#78716C] font-mono truncate" dir="ltr">{user?.email || ''}</p>
              <span className="inline-block mt-1 text-[10px] font-bold text-[#13213c] bg-[#F0F4F9] px-2 py-0.5 rounded-md">
                {roleLabels[userRole] || userRole}
              </span>
            </div>
            <DropdownMenuSeparator className="my-1 bg-[#E8E4DF]" />
            <Link href="/admin/profile">
              <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 px-3 hover:bg-[#FAFAF8] font-bold text-[#1C1917] transition-colors text-sm">
                <User className="me-2.5 h-4 w-4 text-[#13213c]" />
                الملف الشخصي
              </DropdownMenuItem>
            </Link>
            <Link href="/" target="_blank">
              <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 px-3 hover:bg-[#FAFAF8] font-bold text-[#1C1917] transition-colors text-sm">
                <Store className="me-2.5 h-4 w-4 text-[#78716C]" />
                زيارة المتجر
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator className="my-1 bg-[#E8E4DF]" />
            <DropdownMenuItem
              className="rounded-xl cursor-pointer py-2.5 px-3 font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors text-sm"
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
