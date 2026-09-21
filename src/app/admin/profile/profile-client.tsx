'use client'

import React, { useState } from 'react'
import { User, Role } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Shield, UserCircle, Key, Mail, Edit, UserPlus, Lock, Trash2, Calendar, UserCog, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateProfile, createStaffUser, changePassword, updateStaffUser, deleteStaffUser } from '@/app/actions/admin/users'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

interface ProfileClientProps {
  currentUser: User | null
  initialStaffUsers: User[]
}

const roleMap: Record<Role, { label: string, color: string }> = {
  SUPER_ADMIN: { label: 'مدير عام', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ADMIN: { label: 'مسؤول', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  MANAGER: { label: 'مشرف', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  SALES: { label: 'مبيعات', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  WAREHOUSE: { label: 'مخازن', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  SUPPORT: { label: 'دعم فني', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  EDITOR: { label: 'محرر محتوى', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  CUSTOMER: { label: 'عميل', color: 'bg-stone-50 text-stone-700 border-stone-200' },
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
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [isDeletingUser, setIsDeletingUser] = useState(false)

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
      toast.success('تم تحديث البيانات الشخصية بنجاح')
    } else {
      toast.error(res.error || 'فشل تحديث البيانات')
    }
    setIsSavingProfile(false)
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      toast.error('يرجى ملء جميع الحقول')
      return
    }
    
    setIsCreatingUser(true)
    const res = await createStaffUser(newUserData)
    if (res.success && res.data) {
      toast.success('تمت إضافة الموظف الجديد بنجاح')
      setUsers([res.data, ...users])
      setIsCreateModalOpen(false)
      setNewUserData({ name: '', email: '', password: '', role: 'ADMIN' })
    } else {
      toast.error(res.error || 'حدث خطأ أثناء الإضافة')
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
      toast.error(res.error || 'حدث خطأ أثناء تغيير كلمة المرور')
    }
    setIsChangingPassword(false)
  }

  const handleDeleteUserConfirm = async () => {
    if (!deleteUserId) return
    setIsDeletingUser(true)
    const res = await deleteStaffUser(deleteUserId)
    if (res.success) {
      toast.success('تم حذف المستخدم بنجاح')
      setUsers(users.filter(u => u.id !== deleteUserId))
      setDeleteUserId(null)
    } else {
      toast.error(res.error || 'حدث خطأ أثناء الحذف')
    }
    setIsDeletingUser(false)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1C1917] tracking-tight">إعدادات الحساب وفريق العمل</h1>
          <p className="text-sm text-[#78716C] mt-1">إدارة معلوماتك الشخصية، كلمة المرور، وصلاحيات الموظفين</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white p-1.5 border border-[#E8E4DF] rounded-2xl w-full flex flex-col sm:flex-row h-auto gap-1 shadow-sm">
          <TabsTrigger 
            value="profile" 
            className="flex-1 rounded-xl data-[state=active]:bg-[#1C1917] data-[state=active]:text-white py-3 px-4 text-xs font-bold text-[#78716C] hover:text-[#1C1917] transition-all w-full sm:w-auto gap-2"
          >
            <UserCircle className="w-4 h-4 text-[#C9A96E]" />
            الملف الشخصي
          </TabsTrigger>
          <TabsTrigger 
            value="team" 
            className="flex-1 rounded-xl data-[state=active]:bg-[#1C1917] data-[state=active]:text-white py-3 px-4 text-xs font-bold text-[#78716C] hover:text-[#1C1917] transition-all w-full sm:w-auto gap-2"
          >
            <Shield className="w-4 h-4 text-[#C9A96E]" />
            فريق العمل والصلاحيات
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* User Profile Card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-3xl border border-[#E8E4DF] overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <div className="h-28 bg-[#FAFAF8] relative border-b border-[#E8E4DF] overflow-hidden">
                  <div className="absolute inset-0 bg-[#C9A96E]/10 mix-blend-overlay" />
                </div>
                <div className="px-6 pb-6 pt-0 text-center relative -mt-12 flex flex-col items-center">
                  <div 
                    className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-2xl"
                    style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
                  >
                    {profileData.name ? profileData.name[0] : 'أ'}
                  </div>
                  <h2 className="mt-3 text-lg font-black text-[#1C1917]">{profileData.name || 'مدير المتجر'}</h2>
                  <p className="text-[#78716C] font-mono text-xs mt-0.5" dir="ltr">{profileData.email}</p>
                  
                  <div className="mt-4 w-full pt-4 border-t border-[#E8E4DF]">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FBF6EE] text-[#A07850] border border-[#C9A96E]/30">
                      <Shield className="w-3.5 h-3.5" />
                      {roleMap[currentUser?.role || 'SUPER_ADMIN']?.label}
                    </span>
                  </div>

                  <div className="mt-6 w-full">
                    <Button 
                      variant="outline"
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="w-full h-11 rounded-xl border-[#E8E4DF] hover:bg-[#FAFAF8] text-[#1C1917] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Key className="w-4 h-4 text-[#C9A96E]" />
                      تغيير كلمة المرور
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Details Form */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-[#E8E4DF] overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <div className="p-6 border-b border-[#E8E4DF] bg-[#FAFAF8]">
                  <h2 className="text-base font-black text-[#1C1917]">المعلومات الشخصية</h2>
                  <p className="text-xs text-[#78716C] mt-0.5">تحديث الاسم والبريد الإلكتروني لحسابك</p>
                </div>
                <form onSubmit={handleSaveProfile} className="p-6 sm:p-7 space-y-5">
                  <div>
                    <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">الاسم الكامل *</Label>
                    <Input 
                      required
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">البريد الإلكتروني *</Label>
                    <Input 
                      type="email"
                      required
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                      dir="ltr"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSavingProfile}
                    className="h-11 px-6 rounded-xl text-white font-bold text-xs shadow-sm cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
                  >
                    {isSavingProfile ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <div className="rounded-3xl border border-[#E8E4DF] overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="p-6 border-b border-[#E8E4DF] bg-[#FAFAF8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-[#1C1917]">فريق العمل والموظفين</h2>
                <p className="text-xs text-[#78716C] mt-0.5">قائمة الموظفين المصرح لهم بالدخول إلى لوحة التحكم</p>
              </div>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="h-11 px-5 rounded-xl text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
              >
                <UserPlus className="w-4 h-4" />
                إضافة موظف جديد
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start min-w-[700px]">
                <thead className="bg-[#FAFAF8] border-b border-[#E8E4DF]">
                  <tr>
                    <th className="px-6 py-4 font-bold text-[#A8A29E] text-xs uppercase tracking-wider text-start">الموظف</th>
                    <th className="px-6 py-4 font-bold text-[#A8A29E] text-xs uppercase tracking-wider text-start">البريد الإلكتروني</th>
                    <th className="px-6 py-4 font-bold text-[#A8A29E] text-xs uppercase tracking-wider text-start">الدور</th>
                    <th className="px-6 py-4 font-bold text-[#A8A29E] text-xs uppercase tracking-wider text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E4DF]/60">
                  {users.map((u) => {
                    const roleInfo = roleMap[u.role] || roleMap['ADMIN']
                    return (
                      <tr key={u.id} className="hover:bg-[#FAFAF8] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                              style={{ background: 'linear-gradient(135deg, #FBF6EE 0%, #F5EDE0 100%)', color: '#A07850', border: '1px solid rgba(201,169,110,0.2)' }}
                            >
                              {u.name ? u.name[0] : 'م'}
                            </div>
                            <span className="font-bold text-[#1C1917] text-sm">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-[#78716C]" dir="ltr">
                          {u.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${roleInfo.color}`}>
                            {roleInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {u.id !== currentUser?.id && (
                            <button
                              onClick={() => setDeleteUserId(u.id)}
                              className="w-9 h-9 rounded-xl text-[#A8A29E] hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all flex items-center justify-center mx-auto cursor-pointer"
                              title="حذف الموظف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl bg-white border border-[#E8E4DF] shadow-2xl" dir="rtl">
          <form onSubmit={handleChangePassword}>
            <DialogHeader className="p-6 bg-[#FAFAF8] border-b border-[#E8E4DF]">
              <DialogTitle className="text-xl font-black text-[#1C1917]">
                تغيير كلمة المرور
              </DialogTitle>
              <p className="text-xs text-[#78716C] mt-1">أدخل كلمة المرور الجديدة لحسابك</p>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">كلمة المرور الجديدة *</Label>
                <Input 
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                />
              </div>
            </div>
            <DialogFooter className="p-4 bg-[#FAFAF8] border-t border-[#E8E4DF] flex items-center justify-end gap-2.5">
              <Button type="button" variant="outline" onClick={() => setIsPasswordModalOpen(false)} className="h-10 px-4 rounded-xl border-[#E8E4DF] text-xs font-bold">
                إلغاء
              </Button>
              <Button type="submit" disabled={isChangingPassword} className="h-10 px-5 rounded-xl text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}>
                {isChangingPassword ? 'جاري التغيير...' : 'تحديث كلمة المرور'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Staff Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl bg-white border border-[#E8E4DF] shadow-2xl" dir="rtl">
          <form onSubmit={handleCreateUser}>
            <DialogHeader className="p-6 bg-[#FAFAF8] border-b border-[#E8E4DF]">
              <DialogTitle className="text-xl font-black text-[#1C1917]">
                إضافة موظف جديد
              </DialogTitle>
              <p className="text-xs text-[#78716C] mt-1">إنشاء حساب جديد لموظف في الفريق</p>
            </DialogHeader>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">الاسم الكامل *</Label>
                <Input 
                  required
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  placeholder="مثال: أحمد علي"
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">البريد الإلكتروني *</Label>
                <Input 
                  type="email"
                  required
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  placeholder="name@giftstore.com"
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  dir="ltr"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">كلمة المرور الأولية *</Label>
                <Input 
                  type="password"
                  required
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  placeholder="••••••••"
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">الدور الوظيفي *</Label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as Role })}
                  className="w-full h-11 px-3 rounded-xl bg-[#FAFAF8] border border-[#E8E4DF] text-sm text-[#1C1917] focus:outline-none focus:border-[#C9A96E]/50 focus:bg-white"
                >
                  <option value="ADMIN">مسؤول (إدارة شاملة)</option>
                  <option value="MANAGER">مشرف (إدارة الطلبات والمنتجات)</option>
                  <option value="SALES">مبيعات (إدارة الطلبات)</option>
                  <option value="EDITOR">محرر (تعديل المنتجات)</option>
                </select>
              </div>
            </div>
            <DialogFooter className="p-4 bg-[#FAFAF8] border-t border-[#E8E4DF] flex items-center justify-end gap-2.5">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="h-10 px-4 rounded-xl border-[#E8E4DF] text-xs font-bold">
                إلغاء
              </Button>
              <Button type="submit" disabled={isCreatingUser} className="h-10 px-5 rounded-xl text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}>
                {isCreatingUser ? 'جاري الإضافة...' : 'إضافة الموظف'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Staff Confirmation */}
      <ConfirmDialog
        open={!!deleteUserId}
        onOpenChange={(open) => !open && setDeleteUserId(null)}
        title="هل أنت متأكد من حذف هذا الموظف؟"
        description="سيتم حذف حساب الموظف ولن يتمكن من الدخول إلى لوحة التحكم مجدداً."
        confirmText="حذف الموظف"
        cancelText="إلغاء"
        variant="danger"
        isLoading={isDeletingUser}
        onConfirm={handleDeleteUserConfirm}
      />
    </div>
  )
}
