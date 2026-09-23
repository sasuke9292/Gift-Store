'use client'

import React from 'react'
import { SalesChart } from '@/components/admin/sales-chart'
import { RecentOrders } from '@/components/admin/recent-orders'
import { DollarSign, ShoppingBag, CheckCircle, Clock, XCircle, Package, AlertTriangle, ArrowUpRight, ArrowDownRight, Sparkles, ArrowLeft, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { Order } from '@prisma/client'
import Link from 'next/link'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
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
}

function MiniStat({ label, value, color, bg, border }: { label: string, value: number, color: string, bg: string, border: string }) {
  return (
    <div className={`bg-white border ${border} rounded-2xl p-4 flex items-center gap-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200`}>
      <div className={`w-3 h-10 rounded-full ${bg}`} />
      <div>
        <p className="text-xs font-bold text-[#A8A29E] mb-0.5">{label}</p>
        <p className={`text-xl font-black ${color}`}>{value}</p>
      </div>
    </div>
  )
}

export default function AdminDashboardHome({ stats, recentOrders, userName }: { stats: DashboardStats, recentOrders: Order[], userName?: string | null }) {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E8E4DF] rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
      >
        <div className="absolute top-0 end-0 w-80 h-80 bg-[#13213c]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 start-0 w-60 h-60 bg-[#13213c]/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm"
              style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-black text-[#1C1917] tracking-tight">
              {userName ? `مرحباً، ${userName} 👋` : 'مرحباً بك في لوحة الإدارة 👋'}
            </h1>
          </div>
          <p className="text-sm text-[#78716C] ms-10.5">
            إليك نظرة شاملة وفورية على حركة المتجر ومؤشرات الأداء لهذا اليوم.
          </p>
        </div>
        
        <div className="relative z-10 flex flex-wrap gap-2.5">
          <Link 
            href="/admin/orders"
            className="flex items-center gap-2 h-11 px-5 rounded-xl bg-white border border-[#E8E4DF] text-[#1C1917] hover:bg-[#FAFAF8] font-bold text-sm transition-all hover:border-[#13213c]/40 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-[#13213c]" />
            إدارة الطلبات
          </Link>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 h-11 px-5 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(19, 33, 60,0.35)]"
            style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
          >
            <Plus className="w-4 h-4 text-white" />
            إضافة منتج جديد
          </Link>
        </div>
      </motion.div>

      {/* Main KPIs */}
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
                <ArrowUpRight className="w-3 h-3" />+12.5%
              </span>
            </div>
            <p className="text-xs font-bold text-[#A8A29E] uppercase tracking-wider mb-1">إجمالي المبيعات المحققة</p>
            <p className="text-3xl font-black text-[#1C1917] tracking-tight">
              {stats.totalSales.toLocaleString('en-US')}{' '}
              <span className="text-lg font-bold text-[#13213c]">د.ع</span>
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
                <ArrowUpRight className="w-3 h-3" />نشط
              </span>
            </div>
            <p className="text-xs font-bold text-[#A8A29E] uppercase tracking-wider mb-1">إجمالي عدد الطلبات</p>
            <p className="text-3xl font-black text-[#1C1917] tracking-tight">
              {stats.totalOrders}{' '}
              <span className="text-sm font-normal text-[#78716C]">طلب</span>
            </p>
          </div>
        </motion.div>

        {/* Low Stock Products */}
        <motion.div variants={itemVariants} className="bg-white border border-[#E8E4DF] rounded-3xl p-6 relative overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-amber-300 transition-all duration-300 group">
          <div className="absolute top-0 end-0 w-32 h-32 bg-amber-500/8 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shadow-sm">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${stats.lowStockProducts > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                {stats.lowStockProducts > 0 ? 'تنبيه مخزون' : 'مستقر'}
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

      {/* Secondary Mini Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <MiniStat label="طلبات مكتملة" value={stats.completedOrders} color="text-emerald-700" bg="bg-emerald-500" border="border-emerald-100" />
        <MiniStat label="قيد المراجعة والتجهيز" value={stats.pendingOrders} color="text-amber-700" bg="bg-amber-500" border="border-amber-100" />
        <MiniStat label="طلبات ملغاة" value={stats.cancelledOrders} color="text-rose-700" bg="bg-rose-500" border="border-rose-100" />
        <MiniStat label="إجمالي المنتجات المعروضة" value={stats.totalProducts} color="text-blue-700" bg="bg-blue-500" border="border-blue-100" />
      </motion.div>

      {/* Charts and Activity Grid */}
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
