'use client'

import React from 'react'
import { useFavoritesStore } from '@/lib/store'
import { ProductCard } from '@/components/store/product-card'
import { motion } from 'framer-motion'
import { HeartCrack, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export function FavoritesClient() {
  const favorites = useFavoritesStore(state => state.items)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (favorites.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500 relative z-10">
        <div className="w-24 h-24 glass-card rounded-full flex items-center justify-center mb-6 shadow-[0_10px_30px_rgba(244,63,94,0.2)] border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-transparent" />
          <HeartCrack className="w-10 h-10 text-rose-400 drop-shadow-md group-hover:scale-110 transition-transform" />
        </div>
        <h2 className="text-3xl font-black text-white mb-3 drop-shadow-md">لا توجد منتجات مفضلة</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
          لم تقم بإضافة أي هدايا إلى قائمتك المفضلة بعد. استكشف مجموعاتنا الرائعة واحتفظ بما يعجبك هنا!
        </p>
        <Link href="/" className="inline-flex items-center justify-center h-14 px-8 text-lg rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-[#050B14] font-black transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(251,191,36,0.3)] hover:shadow-[0_15px_40px_rgba(251,191,36,0.5)]">
          استكشف المنتجات
          <ArrowRight className="w-5 h-5 me-2 ms-2" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 drop-shadow-md">قائمتي المفضلة</h1>
          <p className="text-xl text-slate-400">تحتفظ بـ <span className="text-amber-400 font-bold mx-1">{favorites.length}</span> {favorites.length === 1 ? 'هدية' : 'هدايا'} مميزة هنا.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 perspective-[1000px]">
        {favorites.map((product, index) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full"
          >
            <ProductCard 
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                salePrice: product.salePrice,
                images: product.image ? [product.image] : undefined,
                category: product.category ? { name: product.category } : undefined,
                isNew: product.isNew,
                isBestSeller: product.isBestSeller,
              }} 
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
