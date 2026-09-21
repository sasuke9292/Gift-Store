'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Plus, Search, Edit, Trash2, FolderTree, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { createCategory, updateCategory, deleteCategory } from '@/app/actions/admin/categories'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Switch } from '@/components/ui/switch'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  isActive: boolean
  _count?: {
    products: number
  }
  createdAt: Date
}

export default function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openModal = (category?: Category) => {
    if (category) {
      setIsEditing(true)
      setCurrentCategory(category)
    } else {
      setIsEditing(false)
      setCurrentCategory({ name: '', slug: '', description: '', image: '', isActive: true })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentCategory.name) {
      toast.error('يرجى إدخال اسم التصنيف')
      return
    }

    setIsSubmitting(true)

    try {
      if (isEditing && currentCategory.id) {
        const res = await updateCategory(currentCategory.id, {
          name: currentCategory.name,
          slug: currentCategory.slug || `cat-${Date.now()}`,
          description: currentCategory.description || undefined,
          image: currentCategory.image || undefined,
          isActive: currentCategory.isActive,
        })
        if (res.success) {
          toast.success('تم تحديث بيانات التصنيف بنجاح')
          setCategories(categories.map(c => c.id === currentCategory.id ? { ...c, ...res.data } : c))
          setIsModalOpen(false)
        } else {
          toast.error(res.error || 'حدث خطأ أثناء التحديث')
        }
      } else {
        const res = await createCategory({
          name: currentCategory.name || '',
          slug: currentCategory.slug || currentCategory.name.trim().toLowerCase().replace(/[\s\W-]+/g, '-') || `cat-${Date.now()}`,
          description: currentCategory.description || undefined,
          image: currentCategory.image || undefined,
        })
        if (res.success && res.data) {
          toast.success('تم إنشاء التصنيف الجديد بنجاح')
          setCategories([res.data as Category, ...categories])
          setIsModalOpen(false)
        } else {
          toast.error(res.error || 'حدث خطأ أثناء الإنشاء')
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    const res = await deleteCategory(deleteId)
    if (res.success) {
      toast.success('تم حذف التصنيف بنجاح')
      setCategories(categories.filter(c => c.id !== deleteId))
    } else {
      toast.error(res.error || 'حدث خطأ أثناء الحذف')
    }
    setIsDeleting(false)
    setDeleteId(null)
  }

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1C1917] tracking-tight">إدارة التصنيفات</h1>
          <p className="text-sm text-[#78716C] mt-1">
            إدارة أقسام وتصنيفات المنتجات لتسهيل تصفح المتجر على العملاء ({categories.length} تصنيف)
          </p>
        </div>
        <Button 
          onClick={() => openModal()} 
          className="text-white shadow-[0_4px_16px_rgba(201,169,110,0.35)] hover:-translate-y-0.5 rounded-xl px-5 h-11 font-bold transition-all w-full sm:w-auto text-sm cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
        >
          <Plus className="w-4 h-4 ms-2" />
          إضافة تصنيف جديد
        </Button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-[#E8E4DF] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-[#E8E4DF]">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute end-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E] group-focus-within:text-[#C9A96E] transition-colors" />
            <input
              type="text"
              placeholder="ابحث عن تصنيف بالاسم أو الرابط..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 ps-4 pe-10 bg-[#FAFAF8] border border-[#E8E4DF] hover:border-[#D5D0C9] focus:border-[#C9A96E]/50 focus:bg-white rounded-xl text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:ring-2 focus:ring-[#C9A96E]/15 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start min-w-[700px]">
            <thead className="bg-[#FAFAF8] border-b border-[#E8E4DF]">
              <tr>
                <th className="px-6 py-4 font-bold text-[#A8A29E] text-xs uppercase tracking-wider text-start">التصنيف</th>
                <th className="px-6 py-4 font-bold text-[#A8A29E] text-xs uppercase tracking-wider text-start">الرابط (Slug)</th>
                <th className="px-6 py-4 font-bold text-[#A8A29E] text-xs uppercase tracking-wider text-center">المنتجات</th>
                <th className="px-6 py-4 font-bold text-[#A8A29E] text-xs uppercase tracking-wider text-start">الحالة</th>
                <th className="px-6 py-4 font-bold text-[#A8A29E] text-xs uppercase tracking-wider text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DF]/60">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-[#FAFAF8] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-[#FAFAF8] flex items-center justify-center overflow-hidden relative shrink-0 border border-[#E8E4DF]">
                        {category.image ? (
                          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                        ) : (
                          <FolderTree className="w-5 h-5 text-[#A8A29E]" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-[#1C1917] text-sm group-hover:text-[#A07850] transition-colors">
                          {category.name}
                        </p>
                        {category.description && (
                          <p className="text-xs text-[#78716C] line-clamp-1 max-w-[240px] mt-0.5">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-[#FAFAF8] text-[#78716C] px-2.5 py-1 rounded-lg font-mono text-xs border border-[#E8E4DF]">
                      /{category.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-[#FAFAF8] text-[#1C1917] font-bold px-3 py-1 rounded-full border border-[#E8E4DF] text-xs">
                      {category._count?.products || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {category.isActive ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 font-bold text-xs inline-flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        نشط
                      </span>
                    ) : (
                      <span className="bg-stone-50 text-stone-600 border border-stone-200 rounded-full px-3 py-1 font-bold text-xs inline-flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                        معطل
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        className="w-9 h-9 rounded-xl text-[#78716C] hover:text-[#C9A96E] hover:bg-[#F5F0EA] border border-transparent hover:border-[#C9A96E]/30 transition-all flex items-center justify-center cursor-pointer" 
                        onClick={() => openModal(category)}
                        title="تعديل التصنيف"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="w-9 h-9 rounded-xl text-[#A8A29E] hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all flex items-center justify-center cursor-pointer" 
                        onClick={() => setDeleteId(category.id)}
                        title="حذف التصنيف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCategories.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-[#FAFAF8] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#E8E4DF]">
                <FolderTree className="w-8 h-8 text-[#A8A29E]" />
              </div>
              <h3 className="text-base font-bold text-[#1C1917] mb-1">لا توجد تصنيفات مطابقة</h3>
              <p className="text-sm text-[#78716C] max-w-sm mx-auto">لم نعثر على أي تصنيف يطابق كلمة البحث.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Category Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl bg-white border border-[#E8E4DF] shadow-2xl" dir="rtl">
          <form onSubmit={handleSubmit}>
            <DialogHeader className="p-6 bg-[#FAFAF8] border-b border-[#E8E4DF]">
              <DialogTitle className="text-xl font-black text-[#1C1917]">
                {isEditing ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
              </DialogTitle>
              <p className="text-xs text-[#78716C] mt-1">أدخل بيانات ومعلومات التصنيف</p>
            </DialogHeader>

            <div className="p-6 space-y-4">
              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">اسم التصنيف *</Label>
                <Input
                  required
                  value={currentCategory.name || ''}
                  onChange={(e) => setCurrentCategory({ 
                    ...currentCategory, 
                    name: e.target.value,
                    slug: currentCategory.slug || e.target.value.trim().toLowerCase().replace(/[\s\W-]+/g, '-')
                  })}
                  placeholder="مثال: هدايا رجالية"
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">الرابط المخصص (Slug)</Label>
                <Input
                  value={currentCategory.slug || ''}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, slug: e.target.value })}
                  placeholder="men-gifts"
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رابط صورة التصنيف</Label>
                <Input
                  value={currentCategory.image || ''}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  dir="ltr"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">وصف مختصر</Label>
                <Textarea
                  rows={3}
                  value={currentCategory.description || ''}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                  placeholder="وصف يساعد العملاء على فهم محتوى هذا القسم..."
                  className="rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm resize-none"
                />
              </div>

              {isEditing && (
                <div className="flex items-center justify-between p-3.5 bg-[#FAFAF8] rounded-xl border border-[#E8E4DF]">
                  <div>
                    <p className="text-xs font-bold text-[#1C1917]">حالة التفعيل</p>
                    <p className="text-[11px] text-[#78716C]">ظهور التصنيف في القائمة الرئيسية</p>
                  </div>
                  <Switch
                    checked={currentCategory.isActive ?? true}
                    onCheckedChange={(val) => setCurrentCategory({ ...currentCategory, isActive: val })}
                  />
                </div>
              )}
            </div>

            <DialogFooter className="p-5 bg-[#FAFAF8] border-t border-[#E8E4DF] flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
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
                  isEditing ? 'حفظ التعديلات' : 'إضافة التصنيف'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="هل أنت متأكد من حذف هذا التصنيف؟"
        description="سيتم حذف التصنيف نهائياً. تأكد من عدم ارتباط منتجات نشطة بهذا التصنيف."
        confirmText="حذف التصنيف"
        cancelText="إلغاء"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
