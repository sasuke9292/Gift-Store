'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  CheckCircle2, 
  Gift, 
  ShoppingBag,
  Star,
  Eye,
  Heart
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore, useFavoritesStore } from '@/lib/store'
import { useQuickViewStore } from '@/lib/quick-view-store'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Product {
  id: string
  name: string
  price: number
  salePrice?: number | null
  isBestSeller?: boolean
  isNew?: boolean
  category?: { name: string } | string | null
  images?: string[]
}

interface GiftFinderWizardProps {
  products: Product[]
  compact?: boolean
}

const WIZARD_STEPS = [
  {
    step: 1,
    title: 'لمن الهدية؟',
    subtitle: 'حدد من سيتلقى هذه الهدية لنقترح الطابع المناسب',
    options: [
      { id: 'her', label: 'لها 👩', desc: 'عطور، مجوهرات وبوكسات دلال أنثوية' },
      { id: 'him', label: 'له 👨', desc: 'ساعات، محافظ جلد وأطقم فخمة' },
      { id: 'partner', label: 'شريك الحياة 💍', desc: 'هدايا رومانسية وقطع تخلد الحب' },
      { id: 'kids', label: 'طفل 👶', desc: 'مواليد، ألعاب بوكسات طفولية لطيفة' },
      { id: 'grad', label: 'تخرج ونجاح 🎓', desc: 'هدايا تقدير وإنجاز فاخرة' },
      { id: 'any', label: 'مناسبة عامة 🎉', desc: 'هدايا تلائم كل الأذواق' },
    ]
  },
  {
    step: 2,
    title: 'ما هي المناسبة؟',
    subtitle: 'كل مناسبة لها طابع وتغليف خاص بها',
    options: [
      { id: 'birthday', label: 'عيد ميلاد 🎂', desc: 'فرح واحتفال بذكرى الميلاد' },
      { id: 'anniversary', label: 'ذكرى زواج / خطوبة 💍', desc: 'لحظات استثنائية وأفراح' },
      { id: 'graduation', label: 'تخرج أو ترقية 🎓', desc: 'تتويج الجهد والنجاح' },
      { id: 'newborn', label: 'مولود جديد 👶', desc: 'تهنئة بقدوم الملاك الصغير' },
      { id: 'surprise', label: 'مفاجأة بدون مناسبة 🎁', desc: 'أجمل الهدايا هي غير المتوقعة' },
      { id: 'thanks', label: 'شكر وتقدير 💐', desc: 'عربون وفاء وامتنان راقٍ' },
    ]
  },
  {
    step: 3,
    title: 'ما هي الميزانية المناسبة؟',
    subtitle: 'لدينا خيارات فاخرة تناسب كل خطة مالية',
    options: [
      { id: 'under-35k', label: 'أقل من 35,000 د.ع 💰', desc: 'هدايا لطيفة وقيمة بسعر رمزي' },
      { id: '35k-80k', label: '35,000 – 80,000 د.ع 💸', desc: 'الفئة الأكثر طلباً وتنوعاً' },
      { id: '80k-150k', label: '80,000 – 150,000 د.ع 💎', desc: 'أطقم فاخرة وساعات أصلية' },
      { id: 'above-150k', label: 'ميزانية مفتوحة (VIP) ✨', desc: 'أعلى درجات الفخامة الملكية' },
    ]
  },
  {
    step: 4,
    title: 'ما نوع الهدية المفضل؟',
    subtitle: 'اختر النمط الأكثر ملاءمة لذوق المستلم',
    options: [
      { id: 'perfumes', label: 'عطور وبخور فاخر 🌸', desc: 'روائح فرنسية وشرقية آسرة' },
      { id: 'accessories', label: 'ساعات ومجوهرات ⌚', desc: 'قطع أنيقة تلبس وتدوم طويلاً' },
      { id: 'boxes', label: 'بوكسات ورد وشوكولاتة 🍫', desc: 'تنسيق متكامل مبهج للعين' },
      { id: 'custom', label: 'هدايا مخصصة بالاسم ✨', desc: 'حفر الاسم ولمسة شخصية فريدة' },
    ]
  }
]

export function GiftFinderWizard({ products, compact = false }: GiftFinderWizardProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [selections, setSelections] = useState<Record<number, string>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const addToCart = useCartStore((state) => state.addItem)
  const openQuickView = useQuickViewStore((state) => state.openQuickView)
  const { addFavorite, removeFavorite, hasFavorite } = useFavoritesStore()

  const currentStep = WIZARD_STEPS[currentStepIdx]

  const handleSelect = (optionId: string) => {
    const updated = { ...selections, [currentStepIdx]: optionId }
    setSelections(updated)

    if (currentStepIdx < WIZARD_STEPS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1)
    } else {
      setIsCompleted(true)
    }
  }

  const handleBack = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1)
    }
  }

  const handleReset = () => {
    setCurrentStepIdx(0)
    setSelections({})
    setIsCompleted(false)
  }

  // Recommendation engine based on wizard selections
  const matchingProducts = useMemo(() => {
    if (!isCompleted || products.length === 0) return []

    const recipient = selections[0]
    const occasion = selections[1]
    const budget = selections[2]
    const categoryPreference = selections[3]

    const scored = products.map((p) => {
      let score = 0
      const text = `${p.name} ${typeof p.category === 'string' ? p.category : p.category?.name || ''}`.toLowerCase()

      // Recipient matching
      if (recipient === 'him' && (/رجال|رجالي|ساعة|شباب|شماغ|محفظة|عطر/.test(text))) score += 7
      if (recipient === 'her' && (/نسا|نسائي|بنات|عطور|مجوهرات|قلادة|ذهب|ورد/.test(text))) score += 7
      if (recipient === 'partner' && (/طقم|حب|عطر|ساعة|ذهب|مجوهرات|فاخر/.test(text))) score += 6
      if (recipient === 'kids' && (/طفل|أطفال|اطفال|لعب|بيبي/.test(text))) score += 8
      if (recipient === 'grad' && (/تخرج|نجاح|قلم|ساعة|محفظة|درع/.test(text))) score += 7

      // Budget matching
      const price = p.salePrice ?? p.price
      if (budget === 'under-35k') {
        if (price <= 35000) score += 6
        else if (price <= 50000) score += 2
      } else if (budget === '35k-80k') {
        if (price >= 35000 && price <= 80000) score += 6
        else if (price <= 100000) score += 2
      } else if (budget === '80k-150k') {
        if (price >= 80000 && price <= 150000) score += 6
        else if (price >= 60000) score += 2
      } else if (budget === 'above-150k') {
        if (price >= 120000) score += 6
      }

      // Category preference matching
      if (categoryPreference === 'perfumes' && (/عطر|مسك|عود|روائح|بخور/.test(text))) score += 6
      if (categoryPreference === 'accessories' && (/ساعة|مجوهرات|قلادة|سوار|خاتم|محفظة/.test(text))) score += 6
      if (categoryPreference === 'boxes' && (/بوكس|ورد|زهور|شوكولات|تغليف/.test(text))) score += 6
      if (categoryPreference === 'custom' && (/اسم|مخصص|محفور/.test(text))) score += 6

      if (p.isBestSeller) score += 2
      if (p.isNew) score += 1

      return { product: p, score }
    })

    scored.sort((a, b) => b.score - a.score)

    let top = scored.filter(s => s.score >= 5).map(s => s.product)
    if (top.length < 3) {
      top = scored.filter(s => s.score > 0).map(s => s.product)
    }
    if (top.length === 0) {
      top = products.slice(0, 6)
    }

    return top.slice(0, 6)
  }, [isCompleted, products, selections])

  return (
    <div className={cn("w-full", !compact && "max-w-4xl mx-auto")} dir="rtl">
      {/* Wizard Header Progress Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between text-xs font-black text-slate-500 mb-2">
          <span>
            {isCompleted ? 'النتيجة النهائية' : `الخطوة ${currentStepIdx + 1} من ${WIZARD_STEPS.length}`}
          </span>
          <span className="text-[#13213c]">
            {isCompleted ? '100% مكتمل' : `${Math.round(((currentStepIdx + 1) / WIZARD_STEPS.length) * 100)}%`}
          </span>
        </div>

        {/* Multi-segment step dots */}
        <div className="grid grid-cols-4 gap-2">
          {WIZARD_STEPS.map((s, idx) => (
            <div
              key={idx}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                isCompleted || idx <= currentStepIdx
                  ? "bg-[#13213c]"
                  : "bg-slate-200"
              )}
            />
          ))}
        </div>
      </div>

      {/* Interactive Card Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-sm">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            /* STEP QUESTIONS */
            <motion.div
              key={`step-${currentStepIdx}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Step Title & Subtitle */}
              <div className="text-center sm:text-start mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-[#F0F4F9] text-[#13213c] mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  مستشار الإهداء الذكي
                </span>
                <h3 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight mb-1">
                  {currentStep.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  {currentStep.subtitle}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                {currentStep.options.map((opt) => {
                  const isSelected = selections[currentStepIdx] === opt.id

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      className={cn(
                        "p-4 rounded-2xl border text-start transition-all cursor-pointer flex items-start gap-3 group",
                        isSelected
                          ? "border-[#13213c] bg-[#F0F4F9] shadow-xs"
                          : "border-slate-200/90 hover:border-[#13213c]/40 hover:bg-slate-50/80"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                        isSelected 
                          ? "border-[#13213c] bg-[#13213c] text-white" 
                          : "border-slate-300 group-hover:border-slate-400"
                      )}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-[#13213c] transition-colors">
                          {opt.label}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Navigation buttons */}
              {currentStepIdx > 0 && (
                <div className="flex items-center justify-start pt-2 border-t border-slate-100">
                  <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>الخطوة السابقة</span>
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            /* COMPLETED RECOMMENDATIONS */
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* AI Badge & Heading */}
              <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-[#F0F4F9] via-[#F8FAFC] to-[#F0F4F9] border border-[#13213c]/20 mb-6 text-start">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#13213c] text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-xl font-black text-slate-900">
                        وجدنا لك {matchingProducts.length} من أروع الهدايا المطابقة!
                      </h3>
                      <p className="text-xs text-slate-600">
                        تمت مطابقة تفضيلاتك بعناية بناءً على المناسبة والميزانية ونوع الهدية.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:border-[#13213c] text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors self-start sm:self-auto shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>تعديل الخيارات</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                  <span className="flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    تغليف ملكي مجاني مشمول
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    توصيل سريع لكافة المحافظات
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    بطاقة إهداء شخصية بكلماتك
                  </span>
                </div>
              </div>

              {/* Recommended Product Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {matchingProducts.map((p) => {
                  const displayPrice = p.salePrice ?? p.price
                  const img = (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'
                  const catName = typeof p.category === 'string' ? p.category : p.category?.name || 'هدية فاخرة'

                  return (
                    <div
                      key={p.id}
                      className="bg-slate-50/70 hover:bg-white rounded-2xl p-3 border border-slate-200 hover:border-[#13213c]/30 hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image */}
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-200 mb-3">
                          <Image
                            src={img}
                            alt={p.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <button
                            onClick={() => openQuickView({ ...p, images: [img] })}
                            className="absolute bottom-2 inset-x-2 h-8 rounded-lg bg-white/95 text-slate-900 text-[11px] font-bold flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>معاينة سريعة</span>
                          </button>
                        </div>

                        {/* Title & Category */}
                        <p className="text-[10px] font-bold text-[#13213c] mb-0.5">{catName}</p>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-2 mb-2 group-hover:text-[#13213c] transition-colors">
                          <Link href={`/product/${p.id}`}>
                            {p.name}
                          </Link>
                        </h4>
                      </div>

                      {/* Price & Add to Cart */}
                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                        <div className="text-xs font-black text-[#13213c]" dir="ltr">
                          {displayPrice.toLocaleString('en-US')} <span className="text-[10px] text-slate-400">د.ع</span>
                        </div>

                        <button
                          onClick={() => {
                            addToCart({
                              id: `${p.id}-${Date.now()}`,
                              productId: p.id,
                              name: p.name,
                              price: displayPrice,
                              quantity: 1,
                              image: img,
                              category: catName
                            }, true)
                            toast.success('تمت إضافة الهدية للسلة بنجاح ✨')
                          }}
                          className="h-8 px-2.5 rounded-lg bg-[#13213c] hover:bg-[#1a2c4e] text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>إضافة</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* View All / Explore Shop CTA */}
              <div className="text-center pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 h-11 px-7 rounded-xl font-black text-white text-xs transition-all hover:-translate-y-0.5 shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
                >
                  <span>تصفح كافة منتجات المتجر</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
