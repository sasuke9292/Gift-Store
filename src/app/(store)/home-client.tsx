'use client'

import React from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Gift, ArrowLeft, Truck, ShieldCheck, HeartHandshake, ArrowUpRight, Sparkles, Star } from 'lucide-react'
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
<<<<<<< HEAD
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } }
=======
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
>>>>>>> 56f8de847245b3e559987256a34cc961cd5eed05
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
}

export default function StoreHomeClient({ initialCategories: categories, initialTopProducts: topProducts }: StoreHomeClientProps) {

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
<<<<<<< HEAD
    <div className="flex flex-col min-h-screen bg-[#FBFBFD] selection:bg-rose-500/20 selection:text-rose-900">
      
      {/* 1. Hero Section (Apple-style Centered Minimalist) */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-[#FBFBFD]">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-gradient-to-b from-rose-100/40 via-purple-50/20 to-transparent blur-3xl -z-10" />

        <motion.div 
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center rounded-full border border-slate-200/60 bg-white/50 backdrop-blur-md px-6 py-2.5 text-sm font-medium text-slate-600 mb-10 shadow-sm"
          >
            <Sparkles className="w-4 h-4 mr-2 ml-2 text-rose-500" />
            التشكيلة الجديدة كلياً لعام 2026
          </motion.div>
          
          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-6xl sm:text-7xl lg:text-8xl font-black text-slate-900 tracking-[-0.04em] leading-[1.05] mb-8"
          >
            لحظاتك الثمينة <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500">
              تستحق الأفضل.
            </span>
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl sm:text-2xl text-slate-500 max-w-2xl mx-auto font-medium mb-12 leading-relaxed"
          >
            اكتشف مجموعة من الهدايا الاستثنائية التي تم اختيارها بعناية لتناسب أرقى الأذواق وتخلّد أجمل الذكريات.
          </motion.p>
          
          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href="/shop" className="inline-flex items-center justify-center w-full sm:w-auto h-14 px-10 text-lg rounded-full bg-slate-900 text-white font-semibold transition-all hover:bg-slate-800 hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/20">
              تسوق المنتجات
            </Link>
            <Link href="/gift-finder" className="inline-flex items-center justify-center w-full sm:w-auto h-14 px-10 text-lg rounded-full bg-white border border-slate-200 text-slate-900 font-semibold transition-all hover:border-slate-300 hover:bg-slate-50 hover:scale-105 active:scale-95 shadow-sm">
              مكتشف الهدايا الذكي
            </Link>
          </motion.div>
        </motion.div>
=======
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] selection:bg-rose-500/20 selection:text-rose-900">

      {/* 1. Hero Section (Luxurious & Immersive) */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden bg-white">
        {/* Animated Orbs for a magical feel */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-gradient-to-br from-rose-200/40 via-amber-100/40 to-transparent rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[0%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-tr from-violet-200/30 via-fuchsia-100/30 to-transparent rounded-full blur-3xl pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-start text-right lg:pl-10"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center rounded-full border border-rose-100 bg-rose-50/50 px-5 py-2 text-sm font-semibold text-rose-600 mb-8 backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 mr-2 ml-2" />
                مجموعة هدايا الموسم الحصرية
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
                لأن لحظاتك <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-rose-400 via-fuchsia-500 to-indigo-500">
                  الثمينة تستحق الأفضل
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed font-medium max-w-xl">
                اكتشف تشكيلة حصرية من الهدايا الفاخرة التي تُصنع بحب، لتترك أثراً لا يُنسى في قلوب من تحب.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link href="/shop" className="inline-flex items-center justify-center w-full sm:w-auto h-14 px-10 text-lg rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold transition-all shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] hover:-translate-y-1">
                  تسوق الكوليكشن
                </Link>
                <Link href="/gift-finder" className="inline-flex items-center justify-center w-full sm:w-auto h-14 px-10 text-lg rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-rose-200 hover:text-rose-600 transition-all shadow-sm">
                  مكتشف الهدايا المخصص
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 mt-12 pt-8 border-t border-slate-100">
                <div className="flex -space-x-3 -space-x-reverse">
                  {[10, 12, 14, 16].map((img) => (
                    <div key={img} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                      <Image src={`https://i.pravatar.cc/100?img=${img}`} alt="Customer" width={40} height={40} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-1">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <div className="text-xs font-semibold text-slate-500">تقييم ممتاز من +10,000 عميل</div>
                </div>
              </div>
            </motion.div>

            {/* Visual/Image Side */}
            <motion.div
              style={{ y: y1 }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative hidden lg:block h-[600px] w-full rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-slate-900/10 z-10" />
              <Image
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1200"
                alt="هدايا فاخرة"
                fill
                className="object-cover"
                priority
              />
              {/* Glassmorphism Floating Card */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 -right-10 z-20 bg-white/70 backdrop-blur-xl border border-white/40 p-5 rounded-2xl shadow-xl flex items-center gap-4 w-72"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shrink-0">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">تغليف استثنائي</div>
                  <div className="text-xs text-slate-500">كل هدية تحكي قصة</div>
                </div>
              </motion.div>
            </motion.div>
>>>>>>> 56f8de847245b3e559987256a34cc961cd5eed05

        {/* Hero Image / Visualization */}
        <motion.div 
          style={{ scale: heroScale }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-6xl mx-auto mt-16 px-4 relative z-0"
        >
          <div className="relative aspect-[2/1] sm:aspect-[2.5/1] lg:aspect-[3/1] w-full rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100">
            <Image 
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=2000" 
              alt="Luxury Gift" 
              fill 
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* 2. Trust Features (Minimalist Grid) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#FBFBFD] border border-slate-100 text-slate-800 flex items-center justify-center mb-6 shadow-sm">
                  <feature.icon className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h3 className="font-semibold text-slate-900 text-xl mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-base text-slate-500 leading-relaxed max-w-[250px] mx-auto">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Categories (Clean Grid) */}
      <section className="py-32 bg-[#FBFBFD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-5">مجموعات مختارة</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">تصفح أقسامنا لاكتشاف الهدايا التي تناسب ذوقك الرفيع.</p>
          </div>
<<<<<<< HEAD
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:h-[600px]">
            {/* 2 Large Categories on the left */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8 h-full">
=======

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-auto lg:h-[600px]">
            {/* 2 Large Categories on the left (stacked on mobile) */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
>>>>>>> 56f8de847245b3e559987256a34cc961cd5eed05
              {largeCategories.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`} className="relative rounded-[2.5rem] overflow-hidden group h-[400px] lg:h-full bg-white shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100">
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />
                  {category.image ? (
                    <Image src={category.image} alt={category.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  ) : (
                    <div className="w-full h-full bg-slate-100" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-8 z-20 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                    <h3 className="text-3xl font-bold text-white mb-2">{category.name}</h3>
                    <span className="text-white/80 font-medium text-sm flex items-center">
                      تصفح المجموعة <ArrowLeft className="w-4 h-4 mr-2" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Small Categories on the right */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-8 h-full">
              {smallCategories.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`} className="relative rounded-3xl overflow-hidden group h-48 sm:h-auto bg-white shadow-sm hover:shadow-lg transition-all duration-500 border border-slate-100">
                  {category.image ? (
                    <Image src={category.image} alt={category.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  ) : (
                    <div className="w-full h-full bg-slate-100" />
                  )}
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 bg-black/20 group-hover:bg-black/40 transition-colors">
                    <h3 className="text-xl font-bold text-white text-center">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/categories" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors">
              عرض كل الأقسام
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Top Products (Minimal Gallery) */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">الأكثر مبيعاً</h2>
              <p className="text-xl text-slate-500">الهدايا المفضلة لدى عملائنا المميزين.</p>
            </div>
            <Link href="/shop" className="inline-flex items-center text-rose-500 font-semibold hover:text-rose-600 group">
              تسوق كل المنتجات
              <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16"
          >
            {topProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
<<<<<<< HEAD
        </div>
      </section>

      {/* 5. Clean CTA */}
      <section className="py-32 bg-[#FBFBFD] border-t border-slate-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-10">
            <Gift className="w-12 h-12 text-rose-500" />
=======

          <div className="mt-16 text-center">
            <Link href="/shop" className="inline-flex items-center justify-center h-14 px-10 rounded-full border-2 border-slate-200 text-slate-700 text-lg font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
              اكتشف المزيد من الهدايا
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Stunning Call to Action (Gift Finder) */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black z-0" />

        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-50">
          <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-rose-500/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-indigo-500/30 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[3rem] p-12 md:p-20 text-center shadow-2xl">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-rose-500/30">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
              لا ترهق نفسك بالبحث<br />
              دعنا نجد الهدية المثالية لك!
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              استخدم "مكتشف الهدايا" الذكي. أجب عن 3 أسئلة بسيطة، وسنقوم بتحليل شخصية المستلم واقتراح هدايا ساحرة تناسب ميزانيتك.
            </p>
            <Link href="/gift-finder" className="inline-flex items-center justify-center h-16 px-10 text-lg rounded-2xl bg-white text-slate-900 font-black hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              ابدأ الاستكشاف الآن
              <ArrowUpRight className="ml-2 w-5 h-5" />
            </Link>
>>>>>>> 56f8de847245b3e559987256a34cc961cd5eed05
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            محتار في اختيار الهدية؟
          </h2>
          <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto">
            لقد صممنا "مكتشف الهدايا" ليكون مساعدك الشخصي. أجب عن أسئلة بسيطة وسنقترح لك الهدية التي ستصنع الفارق.
          </p>
          <Link href="/gift-finder" className="inline-flex items-center justify-center h-14 px-10 text-lg rounded-full bg-slate-900 text-white font-semibold transition-all hover:bg-slate-800 hover:scale-105 active:scale-95 shadow-lg">
            جرب مكتشف الهدايا
          </Link>
        </div>
      </section>

    </div>
  )
}
