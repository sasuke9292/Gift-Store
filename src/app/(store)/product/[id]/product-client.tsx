'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, Minus, Plus, ShoppingCart, Heart, Share2, ShieldCheck, Truck, RotateCcw, ArrowLeft, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore, useFavoritesStore } from '@/lib/store'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function ProductClient({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(product.images?.[0] || '')
  const [addedToCart, setAddedToCart] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const { addFavorite, removeFavorite, hasFavorite } = useFavoritesStore()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => { setMounted(true) }, [])

  const isFavorite = mounted && hasFavorite(product.id)

  const handleAddToCart = () => {
    addItem({
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      price: product.salePrice ?? product.price,
      image: product.images?.[0] || '',
      quantity: quantity
    })
    toast.success('تمت إضافة المنتج إلى السلة 🎁', { id: `cart-${product.id}` })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const hasDiscount = product.salePrice && product.salePrice < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#A8A29E] py-6">
          <Link href="/" className="hover:text-[#C9A96E] transition-colors">الرئيسية</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#C9A96E] transition-colors">المتجر</Link>
          {product.category && (
            <>
              <span>/</span>
              <span className="text-[#78716C]">{typeof product.category === 'string' ? product.category : product.category?.name}</span>
            </>
          )}
          <span>/</span>
          <span className="text-[#1C1917] font-medium line-clamp-1 max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* ===== IMAGE GALLERY ===== */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#F8F4EF] border border-[#E8E4DF] group">
              {product.isBestSeller && (
                <div className="absolute top-4 start-4 z-10">
                  <span className="inline-flex items-center gap-1.5 bg-[#E85D75] text-white text-xs font-black px-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(232,93,117,0.3)]">
                    <Star className="w-3 h-3 fill-white" />
                    الأكثر مبيعاً
                  </span>
                </div>
              )}
              {hasDiscount && (
                <div className={cn("absolute z-10", product.isBestSeller ? "top-12 start-4" : "top-4 start-4")}>
                  <span className="bg-[#C9A96E] text-white text-xs font-black px-3 py-1.5 rounded-full">
                    -{discountPercent}%
                  </span>
                </div>
              )}
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#C9A96E]/30">
                  <ShoppingCart className="w-16 h-16" />
                </div>
              )}
            </div>

            {/* Thumbnail Grid */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={cn(
                      "relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200",
                      activeImage === img
                        ? "border-[#C9A96E] shadow-[0_0_0_2px_rgba(201,169,110,0.2)]"
                        : "border-[#E8E4DF] hover:border-[#C9A96E]/50 opacity-70 hover:opacity-100"
                    )}
                  >
                    <Image src={img} alt={`صورة ${i + 1}`} fill className="object-cover" sizes="100px" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ===== PRODUCT INFO ===== */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Category Badge */}
            {product.category && (
              <p className="text-sm font-bold text-[#C9A96E] uppercase tracking-widest mb-3">
                {typeof product.category === 'string' ? product.category : product.category?.name}
              </p>
            )}

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-black text-[#1C1917] leading-tight mb-4 tracking-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    className={cn("w-4 h-4", i <= 4 ? "fill-[#C9A96E] text-[#C9A96E]" : "fill-[#E8E4DF] text-[#E8E4DF]")}
                  />
                ))}
              </div>
              <span className="text-sm text-[#78716C] font-medium">(4.8) — 124 تقييم</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4 mb-6 pb-6 border-b border-[#E8E4DF]">
              <div>
                <span className="text-4xl font-black text-gold">
                  {(product.salePrice ?? product.price).toLocaleString('en-US')}
                  <span className="text-lg font-bold text-[#A8A29E] ms-1">د.ع</span>
                </span>
                {hasDiscount && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-base text-[#A8A29E] line-through">
                      {product.price.toLocaleString('en-US')} د.ع
                    </span>
                    <span className="text-sm font-black text-[#E85D75] bg-[#FDF2F4] px-2 py-0.5 rounded-lg">
                      وفّرت {(product.price - product.salePrice).toLocaleString('en-US')} د.ع
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-[#78716C] leading-relaxed text-base mb-6">
                {product.description}
              </p>
            )}

            {/* Quantity & Add to Cart */}
            <div className="bg-[#FAFAF8] rounded-2xl border border-[#E8E4DF] p-5 mb-5">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-bold text-[#78716C]">الكمية:</span>
                <div className="flex items-center border border-[#E8E4DF] rounded-xl overflow-hidden bg-white">
                  <button
                    className="w-10 h-10 flex items-center justify-center text-[#78716C] hover:bg-[#F5F0EA] transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center font-bold text-[#1C1917]">{quantity}</span>
                  <button
                    className="w-10 h-10 flex items-center justify-center text-[#78716C] hover:bg-[#F5F0EA] transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className={cn(
                    "flex-1 h-13 py-3 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all",
                    addedToCart
                      ? "bg-[#10B981]"
                      : "hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(184,137,58,0.35)]"
                  )}
                  style={!addedToCart ? { background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' } : {}}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      تمت الإضافة!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      أضف إلى السلة
                    </>
                  )}
                </button>

                {/* Favorite */}
                <button
                  className={cn(
                    "w-13 h-13 p-3 rounded-xl border transition-all flex items-center justify-center",
                    isFavorite
                      ? "bg-[#FDF2F4] border-[#E85D75]/30 text-[#E85D75]"
                      : "bg-white border-[#E8E4DF] text-[#A8A29E] hover:text-[#E85D75] hover:border-[#E85D75]/30 hover:bg-[#FDF2F4]"
                  )}
                  onClick={() => {
                    if (isFavorite) {
                      removeFavorite(product.id)
                      toast.info('تمت الإزالة من المفضلة')
                    } else {
                      addFavorite({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        salePrice: product.salePrice,
                        image: product.images?.[0],
                        category: typeof product.category === 'string' ? product.category : product.category?.name,
                        isNew: product.isNew,
                        isBestSeller: product.isBestSeller,
                      })
                      toast.success('تمت الإضافة للمفضلة ❤️')
                    }
                  }}
                >
                  <Heart className={cn("w-5 h-5 transition-all", isFavorite && "fill-[#E85D75]")} />
                </button>

                {/* Share */}
                <button
                  className="w-13 h-13 p-3 rounded-xl border border-[#E8E4DF] bg-white text-[#A8A29E] hover:text-[#78716C] hover:bg-[#F5F0EA] transition-all flex items-center justify-center"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: product.name, url: window.location.href }).catch(() => {})
                    } else {
                      navigator.clipboard.writeText(window.location.href)
                      toast.success('تم نسخ الرابط!')
                    }
                  }}
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Buy Now */}
            <Link
              href="/checkout"
              onClick={() => {
                addItem({
                  id: crypto.randomUUID(),
                  productId: product.id,
                  name: product.name,
                  price: product.salePrice ?? product.price,
                  image: product.images?.[0] || '',
                  quantity: quantity
                })
              }}
              className="flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-[#1C1917] border-2 border-[#1C1917] hover:bg-[#1C1917] hover:text-white transition-all duration-200 mb-6 text-sm"
            >
              اشترِ الآن — الدفع السريع
            </Link>

            {/* Trust Guarantees */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, label: 'جودة مضمونة', color: '#10B981', bg: '#F0FDF9' },
                { icon: Truck, label: 'شحن سريع', color: '#C9A96E', bg: '#FBF6EE' },
                { icon: RotateCcw, label: 'استرجاع مجاني', color: '#6366F1', bg: '#F5F3FF' },
              ].map(({ icon: Icon, label, color, bg }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#E8E4DF] bg-white text-center hover:border-[#C9A96E]/30 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <span className="text-xs font-bold text-[#78716C]">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ===== TABS SECTION ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start h-auto bg-transparent border-b border-[#E8E4DF] rounded-none p-0 mb-8 gap-8">
              <TabsTrigger
                value="details"
                className="text-base pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A96E] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#1C1917] text-[#A8A29E] font-bold px-0 transition-colors"
              >
                التفاصيل والمميزات
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="text-base pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#C9A96E] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#1C1917] text-[#A8A29E] font-bold px-0 transition-colors"
              >
                التقييمات
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="animate-in fade-in-50 duration-300">
              <div className="bg-white rounded-2xl border border-[#E8E4DF] p-8">
                <h3 className="text-xl font-black text-[#1C1917] mb-5">مميزات المنتج</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-[#78716C]">
                    <div className="w-5 h-5 rounded-full bg-[#FBF6EE] border border-[#C9A96E]/30 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#C9A96E]" />
                    </div>
                    المنتج أصلي ومضمون 100%
                  </li>
                  {product.category && (
                    <li className="flex items-center gap-3 text-[#78716C]">
                      <div className="w-5 h-5 rounded-full bg-[#FBF6EE] border border-[#C9A96E]/30 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-[#C9A96E]" />
                      </div>
                      التصنيف: <span className="font-bold text-[#1C1917] ms-1">
                        {typeof product.category === 'string' ? product.category : product.category?.name}
                      </span>
                    </li>
                  )}
                  <li className="flex items-center gap-3 text-[#78716C]">
                    <div className="w-5 h-5 rounded-full bg-[#FBF6EE] border border-[#C9A96E]/30 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#C9A96E]" />
                    </div>
                    تغليف هدايا فاخر متاح عند الطلب
                  </li>
                  <li className="flex items-center gap-3 text-[#78716C]">
                    <div className="w-5 h-5 rounded-full bg-[#FBF6EE] border border-[#C9A96E]/30 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#C9A96E]" />
                    </div>
                    ضمان الاسترجاع خلال 7 أيام
                  </li>
                </ul>

                {product.description && (
                  <div className="mt-6 pt-6 border-t border-[#E8E4DF]">
                    <h4 className="font-bold text-[#1C1917] mb-3">وصف المنتج</h4>
                    <p className="text-[#78716C] leading-relaxed">{product.description}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="animate-in fade-in-50 duration-300">
              <div className="bg-white rounded-2xl border border-[#E8E4DF] p-8">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#F5F0EA] flex items-center justify-center mb-4">
                    <Star className="w-8 h-8 text-[#C9A96E]/40" />
                  </div>
                  <h4 className="text-lg font-black text-[#1C1917] mb-2">لا توجد تقييمات بعد</h4>
                  <p className="text-[#A8A29E] max-w-sm mb-6">كن أول من يقيّم هذا المنتج وشارك رأيك مع الآخرين!</p>
                  <button
                    className="h-11 px-6 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
                    onClick={() => toast.info('ميزة التقييم قادمة قريباً!')}
                  >
                    إضافة تقييم
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

      </div>
    </div>
  )
}
