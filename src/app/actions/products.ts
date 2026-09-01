'use server'

import { prisma } from '@/lib/prisma'

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return products
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return []
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findFirst({
      where: { id, isActive: true },
      include: {
        category: true,
      },
    })
    return product
  } catch (error) {
    console.error("Failed to fetch product:", error)
    return null
  }
}

export async function getTopProducts(limit = 4) {
  try {
    const products = await prisma.product.findMany({
      where: { isBestSeller: true, isActive: true },
      take: limit,
      include: {
        category: true,
      },
    })
    return products
  } catch (error) {
    console.error("Failed to fetch top products:", error)
    return []
  }
}
