'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { UploadCloud, X, Tag } from 'lucide-react'
import { updateProduct } from '@/app/actions/admin/products'
import { toast } from 'sonner'
import Image from 'next/image'
import { Category, Product } from '@prisma/client'

interface ProductModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  product: Product | null
  categories: Category[]
  onSuccess: (product: Product) => void
}

export default function ProductModal({ isOpen, setIsOpen, product, categories, onSuccess }: ProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    salePrice: 0,
    categoryId: '',
    imagesList: [] as string[],
    isActive: true
  })

  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: product.price,
        salePrice: product.salePrice || 0,
        categoryId: product.categoryId || '',
        imagesList: product.images || [],
        isActive: product.isActive
      })
    }
  }, [product, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setIsSubmitting(true)
    try {
      const res = await updateProduct(product.id, {
        name: formData.name,
        slug: formData.slug || `slug-${Date.now()}`,
        description: formData.description,
        price: Number(formData.price),
        salePrice: Number(formData.salePrice) || null,
        categoryId: formData.categoryId,
        images: formData.imagesList,
        isActive: formData.isActive,
      })

      if (res.success && res.data) {
        toast.success('تم تعديل المنتج بنجاح')
        onSuccess(res.data)
        setIsOpen(false)
      } else {
        toast.error(res.error || 'حدث خطأ أثناء التعديل')
      }
    } catch (err) {
      toast.error('حدث خطأ غير متوقع.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setFormData({...formData, imagesList: [...formData.imagesList, base64String]})
        toast.success('تمت إضافة الصورة بنجاح', { id: toastId })
      }
    } catch {
      toast.error('حدث خطأ', { id: toastId })
    } finally {
      e.target.value = '' 
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[700px] rounded-[2rem] p-0 overflow-hidden border-0 shadow-2xl max-h-[90vh] flex flex-col" dir="rtl">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0">
            <Tag className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <DialogTitle className="text-2xl font-black text-slate-800">
              تعديل المنتج
            </DialogTitle>
            <p className="text-sm text-slate-500 mt-1 font-medium">قم بتحديث بيانات المنتج الخاص بك.</p>
          </div>
        </div>
        
        {/* Body */}
        <div className="overflow-y-auto p-8 bg-white flex-1">
          <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-8">
            
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">التفاصيل الأساسية</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700">اسم المنتج <span className="text-rose-500">*</span></Label>
                  <Input 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50 focus:bg-white" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700">الرابط المخصص (Slug)</Label>
                  <Input 
                    value={formData.slug} 
                    onChange={e => setFormData({...formData, slug: e.target.value})} 
                    dir="ltr" 
                    className="h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50 focus:bg-white font-mono text-sm text-left" 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-700">وصف المنتج</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="min-h-[100px] rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 resize-y p-4" 
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">الصور والتصنيف</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700">التصنيف <span className="text-rose-500">*</span></Label>
                  <select 
                    required 
                    className="flex h-12 w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    value={formData.categoryId}
                    onChange={e => setFormData({...formData, categoryId: e.target.value})}
                  >
                    <option value="" disabled>اختر تصنيفاً...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-700">صور المنتج</Label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-300 transition-all cursor-pointer relative group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleImageUpload}
                  />
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 group-hover:text-indigo-600 transition-all text-slate-400">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-700 mb-1">اضغط أو اسحب الصور هنا</p>
                </div>

                {formData.imagesList.length > 0 && (
                  <div className="grid grid-cols-5 gap-3 mt-4">
                    {formData.imagesList.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group shadow-sm">
                        <Image src={img} alt="preview" fill className="object-cover" />
                        <button 
                          type="button" 
                          onClick={() => {
                            const arr = [...formData.imagesList]
                            arr.splice(idx, 1)
                            setFormData({...formData, imagesList: arr})
                          }} 
                          className="absolute top-1 right-1 bg-white/90 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600 shadow-sm"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">التسعير والحالة</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700">السعر الأساسي (د.ع) <span className="text-rose-500">*</span></Label>
                  <Input 
                    required 
                    type="number" 
                    value={formData.price || ''} 
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                    className="h-12 rounded-xl border-slate-200 focus-visible:ring-amber-500 bg-slate-50 focus:bg-white font-bold text-indigo-600" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700">سعر التخفيض (اختياري)</Label>
                  <Input 
                    type="number" 
                    value={formData.salePrice || ''} 
                    onChange={e => setFormData({...formData, salePrice: Number(e.target.value)})} 
                    className="h-12 rounded-xl border-slate-200 focus-visible:ring-amber-500 bg-slate-50 focus:bg-white font-bold text-rose-600" 
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 w-fit">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? '-translate-x-6' : '-translate-x-1'}`} />
                </button>
                <Label className="text-sm font-bold text-slate-700 cursor-pointer" onClick={() => setFormData({...formData, isActive: !formData.isActive})}>
                  عرض المنتج للعملاء
                </Label>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <DialogFooter className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 gap-3 sm:justify-start flex-row-reverse shrink-0">
          <Button form="edit-product-form" type="submit" disabled={isSubmitting} className="rounded-xl h-11 px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 font-bold w-full sm:w-auto">
            {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl h-11 px-6 font-bold w-full sm:w-auto text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200">
            إلغاء
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}
