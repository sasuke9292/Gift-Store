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
  MessageCircle,
  Package,
  Layers,
  Clock,
  BadgePercent
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductCard } from '@/components/store/product-card'
import { GiftFinderWizard } from '@/components/store/gift-finder-wizard'
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

// Curated verified showcase slides
const DEFAULT_SHOWCASE_SLIDES = [
  {
    id: 'women-perfume',
    title: 'عطور ومجوهرات نسائية راقية',
    subtitle: 'أناقة لا مثيل لها وتغليف مخملي فاخر يليق بأجمل اللحظات',
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

const CATEGORY_FALLBACKS: Record<string, string> = {
  men: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
  women: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
  occasions: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
  custom: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
  kids: 'https://images.unsplash.com/photo-1560859254-809fa84742f3?auto=format&fit=crop&q=80&w=800',
  offers: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800',
}

function getCategoryFallback(slug: string, name: string): string {
  const text = `${slug} ${name}`.toLowerCase()
  if (text.includes('men') || text.includes('رجال')) return CATEGORY_FALLBACKS.men
  if (text.includes('women') || text.includes('نسا')) return CATEGORY_FALLBACKS.women
  if (text.includes('custom') || text.includes('مخصص') || text.includes('اسم')) return CATEGORY_FALLBACKS.custom
  if (text.includes('kids') || text.includes('طفل') || text.includes('أطفال')) return CATEGORY_FALLBACKS.kids
  if (text.includes('offer') || text.includes('عرض') || text.includes('عروض')) return CATEGORY_FALLBACKS.offers
  return CATEGORY_FALLBACKS.occasions
}

const RECIPIENT_PERSONAS = [
  {
    id: 'her',
    title: 'هدايا لها',
    subtitle: 'عطور راقية، مجوهرات وبوكسات دلال أنثوية',
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
    subtitle: 'تخرج، زواج، خطوبة وذكرى سنوية سعيدة',
    tag: 'لحظات استثنائية',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
    link: '/category/occasions',
    btnText: 'تصفح المناسبات'
  },
  {
    id: 'custom',
    title: 'مخصصة بالاسم',
    subtitle: 'قطع محفورة وتنسيق خاص يخلد الذكرى',
    tag: 'لمسة شخصية فريدة',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
    link: '/category/custom',
    btnText: 'صمم هديتك'
  }
]

const TESTIMONIALS = [
  {
    id: 1,
    name: 'مريم العبيدي',
    city: 'بغداد - المنصور',
    text: 'التغليف فوق الخيال وجودة العطر والساعة أصلية 100%. شكراً على الاهتمام بأدق التفاصيل والسرعة المذهلة في التوصيل!',
    rating: 5,
    gift: 'بوكس نسائي متكامل'
  },
  {
    id: 2,
    name: 'حيدر الكرخي',
    city: 'النجف الأشرف',
    text: 'أفضل متجر هدايا تعاملت معه في العراق. طلبت هدية تخرج ووصلتني بنفس اليوم مغلفة بكرت شخصي مطبوع بأناقة عالية.',
    rating: 5,
    gift: 'ساعة يد ومحفظة جلد'
  },
  {
    id: 3,
    name: 'سارة البرزنجي',
    city: 'أربيل',
    text: 'مستشار الهدايا ساعدني جداً في الاختيار. خدمة العملاء راقية ومهنية والمنتج كان طبق الأصل من الصور تماماً.',
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

  // Curated slides logic
  const slides = useMemo(() => {
    if (heroSlides && Array.isArray(heroSlides) && heroSlides.length > 0) {
      return heroSlides.map((s: any, idx: number) => ({
        id: s.id || `slide-${idx}`,
        title: s.title || 'هدية فاخرة ومميزة',
        subtitle: s.subtitle || 'تغليف ملكي وجودة استثنائية',
        image: s.image || DEFAULT_SHOWCASE_SLIDES[0].image,
        link: s.link || '/shop',
        tag: s.tag || 'مميز'
      }))
    }
    return DEFAULT_SHOWCASE_SLIDES
  }, [heroSlides])

  // Slideshow timer
  useEffect(() => {
    if (slides.length <= 1 || isHovered) return
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [slides.length, isHovered])

  const currentSlide = slides[activeSlide % slides.length] || slides[0]

  // Filtered products by tab
  const filteredProducts = useMemo(() => {
    return topProducts.filter(p => {
      if (activeProductTab === 'best') return p.isBestSeller
      if (activeProductTab === 'new') return p.isNew
      if (activeProductTab === 'sale') return p.salePrice && p.salePrice < p.price
      return true
    })
  }, [topProducts, activeProductTab])

  // Sale/Offer products
  const offerProducts = useMemo(() => {
    return topProducts.filter(p => p.salePrice && p.salePrice < p.price)
  }, [topProducts])

  const whatsappPhone = settings?.whatsappNumber || '9647701234567'

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900 overflow-x-hidden font-sans" dir="rtl">

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: LUXURY & EMOTIONAL HOOK */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-6 sm:pt-10 lg:pt-14 pb-12 sm:pb-16 lg:pb-20">
        {/* Soft Background Accents */}
        <div className="absolute top-0 start-1/4 w-[500px] h-[500px] bg-[#13213c]/6 rounded-full blur-[130px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 end-10 w-[400px] h-[400px] bg-[#22385e]/5 rounded-full blur-[110px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* RIGHT COLUMN: Brand Hook, Headline & CTAs */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-start relative z-10">
              
              {/* Shimmering Badge */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 bg-[#F0F4F9] border border-[#13213c]/20 rounded-full px-4 py-1.5 text-xs sm:text-sm font-black text-[#13213c] mb-4 sm:mb-6 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
                <span>{settings?.heroBadge || heroBadge || 'گفتي بلس • خلّي هديتك تحچي عنك ✨'}</span>
              </motion.div>

              {/* Master Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2] text-slate-900 mb-4 sm:mb-6"
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
                className="text-xs sm:text-base lg:text-lg text-slate-600 max-w-xl mb-6 sm:mb-8 leading-relaxed font-normal"
              >
                {settings?.heroSubheadline || heroSubheadline || 'اكتشف تجربة إهداء استثنائية في العراق تجمع بين فخامة التصميم وأناقة التفاصيل، مع تغليف يدوي ملكي وبطاقة مخصصة تخلّد أجمل المشاعر.'}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto mb-8 sm:mb-10"
              >
                <Link
                  href="/shop"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 h-12 sm:h-14 px-6 sm:px-9 rounded-2xl text-white font-black text-xs sm:text-base transition-all hover:-translate-y-0.5 shadow-[0_6px_24px_rgba(19,33,60,0.3)] cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
                >
                  <span>اكتشف الهدايا</span>
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
                </Link>

                <Link
                  href="#gift-finder-section"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 h-12 sm:h-14 px-5 sm:px-7 rounded-2xl font-black text-slate-900 bg-white border border-slate-200 hover:border-[#13213c]/40 hover:bg-slate-50 text-xs sm:text-base transition-all hover:-translate-y-0.5 shadow-xs whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>ساعدني أختار هدية</span>
                </Link>
              </motion.div>

              {/* Trust Indicators Stats */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="pt-6 border-t border-slate-200/80 w-full max-w-lg lg:max-w-xl"
              >
                <div className="grid grid-cols-3 divide-x divide-x-reverse divide-slate-200/80">
                  <div className="flex flex-col items-center justify-center text-center px-2">
                    <p className="text-xl sm:text-3xl font-black text-[#13213c] tracking-tight" dir="ltr">
                      +15K
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-bold mt-1">
                      عميل يثق بنا
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center text-center px-2">
                    <div className="inline-flex items-center gap-1 text-xl sm:text-3xl font-black text-[#13213c] tracking-tight">
                      <span dir="ltr">4.9</span>
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                    </div>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-bold mt-1">
                      تقييم العملاء
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center text-center px-2">
                    <p className="text-xl sm:text-3xl font-black text-[#13213c] tracking-tight" dir="ltr">
                      100%
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-bold mt-1">
                      تغليف ملكي مجاني
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* LEFT COLUMN: Luxury Interactive Showcase Slider */}
            <div className="lg:col-span-6 xl:col-span-5 relative mt-4 lg:mt-0 w-full">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Showcase Slider Card */}
                <div 
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="relative aspect-[4/3] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(19,33,60,0.14)] border border-slate-200/90 bg-slate-100 select-none group"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide.id}
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

                      {/* Tag Pill */}
                      <div className="absolute top-4 start-4 z-10">
                        <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black text-[#13213c] shadow-xs">
                          <Flame className="w-3.5 h-3.5 text-rose-500" />
                          {currentSlide.tag}
                        </span>
                      </div>

                      {/* Slide Information */}
                      <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 z-10 text-start">
                        <h3 className="text-lg sm:text-2xl font-black text-white mb-1.5 leading-snug">
                          {currentSlide.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-white/80 mb-3 line-clamp-2 leading-relaxed">
                          {currentSlide.subtitle}
                        </p>
                        <Link
                          href={currentSlide.link}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-300 hover:text-white transition-colors"
                        >
                          <span>تصفح هذه التشكيلة</span>
                          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  <div className="absolute top-4 end-4 z-20 flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#13213c] hover:bg-white hover:scale-105 transition-all shadow-xs cursor-pointer"
                      aria-label="الشريحة السابقة"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))}
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#13213c] hover:bg-white hover:scale-105 transition-all shadow-xs cursor-pointer"
                      aria-label="الشريحة التالية"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Floating Glassmorphic Badges */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="hidden sm:flex items-center gap-3 absolute -top-5 -start-5 bg-white/95 backdrop-blur-xl rounded-2xl p-3.5 shadow-lg border border-slate-200/90 z-20 pointer-events-none"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F0F4F9] flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-[#13213c]" />
                  </div>
                  <div className="text-start">
                    <p className="text-[11px] text-slate-400 font-bold">جودة أصلية ومضمونة</p>
                    <p className="text-xs font-black text-slate-900">فحص عند الاستلام 100%</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="hidden sm:flex items-center gap-3 absolute -bottom-5 -end-5 bg-white/95 backdrop-blur-xl rounded-2xl p-3.5 shadow-lg border border-slate-200/90 z-20 pointer-events-none"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F0F4F9] flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5 text-[#13213c]" />
                  </div>
                  <div className="text-start">
                    <p className="text-[11px] text-slate-400 font-bold">تغليف ملكي خاص</p>
                    <p className="text-xs font-black text-slate-900">مجاناً مع كل طلب 🎁</p>
                  </div>
                </motion.div>

                {/* Switcher Indicator Dots */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300 cursor-pointer",
                        activeSlide === idx 
                          ? "w-8 bg-[#13213c]" 
                          : "w-2.5 bg-slate-200 hover:bg-slate-400"
                      )}
                      aria-label={`انتقال للشريحة ${idx + 1}`}
                    />
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRUST & ASSURANCE RIBBON */}
      {/* ========================================================================= */}
      <section className="py-6 sm:py-8 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-11 h-11 rounded-xl bg-[#F0F4F9] flex items-center justify-center shrink-0 text-[#13213c]">
                <Truck className="w-5 h-5 text-[#13213c]" />
              </div>
              <div className="text-start min-w-0">
                <h4 className="font-black text-xs sm:text-sm text-slate-900 truncate">توصيل لكافة المحافظات</h4>
                <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1">شحن سريع 24 - 48 ساعة</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-11 h-11 rounded-xl bg-[#F0F4F9] flex items-center justify-center shrink-0 text-[#13213c]">
                <Gift className="w-5 h-5 text-[#13213c]" />
              </div>
              <div className="text-start min-w-0">
                <h4 className="font-black text-xs sm:text-sm text-slate-900 truncate">تغليف ملكي فاخر</h4>
                <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1">مجاني مع بطاقة إهداء بكلماتك</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-start min-w-0">
                <h4 className="font-black text-xs sm:text-sm text-slate-900 truncate">دفع آمن عند الاستلام</h4>
                <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1">فحص ومعاينة + زين كاش</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-11 h-11 rounded-xl bg-[#F0F4F9] flex items-center justify-center shrink-0 text-[#13213c]">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-start min-w-0">
                <h4 className="font-black text-xs sm:text-sm text-slate-900 truncate">مستشار هدايا عراقي</h4>
                <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1">مساعدتك في تنسيق كل تفصيلة</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CATEGORIES SHOWCASE GRID */}
      {/* ========================================================================= */}
      {categories.length > 0 && (
        <section className="py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8 text-center sm:text-start">
              <div>
                <p className="text-xs font-black text-[#13213c] uppercase tracking-widest mb-1.5 flex items-center justify-center sm:justify-start gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#13213c]" />
                  <span>كتالوج التشكيلات الراقية</span>
                </p>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  تصفح الهدايا حسب الأقسام
                </h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs sm:text-sm font-bold text-[#13213c] hover:text-slate-900 transition-colors self-center sm:self-auto"
              >
                <span>جميع الأقسام</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Grid Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {categories.slice(0, 6).map((cat) => {
                const fallbackImg = getCategoryFallback(cat.slug, cat.name)
                const img = cat.image && !cat.image.includes('placeholder') ? cat.image : fallbackImg

                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="group relative rounded-2xl overflow-hidden aspect-[4/5] flex flex-col justify-end p-3 sm:p-4 border border-slate-200/90 bg-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <Image
                      src={img}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 16vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c1424]/90 via-[#0c1424]/30 to-transparent" />
                    
                    <div className="relative z-10 text-start">
                      <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider mb-0.5">تصفح</p>
                      <h3 className="text-white font-black text-xs sm:text-base leading-snug group-hover:text-amber-300 transition-colors truncate">
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
      {/* 4. RECIPIENT & OCCASION PERSONAS (هدايا مختارة بعناية لمن تحب) */}
      {/* ========================================================================= */}
      <section className="py-10 sm:py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 mb-6 sm:mb-8 text-center lg:text-start">
            <div>
              <p className="text-xs font-black text-[#13213c] uppercase tracking-widest mb-1.5 flex items-center justify-center lg:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>دليل الإهداء الذكي</span>
              </p>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                هدايا مختارة بعناية لمن تحب
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto lg:mx-0 leading-relaxed">
              اختر الشخص أو المناسبة لتشاهد مجموعات منتقاة يدوياً بعناية ومغلفة بأعلى درجات الفخامة.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {RECIPIENT_PERSONAS.map((persona) => (
              <Link
                key={persona.id}
                href={persona.link}
                className="group relative rounded-3xl overflow-hidden aspect-[3/4] sm:aspect-[4/5] flex flex-col justify-end p-4 sm:p-6 border border-slate-200/90 bg-slate-100 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
              >
                <Image
                  src={persona.image}
                  alt={persona.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1424]/95 via-[#0c1424]/40 to-transparent" />
                
                <div className="absolute top-3 start-3 z-10">
                  <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] sm:text-xs font-black text-[#13213c] shadow-xs">
                    {persona.tag}
                  </span>
                </div>

                <div className="relative z-10 text-start">
                  <h3 className="text-sm sm:text-2xl font-black text-white mb-1 group-hover:text-amber-300 transition-colors leading-tight">
                    {persona.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-white/80 leading-relaxed mb-3 line-clamp-2">
                    {persona.subtitle}
                  </p>
                  <div className="inline-flex items-center gap-1 text-xs font-black text-amber-300 group-hover:text-white transition-colors">
                    <span>{persona.btnText}</span>
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FEATURED & TRENDING PRODUCTS WITH FILTER TABS */}
      {/* ========================================================================= */}
      {topProducts.length > 0 && (
        <section className="py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-10 text-center md:text-start">
              <div>
                <p className="text-xs font-black text-[#13213c] uppercase tracking-widest mb-1.5 flex items-center justify-center md:justify-start gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>مختارات استثنائية للإهداء</span>
                </p>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  المنتجات الأكثر رواجاً وإهداءً
                </h2>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center justify-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs mx-auto md:mx-0">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'best', label: '🔥 الأكثر طلباً' },
                  { id: 'new', label: '✨ جديدنا' },
                  { id: 'sale', label: '🏷️ عروض' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveProductTab(tab.id as any)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                      activeProductTab === tab.id
                        ? "bg-[#13213c] text-white shadow-xs font-black"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {filteredProducts.slice(0, 8).map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="mt-8 sm:mt-12 text-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 transition-all hover:-translate-y-0.5 shadow-2xs"
              >
                <span>استكشف جميع منتجات المتجر</span>
                <ArrowLeft className="w-4 h-4 text-[#13213c]" />
              </Link>
            </div>

          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. INTERACTIVE SMART GIFT FINDER WIZARD SECTION */}
      {/* ========================================================================= */}
      <section id="gift-finder-section" className="py-12 sm:py-20 bg-gradient-to-b from-white via-[#F8FAFC] to-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#F0F4F9] text-[#13213c] mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              مستشار الإهداء التفاعلي
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
              محتار باختيار الهدية؟ دعنا نساعدك في 4 خطوات!
            </h2>
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
              اختر الشخص والمناسبة وميزانيتك وسيقترح لك النظام فوراً أنسب الهدايا مع التغليف الملائم.
            </p>
          </div>

          <GiftFinderWizard products={topProducts} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. OFFERS & VALUE PACKAGES ("هدايا تستحق أكثر") */}
      {/* ========================================================================= */}
      {offerProducts.length > 0 && (
        <section className="py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8 text-center sm:text-start">
              <div>
                <p className="text-xs font-black text-rose-600 uppercase tracking-widest mb-1.5 flex items-center justify-center sm:justify-start gap-1.5">
                  <BadgePercent className="w-4 h-4 text-rose-600" />
                  <span>تخفيضات وبكجات حصرية</span>
                </p>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  هدايا تستحق أكثر — عروض مميزة
                </h2>
              </div>
              <Link
                href="/category/offers"
                className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors self-center sm:self-auto"
              >
                <span>جميع العروض الحالية</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {offerProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 8. ROYAL UNBOXING & PACKAGING EXPERIENCE */}
      {/* ========================================================================= */}
      <section className="py-10 sm:py-16 bg-[#13213c] text-white relative overflow-hidden">
        <div className="absolute top-0 start-1/4 w-96 h-96 bg-[#22385e]/30 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 text-center lg:text-start flex flex-col items-center lg:items-start">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-white/10 text-amber-300 border border-white/10 mb-4">
                <Gift className="w-4 h-4" />
                تغليف ملكي مجاني 100%
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                لحظة فتح الهدية... يجب أن تكون لا تُنسى ✨
              </h2>
              <p className="text-xs sm:text-base text-white/80 leading-relaxed mb-6 max-w-xl">
                في گفتي بلس، نعتبر التغليف فنّاً قائماً بذاته. كل طلب يخرج من أيدينا مغلف بعلبة صلبة فاخرة، شريط ساتان حريري منسق، وكرت إهداء مطبوع بكلماتك ومشاعرك الصادقة مجاناً بالكامل.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg mb-6 text-start">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="text-xs font-black text-amber-300 mb-0.5">علب هدايا ملكية</h4>
                  <p className="text-[11px] text-white/70">متينة ومخملية لحفظ الهدية</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="text-xs font-black text-amber-300 mb-0.5">أشرطة حريرية</h4>
                  <p className="text-[11px] text-white/70">ألوان منسقة بعناية فائقة</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="text-xs font-black text-amber-300 mb-0.5">كرت إهداء مطبوع</h4>
                  <p className="text-[11px] text-white/70">كلماتك الخاصة بخط أنيق</p>
                </div>
              </div>

              <Link
                href="/shop"
                className="h-12 px-7 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>اختر هديتك الآن مع تغليف مجاني</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800"
                  alt="تغليف الهدايا الملكي"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. REAL REVIEWS & TESTIMONIALS */}
      {/* ========================================================================= */}
      <section className="py-10 sm:py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <p className="text-xs font-black text-[#13213c] uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>تجارب حقيقية موثوقة</span>
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              أحباؤنا يتحدثون عن تجربتهم مع گفتي بلس
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all text-start flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-slate-900">{t.name}</p>
                    <p className="text-[11px] text-slate-400">{t.city}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white text-[#13213c] border border-slate-200">
                    {t.gift}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. VIP CONCIERGE & WHATSAPP ASSISTANCE BAR */}
      {/* ========================================================================= */}
      <section className="py-10 sm:py-14 bg-slate-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs text-center md:text-start">
            
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
              >
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-black text-slate-900">
                  هل تبحث عن بوكس مخصص أو هدية بمواصفات محددة؟
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-xl">
                  منسق الهدايا الخاص بنا جاهز لمساعدتك مباشرة عبر واتساب في اختيار القطع، كتابة بطاقة الإهداء، واختيار التغليف الملائم.
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/${whatsappPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً گفتي بلس، أود المساعدة في تنسيق هدية خاصة 🎁')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black transition-all shadow-sm shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>تحدث مع منسق الهدايا عبر واتساب</span>
            </a>

          </div>
        </div>
      </section>

    </div>
  )
}
