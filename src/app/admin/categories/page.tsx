import React from 'react'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import CategoriesClient from './categories-client'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/admin-login')
  if (session.user.role === 'CUSTOMER') redirect('/')

  let categories: any[] = []
  try {
    categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }

  return <CategoriesClient initialCategories={categories} />
}
