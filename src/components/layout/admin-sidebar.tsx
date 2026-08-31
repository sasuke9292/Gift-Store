'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tags,
  Users,
  ArchiveRestore,
  TicketPercent,
  Truck,
  CreditCard,
  MessageSquare,
  Gift,
  Image as ImageIcon,
  FileText,
  BarChart3,
  Bell,
  UserCog,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarItems = [
  { name: 'الرئيسية', href: '/admin', icon: LayoutDashboard },
  { name: 'الطلبات', href: '/admin/orders', icon: ShoppingCart },
  { name: 'المنتجات', href: '/admin/products', icon: Package },
  { name: 'التصنيفات', href: '/admin/categories', icon: Tags },
  { name: 'العملاء', href: '/admin/customers', icon: Users },
  { name: 'الإشعارات', href: '/admin/notifications', icon: Bell },
  { name: 'الإعدادات', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-72 bg-white border-l border-slate-200 hidden lg:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white font-bold">
            G
          </div>
          <span className="text-xl font-bold text-slate-800">متجر الهدايا</span>
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
    </aside>
  )
}
