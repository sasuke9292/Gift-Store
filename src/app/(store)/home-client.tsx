'use client'

import React from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Gift, ArrowLeft, Truck, ShieldCheck, HeartHandshake, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ProductCard } from '@/components/store/product-card'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
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
  
  const features = [
    { icon: Truck, title: 'توصيل سريع ومجاني', desc: 'للطلبات فوق 100 ألف' },
    { icon: Gift, title: 'تغليف فاخر', desc: 'لمسة أنيقة لكل هدية' },
    { icon: ShieldCheck, title: 'تسوق موثوق', desc: 'دفع آمن أو عند الاستلام' },
    { icon: HeartHandshake, title: 'دعم فني', desc: 'على مدار الساعة' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-primary/20 selection:text-primary">
      
      {/* 1. Hero Section (Clean, Typography-Focused) */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-white border-b border-slate-50">
        {/* Subtle Ambient Background */}
        <div className="absolute top-0 right-1/4 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 translate-y-1/3 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border border-slate-100 bg-white px-5 py-2 text-sm font-semibold text-slate-600 mb-8 shadow-sm">
              <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 mr-2 ml-2 animate-pulse"></span>
              تشكيلة الهدايا الحصرية 2026
            </div>
            
            {/* Huge Typography */}
            <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
              لحظاتك الثمينة <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">
                تستحق الأفضل.
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-slate-500 mb-12 leading-relaxed font-medium max-w-2xl mx-auto">
              هدايا استثنائية تُصنع بحب، تغليف فاخر يخطف الأنفاس، وتوصيل سريع يضمن وصول مشاعرك لمن تحب بأبهى صورة.
            </p>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 w-full sm:w-auto">
              <Link href="/shop" className="inline-flex items-center justify-center w-full sm:w-auto h-14 px-10 text-lg rounded-full bg-slate-900 text-white font-bold transition-all shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:scale-105">
                تسوق الآن
              </Link>
              <Link href="/gift-finder" className="inline-flex items-center justify-center w-full sm:w-auto h-14 px-10 text-lg rounded-full bg-white border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all">
                مكتشف الهدايا
              </Link>
            </div>

            {/* Centered Social Proof */}
            <div className="flex flex-col items-center gap-4 pt-8 border-t border-slate-100 w-full max-w-md mx-auto">
              <div className="flex -space-x-3 -space-x-reverse">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Customer" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-amber-500 mb-1.5">
                  {[1, 2, 3, 4, 5].map(i => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                </div>
                <span className="font-semibold text-slate-800 text-sm">انضم إلى أكثر من 10,000 عميل سعيد</span>
              </div>
            </div>
            
          </motion.div>
        </div>
      </section>

      {/* 2. Trust Features (Soft & Integrated) */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center mb-4 transition-colors group-hover:bg-primary/5 group-hover:text-primary">
                  <feature.icon className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Clean Categories */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">تسوق حسب الفئة</h2>
              <p className="text-slate-500">اختر القسم المناسب لتسهيل وصولك للهدية المطلوبة.</p>
            </div>
            <Link href="/categories" className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
              عرض كل الأقسام
              <ArrowLeft className="mr-1 w-4 h-4" />
            </Link>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={itemVariants}>
                <Link href={`/category/${category.slug}`} className="flex flex-col items-center group">
                  <div className="w-full aspect-square bg-white rounded-full p-2 shadow-sm border border-slate-100 mb-4 overflow-hidden group-hover:shadow-md transition-shadow">
                    <div className="w-full h-full rounded-full bg-slate-50 relative overflow-hidden flex items-center justify-center text-slate-300">
                      {category.image ? (
                        <Image src={category.image} alt={category.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 15vw" />
                      ) : (
                        <Gift className="w-8 h-8 stroke-1" />
                      )}
                    </div>
                  </div>
                  <span className="font-medium text-slate-800 text-sm group-hover:text-primary transition-colors text-center">{category.name}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Top Products (Minimalist Gallery) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">الأكثر مبيعاً</h2>
              <p className="text-slate-500">الهدايا المفضلة لدى عملائنا.</p>
            </div>
            <Link href="/shop" className="inline-flex items-center justify-center h-10 px-5 rounded-full border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">
              تسوق كل المنتجات
            </Link>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12"
          >
            {topProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. Clean Call to Action (Gift Finder) */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 rounded-3xl p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              ألا تعرف ماذا تختار؟
            </h2>
            <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              لقد صممنا "مكتشف الهدايا" ليكون مساعدك الشخصي. أجب عن أسئلة بسيطة، ودعنا نقترح لك الهدية التي ستصنع الفارق.
            </p>
            <Link href="/gift-finder" className={buttonVariants({ size: "lg", className: "h-14 px-8 text-base rounded-xl font-bold shadow-none" })}>
              جرب مكتشف الهدايا الآن
              <ArrowUpRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
