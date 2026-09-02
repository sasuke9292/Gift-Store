'use server'

import { auth } from '@/auth'

import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

export async function getStaffUsers() {
    const session = await auth()
    if (!session || session.user.role === 'CUSTOMER') {
      return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
    }

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
    const session = await auth()
    if (!session || session.user.role === 'CUSTOMER') {
      return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
    }

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
    const session = await auth()
    if (!session || session.user.role === 'CUSTOMER') {
      return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
    }

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
    const session = await auth()
    if (!session || session.user.role === 'CUSTOMER') {
      return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
    }

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
    const session = await auth()
    if (!session || session.user.role === 'CUSTOMER') {
      return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
    }

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

export async function updateStaffUser(userId: string, data: { name: string, email: string, role: Role, password?: string }) {
    const session = await auth()
    if (!session || session.user.role === 'CUSTOMER') {
      return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
    }

  try {
    const updateData: any = {
      name: data.name,
      email: data.email,
      role: data.role
    }

    if (data.password && data.password.trim() !== '') {
      updateData.password = await bcrypt.hash(data.password, 10)
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    })

    return { success: true, data: updatedUser }
  } catch (error) {
    console.error('Error updating staff user:', error)
    return { success: false, error: 'حدث خطأ أثناء تعديل بيانات المستخدم' }
  }
}

export async function deleteStaffUser(userId: string) {
    const session = await auth()
    if (!session || session.user.role === 'CUSTOMER') {
      return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
    }

  try {
    // Check if the user is the only SUPER_ADMIN
    const userToDelete = await prisma.user.findUnique({ where: { id: userId } })
    if (userToDelete?.role === 'SUPER_ADMIN') {
      const superAdminsCount = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } })
      if (superAdminsCount <= 1) {
        return { success: false, error: 'لا يمكن حذف المدير العام الوحيد في النظام' }
      }
    }

    await prisma.user.delete({
      where: { id: userId }
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting staff user:', error)
    return { success: false, error: 'حدث خطأ أثناء حذف المستخدم' }
  }
}
