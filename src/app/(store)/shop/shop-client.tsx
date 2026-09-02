'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Filter, Search, SlidersHorizontal, Heart, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { ProductCard } from '@/components/store/product-card'

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  price: number
  salePrice?: number | null
  isNew?: boolean
  isBestSeller?: boolean
  images?: string[]
  category?: { name: string } | null
}

interface ShopClientProps {
  initialProducts: Product[]
  categories: Category[]
  initialActiveCategory?: string
}

export default function ShopClient({ initialProducts, categories, initialActiveCategory }: ShopClientProps) {
  const [activeCategory, setActiveCategory] = useState(initialActiveCategory || 'الكل')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = initialProducts.filter(product => {
    const matchesCategory = activeCategory === 'الكل' || product.category?.name === activeCategory
    const matchesSearch = product.name.includes(searchQuery)
    return matchesCategory && matchesSearch
  })

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">المتجر</h1>
            <p className="text-slate-500">تصفح تشكيلة واسعة من الهدايا المميزة لكل المناسبات.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute end-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="ابحث عن منتج..." 
                className="ps-4 pe-12 h-12 bg-slate-50 border-transparent focus:bg-white rounded-2xl w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl shrink-0">
              <SlidersHorizontal className="w-5 h-5 text-slate-600" />
            </Button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Categories */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-64 shrink-0 space-y-8"
          >
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                التصنيفات
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveCategory('الكل')}
                    className={`w-full text-end px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeCategory === 'الكل'
                      ? 'bg-primary/10 text-primary font-bold' 
                      : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    الكل
                  </button>
                </li>
                {categories.map(category => (
                  <li key={category.id}>
                    <button
                      onClick={() => setActiveCategory(category.name)}
                      className={`w-full text-end px-4 py-3 rounded-xl transition-all duration-300 ${
                        activeCategory === category.name 
                        ? 'bg-primary/10 text-primary font-bold' 
                        : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Product Grid */}
          <div className="flex-1">
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={product.id}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {filteredProducts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-3xl border border-slate-100"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">لا توجد منتجات</h3>
                <p className="text-slate-500">لم نتمكن من العثور على أي منتجات تطابق بحثك.</p>
                <Button 
                  onClick={() => {
                    setSearchQuery('')
                    setActiveCategory('الكل')
                  }}
                  variant="outline" 
                  className="mt-6 rounded-xl"
                >
                  إعادة ضبط البحث
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
