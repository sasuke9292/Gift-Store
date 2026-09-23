import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import ProductsClient from './products-client'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/admin-login')
  if (session.user.role === 'CUSTOMER') redirect('/')

  let products: any[] = []
  let categories: any[] = []
  try {
    products = await prisma.product.findMany({
      include: {
        category: true,
        inventory: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  } catch (error) {
    console.error('Failed to fetch admin products:', error)
  }

  return <ProductsClient initialProducts={products} categories={categories} />
}
