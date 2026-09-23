'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { 
  Bell, 
  Search, 
  Menu, 
  ChevronLeft, 
  Store, 
  ExternalLink,
  X,
  Sliders,
  MessageCircle,
  Truck,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Megaphone,
  PhoneCall,
  Share2,
  Gift,
  Package,
  ShoppingCart,
  Users,
  Layers,
  UserCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from 'next/navigation'
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

function normalizeArabicText(text: string): string {
  if (!text) return ''
  return text
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .trim()
}

interface AdminSearchDestination {
  id: string
  title: string
  group: string
  href: string
  icon: React.ElementType
  keywords: string[]
}

const ADMIN_SEARCH_INDEX: AdminSearchDestination[] = [
  // Settings Sections
  { id: 'set-general', title: 'إعدادات الهوية واللوجو', group: 'إعدادات المتجر', href: '/admin/settings?tab=general', icon: Store, keywords: ['هوية', 'شعار', 'لوجو', 'اسم المتجر', 'عملة', 'صيانة', 'general'] },
  { id: 'set-whatsapp', title: 'إعدادات WhatsApp والطلب المباشر', group: 'إعدادات المتجر', href: '/admin/settings?tab=whatsapp', icon: MessageCircle, keywords: ['واتساب', 'واتس', 'شراء سريع', 'رقم الواتساب', 'طلب مباشر', 'whatsapp'] },
  { id: 'set-shipping', title: 'إعدادات الشحن والتوصيل', group: 'إعدادات المتجر', href: '/admin/settings?tab=shipping', icon: Truck, keywords: ['شحن', 'توصيل', 'مجاني', 'بغداد', 'محافظات', 'أجور التوصيل', 'shipping'] },
  { id: 'set-payment', title: 'إعدادات طرق الدفع (زين كاش، FIB)', group: 'إعدادات المتجر', href: '/admin/settings?tab=payment', icon: CreditCard, keywords: ['دفع', 'زين كاش', 'FIB', 'كاش', 'استلام', 'فيزا', 'ماستركارد', 'payment'] },
  { id: 'set-seo', title: 'إعدادات السيو والتنبيهات', group: 'إعدادات المتجر', href: '/admin/settings?tab=seo', icon: ShieldCheck, keywords: ['سيو', 'محركات البحث', 'جوجل', 'كلمات مفتاحية', 'تنبيهات', 'seo'] },
  { id: 'set-hero', title: 'إعدادات البانر والواجهة الرئيسية', group: 'إعدادات المتجر', href: '/admin/settings?tab=hero', icon: Sparkles, keywords: ['بانر', 'هيرو', 'واجهة', 'عناوين', 'أزرار', 'ثقة', 'hero'] },
  { id: 'set-header', title: 'إعدادات الترويسة والشريط الإعلاني', group: 'إعدادات المتجر', href: '/admin/settings?tab=header', icon: Megaphone, keywords: ['شريط اعلاني', 'ترويسة', 'توصيل مجاني', 'header'] },
  { id: 'set-contact', title: 'أرقام التواصل وأوقات العمل', group: 'إعدادات المتجر', href: '/admin/settings?tab=contact', icon: PhoneCall, keywords: ['تواصل', 'هاتف', 'ايميل', 'دوام', 'ساعات العمل', 'contact'] },
  { id: 'set-social', title: 'روابط التواصل الاجتماعي', group: 'إعدادات المتجر', href: '/admin/settings?tab=social', icon: Share2, keywords: ['انستغرام', 'فيسبوك', 'تيك توك', 'تيليغرام', 'social'] },
  { id: 'set-footer', title: 'بانر الفوتر ومزايا المتجر', group: 'إعدادات المتجر', href: '/admin/settings?tab=footer', icon: Gift, keywords: ['فوتر', 'مزايا', 'حقوق', 'cta', 'هدية', 'footer'] },

  // Admin Pages
  { id: 'page-products', title: 'إدارة المنتجات والمخزون', group: 'لوحة التحكم', href: '/admin/products', icon: Package, keywords: ['منتجات', 'سلع', 'هدايا', 'مخزون', 'سعر', 'products'] },
  { id: 'page-product-new', title: 'إضافة منتج جديد', group: 'لوحة التحكم', href: '/admin/products/new', icon: Package, keywords: ['اضافة منتج', 'جديد', 'رفع هدية', 'new product'] },
  { id: 'page-orders', title: 'إدارة طلبات الزبائن', group: 'لوحة التحكم', href: '/admin/orders', icon: ShoppingCart, keywords: ['طلبات', 'فواتير', 'مبيعات', 'زبائن', 'orders'] },
  { id: 'page-categories', title: 'تصنيفات وأقسام الهدايا', group: 'لوحة التحكم', href: '/admin/categories', icon: Layers, keywords: ['تصنيفات', 'اقسام', 'فئات', 'categories'] },
  { id: 'page-users', title: 'المستخدمين وصلاحيات الطاقم', group: 'لوحة التحكم', href: '/admin/users', icon: Users, keywords: ['مستخدمين', 'صلاحيات', 'مدراء', 'طاقم', 'ادمن', 'users'] },
  { id: 'page-notifications', title: 'سجل التنبيهات والإشعارات', group: 'لوحة التحكم', href: '/admin/notifications', icon: Bell, keywords: ['اشعارات', 'تنبيهات', 'رسائل', 'notifications'] },
  { id: 'page-profile', title: 'الملف الشخصي وكلمة المرور', group: 'لوحة التحكم', href: '/admin/profile', icon: UserCheck, keywords: ['حسابي', 'ملف شخصي', 'باسورد', 'profile'] },
]

export function AdminHeader({ userRole = 'CUSTOMER', userName }: { userRole?: string; userName?: string | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Close search popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredAdminSearch = useMemo(() => {
    const q = normalizeArabicText(searchQuery)
    if (!q) {
      return ADMIN_SEARCH_INDEX.slice(0, 7) // Show top recommended items on empty focus
    }
    return ADMIN_SEARCH_INDEX.filter(item => {
      const matchTitle = normalizeArabicText(item.title).includes(q)
      const matchGroup = normalizeArabicText(item.group).includes(q)
      const matchKeywords = item.keywords.some(k => normalizeArabicText(k).includes(q))
      return matchTitle || matchGroup || matchKeywords
    })
  }, [searchQuery])

  const handleSelectSearchItem = (href: string) => {
    setIsSearchOpen(false)
    setSearchQuery('')
    router.push(href)
  }

  const translate = (path: string) => {
    const dict: Record<string, string> = {
      admin: 'الرئيسية',
      products: 'المنتجات',
      orders: 'الطلبات',
      categories: 'التصنيفات',
      customers: 'العملاء',
      users: 'المستخدمين',
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
      <div className="hidden lg:flex items-center text-sm font-black text-[#1C1917]">
        لوحة التحكم
      </div>
    )

    return (
      <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-[#78716C]">
        <Link href="/admin" className="hover:text-[#C9A96E] transition-colors">
          الرئيسية
        </Link>
        {paths.slice(1).map((path, index) => {
          const isLast = index === paths.length - 2
          return (
            <React.Fragment key={`${path}-${index}`}>
              <ChevronLeft className="w-3.5 h-3.5 text-[#A8A29E]" />
              <span className={isLast ? 'text-[#1C1917] font-black' : 'hover:text-[#C9A96E] transition-colors'}>
                {translate(path)}
              </span>
            </React.Fragment>
          )
        })}
      </div>
    )
  }

  return (
    <header className="h-16 bg-white/95 backdrop-blur-xl border-b border-[#E8E4DF] flex items-center justify-between px-5 sm:px-8 sticky top-0 z-40 shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger render={
            <Button variant="ghost" size="icon" className="lg:hidden text-[#1C1917] hover:bg-[#FAFAF8] w-9 h-9 rounded-xl transition-colors border border-[#E8E4DF]">
              <Menu className="w-4 h-4" />
            </Button>
          } />
          <SheetContent side="right" className="w-72 bg-white border-e border-[#E8E4DF] p-0 text-[#1C1917]">
            <SheetHeader className="h-16 flex items-center justify-center border-b border-[#E8E4DF] bg-[#FAFAF8] px-5">
              <SheetTitle className="text-[#1C1917] text-base font-black">لوحة التحكم الإدارية</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto py-5 px-3 space-y-6 scrollbar-none h-[calc(100vh-64px)]">
              {sidebarGroups.map((group, groupIdx) => {
                const visibleItems = group.items.filter(item =>
                  !item.allowedRoles || item.allowedRoles.includes(userRole)
                )
                if (visibleItems.length === 0) return null
                return (
                  <div key={groupIdx}>
                    <p className="px-3 text-[10px] font-black text-[#A8A29E] uppercase tracking-wider mb-2">
                      {group.title}
                    </p>
                    <div className="space-y-1">
                      {visibleItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm border',
                              isActive
                                ? 'bg-[#FBF6EE] text-[#A07850] font-black border-[#C9A96E]/30'
                                : 'text-[#78716C] hover:bg-[#FAFAF8] hover:text-[#1C1917] border-transparent font-medium'
                            )}
                          >
                            <item.icon className={cn('w-[18px] h-[18px] shrink-0', isActive ? 'text-[#C9A96E]' : 'text-[#A8A29E]')} />
                            <span>{item.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              
              <div className="pt-4 border-t border-[#E8E4DF]">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#FAFAF8] border border-[#E8E4DF] text-xs font-bold text-[#1C1917] hover:bg-[#F5F0EA] transition-colors"
                >
                  <Store className="w-4 h-4 text-[#C9A96E]" />
                  <span>معاينة المتجر</span>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        {getBreadcrumbs()}
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Search */}
        <div ref={searchContainerRef} className="relative hidden md:block w-72">
          <div className="relative">
            <Search className="absolute end-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setIsSearchOpen(true)
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="بحث سريع في الإدارة والإعدادات..."
              className="w-full h-10 ps-8 pe-10 bg-[#FAFAF8] border border-[#E8E4DF] hover:border-[#D5D0C9] focus:border-[#C9A96E]/50 focus:bg-white rounded-xl transition-all text-xs text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:ring-2 focus:ring-[#C9A96E]/15"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setIsSearchOpen(false)
                }}
                className="absolute start-2.5 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#1C1917] p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Search Dropdown Popover */}
          {isSearchOpen && (
            <div className="absolute top-full end-0 mt-2 w-80 bg-white border border-[#E8E4DF] rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-[#E8E4DF]/50 max-h-96 flex flex-col animate-in fade-in-0 zoom-in-95 duration-150">
              <div className="p-2.5 bg-[#FAFAF8] text-[11px] font-bold text-[#78716C] flex items-center justify-between">
                <span>نتائج البحث السريع</span>
                <span className="text-[10px] text-[#A8A29E]">اضغط للتنقل المباشر</span>
              </div>

              <div className="overflow-y-auto p-1.5 space-y-1">
                {filteredAdminSearch.length === 0 ? (
                  <div className="py-6 px-4 text-center">
                    <p className="text-xs font-bold text-[#78716C]">لا توجد نتائج مطابقة لـ &quot;{searchQuery}&quot;</p>
                    <p className="text-[11px] text-[#A8A29E] mt-1">جرّب كلمات مثل: واتساب، شحن، دفع، منتج، سيو</p>
                  </div>
                ) : (
                  filteredAdminSearch.map((item) => {
                    const ItemIcon = item.icon
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectSearchItem(item.href)}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-start hover:bg-[#FBF6EE] group transition-colors cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#FAFAF8] border border-[#E8E4DF] group-hover:border-[#C9A96E]/40 group-hover:bg-white flex items-center justify-center shrink-0 transition-colors">
                          <ItemIcon className="w-4 h-4 text-[#78716C] group-hover:text-[#A07850]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#1C1917] group-hover:text-[#A07850] truncate transition-colors">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-[#A8A29E] truncate">
                            {item.group}
                          </p>
                        </div>
                        <ChevronLeft className="w-3.5 h-3.5 text-[#A8A29E] group-hover:text-[#A07850] shrink-0" />
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* View Store Direct Button */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-[#FAFAF8] hover:bg-[#F5F0EA] border border-[#E8E4DF] text-xs font-bold text-[#1C1917] transition-all hover:border-[#C9A96E]/40"
          title="معاينة المتجر المباشر"
        >
          <Store className="w-4 h-4 text-[#C9A96E]" />
          <span>المتجر</span>
        </Link>

        {/* Notifications */}
        <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative w-10 h-10 flex items-center justify-center text-[#78716C] hover:text-[#1C1917] bg-[#FAFAF8] hover:bg-[#F5F0EA] rounded-xl transition-all border border-[#E8E4DF] hover:border-[#C9A96E]/30 cursor-pointer"
            aria-label="الإشعارات"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 end-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>
          <SheetContent side="left" className="w-full sm:max-w-sm border-e-0 shadow-2xl p-0 flex flex-col bg-white border-s border-[#E8E4DF]">
            <SheetHeader className="p-5 bg-[#FAFAF8] border-b border-[#E8E4DF]">
              <div className="flex items-center justify-between flex-row">
                <button className="text-xs font-bold text-[#C9A96E] hover:text-[#A07850] transition-colors cursor-pointer">
                  تحديد الكل كمقروء
                </button>
                <SheetTitle className="text-[#1C1917] text-base font-black">الإشعارات</SheetTitle>
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-[#FAFAF8] rounded-2xl flex items-center justify-center mb-4 border border-[#E8E4DF]">
                <Bell className="w-8 h-8 text-[#A8A29E]" />
              </div>
              <h3 className="font-bold text-[#1C1917] text-base mb-1">لا توجد إشعارات جديدة</h3>
              <p className="text-[#78716C] text-sm max-w-[220px] leading-relaxed">أنت على اطلاع دائم بجميع مستجدات المتجر والطلبات.</p>
            </div>
          </SheetContent>
        </Sheet>

        {/* User Avatar */}
        <Link
          href="/admin/profile"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-sm hover:scale-105 transition-all text-sm shrink-0"
          style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
          title={userName || 'الملف الشخصي'}
        >
          {userName ? userName[0] : 'أ'}
        </Link>
      </div>
    </header>
  )
}
