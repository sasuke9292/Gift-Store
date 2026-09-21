'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { UploadCloud, X, Tag, Plus, Loader2, Sparkles } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { updateProduct } from '@/app/actions/admin/products'
import { toast } from 'sonner'
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
        toast.success('تم تعديل بيانات المنتج بنجاح')
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

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return
    setFormData(prev => ({
      ...prev,
      imagesList: [...prev.imagesList, imageUrlInput.trim()]
    }))
    setImageUrlInput('')
  }

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagesList: prev.imagesList.filter((_, i) => i !== index)
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl bg-white border border-[#E8E4DF] shadow-2xl" dir="rtl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="p-6 bg-[#FAFAF8] border-b border-[#E8E4DF]">
            <DialogTitle className="text-xl font-black text-[#1C1917]">
              تعديل بيانات المنتج
            </DialogTitle>
            <p className="text-xs text-[#78716C] mt-1">قم بتحديث معلومات وصور وسعر المنتج في المتجر</p>
          </DialogHeader>

          <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
            {/* Name */}
            <div>
              <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">اسم المنتج *</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="مثال: طقم محفظة وحزام جلد طبيعي"
                className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] focus:border-[#C9A96E]/50 focus:bg-white text-sm"
              />
            </div>

            {/* Category & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">التصنيف *</Label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full h-11 px-3 rounded-xl bg-[#FAFAF8] border border-[#E8E4DF] text-sm text-[#1C1917] focus:outline-none focus:border-[#C9A96E]/50 focus:bg-white"
                >
                  <option value="">اختر التصنيف...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">السعر الأساسي (د.ع) *</Label>
                <Input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Sale Price & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">سعر التخفيض (اختياري)</Label>
                <Input
                  type="number"
                  value={formData.salePrice || ''}
                  onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                  placeholder="0"
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  dir="ltr"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">الرابط المخصص (Slug)</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">وصف المنتج</Label>
              <Textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="اكتب وصفاً جذاباً وتفصيلياً لمواصفات ومميزات المنتج..."
                className="rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm resize-none"
              />
            </div>

            {/* Images */}
            <div>
              <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">صور المنتج (رابط URL)</Label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  dir="ltr"
                />
                <Button 
                  type="button" 
                  onClick={handleAddImageUrl}
                  className="h-11 px-4 rounded-xl bg-[#1C1917] hover:bg-black text-white font-bold text-xs shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4 ms-1.5" />
                  إضافة صورة
                </Button>
              </div>

              {formData.imagesList.length > 0 && (
                <div className="flex flex-wrap gap-2.5 p-3 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]">
                  {formData.imagesList.map((url, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#E8E4DF] group">
                      <img src={url} alt={`img-${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active toggle */}
            <div className="flex items-center justify-between p-4 bg-[#FAFAF8] rounded-2xl border border-[#E8E4DF]">
              <div>
                <p className="text-sm font-bold text-[#1C1917]">حالة ظهور المنتج</p>
                <p className="text-xs text-[#78716C]">عرض المنتج للعملاء في المتجر أو حفظه كمسودة</p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(val) => setFormData({ ...formData, isActive: val })}
              />
            </div>
          </div>

          <DialogFooter className="p-5 bg-[#FAFAF8] border-t border-[#E8E4DF] flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="h-11 px-5 rounded-xl border-[#E8E4DF] text-[#1C1917] hover:bg-white font-bold text-xs cursor-pointer"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-6 rounded-xl text-white font-bold text-xs shadow-sm cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ms-2" />
                  جاري الحفظ...
                </>
              ) : (
                'حفظ التعديلات'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
