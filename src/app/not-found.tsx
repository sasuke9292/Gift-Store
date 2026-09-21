import React from 'react'
import Link from 'next/link'
import { Gift, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-4 py-16 text-stone-900" dir="rtl">
      <div className="max-w-md w-full text-center p-8 bg-white rounded-3xl border border-[#E8E4DF] shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
        <div 
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg"
          style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
        >
          <Gift className="w-10 h-10" />
        </div>

        <span className="text-4xl font-black text-[#A07850] tracking-widest block mb-2">404</span>
        <h1 className="text-2xl font-black text-[#1C1917] mb-2">الصفحة غير موجودة</h1>
        <p className="text-sm text-[#78716C] mb-8 leading-relaxed">
          يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو أنها غير متوفرة حالياً. يمكنك استكشاف أرقى الهدايا من الصفحة الرئيسية.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-2xl font-extrabold text-white text-sm transition-all hover:brightness-110 shadow-md"
          style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
        >
          <Home className="w-4 h-4" />
          <span>العودة للرئيسية</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
