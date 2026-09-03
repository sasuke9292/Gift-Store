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
      className="space-y-8 pb-12" 
      dir="rtl"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-[0_5px_30px_rgba(0,0,0,0.03)] border border-slate-100/50">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100/80 rounded-xl text-slate-600">
              <Package className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight drop-shadow-sm">إدارة المنتجات</h1>
          </div>
          <p className="text-slate-500 font-medium text-lg ms-1">إضافة وتعديل وحذف المنتجات في متجرك بكل سهولة.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-[#050B14] hover:bg-[#0a1526] text-white shadow-[0_8px_20px_rgba(5,11,20,0.15)] border border-slate-800 rounded-xl px-5 h-10 font-bold transition-all w-full sm:w-auto text-sm">
            <Plus className="w-5 h-5 ms-2 text-amber-400" />
            إضافة منتج جديد
          </Button>
        </Link>
      </div>

      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-4 flex items-center justify-between shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-600" />
              <p className="text-sm font-bold text-amber-900">
                تم تحديد {selectedIds.size} منتج
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleBulkDelete} 
              disabled={isDeletingBulk}
              className="rounded-xl font-bold shadow-sm h-10 px-6 bg-rose-600 hover:bg-rose-700 transition-colors"
            >
              {isDeletingBulk ? 'جاري الحذف...' : 'حذف المحدد'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-slate-100/50 shadow-[0_5px_30px_rgba(0,0,0,0.03)] overflow-hidden rounded-2xl bg-white border">
        
        {/* Toolbar */}
        <div className="p-5 md:p-6 border-b border-slate-100/50 bg-slate-50/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            <Input
              placeholder="ابحث باسم المنتج أو الرمز (SKU)..."
              className="ps-4 pe-10 bg-white border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 h-10 rounded-xl text-sm shadow-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex bg-slate-100/50 p-1.5 rounded-2xl w-full md:w-auto shadow-inner">
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 md:flex-none px-5 py-2 rounded-lg font-bold text-xs transition-all ${statusFilter === 'all' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
            >
              الكل
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`flex-1 md:flex-none px-5 py-2 rounded-lg font-bold text-xs transition-all ${statusFilter === 'active' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
            >
              نشط
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`flex-1 md:flex-none px-5 py-2 rounded-lg font-bold text-xs transition-all ${statusFilter === 'draft' ? 'bg-white text-amber-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
            >
              مسودة
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[900px]">
              <TableHeader className="bg-slate-50/80 border-b border-slate-100/50">
                <TableRow className="hover:bg-transparent border-0">
                  <TableHead className="w-12 px-5 py-4">
                    <Checkbox 
                      checked={filteredProducts.length > 0 && selectedIds.size === filteredProducts.length}
                      onCheckedChange={handleSelectAll}
                      className="border-slate-300 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 rounded text-white shadow-sm"
                    />
                  </TableHead>
                  <TableHead className="text-start font-bold text-slate-500 py-4 px-5 text-[11px] uppercase tracking-wider">المنتج</TableHead>
                  <TableHead className="text-start font-bold text-slate-500 py-4 text-[11px] uppercase tracking-wider">التصنيف</TableHead>
                  <TableHead className="text-start font-bold text-slate-500 py-4 text-[11px] uppercase tracking-wider">السعر</TableHead>
                  <TableHead className="text-start font-bold text-slate-500 py-4 text-[11px] uppercase tracking-wider">الحالة</TableHead>
                  <TableHead className="text-center font-bold text-slate-500 py-4 px-5 text-[11px] uppercase tracking-wider">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100/50">
                  {filteredProducts.map((product) => (
                    <TableRow 
                      key={product.id}
                      className={`group transition-all duration-300 border-0 ${selectedIds.has(product.id) ? 'bg-amber-50/30' : 'hover:bg-slate-50/50'}`}
                    >
                      <TableCell className="px-5 py-3">
                        <Checkbox 
                          checked={selectedIds.has(product.id)}
                          onCheckedChange={(checked) => handleSelectRow(product.id, checked as boolean)}
                          className="border-slate-300 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 rounded text-white shadow-sm"
                        />
                      </TableCell>
                      <TableCell className="px-5 py-3">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden relative shrink-0 shadow-sm border border-slate-100 group-hover:border-amber-200 transition-colors">
                            {product.images && product.images[0] ? (
                              <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-slate-300" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm group-hover:text-amber-600 transition-colors">{product.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono mt-1 bg-slate-100 px-1.5 py-0.5 rounded-md inline-flex w-max">
                              <span className="opacity-60">#</span>{product.sku || product.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-md shadow-none border-0 text-[11px]">
                          {product.category?.name || 'بدون تصنيف'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="font-bold text-slate-800 text-sm tracking-tight group-hover:text-amber-600 transition-colors">
                          {product.price.toLocaleString('en-US')} <span className="text-[10px] text-slate-400">د.ع</span>
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        {product.isActive ? (
                          <Badge className="bg-emerald-50 text-emerald-600 border-0 rounded-md px-2.5 py-1 font-semibold shadow-sm text-[11px] flex items-center gap-1.5 w-max">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            نشط
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-600 border-0 rounded-md px-2.5 py-1 font-semibold shadow-sm text-[11px] flex items-center gap-1.5 w-max">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            مسودة
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center py-3 px-5">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-100 transition-colors" onClick={() => { setCurrentEditProduct(product); setIsEditModalOpen(true); }} title="تعديل المنتج">
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-colors" onClick={() => handleDelete(product.id)} title="حذف المنتج">
                            <Trash className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center border-0">
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-4">
                        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-inner">
                          <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <span className="text-lg font-black text-slate-500">لا توجد منتجات مطابقة للبحث</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
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
