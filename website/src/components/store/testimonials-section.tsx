'use client'

import React from 'react'
import { Star, CheckCircle2, Sparkles, Quote } from 'lucide-react'

export interface TestimonialItem {
  id: number | string
  name: string
  city: string
  text: string
  rating: number
  gift: string
}

const defaultTestimonials: TestimonialItem[] = [
  {
    id: 1,
    name: 'مريم العبيدي',
    city: 'بغداد - المنصور',
    text: 'التغليف فوق الخيال وجودة العطر والساعة أصلية 100%. شكراً على الاهتمام بأدق التفاصيل والسرعة في التوصيل!',
    rating: 5,
    gift: 'بوكس نسائي متكامل'
  },
  {
    id: 2,
    name: 'حيدر الكرخي',
    city: 'النجف الأشرف',
    text: 'أفضل متجر هدايا تعاملت معه في العراق. طلبت هدية تخرج ووصلتني بنفس اليوم مغلفة بكرت شخصي أنيق جداً.',
    rating: 5,
    gift: 'ساعة يد ومحفظة جلد'
  },
  {
    id: 3,
    name: 'سارة البرزنجي',
    city: 'أربيل',
    text: 'مستشار الهدايا ساعدني جداً بالاختيار. خدمة العملاء راقية ومهنية والمنتج كان طبق الأصل من الصور تماماً.',
    rating: 5,
    gift: 'طقم مجوهرات وعطر'
  },
]

export function TestimonialsSection({
  testimonials = defaultTestimonials
}: {
  testimonials?: TestimonialItem[]
}) {
  return (
    <section className="py-14 sm:py-20 bg-white border-t border-slate-200/70" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13213c]/5 border border-[#13213c]/10 text-xs font-bold text-[#13213c] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
            <span>آراء وتجارب حقيقية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            ثقة نفخر بها من عملائنا
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            نسعد بمشاركة أجمل اللحظات وصناعة ذكريات تدوم لدى آلاف العائلات في كافة المحافظات
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="relative p-6 sm:p-7 rounded-3xl bg-[#F8FAFC] border border-slate-200/80 hover:border-slate-300 hover:shadow-[0_12px_30px_rgba(19,33,60,0.06)] hover:-translate-y-1 transition-all flex flex-col justify-between text-start"
            >
              <div className="mb-4">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-[#13213c]/10 mb-2 -scale-x-100" />

                {/* Text */}
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  &ldquo;{item.text}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-black text-slate-900 text-sm">{item.name}</p>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{item.city}</p>
                </div>
                <span className="text-[10px] font-bold text-[#13213c] bg-white px-2.5 py-1 rounded-lg border border-slate-200/80">
                  {item.gift}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
