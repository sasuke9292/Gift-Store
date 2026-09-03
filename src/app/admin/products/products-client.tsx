'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Trash, Image as ImageIcon, CheckCircle2, Edit, Package } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import { deleteProduct, deleteProducts } from '@/app/actions/admin/products'
import { toast } from 'sonner'
import Link from 'next/link'
import { Product, Category } from '@prisma/client'
import ProductModal from './product-modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

type ProductWithCategory = Product & { category?: Category | null }

export default function ProductsClient({ initialProducts, categories }: { initialProducts: ProductWithCategory[], categories: Category[] }) {
  const [products, setProducts] = useState<ProductWithCategory[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDeletingBulk, setIsDeletingBulk] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentEditProduct, setCurrentEditProduct] = useState<ProductWithCategory | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeletingConfirm, setIsDeletingConfirm] = useState(false)
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds)
    if (checked) {
      newSet.add(id)
    } else {
      newSet.delete(id)
    }
    setSelectedIds(newSet)
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    setBulkDeleteConfirm(true)
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.includes(search) || p.id.includes(search)
    if (statusFilter === 'active') return matchesSearch && p.isActive
    if (statusFilter === 'draft') return matchesSearch && !p.isActive
    return matchesSearch
  })

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 pb-12" 
      dir="rtl"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0A1628] border border-white/[0.05] p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
              <Package className="w-4 h-4 text-amber-400" />
            </div>
            <h1 className="text-xl font-black text-white/85 tracking-tight">إدارة المنتجات</h1>
          </div>
          <p className="text-white/35 font-medium text-sm ms-10">إضافة وتعديل وحذف المنتجات في متجرك.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-amber-500 hover:bg-amber-400 text-[#030810] shadow-[0_4px_20px_rgba(245,158,11,0.3)] rounded-xl px-5 h-9 font-bold transition-all w-full sm:w-auto text-sm">
            <Plus className="w-4 h-4 ms-1.5" />
            إضافة منتج
          </Button>
        </Link>
      </div>

      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 flex items-center justify-between overflow-hidden"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <p className="text-sm font-bold text-amber-300">
                تم تحديد {selectedIds.size} منتج
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleBulkDelete} 
              disabled={isDeletingBulk}
              className="rounded-lg font-bold h-8 px-4 bg-rose-500/80 hover:bg-rose-500 text-sm transition-colors"
            >
              {isDeletingBulk ? 'جاري الحذف...' : 'حذف المحدد'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-hidden rounded-2xl bg-[#0A1628] border border-white/[0.05]">
        
        {/* Toolbar */}
        <div className="p-4 md:p-5 border-b border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:max-w-sm group">
            <Search className="absolute end-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 group-focus-within:text-amber-500 transition-colors" />
            <input
              placeholder="ابحث باسم المنتج..."
              className="w-full h-9 ps-3 pe-9 bg-white/[0.04] border border-white/[0.07] hover:border-white/[0.12] focus:border-amber-500/50 rounded-xl text-sm text-white/70 placeholder:text-white/25 outline-none focus:ring-2 focus:ring-amber-500/10 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex bg-white/[0.03] p-1 rounded-xl w-full md:w-auto border border-white/[0.05]">
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${statusFilter === 'all' ? 'bg-white/10 text-white/80 border border-white/10' : 'text-white/30 hover:text-white/60'}`}
            >
              الكل
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${statusFilter === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-white/30 hover:text-white/60'}`}
            >
              نشط
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${statusFilter === 'draft' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-white/30 hover:text-white/60'}`}
            >
              مسودة
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[860px]">
            <TableHeader className="border-b border-white/[0.05]">
              <TableRow className="hover:bg-transparent border-0">
                <TableHead className="w-12 px-5 py-3">
                  <Checkbox 
                    checked={filteredProducts.length > 0 && selectedIds.size === filteredProducts.length}
                    onCheckedChange={handleSelectAll}
                    className="border-white/20 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 rounded"
                  />
                </TableHead>
                <TableHead className="text-start font-bold text-white/30 py-3 px-5 text-[10px] uppercase tracking-widest">المنتج</TableHead>
                <TableHead className="text-start font-bold text-white/30 py-3 text-[10px] uppercase tracking-widest">التصنيف</TableHead>
                <TableHead className="text-start font-bold text-white/30 py-3 text-[10px] uppercase tracking-widest">السعر</TableHead>
                <TableHead className="text-start font-bold text-white/30 py-3 text-[10px] uppercase tracking-widest">الحالة</TableHead>
                <TableHead className="text-center font-bold text-white/30 py-3 px-5 text-[10px] uppercase tracking-widest">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/[0.04]">
                {filteredProducts.map((product) => (
                  <TableRow 
                    key={product.id}
                    className={`group transition-all duration-200 border-0 ${selectedIds.has(product.id) ? 'bg-amber-500/5' : 'hover:bg-white/[0.02]'}`}
                  >
                    <TableCell className="px-5 py-3">
                      <Checkbox 
                        checked={selectedIds.has(product.id)}
                        onCheckedChange={(checked) => handleSelectRow(product.id, checked as boolean)}
                        className="border-white/20 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 rounded"
                      />
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center overflow-hidden relative shrink-0 border border-white/[0.08] group-hover:border-amber-500/20 transition-colors">
                          {product.images && product.images[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-white/20" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white/75 text-sm group-hover:text-amber-400 transition-colors">{product.name}</p>
                          <span className="text-[10px] text-white/25 font-mono bg-white/[0.04] px-1.5 py-0.5 rounded mt-0.5 inline-block">
                            #{product.sku || product.id.slice(0, 8)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="bg-white/[0.06] text-white/50 font-semibold px-2 py-0.5 rounded text-[11px] border border-white/[0.06]">
                        {product.category?.name || 'بدون تصنيف'}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="font-bold text-amber-400/90 text-sm">
                        {product.price.toLocaleString('en-US')} <span className="text-[10px] text-white/30">د.ع</span>
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      {product.isActive ? (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md px-2 py-0.5 font-bold text-[11px] flex items-center gap-1 w-max">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          نشط
                        </span>
                      ) : (
                        <span className="bg-white/[0.05] text-white/35 border border-white/[0.08] rounded-md px-2 py-0.5 font-bold text-[11px] flex items-center gap-1 w-max">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                          مسودة
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center py-3 px-5">
                      <div className="flex items-center justify-center gap-1">
                        <button className="w-8 h-8 rounded-lg text-white/30 hover:text-amber-400 hover:bg-amber-500/10 transition-colors flex items-center justify-center" onClick={() => { setCurrentEditProduct(product); setIsEditModalOpen(true); }}>
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-8 h-8 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center justify-center" onClick={() => handleDelete(product.id)}>
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-52 text-center border-0">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-14 h-14 bg-white/[0.04] border border-white/[0.06] rounded-xl flex items-center justify-center">
                        <Search className="w-6 h-6 text-white/20" />
                      </div>
                      <span className="font-bold text-white/30 text-sm">لا توجد منتجات مطابقة</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ProductModal 
        isOpen={isEditModalOpen} 
        setIsOpen={setIsEditModalOpen} 
        product={currentEditProduct} 
        categories={categories} 
        onSuccess={(updatedProduct) => {
          setProducts(products.map(p => p.id === updatedProduct.id ? { ...p, ...updatedProduct, category: categories.find(c => c.id === updatedProduct.categoryId) } : p))
        }} 
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف المنتج"
        description="هل أنت متأكد من حذف هذا المنتج نهائياً؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف المنتج"
        variant="danger"
        onConfirm={async () => {
          if (deleteId) {
            setIsDeletingConfirm(true)
            const res = await deleteProduct(deleteId)
            if (res.success) {
              toast.success('تم الحذف بنجاح')
              setProducts(products.filter(p => p.id !== deleteId))
            } else {
              toast.error(res.error || 'حدث خطأ')
            }
            setIsDeletingConfirm(false)
            setDeleteId(null)
          }
        }}
        isLoading={isDeletingConfirm}
      />

      <ConfirmDialog
        open={bulkDeleteConfirm}
        onOpenChange={setBulkDeleteConfirm}
        title={`حذف ${selectedIds.size} منتج`}
        description="هل أنت متأكد من حذف هذه المنتجات نهائياً؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف المحدد"
        variant="danger"
        onConfirm={async () => {
          setIsDeletingBulk(true)
          const res = await deleteProducts(Array.from(selectedIds))
          if (res.success) {
            toast.success(`تم حذف ${selectedIds.size} منتج بنجاح`)
            setProducts(products.filter(p => !selectedIds.has(p.id)))
            setSelectedIds(new Set())
          } else {
            toast.error(res.error || 'حدث خطأ')
          }
          setIsDeletingBulk(false)
          setBulkDeleteConfirm(false)
        }}
        isLoading={isDeletingBulk}
      />
    </motion.div>
  )
}
