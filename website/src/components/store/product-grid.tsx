'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles, Star, Flame, Gift } from 'lucide-react'
import { ProductCard } from './product-card'
import { ProductQuickViewModal, QuickViewProduct } from './product-quick-view-modal'
import { cn } from '@/lib/utils'

export interface ProductItem {
  id: string
  name: string
  price: number
  salePrice?: number | null
  description?: string | null
  isNew?: boolean
  isBestSeller?: boolean
  images?: string[]
  category?: { name: string } | null
}

interface ProductGridProps {
  products: ProductItem[]
  title?: string
  badge?: string
}

type TabKey = 'all' | 'best' | 'new' | 'sale'

export function ProductGrid({
  products,
  title = 'المنتجات الأكثر رواجاً وإهداءً',
  badge = 'مختارات استثنائية للإهداء'
}: ProductGridProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [quickViewProduct, setQuickViewProduct] = useState<QuickViewProduct | null>(null)

  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'all', label: 'كل المنتجات', icon: Gift },
    { key: 'best', label: 'الأكثر طلباً', icon: Star },
    { key: 'new', label: 'وصل حديثاً', icon: Sparkles },
    { key: 'sale', label: 'عروض وتخفيضات', icon: Flame },
  ]

  const filteredProducts = useMemo(() => {
    if (!products) return []
    switch (activeTab) {
      case 'best':
        return products.filter(p => p.isBestSeller)
      case 'new':
        return products.filter(p => p.isNew)
      case 'sale':
        return products.filter(p => p.salePrice && p.salePrice < p.price)
      case 'all':
      default:
        return products
    }
  }, [products, activeTab])

  return (
    <section className="py-12 sm:py-16 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10 text-start">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13213c]/5 border border-[#13213c]/10 text-xs font-bold text-[#13213c] mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
              <span>{badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {title}
            </h2>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-x-auto max-w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer",
                    isActive
                      ? "bg-[#13213c] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", isActive ? "text-amber-300" : "text-slate-400")} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6"
          >
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8">
            <Gift className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-black text-slate-800 mb-1">لا توجد منتجات مطابقة لهذا التبويب حالياً</h3>
            <p className="text-xs text-slate-500 mb-4">جرّب استعراض كل المنتجات لتصفح جميع الهدايا المتوفرة</p>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors"
            >
              عرض كل المنتجات
            </button>
          </div>
        )}

        {/* View All Shop Link */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-2xl font-black text-[#13213c] bg-white border border-slate-200 hover:border-[#13213c] hover:bg-slate-50 transition-all shadow-xs hover:-translate-y-0.5 text-xs sm:text-sm"
          >
            <span>عرض كافة المنتجات في المتجر</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick View Modal */}
        <ProductQuickViewModal
          product={quickViewProduct}
          isOpen={Boolean(quickViewProduct)}
          onClose={() => setQuickViewProduct(null)}
        />
      </div>
    </section>
  )
}
