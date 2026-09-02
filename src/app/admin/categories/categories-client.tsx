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

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التصنيف؟ ستبقى المنتجات المرتبطة به لكن بدون تصنيف.')) {
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12" 
      dir="rtl"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">التصنيفات</h1>
          <p className="text-slate-500 font-medium">إدارة أقسام المتجر وتصنيفات المنتجات وترتيبها.</p>
        </div>
        <Button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 rounded-xl px-6 h-12 font-bold transition-all">
          <Plus className="w-5 h-5 ms-2" />
          إضافة تصنيف جديد
        </Button>
      </div>

      <Card className="border-slate-100 shadow-sm overflow-hidden rounded-[2.5rem] bg-white">
        
        {/* Toolbar */}
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute end-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              type="text" 
              placeholder="ابحث عن تصنيف بالاسم أو الرابط..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-4 pe-12 bg-white border-slate-200 focus:border-indigo-500 focus-visible:ring-indigo-100 h-14 rounded-2xl text-md shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-start min-w-[800px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 font-bold text-slate-600">التصنيف</th>
                  <th className="px-8 py-5 font-bold text-slate-600">الرابط (Slug)</th>
                  <th className="px-8 py-5 font-bold text-slate-600 text-center">عدد المنتجات</th>
                  <th className="px-8 py-5 font-bold text-slate-600">الحالة</th>
                  <th className="px-8 py-5 font-bold text-slate-600 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {filteredCategories.map((category) => (
                    <tr 
                      key={category.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden relative shrink-0 border border-slate-100 shadow-sm group-hover:scale-105 transition-transform">
                            {category.image ? (
                              <Image src={category.image} alt={category.name} fill className="object-cover" />
                            ) : (
                              <FolderTree className="w-6 h-6 text-indigo-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{category.name}</div>
                            {category.description && (
                              <div className="text-sm text-slate-500 line-clamp-1 max-w-[250px] mt-0.5">{category.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl font-mono text-sm inline-block">
                          /{category.slug}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-xl px-3 py-1 font-black shadow-sm border-0">
                          {category._count?.products || 0}
                        </Badge>
                      </td>
                      <td className="px-8 py-5">
                        {category.isActive ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border-0 rounded-xl px-3 py-1.5 font-bold shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 me-2 ms-1" />
                            نشط
                          </Badge>
                        ) : (
                          <Badge className="bg-rose-50 text-rose-700 border-0 rounded-xl px-3 py-1.5 font-bold shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-rose-500 me-2 ms-1" />
                            معطل
                          </Badge>
                        )}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="flex items-center justify-center gap-2 transition-opacity">
                          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => openModal(category)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(category.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                {filteredCategories.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-4">
                        <Search className="w-12 h-12 text-slate-200" />
                        <span className="text-lg font-medium text-slate-500">لا توجد تصنيفات مطابقة لبحثك</span>
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
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-0 overflow-hidden border-0 shadow-2xl" dir="rtl">
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0">
              <FolderTree className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-slate-800">
                {isEditing ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
              </DialogTitle>
              <p className="text-sm text-slate-500 mt-1 font-medium">أدخل البيانات الأساسية للتصنيف</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-bold text-slate-700">اسم التصنيف <span className="text-rose-500">*</span></Label>
              <Input 
                id="name" 
                value={currentCategory.name || ''} 
                onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})}
                required 
                className="h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="slug" className="text-sm font-bold text-slate-700">الرابط (Slug) <span className="text-rose-500">*</span></Label>
              <Input 
                id="slug" 
                value={currentCategory.slug || ''} 
                onChange={e => setCurrentCategory({...currentCategory, slug: e.target.value})}
                required 
                dir="ltr"
                className="h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors font-mono text-start"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="image" className="text-sm font-bold text-slate-700">رابط الصورة (اختياري)</Label>
              <div className="relative">
                <ImageIcon className="absolute end-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  id="image" 
                  value={currentCategory.image || ''} 
                  onChange={e => setCurrentCategory({...currentCategory, image: e.target.value})}
                  className="h-12 pe-12 rounded-xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors"
                  dir="ltr"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <button
                 type="button"
                 onClick={() => setCurrentCategory({...currentCategory, isActive: !currentCategory.isActive})}
                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${currentCategory.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
               >
                 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${currentCategory.isActive ? '-translate-x-6' : '-translate-x-1'}`} />
               </button>
               <Label className="text-sm font-bold text-slate-700 cursor-pointer" onClick={() => setCurrentCategory({...currentCategory, isActive: !currentCategory.isActive})}>
                 تفعيل التصنيف وعرضه للعملاء
               </Label>
            </div>

            <DialogFooter className="pt-6 border-t border-slate-100 gap-3 sm:justify-start flex-row-reverse">
              <Button type="submit" disabled={isSubmitting} className="rounded-xl h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 font-bold w-full sm:w-auto">
                {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl h-12 px-6 font-bold w-full sm:w-auto text-slate-500 hover:text-slate-800 hover:bg-slate-100">
                إلغاء
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
