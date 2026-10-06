'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Sparkles } from 'lucide-react'

export interface CategoryItem {
  id: string
  name: string
  slug: string
  image?: string | null
  description?: string | null
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  men: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
  women: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
  occasions: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
  custom: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
  kids: 'https://images.unsplash.com/photo-1560859254-809fa84742f3?auto=format&fit=crop&q=80&w=800',
  offers: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800',
  electronics: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
}

function getCategoryFallbackImage(name: string, slug: string): string {
  const text = `${name} ${slug}`.toLowerCase()
  if (text.includes('رجال') || text.includes('men')) return CATEGORY_FALLBACK_IMAGES['men']
  if (text.includes('نسا') || text.includes('women')) return CATEGORY_FALLBACK_IMAGES['women']
  if (text.includes('مناسب') || text.includes('occasion') || text.includes('ورد') || text.includes('بوكس')) return CATEGORY_FALLBACK_IMAGES['occasions']
  if (text.includes('اسم') || text.includes('مخصص') || text.includes('custom')) return CATEGORY_FALLBACK_IMAGES['custom']
  if (text.includes('طفل') || text.includes('أطفال') || text.includes('kids') || text.includes('ألعاب')) return CATEGORY_FALLBACK_IMAGES['kids']
  if (text.includes('عرض') || text.includes('عروض') || text.includes('offer')) return CATEGORY_FALLBACK_IMAGES['offers']
  if (text.includes('إلكترون') || text.includes('سماع')) return CATEGORY_FALLBACK_IMAGES['electronics']
  return CATEGORY_FALLBACK_IMAGES['occasions']
}

export function CategoryCard({ category }: { category: CategoryItem }) {
  const fallback = getCategoryFallbackImage(category.name, category.slug)
  const isBroken = !category.image || category.image.includes('placeholder') || category.image.includes('broken') || category.image.trim() === ''
  const [imgSrc, setImgSrc] = useState(isBroken ? fallback : category.image!)

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/5] flex flex-col justify-end p-3.5 sm:p-5 border border-slate-200/80 bg-slate-100 shadow-xs hover:shadow-[0_16px_36px_rgba(19,33,60,0.14)] hover:-translate-y-1 transition-all duration-300"
    >
      {/* Background Image with smooth zoom */}
      <Image
        src={imgSrc}
        alt={category.name}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        onError={() => setImgSrc(fallback)}
      />

      {/* Layered Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c1424]/90 via-[#0c1424]/40 to-transparent transition-opacity group-hover:from-[#0c1424]/95" />

      {/* Floating Sparkle Icon */}
      <div className="absolute top-3 end-3 w-7 h-7 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
        <Sparkles className="w-3.5 h-3.5 text-blue-200" />
      </div>

      {/* Category Info */}
      <div className="relative z-10 text-start">
        <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider block mb-1">
          قسم حصري
        </span>
        <h3 className="text-white font-black text-sm sm:text-base md:text-lg leading-snug group-hover:text-blue-100 transition-colors line-clamp-1 mb-2">
          {category.name}
        </h3>

        {/* CTA Banner that slides up on hover */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-white/90 group-hover:text-white transition-all transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 duration-300">
          <span>تصفح التشكيلة</span>
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}
