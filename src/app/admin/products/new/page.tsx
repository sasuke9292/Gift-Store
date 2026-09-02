import { prisma } from '@/lib/prisma'
import NewProductClient from './new-product-client'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })

  return <NewProductClient categories={categories} />
}
