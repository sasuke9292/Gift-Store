'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Store, CreditCard, Bell, Shield, Save, User as UserIcon } from 'lucide-react'
import { toast } from 'sonner'
import { updateStoreSettings } from '@/app/actions/admin/settings'

export interface SettingsData {
  storeName: string
  currency: string
  storeEmail: string
  storePhone: string
  allowCod: boolean
  allowOnlinePayment: boolean
  orderNotifications: boolean
  marketingEmails: boolean
  logoUrl?: string | null
}

export default function SettingsClient({ initialSettings }: { initialSettings: SettingsData }) {
  const [settings, setSettings] = useState<SettingsData>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    const res = await updateStoreSettings(settings)
    setIsSaving(false)
    if (res.success) {
      toast.success('تم حفظ الإعدادات بنجاح')
    } else {
      toast.error(res.error)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-5xl mx-auto pb-12"
      dir="rtl"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">إعدادات النظام</h1>
          <p className="text-slate-500 font-medium">إدارة تفاصيل المتجر، بوابات الدفع، والملف الشخصي.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-8 font-bold shadow-lg shadow-indigo-600/20 transition-all">
            {isSaving ? 'جاري الحفظ...' : (
              <>
                <Save className="w-5 h-5 ms-2" />
                حفظ التغييرات
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full space-y-8">
        <TabsList className="bg-white p-1.5 border border-slate-100 shadow-sm rounded-2xl w-full flex flex-col sm:flex-row h-auto">
          <TabsTrigger value="general" className="flex-1 rounded-xl data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 py-3 px-4 text-sm font-bold text-slate-500 transition-all w-full sm:w-auto gap-2">
            <Store className="w-4 h-4" />
            إعدادات عامة
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex-1 rounded-xl data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 py-3 px-4 text-sm font-bold text-slate-500 transition-all w-full sm:w-auto gap-2">
            <CreditCard className="w-4 h-4" />
            بوابات الدفع
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 rounded-xl data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 py-3 px-4 text-sm font-bold text-slate-500 transition-all w-full sm:w-auto gap-2">
            <Bell className="w-4 h-4" />
            الإشعارات
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1 rounded-xl data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 py-3 px-4 text-sm font-bold text-slate-500 transition-all w-full sm:w-auto gap-2">
            <Shield className="w-4 h-4" />
            الأمان
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">بيانات المتجر الأساسية</h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">هذه المعلومات ستكون مرئية للعملاء في واجهة المتجر.</p>
            </div>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700">اسم المتجر</Label>
                  <Input 
                    value={settings.storeName}
                    onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                    className="h-14 rounded-2xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors text-base" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700">العملة الافتراضية</Label>
                  <select 
                    className="flex h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus:bg-white transition-colors"
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  >
                    <option value="د.ع">الدينار العراقي (د.ع)</option>
                    <option value="$">الدولار الأمريكي ($)</option>
                  </select>
                </div>
                
                <div className="space-y-3 md:col-span-2">
                  <Label className="text-sm font-bold text-slate-700">رابط الشعار (Logo URL)</Label>
                  <div className="flex gap-4 items-center">
                    {settings.logoUrl && (
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden shadow-sm">
                        <img src={settings.logoUrl} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                      </div>
                    )}
                    <Input 
                      value={settings.logoUrl || ''}
                      onChange={(e) => setSettings({...settings, logoUrl: e.target.value})}
                      placeholder="https://..."
                      dir="ltr"
                      className="h-14 rounded-2xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors text-start text-sm font-mono flex-1" 
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700">البريد الإلكتروني للدعم</Label>
                  <Input 
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({...settings, storeEmail: e.target.value})}
                    dir="ltr"
                    className="h-14 rounded-2xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors text-start font-mono text-sm" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700">رقم الهاتف الأساسي</Label>
                  <Input 
                    value={settings.storePhone}
                    onChange={(e) => setSettings({...settings, storePhone: e.target.value})}
                    dir="ltr"
                    className="h-14 rounded-2xl border-slate-200 focus-visible:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors text-start font-mono text-sm" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">بوابات وطرق الدفع</h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">التحكم في خيارات الدفع المتاحة للعملاء في صفحة إتمام الطلب.</p>
            </div>
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center justify-between p-6 border border-slate-100 rounded-2xl bg-slate-50">
                <div className="space-y-1">
                  <Label className="text-lg font-bold text-slate-800">الدفع عند الاستلام (COD)</Label>
                  <p className="text-sm text-slate-500 font-medium">السماح للعملاء بالدفع نقداً عند توصيل الطلب.</p>
                </div>
                <Switch 
                  checked={settings.allowCod}
                  onCheckedChange={(checked) => setSettings({...settings, allowCod: checked})}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-6 border border-slate-100 rounded-2xl bg-slate-50">
                <div className="space-y-1">
                  <Label className="text-lg font-bold text-slate-800">الدفع الإلكتروني (ZainCash / Visa)</Label>
                  <p className="text-sm text-slate-500 font-medium">تفعيل قبول المدفوعات الإلكترونية عبر بوابات الدفع المرتبطة.</p>
                </div>
                <Switch 
                  checked={settings.allowOnlinePayment}
                  onCheckedChange={(checked) => setSettings({...settings, allowOnlinePayment: checked})}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">التنبيهات والإشعارات</h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">تخصيص الإشعارات التي تصلك وتصل لعملائك.</p>
            </div>
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center justify-between p-6 border border-slate-100 rounded-2xl bg-slate-50">
                <div className="space-y-1">
                  <Label className="text-lg font-bold text-slate-800">تنبيهات الطلبات الجديدة</Label>
                  <p className="text-sm text-slate-500 font-medium">استلام بريد إلكتروني وإشعار نظام فور تسجيل طلب جديد.</p>
                </div>
                <Switch 
                  checked={settings.orderNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, orderNotifications: checked})}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-6 border border-slate-100 rounded-2xl bg-slate-50">
                <div className="space-y-1">
                  <Label className="text-lg font-bold text-slate-800">الرسائل التسويقية للعملاء</Label>
                  <p className="text-sm text-slate-500 font-medium">إرسال نشرة بريدية وتحديثات تلقائية للعملاء المسجلين.</p>
                </div>
                <Switch 
                  checked={settings.marketingEmails}
                  onCheckedChange={(checked) => setSettings({...settings, marketingEmails: checked})}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">الأمان والوصول</h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">حماية الحساب وإدارة كلمات المرور.</p>
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="p-6 border border-rose-200 bg-rose-50/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-rose-800 text-lg">تغيير كلمة المرور</h4>
                  <p className="text-sm text-rose-600/80 mt-1 font-medium">يُنصح بتغيير كلمة المرور الخاصة بك بانتظام للحفاظ على أمان المتجر.</p>
                </div>
                <Button variant="outline" className="text-rose-600 font-bold border-rose-200 bg-white hover:bg-rose-100 hover:text-rose-700 rounded-xl h-12 px-6 w-full sm:w-auto">
                  تغيير كلمة المرور
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </motion.div>
  )
}
