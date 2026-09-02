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
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Trash, Image as ImageIcon, CheckCircle2, Edit } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import { deleteProduct, deleteProducts } from '@/app/actions/admin/products'
import { toast } from 'sonner'
import Link from 'next/link'
import { Product, Category } from '@prisma/client'

type ProductWithCategory = Product & { category?: Category | null }

export default function ProductsClient({ initialProducts }: { initialProducts: ProductWithCategory[] }) {
  const [products, setProducts] = useState<ProductWithCategory[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDeletingBulk, setIsDeletingBulk] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all')

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
    if (confirm(`هل أنت متأكد من حذف ${selectedIds.size} منتج بشكل نهائي؟`)) {
      setIsDeletingBulk(true)
      const res = await deleteProducts(Array.from(selectedIds))
      if (res.success) {
        toast.success(`تم حذف ${selectedIds.size} منتج بنجاح`)
        setProducts(products.filter(p => !selectedIds.has(p.id)))
        setSelectedIds(new Set())
      } else {
        toast.error(res.error || 'حدث خطأ أثناء الحذف الجماعي')
      }
      setIsDeletingBulk(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      const res = await deleteProduct(id)
      if (res.success) {
        toast.success('تم الحذف بنجاح')
        setProducts(products.filter(p => p.id !== id))
      } else {
        toast.error(res.error || 'حدث خطأ')
      }
    }
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">إدارة المنتجات</h1>
          <p className="text-slate-500 font-medium">إضافة وتعديل وحذف المنتجات في متجرك بكل سهولة.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 rounded-xl px-6 h-12 font-bold transition-all w-full sm:w-auto">
            <Plus className="w-5 h-5 ml-2" />
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
            className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              <p className="text-sm font-bold text-indigo-900">
                تم تحديد {selectedIds.size} منتج
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleBulkDelete} 
              disabled={isDeletingBulk}
              className="rounded-xl font-bold shadow-sm h-10 px-6 bg-rose-600 hover:bg-rose-700"
            >
              {isDeletingBulk ? 'جاري الحذف...' : 'حذف المحدد'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="border-slate-100 shadow-sm overflow-hidden rounded-[2.5rem] bg-white">
        
        {/* Toolbar */}
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="ابحث باسم المنتج أو الرمز (SKU)..."
              className="pl-4 pr-12 bg-white border-slate-200 focus:border-indigo-500 focus-visible:ring-indigo-100 h-14 rounded-2xl text-md shadow-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex bg-slate-100/50 p-1.5 rounded-2xl w-full md:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${statusFilter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              الكل
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${statusFilter === 'active' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              نشط
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${statusFilter === 'draft' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              مسودة
            </button>
          </div>
        </div>

        {/* Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[900px]">
              <TableHeader className="bg-slate-50 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-16 px-6 py-5">
                    <Checkbox 
                      checked={filteredProducts.length > 0 && selectedIds.size === filteredProducts.length}
                      onCheckedChange={handleSelectAll}
                      className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 rounded-lg w-5 h-5"
                    />
                  </TableHead>
                  <TableHead className="text-right font-bold text-slate-600 py-5 px-6">المنتج</TableHead>
                  <TableHead className="text-right font-bold text-slate-600 py-5">التصنيف</TableHead>
                  <TableHead className="text-right font-bold text-slate-600 py-5">السعر</TableHead>
                  <TableHead className="text-right font-bold text-slate-600 py-5">الحالة</TableHead>
                  <TableHead className="text-center font-bold text-slate-600 py-5 px-6">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.tr 
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`group transition-all duration-300 border-b border-slate-50 last:border-0 ${selectedIds.has(product.id) ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'}`}
                    >
                      <TableCell className="px-6 py-5">
                        <Checkbox 
                          checked={selectedIds.has(product.id)}
                          onCheckedChange={(checked) => handleSelectRow(product.id, checked as boolean)}
                          className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 rounded-lg w-5 h-5"
                        />
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center overflow-hidden relative shrink-0 shadow-sm border border-slate-100 group-hover:scale-105 transition-transform">
                            {product.images && product.images[0] ? (
                              <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-slate-300" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-base group-hover:text-indigo-600 transition-colors">{product.name}</p>
                            <p className="text-xs text-slate-400 font-mono mt-1">#{product.sku || product.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-xl shadow-none border-0">
                          {product.category?.name || 'بدون تصنيف'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-5">
                        <span className="font-black text-indigo-600 text-lg tracking-tight">
                          {product.price.toLocaleString('en-US')} <span className="text-xs font-bold text-slate-400">د.ع</span>
                        </span>
                      </TableCell>
                      <TableCell className="py-5">
                        {product.isActive ? (
                          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-0 rounded-xl px-3 py-1.5 font-bold shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 ml-1" />
                            نشط
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 rounded-xl px-3 py-1.5 font-bold shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-slate-500 mr-2 ml-1" />
                            مسودة
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center py-5 px-6">
                        <div className="flex items-center justify-center gap-2 transition-opacity">
                          <Link href={`/admin/products/${product.id}`}>
                            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(product.id)}>
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-4">
                        <Search className="w-12 h-12 text-slate-200" />
                        <span className="text-lg font-medium text-slate-500">لا يوجد منتجات مطابقة للبحث</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
