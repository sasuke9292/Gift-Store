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

export async function searchProducts(query: string) {
  if (!query || query.trim().length < 2) return []
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query.trim(), mode: 'insensitive' } },
          { description: { contains: query.trim(), mode: 'insensitive' } },
          { category: { name: { contains: query.trim(), mode: 'insensitive' } } },
        ],
      },
      take: 6,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      salePrice: p.salePrice,
      images: Array.isArray(p.images) ? (p.images as string[]) : [],
      category: p.category ? { name: p.category.name, slug: p.category.slug } : null,
    }))
  } catch (error) {
    console.error("Failed to search products:", error)
    return []
  }
}

