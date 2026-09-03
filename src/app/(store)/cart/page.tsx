'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, ArrowLeft, Plus, Minus, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/store'
import { toast } from 'sonner'

export default function CartPage() {
  const cartItems = useCartStore(state => state.items)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const removeItem = useCartStore(state => state.removeItem)
  const subtotal = useCartStore(state => state.getTotal())
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const shipping = subtotal > 100000 ? 0 : 5000
  const total = subtotal + (cartItems.length > 0 ? shipping : 0)

  if (!mounted) return null

  return (
    <div className="bg-[#050B14] min-h-screen py-32 relative overflow-hidden text-white">
      {/* 3D Depth Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 glass-card p-8 rounded-3xl"
        >
          <h1 className="text-3xl font-black text-white flex items-center gap-3 drop-shadow-md">
            <ShoppingBag className="w-8 h-8 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]" />
            سلة المشتريات
          </h1>
          <p className="text-slate-400 mt-2">راجع العناصر الخاصة بك وأكمل عملية الشراء في بيئة آمنة.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 perspective-[1000px]">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="glass-card rounded-3xl p-6 md:p-8 shadow-xl border-white/5">
              
              {cartItems.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-white/20 shadow-inner">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">السلة فارغة</h3>
                  <p className="text-slate-400 mb-8">لم تقم بإضافة أي منتجات إلى سلتك بعد.</p>
                  <Link href="/shop" className="inline-flex items-center justify-center h-14 px-8 rounded-full glass-button text-white font-bold transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.2)]">
                    مواصلة التسوق
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl glass-card border-white/10 hover:border-amber-400/30 hover:bg-white/5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all group"
                      >
                        <div className="w-20 h-20 bg-white/5 rounded-2xl shrink-0 overflow-hidden relative border border-white/10 group-hover:scale-105 transition-transform">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                              صورة
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-center sm:text-start">
                          {item.category && <p className="text-xs text-amber-300 mb-1 font-medium">{item.category}</p>}
                          <h3 className="font-bold text-white line-clamp-1 mb-2 drop-shadow-sm">{item.name}</h3>
                          <span className="text-amber-400 font-bold text-lg drop-shadow-sm">{item.price.toLocaleString('en-US')} د.ع</span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center glass-card border border-white/10 rounded-full p-1 h-12">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="rounded-full w-10 h-10 text-white/70 hover:text-white hover:bg-white/10"
                              onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-10 text-center font-bold text-white">{item.quantity}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="rounded-full w-10 h-10 text-white/70 hover:text-white hover:bg-white/10"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white/50 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-colors"
                            onClick={() => {
                              removeItem(item.id)
                              toast.error('تم حذف المنتج من السلة')
                            }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-96 shrink-0"
            >
              <div className="glass-card rounded-3xl p-6 md:p-8 shadow-xl border-white/5 sticky top-28">
                <h3 className="font-bold text-xl text-white mb-6 drop-shadow-md">ملخص الطلب</h3>
                
                <div className="space-y-4 mb-6 text-slate-300">
                  <div className="flex justify-between items-center">
                    <span>المجموع الفرعي</span>
                    <span className="font-bold text-white">{subtotal.toLocaleString('en-US')} د.ع</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>رسوم الشحن</span>
                    <span className="font-medium text-white">
                      {shipping === 0 ? <span className="text-amber-400">مجاني</span> : `${shipping.toLocaleString('en-US')} د.ع`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-lg drop-shadow-md">الإجمالي</span>
                    <span className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-br from-amber-100 to-yellow-500 drop-shadow-lg">{total.toLocaleString('en-US')} <span className="text-sm font-bold text-amber-500/80">د.ع</span></span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-amber-400/80 mt-2 text-end drop-shadow-sm">أنت مؤهل للشحن المجاني!</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input placeholder="كود الخصم" className="h-12 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus-visible:ring-amber-500/50 rounded-xl flex-1 shadow-inner" />
                    <Button variant="outline" className="h-12 rounded-xl px-6 glass-button text-white border-white/10">تطبيق</Button>
                  </div>
                  
                  <Link href="/checkout" className="flex items-center justify-center w-full h-14 rounded-full text-lg shadow-[0_10px_30px_rgba(251,191,36,0.3)] hover:shadow-[0_15px_40px_rgba(251,191,36,0.5)] bg-gradient-to-r from-amber-500 to-yellow-600 text-[#050B14] font-black hover:scale-[1.02] active:scale-95 transition-all duration-300 group overflow-hidden relative">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out -skew-x-12 translate-x-[-150%]" />
                    متابعة الدفع
                    <ArrowLeft className="w-5 h-5 me-2 group-hover:-translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  )
}
