import React from 'react'

export default function StoreLoading() {
  return (
    <div className="min-h-[85vh] bg-[#F8FAFC] py-8 sm:py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        
        {/* Hero Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          <div className="lg:col-span-7 space-y-4">
            <div className="h-6 w-48 rounded-full bg-slate-200" />
            <div className="h-12 sm:h-16 w-3/4 rounded-2xl bg-slate-200" />
            <div className="h-10 sm:h-12 w-1/2 rounded-2xl bg-slate-200" />
            <div className="h-4 w-5/6 rounded-lg bg-slate-200" />
            <div className="h-4 w-4/6 rounded-lg bg-slate-200" />
            <div className="flex gap-4 pt-4">
              <div className="h-12 w-36 rounded-2xl bg-slate-200" />
              <div className="h-12 w-36 rounded-2xl bg-slate-200" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] rounded-3xl bg-slate-200 border border-slate-300/40" />
          </div>
        </div>

        {/* Trust Badges Ribbon Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-white border border-slate-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                <div className="h-2.5 bg-slate-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>

        {/* Categories Grid Skeleton */}
        <div className="pt-4 space-y-4">
          <div className="h-6 w-40 rounded-lg bg-slate-200" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl bg-slate-200" />
            ))}
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="pt-8 space-y-4">
          <div className="h-6 w-48 rounded-lg bg-slate-200" />
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-3xl bg-white border border-slate-200 p-3.5 space-y-3">
                <div className="aspect-square rounded-2xl bg-slate-200" />
                <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                <div className="h-4 bg-slate-200 rounded-md w-1/2" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
