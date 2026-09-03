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
        ? "bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-sm" 
        : "bg-transparent border-transparent"
    )}>
      {/* Top Bar */}
      {topBarText && (
        <div className="bg-[#0a1128] text-white/90 py-1.5 px-4 text-center text-xs font-medium tracking-wide">
          <Sparkles className="inline-block w-3 h-3 me-2 text-blue-400" />
          {topBarText}
        </div>
      )}
      
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className={cn("lg:hidden", isScrolled ? "text-slate-800" : "text-white")} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="w-6 h-6" />
            </Button>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg transition-transform group-hover:scale-105 bg-gradient-to-tr from-blue-600 to-sky-400 text-white">
                G
              </div>
              <span className={cn(
                "text-2xl font-black hidden sm:block tracking-tight transition-colors",
                isScrolled ? "text-slate-900" : "text-white"
              )}>گفتي بلس</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden lg:block">
            <div className="relative group">
              <Input 
                type="text" 
                placeholder="ابحث عن هدية، منتج، أو مناسبة..." 
                className={cn(
                  "w-full h-12 pe-4 ps-12 rounded-full border-0 focus-visible:ring-2 focus-visible:ring-blue-500/50 text-base transition-all shadow-inner",
                  isScrolled 
                    ? "bg-slate-100/80 text-slate-900 placeholder:text-slate-500" 
                    : "bg-white/10 text-white placeholder:text-white/60 backdrop-blur-md hover:bg-white/20"
                )}
              />
              <Button size="icon" className="absolute start-1 top-1 h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-500 shadow-md">
                <Search className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/favorites" className={cn(
              "relative hidden sm:flex rounded-full w-10 h-10 items-center justify-center transition-colors",
              isScrolled ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/10"
            )}>
              <Heart className="w-5 h-5" />
              {mounted && favCount > 0 && (
                <Badge className="absolute -top-1 -start-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full bg-rose-500 text-white border-0 shadow-md">
                  {favCount}
                </Badge>
              )}
            </Link>
            
            <Link href="/cart" className={cn(
              "relative flex rounded-full w-10 h-10 items-center justify-center transition-colors",
              isScrolled ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/10"
            )}>
              <ShoppingCart className="w-5 h-5" />
              {mounted && cartCount > 0 && (
                <Badge className="absolute -top-1 -start-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full bg-blue-600 text-white border-0 shadow-md">
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
        isScrolled ? "border-slate-100 bg-white/80 backdrop-blur-xl" : "border-white/10 bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className={cn(
            "flex items-center justify-center gap-10 h-14 text-sm font-semibold transition-colors",
            isScrolled ? "text-slate-600" : "text-white/90"
          )}>
            <li><Link href="/" className="hover:text-blue-400 transition-colors">الرئيسية</Link></li>
            <li><Link href="/category/men" className="hover:text-blue-400 transition-colors">هدايا رجالية</Link></li>
            <li><Link href="/category/women" className="hover:text-blue-400 transition-colors">هدايا نسائية</Link></li>
            <li><Link href="/category/occasions" className="hover:text-blue-400 transition-colors">مناسبات</Link></li>
            <li><Link href="/category/custom" className="hover:text-blue-400 transition-colors">منتجات مخصصة</Link></li>
            <li><Link href="/category/offers" className="text-rose-400 hover:text-rose-300 transition-colors">عروض وتخفيضات</Link></li>
          </ul>
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-3xl px-4 py-6 border-b border-slate-100 shadow-2xl absolute w-full z-50">
          <div className="relative mb-6">
            <Input 
              type="text" 
              placeholder="ابحث عن هدية..." 
              className="w-full h-12 pe-4 ps-12 rounded-xl border-slate-200 bg-slate-50 text-base"
            />
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
          <ul className="flex flex-col gap-4 text-slate-800 font-bold text-lg">
            <li><Link href="/" onClick={() => setIsMobileMenuOpen(false)}>الرئيسية</Link></li>
            <li><Link href="/category/men" onClick={() => setIsMobileMenuOpen(false)}>هدايا رجالية</Link></li>
            <li><Link href="/category/women" onClick={() => setIsMobileMenuOpen(false)}>هدايا نسائية</Link></li>
            <li><Link href="/category/occasions" onClick={() => setIsMobileMenuOpen(false)}>مناسبات</Link></li>
            <li><Link href="/category/offers" className="text-rose-500" onClick={() => setIsMobileMenuOpen(false)}>عروض وتخفيضات</Link></li>
          </ul>
        </div>
      )}
    </header>
  )
}
