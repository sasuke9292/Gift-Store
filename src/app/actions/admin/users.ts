'use server'

import { auth } from '@/auth'

import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN']
const STAFF_VIEW_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER']

export async function getStaffUsers() {
  const session = await auth()
  if (!session?.user || !STAFF_VIEW_ROLES.includes(session.user.role)) {
    return { success: false, error: 'غير مصرح لك بعرض بيانات الموظفين' }
  }

  try {
    const users = await prisma.user.findMany({
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
  if (!session?.user || !ADMIN_ROLES.includes(session.user.role)) {
    return { success: false, error: 'تعديل الصلاحيات مقتصر على مدراء النظام فقط' }
  }

  try {
    const targetUser = await prisma.user.findUnique({ where: { id: userId } })
    if (targetUser?.role === 'SUPER_ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'لا يمكن لغير المدير العام تعديل صلاحيات مدير عام آخر' }
    }

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
  if (!session?.user) {
    return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
  }

  // User can only update their own profile unless they are an admin
  if (session.user.id !== userId && !ADMIN_ROLES.includes(session.user.role)) {
    return { success: false, error: 'غير مصرح لك بتعديل بيانات مستخدم آخر' }
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
  if (!session?.user || !ADMIN_ROLES.includes(session.user.role)) {
    return { success: false, error: 'إضافة موظفين جدد مقتصرة على مدراء النظام فقط' }
  }

  // Only SUPER_ADMIN can create another SUPER_ADMIN
  if (data.role === 'SUPER_ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    return { success: false, error: 'لا يمكن لغير المدير العام إنشاء حساب مدير عام آخر' }
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
  if (!session?.user) {
    return { success: false, error: 'غير مصرح لك بالقيام بهذا الإجراء' }
  }

  // User can only change their own password unless they are an admin
  if (session.user.id !== userId && !ADMIN_ROLES.includes(session.user.role)) {
    return { success: false, error: 'غير مصرح لك بتغيير كلمة مرور مستخدم آخر' }
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
  if (!session?.user || !ADMIN_ROLES.includes(session.user.role)) {
    return { success: false, error: 'تعديل بيانات الموظفين مقتصر على مدراء النظام' }
  }

  try {
    const targetUser = await prisma.user.findUnique({ where: { id: userId } })
    if (targetUser?.role === 'SUPER_ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'لا يمكن لغير المدير العام تعديل بيانات المدير العام' }
    }

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
  if (!session?.user || !ADMIN_ROLES.includes(session.user.role)) {
    return { success: false, error: 'حذف الموظفين مقتصر على مدراء النظام' }
  }

  // Prevent self-deletion
  if (session.user.id === userId) {
    return { success: false, error: 'لا يمكنك حذف حسابك الخاص أثناء تسجيل الدخول' }
  }

  try {
    const userToDelete = await prisma.user.findUnique({ where: { id: userId } })
    if (!userToDelete) {
      return { success: false, error: 'المستخدم غير موجود' }
    }

    if (userToDelete.role === 'SUPER_ADMIN') {
      const superAdminsCount = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } })
      if (superAdminsCount <= 1) {
        return { success: false, error: 'لا يمكن حذف المدير العام الوحيد في النظام' }
      }
      if (session.user.role !== 'SUPER_ADMIN') {
        return { success: false, error: 'لا يمكن لغير المدير العام حذف حساب مدير عام' }
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
