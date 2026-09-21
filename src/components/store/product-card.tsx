'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { useCartStore, useFavoritesStore } from '@/lib/store'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useMounted } from '@/lib/use-mounted'

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
  const [imgError, setImgError] = React.useState(false)

  const isFav = mounted && hasFavorite(product.id)
  const displayPrice = product.salePrice ?? product.price
  const hasDiscount = product.salePrice && product.salePrice < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0

  return (
    <div className={cn(
      "group relative bg-white rounded-2xl overflow-hidden flex flex-col h-full",
      "border border-[#E8E4DF] transition-all duration-300",
      "hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:border-[#C9A96E]/30"
    )}>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#F8F4EF]">

        {/* Badges */}
        <div className="absolute top-3 start-3 z-20 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="badge-new">جديد</span>
          )}
          {product.isBestSeller && (
            <span className="inline-flex items-center gap-1 bg-[#E85D75] text-white text-[11px] font-black px-2.5 py-1 rounded-full">
              <Star className="w-2.5 h-2.5 fill-white" />
              الأكثر مبيعاً
            </span>
          )}
          {hasDiscount && (
            <span className="badge-sale">-{discountPercent}%</span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          className={cn(
            "absolute top-3 end-3 z-20 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200",
            "opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0",
            isFav
              ? "bg-[#FDF2F4] border border-[#E85D75]/30 text-[#E85D75]"
              : "bg-white border border-[#E8E4DF] text-[#A8A29E] hover:text-[#E85D75] hover:border-[#E85D75]/30 hover:bg-[#FDF2F4]"
          )}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (isFav) {
              removeFavorite(product.id)
              toast.info('تمت الإزالة من المفضلة', { id: `fav-rem-${product.id}` })
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
              toast.success('تمت الإضافة للمفضلة', { id: `fav-add-${product.id}` })
            }
          }}
          aria-label={isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
        >
          <Heart className={cn("w-4 h-4 transition-all", isFav && "fill-[#E85D75] text-[#E85D75]")} />
        </button>

        {/* Product Image */}
        <div className="w-full h-full overflow-hidden">
          {product.images && product.images[0] && !imgError ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#C9A96E]/40">
              <ShoppingBag className="w-10 h-10 mb-2" />
              <span className="text-xs text-[#A8A29E]">صورة المنتج</span>
            </div>
          )}
        </div>

        {/* Hover Overlay with Quick Add */}
        <div className={cn(
          "absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300",
        )}>
          <button
            className={cn(
              "w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all",
              "text-white shadow-lg"
            )}
            style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              addToCart({
                id: `${product.id}-${Date.now()}`,
                productId: product.id,
                name: product.name,
                price: displayPrice,
                quantity: 1,
                image: product.images?.[0],
                category: product.category?.name,
              })
              toast.success('تمت إضافة المنتج للسلة', { id: `cart-${product.id}` })
            }}
          >
            <ShoppingBag className="w-4 h-4" />
            أضف للسلة
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category */}
        {product.category?.name && (
          <p className="text-[11px] font-bold text-[#C9A96E] uppercase tracking-widest mb-1.5">
            {product.category.name}
          </p>
        )}

        {/* Product Name — fills space */}
        <h3 className="font-bold text-[#1C1917] text-sm leading-snug line-clamp-2 flex-1 mb-3 group-hover:text-[#A07850] transition-colors">
          <Link
            href={`/product/${product.id}`}
            className="before:absolute before:inset-0 before:z-10"
            aria-label={`عرض تفاصيل ${product.name}`}
          >
            {product.name}
          </Link>
        </h3>

        {/* Price Row */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#F5F0EA]">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-[#A8A29E] line-through leading-tight">
                {product.price.toLocaleString('en-US')} د.ع
              </span>
            )}
            <span className="text-lg font-black text-gold">
              {displayPrice.toLocaleString('en-US')}
              <span className="text-sm font-bold text-[#A8A29E] ms-1">د.ع</span>
            </span>
          </div>

          {/* Add to Cart Icon Button */}
          <button
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 z-20 relative",
              "bg-[#F5F0EA] text-[#C9A96E] border border-[#E8E4DF]",
              "hover:text-white hover:border-transparent hover:shadow-[0_4px_12px_rgba(184,137,58,0.3)]"
            )}
            style={{ 
              '--hover-bg': 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' 
            } as React.CSSProperties}
            onMouseEnter={e => (e.currentTarget.style.background = 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)')}
            onMouseLeave={e => (e.currentTarget.style.background = '')}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              addToCart({
                id: `${product.id}-${Date.now()}`,
                productId: product.id,
                name: product.name,
                price: displayPrice,
                quantity: 1,
                image: product.images?.[0],
                category: product.category?.name,
              })
              toast.success('تمت إضافة المنتج للسلة', { id: `cart-${product.id}` })
            }}
            aria-label="أضف للسلة"
          >
            <ShoppingBag className="w-4 h-4 pointer-events-none" />
          </button>
        </div>
      </div>
    </div>
  )
}
