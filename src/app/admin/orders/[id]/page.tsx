import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import OrderDetailsClient from './order-details-client'

export const dynamic = 'force-dynamic'

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: {
            select: {
              images: true,
              categoryId: true,
            }
          }
        }
      },
      user: {
        select: {
          email: true,
          name: true,
          image: true
        }
      }
    }
  })

  if (!order) {
    notFound()
  }

  // Parse shipping address if it's stored as JSON
  let parsedAddress = null
  try {
    if (order.shippingAddress) {
      parsedAddress = typeof order.shippingAddress === 'string' 
        ? JSON.parse(order.shippingAddress) 
        : order.shippingAddress
    }
  } catch (e) {
    console.error('Failed to parse shipping address', e)
  }

  const formattedOrder = {
    ...order,
    shippingAddress: parsedAddress
  }

  return <OrderDetailsClient initialOrder={formattedOrder as any} />
}
