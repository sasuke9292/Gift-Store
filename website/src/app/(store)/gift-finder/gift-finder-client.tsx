'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Gift, CheckCircle2, ShieldCheck, Truck, ArrowLeft } from 'lucide-react'
import { GiftFinderWizard } from '@/components/store/gift-finder-wizard'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: number
  salePrice?: number | null
  isBestSeller?: boolean
  isNew?: boolean
  category: string
  images: string[]
}

export default function GiftFinderClient({ initialProducts: products }: { initialProducts: Product[] }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-6 pb-24" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 py-3 mb-4">
          <Link href="/" className="hover:text-[#13213c] transition-colors">الرئيسية</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">مكتشف الهدايا الذكي</span>
        </nav>

        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
          >
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-3"
          >
            مكتشف الهدايا الذكي
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 text-sm sm:text-base leading-relaxed"
          >
            دع الذكاء يساعدك في العثور على الهدية الاستثنائية التي تعبر عن مشاعرك بدقة. حدد من سيتلقاها والمناسبة وميزانيتك، ونحن نتكفل بالباقي مع تغليف ملكي وتوصيل سريع.
          </motion.p>
        </div>

        {/* The Wizard */}
        <div className="mb-14">
          <GiftFinderWizard products={products} />
        </div>

        {/* Guarantee & Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10 border-t border-slate-200/80">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-[#F0F4F9] text-[#13213c] flex items-center justify-center mb-3">
              <Gift className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-slate-900 mb-1">تغليف ملكي مجاني</h4>
            <p className="text-xs text-slate-500">
              تصل هديتك مغلفة بعلبة فاخرة، شريط ساتان وبطاقة إهداء بكلماتك بدون أي تكلفة إضافية.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-[#F0F4F9] text-[#13213c] flex items-center justify-center mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-slate-900 mb-1">توصيل لكافة المحافظات</h4>
            <p className="text-xs text-slate-500">
              شحن سريع ومضمون إلى بغداد، البصرة، أربيل، وكافة محافظات العراق خلال 24 - 48 ساعة.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-[#F0F4F9] text-emerald-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-slate-900 mb-1">معاينة قبل الدفع</h4>
            <p className="text-xs text-slate-500">
              حق الفحص والمعاينة عند الاستلام مع إمكانية الدفع نقداً أو بـ زين كاش والماستر كارد.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
