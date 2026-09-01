import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'جميع الحقول مطلوبة' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ message: 'البريد الإلكتروني مسجل مسبقاً' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    })

    // Create a customer profile automatically
    await prisma.customer.create({
      data: {
        userId: user.id,
      }
    })

    return NextResponse.json({ message: 'تم إنشاء الحساب بنجاح', userId: user.id }, { status: 201 })
  } catch (error) {
    console.error('Registration Error:', error)
    return NextResponse.json({ message: 'حدث خطأ غير متوقع' }, { status: 500 })
  }
}
