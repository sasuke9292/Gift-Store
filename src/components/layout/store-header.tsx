'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingCart, Heart, Menu, Sparkles } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useCartStore, useFavoritesStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface StoreHeaderProps {
  user?: {
    id: string
    name?: string | null
    email?: string | null
    role?: string
  }
  topBarText?: string
}

export function StoreHeader({ user, topBarText }: StoreHeaderProps) {
  const cartItems = useCartStore(state => state.items)
  const favorites = useFavoritesStore(state => state.items)
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const favCount = favorites.length

  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b",
      isScrolled 
        ? "bg-[#050B14]/80 backdrop-blur-xl border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]" 
        : "bg-transparent border-transparent"
    )}>
      {/* Top Bar */}
      {topBarText && (
        <div className="bg-[#010306] border-b border-white/5 text-white/90 py-1.5 px-4 text-center text-xs font-bold tracking-wide">
          <Sparkles className="inline-block w-3 h-3 me-2 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" />
          {topBarText}
        </div>
      )}
      
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="w-6 h-6" />
            </Button>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-transform group-hover:scale-110 bg-gradient-to-tr from-amber-400 to-amber-600 text-[#050B14]">
                G
              </div>
              <span className="text-2xl font-black hidden sm:block tracking-tight text-white drop-shadow-md">
                گِفتي بلس
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden lg:block">
            <div className="relative group">
              <Input 
                type="text" 
                placeholder="ابحث عن هدية، منتج، أو مناسبة..." 
                className="w-full h-12 pe-4 ps-12 rounded-full border border-white/10 focus-visible:ring-2 focus-visible:ring-amber-500/50 text-base transition-all shadow-inner bg-white/5 text-white placeholder:text-white/40 hover:bg-white/10"
              />
              <Button size="icon" className="absolute start-1 top-1 h-10 w-10 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:scale-105 shadow-[0_5px_15px_rgba(251,191,36,0.4)] transition-transform">
                <Search className="w-4 h-4 text-[#050B14]" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/favorites" className="relative hidden sm:flex rounded-full w-10 h-10 items-center justify-center transition-colors text-white hover:bg-white/10 glass-button border-transparent hover:border-white/10">
              <Heart className="w-5 h-5 drop-shadow-md" />
              {mounted && favCount > 0 && (
                <Badge className="absolute -top-2 -start-2 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold rounded-full bg-amber-500 text-[#050B14] border-0 shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                  {favCount}
                </Badge>
              )}
            </Link>
            
            <Link href="/cart" className="relative flex rounded-full w-10 h-10 items-center justify-center transition-colors text-white hover:bg-white/10 glass-button border-transparent hover:border-white/10">
              <ShoppingCart className="w-5 h-5 drop-shadow-md" />
              {mounted && cartCount > 0 && (
                <Badge className="absolute -top-2 -start-2 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold rounded-full bg-amber-500 text-[#050B14] border-0 shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                  {cartCount}
                </Badge>
              )}
            </Link>
            
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "hidden lg:block border-t transition-colors",
        isScrolled ? "border-white/10 bg-[#050B14]/40" : "border-white/5 bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-center gap-10 h-14 text-sm font-bold text-slate-300">
            <li><Link href="/" className="hover:text-amber-400 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] transition-all">الرئيسية</Link></li>
            <li><Link href="/category/men" className="hover:text-amber-400 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] transition-all">هدايا رجالية</Link></li>
            <li><Link href="/category/women" className="hover:text-amber-400 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] transition-all">هدايا نسائية</Link></li>
            <li><Link href="/category/occasions" className="hover:text-amber-400 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] transition-all">مناسبات</Link></li>
            <li><Link href="/category/custom" className="hover:text-amber-400 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] transition-all">منتجات مخصصة</Link></li>
            <li><Link href="/category/offers" className="text-rose-400 hover:text-rose-300 hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.6)] transition-all">عروض وتخفيضات</Link></li>
          </ul>
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#050B14]/95 backdrop-blur-3xl px-4 py-6 border-b border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] absolute w-full z-50">
          <div className="relative mb-6">
            <Input 
              type="text" 
              placeholder="ابحث عن هدية..." 
              className="w-full h-12 pe-4 ps-12 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-amber-500/50"
            />
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          </div>
          <ul className="flex flex-col gap-4 text-slate-300 font-bold text-lg">
            <li><Link href="/" className="hover:text-amber-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>الرئيسية</Link></li>
            <li><Link href="/category/men" className="hover:text-amber-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>هدايا رجالية</Link></li>
            <li><Link href="/category/women" className="hover:text-amber-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>هدايا نسائية</Link></li>
            <li><Link href="/category/occasions" className="hover:text-amber-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>مناسبات</Link></li>
            <li><Link href="/category/offers" className="text-rose-400 hover:text-rose-300 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>عروض وتخفيضات</Link></li>
          </ul>
        </div>
      )}
    </header>
  )
}
