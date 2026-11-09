import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-16 text-slate-900" dir="rtl">
      <div className="max-w-md w-full text-center p-8 bg-white rounded-3xl border border-slate-200/80 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo-navy.png"
            alt="Gifty+"
            width={180}
            height={49}
            className="h-12 w-auto object-contain"
          />
        </div>

        <span className="text-4xl font-black text-[#13213c] tracking-widest block mb-2">404</span>
        <h1 className="text-2xl font-black text-slate-900 mb-2">الصفحة غير موجودة</h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو أنها غير متوفرة حالياً. يمكنك استكشاف أرقى الهدايا من الصفحة الرئيسية.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-2xl font-extrabold text-white text-sm transition-all hover:brightness-110 shadow-md shadow-[#13213c]/20 hover:shadow-lg hover:shadow-[#13213c]/30"
          style={{ background: 'linear-gradient(135deg, #13213c 0%, #0c1424 100%)' }}
        >
          <Home className="w-4 h-4" />
          <span>العودة للرئيسية</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
