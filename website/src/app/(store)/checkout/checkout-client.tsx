'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  User, 
  Gift, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  ExternalLink,
  MessageCircle,
  CreditCard,
  Banknote,
  RotateCcw
} from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { useMounted } from '@/lib/use-mounted'
import { toast } from 'sonner'
import { createWhatsAppOrderAction } from '@/app/actions/orders'
import { getPublicStoreSettings } from '@/app/actions/admin/settings'

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

export default function CheckoutClient() {
  const router = useRouter()
  const mounted = useMounted()
  const cartItems = useCartStore(state => state.items)
  const clearCart = useCartStore(state => state.clearCart)

  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)

  // Form Fields
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [province, setProvince] = useState('بغداد')
  const [area, setArea] = useState('')
  const [addressDetails, setAddressDetails] = useState('')
  const [giftNote, setGiftNote] = useState('')
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'WHATSAPP' | 'COD'>('WHATSAPP')

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Success state details
  const [orderResult, setOrderResult] = useState<{
    orderNumber: string
    whatsappUrl: string
    totalAmount: number
    shippingCost: number
    subtotal: number
  } | null>(null)

  // Store Settings
  const [settings, setSettings] = useState({
    freeThreshold: 100000,
    shippingCostBaghdad: 5000,
    shippingCostProvinces: 7000,
    currency: 'د.ع',
    whatsappOrderEnabled: true
  })

  useEffect(() => {
    getPublicStoreSettings().then(res => {
      if (res) {
        setSettings({
          freeThreshold: res.freeShippingThreshold ?? 100000,
          shippingCostBaghdad: res.shippingCostBaghdad ?? 5000,
          shippingCostProvinces: res.shippingCostProvinces ?? 7000,
          currency: res.currency || 'د.ع',
          whatsappOrderEnabled: res.whatsappOrderEnabled ?? true
        })
      }
    })
  }, [])

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const isFreeShipping = subtotal >= settings.freeThreshold
  const baseShipping = province.includes('بغداد') ? settings.shippingCostBaghdad : settings.shippingCostProvinces
  const shippingCost = isFreeShipping ? 0 : baseShipping
  const total = subtotal + (cartItems.length > 0 ? shippingCost : 0)

  const validate = () => {
    const errs: Record<string, string> = {}
    const cleanPhone = customerPhone.replace(/\D/g, '')

    if (!customerPhone.trim() || cleanPhone.length < 10) {
      errs.customerPhone = 'يرجى إدخال رقم هاتف واتساب صالح (مثال: 07701234567)'
    }
    if (!province) {
      errs.province = 'يرجى اختيار المحافظة'
    }
    if (!area.trim() || area.trim().length < 2) {
      errs.area = 'يرجى كتابة المنطقة أو الحي'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault()

    if (cartItems.length === 0) {
      toast.error('سلة المشتريات فارغة')
      return
    }

    if (!validate()) {
      toast.error('يرجى التأكد من ملء الحقول المطلوبة')
      return
    }

    const combinedNotes = [
      giftNote.trim() ? `كارت إهداء: "${giftNote.trim()}"` : '',
      deliveryNotes.trim() ? `ملاحظات: ${deliveryNotes.trim()}` : ''
    ].filter(Boolean).join('\n')

    startTransition(async () => {
      try {
        const res = await createWhatsAppOrderAction({
          customerName: customerName.trim() || 'زبون المتجر',
          customerPhone,
          province,
          area,
          address: addressDetails.trim() ? `${area} - ${addressDetails.trim()}` : area,
          deliveryType: 'DELIVERY',
          notes: combinedNotes,
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
          setOrderResult({
            orderNumber: res.orderNumber!,
            whatsappUrl: res.whatsappUrl,
            totalAmount: res.totalAmount!,
            shippingCost: res.shippingCost!,
            subtotal: res.subtotal!
          })

          clearCart()
          setIsSuccess(true)

          // Open WhatsApp in new tab
          window.open(res.whatsappUrl, '_blank')
        }
      } catch (err) {
        console.error('Failed to complete order:', err)
        toast.error('حدث خطأ أثناء معالجة الطلب، يرجى المحاولة مجدداً.')
      }
    })
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 flex items-center justify-center font-sans" dir="rtl">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#13213c] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">جاري تجهيز صفحة إتمام الطلب...</p>
        </div>
      </div>
    )
  }

  // Success Screen
  if (isSuccess && orderResult) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 font-sans" dir="rtl">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center shadow-lg"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-pulse" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              تم تسجيل وتجهيز طلبك بنجاح! 🎉
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mb-6 max-w-md mx-auto">
              تم تسجيل الطلب في نظام المتجر وسيتم تجهيز التغليف الملكي والشحن الفوري
            </p>

            {/* Order Details Card */}
            <div className="bg-slate-50 rounded-2xl p-5 mb-8 text-start border border-slate-200/80 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-xs text-slate-500 font-bold">رقم الطلب:</span>
                <span className="font-mono font-black text-[#13213c] text-base">{orderResult.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-xs text-slate-500 font-bold">رسوم التوصيل:</span>
                <span className="font-bold text-slate-900 text-xs">
                  {orderResult.shippingCost === 0 ? 'مجاني 🎁' : `${orderResult.shippingCost.toLocaleString('en-US')} ${settings.currency}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-bold">الإجمالي الكلي:</span>
                <span className="font-black text-amber-600 text-lg">
                  {orderResult.totalAmount.toLocaleString('en-US')} {settings.currency}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={orderResult.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-13 px-8 rounded-2xl font-black text-white text-sm shadow-[0_6px_20px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-0.5 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
              >
                <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043s.433-.506.549-.68c.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.394-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.881l-1.344 4.912 5.044-1.323c1.402.766 3.003 1.2 4.707 1.2 5.522 0 10-4.477 10-10s-4.478-10-9.671-10z" />
                </svg>
                <span>فتح المحادثة على WhatsApp</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <Link
                href={`/track-order?q=${orderResult.orderNumber}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-13 px-6 rounded-2xl font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 text-sm transition-all"
              >
                <span>تتبع حالة الطلب</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 font-sans" dir="rtl">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">سلتك فارغة</h2>
          <p className="text-slate-500 text-sm mb-6">أضف بعض الهدايا الفاخرة إلى السلة قبل التوجه إلى إتمام الطلب</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl font-black text-white text-sm shadow-xs transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
          >
            <span>استعراض المتجر</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8 text-start">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link href="/" className="hover:text-slate-800 transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-slate-800 transition-colors">السلة</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">إتمام الطلب</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            إتمام الطلب السريع 🎁
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            خطوات مختصرة ومباشرة • بدون تسجيل دخول أو حساب معقد
          </p>
        </div>

        {/* Form and Summary Grid */}
        <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form (Left / Col 7) */}
          <div className="lg:col-span-7 space-y-6 text-start">
            
            {/* Step 1: Customer Info */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#13213c] flex items-center justify-center font-black text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">معلومات العميل والمستلم</h3>
                  <p className="text-xs text-slate-400">للتواصل وتأكيد موعد استلام الهدية</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الاسم الكامل (اختياري)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: علي محمد"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#13213c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    رقم هاتف واتساب <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="0770 123 4567"
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value)
                      if (errors.customerPhone) {
                        setErrors(prev => ({ ...prev, customerPhone: '' }))
                      }
                    }}
                    className={cn(
                      "w-full h-11 px-3.5 rounded-xl bg-slate-50 border text-xs sm:text-sm focus:bg-white focus:outline-none transition-all",
                      errors.customerPhone ? "border-rose-400 bg-rose-50/50" : "border-slate-200 focus:border-[#13213c]"
                    )}
                    dir="ltr"
                  />
                  {errors.customerPhone && (
                    <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.customerPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Destination */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#13213c] flex items-center justify-center font-black text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">عنوان التوصيل</h3>
                  <p className="text-xs text-slate-400">توصيل لكافة محافظات العراق خلال 24 - 48 ساعة</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    المحافظة <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-[#13213c]"
                  >
                    {IRAQI_PROVINCES.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    المنطقة / الحي <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: المنصور / اليرموك"
                    value={area}
                    onChange={(e) => {
                      setArea(e.target.value)
                      if (errors.area) {
                        setErrors(prev => ({ ...prev, area: '' }))
                      }
                    }}
                    className={cn(
                      "w-full h-11 px-3.5 rounded-xl bg-slate-50 border text-xs sm:text-sm focus:bg-white focus:outline-none transition-all",
                      errors.area ? "border-rose-400 bg-rose-50/50" : "border-slate-200 focus:border-[#13213c]"
                    )}
                  />
                  {errors.area && (
                    <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.area}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  أقرب نقطة دالة أو تفاصيل العنوان (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="مثال: قرب مول المنصور / مقابل جامع..."
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#13213c]"
                />
              </div>
            </div>

            {/* Step 3: Gift Packaging & Card Note */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">تغليف ملكي وكارت إهداء مجاني 🎁</h3>
                  <p className="text-xs text-slate-400">سنكتب رسالتك الخاصة بخط يدوي أنيق على كارت فاخر</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  نص كارت الإهداء (إن وُجد)
                </label>
                <textarea
                  rows={2}
                  placeholder="اكتب هنا كلماتك لمن تحب وسنقوم بتضمينها في بوكس الهدية..."
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#13213c] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ملاحظات إضافية للتوصيل
                </label>
                <input
                  type="text"
                  placeholder="مثال: يرجى التوصيل بعد الساعة 4 مساءً..."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#13213c]"
                />
              </div>
            </div>

            {/* Step 4: Payment & Confirmation Method */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-sm">
                  4
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">طريقة التأكيد والدفع</h3>
                  <p className="text-xs text-slate-400">اختر طريقة إتمام الطلب المفضلة لديك</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('WHATSAPP')}
                  className={cn(
                    "p-4 rounded-2xl border text-start transition-all cursor-pointer",
                    paymentMethod === 'WHATSAPP'
                      ? "bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs"
                      : "bg-slate-50/60 border-slate-200 hover:border-slate-300"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-emerald-800">تأكيد فوري عبر WhatsApp</span>
                    <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full">موصى به</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    توليد رسالة تفصيلية منظمة تتضمن الطلب والعنوان لتأكيدها مباشرة مع خدمة العملاء
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={cn(
                    "p-4 rounded-2xl border text-start transition-all cursor-pointer",
                    paymentMethod === 'COD'
                      ? "bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-xs"
                      : "bg-slate-50/60 border-slate-200 hover:border-slate-300"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-900">الدفع نقداً عند الاستلام</span>
                    <Banknote className="w-4 h-4 text-slate-500" />
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    عاين هديتك وتأكد من سلامة التغليف قبل دفع المبلغ لمندوب التوصيل
                  </p>
                </button>
              </div>
            </div>

          </div>

          {/* Sidebar Summary (Right / Col 5) */}
          <div className="lg:col-span-5 sticky top-28 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs text-start">
              <h3 className="font-black text-slate-900 text-lg mb-4">ملخص الطلب</h3>

              {/* Items List */}
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mb-4 pe-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <Gift className="w-5 h-5 text-slate-400 m-auto" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400">الكمية: {item.quantity}</p>
                    </div>
                    <div className="text-end shrink-0">
                      <p className="text-xs font-black text-[#13213c]">
                        {(item.price * item.quantity).toLocaleString('en-US')} {settings.currency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Summary */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>المجموع الفرعي ({cartItems.length} منتجات)</span>
                  <span className="font-bold text-slate-900">{subtotal.toLocaleString('en-US')} {settings.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>أجور التوصيل ({province})</span>
                  <span className="font-bold">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-600 font-black">مجاني 🎉</span>
                    ) : `${shippingCost.toLocaleString('en-US')} ${settings.currency}`}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-slate-100 text-slate-900">
                  <span className="text-sm font-black">الإجمالي الكلي</span>
                  <span className="text-2xl font-black text-amber-600">
                    {total.toLocaleString('en-US')} <span className="text-xs font-bold text-slate-400">{settings.currency}</span>
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-14 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2.5 shadow-[0_6px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.4)] transition-all hover:-translate-y-0.5 disabled:opacity-70 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
                >
                  {isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>جاري إرسال وتجهيز الطلب...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 fill-white shrink-0" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043s.433-.506.549-.68c.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.394-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.881l-1.344 4.912 5.044-1.323c1.402.766 3.003 1.2 4.707 1.2 5.522 0 10-4.477 10-10s-4.478-10-9.671-10z" />
                      </svg>
                      <span>تأكيد الطلب عبر WhatsApp</span>
                      <ArrowLeft className="w-4 h-4 ms-auto" />
                    </>
                  )}
                </button>
              </div>

              {/* Guarantees */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-around text-[11px] text-slate-500">
                <span className="flex items-center gap-1">🔒 طلب مباشر آمن</span>
                <span className="flex items-center gap-1">📦 شحن وتغليف ملكي</span>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  )
}
