'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  Truck, 
  Sparkles,
  Gift,
  MessageCircle
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store'
import { useMounted } from '@/lib/use-mounted'
import { WhatsAppOrderModal } from './whatsapp-order-modal'

function getCartFallbackImage(name: string, category?: string): string {
  const text = `${name} ${category || ''}`.toLowerCase()
  if (text.includes('عطر') || text.includes('مسك') || text.includes('عود')) {
    return 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=400'
  }
  if (text.includes('ساعة') || text.includes('watch')) {
    return 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=400'
  }
  if (text.includes('مجوهرات') || text.includes('قلادة') || text.includes('ذهب') || text.includes('فضة')) {
    return 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400'
  }
  return 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400'
}

export function CartDrawer() {
  const router = useRouter()
  const mounted = useMounted()
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem } = useCartStore()
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false)

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isDrawerOpen])

  if (!mounted) return null

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const FREE_SHIPPING_THRESHOLD = 100000
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal
  const progressPercent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)

  return (
    <>
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden" dir="rtl">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeDrawer}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            />

            {/* Slide-out Drawer Panel */}
            <div className="fixed inset-y-0 start-0 max-w-full flex pl-0 pr-0">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-e border-slate-200"
              >
                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#F0F4F9] flex items-center justify-center text-[#13213c]">
                      <ShoppingBag className="w-5 h-5 text-[#13213c]" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                        سلة الهدايا
                      </h2>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {totalCount > 0 ? `${totalCount} ${totalCount === 1 ? 'منتج مختار' : 'منتجات مختارة'}` : 'السلة فارغة'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={closeDrawer}
                    className="w-9 h-9 rounded-xl border border-slate-200/80 hover:bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="إغلاق السلة"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Free Shipping Meter */}
                {items.length > 0 && (
                  <div className="p-3.5 sm:p-4 bg-[#F8FAFC] border-b border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                      <Truck className="w-4 h-4 text-[#13213c] shrink-0" />
                      {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                        <span className="text-emerald-700 font-black">
                          🎉 مبروك! حصلت على توصيل مجاني لكافة المحافظات!
                        </span>
                      ) : (
                        <span>
                          أضف <strong className="text-[#13213c] font-black">{remainingForFreeShipping.toLocaleString('en-US')} د.ع</strong> للحصول على توصيل مجاني!
                        </span>
                      )}
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#22385e] to-[#13213c]"
                      />
                    </div>
                  </div>
                )}

                {/* Items List / Empty State */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                      <div className="w-20 h-20 rounded-3xl bg-[#F0F4F9] flex items-center justify-center text-[#13213c] mb-4 shadow-2xs">
                        <Gift className="w-9 h-9 text-[#13213c]" />
                      </div>
                      <h3 className="text-lg font-black text-slate-900 mb-1.5">
                        سلتك بانتظار هدية جميلة 🎁
                      </h3>
                      <p className="text-xs text-slate-500 max-w-xs mb-6 leading-relaxed">
                        لم تقم بإضافة أي هدايا حتى الآن. تصفح تشكيلتنا الملكية واختر هدية تسعد من تحب.
                      </p>
                      <button
                        onClick={() => {
                          closeDrawer()
                          router.push('/shop')
                        }}
                        className="inline-flex items-center gap-2 h-11 px-6 rounded-xl font-black text-white text-xs transition-all hover:-translate-y-0.5 shadow-sm cursor-pointer"
                        style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
                      >
                        <span>استكشف الهدايا الآن</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex gap-3 sm:gap-4 items-center">
                        {/* Image */}
                        <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          <Image
                            src={item.image || getCartFallbackImage(item.name, item.category)}
                            alt={item.name}
                            fill
                            sizes="72px"
                            className="object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate mb-1">
                            {item.name}
                          </h4>
                          <p className="text-xs font-black text-[#13213c] mb-2" dir="ltr">
                            {(item.price * item.quantity).toLocaleString('en-US')} <span className="text-[10px] text-slate-500 font-bold">د.ع</span>
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50/80 p-0.5">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white text-slate-600 transition-colors cursor-pointer"
                                aria-label="تقليل الكمية"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center text-xs font-black text-slate-900 tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white text-slate-600 transition-colors cursor-pointer"
                                aria-label="زيادة الكمية"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                              title="حذف من السلة"
                              aria-label="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer with totals & CTAs */}
                {items.length > 0 && (
                  <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-600">المجموع الفرعي:</span>
                      <span className="font-black text-base text-[#13213c]" dir="ltr">
                        {subtotal.toLocaleString('en-US')} <span className="text-xs font-bold text-slate-500">د.ع</span>
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>تغليف ملكي فاخر وكرت إهداء مجاني مع كل طلب 🎁</span>
                    </p>

                    {/* WhatsApp Quick Order CTA */}
                    <button
                      onClick={() => setIsWhatsAppModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 h-12 rounded-xl text-white font-extrabold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md cursor-pointer hover:-translate-y-0.5 active:scale-[0.99]"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>إتمام الطلب السريع عبر واتساب</span>
                    </button>

                    {/* Full Cart Link */}
                    <button
                      onClick={() => {
                        closeDrawer()
                        router.push('/cart')
                      }}
                      className="w-full flex items-center justify-center gap-2 h-11 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                    >
                      <span>عرض تفاصيل السلة الكاملة</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* WhatsApp Order Modal */}
      <WhatsAppOrderModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
      />
    </>
  )
}
