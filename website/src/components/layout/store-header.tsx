'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Menu, 
  Sparkles, 
  X, 
  ArrowLeft,
  Flame,
  Phone,
  Gift,
  ShieldCheck,
  Truck
} from 'lucide-react'
import { useCartStore, useFavoritesStore } from '@/lib/store'
import { useSearchStore } from '@/lib/search-store'
import { useMounted } from '@/lib/use-mounted'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface StoreHeaderProps {
  user?: {
    id: string
    name?: string | null
    email?: string | null
    role?: string
  }
  topBarText?: string
  settings?: any
}

interface NavLink {
  href: string
  label: string
  badge?: string
  highlight?: boolean
}

const PRIMARY_NAV_LINKS: NavLink[] = [
  { href: '/', label: 'الرئيسية' },
  { href: '/shop', label: 'المتجر' },
  { href: '/category/men', label: 'هدايا رجالية' },
  { href: '/category/women', label: 'هدايا نسائية' },
  { href: '/category/kids', label: 'هدايا أطفال' },
  { href: '/category/occasions', label: 'المناسبات' },
  { href: '/category/custom', label: 'الهدايا المخصصة' },
  { href: '/category/offers', label: 'العروض', badge: 'خصم', highlight: true },
]

export function StoreHeader({ user, topBarText, settings }: StoreHeaderProps) {
  const pathname = usePathname()
  const mounted = useMounted()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const cartItems = useCartStore((state) => state.items)
  const openCartDrawer = useCartStore((state) => state.openDrawer)
  const favorites = useFavoritesStore((state) => state.items)
  const openSearch = useSearchStore((state) => state.openSearch)

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const favCount = favorites.length

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const storeName = settings?.storeName || 'گِفتي بلس'
  const storeSlogan = settings?.storeSlogan || 'خلّي هديتك تحچي عنك ✨'
  const showTopBar = settings?.showTopBar !== false

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300" dir="rtl">
      {/* 1. Ultra-clean Top Announcement Bar */}
      {showTopBar && (
        <div 
          className={cn(
            "bg-[#13213c] text-white text-[11px] sm:text-xs transition-all duration-300 overflow-hidden font-medium",
            isScrolled ? "h-0 py-0 opacity-0" : "py-1.5 opacity-100"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full text-[10px] font-black text-amber-300">
                <Sparkles className="w-3 h-3" />
                تغليف ملكي مجاني
              </span>
              <span className="line-clamp-1">
                {settings?.topBarText || topBarText || 'توصيل سريع لكافة محافظات العراق • هدايا استثنائية وبطاقة إهداء مخصصة مجاناً 🎁'}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-white/80 text-[11px]">
              <Link href="/track-order" className="hover:text-white transition-colors">
                تتبع الطلب
              </Link>
              <span className="text-white/20">|</span>
              <Link href="/gift-finder" className="hover:text-white transition-colors flex items-center gap-1 font-bold text-amber-300">
                <Sparkles className="w-3 h-3" />
                مستشار الهدايا
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Sticky Navigation Bar */}
      <div 
        className={cn(
          "w-full transition-all duration-300 border-b",
          isScrolled 
            ? "bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(19,33,60,0.06)] border-slate-200/80 py-2.5" 
            : "bg-white border-slate-200/60 py-3.5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center group py-0.5" aria-label="الرئيسية">
                <Image
                  src="/logo-navy.png"
                  alt={storeName}
                  width={140}
                  height={38}
                  priority
                  className="h-8 sm:h-9.5 w-auto object-contain transition-transform group-hover:scale-102"
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 2xl:gap-1.5">
              {PRIMARY_NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                      isActive
                        ? "text-[#13213c] bg-[#F0F4F9] font-black"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                      link.highlight && "text-rose-600 hover:text-rose-700"
                    )}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-600 text-white shadow-2xs">
                        {link.badge}
                      </span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 inset-x-2 h-0.5 bg-[#13213c] rounded-full"
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Actions: Search, Wishlist, Cart, Mobile Menu */}
            <div className="flex items-center gap-1 sm:gap-2">
              
              {/* Search Trigger Button */}
              <button
                onClick={openSearch}
                className="flex items-center gap-2 h-9 sm:h-10 px-2.5 sm:px-3.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
                aria-label="البحث عن منتج"
                title="بحث"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#13213c]" />
                <span className="hidden md:inline text-xs font-medium text-slate-400">
                  ابحث عن هدية...
                </span>
                <kbd className="hidden lg:inline-flex items-center text-[10px] bg-slate-100 border border-slate-200 px-1.5 rounded text-slate-400 font-mono">
                  ⌘K
                </kbd>
              </button>

              {/* Wishlist Button */}
              <Link
                href="/favorites"
                className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-600 hover:text-rose-600 hover:bg-slate-50 transition-colors cursor-pointer"
                aria-label="قائمة المفضلة"
                title="المفضلة"
              >
                <Heart className="w-4.5 h-4.5 transition-transform hover:scale-110 active:scale-90" />
                {mounted && favCount > 0 && (
                  <span className="absolute -top-1 -start-1 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                    {favCount}
                  </span>
                )}
              </Link>

              {/* Mini Cart Drawer Trigger */}
              <button
                onClick={openCartDrawer}
                className="relative flex items-center gap-1.5 h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl bg-[#13213c] hover:bg-[#1a2c4e] text-white transition-all shadow-xs cursor-pointer active:scale-95"
                aria-label="سلة المشتريات"
                title="السلة"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-black">السلة</span>
                {mounted && cartCount > 0 && (
                  <span className="min-w-4.5 h-4.5 px-1 rounded-full bg-amber-400 text-[#13213c] text-[10px] font-black flex items-center justify-center shadow-2xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="xl:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                aria-label="القائمة الرئيسية"
              >
                <Menu className="w-5 h-5" />
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 xl:hidden" dir="rtl">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute inset-y-0 end-0 w-full max-w-xs bg-white shadow-2xl flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                  <Image
                    src="/logo-navy.png"
                    alt={storeName}
                    width={110}
                    height={30}
                    className="h-7 w-auto object-contain"
                  />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900"
                    aria-label="إغلاق"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Slogan */}
                <div className="px-4 py-2.5 bg-[#F0F4F9] text-[#13213c] text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{storeSlogan}</span>
                </div>

                {/* Nav Links */}
                <div className="p-3 space-y-1 overflow-y-auto max-h-[60vh]">
                  {PRIMARY_NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all",
                        pathname === link.href
                          ? "bg-[#13213c] text-white"
                          : "text-slate-700 hover:bg-slate-100",
                        link.highlight && pathname !== link.href && "text-rose-600"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span>{link.label}</span>
                        {link.badge && (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-600 text-white">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <ArrowLeft className="w-3.5 h-3.5 opacity-60" />
                    </Link>
                  ))}

                  <div className="pt-2 border-t border-slate-100 mt-2">
                    <Link
                      href="/gift-finder"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black bg-amber-50 text-amber-900 border border-amber-200/80"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>مستشار الهدايا الذكي</span>
                      </div>
                      <ArrowLeft className="w-3.5 h-3.5 text-amber-600" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Support / WhatsApp */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
                <Link
                  href="/track-order"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>تتبع شحنتك</span>
                </Link>

                <p className="text-[10px] text-center text-slate-400 font-medium">
                  گِفتي بلس • الوجهة الأولى للهدايا الفاخرة في العراق
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  )
}
