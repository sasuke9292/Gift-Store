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
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Download, MoreVertical, Eye, Ban, CheckCircle2, Shield, Edit, UserCog, User, Users } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

interface UserData {
  id: string
  name: string
  email: string
  joinedAt: string
  role: string
  status: string
}

const roleColors: Record<string, { bg: string, text: string, icon: any, label: string }> = {
  SUPER_ADMIN: { bg: 'bg-purple-100/80 border border-purple-200/50', text: 'text-purple-700', icon: Shield, label: 'مدير النظام' },
  ADMIN: { bg: 'bg-indigo-100/80 border border-indigo-200/50', text: 'text-indigo-700', icon: UserCog, label: 'مدير' },
  MANAGER: { bg: 'bg-blue-100/80 border border-blue-200/50', text: 'text-blue-700', icon: UserCog, label: 'مشرف' },
  CUSTOMER: { bg: 'bg-slate-100/80 border border-slate-200/50', text: 'text-slate-700', icon: User, label: 'عميل' },
  SALES: { bg: 'bg-emerald-100/80 border border-emerald-200/50', text: 'text-emerald-700', icon: UserCog, label: 'مبيعات' },
  WAREHOUSE: { bg: 'bg-amber-100/80 border border-amber-200/50', text: 'text-amber-700', icon: UserCog, label: 'مخازن' },
  SUPPORT: { bg: 'bg-cyan-100/80 border border-cyan-200/50', text: 'text-cyan-700', icon: UserCog, label: 'دعم فني' },
  EDITOR: { bg: 'bg-pink-100/80 border border-pink-200/50', text: 'text-pink-700', icon: UserCog, label: 'محرر' },
}

export default function UsersClient({ initialUsers }: { initialUsers: UserData[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [toggleStatusUser, setToggleStatusUser] = useState<UserData | null>(null)

  const filteredUsers = users.filter(
    u => u.name.toLowerCase().includes(search.toLowerCase()) || 
         u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleExport = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'جاري تجهيز بيانات المستخدمين...',
        success: 'تم تصدير البيانات بنجاح كملف CSV',
        error: 'حدث خطأ أثناء التصدير',
      }
    )
  }

  const handleToggleStatus = (id: string) => {
    const user = users.find(u => u.id === id)
    if (user) setToggleStatusUser(user)
  }

  const handleEditRole = (user: UserData) => {
    setSelectedUser(user)
    setIsEditOpen(true)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditOpen(false)
    toast.success('تم حفظ التعديلات بنجاح')
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12" 
      dir="rtl"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-[#0A1628] border border-white/[0.05] p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <h1 className="text-xl font-black text-white/85 tracking-tight">فريق العمل (المستخدمين)</h1>
          </div>
          <p className="text-white/35 font-medium text-sm ms-10">إدارة صلاحيات الوصول لأعضاء الفريق والمديرين بكفاءة.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            className="bg-amber-500 hover:bg-amber-400 text-[#030810] rounded-xl h-9 px-5 font-bold shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all w-full sm:w-auto text-sm"
            onClick={() => toast.info('قريباً: إضافة مستخدم جديد')}
          >
            <UserCog className="w-4 h-4 ms-1.5" />
            إضافة مستخدم
          </Button>
          <Button 
            onClick={handleExport}
            className="bg-white/[0.04] hover:bg-white/[0.08] text-white/70 border border-white/[0.08] hover:border-white/[0.15] rounded-xl h-9 px-5 font-bold transition-all shadow-sm w-full sm:w-auto text-sm"
          >
            <Download className="w-4 h-4 ms-1.5 text-white/40" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-[#0A1628] rounded-2xl border border-white/[0.05] overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute end-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 group-focus-within:text-amber-500 transition-colors" />
            <input
              placeholder="ابحث عن مستخدم بالاسم أو الإيميل..."
              className="w-full h-9 ps-3 pe-9 bg-white/[0.04] border border-white/[0.07] hover:border-white/[0.12] focus:border-amber-500/50 rounded-xl text-sm text-white/70 placeholder:text-white/25 outline-none focus:ring-2 focus:ring-amber-500/10 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="w-full md:w-auto h-9 rounded-xl px-4 text-white/60 font-bold border border-white/[0.08] hover:bg-white/[0.04] hover:text-white/90 transition-colors shadow-sm text-sm flex items-center justify-center">
            <Filter className="w-3.5 h-3.5 ms-1.5 opacity-70" />
            تصفية الصلاحيات
          </button>
        </div>

        {/* Table */}
        <div className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-start">
            <thead className="border-b border-white/[0.05]">
              <tr>
                <th className="text-start font-bold text-white/30 py-3 px-5 text-[10px] uppercase tracking-widest">المستخدم</th>
                <th className="text-start font-bold text-white/30 py-3 px-5 text-[10px] uppercase tracking-widest">البريد الإلكتروني</th>
                <th className="text-start font-bold text-white/30 py-3 px-5 text-[10px] uppercase tracking-widest">الدور (الصلاحية)</th>
                <th className="text-start font-bold text-white/30 py-3 px-5 text-[10px] uppercase tracking-widest">تاريخ الانضمام</th>
                <th className="text-start font-bold text-white/30 py-3 px-5 text-[10px] uppercase tracking-widest">الحالة</th>
                <th className="text-center font-bold text-white/30 py-3 px-5 text-[10px] uppercase tracking-widest">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
                {filteredUsers.map((user) => {
                  const RoleIcon = roleColors[user.role]?.icon || User;
                  return (
                    <tr 
                      key={user.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white/[0.05] text-white/60 flex items-center justify-center font-bold text-sm border border-white/[0.08] group-hover:bg-amber-500/10 group-hover:text-amber-400 group-hover:border-amber-500/20 transition-colors">
                            {user.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-white/80 text-sm group-hover:text-amber-400 transition-colors">{user.name}</span>
                            <span className="text-[10px] text-white/40 font-mono mt-0.5 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.05] inline-flex w-max">
                              <span className="opacity-40">#</span>{user.id.substring(0, 8)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="text-white/60 font-medium text-xs px-5 py-3" dir="rtl">{user.email}</td>
                      <td className="px-5 py-3">
                        <span 
                          className={`px-2 py-0.5 rounded font-bold flex items-center gap-1.5 w-max text-[11px] bg-white/[0.05] text-white/60 border border-white/[0.08]`}
                        >
                          <RoleIcon className="w-3 h-3" />
                          {roleColors[user.role]?.label || user.role}
                        </span>
                      </td>
                      <td className="text-white/40 font-medium text-xs px-5 py-3">{user.joinedAt}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-0.5 rounded font-bold border border-white/[0.08] flex items-center gap-1.5 w-max text-[11px] ${
                            user.status === 'نشط'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-white/[0.05] text-white/40'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'نشط' ? 'bg-emerald-400' : 'bg-white/30'}`} />
                          {user.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            className="w-8 h-8 rounded-lg text-white/30 hover:text-amber-400 hover:bg-amber-500/10 transition-colors flex items-center justify-center"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsDetailsOpen(true)
                            }}
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          <button 
                            className="w-8 h-8 rounded-lg text-white/30 hover:text-amber-400 hover:bg-amber-500/10 transition-colors flex items-center justify-center"
                            onClick={() => handleEditRole(user)}
                            title="تعديل المستخدم"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <DropdownMenu>
                            <DropdownMenuTrigger className="h-8 w-8 p-0 text-white/30 hover:text-white/80 hover:bg-white/[0.05] rounded-lg transition-colors flex items-center justify-center focus:outline-none">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-2xl border-white/10 bg-[#0A1628] p-1.5">
                              <DropdownMenuLabel className="text-[10px] text-white/30 font-bold px-2 py-1.5 uppercase tracking-widest">إدارة إضافية</DropdownMenuLabel>
                              <DropdownMenuItem 
                                className={`rounded-lg cursor-pointer py-2 font-bold mt-1 text-xs ${user.status === 'نشط' ? 'text-rose-400 focus:text-rose-300 focus:bg-rose-500/10' : 'text-emerald-400 focus:text-emerald-300 focus:bg-emerald-500/10'}`}
                                onClick={() => handleToggleStatus(user.id)}
                              >
                                {user.status === 'نشط' ? (
                                  <>
                                    <Ban className="ms-2 h-3.5 w-3.5" />
                                    <span>حظر الحساب</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="ms-2 h-3.5 w-3.5" />
                                    <span>تفعيل الحساب</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                    )
                  })}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-14 h-14 bg-white/[0.04] border border-white/[0.06] rounded-xl flex items-center justify-center">
                          <Search className="w-6 h-6 text-white/20" />
                        </div>
                        <span className="font-bold text-white/30 text-sm">لا يوجد مستخدم يطابق بحثك</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-2xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] bg-[#0A1628]" dir="rtl">
          {selectedUser && (
            <>
              <div className="bg-white/[0.02] p-6 text-center relative border-b border-white/[0.05]">
                <div className="w-14 h-14 bg-white/[0.05] border border-white/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl font-black text-amber-400 shadow-lg">
                  {selectedUser.name.charAt(0)}
                </div>
                <h2 className="text-lg font-black text-white/85">{selectedUser.name}</h2>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full font-bold text-[11px] border border-white/[0.08] shadow-sm ${selectedUser.status === 'نشط' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/[0.05] text-white/40'}`}>
                  {selectedUser.status}
                </span>
              </div>

              <div className="p-5 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.05] bg-white/[0.02]">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                      <UserCog className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-0.5">الدور والصلاحية</p>
                      <p className="font-bold text-white/75 text-xs">{roleColors[selectedUser.role]?.label || selectedUser.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100/80 bg-slate-50/50">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                      <Shield className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-0.5">البريد الإلكتروني</p>
                      <p className="font-bold text-white/85 text-xs" dir="rtl">{selectedUser.email}</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full h-10 rounded-xl font-bold text-sm bg-white/[0.04] hover:bg-white/[0.08] text-white/70 shadow-sm transition-all border border-white/[0.08]" onClick={() => setIsDetailsOpen(false)}>
                  إغلاق
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[480px] p-6 rounded-2xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] bg-[#0A1628]" dir="rtl">
          <div className="mb-4">
            <h2 className="text-xl font-black text-white/85">تعديل بيانات المستخدم</h2>
            <p className="text-[11px] text-white/40 mt-1 font-medium">قم بتحديث معلومات الحساب، الصلاحيات، أو كلمة المرور.</p>
          </div>

          {selectedUser && (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50">اسم المستخدم</label>
                <input defaultValue={selectedUser.name} className="w-full h-9 px-3 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 rounded-lg text-sm text-white/80 placeholder:text-white/20 outline-none focus:ring-2 focus:ring-amber-500/10 transition-all shadow-sm" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50">البريد الإلكتروني</label>
                <input defaultValue={selectedUser.email} dir="rtl" className="w-full h-9 px-3 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 rounded-lg text-sm text-white/80 placeholder:text-white/20 outline-none focus:ring-2 focus:ring-amber-500/10 transition-all shadow-sm text-start" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50">تغيير كلمة المرور</label>
                <input type="password" placeholder="أدخل كلمة المرور الجديدة (اختياري)" dir="rtl" className="w-full h-9 px-3 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 rounded-lg text-sm text-white/80 placeholder:text-white/20 outline-none focus:ring-2 focus:ring-amber-500/10 transition-all shadow-sm text-start placeholder:text-end" />
                <p className="text-[10px] text-white/30 font-medium mt-1">اترك الحقل فارغاً إذا كنت لا ترغب بتغيير كلمة المرور.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/50">الصلاحية (الدور)</label>
                <select defaultValue={selectedUser.role} className="flex h-9 w-full items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.04] hover:border-white/[0.15] text-white/80 px-3 py-1.5 text-sm outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all shadow-sm">
                  {Object.entries(roleColors).map(([roleKey, roleValue]) => (
                    <option key={roleKey} value={roleKey} className="bg-[#0A1628]">{roleValue.label}</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <Button type="submit" className="flex-1 h-9 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-[#030810] shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all text-sm">
                  حفظ التعديلات
                </Button>
                <Button type="button" className="flex-1 h-9 rounded-xl font-bold text-white/50 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors shadow-sm text-sm" onClick={() => setIsEditOpen(false)}>
                  إلغاء
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!toggleStatusUser}
        onOpenChange={(open) => !open && setToggleStatusUser(null)}
        title={toggleStatusUser?.status === 'نشط' ? 'حظر المستخدم' : 'رفع الحظر'}
        description={toggleStatusUser?.status === 'نشط'
          ? `هل أنت متأكد من حظر حساب "${toggleStatusUser?.name}"؟ لن يتمكن من تسجيل الدخول.`
          : `هل تريد رفع الحظر عن حساب "${toggleStatusUser?.name}"؟`}
        confirmText={toggleStatusUser?.status === 'نشط' ? 'تأكيد الحظر' : 'رفع الحظر'}
        variant={toggleStatusUser?.status === 'نشط' ? 'danger' : 'info'}
        onConfirm={() => {
          if (toggleStatusUser) {
            setUsers(prev => prev.map(u => u.id === toggleStatusUser.id ? { ...u, status: u.status === 'نشط' ? 'محظور' : 'نشط' } : u))
            toast.success(`تم تحديث حالة حساب ${toggleStatusUser.name}`)
            setToggleStatusUser(null)
          }
        }}
      />
    </motion.div>
  )
}
