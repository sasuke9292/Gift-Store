'use client'

import React, { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8E4DF] shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center mx-auto mb-5 text-amber-600 shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-black text-[#1C1917] mb-2">
          حدث خطأ غير متوقع
        </h2>

        <p className="text-sm text-[#78716C] mb-6 leading-relaxed">
          نعتذر، حدث خطأ أثناء معالجة الصفحة. يمكنك محاولة إعادة التحميل أو العودة إلى الصفحة الرئيسية.
        </p>

        {error?.digest && (
          <div className="mb-6 px-3 py-1.5 bg-[#F8F5F0] rounded-xl text-xs text-[#A8A29E] font-mono select-all">
            رمز الخطأ: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            onClick={() => reset()}
            className="w-full sm:flex-1 h-11 rounded-xl font-bold bg-[#13213c] hover:bg-[#13213c] text-white flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </Button>

          <Link
            href="/"
            className="w-full sm:flex-1 h-11 rounded-xl border border-[#E8E4DF] text-[#57534E] hover:bg-[#F8F5F0] flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
          >
            <Home className="w-4 h-4" />
            الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
