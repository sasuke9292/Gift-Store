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
  Package
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductCard } from '@/components/store/product-card'
import { cn } from '@/lib/utils'
import { 
  HeroRibbonBackground, 
  CategoryWavesBackground, 
  SectionRibbonFlourish 
} from '@/components/ui/organic-decorations'

interface Category {
  id: string
  name: string
  slug: string
  image?: string | null
  isActive?: boolean
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

function getCategoryFallbackImage(name: string, slug: string): string {
  const text = `${name} ${slug}`.toLowerCase()
  if (text.includes('رجال') || text.includes('men')) return CATEGORY_FALLBACK_IMAGES['men']
  if (text.includes('نسا') || text.includes('women')) return CATEGORY_FALLBACK_IMAGES['women']
  if (text.includes('مناسب') || text.includes('occasion') || text.includes('ورد') || text.includes('بوكس')) return CATEGORY_FALLBACK_IMAGES['occasions']
  if (text.includes('اسم') || text.includes('مخصص') || text.includes('custom')) return CATEGORY_FALLBACK_IMAGES['custom']
  if (text.includes('طفل') || text.includes('أطفال') || text.includes('kids') || text.includes('ألعاب')) return CATEGORY_FALLBACK_IMAGES['kids']
  if (text.includes('عرض') || text.includes('عروض') || text.includes('offer')) return CATEGORY_FALLBACK_IMAGES['offers']
  if (text.includes('إلكترون') || text.includes('سماع')) return CATEGORY_FALLBACK_IMAGES['electronics']
  return CATEGORY_FALLBACK_IMAGES['occasions']
}

function CategoryCardItem({ cat }: { cat: Category }) {
  const fallback = getCategoryFallbackImage(cat.name, cat.slug)
  const isBrokenOrPlaceholder = !cat.image || cat.image.includes('placeholder') || cat.image.includes('broken') || cat.image.trim() === ''
  const [imgSrc, setImgSrc] = useState(isBrokenOrPlaceholder ? fallback : cat.image!)

  return (
    <Link
      href={`/category/${cat.slug}`}
      className="group relative rounded-xl sm:rounded-3xl overflow-hidden aspect-[1/1] sm:aspect-[4/5] flex flex-col justify-end p-2.5 sm:p-4 border border-slate-200/80 bg-slate-100 hover:shadow-[0_12px_30px_rgba(19,33,60,0.12)] hover:-translate-y-1 transition-all duration-300 w-full"
    >
      <Image
        src={imgSrc}
        alt={cat.name}
        fill
        unoptimized={imgSrc.startsWith('data:')}
        sizes="(max-width: 768px) 50vw, 16vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        onError={() => setImgSrc(fallback)}
      />
      {/* Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#01283B]/90 via-[#01283B]/30 to-transparent" />

      {/* Text Label */}
      <div className="relative z-10 text-start">
        <p className="text-[9px] sm:text-[10px] text-[#F4A258] font-bold uppercase tracking-wider mb-0.5">تصفح</p>
        <h3 className="text-white font-black text-xs sm:text-base leading-snug group-hover:text-[#F4A258] transition-colors truncate">
          {cat.name}
        </h3>
      </div>
    </Link>
  )
}

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

  // Filter only active categories for the home page catalog
  const activeCategories = useMemo(() => {
    return (categories || []).filter(c => c.isActive !== false)
  }, [categories])

  // Dynamic Showcase Slides from Dedicated DB HeroSlides or Fallback
  const heroSlidesJson = settings?.heroSlidesJson
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
    if (heroSlidesJson) {
      try {
        const parsed = JSON.parse(heroSlidesJson)
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
  }, [heroSlides, heroSlidesJson])

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

  // Helper to safely get feature desc (allowing empty string if deleted/cleared)
  const getFeatureDesc = (val: string | null | undefined, defaultVal: string) => {
    if (val === undefined || val === null) return defaultVal
    return val.trim()
  }

  // Dynamic Trust & Guarantees Pillars
  const trustPillars = [
    {
      icon: Truck,
      title: settings?.feature1Title?.trim() || 'شحن سريع وموثوق',
      desc: getFeatureDesc(settings?.feature1Desc, 'توصيل لكافة محافظات العراق خلال 24 - 48 ساعة مع تتبع فوري للشحنة'),
      color: '#013D5A',
      bg: '#F0F4F9',
    },
    {
      icon: Gift,
      title: settings?.feature2Title?.trim() || 'تغليف ملكي فاخر',
      desc: getFeatureDesc(settings?.feature2Desc, 'علب هدايا فاخرة مع أشرطة حريرية وكارت إهداء بكلماتك مجاناً مع كل طلب'),
      color: '#013D5A',
      bg: '#F0F4F9',
    },
    {
      icon: ShieldCheck,
      title: settings?.feature3Title?.trim() || 'دفع آمن عند الاستلام',
      desc: getFeatureDesc(settings?.feature3Desc, 'عاين هديتك وافحصها قبل الاستلام، مع خيارات دفع بـ زين كاش والماستر كارد'),
      color: '#10B981',
      bg: '#F0FDF9',
    },
    {
      icon: Award,
      title: settings?.feature4Title?.trim() || 'مستشار هدايا ذكي',
      desc: getFeatureDesc(settings?.feature4Desc, 'منتجات منتقاة بعناية فائقة مع ضمان حقيقي للاستبدال والاسترجاع بكل سهولة'),
      color: '#013D5A',
      bg: '#F0F4F9',
    },
  ]

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
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] text-slate-900 overflow-x-hidden font-sans" dir="rtl">

      {/* ========================================================================= */}
      {/* 1. ROYAL LUXURY HERO SECTION (Unified Header & Hero Composition)          */}
      {/* ========================================================================= */}
      <section 
        data-testid="unified-hero-section"
        className="relative overflow-hidden pt-[118px] sm:pt-[138px] md:pt-[184px] lg:pt-[204px] flex flex-col justify-center text-white"
        style={{
          background: 'linear-gradient(180deg, #011622 0%, #012436 24%, #012E46 58%, #013D5A 100%)'
        }}
      >
        {/* Soft Ambient Royal Glow Orbs (Spanning from top header canopy through hero body) */}
        <div className="absolute -top-24 start-1/4 w-[620px] h-[620px] bg-[#BDD3CE]/10 rounded-full blur-[145px] pointer-events-none" />
        <div className="absolute top-6 end-1/4 w-[480px] h-[480px] bg-[#025177]/25 rounded-full blur-[135px] pointer-events-none" />
        <div className="absolute bottom-10 end-10 w-[500px] h-[500px] bg-[#F4A258]/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] bg-[#025177]/20 rounded-full blur-[150px] pointer-events-none" />
        
        {/* Subtle geometric dot matrix extending from top of viewport */}
        <div 
          className="absolute inset-0 opacity-[0.032] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #FCF3E3 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        {/* Subtle Organic Shapes & Thin Ribbon Lines */}
        <HeroRibbonBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pb-10 sm:pb-14 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* RIGHT COLUMN: Master Brand Hook & Elevated CTAs (Centered on mobile, start-aligned on desktop) */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-start relative z-10">
              
              {/* Shimmering Badge */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/[0.08] border border-white/15 rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-sm font-black text-[#FCF3E3] mb-3.5 sm:mb-6 shadow-xs backdrop-blur-md"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F4A258] shrink-0" />
                <span className="line-clamp-1">{settings?.heroBadge || heroBadge || 'التشكيلة الجديدة كلياً لعام 2026'}</span>
              </motion.div>

              {/* Master Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2] text-[#FCF3E3] mb-3.5 sm:mb-6"
              >
                {(settings?.heroHeadline || heroHeadline) ? (
                  <span dangerouslySetInnerHTML={{ __html: (settings?.heroHeadline || heroHeadline).replace(/\n/g, '<br/>') }} />
                ) : (
                  <>
                    <span className="text-[#FCF3E3]">لحظاتك الثمينة</span>
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#F4A258] via-[#FCF3E3] to-[#F4A258]">
                      تستحق الأفضل.
                    </span>
                  </>
                )}
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xs sm:text-base lg:text-lg text-white/80 max-w-xl mb-6 sm:mb-8 leading-relaxed font-normal"
              >
                {settings?.heroSubheadline || heroSubheadline || 'اكتشف مجموعة من الهدايا الاستثنائية التي تم اختيارها بعناية لتناسب أرقى الأذواق وتخلّد أجمل الذكريات.'}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto max-w-sm sm:max-w-none mb-8 sm:mb-10"
              >
                <Link
                  href={settings?.heroPrimaryBtnLink || '/shop'}
                  className="flex items-center justify-center gap-2 h-12 sm:h-14 px-6 sm:px-9 rounded-xl sm:rounded-2xl text-[#01283B] font-black text-sm sm:text-base whitespace-nowrap transition-all hover:-translate-y-0.5 shadow-[0_8px_25px_rgba(244,162,88,0.45)] hover:shadow-[0_10px_35px_rgba(244,162,88,0.6)] cursor-pointer group"
                  style={{
                    background: 'linear-gradient(135deg, #F4A258 0%, #DE8637 100%)'
                  }}
                >
                  <span>{settings?.heroPrimaryBtnText || 'اكتشف التشكيلة الفاخرة'}</span>
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
                </Link>

                <Link
                  href={settings?.heroSecondaryBtnLink || '/gift-finder'}
                  className="flex items-center justify-center gap-2 h-12 sm:h-14 px-5 sm:px-7 rounded-xl sm:rounded-2xl font-extrabold text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 backdrop-blur-md text-sm sm:text-base transition-all hover:-translate-y-0.5 shadow-sm whitespace-nowrap cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#F4A258]" />
                  <span>{settings?.heroSecondaryBtnText || 'مكتشف الهدايا الذكي'}</span>
                </Link>
              </motion.div>

              {/* Trust Indicators (Centered 3-column stats with comfortable padding) */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="pt-5 sm:pt-6 border-t border-white/15 w-full max-w-lg lg:max-w-xl"
              >
                <div className="grid grid-cols-3 divide-x divide-x-reverse divide-white/15">
                  {/* Stat 1 */}
                  <div className="flex flex-col items-center justify-center text-center px-1 sm:px-4">
                    <p className="text-xl sm:text-3xl font-black text-[#FCF3E3] tracking-tight tabular-nums" dir="ltr">
                      {settings?.stat1Value || '+15K'}
                    </p>
                    <p className="text-[10px] sm:text-xs text-white/70 font-bold mt-1 text-center">
                      {settings?.stat1Label || 'عميل يثق بنا'}
                    </p>
                  </div>

                  {/* Stat 2 */}
                  <div className="flex flex-col items-center justify-center text-center px-1 sm:px-4">
                    <div className="inline-flex items-center justify-center gap-1 text-xl sm:text-3xl font-black text-[#FCF3E3] tracking-tight">
                      <span dir="ltr" className="tabular-nums">
                        {(settings?.stat2Value || '4.9').replace(/[★⭐*]/g, '').trim() || '4.9'}
                      </span>
                      <Star className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-[#F4A258] text-[#F4A258] shrink-0" />
                    </div>
                    <p className="text-[10px] sm:text-xs text-white/70 font-bold mt-1 text-center">
                      {settings?.stat2Label || 'تقييم العملاء'}
                    </p>
                  </div>

                  {/* Stat 3 */}
                  <div className="flex flex-col items-center justify-center text-center px-1 sm:px-4">
                    <p className="text-xl sm:text-3xl font-black text-[#F4A258] tracking-tight tabular-nums" dir="ltr">
                      {settings?.stat3Value || '100%'}
                    </p>
                    <p className="text-[10px] sm:text-xs text-white/70 font-bold mt-1 text-center">
                      {settings?.stat3Label || 'تغليف ملكي مجاني'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* LEFT COLUMN: Modern Interactive Luxury Showcase Slider */}
            <div className="lg:col-span-6 xl:col-span-5 relative mt-6 lg:mt-0 w-full">
              <div className="relative mx-auto max-w-md lg:max-w-none">

                {/* Main Showcase Card */}
                <div 
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="relative aspect-[16/11] sm:aspect-[1/1] lg:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.45)] border border-white/20 bg-[#01283B]/80 group select-none"
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
                      <div className="absolute inset-0 bg-gradient-to-t from-[#01283B]/95 via-[#01283B]/35 to-transparent" />
                      
                      {/* Top Tag */}
                      <div className="absolute top-3 sm:top-4 start-3 sm:start-4 z-10">
                        <span className="inline-flex items-center gap-1 bg-[#F4A258] text-[#01283B] px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black shadow-md">
                          <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#01283B]" />
                          {currentSlide.tag}
                        </span>
                      </div>

                      {/* Bottom Info */}
                      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-7 z-10 text-start">
                        <h3 className="text-base sm:text-2xl font-black text-white mb-1 sm:mb-2 leading-tight">
                          {currentSlide.title}
                        </h3>
                        <p className="text-[11px] sm:text-sm text-[#FCF3E3]/85 mb-2 sm:mb-4 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                          {currentSlide.subtitle}
                        </p>
                        <Link
                          href={currentSlide.link}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F4A258] hover:text-white transition-all group/link"
                        >
                          <span>تصفح هذه المجموعة الآن</span>
                          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover/link:-translate-x-1" />
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  <div className="absolute top-3 sm:top-4 end-3 sm:end-4 z-20 flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveSlide((prev) => (prev === 0 ? activeShowcaseSlides.length - 1 : prev - 1))}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#01283B]/80 hover:bg-[#01283B] text-white border border-white/20 backdrop-blur-md flex items-center justify-center hover:scale-105 transition-all shadow-xs cursor-pointer active:scale-95"
                      aria-label="الشريحة السابقة"
                      title="السابق"
                    >
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => setActiveSlide((prev) => (prev === activeShowcaseSlides.length - 1 ? 0 : prev + 1))}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#01283B]/80 hover:bg-[#01283B] text-white border border-white/20 backdrop-blur-md flex items-center justify-center hover:scale-105 transition-all shadow-xs cursor-pointer active:scale-95"
                      aria-label="الشريحة التالية"
                      title="التالي"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>

                {/* Floating Glassmorphic Badge: Top Right */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="hidden sm:flex items-center gap-3 absolute -top-5 start-2 sm:-start-5 bg-[#01283B]/85 backdrop-blur-xl rounded-2xl p-3 sm:p-3.5 shadow-[0_16px_35px_rgba(0,0,0,0.35)] border border-white/15 z-20 pointer-events-none"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-[#F4A258]" />
                  </div>
                  <div className="text-start">
                    <p className="text-[11px] text-white/60 font-bold">{settings?.heroBadgeTopSmall || 'جودة أصلية ومضمونة'}</p>
                    <p className="text-xs font-black text-[#FCF3E3]">{settings?.heroBadgeTopBold || 'ضمان استبدال واسترجاع'}</p>
                  </div>
                </motion.div>

                {/* Floating Glassmorphic Badge: Bottom Left */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="hidden sm:flex items-center gap-3 absolute -bottom-5 end-2 sm:-end-5 bg-[#01283B]/85 backdrop-blur-xl rounded-2xl p-3 sm:p-3.5 shadow-[0_16px_35px_rgba(0,0,0,0.35)] border border-white/15 z-20 pointer-events-none"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5 text-[#F4A258]" />
                  </div>
                  <div className="text-start">
                    <p className="text-[11px] text-white/60 font-bold">{settings?.heroBadgeBottomSmall || 'خدمة استثنائية'}</p>
                    <p className="text-xs font-black text-[#FCF3E3]">{settings?.heroBadgeBottomBold || 'تغليف مجاني مع كل طلب'}</p>
                  </div>
                </motion.div>

                {/* Showcase Switcher Pills & Counter */}
                <div className="flex items-center justify-between gap-3 mt-3.5 sm:mt-4 px-2">
                  {/* Slide Numeric Counter */}
                  <div className="flex items-center gap-1 text-[11px] sm:text-xs font-black text-[#FCF3E3] tabular-nums" dir="ltr">
                    <span>{String(safeSlideIndex + 1).padStart(2, '0')}</span>
                    <span className="text-white/40 font-normal">/</span>
                    <span className="text-white/60 font-semibold">{String(activeShowcaseSlides.length).padStart(2, '0')}</span>
                  </div>

                  {/* Switcher Pills */}
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-1">
                    {activeShowcaseSlides.map((slide, idx) => (
                      <button
                        key={slide.id}
                        onClick={() => setActiveSlide(idx)}
                        className={cn(
                          "h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer",
                          safeSlideIndex === idx 
                            ? "w-6 sm:w-8 bg-[#F4A258] shadow-[0_0_12px_rgba(244,162,88,0.5)]" 
                            : "w-2 sm:w-2.5 bg-white/25 hover:bg-white/40"
                        )}
                        aria-label={`انتقال إلى الشريحة ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Hint */}
                  <span className="text-[10px] text-white/50 font-bold hidden sm:inline-block">
                    {isHovered ? 'موقوف مؤقتاً' : 'تفاعلي تلقائي'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Seamless Organic Curved Transition into Next Section (Flush at Bottom of Hero) */}
        <div className="w-full overflow-hidden leading-none pointer-events-none -mb-px relative z-10" aria-hidden="true">
          <svg
            className="relative block w-full h-10 sm:h-14 lg:h-18 text-[#FAF7F2]"
            viewBox="0 0 1440 72"
            fill="none"
            preserveAspectRatio="none"
          >
            {/* Subtle Gold & Celeste Rim Accent Along the Organic Curve */}
            <path
              d="M0,26 C320,64 560,6 840,42 C1080,68 1260,18 1440,34"
              stroke="#F4A258"
              strokeOpacity="0.24"
              strokeWidth="1.25"
              fill="none"
            />
            <path
              d="M0,32 C320,70 560,12 840,48 C1080,74 1260,24 1440,40 L1440,72 L0,72 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. REFINED LUXURY TRUST & VALUE RIBBON (Spacious & Centered on Mobile) */}
      {/* ========================================================================= */}
      <section className="py-6 sm:py-10 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {trustPillars.map((feature, idx) => {
              const hasDesc = Boolean(feature.desc && feature.desc.trim().length > 0)
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-start gap-2.5 sm:gap-3.5 lg:gap-4 p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#013D5A]/30 hover:bg-white hover:shadow-md transition-all duration-200 group h-full justify-center shadow-xs"
                >
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 mb-1 lg:mb-0 transition-transform group-hover:scale-105 shadow-2xs"
                    style={{ background: feature.bg }}
                  >
                    <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col items-center lg:items-start">
                    <h3 className={cn(
                      "font-black text-slate-900 leading-snug",
                      hasDesc ? "text-xs sm:text-sm mb-1" : "text-xs sm:text-base font-black"
                    )}>
                      {feature.title}
                    </h3>
                    {hasDesc && (
                      <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed line-clamp-2 max-w-[200px] lg:max-w-none">
                        {feature.desc}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CURATED CATEGORIES SHOWCASE GRID (Moved up for seamless shopping flow) */}
      {/* ========================================================================= */}
      {activeCategories.length > 0 && (
        <section className="relative overflow-hidden py-10 sm:py-16 bg-[#FAF7F2]">
          {/* Subtle Boundary Organic Waves */}
          <CategoryWavesBackground />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8 text-center sm:text-start">
              <div>
                <p className="text-[11px] sm:text-xs font-black text-[#013D5A] uppercase tracking-widest mb-1.5 flex items-center justify-center sm:justify-start gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#013D5A]" />
                  <span>{settings?.categoriesSectionBadge || 'كتالوج التشكيلات الراقية'}</span>
                </p>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  {settings?.categoriesSectionTitle || 'تصفح الهدايا حسب الأقسام'}
                </h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs sm:text-sm font-bold text-[#013D5A] hover:text-slate-900 transition-colors self-center sm:self-auto"
              >
                <span>جميع الأقسام</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Centered Cards Container (Always horizontally centered regardless of active categories count) */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-5 w-full">
              {activeCategories.slice(0, 6).map((cat) => (
                <div 
                  key={cat.id} 
                  className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] md:w-[calc(25%-1rem)] lg:w-[calc(16.666%-1.1rem)] max-w-[210px] shrink-0"
                >
                  <CategoryCardItem cat={cat} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. CURATED PRODUCTS SHOWCASE (FILTER TABS & ELEVATED GRID) */}
      {/* ========================================================================= */}
      {topProducts.length > 0 && (
        <section className="py-10 sm:py-16 bg-[#FAF7F2] border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header & Filter Tabs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-10 text-center md:text-start">
              <div>
                <p className="text-[11px] sm:text-xs font-black text-[#013D5A] uppercase tracking-widest mb-1.5 flex items-center justify-center md:justify-start gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#013D5A]" />
                  <span>{settings?.productsSectionBadge || 'مختارات استثنائية للإهداء'}</span>
                </p>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  {settings?.productsSectionTitle || 'المنتجات الأكثر رواجاً وإهداءً'}
                </h2>
              </div>

              {/* Filter Tabs (Centered on mobile, start on desktop) */}
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 bg-white p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-slate-200/80 overflow-x-auto no-scrollbar mx-auto md:mx-0 shadow-2xs max-w-full">
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
                      "px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all shrink-0 cursor-pointer",
                      activeProductTab === tab.id
                        ? "bg-[#013D5A] text-white shadow-xs font-extrabold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {filteredProducts.slice(0, 8).map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Bottom View All Link */}
            <div className="mt-8 sm:mt-12 text-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 h-11 sm:h-12 px-6 sm:px-8 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#013D5A]/40 text-xs font-bold text-slate-800 transition-all hover:-translate-y-0.5 shadow-2xs"
              >
                <span>استكشف جميع منتجات المتجر</span>
                <ArrowLeft className="w-4 h-4 text-[#013D5A]" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. REAL SOCIAL PROOF / TESTIMONIALS */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden py-10 sm:py-16 bg-white border-t border-slate-200/80">
        {/* Delicate Ambient Testimonial Ribbon */}
        <SectionRibbonFlourish variant="inverted" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <p className="text-[11px] sm:text-xs font-black text-[#013D5A] uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>آراء وتجارب حقيقية</span>
            </p>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              تجارب استثنائية شاركنا بها أحباؤنا
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 hover:border-[#013D5A]/30 hover:shadow-[0_8px_30px_rgba(19,33,60,0.06)] transition-all text-start flex flex-col"
              >
                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 sm:mb-6 flex-1 italic">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="pt-3.5 sm:pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-slate-900">{t.name}</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-400">{t.city}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-[#013D5A] border border-slate-200">
                    {t.gift}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. VIP GIFT CONCIERGE & CUSTOM ASSISTANCE BANNER */}
      {/* ========================================================================= */}
      {settings?.showConcierge !== false && (
        <section className="py-10 sm:py-14 bg-slate-100/70 border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 shadow-xs text-center md:text-start">
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-start w-full md:w-auto">
                <div 
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #025177 0%, #013D5A 100%)' }}
                >
                  <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-black text-slate-900">
                    {settings?.conciergeTitle || 'هل تبحث عن تنسيق هدية خاصة أو بوكس بمواصفات محددة؟'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-xl mx-auto md:mx-0">
                    {settings?.conciergeDesc || 'فريقنا المتخصص في تنسيق الهدايا جاهز لمساعدتك عبر واتساب في اختيار القطع، كتابة بطاقة الإهداء، واختيار ألوان التغليف المناسبة.'}
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/${whatsappPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً، أود المساعدة في تنسيق هدية خاصة 🎁')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto flex items-center justify-center gap-2 h-12 px-7 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black transition-all shadow-sm shrink-0 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{settings?.conciergeBtnText || 'تواصل معنا عبر واتساب'}</span>
              </a>
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
