'use client'

import React, { useMemo } from 'react'
import { HeroShowcase, HeroSlideItem } from '@/components/store/hero-showcase'
import { CategoryGrid } from '@/components/store/category-grid'
import { ProductGrid } from '@/components/store/product-grid'
import { CuratedPersonas, PersonaItem } from '@/components/store/curated-personas'
import { StoreFeatures } from '@/components/store/store-features'
import { ConciergeWhatsAppCard } from '@/components/store/concierge-whatsapp-card'
import { TestimonialsSection } from '@/components/store/testimonials-section'

interface Category {
  id: string
  name: string
  slug: string
  image?: string | null
  description?: string | null
}

interface Product {
  id: string
  name: string
  price: number
  salePrice?: number | null
  description?: string | null
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

export default function StoreHomeClient({
  initialCategories: categories,
  initialTopProducts: topProducts,
  heroBadge,
  heroHeadline,
  heroSubheadline,
  heroSlides,
  settings
}: StoreHomeClientProps) {

  // Process hero slides from database or JSON
  const activeSlides: HeroSlideItem[] = useMemo(() => {
    if (heroSlides && Array.isArray(heroSlides) && heroSlides.length > 0) {
      return heroSlides.map((slide, idx) => ({
        id: slide.id || `slide-${idx}`,
        title: slide.title || 'هدية فاخرة ومميزة',
        subtitle: slide.subtitle || 'تغليف ملكي وجودة استثنائية',
        image: slide.image,
        link: slide.link || '/shop',
        tag: slide.tag || 'مميز'
      }))
    }
    if (settings?.heroSlidesJson) {
      try {
        const parsed = JSON.parse(settings.heroSlidesJson)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((slide, idx) => ({
            id: slide.id || `slide-${idx}`,
            title: slide.title || 'هدية فاخرة ومميزة',
            subtitle: slide.subtitle || 'تغليف ملكي وجودة استثنائية',
            image: slide.image,
            link: slide.link || '/shop',
            tag: slide.tag || 'مميز'
          }))
        }
      } catch (err) {
        console.error('Error parsing heroSlidesJson:', err)
      }
    }
    return []
  }, [heroSlides, settings])

  // Custom gifting personas from settings
  const personas: PersonaItem[] = useMemo(() => {
    return [
      {
        id: 'her',
        title: settings?.persona1Title || 'هدايا لها',
        subtitle: settings?.persona1Subtitle || 'عطور راقية، مجوهرات وبوكسات دلال',
        tag: settings?.persona1Tag || 'الأكثر رقة',
        image: settings?.persona1Image || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
        link: settings?.persona1Link || '/category/women',
        btnText: settings?.persona1BtnText || 'اكتشف هداياها'
      },
      {
        id: 'him',
        title: settings?.persona2Title || 'هدايا له',
        subtitle: settings?.persona2Subtitle || 'ساعات فاخرة، أطقم محافظ ومسابح ملكية',
        tag: settings?.persona2Tag || 'فخامة وهيبة',
        image: settings?.persona2Image || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
        link: settings?.persona2Link || '/category/men',
        btnText: settings?.persona2BtnText || 'اكتشف هداياه'
      },
      {
        id: 'occasions',
        title: settings?.persona3Title || 'مناسبات وأفراح',
        subtitle: settings?.persona3Subtitle || 'تخرج، زواج، خطوبة وذكرى سنوية',
        tag: settings?.persona3Tag || 'لحظات استثنائية',
        image: settings?.persona3Image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
        link: settings?.persona3Link || '/category/occasions',
        btnText: settings?.persona3BtnText || 'تصفح المناسبات'
      },
      {
        id: 'custom',
        title: settings?.persona4Title || 'مخصصة بالاسم',
        subtitle: settings?.persona4Subtitle || 'قطع محفورة وتنسيق خاص يخلد الذكرى',
        tag: settings?.persona4Tag || 'لمسة شخصية',
        image: settings?.persona4Image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
        link: settings?.persona4Link || '/category/custom',
        btnText: settings?.persona4BtnText || 'صمم هديتك'
      }
    ]
  }, [settings])

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Showcase Section */}
      <HeroShowcase
        badge={heroBadge || settings?.heroBadge}
        headline={heroHeadline || settings?.heroHeadline}
        subheadline={heroSubheadline || settings?.heroSubheadline}
        primaryBtnText={settings?.heroPrimaryBtnText}
        primaryBtnLink={settings?.heroPrimaryBtnLink}
        secondaryBtnText={settings?.heroSecondaryBtnText}
        secondaryBtnLink={settings?.heroSecondaryBtnLink}
        slides={activeSlides}
        stat1={{
          value: settings?.stat1Value || '+15K',
          label: settings?.stat1Label || 'عميل سعيد وموثوق'
        }}
        stat2={{
          value: settings?.stat2Value || '4.9★',
          label: settings?.stat2Label || 'تقييم خدماتنا'
        }}
        stat3={{
          value: settings?.stat3Value || '100%',
          label: settings?.stat3Label || 'تغليف يدوي ملكي'
        }}
        badgeTop={{
          small: settings?.heroBadgeTopSmall || 'جودة أصلية ومضمونة',
          bold: settings?.heroBadgeTopBold || 'ضمان استبدال واسترجاع'
        }}
        badgeBottom={{
          small: settings?.heroBadgeBottomSmall || 'خدمة استثنائية',
          bold: settings?.heroBadgeBottomBold || 'تغليف مجاني مع كل طلب'
        }}
      />

      {/* 2. Four Core Guarantees & Features */}
      <StoreFeatures
        feature1={{
          title: settings?.feature1Title || 'شحن سريع وموثوق',
          desc: settings?.feature1Desc || 'توصيل لكافة محافظات العراق خلال 24 - 48 ساعة مع تتبع فوري للشحنة'
        }}
        feature2={{
          title: settings?.feature2Title || 'تغليف ملكي فاخر',
          desc: settings?.feature2Desc || 'علب هدايا فاخرة مع أشرطة حريرية وكارت إهداء بكلماتك مجاناً مع كل طلب'
        }}
        feature3={{
          title: settings?.feature3Title || 'دفع آمن عند الاستلام',
          desc: settings?.feature3Desc || 'عاين هديتك وافحصها قبل الاستلام، مع خيارات دفع بـ زين كاش والماستر كارد'
        }}
        feature4={{
          title: settings?.feature4Title || 'مستشار هدايا ذكي',
          desc: settings?.feature4Desc || 'خوارزمية ذكية وفريق متخصص يساعدك في اختيار الهدية المثالية لأي مناسبة'
        }}
      />

      {/* 3. Categories Grid */}
      <CategoryGrid
        categories={categories}
        title={settings?.categoriesSectionTitle}
        badge={settings?.categoriesSectionBadge}
      />

      {/* 4. Products Tabbed Grid with Quick View */}
      <ProductGrid
        products={topProducts}
        title={settings?.productsSectionTitle}
        badge={settings?.productsSectionBadge}
      />

      {/* 5. Curated Gifting Personas (Optional in Settings) */}
      {(settings?.enablePersonasSection ?? true) && (
        <CuratedPersonas
          badge={settings?.personaSectionBadge}
          title={settings?.personaSectionTitle}
          description={settings?.personaSectionDesc}
          personas={personas}
        />
      )}

      {/* 6. VIP WhatsApp Concierge Banner */}
      {(settings?.showConcierge ?? true) && (
        <ConciergeWhatsAppCard
          title={settings?.conciergeTitle}
          description={settings?.conciergeDesc}
          btnText={settings?.conciergeBtnText}
          whatsappNumber={settings?.whatsappNumber}
          storeName={settings?.storeName}
        />
      )}

      {/* 7. Social Proof & Customer Reviews */}
      <TestimonialsSection />
    </div>
  )
}
