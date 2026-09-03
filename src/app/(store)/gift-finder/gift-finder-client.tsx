'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, buttonVariants } from '@/components/ui/button'
import { Sparkles, ArrowLeft, RotateCcw, ShoppingCart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

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
      { label: '30,000 - 80,000 د.ع', value: 'medium', icon: '💸' },
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
    let filtered = [...products]
    
    // Fake logic for demo based on placeholder data
    if (finalAnswers.recipient === 'men') {
      filtered = filtered.filter(p => p.category === 'هدايا رجالية')
    } else if (finalAnswers.recipient === 'women') {
      filtered = filtered.filter(p => p.category === 'هدايا نسائية' || p.category === 'مناسبات')
    } else if (finalAnswers.recipient === 'kids') {
      filtered = filtered.filter(p => p.category === 'هدايا أطفال')
    }

    if (finalAnswers.budget === 'low') {
      filtered = filtered.filter(p => p.price <= 30000)
    } else if (finalAnswers.budget === 'medium') {
      filtered = filtered.filter(p => p.price > 30000 && p.price <= 80000)
    } else if (finalAnswers.budget === 'high') {
      filtered = filtered.filter(p => p.price > 80000)
    }

    // If nothing found, just recommend best sellers
    if (filtered.length === 0) {
      filtered = products.filter(p => p.isBestSeller)
    }

    setRecommendedProducts(filtered)
    setIsFinished(true)
  }

  const resetQuiz = () => {
    setCurrentStep(0)
    setAnswers({})
    setIsFinished(false)
    setRecommendedProducts([])
  }

  return (
    <div className="bg-[#050B14] min-h-screen pt-48 pb-32 relative overflow-hidden text-white">
      
      {/* Decorative bg */}
      <div className="absolute top-0 start-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-0 end-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none mix-blend-screen"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 perspective-[1000px]">
        
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(251,191,36,0.6)] relative z-10 border-[4px] border-[#050B14]"
          >
            <Sparkles className="w-12 h-12 text-[#050B14]" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 mb-6 drop-shadow-md"
          >
            مكتشف الهدايا الذكي
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed drop-shadow-sm"
          >
            أجب عن 3 أسئلة بسيطة وسنقوم باقتراح الهدايا المثالية التي تناسب ذوقك وميزانيتك بلمسة سحرية.
          </motion.p>
        </div>

        <div className="glass-card rounded-[3rem] p-8 md:p-14 shadow-2xl border-white/10 min-h-[400px] transform-gpu hover:rotate-y-1 transition-transform duration-700">
          
          <AnimatePresence mode="wait">
            {!isFinished ? (
              <motion.div
                key={`step-${currentStep}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
              >
                <div className="flex justify-between items-center mb-10">
                  <span className="text-amber-400 font-bold drop-shadow-sm">الخطوة {currentStep + 1} من {steps.length}</span>
                  <div className="flex gap-2">
                    {steps.map((_, idx) => (
                      <div key={idx} className={`h-2 rounded-full transition-all duration-500 shadow-inner ${idx === currentStep ? 'w-10 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : idx < currentStep ? 'w-3 bg-amber-500/40' : 'w-3 bg-white/10'}`} />
                    ))}
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center drop-shadow-md">
                  {steps[currentStep].question}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {steps[currentStep].options.map((option, idx) => (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={idx}
                      onClick={() => handleSelectOption(option.value)}
                      className="p-6 rounded-3xl glass-card border-white/5 hover:border-amber-400/50 hover:shadow-[0_10px_30px_rgba(251,191,36,0.15)] transition-all duration-300 text-start flex items-center gap-6 group hover:bg-white/5 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 -skew-x-12 translate-x-[-150%]" />
                      <div className="w-16 h-16 rounded-2xl bg-white/5 group-hover:bg-amber-500/20 group-hover:border-amber-500/30 border border-transparent flex items-center justify-center text-3xl shadow-inner transition-colors duration-300 relative z-10">
                        {option.icon}
                      </div>
                      <span className="text-xl font-bold text-slate-300 group-hover:text-amber-400 transition-colors drop-shadow-sm relative z-10">{option.label}</span>
                    </motion.button>
                  ))}
                </div>
                
                {currentStep > 0 && (
                  <div className="mt-10 flex justify-end">
                    <Button 
                      variant="ghost" 
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="text-white/50 hover:text-white hover:bg-white/5 rounded-xl h-12 px-6"
                    >
                      الرجوع للسؤال السابق
                      <ArrowLeft className="w-4 h-4 ms-2" />
                    </Button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-6 py-3 rounded-full mb-6 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                    <Sparkles className="w-5 h-5 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" />
                    <span className="font-bold text-md">وجدنا لك {recommendedProducts.length} هدايا مثالية</span>
                  </div>
                  <h2 className="text-4xl font-black text-white drop-shadow-md">اقتراحاتنا السحرية لك</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {recommendedProducts.map((product) => (
                    <Card key={product.id} className="group glass-card border-white/5 hover:border-amber-400/30 shadow-lg hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:-translate-y-2 transition-all duration-500 bg-transparent overflow-hidden rounded-[2rem] cursor-pointer">
                      <Link href={`/product/${product.id}`} className="block">
                        <div className="relative aspect-[4/3] bg-white/5 p-4 overflow-hidden border-b border-white/5">
                          <div className="w-full h-full rounded-2xl overflow-hidden flex items-center justify-center text-slate-500 group-hover:scale-110 transition-transform duration-700 relative shadow-inner">
                            {product.images && product.images[0] ? (
                              <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover drop-shadow-xl" />
                            ) : (
                              <span>صورة المنتج</span>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <p className="text-sm font-bold text-amber-500/80 mb-2">{product.category}</p>
                          <h3 className="font-bold text-white text-xl mb-4 line-clamp-2 drop-shadow-sm">{product.name}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">{product.price.toLocaleString('en-US')} <span className="text-lg">د.ع</span></span>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-[#050B14] flex items-center justify-center shadow-[0_5px_15px_rgba(251,191,36,0.4)] group-hover:scale-110 transition-transform">
                              <ShoppingCart className="w-5 h-5" />
                            </div>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>

                <div className="pt-10 border-t border-white/10 flex flex-col sm:flex-row justify-center gap-4">
                  <Button onClick={resetQuiz} variant="outline" size="lg" className="rounded-xl px-10 h-14 glass-button text-white border-white/10 hover:bg-white/10 w-full sm:w-auto">
                    <RotateCcw className="w-5 h-5 me-2" />
                    إعادة البحث
                  </Button>
                  <Link href="/shop" className="inline-flex items-center justify-center w-full sm:w-auto px-10 h-14 rounded-xl shadow-[0_10px_30px_rgba(251,191,36,0.3)] bg-gradient-to-r from-amber-500 to-yellow-600 text-[#050B14] font-black hover:scale-[1.02] active:scale-95 transition-all duration-300">
                    تصفح كل الهدايا
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
