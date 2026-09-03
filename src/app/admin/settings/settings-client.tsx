'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Store, CreditCard, Bell, Shield, Save, User as UserIcon, Settings } from 'lucide-react'
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
  topBarText?: string
  heroBadge?: string
  heroHeadline?: string
  heroSubheadline?: string
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
      className="space-y-8 max-w-6xl mx-auto pb-12"
      dir="rtl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-[0_5px_30px_rgba(0,0,0,0.03)] border border-slate-100/50">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100/80 rounded-xl text-slate-600">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight drop-shadow-sm">إعدادات المتجر</h1>
          </div>
          <p className="text-slate-500 font-medium text-lg ms-1">إدارة تفاصيل المتجر، بوابات الدفع، والملف الشخصي.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={handleSave} disabled={isSaving} className="bg-[#050B14] hover:bg-[#0a1526] text-white rounded-xl h-10 px-6 font-bold shadow-[0_8px_20px_rgba(5,11,20,0.15)] transition-all border border-slate-800 w-full sm:w-auto text-sm">
            {isSaving ? 'جاري الحفظ...' : (
              <>
                <Save className="w-5 h-5 ms-2 text-amber-400" />
                حفظ التغييرات
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full space-y-8">
        <TabsList className="bg-white p-1.5 border border-slate-100/50 shadow-sm rounded-xl w-full flex flex-col sm:flex-row h-auto gap-1">
          <TabsTrigger value="general" className="flex-1 rounded-lg data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:shadow-sm py-2.5 px-3 text-xs font-bold text-slate-500 hover:text-slate-700 transition-all w-full sm:w-auto gap-1.5">
            <Store className="w-4 h-4" />
            إعدادات عامة
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex-1 rounded-lg data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:shadow-sm py-2.5 px-3 text-xs font-bold text-slate-500 hover:text-slate-700 transition-all w-full sm:w-auto gap-1.5">
            <CreditCard className="w-4 h-4" />
            بوابات الدفع
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 rounded-lg data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:shadow-sm py-2.5 px-3 text-xs font-bold text-slate-500 hover:text-slate-700 transition-all w-full sm:w-auto gap-1.5">
            <Bell className="w-4 h-4" />
            الإشعارات
          </TabsTrigger>
          <TabsTrigger value="texts" className="flex-1 rounded-lg data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:shadow-sm py-2.5 px-3 text-xs font-bold text-slate-500 hover:text-slate-700 transition-all w-full sm:w-auto gap-1.5">
            <UserIcon className="w-4 h-4" />
            نصوص الواجهة
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className="border border-slate-100/50 shadow-[0_5px_30px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden bg-white">
            <div className="p-6 md:p-8 border-b border-slate-100/50 bg-slate-50/30">
              <h2 className="text-lg font-bold text-slate-800">بيانات المتجر الأساسية</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">هذه المعلومات ستكون مرئية للعملاء في واجهة المتجر.</p>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">اسم المتجر</Label>
                  <Input 
                    value={settings.storeName}
                    onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                    className="h-10 rounded-lg border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 bg-slate-50/50 focus:bg-white transition-all text-sm shadow-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">العملة الافتراضية</Label>
                  <select 
                    className="flex h-10 w-full rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 px-3 py-2 text-sm font-medium focus-visible:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 focus:bg-white transition-all shadow-sm"
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  >
                    <option value="د.ع">الدينار العراقي (د.ع)</option>
                    <option value="$">الدولار الأمريكي ($)</option>
                  </select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-bold text-slate-700">رابط الشعار (Logo URL)</Label>
                  <div className="flex gap-3 items-center">
                    {settings.logoUrl && (
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden shadow-sm">
                        <img src={settings.logoUrl} alt="Logo Preview" className="w-full h-full object-contain p-1.5" />
                      </div>
                    )}
                    <Input 
                      value={settings.logoUrl || ''}
                      onChange={(e) => setSettings({...settings, logoUrl: e.target.value})}
                      placeholder="https://..."
                      dir="rtl"
                      className="h-10 rounded-lg border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 bg-slate-50/50 focus:bg-white transition-all text-start text-xs font-mono flex-1 shadow-sm" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">البريد الإلكتروني للدعم</Label>
                  <Input 
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({...settings, storeEmail: e.target.value})}
                    dir="rtl"
                    className="h-10 rounded-lg border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 bg-slate-50/50 focus:bg-white transition-all text-start font-mono text-sm shadow-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">رقم الهاتف الأساسي</Label>
                  <Input 
                    value={settings.storePhone}
                    onChange={(e) => setSettings({...settings, storePhone: e.target.value})}
                    dir="rtl"
                    className="h-10 rounded-lg border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 bg-slate-50/50 focus:bg-white transition-all text-start font-mono text-sm shadow-sm" 
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className="border border-slate-100/50 shadow-[0_5px_30px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden bg-white">
            <div className="p-6 md:p-8 border-b border-slate-100/50 bg-slate-50/30">
              <h2 className="text-lg font-bold text-slate-800">بوابات وطرق الدفع</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">التحكم في خيارات الدفع المتاحة للعملاء في صفحة إتمام الطلب.</p>
            </div>
            <div className="p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-100/80 rounded-xl bg-slate-50/50 shadow-sm">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-slate-800">الدفع عند الاستلام (COD)</Label>
                  <p className="text-xs text-slate-500 font-medium">السماح للعملاء بالدفع نقداً عند توصيل الطلب.</p>
                </div>
                <Switch 
                  checked={settings.allowCod}
                  onCheckedChange={(checked) => setSettings({...settings, allowCod: checked})}
                  className="data-[state=checked]:bg-emerald-500 shadow-sm"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className="border border-slate-100/50 shadow-[0_5px_30px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden bg-white">
            <div className="p-6 md:p-8 border-b border-slate-100/50 bg-slate-50/30">
              <h2 className="text-lg font-bold text-slate-800">التنبيهات والإشعارات</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">تخصيص الإشعارات التي تصلك وتصل لعملائك.</p>
            </div>
            <div className="p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-100/80 rounded-xl bg-slate-50/50 shadow-sm">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-slate-800">تنبيهات الطلبات الجديدة</Label>
                  <p className="text-xs text-slate-500 font-medium">استلام بريد إلكتروني وإشعار نظام فور تسجيل طلب جديد.</p>
                </div>
                <Switch 
                  checked={settings.orderNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, orderNotifications: checked})}
                  className="data-[state=checked]:bg-emerald-500 shadow-sm"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-100/80 rounded-xl bg-slate-50/50 shadow-sm">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-slate-800">الرسائل التسويقية للعملاء</Label>
                  <p className="text-xs text-slate-500 font-medium">إرسال نشرة بريدية وتحديثات تلقائية للعملاء المسجلين.</p>
                </div>
                <Switch 
                  checked={settings.marketingEmails}
                  onCheckedChange={(checked) => setSettings({...settings, marketingEmails: checked})}
                  className="data-[state=checked]:bg-emerald-500 shadow-sm"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="texts" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className="border border-slate-100/50 shadow-[0_5px_30px_rgba(0,0,0,0.03)] rounded-2xl overflow-hidden bg-white">
            <div className="p-6 md:p-8 border-b border-slate-100/50 bg-slate-50/30">
              <h2 className="text-lg font-bold text-slate-800">نصوص الواجهة الرئيسية</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">التحكم في النصوص والعناوين التي تظهر للعملاء في الصفحة الرئيسية.</p>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">شريط الإعلانات العلوي (Top Bar)</Label>
                <Input 
                  value={settings.topBarText || ''}
                  onChange={(e) => setSettings({...settings, topBarText: e.target.value})}
                  className="h-10 rounded-lg border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 bg-slate-50/50 focus:bg-white transition-all text-sm shadow-sm" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">الشارة العلوية (Hero Badge)</Label>
                <Input 
                  value={settings.heroBadge || ''}
                  onChange={(e) => setSettings({...settings, heroBadge: e.target.value})}
                  className="h-10 rounded-lg border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 bg-slate-50/50 focus:bg-white transition-all text-sm shadow-sm" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">العنوان الرئيسي (Hero Headline)</Label>
                <Input 
                  value={settings.heroHeadline || ''}
                  onChange={(e) => setSettings({...settings, heroHeadline: e.target.value})}
                  className="h-10 rounded-lg border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 bg-slate-50/50 focus:bg-white transition-all text-sm shadow-sm" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">النص الفرعي (Hero Subheadline)</Label>
                <textarea 
                  value={settings.heroSubheadline || ''}
                  onChange={(e) => setSettings({...settings, heroSubheadline: e.target.value})}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 hover:border-slate-300 focus-visible:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 bg-slate-50/50 focus:bg-white transition-all text-sm p-3 resize-none shadow-sm" 
                />
              </div>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </motion.div>
  )
}
