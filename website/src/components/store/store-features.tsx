'use client'

import React from 'react'
import { Truck, Gift, ShieldCheck, Sparkles } from 'lucide-react'

interface StoreFeaturesProps {
  feature1?: { title: string; desc: string }
  feature2?: { title: string; desc: string }
  feature3?: { title: string; desc: string }
  feature4?: { title: string; desc: string }
}

export function StoreFeatures({
  feature1 = {
    title: 'شحن سريع وموثوق',
    desc: 'توصيل لكافة محافظات العراق خلال 24 - 48 ساعة مع تتبع فوري للشحنة'
  },
  feature2 = {
    title: 'تغليف ملكي فاخر',
    desc: 'علب هدايا فاخرة مع أشرطة حريرية وكارت إهداء بكلماتك مجاناً مع كل طلب'
  },
  feature3 = {
    title: 'دفع آمن عند الاستلام',
    desc: 'عاين هديتك وافحصها قبل الاستلام، مع خيارات دفع بـ زين كاش والماستر كارد'
  },
  feature4 = {
    title: 'مستشار هدايا ذكي',
    desc: 'خوارزمية ذكية وفريق متخصص يساعدك في اختيار الهدية المثالية لأي مناسبة'
  }
}: StoreFeaturesProps) {
  const features = [
    {
      icon: Truck,
      title: feature1.title,
      desc: feature1.desc,
      color: 'text-[#13213c]',
      bg: 'bg-blue-50/80',
      border: 'border-blue-100'
    },
    {
      icon: Gift,
      title: feature2.title,
      desc: feature2.desc,
      color: 'text-[#d97706]',
      bg: 'bg-amber-50/80',
      border: 'border-amber-100'
    },
    {
      icon: ShieldCheck,
      title: feature3.title,
      desc: feature3.desc,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50/80',
      border: 'border-emerald-100'
    },
    {
      icon: Sparkles,
      title: feature4.title,
      desc: feature4.desc,
      color: 'text-[#1e3256]',
      bg: 'bg-slate-100/80',
      border: 'border-slate-200/80'
    }
  ]

  return (
    <section className="py-12 sm:py-16 bg-white border-y border-slate-200/70" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(19,33,60,0.06)] hover:-translate-y-0.5 transition-all text-start"
              >
                <div className={`w-12 h-12 rounded-2xl ${feat.bg} ${feat.border} border flex items-center justify-center shrink-0`}>
                  <Icon className={`w-6 h-6 ${feat.color}`} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
