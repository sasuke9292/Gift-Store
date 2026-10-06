'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Star, Sparkles, Check, Eye } from 'lucide-react'
import { useCartStore, useFavoritesStore } from '@/lib/store'
import { useQuickViewStore } from '@/lib/quick-view-store'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useMounted } from '@/lib/use-mounted'
import { motion } from 'framer-motion'

export interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    salePrice?: number | null
    isNew?: boolean
    isBestSeller?: boolean
    images?: string[]
    category?: { name: string } | null
  }
}

function getProductFallbackImage(name: string, categoryName?: string): string {
  const text = `${name} ${categoryName || ''}`.toLowerCase()
  if (text.includes('عطر') || text.includes('مسك') || text.includes('عود') || text.includes('توم فورد') || text.includes('روائح')) {
    return 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800'
  }
  if (text.includes('ساعة') || text.includes('watch') || text.includes('رولكس') || text.includes('أطقم')) {
    return 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800'
  }
  if (text.includes('قلادة') || text.includes('سلسلة') || text.includes('مجوهرات') || text.includes('ذهب') || text.includes('فضة') || text.includes('سوار') || text.includes('خاتم')) {
    return 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'
  }
  if (text.includes('ورد') || text.includes('باقة') || text.includes('زهور') || text.includes('جوري') || text.includes('طبيعي')) {
    return 'https://images.unsplash.com/photo-1563241598-a2886f4a8e63?auto=format&fit=crop&q=80&w=800'
  }
  if (text.includes('محفظة') || text.includes('حزام') || text.includes('جلد') || text.includes('حقيبة')) {
    return 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800'
  }
  if (text.includes('دب') || text.includes('أطفال') || text.includes('بيبي') || text.includes('قطيفة') || text.includes('مكعب') || text.includes('لعبة') || text.includes('ألعاب') || text.includes('تعليمي')) {
    return 'https://images.unsplash.com/photo-1560859254-809fa84742f3?auto=format&fit=crop&q=80&w=800'
  }
  if (text.includes('شوكولات') || text.includes('حلويات') || text.includes('كيك') || text.includes('بلجيكي')) {
    return 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=800'
  }
  if (text.includes('سماعات') || text.includes('إلكترونيات')) {
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'
  }
  return 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addItem)
  const { addFavorite, removeFavorite, hasFavorite } = useFavoritesStore()
  const openQuickView = useQuickViewStore((state) => state.openQuickView)
  const mounted = useMounted()

  const [imgError, setImgError] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const isFav = mounted && hasFavorite(product.id)
  const displayPrice = product.salePrice ?? product.price
  const hasDiscount = Boolean(product.salePrice && product.salePrice < product.price)
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0

  const primaryImage = (!imgError && product.images && product.images[0] && !product.images[0].includes('placeholder') && !product.images[0].includes('broken') && product.images[0].trim() !== '')
    ? product.images[0]
    : getProductFallbackImage(product.name, product.category?.name)

  const secondaryImage = (product.images && product.images.length > 1 && product.images[1] && !product.images[1].includes('placeholder'))
    ? product.images[1]
    : null

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    addToCart({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: displayPrice,
      quantity: 1,
      image: primaryImage,
      category: product.category?.name,
    }, true)
    
    toast.success('تمت إضافة الهدية إلى سلتك بنجاح ✨', {
      id: `cart-${product.id}`,
    })
    setTimeout(() => setIsAdding(false), 700)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isFav) {
      removeFavorite(product.id)
      toast.info('تمت الإزالة من قائمة الرغبات', { id: `fav-rem-${product.id}` })
    } else {
      addFavorite({
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        image: primaryImage,
        category: product.category?.name,
        isNew: product.isNew,
        isBestSeller: product.isBestSeller,
      })
      toast.success('أضيفت إلى هداياك المفضلة ❤️', { id: `fav-add-${product.id}` })
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    openQuickView({
      ...product,
      images: [primaryImage, ...(secondaryImage ? [secondaryImage] : [])]
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative bg-white rounded-3xl overflow-hidden flex flex-col h-full",
        "border border-slate-200/90 transition-all duration-300",
        "hover:shadow-[0_16px_36px_rgba(19,33,60,0.12)] hover:-translate-y-1 hover:border-[#13213c]/40"
      )}
      dir="rtl"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-slate-100/70 select-none">
        
        {/* Floating Badges */}
        <div className="absolute top-2.5 sm:top-3 start-2.5 sm:start-3 z-20 flex flex-col gap-1.5 pointer-events-none">
          {product.isNew && (
            <span className="inline-flex items-center gap-1 bg-[#13213c] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              جديد
            </span>
          )}
          {product.isBestSeller && (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
              <Star className="w-2.5 h-2.5 fill-white text-white" />
              الأكثر طلباً
            </span>
          )}
          {hasDiscount && (
            <span className="inline-flex items-center bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs" dir="ltr">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleToggleFavorite}
          className={cn(
            "absolute top-2.5 sm:top-3 end-2.5 sm:end-3 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer",
            isFav
              ? "bg-white text-rose-500 scale-105 border border-rose-200 shadow-xs"
              : "bg-white/95 backdrop-blur-xs text-slate-400 hover:text-rose-500 hover:bg-white border border-slate-200/90"
          )}
          aria-label={isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
        >
          <Heart className={cn("w-4 h-4 transition-transform active:scale-125", isFav && "fill-rose-500 text-rose-500")} />
        </button>

        {/* Quick View Button (Reveals on Hover on Desktop, Always Visible on Mobile) */}
        <div className="absolute inset-x-3 bottom-3 z-20 hidden sm:flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickView}
            className="w-full flex items-center justify-center gap-1.5 h-9 rounded-xl bg-white/95 hover:bg-white text-slate-800 text-xs font-bold shadow-md hover:shadow-lg border border-slate-200 transition-all cursor-pointer backdrop-blur-xs hover:scale-[1.02]"
          >
            <Eye className="w-3.5 h-3.5 text-[#13213c]" />
            <span>معاينة سريعة</span>
          </button>
        </div>

        {/* Main & Secondary Image Transitions */}
        <Link href={`/product/${product.id}`} className="block w-full h-full relative cursor-pointer">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={cn(
              "object-cover transition-all duration-700",
              secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-108"
            )}
            onError={() => setImgError(true)}
          />
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-108"
            />
          )}
        </Link>
      </div>

      {/* Product Details Content */}
      <div className="p-3 sm:p-4.5 flex-1 flex flex-col text-start justify-between">
        <div>
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between gap-1 mb-1">
            {product.category?.name ? (
              <p className="text-[10px] sm:text-[11px] font-bold text-[#13213c] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#13213c]" />
                <span className="truncate">{product.category.name}</span>
              </p>
            ) : <span />}

            <div className="flex items-center gap-0.5 text-amber-500 text-[10px] sm:text-[11px] font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>4.9</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm md:text-base leading-snug line-clamp-2 mb-2 group-hover:text-[#13213c] transition-colors">
            <Link href={`/product/${product.id}`}>
              {product.name}
            </Link>
          </h3>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between gap-1 pt-2.5 sm:pt-3 border-t border-slate-100 mt-2">
          {/* Price Block */}
          <div className="flex flex-col text-start min-w-0">
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through font-medium" dir="ltr">
                {product.price.toLocaleString('en-US')} د.ع
              </span>
            )}
            <div className="flex items-baseline gap-0.5 sm:gap-1" dir="ltr">
              <span className="text-sm sm:text-base lg:text-lg font-black text-[#13213c]">
                {displayPrice.toLocaleString('en-US')}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400">د.ع</span>
            </div>
          </div>

          {/* Action Buttons: Quick View (mobile) & Add to Cart */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleQuickView}
              className="sm:hidden w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors"
              title="معاينة"
              aria-label="معاينة سريعة"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={cn(
                "h-8 sm:h-9 px-2 sm:px-3 rounded-xl sm:rounded-2xl flex items-center gap-1 sm:gap-1.5 text-xs font-bold transition-all duration-300 shrink-0 cursor-pointer",
                isAdding
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-[#13213c] text-slate-800 hover:text-white border border-slate-200 hover:border-[#13213c] hover:shadow-[0_4px_14px_rgba(19,33,60,0.22)]"
              )}
              aria-label="أضف للسلة"
            >
              {isAdding ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">أُضيفت</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">إضافة</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
