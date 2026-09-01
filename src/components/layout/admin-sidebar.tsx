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
  Bell,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarItems = [
  { name: 'الرئيسية', href: '/admin', icon: LayoutDashboard },
  { name: 'الطلبات', href: '/admin/orders', icon: ShoppingCart },
  { name: 'المنتجات', href: '/admin/products', icon: Package },
  { name: 'التصنيفات', href: '/admin/categories', icon: Tags },
  { name: 'العملاء', href: '/admin/customers', icon: Users },
  { name: 'فريق العمل', href: '/admin/profile', icon: Shield },
  { name: 'الإشعارات', href: '/admin/notifications', icon: Bell },
  { name: 'الإعدادات', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar({ storeName = 'گفتي بلس', logoUrl }: { storeName?: string, logoUrl?: string | null }) {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-72 bg-white border-l border-slate-200 hidden lg:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <Link href="/admin" className="flex items-center gap-3">
          {logoUrl ? (
            <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-slate-200">
              <img src={logoUrl} alt={storeName} className="w-full h-full object-cover bg-white" />
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white font-bold shrink-0">
              {storeName ? storeName.charAt(0) : 'G'}
            </div>
          )}
          <span className="text-xl font-bold text-slate-800 truncate">{storeName}</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive ? 'text-primary' : 'text-slate-400')} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 border border-primary/20">
            أ
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">أحمد الإداري</p>
            <p className="text-xs text-slate-500 truncate">admin@giftstore.com</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/auth/login' })} title="تسجيل الخروج" className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-all shadow-sm border border-slate-100 shrink-0">
            <LogOut className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
