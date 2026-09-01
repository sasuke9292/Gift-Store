'use server'

import { signIn, signOut, auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'

export async function loginAction(formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    })
    const session = await auth()
    return { success: true, role: session?.user?.role }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'بيانات الدخول غير صحيحة.' }
        default:
          return { error: 'حدث خطأ غير متوقع.' }
      }
    }
    throw error
  }
}

export async function registerAction(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!name || !email || !password) {
      return { error: 'جميع الحقول مطلوبة.' }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: 'هذا البريد الإلكتروني مسجل مسبقاً.' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Registration error:', error)
    return { error: 'حدث خطأ أثناء إنشاء الحساب.' }
  }
}

export async function logoutAction() {
  await signOut({ redirect: true, redirectTo: '/' })
}
