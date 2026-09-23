import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import AdminDashboardHome from './dashboard-client'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/admin-login')
  }

  if (session.user.role === 'CUSTOMER') {
    redirect('/')
  }

  let stats = {
    totalSales: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    totalProducts: 0,
    lowStockProducts: 0
  }
  let recentOrders: any[] = []

  try {
    const [
      totalOrders,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      totalProducts,
      lowStockProducts,
      ordersData,
      fetchedRecentOrders
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'CANCELLED' } }),
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

    stats = {
      totalSales: ordersData._sum.total || 0,
      totalOrders,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      totalProducts,
      lowStockProducts
    }
    recentOrders = fetchedRecentOrders
  } catch (error) {
    console.error('Failed to load admin dashboard data:', error)
  }

  return <AdminDashboardHome stats={stats} recentOrders={recentOrders} userName={session?.user?.name} />
}

