'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Sparkles, ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSearchStore } from '@/lib/search-store'
import { useCartStore } from '@/lib/store'
import { useMounted } from '@/lib/use-mounted'
import { searchProducts } from '@/app/actions/products'
import { toast } from 'sonner'

const POPULAR_KEYWORDS = [
  'عطور فاخرة',
  'ساعات رجالية',
  'مجوهرات نسائية',
  'بوكسات هدايا',
  'هدايا بالاسم',
  'تخرج',
  'عيد ميلاد'
]

export function SearchOverlay() {
  const router = useRouter()
  const mounted = useMounted()
  const { isOpen, closeSearch } = useSearchStore()
  const addToCart = useCartStore((state) => state.addItem)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setResults([])
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setResults([])
      setIsLoading(false)
      return
    }

    let isCurrent = true
    setIsLoading(true)

    const timer = setTimeout(async () => {
      try {
        const res = await searchProducts(trimmed)
        if (isCurrent) {
          setResults(res)
        }
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }, 250)

    return () => {
      isCurrent = false
      clearTimeout(timer)
    }
  }, [query])

  if (!mounted || !isOpen) return null

  const handleSelectProduct = (id: string) => {
    closeSearch()
    router.push(`/product/${id}`)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeSearch}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
      />

      {/* Search Modal Box */}
      <div className="relative min-h-screen flex flex-col items-center justify-start pt-12 sm:pt-20 px-4 sm:px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Top Search Input Bar */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <Search className="w-6 h-6 text-[#13213c] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن هدية، عطر، ساعة، بوكس، مناسبة..."
              className="flex-1 bg-transparent border-none text-base sm:text-xl font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-300 transition-colors"
                aria-label="مسح البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={closeSearch}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              إلغاء (ESC)
            </button>
          </div>

          {/* Quick Keywords Tags */}
          <div className="p-4 sm:px-6 py-3 bg-[#F8FAFC] border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-black text-slate-400 shrink-0">الأكثر بحثاً:</span>
            {POPULAR_KEYWORDS.map((kw) => (
              <button
                key={kw}
                onClick={() => setQuery(kw)}
                className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-[#13213c] hover:text-[#13213c] transition-all shrink-0 cursor-pointer"
              >
                {kw}
              </button>
            ))}
          </div>

          {/* Search Content / Results */}
          <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#13213c]" />
                <p className="text-xs font-bold">جارٍ البحث في تشكيلة الهدايا...</p>
              </div>
            ) : query.trim().length >= 2 && results.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h4 className="text-base font-black text-slate-900 mb-1">لم نجد نتائج مطابقة</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  جرّب البحث بكلمات أخرى مثل &quot;عطور&quot;، &quot;ساعة&quot;، أو تصفح الأقسام مباشرة.
                </p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-black text-slate-400 mb-3">
                  وجدت {results.length} من الهدايا المطابقة:
                </p>
                {results.map((product) => {
                  const displayPrice = product.salePrice ?? product.price
                  const img = (product.images && product.images[0]) || '/logo-navy.png'

                  return (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product.id)}
                      className="flex items-center justify-between gap-3 p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <Image src={img} alt="" fill sizes="56px" className="object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="min-w-0">
                          {product.category?.name && (
                            <p className="text-[10px] font-bold text-[#13213c] mb-0.5">
                              {product.category.name}
                            </p>
                          )}
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-[#13213c] transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-xs font-black text-[#13213c]" dir="ltr">
                            {displayPrice.toLocaleString('en-US')} <span className="text-[10px] text-slate-500 font-bold">د.ع</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            addToCart({
                              id: `${product.id}-${Date.now()}`,
                              productId: product.id,
                              name: product.name,
                              price: displayPrice,
                              quantity: 1,
                              image: img,
                              category: product.category?.name
                            }, true)
                            toast.success('تمت إضافة المنتج للسلة')
                          }}
                          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-[#13213c] text-slate-700 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          title="إضافة سريعة للسلة"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                        <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                اكتب اسم الهدية أو اختر من الكلمات الأكثر بحثاً أعلاه للبدء.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
