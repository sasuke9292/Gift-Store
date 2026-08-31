'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/lib/store'
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

  return (
    <Card className="group border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-500 bg-white overflow-hidden rounded-[2rem] h-full flex flex-col relative text-right">
      <Link href={`/product/${product.id}`} className="absolute inset-0 z-10" aria-label={`عرض تفاصيل ${product.name}`} />
      
      {/* Quick Actions (Hover) */}
      <div className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 ease-out">
        <Button 
          size="icon" 
          variant="secondary" 
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xl shadow-lg hover:bg-rose-500 hover:text-white transition-colors"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toast.success('تمت الإضافة للمفضلة')
          }}
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>

      {/* Image Section */}
      <div className="relative aspect-square w-full bg-[#FAFAFA] p-3">
        <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden bg-slate-100">
          
          {/* Hover Dark/Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
          
          {/* Image */}
          <div className="w-full h-full relative group-hover:scale-110 transition-transform duration-700 ease-out">
            {product.images && product.images[0] ? (
              <Image 
                src={product.images[0]} 
                alt={product.name} 
                fill 
                sizes="(max-width: 768px) 100vw, 300px" 
                className="object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <span>صورة المنتج</span>
              </div>
            )}
          </div>

          {/* Badges Floating on Image */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-white/90 backdrop-blur-md text-slate-900 hover:bg-white shadow-sm border-none px-3 py-1 rounded-full text-[11px] font-bold tracking-wider">
                جديد
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge className="bg-rose-500/90 backdrop-blur-md text-white hover:bg-rose-500 shadow-sm border-none px-3 py-1 rounded-full text-[11px] font-bold">
                الأكثر مبيعاً
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 flex-1 flex flex-col z-20 bg-white relative">
        <div className="mb-4">
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">{product.category?.name || 'مجموعة عامة'}</p>
          <h3 className="font-bold text-slate-900 text-lg line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors">{product.name}</h3>
        </div>
        
        <div className="mt-auto pt-5 border-t border-slate-100 flex items-end justify-between gap-2">
          <div className="flex flex-col">
            {product.salePrice && product.salePrice < product.price && (
              <span className="text-sm font-medium text-slate-400 line-through mb-0.5">{product.price.toLocaleString('en-US')} د.ع</span>
            )}
            <span className="text-xl font-black text-slate-900 bg-clip-text">
              {(product.salePrice ?? product.price).toLocaleString('en-US')} <span className="text-sm font-bold text-slate-500">د.ع</span>
            </span>
          </div>
          
          <Button 
            size="icon" 
            className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white hover:scale-105 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shrink-0 group/btn relative overflow-hidden z-20"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              addToCart({
                id: crypto.randomUUID(),
                productId: product.id,
                name: product.name,
                price: product.salePrice ?? product.price,
                quantity: 1,
                image: product.images?.[0],
                category: product.category?.name,
              })
              toast.success('تمت إضافة المنتج للسلة')
            }}
          >
            <ShoppingBag className="w-5 h-5 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-400 to-indigo-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            <ShoppingBag className="w-5 h-5 absolute inset-0 m-auto text-white opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 z-20" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
