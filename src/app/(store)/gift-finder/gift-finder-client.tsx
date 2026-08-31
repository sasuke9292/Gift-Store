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
    <div className="bg-slate-50 min-h-screen py-20 relative overflow-hidden">
      
      {/* Decorative bg */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20"
          >
            <Sparkles className="w-10 h-10 text-primary" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-slate-800 mb-4"
          >
            مكتشف الهدايا الذكي
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg max-w-2xl mx-auto"
          >
            أجب عن 3 أسئلة بسيطة وسنقوم باقتراح الهدايا المثالية التي تناسب ذوقك وميزانيتك بلمسة سحرية.
          </motion.p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 min-h-[400px]">
          
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
                <div className="flex justify-between items-center mb-8">
                  <span className="text-slate-400 font-medium">الخطوة {currentStep + 1} من {steps.length}</span>
                  <div className="flex gap-1">
                    {steps.map((_, idx) => (
                      <div key={idx} className={`h-2 rounded-full transition-all duration-500 ${idx === currentStep ? 'w-8 bg-primary' : idx < currentStep ? 'w-2 bg-primary/30' : 'w-2 bg-slate-100'}`} />
                    ))}
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-slate-800 mb-10 text-center">
                  {steps[currentStep].question}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {steps[currentStep].options.map((option, idx) => (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={idx}
                      onClick={() => handleSelectOption(option.value)}
                      className="p-6 rounded-3xl border-2 border-slate-100 hover:border-primary hover:bg-primary/5 transition-all duration-300 text-right flex items-center gap-6 group bg-white"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 group-hover:bg-white flex items-center justify-center text-3xl shadow-sm transition-colors duration-300">
                        {option.icon}
                      </div>
                      <span className="text-xl font-bold text-slate-700 group-hover:text-primary transition-colors">{option.label}</span>
                    </motion.button>
                  ))}
                </div>
                
                {currentStep > 0 && (
                  <div className="mt-8 flex justify-end">
                    <Button 
                      variant="ghost" 
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="text-slate-500 hover:text-slate-800"
                    >
                      الرجوع للسؤال السابق
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-10"
              >
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full mb-4">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-bold text-sm">وجدنا لك {recommendedProducts.length} هدايا مثالية</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800">اقتراحاتنا السحرية لك</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {recommendedProducts.map((product) => (
                    <Card key={product.id} className="group border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden rounded-3xl cursor-pointer">
                      <div className="relative aspect-[4/3] bg-slate-100 p-4 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform duration-700 relative">
                          {product.images && product.images[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                          ) : (
                            <span>صورة المنتج</span>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <p className="text-sm font-medium text-slate-500 mb-2">{product.category}</p>
                        <h3 className="font-bold text-slate-800 text-lg mb-4 line-clamp-2">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">{product.price.toLocaleString('en-US')} د.ع</span>
                          <Link href={`/product/${product.id}`} className={buttonVariants({ size: "icon", className: "w-10 h-10 rounded-full" })}>
                            <ShoppingCart className="w-4 h-4" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="pt-8 border-t border-slate-100 flex justify-center gap-4">
                  <Button onClick={resetQuiz} variant="outline" size="lg" className="rounded-xl px-8 h-14 border-slate-200">
                    <RotateCcw className="w-5 h-5 ml-2" />
                    إعادة البحث
                  </Button>
                  <Link href="/shop" className={buttonVariants({ size: "lg", className: "rounded-xl px-8 h-14" })}>
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
