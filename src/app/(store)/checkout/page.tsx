'use client'

import React, { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Phone, CreditCard, Banknote, CheckCircle2, ChevronLeft, Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { createOrderAction } from '@/app/actions/orders'
import { toast } from 'sonner'

const iraqiGovernorates = [
  'بغداد', 'البصرة', 'نينوى', 'أربيل', 'النجف', 'ذي قار', 'كركوك', 'الأنبار', 
  'ديالى', 'المثنى', 'القادسية', 'ميسان', 'واسط', 'صلاح الدين', 'دهوك', 'السليمانية', 'بابل', 'كربلاء'
]

export default function CheckoutPage() {
  const [step, setStep] = useState(1) // 1: Shipping, 2: Review, 3: Success
  const [orderId, setOrderId] = useState<string | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    phone2: '',
    address: '',
    landmark: ''
  })

  const [isPending, startTransition] = useTransition()
  const cartItems = useCartStore(state => state.items)
  const clearCart = useCartStore(state => state.clearCart)
  const subtotal = useCartStore(state => state.getTotal())
  const shipping = subtotal > 100000 ? 0 : 5000
  const total = subtotal + (cartItems.length > 0 ? shipping : 0)

  const handleNext = () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.landmark) {
      toast.error('يرجى ملء جميع الحقول الأساسية (الاسم، الهاتف، العنوان، النقطة الدالة)')
      return
    }
    setStep(step + 1)
  }
  const handlePrev = () => setStep(step - 1)

  const handleConfirmOrder = () => {
    startTransition(async () => {
      const res = await createOrderAction({
        items: cartItems.map(item => ({
          id: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        })),
        customerName: formData.name,
        customerEmail: '', // Optional for now
        customerPhone: formData.phone,
        customerAddress: `${formData.address} - أٌقرب نقطة دالة: ${formData.landmark} ${formData.phone2 ? `- هاتف بديل: ${formData.phone2}` : ''}`,
        totalAmount: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
      })

      if (res.success && res.orderId) {
        setOrderId(res.orderId)
        clearCart()
        toast.success('تم إنشاء الطلب بنجاح!')
        setStep(3)
      } else {
        toast.error(res.error || 'حدث خطأ غير متوقع')
      }
    })
  }

  return (
    <div className="bg-[#050B14] min-h-screen py-32 relative overflow-hidden text-white">
      {/* 3D Depth Background */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Progress Tracker */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute end-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full z-0"></div>
            <motion.div 
              className="absolute end-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500 rounded-full z-0 transition-all duration-500 ease-in-out shadow-[0_0_10px_rgba(251,191,36,0.5)]"
              initial={{ width: '0%' }}
              animate={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
            ></motion.div>
            
            <div className={`relative z-10 flex flex-col items-center gap-2 ${step >= 1 ? 'text-amber-400' : 'text-slate-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-500 ${step >= 1 ? 'bg-amber-500 text-[#050B14] shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'bg-white/10 text-white/50 border border-white/5'}`}>
                1
              </div>
              <span className="text-sm font-bold">الشحن</span>
            </div>
            
            <div className={`relative z-10 flex flex-col items-center gap-2 ${step >= 2 ? 'text-amber-400' : 'text-slate-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-500 ${step >= 2 ? 'bg-amber-500 text-[#050B14] shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'bg-white/10 text-white/50 border border-white/5'}`}>
                2
              </div>
              <span className="text-sm font-bold">المراجعة</span>
            </div>
            
            <div className={`relative z-10 flex flex-col items-center gap-2 ${step >= 3 ? 'text-amber-400' : 'text-slate-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-500 ${step >= 3 ? 'bg-amber-500 text-[#050B14] shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'bg-white/10 text-white/50 border border-white/5'}`}>
                3
              </div>
              <span className="text-sm font-bold">تم الطلب</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 md:p-10 shadow-2xl border-white/10 overflow-hidden relative min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Shipping */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-white flex items-center gap-2 drop-shadow-md">
                    <MapPin className="w-6 h-6 text-amber-400" />
                    معلومات الشحن
                  </h2>
                  <p className="text-slate-400 mt-1">يرجى إدخال عنوان التوصيل الخاص بك بدقة.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name" className="text-slate-300">الاسم الكامل</Label>
                    <Input id="name" placeholder="محمد علي" className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-amber-500/50 rounded-xl" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-300">رقم الهاتف</Label>
                    <div className="relative">
                      <Phone className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <Input id="phone" placeholder="0770 000 0000" className="pe-4 ps-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-amber-500/50 rounded-xl text-end" dir="rtl" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone2" className="text-slate-300">رقم هاتف ثاني (اختياري)</Label>
                    <div className="relative">
                      <Phone className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <Input id="phone2" placeholder="0780 000 0000" className="pe-4 ps-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-amber-500/50 rounded-xl text-end" dir="rtl" value={formData.phone2} onChange={(e) => setFormData({...formData, phone2: e.target.value})} />
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="text-slate-300">العنوان الكامل (المحافظة والمنطقة)</Label>
                    <Input id="address" placeholder="بغداد، المنصور، شارع 14 رمضان..." className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-amber-500/50 rounded-xl" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="landmark" className="text-slate-300">أقرب نقطة دالة</Label>
                    <Input id="landmark" placeholder="بالقرب من مول المنصور، مجاور صيدلية..." className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-amber-500/50 rounded-xl" value={formData.landmark} onChange={(e) => setFormData({...formData, landmark: e.target.value})} />
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <Button onClick={handleNext} size="lg" className="w-full md:w-auto px-10 h-14 rounded-xl shadow-[0_10px_30px_rgba(251,191,36,0.3)] bg-gradient-to-r from-amber-500 to-yellow-600 text-[#050B14] font-black hover:scale-[1.02] active:scale-95 transition-all duration-300">
                    مراجعة الطلب
                    <ChevronLeft className="w-5 h-5 ms-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Review & Confirm */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-white flex items-center gap-2 drop-shadow-md">
                    <CheckCircle2 className="w-6 h-6 text-amber-400" />
                    المراجعة والتأكيد
                  </h2>
                  <p className="text-slate-400 mt-1">يرجى مراجعة تفاصيل طلبك قبل التأكيد النهائي.</p>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 -skew-x-12 translate-x-[-150%]" />
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[#050B14] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                    <Banknote className="w-8 h-8" />
                  </div>
                  <div className="text-center sm:text-end relative z-10">
                    <h3 className="font-bold text-lg text-white">الدفع عند الاستلام</h3>
                    <p className="text-sm text-slate-400 mt-1">سيتم دفع المبلغ الإجمالي نقداً للمندوب عند توصيل الطلب إليك.</p>
                  </div>
                </div>
                
                {/* Order Summary */}
                <div className="glass-card p-6 rounded-2xl border border-white/10 mt-6 shadow-inner">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    ملخص الطلب
                  </h3>
                  <div className="space-y-3 text-sm text-slate-300 mb-4">
                    <div className="flex justify-between">
                      <span>المجموع الفرعي ({cartItems.length} منتجات)</span>
                      <span className="font-medium text-white">{subtotal.toLocaleString('en-US')} د.ع</span>
                    </div>
                    <div className="flex justify-between">
                      <span>رسوم الشحن</span>
                      <span className="font-medium">{shipping === 0 ? <span className="text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">مجاني</span> : `${shipping.toLocaleString('en-US')} د.ع`}</span>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                    <span className="font-bold text-white text-lg">الإجمالي المطلوب</span>
                    <span className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-br from-amber-100 to-yellow-500 drop-shadow-lg">{total.toLocaleString('en-US')} <span className="text-sm font-bold text-amber-500/80">د.ع</span></span>
                  </div>
                </div>

                <div className="pt-6 flex flex-col-reverse md:flex-row justify-between gap-4">
                  <Button onClick={handlePrev} disabled={isPending} variant="outline" size="lg" className="w-full md:w-auto px-8 h-14 rounded-xl glass-button text-white border-white/10 hover:bg-white/10">
                    رجوع
                  </Button>
                  <Button onClick={handleConfirmOrder} disabled={isPending || cartItems.length === 0} size="lg" className="w-full md:w-auto px-10 h-14 rounded-xl shadow-[0_10px_30px_rgba(251,191,36,0.3)] bg-gradient-to-r from-amber-500 to-yellow-600 text-[#050B14] font-black hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center">
                    {isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 me-2 animate-spin text-[#050B14]" />
                        جاري التأكيد...
                      </>
                    ) : 'تأكيد الطلب'}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-32 h-32 relative mb-8">
                  <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-[20px] animate-pulse"></div>
                  <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.5)] relative z-10 border-[4px] border-[#050B14]">
                    <CheckCircle2 className="w-16 h-16 text-[#050B14]" />
                  </div>
                </div>
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 mb-4 drop-shadow-md">تم استلام طلبك بنجاح! 🎉</h2>
                <p className="text-slate-400 text-lg mb-8 max-w-md leading-relaxed">
                  شكراً لتسوقك معنا. رقم طلبك هو <span className="font-bold text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">#{orderId ? orderId.slice(-6).toUpperCase() : 'ORD-10928'}</span>. 
                  <br />سنتواصل معك قريباً لتأكيد موعد التسليم.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/shop" className="inline-flex items-center justify-center h-14 px-8 rounded-xl shadow-[0_10px_30px_rgba(251,191,36,0.3)] bg-gradient-to-r from-amber-500 to-yellow-600 text-[#050B14] font-black hover:scale-[1.02] active:scale-95 transition-all duration-300">
                    مواصلة التسوق
                  </Link>
                  <Link href="/" className="inline-flex items-center justify-center h-14 px-8 rounded-xl glass-button text-white font-bold hover:bg-white/10 transition-all border border-white/10">
                    العودة للرئيسية
                  </Link>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
