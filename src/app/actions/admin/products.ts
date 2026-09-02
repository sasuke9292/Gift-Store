'use server'

import { auth } from '@/auth'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createProduct(data: {
  name: string
  slug: string
  description: string
  price: number
  salePrice?: number | null
  categoryId: string
  images: string[]
  isBestSeller?: boolean
  isNew?: boolean
  isActive?: boolean
}) {
    const session = await auth()
    if (!session || session.user.role === 'CUSTOMER') {
      return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
    }

  try {
    const product = await prisma.product.create({
      data: {
        ...data,
        sku: `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      }
    })
    revalidatePath('/admin/products')
    revalidatePath('/shop')
    return { success: true, data: product }
  } catch (error) {
    console.error('Error creating product:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function updateProduct(id: string, data: Partial<{
  name: string
  slug: string
  description: string
  price: number
  salePrice: number | null
  categoryId: string
  images: string[]
  isBestSeller: boolean
  isNew: boolean
  isActive: boolean
}>) {
    const session = await auth()
    if (!session || session.user.role === 'CUSTOMER') {
      return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
    }

  try {
    const product = await prisma.product.update({
      where: { id },
      data
    })
    revalidatePath('/admin/products')
    revalidatePath('/shop')
    return { success: true, data: product }
  } catch (error) {
    console.error('Error updating product:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function deleteProduct(id: string) {
    const session = await auth()
    if (!session || session.user.role === 'CUSTOMER') {
      return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
    }

  try {
    await prisma.product.delete({
      where: { id }
    })
    revalidatePath('/admin/products')
    revalidatePath('/shop')
    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function deleteProducts(ids: string[]) {
    const session = await auth()
    if (!session || session.user.role === 'CUSTOMER') {
      return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
    }

  try {
    await prisma.product.deleteMany({
      where: { id: { in: ids } }
    })
    revalidatePath('/admin/products')
    revalidatePath('/shop')
    return { success: true }
  } catch (error) {
    console.error('Error deleting products:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
