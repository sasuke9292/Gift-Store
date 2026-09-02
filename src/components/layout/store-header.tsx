'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingCart, User, Heart, Menu, LogOut, Package } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useCartStore, useFavoritesStore } from '@/lib/store'
import { signOut } from 'next-auth/react'

interface StoreHeaderProps {
  user?: {
    id: string
    name?: string | null
    email?: string | null
    role?: string
  }
}

export function StoreHeader({ user }: StoreHeaderProps) {
  const cartItems = useCartStore(state => state.items)
  const favorites = useFavoritesStore(state => state.items)
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const favCount = favorites.length

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm font-medium">
        شحن مجاني للطلبات أكثر من 100,000 د.ع 🎁
      </div>
      
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden text-slate-500" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="w-6 h-6" />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
                G
              </div>
              <span className="text-2xl font-bold text-slate-800 hidden sm:block">گفتي بلس</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden lg:block">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="ابحث عن هدية، منتج، أو مناسبة..." 
                className="w-full h-12 pe-4 ps-12 rounded-full border-slate-200 bg-slate-50 focus-visible:ring-primary/20 text-base"
              />
              <Button size="icon" className="absolute start-1 top-1 h-10 w-10 rounded-full bg-primary hover:bg-primary/90">
                <Search className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/favorites" className={buttonVariants({ variant: "ghost", size: "icon", className: "text-slate-600 hover:text-primary relative hidden sm:flex rounded-full" })}>
              <Heart className="w-5 h-5" />
              {mounted && favCount > 0 && (
                <Badge className="absolute -top-1 -start-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full bg-rose-500 text-white border-0">
                  {favCount}
                </Badge>
              )}
            </Link>
            
            <Link href="/cart" className={buttonVariants({ variant: "ghost", size: "icon", className: "text-slate-600 hover:text-primary relative rounded-full" })}>
              <ShoppingCart className="w-5 h-5" />
              {mounted && cartCount > 0 && (
                <Badge className="absolute -top-1 -start-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full bg-primary text-white">
                  {cartCount}
                </Badge>
              )}
            </Link>
            
            {user ? (
              user.role === 'CUSTOMER' ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="hidden md:flex items-center gap-2 rounded-full px-4 py-2 text-slate-600 hover:bg-slate-100 transition-colors">
                    <User className="w-5 h-5" />
                    <span className="font-medium">{user.name?.split(' ')[0] || 'حسابي'}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <Link href="/profile" className="flex items-center gap-2 cursor-pointer w-full h-full">
                        <User className="w-4 h-4" /> ملفي الشخصي
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/profile" className="flex items-center gap-2 cursor-pointer w-full h-full">
                        <Package className="w-4 h-4" /> طلباتي
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()} className="text-red-600 focus:text-red-600 cursor-pointer">
                      <LogOut className="w-4 h-4" /> تسجيل الخروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth/login" className={buttonVariants({ variant: "ghost", className: "text-slate-600 hover:text-primary hidden md:flex items-center gap-2 rounded-full px-4" })}>
                  <User className="w-5 h-5" />
                  <span className="font-medium">تسجيل دخول العملاء</span>
                </Link>
              )
            ) : (
              <Link href="/auth/login" className={buttonVariants({ variant: "ghost", className: "text-slate-600 hover:text-primary hidden md:flex items-center gap-2 rounded-full px-4" })}>
                <User className="w-5 h-5" />
                <span className="font-medium">تسجيل الدخول</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden lg:block border-t border-slate-50 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-center gap-8 h-12 text-sm font-medium text-slate-600">
            <li><Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link></li>
            <li><Link href="/category/men" className="hover:text-primary transition-colors">هدايا رجالية</Link></li>
            <li><Link href="/category/women" className="hover:text-primary transition-colors">هدايا نسائية</Link></li>
            <li><Link href="/category/occasions" className="hover:text-primary transition-colors">مناسبات</Link></li>
            <li><Link href="/category/custom" className="hover:text-primary transition-colors">منتجات مخصصة</Link></li>
            <li><Link href="/category/offers" className="text-red-500 hover:text-red-600 transition-colors">عروض وتخفيضات</Link></li>
          </ul>
        </div>
      </nav>
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-4 shadow-lg absolute w-full z-50">
          <div className="relative mb-4">
            <Input 
              type="text" 
              placeholder="ابحث عن هدية..." 
              className="w-full h-12 pe-4 ps-12 rounded-xl border-slate-200 bg-slate-50 text-base"
            />
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
          <ul className="flex flex-col gap-4 text-slate-700 font-bold">
            <li><Link href="/" onClick={() => setIsMobileMenuOpen(false)}>الرئيسية</Link></li>
            <li><Link href="/category/men" onClick={() => setIsMobileMenuOpen(false)}>هدايا رجالية</Link></li>
            <li><Link href="/category/women" onClick={() => setIsMobileMenuOpen(false)}>هدايا نسائية</Link></li>
            <li><Link href="/category/occasions" onClick={() => setIsMobileMenuOpen(false)}>مناسبات</Link></li>
            <li><Link href="/category/offers" className="text-red-500" onClick={() => setIsMobileMenuOpen(false)}>عروض وتخفيضات</Link></li>
            <li className="pt-4 border-t border-slate-100 flex gap-4">
              {user ? (
                <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50" onClick={() => signOut()}>
                  <LogOut className="w-4 h-4 me-2" /> تسجيل الخروج
                </Button>
              ) : (
                <Link href="/auth/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">تسجيل الدخول</Button>
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
