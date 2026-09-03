'use client'

import React from 'react'
import { SalesChart } from '@/components/admin/sales-chart'
import { RecentOrders } from '@/components/admin/recent-orders'
import { DollarSign, ShoppingBag, CheckCircle, Clock, XCircle, Package, AlertTriangle, ArrowUpRight, ArrowDownRight, TrendingUp, Sparkles, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { Order } from '@prisma/client'
import Link from 'next/link'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
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

function KpiCard({ 
  title, label, value, unit, icon: Icon, color, badge, trend 
}: { 
  title: string, label: string, value: string | number, unit?: string, 
  icon: any, color: string, badge?: string, trend?: 'up' | 'down' 
}) {
  return (
    <motion.div variants={itemVariants} className="relative bg-[#0A1628] border border-white/[0.05] rounded-2xl p-5 overflow-hidden group hover:border-white/[0.1] transition-all duration-300">
      {/* Glow blob */}
      <div className={`absolute -top-8 -end-8 w-32 h-32 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 ${color}`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${color.replace('bg-', 'bg-').replace('/20', '/10')} border-current/10`}
            style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.12)' }}
          >
            <Icon className="w-5 h-5" style={{ color: 'inherit' }} />
          </div>
          {badge && (
            <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-lg ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {badge}
            </span>
          )}
        </div>
        <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-1.5">{label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-white/90 tracking-tight">{value}</span>
          {unit && <span className="text-sm text-white/30 font-bold">{unit}</span>}
        </div>
      </div>
    </motion.div>
  )
}

function MiniStat({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="bg-[#0A1628] border border-white/[0.05] rounded-xl p-4 flex items-center gap-3 hover:border-white/[0.09] transition-colors">
      <div className={`w-2 h-8 rounded-full ${color} opacity-60`} />
      <div>
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-lg font-black text-white/80">{value}</p>
      </div>
    </div>
  )
}

export default function AdminDashboardHome({ stats, recentOrders, userName }: { stats: DashboardStats, recentOrders: Order[], userName?: string | null }) {
  return (
    <div className="space-y-5 pb-10">
      
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0A1628] border border-white/[0.05] rounded-2xl px-6 py-5 relative overflow-hidden"
      >
        <div className="absolute top-0 end-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 start-0 w-32 h-32 bg-amber-600/3 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <h1 className="text-xl font-black text-white/90 tracking-tight">
              {userName ? `أهلاً، ${userName} 👋` : 'أهلاً بك 👋'}
            </h1>
          </div>
          <p className="text-sm text-white/35 ms-9.5">نظرة عامة على أداء متجرك اليوم.</p>
        </div>
        
        <div className="relative flex gap-2">
          <Link 
            href="/admin/orders"
            className="flex items-center gap-2 h-9 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#030810] font-bold text-sm transition-all shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_25px_rgba(245,158,11,0.45)] hover:-translate-y-0.5"
          >
            <ShoppingBag className="w-4 h-4" />
            الطلبات
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 h-9 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white/60 hover:text-white font-bold text-sm transition-all border border-white/[0.07] hover:border-white/[0.12]"
          >
            <Package className="w-4 h-4" />
            المنتجات
          </Link>
        </div>
      </motion.div>

      {/* Main KPIs */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-[#0A1628] border border-white/[0.05] rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/20 transition-all duration-300">
          <div className="absolute -top-6 -end-6 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl group-hover:opacity-150 transition-opacity" />
          <div className="relative">
            <div className="flex items-start justify-between mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-amber-400" />
              </div>
              <span className="flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ArrowUpRight className="w-3 h-3" />12.5%
              </span>
            </div>
            <p className="text-[10px] font-black text-white/25 uppercase tracking-widest mb-1.5">إجمالي المبيعات</p>
            <p className="text-2xl font-black text-amber-400 tracking-tight">
              {stats.totalSales.toLocaleString('en-US')} <span className="text-base text-white/30">د.ع</span>
            </p>
          </div>
        </div>

        <div className="bg-[#0A1628] border border-white/[0.05] rounded-2xl p-5 relative overflow-hidden group hover:border-white/[0.1] transition-all duration-300">
          <div className="absolute -top-6 -end-6 w-28 h-28 bg-blue-500/8 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-start justify-between mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-400" />
              </div>
              <span className="flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ArrowUpRight className="w-3 h-3" />5.2%
              </span>
            </div>
            <p className="text-[10px] font-black text-white/25 uppercase tracking-widest mb-1.5">إجمالي الطلبات</p>
            <p className="text-2xl font-black text-white/85 tracking-tight">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="bg-[#0A1628] border border-white/[0.05] rounded-2xl p-5 relative overflow-hidden group hover:border-rose-500/20 transition-all duration-300">
          <div className="absolute -top-6 -end-6 w-28 h-28 bg-rose-500/8 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-start justify-between mb-5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/15 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
            </div>
            <p className="text-[10px] font-black text-white/25 uppercase tracking-widest mb-1.5">منخفض المخزون</p>
            <p className={`text-2xl font-black tracking-tight ${stats.lowStockProducts > 0 ? 'text-rose-400' : 'text-white/85'}`}>
              {stats.lowStockProducts}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Secondary Stats — horizontal mini bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        <MiniStat label="مكتملة" value={stats.completedOrders} color="bg-emerald-400" />
        <MiniStat label="قيد التنفيذ" value={stats.pendingOrders} color="bg-amber-400" />
        <MiniStat label="ملغاة" value={stats.cancelledOrders} color="bg-rose-400" />
        <MiniStat label="المنتجات" value={stats.totalProducts} color="bg-blue-400" />
      </motion.div>

      {/* Charts Row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-5 gap-4"
      >
        <div className="lg:col-span-3 bg-[#0A1628] border border-white/[0.05] rounded-2xl p-5">
          <SalesChart />
        </div>
        <div className="lg:col-span-2 bg-[#0A1628] border border-white/[0.05] rounded-2xl p-5">
          <RecentOrders orders={recentOrders} />
        </div>
      </motion.div>
    </div>
  )
}
