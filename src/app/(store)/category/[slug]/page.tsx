import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ShopClient from '@/app/(store)/shop/shop-client'

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  
  const category = await prisma.category.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      products: {
        include: {
          category: true,
        }
      }
    }
  })

  if (!category) {
    notFound()
  }

  const allCategories = await prisma.category.findMany()

  // Format products to match the expected client type
  const formattedProducts = category.products.map(p => ({
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
