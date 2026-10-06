'use client'

import React, { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Loader2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Flame, 
  Award, 
  Gift, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  Image as ImageIcon,
  Sliders,
  Check,
  X,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'
import { 
  HeroSlideData, 
  createHeroSlide, 
  updateHeroSlide, 
  deleteHeroSlide, 
  toggleHeroSlideStatus, 
  reorderHeroSlides 
} from '@/app/actions/admin/hero-slides'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

interface HeroSlidesClientProps {
  initialSlides: HeroSlideData[]
  settings?: any
}

const POPULAR_TAGS = [
  'الأكثر طلباً',
  'تشكيلة حصرية',
  'صُنعت خصيصاً',
  'تغليف مجاني',
  'عروض وتخفيضات',
  'وصل حديثاً',
  'هدية فاخرة'
]

const POPULAR_LINKS = [
  { label: 'كافة المنتجات', path: '/shop' },
  { label: 'هدايا رجالية', path: '/category/men' },
  { label: 'هدايا نسائية', path: '/category/women' },
  { label: 'مناسبات وتغليف', path: '/category/occasions' },
  { label: 'مكتشف الهدايا', path: '/gift-finder' }
]

export default function HeroSlidesClient({ initialSlides, settings }: HeroSlidesClientProps) {
  const [slides, setSlides] = useState<HeroSlideData[]>(initialSlides)
  const [isPending, startTransition] = useTransition()
  
  // Simulator state
  const [showPreview, setShowPreview] = useState(true)
  const [previewSlideIdx, setPreviewSlideIdx] = useState(0)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlideData | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Delete modal state
  const [slideToDelete, setSlideToDelete] = useState<HeroSlideData | null>(null)

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formSubtitle, setFormSubtitle] = useState('')
  const [formImage, setFormImage] = useState('')
  const [formLink, setFormLink] = useState('/shop')
  const [formTag, setFormTag] = useState('الأكثر طلباً')
  const [formIsActive, setFormIsActive] = useState(true)

  // Active slides only for preview
  const activeSlides = slides.filter(s => s.isActive)
  const safePreviewIdx = activeSlides.length > 0 ? (previewSlideIdx % activeSlides.length) : 0
  const currentPreviewSlide = activeSlides[safePreviewIdx]

  // Open Modal for Create
  const handleOpenCreate = () => {
    setEditingSlide(null)
    setFormTitle('')
    setFormSubtitle('')
    setFormImage('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1000')
    setFormLink('/shop')
    setFormTag('الأكثر طلباً')
    setFormIsActive(true)
    setIsModalOpen(true)
  }

  // Open Modal for Edit
  const handleOpenEdit = (slide: HeroSlideData) => {
    setEditingSlide(slide)
    setFormTitle(slide.title)
    setFormSubtitle(slide.subtitle || '')
    setFormImage(slide.image)
    setFormLink(slide.link || '/shop')
    setFormTag(slide.tag || 'مميز')
    setFormIsActive(slide.isActive)
    setIsModalOpen(true)
  }

  // Upload image handler
  const handleUploadImage = async (file: File) => {
    if (!file) return
    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.success && data.url) {
        setFormImage(data.url)
        toast.success('تم رفع الصورة بنجاح!')
      } else {
        toast.error(data.error || 'فشل رفع الصورة')
      }
    } catch (err) {
      toast.error('حدث خطأ أثناء رفع الصورة')
    } finally {
      setIsUploading(false)
    }
  }

  // Submit Modal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) {
      toast.error('يرجى كتابة عنوان الشريحة')
      return
    }
    if (!formImage.trim()) {
      toast.error('يرجى اختيار أو رفع صورة للشريحة')
      return
    }

    startTransition(async () => {
      if (editingSlide) {
        // Update
        const res = await updateHeroSlide(editingSlide.id, {
          title: formTitle,
          subtitle: formSubtitle,
          image: formImage,
          link: formLink,
          tag: formTag,
          isActive: formIsActive
        })
        if (res.success && res.slide) {
          setSlides(prev => prev.map(s => s.id === editingSlide.id ? res.slide! : s))
          setIsModalOpen(false)
          toast.success('تم تحديث شريحة السلايدر بنجاح!')
        } else {
          toast.error(res.error || 'فشل في تحديث الشريحة')
        }
      } else {
        // Create
        const res = await createHeroSlide({
          title: formTitle,
          subtitle: formSubtitle,
          image: formImage,
          link: formLink,
          tag: formTag,
          isActive: formIsActive
        })
        if (res.success && res.slide) {
          setSlides(prev => [...prev, res.slide!])
          setIsModalOpen(false)
          toast.success('تم إنشاء شريحة العرض الجديدة بنجاح!')
        } else {
          toast.error(res.error || 'فشل في إنشاء الشريحة')
        }
      }
    })
  }

  // Instant Active Toggle
  const handleToggleStatus = async (slide: HeroSlideData) => {
    const nextStatus = !slide.isActive
    // Optimistic UI update
    setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, isActive: nextStatus } : s))

    const res = await toggleHeroSlideStatus(slide.id, nextStatus)
    if (res.success) {
      toast.success(nextStatus ? 'تم تفعيل الشريحة في واجهة المتجر' : 'تم تعطيل الشريحة وإخفاؤها')
    } else {
      // Revert on failure
      setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, isActive: !nextStatus } : s))
      toast.error(res.error || 'فشل في تغيير حالة الشريحة')
    }
  }

  // Reorder Slide
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= slides.length) return

    const newSlides = [...slides]
    const temp = newSlides[index]
    newSlides[index] = newSlides[targetIdx]
    newSlides[targetIdx] = temp

    // Update order numbers optimistically
    const reordered = newSlides.map((s, idx) => ({ ...s, order: idx }))
    setSlides(reordered)

    const res = await reorderHeroSlides(reordered.map(s => s.id))
    if (res.success) {
      toast.success('تم تحديث وحفظ ترتيب الشرائح')
    } else {
      toast.error('فشل في حفظ الترتيب الجديد')
    }
  }

  // Delete Slide
  const handleConfirmDelete = async () => {
    if (!slideToDelete) return
    const id = slideToDelete.id

    startTransition(async () => {
      const res = await deleteHeroSlide(id)
      if (res.success) {
        setSlides(prev => prev.filter(s => s.id !== id))
        setSlideToDelete(null)
        toast.success('تم حذف الشريحة بنجاح')
      } else {
        toast.error(res.error || 'فشل في حذف الشريحة')
      }
    })
  }

  return (
    <div className="space-y-8 font-sans text-start pb-24" dir="rtl">
      
      {/* Top Main Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E4DF] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
            style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
          >
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917] tracking-tight">
                إدارة سلايدر الواجهة التفاعلي
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#13213c]/15 text-[#13213c] border border-[#13213c]/30">
                مدمج بإعدادات المتجر
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#78716C] mt-1.5 leading-relaxed">
              تحكم احترافي وسريع في شرائح السلايدر الفاخر: إضافة صور عالية الدقة، رفع الصور من جهازك، ترتيب الظهور، والتفعيل اللحظي.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="h-11 px-4 rounded-xl border-[#E8E4DF] text-[#1C1917] hover:bg-[#FAFAF8] text-xs font-bold cursor-pointer"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4 ms-2 text-[#78716C]" />
                <span>إخفاء المعاينة</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 ms-2 text-[#13213c]" />
                <span>إظهار المعاينة الحية</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={handleOpenCreate}
            className="h-11 px-6 rounded-xl font-black text-white text-xs sm:text-sm cursor-pointer shadow-md hover:-translate-y-0.5 transition-all w-full sm:w-auto"
            style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
          >
            <Plus className="w-4 h-4 ms-2" />
            <span>إضافة شريحة جديدة</span>
          </Button>
        </div>
      </div>

      {/* Quick Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E4DF] shadow-xs">
          <p className="text-xs font-bold text-[#78716C]">إجمالي الشرائح</p>
          <p className="text-2xl sm:text-3xl font-black text-[#1C1917] mt-1">{slides.length}</p>
          <span className="text-[11px] text-[#A8A29E] mt-0.5 block">شرائح محفوظة بالنظام</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E4DF] shadow-xs">
          <p className="text-xs font-bold text-emerald-700">الشرائح المفعلة حالياً</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{activeSlides.length}</p>
          <span className="text-[11px] text-[#A8A29E] mt-0.5 block">تظهر للزوار بالمتجر</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E4DF] shadow-xs">
          <p className="text-xs font-bold text-amber-700">الشرائح المعطلة / المسودة</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{slides.length - activeSlides.length}</p>
          <span className="text-[11px] text-[#A8A29E] mt-0.5 block">مخفية مؤقتاً عن الزوار</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E4DF] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#78716C]">شاهد واجهة المتجر</p>
            <Link 
              href="/" 
              target="_blank" 
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#13213c] hover:text-[#13213c] mt-2 underline"
            >
              <span>فتح المتجر المباشر</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F0F4F9] flex items-center justify-center text-[#13213c]">
            <Layers className="w-5 h-5 text-[#13213c]" />
          </div>
        </div>
      </div>

      {/* LIVE STOREFRONT SHOWCASE SIMULATOR (المحاكي التفاعلي المباشر) */}
      <AnimatePresence>
        {showPreview && currentPreviewSlide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-[#0c1424] p-6 sm:p-8 rounded-3xl border border-[#22385e]/40 text-white relative shadow-lg">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black text-[#7ea6e6]">
                    محاكي العرض التفاعلي الحي (Real-time Storefront Simulator)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <span>الشريحة {safePreviewIdx + 1} من {activeSlides.length} مفعلة</span>
                  <div className="flex items-center gap-1 ms-2">
                    <button
                      type="button"
                      onClick={() => setPreviewSlideIdx(prev => (prev === 0 ? activeSlides.length - 1 : prev - 1))}
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSlideIdx(prev => (prev === activeSlides.length - 1 ? 0 : prev + 1))}
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Showcase Card Mockup */}
              <div className="max-w-md mx-auto relative aspect-[4/5] sm:aspect-[1/1] rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-stone-900 group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPreviewSlide.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={currentPreviewSlide.image}
                      alt={currentPreviewSlide.title}
                      fill
                      sizes="500px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c1424]/95 via-[#0c1424]/30 to-transparent" />
                    
                    {/* Top Tag */}
                    {currentPreviewSlide.tag && (
                      <div className="absolute top-4 start-4 z-10">
                        <span className="inline-flex items-center gap-1.5 bg-white/95 px-3 py-1 rounded-full text-xs font-black text-[#1C1917] shadow-sm">
                          <Flame className="w-3.5 h-3.5 text-[#E85D75]" />
                          {currentPreviewSlide.tag}
                        </span>
                      </div>
                    )}

                    {/* Bottom Texts */}
                    <div className="absolute bottom-0 inset-x-0 p-6 z-10 text-start">
                      <h3 className="text-xl sm:text-2xl font-black text-white mb-1.5 drop-shadow-md">
                        {currentPreviewSlide.title}
                      </h3>
                      {currentPreviewSlide.subtitle && (
                        <p className="text-xs sm:text-sm text-white/80 mb-3 line-clamp-2">
                          {currentPreviewSlide.subtitle}
                        </p>
                      )}
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7ea6e6]">
                        <span>تصفح هذه المجموعة الآن</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Floating Mockup Badges */}
                <div className="hidden sm:flex items-center gap-2.5 absolute -top-3 -start-3 bg-white/95 text-[#1C1917] rounded-xl p-2.5 shadow-lg border border-[#E8E4DF] z-20">
                  <Award className="w-4 h-4 text-[#13213c]" />
                  <div className="text-[10px] font-black text-start">
                    <p className="text-[#78716C]">{settings?.heroBadgeTopSmall || 'جودة أصلية ومضمونة'}</p>
                    <p>{settings?.heroBadgeTopBold || 'ضمان استبدال واسترجاع'}</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2.5 absolute -bottom-3 -end-3 bg-white/95 text-[#1C1917] rounded-xl p-2.5 shadow-lg border border-[#E8E4DF] z-20">
                  <Gift className="w-4 h-4 text-[#E85D75]" />
                  <div className="text-[10px] font-black text-start">
                    <p className="text-[#78716C]">{settings?.heroBadgeBottomSmall || 'خدمة استثنائية'}</p>
                    <p>{settings?.heroBadgeBottomBold || 'تغليف مجاني مع كل طلب'}</p>
                  </div>
                </div>
              </div>

              {/* Dots indicator */}
              <div className="flex items-center justify-center gap-2 mt-6">
                {activeSlides.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setPreviewSlideIdx(idx)}
                    className={cn(
                      "h-2 rounded-full transition-all cursor-pointer",
                      idx === safePreviewIdx ? "w-8 bg-[#13213c]" : "w-2 bg-white/30 hover:bg-white/60"
                    )}
                  />
                ))}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SLIDES MANAGEMENT LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#1C1917] flex items-center gap-2">
            <span>قائمة الشرائح</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FAFAF8] border border-[#E8E4DF] text-[#78716C]">
              {slides.length} شريحة
            </span>
          </h2>
          <span className="text-xs text-[#78716C]">
            يمكنك سحب وترتيب الشرائح باستخدام الأسهم وتفعيلها أو إخفاؤها بنقرة واحدة
          </span>
        </div>

        {slides.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-[#E8E4DF] space-y-3">
            <ImageIcon className="w-12 h-12 mx-auto text-[#A8A29E] opacity-50" />
            <h3 className="text-base font-bold text-[#1C1917]">لا توجد أي شرائح حتى الآن</h3>
            <p className="text-xs text-[#78716C] max-w-sm mx-auto">
              قم بإنشاء الشريحة الأولى لسلايدر واجهة المتجر مع صورة راقية وعنوان جذاب.
            </p>
            <Button
              type="button"
              onClick={handleOpenCreate}
              className="h-10 px-5 rounded-xl font-black text-white text-xs cursor-pointer shadow-sm mt-2"
              style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
            >
              <Plus className="w-4 h-4 ms-1.5" />
              <span>إضافة أول شريحة</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {slides.map((slide, index) => (
              <div 
                key={slide.id}
                className={cn(
                  "p-5 sm:p-6 rounded-3xl bg-white border transition-all shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5",
                  slide.isActive 
                    ? "border-[#E8E4DF] hover:border-[#13213c]/50" 
                    : "border-dashed border-stone-300 bg-stone-50/60 opacity-80"
                )}
              >
                
                {/* Left side: Thumbnail + Info */}
                <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
                  
                  {/* Order Controls */}
                  <div className="flex flex-col items-center justify-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      className="w-8 h-8 rounded-lg bg-[#FAFAF8] hover:bg-[#F2EFE9] text-[#1C1917] disabled:opacity-20 flex items-center justify-center cursor-pointer transition-colors"
                      title="تحريك للأعلى"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-black text-[#13213c] px-2 py-0.5 rounded-md bg-[#F0F4F9]">
                      #{index + 1}
                    </span>
                    <button
                      type="button"
                      disabled={index === slides.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      className="w-8 h-8 rounded-lg bg-[#FAFAF8] hover:bg-[#F2EFE9] text-[#1C1917] disabled:opacity-20 flex items-center justify-center cursor-pointer transition-colors"
                      title="تحريك للأسفل"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-stone-100 border border-[#E8E4DF] shrink-0 group">
                    <img 
                      src={slide.image} 
                      alt={slide.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 start-1.5">
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                        {slide.tag || 'مميز'}
                      </span>
                    </div>
                  </div>

                  {/* Texts and Links */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-black text-[#1C1917] truncate">
                        {slide.title}
                      </h3>
                      {slide.isActive ? (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>معروضة بالواجهة</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-stone-200 text-stone-600 border border-stone-300 shrink-0">
                          معطلة / مسودة
                        </span>
                      )}
                    </div>

                    {slide.subtitle && (
                      <p className="text-xs text-[#78716C] line-clamp-1 leading-relaxed">
                        {slide.subtitle}
                      </p>
                    )}

                    <div className="flex items-center gap-3 pt-1 text-xs text-[#A8A29E] flex-wrap">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-[#FAFAF8] px-2 py-0.5 rounded-md border border-[#E8E4DF] text-[#78716C]" dir="ltr">
                        {slide.link}
                      </span>
                      <span className="text-[11px]">
                        الشارة: <strong className="text-[#1C1917]">{slide.tag || 'افتراضي'}</strong>
                      </span>
                    </div>
                  </div>

                </div>

                {/* Right side: Quick Toggle & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#F0ECE6] shrink-0">
                  
                  {/* Direct Active Switch */}
                  <div className="flex items-center gap-2 bg-[#FAFAF8] px-3 py-2 rounded-xl border border-[#E8E4DF]">
                    <span className="text-xs font-bold text-[#1C1917]">
                      {slide.isActive ? 'مفعل' : 'معطل'}
                    </span>
                    <Switch
                      checked={slide.isActive}
                      onCheckedChange={() => handleToggleStatus(slide)}
                    />
                  </div>

                  {/* Edit button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(slide)}
                    className="h-10 px-3.5 rounded-xl border-[#E8E4DF] text-[#1C1917] hover:bg-[#FAFAF8] font-bold text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#13213c]" />
                    <span>تعديل</span>
                  </Button>

                  {/* Delete button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSlideToDelete(slide)}
                    className="h-10 w-10 p-0 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                    title="حذف الشريحة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT SLIDE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-3xl border border-[#E8E4DF] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-[#E8E4DF] bg-[#FAFAF8] flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-[#1C1917]">
                    {editingSlide ? 'تعديل شريحة السلايدر' : 'إضافة شريحة عرض جديدة'}
                  </h3>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    قم بضبط وتخصيص صورة الشريحة والعناوين والشارة الترويجية ورابط التوجيه
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-stone-100 border border-[#E8E4DF] flex items-center justify-center text-[#78716C] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
                
                {/* 1. Image Upload & Preview Section */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-[#1C1917] block">
                    صورة الشريحة (Image) *
                  </Label>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    
                    {/* Image Preview */}
                    <div className="sm:col-span-4 relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-[#E8E4DF] flex items-center justify-center">
                      {formImage ? (
                        <img 
                          src={formImage} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-3 text-[#A8A29E]">
                          <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-40" />
                          <span className="text-[10px]">لا توجد صورة</span>
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                          <Loader2 className="w-6 h-6 animate-spin text-[#13213c] mb-1" />
                          <span className="text-xs font-bold">جاري الرفع...</span>
                        </div>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="sm:col-span-8 space-y-3">
                      <div>
                        <input
                          type="file"
                          id="slide-modal-file-input"
                          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleUploadImage(file)
                            e.target.value = ''
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('slide-modal-file-input')?.click()}
                          disabled={isUploading}
                          className="w-full h-11 rounded-xl border-[#13213c]/40 text-[#13213c] hover:bg-[#F0F4F9] font-bold text-xs cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Upload className="w-4 h-4 text-[#13213c]" />
                          <span>رفع صورة جديدة من جهازك مباشرة</span>
                        </Button>
                      </div>

                      <div>
                        <Label className="text-[11px] font-bold text-[#78716C] mb-1 block">أو أدخل رابط صورة مباشر (URL)</Label>
                        <Input
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="h-10 text-xs rounded-xl bg-[#FAFAF8] border-[#E8E4DF]"
                          dir="ltr"
                        />
                      </div>
                      <span className="text-[11px] text-[#A8A29E] block">
                        💡 يفضل رفع صور عمودية أو مربعة عالية الدقة (مثل 1000x1200 بكسل) لمظهر ملكي متناسق.
                      </span>
                    </div>

                  </div>
                </div>

                {/* 2. Slide Title & Subtitle */}
                <div className="space-y-4 pt-2 border-t border-[#F0ECE6]">
                  <div>
                    <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">
                      عنوان الشريحة الرئيسي *
                    </Label>
                    <Input
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="مثال: أطقم وساعات رجالية فاخرة"
                      className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm font-bold"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">
                      الوصف الفرعي للشريحة
                    </Label>
                    <Textarea
                      rows={2}
                      value={formSubtitle}
                      onChange={(e) => setFormSubtitle(e.target.value)}
                      placeholder="مثال: هدية تعبّر عن التقدير والرقي وتخلّد أجمل الذكريات"
                      className="rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-xs resize-none"
                    />
                  </div>
                </div>

                {/* 3. Tag & Suggestions */}
                <div className="space-y-2 pt-2 border-t border-[#F0ECE6]">
                  <Label className="text-xs font-bold text-[#1C1917] block">
                    شارة الشريحة (Badge/Tag)
                  </Label>
                  <Input
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    placeholder="مثال: الأكثر طلباً"
                    className="h-10 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-xs"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] text-[#78716C] font-bold">اقتراحات سريعة:</span>
                    {POPULAR_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setFormTag(tag)}
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all cursor-pointer",
                          formTag === tag
                            ? "bg-[#13213c] text-white border-[#13213c]"
                            : "bg-[#FAFAF8] text-[#78716C] border-[#E8E4DF] hover:bg-[#F2EFE9]"
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Link & Suggestions */}
                <div className="space-y-2 pt-2 border-t border-[#F0ECE6]">
                  <Label className="text-xs font-bold text-[#1C1917] block">
                    رابط الشريحة عند النقر
                  </Label>
                  <Input
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                    placeholder="/shop أو /category/men"
                    className="h-10 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-xs"
                    dir="ltr"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] text-[#78716C] font-bold">روابط جاهزة:</span>
                    {POPULAR_LINKS.map((item) => (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => setFormLink(item.path)}
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all cursor-pointer",
                          formLink === item.path
                            ? "bg-[#1C1917] text-white border-[#1C1917]"
                            : "bg-[#FAFAF8] text-[#78716C] border-[#E8E4DF] hover:bg-[#F2EFE9]"
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Active Status Switch */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]">
                  <div>
                    <p className="text-xs font-bold text-[#1C1917]">تفعيل وعرض الشريحة مباشرة</p>
                    <p className="text-[11px] text-[#78716C]">إذا تم التعطيل، ستبقى محفوظة في لوحة التحكم ولن تظهر للزوار</p>
                  </div>
                  <Switch
                    checked={formIsActive}
                    onCheckedChange={setFormIsActive}
                  />
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E4DF]">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="h-11 px-5 rounded-xl border-[#E8E4DF] text-xs font-bold cursor-pointer"
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending || isUploading}
                    className="h-11 px-7 rounded-xl font-black text-white text-xs cursor-pointer shadow-md"
                    style={{ background: 'linear-gradient(135deg, #22385e 0%, #13213c 100%)' }}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin ms-2" />
                        <span>جاري الحفظ...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 ms-2" />
                        <span>{editingSlide ? 'حفظ التعديلات' : 'إضافة الشريحة الآن'}</span>
                      </>
                    )}
                  </Button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {slideToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl border border-[#E8E4DF] shadow-2xl p-6 text-start space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#1C1917]">
                  هل أنت متأكد من حذف هذه الشريحة؟
                </h3>
                <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                  سيتم حذف الشريحة &quot;{slideToDelete.title}&quot; نهائياً من سلايدر واجهة المتجر ولن تظهر للزوار.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSlideToDelete(null)}
                  className="h-10 px-4 rounded-xl border-[#E8E4DF] text-xs font-bold cursor-pointer"
                >
                  تراجع
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isPending}
                  className="h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs cursor-pointer shadow-sm"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin ms-2" />
                  ) : (
                    <Trash2 className="w-4 h-4 ms-2" />
                  )}
                  <span>تأكيد الحذف</span>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
