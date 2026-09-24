import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import OrdersClient from './orders-client'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/admin-login')
  if (session.user.role === 'CUSTOMER') redirect('/')

  let formattedOrders: any[] = []
  try {
    const orders = await prisma.order.findMany({
      where: {
        source: 'WHATSAPP'
      },
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format orders for the client component
    formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: order.customerName,
      phone: order.customerPhone,
      source: order.source || 'WHATSAPP',
      province: order.province || '',
      area: order.area || '',
      deliveryType: order.deliveryType || 'DELIVERY',
      date: new Date(order.createdAt).toLocaleDateString('ar-IQ'),
      products: order.items.length,
      total: order.total,
      payment: order.paymentMethod,
      status: order.status,
      shipping: order.province ? `${order.province} - ${order.area || ''}` : 'العنوان', 
    }))
  } catch (error) {
    console.error('Failed to fetch admin orders:', error)
  }

  return <OrdersClient initialOrders={formattedOrders} />
}
