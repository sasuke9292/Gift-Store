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
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
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
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  const features = [
    { icon: Truck, title: 'توصيل فاخر', desc: 'يصلك طلبك في تغليف أسطوري وبسرعة فائقة' },
    { icon: Sparkles, title: 'لمسة شخصية', desc: 'إمكانية حفر الأسماء وإرفاق بطاقات الإهداء' },
    { icon: ShieldCheck, title: 'ضمان الجودة', desc: 'منتجات أصلية 100% مع ضمان استرجاع ذهبي' },
    { icon: HeartHandshake, title: 'خدمة كونسيرج', desc: 'فريق مختص لمساعدتك في اختيار الهدية المثالية' },
  ]

  // For Bento Grid
  const largeCategories = categories.slice(0, 2);
  const smallCategories = categories.slice(2, 6);

  return (
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

          </div>
        </div>
      </section>

      {/* 2. Trust Features (Premium Cards) */}
      <section className="py-16 bg-[#FAFAFA] relative z-20 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center mb-5 transition-colors group-hover:bg-rose-50 group-hover:text-rose-600">
                  <feature.icon className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Bento Grid Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">تسوق حسب القسم</h2>
              <p className="text-slate-500 text-lg">مجموعات مختارة بعناية لتناسب كل مناسبة وشخصية.</p>
            </div>
            <Link href="/categories" className="group inline-flex items-center text-sm font-bold text-slate-900 hover:text-rose-600 transition-colors bg-slate-50 px-6 py-3 rounded-full">
              تصفح كل الأقسام
              <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-auto lg:h-[600px]">
            {/* 2 Large Categories on the left (stacked on mobile) */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
              {largeCategories.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`} className="relative rounded-[2rem] overflow-hidden group h-[300px] sm:h-[400px] lg:h-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10" />
                  {category.image ? (
                    <Image src={category.image} alt={category.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                  ) : (
                    <div className="w-full h-full bg-slate-100" />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex justify-between items-end">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">{category.name}</h3>
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Small Categories on the right */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-6 h-full">
              {smallCategories.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`} className="relative rounded-3xl overflow-hidden group h-40 sm:h-auto">
                  <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors z-10" />
                  {category.image ? (
                    <Image src={category.image} alt={category.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-slate-100" />
                  )}
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4">
                    <h3 className="text-lg font-bold text-white text-center drop-shadow-md">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Top Products (Curated Gallery) */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">اختيارات النخبة</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">تشكيلة حصرية من الهدايا الأكثر طلباً والأعلى تقييماً من عملائنا المميزين.</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {topProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

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
          </div>
        </div>
      </section>

    </div>
  )
}
