'use server'

import { auth } from '@/auth'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { OrderStatus, PaymentStatus } from '@prisma/client'

export async function updateOrderStatus(id: string, status: OrderStatus) {
    const session = await auth()
    if (!session || session.user.role === 'CUSTOMER') {
      return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
    }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    })
    revalidatePath('/admin/orders')
    revalidatePath('/admin')
    return { success: true, data: order }
  } catch (error) {
    console.error('Error updating order status:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
    const session = await auth()
    if (!session || session.user.role === 'CUSTOMER') {
      return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
    }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { paymentStatus }
    })
    revalidatePath('/admin/orders')
    return { success: true, data: order }
  } catch (error) {
    console.error('Error updating payment status:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function deleteOrder(id: string) {
    const session = await auth()
    if (!session || session.user.role === 'CUSTOMER') {
      return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
    }

  try {
    await prisma.order.delete({
      where: { id }
    })
    revalidatePath('/admin/orders')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error deleting order:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
