import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductClient from './product-client'

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    include: {
      category: true,
    }
  })

  if (!product) {
    notFound()
  }

  const formattedProduct = {
    ...product,
    images: Array.isArray(product.images) ? (product.images as string[]) : [],
    category: product.category?.name || 'غير محدد'
  }

  return <ProductClient product={formattedProduct} />
}
