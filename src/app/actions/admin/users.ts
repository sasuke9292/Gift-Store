'use server'

import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

export async function getStaffUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          not: 'CUSTOMER'
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return { success: true, data: users }
  } catch (error) {
    console.error('Error fetching staff users:', error)
    return { success: false, error: 'فشل في جلب المستخدمين' }
  }
}

export async function updateUserRole(userId: string, role: Role) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role }
    })
    return { success: true, data: updatedUser }
  } catch (error) {
    console.error('Error updating user role:', error)
    return { success: false, error: 'حدث خطأ أثناء تحديث الصلاحية' }
  }
}

export async function updateProfile(userId: string, data: { name?: string, email?: string }) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data
    })
    return { success: true, data: updatedUser }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { success: false, error: 'حدث خطأ أثناء تحديث الملف الشخصي' }
  }
}
