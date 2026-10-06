'use client'

import React from 'react'

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden flex flex-col h-full animate-pulse p-0">
      {/* Image Skeleton */}
      <div className="aspect-square bg-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>
      
      {/* Details Skeleton */}
      <div className="p-4 flex-1 flex flex-col gap-2.5">
        <div className="h-3 w-16 bg-slate-200 rounded-full" />
        <div className="h-4 w-4/5 bg-slate-200 rounded-lg" />
        <div className="h-4 w-3/5 bg-slate-200 rounded-lg" />
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="h-5 w-20 bg-slate-200 rounded-md" />
          <div className="h-8 w-16 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className="rounded-2xl sm:rounded-3xl aspect-[4/5] bg-slate-200 animate-pulse relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      <div className="absolute inset-x-4 bottom-4 space-y-1.5">
        <div className="h-2.5 w-10 bg-slate-300 rounded-full" />
        <div className="h-4 w-24 bg-slate-300 rounded-lg" />
      </div>
    </div>
  )
}

export function ProductDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse" dir="rtl">
      <div className="h-4 w-48 bg-slate-200 rounded-md mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="aspect-square bg-slate-200 rounded-3xl" />
        <div className="space-y-4">
          <div className="h-3 w-20 bg-slate-200 rounded-full" />
          <div className="h-8 w-3/4 bg-slate-200 rounded-xl" />
          <div className="h-4 w-32 bg-slate-200 rounded-md" />
          <div className="h-8 w-40 bg-slate-200 rounded-lg" />
          <div className="h-20 w-full bg-slate-100 rounded-2xl" />
          <div className="h-14 w-full bg-slate-200 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
