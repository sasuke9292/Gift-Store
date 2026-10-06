'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  ShoppingBag, 
  Heart, 
  Star, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Gift, 
  Plus, 
  Minus, 
  ArrowLeft,
  Check
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuickViewStore } from '@/lib/quick-view-store'
import { useCartStore, useFavoritesStore } from '@/lib/store'
import { useMounted } from '@/lib/use-mounted'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function getQuickViewFallbackImage(name: string, category?: string): string {
  const text = `${name} ${category || ''}`.toLowerCase()
  if (text.includes('عطر') || text.includes('مسك') || text.includes('عود')) {
    return 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800'
  }
  if (text.includes('ساعة') || text.includes('watch')) {
    return 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800'
  }
  if (text.includes('مجوهرات') || text.includes('قلادة') || text.includes('ذهب') || text.includes('فضة')) {
    return 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'
  }
  return 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'
}

export function QuickViewModal() {
  const router = useRouter()
  const mounted = useMounted()
  const { isOpen, product, closeQuickView } = useQuickViewStore()
  const addToCart = useCartStore((state) => state.addItem)
  const { addFavorite, removeFavorite, hasFavorite } = useFavoritesStore()

  const [quantity, setQuantity] = useState(1)
  const [selectedImgIndex, setSelectedImgIndex] = useState(0)
  const [isAdding, setIsAdding] = useState(false)

  if (!mounted || !isOpen || !product) return null

  const isFav = hasFavorite(product.id)
  const categoryName = typeof product.category === 'string' 
    ? product.category 
    : product.category?.name || 'هدية فاخرة'

  const images = (product.images && product.images.length > 0)
    ? product.images
    : [getQuickViewFallbackImage(product.name, categoryName)]

  const currentImg = images[selectedImgIndex] || images[0]
  const displayPrice = product.salePrice ?? product.price
  const hasDiscount = product.salePrice && product.salePrice < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: displayPrice,
      quantity: quantity,
      image: currentImg,
      category: categoryName
    }, true)

    toast.success('تمت إضافة الهدية إلى سلتك بنجاح ✨', {
      id: `qv-cart-${product.id}`
    })

    setTimeout(() => {
      setIsAdding(false)
      closeQuickView()
    }, 600)
  }

  const handleToggleFavorite = () => {
    if (isFav) {
      removeFavorite(product.id)
      toast.info('تمت الإزالة من قائمة الرغبات')
    } else {
      addFavorite({
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        image: currentImg,
        category: categoryName,
        isNew: product.isNew,
        isBestSeller: product.isBestSeller
      })
      toast.success('أضيفت إلى هداياك المفضلة ❤️')
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeQuickView}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white text-start shadow-2xl transition-all border border-slate-200"
        >
          {/* Close button */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 end-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors shadow-xs cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-8">
            {/* Gallery Column */}
            <div className="md:col-span-6 flex flex-col gap-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                <Image
                  src={currentImg}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-3 start-3 flex flex-col gap-1.5 z-10">
                  {product.isNew && (
                    <span className="inline-flex items-center gap-1 bg-[#13213c] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                      <Sparkles className="w-2.5 h-2.5" />
                      جديد
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="inline-flex items-center bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs" dir="ltr">
                      -{discountPercent}%
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails if multiple */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIndex(idx)}
                      className={cn(
                        "relative w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer",
                        selectedImgIndex === idx 
                          ? "border-[#13213c] shadow-xs scale-102" 
                          : "border-slate-200 opacity-70 hover:opacity-100"
                      )}
                    >
                      <Image src={img} alt="" fill sizes="56px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Column */}
            <div className="md:col-span-6 flex flex-col text-start justify-between">
              <div>
                {/* Category & Rating */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-[#13213c] bg-[#F0F4F9] px-2.5 py-0.5 rounded-full">
                    {categoryName}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>4.9</span>
                    <span className="text-slate-400 text-[10px]">(تقييم العملاء)</span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 mb-2.5 leading-snug">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4" dir="ltr">
                  <span className="text-xl sm:text-2xl font-black text-[#13213c]">
                    {displayPrice.toLocaleString('en-US')}
                  </span>
                  <span className="text-xs font-bold text-slate-500">د.ع</span>
                  {hasDiscount && (
                    <span className="text-xs text-slate-400 line-through">
                      {product.price.toLocaleString('en-US')} د.ع
                    </span>
                  )}
                </div>

                {/* Short highlights */}
                <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600 mb-5">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-[#13213c] shrink-0" />
                    <span>تغليف ملكي فاخر مجاناً مع كارت إهداء بكلماتك</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#13213c] shrink-0" />
                    <span>توصيل سريع لكافة محافظات العراق (24 - 48 ساعة)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>ضمان الجودة والأصالة 100% مع فحص عند الاستلام</span>
                  </div>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 transition-colors cursor-pointer"
                      aria-label="تقليل الكمية"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-black text-slate-900 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(99, quantity + 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 transition-colors cursor-pointer"
                      aria-label="زيادة الكمية"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleToggleFavorite}
                    className={cn(
                      "w-11 h-11 rounded-xl border flex items-center justify-center transition-all cursor-pointer",
                      isFav
                        ? "border-rose-200 bg-rose-50 text-rose-600"
                        : "border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-rose-600"
                    )}
                    aria-label="المفضلة"
                  >
                    <Heart className={cn("w-5 h-5", isFav && "fill-rose-500 text-rose-500")} />
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-white font-extrabold text-sm transition-all shadow-md cursor-pointer hover:-translate-y-0.5 active:scale-[0.99]"
                    style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
                  >
                    {isAdding ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>تمت الإضافة بنجاح ✨</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>أضف إلى السلة</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      closeQuickView()
                      router.push(`/product/${product.id}`)
                    }}
                    className="h-12 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>التفاصيل</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
