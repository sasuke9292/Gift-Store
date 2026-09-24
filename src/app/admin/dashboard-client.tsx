'use client'

import React from 'react'
import { SalesChart } from '@/components/admin/sales-chart'
import { RecentOrders } from '@/components/admin/recent-orders'
import { 
  DollarSign, 
  ShoppingBag, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Package, 
  AlertTriangle, 
  ArrowUpRight, 
  Sparkles, 
  ArrowLeft, 
  Plus,
  ExternalLink,
  Layers,
  Tags,
  MessageCircle,
  Settings,
  CheckCircle2
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Order } from '@prisma/client'
import Link from 'next/link'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } }
}

export interface DashboardStats {
  totalSales: number
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  cancelledOrders: number
  totalProducts: number
  lowStockProducts: number
  heroSlidesCount?: number
  categoriesCount?: number
}

function MiniStat({ label, value, color, bg, border }: { label: string, value: number | string, color: string, bg: string, border: string }) {
  return (
    <div className={`bg-white border ${border} rounded-2xl p-4 flex items-center gap-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200`}>
      <div className={`w-3 h-10 rounded-full ${bg} shrink-0`} />
      <div className="min-w-0">
        <p className="text-xs font-bold text-[#A8A29E] mb-0.5 truncate">{label}</p>
        <p className={`text-xl font-black ${color} truncate`}>{value}</p>
      </div>
    </div>
  )
}

export default function AdminDashboardHome({ 
  stats, 
  recentOrders, 
  userName 
}: { 
  stats: DashboardStats
  recentOrders: Order[]
  userName?: string | null 
}) {
  const fulfillmentRate = stats.totalOrders > 0 
    ? Math.round((stats.completedOrders / stats.totalOrders) * 100) 
    : 100

  const pendingRate = stats.totalOrders > 0
    ? Math.round((stats.pendingOrders / stats.totalOrders) * 100)
    : 0

  const cancelledRate = stats.totalOrders > 0
    ? Math.round((stats.cancelledOrders / stats.totalOrders) * 100)
    : 0

  return (
    <div className="space-y-7 pb-12 font-sans text-start" dir="rtl">
      
      {/* 1. Welcome & Control Center Header */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-white border border-[#E8E4DF] rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
      >
        <div className="absolute top-0 end-0 w-80 h-80 bg-[#13213c]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 start-0 w-60 h-60 bg-[#13213c]/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
              style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-black text-[#1C1917] tracking-tight">
              {userName ? `مرحباً، ${userName} 👋` : 'لوحة تحكم وإدارة المتجر 👋'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#78716C] ms-0 sm:ms-11.5 leading-relaxed">
            متابعة فورية ومباشرة لحركة المبيعات، طلبيات الزبائن، والتحكم في شرائح الواجهة والمنتجات.
          </p>
        </div>
        
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <Link 
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 h-11 px-4 rounded-xl bg-[#FAFAF8] border border-[#E8E4DF] text-[#1C1917] hover:bg-white font-bold text-xs sm:text-sm transition-all hover:border-[#13213c]/40 shadow-xs"
            title="معاينة المتجر المباشر"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#13213c]" />
            <span>معاينة المتجر</span>
          </Link>

          <Link 
            href="/admin/orders"
            className="flex items-center gap-2 h-11 px-4.5 rounded-xl bg-white border border-[#E8E4DF] text-[#1C1917] hover:bg-[#FAFAF8] font-bold text-xs sm:text-sm transition-all hover:border-[#13213c]/40 shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-[#13213c]" />
            <span>إدارة الطلبات</span>
          </Link>

          <Link
            href="/admin/products?tab=create"
            className="flex items-center gap-2 h-11 px-5 rounded-xl text-white font-extrabold text-xs sm:text-sm transition-all hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(19,33,60,0.35)] cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
          >
            <Plus className="w-4 h-4 text-white" />
            <span>إضافة منتج جديد</span>
          </Link>
        </div>
      </motion.div>

      {/* 2. Quick Action Hub (منصة الإجراءات السريعة المنظمة) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4"
      >
        {/* Quick 1: Hero Slides Manager */}
        <motion.div variants={itemVariants}>
          <Link
            href="/admin/settings?tab=slides"
            className="p-4 rounded-2xl bg-white border border-[#E8E4DF] hover:border-[#13213c]/40 hover:shadow-md transition-all group flex flex-col justify-between h-full"
          >
            <div className="flex items-start justify-between mb-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
              >
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#13213c]/10 text-[#13213c]">
                {stats.heroSlidesCount ?? 4} شرائح
              </span>
            </div>
            <div>
              <p className="text-xs font-black text-[#1C1917] group-hover:text-[#13213c] transition-colors">
                سلايدر الواجهة
              </p>
              <p className="text-[11px] text-[#78716C] mt-0.5">
                ترتيب وإضافة شرائح الهدايا
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Quick 2: WhatsApp Orders */}
        <motion.div variants={itemVariants}>
          <Link
            href="/admin/orders"
            className="p-4 rounded-2xl bg-white border border-[#E8E4DF] hover:border-[#13213c]/40 hover:shadow-md transition-all group flex flex-col justify-between h-full"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shadow-xs group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              {stats.pendingOrders > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                  {stats.pendingOrders} معلق
                </span>
              )}
            </div>
            <div>
              <p className="text-xs font-black text-[#1C1917] group-hover:text-[#13213c] transition-colors">
                طلبات WhatsApp
              </p>
              <p className="text-[11px] text-[#78716C] mt-0.5">
                متابعة وتأكيد المراسلات
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Quick 3: Products Catalog */}
        <motion.div variants={itemVariants}>
          <Link
            href="/admin/products"
            className="p-4 rounded-2xl bg-white border border-[#E8E4DF] hover:border-[#13213c]/40 hover:shadow-md transition-all group flex flex-col justify-between h-full"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shadow-xs group-hover:scale-105 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {stats.totalProducts} منتج
              </span>
            </div>
            <div>
              <p className="text-xs font-black text-[#1C1917] group-hover:text-[#13213c] transition-colors">
                كتالوج المنتجات
              </p>
              <p className="text-[11px] text-[#78716C] mt-0.5">
                تعديل الأسعار والمخزون
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Quick 4: Store Settings */}
        <motion.div variants={itemVariants}>
          <Link
            href="/admin/settings"
            className="p-4 rounded-2xl bg-white border border-[#E8E4DF] hover:border-[#13213c]/40 hover:shadow-md transition-all group flex flex-col justify-between h-full"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 shadow-xs group-hover:scale-105 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                11 تبويب
              </span>
            </div>
            <div>
              <p className="text-xs font-black text-[#1C1917] group-hover:text-[#13213c] transition-colors">
                إعدادات المتجر
              </p>
              <p className="text-[11px] text-[#78716C] mt-0.5">
                الهوية، الشحن، والبانرات
              </p>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* 3. Core Performance KPI Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-5"
      >
        {/* Total Sales */}
        <motion.div variants={itemVariants} className="bg-white border border-[#E8E4DF] rounded-3xl p-6 relative overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-[#13213c]/50 transition-all duration-300 group">
          <div className="absolute top-0 end-0 w-32 h-32 bg-[#13213c]/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#13213c] shadow-sm"
                style={{ background: 'linear-gradient(135deg, #F0F4F9 0%, #E2EAF4 100%)', border: '1px solid rgba(19, 33, 60,0.25)' }}
              >
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ArrowUpRight className="w-3 h-3" />مكتمل
              </span>
            </div>
            <p className="text-xs font-bold text-[#A8A29E] uppercase tracking-wider mb-1">إجمالي المبيعات المحققة</p>
            <p className="text-3xl font-black text-[#1C1917] tracking-tight">
              {stats.totalSales.toLocaleString('en-US')}{' '}
              <span className="text-base font-bold text-[#13213c]">د.ع</span>
            </p>
          </div>
        </motion.div>

        {/* Total Orders */}
        <motion.div variants={itemVariants} className="bg-white border border-[#E8E4DF] rounded-3xl p-6 relative overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-blue-300 transition-all duration-300 group">
          <div className="absolute top-0 end-0 w-32 h-32 bg-blue-500/8 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shadow-sm">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {fulfillmentRate}% تسليم
              </span>
            </div>
            <p className="text-xs font-bold text-[#A8A29E] uppercase tracking-wider mb-1">إجمالي عدد الطلبات</p>
            <p className="text-3xl font-black text-[#1C1917] tracking-tight">
              {stats.totalOrders}{' '}
              <span className="text-sm font-normal text-[#78716C]">طلب</span>
            </p>
          </div>
        </motion.div>

        {/* Low Stock / Inventory Alert */}
        <motion.div variants={itemVariants} className="bg-white border border-[#E8E4DF] rounded-3xl p-6 relative overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-amber-300 transition-all duration-300 group">
          <div className="absolute top-0 end-0 w-32 h-32 bg-amber-500/8 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shadow-sm">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${stats.lowStockProducts > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                {stats.lowStockProducts > 0 ? 'تنبيه مخزون' : 'مستقر 100%'}
              </span>
            </div>
            <p className="text-xs font-bold text-[#A8A29E] uppercase tracking-wider mb-1">منتجات أوشكت على النفاد</p>
            <p className={`text-3xl font-black tracking-tight ${stats.lowStockProducts > 0 ? 'text-amber-600' : 'text-[#1C1917]'}`}>
              {stats.lowStockProducts}{' '}
              <span className="text-sm font-normal text-[#78716C]">منتج</span>
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* 4. Secondary Metrics & Order Status Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12 }}
        className="bg-white border border-[#E8E4DF] rounded-3xl p-5 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E4DF]/70 pb-3">
          <div>
            <h3 className="text-sm font-black text-[#1C1917]">توزيع وحالة الطلبيات</h3>
            <p className="text-xs text-[#78716C]">نسبة الإنجاز بين الطلبات المكتملة، المعلقة، والملغاة</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              مكتمل ({stats.completedOrders})
            </span>
            <span className="flex items-center gap-1 text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              قيد المراجعة ({stats.pendingOrders})
            </span>
            <span className="flex items-center gap-1 text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              ملغى ({stats.cancelledOrders})
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="h-3 w-full bg-[#FAFAF8] rounded-full overflow-hidden flex p-0.5 border border-[#E8E4DF]/70">
          <div 
            style={{ width: `${fulfillmentRate}%` }} 
            className="h-full bg-emerald-500 rounded-s-full transition-all duration-500"
            title={`مكتمل: ${fulfillmentRate}%`}
          />
          <div 
            style={{ width: `${pendingRate}%` }} 
            className="h-full bg-amber-500 transition-all duration-500"
            title={`قيد المراجعة: ${pendingRate}%`}
          />
          <div 
            style={{ width: `${cancelledRate}%` }} 
            className="h-full bg-rose-400 rounded-e-full transition-all duration-500"
            title={`ملغى: ${cancelledRate}%`}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <MiniStat label="طلبات مكتملة" value={stats.completedOrders} color="text-emerald-700" bg="bg-emerald-500" border="border-emerald-100" />
          <MiniStat label="قيد المراجعة والتجهيز" value={stats.pendingOrders} color="text-amber-700" bg="bg-amber-500" border="border-amber-100" />
          <MiniStat label="إجمالي المنتجات" value={stats.totalProducts} color="text-blue-700" bg="bg-blue-500" border="border-blue-100" />
          <MiniStat label="تصنيفات الهدايا" value={stats.categoriesCount ?? 0} color="text-[#13213c]" bg="bg-[#13213c]" border="border-[#13213c]/15" />
        </div>
      </motion.div>

      {/* 5. Charts and Activity Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-5 gap-6"
      >
        <div className="lg:col-span-3 bg-white border border-[#E8E4DF] rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <SalesChart />
        </div>
        <div className="lg:col-span-2 bg-white border border-[#E8E4DF] rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <RecentOrders orders={recentOrders} />
        </div>
      </motion.div>
    </div>
  )
}
