'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, ArrowLeft, Plus, Minus, ShoppingBag, Tag, Truck, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/store'
import { toast } from 'sonner'
import { useMounted } from '@/lib/use-mounted'

import { getPublicStoreSettings } from '@/app/actions/admin/settings'
import { WhatsAppOrderModal } from '@/components/cart/whatsapp-order-modal'

export default function CartPage() {
  const cartItems = useCartStore(state => state.items)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const removeItem = useCartStore(state => state.removeItem)
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const mounted = useMounted()
  const [couponCode, setCouponCode] = useState('')

  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false)
  const [storeSettings, setStoreSettings] = useState({
    freeThreshold: 100000,
    shippingCostBaghdad: 5000,
    shippingCostProvinces: 7000,
    currency: 'د.ع',
    whatsappOrderEnabled: true
  })

  useEffect(() => {
    getPublicStoreSettings().then(res => {
      if (res) {
        setStoreSettings({
          freeThreshold: res.freeShippingThreshold ?? 100000,
          shippingCostBaghdad: res.shippingCostBaghdad ?? 5000,
          shippingCostProvinces: res.shippingCostProvinces ?? 7000,
          currency: res.currency || 'د.ع',
          whatsappOrderEnabled: res.whatsappOrderEnabled ?? true
        })
      }
    })
  }, [])

  const FREE_SHIPPING_THRESHOLD = storeSettings.freeThreshold
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : storeSettings.shippingCostBaghdad
  const total = subtotal + (cartItems.length > 0 ? shipping : 0)
  const progressToFreeShipping = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-4 pb-32 sm:pb-24" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-2 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-slate-200" />
            <div className="h-8 w-44 bg-slate-200 rounded-lg" />
          </div>
          <div className="h-4 w-60 bg-slate-200 rounded-md ms-14 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-28 bg-white rounded-3xl border border-slate-200/80 animate-pulse p-4" />
              ))}
            </div>
            <div className="lg:col-span-4">
              <div className="h-72 bg-white rounded-3xl border border-slate-200/80 animate-pulse p-6" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-4 pb-32 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#F0F4F9] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-[#13213c]" />
            </div>
            <h1 className="text-3xl font-black text-slate-900">سلة المشتريات</h1>
            {cartItems.length > 0 && (
              <span className="bg-[#13213c] text-white text-xs font-black px-2.5 py-1 rounded-full">
                {cartItems.length}
              </span>
            )}
          </div>
          <p className="text-slate-500 ms-14">راجع عناصرك وأكمل عملية الشراء</p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-[#13213c]/60" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3">السلة فارغة</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">لم تقم بإضافة أي منتجات إلى سلتك بعد. ابدأ التسوق لاكتشاف هدايا رائعة.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 cursor-pointer shadow-xs"
              style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
            >
              مواصلة التسوق
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Cart Items */}
            <div className="flex-1 min-w-0 space-y-4">

              {/* Free Shipping Progress */}
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#F0F4F9] border border-[#13213c]/20 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-[#13213c]" />
                    <p className="text-sm font-bold text-slate-900">
                      أضف <span className="text-[#13213c] font-black">{remainingForFreeShipping.toLocaleString('en-US')} د.ع</span> للحصول على شحن مجاني!
                    </p>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToFreeShipping}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #22385e, #13213c)' }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Items List */}
              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
                <AnimatePresence>
                  {cartItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex flex-col sm:flex-row items-center gap-4 p-5 transition-colors hover:bg-slate-50/60 ${
                        idx < cartItems.length - 1 ? 'border-b border-slate-100' : ''
                      }`}
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100/70 border border-slate-200/80 shrink-0 relative">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-[#13213c]/40" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 text-center sm:text-start min-w-0">
                        {item.category && (
                          <p className="text-[11px] font-bold text-[#13213c] uppercase tracking-widest mb-1">{item.category}</p>
                        )}
                        <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{item.name}</h3>
                        <p className="text-lg font-black text-gold">
                          {item.price.toLocaleString('en-US')}
                          <span className="text-sm font-bold text-slate-400 ms-1">د.ع</span>
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                          <button
                            className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                            onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                            aria-label="تقليل الكمية"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center font-bold text-sm text-slate-900">{item.quantity}</span>
                          <button
                            className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="زيادة الكمية"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <p className="w-24 text-end font-black text-slate-900 text-sm hidden sm:block">
                          {(item.price * item.quantity).toLocaleString('en-US')} د.ع
                        </p>

                        {/* Delete */}
                        <button
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                          onClick={() => {
                            removeItem(item.id)
                            toast.error('تم حذف المنتج من السلة')
                          }}
                          aria-label="حذف المنتج"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Continue Shopping */}
              <Link
                href="/shop"
                className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#13213c] transition-colors mt-2"
              >
                <ArrowRight className="w-4 h-4" />
                مواصلة التسوق
              </Link>
            </div>

            {/* Order Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-[360px] shrink-0 sticky top-28"
            >
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
                <h2 className="font-black text-slate-900 text-lg mb-5">ملخص الطلب</h2>

                {/* Pricing */}
                <div className="space-y-3 mb-5 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>المجموع الفرعي ({cartItems.length} منتج)</span>
                    <span className="font-bold text-slate-900">{subtotal.toLocaleString('en-US')} د.ع</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>رسوم الشحن</span>
                    <span className="font-bold">
                      {shipping === 0 ? (
                        <span className="text-emerald-600 font-bold">مجاني 🎉</span>
                      ) : `${shipping.toLocaleString('en-US')} د.ع`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200/80 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-slate-900">الإجمالي</span>
                    <span className="text-2xl font-black text-amber-500">
                      {total.toLocaleString('en-US')}
                      <span className="text-sm font-bold text-slate-400 ms-1">د.ع</span>
                    </span>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="flex gap-2 mb-5">
                  <Input
                    placeholder="كود الخصم"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 h-10 rounded-xl text-sm border-slate-200 bg-slate-50 placeholder:text-slate-400 focus-visible:ring-[#13213c]/30 focus-visible:border-[#13213c]/40"
                  />
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-sm font-bold"
                    onClick={() => toast.info('كود الخصم غير صالح أو منتهي الصلاحية')}
                  >
                    تطبيق
                  </Button>
                </div>

                {/* WhatsApp Checkout Button */}
                {storeSettings.whatsappOrderEnabled ? (
                  <button
                    type="button"
                    onClick={() => setIsWhatsAppModalOpen(true)}
                    className="flex items-center justify-center gap-2.5 w-full h-14 py-3.5 px-4 rounded-2xl font-black text-white text-base transition-all duration-200 hover:-translate-y-0.5 shadow-[0_6px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.35)] cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
                  >
                    <svg className="w-6 h-6 fill-white shrink-0" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043s.433-.506.549-.68c.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.394-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.881l-1.344 4.912 5.044-1.323c1.402.766 3.003 1.2 4.707 1.2 5.522 0 10-4.477 10-10s-4.478-10-9.671-10z" />
                    </svg>
                    <span>إتمام الطلب عبر WhatsApp</span>
                    <ArrowLeft className="w-4 h-4 ms-auto" />
                  </button>
                ) : (
                  <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-center">
                    <p className="text-xs font-bold text-amber-800">
                      خدمة الطلب عبر WhatsApp معطلة مؤقتاً في المتجر
                    </p>
                  </div>
                )}

                {/* Trust Badges */}
                <div className="mt-5 flex items-center justify-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">🔒 دفع آمن</span>
                  <span className="flex items-center gap-1">📦 شحن سريع</span>
                  <span className="flex items-center gap-1">↩️ استرجاع مجاني</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Mobile Sticky Checkout Bar */}
        {cartItems.length > 0 && storeSettings.whatsappOrderEnabled && (
          <div className="fixed bottom-0 start-0 end-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] z-40 lg:hidden shadow-[0_-4px_20px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
              <div>
                <p className="text-[11px] text-slate-500 font-bold">الإجمالي الكلي</p>
                <p className="text-lg font-black text-slate-900">
                  {total.toLocaleString('en-US')} <span className="text-xs font-normal text-slate-400">د.ع</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsWhatsAppModalOpen(true)}
                className="flex-1 h-12 rounded-xl font-extrabold text-white text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
              >
                <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043s.433-.506.549-.68c.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.394-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.881l-1.344 4.912 5.044-1.323c1.402.766 3.003 1.2 4.707 1.2 5.522 0 10-4.477 10-10s-4.478-10-9.671-10z" />
                </svg>
                <span>طلب عبر WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        {/* WhatsApp Order Modal */}
        <WhatsAppOrderModal
          isOpen={isWhatsAppModalOpen}
          onClose={() => setIsWhatsAppModalOpen(false)}
          shippingSettings={{
            freeThreshold: storeSettings.freeThreshold,
            shippingCostBaghdad: storeSettings.shippingCostBaghdad,
            shippingCostProvinces: storeSettings.shippingCostProvinces,
            currency: storeSettings.currency
          }}
        />
      </div>
    </div>
  )
}
