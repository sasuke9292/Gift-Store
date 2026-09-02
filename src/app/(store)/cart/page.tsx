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
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-primary" />
            سلة المشتريات
          </h1>
          <p className="text-slate-500 mt-2">راجع العناصر الخاصة بك وأكمل عملية الشراء.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
              
              {cartItems.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">السلة فارغة</h3>
                  <p className="text-slate-500 mb-8">لم تقم بإضافة أي منتجات إلى سلتك بعد.</p>
                  <Link href="/shop" className={buttonVariants({ size: "lg", className: "rounded-full px-8" })}>
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
                        className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-slate-50 transition-all"
                      >
                        <div className="w-20 h-20 bg-slate-100 rounded-2xl shrink-0 overflow-hidden relative">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                              صورة
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-center sm:text-end">
                          {item.category && <p className="text-xs text-slate-500 mb-1">{item.category}</p>}
                          <h3 className="font-bold text-slate-800 line-clamp-1 mb-2">{item.name}</h3>
                          <span className="text-primary font-bold text-lg">{item.price.toLocaleString('en-US')} د.ع</span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center bg-white border border-slate-200 rounded-full p-1 h-12">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="rounded-full w-10 h-10 text-slate-500 hover:text-slate-800"
                              onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-10 text-center font-bold text-slate-800">{item.quantity}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="rounded-full w-10 h-10 text-slate-500 hover:text-slate-800"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
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
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 sticky top-28">
                <h3 className="font-bold text-xl text-slate-800 mb-6">ملخص الطلب</h3>
                
                <div className="space-y-4 mb-6 text-slate-600">
                  <div className="flex justify-between items-center">
                    <span>المجموع الفرعي</span>
                    <span className="font-bold">{subtotal.toLocaleString('en-US')} د.ع</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>رسوم الشحن</span>
                    <span className="font-medium text-slate-800">
                      {shipping === 0 ? <span className="text-green-600">مجاني</span> : `${shipping.toLocaleString('en-US')} د.ع`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-lg">الإجمالي</span>
                    <span className="font-bold text-2xl text-primary">{total.toLocaleString('en-US')} د.ع</span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-green-600 mt-2 text-start">أنت مؤهل للشحن المجاني!</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input placeholder="كود الخصم" className="h-12 bg-slate-50 border-transparent rounded-xl flex-1" />
                    <Button variant="outline" className="h-12 rounded-xl px-6">تطبيق</Button>
                  </div>
                  
                  <Link href="/checkout" className={buttonVariants({ size: "lg", className: "w-full h-14 rounded-xl text-lg shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform" })}>
                    متابعة الدفع
                    <ArrowLeft className="w-5 h-5 ms-2" />
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
