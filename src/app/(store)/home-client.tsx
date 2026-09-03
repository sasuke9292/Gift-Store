'use client'

import React from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Gift, ArrowLeft, Truck, ShieldCheck, HeartHandshake, ArrowUpLeft, Sparkles } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { ProductCard } from '@/components/store/product-card'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } }
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

export default function StoreHomeClient({ 
  initialCategories: categories, 
  initialTopProducts: topProducts,
  heroBadge,
  heroHeadline,
  heroSubheadline
}: StoreHomeClientProps) {
  
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  const features = [
    { icon: Truck, title: 'توصيل مجاني وسريع', desc: 'لجميع الطلبات التي تتجاوز 100 ألف د.ع' },
    { icon: Sparkles, title: 'تغليف هدايا استثنائي', desc: 'لمسة من الأناقة تليق بكل مناسبة' },
    { icon: ShieldCheck, title: 'دفع آمن وموثوق', desc: 'خيارات متعددة تشمل الدفع عند الاستلام' },
    { icon: HeartHandshake, title: 'دعم فني متواصل', desc: 'نحن هنا لمساعدتك على مدار الساعة' },
  ]

  const largeCategories = categories.slice(0, 2);
  const smallCategories = categories.slice(2, 6);

  return (
    <div className="flex flex-col min-h-screen bg-[#050B14] selection:bg-amber-500/20 selection:text-amber-200 text-white font-sans overflow-x-hidden">
      
      {/* 1. Hero Section (Premium 3D Modern RTL) */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden bg-[#050B14] perspective-[1200px]">
        
        {/* 3D Depth Background & Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#132347] via-[#050B14] to-[#010306] -z-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] max-w-[1200px] max-h-[1200px] bg-blue-600/10 rounded-full blur-[120px] -z-20 mix-blend-screen" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] -z-20 mix-blend-screen translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[120px] -z-20 mix-blend-screen -translate-x-1/3 translate-y-1/3" />

        {/* Floating 3D Elements (Glassmorphism & Depth) */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Top Right - 3D Gift Box Placeholder (Glass Orb) */}
          <motion.div 
            animate={{ y: [0, -30, 0], rotateX: [0, 10, 0], rotateY: [0, 20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] right-[10%] lg:right-[20%] w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-white/0 backdrop-blur-xl shadow-[0_0_50px_rgba(37,99,235,0.2)] flex items-center justify-center before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-tr before:from-transparent before:to-white/20"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Gift className="w-12 h-12 md:w-20 md:h-20 text-white/80 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transform translate-z-[50px]" />
          </motion.div>

          {/* Bottom Left - 3D Ribbon/Card (Glass Card) */}
          <motion.div 
            animate={{ y: [0, 40, 0], rotateZ: [-10, -5, -10], rotateX: [10, 0, 10] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[20%] left-[5%] lg:left-[15%] w-40 h-56 md:w-56 md:h-72 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center overflow-hidden"
            style={{ transformStyle: 'preserve-3d', transform: 'rotate(-10deg) rotateX(10deg)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-rose-500/20 to-transparent opacity-50" />
            <HeartHandshake className="w-16 h-16 md:w-24 md:h-24 text-rose-300 drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)] transform translate-z-[40px]" />
          </motion.div>

          {/* Center Right - Small Floating Star */}
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-[45%] right-[5%] lg:right-[12%] w-16 h-16 rounded-full bg-gradient-to-tr from-amber-200 to-yellow-500 blur-[2px] shadow-[0_0_30px_rgba(251,191,36,0.6)] flex items-center justify-center opacity-80"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          {/* Top Left - Small Sparkle Orb */}
          <motion.div 
            animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[25%] left-[10%] lg:left-[25%] w-20 h-20 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center justify-center"
          >
            <Sparkles className="w-8 h-8 text-sky-300 drop-shadow-[0_0_15px_rgba(56,189,248,0.8)]" />
          </motion.div>
        </div>

        <motion.div 
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center text-center transform-gpu"
        >
          {/* Premium Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center rounded-full border border-white/20 bg-white/5 backdrop-blur-xl px-6 py-2.5 text-sm font-medium text-blue-100 mb-10 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          >
            <Sparkles className="w-4 h-4 me-2 ms-2 text-amber-300 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" />
            {heroBadge || "التشكيلة الجديدة كلياً لعام 2026"}
          </motion.div>
          
          {/* Headline - Exact Arabic Text */}
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-7xl lg:text-[7rem] font-black tracking-[-0.02em] leading-[1.1] mb-8 drop-shadow-2xl"
          >
            {heroHeadline ? (
              <span className="text-white" dangerouslySetInnerHTML={{ __html: heroHeadline.replace('\n', '<br/>') }} />
            ) : (
              <>
                <span className="text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">لحظاتك المهمة</span> <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-yellow-600 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                  تستحق الأفضل
                </span>
              </>
            )}
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl sm:text-2xl text-slate-300 max-w-2xl mx-auto font-medium mb-12 leading-relaxed drop-shadow-lg"
          >
            {heroSubheadline || "اكتشف مجموعة من الهدايا الاستثنائية التي تم اختيارها بعناية لتناسب أرقى الأذواق وتخلّد أجمل الذكريات."}
          </motion.p>
          
          {/* Actions - Premium Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
          >
            <Link href="/shop" className="relative group inline-flex items-center justify-center w-full sm:w-auto h-14 px-10 text-lg rounded-full bg-white text-slate-900 font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.25)] overflow-hidden">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out -skew-x-12 translate-x-[-150%]" />
              تسوق المنتجات
            </Link>
            <Link href="/gift-finder" className="inline-flex items-center justify-center w-full sm:w-auto h-14 px-10 text-lg rounded-full bg-white/10 border border-white/20 text-white font-medium transition-all hover:bg-white/20 hover:border-white/40 hover:scale-105 active:scale-95 backdrop-blur-md shadow-lg">
              مكتشف الهدايا الذكي
              <ArrowUpLeft className="ms-3 w-5 h-5 text-amber-300" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Trust Features (3D Glass Cards) */}
      <section className="py-24 relative z-10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="flex flex-col items-center text-center group perspective-[1000px]"
              >
                <div className="w-20 h-20 rounded-2xl glass-card flex items-center justify-center mb-6 shadow-xl transform group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-3 transition-all duration-500 ease-out border-white/10 before:absolute before:inset-0 before:bg-gradient-to-tr before:from-transparent before:to-white/10 before:rounded-2xl">
                  <feature.icon className="w-8 h-8 stroke-[1.5] text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                </div>
                <h3 className="font-bold text-white text-xl mb-3 tracking-wide">{feature.title}</h3>
                <p className="text-base text-slate-400 leading-relaxed max-w-[250px] mx-auto">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Categories (Premium 3D Grids) */}
      <section className="py-32 relative bg-[#010306]">
        {/* Subtle glowing elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-5 drop-shadow-md">مجموعات مختارة</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">تصفح أقسامنا لاكتشاف الهدايا التي تناسب ذوقك الرفيع في بيئة ثلاثية الأبعاد.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:h-[600px] perspective-[1000px]">
            {/* 2 Large Categories on the left */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8 h-full">
              {largeCategories.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`} className="relative rounded-[2.5rem] overflow-hidden group h-[400px] lg:h-full glass-card hover:shadow-[0_20px_50px_rgba(37,99,235,0.15)] hover:-translate-y-2 hover:scale-[1.02] transition-all duration-700 ease-out border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#050B14]/80 to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity duration-700" />
                  {category.image ? (
                    <Image src={category.image} alt={category.name} fill className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-1000 ease-[0.16,1,0.3,1] z-0" />
                  ) : (
                    <div className="w-full h-full bg-[#132347]/50" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-10 z-20 flex flex-col justify-end bg-gradient-to-t from-[#050B14] via-[#050B14]/80 to-transparent transform group-hover:translate-y-[-10px] transition-transform duration-500">
                    <h3 className="text-3xl font-black text-white mb-3 drop-shadow-lg">{category.name}</h3>
                    <span className="text-amber-300 font-bold text-sm flex items-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      تصفح المجموعة <ArrowLeft className="w-4 h-4 ms-2" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Small Categories on the right */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-8 h-full">
              {smallCategories.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`} className="relative rounded-3xl overflow-hidden group h-48 sm:h-auto glass-card hover:shadow-[0_15px_40px_rgba(37,99,235,0.1)] hover:-translate-y-1 hover:scale-[1.03] transition-all duration-500 border-white/5">
                  {category.image ? (
                    <Image src={category.image} alt={category.name} fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" />
                  ) : (
                    <div className="w-full h-full bg-[#132347]/30" />
                  )}
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 bg-gradient-to-t from-[#050B14]/90 to-[#050B14]/30 group-hover:from-[#050B14]/70 transition-colors duration-500">
                    <h3 className="text-xl font-bold text-white text-center drop-shadow-md">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/shop" className="inline-flex items-center justify-center h-14 px-10 rounded-full glass-button text-white font-bold tracking-wide">
              عرض كل الأقسام
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Top Products (3D Floating Gallery) */}
      <section className="py-32 relative bg-[#050B14] perspective-[1000px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 relative z-10">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-md">الأكثر مبيعاً</h2>
              <p className="text-xl text-slate-400">الهدايا المفضلة لدى عملائنا المميزين.</p>
            </div>
            <Link href="/shop" className="inline-flex items-center text-amber-400 font-bold hover:text-amber-300 group">
              تسوق كل المنتجات
              <ArrowLeft className="ms-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16 relative z-10"
          >
            {topProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants} className="h-full">
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. Clean CTA (Premium Glassmorphism Orb) */}
      <section className="py-32 relative bg-[#010306] overflow-hidden">
        {/* Abstract 3D Glowing Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-rose-500/10 to-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div 
            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-28 h-28 rounded-full glass-card flex items-center justify-center mx-auto mb-10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] border-white/20 before:absolute before:inset-0 before:bg-gradient-to-tr before:from-transparent before:to-white/10 before:rounded-full"
          >
            <Gift className="w-14 h-14 text-amber-300 drop-shadow-[0_10px_10px_rgba(251,191,36,0.4)]" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
            محتار في اختيار الهدية؟
          </h2>
          <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
            لقد صممنا "مكتشف الهدايا" ليكون مساعدك الشخصي. أجب عن أسئلة بسيطة وسنقترح لك الهدية التي ستصنع الفارق.
          </p>
          <Link href="/gift-finder" className="inline-flex items-center justify-center h-16 px-12 text-xl rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-[#050B14] font-black transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(251,191,36,0.3)] hover:shadow-[0_15px_40px_rgba(251,191,36,0.5)] overflow-hidden group">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out -skew-x-12 translate-x-[-150%]" />
            جرب مكتشف الهدايا
          </Link>
        </div>
      </section>

    </div>
  )
}
