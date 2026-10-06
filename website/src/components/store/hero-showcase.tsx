'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft, 
  Gift, 
  Award
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface HeroSlideItem {
  id: string
  title: string
  subtitle?: string | null
  image: string
  link?: string
  tag?: string | null
}

interface HeroShowcaseProps {
  badge?: string
  headline?: string
  subheadline?: string
  primaryBtnText?: string
  primaryBtnLink?: string
  secondaryBtnText?: string
  secondaryBtnLink?: string
  slides: HeroSlideItem[]
  stat1?: { value: string; label: string }
  stat2?: { value: string; label: string }
  stat3?: { value: string; label: string }
  badgeTop?: { small: string; bold: string }
  badgeBottom?: { small: string; bold: string }
}

const defaultSlides: HeroSlideItem[] = [
  {
    id: 'women-perfume',
    title: 'عطور ومجوهرات نسائية راقية',
    subtitle: 'أناقة لا مثيل لها لكل مناسبة سعيدة وتغليف مخملي فاخر',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=1200',
    link: '/category/women',
    tag: 'تشكيلة حصرية'
  },
  {
    id: 'men-luxury',
    title: 'أطقم وساعات رجالية فاخرة',
    subtitle: 'هدية تعبّر عن التقدير والرقي بلمسات جلدية ومعدنية أصلية',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200',
    link: '/category/men',
    tag: 'الأكثر طلباً'
  },
  {
    id: 'gift-boxes',
    title: 'بوكسات هدايا وتغليف ملكي',
    subtitle: 'أشرطة حريرية، ورود طبيعية وشوكولاتة بلجيكية فاخرة',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1200',
    link: '/category/occasions',
    tag: 'تغليف مجاني'
  },
  {
    id: 'custom-jewelry',
    title: 'مجوهرات وهدايا مخصصة بالاسم',
    subtitle: 'خلّد اسم من تحب بقطعة استثنائية صُنعت خصيصاً له',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200',
    link: '/category/custom',
    tag: 'صُنعت بالاسم'
  }
]

export function HeroShowcase({
  badge = 'التشكيلة الجديدة لعام 2026 ✨',
  headline = 'هدية تحچي عنك',
  subheadline = 'لحظاتك الثمينة تستحق الأفضل. اختر هدايا استثنائية صُممت بعناية لتخلّد أجمل الذكريات مع تغليف يدوي ملكي وتوصيل سريع.',
  primaryBtnText = 'اكتشف الهدايا',
  primaryBtnLink = '/shop',
  secondaryBtnText = 'مكتشف الهدايا الذكي',
  secondaryBtnLink = '/gift-finder',
  slides = defaultSlides,
  stat1 = { value: '+15K', label: 'عميل سعيد وموثوق' },
  stat2 = { value: '4.9★', label: 'تقييم خدماتنا' },
  stat3 = { value: '100%', label: 'تغليف يدوي ملكي' },
  badgeTop = { small: 'جودة أصلية ومضمونة', bold: 'ضمان استبدال واسترجاع' },
  badgeBottom = { small: 'خدمة استثنائية', bold: 'تغليف مجاني مع كل طلب' }
}: HeroShowcaseProps) {
  const activeSlides = slides.length > 0 ? slides : defaultSlides
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-advance slides every 5.5s
  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [activeSlides.length, isPaused])

  const currentSlide = activeSlides[currentSlideIndex % activeSlides.length]

  return (
    <section 
      className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 lg:py-20 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC]"
      dir="rtl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 end-10 w-96 h-96 bg-amber-50/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* ===== RIGHT SIDE (TEXT CONTENT) ===== */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-start">
            
            {/* Top Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#13213c]/5 border border-[#13213c]/10 text-xs font-black text-[#13213c] mb-5 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d97706] animate-pulse" />
              <span>{badge}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-5"
            >
              {headline}
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-8"
            >
              {subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-10"
            >
              {/* Primary CTA */}
              <Link
                href={primaryBtnLink}
                className="inline-flex items-center justify-center gap-2.5 h-13 px-8 rounded-2xl font-black text-white text-base transition-all duration-200 hover:-translate-y-0.5 shadow-[0_6px_20px_rgba(19,33,60,0.3)] hover:shadow-[0_10px_25px_rgba(19,33,60,0.4)] cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
              >
                <span>{primaryBtnText}</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              {/* Secondary CTA */}
              <Link
                href={secondaryBtnLink}
                className="inline-flex items-center justify-center gap-2 h-13 px-7 rounded-2xl font-bold text-slate-800 text-sm sm:text-base bg-white border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs hover:-translate-y-0.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#d97706]" />
                <span>{secondaryBtnText}</span>
              </Link>
            </motion.div>

            {/* Trust Stats Bar */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 border-t border-slate-200/80 w-full max-w-lg"
            >
              <div className="text-center lg:text-start">
                <p className="text-xl sm:text-2xl font-black text-[#13213c] tracking-tight">{stat1.value}</p>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5">{stat1.label}</p>
              </div>
              <div className="text-center lg:text-start">
                <p className="text-xl sm:text-2xl font-black text-[#13213c] tracking-tight">{stat2.value}</p>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5">{stat2.label}</p>
              </div>
              <div className="text-center lg:text-start">
                <p className="text-xl sm:text-2xl font-black text-[#13213c] tracking-tight">{stat3.value}</p>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5">{stat3.label}</p>
              </div>
            </motion.div>
          </div>

          {/* ===== LEFT SIDE (HERO SHOWCASE SLIDER) ===== */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/90 shadow-[0_20px_50px_rgba(19,33,60,0.14)]">
              
              {/* Animated Slides */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentSlide.image}
                    alt={currentSlide.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1424]/90 via-[#0c1424]/30 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Floating Top Badge */}
              {badgeTop?.bold && (
                <div className="absolute top-4 start-4 z-20 hidden sm:flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center">
                    <Award className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-start">
                    <p className="text-[10px] text-slate-500 font-semibold leading-none">{badgeTop.small}</p>
                    <p className="text-xs font-black text-slate-900 leading-tight mt-0.5">{badgeTop.bold}</p>
                  </div>
                </div>
              )}

              {/* Floating Bottom Badge */}
              {badgeBottom?.bold && (
                <div className="absolute top-4 end-4 z-20 hidden sm:flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                  <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center">
                    <Gift className="w-4 h-4 text-[#13213c]" />
                  </div>
                  <div className="text-start">
                    <p className="text-[10px] text-slate-500 font-semibold leading-none">{badgeBottom.small}</p>
                    <p className="text-xs font-black text-slate-900 leading-tight mt-0.5">{badgeBottom.bold}</p>
                  </div>
                </div>
              )}

              {/* Slide Content Caption (Bottom Overlay) */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 z-20 text-start flex flex-col justify-end">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                  >
                    {currentSlide.tag && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black mb-2 border border-white/20">
                        {currentSlide.tag}
                      </span>
                    )}
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-1.5 drop-shadow-xs">
                      {currentSlide.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 line-clamp-1 max-w-lg mb-3">
                      {currentSlide.subtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Slider Controls Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-white/15">
                  {/* Dots Pagination */}
                  <div className="flex items-center gap-1.5">
                    {activeSlides.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={cn(
                          "h-2 rounded-full transition-all duration-300 cursor-pointer",
                          idx === (currentSlideIndex % activeSlides.length)
                            ? "w-7 bg-white shadow-xs"
                            : "w-2 bg-white/40 hover:bg-white/70"
                        )}
                        aria-label={`شريحة ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Prev / Next Arrows */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
                      className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all cursor-pointer"
                      aria-label="السابق"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length)}
                      className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all cursor-pointer"
                      aria-label="التالي"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
