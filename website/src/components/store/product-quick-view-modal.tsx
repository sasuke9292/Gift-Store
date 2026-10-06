'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { 
  ShoppingBag, 
  Heart, 
  Star, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  Minus, 
  Plus, 
  X,
  Truck,
  Gift
} from 'lucide-react'
import { useCartStore, useFavoritesStore } from '@/lib/store'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useMounted } from '@/lib/use-mounted'

export interface QuickViewProduct {
  id: string
  name: string
  price: number
  salePrice?: number | null
  description?: string | null
  images?: string[]
  isNew?: boolean
  isBestSeller?: boolean
  category?: { name: string; slug?: string } | string | null
}

interface ProductQuickViewModalProps {
  product: QuickViewProduct | null
  isOpen: boolean
  onClose: () => void
}

function getProductFallbackImage(name: string): string {
  const text = name.toLowerCase()
  if (text.includes('عطر') || text.includes('مسك') || text.includes('عود')) {
    return 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800'
  }
  if (text.includes('ساعة') || text.includes('watch')) {
    return 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800'
  }
  if (text.includes('مجوهرات') || text.includes('قلادة') || text.includes('سوار')) {
    return 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'
  }
  return 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'
}

export function ProductQuickViewModal({ product, isOpen, onClose }: ProductQuickViewModalProps) {
  const router = useRouter()
  const mounted = useMounted()
  const addToCart = useCartStore(state => state.addItem)
  const { addFavorite, removeFavorite, hasFavorite } = useFavoritesStore()

  const [quantity, setQuantity] = useState(1)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isAdding, setIsAdding] = useState(false)

  if (!product) return null

  const categoryName = typeof product.category === 'string' 
    ? product.category 
    : product.category?.name || 'هدية فاخرة'

  const displayPrice = product.salePrice ?? product.price
  const hasDiscount = product.salePrice && product.salePrice < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0

  const isFav = mounted && hasFavorite(product.id)

  const productImages = product.images && product.images.length > 0
    ? product.images.filter(img => img && !img.includes('placeholder') && !img.includes('broken'))
    : [getProductFallbackImage(product.name)]

  const currentImage = productImages[activeImageIndex] || productImages[0]

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: displayPrice,
      quantity,
      image: currentImage,
      category: categoryName
    })
    toast.success(`تمت إضافة (${quantity}) إلى سلة المشتريات ✨`, {
      action: {
        label: 'عرض السلة 🛍️',
        onClick: () => {
          onClose()
          router.push('/cart')
        }
      }
    })
    setTimeout(() => {
      setIsAdding(false)
      onClose()
    }, 500)
  }

  const handleToggleFavorite = () => {
    if (isFav) {
      removeFavorite(product.id)
      toast.info('تمت الإزالة من المفضلة')
    } else {
      addFavorite({
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        image: currentImage,
        category: categoryName,
        isNew: product.isNew,
        isBestSeller: product.isBestSeller,
      })
      toast.success('أضيفت إلى المفضلة ❤️')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose() }}>
      <DialogContent 
        showCloseButton={false}
        className="max-w-3xl w-full p-0 overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-[0_24px_70px_rgba(15,23,42,0.18)] max-h-[92vh] flex flex-col font-sans"
        dir="rtl"
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 start-4 z-30 w-9 h-9 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors shadow-xs cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
          {/* Gallery Side */}
          <div className="p-6 bg-slate-50/70 border-b md:border-b-0 md:border-e border-slate-100 flex flex-col justify-between">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-xs mb-3">
              {/* Badges */}
              <div className="absolute top-3 end-3 z-10 flex flex-col gap-1.5">
                {product.isNew && (
                  <span className="inline-flex items-center gap-1 bg-[#13213c] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                    <Sparkles className="w-2.5 h-2.5" />
                    جديد
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                    <Star className="w-2.5 h-2.5 fill-white text-white" />
                    الأكثر طلباً
                  </span>
                )}
                {hasDiscount && (
                  <span className="inline-flex items-center bg-gradient-to-r from-rose-600 to-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs" dir="ltr">
                    -{discountPercent}%
                  </span>
                )}
              </div>

              <Image
                src={currentImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnail selector */}
            {productImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={cn(
                      "relative w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer",
                      activeImageIndex === idx
                        ? "border-[#13213c] shadow-xs"
                        : "border-slate-200 opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image src={img} alt={`صورة ${idx + 1}`} fill className="object-cover" sizes="56px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Side */}
          <div className="p-6 sm:p-7 flex flex-col justify-between text-start">
            <div>
              {/* Category */}
              <p className="text-xs font-bold text-[#13213c] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#13213c]" />
                <span>{categoryName}</span>
              </p>

              {/* Product Title */}
              <DialogTitle className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-3">
                {product.name}
              </DialogTitle>

              {/* Price Row */}
              <div className="flex items-baseline gap-2 mb-4 pb-4 border-b border-slate-100">
                <span className="text-2xl sm:text-3xl font-black text-[#13213c]" dir="ltr">
                  {displayPrice.toLocaleString('en-US')}
                  <span className="text-sm font-bold text-slate-400 ms-1">د.ع</span>
                </span>
                {hasDiscount && (
                  <span className="text-sm text-slate-400 line-through font-medium" dir="ltr">
                    {product.price.toLocaleString('en-US')} د.ع
                  </span>
                )}
              </div>

              {/* Description */}
              <DialogDescription className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                {product.description || 'هدية استثنائية منتقاة بعناية لتقديم أرقى معاني التقدير مع تغليف يدوي ملكي مجاني وكارت إهداء.'}
              </DialogDescription>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 mb-6 text-[11px] text-slate-600 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-[#13213c]" />
                  <span>تغليف ملكي مجاني</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#13213c]" />
                  <span>توصيل لكافة المحافظات</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-200 rounded-2xl p-1 bg-white shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                    aria-label="تقليل"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-black text-slate-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(99, quantity + 1))}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                    aria-label="زيادة"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 h-11 px-5 rounded-2xl text-xs sm:text-sm font-black text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(19,33,60,0.3)] cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
                >
                  {isAdding ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>أُضيفت بنجاح!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>إضافة إلى السلة</span>
                    </>
                  )}
                </button>

                {/* Favorite */}
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className={cn(
                    "w-11 h-11 rounded-2xl border flex items-center justify-center transition-all cursor-pointer",
                    isFav
                      ? "bg-rose-50 border-rose-200 text-rose-600"
                      : "border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600"
                  )}
                  aria-label="المفضلة"
                >
                  <Heart className={cn("w-4 h-4", isFav && "fill-rose-600")} />
                </button>
              </div>

              {/* View Full Product Link */}
              <div className="text-center pt-1">
                <Link
                  href={`/product/${product.id}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#13213c] hover:underline"
                >
                  <span>عرض الصفحة الكاملة للمنتج وخيارات الإهداء</span>
                  <ArrowLeft className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
