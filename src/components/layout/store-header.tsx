'use client'

import React, { useEffect, useState, useRef, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Menu, 
  Sparkles, 
  X, 
  Gift, 
  User, 
  ArrowLeft,
  Phone,
  Flame,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore, useFavoritesStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useMounted } from '@/lib/use-mounted'
import { searchProducts } from '@/app/actions/products'
import {
  type NavLinkItem,
  resolveActiveNavLinks,
  isNavLinkActive,
  getHeaderSurfaceState,
} from '@/lib/header-nav'

interface StoreHeaderProps {
  user?: {
    id: string
    name?: string | null
    email?: string | null
    role?: string
  }
  topBarText?: string
  settings?: {
    storeName?: string | null
    storeSlogan?: string | null
    storePhone?: string | null
    headerPhone?: string | null
    topBarText?: string | null
    topBarLink?: string | null
    showTopBar?: boolean | null
    showTrackOrder?: boolean | null
    showGiftFinder?: boolean | null
    showNavTabs?: boolean | null
    navTabsJson?: string | null
    logoUrl?: string | null
    [key: string]: unknown
  } | null
}

interface SearchItem {
  id: string
  name: string
  price: number
  salePrice?: number | null
  images: string[]
  category: { name: string; slug: string } | null
}

const popularKeywords = [
  'عطور فاخرة',
  'ساعات يد',
  'بوكسات هدايا',
  'أساور ومجوهرات',
  'محافظ جلدية',
]

export function StoreHeader({ user, topBarText, settings }: StoreHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const cartItems = useCartStore(state => state.items)
  const favorites = useFavoritesStore(state => state.items)
  const mounted = useMounted()
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      setTimeout(() => {
        mobileSearchInputRef.current?.focus()
      }, 150)
    }
  }, [isMobileSearchOpen])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Live search debounce
  useEffect(() => {
    const query = searchQuery.trim()
    if (query.length < 2) return

    let isCancelled = false
    const timeout = setTimeout(async () => {
      setIsSearching(true)
      try {
        const results = await searchProducts(query)
        if (!isCancelled) {
          setSearchResults(results)
        }
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        if (!isCancelled) {
          setIsSearching(false)
        }
      }
    }, 280)

    return () => {
      isCancelled = true
      clearTimeout(timeout)
    }
  }, [searchQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearchOpen(false)
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const favCount = favorites.length

  const navTabsJson = settings?.navTabsJson
  const activeNavLinks: NavLinkItem[] = useMemo(
    () => resolveActiveNavLinks(navTabsJson),
    [navTabsJson]
  )

  const { isUnifiedHeroTop, collapseTopAnnouncement } = getHeaderSurfaceState({
    pathname: pathname || '/',
    isScrolled,
  })

  const effectiveTopBarText = settings?.topBarText || topBarText || 'توصيل مجاني لكافة طلبات الهدايا الأكثر من 100 ألف د.ع • تغليف ملكي مجاني 🎁'
  const effectiveHeaderPhone = settings?.headerPhone || settings?.storePhone || '+964 770 000 0000'

  return (
    <>
      <header
        data-unified-hero={isUnifiedHeroTop ? 'true' : 'false'}
        className={cn(
          "top-0 inset-x-0 z-50 transition-all duration-300",
          isHome ? "fixed" : "sticky",
          isHome
            ? (isScrolled
                ? "bg-[#011D2B]/92 backdrop-blur-xl shadow-[0_10px_35px_rgba(1,16,26,0.5)] border-b border-white/[0.08]"
                : "bg-transparent border-b border-transparent shadow-none")
            : (isScrolled
                ? "bg-[#011D2B]/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(1,16,26,0.45)] border-b border-[#025177]/60"
                : "bg-[#01283B] border-b border-[#025177]/50 shadow-[0_2px_15px_rgba(0,0,0,0.2)]")
        )}
      >
        {/* Top Announcement & Quick Info Row (Seamlessly integrated into hero top, collapses smoothly on scroll) */}
        {(settings?.showTopBar ?? true) && (
          <div
            className={cn(
              "transition-all duration-300 overflow-hidden",
              collapseTopAnnouncement
                ? "max-h-0 opacity-0 py-0 pointer-events-none"
                : "max-h-12 opacity-100"
            )}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={cn(
                  "flex items-center justify-between py-2 text-[11px] sm:text-xs font-medium text-[#FCF3E3]/85 transition-colors",
                  isUnifiedHeroTop
                    ? "border-b border-white/[0.07]"
                    : "border-b border-white/[0.08]"
                )}
              >
                <div className="flex items-center gap-2 mx-auto sm:mx-0 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-[#F4A258] shrink-0" />
                  <span className="text-[#F4A258] font-bold shrink-0">عرض استثنائي:</span>
                  {settings?.topBarLink ? (
                    <Link
                      href={settings.topBarLink}
                      className="text-[#FCF3E3]/85 hover:text-[#F4A258] transition-colors truncate"
                    >
                      {effectiveTopBarText}
                    </Link>
                  ) : (
                    <span className="truncate">{effectiveTopBarText}</span>
                  )}
                </div>
                <div className="hidden sm:flex items-center gap-4 text-[#FCF3E3]/70 text-xs shrink-0">
                  {(settings?.showTrackOrder ?? true) && (
                    <Link
                      href="/track-order"
                      className="hover:text-[#F4A258] transition-colors flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#F4A258]" />
                      <span>تتبع شحنتك</span>
                    </Link>
                  )}
                  <span className="text-white/20" aria-hidden="true">·</span>
                  <a
                    href={`tel:${effectiveHeaderPhone.replace(/\s+/g, '')}`}
                    className="hover:text-[#F4A258] transition-colors flex items-center gap-1.5 tabular-nums"
                    dir="ltr"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#F4A258]" />
                    <span>{effectiveHeaderPhone}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Integrated Header Composition */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={cn(
              "flex items-center justify-between gap-3 sm:gap-5 lg:gap-8 transition-all duration-300",
              isScrolled ? "h-16 py-2" : "h-18 sm:h-20 py-2.5"
            )}
          >
            {/* Right (RTL Start): Mobile Toggle & Gifty Plus Logo */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-[#FCF3E3]/90 hover:text-white hover:bg-white/[0.08] border border-white/[0.08] rounded-full w-10 h-10 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="القائمة"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>

              <Link
                href="/"
                className="flex items-center group py-0.5 focus-visible:outline-none"
                aria-label="الصفحة الرئيسية"
              >
                <Image
                  src="/logo-white.png"
                  alt="Gifty+"
                  width={164}
                  height={46}
                  style={{ width: 'auto' }}
                  className={cn(
                    "w-auto object-contain transition-all duration-300 group-hover:scale-[1.03]",
                    isScrolled ? "h-8 sm:h-10" : "h-9 sm:h-11"
                  )}
                  priority
                />
              </Link>
            </div>

            {/* Center: Subtle Translucent Search Input (Blends naturally into dark navy hero) */}
            <div ref={searchContainerRef} className="flex-1 max-w-xl hidden md:block relative">
              <form onSubmit={handleSearchSubmit} className="relative group">
                <input
                  type="text"
                  placeholder="ابحث عن هدية راقية، عطر، ساعة، أو مناسبة خاصة..."
                  className={cn(
                    "w-full h-10 sm:h-11 ps-11 pe-10 rounded-full border text-xs sm:text-sm transition-all duration-200 text-start",
                    "bg-white/[0.05] hover:bg-white/[0.08] border-white/[0.12] hover:border-white/[0.22] text-[#FCF3E3] placeholder:text-[#FCF3E3]/55 backdrop-blur-md",
                    "focus:bg-[#011622]/90 focus:text-[#FCF3E3] focus:placeholder:text-[#FCF3E3]/40 focus:border-[#F4A258]/70 focus:ring-2 focus:ring-[#F4A258]/20 focus:outline-none"
                  )}
                  value={searchQuery}
                  onChange={(e) => {
                    const val = e.target.value
                    setSearchQuery(val)
                    if (!val.trim() || val.trim().length < 2) {
                      setSearchResults([])
                    }
                    setIsSearchOpen(true)
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                />
                <div className="absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#F4A258] transition-transform duration-200 group-focus-within:scale-110">
                  <Search className="w-4 h-4" />
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setSearchResults([])
                    }}
                    className="absolute end-3.5 top-1/2 -translate-y-1/2 p-1 text-[#FCF3E3]/60 hover:text-[#F4A258] rounded-full transition-colors"
                    aria-label="مسح البحث"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Live Search Dropdown Popover */}
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full start-0 end-0 mt-2.5 bg-[#011D2B]/95 backdrop-blur-2xl rounded-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.55)] p-4 z-50 overflow-hidden text-white"
                  >
                    {/* Quick suggestions when query is short */}
                    {searchQuery.trim().length < 2 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#F4A258] mb-2.5">
                          <Flame className="w-3.5 h-3.5 text-[#F4A258]" />
                          الأكثر بحثاً الآن
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {popularKeywords.map(tag => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                setSearchQuery(tag)
                                router.push(`/shop?q=${encodeURIComponent(tag)}`)
                                setIsSearchOpen(false)
                              }}
                              className="text-xs px-3 py-1.5 rounded-full bg-white/[0.07] hover:bg-[#F4A258]/20 text-[#FCF3E3]/90 hover:text-[#F4A258] transition-colors border border-white/10 hover:border-[#F4A258]/40 cursor-pointer"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Loading State */}
                    {isSearching && (
                      <div className="py-6 text-center text-sm text-[#FCF3E3]/70">
                        <span className="inline-block w-4 h-4 border-2 border-[#F4A258] border-t-transparent rounded-full animate-spin me-2 align-middle" />
                        جاري البحث عن أفخم الهدايا...
                      </div>
                    )}

                    {/* Results List */}
                    {!isSearching && searchQuery.trim().length >= 2 && (
                      <div>
                        {searchResults.length > 0 ? (
                          <div>
                            <p className="text-xs font-bold text-white/60 mb-2 text-start">
                              نتائج البحث ({searchResults.length}):
                            </p>
                            <div className="divide-y divide-white/10">
                              {searchResults.map(prod => (
                                <Link
                                  key={prod.id}
                                  href={`/product/${prod.id}`}
                                  onClick={() => setIsSearchOpen(false)}
                                  className="flex items-center gap-3 py-2.5 px-2 hover:bg-white/[0.08] rounded-xl transition-colors group"
                                >
                                  <div className="relative w-12 h-12 rounded-lg bg-white/10 overflow-hidden shrink-0 border border-white/15">
                                    {prod.images && prod.images[0] ? (
                                      <Image src={prod.images[0]} alt={prod.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                                    ) : (
                                      <Gift className="w-5 h-5 text-[#F4A258] m-auto" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0 text-start">
                                    <p className="text-xs text-[#F4A258] font-semibold">{prod.category?.name || 'هدية فاخرة'}</p>
                                    <p className="text-sm font-bold text-[#FCF3E3] truncate group-hover:text-[#F4A258] transition-colors">
                                      {prod.name}
                                    </p>
                                  </div>
                                  <div className="text-end shrink-0">
                                    <p className="text-sm font-black text-[#FCF3E3] tabular-nums">
                                      {(prod.salePrice ?? prod.price).toLocaleString('en-US')}
                                      <span className="text-xs font-bold text-white/50 ms-1">د.ع</span>
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            <div className="pt-3 border-t border-white/10 mt-2 text-center">
                              <Link
                                href={`/shop?q=${encodeURIComponent(searchQuery)}`}
                                onClick={() => setIsSearchOpen(false)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F4A258] hover:text-white transition-colors"
                              >
                                عرض جميع النتائج في المتجر
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="py-6 text-center">
                            <p className="text-sm font-bold text-[#FCF3E3] mb-1">لم نجد نتائج مطابقة لـ &quot;{searchQuery}&quot;</p>
                            <p className="text-xs text-white/60">جرّب البحث بكلمات عامة مثل: عطور، ساعات، أو تصفح الأقسام</p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Left (RTL End): Actions (Mobile Search, Smart Gift Finder, Favorites, Cart) */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Mobile Quick Search Button */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileSearchOpen(!isMobileSearchOpen)
                  if (!isMobileSearchOpen) {
                    setIsMobileMenuOpen(false)
                  }
                }}
                className={cn(
                  "md:hidden flex items-center justify-center w-10 h-10 rounded-full transition-all border",
                  isMobileSearchOpen
                    ? "bg-[#F4A258]/20 text-[#F4A258] border-[#F4A258]/40 shadow-sm"
                    : "bg-white/[0.05] text-[#FCF3E3]/85 hover:text-white hover:bg-white/[0.10] border-white/[0.10]"
                )}
                aria-label="بحث سريع"
                title="بحث سريع"
              >
                {isMobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              </button>

              {/* Smart Gift Finder Button (Subtle Translucent Surface with Orange Accent) */}
              {(settings?.showGiftFinder ?? true) && (
                <Link
                  href="/gift-finder"
                  className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-full text-xs font-extrabold text-[#FCF3E3] bg-[#F4A258]/12 hover:bg-[#F4A258]/22 border border-[#F4A258]/40 hover:border-[#F4A258]/75 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 shrink-0 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F4A258]" />
                  <span>مكتشف الهدايا الذكي</span>
                </Link>
              )}

              {/* Favorites Icon */}
              <Link
                href="/favorites"
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full transition-all border",
                  pathname === '/favorites'
                    ? "bg-[#F4A258]/20 text-[#F4A258] border-[#F4A258]/50"
                    : "bg-white/[0.05] text-[#FCF3E3]/85 hover:text-[#F4A258] hover:bg-white/[0.10] border-white/[0.10] hover:border-white/[0.22]"
                )}
                aria-label="المفضلة"
                title="المفضلة"
              >
                <Heart className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                {mounted && favCount > 0 && (
                  <span className="absolute -top-1 -start-1 min-w-4 h-4 px-1 flex items-center justify-center text-[10px] font-black rounded-full bg-[#F4A258] text-[#01283B] shadow-sm tabular-nums">
                    {favCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link
                href="/cart"
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full transition-all border",
                  pathname === '/cart'
                    ? "bg-[#F4A258]/20 text-[#F4A258] border-[#F4A258]/50"
                    : "bg-white/[0.05] text-[#FCF3E3]/85 hover:text-[#F4A258] hover:bg-white/[0.10] border-white/[0.10] hover:border-white/[0.22]"
                )}
                aria-label="سلة المشتريات"
                title="السلة"
              >
                <ShoppingCart className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 -start-1 min-w-4 h-4 px-1 flex items-center justify-center text-[10px] font-black rounded-full bg-[#F4A258] text-[#01283B] shadow-sm tabular-nums">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Integrated Navigation Row (Seamless on Desktop & Tablet, no detached box) */}
          {(settings?.showNavTabs !== false) && (
            <nav
              aria-label="أقسام المتجر"
              className={cn(
                "hidden md:flex items-center justify-start text-start overflow-x-auto no-scrollbar transition-all duration-300",
                isUnifiedHeroTop
                  ? "h-11 pb-2 border-t border-transparent"
                  : "h-10 py-1 border-t border-white/[0.06]"
              )}
            >
              <div className="flex items-center gap-1.5 lg:gap-2.5 min-w-max">
                {activeNavLinks.map((link) => {
                  const isActive = isNavLinkActive(pathname || '/', link.href)
                  return (
                    <Link
                      key={link.href + link.label}
                      href={link.href}
                      className={cn(
                        "relative px-3.5 py-1.5 rounded-full text-xs lg:text-[13px] transition-all duration-200 whitespace-nowrap shrink-0",
                        link.highlight
                          ? "text-[#F4A258] bg-[#F4A258]/12 hover:bg-[#F4A258]/22 border border-[#F4A258]/35 font-black"
                          : isActive
                            ? "text-[#F4A258] font-extrabold bg-white/[0.06]"
                            : "text-[#FCF3E3]/80 hover:text-[#FCF3E3] hover:bg-white/[0.05] font-bold"
                      )}
                    >
                      <span>{link.label}</span>
                      {isActive && !link.highlight && (
                        <span
                          className="absolute bottom-0.5 inset-x-3.5 h-[2px] rounded-full bg-[#F4A258] shadow-[0_0_8px_rgba(244,162,88,0.6)]"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  )
                })}
              </div>
            </nav>
          )}
        </div>

        {/* Animated Mobile Search Sheet */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/10 bg-[#011D2B]/95 backdrop-blur-2xl px-4 py-3.5 shadow-[0_12px_30px_rgba(0,0,0,0.5)] overflow-hidden text-white"
            >
              <form 
                onSubmit={(e) => {
                  handleSearchSubmit(e)
                  setIsMobileSearchOpen(false)
                }} 
                className="relative"
              >
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  placeholder="ابحث عن هدية راقية، عطر، ساعة..."
                  className="w-full h-11 ps-10 pe-10 rounded-full bg-white/[0.06] border border-white/[0.15] text-xs font-medium text-[#FCF3E3] placeholder:text-[#FCF3E3]/55 focus:outline-none focus:border-[#F4A258]/70 focus:bg-[#011622]/90 focus:text-[#FCF3E3] transition-all text-start"
                  value={searchQuery}
                  onChange={(e) => {
                    const val = e.target.value
                    setSearchQuery(val)
                    if (!val.trim() || val.trim().length < 2) {
                      setSearchResults([])
                    }
                  }}
                />
                <Search className="w-4 h-4 text-[#F4A258] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setSearchResults([])
                    }}
                    className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-white/60 hover:text-white"
                    aria-label="مسح"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Quick Suggestion Chips */}
              {searchQuery.trim().length < 2 && (
                <div className="mt-2.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#F4A258] mb-2">
                    <Flame className="w-3.5 h-3.5 text-[#F4A258]" />
                    <span>الأكثر بحثاً:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {popularKeywords.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSearchQuery(tag)
                          setIsMobileSearchOpen(false)
                          router.push(`/shop?q=${encodeURIComponent(tag)}`)
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.08] text-[#FCF3E3]/85 hover:bg-[#F4A258]/20 hover:text-[#F4A258] transition-colors border border-white/10"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Live search results in mobile dropdown */}
              {isSearching && (
                <div className="py-4 text-center text-xs text-white/70 flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#F4A258] border-t-transparent rounded-full animate-spin" />
                  <span>جاري البحث...</span>
                </div>
              )}

              {!isSearching && searchQuery.trim().length >= 2 && searchResults.length > 0 && (
                <div className="mt-2.5 max-h-60 overflow-y-auto divide-y divide-white/10">
                  {searchResults.map(prod => (
                    <Link
                      key={prod.id}
                      href={`/product/${prod.id}`}
                      onClick={() => setIsMobileSearchOpen(false)}
                      className="flex items-center gap-2.5 py-2 hover:bg-white/10 rounded-xl px-1.5 transition-colors"
                    >
                      <div className="relative w-10 h-10 rounded-lg bg-white/10 overflow-hidden shrink-0 border border-white/15">
                        {prod.images && prod.images[0] ? (
                          <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                        ) : (
                          <Gift className="w-4 h-4 text-[#F4A258] m-auto" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-start">
                        <p className="text-[10px] text-[#F4A258] font-bold">{prod.category?.name || 'هدية فاخرة'}</p>
                        <p className="text-xs font-bold text-white truncate">{prod.name}</p>
                      </div>
                      <div className="text-end shrink-0">
                        <p className="text-xs font-black text-white tabular-nums">
                          {(prod.salePrice ?? prod.price).toLocaleString('en-US')}
                          <span className="text-[10px] text-white/50 ms-0.5">د.ع</span>
                        </p>
                      </div>
                    </Link>
                  ))}
                  <div className="pt-2 text-center">
                    <Link
                      href={`/shop?q=${encodeURIComponent(searchQuery)}`}
                      onClick={() => setIsMobileSearchOpen(false)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F4A258] hover:text-white"
                    >
                      عرض جميع النتائج ({searchResults.length})
                      <ArrowLeft className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#011D2B] text-white shadow-2xl z-50 flex flex-col border-l border-white/10"
              dir="rtl"
            >
              {/* Mobile Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center group" aria-label="الصفحة الرئيسية">
                  <Image
                    src="/logo-white.png"
                    alt="Gifty+"
                    width={130}
                    height={36}
                    className="h-8 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white"
                  aria-label="إغلاق"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Search in Drawer */}
              <div className="p-4 border-b border-white/10">
                <form
                  onSubmit={(e) => {
                    handleSearchSubmit(e)
                    setIsMobileMenuOpen(false)
                  }}
                  className="relative"
                >
                  <input
                    type="text"
                    placeholder="ابحث عن هدية راقية..."
                    className="w-full h-10 ps-10 pe-4 rounded-full bg-white/[0.06] border border-white/15 text-xs text-[#FCF3E3] placeholder:text-[#FCF3E3]/55 focus:outline-none focus:border-[#F4A258]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="w-4 h-4 text-[#F4A258] absolute start-3.5 top-1/2 -translate-y-1/2" />
                </form>
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1 text-start">
                <p className="text-[11px] font-bold text-white/50 px-3 mb-2">أقسام المتجر</p>
                {activeNavLinks.map((link) => {
                  const isActive = isNavLinkActive(pathname || '/', link.href)
                  return (
                    <Link
                      key={link.href + link.label}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors",
                        link.highlight
                          ? "text-[#F4A258] bg-[#F4A258]/15 hover:bg-[#F4A258]/25 border border-[#F4A258]/35"
                          : isActive
                            ? "text-[#F4A258] bg-white/[0.06] border border-[#F4A258]/25"
                            : "text-[#FCF3E3]/85 hover:text-white hover:bg-white/[0.06]"
                      )}
                    >
                      <span>{link.label}</span>
                      <ArrowLeft className={cn("w-4 h-4", isActive || link.highlight ? "text-[#F4A258]" : "text-white/40")} />
                    </Link>
                  )
                })}

                <div className="pt-4 mt-4 border-t border-white/10 space-y-1">
                  <p className="text-[11px] font-bold text-white/50 px-3 mb-2">خدمات حصرية</p>
                  <Link
                    href="/gift-finder"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-white bg-white/10 border border-white/10"
                  >
                    <Sparkles className="w-4 h-4 text-[#F4A258]" />
                    <span>مكتشف الهدايا الذكي</span>
                  </Link>
                  <Link
                    href="/track-order"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-white/80 hover:bg-white/10"
                  >
                    <Clock className="w-4 h-4 text-[#F4A258]" />
                    <span>تتبع الطلب والشحنة</span>
                  </Link>
                </div>
              </div>

              {/* Mobile Drawer Footer */}
              <div className="p-4 border-t border-white/10 bg-[#011D2B]">
                {user && user.role && user.role !== 'CUSTOMER' ? (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/15"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#F4A258]" />
                      <span className="text-xs font-bold text-white">{user.name || 'المشرف'}</span>
                    </div>
                    <span className="text-[10px] bg-[#1d4ed8] text-white px-2 py-0.5 rounded-full font-bold">لوحة الإدارة</span>
                  </Link>
                ) : (
                  <div className="text-center py-1">
                    <p className="text-[11px] font-bold text-[#F4A258]">✨ متجر الهدايا الفاخرة • طلب فوري عبر WhatsApp</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
