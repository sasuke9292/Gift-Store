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
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <HeartCrack className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-3">لا توجد منتجات مفضلة</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
          لم تقم بإضافة أي هدايا إلى قائمتك المفضلة بعد. استكشف مجموعاتنا الرائعة واحتفظ بما يعجبك هنا!
        </p>
        <Link href="/" className={buttonVariants({ size: "lg", className: "rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all" })}>
          استكشف المنتجات
          <ArrowRight className="w-5 h-5 ml-2 mr-2" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">قائمتي المفضلة</h1>
          <p className="text-slate-500">تحتفظ بـ {favorites.length} {favorites.length === 1 ? 'هدية' : 'هدايا'} مميزة هنا.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {favorites.map((product, index) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
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
