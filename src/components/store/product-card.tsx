'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Star, Sparkles, Check } from 'lucide-react'
import { useCartStore, useFavoritesStore } from '@/lib/store'
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

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore(state => state.addItem)
  const { addFavorite, removeFavorite, hasFavorite } = useFavoritesStore()
  const mounted = useMounted()
  const [imgError, setImgError] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const isFav = mounted && hasFavorite(product.id)
  const displayPrice = product.salePrice ?? product.price
  const hasDiscount = product.salePrice && product.salePrice < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0

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
      image: product.images?.[0],
      category: product.category?.name,
    })
    toast.success('تمت إضافة الهدية إلى سلتك بنجاح ✨', { id: `cart-${product.id}` })
    setTimeout(() => setIsAdding(false), 800)
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
        image: product.images?.[0],
        category: product.category?.name,
        isNew: product.isNew,
        isBestSeller: product.isBestSeller,
      })
      toast.success('أضيفت إلى هداياك المفضلة ❤️', { id: `fav-add-${product.id}` })
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "group relative bg-white rounded-3xl overflow-hidden flex flex-col h-full",
        "border border-[#E8E4DF] transition-all duration-300",
        "hover:shadow-[0_12px_35px_rgba(201,169,110,0.14)] hover:-translate-y-1.5 hover:border-[#C9A96E]/40"
      )}
      dir="rtl"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-[#FAF7F2]">
        
        {/* Floating Badges (Top Start / Right) */}
        <div className="absolute top-3 start-3 z-20 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="inline-flex items-center gap-1 bg-[#C9A96E] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              جديد
            </span>
          )}
          {product.isBestSeller && (
            <span className="inline-flex items-center gap-1 bg-[#1C1917] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
              <Star className="w-2.5 h-2.5 fill-[#C9A96E] text-[#C9A96E]" />
              الأكثر طلباً
            </span>
          )}
          {hasDiscount && (
            <span className="inline-flex items-center bg-[#E85D75] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs" dir="ltr">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Favorite Heart Button (Top End / Left) */}
        <button
          onClick={handleToggleFavorite}
          className={cn(
            "absolute top-3 end-3 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-xs",
            isFav
              ? "bg-white text-[#E85D75] scale-105 border border-[#E85D75]/20"
              : "bg-white/90 backdrop-blur-xs text-[#A8A29E] hover:text-[#E85D75] hover:bg-white border border-[#E8E4DF]/80"
          )}
          aria-label={isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
        >
          <Heart className={cn("w-4 h-4 transition-transform active:scale-125", isFav && "fill-[#E85D75] text-[#E85D75]")} />
        </button>

        {/* Image / Fallback */}
        <Link href={`/product/${product.id}`} className="block w-full h-full relative cursor-pointer">
          {product.images && product.images[0] && !imgError ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-108"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#C9A96E]/40 bg-gradient-to-br from-[#FBF6EE] to-[#F5EDD8]">
              <ShoppingBag className="w-10 h-10 mb-1" />
              <span className="text-[11px] font-bold text-[#A07850]">گِفتي بلس</span>
            </div>
          )}
          {/* Subtle Bottom Image Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>

      {/* Product Details Content */}
      <div className="p-3 sm:p-4.5 flex-1 flex flex-col text-start">
        {/* Category Pill */}
        {product.category?.name && (
          <p className="text-[10px] sm:text-[11px] font-bold text-[#A07850] mb-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
            <span className="truncate">{product.category.name}</span>
          </p>
        )}

        {/* Title */}
        <h3 className="font-bold text-[#1C1917] text-xs sm:text-sm md:text-base leading-snug line-clamp-2 mb-2 sm:mb-3 flex-1 group-hover:text-[#A07850] transition-colors">
          <Link href={`/product/${product.id}`}>
            {product.name}
          </Link>
        </h3>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between gap-1 mt-auto pt-2.5 sm:pt-3 border-t border-[#F0ECE6]">
          {/* Price Block */}
          <div className="flex flex-col text-start min-w-0">
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-[#A8A29E] line-through font-medium" dir="ltr">
                {product.price.toLocaleString('en-US')} د.ع
              </span>
            )}
            <div className="flex items-baseline gap-0.5 sm:gap-1" dir="ltr">
              <span className="text-sm sm:text-base lg:text-lg font-black text-[#8C6838]">
                {displayPrice.toLocaleString('en-US')}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[#A8A29E]">د.ع</span>
            </div>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={cn(
              "h-8 sm:h-9 px-2 sm:px-3.5 rounded-xl sm:rounded-2xl flex items-center gap-1 sm:gap-1.5 text-xs font-bold transition-all duration-300 shrink-0 cursor-pointer",
              isAdding
                ? "bg-emerald-600 text-white"
                : "bg-[#F8F5F0] hover:bg-[#C9A96E] text-[#1C1917] hover:text-white border border-[#E8E4DF] hover:border-[#C9A96E] hover:shadow-[0_4px_12px_rgba(201,169,110,0.35)]"
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
    </motion.div>
  )
}
