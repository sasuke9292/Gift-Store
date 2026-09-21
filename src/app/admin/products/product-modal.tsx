'use client'

import React, { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  UploadCloud, 
  X, 
  Plus, 
  Loader2, 
  Sparkles, 
  Star, 
  Flame, 
  Eye, 
  Tag, 
  Check, 
  RefreshCw,
  Image as ImageIcon,
  DollarSign,
  TrendingDown,
  Package
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { updateProduct } from '@/app/actions/admin/products'
import { toast } from 'sonner'
import { Category, Product } from '@prisma/client'
import { cn } from '@/lib/utils'

interface ProductModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  product: Product | null
  categories: Category[]
  onSuccess: (product: Product) => void
}

type TabType = 'general' | 'media' | 'settings'

export default function ProductModal({ isOpen, setIsOpen, product, categories, onSuccess }: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('general')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrlInput, setImageUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    salePrice: 0,
    categoryId: '',
    imagesList: [] as string[],
    isActive: true,
    isBestSeller: false,
    isNew: true,
  })

  // Official React pattern for adjusting state when prop changes during render
  const [prevProductId, setPrevProductId] = useState<string | null>(null)
  const currentProductId = (isOpen && product) ? product.id : null

  if (currentProductId !== prevProductId) {
    setPrevProductId(currentProductId)
    if (product && isOpen) {
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: product.price,
        salePrice: product.salePrice || 0,
        categoryId: product.categoryId || '',
        imagesList: Array.isArray(product.images) ? product.images : [],
        isActive: product.isActive,
        isBestSeller: product.isBestSeller || false,
        isNew: product.isNew ?? true,
      })
      setActiveTab('general')
    }
  }

  // Calculate live discount statistics
  const price = Number(formData.price) || 0
  const salePrice = Number(formData.salePrice) || 0
  const hasDiscount = salePrice > 0 && salePrice < price
  const discountPercent = hasDiscount ? Math.round(((price - salePrice) / price) * 100) : 0
  const savings = hasDiscount ? price - salePrice : 0

  // Auto-generate slug from name
  const handleGenerateSlug = () => {
    if (!formData.name.trim()) return
    const clean = formData.name
      .trim()
      .toLowerCase()
      .replace(/[^\w\s\u0621-\u064A-]/g, '')
      .replace(/\s+/g, '-')
    const finalSlug = clean ? `${clean}-${Date.now().toString().slice(-4)}` : `product-${Date.now()}`
    setFormData(prev => ({ ...prev, slug: finalSlug }))
    toast.info('تم إنشاء الرابط المخصص تلقائياً')
  }

  // Handle direct file upload from device
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    let uploadedCount = 0

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const body = new FormData()
      body.append('file', file)

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body,
        })
        const data = await res.json()
        if (data.success && data.url) {
          setFormData(prev => ({
            ...prev,
            imagesList: [...prev.imagesList, data.url]
          }))
          uploadedCount++
        } else {
          toast.error(data.error || 'فشل رفع إحدى الصور')
        }
      } catch (err) {
        toast.error('حدث خطأ أثناء الاتصال بالخادم لرفع الصورة')
      }
    }

    setIsUploading(false)
    if (uploadedCount > 0) {
      toast.success(`تم رفع ${uploadedCount} صورة بنجاح`)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Add image by URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return
    setFormData(prev => ({
      ...prev,
      imagesList: [...prev.imagesList, imageUrlInput.trim()]
    }))
    setImageUrlInput('')
    toast.success('تمت إضافة رابط الصورة')
  }

  // Set image as primary cover (move to index 0)
  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return
    setFormData(prev => {
      const copy = [...prev.imagesList]
      const [item] = copy.splice(index, 1)
      copy.unshift(item)
      return { ...prev, imagesList: copy }
    })
    toast.success('تم تعيين الصورة كغلاف رئيسي للمنتج')
  }

  // Remove image
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagesList: prev.imagesList.filter((_, i) => i !== index)
    }))
  }

  // Adjust price helper buttons
  const handleAdjustPrice = (amount: number) => {
    setFormData(prev => ({
      ...prev,
      price: Math.max(0, (Number(prev.price) || 0) + amount)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    if (salePrice > 0 && salePrice >= price) {
      toast.error('سعر التخفيض يجب أن يكون أقل من السعر الأساسي!')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await updateProduct(product.id, {
        name: formData.name.trim(),
        slug: formData.slug.trim() || `slug-${Date.now()}`,
        description: formData.description.trim(),
        price: Number(formData.price),
        salePrice: salePrice > 0 ? salePrice : null,
        categoryId: formData.categoryId,
        images: formData.imagesList,
        isActive: formData.isActive,
        isBestSeller: formData.isBestSeller,
        isNew: formData.isNew,
      })

      if (res.success && res.data) {
        toast.success('تم حفظ تعديلات المنتج بنجاح ✨')
        onSuccess(res.data)
        setIsOpen(false)
      } else {
        toast.error(res.error || 'حدث خطأ أثناء التعديل')
      }
    } catch (err) {
      toast.error('حدث خطأ غير متوقع في حفظ البيانات.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const activeCategory = categories.find(c => c.id === formData.categoryId)
  const primaryImage = formData.imagesList[0] || ''

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="w-[96vw] max-w-[1240px] p-0 overflow-hidden rounded-3xl bg-white border border-[#E8E4DF] shadow-2xl" 
        style={{ width: 'min(96vw, 1240px)', maxWidth: 'min(96vw, 1240px)' }}
        dir="rtl"
      >
        <form onSubmit={handleSubmit} className="flex flex-col w-full max-h-[92vh] min-h-[600px]">
          
          {/* Header */}
          <DialogHeader className="p-5 sm:p-6 md:p-7 bg-[#FAFAF8] border-b border-[#E8E4DF] text-start shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <DialogTitle className="text-2xl sm:text-3xl font-black text-[#1C1917] flex items-center gap-3 tracking-tight">
                  <div className="w-10 h-10 rounded-2xl bg-[#FBF6EE] border border-[#C9A96E]/30 flex items-center justify-center text-[#A07850] shadow-2xs">
                    <Sparkles className="w-5 h-5 text-[#C9A96E]" />
                  </div>
                  <span>تعديل بيانات المنتج</span>
                </DialogTitle>
                <p className="text-xs sm:text-sm text-[#78716C] mt-1.5 font-medium">
                  تحديث تفاصيل المنتج، التسعير، العروض الترويجية، معرض الصور، وشارات الظهور في المتجر
                </p>
              </div>

              {/* Status Pill in Header */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 shadow-2xs",
                  formData.isActive 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : "bg-stone-100 text-stone-600 border-stone-200"
                )}>
                  <span className={cn("w-2 h-2 rounded-full", formData.isActive ? "bg-emerald-500 animate-pulse" : "bg-stone-400")} />
                  {formData.isActive ? 'معروض للعملاء في المتجر' : 'مسودة غير منشورة'}
                </span>
              </div>
            </div>

            {/* Navigation Tabs - Full Width Matching Settings Style */}
            <div className="bg-[#F4EFEA]/80 p-1.5 rounded-2xl border border-[#E8E4DF] flex flex-wrap sm:flex-nowrap items-center gap-1.5 mt-5">
              {[
                { id: 'general', label: 'البيانات الأساسية والأسعار', icon: Tag },
                { id: 'media', label: `معرض الصور (${formData.imagesList.length})`, icon: ImageIcon },
                { id: 'settings', label: 'الشارات وإعدادات الظهور', icon: Star },
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer",
                      isActive
                        ? "bg-[#1C1917] text-white shadow-xs"
                        : "bg-transparent text-[#78716C] hover:text-[#1C1917] hover:bg-white/90"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "text-[#C9A96E]" : "text-[#A8A29E]")} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </DialogHeader>

          {/* Body Content - Spacious with Smooth Scroll */}
          <div className="p-5 sm:p-6 md:p-7 overflow-y-auto space-y-6 flex-1 text-start">

            {/* TAB 1: GENERAL & PRICING (Two-Column Layout for Desktop) */}
            {activeTab === 'general' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Right Column: Name, Category, Slug, Description (7 Cols) */}
                <div className="lg:col-span-7 bg-white border border-[#E8E4DF] rounded-3xl p-5 sm:p-7 space-y-5 shadow-2xs">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[#E8E4DF]">
                    <div className="w-7 h-7 rounded-lg bg-[#FBF6EE] border border-[#C9A96E]/20 flex items-center justify-center text-[#A07850]">
                      <Package className="w-4 h-4 text-[#C9A96E]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#1C1917]">معلومات المنتج الأساسية</h3>
                      <p className="text-[11px] text-[#78716C] font-medium">اسم المنتج، التصنيف التابع له، والوصف التسويقي</p>
                    </div>
                  </div>

                  {/* Product Name */}
                  <div>
                    <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">اسم المنتج *</Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="مثال: باقة ورد أحمر جوري فاخرة مع شوكولاتة باتشي"
                      className="h-12 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] focus:border-[#C9A96E] focus:bg-white text-sm font-bold text-[#1C1917]"
                    />
                  </div>

                  {/* Category & Slug */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">التصنيف *</Label>
                      <select
                        required
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="w-full h-11 px-3 rounded-xl bg-[#FAFAF8] border border-[#E8E4DF] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#C9A96E] focus:bg-white transition-colors"
                      >
                        <option value="">اختر التصنيف...</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <Label className="text-xs font-bold text-[#1C1917]">الرابط المخصص (Slug)</Label>
                        <button
                          type="button"
                          onClick={handleGenerateSlug}
                          className="text-[11px] text-[#A07850] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          توليد تلقائي
                        </button>
                      </div>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-xs font-mono"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">وصف ومواصفات المنتج</Label>
                    <Textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="اكتب وصفاً مفصلاً يبرز فخامة المنتج، تفاصيل التغليف، المواد المستخدمة، والمناسبات الملائمة له..."
                      className="rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-xs resize-none focus:bg-white p-3 leading-relaxed font-normal"
                    />
                  </div>
                </div>

                {/* Left Column: Dedicated Pricing Card & Live Calculation (5 Cols) */}
                <div className="lg:col-span-5 bg-[#FAF7F2] border border-[#E8E4DF] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
                  <div className="flex items-center gap-2.5 pb-4 border-b border-[#E8E4DF]">
                    <div className="w-8 h-8 rounded-xl bg-[#C9A96E]/20 flex items-center justify-center text-[#8C6838]">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-[#1C1917]">إعدادات التسعير والخصومات</h4>
                      <p className="text-xs text-[#78716C] font-medium">تحديد الأسعار وحساب الخصم المباشر</p>
                    </div>
                  </div>

                  {/* Base Price */}
                  <div>
                    <Label className="text-xs font-bold text-[#1C1917] mb-2 block">
                      السعر الأساسي (د.ع) *
                    </Label>
                    <Input
                      type="number"
                      required
                      min="0"
                      step="500"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="h-13 rounded-2xl bg-white border-[#E8E4DF] text-lg font-black text-[#1C1917]"
                      dir="ltr"
                    />

                    {/* Quick Adjust Buttons */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => handleAdjustPrice(5000)}
                        className="flex-1 py-2 rounded-xl bg-white border border-[#E8E4DF] text-xs font-bold text-[#1C1917] hover:bg-[#F5F0EA] transition-colors cursor-pointer shadow-2xs"
                      >
                        +5,000 د.ع
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustPrice(10000)}
                        className="flex-1 py-2 rounded-xl bg-white border border-[#E8E4DF] text-xs font-bold text-[#1C1917] hover:bg-[#F5F0EA] transition-colors cursor-pointer shadow-2xs"
                      >
                        +10,000 د.ع
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustPrice(25000)}
                        className="flex-1 py-2 rounded-xl bg-white border border-[#E8E4DF] text-xs font-bold text-[#1C1917] hover:bg-[#F5F0EA] transition-colors cursor-pointer shadow-2xs"
                      >
                        +25,000 د.ع
                      </button>
                    </div>
                  </div>

                  {/* Sale Price */}
                  <div>
                    <Label className="text-xs font-bold text-[#1C1917] mb-2 block">
                      سعر التخفيض (د.ع) <span className="text-[#78716C] font-normal">(اختياري)</span>
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="500"
                      value={formData.salePrice || ''}
                      onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                      placeholder="0"
                      className="h-13 rounded-2xl bg-white border-[#E8E4DF] text-lg font-black text-[#8C6838]"
                      dir="ltr"
                    />

                    {/* Discount feedback box */}
                    {hasDiscount && (
                      <div className="mt-3.5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <TrendingDown className="w-4 h-4 text-emerald-600" />
                            نسبة التخفيض الفعلية:
                          </span>
                          <span className="text-base font-black text-emerald-700">{discountPercent}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold pt-2 border-t border-emerald-200/60">
                          <span>قيمة التوفير للعميل:</span>
                          <span className="font-bold">{savings.toLocaleString('en-US')} د.ع</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Active Price Preview Pill */}
                  <div className="pt-4 border-t border-[#E8E4DF] flex items-center justify-between text-xs">
                    <span className="text-[#78716C] font-bold">سعر العرض للعميل:</span>
                    <span className="text-lg font-black text-[#8C6838]">
                      {(salePrice > 0 ? salePrice : price).toLocaleString('en-US')} د.ع
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: MEDIA & IMAGES */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                
                {/* Upload Zone */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#C9A96E]/40 hover:border-[#C9A96E] rounded-3xl p-8 sm:p-10 text-center bg-[#FBF6EE]/40 hover:bg-[#FBF6EE] transition-all cursor-pointer group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-xs border border-[#E8E4DF] flex items-center justify-center mx-auto mb-3 text-[#A07850] group-hover:scale-105 transition-transform">
                    {isUploading ? (
                      <Loader2 className="w-7 h-7 animate-spin text-[#C9A96E]" />
                    ) : (
                      <UploadCloud className="w-8 h-8" />
                    )}
                  </div>
                  <p className="text-base font-black text-[#1C1917] mb-1">
                    {isUploading ? 'جاري رفع الصور...' : 'انقر لاختيار صور من جهازك أو اسحبها هنا'}
                  </p>
                  <p className="text-xs sm:text-sm text-[#78716C]">
                    يدعم PNG, JPG, WEBP • يمكنك تحديد عدة صور دفعة واحدة
                  </p>
                </div>

                {/* URL Input Option */}
                <div>
                  <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">أو أضف رابط صورة مباشر (URL)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="h-12 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-xs"
                      dir="ltr"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddImageUrl}
                      className="h-12 px-5 rounded-xl bg-[#1C1917] hover:bg-black text-white font-bold text-xs shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 ms-1.5" />
                      إضافة رابط
                    </Button>
                  </div>
                </div>

                {/* Images Grid */}
                <div>
                  <Label className="text-xs font-bold text-[#1C1917] mb-3 block">
                    الصور الحالية ({formData.imagesList.length}) • الأولى على اليمين هي صورة الغلاف الرئيسية
                  </Label>

                  {formData.imagesList.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
                      {formData.imagesList.map((url, idx) => (
                        <div 
                          key={idx} 
                          className="relative aspect-square rounded-2xl overflow-hidden border-2 border-[#E8E4DF] group bg-stone-100 shadow-xs"
                        >
                          <img 
                            src={url} 
                            alt={`product-img-${idx}`} 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23C9A96E" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>'
                            }}
                          />
                          
                          {/* Top Tag */}
                          {idx === 0 ? (
                            <span className="absolute top-2 start-2 bg-[#C9A96E] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
                              الغلاف ⭐
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="absolute top-2 start-2 bg-black/60 hover:bg-[#C9A96E] text-white text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              تعيين كغلاف
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-2 end-2 w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm hover:scale-105"
                            title="حذف الصورة"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center bg-[#FAFAF8] rounded-2xl border border-[#E8E4DF]">
                      <ImageIcon className="w-10 h-10 text-[#A8A29E] mx-auto mb-2" />
                      <p className="text-sm font-bold text-[#78716C]">لا توجد صور مضافة حتى الآن</p>
                      <p className="text-xs text-[#A8A29E] mt-0.5">قم برفع صورة واحدة على الأقل لعرضها للزبائن</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: BADGES & VISIBILITY SETTINGS (Side-by-side Layout) */}
            {activeTab === 'settings' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Right Column: Switches (7 Cols) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Active Switch */}
                  <div className="flex items-center justify-between p-5 bg-[#FAFAF8] rounded-2xl border border-[#E8E4DF]">
                    <div>
                      <p className="text-sm font-black text-[#1C1917]">حالة ظهور المنتج في المتجر</p>
                      <p className="text-xs text-[#78716C] mt-0.5">عند تفعيلها يظهر المنتج مباشرة للعملاء ويمكنهم شراؤه</p>
                    </div>
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(val) => setFormData({ ...formData, isActive: val })}
                    />
                  </div>

                  {/* Best Seller Switch */}
                  <div className="flex items-center justify-between p-5 bg-[#FAFAF8] rounded-2xl border border-[#E8E4DF]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Flame className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#1C1917]">تمييز كـ &quot;الأكثر طلباً&quot;</p>
                        <p className="text-xs text-[#78716C] mt-0.5">يضيف شارة سوداء مميزة ويبرز المنتج في الصفحة الرئيسية</p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.isBestSeller}
                      onCheckedChange={(val) => setFormData({ ...formData, isBestSeller: val })}
                    />
                  </div>

                  {/* New Arrival Switch */}
                  <div className="flex items-center justify-between p-5 bg-[#FAFAF8] rounded-2xl border border-[#E8E4DF]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gold-50 text-[#C9A96E] bg-[#FBF6EE] flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#1C1917]">تمييز كـ &quot;منتج جديد&quot;</p>
                        <p className="text-xs text-[#78716C] mt-0.5">يضيف شارة ذهبية براقة تلفت انتباه الزوار لتشكيلات الموسم</p>
                      </div>
                    </div>
                    <Switch
                      checked={formData.isNew}
                      onCheckedChange={(val) => setFormData({ ...formData, isNew: val })}
                    />
                  </div>
                </div>

                {/* Left Column: Live Card Preview (5 Cols) */}
                <div className="lg:col-span-5">
                  <div className="p-5 rounded-3xl bg-[#FAF7F2] border border-[#E8E4DF]">
                    <Label className="text-xs font-bold text-[#1C1917] mb-3 block flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-[#A07850]" />
                      <span>معاينة حية لشكل البطاقة في المتجر:</span>
                    </Label>

                    <div className="max-w-xs mx-auto p-4 rounded-3xl bg-white border border-[#E8E4DF] shadow-[0_8px_25px_rgba(0,0,0,0.06)]">
                      <div className="relative aspect-square rounded-2xl bg-[#FAF7F2] overflow-hidden mb-3">
                        {primaryImage ? (
                          <img 
                            src={primaryImage} 
                            alt="preview" 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23C9A96E" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#A8A29E]">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}

                        {/* Badges in Preview */}
                        <div className="absolute top-2 start-2 flex flex-col gap-1">
                          {formData.isNew && (
                            <span className="bg-[#C9A96E] text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                              جديد
                            </span>
                          )}
                          {formData.isBestSeller && (
                            <span className="bg-[#1C1917] text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                              الأكثر طلباً
                            </span>
                          )}
                          {hasDiscount && (
                            <span className="bg-[#E85D75] text-white text-[9px] font-black px-2 py-0.5 rounded-full" dir="ltr">
                              -{discountPercent}%
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-[10px] font-bold text-[#A07850] mb-0.5">
                        {activeCategory?.name || 'تصنيف الهدية'}
                      </p>
                      <p className="text-xs font-black text-[#1C1917] line-clamp-1 mb-2">
                        {formData.name || 'اسم المنتج هنا...'}
                      </p>
                      
                      <div className="flex items-baseline gap-1.5" dir="ltr">
                        <span className="text-sm font-black text-[#8C6838]">
                          {(salePrice > 0 ? salePrice : price).toLocaleString('en-US')}
                        </span>
                        <span className="text-[10px] text-[#78716C]">د.ع</span>
                        {hasDiscount && (
                          <span className="text-[10px] text-[#A8A29E] line-through ms-1">
                            {price.toLocaleString('en-US')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Footer Actions */}
          <DialogFooter className="p-5 sm:p-6 bg-[#FAFAF8] border-t border-[#E8E4DF] flex items-center justify-between gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="h-12 px-6 rounded-xl border-[#E8E4DF] text-[#1C1917] hover:bg-white font-bold text-xs sm:text-sm cursor-pointer"
            >
              إلغاء
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 px-8 sm:px-10 rounded-xl text-white font-extrabold text-xs sm:text-sm shadow-md cursor-pointer hover:brightness-105 transition-all"
              style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ms-2" />
                  جاري حفظ التعديلات...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 ms-1.5" />
                  حفظ التعديلات
                </>
              )}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}
