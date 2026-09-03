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
import { Shield, UserCircle, Key, Mail, MoreHorizontal, Edit, UserPlus, Lock, Trash2, Calendar, UserCog } from 'lucide-react'
import { toast } from 'sonner'
import { updateProfile, createStaffUser, changePassword, updateStaffUser, deleteStaffUser } from '@/app/actions/admin/users'

interface ProfileClientProps {
  currentUser: User | null
  initialStaffUsers: User[]
}

const roleMap: Record<Role, { label: string, color: string }> = {
  SUPER_ADMIN: { label: 'مدير عام', color: 'bg-amber-100/80 text-amber-700 border-amber-200/50' },
  ADMIN: { label: 'مسؤول', color: 'bg-indigo-100/80 text-indigo-700 border-indigo-200/50' },
  MANAGER: { label: 'مدير فرع', color: 'bg-emerald-100/80 text-emerald-700 border-emerald-200/50' },
  SALES: { label: 'مبيعات', color: 'bg-blue-100/80 text-blue-700 border-blue-200/50' },
  WAREHOUSE: { label: 'أمين مستودع', color: 'bg-orange-100/80 text-orange-700 border-orange-200/50' },
  SUPPORT: { label: 'دعم فني', color: 'bg-cyan-100/80 text-cyan-700 border-cyan-200/50' },
  EDITOR: { label: 'محرر محتوى', color: 'bg-purple-100/80 text-purple-700 border-purple-200/50' }
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-[0_5px_30px_rgba(0,0,0,0.03)] border border-slate-100/50">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100/80 rounded-xl text-slate-600">
              <UserCog className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight drop-shadow-sm">إعدادات الحساب والصلاحيات</h1>
          </div>
          <p className="text-slate-500 font-medium text-lg ms-1">إدارة ملفك الشخصي، إعدادات الأمان، وصلاحيات فريق العمل.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-white p-1.5 border border-slate-100/50 shadow-sm rounded-xl w-full flex flex-col sm:flex-row h-auto gap-1">
          <TabsTrigger value="profile" className="flex-1 rounded-lg data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:shadow-sm py-2.5 px-3 text-xs font-bold text-slate-500 hover:text-slate-700 transition-all w-full sm:w-auto gap-1.5">
            <UserCircle className="w-4 h-4" />
            الملف الشخصي
          </TabsTrigger>
          <TabsTrigger value="team" className="flex-1 rounded-lg data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:shadow-sm py-2.5 px-3 text-xs font-bold text-slate-500 hover:text-slate-700 transition-all w-full sm:w-auto gap-1.5">
            <Shield className="w-4 h-4" />
            فريق العمل والصلاحيات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* User Profile Card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl border border-slate-100/50 shadow-[0_5px_30px_rgba(0,0,0,0.03)] overflow-hidden bg-white">
                <div className="h-28 bg-gradient-to-br from-[#050B14] to-slate-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 mix-blend-overlay"></div>
                </div>
                <div className="px-6 pb-6 pt-0 text-center relative -mt-12 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl bg-white overflow-hidden flex items-center justify-center relative">
                    <Avatar className="w-full h-full">
                      <AvatarFallback className="bg-slate-50 text-slate-700 font-black text-3xl">
                        {profileData.name ? profileData.name[0] : 'م'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h2 className="mt-4 text-xl font-black text-slate-800 tracking-tight">{profileData.name || 'مدير النظام'}</h2>
                  <p className="text-slate-500 font-mono text-xs mt-1">{profileData.email}</p>
                  
                  <div className="mt-5 w-full pt-5 border-t border-slate-100/50">
                    <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/50 px-4 py-1.5 rounded-lg font-bold shadow-sm text-xs">
                      <Shield className="w-3.5 h-3.5 ms-1.5" />
                      {roleMap[currentUser?.role || 'ADMIN']?.label}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-slate-100/50 shadow-[0_5px_30px_rgba(0,0,0,0.03)] overflow-hidden bg-white">
                <div className="p-6 border-b border-slate-100/50 bg-slate-50/30">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <UserCircle className="w-5 h-5 text-amber-500" />
                    المعلومات الشخصية
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">تحديث بياناتك الشخصية الأساسية.</p>
                </div>
                <div className="p-6">
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-700">الاسم الكامل</Label>
                        <div className="relative group">
                          <UserCircle className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                          <Input 
                            value={profileData.name} 
                            onChange={e => setProfileData({...profileData, name: e.target.value})}
                            className="h-10 ps-9 bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 focus:bg-white rounded-lg transition-all font-medium text-sm shadow-sm" 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-700">البريد الإلكتروني</Label>
                        <div className="relative group">
                          <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 group-focus-within:text-amber-500 transition-colors" />
                          <Input 
                            type="email"
                            value={profileData.email} 
                            onChange={e => setProfileData({...profileData, email: e.target.value})}
                            className="h-10 ps-9 pe-3 bg-slate-50/50 border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 focus:bg-white rounded-lg transition-all font-mono text-sm text-start shadow-sm" 
                            dir="rtl"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button type="submit" disabled={isSavingProfile} className="h-10 px-6 rounded-xl font-bold bg-[#050B14] hover:bg-[#0a1526] text-white shadow-[0_8px_20px_rgba(5,11,20,0.15)] transition-all w-full sm:w-auto border border-slate-800 text-sm">
                        {isSavingProfile ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100/50 shadow-[0_5px_30px_rgba(0,0,0,0.03)] overflow-hidden bg-white">
                <div className="p-6 border-b border-slate-100/50 bg-slate-50/30">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Key className="w-5 h-5 text-amber-500" />
                    الأمان وكلمة المرور
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">حماية حسابك بتغيير كلمة المرور بشكل دوري.</p>
                </div>
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-50/50 border border-slate-100/80 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                        <Lock className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">كلمة المرور</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">يُنصح بتحديث كلمة المرور الخاصة بك بانتظام.</p>
                      </div>
                    </div>
                    <Button onClick={() => setIsPasswordModalOpen(true)} variant="outline" className="h-10 px-5 rounded-xl font-bold border-slate-200 bg-white hover:bg-slate-50 hover:text-amber-700 hover:border-amber-200 transition-colors w-full sm:w-auto shadow-sm text-sm">
                      تحديث كلمة المرور
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team" className="animate-in fade-in-50 zoom-in-[0.98]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 p-1">
            <div>
              <h2 className="text-lg font-bold text-slate-800">أعضاء الفريق ({users.length})</h2>
              <p className="text-xs text-slate-500 mt-1">إدارة حسابات الموظفين وصلاحياتهم في لوحة التحكم.</p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="h-10 px-5 bg-[#050B14] hover:bg-[#0a1526] text-white rounded-xl font-bold shadow-[0_8px_20px_rgba(5,11,20,0.15)] border border-slate-800 transition-all text-sm">
              <UserPlus className="w-4 h-4 ms-2 text-amber-400" />
              دعوة عضو جديد
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {users.map((user) => (
              <div key={user.id} className="rounded-2xl border border-slate-100/50 shadow-[0_5px_30px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all group overflow-hidden bg-white relative">
                <div className="h-20 bg-gradient-to-b from-slate-50/80 to-white relative">
                  <div className="absolute top-3 start-3">
                    <DropdownMenu dir="rtl">
                      <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "h-8 w-8 p-0 rounded-lg hover:bg-white bg-white/50 border border-slate-200 shadow-sm" })}>
                        <MoreHorizontal className="h-4 w-4 text-slate-600" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-xl shadow-slate-200/50 border-slate-100/50 p-1.5">
                        <DropdownMenuItem onClick={() => openEditModal(user)} className="rounded-lg cursor-pointer p-2 font-medium text-slate-700 hover:text-amber-700 focus:text-amber-700 focus:bg-amber-50 transition-colors text-xs">
                          <Edit className="me-2 h-3.5 w-3.5 opacity-70" />
                          <span>تعديل المستخدم</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={isDeletingUser === user.id}
                          className="rounded-lg cursor-pointer p-2 font-medium text-rose-600 hover:text-rose-700 focus:text-rose-700 focus:bg-rose-50 transition-colors mt-0.5 text-xs"
                        >
                          <Trash2 className="me-2 h-3.5 w-3.5" />
                          <span>{isDeletingUser === user.id ? 'جاري الحذف...' : 'حذف الحساب'}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-0 text-center relative -mt-10">
                  <Avatar className="w-20 h-20 border-[3px] border-white shadow-md mx-auto bg-slate-50 mb-3 transition-transform group-hover:scale-105 duration-300">
                    <AvatarFallback className="bg-slate-100 text-slate-700 font-black text-xl">
                      {user.name ? user.name[0] : 'م'}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-sm text-slate-800 group-hover:text-amber-600 transition-colors">{user.name || 'بدون اسم'}</h3>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5" dir="rtl">{user.email}</p>
                  
                  <div className="mt-4 mb-4 flex justify-center">
                    <Badge className={`px-3 py-1 rounded-lg font-semibold shadow-sm border text-[10px] ${roleMap[user.role]?.color || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {roleMap[user.role]?.label || user.role}
                    </Badge>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100/50 flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <Calendar className="w-3 h-3" />
                    انضم في {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                  </div>
                </div>
              </div>
            ))}
            
            {users.length === 0 && (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50">
                <div className="w-20 h-20 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
                  <Shield className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-black text-slate-700">لا يوجد أعضاء في الفريق</h3>
                <p className="text-slate-500 mt-2 font-medium">ابدأ بإضافة موظفين ومدراء لنظامك من خلال الزر في الأعلى.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden border border-slate-100 shadow-2xl" dir="rtl" showCloseButton={false}>
          <DialogHeader className="px-5 py-4 border-b border-slate-100/50 bg-slate-50/50">
            <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Edit className="w-4 h-4 text-amber-500" />
              تعديل تفاصيل المستخدم
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEdit}>
            <div className="p-5 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">الاسم الكامل</Label>
                <Input 
                  value={editUserData.name}
                  onChange={(e) => setEditUserData({...editUserData, name: e.target.value})}
                  className="h-10 rounded-lg border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 bg-slate-50/50 focus:bg-white transition-all shadow-sm text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">البريد الإلكتروني</Label>
                <Input 
                  type="email"
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({...editUserData, email: e.target.value})}
                  dir="rtl"
                  className="h-10 rounded-lg border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 bg-slate-50/50 focus:bg-white transition-all text-start shadow-sm text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">الصلاحية (الدور)</Label>
                <select 
                  className="w-full h-10 px-3 rounded-lg bg-slate-50/50 border border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all text-sm font-medium shadow-sm"
                  value={editUserData.role}
                  onChange={(e) => setEditUserData({...editUserData, role: e.target.value as Role})}
                >
                  {Object.entries(roleMap).map(([key, role]) => (
                    <option key={key} value={key}>{role.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="pt-1">
                <Label className="text-xs font-bold text-slate-700">تعيين كلمة مرور جديدة (اختياري)</Label>
                <Input 
                  type="password"
                  value={editUserData.password}
                  onChange={(e) => setEditUserData({...editUserData, password: e.target.value})}
                  placeholder="اتركه فارغاً لعدم التغيير"
                  dir="rtl"
                  className="h-10 rounded-lg border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 bg-slate-50/50 focus:bg-white transition-all text-start mt-1.5 shadow-sm text-sm"
                />
              </div>
            </div>
            <div className="p-4 border-t border-slate-100/50 bg-slate-50/30 flex justify-end gap-2">
               <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="rounded-xl h-10 px-5 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold shadow-sm transition-colors text-sm">
                 إلغاء
               </Button>
               <Button type="submit" disabled={isSavingEdit} className="rounded-xl h-10 px-6 bg-[#050B14] hover:bg-[#0a1526] text-white font-bold shadow-[0_8px_20px_rgba(5,11,20,0.15)] border border-slate-800 transition-all text-sm">
                 {isSavingEdit ? 'جاري الحفظ...' : 'حفظ التعديلات'}
               </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create User Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden border border-slate-100 shadow-2xl" dir="rtl" showCloseButton={false}>
          <DialogHeader className="px-5 py-4 border-b border-slate-100/50 bg-slate-50/50">
            <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-amber-500" />
              إضافة مدير أو موظف جديد
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateUser}>
            <div className="p-5 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">الاسم الكامل</Label>
                <Input 
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                  placeholder="مثال: أحمد محمد"
                  className="h-10 rounded-lg border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 bg-slate-50/50 focus:bg-white transition-all shadow-sm text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">البريد الإلكتروني</Label>
                <Input 
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                  placeholder="admin@example.com"
                  dir="rtl"
                  className="h-10 rounded-lg border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 bg-slate-50/50 focus:bg-white transition-all text-start shadow-sm text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">كلمة المرور الابتدائية</Label>
                <Input 
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                  placeholder="12345678 (افتراضي)"
                  dir="rtl"
                  className="h-10 rounded-lg border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 bg-slate-50/50 focus:bg-white transition-all text-start shadow-sm text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">الصلاحية (الدور)</Label>
                <select 
                  className="w-full h-10 px-3 rounded-lg bg-slate-50/50 border border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all text-sm font-medium shadow-sm"
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({...newUserData, role: e.target.value as Role})}
                >
                  {Object.entries(roleMap).map(([key, role]) => (
                    <option key={key} value={key}>{role.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100/50 bg-slate-50/30 flex justify-end gap-2">
               <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="rounded-xl h-10 px-5 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold shadow-sm transition-colors text-sm">
                 إلغاء
               </Button>
               <Button type="submit" disabled={isCreatingUser} className="rounded-xl h-10 px-6 bg-[#050B14] hover:bg-[#0a1526] text-white font-bold shadow-[0_8px_20px_rgba(5,11,20,0.15)] border border-slate-800 transition-all text-sm">
                 {isCreatingUser ? 'جاري الإضافة...' : 'إضافة الموظف'}
               </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden border border-slate-100 shadow-2xl" dir="rtl" showCloseButton={false}>
          <DialogHeader className="px-5 py-4 border-b border-slate-100/50 bg-slate-50/50">
            <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              تغيير كلمة المرور
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword}>
            <div className="p-5 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">كلمة المرور الجديدة</Label>
                <Input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الجديدة"
                  dir="rtl"
                  className="h-10 rounded-lg border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 bg-slate-50/50 focus:bg-white transition-all text-start shadow-sm text-sm"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <div className="p-4 border-t border-slate-100/50 bg-slate-50/30 flex justify-end gap-2">
               <Button type="button" variant="outline" onClick={() => setIsPasswordModalOpen(false)} className="rounded-xl h-10 px-5 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold shadow-sm transition-colors text-sm">
                 إلغاء
               </Button>
               <Button type="submit" disabled={isChangingPassword} className="rounded-xl h-10 px-6 bg-[#050B14] hover:bg-[#0a1526] text-white font-bold shadow-[0_8px_20px_rgba(5,11,20,0.15)] border border-slate-800 transition-all text-sm">
                 {isChangingPassword ? 'جاري الحفظ...' : 'حفظ التغييرات'}
               </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
