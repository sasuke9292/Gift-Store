'use client'

import React from 'react'
import { StatCard } from '@/components/admin/stat-card'
import { SalesChart } from '@/components/admin/sales-chart'
import { RecentOrders } from '@/components/admin/recent-orders'
import { DollarSign, ShoppingBag, CheckCircle, Clock, XCircle, Users, Package, AlertTriangle, ArrowUpRight, TrendingUp, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Order } from '@prisma/client'
import { Button } from '@/components/ui/button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
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

export default function AdminDashboardHome({ stats, recentOrders, userName }: { stats: DashboardStats, recentOrders: Order[], userName?: string | null }) {
  return (
    <div className="space-y-10 pb-12">
      {/* Header section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100/50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100/50 rounded-xl text-amber-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight drop-shadow-sm">
              {userName ? `أهلاً، ${userName} 👋` : 'أهلاً بك 👋'}
            </h1>
          </div>
          <p className="text-slate-500 font-medium text-lg ms-1">نظرة عامة على أداء متجرك ومؤشرات النمو الأساسية.</p>
        </div>
        <div className="flex gap-3 relative z-10">
          <Button className="bg-[#050B14] hover:bg-[#0a1526] text-white rounded-2xl h-14 px-8 shadow-[0_10px_30px_rgba(5,11,20,0.2)] hover:shadow-[0_15px_40px_rgba(5,11,20,0.3)] hover:-translate-y-0.5 font-bold transition-all text-base border border-slate-800">
            <TrendingUp className="w-5 h-5 ms-2 text-amber-400" />
            تحميل تقرير الأداء
          </Button>
        </div>
      </motion.div>

      {/* Main KPIs */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* KPI 1 - Total Sales */}
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] border border-slate-100/50 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:shadow-[0_15px_50px_rgba(0,0,0,0.06)] transition-all">
          <div className="absolute -top-10 -end-10 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-amber-600/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute top-6 end-6 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-500 transform rotate-12">
            <DollarSign className="w-24 h-24" />
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-100 to-yellow-50 border border-amber-200/50 flex items-center justify-center shadow-inner group-hover:shadow-[0_5px_15px_rgba(251,191,36,0.2)] transition-shadow">
                <DollarSign className="w-7 h-7 text-amber-600" />
              </div>
              <span className="flex items-center text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm">
                <ArrowUpRight className="w-4 h-4 me-1" />
                12.5%
              </span>
            </div>
            <div>
              <p className="text-slate-500 font-bold mb-2 text-sm uppercase tracking-wide">إجمالي المبيعات</p>
              <h3 className="text-4xl font-black text-slate-800 tracking-tight drop-shadow-sm">{stats.totalSales.toLocaleString('en-US')} <span className="text-xl text-slate-400 font-bold">د.ع</span></h3>
            </div>
          </div>
        </motion.div>

        {/* KPI 2 - Orders */}
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] border border-slate-100/50 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:shadow-[0_15px_50px_rgba(0,0,0,0.06)] transition-all">
          <div className="absolute -top-10 -end-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-blue-600/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute top-6 end-6 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-500 transform -rotate-12">
            <ShoppingBag className="w-24 h-24" />
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-100 to-sky-50 border border-blue-200/50 flex items-center justify-center shadow-inner group-hover:shadow-[0_5px_15px_rgba(59,130,246,0.2)] transition-shadow">
                <ShoppingBag className="w-7 h-7 text-blue-600" />
              </div>
              <span className="flex items-center text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm">
                <ArrowUpRight className="w-4 h-4 me-1" />
                5.2%
              </span>
            </div>
            <div>
              <p className="text-slate-500 font-bold mb-2 text-sm uppercase tracking-wide">إجمالي الطلبات</p>
              <h3 className="text-4xl font-black text-slate-800 tracking-tight drop-shadow-sm">{stats.totalOrders}</h3>
            </div>
          </div>
        </motion.div>

        {/* KPI 3 - Low Stock */}
        <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] border border-slate-100/50 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group hover:shadow-[0_15px_50px_rgba(0,0,0,0.06)] transition-all">
          <div className="absolute -top-10 -end-10 w-40 h-40 bg-gradient-to-br from-rose-400/20 to-rose-600/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute top-6 end-6 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-500 transform rotate-12">
            <AlertTriangle className="w-24 h-24" />
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-100 to-red-50 border border-rose-200/50 flex items-center justify-center shadow-inner group-hover:shadow-[0_5px_15px_rgba(244,63,94,0.2)] transition-shadow">
                <AlertTriangle className="w-7 h-7 text-rose-600" />
              </div>
            </div>
            <div>
              <p className="text-slate-500 font-bold mb-2 text-sm uppercase tracking-wide">منتجات منخفضة المخزون</p>
              <h3 className="text-4xl font-black text-rose-600 tracking-tight drop-shadow-sm">{stats.lowStockProducts}</h3>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Secondary Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100/50 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow group">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-bold mb-1">مكتملة</p>
            <p className="text-2xl font-black text-slate-800">{stats.completedOrders}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100/50 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow group">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-bold mb-1">قيد التنفيذ</p>
            <p className="text-2xl font-black text-slate-800">{stats.pendingOrders}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100/50 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow group">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <XCircle className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-bold mb-1">ملغاة</p>
            <p className="text-2xl font-black text-slate-800">{stats.cancelledOrders}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100/50 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow group">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-bold mb-1">المنتجات</p>
            <p className="text-2xl font-black text-slate-800">{stats.totalProducts}</p>
          </div>
        </div>
      </motion.div>

      {/* Charts & Lists Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100/50 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
          <SalesChart />
        </div>
        <div className="lg:col-span-1 bg-white rounded-[2rem] border border-slate-100/50 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
          <RecentOrders orders={recentOrders} />
        </div>
      </motion.div>
    </div>
  )
}
