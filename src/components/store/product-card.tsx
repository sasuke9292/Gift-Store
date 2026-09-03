'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore, useFavoritesStore } from '@/lib/store'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])


  return (
    <Card className="group glass-card hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 overflow-hidden rounded-[2rem] h-full flex flex-col relative text-start perspective-[1000px] hover:shadow-[0_20px_50px_rgba(251,191,36,0.15)]">
      
      {/* Quick Actions (Hover) */}
      <div className="absolute top-4 end-4 z-20 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 ease-out">
        <Button 
          size="icon" 
          variant="secondary" 
          className="w-10 h-10 rounded-full glass-button hover:bg-rose-500/90 border-white/20 text-white transition-colors"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (hasFavorite(product.id)) {
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
        >
          <Heart 
            className={cn(
              "w-5 h-5 pointer-events-none transition-colors duration-300 drop-shadow-md",
              hasFavorite(product.id) ? "fill-rose-500 text-rose-500" : "text-white/80 group-hover:text-white"
            )} 
          />
        </Button>
      </div>

      {/* Image Section */}
      <div className="relative aspect-square w-full bg-transparent p-3" style={{ transformStyle: 'preserve-3d' }}>
        <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden bg-[#0A1128]/50 shadow-inner">
          
          {/* Hover Dark/Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B14]/80 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-500 z-10 pointer-events-none" />
          
          {/* Image */}
          <div className="w-full h-full relative group-hover:scale-[1.15] group-hover:rotate-2 transition-transform duration-700 ease-[0.16,1,0.3,1] transform-gpu">
            {product.images && product.images[0] ? (
              <Image 
                src={product.images[0]} 
                alt={product.name} 
                fill 
                sizes="(max-width: 768px) 100vw, 300px" 
                className="object-cover drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20">
                <span className="font-semibold tracking-wider">صورة المنتج</span>
              </div>
            )}
          </div>

          {/* Badges Floating on Image */}
          <div className="absolute top-3 start-3 z-20 flex flex-col gap-2 transform translate-z-[20px]">
            {product.isNew && (
              <Badge className="bg-amber-400/90 backdrop-blur-md text-[#050B14] hover:bg-amber-400 shadow-[0_5px_15px_rgba(251,191,36,0.3)] border-none px-3 py-1 rounded-full text-[11px] font-black tracking-wider">
                جديد
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge className="bg-rose-500/90 backdrop-blur-md text-white hover:bg-rose-500 shadow-[0_5px_15px_rgba(244,63,94,0.3)] border-none px-3 py-1 rounded-full text-[11px] font-bold">
                الأكثر مبيعاً
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 flex-1 flex flex-col bg-transparent relative z-20">
        <div className="mb-4">
          <p className="text-[12px] font-bold text-amber-300/70 uppercase tracking-widest mb-2">{product.category?.name || 'مجموعة عامة'}</p>
          <h3 className="font-bold text-white text-lg line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors drop-shadow-md">
            <Link href={`/product/${product.id}`} className="before:absolute before:inset-0 before:z-10" aria-label={`عرض تفاصيل ${product.name}`}>
              {product.name}
            </Link>
          </h3>
        </div>
        
        <div className="mt-auto pt-5 border-t border-white/10 flex items-end justify-between gap-2">
          <div className="flex flex-col">
            {product.salePrice && product.salePrice < product.price && (
              <span className="text-sm font-medium text-white/40 line-through mb-0.5">{product.price.toLocaleString('en-US')} د.ع</span>
            )}
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-100 to-yellow-500 drop-shadow-lg">
              {(product.salePrice ?? product.price).toLocaleString('en-US')} <span className="text-sm font-bold text-amber-500/80">د.ع</span>
            </span>
          </div>
          
          <Button 
            size="icon" 
            className="w-12 h-12 rounded-2xl glass-button text-white hover:scale-110 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(251,191,36,0.3)] transition-all duration-300 shrink-0 group/btn relative overflow-hidden z-20 border-white/20 bg-gradient-to-tr from-white/5 to-white/10"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              addToCart({
                id: `${product.id}-${Date.now()}`,
                productId: product.id,
                name: product.name,
                price: product.salePrice ?? product.price,
                quantity: 1,
                image: product.images?.[0],
                category: product.category?.name,
              })
              toast.success('تمت إضافة المنتج للسلة', { id: `cart-${product.id}` })
            }}
          >
            <ShoppingBag className="w-5 h-5 relative z-10 pointer-events-none drop-shadow-md text-amber-200" />
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-yellow-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <ShoppingBag className="w-5 h-5 absolute inset-0 m-auto text-[#050B14] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 z-20 pointer-events-none drop-shadow-md" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
