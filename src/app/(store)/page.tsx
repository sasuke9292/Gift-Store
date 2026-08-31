import React from 'react'
import { getCategories } from '@/app/actions/categories'
import { getTopProducts } from '@/app/actions/products'
import StoreHomeClient from './home-client'

export const dynamic = 'force-dynamic'

export default async function StoreHome() {
  const categories = await getCategories()
  const topProducts = await getTopProducts(4)

  return <StoreHomeClient initialCategories={categories} initialTopProducts={topProducts} />
}
