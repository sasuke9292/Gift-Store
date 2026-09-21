import { Mail, Phone, MapPin, Clock, MessageCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'اتصل بنا | گفتي بلس',
  description: 'تواصل مع فريق گفتي بلس - نحن هنا لمساعدتك'
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      <section className="relative bg-[#1C1917] text-white py-24 px-4 overflow-hidden">
        <div className="absolute top-0 end-0 w-96 h-96 bg-[#C9A96E]/10 rounded-full blur-[100px]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#C9A96E]/15 border border-[#C9A96E]/25 flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-[#C9A96E]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">اتصل بنا</h1>
          <p className="text-white/60 text-lg">فريقنا مستعد لمساعدتك في أي وقت</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Contact Methods */}
          <div className="space-y-5">
            <h2 className="text-2xl font-black text-[#1C1917] mb-6">طرق التواصل معنا</h2>

            {[
              {
                icon: Phone,
                title: 'الهاتف',
                value: '+964 770 123 4567',
                desc: 'متاح من 9 صباحاً حتى 9 مساءً',
                href: 'tel:+9647701234567',
                color: '#C9A96E',
                bg: '#FBF6EE'
              },
              {
                icon: Mail,
                title: 'البريد الإلكتروني',
                value: 'info@giftstore.iq',
                desc: 'نرد خلال 24 ساعة',
                href: 'mailto:info@giftstore.iq',
                color: '#6366F1',
                bg: '#F5F3FF'
              },
              {
                icon: MapPin,
                title: 'الموقع',
                value: 'بغداد، المنصور',
                desc: 'شارع 14 رمضان، بالقرب من مول المنصور',
                href: '#',
                color: '#E85D75',
                bg: '#FDF2F4'
              },
              {
                icon: Clock,
                title: 'أوقات العمل',
                value: 'السبت – الخميس',
                desc: '9:00 صباحاً – 9:00 مساءً',
                href: '#',
                color: '#10B981',
                bg: '#F0FDF9'
              },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-[#E8E4DF] hover:border-[#C9A96E]/30 hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)] transition-all duration-200 group block"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: item.bg }}>
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#A8A29E] mb-0.5">{item.title}</p>
                  <p className="font-bold text-[#1C1917]">{item.value}</p>
                  <p className="text-sm text-[#78716C]">{item.desc}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Quick Message Form */}
          <div className="bg-white rounded-3xl border border-[#E8E4DF] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
            <h2 className="text-2xl font-black text-[#1C1917] mb-6">أرسل لنا رسالة</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-sm font-bold text-[#1C1917] block mb-1.5">الاسم</label>
                <input
                  type="text"
                  placeholder="اسمك الكامل"
                  className="w-full h-12 px-4 rounded-xl bg-[#FAFAF8] border border-[#E8E4DF] text-[#1C1917] placeholder:text-[#C8C4BE] focus:outline-none focus:border-[#C9A96E]/50 focus:ring-2 focus:ring-[#C9A96E]/15 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-[#1C1917] block mb-1.5">رقم الهاتف</label>
                <input
                  type="tel"
                  placeholder="07XX XXX XXXX"
                  dir="ltr"
                  className="w-full h-12 px-4 rounded-xl bg-[#FAFAF8] border border-[#E8E4DF] text-[#1C1917] placeholder:text-[#C8C4BE] focus:outline-none focus:border-[#C9A96E]/50 focus:ring-2 focus:ring-[#C9A96E]/15 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-[#1C1917] block mb-1.5">رسالتك</label>
                <textarea
                  rows={5}
                  placeholder="اكتب رسالتك هنا..."
                  className="w-full p-4 rounded-xl bg-[#FAFAF8] border border-[#E8E4DF] text-[#1C1917] placeholder:text-[#C8C4BE] focus:outline-none focus:border-[#C9A96E]/50 focus:ring-2 focus:ring-[#C9A96E]/15 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full h-12 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(184,137,58,0.35)]"
                style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
              >
                إرسال الرسالة
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
