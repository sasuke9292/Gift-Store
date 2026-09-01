'use server'

import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

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

export async function createStaffUser(data: { name: string, email: string, password?: string, role: Role }) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return { success: false, error: 'البريد الإلكتروني مسجل مسبقاً' }
    }

    const passwordToHash = data.password || '12345678'
    const hashedPassword = await bcrypt.hash(passwordToHash, 10)

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role
      }
    })

    return { success: true, data: newUser }
  } catch (error) {
    console.error('Error creating staff user:', error)
    return { success: false, error: 'حدث خطأ أثناء إنشاء المستخدم الجديد' }
  }
}

export async function changePassword(userId: string, newPassword: string) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error changing password:', error)
    return { success: false, error: 'حدث خطأ أثناء تغيير كلمة المرور' }
  }
}
