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
import { Search, Filter, Plus, MoreHorizontal, Edit, Trash, Copy, Image as ImageIcon, Package, UploadCloud, X, Tag, DollarSign } from 'lucide-react'
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
        <DialogContent className="sm:max-w-[900px] rounded-[2rem] p-0 overflow-hidden border-0 max-h-[90vh] flex flex-col shadow-2xl">
          <div className="px-6 py-5 border-b border-slate-100 bg-white flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
               <Package className="w-6 h-6 text-primary" />
             </div>
             <div>
               <DialogTitle className="text-xl font-bold text-slate-800">
                 {isEditing ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
               </DialogTitle>
               <p className="text-sm text-slate-500 mt-1">
                 {isEditing ? 'قم بتحديث معلومات المنتج وتعديل الصور والأسعار' : 'أدخل تفاصيل المنتج الجديد لإضافته إلى المتجر'}
               </p>
             </div>
          </div>
          
          <div className="overflow-y-auto scrollbar-thin p-6 bg-slate-50/50">
            <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Media Section (Right side in RTL) */}
              <div className="md:col-span-5 space-y-5">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                     <ImageIcon className="w-4 h-4 text-indigo-600" />
                   </div>
                   <h3 className="font-semibold text-slate-800 text-lg">صور المنتج</h3>
                 </div>
                 
                 <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                   {/* Upload Dropzone */}
                   <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-300 transition-all cursor-pointer relative group min-h-[160px]">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          
                          const formData = new FormData()
                          formData.append('file', file)
                          
                          try {
                            const toastId = toast.loading('جاري رفع الصورة...')
                            const res = await fetch('/api/upload', {
                              method: 'POST',
                              body: formData
                            })
                            const data = await res.json()
                            
                            if (data.success) {
                              const currentImages = currentProduct.imagesStr ? currentProduct.imagesStr.split(',').map((s:string) => s.trim()).filter(Boolean) : []
                              currentImages.push(data.url)
                              setCurrentProduct({...currentProduct, imagesStr: currentImages.join(', ')})
                              toast.success('تم رفع الصورة بنجاح', { id: toastId })
                            } else {
                              toast.error(data.error || 'فشل رفع الصورة', { id: toastId })
                            }
                          } catch (err) {
                            toast.error('حدث خطأ أثناء الرفع')
                          } finally {
                            e.target.value = '' 
                          }
                        }}
                      />
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 group-hover:text-indigo-600 transition-all duration-300 text-slate-400">
                         <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-700">اضغط أو اسحب الصور هنا</p>
                      <p className="text-xs text-slate-500 mt-1">يدعم PNG, JPG, WEBP</p>
                   </div>

                   {/* Image Previews */}
                   {currentProduct.imagesStr && currentProduct.imagesStr.trim() !== '' && (
                     <div className="grid grid-cols-3 gap-3">
                       {currentProduct.imagesStr.split(',').map((s:string) => s.trim()).filter(Boolean).map((img: string, idx: number) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group shadow-sm bg-slate-50">
                             <Image src={img} alt="preview" fill className="object-cover" />
                             <button 
                               type="button" 
                               onClick={() => {
                                 const arr = currentProduct.imagesStr.split(',').map((s:string) => s.trim()).filter(Boolean)
                                 arr.splice(idx, 1)
                                 setCurrentProduct({...currentProduct, imagesStr: arr.join(', ')})
                               }} 
                               className="absolute top-1.5 left-1.5 bg-white/90 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 hover:text-rose-600 shadow-sm transform scale-90 group-hover:scale-100"
                             >
                                <X className="w-4 h-4" />
                             </button>
                          </div>
                       ))}
                     </div>
                   )}
                   
                   <div className="pt-2 border-t border-slate-100">
                      <Label className="text-xs font-semibold text-slate-500 mb-2 block">روابط خارجية (مفصولة بفاصلة)</Label>
                      <Textarea 
                        value={currentProduct.imagesStr} 
                        onChange={e => setCurrentProduct({...currentProduct, imagesStr: e.target.value})} 
                        placeholder="https://... , https://..."
                        className="text-xs min-h-[60px] rounded-xl bg-slate-50 border-transparent focus:border-indigo-300 focus:bg-white resize-none"
                        dir="ltr"
                      />
                   </div>
                 </div>
              </div>

              {/* Form Details (Left side in RTL) */}
              <div className="md:col-span-7 space-y-6">
                 
                 {/* Basic Info */}
                 <div>
                   <div className="flex items-center gap-2 mb-3">
                     <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                       <Tag className="w-4 h-4 text-emerald-600" />
                     </div>
                     <h3 className="font-semibold text-slate-800 text-lg">التفاصيل الأساسية</h3>
                   </div>
                   
                   <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                     <div className="space-y-2">
                       <Label className="text-sm font-semibold text-slate-700">اسم المنتج <span className="text-rose-500">*</span></Label>
                       <Input required value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="h-11 rounded-xl bg-slate-50 border-transparent focus:border-emerald-300 focus:bg-white transition-colors" placeholder="مثال: عطر فاخر..." />
                     </div>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label className="text-sm font-semibold text-slate-700">التصنيف <span className="text-rose-500">*</span></Label>
                         <select 
                           required 
                           className="flex h-11 w-full rounded-xl bg-slate-50 border-transparent focus:border-emerald-300 focus:bg-white transition-colors px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                           value={currentProduct.categoryId}
                           onChange={e => setCurrentProduct({...currentProduct, categoryId: e.target.value})}
                         >
                           <option value="">اختر تصنيفاً...</option>
                           {categories.map(cat => (
                             <option key={cat.id} value={cat.id}>{cat.name}</option>
                           ))}
                         </select>
                       </div>
                       <div className="space-y-2">
                         <Label className="text-sm font-semibold text-slate-700">الرابط (Slug) <span className="text-rose-500">*</span></Label>
                         <Input required value={currentProduct.slug} onChange={e => setCurrentProduct({...currentProduct, slug: e.target.value})} dir="ltr" className="h-11 rounded-xl bg-slate-50 border-transparent focus:border-emerald-300 focus:bg-white transition-colors font-mono text-sm" placeholder="product-slug" />
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Pricing */}
                 <div>
                   <div className="flex items-center gap-2 mb-3">
                     <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                       <DollarSign className="w-4 h-4 text-amber-600" />
                     </div>
                     <h3 className="font-semibold text-slate-800 text-lg">التسعير</h3>
                   </div>

                   <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <Label className="text-sm font-semibold text-slate-700">السعر الأساسي (د.ع) <span className="text-rose-500">*</span></Label>
                         <Input required type="number" value={currentProduct.price} onChange={e => setCurrentProduct({...currentProduct, price: e.target.value})} className="h-11 rounded-xl bg-slate-50 border-transparent focus:border-amber-300 focus:bg-white transition-colors font-bold text-primary text-lg" placeholder="0" />
                      </div>
                      <div className="space-y-2">
                         <Label className="text-sm font-semibold text-slate-700">سعر التخفيض (اختياري)</Label>
                         <Input type="number" value={currentProduct.salePrice || ''} onChange={e => setCurrentProduct({...currentProduct, salePrice: e.target.value})} className="h-11 rounded-xl bg-slate-50 border-transparent focus:border-amber-300 focus:bg-white transition-colors font-bold text-rose-600 text-lg" placeholder="0" />
                      </div>
                   </div>
                 </div>

                 {/* Description */}
                 <div>
                   <div className="space-y-2">
                     <Label className="text-sm font-semibold text-slate-700">وصف المنتج</Label>
                     <Textarea value={currentProduct.description} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} className="min-h-[120px] rounded-xl bg-white border-slate-200 focus:border-primary transition-colors resize-none p-4" placeholder="اكتب تفاصيل المنتج ومميزاته هنا..." />
                   </div>
                 </div>

              </div>
            </form>
          </div>
          
          <div className="p-5 border-t border-slate-100 bg-white flex justify-end gap-3 rounded-b-[2rem]">
             <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6 hover:bg-slate-100 text-slate-600 font-semibold">
               إلغاء
             </Button>
             <Button form="product-form" type="submit" disabled={isSubmitting} className="rounded-xl h-12 px-8 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:-translate-y-0.5 font-bold text-base">
               {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
