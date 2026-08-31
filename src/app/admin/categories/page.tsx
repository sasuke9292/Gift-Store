import React from 'react'
import { prisma } from '@/lib/prisma'
import CategoriesClient from './categories-client'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return <CategoriesClient initialCategories={categories} />
}
