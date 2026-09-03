'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Plus, Search, Edit, Trash2, FolderTree, Image as ImageIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { toast } from 'sonner'
import { createCategory, updateCategory, deleteCategory } from '@/app/actions/admin/categories'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
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
    cat.name.includes(searchQuery) || cat.slug.includes(searchQuery)
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
    setIsSubmitting(true)

    try {
      if (isEditing && currentCategory.id) {
        const res = await updateCategory(currentCategory.id, {
          name: currentCategory.name,
          slug: currentCategory.slug,
          description: currentCategory.description || undefined,
          image: currentCategory.image || undefined,
          isActive: currentCategory.isActive,
        })
        if (res.success) {
          toast.success('تم تحديث التصنيف بنجاح')
          setCategories(categories.map(c => c.id === currentCategory.id ? { ...c, ...res.data } : c))
          setIsModalOpen(false)
        } else {
          toast.error(res.error || 'حدث خطأ')
        }
      } else {
        const res = await createCategory({
          name: currentCategory.name || '',
          slug: currentCategory.slug || '',
          description: currentCategory.description || undefined,
          image: currentCategory.image || undefined,
        })
        if (res.success && res.data) {
          toast.success('تم إنشاء التصنيف بنجاح')
          setCategories([res.data as Category, ...categories])
          setIsModalOpen(false)
        } else {
          toast.error(res.error || 'حدث خطأ')
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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-12"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0A1628] border border-white/[0.05] p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
              <FolderTree className="w-4 h-4 text-amber-400" />
            </div>
            <h1 className="text-xl font-black text-white/85 tracking-tight">التصنيفات</h1>
          </div>
          <p className="text-white/35 font-medium text-sm ms-10">إدارة أقسام المتجر وتصنيفات المنتجات.</p>
        </div>
        <Button onClick={() => openModal()} className="bg-amber-500 hover:bg-amber-400 text-[#030810] shadow-[0_4px_20px_rgba(245,158,11,0.3)] rounded-xl px-5 h-9 font-bold transition-all w-full sm:w-auto text-sm">
          <Plus className="w-4 h-4 ms-1.5" />
          إضافة تصنيف
        </Button>
      </div>

      <div className="bg-[#0A1628] rounded-2xl border border-white/[0.05] overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/[0.05]">
          <div className="relative w-full md:max-w-sm group">
            <Search className="absolute end-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 group-focus-within:text-amber-500 transition-colors" />
            <input
              type="text"
              placeholder="ابحث عن تصنيف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 ps-3 pe-9 bg-white/[0.04] border border-white/[0.07] hover:border-white/[0.12] focus:border-amber-500/50 rounded-xl text-sm text-white/70 placeholder:text-white/25 outline-none focus:ring-2 focus:ring-amber-500/10 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start min-w-[700px]">
            <thead className="border-b border-white/[0.05]">
              <tr>
                <th className="px-5 py-3 font-bold text-white/30 text-[10px] uppercase tracking-widest text-start">التصنيف</th>
                <th className="px-5 py-3 font-bold text-white/30 text-[10px] uppercase tracking-widest text-start">الرابط</th>
                <th className="px-5 py-3 font-bold text-white/30 text-[10px] uppercase tracking-widest text-center">المنتجات</th>
                <th className="px-5 py-3 font-bold text-white/30 text-[10px] uppercase tracking-widest text-start">الحالة</th>
                <th className="px-5 py-3 font-bold text-white/30 text-[10px] uppercase tracking-widest text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center overflow-hidden relative shrink-0 border border-white/[0.08] group-hover:border-amber-500/20 transition-colors">
                        {category.image ? (
                          <Image src={category.image} alt={category.name} fill className="object-cover" />
                        ) : (
                          <FolderTree className="w-4 h-4 text-white/20" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white/75 text-sm group-hover:text-amber-400 transition-colors">{category.name}</div>
                        {category.description && (
                          <div className="text-[10px] text-white/25 line-clamp-1 max-w-[200px] mt-0.5">{category.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="bg-white/[0.04] text-white/35 px-2 py-0.5 rounded font-mono text-[11px] border border-white/[0.06] group-hover:text-amber-400 group-hover:border-amber-500/20 transition-colors">
                      <span className="opacity-40">/</span>{category.slug}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className="bg-white/[0.06] text-white/50 rounded-md px-2.5 py-0.5 font-bold border border-white/[0.06] text-[11px]">
                      {category._count?.products || 0}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {category.isActive ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md px-2 py-0.5 font-bold text-[11px] flex items-center w-max gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        نشط
                      </span>
                    ) : (
                      <span className="bg-white/[0.05] text-white/35 border border-white/[0.08] rounded-md px-2 py-0.5 font-bold text-[11px] flex items-center w-max gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                        معطل
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="w-8 h-8 rounded-lg text-white/30 hover:text-amber-400 hover:bg-amber-500/10 transition-colors flex items-center justify-center" onClick={() => openModal(category)}>
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-8 h-8 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center justify-center" onClick={() => setDeleteId(category.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-14 h-14 bg-white/[0.04] border border-white/[0.06] rounded-xl flex items-center justify-center">
                        <Search className="w-6 h-6 text-white/20" />
                      </div>
                      <span className="font-bold text-white/30 text-sm">لا توجد تصنيفات مطابقة</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[460px] rounded-2xl p-0 overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] bg-[#0A1628]" dir="rtl">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <FolderTree className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <DialogTitle className="text-base font-black text-white/85">
                {isEditing ? 'تعديل التصنيف' : 'إضافة تصنيف'}
              </DialogTitle>
              <p className="text-[11px] text-white/30 mt-0.5">أدخل بيانات التصنيف</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-bold text-white/50">اسم التصنيف <span className="text-rose-400">*</span></Label>
              <input
                id="name"
                value={currentCategory.name || ''}
                onChange={e => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                required
                className="w-full h-9 px-3 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 rounded-lg text-sm text-white/80 placeholder:text-white/20 outline-none focus:ring-2 focus:ring-amber-500/10 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug" className="text-xs font-bold text-white/50">الرابط (Slug) <span className="text-rose-400">*</span></Label>
              <input
                id="slug"
                value={currentCategory.slug || ''}
                onChange={e => setCurrentCategory({ ...currentCategory, slug: e.target.value })}
                required
                dir="rtl"
                className="w-full h-9 px-3 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 rounded-lg text-sm text-white/80 placeholder:text-white/20 outline-none focus:ring-2 focus:ring-amber-500/10 transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="image" className="text-xs font-bold text-white/50">رابط الصورة (اختياري)</Label>
              <div className="relative">
                <ImageIcon className="absolute end-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                <input
                  id="image"
                  value={currentCategory.image || ''}
                  onChange={e => setCurrentCategory({ ...currentCategory, image: e.target.value })}
                  className="w-full h-9 ps-3 pe-9 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 rounded-lg text-sm text-white/80 placeholder:text-white/20 outline-none focus:ring-2 focus:ring-amber-500/10 transition-all"
                  dir="rtl"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
              <Switch
                checked={currentCategory.isActive ?? true}
                onCheckedChange={(checked) => setCurrentCategory({ ...currentCategory, isActive: checked })}
                className="data-[state=checked]:bg-emerald-500"
              />
              <Label className="text-xs font-bold text-white/50 cursor-pointer select-none" onClick={() => setCurrentCategory({ ...currentCategory, isActive: !currentCategory.isActive })}>
                تفعيل التصنيف وعرضه للعملاء
              </Label>
            </div>

            <DialogFooter className="pt-4 border-t border-white/[0.06] gap-2 sm:justify-start flex-row">
              <Button type="submit" disabled={isSubmitting} className="rounded-xl h-9 px-5 bg-amber-500 hover:bg-amber-400 text-[#030810] font-bold transition-all text-sm">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-[#030810]/30 border-t-[#030810] rounded-full animate-spin" />
                    جاري الحفظ...
                  </span>
                ) : 'حفظ التغييرات'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl h-9 px-4 font-bold text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors text-sm">
                إلغاء
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف التصنيف"
        description="هل أنت متأكد من حذف هذا التصنيف؟ ستبقى المنتجات المرتبطة به لكن بدون تصنيف."
        confirmText="حذف التصنيف"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </motion.div>
  )
}
