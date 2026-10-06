'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronDown, 
  Sparkles, 
  Flame, 
  Tag, 
  RotateCcw,
  ShoppingBag,
  ArrowUpDown
} from 'lucide-react'
import { ProductCard } from '@/components/store/product-card'
import { ProductQuickViewModal, QuickViewProduct } from '@/components/store/product-quick-view-modal'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug?: string
}

interface Product {
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

interface ShopClientProps {
  initialProducts: Product[]
  categories: Category[]
  initialActiveCategory?: string
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'new'

function normalizeArabic(text: string): string {
  if (!text) return ''
  return text
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .trim()
}

export default function ShopClient({ initialProducts, categories, initialActiveCategory }: ShopClientProps) {
  const [activeCategory, setActiveCategory] = useState(initialActiveCategory || 'الكل')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('default')
  const [onlyDiscounted, setOnlyDiscounted] = useState(false)
  const [onlyNew, setOnlyNew] = useState(false)
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<QuickViewProduct | null>(null)

  // Find price bounds
  const highestPrice = useMemo(() => {
    if (!initialProducts.length) return 200000
    return Math.max(...initialProducts.map(p => p.salePrice ?? p.price))
  }, [initialProducts])

  const filteredAndSorted = useMemo(() => {
    const normalizedQuery = normalizeArabic(searchQuery)

    let result = initialProducts.filter(product => {
      const price = product.salePrice ?? product.price
      const matchesCategory = activeCategory === 'الكل' || product.category?.name === activeCategory
      const matchesSearch = !normalizedQuery || 
        normalizeArabic(product.name).includes(normalizedQuery) ||
        normalizeArabic(product.category?.name || '').includes(normalizedQuery)
      const matchesDiscount = !onlyDiscounted || Boolean(product.salePrice && product.salePrice < product.price)
      const matchesNew = !onlyNew || Boolean(product.isNew)
      const matchesPrice = maxPrice === null || price <= maxPrice

      return matchesCategory && matchesSearch && matchesDiscount && matchesNew && matchesPrice
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
  }, [initialProducts, activeCategory, searchQuery, sortBy, onlyDiscounted, onlyNew, maxPrice])

  const filteredProducts = filteredAndSorted
  const allCategories = ['الكل', ...categories.map(c => c.name)]

  const hasActiveFilters = activeCategory !== 'الكل' || searchQuery !== '' || onlyDiscounted || onlyNew || maxPrice !== null

  const handleResetFilters = () => {
    setActiveCategory('الكل')
    setSearchQuery('')
    setSortBy('default')
    setOnlyDiscounted(false)
    setOnlyNew(false)
    setMaxPrice(null)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-4 pb-20 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="py-8 sm:py-10 text-start">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13213c]/5 border border-[#13213c]/10 text-xs font-bold text-[#13213c] mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
            <span>كتالوج الهدايا الكامل</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
            المتجر
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
            تصفح تشكيلتنا الاستثنائية من العطور، الساعات، الإكسسوارات، والبوكسات الملكية لكل مناسبة
          </p>
        </div>

        {/* Filter & Control Bar */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 mb-8 shadow-xs">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="ابحث بالاسم أو القسم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 ps-10 pe-9 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#13213c] focus:bg-white transition-all text-start"
              />
              <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                  aria-label="مسح"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filter Buttons & Sorting */}
            <div className="flex flex-wrap items-center gap-2.5 justify-end">
              {/* Only Discounted Toggle */}
              <button
                type="button"
                onClick={() => setOnlyDiscounted(!onlyDiscounted)}
                className={cn(
                  "h-10 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border",
                  onlyDiscounted
                    ? "bg-rose-50 border-rose-300 text-rose-700 shadow-2xs font-black"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                )}
              >
                <Flame className={cn("w-3.5 h-3.5", onlyDiscounted ? "text-rose-600" : "text-slate-400")} />
                <span>عروض وخصومات</span>
              </button>

              {/* Only New Toggle */}
              <button
                type="button"
                onClick={() => setOnlyNew(!onlyNew)}
                className={cn(
                  "h-10 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border",
                  onlyNew
                    ? "bg-blue-50 border-blue-300 text-blue-800 shadow-2xs font-black"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                )}
              >
                <Sparkles className={cn("w-3.5 h-3.5", onlyNew ? "text-blue-600" : "text-slate-400")} />
                <span>وصل حديثاً</span>
              </button>

              {/* Sort Selector */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="h-10 ps-3 pe-8 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-[#13213c] transition-all appearance-none cursor-pointer"
                >
                  <option value="default">الترتيب: الافتراضي</option>
                  <option value="price-asc">السعر: من الأقل للأعلى</option>
                  <option value="price-desc">السعر: من الأعلى للأقل</option>
                  <option value="new">الأحدث إضافة</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute end-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Mobile Filter Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden h-10 px-3.5 rounded-xl bg-[#13213c] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>فلترة متقدمة</span>
              </button>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-slate-100 scrollbar-none text-start">
            {allCategories.map((cat) => {
              const isSelected = activeCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer",
                    isSelected
                      ? "bg-[#13213c] text-white shadow-xs"
                      : "bg-slate-100/80 hover:bg-slate-200 text-slate-600"
                  )}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Active Filter Summary Bar if filters active */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-500 flex-wrap">
                <span className="font-bold text-slate-700">الفلاتر النشطة:</span>
                {activeCategory !== 'الكل' && (
                  <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg font-bold">
                    القسم: {activeCategory}
                  </span>
                )}
                {searchQuery && (
                  <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg font-bold">
                    بحث: &quot;{searchQuery}&quot;
                  </span>
                )}
                {onlyDiscounted && (
                  <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-lg font-bold">
                    عروض فقط
                  </span>
                )}
                {onlyNew && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-lg font-bold">
                    جديد فقط
                  </span>
                )}
                {maxPrice !== null && (
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg font-bold">
                    أقل من {maxPrice.toLocaleString('en-US')} د.ع
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:underline font-bold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>إعادة ضبط</span>
              </button>
            </div>
          )}
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between mb-6 text-xs font-bold text-slate-500">
          <span>يتم عرض {filteredProducts.length} من أصل {initialProducts.length} منتج</span>
          <span>{filteredProducts.length === 1 ? 'منتج واحد' : `${filteredProducts.length} منتجات`}</span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
            <ShoppingBag className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-900 mb-2">لا توجد منتجات تطابق الفلاتر المحددة</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-md mx-auto">
              جرّب تغيير كلمات البحث أو إعادة ضبط خيارات التصفية للعثور على ما تبحث عنه
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#13213c] text-white text-xs font-black transition-all hover:bg-[#1e3256] shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط الفلاتر</span>
            </button>
          </div>
        )}

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-xs"
                onClick={() => setIsMobileFilterOpen(false)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white text-slate-900 shadow-2xl z-50 flex flex-col font-sans p-6 overflow-y-auto"
                dir="rtl"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <h3 className="text-base font-black text-slate-900">تصفية المنتجات</h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="py-4 space-y-6 flex-1 text-start">
                  {/* Category */}
                  <div>
                    <h4 className="text-xs font-black text-slate-800 mb-3">الأقسام</h4>
                    <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                      {allCategories.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setActiveCategory(cat)}
                          className={cn(
                            "px-3 py-2 rounded-xl text-xs font-bold text-start transition-colors cursor-pointer",
                            activeCategory === cat
                              ? "bg-[#13213c] text-white"
                              : "hover:bg-slate-100 text-slate-700"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <h4 className="text-xs font-black text-slate-800 mb-2">أقصى سعر</h4>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="10000"
                        max={highestPrice}
                        step="5000"
                        value={maxPrice ?? highestPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full accent-[#13213c] cursor-pointer"
                      />
                      <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>10,000 د.ع</span>
                        <span className="text-[#13213c] font-black">
                          {((maxPrice ?? highestPrice)).toLocaleString('en-US')} د.ع
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div>
                    <h4 className="text-xs font-black text-slate-800 mb-3">خيارات إضافية</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={onlyDiscounted}
                          onChange={(e) => setOnlyDiscounted(e.target.checked)}
                          className="rounded text-[#13213c] accent-[#13213c]"
                        />
                        <span>عروض وتخفيضات خاصة فقط</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={onlyNew}
                          onChange={(e) => setOnlyNew(e.target.checked)}
                          className="rounded text-[#13213c] accent-[#13213c]"
                        />
                        <span>وصل حديثاً فقط</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="pt-4 border-t border-slate-200 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="flex-1 h-11 rounded-xl bg-[#13213c] text-white text-xs font-black shadow-xs cursor-pointer"
                  >
                    تطبيق الفلاتر
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleResetFilters()
                      setIsMobileFilterOpen(false)
                    }}
                    className="h-11 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold cursor-pointer"
                  >
                    إعادة ضبط
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Quick View Modal */}
        <ProductQuickViewModal
          product={quickViewProduct}
          isOpen={Boolean(quickViewProduct)}
          onClose={() => setQuickViewProduct(null)}
        />
      </div>
    </div>
  )
}
