import React from 'react'

export default function StoreLoading() {
  return (
    <div className="min-h-[80vh] bg-[#FAFAF8] py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        
        {/* Hero / Header Skeleton */}
        <div className="h-64 sm:h-96 rounded-3xl bg-gradient-to-r from-[#F0ECE6] via-[#E8E4DF] to-[#F0ECE6] border border-[#E8E4DF]" />

        {/* Feature Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-[#F0ECE6] border border-[#E8E4DF]" />
          ))}
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-3xl bg-white border border-[#E8E4DF] p-4 space-y-3">
              <div className="aspect-square rounded-2xl bg-[#F0ECE6]" />
              <div className="h-4 bg-[#F0ECE6] rounded-md w-3/4" />
              <div className="h-4 bg-[#F0ECE6] rounded-md w-1/2" />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
