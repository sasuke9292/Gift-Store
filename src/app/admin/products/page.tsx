import { prisma } from '@/lib/prisma'
import ProductsClient from './products-client'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      inventory: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const categories = await prisma.category.findMany()

  return <ProductsClient initialProducts={products} categories={categories} />
}
