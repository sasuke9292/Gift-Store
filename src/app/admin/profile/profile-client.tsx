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
import { Shield, UserCircle, Key, Mail, MoreHorizontal, Edit, UserPlus, Lock, Trash2, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { updateProfile, createStaffUser, changePassword, updateStaffUser, deleteStaffUser } from '@/app/actions/admin/users'

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

  // Edit User State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    role: 'ADMIN' as Role,
    password: ''
  })
  
  // Delete User State
  const [isDeletingUser, setIsDeletingUser] = useState<string | null>(null)

  // Create User State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN' as Role
  })

  // Change Password State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')

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

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setEditUserData({
      name: user.name || '',
      email: user.email || '',
      role: user.role,
      password: ''
    })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return
    setIsSavingEdit(true)
    const res = await updateStaffUser(selectedUser.id, editUserData)
    if (res.success && res.data) {
      toast.success('تم تحديث بيانات المستخدم بنجاح')
      setUsers(users.map(u => u.id === selectedUser.id ? res.data : u))
      setIsEditModalOpen(false)
    } else {
      toast.error(res.error)
    }
    setIsSavingEdit(false)
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا المستخدم نهائياً؟')) {
      setIsDeletingUser(userId)
      const res = await deleteStaffUser(userId)
      if (res.success) {
        toast.success('تم حذف المستخدم بنجاح')
        setUsers(users.filter(u => u.id !== userId))
      } else {
        toast.error(res.error)
      }
      setIsDeletingUser(null)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserData.name || !newUserData.email) {
      toast.error('يرجى تعبئة جميع الحقول المطلوبة')
      return
    }
    
    setIsCreatingUser(true)
    const res = await createStaffUser(newUserData)
    if (res.success && res.data) {
      toast.success('تمت إضافة الموظف بنجاح')
      setUsers([res.data, ...users])
      setIsCreateModalOpen(false)
      setNewUserData({ name: '', email: '', password: '', role: 'ADMIN' })
    } else {
      toast.error(res.error)
    }
    setIsCreatingUser(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return
    if (newPassword.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    setIsChangingPassword(true)
    const res = await changePassword(currentUser.id, newPassword)
    if (res.success) {
      toast.success('تم تغيير كلمة المرور بنجاح')
      setIsPasswordModalOpen(false)
      setNewPassword('')
    } else {
      toast.error(res.error)
    }
    setIsChangingPassword(false)
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
                        <UserCircle className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input 
                          value={profileData.name} 
                          onChange={e => setProfileData({...profileData, name: e.target.value})}
                          className="h-12 ps-4 pe-10 bg-slate-50 border-slate-200 focus:border-primary focus:bg-white rounded-xl transition-all" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className="absolute end-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input 
                          type="email"
                          value={profileData.email} 
                          onChange={e => setProfileData({...profileData, email: e.target.value})}
                          className="h-12 ps-4 pe-10 bg-slate-50 border-slate-200 focus:border-primary focus:bg-white rounded-xl transition-all" 
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
                    <Button onClick={() => setIsPasswordModalOpen(true)} variant="outline" className="rounded-xl font-bold border-slate-200 hover:bg-slate-100">
                      تغيير كلمة المرور
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team" className="animate-in fade-in-50 zoom-in-[0.98]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">أعضاء الفريق ({users.length})</h2>
              <p className="text-sm text-slate-500 mt-1">إدارة حسابات الموظفين وصلاحياتهم في لوحة التحكم.</p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="h-11 px-6 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all">
              <UserPlus className="w-5 h-5 ms-2" />
              دعوة عضو جديد
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card key={user.id} className="rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden bg-white">
                <div className="h-20 bg-slate-50 border-b border-slate-100 relative">
                  <div className="absolute top-4 start-4">
                    <DropdownMenu dir="rtl">
                      <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "h-9 w-9 p-0 rounded-xl hover:bg-white bg-white/50 border border-slate-200" })}>
                        <MoreHorizontal className="h-4 w-4 text-slate-600" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl shadow-slate-200/50 border-slate-100 p-1.5">
                        <DropdownMenuItem onClick={() => openEditModal(user)} className="rounded-xl cursor-pointer p-2.5 font-medium text-slate-700 hover:text-primary focus:text-primary focus:bg-blue-50/50 transition-colors">
                          <Edit className="me-2.5 h-4 w-4 text-slate-400" />
                          <span>تعديل المستخدم</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={isDeletingUser === user.id}
                          className="rounded-xl cursor-pointer p-2.5 font-medium text-rose-600 hover:text-rose-700 focus:text-rose-700 focus:bg-rose-50 transition-colors mt-1"
                        >
                          <Trash2 className="me-2.5 h-4 w-4" />
                          <span>{isDeletingUser === user.id ? 'جاري الحذف...' : 'حذف الحساب'}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-0 text-center relative -mt-10">
                  <Avatar className="w-20 h-20 border-4 border-white shadow-sm mx-auto bg-slate-50 mb-3">
                    <AvatarFallback className="bg-primary/10 text-primary font-black text-xl">
                      {user.name ? user.name[0] : 'م'}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg text-slate-800">{user.name || 'بدون اسم'}</h3>
                  <p className="text-sm text-slate-500 font-mono mt-0.5" dir="ltr">{user.email}</p>
                  
                  <div className="mt-4 mb-4">
                    <Badge className={`px-4 py-1.5 rounded-full font-bold shadow-sm border ${roleMap[user.role]?.color || roleMap.CUSTOMER.color}`}>
                      {roleMap[user.role]?.label || user.role}
                    </Badge>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    انضم في {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                  </div>
                </div>
              </Card>
            ))}
            
            {users.length === 0 && (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700">لا يوجد أعضاء في الفريق</h3>
                <p className="text-slate-500 mt-2">ابدأ بإضافة موظفين ومدراء لنظامك من خلال الزر في الأعلى.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-0 shadow-2xl" dir="rtl" showCloseButton={false}>
          <DialogHeader className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              تعديل تفاصيل المستخدم
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEdit}>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">الاسم الكامل</Label>
                <Input 
                  value={editUserData.name}
                  onChange={(e) => setEditUserData({...editUserData, name: e.target.value})}
                  className="h-11 rounded-xl border-slate-200 focus:border-primary focus:bg-white bg-slate-50 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">البريد الإلكتروني</Label>
                <Input 
                  type="email"
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({...editUserData, email: e.target.value})}
                  dir="ltr"
                  className="h-11 rounded-xl border-slate-200 focus:border-primary focus:bg-white bg-slate-50 transition-colors text-start"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">الصلاحية (الدور)</Label>
                <select 
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-medium"
                  value={editUserData.role}
                  onChange={(e) => setEditUserData({...editUserData, role: e.target.value as Role})}
                >
                  {Object.entries(roleMap).filter(([k]) => k !== 'CUSTOMER').map(([key, role]) => (
                    <option key={key} value={key}>{role.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="pt-2">
                <Label className="text-sm font-semibold text-slate-700">تعيين كلمة مرور جديدة (اختياري)</Label>
                <Input 
                  type="password"
                  value={editUserData.password}
                  onChange={(e) => setEditUserData({...editUserData, password: e.target.value})}
                  placeholder="اتركه فارغاً لعدم التغيير"
                  dir="ltr"
                  className="h-11 rounded-xl border-slate-200 focus:border-primary focus:bg-white bg-slate-50 transition-colors text-start mt-2"
                />
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
               <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)} className="rounded-xl h-11 px-6 hover:bg-slate-200 text-slate-700 font-bold">
                 إلغاء
               </Button>
               <Button type="submit" disabled={isSavingEdit} className="rounded-xl h-11 px-8 bg-primary hover:bg-primary/90 text-white font-bold shadow-sm">
                 {isSavingEdit ? 'جاري الحفظ...' : 'حفظ التعديلات'}
               </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create User Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-0 shadow-2xl" dir="rtl" showCloseButton={false}>
          <DialogHeader className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              إضافة مدير أو موظف جديد
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateUser}>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">الاسم الكامل</Label>
                <Input 
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                  placeholder="مثال: أحمد محمد"
                  className="h-11 rounded-xl border-slate-200 focus:border-primary focus:bg-white bg-slate-50 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">البريد الإلكتروني</Label>
                <Input 
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                  placeholder="admin@example.com"
                  dir="ltr"
                  className="h-11 rounded-xl border-slate-200 focus:border-primary focus:bg-white bg-slate-50 transition-colors text-start"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">كلمة المرور الابتدائية</Label>
                <Input 
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                  placeholder="12345678 (افتراضي)"
                  dir="ltr"
                  className="h-11 rounded-xl border-slate-200 focus:border-primary focus:bg-white bg-slate-50 transition-colors text-start"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">الصلاحية (الدور)</Label>
                <select 
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-medium"
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({...newUserData, role: e.target.value as Role})}
                >
                  {Object.entries(roleMap).filter(([k]) => k !== 'CUSTOMER').map(([key, role]) => (
                    <option key={key} value={key}>{role.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
               <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="rounded-xl h-11 px-6 hover:bg-slate-200 text-slate-700 font-bold">
                 إلغاء
               </Button>
               <Button type="submit" disabled={isCreatingUser} className="rounded-xl h-11 px-8 bg-primary hover:bg-primary/90 text-white font-bold shadow-sm">
                 {isCreatingUser ? 'جاري الإضافة...' : 'إضافة الموظف'}
               </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-0 shadow-2xl" dir="rtl" showCloseButton={false}>
          <DialogHeader className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              تغيير كلمة المرور
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword}>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">كلمة المرور الجديدة</Label>
                <Input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الجديدة"
                  dir="ltr"
                  className="h-11 rounded-xl border-slate-200 focus:border-primary focus:bg-white bg-slate-50 transition-colors text-start"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
               <Button type="button" variant="ghost" onClick={() => setIsPasswordModalOpen(false)} className="rounded-xl h-11 px-6 hover:bg-slate-200 text-slate-700 font-bold">
                 إلغاء
               </Button>
               <Button type="submit" disabled={isChangingPassword} className="rounded-xl h-11 px-8 bg-primary hover:bg-primary/90 text-white font-bold shadow-sm">
                 {isChangingPassword ? 'جاري الحفظ...' : 'حفظ التغييرات'}
               </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
