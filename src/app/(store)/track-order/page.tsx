import { Package, Search, Phone, Clock, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تتبع الطلب | گفتي بلس',
  description: 'تتبع حالة طلبك من گفتي بلس في الوقت الفعلي'
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      <section className="relative bg-[#1C1917] text-white py-24 px-4 overflow-hidden">
        <div className="absolute top-0 end-0 w-96 h-96 bg-[#C9A96E]/10 rounded-full blur-[100px]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#C9A96E]/15 border border-[#C9A96E]/25 flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-[#C9A96E]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">تتبع طلبك</h1>
          <p className="text-white/60 text-lg">اعرف أين وصل طلبك في أي وقت</p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl border border-[#E8E4DF] p-10 text-center shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
          <div className="w-20 h-20 rounded-full bg-[#FBF6EE] flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-[#C9A96E]/60" />
          </div>
          <h2 className="text-2xl font-black text-[#1C1917] mb-3">تتبع طلبك بسهولة</h2>
          <p className="text-[#78716C] mb-8 leading-relaxed">
            بعد تأكيد طلبك، سنرسل لك رقم التتبع عبر الهاتف. يمكنك التواصل معنا مباشرة للاستفسار عن حالة طلبك.
          </p>

          <div className="grid grid-cols-1 gap-4 mb-8 text-start">
            {[
              { icon: CheckCircle, title: 'طلب مؤكد', desc: 'تم استلام طلبك وهو قيد المعالجة', color: '#10B981', bg: '#F0FDF9' },
              { icon: Package, title: 'جاري التجهيز', desc: 'منتجاتك يتم تجهيزها وتغليفها بعناية', color: '#C9A96E', bg: '#FBF6EE' },
              { icon: Package, title: 'في الطريق إليك', desc: 'المندوب في طريقه لإيصال طلبك', color: '#6366F1', bg: '#F5F3FF' },
            ].map((step) => (
              <div key={step.title} className="flex items-center gap-4 p-4 rounded-2xl border border-[#E8E4DF]">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: step.bg }}>
                  <step.icon className="w-6 h-6" style={{ color: step.color }} />
                </div>
                <div>
                  <p className="font-bold text-[#1C1917]">{step.title}</p>
                  <p className="text-sm text-[#78716C]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#FBF6EE] border border-[#C9A96E]/20 rounded-2xl p-5 mb-6">
            <Phone className="w-6 h-6 text-[#C9A96E] mx-auto mb-2" />
            <p className="font-bold text-[#1C1917] mb-1">تواصل معنا مباشرة</p>
            <p className="text-[#78716C] text-sm mb-3">لمعرفة حالة طلبك اتصل على:</p>
            <a href="tel:+9647701234567" className="text-[#C9A96E] font-black text-lg" dir="rtl">+964 770 123 4567</a>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl font-bold text-[#78716C] border border-[#E8E4DF] hover:bg-[#F5F0EA] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
