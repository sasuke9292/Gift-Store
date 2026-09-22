'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getStoreSettings() {
  const session = await auth()
  if (!session || session.user.role === 'CUSTOMER') {
    return null
  }

  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: 'default' }
    })
    
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          id: 'default'
        }
      })
    }
    
    return settings
  } catch (error) {
    console.error('Failed to get store settings:', error)
    return null
  }
}

export async function getPublicStoreSettings() {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: 'default' }
    })
    
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          id: 'default'
        }
      })
    }
    
    return settings
  } catch (error) {
    console.error('Failed to get public store settings:', error)
    return null
  }
}

export async function updateStoreSettings(rawData: Record<string, any>) {
  const session = await auth()
  if (!session || session.user.role === 'CUSTOMER') {
    return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
  }

  try {
    // Remove id and updatedAt if present
    const { id, updatedAt, ...data } = rawData

    // Ensure numeric types are properly converted
    if (data.freeShippingThreshold !== undefined) {
      data.freeShippingThreshold = parseFloat(data.freeShippingThreshold) || 0
    }
    if (data.shippingCostBaghdad !== undefined) {
      data.shippingCostBaghdad = parseFloat(data.shippingCostBaghdad) || 0
    }
    if (data.shippingCostProvinces !== undefined) {
      data.shippingCostProvinces = parseFloat(data.shippingCostProvinces) || 0
    }
    if (data.minOrderValue !== undefined) {
      data.minOrderValue = parseFloat(data.minOrderValue) || 0
    }
    if (data.lowStockThreshold !== undefined) {
      data.lowStockThreshold = parseInt(data.lowStockThreshold, 10) || 5
    }
    if (data.whatsappOrderEnabled !== undefined) {
      data.whatsappOrderEnabled = Boolean(data.whatsappOrderEnabled)
    }
    if (data.whatsappNumber !== undefined && typeof data.whatsappNumber === 'string') {
      let cleaned = data.whatsappNumber.replace(/\D/g, '')
      if (cleaned.startsWith('07') && cleaned.length === 11) {
        cleaned = '964' + cleaned.slice(1)
      }
      data.whatsappNumber = cleaned || '9647700000000'
    }

    const settings = await prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: data,
      create: {
        id: 'default',
        ...data
      }
    })
    
    // Invalidate caches across the store and admin
    revalidatePath('/', 'layout')
    revalidatePath('/admin', 'layout')
    revalidatePath('/cart')
    revalidatePath('/checkout')
    revalidatePath('/contact')
    revalidatePath('/about')
    revalidatePath('/gift-finder')
    
    return { success: true, data: settings }
  } catch (error) {
    console.error('Failed to update store settings:', error)
    return { success: false, error: 'حدث خطأ أثناء تحديث الإعدادات' }
  }
}
