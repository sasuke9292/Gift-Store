'use client'

import React from 'react'
import { Sparkles, ArrowLeft, ShieldCheck, Heart } from 'lucide-react'
import { cleanIraqiWhatsAppNumber } from '@/lib/whatsapp'

interface ConciergeWhatsAppCardProps {
  title?: string
  description?: string
  btnText?: string
  whatsappNumber?: string | null
  storeName?: string | null
}

export function ConciergeWhatsAppCard({
  title = 'هل تبحث عن تنسيق هدية خاصة أو بوكس بمواصفات محددة؟',
  description = 'فريقنا المتخصص في تنسيق الهدايا جاهز لمساعدتك عبر واتساب في اختيار القطع، كتابة بطاقة الإهداء، واختيار ألوان التغليف المناسبة.',
  btnText = 'تحدث مع منسق الهدايا عبر واتساب',
  whatsappNumber,
  storeName = 'گِفتي بلس'
}: ConciergeWhatsAppCardProps) {
  const cleanNumber = cleanIraqiWhatsAppNumber(whatsappNumber) || '9647700000000'
  const defaultMsg = `مرحباً ${storeName} 👋\nأرغب في استشارة منسق الهدايا بخصوص تنسيق هدية خاصة أو بوكس مخصص.`
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultMsg)}`

  return (
    <section className="py-12 sm:py-16" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="relative rounded-3xl overflow-hidden p-8 sm:p-12 text-white border border-[#22385e] shadow-[0_20px_50px_rgba(19,33,60,0.25)]"
          style={{ background: 'linear-gradient(135deg, #0c1424 0%, #13213c 50%, #1e3256 100%)' }}
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 end-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 start-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl text-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-black text-amber-300 mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>خدمة التنسيق الخاص VIP</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-4">
              {title}
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-8 max-w-2xl">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 h-13 px-8 rounded-2xl font-black text-white text-sm sm:text-base transition-all duration-200 hover:-translate-y-0.5 shadow-[0_6px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_10px_25px_rgba(16,185,129,0.4)] cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
              >
                <svg className="w-6 h-6 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043s.433-.506.549-.68c.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.394-10.416c-5.523 0-10 4.477-10 10 0 1.77.46 3.432 1.264 4.881l-1.344 4.912 5.044-1.323c1.402.766 3.003 1.2 4.707 1.2 5.522 0 10-4.477 10-10s-4.478-10-9.671-10z" />
                </svg>
                <span>{btnText}</span>
                <ArrowLeft className="w-4 h-4" />
              </a>

              <div className="flex items-center gap-3 text-xs text-white/70">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  مستشار معتمد
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-rose-400" />
                  تنسيق مخصص لكل مناسبة
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
