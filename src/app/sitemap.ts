import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://gift-store-rl7i-three.vercel.app'

  // Static routes
  const routes = [
    '',
    '/shop',
    '/gift-finder',
    '/about',
    '/contact',
    '/faq',
    '/track-order',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // Dynamic category routes
  let categoryRoutes: MetadataRoute.Sitemap = []
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    })
    categoryRoutes = categories.map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: cat.updatedAt || new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))
  } catch (error) {
    console.error('Failed to fetch categories for sitemap:', error)
  }

  // Dynamic product routes
  let productRoutes: MetadataRoute.Sitemap = []
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true },
      take: 100,
    })
    productRoutes = products.map((prod) => ({
      url: `${baseUrl}/product/${prod.id}`,
      lastModified: prod.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error)
  }

  return [...routes, ...categoryRoutes, ...productRoutes]
}
