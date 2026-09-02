import { prisma } from '@/lib/prisma'
import EditProductClient from './edit-product-client'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const product = await prisma.product.findUnique({
    where: { id }
  })

  if (!product) {
    notFound()
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })

  return <EditProductClient categories={categories} initialProduct={product} />
}
