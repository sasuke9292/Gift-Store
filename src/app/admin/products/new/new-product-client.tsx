'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Image as ImageIcon, Plus, X, Tag, DollarSign, Package, Loader2, Sparkles } from 'lucide-react'
import { createProduct } from '@/app/actions/admin/products'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Category } from '@prisma/client'
import { Switch } from '@/components/ui/switch'

export default function NewProductClient({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [product, setProduct] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    salePrice: 0,
    categoryId: '',
    imagesList: [] as string[],
    isActive: true
  })
  const [imageUrlInput, setImageUrlInput] = useState('')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setProduct(prev => ({
      ...prev,
      name: val,
      slug: prev.slug || val.trim().toLowerCase().replace(/[\s\W-]+/g, '-') || `prod-${Date.now().toString().slice(-6)}`
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product.name || !product.categoryId || !product.price) {
      toast.error('يرجى ملء جميع الحقول المطلوبة (الاسم، التصنيف، السعر)')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await createProduct({
        name: product.name,
        slug: product.slug || `prod-${Date.now()}`,
        description: product.description,
        price: Number(product.price),
        salePrice: Number(product.salePrice) || null,
        categoryId: product.categoryId,
        images: product.imagesList.length > 0 ? product.imagesList : [
          'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'
        ],
        isActive: product.isActive,
      })

      if (res.success) {
        toast.success('تمت إضافة المنتج الجديد بنجاح!')
        router.push('/admin/products')
        router.refresh()
      } else {
        toast.error(res.error || 'حدث خطأ أثناء إضافة المنتج')
      }
    } catch (err) {
      toast.error('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return
    setProduct(prev => ({
      ...prev,
      imagesList: [...prev.imagesList, imageUrlInput.trim()]
    }))
    setImageUrlInput('')
  }

  const handleRemoveImage = (index: number) => {
    setProduct(prev => ({
      ...prev,
      imagesList: prev.imagesList.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="space-y-6 pb-16" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="w-10 h-10 rounded-xl bg-white border border-[#E8E4DF] flex items-center justify-center text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAFAF8] transition-colors shadow-sm"
          >
            <ArrowRight className="w-5 h-5 rtl:-scale-x-100" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#1C1917] tracking-tight">إضافة منتج جديد</h1>
            <p className="text-sm text-[#78716C] mt-0.5">أدخل تفاصيل ومواصفات المنتج لإدراجه في المتجر</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left 2 Columns: Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-3xl border-[#E8E4DF] shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white overflow-hidden p-6 sm:p-7 space-y-5">
              <h2 className="text-base font-black text-[#1C1917] pb-3 border-b border-[#E8E4DF] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#C9A96E]" />
                المعلومات الأساسية
              </h2>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">اسم المنتج *</Label>
                <Input
                  required
                  value={product.name}
                  onChange={handleNameChange}
                  placeholder="مثال: ساعة يد كلاسيكية رجالية فاخرة"
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm focus:border-[#C9A96E]/50 focus:bg-white"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">الرابط المخصص (Slug)</Label>
                <Input
                  value={product.slug}
                  onChange={(e) => setProduct({ ...product, slug: e.target.value })}
                  placeholder="men-classic-luxury-watch"
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">وصف المنتج ومميزاته</Label>
                <Textarea
                  rows={6}
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  placeholder="اكتب وصفاً مفصلاً للمنتج ومواصفاته وجودة تصنيعه..."
                  className="rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm resize-none"
                />
              </div>
            </Card>

            {/* Images Card */}
            <Card className="rounded-3xl border-[#E8E4DF] shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white overflow-hidden p-6 sm:p-7 space-y-4">
              <h2 className="text-base font-black text-[#1C1917] pb-3 border-b border-[#E8E4DF] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#C9A96E]" />
                صور المنتج
              </h2>

              <div className="flex gap-2">
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
                  className="h-11 px-5 rounded-xl bg-[#1C1917] hover:bg-black text-white font-bold text-xs shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4 ms-1.5" />
                  إضافة الصورة
                </Button>
              </div>

              {product.imagesList.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-4 bg-[#FAFAF8] rounded-2xl border border-[#E8E4DF]">
                  {product.imagesList.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[#E8E4DF] group">
                      <img src={url} alt={`img-${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-[#FAFAF8] rounded-2xl border border-dashed border-[#E8E4DF]">
                  <ImageIcon className="w-8 h-8 text-[#A8A29E] mx-auto mb-2" />
                  <p className="text-xs text-[#78716C]">أضف روابط صور المنتج هنا، أو سيتم استخدام صورة افتراضية فاخرة تلقائياً.</p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: Pricing & Category */}
          <div className="space-y-6">
            <Card className="rounded-3xl border-[#E8E4DF] shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white overflow-hidden p-6 space-y-5">
              <h2 className="text-base font-black text-[#1C1917] pb-3 border-b border-[#E8E4DF]">
                التسعير والتصنيف
              </h2>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">التصنيف *</Label>
                <select
                  required
                  value={product.categoryId}
                  onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}
                  className="w-full h-11 px-3 rounded-xl bg-[#FAFAF8] border border-[#E8E4DF] text-sm text-[#1C1917] focus:outline-none focus:border-[#C9A96E]/50 focus:bg-white cursor-pointer"
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
                  value={product.price || ''}
                  onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                  placeholder="50000"
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm font-bold"
                  dir="ltr"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">سعر التخفيض (اختياري)</Label>
                <Input
                  type="number"
                  value={product.salePrice || ''}
                  onChange={(e) => setProduct({ ...product, salePrice: Number(e.target.value) })}
                  placeholder="40000"
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  dir="ltr"
                />
              </div>

              <div className="pt-3 border-t border-[#E8E4DF] flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#1C1917]">نشر المنتج فوراً</p>
                  <p className="text-xs text-[#78716C]">متاح للبيع في المتجر</p>
                </div>
                <Switch
                  checked={product.isActive}
                  onCheckedChange={(val) => setProduct({ ...product, isActive: val })}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl text-white font-bold text-sm shadow-md transition-all hover:-translate-y-0.5 cursor-pointer mt-4"
                style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ms-2" />
                    جاري حفظ المنتج...
                  </>
                ) : (
                  'حفظ ونشر المنتج'
                )}
              </Button>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
