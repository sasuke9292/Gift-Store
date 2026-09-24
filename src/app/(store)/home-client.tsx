'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Gift, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  Star, 
  Heart,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Compass,
  MessageCircle,
  Package
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

// 100% Verified High-Resolution Showcase Slides (Top Luxury Gift Categories)
const showcaseSlides = [
  {
    id: 'women-perfume',
    title: 'عطور ومجوهرات نسائية راقية',
    subtitle: 'أناقة لا مثيل لها لكل مناسبة سعيدة وتغليف مخملي فاخر',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=1000',
    link: '/category/women',
    tag: 'تشكيلة حصرية'
  },
  {
    id: 'men-luxury',
    title: 'أطقم وساعات رجالية فاخرة',
    subtitle: 'هدية تعبّر عن التقدير والرقي بلمسات جلدية ومعدنية أصلية',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1000',
    link: '/category/men',
    tag: 'الأكثر طلباً'
  },
  {
    id: 'gift-boxes',
    title: 'بوكسات هدايا وتغليف ملكي',
    subtitle: 'أشرطة حريرية، ورود طبيعية وشوكولاتة بلجيكية فاخرة',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1000',
    link: '/category/occasions',
    tag: 'تغليف مجاني'
  },
  {
    id: 'custom-jewelry',
    title: 'مجوهرات وهدايا مخصصة بالاسم',
    subtitle: 'خلّد اسم من تحب بقطعة استثنائية صُنعت خصيصاً له',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000',
    link: '/category/custom',
    tag: 'صُنعت بالاسم'
  }
]

// Fallback images for categories so NO card ever renders as a blank box
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  men: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
  women: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
  occasions: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
  custom: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
  kids: 'https://images.unsplash.com/photo-1560859254-809fa84742f3?auto=format&fit=crop&q=80&w=800',
  offers: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800',
  electronics: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
}

// Curated Gifting Personas / Occasions (High-Impact Luxury Feature)
const recipientPersonas = [
  {
    id: 'her',
    title: 'هدايا لها',
    subtitle: 'عطور راقية، مجوهرات وبوكسات دلال',
    tag: 'الأكثر رقة',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
    link: '/category/women',
    btnText: 'اكتشف هداياها'
  },
  {
    id: 'him',
    title: 'هدايا له',
    subtitle: 'ساعات فاخرة، أطقم محافظ ومسابح ملكية',
    tag: 'فخامة وهيبة',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
    link: '/category/men',
    btnText: 'اكتشف هداياه'
  },
  {
    id: 'occasions',
    title: 'مناسبات وأفراح',
    subtitle: 'تخرج، زواج، خطوبة وذكرى سنوية',
    tag: 'لحظات استثنائية',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
    link: '/category/occasions',
    btnText: 'تصفح المناسبات'
  },
  {
    id: 'custom',
    title: 'مخصصة بالاسم',
    subtitle: 'قطع محفورة وتنسيق خاص يخلد الذكرى',
    tag: 'لمسة شخصية',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
    link: '/category/custom',
    btnText: 'صمم هديتك'
  }
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
    text: 'أفضل متجر هدايا تعاملت معه في العراق. طلبت هدية تخرج ووصلتني بنفس اليوم مغلفة بكرت شخصي أنيق جداً.',
    rating: 5,
    gift: 'ساعة يد ومحفظة جلد'
  },
  {
    id: 3,
    name: 'سارة البرزنجي',
    city: 'أربيل',
    text: 'مستشار الهدايا ساعدني جداً بالاختيار. خدمة العملاء راقية ومهنية والمنتج كان طبق الأصل من الصور تماماً.',
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
  const [isHovered, setIsHovered] = useState(false)

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

  // Auto-play slideshow every 5.5s (pauses gracefully on hover)
  useEffect(() => {
    if (activeShowcaseSlides.length <= 1 || isHovered) return

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % activeShowcaseSlides.length)
    }, 5500)

    return () => clearInterval(timer)
  }, [activeShowcaseSlides.length, isHovered])

  // Dynamic Trust & Guarantees Pillars
  const trustPillars = [
    {
      icon: Truck,
      title: settings?.feature1Title || 'شحن سريع وموثوق',
      desc: settings?.feature1Desc || 'توصيل لكافة محافظات العراق خلال 24 - 48 ساعة مع تتبع فوري للشحنة',
      color: '#13213c',
      bg: '#F0F4F9',
    },
    {
      icon: Gift,
      title: settings?.feature2Title || 'تغليف ملكي فاخر',
      desc: settings?.feature2Desc || 'علب هدايا فاخرة مع أشرطة حريرية وكارت إهداء بكلماتك مجاناً مع كل طلب',
      color: '#13213c',
      bg: '#F0F4F9',
    },
    {
      icon: ShieldCheck,
      title: settings?.feature3Title || 'دفع آمن عند الاستلام',
      desc: settings?.feature3Desc || 'عاين هديتك وافحصها قبل الاستلام، مع خيارات دفع بـ زين كاش والماستر كارد',
      color: '#10B981',
      bg: '#F0FDF9',
    },
    {
      icon: Award,
      title: settings?.feature4Title || 'جودة أصلية ومضمونة',
      desc: settings?.feature4Desc || 'منتجات منتقاة بعناية فائقة مع ضمان حقيقي للاستبدال والاسترجاع بكل سهولة',
      color: '#13213c',
      bg: '#F0F4F9',
    },
  ]

  // Dynamic Recipient Personas
  const activePersonas = useMemo(() => {
    return [
      {
        id: 'her',
        title: settings?.persona1Title || recipientPersonas[0].title,
        subtitle: settings?.persona1Subtitle || recipientPersonas[0].subtitle,
        tag: settings?.persona1Tag || recipientPersonas[0].tag,
        image: settings?.persona1Image || recipientPersonas[0].image,
        link: settings?.persona1Link || recipientPersonas[0].link,
        btnText: settings?.persona1BtnText || recipientPersonas[0].btnText
      },
      {
        id: 'him',
        title: settings?.persona2Title || recipientPersonas[1].title,
        subtitle: settings?.persona2Subtitle || recipientPersonas[1].subtitle,
        tag: settings?.persona2Tag || recipientPersonas[1].tag,
        image: settings?.persona2Image || recipientPersonas[1].image,
        link: settings?.persona2Link || recipientPersonas[1].link,
        btnText: settings?.persona2BtnText || recipientPersonas[1].btnText
      },
      {
        id: 'occasions',
        title: settings?.persona3Title || recipientPersonas[2].title,
        subtitle: settings?.persona3Subtitle || recipientPersonas[2].subtitle,
        tag: settings?.persona3Tag || recipientPersonas[2].tag,
        image: settings?.persona3Image || recipientPersonas[2].image,
        link: settings?.persona3Link || recipientPersonas[2].link,
        btnText: settings?.persona3BtnText || recipientPersonas[2].btnText
      },
      {
        id: 'custom',
        title: settings?.persona4Title || recipientPersonas[3].title,
        subtitle: settings?.persona4Subtitle || recipientPersonas[3].subtitle,
        tag: settings?.persona4Tag || recipientPersonas[3].tag,
        image: settings?.persona4Image || recipientPersonas[3].image,
        link: settings?.persona4Link || recipientPersonas[3].link,
        btnText: settings?.persona4BtnText || recipientPersonas[3].btnText
      }
    ]
  }, [settings])

  // Interactive Gift Finder Mini Quiz State
  const [quizRecipient, setQuizRecipient] = useState<'men' | 'women' | 'occasions' | 'custom' | null>('women')
  const [quizBudget, setQuizBudget] = useState<string>('50k-100k')

  // Filter products by tab
  const filteredProducts = useMemo(() => {
    return topProducts.filter(p => {
      if (activeProductTab === 'best') return p.isBestSeller
      if (activeProductTab === 'new') return p.isNew
      if (activeProductTab === 'sale') return p.salePrice && p.salePrice < p.price
      return true
    })
  }, [topProducts, activeProductTab])

  const whatsappPhone = settings?.whatsappNumber || '9647700000000'

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8] text-stone-900 overflow-x-hidden font-sans" dir="rtl">

      {/* ========================================================================= */}
      {/* 1. ROYAL LUXURY HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-6 sm:pt-8 pb-14 lg:pb-18 flex flex-col justify-center">
        {/* Soft Royal Glow Accents */}
        <div className="absolute top-0 start-1/4 w-[550px] h-[550px] bg-[#13213c]/8 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 end-10 w-[450px] h-[450px] bg-[#22385e]/6 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        {/* Subtle geometric dot matrix */}
        <div 
          className="absolute inset-0 opacity-[0.025] -z-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #13213c 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            {/* RIGHT COLUMN: Master Brand Hook & Elevated CTAs */}
            <div className="lg:col-span-6 xl:col-span-7 text-start relative z-10 flex flex-col items-start">
              
              {/* Shimmering Badge */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 bg-[#F0F4F9] border border-[#13213c]/20 rounded-full px-4 py-2 text-xs sm:text-sm font-black text-[#13213c] mb-6 shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-[#13213c] shrink-0" />
                <span>{settings?.heroBadge || heroBadge || 'التشكيلة الملكية لعام 2026 • هدايا استثنائية وتغليف مجاني'}</span>
              </motion.div>

              {/* Master Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.18] text-[#1C1917] mb-6"
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

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg text-[#57534E] max-w-xl mb-8 leading-relaxed font-normal"
              >
                {settings?.heroSubheadline || heroSubheadline || 'اكتشف تجربة إهداء استثنائية في العراق تجمع بين فخامة التصميم وأناقة التفاصيل، مع تغليف يدوي فاخر وبطاقة مخصصة تخلّد أجمل الذكريات.'}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10"
              >
                <Link
                  href={settings?.heroPrimaryBtnLink || '/shop'}
                  className="group flex items-center justify-center gap-2.5 h-13 sm:h-14 px-8 sm:px-9 rounded-2xl text-white font-extrabold text-base transition-all hover:-translate-y-0.5 shadow-[0_6px_24px_rgba(19,33,60,0.35)] cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)'
                  }}
                >
                  <span>{settings?.heroPrimaryBtnText || 'استكشف التشكيلة الفاخرة'}</span>
                  <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                </Link>

                <Link
                  href={settings?.heroSecondaryBtnLink || '#gift-finder-section'}
                  className="flex items-center justify-center gap-2 h-13 sm:h-14 px-7 rounded-2xl font-extrabold text-[#1C1917] bg-white border border-[#E8E4DF] hover:border-[#13213c]/50 hover:bg-[#F0F4F9] transition-all hover:-translate-y-0.5 shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-[#13213c]" />
                  <span>{settings?.heroSecondaryBtnText || 'مستشار الهدايا الذكي'}</span>
                </Link>
              </motion.div>

              {/* Trust Indicators (Refined RTL Layout) */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="pt-6 border-t border-[#E8E4DF] w-full max-w-xl"
              >
                <div className="grid grid-cols-3 divide-x divide-x-reverse divide-[#E8E4DF]">
                  {/* Stat 1 */}
                  <div className="flex flex-col items-center justify-center text-center px-2 sm:px-4">
                    <p className="text-2xl sm:text-3xl font-black text-[#13213c] tracking-tight" dir="ltr">
                      {settings?.stat1Value || '+15K'}
                    </p>
                    <p className="text-xs text-[#78716C] font-bold mt-1 text-center">
                      {settings?.stat1Label || 'عميل يثق بنا'}
                    </p>
                  </div>

                  {/* Stat 2 */}
                  <div className="flex flex-col items-center justify-center text-center px-2 sm:px-4">
                    <div className="inline-flex items-center justify-center gap-1.5 text-2xl sm:text-3xl font-black text-[#13213c] tracking-tight">
                      <span dir="ltr" className="tabular-nums">
                        {(settings?.stat2Value || '4.9').replace(/[★⭐*]/g, '').trim() || '4.9'}
                      </span>
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-[#13213c] text-[#13213c] shrink-0" />
                    </div>
                    <p className="text-xs text-[#78716C] font-bold mt-1 text-center">
                      {settings?.stat2Label || 'تقييم العملاء'}
                    </p>
                  </div>

                  {/* Stat 3 */}
                  <div className="flex flex-col items-center justify-center text-center px-2 sm:px-4">
                    <p className="text-2xl sm:text-3xl font-black text-[#13213c] tracking-tight" dir="ltr">
                      {settings?.stat3Value || '100%'}
                    </p>
                    <p className="text-xs text-[#78716C] font-bold mt-1 text-center">
                      {settings?.stat3Label || 'تغليف ملكي مجاني'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* LEFT COLUMN: Modern Interactive Luxury Showcase Slider */}
            <div className="lg:col-span-6 xl:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">

                {/* Main Showcase Card */}
                <div 
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-[#E8E4DF] bg-stone-100 group select-none"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide.id || safeSlideIndex}
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.45 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={currentSlide.image}
                        alt={currentSlide.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c1424]/95 via-[#0c1424]/30 to-transparent" />
                      
                      {/* Top Tag */}
                      <div className="absolute top-4 start-4 z-10">
                        <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black text-[#13213c] shadow-sm">
                          <Flame className="w-3.5 h-3.5 text-[#13213c]" />
                          {currentSlide.tag}
                        </span>
                      </div>

                      {/* Bottom Info */}
                      <div className="absolute bottom-0 inset-x-0 p-6 sm:p-7 z-10 text-start">
                        <h3 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">
                          {currentSlide.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-white/80 mb-4 line-clamp-2 leading-relaxed">
                          {currentSlide.subtitle}
                        </p>
                        <Link
                          href={currentSlide.link}
                          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#7ea6e6] hover:text-white transition-all group/link"
                        >
                          <span>تصفح هذه المجموعة الآن</span>
                          <ArrowLeft className="w-4 h-4 transition-transform group-hover/link:-translate-x-1" />
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  <div className="absolute top-4 end-4 z-20 flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveSlide((prev) => (prev === 0 ? activeShowcaseSlides.length - 1 : prev - 1))}
                      className="w-8 h-8 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-[#13213c] hover:bg-white hover:scale-105 transition-all shadow-xs cursor-pointer active:scale-95"
                      aria-label="الشريحة السابقة"
                      title="السابق"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveSlide((prev) => (prev === activeShowcaseSlides.length - 1 ? 0 : prev + 1))}
                      className="w-8 h-8 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-[#13213c] hover:bg-white hover:scale-105 transition-all shadow-xs cursor-pointer active:scale-95"
                      aria-label="الشريحة التالية"
                      title="التالي"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Floating Glassmorphic Badge: Top Right */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="hidden sm:flex items-center gap-3 absolute -top-5 start-2 sm:-start-5 bg-white/95 backdrop-blur-xl rounded-2xl p-3 sm:p-3.5 shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-[#E8E4DF] z-20 pointer-events-none"
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
                  className="hidden sm:flex items-center gap-3 absolute -bottom-5 end-2 sm:-end-5 bg-white/95 backdrop-blur-xl rounded-2xl p-3 sm:p-3.5 shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-[#E8E4DF] z-20 pointer-events-none"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F0F4F9] flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5 text-[#13213c]" />
                  </div>
                  <div className="text-start">
                    <p className="text-[11px] text-[#A8A29E] font-bold">{settings?.heroBadgeBottomSmall || 'خدمة استثنائية'}</p>
                    <p className="text-xs font-black text-[#1C1917]">{settings?.heroBadgeBottomBold || 'تغليف مجاني مع كل طلب'}</p>
                  </div>
                </motion.div>

                {/* Showcase Switcher Pills & Counter */}
                <div className="flex items-center justify-between gap-3 mt-4 px-2">
                  {/* Slide Numeric Counter */}
                  <div className="flex items-center gap-1 text-xs font-black text-[#13213c] tabular-nums" dir="ltr">
                    <span>{String(safeSlideIndex + 1).padStart(2, '0')}</span>
                    <span className="text-[#A8A29E] font-normal">/</span>
                    <span className="text-[#78716C] font-semibold">{String(activeShowcaseSlides.length).padStart(2, '0')}</span>
                  </div>

                  {/* Switcher Pills */}
                  <div className="flex items-center justify-center gap-2 flex-1">
                    {activeShowcaseSlides.map((slide, idx) => (
                      <button
                        key={slide.id}
                        onClick={() => setActiveSlide(idx)}
                        className={cn(
                          "h-2 rounded-full transition-all duration-300 cursor-pointer",
                          safeSlideIndex === idx 
                            ? "w-8 bg-[#13213c] shadow-xs" 
                            : "w-2.5 bg-[#E8E4DF] hover:bg-[#A8A29E]"
                        )}
                        aria-label={`انتقال إلى الشريحة ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Hint */}
                  <span className="text-[10px] text-[#A8A29E] font-bold hidden sm:inline-block">
                    {isHovered ? 'موقوف مؤقتاً' : 'تفاعلي تلقائي'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. REFINED LUXURY TRUST & VALUE RIBBON */}
      {/* ========================================================================= */}
      <section className="py-8 bg-white border-y border-[#E8E4DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {trustPillars.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF] hover:border-[#13213c]/30 hover:bg-white hover:shadow-sm transition-all duration-200 text-start group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                  style={{ background: feature.bg }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-[#1C1917] text-sm mb-0.5 truncate">{feature.title}</h3>
                  <p className="text-xs text-[#78716C] leading-relaxed line-clamp-2">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. NEW: SHOP BY RECIPIENT & OCCASION (هدايا مختارة بعناية لمن تحب) */}
      {/* ========================================================================= */}
      {settings?.enablePersonasSection !== false && (
        <section className="py-14 sm:py-18 bg-[#FAFAF8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 text-start">
              <div>
                <p className="text-xs font-black text-[#13213c] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#13213c]" />
                  <span>{settings?.personaSectionBadge || 'دليل الإهداء الذكي'}</span>
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C1917] tracking-tight">
                  {settings?.personaSectionTitle || 'هدايا مختارة بعناية لمن تحب'}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#78716C] max-w-md">
                {settings?.personaSectionDesc || 'اختر الشخص أو المناسبة لتشاهد مجموعات منتقاة يدوياً بعناية ومغلفة بأعلى درجات الفخامة.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {activePersonas.map((persona) => (
                <Link
                  key={persona.id}
                  href={persona.link}
                  className="group relative rounded-3xl overflow-hidden aspect-[4/5] flex flex-col justify-end p-6 border border-[#E8E4DF] bg-stone-100 shadow-xs hover:shadow-[0_16px_40px_rgba(19,33,60,0.14)] hover:-translate-y-1.5 transition-all duration-300"
                >
                  <Image
                    src={persona.image}
                    alt={persona.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  {/* Royal Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1424]/95 via-[#0c1424]/40 to-transparent" />
                  
                  {/* Floating Pill Tag */}
                  <div className="absolute top-4 start-4 z-10">
                    <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black text-[#13213c] shadow-xs">
                      {persona.tag}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 text-start">
                    <h3 className="text-xl sm:text-2xl font-black text-white mb-1.5 group-hover:text-[#7ea6e6] transition-colors">
                      {persona.title}
                    </h3>
                    <p className="text-xs text-white/80 leading-relaxed mb-4 line-clamp-2">
                      {persona.subtitle}
                    </p>
                    <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#7ea6e6] group-hover:text-white transition-colors">
                      <span>{persona.btnText}</span>
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. CURATED CATEGORIES SHOWCASE GRID */}
      {/* ========================================================================= */}
      {categories.length > 0 && (
        <section className="py-14 sm:py-18 bg-white border-t border-[#E8E4DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="flex items-end justify-between mb-10 text-start">
              <div>
                <p className="text-xs font-black text-[#13213c] uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-[#13213c]" />
                  <span>{settings?.categoriesSectionBadge || 'كتالوج التشكيلات الراقية'}</span>
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C1917] tracking-tight">
                  {settings?.categoriesSectionTitle || 'تصفح الهدايا حسب الأقسام'}
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

            {/* Grid Cards (With 100% Guaranteed Image Fallbacks) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {categories.slice(0, 6).map((cat) => {
                const categoryImg = cat.image || CATEGORY_FALLBACK_IMAGES[cat.slug] || CATEGORY_FALLBACK_IMAGES['occasions']
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/5] flex flex-col justify-end p-4 border border-[#E8E4DF] bg-stone-100 hover:shadow-[0_12px_30px_rgba(19,33,60,0.12)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <Image
                      src={categoryImg}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 16vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Subtle Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c1424]/90 via-[#0c1424]/30 to-transparent" />

                    {/* Text Label */}
                    <div className="relative z-10 text-start">
                      <p className="text-[10px] text-[#7ea6e6] font-bold uppercase tracking-wider mb-0.5">تصفح</p>
                      <h3 className="text-white font-black text-sm sm:text-base leading-snug group-hover:text-[#7ea6e6] transition-colors">
                        {cat.name}
                      </h3>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. CURATED PRODUCTS SHOWCASE (FILTER TABS & ELEVATED GRID) */}
      {/* ========================================================================= */}
      {topProducts.length > 0 && (
        <section className="py-14 sm:py-20 bg-[#FAFAF8] border-t border-[#E8E4DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header & Filter Tabs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 text-start">
              <div>
                <p className="text-xs font-black text-[#13213c] uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#13213c]" />
                  <span>{settings?.productsSectionBadge || 'مختارات استثنائية للإهداء'}</span>
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C1917] tracking-tight">
                  {settings?.productsSectionTitle || 'المنتجات الأكثر رواجاً وإهداءً'}
                </h2>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-[#E8E4DF] overflow-x-auto scrollbar-none self-start md:self-auto shadow-2xs">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'best', label: '🔥 الأكثر طلباً' },
                  { id: 'new', label: '✨ جديدنا' },
                  { id: 'sale', label: '🏷️ عروض وتخفيضات' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveProductTab(tab.id as any)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer",
                      activeProductTab === tab.id
                        ? "bg-[#13213c] text-white shadow-xs font-extrabold"
                        : "text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAFAF8]"
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
                className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl bg-white hover:bg-[#F0F4F9] border border-[#E8E4DF] hover:border-[#13213c]/40 text-xs font-bold text-[#1C1917] transition-all hover:-translate-y-0.5 shadow-2xs"
              >
                <span>استكشف جميع منتجات المتجر</span>
                <ArrowLeft className="w-4 h-4 text-[#13213c]" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. INTERACTIVE GIFT FINDER BANNER */}
      {/* ========================================================================= */}
      <section id="gift-finder-section" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div 
            className="relative rounded-3xl p-8 sm:p-12 lg:p-14 overflow-hidden border border-[#13213c]/30 text-start shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
            style={{
              background: 'linear-gradient(135deg, #0c1424 0%, #13213c 60%, #0c1424 100%)'
            }}
          >
            {/* Background Glows */}
            <div className="absolute top-0 end-0 w-80 h-80 bg-[#13213c]/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 start-0 w-80 h-80 bg-[#22385e]/15 rounded-full blur-[100px] pointer-events-none" />

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
                <div className="flex flex-wrap items-center gap-4 text-xs text-white/80">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[#7ea6e6]" /> ترشيحات دقيقة</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[#7ea6e6]" /> وفر وقتك وجهدك</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[#7ea6e6]" /> تغليف ملائم للمناسبة</span>
                </div>
              </div>

              {/* Right Mini-Interactive Widget */}
              <div className="lg:col-span-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15">
                <p className="text-xs font-black text-[#93c5fd] mb-3">الخطوة 1: لمن الهدية؟</p>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { id: 'women', label: 'لها 👩' },
                    { id: 'men', label: 'له 👨' },
                    { id: 'occasions', label: 'مناسبات 💍' },
                    { id: 'custom', label: 'بالاسم ✨' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setQuizRecipient(item.id as any)}
                      className={cn(
                        "py-2.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center",
                        quizRecipient === item.id
                          ? "bg-white text-[#13213c] border-white font-black shadow-md scale-[1.02]"
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
                    { id: 'under-50k', label: 'أقل من 50 ألف د.ع' },
                    { id: '50k-100k', label: '50 - 100 ألف د.ع' },
                    { id: 'above-100k', label: 'أكثر من 100 ألف د.ع' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setQuizBudget(b.id)}
                      className={cn(
                        "py-2.5 px-2 rounded-xl text-[11px] font-bold transition-all border cursor-pointer text-center",
                        quizBudget === b.id
                          ? "bg-white text-[#13213c] border-white font-black shadow-md scale-[1.02]"
                          : "bg-white/10 text-white/90 border-white/15 hover:bg-white/20 hover:text-white"
                      )}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>

                <Link
                  href={quizRecipient ? `/category/${quizRecipient}` : '/shop'}
                  className="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-black text-white text-sm transition-all hover:brightness-110 hover:-translate-y-0.5 shadow-lg border border-white/20 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
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
      {/* 7. REAL SOCIAL PROOF / TESTIMONIALS */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-18 bg-white border-t border-[#E8E4DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-start">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-black text-[#13213c] uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#13213c] fill-[#13213c]" />
              <span>آراء وتجارب حقيقية</span>
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1C1917] tracking-tight">
              تجارب استثنائية شاركنا بها أحباؤنا
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-3xl bg-[#FAFAF8] border border-[#E8E4DF] hover:border-[#13213c]/30 hover:shadow-[0_8px_30px_rgba(19,33,60,0.06)] transition-all text-start flex flex-col"
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
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#F0F4F9] text-[#13213c] border border-[#13213c]/20">
                    {t.gift}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. VIP GIFT CONCIERGE & CUSTOM ASSISTANCE BANNER */}
      {/* ========================================================================= */}
      {settings?.showConcierge !== false && (
        <section className="py-12 bg-[#F0F4F9] border-t border-[#E8E4DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E4DF] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
              <div className="flex items-center gap-4 text-start">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
                >
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#1C1917]">
                    {settings?.conciergeTitle || 'هل تبحث عن تنسيق هدية خاصة أو بوكس بمواصفات محددة؟'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#78716C] mt-1 leading-relaxed max-w-xl">
                    {settings?.conciergeDesc || 'فريقنا المتخصص في تنسيق الهدايا جاهز لمساعدتك عبر واتساب في اختيار القطع، كتابة بطاقة الإهداء، واختيار ألوان التغليف المناسبة.'}
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/${whatsappPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً، أود المساعدة في تنسيق هدية خاصة 🎁')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-7 rounded-2xl text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0 shadow-md hover:-translate-y-0.5 transition-all self-stretch md:self-auto cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>{settings?.conciergeBtnText || 'تحدث مع منسق الهدايا عبر واتساب'}</span>
              </a>
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
