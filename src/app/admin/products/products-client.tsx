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
import { Button } from '@/components/ui/button'
import { Search, Plus, Trash, Image as ImageIcon, CheckCircle2, Edit, Package, ExternalLink } from 'lucide-react'
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
    setIsDeletingBulk(true)
    const res = await deleteProducts(Array.from(selectedIds))
    if (res.success) {
      toast.success(`تم حذف ${selectedIds.size} منتجات بنجاح`)
      setProducts(products.filter(p => !selectedIds.has(p.id)))
      setSelectedIds(new Set())
      setBulkDeleteConfirm(false)
    } else {
      toast.error(res.error || 'فشل حذف المنتجات المحددة')
    }
    setIsDeletingBulk(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeletingConfirm(true)
    const res = await deleteProduct(deleteId)
    if (res.success) {
      toast.success('تم حذف المنتج بنجاح')
      setProducts(products.filter(p => p.id !== deleteId))
      setDeleteId(null)
    } else {
      toast.error(res.error || 'فشل حذف المنتج')
    }
    setIsDeletingConfirm(false)
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.sku?.toLowerCase().includes(search.toLowerCase()) ||
                          p.id.includes(search)
    if (statusFilter === 'active') return matchesSearch && p.isActive
    if (statusFilter === 'draft') return matchesSearch && !p.isActive
    return matchesSearch
  })

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1C1917] tracking-tight">إدارة المنتجات</h1>
          <p className="text-sm text-[#78716C] mt-1">
            إضافة وتعديل وحذف منتجات المتجر ومتابعة الأسعار والتصنيفات ({products.length} منتج)
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button 
            className="text-white shadow-[0_4px_16px_rgba(201,169,110,0.35)] hover:-translate-y-0.5 rounded-xl px-5 h-11 font-bold transition-all w-full sm:w-auto text-sm cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
          >
            <Plus className="w-4 h-4 ms-2" />
            إضافة منتج جديد
          </Button>
        </Link>
      </div>

      {/* Bulk Delete Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#FBF6EE] border border-[#C9A96E]/30 rounded-2xl p-4 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#C9A96E]" />
              <p className="text-sm font-bold text-[#1C1917]">
                تم تحديد <span className="text-[#A07850]">{selectedIds.size}</span> منتج
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={() => setBulkDeleteConfirm(true)} 
              disabled={isDeletingBulk}
              className="rounded-xl font-bold h-9 px-4 bg-rose-600 hover:bg-rose-700 text-xs transition-colors cursor-pointer"
            >
              حذف المحدد
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-[#E8E4DF] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-[#E8E4DF] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute end-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E] group-focus-within:text-[#C9A96E] transition-colors" />
            <input
              placeholder="ابحث باسم المنتج أو رمز SKU..."
              className="w-full h-11 ps-4 pe-10 bg-[#FAFAF8] border border-[#E8E4DF] hover:border-[#D5D0C9] focus:border-[#C9A96E]/50 focus:bg-white rounded-xl text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:ring-2 focus:ring-[#C9A96E]/15 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex bg-[#FAFAF8] p-1 rounded-xl border border-[#E8E4DF]">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                statusFilter === 'all' 
                  ? 'bg-white text-[#1C1917] shadow-sm' 
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              الكل ({products.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                statusFilter === 'active' 
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-200' 
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              نشط
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                statusFilter === 'draft' 
                  ? 'bg-amber-50 text-amber-700 shadow-sm border border-amber-200' 
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              مسودة
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[840px]">
            <TableHeader className="bg-[#FAFAF8] border-b border-[#E8E4DF]">
              <TableRow className="hover:bg-transparent border-0">
                <TableHead className="w-12 px-6 py-4">
                  <Checkbox 
                    checked={filteredProducts.length > 0 && selectedIds.size === filteredProducts.length}
                    onCheckedChange={handleSelectAll}
                    className="rounded border-[#D5D0C9] data-[state=checked]:bg-[#C9A96E] data-[state=checked]:border-[#C9A96E]"
                  />
                </TableHead>
                <TableHead className="text-start font-bold text-[#A8A29E] py-4 text-xs uppercase tracking-wider">المنتج</TableHead>
                <TableHead className="text-start font-bold text-[#A8A29E] py-4 text-xs uppercase tracking-wider">التصنيف</TableHead>
                <TableHead className="text-start font-bold text-[#A8A29E] py-4 text-xs uppercase tracking-wider">السعر</TableHead>
                <TableHead className="text-start font-bold text-[#A8A29E] py-4 text-xs uppercase tracking-wider">الحالة</TableHead>
                <TableHead className="text-center font-bold text-[#A8A29E] py-4 px-6 text-xs uppercase tracking-wider">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow 
                  key={product.id}
                  className={`group transition-all duration-150 border-b border-[#E8E4DF]/60 last:border-0 ${
                    selectedIds.has(product.id) ? 'bg-[#FBF6EE]/60' : 'hover:bg-[#FAFAF8]'
                  }`}
                >
                  <TableCell className="px-6 py-4">
                    <Checkbox 
                      checked={selectedIds.has(product.id)}
                      onCheckedChange={(checked) => handleSelectRow(product.id, checked as boolean)}
                      className="rounded border-[#D5D0C9] data-[state=checked]:bg-[#C9A96E] data-[state=checked]:border-[#C9A96E]"
                    />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-[#FAFAF8] flex items-center justify-center overflow-hidden relative shrink-0 border border-[#E8E4DF]">
                        {product.images && product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-[#A8A29E]" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-[#1C1917] text-sm group-hover:text-[#A07850] transition-colors">
                            {product.name}
                          </p>
                          {product.isBestSeller && (
                            <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0">
                              الأكثر طلباً
                            </span>
                          )}
                          {product.isNew && (
                            <span className="bg-[#FBF6EE] text-[#8C6838] border border-[#C9A96E]/30 text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0">
                              جديد
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#A8A29E] font-mono block mt-0.5">
                          #{product.sku || product.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="bg-[#FAFAF8] text-[#78716C] font-semibold px-3 py-1 rounded-full text-xs border border-[#E8E4DF]">
                      {product.category?.name || 'غير مصنف'}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col text-start">
                      <span className="font-black text-[#1C1917] text-sm">
                        {(product.salePrice && product.salePrice > 0 ? product.salePrice : product.price).toLocaleString('en-US')}{' '}
                        <span className="text-xs font-normal text-[#78716C]">د.ع</span>
                      </span>
                      {product.salePrice && product.salePrice > 0 && (
                        <span className="text-[11px] text-[#A8A29E] line-through font-medium">
                          {product.price.toLocaleString('en-US')} د.ع
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {product.isActive ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 font-bold text-xs inline-flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        نشط
                      </span>
                    ) : (
                      <span className="bg-stone-50 text-stone-600 border border-stone-200 rounded-full px-3 py-1 font-bold text-xs inline-flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                        مسودة
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center py-4 px-6">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/product/${product.id}`}
                        target="_blank"
                        className="w-9 h-9 rounded-xl text-[#A8A29E] hover:text-[#1C1917] hover:bg-[#FAFAF8] border border-transparent hover:border-[#E8E4DF] transition-all flex items-center justify-center"
                        title="معاينة في المتجر"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button 
                        id={`edit-product-${product.id}`}
                        data-testid="edit-product-btn"
                        className="w-9 h-9 rounded-xl text-[#78716C] hover:text-[#C9A96E] hover:bg-[#F5F0EA] border border-transparent hover:border-[#C9A96E]/30 transition-all flex items-center justify-center cursor-pointer" 
                        onClick={() => { setCurrentEditProduct(product); setIsEditModalOpen(true); }}
                        title="تعديل المنتج"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="w-9 h-9 rounded-xl text-[#A8A29E] hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all flex items-center justify-center cursor-pointer" 
                        onClick={() => setDeleteId(product.id)}
                        title="حذف المنتج"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProducts.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-[#FAFAF8] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#E8E4DF]">
                <Package className="w-8 h-8 text-[#A8A29E]" />
              </div>
              <h3 className="text-base font-bold text-[#1C1917] mb-1">لا توجد منتجات مطابقة</h3>
              <p className="text-sm text-[#78716C] max-w-sm mx-auto">لم نعثر على أي منتج يطابق معايير البحث المحددة.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Product Modal */}
      <ProductModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        product={currentEditProduct}
        categories={categories}
        onSuccess={(updatedProduct) => {
          setProducts(products.map(p => p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p))
        }}
      />

      {/* Single Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="هل أنت متأكد من حذف هذا المنتج؟"
        description="سيتم حذف هذا المنتج نهائياً من متجرك ولن يتمكن الزبائن من طلبه بعد ذلك."
        confirmText="حذف المنتج"
        cancelText="إلغاء"
        variant="danger"
        isLoading={isDeletingConfirm}
        onConfirm={handleDelete}
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        open={bulkDeleteConfirm}
        onOpenChange={setBulkDeleteConfirm}
        title={`هل أنت متأكد من حذف ${selectedIds.size} منتج؟`}
        description="سيتم حذف جميع المنتجات المحددة نهائياً من النظام."
        confirmText="حذف جميع المنتجات المحددة"
        cancelText="إلغاء"
        variant="danger"
        isLoading={isDeletingBulk}
        onConfirm={handleBulkDelete}
      />
    </div>
  )
}
