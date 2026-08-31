'use client'

import React from 'react'
import { Bell, Search, Menu, Package, UserPlus, AlertCircle, ChevronLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function AdminHeader() {
  const pathname = usePathname()
  
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean)
    if (paths.length <= 1) return null

    const translate = (path: string) => {
      const dict: Record<string, string> = {
        admin: 'الرئيسية',
        products: 'المنتجات',
        orders: 'الطلبات',
        categories: 'التصنيفات',
        customers: 'العملاء',
        settings: 'الإعدادات',
        notifications: 'الإشعارات'
      }
      return dict[path] || path
    }

    return (
      <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-slate-500 mr-4">
        {paths.map((path, index) => (
          <React.Fragment key={path}>
            <span className={index === paths.length - 1 ? 'text-primary font-bold' : ''}>
              {translate(path)}
            </span>
            {index < paths.length - 1 && <ChevronLeft className="w-4 h-4 text-slate-300" />}
          </React.Fragment>
        ))}
      </div>
    )
  }

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden text-slate-500">
          <Menu className="w-5 h-5" />
        </Button>
        {getBreadcrumbs()}
        <div className="relative hidden md:block w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            type="text" 
            placeholder="ابحث عن طلب، منتج، أو عميل..." 
            className="pl-4 pr-10 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 rounded-full h-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "relative text-slate-500 hover:text-slate-900 rounded-full w-10 h-10 p-0" })}>
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-lg border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">التنبيهات</h3>
              <span className="text-xs text-primary font-semibold cursor-pointer hover:underline">تحديد الكل كمقروء</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <DropdownMenuItem className="p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 focus:bg-slate-50 rounded-none flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">طلب جديد #ORD-9872</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">قام محمد علي بإنشاء طلب جديد بقيمة 125,000 د.ع</p>
                  <p className="text-xs text-slate-400 mt-1">منذ 10 دقائق</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 focus:bg-slate-50 rounded-none flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">عميل جديد مسجل</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">تم تسجيل حساب جديد بواسطة سارة حسين</p>
                  <p className="text-xs text-slate-400 mt-1">منذ ساعتين</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-4 cursor-pointer hover:bg-slate-50 focus:bg-slate-50 rounded-none flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">انخفاض المخزون</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">باقة الورد الحمراء على وشك النفاذ (المتبقي: 2)</p>
                  <p className="text-xs text-slate-400 mt-1">أمس</p>
                </div>
              </DropdownMenuItem>
            </div>
            <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
              <a href="/admin/notifications" className="text-sm text-primary font-semibold hover:underline p-2 block">عرض جميع التنبيهات</a>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "relative h-10 w-10 rounded-full" })}>
              <Avatar className="h-10 w-10 border-2 border-slate-100">
                <AvatarImage src="/placeholder.jpg" alt="User" />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">أ</AvatarFallback>
              </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">أحمد الإداري</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@giftstore.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              الملف الشخصي
            </DropdownMenuItem>
            <DropdownMenuItem>
              الإعدادات
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600">
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
