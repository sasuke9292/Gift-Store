'use client'

import React from 'react'
import { StatCard } from '@/components/admin/stat-card'
import { SalesChart } from '@/components/admin/sales-chart'
import { RecentOrders } from '@/components/admin/recent-orders'
import { DollarSign, ShoppingBag, CheckCircle, Clock, XCircle, Users, Package, AlertTriangle, ArrowUpRight, TrendingUp } from 'lucide-react'
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
  totalCustomers: number
  totalProducts: number
  lowStockProducts: number
}

export default function AdminDashboardHome({ stats, recentOrders }: { stats: DashboardStats, recentOrders: Order[] }) {
  return (
    <div className="space-y-8 pb-12">
      {/* Header section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
      >
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">صباح الخير، أحمد 👋</h1>
          <p className="text-slate-500 mt-2 font-medium">نظرة عامة على أداء متجرك ومؤشرات النمو الأساسية.</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-6 shadow-lg shadow-indigo-600/20 font-bold transition-all">
            <TrendingUp className="w-5 h-5 ms-2" />
            تحميل تقرير الأداء
          </Button>
        </div>
      </motion.div>

      {/* Main KPIs */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* KPI 1 */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 end-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <DollarSign className="w-24 h-24 text-indigo-600" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="flex items-center text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg text-sm font-bold">
                <ArrowUpRight className="w-3.5 h-3.5 me-1" />
                12.5%
              </span>
            </div>
            <div>
              <p className="text-slate-500 font-semibold mb-1 text-sm">إجمالي المبيعات</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stats.totalSales.toLocaleString('en-US')} <span className="text-lg text-slate-400 font-bold">د.ع</span></h3>
            </div>
          </div>
        </motion.div>

        {/* KPI 2 */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 end-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-24 h-24 text-sky-600" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-sky-600" />
              </div>
              <span className="flex items-center text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg text-sm font-bold">
                <ArrowUpRight className="w-3.5 h-3.5 me-1" />
                5.2%
              </span>
            </div>
            <div>
              <p className="text-slate-500 font-semibold mb-1 text-sm">إجمالي الطلبات</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stats.totalOrders}</h3>
            </div>
          </div>
        </motion.div>

        {/* KPI 3 */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 end-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <Users className="w-24 h-24 text-purple-600" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div>
              <p className="text-slate-500 font-semibold mb-1 text-sm">إجمالي العملاء</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stats.totalCustomers}</h3>
            </div>
          </div>
        </motion.div>

        {/* KPI 4 */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 end-0 p-6 opacity-5 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-24 h-24 text-rose-600" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <div>
              <p className="text-slate-500 font-semibold mb-1 text-sm">منتجات منخفضة المخزون</p>
              <h3 className="text-3xl font-black text-rose-600 tracking-tight">{stats.lowStockProducts}</h3>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Secondary Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold mb-0.5">مكتملة</p>
            <p className="text-xl font-black text-slate-800">{stats.completedOrders}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold mb-0.5">قيد التنفيذ</p>
            <p className="text-xl font-black text-slate-800">{stats.pendingOrders}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold mb-0.5">ملغاة</p>
            <p className="text-xl font-black text-slate-800">{stats.cancelledOrders}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold mb-0.5">المنتجات</p>
            <p className="text-xl font-black text-slate-800">{stats.totalProducts}</p>
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
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <SalesChart />
        </div>
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <RecentOrders orders={recentOrders} />
        </div>
      </motion.div>
    </div>
  )
}
