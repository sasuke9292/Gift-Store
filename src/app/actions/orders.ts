'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

interface CheckoutItem {
  id: string
  quantity: number
  price: number
  name: string
}

interface CheckoutData {
  items: CheckoutItem[]
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  totalAmount: number
}

export async function createOrderAction(data: CheckoutData) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!data.items || data.items.length === 0) {
      return { error: 'السلة فارغة.' }
    }

    // Verify all products exist
    const productIds = data.items.map(item => item.id)
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true }
    })

    if (existingProducts.length !== productIds.length) {
      return { error: 'عذراً، بعض المنتجات في سلتك لم تعد متوفرة في قاعدة البيانات (ربما تم حذفها). يرجى إفراغ السلة والمحاولة مجدداً.' }
    }

    const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } }).catch(() => null)
    const freeThreshold = settings?.freeShippingThreshold ?? 100000
    const shippingFee = settings?.shippingCostBaghdad ?? 5000

    const calculatedSubtotal = data.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const calculatedShipping = calculatedSubtotal >= freeThreshold ? 0 : shippingFee
    const calculatedTotal = calculatedSubtotal + calculatedShipping
    
    // Create the order
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Math.floor(Date.now() / 1000)}`,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        paymentMethod: 'COD',
        subtotal: calculatedSubtotal,
        shippingCost: calculatedShipping,
        discount: 0,
        total: calculatedTotal,
        shippingAddress: { address: data.customerAddress },
        status: 'PENDING',
        userId: userId || null, // Guest checkout if no user
        items: {
          create: data.items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            productName: item.name,
          }))
        }
      },
      include: {
        items: true
      }
    })

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Order creation error:', error)
    return { error: 'حدث خطأ أثناء إنشاء الطلب.' }
  }
}
