import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ShopClient from '@/app/(store)/shop/shop-client'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const category = await prisma.category.findUnique({
    where: { slug: resolvedParams.slug },
  }).catch(() => null)

  if (!category) {
    return {
      title: 'القسم غير موجود',
      description: 'القسم المطلوب غير متوفر حالياً.'
    }
  }

  return {
    title: `${category.name} | گِفتي بلس`,
    description: `استعرض أرقى تشكيلة من ${category.name} في متجر گِفتي بلس مع تغليف يدوي ملكي وتوصيل سريع`,
    openGraph: {
      title: `${category.name} | گِفتي بلس`,
      description: `استعرض أرقى تشكيلة من ${category.name} في متجر گِفتي بلس مع تغليف يدوي ملكي وتوصيل سريع`,
      images: category.image ? [{ url: category.image }] : undefined,
    }
  }
}

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
