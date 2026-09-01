'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Store, CreditCard, Bell, Shield, Save } from 'lucide-react'
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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">الإعدادات</h1>
          <p className="text-slate-500 mt-1">إدارة إعدادات المتجر، بوابات الدفع، والإشعارات.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20">
            {isSaving ? 'جاري الحفظ...' : (
              <>
                <Save className="w-4 h-4 ml-2" />
                حفظ التغييرات
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full space-y-6">
        <TabsList className="bg-white p-1 border border-slate-100 shadow-sm rounded-xl w-full justify-start h-auto flex-wrap">
          <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-primary py-2.5 px-4 text-sm font-semibold text-slate-600">
            <Store className="w-4 h-4 ml-2" />
            إعدادات عامة
          </TabsTrigger>
          <TabsTrigger value="payment" className="rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-primary py-2.5 px-4 text-sm font-semibold text-slate-600">
            <CreditCard className="w-4 h-4 ml-2" />
            بوابات الدفع
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-primary py-2.5 px-4 text-sm font-semibold text-slate-600">
            <Bell className="w-4 h-4 ml-2" />
            الإشعارات
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-slate-100 data-[state=active]:text-primary py-2.5 px-4 text-sm font-semibold text-slate-600">
            <Shield className="w-4 h-4 ml-2" />
            الأمان
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-xl font-bold text-slate-800">بيانات المتجر</CardTitle>
              <CardDescription className="text-slate-500">
                المعلومات الأساسية التي ستظهر للعملاء في الواجهة.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">اسم المتجر</Label>
                  <Input 
                    value={settings.storeName}
                    onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                    className="h-11 rounded-xl border-slate-200 focus-visible:ring-primary bg-slate-50 focus:bg-white transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">العملة الافتراضية</Label>
                  <select 
                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus:bg-white"
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  >
                    <option value="د.ع">الدينار العراقي (د.ع)</option>
                    <option value="$">الدولار الأمريكي ($)</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-semibold text-slate-700">رابط الشعار (Logo URL)</Label>
                  <div className="flex gap-4 items-center">
                    {settings.logoUrl && (
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                        <img src={settings.logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <Input 
                      value={settings.logoUrl || ''}
                      onChange={(e) => setSettings({...settings, logoUrl: e.target.value})}
                      placeholder="أدخل رابط صورة الشعار هنا..."
                      dir="ltr"
                      className="h-11 rounded-xl border-slate-200 focus-visible:ring-primary bg-slate-50 focus:bg-white transition-colors text-left text-sm flex-1" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">البريد الإلكتروني للدعم</Label>
                  <Input 
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({...settings, storeEmail: e.target.value})}
                    dir="ltr"
                    className="h-11 rounded-xl border-slate-200 focus-visible:ring-primary bg-slate-50 focus:bg-white transition-colors text-left font-mono text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">رقم الهاتف الأساسي</Label>
                  <Input 
                    value={settings.storePhone}
                    onChange={(e) => setSettings({...settings, storePhone: e.target.value})}
                    dir="ltr"
                    className="h-11 rounded-xl border-slate-200 focus-visible:ring-primary bg-slate-50 focus:bg-white transition-colors text-left font-mono text-sm" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-xl font-bold text-slate-800">خيارات الدفع</CardTitle>
              <CardDescription className="text-slate-500">
                إدارة طرق الدفع المتاحة للعملاء.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold text-slate-800">الدفع عند الاستلام (COD)</Label>
                  <p className="text-sm text-slate-500">السماح للعملاء بالدفع نقداً عند استلام الطلب.</p>
                </div>
                <Switch 
                  checked={settings.allowCod}
                  onCheckedChange={(checked) => setSettings({...settings, allowCod: checked})}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold text-slate-800">الدفع الإلكتروني</Label>
                  <p className="text-sm text-slate-500">تفعيل بوابات الدفع (ZainCash, Credit Card).</p>
                </div>
                <Switch 
                  checked={settings.allowOnlinePayment}
                  onCheckedChange={(checked) => setSettings({...settings, allowOnlinePayment: checked})}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-xl font-bold text-slate-800">إشعارات النظام</CardTitle>
              <CardDescription className="text-slate-500">
                التحكم في التنبيهات المرسلة للإدارة والعملاء.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold text-slate-800">إشعارات الطلبات الجديدة</Label>
                  <p className="text-sm text-slate-500">استلام تنبيه فور تسجيل طلب جديد في المتجر.</p>
                </div>
                <Switch 
                  checked={settings.orderNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, orderNotifications: checked})}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold text-slate-800">الرسائل التسويقية</Label>
                  <p className="text-sm text-slate-500">إرسال رسائل بريد تسويقية للعملاء تلقائياً.</p>
                </div>
                <Switch 
                  checked={settings.marketingEmails}
                  onCheckedChange={(checked) => setSettings({...settings, marketingEmails: checked})}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-xl font-bold text-slate-800">الأمان</CardTitle>
              <CardDescription className="text-slate-500">
                إعدادات الأمان الخاصة بحساب الإدارة.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="p-4 border border-rose-100 bg-rose-50 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-rose-800">تغيير كلمة المرور الأساسية</h4>
                  <p className="text-sm text-rose-600 mt-1">يُنصح بتغيير كلمة المرور بشكل دوري للحماية.</p>
                </div>
                <Button variant="outline" className="text-rose-600 border-rose-200 bg-white hover:bg-rose-100 rounded-xl">
                  تغيير الآن
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
