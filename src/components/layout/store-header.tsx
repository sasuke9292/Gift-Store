'use client'

import React, { useEffect, useState, useRef, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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

interface SearchItem {
  id: string
  name: string
  price: number
  salePrice?: number | null
  images: string[]
  category: { name: string; slug: string } | null
}

interface NavLinkItem {
  href: string
  label: string
  highlight?: boolean
}

const navLinks: NavLinkItem[] = [
  { href: '/', label: 'الرئيسية' },
  { href: '/shop', label: 'كل المنتجات' },
  { href: '/category/men', label: 'هدايا رجالية' },
  { href: '/category/women', label: 'هدايا نسائية' },
  { href: '/category/occasions', label: 'مناسبات خاصة' },
  { href: '/category/custom', label: 'هدايا مخصصة' },
  { href: '/category/offers', label: 'عروض وتخفيضات', highlight: true },
]

const popularKeywords = [
  'عطور فاخرة',
  'ساعات يد',
  'بوكسات هدايا',
  'أساور ومجوهرات',
  'محافظ جلدية',
]

export function StoreHeader({ user, topBarText, settings }: StoreHeaderProps) {
  const router = useRouter()
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
      setIsScrolled(window.scrollY > 15)
    }
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

  const activeNavLinks: NavLinkItem[] = useMemo(() => {
    if (settings?.navTabsJson) {
      try {
        const parsed = JSON.parse(settings.navTabsJson)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((t: any) => t.enabled !== false).map((t: any) => ({
            href: (t.href as string) || '/',
            label: (t.label as string) || '',
            highlight: Boolean(t.highlight)
          }))
        }
      } catch (e) {
        console.error('Error parsing navTabsJson:', e)
      }
    }
    return navLinks
  }, [settings?.navTabsJson])

  const effectiveTopBarText = settings?.topBarText || topBarText || 'توصيل مجاني لكافة طلبات الهدايا الأكثر من 100 ألف د.ع • تغليف ملكي مجاني 🎁'
  const effectiveHeaderPhone = settings?.headerPhone || settings?.storePhone || '+964 770 000 0000'
  const storeDisplayName = (settings?.storeName || 'گِفتي بلس | Gifty Plus').split('|')[0].trim()
  const storeDisplayTag = settings?.storeName?.includes('|') ? settings.storeName.split('|')[1].trim() : (settings?.storeSlogan || 'GIFTY PLUS LUXURY')

  return (
    <>
      <header className={cn(
        "sticky top-0 inset-x-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/95 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] border-b border-[#E8E4DF]/80" 
          : "bg-white border-b border-[#E8E4DF]"
      )}>
        {/* Top Announcement Bar */}
        {(settings?.showTopBar ?? true) && (
          <div className="bg-gradient-to-l from-[#0c1424] via-[#13213c] to-[#0c1424] text-white/90 py-2 px-4 text-xs font-semibold">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 mx-auto sm:mx-0">
                <span className="w-2 h-2 rounded-full bg-[#5c8fd6] animate-pulse" />
                <span className="text-[#7ea6e6] font-bold">✨ عرض استثنائي:</span>
                {settings?.topBarLink ? (
                  <Link href={settings.topBarLink} className="hover:underline transition-all">
                    {effectiveTopBarText}
                  </Link>
                ) : (
                  <span>{effectiveTopBarText}</span>
                )}
              </div>
              <div className="hidden sm:flex items-center gap-4 text-white/60 text-xs">
                {(settings?.showTrackOrder ?? true) && (
                  <Link href="/track-order" className="hover:text-[#7ea6e6] transition-colors flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#7ea6e6]" />
                    تتبع شحنتك
                  </Link>
                )}
                <span>•</span>
                <a href={`tel:${effectiveHeaderPhone.replace(/\s+/g, '')}`} className="hover:text-[#7ea6e6] transition-colors flex items-center gap-1" dir="ltr">
                  <Phone className="w-3.5 h-3.5 text-[#7ea6e6]" />
                  {effectiveHeaderPhone}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-2.5 gap-4 lg:gap-8">

            {/* Right: Logo & Mobile Toggle */}
            <div className="flex items-center gap-3 shrink-0">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden text-[#1C1917] hover:bg-[#F0F4F9] rounded-xl w-10 h-10"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="القائمة"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>

              <Link href="/" className="flex items-center gap-3 group">
                {settings?.logoUrl ? (
                  <div className="relative w-10 h-10 rounded-2xl overflow-hidden shadow-[0_4px_15px_rgba(19,33,60,0.25)]">
                    <Image src={settings.logoUrl} alt={storeDisplayName} fill className="object-cover group-hover:scale-105 transition-transform" />
                  </div>
                ) : (
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all group-hover:scale-105 shadow-[0_4px_15px_rgba(19,33,60,0.25)]"
                    style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
                  >
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="flex flex-col text-start justify-center">
                  <span className="text-xl font-black tracking-tight text-[#1C1917] leading-snug">
                    {storeDisplayName}
                  </span>
                  <span className="text-[10px] font-bold text-[#13213c] tracking-wider mt-1 block">
                    {storeDisplayTag}
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Live Interactive Search */}
            <div ref={searchContainerRef} className="flex-1 max-w-2xl hidden lg:block relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن هدية راقية، عطر، ساعة، أو مناسبة خاصة..."
                  className={cn(
                    "w-full h-11 ps-11 pe-10 rounded-2xl border text-sm transition-all text-start",
                    "bg-[#F8F5F0] border-[#E8E4DF] text-[#1C1917] placeholder:text-[#A8A29E]",
                    "focus:bg-white focus:border-[#13213c] focus:ring-4 focus:ring-[#13213c]/15 focus:outline-none shadow-xs"
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
                <div className="absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#13213c]">
                  <Search className="w-4 h-4" />
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setSearchResults([])
                    }}
                    className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-[#A8A29E] hover:text-[#1C1917] rounded-full"
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
                    className="absolute top-full start-0 end-0 mt-2 bg-white rounded-2xl border border-[#E8E4DF] shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-4 z-50 overflow-hidden"
                  >
                    {/* Quick suggestions when query is short */}
                    {searchQuery.trim().length < 2 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#13213c] mb-2.5">
                          <Flame className="w-3.5 h-3.5 text-[#E85D75]" />
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
                              className="text-xs px-3 py-1.5 rounded-xl bg-[#F8F5F0] hover:bg-[#F0EBE1] text-[#44403C] hover:text-[#1C1917] transition-colors border border-[#E8E4DF]/60"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Loading State */}
                    {isSearching && (
                      <div className="py-6 text-center text-sm text-[#A8A29E]">
                        <span className="inline-block w-4 h-4 border-2 border-[#13213c] border-t-transparent rounded-full animate-spin me-2 align-middle" />
                        جاري البحث عن أفخم الهدايا...
                      </div>
                    )}

                    {/* Results List */}
                    {!isSearching && searchQuery.trim().length >= 2 && (
                      <div>
                        {searchResults.length > 0 ? (
                          <div>
                            <p className="text-xs font-bold text-[#78716C] mb-2 text-start">
                              نتائج البحث ({searchResults.length}):
                            </p>
                            <div className="divide-y divide-[#F0ECE6]">
                              {searchResults.map(prod => (
                                <Link
                                  key={prod.id}
                                  href={`/product/${prod.id}`}
                                  onClick={() => setIsSearchOpen(false)}
                                  className="flex items-center gap-3 py-2.5 px-2 hover:bg-[#FAF7F2] rounded-xl transition-colors group"
                                >
                                  <div className="relative w-12 h-12 rounded-lg bg-[#F5F0EA] overflow-hidden shrink-0 border border-[#E8E4DF]">
                                    {prod.images && prod.images[0] ? (
                                      <Image src={prod.images[0]} alt={prod.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                                    ) : (
                                      <Gift className="w-5 h-5 text-[#13213c] m-auto" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0 text-start">
                                    <p className="text-xs text-[#13213c] font-semibold">{prod.category?.name || 'هدية فاخرة'}</p>
                                    <p className="text-sm font-bold text-[#1C1917] truncate group-hover:text-[#13213c] transition-colors">
                                      {prod.name}
                                    </p>
                                  </div>
                                  <div className="text-end shrink-0">
                                    <p className="text-sm font-black text-[#13213c]">
                                      {(prod.salePrice ?? prod.price).toLocaleString('en-US')}
                                      <span className="text-xs font-bold text-[#A8A29E] ms-1">د.ع</span>
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            <div className="pt-3 border-t border-[#F0ECE6] mt-2 text-center">
                              <Link
                                href={`/shop?q=${encodeURIComponent(searchQuery)}`}
                                onClick={() => setIsSearchOpen(false)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#13213c] hover:text-[#0c1527] transition-colors"
                              >
                                عرض جميع النتائج في المتجر
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="py-6 text-center">
                            <p className="text-sm font-bold text-[#1C1917] mb-1">لم نجد نتائج مطابقة لـ &quot;{searchQuery}&quot;</p>
                            <p className="text-xs text-[#A8A29E]">جرّب البحث بكلمات عامة مثل: عطور، ساعات، أو تصفح الأقسام</p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Left: Actions (Mobile Search, Favorites, Cart, Account, Gift Finder) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              
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
                  "lg:hidden flex items-center justify-center w-10 h-10 rounded-2xl transition-all border",
                  isMobileSearchOpen
                    ? "bg-[#13213c] text-white border-[#13213c] shadow-sm"
                    : "text-[#78716C] hover:text-[#13213c] hover:bg-[#F0F4F9] border-transparent"
                )}
                aria-label="بحث سريع"
                title="بحث سريع"
              >
                {isMobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>

              {/* Favorites Icon */}
              <Link
                href="/favorites"
                className="relative flex items-center justify-center w-10 h-10 rounded-2xl text-[#78716C] hover:text-[#E85D75] hover:bg-[#FDF2F4] transition-all border border-transparent hover:border-[#E85D75]/20"
                aria-label="المفضلة"
                title="المفضلة"
              >
                <Heart className="w-5 h-5" />
                {mounted && favCount > 0 && (
                  <span className="absolute -top-1 -start-1 w-4 h-4 flex items-center justify-center text-[10px] font-black rounded-full bg-[#E85D75] text-white shadow-sm">
                    {favCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center w-10 h-10 rounded-2xl text-[#78716C] hover:text-[#13213c] hover:bg-[#F0F4F9] transition-all border border-transparent hover:border-[#13213c]/20"
                aria-label="سلة المشتريات"
                title="السلة"
              >
                <ShoppingCart className="w-5 h-5" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 -start-1 min-w-4 h-4 px-1 flex items-center justify-center text-[10px] font-black rounded-full bg-[#13213c] text-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>


              {/* Gift Finder High-Tech CTA Button */}
              {(settings?.showGiftFinder ?? true) && (
                <Link
                  href="/gift-finder"
                  className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-2xl text-xs font-extrabold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(19,33,60,0.35)] shrink-0"
                  style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>مكتشف الهدايا</span>
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Categories Navigation Row (Clean RTL Alignment without indicator) */}
          {(settings?.showNavTabs !== false) && (
            <nav className="hidden lg:flex items-center justify-start h-12 border-t border-[#E8E4DF]/70 text-start">
              <div className="flex items-center gap-1">
                {activeNavLinks.map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    className={cn(
                      "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200",
                      link.highlight
                        ? "text-[#E85D75] bg-[#FDF2F4] hover:bg-[#FCE7EB]"
                        : "text-[#57534E] hover:text-[#1C1917] hover:bg-[#F8F5F0]"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
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
              className="lg:hidden border-t border-[#E8E4DF] bg-white/98 backdrop-blur-xl px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.08)] overflow-hidden"
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
                  className="w-full h-11 ps-10 pe-10 rounded-2xl bg-[#F8F5F0] border border-[#E8E4DF] text-xs font-medium text-[#1C1917] focus:outline-none focus:border-[#13213c] focus:bg-white focus:ring-2 focus:ring-[#13213c]/15 transition-all text-start"
                  value={searchQuery}
                  onChange={(e) => {
                    const val = e.target.value
                    setSearchQuery(val)
                    if (!val.trim() || val.trim().length < 2) {
                      setSearchResults([])
                    }
                  }}
                />
                <Search className="w-4 h-4 text-[#13213c] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setSearchResults([])
                    }}
                    className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-[#A8A29E] hover:text-[#1C1917]"
                    aria-label="مسح"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Quick Suggestion Chips */}
              {searchQuery.trim().length < 2 && (
                <div className="mt-2.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#78716C] mb-2">
                    <Flame className="w-3.5 h-3.5 text-[#E85D75]" />
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
                        className="text-[11px] px-2.5 py-1 rounded-xl bg-[#F8F5F0] text-[#57534E] hover:bg-[#13213c] hover:text-white transition-colors border border-[#E8E4DF]"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Live search results in mobile dropdown */}
              {isSearching && (
                <div className="py-4 text-center text-xs text-[#78716C] flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#13213c] border-t-transparent rounded-full animate-spin" />
                  <span>جاري البحث...</span>
                </div>
              )}

              {!isSearching && searchQuery.trim().length >= 2 && searchResults.length > 0 && (
                <div className="mt-2.5 max-h-60 overflow-y-auto divide-y divide-[#F0ECE6]">
                  {searchResults.map(prod => (
                    <Link
                      key={prod.id}
                      href={`/product/${prod.id}`}
                      onClick={() => setIsMobileSearchOpen(false)}
                      className="flex items-center gap-2.5 py-2 hover:bg-[#FAF7F2] rounded-xl px-1.5 transition-colors"
                    >
                      <div className="relative w-10 h-10 rounded-lg bg-[#F5F0EA] overflow-hidden shrink-0 border border-[#E8E4DF]">
                        {prod.images && prod.images[0] ? (
                          <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                        ) : (
                          <Gift className="w-4 h-4 text-[#13213c] m-auto" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-start">
                        <p className="text-[10px] text-[#13213c] font-bold">{prod.category?.name || 'هدية فاخرة'}</p>
                        <p className="text-xs font-bold text-[#1C1917] truncate">{prod.name}</p>
                      </div>
                      <div className="text-end shrink-0">
                        <p className="text-xs font-black text-[#13213c]">
                          {(prod.salePrice ?? prod.price).toLocaleString('en-US')}
                          <span className="text-[10px] text-[#A8A29E] ms-0.5">د.ع</span>
                        </p>
                      </div>
                    </Link>
                  ))}
                  <div className="pt-2 text-center">
                    <Link
                      href={`/shop?q=${encodeURIComponent(searchQuery)}`}
                      onClick={() => setIsMobileSearchOpen(false)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#13213c]"
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
              className="fixed inset-0 bg-black/40 z-50 lg:hidden backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col border-l border-[#E8E4DF]"
              dir="rtl"
            >
              {/* Mobile Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#E8E4DF]">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-black"
                    style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
                  >
                    <Gift className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-black text-lg text-[#1C1917]">گِفتي بلس</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-xl bg-[#F8F5F0] flex items-center justify-center text-[#78716C] hover:text-[#1C1917]"
                  aria-label="إغلاق"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="p-4 border-b border-[#E8E4DF]">
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
                    className="w-full h-10 ps-10 pe-4 rounded-xl bg-[#F8F5F0] border border-[#E8E4DF] text-xs focus:outline-none focus:border-[#13213c]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="w-4 h-4 text-[#A8A29E] absolute start-3 top-1/2 -translate-y-1/2" />
                </form>
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1 text-start">
                <p className="text-[11px] font-bold text-[#A8A29E] px-3 mb-2">أقسام المتجر</p>
                {activeNavLinks.map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-colors",
                      link.highlight
                        ? "text-[#E85D75] bg-[#FDF2F4]"
                        : "text-[#1C1917] hover:bg-[#F8F5F0]"
                    )}
                  >
                    <span>{link.label}</span>
                    <ArrowLeft className="w-4 h-4 text-[#A8A29E]" />
                  </Link>
                ))}

                <div className="pt-4 mt-4 border-t border-[#E8E4DF] space-y-1">
                  <p className="text-[11px] font-bold text-[#A8A29E] px-3 mb-2">خدمات حصرية</p>
                  <Link
                    href="/gift-finder"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-[#13213c] bg-[#F0F4F9]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>مكتشف الهدايا الذكي</span>
                  </Link>
                  <Link
                    href="/track-order"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-[#57534E] hover:bg-[#F8F5F0]"
                  >
                    <Clock className="w-4 h-4" />
                    <span>تتبع الطلب والشحنة</span>
                  </Link>
                </div>
              </div>

              {/* Mobile Drawer Footer */}
              <div className="p-4 border-t border-[#E8E4DF] bg-[#FAF7F2]">
                {user && user.role && user.role !== 'CUSTOMER' ? (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E8E4DF]"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#13213c]" />
                      <span className="text-xs font-bold text-[#1C1917]">{user.name || 'المشرف'}</span>
                    </div>
                    <span className="text-[10px] bg-[#13213c] text-white px-2 py-0.5 rounded-full font-bold">لوحة الإدارة</span>
                  </Link>
                ) : (
                  <div className="text-center py-1">
                    <p className="text-[11px] font-bold text-[#13213c]">✨ متجر الهدايا الفاخرة • طلب فوري عبر WhatsApp</p>
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
