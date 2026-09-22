import React from 'react'
import { getCategories } from '@/app/actions/categories'
import { getTopProducts } from '@/app/actions/products'
import { prisma } from '@/lib/prisma'
import StoreHomeClient from './home-client'

export const dynamic = 'force-dynamic'

export default async function StoreHome() {
  const categories = await getCategories()
  const rawTopProducts = await getTopProducts(8)
  const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } }).catch(() => null)

  const topProducts = rawTopProducts.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    salePrice: p.salePrice,
    isNew: p.isNew,
    isBestSeller: p.isBestSeller,
    images: Array.isArray(p.images) ? (p.images as string[]) : [],
    category: p.category ? { name: p.category.name } : null,
  }))

  return (
    <StoreHomeClient 
      initialCategories={categories} 
      initialTopProducts={topProducts}
      heroBadge={settings?.heroBadge}
      heroHeadline={settings?.heroHeadline}
      heroSubheadline={settings?.heroSubheadline}
      settings={settings}
    />
  )
}
