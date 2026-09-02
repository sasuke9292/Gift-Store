'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Plus, Search, Edit, Trash2, FolderTree, Image as ImageIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
      className="space-y-6 pb-12"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">التصنيفات</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">إدارة أقسام المتجر وتصنيفات المنتجات.</p>
        </div>
        <Button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 rounded-xl px-5 h-10 font-bold transition-all text-sm">
          <Plus className="w-4 h-4 ms-2" />
          إضافة تصنيف
        </Button>
      </div>

      <Card className="border-slate-100 shadow-sm overflow-hidden rounded-2xl bg-white">
        {/* Toolbar */}
        <div className="p-4 md:p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="ابحث عن تصنيف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pe-4 ps-11 bg-white border-slate-200 focus:border-indigo-500 focus-visible:ring-indigo-100 h-10 rounded-xl text-sm shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-end min-w-[700px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-600 text-sm">التصنيف</th>
                  <th className="px-6 py-4 font-bold text-slate-600 text-sm">الرابط</th>
                  <th className="px-6 py-4 font-bold text-slate-600 text-sm text-center">المنتجات</th>
                  <th className="px-6 py-4 font-bold text-slate-600 text-sm">الحالة</th>
                  <th className="px-6 py-4 font-bold text-slate-600 text-sm text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden relative shrink-0 border border-slate-100 shadow-sm group-hover:scale-105 transition-transform">
                          {category.image ? (
                            <Image src={category.image} alt={category.name} fill className="object-cover" />
                          ) : (
                            <FolderTree className="w-5 h-5 text-indigo-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{category.name}</div>
                          {category.description && (
                            <div className="text-xs text-slate-500 line-clamp-1 max-w-[200px] mt-0.5">{category.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-mono text-xs inline-block">
                        /{category.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-lg px-2.5 py-1 font-black shadow-none border-0 text-xs">
                        {category._count?.products || 0}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {category.isActive ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border-0 rounded-lg px-2.5 py-1 font-bold shadow-sm text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ms-2" />
                          نشط
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-50 text-rose-700 border-0 rounded-lg px-2.5 py-1 font-bold shadow-sm text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 ms-2" />
                          معطل
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => openModal(category)}>
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50" onClick={() => setDeleteId(category.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCategories.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                          <Search className="w-7 h-7 text-slate-300" />
                        </div>
                        <span className="text-base font-medium text-slate-500">لا توجد تصنيفات مطابقة</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-[2rem] p-0 overflow-hidden border-0 shadow-2xl" dir="rtl">
          <div className="px-7 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
              <FolderTree className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-slate-800">
                {isEditing ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">أدخل البيانات الأساسية للتصنيف</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-7 space-y-5 bg-white">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold text-slate-700">اسم التصنيف <span className="text-rose-500">*</span></Label>
              <Input
                id="name"
                value={currentCategory.name || ''}
                onChange={e => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                required
                className="h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-sm font-bold text-slate-700">الرابط (Slug) <span className="text-rose-500">*</span></Label>
              <Input
                id="slug"
                value={currentCategory.slug || ''}
                onChange={e => setCurrentCategory({ ...currentCategory, slug: e.target.value })}
                required
                dir="rtl"
                className="h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50 focus:bg-white font-mono text-sm text-end"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-bold text-slate-700">رابط الصورة (اختياري)</Label>
              <div className="relative">
                <ImageIcon className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="image"
                  value={currentCategory.image || ''}
                  onChange={e => setCurrentCategory({ ...currentCategory, image: e.target.value })}
                  className="h-11 ps-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50 focus:bg-white"
                  dir="rtl"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <Switch
                checked={currentCategory.isActive ?? true}
                onCheckedChange={(checked) => setCurrentCategory({ ...currentCategory, isActive: checked })}
                className="data-[state=checked]:bg-emerald-500"
              />
              <Label className="text-sm font-bold text-slate-700 cursor-pointer" onClick={() => setCurrentCategory({ ...currentCategory, isActive: !currentCategory.isActive })}>
                تفعيل التصنيف وعرضه للعملاء
              </Label>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 gap-3 sm:justify-start flex-row">
              <Button type="submit" disabled={isSubmitting} className="rounded-xl h-11 px-7 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 font-bold">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري الحفظ...
                  </span>
                ) : 'حفظ التغييرات'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl h-11 px-6 font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100">
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
