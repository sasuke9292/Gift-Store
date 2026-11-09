'use client'

import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Category, Product } from '@prisma/client'
import ProductForm from './product-form'

interface ProductModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  product: Product | null
  categories: Category[]
  onSuccess: (product: Product) => void
}

export default function ProductModal({ isOpen, setIsOpen, product, categories, onSuccess }: ProductModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="w-[96vw] max-w-[1240px] p-0 overflow-hidden rounded-3xl bg-white border border-[#E8E4DF] shadow-2xl" 
        style={{ width: 'min(96vw, 1240px)', maxWidth: 'min(96vw, 1240px)' }}
        dir="rtl"
      >
        <DialogTitle className="sr-only">
          {product ? `تعديل المنتج ${product.name}` : 'إضافة منتج جديد'}
        </DialogTitle>
        <ProductForm
          product={product}
          categories={categories}
          onSuccess={(savedProduct) => {
            onSuccess(savedProduct)
            setIsOpen(false)
          }}
          onCancel={() => setIsOpen(false)}
          isInline={false}
        />
      </DialogContent>
    </Dialog>
  )
}
