import { prisma } from '@/lib/prisma'
import AdminDashboardHome from './dashboard-client'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [
    totalOrders,
    completedOrders,
    pendingOrders,
    cancelledOrders,
    totalCustomers,
    totalProducts,
    lowStockProducts,
    ordersData,
    recentOrders
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'DELIVERED' } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'CANCELLED' } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count(),
    prisma.inventory.count({ where: { stock: { lt: 5 } } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: 'CANCELLED' } }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
  ])

  const stats = {
    totalSales: ordersData._sum.total || 0,
    totalOrders,
    completedOrders,
    pendingOrders,
    cancelledOrders,
    totalCustomers,
    totalProducts,
    lowStockProducts
  }

  return <AdminDashboardHome stats={stats} recentOrders={recentOrders} />
}
