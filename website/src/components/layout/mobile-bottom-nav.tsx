'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingBag, Sparkles, Heart, ShoppingCart } from 'lucide-react'
import { useCartStore, useFavoritesStore } from '@/lib/store'
import { useMounted } from '@/lib/use-mounted'
import { cn } from '@/lib/utils'

export function MobileBottomNav() {
  const pathname = usePathname()
  const mounted = useMounted()
  const cartItems = useCartStore(state => state.items)
  const favorites = useFavoritesStore(state => state.items)

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const favCount = favorites.length

  // Hide on admin routes, cart page, and product pages (which have dedicated sticky action bars)
  if (pathname.startsWith('/admin') || pathname === '/cart' || pathname.startsWith('/product/')) {
    return null
  }

  const navItems = [
    {
      href: '/',
      label: 'الرئيسية',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      href: '/shop',
      label: 'المتجر',
      icon: ShoppingBag,
      isActive: pathname === '/shop' || pathname.startsWith('/category'),
    },
    {
      href: '/gift-finder',
      label: 'المكتشف',
      icon: Sparkles,
      isSpecial: true,
      isActive: pathname === '/gift-finder',
    },
    {
      href: '/favorites',
      label: 'المفضلة',
      icon: Heart,
      badge: mounted && favCount > 0 ? favCount : null,
      isActive: pathname === '/favorites',
    },
    {
      href: '/cart',
      label: 'السلة',
      icon: ShoppingCart,
      badge: mounted && cartCount > 0 ? cartCount : null,
      isActive: pathname === '/cart',
    },
  ]

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E8E4DF] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]" dir="rtl">
      <nav className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon

          if (item.isSpecial) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-3 flex flex-col items-center group focus:outline-none"
                aria-label={item.label}
              >
                <div 
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-[0_4px_16px_rgba(19, 33, 60,0.45)] transition-transform active:scale-95",
                    item.isActive ? "ring-2 ring-[#1C1917]" : ""
                  )}
                  style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
                >
                  <Icon className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-[10px] font-black text-[#13213c] mt-1">
                  {item.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-colors active:scale-95 focus:outline-none",
                item.isActive 
                  ? "text-[#13213c]" 
                  : "text-[#78716C] hover:text-[#1C1917]"
              )}
              aria-label={item.label}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5 transition-transform", item.isActive && "scale-110")} />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1.5 -start-2 min-w-4 h-4 px-1 rounded-full bg-[#E85D75] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] mt-1 tracking-tight transition-colors",
                item.isActive ? "font-black text-[#13213c]" : "font-bold text-[#78716C]"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
