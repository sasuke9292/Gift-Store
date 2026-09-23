'use client'

import React from 'react'
import { useFavoritesStore } from '@/lib/store'
import { ProductCard } from '@/components/store/product-card'
import { motion } from 'framer-motion'
import { Heart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useMounted } from '@/lib/use-mounted'

export function FavoritesClient() {
  const favorites = useFavoritesStore(state => state.items)
  const mounted = useMounted()

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#E85D75]" />
            </div>
            <h1 className="text-3xl font-black text-[#1C1917]">قائمة المفضلة</h1>
            {favorites.length > 0 && (
              <span className="bg-[#E85D75] text-white text-xs font-black px-2.5 py-1 rounded-full">
                {favorites.length}
              </span>
            )}
          </div>
          {favorites.length > 0 && (
            <p className="text-[#78716C] ms-14">
              لديك <span className="font-bold text-[#E85D75]">{favorites.length}</span> {favorites.length === 1 ? 'هدية مفضلة' : 'هدايا مفضلة'}
            </p>
          )}
        </div>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-24 h-24 rounded-full bg-[#FDF2F4] flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-[#E85D75]/40" />
            </div>
            <h2 className="text-2xl font-black text-[#1C1917] mb-3">لا توجد مفضلات بعد</h2>
            <p className="text-[#78716C] mb-8 max-w-sm mx-auto">
              استكشف مجموعاتنا الرائعة وأضف الهدايا التي تعجبك إلى قائمتك المفضلة!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
            >
              استكشف المنتجات
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {favorites.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.06, 0.4), duration: 0.4 }}
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
        )}
      </div>
    </div>
  )
}
