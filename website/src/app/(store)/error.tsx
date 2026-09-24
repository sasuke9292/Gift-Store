'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Store error captured:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#FAFAF8] px-4 py-16" dir="rtl">
      <div className="max-w-md w-full text-center p-8 bg-white rounded-3xl border border-[#E8E4DF] shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
        <div className="w-16 h-16 rounded-2xl bg-[#FDF2F4] text-[#E85D75] flex items-center justify-center mx-auto mb-5">
          <AlertCircle className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-black text-[#1C1917] mb-2">عذراً، حدث خطأ غير متوقع</h2>
        <p className="text-sm text-[#78716C] mb-6 leading-relaxed">
          نعتذر عن هذا الإزعاج. يرجى المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية للمتجر.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 h-11 px-6 rounded-xl font-bold text-white text-xs transition-all hover:brightness-110 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>إعادة المحاولة</span>
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 h-11 px-6 rounded-xl font-bold text-[#1C1917] text-xs bg-[#F8F5F0] hover:bg-[#F0EBE1] border border-[#E8E4DF] transition-all"
          >
            <Home className="w-4 h-4 text-[#13213c]" />
            <span>الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
