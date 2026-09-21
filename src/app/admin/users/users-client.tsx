'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Download, MoreVertical, Eye, Ban, CheckCircle2, Shield, Edit, UserCog, User, Users } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Label } from '@/components/ui/label'

interface UserData {
  id: string
  name: string
  email: string
  joinedAt: string
  role: string
  status: string
}

const roleColors: Record<string, { bg: string, text: string, border: string, icon: any, label: string }> = {
  SUPER_ADMIN: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: Shield, label: 'مدير النظام' },
  ADMIN: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: UserCog, label: 'مدير' },
  MANAGER: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: UserCog, label: 'مشرف' },
  CUSTOMER: { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200', icon: User, label: 'عميل' },
  SALES: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: UserCog, label: 'مبيعات' },
  WAREHOUSE: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: UserCog, label: 'مخازن' },
  SUPPORT: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', icon: UserCog, label: 'دعم فني' },
  EDITOR: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', icon: UserCog, label: 'محرر' },
}

export default function UsersClient({ initialUsers }: { initialUsers: UserData[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const [toggleStatusUser, setToggleStatusUser] = useState<UserData | null>(null)

  const filteredUsers = users.filter(
    u => u.name.toLowerCase().includes(search.toLowerCase()) || 
         u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleExport = () => {
    const headers = ['المعرف', 'الاسم', 'البريد الإلكتروني', 'الصلاحية', 'تاريخ الانضمام', 'الحالة']
    const csvRows = [
      headers.join(','),
      ...filteredUsers.map(u => [
        u.id,
        `"${u.name}"`,
        u.email,
        u.role,
        u.joinedAt,
        u.status
      ].join(','))
    ]
    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users-export-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('تم تصدير ملف المستخدمين بنجاح')
  }

  const handleToggleStatusConfirm = () => {
    if (!toggleStatusUser) return
    const newStatus = toggleStatusUser.status === 'نشط' ? 'محظور' : 'نشط'
    setUsers(users.map(u => u.id === toggleStatusUser.id ? { ...u, status: newStatus } : u))
    toast.success(`تم ${newStatus === 'نشط' ? 'تفعيل' : 'حظر'} حساب المستخدم بنجاح`)
    setToggleStatusUser(null)
  }

  const handleEditRole = (user: UserData) => {
    setSelectedUser(user)
    setSelectedRole(user.role)
    setIsEditOpen(true)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: selectedRole } : u))
    setIsEditOpen(false)
    toast.success('تم حفظ تعديل صلاحيات المستخدم بنجاح')
  }

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1C1917] tracking-tight">إدارة المستخدمين وفريق العمل</h1>
          <p className="text-sm text-[#78716C] mt-1">
            إدارة صلاحيات الوصول وأدوار المشرفين والمستخدمين المسجلين في المتجر
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button 
            onClick={handleExport}
            variant="outline"
            className="h-11 px-4 rounded-xl border-[#E8E4DF] bg-white hover:bg-[#FAFAF8] text-[#1C1917] font-bold text-sm shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#C9A96E]" />
            تصدير CSV
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl border border-[#E8E4DF] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-[#E8E4DF] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute end-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E] group-focus-within:text-[#C9A96E] transition-colors" />
            <input
              placeholder="ابحث بالاسم أو البريد الإلكتروني..."
              className="w-full h-11 ps-4 pe-10 bg-[#FAFAF8] border border-[#E8E4DF] hover:border-[#D5D0C9] focus:border-[#C9A96E]/50 focus:bg-white rounded-xl text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:ring-2 focus:ring-[#C9A96E]/15 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-start">
            <thead className="bg-[#FAFAF8] border-b border-[#E8E4DF]">
              <tr>
                <th className="text-start font-bold text-[#A8A29E] py-4 px-6 text-xs uppercase tracking-wider">المستخدم</th>
                <th className="text-start font-bold text-[#A8A29E] py-4 px-6 text-xs uppercase tracking-wider">البريد الإلكتروني</th>
                <th className="text-start font-bold text-[#A8A29E] py-4 px-6 text-xs uppercase tracking-wider">الدور (الصلاحية)</th>
                <th className="text-start font-bold text-[#A8A29E] py-4 px-6 text-xs uppercase tracking-wider">تاريخ الانضمام</th>
                <th className="text-start font-bold text-[#A8A29E] py-4 px-6 text-xs uppercase tracking-wider">الحالة</th>
                <th className="text-center font-bold text-[#A8A29E] py-4 px-6 text-xs uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DF]/60">
              {filteredUsers.map((user) => {
                const roleConfig = roleColors[user.role] || roleColors['CUSTOMER']
                const RoleIcon = roleConfig.icon
                return (
                  <tr key={user.id} className="hover:bg-[#FAFAF8] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm"
                          style={{ background: 'linear-gradient(135deg, #FBF6EE 0%, #F5EDE0 100%)', color: '#A07850', border: '1px solid rgba(201,169,110,0.2)' }}
                        >
                          {user.name ? user.name.charAt(0) : 'م'}
                        </div>
                        <div>
                          <p className="font-bold text-[#1C1917] text-sm group-hover:text-[#A07850] transition-colors">{user.name}</p>
                          <span className="text-[11px] text-[#A8A29E] font-mono">
                            #{user.id.substring(0, 8)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-[#78716C]" dir="ltr">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${roleConfig.bg} ${roleConfig.text} ${roleConfig.border}`}>
                        <RoleIcon className="w-3.5 h-3.5" />
                        {roleConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#78716C] font-medium">
                      {user.joinedAt}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        user.status === 'نشط' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'نشط' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button 
                          className="w-9 h-9 rounded-xl text-[#78716C] hover:text-[#C9A96E] hover:bg-[#F5F0EA] border border-transparent hover:border-[#C9A96E]/30 transition-all flex items-center justify-center cursor-pointer"
                          onClick={() => {
                            setSelectedUser(user)
                            setIsDetailsOpen(true)
                          }}
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button 
                          className="w-9 h-9 rounded-xl text-[#78716C] hover:text-[#C9A96E] hover:bg-[#F5F0EA] border border-transparent hover:border-[#C9A96E]/30 transition-all flex items-center justify-center cursor-pointer"
                          onClick={() => handleEditRole(user)}
                          title="تعديل الصلاحيات"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          className={`w-9 h-9 rounded-xl border border-transparent transition-all flex items-center justify-center cursor-pointer ${
                            user.status === 'نشط' 
                              ? 'text-[#A8A29E] hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200' 
                              : 'text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200'
                          }`}
                          onClick={() => setToggleStatusUser(user)}
                          title={user.status === 'نشط' ? 'حظر الحساب' : 'تفعيل الحساب'}
                        >
                          {user.status === 'نشط' ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-[#FAFAF8] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#E8E4DF]">
                <Users className="w-8 h-8 text-[#A8A29E]" />
              </div>
              <h3 className="text-base font-bold text-[#1C1917] mb-1">لا يوجد مستخدمون مطابقون</h3>
              <p className="text-sm text-[#78716C] max-w-sm mx-auto">لم نعثر على أي مستخدم يطابق كلمة البحث.</p>
            </div>
          )}
        </div>
      </div>

      {/* User Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl bg-white border border-[#E8E4DF] shadow-2xl" dir="rtl">
          {selectedUser && (
            <div>
              <DialogHeader className="p-6 bg-[#FAFAF8] border-b border-[#E8E4DF]">
                <DialogTitle className="text-xl font-black text-[#1C1917]">
                  تفاصيل المستخدم
                </DialogTitle>
                <p className="text-xs text-[#78716C] mt-1">معلومات الحساب والصلاحيات</p>
              </DialogHeader>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3.5 pb-4 border-b border-[#E8E4DF]">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #FBF6EE 0%, #F5EDE0 100%)', color: '#A07850', border: '1px solid rgba(201,169,110,0.2)' }}
                  >
                    {selectedUser.name ? selectedUser.name.charAt(0) : 'م'}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#1C1917]">{selectedUser.name}</h3>
                    <p className="text-xs text-[#78716C] font-mono" dir="ltr">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-[#A8A29E] font-bold uppercase mb-1">الدور الحالي</p>
                    <p className="font-bold text-[#1C1917]">{roleColors[selectedUser.role]?.label || selectedUser.role}</p>
                  </div>
                  <div>
                    <p className="text-[#A8A29E] font-bold uppercase mb-1">حالة الحساب</p>
                    <p className={`font-bold ${selectedUser.status === 'نشط' ? 'text-emerald-600' : 'text-rose-600'}`}>{selectedUser.status}</p>
                  </div>
                  <div>
                    <p className="text-[#A8A29E] font-bold uppercase mb-1">تاريخ الانضمام</p>
                    <p className="font-bold text-[#1C1917]">{selectedUser.joinedAt}</p>
                  </div>
                  <div>
                    <p className="text-[#A8A29E] font-bold uppercase mb-1">معرف المستخدم</p>
                    <p className="font-mono text-[#78716C]">#{selectedUser.id.substring(0, 10)}</p>
                  </div>
                </div>
              </div>
              <DialogFooter className="p-4 bg-[#FAFAF8] border-t border-[#E8E4DF]">
                <Button onClick={() => setIsDetailsOpen(false)} className="w-full h-10 rounded-xl bg-[#1C1917] text-white font-bold text-xs">
                  إغلاق
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl bg-white border border-[#E8E4DF] shadow-2xl" dir="rtl">
          <form onSubmit={handleSaveEdit}>
            <DialogHeader className="p-6 bg-[#FAFAF8] border-b border-[#E8E4DF]">
              <DialogTitle className="text-xl font-black text-[#1C1917]">
                تعديل الصلاحيات
              </DialogTitle>
              <p className="text-xs text-[#78716C] mt-1">تغيير دور وصلاحيات {selectedUser?.name}</p>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">اختر الدور الوظيفي</Label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#FAFAF8] border border-[#E8E4DF] text-sm text-[#1C1917] focus:outline-none focus:border-[#C9A96E]/50 focus:bg-white cursor-pointer"
                >
                  <option value="SUPER_ADMIN">مدير النظام (كامل الصلاحيات)</option>
                  <option value="ADMIN">مدير (إدارة الطلبات والمنتجات والمستخدمين)</option>
                  <option value="MANAGER">مشرف (إدارة المنتجات والتصنيفات والطلبات)</option>
                  <option value="SALES">مبيعات (إدارة الطلبات)</option>
                  <option value="EDITOR">محرر (تعديل المنتجات)</option>
                  <option value="CUSTOMER">عميل (حساب مستخدم عادي)</option>
                </select>
              </div>
            </div>
            <DialogFooter className="p-4 bg-[#FAFAF8] border-t border-[#E8E4DF] flex items-center justify-end gap-2.5">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="h-10 px-4 rounded-xl border-[#E8E4DF] text-xs font-bold">
                إلغاء
              </Button>
              <Button type="submit" className="h-10 px-5 rounded-xl text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}>
                حفظ التعديل
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Toggle Status Confirmation */}
      <ConfirmDialog
        open={!!toggleStatusUser}
        onOpenChange={(open) => !open && setToggleStatusUser(null)}
        title={toggleStatusUser?.status === 'نشط' ? 'هل أنت متأكد من حظر هذا المستخدم؟' : 'تفعيل حساب المستخدم'}
        description={toggleStatusUser?.status === 'نشط' 
          ? 'لن يتمكن المستخدم المحظور من تسجيل الدخول إلى لوحة التحكم أو إجراء أي عمليات.' 
          : 'سيتم استعادة صلاحيات الدخول للمستخدم بشكل طبيعي.'}
        confirmText={toggleStatusUser?.status === 'نشط' ? 'حظر الحساب' : 'تفعيل الحساب'}
        cancelText="إلغاء"
        variant={toggleStatusUser?.status === 'نشط' ? 'danger' : 'info'}
        onConfirm={handleToggleStatusConfirm}
      />
    </div>
  )
}
