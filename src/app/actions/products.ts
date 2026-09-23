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

function getArabicSearchVariants(term: string): string[] {
  const clean = term.trim()
  if (!clean) return []
  const variants = new Set<string>()
  variants.add(clean)

  // Standardize alifs: أ, إ, آ -> ا
  const normAlif = clean.replace(/[أإآ]/g, 'ا')
  variants.add(normAlif)

  // Standardize taa marboota: ة -> ه and ه -> ة
  const normTaa = clean.replace(/ة/g, 'ه')
  const normHaa = clean.replace(/ه/g, 'ة')
  variants.add(normTaa)
  variants.add(normHaa)

  // Standardize yaa: ى -> ي and ي -> ى
  const normYaa = clean.replace(/ى/g, 'ي')
  const normAlifM = clean.replace(/ي/g, 'ى')
  variants.add(normYaa)
  variants.add(normAlifM)

  // Combined normalization
  const fullyNormalized = clean
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F\u0670]/g, '')
  variants.add(fullyNormalized)

  return Array.from(variants).filter(v => v.length > 0)
}

export async function searchProducts(query: string) {
  if (!query || query.trim().length < 2) return []
  try {
    const variants = getArabicSearchVariants(query)
    const orConditions = variants.flatMap(v => [
      { name: { contains: v, mode: 'insensitive' as const } },
      { description: { contains: v, mode: 'insensitive' as const } },
      { category: { name: { contains: v, mode: 'insensitive' as const } } },
    ])

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: orConditions,
      },
      take: 8,
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

