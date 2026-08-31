'use client'

import React from 'react'
import { StatCard } from '@/components/admin/stat-card'
import { SalesChart } from '@/components/admin/sales-chart'
import { RecentOrders } from '@/components/admin/recent-orders'
import { DollarSign, ShoppingBag, CheckCircle, Clock, XCircle, Users, Package, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

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

export default function AdminDashboardHome({ stats, recentOrders }: { stats: DashboardStats, recentOrders: any[] }) {
  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-800">صباح الخير، أحمد 👋</h1>
          <p className="text-slate-500 mt-1">إليك ملخص أداء المتجر اليوم.</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="إجمالي المبيعات"
            value={`${stats.totalSales.toLocaleString('en-US')} د.ع`}
            icon={<DollarSign className="w-5 h-5" />}
            trend="up"
            trendValue="+12.5%"
            trendDescription="مقارنة بالشهر الماضي"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="إجمالي الطلبات"
            value={stats.totalOrders.toString()}
            icon={<ShoppingBag className="w-5 h-5" />}
            trend="up"
            trendValue="+5.2%"
            trendDescription="مقارنة بالشهر الماضي"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="الطلبات المكتملة"
            value={stats.completedOrders.toString()}
            icon={<CheckCircle className="w-5 h-5" />}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="قيد التنفيذ"
            value={stats.pendingOrders.toString()}
            icon={<Clock className="w-5 h-5" />}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="الطلبات الملغاة"
            value={stats.cancelledOrders.toString()}
            icon={<XCircle className="w-5 h-5" />}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="إجمالي العملاء"
            value={stats.totalCustomers.toString()}
            icon={<Users className="w-5 h-5" />}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="إجمالي المنتجات"
            value={stats.totalProducts.toString()}
            icon={<Package className="w-5 h-5" />}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="منخفضة المخزون"
            value={stats.lowStockProducts.toString()}
            icon={<AlertTriangle className="w-5 h-5" />}
            trend="down"
            trendValue="-2"
            trendDescription="عن الأسبوع الماضي"
          />
        </motion.div>
      </motion.div>

      {/* Charts & Lists Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div className="lg:col-span-1">
          <RecentOrders orders={recentOrders} />
        </div>
      </motion.div>
    </div>
  )
}
