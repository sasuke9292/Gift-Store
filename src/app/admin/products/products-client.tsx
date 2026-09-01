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
import { Search, Plus, MoreHorizontal, Edit, Trash, Image as ImageIcon, Package, UploadCloud, X, Tag, DollarSign } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { createProduct, updateProduct, deleteProduct } from '@/app/actions/admin/products'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'

import { Product, Category } from '@prisma/client'

type ProductWithCategory = Product & { category?: Category | null }

export default function ProductsClient({ initialProducts, categories }: { initialProducts: ProductWithCategory[], categories: Category[] }) {
  const [products, setProducts] = useState<ProductWithCategory[]>(initialProducts)
  const [search, setSearch] = useState('')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> & { imagesList?: string[] }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState('')

  const openModal = (product?: ProductWithCategory) => {
    if (product) {
      setIsEditing(true)
      setCurrentProduct({
        ...product,
        imagesList: product.images || []
      })
    } else {
      setIsEditing(false)
      setCurrentProduct({ name: '', slug: '', description: '', price: 0, salePrice: 0, categoryId: categories[0]?.id || '', imagesList: [], isActive: true })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const imagesArray = currentProduct.imagesList || []

      if (isEditing && currentProduct.id) {
        const res = await updateProduct(currentProduct.id, {
          name: currentProduct.name || '',
          slug: currentProduct.slug || '',
          description: currentProduct.description || '',
          price: Number(currentProduct.price) || 0,
          salePrice: Number(currentProduct.salePrice) || null,
          categoryId: currentProduct.categoryId || '',
          images: imagesArray,
          isActive: currentProduct.isActive ?? true,
        })
        if (res.success) {
          toast.success('تم تحديث المنتج بنجاح')
          const updatedCat = categories.find(c => c.id === currentProduct.categoryId)
          setProducts(products.map(p => p.id === currentProduct.id ? { ...p, ...(res.data as ProductWithCategory), category: updatedCat } : p))
          setIsModalOpen(false)
        } else {
          toast.error(res.error || 'حدث خطأ')
        }
      } else {
        const res = await createProduct({
          name: currentProduct.name || '',
          slug: currentProduct.slug || `slug-${Date.now()}`,
          description: currentProduct.description || '',
          price: Number(currentProduct.price) || 0,
          salePrice: Number(currentProduct.salePrice) || null,
          categoryId: currentProduct.categoryId || '',
          images: imagesArray,
          isActive: currentProduct.isActive ?? true,
        })
        if (res.success) {
          toast.success('تم إضافة المنتج بنجاح')
          const newCat = categories.find(c => c.id === currentProduct.categoryId)
          setProducts([{ ...(res.data as ProductWithCategory), category: newCat }, ...products])
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">المنتجات</h1>
          <p className="text-slate-500 mt-1.5 font-medium text-sm">إدارة المنتجات، المخزون، والأسعار الخاصة بمتجرك.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => openModal()} className="h-12 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 rounded-2xl px-6 font-bold text-sm">
            <Plus className="w-5 h-5 ml-2" />
            إضافة منتج جديد
          </Button>
        </div>
      </div>

      <Card className="border-slate-100 shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="ابحث باسم المنتج أو الرمز (SKU)..."
                className="pl-4 pr-12 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-2xl h-12 text-sm font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-right font-bold text-slate-700 h-14 px-6">المنتج</TableHead>
                  <TableHead className="text-right font-bold text-slate-700 h-14">التصنيف</TableHead>
                  <TableHead className="text-right font-bold text-slate-700 h-14">السعر</TableHead>
                  <TableHead className="text-right font-bold text-slate-700 h-14">الحالة</TableHead>
                  <TableHead className="text-center font-bold text-slate-700 h-14 w-28">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="group hover:bg-indigo-50/30 transition-all duration-300 border-b border-slate-50 last:border-0 relative">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-[1.25rem] bg-slate-50 border border-slate-100/80 flex items-center justify-center overflow-hidden relative shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                          {product.images && product.images[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors">{product.name}</p>
                          <p className="text-xs text-slate-500 font-mono mt-1 opacity-80">{product.sku || product.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-50 text-slate-600 font-semibold text-xs border border-slate-100">
                        {product.category?.name || 'بدون تصنيف'}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-extrabold text-primary text-sm tracking-tight">{product.price.toLocaleString('en-US')} د.ع</span>
                    </TableCell>
                    <TableCell className="py-4">
                      {product.isActive ? (
                        <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200/50 rounded-xl px-3 py-1 font-bold text-xs shadow-sm">نشط</Badge>
                      ) : (
                        <Badge className="bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/50 rounded-xl px-3 py-1 font-bold text-xs shadow-sm">مسودة</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <DropdownMenu dir="rtl">
                        <DropdownMenuTrigger className={buttonVariants({ variant: "outline", className: "h-9 w-9 p-0 text-slate-400 hover:text-primary hover:bg-indigo-50 border-slate-200 rounded-xl shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/20" })}>
                          <span className="sr-only">فتح القائمة</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48 rounded-2xl shadow-xl shadow-slate-200/50 border-slate-100 p-1.5 animate-in fade-in-0 zoom-in-95">
                          <DropdownMenuItem onClick={() => openModal(product)} className="rounded-xl cursor-pointer p-2.5 font-medium text-slate-700 hover:text-primary focus:text-primary focus:bg-indigo-50/50 transition-colors">
                            <Edit className="mr-2.5 h-4 w-4 text-slate-400" />
                            <span>تعديل بيانات المنتج</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(product.id)} className="rounded-xl cursor-pointer p-2.5 font-medium text-rose-600 hover:text-rose-700 focus:text-rose-700 focus:bg-rose-50 transition-colors mt-1">
                            <Trash className="mr-2.5 h-4 w-4" />
                            <span>حذف نهائي للمنتج</span>
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
                          
                          if (file.size > 2 * 1024 * 1024) {
                            toast.error('حجم الصورة كبير جداً. الحد الأقصى هو 2 ميجابايت.')
                            e.target.value = ''
                            return
                          }
                          
                          const toastId = toast.loading('جاري معالجة الصورة...')
                          
                          try {
                            const reader = new FileReader()
                            reader.readAsDataURL(file)
                            reader.onload = () => {
                              const base64String = reader.result as string
                              const currentImages = currentProduct.imagesList || []
                              setCurrentProduct({...currentProduct, imagesList: [...currentImages, base64String]})
                              toast.success('تمت إضافة الصورة بنجاح', { id: toastId })
                            }
                            reader.onerror = () => {
                              toast.error('حدث خطأ أثناء قراءة الصورة', { id: toastId })
                            }
                          } catch {
                            toast.error('حدث خطأ غير متوقع', { id: toastId })
                          } finally {
                            e.target.value = '' 
                          }
                        }}
                      />
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 group-hover:text-indigo-600 transition-all duration-300 text-slate-400">
                         <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-700">اضغط أو اسحب الصور هنا</p>
                      <p className="text-xs text-slate-500 mt-1">الحد الأقصى 2MB</p>
                   </div>

                   {/* Image Previews */}
                   {currentProduct.imagesList && currentProduct.imagesList.length > 0 && (
                     <div className="grid grid-cols-3 gap-3">
                       {currentProduct.imagesList.map((img: string, idx: number) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group shadow-sm bg-slate-50">
                             <Image src={img} alt="preview" fill className="object-cover" />
                             <button 
                               type="button" 
                               onClick={() => {
                                 const arr = [...(currentProduct.imagesList || [])]
                                 arr.splice(idx, 1)
                                 setCurrentProduct({...currentProduct, imagesList: arr})
                               }} 
                               className="absolute top-1.5 left-1.5 bg-white/90 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 hover:text-rose-600 shadow-sm transform scale-90 group-hover:scale-100"
                             >
                                <X className="w-4 h-4" />
                             </button>
                          </div>
                       ))}
                     </div>
                   )}
                   
                   <div className="pt-2 border-t border-slate-100 flex gap-2">
                      <Input 
                        value={newImageUrl} 
                        onChange={e => setNewImageUrl(e.target.value)} 
                        placeholder="أو أضف رابط صورة خارجي (URL)"
                        className="h-10 rounded-xl bg-slate-50 border-transparent focus:border-indigo-300 focus:bg-white flex-1 text-sm"
                        dir="ltr"
                      />
                      <Button 
                        type="button"
                        variant="secondary"
                        className="rounded-xl h-10 px-4"
                        onClick={() => {
                          if (newImageUrl.trim()) {
                            const currentImages = currentProduct.imagesList || []
                            setCurrentProduct({...currentProduct, imagesList: [...currentImages, newImageUrl.trim()]})
                            setNewImageUrl('')
                          }
                        }}
                      >
                        إضافة
                      </Button>
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
                         <Input required type="number" value={currentProduct.price || ''} onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} className="h-11 rounded-xl bg-slate-50 border-transparent focus:border-amber-300 focus:bg-white transition-colors font-bold text-primary text-lg" placeholder="0" />
                      </div>
                      <div className="space-y-2">
                         <Label className="text-sm font-semibold text-slate-700">سعر التخفيض (اختياري)</Label>
                         <Input type="number" value={currentProduct.salePrice || ''} onChange={e => setCurrentProduct({...currentProduct, salePrice: Number(e.target.value)})} className="h-11 rounded-xl bg-slate-50 border-transparent focus:border-amber-300 focus:bg-white transition-colors font-bold text-rose-600 text-lg" placeholder="0" />
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
