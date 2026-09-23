import React from 'react'
import { getCategories } from '@/app/actions/categories'
import { getTopProducts } from '@/app/actions/products'
import { getPublicHeroSlides } from '@/app/actions/admin/hero-slides'
import { prisma } from '@/lib/prisma'
import StoreHomeClient from './home-client'

export const dynamic = 'force-dynamic'

export default async function StoreHome() {
  const [categories, rawTopProducts, heroSlides, settings] = await Promise.all([
    getCategories(),
    getTopProducts(8),
    getPublicHeroSlides(),
    prisma.storeSettings.findUnique({ where: { id: 'default' } }).catch(() => null)
  ])

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
      heroSlides={heroSlides}
      settings={settings}
    />
  )
}

