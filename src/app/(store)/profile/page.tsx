import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import ProfileClient from './profile-client'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'حسابي | گفتي بلس',
  description: 'إدارة حسابك، طلباتك، ومفضلاتك',
}

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/login')
  }

  if (session.user.role !== 'CUSTOMER') {
    redirect('/admin')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      customerProfile: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  })

  if (!user) {
    redirect('/auth/login')
  }

  // Format orders for the client
  const formattedOrders = user.orders.map(order => ({
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    total: order.total,
    date: order.createdAt.toISOString()
  }))

  return <ProfileClient user={{
    id: user.id,
    name: user.name || 'مستخدم',
    email: user.email || '',
    phone: user.customerProfile?.phone || ''
  }} orders={formattedOrders} />
}
