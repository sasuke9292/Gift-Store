'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getStoreSettings() {
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

export async function updateStoreSettings(data: any) {
  try {
    const settings = await prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: data,
      create: {
        id: 'default',
        ...data
      }
    })
    
    revalidatePath('/')
    revalidatePath('/admin')
    
    return { success: true, data: settings }
  } catch (error) {
    console.error('Failed to update store settings:', error)
    return { success: false, error: 'حدث خطأ أثناء تحديث الإعدادات' }
  }
}
