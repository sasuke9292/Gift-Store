'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Image as ImageIcon, UploadCloud, X, Tag, DollarSign, Package } from 'lucide-react'
import { createProduct } from '@/app/actions/admin/products'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Category } from '@prisma/client'

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
  const [newImageUrl, setNewImageUrl] = useState('')
  const [imageUrlInput, setImageUrlInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await createProduct({
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
        toast.success('تم إضافة المنتج بنجاح')
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
        setProduct(prev => ({...prev, imagesList: [...prev.imagesList, data.url]}))
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
    setProduct({...product, imagesList: [...product.imagesList, imageUrlInput.trim()]})
    setImageUrlInput('')
    toast.success('تمت إضافة رابط الصورة بنجاح')
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8 pb-12" 
      dir="rtl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-10 h-10 rounded-full hover:bg-slate-100" 
            onClick={() => router.push('/admin/products')}
          >
            <ArrowRight className="w-5 h-5 text-slate-500" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">إضافة منتج جديد</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">أضف منتجاً جديداً إلى الكتالوج الخاص بك.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="rounded-xl h-12 px-6 font-bold text-slate-600 border-slate-200"
            onClick={() => router.push('/admin/products')}
          >
            إلغاء
          </Button>
          <Button 
            form="product-form"
            type="submit" 
            disabled={isSubmitting} 
            className="rounded-xl h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 transition-all"
          >
            {isSubmitting ? 'جاري الحفظ...' : 'حفظ المنتج'}
          </Button>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Left Side in RTL) */}
        <div className="lg:col-span-2 space-y-8">
          
          <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <Tag className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">التفاصيل الأساسية</h2>
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-700">اسم المنتج <span className="text-rose-500">*</span></Label>
                <Input 
                  required 
                  value={product.name} 
                  onChange={e => setProduct({...product, name: e.target.value})} 
                  className="h-14 rounded-2xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50 focus:bg-white text-lg font-medium transition-colors" 
                  placeholder="مثال: عطر فاخر 100مل..." 
                />
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-700">وصف المنتج</Label>
                <Textarea 
                  value={product.description} 
                  onChange={e => setProduct({...product, description: e.target.value})} 
                  className="min-h-[160px] rounded-2xl bg-slate-50 border-slate-200 focus:border-indigo-500 transition-colors resize-y p-5 text-base" 
                  placeholder="اكتب تفاصيل المنتج ومميزاته هنا بشكل جذاب..." 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <ImageIcon className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">صور المنتج</h2>
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-300 transition-all cursor-pointer relative group">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleImageUpload}
                />
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:text-indigo-600 transition-all duration-300 text-slate-400">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-700 mb-1">اضغط أو اسحب الصور من جهازك هنا</h3>
                <p className="text-sm text-slate-500">صيغ مدعومة: JPG, PNG, GIF (الحد الأقصى 2MB)</p>
              </div>

              <div className="flex gap-2 mt-3">
                <Input 
                  placeholder="أو أدخل رابط الصورة هنا (URL)..." 
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 rounded-xl h-14 text-md text-start"
                  dir="rtl"
                />
                <Button 
                  type="button" 
                  onClick={handleAddImageUrl}
                  className="h-14 rounded-xl bg-indigo-100 text-indigo-700 hover:bg-indigo-200 shadow-none font-bold px-8 text-md"
                >
                  إضافة الرابط
                </Button>
              </div>

              {product.imagesList.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-6">
                  {product.imagesList.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group shadow-sm">
                      <Image src={img} alt="preview" fill className="object-cover" />
                      <button 
                        type="button" 
                        onClick={() => {
                          const arr = [...product.imagesList]
                          arr.splice(idx, 1)
                          setProduct({...product, imagesList: arr})
                        }} 
                        className="absolute top-2 end-2 bg-white/90 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 hover:text-rose-600 shadow-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar (Right Side in RTL) */}
        <div className="space-y-8">
          
          <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">التسعير</h2>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-700">السعر الأساسي (د.ع) <span className="text-rose-500">*</span></Label>
                <Input 
                  required 
                  type="number" 
                  value={product.price || ''} 
                  onChange={e => setProduct({...product, price: Number(e.target.value)})} 
                  className="h-14 rounded-2xl border-slate-200 focus-visible:ring-amber-500 bg-slate-50 focus:bg-white transition-colors font-black text-indigo-600 text-xl" 
                  placeholder="0" 
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-700">سعر التخفيض (اختياري)</Label>
                <Input 
                  type="number" 
                  value={product.salePrice || ''} 
                  onChange={e => setProduct({...product, salePrice: Number(e.target.value)})} 
                  className="h-14 rounded-2xl border-slate-200 focus-visible:ring-amber-500 bg-slate-50 focus:bg-white transition-colors font-black text-rose-600 text-xl" 
                  placeholder="0" 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">التنظيم</h2>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-700">التصنيف <span className="text-rose-500">*</span></Label>
                <select 
                  required 
                  className="flex h-14 w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-2 text-md font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
                  value={product.categoryId}
                  onChange={e => setProduct({...product, categoryId: e.target.value})}
                >
                  <option value="" disabled>اختر تصنيفاً...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-700">الرابط المخصص (Slug)</Label>
                <Input 
                  value={product.slug} 
                  onChange={e => setProduct({...product, slug: e.target.value})} 
                  dir="rtl" 
                  className="h-14 rounded-2xl border-slate-200 focus-visible:ring-emerald-500 bg-slate-50 focus:bg-white transition-colors font-mono text-sm" 
                  placeholder="أتركه فارغاً للتوليد التلقائي" 
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <Label className="text-sm font-bold text-slate-800">حالة المنتج</Label>
                    <p className="text-xs text-slate-500 mt-1 font-medium">عرض المنتج للعملاء؟</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProduct({...product, isActive: !product.isActive})}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${product.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${product.isActive ? '-translate-x-6' : '-translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
          
        </div>
      </form>
    </motion.div>
  )
}
