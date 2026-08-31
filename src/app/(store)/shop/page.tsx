import React from 'react'
import { getProducts } from '@/app/actions/products'
import { getCategories } from '@/app/actions/categories'
import ShopClient from './shop-client'

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const products = await getProducts()
  const categories = await getCategories()

  return <ShopClient initialProducts={products} categories={categories} />
}
