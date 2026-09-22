'use client'

import React, { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  ShoppingBag, 
  MapPin, 
  User, 
  Phone, 
  Truck, 
  Store, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  ExternalLink,
  Loader2,
  AlertCircle,
  FileText,
  Sparkles,
  ShieldCheck,
  ChevronDown
} from 'lucide-react'
import Image from 'next/image'
import { useCartStore } from '@/lib/store'
import { createWhatsAppOrderAction } from '@/app/actions/orders'
import { toast } from 'sonner'

// 18 Iraqi Governorates
const IRAQI_PROVINCES = [
  'بغداد',
  'البصرة',
  'أربيل',
  'النجف الأشرف',
  'كربلاء المقدسة',
  'السليمانية',
  'دهوك',
  'كركوك',
  'نينوى (الموصل)',
  'الأنبار',
  'بابل (الحلة)',
  'ديالى',
  'واسط (الكوت)',
  'صلاح الدين',
  'ميسان (العمارة)',
  'ذي قار (الناصرية)',
  'المثنى (السماوة)',
  'القادسية (الديوانية)'
]

interface WhatsAppOrderModalProps {
  isOpen: boolean
  onClose: () => void
  shippingSettings?: {
    freeThreshold: number
    shippingCostBaghdad: number
    shippingCostProvinces: number
    currency: string
  }
}

export function WhatsAppOrderModal({
  isOpen,
  onClose,
  shippingSettings = {
    freeThreshold: 100000,
    shippingCostBaghdad: 5000,
    shippingCostProvinces: 7000,
    currency: 'د.ع'
  }
}: WhatsAppOrderModalProps) {
  const cartItems = useCartStore(state => state.items)
  const clearCart = useCartStore(state => state.clearCart)

  const [step, setStep] = useState<'info' | 'summary' | 'success'>('info')
  const [isPending, startTransition] = useTransition()

  // Form State
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [province, setProvince] = useState('بغداد')
  const [area, setArea] = useState('')
  const [address, setAddress] = useState('')
  const [deliveryType, setDeliveryType] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY')
  const [notes, setNotes] = useState('')

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Completed Order Details
  const [completedOrder, setCompletedOrder] = useState<{
    orderNumber: string
    whatsappUrl: string
    totalAmount: number
    shippingCost: number
    subtotal: number
  } | null>(null)

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const isFreeShipping = subtotal >= shippingSettings.freeThreshold
  const baseShipping = province.includes('بغداد')
    ? shippingSettings.shippingCostBaghdad
    : shippingSettings.shippingCostProvinces
  const calculatedShipping = deliveryType === 'PICKUP' ? 0 : (isFreeShipping ? 0 : baseShipping)
  const grandTotal = subtotal + calculatedShipping

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!customerName.trim() || customerName.trim().length < 2) {
      newErrors.customerName = 'يرجى إدخال الاسم الكامل.'
    }
    const cleanPhone = customerPhone.replace(/\D/g, '')
    if (!customerPhone.trim() || cleanPhone.length < 10) {
      newErrors.customerPhone = 'يرجى إدخال رقم هاتف صحيح (مثال: 07701234567).'
    }
    if (!province.trim()) {
      newErrors.province = 'يرجى اختيار المحافظة.'
    }
    if (!area.trim()) {
      newErrors.area = 'يرجى إدخال اسم المنطقة أو القضاء.'
    }
    if (deliveryType === 'DELIVERY' && (!address.trim() || address.trim().length < 3)) {
      newErrors.address = 'يرجى إدخال العنوان بالتفصيل (أقرب نقطة دالة، زقاق، دار).'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleProceedToSummary = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep1()) {
      setStep('summary')
    }
  }

  const handleConfirmOrder = () => {
    if (cartItems.length === 0) {
      toast.error('سلة المشتريات فارغة.')
      return
    }

    startTransition(async () => {
      try {
        const res = await createWhatsAppOrderAction({
          customerName,
          customerPhone,
          province,
          area,
          address,
          deliveryType,
          notes,
          items: cartItems.map(item => ({
            id: item.productId || item.id,
            quantity: item.quantity
          }))
        })

        if (res.error) {
          toast.error(res.error)
          return
        }

        if (res.success && res.whatsappUrl) {
          setCompletedOrder({
            orderNumber: res.orderNumber!,
            whatsappUrl: res.whatsappUrl,
            totalAmount: res.totalAmount!,
            shippingCost: res.shippingCost!,
            subtotal: res.subtotal!
          })

          // Clear local cart storage
          clearCart()

          // Transition to success screen
          setStep('success')

          // Automatically open WhatsApp in a new tab/window
          const newWindow = window.open(res.whatsappUrl, '_blank')
          if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            // Popup blocked fallback notice
            toast.info('تم تجهيز طلبك! يرجى النقر على زر فتح واتساب لإرسال الرسالة.')
          }
        }
      } catch (err) {
        console.error('Submission failed', err)
        toast.error('حدث خطأ أثناء إتمام الطلب، يرجى المحاولة مجدداً.')
      }
    })
  }

  const handleResetAndClose = () => {
    setStep('info')
    setCompletedOrder(null)
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) handleResetAndClose() }}>
      <DialogContent 
        className="max-w-xl w-full p-0 overflow-hidden rounded-3xl bg-white border border-[#E8E4DF] shadow-[0_20px_60px_rgba(0,0,0,0.15)] max-h-[92vh] flex flex-col font-sans"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-l from-[#1C1917] to-[#2B2724] text-white p-5 sm:p-6 shrink-0 relative overflow-hidden">
          {/* Subtle gold decoration aura */}
          <div className="absolute -top-10 -start-10 w-32 h-32 bg-[#C9A96E]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center shrink-0">
                {/* Official WhatsApp SVG Icon */}
                <svg className="w-6 h-6 fill-[#25D366]" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043s.433-.506.549-.68c.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.394-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.881l-1.344 4.912 5.044-1.323c1.402.766 3.003 1.2 4.707 1.2 5.522 0 10-4.477 10-10s-4.478-10-9.671-10z" />
                </svg>
              </div>
              <div>
                <DialogTitle className="text-lg font-black text-white flex items-center gap-2">
                  إتمام الطلب عبر WhatsApp
                </DialogTitle>
                <DialogDescription className="text-xs text-stone-300 mt-0.5">
                  طلب مباشر كضيف • بدون حساب أو كلمة مرور
                </DialogDescription>
              </div>
            </div>

            {/* Stepper indicator */}
            {step !== 'success' && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-400">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'info' ? 'bg-[#C9A96E] text-[#1C1917]' : 'bg-stone-700 text-white'}`}>
                  1
                </span>
                <span className="text-stone-500">─</span>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'summary' ? 'bg-[#C9A96E] text-[#1C1917]' : 'bg-stone-700 text-stone-400'}`}>
                  2
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Body with Scrollable Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">

            {/* STEP 1: Customer & Delivery Info Form */}
            {step === 'info' && (
              <motion.form
                key="step-info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleProceedToSummary}
                className="space-y-4"
              >
                {/* Notice banner */}
                <div className="bg-[#FBF6EE] border border-[#C9A96E]/30 rounded-2xl p-3.5 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#C9A96E] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    أدخل معلوماتك الأساسية لتجهيز الفاتورة وفتح محادثة WhatsApp مباشرة مع فريق المتجر لتأكيد الطلب.
                  </p>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#1C1917] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#C9A96E]" />
                      الاسم الكامل <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      placeholder="مثال: محمد أحمد العراقي"
                      value={customerName}
                      onChange={e => {
                        setCustomerName(e.target.value)
                        if (errors.customerName) setErrors({ ...errors, customerName: '' })
                      }}
                      className={`h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm focus-visible:border-[#C9A96E] focus-visible:ring-[#C9A96E]/20 ${errors.customerName ? 'border-rose-400' : ''}`}
                    />
                    {errors.customerName && (
                      <p className="text-[11px] font-bold text-rose-600">{errors.customerName}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#1C1917] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#C9A96E]" />
                      رقم الهاتف (واتساب) <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      dir="ltr"
                      placeholder="07XXXXXXXXX"
                      value={customerPhone}
                      onChange={e => {
                        setCustomerPhone(e.target.value)
                        if (errors.customerPhone) setErrors({ ...errors, customerPhone: '' })
                      }}
                      className={`h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm text-end focus-visible:border-[#C9A96E] focus-visible:ring-[#C9A96E]/20 ${errors.customerPhone ? 'border-rose-400' : ''}`}
                    />
                    {errors.customerPhone && (
                      <p className="text-[11px] font-bold text-rose-600">{errors.customerPhone}</p>
                    )}
                  </div>
                </div>

                {/* Delivery Method Selection */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#1C1917]">طريقة الاستلام</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('DELIVERY')}
                      className={`p-3 rounded-2xl border text-start transition-all flex items-center gap-3 cursor-pointer ${
                        deliveryType === 'DELIVERY'
                          ? 'border-[#C9A96E] bg-[#FBF6EE] text-[#1C1917] shadow-sm ring-1 ring-[#C9A96E]'
                          : 'border-[#E8E4DF] bg-white text-[#78716C] hover:bg-[#FAFAF8]'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${deliveryType === 'DELIVERY' ? 'bg-[#C9A96E] text-white' : 'bg-[#FAFAF8] text-[#78716C]'}`}>
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold">توصيل للعنوان</p>
                        <p className="text-[10px] text-[#A8A29E]">توصيل للمنزل أو العمل</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType('PICKUP')}
                      className={`p-3 rounded-2xl border text-start transition-all flex items-center gap-3 cursor-pointer ${
                        deliveryType === 'PICKUP'
                          ? 'border-[#C9A96E] bg-[#FBF6EE] text-[#1C1917] shadow-sm ring-1 ring-[#C9A96E]'
                          : 'border-[#E8E4DF] bg-white text-[#78716C] hover:bg-[#FAFAF8]'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${deliveryType === 'PICKUP' ? 'bg-[#C9A96E] text-white' : 'bg-[#FAFAF8] text-[#78716C]'}`}>
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold">استلام من المتجر</p>
                        <p className="text-[10px] text-[#A8A29E]">مجان بدون أجور توصيل</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Province & Area */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#1C1917] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C9A96E]" />
                      المحافظة <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <select
                        value={province}
                        onChange={e => setProvince(e.target.value)}
                        className="w-full h-11 px-3 pe-8 rounded-xl bg-[#FAFAF8] border border-[#E8E4DF] text-sm text-[#1C1917] focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[#C9A96E]/20 appearance-none cursor-pointer"
                      >
                        {IRAQI_PROVINCES.map(prov => (
                          <option key={prov} value={prov}>
                            {prov}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#A8A29E] absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#1C1917]">
                      المنطقة / القضاء <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      placeholder="مثال: حي المنصور / حي الحسين"
                      value={area}
                      onChange={e => {
                        setArea(e.target.value)
                        if (errors.area) setErrors({ ...errors, area: '' })
                      }}
                      className={`h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm focus-visible:border-[#C9A96E] focus-visible:ring-[#C9A96E]/20 ${errors.area ? 'border-rose-400' : ''}`}
                    />
                    {errors.area && (
                      <p className="text-[11px] font-bold text-rose-600">{errors.area}</p>
                    )}
                  </div>
                </div>

                {/* Detailed Address (only for Delivery) */}
                {deliveryType === 'DELIVERY' && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#1C1917]">
                      العنوان بالتفصيل <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      placeholder="أقرب نقطة دالة، اسم الشارع، رقم الزقاق والدار"
                      value={address}
                      onChange={e => {
                        setAddress(e.target.value)
                        if (errors.address) setErrors({ ...errors, address: '' })
                      }}
                      className={`h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm focus-visible:border-[#C9A96E] focus-visible:ring-[#C9A96E]/20 ${errors.address ? 'border-rose-400' : ''}`}
                    />
                    {errors.address && (
                      <p className="text-[11px] font-bold text-rose-600">{errors.address}</p>
                    )}
                  </div>
                )}

                {/* Notes & Special Instructions */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#78716C] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#A8A29E]" />
                    ملاحظات إضافية أو نص كارت الإهداء (اختياري)
                  </Label>
                  <Textarea
                    placeholder="اكتب هنا أي تفاصيل تخص تغليف الهدية أو نص الكارت..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="min-h-[70px] rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-xs focus-visible:border-[#C9A96E] focus-visible:ring-[#C9A96E]/20 resize-none"
                  />
                </div>

                {/* Step 1 Footer CTA */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
                    style={{ background: 'linear-gradient(135deg, #1C1917 0%, #36312D 100%)' }}
                  >
                    مراجعة ملخص الطلب
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </div>
              </motion.form>
            )}

            {/* STEP 2: Order Summary & Review */}
            {step === 'summary' && (
              <motion.div
                key="step-summary"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Customer Snapshot Box */}
                <div className="bg-[#FAFAF8] rounded-2xl p-4 border border-[#E8E4DF] space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8E4DF]">
                    <span className="font-bold text-[#78716C]">العميل المستلم:</span>
                    <span className="font-extrabold text-[#1C1917]">{customerName} ({customerPhone})</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8E4DF]">
                    <span className="font-bold text-[#78716C]">طريقة الاستلام:</span>
                    <span className="font-extrabold text-[#1C1917]">
                      {deliveryType === 'PICKUP' ? 'استلام مباشر من المتجر' : 'توصيل للمنزل'}
                    </span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-[#78716C] shrink-0">العنوان:</span>
                    <span className="font-medium text-[#1C1917] text-end max-w-[280px]">
                      {province}، {area}{deliveryType === 'DELIVERY' && address ? `، ${address}` : ''}
                    </span>
                  </div>
                  {notes && (
                    <div className="pt-2 border-t border-[#E8E4DF] text-[11px] text-[#A07850]">
                      <strong>الملاحظات:</strong> {notes}
                    </div>
                  )}
                </div>

                {/* Items List in Summary */}
                <div className="border border-[#E8E4DF] rounded-2xl p-3 bg-white max-h-48 overflow-y-auto divide-y divide-[#F0ECE6]">
                  {cartItems.map(item => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-[#FAFAF8] border border-[#E8E4DF] relative shrink-0 overflow-hidden">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          ) : (
                            <ShoppingBag className="w-4 h-4 text-[#C9A96E] m-auto" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#1C1917] truncate">{item.name}</p>
                          <p className="text-[11px] text-[#78716C]">
                            الكمية: {item.quantity} × {item.price.toLocaleString('en-US')} د.ع
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-[#1C1917] shrink-0">
                        {(item.price * item.quantity).toLocaleString('en-US')} د.ع
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="bg-[#FBF6EE] rounded-2xl p-4 border border-[#C9A96E]/30 space-y-2 text-xs">
                  <div className="flex justify-between text-[#78716C]">
                    <span>المجموع الفرعي ({cartItems.length} عناصر):</span>
                    <span className="font-bold text-[#1C1917]">{subtotal.toLocaleString('en-US')} د.ع</span>
                  </div>
                  <div className="flex justify-between text-[#78716C]">
                    <span>أجور التوصيل:</span>
                    <span className="font-bold">
                      {calculatedShipping === 0 ? (
                        <span className="text-[#10B981] font-extrabold">مجاني 🎉</span>
                      ) : (
                        `${calculatedShipping.toLocaleString('en-US')} د.ع`
                      )}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#C9A96E]/20 flex justify-between items-center text-sm font-black text-[#1C1917]">
                    <span>الإجمالي الكلي:</span>
                    <span className="text-base text-[#10B981] font-black">
                      {grandTotal.toLocaleString('en-US')} د.ع
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('info')}
                    disabled={isPending}
                    className="w-1/3 h-12 rounded-2xl border-[#E8E4DF] text-xs font-bold text-[#78716C] hover:bg-[#FAFAF8] cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4 me-1.5" />
                    تعديل البيانات
                  </Button>

                  <Button
                    type="button"
                    onClick={handleConfirmOrder}
                    disabled={isPending}
                    className="flex-1 h-12 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl transition-all"
                    style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>جاري تجهيز الطلب...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043s.433-.506.549-.68c.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.394-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.881l-1.344 4.912 5.044-1.323c1.402.766 3.003 1.2 4.707 1.2 5.522 0 10-4.477 10-10s-4.478-10-9.671-10z" />
                        </svg>
                        <span>تأكيد والتحويل إلى WhatsApp</span>
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Success Confirmation Screen */}
            {step === 'success' && completedOrder && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#1C1917] mb-1">
                    تم تجهيز طلبك بنجاح! 🎉
                  </h3>
                  <p className="text-xs text-[#78716C] max-w-sm mx-auto">
                    تم حفظ الطلب في النظام وتجهيز رسالة WhatsApp المنسقة لإرسالها لفريق المتجر.
                  </p>
                </div>

                {/* Order ID Badge */}
                <div className="inline-block bg-[#F8F5F0] border border-[#E8E4DF] rounded-2xl px-5 py-2.5">
                  <p className="text-[11px] text-[#A8A29E] font-bold">رقم الطلب الخاص بك</p>
                  <p className="text-base font-black text-[#1C1917] tracking-wider font-mono">
                    {completedOrder.orderNumber}
                  </p>
                </div>

                {/* Re-open WhatsApp CTA if blocked */}
                <div className="space-y-2 max-w-xs mx-auto pt-2">
                  <Button
                    type="button"
                    onClick={() => window.open(completedOrder.whatsappUrl, '_blank')}
                    className="w-full h-12 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
                    style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    فتح محادثة WhatsApp الآن
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResetAndClose}
                    className="w-full h-10 rounded-2xl text-xs font-bold text-[#78716C] hover:bg-[#FAFAF8] cursor-pointer"
                  >
                    العودة إلى المتجر
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
