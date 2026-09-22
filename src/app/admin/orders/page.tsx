import { prisma } from '@/lib/prisma'
import OrdersClient from './orders-client'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Format orders for the client component
  const formattedOrders = orders.map((order) => ({
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

  return <OrdersClient initialOrders={formattedOrders} />
}
