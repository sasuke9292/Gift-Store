import React from 'react'

export default function AdminLoading() {
  return (
    <div className="p-6 md:p-8 space-y-6 animate-pulse" dir="rtl">
      {/* Top Banner Skeleton */}
      <div className="h-36 rounded-3xl bg-gradient-to-r from-[#F0ECE6] via-[#E8E4DF] to-[#F0ECE6] border border-[#E8E4DF]" />

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 rounded-3xl bg-white border border-[#E8E4DF]" />
        ))}
      </div>

      {/* Chart & List Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 h-80 rounded-3xl bg-white border border-[#E8E4DF]" />
        <div className="lg:col-span-4 h-80 rounded-3xl bg-white border border-[#E8E4DF]" />
      </div>
    </div>
  )
}
