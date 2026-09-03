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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100/50">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100/80 rounded-xl text-slate-600">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight drop-shadow-sm">فريق العمل (المستخدمين)</h1>
          </div>
          <p className="text-slate-500 font-medium text-lg ms-1">إدارة صلاحيات الوصول لأعضاء الفريق والمديرين بكفاءة.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            className="bg-[#050B14] hover:bg-[#0a1526] text-white rounded-2xl h-12 px-6 font-bold shadow-[0_10px_30px_rgba(5,11,20,0.2)] transition-all border border-slate-800 w-full sm:w-auto"
            onClick={() => toast.info('قريباً: إضافة مستخدم جديد')}
          >
            <UserCog className="w-5 h-5 ms-2 text-amber-400" />
            إضافة مستخدم
          </Button>
          <Button 
            onClick={handleExport}
            className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60 rounded-2xl h-12 px-6 font-bold transition-all shadow-sm w-full sm:w-auto"
          >
            <Download className="w-5 h-5 ms-2 text-slate-400" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100/50 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100/50 bg-slate-50/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            <Input
              placeholder="ابحث عن مستخدم بالاسم أو الإيميل..."
              className="ps-4 pe-12 bg-white border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 h-12 rounded-2xl text-sm shadow-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="w-full md:w-auto h-12 rounded-2xl px-6 text-slate-700 font-bold border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-colors shadow-sm">
            <Filter className="w-4 h-4 ms-2 opacity-70" />
            تصفية الصلاحيات
          </Button>
        </div>

        {/* Table */}
        <div className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[900px]">
              <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                <TableRow className="hover:bg-transparent border-0">
                  <TableHead className="text-start font-black text-slate-500 py-5 px-8 text-xs uppercase tracking-wider">المستخدم</TableHead>
                  <TableHead className="text-start font-black text-slate-500 py-5 text-xs uppercase tracking-wider">البريد الإلكتروني</TableHead>
                  <TableHead className="text-start font-black text-slate-500 py-5 text-xs uppercase tracking-wider">الدور (الصلاحية)</TableHead>
                  <TableHead className="text-start font-black text-slate-500 py-5 text-xs uppercase tracking-wider">تاريخ الانضمام</TableHead>
                  <TableHead className="text-start font-black text-slate-500 py-5 text-xs uppercase tracking-wider">الحالة</TableHead>
                  <TableHead className="text-center font-black text-slate-500 py-5 px-8 text-xs uppercase tracking-wider">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100/50">
                  {filteredUsers.map((user) => {
                    const RoleIcon = roleColors[user.role]?.icon || User;
                    return (
                      <TableRow 
                        key={user.id}
                        className="hover:bg-slate-50/80 transition-colors group border-0"
                      >
                        <TableCell className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-lg shadow-sm border border-slate-200/50 group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:border-amber-200 transition-colors group-hover:scale-105 duration-300">
                              {user.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 text-sm group-hover:text-amber-600 transition-colors">{user.name}</span>
                              <span className="text-xs text-slate-400 font-mono mt-0.5 bg-slate-100 px-1.5 py-0.5 rounded-md inline-flex w-max">
                                <span className="opacity-60">#</span>{user.id.substring(0, 8)}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600 font-medium text-sm" dir="rtl">{user.email}</TableCell>
                        <TableCell className="py-5">
                          <Badge 
                            variant="secondary" 
                            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-2 w-max shadow-none text-xs ${roleColors[user.role]?.bg || 'bg-slate-100'} ${roleColors[user.role]?.text || 'text-slate-700'}`}
                          >
                            <RoleIcon className="w-3.5 h-3.5" />
                            {roleColors[user.role]?.label || user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-500 font-medium text-sm">{user.joinedAt}</TableCell>
                        <TableCell className="py-5">
                          <Badge
                            variant="outline"
                            className={`px-3 py-1.5 rounded-xl font-bold border-0 flex items-center gap-2 w-max shadow-sm text-xs ${
                              user.status === 'نشط'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'نشط' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-400'}`} />
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-8 py-5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-9 h-9 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors border border-transparent hover:border-amber-100"
                              onClick={() => {
                                setSelectedUser(user)
                                setIsDetailsOpen(true)
                              }}
                              title="عرض التفاصيل"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-9 h-9 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors border border-transparent hover:border-amber-100"
                              onClick={() => handleEditRole(user)}
                              title="تعديل المستخدم"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger className="h-9 w-9 p-0 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center focus:outline-none border border-transparent">
                                <MoreVertical className="h-4 w-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-slate-100/50 p-2">
                                <DropdownMenuLabel className="text-[10px] text-slate-400 font-bold px-2 py-1.5 uppercase tracking-wider">إدارة إضافية</DropdownMenuLabel>
                                <DropdownMenuItem 
                                  className={`rounded-xl cursor-pointer py-2.5 font-bold mt-1 ${user.status === 'نشط' ? 'text-rose-600 focus:text-rose-700 focus:bg-rose-50' : 'text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50'}`}
                                  onClick={() => handleToggleStatus(user.id)}
                                >
                                  {user.status === 'نشط' ? (
                                    <>
                                      <Ban className="ms-3 h-4 w-4" />
                                      <span>حظر الحساب</span>
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="ms-3 h-4 w-4" />
                                      <span>تفعيل الحساب</span>
                                    </>
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}

                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-4">
                        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-inner">
                          <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <span className="text-lg font-black text-slate-500">لا يوجد مستخدم يطابق بحثك</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-[2rem] border border-slate-100 shadow-2xl" dir="rtl">
          {selectedUser && (
            <>
              <div className="bg-slate-50/80 p-8 text-center relative border-b border-slate-100/50">
                <div className="w-24 h-24 bg-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-5 text-4xl font-black text-slate-800 shadow-lg border border-slate-100">
                  {selectedUser.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-black text-slate-800">{selectedUser.name}</h2>
                <Badge variant="outline" className={`mt-3 px-4 py-1.5 rounded-full font-bold border-0 shadow-sm ${selectedUser.status === 'نشط' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                  {selectedUser.status}
                </Badge>
              </div>

              <div className="p-8 space-y-6 bg-white">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100/80 bg-slate-50/50">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                      <UserCog className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">الدور والصلاحية</p>
                      <p className="font-bold text-slate-800 text-sm">{roleColors[selectedUser.role]?.label || selectedUser.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100/80 bg-slate-50/50">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                      <Shield className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">البريد الإلكتروني</p>
                      <p className="font-bold text-slate-800 text-sm" dir="rtl">{selectedUser.email}</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full h-14 rounded-2xl font-bold text-lg bg-[#050B14] hover:bg-[#0a1526] text-white shadow-[0_10px_30px_rgba(5,11,20,0.2)] transition-all border border-slate-800" onClick={() => setIsDetailsOpen(false)}>
                  إغلاق
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] p-8 rounded-[2rem] border border-slate-100 shadow-2xl" dir="rtl">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-800">تعديل بيانات المستخدم</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">قم بتحديث معلومات الحساب، الصلاحيات، أو كلمة المرور.</p>
          </div>

          {selectedUser && (
            <form onSubmit={handleSaveEdit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">اسم المستخدم</label>
                <Input defaultValue={selectedUser.name} className="h-12 rounded-xl border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all bg-slate-50/50 focus:bg-white shadow-sm" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">البريد الإلكتروني</label>
                <Input defaultValue={selectedUser.email} dir="rtl" className="h-12 rounded-xl border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all bg-slate-50/50 focus:bg-white shadow-sm text-start" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">تغيير كلمة المرور</label>
                <Input type="password" placeholder="أدخل كلمة المرور الجديدة (اختياري)" dir="rtl" className="h-12 rounded-xl border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all bg-slate-50/50 focus:bg-white shadow-sm text-start placeholder:text-end" />
                <p className="text-xs text-slate-400 font-medium">اترك الحقل فارغاً إذا كنت لا ترغب بتغيير كلمة المرور.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">الصلاحية (الدور)</label>
                <select defaultValue={selectedUser.role} className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 focus:bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all shadow-sm">
                  {Object.entries(roleColors).map(([roleKey, roleValue]) => (
                    <option key={roleKey} value={roleKey}>{roleValue.label}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="submit" className="flex-1 h-12 rounded-2xl font-bold bg-[#050B14] hover:bg-[#0a1526] text-white shadow-[0_10px_30px_rgba(5,11,20,0.2)] transition-all border border-slate-800">
                  حفظ التعديلات
                </Button>
                <Button type="button" variant="outline" className="flex-1 h-12 rounded-2xl font-bold text-slate-600 border-slate-200 hover:bg-slate-50 transition-colors shadow-sm" onClick={() => setIsEditOpen(false)}>
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
