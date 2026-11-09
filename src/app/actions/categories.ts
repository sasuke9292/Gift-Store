'use server'

import { prisma } from '@/lib/prisma'

export async function getCategories(onlyActive = true) {
  try {
    const categories = await prisma.category.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      orderBy: {
        createdAt: 'asc',
      },
    })
    return categories
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}
