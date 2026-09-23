'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Gift, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  Star, 
  Zap, 
  Heart,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Clock,
  Compass
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductCard } from '@/components/store/product-card'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
  image?: string | null
}

interface Product {
  id: string
  name: string
  price: number
  salePrice?: number | null
  isNew?: boolean
  isBestSeller?: boolean
  images?: string[]
  category?: { name: string } | null
}

interface StoreHomeClientProps {
  initialCategories: Category[]
  initialTopProducts: Product[]
  heroBadge?: string
  heroHeadline?: string
  heroSubheadline?: string
  heroSlides?: any[]
  settings?: any
}

// Verified high-resolution luxury gift showcase slides
const showcaseSlides = [
  {
    id: 'men-luxury',
    title: 'أطقم وساعات رجالية فاخرة',
    subtitle: 'هدية تعبّر عن التقدير والرقي',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1000',
    link: '/category/men',
    tag: 'الأكثر طلباً'
  },
  {
    id: 'women-perfume',
    title: 'عطور ومجوهرات نسائية راقية',
    subtitle: 'أناقة لا مثيل لها لكل مناسبة سعيدة',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=1000',
    link: '/category/women',
    tag: 'تشكيلة حصرية'
  },
  {
    id: 'custom-jewelry',
    title: 'مجوهرات وهدايا مخصصة بالاسم',
    subtitle: 'خلّد اسم من تحب بقطعة استثنائية',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000',
    link: '/category/custom',
    tag: 'صُنعت خصيصاً'
  },
  {
    id: 'gift-boxes',
    title: 'بوكسات هدايا وتغليف ملكي',
    subtitle: 'أشرطة حريرية، ورود وشوكولاتة فاخرة',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1000',
    link: '/category/occasions',
    tag: 'تغليف مجاني'
  }
]

const features = [
  {
    icon: Truck,
    title: 'شحن سريع وموثوق',
    desc: 'توصيل لكافة محافظات العراق خلال 24 - 48 ساعة مع تتبع فوري للشحنة',
    color: '#13213c',
    bg: '#F0F4F9',
  },
  {
    icon: Sparkles,
    title: 'تغليف ملكي فاخر',
    desc: 'علب هدايا فاخرة مع أشرطة حريرية وكارت إهداء بكلماتك مجاناً مع كل طلب',
    color: '#E85D75',
    bg: '#FDF2F4',
  },
  {
    icon: ShieldCheck,
    title: 'دفع آمن عند الاستلام',
    desc: 'عاين هديتك وافحصها قبل الاستلام، مع خيارات دفع بـ زين كاش والماستر كارد',
    color: '#10B981',
    bg: '#F0FDF9',
  },
  {
    icon: Compass,
    title: 'مستشار هدايا ذكي',
    desc: 'خوارزمية ذكية وفريق متخصص يساعدك في اختيار الهدية المثالية لأي مناسبة',
    color: '#6366F1',
    bg: '#F5F3FF',
  },
]

const testimonials = [
  {
    id: 1,
    name: 'مريم العبيدي',
    city: 'بغداد - المنصور',
    text: 'التغليف فوق الخيال وجودة العطر والساعة أصلية 100%. شكراً على الاهتمام بأدق التفاصيل والسرعة في التوصيل!',
    rating: 5,
    gift: 'بوكس نسائي متكامل'
  },
  {
    id: 2,
    name: 'حيدر الكرخي',
    city: 'النجف الأشرف',
    text: 'أفضل متجر هدايا تعاملت وياه بالعراق. طلبت هدية تخرج ووصلتني بنفس اليوم مغلفة بكارت شخصي أنيق جداً.',
    rating: 5,
    gift: 'ساعة يد ومحفظة جلد'
  },
  {
    id: 3,
    name: 'سارة البرزنجي',
    city: 'أربيل',
    text: 'مكتشف الهدايا ساعدني جداً بالاختيار. خدمة العملاء راقية ومهنية والمنتج كان طبق الأصل من الصور.',
    rating: 5,
    gift: 'طقم مجوهرات وعطر'
  },
]

export default function StoreHomeClient({
  initialCategories: categories,
  initialTopProducts: topProducts,
  heroBadge,
  heroHeadline,
  heroSubheadline,
  heroSlides,
  settings
}: StoreHomeClientProps) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeProductTab, setActiveProductTab] = useState<'all' | 'best' | 'new' | 'sale'>('all')

  // Dynamic Showcase Slides from Dedicated DB HeroSlides or Fallback
  const activeShowcaseSlides = useMemo(() => {
    if (heroSlides && Array.isArray(heroSlides) && heroSlides.length > 0) {
      return heroSlides.map((slide: any, idx: number) => ({
        id: slide.id || `slide-${idx}`,
        title: slide.title || 'هدية فاخرة ومميزة',
        subtitle: slide.subtitle || 'تغليف ملكي وجودة استثنائية',
        image: slide.image || showcaseSlides[0].image,
        link: slide.link || '/shop',
        tag: slide.tag || 'مميز'
      }))
    }
    if (settings?.heroSlidesJson) {
      try {
        const parsed = JSON.parse(settings.heroSlidesJson)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((slide: any, idx: number) => ({
            id: slide.id || `slide-${idx}`,
            title: slide.title || 'هدية فاخرة ومميزة',
            subtitle: slide.subtitle || 'تغليف ملكي وجودة استثنائية',
            image: slide.image || showcaseSlides[0].image,
            link: slide.link || '/shop',
            tag: slide.tag || 'مميز'
          }))
        }
      } catch (err) {
        console.error('Error parsing heroSlidesJson:', err)
      }
    }
    return showcaseSlides
  }, [heroSlides, settings?.heroSlidesJson])

  const safeSlideIndex = activeShowcaseSlides.length > 0 ? (activeSlide % activeShowcaseSlides.length) : 0
  const currentSlide = activeShowcaseSlides[safeSlideIndex] || showcaseSlides[0]

  const dynamicFeatures = [
    {
      icon: Truck,
      title: settings?.feature1Title || 'شحن سريع وموثوق',
      desc: settings?.feature1Desc || 'توصيل لكافة محافظات العراق خلال 24 - 48 ساعة مع تتبع فوري للشحنة',
      color: '#13213c',
      bg: '#F0F4F9',
    },
    {
      icon: Sparkles,
      title: settings?.feature2Title || 'تغليف ملكي فاخر',
      desc: settings?.feature2Desc || 'علب هدايا فاخرة مع أشرطة حريرية وكارت إهداء بكلماتك مجاناً مع كل طلب',
      color: '#E85D75',
      bg: '#FDF2F4',
    },
    {
      icon: ShieldCheck,
      title: settings?.feature3Title || 'دفع آمن عند الاستلام',
      desc: settings?.feature3Desc || 'عاين هديتك وافحصها قبل الاستلام، مع خيارات دفع بـ زين كاش والماستر كارد',
      color: '#10B981',
      bg: '#F0FDF9',
    },
    {
      icon: Compass,
      title: settings?.feature4Title || 'مستشار هدايا ذكي',
      desc: settings?.feature4Desc || 'خوارزمية ذكية وفريق متخصص يساعدك في اختيار الهدية المثالية لأي مناسبة',
      color: '#6366F1',
      bg: '#F5F3FF',
    },
  ]

  // Interactive Gift Finder Mini Quiz State
  const [quizRecipient, setQuizRecipient] = useState<'him' | 'her' | 'occasions' | null>(null)
  const [quizBudget, setQuizBudget] = useState<string | null>(null)

  // Filter products by tab
  const filteredProducts = topProducts.filter(p => {
    if (activeProductTab === 'best') return p.isBestSeller
    if (activeProductTab === 'new') return p.isNew
    if (activeProductTab === 'sale') return p.salePrice && p.salePrice < p.price
    return true
  })

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8] text-stone-900 overflow-x-hidden" dir="rtl">

      {/* ========================================================================= */}
      {/* 1. ULTRA-MODERN LUXURY HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-6 pb-16 lg:py-20 flex flex-col justify-center">
        {/* Soft Luxury Glow Backgrounds */}
        <div className="absolute top-0 start-1/4 w-[500px] h-[500px] bg-[#13213c]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 end-10 w-[450px] h-[450px] bg-[#E85D75]/6 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        {/* Subtle geometric dot matrix */}
        <div 
          className="absolute inset-0 opacity-[0.025] -z-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #1C1917 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            {/* RIGHT COLUMN: Master Storytelling & CTA (Arabic Reading Start) */}
            <div className="lg:col-span-6 xl:col-span-7 text-start relative z-10 flex flex-col items-start">
              
              {/* Shimmering Badge */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 bg-[#F0F4F9] border border-[#13213c]/30 rounded-full px-4 py-2 text-xs sm:text-sm font-bold text-[#13213c] mb-6 shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-[#13213c] animate-pulse" />
                <span>{settings?.heroBadge || heroBadge || 'التشكيلة الجديدة لعام 2026 • تغليف ملكي مجاني'}</span>
              </motion.div>

              {/* Master Headline (Alexandria Luxury Style) */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-[#1C1917] mb-6"
              >
                {(settings?.heroHeadline || heroHeadline) ? (
                  <span dangerouslySetInnerHTML={{ __html: (settings?.heroHeadline || heroHeadline).replace(/\n/g, '<br/>') }} />
                ) : (
                  <>
                    <span>لحظاتك الثمينة</span>
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#13213c] via-[#22385e] to-[#3b5e94]">
                      تستحق أفخم الهدايا.
                    </span>
                  </>
                )}
              </motion.h1>

              {/* Subheadline with warm readability */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg text-[#57534E] max-w-xl mb-8 leading-relaxed font-normal"
              >
                {settings?.heroSubheadline || heroSubheadline || 'اكتشف تجربة إهداء استثنائية في العراق تجمع بين فخامة التصميم وأناقة التفاصيل، مع تغليف يدوي فاخر وبطاقة مخصصة تخلّد أجمل الذكريات.'}
              </motion.p>

              {/* Quick Category Chips */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="flex flex-wrap items-center gap-2 mb-8"
              >
                <span className="text-xs font-bold text-[#A8A29E] me-1">أكثر الأقسام طلباً:</span>
                {[
                  { label: 'ساعات راقية', href: '/category/men' },
                  { label: 'عطور ومجوهرات', href: '/category/women' },
                  { label: 'هدايا مخصصة', href: '/category/custom' },
                  { label: 'بوكسات مناسبات', href: '/category/occasions' },
                ].map(chip => (
                  <Link
                    key={chip.label}
                    href={chip.href}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-[#E8E4DF] hover:border-[#13213c] hover:bg-[#F0F4F9] text-[#44403C] hover:text-[#13213c] transition-all"
                  >
                    {chip.label}
                  </Link>
                ))}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10"
              >
                <Link
                  href={settings?.heroPrimaryBtnLink || '/shop'}
                  className="group flex items-center justify-center gap-2.5 h-13 sm:h-14 px-8 sm:px-9 rounded-2xl text-white font-extrabold text-base transition-all hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)',
                    boxShadow: '0 6px 24px rgba(19, 33, 60,0.38)'
                  }}
                >
                  <span>{settings?.heroPrimaryBtnText || 'استكشف التشكيلة الفاخرة'}</span>
                  <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                </Link>

                <Link
                  href={settings?.heroSecondaryBtnLink || '/gift-finder'}
                  className="flex items-center justify-center gap-2 h-13 sm:h-14 px-7 rounded-2xl font-extrabold text-[#1C1917] bg-white border border-[#E8E4DF] hover:border-[#13213c]/50 hover:bg-[#F0F4F9] transition-all hover:-translate-y-0.5 shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-[#13213c]" />
                  <span>{settings?.heroSecondaryBtnText || 'مكتشف الهدايا الذكي'}</span>
                </Link>
              </motion.div>

              {/* Trust Indicators Pill Row (Clean RTL) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-3 gap-4 sm:gap-8 pt-6 border-t border-[#E8E4DF]/70 w-full max-w-xl text-start"
              >
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#1C1917]" dir="ltr">{settings?.stat1Value || '15K+'}</p>
                  <p className="text-xs text-[#78716C] font-semibold mt-0.5">{settings?.stat1Label || 'عميل سعيد بالعراق'}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-2xl sm:text-3xl font-black text-[#1C1917]">
                    <span className="text-[#13213c] text-xl">★</span>
                    <span dir="ltr">{settings?.stat2Value || '4.9'}</span>
                  </div>
                  <p className="text-xs text-[#78716C] font-semibold mt-0.5">{settings?.stat2Label || 'تقييم ممتاز موثق'}</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[#13213c]">{settings?.stat3Value || '100%'}</p>
                  <p className="text-xs text-[#78716C] font-semibold mt-0.5">{settings?.stat3Label || 'تغليف ملكي مجاني'}</p>
                </div>
              </motion.div>
            </div>

            {/* LEFT COLUMN: Modern Interactive Luxury Showcase Slider */}
            <div className="lg:col-span-6 xl:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">

                {/* Main Showcase Card */}
                <div 
                  className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.14)] border border-[#E8E4DF] bg-stone-100 group"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide.id || safeSlideIndex}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.45 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={currentSlide.image}
                        alt={currentSlide.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                      {/* Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/90 via-[#1C1917]/25 to-transparent" />
                      
                      {/* Top Tag */}
                      <div className="absolute top-4 start-4 z-10">
                        <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black text-[#1C1917] shadow-sm">
                          <Flame className="w-3.5 h-3.5 text-[#E85D75]" />
                          {currentSlide.tag}
                        </span>
                      </div>

                      {/* Bottom Info */}
                      <div className="absolute bottom-0 inset-x-0 p-6 z-10 text-start">
                        <h3 className="text-xl sm:text-2xl font-black text-white mb-1.5">
                          {currentSlide.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-white/75 mb-4">
                          {currentSlide.subtitle}
                        </p>
                        <Link
                          href={currentSlide.link}
                          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#7ea6e6] hover:text-white transition-colors"
                        >
                          <span>تصفح هذه المجموعة الآن</span>
                          <ArrowLeft className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  <div className="absolute top-4 end-4 z-20 flex items-center gap-2">
                    <button
                      onClick={() => setActiveSlide((prev) => (prev === 0 ? activeShowcaseSlides.length - 1 : prev - 1))}
                      className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#1C1917] hover:bg-white transition-all shadow-xs cursor-pointer"
                      aria-label="السابق"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveSlide((prev) => (prev === activeShowcaseSlides.length - 1 ? 0 : prev + 1))}
                      className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#1C1917] hover:bg-white transition-all shadow-xs cursor-pointer"
                      aria-label="التالي"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Floating Glassmorphic Badge: Top Right */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="hidden sm:flex items-center gap-3 absolute -top-5 -start-6 bg-white/95 backdrop-blur-xl rounded-2xl p-3.5 shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-[#E8E4DF] z-20"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F0F4F9] flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-[#13213c]" />
                  </div>
                  <div className="text-start">
                    <p className="text-[11px] text-[#A8A29E] font-bold">{settings?.heroBadgeTopSmall || 'جودة أصلية ومضمونة'}</p>
                    <p className="text-xs font-black text-[#1C1917]">{settings?.heroBadgeTopBold || 'ضمان استبدال واسترجاع'}</p>
                  </div>
                </motion.div>

                {/* Floating Glassmorphic Badge: Bottom Left */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="hidden sm:flex items-center gap-3 absolute -bottom-5 -end-6 bg-white/95 backdrop-blur-xl rounded-2xl p-3.5 shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-[#E8E4DF] z-20"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5 text-[#E85D75]" />
                  </div>
                  <div className="text-start">
                    <p className="text-[11px] text-[#A8A29E] font-bold">{settings?.heroBadgeBottomSmall || 'خدمة استثنائية'}</p>
                    <p className="text-xs font-black text-[#1C1917]">{settings?.heroBadgeBottomBold || 'تغليف مجاني مع كل طلب'}</p>
                  </div>
                </motion.div>

                {/* Showcase Switcher Pills */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  {activeShowcaseSlides.map((slide, idx) => (
                    <button
                      key={slide.id}
                      onClick={() => setActiveSlide(idx)}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300 cursor-pointer",
                        safeSlideIndex === idx 
                          ? "w-8 bg-[#13213c]" 
                          : "w-2 bg-[#E8E4DF] hover:bg-[#A8A29E]"
                      )}
                      aria-label={`شريحة ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. HIGH-TECH BENTO FEATURES BAR */}
      {/* ========================================================================= */}
      <section className="py-12 bg-white border-y border-[#E8E4DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {dynamicFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]/80 hover:border-[#13213c]/40 hover:bg-white hover:shadow-[0_8px_25px_rgba(19, 33, 60,0.1)] transition-all duration-300 text-start group"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-2xs"
                  style={{ background: feature.bg }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#1C1917] text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-[#78716C] leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CATEGORIES SHOWCASE GRID */}
      {/* ========================================================================= */}
      {categories.length > 0 && (
        <section className="py-16 sm:py-20 bg-[#FAFAF8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="flex items-end justify-between mb-10 text-start">
              <div>
                <p className="text-xs font-extrabold text-[#13213c] uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#13213c]" />
                  تشكيلات منتقاة بعناية
                </p>
                <h2 className="text-2xl sm:text-4xl font-black text-[#1C1917] tracking-tight">
                  تصفح الهدايا حسب الأقسام
                </h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#13213c] hover:text-[#1C1917] transition-colors"
              >
                <span>جميع الأقسام</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            {/* Grid Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/5] flex flex-col justify-end p-4 border border-[#E8E4DF] bg-stone-100 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300"
                >
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 16vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#F5F0EA] to-[#E8DFD3]" />
                  )}
                  {/* Subtle Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/85 via-[#1C1917]/20 to-transparent" />

                  {/* Text Label */}
                  <div className="relative z-10 text-start">
                    <p className="text-[10px] text-[#7ea6e6] font-bold uppercase tracking-wider mb-0.5">تصفح</p>
                    <h3 className="text-white font-black text-sm sm:text-base leading-snug group-hover:text-[#7ea6e6] transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. CURATED PRODUCTS SHOWCASE (TABS & DYNAMIC GRID) */}
      {/* ========================================================================= */}
      {topProducts.length > 0 && (
        <section className="py-16 sm:py-20 bg-white border-t border-[#E8E4DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header & Filter Tabs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 text-start">
              <div>
                <p className="text-xs font-extrabold text-[#E85D75] uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  أفخم الاختيارات
                </p>
                <h2 className="text-2xl sm:text-4xl font-black text-[#1C1917] tracking-tight">
                  المنتجات الأكثر رواجاً وإهداءً
                </h2>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-[#F8F5F0] p-1.5 rounded-2xl border border-[#E8E4DF] overflow-x-auto scrollbar-none self-start md:self-auto">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'best', label: '🔥 الأكثر طلباً' },
                  { id: 'new', label: '✨ جديدنا' },
                  { id: 'sale', label: '🏷️ تخفيضات' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveProductTab(tab.id as any)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0",
                      activeProductTab === tab.id
                        ? "bg-white text-[#1C1917] shadow-xs font-extrabold"
                        : "text-[#78716C] hover:text-[#1C1917]"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.slice(0, 8).map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Bottom View All Link */}
            <div className="mt-12 text-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl bg-[#F8F5F0] hover:bg-[#F0EBE1] border border-[#E8E4DF] text-xs font-bold text-[#1C1917] transition-all hover:-translate-y-0.5"
              >
                <span>استكشف جميع منتجات المتجر</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE GIFT FINDER MINI-QUIZ BANNER */}
      {/* ========================================================================= */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div 
            className="relative rounded-3xl p-8 sm:p-12 lg:p-14 overflow-hidden border border-[#13213c]/30 text-start"
            style={{
              background: 'linear-gradient(135deg, #0c1424 0%, #13213c 60%, #0c1424 100%)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
            }}
          >
            {/* Background Glows */}
            <div className="absolute top-0 end-0 w-80 h-80 bg-[#13213c]/12 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 start-0 w-80 h-80 bg-[#E85D75]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Left Content */}
              <div className="lg:col-span-6 text-start">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-blue-500/20 text-[#93c5fd] border border-blue-400/30 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-[#93c5fd]" />
                  مستشار الإهداء الذكي
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
                  محتار في اختيار الهدية المناسبة؟
                </h2>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6">
                  دع ذكاء المتجر يختار لك الهدية المثالية بناءً على الشخص والمناسبة وميزانيتك بضغطة زر واحدة.
                </p>
                <div className="flex items-center gap-4 text-xs text-white/70">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[#7ea6e6]" /> توصيات دقيقة</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[#7ea6e6]" /> وفر وقتك وجهدك</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[#7ea6e6]" /> تغليف ملائم للمناسبة</span>
                </div>
              </div>

              {/* Right Mini-Interactive Widget */}
              <div className="lg:col-span-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15">
                <p className="text-xs font-black text-[#93c5fd] mb-3">الخطوة 1: لمن الهدية؟</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { id: 'him', label: 'له 👨', href: '/category/men' },
                    { id: 'her', label: 'لها 👩', href: '/category/women' },
                    { id: 'occasions', label: 'مناسبات 💍', href: '/category/occasions' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setQuizRecipient(item.id as any)}
                      className={cn(
                        "py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                        quizRecipient === item.id
                          ? "bg-blue-600 text-white border-blue-400 font-black shadow-[0_2px_12px_rgba(37,99,235,0.45)] scale-[1.02]"
                          : "bg-white/10 text-white/90 border-white/15 hover:bg-white/20 hover:text-white"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <p className="text-xs font-black text-[#93c5fd] mb-3">الخطوة 2: حدد الميزانية التقريبية</p>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[
                    { id: '50k', label: 'أقل من 50 ألف د.ع' },
                    { id: '100k', label: '50 - 100 ألف د.ع' },
                    { id: 'more', label: 'أكثر من 100 ألف د.ع' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setQuizBudget(b.id)}
                      className={cn(
                        "py-2.5 px-2 rounded-xl text-[11px] font-bold transition-all border cursor-pointer",
                        quizBudget === b.id
                          ? "bg-blue-600 text-white border-blue-400 font-black shadow-[0_2px_12px_rgba(37,99,235,0.45)] scale-[1.02]"
                          : "bg-white/10 text-white/90 border-white/15 hover:bg-white/20 hover:text-white"
                      )}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>

                <Link
                  href={quizRecipient ? `/category/${quizRecipient}` : '/gift-finder'}
                  className="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-black text-white text-sm transition-all hover:brightness-110 hover:-translate-y-0.5 shadow-[0_4px_25px_rgba(37,99,235,0.45)] border border-blue-400/40 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #13213c 100%)' }}
                >
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>اعثر على الهدية الآن</span>
                  <ArrowLeft className="w-4 h-4 text-blue-200" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. REAL SOCIAL PROOF / TESTIMONIALS */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white border-t border-[#E8E4DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-start">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-black text-[#13213c] uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1">
              <Heart className="w-3.5 h-3.5 text-[#E85D75] fill-[#E85D75]" />
              آراء حقيقية من عملائنا
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-[#1C1917] tracking-tight">
              تجارب استثنائية شاركنا بها أحبائنا
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-3xl bg-[#FAFAF8] border border-[#E8E4DF] hover:border-[#13213c]/40 hover:shadow-[0_8px_30px_rgba(19, 33, 60,0.08)] transition-all text-start flex flex-col"
              >
                {/* Stars */}
                <div className="flex items-center gap-1 text-[#13213c] mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#13213c]" />
                  ))}
                </div>

                <p className="text-sm text-[#44403C] leading-relaxed mb-6 flex-1 italic">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="pt-4 border-t border-[#F0ECE6] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-[#1C1917]">{t.name}</p>
                    <p className="text-[11px] text-[#A8A29E]">{t.city}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0F4F9] text-[#13213c] border border-[#13213c]/20">
                    {t.gift}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  )
}
