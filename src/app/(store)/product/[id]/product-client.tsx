'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, Minus, Plus, ShoppingCart, Heart, Share2, ShieldCheck, Truck, RotateCcw, ArrowLeft, Check, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore, useFavoritesStore } from '@/lib/store'
import { toast } from 'sonner'
import { useMounted } from '@/lib/use-mounted'
import { cn } from '@/lib/utils'

function getProductFallback(name: string, categoryName?: string): string {
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
  return 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'
}

export default function ProductClient({ product }: { product: any }) {
  const router = useRouter()
  const fallbackImg = getProductFallback(product.name, typeof product.category === 'string' ? product.category : product.category?.name)
  const initialImg = (product.images?.[0] && !product.images[0].includes('placeholder') && !product.images[0].includes('broken')) ? product.images[0] : fallbackImg
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(initialImg)
  const [addedToCart, setAddedToCart] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const { addFavorite, removeFavorite, hasFavorite } = useFavoritesStore()
  const mounted = useMounted()

  const isFavorite = mounted && hasFavorite(product.id)

  const handleAddToCart = () => {
    addItem({
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      price: product.salePrice ?? product.price,
      image: activeImage || fallbackImg,
      quantity: quantity
    })
    toast.success('تمت إضافة المنتج إلى السلة 🎁', {
      id: `cart-${product.id}`,
      action: {
        label: 'عرض السلة 🛍️',
        onClick: () => router.push('/cart')
      }
    })
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
          <Link href="/" className="hover:text-[#13213c] transition-colors">الرئيسية</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#13213c] transition-colors">المتجر</Link>
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
                  <span className="bg-[#13213c] text-white text-xs font-black px-3 py-1.5 rounded-full">
                    -{discountPercent}%
                  </span>
                </div>
              )}
              <Image
                src={activeImage || fallbackImg}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                onError={() => setActiveImage(fallbackImg)}
              />
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
                        ? "border-[#13213c] shadow-[0_0_0_2px_rgba(19, 33, 60,0.2)]"
                        : "border-[#E8E4DF] hover:border-[#13213c]/50 opacity-70 hover:opacity-100"
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
              <p className="text-sm font-bold text-[#13213c] uppercase tracking-widest mb-3">
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
                    className={cn("w-4 h-4", i <= 4 ? "fill-[#13213c] text-[#13213c]" : "fill-[#E8E4DF] text-[#E8E4DF]")}
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
                      : "hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(19, 33, 60,0.35)]"
                  )}
                  style={!addedToCart ? { background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' } : {}}
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
                    "w-13 h-13 p-3 rounded-xl border transition-all flex items-center justify-center shrink-0 cursor-pointer",
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
                        image: activeImage || fallbackImg,
                        category: typeof product.category === 'string' ? product.category : product.category?.name,
                        isNew: product.isNew,
                        isBestSeller: product.isBestSeller,
                      })
                      toast.success('تمت الإضافة للمفضلة ❤️')
                    }
                  }}
                  aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                >
                  <Heart className={cn("w-5 h-5", isFavorite && "fill-[#E85D75] text-[#E85D75]")} />
                </button>
              </div>

              {/* Instant WhatsApp Direct Order Button (Frictionless Buying) */}
              <a
                href={`https://wa.me/9647700000000?text=${encodeURIComponent(`مرحباً گِفتي بلس 👋\nأود تأكيد طلب هذا المنتج عبر واتساب:\n🎁 ${product.name}\nالكمية: ${quantity}\nالسعر: ${(product.salePrice ?? product.price).toLocaleString('en-US')} د.ع`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-3 h-12 rounded-xl text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:brightness-105 hover:-translate-y-0.5 transition-all cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>طلب سريع ومباشر عبر واتساب</span>
              </a>

              <div className="flex gap-3 mt-3">
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

            {/* Buy Now via Cart & WhatsApp */}
            <button
              type="button"
              onClick={() => {
                addItem({
                  id: product.id,
                  productId: product.id,
                  name: product.name,
                  price: product.salePrice ?? product.price,
                  image: product.images?.[0] || '',
                  quantity: quantity
                })
                router.push('/cart')
              }}
              className="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-bold text-white transition-all duration-200 mb-6 text-sm cursor-pointer shadow-md hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
            >
              <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043s.433-.506.549-.68c.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.394-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.881l-1.344 4.912 5.044-1.323c1.402.766 3.003 1.2 4.707 1.2 5.522 0 10-4.477 10-10s-4.478-10-9.671-10z" />
              </svg>
              <span>طلب مباشر عبر WhatsApp</span>
            </button>

            {/* Trust Guarantees */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, label: 'جودة مضمونة', color: '#10B981', bg: '#F0FDF9' },
                { icon: Truck, label: 'شحن سريع', color: '#13213c', bg: '#F0F4F9' },
                { icon: RotateCcw, label: 'استرجاع مجاني', color: '#6366F1', bg: '#F5F3FF' },
              ].map(({ icon: Icon, label, color, bg }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#E8E4DF] bg-white text-center hover:border-[#13213c]/30 transition-colors"
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
                className="text-base pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#13213c] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#1C1917] text-[#A8A29E] font-bold px-0 transition-colors"
              >
                التفاصيل والمميزات
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="text-base pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#13213c] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#1C1917] text-[#A8A29E] font-bold px-0 transition-colors"
              >
                التقييمات
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="animate-in fade-in-50 duration-300">
              <div className="bg-white rounded-2xl border border-[#E8E4DF] p-8">
                <h3 className="text-xl font-black text-[#1C1917] mb-5">مميزات المنتج</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-[#78716C]">
                    <div className="w-5 h-5 rounded-full bg-[#F0F4F9] border border-[#13213c]/30 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#13213c]" />
                    </div>
                    المنتج أصلي ومضمون 100%
                  </li>
                  {product.category && (
                    <li className="flex items-center gap-3 text-[#78716C]">
                      <div className="w-5 h-5 rounded-full bg-[#F0F4F9] border border-[#13213c]/30 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-[#13213c]" />
                      </div>
                      التصنيف: <span className="font-bold text-[#1C1917] ms-1">
                        {typeof product.category === 'string' ? product.category : product.category?.name}
                      </span>
                    </li>
                  )}
                  <li className="flex items-center gap-3 text-[#78716C]">
                    <div className="w-5 h-5 rounded-full bg-[#F0F4F9] border border-[#13213c]/30 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#13213c]" />
                    </div>
                    تغليف هدايا فاخر متاح عند الطلب
                  </li>
                  <li className="flex items-center gap-3 text-[#78716C]">
                    <div className="w-5 h-5 rounded-full bg-[#F0F4F9] border border-[#13213c]/30 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#13213c]" />
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
                    <Star className="w-8 h-8 text-[#13213c]/40" />
                  </div>
                  <h4 className="text-lg font-black text-[#1C1917] mb-2">لا توجد تقييمات بعد</h4>
                  <p className="text-[#A8A29E] max-w-sm mb-6">كن أول من يقيّم هذا المنتج وشارك رأيك مع الآخرين!</p>
                  <button
                    className="h-11 px-6 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
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
