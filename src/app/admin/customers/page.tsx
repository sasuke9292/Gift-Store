import { prisma } from '@/lib/prisma'
import CustomersClient from './customers-client'

export const dynamic = 'force-dynamic'

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    where: {
      role: 'CUSTOMER'
    },
    include: {
      orders: {
        select: {
          id: true,
          total: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Format data for the client component
  const formattedCustomers = users.map(user => ({
    id: user.id,
    name: user.name || 'عميل غير معروف',
    email: user.email || 'غير متوفر',
    joinedAt: new Date(user.createdAt).toLocaleDateString('ar-IQ'),
    ordersCount: user.orders.length,
    totalSpent: user.orders.reduce((acc, order) => acc + order.total, 0),
    status: 'نشط' // Assume active for now
  }))

  return <CustomersClient initialCustomers={formattedCustomers} />
}
