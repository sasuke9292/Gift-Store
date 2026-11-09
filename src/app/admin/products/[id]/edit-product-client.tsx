'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Image as ImageIcon, UploadCloud, X, Tag, DollarSign, Package } from 'lucide-react'
import { updateProduct } from '@/app/actions/admin/products'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Category, Product } from '@prisma/client'

export default function EditProductClient({ categories, initialProduct }: { categories: Category[], initialProduct: Product }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [product, setProduct] = useState({
    name: initialProduct.name,
    slug: initialProduct.slug,
    description: initialProduct.description || '',
    price: initialProduct.price,
    salePrice: initialProduct.salePrice || 0,
    categoryId: initialProduct.categoryId || '',
    imagesList: initialProduct.images || [] as string[],
    isActive: initialProduct.isActive
  })
  const [newImageUrl, setNewImageUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await updateProduct(initialProduct.id, {
        name: product.name,
        slug: product.slug || `slug-${Date.now()}`,
        description: product.description,
        price: Number(product.price),
        salePrice: Number(product.salePrice) || null,
        categoryId: product.categoryId,
        images: product.imagesList,
        isActive: product.isActive,
      })

      if (res.success) {
        toast.success('تم تعديل المنتج بنجاح')
        router.push('/admin/products')
      } else {
        toast.error(res.error || 'حدث خطأ أثناء الإضافة')
      }
    } catch (err) {
      toast.error('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.')
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
        setProduct({...product, imagesList: [...product.imagesList, base64String]})
        toast.success('تمت إضافة الصورة بنجاح', { id: toastId })
      }
    } catch {
      toast.error('حدث خطأ', { id: toastId })
    } finally {
      e.target.value = '' 
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8 pb-12" 
      dir="rtl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0A1628] border border-white/[0.05] p-5 rounded-2xl">
        <div className="flex items-center gap-4">
          <button 
            className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center transition-colors shadow-sm" 
            onClick={() => router.push('/admin/products')}
          >
            <ArrowRight className="w-5 h-5 text-white/60" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white/85 tracking-tight">تعديل المنتج</h1>
            <p className="text-sm text-white/40 mt-1 font-medium">قم بتحديث بيانات المنتج الخاص بك.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="rounded-xl h-10 px-6 font-bold text-white/60 bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] transition-colors"
            onClick={() => router.push('/admin/products')}
          >
            إلغاء
          </Button>
          <Button 
            form="product-form"
            type="submit" 
            disabled={isSubmitting} 
            className="rounded-xl h-10 px-8 bg-amber-500 hover:bg-amber-400 text-[#030810] font-bold shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all"
          >
            {isSubmitting ? 'جاري الحفظ...' : 'حفظ المنتج'}
          </Button>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Left Side in RTL) */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="rounded-2xl border border-white/[0.05] overflow-hidden bg-[#0A1628] shadow-sm">
            <div className="p-5 border-b border-white/[0.05] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                <Tag className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="text-base font-bold text-white/85">التفاصيل الأساسية</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-white/60">اسم المنتج <span className="text-rose-400">*</span></Label>
                <input 
                  required 
                  value={product.name} 
                  onChange={e => setProduct({...product, name: e.target.value})} 
                  className="w-full h-12 px-4 rounded-xl border border-white/[0.08] focus:border-amber-500/50 hover:border-white/[0.15] bg-white/[0.04] focus:bg-white/[0.06] text-base font-medium transition-colors text-white/85 outline-none focus:ring-2 focus:ring-amber-500/10 placeholder:text-white/20" 
                  placeholder="مثال: عطر فاخر 100مل..." 
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-bold text-white/60">وصف المنتج</Label>
                <textarea 
                  value={product.description} 
                  onChange={e => setProduct({...product, description: e.target.value})} 
                  className="w-full min-h-[140px] rounded-xl bg-white/[0.04] focus:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 outline-none focus:ring-2 focus:ring-amber-500/10 transition-colors resize-y p-4 text-sm text-white/85 placeholder:text-white/20 leading-relaxed" 
                  placeholder="اكتب تفاصيل المنتج ومميزاته هنا بشكل جذاب..." 
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.05] overflow-hidden bg-[#0A1628] shadow-sm">
            <div className="p-5 border-b border-white/[0.05] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                <ImageIcon className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="text-base font-bold text-white/85">صور المنتج</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="border-2 border-dashed border-white/[0.08] rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-white/[0.02] hover:bg-white/[0.04] hover:border-amber-500/30 transition-all cursor-pointer relative group">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleImageUpload}
                />
                <div className="w-14 h-14 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 group-hover:text-amber-400 transition-all duration-300 text-white/40">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white/70 mb-1">اضغط أو اسحب الصور هنا</h3>
                <p className="text-xs text-white/30">صيغ مدعومة: JPG, PNG, GIF (الحد الأقصى 2MB)</p>
              </div>

              {product.imagesList.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-6">
                  {product.imagesList.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/[0.1] group shadow-sm">
                      <Image src={img} alt="preview" fill className="object-cover" />
                      <button 
                        type="button" 
                        onClick={() => {
                          const arr = [...product.imagesList]
                          arr.splice(idx, 1)
                          setProduct({...product, imagesList: arr})
                        }} 
                        className="absolute top-2 end-2 bg-[#0A1628]/80 backdrop-blur-sm border border-white/10 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 text-white/70"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar (Right Side in RTL) */}
        <div className="space-y-8">
          
          <div className="rounded-2xl border border-white/[0.05] overflow-hidden bg-[#0A1628] shadow-sm">
            <div className="p-5 border-b border-white/[0.05] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="text-base font-bold text-white/85">التسعير</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-white/60">السعر الأساسي (د.ع) <span className="text-rose-400">*</span></Label>
                <input 
                  required 
                  type="number" 
                  value={product.price || ''} 
                  onChange={e => setProduct({...product, price: Number(e.target.value)})} 
                  className="w-full h-12 px-4 rounded-xl border border-white/[0.08] focus:border-amber-500/50 hover:border-white/[0.15] bg-white/[0.04] focus:bg-white/[0.06] transition-colors font-black text-amber-400 text-lg outline-none focus:ring-2 focus:ring-amber-500/10 placeholder:text-white/20" 
                  placeholder="0" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-white/60">سعر التخفيض (اختياري)</Label>
                <input 
                  type="number" 
                  value={product.salePrice || ''} 
                  onChange={e => setProduct({...product, salePrice: Number(e.target.value)})} 
                  className="w-full h-12 px-4 rounded-xl border border-white/[0.08] focus:border-amber-500/50 hover:border-white/[0.15] bg-white/[0.04] focus:bg-white/[0.06] transition-colors font-black text-rose-400 text-lg outline-none focus:ring-2 focus:ring-amber-500/10 placeholder:text-white/20" 
                  placeholder="0" 
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.05] overflow-hidden bg-[#0A1628] shadow-sm">
            <div className="p-5 border-b border-white/[0.05] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Package className="w-4 h-4 text-emerald-400" />
              </div>
              <h2 className="text-base font-bold text-white/85">التنظيم</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-white/60">التصنيف <span className="text-rose-400">*</span></Label>
                <select 
                  required 
                  className="flex h-12 w-full rounded-xl border border-white/[0.08] focus:border-amber-500/50 hover:border-white/[0.15] bg-white/[0.04] px-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/10 transition-colors text-white/80"
                  value={product.categoryId}
                  onChange={e => setProduct({...product, categoryId: e.target.value})}
                >
                  <option value="" disabled className="bg-[#0A1628]">اختر تصنيفاً...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-[#0A1628]">{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-bold text-white/60">الرابط المخصص (Slug)</Label>
                <input 
                  value={product.slug} 
                  onChange={e => setProduct({...product, slug: e.target.value})} 
                  dir="rtl" 
                  className="w-full h-12 px-4 rounded-xl border border-white/[0.08] focus:border-amber-500/50 hover:border-white/[0.15] bg-white/[0.04] focus:bg-white/[0.06] transition-colors font-mono text-sm outline-none focus:ring-2 focus:ring-amber-500/10 text-white/80 placeholder:text-white/20" 
                  placeholder="أتركه فارغاً للتوليد التلقائي" 
                />
              </div>

              <div className="pt-4 border-t border-white/[0.05]">
                <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                  <div>
                    <Label className="text-sm font-bold text-white/85">حالة المنتج</Label>
                    <p className="text-[11px] text-white/40 mt-1 font-medium">عرض المنتج للعملاء؟</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProduct({...product, isActive: !product.isActive})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${product.isActive ? 'bg-emerald-500' : 'bg-white/20'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.isActive ? '-translate-x-6' : '-translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </form>
    </motion.div>
  )
}
