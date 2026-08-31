'use client'

import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Plus, MoreHorizontal, Edit, Trash, Copy, Image as ImageIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { createProduct, updateProduct, deleteProduct } from '@/app/actions/admin/products'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'

export default function ProductsClient({ initialProducts, categories }: { initialProducts: any[], categories: any[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const openModal = (product?: any) => {
    if (product) {
      setIsEditing(true)
      setCurrentProduct({
        ...product,
        imagesStr: product.images?.join(', ') || ''
      })
    } else {
      setIsEditing(false)
      setCurrentProduct({ name: '', slug: '', description: '', price: 0, salePrice: 0, categoryId: categories[0]?.id || '', imagesStr: '', isActive: true })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const imagesArray = currentProduct.imagesStr.split(',').map((s:string) => s.trim()).filter(Boolean)

      if (isEditing && currentProduct.id) {
        const res = await updateProduct(currentProduct.id, {
          name: currentProduct.name,
          slug: currentProduct.slug,
          description: currentProduct.description,
          price: Number(currentProduct.price),
          salePrice: Number(currentProduct.salePrice) || null,
          categoryId: currentProduct.categoryId,
          images: imagesArray,
          isActive: currentProduct.isActive,
        })
        if (res.success) {
          toast.success('تم تحديث المنتج بنجاح')
          const updatedCat = categories.find(c => c.id === currentProduct.categoryId)
          setProducts(products.map(p => p.id === currentProduct.id ? { ...p, ...res.data, category: updatedCat } : p))
          setIsModalOpen(false)
        } else {
          toast.error(res.error || 'حدث خطأ')
        }
      } else {
        const res = await createProduct({
          name: currentProduct.name,
          slug: currentProduct.slug || `slug-${Date.now()}`,
          description: currentProduct.description || '',
          price: Number(currentProduct.price),
          salePrice: Number(currentProduct.salePrice) || null,
          categoryId: currentProduct.categoryId,
          images: imagesArray,
          isActive: currentProduct.isActive ?? true,
        })
        if (res.success) {
          toast.success('تم إضافة المنتج بنجاح')
          const newCat = categories.find(c => c.id === currentProduct.categoryId)
          setProducts([{ ...res.data, category: newCat }, ...products])
          setIsModalOpen(false)
        } else {
          toast.error(res.error || 'حدث خطأ')
        }
      }
    } finally {
      setIsSubmitting(false)
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

  const filteredProducts = products.filter(p => p.name.includes(search) || p.id.includes(search))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">المنتجات</h1>
          <p className="text-slate-500 mt-1">إدارة المنتجات، المخزون، والأسعار.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => openModal()} className="bg-primary hover:bg-primary/90 text-white shadow-sm rounded-xl">
            <Plus className="w-4 h-4 ml-2" />
            إضافة منتج
          </Button>
        </div>
      </div>

      <Card className="border-slate-100 shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="ابحث باسم المنتج أو الرمز (SKU)..."
                className="pl-4 pr-10 bg-white border-slate-200 rounded-xl focus-visible:ring-primary h-11"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="text-right font-medium">المنتج</TableHead>
                  <TableHead className="text-right font-medium">التصنيف</TableHead>
                  <TableHead className="text-right font-medium">السعر</TableHead>
                  <TableHead className="text-right font-medium">الحالة</TableHead>
                  <TableHead className="text-center font-medium">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-100 flex items-center justify-center overflow-hidden relative shrink-0">
                          {product.images && product.images[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{product.name}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{product.sku || product.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">{product.category?.name || 'بدون تصنيف'}</TableCell>
                    <TableCell className="font-bold text-primary">{product.price.toLocaleString('en-US')} د.ع</TableCell>
                    <TableCell>
                      {product.isActive ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 rounded-lg">نشط</Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-0 rounded-lg">مسودة</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "h-8 w-8 p-0 text-slate-500 rounded-lg" })}>
                          <span className="sr-only">فتح القائمة</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl shadow-lg border-slate-100">
                          <DropdownMenuItem onClick={() => openModal(product)} className="rounded-lg cursor-pointer">
                            <Edit className="mr-2 h-4 w-4 text-slate-400" />
                            <span>تعديل المنتج</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 rounded-lg cursor-pointer">
                            <Trash className="mr-2 h-4 w-4" />
                            <span>حذف المنتج</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                      لا يوجد منتجات مطابقة لبحثك
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl p-0 overflow-hidden border-0 max-h-[90vh] overflow-y-auto scrollbar-thin">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <DialogTitle className="text-xl font-bold text-slate-800">
              {isEditing ? 'تعديل منتج' : 'إضافة منتج جديد'}
            </DialogTitle>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">اسم المنتج</Label>
                <Input required value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="rounded-xl border-slate-200 focus-visible:ring-primary bg-slate-50 focus:bg-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">الرابط (Slug)</Label>
                <Input required value={currentProduct.slug} onChange={e => setCurrentProduct({...currentProduct, slug: e.target.value})} dir="ltr" className="rounded-xl border-slate-200 focus-visible:ring-primary bg-slate-50 focus:bg-white text-left font-mono" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">التصنيف</Label>
              <select 
                required 
                className="flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                value={currentProduct.categoryId}
                onChange={e => setCurrentProduct({...currentProduct, categoryId: e.target.value})}
              >
                <option value="">اختر تصنيفاً...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">السعر الأساسي (د.ع)</Label>
                <Input required type="number" value={currentProduct.price} onChange={e => setCurrentProduct({...currentProduct, price: e.target.value})} className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">سعر التخفيض (اختياري)</Label>
                <Input type="number" value={currentProduct.salePrice || ''} onChange={e => setCurrentProduct({...currentProduct, salePrice: e.target.value})} className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">الصور (روابط مفصولة بفاصلة)</Label>
              <Textarea value={currentProduct.imagesStr} onChange={e => setCurrentProduct({...currentProduct, imagesStr: e.target.value})} className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white" dir="ltr" placeholder="https://image1.jpg, https://image2.jpg" />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">وصف المنتج</Label>
              <Textarea value={currentProduct.description} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white min-h-[100px]" />
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 gap-3 sm:justify-start flex-row-reverse">
              <Button type="submit" disabled={isSubmitting} className="rounded-xl h-12 px-8 bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20">
                {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">
                إلغاء
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
