'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, 
  Search, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle, 
  XCircle, 
  ArrowLeft, 
  MessageCircle,
  ShoppingBag,
  ExternalLink,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { trackOrderPublicAction } from '@/app/actions/orders'

interface TrackOrderClientProps {
  storePhone?: string | null
  storeName?: string
  whatsappNumber?: string | null
}

const ORDER_STEPS = [
  { key: 'PENDING', title: 'تم استلام الطلب', desc: 'تم تسجيل طلبك وهو قيد المراجعة والتدقيق' },
  { key: 'PROCESSING', title: 'التجهيز والتغليف الملكي', desc: 'يتم تجهيز المنتجات ووضعها بعلبة الهدايا الفاخرة' },
  { key: 'SHIPPED', title: 'في الطريق مع المندوب', desc: 'شحنتك خرجت مع مندوب التوصيل لباب بيتك' },
  { key: 'DELIVERED', title: 'تم التوصيل بنجاح', desc: 'نتمنى أن تنال الهدية إعجاب من تحب 🎉' },
]

function getStepIndex(status: string): number {
  switch (status) {
    case 'PENDING':
      return 0
    case 'PROCESSING':
      return 1
    case 'SHIPPED':
      return 2
    case 'DELIVERED':
      return 3
    default:
      return 0
  }
}

export function TrackOrderClient({ storePhone, storeName = 'گِفتي بلس', whatsappNumber }: TrackOrderClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [order, setOrder] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const effectivePhone = storePhone || '+964 770 123 4567'
  const rawWa = whatsappNumber || '9647700000000'
  const cleanWa = rawWa.replace(/\D/g, '')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setError(null)
    setSearched(true)

    try {
      const res = await trackOrderPublicAction(searchQuery.trim())
      if (res.success && res.order) {
        setOrder(res.order)
      } else {
        setOrder(null)
        setError(res.error || 'لم نتمكن من العثور على الطلب.')
      }
    } catch {
      setError('حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.')
      setOrder(null)
    } finally {
      setIsLoading(false)
    }
  }

  const currentStep = order ? getStepIndex(order.status) : 0
  const isCancelled = order?.status === 'CANCELLED'

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24 font-sans text-start" dir="rtl">
      
      {/* Top Hero Section */}
      <section className="relative bg-[#0c1424] text-white py-20 px-4 overflow-hidden text-center">
        <div className="absolute top-0 end-0 w-96 h-96 bg-[#22385e]/25 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 start-0 w-80 h-80 bg-[#13213c]/30 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#22385e]/40 border border-[#3b5e94]/40 flex items-center justify-center mx-auto mb-5 shadow-lg">
            <Package className="w-8 h-8 text-[#7ea6e6]" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 tracking-tight">تتبع حالة طلبك</h1>
          <p className="text-white/60 text-sm sm:text-base max-w-lg mx-auto">
            أدخل رقم الطلب أو رقم الهاتف المسجل لمعرفة موعد ومرحلة توصيل هديتك بدقة
          </p>

          {/* Search Box Card */}
          <div className="mt-8 max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="relative flex flex-col sm:flex-row gap-2.5 p-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-[#13213c] absolute start-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="رقم الطلب (مثال: ORD-2026...) أو رقم الهاتف"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 ps-12 pe-4 rounded-xl bg-white text-[#1C1917] placeholder:text-[#A8A29E] text-sm font-semibold outline-none focus:ring-2 focus:ring-[#13213c]"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !searchQuery.trim()}
                className="h-12 px-6 rounded-xl font-bold text-white text-sm transition-all hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري البحث...</span>
                  </>
                ) : (
                  <>
                    <span>تتبع الآن</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        
        {/* Results Container */}
        <AnimatePresence mode="wait">
          {order && (
            <motion.div
              key="order-result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl border border-[#E8E4DF] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden mb-8"
            >
              {/* Order Header Summary */}
              <div className="p-6 sm:p-8 border-b border-[#E8E4DF] bg-[#FAF7F2]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-black bg-white px-3 py-1 rounded-lg border border-[#E8E4DF] text-[#1C1917]">
                        #{order.orderNumber}
                      </span>
                      <span className="text-xs text-[#78716C] font-semibold">{order.date}</span>
                    </div>
                    <h3 className="text-xl font-black text-[#1C1917] mt-2">
                      مرحباً {order.customerName} 👋
                    </h3>
                    <p className="text-xs text-[#78716C] mt-0.5">
                      عنوان التوصيل: {order.province} {order.area ? `• ${order.area}` : ''}
                    </p>
                  </div>

                  <div className="sm:text-end bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-[#E8E4DF]">
                    <span className="text-xs text-[#A8A29E] font-bold block">القيمة الإجمالية</span>
                    <span className="text-2xl font-black text-[#13213c]">
                      {order.total.toLocaleString('en-US')}{' '}
                      <span className="text-xs font-normal text-[#78716C]">د.ع</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Stepper / Cancelled Alert */}
              <div className="p-6 sm:p-8">
                {isCancelled ? (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm">تم إلغاء هذا الطلب</h4>
                      <p className="text-xs text-rose-600 mt-0.5">يرجى التواصل معنا عبر واتساب للمزيد من التفاصيل أو لطلب بديل.</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-xs font-bold text-[#A8A29E] uppercase tracking-wider mb-6">مراحل الشحنة والتوصيل</h4>
                    <div className="relative">
                      {/* Progress Line */}
                      <div className="absolute top-5 start-5 end-5 h-1 bg-[#E8E4DF] -z-0 hidden sm:block">
                        <div 
                          className="h-full bg-[#13213c] transition-all duration-700 rounded-full"
                          style={{ width: `${(currentStep / (ORDER_STEPS.length - 1)) * 100}%` }}
                        />
                      </div>

                      {/* Step Nodes */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
                        {ORDER_STEPS.map((step, idx) => {
                          const isDone = idx < currentStep
                          const isCurrent = idx === currentStep
                          return (
                            <div key={step.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                              <div 
                                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-black text-xs transition-all ${
                                  isDone 
                                    ? 'bg-[#10B981] text-white shadow-sm'
                                    : isCurrent
                                      ? 'bg-[#13213c] text-white ring-4 ring-[#13213c]/20 shadow-md scale-105'
                                      : 'bg-[#FAFAF8] text-[#A8A29E] border border-[#E8E4DF]'
                                }`}
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-5 h-5 text-white" />
                                ) : isCurrent ? (
                                  <Clock className="w-5 h-5 text-white animate-pulse" />
                                ) : (
                                  idx + 1
                                )}
                              </div>
                              <div>
                                <p className={`text-xs font-black ${isCurrent ? 'text-[#1C1917]' : isDone ? 'text-[#10B981]' : 'text-[#78716C]'}`}>
                                  {step.title}
                                </p>
                                <p className="text-[11px] text-[#A8A29E] hidden sm:block mt-1 leading-snug">
                                  {step.desc}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Items Summary Accordion */}
                <div className="mt-8 pt-6 border-t border-[#F0ECE6]">
                  <h4 className="text-xs font-bold text-[#A8A29E] uppercase tracking-wider mb-3">
                    محتويات الهدية ({order.itemsCount} منتج)
                  </h4>
                  <div className="divide-y divide-[#F5F0EA] bg-[#FAFAF8] rounded-2xl p-4 border border-[#E8E4DF]/70">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-[#13213c]" />
                          <span className="font-bold text-[#1C1917]">{item.name}</span>
                          <span className="text-[#A8A29E]">× {item.quantity}</span>
                        </div>
                        <span className="font-black text-[#1C1917]">
                          {(item.price * item.quantity).toLocaleString('en-US')} د.ع
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick WhatsApp Support Action */}
                <div className="mt-6 pt-6 border-t border-[#F0ECE6] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-[#78716C]">هل لديك استفسار خاص حول هذا الطلب؟</p>
                  <a
                    href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(`السلام عليكم، بخصوص طلبي رقم ${order.orderNumber}:`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto h-11 px-5 rounded-xl font-bold text-white text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>تحدث مع خدمة العملاء عبر WhatsApp</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error / Not Found Message */}
          {error && (
            <motion.div
              key="error-box"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-3xl border border-red-200 p-8 text-center shadow-sm mb-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4 border border-rose-100">
                <AlertCircle className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-lg font-black text-[#1C1917] mb-2">{error}</h3>
              <p className="text-xs text-[#78716C] max-w-md mx-auto mb-6 leading-relaxed">
                تأكد من إدخال رقم الطلب بالصيغة الصحيحة (مثل: ORD-2026...) أو رقم الهاتف الذي استخدمته عند الشراء. يمكنك دائماً مراجعة خدمة العملاء وسيسعدهم مساعدتك فوراً.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`tel:${effectivePhone.replace(/\s+/g, '')}`}
                  className="h-10 px-5 rounded-xl bg-[#FAFAF8] border border-[#E8E4DF] text-xs font-bold text-[#1C1917] hover:bg-[#F5F0EA] flex items-center gap-2"
                  dir="ltr"
                >
                  <Phone className="w-3.5 h-3.5 text-[#13213c]" />
                  <span>{effectivePhone}</span>
                </a>
                <a
                  href={`https://wa.me/${cleanWa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 flex items-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>دعم WhatsApp</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* How It Works Explainer Guide */}
        <div className="bg-white rounded-3xl border border-[#E8E4DF] p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <h3 className="text-base font-black text-[#1C1917] mb-4 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#13213c]" />
            كيف تتم معالجة وتوصيل هديتك؟
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]">
              <div className="w-8 h-8 rounded-xl bg-[#F0F4F9] flex items-center justify-center text-[#13213c] font-black text-xs mb-3">
                1
              </div>
              <h4 className="font-bold text-xs text-[#1C1917] mb-1">المراجعة والتأكيد</h4>
              <p className="text-[11px] text-[#78716C] leading-relaxed">
                يتم فحص تفاصيل الهدية والعنوان، ويصلك إشعار فوري عبر WhatsApp برقم الشحنة.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]">
              <div className="w-8 h-8 rounded-xl bg-[#FDF2F4] flex items-center justify-center text-[#E85D75] font-black text-xs mb-3">
                2
              </div>
              <h4 className="font-bold text-xs text-[#1C1917] mb-1">التغليف الملكي</h4>
              <p className="text-[11px] text-[#78716C] leading-relaxed">
                تُغلف الهدية يدوياً بأشرطة حريرية مع طباعة رسالتك الشخصية على كارت مجاني أنيق.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]">
              <div className="w-8 h-8 rounded-xl bg-[#F0FDF9] flex items-center justify-center text-[#10B981] font-black text-xs mb-3">
                3
              </div>
              <h4 className="font-bold text-xs text-[#1C1917] mb-1">الشحن والتسليم</h4>
              <p className="text-[11px] text-[#78716C] leading-relaxed">
                يصلك المندوب لباب بيتك خلال 24 - 48 ساعة في بغداد وكافة محافظات العراق.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#F0ECE6] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#13213c]" />
              <span className="text-xs text-[#78716C]">خدمة العملاء متوفرة يومياً:</span>
              <a href={`tel:${effectivePhone.replace(/\s+/g, '')}`} className="text-xs font-bold text-[#1C1917] hover:text-[#13213c]" dir="ltr">
                {effectivePhone}
              </a>
            </div>

            <Link
              href="/shop"
              className="text-xs font-bold text-[#13213c] hover:underline flex items-center gap-1"
            >
              <span>تصفح المزيد من الهدايا</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
