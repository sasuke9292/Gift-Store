'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowLeft, RotateCcw, ShoppingCart, Star, Check } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/store'
import { toast } from 'sonner'

const steps = [
  {
    id: 'recipient',
    question: 'لمن هذه الهدية؟',
    options: [
      { label: 'لرجل', value: 'men', icon: '👨' },
      { label: 'لامرأة', value: 'women', icon: '👩' },
      { label: 'لطفل', value: 'kids', icon: '🧒' },
      { label: 'للشريك', value: 'partner', icon: '❤️' }
    ]
  },
  {
    id: 'occasion',
    question: 'ما هي المناسبة؟',
    options: [
      { label: 'عيد ميلاد', value: 'birthday', icon: '🎂' },
      { label: 'ذكرى زواج', value: 'anniversary', icon: '💍' },
      { label: 'تخرج', value: 'graduation', icon: '🎓' },
      { label: 'بدون مناسبة (مفاجأة)', value: 'surprise', icon: '🎁' }
    ]
  },
  {
    id: 'budget',
    question: 'ما هي ميزانيتك التقريبية؟',
    options: [
      { label: 'أقل من 30,000 د.ع', value: 'low', icon: '💰' },
      { label: '30,000 – 80,000 د.ع', value: 'medium', icon: '💸' },
      { label: 'أكثر من 80,000 د.ع', value: 'high', icon: '💎' },
      { label: 'الميزانية مفتوحة', value: 'any', icon: '✨' }
    ]
  }
]

interface Product {
  id: string
  name: string
  price: number
  isBestSeller: boolean
  category: string
  images: string[]
}

export default function GiftFinderClient({ initialProducts: products }: { initialProducts: Product[] }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isFinished, setIsFinished] = useState(false)
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const addItem = useCartStore(state => state.addItem)

  const handleSelectOption = (value: string) => {
    const newAnswers = { ...answers, [steps[currentStep].id]: value }
    setAnswers(newAnswers)
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      findGifts(newAnswers)
    }
  }

  const findGifts = (finalAnswers: Record<string, string>) => {
    const scored = products.map((product) => {
      let score = 0
      const text = `${product.name} ${product.category}`.toLowerCase()

      // Recipient matching
      if (finalAnswers.recipient === 'men') {
        if (/رجال|رجالي|شباب|رجل|شماغ|ساعة|عطر/.test(text)) score += 6
      } else if (finalAnswers.recipient === 'women') {
        if (/نساء|نسائي|بنات|انثى|أنثى|ورد|عطور|مكياج|اكسسوار/.test(text)) score += 6
      } else if (finalAnswers.recipient === 'kids') {
        if (/طفل|أطفال|اطفال|بناتي صغار|ولادي|لعب/.test(text)) score += 6
      } else if (finalAnswers.recipient === 'partner') {
        if (/حب|شريك|رومانس|عطر|ساعة|فاخر|طقم|ذهب|فضة/.test(text)) score += 5
        score += 2
      }

      // Budget matching
      if (finalAnswers.budget === 'low') {
        if (product.price <= 30000) score += 5
        else if (product.price <= 45000) score += 2
      } else if (finalAnswers.budget === 'medium') {
        if (product.price >= 30000 && product.price <= 80000) score += 5
        else if (product.price <= 100000) score += 2
      } else if (finalAnswers.budget === 'high') {
        if (product.price > 80000) score += 5
        else if (product.price >= 60000) score += 2
      } else if (finalAnswers.budget === 'any') {
        score += 3
      }

      // Occasion matching
      if (finalAnswers.occasion === 'birthday') {
        if (/ميلاد|عيد|حفلة|كيك|شوكولات|مفاج|هدية/.test(text)) score += 4
      } else if (finalAnswers.occasion === 'anniversary') {
        if (/ذكرى|زواج|حب|طقم|ساعة|عطر|ورد|ذهب/.test(text)) score += 4
      } else if (finalAnswers.occasion === 'graduation') {
        if (/تخرج|نجاح|قلم|محفظة|درع|مبروك/.test(text)) score += 4
      } else if (finalAnswers.occasion === 'surprise') {
        score += 2
      }

      // Best seller boost
      if (product.isBestSeller) score += 2

      return { product, score }
    })

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score)

    let results = scored.filter(item => item.score >= 5).map(item => item.product)
    if (results.length === 0) {
      results = scored.filter(item => item.score > 0).map(item => item.product)
    }
    if (results.length === 0) {
      results = products.filter(p => p.isBestSeller)
    }
    if (results.length === 0) {
      results = products.slice(0, 8)
    }

    setRecommendedProducts(results)
    setIsFinished(true)
  }

  const resetQuiz = () => {
    setCurrentStep(0)
    setAnswers({})
    setIsFinished(false)
    setRecommendedProducts([])
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-4 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="py-12 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_8px_30px_rgba(19,33,60,0.25)]"
            style={{ background: 'linear-gradient(135deg, #13213c 0%, #0c1424 100%)' }}
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4"
          >
            مكتشف الهدايا الذكي
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed"
          >
            أجب عن 3 أسئلة بسيطة وسنقترح لك الهدايا المثالية التي تناسب ذوقك وميزانيتك.
          </motion.p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.06)] overflow-hidden">
          <AnimatePresence mode="wait">

            {/* ===== QUIZ STEPS ===== */}
            {!isFinished && (
              <motion.div
                key={`step-${currentStep}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="p-8 md:p-12"
              >
                {/* Step Progress */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-sm font-bold text-[#13213c]">
                    الخطوة {currentStep + 1} من {steps.length}
                  </span>
                  <div className="flex gap-2">
                    {steps.map((_, idx) => (
                      <div
                        key={idx}
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: idx === currentStep ? '40px' : '12px',
                          background: idx === currentStep
                            ? 'linear-gradient(90deg, #13213c, #22385e)'
                            : idx < currentStep ? '#13213c' : '#E2E8F0'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Question */}
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8 text-center">
                  {steps[currentStep].question}
                </h2>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {steps[currentStep].options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectOption(option.value)}
                      className="p-5 rounded-2xl border-2 border-slate-200/80 hover:border-[#13213c] hover:bg-slate-50/80 hover:shadow-[0_4px_16px_rgba(19,33,60,0.08)] transition-all duration-200 flex items-center gap-4 group text-start cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-xl bg-slate-100 group-hover:bg-blue-50/80 flex items-center justify-center text-3xl transition-colors shrink-0">
                        {option.icon}
                      </div>
                      <span className="font-bold text-slate-800 group-hover:text-[#13213c] transition-colors">
                        {option.label}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Back button */}
                {currentStep > 0 && (
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#13213c] transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      العودة للسؤال السابق
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ===== RESULTS ===== */}
            {isFinished && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="p-8 md:p-10"
              >
                {/* Results Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-blue-50/80 border border-blue-200/60 text-[#13213c] px-6 py-3 rounded-full mb-5 font-bold shadow-xs">
                    <Sparkles className="w-4 h-4 text-[#13213c]" />
                    وجدنا لك {recommendedProducts.length} هدايا مثالية!
                  </div>
                  <h2 className="text-3xl font-black text-slate-900">اقتراحاتنا الذكية لك ✨</h2>
                </div>

                {/* Product Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {recommendedProducts.slice(0, 8).map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-[0_8px_25px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:border-[#13213c]/30 transition-all duration-300"
                    >
                      <Link href={`/product/${product.id}`} className="block">
                        <div className="relative aspect-[4/3] bg-slate-50/80 overflow-hidden">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              sizes="(max-width: 640px) 100vw, 50vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#13213c]/30">
                              <ShoppingCart className="w-10 h-10" />
                            </div>
                          )}
                          {product.isBestSeller && (
                            <span className="absolute top-3 start-3 inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-xs">
                              <Star className="w-2.5 h-2.5 fill-white" />
                              الأكثر مبيعاً
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="text-[11px] font-bold text-[#13213c] uppercase tracking-widest mb-1">{product.category}</p>
                          <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mb-3 group-hover:text-[#13213c] transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-black text-amber-500">
                              {product.price.toLocaleString('en-US')}
                              <span className="text-sm font-bold text-slate-400 ms-1">د.ع</span>
                            </span>
                            <button
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md shadow-[#13213c]/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                              style={{ background: 'linear-gradient(135deg, #13213c 0%, #0c1424 100%)' }}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                addItem({
                                  id: `${product.id}-${Date.now()}`,
                                  productId: product.id,
                                  name: product.name,
                                  price: product.price,
                                  quantity: 1,
                                  image: product.images?.[0],
                                  category: product.category,
                                })
                                toast.success('تمت إضافة المنتج للسلة')
                              }}
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Actions */}
                <div className="border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={resetQuiz}
                    className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    إعادة البحث
                  </button>
                  <Link
                    href="/shop"
                    className="flex items-center justify-center gap-2 h-12 px-8 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 shadow-md shadow-[#13213c]/20 hover:shadow-lg hover:shadow-[#13213c]/30"
                    style={{ background: 'linear-gradient(135deg, #13213c 0%, #0c1424 100%)' }}
                  >
                    تصفح كل الهدايا
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
