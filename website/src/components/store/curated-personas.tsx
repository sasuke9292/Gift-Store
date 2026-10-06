'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, ArrowLeft } from 'lucide-react'

export interface PersonaItem {
  id: string
  title: string
  subtitle: string
  tag: string
  image: string
  link: string
  btnText: string
}

interface CuratedPersonasProps {
  badge?: string
  title?: string
  description?: string
  personas?: PersonaItem[]
}

const defaultPersonas: PersonaItem[] = [
  {
    id: 'her',
    title: 'هدايا لها',
    subtitle: 'عطور راقية، مجوهرات وبوكسات دلال',
    tag: 'الأكثر رقة',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
    link: '/category/women',
    btnText: 'اكتشف هداياها'
  },
  {
    id: 'him',
    title: 'هدايا له',
    subtitle: 'ساعات فاخرة، أطقم محافظ ومسابح ملكية',
    tag: 'فخامة وهيبة',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
    link: '/category/men',
    btnText: 'اكتشف هداياه'
  },
  {
    id: 'occasions',
    title: 'مناسبات وأفراح',
    subtitle: 'تخرج، زواج، خطوبة وذكرى سنوية',
    tag: 'لحظات استثنائية',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
    link: '/category/occasions',
    btnText: 'تصفح المناسبات'
  },
  {
    id: 'custom',
    title: 'مخصصة بالاسم',
    subtitle: 'قطع محفورة وتنسيق خاص يخلد الذكرى',
    tag: 'لمسة شخصية',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
    link: '/category/custom',
    btnText: 'صمم هديتك'
  }
]

export function CuratedPersonas({
  badge = 'دليل الإهداء الذكي',
  title = 'هدايا مختارة بعناية لمن تحب',
  description = 'اختر الشخص أو المناسبة لتشاهد مجموعات منتقاة يدوياً بعناية ومغلفة بأعلى درجات الفخامة.',
  personas = defaultPersonas
}: CuratedPersonasProps) {
  const items = personas.length > 0 ? personas : defaultPersonas

  return (
    <section className="py-14 sm:py-20" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13213c]/5 border border-[#13213c]/10 text-xs font-bold text-[#13213c] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
            <span>{badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            {title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {description}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] flex flex-col justify-end p-6 border border-slate-200/80 bg-slate-900 shadow-xs hover:shadow-[0_20px_45px_rgba(19,33,60,0.18)] hover:-translate-y-1.5 transition-all duration-300 text-start"
            >
              {/* Background Image with Zoom */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1424]/95 via-[#0c1424]/40 to-transparent group-hover:from-[#0c1424] transition-colors" />

              {/* Tag Badge */}
              <div className="absolute top-4 start-4 z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-black border border-white/20">
                  {item.tag}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-1.5 group-hover:text-amber-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-white/80 line-clamp-2 leading-relaxed mb-4">
                  {item.subtitle}
                </p>

                {/* Button */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 group-hover:bg-white text-white group-hover:text-[#13213c] text-xs font-black backdrop-blur-md transition-all duration-300">
                  <span>{item.btnText}</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
