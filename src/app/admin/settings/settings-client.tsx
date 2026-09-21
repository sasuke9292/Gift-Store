'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Store, CreditCard, Bell, Save, Sparkles, Settings, Globe, Shield, Loader2 } from 'lucide-react'
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
      toast.success('تم حفظ إعدادات المتجر بنجاح')
    } else {
      toast.error(res.error || 'حدث خطأ أثناء حفظ الإعدادات')
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1C1917] tracking-tight">إعدادات المتجر</h1>
          <p className="text-sm text-[#78716C] mt-1">تخصيص هوية المتجر، بوابات الدفع، وإعدادات الواجهة الرئيسية</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving} 
          className="text-white rounded-xl h-11 px-6 font-bold shadow-md hover:-translate-y-0.5 transition-all w-full sm:w-auto text-sm cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #A07850 100%)' }}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin ms-2" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 ms-2" />
              حفظ الإعدادات
            </>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="w-full space-y-6">
        <TabsList className="bg-white p-1.5 border border-[#E8E4DF] rounded-2xl w-full flex flex-col sm:flex-row h-auto gap-1 shadow-sm">
          <TabsTrigger 
            value="general" 
            className="flex-1 rounded-xl data-[state=active]:bg-[#1C1917] data-[state=active]:text-white py-3 px-4 text-xs font-bold text-[#78716C] hover:text-[#1C1917] transition-all w-full sm:w-auto gap-2"
          >
            <Store className="w-4 h-4 text-[#C9A96E]" />
            البيانات الأساسية
          </TabsTrigger>
          <TabsTrigger 
            value="texts" 
            className="flex-1 rounded-xl data-[state=active]:bg-[#1C1917] data-[state=active]:text-white py-3 px-4 text-xs font-bold text-[#78716C] hover:text-[#1C1917] transition-all w-full sm:w-auto gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#C9A96E]" />
            الواجهة والعروض
          </TabsTrigger>
          <TabsTrigger 
            value="payment" 
            className="flex-1 rounded-xl data-[state=active]:bg-[#1C1917] data-[state=active]:text-white py-3 px-4 text-xs font-bold text-[#78716C] hover:text-[#1C1917] transition-all w-full sm:w-auto gap-2"
          >
            <CreditCard className="w-4 h-4 text-[#C9A96E]" />
            طرق الدفع
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="flex-1 rounded-xl data-[state=active]:bg-[#1C1917] data-[state=active]:text-white py-3 px-4 text-xs font-bold text-[#78716C] hover:text-[#1C1917] transition-all w-full sm:w-auto gap-2"
          >
            <Bell className="w-4 h-4 text-[#C9A96E]" />
            الإشعارات
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="border border-[#E8E4DF] rounded-3xl overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="p-6 border-b border-[#E8E4DF] bg-[#FAFAF8]">
              <h2 className="text-base font-black text-[#1C1917]">بيانات المتجر الأساسية</h2>
              <p className="text-xs text-[#78716C] mt-1 font-medium">هذه المعلومات تظهر للعملاء في الترويسة والتذييل والفواتير.</p>
            </div>
            <div className="p-6 sm:p-7 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">اسم المتجر *</Label>
                  <Input 
                    value={settings.storeName} 
                    onChange={e => setSettings({...settings, storeName: e.target.value})}
                    className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm focus:border-[#C9A96E]/50 focus:bg-white"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رمز العملة *</Label>
                  <Input 
                    value={settings.currency} 
                    onChange={e => setSettings({...settings, currency: e.target.value})}
                    className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm focus:border-[#C9A96E]/50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">البريد الإلكتروني للتواصل</Label>
                  <Input 
                    type="email"
                    value={settings.storeEmail || ''} 
                    onChange={e => setSettings({...settings, storeEmail: e.target.value})}
                    className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                    dir="ltr"
                    placeholder="info@giftstore.iq"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رقم الهاتف وخدمة العملاء</Label>
                  <Input 
                    value={settings.storePhone || ''} 
                    onChange={e => setSettings({...settings, storePhone: e.target.value})}
                    className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                    dir="ltr"
                    placeholder="+964 770 123 4567"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">رابط شعار المتجر (Logo URL)</Label>
                <Input 
                  value={settings.logoUrl || ''} 
                  onChange={e => setSettings({...settings, logoUrl: e.target.value})}
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                  dir="ltr"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Storefront Texts & Hero */}
        <TabsContent value="texts">
          <div className="border border-[#E8E4DF] rounded-3xl overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="p-6 border-b border-[#E8E4DF] bg-[#FAFAF8]">
              <h2 className="text-base font-black text-[#1C1917]">نصوص الواجهة الرئيسية والعروض</h2>
              <p className="text-xs text-[#78716C] mt-1 font-medium">تخصيص شريط الإعلانات العلوي وقسم البانر الرئيسي للمتجر.</p>
            </div>
            <div className="p-6 sm:p-7 space-y-5">
              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">شريط الإعلانات العلوي (Top Announcement Bar)</Label>
                <Input 
                  value={settings.topBarText || ''} 
                  onChange={e => setSettings({...settings, topBarText: e.target.value})}
                  placeholder="مثال: شحن مجاني لجميع الطلبات أكثر من 100,000 د.ع 🎁"
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">شارة البانر الترويجية (Hero Badge)</Label>
                <Input 
                  value={settings.heroBadge || ''} 
                  onChange={e => setSettings({...settings, heroBadge: e.target.value})}
                  placeholder="مثال: التشكيلة الملكية الفاخرة 2026 ✨"
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">العنوان الرئيسي للبانر (Hero Headline)</Label>
                <Input 
                  value={settings.heroHeadline || ''} 
                  onChange={e => setSettings({...settings, heroHeadline: e.target.value})}
                  placeholder="مثال: لحظاتك الثمينة تستحق أرقى الهدايا"
                  className="h-11 rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm font-bold"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-[#1C1917] mb-1.5 block">العنوان الفرعي للبانر (Hero Subheadline)</Label>
                <Textarea 
                  rows={3}
                  value={settings.heroSubheadline || ''} 
                  onChange={e => setSettings({...settings, heroSubheadline: e.target.value})}
                  placeholder="مثال: نجمع لك أرقى الهدايا المختارة بعناية فائقة لتصنع ذكريات لا تُنسى مع من تحب."
                  className="rounded-xl bg-[#FAFAF8] border-[#E8E4DF] text-sm resize-none"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <div className="border border-[#E8E4DF] rounded-3xl overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="p-6 border-b border-[#E8E4DF] bg-[#FAFAF8]">
              <h2 className="text-base font-black text-[#1C1917]">طرق الدفع والتحصيل</h2>
              <p className="text-xs text-[#78716C] mt-1 font-medium">التحكم في خيارات الدفع المتاحة للزبائن عند إتمام الطلب.</p>
            </div>
            <div className="p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]">
                <div>
                  <p className="text-sm font-bold text-[#1C1917]">الدفع عند الاستلام (COD)</p>
                  <p className="text-xs text-[#78716C]">السماح للزبائن بالدفع نقداً لمندوب التوصيل عند استلام الهدية</p>
                </div>
                <Switch 
                  checked={settings.allowCod}
                  onCheckedChange={val => setSettings({...settings, allowCod: val})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]">
                <div>
                  <p className="text-sm font-bold text-[#1C1917]">الدفع الإلكتروني (بطاقات ماستركارد / فيزا / زين كاش)</p>
                  <p className="text-xs text-[#78716C]">تمكين بوابات الدفع الإلكتروني المباشر في صفحة الدفع</p>
                </div>
                <Switch 
                  checked={settings.allowOnlinePayment}
                  onCheckedChange={val => setSettings({...settings, allowOnlinePayment: val})}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <div className="border border-[#E8E4DF] rounded-3xl overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="p-6 border-b border-[#E8E4DF] bg-[#FAFAF8]">
              <h2 className="text-base font-black text-[#1C1917]">إعدادات الإشعارات والتنبيهات</h2>
              <p className="text-xs text-[#78716C] mt-1 font-medium">إدارة إشعارات الطلبات الجديدة والتنبيهات البريدية.</p>
            </div>
            <div className="p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]">
                <div>
                  <p className="text-sm font-bold text-[#1C1917]">إشعارات الطلبات الجديدة</p>
                  <p className="text-xs text-[#78716C]">تنبيه الإدارة فور ورود أي طلب جديد من خلال لوحة التحكم</p>
                </div>
                <Switch 
                  checked={settings.orderNotifications}
                  onCheckedChange={val => setSettings({...settings, orderNotifications: val})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAF8] border border-[#E8E4DF]">
                <div>
                  <p className="text-sm font-bold text-[#1C1917]">رسائل التحديثات التسويقية</p>
                  <p className="text-xs text-[#78716C]">إرسال عروض ترويجية للزبائن المسجلين في القائمة البريدية</p>
                </div>
                <Switch 
                  checked={settings.marketingEmails}
                  onCheckedChange={val => setSettings({...settings, marketingEmails: val})}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
