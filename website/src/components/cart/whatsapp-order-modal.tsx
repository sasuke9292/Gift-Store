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
  Phone, 
  Truck, 
  CheckCircle2, 
  ExternalLink,
  Loader2,
  Sparkles,
  Gift,
  ChevronDown,
  X
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

  const [isPending, startTransition] = useTransition()
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Minimal Essential Form State (No Full Name, No Store Pickup)
  const [customerPhone, setCustomerPhone] = useState('')
  const [province, setProvince] = useState('بغداد')
  const [address, setAddress] = useState('')
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

  // Pricing Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const isFreeShipping = subtotal >= shippingSettings.freeThreshold
  const baseShipping = province.includes('بغداد')
    ? shippingSettings.shippingCostBaghdad
    : shippingSettings.shippingCostProvinces
  const shippingCost = isFreeShipping ? 0 : baseShipping
  const grandTotal = subtotal + shippingCost

  const validate = () => {
    const newErrors: Record<string, string> = {}
    const cleanPhone = customerPhone.replace(/\D/g, '')

    if (!customerPhone.trim() || cleanPhone.length < 10) {
      newErrors.customerPhone = 'يرجى إدخال رقم هاتف واتساب صحيح (مثال: 07701234567)'
    }
    if (!province.trim()) {
      newErrors.province = 'يرجى اختيار المحافظة'
    }
    if (!address.trim() || address.trim().length < 3) {
      newErrors.address = 'يرجى كتابة المنطقة وأقرب نقطة دالة للتوصيل'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault()

    if (cartItems.length === 0) {
      toast.error('سلة المشتريات فارغة')
      return
    }

    if (!validate()) {
      return
    }

    startTransition(async () => {
      try {
        const res = await createWhatsAppOrderAction({
          customerName: 'زبون المتجر',
          customerPhone,
          province,
          area: address,
          address,
          deliveryType: 'DELIVERY',
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

          clearCart()
          setIsSubmitted(true)

          // Open WhatsApp immediately
          const newWindow = window.open(res.whatsappUrl, '_blank')
          if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            toast.info('تم تجهيز طلبك! اضغط على زر فتح واتساب لإرسال الرسالة مباشرة.')
          }
        }
      } catch (err) {
        console.error('Submission failed', err)
        toast.error('حدث خطأ أثناء إتمام الطلب، يرجى المحاولة مجدداً.')
      }
    })
  }

  const handleResetAndClose = () => {
    setIsSubmitted(false)
    setCompletedOrder(null)
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) handleResetAndClose() }}>
      <DialogContent 
        showCloseButton={false}
        className="max-w-lg w-full p-0 overflow-hidden rounded-3xl bg-white border border-[#E8E4DF] shadow-[0_20px_60px_rgba(0,0,0,0.15)] max-h-[94vh] flex flex-col font-sans"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-l from-[#1C1917] via-[#2A2624] to-[#1C1917] text-white p-5 shrink-0 relative overflow-hidden">
          <div className="absolute -top-10 -start-10 w-32 h-32 bg-[#25D366]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-6 h-6 fill-[#25D366]" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043s.433-.506.549-.68c.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.394-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.881l-1.344 4.912 5.044-1.323c1.402.766 3.003 1.2 4.707 1.2 5.522 0 10-4.477 10-10s-4.478-10-9.671-10z" />
                </svg>
              </div>
              <div>
                <DialogTitle className="text-lg font-black text-white flex items-center gap-2">
                  إتمام الطلب السريع عبر WhatsApp
                </DialogTitle>
                <DialogDescription className="text-xs text-[#13213c] font-medium mt-0.5">
                  توصيل مباشر لباب بيتك • بدون حساب أو كلمة مرور
                </DialogDescription>
              </div>
            </div>

            {/* Cancel / Close Button */}
            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500/25 active:scale-90 text-white/80 hover:text-white flex items-center justify-center transition-all border border-white/15 hover:border-red-400/40 cursor-pointer shrink-0 shadow-xs"
              title="إلغاء وإغلاق"
              aria-label="إلغاء وإغلاق"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              /* ONE-STEP SIMPLE ORDER FORM */
              <motion.form 
                key="order-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmitOrder} 
                className="space-y-5"
              >
                {/* 1. Compact Order Preview Card */}
                <div className="bg-[#FAF8F5] border border-[#E8E4DF] rounded-2xl p-3.5">
                  <div className="flex items-center justify-between text-xs text-[#78716C] mb-2 pb-2 border-b border-[#E8E4DF]/60">
                    <span className="font-bold flex items-center gap-1 text-[#1C1917]">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#13213c]" />
                      المنتجات ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
                    </span>
                    <span>
                      التوصيل: {shippingCost === 0 ? <strong className="text-emerald-600 font-black">مجاني 🎁</strong> : `${shippingCost.toLocaleString('en-US')} ${shippingSettings.currency}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#78716C]">المجموع الكلي المطلوب:</span>
                    <span className="text-lg font-black text-[#1C1917]">
                      {grandTotal.toLocaleString('en-US')}{' '}
                      <span className="text-xs font-bold text-[#13213c]">{shippingSettings.currency}</span>
                    </span>
                  </div>
                </div>

                {/* 2. Phone Number (WhatsApp) */}
                <div>
                  <Label className="block text-xs font-bold text-[#1C1917] mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>رقم الهاتف (واتساب) للتوصيل</span>
                      <span className="text-red-500">*</span>
                    </span>
                    <span className="text-[10px] text-[#78716C] font-normal">للتواصل وتأكيد موعد الاستلام</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="tel"
                      dir="ltr"
                      placeholder="07XXXXXXXXX"
                      value={customerPhone}
                      onChange={e => {
                        setCustomerPhone(e.target.value)
                        if (errors.customerPhone) setErrors(prev => ({ ...prev, customerPhone: '' }))
                      }}
                      className={`h-11 rounded-xl text-start font-mono bg-[#FAFAF8] border-[#E8E4DF] text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus-visible:ring-[#25D366]/30 focus-visible:border-[#25D366] ${errors.customerPhone ? 'border-red-500 ring-2 ring-red-500/10' : ''}`}
                    />
                  </div>
                  {errors.customerPhone && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1">
                      {errors.customerPhone}
                    </p>
                  )}
                </div>

                {/* 3. Governorate / Province */}
                <div>
                  <Label className="block text-xs font-bold text-[#1C1917] mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#13213c]" />
                      <span>المحافظة</span>
                      <span className="text-red-500">*</span>
                    </span>
                    <span className="text-[10px] text-[#13213c] font-bold">
                      {province.includes('بغداد') 
                        ? `أجور توصيل بغداد: ${shippingSettings.shippingCostBaghdad.toLocaleString('en-US')} ${shippingSettings.currency}`
                        : `أجور توصيل المحافظات: ${shippingSettings.shippingCostProvinces.toLocaleString('en-US')} ${shippingSettings.currency}`}
                    </span>
                  </Label>
                  <div className="relative">
                    <select
                      value={province}
                      onChange={e => setProvince(e.target.value)}
                      className="w-full h-11 px-3.5 pe-9 rounded-xl text-xs font-bold bg-[#FAFAF8] border border-[#E8E4DF] text-[#1C1917] focus:outline-none focus:border-[#13213c] focus:ring-2 focus:ring-[#13213c]/20 transition-all appearance-none cursor-pointer"
                    >
                      {IRAQI_PROVINCES.map(prov => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#78716C] absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 4. Area & Detailed Address */}
                <div>
                  <Label className="block text-xs font-bold text-[#1C1917] mb-1.5 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#13213c]" />
                    <span>المنطقة وأقرب نقطة دالة</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="مثال: المنصور، شارع 14 رمضان، قرب المول"
                    value={address}
                    onChange={e => {
                      setAddress(e.target.value)
                      if (errors.address) setErrors(prev => ({ ...prev, address: '' }))
                    }}
                    className={`h-11 rounded-xl text-start bg-[#FAFAF8] border-[#E8E4DF] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus-visible:ring-[#13213c]/30 focus-visible:border-[#13213c] ${errors.address ? 'border-red-500 ring-2 ring-red-500/10' : ''}`}
                  />
                  {errors.address && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* 5. Gift Card Note / Special Instructions */}
                <div>
                  <Label className="block text-xs font-bold text-[#1C1917] mb-1.5 flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-[#E85D75]" />
                    <span>نص كارت الإهداء أو ملاحظات (اختياري)</span>
                  </Label>
                  <Textarea
                    rows={2}
                    placeholder="اكتب هنا ما ترغب بطباعته على كارت الهدية الملكي المجاني..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-xs resize-none placeholder:text-[#A8A29E] focus-visible:ring-[#13213c]/30 focus-visible:border-[#13213c]"
                  />
                </div>

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-13 py-3 rounded-2xl font-black text-white text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-[0_6px_20px_rgba(37,211,102,0.35)] hover:shadow-[0_8px_25px_rgba(37,211,102,0.45)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري تجهيز الطلب...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043s.433-.506.549-.68c.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.394-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.881l-1.344 4.912 5.044-1.323c1.402.766 3.003 1.2 4.707 1.2 5.522 0 10-4.477 10-10s-4.478-10-9.671-10z" />
                        </svg>
                        <span>تأكيد وإرسال الطلب عبر WhatsApp</span>
                        <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-lg ms-1 font-mono">
                          {grandTotal.toLocaleString('en-US')} {shippingSettings.currency}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            ) : (
              /* SUCCESS STATE */
              <motion.div
                key="order-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#1C1917] mb-1">
                    تم تجهيز طلبك بنجاح!
                  </h3>
                  <p className="text-xs text-[#78716C]">
                    رقم الطلب الخاص بك: <span className="font-mono font-bold text-[#1C1917] select-all">{completedOrder?.orderNumber}</span>
                  </p>
                </div>

                {completedOrder && (
                  <div className="bg-[#FAF8F5] border border-[#E8E4DF] rounded-2xl p-4 text-xs space-y-2 max-w-sm mx-auto">
                    <div className="flex justify-between text-[#78716C]">
                      <span>المجموع الفرعي:</span>
                      <span>{completedOrder.subtotal.toLocaleString('en-US')} {shippingSettings.currency}</span>
                    </div>
                    <div className="flex justify-between text-[#78716C]">
                      <span>أجور التوصيل:</span>
                      <span>{completedOrder.shippingCost === 0 ? 'مجاني 🎁' : `${completedOrder.shippingCost.toLocaleString('en-US')} ${shippingSettings.currency}`}</span>
                    </div>
                    <div className="flex justify-between font-black text-sm text-[#1C1917] pt-2 border-t border-[#E8E4DF]">
                      <span>المجموع الكلي:</span>
                      <span className="text-gold">{completedOrder.totalAmount.toLocaleString('en-US')} {shippingSettings.currency}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 space-y-2.5 max-w-sm mx-auto">
                  {completedOrder?.whatsappUrl && (
                    <a
                      href={completedOrder.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-12 rounded-xl font-black text-white text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:brightness-110 cursor-pointer"
                      style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>فتح محادثة WhatsApp وإرسال الطلب</span>
                    </a>
                  )}

                  <Button
                    onClick={handleResetAndClose}
                    variant="outline"
                    className="w-full h-11 rounded-xl border-[#E8E4DF] text-[#78716C] text-xs font-bold hover:bg-[#F5F0EA]"
                  >
                    إغلاق والعودة للتسوق
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
