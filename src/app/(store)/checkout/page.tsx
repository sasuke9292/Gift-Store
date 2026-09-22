'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Phone, CheckCircle2, ChevronLeft, Loader2, Package, Shield, Gift, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { createOrderAction } from '@/app/actions/orders'
import { getPublicStoreSettings } from '@/app/actions/admin/settings'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const STEPS = [
  { id: 1, label: 'معلومات الشحن', icon: MapPin },
  { id: 2, label: 'مراجعة الطلب', icon: Package },
  { id: 3, label: 'تم الطلب', icon: CheckCircle2 },
]

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [orderId, setOrderId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    phone2: '',
    address: '',
    landmark: ''
  })

  const [shippingSettings, setShippingSettings] = useState({
    freeThreshold: 100000,
    shippingCost: 5000,
    currency: 'د.ع'
  })

  useEffect(() => {
    getPublicStoreSettings().then(res => {
      if (res) {
        setShippingSettings({
          freeThreshold: res.freeShippingThreshold ?? 100000,
          shippingCost: res.shippingCostBaghdad ?? 5000,
          currency: res.currency || 'د.ع'
        })
      }
    })
  }, [])

  const [errors, setErrors] = useState<Partial<typeof formData>>({})
  const [isPending, startTransition] = useTransition()
  const cartItems = useCartStore(state => state.items)
  const clearCart = useCartStore(state => state.clearCart)
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping = subtotal >= shippingSettings.freeThreshold ? 0 : shippingSettings.shippingCost
  const total = subtotal + (cartItems.length > 0 ? shipping : 0)

  const validate = () => {
    const newErrors: Partial<typeof formData> = {}
    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب'
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب'
    if (!formData.address.trim()) newErrors.address = 'العنوان مطلوب'
    if (!formData.landmark.trim()) newErrors.landmark = 'النقطة الدالة مطلوبة'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) setStep(2)
    else toast.error('يرجى ملء جميع الحقول المطلوبة')
  }

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
        customerEmail: '',
        customerPhone: formData.phone,
        customerAddress: `${formData.address} - أقرب نقطة دالة: ${formData.landmark}${formData.phone2 ? ` - هاتف بديل: ${formData.phone2}` : ''}`,
        totalAmount: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
      })

      if (res.success && res.orderId) {
        setOrderId(res.orderId)
        clearCart()
        setStep(3)
      } else {
        toast.error(res.error || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.')
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-4 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#FBF6EE] flex items-center justify-center">
              <Gift className="w-5 h-5 text-[#C9A96E]" />
            </div>
            <h1 className="text-3xl font-black text-[#1C1917]">إتمام الطلب</h1>
          </div>
          <p className="text-[#78716C] ms-14">أدخل معلوماتك لتأكيد طلبك</p>
        </div>

        {/* Step Indicator */}
        {step < 3 && (
          <div className="mb-8">
            <div className="flex items-center">
              {STEPS.slice(0, 2).map((s, idx) => (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300",
                      step >= s.id
                        ? "text-white shadow-[0_4px_12px_rgba(184,137,58,0.3)]"
                        : "bg-[#F5F0EA] text-[#A8A29E]"
                    )} style={step >= s.id ? { background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' } : {}}>
                      {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                    </div>
                    <span className={cn(
                      "text-xs font-bold mt-2 whitespace-nowrap",
                      step >= s.id ? "text-[#A07850]" : "text-[#A8A29E]"
                    )}>
                      {s.label}
                    </span>
                  </div>
                  {idx === 0 && (
                    <div className="flex-1 mx-3 mb-5">
                      <div className="h-0.5 bg-[#E8E4DF] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg, #C9A96E, #A07850)' }}
                          initial={{ width: '0%' }}
                          animate={{ width: step >= 2 ? '100%' : '0%' }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-[#E8E4DF] overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
          <AnimatePresence mode="wait">

            {/* ===== STEP 1: SHIPPING ===== */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="p-8"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-[#FBF6EE] flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#C9A96E]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#1C1917]">معلومات الشحن</h2>
                    <p className="text-sm text-[#A8A29E]">يرجى إدخال عنوان التوصيل بدقة</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <Label htmlFor="name" className="text-sm font-bold text-[#1C1917] mb-1.5 block">
                      الاسم الكامل <span className="text-[#E85D75]">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="محمد علي"
                      value={formData.name}
                      onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: '' }) }}
                      className={cn(
                        "h-12 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-[#1C1917] placeholder:text-[#C8C4BE] focus-visible:ring-[#C9A96E]/30 focus-visible:border-[#C9A96E]/50 transition-all",
                        errors.name && "border-[#E85D75] focus-visible:border-[#E85D75] focus-visible:ring-[#E85D75]/20"
                      )}
                    />
                    {errors.name && <p className="text-xs text-[#E85D75] mt-1 font-medium">{errors.name}</p>}
                  </div>

                  {/* Phone Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-sm font-bold text-[#1C1917] mb-1.5 block">
                        رقم الهاتف <span className="text-[#E85D75]">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
                        <Input
                          id="phone"
                          placeholder="07XX XXX XXXX"
                          value={formData.phone}
                          onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setErrors({ ...errors, phone: '' }) }}
                          dir="ltr"
                          className={cn(
                            "ps-10 h-12 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-[#1C1917] placeholder:text-[#C8C4BE] focus-visible:ring-[#C9A96E]/30 focus-visible:border-[#C9A96E]/50",
                            errors.phone && "border-[#E85D75]"
                          )}
                        />
                      </div>
                      {errors.phone && <p className="text-xs text-[#E85D75] mt-1 font-medium">{errors.phone}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone2" className="text-sm font-bold text-[#1C1917] mb-1.5 block">
                        هاتف بديل <span className="text-[#A8A29E] font-normal">(اختياري)</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
                        <Input
                          id="phone2"
                          placeholder="07XX XXX XXXX"
                          value={formData.phone2}
                          onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                          dir="ltr"
                          className="ps-10 h-12 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-[#1C1917] placeholder:text-[#C8C4BE] focus-visible:ring-[#C9A96E]/30 focus-visible:border-[#C9A96E]/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <Label htmlFor="address" className="text-sm font-bold text-[#1C1917] mb-1.5 block">
                      العنوان الكامل <span className="text-[#E85D75]">*</span>
                    </Label>
                    <Input
                      id="address"
                      placeholder="بغداد، المنصور، شارع 14 رمضان..."
                      value={formData.address}
                      onChange={(e) => { setFormData({ ...formData, address: e.target.value }); setErrors({ ...errors, address: '' }) }}
                      className={cn(
                        "h-12 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-[#1C1917] placeholder:text-[#C8C4BE] focus-visible:ring-[#C9A96E]/30 focus-visible:border-[#C9A96E]/50",
                        errors.address && "border-[#E85D75]"
                      )}
                    />
                    {errors.address && <p className="text-xs text-[#E85D75] mt-1 font-medium">{errors.address}</p>}
                  </div>

                  {/* Landmark */}
                  <div>
                    <Label htmlFor="landmark" className="text-sm font-bold text-[#1C1917] mb-1.5 block">
                      أقرب نقطة دالة <span className="text-[#E85D75]">*</span>
                    </Label>
                    <Input
                      id="landmark"
                      placeholder="بالقرب من مول المنصور، مجاور صيدلية..."
                      value={formData.landmark}
                      onChange={(e) => { setFormData({ ...formData, landmark: e.target.value }); setErrors({ ...errors, landmark: '' }) }}
                      className={cn(
                        "h-12 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-[#1C1917] placeholder:text-[#C8C4BE] focus-visible:ring-[#C9A96E]/30 focus-visible:border-[#C9A96E]/50",
                        errors.landmark && "border-[#E85D75]"
                      )}
                    />
                    {errors.landmark && <p className="text-xs text-[#E85D75] mt-1 font-medium">{errors.landmark}</p>}
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 h-12 px-8 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(184,137,58,0.35)]"
                    style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
                  >
                    مراجعة الطلب
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ===== STEP 2: REVIEW ===== */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="p-8"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-[#FBF6EE] flex items-center justify-center">
                    <Package className="w-5 h-5 text-[#C9A96E]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#1C1917]">مراجعة وتأكيد الطلب</h2>
                    <p className="text-sm text-[#A8A29E]">تحقق من تفاصيل طلبك قبل التأكيد</p>
                  </div>
                </div>

                {/* Shipping Details Summary */}
                <div className="bg-[#FAFAF8] rounded-2xl border border-[#E8E4DF] p-5 mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-[#1C1917] text-sm">معلومات الشحن</h3>
                    <button onClick={() => setStep(1)} className="text-xs font-bold text-[#C9A96E] hover:underline">
                      تعديل
                    </button>
                  </div>
                  <div className="space-y-1.5 text-sm text-[#78716C]">
                    <p><span className="font-bold text-[#1C1917]">الاسم:</span> {formData.name}</p>
                    <p><span className="font-bold text-[#1C1917]">الهاتف:</span> {formData.phone}</p>
                    <p><span className="font-bold text-[#1C1917]">العنوان:</span> {formData.address}</p>
                    <p><span className="font-bold text-[#1C1917]">النقطة الدالة:</span> {formData.landmark}</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-[#FBF6EE] border border-[#C9A96E]/20 rounded-2xl p-5 mb-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#C9A96E]/15 flex items-center justify-center shrink-0">
                    <span className="text-2xl">💵</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1C1917]">الدفع عند الاستلام</h3>
                    <p className="text-sm text-[#78716C] mt-0.5">سيتم دفع المبلغ نقداً للمندوب عند التوصيل</p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white border border-[#E8E4DF] rounded-2xl p-5 mb-6">
                  <h3 className="font-bold text-[#1C1917] text-sm mb-4">ملخص الطلب ({cartItems.length} منتج)</h3>
                  <div className="space-y-2 text-sm mb-4">
                    {cartItems.slice(0, 3).map(item => (
                      <div key={item.id} className="flex justify-between text-[#78716C]">
                        <span className="line-clamp-1">{item.name} × {item.quantity}</span>
                        <span className="font-medium shrink-0 ms-2">{(item.price * item.quantity).toLocaleString('en-US')} د.ع</span>
                      </div>
                    ))}
                    {cartItems.length > 3 && (
                      <p className="text-xs text-[#A8A29E]">و {cartItems.length - 3} منتجات أخرى...</p>
                    )}
                  </div>
                  <div className="border-t border-[#E8E4DF] pt-3 space-y-2 text-sm">
                    <div className="flex justify-between text-[#78716C]">
                      <span>المجموع الفرعي</span>
                      <span>{subtotal.toLocaleString('en-US')} د.ع</span>
                    </div>
                    <div className="flex justify-between text-[#78716C]">
                      <span>الشحن</span>
                      <span>{shipping === 0 ? <span className="text-[#10B981] font-bold">مجاني</span> : `${shipping.toLocaleString('en-US')} د.ع`}</span>
                    </div>
                    <div className="flex justify-between font-black text-[#1C1917] text-base pt-2 border-t border-[#E8E4DF]">
                      <span>الإجمالي المطلوب</span>
                      <span className="text-gold">{total.toLocaleString('en-US')} د.ع</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl font-bold text-[#78716C] border border-[#E8E4DF] hover:bg-[#F5F0EA] transition-all"
                  >
                    رجوع
                  </button>
                  <button
                    onClick={handleConfirmOrder}
                    disabled={isPending || cartItems.length === 0}
                    className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(184,137,58,0.35)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        جاري التأكيد...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        تأكيد الطلب
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ===== STEP 3: SUCCESS ===== */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, type: 'spring' }}
                className="p-12 text-center"
              >
                {/* Success Icon */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'rgba(201,169,110,0.15)' }} />
                  <div className="w-full h-full rounded-full flex items-center justify-center relative z-10 border-4 border-white shadow-[0_8px_30px_rgba(201,169,110,0.3)]"
                    style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}>
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                </div>

                <h2 className="text-3xl font-black text-[#1C1917] mb-3">تم استلام طلبك! 🎉</h2>
                <p className="text-[#78716C] mb-2 max-w-md mx-auto leading-relaxed">
                  شكراً لتسوقك من گفتي بلس. رقم طلبك هو{' '}
                  <span className="font-black text-[#C9A96E]">
                    #{orderId ? orderId.slice(-6).toUpperCase() : 'GP-CONFIRMED'}
                  </span>
                </p>
                <p className="text-sm text-[#A8A29E] mb-10">
                  سنتواصل معك قريباً على رقم هاتفك لتأكيد موعد التسليم
                </p>

                {/* Trust note */}
                <div className="flex items-center justify-center gap-2 text-sm text-[#78716C] mb-8 bg-[#F0FDF9] border border-[#10B981]/20 rounded-xl p-3 max-w-sm mx-auto">
                  <Shield className="w-4 h-4 text-[#10B981] shrink-0" />
                  طلبك محفوظ وسيتم تأكيده خلال 30 دقيقة
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/shop"
                    className="flex items-center justify-center gap-2 h-12 px-8 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
                  >
                    مواصلة التسوق
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/"
                    className="flex items-center justify-center gap-2 h-12 px-8 rounded-xl font-bold text-[#78716C] border border-[#E8E4DF] hover:bg-[#F5F0EA] transition-all"
                  >
                    العودة للرئيسية
                  </Link>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Security Note */}
        {step < 3 && (
          <div className="flex items-center justify-center gap-2 mt-5 text-xs text-[#A8A29E]">
            <Shield className="w-3.5 h-3.5 text-[#10B981]" />
            بياناتك آمنة ومشفرة بالكامل — لا يتم حفظ بيانات البطاقات
          </div>
        )}
      </div>
    </div>
  )
}
