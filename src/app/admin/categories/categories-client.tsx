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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-[0_5px_30px_rgba(0,0,0,0.03)] border border-slate-100/50">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100/80 rounded-xl text-slate-600">
              <FolderTree className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight drop-shadow-sm">التصنيفات</h1>
          </div>
          <p className="text-slate-500 font-medium text-lg ms-1">إدارة أقسام المتجر وتصنيفات المنتجات.</p>
        </div>
        <Button onClick={() => openModal()} className="bg-[#050B14] hover:bg-[#0a1526] text-white shadow-[0_8px_20px_rgba(5,11,20,0.15)] rounded-xl px-5 h-10 font-bold transition-all w-full sm:w-auto border border-slate-800 text-sm">
          <Plus className="w-4 h-4 ms-2 text-amber-400" />
          إضافة تصنيف
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_5px_30px_rgba(0,0,0,0.03)] border border-slate-100/50 overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 md:p-6 border-b border-slate-100/50 bg-slate-50/30">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            <Input
              type="text"
              placeholder="ابحث عن تصنيف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-4 pe-10 bg-white border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 h-10 rounded-xl text-sm shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-start min-w-[700px]">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-start">التصنيف</th>
                  <th className="px-5 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-start">الرابط</th>
                  <th className="px-5 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-center">المنتجات</th>
                  <th className="px-5 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-start">الحالة</th>
                  <th className="px-5 py-4 font-bold text-slate-500 text-[11px] uppercase tracking-wider text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden relative shrink-0 border border-slate-100 shadow-sm group-hover:border-amber-200 transition-colors">
                          {category.image ? (
                            <Image src={category.image} alt={category.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <FolderTree className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-xs group-hover:text-amber-600 transition-colors">{category.name}</div>
                          {category.description && (
                            <div className="text-[10px] text-slate-400 line-clamp-1 max-w-[200px] mt-0.5 font-medium">{category.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="bg-slate-100/80 text-slate-500 px-2 py-1 rounded-md font-mono text-[11px] inline-block border border-slate-200/50 group-hover:border-amber-200 group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors">
                        <span className="opacity-50">/</span>{category.slug}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <Badge variant="secondary" className="bg-slate-100/80 text-slate-600 rounded-md px-2.5 py-1 font-bold shadow-none border border-slate-200/50 text-[11px]">
                        {category._count?.products || 0}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      {category.isActive ? (
                        <Badge className="bg-emerald-50 text-emerald-600 border-0 rounded-md px-2.5 py-1 font-semibold shadow-sm text-[11px]">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 me-1.5" />
                          نشط
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-600 border-0 rounded-md px-2.5 py-1 font-semibold shadow-sm text-[11px]">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 me-1.5" />
                          معطل
                        </Badge>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors border border-transparent hover:border-amber-100" onClick={() => openModal(category)}>
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100" onClick={() => setDeleteId(category.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCategories.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-4">
                        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-inner">
                          <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <span className="text-lg font-black text-slate-500">لا توجد تصنيفات مطابقة للبحث</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl p-0 overflow-hidden border border-slate-100 shadow-2xl" dir="rtl">
          <div className="px-6 py-5 border-b border-slate-100/50 bg-slate-50/30 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
              <FolderTree className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-slate-800">
                {isEditing ? 'تعديل التصنيف' : 'إضافة تصنيف'}
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-1 font-medium">أدخل البيانات الأساسية للتصنيف</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold text-slate-700">اسم التصنيف <span className="text-rose-500">*</span></Label>
              <Input
                id="name"
                value={currentCategory.name || ''}
                onChange={e => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                required
                className="h-10 rounded-lg border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all bg-slate-50/50 focus:bg-white shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-xs font-bold text-slate-700">الرابط (Slug) <span className="text-rose-500">*</span></Label>
              <Input
                id="slug"
                value={currentCategory.slug || ''}
                onChange={e => setCurrentCategory({ ...currentCategory, slug: e.target.value })}
                required
                dir="rtl"
                className="h-10 rounded-lg border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all bg-slate-50/50 focus:bg-white font-mono text-xs text-start shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-xs font-bold text-slate-700">رابط الصورة (اختياري)</Label>
              <div className="relative group">
                <ImageIcon className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                <Input
                  id="image"
                  value={currentCategory.image || ''}
                  onChange={e => setCurrentCategory({ ...currentCategory, image: e.target.value })}
                  className="h-10 pe-10 rounded-lg border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all bg-slate-50/50 focus:bg-white shadow-sm text-xs"
                  dir="rtl"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50/80 rounded-xl border border-slate-100">
              <Switch
                checked={currentCategory.isActive ?? true}
                onCheckedChange={(checked) => setCurrentCategory({ ...currentCategory, isActive: checked })}
                className="data-[state=checked]:bg-emerald-500"
              />
              <Label className="text-xs font-bold text-slate-700 cursor-pointer select-none" onClick={() => setCurrentCategory({ ...currentCategory, isActive: !currentCategory.isActive })}>
                تفعيل التصنيف وعرضه للعملاء
              </Label>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 gap-2 sm:justify-start flex-row">
              <Button type="submit" disabled={isSubmitting} className="rounded-xl h-10 px-6 bg-[#050B14] hover:bg-[#0a1526] text-white shadow-[0_8px_20px_rgba(5,11,20,0.15)] font-bold transition-all border border-slate-800 text-sm">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري الحفظ...
                  </span>
                ) : 'حفظ التغييرات'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl h-10 px-5 font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors text-sm">
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
