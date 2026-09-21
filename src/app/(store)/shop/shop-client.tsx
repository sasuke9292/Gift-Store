'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Filter, Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'
import { ProductCard } from '@/components/store/product-card'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  price: number
  salePrice?: number | null
  isNew?: boolean
  isBestSeller?: boolean
  images?: string[]
  category?: { name: string } | null
}

interface ShopClientProps {
  initialProducts: Product[]
  categories: Category[]
  initialActiveCategory?: string
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'new'

export default function ShopClient({ initialProducts, categories, initialActiveCategory }: ShopClientProps) {
  const [activeCategory, setActiveCategory] = useState(initialActiveCategory || 'الكل')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('default')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const filteredAndSorted = useMemo(() => {
    let result = initialProducts.filter(product => {
      const matchesCategory = activeCategory === 'الكل' || product.category?.name === activeCategory
      const matchesSearch = !searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })

    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))
        break
      case 'price-desc':
        result = [...result].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price))
        break
      case 'new':
        result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
    }

    return result
  }, [initialProducts, activeCategory, searchQuery, sortBy])

  const allCategories = ['الكل', ...categories.map(c => c.name)]

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="py-10">
          <p className="text-sm font-bold text-[#C9A96E] uppercase tracking-widest mb-2">استكشف</p>
          <h1 className="text-4xl sm:text-5xl font-black text-[#1C1917] tracking-tight mb-3">المتجر</h1>
          <p className="text-[#78716C] text-lg">تصفح تشكيلة واسعة من الهدايا المميزة لكل المناسبات</p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 pb-8 border-b border-[#E8E4DF]">
          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-sm">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
            <Input
              placeholder="ابحث عن منتج..."
              className="ps-10 h-11 rounded-xl bg-white border-[#E8E4DF] text-[#1C1917] placeholder:text-[#A8A29E] focus-visible:ring-[#C9A96E]/30 focus-visible:border-[#C9A96E]/40 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#78716C]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort — Desktop */}
          <div className="hidden sm:flex items-center gap-3 ms-auto">
            <span className="text-sm text-[#A8A29E] font-medium">ترتيب:</span>
            <div className="flex items-center gap-2">
              {[
                { value: 'default', label: 'الافتراضي' },
                { value: 'new', label: 'الأحدث' },
                { value: 'price-asc', label: 'الأقل سعراً' },
                { value: 'price-desc', label: 'الأعلى سعراً' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value as SortOption)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-semibold transition-all",
                    sortBy === opt.value
                      ? "bg-[#1C1917] text-white"
                      : "text-[#78716C] hover:bg-[#F5F0EA]"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            className="sm:hidden flex items-center gap-2 h-11 rounded-xl border-[#E8E4DF] text-[#78716C]"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            فلتر
          </Button>
        </div>

        {/* Results count */}
        <div className="flex items-center gap-2 mb-6">
          <p className="text-sm text-[#A8A29E]">
            <span className="font-bold text-[#1C1917]">{filteredAndSorted.length}</span> منتج
            {activeCategory !== 'الكل' && (
              <span> في <span className="font-bold text-[#C9A96E]">{activeCategory}</span></span>
            )}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar — Desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-[#E8E4DF] p-5 sticky top-28 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <h3 className="font-black text-[#1C1917] text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#C9A96E]" />
                التصنيفات
              </h3>
              <ul className="space-y-1">
                {allCategories.map(cat => (
                  <li key={cat}>
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "w-full text-start px-3 py-2.5 rounded-xl text-sm transition-all duration-200 font-medium",
                        activeCategory === cat
                          ? "bg-[#1C1917] text-white font-bold"
                          : "text-[#78716C] hover:bg-[#F5F0EA] hover:text-[#1C1917]"
                      )}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Mobile Filters */}
          <AnimatePresence>
            {isMobileFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden"
              >
                <div className="bg-white rounded-2xl border border-[#E8E4DF] p-4 mb-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {allCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => { setActiveCategory(cat); setIsMobileFilterOpen(false) }}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-semibold transition-all",
                          activeCategory === cat
                            ? "bg-[#1C1917] text-white"
                            : "bg-[#F5F0EA] text-[#78716C] hover:bg-[#E8E4DF]"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-[#E8E4DF] pt-4">
                    <p className="text-xs text-[#A8A29E] font-bold uppercase tracking-wider mb-2">ترتيب حسب</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'default', label: 'الافتراضي' },
                        { value: 'new', label: 'الأحدث' },
                        { value: 'price-asc', label: 'الأقل سعراً' },
                        { value: 'price-desc', label: 'الأعلى سعراً' },
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setSortBy(opt.value as SortOption)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-semibold transition-all",
                            sortBy === opt.value
                              ? "bg-[#1C1917] text-white"
                              : "bg-[#F5F0EA] text-[#78716C]"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {filteredAndSorted.length > 0 ? (
                <motion.div
                  key={`${activeCategory}-${searchQuery}-${sortBy}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                  {filteredAndSorted.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.04, 0.4), duration: 0.4 }}
                      className="h-full"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <div className="w-20 h-20 rounded-full bg-[#F5F0EA] flex items-center justify-center mx-auto mb-5">
                    <Search className="w-8 h-8 text-[#C9A96E]/60" />
                  </div>
                  <h3 className="text-xl font-black text-[#1C1917] mb-2">لا توجد منتجات</h3>
                  <p className="text-[#A8A29E] mb-6">لم نتمكن من العثور على منتجات تطابق بحثك</p>
                  <Button
                    onClick={() => { setSearchQuery(''); setActiveCategory('الكل') }}
                    className="rounded-xl font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
                  >
                    إعادة ضبط البحث
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
