import React from 'react'
import { getProducts } from '@/app/actions/products'
import { getCategories } from '@/app/actions/categories'
import ShopClient from './shop-client'

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const rawProducts = await getProducts()
  const categories = await getCategories()

  const products = rawProducts.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    salePrice: p.salePrice,
    isNew: p.isNew,
    isBestSeller: p.isBestSeller,
    images: Array.isArray(p.images) ? (p.images as string[]) : [],
    category: p.category ? { name: p.category.name } : null,
  }))

  return <ShopClient initialProducts={products} categories={categories} />
}
