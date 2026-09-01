'use client'

import React, { useState } from 'react'
import { User, Role } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Shield, UserCircle, Key, Mail, MoreHorizontal, Edit, UserPlus, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { updateProfile, updateUserRole } from '@/app/actions/admin/users'

interface ProfileClientProps {
  currentUser: User | null
  initialStaffUsers: User[]
}

const roleMap: Record<Role, { label: string, color: string }> = {
  SUPER_ADMIN: { label: 'مدير عام', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  ADMIN: { label: 'مسؤول', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  MANAGER: { label: 'مدير فرع', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  SALES: { label: 'مبيعات', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  WAREHOUSE: { label: 'أمين مستودع', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  SUPPORT: { label: 'دعم فني', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  EDITOR: { label: 'محرر محتوى', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  CUSTOMER: { label: 'عميل', color: 'bg-slate-100 text-slate-700 border-slate-200' },
}

export default function ProfileClient({ currentUser, initialStaffUsers }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState('profile')
  const [users, setUsers] = useState(initialStaffUsers)
  
  // Profile State
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || ''
  })
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Role Edit State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newRole, setNewRole] = useState<Role>('ADMIN')
  const [isSavingRole, setIsSavingRole] = useState(false)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return
    setIsSavingProfile(true)
    const res = await updateProfile(currentUser.id, profileData)
    if (res.success) {
      toast.success('تم تحديث البيانات بنجاح')
    } else {
      toast.error(res.error)
    }
    setIsSavingProfile(false)
  }

  const openRoleModal = (user: User) => {
    setSelectedUser(user)
    setNewRole(user.role)
    setIsRoleModalOpen(true)
  }

  const handleSaveRole = async () => {
    if (!selectedUser) return
    setIsSavingRole(true)
    const res = await updateUserRole(selectedUser.id, newRole)
    if (res.success) {
      toast.success('تم تحديث الصلاحية بنجاح')
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u))
      setIsRoleModalOpen(false)
    } else {
      toast.error(res.error)
    }
    setIsSavingRole(false)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10" dir="rtl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">إعدادات الحساب والصلاحيات</h1>
        <p className="text-slate-500 mt-1.5 font-medium">إدارة ملفك الشخصي، إعدادات الأمان، وصلاحيات فريق العمل.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white p-1 rounded-2xl h-auto flex gap-1 shadow-sm border border-slate-100 w-full sm:w-auto">
          <TabsTrigger value="profile" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none text-slate-600 px-6 py-3 font-bold transition-all flex items-center gap-2 flex-1 sm:flex-none">
            <UserCircle className="w-5 h-5" />
            الملف الشخصي
          </TabsTrigger>
          <TabsTrigger value="team" className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none text-slate-600 px-6 py-3 font-bold transition-all flex items-center gap-2 flex-1 sm:flex-none">
            <Shield className="w-5 h-5" />
            فريق العمل والصلاحيات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 animate-in fade-in-50 zoom-in-[0.98]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* User Card */}
            <div className="md:col-span-1">
              <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
                <div className="h-24 bg-gradient-to-tr from-primary to-blue-400"></div>
                <div className="px-6 pb-6 pt-0 text-center relative -mt-12">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg mx-auto bg-slate-50">
                    <AvatarFallback className="bg-primary/10 text-primary font-black text-2xl">
                      {profileData.name ? profileData.name[0] : 'م'}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="mt-4 text-xl font-bold text-slate-800">{profileData.name || 'مدير النظام'}</h2>
                  <p className="text-sm text-slate-500">{profileData.email}</p>
                  
                  <div className="mt-6">
                    <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-4 py-1.5 rounded-full font-bold shadow-sm">
                      {roleMap[currentUser?.role || 'ADMIN']?.label}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>

            {/* Edit Form */}
            <div className="md:col-span-2 space-y-6">
              <Card className="rounded-2xl border-slate-100 shadow-sm">
                <CardHeader className="border-b border-slate-50 px-6 py-5">
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <UserCircle className="w-5 h-5 text-primary" />
                    المعلومات الشخصية
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700">الاسم الكامل</Label>
                      <div className="relative">
                        <UserCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input 
                          value={profileData.name} 
                          onChange={e => setProfileData({...profileData, name: e.target.value})}
                          className="h-12 pl-4 pr-10 bg-slate-50 border-slate-200 focus:border-primary focus:bg-white rounded-xl transition-all" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input 
                          type="email"
                          value={profileData.email} 
                          onChange={e => setProfileData({...profileData, email: e.target.value})}
                          className="h-12 pl-4 pr-10 bg-slate-50 border-slate-200 focus:border-primary focus:bg-white rounded-xl transition-all" 
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button type="submit" disabled={isSavingProfile} className="h-12 px-8 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all">
                        {isSavingProfile ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-100 shadow-sm">
                <CardHeader className="border-b border-slate-50 px-6 py-5 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <Key className="w-5 h-5 text-slate-400" />
                    الأمان وكلمة المرور
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                        <Lock className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">كلمة المرور</p>
                        <p className="text-sm text-slate-500">تم التحديث منذ شهرين</p>
                      </div>
                    </div>
                    <Button variant="outline" className="rounded-xl font-bold border-slate-200 hover:bg-slate-100">
                      تغيير كلمة المرور
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team" className="animate-in fade-in-50 zoom-in-[0.98]">
          <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-50 bg-white px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800">أعضاء الفريق</CardTitle>
                <p className="text-sm text-slate-500 mt-1">إدارة حسابات الموظفين وصلاحياتهم في لوحة التحكم.</p>
              </div>
              <Button className="h-11 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-sm">
                <UserPlus className="w-4 h-4 ml-2" />
                دعوة عضو جديد
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-right font-bold text-slate-700 h-14">المستخدم</TableHead>
                    <TableHead className="text-right font-bold text-slate-700 h-14">البريد الإلكتروني</TableHead>
                    <TableHead className="text-right font-bold text-slate-700 h-14">الصلاحية (الدور)</TableHead>
                    <TableHead className="text-right font-bold text-slate-700 h-14">تاريخ الانضمام</TableHead>
                    <TableHead className="text-center font-bold text-slate-700 h-14 w-24">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border border-slate-100">
                            <AvatarFallback className="bg-primary/5 text-primary font-bold">
                              {user.name ? user.name[0] : 'م'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-bold text-slate-800">{user.name || 'بدون اسم'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-500 font-medium font-mono text-sm" dir="ltr">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge className={`px-3 py-1 text-xs font-bold rounded-lg border ${roleMap[user.role]?.color || roleMap.CUSTOMER.color}`}>
                          {roleMap[user.role]?.label || user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm font-medium">
                        {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu dir="rtl">
                          <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "h-9 w-9 p-0 rounded-xl hover:bg-slate-100" })}>
                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl shadow-slate-200/50 border-slate-100 p-1.5">
                            <DropdownMenuItem onClick={() => openRoleModal(user)} className="rounded-xl cursor-pointer p-2.5 font-medium text-slate-700 hover:text-primary focus:text-primary focus:bg-blue-50/50 transition-colors">
                              <Shield className="mr-2.5 h-4 w-4 text-slate-400" />
                              <span>تعديل الصلاحيات</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl cursor-pointer p-2.5 font-medium text-rose-600 hover:text-rose-700 focus:text-rose-700 focus:bg-rose-50 transition-colors mt-1">
                              <Lock className="mr-2.5 h-4 w-4" />
                              <span>إيقاف الحساب</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                        لا يوجد موظفين مسجلين في النظام.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Role Edit Modal */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-0 shadow-2xl" dir="rtl" showCloseButton={false}>
          <DialogHeader className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              تعديل صلاحية الموظف
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-5">
            {selectedUser && (
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Avatar className="w-12 h-12 border border-white shadow-sm">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {selectedUser.name ? selectedUser.name[0] : 'م'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-slate-800">{selectedUser.name}</p>
                  <p className="text-sm text-slate-500" dir="ltr">{selectedUser.email}</p>
                </div>
              </div>
            )}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700">اختر الصلاحية الجديدة</Label>
              <select 
                className="w-full h-12 px-4 rounded-xl bg-slate-50 border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-medium"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as Role)}
              >
                {Object.entries(roleMap).filter(([k]) => k !== 'CUSTOMER').map(([key, role]) => (
                  <option key={key} value={key}>{role.label}</option>
                ))}
              </select>
            </div>
            
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 font-medium flex gap-3 leading-relaxed">
              <Shield className="w-5 h-5 shrink-0 text-blue-500" />
              <p>منح صلاحيات أعلى قد يعطي الموظف حق الوصول لإعدادات حساسة في المتجر. يرجى التأكد قبل الحفظ.</p>
            </div>
          </div>
          <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
             <Button variant="ghost" onClick={() => setIsRoleModalOpen(false)} className="rounded-xl h-11 px-6 hover:bg-slate-200 text-slate-700 font-bold">
               إلغاء
             </Button>
             <Button onClick={handleSaveRole} disabled={isSavingRole} className="rounded-xl h-11 px-8 bg-primary hover:bg-primary/90 text-white font-bold shadow-sm">
               {isSavingRole ? 'جاري الحفظ...' : 'حفظ الصلاحية'}
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
