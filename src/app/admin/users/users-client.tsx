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
import { Search, Filter, Download, MoreVertical, Eye, Ban, CheckCircle2, Shield, Edit, UserCog, User, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

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
    toast.success(`تم تحديث حالة المستخدم ${name}`)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12" 
      dir="rtl"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">إدارة المستخدمين</h1>
          <p className="text-slate-500 font-medium">نظام متكامل لإدارة فريق العمل والعملاء وتحديد الصلاحيات.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="bg-primary text-white hover:bg-primary/90 rounded-xl h-12 px-6 font-bold shadow-lg shadow-primary/20 transition-all"
            onClick={() => toast.info('قريباً: إضافة مستخدم جديد')}
          >
            <UserCog className="w-5 h-5 ml-2" />
            إضافة مستخدم
          </Button>
          <Button 
            onClick={handleExport}
            className="bg-primary/5 text-primary hover:bg-primary/10 rounded-xl h-12 px-6 font-bold transition-all shadow-none"
          >
            <Download className="w-5 h-5 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden rounded-[2.5rem] bg-white">
        
        {/* Toolbar */}
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="ابحث عن مستخدم بالاسم أو الإيميل..."
              className="pl-4 pr-12 bg-white border-slate-200 focus:border-primary focus-visible:ring-primary/20 h-14 rounded-2xl text-md shadow-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="w-full md:w-auto h-14 rounded-2xl px-6 text-slate-700 font-bold border-slate-200 hover:bg-slate-50 shadow-sm">
            <Filter className="w-5 h-5 ml-2 text-slate-500" />
            تصفية الصلاحيات
          </Button>
        </div>

        {/* Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[800px]">
              <TableHeader className="bg-slate-50 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-right font-bold text-slate-600 py-5 px-8">المستخدم</TableHead>
                  <TableHead className="text-right font-bold text-slate-600 py-5">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right font-bold text-slate-600 py-5">تاريخ الانضمام</TableHead>
                  <TableHead className="text-right font-bold text-slate-600 py-5">الدور (الصلاحية)</TableHead>
                  <TableHead className="text-right font-bold text-slate-600 py-5">الحالة</TableHead>
                  <TableHead className="text-center font-bold text-slate-600 py-5 px-8">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredUsers.map((user) => {
                    const RoleIcon = roleColors[user.role]?.icon || User;
                    return (
                      <motion.tr 
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0 group"
                      >
                        <TableCell className="px-8 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-700 flex items-center justify-center font-black text-lg shadow-sm border border-slate-200/50">
                              {user.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 text-md">{user.name}</span>
                              <span className="text-xs text-slate-400 font-medium">ID: #{user.id.substring(0, 8)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600 font-medium">{user.email}</TableCell>
                        <TableCell className="text-slate-500 font-medium">{user.joinedAt}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-2 w-max border-0 shadow-sm ${roleColors[user.role]?.bg || 'bg-slate-100'} ${roleColors[user.role]?.text || 'text-slate-700'}`}
                          >
                            <RoleIcon className="w-3.5 h-3.5" />
                            {roleColors[user.role]?.label || user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`px-4 py-1.5 rounded-full font-bold border-0 flex items-center gap-2 w-max shadow-sm ${
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
                          <DropdownMenu>
                            <DropdownMenuTrigger className="mx-auto h-10 w-10 p-0 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors flex items-center justify-center focus:outline-none">
                              <MoreVertical className="h-5 w-5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-slate-100 p-2">
                              <DropdownMenuLabel className="text-xs text-slate-400 font-bold px-2 py-1.5 uppercase tracking-wider">إدارة المستخدم</DropdownMenuLabel>
                              <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 hover:bg-slate-50 font-medium text-slate-700">
                                <Eye className="ml-3 h-4 w-4 text-primary" />
                                عرض التفاصيل
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 hover:bg-slate-50 font-medium text-slate-700">
                                <Edit className="ml-3 h-4 w-4 text-amber-500" />
                                تعديل الصلاحيات
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="my-2 bg-slate-100" />
                              <DropdownMenuItem 
                                className={`rounded-xl cursor-pointer py-2.5 font-bold ${user.status === 'نشط' ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                                onClick={() => handleToggleStatus(user.id, user.name)}
                              >
                                {user.status === 'نشط' ? (
                                  <>
                                    <Ban className="ml-3 h-4 w-4" />
                                    <span>حظر الحساب</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="ml-3 h-4 w-4" />
                                    <span>تفعيل الحساب</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>

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
    </motion.div>
  )
}
