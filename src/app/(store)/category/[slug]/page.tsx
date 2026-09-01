import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ShopClient from '@/app/(store)/shop/shop-client'

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  
  const category = await prisma.category.findUnique({
    where: { slug: resolvedParams.slug },
  })

  if (!category) {
    notFound()
  }

  const allCategories = await prisma.category.findMany()
  const allProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Format products to match the expected client type
  const formattedProducts = allProducts.map(p => ({
    ...p,
    images: Array.isArray(p.images) ? (p.images as string[]) : [],
  }))

  const formattedCategories = allCategories.map(c => ({
    id: c.id,
    name: c.name
  }))

  return (
    <ShopClient 
      initialProducts={formattedProducts} 
      categories={formattedCategories} 
      initialActiveCategory={category.name}
    />
  )
}
