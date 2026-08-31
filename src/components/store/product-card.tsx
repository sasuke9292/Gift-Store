'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/lib/store'
import { toast } from 'sonner'

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
    <Card className="group border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden rounded-2xl h-full flex flex-col relative text-right">
      <Link href={`/product/${product.id}`} className="absolute inset-0 z-10" aria-label={`عرض تفاصيل ${product.name}`} />
      
      {/* Quick Actions (Hover) */}
      <div className="absolute top-3 left-3 z-20 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
        <Button 
          size="icon" 
          variant="secondary" 
          className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-sm hover:bg-rose-500 hover:text-white transition-colors"
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
      <div className="relative aspect-square w-full bg-white pt-1.5 px-3 pb-0">
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-50 group-hover:shadow-md transition-shadow duration-300">
          
          {/* Hover Dark Overlay */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors z-10 pointer-events-none" />
          
          {/* Image */}
          <div className="w-full h-full relative group-hover:scale-110 transition-transform duration-700">
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
        </div>
      </div>
      
      <CardContent className="p-5 flex-1 flex flex-col z-20 bg-white">
        <div className="mb-3">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {product.isNew && (
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 shadow-none border-none px-2 py-0 rounded-md text-[10px] font-bold tracking-wider">جديد</Badge>
            )}
            {product.isBestSeller && (
              <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 shadow-none border-none px-2 py-0 rounded-md text-[10px] font-bold">الأكثر مبيعاً</Badge>
            )}
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-auto">{product.category?.name || 'عام'}</p>
          </div>
          <h3 className="font-bold text-slate-800 text-base line-clamp-2 leading-snug group-hover:text-primary transition-colors">{product.name}</h3>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900">{(product.salePrice ?? product.price).toLocaleString('en-US')} د.ع</span>
            {product.salePrice && product.salePrice < product.price && (
              <span className="text-xs font-medium text-slate-400 line-through">{product.price.toLocaleString('en-US')} د.ع</span>
            )}
          </div>
          
          <Button 
            size="icon" 
            className="w-10 h-10 rounded-full bg-slate-900 text-white hover:bg-primary hover:scale-105 hover:shadow-md transition-all duration-300 shrink-0"
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
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
