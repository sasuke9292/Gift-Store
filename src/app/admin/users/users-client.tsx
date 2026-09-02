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
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Download, MoreVertical, Eye, Ban, CheckCircle2, Shield, Edit, UserCog, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface UserData {
  id: string
  name: string
  email: string
  joinedAt: string
  role: string
  status: string
}

const roleColors: Record<string, { bg: string, text: string, icon: any, label: string }> = {
  SUPER_ADMIN: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Shield, label: 'مدير النظام' },
  ADMIN: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: UserCog, label: 'مدير' },
  MANAGER: { bg: 'bg-blue-100', text: 'text-blue-700', icon: UserCog, label: 'مشرف' },
  CUSTOMER: { bg: 'bg-slate-100', text: 'text-slate-700', icon: User, label: 'عميل' },
  SALES: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: UserCog, label: 'مبيعات' },
  WAREHOUSE: { bg: 'bg-amber-100', text: 'text-amber-700', icon: UserCog, label: 'مخازن' },
  SUPPORT: { bg: 'bg-cyan-100', text: 'text-cyan-700', icon: UserCog, label: 'دعم فني' },
  EDITOR: { bg: 'bg-pink-100', text: 'text-pink-700', icon: UserCog, label: 'محرر' },
}

export default function UsersClient({ initialUsers }: { initialUsers: UserData[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

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

  const handleToggleStatus = (id: string, name: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'نشط' ? 'محظور' : 'نشط' } : u))
    toast.success(`تم تحديث حالة الحساب للمستخدم ${name} بنجاح`)
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">فريق العمل (المستخدمين)</h1>
          <p className="text-slate-500 font-medium">إدارة صلاحيات الوصول لأعضاء الفريق والمديرين بكفاءة.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl h-12 px-6 font-bold shadow-lg shadow-indigo-600/20 transition-all"
            onClick={() => toast.info('قريباً: إضافة مستخدم جديد')}
          >
            <UserCog className="w-5 h-5 ms-2" />
            إضافة مستخدم
          </Button>
          <Button 
            onClick={handleExport}
            className="bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl h-12 px-6 font-bold transition-all shadow-none"
          >
            <Download className="w-5 h-5 ms-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="border-slate-100 shadow-sm overflow-hidden rounded-[2.5rem] bg-white">
        
        {/* Toolbar */}
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute end-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="ابحث عن مستخدم بالاسم أو الإيميل..."
              className="ps-4 pe-12 bg-white border-slate-200 focus:border-indigo-500 focus-visible:ring-indigo-100 h-14 rounded-2xl text-md shadow-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="w-full md:w-auto h-14 rounded-2xl px-6 text-slate-700 font-bold border-slate-200 hover:bg-slate-50 shadow-sm">
            <Filter className="w-5 h-5 ms-2 text-slate-500" />
            تصفية الصلاحيات
          </Button>
        </div>

        {/* Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[900px]">
              <TableHeader className="bg-slate-50 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-start font-bold text-slate-600 py-5 px-8">المستخدم</TableHead>
                  <TableHead className="text-start font-bold text-slate-600 py-5">البريد الإلكتروني</TableHead>
                  <TableHead className="text-start font-bold text-slate-600 py-5">الدور (الصلاحية)</TableHead>
                  <TableHead className="text-start font-bold text-slate-600 py-5">تاريخ الانضمام</TableHead>
                  <TableHead className="text-start font-bold text-slate-600 py-5">الحالة</TableHead>
                  <TableHead className="text-center font-bold text-slate-600 py-5 px-8">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  {filteredUsers.map((user) => {
                    const RoleIcon = roleColors[user.role]?.icon || User;
                    return (
                      <TableRow 
                        key={user.id}
                        className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0 group"
                      >
                        <TableCell className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg shadow-sm border border-indigo-100/50 group-hover:scale-105 transition-transform">
                              {user.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 text-md group-hover:text-indigo-600 transition-colors">{user.name}</span>
                              <span className="text-xs text-slate-400 font-mono mt-0.5">#{user.id.substring(0, 8)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600 font-medium" dir="ltr">{user.email}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-2 w-max border-0 shadow-sm ${roleColors[user.role]?.bg || 'bg-slate-100'} ${roleColors[user.role]?.text || 'text-slate-700'}`}
                          >
                            <RoleIcon className="w-3.5 h-3.5" />
                            {roleColors[user.role]?.label || user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-500 font-medium">{user.joinedAt}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`px-3 py-1.5 rounded-xl font-bold border-0 flex items-center gap-2 w-max shadow-sm ${
                              user.status === 'نشط'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${user.status === 'نشط' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-8 py-4 text-center">
                          <div className="flex items-center justify-center gap-2 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-9 h-9 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                              onClick={() => {
                                setSelectedUser(user)
                                setIsDetailsOpen(true)
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-9 h-9 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                              onClick={() => handleEditRole(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger className="h-9 w-9 p-0 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center focus:outline-none">
                                <MoreVertical className="h-4 w-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-slate-100 p-2">
                                <DropdownMenuLabel className="text-xs text-slate-400 font-bold px-2 py-1.5 uppercase tracking-wider">إدارة إضافية</DropdownMenuLabel>
                                <DropdownMenuItem 
                                  className={`rounded-xl cursor-pointer py-2.5 font-bold mt-1 ${user.status === 'نشط' ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                                  onClick={() => handleToggleStatus(user.id, user.name)}
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
                        <Search className="w-12 h-12 text-slate-200" />
                        <span className="text-lg font-medium text-slate-500">لا يوجد مستخدم يطابق بحثك</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl" dir="rtl">
          {selectedUser && (
            <>
              <div className="bg-slate-50/50 p-8 text-center relative border-b border-slate-100">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 text-4xl font-black text-indigo-600 shadow-xl shadow-indigo-600/10 border-4 border-white">
                  {selectedUser.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-black text-slate-800">{selectedUser.name}</h2>
                <Badge variant="outline" className={`mt-3 px-4 py-1.5 rounded-full font-bold border-0 shadow-sm ${selectedUser.status === 'نشط' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {selectedUser.status}
                </Badge>
              </div>

              <div className="p-8 space-y-6 bg-white">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                      <UserCog className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-0.5">الدور والصلاحية</p>
                      <p className="font-bold text-slate-800 text-sm">{roleColors[selectedUser.role]?.label || selectedUser.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                      <Shield className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-0.5">البريد الإلكتروني</p>
                      <p className="font-bold text-slate-800 text-sm" dir="ltr">{selectedUser.email}</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full h-14 rounded-2xl font-bold text-lg bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20" onClick={() => setIsDetailsOpen(false)}>
                  إغلاق
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] p-8 rounded-[2rem] border-0 shadow-2xl" dir="rtl">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-800">تعديل بيانات المستخدم</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">قم بتحديث معلومات الحساب، الصلاحيات، أو كلمة المرور.</p>
          </div>

          {selectedUser && (
            <form onSubmit={handleSaveEdit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">اسم المستخدم</label>
                <Input defaultValue={selectedUser.name} className="h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50 focus:bg-white" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">البريد الإلكتروني</label>
                <Input defaultValue={selectedUser.email} dir="ltr" className="h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50 focus:bg-white text-start" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">تغيير كلمة المرور</label>
                <Input type="password" placeholder="أدخل كلمة المرور الجديدة (اختياري)" dir="ltr" className="h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50 focus:bg-white text-start placeholder:text-end" />
                <p className="text-xs text-slate-400 font-medium">اترك الحقل فارغاً إذا كنت لا ترغب بتغيير كلمة المرور.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">الصلاحية (الدور)</label>
                <select defaultValue={selectedUser.role} className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 focus:bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  {Object.entries(roleColors).map(([roleKey, roleValue]) => (
                    <option key={roleKey} value={roleKey}>{roleValue.label}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="submit" className="flex-1 h-12 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20">
                  حفظ التعديلات
                </Button>
                <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl font-bold text-slate-600" onClick={() => setIsEditOpen(false)}>
                  إلغاء
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
