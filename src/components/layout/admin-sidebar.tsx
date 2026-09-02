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
  Store
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarGroups = [
  {
    title: 'نظرة عامة',
    items: [
      { name: 'الرئيسية', href: '/admin', icon: LayoutDashboard },
    ]
  },
  {
    title: 'التجارة',
    items: [
      { name: 'الطلبات', href: '/admin/orders', icon: ShoppingCart },
      { name: 'المنتجات', href: '/admin/products', icon: Package },
      { name: 'التصنيفات', href: '/admin/categories', icon: Tags },
    ]
  },
  {
    title: 'المستخدمين',
    items: [
      { name: 'العملاء', href: '/admin/customers', icon: Users },
      { name: 'فريق العمل', href: '/admin/users', icon: Shield },
    ]
  },
  {
    title: 'النظام',
    items: [
      { name: 'إعدادات المتجر', href: '/admin/settings', icon: Settings },
    ]
  }
]

export function AdminSidebar({ storeName = 'گفتي بلس', logoUrl, user }: { storeName?: string, logoUrl?: string | null, user?: any }) {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-72 bg-slate-900 text-slate-300 hidden lg:flex flex-col">
      <div className="h-16 flex items-center px-6 bg-slate-950/50">
        <Link href="/admin" className="flex items-center gap-3 w-full">
          {logoUrl ? (
            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-white">
              <img src={logoUrl} alt={storeName} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-indigo-500/20">
              <Store className="w-4 h-4" />
            </div>
          )}
          <span className="text-lg font-bold text-white truncate tracking-wide">{storeName}</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-none">
        {sidebarGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))
                return (
                  <Link
                    key={item.name}
                    href={item.href}
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
        ))}
      </div>

      <div className="p-4 bg-slate-950/30">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold shrink-0 border border-indigo-500/20">
            {user?.name ? user.name[0] : 'م'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.name || 'مدير النظام'}</p>
            <p className="text-xs text-slate-400 truncate" dir="ltr">{user?.email || 'admin@giftstore.com'}</p>
          </div>
          <button 
            onClick={(e) => { 
              e.preventDefault(); 
              signOut({ callbackUrl: '/auth/login' }) 
            }} 
            title="تسجيل الخروج" 
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-all shrink-0"
          >
            <LogOut className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
