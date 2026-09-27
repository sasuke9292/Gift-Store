import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import GiftFinderClient from './gift-finder-client'

export const metadata: Metadata = {
  title: 'مكتشف الهدايا الذكي | گِفتي بلس',
  description: 'المساعد الذكي لاختيار الهدية المثالية بناءً على المناسبة، الشخص المهدى إليه، والميزانية المناسبة في ثوانٍ معدودة',
}

export default async function GiftFinderPage() {
  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
      }
    })
  } catch (error) {
    console.error("Failed to load products for gift finder:", error)
  }

  // Format products to match the expected client type (with images array and category name)
  const formattedProducts = products.map(p => ({
    ...p,
    images: Array.isArray(p.images) ? (p.images as string[]) : [],
    category: p.category?.name || 'غير محدد'
  }))

  return <GiftFinderClient initialProducts={formattedProducts} />
}
