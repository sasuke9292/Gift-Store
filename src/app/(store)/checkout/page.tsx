'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/cart')
  }, [router])

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="text-center max-w-sm">
        <div className="w-10 h-10 border-2 border-[#13213c] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-base font-black text-[#1C1917] mb-1">جاري التحويل إلى السلة...</h2>
        <p className="text-xs text-[#78716C]">
          تم تفعيل نظام الطلب المباشر والسريع عبر WhatsApp بدون الحاجة لتعبئة نماذج دفع معقدة.
        </p>
      </div>
    </div>
  )
}
