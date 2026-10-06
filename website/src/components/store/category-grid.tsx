'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { CategoryCard, CategoryItem } from './category-card'

interface CategoryGridProps {
  categories: CategoryItem[]
  title?: string
  badge?: string
}

export function CategoryGrid({
  categories,
  title = 'تصفح الهدايا حسب الأقسام',
  badge = 'كتالوج التشكيلات الراقية'
}: CategoryGridProps) {
  if (!categories || categories.length === 0) return null

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 text-start">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13213c]/5 border border-[#13213c]/10 text-xs font-bold text-[#13213c] mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#13213c]" />
              <span>{badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {title}
            </h2>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#13213c] hover:text-[#22385e] transition-colors group self-start sm:self-auto"
          >
            <span>عرض كافة الأقسام</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  )
}
