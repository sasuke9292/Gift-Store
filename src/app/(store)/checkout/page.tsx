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
  const [step, setStep] = useState(1) // 1: Shipping, 2: Payment, 3: Success
  const [paymentMethod, setPaymentMethod] = useState('cod') // 'cod' or 'card'
  const [orderId, setOrderId] = useState<string | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    governorate: '',
    city: '',
    address: ''
  })

  const [isPending, startTransition] = useTransition()
  const cartItems = useCartStore(state => state.items)
  const clearCart = useCartStore(state => state.clearCart)
  const subtotal = useCartStore(state => state.getTotal())
  const shipping = subtotal > 100000 ? 0 : 5000
  const total = subtotal + (cartItems.length > 0 ? shipping : 0)

  const handleNext = () => {
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.governorate || !formData.city || !formData.address) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
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
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: '', // Optional for now
        customerPhone: formData.phone,
        customerAddress: `${formData.governorate}, ${formData.city}, ${formData.address}`,
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
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Tracker */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full z-0"></div>
            <motion.div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-500 ease-in-out"
              initial={{ width: '0%' }}
              animate={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
            ></motion.div>
            
            <div className={`relative z-10 flex flex-col items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-slate-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-500 ${step >= 1 ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-slate-300'}`}>
                1
              </div>
              <span className="text-sm font-medium">الشحن</span>
            </div>
            
            <div className={`relative z-10 flex flex-col items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-slate-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-500 ${step >= 2 ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-slate-300'}`}>
                2
              </div>
              <span className="text-sm font-medium">الدفع</span>
            </div>
            
            <div className={`relative z-10 flex flex-col items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-slate-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-500 ${step >= 3 ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-slate-300'}`}>
                3
              </div>
              <span className="text-sm font-medium">التأكيد</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 overflow-hidden relative min-h-[500px]">
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
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-primary" />
                    معلومات الشحن
                  </h2>
                  <p className="text-slate-500 mt-1">يرجى إدخال عنوان التوصيل الخاص بك بدقة.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">الاسم الأول</Label>
                    <Input id="firstName" placeholder="محمد" className="h-12 bg-slate-50 rounded-xl" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">اسم العائلة</Label>
                    <Input id="lastName" placeholder="علي" className="h-12 bg-slate-50 rounded-xl" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <div className="relative">
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input id="phone" placeholder="0770 000 0000" className="pl-4 pr-12 h-12 bg-slate-50 rounded-xl text-left" dir="ltr" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="governorate">المحافظة</Label>
                    <Select value={formData.governorate} onValueChange={(val) => setFormData({...formData, governorate: val || ''})}>
                      <SelectTrigger className="h-12 bg-slate-50 rounded-xl border-slate-200">
                        <SelectValue placeholder="اختر المحافظة" />
                      </SelectTrigger>
                      <SelectContent>
                        {iraqiGovernorates.map((gov) => (
                          <SelectItem key={gov} value={gov}>{gov}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">المدينة / المنطقة</Label>
                    <Input id="city" placeholder="مثال: المنصور" className="h-12 bg-slate-50 rounded-xl" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">العنوان التفصيلي (أقرب نقطة دالة)</Label>
                    <Input id="address" placeholder="الشارع، المحلة، الزقاق، رقم الدار" className="h-12 bg-slate-50 rounded-xl" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <Button onClick={handleNext} size="lg" className="w-full md:w-auto px-10 h-14 rounded-xl shadow-md hover:scale-105 transition-transform">
                    متابعة للدفع
                    <ChevronLeft className="w-5 h-5 mr-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Payment */}
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
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-primary" />
                    طريقة الدفع
                  </h2>
                  <p className="text-slate-500 mt-1">اختر طريقة الدفع المناسبة لك.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`cursor-pointer rounded-2xl border-2 p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${paymentMethod === 'cod' ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cod" 
                      checked={paymentMethod === 'cod'} 
                      onChange={() => setPaymentMethod('cod')}
                      className="sr-only" 
                    />
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${paymentMethod === 'cod' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <Banknote className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-lg text-slate-800">الدفع عند الاستلام</span>
                    <span className="text-sm text-slate-500 text-center">ادفع نقداً عند استلام طلبك</span>
                  </label>

                  <label className={`cursor-pointer rounded-2xl border-2 p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${paymentMethod === 'card' ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="card" 
                      checked={paymentMethod === 'card'} 
                      onChange={() => setPaymentMethod('card')}
                      className="sr-only" 
                    />
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${paymentMethod === 'card' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <CreditCard className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-lg text-slate-800">بطاقة مصرفية / زين كاش</span>
                    <span className="text-sm text-slate-500 text-center">دفع إلكتروني آمن وسريع</span>
                  </label>
                </div>
                
                {/* Order Summary */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-6">
                  <h3 className="font-bold text-slate-800 mb-4">ملخص الطلب</h3>
                  <div className="space-y-2 text-sm text-slate-600 mb-4">
                    <div className="flex justify-between">
                      <span>المجموع الفرعي ({cartItems.length} منتجات)</span>
                      <span className="font-medium">{subtotal.toLocaleString('en-US')} د.ع</span>
                    </div>
                    <div className="flex justify-between">
                      <span>رسوم الشحن</span>
                      <span className="font-medium">{shipping === 0 ? <span className="text-green-600">مجاني</span> : `${shipping.toLocaleString('en-US')} د.ع`}</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-lg">الإجمالي المطلوب</span>
                    <span className="font-bold text-2xl text-primary">{total.toLocaleString('en-US')} د.ع</span>
                  </div>
                </div>

                <div className="pt-6 flex flex-col-reverse md:flex-row justify-between gap-4">
                  <Button onClick={handlePrev} disabled={isPending} variant="outline" size="lg" className="w-full md:w-auto px-8 h-14 rounded-xl">
                    رجوع
                  </Button>
                  <Button onClick={handleConfirmOrder} disabled={isPending || cartItems.length === 0} size="lg" className="w-full md:w-auto px-10 h-14 rounded-xl shadow-md hover:scale-105 transition-transform flex items-center justify-center">
                    {isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
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
                <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">تم استلام طلبك بنجاح! 🎉</h2>
                <p className="text-slate-500 text-lg mb-8 max-w-md">
                  شكراً لتسوقك معنا. رقم طلبك هو <span className="font-bold text-slate-800">#{orderId ? orderId.slice(-6).toUpperCase() : 'ORD-10928'}</span>. 
                  سنتواصل معك قريباً لتأكيد موعد التسليم.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/shop" className={buttonVariants({ size: "lg", className: "h-14 px-8 rounded-xl shadow-md hover:scale-105 transition-transform" })}>
                    مواصلة التسوق
                  </Link>
                  <Link href="/" className={buttonVariants({ variant: "outline", size: "lg", className: "h-14 px-8 rounded-xl bg-slate-50" })}>
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
