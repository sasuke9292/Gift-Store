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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0A1628] border border-white/[0.05] p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
              <UserCog className="w-4 h-4 text-amber-400" />
            </div>
            <h1 className="text-xl font-black text-white/85 tracking-tight">إعدادات الحساب والصلاحيات</h1>
          </div>
          <p className="text-white/35 font-medium text-sm ms-10">إدارة ملفك الشخصي، إعدادات الأمان، وصلاحيات فريق العمل.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-white/[0.02] p-1.5 border border-white/[0.05] rounded-xl w-full flex flex-col sm:flex-row h-auto gap-1">
          <TabsTrigger value="profile" className="flex-1 rounded-lg data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 data-[state=active]:shadow-sm py-2 px-3 text-xs font-bold text-white/40 hover:text-white/80 transition-all w-full sm:w-auto gap-1.5 border border-transparent data-[state=active]:border-amber-500/20">
            <UserCircle className="w-4 h-4" />
            الملف الشخصي
          </TabsTrigger>
          <TabsTrigger value="team" className="flex-1 rounded-lg data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 data-[state=active]:shadow-sm py-2 px-3 text-xs font-bold text-white/40 hover:text-white/80 transition-all w-full sm:w-auto gap-1.5 border border-transparent data-[state=active]:border-amber-500/20">
            <Shield className="w-4 h-4" />
            فريق العمل والصلاحيات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* User Profile Card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl border border-white/[0.05] overflow-hidden bg-[#0A1628]">
                <div className="h-24 bg-gradient-to-br from-[#030810] to-[#0A1628] relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 mix-blend-overlay"></div>
                </div>
                <div className="px-5 pb-5 pt-0 text-center relative -mt-10 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full border-4 border-[#0A1628] shadow-xl bg-white/[0.04] overflow-hidden flex items-center justify-center relative">
                    <Avatar className="w-full h-full">
                      <AvatarFallback className="bg-white/[0.04] text-white/80 font-black text-2xl">
                        {profileData.name ? profileData.name[0] : 'م'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h2 className="mt-3 text-lg font-black text-white/85 tracking-tight">{profileData.name || 'مدير النظام'}</h2>
                  <p className="text-white/40 font-mono text-xs mt-1">{profileData.email}</p>
                  
                  <div className="mt-4 w-full pt-4 border-t border-white/[0.05]">
                    <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-lg font-bold shadow-sm text-xs">
                      <Shield className="w-3.5 h-3.5 ms-1.5" />
                      {roleMap[currentUser?.role || 'ADMIN']?.label}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-white/[0.05] overflow-hidden bg-[#0A1628]">
                <div className="p-5 border-b border-white/[0.05]">
                  <h2 className="text-base font-bold text-white/85 flex items-center gap-2">
                    <UserCircle className="w-4 h-4 text-amber-400" />
                    المعلومات الشخصية
                  </h2>
                  <p className="text-[11px] text-white/40 mt-1 font-medium">تحديث بياناتك الشخصية الأساسية.</p>
                </div>
                <div className="p-5">
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-white/50">الاسم الكامل</Label>
                        <div className="relative group">
                          <UserCircle className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-amber-500 transition-colors" />
                          <input 
                            value={profileData.name} 
                            onChange={e => setProfileData({...profileData, name: e.target.value})}
                            className="w-full h-9 ps-9 px-3 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 rounded-lg transition-all font-medium text-sm shadow-sm outline-none focus:ring-2 focus:ring-amber-500/10 text-white/80" 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-white/50">البريد الإلكتروني</Label>
                        <div className="relative group">
                          <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 z-10 group-focus-within:text-amber-500 transition-colors" />
                          <input 
                            type="email"
                            value={profileData.email} 
                            onChange={e => setProfileData({...profileData, email: e.target.value})}
                            className="w-full h-9 ps-9 pe-3 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 rounded-lg transition-all font-mono text-sm text-start shadow-sm outline-none focus:ring-2 focus:ring-amber-500/10 text-white/80" 
                            dir="rtl"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button type="submit" disabled={isSavingProfile} className="h-9 px-6 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-[#030810] shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all w-full sm:w-auto text-sm">
                        {isSavingProfile ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.05] overflow-hidden bg-[#0A1628]">
                <div className="p-5 border-b border-white/[0.05]">
                  <h2 className="text-base font-bold text-white/85 flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400" />
                    الأمان وكلمة المرور
                  </h2>
                  <p className="text-[11px] text-white/40 mt-1 font-medium">حماية حسابك بتغيير كلمة المرور بشكل دوري.</p>
                </div>
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center border border-white/[0.08] shrink-0">
                        <Lock className="w-4 h-4 text-white/40" />
                      </div>
                      <div>
                        <p className="font-bold text-white/85 text-sm">كلمة المرور</p>
                        <p className="text-[11px] text-white/40 font-medium mt-0.5">يُنصح بتحديث كلمة المرور الخاصة بك بانتظام.</p>
                      </div>
                    </div>
                    <Button onClick={() => setIsPasswordModalOpen(true)} className="h-9 px-5 rounded-xl font-bold border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-white/70 transition-colors w-full sm:w-auto shadow-sm text-sm">
                      تحديث كلمة المرور
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team" className="animate-in fade-in-50 zoom-in-[0.98]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 p-1">
            <div>
              <h2 className="text-base font-bold text-white/85">أعضاء الفريق ({users.length})</h2>
              <p className="text-[11px] text-white/40 mt-1">إدارة حسابات الموظفين وصلاحياتهم في لوحة التحكم.</p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="h-9 px-5 bg-amber-500 hover:bg-amber-400 text-[#030810] rounded-xl font-bold shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all text-sm">
              <UserPlus className="w-4 h-4 ms-1.5" />
              دعوة عضو جديد
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {users.map((user) => (
              <div key={user.id} className="rounded-2xl border border-white/[0.05] hover:border-amber-500/30 transition-all group overflow-hidden bg-[#0A1628] relative">
                <div className="h-16 bg-gradient-to-b from-white/[0.02] to-transparent relative">
                  <div className="absolute top-2 start-2">
                    <DropdownMenu dir="rtl">
                      <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "h-8 w-8 p-0 rounded-lg hover:bg-white/[0.05] bg-white/[0.02] text-white/40 hover:text-white/80 border border-white/[0.05]" })}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-2xl bg-[#0A1628] border-white/10 p-1.5">
                        <DropdownMenuItem onClick={() => openEditModal(user)} className="rounded-lg cursor-pointer p-2 font-medium text-white/70 hover:text-amber-400 focus:text-amber-400 focus:bg-amber-500/10 transition-colors text-xs">
                          <Edit className="me-2 h-3.5 w-3.5 opacity-70" />
                          <span>تعديل المستخدم</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={isDeletingUser === user.id}
                          className="rounded-lg cursor-pointer p-2 font-medium text-rose-400 hover:text-rose-300 focus:text-rose-300 focus:bg-rose-500/10 transition-colors mt-0.5 text-xs"
                        >
                          <Trash2 className="me-2 h-3.5 w-3.5" />
                          <span>{isDeletingUser === user.id ? 'جاري الحذف...' : 'حذف الحساب'}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-0 text-center relative -mt-8">
                  <Avatar className="w-16 h-16 border-[3px] border-[#0A1628] shadow-md mx-auto bg-white/[0.04] mb-3 transition-transform group-hover:scale-105 duration-300">
                    <AvatarFallback className="bg-white/[0.04] text-white/80 font-black text-xl">
                      {user.name ? user.name[0] : 'م'}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-sm text-white/85 group-hover:text-amber-400 transition-colors">{user.name || 'بدون اسم'}</h3>
                  <p className="text-[11px] text-white/40 font-mono mt-0.5" dir="rtl">{user.email}</p>
                  
                  <div className="mt-3 mb-3 flex justify-center">
                    <Badge className={`px-2 py-0.5 rounded flex items-center gap-1.5 w-max text-[11px] bg-white/[0.05] text-white/60 border border-white/[0.08]`}>
                      {roleMap[user.role]?.label || user.role}
                    </Badge>
                  </div>
                  
                  <div className="pt-3 border-t border-white/[0.05] flex items-center justify-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    <Calendar className="w-3 h-3" />
                    انضم في {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                  </div>
                </div>
              </div>
            ))}
            
            {users.length === 0 && (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-white/[0.08] rounded-2xl bg-white/[0.02]">
                <div className="w-16 h-16 bg-white/[0.04] border border-white/[0.05] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-white/20" />
                </div>
                <h3 className="text-base font-black text-white/60">لا يوجد أعضاء في الفريق</h3>
                <p className="text-white/30 mt-1 font-medium text-[11px]">ابدأ بإضافة موظفين ومدراء لنظامك من خلال الزر في الأعلى.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] bg-[#0A1628]" dir="rtl" showCloseButton={false}>
          <DialogHeader className="px-5 py-4 border-b border-white/[0.05] bg-white/[0.02]">
            <DialogTitle className="text-lg font-bold text-white/85 flex items-center gap-2">
              <Edit className="w-4 h-4 text-amber-400" />
              تعديل تفاصيل المستخدم
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEdit}>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-white/50">الاسم الكامل</Label>
                <input 
                  value={editUserData.name}
                  onChange={(e) => setEditUserData({...editUserData, name: e.target.value})}
                  className="w-full h-9 px-3 rounded-lg border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all shadow-sm text-sm outline-none focus:ring-2 focus:ring-amber-500/10 text-white/80"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-white/50">البريد الإلكتروني</Label>
                <input 
                  type="email"
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({...editUserData, email: e.target.value})}
                  dir="rtl"
                  className="w-full h-9 px-3 rounded-lg border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all text-start shadow-sm text-sm outline-none focus:ring-2 focus:ring-amber-500/10 text-white/80"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-white/50">الصلاحية (الدور)</Label>
                <select 
                  className="w-full h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all text-sm font-medium shadow-sm outline-none text-white/80"
                  value={editUserData.role}
                  onChange={(e) => setEditUserData({...editUserData, role: e.target.value as Role})}
                >
                  {Object.entries(roleMap).map(([key, role]) => (
                    <option key={key} value={key} className="bg-[#0A1628]">{role.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="pt-1">
                <Label className="text-xs font-bold text-white/50">تعيين كلمة مرور جديدة (اختياري)</Label>
                <input 
                  type="password"
                  value={editUserData.password}
                  onChange={(e) => setEditUserData({...editUserData, password: e.target.value})}
                  placeholder="اتركه فارغاً لعدم التغيير"
                  dir="rtl"
                  className="w-full h-9 px-3 rounded-lg border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all text-start mt-1.5 shadow-sm text-sm outline-none focus:ring-2 focus:ring-amber-500/10 text-white/80 placeholder:text-white/20"
                />
              </div>
            </div>
            <div className="p-4 border-t border-white/[0.05] bg-white/[0.02] flex justify-end gap-2">
               <Button type="button" onClick={() => setIsEditModalOpen(false)} className="rounded-xl h-9 px-5 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-white/70 font-bold shadow-sm transition-colors text-sm">
                 إلغاء
               </Button>
               <Button type="submit" disabled={isSavingEdit} className="rounded-xl h-9 px-6 bg-amber-500 hover:bg-amber-400 text-[#030810] font-bold shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all text-sm">
                 {isSavingEdit ? 'جاري الحفظ...' : 'حفظ التعديلات'}
               </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create User Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] bg-[#0A1628]" dir="rtl" showCloseButton={false}>
          <DialogHeader className="px-5 py-4 border-b border-white/[0.05] bg-white/[0.02]">
            <DialogTitle className="text-lg font-bold text-white/85 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-amber-400" />
              إضافة مدير أو موظف جديد
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateUser}>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-white/50">الاسم الكامل</Label>
                <input 
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                  placeholder="مثال: أحمد محمد"
                  className="w-full h-9 px-3 rounded-lg border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all shadow-sm text-sm outline-none focus:ring-2 focus:ring-amber-500/10 text-white/80 placeholder:text-white/20"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-white/50">البريد الإلكتروني</Label>
                <input 
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                  placeholder="admin@example.com"
                  dir="rtl"
                  className="w-full h-9 px-3 rounded-lg border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all text-start shadow-sm text-sm outline-none focus:ring-2 focus:ring-amber-500/10 text-white/80 placeholder:text-white/20"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-white/50">كلمة المرور الابتدائية</Label>
                <input 
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                  placeholder="12345678 (افتراضي)"
                  dir="rtl"
                  className="w-full h-9 px-3 rounded-lg border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all text-start shadow-sm text-sm outline-none focus:ring-2 focus:ring-amber-500/10 text-white/80 placeholder:text-white/20"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-white/50">الصلاحية (الدور)</Label>
                <select 
                  className="w-full h-9 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all text-sm font-medium shadow-sm outline-none text-white/80"
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({...newUserData, role: e.target.value as Role})}
                >
                  {Object.entries(roleMap).map(([key, role]) => (
                    <option key={key} value={key} className="bg-[#0A1628]">{role.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-white/[0.05] bg-white/[0.02] flex justify-end gap-2">
               <Button type="button" onClick={() => setIsCreateModalOpen(false)} className="rounded-xl h-9 px-5 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-white/70 font-bold shadow-sm transition-colors text-sm">
                 إلغاء
               </Button>
               <Button type="submit" disabled={isCreatingUser} className="rounded-xl h-9 px-6 bg-amber-500 hover:bg-amber-400 text-[#030810] font-bold shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all text-sm">
                 {isCreatingUser ? 'جاري الإضافة...' : 'إضافة الموظف'}
               </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] bg-[#0A1628]" dir="rtl" showCloseButton={false}>
          <DialogHeader className="px-5 py-4 border-b border-white/[0.05] bg-white/[0.02]">
            <DialogTitle className="text-lg font-bold text-white/85 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              تغيير كلمة المرور
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword}>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-white/50">كلمة المرور الجديدة</Label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الجديدة"
                  dir="rtl"
                  className="w-full h-9 px-3 rounded-lg border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all text-start shadow-sm text-sm outline-none focus:ring-2 focus:ring-amber-500/10 text-white/80 placeholder:text-white/20"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <div className="p-4 border-t border-white/[0.05] bg-white/[0.02] flex justify-end gap-2">
               <Button type="button" onClick={() => setIsPasswordModalOpen(false)} className="rounded-xl h-9 px-5 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-white/70 font-bold shadow-sm transition-colors text-sm">
                 إلغاء
               </Button>
               <Button type="submit" disabled={isChangingPassword} className="rounded-xl h-9 px-6 bg-amber-500 hover:bg-amber-400 text-[#030810] font-bold shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all text-sm">
                 {isChangingPassword ? 'جاري الحفظ...' : 'حفظ التغييرات'}
               </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
