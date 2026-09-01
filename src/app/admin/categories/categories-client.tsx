'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Plus, Search, Edit, Trash2, FolderTree } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
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

  const filteredCategories = categories.filter(cat => 
    cat.name.includes(searchQuery) || cat.slug.includes(searchQuery)
  )

  const openModal = (category?: Category) => {
    if (category) {
      setIsEditing(true)
      setCurrentCategory(category)
    } else {
      setIsEditing(false)
      setCurrentCategory({ name: '', slug: '', description: '', image: '' })
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

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      const res = await deleteCategory(id)
      if (res.success) {
        toast.success('تم حذف التصنيف بنجاح')
        setCategories(categories.filter(c => c.id !== id))
      } else {
        toast.error(res.error || 'حدث خطأ أثناء الحذف')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">التصنيفات</h1>
          <p className="text-sm text-slate-500 mt-1">إدارة أقسام المتجر وتصنيفات المنتجات</p>
        </div>
        <Button onClick={() => openModal()} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 rounded-xl px-6">
          <Plus className="w-5 h-5 ml-2" />
          إضافة تصنيف جديد
        </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              type="text" 
              placeholder="ابحث عن تصنيف..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-10 bg-white border-slate-200 rounded-xl focus-visible:ring-primary h-11"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 rounded-tr-2xl">التصنيف</th>
                <th className="px-6 py-4">الرابط (Slug)</th>
                <th className="px-6 py-4">عدد المنتجات</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4 rounded-tl-2xl">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.map((category) => (
                <motion.tr 
                  key={category.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden relative shrink-0">
                        {category.image ? (
                          <Image src={category.image} alt={category.name} fill className="object-cover" />
                        ) : (
                          <FolderTree className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{category.name}</div>
                        {category.description && (
                          <div className="text-xs text-slate-500 line-clamp-1 max-w-[200px] mt-0.5">{category.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dir-ltr text-right font-mono text-xs">
                    /{category.slug}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-lg px-2.5 py-1 font-bold">
                      {category._count?.products || 0} منتج
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {category.isActive ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 rounded-lg">نشط</Badge>
                    ) : (
                      <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-0 rounded-lg">معطل</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10" onClick={() => openModal(category)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(category.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    لا يوجد تصنيفات مطابقة لبحثك
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-0" dir="rtl">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <DialogTitle className="text-xl font-bold text-slate-800">
              {isEditing ? 'تعديل تصنيف' : 'إضافة تصنيف جديد'}
            </DialogTitle>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-slate-700">اسم التصنيف</Label>
              <Input 
                id="name" 
                value={currentCategory.name || ''} 
                onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})}
                required 
                className="h-12 rounded-xl border-slate-200 focus-visible:ring-primary bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-sm font-semibold text-slate-700">الرابط (Slug)</Label>
              <Input 
                id="slug" 
                value={currentCategory.slug || ''} 
                onChange={e => setCurrentCategory({...currentCategory, slug: e.target.value})}
                required 
                dir="ltr"
                className="h-12 rounded-xl border-slate-200 focus-visible:ring-primary bg-slate-50 focus:bg-white transition-colors font-mono text-left"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-semibold text-slate-700">رابط الصورة</Label>
              <Input 
                id="image" 
                value={currentCategory.image || ''} 
                onChange={e => setCurrentCategory({...currentCategory, image: e.target.value})}
                className="h-12 rounded-xl border-slate-200 focus-visible:ring-primary bg-slate-50 focus:bg-white transition-colors"
                dir="ltr"
                placeholder="https://..."
              />
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 gap-3 sm:justify-start flex-row-reverse">
              <Button type="submit" disabled={isSubmitting} className="rounded-xl h-12 px-8 bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20">
                {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6">
                إلغاء
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
