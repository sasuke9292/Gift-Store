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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0A1628] border border-white/[0.05] p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center">
              <Settings className="w-4 h-4 text-amber-400" />
            </div>
            <h1 className="text-xl font-black text-white/85 tracking-tight">إعدادات المتجر</h1>
          </div>
          <p className="text-white/35 font-medium text-sm ms-10">إدارة تفاصيل المتجر، بوابات الدفع، والملف الشخصي.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={handleSave} disabled={isSaving} className="bg-amber-500 hover:bg-amber-400 text-[#030810] rounded-xl h-9 px-6 font-bold shadow-[0_4px_20px_rgba(245,158,11,0.3)] transition-all w-full sm:w-auto text-sm">
            {isSaving ? 'جاري الحفظ...' : (
              <>
                <Save className="w-4 h-4 ms-1.5" />
                حفظ التغييرات
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full space-y-8">
        <TabsList className="bg-white/[0.02] p-1.5 border border-white/[0.05] rounded-xl w-full flex flex-col sm:flex-row h-auto gap-1">
          <TabsTrigger value="general" className="flex-1 rounded-lg data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 data-[state=active]:shadow-sm py-2 px-3 text-xs font-bold text-white/40 hover:text-white/80 transition-all w-full sm:w-auto gap-1.5 border border-transparent data-[state=active]:border-amber-500/20">
            <Store className="w-4 h-4" />
            إعدادات عامة
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex-1 rounded-lg data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 data-[state=active]:shadow-sm py-2 px-3 text-xs font-bold text-white/40 hover:text-white/80 transition-all w-full sm:w-auto gap-1.5 border border-transparent data-[state=active]:border-amber-500/20">
            <CreditCard className="w-4 h-4" />
            بوابات الدفع
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 rounded-lg data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 data-[state=active]:shadow-sm py-2 px-3 text-xs font-bold text-white/40 hover:text-white/80 transition-all w-full sm:w-auto gap-1.5 border border-transparent data-[state=active]:border-amber-500/20">
            <Bell className="w-4 h-4" />
            الإشعارات
          </TabsTrigger>
          <TabsTrigger value="texts" className="flex-1 rounded-lg data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-400 data-[state=active]:shadow-sm py-2 px-3 text-xs font-bold text-white/40 hover:text-white/80 transition-all w-full sm:w-auto gap-1.5 border border-transparent data-[state=active]:border-amber-500/20">
            <UserIcon className="w-4 h-4" />
            نصوص الواجهة
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className="border border-white/[0.05] rounded-2xl overflow-hidden bg-[#0A1628]">
            <div className="p-5 border-b border-white/[0.05]">
              <h2 className="text-base font-bold text-white/85">بيانات المتجر الأساسية</h2>
              <p className="text-[11px] text-white/40 mt-1 font-medium">هذه المعلومات ستكون مرئية للعملاء في واجهة المتجر.</p>
            </div>
            <div className="p-5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-white/50">اسم المتجر</Label>
                  <input 
                    value={settings.storeName}
                    onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                    className="w-full h-9 px-3 rounded-lg border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all text-sm outline-none focus:ring-2 focus:ring-amber-500/10 text-white/80" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-white/50">العملة الافتراضية</Label>
                  <select 
                    className="flex h-9 w-full rounded-lg border border-white/[0.08] hover:border-white/[0.15] bg-white/[0.04] focus:bg-white/[0.06] px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all text-white/80"
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  >
                    <option value="د.ع" className="bg-[#0A1628]">الدينار العراقي (د.ع)</option>
                    <option value="$" className="bg-[#0A1628]">الدولار الأمريكي ($)</option>
                  </select>
                </div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-xs font-bold text-white/50">رابط الشعار (Logo URL)</Label>
                  <div className="flex gap-3 items-center">
                    {settings.logoUrl && (
                      <div className="w-10 h-10 bg-white/[0.04] rounded-lg flex items-center justify-center shrink-0 border border-white/[0.08] overflow-hidden">
                        <img src={settings.logoUrl} alt="Logo Preview" className="w-full h-full object-contain p-1" />
                      </div>
                    )}
                    <input 
                      value={settings.logoUrl || ''}
                      onChange={(e) => setSettings({...settings, logoUrl: e.target.value})}
                      placeholder="https://..."
                      dir="rtl"
                      className="h-9 px-3 rounded-lg border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all text-start text-xs font-mono flex-1 outline-none focus:ring-2 focus:ring-amber-500/10 text-white/80 placeholder:text-white/20" 
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-white/50">البريد الإلكتروني للدعم</Label>
                  <input 
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({...settings, storeEmail: e.target.value})}
                    dir="rtl"
                    className="w-full h-9 px-3 rounded-lg border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all text-start font-mono text-sm outline-none focus:ring-2 focus:ring-amber-500/10 text-white/80" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-white/50">رقم الهاتف الأساسي</Label>
                  <input 
                    value={settings.storePhone}
                    onChange={(e) => setSettings({...settings, storePhone: e.target.value})}
                    dir="rtl"
                    className="w-full h-9 px-3 rounded-lg border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all text-start font-mono text-sm outline-none focus:ring-2 focus:ring-amber-500/10 text-white/80" 
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className="border border-white/[0.05] rounded-2xl overflow-hidden bg-[#0A1628]">
            <div className="p-5 border-b border-white/[0.05]">
              <h2 className="text-base font-bold text-white/85">بوابات وطرق الدفع</h2>
              <p className="text-[11px] text-white/40 mt-1 font-medium">التحكم في خيارات الدفع المتاحة للعملاء في صفحة إتمام الطلب.</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between p-4 border border-white/[0.08] rounded-xl bg-white/[0.02]">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-white/85">الدفع عند الاستلام (COD)</Label>
                  <p className="text-[11px] text-white/40 font-medium">السماح للعملاء بالدفع نقداً عند توصيل الطلب.</p>
                </div>
                <Switch 
                  checked={settings.allowCod}
                  onCheckedChange={(checked) => setSettings({...settings, allowCod: checked})}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className="border border-white/[0.05] rounded-2xl overflow-hidden bg-[#0A1628]">
            <div className="p-5 border-b border-white/[0.05]">
              <h2 className="text-base font-bold text-white/85">التنبيهات والإشعارات</h2>
              <p className="text-[11px] text-white/40 mt-1 font-medium">تخصيص الإشعارات التي تصلك وتصل لعملائك.</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between p-4 border border-white/[0.08] rounded-xl bg-white/[0.02]">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-white/85">تنبيهات الطلبات الجديدة</Label>
                  <p className="text-[11px] text-white/40 font-medium">استلام بريد إلكتروني وإشعار نظام فور تسجيل طلب جديد.</p>
                </div>
                <Switch 
                  checked={settings.orderNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, orderNotifications: checked})}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-white/[0.08] rounded-xl bg-white/[0.02]">
                <div className="space-y-1">
                  <Label className="text-sm font-bold text-white/85">الرسائل التسويقية للعملاء</Label>
                  <p className="text-[11px] text-white/40 font-medium">إرسال نشرة بريدية وتحديثات تلقائية للعملاء المسجلين.</p>
                </div>
                <Switch 
                  checked={settings.marketingEmails}
                  onCheckedChange={(checked) => setSettings({...settings, marketingEmails: checked})}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="texts" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
          <div className="border border-white/[0.05] rounded-2xl overflow-hidden bg-[#0A1628]">
            <div className="p-5 border-b border-white/[0.05]">
              <h2 className="text-base font-bold text-white/85">نصوص الواجهة الرئيسية</h2>
              <p className="text-[11px] text-white/40 mt-1 font-medium">التحكم في النصوص والعناوين التي تظهر للعملاء في الصفحة الرئيسية.</p>
            </div>
            <div className="p-5 space-y-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-white/50">شريط الإعلانات العلوي (Top Bar)</Label>
                <input 
                  value={settings.topBarText || ''}
                  onChange={(e) => setSettings({...settings, topBarText: e.target.value})}
                  className="w-full h-9 px-3 rounded-lg border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all text-sm outline-none focus:ring-2 focus:ring-amber-500/10 text-white/80" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-white/50">الشارة العلوية (Hero Badge)</Label>
                <input 
                  value={settings.heroBadge || ''}
                  onChange={(e) => setSettings({...settings, heroBadge: e.target.value})}
                  className="w-full h-9 px-3 rounded-lg border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all text-sm outline-none focus:ring-2 focus:ring-amber-500/10 text-white/80" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-white/50">العنوان الرئيسي (Hero Headline)</Label>
                <input 
                  value={settings.heroHeadline || ''}
                  onChange={(e) => setSettings({...settings, heroHeadline: e.target.value})}
                  className="w-full h-9 px-3 rounded-lg border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all text-sm outline-none focus:ring-2 focus:ring-amber-500/10 text-white/80" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-white/50">النص الفرعي (Hero Subheadline)</Label>
                <textarea 
                  value={settings.heroSubheadline || ''}
                  onChange={(e) => setSettings({...settings, heroSubheadline: e.target.value})}
                  rows={3}
                  className="w-full rounded-lg border border-white/[0.08] hover:border-white/[0.15] focus:border-amber-500/50 bg-white/[0.04] focus:bg-white/[0.06] transition-all text-sm outline-none focus:ring-2 focus:ring-amber-500/10 text-white/80 p-3 resize-none" 
                />
              </div>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </motion.div>
  )
}
