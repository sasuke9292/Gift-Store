'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { UploadCloud, X, Tag } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
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
  const [imageUrlInput, setImageUrlInput] = useState('')
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error('حجم الصورة كبير جداً. الحد الأقصى هو 2 ميجابايت.')
      e.target.value = ''
      return
    }
    
    const toastId = toast.loading('جاري رفع الصورة...')
    
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })
      
      const data = await res.json()
      
      if (data.success) {
        setFormData(prev => ({...prev, imagesList: [...prev.imagesList, data.url]}))
        toast.success('تم رفع الصورة بنجاح', { id: toastId })
      } else {
        toast.error(data.error || 'حدث خطأ أثناء الرفع', { id: toastId })
      }
    } catch {
      toast.error('حدث خطأ في الاتصال بالخادم', { id: toastId })
    } finally {
      e.target.value = '' 
    }
  }

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return
    setFormData({...formData, imagesList: [...formData.imagesList, imageUrlInput.trim()]})
    setImageUrlInput('')
    toast.success('تمت إضافة رابط الصورة بنجاح')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[700px] rounded-[2rem] p-0 overflow-hidden border border-white/[0.05] bg-[#0A1628] shadow-2xl max-h-[90vh] flex flex-col" dir="rtl">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/[0.05] flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Tag className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <DialogTitle className="text-2xl font-black text-white/85">
              تعديل المنتج
            </DialogTitle>
            <p className="text-sm text-white/40 mt-1 font-medium">قم بتحديث بيانات المنتج الخاص بك.</p>
          </div>
        </div>
        
        {/* Body */}
        <div className="overflow-y-auto p-8 flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
          <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-8">
            
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white/85 border-b border-white/[0.05] pb-2">التفاصيل الأساسية</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-white/50">اسم المنتج <span className="text-rose-500">*</span></Label>
                  <Input 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="h-12 rounded-xl border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all outline-none focus-visible:ring-2 focus-visible:ring-amber-500/10 text-white/80" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-white/50">الرابط المخصص (Slug)</Label>
                  <Input 
                    value={formData.slug} 
                    onChange={e => setFormData({...formData, slug: e.target.value})} 
                    dir="rtl" 
                    className="h-12 rounded-xl border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all outline-none focus-visible:ring-2 focus-visible:ring-amber-500/10 text-white/80 font-mono text-sm text-start" 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-bold text-white/50">وصف المنتج</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="min-h-[100px] rounded-xl border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all outline-none focus-visible:ring-2 focus-visible:ring-amber-500/10 text-white/80 resize-y p-4" 
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white/85 border-b border-white/[0.05] pb-2">الصور والتصنيف</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-white/50">التصنيف <span className="text-rose-500">*</span></Label>
                  <select 
                    required 
                    className="flex h-12 w-full rounded-xl border border-white/[0.08] hover:border-white/[0.15] bg-white/[0.04] focus:bg-white/[0.06] px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:border-amber-500/50 focus-visible:ring-2 focus-visible:ring-amber-500/10 transition-all text-white/80"
                    value={formData.categoryId}
                    onChange={e => setFormData({...formData, categoryId: e.target.value})}
                  >
                    <option value="" disabled className="bg-[#0A1628]">اختر تصنيفاً...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-[#0A1628]">{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-bold text-white/50">صور المنتج</Label>
                <div className="border-2 border-dashed border-white/[0.08] rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-white/[0.02] hover:bg-amber-500/5 hover:border-amber-500/30 transition-all cursor-pointer relative group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleImageUpload}
                  />
                  <div className="w-12 h-12 rounded-full bg-white/[0.05] shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition-all text-white/40">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-white/50 mb-1">اضغط أو اسحب الصور من جهازك هنا</p>
                </div>

                <div className="flex gap-2 mt-3">
                  <Input 
                    placeholder="أو أدخل رابط الصورة هنا (URL)..." 
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 h-12 rounded-xl border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all outline-none focus-visible:ring-2 focus-visible:ring-amber-500/10 text-white/80 text-sm text-start"
                    dir="rtl"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddImageUrl}
                    className="h-12 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white shadow-none font-bold px-6 border border-white/[0.05]"
                  >
                    إضافة الرابط
                  </Button>
                </div>

                {formData.imagesList.length > 0 && (
                  <div className="grid grid-cols-5 gap-3 mt-4">
                    {formData.imagesList.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/[0.1] group shadow-sm">
                        <Image src={img} alt="preview" fill className="object-cover" />
                        <button 
                          type="button" 
                          onClick={() => {
                            const arr = [...formData.imagesList]
                            arr.splice(idx, 1)
                            setFormData({...formData, imagesList: arr})
                          }} 
                          className="absolute top-1 end-1 bg-[#0A1628]/90 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-rose-500/20 hover:text-rose-400 shadow-sm transition-all text-white/70"
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
              <h2 className="text-lg font-bold text-white/85 border-b border-white/[0.05] pb-2">التسعير والحالة</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-white/50">السعر الأساسي (د.ع) <span className="text-rose-500">*</span></Label>
                  <Input 
                    required 
                    type="number" 
                    value={formData.price || ''} 
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                    className="h-12 rounded-xl border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all outline-none focus-visible:ring-2 focus-visible:ring-amber-500/10 font-bold text-amber-400" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-white/50">سعر التخفيض (اختياري)</Label>
                  <Input 
                    type="number" 
                    value={formData.salePrice || ''} 
                    onChange={e => setFormData({...formData, salePrice: Number(e.target.value)})} 
                    className="h-12 rounded-xl border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all outline-none focus-visible:ring-2 focus-visible:ring-amber-500/10 font-bold text-emerald-400" 
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.08] w-full">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-white/85 cursor-pointer" onClick={() => setFormData({...formData, isActive: !formData.isActive})}>
                    عرض المنتج للعملاء
                  </Label>
                  <p className="text-[11px] text-white/40 font-medium">إذا كان غير مفعل، لن يظهر المنتج في المتجر.</p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <DialogFooter className="px-8 py-5 border-t border-white/[0.05] gap-3 sm:justify-start flex-row shrink-0">
          <Button form="edit-product-form" type="submit" disabled={isSubmitting} className="rounded-xl h-11 px-8 bg-amber-500 hover:bg-amber-400 text-[#030810] shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all font-bold w-full sm:w-auto">
            {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl h-11 px-6 font-bold w-full sm:w-auto text-white/50 hover:text-white/80 hover:bg-white/[0.05] border border-white/[0.05] transition-all">
            إلغاء
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}
