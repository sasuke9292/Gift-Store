import React from 'react'
import { getCategories } from '@/app/actions/categories'
import { getTopProducts } from '@/app/actions/products'
import { prisma } from '@/lib/prisma'
import StoreHomeClient from './home-client'

export const dynamic = 'force-dynamic'

export default async function StoreHome() {
  const categories = await getCategories()
  const topProducts = await getTopProducts(4)
  const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } })

  return (
    <StoreHomeClient 
      initialCategories={categories} 
      initialTopProducts={topProducts}
      heroBadge={settings?.heroBadge}
      heroHeadline={settings?.heroHeadline}
      heroSubheadline={settings?.heroSubheadline}
    />
  )
}
