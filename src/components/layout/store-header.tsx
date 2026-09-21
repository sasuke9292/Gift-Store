'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingCart, Heart, Menu, Sparkles, X, ChevronDown, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useCartStore, useFavoritesStore } from '@/lib/store'
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
}

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/category/men', label: 'هدايا رجالية' },
  { href: '/category/women', label: 'هدايا نسائية' },
  { href: '/category/occasions', label: 'مناسبات' },
  { href: '/category/custom', label: 'مخصصة' },
  { href: '/category/offers', label: 'عروض', highlight: true },
]

export function StoreHeader({ user, topBarText }: StoreHeaderProps) {
  const cartItems = useCartStore(state => state.items)
  const favorites = useFavoritesStore(state => state.items)
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const favCount = favorites.length

  return (
    <>
      <header className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.06)]" 
          : "bg-white border-b border-[#E8E4DF]"
      )}>
        {/* Top Announcement Bar */}
        {topBarText && (
          <div className="bg-gradient-to-r from-[#1C1917] via-[#2D2926] to-[#1C1917] text-white/90 py-2 px-4 text-center text-xs font-bold tracking-wide">
            <Sparkles className="inline-block w-3 h-3 me-1.5 text-[#C9A96E]" />
            {topBarText}
          </div>
        )}

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4 lg:gap-8">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden text-[#1C1917] hover:bg-[#F5F0EA] rounded-xl"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="القائمة"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-base transition-all group-hover:scale-105 shadow-[0_2px_8px_rgba(201,169,110,0.4)]"
                  style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}>
                  <Gift className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-black hidden sm:block tracking-tight text-[#1C1917]">
                  گِفتي بلس
                </span>
              </Link>
            </div>

            {/* Search Bar — Desktop */}
            <div className="flex-1 max-w-xl hidden lg:block">
              <div className={cn(
                "relative transition-all duration-200",
                isSearchFocused && "scale-[1.01]"
              )}>
                <Input
                  type="text"
                  placeholder="ابحث عن هدية، منتج، أو مناسبة..."
                  className={cn(
                    "w-full h-10 pe-4 ps-11 rounded-xl border text-sm transition-all",
                    "bg-[#F5F0EA] border-transparent text-[#1C1917] placeholder:text-[#A8A29E]",
                    "focus-visible:bg-white focus-visible:border-[#C9A96E]/40 focus-visible:ring-2 focus-visible:ring-[#C9A96E]/20 focus-visible:shadow-[0_0_0_3px_rgba(201,169,110,0.1)]"
                  )}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <div className="absolute start-3 top-1/2 -translate-y-1/2">
                  <Search className="w-4 h-4 text-[#A8A29E]" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Favorites */}
              <Link
                href="/favorites"
                className="relative hidden sm:flex items-center justify-center w-9 h-9 rounded-xl text-[#78716C] hover:text-[#C9A96E] hover:bg-[#F5F0EA] transition-all duration-200"
                aria-label="المفضلة"
              >
                <Heart className="w-5 h-5" />
                {mounted && favCount > 0 && (
                  <span className="absolute -top-1 -start-1 w-4 h-4 flex items-center justify-center text-[10px] font-black rounded-full bg-[#E85D75] text-white">
                    {favCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center w-9 h-9 rounded-xl text-[#78716C] hover:text-[#C9A96E] hover:bg-[#F5F0EA] transition-all duration-200"
                aria-label="السلة"
              >
                <ShoppingCart className="w-5 h-5" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 -start-1 w-4 h-4 flex items-center justify-center text-[10px] font-black rounded-full bg-[#C9A96E] text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Gift Finder CTA */}
              <Link
                href="/gift-finder"
                className="hidden md:flex items-center gap-1.5 h-9 px-4 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)', boxShadow: '0 2px 10px rgba(184,137,58,0.3)' }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                مكتشف الهدايا
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 h-11 border-t border-[#E8E4DF]/60">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                  link.highlight 
                    ? "text-[#E85D75] hover:bg-[#FDF2F4]" 
                    : "text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F0EA]"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/shop"
              className="ms-auto px-4 py-2 rounded-lg text-sm font-semibold text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F0EA] transition-all duration-200"
            >
              كل المنتجات
            </Link>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 end-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#E8E4DF]">
                <span className="text-lg font-black text-[#1C1917]">القائمة</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl text-[#78716C] hover:bg-[#F5F0EA]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Mobile Search */}
              <div className="p-4 border-b border-[#E8E4DF]">
                <div className="relative">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
                  <Input
                    type="text"
                    placeholder="ابحث عن هدية..."
                    className="w-full ps-10 h-10 rounded-xl bg-[#F5F0EA] border-transparent text-sm placeholder:text-[#A8A29E] focus-visible:bg-white focus-visible:border-[#C9A96E]/40 focus-visible:ring-2 focus-visible:ring-[#C9A96E]/20"
                  />
                </div>
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all",
                      link.highlight
                        ? "text-[#E85D75] hover:bg-[#FDF2F4]"
                        : "text-[#1C1917] hover:bg-[#F5F0EA]"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-base font-semibold text-[#1C1917] hover:bg-[#F5F0EA] transition-all"
                >
                  كل المنتجات
                </Link>
              </nav>

              {/* Mobile Quick Actions */}
              <div className="p-4 border-t border-[#E8E4DF] space-y-3">
                <Link
                  href="/favorites"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#78716C] hover:bg-[#F5F0EA] transition-all"
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-semibold">المفضلة</span>
                  {mounted && favCount > 0 && (
                    <span className="ms-auto text-xs font-black text-[#E85D75]">{favCount}</span>
                  )}
                </Link>
                <Link
                  href="/gift-finder"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-bold"
                  style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
                >
                  <Sparkles className="w-4 h-4" />
                  مكتشف الهدايا الذكي
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header (nav + optional topbar) */}
      <div className={cn("transition-all duration-300", topBarText ? "h-[108px]" : "h-[107px]")} />
    </>
  )
}
