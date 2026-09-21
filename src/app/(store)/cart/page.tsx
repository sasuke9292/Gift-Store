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

export default function CartPage() {
  const cartItems = useCartStore(state => state.items)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const removeItem = useCartStore(state => state.removeItem)
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const mounted = useMounted()
  const [couponCode, setCouponCode] = useState('')

  const FREE_SHIPPING_THRESHOLD = 100000
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : 5000
  const total = subtotal + (cartItems.length > 0 ? shipping : 0)
  const progressToFreeShipping = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#FBF6EE] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-[#C9A96E]" />
            </div>
            <h1 className="text-3xl font-black text-[#1C1917]">سلة المشتريات</h1>
            {cartItems.length > 0 && (
              <span className="bg-[#1C1917] text-white text-xs font-black px-2.5 py-1 rounded-full">
                {cartItems.length}
              </span>
            )}
          </div>
          <p className="text-[#78716C] ms-14">راجع عناصرك وأكمل عملية الشراء</p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-24 h-24 rounded-full bg-[#F5F0EA] flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-[#C9A96E]/60" />
            </div>
            <h2 className="text-2xl font-black text-[#1C1917] mb-3">السلة فارغة</h2>
            <p className="text-[#78716C] mb-8 max-w-sm mx-auto">لم تقم بإضافة أي منتجات إلى سلتك بعد. ابدأ التسوق لاكتشاف هدايا رائعة.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
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
                  className="bg-[#FBF6EE] border border-[#C9A96E]/20 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-[#C9A96E]" />
                    <p className="text-sm font-bold text-[#1C1917]">
                      أضف <span className="text-[#C9A96E]">{remainingForFreeShipping.toLocaleString('en-US')} د.ع</span> للحصول على شحن مجاني!
                    </p>
                  </div>
                  <div className="w-full h-2 bg-[#E8DFD3] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToFreeShipping}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #C9A96E, #A07850)' }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Items List */}
              <div className="bg-white rounded-2xl border border-[#E8E4DF] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                <AnimatePresence>
                  {cartItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex flex-col sm:flex-row items-center gap-4 p-5 transition-colors hover:bg-[#FAFAF8] ${
                        idx < cartItems.length - 1 ? 'border-b border-[#E8E4DF]' : ''
                      }`}
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F8F4EF] border border-[#E8E4DF] shrink-0 relative">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-[#C9A96E]/40" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 text-center sm:text-start min-w-0">
                        {item.category && (
                          <p className="text-[11px] font-bold text-[#C9A96E] uppercase tracking-widest mb-1">{item.category}</p>
                        )}
                        <h3 className="font-bold text-[#1C1917] mb-1 line-clamp-1">{item.name}</h3>
                        <p className="text-lg font-black text-gold">
                          {item.price.toLocaleString('en-US')}
                          <span className="text-sm font-bold text-[#A8A29E] ms-1">د.ع</span>
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-[#E8E4DF] rounded-xl overflow-hidden">
                          <button
                            className="w-9 h-9 flex items-center justify-center text-[#78716C] hover:bg-[#F5F0EA] hover:text-[#1C1917] transition-colors"
                            onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                            aria-label="تقليل الكمية"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center font-bold text-sm text-[#1C1917]">{item.quantity}</span>
                          <button
                            className="w-9 h-9 flex items-center justify-center text-[#78716C] hover:bg-[#F5F0EA] hover:text-[#1C1917] transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="زيادة الكمية"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <p className="w-24 text-end font-black text-[#1C1917] text-sm hidden sm:block">
                          {(item.price * item.quantity).toLocaleString('en-US')} د.ع
                        </p>

                        {/* Delete */}
                        <button
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#A8A29E] hover:text-[#E85D75] hover:bg-[#FDF2F4] transition-all"
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
                className="flex items-center gap-2 text-sm font-semibold text-[#78716C] hover:text-[#C9A96E] transition-colors mt-2"
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
              <div className="bg-white rounded-2xl border border-[#E8E4DF] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                <h2 className="font-black text-[#1C1917] text-lg mb-5">ملخص الطلب</h2>

                {/* Pricing */}
                <div className="space-y-3 mb-5 text-sm">
                  <div className="flex justify-between text-[#78716C]">
                    <span>المجموع الفرعي ({cartItems.length} منتج)</span>
                    <span className="font-bold text-[#1C1917]">{subtotal.toLocaleString('en-US')} د.ع</span>
                  </div>
                  <div className="flex justify-between text-[#78716C]">
                    <span>رسوم الشحن</span>
                    <span className="font-bold">
                      {shipping === 0 ? (
                        <span className="text-[#10B981] font-bold">مجاني 🎉</span>
                      ) : `${shipping.toLocaleString('en-US')} د.ع`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#E8E4DF] pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-[#1C1917]">الإجمالي</span>
                    <span className="text-2xl font-black text-gold">
                      {total.toLocaleString('en-US')}
                      <span className="text-sm font-bold text-[#A8A29E] ms-1">د.ع</span>
                    </span>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="flex gap-2 mb-5">
                  <Input
                    placeholder="كود الخصم"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 h-10 rounded-xl text-sm border-[#E8E4DF] bg-[#FAFAF8] placeholder:text-[#A8A29E] focus-visible:ring-[#C9A96E]/30 focus-visible:border-[#C9A96E]/40"
                  />
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl border-[#E8E4DF] text-[#78716C] hover:bg-[#F5F0EA] text-sm font-bold"
                    onClick={() => toast.info('كود الخصم غير صالح أو منتهي الصلاحية')}
                  >
                    تطبيق
                  </Button>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2 w-full h-13 py-3.5 rounded-xl font-bold text-white text-base transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(184,137,58,0.35)]"
                  style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
                >
                  متابعة الدفع
                  <ArrowLeft className="w-4 h-4" />
                </Link>

                {/* Trust Badges */}
                <div className="mt-5 flex items-center justify-center gap-4 text-xs text-[#A8A29E]">
                  <span className="flex items-center gap-1">🔒 دفع آمن</span>
                  <span className="flex items-center gap-1">📦 شحن سريع</span>
                  <span className="flex items-center gap-1">↩️ استرجاع مجاني</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
