'use client'

import React from 'react'
import Link from 'next/link'
import { Gift, Truck, ShieldCheck, HeartHandshake, Sparkles, ArrowLeft, Star, Package, Zap, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ProductCard } from '@/components/store/product-card'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const }
  })
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
}

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
}

const features = [
  {
    icon: Truck,
    title: 'توصيل مجاني وسريع',
    desc: 'لجميع الطلبات التي تتجاوز 100 ألف د.ع',
    color: '#C9A96E',
    bg: '#FBF6EE'
  },
  {
    icon: Sparkles,
    title: 'تغليف هدايا استثنائي',
    desc: 'لمسة من الأناقة تليق بكل مناسبة',
    color: '#E85D75',
    bg: '#FDF2F4'
  },
  {
    icon: ShieldCheck,
    title: 'دفع آمن وموثوق',
    desc: 'خيارات متعددة تشمل الدفع عند الاستلام',
    color: '#10B981',
    bg: '#F0FDF9'
  },
  {
    icon: HeartHandshake,
    title: 'دعم فني متواصل',
    desc: 'نحن هنا لمساعدتك على مدار الساعة',
    color: '#6366F1',
    bg: '#F5F3FF'
  },
]

export default function StoreHomeClient({
  initialCategories: categories,
  initialTopProducts: topProducts,
  heroBadge,
  heroHeadline,
  heroSubheadline
}: StoreHomeClientProps) {

  const heroCategories = categories.slice(0, 3)
  const gridCategories = categories.slice(0, 6)

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8] overflow-x-hidden">

      {/* ===== 1. HERO SECTION ===== */}
      <section className="relative overflow-hidden min-h-[92vh] flex flex-col justify-center">
        {/* Warm gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAF8] via-[#F8F2EA] to-[#FDF6EE] -z-10" />
        
        {/* Decorative blobs */}
        <div className="absolute top-0 end-0 w-[600px] h-[600px] bg-[#C9A96E]/8 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 start-0 w-[400px] h-[400px] bg-[#E85D75]/5 rounded-full blur-[80px] -z-10 -translate-x-1/4 translate-y-1/4" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] -z-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #1C1917 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Hero Text */}
            <div className="relative z-10 text-center lg:text-end order-2 lg:order-1">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 bg-[#FBF6EE] border border-[#C9A96E]/30 rounded-full px-4 py-2 text-sm font-bold text-[#A07850] mb-8"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
                {heroBadge || 'التشكيلة الجديدة كلياً لعام 2026'}
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6"
              >
                {heroHeadline ? (
                  <span className="text-[#1C1917]" dangerouslySetInnerHTML={{ __html: heroHeadline.replace('\n', '<br/>') }} />
                ) : (
                  <>
                    <span className="text-[#1C1917]">لحظاتك المهمة</span>
                    <br />
                    <span className="text-gold">تستحق الأفضل</span>
                  </>
                )}
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg text-[#78716C] max-w-lg mx-auto lg:mx-0 lg:me-auto mb-10 leading-relaxed"
              >
                {heroSubheadline || 'اكتشف مجموعة من الهدايا الاستثنائية التي تم اختيارها بعناية لتناسب أرقى الأذواق وتخلّد أجمل الذكريات.'}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-4"
              >
                <Link
                  href="/shop"
                  className="group flex items-center justify-center gap-2 h-14 px-10 rounded-2xl text-white font-bold text-lg transition-all hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)',
                    boxShadow: '0 4px 20px rgba(184,137,58,0.35)'
                  }}
                >
                  تسوق الآن
                  <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                </Link>
                <Link
                  href="/gift-finder"
                  className="flex items-center justify-center gap-2 h-14 px-8 rounded-2xl font-bold text-[#1C1917] bg-white border border-[#E8E4DF] hover:border-[#C9A96E]/40 hover:bg-[#FBF6EE] transition-all hover:-translate-y-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                >
                  <Sparkles className="w-4 h-4 text-[#C9A96E]" />
                  مكتشف الهدايا
                </Link>
              </motion.div>

              {/* Trust Micro-stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center justify-center lg:justify-end gap-8 mt-10 text-sm"
              >
                {[
                  { label: 'منتج متاح', value: '500+' },
                  { label: 'عميل راضٍ', value: '12K+' },
                  { label: 'تقييم متوسط', value: '4.9 ★' },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-black text-[#1C1917]">{stat.value}</p>
                    <p className="text-[#A8A29E] font-medium">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Hero Visual — Category Preview Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative order-1 lg:order-2"
            >
              {heroCategories.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {heroCategories[0] && (
                    <Link
                      href={`/category/${heroCategories[0].slug}`}
                      className="col-span-2 relative aspect-[16/9] rounded-3xl overflow-hidden group"
                      style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}
                    >
                      {heroCategories[0].image ? (
                        <Image src={heroCategories[0].image} alt={heroCategories[0].name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#C9A96E] to-[#A07850]" />
                      )}
                      <div className="absolute inset-0 img-overlay-bottom" />
                      <div className="absolute bottom-4 start-4 end-4">
                        <p className="text-white font-black text-xl">{heroCategories[0].name}</p>
                      </div>
                    </Link>
                  )}
                  {heroCategories.slice(1).map(cat => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="relative aspect-square rounded-2xl overflow-hidden group"
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    >
                      {cat.image ? (
                        <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#F5F0EA] to-[#E8DFD3]" />
                      )}
                      <div className="absolute inset-0 img-overlay-bottom opacity-60" />
                      <div className="absolute bottom-3 start-3 end-3">
                        <p className="text-white font-bold text-sm">{cat.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* Fallback decorative element when no categories */
                <div className="relative">
                  <div className="aspect-square max-w-md mx-auto rounded-3xl overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #FBF6EE 0%, #F5EDD8 100%)', boxShadow: '0 20px 60px rgba(201,169,110,0.2)' }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <Gift className="w-32 h-32 text-[#C9A96E]/40" />
                    </div>
                  </div>
                  {/* Floating badges */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-8 -start-6 bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-[#E8E4DF]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FBF6EE] flex items-center justify-center">
                        <Star className="w-5 h-5 text-[#C9A96E] fill-[#C9A96E]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#A8A29E]">تقييم العملاء</p>
                        <p className="font-black text-[#1C1917]">4.9 / 5</p>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute bottom-16 -end-6 bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-[#E8E4DF]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] flex items-center justify-center">
                        <Package className="w-5 h-5 text-[#E85D75]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#A8A29E]">شُحن اليوم</p>
                        <p className="font-black text-[#1C1917]">+120 طلب</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== 2. TRUST FEATURES ===== */}
      <section className="py-16 bg-white border-y border-[#E8E4DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                custom={idx}
                className="flex flex-col items-center text-center group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1"
                  style={{ background: feature.bg }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="font-bold text-[#1C1917] text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-[#A8A29E] leading-relaxed max-w-[180px]">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== 3. CATEGORIES GRID ===== */}
      {gridCategories.length > 0 && (
        <section className="py-20 bg-[#FAFAF8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-sm font-bold text-[#C9A96E] uppercase tracking-widest mb-2">استكشف</p>
                <h2 className="text-3xl sm:text-4xl font-black text-[#1C1917] tracking-tight">مجموعاتنا المختارة</h2>
              </div>
              <Link
                href="/shop"
                className="flex items-center gap-2 text-sm font-bold text-[#78716C] hover:text-[#C9A96E] transition-colors group"
              >
                عرض الكل
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>

            {/* Category Grid */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {/* First large card */}
              {gridCategories[0] && (
                <motion.div variants={fadeUp} className="col-span-2 md:col-span-1 md:row-span-2">
                  <Link
                    href={`/category/${gridCategories[0].slug}`}
                    className="group relative rounded-3xl overflow-hidden block h-64 md:h-full transition-all duration-300 hover:-translate-y-1"
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)', minHeight: '280px' }}
                  >
                    {gridCategories[0].image ? (
                      <Image src={gridCategories[0].image} alt={gridCategories[0].name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div style={{ background: 'linear-gradient(135deg, #C9A96E, #A07850)' }} className="w-full h-full" />
                    )}
                    <div className="absolute inset-0 img-overlay-bottom" />
                    <div className="absolute bottom-0 start-0 end-0 p-6">
                      <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">تصفح</p>
                      <h3 className="text-white font-black text-2xl">{gridCategories[0].name}</h3>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Smaller cards */}
              {gridCategories.slice(1).map((cat, idx) => (
                <motion.div key={cat.id} variants={fadeUp} custom={idx + 1}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="group relative rounded-2xl overflow-hidden block h-32 md:h-36 transition-all duration-300 hover:-translate-y-1"
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
                  >
                    {cat.image ? (
                      <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#F5F0EA] to-[#E8DFD3]" />
                    )}
                    <div className="absolute inset-0 img-overlay-bottom opacity-70" />
                    <div className="absolute bottom-3 start-3 end-3">
                      <h3 className="text-white font-bold text-base">{cat.name}</h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ===== 4. TOP PRODUCTS ===== */}
      {topProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-sm font-bold text-[#E85D75] uppercase tracking-widest mb-2">الأكثر طلباً</p>
                <h2 className="text-3xl sm:text-4xl font-black text-[#1C1917] tracking-tight">المنتجات الأكثر مبيعاً</h2>
              </div>
              <Link
                href="/shop"
                className="flex items-center gap-2 text-sm font-bold text-[#78716C] hover:text-[#C9A96E] transition-colors group"
              >
                عرض الكل
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {topProducts.slice(0, 8).map((product, idx) => (
                <motion.div key={product.id} variants={fadeUp} custom={idx} className="h-full">
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ===== 5. PROMOTIONAL BANNER ===== */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center"
            style={{ background: 'linear-gradient(135deg, #1C1917 0%, #2D2926 50%, #1C1917 100%)' }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 end-0 w-96 h-96 bg-[#C9A96E]/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 start-0 w-64 h-64 bg-[#E85D75]/8 rounded-full blur-[60px] pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#C9A96E]/15 border border-[#C9A96E]/25 flex items-center justify-center mx-auto mb-6">
                <Gift className="w-8 h-8 text-[#C9A96E]" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                محتار في اختيار الهدية؟
              </h2>
              <p className="text-white/55 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                مكتشف الهدايا الذكي يساعدك في إيجاد الهدية المثالية في دقائق. أجب عن أسئلة بسيطة وسنقترح لك الهدية التي ستصنع الفارق.
              </p>
              <Link
                href="/gift-finder"
                className="inline-flex items-center gap-3 h-14 px-10 rounded-2xl font-black text-[#1C1917] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,169,110,0.5)]"
                style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
              >
                <Sparkles className="w-5 h-5" />
                جرّب مكتشف الهدايا
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== 6. WHY CHOOSE US ===== */}
      <section className="py-20 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-bold text-[#C9A96E] uppercase tracking-widest mb-2">لماذا نحن</p>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1C1917] tracking-tight">تجربة تسوق لا مثيل لها</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'اختيار ذكي وسريع',
                desc: 'خوارزميات تساعدك في اختيار الهدية المناسبة لكل شخص ومناسبة في وقت قياسي',
                color: '#C9A96E',
                bg: '#FBF6EE'
              },
              {
                icon: ShieldCheck,
                title: 'جودة مضمونة 100%',
                desc: 'كل منتج يمر بفحص دقيق قبل وصوله إليك مع ضمان الاسترجاع خلال 7 أيام',
                color: '#10B981',
                bg: '#F0FDF9'
              },
              {
                icon: HeartHandshake,
                title: 'تغليف يعكس مشاعرك',
                desc: 'تغليف فاخر بشكل احترافي مع إمكانية إضافة بطاقة مخصصة برسالة من قلبك',
                color: '#E85D75',
                bg: '#FDF2F4'
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white rounded-3xl p-8 border border-[#E8E4DF] hover:border-[#C9A96E]/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)] transition-all duration-300 group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: item.bg }}
                >
                  <item.icon className="w-7 h-7" style={{ color: item.color }} />
                </div>
                <h3 className="font-black text-[#1C1917] text-xl mb-3">{item.title}</h3>
                <p className="text-[#78716C] leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
